import { env } from "cloudflare:workers";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createDb } from "../src/db/client";
import type { Env } from "../src/env";
import {
  findPricesBySyncRun,
  findLatestPricesForItemsAndLeagues,
  listManualItemPrices,
  insertItemPrices,
  upsertLatestItemPrices
} from "../src/repositories/price.repository";
import { PriceService } from "../src/services/price.service";

const createItemPricesTable = `
  CREATE TABLE IF NOT EXISTS item_prices (
    id text PRIMARY KEY NOT NULL,
    item_id text NOT NULL,
    league_id text NOT NULL,
    sync_run_id text NOT NULL,
    chaos_value real NOT NULL,
    source text NOT NULL,
    captured_at integer NOT NULL,
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

const createItemsTable = `
  CREATE TABLE IF NOT EXISTS items (
    id text PRIMARY KEY NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    icon_url text,
    trade_url text,
    created_at integer NOT NULL,
    updated_at integer NOT NULL
  )
`;

const createItemPriceMappingsTable = `
  CREATE TABLE IF NOT EXISTS item_price_mappings (
    id text PRIMARY KEY NOT NULL,
    item_id text NOT NULL,
    provider text NOT NULL,
    external_type text NOT NULL,
    external_key text NOT NULL,
    is_active integer DEFAULT true NOT NULL,
    created_at integer NOT NULL,
    updated_at integer NOT NULL
  )
`;

const createLeaguesTable = `
  CREATE TABLE IF NOT EXISTS leagues (
    id text PRIMARY KEY NOT NULL,
    name text NOT NULL,
    external_name text NOT NULL,
    source text DEFAULT 'manual' NOT NULL,
    is_active integer DEFAULT true NOT NULL,
    created_at integer NOT NULL,
    updated_at integer NOT NULL
  )
`;

const createManualItemPricesTable = `
  CREATE TABLE IF NOT EXISTS manual_item_prices (
    id text PRIMARY KEY NOT NULL,
    item_id text NOT NULL,
    league_id text NOT NULL,
    chaos_value real NOT NULL,
    notes text,
    created_at integer NOT NULL,
    updated_at integer NOT NULL
  )
`;

type TestPrice = {
  id: string;
  itemId: string;
  leagueId: string;
  syncRunId?: string;
  chaosValue: number;
  source?: string;
  capturedAt: number;
  createdAt?: number;
};

const insertPrices = async (prices: readonly TestPrice[]) => {
  const statements = prices.map((price) =>
    env.DB.prepare(
      `INSERT INTO item_prices (
        id, item_id, league_id, sync_run_id, chaos_value, source, captured_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      price.id,
      price.itemId,
      price.leagueId,
      price.syncRunId ?? "sync-test",
      price.chaosValue,
      price.source ?? "test",
      price.capturedAt,
      price.createdAt ?? price.capturedAt
    )
  );

  for (let index = 0; index < statements.length; index += 50) {
    await env.DB.batch(statements.slice(index, index + 50));
  }
};

describe.sequential("price repository", () => {
  beforeEach(async () => {
    await env.DB.prepare(createItemPricesTable).run();
    await env.DB.prepare(createLatestItemPricesTable).run();
    await env.DB.prepare("DELETE FROM latest_item_prices").run();
    await env.DB.prepare("DELETE FROM item_prices").run();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns no prices when either requested dimension is empty", async () => {
    await expect(
      findLatestPricesForItemsAndLeagues(env.DB, [], ["league-1"])
    ).resolves.toEqual([]);
    await expect(
      findLatestPricesForItemsAndLeagues(env.DB, ["item-1"], [])
    ).resolves.toEqual([]);
  });

  it("inserts more than 12 prices without exceeding the D1 bind limit", async () => {
    const prices = Array.from({ length: 13 }, (_, index) => ({
      id: `insert-${index}`,
      itemId: `item-${index}`,
      leagueId: "league-1",
      syncRunId: "sync-insert",
      chaosValue: index + 1,
      source: "test",
      capturedAt: 100,
      createdAt: 100
    }));

    await expect(insertItemPrices(createDb(env.DB), prices)).resolves.toBe(13);

    const row = await env.DB.prepare(
      "SELECT COUNT(*) AS count FROM item_prices"
    ).first<{ count: number }>();
    expect(row?.count).toBe(13);
  });

  it("upserts only changed latest prices without appending price history", async () => {
    const first = {
      id: "price-a",
      itemId: "item-a",
      leagueId: "league-1",
      syncRunId: "sync-a",
      chaosValue: 10,
      source: "test",
      capturedAt: 100,
      createdAt: 100
    };

    await expect(upsertLatestItemPrices(env.DB, [first])).resolves.toBe(1);
    await expect(
      upsertLatestItemPrices(env.DB, [
        {
          ...first,
          id: "price-b",
          syncRunId: "sync-b",
          capturedAt: 200,
          createdAt: 200
        }
      ])
    ).resolves.toBe(0);
    await expect(
      upsertLatestItemPrices(env.DB, [
        {
          ...first,
          id: "price-c",
          syncRunId: "sync-c",
          chaosValue: 12,
          capturedAt: 300,
          createdAt: 300
        }
      ])
    ).resolves.toBe(1);

    const latest = await env.DB.prepare(
      `SELECT item_id AS itemId, league_id AS leagueId, source, sync_run_id AS syncRunId,
        chaos_value AS chaosValue, captured_at AS capturedAt, created_at AS createdAt,
        updated_at AS updatedAt
       FROM latest_item_prices`
    ).all<{
      itemId: string;
      leagueId: string;
      source: string;
      syncRunId: string;
      chaosValue: number;
      capturedAt: number;
      createdAt: number;
      updatedAt: number;
    }>();
    const historyCount = await env.DB.prepare(
      "SELECT COUNT(*) AS count FROM item_prices"
    ).first<{ count: number }>();

    expect(latest.results).toEqual([
      {
        itemId: "item-a",
        leagueId: "league-1",
        source: "test",
        syncRunId: "sync-c",
        chaosValue: 12,
        capturedAt: 300,
        createdAt: 100,
        updatedAt: 300
      }
    ]);
    expect(historyCount?.count).toBe(0);
  });

  it("returns the latest price for every requested item and league pair", async () => {
    await insertPrices([
      {
        id: "old-a-1",
        itemId: "item-a",
        leagueId: "league-1",
        chaosValue: 10,
        capturedAt: 100
      },
      {
        id: "new-a-1",
        itemId: "item-a",
        leagueId: "league-1",
        chaosValue: 15,
        capturedAt: 200,
        createdAt: 201
      },
      {
        id: "new-a-2",
        itemId: "item-a",
        leagueId: "league-2",
        chaosValue: 20,
        capturedAt: 150
      },
      {
        id: "new-b-1",
        itemId: "item-b",
        leagueId: "league-1",
        chaosValue: 30,
        capturedAt: 175
      },
      {
        id: "not-requested",
        itemId: "item-c",
        leagueId: "league-1",
        chaosValue: 999,
        capturedAt: 999
      }
    ]);

    await expect(
      findLatestPricesForItemsAndLeagues(
        env.DB,
        ["item-b", "item-a"],
        ["league-2", "league-1"]
      )
    ).resolves.toEqual([
      {
        id: "new-a-1",
        itemId: "item-a",
        leagueId: "league-1",
        syncRunId: "sync-test",
        chaosValue: 15,
        source: "test",
        capturedAt: 200,
        createdAt: 201
      },
      {
        id: "new-a-2",
        itemId: "item-a",
        leagueId: "league-2",
        syncRunId: "sync-test",
        chaosValue: 20,
        source: "test",
        capturedAt: 150,
        createdAt: 150
      },
      {
        id: "new-b-1",
        itemId: "item-b",
        leagueId: "league-1",
        syncRunId: "sync-test",
        chaosValue: 30,
        source: "test",
        capturedAt: 175,
        createdAt: 175
      }
    ]);
  });

  it("breaks equal captured-at ties by descending id", async () => {
    await insertPrices([
      {
        id: "price-a",
        itemId: "item-a",
        leagueId: "league-1",
        chaosValue: 10,
        capturedAt: 200
      },
      {
        id: "price-z",
        itemId: "item-a",
        leagueId: "league-1",
        chaosValue: 25,
        capturedAt: 200
      }
    ]);

    const prices = await findLatestPricesForItemsAndLeagues(
      env.DB,
      ["item-a"],
      ["league-1"]
    );

    expect(prices).toHaveLength(1);
    expect(prices[0]?.id).toBe("price-z");
  });

  it("loads prices only from the requested sync run", async () => {
    await insertPrices([
      {
        id: "run-a-item",
        syncRunId: "sync-a",
        itemId: "item-a",
        leagueId: "league-1",
        chaosValue: 10,
        capturedAt: 100
      },
      {
        id: "run-b-item",
        syncRunId: "sync-b",
        itemId: "item-a",
        leagueId: "league-1",
        chaosValue: 20,
        capturedAt: 200
      },
      {
        id: "run-a-other-league",
        syncRunId: "sync-a",
        itemId: "item-a",
        leagueId: "league-2",
        chaosValue: 30,
        capturedAt: 100
      }
    ]);

    await expect(
      findPricesBySyncRun(env.DB, "sync-a", ["item-a"], "league-1")
    ).resolves.toMatchObject([
      { syncRunId: "sync-a", itemId: "item-a", chaosValue: 10 }
    ]);
  });

  it("deduplicates requested ids and returned pairs", async () => {
    await insertPrices([
      {
        id: "price-a",
        itemId: "item-a",
        leagueId: "league-1",
        chaosValue: 10,
        capturedAt: 100
      }
    ]);

    const prices = await findLatestPricesForItemsAndLeagues(
      env.DB,
      ["item-a", "item-a"],
      ["league-1", "league-1"]
    );

    expect(prices.map(({ itemId, leagueId }) => [itemId, leagueId])).toEqual([
      ["item-a", "league-1"]
    ]);
  });

  it("keeps distinct pairs when ids contain delimiter-like values", async () => {
    const firstItemId = "item-a\u0000league-b";
    const firstLeagueId = "league-c";
    const secondItemId = "item-a";
    const secondLeagueId = "league-b\u0000league-c";
    await insertPrices([
      {
        id: "delimiter-first",
        itemId: firstItemId,
        leagueId: firstLeagueId,
        chaosValue: 10,
        capturedAt: 100
      },
      {
        id: "delimiter-second",
        itemId: secondItemId,
        leagueId: secondLeagueId,
        chaosValue: 20,
        capturedAt: 100
      }
    ]);

    const prices = await findLatestPricesForItemsAndLeagues(
      env.DB,
      [firstItemId, secondItemId],
      [firstLeagueId, secondLeagueId]
    );

    expect(prices).toHaveLength(2);
    expect(prices.map(({ id }) => id).sort()).toEqual([
      "delimiter-first",
      "delimiter-second"
    ]);
  });

  it("loads every pair when league ids exceed the 90-bind budget", async () => {
    const itemIds = ["item-a", "item-b"];
    const leagueIds = Array.from(
      { length: 91 },
      (_, index) => `league-${String(index).padStart(2, "0")}`
    );
    await insertPrices(
      itemIds.flatMap((itemId, itemIndex) =>
        leagueIds.map((leagueId, leagueIndex) => ({
          id: `price-${itemIndex}-${leagueIndex}`,
          itemId,
          leagueId,
          chaosValue: itemIndex * 100 + leagueIndex,
          capturedAt: 100
        }))
      )
    );
    const prepareSpy = vi.spyOn(env.DB, "prepare");

    const prices = await findLatestPricesForItemsAndLeagues(
      env.DB,
      itemIds,
      leagueIds
    );

    expect(prices).toHaveLength(itemIds.length * leagueIds.length);
    expect(new Set(prices.map(({ itemId, leagueId }) => `${itemId}:${leagueId}`)).size)
      .toBe(itemIds.length * leagueIds.length);
    expect(prices[0]).toMatchObject({
      itemId: "item-a",
      leagueId: "league-00"
    });
    expect(prices.at(-1)).toMatchObject({
      itemId: "item-b",
      leagueId: "league-90"
    });
    const latestPriceQueries = prepareSpy.mock.calls
      .map(([query]) => query)
      .filter((query) => query.includes("ROW_NUMBER()"));
    expect(latestPriceQueries.length).toBeGreaterThan(1);
    expect(
      latestPriceQueries.every(
        (query) => (query.match(/\?/g) ?? []).length <= 90
      )
    ).toBe(true);
  });

  it("loads every pair when item ids exceed the 90-bind budget", async () => {
    const itemIds = Array.from(
      { length: 91 },
      (_, index) => `item-${String(index).padStart(2, "0")}`
    );
    const leagueIds = ["league-a", "league-b"];
    await insertPrices(
      itemIds.flatMap((itemId, itemIndex) =>
        leagueIds.map((leagueId, leagueIndex) => ({
          id: `item-heavy-${itemIndex}-${leagueIndex}`,
          itemId,
          leagueId,
          chaosValue: itemIndex * 10 + leagueIndex,
          capturedAt: 100
        }))
      )
    );
    const prepareSpy = vi.spyOn(env.DB, "prepare");

    const prices = await findLatestPricesForItemsAndLeagues(
      env.DB,
      itemIds,
      leagueIds
    );

    expect(prices).toHaveLength(itemIds.length * leagueIds.length);
    const latestPriceQueries = prepareSpy.mock.calls
      .map(([query]) => query)
      .filter((query) => query.includes("ROW_NUMBER()"));
    expect(latestPriceQueries.length).toBeGreaterThan(1);
    expect(
      latestPriceQueries.every(
        (query) => (query.match(/\?/g) ?? []).length <= 90
      )
    ).toBe(true);
  });
});

describe.sequential("PriceService price loading", () => {
  beforeEach(async () => {
    await env.DB.prepare(createItemsTable).run();
    await env.DB.prepare(createItemPriceMappingsTable).run();
    await env.DB.prepare(createLeaguesTable).run();
    await env.DB.prepare(createItemPricesTable).run();
    await env.DB.prepare(createLatestItemPricesTable).run();
    await env.DB.prepare(createManualItemPricesTable).run();
    await env.DB.prepare("DELETE FROM item_prices").run();
    await env.DB.prepare("DELETE FROM latest_item_prices").run();
    await env.DB.prepare("DELETE FROM manual_item_prices").run();
    await env.DB.prepare("DELETE FROM item_price_mappings").run();
    await env.DB.prepare("DELETE FROM items").run();
    await env.DB.prepare("DELETE FROM leagues").run();
    await env.DB.batch([
      env.DB.prepare(
        "INSERT INTO items (id, name, category, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
      ).bind("item-a", "Item A", "test", 1, 1),
      env.DB.prepare(
        "INSERT INTO items (id, name, category, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
      ).bind("item-b", "Item B", "test", 1, 1),
      env.DB.prepare(
        "INSERT INTO item_price_mappings (id, item_id, provider, external_type, external_key, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind("mapping-a", "item-a", "poe_ninja", "Currency", "Item A", 1, 1, 1),
      env.DB.prepare(
        "INSERT INTO item_price_mappings (id, item_id, provider, external_type, external_key, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind("mapping-b", "item-b", "poe_ninja", "Currency", "Item B", 1, 1, 1),
      env.DB.prepare(
        "INSERT INTO leagues (id, name, external_name, source, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).bind("league-1", "League 1", "League 1", "poe_ninja", 1, 1, 1),
      env.DB.prepare(
        "INSERT INTO leagues (id, name, external_name, source, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).bind("league-2", "League 2", "League 2", "poe_ninja", 1, 1, 1),
      env.DB.prepare(
        "INSERT INTO leagues (id, name, external_name, source, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).bind("manual-league", "Manual League", "Manual League", "manual", 1, 1, 1)
    ]);
    await insertPrices([
      {
        id: "previous-a-1",
        itemId: "item-a",
        leagueId: "league-1",
        chaosValue: 10,
        capturedAt: 100
      },
      {
        id: "previous-a-2",
        itemId: "item-a",
        leagueId: "league-2",
        chaosValue: 20,
        capturedAt: 100
      },
      {
        id: "previous-b-1",
        itemId: "item-b",
        leagueId: "league-1",
        chaosValue: 30,
        capturedAt: 100
      }
    ]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("loads active mappings by provider and writes latest prices without appending history", async () => {
    const prepareSpy = vi.spyOn(env.DB, "prepare");

    await expect(
      new PriceService({
        ...(env as Env),
        PRICE_SYNC_PROVIDER: "mock"
      }).syncPrices("sync-new")
    ).resolves.toBe(4);

    const mappingSelects = prepareSpy.mock.calls.filter(([query]) => {
      const normalized = query.toLowerCase();
      return normalized.includes("from") && normalized.includes("item_price_mappings");
    });
    expect(mappingSelects).toHaveLength(3);
    const latest = await env.DB.prepare(
      `SELECT DISTINCT sync_run_id AS syncRunId, captured_at AS capturedAt
       FROM latest_item_prices
       WHERE source = 'mock'`
    ).all<{ syncRunId: string; capturedAt: number }>();
    const historyCount = await env.DB.prepare(
      "SELECT COUNT(*) AS count FROM item_prices WHERE source = 'mock'"
    ).first<{ count: number }>();
    expect(latest.results).toHaveLength(1);
    expect(latest.results[0]?.syncRunId).toBe("sync-new");
    expect(historyCount?.count).toBe(0);
  });

  it("writes manual mapped prices from manual item prices into the sync run", async () => {
    await env.DB.batch([
      env.DB.prepare(
        "INSERT INTO item_price_mappings (id, item_id, provider, external_type, external_key, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind("mapping-manual", "item-b", "manual", "Manual", "item-b", 1, 1, 1),
      env.DB.prepare(
        "INSERT INTO manual_item_prices (id, item_id, league_id, chaos_value, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).bind("manual-b-1", "item-b", "league-1", 55, "manual test", 1, 2)
    ]);

    await expect(
      new PriceService({
        ...(env as Env),
        PRICE_SYNC_PROVIDER: "mock"
      }).syncPrices("sync-manual")
    ).resolves.toBe(5);

    const manualPrice = await env.DB.prepare(
      `SELECT item_id AS itemId, league_id AS leagueId, sync_run_id AS syncRunId, chaos_value AS chaosValue, source
       FROM latest_item_prices
       WHERE source = 'manual'`
    ).first<{
      itemId: string;
      leagueId: string;
      syncRunId: string;
      chaosValue: number;
      source: string;
    }>();

    expect(manualPrice).toEqual({
      itemId: "item-b",
      leagueId: "league-1",
      syncRunId: "sync-manual",
      chaosValue: 55,
      source: "manual"
    });
  });

  it("lists manual prices only for requested mappings and league", async () => {
    await env.DB.batch([
      env.DB.prepare(
        "INSERT INTO manual_item_prices (id, item_id, league_id, chaos_value, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).bind("manual-a", "item-a", "league-1", 11, null, 1, 1),
      env.DB.prepare(
        "INSERT INTO manual_item_prices (id, item_id, league_id, chaos_value, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).bind("manual-b", "item-b", "league-2", 22, null, 1, 1)
    ]);

    await expect(
      listManualItemPrices(createDb(env.DB), "league-1", ["item-a", "item-b"])
    ).resolves.toMatchObject([
      { itemId: "item-a", leagueId: "league-1", chaosValue: 11 }
    ]);
  });

  it("looks up previous prices without delimiter-key collisions", async () => {
    const firstItemId = "item-a\u0000league-b";
    const firstLeagueId = "league-c";
    const secondItemId = "item-a";
    const secondLeagueId = "league-b\u0000league-c";
    await env.DB.prepare("DELETE FROM item_prices").run();
    await env.DB.prepare("DELETE FROM item_price_mappings").run();
    await env.DB.prepare("DELETE FROM items").run();
    await env.DB.prepare("DELETE FROM leagues").run();
    await env.DB.batch([
      env.DB.prepare(
        "INSERT INTO items (id, name, category, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
      ).bind(firstItemId, "First Item", "test", 1, 1),
      env.DB.prepare(
        "INSERT INTO items (id, name, category, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
      ).bind(secondItemId, "Second Item", "test", 1, 1),
      env.DB.prepare(
        "INSERT INTO item_price_mappings (id, item_id, provider, external_type, external_key, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind("mapping-delimiter-first", firstItemId, "poe_ninja", "Currency", "First Item", 1, 1, 1),
      env.DB.prepare(
        "INSERT INTO item_price_mappings (id, item_id, provider, external_type, external_key, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind("mapping-delimiter-second", secondItemId, "poe_ninja", "Currency", "Second Item", 1, 1, 1),
      env.DB.prepare(
        "INSERT INTO leagues (id, name, external_name, source, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).bind(firstLeagueId, "First League", firstLeagueId, "poe_ninja", 1, 1, 1),
      env.DB.prepare(
        "INSERT INTO leagues (id, name, external_name, source, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).bind(secondLeagueId, "Second League", secondLeagueId, "poe_ninja", 1, 1, 1)
    ]);
    await insertPrices([
      {
        id: "previous-delimiter-first",
        itemId: firstItemId,
        leagueId: firstLeagueId,
        chaosValue: 10,
        capturedAt: 100
      },
      {
        id: "previous-delimiter-second",
        itemId: secondItemId,
        leagueId: secondLeagueId,
        chaosValue: 30,
        capturedAt: 100
      }
    ]);

    await expect(
      new PriceService({
        ...(env as Env),
        PRICE_SYNC_PROVIDER: "mock"
      }).syncPrices("sync-delimiter")
    ).resolves.toBe(4);

    const result = await env.DB.prepare(
      `SELECT
        item_id AS itemId,
        league_id AS leagueId,
        sync_run_id AS syncRunId,
        chaos_value AS chaosValue
      FROM latest_item_prices
      WHERE source = 'mock'`
    ).all<{
      itemId: string;
      leagueId: string;
      syncRunId: string;
      chaosValue: number;
    }>();
    const first = result.results.find(
      (price) =>
        price.itemId === firstItemId && price.leagueId === firstLeagueId
    );
    const second = result.results.find(
      (price) =>
        price.itemId === secondItemId && price.leagueId === secondLeagueId
    );

    expect(first).toBeDefined();
    expect(second).toBeDefined();
    if (first === undefined || second === undefined) {
      throw new Error("Expected both delimiter-like price pairs");
    }
    expect(first.syncRunId).toBe("sync-delimiter");
    expect(second.syncRunId).toBe("sync-delimiter");
    expect(first.chaosValue).toBeGreaterThan(0);
    expect(second.chaosValue).toBeGreaterThan(0);
  });
});
