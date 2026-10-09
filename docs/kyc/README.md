# KYC and liveness

This module teaches a reusable KYC workflow: authenticated subject, consent,
document evidence, trusted liveness validation, provider submission and a persisted
decision. Approval is specific to a policy and rail.

## Read in order

1. [Flow](flow.md) and [data model](data-model.md).
2. [Documents](documents.md) and [privacy](privacy.md).
3. [Liveness](liveness.md) and [self-hosted integration](self-hosted-liveness.md).
4. [Pods evidence handoff](pods-evidence.md).
5. [Decisions and capabilities](decisions.md).

The capture app is our public
[aws-rekognition-liveness repository](https://github.com/HodleHub/aws-rekognition-liveness).
You host the capture/proxy and provide AWS resources plus a trusted validator.
AWS performs biometric analysis; the capture app is not a complete KYC provider.

## Template contract

[KYC types](../../templates/kyc/kycProvider.ts) keep evidence as references.
[Decision projection](../../templates/kyc/projectKycDecision.ts) maps a verified
provider decision to explicit rail availability. Provider payload construction
belongs in the restricted adapter and must not appear in ordinary domain logs.

## Initial build

Use a synthetic KYC adapter that walks through required steps and rejection
recovery. Make the UI read persisted backend state. Add real evidence capture only
after consent, retention, authorization and provider access are defined. Never
approve from a browser callback or import real identity fixtures into the repository.
