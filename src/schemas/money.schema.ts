import { z } from "zod";

import { AppError } from "../utils/errors";

export const moneySchema = z.object({
  chaos: z.number().finite(),
  divine: z.number().finite()
});

export type Money = z.infer<typeof moneySchema>;

export const toMoney = (
  chaosValue: number,
  divineOrbChaosValue: number
): Money => {
  if (divineOrbChaosValue <= 0) {
    throw new AppError(
      503,
      "INVALID_DIVINE_ORB_PRICE",
      "Divine Orb Chaos value must be positive"
    );
  }
  return {
    chaos: chaosValue,
    divine: chaosValue / divineOrbChaosValue
  };
};
