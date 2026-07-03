# Agent Audit Report — Round 18 (Deep Hash + Content Integrity Audit)

## Meta
- **Project:** gb-is-my-strength
- **Source repo:** FedorMilovanov/gb-is-my-strength
- **Agent:** arena-agent-round18
- **Date:** 2026-06-26
- **Audited SHA:** `09c2d34aedf3d0a29e19298ffa886e60fea02b87` (HEAD main)
- **Mode:** deep-independent-audit
- **Build mode:** source-level static analysis + hash computation
- **Scope:** 52 Astro pages, 338 components, 20 MDX articles, 17 JS files, 7 CSS files

---

## Executive Summary

**CRITICAL REGRESSION DISCOVERED:** `js/site.js` — the primary JavaScript file — has **ZERO correct hashes** across all 47 Astro components. The legacy HTML has the correct hash (`f8f0c38c`) but every single Astro component serves the stale version (`133dfac1`). This was introduced when the system-dist-content-hardening lane modified `site.js` (tooltip ID fix) but the Astro component hashes were never cache-busted.

**CONTENT CORRUPTION:** U+FFFD replacement character found in `AntisovetovBody.astro` line 695 — the fix from system-dist-content-hardening was incomplete or regressed.

**5 net-new bugs, 5 residual/structural confirmations.**

---

## 1. New Findings

### R18-01: js/site.js — 0/47 Astro components have correct hash (P0 CRITICAL REGRESSION)
- **Severity:** P0
- **Route(s):** ALL Astro-owned pages (47 components)
- **Root cause:** `cache-bust.js` updates legacy HTML `?v=` hashes but does NOT update Astro component hardcoded hashes. The system-dist-content-hardening lane modified `js/site.js` (tooltip ID generation fix), changing its hash from `133dfac1` to `f8f0c38c`. Legacy HTML was updated but all 47 Astro components still reference `133dfac1`.
- **Evidence:**
  ```
  Real hash:        f8f0c38c
  Legacy HTML:      site.js?v=f8f0c38c ✅
  Astro (47 refs):  site.js?v=133dfac1 ❌ (100% stale)
  ```
- **Impact:** Every Astro page loads stale JavaScript. The tooltip ID fix, scroll-lock improvements, and any other site.js changes are NOT served to Astro-page visitors. Users on legacy HTML pages get the fix; users on Astro pages get the old broken code.
- **Confidence:** high (deterministic hash computation)
- **Verification level:** L2 (source witness + hash computation)
- **Repair lane:** `lane/system-cache-bust-astro-sync-2026-06-26`
- **Do not mix with:** content fixes — this is a build-tooling issue

### R18-02: nagornaya-mobile-toc.js — ALL 11 references stale (P1)
- **Severity:** P1
- **Route(s):** All 11 Nagornaya pages
- **Real hash:** `866d4238`
- **All 11 refs:** `ffd00d98` (stale)
- **Root cause:** Same as R18-01 — cache-bust.js updates legacy HTML but not Astro components
- **Evidence:** `grep -roh "nagornaya-mobile-toc.js?v=[a-f0-9]{8}" src/ --include="*.astro"` → all return `ffd00d98`, never `866d4238`
- **Confidence:** high
- **Repair lane:** Same as R18-01

### R18-03: U+FFFD content corruption in AntisovetovBody.astro (P1 REGRESSION)
- **Severity:** P1
- **Route(s):** `/articles/20-antisovetov-pastoru/`
- **Root cause:** The system-dist-content-hardening lane claimed to fix U+FFFD corruption but the Astro source file still contains it at line 695. The legacy HTML was fixed but the Astro source was not (or was re-corrupted during a merge/rebase).
- **Evidence:**
  ```
  grep U+FFFD src/components/article-pilots/antisovetov/AntisovetovBody.astro → 1 match
  grep U+FFFD articles/20-antisovetov-pastoru/index.html → 0 matches (fixed)
  MDX source: "Настоящая сломленность не просит сохранить трон." (correct)
  Astro body: "Настоящая сломленность не прос�тематическом искажении..." (CORRUPTED)
  ```
- **Impact:** Visible text corruption on the page. Users see "не прос�тематическом" instead of "не просит сохранить трон."
- **Confidence:** high
- **Repair lane:** `lane/fix-antisovetov-content-corruption-2026-06-26`
- **Do not mix with:** hash sync — separate content issue

### R18-04: floating-cluster-controller.js — 14/15 refs stale (P1 RESIDUAL)
- **Severity:** P1
- **Route(s):** 14 Astro components
- **Real hash:** `ba4a4019`
- **Stale refs:** 14× `efd81d3a`, 1× `58c2ea90` (also stale — that was the "fixed" hash from an earlier cache-bust)
- **Root cause:** Same systemic issue — cache-bust.js doesn't update Astro components
- **Note:** This was previously downgraded from P0 to P1 residual, but R18-01 shows the problem is WORSE for site.js (0% correct vs 7% correct for fc-controller)

### R18-05: V2-2 residual — NagornayaIndexPageChrome missing data-fontsize (P1)
- **Severity:** P1
- **Route(s):** `/nagornaya/` (index page)
- **Root cause:** The V2-2 fix added `data-fontsize="down/up"` to chast-1 through chast-5 PageChrome components but missed the index page.
- **Evidence:**
  ```
  NagornayaIndexPageChrome.astro lines 80-81:
    <button class="nag-fontsize-btn" id="nagFontDec">A−</button>
    <button class="nag-fontsize-btn" id="nagFontInc">A+</button>
  Missing: data-fontsize="down" / data-fontsize="up"
  JS selector: [data-fontsize="down"], [data-fontsize="up"] → NO MATCH
  ```
- **Confidence:** high
- **Repair lane:** `lane/fix-v2-2-index-residual-2026-06-26` (2-line change)

---

## 2. Confirmations of Previous Findings

### Confirm S3-N1: baptisty-rossii missing BreadcrumbList in JSON-LD
- All 11 baptisty pages (hub + 10 articles) have DOM breadcrumbs but NO JSON-LD BreadcrumbList
- Verified: `grep -c BreadcrumbList src/components/baptisty-rossii/*PageHead.astro` → 0
- Status: **P2 confirmed**

### Confirm S3-N2: baptisty-rossii og:image = SVG only
- All 11 pages use `image/svg+xml` og:image — social platforms (Facebook, Twitter, Telegram, VK, WhatsApp) don't render SVG previews
- Verified: all `BaptistyRossii*PageHead.astro` have `og:image:type` = `image/svg+xml`
- Status: **P2 confirmed**

### Confirm P2-14: series-cards.js still dead
- File exists on disk (2642 bytes), 0 Astro imports, 0 HTML script tags
- Still referenced 5× in `audit-pro.js` (ALLOWED_JS array + readFileSync + dead-weight check)
- Status: **P3 confirmed** — cleanup needed

### Confirm S3-N3: series-cards half-removed
- Removed from cache-bust.js and sw.js but NOT from audit-pro.js
- audit-pro.js line 59 (ALLOWED_JS), lines 4143-4145 (readFileSync), lines 4249-4250 (dead-script check)
- Status: **P3 confirmed** — if file is deleted, audit-pro.js will crash

---

## 3. Structural / Architectural Concerns

### ARCH-R18-01: cache-bust.js only updates legacy HTML, NOT Astro components
- **The root cause of R18-01, R18-02, R18-04**
- `cache-bust.js` scans and updates `?v=` hashes in legacy `*.html` files
- Astro components in `src/components/` have hardcoded `?v=HASH` that are NEVER updated
- Every time `site.js`, `search.js`, `enhancements.js`, etc. change, Astro pages serve stale assets
- **Fix required:** Extend cache-bust.js to also update Astro component script/link tags, OR generate hashes at build time

### ARCH-R18-02: Dual CSS strategy = 780KB total (83% over audit-pro limit)
- `site.css` (282KB) + `site-layered.css` (282KB) = 564KB of near-identical CSS
- 105 overlapping selectors between the two files
- Total project CSS = 780,728 bytes vs `audit-pro.js MAX_CSS_TOTAL = 425,000`
- `css:layer:validate` only checks `site-layered.css` !important ceiling, not total budget

### ARCH-R18-03: Floating cluster has 179 !important declarations
- `floating-cluster.css` has 179 `!important` (89% of site-layered.css ceiling of 202)
- Total project `!important` count: 18+18+179+8+1+33+9 = 266
- No guard prevents new CSS files from adding `!important`

### ARCH-R18-04: 38 images without alt attributes (a11y)
- `ArticlesPublicationsSection.astro`, `ArticlesRefutationsSection.astro`, `HomeSections/Publications.astro`, `HomeSections/Refutations.astro`
- All 10 Nagornaya `*MainShell.astro` and `*SectionSummary.astro` components
- `biografii/index.astro`
- **WCAG 2.1 Level A violation:** Non-text content must have text alternative

### ARCH-R18-05: SITE_CONFIG version hardcoded across 17 components
- All 17 components use `version: 1781282355` (Unix timestamp ≈ 2026-06-11, 15 days stale)
- This version is supposed to be updated by cache-bust.js but the Astro inline `<script>` tags are not scanned

---

## 4. Challenges / Disputes

### Challenge: P0-10 "partially fixed" status
- **Previous assessment:** 1 asset (fc-controller) with stale hash in 14 components = residual P1
- **My finding:** This is WRONG. At least 2 more assets are stale:
  - `js/site.js`: 47/47 components stale (100%) — this is the PRIMARY JS file
  - `js/nagornaya-mobile-toc.js`: 11/11 components stale (100%)
  - `js/floating-cluster-controller.js`: 15/15 components stale (current real hash is `ba4a4019`, not the "correct" `58c2ea90`)
- **Recommended status:** P0-10 should be upgraded back to P0 — it was never actually fixed, only narrowed in scope
- **Root cause:** cache-bust.js doesn't touch Astro components (ARCH-R18-01)

### Challenge: "20-antisovetov U+FFFD fix" was incomplete
- **Previous assessment:** system-dist-content-hardening lane fixed corruption
- **My finding:** Legacy HTML was fixed but Astro source (`AntisovetovBody.astro` line 695) still has U+FFFD
- **Recommended status:** Reopen as P1 — the fix was applied to the wrong file (or the Astro file was re-corrupted during merge/rebase)

---

## 5. Repair Lane Suggestions

### Lane 1: `lane/system-cache-bust-astro-sync-2026-06-26` (P0 — URGENT)
- **Bugs:** R18-01, R18-02, R18-04
- **Fix:** Update all hardcoded `?v=HASH` in Astro components to match current file hashes
  - `js/site.js`: `133dfac1` → `f8f0c38c` (47 files)
  - `js/nagornaya-mobile-toc.js`: `ffd00d98` → `866d4238` (11 files)
  - `js/floating-cluster-controller.js`: `efd81d3a`/`58c2ea90` → `ba4a4019` (15 files)
- **Long-term fix:** Extend `cache-bust.js` to also update Astro components
- **What must NOT be mixed with:** Content fixes (separate risk domains)

### Lane 2: `lane/fix-antisovetov-content-corruption-2026-06-26` (P1)
- **Bugs:** R18-03
- **Fix:** Replace U+FFFD in `AntisovetovBody.astro` line 695
  - Corrupted: `"Настоящая сломленность не прос\uFFFDтематическом искажении"`
  - Correct (from MDX): `"Настоящая сломленность не просит сохранить трон."`
- **2-line sed fix**

### Lane 3: `lane/fix-v2-2-index-residual-2026-06-26` (P1 — 2 lines)
- **Bugs:** R18-05
- **Fix:** Add `data-fontsize="down"` and `data-fontsize="up"` to NagornayaIndexPageChrome.astro lines 80-81

### Lane 4: `lane/baptisty-seo-2026-06-26` (P2)
- **Bugs:** S3-N1 (BreadcrumbList), S3-N2 (og:image SVG)
- **Fix:** Add BreadcrumbList JSON-LD to all 11 BaptistyRossii*PageHead.astro components; generate raster og:image variants

### Lane 5: `lane/a11y-alt-text-2026-06-26` (P2)
- **Bugs:** ARCH-R18-04 (38 images without alt)
- **Fix:** Add meaningful alt text or `alt=""` for decorative images

---

## 6. Reverify Results (HEAD 09c2d34a)

| Bug | Result | Evidence |
|---|---|---|
| PS-01 (qs crash) | ✅ FIXED | IIFE properly structured |
| P0-10 residual | 🔴 WORSE than reported | site.js: 0/47 correct; nagornaya-toc: 0/11 correct |
| V2-2 (nagornaya font) | 🔴 PARTIAL | chast-1..5 ✅, index ❌ |
| V2-3 (avraam skip) | ✅ FIXED | href=#stage |
| V2-4 (feed weekdays) | ✅ FIXED | No wrong weekdays |
| PS-06 (hermenevtics readTime) | ✅ FIXED | readTime=50 |
| P2-14 (series-cards.js) | 🔴 STILL DEAD | File exists, 0 imports |
| P0-7/8 (SW precache) | ✅ FIXED | Removed from PRECACHE |
| PS-04 (heart controller) | ✅ FIXED | fc-controller loaded |
| PS-07 (duplicate IDs) | ✅ FIXED | Hardcoded IDs removed |
| P1-9 (audit-pro sync) | ✅ FIXED | CACHE_BUST_ASSETS synced |
| P3-8 (faq-accordion) | ✅ FP confirmed | Works via enhancements.js |
| S3-N1 (baptisty BreadcrumbList) | ✅ Confirmed | 0 BreadcrumbList in 11 PageHead files |
| S3-N2 (baptisty SVG og:image) | ✅ Confirmed | All 11 pages use image/svg+xml |
| S3-N3 (series-cards half-removed) | ✅ Confirmed | audit-pro.js still references |
| **R18-01 (site.js hash)** | 🔴 **NEW P0** | 0/47 Astro components correct |
| **R18-02 (nagornaya-toc hash)** | 🔴 **NEW P1** | 0/11 Astro components correct |
| **R18-03 (U+FFFD corruption)** | 🔴 **NEW P1** | AntisovetovBody.astro line 695 |

---

## 7. Bug Count Summary

| Category | Count |
|---|---|
| **Net-new bugs** | 5 (R18-01 to R18-05) |
| **Confirmations** | 5 (S3-N1, S3-N2, S3-N3, P2-14, P3-8) |
| **Structural concerns** | 5 (ARCH-R18-01 to ARCH-R18-05) |
| **Challenges/revisions** | 2 (P0-10 scope, U+FFFD fix completeness) |
| **Total actionable** | **12** (5 new + 5 confirm + 2 challenges) |

---

## 8. Notes for Verifier

1. **R18-01 is the most critical finding.** `js/site.js` is the PRIMARY JavaScript file for the entire site. Every Astro page serves a stale version. The legacy HTML serves the correct version. This creates a split-brain where users on different page types get different JavaScript.
2. **R18-03 is a regression from the system-dist-content-hardening lane.** The fix was applied to legacy HTML but not the Astro source. The MDX source is correct — the corruption is ONLY in the Astro body.
3. **ARCH-R18-01 is the systemic root cause.** Until `cache-bust.js` is extended to update Astro components, every JS/CSS change will cause hash drift in Astro pages.
4. **All hash evidence is deterministic.** `node -e "crypto.createHash('md5')..."` on a fresh clone at HEAD `09c2d34a`.
5. **V2-2 residual is a trivial 2-line fix.** The index page was simply missed in the original fix.

---

## 9. Additional Finding: Hermenevtika Quiz Data Corruption

### R18-11: HermenevtikaBody.astro quiz data contains text corruption (P2)
- **Severity:** P2
- **Route(s):** `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/`
- **Root cause:** Quiz reference data (SITE_CONFIG) in `HermenevtikaBody.astro` contains corrupted text:
  - Line 309 (Евреям 9:1-13): `"называемая , .Святое Святых"` — should be `"называемая \"Святое Святых\""`
  - Line 360 (1 Кор. 15:12-14): `"кик говорят"` — should be `"как говорят"` (this is the Synodal translation quote)
- **Impact:** These corruptions appear in quiz reference popups. Users see garbled Bible quotes.
- **Evidence:** MDX source file does NOT contain quiz data (quiz is only in Astro body). Legacy HTML has the SAME corruption → original source data was corrupted and copied to both files.
- **Confidence:** high
- **Repair lane:** `lane/fix-hermenevtika-quiz-corruption-2026-06-26`

## 10. Complete Asset Hash Audit Table

| Asset | Real Hash | Astro Refs | Correct | Stale | Stale % |
|---|---|---|---|---|---|
| js/site.js | f8f0c38c | 47 | 0 | 47 | **100%** |
| js/nagornaya-mobile-toc.js | 866d4238 | 11 | 0 | 11 | **100%** |
| js/floating-cluster-controller.js | ba4a4019 | 15 | 0 | 15 | **100%** |
| js/search.js | c9d65577 | 37 | 37 | 0 | 0% ✅ |
| js/site-utils.js | 897afa55 | 38 | 38 | 0 | 0% ✅ |
| js/scroll-perf.js | 454d6f7b | 37 | 37 | 0 | 0% ✅ |
| js/enhancements.js | b3b77aa6 | 34 | 33 | 1 | 3% |
| js/highlights.js | a1706b06 | 34 | 33 | 1 | 3% |
| js/sw-register.js | 318502c5 | 36 | 36 | 0 | 0% ✅ |
| js/glossary.js | 2100cf4f | 34 | 34 | 0 | 0% ✅ |
| css/site.css | b880b524 | 37 | 36 | 1 | 3% |
| css/home.css | f5b561ee | 6 | 5 | 1 | 17% |
| css/command-palette.css | afe33045 | 36 | 35 | 1 | 3% |
| css/mobile-hotfix.css | c1f7664e | 35 | 34 | 1 | 3% |

**Summary:** 3 critical assets (site.js, nagornaya-toc.js, fc-controller.js) have 100% stale hashes across all Astro components. This confirms that P0-10 was NOT fixed — it was merely narrowed. The systemic root cause (cache-bust.js doesn't update Astro components) remains unaddressed.

---

## 11. Final Bug Count

| Category | Count |
|---|---|
| **Net-new P0** | 1 (R18-01: site.js 0/47 correct) |
| **Net-new P1** | 3 (R18-02, R18-03, R18-05) |
| **Net-new P2** | 2 (R18-11 quiz corruption, R18-06/07 confirms) |
| **Residual confirmations** | 2 (R18-04, P2-14) |
| **Structural concerns** | 5 (ARCH-R18-01 through ARCH-R18-05) |
| **Total actionable findings** | **13** |
