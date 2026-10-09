# Build with one prompt

The prompt is an implementation brief for an agent with access to this kit. It
creates a new application using public contracts and mock data. External account
approval, signing custody and production settlement remain explicit integrations.

## Prepare the brief

Choose a product name, browser/mobile platform and wallet custody model. If you
have no preference, the prompt uses a responsive browser app with a TypeScript
backend and provider-neutral client signing. Open
[the build prompt](../../prompts/build-neobank.md) and substitute its product fields.

Give the agent access to the repository and run the prompt from its root. It
should read START.md and AGENTS.md, then create `app/` and a local run command.
Tell the agent your available provider capabilities using names only; credentials
belong in your application's server secret store, never in the prompt.

## Build sequence

1. Define domain types and synthetic fixtures.
2. Build login, overview, wallet, KYC, Pix, swaps and Bitcoin screens.
3. Implement mock adapters and persist operations with idempotency keys.
4. Add ownership, quote expiry, webhook duplication and pending-state tests.
5. Explain setup, demo behavior and remaining external adapter work in the app README.
6. Connect one authorized provider capability after its contract is verified.

## Review the result

Start the generated app and complete the synthetic journey described in
[acceptance criteria](../../prompts/acceptance-criteria.md). Check that the mock label
is visible, fees are itemized and a pending payment never looks paid. An app that
renders screens but cannot recover an interrupted operation has not completed the
brief. Read [screen map](../product/screens.md) and
[testing](../operations/testing.md) for the review path.
