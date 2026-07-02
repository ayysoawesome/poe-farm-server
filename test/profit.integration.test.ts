import { env } from "cloudflare:workers";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { BossService } from "../src/services/boss.service";
import { ProfitService } from "../src/services/profit.service";
import type { Env } from "../src/env";
import {
  applyAllMigrations,
  resetMigrationDatabase
} from "./helpers/migrations";

const testEnv = env as Env;

const insertBaseFixtures = async () => {
  const now = 1_000;
  await env.DB.batch([
    env.DB.prepare(
      "INSERT INTO leagues (id, name, external_name, source, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind("league-1", "League 1", "League 1", "poe_ninja", 1, now, now),
    env.DB.prepare(
      "INSERT INTO bosses (id, name, slug, description, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind("boss-1", "Boss 1", "boss-1", "Boss", 1, now, now),
    env.DB.prepare(
      "INSERT INTO bosses (id, name, slug, description, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind("boss-without-entry", "Boss Without Entry", "boss-without-entry", "Boss", 1, now, now),
    env.DB.prepare(
      "INSERT INTO items (id, name, category, icon_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind("entry-a", "Entry A", "fragment", "https://web.poecdn.com/entry-a.png", now, now),
    env.DB.prepare(
      "INSERT INTO items (id, name, category, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
    ).bind("entry-b", "Entry B", "fragment", now, now),
    env.DB.prepare(
      "INSERT INTO items (id, name, category, icon_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind("known", "Known", "equipment", "https://web.poecdn.com/known.png", now, now),
    env.DB.prepare(
      "INSERT INTO items (id, name, category, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
    ).bind("unknown", "Unknown", "equipment", now, now),
    env.DB.prepare(
      "INSERT INTO items (id, name, category, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
    ).bind("divine-orb", "Divine Orb", "currency", now, now)
  ]);

  await env.DB.batch([
    env.DB.prepare(
      "INSERT INTO boss_entry_components (id, boss_id, item_id, quantity, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind("entry-1", "boss-1", "entry-a", 1, now, now),
    env.DB.prepare(
      "INSERT INTO boss_entry_components (id, boss_id, item_id, quantity, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind("entry-2", "boss-1", "entry-b", 2, now, now),
    env.DB.prepare(
      "INSERT INTO boss_drops (id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind("drop-known", "boss-1", "known", 0.25, "boss-1-one-of", "one_of", null, now, now),
    env.DB.prepare(
      "INSERT INTO boss_drops (id, boss_id, item_id, drop_rate, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind("drop-unknown", "boss-1", "unknown", null, null, now, now),
    env.DB.prepare(
      "INSERT INTO boss_drops (id, boss_id, item_id, drop_rate, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind("drop-empty-boss", "boss-without-entry", "known", 0.25, null, now, now)
  ]);

  await env.DB.batch([
    env.DB.prepare(
      "INSERT INTO sync_runs (id, type, status, started_at, finished_at, message, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind("sync-selected", "full", "success", now, now, null, now),
    env.DB.prepare(
      "INSERT INTO sync_runs (id, type, status, started_at, finished_at, message, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind("sync-other", "full", "success", now, now, null, now),
    env.DB.prepare(
      "INSERT INTO sync_runs (id, type, status, started_at, finished_at, message, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind("sync-without-divine", "full", "success", now, now, null, now)
  ]);

  const prices = [
    ["selected-entry-a", "sync-selected", "entry-a", 10],
    ["selected-entry-b", "sync-selected", "entry-b", 20],
    ["selected-known", "sync-selected", "known", 100],
    ["selected-divine", "sync-selected", "divine-orb", 200],
    ["other-entry-a", "sync-other", "entry-a", 999],
    ["other-entry-b", "sync-other", "entry-b", 999],
    ["other-known", "sync-other", "known", 999],
    ["other-divine", "sync-other", "divine-orb", 100],
    ["without-divine-entry-a", "sync-without-divine", "entry-a", 10],
    ["without-divine-entry-b", "sync-without-divine", "entry-b", 20],
    ["without-divine-known", "sync-without-divine", "known", 100]
  ] as const;

  await env.DB.batch(
    prices.map(([id, syncRunId, itemId, chaosValue]) =>
      env.DB.prepare(
        "INSERT INTO item_prices (id, item_id, league_id, sync_run_id, chaos_value, source, captured_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(id, itemId, "league-1", syncRunId, chaosValue, "test", now, now)
    )
  );

  const latestPrices = [
    ["entry-a", 10],
    ["entry-b", 20],
    ["known", 100],
    ["divine-orb", 200]
  ] as const;
  await env.DB.batch(
    latestPrices.map(([itemId, chaosValue]) =>
      env.DB.prepare(
        `INSERT INTO latest_item_prices (
          item_id, league_id, source, sync_run_id, chaos_value,
          captured_at, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(itemId, "league-1", "test", "sync-selected", chaosValue, now, now, now)
    )
  );
};

describe.sequential("ProfitService snapshot creation", () => {
  beforeEach(async () => {
    vi.useRealTimers();
    await resetMigrationDatabase();
    await applyAllMigrations();
    await insertBaseFixtures();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("creates a snapshot using only the selected synchronized price set", async () => {
    const snapshot = await new ProfitService(testEnv).calculateAndStore(
      "boss-1",
      "league-1",
      "sync-selected"
    );

    expect(snapshot).toMatchObject({
      bossId: "boss-1",
      leagueId: "league-1",
      syncRunId: "sync-selected",
      entryCostChaos: 50,
      expectedReturnChaos: 25,
      divineOrbChaosValue: 200,
      isComplete: false,
      unknownDropCount: 1
    });
  });

  it("stores profit history checkpoints at most once every four hours", async () => {
    const service = new ProfitService(testEnv);

    vi.setSystemTime(new Date("2026-07-02T00:00:00.000Z"));
    await service.calculateAndStore("boss-1", "league-1", "sync-selected");

    vi.setSystemTime(new Date("2026-07-02T03:59:59.000Z"));
    await service.calculateAndStore("boss-1", "league-1", "sync-selected");

    let historyCount = await env.DB.prepare(
      "SELECT COUNT(*) AS count FROM profit_snapshots WHERE boss_id = ? AND league_id = ?"
    )
      .bind("boss-1", "league-1")
      .first<{ count: number }>();
    expect(historyCount?.count).toBe(1);

    vi.setSystemTime(new Date("2026-07-02T04:00:00.000Z"));
    await service.calculateAndStore("boss-1", "league-1", "sync-selected");

    historyCount = await env.DB.prepare(
      "SELECT COUNT(*) AS count FROM profit_snapshots WHERE boss_id = ? AND league_id = ?"
    )
      .bind("boss-1", "league-1")
      .first<{ count: number }>();
    expect(historyCount?.count).toBe(2);
  });

  it("returns latest profit and compact history in boss details", async () => {
    vi.setSystemTime(new Date("2026-07-02T00:00:00.000Z"));
    await new ProfitService(testEnv).calculateAndStore(
      "boss-1",
      "league-1",
      "sync-selected"
    );

    const detail = await new BossService(testEnv).getDetail("boss-1", "league-1");

    expect(detail.profit.latest).toMatchObject({
      bossId: "boss-1",
      leagueId: "league-1",
      entryCost: { chaos: 50, divine: 0.25 },
      expectedReturn: { chaos: 25, divine: 0.125 },
      expectedProfit: { chaos: -25, divine: -0.125 },
      roiPercent: -50,
      isComplete: false,
      unknownDropCount: 1
    });
    expect(detail.profit.history).toHaveLength(1);
    expect(detail.profit.history[0]).toMatchObject({
      bossId: "boss-1",
      leagueId: "league-1",
      expectedProfit: { chaos: -25, divine: -0.125 },
      roiPercent: -50
    });
  });

  it("returns drop group metadata in boss details", async () => {
    await new ProfitService(testEnv).calculateAndStore(
      "boss-1",
      "league-1",
      "sync-selected"
    );

    const detail = await new BossService(testEnv).getDetail("boss-1", "league-1");

    expect(detail.drops).toContainEqual(
      expect.objectContaining({
        item: expect.objectContaining({ id: "known" }),
        dropGroupId: "boss-1-one-of",
        dropGroupType: "one_of"
      })
    );
  });

  it("returns item icon URLs in boss details", async () => {
    await new ProfitService(testEnv).calculateAndStore(
      "boss-1",
      "league-1",
      "sync-selected"
    );

    const detail = await new BossService(testEnv).getDetail("boss-1", "league-1");

    expect(detail.entry.components).toContainEqual(
      expect.objectContaining({
        item: expect.objectContaining({
          id: "entry-a",
          iconUrl: "https://web.poecdn.com/entry-a.png"
        })
      })
    );
    expect(detail.drops).toContainEqual(
      expect.objectContaining({
        item: expect.objectContaining({
          id: "known",
          iconUrl: "https://web.poecdn.com/known.png"
        })
      })
    );
  });

  it("fails when the selected set has no Divine Orb price", async () => {
    await env.DB.prepare(
      "DELETE FROM latest_item_prices WHERE item_id = ? AND league_id = ?"
    ).bind("divine-orb", "league-1").run();

    await expect(
      new ProfitService(testEnv).calculateAndStore(
        "boss-1",
        "league-1",
        "sync-without-divine"
      )
    ).rejects.toMatchObject({ code: "MISSING_DIVINE_ORB_PRICE" });
  });

  it("skips active leagues with missing mandatory prices during full recalculation", async () => {
    const now = 1_000;
    await env.DB.prepare(
      "INSERT INTO leagues (id, name, external_name, source, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
      .bind("new-league", "New League", "New League", "poe_ninja", 1, now, now)
      .run();
    await env.DB.prepare("UPDATE bosses SET is_active = 0 WHERE id = ?")
      .bind("boss-without-entry")
      .run();

    await expect(
      new ProfitService(testEnv).recalculateAll("sync-selected")
    ).resolves.toBe(1);

    const snapshots = await env.DB.prepare(
      "SELECT league_id AS leagueId FROM latest_profit_snapshots ORDER BY league_id"
    ).all<{ leagueId: string }>();
    expect(snapshots.results).toEqual([{ leagueId: "league-1" }]);
  });

  it("fails when an active boss has no entry components", async () => {
    await expect(
      new ProfitService(testEnv).calculateAndStore(
        "boss-without-entry",
        "league-1",
        "sync-selected"
      )
    ).rejects.toMatchObject({ code: "BOSS_ENTRY_COMPONENTS_MISSING" });
  });

  it("recalculates snapshots only for active poe.ninja leagues", async () => {
    const now = 1_000;
    await env.DB.batch([
      env.DB.prepare(
        "UPDATE bosses SET is_active = 0 WHERE id = ?"
      ).bind("boss-without-entry"),
      env.DB.prepare(
        "INSERT INTO leagues (id, name, external_name, source, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).bind("manual-league", "Manual League", "Manual League", "manual", 1, now, now)
    ]);

    await expect(
      new ProfitService(testEnv).recalculateAll("sync-selected")
    ).resolves.toBe(1);

    const snapshots = await env.DB.prepare(
      "SELECT league_id AS leagueId FROM latest_profit_snapshots ORDER BY league_id"
    ).all<{ leagueId: string }>();
    expect(snapshots.results).toEqual([{ leagueId: "league-1" }]);
  });
});
