# Current-main browser reverify — invisible “Наверх” control remains focusable (2026-09-29)

## Disposition

**Freshly confirmed on `/articles/`:** the enabled native “Наверх” button remains in sequential Tab order at the top of the page while computed `opacity` is 0. It matches `:focus-visible` and has a focus outline in computed style, but the whole button—including that outline—is transparent. Current runtime reveals it only after `scrollY > 500`; focus does not reveal it.

ID: `GBS-H-SCROLL-TOP-INVISIBLE-FOCUS`. The active claim remains limited to the six shared page-chrome routes: `/`, `/articles/`, `/biografii/`, `/hard-texts/`, `/nagornaya/seriya/`, and `/pastor-series/`.

## Identity and current implementation

- Product `main` / `origin/main`: `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`, matching the current live release/control-plane SHA.
- Current markup renders an enabled `<button class="h-scroll-top" id="hScrollTop" aria-label="Наверх">` with no initial `hidden`, `inert`, `aria-hidden`, `disabled` or negative tabindex. Shared `home.css` makes it opacity-zero and pointer-inert until `.visible`; `site.js` toggles that class only when `scrollY > 500` and has no focus reveal.
- No Product code changed. Open PRs #2142–#2145 do not modify this component/runtime. This browser result is from the local exact-SHA production-like build, not a remote live browser.

## Fresh Playwright witness

On `/articles/` at 1366×900, a real sequential keyboard walk reached `#hScrollTop` at Tab stop 95 while at the top of the page. At focus, Playwright reported `opacity: 0`, `:focus-visible: true`, and a computed `2px` outline; the opacity suppresses the visible rendering. The full keyboard result is in `evidence/2026-09-29-fresh-playwright-reverify.json`.

This fresh result supersedes the old evidence boundary that the current-session browser check could not be run. The 2026-09-23 Wave 15 route scan remains historical support for the six-route scope; this 2026-09-29 check directly reproduces one representative route.

## Separate heading-anchor triage

The old heading-link icon measured 14×14, but the current interactive link target is 44×44 on all 21 headings sampled on `/articles/kod-da-vinchi/` (and all 13 on `/articles/serdce-i-telo/`). The small icon is not the hitbox; it is not admitted as an undersized-target defect. Fresh geometry is in `evidence/2026-09-29-target-and-contrast-reverify.json`.

## Closure boundary

Keep the button out of sequential focus while transparent, or reveal it whenever keyboard focus enters. Resulting-main browser proof should run from `scrollY=0` on all six routes, confirm a visible focused control, then verify the “Наверх” action and post-scroll visible state across desktop/mobile, reduced motion, and focus/scroll transitions.
