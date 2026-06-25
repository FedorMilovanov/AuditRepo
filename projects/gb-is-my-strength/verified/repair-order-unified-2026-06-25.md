# Unified Repair Order — gb-is-my-strength — 2026-06-25

**Status:** `repair-ready`  
**Sources:** Arena Agent (premium surface) + Arena Agent Round 3 (system tooling)  
**Cross-reference:** `verification/cross-reference/cross-reference-synthesis-2026-06-25.md`

---

## Phase 0 — Critical blockers (must fix before anything else)

### 0.1 Create post-build hash sync for Astro (fixes P0-10)

**Bug:** All Astro components have stale hardcoded asset hashes — premium controls never update.

**Fix:** Create `scripts/astro-cache-bust-postbuild.js`:
```js
// After Astro build: update ?v=HASH in dist/**/*.html
// using current cache-bust.js hashes
// Run as: npm run astro:build && node scripts/astro-cache-bust-postbuild.js
```

**Integrate into pipeline:**
- Update `strangler:build` to run this script after Astro build
- Or: modify `cache-bust.js` to also scan `dist/**/*.html` after build

**Verification:** After fix, grep `dist/**/*.html` for `?v=202876c3` should return 0.

---

## Phase A — Shared runtime first (fix the controller)

### A.1 Fix `qs is not defined` crash (PS-01)

**Bug:** `floating-cluster-controller.js` calls `qs()` before it is defined on some routes.

**Fix:** Ensure `qs` is loaded before controller initialization. Check module loading order in `site.js`.

**Verification:** `npm run interactive-audit` should show 0 `PAGE_ERROR: qs is not defined`

---

### A.2 Fix Gill Rail SAVE button (P0-1)

**Bug:** `data-action="save"` not handled by `initActionHandlers()`.

**Fix:** Add save handler to `floating-cluster-controller.js`:
```js
// In initActionHandlers():
case 'save': 
  // Implement save functionality
  break;
```

---

### A.3 Fix theme.js for GBS buttons (P1-13)

**Bug:** `theme.js` doesn't wire `data-gbs2-theme` buttons on premium pages.

**Fix:** Add to `theme.js`:
```js
var gbsToggle = document.querySelector('[data-gbs2-theme]');
if (gbsToggle) {
  gbsToggle.addEventListener('click', toggleTheme, { signal: signal });
}
```

---

### A.4 Fix Gill duplicate IDs (PS-07)

**Bug:** `GillRailControls.astro` hardcodes `id="gbsTheme"` and `id="gbsSearch"` twice (mobile + desktop).

**Fix:** Use unique IDs or class-based targeting:
```html
<!-- Mobile: -->
<button class="gbs2-mctl" data-gbs2-theme aria-label="Тема">
<!-- Desktop: -->
<button class="gbs2-ctl" data-gbs2-theme aria-label="Тема">
```

Remove hardcoded IDs from controller-initialized elements.

---

## Phase B — Cache-bust synchronization

### B.1 Add missing assets to cache-bust.js (P0-7 + P0-8)

**Bug:** `css/site-layered.css` and `js/site-modules.js` in SW precache but NOT in cache-bust.

**Fix:** Add to `scripts/cache-bust.js` ASSETS:
```js
'css/site-layered.css',
'js/site-modules.js',
```

---

### B.2 Dynamic cache-bust list in audit-pro.js (P1-9)

**Bug:** `audit-pro.js` CACHE_BUST_ASSETS is hardcoded copy, diverged from real cache-bust.

**Fix:** Parse ASSETS array dynamically from cache-bust.js source:
```js
const cbSrc = fs.readFileSync('scripts/cache-bust.js', 'utf8');
const assetsMatch = cbSrc.match(/const\s+ASSETS\s*=\s*\[([\s\S]*?)\];/);
const dynamicAssets = [...assetsMatch[1].matchAll(/'([^']+)'/g)].map(m => m[1]);
```

---

### B.3 Add hash validation to dist-publication-audit.js (P1-11)

**Bug:** Audit is blind to P0-10.

**Fix:** Add `checkAssetHashConsistency()` function to audit.

---

## Phase C — CI/CD fixes

### C.1 Fix CI cascade race condition (P0-6)

**Bug:** `indexnow.yml` git push fails on concurrent workflow push.

**Fix:** Use GitHub API for commit creation OR:
```bash
git push || echo "⚠️ Push rejected — continuing with build"
# Don't exit non-zero on push rejection
```

---

### C.2 Remove redundant cache-bust in deploy.yml (P2-11)

**Bug:** deploy.yml runs cache-bust after indexnow already did it.

**Fix:** Remove `cache-bust.js` step from deploy.yml OR make it a no-op if hashes unchanged.

---

## Phase D — Route-level content/meta

### D.1 Remove Hermeneutics stray `76e7365` (PS-05)

**Bug:** Literal hash text survives into body of hermeneutics article.

**Fix:** Find and remove from source MDX.

---

### D.2 Fix Hermeneutics readTime drift (PS-06)

**Bug:** Hidden Pagefind shows `readTime=35`, visible shows `50 мин`.

**Fix:** Align `data-pagefind-meta="readTime"` with visible byline.

---

### D.3 Fix sitemap.xml and search-manifest.json incompleteness (P1-2, P1-3)

**Bug:** Missing karty routes (13), baptisty-rossii subroutes (10), map, rodosloviye.

**Fix:** Add missing URLs to both files.

---

### D.4 Fix ASTRO_PAGE_HEAD_MAP incompleteness (P1-4)

**Bug:** update-meta.js only syncs 10 articles, missing baptisty/karty/nagornaya.

**Fix:** Add all article PageHead files to `ASTRO_PAGE_HEAD_MAP`.

---

## Phase E — Audit/tooling cleanup

### E.1 Update interactive-audit selectors (PS-08, PS-09)

**Bug:** Audit misses `#gbFcTheme`, `.gb-theme-toggle`, GBS v16 shell markers.

**Fix:** Update selectors in `interactive-audit.js`:
- Add `#gbFcTheme`, `.gb-theme-toggle`, `#gbsTheme`
- Update Gill context shell expectations to v16

---

### E.2 Fix build-indexnow-urls fallback (P1-10)

**Bug:** git diff fails on merge → empty IndexNow payload.

**Fix:** Add graceful fallback:
```js
if (inputFiles.length === 0) {
  console.warn('⚠️ No changed files — notifying all baseline URLs');
  addAllPublic();
}
```

---

### E.3 Visual parity coverage expansion (P2-9)

**Bug:** Screenshots check 12 routes, contract checks 19.

**Fix:** Extend visual-parity-screenshots routes to full set (nagornaya/chast-2..chast-5, etc.)

---

## Phase F — SW / precache cleanup

### F.1 Remove unused precache entries (P2-14)

**Bug:** `series-cards.js` precached but unused in strict-native pages.

**Fix:** Remove from `sw.js` PRECACHE_ASSETS.

---

### F.2 Auto-update CACHE_VERSION from cache-bust (P2-4)

**Bug:** CACHE_VERSION in sw.js is manual, not synced.

**Fix:** Add script to sync CACHE_VERSION with cache-bust output date.

---

## Verification checklist

After all fixes:
- [ ] `npm run interactive-audit` passes (0 PAGE_ERROR, 0 console-error)
- [ ] grep `dist/**/*.html` for `?v=202876c3` returns 0
- [ ] grep `dist/**/*.html` for `?v=fed3ec3b` returns 0
- [ ] `npm run validate:static-publication` passes
- [ ] `npm run data:consistency` passes
- [ ] IndexNow submits full URL list (not just homepage)
- [ ] Hermeneutics page has no stray `76e7365` in body
- [ ] Gill pages have no duplicate IDs
- [ ] P0-10 post-build script creates working dist

---

## Parallelization hints

| Can run in parallel | Depends on |
|---------------------|------------|
| A.1 + A.2 + A.3 | None |
| A.4 | After A.1 (controller stable) |
| B.1 | None |
| B.2 | B.1 (list complete first) |
| B.3 | After Phase 0 (hash fix exists) |
| C.1 + C.2 | None |
| D.1 + D.2 | None |
| D.3 + D.4 | None |
| E.1 | After A.1 (runtime stable) |
| E.2 + E.3 | None |
| F.1 + F.2 | After B.1 |

**Order:** Phase 0 (P0-10 fix) → A.1 → (B.1 in parallel with A) → B.2 → B.3 → then rest in parallel
