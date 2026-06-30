import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
  uniqueIndex
} from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
};

export const leagues = sqliteTable("leagues", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  externalName: text("external_name").notNull(),
  source: text("source", { enum: ["manual", "poe_ninja"] })
    .notNull()
    .default("manual"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  ...timestamps
});

export const items = sqliteTable(
  "items",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    category: text("category", {
      enum: [
        "currency",
        "fragment",
        "divination_card",
        "equipment",
        "gem",
        "map",
        "other"
      ]
    }).notNull(),
    iconUrl: text("icon_url"),
    tradeUrl: text("trade_url"),
    ...timestamps
  },
  (table) => [
    check(
      "items_category_check",
      sql`${table.category} in ('currency', 'fragment', 'divination_card', 'equipment', 'gem', 'map', 'other')`
    )
  ]
);

export const itemPriceMappings = sqliteTable(
  "item_price_mappings",
  {
    id: text("id").primaryKey(),
    itemId: text("item_id").notNull().references(() => items.id),
    provider: text("provider", {
      enum: ["poe_ninja", "poe_public_stash", "manual"]
    }).notNull(),
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
    check(
      "item_price_mappings_external_type_check",
      sql`length(${table.externalType}) > 0`
    ),
    check(
      "item_price_mappings_external_key_check",
      sql`length(${table.externalKey}) > 0`
    )
  ]
);

export const manualItemPrices = sqliteTable(
  "manual_item_prices",
  {
    id: text("id").primaryKey(),
    itemId: text("item_id").notNull().references(() => items.id),
    leagueId: text("league_id").notNull().references(() => leagues.id),
    chaosValue: real("chaos_value").notNull(),
    notes: text("notes"),
    ...timestamps
  },
  (table) => [
    uniqueIndex("manual_item_prices_item_league_unique").on(
      table.itemId,
      table.leagueId
    ),
    index("manual_item_prices_league_idx").on(table.leagueId),
    check(
      "manual_item_prices_chaos_value_check",
      sql`${table.chaosValue} >= 0`
    )
  ]
);

export const syncRuns = sqliteTable("sync_runs", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  status: text("status").notNull(),
  startedAt: integer("started_at").notNull(),
  finishedAt: integer("finished_at"),
  message: text("message"),
  createdAt: integer("created_at").notNull()
});

export const itemPrices = sqliteTable(
  "item_prices",
  {
    id: text("id").primaryKey(),
    itemId: text("item_id").notNull().references(() => items.id),
    leagueId: text("league_id").notNull().references(() => leagues.id),
    syncRunId: text("sync_run_id").notNull().references(() => syncRuns.id),
    chaosValue: real("chaos_value").notNull(),
    source: text("source").notNull(),
    capturedAt: integer("captured_at").notNull(),
    createdAt: integer("created_at").notNull()
  },
  (table) => [
    index("item_prices_item_league_captured_id_idx").on(
      table.itemId,
      table.leagueId,
      table.capturedAt,
      table.id
    ),
    index("item_prices_league_captured_idx").on(table.leagueId, table.capturedAt),
    index("item_prices_sync_run_item_league_idx").on(
      table.syncRunId,
      table.itemId,
      table.leagueId
    ),
    check("item_prices_chaos_value_check", sql`${table.chaosValue} >= 0`)
  ]
);

export const latestItemPrices = sqliteTable(
  "latest_item_prices",
  {
    itemId: text("item_id").notNull().references(() => items.id),
    leagueId: text("league_id").notNull().references(() => leagues.id),
    source: text("source").notNull(),
    syncRunId: text("sync_run_id").notNull().references(() => syncRuns.id),
    chaosValue: real("chaos_value").notNull(),
    capturedAt: integer("captured_at").notNull(),
    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at").notNull()
  },
  (table) => [
    primaryKey({
      name: "latest_item_prices_pk",
      columns: [table.itemId, table.leagueId, table.source]
    }),
    index("latest_item_prices_item_league_idx").on(
      table.itemId,
      table.leagueId
    ),
    index("latest_item_prices_sync_run_idx").on(table.syncRunId),
    check(
      "latest_item_prices_chaos_value_check",
      sql`${table.chaosValue} >= 0`
    )
  ]
);

export const bosses = sqliteTable(
  "bosses",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    ...timestamps
  },
  (table) => [uniqueIndex("bosses_slug_unique").on(table.slug)]
);

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
    index("boss_entry_components_item_idx").on(table.itemId),
    check("boss_entry_components_quantity_check", sql`${table.quantity} > 0`)
  ]
);

export const bossDrops = sqliteTable(
  "boss_drops",
  {
    id: text("id").primaryKey(),
    bossId: text("boss_id").notNull().references(() => bosses.id),
    itemId: text("item_id").notNull().references(() => items.id),
    dropRate: real("drop_rate"),
    dropGroupId: text("drop_group_id"),
    dropGroupType: text("drop_group_type", { enum: ["one_of"] }),
    notes: text("notes"),
    ...timestamps
  },
  (table) => [
    uniqueIndex("boss_drops_boss_item_unique").on(table.bossId, table.itemId),
    index("boss_drops_item_idx").on(table.itemId),
    index("boss_drops_group_idx").on(table.bossId, table.dropGroupId),
    check(
      "boss_drops_rate_check",
      sql`${table.dropRate} is null or (${table.dropRate} >= 0 and ${table.dropRate} <= 1)`
    ),
    check(
      "boss_drops_group_type_check",
      sql`(${table.dropGroupId} is null and ${table.dropGroupType} is null) or (${table.dropGroupId} is not null and length(${table.dropGroupId}) > 0 and ${table.dropGroupType} is not null and ${table.dropGroupType} in ('one_of'))`
    )
  ]
);

export const profitSnapshots = sqliteTable(
  "profit_snapshots",
  {
    id: text("id").primaryKey(),
    bossId: text("boss_id").notNull().references(() => bosses.id),
    leagueId: text("league_id").notNull().references(() => leagues.id),
    syncRunId: text("sync_run_id").notNull().references(() => syncRuns.id),
    entryCostChaos: real("entry_cost_chaos").notNull(),
    expectedReturnChaos: real("expected_return_chaos").notNull(),
    expectedProfitChaos: real("expected_profit_chaos").notNull(),
    roiPercent: real("roi_percent").notNull(),
    divineOrbChaosValue: real("divine_orb_chaos_value").notNull(),
    isComplete: integer("is_complete", { mode: "boolean" }).notNull(),
    unknownDropCount: integer("unknown_drop_count").notNull(),
    calculatedAt: integer("calculated_at").notNull(),
    createdAt: integer("created_at").notNull()
  },
  (table) => [
    index("profit_snapshots_boss_league_calculated_idx").on(
      table.bossId,
      table.leagueId,
      table.calculatedAt
    ),
    index("profit_snapshots_league_calculated_idx").on(
      table.leagueId,
      table.calculatedAt
    ),
    index("profit_snapshots_sync_run_idx").on(table.syncRunId),
    check(
      "profit_snapshots_divine_orb_chaos_value_check",
      sql`${table.divineOrbChaosValue} > 0`
    ),
    check(
      "profit_snapshots_is_complete_check",
      sql`${table.isComplete} in (0, 1)`
    ),
    check(
      "profit_snapshots_unknown_drop_count_check",
      sql`${table.unknownDropCount} >= 0 and ${table.unknownDropCount} = cast(${table.unknownDropCount} as integer)`
    )
  ]
);

export const latestProfitSnapshots = sqliteTable(
  "latest_profit_snapshots",
  {
    id: text("id").notNull(),
    bossId: text("boss_id").notNull().references(() => bosses.id),
    leagueId: text("league_id").notNull().references(() => leagues.id),
    syncRunId: text("sync_run_id").notNull().references(() => syncRuns.id),
    entryCostChaos: real("entry_cost_chaos").notNull(),
    expectedReturnChaos: real("expected_return_chaos").notNull(),
    expectedProfitChaos: real("expected_profit_chaos").notNull(),
    roiPercent: real("roi_percent").notNull(),
    divineOrbChaosValue: real("divine_orb_chaos_value").notNull(),
    isComplete: integer("is_complete", { mode: "boolean" }).notNull(),
    unknownDropCount: integer("unknown_drop_count").notNull(),
    calculatedAt: integer("calculated_at").notNull(),
    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at").notNull()
  },
  (table) => [
    primaryKey({
      name: "latest_profit_snapshots_pk",
      columns: [table.bossId, table.leagueId]
    }),
    index("latest_profit_snapshots_league_idx").on(table.leagueId),
    index("latest_profit_snapshots_sync_run_idx").on(table.syncRunId),
    check(
      "latest_profit_snapshots_divine_orb_chaos_value_check",
      sql`${table.divineOrbChaosValue} > 0`
    ),
    check(
      "latest_profit_snapshots_is_complete_check",
      sql`${table.isComplete} in (0, 1)`
    ),
    check(
      "latest_profit_snapshots_unknown_drop_count_check",
      sql`${table.unknownDropCount} >= 0 and ${table.unknownDropCount} = cast(${table.unknownDropCount} as integer)`
    )
  ]
);

export const syncLeases = sqliteTable("sync_leases", {
  name: text("name").primaryKey(),
  ownerId: text("owner_id").notNull(),
  expiresAt: integer("expires_at").notNull(),
  updatedAt: integer("updated_at").notNull()
});
