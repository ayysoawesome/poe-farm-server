export const PROFIT_CACHE_TTL_SECONDS = 300;

export const profitCacheKey = (leagueId: string, bossId: string): string =>
  `profit:v2:${leagueId}:${bossId}`;

export const getCachedJson = async <T>(
  namespace: KVNamespace,
  key: string
): Promise<T | null> => {
  const value = await namespace.get(key, "text");
  if (value === null) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    await namespace.delete(key);
    return null;
  }
};

export const setCachedJson = (
  namespace: KVNamespace,
  key: string,
  value: unknown,
  expirationTtl = PROFIT_CACHE_TTL_SECONDS
): Promise<void> =>
  namespace.put(key, JSON.stringify(value), { expirationTtl });
