import { isRecord } from "../../core/isRecord.js";
import type { Result } from "../../core/types.js";
import type { JsonTransport } from "../requestJson.js";

export type CreateWooviChargeArgs = {
  correlationId: string;
  valueCents: number;
  transport: JsonTransport;
};

/** Minimal charge only. Transport supplies raw AppID Authorization; this never credits a balance. */
export const createWooviCharge = async (
  args: CreateWooviChargeArgs,
): Promise<
  Result<{
    correlationId: string;
    valueCents: number;
    providerStatus: string;
  }>
> => {
  if (
    !args.correlationId ||
    !Number.isSafeInteger(args.valueCents) ||
    args.valueCents <= 0
  ) {
    return { success: false, code: "INVALID_CHARGE_REQUEST" };
  }

  const response = await args.transport({
    path: "/api/v1/charge",
    method: "POST",
    body: { correlationID: args.correlationId, value: args.valueCents },
  });

  if (!response.success) return response;
  if (!isRecord(response.data) || !isRecord(response.data.charge))
    return { success: false, code: "INVALID_WOOVI_RESPONSE" };

  const charge = response.data.charge;

  if (
    charge.correlationID !== args.correlationId ||
    charge.value !== args.valueCents ||
    typeof charge.status !== "string" ||
    !charge.status
  ) {
    return { success: false, code: "INVALID_WOOVI_RESPONSE" };
  }

  return {
    success: true,
    data: {
      correlationId: args.correlationId,
      valueCents: args.valueCents,
      providerStatus: charge.status,
    },
  };
};
