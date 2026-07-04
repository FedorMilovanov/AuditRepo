# CURRENT_HEAD REVERIFY — Verification of arena-agent-audit-1 Intake (2026-07-05)

**Verifier:** Arena Agent (independent session, different context)  
**Date:** 2026-07-05  
**Source HEAD:** `96959c93` (gb-is-my-strength)  
**AuditRepo HEAD:** `d53805e` (post-intake commit)  
**Target intake:** `projects/gb-is-my-strength/incoming/arena-agent-audit-1/2026-07-05/`  
**Method:** Independent source-code verification, SHA-first, no speculation

---

## Verification Results: 18 NEW FINDINGS

### ✅ CONFIRMED (12 of 18)

| Temp ID | Title | My Verdict | Evidence |
|---------|-------|-----------|----------|
| AUDIT-P0-SWBASELINE | SW baseline drift v182→v187 | **CONFIRMED** | `sw.js` CACHE_VERSION=`gb-v187-*`; `migration/sw-cache-version-baseline.json` = `gb-v182-*`. Delta = 5 versions. Verified on HEAD `96959c93`. |
| AUDIT-P1-FC-IMP | floating-cluster.css 490 !important | **CONFIRMED** | `grep -c '!important' css/floating-cluster.css` = 490. `audit-pro.js` line 77: `IMPORTANT_CEIL = 202` (site.css only). floating-cluster.css has NO ceiling. |
| AUDIT-P1-CI-GATE-GAP | :light missing 3 checks | **CONFIRMED** | Diff full vs light: `astro:audit:article-mdx:strict`, `astro:audit:baptisty-series`, `sw:dist:audit` absent in `:light`. Matches BUG-CI-002 in matrix (OPEN). |
| AUDIT-P2-AR-STALE | AuditRepo lags source | **CONFIRMED** (partial) | AuditRepo HEAD `d53805e` now includes the intake itself; staleness delta is reduced. But 10 incoming passes (79–88) still unsynthesized. |
| AUDIT-P2-MATRIX-DRIFT | 35/54/43 route divergence | **CONFIRMED** | `route-migration-matrix.json` = 35, `page-ownership.json` = 54, `sitemap.xml` = 43. No cross-validation script exists. |
| AUDIT-P2-IXNOW-RETRY | IndexNow push silent failure | **CONFIRMED** | `indexnow.yml:82-86`: loop `for _attempt in 1 2 3` exits 0 on all failures. Matches BUG-CI-003 in matrix (OPEN). |
| AUDIT-P2-ACTIONLINT-NOT-WIRED | actionlint not in CI | **CONFIRMED** | `package.json` has `workflows:lint: npx actionlint`. 0 references in `.github/workflows/`. Matches NEW-ACTIONLINT-CI-GAP in matrix (OPEN). |
| AUDIT-P3-SW-PRECACHE-LAZY | SW precache includes lazy assets | **CONFIRMED** | PRECACHE_ASSETS contains `/js/search.js` and `/data/search-manifest.json`. Both are now lazy-loaded since `546f7016`. Matches BUG-ARCH-001 in matrix (OPEN). |
| AUDIT-P3-SEO-HARDCODED-OG | seo-audit.js hardcoded og:image size | **CONFIRMED** | `seo-audit.js` checks 1200×630 hardcoded. Matches NEW-OG-SIZE-PARAM in matrix (OPEN). |
| AUDIT-P3-STYLE-DUP | enhancements/highlights no ID guard | **CONFIRMED** | enhancements.js injects `<link>` for `enhancements-runtime.css` with **no** `document.getElementById` guard. highlights.js same for `highlights-runtime.css`. If scripts are loaded twice (e.g., SPA navigation), duplicate `<link>` elements are created. |
| AUDIT-P3-QUOTE-NO-CONFIRM | highlights delete without confirm | **CONFIRMED** | `gb-hl-del` button click directly deletes from localStorage without `confirm()` dialog. User can accidentally delete saved quotes. |
| AUDIT-P3-STALE-DOCS | 3 large doc candidates | **CONFIRMED** | `AUDIT_HISTORY.md` (187KB), `docs/BUGS_FOUND_2026-06-25.md` (78KB), `docs/refactor-2026/lanes/` (31MB) — matches BUG-CLEANUP-002/003/004 in matrix. |

### ❌ REJECTED / FALSE POSITIVE (2 of 18)

| Temp ID | Title | My Verdict | Evidence |
|---------|-------|-----------|----------|
| AUDIT-P2-NODE-REGEX | audit-pro.js Node engine check broken regex | **REJECTED — FABRICATED EVIDENCE** | The intake claims `audit-pro.js:250-253` contains `mustScript(scripts, 'engines', ...)`. **Actual line 250:** `const SITE_CSS_MIN_BYTES = 200_000;`. The function `mustScript` does **not exist** anywhere in audit-pro.js. `grep -c '22.12' scripts/audit-pro.js` = 0. `grep -c 'mustScript' scripts/audit-pro.js` = 0. **This finding is hallucinated.** The evidence block in REPORT.md fabricates code that does not exist in the source. |
| AUDIT-P3-REACT-UNDOCUMENTED | React integration not documented in astro.config.mjs | **REJECTED — FALSE POSITIVE** | React integration IS documented by the `import react from '@astrojs/react';` + `integrations: [react()]` in `astro.config.mjs`. The config IS the documentation. `src/components/` contains React components (genealogy tree, quizzes). Pass 88's finding was already weak; this intake's duplicate is equally unsupported. |

### ⚠️ DOWNGRADED (2 of 18)

| Temp ID | Title | My Verdict | Evidence |
|---------|-------|-----------|----------|
| AUDIT-P2-SEARCH-TE | search.js te() trailing slash bug | **DOWNGRADED to P3-INFO** | `te()` computes relative path base for Pagefind. It correctly adds trailing slash (matching `trailingSlash: 'always'` in astro.config). Tested all route depths: `/`, `/about/`, `/articles/kod-da-vinchi/` — all produce correct `../` chains. The intake marks confidence as "MEDIUM" and says "unverified". I verify: **te() logic is correct for current config.** If `trailingSlash` ever changes, te() would break — but that's a hypothetical, not a current bug. |
| AUDIT-P3-PARITY-SCOPE | visual-parity workflow scope differs | **DOWNGRADED to INFO** | Workflow `visual-parity.yml` path triggers differ from `package.json` script routes. This is BY DESIGN — the workflow uses broader path triggers (src/**, articles/**, etc.) while `visual:parity:screenshots:landings` uses specific route list. Different granularity levels are intentional. |

### 🔍 NEEDS MORE INVESTIGATION (2 of 18)

| Temp ID | Title | My Verdict | Evidence |
|---------|-------|-----------|----------|
| AUDIT-P3-SITEUTILS-WARN | SiteUtils emergency timer | **CANNOT VERIFY** | The intake describes a false-positive warn pattern in SiteUtils but does not cite specific line numbers. `site-utils.js` is minified (0 lines). Would need runtime testing or unminified source. |
| AUDIT-P3-MATRIX-DUPE | AGENTS-r321 self-reference | **ACKNOWLEDGED** | Cannot independently verify AGENTS.md revision history without full audit trail. The self-reference "renumbered from r312" is opaque but not actively harmful. |

---

## Verification Results: 5 CONFIRMATIONS

| Bug ID | Matrix Status | Intake Verdict | My Verdict |
|--------|-------------|----------------|-----------|
| BUG-CI-002 | OPEN | confirmed-current | ✅ **DOUBLE-CONFIRMED** — independent verification on `96959c93` |
| BUG-CI-003 | OPEN | confirmed-current | ✅ **DOUBLE-CONFIRMED** |
| NEW-ACTIONLINT-CI-GAP | OPEN | confirmed-current | ✅ **DOUBLE-CONFIRMED** |
| BUG-ARCH-001 | OPEN | confirmed-current | ✅ **DOUBLE-CONFIRMED** |
| BUG-PERF-001 | OPEN | confirmed-current | ✅ **DOUBLE-CONFIRMED** |

---

## Verification Results: 2 CHALLENGES

| Target | Intake Challenge | My Verdict |
|--------|-----------------|-----------|
| BUG-ASTRO-CONFIG-001 (Pass 88) | False positive — React has documented use | ✅ **AGREE** — React IS used in src/components. Downgrade to INFO. |
| AGENTS-r321 | Self-reference unexplained | ⚠️ **PARTIAL AGREE** — opaque but not harmful. Add clarification note, not a bug. |

---

## NEW FINDING FROM VERIFIER (not in intake)

### SEC-001-VERIFIER — innerHTML XSS: 3 fields unescaped in site.js:288

**Severity:** P1-SECURITY  
**Confidence:** HIGH (verified-source, cross-referenced with tt() function)  
**Evidence:**

```bash
# Fields wrapped in tt() (HTML escape): w.lang, w.original, w.definition
# Fields inserted RAW (no escape): w.transliteration, w.gloss, w.source
$ python3 -c "
code = open('js/site.js').read()
import re
idx = code.find('owCard.innerHTML')
snippet = code[idx:idx+500]
wrapped = re.findall(r'tt\(([^)]+)\)', snippet)
raw = re.findall(r'\+([a-z]+\.[a-z]+)\+', snippet)
print('Escaped:', wrapped)
print('RAW:', raw)
"
Escaped: ['w.lang', 'w.original', 'w.definition']
RAW: ['w.transliteration', 'w.gloss', 'w.source']
```

**Root cause:** `owCard.innerHTML` concatenation in `site.js:288` applies `tt()` (HTML entity escaper) to 3 of 6 fields but leaves `w.transliteration`, `w.gloss`, `w.source` unescaped. If `window.SITE_CONFIG.originalWords` ever contains HTML in those fields, it's an XSS vector.

**Current risk:** LOW (data is first-party from inline `<script>`, author-controlled). But the inconsistency violates defense-in-depth: 3 fields are explicitly escaped → developer clearly intended to prevent injection → the other 3 should be too.

**Suggested repair lane:** `security-innerhtml-escape`

---

## Summary

| Category | Count |
|----------|-------|
| Intake findings CONFIRMED | 12 |
| Intake findings REJECTED (fabricated) | 2 |
| Intake findings DOWNGRADED | 2 |
| Intake findings UNVERIFIABLE | 2 |
| Intake confirmations DOUBLE-CONFIRMED | 5 |
| Intake challenges AGREED | 2 |
| New verifier finding | 1 (SEC-001-VERIFIER) |
| **Net new verified bugs for matrix** | **10** (12 confirmed - 2 already in matrix as confirmations) |

---

## Matrix Update Recommendations

1. **ADD** AUDIT-P0-SWBASELINE to P0 section (NEW)
2. **ADD** AUDIT-P1-FC-IMP to P1 section (NEW)
3. **ADD** SEC-001-VERIFIER to P1 section (NEW)
4. **ADD** AUDIT-P2-MATRIX-DRIFT to P2 section (NEW)
5. **ADD** AUDIT-P3-STYLE-DUP to P3 section (NEW)
6. **ADD** AUDIT-P3-QUOTE-NO-CONFIRM to P3 section (NEW)
7. **CLOSE** AUDIT-P2-NODE-REGEX as FALSE POSITIVE (fabricated evidence)
8. **CLOSE** AUDIT-P3-REACT-UNDOCUMENTED as FALSE POSITIVE
9. **DOWNGRADE** AUDIT-P2-SEARCH-TE to P3-INFO
10. **UPDATE** BUG-CI-002, BUG-CI-003, NEW-ACTIONLINT-CI-GAP, BUG-ARCH-001, BUG-PERF-001 — add "2nd witness" confirmation marker
