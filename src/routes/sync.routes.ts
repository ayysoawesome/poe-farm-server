import { Hono, type Context, type Next } from "hono";

import type { AppBindings } from "../env";
import { AppError } from "../utils/errors";
import { secretsMatch } from "../utils/security";
import { SyncService } from "../services/sync.service";

export const requireCronSecret = async (
  context: Context<AppBindings>,
  next: Next
): Promise<void> => {
  const expected = context.env.CRON_SECRET;
  if (!expected) {
    throw new AppError(
      503,
      "INTERNAL_SECRET_NOT_CONFIGURED",
      "Internal endpoint authentication is not configured"
    );
  }
  if (!(await secretsMatch(context.req.header("x-cron-secret"), expected))) {
    throw new AppError(401, "UNAUTHORIZED", "Invalid or missing cron secret");
  }
  await next();
};

export const syncRoutes = new Hono<AppBindings>()
  .use("*", requireCronSecret)
  .post("/sync", async (context) => {
    const data = await new SyncService(context.env).runFullSync();
    return context.json({ data });
  })
  .post("/recalculate", async (context) => {
    const snapshotsCreated = await new SyncService(
      context.env
    ).recalculateProfits();
    return context.json({ data: { snapshotsCreated } });
  });
