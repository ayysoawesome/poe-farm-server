import { Hono } from "hono";

import type { AppBindings } from "../env";
import { LeagueService } from "../services/league.service";

export const leaguesRoutes = new Hono<AppBindings>().get("/", async (context) => {
  const leagues = await new LeagueService(context.env).listActive();
  return context.json({ data: leagues });
});
