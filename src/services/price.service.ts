import { createDb } from "../db/client";
import type { Env } from "../env";
import {
  listActivePoeNinjaLeagues,
  syncPoeNinjaLeagues
} from "../repositories/league.repository";
import { listActivePriceMappingsByProvider } from "../repositories/item-price-mapping.repository";
import {
  findLatestItemPrice,
  listManualItemPrices,
  upsertLatestItemPrices,
  type NewItemPrice
} from "../repositories/price.repository";
import type { PriceProviderName } from "../schemas/item-price-mapping.schema";
import { AppError } from "../utils/errors";
import { createId, nowMs } from "../utils/time";

const CHAOS_ORB_ITEM_ID = "chaos-orb";
const DIVINE_ORB_ITEM_ID = "divine-orb";
const DEFAULT_EXCLUDED_POE_NINJA_LEAGUE_IDS = new Set(["hardcore"]);
const EXCHANGE_FIRST_TYPES = new Set(["Fragment", "Invitation"]);
const STASH_CURRENCY_TYPES = new Set(["DivinationCard"]);
const STASH_ITEM_TYPES = new Set([
  "Map",
  "SkillGem",
  "UniqueAccessory",
  "UniqueArmour",
  "UniqueFlask",
  "UniqueJewel",
  "UniqueWeapon"
]);

export type PriceProviderMapping = {
  itemId: string;
  itemName: string;
  externalType: string;
  externalKey: string;
};

export type SyncedEconomyLeague = {
  id: string;
  name: string;
  externalName: string;
};

export interface PriceProvider {
  readonly name: string;
  fetchEconomyLeagues?(): Promise<SyncedEconomyLeague[]>;
  fetchPrices(input: {
    leagueId: string;
    leagueExternalName: string;
    mappings: readonly PriceProviderMapping[];
    referencePrices?: ReadonlyMap<string, number>;
    capturedAt: number;
  }): Promise<Map<string, number>>;
}

type PriceFetcher = (url: string, init?: RequestInit) => Promise<unknown>;

type PoeNinjaLine = {
  id?: unknown;
  name?: unknown;
  baseType?: unknown;
  variant?: unknown;
  primaryValue?: unknown;
  detailsId?: unknown;
  currencyTypeName?: unknown;
  chaosEquivalent?: unknown;
  chaosValue?: unknown;
};

type PoeNinjaEconomyLeague = {
  name?: unknown;
  displayName?: unknown;
};

type PoeNinjaOverviewItem = {
  id?: unknown;
  name?: unknown;
  detailsId?: unknown;
};

type PoeNinjaExchangePair = {
  id?: unknown;
  rate?: unknown;
};

type PoeNinjaExchangeDetails = {
  pairs?: unknown;
};

type PublicStashSearchQuery = {
  name: string;
  type?: string;
  identified?: boolean;
  minItemLevel?: number;
  maxItemLevel?: number;
};

type PublicStashItem = {
  name?: unknown;
  typeLine?: unknown;
  baseType?: unknown;
  identified?: unknown;
  itemLevel?: unknown;
  ilvl?: unknown;
  note?: unknown;
  forum_note?: unknown;
};

type PublicStash = {
  league?: unknown;
  items?: unknown;
};

type PublicStashProviderOptions = {
  changeId?: string;
  maxPages?: number;
  token?: string;
  userAgent?: string;
};

const readPoeNinjaPrice = (line: PoeNinjaLine): number | null => {
  const value = line.chaosEquivalent ?? line.chaosValue ?? line.primaryValue;
  return typeof value === "number" && Number.isFinite(value) ? value : null;
};

const readPoeNinjaExchangeChaosRate = (
  payload: PoeNinjaExchangeDetails
): number | null => {
  if (!Array.isArray(payload.pairs)) return null;
  const chaosPair = (payload.pairs as PoeNinjaExchangePair[]).find(
    (pair) => pair.id === "chaos"
  );
  const rate = chaosPair?.rate;
  return typeof rate === "number" && Number.isFinite(rate) ? rate : null;
};

const normalizePoeNinjaKey = (value: string): string => {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/^the\s+/, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
  return normalized;
};

const defaultPriceFetcher: PriceFetcher = async (url, init) => {
  const response = await fetch(url, {
    ...init,
    headers: {
      accept: "application/json",
      ...(init?.body === undefined ? {} : { "content-type": "application/json" }),
      "user-agent": "poe-farm-server/0.1.0",
      ...init?.headers
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

const toLeagueId = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const readExcludedPoeNinjaLeagueIds = (
  value: string | undefined
): ReadonlySet<string> => {
  if (value === undefined) return DEFAULT_EXCLUDED_POE_NINJA_LEAGUE_IDS;
  const ids = value
    .split(",")
    .map((leagueId) => toLeagueId(leagueId))
    .filter((leagueId) => leagueId !== "");
  return new Set(ids);
};

const isExcludedPoeNinjaLeagueId = (
  leagueId: string,
  excludedLeagueIds: ReadonlySet<string>
): boolean => {
  if (excludedLeagueIds.has(leagueId)) return true;
  return (
    excludedLeagueIds === DEFAULT_EXCLUDED_POE_NINJA_LEAGUE_IDS &&
    leagueId.startsWith("hardcore-")
  );
};

export class PoeNinjaPriceProvider implements PriceProvider {
  readonly name = "poe_ninja";

  private readonly excludedLeagueIds: ReadonlySet<string>;

  constructor(
    private readonly fetcher: PriceFetcher = defaultPriceFetcher,
    options: { excludedLeagueIds?: ReadonlySet<string> } = {}
  ) {
    this.excludedLeagueIds =
      options.excludedLeagueIds ?? DEFAULT_EXCLUDED_POE_NINJA_LEAGUE_IDS;
  }

  async fetchEconomyLeagues(): Promise<SyncedEconomyLeague[]> {
    const payload = await this.fetcher(
      "https://poe.ninja/poe1/api/data/index-state"
    );
    if (
      typeof payload !== "object" ||
      payload === null ||
      !("economyLeagues" in payload) ||
      !Array.isArray((payload as { economyLeagues: unknown }).economyLeagues)
    ) {
      return [];
    }

    const result: SyncedEconomyLeague[] = [];
    for (const league of (payload as {
      economyLeagues: PoeNinjaEconomyLeague[];
    }).economyLeagues) {
      if (typeof league.name !== "string" || league.name.trim() === "") {
        continue;
      }
      const id = toLeagueId(league.name);
      if (id === "") continue;
      if (isExcludedPoeNinjaLeagueId(id, this.excludedLeagueIds)) continue;
      const displayName =
        typeof league.displayName === "string" && league.displayName.trim() !== ""
          ? league.displayName.trim()
          : league.name.trim();
      result.push({
        id,
        name: displayName,
        externalName: league.name.trim()
      });
    }
    return result;
  }

  async fetchPrices(input: {
    leagueId: string;
    leagueExternalName: string;
    mappings: readonly PriceProviderMapping[];
    capturedAt: number;
  }): Promise<Map<string, number>> {
    const prices = new Map<string, number>();
    const mappingsByType = groupBy(input.mappings, (mapping) => mapping.externalType);

    for (const [externalType, mappings] of mappingsByType) {
      if (externalType === "Currency") {
        const exchangePrices = await this.fetchExchangePrices(
          input.leagueExternalName,
          externalType,
          mappings
        );
        for (const [itemId, price] of exchangePrices) prices.set(itemId, price);

        const exchangeDetailsMappings = mappings.filter(
          (mapping) => !prices.has(mapping.itemId)
        );
        if (exchangeDetailsMappings.length > 0) {
          const exchangeDetailsPrices = await this.fetchExchangeDetailsPrices(
            input.leagueExternalName,
            externalType,
            exchangeDetailsMappings
          );
          for (const [itemId, price] of exchangeDetailsPrices) {
            prices.set(itemId, price);
          }
        }

        const missingMappings = mappings.filter(
          (mapping) => !prices.has(mapping.itemId)
        );
        if (missingMappings.length > 0) {
          this.addMappedPrices(
            prices,
            missingMappings,
            await this.fetchCurrencyLines(input.leagueExternalName)
          );
        }
        continue;
      }

      if (STASH_CURRENCY_TYPES.has(externalType)) {
        const stashCurrencyPrices = await this.fetchStashCurrencyPrices(
          input.leagueExternalName,
          externalType,
          mappings
        );
        for (const [itemId, price] of stashCurrencyPrices) prices.set(itemId, price);
        continue;
      }

      if (STASH_ITEM_TYPES.has(externalType)) {
        const stashItemPrices = await this.fetchStashItemPrices(
          input.leagueExternalName,
          externalType,
          mappings
        );
        for (const [itemId, price] of stashItemPrices) prices.set(itemId, price);
        continue;
      }

      if (!EXCHANGE_FIRST_TYPES.has(externalType)) continue;

      const exchangePrices = await this.fetchExchangePrices(
        input.leagueExternalName,
        externalType,
        mappings
      );
      for (const [itemId, price] of exchangePrices) prices.set(itemId, price);

      const missingMappings = mappings.filter(
        (mapping) => !prices.has(mapping.itemId)
      );
      if (missingMappings.length === 0) continue;
      const stashCurrencyPrices = await this.fetchStashCurrencyPrices(
        input.leagueExternalName,
        externalType,
        missingMappings
      );
      for (const [itemId, price] of stashCurrencyPrices) {
        prices.set(itemId, price);
      }

      const stillMissingMappings = mappings.filter(
        (mapping) => !prices.has(mapping.itemId)
      );
      if (stillMissingMappings.length === 0) continue;
      const stashItemPrices = await this.fetchStashItemPrices(
        input.leagueExternalName,
        externalType,
        stillMissingMappings
      );
      for (const [itemId, price] of stashItemPrices) prices.set(itemId, price);
    }

    return prices;
  }

  private createCurrencyUrl(leagueExternalName: string): string {
    const params = new URLSearchParams({
      league: leagueExternalName,
      type: "Currency"
    });
    return `https://poe.ninja/poe1/api/economy/stash/current/currency/overview?${params.toString()}`;
  }

  private createExchangeUrl(
    leagueExternalName: string,
    externalType: string
  ): string {
    const params = new URLSearchParams({
      league: leagueExternalName,
      type: externalType
    });
    return `https://poe.ninja/poe1/api/economy/exchange/current/overview?${params.toString()}`;
  }

  private createExchangeDetailsUrl(
    leagueExternalName: string,
    externalType: string,
    detailsId: string
  ): string {
    const params = new URLSearchParams({
      league: leagueExternalName,
      type: externalType,
      id: detailsId
    });
    return `https://poe.ninja/poe1/api/economy/exchange/current/details?${params.toString()}`;
  }

  private createStashItemUrl(
    leagueExternalName: string,
    externalType: string
  ): string {
    const params = new URLSearchParams({
      league: leagueExternalName,
      type: externalType
    });
    return `https://poe.ninja/poe1/api/economy/stash/current/item/overview?${params.toString()}`;
  }

  private createStashCurrencyUrl(
    leagueExternalName: string,
    externalType: string
  ): string {
    const params = new URLSearchParams({
      league: leagueExternalName,
      type: externalType
    });
    return `https://poe.ninja/poe1/api/economy/stash/current/currency/overview?${params.toString()}`;
  }

  private async fetchCurrencyLines(
    leagueExternalName: string
  ): Promise<Map<string, PoeNinjaLine>> {
    const payload = await this.fetcher(this.createCurrencyUrl(leagueExternalName));
    return this.indexLines(this.readLines(payload), []);
  }

  private async fetchExchangePrices(
    leagueExternalName: string,
    externalType: string,
    mappings: readonly PriceProviderMapping[]
  ): Promise<Map<string, number>> {
    try {
      const payload = await this.fetcher(
        this.createExchangeUrl(leagueExternalName, externalType)
      );
      return this.mapPrices(
        mappings,
        this.indexLines(this.readLines(payload), this.readItems(payload))
      );
    } catch {
      return new Map();
    }
  }

  private async fetchExchangeDetailsPrices(
    leagueExternalName: string,
    externalType: string,
    mappings: readonly PriceProviderMapping[]
  ): Promise<Map<string, number>> {
    const prices = new Map<string, number>();
    for (const mapping of mappings) {
      if (mapping.itemId === CHAOS_ORB_ITEM_ID) {
        prices.set(mapping.itemId, 1);
        continue;
      }
      try {
        const payload = await this.fetcher(
          this.createExchangeDetailsUrl(
            leagueExternalName,
            externalType,
            mapping.itemId
          )
        );
        const rate = readPoeNinjaExchangeChaosRate(
          payload as PoeNinjaExchangeDetails
        );
        if (rate !== null) prices.set(mapping.itemId, rate);
      } catch {
        // Fall back to the grouped overview endpoints below.
      }
    }
    return prices;
  }

  private async fetchStashItemPrices(
    leagueExternalName: string,
    externalType: string,
    mappings: readonly PriceProviderMapping[]
  ): Promise<Map<string, number>> {
    const payload = await this.fetcher(
      this.createStashItemUrl(leagueExternalName, externalType)
    );
    return this.mapPrices(mappings, this.indexLines(this.readLines(payload), []));
  }

  private async fetchStashCurrencyPrices(
    leagueExternalName: string,
    externalType: string,
    mappings: readonly PriceProviderMapping[]
  ): Promise<Map<string, number>> {
    try {
      const payload = await this.fetcher(
        this.createStashCurrencyUrl(leagueExternalName, externalType)
      );
      return this.mapPrices(mappings, this.indexLines(this.readLines(payload), []));
    } catch {
      return new Map();
    }
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

  private readItems(payload: unknown): PoeNinjaOverviewItem[] {
    if (
      typeof payload !== "object" ||
      payload === null ||
      !("items" in payload) ||
      !Array.isArray((payload as { items: unknown }).items)
    ) {
      return [];
    }
    return (payload as { items: PoeNinjaOverviewItem[] }).items;
  }

  private addLineKey(
    linesByKey: Map<string, PoeNinjaLine>,
    key: unknown,
    line: PoeNinjaLine
  ): void {
    if (typeof key !== "string" || key.trim() === "") return;
    linesByKey.set(key, line);
    linesByKey.set(normalizePoeNinjaKey(key), line);
  }

  private indexLines(
    lines: readonly PoeNinjaLine[],
    items: readonly PoeNinjaOverviewItem[]
  ): Map<string, PoeNinjaLine> {
    const itemsById = new Map(
      items
        .filter((item) => typeof item.id === "string")
        .map((item) => [item.id as string, item])
    );
    const linesByKey = new Map<string, PoeNinjaLine>();
    for (const line of lines) {
      this.addLineKey(linesByKey, line.id, line);
      this.addLineKey(linesByKey, line.detailsId, line);
      this.addLineKey(linesByKey, line.currencyTypeName, line);
      this.addLineKey(linesByKey, line.name, line);
      this.addLineKey(linesByKey, line.baseType, line);
      const overviewItem =
        typeof line.id === "string" ? itemsById.get(line.id) : undefined;
      if (overviewItem !== undefined) {
        this.addLineKey(linesByKey, overviewItem.id, line);
        this.addLineKey(linesByKey, overviewItem.detailsId, line);
        this.addLineKey(linesByKey, overviewItem.name, line);
      }
    }
    return linesByKey;
  }

  private mapPrices(
    mappings: readonly PriceProviderMapping[],
    linesByKey: ReadonlyMap<string, PoeNinjaLine>
  ): Map<string, number> {
    const prices = new Map<string, number>();
    for (const mapping of mappings) {
      if (mapping.itemId === CHAOS_ORB_ITEM_ID) {
        prices.set(mapping.itemId, 1);
        continue;
      }
      const line =
        linesByKey.get(mapping.externalKey) ??
        linesByKey.get(normalizePoeNinjaKey(mapping.externalKey));
      if (line === undefined) continue;
      const price = readPoeNinjaPrice(line);
      if (price !== null) prices.set(mapping.itemId, price);
    }
    return prices;
  }

  private addMappedPrices(
    prices: Map<string, number>,
    mappings: readonly PriceProviderMapping[],
    linesByKey: ReadonlyMap<string, PoeNinjaLine>
  ): void {
    for (const [itemId, price] of this.mapPrices(mappings, linesByKey)) {
      prices.set(itemId, price);
    }
  }
}

const parsePublicStashQuery = (
  mapping: PriceProviderMapping
): PublicStashSearchQuery | null => {
  if (mapping.externalType !== "PublicStashSearch") return null;
  try {
    const parsed = JSON.parse(mapping.externalKey) as Partial<PublicStashSearchQuery>;
    if (typeof parsed.name !== "string" || parsed.name.trim() === "") {
      return null;
    }
    return {
      name: parsed.name,
      ...(typeof parsed.type === "string" ? { type: parsed.type } : {}),
      ...(typeof parsed.identified === "boolean"
        ? { identified: parsed.identified }
        : {}),
      ...(typeof parsed.minItemLevel === "number"
        ? { minItemLevel: parsed.minItemLevel }
        : {}),
      ...(typeof parsed.maxItemLevel === "number"
        ? { maxItemLevel: parsed.maxItemLevel }
        : {})
    };
  } catch {
    return null;
  }
};

const readPublicStashes = (payload: unknown): PublicStash[] => {
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("stashes" in payload) ||
    !Array.isArray((payload as { stashes: unknown }).stashes)
  ) {
    return [];
  }
  return (payload as { stashes: PublicStash[] }).stashes;
};

const readNextPublicStashChangeId = (payload: unknown): string | undefined => {
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("next_change_id" in payload) ||
    typeof (payload as { next_change_id: unknown }).next_change_id !== "string"
  ) {
    return undefined;
  }
  return (payload as { next_change_id: string }).next_change_id;
};

const parseExactPriceNote = (
  note: unknown,
  referencePrices: ReadonlyMap<string, number>
): number | null => {
  if (typeof note !== "string") return null;
  const match = /^~price\s+(\d+(?:\.\d+)?)\s+([a-z -]+)$/i.exec(note.trim());
  if (match === null) return null;
  const amount = Number(match[1]);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  const currency = match[2]?.toLowerCase().replace(/\s+/g, " ").trim();
  if (currency === "chaos" || currency === "chaos orb") return amount;
  if (currency === "divine" || currency === "divine orb") {
    const divineChaosValue = referencePrices.get(DIVINE_ORB_ITEM_ID);
    return divineChaosValue === undefined ? null : amount * divineChaosValue;
  }
  return null;
};

const publicStashItemLevel = (item: PublicStashItem): number | null => {
  const value = item.itemLevel ?? item.ilvl;
  return typeof value === "number" && Number.isFinite(value) ? value : null;
};

const matchesPublicStashQuery = (
  item: PublicStashItem,
  query: PublicStashSearchQuery
): boolean => {
  if (item.name !== query.name) return false;
  if (
    query.type !== undefined &&
    item.typeLine !== query.type &&
    item.baseType !== query.type
  ) {
    return false;
  }
  if (
    query.identified !== undefined &&
    item.identified !== query.identified
  ) {
    return false;
  }
  const itemLevel = publicStashItemLevel(item);
  if (
    query.minItemLevel !== undefined &&
    (itemLevel === null || itemLevel < query.minItemLevel)
  ) {
    return false;
  }
  if (
    query.maxItemLevel !== undefined &&
    (itemLevel === null || itemLevel > query.maxItemLevel)
  ) {
    return false;
  }
  return true;
};

const createPublicStashUrl = (changeId: string | undefined): string => {
  const baseUrl = "https://api.pathofexile.com/public-stash-tabs";
  return changeId === undefined
    ? baseUrl
    : `${baseUrl}?${new URLSearchParams({ id: changeId }).toString()}`;
};

const readMaxPages = (value: string | undefined): number | undefined => {
  if (value === undefined) return undefined;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
};

export class PoePublicStashPriceProvider implements PriceProvider {
  readonly name = "poe_public_stash";

  private readonly changeId: string | undefined;
  private readonly maxPages: number;
  private readonly token: string | undefined;
  private readonly userAgent: string;

  constructor(
    private readonly fetcher: PriceFetcher = defaultPriceFetcher,
    options: PublicStashProviderOptions = {}
  ) {
    this.changeId = options.changeId;
    this.maxPages = options.maxPages ?? 1;
    this.token = options.token;
    this.userAgent =
      options.userAgent ??
      "OAuth poe-farm-server/0.1.0 (contact: configure-POE_API_USER_AGENT)";
  }

  async fetchPrices(input: {
    leagueId: string;
    leagueExternalName: string;
    mappings: readonly PriceProviderMapping[];
    referencePrices?: ReadonlyMap<string, number>;
    capturedAt: number;
  }): Promise<Map<string, number>> {
    const candidates = new Map<string, number[]>();
    const referencePrices = input.referencePrices ?? new Map<string, number>();
    const queries = input.mappings
      .map((mapping) => ({ mapping, query: parsePublicStashQuery(mapping) }))
      .filter(
        (entry): entry is {
          mapping: PriceProviderMapping;
          query: PublicStashSearchQuery;
        } => entry.query !== null
      );

    if (queries.length === 0) return new Map();

    let changeId = this.changeId;
    for (let page = 0; page < this.maxPages; page += 1) {
      const payload = await this.fetcher(createPublicStashUrl(changeId), {
        headers: {
          "user-agent": this.userAgent,
          ...(this.token === undefined
            ? {}
            : { authorization: `Bearer ${this.token}` })
        }
      });
      changeId = readNextPublicStashChangeId(payload);
      for (const stash of readPublicStashes(payload)) {
        if (
          stash.league !== input.leagueExternalName ||
          !Array.isArray(stash.items)
        ) {
          continue;
        }
        for (const item of stash.items as PublicStashItem[]) {
          for (const { mapping, query } of queries) {
            if (!matchesPublicStashQuery(item, query)) continue;
            const price =
              parseExactPriceNote(item.note, referencePrices) ??
              parseExactPriceNote(item.forum_note, referencePrices);
            if (price === null) continue;
            const current = candidates.get(mapping.itemId);
            if (current === undefined) {
              candidates.set(mapping.itemId, [price]);
            } else {
              current.push(price);
            }
          }
        }
      }
      if (changeId === undefined) break;
    }

    const prices = new Map<string, number>();
    for (const [itemId, values] of candidates) {
      values.sort((left, right) => left - right);
      const lowest = values[0];
      if (lowest !== undefined) prices.set(itemId, lowest);
    }
    return prices;
  }
}

export class MockPriceProvider implements PriceProvider {
  readonly name = "mock";

  async fetchPrices(input: {
    leagueId: string;
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

export class ManualPriceProvider implements PriceProvider {
  readonly name = "manual";

  constructor(private readonly db: ReturnType<typeof createDb>) {}

  async fetchPrices(input: {
    leagueId: string;
    leagueExternalName: string;
    mappings: readonly PriceProviderMapping[];
    capturedAt: number;
  }): Promise<Map<string, number>> {
    const mappedItemIds = input.mappings
      .filter((mapping) => mapping.externalType === "Manual")
      .map((mapping) => mapping.itemId);
    const rows = await listManualItemPrices(this.db, input.leagueId, mappedItemIds);
    return new Map(rows.map((row) => [row.itemId, row.chaosValue]));
  }
}

const createPublicStashProvider = (env: Env): PoePublicStashPriceProvider => {
  const options: PublicStashProviderOptions = {};
  const maxPages = readMaxPages(env.POE_PUBLIC_STASH_MAX_PAGES);
  if (env.POE_PUBLIC_STASH_CHANGE_ID !== undefined) {
    options.changeId = env.POE_PUBLIC_STASH_CHANGE_ID;
  }
  if (maxPages !== undefined) options.maxPages = maxPages;
  if (env.POE_API_TOKEN !== undefined) options.token = env.POE_API_TOKEN;
  if (env.POE_API_USER_AGENT !== undefined) {
    options.userAgent = env.POE_API_USER_AGENT;
  }
  return new PoePublicStashPriceProvider(defaultPriceFetcher, options);
};

const getProvider = (
  name: string | undefined,
  env: Env,
  db: ReturnType<typeof createDb>
): PriceProvider => {
  if (name === undefined || name === "mock") return new MockPriceProvider();
  if (name === "poe_ninja") {
    return new PoeNinjaPriceProvider(defaultPriceFetcher, {
      excludedLeagueIds: readExcludedPoeNinjaLeagueIds(
        env.POE_NINJA_EXCLUDED_LEAGUE_IDS
      )
    });
  }
  if (name === "poe_public_stash") return createPublicStashProvider(env);
  if (name === "manual") return new ManualPriceProvider(db);
  throw new AppError(
    500,
    "UNSUPPORTED_PRICE_PROVIDER",
    `Unsupported price provider '${name}'`
  );
};

const getSyncProviders = (
  name: string | undefined,
  env: Env,
  db: ReturnType<typeof createDb>
): PriceProvider[] => {
  if (name === undefined || name === "mock") {
    return [new MockPriceProvider(), new ManualPriceProvider(db)];
  }
  if (name === "poe_ninja") {
    return [
      new PoeNinjaPriceProvider(defaultPriceFetcher, {
        excludedLeagueIds: readExcludedPoeNinjaLeagueIds(
          env.POE_NINJA_EXCLUDED_LEAGUE_IDS
        )
      }),
      new ManualPriceProvider(db),
      createPublicStashProvider(env)
    ];
  }
  return [getProvider(name, env, db)];
};

const mappingProvidersFor = (
  provider: PriceProvider
): readonly PriceProviderName[] =>
  provider.name === "mock"
    ? ["poe_ninja", "poe_public_stash"]
    : [provider.name as PriceProviderName];

export class PriceService {
  constructor(private readonly env: Env) {}

  async getDivineChaosRate(leagueId: string) {
    const price = await findLatestItemPrice(
      createDb(this.env.DB),
      DIVINE_ORB_ITEM_ID,
      leagueId
    );
    if (price === null) {
      throw new AppError(
        404,
        "DIVINE_CHAOS_RATE_NOT_FOUND",
        `No Divine Orb price exists for league '${leagueId}'`
      );
    }
    return {
      leagueId,
      chaosValue: price.chaosValue,
      capturedAt: price.capturedAt,
      syncRunId: price.syncRunId
    };
  }

  async syncLeagues(): Promise<number> {
    const provider = getProvider(
      this.env.PRICE_SYNC_PROVIDER,
      this.env,
      createDb(this.env.DB)
    );
    if (provider.fetchEconomyLeagues === undefined) return 0;
    const leagues = await provider.fetchEconomyLeagues();
    return syncPoeNinjaLeagues(this.env.DB, leagues, nowMs());
  }

  async syncPrices(syncRunId: string): Promise<number> {
    const db = createDb(this.env.DB);
    const providers = getSyncProviders(this.env.PRICE_SYNC_PROVIDER, this.env, db);
    const activeLeagues = await listActivePoeNinjaLeagues(db);
    const capturedAt = nowMs();
    const prices: NewItemPrice[] = [];
    const mappingsByProvider = new Map<PriceProviderName, PriceProviderMapping[]>();

    for (const providerName of new Set(providers.flatMap(mappingProvidersFor))) {
      mappingsByProvider.set(
        providerName,
        await listActivePriceMappingsByProvider(db, providerName)
      );
    }

    for (const league of activeLeagues) {
      const referencePrices = new Map<string, number>();
      for (const provider of providers) {
        const mappings = mappingProvidersFor(provider).flatMap(
          (providerName) => mappingsByProvider.get(providerName) ?? []
        );
        const fetchedPrices = await provider.fetchPrices({
          leagueId: league.id,
          leagueExternalName: league.externalName,
          mappings,
          referencePrices,
          capturedAt,
        });
        for (const [itemId, chaosValue] of fetchedPrices) {
          referencePrices.set(itemId, chaosValue);
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
    }

    return upsertLatestItemPrices(this.env.DB, prices);
  }
}
