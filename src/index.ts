import { Hono } from "hono";
import { cors } from "hono/cors";

import type { AppBindings, Env } from "./env";
import { bossesRoutes } from "./routes/bosses.routes";
import { healthRoutes } from "./routes/health.routes";
import { itemsRoutes } from "./routes/items.routes";
import { leaguesRoutes } from "./routes/leagues.routes";
import { profitRoutes } from "./routes/profit.routes";
import { syncRoutes } from "./routes/sync.routes";
import { SyncService } from "./services/sync.service";
import { AppError } from "./utils/errors";
import { errorResponse } from "./utils/response";

const app = new Hono<AppBindings>();

app.use("/api/*", cors({ origin: "*", allowMethods: ["GET", "OPTIONS"] }));
app.route("/api/health", healthRoutes);
app.route("/api/leagues", leaguesRoutes);
app.route("/api/bosses", bossesRoutes);
app.route("/api/items", itemsRoutes);
app.route("/api/profit", profitRoutes);
app.route("/internal", syncRoutes);

app.notFound((context) =>
  errorResponse(context, "NOT_FOUND", "Route not found", 404)
);

app.onError((error, context) => {
  if (error instanceof AppError) {
    return errorResponse(context, error.code, error.message, error.status);
  }
  console.error(
    JSON.stringify({
      message: "Unhandled request error",
      error: error instanceof Error ? error.message : String(error),
      path: context.req.path
    })
  );
  return errorResponse(
    context,
    "INTERNAL_SERVER_ERROR",
    "An unexpected error occurred",
    500
  );
});

export { app };

export default {
  fetch(request: Request, env: Env, context: ExecutionContext) {
    return app.fetch(request, env, context);
  },
  scheduled(
    event: ScheduledController,
    env: Env,
    context: ExecutionContext
  ): void {
    console.log(
      JSON.stringify({
        message: "Starting scheduled synchronization",
        cron: event.cron,
        scheduledTime: event.scheduledTime
      })
    );
    context.waitUntil(
      new SyncService(env).runFullSync().then(
        (result) =>
          console.log(
            JSON.stringify({
              message: "Scheduled synchronization completed",
              ...result
            })
          ),
        (error: unknown) => {
          console.error(
            JSON.stringify({
              message: "Scheduled synchronization failed",
              error: error instanceof Error ? error.message : String(error)
            })
          );
          throw error;
        }
      )
    );
  }
} satisfies ExportedHandler<Env>;
