import { z } from "zod";

import { idSchema } from "./common.schema";

export const priceProviders = [
  "poe_ninja",
  "poe_public_stash",
  "manual"
] as const;

export const priceProviderSchema = z.enum(priceProviders);

export type PriceProviderName = z.infer<typeof priceProviderSchema>;

export const itemPriceMappingSchema = z.object({
  id: idSchema,
  itemId: idSchema,
  provider: priceProviderSchema,
  externalType: z.string().min(1),
  externalKey: z.string().min(1),
  isActive: z.boolean(),
  createdAt: z.number().int(),
  updatedAt: z.number().int()
});

export type ItemPriceMapping = z.infer<typeof itemPriceMappingSchema>;
