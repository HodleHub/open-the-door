# Cross-chain and multi-leg recovery

A cross-chain operation can finish its origin leg while destination delivery is
still pending. Track each leg instead of collapsing the route into one transaction.

## State model

Persist source preparation, source submission/confirmation, provider acceptance,
destination delivery and refund separately. Bind all legs to the accepted quote,
owner, environment and provider account. Keep each network's external reference
and its chosen confirmation policy.

The UI should show what is known: origin sent, destination pending, delivery
confirmed or refund pending. Do not report a completed exchange because the source
chain receipt succeeded. Do not restore spendable source funds until a verified
failure/refund supports that accounting change.

## Reconciliation

After a timeout, check the stored source transaction and provider status. Poll with
bounded backoff and a durable schedule. If the provider requires a documented
transaction-hash update, apply it to the original operation rather than creating
another quote. Unknown references or mismatched amounts require restricted review.

## Refunds

Prepare refund handling as part of route selection. Store the authorized refund
destination and validate any returned refund transaction. Refund pending, refund
submitted and refunded are distinct states. A refund to another asset/network
needs its own accounting treatment and explicit user communication.

Test a source transfer accepted before process death, delayed destination,
provider failure after origin completion, duplicate status events and refund
confirmation after restart. Read [Pods swaps](../providers/pods/swaps.md),
[Flashnet](../bitcoin/flashnet.md), [ledger](../architecture/ledger.md) and
[operation lifecycle](../architecture/operation-lifecycle.md).
