import type { Result } from "./types.js";

export type ParseAmountArgs = { raw: string };

/** Parse canonical non-negative smallest-unit money without floating point. */
export const parseAmount = ({ raw }: ParseAmountArgs): Result<bigint> => {
  if (raw.length > 78 || !/^(0|[1-9][0-9]*)$/.test(raw)) {
    return { success: false, code: "INVALID_AMOUNT" };
  }

  return { success: true, data: BigInt(raw) };
};
