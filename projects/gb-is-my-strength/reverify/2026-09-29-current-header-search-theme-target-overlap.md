# Current-main browser reverify — search and theme controls overlap (2026-09-29)

## Disposition

**Freshly confirmed current pointer/touch-target collision:** the header's 44×44 search button and 44×44 theme button overlap by 12 CSS pixels. In the common strip, hit-testing selects the topmost theme control, so the search action cannot be selected there.

ID: `GBS-HEADER-SEARCH-THEME-TARGET-OVERLAP`. This is the shared target-box collision on `/`, `/izbrannoe/` and `/hard-texts/genesis-6/`; it does not claim either control fails outside the overlap or that adjacent App/Bookmark controls share the problem.

## Identity and overlap

- Product `main` / `origin/main`: `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`, also the live release/control-plane SHA.
- Open PRs #2142–#2145 do not touch the shared header controls or `mobile-hotfix.css`. The focused open issue search for search/theme overlap returned no matches.
- No Product code was changed. Fresh browser measurements are from the local production-like build at the exact current SHA; direct live-browser access was blocked by `net::ERR_CONNECTION_CLOSED`.

## Current source and fresh browser witness

- `/` renders `.gb-nav-search-icon` immediately before `.theme-toggle` in `src/components/home/HomePageChrome.astro`.
- `/izbrannoe/` and `/hard-texts/genesis-6/` use shared `Header.astro`, where the search button immediately precedes the theme button.
- Current `command-palette.css` gives search a 44×44 box; `site.css` gives theme a 44×44 box. `mobile-hotfix.css` applies `gap:0` and `margin-right:-12px` to the search button without a viewport/pointer restriction.

Fresh Playwright Chromium `153.0.8010.0` measured all three routes at widths 1024, 1280 and 1440. Every pair overlapped 12px horizontally (and 44px vertically). `document.elementFromPoint` at the center of each common strip resolved to the theme button in all nine combinations. A real mouse click at the center of the home-page overlap at 1280px also dispatched to `themeToggle`, not search.

| Route | Widths tested | Search target | Theme target | Overlap | Center hit |
|---|---|---|---|---:|---|
| `/` | 1024 / 1280 / 1440 | 44×44 | 44×44 | 12px | theme |
| `/izbrannoe/` | 1024 / 1280 / 1440 | 44×44 | 44×44 | 12px | theme |
| `/hard-texts/genesis-6/` | 1024 / 1280 / 1440 | 44×44 | 44×44 | 12px | theme |

Machine-readable coordinates and hit tests: `evidence/2026-09-29-fresh-playwright-reverify.json`. The 2026-09-23 Wave 18 values remain archival corroboration, not the basis for the fresh result.

## Closure boundary

Remove the negative overlap and preserve independently operable hit-target areas at supported widths. Resulting-main browser proof should measure both rectangles and separately activate each control at the former shared strip on all three routes and representative widths, verify search opens only search and theme toggles only theme, and preserve keyboard order/focus visuals.
