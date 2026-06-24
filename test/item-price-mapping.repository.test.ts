import { env } from "cloudflare:workers";
import { beforeEach, describe, expect, it } from "vitest";

import { createDb } from "../src/db/client";
import { listActivePriceMappingsByProvider } from "../src/repositories/item-price-mapping.repository";
import {
  applyAllMigrations,
  resetMigrationDatabase
} from "./helpers/migrations";

describe.sequential("item price mapping repository", () => {
  beforeEach(async () => {
    await resetMigrationDatabase();
    await applyAllMigrations();
    await env.DB.batch([
      env.DB.prepare(
        "INSERT INTO items (id, name, category, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
      ).bind("divine-orb", "Divine Orb", "currency", 1, 1),
      env.DB.prepare(
        "INSERT INTO items (id, name, category, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
      ).bind("chaos-orb", "Chaos Orb", "currency", 1, 1),
      env.DB.prepare(
        `INSERT INTO item_price_mappings (
          id, item_id, provider, external_type, external_key,
          is_active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        "mapping-divine",
        "divine-orb",
        "poe_ninja",
        "Currency",
        "Divine Orb",
        1,
        1,
        1
      ),
      env.DB.prepare(
        `INSERT INTO item_price_mappings (
          id, item_id, provider, external_type, external_key,
          is_active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        "mapping-chaos-inactive",
        "chaos-orb",
        "poe_ninja",
        "Currency",
        "Chaos Orb",
        0,
        1,
        1
      )
    ]);
  });

  it("lists active mappings for one provider with item metadata", async () => {
    await expect(
      listActivePriceMappingsByProvider(createDb(env.DB), "poe_ninja")
    ).resolves.toEqual([
      {
        id: "mapping-divine",
        itemId: "divine-orb",
        itemName: "Divine Orb",
        itemCategory: "currency",
        provider: "poe_ninja",
        externalType: "Currency",
        externalKey: "Divine Orb",
        createdAt: 1,
        updatedAt: 1
      }
    ]);
  });
});
