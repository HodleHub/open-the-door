import type { Asset, Result, SubjectContext } from "../core/types.js";

export type SwapQuote = {
  quoteId: string;
  source: Asset;
  destination: Asset;
  amountInRaw: string;
  expectedAmountOutRaw: string;
  minimumAmountOutRaw: string;
  maximumFeeRaw: string;
  recipientReference: string;
  expiresAtMs: number;
};

export type PreparedSwap = {
  quote: SwapQuote;
  planReference: string;
  planDigest: string;
};

export type SwapProvider = {
  quote: (args: {
    context: SubjectContext;
    source: Asset;
    destination: Asset;
    amountInRaw: string;
  }) => Promise<Result<SwapQuote>>;
  prepare: (args: {
    context: SubjectContext;
    quote: SwapQuote;
    walletId: string;
  }) => Promise<Result<PreparedSwap>>;
  submit: (args: {
    context: SubjectContext;
    operationId: string;
    approvedPlan: PreparedSwap;
  }) => Promise<
    Result<{ externalReference: string; state: "submitted" | "unknown" }>
  >;
  status: (args: { context: SubjectContext; operationId: string }) => Promise<
    Result<{
      state:
        | "pending"
        | "settled"
        | "failed"
        | "refund_pending"
        | "refunded"
        | "unknown";
    }>
  >;
};
