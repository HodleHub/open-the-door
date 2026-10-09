import { parseAmount } from "../core/parseAmount.js";
import type { Result } from "../core/types.js";

export type VerifiedLightningInvoice = {
  referenceId: string;
  network: string;
  amountMsatRaw: string;
  expiresAtMs: number;
};
export type LightningPlan = {
  planReference: string;
  invoiceReference: string;
  amountMsatRaw: string;
  feeMsatRaw: string;
  expiresAtMs: number;
};

/** Caller supplies a trusted parsed invoice and preparation boundary; this function does not pay. */
export const prepareLightningSend = async (args: {
  invoice: VerifiedLightningInvoice;
  network: string;
  maximumFeeMsatRaw: string;
  nowMs: number;
  prepare: (
    invoice: VerifiedLightningInvoice,
  ) => Promise<Result<LightningPlan>>;
}): Promise<Result<LightningPlan>> => {
  const amount = parseAmount({ raw: args.invoice.amountMsatRaw });
  const maximum = parseAmount({ raw: args.maximumFeeMsatRaw });

  if (
    !amount.success ||
    amount.data === 0n ||
    !maximum.success ||
    args.invoice.network !== args.network
  ) {
    return { success: false, code: "INVALID_LIGHTNING_INVOICE" };
  }

  if (
    !Number.isSafeInteger(args.nowMs) ||
    !Number.isSafeInteger(args.invoice.expiresAtMs) ||
    args.invoice.expiresAtMs <= args.nowMs
  ) {
    return { success: false, code: "INVOICE_EXPIRED" };
  }

  const prepared = await args.prepare(args.invoice);

  if (!prepared.success) return prepared;

  const plan = prepared.data;
  const fee = parseAmount({ raw: plan.feeMsatRaw });

  if (
    !fee.success ||
    fee.data > maximum.data ||
    plan.invoiceReference !== args.invoice.referenceId ||
    plan.amountMsatRaw !== args.invoice.amountMsatRaw ||
    !plan.planReference ||
    !Number.isSafeInteger(plan.expiresAtMs) ||
    plan.expiresAtMs <= args.nowMs ||
    plan.expiresAtMs > args.invoice.expiresAtMs
  ) {
    return { success: false, code: "LIGHTNING_PLAN_MISMATCH" };
  }

  return prepared;
};
