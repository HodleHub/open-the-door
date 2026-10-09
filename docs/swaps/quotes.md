# Quote semantics

A quote is a proposed plan, not a promise that a trade executed. Persist the snapshot
the user sees rather than reading mutable provider data at signing time.

## Fields

Record provider/account binding, quote reference, source/destination asset and
network, input amount, expected output, minimum output, fees, expiry and required
addresses. For amount-in requests the input is fixed; for amount-out requests the
output target is fixed and the allowed input must be bounded.

Represent every amount as a decimal integer string with explicit units. The
[sizing helper](../../templates/core/parseAmount.ts) rejects negative, fractional
and malformed smallest-unit strings. Convert display input deliberately and
avoid floating-point arithmetic for money.

## Slippage

Keep an application convention such as basis points, then translate at the adapter.
Providers may expect a fraction, percentage or basis points. Check the current
schema rather than reusing another provider's number. The
[minimum-output template](../../templates/swaps/calculateMinimumOutput.ts)
uses integer basis-point arithmetic and rounds downward.

## Validity

Use the returned deadline with the provider's documented units. Convert Unix
seconds to application milliseconds once in the adapter. Require enough validity
for the selected signing flow and invalidate the plan if asset, recipient, amount,
fee or route changes. Expiration during user review requires requoting.

## Verification

Test unit conversion, zero/negative amount, oversized integer strings, expired
and non-finite deadlines, output below minimum and fee above acceptance. Read
[execution](execution.md), [Pods quotes](../providers/pods/swaps.md) and
[signing](../wallet/signing.md).
