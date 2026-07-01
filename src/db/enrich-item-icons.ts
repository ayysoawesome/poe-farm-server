import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

type CuratedItem = {
  id: string;
  name: string;
  category: string;
  iconUrl?: string | null;
  externalType?: string;
  externalKey?: string;
  poeNinjaType?: string;
  poeNinjaKey?: string;
  [key: string]: unknown;
};

type PoeNinjaLine = {
  id?: unknown;
  name?: unknown;
  baseType?: unknown;
  detailsId?: unknown;
  currencyTypeName?: unknown;
  icon?: unknown;
};

type PoeNinjaPayload = {
  lines?: unknown;
  currencyDetails?: unknown;
};

const DEFAULT_LEAGUES = ["Standard", "Mirage"];
const DIVINATION_CARD_ICON_URL =
  "https://web.poecdn.com/image/Art/2DItems/Divination/InventoryIcon.png?scale=1&w=1&h=1";
const STASH_ITEM_TYPES = [
  "SkillGem",
  "UniqueAccessory",
  "UniqueArmour",
  "UniqueFlask",
  "UniqueJewel",
  "UniqueWeapon"
];
const EXCHANGE_TYPES = ["Fragment", "Invitation"];
const POE_CDN_ICON_PREFIX = "https://web.poecdn.com/";
const CURRENCY_DETAIL_TYPES = ["Currency", "Fragment", "Invitation", "DivinationCard"];
const MANUAL_ICON_FALLBACK_TYPES = ["UniqueJewel"];

const normalizeKey = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/^the\s+/, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

const addKey = (
  iconsByKey: Map<string, string>,
  key: unknown,
  icon: string
): void => {
  if (typeof key !== "string" || key.trim() === "") return;
  iconsByKey.set(key, icon);
  iconsByKey.set(normalizeKey(key), icon);
};

const endpointForType = (externalType: string): "item" | "exchange" | null => {
  if (externalType === "Invitation") return "item";
  if (STASH_ITEM_TYPES.includes(externalType)) return "item";
  if (EXCHANGE_TYPES.includes(externalType)) return "exchange";
  return null;
};

const createOverviewUrl = (
  league: string,
  externalType: string,
  endpoint: "item" | "exchange"
): string => {
  const params = new URLSearchParams({ league, type: externalType });
  const section =
    endpoint === "item" ? "stash/current/item" : "exchange/current";
  return `https://poe.ninja/poe1/api/economy/${section}/overview?${params.toString()}`;
};

const fetchJson = async (url: string): Promise<unknown> => {
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "user-agent": "poe-farm-server/0.1.0"
    }
  });
  if (!response.ok) {
    throw new Error(`poe.ninja request failed with ${response.status}: ${url}`);
  }
  return response.json();
};

const fetchPoewikiIconFile = async (name: string): Promise<string | null> => {
  const params = new URLSearchParams({
    action: "cargoquery",
    format: "json",
    tables: "items",
    fields: "items.inventory_icon",
    where: `items.name="${name.replaceAll('"', '\\"')}"`,
    limit: "1"
  });
  const payload = await fetchJson(`https://www.poewiki.net/api.php?${params}`);
  if (
    typeof payload !== "object" ||
    payload === null ||
    !Array.isArray((payload as { cargoquery?: unknown }).cargoquery)
  ) {
    return null;
  }
  const first = (payload as { cargoquery: Array<{ title?: unknown }> })
    .cargoquery[0];
  const title = first?.title;
  if (typeof title !== "object" || title === null) return null;
  const icon = (title as { "inventory icon"?: unknown })["inventory icon"];
  return typeof icon === "string" && icon.trim() !== "" ? icon : null;
};

const fetchPoewikiImageUrl = async (fileTitle: string): Promise<string | null> => {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    titles: fileTitle,
    prop: "imageinfo",
    iiprop: "url"
  });
  const payload = await fetchJson(`https://www.poewiki.net/api.php?${params}`);
  if (typeof payload !== "object" || payload === null) return null;
  const pages = (payload as { query?: { pages?: Record<string, unknown> } }).query
    ?.pages;
  if (pages === undefined) return null;
  for (const page of Object.values(pages)) {
    if (typeof page !== "object" || page === null) continue;
    const imageinfo = (page as { imageinfo?: unknown }).imageinfo;
    if (!Array.isArray(imageinfo)) continue;
    const url = (imageinfo[0] as { url?: unknown } | undefined)?.url;
    if (typeof url === "string" && url.trim() !== "") return url;
  }
  return null;
};

const fetchPoewikiIconUrl = async (name: string): Promise<string | null> => {
  const fileTitle = await fetchPoewikiIconFile(name);
  if (fileTitle === null) return null;
  return fetchPoewikiImageUrl(fileTitle);
};

const createCurrencyDetailsUrl = (league: string, externalType: string): string => {
  const params = new URLSearchParams({ league, type: externalType });
  return `https://poe.ninja/poe1/api/economy/stash/current/currency/overview?${params.toString()}`;
};

const readLines = (payload: unknown): PoeNinjaLine[] => {
  if (
    typeof payload !== "object" ||
    payload === null ||
    !Array.isArray((payload as PoeNinjaPayload).lines)
  ) {
    return [];
  }
  return (payload as { lines: PoeNinjaLine[] }).lines;
};

const readCurrencyDetails = (payload: unknown): PoeNinjaLine[] => {
  if (
    typeof payload !== "object" ||
    payload === null ||
    !Array.isArray((payload as PoeNinjaPayload).currencyDetails)
  ) {
    return [];
  }
  return (payload as { currencyDetails: PoeNinjaLine[] }).currencyDetails;
};

const addIconLine = (iconsByKey: Map<string, string>, line: PoeNinjaLine): void => {
  if (typeof line.icon !== "string" || line.icon.trim() === "") return;
  addKey(iconsByKey, line.id, line.icon);
  addKey(iconsByKey, line.detailsId, line.icon);
  addKey(iconsByKey, line.currencyTypeName, line.icon);
  addKey(iconsByKey, line.name, line.icon);
  addKey(iconsByKey, line.baseType, line.icon);
};

const buildIconIndex = async (
  items: readonly CuratedItem[],
  leagues: readonly string[]
): Promise<Map<string, string>> => {
  const neededTypes = new Set([
    ...MANUAL_ICON_FALLBACK_TYPES,
    ...items
      .filter((item) => item.iconUrl == null || !item.iconUrl.startsWith(POE_CDN_ICON_PREFIX))
      .map((item) => item.externalType ?? item.poeNinjaType)
      .filter((value): value is string => value !== undefined)
  ]);
  const iconsByKey = new Map<string, string>();

  for (const league of leagues) {
    for (const externalType of neededTypes) {
      if (CURRENCY_DETAIL_TYPES.includes(externalType)) {
        const payload = await fetchJson(createCurrencyDetailsUrl(league, externalType));
        for (const line of readCurrencyDetails(payload)) {
          addIconLine(iconsByKey, line);
        }
      }

      const endpoint = endpointForType(externalType);
      if (endpoint === null) continue;
      const payload = await fetchJson(createOverviewUrl(league, externalType, endpoint));
      for (const line of readLines(payload)) {
        addIconLine(iconsByKey, line);
      }
    }
  }

  return iconsByKey;
};

const iconLookupCandidates = (item: CuratedItem): string[] => {
  const externalKey = item.externalKey ?? item.poeNinjaKey;
  const nameWithoutQualifier = item.name.replace(/\s*\([^)]*\)\s*$/g, "").trim();
  return [externalKey, item.name, nameWithoutQualifier].filter(
    (value): value is string => value !== undefined && value.trim() !== ""
  );
};

const staticPoeNinjaIconUrl = (item: CuratedItem): string | null =>
  (item.externalType ?? item.poeNinjaType) === "DivinationCard"
    ? DIVINATION_CARD_ICON_URL
    : null;

const main = async () => {
  const inputPath = resolve(process.argv[2] ?? "data/curated/items.json");
  const leagues =
    process.argv[3]?.split(",").map((league) => league.trim()).filter(Boolean) ??
    DEFAULT_LEAGUES;
  const items = JSON.parse(readFileSync(inputPath, "utf8")) as CuratedItem[];
  const iconsByKey = await buildIconIndex(items, leagues);

  const missing: string[] = [];
  let updated = 0;
  const enriched: CuratedItem[] = [];
  for (const item of items) {
    if (item.iconUrl != null && item.iconUrl.startsWith(POE_CDN_ICON_PREFIX)) {
      enriched.push(item);
      continue;
    }
    const iconUrl = iconLookupCandidates(item)
      .map(
        (candidate) => iconsByKey.get(candidate) ?? iconsByKey.get(normalizeKey(candidate))
      )
      .find((value): value is string => value !== undefined);
    const fallbackIconUrl =
      iconUrl ??
      staticPoeNinjaIconUrl(item) ??
      (await fetchPoewikiIconUrl(iconLookupCandidates(item).at(-1) ?? item.name));
    if (fallbackIconUrl === null || fallbackIconUrl === undefined) {
      missing.push(`${item.id} (${item.name})`);
      enriched.push(item);
      continue;
    }
    updated += 1;
    enriched.push({ ...item, iconUrl: fallbackIconUrl });
  }

  writeFileSync(inputPath, `${JSON.stringify(enriched, null, 2)}\n`, "utf8");
  console.log(
    JSON.stringify(
      {
        file: inputPath,
        leagues,
        updated,
        missing: missing.length,
        missingItems: missing
      },
      null,
      2
    )
  );
};

await main();
