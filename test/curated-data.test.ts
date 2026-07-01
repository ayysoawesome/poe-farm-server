import { describe, expect, it } from "vitest";

import items from "../data/curated/items.json";

type CuratedItem = {
  id: string;
  iconUrl?: string | null;
};

describe("curated item icons", () => {
  it("uses poe.ninja CDN icons for every curated item", () => {
    const nonPoeCdnItems = (items as CuratedItem[]).filter(
      (item) =>
        typeof item.iconUrl !== "string" ||
        !item.iconUrl.startsWith("https://web.poecdn.com/")
    );

    expect(nonPoeCdnItems).toEqual([]);
  });
});
