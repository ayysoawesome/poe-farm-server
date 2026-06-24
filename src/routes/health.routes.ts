import { Hono } from "hono";

import type { AppBindings } from "../env";

export const healthRoutes = new Hono<AppBindings>().get("/", (context) =>
  context.json({
    ok: true,
    service: "poe-boss-profit-api",
    timestamp: new Date().toISOString()
  })
);
