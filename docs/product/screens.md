# Application screen map

Use these screens as the target for the build prompt. The UI should make pending
operations, fees and provider readiness understandable without exposing integration
internals to the customer.

| Screen       | Main action                           | Observable result                               |
| ------------ | ------------------------------------- | ----------------------------------------------- |
| Login        | Authenticate                          | Scoped application session                      |
| Overview     | Inspect balances and activity         | Asset/network balances and pending operations   |
| Wallet       | Receive or send                       | Address/invoice or reviewed signing plan        |
| Verification | Complete KYC/liveness                 | Persisted progress and actionable correction    |
| Pix          | Receive or pay                        | Charge/payment status and fee breakdown         |
| Swaps        | Quote and approve                     | Minimum output, deadline and tracked settlement |
| Bitcoin      | Receive/pay Lightning, LNURL or Spark | Payment status and recovery path                |
| Settings     | Manage session and recovery           | Explicit custody/recovery actions               |

## Interaction rules

Show the chosen asset and network before signing. Separate provider fees, network
fees and product fees. Disable expired quotes. After a timeout, show that the
outcome is being checked and link to the existing operation; do not encourage a
new payment attempt.

The KYC screen shows the requested step and a normalized rejection message.
Never display raw provider errors, extracted documents or internal review notes.
The liveness camera flow must explain consent and cancellation before capture.

## Mock mode

Add a persistent demo indication and synthetic balances. Mock success is only
local state. The initial app must work without provider accounts and offer a clear
route to account setup for its operator. Follow
[one-prompt acceptance](../../prompts/acceptance-criteria.md).
