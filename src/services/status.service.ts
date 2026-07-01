import { createDb } from "../db/client";
import type { Env } from "../env";
import { findLatestProfitRecalculatedAt } from "../repositories/profit.repository";
import { findLatestSuccessfulSyncFinishedAt } from "../repositories/sync.repository";

export class StatusService {
  constructor(private readonly env: Env) {}

  async getFreshness(leagueId: string) {
    const db = createDb(this.env.DB);
    const [lastSuccessfulSyncFinishedAt, lastRecalculatedAt] =
      await Promise.all([
        findLatestSuccessfulSyncFinishedAt(db),
        findLatestProfitRecalculatedAt(db, leagueId)
      ]);

    return {
      leagueId,
      lastSuccessfulSyncFinishedAt,
      lastRecalculatedAt
    };
  }
}
