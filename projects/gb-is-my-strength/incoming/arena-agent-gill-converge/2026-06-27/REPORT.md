# Gill convergence — verification + fixes (browser-witness, current HEAD)

## Meta
- Agent: arena-agent-gill-converge
- Date: 2026-06-27
- Source HEAD audited: `4c93875e` (then fixes pushed as 2 lanes)
- Build: production-like dist (Node 22) + Playwright Chromium desktop(1280)/mobile(390/768)
- Mode: verify R16 screenshot diagnoses on current HEAD, then implement

## R16 diagnoses — re-verified LIVE on current HEAD (the R16 agent couldn't run them)

| R16 finding | Verified on 4c93875? | Evidence |
|---|---|---|
| GILL-A vertical title (mobile) | ✅ CONFIRMED live | @768 `.gbs2-mobile-title` width=0, height=567, vertical=true; screenshot identical to owner's |
| GILL-B stretched footer | ✅ CONFIRMED | `.gbs-rail-foot` 663px inside 753px mobile head |
| GILL-C blue/colhoz roman | ✅ CONFIRMED | parts use legacy gbs2 dark-red-square numerals, not v16 italic-serif |
| GILL-D legacy mobile TOC | ✅ CONFIRMED | parts: gbs2-sheet (18×); context: toc-overlay v16 |
| GILL-E thumbnails in TOC | ✅ CONFIRMED | parts: gbs2-thumb=5; context=0 |
| HERM/POS-01 position | ✅ FIXED (f372505f) | desktop floater rightGap≈109px = 8.5vw historical; screenshot clean |

## Precise root cause (deeper than R16)
- Gill parts nest the full `GillRailControls(.gbs-rail-foot, 6 btns)` into `.gbs2-mobile-head`.
- Width rule `[data-gill-v16] .gbs-rail-foot{justify-content:space-between;width:100%}` is scoped to
  `data-gill-v16`, which exists ONLY on gill-context — parts lack it → unscoped rail-foot took 663px →
  `.gbs2-mobile-title{min-width:0;flex:1}` (no overflow guard) collapsed to 0 → per-char wrap.
- baptisty/krajne use compact `gbs2-mobile-actions` (2 btns) → unaffected. Proof of root cause.

## NEW finding: GILL-F — v16 has no mobile responsive layer
- `css/site.css` @media(63.99em) toggles only LEGACY `.gbs2-rail`/`.gbs2-mobile-head`.
- v16 `.gbs-rail`/`.mobile-bottom-bar` have NO responsive switch anywhere.
- Result: even reference gill-context @390 showed desktop rail (display:flex,240px) + bottom-bar
  position:absolute. v16 mobile was never wired. Severity P1 (blocks any part→v16 migration on mobile).

## Fixes implemented (2 lanes pushed to source)

### lane/gill-mobile-head-fix-2026-06-27 (P0 hotfix, css/site.css)
Guards `.gbs2-mobile-title` (overflow/nowrap/ellipsis) + constrains `.gbs2-mobile-head .gbs-rail-foot`
to compact right-aligned. Fixes GILL-A/B on ALL 4 legacy parts immediately.
Verified @768/@390 ×4 parts: title horizontal, footer 210px, no overflow. Desktop untouched.

### lane/gill-part1-v16-converge-2026-06-27 (pilot, stacked on P0)
- `GillPart1PageChrome` rewritten to v16 (= gill-context structure) with Part-I data:
  clean roman cards (no thumbnails), mobile-bottom-bar, series+part TOC overlays (13 chapters).
- GILL-F fixed: added scoped `[data-gill-v16]` responsive layer to floating-cluster.css
  (desktop grid rail+content sticky; mobile hide rail + fixed mobile-bottom-bar).
- Verified Playwright desktop+mobile: context & part1 now identical & correct; clean roman target
  on desktop; clean flow + v16 bottom bar on mobile; theme + part TOC overlay work.
  audit-pro PASS, data:consistency PASS.

## Status
- GILL-A/B → fixed-current (P0 hotfix, all parts).
- GILL-C/D/E/F → fixed-current for **Part I** (pilot). Parts II/III/Spravochnik still legacy
  (functional via P0 hotfix) — replicate the v16 pilot next, pending owner OK of Part I.
- HERM/POS-01 → fixed-current (desktop verified; mobile pill position acceptable).

## Recommended next
1. Owner reviews Part I desktop+mobile (топово?).
2. If approved, replicate v16 converge to chast-2/chast-3/spravochnik (same template, per-part TOC data).
3. Then remove the now-unused legacy gbs2-mobile-head P0 hotfix once all parts are v16.
