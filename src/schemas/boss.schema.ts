import { z } from "zod";

import { idSchema } from "./common.schema";
import { itemCategorySchema } from "./item.schema";
import { moneySchema } from "./money.schema";
import { profitResponseSchema } from "./profit.schema";

export const bossSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().nullable(),
  iconUrl: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.number().int(),
  updatedAt: z.number().int()
});

export type Boss = z.infer<typeof bossSchema>;

export const bossItemSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  category: itemCategorySchema,
  iconUrl: z.string().nullable()
});

export const bossEntryComponentSchema = z.object({
  item: bossItemSchema,
  quantity: z.number().positive(),
  unitPrice: moneySchema.nullable(),
  totalPrice: moneySchema.nullable()
});

export const bossDropSchema = z.object({
  item: bossItemSchema,
  dropRate: z.number().min(0).max(1).nullable(),
  dropGroupId: idSchema.nullable(),
  dropGroupType: z.enum(["one_of"]).nullable(),
  price: moneySchema.nullable()
});

export const bossDetailSchema = z.object({
  boss: bossSchema,
  entry: z.object({
    components: z.array(bossEntryComponentSchema),
    totalPrice: moneySchema.nullable()
  }),
  profit: z.object({
    latest: profitResponseSchema.nullable(),
    history: z.array(profitResponseSchema)
  }),
  drops: z.array(bossDropSchema)
});

export type BossDetail = z.infer<typeof bossDetailSchema>;
