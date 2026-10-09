import type { Result, SubjectContext } from "../core/types.js";

export type WalletMetadata = {
  walletId: string;
  subjectId: string;
  tenantId: string;
  environment: SubjectContext["environment"];
  network: string;
};

export type SigningIntent = {
  operationId: string;
  walletId: string;
  network: string;
  assetIdentifier: string;
  amountRaw: string;
  destination: string;
  maximumFeeRaw: string;
  expiresAtMs: number;
};

export type WalletSubmission = {
  externalReference: string;
  state: "submitted" | "unknown";
};

export type WalletProvider = {
  resolve: (args: {
    context: SubjectContext;
    walletId: string;
  }) => Promise<Result<WalletMetadata>>;
  submit: (args: {
    context: SubjectContext;
    intent: SigningIntent;
  }) => Promise<Result<WalletSubmission>>;
};
