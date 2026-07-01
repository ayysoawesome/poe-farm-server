import { env } from "cloudflare:workers";
import { beforeEach, describe, expect, it } from "vitest";

import {
  buildCuratedSql,
  combineCuratedDataFiles
} from "../src/db/curated";
import {
  applyAllMigrations,
  executeStatements,
  query,
  resetMigrationDatabase
} from "./helpers/migrations";

const splitSql = (sql: string) =>
  sql
    .split(";")
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0);

const itemFixture = [
    {
      id: "chaos-orb",
      name: "Chaos Orb",
      category: "currency",
      externalType: "Currency",
      externalKey: "Chaos Orb"
    },
    {
      id: "mavens-writ",
      name: "Maven's Writ",
      category: "fragment",
      externalType: "Fragment",
      externalKey: "Maven's Writ"
    },
    {
      id: "orb-dominance",
      name: "Orb of Dominance",
      category: "currency",
      externalType: "Currency",
      externalKey: "Orb of Dominance"
    },
    {
      id: "watchers-eye-unidentified-ilvl-85",
      name: "Watcher's Eye (Unidentified, ilvl 85)",
      category: "equipment",
      externalType: "Manual",
      externalKey: "watchers-eye-unidentified-ilvl-85",
      priceProvider: "manual"
    }
] as const;

const bossFixture = [
    {
      id: "maven",
      name: "Maven",
      slug: "maven",
      description: "The Maven pinnacle encounter.",
      iconUrl: "https://www.poewiki.net/images/5/52/Maven%27s_Writ_inventory_icon.png",
      entryComponents: [{ itemId: "mavens-writ", quantity: 1 }],
      drops: [
        {
          itemId: "orb-dominance",
          dropRate: 0.22,
          dropGroupId: "maven-currency",
          dropGroupType: "one_of",
          notes: "Curated estimate"
        }
      ]
    }
] as const;

const curatedFixture = combineCuratedDataFiles({
  items: itemFixture,
  bosses: bossFixture
});

describe.sequential("curated data import SQL", () => {
  beforeEach(async () => {
    await resetMigrationDatabase();
    await applyAllMigrations();
  });

  it("builds idempotent curated SQL without touching leagues, prices, snapshots, or sync runs", async () => {
    const sql = buildCuratedSql(curatedFixture, 1000);

    expect(sql).not.toContain("INSERT INTO leagues");
    expect(sql).not.toContain("UPDATE leagues");
    expect(sql).not.toContain("item_prices");
    expect(sql).not.toContain("profit_snapshots");
    expect(sql).not.toContain("sync_runs");

    await executeStatements(splitSql(sql));
    await executeStatements(splitSql(sql));

    await expect(query<{ count: number }>("SELECT COUNT(*) AS count FROM items"))
      .resolves.toEqual([{ count: 4 }]);
    await expect(
      query<{ count: number }>(
        "SELECT COUNT(*) AS count FROM item_price_mappings"
      )
    ).resolves.toEqual([{ count: 4 }]);
    await expect(
      query<{ provider: string; externalType: string }>(
        `SELECT provider, external_type AS externalType
         FROM item_price_mappings
         WHERE item_id = 'watchers-eye-unidentified-ilvl-85'`
      )
    ).resolves.toEqual([{ provider: "manual", externalType: "Manual" }]);
    await expect(query<{ count: number }>("SELECT COUNT(*) AS count FROM bosses"))
      .resolves.toEqual([{ count: 1 }]);
    await expect(
      query<{ iconUrl: string }>(
        "SELECT icon_url AS iconUrl FROM bosses WHERE id = 'maven'"
      )
    ).resolves.toEqual([
      {
        iconUrl:
          "https://www.poewiki.net/images/5/52/Maven%27s_Writ_inventory_icon.png"
      }
    ]);
    await expect(
      query<{ count: number }>(
        "SELECT COUNT(*) AS count FROM boss_entry_components"
      )
    ).resolves.toEqual([{ count: 1 }]);
    await expect(
      query<{ count: number }>("SELECT COUNT(*) AS count FROM boss_drops")
    ).resolves.toEqual([{ count: 1 }]);
    await expect(
      query<{ dropGroupId: string; dropGroupType: string }>(
        `SELECT drop_group_id AS dropGroupId, drop_group_type AS dropGroupType
         FROM boss_drops
         WHERE boss_id = 'maven' AND item_id = 'orb-dominance'`
      )
    ).resolves.toEqual([
      { dropGroupId: "maven-currency", dropGroupType: "one_of" }
    ]);
  });

  it("replaces entry components and drops for bosses present in the JSON", async () => {
    await executeStatements(splitSql(buildCuratedSql(curatedFixture, 1000)));

    const changed = {
      ...curatedFixture,
      bosses: [
        {
          ...curatedFixture.bosses[0],
          entryComponents: [
            { itemId: "chaos-orb", quantity: 10 },
            { itemId: "mavens-writ", quantity: 1 }
          ],
          drops: []
        }
      ]
    };
    await executeStatements(splitSql(buildCuratedSql(changed, 2000)));

    const entries = await query<{
      itemId: string;
      quantity: number;
      updatedAt: number;
    }>(
      `SELECT item_id AS itemId, quantity, updated_at AS updatedAt
       FROM boss_entry_components
       WHERE boss_id = 'maven'
       ORDER BY item_id`
    );
    expect(entries).toEqual([
      { itemId: "chaos-orb", quantity: 10, updatedAt: 2000 },
      { itemId: "mavens-writ", quantity: 1, updatedAt: 2000 }
    ]);
    await expect(
      query<{ count: number }>(
        "SELECT COUNT(*) AS count FROM boss_drops WHERE boss_id = 'maven'"
      )
    ).resolves.toEqual([{ count: 0 }]);
  });

  it("rejects drops and entry components that reference missing curated items", () => {
    expect(() =>
      buildCuratedSql(
        combineCuratedDataFiles({
          items: itemFixture,
          bosses: [
            {
              ...bossFixture[0],
              drops: [
                {
                  itemId: "missing",
                  dropRate: 0.1,
                  dropGroupId: null,
                  dropGroupType: null,
                  notes: null
                }
              ]
            }
          ]
        }),
        1000
      )
    ).toThrow(/missing item/i);
  });

  it("combines split curated item and boss JSON files", () => {
    expect(
      combineCuratedDataFiles({
        items: itemFixture,
        bosses: bossFixture
      })
    ).toEqual({
      items: itemFixture,
      bosses: bossFixture
    });
  });
});
