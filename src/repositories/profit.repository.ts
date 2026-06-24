import { and, desc, eq } from "drizzle-orm";

import type { Database } from "../db/client";
import { profitSnapshots } from "../db/schema";

export type NewProfitSnapshot = typeof profitSnapshots.$inferInsert;

export const findLatestProfitSnapshot = async (
  db: Database,
  bossId: string,
  leagueId: string
) => {
  const rows = await db
    .select()
    .from(profitSnapshots)
    .where(
      and(
        eq(profitSnapshots.bossId, bossId),
        eq(profitSnapshots.leagueId, leagueId)
      )
    )
    .orderBy(desc(profitSnapshots.calculatedAt), desc(profitSnapshots.id))
    .limit(1);
  return rows[0] ?? null;
};

export const insertProfitSnapshot = async (
  db: Database,
  snapshot: NewProfitSnapshot
) => {
  await db.insert(profitSnapshots).values(snapshot);
  return snapshot;
};
