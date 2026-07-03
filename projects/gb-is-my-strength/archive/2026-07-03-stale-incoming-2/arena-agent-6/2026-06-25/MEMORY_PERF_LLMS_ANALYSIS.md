# Final Deep Analysis — Memory Leaks, Performance, llms.txt, Code Quality
**Agent:** arena-agent-6
**Date:** 2026-06-25
**Method:** Source code analysis, production comparison, code quality audit

---

## 1. MEMORY LEAK ANALYSIS

### Event Listener Balance

| File | addEventListener | removeEventListener | Status |
|---|---|---|---|
| map-engine.js | 43 | 1 (bulk cleanup) | ✅ Has `_cleanupAll()` |
| avraam-app.js | 70 | 0 | ❌ NO cleanup — memory leak |
| site.js | 194 | 13 | ⚠️ 14.9 adds per remove |
| enhancements.js | 48 | 1 | ⚠️ Heavy listener load |
| fc-controller.js | 17 | 0 | ⚠️ No cleanup |
| nagornaya-mobile-toc.js | ~30 | 0 | ⚠️ No cleanup |

### Critical: avraam-app.js (70 listeners, 0 removes)
- No `destroy()`, `cleanup()`, or `dispose()` function
- No `beforeunload` or `pagehide` handler
- If user navigates away and back, listeners accumulate
- 6 `window.*` assignments for debugging (global pollution)

### Mitigating Factor
This is a static site (not SPA), so full page refresh clears memory. But for extended map usage (30+ minutes), memory could grow.

### Recommendation
- Add `window.addEventListener('beforeunload', cleanup)` to avraam-app.js
- Add cleanup function that removes all 70 listeners
- Consider using AbortController for automatic cleanup

---

## 2. llms.txt ACCURACY

### Status: 28 of 52 routes MISSING

llms.txt has 25 URLs but the site has 52 routes. Missing:
- All 10 baptisty-rossii article routes
- All 8 karty subroutes
- /map/
- /rodosloviye/
- /nagornaya/chast-1/ through chast-5/
- /nagornaya/istochniki/
- /nagornaya/nakhodki/
- /nagornaya/seriya/

### Recommendation
Update llms.txt to include all 52 routes, or at minimum the 10 baptisty articles and 8 karty subroutes.

---

## 3. PERFORMANCE METRICS

### Asset Sizes
| Category | Size | Notes |
|---|---|---|
| JS (root) | 384KB | site.js (166KB) is the largest |
| CSS (root) | 780KB | site-layered.css (283KB) is DEAD |
| Fonts | 868KB | Self-hosted, good |
| Images | 27MB | WebP format, reasonable |
| Nagornaya | 984KB | Includes 34KB Tailwind |

### Largest Images
| File | Size |
|---|---|
| gill-bunhill-fields.jpg | 573KB |
| gill-bunhill-fields.webp | 557KB |
| gill-bunhill-fields-900w.webp | 448KB |
| gill-wesley-debate.jpg | 415KB |

### Production Page Sizes
| Page | HTML Size |
|---|---|
| Homepage | 62KB |
| Gill Part1 | 146KB |
| Nagornaya chast-1 | 133KB |
| Avraam map | 7KB (shell only) |
| Baptisty noch-na-kure | 34KB |
| Konfessii baptizm | 13KB |

---

## 4. CODE QUALITY METRICS

### map-engine.js
- 2635 lines, 164KB
- 71 named functions
- 43 addEventListener, 1 removeEventListener (bulk cleanup)
- ✅ Has `_cleanupAll()` function
- ✅ Properly manages timers and animation frames

### avraam-app.js
- 2408 lines, 190KB
- 70 addEventListener, 0 removeEventListener
- ❌ NO cleanup function
- ❌ 6 window.* global assignments
- ⚠️ Potential memory leak on extended use

### site.js
- 569 lines (minified), 166KB
- 194 addEventListener, 13 removeEventListener
- ⚠️ No source map — impossible to audit
- ⚠️ 14.9 adds per remove ratio

---

## 5. SEO COMPLETENESS

### Articles (11 checked): ✅ ALL COMPLETE
All articles have: title, description, canonical, og:image, og:title, json-ld, h1, robots

### Nagornaya (10 checked): ✅ ALL COMPLETE

### Baptisty (12 checked): ✅ ALL COMPLETE

### Missing from sitemap/search-manifest:
- 8 karty subroutes
- 1 konfessii app route (not a real page)

---

## 6. VISUAL PARITY SYSTEM

### Scripts: 16 visual-parity scripts exist
- Individual audits for each section (about, articles, baptisty, gill, etc.)
- Main orchestrator: `visual-parity-screenshots.js`
- Uses Playwright for screenshots
- Threshold: 0.5% pixel diff

### Status: NOT CI-blocking
Visual parity runs locally but does NOT block deployment. This is the root cause of CSS regressions.

---

## 7. COMPLETE FINDINGS SUMMARY

### New bugs from this session:
| ID | Sev | Title |
|---|---|---|
| NEW-11 | P2 | avraam-app.js memory leak (70 listeners, 0 cleanup) |
| NEW-12 | P2 | llms.txt missing 28 of 52 routes |
| NEW-13 | P3 | site.js 194 addEventListener vs 13 removeEventListener |
| NEW-14 | P3 | enhancements.js 48 addEventListener vs 1 removeEventListener |

### Positive findings:
- ✅ Production sw.js parses correctly
- ✅ All production pages return 200
- ✅ SEO completeness: 100% for articles, nagornaya, baptisty
- ✅ map-engine.js has proper cleanup (`_cleanupAll()`)
- ✅ Pagefind integration working (45 Astro components)
- ✅ JSON-LD valid on all checked pages

---

## 8. FINAL RECOMMENDATIONS (Updated Priority)

### CRITICAL (do now)
1. Run `node scripts/update-meta.js --all` — fix feed.xml weekdays
2. Populate MDX files with full content before any migration
3. Fix sw.js source-production drift

### HIGH (this week)
4. Add 8 karty routes to sitemap/search-manifest/llms.txt
5. Remove site-layered.css from sw.js precache
6. Delete 10 orphaned scripts + 12 root HTML files
7. Add cleanup to avraam-app.js (memory leak)

### MEDIUM (this sprint)
8. Add concurrency group to IndexNow workflow
9. Make visual:parity:guard blocking in CI
10. Add 24h guard to auto-update scripts
11. Integrate Nagornaya Tailwind into @layer architecture
12. Reduce !important from 202 to ≤150

### LOW (backlog)
13. Decompose site.js into modules with source maps
14. Lazy-load avraam-app.js (190KB for one page)
15. Audit search.js innerHTML for XSS
16. Move inline scripts to external + nonce-based CSP
17. Update llms.txt with all 52 routes
