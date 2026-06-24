import { z } from "zod";

export const idSchema = z
  .string()
  .trim()
  .min(1)
  .max(100)
  .regex(/^[a-zA-Z0-9_-]+$/, "Must contain only letters, numbers, underscores, or hyphens");

export const leagueQuerySchema = z.object({
  leagueId: idSchema
});

export const bossParamsSchema = z.object({
  bossId: idSchema
});
