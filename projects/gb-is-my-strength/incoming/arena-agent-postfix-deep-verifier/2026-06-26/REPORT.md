# Agent Audit Report — post-fix deep verification

## Meta
- Project: `gb-is-my-strength`
- Source repo: `https://github.com/FedorMilovanov/gb-is-my-strength`
- Agent: `arena-agent-postfix-deep-verifier`
- Date: 2026-06-26
- Audited branch: `main`
- Audited SHA: `106f98d`
- Current HEAD at start: `106f98d chore: auto-update meta, cache-bust [skip ci]`
- Current HEAD at end: `106f98d`
- Environment: Arena sandbox; Node `v20.20.2`; npm `10.8.2`; Node 22 via `npx -y node@22`; Playwright Chromium + deps installed for runtime probe
- Build mode: source/static gates + production-like dist (Astro build under Node 22, legacy copy, postbuild cache-bust, Pagefind)
- Browser / device if used: Playwright Chromium, mobile viewport 390×844

---

## Executive Summary

After source repo fix commit `a4d045e` and auto cache-bust commit `106f98d`, the **static publication gate is green**:

```text
npm run validate:static-publication:light ✅
```

This confirms several earlier release-gate blockers are fixed or at least no longer blocking the source/static barrier:

- `seo-audit` FAQPage false-positive fixed;
- root `/rodosloviye/` public baseline conflict fixed for source/root extraction;
- `audit-pro` stale SW expected-files blocker fixed enough for static gate;
- root `contract:compare` green;
- `migration:metadata:check:strict` green.

However, deeper production-like and runtime probes still show **hidden red areas** not caught by the green static gate:

| ID | Severity | Status on `106f98d` | Summary |
|---|---:|---|---|
| `PFV-001` | P1 | confirmed-current | `contract:compare:dist` still fails: `/karty/avraam/` word-count 594 → 23. |
| `PFV-002` | P1 | confirmed-current | Dist `/karty/ishod/` still has invalid JSON-LD. |
| `PFV-003` | P0/P1 | confirmed-current | Public content corruption remains: Antisovetov U+FFFD, Hermeneutics typo/corrupt verse strings. |
| `PFV-004` | P1 | confirmed-current | Baptisty 10 article pages still lack `BreadcrumbList` + Article dates; 11 Baptisty pages still use SVG OG. |
| `PFV-005` | P1 | new confirmed-current | Runtime glossary hydration creates duplicate `id="gtip-luxury-N"` after JS, breaking `aria-describedby` uniqueness. Static duplicate-id audit misses it. |
| `PFV-006` | P2 | confirmed-current | MDX concatenation debt remains in article content source. |
| `PFV-007` | P1 | confirmed-current / guard blind spot | `migration:metadata:check:strict` is green but independent probe still finds 13 undefined route modes and 15 profile/matrix mismatches. |
| `PFV-008` | P1 | confirmed-current / deploy gate blind spot | `deploy.yml`, `workflows:check`, and `dist-publication-audit` can stay green while dist contract and dist JSON-LD are red. |

---

## 1. New Findings

### Finding `PFV-001`

- Title: Production-like `contract:compare:dist` still fails for `/karty/avraam/` word-count collapse
- Severity: **P1**
- Route(s): `/karty/avraam/`
- Source file(s): `src/components/karty/avraam/AvraamMap.astro`, `data/public-content-baseline.json`, `scripts/compare-url-contract.js`
- Observed on SHA: `106f98d`
- Repro steps:
  1. Build production-like dist.
  2. Run `npm run contract:extract:dist && npm run contract:compare:dist`.
- Expected: production-like dist contract should pass, or the route should have an explicit owner-approved app-route exception.
- Actual:
  ```text
  ❌ URL contract compare failed (1 error)
    - word-count drop: https://gospod-bog.ru/karty/avraam/ 594 → 23 (floor 427)
  ```
- Evidence: `evidence/02-dist-contract-avraam-still-red-106f98d.log`
- Confidence: high
- Verification level: L2/direct production-like dist evidence
- Suggested repair lane: `lane/karty-avraam-indexable-body-contract-2026-06-26`
- Do not mix with: MapEngine visual redesign
- Suggested fix: add a substantial accessible/searchable text layer for Avraam map (route summary, stages, places, chronology, archaeology, usage notes) or explicitly encode an app-route contract exception.

---

### Finding `PFV-002`

- Title: Production-like dist `/karty/ishod/` still has invalid JSON-LD
- Severity: **P1**
- Route(s): `/karty/ishod/`
- Source file(s): `src/components/karty/ishod/IshodPageHead.astro`
- Observed on SHA: `106f98d`
- Repro steps:
  1. Build production-like dist.
  2. Parse all `<script type="application/ld+json">` blocks in `dist/**/*.html`.
- Expected: 0 JSON-LD parse errors.
- Actual:
  ```text
  JSON-LD errors: 1
  dist/karty/ishod/index.html block 1: Expected ',' or ']' after array element in JSON at position 344
  ```
- Evidence: `evidence/03-dist-jsonld-ishod-still-red-106f98d.log`
- Confidence: high
- Verification level: L2/direct dist artifact evidence
- Suggested repair lane: `lane/karty-ishod-jsonld-and-dist-jsonld-audit-2026-06-26`
- Do not mix with: map route visual work
- Suggested fix:
  1. Fix the extra brace in `IshodPageHead.astro` JSON-LD.
  2. Add dist JSON-LD parse audit to deployment/readiness pipeline, because source/static gates did not catch this.

---

### Finding `PFV-003`

- Title: Public content corruption remains in Antisovetov and Hermeneutics
- Severity: **P0/P1**
- Route(s):
  - `/articles/20-antisovetov-pastoru/`
  - `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/`
- Source file(s):
  - `src/components/article-pilots/antisovetov/AntisovetovBody.astro`
  - `src/components/article-pilots/hermenevtika/HermenevtikaBody.astro`
  - legacy article HTML for Hermeneutics
- Observed on SHA: `106f98d`
- Repro steps:
  ```bash
  grep -R $'�' -n src articles ...
  grep -R 'кик говорят\|называемая , \.Святое' -n src articles
  ```
- Expected: no replacement characters and no obvious corrupted Russian biblical text in public source.
- Actual examples:
  ```text
  Настоящая сломленность не прос�тематическом искажении фактов перед общиной.
  ```
  ```text
  кик говорят некоторые между вами
  ```
  ```text
  скиния, называемая , .Святое Святых"
  ```
- Evidence: `evidence/04-content-corruption-still-open-106f98d.log`
- Confidence: high
- Verification level: L2/source evidence on current HEAD
- Suggested repair lane: `lane/public-content-corruption-surgical-2026-06-26`
- Do not mix with: full editorial rewrite, layout refactor, visual migration
- Suggested fix: surgical text replacement only; add a guard for U+FFFD and known corrupted verse strings.

---

### Finding `PFV-004`

- Title: Baptisty article structured data and OG images remain underpowered in production-like dist
- Severity: **P1**
- Route(s): 10 Baptisty article pages + Baptisty hub for OG image format
- Source file(s): `src/components/baptisty-rossii/*PageHead.astro`, `images/baptisty-rossii/cover-*.svg`
- Observed on SHA: `106f98d`
- Repro steps:
  1. Build production-like dist.
  2. Parse JSON-LD for all `dist/baptisty-rossii/*/index.html` article pages.
  3. Inspect `og:image:type`.
- Expected:
  - Article JSON-LD should include `datePublished` and `dateModified`.
  - Article pages should include `BreadcrumbList` JSON-LD.
  - Social preview images should be WebP/JPG 1200×630, not SVG.
- Actual summary:
  ```text
  TOTAL { articlePages: 10, missingDates: 10, missingBreadcrumbList: 10, svgOg: 11 }
  ```
- Evidence: `evidence/05-baptisty-seo-structured-current-106f98d.log`
- Confidence: high
- Verification level: L2/direct dist evidence
- Suggested repair lane: `lane/baptisty-structured-data-og-polish-2026-06-26`
- Do not mix with: Baptisty article body rewriting
- Suggested fix:
  1. Add `BreadcrumbList` nodes to 10 article heads.
  2. Add Article dates from MDX/frontmatter or canonical date source.
  3. Replace OG social images with generated/approved `.webp` or `.jpg` 1200×630 assets.

---

### Finding `PFV-005`

- Title: Glossary runtime creates duplicate `gtip-luxury-*` IDs after hydration
- Severity: **P1** — accessibility/runtime correctness; static audit blind spot
- Route(s): confirmed on:
  - `/articles/dzhon-gill-chast-1-chelovek/`
  - `/articles/krajne-li-isporcheno-serdce/`
  - `/baptisty-rossii/noch-na-kure/`
- Source file(s): likely `js/site.js` / `js/glossary.js` tooltip hydration code
- Observed on SHA: `106f98d`
- Repro steps:
  1. Serve production-like `dist/` locally.
  2. Open routes in Playwright mobile viewport.
  3. Wait for JS hydration.
  4. Collect duplicate DOM ids and `aria-describedby` references.
- Expected: every generated tooltip id should be unique document-wide.
- Actual:
  ```json
  {"route":"/articles/dzhon-gill-chast-1-chelovek/","dupIds":["gtip-luxury-0","gtip-luxury-1","gtip-luxury-3","gtip-luxury-4","gtip-luxury-5","gtip-luxury-6","gtip-luxury-7"],"dupCount":7}
  {"route":"/articles/krajne-li-isporcheno-serdce/","dupCount":11}
  {"route":"/baptisty-rossii/noch-na-kure/","dupIds":["gtip-luxury-0"],"dupCount":1}
  ```
  The same duplicate IDs are used in `aria-describedby`, so assistive tech can point to ambiguous tooltips.
- Evidence: `evidence/06-runtime-duplicate-gtip-ids-106f98d.log`
- Confidence: high
- Verification level: L3 direct browser/runtime evidence on current HEAD artifact
- Suggested repair lane: `lane/glossary-runtime-unique-id-guard-2026-06-26`
- Do not mix with: tooltip visual redesign
- Suggested fix:
  - Use a document-global monotonic counter for generated `gtip-luxury-*` IDs, not a per-call/per-root index.
  - Add a runtime/audit guard that runs after glossary hydration, because raw HTML duplicate-id audit does not catch dynamically generated duplicates.

---

### Finding `PFV-006`

- Title: MDX source still has inline-note/glossary concatenation defects
- Severity: **P2** — migration/content-source debt
- Route(s): future MDX-native routes for Gill/Krajne
- Source file(s):
  - `src/content/articles/dzhon-gill-chast-1-chelovek.mdx`
  - `src/content/articles/dzhon-gill-chast-3-nasledie.mdx`
  - `src/content/articles/krajne-li-isporcheno-serdce.mdx`
- Observed on SHA: `106f98d`
- Repro steps:
  ```bash
  grep -R 'баптистовОсобые\|супралапсарианскойСупра\|КархемишеБитва\|катехизисРеформатский' -n src/content/articles
  ```
- Expected: no glued `wordDefinition` fragments in prose.
- Actual examples:
  ```text
  Особых баптистовОсобые...
  супралапсарианскойСупралапсарианство...
  КархемишеБитва...
  Гейдельбергский катехизисРеформатский...
  ```
- Evidence: `evidence/04-content-corruption-still-open-106f98d.log`
- Confidence: high for source debt; lower for immediate public impact depending on current body source path
- Verification level: L2 source evidence
- Suggested repair lane: `lane/mdx-source-concatenation-cleanup-2026-06-26`
- Do not mix with: article layout migration

---

### Finding `PFV-007`

- Title: Migration metadata strict gate is green while matrix/profile layer still has undefined modes and mismatches
- Severity: **P1** — guard blind spot / metadata contradiction
- Route(s): `karty/*`, `/konfessii/russkij-baptizm/`, `/map/`, `/rodosloviye/`, `/articles/`, `/biografii/`
- Source file(s):
  - `migration/route-migration-matrix.json`
  - `data/route-profiles/*.json`
  - `scripts/check-route-migration-matrix.js`
  - `scripts/check-route-profiles.js`
- Observed on SHA: `106f98d`
- Repro steps:
  1. Observe `npm run migration:metadata:check:strict` passes in static gate.
  2. Independently verify every route mode is defined in `.modes` and every profile agrees with matrix.
- Expected: strict metadata gate should fail on undefined modes and profile/matrix mismatch.
- Actual:
  ```text
  Invalid route modes: 13
   - /karty/avraam/: strict-native-app
   ...
   - /rodosloviye/: strict-native-app
  Profile/matrix mismatches: 15
   - /articles/: profile=native-main-with-legacy-chrome, matrix=strict-native
   - /biografii/: profile=native-main-with-legacy-chrome, matrix=strict-native
   - /karty/avraam/: profile=legacy-shadow-app, matrix=strict-native-app
   ...
  ```
- Evidence: `evidence/08-migration-metadata-guard-blindspot-106f98d.log`
- Confidence: high
- Verification level: L2 source/tooling evidence
- Suggested repair lane: `lane/migration-metadata-contract-hardening-2026-06-26`
- Do not mix with: route visual migration
- Suggested fix:
  1. Define `strict-native-app` in matrix `.modes` or rename routes to a defined mode.
  2. Update route profiles to current matrix reality or document explicit deviations.
  3. Extend strict scripts to check undefined mode and profile/matrix mismatch.

---

### Finding `PFV-008`

- Title: Production deploy/readiness gates can be green while production-like dist contract and dist JSON-LD are red
- Severity: **P1** — CI/deploy gate blind spot
- Route(s): global deploy pipeline; currently manifests as `/karty/avraam/` and `/karty/ishod/`
- Source file(s):
  - `.github/workflows/deploy.yml`
  - `scripts/dist-publication-audit.js`
  - `scripts/check-workflows.js`
  - `package.json`
- Observed on SHA: `106f98d`
- Repro steps:
  1. Use existing production-like dist from this pass where `contract:compare:dist` and JSON-LD parse fail.
  2. Run `node scripts/dist-publication-audit.js --require-pagefind --forbid-dev`.
  3. Run `npm run workflows:check`.
  4. Inspect `deploy.yml` for missing `contract:compare:dist` and missing dist JSON-LD parse step.
- Expected: production deploy gate should block if the artifact violates public URL contract or has invalid JSON-LD.
- Actual:
  - `dist-publication-audit` passes on the same artifact where:
    - `contract:compare:dist` fails (`/karty/avraam/` 594 → 23);
    - dist JSON-LD parse fails (`/karty/ishod/` invalid JSON).
  - `workflows:check` passes.
  - `deploy.yml` runs `dist-publication-audit`, `visual:parity:production`, `sw:dist:audit:deploy-switch`, but does not run `contract:compare:dist` and does not parse dist JSON-LD.
- Evidence: `evidence/09-deploy-dist-gate-blindspot-106f98d.log`
- Confidence: high
- Verification level: L2 source + command evidence
- Suggested repair lane: `lane/deploy-dist-contract-jsonld-gates-2026-06-26`
- Do not mix with: route content fixes; this is pipeline hardening.
- Suggested fix:
  1. Add a dist JSON-LD parse audit script or extend `dist-publication-audit.js`.
  2. Run `npm run contract:extract:dist && npm run contract:compare:dist` in deploy or in `dist-publication-audit` / `strangler:audit:production-like` equivalent used by deploy.
  3. Extend `scripts/check-workflows.js` so future workflow edits cannot drop these gates.

---

## 2. Confirmations of Existing Findings

### Fixed-current / improved after `a4d045e` + `106f98d`

- `seo-audit` FAQPage false-positive: **fixed for static gate**. Evidence: `01-static-publication-light-green-106f98d.log` shows `SEO audit passed`.
- root `/rodosloviye/` baseline/contract: **fixed for root/static gate**. Evidence: `content:guard` and `contract:compare` green in `01-static-publication-light-green-106f98d.log`.
- `audit-pro` SW expected-files blocker: **fixed enough for static gate**. Evidence: full static chain reaches later checks and exits green.

### Still confirmed-current

- Avraam dist word-count issue: `PFV-001`, still current.
- Ishod dist JSON-LD issue: `PFV-002`, still current.
- Baptisty structured data/OG issue: `PFV-004`, still current.
- Migration metadata guard blind spot: `PFV-007`, still current despite strict check green.

---

## 3. Challenges / Disputes

### Challenge: “green static gate means release-clean”

- Reason for challenge: `validate:static-publication:light` is green on `106f98d`, but production-like dist checks still fail.
- Evidence:
  - `01-static-publication-light-green-106f98d.log` — static green.
  - `02-dist-contract-avraam-still-red-106f98d.log` — dist contract red.
  - `03-dist-jsonld-ishod-still-red-106f98d.log` — dist JSON-LD red.
- Recommended status: distinguish **source/static green** from **production-like dist release-clean**. The site is not fully clean until dist contract and dist JSON-LD parse are included and green.

---

## 4. Duplicate / Merge Proposals

- `PFV-001` duplicates/continues earlier `N-2026-06-26-05` / current-head dist contract Avraam finding. Keep one canonical ID for Avraam word-count collapse.
- `PFV-002` duplicates/continues earlier `N-2026-06-26-04` / current-head Ishod JSON-LD finding. Keep one canonical ID for Ishod JSON-LD + add gate subtask.
- `PFV-004` confirms existing Baptisty `BUG-026` + SVG OG findings. Consider merging Baptisty structured data into one repair lane with separate image-asset subtask.
- `PFV-005` appears net-new relative to the unified ledger: runtime duplicate tooltip IDs after hydration. Static duplicate-id audits do not catch it.

---

## 5. Severity Proposals

- `PFV-005` should be P1, not P2, because it creates duplicate IDs in live hydrated DOM and ambiguous `aria-describedby` references on major article pages.
- `PFV-001` should remain P1 unless owner decides app routes intentionally have thin searchable text; then it becomes a documented contract exception rather than a bug.
- `PFV-002` should remain P1 because it is a single-route SEO structured-data break plus gate gap.

---

## 6. Repair Lane Suggestions

### Lane A — `dist-contract-and-jsonld-hardening`

- Bug IDs: `PFV-001`, `PFV-002`, `PFV-008`
- Why together: production-like dist artifact issues missed by static source/deploy gates.
- Must not mix with: visual redesigns.
- Done criteria:
  - `contract:compare:dist` green or Avraam exception explicit;
  - dist JSON-LD parse green;
  - dist JSON-LD parse and dist contract compare added to CI/deploy readiness;
  - `workflows:check` protects those gates.

### Lane B — `public-content-corruption-surgical`

- Bug IDs: `PFV-003`, optionally `PFV-006`
- Why together: small text/data corrections, no layout.
- Must not mix with: editorial rewrite.
- Done criteria:
  - no U+FFFD in public source;
  - known Hermeneutics corrupt verse strings fixed;
  - optional MDX concatenation grep patterns gone.

### Lane C — `glossary-runtime-a11y-unique-ids`

- Bug IDs: `PFV-005`
- Why together: one runtime system.
- Done criteria:
  - Playwright hydrated DOM duplicate id probe returns 0 duplicate `gtip-luxury-*` ids on Gill/Krajne/Baptisty sample routes.

### Lane D — `baptisty-seo-structured-data-og`

- Bug IDs: `PFV-004`
- Why together: Baptisty page heads and social cards.
- Must not mix with: body content rewrite.

### Lane E — `migration-metadata-contract-hardening`

- Bug IDs: `PFV-007`
- Why together: metadata data+guard consistency.

---

## 7. Reverify Notes

- Static publication gate: green on `106f98d`.
- Production-like dist contract: red on `106f98d` due Avraam word-count.
- Dist JSON-LD parse: red on `106f98d` due Ishod JSON-LD.
- Browser runtime probe: no page errors in sampled routes; duplicate hydrated tooltip IDs confirmed.
- Source worktree after probes: clean. See `evidence/07-gb-worktree-status-after-probes.log`.

---

## 8. Notes for Verifier

1. This intake is intentionally post-fix: it separates what got green from what remains hidden.
2. Do not regress the AuditRepo validated state; this report belongs in `incoming/`, not `verified/`.
3. Best immediate implementation order:
   1. Ishod JSON-LD + dist JSON-LD audit.
   2. Avraam dist contract decision/fix.
   3. Public content corruption surgical fix.
   4. Glossary runtime duplicate IDs.
   5. Baptisty structured data/OG.
   6. Migration metadata guard hardening.
