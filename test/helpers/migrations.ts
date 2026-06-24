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

export const migrationSql = [
  migration0,
  migration1,
  migration2,
  migration3,
  migration4
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
    "item_prices",
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
  for (const migration of [0, 1, 2, 3, 4]) {
    await executeMigration(migration);
  }
};
