import { z } from "zod";

import { moneySchema, toMoney } from "./money.schema";

export const profitSnapshotSchema = z.object({
  id: z.string(),
  bossId: z.string(),
  leagueId: z.string(),
  syncRunId: z.string(),
  entryCostChaos: z.number(),
  expectedReturnChaos: z.number(),
  expectedProfitChaos: z.number(),
  roiPercent: z.number(),
  divineOrbChaosValue: z.number().positive(),
  isComplete: z.boolean(),
  unknownDropCount: z.number().int().nonnegative(),
  calculatedAt: z.number().int(),
  createdAt: z.number().int()
});

export type ProfitSnapshot = z.infer<typeof profitSnapshotSchema>;

export const profitResponseSchema = z.object({
  id: z.string(),
  bossId: z.string(),
  leagueId: z.string(),
  entryCost: moneySchema,
  expectedReturn: moneySchema,
  expectedProfit: moneySchema,
  roiPercent: z.number(),
  isComplete: z.boolean(),
  unknownDropCount: z.number().int().nonnegative(),
  calculatedAt: z.number().int()
});

export type ProfitResponse = z.infer<typeof profitResponseSchema>;

export const toProfitResponse = (
  snapshot: ProfitSnapshot
): ProfitResponse => ({
  id: snapshot.id,
  bossId: snapshot.bossId,
  leagueId: snapshot.leagueId,
  entryCost: toMoney(snapshot.entryCostChaos, snapshot.divineOrbChaosValue),
  expectedReturn: toMoney(
    snapshot.expectedReturnChaos,
    snapshot.divineOrbChaosValue
  ),
  expectedProfit: toMoney(
    snapshot.expectedProfitChaos,
    snapshot.divineOrbChaosValue
  ),
  roiPercent: snapshot.roiPercent,
  isComplete: snapshot.isComplete,
  unknownDropCount: snapshot.unknownDropCount,
  calculatedAt: snapshot.calculatedAt
});
