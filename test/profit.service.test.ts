import { describe, expect, it } from "vitest";

import {
  calculateProfit,
  type ProfitCalculationInput
} from "../src/services/profit.service";
import { toProfitResponse } from "../src/schemas/profit.schema";
import { profitCacheKey } from "../src/utils/cache";

const baseInput: ProfitCalculationInput = {
  entryComponents: [
    { itemId: "entry-a", itemName: "Entry A", quantity: 1 },
    { itemId: "entry-b", itemName: "Entry B", quantity: 2 }
  ],
  drops: [
    {
      itemId: "known",
      itemName: "Known",
      dropRate: 0.25
    },
    {
      itemId: "unknown",
      itemName: "Unknown",
      dropRate: null
    }
  ],
  prices: new Map([
    ["entry-a", 10],
    ["entry-b", 20],
    ["known", 100]
  ])
};

describe("calculateProfit", () => {
  it("calculates known drops and reports unknown chances", () => {
    expect(calculateProfit(baseInput)).toEqual({
      entryCostChaos: 50,
      expectedReturnChaos: 25,
      expectedProfitChaos: -25,
      roiPercent: -50,
      isComplete: false,
      unknownDropCount: 1
    });
  });

  it("does not require a price for a drop with an unknown chance", () => {
    expect(() => calculateProfit(baseInput)).not.toThrow();
  });

  it("returns zero ROI when there is no entry cost", () => {
    const result = calculateProfit({ ...baseInput, entryComponents: [] });
    expect(result.roiPercent).toBe(0);
  });

  it("marks a known-chance drop incomplete when its price is missing", () => {
    expect(
      calculateProfit({
        ...baseInput,
        prices: new Map([
          ["entry-a", 10],
          ["entry-b", 20]
        ])
      })
    ).toEqual({
      entryCostChaos: 50,
      expectedReturnChaos: 0,
      expectedProfitChaos: -50,
      roiPercent: -100,
      isComplete: false,
      unknownDropCount: 2
    });
  });

  it("requires a price for an entry component", () => {
    expect(() =>
      calculateProfit({
        ...baseInput,
        prices: new Map([
          ["entry-a", 10],
          ["known", 100]
        ])
      })
    ).toThrowError("Missing price for Entry B (entry-b)");
  });
});

describe("profit response mapping", () => {
  it("returns public profit totals in Chaos and Divine", () => {
    expect(
      toProfitResponse({
        id: "profit-1",
        bossId: "boss-1",
        leagueId: "league-1",
        syncRunId: "sync-1",
        entryCostChaos: 50,
        expectedReturnChaos: 25,
        expectedProfitChaos: -25,
        roiPercent: -50,
        divineOrbChaosValue: 200,
        isComplete: false,
        unknownDropCount: 1,
        calculatedAt: 100,
        createdAt: 100
      })
    ).toEqual({
      id: "profit-1",
      bossId: "boss-1",
      leagueId: "league-1",
      entryCost: { chaos: 50, divine: 0.25 },
      expectedReturn: { chaos: 25, divine: 0.125 },
      expectedProfit: { chaos: -25, divine: -0.125 },
      roiPercent: -50,
      isComplete: false,
      unknownDropCount: 1,
      calculatedAt: 100
    });
  });

  it("uses the v2 profit cache key", () => {
    expect(profitCacheKey("league-1", "boss-1")).toBe(
      "profit:v2:league-1:boss-1"
    );
  });
});
