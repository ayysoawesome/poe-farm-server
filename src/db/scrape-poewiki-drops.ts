import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { z } from "zod";

import { fetchPoewikiDrops, type PoewikiDropDraft } from "./poewiki-scraper";

const pagesSchema = z.array(
  z.object({
    bossId: z.string().trim().min(1),
    url: z.string().url()
  })
);

const itemSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1)
});

type DropDraftOutput = PoewikiDropDraft & {
  itemId: string | null;
};

const pagesPath = resolve(process.argv[2] ?? "data/curated/poewiki-bosses.json");
const itemsPath = resolve(process.argv[3] ?? "data/curated/items.json");
const outputPath = resolve(
  process.argv[4] ?? "data/curated/drafts/poewiki-drops.json"
);

const normalizeName = (value: string): string =>
  value.toLowerCase().replace(/\s+/g, " ").trim();

const readJson = (path: string): unknown => JSON.parse(readFileSync(path, "utf8"));

try {
  const pages = pagesSchema.parse(readJson(pagesPath));
  const items = z.array(itemSchema).parse(readJson(itemsPath));
  const itemIdByName = new Map(
    items.map((item) => [normalizeName(item.name), item.id] as const)
  );
  const output: DropDraftOutput[] = [];

  for (const page of pages) {
    console.log(`Scraping ${page.bossId}: ${page.url}`);
    const drops = await fetchPoewikiDrops(page);
    for (const drop of drops) {
      output.push({
        ...drop,
        itemId: itemIdByName.get(normalizeName(drop.itemName)) ?? null
      });
    }
  }

  output.sort(
    (left, right) =>
      left.bossId.localeCompare(right.bossId) ||
      left.itemName.localeCompare(right.itemName)
  );
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  const matchedCount = output.filter((drop) => drop.itemId !== null).length;
  console.log(
    `Generated ${outputPath} with ${output.length} drops (${matchedCount} matched existing items).`
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
