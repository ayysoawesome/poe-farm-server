import { eq } from "drizzle-orm";

import type { Database } from "../db/client";
import { leagues } from "../db/schema";

export const listActiveLeagues = (db: Database) =>
  db.select().from(leagues).where(eq(leagues.isActive, true)).orderBy(leagues.name);

export const findLeagueById = async (db: Database, leagueId: string) => {
  const rows = await db
    .select()
    .from(leagues)
    .where(eq(leagues.id, leagueId))
    .limit(1);
  return rows[0] ?? null;
};
