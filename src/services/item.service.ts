import { createDb } from "../db/client";
import type { Env } from "../env";
import { searchItems } from "../repositories/item.repository";

export class ItemService {
  constructor(private readonly env: Env) {}

  search(query: string) {
    return searchItems(createDb(this.env.DB), query);
  }
}
