import { isRecord } from "../core/isRecord.js";
import { parseAmount } from "../core/parseAmount.js";
import type { Result } from "../core/types.js";

export type LnurlPayParameters = {
  callback: string;
  metadata: string;
  minimumMsatRaw: string;
  maximumMsatRaw: string;
};

/** Fetched-parameter validation only. Callback policy must enforce DNS/SSRF rules; invoice/hash checks are separate. */
export const validateLnurlPayRequest = (args: {
  value: unknown;
  amountMsatRaw: string;
  isAllowedCallback: (url: URL) => boolean;
}): Result<LnurlPayParameters> => {
  if (
    !isRecord(args.value) ||
    args.value.tag !== "payRequest" ||
    typeof args.value.callback !== "string" ||
    typeof args.value.metadata !== "string" ||
    args.value.metadata.length > 16_384 ||
    typeof args.value.minSendable !== "number" ||
    !Number.isSafeInteger(args.value.minSendable) ||
    typeof args.value.maxSendable !== "number" ||
    !Number.isSafeInteger(args.value.maxSendable)
  ) {
    return { success: false, code: "INVALID_LNURL_RESPONSE" };
  }

  try {
    const callback = new URL(args.value.callback);
    const metadata: unknown = JSON.parse(args.value.metadata);
    const minimum = parseAmount({ raw: String(args.value.minSendable) });
    const maximum = parseAmount({ raw: String(args.value.maxSendable) });
    const amount = parseAmount({ raw: args.amountMsatRaw });

    if (
      callback.protocol !== "https:" ||
      callback.username ||
      callback.password ||
      !args.isAllowedCallback(callback) ||
      !Array.isArray(metadata) ||
      metadata.length === 0 ||
      !metadata.every(
        (item: unknown) =>
          Array.isArray(item) &&
          item.length === 2 &&
          typeof item[0] === "string" &&
          typeof item[1] === "string",
      ) ||
      !metadata.some(
        (item: unknown) => Array.isArray(item) && item[0] === "text/plain",
      ) ||
      !minimum.success ||
      minimum.data === 0n ||
      !maximum.success ||
      maximum.data < minimum.data ||
      !amount.success ||
      amount.data < minimum.data ||
      amount.data > maximum.data
    ) {
      return { success: false, code: "INVALID_LNURL_PLAN" };
    }

    return {
      success: true,
      data: {
        callback: callback.toString(),
        metadata: args.value.metadata,
        minimumMsatRaw: minimum.data.toString(),
        maximumMsatRaw: maximum.data.toString(),
      },
    };
  } catch {
    return { success: false, code: "INVALID_LNURL_PLAN" };
  }
};
