import type { Result, SubjectContext } from "../core/types.js";

export type EvidenceReference = {
  referenceId: string;
  subjectId: string;
  purpose: "document" | "liveness";
  expiresAtMs: number;
};

export type KycState =
  | "collecting"
  | "submitted"
  | "pending"
  | "approved"
  | "rejected_retryable"
  | "rejected";

export type KycDecision = {
  state: KycState;
  policyVersion: string;
  pixEnabled: boolean;
  usdEnabled: boolean;
  eurEnabled: boolean;
};

export type KycProvider = {
  submit: (args: {
    context: SubjectContext;
    attemptId: string;
    evidence: EvidenceReference[];
  }) => Promise<
    Result<{ referenceId: string; state: "submitted" | "pending" }>
  >;
  decision: (args: {
    context: SubjectContext;
    attemptId: string;
  }) => Promise<Result<KycDecision>>;
};
