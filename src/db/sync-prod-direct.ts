import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { randomUUID } from "node:crypto";

import {
  calculateProfit,
  type PricedDrop,
  type PricedEntryComponent
} from "../services/profit.service";
import {
  PoeNinjaPriceProvider,
  type PriceProviderMapping,
  type SyncedEconomyLeague
} from "../services/price.service";

const ACCOUNT_ID =
  process.env.CLOUDFLARE_ACCOUNT_ID ?? "20891306671bae86ec82efbeffa433b1";
const DATABASE_ID =
  process.env.CLOUDFLARE_D1_DATABASE_ID ??
  "b87e1d6c-e99e-42bb-9fea-59c0abd9ea92";
const D1_QUERY_URL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`;
const DIVINE_ORB_ITEM_ID = "divine-orb";

type D1QueryResult<T> = {
  result?: Array<{ results?: T[]; success?: boolean }>;
  success?: boolean;
  errors?: Array<{ message?: string }>;
};

type LeagueRow = {
  id: string;
  name: string;
  externalName: string;
};

type BossRow = {
  id: string;
  name: string;
};

type ManualPriceRow = {
  itemId: string;
  leagueId: string;
  chaosValue: number;
};

const nowMs = () => Date.now();

const createId = (prefix: string): string => `${prefix}_${randomUUID()}`;

const sqlString = (value: string | null | undefined): string =>
  value == null ? "NULL" : `'${value.replaceAll("'", "''")}'`;

const sqlValue = (value: unknown): string => {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "1" : "0";
  return sqlString(String(value));
};

const sleep = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const withRetry = async <T>(
  label: string,
  operation: () => Promise<T>,
  attempts = 5
): Promise<T> => {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt === attempts) break;
      const delay = 1_000 * attempt * attempt;
      console.warn(`${label} failed, retrying in ${delay}ms (${attempt}/${attempts})`);
      await sleep(delay);
    }
  }
  throw lastError instanceof Error ? lastError : new Error(`${label} failed`);
};

const groupBy = <T, K extends string>(
  rows: readonly T[],
  getKey: (row: T) => K
): Map<K, T[]> => {
  const groups = new Map<K, T[]>();
  for (const row of rows) {
    const key = getKey(row);
    const group = groups.get(key);
    if (group === undefined) {
      groups.set(key, [row]);
    } else {
      group.push(row);
    }
  }
  return groups;
};

const readWranglerOAuthToken = (): string | undefined => {
  const appData = process.env.APPDATA;
  if (appData === undefined) return undefined;
  try {
    const config = readFileSync(
      join(appData, "xdg.config", ".wrangler", "config", "default.toml"),
      "utf8"
    );
    const match = config.match(/^oauth_token\s*=\s*"([^"]+)"/m);
    return match?.[1];
  } catch {
    return undefined;
  }
};

const getToken = (): string => {
  const token = process.env.CLOUDFLARE_API_TOKEN ?? readWranglerOAuthToken();
  if (token === undefined || token.trim() === "") {
    throw new Error(
      "Set CLOUDFLARE_API_TOKEN or login with wrangler before running this script"
    );
  }
  return token;
};

const d1Query = async <T>(
  token: string,
  sql: string,
  params: readonly unknown[] = []
): Promise<T[]> => {
  return withRetry("D1 query", async () => {
    const response = await fetch(D1_QUERY_URL, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${token}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({ sql, params })
    });
    const payload = (await response.json()) as D1QueryResult<T>;
    if (!response.ok || payload.success !== true) {
      const message =
        payload.errors?.map((error) => error.message).filter(Boolean).join("; ") ??
        response.statusText;
      throw new Error(`D1 query failed: ${message}`);
    }
    const first = payload.result?.[0];
    if (first?.success === false) throw new Error("D1 statement failed");
    return first?.results ?? [];
  });
};

const fetchJsonWithRetry = (url: string, init?: RequestInit): Promise<unknown> =>
  withRetry(`GET ${url}`, async () => {
    const response = await fetch(url, {
      ...init,
      headers: {
        accept: "application/json",
        ...(init?.body === undefined ? {} : { "content-type": "application/json" }),
        "user-agent": "poe-farm-server/0.1.0",
        ...init?.headers
      }
    });
    if (!response.ok) {
      throw new Error(`Request failed with ${response.status}`);
    }
    return response.json();
  });

const execute = (token: string, sql: string, params: readonly unknown[] = []) =>
  d1Query<unknown>(token, sql, params);

const buildInsertStatements = (
  table: string,
  columns: readonly string[],
  rows: readonly unknown[][],
  chunkSize: number
): string[] => {
  const statements: string[] = [];
  for (let offset = 0; offset < rows.length; offset += chunkSize) {
    const chunk = rows.slice(offset, offset + chunkSize);
    statements.push(
      `INSERT OR IGNORE INTO ${table} (${columns.join(", ")}) VALUES ${chunk
        .map((row) => `(${row.map(sqlValue).join(", ")})`)
        .join(", ")};`
    );
  }
  return statements;
};

const loadPoeNinjaMappings = (token: string) =>
  d1Query<PriceProviderMapping>(
    token,
    `SELECT
       mappings.item_id AS itemId,
       items.name AS itemName,
       mappings.external_type AS externalType,
       mappings.external_key AS externalKey
     FROM item_price_mappings mappings
     INNER JOIN items ON items.id = mappings.item_id
     WHERE mappings.provider = 'poe_ninja' AND mappings.is_active = 1
     ORDER BY mappings.external_type, items.name`
  );

const loadManualMappings = (token: string) =>
  d1Query<PriceProviderMapping>(
    token,
    `SELECT
       mappings.item_id AS itemId,
       items.name AS itemName,
       mappings.external_type AS externalType,
       mappings.external_key AS externalKey
     FROM item_price_mappings mappings
     INNER JOIN items ON items.id = mappings.item_id
     WHERE mappings.provider = 'manual' AND mappings.is_active = 1
     ORDER BY items.name`
  );

const buildPoeNinjaLeagueSync = async (
  provider: PoeNinjaPriceProvider
): Promise<{ leagues: SyncedEconomyLeague[]; statements: string[] }> => {
  const leagues = await provider.fetchEconomyLeagues();
  const timestamp = nowMs();
  const statements: string[] = [];
  for (const league of leagues) {
    statements.push(
      `INSERT INTO leagues (
         id, name, external_name, source, is_active, created_at, updated_at
       ) VALUES (${sqlString(league.id)}, ${sqlString(league.name)}, ${sqlString(league.externalName)}, 'poe_ninja', 1, ${timestamp}, ${timestamp})
       ON CONFLICT(id) DO UPDATE SET
         name = excluded.name,
         external_name = excluded.external_name,
         source = 'poe_ninja',
         is_active = 1,
         updated_at = excluded.updated_at;`
    );
  }

  if (leagues.length > 0) {
    statements.push(
      `UPDATE leagues
       SET is_active = 0, updated_at = ${timestamp}
       WHERE source = 'poe_ninja' AND id NOT IN (${leagues
         .map((league) => sqlString(league.id))
         .join(", ")});`
    );
  }
  return { leagues, statements };
};

const main = async () => {
  const token = getToken();
  const startedAt = nowMs();
  const syncRunId = createId("sync-direct");
  const provider = new PoeNinjaPriceProvider(fetchJsonWithRetry);

  try {
    const statements: string[] = [
      `UPDATE sync_runs SET status = 'failed', finished_at = ${startedAt}, message = 'Superseded by direct sync SQL import' WHERE status = 'running' AND id LIKE 'sync-direct_%';`,
      `INSERT OR IGNORE INTO sync_runs (id, type, status, started_at, created_at) VALUES (${sqlString(syncRunId)}, 'direct', 'running', ${startedAt}, ${startedAt});`
    ];
    const leagueSync = await buildPoeNinjaLeagueSync(provider);
    statements.push(...leagueSync.statements);

    const [poeNinjaMappings, manualMappings, manualPrices, bosses] =
      await Promise.all([
        loadPoeNinjaMappings(token),
        loadManualMappings(token),
        d1Query<ManualPriceRow>(
          token,
          `SELECT item_id AS itemId, league_id AS leagueId, chaos_value AS chaosValue
           FROM manual_item_prices`
        ),
        d1Query<BossRow>(
          token,
          "SELECT id, name FROM bosses WHERE is_active = 1 ORDER BY name"
        )
      ]);

    const capturedAt = nowMs();
    const priceRows: unknown[][] = [];
    const priceMapsByLeague = new Map<string, Map<string, number>>();

    for (const league of leagueSync.leagues) {
      const prices = await provider.fetchPrices({
        leagueId: league.id,
        leagueExternalName: league.externalName,
        mappings: poeNinjaMappings,
        capturedAt
      });

      const manualItemIds = new Set(manualMappings.map((mapping) => mapping.itemId));
      for (const row of manualPrices) {
        if (row.leagueId === league.id && manualItemIds.has(row.itemId)) {
          prices.set(row.itemId, row.chaosValue);
        }
      }

      priceMapsByLeague.set(league.id, prices);
      for (const [itemId, chaosValue] of prices) {
        priceRows.push([
          createId("price"),
          itemId,
          league.id,
          syncRunId,
          chaosValue,
          manualItemIds.has(itemId) ? "manual" : "poe_ninja",
          capturedAt,
          capturedAt
        ]);
      }
    }

    statements.push(
      ...buildInsertStatements(
        "item_prices",
        [
        "id",
        "item_id",
        "league_id",
        "sync_run_id",
        "chaos_value",
        "source",
        "captured_at",
        "created_at"
        ],
        priceRows,
        100
      )
    );

    const [entryRows, dropRows] = await Promise.all([
      d1Query<PricedEntryComponent & { bossId: string }>(
        token,
        `SELECT
           entries.boss_id AS bossId,
           entries.item_id AS itemId,
           items.name AS itemName,
           entries.quantity AS quantity
         FROM boss_entry_components entries
         INNER JOIN items ON items.id = entries.item_id`
      ),
      d1Query<PricedDrop & { bossId: string }>(
        token,
        `SELECT
           drops.boss_id AS bossId,
           drops.item_id AS itemId,
           items.name AS itemName,
           drops.drop_rate AS dropRate
         FROM boss_drops drops
         INNER JOIN items ON items.id = drops.item_id`
      )
    ]);

    const entriesByBoss = groupBy(entryRows, (row) => row.bossId);
    const dropsByBoss = groupBy(dropRows, (row) => row.bossId);
    const snapshotRows: unknown[][] = [];
    const calculatedAt = nowMs();

    for (const league of leagueSync.leagues) {
      const prices = priceMapsByLeague.get(league.id);
      if (prices === undefined) throw new Error(`No prices for ${league.id}`);
      const divineOrbChaosValue = prices.get(DIVINE_ORB_ITEM_ID);
      if (divineOrbChaosValue === undefined || divineOrbChaosValue <= 0) {
        console.warn(`Skipping ${league.id}: missing Divine Orb price`);
        continue;
      }

      for (const boss of bosses) {
        const entryComponents = entriesByBoss.get(boss.id) ?? [];
        if (entryComponents.length === 0) {
          throw new Error(`Boss '${boss.id}' has no entry components`);
        }
        let calculation: ReturnType<typeof calculateProfit>;
        try {
          calculation = calculateProfit({
            entryComponents,
            drops: dropsByBoss.get(boss.id) ?? [],
            prices
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Unknown calculation failure";
          if (message.startsWith("Missing price for ")) {
            console.warn(`Skipping ${league.id}/${boss.id}: ${message}`);
            continue;
          }
          throw error;
        }
        snapshotRows.push([
          createId("profit"),
          boss.id,
          league.id,
          syncRunId,
          calculation.entryCostChaos,
          calculation.expectedReturnChaos,
          calculation.expectedProfitChaos,
          calculation.roiPercent,
          divineOrbChaosValue,
          calculation.isComplete ? 1 : 0,
          calculation.unknownDropCount,
          calculatedAt,
          calculatedAt
        ]);
      }
    }

    statements.push(
      ...buildInsertStatements(
        "profit_snapshots",
        [
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
        "created_at"
        ],
        snapshotRows,
        100
      )
    );

    statements.push(
      `UPDATE sync_runs SET status = 'success', finished_at = ${nowMs()}, message = NULL WHERE id = ${sqlString(syncRunId)};`
    );

    const outputPath = resolve(process.argv[2] ?? "drizzle/prod-direct-sync.sql");
    writeFileSync(outputPath, `${statements.join("\n")}\n`, "utf8");

    console.log(
      JSON.stringify(
        {
          syncRunId,
          outputPath,
          leagues: leagueSync.leagues.length,
          pricesInserted: priceRows.length,
          snapshotsCreated: snapshotRows.length
        },
        null,
        2
      )
    );
  } catch (error) {
    throw error;
  }
};

await main();
