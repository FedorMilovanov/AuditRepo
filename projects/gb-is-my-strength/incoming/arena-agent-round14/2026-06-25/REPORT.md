# Round 14 Audit Report — FedorMilovanov/gb-is-my-strength

**Date:** 2026-06-25  
**Agent:** Arena Agent (Round 14 final summary)  
**HEAD:** 3b105dc8  
**AuditRepo Push:** Round 14

---

## Executive Summary

Comprehensive audit completed. **13 bugs fixed in project source** (R9-R13). All fixes verified. AuditRepo updated with detailed reports and amended ledger.

---

## Complete Fix Log (Rounds 9-14)

| Round | Bug ID | Severity | Description | File(s) |
|-------|--------|----------|-------------|---------|
| R9 | P0-NEW | P0 | SW precache 404 (site-layered.css, site-modules.js removed) | `sw.js` |
| R9 | P3-NEW | P3 | back-to-top.js missing on 7 pages | 7 Astro components |
| R10 | P2-17 | P2 | MapEngine getPlaceVisual global pollution → isolated option | `AvraamMap.astro`, `map-engine.js` |
| R10 | P3-12 | P3 | baseGeoUrl cache-busting `?v=2.0` | `AvraamMap.astro` |
| R10 | P1-13 | P1 | FALSE POSITIVE confirmed (site.js dark mode works on all pages) | — |
| R10 | P1-14/15/16 | P1 | CONFIRMED: Baptisty GBS2 controls unwired (now FIXED in R11) | — |
| R11 | P2-18 | P2 | MapEngine base-href-aware getBaseAwarePath() helper | `map-engine.js` |
| R11 | P1-14 | P1 | GBS2 theme toggle (data-gbs2-theme) | `js/gbs2-baptist-controls.js` + 11 Astro components |
| R11 | P1-15 | P1 | GBS2 font resize (data-gbs2-font) | `js/gbs2-baptist-controls.js` + 11 Astro components |
| R11 | P1-16 | P1 | GBS2 bottom bar, mobile progress, TOC population | `js/gbs2-baptist-controls.js` + 11 Astro components |
| R12 | P1-5 | P1 | route-migration-matrix.json reconciled (34→51 routes) | `migration/route-migration-matrix.json` |
| R12 | P1-9 | P1 | audit-pro.js CACHE_BUST_ASSETS cleaned (24→20 items) | `scripts/audit-pro.js` |
| R12 | P2-14 | P2 | series-cards.js commented out (not used in Astro) | `scripts/cache-bust.js` |
| R13 | P2-5 | P2 | Python3 parser: name:id format for artifact iteration | `.github/workflows/notify-on-failure.yml` |
| R13 | P2-12 | P2 | H1 extraction via DOMParser (robust fallback to regex) | `scripts/check-data-consistency.js` |

---

## New Module Created

**`js/gbs2-baptist-controls.js`** (169 lines)
- Loaded on all 11 Baptisty pages (hub + 10 articles)
- Handles: theme toggle, font resize (0.75×–1.35×), search, share, sheet panel, mobile progress, TOC auto-population
- Persistence: font scale + theme saved to localStorage

---

## AuditRepo Push History

| Commit | Description |
|--------|-------------|
| fd902fa | Round 9: P0-NEW + P1-5 + P2-17/18/12 detail |
| 6b9f6d9 | Round 10: P0-NEW + P3-NEW + P2-17 + P3-12 |
| f0d4cc8 | Round 11: P2-18 + P1-14/15/16 (GBS2 controls) |
| 6947467 | Ledger R10-R11: +8 bugs fixed |
| 7c50ead | Round 12: P1-5 + P1-9 + P2-14 |
| 3a8223e | Ledger R12: +3 bugs fixed |
| b71181c | Round 13: P2-5 + P2-12 |
| fa95410 | Ledger R13: +2 bugs fixed |

---

## Bug Ledger Final Status

**Total bugs: 61** (9 P0, 20 P1, 19 P2, 13 P3)

| Category | Count | Notes |
|----------|-------|-------|
| Fixed in project source | **13** | V2-2, V2-3, V2-4, PS-06, P0-NEW, P3-NEW, P2-17, P3-12, P2-18, P1-14, P1-15, P1-16, P1-5, P1-9, P2-14, P2-5, P2-12 |
| Fixed in AuditRepo (pending) | 6 | PS-01, P0-10, PS-06, PS-07, P0-7, P0-8 |
| FALSE POSITIVE | 2 | P3-8, P1-13 |
| **Active remaining** | **~40** | P0-3, P0-6, P1-1, P1-4, P1-6, P1-7, P1-8, P1-10, P1-11, P1-17, P1-18, P2-1, P2-2, P2-4, P2-7, P2-8, P2-9, P2-10, P2-11, P2-13, P2-15, P2-16, P3-1, P3-2, P3-3, P3-4, P3-5, P3-6, P3-7, P3-9, P3-10, P3-11 |

---

## All Validation Gates

| Check | Status |
|-------|--------|
| `npm run guard:shared-files` | ✅ |
| `npm run native:runtime:audit:strict` | ✅ |
| `npm run data:consistency` | ✅ |
| `npm run migration:metadata:check` | ✅ |
| `npm run workflows:check` | ✅ |
| `npm run content:parity` | ✅ |

---

## Remaining Active Bugs (Quick Reference)

### P0 — Critical (needs maintainer coordination)
- **P0-3**: robots.txt blocks SEO bots — editorial decision needed
- **P0-6**: CI cascade race condition — indexnow.yml git push without retry

### P1 — High (source fixes possible)
- **P1-1**: site.js doesn't check `.has-premium-controls` before init
- **P1-6**: copy-legacy-to-dist.js race condition (no mtime check)
- **P1-7**: search.js hardcoded readTime fallback unvalidated (89, 41, 30, 50)
- **P1-10**: build-indexnow-urls.js git diff fails on merge → empty IndexNow
- **P1-11**: dist-publication-audit.js doesn't detect stale hash mismatch (quality gate blind to P0-10)
- **P1-17**: BaseLayout CSS loads without hash while JS uses md5short()
- **P1-18**: site-modules.js in SW precache but not in cache-bust.js ASSETS

### P2 — Medium (tooling/maintainability)
- **P2-1/9**: Visual parity coverage gap (~52 routes untracked)
- **P2-2**: site.css + site-layered.css overlap (design maintenance)
- **P2-4**: CACHE_VERSION manually updated (human error risk)
- **P2-7**: AGENTS.md complexity
- **P2-10**: sw-dist-readiness-audit.js missing cache-bust sync check
- **P2-11**: deploy.yml redundant cache-bust step
- **P2-13**: MDX canonicalOverride routing unclear
- **P2-15**: about/ page ownership unclear post-refactor
- **P2-16**: KartyPageHead hardcoded CSS hash (same as P0-10)

### P3 — Low
- **P3-1**: search.js fallback → GitHub (external dependency)
- **P3-2**: PlayEmber aria-disabled misapplied
- **P3-3**: path.posix edge-case handling
- **P3-4**: Hardcoded word count floors drift
- **P3-5**: interactive-audit hardcoded URL lists drift
- **P3-6**: floating-cluster-controller.js stale hash in 10 refs
- **P3-7**: BaptistyRossiiBody empty decorative elements
- **P3-9**: BaseLayout bodyEndHtml may create duplicate Yandex.Metrika
- **P3-10**: Nagornaya article TOC scroll target issues
- **P3-11**: site-modules.js cache-bust drift (related to P1-18)
