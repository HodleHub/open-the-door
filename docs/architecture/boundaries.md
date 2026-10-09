# Module boundaries

A provider adapter translates external contracts; it must not decide who owns a
wallet, whether a user passed policy or which ledger balance can be spent.
Those decisions belong to the application core.

## Dependency direction

The UI calls authenticated application endpoints. Domain services depend on
interfaces. Adapters implement those interfaces with SDKs/HTTP clients. The
composition root wires dependencies and validated configuration. Avoid importing
an SDK client directly into a resolver, controller or UI screen.

| Boundary       | Allowed input                                  | Returned output                         |
| -------------- | ---------------------------------------------- | --------------------------------------- |
| Authentication | Access token                                   | Verified opaque application subject     |
| Wallet         | Scoped wallet reference and signing intent     | Address/operation reference             |
| KYC            | Scoped attempt and private evidence references | Normalized decision/capabilities        |
| Ramp/Pix       | Approved operation and smallest-unit amount    | Provider reference and normalized state |
| Swap           | Bound quote and validated signing request      | Submission reference                    |
| Webhook        | Raw bytes and verified transport metadata      | Durable normalized event                |

## Sensitive edges

Map external user IDs to an internal subject in restricted storage. Do not use a
Privy DID as the public domain primary key. Resolve documents through an evidence
service that checks ownership; an object key alone is not authorization.

Normalize provider errors to stable codes. Keep raw details outside ordinary logs
and UI messages. Signed URLs, access tokens, invoice preimages and signing payloads
can carry credentials even when they look like ordinary strings.

## Review questions

Can this module run with a synthetic adapter? Can a second provider implement the
same port without changing business logic? Can a malicious client select another
user's wallet or evidence reference? Do unknown provider states fail closed?
If any answer is unclear, fix the boundary before building another screen.
See [multi-tenancy](multi-tenancy.md) and [wallet contract](../wallet/contract.md).
