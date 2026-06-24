import { env } from "cloudflare:workers";
import { beforeEach, describe, expect, it } from "vitest";

import {
  acquireSyncLease,
  releaseSyncLease
} from "../src/repositories/sync-lease.repository";

const createSyncLeasesTable = `
  CREATE TABLE IF NOT EXISTS sync_leases (
    name text PRIMARY KEY NOT NULL,
    owner_id text NOT NULL,
    expires_at integer NOT NULL,
    updated_at integer NOT NULL
  )
`;

describe.sequential("sync lease repository", () => {
  beforeEach(async () => {
    await env.DB.prepare(createSyncLeasesTable).run();
    await env.DB.prepare("DELETE FROM sync_leases").run();
  });

  it("allows only one owner while a lease is active", async () => {
    await expect(
      acquireSyncLease(env.DB, "full-sync", "owner-a", 1_000, 2_000)
    ).resolves.toBe(true);

    await expect(
      acquireSyncLease(env.DB, "full-sync", "owner-b", 1_500, 2_500)
    ).resolves.toBe(false);

    const lease = await env.DB.prepare(
      "SELECT owner_id, expires_at FROM sync_leases WHERE name = ?"
    )
      .bind("full-sync")
      .first<{ owner_id: string; expires_at: number }>();
    expect(lease).toEqual({ owner_id: "owner-a", expires_at: 2_000 });
  });

  it("selects exactly one winner from simultaneous acquisition attempts", async () => {
    const results = await Promise.all([
      acquireSyncLease(env.DB, "full-sync", "owner-a", 1_000, 2_000),
      acquireSyncLease(env.DB, "full-sync", "owner-b", 1_000, 2_000)
    ]);

    expect(results.filter(Boolean)).toHaveLength(1);

    const lease = await env.DB.prepare(
      "SELECT owner_id FROM sync_leases WHERE name = ?"
    )
      .bind("full-sync")
      .first<{ owner_id: string }>();
    expect(lease?.owner_id).toBe(results[0] ? "owner-a" : "owner-b");
  });

  it("allows acquisition at the exact expiry time", async () => {
    await acquireSyncLease(env.DB, "full-sync", "owner-a", 1_000, 2_000);

    await expect(
      acquireSyncLease(env.DB, "full-sync", "owner-b", 2_000, 3_000)
    ).resolves.toBe(true);

    const lease = await env.DB.prepare(
      "SELECT owner_id FROM sync_leases WHERE name = ?"
    )
      .bind("full-sync")
      .first<{ owner_id: string }>();
    expect(lease?.owner_id).toBe("owner-b");
  });

  it("does not let a stale owner release a newer owner's lease", async () => {
    await acquireSyncLease(env.DB, "full-sync", "owner-a", 1_000, 2_000);
    await acquireSyncLease(env.DB, "full-sync", "owner-b", 2_000, 3_000);

    await releaseSyncLease(env.DB, "full-sync", "owner-a");

    const lease = await env.DB.prepare(
      "SELECT owner_id FROM sync_leases WHERE name = ?"
    )
      .bind("full-sync")
      .first<{ owner_id: string }>();
    expect(lease?.owner_id).toBe("owner-b");
  });
});
