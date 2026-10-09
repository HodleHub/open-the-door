# Pods: initial provider

Use Pods as the initial integration for fiat ramps and swaps. Keep its API and
KYC-specific payloads behind adapters so the application can add other providers
without changing ownership, ledger or operation logic.

## Manual sequence

1. [Account access](account.md): obtain your dashboard/API permissions.
2. [API and docs](api.md): open the public schema and authenticate correctly.
3. [KYC](kyc.md): bind profile/evidence and read rail availability.
4. [Pix ramps](pix.md): prepare BRL on/off-ramp flows.
5. [Swaps](swaps.md): quote, review instructions and reconcile status.
6. [Failures](failures.md): errors, expiry and unknown outcomes.

The current [OpenAPI](https://api.pods.finance/openapi.json) is the authoritative
public contract reviewed for this kit. Endpoint details may change. The schema
advertises a production server; obtain an explicitly authorized test procedure
from Pods before exercising external actions.

## Templates

[createPodsQuote.ts](../../../templates/providers/pods/createPodsQuote.ts)
constructs a minimal price request through an injected transport and projects a
small runtime-validated quote. It deliberately omits customer identities and
execution instructions. [decodePodsQuote.ts](../../../templates/providers/pods/decodePodsQuote.ts)
shows how to reject a malformed or expired response.

A builder must add provider account binding, capabilities, execution schema,
transaction validation, ownership and durable operation storage. Supported assets,
networks and fees are discovered from the current provider contract and your own
account. Do not hardcode another application's negotiated limits or economics.
