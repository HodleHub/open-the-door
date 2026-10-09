import { isRecord } from "../../core/isRecord.js";
import { parseAmount } from "../../core/parseAmount.js";
import type { Result } from "../../core/types.js";

export type PodsPriceQuote = {
  quoteId: string;
  amountIn: string;
  amountOut: string;
  expiresAtMs: number;
};

/** Minimal price projection, not a complete quote or executable-transaction validator. */
export const decodePodsQuote = (args: {
  value: unknown;
  nowMs: number;
}): Result<PodsPriceQuote> => {
  if (!isRecord(args.value) || !isRecord(args.value.quote))
    return { success: false, code: "INVALID_PODS_RESPONSE" };

  const quote = args.value.quote;

  if (
    typeof quote.quoteId !== "string" ||
    !quote.quoteId ||
    typeof quote.deadline !== "number" ||
    !Number.isSafeInteger(quote.deadline * 1000) ||
    !Number.isSafeInteger(args.nowMs) ||
    !isRecord(quote.tokenIn) ||
    !isRecord(quote.tokenOut) ||
    typeof quote.tokenIn.amount !== "string" ||
    typeof quote.tokenOut.amount !== "string"
  ) {
    return { success: false, code: "INVALID_PODS_RESPONSE" };
  }

  const input = parseAmount({ raw: quote.tokenIn.amount });
  const output = parseAmount({ raw: quote.tokenOut.amount });

  if (
    !input.success ||
    input.data === 0n ||
    !output.success ||
    output.data === 0n
  ) {
    return { success: false, code: "INVALID_PODS_AMOUNT" };
  }

  if (quote.deadline * 1000 <= args.nowMs)
    return { success: false, code: "QUOTE_EXPIRED" };

  return {
    success: true,
    data: {
      quoteId: quote.quoteId,
      amountIn: quote.tokenIn.amount,
      amountOut: quote.tokenOut.amount,
      expiresAtMs: quote.deadline * 1000,
    },
  };
};
