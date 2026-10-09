# Pix ramps through Pods

A fiat/crypto ramp is a trade with a payment leg. It is different from a standalone
Pix charge or a customer bank account. Use [Woovi](../woovi/README.md) when that is
the capability you need.

## BRL on-ramp

Confirm KYC and the specific BRL rail capability. Request a current quote with
fiat/BRL as the input side and the configured destination asset/network. Amounts
use documented smallest units; BRL input is represented as integer cents.
Bind the receiving wallet to the authenticated subject.

Validate the returned payment instructions against the approved quote. Display
price, fees, expiry and destination. Persist the quote/provider reference before
showing payment instructions. A Pix payment receipt from the browser is not
proof that crypto delivery settled.

## BRL off-ramp

Prepare a quote from the supported origin asset/network to the BRL fiat side.
Validate the destination payment identifier in a restricted boundary and bind
third-party/destination policy to the approved request. Never log a Pix key or
query URL that contains it.

Decode the origin transaction, confirm recipient/amount/network/fees and obtain
user approval before signing. Persist the source transaction and reconcile the
provider's destination status. A successful source transfer is one leg of the
operation, not proof of Pix completion.

## Failure recovery

Expired quotes require fresh approval. Source accepted/destination pending remains
pending; failed delivery can require a separately tracked refund. Keep original
references until authoritative reconciliation. Check current fields/requirements
in the [OpenAPI](https://api.pods.finance/openapi.json) and read
[swaps](swaps.md), [failures](failures.md) and [cross-chain recovery](../../swaps/cross-chain.md).
