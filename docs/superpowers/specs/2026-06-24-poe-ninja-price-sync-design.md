# Poe Ninja Price Sync Design

## Goal

Replace the mock-only price synchronization with a production-capable poe.ninja provider while keeping boss/drop/item definitions as curated application data.

## Data ownership

The application remains the source of truth for tracked bosses, tracked items, entry components, and drop chances. poe.ninja is only a market-price source.

Curated data lives in D1 tables:

- `items`
- `bosses`
- `boss_entry_components`
- `boss_drops`
- `item_price_mappings`

League metadata and market observations come from poe.ninja. Synced league
metadata lives in `leagues`; market observations live in `item_prices` and are
grouped by `sync_runs.id`.

## League mapping

poe.ninja exposes available market leagues through
`/api/data/getindexstate`. The sync uses the `economyLeagues` object from that
response as the source of truth for active price leagues.

Each economy league is mapped as:

- `id = slugify(economyLeague.name)`
- `name = economyLeague.displayName ?? economyLeague.name`
- `external_name = economyLeague.name`
- `source = poe_ninja`
- `is_active = true`

Leagues previously synced from poe.ninja but no longer present in
`economyLeagues` are marked inactive. Manual leagues are not modified by
poe.ninja sync.

No `current` alias is created by default. API callers should first request
`GET /api/leagues`, then call profit/boss endpoints with a concrete league ID
such as `standard` or the current league slug.

## Item price mappings

Add an `item_price_mappings` table:

- `id`
- `item_id`
- `provider`
- `external_type`
- `external_key`
- `is_active`
- timestamps

For poe.ninja:

- `provider = poe_ninja`
- `external_type` maps to poe.ninja `type` query parameter.
- `external_key` maps to the line name received from poe.ninja.

Examples:

- `divine-orb` → `Currency` / `Divine Orb`
- `chaos-orb` → `Currency` / `Chaos Orb`
- `mavens-writ` → `Fragment` / `Maven's Writ`
- `progenesis` → `UniqueFlask` / `Progenesis`

`item_id + provider` should be unique for active mappings. A duplicate mapping would make sync ambiguous.

## Poe ninja provider

Change the price provider abstraction from single-item pricing to batch fetching. The provider receives one league and all active mappings for that provider, groups mappings by `external_type`, calls poe.ninja once per type, and returns `Map<itemId, chaosValue>`.

Poe ninja endpoints:

- Currency-like data: `/api/data/currencyoverview?league=<externalName>&type=Currency`
- Item-like data: `/api/data/itemoverview?league=<externalName>&type=<externalType>`

The provider should use `chaosEquivalent` where present. Chaos Orb is always stored as `1` even if poe.ninja omits it or reports a slightly different value.

## Sync behavior

`POST /internal/sync` continues to:

1. Create a `sync_runs` row.
2. Fetch `economyLeagues` from poe.ninja index state.
3. Upsert active poe.ninja leagues and deactivate missing poe.ninja leagues.
4. Fetch prices for every active poe.ninja league.
5. Insert all prices under the same `syncRunId`.
6. Calculate profit snapshots from that same synchronized price set.
7. Mark the run successful or failed.

Fatal missing prices:

- `divine-orb` missing or non-positive.
- Any entry component missing a price.
- Any known-chance drop missing a price.

Non-fatal missing prices:

- Unknown-chance drops (`dropRate = null`) may have no display price.

## Providers

Keep `MockPriceProvider` for tests/local fallback. Add `PoeNinjaPriceProvider` and select it with:

```text
PRICE_SYNC_PROVIDER=poe_ninja
```

The production default should be `poe_ninja`. Tests may still use mock/manual behavior.

## Testing

Tests should cover:

- Schema constraints for `leagues.external_name` and `item_price_mappings`.
- Provider parsing for currency and item overview responses.
- Grouping poe.ninja calls by `external_type`.
- Chaos Orb forced to `1`.
- Sync writes one coherent price set under one `syncRunId`.
- Missing Divine Orb causes sync failure.
- Existing profit tests keep verifying that snapshots never mix price sets.

## Out of scope

- Official GGG trade API integration.
- Admin UI.
- Historical drop-rate tracking.
- Price confidence/liquidity scoring.
