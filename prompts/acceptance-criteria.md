# Generated application acceptance

A successful build must implement the journey and recovery behavior, not only
static screens. Use synthetic adapters until real integrations are authorized.

## Customer journey

- Login creates a verified subject and scoped session.
- Overview shows asset/network balances, freshness and pending operations.
- Wallet receive/send validates network, ownership, fee and approval.
- KYC persists consent and step progress; a browser callback cannot approve it.
- Pix receive tracks a charge; Pix pay tracks a distinct approved outgoing operation.
- Swaps show expected/minimum output, fee breakdown and quote expiry.
- Bitcoin tab handles supported payment input types and exposes status/recovery.
- Settings explain the actual custody and recovery model.
- Mock mode has a persistent visible demo label.

## Sepolia profile

- The generated app documents opt-in RPC setup, test gas/tokens and validation.
- Mock mode remains offline; enabling EVM test mode does not enable live fiat rails.
- Sepolia mode shows a persistent testnet label and keeps assets/storage separate.
- RPC, signer, transaction, quote and asset chain IDs must match `11155111`.
- Tests reject mainnet (`1`), Base Sepolia (`84532`) and unavailable RPC responses
  before signing/submission; a matching wallet address cannot bypass network checks.
- Missing token/router support or an unavailable swap route cannot show success.
- Synthetic checks use mocked I/O. External test transfers require explicit operator
  setup and user approval in the generated app, with sanitized results kept private.

Use the [Sepolia manual](../docs/getting-started/sepolia.md) for setup and the manual
wallet/swap sequence. Passing these checks does not imply on-chain validation.

## Invariants

Attempt B's evidence cannot complete attempt A. Subject A cannot use subject B's
wallet, quote, operation or evidence. Reusing an idempotency key with a different
request fails. Concurrent spends cannot consume the same reserved balance.
Unknown status, invalid webhook authentication and disabled rails fail closed.

Expired or altered plans cannot be signed. Provider acceptance does not show final
settlement. A lost response triggers reconciliation of the original reference.
Duplicate/reordered callbacks create one allowed state change and journal effect.
Restarted workers recover the outbox and pending operations.

## Evidence

Run the application's checks with synthetic fixtures. Exercise the real application
endpoint/worker paths while mocking only external I/O. Record sanitized validation
results in its README. List implemented mocks, configured external test adapters
and unconfigured live capabilities separately. Do not claim real settlement from
a mock test or an accepted request.

See [testing manual](../docs/operations/testing.md).
