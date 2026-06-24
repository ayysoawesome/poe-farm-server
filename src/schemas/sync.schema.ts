import { z } from "zod";

export const syncResultSchema = z.object({
  syncRunId: z.string(),
  pricesInserted: z.number().int().nonnegative(),
  snapshotsCreated: z.number().int().nonnegative()
});

export type SyncResult = z.infer<typeof syncResultSchema>;
