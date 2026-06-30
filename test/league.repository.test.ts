import { env } from "cloudflare:workers";
import { beforeEach, describe, expect, it } from "vitest";

import { syncPoeNinjaLeagues } from "../src/repositories/league.repository";
import {
  applyAllMigrations,
  query,
  resetMigrationDatabase
} from "./helpers/migrations";

describe.sequential("league repository", () => {
  beforeEach(async () => {
    await resetMigrationDatabase();
    await applyAllMigrations();
  });

  it("upserts poe.ninja economy leagues and deactivates missing poe.ninja leagues only", async () => {
    await env.DB.batch([
      env.DB.prepare(
        `INSERT INTO leagues (
          id, name, external_name, source, is_active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind("old-event", "Old Event", "Old Event", "poe_ninja", 1, 1, 1),
      env.DB.prepare(
        `INSERT INTO leagues (
          id, name, external_name, source, is_active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind("manual-local", "Manual Local", "Manual Local", "manual", 1, 1, 1)
    ]);

    await expect(
      syncPoeNinjaLeagues(
        env.DB,
        [
          {
            id: "standard",
            name: "Standard",
            externalName: "Standard"
          },
          {
            id: "mercenaries",
            name: "Mercenaries",
            externalName: "Mercenaries"
          }
        ],
        200
      )
    ).resolves.toBe(2);

    const rows = await query<{
      id: string;
      name: string;
      externalName: string;
      source: string;
      isActive: number;
      updatedAt: number;
    }>(
      `SELECT
        id,
        name,
        external_name AS externalName,
        source,
        is_active AS isActive,
        updated_at AS updatedAt
      FROM leagues
      ORDER BY id`
    );

    expect(rows).toEqual([
      {
        id: "manual-local",
        name: "Manual Local",
        externalName: "Manual Local",
        source: "manual",
        isActive: 1,
        updatedAt: 1
      },
      {
        id: "mercenaries",
        name: "Mercenaries",
        externalName: "Mercenaries",
        source: "poe_ninja",
        isActive: 1,
        updatedAt: 200
      },
      {
        id: "old-event",
        name: "Old Event",
        externalName: "Old Event",
        source: "poe_ninja",
        isActive: 0,
        updatedAt: 200
      },
      {
        id: "standard",
        name: "Standard",
        externalName: "Standard",
        source: "poe_ninja",
        isActive: 1,
        updatedAt: 200
      }
    ]);
  });
});
