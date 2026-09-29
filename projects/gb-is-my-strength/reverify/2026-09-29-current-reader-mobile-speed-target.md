# Current-main browser reverify — mobile reader speed badge target size (2026-09-29)

## Disposition

**Admit a narrow current touch-target defect:** the “choose speech speed” badge in the Hermenevtika mobile chrome is an active 20.3×13px button. Its pseudo-element expands the painted hit area only to 24.3×19px, still below 24×24. The badge is positioned over the adjacent 38×38 Play button; its center is inside the Play button's target box, so the 24px-diameter spacing exception cannot apply. A touch at the badge center is dispatched to the badge and opens the speed rail, proving that this is an intentional separate action rather than a decorative label.

ID: `GBS-HERMENEUTIKA-MOBILE-SPEED-BADGE-UNDERSIZED`. Scope is the mobile Hermenevtika speed badge on `/articles/kod-da-vinchi/`, `/articles/lot-i-sodom/`, and `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/` below the mobile-bar breakpoint. It does not absorb the existing keyboard speed-panel system lane.

## Identity and overlap

- Product `main` and `origin/main`: `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`; the live release/control-plane SHA is the same.
- Open PRs #2142–#2145 do not touch the Hermenevtika mobile bar or reader controls. The focused open issue search for the speed badge / touch target returned no matches.
- Product code was not changed. Current measurements use the exact-SHA local production-like build, not the live site in a remote browser.

## Fresh Playwright evidence

Chromium `153.0.8010.0`, 390×844, `isMobile: true`, `hasTouch: true`:

| Route | Badge target | `::before` box | Adjacent Play | Touch at badge center |
|---|---:|---:|---:|---|
| `/articles/kod-da-vinchi/` | 20.3×13px | 24.3×19px | 38×38px; badge center lies inside Play box | hit-tests to `#hmSpdBadge`; `aria-expanded` false → true |
| `/articles/lot-i-sodom/` | 20.3×13px | 24.3×19px | 38×38px; badge center lies inside Play box | hit-tests to `#hmSpdBadge`; `aria-expanded` false → true |
| `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/` | 20.3×13px | 24.3×19px | 38×38px; badge center lies inside Play box | hit-tests to `#hmSpdBadge`; `aria-expanded` false → true |

The source owner is `HermenevtikaMobileBar.astro`: `.hm-spdbadge` sets `height:13px`, `min-width:18px`; `::before` uses `inset:-4px -3px`. The badge's computed accessible name is “Выбрать скорость, сейчас 1×” and it remains a native keyboard-focusable button.

## A11Y-05 candidate triage / exclusions

The old 14×14 value was the heading-anchor icon, not its current interactive target. On `/articles/kod-da-vinchi/`, all 21 heading-anchor links measure 44×44. The current Nagornaya “Открыть оглавление” button measures 84×44. The Hermenevtika speed-rail chips measure at least 34×24.5 when displayed, meeting the 24×24 size threshold. These are not included in this defect. The small badge is the current directly reproduced failure.

Full route-by-route touch/geometry data: `evidence/2026-09-29-reader-mobile-targets-reverify.json`; broader target and contrast data: `evidence/2026-09-29-target-and-contrast-reverify.json`. The local mobile crop `evidence/2026-09-29-reader-speed-badge-target.png` shows the small speed badge over the Play control.

## Closure boundary

Give the speed badge a target of at least 24×24 CSS pixels and ensure it remains distinguishable from the Play action. Resulting-main touch and keyboard proof should cover the three named routes at representative mobile widths, verify the badge still opens/selects the speed rail, confirm Play remains independently operable, and recheck focus, expanded state and light/dark styling.
