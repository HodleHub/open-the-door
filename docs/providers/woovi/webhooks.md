# Woovi webhooks

Register a fixed HTTPS receiver using the platform or the current documented
webhook API. Choose events and account scope deliberately. For BaaS, distinguish
operator-level onboarding events from customer-account payment events.

## Setup

Read [platform webhook guide](https://developers.woovi.com/docs/webhook/platform/webhook-platform-api)
and the BaaS webhook section linked from the
[BaaS workflow](https://developers.woovi.com/docs/baas/basic-flux-baas).
Configure the provider's documented authenticity mechanism and any receiver
credential in a secret store. Do not invent a signature header or trust an
unauthenticated callback.

## Receiver

Apply limits, verify authentication, bind provider account/environment, decode an
allowlisted event and persist it durably. Acknowledge only after storage. Queue
processing separately. Do not log raw bodies or authorization headers.

For charge/payment events, load the local operation and refresh authoritative
state with the same account's credential. Check resource ID, correlation ID,
amount and scope. For account onboarding, confirm approval/account availability
before activating the account-specific application.

## Idempotency

Deduplicate transport events and enforce one state/journal effect independently.
Delayed pending events cannot roll back a terminal state. Missing/unrecognized
fields should fail closed and surface a safe operator code without dumping the
payload.

Test duplicate callbacks, wrong authorization, reordered state, another account's
resource and a worker crash after event persistence. Read
[shared webhook contract](../../architecture/webhooks.md) and
[reconciliation](reconciliation.md).
