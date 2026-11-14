# Owner design contract — desktop Grok TOC V25

## Non-negotiable UX
- Left integrated in-page TOC alongside article, collapsible to a 68px compact Grok rail (demo full 335px at wide desktop). Collapse/expand triggers at precisely the same Y in both states.
- Small solid selection dot, only one delicate 1px connector between neighbouring H2 leaf nodes when not crossing child branches. No H3/H4 spines, hollow rings, heavy outlines or link underlines. Selected 2px vertical rule follows full row height with ~6px insets.
- One tree for books chapter → article → H2 → H3/H4; cycles part → H2/H3; standalone H2/H3. Do not repeat content through redundant “Главы / В этой статье” tabs. Keep real published heading order/IDs.
- 650ms restrained elastic rail/reading transition, full rail 335→68px and normal demo text 746→780px, no excessive column stretch, no blank motion frame, no overlap, interruptible rapid reversal, reduced-motion instantly. Reading position is stable mid-article.
- Theme skinnability: Baptist Samizdat violet/ink, Gill scholarly warm/dark with original upside-down leather ВВЕДЕНИЕ ribbon, standalone paper/burgundy. Shared tree owner; colors via data-series-theme, reader Day/Sepia/Night orthogonal.
- Style mark only typographic serif **GB** without ornamental bars or frame.
- Right page tools remain **VERTICAL** and canonical: Theme, Search, PlayEmber/speed, Save. No horizontal toolbar replacing them. Left bottom menu/settings/PDF/share use native owners and native SVG, not demo copies.
- Settings, site menu, library popovers originate next to clicked button, self-constrain height on short viewport, keyboard Escape and focus return; never jump to far-right corner.
- Site context search: **this book/series first**, site-wide second, optional current article. True global full-text uses existing GBSearch and canonical index; prototype heading matches are NOT site search.
- Left detailed themes and right quick night button share same GBReaderPreferences. Previous light selection (including Sepia) must return after night.
- Library V3 actions and reading states (“Читаю”, “Прочитано”, “Не интересно”), quotes, notes, source links, backup/import and resume remain untouched.
- Mobile Product UI does not change.

## Historic constraints
Never rename/reorder Gill legacy slug numbering, delete #sec-gill-last-pages, replace GillLeatherRibbon.astro/GillLeatherDefs.astro, install second scrollspy/focus manager, prune unrelated CSS, or replace native article text with mock content.
