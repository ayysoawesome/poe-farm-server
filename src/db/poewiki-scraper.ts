export type PoewikiDropDraft = {
  bossId: string;
  itemName: string;
  dropRate: number;
  source: "poewiki";
  sourceUrl?: string;
  notes: string;
};

const GROUPED_DROP_NAMES = new Set(["Awakened exceptional support gem"]);

const decodeHtml = (value: string): string =>
  value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'");

const stripTags = (value: string): string =>
  decodeHtml(value.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();

export const parseDropRateText = (value: string): number | null => {
  const normalized = decodeHtml(value).trim();
  const match = normalized.match(/[~<]?\s*(\d+(?:\.\d+)?)\s*%/);
  if (match === null) return null;
  return Math.round((Number(match[1]) / 100) * 1_000_000) / 1_000_000;
};

const readDropsSection = (html: string): string => {
  const start = html.search(/<h2[^>]*>\s*<span[^>]+id=["']Drops["']/i);
  if (start < 0) return "";
  const rest = html.slice(start);
  const nextHeading = rest.slice(1).search(/<h2[^>]*>/i);
  return nextHeading < 0 ? rest : rest.slice(0, nextHeading + 1);
};

const readListItems = (html: string): string[] => {
  const items: string[] = [];
  const pattern = /<li\b[^>]*>([\s\S]*?)<\/li>/gi;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(html)) !== null) {
    items.push(match[1] ?? "");
  }
  return items;
};

const readFirstWikiLinkText = (html: string): string | null => {
  const match = html.match(/<a\b[^>]*href=["']\/wiki\/[^"']+["'][^>]*>([\s\S]*?)<\/a>/i);
  if (match === null) return null;
  const text = stripTags(match[1] ?? "");
  return text === "" ? null : text;
};

const readLastDropRate = (text: string): number | null => {
  const matches = [...text.matchAll(/\([^\)]*[~<]?\s*\d+(?:\.\d+)?\s*%[^\)]*\)/g)];
  if (matches.length === 0) return null;
  return parseDropRateText(matches.at(-1)?.[0] ?? "");
};

export const parsePoewikiDropsFromHtml = (
  html: string,
  bossId: string,
  sourceUrl?: string
): PoewikiDropDraft[] => {
  const section = readDropsSection(html);
  const drafts: PoewikiDropDraft[] = [];
  for (const itemHtml of readListItems(section)) {
    const itemName = readFirstWikiLinkText(itemHtml);
    if (itemName === null) continue;
    const dropRate = readLastDropRate(stripTags(itemHtml));
    if (dropRate === null) continue;
    const draft: PoewikiDropDraft = {
      bossId,
      itemName,
      dropRate,
      source: "poewiki",
      notes: "Estimated drop rate from PoE Wiki"
    };
    if (sourceUrl !== undefined) {
      draft.sourceUrl = sourceUrl;
    }
    drafts.push(draft);
  }
  return drafts;
};

export const applyPoewikiDropOverrides = (
  drafts: readonly PoewikiDropDraft[]
): PoewikiDropDraft[] => {
  const output: PoewikiDropDraft[] = [];
  const sirusThreadOfHope = drafts
    .filter(
      (draft) =>
        draft.bossId === "sirus" && draft.itemName === "Thread of Hope"
    )
    .sort((left, right) => left.dropRate - right.dropRate);

  for (const draft of drafts) {
    if (GROUPED_DROP_NAMES.has(draft.itemName)) continue;
    if (draft.bossId === "sirus" && draft.itemName === "Thread of Hope") {
      if (draft === sirusThreadOfHope.at(-1)) {
        output.push({
          ...draft,
          bossId: "uber-sirus",
          notes: `${draft.notes}; Uber Sirus massive ring variant`
        });
      } else if (draft === sirusThreadOfHope[0]) {
        output.push(draft);
      }
      continue;
    }
    output.push(draft);
  }

  return output;
};

export const fetchPoewikiDrops = async (
  input: {
    bossId: string;
    url: string;
  },
  fetcher: typeof fetch = fetch
): Promise<PoewikiDropDraft[]> => {
  const response = await fetcher(input.url, {
    headers: {
      accept: "text/html",
      "user-agent": "poe-farm-server/0.1.0 curated scraper"
    }
  });
  if (!response.ok) {
    throw new Error(`PoE Wiki request failed with ${response.status}: ${input.url}`);
  }
  return applyPoewikiDropOverrides(
    parsePoewikiDropsFromHtml(await response.text(), input.bossId, input.url)
  );
};
