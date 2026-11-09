# Documentation index

Start at [START.md](../START.md), then follow the journey below. Every Markdown
manual is indexed here; the code examples live in [templates](../templates/README.md).

## Recommended reading path

1. [Build with one prompt](getting-started/one-prompt.md).
2. [Architecture](architecture/overview.md), [custody](wallet/custody.md) and [PII](security/pii.md).
3. [Provider accounts](getting-started/provider-accounts.md), [Pods](providers/pods/README.md) and [Woovi](providers/woovi/README.md).
4. [KYC](kyc/README.md), [wallet](wallet/README.md), [swaps](swaps/README.md) and [Bitcoin](bitcoin/README.md).
5. [Testing](operations/testing.md), [deployment](operations/deployment.md) and [publication](security/publication.md).
6. Public site discovery: [SEO, GEO and AEO](growth/seo.md) and the [daily loop](growth/seo-daily.md).

For an external EVM test run after the mock build, follow
[Ethereum Sepolia](getting-started/sepolia.md).

Each manual explains its prerequisites, flow, trust boundaries, failure recovery
and validation within its scope. Follow [official docs](external-docs.md) for current
provider schemas and account-specific capabilities. The initial app is a synthetic
build; external approvals and settlement require independent validation.

## Project

- [Agent instructions](../AGENTS.md)
- [Contributing](../CONTRIBUTING.md)
- [Open the Door](../README.md)
- [Security](../SECURITY.md)
- [Start here](../START.md)

## docs

- [Enter the official documentation](external-docs.md)
- [Builder roadmap](roadmap.md)

## docs/architecture

- [Module boundaries](architecture/boundaries.md)
- [Capabilities](architecture/capabilities.md)
- [Domain model](architecture/domain-model.md)
- [Jobs and the outbox](architecture/jobs.md)
- [Ledger and balances](architecture/ledger.md)
- [Ownership and multi-tenancy](architecture/multi-tenancy.md)
- [Operation lifecycle](architecture/operation-lifecycle.md)
- [Architecture](architecture/overview.md)
- [Webhook ingestion](architecture/webhooks.md)

## docs/bitcoin

- [Bitcoin tab](bitcoin/README.md)
- [Breez SDK over Spark](bitcoin/breez.md)
- [Flashnet integration logic](bitcoin/flashnet.md)
- [Lightning addresses](bitcoin/lightning-address.md)
- [Lightning payment lifecycle](bitcoin/lightning.md)
- [LNURL Auth](bitcoin/lnurl-auth.md)
- [LNURL Pay](bitcoin/lnurl-pay.md)
- [LNURL Withdraw](bitcoin/lnurl-withdraw.md)
- [LNURL: what it does](bitcoin/lnurl.md)
- [Bitcoin payment recovery](bitcoin/recovery.md)
- [Spark in the Bitcoin module](bitcoin/spark.md)

## docs/getting-started

- [Configuration](getting-started/configuration.md)
- [Local development](getting-started/local-development.md)
- [Build with one prompt](getting-started/one-prompt.md)
- [Create your provider accounts](getting-started/provider-accounts.md)
- [Mock, test and live environments](getting-started/sandbox.md)
- [Ethereum Sepolia test environment](getting-started/sepolia.md)

## docs/growth

- [SEO, GEO and AEO](growth/seo.md)
- [Daily SEO loop: check, observe, compare, improve](growth/seo-daily.md)

## docs/kyc

- [KYC and liveness](kyc/README.md)
- [KYC data model](kyc/data-model.md)
- [Decisions and rail access](kyc/decisions.md)
- [Document capture and storage](kyc/documents.md)
- [KYC workflow](kyc/flow.md)
- [Trusted liveness validation](kyc/liveness.md)
- [Send validated evidence to Pods](kyc/pods-evidence.md)
- [KYC privacy by design](kyc/privacy.md)
- [Self-host our liveness capture](kyc/self-hosted-liveness.md)

## docs/operations

- [Deploy your generated application](operations/deployment.md)
- [Observe behavior without leaking data](operations/observability.md)
- [Validation](operations/testing.md)

## docs/product

- [Authentication](product/authentication.md)
- [Application screen map](product/screens.md)

## docs/providers

- [Providers](providers/README.md)
- [Provider adapter contract](providers/contracts.md)

## docs/providers/pods

- [Pods: initial provider](providers/pods/README.md)
- [Get a Pods account and API access](providers/pods/account.md)
- [Open and use Pods API documentation](providers/pods/api.md)
- [Pods failure handling](providers/pods/failures.md)
- [Pods KYC](providers/pods/kyc.md)
- [Pix ramps through Pods](providers/pods/pix.md)
- [Pods swap lifecycle](providers/pods/swaps.md)

## docs/providers/woovi

- [Woovi integration manual](providers/woovi/README.md)
- [Create your Woovi account](providers/woovi/account-setup.md)
- [Woovi AppID and account scope](providers/woovi/authentication.md)
- [Create customer accounts with Woovi BaaS](providers/woovi/baas-accounts.md)
- [Create and track a Pix charge](providers/woovi/charges.md)
- [Pix payouts and outgoing payments](providers/woovi/payouts.md)
- [Woovi reconciliation](providers/woovi/reconciliation.md)
- [Woovi sandbox](providers/woovi/sandbox.md)
- [Woovi webhooks](providers/woovi/webhooks.md)

## docs/security

- [Keep PII out of the repository](security/pii.md)
- [Publish the kit safely](security/publication.md)
- [Secrets and signing material](security/secrets.md)

## docs/swaps

- [Swaps](swaps/README.md)
- [Add other swap providers](swaps/alternatives.md)
- [Cross-chain and multi-leg recovery](swaps/cross-chain.md)
- [Prepare, review and execute](swaps/execution.md)
- [Quote semantics](swaps/quotes.md)
- [Uniswap integration paths](swaps/uniswap.md)

## docs/wallet

- [Wallet](wallet/README.md)
- [Wallet contract](wallet/contract.md)
- [Choose custody deliberately](wallet/custody.md)
- [EVM wallet integration](wallet/evm.md)
- [Privy behind an adapter](wallet/privy-adapter.md)
- [Wallet recovery](wallet/recovery.md)
- [Signing and user approval](wallet/signing.md)
- [Spark wallet integration](wallet/spark.md)

## prompts

- [Generated application acceptance](../prompts/acceptance-criteria.md)
- [Prompt: add one provider adapter](../prompts/add-provider.md)
- [One prompt: build my neobank](../prompts/build-neobank.md)

## skills

- [Skill: SEO, GEO and AEO loop](../skills/seo/SKILL.md)

## templates

- [Original code templates](../templates/README.md)

## templates/providers

- [Wire a provider transport](../templates/providers/README.md)
