import { and, desc, eq } from "drizzle-orm";

import type { Database } from "../db/client";
import { latestProfitSnapshots, profitSnapshots } from "../db/schema";

export type NewProfitSnapshot = typeof profitSnapshots.$inferInsert;
export type ProfitSnapshot = typeof profitSnapshots.$inferSelect;
export type LatestProfitSnapshot = typeof latestProfitSnapshots.$inferSelect;

const latestToProfitSnapshot = (
  snapshot: LatestProfitSnapshot
): ProfitSnapshot => ({
  id: snapshot.id,
  bossId: snapshot.bossId,
  leagueId: snapshot.leagueId,
  syncRunId: snapshot.syncRunId,
  entryCostChaos: snapshot.entryCostChaos,
  expectedReturnChaos: snapshot.expectedReturnChaos,
  expectedProfitChaos: snapshot.expectedProfitChaos,
  roiPercent: snapshot.roiPercent,
  divineOrbChaosValue: snapshot.divineOrbChaosValue,
  isComplete: snapshot.isComplete,
  unknownDropCount: snapshot.unknownDropCount,
  calculatedAt: snapshot.calculatedAt,
  createdAt: snapshot.createdAt
});

export const findLatestProfitSnapshot = async (
  db: Database,
  bossId: string,
  leagueId: string
) => {
  try {
    const latestRows = await db
      .select()
      .from(latestProfitSnapshots)
      .where(
        and(
          eq(latestProfitSnapshots.bossId, bossId),
          eq(latestProfitSnapshots.leagueId, leagueId)
        )
      )
      .limit(1);
    const latest = latestRows[0];
    if (latest !== undefined) return latestToProfitSnapshot(latest);
  } catch {
    // Older databases do not have latest_profit_snapshots yet. Fall back to history.
  }

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

export const upsertLatestProfitSnapshot = async (
  database: D1Database,
  snapshot: NewProfitSnapshot
) => {
  await database
    .prepare(
      `INSERT INTO latest_profit_snapshots (
        id, boss_id, league_id, sync_run_id, entry_cost_chaos,
        expected_return_chaos, expected_profit_chaos, roi_percent,
        divine_orb_chaos_value, is_complete, unknown_drop_count,
        calculated_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(boss_id, league_id) DO UPDATE SET
        id = excluded.id,
        sync_run_id = excluded.sync_run_id,
        entry_cost_chaos = excluded.entry_cost_chaos,
        expected_return_chaos = excluded.expected_return_chaos,
        expected_profit_chaos = excluded.expected_profit_chaos,
        roi_percent = excluded.roi_percent,
        divine_orb_chaos_value = excluded.divine_orb_chaos_value,
        is_complete = excluded.is_complete,
        unknown_drop_count = excluded.unknown_drop_count,
        calculated_at = excluded.calculated_at,
        updated_at = excluded.updated_at`
    )
    .bind(
      snapshot.id,
      snapshot.bossId,
      snapshot.leagueId,
      snapshot.syncRunId,
      snapshot.entryCostChaos,
      snapshot.expectedReturnChaos,
      snapshot.expectedProfitChaos,
      snapshot.roiPercent,
      snapshot.divineOrbChaosValue,
      snapshot.isComplete ? 1 : 0,
      snapshot.unknownDropCount,
      snapshot.calculatedAt,
      snapshot.createdAt,
      snapshot.createdAt
    )
    .run();
  return snapshot;
};
