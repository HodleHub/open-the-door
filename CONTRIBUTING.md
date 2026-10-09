# Contributing

Prefer a small template with an explanatory manual over a copied application
module. A contribution should teach one capability, show its input and output,
and describe how to verify it without customer data.

## Before writing

Read [architecture boundaries](docs/architecture/boundaries.md) and
[template conventions](templates/README.md). Check the provider's official docs
and note any endpoint/version assumptions in the relevant manual. Do not use a
private integration's undocumented behavior as a public API guarantee.

## Pull request contents

Describe the builder problem and resulting behavior. Include the public source
link, configuration needed, failure handling and validation. Use synthetic fixtures
and reserved example domains. Avoid screenshots of provider consoles: they often
contain account IDs, credentials and identity information.

Run `npm run check`. It checks relative documentation links, TypeScript, repository
hygiene and synthetic tests. Run `gitleaks dir . --redact` locally when available.
Review the complete staged diff and history before sharing. A secret scanner does
not establish that a document is free of personal data.

## Documentation quality

A manual must identify prerequisites, explain account/documentation access, define
the flow and distinguish request acceptance from final settlement. Include recovery
for timeouts and at least one negative validation case. Prefer links to source
pages over reproducing entire provider specifications.

## Licensing and reports

Contributions of original code/prose are under [MIT](LICENSE). External SDKs and
services keep their own licenses and terms. For a security issue, follow
[SECURITY.md](SECURITY.md); do not open a public issue containing exploit tokens or
customer evidence. Maintainers control the eventual public release.
