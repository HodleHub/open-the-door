# Agent instructions

This repository is an independent documentation and template kit. Read README.md,
START.md, docs/README.md and prompts/build-neobank.md before building an application.

## Scope

- Build from the contracts and public provider documentation linked here.
- Use mocks by default. Never call money-moving provider endpoints during checks.
- Keep wallet and authentication SDKs inside adapters. Domain code must depend on
  interfaces, never on Privy-specific identities or SDK response objects.
- Use Pods as the initial ramp/swap integration. Woovi is a separately configured
  Pix/BaaS integration. Bitcoin integrations use Spark and Lightning.
- Include an opt-in Ethereum Sepolia EVM test profile following
  docs/getting-started/sepolia.md. Keep mock mode offline and validate RPC, signer
  and transaction chain IDs before signing. Sepolia does not enable fiat rails.
- The only Hodle integration repository linked by this kit is the public
  aws-rekognition-liveness capture project. Do not import private source, history,
  account configuration, business rules or operational documents from other repos.

## Data and behavior

- Use opaque synthetic fixture IDs and reserved example domains.
- Never add real identities, documents, selfies, addresses, phone numbers, tokens,
  seeds, keys, receipts, transaction records or customer exports.
- Verify authorization and wallet ownership on the server. Never trust a body userId.
- Use integer smallest-unit amounts encoded as decimal strings.
- Separate quote preparation, approval, submission and settlement.
- Timeout means unknown outcome until reconciled. Never retry payments blindly.
- Fail closed on unknown provider status, invalid signatures or missing capability.
- Keep demo state visibly separate from external confirmation.

## Implementation and checks

Use TypeScript with strict types, small functions, explicit adapters and runtime
validation at I/O boundaries. Do not use type assertions to bypass validation.
Templates are original examples, not claims of a production-ready integration.
Document each adapter's required permissions and current upstream contract.
Run npm run check after edits. Before publishing, follow docs/security/publication.md.
Do not change repository visibility as part of an application build prompt.
