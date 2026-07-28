# CURRENT HEAD REVERIFY — 2026-07-28 — `36cb2cd0` Atlas/Gill production

## Status

`SOURCE + EXACT-HEAD CI + IMMUTABLE CANDIDATE + PAGES + LIVE + LEDGER VERIFIED`

## Boundary

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Source PR: #485
- Final exact PR head: `e0b899e1c41f1401d9118433ca12013b97f92d20`
- Source squash merge: `36cb2cd06d9a688c3ef9331c6cd478f1a87b5ec8`
- Source base used by final verification: `b40044713b9fa09e404d5f57b2016d31f4cc88c6`
- AuditRepo base: `e00a57d08c823700435112048b1d73d096b860ff`
- Exact production authority: `36cb2cd06d9a688c3ef9331c6cd478f1a87b5ec8`
- Deploy workflow run: `30401217018`, attempt `1`
- Readiness job: `90416223206`
- Promotion job: `90420385359`

Source completion, candidate validation, Pages promotion, live acceptance and downstream witness were verified separately and converge on the same exact release/control-plane SHA.

## Root-cause repair

### Gill reader ownership

A transitional script in `GillSeriesChrome.astro` watched the complete document for `.reader-setting-btn` and removed every matching control except the mobile launcher. The canonical settings sheet legitimately uses that class for theme, line height and width choices, so the cleanup deleted `Шире` and `Сепия` on four route families.

The accepted repair does not narrow the deletion selector or add another timing layer. It removes the competing owner:

- legacy `enhancements.js` is absent on migrated Gill routes;
- `ReaderActionsRuntime` is the sole article-interaction owner;
- the global `MutationObserver` is absent;
- no post-render deletion of `.reader-setting-btn` remains;
- a permanent source guard rejects legacy/native coexistence and observer cleanup;
- canonical theme, sepia, line-height and width controls remain available;
- the historical-context glossary tooltip materializes through the native tooltip owner.

### Relationship Atlas and release evidence

- Atlas no-JS mode reuses the single page heading through `aria-labelledby`;
- the full server-rendered link list remains available without JavaScript;
- private relation diagnostics remain outside public `dist`;
- Deploy Candidate repeats Pagefind, publication and URL-contract gates before main;
- Route Registry and Print Paper explicitly checkout the exact PR source SHA;
- checkout credentials are disabled;
- Print evidence is named by the exact source SHA.

No article text, route state, Genesis authority or `draft-noindex` publication boundary changed.

## Final exact-head source evidence

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

Additional source evidence:

- unresolved review threads: `0`;
- submitted reviews: `0`;
- expected-head protection required `e0b899e1…`;
- squash merge result: `36cb2cd0…`.

## Immutable candidate evidence

Readiness job `90416223206` checked out exact `36cb2cd0…`, installed once, built one production-like `dist`, generated Pagefind, passed publication and URL contracts, Gill audits, runtime smoke and provenance, then uploaded one immutable candidate.

Candidate identity:

- release SHA: `36cb2cd06d9a688c3ef9331c6cd478f1a87b5ec8`;
- control-plane SHA: `36cb2cd06d9a688c3ef9331c6cd478f1a87b5ec8`;
- candidate ID: `36cb2cd06d9a688c3ef9331c6cd478f1a87b5ec8:30401217018-1`;
- tree digest: `sha256:05eed9d5a59d95a9811f00df0a40465932471ad1ddc5cddae7d270d1716c2833`;
- bytes: `80741035`;
- files: `1134`;
- route profiles: `84`;
- HTML files: `83`;
- sitemap routes: `66`;
- Pagefind files: `95`;
- runtime: Node `22.12.0`, npm `10.9.0`.

Candidate transport artifact:

- ID: `8705240254`;
- name: `pages-release-candidate-30401217018-1`;
- uploaded bytes: `80989347`;
- artifact digest: `sha256:202ed0c6a78898a77d3d508a7f1528350013c5cd1f2a004e3997949ed3221e35`.

## Same-byte Pages promotion and live acceptance

Promotion job `90420385359` performed no source checkout, dependency install or build. It downloaded candidate artifact `8705240254`, verified its run/attempt/SHA identity and promoted the same candidate.

Accepted production artifacts:

| Evidence | Artifact ID | SHA-256 |
|---|---:|---|
| GitHub Pages transport | `8705247717` | `1553563b26c0b934c3c4c237f1d1f551dc149c70ba8bf6bd6365b2536e3e54f8` |
| Generic live release | `8705250390` | `23f31f509eec30bd6c83592edca408867456455b7ca8904984666cb3619d6ed8` |
| TTS live extension | `8705250835` | `68a3068b4965ca642c9cef1a09779b631f2166389185816231d93ee8cd50878a` |

The generic live contract verified the release pointer, immutable manifest, build and route identities, Pagefind, sitemap, feed and core assets before the TTS extension verified its own capability surface.

## Downstream ledger and recovery closure

- Deployment Witness Ledger comment: `5110091399` on source PR #485;
- marker: `deployment-release-witness`;
- bound run: `30401217018`, attempt `1`;
- bound candidate: `8705240254`;
- bound generic live: `8705250390`;
- bound TTS live: `8705250835`;
- bound release/control-plane SHA: `36cb2cd0…`;
- machine-owned failure issue #474 closed through a newer-success transition for the same main identity.

## Final verdict

Source main and exact production authority converge at `36cb2cd06d9a688c3ef9331c6cd478f1a87b5ec8`.

The Atlas/Gill production-repair lane is complete:

- no legacy/native duplicate interaction owner remains;
- no observer-based control deletion remains;
- reader settings and glossary behavior are restored and permanently guarded;
- Atlas no-JS semantics remain accessible;
- exact-head source CI, immutable candidate identity, same-byte Pages promotion, generic/TTS live acceptance and downstream ledger all agree.

No operational bug counter changes are justified by this reverify; the canonical matrix counts remain unchanged.
