# CURRENT_HEAD REVERIFY — Pass 91: Full Matrix Verification + New Findings

**Verifier:** Arena Agent (independent session)  
**Date:** 2026-07-05  
**Source HEAD:** `2f09c8f5` (post SEC-001/002 fix + auto cache-bust)  
**AuditRepo HEAD:** `15e7df5` (АУДИТ 1.3)  
**Method:** SHA-first, source-code inspection, git history analysis, cross-file correlation

---

## 1. VERIFICATION OF ALL OPEN BUGS ON CURRENT HEAD

### 🔴 P0

| Bug ID | Status on `2f09c8f5` | Evidence |
|--------|----------------------|----------|
| AUDIT-P0-SWBASELINE | ✅ **CONFIRMED-CURRENT** | `sw.js` CACHE_VERSION=`gb-v187-*`, baseline=`gb-v182-*`. 5 versions stale. |

### 🟠 P1

| Bug ID | Status | Evidence |
|--------|--------|----------|
| AUDIT-P1-FC-IMP | ✅ **CONFIRMED-CURRENT** | `grep -c '!important' css/floating-cluster.css` = 490. audit-pro.js line 77: ceiling only for site.css. 0 mentions of floating-cluster in !important checks. |
| BUG-CI-002 | ✅ **CONFIRMED-CURRENT** | `:light` missing 3 checks: `astro:audit:article-mdx:strict`, `astro:audit:baptisty-series`, `sw:dist:audit`. |
| BUG-CI-003 | ✅ **CONFIRMED-CURRENT** | `indexnow.yml:82-86`: `for _attempt in 1 2 3; do ... done` with no `exit 1` after loop. |
| BUG-PERF-001 | ✅ **CONFIRMED-CURRENT** | addEventListener vs removeEventListener: nagornaya-mobile-toc.js (26:0), search.js (22:0), site.js (195:13), enhancements.js (48:1). Total: 294 add, 16 remove. |

### 🟡 P2

| Bug ID | Status | Evidence |
|--------|--------|----------|
| BUG-ARCH-001 | ✅ **CONFIRMED-CURRENT** | PRECACHE_ASSETS contains `/js/search.js` and `/data/search-manifest.json` — both now lazy-loaded. |
| BUG-SEO-001 | ✅ **CONFIRMED-CURRENT** | IndexNow submit in deploy.yml runs immediately after `actions/deploy-pages@v4`. No CDN propagation delay. |
| NEW-CANONICAL-IZBRANNOE-01-GAP | ✅ **CONFIRMED-CURRENT** (tooling gap) | Underlying bug fixed, but `canonicalSanityGuard()` still structurally cannot catch relative canonical on noindex routes. |
| AUDIT-P2-MATRIX-DRIFT | ✅ **CONFIRMED-CURRENT** | route-migration-matrix: 35, page-ownership: 54, sitemap: 43. No cross-validation. |
| BUG-011 | ✅ **CONFIRMED-CURRENT** | 23 unique breakpoints, 768px collision. No visual regression. |

### 🟢 P3

| Bug ID | Status | Evidence |
|--------|--------|----------|
| BUG-SW-001 | ✅ CONFIRMED | `isFont()` double negation still present. |
| AUDIT-P3-STYLE-DUP | ✅ **CONFIRMED-CURRENT** | enhancements.js and highlights.js: NO getElementById guard before CSS `<link>` injection. |
| AUDIT-P3-QUOTE-NO-CONFIRM | ✅ CONFIRMED | `.gb-hl-del` click directly deletes, no confirm(). |
| BUG-SEO-002 | ✅ CONFIRMED | `Allow: /llms.txt` scoped only to ImagesiftBot block. |
| BUG-CLEANUP-001 | ✅ CONFIRMED | 4 dead scripts: 0 callers each in scripts/, package.json, .github/. |
| BUG-CLEANUP-002/003/004 | ✅ CONFIRMED | All stale doc archives still present. |
| NEW-CSS-BUDGET-01 | ✅ CONFIRMED | audit-pro prints CSS budget warning on every run, not tracked as backlog. |
| NEW-OG-SIZE-PARAM | ✅ CONFIRMED | seo-audit.js hardcoded 1200×630. |
| NEW-ACTIONLINT-CI-GAP | ✅ **CONFIRMED-CURRENT** | 0 workflow files reference actionlint. `grep -c 'actionlint' .github/workflows/*.yml` = 0 for all 8 files. |
| R-001/002/003/004 | ✅ CONFIRMED | site.js monolith 578 lines (minified), no source maps, no tree-shaking, no type=module. |

### ✅ FIXED (verified)

| Bug ID | Status | Evidence |
|--------|--------|----------|
| SEC-001-VERIFIER | ✅ **FIXED** on `3d242b1c` | All 6 owCard.innerHTML fields now use tt(). Verified on `2f09c8f5`. |
| NEW-SAFEURL-XSS-HARDENING | ✅ **FIXED** on `3d242b1c` | safeUrl() now blocks 4 URI schemes. Verified on `2f09c8f5`. |
| BUG-CI-001 | ✅ **FIXED** on `6e68d7ca` | deploy.yml no longer has duplicate `run:` key. |

---

## 2. NEW FINDINGS (not in matrix)

### NEW-CACHE-BUST-ASTRO — Runtime CSS cache-busting broken on 53 Astro pages

**Severity:** P2-PERF/CACHE  
**Confidence:** HIGH (verified-source, cross-file correlation)  
**Files:** `js/enhancements.js`, `js/highlights.js`, `src/layouts/BaseLayout.astro`

**Evidence:**

```javascript
// enhancements.js — CSS injection pattern:
e.href = "/css/enhancements-runtime.css?v=" + (window.SITE_CONFIG && window.SITE_CONFIG.version || "");

// highlights.js — same pattern:
r.href = "/css/highlights-runtime.css?v=" + (window.SITE_CONFIG && window.SITE_CONFIG.version || "");
```

```
// Legacy HTML SITE_CONFIG (e.g. articles/kod-da-vinchi/index.html):
window.SITE_CONFIG = { ..., "version": 1778943682, ... }
→ CSS loads as: /css/enhancements-runtime.css?v=1778943682 ✅

// Astro-generated SITE_CONFIG (BaseLayout.astro makeGenericRuntime()):
window.SITE_CONFIG = { site: {...}, page: {...}, features: {...} }
// NO version field!
→ CSS loads as: /css/enhancements-runtime.css?v=    ← EMPTY STRING
```

**Impact:** 53 Astro pages load runtime CSS with `?v=` (empty) — no cache busting. After CSS update, returning users on Astro routes see stale styles until browser cache expires. Legacy pages still have proper cache busting via timestamp.

**Root cause:** `BaseLayout.astro` `makeGenericRuntime()` constructs a SITE_CONFIG object without a `version` field. Legacy HTML pages include version via `scripts/update-meta.js`. The gap was introduced during Astro migration.

**Repair lane:** `cache-bust-astro-runtime-css`

---

### NEW-OG-DIMENSIONS-HARDCODED — og:image:width/height hardcoded 1200×630 for all pages

**Severity:** P2-SEO  
**Confidence:** HIGH  
**File:** `src/components/seo/Seo.astro:72-73`

```html
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

These are hardcoded, not props. If any page uses an og:image with different dimensions, the meta tags lie to crawlers. This was the root cause of NEW-59 (hard-texts og:image was not 1200×630 but meta said it was).

**Repair lane:** `seo-og-dimensions-props`

---

### NEW-STALE-BRANCHES — 5 merged lane branches not cleaned from remote

**Severity:** P3-HYGIENE  
**Confidence:** HIGH  

```
origin/lane/cleanup-orphan-gill-images-2026-07-05:       0 ahead, 10 behind
origin/lane/docs-fix-readme-anchor-2026-07-05:           0 ahead, 11 behind
origin/lane/gill-pre-v16-submenu-frame:                  2 ahead,  3 behind
origin/lane/seo-fix-izbrannoe-canonical-2026-07-05:      0 ahead, 11 behind
origin/lane/seo-fix-og-images-2026-07-05:                0 ahead,  4 behind
```

4 of 5 are fully merged (0 ahead). 1 (`gill-pre-v16-submenu-frame`) has 2 commits ahead — but those were merged via a different commit path.

**Repair lane:** `cleanup-stale-branches`

---

### NEW-GITCONFIG-COMMITTED — .gitconfig with agent identity in repo root

**Severity:** P3-HYGIENE  
**Confidence:** HIGH  

File `.gitconfig` with `[user] email = agent@arena.ai, name = Arena Agent` is committed to repo root. This file is picked up by git if no `~/.gitconfig` exists. It's not functional (shouldn't affect CI since CI sets its own user), but pollutes the repo root.

**Repair lane:** `cleanup-gitconfig`

---

### NEW-PREFETCH-UNCONDITIONAL — 5 prefetch hints on every page including self

**Severity:** P3-PERF  
**Confidence:** HIGH  
**File:** `src/layouts/BaseLayout.astro`

5 `<link rel="prefetch">` hints are emitted on every page, including the page itself. Visiting `/about/` prefetches `/about/` again. On mobile = wasted bandwidth.

**Repair lane:** `perf-conditional-prefetch`

---

## 3. SUMMARY

| Category | Count |
|----------|-------|
| Open bugs verified CONFIRMED-CURRENT | 22 |
| Fixed bugs verified | 3 |
| New findings | 5 |
| Total open after this pass | 27 |

### New finding IDs for matrix:

| ID | Severity | Description |
|----|----------|-------------|
| NEW-CACHE-BUST-ASTRO | P2 | Runtime CSS ?v= empty on 53 Astro pages |
| NEW-OG-DIMENSIONS-HARDCODED | P2 | og:image:width/height hardcoded, not props |
| NEW-STALE-BRANCHES | P3 | 5 merged remote branches not deleted |
| NEW-GITCONFIG-COMMITTED | P3 | .gitconfig agent identity in repo |
| NEW-PREFETCH-UNCONDITIONAL | P3 | 5 prefetch hints on every page including self |
