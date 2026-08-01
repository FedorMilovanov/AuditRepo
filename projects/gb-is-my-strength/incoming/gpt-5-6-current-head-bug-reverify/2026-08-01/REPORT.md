# Agent Work Report

## Meta

- **Project:** gb-is-my-strength / gospod-bog.ru
- **Source repo:** `FedorMilovanov/gb-is-my-strength`
- **Agent:** GPT-5.6 Thinking
- **Date:** 2026-08-01
- **Audited starting SHA:** `abf1edba190280e554dfda085bef9fb6594c896d`
- **Final source HEAD for this reverify:** `be970bfc13882119e99605ba1689605af4a4af8a`
- **Mode:** free-intake / current-head reverify

## 1. Reverification summary

The reviewed report contained 15 labels called “100% bugs”. Current-head source, ownership and build evidence does not support that classification. It resolves to three unique confirmed root causes, all now source-fixed with exact-head CI; the remaining labels are duplicates, unreachable states, future risks, cleanup or owner/editorial decisions.

| Original | Final current-head classification | Evidence / action |
|---|---|---|
| BUG-1 unversioned shared Astro CSS | `fixed-current` | PR #656 routed registered stylesheets in `BaseLayout.astro`, `MapPageHead.astro` and `RodosloviyeStyles.astro` through `assetUrl()` and strengthened the read-only drift checker. Merge `be970bfc13882119e99605ba1689605af4a4af8a`. |
| BUG-2 service-worker cacheFirst crash | `challenge / overclaimed` | Variable shadowing is confusing, but the inner binding does not mutate the outer boolean; `Cache.match()` accepts string or Request. The claimed deterministic offline crash was not demonstrated. Refactor may be technical debt, not repair-ready from this evidence. |
| BUG-3 ReaderRail `1 / 0` | `false-positive for valid config` | `GillSeriesRail.astro` can render the expression syntactically, but `defineSeriesConfig()` fails closed when `partToc` is empty. The reported state is unreachable for accepted production configuration. |
| BUG-4 `heartProgress()` unchecked `-1` | `fixed-current` | PR #651 exact head `9e139f73cd35eeae09ff3d3c003f89d94c1e7f44` passed all 11 triggered workflows and squash-merged as `1738f87c9a6deaf9159849dc7f6d25295262f8b1`. |
| BUG-5 Atlas runtime 404 in Astro dev | `fixed-current` | PR #653 prerenders `/js/atlas-runtime.js` from canonical `src/runtime/atlas-runtime.js`. Exact head `4fea585911b530ae02b6e52a734afc8aefd2c847` passed all 8 triggered workflows; merge `535bff831bcdc2f9eeffdee2f99f1a591a02d348`. |
| BUG-6 homepage Favorites persistent XSS | `false-positive as production P0; legacy quarantine evidence` | `/` is Astro-owned and `HomeSections/Favorites.astro` uses DOM primitives, `textContent` and URL normalization. Unsafe `innerHTML` survives only in root legacy `index.html`, not the production owner. Evidence was attached to source issue #62 in comment `5148492562`. |
| BUG-7 relative image normalization | `technical-risk / not reproduced` | Current known input depth normalizes correctly. No current public route or failing artifact was supplied. |
| BUG-8 Astro inline-script hint | `cleanup, not functional defect` | Astro intentionally treats scripts carrying attributes as inline. No broken runtime behavior was established. Its CSS portion duplicated BUG-1. |
| BUG-9 nondeterministic runtime versions | `fixed-current; merged with BUG-1 root cause` | PR #656 replaced `Date.now()` with canonical asset revision data. Merge `be970bfc13882119e99605ba1689605af4a4af8a`. |
| BUG-10 hard-text chapter/lead href duplication | `future-risk, not current production defect` | Current JSON-LD excludes `tier === 'chapter'`; no duplicate `hasPart` is emitted by the current projection. |
| BUG-11 Atlas runtime outside asset registry | `duplicate of BUG-5; fixed-current` | Runtime is version-controlled under `src/runtime`; dev/materialization ownership was fixed by PR #653. |
| BUG-12 font/style cache drift | `stylesheet portion fixed; remaining font claim unproven` | Registered stylesheet drift was fixed by PR #656. WOFF2 preload paths remain under the separate deterministic font contract and were not independently proven stale. |
| BUG-13 duplicate image viewers | `not reproduced` | `BaseLayout` makes legacy `site.js` and native `ReaderActionsRuntime` mutually exclusive for strict-native articles. No route loading both owners was demonstrated. |
| BUG-14 generic series covers | `editorial / by-design until owner decision` | No current machine contract requires unique covers. Not a repair-ready code defect. |
| BUG-15 duplicate `hasPart` | `duplicate of BUG-10; title contradicted by source` | Current filtering prevents the claimed output. |

## 2. Confirmed source repairs

### BH-04 — heart-series progress fails closed

- **Status recommendation:** `fixed-current`
- **Source PR:** `FedorMilovanov/gb-is-my-strength#651`
- **Repair head:** `9e139f73cd35eeae09ff3d3c003f89d94c1e7f44`
- **Merge:** `1738f87c9a6deaf9159849dc7f6d25295262f8b1`
- **Files:**
  - `src/components/article-pilots/_shared/heartSeriesData.ts`
  - `scripts/series-reader-facade-regression-test.js`
- **Evidence:** all 11 triggered exact-head workflows passed; no review comments or unresolved threads.

### BH-ATLAS-DEV — canonical Atlas runtime in development

- **Status recommendation:** `fixed-current`
- **Source PR:** `FedorMilovanov/gb-is-my-strength#653`
- **Repair head:** `4fea585911b530ae02b6e52a734afc8aefd2c847`
- **Merge:** `535bff831bcdc2f9eeffdee2f99f1a591a02d348`
- **Root causes merged:** BUG-5 + BUG-11.
- **Design:** `/js/atlas-runtime.js` is prerendered from canonical `src/runtime/atlas-runtime.js`; no second runtime implementation.
- **Evidence:** first head exposed and documented a compiled-path failure; corrected head passed all 8 triggered workflows, including production-like Chromium/WebKit public surfaces, Visual Parity, Native Source, Route Registry and Deploy Candidate.

### BH-ASSET — deterministic Astro asset revisions

- **Status recommendation:** `fixed-current`
- **Source PR:** `FedorMilovanov/gb-is-my-strength#656`
- **Repair head:** `e86241f212a81c5e894f62a40566116c2adf3cbb`
- **Merge:** `be970bfc13882119e99605ba1689605af4a4af8a`
- **Root causes merged:** BUG-1 + BUG-9 + confirmed stylesheet portion of BUG-12.
- **Files:** shared layout, read-only asset checker, Atlas head and genealogy stylesheet owner.
- **Evidence:** the strengthened checker immediately found two additional current leftovers; both were repaired on the same lane. Exact head passed all 12 triggered workflows, including Shared Files Guard, Runtime Interactive, Print, Chromium/WebKit route matrix, Visual Parity, Native Source, metadata and Deploy Candidate contracts.

## 3. Challenges / status corrections

### Production XSS wording

The production owner for `/` is the Astro page and safe Favorites component. The legacy root HTML still deserves quarantine/hardening, but calling it a current production P0 misstates route ownership and the strangler build boundary. Current-head evidence is recorded under existing SYSTEM issue #62, comment `5148492562`, and should remain a legacy-reference quarantine item rather than a homepage emergency.

### Empty ReaderRail state

Adding an empty-state fallback without acknowledging `defineSeriesConfig()` would weaken a useful fail-closed invariant. Recommended canonical status: `false-positive-valid-config`; optional defensive UI requires a separate owner decision.

### Duplicate findings

- BUG-5 + BUG-11 were one Atlas runtime-delivery root cause;
- BUG-1 + BUG-9 + the stylesheet portion of BUG-12 were one asset revision root cause;
- BUG-10 + BUG-15 are one future schema-projection risk;
- the CSS portion of BUG-8 duplicated the asset item.

## 4. Final disposition

For this 15-label report at source HEAD `be970bfc13882119e99605ba1689605af4a4af8a`:

- **unique confirmed root causes open:** `0`;
- **unique confirmed root causes source-fixed:** `3`;
- **duplicate labels:** merged into their root causes;
- **current production false-positive claims:** corrected;
- **unreproduced risks / cleanup / editorial decisions:** not misreported as fixed bugs.

This is a source/CI closure only. No production/live state is claimed by this intake.

## 5. Notes for verifier

1. Do not convert this intake into “15 fixed bugs”; count three unique confirmed root causes.
2. Canonical matrix transitions remain verifier-owned.
3. A later source merge does not invalidate these exact-head source/CI witnesses, but it does require a new current-head reverify before claiming present source or production equivalence.
4. Production closure requires separate deploy/live evidence.
