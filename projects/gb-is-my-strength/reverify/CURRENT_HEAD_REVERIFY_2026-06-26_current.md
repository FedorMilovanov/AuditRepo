# Current HEAD Reverify — 2026-06-26 — current clone

## Meta
- Project: gb-is-my-strength
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Date: 2026-06-26
- Verifier: `arena-agent`
- Method:
  - fresh source clone in Arena workspace
  - Node 22.12.0 runtime bootstrap per `SANDBOX-ENV-2026-06-21.md`
  - `npm ci`
  - `npm run strangler:build:production-like`
  - `npm run validate:static-publication:light`
  - targeted source/build grep checks
- Evidence labels used below:
  - `verified-source`
  - `verified-build`
  - `verified-production-like-dist`

> Note: no push credentials were used during verification. Any PAT sent in open chat must be treated as compromised and rotated before write access is used.

---

## Executive Summary

This reverify shows that the source repo is currently **buildable and gate-green in light production validation**, but the canonical bug truth in AuditRepo has **partially drifted**.

Main conclusions:

1. **Production-like build works** on current HEAD with Node 22.12.0.
2. **`validate:static-publication:light` passes**.
3. Several previously reported defects are still valid on source/build evidence.
4. At least one major class of bugs — broad Astro stale-hash breakage — appears **mitigated by postbuild convergence** and needs **severity/status recalibration**, not blind carry-forward.
5. There are still confirmed metadata and UX inconsistencies worth keeping in the ledger.

---

## Verified environment and build truth

### E1 — production-like build passes
- Status: `confirmed-current`
- Witnesses:
  - `verified-build`: `npm run strangler:build:production-like` completed successfully.
  - `verified-build`: Astro generated 52 static routes and `copy-legacy-to-dist` completed.
- Evidence:
  - Astro build completed.
  - `astro-cache-bust-postbuild.js` reported: `dist/ hash drift → 0`.

### E2 — light publication gate passes
- Status: `confirmed-current`
- Witnesses:
  - `verified-build`: `npm run validate:static-publication:light` passed.
  - `verified-source`: no blocking errors in validate/SEO/ownership/content parity checks.
- Evidence:
  - `validate:all` PASS
  - `seo-audit` PASS
  - route profiles / migration matrix / content source coverage PASS

---

## Reverified bug statuses

## Still valid / confirmed-current

### R-2026-06-26-01 — BaseLayout cache policy asymmetry
- Maps to prior ledger: **P1-17**
- Status: `confirmed-current`
- Severity: **P1**
- Evidence:
  - `verified-source`: `src/layouts/BaseLayout.astro` loads CSS via plain `<link rel="stylesheet" href="/css/site.css" />` style paths.
  - `verified-source`: same file loads JS via `scriptTag('js/site.js')` / `scriptTag('js/search.js')`, which append MD5 `?v=` hashes.
- Why it matters:
  - CSS and JS use different cache invalidation contracts.
  - This increases stale CSS risk under SW/browser caching and weakens predictability.
- Recommendation:
  - keep in ledger as real bug.

### R-2026-06-26-02 — split asset registries between cache-bust and SW precache
- Maps to prior ledger: **P0-7 / P0-8 / P1-18 / P2-10 family**
- Status: `confirmed-current`
- Severity: **P1** as architectural defect; individual stale-cache incidents need route-specific proof
- Evidence:
  - `verified-source`: `scripts/cache-bust.js` has a hand-maintained `ASSETS` list.
  - `verified-source`: `sw.js` has a separate hand-maintained `PRECACHE_ASSETS` list.
  - `verified-source`: both lists include overlapping assets such as `css/site.css`, `js/site.js`, `js/floating-cluster-controller.js`, but there is no single canonical registry.
- Why it matters:
  - manual duplication creates drift risk even when current entries overlap.
  - the defect is the split source of truth itself.
- Recommendation:
  - keep as canonical architectural bug even if some earlier route-specific examples are now stale.

### R-2026-06-26-03 — Karty OG image build-time unresolved warning
- New finding
- Status: `confirmed-current`
- Severity: **P2**
- Evidence:
  - `verified-source`: `src/components/karty/KartyPageHead.astro` references `og-karty-1200x630.webp` in meta tags and inline CSS background URL.
  - `verified-build`: Astro/Vite emitted warning: `../images/og-karty-1200x630.webp referenced ... didn't resolve at build time, it will remain unchanged to be resolved at runtime`.
  - `verified-production-like-dist`: output still contains the OG image path and inline CSS URL.
- Why it matters:
  - build does not fully own this asset resolution path.
  - increases fragility for preview/runtime environments.
- Recommendation:
  - add as new medium-severity build correctness issue.

### R-2026-06-26-04 — title / og:title inconsistency remains on live source
- New verifier synthesis based on existing validators
- Status: `confirmed-current`
- Severity: **P2**
- Evidence:
  - `verified-build`: `validate.js --strict` warns:
    - `20-antisovetov-pastoru`: `<title>` differs from `og:title`
    - `rimlyanam-7-veruyushchiy-ili-neveruyushchiy`: `<title>` differs from `og:title`
  - `verified-build`: `contract:compare` also reports title drift for 3 public URLs.
- Why it matters:
  - metadata contract is inconsistent.
  - can produce confusing snippets and drift from baseline.
- Recommendation:
  - add/keep as metadata consistency bug.

### R-2026-06-26-05 — feed.xml weekday/timezone correctness issue remains
- Maps to prior ledger: **P2-6** and prior reverify `V2-4 / NEW-5`
- Status: `confirmed-current`
- Severity: **P2**
- Evidence:
  - `verified-source`: `feed.xml` pubDates include multiple UTC entries.
  - `verified-source`: sampled dates still show values previously flagged, e.g. multiple `Fri, 01 May 2026 00:00:00 +0000` and UTC-based weekday/date combinations.
- Why it matters:
  - repository policy/documentation emphasizes Moscow/publication date consistency.
- Recommendation:
  - keep open.

### R-2026-06-26-06 — GBS2 theme wiring gap remains
- Maps to prior ledger: **P1-13 / P1-14 / P1-15 family**
- Status: `confirmed-current`
- Severity: **P1**
- Evidence:
  - `verified-source`: `src/layouts/SeriesArticleLayout.astro` contains `data-gbs2-theme` and `gbs2-sheet` markup.
  - `verified-source`: `js/modules/theme.js` does **not** contain `data-gbs2-theme` handling.
  - `verified-source`: no evidence found of wiring for progress markers `gbs2Curbar/gbs2Count/gbs2Pct` in `SeriesArticleLayout`, supporting prior “incomplete GBS2 wiring” class.
- Why it matters:
  - controls exist in markup without matching controller logic.
- Recommendation:
  - keep the GBS2 wiring bugs open until browser witness proves otherwise.

### R-2026-06-26-07 — Hermeneutics readTime mismatch still present in built artifact
- Maps to prior ledger: **PS-06 / P1-7 related**
- Status: `confirmed-current`
- Severity: **P1**
- Evidence:
  - `verified-production-like-dist`: `dist/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/index.html` contains `data-pagefind-meta="readTime"`.
  - `verified-production-like-dist`: same output contains visible `50 мин`.
  - `verified-production-like-dist`: same output still contains `35`, consistent with prior hidden/visible drift report.
- Why it matters:
  - visible and hidden metadata can diverge.
- Recommendation:
  - keep open pending exact root-cause patch.

### R-2026-06-26-08 — Nagornaya font control selector mismatch likely still open
- Maps to prior ledger: **V2-2 / NEW-3**
- Status: `likely-current`
- Severity: **P1**
- Evidence:
  - `verified-source`: `nagornaya/chast-1/index.html` contains `id="nagFontDec"`.
  - `verified-source`: the same file does not contain `.nag-fontsize-btn`.
  - `verified-source`: `js/site.js` does not contain `nag-fontsize-down`, `nag-fontsize-up`, or `data-fontsize` markers expected by earlier fix narrative.
- Why only likely-current:
  - this pass confirms selector drift at source level, but does not yet include browser witness.
- Recommendation:
  - keep open and prioritize for browser confirmation.

---

## Needs recalibration / downgrade / conflict review

### R-2026-06-26-09 — broad Astro stale-hash breakage is no longer safe to treat as blanket P0/P1 truth
- Maps to prior ledger: **P0-10**, plus related **P1-12 / P2-16 / PS-05 class**
- Status: `disputed-by-current-build` / `needs-ledger-recalibration`
- Severity recommendation: downgrade the blanket statement; split route-specific issues from root-cause architecture
- Evidence:
  - `verified-build`: production-like build runs `astro-cache-bust-postbuild.js`.
  - `verified-build`: script reports `Files touched: 36`, `Hash replacements: 527`, `dist/ hash drift → 0`.
  - `verified-build`: `validate:static-publication:light` passes afterward.
- Interpretation:
  - the root-cause smell (hardcoded hash culture in source/components) may still exist,
    but the previously stated impact “36 components never get hash updates” is no longer safe as a current-head blanket runtime claim.
  - current truth appears to be: **postbuild convergence mitigates or masks much of this class in dist**.
- Recommendation:
  - split into:
    1. architectural root-cause bug (manual hash embedding / postbuild dependence), and
    2. only route-specific stale-hash bugs that can still be reproduced on current build.

### R-2026-06-26-10 — prior Karty stale CSS hash claim appears outdated in current output
- Maps to prior ledger: **P1-12 / P2-16**
- Status: `stale-on-current-build` for the specific `?v=202876c3 should be b880b524` claim
- Evidence:
  - `verified-production-like-dist`: `dist/karty/index.html` loads `../css/site.css?v=b880b524`.
  - prior ledger’s exact stale-hash example is therefore not current in the built artifact.
- Recommendation:
  - archive or rewrite this bug as historical/example evidence under the broader hash-system defect, not as current route-level truth.

---

## Not reproduced in this pass / no promotion

### R-2026-06-26-11 — duplicate IDs `gbsTheme` / `gbsSearch`
- Maps to prior ledger: **PS-07**
- Status: `not-promoted` (prior docs already suggested fixed-current; this pass did not find contrary evidence)
- Comment:
  - no current evidence in this pass to re-open.

### R-2026-06-26-12 — qs crash / premium controller fatal
- Maps to prior ledger: **PS-01**
- Status: `not-promoted` (prior reverify already moved toward fixed-current; this pass did not reproduce)
- Comment:
  - no current evidence in this pass to re-open.

---

## Additional verifier observations

### O1 — current source is healthier than the canonical ledger suggests
- build works
- light production gate passes
- many former high-severity claims need route-by-route revalidation

### O2 — current process risk is canonical truth drift
The biggest non-code defect is ledger drift:
- old bugs remain phrased as present tense truths even when the current production-like build partially mitigates them;
- implementation notes and current HEAD status are spread across multiple docs;
- verifier work should now focus on cleaning canonical status, not only adding more raw findings.

### O3 — Node 22 remains a hard environment requirement
- current source needs Node 22.12.0 for truthful Astro verification in Arena.
- audits run under Node 20 are at high risk of false negatives/false build failure narratives.

---

## Recommended ledger actions

1. **Keep open / confirmed-current**
   - P1-17 BaseLayout CSS-vs-JS hash asymmetry
   - GBS2 wiring family (P1-13 / P1-14 / P1-15)
   - feed.xml date correctness (P2-6)
   - Hermeneutics readTime drift (PS-06 family)
   - title/og:title mismatch (new metadata bug)
   - split asset-registry source-of-truth bug (P0-7/P0-8/P1-18 family, severity recalibrated to architectural P1 unless route-level stale proof exists)

2. **Downgrade / rewrite**
   - P0-10 blanket stale-hash runtime claim → rewrite as architectural/manual-hash + postbuild-dependence defect

3. **Mark stale-on-current-build for exact examples**
   - P1-12 / P2-16 exact Karty stale hash example (`202876c3`) no longer true in built artifact

4. **Add new issues**
   - Karty OG image unresolved-at-build warning
   - title/og:title mismatch as explicit ledger item if not already canonicalized

---

## Suggested next verifier step

To complete the current-head truth pass, run browser witnesses for:
- Nagornaya font controls
- GBS2 theme/search/share/offline controls
- Avraam skip-link target
- route-level TOC sheet behavior

These are the highest-value unresolved UX/runtime items after the current source/build pass.
