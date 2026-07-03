# Deep Analysis — Security, Performance, Data Integrity
**Agent:** arena-agent-6
**Date:** 2026-06-25
**Method:** Source code analysis, git history, production comparison

---

## 1. SECURITY ISSUES

### 1.1 CSP: unsafe-inline for scripts (MEDIUM)
**File:** Every root HTML page
```
script-src 'self' 'unsafe-inline' https://mc.yandex.ru ...
```
`unsafe-inline` allows inline `<script>` tags, which weakens CSP against XSS. The site uses many inline scripts (theme init, SITE_CONFIG, etc.).

**Fix:** Move all inline scripts to external files + use nonce-based CSP.

### 1.2 CSP: unsafe-eval in 3D app (LOW)
**File:** `konfessii/russkij-baptizm/_app/index.html`
```
script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:
```
`unsafe-eval` is required by Three.js for shader compilation. Isolated to one page via iframe — low risk.

### 1.3 search.js: 15 unescaped innerHTML assignments (MEDIUM)
**File:** `js/search.js`
- 17 total innerHTML assignments
- Only 34 F() escape function calls
- 15 assignments potentially skip F() escaping
- 1 direct `.value` → innerHTML path

**Risk:** If user search terms reach innerHTML without F() escaping, XSS is possible. However, the search terms ARE escaped through F() in the main paths. The unescaped innerHTML assignments are mostly for static UI chrome (backdrop, preview placeholder).

**Recommendation:** Audit each innerHTML path and ensure all user-controlled data goes through F().

### 1.4 robots.txt: intentional SEO blocks (POLICY)
AhrefsBot, SemrushBot, MJ12bot blocked. This is **intentional** per file header comment.

---

## 2. PERFORMANCE ISSUES

### 2.1 Total JS payload: 687KB (HIGH)
| File | Size | Purpose |
|---|---|---|
| map-engine.js | 171KB | Map engine (all map pages) |
| avraam-app.js | 248KB | Avraam map specific |
| site.js | 166KB | Main site bundle |
| enhancements.js | 48KB | GBS2 controls |
| search.js | 33KB | Command palette |
| fc-controller.js | 21KB | Floating cluster |
| **TOTAL** | **687KB** | |

**Issues:**
- `avraam-app.js` (248KB) is ONLY used on one page — should be lazy-loaded
- `site.js` (166KB) is minified without source map — impossible to audit or decompose
- `map-engine.js` (171KB) is loaded on all map pages even if only one feature is used

### 2.2 Total CSS payload: 780KB (HIGH)
| File | Size | Status |
|---|---|---|
| site.css | 283KB | Active |
| site-layered.css | 283KB | **DEAD — not loaded by any page!** |
| home.css | 76KB | Active |
| floating-cluster.css | 69KB | Active |
| command-palette.css | 30KB | Active |
| nagornaya-mobile-toc.css | 22KB | Active |
| mobile-hotfix.css | 16KB | Active |
| **TOTAL** | **780KB** | |

**Critical:** `site-layered.css` (283KB) is dead code. It exists in the repo and is in sw.js precache but NO page loads it. This wastes precache bandwidth.

### 2.3 site-layered.css: 283KB dead CSS (P2)
- Not imported by any Astro component
- Not linked in any root HTML
- IS in sw.js PRECACHE_ASSETS (wastes SW install bandwidth)
- IS in cache-bust.js ASSETS (wastes build time)

**Fix:** Remove from sw.js precache and cache-bust.js ASSETS. Delete the file if not planned for use.

### 2.4 !important count: 202 (target: ≤150)
**File:** `css/site.css`
202 `!important` declarations. The REFACTORING_6_0 target is ≤150.

---

## 3. DATA INTEGRITY

### 3.1 V2-4 ROOT CAUSE FOUND: feed.xml weekday bug
**Root cause:** The old `toRFC` function (before commit `2a9a0242`) was:
```javascript
function toRFC(d) { return new Date(d).toUTCString().replace('GMT', '+0000'); }
```
This computed weekday based on UTC time, not Moscow time. When a date like `2026-05-31T06:00:00Z` was processed, `toUTCString()` returned the correct UTC weekday, but the displayed date was in Moscow time (+3h), causing a mismatch.

**Fix applied:** Commit `2a9a0242` changed toRFC to add +3h:
```javascript
function toRFC(d) { return new Date(new Date(d).getTime() + 3*3600000).toUTCString().replace('GMT', '+0300'); }
```

**NOT fixed:** The feed.xml was never regenerated. Running `node scripts/update-meta.js --all` will fix all 9 wrong weekdays.

### 3.2 readTime drift (NEW-06/PS-06)
Multiple sources of truth for reading time:
1. `series.json` → 32 min (for Hermenevtika)
2. Pagefind meta → 35 min (was in old HTML)
3. Fix lane → 50 min (actual word count / 200)
4. `CANONICAL_READTIME` in update-meta.js → not listed for Hermenevtika

**Fix:** Add Hermenevtika to `CANONICAL_READTIME` in update-meta.js, or compute from word count consistently.

### 3.3 sitemap.xml missing 8 karty routes (NEW-05/P1-2)
The 8 karty subroutes are in `page-ownership.json` but NOT in `sitemap.xml` or `search-manifest.json`.

**Fix:** Add karty subroutes to the sitemap generation logic in `update-meta.js`.

---

## 4. DEAD CODE INVENTORY

### 4.1 Dead CSS files
| File | Size | Status |
|---|---|---|
| css/site-layered.css | 283KB | Not loaded by any page |

### 4.2 Dead/orphaned scripts
| Script | References to _legacy/ | Status |
|---|---|---|
| check-route-migration-matrix.js | 19 | Dead |
| article-mdx-pilot-audit.js | 8 | Dead |
| articles-visual-parity-audit.js | 4 | Dead |
| about-visual-parity-audit.js | 3 | Dead |
| extract-native-pilot.js | 3 | Dead |
| baptisty-rossii-visual-parity-audit.js | 2 | Dead |
| baptisty-series-shadow-audit.js | 1 | Dead |
| catalogs-visual-parity-audit.js | 1 | Dead |
| legacy-shadow-wrapper-audit.js | 1 | Dead |
| extract-url-contract.js | 1 | Dead |

### 4.3 Dead root HTML files
12 root `index.html` files in `about/`, `articles/`, `biografii/`, etc. All routes are astro-owned, so these are NOT copied to production dist.

### 4.4 loadLegacyFullDocument utility
`src/utils/legacyFullDocument.ts` — function exists but is NOT imported by any page. Dead code.

---

## 5. RECOMMENDATIONS

### 5.1 Immediate (P0)
1. Fix sw.js source-production drift (NEW-01)
2. Run `node scripts/update-meta.js --all` to fix feed.xml weekdays (V2-4)

### 5.2 Short-term (P1)
3. Remove `site-layered.css` from sw.js precache and cache-bust.js
4. Add Hermenevtika to CANONICAL_READTIME in update-meta.js
5. Add 8 karty routes to sitemap generation
6. Delete 10 orphaned scripts
7. Delete 12 root HTML files

### 5.3 Medium-term (P2)
8. Make avraam-app.js lazy-loaded (248KB on one page)
9. Decompose site.js into modules with source maps
10. Reduce !important from 202 to ≤150
11. Audit search.js innerHTML for XSS
12. Move inline scripts to external + nonce-based CSP

### 5.4 Long-term (P3)
13. Integrate site-layered.css @layer architecture
14. Integrate nagornaya/tw.min.css into main CSS
15. TypeScript for map-engine.js
16. Remove loadLegacyFullDocument.ts utility
