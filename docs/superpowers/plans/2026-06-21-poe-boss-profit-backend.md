# Path of Exile Boss Profit Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready Cloudflare Worker MVP that serves Path of Exile boss profitability data, persists normalized data in D1, caches hot profit responses in KV, and performs mock scheduled price synchronization.

**Architecture:** A binding-typed Hono Worker delegates validated HTTP requests to services, which delegate persistence to plain Drizzle repository functions. Profit calculation remains a pure tested function inside `ProfitService`; scheduled and manual synchronization share one `SyncService`.

**Tech Stack:** TypeScript, Cloudflare Workers, Hono, Cloudflare D1, Cloudflare KV, Drizzle ORM, Zod, Wrangler, Vitest, pnpm.

---

## File Map

- Root configuration: package metadata, strict TypeScript, Wrangler bindings/cron, Drizzle Kit, environment example, ignore rules, README.
- `src/index.ts`: Hono composition and Worker `fetch`/`scheduled` export.
- `src/env.ts`: Worker binding and Hono environment types.
- `src/db/`: Drizzle client, complete SQLite schema, deterministic seed SQL generator.
- `src/schemas/`: Zod schemas and inferred public data types.
- `src/repositories/`: D1-only persistence functions grouped by aggregate.
- `src/services/`: application logic, calculations, caching coordination, mock sync.
- `src/routes/`: validation and HTTP adaptation only.
- `src/utils/`: application errors, responses, timestamps, KV helpers.
- `test/profit.service.test.ts`: deterministic business-rule coverage.
- `drizzle/migrations/`: generated D1-compatible SQL migration.

### Task 1: Project configuration

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `wrangler.jsonc`
- Create: `drizzle.config.ts`
- Create: `.gitignore`
- Create: `.dev.vars.example`

- [ ] Define ESM package metadata and exact pnpm scripts for dev, deploy, typecheck, test, migration generation/application, and local seed.
- [ ] Add Hono, Drizzle ORM, and Zod runtime dependencies.
- [ ] Add Cloudflare Workers types, Drizzle Kit, TypeScript, Vitest, and Wrangler development dependencies.
- [ ] Enable strict TypeScript with Worker libraries and no emit.
- [ ] Configure Wrangler with `DB`, `PROFIT_CACHE`, an hourly cron, migration directory, and explicit placeholder IDs.
- [ ] Configure Drizzle Kit for D1/SQLite and `src/db/schema.ts`.
- [ ] Run `pnpm install`.
- [ ] Run `pnpm typecheck`; expect failure because source files do not exist yet, proving configuration is active.

### Task 2: Write failing profit calculation tests

**Files:**
- Create: `test/profit.service.test.ts`

- [ ] Write tests against the intended `calculateProfit` API for exact calculation, average quantities, zero-cost ROI, and missing prices.
- [ ] Run `pnpm test`; verify it fails because `src/services/profit.service.ts` does not exist.

### Task 3: Define schema, shared types, and profit calculation

**Files:**
- Create: `src/env.ts`
- Create: `src/db/schema.ts`
- Create: `src/schemas/common.schema.ts`
- Create: `src/schemas/league.schema.ts`
- Create: `src/schemas/boss.schema.ts`
- Create: `src/schemas/item.schema.ts`
- Create: `src/schemas/profit.schema.ts`
- Create: `src/schemas/sync.schema.ts`
- Create: `src/utils/errors.ts`
- Create: `src/utils/time.ts`
- Create: `src/services/profit.service.ts`

- [ ] Define binding types and strict Zod identifiers/query schemas.
- [ ] Define all requested Drizzle tables, foreign keys, defaults, unique constraints, and indexes.
- [ ] Implement `AppError`.
- [ ] Implement pure `calculateProfit` with explicit cost/drop/price inputs and missing-price errors.
- [ ] Run `pnpm test`; verify all profit tests pass.

### Task 4: Add database client and repositories

**Files:**
- Create: `src/db/client.ts`
- Create: `src/repositories/league.repository.ts`
- Create: `src/repositories/boss.repository.ts`
- Create: `src/repositories/item.repository.ts`
- Create: `src/repositories/price.repository.ts`
- Create: `src/repositories/profit.repository.ts`
- Create: `src/repositories/sync.repository.ts`

- [ ] Create a typed `drizzle(env.DB)` client factory.
- [ ] Implement active league and league lookup queries.
- [ ] Implement boss list/detail, entry-cost, and drop queries.
- [ ] Implement case-insensitive item search.
- [ ] Implement latest price reads and batch price insertion.
- [ ] Implement latest snapshot reads, summary reads, and snapshot insertion.
- [ ] Implement sync-run lifecycle persistence.
- [ ] Run `pnpm typecheck`; resolve all repository typing errors.

### Task 5: Add services and KV utilities

**Files:**
- Create: `src/services/league.service.ts`
- Create: `src/services/boss.service.ts`
- Create: `src/services/item.service.ts`
- Create: `src/services/price.service.ts`
- Modify: `src/services/profit.service.ts`
- Create: `src/services/sync.service.ts`
- Create: `src/utils/cache.ts`

- [ ] Implement public read services over repositories.
- [ ] Extend `ProfitService` to load configuration/prices, calculate, persist, list recalculation targets, and serve cached snapshots.
- [ ] Implement safe JSON KV get/set/delete with a 300-second TTL.
- [ ] Define a `PriceProvider` interface and mock implementation with bounded deterministic variation.
- [ ] Implement price sync, profit recalculation, and full sync with persisted run status.
- [ ] Run `pnpm test` and `pnpm typecheck`.

### Task 6: Add HTTP routes and Worker composition

**Files:**
- Create: `src/utils/response.ts`
- Create: `src/routes/health.routes.ts`
- Create: `src/routes/leagues.routes.ts`
- Create: `src/routes/bosses.routes.ts`
- Create: `src/routes/items.routes.ts`
- Create: `src/routes/profit.routes.ts`
- Create: `src/routes/sync.routes.ts`
- Create: `src/index.ts`

- [ ] Implement consistent error JSON helpers and Zod parsing helpers.
- [ ] Implement all public routes with no direct database access.
- [ ] Implement secret-protected manual sync and recalculation.
- [ ] Compose typed Hono routes, CORS, not-found behavior, and global error handling.
- [ ] Export a Worker object whose scheduled handler uses `ctx.waitUntil`.
- [ ] Run `pnpm typecheck` and `pnpm test`.

### Task 7: Generate migration and deterministic seed

**Files:**
- Create: `src/db/seed.ts`
- Generate: `drizzle/migrations/0000_*.sql`
- Generate: `drizzle/migrations/meta/*`

- [ ] Implement a Node-executable seed SQL generator using stable IDs and the shared profit formula.
- [ ] Include all requested leagues, items, bosses, costs, drops, prices, and calculated snapshots.
- [ ] Run `pnpm db:generate`; verify the migration includes every table and requested index.
- [ ] Run `pnpm db:migrate:local`; verify D1 migration succeeds.
- [ ] Run `pnpm db:seed:local`; verify local seed succeeds.
- [ ] Query local D1 to verify row counts and initial snapshots.

### Task 8: Documentation

**Files:**
- Create: `README.md`

- [ ] Document architecture and stack.
- [ ] Document pnpm install, Cloudflare login, D1 creation, KV creation, and Wrangler ID replacement.
- [ ] Document migrations, seed, local development, scheduled-event testing, tests, typecheck, and deploy.
- [ ] List every endpoint and internal secret behavior.
- [ ] Explain the mock provider boundary and future provider replacement.

### Task 9: Final verification

**Files:**
- Modify any files required by verification findings.

- [ ] Run `pnpm test`; require all tests to pass.
- [ ] Run `pnpm typecheck`; require zero errors.
- [ ] Run `pnpm db:migrate:local`; require an already-applied or successful result.
- [ ] Run `pnpm db:seed:local`; require successful idempotent reseeding.
- [ ] Run `pnpm exec wrangler deploy --dry-run`; require Worker bundling/config validation without deploying.
- [ ] Run `git status --short` and inspect the final tree.
- [ ] Report exact next commands and manual Cloudflare resource steps.
