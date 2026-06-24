import { env } from "cloudflare:workers";
import { beforeEach, describe, expect, it } from "vitest";

import {
  applyAllMigrations,
  applyLegacyMigrations,
  executeMigration,
  executeStatements,
  migrationSql,
  query,
  resetMigrationDatabase
} from "./helpers/migrations";

const seedBase = async () => {
  await executeStatements([
    `INSERT INTO leagues (id, name, is_active, created_at, updated_at)
     VALUES ('league-a', 'League A', 1, 1, 1),
            ('league-b', 'League B', 1, 1, 1)`,
    `INSERT INTO items (id, name, category, created_at, updated_at)
     VALUES ('divine-orb', 'Divine Orb', 'currency', 1, 1),
            ('legacy-unique', 'Legacy Unique', 'unique', 1, 1)`,
    `INSERT INTO bosses (
       id, name, slug, is_uber, is_active, created_at, updated_at
     ) VALUES ('boss-1', 'Boss', 'boss', 1, 1, 1, 1)`
  ]);
};

beforeEach(async () => {
  await resetMigrationDatabase();
});

describe.sequential("boss economy migration", () => {
  it("executes 0000-0003 and preserves legacy rows with per-league Divine rates", async () => {
    await applyLegacyMigrations();
    await seedBase();
    await executeStatements([
      `INSERT INTO boss_entry_costs (
         id, boss_id, item_id, quantity, created_at, updated_at
       ) VALUES ('entry-1', 'boss-1', 'legacy-unique', 2, 1, 1)`,
      `INSERT INTO boss_drops (
         id, boss_id, item_id, estimated_drop_rate,
         min_quantity, max_quantity, notes, created_at, updated_at
       ) VALUES (
         'drop-1', 'boss-1', 'legacy-unique', 0.25,
         1, 3, 'legacy', 1, 1
       )`,
      `INSERT INTO item_prices (
         id, item_id, league_id, chaos_value, divine_value,
         source, captured_at, created_at
       ) VALUES
         ('divine-a', 'divine-orb', 'league-a', 200, 1, 'legacy', 10, 10),
         ('divine-b', 'divine-orb', 'league-b', 300, 1, 'legacy', 20, 20),
         ('item-a', 'legacy-unique', 'league-a', 50, 0.25, 'legacy', 10, 10),
         ('item-b', 'legacy-unique', 'league-b', 75, 0.25, 'legacy', 20, 20)`,
      `INSERT INTO profit_snapshots (
         id, boss_id, league_id, entry_cost_chaos, expected_return_chaos,
         expected_profit_chaos, roi_percent, calculated_at, created_at
       ) VALUES
         ('snapshot-a', 'boss-1', 'league-a', 100, 12.5, -87.5, -87.5, 10, 10),
         ('snapshot-b', 'boss-1', 'league-b', 150, 18.75, -131.25, -87.5, 20, 20)`
    ]);

    await executeMigration(3);

    await expect(
      query<{
        category: string;
        quantity: number;
        dropRate: number;
      }>(
        `SELECT
           item.category,
           entry.quantity,
           drop_row.drop_rate AS dropRate
         FROM items AS item
         JOIN boss_entry_components AS entry ON entry.item_id = item.id
         JOIN boss_drops AS drop_row
           ON drop_row.boss_id = entry.boss_id
          AND drop_row.item_id = entry.item_id
         WHERE item.id = 'legacy-unique'`
      )
    ).resolves.toEqual([
      { category: "equipment", quantity: 2, dropRate: 0.25 }
    ]);

    await expect(
      query<{
        leagueId: string;
        divineRate: number;
        syncRunId: string;
      }>(
        `SELECT
           league_id AS leagueId,
           divine_orb_chaos_value AS divineRate,
           sync_run_id AS syncRunId
         FROM profit_snapshots
         ORDER BY league_id`
      )
    ).resolves.toEqual([
      {
        leagueId: "league-a",
        divineRate: 200,
        syncRunId: "migration-legacy-price-set"
      },
      {
        leagueId: "league-b",
        divineRate: 300,
        syncRunId: "migration-legacy-price-set"
      }
    ]);

    await expect(query("PRAGMA foreign_key_check")).resolves.toEqual([]);
  });

  it("fails before destructive changes when a snapshot league lacks a positive Divine price", async () => {
    await applyLegacyMigrations();
    await seedBase();
    await executeStatements([
      `INSERT INTO item_prices (
         id, item_id, league_id, chaos_value, divine_value,
         source, captured_at, created_at
       ) VALUES ('divine-a', 'divine-orb', 'league-a', 200, 1, 'legacy', 10, 10)`,
      `INSERT INTO profit_snapshots (
         id, boss_id, league_id, entry_cost_chaos, expected_return_chaos,
         expected_profit_chaos, roi_percent, calculated_at, created_at
       ) VALUES ('snapshot-b', 'boss-1', 'league-b', 1, 1, 0, 0, 10, 10)`
    ]);

    await expect(executeMigration(3)).rejects.toThrow(
      /migration_divine_price_guard_check/
    );
    await expect(
      query<{ count: number }>(
        "SELECT COUNT(*) AS count FROM boss_entry_costs"
      )
    ).resolves.toEqual([{ count: 0 }]);
    await expect(
      query<{ count: number }>(
        "SELECT COUNT(*) AS count FROM profit_snapshots"
      )
    ).resolves.toEqual([{ count: 1 }]);
  });

  it("fails before destructive changes when a priced league without snapshots lacks a positive Divine price", async () => {
    await applyLegacyMigrations();
    await seedBase();
    await executeStatements([
      `INSERT INTO item_prices (
         id, item_id, league_id, chaos_value, divine_value,
         source, captured_at, created_at
       ) VALUES ('item-b', 'legacy-unique', 'league-b', 75, 0.25, 'legacy', 20, 20)`
    ]);

    await expect(executeMigration(3)).rejects.toThrow(
      /migration_divine_price_guard_check/
    );
    await expect(
      query<{ count: number }>(
        "SELECT COUNT(*) AS count FROM item_prices"
      )
    ).resolves.toEqual([{ count: 1 }]);
    await expect(
      query<{ count: number }>(
        "SELECT COUNT(*) AS count FROM profit_snapshots"
      )
    ).resolves.toEqual([{ count: 0 }]);
  });

  it("uses the latest positive Divine price captured no later than the snapshot", async () => {
    await applyLegacyMigrations();
    await seedBase();
    await executeStatements([
      `INSERT INTO item_prices (
         id, item_id, league_id, chaos_value, divine_value,
         source, captured_at, created_at
       ) VALUES
         ('divine-old', 'divine-orb', 'league-a', 200, 1, 'legacy', 10, 10),
         ('divine-future', 'divine-orb', 'league-a', 300, 1, 'legacy', 30, 30)`,
      `INSERT INTO profit_snapshots (
         id, boss_id, league_id, entry_cost_chaos, expected_return_chaos,
         expected_profit_chaos, roi_percent, calculated_at, created_at
       ) VALUES ('snapshot-a', 'boss-1', 'league-a', 1, 1, 0, 0, 20, 20)`
    ]);

    await executeMigration(3);

    await expect(
      query<{ divineRate: number }>(
        `SELECT divine_orb_chaos_value AS divineRate
         FROM profit_snapshots
         WHERE id = 'snapshot-a'`
      )
    ).resolves.toEqual([{ divineRate: 200 }]);
  });

  it("fails preflight when a snapshot has only a future Divine price", async () => {
    await applyLegacyMigrations();
    await seedBase();
    await executeStatements([
      `INSERT INTO item_prices (
         id, item_id, league_id, chaos_value, divine_value,
         source, captured_at, created_at
       ) VALUES ('divine-future', 'divine-orb', 'league-a', 300, 1, 'legacy', 30, 30)`,
      `INSERT INTO profit_snapshots (
         id, boss_id, league_id, entry_cost_chaos, expected_return_chaos,
         expected_profit_chaos, roi_percent, calculated_at, created_at
       ) VALUES ('snapshot-a', 'boss-1', 'league-a', 1, 1, 0, 0, 20, 20)`
    ]);

    await expect(executeMigration(3)).rejects.toThrow(
      /migration_divine_price_guard_check/
    );
    await expect(
      query<{ count: number }>(
        "SELECT COUNT(*) AS count FROM profit_snapshots"
      )
    ).resolves.toEqual([{ count: 1 }]);
  });

  it("rejects fractional unknown drop counts in the migrated schema", async () => {
    await applyAllMigrations();
    await executeStatements([
      `INSERT INTO leagues (id, name, is_active, created_at, updated_at)
       VALUES ('league-a', 'League A', 1, 1, 1)`,
      `INSERT INTO items (id, name, category, created_at, updated_at)
       VALUES ('item-1', 'Item', 'currency', 1, 1)`,
      `INSERT INTO bosses (id, name, slug, is_active, created_at, updated_at)
       VALUES ('boss-1', 'Boss', 'boss', 1, 1, 1)`
    ]);

    await expect(
      env.DB.prepare(
        `INSERT INTO profit_snapshots (
          id, boss_id, league_id, sync_run_id, entry_cost_chaos,
          expected_return_chaos, expected_profit_chaos, roi_percent,
          divine_orb_chaos_value, is_complete, unknown_drop_count,
          calculated_at, created_at
        ) VALUES (
          'snapshot-fractional', 'boss-1', 'league-a',
          'migration-legacy-price-set', 1, 1, 0, 0, 200, 0, 0.5, 1, 1
        )`
      ).run()
    ).rejects.toThrow(/profit_snapshots_unknown_drop_count_check/);
  });

  it.each([
    {
      table: "boss_entry_costs",
      guard: "migration_entry_component_duplicate_guard_check",
      insert: `INSERT INTO boss_entry_costs (
        id, boss_id, item_id, quantity, created_at, updated_at
      ) VALUES
        ('entry-1', 'boss-1', 'legacy-unique', 1, 1, 1),
        ('entry-2', 'boss-1', 'legacy-unique', 2, 1, 1)`
    },
    {
      table: "boss_drops",
      guard: "migration_boss_drop_duplicate_guard_check",
      insert: `INSERT INTO boss_drops (
        id, boss_id, item_id, estimated_drop_rate,
        min_quantity, max_quantity, created_at, updated_at
      ) VALUES
        ('drop-1', 'boss-1', 'legacy-unique', 0.1, 1, 1, 1, 1),
        ('drop-2', 'boss-1', 'legacy-unique', 0.2, 1, 1, 1, 1)`
    }
  ])("fails preflight for duplicate rows in $table", async ({
    table,
    guard,
    insert
  }) => {
    await applyLegacyMigrations();
    await seedBase();
    await env.DB.prepare(insert).run();

    await expect(executeMigration(3)).rejects.toThrow(new RegExp(guard));
    await expect(
      query<{ count: number }>(
        `SELECT COUNT(*) AS count FROM ${table}`
      )
    ).resolves.toEqual([{ count: 2 }]);
  });

  it("uses D1 deferred foreign keys instead of disabling enforcement", () => {
    expect(migrationSql[3]).toContain("PRAGMA defer_foreign_keys = true");
    expect(migrationSql[3]).not.toMatch(/PRAGMA foreign_keys\s*=/i);
  });
});
