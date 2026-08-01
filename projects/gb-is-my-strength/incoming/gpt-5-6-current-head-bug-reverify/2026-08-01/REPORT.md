# Agent Work Report

## Meta

- **Project:** gb-is-my-strength / gospod-bog.ru
- **Source repo:** `FedorMilovanov/gb-is-my-strength`
- **Agent:** GPT-5.6 Thinking
- **Date:** 2026-08-01
- **Audited starting SHA:** `abf1edba190280e554dfda085bef9fb6594c896d`
- **Current source HEAD at this checkpoint:** `1738f87c9a6deaf9159849dc7f6d25295262f8b1`
- **Mode:** free-intake / current-head reverify

## 1. Reverification summary

The reviewed report contained 15 labels called “100% bugs”. Current-head source, ownership and build evidence does not support that classification.

| Original | Current-head classification | Evidence / action |
|---|---|---|
| BUG-1 unversioned shared Astro CSS | `confirmed-current`, repair in flight | `BaseLayout.astro`, `MapPageHead.astro` and `RodosloviyeStyles.astro` contained direct registered stylesheet URLs. SYSTEM PR #656 centralizes them through `assetUrl()` and expands the read-only drift checker. |
| BUG-2 service-worker cacheFirst crash | `challenge / overclaimed` | Variable shadowing is confusing, but the inner binding does not mutate the outer boolean; `Cache.match()` accepts string or Request. The claimed deterministic offline crash was not demonstrated. Refactor may be technical debt, not repair-ready from this evidence. |
| BUG-3 ReaderRail `1 / 0` | `false-positive for valid config` | `GillSeriesRail.astro` can render the expression syntactically, but `defineSeriesConfig()` fails closed when `partToc` is empty. The reported state is unreachable for accepted production configuration. Do not weaken the existing validator to add a silent empty state. |
| BUG-4 `heartProgress()` unchecked `-1` | `fixed-current` | PR #651, exact head `9e139f73cd35eeae09ff3d3c003f89d94c1e7f44`, passed all 11 triggered workflows and squash-merged as `1738f87c9a6deaf9159849dc7f6d25295262f8b1`. The function now validates through `heartItem()` and has a permanent regression assertion. |
| BUG-5 Atlas runtime 404 in Astro dev | `confirmed-current`, repair in flight | `/map/` loads `/js/atlas-runtime.js`; production-like postbuild materializes it but `astro dev` does not. SYSTEM PR #653 adds a prerendered endpoint backed by the canonical `src/runtime/atlas-runtime.js`; first head exposed a compiled-path error, corrected at exact head `4fea585911b530ae02b6e52a734afc8aefd2c847`. |
| BUG-6 homepage Favorites persistent XSS | `false-positive as production P0; legacy hardening candidate` | `/` is Astro-owned and `HomeSections/Favorites.astro` already creates DOM nodes, assigns text through `textContent`, and validates URLs. The unsafe `innerHTML` survives only in the root legacy reference `index.html`, which is not the production owner under the current strangler contract. Treat as legacy-reference hardening / quarantine evidence, not a live production exploit. |
| BUG-7 relative image normalization | `technical-risk / not reproduced` | Current known input depth normalizes correctly. No current public route or failing artifact was supplied. |
| BUG-8 Astro inline-script hint | `cleanup, not functional defect` | Astro intentionally treats scripts carrying attributes as inline. Adding `is:inline` may make intent explicit, but no broken runtime behavior was established. The CSS part duplicates BUG-1. |
| BUG-9 nondeterministic runtime versions | `confirmed-current`, merged with BUG-1 root cause | `BaseLayout` used `Date.now()` while registered assets use content revisions. PR #656 replaces the runtime version with canonical asset revision data. |
| BUG-10 hard-text chapter/lead href duplication | `future-risk, not current production defect` | Current JSON-LD excludes `tier === 'chapter'`; no duplicate `hasPart` is emitted by the current projection. |
| BUG-11 Atlas runtime outside asset registry | `duplicate of BUG-5` | The runtime is version-controlled under `src/runtime`; the defect is dev/materialization ownership, already owned by PR #653. |
| BUG-12 font/style cache drift | `partly confirmed; merge with BUG-1` | Registered stylesheet URLs were unversioned in several Astro owners. PR #656 covers CSS registry URLs. WOFF2 preload URLs are content-address-stable paths under the separate deterministic font contract and were not independently proven stale. |
| BUG-13 duplicate image viewers | `not reproduced` | `BaseLayout` makes legacy `site.js` and native `ReaderActionsRuntime` mutually exclusive for strict-native articles. No route loading both owners was demonstrated. Keep a regression contract, not a speculative product patch. |
| BUG-14 generic series covers | `editorial / by-design until owner decision` | Shared imagery is present, but no current machine contract requires unique covers. Not a repair-ready code defect. |
| BUG-15 duplicate `hasPart` | `duplicate of BUG-10; title contradicted by source` | Same root cause/risk as BUG-10; current filtering prevents the claimed output. |

## 2. Confirmed repairs

### BH-04 — heart-series progress fails closed

- **Status recommendation:** `fixed-current`
- **Source PR:** `FedorMilovanov/gb-is-my-strength#651`
- **Repair head:** `9e139f73cd35eeae09ff3d3c003f89d94c1e7f44`
- **Merge:** `1738f87c9a6deaf9159849dc7f6d25295262f8b1`
- **Files:**
  - `src/components/article-pilots/_shared/heartSeriesData.ts`
  - `scripts/series-reader-facade-regression-test.js`
- **Evidence:** all 11 triggered exact-head workflows passed; no review comments or unresolved threads.
- **Production claim:** none. Source merge is not live evidence.

## 3. Repairs in flight

### BH-ASSET — deterministic Astro asset revisions

- **Status recommendation:** `repair-ready / in-flight`
- **Source PR:** `FedorMilovanov/gb-is-my-strength#656`
- **Current exact head:** `e86241f212a81c5e894f62a40566116c2adf3cbb`
- **Root causes merged:** BUG-1 + BUG-9 + confirmed portion of BUG-12.
- **Files:** shared layout, asset checker, Atlas head and genealogy styles owner.
- **Notable witness:** the strengthened read-only checker immediately found two additional current leftovers; those owners were repaired on the same lane. Early Shared Files Guard and Metadata checks then passed on the new head. Final browser/build workflows remain required before merge.

### BH-ATLAS-DEV — canonical Atlas runtime in development

- **Status recommendation:** `repair-ready / in-flight`
- **Source PR:** `FedorMilovanov/gb-is-my-strength#653`
- **Current exact head:** `4fea585911b530ae02b6e52a734afc8aefd2c847`
- **Root causes merged:** BUG-5 + BUG-11.
- **Design:** `/js/atlas-runtime.js` is prerendered from the canonical `src/runtime/atlas-runtime.js`; no second runtime implementation.
- **First-head evidence:** registry contract passed; build failed because `import.meta.url` resolved after compilation inside `dist/.prerender`. The path was corrected to repository-root resolution, and a full exact-head rerun is active.

## 4. Challenges / status corrections

### Production XSS wording

The production owner for `/` is the Astro page and safe Favorites component. The legacy root HTML still deserves quarantine/hardening, but calling it a current production P0 misstates route ownership and the strangler build boundary. Recommended canonical status: `false-positive-production-claim` plus a separate legacy-reference hardening proposal under the existing quarantine/system owner.

### Empty ReaderRail state

Adding an empty-state fallback without acknowledging `defineSeriesConfig()` would weaken a useful fail-closed invariant. Recommended canonical status: `false-positive-valid-config`; optional defensive UI belongs to a new owner decision, not a bug fix.

### Duplicate findings

- merge BUG-5 + BUG-11 into one Atlas runtime-delivery item;
- merge BUG-1 + BUG-9 + the stylesheet portion of BUG-12 into one asset revision item;
- merge BUG-10 + BUG-15 into one future schema-projection risk;
- fold the CSS portion of BUG-8 into the asset item.

## 5. Notes for verifier

1. Do not convert this intake directly into “15 fixed bugs”. It supplies current-head status evidence and two live repair lanes.
2. After PRs #653 and #656 merge, append the merge SHAs and exact-head workflow results here or create a successor reverify before moving those items to `fixed-current`.
3. The AuditRepo canonical matrix should count unique root causes, not duplicated report labels.
4. No production/live claim is made for source merges in this intake.
