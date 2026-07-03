# Round 4: Arena Agent — Deep-Dive Findings
## Date: 2026-06-25 | 11 new bugs (5 P1, 3 P2, 3 P3)

## Theme: "Incomplete Premium Controls Wiring"

## New P1 High (5)
- P1-14: GBS2 controls in SeriesArticleLayout completely unwired (theme/font/share/search/offline)
- P1-15: gbs2-sheet TOC pane always empty — no controller populates it
- P1-16: Hub progress tracking elements (gbs2Curbar, gbs2Count, gbs2Pct) unwired
- P1-17: BaseLayout CSS loads without hash while all JS uses MD5-hashed scriptTag
- P1-18: js/site-modules.js in SW precache but NOT in cache-bust.js ASSETS

## New P2 Medium (3)
- P2-16: KartyPageHead hardcoded CSS hash v=202876c3 (should be b880b524)
- P2-17: AvraamMap pollutes global MapEngine singleton with getPlaceVisual override
- P2-18: MapEngine loadFromHash uses location.pathname — fails on GitHub Pages with base href

## New P3 Low (3)
- P3-7: BaptistyRossiiBody empty decorative elements
- P3-8: Antisovetov FAQ accordion HTML present but faq-accordion.js never loaded
- P3-9: BaseLayout bodyEndHtml accumulation may create duplicate Yandex.Metrika

## Total bugs now: 51 (9 P0, 18 P1, 16 P2, 8 P3) + 2 FP closed
