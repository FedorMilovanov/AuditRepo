# Regression Analysis + Test Recommendations
**Agent:** arena-agent-6
**Date:** 2026-06-25
**Method:** Git history analysis (200+ commits), deleted files audit, test suite review

---

## 1. REGRESSION PATTERNS FOUND

### 1.1 Parallel Agent Conflicts (CRITICAL)
**Pattern:** Multiple agents modifying the same files simultaneously → reverts.

| Commit | Regression | Root Cause |
|---|---|---|
| `a32e31e8` | html.dark×5 re-introduced by auto-cache-bust after manual collapse | Auto-update script overwrites manual fixes |
| `88be1928` | font-family CSS vars broke mobile rendering | Font tokenization without mobile testing |
| `9d590d98` | Рефакторинг 5.0 blanket shadow-wrapped 20 NATIVE routes | Migration script didn't check if route was already native |
| `2d35a384` | v14 CSS changes broke home.css + site.css | CSS refactor without visual parity gate |
| `91a1e882` | Broken GBS rollout on main | Feature branch merged without full audit |

**Root cause:** No blocking CI gate for visual parity. Auto-update scripts (`chore: auto-update meta, cache-bust`) run on EVERY commit and can overwrite manual CSS/HTML fixes.

**Recommendation:** 
- Make `visual:parity:guard` BLOCKING in deploy.yml
- Add `--no-overwrite-manual` flag to auto-update scripts
- Require `guard:shared-files` before merge

### 1.2 _legacy/ Deletion — Orphaned Scripts (MEDIUM)
**Pattern:** `_legacy/` directory deleted but scripts still reference it.

**10 orphaned scripts:**
1. `scripts/about-visual-parity-audit.js` (3 refs)
2. `scripts/article-mdx-pilot-audit.js` (8 refs)
3. `scripts/articles-visual-parity-audit.js` (4 refs)
4. `scripts/baptisty-rossii-visual-parity-audit.js` (2 refs)
5. `scripts/baptisty-series-shadow-audit.js` (1 ref)
6. `scripts/catalogs-visual-parity-audit.js` (1 ref)
7. `scripts/check-route-migration-matrix.js` (19 refs!)
8. `scripts/extract-native-pilot.js` (3 refs)
9. `scripts/extract-url-contract.js` (1 ref)
10. `scripts/legacy-shadow-wrapper-audit.js` (references shadow-wrap)

**Impact:** These scripts will fail or produce wrong results if run. They're likely not in CI anymore, but they pollute the codebase and confuse agents.

### 1.3 sw.js Source-Production Drift (P0 — already filed as NEW-01)
**Pattern:** Source sw.js has syntax error, production sw.js is correct.

**Root cause:** The production build generates its own sw.js (via strangler pipeline), but the source repo version was corrupted by a minifier or manual edit.

### 1.4 Auto-Update Scripts Overwriting Manual Fixes (CRITICAL)
**Pattern:** `chore: auto-update meta, cache-bust [skip ci]` commits appear 15+ times in recent history. These scripts:
- Update cache-bust hashes in HTML
- Update meta tags (modified_time, etc.)
- Can overwrite manual CSS/HTML fixes made by agents

**Evidence:** Commit `a32e31e8` explicitly says "reverted by parallel agent" — the auto-update script re-introduced html.dark multi-nesting that was manually fixed.

---

## 2. DELETED FILES ANALYSIS

### 2.1 Correctly Deleted (no loss)
- `css/gill-v16.css` — replaced by inline styles in Astro components ✅
- `scripts/convert-fc-to-gb.py` — one-time migration script ✅
- `scripts/baptisty-rossii-migrate.mjs` — one-time migration ✅
- `scripts/check-mdx-html-parity-v2.js` — replaced by v1 ✅
- `scripts/gill-part{1,2,3}-visual-parity-audit.js` — replaced by generic audit ✅
- `scripts/route-shadow-taxonomy.js` — shadow-wrap concept retired ✅
- All `_legacy/*.html` fragments — pages are now native ✅

### 2.2 Potentially Valuable Deleted
- `css/gill-v16.css` — if Gill pages need standalone CSS in future, this was the source
- `scripts/route-shadow-taxonomy.js` — useful for understanding migration history

---

## 3. TESTS TO ADD (missing)

### 3.1 sw.js Syntax Validation (CRITICAL — catches NEW-01)
```javascript
// scripts/check-sw-syntax.js
'use strict';
const code = require('fs').readFileSync('sw.js', 'utf8');
try {
  new Function(code);
  console.log('✅ sw.js parses as valid JavaScript');
} catch (e) {
  console.error('❌ sw.js SYNTAX ERROR:', e.message);
  process.exit(1);
}
```
**Add to:** `validate:static-publication`, `deploy.yml`

### 3.2 feed.xml Weekday Validation (catches V2-4)
```javascript
// scripts/check-feed-weekdays.js
'use strict';
const { parseString } = require('xml2js'); // or manual regex
const weekdays = { Mon:0, Tue:1, Wed:2, Thu:3, Fri:4, Sat:5, Sun:6 };
// Parse each <pubDate>, verify weekday matches actual date
```
**Add to:** `validate:static-publication`

### 3.3 Sitemap Completeness Check (catches P1-2/NEW-05)
```javascript
// Already exists partially in audit-pro.js, but needs:
// - Compare sitemap.xml URLs against page-ownership.json routes
// - Flag any route missing from sitemap
```
**Add to:** `validate:static-publication`

### 3.4 Astro Hash Staleness Check (catches P0-10/NEW-02/NEW-03)
```javascript
// scripts/check-astro-hash-staleness.js
// For each ?v=HASH in src/**/*.astro:
//   1. Resolve the asset file path
//   2. Compute current MD5
//   3. Compare with embedded hash
//   4. Flag mismatches
```
**Add to:** `validate:static-publication`

### 3.5 TOC Anchor Validation (catches V2-1)
```javascript
// scripts/check-toc-anchors.js
// For each route with TOC (Gill, Nagornaya, Baptisty):
//   1. Extract TOC href="#xxx" from PageChrome
//   2. Extract body id="xxx" from root HTML / Astro body
//   3. Report mismatches
```
**Add to:** `validate:static-publication`

### 3.6 audit-pro/cache-bust ASSETS Sync Check (catches P1-9)
```javascript
// Already exists partially, but needs:
// - Compare audit-pro CACHE_BUST_ASSETS with cache-bust.js ASSETS
// - Flag divergences
```

---

## 4. TESTS TO REMOVE (obsolete)

### 4.1 `baptisty-series-shadow-audit.js`
**Why obsolete:** Checks for `loadLegacyFullDocument` which no page uses. The FORBIDDEN list (`loadLegacyFullDocument`, `headHtml`, `bodyHtml`, `?raw`, `_legacy`) is now guaranteed by architecture.

### 4.2 `legacy-shadow-wrapper-audit.js`
**Why obsolete:** No shadow wrappers remain. All pages are strict-native.

### 4.3 `check-route-migration-matrix.js`
**Why obsolete:** References `_legacy/` 19 times. Migration is complete. Script will fail on missing files.

### 4.4 `extract-native-pilot.js`
**Why obsolete:** All pages are already native. No more "pilot extraction" needed.

### 4.5 `extract-url-contract.js`
**Why review:** May still be useful for contract extraction, but references legacy concepts.

### 4.6 `baptisty-roadmap-audit.js`
**Why review:** Check if still relevant now that baptisty is fully native.

---

## 5. TESTS TO STRENGTHEN

### 5.1 `sw-dist-readiness-audit.js` — add syntax check
Currently checks asset presence but NOT JavaScript syntax. Add `new Function(sw)` check.

### 5.2 `audit-pro.js` — add hash staleness check
Currently checks hash presence but NOT whether hashes match current file content.

### 5.3 `visual-parity-screenshots.js` — make CI-blocking
Currently runs but doesn't block deploy. Should be `continue-on-error: false`.

### 5.4 `check-data-consistency.js` — add feed.xml weekday check
Currently checks data consistency but not feed.xml date accuracy.

---

## 6. CI/CD RECOMMENDATIONS

### 6.1 Add to deploy.yml (blocking)
```yaml
- name: Validate sw.js syntax
  run: node -e "new Function(require('fs').readFileSync('sw.js','utf8'))"

- name: Check feed.xml weekdays
  run: node scripts/check-feed-weekdays.js

- name: Check Astro hash staleness
  run: node scripts/check-astro-hash-staleness.js
```

### 6.2 Remove from CI (obsolete)
- Any reference to `baptisty-series-shadow-audit` in package.json scripts
- Any reference to `legacy-shadow-wrapper-audit` in package.json scripts
- `check-route-migration-matrix` from validate chain

### 6.3 Fix auto-update scripts
Add guard: "Do not overwrite files modified in last 24h by non-automated commits"
```javascript
// In auto-update script:
const lastManualCommit = execSync('git log -1 --format=%ct -- .').toString().trim();
const hoursSinceManual = (Date.now()/1000 - lastManualCommit) / 3600;
if (hoursSinceManual < 24) {
  console.log('Skipping — recent manual commit detected');
  process.exit(0);
}
```

---

## 7. REGRESSION RISK MATRIX

| Area | Risk | Why |
|---|---|---|
| CSS changes | **HIGH** | No blocking visual parity gate → agents can break styles |
| JS changes | **HIGH** | No source map for site.js → hard to verify |
| sw.js changes | **HIGH** | No syntax check in CI → NEW-01 happened |
| Astro components | **MEDIUM** | Hash staleness not checked → P0-10 pattern |
| feed.xml | **LOW** | Weekday bugs don't break functionality |
| sitemap.xml | **LOW** | Missing routes affect SEO only |
| _legacy/ refs | **LOW** | Orphaned scripts don't affect production |
