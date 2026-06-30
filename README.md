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

`PRICE_SYNC_PROVIDER` is configured as `poe_ninja`. That syncs regular poe.ninja mappings plus any items marked as manually priced. The mock provider remains available for local tests by setting `PRICE_SYNC_PROVIDER=mock`.

Public stash pricing requires a Path of Exile API token with the `service:psapi` scope and an identifiable API user agent:

```bash
pnpm exec wrangler secret put POE_API_TOKEN
pnpm exec wrangler secret put POE_API_USER_AGENT
```

`POE_PUBLIC_STASH_CHANGE_ID` can seed the public stash cursor and `POE_PUBLIC_STASH_MAX_PAGES` limits how many stream pages a price sync samples per run. This is only needed after switching an item from manual pricing to `poe_public_stash`.

By default, poe.ninja synchronization excludes Hardcore leagues because manual item prices are currently maintained only for trade softcore leagues. Set `POE_NINJA_EXCLUDED_LEAGUE_IDS` to a comma-separated list to override that default.

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

The seed is idempotent and contains one manual local fallback league, ten requested items, six independent bosses, fixed entry components, fake drop rates, one coherent seed price set, and calculated snapshots.

Build curated-only SQL from JSON:

```bash
pnpm curated:build
```

Import curated data locally:

```bash
pnpm curated:import:local
```

Import curated data to production:

```bash
pnpm curated:import:remote
```

Curated data lives in split JSON files:

- `data/curated/items.json`
- `data/curated/bosses.json`

These files include only items, poe.ninja item mappings, bosses, entry components, and drop rates. The importer intentionally does not write leagues, prices, sync runs, or profit snapshots. After production curated import, run `/internal/sync` to fetch poe.ninja leagues/prices and calculate snapshots.

Generate a PoE Wiki drop-rate draft:

```bash
pnpm curated:scrape:poewiki
```

The scraper reads `data/curated/poewiki-bosses.json`, fetches the rendered PoE Wiki pages, parses the `Drops` section, and writes `data/curated/drafts/poewiki-drops.json`. This is intentionally draft-only: PoE Wiki rates are community estimates, so review the output and manually merge accepted entries into `data/curated/items.json` and `data/curated/bosses.json`.

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
- `GET /api/bosses?leagueId=standard`
- `GET /api/bosses/:bossId?leagueId=standard`
- `GET /api/items/search?q=maven`
- `GET /api/profit/:bossId?leagueId=standard`

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

Price synchronization uses item mappings stored in `item_price_mappings`. Most tracked items use poe.ninja:

- `provider = poe_ninja`
- `external_type` equal to the poe.ninja `type` query value, for example `Currency`, `Fragment`, `SkillGem`, `UniqueFlask`
- `external_key` equal to the line name returned by poe.ninja

Items that need manual prices use:

- `provider = manual`
- `external_type = Manual`
- `external_key` equal to the item id

Manual prices live in `manual_item_prices`. A regular price sync copies those current manual values into `item_prices` under the new `sync_run_id`, so profit snapshots still use one coherent price set.

Example manual update:

```sql
INSERT INTO manual_item_prices (
  id, item_id, league_id, chaos_value, notes, created_at, updated_at
) VALUES (
  'manual-watchers-eye-unidentified-ilvl-85-standard',
  'watchers-eye-unidentified-ilvl-85',
  'standard',
  120,
  'Unidentified ilvl 85, instant buyout checked manually',
  unixepoch() * 1000,
  unixepoch() * 1000
)
ON CONFLICT(item_id, league_id) DO UPDATE SET
  chaos_value = excluded.chaos_value,
  notes = excluded.notes,
  updated_at = excluded.updated_at;
```

The current manual-only items are:

- `watchers-eye-unidentified-ilvl-85`
- `watchers-eye-unidentified-ilvl-86-plus`

Leagues are synchronized from `https://poe.ninja/poe1/api/data/index-state` using its `economyLeagues` array. The backend stores:

- `id`: normalized API id, for example `standard` or `mercenaries`
- `name`: display name for API consumers
- `external_name`: exact poe.ninja league name used in price URLs
- `source = poe_ninja`

When a poe.ninja league disappears from `economyLeagues`, the next full sync marks that `poe_ninja` league inactive. Manual leagues are left untouched and are not used by price synchronization.

The default league sync also filters out `hardcore` and `hardcore-*` league ids. This keeps profit recalculation from requiring manual Watcher's Eye prices for Hardcore economies while those prices are not maintained.

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

`src/services/price.service.ts` defines the `PriceProvider` interface, `PoeNinjaPriceProvider`, `ManualPriceProvider`, `PoePublicStashPriceProvider`, and `MockPriceProvider`. A full sync first refreshes poe.ninja economy leagues, then each active provider stores normalized Chaos values under one `syncRunId`. Route, repository, cron, and profitability code do not need to know which upstream provider is active.

`PoePublicStashPriceProvider` is reserved for future automatic pricing of items that poe.ninja cannot split correctly, such as unidentified Watcher's Eye variants. To enable it later:

1. Request a Path of Exile OAuth application from GGG with `client_credentials` grant and `service:psapi` scope.
2. Set `POE_API_TOKEN` and `POE_API_USER_AGENT`.
3. Change the item mapping from `manual` to `poe_public_stash` with `external_type = PublicStashSearch` and an `external_key` JSON query.
4. Run `pnpm curated:build`, import curated data, then run `/internal/sync`.

The public stash provider only accepts exact stash notes like `~price 2 divine` or `~price 450 chaos`; it intentionally ignores `~b/o`.
