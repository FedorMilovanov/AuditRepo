# Agent Audit Report — latest HEAD verification (`7ac9188`)

## Meta
- Project: `gb-is-my-strength`
- Source repo: `https://github.com/FedorMilovanov/gb-is-my-strength`
- Agent: `arena-agent-latest-head-verifier`
- Date: 2026-06-26
- Audited branch: `main`
- Audited SHA: `7ac9188`
- Current HEAD at start: `7ac9188 [LANE lane/system-release-gate-green-2026-06-26] restore map visual parity`
- Current HEAD at end: `7ac9188`
- Environment: Arena sandbox; Node `v20.20.2`; npm `10.8.2`; Astro build run with Node 22 through `npx -y node@22`; Playwright Chromium + deps installed
- Build mode: source/static + fresh production-like dist
- Browser/device: Playwright Chromium, mobile viewport 390×844; all 43 public routes crawled after JS hydration

---

## Executive Summary

Latest source HEAD `7ac9188` keeps the **source/static publication gate green**:

```text
npm run validate:static-publication:light ✅
```

But fresh production-like dist and hydrated runtime checks are **not green**:

```text
node scripts/dist-publication-audit.js --require-pagefind --forbid-dev ❌
contract:compare:dist ❌
dist JSON-LD parse ❌
runtime duplicate-id crawl ❌
```

The biggest new regression after `7ac9188` is `/map/`: the source lane restored map visual parity, but the public `map/index.html` in dist now has no Pagefind body and `dist-publication-audit` fails.

## Current status table

| ID | Severity | Status on `7ac9188` | Summary |
|---|---:|---|---|
| `LHV-001` | P0/P1 | confirmed-current | `/map/` is public/indexable but missing required Pagefind body; `dist-publication-audit` fails. |
| `LHV-002` | P1 | confirmed-current | `/karty/avraam/` dist word-count contract still fails: 594 → 23. |
| `LHV-003` | P1 | confirmed-current | `/karty/ishod/` dist JSON-LD still invalid. |
| `LHV-004` | P1 | confirmed-current | Runtime glossary hydration creates duplicate `gtip-luxury-*` ids on 12 public pages. |
| `LHV-005` | P1 | confirmed-current | Krajne/Rimlyanam still render PremiumControls (`gb-ember`/`gb-save`) without `[data-fc-root]`/`[data-fc-controls]`. |
| `LHV-006` | P1 | confirmed-current | Baptisty structured data still lacks BreadcrumbList + Article dates; SVG OG still used. |
| `LHV-007` | P0/P1 | confirmed-current | Public content corruption remains: U+FFFD in Antisovetov; corrupted Scripture strings in Hermeneutics. |
| `LHV-008` | P1 | confirmed-current | Migration metadata strict gate is green while 13 modes are undefined and 15 profiles mismatch matrix. |
| `LHV-009` | P1 | confirmed-current | Deploy/workflow gates still don't enforce `contract:compare:dist` or dist JSON-LD parse. |

---

## 1. New Findings

### Finding `LHV-001`

- Title: `/map/` is public/indexable in production-like dist but missing required Pagefind body; `dist-publication-audit` fails
- Severity: **P0/P1** — production-like deploy/readiness blocker after `7ac9188`
- Route(s): `/map/`
- Source file(s): `src/pages/map/index.astro`, `src/components/map/*`, `scripts/dist-publication-audit.js`, Pagefind artifact
- Observed on SHA: `7ac9188`
- Repro steps:
  1. Build fresh production-like dist.
  2. Run `node scripts/dist-publication-audit.js --require-pagefind --forbid-dev`.
  3. Inspect Pagefind indexed pages / hydrated public crawl.
- Expected: public baseline route `/map/` should contribute a `data-pagefind-body` or be intentionally noindex/excluded.
- Actual:
  ```text
  ✅ Pagefind page_count matches data-pagefind-body pages (42)
  ❌ Pagefind source pages missing required public body: map/index.html
  ❌ dist publication audit failed: 1 issue(s)
  ```
  Runtime crawl also measured `/map/` with `pagefindWords = 0`.
- Evidence:
  - `evidence/05-dist-publication-sw-workflows-7ac9188.log`
  - `evidence/10-runtime-crawl-summary-7ac9188.log`
- Confidence: high
- Verification level: L2/direct production-like dist evidence
- Suggested repair lane: `lane/map-pagefind-body-visual-parity-safe-2026-06-26`
- Do not mix with: visual redesign of `/map/`
- Suggested fix: add a visually non-disruptive `data-pagefind-body` semantic text block or dedicated hidden-but-indexable summary preserving visual parity; then add a guard for `/map/` Pagefind coverage.

---

### Finding `LHV-002`

- Title: `/karty/avraam/` dist word-count contract still fails after latest map parity restore
- Severity: **P1**
- Route(s): `/karty/avraam/`
- Source file(s): `src/components/karty/avraam/AvraamMap.astro`, `data/public-content-baseline.json`, URL contract scripts
- Observed on SHA: `7ac9188`
- Repro steps:
  ```bash
  npm run contract:extract:dist && npm run contract:compare:dist
  ```
- Expected: public production-like route matches baseline word floor or has explicit app-route exception.
- Actual:
  ```text
  ❌ word-count drop: https://gospod-bog.ru/karty/avraam/ 594 → 23 (floor 427)
  ```
- Evidence: `evidence/03-dist-contract-7ac9188.log`
- Confidence: high
- Verification level: L2/direct production-like dist evidence
- Suggested repair lane: `lane/karty-avraam-indexable-body-contract-2026-06-26`
- Do not mix with: visual map redesign
- Suggested fix: add accessible/indexable route description/stages text or explicitly update baseline with owner-approved app-route exception.

---

### Finding `LHV-003`

- Title: `/karty/ishod/` dist JSON-LD still invalid on latest HEAD
- Severity: **P1**
- Route(s): `/karty/ishod/`
- Source file(s): `src/components/karty/ishod/IshodPageHead.astro`
- Observed on SHA: `7ac9188`
- Repro steps: parse all dist JSON-LD blocks after fresh production-like build.
- Expected: 0 parse errors.
- Actual:
  ```text
  JSON-LD errors: 1
  dist/karty/ishod/index.html block 1: Expected ',' or ']' after array element in JSON at position 344
  ```
- Evidence: `evidence/04-dist-jsonld-7ac9188.log`
- Confidence: high
- Verification level: L2/direct production-like dist evidence
- Suggested repair lane: `lane/karty-ishod-jsonld-dist-audit-2026-06-26`
- Do not mix with: MapEngine UI changes
- Suggested fix: fix extra brace in `IshodPageHead.astro` or generate JSON-LD with object + `JSON.stringify`; add dist JSON-LD parse gate.

---

### Finding `LHV-004`

- Title: Runtime glossary hydration creates duplicate `gtip-luxury-*` ids on 12 public routes
- Severity: **P1** — live DOM accessibility correctness; static duplicate-id audit blind spot
- Route(s): 12 confirmed public routes:
  - Gill part 1/2/3
  - Krajne
  - 8 Baptisty article pages sampled by full public crawl
- Source file(s): likely `js/site.js` / `js/glossary.js` tooltip hydration logic
- Observed on SHA: `7ac9188`
- Repro steps:
  1. Serve production-like `dist/`.
  2. Crawl all 43 public routes with Playwright mobile viewport.
  3. Wait for JS hydration.
  4. Collect duplicate `id` values and `aria-describedby` references.
- Expected: no duplicate ids after JS hydration; every `aria-describedby` points to a unique tooltip id.
- Actual summary:
  ```text
  duplicate-id routes 12
  /articles/dzhon-gill-chast-1-chelovek/ dupCount 7, ariaRefs 11
  /articles/krajne-li-isporcheno-serdce/ dupCount 11, ariaRefs 21
  /baptisty-rossii/noch-na-kure/ dupCount 1, ariaRefs 2
  ...
  ```
- Evidence:
  - `evidence/09-runtime-crawl-public-pages-7ac9188.json`
  - `evidence/10-runtime-crawl-summary-7ac9188.log`
- Confidence: high
- Verification level: L3/browser runtime evidence on production-like dist
- Suggested repair lane: `lane/glossary-runtime-unique-id-guard-2026-06-26`
- Do not mix with: tooltip visual redesign
- Suggested fix: replace per-root/per-run tooltip id indexing with a document-global monotonic counter; add a post-hydration duplicate-id runtime audit.

---

### Finding `LHV-005`

- Title: Heart-series PremiumControls remain visible without controller root/controls ownership
- Severity: **P1**
- Route(s):
  - `/articles/krajne-li-isporcheno-serdce/`
  - `/articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/`
- Source file(s): `KrajneBody.astro`, `Rimlyanam7Body.astro`, `js/floating-cluster-controller.js`
- Observed on SHA: `7ac9188`
- Repro steps: public runtime crawl after hydration.
- Expected: visible `.gb-ember`/`.gb-save` controls are under `[data-fc-root]` or `[data-fc-controls]` so the controller initializes them.
- Actual:
  ```text
  premium controls without fc root/controls 2
  - /articles/krajne-li-isporcheno-serdce/ ember 1 save 1 body gbs-world
  - /articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/ ember 1 save 1 body gbs-world
  ```
- Evidence: `evidence/10-runtime-crawl-summary-7ac9188.log`
- Confidence: high source/runtime classification; direct click semantic still should be verified in repair lane
- Verification level: L2/L3 hybrid runtime DOM evidence
- Suggested repair lane: `lane/premiumcontrols-heart-series-wiring-2026-06-26`
- Do not mix with: hard-texts content/layout rewrite

---

### Finding `LHV-006`

- Title: Baptisty structured data and OG social images remain incomplete in production-like dist
- Severity: **P1**
- Route(s): `baptisty-rossii/` hub + 10 article pages
- Source file(s): Baptisty `*PageHead.astro`, SVG cover assets
- Observed on SHA: `7ac9188`
- Repro steps: parse production-like dist Baptisty article JSON-LD and `og:image:type`.
- Expected: Article JSON-LD dates + BreadcrumbList; WebP/JPG social images.
- Actual:
  ```text
  TOTAL { articlePages: 10, missingDates: 10, missingBreadcrumbList: 10, svgOg: 11 }
  ```
- Evidence: `evidence/07-baptisty-structured-7ac9188.log`
- Confidence: high
- Verification level: L2/direct dist evidence
- Suggested repair lane: `lane/baptisty-structured-data-og-polish-2026-06-26`
- Do not mix with: Baptisty article body edits

---

### Finding `LHV-007`

- Title: Public content corruption still present on latest HEAD
- Severity: **P0/P1**
- Route(s): Antisovetov, Hermeneutics, MDX source for future native bodies
- Source file(s): `AntisovetovBody.astro`, `HermenevtikaBody.astro`, legacy Hermeneutics HTML, selected MDX files
- Observed on SHA: `7ac9188`
- Repro steps: grep for U+FFFD and known corrupted strings.
- Actual examples:
  ```text
  Настоящая сломленность не прос�тематическом искажении фактов перед общиной.
  кик говорят некоторые между вами
  скиния, называемая , .Святое Святых"
  Особых баптистовОсобые...
  КархемишеБитва...
  ```
- Evidence: `evidence/06-content-corruption-7ac9188.log`
- Confidence: high
- Verification level: L2/source evidence
- Suggested repair lane: `lane/public-content-corruption-surgical-2026-06-26`
- Do not mix with: full editorial rewrites

---

### Finding `LHV-008`

- Title: Migration metadata strict gate remains blind to undefined modes and profile/matrix mismatch
- Severity: **P1**
- Route(s): `karty/*`, `/konfessii/russkij-baptizm/`, `/map/`, `/rodosloviye/`, `/articles/`, `/biografii/`
- Source file(s): `migration/route-migration-matrix.json`, `data/route-profiles/*.json`, migration check scripts
- Observed on SHA: `7ac9188`
- Repro steps:
  1. Static gate shows `migration:metadata:check:strict` green.
  2. Independent probe validates modes and profile/matrix equality.
- Actual:
  ```text
  Invalid route modes: 13
  Profile/matrix mismatches: 15
  ```
- Evidence: `evidence/08-migration-metadata-7ac9188.log`
- Confidence: high
- Verification level: L2/source/tooling evidence
- Suggested repair lane: `lane/migration-metadata-contract-hardening-2026-06-26`
- Do not mix with: route promotion work

---

### Finding `LHV-009`

- Title: Workflow policy gate is green while deploy-readiness still misses dist contract and dist JSON-LD parse
- Severity: **P1**
- Route(s): global CI/deploy pipeline
- Source file(s): `.github/workflows/deploy.yml`, `scripts/check-workflows.js`, dist audit scripts
- Observed on SHA: `7ac9188`
- Repro steps:
  1. Fresh production-like dist has `contract:compare:dist` red and JSON-LD parse red.
  2. `node scripts/dist-publication-audit.js --require-pagefind --forbid-dev` catches `/map/` Pagefind now, but still does not catch Avraam contract nor Ishod JSON-LD.
  3. `npm run workflows:check` remains green.
- Expected: deploy/readiness must block on public contract drift and invalid dist JSON-LD.
- Actual: workflow policy does not require `contract:compare:dist` or dist JSON-LD parse. Existing `dist-publication-audit` catches `/map/` Pagefind but not Avraam word-count or Ishod JSON-LD.
- Evidence:
  - `evidence/03-dist-contract-7ac9188.log`
  - `evidence/04-dist-jsonld-7ac9188.log`
  - `evidence/05-dist-publication-sw-workflows-7ac9188.log`
- Confidence: high
- Verification level: L2 command/source evidence
- Suggested repair lane: `lane/deploy-dist-contract-jsonld-gates-2026-06-26`
- Do not mix with: route content fixes

---

## 2. Confirmations of Existing Findings

- Confirms previous Avraam dist contract finding on newer HEAD `7ac9188`.
- Confirms previous Ishod dist JSON-LD finding on newer HEAD `7ac9188`.
- Confirms previous public content corruption findings on newer HEAD.
- Confirms Baptisty structured data/OG issues on newer HEAD.
- Strengthens runtime duplicate-id finding from 3 sampled routes to 12 public routes in full public crawl.
- Confirms `/map/` is a newer production-like artifact problem after map visual parity restoration.

---

## 3. Challenges / Disputes

### Challenge: “7ac9188 restored map visual parity, therefore release is clean”

- Evidence says no: `/map/` visual parity may be restored, but Pagefind/public body contract is broken.
- Dist publication audit now fails on `/map/`.
- Recommended status: visual parity restore should be marked **incomplete until Pagefind/public body is restored**.

### Challenge: “static gate green means production deploy green”

- Static gate is green.
- Production-like dist gates are not green.
- Recommended wording: “source/static publication green; production-like dist not clean.”

---

## 4. Duplicate / Merge Proposals

- Merge `LHV-002` with previous Avraam dist contract entries.
- Merge `LHV-003` with previous Ishod JSON-LD entries.
- Merge `LHV-004` with `PFV-005` runtime duplicate tooltip ID finding, but update route coverage to 12 public routes.
- Merge `LHV-006` with existing Baptisty structured-data/OG findings.
- Add `/map/` Pagefind body loss as a new canonical item or sub-item under map visual parity restore regression.

---

## 5. Severity Proposals

- `/map/` Pagefind body loss should be P0/P1 because it currently fails `dist-publication-audit` on latest HEAD.
- Runtime duplicate tooltip IDs should remain P1 because it affects live DOM accessibility and cannot be caught by static duplicate-id audit.
- Dist JSON-LD and dist contract should remain P1 and be added to deploy gates.

---

## 6. Repair Lane Suggestions

### Lane A — `map-pagefind-body-regression`
- Bug IDs: `LHV-001`
- Must preserve visual parity.

### Lane B — `dist-contract-jsonld-deploy-hardening`
- Bug IDs: `LHV-002`, `LHV-003`, `LHV-009`
- Done criteria: contract:compare:dist green; dist JSON-LD green; workflow guard enforces both.

### Lane C — `glossary-runtime-unique-ids`
- Bug IDs: `LHV-004`
- Done criteria: full public crawl has zero duplicate hydrated ids.

### Lane D — `heart-premiumcontrols-wiring`
- Bug IDs: `LHV-005`

### Lane E — `public-content-corruption-surgical`
- Bug IDs: `LHV-007`

### Lane F — `baptisty-seo-structured-data-og`
- Bug IDs: `LHV-006`

### Lane G — `migration-metadata-contract-hardening`
- Bug IDs: `LHV-008`

---

## 7. Reverify Notes

- AuditRepo validation remained green before this report.
- `gb-is-my-strength` source/static gate is green on `7ac9188`.
- Fresh production-like dist is not release-clean.
- Full public route runtime crawl produced no non-local console errors or page errors, but did reveal duplicate hydrated ids.
- One local CSP image failure on `/nagornaya/` references absolute `https://gospod-bog.ru/...` while served from localhost; likely local-origin artifact, not classified as bug in this report.

---

## 8. Notes for Verifier

1. This report supersedes earlier `106f98d` wording for latest source state. Use `7ac9188` as the current-head evidence point.
2. The project is improving, but the remaining issue is exactly the owner's concern: several green lines do not yet mean one monolithic truth. Static, dist, runtime, Pagefind, and metadata all need to converge.
3. Recommended immediate next source repair: `/map/` Pagefind body restore, because it is the newest dist-publication blocker.
