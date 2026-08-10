# Reverification — global search cold-bootstrap root

Date: 2026-08-10
Disposition: **`CONFIRMED-CURRENT / P2`**
Product mutation: **none**

## Authority and provenance

- Current Product `main`: `29770e1c7a99478ce7dc2a01abec206ac1daa69b`.
- Original confirmed root: AuditRepo commit `3cd144f2d014c4c701f43861c257d5a1eebf6fe4`, `projects/gb-is-my-strength/incoming/chatgpt/2026-08-10/WAVE-02-SEARCH-TOOLTIPS-TTS-INTERACTION.md`.
- Subsequent Wave 03/04 evidence extended the same owner/root to `/pastor-series/`.
- Freshness comparison: Product `171daaf3fd40b92208c6e8b551acccdc00efbb6c` → current `29770e1c7a99478ce7dc2a01abec206ac1daa69b` changes only CI/source-authority/preservation/Hermenevtika files. None of `js/search.js`, `js/site.js`, Articles/Biografii/PastorSeries search bootstrap shells changed in that interval.

This report revalidates the prior confirmed interaction root against current Product source instead of assuming the old finding remained true.

## V12-SEARCH-COLD-BOOTSTRAP — CONFIRMED-CURRENT / P2

### `/articles/`

Current `src/components/articles/ArticlesPageChrome.astro` renders the desktop navbar with the normal navigation links plus theme/burger controls, but no source-owned search trigger.

Current `src/components/articles/ArticlesPageFooter.astro` loads only a tiny lazy search owner. It can request the full `js/search.js` runtime when either:

1. the user clicks an **already existing** selector among `#gbSearchBtn`, `[data-gbs2-search]`, `[data-fc-action='search']`, `.gb-nav-search-icon`, `.gb-search-btn`; or
2. another owner dispatches `gb:openSearch`.

The lazy owner does not listen for `Ctrl/⌘+K`.

`src/pages/articles/index.astro` mounts `MobileChromePage` from the registry, so mobile has a later independent adapter, but that does not create a cold desktop search owner.

### `/biografii/`

Current `src/pages/biografii/index.astro` has the same desktop condition: normal links + theme + burger, no search trigger in the source navbar.

Current `src/components/biografii/BiografiiPageFooter.astro` contains the same click/event-only lazy loader and no `Ctrl/⌘+K` bootstrap listener.

A registry `MobileChromePage` is mounted for mobile, but again this does not rescue the desktop cold-start path.

### `/pastor-series/`

Current `src/pages/pastor-series/index.astro` does **not** mount `MobileChromePage`.

Current `src/components/pastor-series/PastorSeriesPageChrome.astro` has no source search trigger in the navbar and ends with the same click/event-only lazy loader. This makes the route stricter than Articles/Biografii: the canonical page shell has no independent MobileChrome search adapter either.

### Full search runtime proves the circular ownership

Current `js/search.js` is itself two-stage:

- when `window.__gbSearchBootRequested` is absent, its stub exposes `GBSearch.open`, listens for clicks on existing search triggers and for `gb:openSearch`, then **returns**;
- only the full-runtime path constructs the command palette and runs `Se()`, which can create `#gbSearchBtn` in `.mobile-controls`, `.h-nav-links`, or other supported nav shells.

Therefore the trigger that could make search discoverable is created only after the full runtime is loaded, while the landing lazy owner waits for a trigger/event before requesting that runtime.

Current `js/site.js` does not silently close this gap. Its search bridge reacts to `[data-action="open-search"]`, while its generic keyboard-shortcut handler explicitly excludes events carrying `ctrlKey`, `metaKey` or `altKey`; it therefore does not own `Ctrl/⌘+K` cold bootstrap.

## Scope

Confirmed root family:

- `/articles/` — desktop cold search entry;
- `/biografii/` — desktop cold search entry;
- `/pastor-series/` — desktop cold search entry and missing equivalent mobile shell owner.

This is **one shared bootstrap-ownership defect**, not one defect per route.

`/hard-texts/` remains a negative-control family from the prior verified wave because it directly owns the full search runtime rather than depending on this dead-end lazy sequence.

## Why existing green checks do not disprove it

Search/Pagefind CI primarily proves index integrity, canonical queries and search behavior **after the runtime exists**. The prior browser audit also covered `Ctrl+K` on other route witnesses, not these affected landing owners.

A green Pagefind build therefore cannot prove that a user can actually open the command palette from a cold load on every route family.

## Required terminal outcome

Establish one deterministic global search-entry owner, without stacking competing listeners:

1. on cold `/articles/`, `/biografii/` and `/pastor-series/`, a visible/focusable search affordance exists at the appropriate desktop/mobile surface;
2. `Ctrl/⌘+K` opens `.cp-backdrop` from a cold page load **before any prior search click**;
3. `/pastor-series/` receives a truthful mobile search entry rather than relying on a component it does not mount;
4. full-runtime search behavior, Pagefind fallback, focus restoration and Escape remain unchanged;
5. permanent Chromium + WebKit browser coverage exercises the cold path on representative desktop and mobile widths;
6. the regression guard proves the initial owner itself can bootstrap the full runtime, not merely that search works after manually preloading `search.js`.

## Audit disposition

The earlier finding was not stale and was not fixed by subsequent Product commits. It was simply absent from the compact MASTER after consolidation. Promote it as one current P2 work unit and keep provenance in this verification package.
