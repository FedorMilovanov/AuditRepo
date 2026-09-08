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

## Causal repair

The active SYSTEM owner required strict-native capability completeness after legacy transport removal. The repair establishes current native owners for the four retained families that were previously missing:

1. Antisovetov strategic-map popovers;
2. Antisovetov/Krajne FAQ accordions;
3. heading-anchor copy controls;
4. Gill/Krajne reversible cards.

It does not restore `site.js` or `enhancements.js` to the native series routes.

Exact-head browser falsification also exposed a real responsive ownership leak: the shared historical `data-gill-v16` hook caused legacy touch CSS to hide heading anchors on non-Gill series. The repair narrows that behavior by canonical series identity so non-Gill native heading anchors remain operable while Gill preserves its reviewed mobile treatment.

## Closure-boundary proof

The Product repair adds permanent source/browser contracts:

- `.github/workflows/article-capability-contract.yml`
- `scripts/article-capability-owner-contract.mjs`
- `scripts/article-capability-browser-contract.mjs`
- `src/components/article-pilots/gill-series/GillSeriesResponsiveStyles.astro`
- `src/components/reader-platform/ReaderActionsRuntime.astro`
- `src/runtime/article-capabilities.css`
- `src/runtime/article-faq-accordion.js`
- `src/runtime/article-heading-anchors.js`
- `src/runtime/article-interactions.js`
- `src/runtime/article-reversible-cards.js`
- `src/runtime/article-strategic-map.js`

The owner contract enforces one current native owner per retained family and preserves the no-legacy-transport boundary. The browser contract exercises the retained families in Chromium and WebKit across mobile/desktop behavior, including keyboard activation, Escape/focus restoration and reversible-card semantics.

The exact Product PR scope remained exactly those 11 paths. PR review submissions and review threads were empty immediately before merge.

## Exact-head CI proof

Exact head `87601539e9fe942c41e6a7e58bc9e34ee0a5d6ef` reached terminal admission state with 44 check runs and no remaining `failure`, `queued` or `in_progress` result.

Key closure gates included:

- Article Capability Completeness — success;
- Source Authority Contract — success;
- Shared Files Guard — success;
- Native Source Contract — success;
- Deploy Candidate Contract — success;
- Visual Parity Guard — success;
- Runtime Interactive Audit — success;
- Reader Controls Accessibility — success;
- Reader Projection / Reader Linear Text Projection — success;
- Print Paper Contract — success;
- Scripture Occurrence Index Contract — success;
- Site Sections Menu Contract — success;
- Gill pre-v16 submenu contract — success.

Search Modal Contract initially failed only on a WebKit keyboard-focus assertion while its core Search Modal contract itself passed 8/8 and all source/build stages passed. A same-head rerun was already scheduled; it completed successfully on the unchanged certified SHA. No assertion weakening, code mutation or head movement was used to turn that witness green.

## Merge barrier proof

Immediately before merge:

- live Product `main` remained `fd51f33fe9aa6c1605719e1afae3b54934cb73ca`;
- PR base and merge base were that exact live `main`;
- the PR was mergeable;
- scope remained exactly the 11 declared Article/shared-series paths;
- PR review submissions were empty;
- PR review threads were empty;
- all 44 exact-head checks were terminal with no failure/queued/in-progress result.

The PR was marked Ready only after those conditions held and was merged using the merge method with `expected_head_sha=87601539e9fe942c41e6a7e58bc9e34ee0a5d6ef`, producing merge commit `3c2def019b88069d9e48ba866a3c4287b8e8add3`.

## Current-main carry-forward proof

Compare from certified head `87601539…` to Product merge commit `3c2def01…` reports:

- status: `ahead`;
- ahead by: `1`;
- behind by: `0`;
- merge base: exact certified head;
- changed files: `[]`.

The merge commit tree is therefore identical to the certified candidate tree.

Product `main` then advanced to `d3759918e68e475ab6bdeadc11ff872a3ffa523f` through unrelated document-authority work. Compare from the certified Article head to that current Product `main` reports:

- status: `ahead`;
- ahead by: `3`;
- behind by: `0`;
- merge base: exact certified head;
- only changed path: `scripts/document-authority-audit.mjs`.

None of the 11 Article repair paths changed after certification/merge, so the closure is carried forward to current Product `main`.

## MASTER consequence

`ARTICLE-LEGACY-CAPABILITY-PARTIAL-MIGRATION-ROOT` is removed from active MASTER arithmetic:

- active work units: `3 → 2`;
- direct current defects: remain `0`;
- system verification lanes: `3 → 2`;
- verified necessary improvements: remain `0`;
- narrowed residuals: remain `0`;
- owner decisions: remain `0`.

The two remaining SYSTEM owners are intentionally unchanged:

1. `METADATA-SSOT-PROLIFERATION`
2. `FRAGMENTED-SECURITY-OWNERSHIP`
