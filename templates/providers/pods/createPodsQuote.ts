import { parseAmount } from "../../core/parseAmount.js";
import type { Result } from "../../core/types.js";
import type { JsonTransport } from "../requestJson.js";
import { decodePodsQuote } from "./decodePodsQuote.js";
import type { PodsPriceQuote } from "./decodePodsQuote.js";

export type CreatePodsQuoteArgs = {
  originChain: string;
  destinationChain: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  nowMs: number;
  transport: JsonTransport;
};

/** Price-only example. Bind x-api-key and the verified fixed host in your server transport. */
export const createPodsQuote = async (
  args: CreatePodsQuoteArgs,
): Promise<Result<PodsPriceQuote>> => {
  const amount = parseAmount({ raw: args.amountIn });

  if (
    !amount.success ||
    amount.data === 0n ||
    !args.originChain ||
    !args.destinationChain ||
    !args.tokenIn ||
    !args.tokenOut
  ) {
    return { success: false, code: "INVALID_QUOTE_REQUEST" };
  }

  const query = new URLSearchParams({
    originChain: args.originChain,
    destinationChain: args.destinationChain,
    tokenIn: args.tokenIn,
    tokenOut: args.tokenOut,
    amountIn: args.amountIn,
  });
  const response = await args.transport({
    path: `/v2/swap/quote?${query.toString()}`,
    method: "GET",
  });

  if (!response.success) return response;

  const decoded = decodePodsQuote({ value: response.data, nowMs: args.nowMs });

  if (!decoded.success) return decoded;
  if (decoded.data.amountIn !== args.amountIn)
    return { success: false, code: "QUOTE_INPUT_MISMATCH" };

  return decoded;
};
