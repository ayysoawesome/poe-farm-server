import { describe, expect, it } from "vitest";

import { app } from "../src/index";

describe("OpenAPI routes", () => {
  it("serves the OpenAPI document", async () => {
    const response = await app.request("/openapi.json");

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      openapi: "3.1.0",
      info: { title: "PoE Boss Profit API" },
      paths: {
        "/api/health": expect.any(Object),
        "/internal/sync": expect.any(Object)
      }
    });
  });

  it("serves Swagger UI", async () => {
    const response = await app.request("/docs");

    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toContain("SwaggerUIBundle");
  });
});
