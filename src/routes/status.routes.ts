import { Hono } from "hono";

import type { AppBindings } from "../env";
import { leagueQuerySchema } from "../schemas/common.schema";
import { StatusService } from "../services/status.service";
import { parseInput } from "../utils/response";

export const statusRoutes = new Hono<AppBindings>().get("/", async (context) => {
  const { leagueId } = parseInput(leagueQuerySchema, context.req.query());
  const data = await new StatusService(context.env).getFreshness(leagueId);
  return context.json({ data });
});
