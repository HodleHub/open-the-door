# Ledger and balances

A screen balance is a projection. The journal records why it changed. Decide
whether your product owns a custodial ledger or merely displays independently
held wallet assets before implementing accounting.

## Journal invariants

For a custodial balance, create balanced postings in one atomic transaction.
Every posting names an asset, account reference, operation and smallest-unit
amount. Balance debits and credits per asset; converting assets requires separate
balanced journals linked to the trade. Use immutable entries and compensating
entries for corrections.

Enforce a unique posting key such as operation plus event kind and revision.
A duplicate webhook or worker replay must not create another credit. Never derive
spendable money from a provider's unverified callback alone.

## Reservations

Reserve the amount and bounded fees before submission. Keep available, reserved,
pending and settled balances distinct. Release a reservation only after a verified
terminal state or an explicitly authorized cancellation before submission. A
request timeout does not justify restoring spendable funds.

## Wallet balance display

For client-held assets, display the observed network balance and synchronization
time. Do not invent a matching custodial liability unless your product actually
holds one. Distinguish on-chain confirmations, pending payments and wallet-local
observations. Use asset/network identity, not just symbols.

## Verification

Race two spends against the same synthetic balance, replay one settlement event,
and interrupt a worker after provider acceptance. The journal must remain balanced,
no second spend may pass, and recovery must produce one final posting. Reconcile
provider statements to operations with a protected process described in
[Woovi reconciliation](../providers/woovi/reconciliation.md).
