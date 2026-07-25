# CURRENT HEAD REVERIFY — 2026-07-25 — `f4c60ecb` deterministic font integrity

## Boundary

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Exact source main: `f4c60ecbc15b9a6bd5353f9d1c0d81d2d72b6b3e`
- Exact imported production SHA: `f5e29998c5b42cc9e4e7c917b1e1c1072aa52320`
- AuditRepo base before this reconciliation: `74ad756f5f4a5597d654f80413c505d9e3e4ffc1`
- Source PR: #309, squash merge `f4c60ecbc15b9a6bd5353f9d1c0d81d2d72b6b3e`

Source and production remain separate. This document advances source truth only.

## Production authority retained

Exact `f5e29998` evidence remains unchanged:

- readiness `30169126149` success;
- deploy `30169443420`, attempt 1, success;
- GitHub Pages deployment `5603663894` success;
- Pages artifact `8622641548`, digest `sha256:38a3a138d9f062e43c0e3ed52666113759d310cb0231e2ee388fc522b25e2b2c`;
- TTS artifact `8622642553`, digest `sha256:bacb0330c7a2201289eeeb7d2b9b9dc832106eec292cd890afc1c5819e1eec7f`;
- imported proof artifact `8622690663`, digest `sha256:79d5735bc34978b922ceafb7861ca0f7df386aad5e9c3fa66febbe09df11a0ee`;
- exact live pointer/provenance and captured route/asset/CSP/SW checks PASS.

Historical ledger run `30169981463` remains failure at PR projection. Operator comment `5080203496` is transparent recovery, not automated success. No exact post-merge readiness, Pages, live or downstream witness for `f4c60ecb` is imported here.

## Deterministic font source closure

Issue #302 documented a production-adjacent downloader that could skip unverified files, accept malformed responses, partially write subsets and continue after failures. PR #309 closes that source defect without changing selected font bytes or visible typography.

### Pinned authority

- all 28 tracked WOFF2 files have canonical path, family, style, weight, subset, byte size and SHA-256 records;
- CSS registry and TTF fallback/support files have separate pinned records;
- 25 current exact upstream sources reproduce tracked bytes;
- Noto Serif Greek 400 and Noto Serif Hebrew 400/500 remain explicit upstream drift, not silently accepted replacements.

### Fail-closed production verifier

The verifier performs no network access and rejects:

- missing manifest files or undeclared font files;
- symbolic links;
- malformed/truncated WOFF2 and malformed SFNT/TTF data;
- size or SHA-256 drift;
- unknown CSS/source references;
- omitted registry entries;
- any `@font-face` declaration whose family/style/weight does not match base metadata or one explicit alias;
- undeclared, duplicate, stale or unused aliases.

### Explicit maintainer generator

- fetches only exact declared HTTPS gstatic URLs;
- validates host, redirect chain, status, content type, size and WOFF2 structure;
- aborts the entire refresh when one source is unavailable or drift is not explicitly accepted;
- stages the complete set and swaps the font directory only after next-manifest verification;
- requires `--accept-upstream` for reviewed drift;
- never runs during ordinary readiness/deploy.

The legacy `scripts/download-fonts.js` now exits nonzero. Readiness, deploy and Shared Files Guard run the offline verifier only.

## Review-required regression fixtures

Permanent fixtures prove:

1. Noto Sans Greek and Noto Serif Greek base-plus-alias declarations pass;
2. a wrong second duplicate declaration fails even if the first declaration is correct;
3. unused and duplicate aliases fail closed.

This directly closes the last review residual recorded in the prior marathon journal.

## Exact-head evidence

Clean PR head: `7a035a4287a82086542a12f9c205d84c4a766b8c`

- one commit directly on then-current `main@7b462b96f0e776dbd155e19cd7eb01610499e137`;
- 11 intended SYSTEM/font-integrity files;
- zero commits behind at merge race-check;
- Shared Files Guard `30172960934` PASS, including all 29 steps, deterministic font contracts, all 28 real assets, control-plane audit and actionlint;
- Editorial Metadata v3 `30172960931` PASS;
- TTS Download Consent `30172960928` PASS, including source/mutation contracts, production-like build, real-route Chromium/WebKit matrix and mobile geometry;
- merged only with `expected_head_sha=7a035a4287a82086542a12f9c205d84c4a766b8c`;
- squash merge `f4c60ecbc15b9a6bd5353f9d1c0d81d2d72b6b3e`;
- source issue #302 closed as completed.

## Current owner boundary

At capture the open source owners are:

- PR #336 for the remaining #303 malformed-input redaction/action-pin/real-network evidence boundary;
- PR #338 for the permanent homepage Chromium/WebKit interaction contract under #299.

Do not cross their paths or retain their branch-only temporary materialization files in a final product diff.

## Remaining systemic work

1. Finish #336 and #338 on exact heads.
2. Converge #292/#295 build-once and whole-artifact provenance.
3. Reconcile legacy guessed alerts only with exact same-identity evidence.
4. Complete #301/#64 permission/capability registry.
5. Continue #298, #287 and Research #16 without crossing owners.

## Acceptance

- advance source boundary to `f4c60ecbc15b9a6bd5353f9d1c0d81d2d72b6b3e`;
- close `FONT-PIPELINE-FAIL-OPEN` as source+CI verified;
- add one closed matrix row and increment fixed count `155 → 156`;
- leave P1 count `100` and total-open count `196` unchanged because the R3 font finding was not previously a separate counted open row;
- retain production authority at `f5e29998c5b42cc9e4e7c917b1e1c1072aa52320`;
- retain automated replay observation and whole-release identity/build-once gaps;
- make no claim that `f4c60ecb` is deployed.
