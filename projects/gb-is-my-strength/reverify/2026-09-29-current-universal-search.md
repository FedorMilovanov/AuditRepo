# Current-main browser reverify — universal command palette (2026-09-29)

## Disposition

Fresh browser evidence confirms two bounded usability defects in shared search integrations:

1. The visible shared `Header.astro` search button (`#hCpBtnNav`, labelled “Поиск (Ctrl+K)”) is a no-op on `/hard-texts/genesis-6/` and `/izbrannoe/` at desktop width. On `/hard-texts/genesis-6/`, it is also a no-op at 390px; the separate mobile-chrome search control does open the palette after the mobile bar is revealed by scrolling.
2. On `/`, the open palette contains two visible, keyboard-focusable buttons with the identical accessible name “Закрыть поиск”: `.cp-close` and `.cp-home-close`. Both close the same dialog, creating a redundant action and extra Tab stop on Home only.

Admitted to the active matrix as `GBS-HEADER-SEARCH-TRIGGER-NOT-WIRED` and `GBS-HOME-SEARCH-DUPLICATE-CLOSE-CONTROLS`. The shared palette itself passed the bounded open/search/keyboard/close checks on Home, article listing and Abraham map layouts; this is not a claim that every route or browser was tested.

## Identity and evidence boundary

- Product `main` / live release-control SHA: `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`.
- Browser: Playwright with Chromium `153.0.8010.0`; mobile actions also used Chromium device emulation with `isMobile=true`, `hasTouch=true` and `touchscreen.tap` at 390×844.
- Tested against the local production-like `dist` for that exact SHA using a local HTTP server. Direct Chromium navigation to the live host remains blocked with `net::ERR_CONNECTION_CLOSED`; none of these interactions are represented as live-host browser results.
- Browser page-error arrays were empty. `serviceWorkers: 'block'` was used in isolated contexts; its known registration warning is a test-setting artifact.
- Product source was not changed. No Product issue or PR was opened as part of this pass.

## Bounded interaction results

| Surface | Tested state/action | Result |
|---|---|---|
| Home `/`, 1280×900 | First-use `Ctrl+K`; sequential Tab to search trigger (stop 10), Enter; query `Лот`; ArrowDown; repeated Tab/Shift+Tab; Escape; pointer close | Shortcut and trigger both open the named modal dialog. Input receives focus. `Лот` returns 6 results; ArrowDown advances the active option from `cp-option-0` to `cp-option-1` (“Лот: праведник у ворот Содома”). Fourteen consecutive Tabs and Shift+Tab remain inside the dialog. Escape and the close control restore focus to `#gbSearchBtn`. The dialog has `role=dialog`, `aria-modal=true`, `aria-label="Поиск по сайту"`; the input has the name “Поиск”. |
| Article listing `/articles/`, 1280×900 | First-use `Ctrl+K`; sequential Tab to trigger (stop 8), Enter; repeated Tab/Shift+Tab; Escape; pointer close | Search opens and focuses the input. The dialog has one visible close action. Fourteen sequential Tabs remain in the dialog; Escape and pointer close restore focus to the opener. |
| Home `/`, 390×844 | Emulated touchscreen taps on the visible search trigger and `.cp-close`; Escape | Search opens from the mobile header and closes by touch; focus returns to the header trigger. Both generic and Home-specific close controls are visible at this width. |
| Article listing `/articles/`, 390×844 | Emulated touchscreen taps on trigger and close | Palette opens and closes; focus returns to the search trigger. One visible close action. |
| Abraham map `/karty/avraam/`, 390×844 | Emulated touchscreen taps on app search and close | Shared palette opens and closes; focus returns to the app search trigger. The pre-existing map scroll lock is the same before and after. |
| Genesis 6 `/hard-texts/genesis-6/`, 1280×900 | Click visible `#hCpBtnNav`, then `Ctrl+K` | Both are no-ops: no palette appears, `window.GBSearch` remains uninitialized and no `/js/search.js` request occurs. The visible trigger is 44×44 and advertises “Поиск (Ctrl+K)”. |
| Favorites `/izbrannoe/`, 1280×844 | Click visible `#hCpBtnNav`, then `Ctrl+K` | Same no-op behavior as Genesis 6; no palette or `search.js` request. This bounds the finding to the shared Header placements tested, not every route using the global search runtime. |
| Genesis 6 `/hard-texts/genesis-6/`, 390×844 | Emulated touchscreen tap on header trigger and `Ctrl+K`; then scroll and tap `.mcp-search` | The header trigger and shortcut do nothing. The separate mobile-chrome control begins at `y=-51.3px`; after scrolling to `scrollY=300`, it is visible at `y=7px` and opens the palette. This is an alternate path, not a reason to treat the dead header control as working. |

On working routes, the backdrop makes the rest of the page inert while open; after close, body/root inline scroll styles are restored and focus returns to the opener. The remaining inert closed-palette node (and pre-existing hidden mobile-navigation nodes) is expected; the page itself is not left inert. Results and interaction checks were bounded to the routes/actions above.

## Confirmed defects and closure boundaries

### `GBS-HEADER-SEARCH-TRIGGER-NOT-WIRED`

`Header.astro` renders a visible search button on both `/hard-texts/genesis-6/` and `/izbrannoe/`, but on the tested desktop viewport neither activation by click nor the advertised `Ctrl+K` opens search; the palette bundle is not requested. On Genesis 6 the same header behavior reproduces at mobile width. A separate mobile-chrome search adapter works after its bar becomes visible, so the finding is specifically the shared Header trigger/shortcut wiring and does not assert that the palette is unavailable by every route-specific path.

**Closure:** make the shared Header trigger and its advertised shortcut open the palette on both routes; resulting-main browser checks should cover click, Ctrl/⌘+K, focus/close restoration and query behavior at desktop, plus the Genesis 6 mobile Header trigger. Preserve the working mobile-chrome alternate and unrelated theme action.

### `GBS-HOME-SEARCH-DUPLICATE-CLOSE-CONTROLS`

On Home, the generic runtime `.cp-close` and Home controller `.cp-home-close` are simultaneously visible, each has `aria-label="Закрыть поиск"`, a 44×44 target after the entrance animation settles, and a keyboard Tab stop. Sequential Tab reaches `.cp-close` and then `.cp-home-close`; both were individually activated and each closes the same palette and restores focus to the opener. The pair is present at desktop and mobile widths. The finding is limited to the Home integration.

**Closure:** keep one visible, labelled close action on Home; resulting-main checks should verify one close action in the accessible/tab sequence at desktop and mobile, while Escape, focus restoration and the single generic close button on other layouts continue to work.

## Machine evidence and screenshots

- `evidence/2026-09-29-universal-search-reverify.json` — exact-SHA browser measurements for desktop/mobile openers, modal semantics, search results and keyboard navigation, focus restoration, close behavior and the dead shared Header trigger.
- `evidence/2026-09-29-universal-search-home-desktop-modal.png` and `evidence/2026-09-29-universal-search-home-mobile-modal.png` — Home modal captures showing both close controls.


The matrix and consolidated fresh-browser wave have been updated. No Product implementation changes were made.