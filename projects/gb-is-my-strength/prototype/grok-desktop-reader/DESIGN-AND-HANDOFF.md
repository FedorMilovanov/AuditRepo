# Accepted UX design contract — V23

## User-selected architecture

A Grok-like navigation panel sits to the LEFT OF THE ARTICLE on the same desktop page; it collapses to a thin 68px rail and expands to roughly 335px (standalone dimensions only). The article subtly regains width in standard measure when the rail collapses, but must preserve the visible reading position. The expand and collapse controls stay at the SAME VERTICAL POSITION. Soft reversible motion; no overshoot, empty intermediate frame, hidden focus or duplicate scroll owners. Respect reduced motion.

**Right-hand controls remain VERTICAL on the right of the article**, in actual Product order: Theme → GLOBAL search → PlayEmber / speed → Save bookmark. The old horizontal prototype header from V20 is REJECTED. The existing Product SVGs and their owner-approved refinements are authoritative.

Bottom of the LEFT rail: Site menu → Reading settings → PDF/Print → Share. Library remains a distinct entry. Site menu/settings/library popovers open ADJACENT TO THE CLICKED BUTTON, not in a distant right corner, and remain inside short viewports. Escape/outside-click/focus restoration should delegate to the canonical Product overlay owner. Do not create second popover engines.

GB wordmark: pure, elegant serif letters GB without shield, border, odd decorative bars, or secondary overlaid icons. This is a proposed visual monogram, not approval to replace a separately-owned production brand.

## TOC hierarchy and typography

One integrated tree, no redundant tabs "Главы и статьи / В этой главе". Book: chapter → article → H2 → H3/H4 as necessary. Flat series: part → H2 → H3/H4 (no invented chapter layer). Standalone: real article headings. Source of truth is existing SeriesConfig / curated partToc with original URLs and anchors.

A 2px selected vertical rule follows actual card height, inset about 6px from top/bottom even on wrapped text. Small FILLED selection dots without hollow ring. Root H2 PEER LEAVES may be joined by precisely ending 1px hairline connectors. No H3/H4 parallel spine forests; deep children distinguish themselves by indentation and hierarchy. No TOC underline. No giant square selected pill.

Search order: contextual "in this book / cycle / article" FIRST, global site search SECOND. This must use existing GBSearch for real global indexing; demo title matches are not full-text website results.

## Preserve original series identity

Existing SeriesConfig.theme and data-series-theme contracts own series skins: Samizdat Baptist pages (violet/ink/newsprint), Gill (book/leather/brass), and appropriate separate article palettes. Shared component/interaction engine, distinct theme tokens only. Do not fork a fourth series engine. Gill intro/reference vertical lettering must keep authentic GillLeatherRibbon.astro and GillLeatherDefs.astro; the HTML simplified ribbon is ONLY a visual illustration.

## Preserve reader features instead of duplicating

GBReaderPreferences owns Day/Sepia/Night, text size, measure, leading, simple mode and reduced motion. Top-right theme toggle is a QUICK action over the SAME preferences, preserving Sepia when going Night→previous daylight theme. PlayEmber owns real TTS and speed; BookmarkEngine/SaveButton + current library own reading state; ReaderActionsRuntime owns print/share; SiteSectionsMenuRuntime owns site navigation; GBSearch owns global search and focus; existing scroll owner owns scrollspy/compensation.

Current mobile interface is EXPLICITLY OUT OF SCOPE and must remain byte/behavior/visual compatible. Prototype's mobile rendering is illustrative only. Actual desktop breakpoint comes from current Product wrappers, NOT the prototype's 781px assumption.