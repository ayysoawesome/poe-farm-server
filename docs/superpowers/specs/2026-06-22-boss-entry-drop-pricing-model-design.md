# Boss Entry, Drop, and Pricing Model Design

## Scope

Revise the boss-profit domain model so that each playable encounter is an
independent boss, entry costs are represented by ordinary priced items, item
drops are modeled per boss, and Chaos Orb is the only stored accounting unit.

This design changes the schema, synchronization model, profit calculation,
public API responses, seed data, and tests. It does not add administration
endpoints, alternative entry methods, drop-rate history, or a real price
provider.

## Domain Rules

- Every encounter is an independent boss record.
- Normal and Uber encounters have no special relationship in the model.
- A boss has exactly one fixed entry method.
- An entry method consists of one or more ordinary items and their required
  quantities.
- An item may be an entry component, a drop from one or more bosses, or both.
- The same item may have a different drop chance for each boss.
- Drop chances are global and do not vary by league.
- Only the current drop chance is retained; change history is out of scope.
- A successful drop always yields one unit of the item.
- An unknown drop chance is stored as `null`.

## Bosses

Remove `bosses.is_uber`. Uber Maven, Maven, Uber Elder, and similarly named
encounters are ordinary independent rows in `bosses`.

No parent, variant, family, or normal-to-Uber relationship is introduced.
Grouping similarly named bosses is a presentation concern and is out of scope.

## Items and Categories

All tradable game objects are stored in `items`, including:

- Chaos Orb
- Divine Orb
- boss fragments
- complete boss invitations or writs
- equipment
- gems
- maps

Retain the existing `items.category` column and constrain it to:

- `currency`
- `fragment`
- `equipment`
- `gem`
- `map`
- `other`

The application exposes a matching TypeScript/Zod enum. The database migration
adds a `CHECK` constraint so invalid values and spelling mistakes cannot be
persisted.

The existing seed category `unique` becomes `equipment`. Item rarity is a
separate concept and is not modeled in this change.

## Boss Entry Components

Rename `boss_entry_costs` to `boss_entry_components`.

Each row contains:

- `id`
- `boss_id`
- `item_id`
- `quantity`
- timestamps

The table has a unique constraint on `(boss_id, item_id)` and a check constraint
requiring `quantity > 0`.

Examples:

- Maven requires one Maven's Writ.
- Shaper requires one each of four distinct Guardian fragments.

There is no separate entry-set table because a boss has only one entry method.
The total entry price is derived from the component quantities and item prices.

## Boss Drops

`boss_drops` remains the many-to-many association between bosses and items.

Each row contains:

- `id`
- `boss_id`
- `item_id`
- nullable `drop_rate`
- optional `notes`
- timestamps

Remove `min_quantity` and `max_quantity`. A successful drop always represents
one item.

Add a unique constraint on `(boss_id, item_id)`. `drop_rate` is either `null` or
within the inclusive range `0..1`.

A `null` drop rate means the item is known to drop from the boss but its chance
is unknown. Such a drop is returned by the API and excluded from expected-value
calculations.

## Pricing and Currency Conversion

Chaos Orb is the canonical accounting unit. `item_prices` stores only
`chaos_value`; remove `divine_value`.

The Chaos Orb price is always `1`. The Divine Orb is an ordinary item whose
current `chaos_value` represents the floating Chaos-to-Divine exchange rate.

For API presentation:

```text
divineValue = chaosValue / divineOrbChaosValue
```

The backend performs this conversion. The frontend receives values in both
currencies and performs no currency arithmetic.

Derived Divine values are not stored in `item_prices`, avoiding duplicated
sources of truth.

## Synchronized Price Sets

Prices used by one calculation must come from one coherent synchronization
cycle. Add `sync_run_id` to `item_prices` and `profit_snapshots`.

A successful price synchronization:

1. Creates a sync run.
2. Acquires all item prices in Chaos, including Divine Orb.
3. Writes them under the same `sync_run_id` and `captured_at`.
4. Recalculates boss profitability using only that synchronized set.
5. Stores resulting snapshots with the same `sync_run_id`.

The price set is invalid for profit calculation if it does not include Divine
Orb. Calculations must not combine independently selected latest prices from
different sync runs.

## Profit Calculation

For one boss, league, and synchronized price set:

```text
entryCostChaos =
  sum(entryComponent.quantity * itemPrice.chaosValue)

expectedReturnChaos =
  sum(drop.dropRate * itemPrice.chaosValue)
  for drops where drop.dropRate is not null

expectedProfitChaos =
  expectedReturnChaos - entryCostChaos

roiPercent =
  entryCostChaos > 0
    ? (expectedProfitChaos / entryCostChaos) * 100
    : 0
```

Per-drop expected values remain internal intermediate arithmetic. They are not
persisted or exposed in the public API.

A snapshot additionally stores:

- `sync_run_id`
- `divine_orb_chaos_value`
- `is_complete`
- `unknown_drop_count`

`is_complete` is false when at least one configured drop has a null chance.
`unknown_drop_count` is the number of such drops.

Historical Divine representations are derived from the snapshot's stored
`divine_orb_chaos_value`, not from the current exchange rate.

## Missing Data Behavior

The calculation fails and creates no snapshot when:

- an entry component has no price in the selected synchronized set;
- a drop with a known chance has no price in that set;
- the set has no Divine Orb price.

A drop with a null chance does not block the calculation. Its price may still be
returned for display when available, but it does not contribute to expected
return and marks the result incomplete.

Prices must be non-negative. Internal calculation and persistence retain their
available numeric precision. Rounding occurs only when serializing API
responses.

## Public API Shape

Boss detail responses expose the priced entry components, total entry price,
and configured drops. Monetary values use a consistent object:

```json
{
  "chaos": 50,
  "divine": 0.27
}
```

Example boss detail:

```json
{
  "boss": {
    "id": "shaper",
    "name": "Shaper",
    "slug": "shaper"
  },
  "entry": {
    "components": [
      {
        "item": {
          "id": "fragment-phoenix",
          "name": "Fragment of the Phoenix",
          "category": "fragment"
        },
        "quantity": 1,
        "unitPrice": {
          "chaos": 12,
          "divine": 0.065
        },
        "totalPrice": {
          "chaos": 12,
          "divine": 0.065
        }
      }
    ],
    "totalPrice": {
      "chaos": 50,
      "divine": 0.27
    }
  },
  "drops": [
    {
      "item": {
        "id": "orb-dominance",
        "name": "Orb of Dominance",
        "category": "currency"
      },
      "dropRate": 0.18,
      "price": {
        "chaos": 65,
        "divine": 0.35
      }
    }
  ]
}
```

Drops with an unknown chance return `"dropRate": null`. No
`expectedValueChaos` or equivalent per-drop expected-value field is exposed.

Profit responses expose entry cost, expected return, expected profit, and any
other monetary totals in both currencies. They also expose `isComplete` and
`unknownDropCount`.

## Persistence Constraints

The schema enforces:

- unique boss slugs;
- unique `(boss_id, item_id)` entry components;
- unique `(boss_id, item_id)` drops;
- positive entry quantities;
- null or `0..1` drop rates;
- non-negative Chaos prices;
- constrained item categories.

The rule that every active boss has at least one entry component spans tables
and is enforced by service validation and test coverage rather than a SQLite
row-level check.

## Migration

Create a new Drizzle migration that:

- removes `bosses.is_uber`;
- renames/rebuilds `boss_entry_costs` as `boss_entry_components`;
- rebuilds `boss_drops` without quantity-range columns and with nullable chance;
- removes `item_prices.divine_value`;
- adds `sync_run_id` associations;
- adds category, quantity, chance, price, and uniqueness constraints;
- adds the new profit snapshot completeness and exchange-rate columns.

Because D1/SQLite column and constraint changes commonly require table rebuilds,
the migration must copy compatible data explicitly and preserve foreign-key
integrity.

Existing KV profit entries are incompatible with the new response schema. The
deployment invalidates them by changing the cache-key version, for example from
`profit:` to `profit:v2:`.

## Seed Data

Update seed data so that:

- all encounters are independent boss records;
- no `is_uber` value is written;
- entry components reference ordinary items;
- Divine Orb has a Chaos price and no stored Divine price;
- categories use the constrained set;
- drops contain one nullable chance and no quantity range;
- seeded prices and snapshots share a stable seeded sync-run ID.

## Testing

Tests cover:

- a boss with one entry component;
- a boss with four distinct entry components;
- entry total as quantity times synchronized unit prices;
- one item dropping from multiple bosses at different chances;
- a null chance producing an incomplete calculation;
- unknown drops being excluded from expected return;
- missing entry-component prices failing calculation;
- missing known-drop prices failing calculation;
- missing Divine Orb price failing calculation;
- Chaos-to-Divine conversion;
- historical conversion using the snapshot exchange rate;
- rejection of prices from mixed sync runs;
- item category validation;
- entry quantity, drop-rate, price, and uniqueness constraints;
- the revised boss and profit API schemas;
- cache-key versioning behavior.

## Explicit Non-Goals

- Alternative entry methods for one boss
- Relationships between normal and Uber bosses
- League-specific drop chances
- Drop-rate history
- Variable drop quantities
- Item rarity modeling
- Frontend currency conversion
- Per-drop expected-value fields in the public API
