import { and, eq } from "drizzle-orm";

import type { Database } from "../db/client";
import { leagues } from "../db/schema";

export type SyncedLeagueInput = {
  id: string;
  name: string;
  externalName: string;
};

export const listActiveLeagues = (db: Database) =>
  db.select().from(leagues).where(eq(leagues.isActive, true)).orderBy(leagues.name);

export const listActivePoeNinjaLeagues = (db: Database) =>
  db
    .select()
    .from(leagues)
    .where(and(eq(leagues.isActive, true), eq(leagues.source, "poe_ninja")))
    .orderBy(leagues.name);

export const findLeagueById = async (db: Database, leagueId: string) => {
  const rows = await db
    .select()
    .from(leagues)
    .where(eq(leagues.id, leagueId))
    .limit(1);
  return rows[0] ?? null;
};

export const syncPoeNinjaLeagues = async (
  database: D1Database,
  syncedLeagues: readonly SyncedLeagueInput[],
  timestamp: number
): Promise<number> => {
  const upserts = syncedLeagues.map((league) =>
    database
      .prepare(
        `INSERT INTO leagues (
          id, name, external_name, source, is_active, created_at, updated_at
        ) VALUES (?, ?, ?, 'poe_ninja', 1, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          external_name = excluded.external_name,
          source = 'poe_ninja',
          is_active = 1,
          updated_at = excluded.updated_at`
      )
      .bind(
        league.id,
        league.name,
        league.externalName,
        timestamp,
        timestamp
      )
  );

  if (upserts.length > 0) {
    await database.batch(upserts);
  }

  if (syncedLeagues.length === 0) {
    await database
      .prepare(
        `UPDATE leagues
         SET is_active = 0, updated_at = ?
         WHERE source = 'poe_ninja'`
      )
      .bind(timestamp)
      .run();
    return 0;
  }

  const placeholders = syncedLeagues.map(() => "?").join(", ");
  await database
    .prepare(
      `UPDATE leagues
       SET is_active = 0, updated_at = ?
       WHERE source = 'poe_ninja'
         AND id NOT IN (${placeholders})`
    )
    .bind(timestamp, ...syncedLeagues.map((league) => league.id))
    .run();

  return syncedLeagues.length;
};
