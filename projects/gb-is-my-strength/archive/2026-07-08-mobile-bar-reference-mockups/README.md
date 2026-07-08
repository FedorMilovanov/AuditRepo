# Reference mockups — mobile TOC/Play bar (Gill series + Hermenevtika), v6 logic + seamless-goo Play

Status: **historical / archived reference material.** Not a task, not something to
implement or migrate now. Kept for history because the seamless-goo Play concept
took a long time to develop and may be revisited later — if a seamless/goo Play
treatment is ever built, these samples are the starting point.

## Files

- `gbs_series_mobile_v6_logic.html` — Gill series mobile TOC/Play bar reference,
  "v6 logic" iteration (later superseded by the v4-refined-no-accuracy samples
  actually integrated into production — see `projects/gb-is-my-strength/incoming/`
  for the integration work).
- `gb_single_mobile_v6_logic.html` — Hermenevtika (single-article) mobile bar
  counterpart to the above, same v6-logic iteration.
- `speedbloom-seamless-goo-play.html` — standalone reference/demo of the
  **seamless "goo" bloom** Play control: the speed rail visually "flows out of"
  the Play disc via an SVG metaball (goo) filter (feGaussianBlur → feColorMatrix
  merge, feMorphology dilate + feComposite for the gold outline) instead of a
  slot-swap/crossfade. Covers day/night/mobile/single-article variants. This
  seamless treatment is **not used anywhere in production** — the shipped
  mobile bars use a simpler slot-swap (search icon/input crossfades with the
  speed-chip rail). Kept here purely for history/future reference.

## Provenance

Uploaded by the project owner on 2026-07-08 for archival, alongside the
already-integrated `GB_MOBILE_V4_REFINED_NO_ACCURACY` reference set (see the
`gb-is-my-strength` repo's own history for the v4 mobile bar integration that
shipped instead of this v6/goo iteration).
