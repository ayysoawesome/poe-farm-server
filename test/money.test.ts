import { describe, expect, it } from "vitest";

import { toMoney } from "../src/schemas/money.schema";

describe("toMoney", () => {
  it("returns Chaos and Divine values without storing Divine prices", () => {
    expect(toMoney(50, 200)).toEqual({ chaos: 50, divine: 0.25 });
  });

  it("supports negative values for profit totals", () => {
    expect(toMoney(-25, 200)).toEqual({ chaos: -25, divine: -0.125 });
  });

  it("rejects a non-positive Divine Orb rate", () => {
    expect(() => toMoney(50, 0)).toThrowError("Divine Orb Chaos value");
  });
});
