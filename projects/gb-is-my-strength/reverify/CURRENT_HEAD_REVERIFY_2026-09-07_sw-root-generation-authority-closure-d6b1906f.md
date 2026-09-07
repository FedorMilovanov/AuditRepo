# Current-head reverify — `SW-ROOT-GENERATION-AUTHORITY` closure

## Disposition

`FIXED-CURRENT / closed-by-system-product-repair`

This receipt closes only `SW-ROOT-GENERATION-AUTHORITY`. It makes no closure inference about `ARTICLE-LEGACY-CAPABILITY-PARTIAL-MIGRATION-ROOT`, `METADATA-SSOT-PROLIFERATION`, or `FRAGMENTED-SECURITY-OWNERSHIP`.

## Anchors

- Reverify date: 2026-09-07
- Product repository: `FedorMilovanov/gb-is-my-strength`
- Product PR: #1842 — `fix(sw): establish root generation authority`
- Pre-merge Product `main`: `066be4fb24089a549ae3b3089700332586585850`
- Exact certified Product head: `cb63ba35612c6aa97044656e1ed65e29514e4328`
- Product merge commit: `d6b1906f0d263e23b45355bea0460ee00581bc38`
- Current Product `main` witness at reconciliation: `d6b1906f0d263e23b45355bea0460ee00581bc38`

## Causal defect

The active SYSTEM owner represented three coupled root-Service-Worker authority failures:

1. route-local `SITE_CONFIG.version` values could project multiple script identities for the same root-scoped `/sw.js` within one Product release;
2. a successor could share the active generation cache namespace, so failed-successor cleanup was not isolated from the controlling generation;
3. a revisioned static request such as `?v=B` could miss exact B bytes and downgrade to a bare canonical response owned by controlling generation A.

The prior browser/static oracles did not permanently close the third condition because they accepted canonical fallback or proved only `200/nonempty` rather than revision byte identity.

## Causal repair scope

The certified Product head differs from its live pre-merge `main` in exactly 29 physical paths owned by the SW authority repair:

- `.github/workflows/deploy-candidate-contract.yml`
- `404.html`
- `data/offline-route-matrix.json`
- `js/sw-register.js`
- `migration/sw-cache-version-baseline.json`
- `scripts/audit-pro.js`
- `scripts/reader-state-regression-test.js`
- `scripts/sw-dist-readiness-audit.js`
- `scripts/sw-offline-browser-test.mjs`
- `scripts/sw-root-generation-browser-contract.mjs`
- `src/components/about/AboutPageChrome.astro`
- `src/components/article-pilots/_shared/StandaloneArticleFooter.astro`
- `src/components/article-pilots/gill-series/GillSeriesChrome.astro`
- `src/components/article-pilots/hermenevtika/HermenevtikaBody.astro`
- `src/components/articles/ArticlesPageFooter.astro`
- `src/components/baptisty-rossii/BaptistyRossiiBody.astro`
- `src/components/baptisty-rossii/BaptistyRossiiBookLanding.astro`
- `src/components/biografii/BiografiiPageFooter.astro`
- `src/components/home/HomePageChrome.astro`
- `src/components/nagornaya/_shared/NagornayaPageFooterRuntime.astro`
- `src/components/nagornaya/index/NagornayaIndexPageFooter.astro`
- `src/components/nagornaya/istochniki/NagornayaIstochnikiPageFooter.astro`
- `src/components/nagornaya/nakhodki/NagornayaNakhodkiPageFooter.astro`
- `src/components/nagornaya/seriya/NagornayaSeriyaBody.astro`
- `src/components/nagornaya/seriya/NagornayaSeriyaPageFooter.astro`
- `src/components/pastor-series/PastorSeriesPageChrome.astro`
- `src/components/rodosloviye/RodosloviyeBody.astro`
- `src/lib/asset-version.js`
- `sw.js`

The many one-line route/component changes are the mechanical projection of the single root worker registration identity, not independent Product repair owners.

## Repair proof

The repair establishes the closure boundary required by MASTER:

- root registration is one bare `/sw.js` script identity, independent of route-local metadata;
- cache generation advances to `gb-v198-root-generation-authority-20260907`, distinct from the reviewed active v197 generation;
- revision-governed precache entries retain exact `ASSET_VERSIONS` URLs;
- revisioned static offline fallback is exact-request only, so an unseen revision fails closed instead of executing mismatched canonical bytes;
- the static readiness oracle requires exact revision parity, one registration owner, route-independent worker identity, and absence of canonical/search-insensitive revision downgrade;
- the broad A07 Chromium witness proves exact offline `site-utils` SHA-256 identity and rejects an unseen revision;
- the dedicated Chromium A→B witness proves that route-local metadata cannot create worker churn, failed B preserves the same A controller/cache/exact bytes, and valid B retires A before serving byte-identical B offline;
- the lifecycle witness handles already-reached `redundant` and `activating → activated` states rather than masking races with sleeps or repeated reloads.

No fail-open precache, assertion weakening, allowlist bypass, or unrelated Article/Metadata/Security repair is part of this closure.

## Exact-head CI proof

All applicable workflows observed on exact Product head `cb63ba35612c6aa97044656e1ed65e29514e4328` reached terminal success before merge:

- Shared Files Guard — run `34144630782`
- Reader Controls Accessibility — run `34144577096`
- Metadata & IndexNow Readiness — run `34144577090`
- Avraam Reference Baseline — run `34144577123`
- Overlay Runtime Browser — run `34144577008`
- Source Authority Contract — run `34144576806`
- Deploy Candidate Contract — run `34144576979`
- SW Register Accessibility Contract — run `34144577093`
- Node Toolchain Contract — run `34144576894`
- Vosk Loader Failure State — run `34144577086`
- Gill Final Source Reconciliation — run `34144577098`
- Search Scripture Occurrence Runtime — run `34144577055`
- Scripture Occurrence Index Contract — run `34144576858`
- Reader Linear Text Projection Contract — run `34144576964`
- Reader Projection Contract — run `34144576896`
- NoteRegistry Core — run `34144577100`
- Editorial Dateline Contract — run `34144576962`
- Bible App Deep Browser Contract — run `34144577032`
- TTS Download Consent — run `34144577198`
- Visual Parity Guard — pixel-diff — run `34144577023`
- Search Cold Bootstrap Contract — run `34144577130`
- Search Manifest Policy — run `34144577135`
- Diotrophes Wave 12 release — run `34144576892`
- Native Source Contract — run `34144577022`
- Pagefind Landing Body Contract — run `34144576936`
- Glossary Contract — run `34144576959`
- Home SearchAction Contract — run `34144576955`
- Content Source Truth Coverage — run `34144576938`
- TTS SharedWorker Client Lifecycle — run `34144576945`
- Gill pre-v16 submenu contract — run `34144577144`
- Print Paper Contract — run `34144576961`
- Search Modal Contract — run `34144577132`
- Route Registry Validators — run `34144577005`
- Site Sections Menu Contract — run `34144577145`
- Runtime Interactive Audit — run `34144576820`

The broad Deploy Candidate run includes both the A07 offline/PWA witness and the dedicated root-generation A→B Chromium witness.

One earlier duplicate Shared Files Guard run `34144577119` was cancelled; it is not merge-authoritative because the later same-head run `34144630782` completed successfully.

`Search Modal Contract` initially exposed a WebKit focus-semantics failure while its core modal contract passed. Both the failing witness source and `js/search.js` were byte-identical to live `main`, so no SW mutation was made. Exactly one same-SHA diagnostic job rerun was used to test reproducibility; it completed successfully on the unchanged certified SHA. No code/head movement or assertion weakening was used to convert the result.

## Merge barrier proof

Immediately before Product merge:

- live Product `main` remained `066be4fb24089a549ae3b3089700332586585850`;
- compare `066be4fb… → cb63ba35…` reported `behind_by=0`;
- merge base was exactly live `main`;
- logical diff remained exactly the 29 declared SW-authority paths;
- PR reviews were empty;
- PR review threads were empty;
- Article Capability PR #1851 owned 10 separate files and had zero file intersection with #1842;
- Security Ownership PR #1856 owned 5 separate files and had zero file intersection with #1842;
- the PR was mergeable and all applicable exact-head workflows were terminal green.

The Product PR was then merged with `expected_head_sha=cb63ba35612c6aa97044656e1ed65e29514e4328` using the merge method, producing Product merge commit `d6b1906f0d263e23b45355bea0460ee00581bc38`.

## Current-main carry-forward proof

After merge, Product `main` is exactly `d6b1906f0d263e23b45355bea0460ee00581bc38`.

Compare from the certified head to current Product `main` reports:

- status: `ahead`
- ahead by: `1`
- behind by: `0`
- merge base: `cb63ba35612c6aa97044656e1ed65e29514e4328`
- changed files: `[]`

The Product merge commit tree is therefore identical to the exact certified candidate tree. This is a current-source/production-like-artifact carry-forward witness; it is not presented as an independent live-network deployment measurement.

## MASTER consequence

`SW-ROOT-GENERATION-AUTHORITY` is removed from active MASTER arithmetic:

- active work units: `4 → 3`
- direct current defects: remain `0`
- system verification lanes: `4 → 3`
- verified necessary improvements: remain `0`
- narrowed residuals: remain `0`
- owner decisions: remain `0`

The three remaining SYSTEM owners require their own Product repair/current-head evidence and are intentionally unchanged by this reconciliation:

1. `ARTICLE-LEGACY-CAPABILITY-PARTIAL-MIGRATION-ROOT`
2. `METADATA-SSOT-PROLIFERATION`
3. `FRAGMENTED-SECURITY-OWNERSHIP`
