# Current-main MobileChrome reverify — 2026-09-30

## Identity and boundary

- Product `main` / locally built production-like `dist`: `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`
- Browser: Chromium 153.0.8010.0 through Playwright
- Scope: the nine emitted routes using `MobileChromePage`; local browser only, not live-host navigation and not assistive-technology testing
- Product source was inspected but not changed; no GitHub issue was created or modified

## Existing hidden-focus-stop finding: extended coverage

The earlier focused check freshly observed three offscreen sequential-focus stops on `/rodosloviye/`. The 2026-09-30 sweep extended that observation to all nine registered routes, using 390×844 mobile and 1280×900 desktop contexts. Across all 18 visits it ran 297 assertions: 258 passed and 39 failed.

At mobile width, 27 of those failures are direct confirmations of the existing `GBS-MOBILE-CHROME-HIDDEN-FOCUSABLE-BEFORE-SCROLL` finding: each of the three Back/Home/Search controls on each of the nine routes remains focusable at `scrollY=0` while its box is above the viewport (`y=-51.3px`, toolbar `.is-shown=false`). On routes that render a skip link, these invisible controls precede it in the sequential Tab path. This broadens the current browser-confirmed route scope from one route to all nine; it does not add a second count for the same focus-order defect.

All nine route checks for opening the mobile search with Enter, dialog role/modal semantics, initial input focus, Escape close, and focus restoration passed.

The remaining 12 failures in the original 297-check artifact were scroll-reveal assertions on `/articles/`, `/biografii/`, and `/hard-texts/`. Those assertions used `window.scrollTo` and therefore did not exercise the real `#hNavbar.nav-hidden` lifecycle. They are **not** treated as 12 confirmed failures or as proof that the toolbar never reveals. The raw run remains at `reverify/evidence/2026-09-30-mobile-chrome-100-checks.json`; its scroll-reveal failures are superseded for interpretation by the actual-wheel checks below.

## Actual wheel input: navbar/toolbar state desynchronization

To test the three scroll-reveal routes with user-like input, a new Playwright run used actual `page.mouse.wheel()` actions (not `window.scrollTo`) at 390×844, with a 700 ms settle after each action. The sequence was one downward wheel of 600 px, a further 80 px downward, then upward 600 px and 80 px. All three routes reproduced the same state mismatch:

| Route | After first downward wheel | After next downward wheel | After first upward wheel | After next upward wheel |
|---|---|---|---|---|
| `/articles/` | `scrollY=600`; `#hNavbar` has `nav-hidden`; MobileChrome remains hidden at `y=-58.3px` | MobileChrome appears; all three controls fit in the viewport | `scrollY=80`; navbar is visible; MobileChrome remains shown | MobileChrome hides |
| `/biografii/` | Same mismatch | Revealed with all controls visible | Same mismatch in reverse | Hides on the next wheel |
| `/hard-texts/` | Same mismatch | Revealed with all controls visible | Same mismatch in reverse | Hides on the next wheel |

The supplemental artifact has **18 assertions: 12 pass, 6 fail**. The six failures are exactly one stale-state assertion in each direction on each of the three routes: the toolbar does not synchronize on the same wheel action that changes `#hNavbar.nav-hidden`; it catches up only after another scroll event. The mismatch remains after the 700 ms settle, so this is not merely the toolbar's CSS transition. The toolbar is incorrectly left offscreen after the native navbar has hidden, and is left visible after the native navbar has returned.

The inspected source is consistent with the browser result: `MobileChromePage.astro` reads `#hNavbar.nav-hidden` from its own scroll listener, while the shared navbar toggles that class from the site's scroll-RAF path in `js/site.js`. This is supporting mechanism evidence; the finding is admitted on the repeatable browser-visible stale state, not source inspection alone.

Admitted as a separate, narrowly scoped work unit: **`GBS-MOBILE-CHROME-NAVBAR-SYNC-LAG`** on `/articles/`, `/biografii/`, and `/hard-texts/` at mobile width. It is independent of the already-admitted hidden-focus-stop defect: fixing Tab eligibility does not make navbar/toolbar state changes synchronize, and fixing synchronization does not remove invisible controls from the initial Tab order. The synthetic-scroll failures are not this finding; real wheel actions reproduce a different, specific lifecycle error.

## Touch search activation: route-specific first-input race

A further Playwright pass covered all nine MobileChrome routes at both 390×844 and 320×844 (18 visits, 180 assertions). The toolbar was revealed with discrete wheel input; the search button was then activated by trusted touchscreen tap, with up to five seconds allowed for lazy loading. **174/180 assertions passed.** Toolbar geometry, all three controls, and touch search/dialog/close checks pass on eight routes. The six failures are confined to the three search-open/dialog/input assertions on `/hard-texts/` at both widths. There, the first trusted touch tap reaches the button (`pointerType=touch`, `click` observed) but does not open a palette even after five seconds. A fresh comparison on the same route shows mouse click and Enter each open the palette at both widths; a second touch tap also opens it.

The route-specific sequence is visible in browser state: on the first tap, `HardTextsPageChrome.astro`'s document-level `touchstart` preloader starts `js/search.js` with `open=false`. The later `.mcp-search` click sees `__gbSearchLoading`, sets `__gbSearchOpenAfterLoad=true`, then returns without attaching an open continuation. After the load, only a non-ready `GBSearch` stub exists and no `.cp-backdrop` is open. This is consistent with the source listeners and directly observed runtime flags/requests. The current witness is deliberately narrow: the toolbar had been revealed by a non-touch wheel before the first touch. In a separate CDP touch-scroll-then-tap positive control, the scroll's earlier touchstart warmed the loader and the subsequent tap opened the palette. This is not claimed as universal failure on physical phones.

Admitted as a third, independent MobileChrome work unit: **`GBS-MOBILE-CHROME-SEARCH-TOUCH-LOAD-RACE`**, limited to `/hard-texts/` when the toolbar is already visible before the user's first touch. A first tap must carry its open intent through any in-flight lazy bootstrap; a retry must not be required. This is separate from toolbar visibility synchronization and hidden-focus stops.

## Back/Home touch navigation

The Back and Home controls were independently exercised on all nine routes at 390px and 320px (36 visits, **108/108 assertions passed**). After actual wheel reveal, each was in-bounds and at least 24×24 CSS px; Back remained a named `type=button` with its expected direct-entry fallback, and Home remained a named anchor to `/`. One trusted touchscreen tap navigated to the correct fallback destination for each control.

The separate same-origin history branch was then checked on all nine routes at both widths (18 visits, **54/54 assertions passed**). A visible audit anchor performed a real same-origin navigation from a route-specific source page, establishing a non-empty same-origin `document.referrer` and browser history. One trusted touch on Back returned to that actual previous page, rather than the route's configured fallback. The anchor is a test harness control, not a claim that each source page's in-product navigation to the target was separately audited.

## Evidence and closure boundary

- Broad route/focus/search evidence: `evidence/2026-09-30-mobile-chrome-100-checks.json`
- Actual-wheel lifecycle evidence: `evidence/2026-09-30-mobile-chrome-wheel-reverify.json`
- 9-route × 2-width touchscreen search audit: `evidence/2026-09-30-mobile-chrome-touch-search-reverify.json`
- `/hard-texts/` first-touch race and mouse/Enter/retry controls: `evidence/2026-09-30-hard-texts-mobile-search-touch-race.json`
- `/hard-texts/` positive touch-scroll then first-touch search control: `evidence/2026-09-30-hard-texts-mobile-search-touch-scroll-control.json`
- Wheel-versus-touch lifecycle cross-check: `evidence/2026-09-30-mobile-chrome-input-modality-reverify.json`
- Back/Home direct-entry touch navigation: `evidence/2026-09-30-mobile-chrome-back-home-touch-reverify.json`
- Back/Home same-origin history branch: `evidence/2026-09-30-mobile-chrome-back-history-touch-reverify.json`
- Prior single-route focus-stop provenance: `2026-09-29-current-hidden-mobile-chrome-focus-stops.md`

For `GBS-MOBILE-CHROME-HIDDEN-FOCUSABLE-BEFORE-SCROLL`, resulting-main proof must remove the three invisible stops or reveal the bar on focus, on all nine routes, preserve skip-link order where present, and prove the controls are visible/operable after reveal. For `GBS-MOBILE-CHROME-NAVBAR-SYNC-LAG`, resulting-main proof must show that one downward scroll action which hides `#hNavbar` also reveals MobileChrome, and one upward action which restores the navbar hides MobileChrome, across the three affected routes. Preserve keyboard search activation, dialog/focus behavior, and the no-`#hNavbar` fallback routes.

The active matrix now has **23 work units: 22 direct defects + 1 system verification lane**. No Product fix is included in this audit change.