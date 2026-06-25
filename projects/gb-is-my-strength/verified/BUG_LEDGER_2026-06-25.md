# GB Bug Ledger — gospod-bog.ru
## Updated: 2026-06-25 | Total: 51 bugs (9 P0, 18 P1, 16 P2, 8 P3)

---

## P0 Critical (9 bugs)

| ID | File | Bug | Impact |
|----|------|-----|--------|
| P0-1 | `js/floating-cluster-controller.js` | `data-fc-action="save"` NOP — SAVE handler missing | Gill Rail SAVE button non-functional |
| P0-2 | `css/floating-cluster.css` | EMPTY FILE — only comment header | All v16 styles missing from separate file |
| P0-3 | `robots.txt` | `Disallow: /*?*` for User-agent:* blocks SEO bots | AhrefsBot, SemrushBot, MJ12bot blocked |
| P0-6 | `.github/workflows/indexnow.yml` | CI cascade race condition — git push no retry | Concurrent push → non-fast-forward rejected → cascade to deploy.yml |
| P0-7 | `sw.js` PRECACHE_ASSETS vs `cache-bust.js` ASSETS | `site-layered.css` in SW ✅, NOT in cache-bust ❌ | CSS change → HTML not updated → stale from SW |
| P0-8 | Same as P0-7 | `site-modules.js` in SW ✅, NOT in cache-bust ❌ | JS module changes → stale from SW |
| P0-10 | 36+ Astro components | STALE HARDCODED asset hashes — `cache-bust.js` only updates root HTML | 36 components never get hash updates (v=202876c3 should be b880b524 for site.css) |

---

## P1 High (18 bugs)

| ID | File | Bug | Impact |
|----|------|-----|--------|
| P1-1 | `js/site.js` | Old controls don't check `.has-premium-controls` before init | Premium pages double-init risk |
| P1-2 | `sitemap.xml` | Incomplete (~43 URLs, missing 13 karty + 10 baptisty-rossii + map + rodosloviye) | Missing routes not indexed |
| P1-3 | `data/search-manifest.json` | Incomplete (~44 items, same gaps as sitemap) | Missing routes not searchable |
| P1-4 | `scripts/update-meta.js` | ASTRO_PAGE_HEAD_MAP only 10 articles (missing baptisty, karty, nagornaya) | PageHead timestamps drift |
| P1-5 | Migration conflict | `page-ownership.json` (2026-06-20) vs `route-migration-matrix.json` (2026-06-23) | 19 routes excluded from matrix, 1 dev route orphaned |
| P1-6 | `scripts/copy-legacy-to-dist.js` | Skips copy if dest exists — no timestamp compare | Legacy files not updated in dist |
| P1-7 | `js/search.js` | Hardcoded fallback readTime (89, 41, 30, 50) unvalidated | Incorrect readTime for some articles |
| P1-8 | `js/floating-cluster-controller.js` | Gill rail `[data-fc-root]` double-init (main loop + initGillRail) | Potential crash on Gill pages |
| P1-9 | `scripts/audit-pro.js` | CACHE_BUST_ASSETS hardcoded — diverged from real cache-bust.js | Audit gives false pass |
| P1-10 | `scripts/build-indexnow-urls.js` | git diff fails on merge commits → empty IndexNow payload | Search engines not notified |
| P1-11 | `scripts/dist-publication-audit.js` | Does NOT detect stale hash mismatch | Blind to P0-10 |
| P1-12 | `src/components/karty/KartyPageHead.astro` | Hardcoded stale CSS hash (same P0-10 pattern) | Karty page CSS stale |
| P1-13 | `js/modules/theme.js` | Doesn't wire GBS `data-gbs2-theme` buttons | Premium pages theme toggle non-responsive |
| P1-14 | `src/layouts/SeriesArticleLayout.astro` | GBS2 controls (theme/font/share/search/offline) completely unwired | 10 baptisty-rossii pages + hub + hard-texts controls dead |
| P1-15 | `src/layouts/SeriesArticleLayout.astro` | gbs2-sheet TOC pane always empty — no controller | Mobile readers can't browse article TOC |
| P1-16 | `src/components/baptisty-rossii/BaptistyRossiiBody.astro` | gbs2Curbar/gbs2Count/gbs2Pct progress elements unwired | Progress display misleading on hub page |
| P1-17 | `src/layouts/BaseLayout.astro` | CSS loads without hash while JS uses MD5-hashed scriptTag | SW serves stale CSS, double-fetch on CSS changes |
| P1-18 | `scripts/cache-bust.js` | `site-modules.js` in SW precache but NOT in ASSETS array | Module changes → stale SW cache |

---

## P2 Medium (16 bugs)

| ID | File | Bug | Impact |
|----|------|-----|--------|
| P2-1 | `scripts/visual-parity-screenshots.js` | ~26 of 52+ routes covered | Coverage gap |
| P2-2 | CSS duplication | site.css + site-layered.css overlap | Maintainability |
| P2-4 | `sw.js` | CACHE_VERSION manually updated | Human error risk |
| P2-5 | `.github/workflows/notify-on-failure.yml` | Python3 parser broken — wrong module | Alert failures |
| P2-6 | `feed.xml` | UTC vs Moscow timezone mismatch | Publication date errors |
| P2-7 | `AGENTS.md` | Complexity/hyperlinking issues | Documentation |
| P2-8 | `scripts/cache-bust.js` | ASSETS array has duplicate entries | Maintenance |
| P2-9 | Visual parity coverage | Gap in ~52 routes not checked | Visual drift |
| P2-10 | `sw-dist-readiness-audit.js` | Missing cache-bust sync check | SW cache stale |
| P2-11 | `deploy.yml` | Redundant cache-bust (already in build) | Wasted time |
| P2-12 | `scripts/check-data-consistency.js` | H1 extraction regex fragile | Metadata errors |
| P2-13 | MDX | canonicalOverride routing unclear | URL drift |
| P2-14 | `js/series-cards.js` | Precached but unused | Dead code |
| P2-15 | about/ | Ownership unclear post-refactor | Maintenance |
| P2-16 | `src/components/karty/KartyPageHead.astro` | Hardcoded `?v=202876c3` (should be b880b524) | Karty CSS stale |
| P2-17 | `src/components/karty/avraam/AvraamMap.astro` | Global MapEngine singleton polluted with getPlaceVisual | Cross-map contamination |
| P2-18 | `karty/_engine/map-engine.js` | loadFromHash uses location.pathname — fails on GitHub Pages base href | Broken deep links |

---

## P3 Low (8 bugs)

| ID | File | Bug | Impact |
|----|------|-----|--------|
| P3-1 | `js/search.js` | Fallback → GitHub | External dependency |
| P3-2 | PlayEmber | aria-disabled misapplied | Accessibility |
| P3-3 | path.posix | Edge-case handling | Portability |
| P3-4 | Hardcoded word count floors | Stats drift | Minor inaccuracy |
| P3-5 | `scripts/visual-parity-screenshots.js` | URL lists drift from routes | Maintenance |
| P3-6 | `js/floating-cluster-controller.js` | 10 stale hash refs | Maintenance |
| P3-7 | `src/components/baptisty-rossii/BaptistyRossiiBody.astro` | Empty decorative elements | Visual noise |
| P3-8 | `src/components/article-pilots/antisovetov/AntisovetovBody.astro` | FAQ accordion HTML present but faq-accordion.js never loaded | Non-functional FAQ |
| P3-9 | `src/layouts/BaseLayout.astro` | bodyEndHtml accumulation may create duplicate Yandex.Metrika | Analytics duplication |

---

## FALSE POSITIVES (2 closed)

| ID | Original Claim | Correction |
|----|---------------|------------|
| FP-P0-4 | feed.xml contains raw.githubusercontent.com dead link | grep=0, no such link found |
| FP-P0-5 | cache-bust.js regex `/\./g` broken | Global flag confirmed present, all paths work |

---

## Arena Agent External Findings (incoming/arena-agent/)

| ID | Bug | Category |
|----|-----|----------|
| PS-01 | `qs is not defined` — controller crash on 13 premium routes | Runtime crash |
| PS-02/03 | Dead premium theme/save controls | Premium controls |
| PS-04 | Heart routes: .gb-ember non-functional (no controller) | Premium controls |
| PS-05 | Hermeneutics stray `76e7365` in body | Stale hash |
| PS-06 | Hermeneutics hidden readTime=35 vs visible=50 | Metadata |
| PS-07 | Duplicate IDs gbsTheme/gbsSearch on 4 Gill pages | ID collision |
| PS-08/09 | interactive-audit stale selectors | Audit drift |

---

## Cross-Cutting Root Causes

| Root Cause | Bugs Affected |
|-----------|---------------|
| P0-10 (Astro stale hashes) | P0-7, P0-8, P1-12, P2-16, PS-05, PS-01 |
| Incomplete GBS2 wiring | P1-13, P1-14, P1-15, P1-16, PS-02, PS-03, PS-04 |
| audit-pro blind to hash drift | P1-9, P1-11, P0-10, P1-18 |
| CI cascade race condition | P0-6 |
| Theme.js partial implementation | P1-13, P1-14 |
| BaseLayout CSS vs JS asymmetry | P1-17 |

---

## Repair Priority

**Phase 0 (Immediate):** P0-3 (robots.txt), P0-10 (Astro hash sync)
**Phase 1 (This week):** P1-14/P1-15/P1-16 (GBS2 wiring), P0-6 (CI cascade), P1-17 (CSS hash)
**Phase 2 (Next week):** P1-2/P1-3/P1-4 (sitemap/manifest/meta), P0-7/P0-8 (cache-bust sync)
**Phase 3 (Sprint):** Remaining P1s and P2s
