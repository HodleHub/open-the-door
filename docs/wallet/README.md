# Wallet

Build the wallet around an owner-scoped interface. Authentication, key custody,
network access and signing are distinct concerns. Choose the custody model before
adding a receive address or a send button.

## Reading path

1. [Contract](contract.md): portable types and ownership boundaries.
2. [Custody](custody.md): where keys live and who can authorize spending.
3. [Signing](signing.md): bind approvals to network, amount and destination.
4. [Privy adapter](privy-adapter.md): isolate an optional embedded-wallet provider.
5. [EVM](evm.md) and [Spark](spark.md): network-specific differences.
6. [Recovery](recovery.md): backups, account recovery and uncertain payments.

## Template path

[Wallet contracts](../../templates/wallet/walletProvider.ts) define the adapter
surface. [The Privy boundary](../../templates/wallet/createPrivyWalletAdapter.ts)
uses injected verification/ownership operations; it does not depend on a particular
Privy SDK version. Supply those operations from the current official SDK and keep
them outside the domain.

Store wallet IDs and provider mappings, never seeds in ordinary wallet records.
Before any spend, scope the wallet to the verified application subject and check
the network and requested action. A wallet's existence does not establish that a
fiat ramp or KYC capability is enabled.

## First implementation

Create a synthetic wallet adapter and test subject isolation. Then implement one
network with your chosen signer. Show balance synchronization, pending transactions
and fees explicitly. Add a second provider only after both pass the same ownership
and signing contract tests. See [testing](../operations/testing.md).
