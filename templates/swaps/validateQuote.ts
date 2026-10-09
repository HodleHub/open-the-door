import { parseAmount } from "../core/parseAmount.js";
import type { Result } from "../core/types.js";
import type { SwapQuote } from "./swapProvider.js";

/** Time/amount guard only. Independently bind ownership, assets, recipient and fees in the application. */
export const validateQuote = (args: {
  quote: SwapQuote;
  nowMs: number;
}): Result<SwapQuote> => {
  const quote = args.quote;

  if (
    !Number.isSafeInteger(args.nowMs) ||
    !Number.isSafeInteger(quote.expiresAtMs) ||
    quote.expiresAtMs <= args.nowMs
  ) {
    return { success: false, code: "QUOTE_EXPIRED" };
  }

  const input = parseAmount({ raw: quote.amountInRaw });
  const expected = parseAmount({ raw: quote.expectedAmountOutRaw });
  const minimum = parseAmount({ raw: quote.minimumAmountOutRaw });
  const fee = parseAmount({ raw: quote.maximumFeeRaw });

  if (
    !input.success ||
    input.data === 0n ||
    !expected.success ||
    !minimum.success ||
    minimum.data === 0n ||
    minimum.data > expected.data ||
    !fee.success ||
    !quote.quoteId ||
    !quote.recipientReference
  ) {
    return { success: false, code: "INVALID_QUOTE" };
  }

  return { success: true, data: quote };
};
