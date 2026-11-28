# W12D.5 — bounded woven coil bindings on existing baskets

## Observed artistic shortfall
Actual Chromium W12D.4 `homestead-walk-desktop.png` and `homestead-walk-interior.png` show two overly smooth cup-shaped domestic vessels. W12D.4 itself passed exact-SHA HOREB QA 6/6 (#44329150771), Validate, Preflight, and independent before/after visual roof assessment against W12D.3.1: underside was visibly brightened without losing real wall/floor shadows.

## W12D.5 scoped change
- Retains both existing basket bodies, original woven texture and open rims, exact positioning and physical collider radii.
- Adds five subtly irregular coiled bands per basket with a shared geometry and **ONE** instanced draw call for ten visible details. No new texture, historical claim, additional light, shadow map, actors, fixed props or collision obstruction.
- Actual Chromium verifies 2 bodies + 2 rims + 10 bands in one instanced mesh. Source tests bound the geometry, count and size. Current eight-zone walk, four side pedestrian groups, mobile390 actual touch, ESC and WebGL remount remain mandatory.

## Outstanding acceptance
This is a *candidate*, not an art pass. Require exact-SHA Validate, Preflight, source-and-geometry, full Chromium, all four independent side pedestrian jobs; inspect actual interior/exterior/mobile390 PNG against W12D.4 for z-fighting, visible regular hoops, industrial banding, darker roof and mobile performance. Original scenario in Exodus 2 does NOT prove such basketry or exact household construction. Entire Midian ART, Research/rights, physical devices, live characters, herd, voices and release remain HOLD.

Safeguards: only existing Draft PR #543 and branch `lane/horeb-3d-lab-20261108`; no main merge, new branch, force push, Research work or local Windows W10D `NilePrelude.ts` edits.
