# Current-head reverify — Nagornaya source-link distinction (2026-09-29)

## Disposition

**Admit one direct current accessibility defect, narrowly scoped to the bibliography/source links on Nagornaya chapters 1, 3 and 5:** the linked titles appear inline in small gray bibliographic text, but current screen CSS removes the link underline while rendering links in a blue too similar to that surrounding text. People who cannot reliably distinguish the hues are left without a sufficiently strong visual cue that those source titles are links.

Admitted as `GBS-NAGORNAYA-SOURCE-LINKS-COLOR-ONLY`. This is a link-distinction finding (WCAG 1.4.1), not a claim that the links are unavailable to keyboard users or that their text/background contrast itself fails.

## Identity and overlap check

- Product `main` HEAD and `origin/main`: `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`; live release/control-plane identity was reverified at this same SHA in the 2026-09-29 current-head pass.
- The open Product PRs #2142–#2145 touch a research note, genealogy data, dependency manifests, and an apostasy article respectively; none changes the Nagornaya page components or shared link CSS.
- Open issue searches for `link-in-text-block`, inline-link contrast/underline, and A11Y-08 returned no matches.
- No Product code was changed. Fresh Playwright Chromium 153 checks were subsequently run on the local production-like build of this exact SHA (not the remote live host); results are documented below and in `evidence/2026-09-29-nagornaya-source-link-reverify.json`.

## Fresh exact-SHA browser check (2026-09-29)

Playwright Chromium `153.0.8010.0` tested the local production-like build of Product SHA `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`, at 1440px, on chapters 1, 3 and 5 in both reader themes. It selected one visible bibliography link per page/theme and recorded link color, adjacent text color, text decoration, hover and keyboard-focus styles. The machine-readable record is `evidence/2026-09-29-nagornaya-source-link-reverify.json`; small no-hover/no-focus light/dark crops from chapter 3 are `evidence/2026-09-29-nagornaya-source-link-light.png` and `evidence/2026-09-29-nagornaya-source-link-dark.png`.

- **Light theme:** all three routes compute source link color `rgb(31, 78, 163)` against adjacent bibliography text `rgb(120, 113, 108)`, a 1.64:1 contrast ratio. `text-decoration-line` is `none` at rest, on hover and at `:focus-visible`. Hover changes the link color to `rgb(122, 46, 46)` but adds no underline.
- **Dark theme:** all three routes compute link color `rgb(212, 165, 116)` and adjacent text `rgba(238, 231, 220, 0.78)`. The effective text color was composited over the nearest opaque bibliography-card surface `rgb(22, 26, 33)`, yielding `rgb(190.48, 185.9, 178.86)` and a 1.15:1 link-to-neighbor contrast ratio. No underline appears at rest, hover, or focus.
- The selected links do match `:focus-visible` and show a 2px focus outline. This verifies keyboard focus visibility; it does not supply a persistent cue to readers identifying links when they are not focused. The fresh sample is limited to one representative visible link per route/theme and does not absorb other archived route/style clusters.

These current-runtime measurements confirm the admitted color-only link-distinction defect in both tested reader themes. They are local exact-SHA browser evidence, not a direct live-host test.

## Current implementation and archived witness

- `src/components/nagornaya/chast-1/NagornayaChast1SectionX.astro`, `src/components/nagornaya/chast-3/NagornayaChast3SectionX.astro`, and `src/components/nagornaya/chast-5/NagornayaChast5MainShell.astro` place external source-title anchors directly inside bibliography spans styled `text-stone-500` (small text). The anchors themselves have no text-decoration or color class.
- All three page heads load the current `/css/site.css?v=233791bf`. Its shared light-theme link tokens set `--color-link:#1f4ea3`; the base `a` rule uses that link color and `text-decoration:none`. The affected anchors are in `<main>` source lists, not in an `<article>` element covered by the print-only `article a` underline rule. Thus current source explains the archived computed styling and offers no persistent non-color cue.
- The same-SHA 2026-09-23 axe WCAG 2.2 AA scan at 1440×900 reports 19 `link-in-text-block` nodes across six routes. Representative bibliography links on `/nagornaya/chast-1/`, `/nagornaya/chast-3/`, and `/nagornaya/chast-5/` measure 1.63:1 against their surrounding text (axe threshold: 3:1 when color is the only distinguishing cue). The overall six-route artifact also includes other distinct link styles; this admitted row is deliberately limited to the shared Nagornaya bibliography-link treatment and does not silently claim those other cases are repaired.

## Closure boundary

Give these inline source links a persistent non-color cue such as an underline, or otherwise make their contrast against surrounding text at least 3:1 while also preserving applicable text/background contrast. Resulting-main browser/axe proof must cover the cited links on all three chapter routes in light/dark themes and their hover/focus states, verify the cue remains visible without hover, and avoid unintentionally underlining unrelated navigation/card controls. Separately triage the other three route/style clusters from the archived 19-node finding before claiming the broader site-wide issue is closed.
