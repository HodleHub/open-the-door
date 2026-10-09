# Choose custody deliberately

Custody describes who can access keys and authorize a spend. A common API does not
remove the operational consequences of that choice.

| Model            | Signing boundary                        | Builder responsibilities                                                   |
| ---------------- | --------------------------------------- | -------------------------------------------------------------------------- |
| Client-held keys | User device or approved external signer | Backup, recovery, device security and approval UX                          |
| Embedded wallet  | Provider and user policy                | Verified identity, ownership, provider policy and export/recovery behavior |
| Operator custody | Restricted server signing system        | Key management, access separation, accounting and recovery                 |

## Design questions

Can the operator spend without the user? Can the user recover without the operator?
What happens when the identity provider is unavailable? Which material is stored
on each device? Does a wallet export change the security model? Answer these in
your application's README before exposing real balances.

The starter prompt defaults to provider-neutral signing and mocks. It does not
create a shared master wallet or put a mnemonic in application configuration.
A server custody design must be independently specified and reviewed rather than
inferred from a sample SDK initializer.

## Separate policies

Fiat account access, KYC status and wallet signing policy are separate gates. A KYC
approval cannot bypass the signer's user approval requirement. An authenticated
user cannot spend from another wallet by submitting its provider ID.

Never send private key material through ordinary API routes, logs, prompts or
support exports. If a provider requires sensitive signer material, constrain it
to the documented trusted signing boundary and review its lifecycle.
See [recovery](recovery.md), [secrets](../security/secrets.md) and
[Privy adapter](privy-adapter.md).
