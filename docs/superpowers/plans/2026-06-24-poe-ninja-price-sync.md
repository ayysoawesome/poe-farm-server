# Poe Ninja Price Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a poe.ninja-backed price synchronization pipeline with explicit item/provider mappings and league external names.

**Architecture:** Curated game data remains in application-owned tables. Price sync loads active poe.ninja mappings per active league, fetches poe.ninja prices in batches grouped by external type, writes one coherent `item_prices` set per `sync_runs.id`, and then recalculates profit snapshots from that same set.

**Tech Stack:** TypeScript, Cloudflare Workers, Hono, D1, Drizzle ORM, Zod, Vitest, Wrangler, pnpm.

---

## File Structure

- `src/db/schema.ts`: add `leagues.externalName` and `itemPriceMappings`.
- `src/schemas/league.schema.ts`: expose `externalName`.
- `src/schemas/item-price-mapping.schema.ts`: Zod schema and provider constants.
- `src/repositories/item-price-mapping.repository.ts`: list active mappings by provider.
- `src/services/price.service.ts`: replace single-item provider interface with batch provider; add `PoeNinjaPriceProvider`.
- `src/db/seed.ts`: seed `external_name` and poe.ninja mappings.
- `drizzle/migrations/0004_*.sql`: migration for league external names and mappings.
- `test/schema.test.ts`: schema constraint coverage.
- `test/price.repository.test.ts`: updated service tests for batch sync.
- `test/poe-ninja-price-provider.test.ts`: provider parsing and grouping tests.
- `README.md`: document `PRICE_SYNC_PROVIDER=poe_ninja` and required mappings.

## Task 1: Add league external names and price mapping schema

**Files:**
- Modify: `src/db/schema.ts`
- Modify: `src/schemas/league.schema.ts`
- Create: `src/schemas/item-price-mapping.schema.ts`
- Modify: `test/schema.test.ts`

- [ ] **Step 1: Add failing schema tests**

Add tests asserting:

```ts
expect(columnNames(schema.leagues)).toContain("external_name");
expect(getTableConfig(schema.itemPriceMappings).name).toBe("item_price_mappings");
```

Add D1 constraint tests that insert:

```sql
INSERT INTO item_price_mappings
  (id, item_id, provider, external_type, external_key, is_active, created_at, updated_at)
VALUES
  ('mapping-1', 'item-1', 'poe_ninja', 'Currency', 'Divine Orb', 1, 1, 1);
```

Then verify duplicate active mappings for the same `(item_id, provider)` are rejected.

- [ ] **Step 2: Run focused tests**

Run:

```powershell
.\node_modules\.bin\vitest.cmd run test\schema.test.ts
```

Expected: failure because the schema/table does not exist yet.

- [ ] **Step 3: Implement schema**

Add to `leagues`:

```ts
externalName: text("external_name").notNull()
```

Add:

```ts
export const itemPriceMappings = sqliteTable(
  "item_price_mappings",
  {
    id: text("id").primaryKey(),
    itemId: text("item_id").notNull().references(() => items.id),
    provider: text("provider", { enum: ["poe_ninja"] }).notNull(),
    externalType: text("external_type").notNull(),
    externalKey: text("external_key").notNull(),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    ...timestamps
  },
  (table) => [
    uniqueIndex("item_price_mappings_item_provider_unique").on(
      table.itemId,
      table.provider
    ),
    index("item_price_mappings_provider_active_idx").on(
      table.provider,
      table.isActive
    ),
    check("item_price_mappings_external_type_check", sql`length(${table.externalType}) > 0`),
    check("item_price_mappings_external_key_check", sql`length(${table.externalKey}) > 0`)
  ]
);
```

Update `leagueSchema` with:

```ts
externalName: z.string().min(1)
```

Create schema file:

```ts
export const priceProviderSchema = z.enum(["poe_ninja"]);
export const itemPriceMappingSchema = z.object({
  id: idSchema,
  itemId: idSchema,
  provider: priceProviderSchema,
  externalType: z.string().min(1),
  externalKey: z.string().min(1),
  isActive: z.boolean(),
  createdAt: z.number().int(),
  updatedAt: z.number().int()
});
```

- [ ] **Step 4: Generate migration**

Run:

```powershell
pnpm.cmd db:generate
```

Inspect migration: existing leagues must receive `external_name`. For current seed data, default legacy rows to `name`.

- [ ] **Step 5: Run focused tests**

Run:

```powershell
.\node_modules\.bin\vitest.cmd run test\schema.test.ts test\migration.test.ts
```

Expected: all schema/migration tests pass.

## Task 2: Add mapping repository

**Files:**
- Create: `src/repositories/item-price-mapping.repository.ts`
- Create: `test/item-price-mapping.repository.test.ts`

- [ ] **Step 1: Write failing repository test**

Use real migrations, seed one item and several mappings, then assert:

```ts
const mappings = await listActivePriceMappingsByProvider(
  createDb(env.DB),
  "poe_ninja"
);
expect(mappings).toEqual([
  {
    itemId: "divine-orb",
    itemName: "Divine Orb",
    itemCategory: "currency",
    provider: "poe_ninja",
    externalType: "Currency",
    externalKey: "Divine Orb"
  }
]);
```

- [ ] **Step 2: Run test and verify failure**

Run:

```powershell
.\node_modules\.bin\vitest.cmd run test\item-price-mapping.repository.test.ts
```

Expected: module/function missing.

- [ ] **Step 3: Implement repository**

Create:

```ts
export const listActivePriceMappingsByProvider = (
  db: Database,
  provider: PriceProviderName
) =>
  db
    .select({
      id: itemPriceMappings.id,
      itemId: itemPriceMappings.itemId,
      itemName: items.name,
      itemCategory: items.category,
      provider: itemPriceMappings.provider,
      externalType: itemPriceMappings.externalType,
      externalKey: itemPriceMappings.externalKey,
      createdAt: itemPriceMappings.createdAt,
      updatedAt: itemPriceMappings.updatedAt
    })
    .from(itemPriceMappings)
    .innerJoin(items, eq(itemPriceMappings.itemId, items.id))
    .where(and(eq(itemPriceMappings.provider, provider), eq(itemPriceMappings.isActive, true)))
    .orderBy(asc(itemPriceMappings.externalType), asc(itemPriceMappings.externalKey));
```

- [ ] **Step 4: Run focused test**

Expected: repository test passes.

## Task 3: Implement poe.ninja provider

**Files:**
- Modify: `src/services/price.service.ts`
- Create: `test/poe-ninja-price-provider.test.ts`

- [ ] **Step 1: Write failing provider tests**

Add tests with a fake fetcher:

```ts
const provider = new PoeNinjaPriceProvider(async (url) => {
  requests.push(url);
  if (url.includes("currencyoverview")) {
    return {
      lines: [{ currencyTypeName: "Divine Orb", chaosEquivalent: 200 }]
    };
  }
  return {
    lines: [{ name: "Maven's Writ", chaosValue: 120 }]
  };
});
```

Assert:

```ts
expect(prices.get("chaos-orb")).toBe(1);
expect(prices.get("divine-orb")).toBe(200);
expect(prices.get("mavens-writ")).toBe(120);
expect(requests).toHaveLength(2);
```

- [ ] **Step 2: Run test and verify failure**

Expected: `PoeNinjaPriceProvider` missing.

- [ ] **Step 3: Implement batch provider interface**

Replace provider interface with:

```ts
export type PriceProviderMapping = {
  itemId: string;
  itemName: string;
  externalType: string;
  externalKey: string;
};

export interface PriceProvider {
  readonly name: string;
  fetchPrices(input: {
    leagueExternalName: string;
    mappings: readonly PriceProviderMapping[];
    capturedAt: number;
  }): Promise<Map<string, number>>;
}
```

Implement `PoeNinjaPriceProvider`:

- Group mappings by `externalType`.
- Use `currencyoverview` for `Currency`.
- Use `itemoverview` for everything else.
- Match `Currency` lines by `currencyTypeName`.
- Match item lines by `name`.
- Read price from `chaosEquivalent`, then `chaosValue`.
- Force `chaos-orb` to `1`.

- [ ] **Step 4: Run provider tests**

Expected: provider tests pass.

## Task 4: Wire provider into price sync

**Files:**
- Modify: `src/services/price.service.ts`
- Modify: `test/price.repository.test.ts`

- [ ] **Step 1: Add failing service test**

Update service fixtures to include `leagues.external_name`, items, and mappings. Assert `syncPrices("sync-new")` inserts every mapped price with the same sync run and captured timestamp.

- [ ] **Step 2: Run focused test**

Expected: failure because `PriceService` still reads all items and old provider shape.

- [ ] **Step 3: Implement sync wiring**

In `PriceService.syncPrices`:

- Load active leagues.
- Load active mappings for the selected provider.
- For each league, call `provider.fetchPrices({ leagueExternalName: league.externalName, mappings, capturedAt })`.
- Insert prices for returned values.
- Always include Chaos Orb if mapped.
- Do not depend on previous prices for poe.ninja.

Keep mock provider deterministic for tests.

- [ ] **Step 4: Run focused tests**

Expected: `price.repository.test.ts` and provider tests pass.

## Task 5: Seed mappings and docs

**Files:**
- Modify: `src/db/seed.ts`
- Modify: `README.md`
- Modify: `test/schema.test.ts`

- [ ] **Step 1: Add seed smoke assertions**

Extend existing seed/schema smoke tests to assert:

```sql
SELECT COUNT(*) FROM item_price_mappings WHERE provider = 'poe_ninja';
```

Expected count is at least the seeded item count.

- [ ] **Step 2: Update seed**

Seed:

- `leagues.external_name`
- one poe.ninja mapping per seeded item
- `PRICE_SYNC_PROVIDER=poe_ninja` documentation

- [ ] **Step 3: Run seed and tests**

Run:

```powershell
pnpm.cmd db:migrate:local
pnpm.cmd db:seed:local
pnpm.cmd test
pnpm.cmd typecheck
```

Expected: all pass.

## Task 6: Full verification

**Files:**
- Review all changed files.

- [ ] **Step 1: Run complete verification**

Run:

```powershell
pnpm.cmd test
pnpm.cmd typecheck
pnpm.cmd cf:types:check
pnpm.cmd cf:startup
pnpm.cmd exec wrangler deploy --dry-run
pnpm.cmd exec wrangler d1 migrations list poe-boss-profit --local
git diff --check
```

Expected:

- all tests pass;
- typecheck passes;
- Wrangler dry-run exits 0;
- no pending local migrations;
- no whitespace errors.
