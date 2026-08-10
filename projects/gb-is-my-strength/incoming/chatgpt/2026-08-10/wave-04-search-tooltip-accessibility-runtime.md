# Wave 04 — search bootstrap + floating-tooltip accessibility runtime

Date: 2026-08-10
Auditor: ChatGPT autonomous browser/source wave

## Anchors

- Product current main checked before analysis: `171daaf3fd40b92208c6e8b551acccdc00efbb6c`
- AuditRepo main rechecked immediately before this write: `194ca1b1093c5f2d16c1a213c253fe3072ee9ee2`
- Product mutation: **none**

## Capability / evidence boundary

The local container could not resolve `github.com`, and the public web backend was intermittently 503 during this wave. I therefore did **not** claim fresh local Playwright screenshots or synthetic live click timing. Evidence below is current exact-head Product source plus available public-page witness. Items needing an accessibility-tree / real browser witness are explicitly left as candidates rather than promoted to MASTER.

---

## Finding A — current search bootstrap dead-end on catalog/landing families

**Disposition:** `CONFIRMED-CURRENT / source mechanism`, browser reproduction still desirable for closure-quality evidence.

### A1. `/articles/`

Current route uses `ArticlesPageChrome` + `MobileChromePage` + `ArticlesPageFooter`.

- Desktop navbar in `src/components/articles/ArticlesPageChrome.astro` contains logo, nav links, theme toggle and hamburger, but no search trigger.
- `src/components/articles/ArticlesPageFooter.astro` does not load full `js/search.js` eagerly. It installs a lazy handler that loads search only after a click matching one of these selectors or after `gb:openSearch`:
  - `#gbSearchBtn`
  - `[data-gbs2-search]`
  - `[data-fc-action='search']`
  - `.gb-nav-search-icon`
  - `.gb-search-btn`
- The lazy handler itself has **no Ctrl/⌘+K keydown listener**.
- `MobileChromePage` has its own search button and directly loads the palette, but its CSS is `display:none` above `63.99em` (~1024px).
- `js/site.js` only forwards clicks from `[data-action="open-search"]` to `GBSearch` / `gb:openSearch`; its generic keyboard shortcut block explicitly ignores modifier-key combinations, so it does not provide a hidden Ctrl/⌘+K rescue path.

Resulting mechanism on desktop: no visible trigger owns the lazy loader, and the advertised Ctrl/⌘+K path is not owned by the bootstrap. Full search never becomes resident from a cold page unless some other runtime happens to dispatch `gb:openSearch`.

### A2. `/biografii/`

Same class reproduced in current source:

- navbar has logo/nav/theme/menu but no search trigger;
- `BiografiiPageFooter.astro` installs the same click/event-only lazy loader;
- `MobileChromePage` supplies search only below ~1024px;
- breadcrumb markup is a plain `<nav aria-label="Хлебные крошки">`, not `.breadcrumb`, so the `site.js` floating-control fallback (which requires `.breadcrumb`) does not materialize a desktop search button.

Therefore desktop cold-start is in the same bootstrap dead-end class.

### A3. `/pastor-series/` is broader

`src/pages/pastor-series/index.astro` does **not** mount `MobileChromePage` at all. `PastorSeriesPageChrome.astro` has the same navbar-without-search and the same click/event-only lazy search bootstrap.

Therefore this family has no canonical search trigger in its own chrome on either desktop or mobile source markup. The `site.js` floating controls again require `.breadcrumb`, while this route uses plain `<nav aria-label="Хлебные крошки">`.

### Negative control

Do not generalize this to every route. Prior wave evidence showed `/hard-texts/` uses a different search-loading path and should remain a negative control until independently disproved.

### Why this matters

Search is presented as a primary library affordance on the home surface. A cold catalog/series page with no discoverable/operable search trigger is functional navigation loss, not merely polish.

### Next verification

Run exact-head Chromium + WebKit with cleared cache/storage:

1. `/articles/` at 1440×900: assert no `search.js` request before action; press Ctrl/⌘+K; assert command palette opens.
2. `/biografii/` at 1440×900: same.
3. `/pastor-series/` at 390×844 and 1440×900: assert a visible canonical search control exists and opens the palette cold.
4. Record request waterfall and click/key → palette-visible latency.

If reproduced exactly as source predicts, this is repair-ready current work and should be collapsed to one shared search-bootstrap root rather than three symptom rows.

---

## Finding B — floating footnote / Scripture tooltip relationship is weaker than glossary after reparent

**Disposition:** `CURRENT-SOURCE A11Y CANDIDATE`; do **not** promote to MASTER without accessibility-tree / screen-reader witness.

### Mechanism

`js/site.js` `makeTooltipController()` reparents an active tooltip from its anchor subtree into `document.body` (`mountTip`) and later restores it.

For glossary `.gterm` tooltips, initialization creates an id on `.gtip`, assigns `role="tooltip"`, and sets the trigger `aria-describedby=<tip-id>`. That preserves an explicit accessibility relationship even while the popup is physically reparented.

The shared footnote and Scripture branches are weaker:

- `.fn-marker` receives `role="button"`, `tabindex=0`, `aria-label` and `aria-expanded`, then uses `.tooltip` with `makeTooltipController`.
- `.bref[data-ref]` receives/generated `.btip` and uses `makeTooltipController`.
- In the inspected current runtime, neither branch establishes the glossary-style `aria-describedby`/`aria-controls` id relationship before the popup is moved to `<body>`; generated `.btip` also is not assigned `role="tooltip"` in that branch.

Once reparented, DOM ancestry no longer provides even an implicit local association. Keyboard focus can open the popup while a screen reader may only receive the changed expanded state / trigger label, not the popup content.

### Why this is not yet a MASTER row

Source asymmetry is strong, but the user impact depends on the actual accessibility tree and AT/browser behavior. Required witness:

- Chromium accessibility snapshot or equivalent while footnote/scripture popup is closed/open;
- NVDA/JAWS/VoiceOver spot-check if available;
- verify whether popup text is announced on focus/open and whether repeated opens are understandable.

If inaccessible, prefer one shared relationship contract across glossary / footnote / Scripture rather than route-local patches.

---

## Finding C — performance coverage remains interaction-latency blind

**Disposition:** `MEASUREMENT GAP / Work Queue candidate`, not a defect by itself.

Current source and existing audit evidence show substantial route/runtime contracts, but this wave still found no direct evidence measuring user-perceived cold interaction latency for:

- search action → palette visible;
- query input → stable result list;
- tooltip action → stable popup paint;
- TTS play action → first audible speech.

A future measurement pass should collect cold/warm p50/p95 and network/cache state. Do not promote this to MASTER unless measurements prove a current threshold violation.

---

## Public-page witness

The public home page was retrievable during this wave and presents search as a first-class affordance (`Поиск по материалам…`, `Ctrl K`), reinforcing that downstream route search reachability is an expected user capability rather than an optional enhancement.

---

## Collision / mutation note

Product main advanced from the earlier audit anchor to dependency-merge `171daaf…`. The search/tooltip files cited above remain current on that exact head. AuditRepo was simultaneously receiving branch-cemetery reports; this contribution therefore uses a unique incoming file and does not modify cemetery verification, MASTER, or Product source.
