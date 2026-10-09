# Publish the kit safely

The repository stays private until a maintainer explicitly changes visibility.
Preparing docs or running the build prompt must not publish it automatically.

## Content gate

Review the full inventory and diff. Keep only original templates, public integration
instructions and synthetic examples. Confirm there are no customer records,
biometric artifacts, screenshots, receipts, private operational documents,
credentials, proprietary provider arrangements or internal infrastructure addresses.

Link public provider documentation rather than importing private implementation
files. Preserve external licenses when adapting a public example. The kit's MIT
license covers its original content, not external services or every dependency.

## History gate

Start from an independent repository with fresh history. Do not fork, mirror or
copy private git objects/remotes into a release repo. Inspect every reachable
commit, including messages and file names. Run both working-tree and history
secret scans using redacted output. Removing a file from HEAD is insufficient.

## Reproducibility gate

Run `npm ci` and `npm run check` from a clean checkout. Verify relative links and
setup commands. Record which adapters were checked with mocks and which had actual
provider-approved integration validation. Do not advertise mock success as live
settlement or claim a percentage of another product was released without evidence.

## Release action

After completing the gate, review the exact repository contents and visibility
change with the authorized maintainer. Update status wording and enable the
appropriate contribution/security-report settings. Any exposed secret must be
revoked before proceeding. Read [PII](pii.md) and [secrets](secrets.md).
