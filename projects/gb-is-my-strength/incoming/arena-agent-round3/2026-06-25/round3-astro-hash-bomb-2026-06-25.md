# Round 3: Astro Hardcoded Asset Hash Bomb — 2026-06-25

## Agent: arena-agent-round3  
## Severity: P0 — CRITICAL  
## Impact: ALL Astro-owned pages load stale CSS/JS forever

---

## Executive summary

**36+ Astro components** contain hardcoded `?v=HASH` references to CSS and JS assets. These hashes are **never updated** by `cache-bust.js` (which only updates root HTML files). 

As a result:
- Every Astro-owned page (articles catalog, all series, baptisty-rossii, nagornaya, karty, about, biografii, hard-texts, pastor-series, rodosloviye) loads **outdated** CSS/JS
- This affects ALL premium controls (v16 gb-icon, gb-ember, gb-save, gb-floater) — they may be in stale CSS
- The `sw.js` PRECACHE_ASSETS holds the current file hash, but HTML references the old hash → SW serves stale content
- Cache-busting for Astro-owned pages is completely broken

---

## Verified hash mismatches

Script used: Python audit scanning all `src/components/**/*.astro` files.

| Asset | Hardcoded in Astro | Current (cache-bust.js) | Delta | Components |
|-------|-------------------|------------------------|-------|------------|
| `css/site.css` | `202876c3` | `b880b524` | **STALE** | **36** |
| `css/command-palette.css` | `48f8ed38` | `afe33045` | **STALE** | **36** |
| `css/mobile-hotfix.css` | `decfea58` | `c1f7664e` | **STALE** | **36** |
| `js/site.js` | `fed3ec3b` | `133dfac1` | **STALE** | **36** |
| `js/floating-cluster-controller.js` | `c78a4236` | `35a91710` | **STALE** | **10** |
| `js/nagornaya-mobile-toc.js` | `f25219b0` | `ffd00d98` | **STALE** | **9** |
| `css/nagornaya-mobile-toc.css` | `ef840e4c` | `c4a4a7fd` | **STALE** | **9** |

---

## Components with stale `css/site.css?v=202876c3` (should be `?v=b880b524`)

**36 components across all route families:**

### Home / Catalog
- `src/components/home/HomePageHead.astro`
- `src/components/articles/ArticlesPageChrome.astro`
- `src/components/biografii/BiografiiPageChrome.astro`
- `src/components/pastor-series/PastorSeriesPageHead.astro`

### Karty
- `src/components/karty/KartyPageHead.astro`

### Nagornaya (9 components)
- `src/components/nagornaya/index/NagornayaIndexPageHead.astro`
- `src/components/nagornaya/chast-1/NagornayaChast1PageHead.astro` (+ chast-2, chast-3, chast-4, chast-5)
- `src/components/nagornaya/seriya/NagornayaSeriyaPageHead.astro`
- `src/components/nagornaya/istochniki/NagornayaIstochnikiPageHead.astro`
- `src/components/nagornaya/nakhodki/NagornayaNakhodkiPageHead.astro`

### Article pilots (10 Gill articles + 2 more)
- `src/components/article-pilots/antisovetov/AntisovetovPageHead.astro`
- `src/components/article-pilots/gill-context/GillContextPageHead.astro`
- `src/components/article-pilots/gill-part1/GillPart1PageHead.astro` (+ part2, part3)
- `src/components/article-pilots/gill-spravochnik/GillSpravochnikPageHead.astro`
- `src/components/article-pilots/hermenevtika/HermenevtikaPageHead.astro`
- `src/components/article-pilots/kod-da-vinchi/KodDaVinchiPageHead.astro`
- `src/components/article-pilots/krajne/KrajnePageHead.astro`
- `src/components/article-pilots/rimlyanam7/Rimlyanam7PageHead.astro`

### Baptisty-rossii (11 components)
- `src/components/baptisty-rossii/BaptistyRossiiPageHead.astro`
- `src/components/baptisty-rossii/BaptistyRossiiNochNaKurePageHead.astro` (+ 9 more article PageHead'ов)

### About
- `src/components/about/AboutPageChrome.astro`

---

## Root cause analysis

```
Timeline:
1. Pre-REFACTORING 5.0: Shadow-wrap era
   → Astro components contained inline content FROM legacy HTML
   → cache-bust.js updated root HTML → copy-legacy-to-dist copied updated HTML to dist
   → Astro-built pages used legacy HTML as output → hashes were correct

2. REFACTORING 5.0 (2026-06-20): Strict-native Astro pages
   → Astro components generate HTML directly from source
   → Inline hardcoded hashes in components were NEVER updated
   → cache-bust.js still only updates root/ HTML files
   → Astro-owned routes get stale hashes forever

3. After: Multiple premium controls deployments (v16)
   → CSS/JS changed many times
   → cache-bust.js computed new hashes → root HTML updated
   → Astro components still have OLD hardcoded hashes
   → Bug P0-10 persists through all premium rollouts
```

---

## Why existing audits don't catch this

1. `audit-pro.js`: Checks structure (which files exist) and CACHE_BUST_ASSETS list, but CACHE_BUST_ASSETS is a **hardcoded copy** that diverged from real cache-bust.js (bug P1-9)

2. `dist-publication-audit.js`: Checks DOM markers and file presence, NOT hash consistency (bug P1-11)

3. `sw-dist-readiness-audit.js`: Checks PRECACHE_ASSETS vs dist/files, NOT vs HTML hash references

4. `visual-parity-contract.js`: Only checks DOM markers, not asset hash integrity

**Result:** P0-10 is completely invisible to the entire audit suite.

---

## Fix strategy

### Option A: Post-build hash update (immediate, surgical)
```js
// scripts/astro-cache-bust-postbuild.js
// After Astro build: update ?v=HASH in dist/**/*.html
// using current cache-bust.js hashes
```

### Option B: Dynamic hash computation in Astro (medium-term, correct)
```astro
---
import { createHash } from 'node:fs';
// Compute hash at build time
const siteCssHash = createHash('md5')
  .update(readFileSync('css/site.css'))
  .digest('hex').slice(0, 8);
---
<link href="/css/site.css?v={siteCssHash}" rel="stylesheet" />
```

### Option C: Single source of truth (correct, requires full refactor)
- Remove all hardcoded hashes from Astro components
- Use `import` statements for CSS (Astro handles hashing)
- One centralized cache-bust runs on `dist/` after build

---

## P1-11 Detail: dist-publication-audit.js blind to this

The audit reports `✅ dist is Astro-owned landing/full-document shadow output` even when all hashes are stale. The `checkAstroSeriesLandingOwnership()` and `checkAstroArticleOwnership()` functions only verify DOM markers (`home-v20`, `gbs-world`, etc.) — they don't validate asset hashes.

**Fix needed:** Add hash validation to the audit:
```js
function checkAssetHashConsistency(htmlFile) {
  const html = read(htmlFile);
  for (const [asset, cbHash] of Object.entries(currentCacheBustHashes)) {
    const usedHash = html.match(new RegExp(`${asset}\\?v=([a-f0-9]{8})`));
    if (usedHash && usedHash[1] !== cbHash) {
      bad(`Stale hash: ${asset}?v=${usedHash[1]} should be ?v=${cbHash}`);
    }
  }
}
```
