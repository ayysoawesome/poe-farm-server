import { describe, expect, it } from "vitest";

import { secretsMatch } from "../src/utils/security";

describe("secretsMatch", () => {
  it("accepts identical secret values", async () => {
    await expect(secretsMatch("shared-secret", "shared-secret")).resolves.toBe(true);
  });

  it("rejects different secret values", async () => {
    await expect(secretsMatch("wrong-secret", "shared-secret")).resolves.toBe(false);
  });

  it("rejects a missing provided secret", async () => {
    await expect(secretsMatch(undefined, "shared-secret")).resolves.toBe(false);
  });
});
