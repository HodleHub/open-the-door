import type { KycDecision } from "./kycProvider.js";

export type ProjectKycDecisionArgs = {
  verifiedState: string;
  policyVersion: string;
  verifiedRails: { pix: boolean; usd: boolean; eur: boolean };
};

/** Projection only: caller must authenticate the provider response and apply its policy first. */
export const projectKycDecision = (
  args: ProjectKycDecisionArgs,
): KycDecision => {
  const knownStates = [
    "collecting",
    "submitted",
    "pending",
    "approved",
    "rejected_retryable",
    "rejected",
  ];
  const state = args.verifiedState;
  const approved = state === "approved";

  if (!knownStates.includes(state)) {
    return {
      state: "pending",
      policyVersion: args.policyVersion,
      pixEnabled: false,
      usdEnabled: false,
      eurEnabled: false,
    };
  }

  if (
    state === "collecting" ||
    state === "submitted" ||
    state === "pending" ||
    state === "approved" ||
    state === "rejected_retryable" ||
    state === "rejected"
  ) {
    return {
      state,
      policyVersion: args.policyVersion,
      pixEnabled: approved && args.verifiedRails.pix,
      usdEnabled: approved && args.verifiedRails.usd,
      eurEnabled: approved && args.verifiedRails.eur,
    };
  }

  return {
    state: "pending",
    policyVersion: args.policyVersion,
    pixEnabled: false,
    usdEnabled: false,
    eurEnabled: false,
  };
};
