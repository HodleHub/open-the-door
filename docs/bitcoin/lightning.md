# Lightning payment lifecycle

Lightning invoices and LNURL describe requests; the wallet/provider determines
whether a payment settled. Keep invoice parsing, approval and send status separate.

## Receive

Authenticate and scope the wallet, request an invoice with the intended amount,
description and expiry, then persist its reference. Display the invoice to the
intended customer. A created invoice is unpaid until the receiving backend/provider
confirms settlement.

## Send

Parse the invoice with a supported BOLT11 implementation. Check network, expiry,
amount and the meaning of any description/hash. For amountless invoices, require
an explicit user amount and respect the selected adapter's behavior. Prepare the
send and expose its fee bound before approval.

Submit the prepared plan once under a durable operation. Treat an ambiguous
response as unknown and reconcile by the stored payment reference. Never pay a
new invoice to compensate for an unresolved original automatically.

## Units

Invoices and LNURL can use millisatoshis; UI balances may use satoshis. One satoshi
is 1000 millisatoshis. Reject unsupported fractional-satoshi flows rather than
silently rounding the user's payment. Use decimal strings and integer arithmetic.

[prepareLightningSend.ts](../../templates/bitcoin/prepareLightningSend.ts)
validates a normalized invoice and prepared fee plan. Your adapter must perform
real parsing and trusted network/status verification.

Test expired invoice, wrong network, incorrect amount, fees above approval and
response loss after send. Read [BOLT11](https://github.com/lightning/bolts/blob/master/11-payment-encoding.md),
[LNURL Pay](lnurl-pay.md) and [Breez](breez.md).
