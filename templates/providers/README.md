# Wire a provider transport

Provider request templates receive a `JsonTransport`. Your server's composition
root supplies fixed hosts, headers and external I/O. Keep this binding out of
browser modules and never take a provider base URL from a customer request.

## Pods example

```ts
import { requestJson } from "./requestJson.js";
import type { JsonTransport } from "./requestJson.js";

const transport: JsonTransport = (request) =>
  requestJson({
    ...request,
    baseUrl: "https://api.pods.finance",
    allowedOrigins: ["https://api.pods.finance"],
    headers: { "x-api-key": serverSecrets.podsApiKey },
    fetchImpl: fetch,
  });
```

`serverSecrets` stands for your validated server secret-store binding; it is not
provided by the kit. This transport makes real requests if used with `fetch` and
live credentials. Use a synthetic transport in mock mode. The application must
verify account scope and capability before selecting this adapter.

## Woovi example

Use the same fixed transport pattern with the host verified for your selected
Woovi environment and `Authorization: serverSecrets.wooviAppId`. General Woovi API
access uses the raw AppID. Use an account-scoped credential for an enabled customer
account; a Master key must not be an automatic fallback.

## Response and retry behavior

The bounded transport returns safe codes and unknown JSON. Each provider function
validates and projects only the relevant fields. Keep richer status/error decoding
in a protected adapter if needed; do not reintroduce raw payload logging.

No automatic retry is provided. A read-only pricing request can use bounded
backoff; payment submission needs durable idempotency and authoritative
reconciliation. See [provider contract](../../docs/providers/contracts.md),
[Pods](../../docs/providers/pods/README.md) and [Woovi](../../docs/providers/woovi/README.md).
