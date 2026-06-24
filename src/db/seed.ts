import { mkdirSync, writeFileSync } from "node:fs";

import { calculateProfit } from "../services/profit.service";
import type { ItemCategory } from "../schemas/item.schema";

type SeedItem = {
  id: string;
  name: string;
  category: ItemCategory;
  chaosValue: number;
  poeNinjaType: string;
  poeNinjaKey: string;
};

type SeedBoss = {
  id: string;
  name: string;
  slug: string;
  description: string;
  entryComponents: Array<{ itemId: string; quantity: number }>;
  drops: Array<{
    itemId: string;
    dropRate: number | null;
    notes: string;
  }>;
};

const leagueId = "current";
const syncRunId = "seed-sync";
const leagueExternalName = "Standard";
const timestamp = Date.parse("2026-06-21T00:00:00.000Z");

const items: SeedItem[] = [
  { id: "chaos-orb", name: "Chaos Orb", category: "currency", chaosValue: 1, poeNinjaType: "Currency", poeNinjaKey: "Chaos Orb" },
  { id: "divine-orb", name: "Divine Orb", category: "currency", chaosValue: 200, poeNinjaType: "Currency", poeNinjaKey: "Divine Orb" },
  { id: "mavens-writ", name: "Maven's Writ", category: "fragment", chaosValue: 120, poeNinjaType: "Fragment", poeNinjaKey: "Maven's Writ" },
  { id: "fragment-phoenix", name: "Fragment of the Phoenix", category: "fragment", chaosValue: 12, poeNinjaType: "Fragment", poeNinjaKey: "Fragment of the Phoenix" },
  { id: "fragment-minotaur", name: "Fragment of the Minotaur", category: "fragment", chaosValue: 14, poeNinjaType: "Fragment", poeNinjaKey: "Fragment of the Minotaur" },
  { id: "fragment-chimera", name: "Fragment of the Chimera", category: "fragment", chaosValue: 11, poeNinjaType: "Fragment", poeNinjaKey: "Fragment of the Chimera" },
  { id: "fragment-hydra", name: "Fragment of the Hydra", category: "fragment", chaosValue: 13, poeNinjaType: "Fragment", poeNinjaKey: "Fragment of the Hydra" },
  { id: "orb-dominance", name: "Orb of Dominance", category: "currency", chaosValue: 65, poeNinjaType: "Currency", poeNinjaKey: "Orb of Dominance" },
  { id: "awakened-multistrike", name: "Awakened Multistrike Support", category: "gem", chaosValue: 1800, poeNinjaType: "SkillGem", poeNinjaKey: "Awakened Multistrike Support" },
  { id: "progenesis", name: "Progenesis", category: "equipment", chaosValue: 4200, poeNinjaType: "UniqueFlask", poeNinjaKey: "Progenesis" }
];

const bosses: SeedBoss[] = [
  {
    id: "maven",
    name: "Maven",
    slug: "maven",
    description: "The Maven pinnacle encounter.",
    entryComponents: [{ itemId: "mavens-writ", quantity: 1 }],
    drops: [
      { itemId: "orb-dominance", dropRate: 0.22, notes: "Mock MVP rate" },
      { itemId: "awakened-multistrike", dropRate: 0.015, notes: "Mock MVP rate" }
    ]
  },
  {
    id: "shaper",
    name: "Shaper",
    slug: "shaper",
    description: "The Shaper pinnacle encounter.",
    entryComponents: [
      { itemId: "fragment-phoenix", quantity: 1 },
      { itemId: "fragment-minotaur", quantity: 1 },
      { itemId: "fragment-chimera", quantity: 1 },
      { itemId: "fragment-hydra", quantity: 1 }
    ],
    drops: [{ itemId: "orb-dominance", dropRate: 0.18, notes: "Mock MVP rate" }]
  },
  {
    id: "uber-elder",
    name: "Uber Elder",
    slug: "uber-elder",
    description: "The combined Elder and Shaper encounter.",
    entryComponents: [
      { itemId: "fragment-phoenix", quantity: 1 },
      { itemId: "fragment-minotaur", quantity: 1 },
      { itemId: "fragment-chimera", quantity: 1 },
      { itemId: "fragment-hydra", quantity: 1 }
    ],
    drops: [{ itemId: "orb-dominance", dropRate: 0.35, notes: "Mock MVP rate" }]
  },
  {
    id: "sirus",
    name: "Sirus",
    slug: "sirus",
    description: "Sirus, Awakener of Worlds.",
    entryComponents: [{ itemId: "chaos-orb", quantity: 55 }],
    drops: [
      { itemId: "orb-dominance", dropRate: 0.2, notes: "Mock MVP rate" },
      { itemId: "awakened-multistrike", dropRate: 0.01, notes: "Mock MVP rate" }
    ]
  },
  {
    id: "exarch",
    name: "Exarch",
    slug: "exarch",
    description: "The Searing Exarch pinnacle encounter.",
    entryComponents: [{ itemId: "chaos-orb", quantity: 90 }],
    drops: [{ itemId: "orb-dominance", dropRate: 0.28, notes: "Mock MVP rate" }]
  },
  {
    id: "eater-of-worlds",
    name: "Eater of Worlds",
    slug: "eater-of-worlds",
    description: "The Eater of Worlds pinnacle encounter.",
    entryComponents: [{ itemId: "chaos-orb", quantity: 95 }],
    drops: [
      { itemId: "orb-dominance", dropRate: 0.25, notes: "Mock MVP rate" },
      { itemId: "progenesis", dropRate: 0.018, notes: "Mock MVP rate" }
    ]
  }
];

const sqlString = (value: string | null): string =>
  value === null ? "NULL" : `'${value.replaceAll("'", "''")}'`;

const itemName = (itemId: string): string =>
  items.find((item) => item.id === itemId)?.name ?? itemId;

const divineOrbChaosValue =
  items.find((item) => item.id === "divine-orb")?.chaosValue ?? 0;

const statements: string[] = [
  "PRAGMA foreign_keys = ON;",
  `INSERT OR IGNORE INTO leagues (id, name, external_name, is_active, created_at, updated_at) VALUES ('${leagueId}', 'Current League', ${sqlString(leagueExternalName)}, 1, ${timestamp}, ${timestamp});`,
  `INSERT OR IGNORE INTO sync_runs (id, type, status, started_at, finished_at, message, created_at) VALUES (${sqlString(syncRunId)}, 'seed', 'success', ${timestamp}, ${timestamp}, 'Seed price set', ${timestamp});`
];

for (const item of items) {
  statements.push(
    `INSERT OR IGNORE INTO items (id, name, category, icon_url, trade_url, created_at, updated_at) VALUES (${sqlString(item.id)}, ${sqlString(item.name)}, ${sqlString(item.category)}, NULL, NULL, ${timestamp}, ${timestamp});`,
    `INSERT OR IGNORE INTO item_price_mappings (id, item_id, provider, external_type, external_key, is_active, created_at, updated_at) VALUES (${sqlString(`seed-mapping-${item.id}`)}, ${sqlString(item.id)}, 'poe_ninja', ${sqlString(item.poeNinjaType)}, ${sqlString(item.poeNinjaKey)}, 1, ${timestamp}, ${timestamp});`,
    `INSERT OR IGNORE INTO item_prices (id, item_id, league_id, sync_run_id, chaos_value, source, captured_at, created_at) VALUES (${sqlString(`seed-price-${item.id}`)}, ${sqlString(item.id)}, '${leagueId}', ${sqlString(syncRunId)}, ${item.chaosValue}, 'seed', ${timestamp}, ${timestamp});`
  );
}

const priceMap = new Map(items.map((item) => [item.id, item.chaosValue]));

for (const boss of bosses) {
  statements.push(
    `INSERT OR IGNORE INTO bosses (id, name, slug, description, is_active, created_at, updated_at) VALUES (${sqlString(boss.id)}, ${sqlString(boss.name)}, ${sqlString(boss.slug)}, ${sqlString(boss.description)}, 1, ${timestamp}, ${timestamp});`
  );
  for (const [index, component] of boss.entryComponents.entries()) {
    statements.push(
      `INSERT OR IGNORE INTO boss_entry_components (id, boss_id, item_id, quantity, created_at, updated_at) VALUES (${sqlString(`seed-entry-${boss.id}-${index}`)}, ${sqlString(boss.id)}, ${sqlString(component.itemId)}, ${component.quantity}, ${timestamp}, ${timestamp});`
    );
  }
  for (const [index, drop] of boss.drops.entries()) {
    statements.push(
      `INSERT OR IGNORE INTO boss_drops (id, boss_id, item_id, drop_rate, notes, created_at, updated_at) VALUES (${sqlString(`seed-drop-${boss.id}-${index}`)}, ${sqlString(boss.id)}, ${sqlString(drop.itemId)}, ${drop.dropRate ?? "NULL"}, ${sqlString(drop.notes)}, ${timestamp}, ${timestamp});`
    );
  }

  const calculation = calculateProfit({
    entryComponents: boss.entryComponents.map((component) => ({
      ...component,
      itemName: itemName(component.itemId)
    })),
    drops: boss.drops.map((drop) => ({
      itemId: drop.itemId,
      itemName: itemName(drop.itemId),
      dropRate: drop.dropRate
    })),
    prices: priceMap
  });
  statements.push(
    `INSERT OR IGNORE INTO profit_snapshots (id, boss_id, league_id, sync_run_id, entry_cost_chaos, expected_return_chaos, expected_profit_chaos, roi_percent, divine_orb_chaos_value, is_complete, unknown_drop_count, calculated_at, created_at) VALUES (${sqlString(`seed-profit-${boss.id}`)}, ${sqlString(boss.id)}, '${leagueId}', ${sqlString(syncRunId)}, ${calculation.entryCostChaos}, ${calculation.expectedReturnChaos}, ${calculation.expectedProfitChaos}, ${calculation.roiPercent}, ${divineOrbChaosValue}, ${calculation.isComplete ? 1 : 0}, ${calculation.unknownDropCount}, ${timestamp}, ${timestamp});`
  );
}

mkdirSync("drizzle", { recursive: true });
writeFileSync("drizzle/seed.sql", `${statements.join("\n")}\n`, "utf8");
console.log(`Generated drizzle/seed.sql with ${statements.length} statements.`);
