# W13C — procedural soil material and sunlight study (DETACHED candidate)

## Scope and evidence boundary
Parent is W13B.1 `c85d3faae6055082956463160ebde0b5a20b5486`. This is **not a branch-published or CI-accepted art release**. Baseline W13A `adbbdc4` has exact-SHA full HOREB QA 6/6, Validate and Preflight PASS. Original same-stage W13A screenshot witness artifact #14673957197 improves shrub and micro-scree placement but still shows mostly flat beige foreground (narrow ART PASS only).

## Actual code change
- New `MidianSurface.ts`: completely original 256×256 periodic four-octave texture; controlled albedo variation + bump microrelief, mipmapped, two-repeat-axis UV budget and bounded neutral modulation; no third-party images, new geometry, geolocation or historical claims. Procedural texture reused within the **same ground material**. No additional terrain draw calls or new physical obstacles. GPU texture disposed explicitly during scene teardown.
- The W13A ecological vertex color still determines wash/scree habitat. Surface maps only modulate it; physics remains `midianGround()` with the same tested placements, 94 rocks, 49 homestead boulder colliders and protected well approach.
- Slight shift from flat, overbright ambient fill to clearer sun/key-shadow contrast, with a bounded ACES exposure adjustment. This is a visual study, not a settled final look.

## Independent gates
- W13B must first pass source  + full real Chromium/pedestrian QA and original screenshots on its exact SHA.
- Then publish W13C only on the same branch/PR after verified fast-forward ancestry; source geometry + original Chromium 1024×768 and portrait 390×844 before/after comparison; explicit rejection if tiling, moiré, harsh shading, unnatural dark ground, missing WebGL, new memory leaks, mobile clipping, lower FPS or lost collisions are observed. Do not call `source PASS` premium ART.
- Hardware Android/iOS GPU frame-time, licenses/Research, historical interpretation and release remain HOLD.

## W13C.2 — silhouette diversity without object inflation

Existing W13A scrub instances are now separated into three low-cost non-species-claiming forms: horizontal compact cushion, vertical open stems and asymmetrical wind-swept scrub. The existing six branches/five leaf planes per accepted seed, mesh materials, instance counts, walkability and placement seeds are unchanged; only scale/position/color of foliage instances vary. This intentionally addresses repeated V-shaped toy bushes; all original W13A geology and major rock collisions remain unchanged. Requires actual same-camera 390px+desktop visual review; any oversized or implausibly green shapes must be rejected.

## W13C.3 — genuine portrait touch and useful art witness

The W13B browser-midian-walk test used desktop `page.mouse` for a 390px mobile control and captured portrait after an unrelated upward drag that inflated sky coverage. The W13C QA candidate instead restores the canonical look direction before portrait, issues true Chrome DevTools Protocol `touchStart/touchEnd` against the movement control, and checks both forward distance and release to prevent stuck walking. The resulting mobile screenshot is a new intentional camera stage and must **not** be compared as pixel-identical with pre-W13C mobile witness; also retain a same-stage comparison of initial establishing shots.

## W13C.4 — portrait visual framing correction

The first W13C.3 portrait screenshot was real touch, but came immediately after a desktop field approach ending next to the well, so the well wall filled most of the phone image. The test now explicitly leaves 3D, switches to 390px, starts a fresh actual portrait walk at the canonical (5.2, 7.6) viewpoint, then performs the same genuine touch movement and capture. Both close-up physically approached lesson and representative environmental portrait are independently retained. This is a **test camera-stage correction**, not an attempted invisible geometry/physics edit.

## W13C.5 — independent review of text-to-3D mastery isolation

Resolved review comment #7051984827 as a new real Chromium cross-mode regression: in the SAME browser storage context, intercept WebGL context acquisition only in a separate reading page, wait for actual fallback UI, answer the Biblical question correctly, assert neither physical observation nor 3D mastery is recorded, then enter a normally functioning 3D world with the original fresh journal and verify that the landmark is still locked until actual approach. This test does not weaken location gating or auto-complete learning. It must pass at least once in local real Chrome and in exact-SHA Actions before ART or educational approval.
