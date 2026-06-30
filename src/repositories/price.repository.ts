import { and, desc, eq, inArray } from "drizzle-orm";

import type { Database } from "../db/client";
import { itemPrices, latestItemPrices, manualItemPrices } from "../db/schema";

export type NewItemPrice = typeof itemPrices.$inferInsert;
export type ItemPrice = typeof itemPrices.$inferSelect;
export type LatestItemPrice = typeof latestItemPrices.$inferSelect;
export type ManualItemPrice = typeof manualItemPrices.$inferSelect;

const MAX_QUERY_BINDINGS = 90;
const MAX_INSERT_ROWS = 12;

const chunk = <T>(values: readonly T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size));
  }
  return chunks;
};

const compareStrings = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

const latestToItemPrice = (
  price: LatestItemPrice,
  id = `${price.itemId}:${price.leagueId}:${price.source}`
): ItemPrice => ({
  id,
  itemId: price.itemId,
  leagueId: price.leagueId,
  syncRunId: price.syncRunId,
  chaosValue: price.chaosValue,
  source: price.source,
  capturedAt: price.capturedAt,
  createdAt: price.createdAt
});

export const findLatestPricesForItemsAndLeagues = async (
  database: D1Database,
  itemIds: readonly string[],
  leagueIds: readonly string[]
): Promise<ItemPrice[]> => {
  const uniqueItemIds = [...new Set(itemIds)];
  const uniqueLeagueIds = [...new Set(leagueIds)];
  if (uniqueItemIds.length === 0 || uniqueLeagueIds.length === 0) return [];

  const itemChunkSize = Math.min(
    uniqueItemIds.length,
    MAX_QUERY_BINDINGS -
      Math.min(uniqueLeagueIds.length, MAX_QUERY_BINDINGS / 2)
  );
  const leagueChunkSize = MAX_QUERY_BINDINGS - itemChunkSize;
  const pricesByItemAndLeague = new Map<string, Map<string, ItemPrice>>();

  for (const itemIdChunk of chunk(uniqueItemIds, itemChunkSize)) {
    for (const leagueIdChunk of chunk(uniqueLeagueIds, leagueChunkSize)) {
      const itemPlaceholders = itemIdChunk.map(() => "?").join(", ");
      const leaguePlaceholders = leagueIdChunk.map(() => "?").join(", ");
      const latestQuery = `
        WITH ranked_prices AS (
          SELECT
            item_id AS itemId,
            league_id AS leagueId,
            source,
            sync_run_id AS syncRunId,
            chaos_value AS chaosValue,
            captured_at AS capturedAt,
            created_at AS createdAt,
            updated_at AS updatedAt,
            ROW_NUMBER() OVER (
              PARTITION BY item_id, league_id
              ORDER BY captured_at DESC, source DESC
            ) AS row_number
          FROM latest_item_prices
          WHERE item_id IN (${itemPlaceholders})
            AND league_id IN (${leaguePlaceholders})
        )
        SELECT
          itemId,
          leagueId,
          source,
          syncRunId,
          chaosValue,
          capturedAt,
          createdAt,
          updatedAt
        FROM ranked_prices
        WHERE row_number = 1
      `;
      let shouldFallBackToHistory = false;
      try {
        const latestResult = await database
          .prepare(latestQuery)
          .bind(...itemIdChunk, ...leagueIdChunk)
          .all<LatestItemPrice>();
        shouldFallBackToHistory = latestResult.results.length === 0;
        for (const price of latestResult.results) {
          let pricesByLeague = pricesByItemAndLeague.get(price.itemId);
          if (pricesByLeague === undefined) {
            pricesByLeague = new Map();
            pricesByItemAndLeague.set(price.itemId, pricesByLeague);
          }
          pricesByLeague.set(price.leagueId, latestToItemPrice(price));
        }
      } catch {
        // Older databases do not have latest_item_prices yet. Fall back to history.
        shouldFallBackToHistory = true;
      }

      if (!shouldFallBackToHistory) continue;
      const missingItemIds = itemIdChunk;
      const missingItemPlaceholders = missingItemIds.map(() => "?").join(", ");
      const query = `
        WITH ranked_prices AS (
          SELECT
            id,
            sync_run_id AS syncRunId,
            item_id AS itemId,
            league_id AS leagueId,
            chaos_value AS chaosValue,
            source,
            captured_at AS capturedAt,
            created_at AS createdAt,
            ROW_NUMBER() OVER (
              PARTITION BY item_id, league_id
              ORDER BY captured_at DESC, id DESC
            ) AS row_number
          FROM item_prices
          WHERE item_id IN (${missingItemPlaceholders})
            AND league_id IN (${leaguePlaceholders})
        )
        SELECT
          id,
          syncRunId,
          itemId,
          leagueId,
          chaosValue,
          source,
          capturedAt,
          createdAt
        FROM ranked_prices
        WHERE row_number = 1
      `;
      const result = await database
        .prepare(query)
        .bind(...missingItemIds, ...leagueIdChunk)
        .all<ItemPrice>();

      for (const price of result.results) {
        let pricesByLeague = pricesByItemAndLeague.get(price.itemId);
        if (pricesByLeague === undefined) {
          pricesByLeague = new Map();
          pricesByItemAndLeague.set(price.itemId, pricesByLeague);
        }
        pricesByLeague.set(price.leagueId, price);
      }
    }
  }

  return [...pricesByItemAndLeague.values()]
    .flatMap((pricesByLeague) => [...pricesByLeague.values()])
    .sort(
    (left, right) =>
      compareStrings(left.itemId, right.itemId) ||
      compareStrings(left.leagueId, right.leagueId)
    );
};

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

export const listManualItemPrices = async (
  db: Database,
  leagueId: string,
  itemIds: readonly string[]
): Promise<ManualItemPrice[]> => {
  const uniqueItemIds = [...new Set(itemIds)];
  if (uniqueItemIds.length === 0) return [];

  const rows: ManualItemPrice[] = [];
  for (const itemIdChunk of chunk(uniqueItemIds, MAX_QUERY_BINDINGS - 1)) {
    rows.push(
      ...(await db
        .select()
        .from(manualItemPrices)
        .where(
          and(
            eq(manualItemPrices.leagueId, leagueId),
            inArray(manualItemPrices.itemId, itemIdChunk)
          )
        ))
    );
  }
  return rows.sort((left, right) => compareStrings(left.itemId, right.itemId));
};

export const findLatestItemPrice = async (
  db: Database,
  itemId: string,
  leagueId: string
) => {
  try {
    const latestRows = await db
      .select()
      .from(latestItemPrices)
      .where(
        and(
          eq(latestItemPrices.itemId, itemId),
          eq(latestItemPrices.leagueId, leagueId)
        )
      )
      .orderBy(desc(latestItemPrices.capturedAt), desc(latestItemPrices.source))
      .limit(1);
    const latest = latestRows[0];
    if (latest !== undefined) return latestToItemPrice(latest);
  } catch {
    // Older databases do not have latest_item_prices yet. Fall back to history.
  }

  const rows = await db
    .select()
    .from(itemPrices)
    .where(and(eq(itemPrices.itemId, itemId), eq(itemPrices.leagueId, leagueId)))
    .orderBy(desc(itemPrices.capturedAt), desc(itemPrices.id))
    .limit(1);
  return rows[0] ?? null;
};

export const findLatestPrices = async (
  database: D1Database,
  itemIds: readonly string[],
  leagueId: string
): Promise<ItemPrice[]> =>
  findLatestPricesForItemsAndLeagues(database, itemIds, [leagueId]);

export const insertItemPrices = async (
  db: Database,
  prices: readonly NewItemPrice[]
): Promise<number> => {
  if (prices.length === 0) return 0;
  const inserts = chunk(prices, MAX_INSERT_ROWS).map((priceChunk) =>
    db.insert(itemPrices).values(priceChunk)
  );
  await db.batch(
    inserts as [typeof inserts[number], ...Array<typeof inserts[number]>]
  );
  return prices.length;
};

export const upsertLatestItemPrices = async (
  database: D1Database,
  prices: readonly NewItemPrice[]
): Promise<number> => {
  let changed = 0;
  for (const price of prices) {
    const result = await database
      .prepare(
        `INSERT INTO latest_item_prices (
          item_id, league_id, source, sync_run_id, chaos_value,
          captured_at, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(item_id, league_id, source) DO UPDATE SET
          sync_run_id = excluded.sync_run_id,
          chaos_value = excluded.chaos_value,
          captured_at = excluded.captured_at,
          updated_at = excluded.updated_at
        WHERE latest_item_prices.chaos_value != excluded.chaos_value`
      )
      .bind(
        price.itemId,
        price.leagueId,
        price.source,
        price.syncRunId,
        price.chaosValue,
        price.capturedAt,
        price.createdAt,
        price.createdAt
      )
      .run();
    changed += result.meta.changes;
  }
  return changed;
};
