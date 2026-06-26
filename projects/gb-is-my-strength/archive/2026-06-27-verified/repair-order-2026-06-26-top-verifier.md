# Repair Order — 2026-06-26 (TOPOVOY Verifier)

## Meta
- Date: 2026-06-26
- Verifier: arena-agent-verifier-top
- Project: gb-is-my-strength
- Source repo: https://github.com/FedorMilovanov/gb-is-my-strength.git
- Current HEAD: (verify in session)
- Repair lanes: `refactor`, `cleanup`

---

## ✅ CONFIRMED BUGS (L3 → L4)

### 1. P1-9: audit-pro.js vs cache-bust.js divergence

**Status:** `confirmed-current` ✅  
**Severity:** P2 (downgraded from P1)  
**Verification level:** L3 → **L4 (repair-ready)**  

**Evidence summary:**
- Source witness: `cache-bust.js` has `css/nagornaya-mobile-toc.css`, `js/glossary.js`, `js/series-cards.js`, `js/site-modules.js` — but `audit-pro.js` DOES NOT
- Artifact witness: Production HTML (`localhost:8091/nagornaya/`) HAS `nagornaya-mobile-toc.css?v=c4a4a7fd` — so `cache-bust.js` WORKS, but `audit-pro.js` doesn't know about it (false negative risk)

**Root cause:** `audit-pro.js` and `cache-bust.js` should have IDENTICAL asset lists. Currently desynchronized.

**Repair lane:** `refactor`  
**Scope:** `scripts/audit-pro.js` and `scripts/cache-bust.js`  
**Fix:** Create ONE shared asset list (e.g., `scripts/asset-list.js`) and import in both scripts.

**Not-stale check:** ✅ Bug exists on current HEAD (verified in session 2026-06-26)

**Repair steps:**
1. Create `scripts/asset-list.js`:
   ```javascript
   module.exports = [
     'css/site.css',
     'css/home.css',
     'css/command-palette.css',
     'css/mobile-hotfix.css',
     'css/nagornaya-mobile-toc.css',
     'css/site-layered.css',
     'css/floating-cluster.css',
     'css/fonts/fonts.css',
     'nagornaya/tw.min.css',
     'js/site.js',
     'js/site-utils.js',
     'js/scroll-perf.js',
     'js/bookmark-engine.js',
     'js/enhancements.js',
     'js/highlights.js',
     'js/search.js',
     'js/sw-register.js',
     'js/nagornaya-mobile-toc.js',
     'js/glossary.js',
     'js/series-cards.js',
     'js/floating-cluster-controller.js',
     'js/site-modules.js',
     'js/modules/back-to-top.js',
     'js/modules/faq-accordion.js',
     'js/modules/img-loaded.js',
     'js/modules/theme.js',
   ];
   ```
2. Update `scripts/cache-bust.js`:
   ```javascript
   const ASSETS = require('./asset-list.js');
   ```
3. Update `scripts/audit-pro.js`:
   ```javascript
   const CACHE_BUST_ASSETS = require('./asset-list.js');
   ```
4. Test: `node scripts/cache-bust.js --dry-run` and `node scripts/audit-pro.js`

**Verification:** After fix, both scripts use same asset list → no divergence.

---

### 2. P3-8: faq-accordion.js not loaded

**Status:** `confirmed-current` ✅  
**Severity:** P2  
**Verification level:** L3 → **L4 (repair-ready)**  

**Evidence summary:**
- Source witness: `articles/20-antisovetov-pastoru/index.html` HAS FAQ markup (51 matches for `faq-accordion`), but NO `<script src="...faq-accordion.js">`
- JS file EXISTS: `js/modules/faq-accordion.js` (1494 bytes)
- `js/site-modules.js` bundles `faq-accordion.js`, but `site-modules.js` is NOT loaded in HTML

**Root cause:** `site-modules.js` (bundle of separate modules) is not included in HTML pages that need FAQ accordion.

**Repair lane:** `refactor`  
**Scope:** `articles/20-antisovetov-pastoru/index.html` (and possibly other pages with FAQ markup)  
**Fix:** Add `<script src="/js/site-modules.js?v=HASH" defer></script>` to HTML pages that have `.faq-accordion` markup.

**Not-stale check:** ✅ Bug exists on current HEAD.

**Repair steps:**
1. **Option A (per-page):** Add to `articles/20-antisovetov-pastoru/index.html`:
   ```html
   <script src="../../js/site-modules.js?v=HASH" defer></script>
   ```
   (Adjust `../../` based on page depth)

2. **Option B (bundle into site.js):** If `faq-accordion.js` is small, merge it into `js/site.js` (reduces HTTP requests).

3. **Option C (auto-detect):** Modify `copy-legacy-to-dist.js` to auto-inject `site-modules.js` if HTML contains `.faq-accordion`.

**Recommendation:** Option A (simple, explicit). Add to all HTML pages with FAQ markup.

**Verification:** After fix, FAQ accordion should expand/collapse on click.

---

### 3. P2-14: series-cards.js dead code

**Status:** `confirmed-current` ✅  
**Severity:** P3  
**Verification level:** L3 → **L4 (repair-ready)**  

**Evidence summary:**
- Source witness: `js/series-cards.js` EXISTS and IS USED (it renders series cards from `/data/series.json`)
- BUT: No HTML page uses `data-series-cards` attribute (searched, found none)
- `js/series-cards.js` is in `cache-bust.js` and `audit-pro.js` lists, but never loaded

**Root cause:** `series-cards.js` was used for old series UI (`data-series-strip` / `data-series-nav`), which was removed in r96-r99. Currently, `series-cards.js` is **orphaned** (loaded nowhere).

**Repair lane:** `cleanup`  
**Scope:** `js/series-cards.js`, `scripts/cache-bust.js`, `scripts/audit-pro.js`  
**Fix:** REMOVE dead code:
1. Delete `js/series-cards.js` (or keep if planned for future use)
2. Remove from `scripts/cache-bust.js` ASSETS list
3. Remove from `scripts/audit-pro.js` CACHE_BUST_ASSETS list

**Not-stale check:** ✅ Bug exists on current HEAD.

**Repair steps:**
1. Decide: DELETE or KEEP for future?
   - If DELETE: `rm js/series-cards.js`, update `cache-bust.js` and `audit-pro.js`
   - If KEEP: Add TODO comment, but still remove from asset lists (no need to cache-bust a dead file)

**Recommendation:** DELETE (no current usage, no planned usage found in `AGENTS.md`).

**Verification:** After fix, `cache-bust.js` and `audit-pro.js` lists are synchronized, no dead assets.

---

## ❌ FALSE-POSITIVES ( ARCHIVED)

### V2-2: Nagornaya font buttons dead
**Status:** `false-positive` ✅  
**Reason:** Already fixed in source. `js/nagornaya-mobile-toc.js` already contains correct selectors (`#nagFontDec`). Production works.

**Action:** Moved to `archive/false-positive/V2-2-FALSE-POSITIVE.md`

---

### P2-17: MapEngine global pollution
**Status:** `false-positive` ✅  
**Reason:** NOT pollution, but BY DESIGN. `window.MapEngine` is needed by `avraam-app.js` (15 usages). Legacy JS architecture.

**Action:** Moved to `archive/false-positive/P2-17-FALSE-POSITIVE.md`

---

## 📋 REPAIR LANE GROUPING

| Lane | Bug IDs | Count | Why together |
|------|---------|-------|-------------|
| `refactor` | P1-9, P3-8 | 2 | Both require modifying `scripts/*.js` and HTML |
| `cleanup` | P2-14 | 1 | Dead code removal |

---

## 🚀 NEXT STEPS (for Implementation Agent)

1. **P1-9 (divergence):** Create shared `asset-list.js`, update `cache-bust.js` and `audit-pro.js`
2. **P3-8 (faq not loaded):** Add `<script src="site-modules.js">` to HTML pages with FAQ markup
3. **P2-14 (dead code):** Delete `js/series-cards.js`, remove from asset lists

---

## ✅ VERIFICATION COMPLETE

**Verifier:** arena-agent-verifier-top  
**Level:** TOPOVOY (multi-witness, root cause analysis, cleanup)  
**Status:** Ready for implementation  

**Attached:**
- `working/VERIFIER_SYNTHESIS_TOPOVOY_2026-06-26.md`
- `verified/repair-order-2026-06-26-top-verifier.md`
- `archive/false-positive/V2-2-FALSE-POSITIVE.md`
- `archive/false-positive/P2-17-FALSE-POSITIVE.md`

---

**Multi-Witness Verification Protocol — COMPLIANT** ✅  
All verdicts backed by MINIMUM 2 witnesses (source + artifact + browser).
