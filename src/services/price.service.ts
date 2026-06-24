import { createDb } from "../db/client";
import type { Env } from "../env";
import { listActiveLeagues } from "../repositories/league.repository";
import { listActivePriceMappingsByProvider } from "../repositories/item-price-mapping.repository";
import {
  insertItemPrices,
  type NewItemPrice
} from "../repositories/price.repository";
import type { PriceProviderName } from "../schemas/item-price-mapping.schema";
import { AppError } from "../utils/errors";
import { createId, nowMs } from "../utils/time";

const CHAOS_ORB_ITEM_ID = "chaos-orb";

export type PriceProviderMapping = {
  itemId: string;
  itemName: string;
  externalType: string;
  externalKey: string;
};

export interface PriceProvider {
  readonly name: string;
  fetchPrices(input: {
    leagueExternalName: string;
    mappings: readonly PriceProviderMapping[];
    capturedAt: number;
  }): Promise<Map<string, number>>;
}

type PoeNinjaFetcher = (url: string) => Promise<unknown>;

type PoeNinjaLine = {
  name?: unknown;
  currencyTypeName?: unknown;
  chaosEquivalent?: unknown;
  chaosValue?: unknown;
};

const readPoeNinjaPrice = (line: PoeNinjaLine): number | null => {
  const value = line.chaosEquivalent ?? line.chaosValue;
  return typeof value === "number" && Number.isFinite(value) ? value : null;
};

const defaultPoeNinjaFetcher: PoeNinjaFetcher = async (url) => {
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "user-agent": "poe-farm-server/0.1.0"
    }
  });
  if (!response.ok) {
    throw new AppError(
      503,
      "PRICE_PROVIDER_UNAVAILABLE",
      `poe.ninja request failed with ${response.status}`
    );
  }
  return response.json();
};

const groupBy = <T, K extends string>(
  values: readonly T[],
  getKey: (value: T) => K
): Map<K, T[]> => {
  const groups = new Map<K, T[]>();
  for (const value of values) {
    const key = getKey(value);
    const group = groups.get(key);
    if (group === undefined) {
      groups.set(key, [value]);
    } else {
      group.push(value);
    }
  }
  return groups;
};

export class PoeNinjaPriceProvider implements PriceProvider {
  readonly name = "poe_ninja";

  constructor(private readonly fetcher: PoeNinjaFetcher = defaultPoeNinjaFetcher) {}

  async fetchPrices(input: {
    leagueExternalName: string;
    mappings: readonly PriceProviderMapping[];
    capturedAt: number;
  }): Promise<Map<string, number>> {
    const prices = new Map<string, number>();
    const mappingsByType = groupBy(input.mappings, (mapping) => mapping.externalType);

    for (const [externalType, mappings] of mappingsByType) {
      const url = this.createUrl(input.leagueExternalName, externalType);
      const payload = await this.fetcher(url);
      const lines = this.readLines(payload);
      const linesByKey = new Map<string, PoeNinjaLine>();
      for (const line of lines) {
        const key =
          externalType === "Currency" ? line.currencyTypeName : line.name;
        if (typeof key === "string") {
          linesByKey.set(key, line);
        }
      }

      for (const mapping of mappings) {
        if (mapping.itemId === CHAOS_ORB_ITEM_ID) {
          prices.set(mapping.itemId, 1);
          continue;
        }
        const line = linesByKey.get(mapping.externalKey);
        if (line === undefined) continue;
        const price = readPoeNinjaPrice(line);
        if (price !== null) {
          prices.set(mapping.itemId, price);
        }
      }
    }

    return prices;
  }

  private createUrl(leagueExternalName: string, externalType: string): string {
    const endpoint =
      externalType === "Currency" ? "currencyoverview" : "itemoverview";
    const params = new URLSearchParams({
      league: leagueExternalName,
      type: externalType
    });
    return `https://poe.ninja/api/data/${endpoint}?${params.toString()}`;
  }

  private readLines(payload: unknown): PoeNinjaLine[] {
    if (
      typeof payload !== "object" ||
      payload === null ||
      !("lines" in payload) ||
      !Array.isArray((payload as { lines: unknown }).lines)
    ) {
      return [];
    }
    return (payload as { lines: PoeNinjaLine[] }).lines;
  }
}

export class MockPriceProvider implements PriceProvider {
  readonly name = "mock";

  async fetchPrices(input: {
    leagueExternalName: string;
    mappings: readonly PriceProviderMapping[];
    capturedAt: number;
  }): Promise<Map<string, number>> {
    const prices = new Map<string, number>();
    for (const mapping of input.mappings) {
      if (mapping.itemId === CHAOS_ORB_ITEM_ID) {
        prices.set(mapping.itemId, 1);
        continue;
      }
      const hash = [...`${mapping.itemId}:${input.leagueExternalName}`].reduce(
        (total, character) => total + character.charCodeAt(0),
        0
      );
      const hourlyStep = Math.floor(input.capturedAt / 3_600_000);
      prices.set(mapping.itemId, Math.max(0.01, ((hash + hourlyStep) % 500) + 1));
    }
    return prices;
  }
}

const getProvider = (name: string | undefined): PriceProvider => {
  if (name === undefined || name === "mock") return new MockPriceProvider();
  if (name === "poe_ninja") return new PoeNinjaPriceProvider();
  throw new AppError(
    500,
    "UNSUPPORTED_PRICE_PROVIDER",
    `Unsupported price provider '${name}'`
  );
};

export class PriceService {
  constructor(private readonly env: Env) {}

  async syncPrices(syncRunId: string): Promise<number> {
    const db = createDb(this.env.DB);
    const provider = getProvider(this.env.PRICE_SYNC_PROVIDER);
    const mappingProvider: PriceProviderName =
      provider.name === "mock" ? "poe_ninja" : (provider.name as PriceProviderName);
    const [mappings, activeLeagues] = await Promise.all([
      listActivePriceMappingsByProvider(db, mappingProvider),
      listActiveLeagues(db)
    ]);
    const capturedAt = nowMs();
    const prices: NewItemPrice[] = [];

    for (const league of activeLeagues) {
      const fetchedPrices = await provider.fetchPrices({
        leagueExternalName: league.externalName,
        mappings,
        capturedAt
      });
      for (const [itemId, chaosValue] of fetchedPrices) {
        prices.push({
          id: createId("price"),
          syncRunId,
          itemId,
          leagueId: league.id,
          chaosValue,
          source: provider.name,
          capturedAt,
          createdAt: capturedAt
        });
      }
    }

    return insertItemPrices(db, prices);
  }
}
