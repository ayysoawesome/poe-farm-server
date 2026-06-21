# Path of Exile Boss Profit Backend Design

## Scope

Build a backend-only MVP for calculating expected Path of Exile boss-farming profitability. The repository will contain a Cloudflare Worker API, D1 schema and migrations, KV caching, mock price synchronization, deterministic profit calculation, seed data, tests, and deployment documentation. A frontend is explicitly out of scope.

## Architecture

The Worker uses Hono for HTTP routing and middleware. Routes validate input and delegate to services. Services own application and business logic. Repositories own Drizzle queries against Cloudflare D1. This produces a single deployable Worker while keeping HTTP, business, and persistence concerns independently understandable.

The dependency flow is:

`routes -> services -> repositories -> Drizzle D1`

Shared utilities provide error handling, JSON response conventions, time helpers, and KV access. Services receive the Worker environment or focused dependencies rather than relying on global state.

## Worker Entry Point

`src/index.ts` constructs a binding-typed Hono application, registers CORS for API routes, mounts public and internal route modules, and defines a global error handler.

Its default export implements:

- `fetch(request, env, ctx)` by delegating to `app.fetch`.
- `scheduled(event, env, ctx)` by placing `SyncService.runFullSync()` into `ctx.waitUntil`.

Scheduled failures are logged and recorded through sync-run persistence. Manual sync routes invoke the same service methods as the scheduled handler.

## HTTP API

Public endpoints:

- `GET /api/health`
- `GET /api/leagues`
- `GET /api/bosses?leagueId=...`
- `GET /api/bosses/:bossId`
- `GET /api/items/search?q=...`
- `GET /api/profit/:bossId?leagueId=...`

Internal endpoints:

- `POST /internal/sync`
- `POST /internal/recalculate`

When `CRON_SECRET` is configured, internal endpoints require an exact `x-cron-secret` header match. When it is absent, the endpoints remain available for local development.

Zod schemas validate route parameters and query strings. Invalid input returns HTTP 400. Domain failures use `AppError` with explicit status and code values. Unexpected exceptions return a generic HTTP 500 response without leaking implementation details.

Successful JSON responses expose endpoint-specific data directly. Errors consistently use:

```json
{
  "error": {
    "code": "SOME_CODE",
    "message": "Human readable message"
  }
}
```

## Data Model

Drizzle defines SQLite tables for:

- leagues
- items
- item prices
- bosses
- boss entry costs
- boss drops
- profit snapshots
- sync runs

Timestamp columns use integer Unix milliseconds so Worker, D1, seed, and API serialization share one representation. Boolean fields use SQLite integer boolean mode. Foreign keys and the requested composite indexes are declared in the schema and generated SQL migration.

The initial migration is committed under `drizzle/migrations/`. Wrangler migration commands execute these SQL files through `wrangler d1 migrations apply`.

## Repositories

Repository modules use plain exported functions consistently. They receive a Drizzle D1 database instance as their first argument and return explicit domain-shaped results.

- League repository lists active leagues and finds a league.
- Boss repository lists active bosses, reads boss details, entry costs, and drops.
- Item repository searches items and retrieves item records.
- Price repository reads the latest price per item and inserts synchronized prices.
- Profit repository reads latest snapshots, inserts snapshots, and lists boss summaries.
- Sync repository records run start, success, and failure.

Queries that need “latest” records use ordered timestamps and deterministic ID tie-breaking where appropriate.

## Services

Services are classes with explicit dependencies or factory-created repositories:

- `LeagueService` exposes active league reads.
- `BossService` composes boss metadata, latest profit summaries, entry costs, and drops.
- `ItemService` performs validated search.
- `PriceService` reads latest prices and coordinates a price provider.
- `ProfitService` performs deterministic calculations and persists snapshots.
- `SyncService` coordinates mock price sync, recalculation, cache invalidation, and sync-run status.

Routes contain no profit formulas and no direct SQL.

## Profit Calculation

For one boss and league, `ProfitService` loads configured entry costs and drops, then loads the latest price for every referenced item.

It calculates:

```text
entryCostChaos =
  sum(entryCost.quantity * latestItemPrice.chaosValue)

averageQuantity =
  (minQuantity + maxQuantity) / 2

expectedReturnChaos =
  sum(estimatedDropRate * averageQuantity * latestItemPrice.chaosValue)

expectedProfitChaos =
  expectedReturnChaos - entryCostChaos

roiPercent =
  entryCostChaos > 0
    ? (expectedProfitChaos / entryCostChaos) * 100
    : 0
```

The service throws a `MISSING_ITEM_PRICE` application error naming the missing item and league rather than calculating a partial snapshot. Calculations are unit tested using in-memory inputs, including zero entry cost and missing-price behavior.

## KV Caching

Profit responses use key `profit:{leagueId}:{bossId}`.

The profit route:

1. Reads and parses the cached snapshot.
2. Returns it with `"cache": "hit"` when valid.
3. Reads the latest D1 snapshot on a miss.
4. Stores the snapshot for 300 seconds.
5. Returns it with `"cache": "miss"`.

Malformed cache data is treated as a miss and replaced. Recalculation updates or deletes relevant keys so stale values are not intentionally retained after a manual or scheduled recalculation.

## Price Synchronization

A small `PriceProvider` interface separates data acquisition from persistence. The MVP mock provider derives deterministic, slightly varied prices from the latest stored values and the current sync timestamp. It does not call external APIs.

`SyncService` exposes:

- `syncPrices()`
- `recalculateProfits()`
- `runFullSync()`

Full sync records a `sync_runs` row, updates mock prices, recalculates each active boss for each active league, invalidates or refreshes cache entries, and marks the run successful. Failures mark the run failed and are rethrown for Worker logging.

The provider selection uses `PRICE_SYNC_PROVIDER`, accepting `mock` for the MVP. Unsupported configured providers fail with an explicit error, providing a clear extension point for future PoE Ninja or trade API adapters.

## Seed Data

The TypeScript seed command runs through Wrangler against the local D1 database. To avoid requiring Node-specific D1 bindings, `src/db/seed.ts` produces deterministic SQL statements, and the package script pipes the generated SQL file into `wrangler d1 execute --local`.

Seed data is idempotent by using stable text IDs and insert-or-replace semantics. It includes the requested league, ten items, six bosses, mock costs, mock drops, prices, and initial calculated snapshots. Initial snapshots are derived by the same deterministic formula, not copied into route code.

## Configuration

The project uses:

- pnpm and ESM
- strict TypeScript
- Wrangler JSONC
- D1 binding `DB`
- KV binding `PROFIT_CACHE`
- hourly cron trigger
- Drizzle Kit configuration
- Vitest for service tests

Wrangler contains clearly marked placeholder resource IDs. `.dev.vars.example` documents optional local values without committing secrets.

## Testing and Verification

Vitest covers the profit calculation as the principal business-critical unit:

- Computes entry cost, expected return, profit, and ROI.
- Uses average drop quantity.
- Returns zero ROI when entry cost is zero.
- Throws a useful error when a referenced price is missing.

Verification consists of:

- `pnpm install`
- `pnpm test`
- `pnpm typecheck`
- Drizzle migration generation consistency
- Local D1 migration application
- Local seed execution
- Wrangler configuration validation where practical

## Operational Documentation

The README documents installation, Cloudflare D1 and KV creation, insertion of generated IDs into Wrangler configuration, migration generation and application, local seeding, local development, scheduled-event testing, deployment, endpoints, internal authentication, and the mock provider replacement boundary.

## Explicit Non-Goals

- React or any frontend files
- User authentication
- Real Path of Exile provider calls
- Historical analytics endpoints
- Administrative CRUD endpoints
- Queues, Durable Objects, or multi-Worker decomposition
- Currency conversion beyond stored chaos and optional divine values
