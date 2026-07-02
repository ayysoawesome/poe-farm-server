import { asc, eq } from "drizzle-orm";

import type { Database } from "../db/client";
import { bossDrops, bossEntryComponents, bosses, items } from "../db/schema";

export const listActiveBosses = (db: Database) =>
  db.select().from(bosses).where(eq(bosses.isActive, true)).orderBy(asc(bosses.name));

export const findBossById = async (db: Database, bossId: string) => {
  const rows = await db.select().from(bosses).where(eq(bosses.id, bossId)).limit(1);
  return rows[0] ?? null;
};

export const listBossEntryComponents = (db: Database, bossId: string) =>
  db
    .select({
      id: bossEntryComponents.id,
      bossId: bossEntryComponents.bossId,
      itemId: bossEntryComponents.itemId,
      itemName: items.name,
      itemCategory: items.category,
      itemIconUrl: items.iconUrl,
      quantity: bossEntryComponents.quantity,
      createdAt: bossEntryComponents.createdAt,
      updatedAt: bossEntryComponents.updatedAt
    })
    .from(bossEntryComponents)
    .innerJoin(items, eq(bossEntryComponents.itemId, items.id))
    .where(eq(bossEntryComponents.bossId, bossId))
    .orderBy(asc(items.name));

export const listBossDrops = (db: Database, bossId: string) =>
  db
    .select({
      id: bossDrops.id,
      bossId: bossDrops.bossId,
      itemId: bossDrops.itemId,
      itemName: items.name,
      itemCategory: items.category,
      itemIconUrl: items.iconUrl,
      dropRate: bossDrops.dropRate,
      dropGroupId: bossDrops.dropGroupId,
      dropGroupType: bossDrops.dropGroupType,
      notes: bossDrops.notes,
      createdAt: bossDrops.createdAt,
      updatedAt: bossDrops.updatedAt
    })
    .from(bossDrops)
    .innerJoin(items, eq(bossDrops.itemId, items.id))
    .where(eq(bossDrops.bossId, bossId))
    .orderBy(asc(items.name));
