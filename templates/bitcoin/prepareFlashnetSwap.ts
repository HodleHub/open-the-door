import { calculateMinimumOutput } from "../swaps/calculateMinimumOutput.js";
import { parseAmount } from "../core/parseAmount.js";
import type { Result } from "../core/types.js";

export type FlashnetSwapPlan = {
  poolId: string;
  tokenIn: string;
  tokenOut: string;
  amountInRaw: string;
  minimumAmountOutRaw: string;
  slippageBps: number;
  expiresAtMs: number;
};

/** Quote preparation only. The application binds ownership, fees and approval before SDK execution. */
export const prepareFlashnetSwap = async (args: {
  poolId: string;
  tokenIn: string;
  tokenOut: string;
  amountInRaw: string;
  slippageBps: number;
  nowMs: number;
  quotePool: (request: {
    poolId: string;
    tokenIn: string;
    tokenOut: string;
    amountInRaw: string;
  }) => Promise<Result<{ expectedAmountOutRaw: string; expiresAtMs: number }>>;
}): Promise<Result<FlashnetSwapPlan>> => {
  const amount = parseAmount({ raw: args.amountInRaw });

  if (
    !amount.success ||
    amount.data === 0n ||
    !args.poolId ||
    !args.tokenIn ||
    !args.tokenOut ||
    args.tokenIn === args.tokenOut ||
    !Number.isSafeInteger(args.nowMs)
  ) {
    return { success: false, code: "INVALID_FLASHNET_REQUEST" };
  }

  const quote = await args.quotePool({
    poolId: args.poolId,
    tokenIn: args.tokenIn,
    tokenOut: args.tokenOut,
    amountInRaw: args.amountInRaw,
  });

  if (!quote.success) return quote;
  if (
    !Number.isSafeInteger(quote.data.expiresAtMs) ||
    quote.data.expiresAtMs <= args.nowMs
  )
    return { success: false, code: "QUOTE_EXPIRED" };

  const minimum = calculateMinimumOutput({
    expectedRaw: quote.data.expectedAmountOutRaw,
    slippageBps: args.slippageBps,
  });

  if (!minimum.success) return minimum;

  return {
    success: true,
    data: {
      poolId: args.poolId,
      tokenIn: args.tokenIn,
      tokenOut: args.tokenOut,
      amountInRaw: args.amountInRaw,
      minimumAmountOutRaw: minimum.data,
      slippageBps: args.slippageBps,
      expiresAtMs: quote.data.expiresAtMs,
    },
  };
};
