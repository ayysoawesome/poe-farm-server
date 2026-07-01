import { env } from "cloudflare:workers";
import { describe, expect, it, beforeEach } from "vitest";

import { app } from "../src/index";

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

const createLatestItemPricesTable = `
  CREATE TABLE IF NOT EXISTS latest_item_prices (
    item_id text NOT NULL,
    league_id text NOT NULL,
    source text NOT NULL,
    sync_run_id text NOT NULL,
    chaos_value real NOT NULL,
    captured_at integer NOT NULL,
    created_at integer NOT NULL,
    updated_at integer NOT NULL,
    PRIMARY KEY (item_id, league_id, source)
  )
`;

const createLatestProfitSnapshotsTable = `
  CREATE TABLE IF NOT EXISTS latest_profit_snapshots (
    id text NOT NULL,
    boss_id text NOT NULL,
    league_id text NOT NULL,
    sync_run_id text NOT NULL,
    entry_cost_chaos real NOT NULL,
    expected_return_chaos real NOT NULL,
    expected_profit_chaos real NOT NULL,
    roi_percent real NOT NULL,
    divine_orb_chaos_value real NOT NULL,
    is_complete integer NOT NULL,
    unknown_drop_count integer NOT NULL,
    calculated_at integer NOT NULL,
    created_at integer NOT NULL,
    updated_at integer NOT NULL,
    PRIMARY KEY (boss_id, league_id)
  )
`;

describe.sequential("public metadata routes", () => {
  beforeEach(async () => {
    await env.DB.prepare(createSyncRunsTable).run();
    await env.DB.prepare(createLatestItemPricesTable).run();
    await env.DB.prepare(createLatestProfitSnapshotsTable).run();
    await env.DB.prepare("DELETE FROM sync_runs").run();
    await env.DB.prepare("DELETE FROM latest_item_prices").run();
    await env.DB.prepare("DELETE FROM latest_profit_snapshots").run();
  });

  it("returns the current Divine Orb to Chaos rate for a league", async () => {
    await env.DB.prepare(
      `INSERT INTO latest_item_prices (
        item_id, league_id, source, sync_run_id, chaos_value,
        captured_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind("divine-orb", "league-1", "poe_ninja", "sync-1", 225.5, 1000, 900, 1000)
      .run();

    const response = await app.request(
      "/api/prices/divine-chaos?leagueId=league-1",
      undefined,
      env
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      data: {
        leagueId: "league-1",
        chaosValue: 225.5,
        capturedAt: 1000,
        syncRunId: "sync-1"
      }
    });
  });

  it("returns null public freshness timestamps when no sync or recalculation exists", async () => {
    const response = await app.request(
      "/api/status?leagueId=league-1",
      undefined,
      env
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      data: {
        leagueId: "league-1",
        lastSuccessfulSyncFinishedAt: null,
        lastRecalculatedAt: null
      }
    });
  });

  it("returns the latest successful sync and latest recalculation timestamp", async () => {
    await env.DB.batch([
      env.DB.prepare(
        "INSERT INTO sync_runs (id, type, status, started_at, finished_at, message, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).bind("sync-old", "full", "success", 100, 200, null, 100),
      env.DB.prepare(
        "INSERT INTO sync_runs (id, type, status, started_at, finished_at, message, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).bind("sync-failed", "full", "failed", 300, 400, "failed", 300),
      env.DB.prepare(
        "INSERT INTO sync_runs (id, type, status, started_at, finished_at, message, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).bind("sync-new", "full", "success", 500, 600, null, 500),
      env.DB.prepare(
        `INSERT INTO latest_profit_snapshots (
          id, boss_id, league_id, sync_run_id, entry_cost_chaos,
          expected_return_chaos, expected_profit_chaos, roi_percent,
          divine_orb_chaos_value, is_complete, unknown_drop_count,
          calculated_at, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind("profit-a", "boss-a", "league-1", "sync-new", 1, 2, 1, 100, 200, 1, 0, 700, 700, 700),
      env.DB.prepare(
        `INSERT INTO latest_profit_snapshots (
          id, boss_id, league_id, sync_run_id, entry_cost_chaos,
          expected_return_chaos, expected_profit_chaos, roi_percent,
          divine_orb_chaos_value, is_complete, unknown_drop_count,
          calculated_at, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind("profit-b", "boss-b", "league-1", "sync-new", 1, 3, 2, 200, 200, 1, 0, 800, 800, 800)
    ]);

    const response = await app.request(
      "/api/status?leagueId=league-1",
      undefined,
      env
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      data: {
        leagueId: "league-1",
        lastSuccessfulSyncFinishedAt: 600,
        lastRecalculatedAt: 800
      }
    });
  });
});
