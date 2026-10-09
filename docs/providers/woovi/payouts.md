# Pix payouts and outgoing payments

Outgoing payments require enabled products, correct account access and explicit
approval. Do not adapt a charge endpoint into a payment endpoint.

## Create and approve an ordinary payment

Request [payment access](https://developers.woovi.com/docs/payment/payment-how-to-request-access)
for your account. The [creation guide](https://developers.woovi.com/docs/payment/payment-how-to-use-api-to-create)
documents `POST /api/v1/payment`. A Pix-key request uses integer cents `value`,
`destinationAlias`, `destinationAliasType` and `correlationID`; a QR-code request
uses `qrCode` and `correlationID`. Bind `sourceAccountId` to your verified account
when the selected flow requires it. Construct destination fields inside a restricted
adapter rather than committing example personal values.

After your user's approval and reservation, follow
[provider approval](https://developers.woovi.com/docs/payment/payment-how-to-use-api-to-approve-a):
`POST /api/v1/payment/approve` identifies the existing payment with its
`correlationID`. Do not treat CREATED or APPROVED as final settlement. Follow
[status lookup](https://developers.woovi.com/docs/payment/payment-how-to-list) and the
[payment state machine](https://developers.woovi.com/docs/payment/payment-state-machine).
[Idempotency guidance](https://developers.woovi.com/docs/payment/payment-idempotency)
explains why the same operation keeps its original correlation ID on recovery.
Use the [API explorer](https://developers.woovi.com/api) for complete current schemas,
scopes and response codes.

## BaaS account withdrawal is a distinct flow

The [BaaS balance guide](https://developers.woovi.com/docs/baas/movimentando-saldo)
documents `POST /api/v1/account/{accountId}/withdraw` with a cents `value` and
Master API access. It uses that account's configured withdrawal destination;
it is not a generic arbitrary-beneficiary Pix payment. Resolve the account
through your protected mapping and verify the configured destination before
user approval. Use Master access only in the restricted BaaS management boundary.
Follow the current reference for enablement, result verification and idempotency.

## Application sequence

Authenticate, resolve the account and capability, validate the destination in a
restricted service and prepare the exact cents/fee plan. Persist an operation and
reserve the amount atomically. Show beneficiary information only as permitted by
your verified provider lookup and obtain the user's approval.

Submit using a stable correlation/reference. Store it before further processing.
A create response or approval response may still be pending. Verify payment state
through account-scoped status and documented callbacks before applying final ledger
effects or displaying a receipt.

## Unknown and refund states

When submission times out, retain the reservation and reconcile the original
reference. Do not recreate or approve again blindly. A verified failure can release
a reservation under your ledger policy; a refund must be tracked separately until
confirmed. Keep customer-identifying destination data out of logs and repository
fixtures.

Test simultaneous spends, wrong account credential, destination alteration,
response loss after acceptance and duplicate completion events. Read
[operations](../../architecture/operation-lifecycle.md), [authentication](authentication.md)
and [reconciliation](reconciliation.md).
