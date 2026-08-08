# Zero direct defects + next-wave re-read — 2026-08-08

## Scope

AuditRepo-only reconciliation after the two remaining verified direct Product defects reached current `main`. No Product mutation in this report.

Product integration anchor after both closures:

`FedorMilovanov/gb-is-my-strength@76ad2f3ff814c088eb429d5ec0edd35d5bbe27b0`

At report creation Product `main` is exactly that SHA.

## Direct defect closure 1 — S-SEC-01

Product PR `#1195` — `SYSTEM: make FAQ JSON-LD plain-text only`.

- exact tested head: `ab6300f5ed745b2cf983681f3564dee3536d4317`;
- squash merge / Product main: `a2d0ce587a3de2f659747151207c9adce31950cd`;
- FAQ JSON-LD `acceptedAnswer.text` now comes from normalized visible `textContent`;
- the detached-DOM tag/attribute blacklist and `innerHTML` read were removed from this text-only schema path;
- permanent adversarial proof lives in existing Shared Files ownership through `scripts/faq-jsonld-text-contract-test.js` — no new permanent workflow;
- the fixture fails if the current owner regresses to `innerHTML` / detached sanitizer behavior.

Exact-head representative successful runs include:

- Shared Files Guard `31225967623` — SUCCESS, including current open-lane collision census;
- Runtime Interactive Audit `31224938646` — SUCCESS;
- Source Authority Contract `31224938609` — SUCCESS;
- Route Registry Validators `31224938656` — SUCCESS;
- Visual Parity `31224938633` — SUCCESS;
- Search Modal Contract `31224938649` — SUCCESS;
- Home SearchAction Contract `31224938617` — SUCCESS.

Disposition: `S-SEC-01` is solved and must leave current MASTER.

## Direct defect closure 2 — NG-INLINE-01

Product PR `#1197` — `fix(nagornaya): tokenize library surfaces across Parts I/II/III/V`.

Security `#1195` merged first. The Nagornaya candidate was then refreshed onto that exact new main instead of reusing pre-security greens.

- final exact tested head: `ae91cbc03dfbe2641a91d7085493753c4e2df444`;
- squash merge / Product main: `76ad2f3ff814c088eb429d5ec0edd35d5bbe27b0`;
- current-main comparison immediately before merge: `behind=0`, net diff exactly 5 files;
- four duplicated `Из библиотеки` presentation owners in Parts I/II/III/V now use existing theme tokens / `color-mix` / `currentColor` rather than the light-only literal palette;
- visible text, hrefs, link order and DOM tag sequence were preserved;
- Part IV remains intentionally without this block;
- permanent owner is the existing `scripts/nagornaya-visual-parity-audit.js`; the temporary transport self-cleaned and is absent from the final net diff.

Final exact-head successful evidence includes:

- fresh edited-state Shared Files Guard `31228200162` — SUCCESS;
- Runtime Interactive Audit `31227773771` — SUCCESS (Home Chromium/WebKit + durable interactive audit);
- Route Registry Validators `31227773763` — SUCCESS (registry contracts, Chromium, WebKit and public-surface matrix);
- Visual Parity `31227773803` — SUCCESS;
- Source Authority Contract `31227773880` — SUCCESS;
- Native Source Contract `31227773796` — SUCCESS;
- Search Modal Contract `31227773819` — SUCCESS;
- Deploy Candidate Contract `31227773810` — SUCCESS.

An older same-SHA Shared Files run `31227773901` was cancelled by the PR-body edit/concurrency mechanism and is superseded by later same-SHA SUCCESS `31228200162`; it is not a Product failure.

Disposition: `NG-INLINE-01` is solved and must leave current MASTER.

## Matrix result

Current verified work changes:

- active work units: **12 → 10**;
- direct current defects: **2 → 0**;
- verified necessary improvements: **4** (unchanged);
- narrowed residuals: **0**;
- system verification lanes: **2** (unchanged);
- owner decisions: **4** (unchanged).

`SYS-STRANGLER-RETIREMENT` remains unchanged by these two defect repairs. The last exact readiness witness remains 35 dependency records / 26 blockers = 16 mechanical repoints + 3 obsolete/remove-or-repoint readers + 7 owner decisions, with unknown/integrity/inventory/parity classes at zero and physical retirement unauthorized.

## Fresh re-read of the four remaining improvements

### AUDIT-CSS-DEAD-KEYFRAMES-TOKENS — confirmed, narrowed to exact current owners

Current Product `76ad2f3f...` still contains both cleanup roots:

1. `css/site.css` declares `@keyframes fx-breathe` twice. The later definition is the effective owner and adds opacity (`.82 → 1 → .82`) while preserving the same scale path; the earlier definition is dead under same-name keyframe replacement semantics.
2. `css/floating-cluster.css` contains two mobile `@media (max-width: 899px)` standalone `.gb-floater` blocks with the same geometry/background/backdrop/z-index declarations. The earlier block additionally preserves legacy `body.fc-single-active` padding; the later block should keep its unique series-lite rules but not repeat standalone `.gb-floater` / dark / `gb-cluster-single-active` declarations.

This is a bounded shared-CSS ownership cleanup, not a visual redesign. The next Product lane should remove only the dead/repeated owners and let canonical asset projection update mutable references; reference-only HTML stays immutable.

### AUDIT-JS-ESCAPER-DUP-X5 — confirmed, implementation needs load-order proof

Fresh current-source re-read still finds five local HTML escapers with the same `& < > "` encoding intent:

- three in `js/site.js`;
- one in `js/highlights.js`;
- one in `js/search.js`.

`js/site-utils.js` still has no canonical shared HTML-escape primitive. BaseLayout and active `404.html` load SiteUtils before site/Search, but the exact `highlights.js` loader boundary must be proven before migration so consolidation does not create a hidden load-order dependency. The implementation must preserve each caller's current input-coercion semantics and keep URL sanitization separate.

### SEARCH-P3-02 — confirmed after merged Search rewrite

Current `js/search.js` still makes results unreachable beyond hard caps:

- Pagefind path: `results.slice(0,10)`;
- manifest/fallback path: `.slice(0,12)`;
- exact Scripture occurrence rendering: `.slice(0,12)` while the status can report the full occurrence count.

No continuation/pagination owner exists. The next Search UX repair should expose a truthful total and allow the user to reach the remaining matches (`Показать ещё`, pagination or equivalent) instead of simply increasing the cap.

### AR-IDX-05 — confirmed parallel identity, likely removable false authority

Current asset identity already lives in `src/lib/asset-version.js` as content hashes used by `assetUrl()` / cache-bust.

Meanwhile:

- `src/layouts/BaseLayout.astro` sets `runtimeConfig.version` from `ASSET_VERSIONS['js/glossary.js']`;
- `HomePageChrome.astro` still hardcodes `SITE_CONFIG.version: 1778943682`;
- active `404.html` hardcodes the same `1778943682`.

Current `js/site.js` directly validates/consumes site/page/features through config access but no direct `SITE_CONFIG.version` consumer was found in the inspected runtime owner. Therefore the next repair should first prove the complete consumer contract; if `version` is compatibility/diagnostic-only, remove the false parallel cache authority instead of synchronizing another number.

## Next engineering order

1. bounded CSS duplicate-owner cleanup (`AUDIT-CSS-DEAD-KEYFRAMES-TOKENS`);
2. shared HTML escaper consolidation after loader/equivalence proof (`AUDIT-JS-ESCAPER-DUP-X5`);
3. truthful Search continuation/result total (`SEARCH-P3-02`);
4. version-authority retirement/consolidation after consumer proof (`AR-IDX-05`).

The two SYSTEM packages and four owner decisions remain separate; do not mix Strangler physical retirement, held-map activation, Bible corpus rights, Genesis 6 publication, hosting headers or Nagornaya editorial density decisions into these implementation lanes.
