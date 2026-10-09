# KYC workflow

A KYC attempt belongs to one verified subject and policy version. Track every step
server-side so a browser refresh, callback retry or provider delay does not invent
approval or lose the customer's progress.

## Sequence

1. Authenticate and resolve the subject and intended rail.
2. Present purpose, processing providers and the application's retention policy.
3. Record consent/version and create an opaque attempt ID.
4. Create owner-bound document upload references or use provider-hosted onboarding.
5. Start a fresh liveness session when required and bind its validation token.
6. Validate evidence in trusted services; reject mismatched identity/session data.
7. Submit the allowed evidence through the selected provider adapter.
8. Persist normalized status and poll/consume verified events until a decision.
9. Enable only the capabilities explicitly granted by policy and provider status.

## State machine

Use draft, collecting, ready, submitted, pending, approved, rejected_retryable and
rejected states. A capture completion is one evidence step, not a KYC state of
approved. HTTP acceptance from a provider is submitted/pending unless an authoritative
decision says otherwise.

## Recovery

Retryable rejections should identify the step to redo using safe messages.
Identity conflicts require a protected correction path; never merge profiles by
email. Expired uploads/liveness sessions need new bound references. A provider
timeout after submission requires status lookup before another submission.

Test that evidence for attempt B cannot complete attempt A and that an approved
profile with a disabled rail cannot transact. Read [decisions](decisions.md),
[Pods KYC](../providers/pods/kyc.md) and [Woovi BaaS](../providers/woovi/baas-accounts.md).
