import { describe, expect, it } from "vitest";

import { PoeNinjaPriceProvider } from "../src/services/price.service";

describe("PoeNinjaPriceProvider", () => {
  it("groups requests by external type and maps prices by item id", async () => {
    const requests: string[] = [];
    const provider = new PoeNinjaPriceProvider(async (url) => {
      requests.push(url);
      if (url.includes("currencyoverview")) {
        return {
          lines: [{ currencyTypeName: "Divine Orb", chaosEquivalent: 200 }]
        };
      }
      return {
        lines: [{ name: "Maven's Writ", chaosValue: 120 }]
      };
    });

    const prices = await provider.fetchPrices({
      leagueExternalName: "Mercenaries",
      capturedAt: 100,
      mappings: [
        {
          itemId: "chaos-orb",
          itemName: "Chaos Orb",
          externalType: "Currency",
          externalKey: "Chaos Orb"
        },
        {
          itemId: "divine-orb",
          itemName: "Divine Orb",
          externalType: "Currency",
          externalKey: "Divine Orb"
        },
        {
          itemId: "mavens-writ",
          itemName: "Maven's Writ",
          externalType: "Fragment",
          externalKey: "Maven's Writ"
        }
      ]
    });

    expect(prices.get("chaos-orb")).toBe(1);
    expect(prices.get("divine-orb")).toBe(200);
    expect(prices.get("mavens-writ")).toBe(120);
    expect(requests).toHaveLength(2);
    expect(requests[0]).toContain("currencyoverview");
    expect(requests[0]).toContain("league=Mercenaries");
    expect(requests[0]).toContain("type=Currency");
    expect(requests[1]).toContain("itemoverview");
    expect(requests[1]).toContain("type=Fragment");
  });

  it("ignores unmapped poe.ninja lines", async () => {
    const provider = new PoeNinjaPriceProvider(async () => ({
      lines: [
        { name: "Untracked Item", chaosValue: 999 },
        { name: "Tracked Item", chaosEquivalent: 42 }
      ]
    }));

    const prices = await provider.fetchPrices({
      leagueExternalName: "Mercenaries",
      capturedAt: 100,
      mappings: [
        {
          itemId: "tracked",
          itemName: "Tracked Item",
          externalType: "UniqueFlask",
          externalKey: "Tracked Item"
        }
      ]
    });

    expect([...prices.entries()]).toEqual([["tracked", 42]]);
  });
});
