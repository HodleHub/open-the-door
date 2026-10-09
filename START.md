# Start here

Choose a path before asking an agent to write code. For a quick local prototype,
use mock providers and the build prompt. For a real integration, complete account
setup in the provider manuals first. A live API key is not a sandbox.

## 1. Get the kit

```sh
git clone https://github.com/HodleHub/open-the-door.git
cd open-the-door
npm ci
npm run check
```

While the repository is private, use a GitHub identity with repository access.
The commands validate the kit; there is no application server to start yet.
Copy `.env.example` only when creating your application's own configuration.
The supplied templates never load secrets from that file.

## 2. Read in order

Read [architecture](docs/architecture/overview.md), [configuration](docs/getting-started/configuration.md)
and [privacy](docs/security/pii.md). Then choose a custody model in
[wallet](docs/wallet/custody.md) and follow the
[one-prompt workflow](docs/getting-started/one-prompt.md).

## 3. Build an application

Open this repository in your coding agent. Paste
[prompts/build-neobank.md](prompts/build-neobank.md), set your product name and
platform, and let the agent create an `app/` directory. Start with synthetic
balances, mock KYC, mock Pix and mock swaps. Keep provider APIs behind the supplied
interfaces. Add a clearly visible demo label to every mock financial screen.

## 4. Replace mocks deliberately

[Create provider accounts](docs/getting-started/provider-accounts.md), verify your
specific product permissions, and implement one adapter at a time. Use Woovi's
separate test environment where available. Obtain an explicitly authorized test
setup from Pods rather than assuming its production host is safe for experiments.

## Completion criteria

A useful first build signs in, shows a demo wallet, walks through synthetic KYC,
creates a mock Pix charge, tracks a mock swap and presents a Bitcoin tab. It also
runs negative tests for ownership, duplicate requests and expired quotes.
Use [testing](docs/operations/testing.md) before connecting any real-money rail.
