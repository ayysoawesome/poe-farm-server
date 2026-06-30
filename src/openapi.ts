const idSchema = {
  type: "string",
  minLength: 1,
  maxLength: 100,
  pattern: "^[a-zA-Z0-9_-]+$"
} as const;

const moneySchema = {
  type: "object",
  required: ["chaos", "divine"],
  properties: {
    chaos: { type: "number" },
    divine: { type: "number" }
  }
} as const;

const itemSchema = {
  type: "object",
  required: ["id", "name", "category", "iconUrl", "tradeUrl", "createdAt", "updatedAt"],
  properties: {
    id: idSchema,
    name: { type: "string" },
    category: {
      type: "string",
      enum: ["currency", "fragment", "equipment", "gem", "map", "other"]
    },
    iconUrl: { type: ["string", "null"] },
    tradeUrl: { type: ["string", "null"] },
    createdAt: { type: "integer" },
    updatedAt: { type: "integer" }
  }
} as const;

const bossSchema = {
  type: "object",
  required: ["id", "name", "slug", "description", "isActive", "createdAt", "updatedAt"],
  properties: {
    id: idSchema,
    name: { type: "string" },
    slug: { type: "string" },
    description: { type: ["string", "null"] },
    isActive: { type: "boolean" },
    createdAt: { type: "integer" },
    updatedAt: { type: "integer" }
  }
} as const;

const leagueSchema = {
  type: "object",
  required: [
    "id",
    "name",
    "externalName",
    "source",
    "isActive",
    "createdAt",
    "updatedAt"
  ],
  properties: {
    id: idSchema,
    name: { type: "string" },
    externalName: { type: "string" },
    source: { type: "string", enum: ["manual", "poe_ninja"] },
    isActive: { type: "boolean" },
    createdAt: { type: "integer" },
    updatedAt: { type: "integer" }
  }
} as const;

const profitResponseSchema = {
  type: "object",
  required: [
    "id",
    "bossId",
    "leagueId",
    "entryCost",
    "expectedReturn",
    "expectedProfit",
    "roiPercent",
    "isComplete",
    "unknownDropCount",
    "calculatedAt"
  ],
  properties: {
    id: { type: "string" },
    bossId: { type: "string" },
    leagueId: { type: "string" },
    entryCost: moneySchema,
    expectedReturn: moneySchema,
    expectedProfit: moneySchema,
    roiPercent: { type: "number" },
    isComplete: { type: "boolean" },
    unknownDropCount: { type: "integer", minimum: 0 },
    calculatedAt: { type: "integer" }
  }
} as const;

const latestProfitSchema = {
  type: "object",
  required: [
    "id",
    "bossId",
    "leagueId",
    "syncRunId",
    "entryCostChaos",
    "expectedReturnChaos",
    "expectedProfitChaos",
    "roiPercent",
    "divineOrbChaosValue",
    "isComplete",
    "unknownDropCount",
    "calculatedAt",
    "createdAt"
  ],
  properties: {
    id: { type: "string" },
    bossId: { type: "string" },
    leagueId: { type: "string" },
    syncRunId: { type: "string" },
    entryCostChaos: { type: "number" },
    expectedReturnChaos: { type: "number" },
    expectedProfitChaos: { type: "number" },
    roiPercent: { type: "number" },
    divineOrbChaosValue: { type: "number" },
    isComplete: { type: "boolean" },
    unknownDropCount: { type: "integer", minimum: 0 },
    calculatedAt: { type: "integer" },
    createdAt: { type: "integer" }
  }
} as const;

const errorResponseSchema = {
  type: "object",
  required: ["error"],
  properties: {
    error: {
      type: "object",
      required: ["code", "message"],
      properties: {
        code: { type: "string" },
        message: { type: "string" }
      }
    }
  }
} as const;

const dataResponse = (schema: unknown) => ({
  type: "object",
  required: ["data"],
  properties: { data: schema }
});

const jsonResponse = (description: string, schema: unknown) => ({
  description,
  content: {
    "application/json": {
      schema
    }
  }
});

const errorResponses = {
  "400": jsonResponse("Invalid request input.", errorResponseSchema),
  "401": jsonResponse("Authentication failed.", errorResponseSchema),
  "404": jsonResponse("Resource not found.", errorResponseSchema),
  "500": jsonResponse("Unexpected server error.", errorResponseSchema),
  "503": jsonResponse("Upstream data or configuration is unavailable.", errorResponseSchema)
} as const;

export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "PoE Boss Profit API",
    version: "0.1.0",
    description: "Boss entry cost, expected drops, price sync, and profit snapshots."
  },
  servers: [{ url: "https://poe-boss-profit-api.privetsatana1111.workers.dev" }],
  tags: [
    { name: "Health" },
    { name: "Leagues" },
    { name: "Bosses" },
    { name: "Items" },
    { name: "Profit" },
    { name: "Internal" }
  ],
  components: {
    securitySchemes: {
      CronSecret: {
        type: "apiKey",
        in: "header",
        name: "x-cron-secret"
      }
    },
    schemas: {
      Boss: bossSchema,
      ErrorResponse: errorResponseSchema,
      Item: itemSchema,
      League: leagueSchema,
      Money: moneySchema,
      Profit: profitResponseSchema
    }
  },
  paths: {
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Check service health",
        responses: {
          "200": jsonResponse("Service health.", {
            type: "object",
            required: ["ok", "service", "timestamp"],
            properties: {
              ok: { type: "boolean" },
              service: { type: "string" },
              timestamp: { type: "string", format: "date-time" }
            }
          })
        }
      }
    },
    "/api/leagues": {
      get: {
        tags: ["Leagues"],
        summary: "List active leagues",
        responses: {
          "200": jsonResponse("Active leagues.", dataResponse({ type: "array", items: leagueSchema })),
          ...errorResponses
        }
      }
    },
    "/api/bosses": {
      get: {
        tags: ["Bosses"],
        summary: "List bosses with latest profit for a league",
        parameters: [
          {
            name: "leagueId",
            in: "query",
            required: true,
            schema: idSchema
          }
        ],
        responses: {
          "200": jsonResponse(
            "Bosses with latest profit snapshots.",
            dataResponse({
              type: "array",
              items: {
                allOf: [
                  bossSchema,
                  {
                    type: "object",
                    required: ["latestProfit"],
                    properties: {
                      latestProfit: {
                        anyOf: [latestProfitSchema, { type: "null" }]
                      }
                    }
                  }
                ]
              }
            })
          ),
          ...errorResponses
        }
      }
    },
    "/api/bosses/{bossId}": {
      get: {
        tags: ["Bosses"],
        summary: "Get boss entry and drop details",
        parameters: [
          { name: "bossId", in: "path", required: true, schema: idSchema },
          { name: "leagueId", in: "query", required: true, schema: idSchema }
        ],
        responses: {
          "200": jsonResponse(
            "Boss detail.",
            dataResponse({
              type: "object",
              required: ["boss", "entry", "drops"],
              properties: {
                boss: bossSchema,
                entry: {
                  type: "object",
                  required: ["components", "totalPrice"],
                  properties: {
                    components: {
                      type: "array",
                      items: {
                        type: "object",
                        required: ["item", "quantity", "unitPrice", "totalPrice"],
                        properties: {
                          item: itemSchema,
                          quantity: { type: "number" },
                          unitPrice: moneySchema,
                          totalPrice: moneySchema
                        }
                      }
                    },
                    totalPrice: moneySchema
                  }
                },
                drops: {
                  type: "array",
                  items: {
                    type: "object",
                    required: ["item", "dropRate", "dropGroupId", "dropGroupType", "price"],
                    properties: {
                      item: itemSchema,
                      dropRate: { type: ["number", "null"], minimum: 0, maximum: 1 },
                      dropGroupId: { type: ["string", "null"] },
                      dropGroupType: { type: ["string", "null"], enum: ["one_of", null] },
                      price: { anyOf: [moneySchema, { type: "null" }] }
                    }
                  }
                }
              }
            })
          ),
          ...errorResponses
        }
      }
    },
    "/api/items/search": {
      get: {
        tags: ["Items"],
        summary: "Search items by name",
        parameters: [
          {
            name: "q",
            in: "query",
            required: true,
            schema: { type: "string", minLength: 2, maxLength: 100 }
          }
        ],
        responses: {
          "200": jsonResponse("Matching items.", dataResponse({ type: "array", items: itemSchema })),
          ...errorResponses
        }
      }
    },
    "/api/profit/{bossId}": {
      get: {
        tags: ["Profit"],
        summary: "Get latest cached profit snapshot",
        parameters: [
          { name: "bossId", in: "path", required: true, schema: idSchema },
          { name: "leagueId", in: "query", required: true, schema: idSchema }
        ],
        responses: {
          "200": jsonResponse("Latest profit snapshot.", {
            type: "object",
            required: ["data", "cache"],
            properties: {
              data: profitResponseSchema,
              cache: { type: "string", enum: ["hit", "miss"] }
            }
          }),
          ...errorResponses
        }
      }
    },
    "/internal/sync": {
      post: {
        tags: ["Internal"],
        summary: "Run full league, price, and profit sync",
        security: [{ CronSecret: [] }],
        responses: {
          "200": jsonResponse("Sync result.", dataResponse({
            type: "object",
            required: ["syncRunId", "pricesInserted", "snapshotsCreated"],
            properties: {
              syncRunId: { type: "string" },
              pricesInserted: { type: "integer", minimum: 0 },
              snapshotsCreated: { type: "integer", minimum: 0 }
            }
          })),
          ...errorResponses
        }
      }
    },
    "/internal/recalculate": {
      post: {
        tags: ["Internal"],
        summary: "Recalculate profit from the latest successful price sync",
        security: [{ CronSecret: [] }],
        responses: {
          "200": jsonResponse("Recalculation result.", dataResponse({
            type: "object",
            required: ["snapshotsCreated"],
            properties: {
              snapshotsCreated: { type: "integer", minimum: 0 }
            }
          })),
          ...errorResponses
        }
      }
    }
  }
} as const;

export const swaggerHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>PoE Boss Profit API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: "/openapi.json",
        dom_id: "#swagger-ui",
        deepLinking: true,
        persistAuthorization: true
      });
    </script>
  </body>
</html>`;
