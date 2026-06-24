import { Hono } from "hono";

import type { AppBindings } from "../env";
import { BossService } from "../services/boss.service";
import { bossParamsSchema, leagueQuerySchema } from "../schemas/common.schema";
import { parseInput } from "../utils/response";

export const bossesRoutes = new Hono<AppBindings>()
  .get("/", async (context) => {
    const { leagueId } = parseInput(leagueQuerySchema, context.req.query());
    const data = await new BossService(context.env).list(leagueId);
    return context.json({ data });
  })
  .get("/:bossId", async (context) => {
    const { bossId } = parseInput(bossParamsSchema, context.req.param());
    const { leagueId } = parseInput(leagueQuerySchema, context.req.query());
    const data = await new BossService(context.env).getDetail(bossId, leagueId);
    return context.json({ data });
  });
