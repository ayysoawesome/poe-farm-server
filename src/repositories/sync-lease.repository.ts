export const acquireSyncLease = async (
  database: D1Database,
  name: string,
  ownerId: string,
  now: number,
  expiresAt: number
): Promise<boolean> => {
  const acquired = await database
    .prepare(
      `INSERT INTO sync_leases (name, owner_id, expires_at, updated_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(name) DO UPDATE SET
         owner_id = excluded.owner_id,
         expires_at = excluded.expires_at,
         updated_at = excluded.updated_at
       WHERE sync_leases.expires_at <= ?
       RETURNING owner_id`
    )
    .bind(name, ownerId, expiresAt, now, now)
    .first<{ owner_id: string }>();

  return acquired?.owner_id === ownerId;
};

export const releaseSyncLease = async (
  database: D1Database,
  name: string,
  ownerId: string
): Promise<void> => {
  await database
    .prepare("DELETE FROM sync_leases WHERE name = ? AND owner_id = ?")
    .bind(name, ownerId)
    .run();
};
