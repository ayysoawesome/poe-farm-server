# Sync Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make internal synchronization fail closed, prevent concurrent synchronization runs with an expiring D1 lease, and replace per-item latest-price reads with bounded bulk D1 queries.

**Architecture:** Keep the existing Hono/Drizzle service structure. Authentication remains middleware-based, synchronization coordination is isolated in a D1 lease repository, and bulk latest-price loading is isolated in the price repository. Both manual and scheduled entry points share the same service-level lease.

**Tech Stack:** TypeScript, Cloudflare Workers, Hono, D1, Drizzle ORM, Workers KV, Vitest Workers pool.

---

## File Structure

- Modify `src/env.ts`: make `CRON_SECRET` a required application binding.
- Modify `src/routes/sync.routes.ts`: fail closed and export middleware for focused testing.
- Create `test/sync.routes.test.ts`: test missing configuration, invalid credentials, and valid credentials.
- Modify `src/db/schema.ts`: define the `sync_leases` table.
- Create `src/repositories/sync-lease.repository.ts`: atomic acquire and owner-checked release using the D1 binding.
- Modify `src/services/sync.service.ts`: coordinate full sync and recalculation through one lease.
- Create `test/sync-lease.repository.test.ts`: exercise lease behavior against local D1.
- Modify `src/repositories/price.repository.ts`: add bounded bulk latest-price loading.
- Modify `src/services/price.service.ts`: use one service-level bulk load and no reads in nested loops.
- Create `test/price.repository.test.ts`: verify latest-row selection for item/league pairs.
- Create a Drizzle migration for `sync_leases`.

### Task 1: Fail-closed internal authentication

**Files:**
- Modify: `src/env.ts`
- Modify: `src/routes/sync.routes.ts`
- Create: `test/sync.routes.test.ts`

- [ ] **Step 1: Write failing route authentication tests**

Create a focused Hono test app using the exported middleware:

```ts
import { Hono } from "hono";
import { describe, expect, it } from "vitest";

import type { AppBindings, Env } from "../src/env";
import { requireCronSecret } from "../src/routes/sync.routes";

const createApp = () =>
  new Hono<AppBindings>()
    .onError((error, context) => {
      const status =
        error instanceof Error && "status" in error
          ? (error.status as 401 | 503)
          : 500;
      const code =
        error instanceof Error && "code" in error
          ? String(error.code)
          : "INTERNAL_SERVER_ERROR";
      return context.json({ error: { code } }, status);
    })
    .use("*", requireCronSecret)
    .post("/", (context) => context.json({ ok: true }));

const env = (secret: string | undefined): Env =>
  ({
    CRON_SECRET: secret,
  }) as Env;

describe("requireCronSecret", () => {
  it("returns 503 when CRON_SECRET is not configured", async () => {
    const response = await createApp().request("/", { method: "POST" }, env(undefined));
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      error: { code: "INTERNAL_SECRET_NOT_CONFIGURED" }
    });
  });

  it("returns 401 when the supplied secret is incorrect", async () => {
    const response = await createApp().request(
      "/",
      { method: "POST", headers: { "x-cron-secret": "wrong" } },
      env("expected")
    );
    expect(response.status).toBe(401);
  });

  it("continues when the supplied secret is correct", async () => {
    const response = await createApp().request(
      "/",
      { method: "POST", headers: { "x-cron-secret": "expected" } },
      env("expected")
    );
    expect(response.status).toBe(200);
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```powershell
pnpm.cmd exec vitest run test/sync.routes.test.ts
```

Expected: FAIL because `requireCronSecret` is not exported and missing configuration currently reaches the handler.

- [ ] **Step 3: Implement fail-closed middleware**

Change the environment type:

```ts
export type Env = Cloudflare.Env & {
  CRON_SECRET: string;
};
```

Export the middleware and reject absent or empty configuration before comparing secrets:

```ts
export const requireCronSecret = async (
  context: Context<AppBindings>,
  next: Next
): Promise<void> => {
  const expected = context.env.CRON_SECRET;
  if (expected === undefined || expected.length === 0) {
    throw new AppError(
      503,
      "INTERNAL_SECRET_NOT_CONFIGURED",
      "Internal endpoint authentication is not configured"
    );
  }
  if (!(await secretsMatch(context.req.header("x-cron-secret"), expected))) {
    throw new AppError(401, "UNAUTHORIZED", "Invalid or missing cron secret");
  }
  await next();
};
```

- [ ] **Step 4: Run focused and existing tests**

Run:

```powershell
pnpm.cmd exec vitest run test/sync.routes.test.ts test/security.test.ts
```

Expected: all tests PASS.

### Task 2: Add an atomic D1 synchronization lease

**Files:**
- Modify: `src/db/schema.ts`
- Create: `src/repositories/sync-lease.repository.ts`
- Create: `test/sync-lease.repository.test.ts`
- Create: `drizzle/migrations/0001_*.sql`

- [ ] **Step 1: Write failing D1 repository tests**

Use `env.DB` from `cloudflare:test`, create/clear `sync_leases` in setup, then verify:

```ts
import { env } from "cloudflare:test";
import { beforeEach, describe, expect, it } from "vitest";

import {
  acquireSyncLease,
  releaseSyncLease
} from "../src/repositories/sync-lease.repository";

beforeEach(async () => {
  await env.DB.exec(`
    CREATE TABLE IF NOT EXISTS sync_leases (
      name TEXT PRIMARY KEY NOT NULL,
      owner_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    DELETE FROM sync_leases;
  `);
});

describe("sync lease repository", () => {
  it("allows only one owner while a lease is active", async () => {
    await expect(acquireSyncLease(env.DB, "full-sync", "owner-a", 1000, 2000))
      .resolves.toBe(true);
    await expect(acquireSyncLease(env.DB, "full-sync", "owner-b", 1500, 2500))
      .resolves.toBe(false);
  });

  it("allows a new owner after expiry", async () => {
    await acquireSyncLease(env.DB, "full-sync", "owner-a", 1000, 2000);
    await expect(acquireSyncLease(env.DB, "full-sync", "owner-b", 2000, 3000))
      .resolves.toBe(true);
  });

  it("does not let an old owner release a new owner's lease", async () => {
    await acquireSyncLease(env.DB, "full-sync", "owner-a", 1000, 2000);
    await acquireSyncLease(env.DB, "full-sync", "owner-b", 2000, 3000);
    await releaseSyncLease(env.DB, "full-sync", "owner-a");
    await expect(acquireSyncLease(env.DB, "full-sync", "owner-c", 2500, 3500))
      .resolves.toBe(false);
  });
});
```

- [ ] **Step 2: Run the repository test and verify RED**

Run:

```powershell
pnpm.cmd exec vitest run test/sync-lease.repository.test.ts
```

Expected: FAIL because the repository does not exist.

- [ ] **Step 3: Add the schema and migration**

Add:

```ts
export const syncLeases = sqliteTable("sync_leases", {
  name: text("name").primaryKey(),
  ownerId: text("owner_id").notNull(),
  expiresAt: integer("expires_at").notNull(),
  updatedAt: integer("updated_at").notNull()
});
```

Generate a migration with:

```powershell
pnpm.cmd db:generate
```

Expected: a new migration creating `sync_leases`.

- [ ] **Step 4: Implement atomic acquire and owner-checked release**

Create `src/repositories/sync-lease.repository.ts`:

```ts
export const acquireSyncLease = async (
  database: D1Database,
  name: string,
  ownerId: string,
  now: number,
  expiresAt: number
): Promise<boolean> => {
  const row = await database
    .prepare(`
      INSERT INTO sync_leases (name, owner_id, expires_at, updated_at)
      VALUES (?1, ?2, ?3, ?4)
      ON CONFLICT(name) DO UPDATE SET
        owner_id = excluded.owner_id,
        expires_at = excluded.expires_at,
        updated_at = excluded.updated_at
      WHERE sync_leases.expires_at <= ?4
      RETURNING owner_id
    `)
    .bind(name, ownerId, expiresAt, now)
    .first<{ owner_id: string }>();

  return row?.owner_id === ownerId;
};

export const releaseSyncLease = async (
  database: D1Database,
  name: string,
  ownerId: string
): Promise<void> => {
  await database
    .prepare("DELETE FROM sync_leases WHERE name = ?1 AND owner_id = ?2")
    .bind(name, ownerId)
    .run();
};
```

- [ ] **Step 5: Run the repository test and verify GREEN**

Run:

```powershell
pnpm.cmd exec vitest run test/sync-lease.repository.test.ts
```

Expected: all lease repository tests PASS.

### Task 3: Coordinate full synchronization and recalculation

**Files:**
- Modify: `src/services/sync.service.ts`
- Create: `test/sync.service.test.ts`

- [ ] **Step 1: Write failing service-level lease tests**

Create a test that initializes the required D1 tables, acquires `full-sync` for
another owner, and asserts both public operations reject:

```ts
await acquireSyncLease(env.DB, "full-sync", "existing", now, now + 60_000);

await expect(new SyncService(env).runFullSync()).rejects.toMatchObject({
  status: 409,
  code: "SYNC_ALREADY_RUNNING"
});

await expect(new SyncService(env).recalculateProfits()).rejects.toMatchObject({
  status: 409,
  code: "SYNC_ALREADY_RUNNING"
});
```

Add a failure-path test by using an environment whose D1 binding lacks the
application tables; after `runFullSync()` rejects, assert a new owner can
acquire the lease.

- [ ] **Step 2: Run the service test and verify RED**

Run:

```powershell
pnpm.cmd exec vitest run test/sync.service.test.ts
```

Expected: FAIL because service methods do not acquire a lease.

- [ ] **Step 3: Implement shared service-level lease coordination**

Add constants:

```ts
const SYNC_LEASE_NAME = "full-sync";
const SYNC_LEASE_DURATION_MS = 15 * 60 * 1000;
```

Add a private helper:

```ts
private async withSyncLease<T>(operation: () => Promise<T>): Promise<T> {
  const ownerId = createId("lease");
  const acquiredAt = nowMs();
  const acquired = await acquireSyncLease(
    this.env.DB,
    SYNC_LEASE_NAME,
    ownerId,
    acquiredAt,
    acquiredAt + SYNC_LEASE_DURATION_MS
  );
  if (!acquired) {
    throw new AppError(409, "SYNC_ALREADY_RUNNING", "Synchronization is already running");
  }

  let operationError: unknown;
  try {
    return await operation();
  } catch (error) {
    operationError = error;
    throw error;
  } finally {
    try {
      await releaseSyncLease(this.env.DB, SYNC_LEASE_NAME, ownerId);
    } catch (releaseError) {
      console.error(JSON.stringify({
        message: "Failed to release synchronization lease",
        error: releaseError instanceof Error ? releaseError.message : String(releaseError)
      }));
      if (operationError === undefined) throw releaseError;
    }
  }
}
```

Make `recalculateProfits()` call `withSyncLease`, and make `runFullSync()` call
`withSyncLease` while invoking `new ProfitService(this.env).recalculateAll()`
directly to avoid nested lease acquisition.

- [ ] **Step 4: Run service and route tests**

Run:

```powershell
pnpm.cmd exec vitest run test/sync.service.test.ts test/sync.routes.test.ts
```

Expected: all tests PASS.

### Task 4: Replace N×M price reads with bounded bulk loading

**Files:**
- Modify: `src/repositories/price.repository.ts`
- Modify: `src/services/price.service.ts`
- Create: `test/price.repository.test.ts`

- [ ] **Step 1: Write failing bulk latest-price repository tests**

Create required `leagues`, `items`, and `item_prices` tables in local D1. Insert
older and newer rows for two item/league pairs, including identical timestamps
with different IDs. Assert:

```ts
const prices = await findLatestPricesForItemsAndLeagues(
  env.DB,
  ["item-a", "item-b"],
  ["league-a", "league-b"]
);

expect(
  prices.map((price) => [price.itemId, price.leagueId, price.id])
).toEqual([
  ["item-a", "league-a", "price-new"],
  ["item-b", "league-b", "price-z"]
]);
```

Also assert empty item or league input returns `[]`.

- [ ] **Step 2: Run the repository test and verify RED**

Run:

```powershell
pnpm.cmd exec vitest run test/price.repository.test.ts
```

Expected: FAIL because `findLatestPricesForItemsAndLeagues` does not exist.

- [ ] **Step 3: Implement bounded bulk latest-price loading**

Add a row type for snake-case D1 results and a mapper to `NewItemPrice`. Chunk
item IDs so each query remains under a conservative 90 bound parameters:

```ts
const MAX_QUERY_PARAMETERS = 90;

export const findLatestPricesForItemsAndLeagues = async (
  database: D1Database,
  itemIds: readonly string[],
  leagueIds: readonly string[]
): Promise<NewItemPrice[]> => {
  const uniqueItemIds = [...new Set(itemIds)];
  const uniqueLeagueIds = [...new Set(leagueIds)];
  if (uniqueItemIds.length === 0 || uniqueLeagueIds.length === 0) return [];

  const itemChunkSize = Math.max(1, MAX_QUERY_PARAMETERS - uniqueLeagueIds.length);
  const results: NewItemPrice[] = [];

  for (let offset = 0; offset < uniqueItemIds.length; offset += itemChunkSize) {
    const itemChunk = uniqueItemIds.slice(offset, offset + itemChunkSize);
    const itemPlaceholders = itemChunk.map(() => "?").join(", ");
    const leaguePlaceholders = uniqueLeagueIds.map(() => "?").join(", ");
    const query = `
      SELECT id, item_id, league_id, chaos_value, divine_value, source,
             captured_at, created_at
      FROM (
        SELECT *, ROW_NUMBER() OVER (
          PARTITION BY item_id, league_id
          ORDER BY captured_at DESC, id DESC
        ) AS row_number
        FROM item_prices
        WHERE item_id IN (${itemPlaceholders})
          AND league_id IN (${leaguePlaceholders})
      )
      WHERE row_number = 1
      ORDER BY item_id, league_id
    `;
    const response = await database
      .prepare(query)
      .bind(...itemChunk, ...uniqueLeagueIds)
      .all<LatestPriceRow>();
    results.push(...response.results.map(mapLatestPriceRow));
  }

  return results;
};
```

If league IDs themselves exceed the parameter budget, chunk both dimensions so
every query has at most 90 bindings.

- [ ] **Step 4: Run the repository test and verify GREEN**

Run:

```powershell
pnpm.cmd exec vitest run test/price.repository.test.ts
```

Expected: all bulk query tests PASS.

- [ ] **Step 5: Update PriceService**

Replace nested `findLatestItemPrice()` calls with one service-level call:

```ts
const latestPrices = await findLatestPricesForItemsAndLeagues(
  this.env.DB,
  allItems.map((item) => item.id),
  activeLeagues.map((league) => league.id)
);
const latestPriceByPair = new Map(
  latestPrices.map((price) => [`${price.itemId}\0${price.leagueId}`, price])
);
```

Inside the loops, read only from `latestPriceByPair`. Keep the existing skip
behavior and bulk insert.

- [ ] **Step 6: Run focused tests**

Run:

```powershell
pnpm.cmd exec vitest run test/price.repository.test.ts test/profit.service.test.ts
```

Expected: all tests PASS.

### Task 5: Verify the complete Worker

**Files:**
- Review all modified files and generated migration.

- [ ] **Step 1: Run formatting-independent diff review**

Run:

```powershell
git diff --check
git diff -- src test drizzle wrangler.jsonc
```

Expected: no whitespace errors; diff contains only scoped hardening changes.

- [ ] **Step 2: Run the complete test suite**

Run:

```powershell
pnpm.cmd test
```

Expected: all test files and tests PASS with zero failures.

- [ ] **Step 3: Run TypeScript and Cloudflare type checks**

Run:

```powershell
pnpm.cmd typecheck
pnpm.cmd cf:types:check
```

Expected: both commands exit successfully; generated bindings are current.

- [ ] **Step 4: Run Wrangler dry-run deployment**

Run:

```powershell
pnpm.cmd exec wrangler deploy --dry-run
```

Expected: bundle builds and all D1/KV/variable bindings are listed; no deployment occurs.

- [ ] **Step 5: Report migration requirement**

State that `pnpm db:migrate:remote` must be run before deploying the Worker
version that uses `sync_leases`. Do not apply the remote migration without
explicit authorization.
