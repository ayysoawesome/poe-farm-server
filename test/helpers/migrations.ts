import { env } from "cloudflare:workers";

// @ts-expect-error Vite loads migration SQL as text for the Workers test pool.
import migration0 from "../../drizzle/migrations/0000_noisy_vapor.sql?raw";
// @ts-expect-error Vite loads migration SQL as text for the Workers test pool.
import migration1 from "../../drizzle/migrations/0001_shocking_mantis.sql?raw";
// @ts-expect-error Vite loads migration SQL as text for the Workers test pool.
import migration2 from "../../drizzle/migrations/0002_typical_warstar.sql?raw";
// @ts-expect-error Vite loads migration SQL as text for the Workers test pool.
import migration3 from "../../drizzle/migrations/0003_boss_entry_drop_pricing_model.sql?raw";
// @ts-expect-error Vite loads migration SQL as text for the Workers test pool.
import migration4 from "../../drizzle/migrations/0004_green_outlaw_kid.sql?raw";
// @ts-expect-error Vite loads migration SQL as text for the Workers test pool.
import migration5 from "../../drizzle/migrations/0005_reflective_microbe.sql?raw";
// @ts-expect-error Vite loads migration SQL as text for the Workers test pool.
import migration6 from "../../drizzle/migrations/0006_boss_drop_groups.sql?raw";
// @ts-expect-error Vite loads migration SQL as text for the Workers test pool.
import migration7 from "../../drizzle/migrations/0007_manual_item_prices.sql?raw";
// @ts-expect-error Vite loads migration SQL as text for the Workers test pool.
import migration8 from "../../drizzle/migrations/0008_latest_operational_tables.sql?raw";
// @ts-expect-error Vite loads migration SQL as text for the Workers test pool.
import migration9 from "../../drizzle/migrations/0009_item_divination_card_category.sql?raw";
// @ts-expect-error Vite loads migration SQL as text for the Workers test pool.
import migration10 from "../../drizzle/migrations/0010_boss_icon_url.sql?raw";

export const migrationSql = [
  migration0,
  migration1,
  migration2,
  migration3,
  migration4,
  migration5,
  migration6,
  migration7,
  migration8,
  migration9,
  migration10
];

const splitMigration = (sql: string) =>
  sql
    .split(/-->\s*statement-breakpoint/)
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0);

export const executeMigration = async (index: number) => {
  const statements = splitMigration(migrationSql[index]!);
  await env.DB.batch(statements.map((statement) => env.DB.prepare(statement)));
};

export const executeStatements = async (statements: readonly string[]) => {
  if (statements.length === 0) {
    return;
  }
  await env.DB.batch(statements.map((statement) => env.DB.prepare(statement)));
};

export const query = async <T>(sql: string) => {
  const result = await env.DB.prepare(sql).all<T>();
  return result.results;
};

export const resetMigrationDatabase = async () => {
  const tables = [
    "profit_snapshots",
    "latest_profit_snapshots",
    "item_prices",
    "latest_item_prices",
    "manual_item_prices",
    "item_price_mappings",
    "boss_drops",
    "boss_entry_components",
    "boss_entry_costs",
    "__legacy_profit_snapshots",
    "__legacy_item_prices",
    "__legacy_boss_drops",
    "__legacy_boss_entry_costs",
    "__new_profit_snapshots",
    "__new_item_prices",
    "__new_boss_drops",
    "__new_bosses",
    "__new_items",
    "__migration_divine_price_guard",
    "__migration_entry_component_duplicate_guard",
    "__migration_boss_drop_duplicate_guard",
    "bosses",
    "items",
    "leagues",
    "sync_leases",
    "sync_runs"
  ];
  for (const table of tables) {
    await env.DB.prepare(`DROP TABLE IF EXISTS "${table}"`).run();
  }
};

export const applyLegacyMigrations = async () => {
  for (const migration of [0, 1, 2]) {
    await executeMigration(migration);
  }
};

export const applyAllMigrations = async () => {
  for (const migration of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    await executeMigration(migration);
  }
};
