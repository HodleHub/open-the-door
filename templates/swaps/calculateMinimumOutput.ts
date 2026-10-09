import { parseAmount } from "../core/parseAmount.js";
import type { Result } from "../core/types.js";

/** Integer basis-point calculation. This does not establish a provider's execution guarantee. */
export const calculateMinimumOutput = (args: {
  expectedRaw: string;
  slippageBps: number;
}): Result<string> => {
  const expected = parseAmount({ raw: args.expectedRaw });

  if (
    !expected.success ||
    expected.data === 0n ||
    !Number.isInteger(args.slippageBps) ||
    args.slippageBps < 0 ||
    args.slippageBps >= 10_000
  ) {
    return { success: false, code: "INVALID_SLIPPAGE_INPUT" };
  }

  const minimum = (expected.data * BigInt(10_000 - args.slippageBps)) / 10_000n;

  if (minimum === 0n) return { success: false, code: "OUTPUT_TOO_SMALL" };

  return { success: true, data: minimum.toString() };
};
