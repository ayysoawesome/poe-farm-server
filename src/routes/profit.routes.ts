import { Hono } from "hono";

import type { AppBindings } from "../env";
import { bossParamsSchema, leagueQuerySchema } from "../schemas/common.schema";
import { BossService } from "../services/boss.service";
import { LeagueService } from "../services/league.service";
import { toProfitResponse } from "../schemas/profit.schema";
import { ProfitService } from "../services/profit.service";
import { parseInput } from "../utils/response";

export const profitRoutes = new Hono<AppBindings>()
  .get("/:bossId/history", async (context) => {
    const { bossId } = parseInput(bossParamsSchema, context.req.param());
    const { leagueId } = parseInput(leagueQuerySchema, context.req.query());
    await Promise.all([
      new BossService(context.env).requireById(bossId),
      new LeagueService(context.env).requireById(leagueId)
    ]);
    const snapshots = await new ProfitService(context.env).getHistory(
      bossId,
      leagueId
    );
    return context.json({ data: snapshots.map(toProfitResponse) });
  })
  .get("/:bossId", async (context) => {
    const { bossId } = parseInput(bossParamsSchema, context.req.param());
    const { leagueId } = parseInput(leagueQuerySchema, context.req.query());
    await Promise.all([
      new BossService(context.env).getDetail(bossId, leagueId),
      new LeagueService(context.env).requireById(leagueId)
    ]);
    const result = await new ProfitService(context.env).getLatestCached(
      bossId,
      leagueId
    );
    return context.json({
      data: toProfitResponse(result.snapshot),
      cache: result.cache
    });
  });
