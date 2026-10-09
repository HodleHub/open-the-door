# Deploy your generated application

The kit has no production deployment or shared infrastructure. Deploy the generated
application to resources you own after its adapters, custody and recovery behavior
are defined and validated.

## Minimum services

Provide an authenticated API, durable operation store, journal where needed,
worker/outbox processing, secret manager and restricted evidence storage.
Configure fixed provider hosts and environment/account bindings. Use HTTPS for
customer routes, callbacks and liveness capture.

## Activation sequence

1. Deploy mock mode and run application acceptance checks.
2. Confirm database migrations and restart/outbox recovery.
3. Enable one authorized external test capability and verify its status cycle.
4. Configure webhook authenticity and reconciliation.
5. Verify secrets never appear in browser bundles or logs.
6. Enable live capabilities through a controlled operator configuration change.

Provider keys alone do not enable BaaS, KYC or every network. Keep unavailable
capabilities explicit. Existing operations retain their original account and
environment during a deployment/configuration change.

## Rollback and backup

Define a rollback that preserves durable operations and pending external references.
Disable new submissions when an adapter fails; keep reconciliation available.
Backup/restore evidence and signer/SDK state under the chosen privacy/custody policy.
Do not restore a database snapshot into a live environment without reconciling
external actions created after that snapshot.

Read [configuration](../getting-started/configuration.md),
[jobs](../architecture/jobs.md), [observability](observability.md) and
[wallet recovery](../wallet/recovery.md).
