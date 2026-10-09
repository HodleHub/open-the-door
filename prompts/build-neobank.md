# One prompt: build my neobank

Copy the brief below into a coding agent with access to this repository. Replace
PRODUCT_NAME and PLATFORM if desired. Default platform: responsive browser app.

---

Build PRODUCT_NAME as a neobank-style application in a new app/ directory using
this repository's documentation and original templates. Read START.md, AGENTS.md,
docs/README.md, docs/architecture/overview.md and docs/product/screens.md first.
Choose a coherent TypeScript stack and implement the application through completion.

Deliver login, overview, wallet, KYC/document/liveness progress, Pix receive/pay,
swaps, a dedicated Bitcoin tab and settings/recovery. Make the initial application
fully usable with synthetic local adapters and clearly label all simulated balances,
KYC decisions and payments as demo. Include accessible responsive UI, pending/error
states, explicit fees and asset/network display.

Use Pods as the initial provider adapter plan. Add Woovi's independent Pix/BaaS
contracts and setup manual, including operator signup, sandbox, Master API and
customer-account onboarding. Never substitute a Pix charge for a bank account or
payout. Keep Privy completely behind provider-neutral identity/wallet interfaces.
Choose custody explicitly; default to provider-neutral user approval/signing with
mocks until an actual provider is configured.

For KYC, use opaque evidence references, restricted storage contracts and trusted
backend decisions. Integrate our public self-hosted liveness capture project only
through docs/kyc/self-hosted-liveness.md. The browser cannot grant approval. Preserve
consent, ownership, policy version and rail-specific capability checks.

For swaps, support quote, fee/minimum-output review, approval, submission and final
status. Document Uniswap and additional adapter paths. Independently validate
network, asset, recipient, spender, amount, fee and expiry before signing.

Include an opt-in Ethereum Sepolia EVM test profile following
docs/getting-started/sepolia.md and the named settings in .env.example. Keep mock
mode offline by default. Validate RPC, signer, transaction, quote and asset chain
IDs against 11155111; never fall back to mainnet. Isolate test assets/storage and
display a persistent testnet label. Configure only independently verified test
capabilities; Sepolia does not enable Pods/Woovi or guarantee a swap route. Keep
unavailable features disabled or visibly mocked. Do not make RPC/provider calls
or submit test transactions while building or running synthetic checks.

For Bitcoin, implement Spark/Lightning-oriented ports, Breez SDK lifecycle,
Flashnet planning, LNURL Pay/Withdraw/Auth and Lightning address UX using this
kit's manuals. Keep credentials and signing material out of application source.

Persist durable operations and an outbox. Scope every resource to the verified
subject, tenant and environment. Use integer smallest-unit money strings. Enforce
idempotency, atomic reservations where applicable, authenticated webhook ingestion,
reconciliation and one final journal effect. A timeout means unknown outcome;
never resend money blindly.

Use only this kit and linked public provider sources. Do not import private
application source, history, infrastructure, fees, customer data or production
configuration. Never put real PII, valid personal-document fixtures, credentials,
seeds or biometric images into source, prompts, logs or tests.

Add an application README with exact local install/run/test commands, demo
limitations, provider account instructions and remaining external setup. Run the
checks for your chosen stack and the acceptance criteria in
prompts/acceptance-criteria.md. Complete the synthetic application, resolve failed
checks and report which integrations remain mocks. Do not deploy, enable live rails
or change repository visibility as part of this build.
