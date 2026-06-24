import { Hono } from "hono";

import type { AppBindings } from "../env";
import { itemSearchQuerySchema } from "../schemas/item.schema";
import { ItemService } from "../services/item.service";
import { parseInput } from "../utils/response";

export const itemsRoutes = new Hono<AppBindings>().get("/search", async (context) => {
  const { q } = parseInput(itemSearchQuerySchema, context.req.query());
  const data = await new ItemService(context.env).search(q);
  return context.json({ data });
});
