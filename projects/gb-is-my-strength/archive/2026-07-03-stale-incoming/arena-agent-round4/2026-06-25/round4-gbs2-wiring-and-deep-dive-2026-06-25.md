# Round 4: Arena Agent — Deep-Dive Findings
## Date: 2026-06-25 | 11 new bugs (5 P1, 3 P2, 3 P3)

## Новая P1 High (5)

### P1-14: GBS2 controls in SeriesArticleLayout COMPLETELY unwired
All premium controls (data-gbs2-theme, data-gbs2-font, data-gbs2-share, data-gbs2-search, data-gbs2-offline) have HTML buttons but NO controller handles them. 10+ buttons visible but dead on all 10 baptisty-rossii pages + hub + Krajne + Rimlyanam.

Files: `src/layouts/SeriesArticleLayout.astro:165-168`, BaptistyRossiiBody.astro, KrajneBody.astro

### P1-15: gbs2-sheet TOC pane always empty
Mobile sheet has "Части" tab (works) and "Оглавление" tab (empty). No controller populates it.

File: `src/layouts/SeriesArticleLayout.astro:244-247`

### P1-16: Hub progress tracking elements unwired
`gbs2Curbar`, `gbs2Count`, `gbs2Pct` have no JS update mechanism. Static display.

File: `BaptistyRossiiBody.astro`

### P1-17: BaseLayout CSS has NO cache-busting hash
CSS loads without ?v=XXX while JS uses md5short() hashed scriptTag. SW serves stale CSS.

File: `src/layouts/BaseLayout.astro:207-210`

### P1-18: site-modules.js in SW precache but NOT in cache-bust.js ASSETS
4 modules (back-to-top, faq-accordion, img-loaded, theme) bundled in site-modules.js. Included in sw.js PRECACHE_ASSETS but missing from scripts/cache-bust.js ASSETS. Changes to site-modules.js → stale SW cache.

## Новые P2 Medium (3)

### P2-16: KartyPageHead hardcoded CSS hash v=202876c3
Same P0-10 pattern. `src/components/karty/KartyPageHead.astro:28` — should be v=b880b524.

### P2-17: AvraamMap pollutes global MapEngine singleton
`AvraamMap.astro` sets `window.MapEngine.getPlaceVisual` globally. Singleton pollution risk.

### P2-18: MapEngine loadFromHash — location.pathname breaks on GitHub Pages base href

## Новые P3 Low (3)

### P3-7: BaptistyRossiiBody empty decorative elements (empty <i>, empty divs)
### P3-8: Antisovetov FAQ accordion HTML present but faq-accordion.js never loaded
### P3-9: BaseLayout bodyEndHtml accumulation may create duplicate Yandex.Metrika
