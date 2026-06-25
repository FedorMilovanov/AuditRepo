# PlayEmber speed popover — redesign + Gill wiring — FIXED

**Agent:** `arena-agent-2`
**User report:** clicking PLAY (•) did nothing in Yandex/Edge on Gill pages; the speed
tooltip was an "ugly sideways strip". Wanted a stylish minimalist frame expanding OUT OF
the play circle, closing on select or mouse-leave.
**Source HEAD:** `03e01a0` → patch pushed to gb-is-my-strength branch
`lane/fix-play-popover-premiumcontrols-2026-06-25` (commit `0f35321`).
**Method:** Playwright real-mouse-click on production-like dist (trust order #1).
Screenshots: `artifacts/popover-light.png`, `artifacts/popover-dark.png`.

---

## Root causes (3, all confirmed)

1. **initPlayExpand filter too narrow.** It accepted only embers inside `[data-fc-root]`.
   Gill part1/2/3/spravochnik embers live in `.gbs-rail-foot` under
   `[data-fc-controls="gill-rail"]` → never received a speed panel → PLAY click fell
   through with no UI. (hermenevtika/kod-da-vinchi/antisovetov/gill-context worked
   because their ember IS inside `[data-fc-root]`.)
2. **Gill part1/2/3/spravochnik PageHead never linked `floating-cluster.css`.** Even if a
   panel existed, it would be unstyled. Only `GillContextPageHead` linked it.
3. **Panel CSS expanded sideways** (`right:0; clip-path`) → the "ugly tooltip beside".

## Fixes

- `js/floating-cluster-controller.js` `initPlayExpand`:
  - accept `[data-fc-root], [data-fc-controls]`;
  - wrap each ember in `<span class="gb-ember-wrap">` so the popover anchors to the circle.
- `css/floating-cluster.css`: redesigned `.gb-ember-expand` — popover ABOVE the ember
  (`bottom:calc(100%+12px)`, centered), scale+translateY spring reveal, layered soft
  shadows, arrow tail pointing at the circle, compact pill buttons, dark-mode variants.
  Close on: speed select (240ms), mouseleave (220ms grace), outside click, Escape.
  Removed the standalone close button.
- `PlayEmber.astro`: dropped `aria-disabled="true"` (violates rollout-plan runtime
  contract #3 — the button IS interactive, it opens the speed panel); added
  `aria-haspopup`/`aria-expanded`.
- `GillPart1/2/3/SpravochnikPageHead.astro`: added `<link href="floating-cluster.css">`.

## Verification — Playwright real mouse click, production-like dist

| Route | popover open | expands UP out of circle | centered | panel W×H |
|---|---|---|---|---|
| hermenevtika | ✅ | ✅ aboveEmber | ✅ | 324×40 |
| gill-context | ✅ | ✅ | ✅ | 324×40 |
| gill-part1 | ✅ | ✅ | ✅ | 324×40 |
| gill-part2 | ✅ | ✅ | ✅ | 324×40 |
| gill-part3 | ✅ | ✅ | ✅ | 324×40 |
| gill-spravochnik | ✅ | ✅ | ✅ | 324×40 |

Behaviour:
- after selecting 1.5 → closes ✅, persists `gbx-tts-rate=1.5` ✅
- reopen → 1.5 marked active ✅
- mouse-leave → closes ✅

`node --check` pass; `data:consistency` pass.

## Notes / honest boundary
- `pw` width 324 (6 speeds × ~54). If owner wants it narrower, drop `2×` or collapse to a
  vertical stack — current horizontal pill is the minimalist default.
- The earlier-reported Gill desktop theme/search dead (C-12 / gill-rail fix) is on a
  separate branch `lane/fix-gill-rail-clickability-premiumcontrols-2026-06-25`; both
  lanes are independent and can be merged separately.

## Status: RESOLVED
PLAY now opens a stylish popover expanding up out of the circle on ALL 6 pilot routes
(incl. the previously-broken Gill part1/2/3/spravochnik); closes on select / mouse-leave.
