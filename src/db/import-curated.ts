import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

import { ZodError } from "zod";

import { buildCuratedSql, combineCuratedDataFiles } from "./curated";

const inputPath = process.argv[2] ?? "data/curated";
const outputPath = process.argv[3] ?? "drizzle/curated.sql";

try {
  const absoluteInputPath = resolve(inputPath);
  const absoluteOutputPath = resolve(outputPath);
  const data = combineCuratedDataFiles({
    items: JSON.parse(readFileSync(join(absoluteInputPath, "items.json"), "utf8")),
    bosses: JSON.parse(readFileSync(join(absoluteInputPath, "bosses.json"), "utf8"))
  });
  const sql = buildCuratedSql(data);
  mkdirSync(dirname(absoluteOutputPath), { recursive: true });
  writeFileSync(absoluteOutputPath, sql, "utf8");
  console.log(`Generated ${outputPath}`);
} catch (error) {
  if (error instanceof ZodError) {
    console.error(JSON.stringify(error.issues, null, 2));
    process.exit(1);
  }
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
