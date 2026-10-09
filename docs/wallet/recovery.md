# Wallet recovery

Account recovery, key recovery and payment recovery are separate procedures.
A password reset does not necessarily restore signing access, and a restored
wallet does not resolve every pending payment.

## Key and identity recovery

Document who owns the key, which backup/export mechanism the selected provider
supports, what the user must preserve and whether a provider outage prevents
recovery. Use the provider's documented procedure; do not design an ad hoc mnemonic
API. Never request seeds through customer support or a web form.

For client-held keys, explain encrypted backup and device loss before accepting
real funds. For embedded wallets, test the documented identity recovery and wallet
export path with your own synthetic/test setup. For operator custody, specify a
restricted, auditable recovery process separately from application login.

## Operation recovery

Persist external references and state in durable storage. On startup, find pending
and unknown operations, refresh authoritative status and apply idempotent effects.
If the provider cannot establish an outcome, retain the unknown state and an
operator review path. Do not send again because a request timer expired.

A restored SDK may emit historical events; reconcile them against existing
operations instead of treating each event as a new payment. Backup SDK databases
according to the chosen SDK's documented requirements, with per-wallet isolation.

Test identity loss, signer unavailability, restoration with pending operations
and duplicate historical events. Read [Bitcoin recovery](../bitcoin/recovery.md)
and [jobs](../architecture/jobs.md).
