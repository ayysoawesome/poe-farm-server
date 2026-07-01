import { env } from "cloudflare:workers";
import { getTableName } from "drizzle-orm";
import { getTableConfig } from "drizzle-orm/sqlite-core";
import { beforeEach, describe, expect, it } from "vitest";

import * as schema from "../src/db/schema";
import * as itemSchemas from "../src/schemas/item.schema";
import {
  applyAllMigrations,
  executeStatements,
  resetMigrationDatabase
} from "./helpers/migrations";

const expectedCategories = [
  "currency",
  "fragment",
  "divination_card",
  "equipment",
  "gem",
  "map",
  "other"
] as const;

const columnNames = (table: Parameters<typeof getTableConfig>[0]) =>
  getTableConfig(table).columns.map(({ name }) => name);

const indexNames = (table: Parameters<typeof getTableConfig>[0]) =>
  getTableConfig(table).indexes.map((index) => index.config.name);

const checkNames = (table: Parameters<typeof getTableConfig>[0]) =>
  getTableConfig(table).checks.map(({ name }) => name);

const foreignKeyTargets = (table: Parameters<typeof getTableConfig>[0]) =>
  getTableConfig(table).foreignKeys.map((foreignKey) => {
    const reference = foreignKey.reference();
    return `${reference.columns.map(({ name }) => name).join(",")}->${
      getTableName(reference.foreignTable)
    }(${reference.foreignColumns.map(({ name }) => name).join(",")})`;
  });

describe("item categories", () => {
  it("exposes the canonical category enum", () => {
    const {
      itemCategories,
      itemCategorySchema
    } = itemSchemas as typeof itemSchemas & {
      itemCategories?: readonly string[];
      itemCategorySchema?: {
        parse: (value: unknown) => unknown;
        safeParse: (value: unknown) => { success: boolean };
      };
    };

    expect(itemCategories).toEqual(expectedCategories);
    expect(itemCategorySchema).toBeDefined();
    if (itemCategorySchema === undefined) {
      return;
    }
    for (const category of expectedCategories) {
      expect(itemCategorySchema.parse(category)).toBe(category);
    }
    expect(itemCategorySchema.safeParse("unique").success).toBe(false);
  });
});

describe("Drizzle schema constraints", () => {
  it("defines constrained items and independent bosses", () => {
    expect(checkNames(schema.items)).toContain("items_category_check");
    expect(columnNames(schema.bosses)).not.toContain("is_uber");
    expect(columnNames(schema.bosses)).toContain("icon_url");
    expect(indexNames(schema.bosses)).toContain("bosses_slug_unique");
    expect(columnNames(schema.leagues)).toContain("external_name");
    expect(columnNames(schema.leagues)).toContain("source");
  });

  it("defines poe.ninja item price mappings", () => {
    expect("itemPriceMappings" in schema).toBe(true);
    const table = (
      schema as typeof schema & {
        itemPriceMappings: Parameters<typeof getTableConfig>[0];
      }
    ).itemPriceMappings;

    expect(getTableConfig(table).name).toBe("item_price_mappings");
    expect(columnNames(table)).toEqual([
      "id",
      "item_id",
      "provider",
      "external_type",
      "external_key",
      "is_active",
      "created_at",
      "updated_at"
    ]);
    expect(indexNames(table)).toContain(
      "item_price_mappings_item_provider_unique"
    );
    expect(indexNames(table)).toContain(
      "item_price_mappings_provider_active_idx"
    );
    expect(checkNames(table)).toEqual(
      expect.arrayContaining([
        "item_price_mappings_external_type_check",
        "item_price_mappings_external_key_check"
      ])
    );
    expect(foreignKeyTargets(table)).toContain("item_id->items(id)");
  });

  it("defines manual item prices keyed by item and league", () => {
    expect("manualItemPrices" in schema).toBe(true);
    const table = (
      schema as typeof schema & {
        manualItemPrices: Parameters<typeof getTableConfig>[0];
      }
    ).manualItemPrices;

    expect(getTableConfig(table).name).toBe("manual_item_prices");
    expect(columnNames(table)).toEqual([
      "id",
      "item_id",
      "league_id",
      "chaos_value",
      "notes",
      "created_at",
      "updated_at"
    ]);
    expect(indexNames(table)).toContain(
      "manual_item_prices_item_league_unique"
    );
    expect(checkNames(table)).toContain("manual_item_prices_chaos_value_check");
    expect(foreignKeyTargets(table)).toEqual(
      expect.arrayContaining(["item_id->items(id)", "league_id->leagues(id)"])
    );
  });

  it("defines unique positive entry components", () => {
    expect("bossEntryComponents" in schema).toBe(true);
    const table = (
      schema as typeof schema & {
        bossEntryComponents: Parameters<typeof getTableConfig>[0];
      }
    ).bossEntryComponents;

    expect(getTableConfig(table).name).toBe("boss_entry_components");
    expect(columnNames(table)).toEqual([
      "id",
      "boss_id",
      "item_id",
      "quantity",
      "created_at",
      "updated_at"
    ]);
    expect(indexNames(table)).toContain(
      "boss_entry_components_boss_item_unique"
    );
    expect(checkNames(table)).toContain(
      "boss_entry_components_quantity_check"
    );
    expect(foreignKeyTargets(table)).toEqual(
      expect.arrayContaining(["boss_id->bosses(id)", "item_id->items(id)"])
    );
  });

  it("defines nullable, unique, bounded boss drops", () => {
    expect(columnNames(schema.bossDrops)).toEqual([
      "id",
      "boss_id",
      "item_id",
      "drop_rate",
      "drop_group_id",
      "drop_group_type",
      "notes",
      "created_at",
      "updated_at"
    ]);
    expect(indexNames(schema.bossDrops)).toContain(
      "boss_drops_boss_item_unique"
    );
    expect(indexNames(schema.bossDrops)).toContain("boss_drops_group_idx");
    expect(checkNames(schema.bossDrops)).toContain("boss_drops_rate_check");
    expect(checkNames(schema.bossDrops)).toContain(
      "boss_drops_group_type_check"
    );
  });

  it("ties non-negative prices and complete snapshots to sync runs", () => {
    expect(columnNames(schema.itemPrices)).not.toContain("divine_value");
    expect(columnNames(schema.itemPrices)).toContain("sync_run_id");
    expect(checkNames(schema.itemPrices)).toContain(
      "item_prices_chaos_value_check"
    );
    expect(foreignKeyTargets(schema.itemPrices)).toContain(
      "sync_run_id->sync_runs(id)"
    );
    expect(indexNames(schema.itemPrices)).not.toContain(
      "item_prices_item_league_captured_idx"
    );
    expect(indexNames(schema.itemPrices)).toContain(
      "item_prices_item_league_captured_id_idx"
    );

    expect("latestItemPrices" in schema).toBe(true);
    const latestPrices = (
      schema as typeof schema & {
        latestItemPrices: Parameters<typeof getTableConfig>[0];
      }
    ).latestItemPrices;
    expect(getTableConfig(latestPrices).name).toBe("latest_item_prices");
    expect(columnNames(latestPrices)).toEqual([
      "item_id",
      "league_id",
      "source",
      "sync_run_id",
      "chaos_value",
      "captured_at",
      "created_at",
      "updated_at"
    ]);
    expect(checkNames(latestPrices)).toContain(
      "latest_item_prices_chaos_value_check"
    );

    expect(columnNames(schema.profitSnapshots)).toEqual(
      expect.arrayContaining([
        "sync_run_id",
        "divine_orb_chaos_value",
        "is_complete",
        "unknown_drop_count"
      ])
    );
    expect(checkNames(schema.profitSnapshots)).toEqual(
      expect.arrayContaining([
        "profit_snapshots_divine_orb_chaos_value_check",
        "profit_snapshots_is_complete_check",
        "profit_snapshots_unknown_drop_count_check"
      ])
    );
    expect(foreignKeyTargets(schema.profitSnapshots)).toContain(
      "sync_run_id->sync_runs(id)"
    );

    expect("latestProfitSnapshots" in schema).toBe(true);
    const latestSnapshots = (
      schema as typeof schema & {
        latestProfitSnapshots: Parameters<typeof getTableConfig>[0];
      }
    ).latestProfitSnapshots;
    expect(getTableConfig(latestSnapshots).name).toBe(
      "latest_profit_snapshots"
    );
    expect(columnNames(latestSnapshots)).toEqual([
      "id",
      "boss_id",
      "league_id",
      "sync_run_id",
      "entry_cost_chaos",
      "expected_return_chaos",
      "expected_profit_chaos",
      "roi_percent",
      "divine_orb_chaos_value",
      "is_complete",
      "unknown_drop_count",
      "calculated_at",
      "created_at",
      "updated_at"
    ]);
    expect(checkNames(latestSnapshots)).toEqual(
      expect.arrayContaining([
        "latest_profit_snapshots_divine_orb_chaos_value_check",
        "latest_profit_snapshots_is_complete_check",
        "latest_profit_snapshots_unknown_drop_count_check"
      ])
    );
  });
});

describe.sequential("D1 schema constraint behavior", () => {
  beforeEach(async () => {
    await resetMigrationDatabase();
    await applyAllMigrations();
    await executeStatements([
      `INSERT INTO bosses (
        id, name, slug, is_active, created_at, updated_at
      ) VALUES ('boss-1', 'Boss', 'boss', 1, 1, 1)`,
      `INSERT INTO items (
        id, name, category, created_at, updated_at
      ) VALUES ('item-1', 'Item', 'currency', 1, 1)`,
      `INSERT INTO items (
        id, name, category, created_at, updated_at
      ) VALUES ('item-2', 'Item 2', 'currency', 1, 1)`,
      `INSERT INTO items (
        id, name, category, created_at, updated_at
      ) VALUES ('item-3', 'Item 3', 'currency', 1, 1)`,
      `INSERT INTO leagues (
        id, name, external_name, source, is_active, created_at, updated_at
      ) VALUES ('league-1', 'League', 'Mercenaries', 'manual', 1, 1, 1)`,
      `INSERT OR IGNORE INTO sync_runs (
        id, type, status, started_at, created_at
      ) VALUES ('sync-1', 'price', 'success', 1, 1)`
    ]);
  });

  it.each(expectedCategories)("accepts item category %s", async (category) => {
    await expect(
      env.DB.prepare(
        "INSERT INTO items (id, name, category, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
      )
        .bind(`item-${category}`, category, category, 1, 1)
        .run()
    ).resolves.toBeDefined();
  });

  it("rejects invalid categories and non-positive entry quantities", async () => {
    await expect(
      env.DB.prepare(
        "INSERT INTO items (id, name, category, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
      )
        .bind("bad-item", "Bad Item", "unique", 1, 1)
        .run()
    ).rejects.toThrow();

    for (const quantity of [0, -1]) {
      await expect(
        env.DB.prepare(
          "INSERT INTO boss_entry_components (id, boss_id, item_id, quantity, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
        )
          .bind(`entry-${quantity}`, "boss-1", "item-1", quantity, 1, 1)
          .run()
      ).rejects.toThrow();
    }
  });

  it("accepts poe.ninja mappings and rejects duplicate provider mappings", async () => {
    await env.DB.prepare(
      `INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key,
        is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        "mapping-1",
        "item-1",
        "poe_ninja",
        "Currency",
        "Divine Orb",
        1,
        1,
        1
      )
      .run();

    await expect(
      env.DB.prepare(
        `INSERT INTO item_price_mappings (
          id, item_id, provider, external_type, external_key,
          is_active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          "mapping-2",
          "item-1",
          "poe_ninja",
          "Currency",
          "Chaos Orb",
          1,
          1,
          1
        )
        .run()
    ).rejects.toThrow();
  });

  it("accepts public stash price mappings for filtered item searches", async () => {
    await expect(
      env.DB.prepare(
        `INSERT INTO item_price_mappings (
          id, item_id, provider, external_type, external_key,
          is_active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          "mapping-trade",
          "item-1",
          "poe_public_stash",
          "PublicStashSearch",
          JSON.stringify({ name: "Watcher's Eye", identified: false }),
          1,
          1,
          1
        )
        .run()
    ).resolves.toBeDefined();
  });

  it("accepts manual price mappings and positive manual prices", async () => {
    await env.DB.prepare(
      `INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key,
        is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind("mapping-manual", "item-1", "manual", "Manual", "item-1", 1, 1, 1)
      .run();

    await expect(
      env.DB.prepare(
        `INSERT INTO manual_item_prices (
          id, item_id, league_id, chaos_value, notes, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
        .bind("manual-price", "item-1", "league-1", 123, "manual", 1, 1)
        .run()
    ).resolves.toBeDefined();

    await expect(
      env.DB.prepare(
        `INSERT INTO manual_item_prices (
          id, item_id, league_id, chaos_value, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?)`
      )
        .bind("manual-bad-price", "item-1", "league-1", -1, 1, 1)
        .run()
    ).rejects.toThrow();
  });

  it("rejects duplicate entry components and drops", async () => {
    await env.DB.prepare(
      "INSERT INTO boss_entry_components (id, boss_id, item_id, quantity, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
      .bind("entry-1", "boss-1", "item-1", 1, 1, 1)
      .run();
    await expect(
      env.DB.prepare(
        "INSERT INTO boss_entry_components (id, boss_id, item_id, quantity, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
      )
        .bind("entry-2", "boss-1", "item-1", 2, 1, 1)
        .run()
    ).rejects.toThrow();

    await env.DB.prepare(
      "INSERT INTO boss_drops (id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    )
      .bind("drop-1", "boss-1", "item-1", null, "group-1", "one_of", 1, 1)
      .run();
    await expect(
      env.DB.prepare(
        "INSERT INTO boss_drops (id, boss_id, item_id, drop_rate, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
      )
        .bind("drop-2", "boss-1", "item-1", 0.5, 1, 1)
        .run()
    ).rejects.toThrow();
  });

  it("accepts one-of drop groups and rejects incomplete or invalid groups", async () => {
    await expect(
      env.DB.prepare(
        "INSERT INTO boss_drops (id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      )
        .bind("drop-grouped", "boss-1", "item-1", 0.5, "uber-elder-fragment", "one_of", 1, 1)
        .run()
    ).resolves.toBeDefined();

    await expect(
      env.DB.prepare(
        "INSERT INTO boss_drops (id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      )
        .bind("drop-missing-type", "boss-1", "item-2", 0.5, "group-1", null, 1, 1)
        .run()
    ).rejects.toThrow();

    await expect(
      env.DB.prepare(
        "INSERT INTO boss_drops (id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      )
        .bind("drop-invalid-type", "boss-1", "item-3", 0.5, "group-1", "independent", 1, 1)
        .run()
    ).rejects.toThrow();
  });

  it.each([-0.01, 1.01])("rejects drop rate %s", async (dropRate) => {
    await expect(
      env.DB.prepare(
        "INSERT INTO boss_drops (id, boss_id, item_id, drop_rate, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
      )
        .bind(`drop-${dropRate}`, "boss-1", "item-1", dropRate, 1, 1)
        .run()
    ).rejects.toThrow();
  });

  it("rejects negative prices and invalid snapshot completeness values", async () => {
    await expect(
      env.DB.prepare(
        "INSERT INTO item_prices (id, item_id, league_id, sync_run_id, chaos_value, source, captured_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      )
        .bind(
          "price-1",
          "item-1",
          "league-1",
          "sync-1",
          -0.01,
          "test",
          1,
          1
        )
        .run()
    ).rejects.toThrow();

    const insertSnapshot = (id: string, divineRate: number, complete: number, unknown: number) =>
      env.DB.prepare(
        `INSERT INTO profit_snapshots (
          id, boss_id, league_id, sync_run_id, entry_cost_chaos,
          expected_return_chaos, expected_profit_chaos, roi_percent,
          divine_orb_chaos_value, is_complete, unknown_drop_count,
          calculated_at, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          id,
          "boss-1",
          "league-1",
          "sync-1",
          1,
          1,
          0,
          0,
          divineRate,
          complete,
          unknown,
          1,
          1
        )
        .run();

    await expect(insertSnapshot("snapshot-rate", 0, 1, 0)).rejects.toThrow();
    await expect(insertSnapshot("snapshot-complete", 200, 2, 0)).rejects.toThrow();
    await expect(insertSnapshot("snapshot-unknown", 200, 0, -1)).rejects.toThrow();
    await expect(
      insertSnapshot("snapshot-fractional-unknown", 200, 0, 0.5)
    ).rejects.toThrow();

    await expect(
      env.DB.prepare(
        `INSERT INTO latest_item_prices (
          item_id, league_id, source, sync_run_id, chaos_value,
          captured_at, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind("item-1", "league-1", "test", "sync-1", -1, 1, 1, 1)
        .run()
    ).rejects.toThrow();

    await expect(
      env.DB.prepare(
        `INSERT INTO latest_profit_snapshots (
          id, boss_id, league_id, sync_run_id, entry_cost_chaos,
          expected_return_chaos, expected_profit_chaos, roi_percent,
          divine_orb_chaos_value, is_complete, unknown_drop_count,
          calculated_at, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          "latest-snapshot-rate",
          "boss-1",
          "league-1",
          "sync-1",
          1,
          1,
          0,
          0,
          0,
          1,
          0,
          1,
          1,
          1
        )
        .run()
    ).rejects.toThrow();
  });
});
