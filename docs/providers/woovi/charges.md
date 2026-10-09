# Create and track a Pix charge

A charge requests an incoming payment. Creating it does not credit a customer
balance. Settlement must be verified and posted idempotently.

## Minimum request

The public API uses `POST /api/v1/charge`, an AppID, a correlation ID and an integer
value in BRL cents. The [Woovi homepage example](https://developers.woovi.com/)
shows this minimal contract. Use the current API explorer for optional fields,
expiry and response schema.

[createWooviCharge.ts](../../../templates/providers/woovi/createWooviCharge.ts)
accepts the configured credential through an injected boundary and validates the
projected correlation/value/status fields. It has no customer identity fields and
cannot settle or credit an account.

## Application flow

Create a scoped operation and stable correlation ID before the request. Store the
provider charge reference and authorized payment instructions privately. Render
only the required QR/payment data to the authenticated customer. Bind those
instructions to the amount and intended account.

Use [webhooks](webhooks.md) to learn of changes, then refresh authoritative charge
state. Verify correlation ID, amount, account, environment and expected status
before applying one journal effect. A screenshot or client callback is insufficient.

## Failure cases

If creation times out, reconcile by the existing correlation/reference according
to the current API contract. An expired charge must not be shown as payable. A
replacement charge is a distinct operation and must not create two credits when
an old payment arrives late. Read [ledger](../../architecture/ledger.md),
[reconciliation](reconciliation.md) and [sandbox](sandbox.md).
