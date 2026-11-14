# V24 design contract and protected features

**Desktop:** left TOC and article share one page; rail gently collapses to narrow Grok icon rail with expand button at identical y-coordinate. No separate floating TOC. Header uses simply typographic **GB** (no fancy strips or square logo). Four real quick actions remain **VERTICAL upper right:** theme → search → Play/speed → bookmark. Left footer keeps Menu / Settings / Print-or-Download / Share from canonical Product controls.

**Tree:** one hierarchy, no duplicate tabs. Book chapter→article→H2→H3/H4 as actual data requires; flat cycle part→heading; standalone heading→subheading. Curated source anchor IDs/links/order are inviolable. Small filled circles; active 2px rule with 6px inset across the entire multi-line card. Exactly one measured 1px hairline between adjacent root H2 peers where safe; no H3/H4 trunk forest. Correct keyboard focus/inert state during all transitions.

**Palettes:** one shared nav renderer/behavior, series-specific `data-series-theme` tokens; Day/Sepia/Night independently controlled by canonical `GBReaderPreferences`. Gill historical «ВВЕДЕНИЕ / СПРАВОЧНИК» must use the existing original `GillLeatherRibbon.astro` and `GillLeatherDefs.astro`, not the prototype's simplified markup.

**Search:** contextual book/series query is primary on series pages, followed by whole-site search; global right search is available everywhere. Only canonical `GBSearch`/manifest/Pagefind may power real results; no title-only mock represented as full-text search.

**Functional owners that must remain singular:** `SeriesConfig` and curated `partToc`; current `ReaderRail` / `GillSeriesRail` owner shells; `GBReaderPreferences` settings; `SiteSectionsMenu`/OverlayRuntime; `GBSearch`; `PlayEmber`/TTS/speed; `SaveButton`, `GBFavoriteStore`, `GBHighlights`, merged Library V3 `GBReaderLibrary`; ReaderActionsRuntime/PrintEngine/share; existing scrollspy; mobile reader. New components are **read-only tree adapter + desktop-only view**, not second state engines.

**Library V3:** statuses «Читаю / Прочитано / Не интересно», resume eligibility, quotes, notes, backup/import and existing local keys must survive. Prototype's localStorage and pretend playback/search are **strictly NON-PORTABLE**.

**Motion:** current demo shows 335→68px rail and 746→780px text, returning when expanded, but actual Product text measure and breakpoints take precedence. Crossfade cannot have a blank interval; hidden controls must not receive focus. Reduced-motion has no interpolation; no competing manual scroll-compensation owner. Popovers must be anchored to exact lower button and stay onscreen on short viewports. Right cluster hidden in physical print. Existing mobile UI receives zero source diff.
