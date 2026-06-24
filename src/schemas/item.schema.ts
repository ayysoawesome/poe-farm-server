import { z } from "zod";

import { idSchema } from "./common.schema";

export const itemCategories = [
  "currency",
  "fragment",
  "equipment",
  "gem",
  "map",
  "other"
] as const;

export const itemCategorySchema = z.enum(itemCategories);

export const itemSearchQuerySchema = z.object({
  q: z.string().trim().min(2).max(100)
});

export const itemSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  category: itemCategorySchema,
  iconUrl: z.string().nullable(),
  tradeUrl: z.string().nullable(),
  createdAt: z.number().int(),
  updatedAt: z.number().int()
});

export type ItemCategory = z.infer<typeof itemCategorySchema>;
export type Item = z.infer<typeof itemSchema>;
