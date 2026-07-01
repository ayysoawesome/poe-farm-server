import { AppError } from "../utils/errors";
import { createDb } from "../db/client";
import type { Env } from "../env";
import {
  listActiveBosses,
  listBossDrops,
  listBossEntryComponents
} from "../repositories/boss.repository";
import { listActivePoeNinjaLeagues } from "../repositories/league.repository";
import { findLatestPrices } from "../repositories/price.repository";
import {
  findLatestProfitSnapshot,
  listProfitHistory,
  upsertLatestProfitSnapshot
} from "../repositories/profit.repository";
import {
  getCachedJson,
  profitCacheKey,
  setCachedJson
} from "../utils/cache";
import { createId, nowMs } from "../utils/time";
import {
  profitSnapshotSchema,
  type ProfitSnapshot
} from "../schemas/profit.schema";

const DIVINE_ORB_ITEM_ID = "divine-orb";

export type PricedEntryComponent = {
  itemId: string;
  itemName: string;
  quantity: number;
};

export type PricedDrop = {
  itemId: string;
  itemName: string;
  dropRate: number | null;
};

export type ProfitCalculationInput = {
  entryComponents: readonly PricedEntryComponent[];
  drops: readonly PricedDrop[];
  prices: ReadonlyMap<string, number>;
};

export type ProfitCalculation = {
  entryCostChaos: number;
  expectedReturnChaos: number;
  expectedProfitChaos: number;
  roiPercent: number;
  isComplete: boolean;
  unknownDropCount: number;
};

const requirePrice = (
  prices: ReadonlyMap<string, number>,
  itemId: string,
  itemName: string
): number => {
  const price = prices.get(itemId);
  if (price === undefined) {
    throw new AppError(
      503,
      "MISSING_ITEM_PRICE",
      `Missing price for ${itemName} (${itemId})`
    );
  }
  return price;
};

const isMissingPriceError = (error: unknown): boolean =>
  error instanceof AppError &&
  (error.code === "MISSING_DIVINE_ORB_PRICE" ||
    error.code === "MISSING_ITEM_PRICE");

export const calculateProfit = ({
  entryComponents,
  drops,
  prices
}: ProfitCalculationInput): ProfitCalculation => {
  const entryCostChaos = entryComponents.reduce(
    (total, cost) =>
      total + cost.quantity * requirePrice(prices, cost.itemId, cost.itemName),
    0
  );

  let unknownDropCount = 0;
  let expectedReturnChaos = 0;
  for (const drop of drops) {
    if (drop.dropRate === null) {
      unknownDropCount += 1;
      continue;
    }
    const price = prices.get(drop.itemId);
    if (price === undefined) {
      unknownDropCount += 1;
      continue;
    }
    expectedReturnChaos += drop.dropRate * price;
  }

  const expectedProfitChaos = expectedReturnChaos - entryCostChaos;
  const roiPercent =
    entryCostChaos > 0 ? (expectedProfitChaos / entryCostChaos) * 100 : 0;

  return {
    entryCostChaos,
    expectedReturnChaos,
    expectedProfitChaos,
    roiPercent,
    isComplete: unknownDropCount === 0,
    unknownDropCount
  };
};

export class ProfitService {
  constructor(private readonly env: Env) {}

  async calculateAndStore(bossId: string, leagueId: string, syncRunId: string) {
    const db = createDb(this.env.DB);
    const [entryComponents, drops] = await Promise.all([
      listBossEntryComponents(db, bossId),
      listBossDrops(db, bossId)
    ]);
    if (entryComponents.length === 0) {
      throw new AppError(
        500,
        "BOSS_ENTRY_COMPONENTS_MISSING",
        `Boss '${bossId}' has no entry components`
      );
    }
    const itemIds = [
      ...entryComponents.map((component) => component.itemId),
      ...drops
        .filter((drop) => drop.dropRate !== null)
        .map((drop) => drop.itemId),
      DIVINE_ORB_ITEM_ID
    ];
    const syncPrices = await findLatestPrices(this.env.DB, itemIds, leagueId);
    const prices = new Map(syncPrices.map((price) => [price.itemId, price.chaosValue]));
    const divineOrbChaosValue = prices.get(DIVINE_ORB_ITEM_ID);
    if (divineOrbChaosValue === undefined) {
      throw new AppError(
        503,
        "MISSING_DIVINE_ORB_PRICE",
        `Missing Divine Orb price for sync run '${syncRunId}' in league '${leagueId}'`
      );
    }
    if (divineOrbChaosValue <= 0) {
      throw new AppError(
        503,
        "INVALID_DIVINE_ORB_PRICE",
        "Divine Orb Chaos value must be positive"
      );
    }
    const calculation = calculateProfit({ entryComponents, drops, prices });
    const timestamp = nowMs();
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
    await upsertLatestProfitSnapshot(this.env.DB, snapshot);
    await setCachedJson(
      this.env.PROFIT_CACHE,
      profitCacheKey(leagueId, bossId),
      snapshot
    );
    return snapshot;
  }

  async recalculateAll(syncRunId: string): Promise<number> {
    const db = createDb(this.env.DB);
    const [activeBosses, activeLeagues] = await Promise.all([
      listActiveBosses(db),
      listActivePoeNinjaLeagues(db)
    ]);
    let count = 0;
    for (const league of activeLeagues) {
      for (const boss of activeBosses) {
        try {
          await this.calculateAndStore(boss.id, league.id, syncRunId);
          count += 1;
        } catch (error) {
          if (isMissingPriceError(error)) continue;
          throw error;
        }
      }
    }
    return count;
  }

  async getLatestCached(
    bossId: string,
    leagueId: string
  ): Promise<{ snapshot: ProfitSnapshot; cache: "hit" | "miss" }> {
    const key = profitCacheKey(leagueId, bossId);
    const cached = await getCachedJson<unknown>(this.env.PROFIT_CACHE, key);
    const parsedCached = profitSnapshotSchema.safeParse(cached);
    if (parsedCached.success) {
      return { snapshot: parsedCached.data, cache: "hit" };
    }
    if (cached !== null) {
      await this.env.PROFIT_CACHE.delete(key);
    }

    const snapshot = await findLatestProfitSnapshot(
      createDb(this.env.DB),
      bossId,
      leagueId
    );
    if (snapshot === null) {
      throw new AppError(
        404,
        "PROFIT_SNAPSHOT_NOT_FOUND",
        `No profit snapshot exists for boss '${bossId}' in league '${leagueId}'`
      );
    }
    await setCachedJson(this.env.PROFIT_CACHE, key, snapshot);
    return { snapshot, cache: "miss" };
  }

  async getHistory(bossId: string, leagueId: string): Promise<ProfitSnapshot[]> {
    return listProfitHistory(createDb(this.env.DB), bossId, leagueId);
  }
}
