# Current-head reverify — `ARTICLE-LEGACY-CAPABILITY-PARTIAL-MIGRATION-ROOT` closure

## Disposition

`FIXED-CURRENT / closed-by-system-product-repair`

This receipt closes only `ARTICLE-LEGACY-CAPABILITY-PARTIAL-MIGRATION-ROOT`. It makes no closure inference about `METADATA-SSOT-PROLIFERATION` or `FRAGMENTED-SECURITY-OWNERSHIP`.

## Anchors

- Reverify date: 2026-09-08
- Product repository: `FedorMilovanov/gb-is-my-strength`
- Product PR: #1851 — `fix(article): restore retained native capability ownership`
- Pre-merge Product `main`: `fd51f33fe9aa6c1605719e1afae3b54934cb73ca`
- Exact certified Product head: `87601539e9fe942c41e6a7e58bc9e34ee0a5d6ef`
- Product merge commit: `3c2def019b88069d9e48ba866a3c4287b8e8add3`
- Current Product `main` witness at reconciliation: `d3759918e68e475ab6bdeadc11ff872a3ffa523f`

## Causal defect

Strict-native migration had removed legacy `site.js` / `enhancements.js` transport from the native article surfaces, but retained semantic capabilities did not all have a native owner. The active missing-owner families were:

1. Antisovetov strategic-map popovers;
2. Antisovetov/Krajne FAQ accordions;
3. heading-anchor copy controls;
4. Gill/Krajne reversible cards.

Exact-head browser testing also exposed a responsive ownership leak: the shared series shell retained the historical `data-gill-v16` hook, and Gill-specific touch CSS could hide non-Gill heading-anchor controls. The repair moved that boundary to canonical series identity instead of restoring legacy transport or weakening the browser witness.

## Causal repair scope

The certified Product head differs from the synchronized pre-merge `main` in exactly 11 Article/shared-series paths:

- `.github/workflows/article-capability-contract.yml`
- `scripts/article-capability-browser-contract.mjs`
- `scripts/article-capability-owner-contract.mjs`
- `src/components/article-pilots/gill-series/GillSeriesResponsiveStyles.astro`
- `src/components/reader-platform/ReaderActionsRuntime.astro`
- `src/runtime/article-capabilities.css`
- `src/runtime/article-faq-accordion.js`
- `src/runtime/article-heading-anchors.js`
- `src/runtime/article-interactions.js`
- `src/runtime/article-reversible-cards.js`
- `src/runtime/article-strategic-map.js`

No Metadata or Security owner files are part of this closure.

## Permanent closure proof

The repair establishes the MASTER closure boundary:

- retained Article capability families have explicit native owners composed through the reader runtime;
- source contract enforces one current native owner per retained family and preserves `legacy transport = 0`;
- browser contract exercises the retained capability families in production-like Chromium/WebKit behavior, including keyboard activation, Escape/focus return, accordion state, heading-anchor copy and reversible-card interaction;
- the browser witness explicitly rejects loading `site.js` or `enhancements.js` on the native Article surfaces;
- shared responsive CSS uses canonical series identity so non-Gill Article controls are not hidden by Gill-only touch styling.

No force-click, arbitrary sleep, legacy transport restoration, assertion weakening, or unrelated owner absorption is part of the repair.

## Exact-head CI proof

All 26 applicable pull-request workflows observed on exact Product head `87601539e9fe942c41e6a7e58bc9e34ee0a5d6ef` completed with `success` before closure:

- Metadata & IndexNow Readiness — `34166411243`
- Gill Final Source Reconciliation — `34166411133`
- Node Toolchain Contract — `34166411147`
- Shared Files Guard — `34166411116`
- Scripture Occurrence Index Contract — `34166411099`
- Favorite Store Contract — `34166411164`
- Article Capability Completeness — `34166411421`
- Native Source Contract — `34166411112`
- Route Registry Validators — `34166411236`
- Search Modal Contract — `34166411294`
- Runtime Interactive Audit — `34166411074`
- Reader Projection Contract — `34166411223`
- Reader Controls Accessibility — `34166411186`
- Bible App Deep Browser Contract — `34166411165`
- Print Paper Contract — `34166411252`
- Reader Linear Text Projection Contract — `34166411194`
- Gill pre-v16 submenu contract — `34166411208`
- Site Sections Menu Contract — `34166411183`
- TTS Reader Polish — `34166411219`
- Editorial Dateline Contract — `34166411329`
- Source Authority Contract — `34166411173`
- TTS Download Consent — `34166411077`
- Glossary Contract — `34166411192`
- Deploy Candidate Contract — `34166411227`
- Overlay Runtime Browser — `34166411298`
- Visual Parity Guard — pixel-diff — `34166411076`

The exact-head Shared Files Guard passed the live lane-collision checks. PR conversation/review comments and review threads were empty at the final barrier.

## Merge and carry-forward proof

Immediately before the Product merge, compare from live `main@fd51f33fe9aa6c1605719e1afae3b54934cb73ca` to certified head `87601539e9fe942c41e6a7e58bc9e34ee0a5d6ef` reported:

- status: `ahead`
- behind by: `0`
- merge base: exact live `main`
- changed files: exactly the 11 declared Article/shared-series paths.

PR #1851 merged as `3c2def019b88069d9e48ba866a3c4287b8e8add3`.

Compare from the certified head to the Product merge reports:

- status: `ahead`
- ahead by: `1`
- behind by: `0`
- merge base: exact certified head
- changed files: `[]`

Therefore the Product merge tree is identical to the exact certified candidate tree.

Product subsequently advanced to `d3759918e68e475ab6bdeadc11ff872a3ffa523f`. Compare from the Article merge to that current `main` reports only one changed file:

- `scripts/document-authority-audit.mjs`

None of the 11 Article repair paths changed after merge. This is current-source carry-forward evidence; it is not presented as an independent live-network deployment measurement.

## MASTER consequence

`ARTICLE-LEGACY-CAPABILITY-PARTIAL-MIGRATION-ROOT` is removed from active MASTER arithmetic:

- active work units: `3 → 2`
- direct current defects: remain `0`
- system verification lanes: `3 → 2`
- verified necessary improvements: remain `0`
- narrowed residuals: remain `0`
- owner decisions: remain `0`

The two remaining SYSTEM owners require their own independent closure evidence and are intentionally unchanged:

1. `METADATA-SSOT-PROLIFERATION`
2. `FRAGMENTED-SECURITY-OWNERSHIP`
