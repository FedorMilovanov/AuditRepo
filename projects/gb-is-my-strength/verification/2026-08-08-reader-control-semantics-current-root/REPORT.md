# Reader control → surface semantics — current Product root, 2026-08-08

## Anchor

Product `main@6d671d0e30bff8da1f7354a00191ab990f17ed12`.

Product issue `#1224` was independently reverified against current source before promotion. This is one shared behavior/semantic root, not one row per route/component.

## Confirmed current-main manifestations

### 1. Standalone ReaderRail menu/Search meaning is false

`src/components/article-pilots/_shared/ReaderRail.astro` renders a hamburger-looking bottom control:
- `data-fc-action="search"`;
- accessible name `Поиск и разделы сайта`.

The control therefore promises site sections/menu but delegates to Search. Standalone articles already have a separate Search magnifier owner. This is an action→surface semantics defect, not a cosmetic icon preference.

### 2. Standalone TOC list markup is invalid

The same `ReaderRail.astro` renders:
`<ul class="hrail-toc"> <span class="hrail-track" ...> ... <li>...`

The decorative `span` is a direct `ul` child. It should be moved outside the list or represented without breaking list semantics.

### 3. Shared series mobile Back ignores the config authority

`GillSeriesMobileBar.astro` accepts `config?: SeriesConfig`, but current `mobBackBtn` hardcodes:
`data-home-href="../../biografii/"`.

The desktop `GillSeriesRail.astro` already uses `data-home-href={config.railBackHref}`. Since the same series engine is reused by non-Gill series, direct-entry mobile Back can disagree with the canonical per-series parent.

### 4. External Part-TOC relation is incomplete

`GillSeriesMobileBar.astro` renders `mobPartTocBtn` for the current Part TOC without `aria-controls="partTocOverlay"` / synchronized `aria-expanded`, while adjacent Learning/Settings triggers expose those relations.

### 5. Shared series rail repeats invalid list semantics

`GillSeriesRail.astro` renders `<span class="gbs2-track">` directly inside `<ul class="gbs2-toc">` before its `<li>` rows. Same semantic class as standalone rail; one system repair should cover both.

### 6. Conditional Learning relation can orphan `aria-labelledby`

`GillLearningSheet.astro` conditionally renders tab `#tabQuiz` only when `hasQuiz`, but renders `#panelQuiz role="tabpanel" aria-labelledby="tabQuiz"` unconditionally. Series configs with no quiz therefore produce an orphan label relation. This belongs to the same relation/surface-contract root.

## Architecture / repair boundary

Do not rewrite the healthy overlay stack/focus/scroll-lock owner. Product issue #1224 correctly targets shared semantic ownership and per-series data authority:
- Menu / Search / TOC / Settings / Learning triggers must describe and control the actual surface they open;
- Back must derive from route/series authority, not shared hardcoding;
- relevant `aria-controls`, `aria-expanded`, `aria-labelledby`, `aria-describedby` must resolve and synchronize;
- list semantics must be valid;
- engine-specific visual layouts may remain separate.

Product PR `#1227` is the first bounded implementation slice and intentionally does not claim the entire root. It extends existing `src/runtime/reader-controls-a11y.js` relation synchronization for already-existing surfaces. Still-open manifestations explicitly include wrong shared Back, standalone hamburger→Search, invalid list children, inner Part-TOC accordion relations and duplicate Settings drift.

Product `#1212` remains the intended permanent all-reading-route browser census/guard owner. It is audit evidence, not Product-repair ownership.

## MASTER disposition

Promote one new system lane: `SYS-READER-CONTROL-SEMANTICS`.

This changes current totals from 12 to **13 active work units** and system lanes from 4 to **5**. Direct current defect rows remain 2 because these manifestations are consolidated under one shared SYSTEM owner rather than multiplied as route-local defects.

Definition of done should follow Product #1224 and exact current-head browser evidence, not simply the merge of first slice #1227.
