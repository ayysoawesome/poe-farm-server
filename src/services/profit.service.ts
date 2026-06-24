import { AppError } from "../utils/errors";
import { createDb } from "../db/client";
import type { Env } from "../env";
import {
  listActiveBosses,
  listBossDrops,
  listBossEntryComponents
} from "../repositories/boss.repository";
import { listActiveLeagues } from "../repositories/league.repository";
import { findPricesBySyncRun } from "../repositories/price.repository";
import {
  findLatestProfitSnapshot,
  insertProfitSnapshot
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

  const unknownDropCount = drops.filter((drop) => drop.dropRate === null).length;
  const expectedReturnChaos = drops.reduce((total, drop) => {
    if (drop.dropRate === null) return total;
    return total + drop.dropRate * requirePrice(prices, drop.itemId, drop.itemName);
  }, 0);

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
    const syncPrices = await findPricesBySyncRun(
      this.env.DB,
      syncRunId,
      itemIds,
      leagueId
    );
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
    await insertProfitSnapshot(db, snapshot);
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
      listActiveLeagues(db)
    ]);
    let count = 0;
    for (const league of activeLeagues) {
      for (const boss of activeBosses) {
        await this.calculateAndStore(boss.id, league.id, syncRunId);
        count += 1;
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
}
