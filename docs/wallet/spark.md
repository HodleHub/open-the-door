# Spark wallet integration

Spark is one Bitcoin integration path. Keep wallet initialization, signer access,
network selection and external operations behind a Bitcoin-specific port.

## Documentation access

Use [Spark documentation](https://docs.spark.money/) for current wallet and network
contracts. For Breez's Spark-based integration, follow
[Breez SDK getting started](https://sdk-doc-spark.breez.technology/guide/getting_started.html).
These are distinct SDK surfaces; do not combine method names or data directories
from different SDKs.

## Initialization

Pin the SDK/bindings version, choose its documented network and supply a signer
through your custody boundary. Initialize once per intended wallet/runtime scope.
A shared cache must include tenant, environment and wallet identity. Never initialize
all users from one hardcoded seed.

The [Breez runtime template](../../templates/bitcoin/createBreezRuntime.ts) demonstrates
single-flight initialization, retry after failed initialization and listener cleanup
through injected SDK functions. It contains no key derivation or secret loading.

## Payments

Receive using the selected documented Spark/Lightning method. Prepare sends before
execution and bind amount, recipient, fee and expiry to an application operation.
Persist external references and normalized state, then reconcile after restart.
Do not report success merely because a request resolved.

Test two wallets with different owners, initialization failure/retry, a process
restart after acceptance and a delayed payment outcome. See
[Bitcoin overview](../bitcoin/README.md), [Breez](../bitcoin/breez.md) and
[recovery](recovery.md).
