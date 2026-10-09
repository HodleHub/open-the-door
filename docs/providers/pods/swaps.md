# Pods swap lifecycle

Keep pricing, executable preparation, signing and final status separate. The
public quote API can return execution material when addresses/output are supplied;
a builder must decide which phase it is requesting.

## Price request

Use `GET /v2/swap/quote` with source/destination networks, exact asset identifiers
and exactly one amount direction. Read amount units and output selection in the
[current OpenAPI](https://api.pods.finance/openapi.json). Provider slippage input
uses its own documented format; do not send application basis points directly.

The [quote template](../../../templates/providers/pods/createPodsQuote.ts) is a
minimal amount-in pricing example. It runtime-validates a quote ID, amounts and
returned deadline. It does not request signing or accept arbitrary calldata.

## Executable preparation

Resolve the authenticated subject's origin/destination/refund addresses where
required. Validate every returned transaction effect independently. For EVM,
check chain, target, spender, amount, value, recipient and deadline. Other networks
need their own decoder. Present fees and minimum output before user approval.

## Status

Persist both the provider quote reference and any separate action/execution
reference. The status endpoint documents `{id}`; confirm which returned reference
tracks your selected flow instead of treating every ID as interchangeable. Query
status using the same account binding as preparation.

Normalize pending, success, failed and refund states from the current contract.
Unknown status fails closed. A lost submit response triggers reconciliation,
not another transfer. See [quote semantics](../../swaps/quotes.md),
[execution](../../swaps/execution.md) and [failures](failures.md).
