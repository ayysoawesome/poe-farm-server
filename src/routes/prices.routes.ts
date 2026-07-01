import { Hono } from "hono";

import type { AppBindings } from "../env";
import { leagueQuerySchema } from "../schemas/common.schema";
import { PriceService } from "../services/price.service";
import { parseInput } from "../utils/response";

export const pricesRoutes = new Hono<AppBindings>().get(
  "/divine-chaos",
  async (context) => {
    const { leagueId } = parseInput(leagueQuerySchema, context.req.query());
    const data = await new PriceService(context.env).getDivineChaosRate(leagueId);
    return context.json({ data });
  }
);
