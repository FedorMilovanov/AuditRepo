# CURRENT HEAD REVERIFY — 2026-07-28 — `36cb2cd0` Atlas/Gill release pending

## Status

`SOURCE-MERGED / EXACT-HEAD-CI-VERIFIED / PRODUCTION-WITNESS-PENDING`

## Boundary

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Source PR: #485
- Final exact PR head: `e0b899e1c41f1401d9118433ca12013b97f92d20`
- Source squash merge: `36cb2cd06d9a688c3ef9331c6cd478f1a87b5ec8`
- Source base used by final verification: `b40044713b9fa09e404d5f57b2016d31f4cc88c6`
- AuditRepo base: `e00a57d08c823700435112048b1d73d096b860ff`
- Previously imported production authority: `cd4b77068fabfde05487859f2178ea89ad9b2e43`
- New production authority: **not yet accepted**

Source completion, immutable candidate validation, same-byte Pages promotion, live acceptance and downstream witness recording are separate authorities. This document intentionally keeps the previous production SHA until all release layers bind the new merge SHA.

## Root-cause repair

### Gill reader settings

A transitional script in `GillSeriesChrome.astro` watched the full document for `.reader-setting-btn` and removed every matching control except the mobile launcher. The canonical reader settings sheet legitimately uses the same class for theme, line height and width options, so the cleanup deleted `Шире` and `Сепия` on four series-route families.

The accepted repair does not narrow the deletion selector or add another timing layer. It removes the competing legacy interaction owner from migrated Gill routes:

- `enhancements.js` is absent;
- `ReaderActionsRuntime` is the sole article-interaction owner;
- the global `MutationObserver` is absent;
- no post-render deletion of `.reader-setting-btn` remains;
- a permanent source guard rejects legacy/native coexistence and observer cleanup.

This restores the full canonical settings surface and also removes the competing legacy glossary handler that prevented the historical-context tooltip from materializing.

### Atlas and release evidence

The same lane also closes the remaining publication boundary:

- Atlas no-JS mode reuses the single page heading through `aria-labelledby`;
- the full server-rendered list remains available without JavaScript;
- private relation diagnostics remain outside public `dist`;
- Deploy Candidate repeats Pagefind, publication and public URL contract gates;
- Route Registry and Print Paper explicitly checkout the exact PR source SHA;
- checkout credentials are disabled;
- Print artifacts are named by exact source SHA.

## Final exact-head evidence

All required workflows completed successfully on unchanged source head `e0b899e1c41f1401d9118433ca12013b97f92d20`:

| Contract | Run | Result |
|---|---:|---|
| Shared Files Guard | `30400246023` | success |
| Visual Parity Guard — pixel-diff | `30400245977` | success |
| Print Paper Contract | `30400246011` | success |
| Gill Final Source Reconciliation | `30400245842` | success |
| Branch Hygiene Report | `30400245776` | success |
| Glossary Contract | `30400245877` | success |
| Overlay Runtime Browser | `30400245676` | success |
| Deploy Candidate Contract | `30400245760` | success |
| Editorial Dateline Contract | `30400245617` | success |
| Native Source Contract | `30400245673` | success |
| Route Registry Validators | `30400245833` | success |
| Gill pre-v16 submenu contract | `30400245615` | success |
| Source Authority Contract | `30400245699` | success |
| Runtime Interactive Audit | `30400245645` | success |

Additional merge evidence:

- unresolved review threads: `0`;
- submitted reviews: `0`;
- PR remained mergeable;
- expected-head protection required `e0b899e1…`;
- squash merge result: `36cb2cd0…`;
- no new route, article-content or publication-state change;
- Genesis `draft-noindex` boundary unchanged.

## Production acceptance still required

The automatic main deployment for `36cb2cd0…` must prove:

1. readiness checked out exact release/control-plane SHA;
2. one immutable candidate was built and validated;
3. promotion downloaded the same-run candidate and rebuilt nothing;
4. Pages deployment succeeded;
5. generic live contract passed;
6. TTS capability extension passed;
7. exact-run candidate, generic and TTS artifacts were retained;
8. Deployment Witness Ledger recorded the same run/attempt and SHA;
9. issue #474 closed through the notifier's newer-success transition.

Until these conditions are recorded, this source is accepted but production authority remains `cd4b7706…`.

## Finalization transaction after live witness

Update this document in the same AuditRepo PR with:

- exact deploy run and attempt;
- readiness and promotion job IDs;
- candidate ID, tree digest, bytes and file count;
- candidate transport artifact ID and digest;
- Pages artifact ID and digest;
- generic live artifact ID and digest;
- TTS live artifact ID and digest;
- downstream ledger marker/comment;
- notifier closure evidence for issue #474.

Then advance `NEXT_AGENT_PROMPT.md` and the `MASTER_BUG_MATRIX.md` masthead to the exact accepted production SHA. Do not change counters unless a separately identified canonical bug row is formally closed.
