# Provider adapter contract

An adapter receives a scoped, approved application request and translates it to
an external protocol. It returns a normalized result without leaking raw provider
objects into the domain.

## Required information

Declare provider/account binding, environment, enabled capabilities, input schema,
amount unit, endpoint/API version, timeout, authentication, response decoder and
idempotency mechanism. Distinguish a read-only pricing call from quote acceptance
or execution; some APIs prepare actionable payment instructions during quoting.

A result should contain a stable success/error discriminator, normalized state,
external reference and only the fields needed by the caller. Raw errors may include
identity values, credentials or signed URLs; never forward them automatically.

## HTTP boundary

Resolve a fixed HTTPS host from validated configuration. Credentialed requests
must not follow redirects to arbitrary hosts. Apply duration and response-size
limits. Decode unknown input with runtime validators, not TypeScript assertions.
The [transport template](../../templates/providers/requestJson.ts) demonstrates
those limits and returns safe error codes.

## Retry rules

Read-only requests may use bounded retry/backoff. Money-moving calls require a
stable provider correlation ID and an authoritative lookup strategy. If the
response is lost, reconcile the original reference before submitting again.
A local idempotency table alone cannot prevent duplicate external execution after
an ambiguous request.

## Validation

Test bad credentials, malformed response, unknown status, wrong provider-account
binding, expired quote, oversized response and timeout. Record external validation
separately from mock checks. See [testing](../operations/testing.md) and
[operation lifecycle](../architecture/operation-lifecycle.md).
