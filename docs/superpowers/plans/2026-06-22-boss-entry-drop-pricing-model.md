# Boss Entry, Drop, and Pricing Model Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current Uber flag, entry-cost, variable-quantity drop, and duplicated Divine-price model with independent bosses, fixed item-based entry components, nullable per-boss drop chances, coherent synchronized price sets, and backend-generated Chaos/Divine API values.

**Architecture:** D1 remains the source of truth. Every price row and resulting profit snapshot belongs to one `sync_runs` row; calculation APIs require that sync-run ID so prices from different synchronization cycles cannot mix. Chaos values are persisted, Divine values are derived by backend response mappers from the Divine Orb Chaos rate stored in each snapshot.

**Tech Stack:** TypeScript, Cloudflare Workers, Hono, D1, Drizzle ORM, Zod, KV, Vitest, Wrangler, pnpm.

---

## File Structure

The implementation keeps the existing route/service/repository layering.

- `src/db/schema.ts`: constrained D1 schema and renamed entry-component table.
- `src/schemas/item.schema.ts`: canonical item-category enum.
- `src/schemas/money.schema.ts`: shared API money object and conversion helper.
- `src/schemas/boss.schema.ts`: boss-detail response types without `isUber`.
- `src/schemas/profit.schema.ts`: persisted snapshot and public profit response schemas.
- `src/repositories/boss.repository.ts`: entry-component and nullable-drop queries.
- `src/repositories/price.repository.ts`: coherent price-set queries by sync run.
- `src/repositories/profit.repository.ts`: sync-run-aware snapshot persistence.
- `src/services/price.service.ts`: writes one price set under a supplied sync-run ID.
- `src/services/profit.service.ts`: nullable-drop calculation and snapshot creation.
- `src/services/boss.service.ts`: priced boss-detail composition.
- `src/services/sync.service.ts`: owns and passes the sync-run ID through the full pipeline.
- `src/utils/cache.ts`: versioned profit cache keys.
- `src/db/seed.ts`: seed records aligned with the new model.
- `drizzle/migrations/0003_*.sql`: generated schema migration, reviewed and corrected for data preservation.
- Tests remain focused by layer; new response-mapping tests go in `test/money.test.ts` and `test/boss.service.test.ts`.

## Task 1: Define the constrained schema and migration

**Files:**
- Modify: `src/db/schema.ts`
- Modify: `src/schemas/item.schema.ts`
- Create: generated `drizzle/migrations/0003_*.sql`
- Modify: `test/security.test.ts`

- [ ] **Step 1: Add failing schema-validation tests**

Add tests that execute inserts against the migrated D1 schema:

```ts
it.each(["currency", "fragment", "equipment", "gem", "map", "other"])(
  "accepts item category %s",
  async (category) => {
    await expect(
      env.DB.prepare(
        "INSERT INTO items (id, name, category, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
      ).bind(`item-${category}`, category, category, 1, 1).run()
    ).resolves.toBeDefined();
  }
);

it("rejects an unknown item category", async () => {
  await expect(
    env.DB.prepare(
      "INSERT INTO items (id, name, category, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
    ).bind("bad-item", "Bad Item", "unique", 1, 1).run()
  ).rejects.toThrow();
});

it("rejects duplicate entry components and drops", async () => {
  await insertBossItemFixtures();
  await env.DB.prepare(
    "INSERT INTO boss_entry_components (id, boss_id, item_id, quantity, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).bind("entry-1", "boss-1", "item-1", 1, 1, 1).run();
  await expect(
    env.DB.prepare(
      "INSERT INTO boss_entry_components (id, boss_id, item_id, quantity, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind("entry-2", "boss-1", "item-1", 2, 1, 1).run()
  ).rejects.toThrow();
});

it.each([-0.01, 1.01])("rejects drop rate %s", async (dropRate) => {
  await insertBossItemFixtures();
  await expect(
    env.DB.prepare(
      "INSERT INTO boss_drops (id, boss_id, item_id, drop_rate, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(`drop-${dropRate}`, "boss-1", "item-1", dropRate, 1, 1).run()
  ).rejects.toThrow();
});
```

- [ ] **Step 2: Run the focused tests and confirm failure**

Run:

```powershell
pnpm.cmd test -- test/security.test.ts
```

Expected: failures because `boss_entry_components`, constrained categories, and `drop_rate` do not exist yet.

- [ ] **Step 3: Replace schema definitions**

In `src/schemas/item.schema.ts`, export the shared category values:

```ts
export const itemCategories = [
  "currency",
  "fragment",
  "equipment",
  "gem",
  "map",
  "other"
] as const;

export const itemCategorySchema = z.enum(itemCategories);
export type ItemCategory = z.infer<typeof itemCategorySchema>;
```

Update `itemSchema.category` to `itemCategorySchema`.

In `src/db/schema.ts`, import `check`, `sql`, and define:

```ts
export const items = sqliteTable(
  "items",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    category: text("category", {
      enum: ["currency", "fragment", "equipment", "gem", "map", "other"]
    }).notNull(),
    iconUrl: text("icon_url"),
    tradeUrl: text("trade_url"),
    ...timestamps
  },
  (table) => [
    check(
      "items_category_check",
      sql`${table.category} in ('currency', 'fragment', 'equipment', 'gem', 'map', 'other')`
    )
  ]
);
```

Remove `bosses.isUber`. Replace `bossEntryCosts` with:

```ts
export const bossEntryComponents = sqliteTable(
  "boss_entry_components",
  {
    id: text("id").primaryKey(),
    bossId: text("boss_id").notNull().references(() => bosses.id),
    itemId: text("item_id").notNull().references(() => items.id),
    quantity: real("quantity").notNull(),
    ...timestamps
  },
  (table) => [
    uniqueIndex("boss_entry_components_boss_item_unique").on(
      table.bossId,
      table.itemId
    ),
    check("boss_entry_components_quantity_check", sql`${table.quantity} > 0`)
  ]
);
```

Replace `bossDrops` fields and constraints:

```ts
export const bossDrops = sqliteTable(
  "boss_drops",
  {
    id: text("id").primaryKey(),
    bossId: text("boss_id").notNull().references(() => bosses.id),
    itemId: text("item_id").notNull().references(() => items.id),
    dropRate: real("drop_rate"),
    notes: text("notes"),
    ...timestamps
  },
  (table) => [
    uniqueIndex("boss_drops_boss_item_unique").on(table.bossId, table.itemId),
    check(
      "boss_drops_rate_check",
      sql`${table.dropRate} is null or (${table.dropRate} >= 0 and ${table.dropRate} <= 1)`
    )
  ]
);
```

Remove `itemPrices.divineValue`, add non-negative check and `syncRunId` foreign key:

```ts
syncRunId: text("sync_run_id").notNull().references(() => syncRuns.id),
chaosValue: real("chaos_value").notNull()
```

Because `syncRuns` is referenced by `itemPrices`, declare `syncRuns` before `itemPrices`.

Add to `profitSnapshots`:

```ts
syncRunId: text("sync_run_id").notNull().references(() => syncRuns.id),
divineOrbChaosValue: real("divine_orb_chaos_value").notNull(),
isComplete: integer("is_complete", { mode: "boolean" }).notNull(),
unknownDropCount: integer("unknown_drop_count").notNull()
```

Add checks for positive Divine rate and non-negative unknown count.

- [ ] **Step 4: Generate and inspect the migration**

Run:

```powershell
pnpm.cmd db:generate
```

Expected: one new `0003_*.sql` migration and updated Drizzle metadata.

Inspect the SQL. It must explicitly preserve compatible data:

```sql
INSERT INTO boss_entry_components (...)
SELECT ... FROM boss_entry_costs;

INSERT INTO boss_drops (..., drop_rate, ...)
SELECT ..., estimated_drop_rate, ... FROM boss_drops_old;
```

For existing price/snapshot rows that cannot satisfy non-null `sync_run_id`,
create one migration sync run such as `migration-legacy-price-set`, copy rows
under it, derive `divine_orb_chaos_value` from the latest seeded Divine Orb
price, and set legacy snapshot completeness to true with zero unknown drops.
If no Divine Orb row exists, fail the migration instead of inventing a rate.

- [ ] **Step 5: Apply migrations to a clean local database**

Remove only local Wrangler test state through Wrangler's migration workflow;
do not delete project files manually. Run:

```powershell
pnpm.cmd db:migrate:local
pnpm.cmd test -- test/security.test.ts
```

Expected: migration applies and all focused constraint tests pass.

- [ ] **Step 6: Commit**

```powershell
git add src/db/schema.ts src/schemas/item.schema.ts test/security.test.ts drizzle/migrations drizzle/migrations/meta
git commit -m "feat: constrain boss entry drop and price schema"
```

## Task 2: Implement coherent synchronized price sets

**Files:**
- Modify: `src/repositories/price.repository.ts`
- Modify: `src/services/price.service.ts`
- Modify: `test/price.repository.test.ts`

- [ ] **Step 1: Rewrite test table fixtures and add sync-set tests**

Change the test `item_prices` table to include `sync_run_id` and remove
`divine_value`. Add:

```ts
it("loads prices only from the requested sync run", async () => {
  await insertPrices([
    {
      id: "run-a-item",
      syncRunId: "sync-a",
      itemId: "item-a",
      leagueId: "league-1",
      chaosValue: 10,
      capturedAt: 100
    },
    {
      id: "run-b-item",
      syncRunId: "sync-b",
      itemId: "item-a",
      leagueId: "league-1",
      chaosValue: 20,
      capturedAt: 200
    }
  ]);

  await expect(
    findPricesBySyncRun(
      env.DB,
      "sync-a",
      ["item-a"],
      "league-1"
    )
  ).resolves.toMatchObject([
    { syncRunId: "sync-a", itemId: "item-a", chaosValue: 10 }
  ]);
});
```

Add a `PriceService` test asserting that every inserted row receives the
supplied sync-run ID and identical `capturedAt`.

- [ ] **Step 2: Run focused tests**

```powershell
pnpm.cmd test -- test/price.repository.test.ts
```

Expected: compile failures for `findPricesBySyncRun` and changed price fields.

- [ ] **Step 3: Implement repository APIs**

Keep `findLatestPricesForItemsAndLeagues` only for obtaining previous provider
inputs. Remove all `divineValue` SQL projections.

Add:

```ts
export const findPricesBySyncRun = async (
  database: D1Database,
  syncRunId: string,
  itemIds: readonly string[],
  leagueId: string
): Promise<ItemPrice[]> => {
  const uniqueItemIds = [...new Set(itemIds)];
  if (uniqueItemIds.length === 0) return [];

  const rows: ItemPrice[] = [];
  for (const itemIdChunk of chunk(uniqueItemIds, MAX_QUERY_BINDINGS - 2)) {
    const placeholders = itemIdChunk.map(() => "?").join(", ");
    const result = await database
      .prepare(
        `SELECT
          id,
          sync_run_id AS syncRunId,
          item_id AS itemId,
          league_id AS leagueId,
          chaos_value AS chaosValue,
          source,
          captured_at AS capturedAt,
          created_at AS createdAt
        FROM item_prices
        WHERE sync_run_id = ?
          AND league_id = ?
          AND item_id IN (${placeholders})`
      )
      .bind(syncRunId, leagueId, ...itemIdChunk)
      .all<ItemPrice>();
    rows.push(...result.results);
  }
  return rows.sort((left, right) => compareStrings(left.itemId, right.itemId));
};
```

- [ ] **Step 4: Pass the sync-run ID into PriceService**

Change:

```ts
async syncPrices(syncRunId: string): Promise<number>
```

Every inserted price must include:

```ts
{
  id: createId("price"),
  syncRunId,
  itemId: item.id,
  leagueId: league.id,
  chaosValue,
  source: provider.name,
  capturedAt,
  createdAt: capturedAt
}
```

Special-case Chaos Orb by stable ID:

```ts
const CHAOS_ORB_ITEM_ID = "chaos-orb";
const chaosValue =
  item.id === CHAOS_ORB_ITEM_ID
    ? 1
    : provider.getChaosValue(...);
```

- [ ] **Step 5: Run focused tests**

```powershell
pnpm.cmd test -- test/price.repository.test.ts
```

Expected: all price repository and service tests pass.

- [ ] **Step 6: Commit**

```powershell
git add src/repositories/price.repository.ts src/services/price.service.ts test/price.repository.test.ts
git commit -m "feat: group item prices by sync run"
```

## Task 3: Replace profit calculation inputs and completeness semantics

**Files:**
- Modify: `src/services/profit.service.ts`
- Modify: `src/schemas/profit.schema.ts`
- Modify: `test/profit.service.test.ts`

- [ ] **Step 1: Replace calculation tests**

Use inputs without min/max quantities:

```ts
const baseInput: ProfitCalculationInput = {
  entryComponents: [
    { itemId: "entry-a", itemName: "Entry A", quantity: 1 },
    { itemId: "entry-b", itemName: "Entry B", quantity: 2 }
  ],
  drops: [
    { itemId: "known", itemName: "Known", dropRate: 0.25 },
    { itemId: "unknown", itemName: "Unknown", dropRate: null }
  ],
  prices: new Map([
    ["entry-a", 10],
    ["entry-b", 20],
    ["known", 100]
  ])
};

it("calculates known drops and reports unknown chances", () => {
  expect(calculateProfit(baseInput)).toEqual({
    entryCostChaos: 50,
    expectedReturnChaos: 25,
    expectedProfitChaos: -25,
    roiPercent: -50,
    isComplete: false,
    unknownDropCount: 1
  });
});

it("does not require a price for a drop with an unknown chance", () => {
  expect(() => calculateProfit(baseInput)).not.toThrow();
});

it("requires a price for a drop with a known chance", () => {
  expect(() =>
    calculateProfit({
      ...baseInput,
      prices: new Map([
        ["entry-a", 10],
        ["entry-b", 20]
      ])
    })
  ).toThrowError("Missing price for Known (known)");
});
```

- [ ] **Step 2: Verify failures**

```powershell
pnpm.cmd test -- test/profit.service.test.ts
```

Expected: failures for renamed inputs, nullable rates, and completeness fields.

- [ ] **Step 3: Implement the pure calculation**

Define:

```ts
export type PricedDrop = {
  itemId: string;
  itemName: string;
  dropRate: number | null;
};

export type ProfitCalculation = {
  entryCostChaos: number;
  expectedReturnChaos: number;
  expectedProfitChaos: number;
  roiPercent: number;
  isComplete: boolean;
  unknownDropCount: number;
};
```

Calculate:

```ts
const unknownDropCount = drops.filter((drop) => drop.dropRate === null).length;
const expectedReturnChaos = drops.reduce((total, drop) => {
  if (drop.dropRate === null) return total;
  return total + drop.dropRate * requirePrice(
    prices,
    drop.itemId,
    drop.itemName
  );
}, 0);
```

Return `isComplete: unknownDropCount === 0`.

- [ ] **Step 4: Update persisted snapshot schema**

Extend `profitSnapshotSchema` with:

```ts
syncRunId: z.string(),
divineOrbChaosValue: z.number().positive(),
isComplete: z.boolean(),
unknownDropCount: z.number().int().nonnegative()
```

- [ ] **Step 5: Run focused tests**

```powershell
pnpm.cmd test -- test/profit.service.test.ts
```

Expected: all pure calculation tests pass.

- [ ] **Step 6: Commit**

```powershell
git add src/services/profit.service.ts src/schemas/profit.schema.ts test/profit.service.test.ts
git commit -m "feat: calculate incomplete boss profit snapshots"
```

## Task 4: Make snapshot creation sync-run aware

**Files:**
- Modify: `src/repositories/boss.repository.ts`
- Modify: `src/repositories/profit.repository.ts`
- Modify: `src/services/profit.service.ts`
- Create: `test/profit.integration.test.ts`

- [ ] **Step 1: Add failing integration tests**

Seed one boss, entry components, known and unknown drops, two price sync runs,
and a Divine Orb price. Assert:

```ts
it("creates a snapshot using only the selected synchronized price set", async () => {
  const snapshot = await new ProfitService(testEnv).calculateAndStore(
    "boss-1",
    "league-1",
    "sync-selected"
  );

  expect(snapshot).toMatchObject({
    bossId: "boss-1",
    leagueId: "league-1",
    syncRunId: "sync-selected",
    entryCostChaos: 50,
    expectedReturnChaos: 25,
    divineOrbChaosValue: 200,
    isComplete: false,
    unknownDropCount: 1
  });
});

it("fails when the selected set has no Divine Orb price", async () => {
  await expect(
    new ProfitService(testEnv).calculateAndStore(
      "boss-1",
      "league-1",
      "sync-without-divine"
    )
  ).rejects.toMatchObject({ code: "MISSING_DIVINE_ORB_PRICE" });
});
```

Also assert that an active boss with no entry components fails with
`BOSS_ENTRY_COMPONENTS_MISSING`.

- [ ] **Step 2: Verify failures**

```powershell
pnpm.cmd test -- test/profit.integration.test.ts
```

Expected: failures because service and repository signatures are not
sync-run-aware.

- [ ] **Step 3: Rename boss repository APIs**

Replace `listBossEntryCosts` with `listBossEntryComponents`, selecting
`bossEntryComponents`. Replace drop projections with:

```ts
dropRate: bossDrops.dropRate
```

Remove quantity-range fields.

- [ ] **Step 4: Implement sync-run-aware snapshot creation**

Use constants:

```ts
const DIVINE_ORB_ITEM_ID = "divine-orb";
```

Change:

```ts
async calculateAndStore(
  bossId: string,
  leagueId: string,
  syncRunId: string
)
```

Load required IDs, including Divine Orb, using `findPricesBySyncRun`. Reject an
empty entry-component list. Build the price map, require a positive Divine Orb
price, call `calculateProfit`, and persist:

```ts
const snapshot = {
  id: createId("profit"),
  bossId,
  leagueId,
  syncRunId,
  ...calculation,
  divineOrbChaosValue,
  calculatedAt: timestamp,
  createdAt: timestamp
};
```

Change:

```ts
async recalculateAll(syncRunId: string): Promise<number>
```

and pass `syncRunId` into every boss/league calculation.

- [ ] **Step 5: Run focused tests**

```powershell
pnpm.cmd test -- test/profit.integration.test.ts test/profit.service.test.ts
```

Expected: all calculation and integration tests pass.

- [ ] **Step 6: Commit**

```powershell
git add src/repositories/boss.repository.ts src/repositories/profit.repository.ts src/services/profit.service.ts test/profit.integration.test.ts
git commit -m "feat: calculate profit from one synchronized price set"
```

## Task 5: Add backend money mapping and priced boss details

**Files:**
- Create: `src/schemas/money.schema.ts`
- Modify: `src/schemas/boss.schema.ts`
- Modify: `src/services/boss.service.ts`
- Modify: `src/routes/bosses.routes.ts`
- Create: `test/money.test.ts`
- Create: `test/boss.service.test.ts`

- [ ] **Step 1: Add failing money conversion tests**

```ts
it("returns Chaos and Divine values without storing Divine prices", () => {
  expect(toMoney(50, 200)).toEqual({ chaos: 50, divine: 0.25 });
});

it("rejects a non-positive Divine Orb rate", () => {
  expect(() => toMoney(50, 0)).toThrowError("Divine Orb Chaos value");
});
```

- [ ] **Step 2: Add a failing boss-detail service test**

Call:

```ts
const detail = await new BossService(testEnv).getDetail(
  "shaper",
  "league-1"
);
```

Assert the response contains:

```ts
expect(detail).toMatchObject({
  boss: {
    id: "shaper",
    name: "Shaper",
    slug: "shaper"
  },
  entry: {
    components: [
      {
        quantity: 1,
        unitPrice: { chaos: 12, divine: 0.06 },
        totalPrice: { chaos: 12, divine: 0.06 }
      }
    ],
    totalPrice: { chaos: 50, divine: 0.25 }
  },
  drops: [
    {
      dropRate: null,
      price: { chaos: 100, divine: 0.5 }
    }
  ]
});
```

Assert `isUber`, `entryCosts`, `expectedValueChaos`, `minQuantity`, and
`maxQuantity` are absent.

- [ ] **Step 3: Verify failures**

```powershell
pnpm.cmd test -- test/money.test.ts test/boss.service.test.ts
```

Expected: missing mapper and old boss-detail shape.

- [ ] **Step 4: Implement money schema and mapper**

Create `src/schemas/money.schema.ts`:

```ts
import { z } from "zod";
import { AppError } from "../utils/errors";

export const moneySchema = z.object({
  chaos: z.number().nonnegative(),
  divine: z.number().nonnegative()
});

export type Money = z.infer<typeof moneySchema>;

export const toMoney = (
  chaosValue: number,
  divineOrbChaosValue: number
): Money => {
  if (divineOrbChaosValue <= 0) {
    throw new AppError(
      503,
      "INVALID_DIVINE_ORB_PRICE",
      "Divine Orb Chaos value must be positive"
    );
  }
  return {
    chaos: chaosValue,
    divine: chaosValue / divineOrbChaosValue
  };
};
```

Do not round here. Response serialization may add a single documented rounding
policy later; calculations and tests use unrounded numbers.

- [ ] **Step 5: Implement priced boss details**

Change `BossService.getDetail` to accept `leagueId`. Resolve the latest
successful profit snapshot for that boss and league, use its `syncRunId` and
`divineOrbChaosValue`, load entry/drop prices from that set, and return:

```ts
{
  boss,
  entry: {
    components: entryComponents.map((component) => ({
      item: {
        id: component.itemId,
        name: component.itemName,
        category: component.itemCategory
      },
      quantity: component.quantity,
      unitPrice: toMoney(unitPrice, divineOrbChaosValue),
      totalPrice: toMoney(
        unitPrice * component.quantity,
        divineOrbChaosValue
      )
    })),
    totalPrice: toMoney(entryTotalChaos, divineOrbChaosValue)
  },
  drops: drops.map((drop) => ({
    item: {
      id: drop.itemId,
      name: drop.itemName,
      category: drop.itemCategory
    },
    dropRate: drop.dropRate,
    price: dropPrice === undefined
      ? null
      : toMoney(dropPrice, divineOrbChaosValue)
  }))
}
```

An unknown-chance drop may have `price: null` when its display price is absent.
Known-chance drops cannot reach this response without a price because snapshot
creation rejects them.

Update `GET /api/bosses/:bossId` to require the existing `leagueId` query and
pass it to the service.

- [ ] **Step 6: Define Zod response schemas**

Remove `isUber` from `bossSchema`. Add schemas for entry components, drops,
and boss detail using `moneySchema` and `itemCategorySchema`.

- [ ] **Step 7: Run focused tests**

```powershell
pnpm.cmd test -- test/money.test.ts test/boss.service.test.ts
```

Expected: all money and boss-detail tests pass.

- [ ] **Step 8: Commit**

```powershell
git add src/schemas/money.schema.ts src/schemas/boss.schema.ts src/services/boss.service.ts src/routes/bosses.routes.ts test/money.test.ts test/boss.service.test.ts
git commit -m "feat: expose priced boss entries and drops"
```

## Task 6: Expose money-valued profit responses and version cache keys

**Files:**
- Modify: `src/schemas/profit.schema.ts`
- Modify: `src/services/profit.service.ts`
- Modify: `src/routes/profit.routes.ts`
- Modify: `src/utils/cache.ts`
- Modify: `test/profit.service.test.ts`
- Modify: `test/security.test.ts`

- [ ] **Step 1: Add failing response and cache tests**

Assert the public response mapper returns:

```ts
{
  id: "profit-1",
  bossId: "boss-1",
  leagueId: "league-1",
  entryCost: { chaos: 50, divine: 0.25 },
  expectedReturn: { chaos: 25, divine: 0.125 },
  expectedProfit: { chaos: -25, divine: -0.125 },
  roiPercent: -50,
  isComplete: false,
  unknownDropCount: 1,
  calculatedAt: 100
}
```

Because profits can be negative, update `moneySchema` to permit finite negative
values; item prices remain protected by database constraints.

Assert:

```ts
expect(profitCacheKey("league-1", "boss-1"))
  .toBe("profit:v2:league-1:boss-1");
```

- [ ] **Step 2: Verify failures**

```powershell
pnpm.cmd test -- test/profit.service.test.ts test/security.test.ts
```

Expected: old snapshot response and old cache prefix.

- [ ] **Step 3: Separate stored and public profit schemas**

Keep `profitSnapshotSchema` for D1/KV storage. Add:

```ts
export const profitResponseSchema = z.object({
  id: z.string(),
  bossId: z.string(),
  leagueId: z.string(),
  entryCost: moneySchema,
  expectedReturn: moneySchema,
  expectedProfit: moneySchema,
  roiPercent: z.number(),
  isComplete: z.boolean(),
  unknownDropCount: z.number().int().nonnegative(),
  calculatedAt: z.number().int()
});
```

Implement `toProfitResponse(snapshot)` using the snapshot's stored
`divineOrbChaosValue`.

- [ ] **Step 4: Map service output and version cache**

Cache the persisted snapshot under:

```ts
`profit:v2:${leagueId}:${bossId}`
```

`getLatestCached` continues validating stored snapshots, while the route maps
the returned snapshot through `toProfitResponse`.

- [ ] **Step 5: Run focused tests**

```powershell
pnpm.cmd test -- test/profit.service.test.ts test/security.test.ts
```

Expected: response and cache tests pass.

- [ ] **Step 6: Commit**

```powershell
git add src/schemas/money.schema.ts src/schemas/profit.schema.ts src/services/profit.service.ts src/routes/profit.routes.ts src/utils/cache.ts test/profit.service.test.ts test/security.test.ts
git commit -m "feat: return profit totals in Chaos and Divine"
```

## Task 7: Thread sync-run identity through orchestration

**Files:**
- Modify: `src/services/sync.service.ts`
- Modify: `src/schemas/sync.schema.ts`
- Modify: `test/sync.service.test.ts`

- [ ] **Step 1: Add failing orchestration assertions**

Replace mocks so they assert the same ID is used:

```ts
it("passes one sync run through price and profit work", async () => {
  const syncPrices = vi
    .spyOn(PriceService.prototype, "syncPrices")
    .mockResolvedValue(4);
  const recalculateAll = vi
    .spyOn(ProfitService.prototype, "recalculateAll")
    .mockResolvedValue(3);

  const result = await new SyncService(testEnv).runFullSync();

  expect(syncPrices).toHaveBeenCalledWith(result.syncRunId);
  expect(recalculateAll).toHaveBeenCalledWith(result.syncRunId);
});
```

Add a test that the run is marked failed if the price set lacks Divine Orb.

- [ ] **Step 2: Verify failure**

```powershell
pnpm.cmd test -- test/sync.service.test.ts
```

Expected: mocks receive no sync-run arguments.

- [ ] **Step 3: Update orchestration**

Change:

```ts
syncPrices(syncRunId: string): Promise<number> {
  return new PriceService(this.env).syncPrices(syncRunId);
}

recalculateProfits(syncRunId: string): Promise<number> {
  return new ProfitService(this.env).recalculateAll(syncRunId);
}
```

Inside `runFullSync`:

```ts
const pricesInserted = await this.syncPrices(syncRunId);
const snapshotsCreated = await this.recalculateProfits(syncRunId);
```

The standalone manual recalculate endpoint cannot invent a new price set. It
must resolve the latest successful sync run and recalculate from that run. Add
`findLatestSuccessfulSyncRun` to `src/repositories/sync.repository.ts` and use
it in a no-argument public `recalculateProfits()` wrapper; return
`PRICE_SYNC_RUN_NOT_FOUND` when none exists.

- [ ] **Step 4: Run focused sync tests**

```powershell
pnpm.cmd test -- test/sync.service.test.ts test/sync.routes.test.ts
```

Expected: all lease, failure-recording, and sync-ID propagation tests pass.

- [ ] **Step 5: Commit**

```powershell
git add src/repositories/sync.repository.ts src/services/sync.service.ts src/schemas/sync.schema.ts test/sync.service.test.ts test/sync.routes.test.ts
git commit -m "feat: coordinate price and profit sync runs"
```

## Task 8: Update seed data and operational documentation

**Files:**
- Modify: `src/db/seed.ts`
- Modify: `README.md`
- Modify: `test/security.test.ts`

- [ ] **Step 1: Add a failing seed smoke test**

After generating and executing the seed, query:

```ts
const shaperComponents = await env.DB.prepare(
  "SELECT item_id AS itemId FROM boss_entry_components WHERE boss_id = ? ORDER BY item_id"
).bind("shaper").all<{ itemId: string }>();

expect(shaperComponents.results).toHaveLength(4);

const columns = await env.DB.prepare(
  "PRAGMA table_info(item_prices)"
).all<{ name: string }>();
expect(columns.results.map(({ name }) => name)).not.toContain("divine_value");
```

Assert `bosses` has no `is_uber` column and seeded rows use valid categories.

- [ ] **Step 2: Verify seed test failure**

```powershell
pnpm.cmd db:seed:local
pnpm.cmd test -- test/security.test.ts
```

Expected: old seed SQL references removed columns/tables.

- [ ] **Step 3: Rewrite seed types and SQL**

Remove `isUber`, `divineValue`, min/max quantities, and old column names.
Use:

```ts
type SeedBoss = {
  id: string;
  name: string;
  slug: string;
  description: string;
  entryComponents: Array<{ itemId: string; quantity: number }>;
  drops: Array<{
    itemId: string;
    dropRate: number | null;
    notes: string;
  }>;
};
```

Insert a stable run:

```sql
INSERT OR IGNORE INTO sync_runs
  (id, type, status, started_at, finished_at, message, created_at)
VALUES
  ('seed-sync', 'seed', 'success', ..., ..., 'Seed price set', ...);
```

Every seed price and snapshot uses `sync_run_id = 'seed-sync'`. Divine Orb's
Chaos value is used for `divine_orb_chaos_value`. Seed snapshots call the same
`calculateProfit` function used by production.

- [ ] **Step 4: Update README**

Document:

- bosses are independent; no Uber flag;
- entry components are ordinary items;
- drop chances may be null and are global;
- Chaos is persisted and Divine is derived by the backend;
- full sync writes one coherent price set;
- boss detail requires `leagueId`;
- API money fields use `{ chaos, divine }`;
- incomplete profit semantics.

- [ ] **Step 5: Regenerate and execute local seed**

```powershell
pnpm.cmd db:seed:local
pnpm.cmd test -- test/security.test.ts
```

Expected: seed succeeds idempotently and smoke tests pass.

- [ ] **Step 6: Commit**

```powershell
git add src/db/seed.ts README.md test/security.test.ts
git commit -m "docs: seed and document revised boss economy model"
```

## Task 9: Full verification and deployment preparation

**Files:**
- Modify if generated: `worker-configuration.d.ts`
- Review: `wrangler.jsonc`
- Review: all files changed by Tasks 1-8

- [ ] **Step 1: Run the complete test suite**

```powershell
pnpm.cmd test
```

Expected: every test file passes.

- [ ] **Step 2: Run static and Cloudflare checks**

```powershell
pnpm.cmd typecheck
pnpm.cmd cf:types:check
pnpm.cmd cf:startup
pnpm.cmd exec wrangler deploy --dry-run
```

Expected: all commands exit with code 0; dry-run lists D1, KV, and
`PRICE_SYNC_PROVIDER` bindings.

- [ ] **Step 3: Verify migration status locally**

```powershell
pnpm.cmd exec wrangler d1 migrations list poe-boss-profit --local
```

Expected: no pending local migrations.

- [ ] **Step 4: Inspect repository diff**

```powershell
git status --short
git diff --check
```

Expected: no whitespace errors. Only intended files are modified or untracked.
Do not include `.superpowers/brainstorm/` in commits; add `.superpowers/` to
`.gitignore` if it is not already ignored.

- [ ] **Step 5: Commit generated type updates if necessary**

```powershell
git add worker-configuration.d.ts .gitignore
git commit -m "chore: finalize boss economy model verification"
```

Skip this commit when neither file changed.

- [ ] **Step 6: Prepare production migration commands without running them**

Deployment remains a separate authorized operation. The handoff commands are:

```powershell
pnpm.cmd db:migrate:remote
pnpm.cmd deploy
```

Before applying remote migrations, export or otherwise back up production D1
if it contains non-seed data.
