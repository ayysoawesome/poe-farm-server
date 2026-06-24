# PoE Boss Profit API

Backend-only MVP for a Path of Exile boss-farming profitability calculator. It stores league, boss, item, synchronized price-set, entry-component, drop-rate, and calculated snapshot data, then exposes a public read-only API for a separate frontend.

## Stack

- TypeScript with strict checking and ESM
- Cloudflare Workers and Hono
- Cloudflare D1 and Drizzle ORM
- Cloudflare KV
- Zod
- Wrangler
- Vitest
- Cloudflare Vitest Workers pool
- pnpm

## Architecture

HTTP route modules validate requests and call services. Services contain business and orchestration logic. Repository modules contain all Drizzle/D1 queries. `ProfitService` implements the deterministic profitability formula, and `SyncService` is shared by cron and manual internal endpoints.

## Install

Requirements: Node.js 20 or newer, pnpm 10, and a Cloudflare account.

```bash
pnpm install
pnpm exec wrangler login
```

Copy `.dev.vars.example` to `.dev.vars` and choose a local `CRON_SECRET`. `.dev.vars` is ignored by Git.

## Create Cloudflare resources

Create the production D1 database:

```bash
pnpm exec wrangler d1 create poe-boss-profit
```

Create the production KV namespace:

```bash
pnpm exec wrangler kv namespace create PROFIT_CACHE
```

Copy the returned D1 database ID and KV namespace ID into `wrangler.jsonc`, replacing:

- `REPLACE_WITH_D1_DATABASE_ID`
- `REPLACE_WITH_KV_NAMESPACE_ID`

The binding names must remain `DB` and `PROFIT_CACHE`.

Set the production cron secret:

```bash
pnpm exec wrangler secret put CRON_SECRET
```

`PRICE_SYNC_PROVIDER` is configured as `poe_ninja`. The mock provider remains available for local tests by setting `PRICE_SYNC_PROVIDER=mock`.

## Database

Generate a migration after changing `src/db/schema.ts`:

```bash
pnpm db:generate
```

Apply migrations locally:

```bash
pnpm db:migrate:local
```

Seed the local database:

```bash
pnpm db:seed:local
```

The seed is idempotent and contains one current league, ten requested items, six independent bosses, fixed entry components, fake drop rates, one coherent seed price set, and calculated snapshots.

Apply migrations to production after inserting the real D1 ID:

```bash
pnpm db:migrate:remote
```

The seed command is intentionally local-only. Production data should be synchronized or inserted through an explicit operational process.

## Local development

Prepare and start the Worker:

```bash
pnpm db:migrate:local
pnpm db:seed:local
pnpm dev
```

Wrangler normally serves the API at `http://localhost:8787`.

The `dev` script enables Wrangler's scheduled-event test endpoint. With the server running, trigger the cron handler locally:

```bash
curl "http://localhost:8787/__scheduled?cron=0+*+*+*+*"
```

Run manual synchronization:

```bash
curl -X POST http://localhost:8787/internal/sync \
  -H "x-cron-secret: replace-with-a-local-secret"
```

## Quality checks

```bash
pnpm test
pnpm typecheck
pnpm cf:types:check
pnpm cf:startup
pnpm exec wrangler deploy --dry-run
```

`worker-configuration.d.ts` is generated from `wrangler.jsonc`. Run
`pnpm cf:types` after changing bindings or non-secret environment variables.

## Deploy

After creating resources, updating `wrangler.jsonc`, setting `CRON_SECRET`, and applying remote migrations:

```bash
pnpm deploy
```

The configured cron expression is `0 * * * *`, which runs once per hour.

## API

Public read-only endpoints:

- `GET /api/health`
- `GET /api/leagues`
- `GET /api/bosses?leagueId=current`
- `GET /api/bosses/:bossId?leagueId=current`
- `GET /api/items/search?q=maven`
- `GET /api/profit/:bossId?leagueId=current`

Internal endpoints:

- `POST /internal/sync`
- `POST /internal/recalculate`

If `CRON_SECRET` is configured, internal requests must provide the same value in `x-cron-secret`. If it is not configured, protection is disabled to simplify local development.

Errors use:

```json
{
  "error": {
    "code": "SOME_CODE",
    "message": "Human readable message"
  }
}
```

Profit responses use KV key `profit:v2:{leagueId}:{bossId}` with a 300-second TTL and include either `"cache": "hit"` or `"cache": "miss"`.

## Economy model

Bosses are independent records. There is no Uber flag or normal/Uber relation in the schema; Uber variants are modeled as separate bosses.

Entry costs are item-based. A boss has exactly one fixed entry method represented by `boss_entry_components`, where each component points to an ordinary item such as a fragment or currency item.

Drops are many-to-many. The same item can drop from multiple bosses, and each boss/drop pair has its own global `dropRate`. Unknown drop chances are stored as `null`, shown to the API consumer, excluded from expected-return math, and reflected through `isComplete: false` plus `unknownDropCount`.

Item categories are constrained to:

- `currency`
- `fragment`
- `equipment`
- `gem`
- `map`
- `other`

Prices are stored only in Chaos Orb values. Divine Orb is just another currency item (`divine-orb`) whose Chaos value is the current exchange rate. Public API money fields are returned as:

```json
{ "chaos": 50, "divine": 0.25 }
```

The backend derives Divine values from the snapshot's stored `divineOrbChaosValue`; the frontend does not need to perform currency conversion.

Price synchronization uses poe.ninja item mappings stored in `item_price_mappings`. Each tracked item needs one active mapping with:

- `provider = poe_ninja`
- `external_type` equal to the poe.ninja `type` query value, for example `Currency`, `Fragment`, `SkillGem`, `UniqueFlask`
- `external_key` equal to the line name returned by poe.ninja

Active leagues also need `external_name`, which is the league name used in poe.ninja URLs.

## Profit formula

```text
entryCostChaos = sum(entry component quantity * sync-run chaos price)

expectedReturnChaos =
  sum(known drop rate * sync-run chaos price)

expectedProfitChaos = expectedReturnChaos - entryCostChaos

roiPercent =
  entryCostChaos > 0
    ? (expectedProfitChaos / entryCostChaos) * 100
    : 0
```

Each full sync creates one `sync_runs` row, writes item prices under that same ID, and calculates snapshots from only that synchronized price set. Snapshot creation fails with `MISSING_ITEM_PRICE` when a known-chance drop or entry component has no price in the selected sync run. It fails with `MISSING_DIVINE_ORB_PRICE` when the selected price set lacks `divine-orb`.

## Price provider

`src/services/price.service.ts` defines the `PriceProvider` interface, the `PoeNinjaPriceProvider`, and the `MockPriceProvider`. The poe.ninja provider batches requests by external type and stores normalized Chaos values under one `syncRunId`. Route, repository, cron, and profitability code do not need to know which upstream provider is active.
