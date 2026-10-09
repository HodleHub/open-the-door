import { parseAmount } from "../core/parseAmount.js";
import type { Result, SubjectContext } from "../core/types.js";
import type {
  SigningIntent,
  WalletMetadata,
  WalletProvider,
  WalletSubmission,
} from "./walletProvider.js";

export type CreatePrivyWalletAdapterArgs = {
  now: () => number;
  resolveOwnedWallet: (args: {
    context: SubjectContext;
    walletId: string;
  }) => Promise<Result<WalletMetadata>>;
  verifyOwnership: (args: {
    context: SubjectContext;
    walletId: string;
  }) => Promise<boolean>;
  verifyApproval: (args: {
    context: SubjectContext;
    intent: SigningIntent;
  }) => Promise<boolean>;
  submitApproved: (args: {
    context: SubjectContext;
    intent: SigningIntent;
  }) => Promise<Result<WalletSubmission>>;
};

/** Supply trusted current-SDK boundaries; never accept ownership/approval from a client boolean. */
export const createPrivyWalletAdapter = (
  dependencies: CreatePrivyWalletAdapterArgs,
): WalletProvider => ({
  resolve: dependencies.resolveOwnedWallet,
  submit: async ({ context, intent }) => {
    if (
      !(await dependencies.verifyOwnership({
        context,
        walletId: intent.walletId,
      }))
    ) {
      return { success: false, code: "WALLET_NOT_OWNED" };
    }

    const wallet = await dependencies.resolveOwnedWallet({
      context,
      walletId: intent.walletId,
    });

    if (!wallet.success) return wallet;

    const scoped =
      wallet.data.subjectId === context.subjectId &&
      wallet.data.tenantId === context.tenantId &&
      wallet.data.environment === context.environment &&
      wallet.data.walletId === intent.walletId;

    if (!scoped) return { success: false, code: "WALLET_SCOPE_MISMATCH" };
    if (wallet.data.network !== intent.network)
      return { success: false, code: "NETWORK_MISMATCH" };
    if (
      !Number.isSafeInteger(intent.expiresAtMs) ||
      intent.expiresAtMs <= dependencies.now()
    ) {
      return { success: false, code: "INTENT_EXPIRED" };
    }

    const amount = parseAmount({ raw: intent.amountRaw });
    const fee = parseAmount({ raw: intent.maximumFeeRaw });

    if (
      !amount.success ||
      amount.data === 0n ||
      !fee.success ||
      !intent.destination ||
      !intent.assetIdentifier
    ) {
      return { success: false, code: "INVALID_INTENT" };
    }

    if (!(await dependencies.verifyApproval({ context, intent }))) {
      return { success: false, code: "APPROVAL_REQUIRED" };
    }

    return dependencies.submitApproved({ context, intent });
  },
});
