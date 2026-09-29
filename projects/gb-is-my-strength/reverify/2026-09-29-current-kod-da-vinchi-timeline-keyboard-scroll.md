# Current-head reverify — Da Vinci Code timeline keyboard scrolling (2026-09-29)

## Disposition

**Admit one direct current accessibility defect:** the canon timeline becomes horizontally scrollable in the narrow desktop/tablet breakpoint band, but its scroll viewport is an unfocusable generic `div` with no focusable descendants. A keyboard-only user cannot move the timeline horizontally to reveal the clipped portion at those widths.

Admitted as `GBS-KOD-DA-VINCHI-TIMELINE-KEYBOARD-SCROLL`. This does not claim that the whole article or timeline is unavailable, that touch/pointer scrolling fails, or that the narrow mobile reflow is affected.

## Identity and overlap check

- Product `main` HEAD and `origin/main`: `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`.
- Live `releaseSha` / `controlPlaneSha` was reverified at the same SHA in the 2026-09-29 current-head pass.
- Open Product PRs #2142–#2145 do not touch the Da Vinci page component or `css/site.css`; open issue search for the route/timeline/keyboard scope returned no matches.
- No Product code was changed.

## Current source and user impact

1. `src/components/article-pilots/kod-da-vinchi/KodDaVinchiSectionCanon.astro:31–32` renders `.ctw-body` as a plain `<div>` around `.ctw-track`. The body/track descendants are descriptive text and plain `div`/`span` markup, not focusable controls; the body has no `tabindex` or landmark role. Repository search found no JS enhancement that makes this element focusable.
2. `css/site.css` sets `#canonTimeline .ctw-body { overflow-x: auto }` and `.ctw-track { min-width: 580px }`.
3. The mobile override is only `@media (max-width:640px)`: it changes the body to `overflow-x:hidden` and the track to `min-width:0; width:100%`. At 641px that override is inactive. The page's current `.page-wrap` and classless-main width caps are `min(820px, 92vw)`, so at 641px the available page/main width is at most about 590px before their own padding; the timeline card then reserves about 56px horizontal padding. Fresh Chromium measurement at 641px found `.ctw-body` 484px wide with `overflow-x:auto` and `scrollWidth=605` (the track's client width is 580px); a horizontal mouse-wheel action moved `scrollLeft` by 121px. The region has `tabIndex=-1` and no focusable descendants, so it is absent from sequential keyboard navigation.
4. At 640px the responsive rule is active: the body is 483px wide with `overflow-x:hidden`, and the track is 483px wide. Its internal `scrollWidth` is 500px because of one row's content. The captured 640px screenshot shows the reflowed chart and no obvious cut-off of its labels/bars, but this check does not assert that every viewport below the breakpoint is free of clipping. The admitted defect remains the keyboard-inaccessible horizontal scroll region above 640px; do not broaden it to the mobile reflow without separate evidence.

## Fresh exact-SHA runtime check and archived corroboration

Playwright Chromium `153.0.8010.0` tested the local production-like build of exact Product HEAD `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b` at viewport widths 641px and 640px. At 641px, `.ctw-body` measured 484px client width against 605px scroll width, had `overflow-x:auto`, `tabIndex=-1`, and zero focusable descendants; a horizontal mouse-wheel gesture scrolled it 121px. A sequential keyboard user has no tab stop in the region. At 640px, the responsive override switched to `overflow-x:hidden`; a screenshot captured the mobile reflow. Evidence: `evidence/2026-09-29-theme-focus-timeline-reverify.json` plus `evidence/2026-09-29-kod-da-vinchi-timeline-641.png` and `evidence/2026-09-29-kod-da-vinchi-timeline-640.png`. These are fresh local exact-SHA browser results, not remote live-host navigation.

The exact-SHA 2026-09-23 axe run scanned all routes at 1440×900 (`incoming/arena-agent-visual-playwright/2026-09-23/REPORT.md`, Wave 2). Its `../incoming/arena-agent-visual-playwright/2026-09-23/evidence/axe-wcag-aa-104-routes.json` reports one serious `scrollable-region-focusable` finding on `/articles/kod-da-vinchi/`, target `.ctw-body`, with the check message “Element should have focusable content.” This historical result corroborates the missing keyboard-access mechanism, but is not represented as a direct screenshot of the 641px overflow band. No fresh axe run was performed.

## Closure boundary

Make the horizontal scroll region keyboard-operable whenever it actually overflows (for example, a deliberate focusable region with an accessible name and visible focus indication, or a responsive layout that avoids hidden horizontal content). Resulting-main browser evidence must use a width just above the 640px breakpoint where the track overflows, demonstrate Tab focus and keyboard horizontal scrolling through the full timeline, and confirm the <=640px reflow remains unclipped and usable. Preserve pointer/touch behavior and avoid adding a needless tab stop at widths where no overflow exists.
