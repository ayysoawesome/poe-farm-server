import { createDb } from "../db/client";
import type { Env } from "../env";
import {
  findBossById,
  listActiveBosses,
  listBossDrops,
  listBossEntryComponents
} from "../repositories/boss.repository";
import { findLatestPrices } from "../repositories/price.repository";
import { findLatestProfitSnapshot } from "../repositories/profit.repository";
import { toMoney } from "../schemas/money.schema";
import { AppError } from "../utils/errors";
import { LeagueService } from "./league.service";

export class BossService {
  constructor(private readonly env: Env) {}

  async list(leagueId: string) {
    await new LeagueService(this.env).requireById(leagueId);
    const db = createDb(this.env.DB);
    const activeBosses = await listActiveBosses(db);
    return Promise.all(
      activeBosses.map(async (boss) => ({
        ...boss,
        latestProfit: await findLatestProfitSnapshot(db, boss.id, leagueId)
      }))
    );
  }

  async getDetail(bossId: string, leagueId: string) {
    await new LeagueService(this.env).requireById(leagueId);
    const db = createDb(this.env.DB);
    const boss = await findBossById(db, bossId);
    if (boss === null) {
      throw new AppError(404, "BOSS_NOT_FOUND", `Boss '${bossId}' was not found`);
    }

    const snapshot = await findLatestProfitSnapshot(db, bossId, leagueId);
    if (snapshot === null) {
      throw new AppError(
        404,
        "PROFIT_SNAPSHOT_NOT_FOUND",
        `No profit snapshot exists for boss '${bossId}' in league '${leagueId}'`
      );
    }

    const [entryComponents, drops] = await Promise.all([
      listBossEntryComponents(db, bossId),
      listBossDrops(db, bossId)
    ]);
    const itemIds = [
      ...entryComponents.map((component) => component.itemId),
      ...drops.map((drop) => drop.itemId)
    ];
    const itemPrices = await findLatestPrices(this.env.DB, itemIds, leagueId);
    const prices = new Map(itemPrices.map((price) => [price.itemId, price.chaosValue]));

    return {
      boss,
      entry: {
        components: entryComponents.map((component) => {
          const unitPriceChaos = prices.get(component.itemId);
          if (unitPriceChaos === undefined) {
            throw new AppError(
              503,
              "MISSING_ITEM_PRICE",
              `Missing price for ${component.itemName} (${component.itemId})`
            );
          }
          return {
            item: {
              id: component.itemId,
              name: component.itemName,
              category: component.itemCategory
            },
            quantity: component.quantity,
            unitPrice: toMoney(unitPriceChaos, snapshot.divineOrbChaosValue),
            totalPrice: toMoney(
              unitPriceChaos * component.quantity,
              snapshot.divineOrbChaosValue
            )
          };
        }),
        totalPrice: toMoney(snapshot.entryCostChaos, snapshot.divineOrbChaosValue)
      },
      drops: drops.map((drop) => {
        const priceChaos = prices.get(drop.itemId);
        return {
          item: {
            id: drop.itemId,
            name: drop.itemName,
            category: drop.itemCategory
          },
          dropRate: drop.dropRate,
          dropGroupId: drop.dropGroupId,
          dropGroupType: drop.dropGroupType,
          price:
            priceChaos === undefined
              ? null
              : toMoney(priceChaos, snapshot.divineOrbChaosValue)
        };
      })
    };
  }
}
