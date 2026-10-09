# Open the Door

**Build a neobank from one prompt. Own the architecture. Bring your providers.**

A docs-first builder kit by Hodle: reusable TypeScript templates, domain contracts,
provider onboarding manuals and an agent-ready specification. Start with Pods for
fiat ramps and swaps, add Woovi for Pix and BaaS, and build a Bitcoin experience
with Spark, Lightning, Breez SDK and Flashnet.

This is a starter kit for building your own application. The examples compile and
run against synthetic adapters; external integrations require your own accounts,
credentials, implementations and validation. No deployed banking application is
included, and cloning the repository does not open a bank account.

## Start building

1. Read [START.md](START.md) and the [documentation index](docs/README.md).
2. Give your coding agent the [one-prompt build brief](prompts/build-neobank.md).
3. Choose custody and authentication using the [wallet guide](docs/wallet/README.md).
4. Follow [Pods](docs/providers/pods/README.md) and [Woovi](docs/providers/woovi/README.md).
5. Integrate [KYC](docs/kyc/README.md) and our public [self-hosted liveness](docs/kyc/self-hosted-liveness.md).
6. Add [swaps](docs/swaps/README.md) and the [Bitcoin tab](docs/bitcoin/README.md).

## What's inside

| Area             | What you get                                                               |
| ---------------- | -------------------------------------------------------------------------- |
| Builder workflow | One prompt, acceptance criteria, screen map and implementation sequence    |
| Wallet           | Provider-neutral contracts, Privy boundary, ownership and signing examples |
| KYC              | Evidence references, state machine, consent, trusted liveness verification |
| Pods             | Account access, public API map, quotes, KYC, Pix ramps and status handling |
| Woovi            | Signup, sandbox, AppID, Master API, customer accounts, charges and payouts |
| Swaps            | Quote lifecycle, transaction validation, Uniswap and other adapter paths   |
| Bitcoin          | Spark, Lightning, Breez SDK, Flashnet, LNURL and recovery                  |
| Templates        | Small typed building blocks and synthetic integration examples             |
| Publication      | PII rules, secret scanning and a fresh-history release procedure           |

## Local checks

Requires Node.js 22.12+ and npm.

```sh
npm ci
npm run check
```

Checks validate TypeScript, documentation links, repository hygiene and synthetic
behavior. They make no provider requests and move no money. See
[template status](templates/README.md) before reusing a file.

## Project status

The repository is private during preparation. The original templates and prose
are licensed under [MIT](LICENSE); providers and dependencies retain their own
terms. Making this repository public is a separate maintainer action.

Read [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md). Examples use
opaque synthetic IDs. Never contribute customer data, keys, biometric captures,
production configuration or private infrastructure details.
