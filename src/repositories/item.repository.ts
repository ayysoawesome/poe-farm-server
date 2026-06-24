import { asc, eq, like } from "drizzle-orm";

import type { Database } from "../db/client";
import { items } from "../db/schema";

export const searchItems = (db: Database, query: string) =>
  db
    .select()
    .from(items)
    .where(like(items.name, `%${query}%`))
    .orderBy(asc(items.name))
    .limit(25);

export const findItemById = async (db: Database, itemId: string) => {
  const rows = await db.select().from(items).where(eq(items.id, itemId)).limit(1);
  return rows[0] ?? null;
};

export const listItems = (db: Database) => db.select().from(items).orderBy(items.id);
