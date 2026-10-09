# Spark in the Bitcoin module

Use Spark through an owner-scoped wallet adapter and a defined custody model.
Do not expose SDK initialization or signing material through ordinary API routes.

## Provider documentation

Start at [Spark docs](https://docs.spark.money/). Follow the wallet/network and
signing documentation for the version you select. A Breez-based integration has
its own [Spark SDK guide](https://sdk-doc-spark.breez.technology/guide/getting_started.html).
Keep these SDK contracts separate inside adapters.

## Application flow

Resolve the subject's wallet and selected network. Initialize its runtime within
a per-wallet/environment scope. Request receiving instructions from the supported
method and display their network/type. For a send, prepare amount, destination,
fee and expiry and obtain the required user approval before execution.

Persist external references durably. Query authoritative wallet/provider state
after restart rather than relying only on an in-memory event listener. Normalize
network-specific outcomes into the [operation lifecycle](../architecture/operation-lifecycle.md).

## On-chain interoperability

If exposing deposits or withdrawals to Bitcoin addresses, follow the chosen SDK's
current preparation, confirmation and fee-acceptance behavior. Treat that as an
explicit capability with its own status path. A displayed deposit address does not
prove that funds arrived or were made available in the target wallet.

Test network mismatch, cross-owner wallet lookup, delayed claim/confirmation,
initialization failure and payment recovery. Read [Breez](breez.md),
[wallet Spark guide](../wallet/spark.md) and [recovery](recovery.md).
