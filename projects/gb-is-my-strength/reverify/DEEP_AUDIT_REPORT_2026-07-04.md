# DEEP AUDIT REPORT — gb-is-my-strength @ 6e667978
**Date:** 2026-07-04
**AuditRepo HEAD:** fe6e5b8 (Pass 44)
**Mode:** Pure auditor/verifier — no source changes
**Environment:** Linux microVM, Node 22.12.0, Playwright chromium v1228

---

## EXECUTIVE SUMMARY

**Deploy:** ✅ GREEN (run #28700739679)
**Total bugs:** 29 FIXED / 10 OPEN (all P2/P3/Refactor — non-blocking)
**PremiumControls:** ✅ 87/87 audit pass — all PC-CURRENT items verified closed

---

## 1. VERIFICATION GATES (all PASS)

| Gate | Result | Details |
|------|--------|---------|
| `data:consistency` | ✅ | All data consistent |
| `guard:shared-files` | ✅ | 0 shared files touched |
| `workflows:check` | ✅ | Workflow policy compliant |
| `strangler:build:production-like` | ✅ | 53 pages, 442 legacy files copied |
| `audit:premium-controls` | ✅ | **87/87 passed** |
| `dist:css-parity` | ✅ | 52/52 pages carry project CSS |
| `dist:jsonld:audit` | ✅ | 60 JSON-LD blocks |
| `schema:rich-results:audit` | ✅ | 48 graphs, 25 articles, 39 breadcrumbs |
| `gill:context:visual-parity:audit` | ✅ | Strict-native, drift=109 (≤200) |
| `gill:spravochnik:visual-parity:audit` | ✅ | Drift=111 (≤200), 12 H2 |
| `dist-smoke-audit (production-like)` | ✅ | **28/28 routes** all 200, h1 present, overflow=0 |

---

## 2. PREMIUMCONTROLS — ALL PC-CURRENT VERIFIED

| ID | Status | Evidence |
|----|--------|----------|
| PC-CURRENT-01 | ✅ STALE | Gill marker dist-publication fixed |
| PC-CURRENT-02 | ✅ FIXED | `RomanNumeral.astro` active in all 5 Gill routes |
| PC-CURRENT-03 | ✅ FIXED | Both files in cache-bust-assets.js + asset-version.js |
| PC-CURRENT-04 | ✅ FIXED | `premium-controls.css` deleted. Canon = `floating-cluster.css` |
| PC-CURRENT-05 | ✅ FIXED | 4 valid @keyframes, clean transitions |
| PC-CURRENT-06 | ✅ FIXED | All routes have mobPartTocBtn + a11y attributes |

**Gill v16 markers:**
- chast-1: v16=2, roman=2 ✅
- chast-2: v16=2, roman=2 ✅
- chast-3: v16=2, roman=2 ✅
- context: v16=3, roman=2 ✅
- spravochnik: v16=2, roman=2 ✅

---

## 3. RECENT FIXES VERIFIED (July 3-4)

| Commit | Fix | Status |
|--------|-----|--------|
| `19062297` | `window.SiteUtils` prefix | ✅ line 2 uses `window.SiteUtils.ready()` |
| `932af3f3` | Baptisty asset paths | ✅ |
| `14574a9a` | CSP form-action | ✅ all 54 pages |
| `a434b45e` | Sitemap lastmod | ✅ |
| `c0ab48fc` | OG dims 1360×768 | ✅ |
| `ba6a8f67` | CI cache-bust skip | ✅ |
| `8dfaac04` | Prefetch hints | ✅ |
| `6e667978` | Lazy search.js | ✅ |

---

## 4. DEEP CODE ANALYSIS

### XSS VECTORS
- No `eval()`, `new Function()`, `document.write()` found
- All innerHTML is static — no user data interpolation without `tt()`
- CSP `form-action 'self'` on all pages ✅

### MIGRATION STATUS
- 35 routes in matrix: all `strict-native` or `strict-native-app`
- `/izbrannoe/`: `native-with-legacy-head` (documented)
- No `loadLegacyFullDocument` in any dist page
- dist files are LARGER than legacy copies → confirms Astro builds them

### POTENTIAL ISSUES

| # | Severity | Finding |
|---|----------|---------|
| 1 | 🟢 INFO | search-manifest.json 16 days stale (generatedAt: 2026-06-18) |
| 2 | 🟢 INFO | SW 1 day behind HEAD (expected — [skip ci] pattern) |
| 3 | 🟢 INFO | 17 ARIA warnings on legacy-copied pages (known) |
| 4 | 🟡 P3 | `css/enhancements-runtime.css` (2.2KB) — check if dynamically loaded |
| 5 | 🟡 P3 | `css/highlights-runtime.css` (5.3KB) — same |

### OG IMAGE DIMENSIONS
- All 53 dist pages: **0 missing** OG dims ✅
- hard-texts: 1360×768 ✅
- Other: 1200×630 ✅

### SERVICE WORKER
- CACHE_VERSION: `gb-v187-pagefind-bootstrap-20260703`
- 26 assets in PRECACHE including `/pagefind/pagefind.js` ✅
- No stale `series-cards.js` or `back-to-top.js` ✅

---

## 5. OPEN ITEMS (10 — all non-blocking)

| ID | Severity | Description |
|----|----------|-------------|
| BUG-011 | 🟡 P2 | 23 breakpoints, 768px collision (no regression) |
| NEW-72 | 🔵 P3 | SVG dedup ~1.9KB |
| NEW-54/56/57/58 | 🔵 P3 | Social/SEO metadata bundle |
| R-001..004 | 🔵 P3 | site.js monolith, enhancements.js, source maps, modules |
| AR-001/004/005 | 🟣 AuditRepo | Validation protocol |

---

## 6. CONCLUSION

**✅ Site is healthy. No regressions. All P0/P1 closed. Deploy green.**
**PremiumControls stable at 87/87 with all PC-CURRENT closed.**
**10 open items are P2/P3/Refactor only — non-blocking for production.**
