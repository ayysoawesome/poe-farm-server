import { describe, expect, it } from "vitest";

import {
  PoeNinjaPriceProvider,
  PoePublicStashPriceProvider
} from "../src/services/price.service";

describe("PoeNinjaPriceProvider", () => {
  it("loads economy leagues from poe.ninja index state", async () => {
    const requests: string[] = [];
    const provider = new PoeNinjaPriceProvider(async (url) => {
      requests.push(url);
      return {
        economyLeagues: [
          { name: "Standard", displayName: "Standard" },
          { name: "Hardcore", displayName: "Hardcore" },
          { name: "Hardcore Mercenaries", displayName: "Hardcore Mercenaries" },
          { name: "Mercenaries" },
          { name: "", displayName: "Invalid" },
          { displayName: "Missing name" }
        ]
      };
    });

    await expect(provider.fetchEconomyLeagues()).resolves.toEqual([
      {
        id: "standard",
        name: "Standard",
        externalName: "Standard"
      },
      {
        id: "mercenaries",
        name: "Mercenaries",
        externalName: "Mercenaries"
      }
    ]);
    expect(requests).toEqual([
      "https://poe.ninja/poe1/api/data/index-state"
    ]);
  });

  it("groups requests by external type and maps prices by item id", async () => {
    const requests: string[] = [];
    const provider = new PoeNinjaPriceProvider(async (url) => {
      requests.push(url);
      if (url.includes("type=Currency")) {
        return {
          items: [{ id: "divine-orb", name: "Divine Orb" }],
          lines: [{ id: "divine-orb", primaryValue: 200 }]
        };
      }
      return {
        lines: [{ name: "Maven's Writ", chaosValue: 120 }]
      };
    });

    const prices = await provider.fetchPrices({
      leagueId: "mercenaries",
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
    expect(requests[0]).toContain("/exchange/current/overview");
    expect(requests[0]).toContain("league=Mercenaries");
    expect(requests[0]).toContain("type=Currency");
    expect(requests[1]).toContain("/exchange/current/overview");
    expect(requests[1]).toContain("type=Fragment");
  });

  it("prices currency from exchange overview before stash overview", async () => {
    const requests: string[] = [];
    const provider = new PoeNinjaPriceProvider(async (url) => {
      requests.push(url);
      if (url.includes("/exchange/current/overview")) {
        return {
          items: [{ id: "divine-orb", name: "Divine Orb" }],
          lines: [{ id: "divine-orb", primaryValue: 588 }]
        };
      }
      return {
        lines: [{ currencyTypeName: "Divine Orb", chaosEquivalent: 362.7 }]
      };
    });

    const prices = await provider.fetchPrices({
      leagueId: "mirage",
      leagueExternalName: "Mirage",
      capturedAt: 100,
      mappings: [
        {
          itemId: "divine-orb",
          itemName: "Divine Orb",
          externalType: "Currency",
          externalKey: "Divine Orb"
        }
      ]
    });

    expect(prices.get("divine-orb")).toBe(588);
    expect(requests).toEqual([
      "https://poe.ninja/poe1/api/economy/exchange/current/overview?league=Mirage&type=Currency"
    ]);
  });

  it("uses one currency exchange overview request for multiple currency mappings", async () => {
    const requests: string[] = [];
    const provider = new PoeNinjaPriceProvider(async (url) => {
      requests.push(url);
      return {
        items: [
          { id: "divine-orb", name: "Divine Orb" },
          { id: "exalted-orb", name: "Exalted Orb" }
        ],
        lines: [
          { id: "divine-orb", primaryValue: 588 },
          { id: "exalted-orb", primaryValue: 82 }
        ]
      };
    });

    const prices = await provider.fetchPrices({
      leagueId: "mirage",
      leagueExternalName: "Mirage",
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
          itemId: "exalted-orb",
          itemName: "Exalted Orb",
          externalType: "Currency",
          externalKey: "Exalted Orb"
        }
      ]
    });

    expect(prices.get("chaos-orb")).toBe(1);
    expect(prices.get("divine-orb")).toBe(588);
    expect(prices.get("exalted-orb")).toBe(82);
    expect(requests).toEqual([
      "https://poe.ninja/poe1/api/economy/exchange/current/overview?league=Mirage&type=Currency"
    ]);
  });

  it("falls back to exchange details and then stash currency overview for currency items absent from exchange overview", async () => {
    const requests: string[] = [];
    const provider = new PoeNinjaPriceProvider(async (url) => {
      requests.push(url);
      if (url.includes("/exchange/current/overview")) {
        return { items: [], lines: [] };
      }
      if (url.includes("/exchange/current/details")) {
        throw new Error("not found");
      }
      return {
        lines: [{ currencyTypeName: "Eldritch Chaos Orb", chaosEquivalent: 35.5 }]
      };
    });

    const prices = await provider.fetchPrices({
      leagueId: "mirage",
      leagueExternalName: "Mirage",
      capturedAt: 100,
      mappings: [
        {
          itemId: "eldritch-chaos-orb",
          itemName: "Eldritch Chaos Orb",
          externalType: "Currency",
          externalKey: "Eldritch Chaos Orb"
        }
      ]
    });

    expect(prices.get("eldritch-chaos-orb")).toBe(35.5);
    expect(requests).toHaveLength(3);
    expect(requests[0]).toContain("/exchange/current/overview");
    expect(requests[1]).toContain("/exchange/current/details");
    expect(requests[2]).toContain("/currency/overview");
  });

  it("ignores unmapped poe.ninja lines", async () => {
    const provider = new PoeNinjaPriceProvider(async () => ({
      lines: [
        { name: "Untracked Item", chaosValue: 999 },
        { name: "Tracked Item", chaosEquivalent: 42 }
      ]
    }));

    const prices = await provider.fetchPrices({
      leagueId: "mercenaries",
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

  it("maps current exchange overview lines through item metadata", async () => {
    const provider = new PoeNinjaPriceProvider(async () => ({
      items: [
        {
          id: "the-mavens-writ",
          name: "The Maven's Writ",
          detailsId: "the-mavens-writ"
        }
      ],
      lines: [{ id: "the-mavens-writ", primaryValue: 120 }]
    }));

    const prices = await provider.fetchPrices({
      leagueId: "mirage",
      leagueExternalName: "Mirage",
      capturedAt: 100,
      mappings: [
        {
          itemId: "mavens-writ",
          itemName: "Maven's Writ",
          externalType: "Fragment",
          externalKey: "Maven's Writ"
        }
      ]
    });

    expect([...prices.entries()]).toEqual([["mavens-writ", 120]]);
  });

  it("falls back to stash currency overview for exchange items absent from exchange overview", async () => {
    const requests: string[] = [];
    const provider = new PoeNinjaPriceProvider(async (url) => {
      requests.push(url);
      if (url.includes("/exchange/current/overview")) {
        return { items: [], lines: [] };
      }
      return {
        lines: [
          {
            currencyTypeName: "Fragment of the Phoenix",
            detailsId: "fragment-of-the-phoenix",
            chaosEquivalent: 39.98
          }
        ]
      };
    });

    const prices = await provider.fetchPrices({
      leagueId: "standard",
      leagueExternalName: "Standard",
      capturedAt: 100,
      mappings: [
        {
          itemId: "fragment-phoenix",
          itemName: "Fragment of the Phoenix",
          externalType: "Fragment",
          externalKey: "Fragment of the Phoenix"
        }
      ]
    });

    expect(prices.get("fragment-phoenix")).toBe(39.98);
    expect(requests).toHaveLength(2);
    expect(requests[0]).toContain("/exchange/current/overview");
    expect(requests[1]).toContain("/currency/overview");
    expect(requests[1]).toContain("type=Fragment");
  });

  it("maps variant unique prices by details id when names are shared", async () => {
    const requests: string[] = [];
    const pricedProvider = new PoeNinjaPriceProvider(async (url) => {
      requests.push(url);
      return {
        lines: [
          {
            name: "Impresence",
            detailsId: "impresence-fire-onyx-amulet",
            chaosValue: 10
          },
          {
            name: "Impresence",
            detailsId: "impresence-cold-onyx-amulet",
            chaosValue: 25
          }
        ]
      };
    });

    const prices = await pricedProvider.fetchPrices({
      leagueId: "mercenaries",
      leagueExternalName: "Mercenaries",
      capturedAt: 100,
      mappings: [
        {
          itemId: "impresence-fire",
          itemName: "Impresence (Fire)",
          externalType: "UniqueAccessory",
          externalKey: "impresence-fire-onyx-amulet"
        },
        {
          itemId: "impresence-cold",
          itemName: "Impresence (Cold)",
          externalType: "UniqueAccessory",
          externalKey: "impresence-cold-onyx-amulet"
        }
      ]
    });

    expect([...prices.entries()]).toEqual([
      ["impresence-fire", 10],
      ["impresence-cold", 25]
    ]);
    expect(requests).toEqual([
      "https://poe.ninja/poe1/api/economy/stash/current/item/overview?league=Mercenaries&type=UniqueAccessory"
    ]);
  });

  it("prices divination cards from stash currency overview and maps from item overview", async () => {
    const requests: string[] = [];
    const provider = new PoeNinjaPriceProvider(async (url) => {
      requests.push(url);
      if (url.includes("type=DivinationCard")) {
        return {
          lines: [{ name: "A Fate Worse Than Death", chaosValue: 12 }]
        };
      }
      return {
        lines: [{ name: "The Shaper's Realm", chaosValue: 40 }]
      };
    });

    const prices = await provider.fetchPrices({
      leagueId: "mirage",
      leagueExternalName: "Mirage",
      capturedAt: 100,
      mappings: [
        {
          itemId: "a-fate-worse-than-death",
          itemName: "A Fate Worse Than Death",
          externalType: "DivinationCard",
          externalKey: "A Fate Worse Than Death"
        },
        {
          itemId: "the-shapers-realm",
          itemName: "The Shaper's Realm",
          externalType: "Map",
          externalKey: "The Shaper's Realm"
        }
      ]
    });

    expect(prices.get("a-fate-worse-than-death")).toBe(12);
    expect(prices.get("the-shapers-realm")).toBe(40);
    expect(requests).toEqual([
      "https://poe.ninja/poe1/api/economy/stash/current/currency/overview?league=Mirage&type=DivinationCard",
      "https://poe.ninja/poe1/api/economy/stash/current/item/overview?league=Mirage&type=Map"
    ]);
  });
});

describe("PoePublicStashPriceProvider", () => {
  it("prices unidentified items from documented public stash tabs using only exact price notes", async () => {
    const requests: Array<{ url: string; init: RequestInit | undefined }> = [];
    const provider = new PoePublicStashPriceProvider(async (url, init) => {
      requests.push({ url, init });
      return {
        next_change_id: "next-1",
        stashes: [
          {
            league: "Mercenaries",
            items: [
              {
                name: "Watcher's Eye",
                typeLine: "Prismatic Jewel",
                identified: false,
                ilvl: 86,
                note: "~b/o 1 divine"
              },
              {
                name: "Watcher's Eye",
                typeLine: "Prismatic Jewel",
                identified: false,
                itemLevel: 86,
                note: "~price 2 divine"
              },
              {
                name: "Watcher's Eye",
                typeLine: "Prismatic Jewel",
                identified: false,
                ilvl: 86,
                forum_note: "~price 450 chaos"
              },
              {
                name: "Watcher's Eye",
                typeLine: "Prismatic Jewel",
                identified: true,
                ilvl: 86,
                note: "~price 1 chaos"
              }
            ]
          },
          {
            league: "Standard",
            items: [
              {
                name: "Watcher's Eye",
                typeLine: "Prismatic Jewel",
                identified: false,
                ilvl: 86,
                note: "~price 1 chaos"
              }
            ]
          }
        ]
      };
    }, {
      maxPages: 1,
      userAgent: "OAuth poe-farm-server/0.1.0 (contact: test@example.com)"
    });

    const prices = await provider.fetchPrices({
      leagueId: "mercenaries",
      leagueExternalName: "Mercenaries",
      capturedAt: 100,
      referencePrices: new Map([["divine-orb", 200]]),
      mappings: [
        {
          itemId: "watchers-eye-unidentified-ilvl-86-plus",
          itemName: "Watcher's Eye Unidentified 86+",
          externalType: "PublicStashSearch",
          externalKey: JSON.stringify({
            name: "Watcher's Eye",
            type: "Prismatic Jewel",
            identified: false,
            minItemLevel: 86
          })
        }
      ]
    });

    expect(prices.get("watchers-eye-unidentified-ilvl-86-plus")).toBe(400);
    expect(requests).toHaveLength(1);
    expect(requests[0]?.url).toBe(
      "https://api.pathofexile.com/public-stash-tabs"
    );
    expect(requests[0]?.init?.headers).toMatchObject({
      "user-agent": "OAuth poe-farm-server/0.1.0 (contact: test@example.com)"
    });
  });

  it("continues public stash pagination from the configured change id", async () => {
    const requests: string[] = [];
    const provider = new PoePublicStashPriceProvider(async (url) => {
      requests.push(url);
      if (url.endsWith("id=start-1")) {
        return {
          next_change_id: "next-1",
          stashes: []
        };
      }
      return {
        next_change_id: "next-2",
        stashes: [
          {
            league: "Mercenaries",
            items: [
              {
                name: "Watcher's Eye",
                typeLine: "Prismatic Jewel",
                identified: false,
                ilvl: 85,
                note: "~price 35 chaos"
              }
            ]
          }
        ]
      };
    }, {
      changeId: "start-1",
      maxPages: 2,
      userAgent: "OAuth poe-farm-server/0.1.0 (contact: test@example.com)"
    });

    const prices = await provider.fetchPrices({
      leagueId: "mercenaries",
      leagueExternalName: "Mercenaries",
      capturedAt: 100,
      mappings: [
        {
          itemId: "watchers-eye-unidentified-ilvl-85",
          itemName: "Watcher's Eye Unidentified 85",
          externalType: "PublicStashSearch",
          externalKey: JSON.stringify({
            name: "Watcher's Eye",
            type: "Prismatic Jewel",
            identified: false,
            minItemLevel: 85,
            maxItemLevel: 85
          })
        }
      ]
    });

    expect(prices.get("watchers-eye-unidentified-ilvl-85")).toBe(35);
    expect(requests).toEqual([
      "https://api.pathofexile.com/public-stash-tabs?id=start-1",
      "https://api.pathofexile.com/public-stash-tabs?id=next-1"
    ]);
  });
});
