import { z } from "zod";

import { idSchema } from "./common.schema";

export const leagueSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  externalName: z.string().min(1),
  source: z.enum(["manual", "poe_ninja"]),
  isActive: z.boolean(),
  createdAt: z.number().int(),
  updatedAt: z.number().int()
});

export type League = z.infer<typeof leagueSchema>;
