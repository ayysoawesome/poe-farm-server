import { Hono } from "hono";
import { describe, expect, it } from "vitest";

import type { AppBindings } from "../src/env";
import {
  requireCronSecret,
  syncRoutes
} from "../src/routes/sync.routes";
import { AppError } from "../src/utils/errors";
import { errorResponse } from "../src/utils/response";

const installErrorHandler = (app: Hono<AppBindings>) => {
  app.onError((error, context) => {
    if (error instanceof AppError) {
      return errorResponse(context, error.code, error.message, error.status);
    }
    throw error;
  });
};

describe("requireCronSecret", () => {
  it("is exported for focused middleware testing", () => {
    expect(requireCronSecret).toBeTypeOf("function");
  });

  const createApp = () => {
    const app = new Hono<AppBindings>();
    app.use("*", requireCronSecret);
    app.get("/probe", (context) => context.json({ reached: true }));
    installErrorHandler(app);
    return app;
  };

  it.each([{}, { CRON_SECRET: "" }])(
    "returns 503 when the configured cron secret is missing or empty",
    async (env) => {
      const response = await createApp().request("/probe", undefined, env);

      expect(response.status).toBe(503);
      await expect(response.json()).resolves.toEqual({
        error: {
          code: "INTERNAL_SECRET_NOT_CONFIGURED",
          message: "Internal endpoint authentication is not configured"
        }
      });
    }
  );

  it.each([undefined, "wrong-secret"])(
    "returns 401 when the request cron secret is missing or wrong",
    async (providedSecret) => {
      const requestInit = providedSecret
        ? { headers: { "x-cron-secret": providedSecret } }
        : {};
      const response = await createApp().request(
        "/probe",
        requestInit,
        { CRON_SECRET: "shared-secret" }
      );

      expect(response.status).toBe(401);
      await expect(response.json()).resolves.toEqual({
        error: {
          code: "UNAUTHORIZED",
          message: "Invalid or missing cron secret"
        }
      });
    }
  );

  it("calls next when the request cron secret is correct", async () => {
    const response = await createApp().request(
      "/probe",
      { headers: { "x-cron-secret": "shared-secret" } },
      { CRON_SECRET: "shared-secret" }
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ reached: true });
  });
});

describe("syncRoutes", () => {
  it("installs cron authentication on mounted internal routes", async () => {
    const app = new Hono<AppBindings>();
    app.route("/internal", syncRoutes);
    installErrorHandler(app);

    const response = await app.request(
      "/internal/sync",
      {
        method: "POST",
        headers: { "x-cron-secret": "wrong-secret" }
      },
      { CRON_SECRET: "shared-secret" }
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "UNAUTHORIZED",
        message: "Invalid or missing cron secret"
      }
    });
  });
});
