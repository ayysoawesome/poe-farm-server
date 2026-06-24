import { and, asc, eq } from "drizzle-orm";

import type { Database } from "../db/client";
import { itemPriceMappings, items } from "../db/schema";
import type { PriceProviderName } from "../schemas/item-price-mapping.schema";

export const listActivePriceMappingsByProvider = (
  db: Database,
  provider: PriceProviderName
) =>
  db
    .select({
      id: itemPriceMappings.id,
      itemId: itemPriceMappings.itemId,
      itemName: items.name,
      itemCategory: items.category,
      provider: itemPriceMappings.provider,
      externalType: itemPriceMappings.externalType,
      externalKey: itemPriceMappings.externalKey,
      createdAt: itemPriceMappings.createdAt,
      updatedAt: itemPriceMappings.updatedAt
    })
    .from(itemPriceMappings)
    .innerJoin(items, eq(itemPriceMappings.itemId, items.id))
    .where(
      and(
        eq(itemPriceMappings.provider, provider),
        eq(itemPriceMappings.isActive, true)
      )
    )
    .orderBy(
      asc(itemPriceMappings.externalType),
      asc(itemPriceMappings.externalKey)
    );
