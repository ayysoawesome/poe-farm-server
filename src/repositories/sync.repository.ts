import { desc, eq } from "drizzle-orm";

import type { Database } from "../db/client";
import { syncRuns } from "../db/schema";

export const createSyncRun = async (
  db: Database,
  run: typeof syncRuns.$inferInsert
) => {
  await db.insert(syncRuns).values(run);
  return run;
};

export const finishSyncRun = async (
  db: Database,
  id: string,
  status: "success" | "failed",
  finishedAt: number,
  message: string | null
) => {
  await db
    .update(syncRuns)
    .set({ status, finishedAt, message })
    .where(eq(syncRuns.id, id));
};

export const findLatestSuccessfulSyncRun = async (db: Database) => {
  const rows = await db
    .select()
    .from(syncRuns)
    .where(eq(syncRuns.status, "success"))
    .orderBy(desc(syncRuns.finishedAt), desc(syncRuns.startedAt), desc(syncRuns.id))
    .limit(1);
  return rows[0] ?? null;
};
