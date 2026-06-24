import { createDb } from "../db/client";
import type { Env } from "../env";
import {
  acquireSyncLease,
  releaseSyncLease
} from "../repositories/sync-lease.repository";
import {
  createSyncRun,
  findLatestSuccessfulSyncRun,
  finishSyncRun
} from "../repositories/sync.repository";
import type { SyncResult } from "../schemas/sync.schema";
import { AppError } from "../utils/errors";
import { createId, nowMs } from "../utils/time";
import { PriceService } from "./price.service";
import { ProfitService } from "./profit.service";

const FULL_SYNC_LEASE_NAME = "full-sync";
const SYNC_LEASE_DURATION_MS = 15 * 60 * 1_000;

export class SyncService {
  constructor(private readonly env: Env) {}

  syncPrices(syncRunId: string): Promise<number> {
    return new PriceService(this.env).syncPrices(syncRunId);
  }

  recalculateProfits(): Promise<number> {
    return this.withSyncLease(async () => {
      const latestRun = await findLatestSuccessfulSyncRun(createDb(this.env.DB));
      if (latestRun === null) {
        throw new AppError(
          503,
          "PRICE_SYNC_RUN_NOT_FOUND",
          "No successful price sync run exists"
        );
      }
      return new ProfitService(this.env).recalculateAll(latestRun.id);
    });
  }

  async runFullSync(): Promise<SyncResult> {
    return this.withSyncLease(async () => {
      const db = createDb(this.env.DB);
      const syncRunId = createId("sync");
      const startedAt = nowMs();
      await createSyncRun(db, {
        id: syncRunId,
        type: "full",
        status: "running",
        startedAt,
        finishedAt: null,
        message: null,
        createdAt: startedAt
      });

      try {
        const pricesInserted = await this.syncPrices(syncRunId);
        const snapshotsCreated = await new ProfitService(
          this.env
        ).recalculateAll(syncRunId);
        await finishSyncRun(
          db,
          syncRunId,
          "success",
          nowMs(),
          `Inserted ${pricesInserted} prices and created ${snapshotsCreated} snapshots`
        );
        return { syncRunId, pricesInserted, snapshotsCreated };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown sync failure";
        try {
          await finishSyncRun(db, syncRunId, "failed", nowMs(), message);
        } catch (recordingError) {
          console.error(
            JSON.stringify({
              message: "Failed to record failed sync run",
              syncRunId,
              error:
                recordingError instanceof Error
                  ? recordingError.message
                  : String(recordingError)
            })
          );
        }
        throw error;
      }
    });
  }

  private async withSyncLease<T>(operation: () => Promise<T>): Promise<T> {
    const ownerId = createId("sync-lease");
    const acquiredAt = nowMs();
    const acquired = await acquireSyncLease(
      this.env.DB,
      FULL_SYNC_LEASE_NAME,
      ownerId,
      acquiredAt,
      acquiredAt + SYNC_LEASE_DURATION_MS
    );
    if (!acquired) {
      throw new AppError(
        409,
        "SYNC_ALREADY_RUNNING",
        "Synchronization is already running"
      );
    }

    let operationFailed = false;
    try {
      return await operation();
    } catch (error) {
      operationFailed = true;
      throw error;
    } finally {
      try {
        await releaseSyncLease(this.env.DB, FULL_SYNC_LEASE_NAME, ownerId);
      } catch (releaseError) {
        if (!operationFailed) {
          throw releaseError;
        }
        console.error(
          JSON.stringify({
            message: "Failed to release synchronization lease",
            leaseName: FULL_SYNC_LEASE_NAME,
            ownerId,
            error:
              releaseError instanceof Error
                ? releaseError.message
                : String(releaseError)
          })
        );
      }
    }
  }
}
