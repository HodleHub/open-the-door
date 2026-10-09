# Breez SDK over Spark

Use the Spark-specific Breez SDK documentation for this kit. Keep SDK bindings
and signing material behind an owner-scoped adapter.

## Account and docs access

Open [Breez SDK](https://sdk-doc-spark.breez.technology/) and
[Getting started](https://sdk-doc-spark.breez.technology/guide/getting_started.html).
Request your own API key through the official form linked there. Select the
supported language/binding for your application and pin its SDK version.
Follow its installation, initialization, event and payment preparation chapters.

## Runtime logic

[createBreezRuntime.ts](../../templates/bitcoin/createBreezRuntime.ts)
demonstrates single-flight initialization, retry after initialization failure,
listener cleanup and disconnect. Inject the current SDK's connect/listen/disconnect
functions. Instantiate it per wallet, environment and tenant; never reuse a global
wallet session across unrelated customers.

[prepareLightningSend.ts](../../templates/bitcoin/prepareLightningSend.ts)
shows invoice/fee validation before execution. Preparation and send are separate
phases. Match the actual SDK's request/result types in the adapter rather than
assuming these portable types are SDK methods.

## Event handling and recovery

Subscribe after initialization and persist operation references before execution.
Project events into normalized application state; never log complete SDK events.
An event may be duplicated or historical after restoration. Verify current
payment state and apply idempotent effects through durable workers.

Handle pending, failed, successful and recovery-required states according to the
pinned SDK contract. Unknown events cannot credit balances. Test initialization
failure, parallel callers, listener cleanup, fee changes and restart reconciliation.
Read [Spark](spark.md), [Lightning](lightning.md) and [recovery](recovery.md).
