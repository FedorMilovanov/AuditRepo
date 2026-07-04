# Deletions Audit — Pass 64 Deep Verification

**Agent:** arena-agent  
**Date:** 2026-07-05  
**Source HEAD:** `6e68d7ca` (after BUG-CI-001 fix)

---

## Executive Summary

Проверена история удалений за июнь-июль 2026. Все удаления корректны — удалён только dead code, duplicate файлы и экспериментальные артефакты. **Регрессий не обнаружено.**

---

## Verified Deletions

### 1. GillRailControls.astro (commit 86827c18)
- **Status:** ✅ Correct deletion
- **Reason:** Not imported by any component — dead since refactoring to SeriesLiteCluster
- **Verification:** 
  - `grep -r "GillRailControls" src/components/` — 0 references
  - Audit scripts (`gill-context-visual-parity-audit.js`) still pass ✅
  - Regex replacements in audit scripts are harmless (no-op when tags not found)

### 2. site-layered.css (commit 47a98da1)
- **Status:** ✅ Correct deletion
- **Reason:** 283KB experimental CSS for "РЕФАКТОРИНГ 6.0 Phase 2", never connected to any HTML
- **Verification:**
  - `grep -i "site-layered" index.html about/index.html` — 0 references
  - Not in any `<link>` tag

### 3. premium-controls controllers (commit a8dc336f)
- **Status:** ✅ Correct deletion
- **Files:** 6 TypeScript files (~67KB) in `src/lib/premium-controls/`
- **Reason:** Zero imports from any other file
- **Verification:**
  - Directory `src/lib/premium-controls/` does not exist
  - No broken imports in codebase

### 4. legacyFullDocument.ts, legacyShadow.ts (commit c6135cbc)
- **Status:** ✅ Correct deletion
- **Reason:** Replaced by new architecture
- **Verification:**
  - `grep -r "legacyFullDocument\|legacyShadow" src/` — 0 references

### 5. _headers (commit 47a98da1)
- **Status:** ✅ Correct deletion
- **Reason:** "useless on GitHub Pages, REG-001"
- **Explanation:** `_headers` file is used by Cloudflare/Netlify for custom HTTP headers. GitHub Pages does not support custom headers via file — CSP headers are set via `<meta>` tags in HTML.
- **Verification:** CSP meta tags present on all 51 pages (NEW-61 fix)

### 6. yandex_d8876d66da1b4592.html (commit 47a98da1)
- **Status:** ✅ Correct deletion
- **Reason:** Duplicate Yandex verification file
- **Verification:** Current file `yandex_42bc0d54a1ca4952.html` exists and is valid

### 7. js/modules/back-to-top.js (commit 47a98da1)
- **Status:** ✅ Correct deletion
- **Reason:** "never loaded, site.js has inline handler"
- **Verification:** site.js contains inline back-to-top handler

### 8. js/series-cards.js (commit 47a98da1)
- **Status:** ✅ Correct deletion
- **Reason:** "data-series-cards attr not used on any page"
- **Verification:** No `data-series-cards` attribute in HTML files

### 9. Audit reports (commit c7f0e796)
- **Status:** ✅ Correct deletion
- **Files:** 15 stale audit reports from `audit/` directory
- **Reason:** Pre-2026-06-25 audit artifacts per repo policy
- **Verification:** All audits completed and findings addressed

### 10. css/premium-controls.css (commit 3bed8e7e)
- **Status:** ✅ Correct deletion
- **Reason:** Replaced by floating-cluster.css with gb-* classes
- **Verification:** No references to premium-controls.css in HTML or Astro components

### 11. js/modules/* (commit e2041042)
- **Status:** ✅ Correct deletion
- **Files:** faq-accordion.js, img-loaded.js, theme.js, site-modules.js, bundle-modules.js
- **Reason:** Functionality merged into site.js monolith
- **Verification:** site.js contains all handlers

---

## Regression Checks

### Asset References
- **Script references:** 272 total, 0 broken ✅
- **CSS references:** 175 total, 0 broken ✅
- **All paths resolve correctly** (relative and absolute)

### JSON-LD
- **Total blocks:** 63
- **Valid:** 63 ✅
- **Invalid:** 0

### CSS Variables
- **Defined:** 252
- **Used:** 235
- **Used but not defined:** 48
  - 13 set dynamically via JS (setProperty) ✅
  - 35 have fallback values in `var(--name, fallback)` ✅
  - 0 truly missing

### Cache-Bust Consistency
- **Total assets:** 22
- **Versions match:** 22 ✅
- **Mismatches:** 0

### Audit Scripts
- **gill:context:visual-parity:audit:** PASS ✅
  - Note: Regex for `<GillRailControls />` is harmless no-op (component deleted)
  - Word-count within tolerance (drift=109)
  - H2 parity within tolerance

---

## Conclusion

**Все удаления корректны. Регрессий не обнаружено.**

Удалённые файлы были:
- Dead code (zero imports/references)
- Duplicate files (yandex verification)
- Experimental artifacts (site-layered.css)
- Platform-incompatible files (_headers for GitHub Pages)
- Stale audit reports

Система cache-bust работает корректно, все asset references валидны, JSON-LD корректен.

---

## BUG-CI-001 Fix

**Commit:** `6e68d7ca`  
**Fix:** Deleted duplicate `run:` key in deploy.yml line 156  
**Result:** `gill:pre-v16-submenu:audit` (105 checks) now runs in CI ✅

---

*Deletions audit completed per AuditRepo multi-witness verification protocol.*
