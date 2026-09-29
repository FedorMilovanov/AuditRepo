# Current-head reverify — hidden mobile chrome remains in keyboard order (2026-09-29)

## Disposition

**Admit one direct current keyboard-access defect:** the shared mobile page chrome is translated entirely above the viewport until scroll, but its Back, Home and Search controls remain sequentially focusable. At the top of affected pages, keyboard users encounter invisible controls before reaching the visible page content; on routes with a skip link, these hidden stops also precede it.

Admitted as `GBS-MOBILE-CHROME-HIDDEN-FOCUSABLE-BEFORE-SCROLL`. This is limited to the shared `MobileChromePage` chrome at mobile widths while it is visually hidden; it does not claim a problem after the bar has been revealed by scrolling.

## Identity and overlap check

- Product `main` HEAD and `origin/main`: `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`; live release/control-plane identity was reverified at this SHA in the 2026-09-29 current-head pass.
- The current open Product PRs #2142–#2145 do not touch `MobileChromePage.astro`, the shared mobile-chrome shell, or its styles/runtime. Open issue searches for this hidden-panel/focus scope returned no matches.
- No Product code was changed. Chromium 153 is now runnable; this browser wave freshly confirms the hidden Back/Home/Search stops on `/rodosloviye/`, but does not cover the full nine-route closure set. The remaining routes still require resulting-main proof.

## Current implementation

- `src/components/article-pilots/_shared/MobileChromePage.astro:47–62` places three controls in the shared `.mcp-top`: a Back button, a Home link, and a Search button.
- The current CSS at lines 66–84 renders that header only below `63.99em`; at those widths it positions the bar fixed at the top and sets `transform: translateY(-110%)` until `.mobile-chrome.is-shown` is set.
- The current `sync()` at lines 193–205 reveals it only when the main navbar has acquired `.nav-hidden`, or (without that navbar) when `scrollY > 160`. Its only event subscription is `window.scroll`; it has no `focusin` response.
- The controls have no `tabindex=-1`, `inert`, `hidden`, or hidden-state `aria-hidden` management. Transforming the header does not remove its buttons/link from the sequential focus order. Repository search found no separate focus handler for this component.

## Archived runtime witness

The same-SHA 2026-09-23 Wave 15 report records the exact user-visible sequence: on mobile `/rodosloviye/`, Tab 1–3 land on the offscreen Back/Home/Search controls at `top:-51`, and only Tab 4 reaches the skip link. The report identifies the same hidden panel on nine routes: `/articles/`, `/biografii/`, `/hard-texts/`, `/hard-texts/genesis-6/`, `/journal/`, `/journal/dossiers/g3/`, `/karty/`, `/konfessii/`, and `/rodosloviye/`. Not all nine routes have a skip link, so the defect is the invisible focus stops; “before the skip link” applies only where that link exists. Evidence screenshot: `../incoming/arena-agent-visual-playwright/2026-09-23/evidence/mcp-hidden-at-top-articles.png`.

The archive is historical, but the Product SHA and current component/CSS are unchanged. No current browser run is represented as having occurred.

## Closure boundary

When the mobile chrome is hidden, remove its controls from sequential focus/accessibility navigation (for example, a correctly synchronized `inert`/hidden state), or reveal it when focus enters; when shown, preserve normal Back/Home/Search operation and visible focus. Resulting-main browser proof must begin at scrollY 0 on all nine listed routes at a mobile viewport, verify no offscreen chrome tab stops, check the skip-link order where present, then verify scroll-triggered reveal, focus visibility, and keyboard/pointer activation. Ensure the hidden-state contract updates consistently through scrolling, resize and browser back/forward restoration.
