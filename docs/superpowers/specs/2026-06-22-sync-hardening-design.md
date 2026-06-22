# Sync Hardening Design

## Scope

Fix the identified high- and medium-severity issues in the Cloudflare Worker:

1. Internal synchronization endpoints must fail closed when `CRON_SECRET` is missing.
2. Scheduled and manually triggered synchronizations must not run concurrently.
3. Price synchronization must not issue one D1 query per item and league pair.

The implementation will not introduce Durable Objects, Queues, or Workflows.

## Authentication

`CRON_SECRET` remains a Cloudflare secret binding and is required for every
request under `/internal/*`.

- Missing or empty configured secret: return `503 INTERNAL_SECRET_NOT_CONFIGURED`.
- Missing or incorrect `x-cron-secret` request header: return `401 UNAUTHORIZED`.
- Correct secret: continue to the route handler.
- Secret comparison continues to use SHA-256 digests and
  `crypto.subtle.timingSafeEqual`.

The generated Cloudflare environment type does not include secrets, so the
application-level `Env` type continues to extend `Cloudflare.Env` with the
secret binding. The binding is no longer optional.

## Synchronization Lease

Use D1 as the synchronization coordinator. Add a `sync_leases` table with one
row per lease name:

- `name`: primary key; the full synchronization uses `full-sync`.
- `owner_id`: unique ID of the current synchronization attempt.
- `expires_at`: epoch milliseconds after which another attempt may acquire it.
- `updated_at`: epoch milliseconds for diagnostics.

Lease acquisition is a single atomic SQLite upsert. It inserts a missing lease
or replaces an expired lease, but cannot overwrite an active lease owned by
another run. The operation reports whether a row changed.

`SyncService.runFullSync()` acquires the lease before creating a `sync_runs`
record. If acquisition fails, it throws an `AppError` with status `409` and code
`SYNC_ALREADY_RUNNING`.

The lease duration is 15 minutes. This is longer than the expected hourly MVP
synchronization and provides automatic recovery after Worker termination.

The service releases the lease in `finally`. Release deletes only the row whose
`name` and `owner_id` both match, preventing an expired previous owner from
deleting a newer owner's lease.

This protects both the scheduled handler and the manual `/internal/sync`
endpoint because both use `runFullSync()`. `/internal/recalculate` remains a
separate operation and will use the same lease so it cannot race with full
synchronization or another recalculation.

## Bulk Latest-Price Query

Replace per-item calls to `findLatestItemPrice()` during price synchronization
with a repository query that returns the latest price for every requested item
and league.

The query uses SQLite `ROW_NUMBER()` partitioned by `(item_id, league_id)` and
ordered by `captured_at DESC, id DESC`. Rows with rank `1` are the latest
prices. Requested item and league IDs are filtered before ranking.

To avoid SQLite bound-parameter limits, the repository splits requested IDs
into bounded chunks and merges the results. The current synchronization calls
the repository once at the service boundary and performs no D1 read inside the
nested item/league loops.

Items without an earlier price remain skipped, preserving current behavior.
Price insertion remains a bulk Drizzle insert.

## Error Handling and Observability

- Authentication failures use existing structured API error responses.
- Lease conflicts return HTTP `409`.
- Scheduled lease conflicts are logged as structured errors by the existing
  scheduled handler.
- Existing sync-run success/failure recording remains unchanged after the lease
  is acquired.
- Lease release is awaited. If both synchronization and release fail, the
  synchronization error remains primary and the release failure is logged.

## Testing

Follow test-first development:

1. Middleware tests prove missing configuration returns `503`, incorrect or
   missing headers return `401`, and a correct header reaches the handler.
2. Lease repository/service tests prove only one owner can acquire an active
   lease, expired leases can be acquired, and one owner cannot release another
   owner's lease.
3. Service tests prove concurrent full synchronization returns
   `SYNC_ALREADY_RUNNING` and that leases are released after success and error.
4. Price repository/service tests prove the latest row is selected for each
   item/league pair and no per-item repository lookup is used.
5. Run the full test suite, TypeScript check, generated binding type check, and
   Wrangler deployment dry run.

## Non-goals

- Moving synchronization to Cloudflare Workflows.
- Adding a distributed queue.
- Changing the public API response schema.
- Reworking snapshot or cache consistency beyond preventing concurrent syncs.
