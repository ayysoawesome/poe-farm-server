import { env } from "cloudflare:workers";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi
} from "vitest";

import type { Env } from "../src/env";
import { PriceService } from "../src/services/price.service";
import { ProfitService } from "../src/services/profit.service";
import { SyncService } from "../src/services/sync.service";

const testEnv = env as Env;

const createSyncLeasesTable = `
  CREATE TABLE IF NOT EXISTS sync_leases (
    name text PRIMARY KEY NOT NULL,
    owner_id text NOT NULL,
    expires_at integer NOT NULL,
    updated_at integer NOT NULL
  )
`;

const createSyncRunsTable = `
  CREATE TABLE IF NOT EXISTS sync_runs (
    id text PRIMARY KEY NOT NULL,
    type text NOT NULL,
    status text NOT NULL,
    started_at integer NOT NULL,
    finished_at integer,
    message text,
    created_at integer NOT NULL
  )
`;

const expectSyncConflict = async (operation: Promise<unknown>) => {
  await expect(operation).rejects.toMatchObject({
    status: 409,
    code: "SYNC_ALREADY_RUNNING",
    message: "Synchronization is already running"
  });
};

describe.sequential("SyncService lease coordination", () => {
  beforeEach(async () => {
    await env.DB.prepare(createSyncLeasesTable).run();
    await env.DB.prepare(createSyncRunsTable).run();
    await env.DB.prepare("DELETE FROM sync_leases").run();
    await env.DB.prepare("DELETE FROM sync_runs").run();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("rejects runFullSync while the shared lease is active before creating a sync run", async () => {
    const now = Date.now();
    await env.DB.prepare(
      "INSERT INTO sync_leases (name, owner_id, expires_at, updated_at) VALUES (?, ?, ?, ?)"
    )
      .bind("full-sync", "other-owner", now + 60_000, now)
      .run();

    await expectSyncConflict(new SyncService(testEnv).runFullSync());

    const row = await env.DB.prepare(
      "SELECT COUNT(*) AS count FROM sync_runs"
    ).first<{ count: number }>();
    expect(row?.count).toBe(0);
  });

  it("rejects recalculateProfits while the same shared lease is active", async () => {
    const now = Date.now();
    await env.DB.prepare(
      "INSERT INTO sync_leases (name, owner_id, expires_at, updated_at) VALUES (?, ?, ?, ?)"
    )
      .bind("full-sync", "other-owner", now + 60_000, now)
      .run();

    await expectSyncConflict(new SyncService(testEnv).recalculateProfits());
  });

  it("releases the lease when full synchronization fails", async () => {
    const operationError = new Error("price synchronization failed");
    vi.spyOn(SyncService.prototype, "syncLeagues").mockResolvedValue(2);
    vi.spyOn(SyncService.prototype, "syncPrices").mockImplementation(async () => {
      const lease = await env.DB.prepare(
        "SELECT owner_id FROM sync_leases WHERE name = ?"
      )
        .bind("full-sync")
        .first();
      expect(lease).not.toBeNull();
      throw operationError;
    });

    await expect(new SyncService(testEnv).runFullSync()).rejects.toBe(
      operationError
    );

    const lease = await env.DB.prepare(
      "SELECT owner_id FROM sync_leases WHERE name = ?"
    )
      .bind("full-sync")
      .first();
    expect(lease).toBeNull();
  });

  it("runs full synchronization without nested lease acquisition and releases on success", async () => {
    const syncLeagues = vi.spyOn(SyncService.prototype, "syncLeagues").mockImplementation(async () => {
      const lease = await env.DB.prepare(
        "SELECT owner_id FROM sync_leases WHERE name = ?"
      )
        .bind("full-sync")
        .first();
      expect(lease).not.toBeNull();
      return 2;
    });
    const syncPrices = vi.spyOn(PriceService.prototype, "syncPrices").mockImplementation(async () => {
      const lease = await env.DB.prepare(
        "SELECT owner_id FROM sync_leases WHERE name = ?"
      )
        .bind("full-sync")
        .first();
      expect(lease).not.toBeNull();
      return 4;
    });
    const recalculateAll = vi
      .spyOn(ProfitService.prototype, "recalculateAll")
      .mockResolvedValue(3);

    const result = await new SyncService(testEnv).runFullSync();
    expect(result).toMatchObject({
      pricesInserted: 4,
      snapshotsCreated: 3
    });
    expect(syncLeagues).toHaveBeenCalledTimes(1);
    expect(syncPrices).toHaveBeenCalledWith(result.syncRunId);
    expect(syncLeagues.mock.invocationCallOrder[0]).toBeLessThan(
      syncPrices.mock.invocationCallOrder[0] ?? 0
    );
    expect(recalculateAll).toHaveBeenCalledWith(result.syncRunId);

    const lease = await env.DB.prepare(
      "SELECT owner_id FROM sync_leases WHERE name = ?"
    )
      .bind("full-sync")
      .first();
    expect(lease).toBeNull();
  });

  it("keeps an operation error primary and structured-logs a simultaneous release failure", async () => {
    const operationError = new Error("operation failed");
    vi.spyOn(SyncService.prototype, "syncLeagues").mockResolvedValue(2);
    vi.spyOn(SyncService.prototype, "syncPrices").mockImplementation(async () => {
      await env.DB.prepare("DROP TABLE sync_leases").run();
      throw operationError;
    });
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(new SyncService(testEnv).runFullSync()).rejects.toBe(
      operationError
    );

    expect(consoleError).toHaveBeenCalledTimes(1);
    expect(() => JSON.parse(String(consoleError.mock.calls[0]?.[0]))).not.toThrow();
    expect(consoleError.mock.calls[0]?.[0]).toContain("lease");
  });

  it("keeps the sync error primary and structured-logs failed-status recording failure", async () => {
    const operationError = new Error("price sync failed");
    vi.spyOn(SyncService.prototype, "syncLeagues").mockResolvedValue(2);
    vi.spyOn(SyncService.prototype, "syncPrices").mockImplementation(async () => {
      await env.DB.prepare("DROP TABLE sync_runs").run();
      throw operationError;
    });
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(new SyncService(testEnv).runFullSync()).rejects.toBe(
      operationError
    );

    expect(consoleError).toHaveBeenCalledTimes(1);
    const logEntry = String(consoleError.mock.calls[0]?.[0]);
    expect(() => JSON.parse(logEntry)).not.toThrow();
    expect(logEntry).toContain("sync run");
    expect(logEntry).toContain("sync_runs");
  });

  it("propagates release failure when recalculation succeeds", async () => {
    await env.DB.prepare(
      "INSERT INTO sync_runs (id, type, status, started_at, finished_at, message, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
      .bind("sync-success", "full", "success", 1, 2, null, 1)
      .run();
    vi.spyOn(ProfitService.prototype, "recalculateAll").mockImplementation(
      async (syncRunId) => {
        expect(syncRunId).toBe("sync-success");
        await env.DB.prepare("DROP TABLE sync_leases").run();
        return 2;
      }
    );

    await expect(new SyncService(testEnv).recalculateProfits()).rejects.toThrow(
      /sync_leases/i
    );
  });
});
