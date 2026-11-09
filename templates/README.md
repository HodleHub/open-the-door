# Original code templates

These are small TypeScript examples written for this kit. They compile with strict
types and are tested with synthetic dependencies. They are not copied production
modules or complete provider integrations.

| Directory | Contract/examples                                                              | Remaining application responsibility                         |
| --------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| core      | Exact amounts, scope and result types                                          | Authentication and persistence                               |
| wallet    | Portable wallet port and Privy boundary                                        | Current SDK, ownership verifier and approval store           |
| kyc       | Evidence references and decision projection                                    | Capture, trusted verification and restricted storage         |
| providers | Bounded JSON transport, Pods quote and Woovi charge                            | Accounts, credentials, complete schemas and status           |
| swaps     | Portable port, quote guard and integer slippage                                | Calldata validation, approval, submission and reconciliation |
| seo       | Sitemap, robots.txt crawler access, page audit, daily check, window comparison | Bounded fetch, scheduler, metric sources and storage         |
| bitcoin   | Breez runtime, Lightning preparation, Flashnet plan and LNURL checks           | Actual SDK bindings, parsers, networking and settlement      |

## Reuse

Copy a focused file and its types into your application or import from the kit
while prototyping. Inject external I/O at the boundary. Keep domain code independent
of a provider SDK. Read the corresponding manual before supplying a real adapter.

Some templates perform real HTTP if you explicitly inject a configured fetch
transport. The default tests inject synthetic functions and make no outbound
requests. No example automatically reads `.env` or chooses live credentials.

## Status

Contracts and pure validators are complete within their documented scope. Provider
request examples cover only a projected minimal request/response. Runtime lifecycle
examples omit durable storage and signing. No template alone verifies settlement,
creates a real bank account or implements the complete LNURL protocol.

Run `npm run check` and consult [testing](../docs/operations/testing.md).
