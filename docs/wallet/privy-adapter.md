# Privy behind an adapter

Privy is an optional identity/wallet implementation. Keep its SDK imports,
verification, identity lookup and wallet ownership rules at the boundary. The rest
of the application should use opaque subjects and the wallet port.

## Account and documentation access

Open [Privy docs](https://docs.privy.io/) and use its dashboard path to create your
own application. Configure permitted origins, authentication methods and wallet
policies for your product. Read the current server SDK and wallet documentation
before choosing an SDK version. Keep server secrets outside browser builds.

Use the [access-token verification documentation](https://docs.privy.io/authentication/user-authentication/access-tokens)
to implement backend authentication. Project the verified external subject into an
application subject. Never trust a DID, email or wallet ID supplied in the request
body as proof of identity.

## Adapter implementation

[createPrivyWalletAdapter.ts](../../templates/wallet/createPrivyWalletAdapter.ts)
receives three trusted functions: verify ownership, resolve a wallet and submit an
approved intent. Implement these with your selected SDK. The template checks
context and network before invoking the submit boundary; it intentionally has no
Privy HTTP endpoints or credentials.

Maintain an explicit provider binding between application wallet and external
wallet. On every signing request, recheck ownership or the provider's authoritative
policy. Decode transaction effects before submitting.

## Migration

A replacement provider implements the same domain port, but custody migration
requires a separate user-approved procedure. Do not silently move keys or balances.
Test the new adapter with the same isolation suite and document recovery/export
behavior in [wallet recovery](recovery.md).
