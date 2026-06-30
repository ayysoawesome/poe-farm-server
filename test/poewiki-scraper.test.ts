import { describe, expect, it } from "vitest";

import {
  applyPoewikiDropOverrides,
  parseDropRateText,
  parsePoewikiDropsFromHtml
} from "../src/db/poewiki-scraper";

describe("PoE Wiki drop scraper", () => {
  it("parses percentage drop-rate text into probabilities", () => {
    expect(parseDropRateText("2.5%")).toBe(0.025);
    expect(parseDropRateText("~0.7%")).toBe(0.007);
    expect(parseDropRateText("<0.05%")).toBe(0.0005);
  });

  it("extracts item candidates from the rendered Drops section", () => {
    const html = `
      <h2><span id="Drops">Drops</span></h2>
      <p>Estimated drop rates from version 3.28.0. Actual drop rates may vary.</p>
      <ul>
        <li><a href="/wiki/Progenesis" title="Progenesis">Progenesis</a>
          Amethyst Flask (20-10)% reduced Charges per use (2.5%)</li>
        <li><a href="/wiki/Awakened_Empower_Support" title="Awakened Empower Support">Awakened Empower Support</a> (~0.6%)</li>
        <li><a href="/wiki/Auspicious_Ambitions" title="Auspicious Ambitions">Auspicious Ambitions</a> (&lt;0.05%)</li>
        <li><a href="/wiki/Ceremonial_Voidstone" title="Ceremonial Voidstone">Ceremonial Voidstone</a> (Quest Item, drops on first kill)</li>
      </ul>
      <h2><span id="Version_history">Version history</span></h2>
    `;

    expect(parsePoewikiDropsFromHtml(html, "maven")).toEqual([
      {
        bossId: "maven",
        itemName: "Progenesis",
        dropRate: 0.025,
        source: "poewiki",
        notes: "Estimated drop rate from PoE Wiki"
      },
      {
        bossId: "maven",
        itemName: "Awakened Empower Support",
        dropRate: 0.006,
        source: "poewiki",
        notes: "Estimated drop rate from PoE Wiki"
      },
      {
        bossId: "maven",
        itemName: "Auspicious Ambitions",
        dropRate: 0.0005,
        source: "poewiki",
        notes: "Estimated drop rate from PoE Wiki"
      }
    ]);
  });

  it("filters grouped gem placeholders and splits Sirus Thread of Hope rates", () => {
    const drafts = applyPoewikiDropOverrides([
      {
        bossId: "maven",
        itemName: "Awakened exceptional support gem",
        dropRate: 0.006,
        source: "poewiki",
        notes: "Estimated drop rate from PoE Wiki"
      },
      {
        bossId: "sirus",
        itemName: "Thread of Hope",
        dropRate: 0.05,
        source: "poewiki",
        notes: "Estimated drop rate from PoE Wiki"
      },
      {
        bossId: "sirus",
        itemName: "Thread of Hope",
        dropRate: 0.55,
        source: "poewiki",
        notes: "Estimated drop rate from PoE Wiki"
      }
    ]);

    expect(drafts).toEqual([
      {
        bossId: "sirus",
        itemName: "Thread of Hope",
        dropRate: 0.05,
        source: "poewiki",
        notes: "Estimated drop rate from PoE Wiki"
      },
      {
        bossId: "uber-sirus",
        itemName: "Thread of Hope",
        dropRate: 0.55,
        source: "poewiki",
        notes: "Estimated drop rate from PoE Wiki; Uber Sirus massive ring variant"
      }
    ]);
  });
});
