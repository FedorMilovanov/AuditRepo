# HOREB W22 — rigged character / basket contact (ART HOLD)

This is an **independent, reproducible art candidate**, not an accepted depiction of Moses' mother and not a game integration.

## What is preserved

- W19H native .blend and runtime GLB remain bit-identical to their published SHA-256 provenance.
- The 53-bone MakeHuman/MPFB rig and both named NLA animation clips remain available.
- The original 19,158-vertex editable anatomy is kept in the **new W22 .blend**; the hidden helper faces are removed only for GLB export.
- Original verified CC0 MakeHuman and Poly Haven linen texture sources remain separate; MPFB is offline authoring tooling only.

## W22 experimental changes

- Retains the original skinned tunic and reconstructs the existing sleeve roots with a gradual spine-to-upperarm weight transition, rather than adding disconnected shoulder overlays. The two larger overlayer experiments failed visual review and were not promoted. The authored waist tie and plain linen head covering remain art candidates.
- Creates a new skeletal animation from **actual two-bone Blender IK**, baked into the left shoulder/elbow chain. This is not a detached or screen-space hand animation.
- In the isolated viewer, stages the actor at (-0.50, 0.015, 0.30) and shows the **real house GLB and basket** in the gesture camera.
- At frame 60, the independently parsed **exported GLB wrist is 0.0051 m from the real rim**, versus W19H's 0.6219 m for its nearer hand. Acceptance gate: <=0.12 m.
- Independent browser test on 1440x900 and 390x844 confirmed 53 bones, 9 skinned meshes, 2 clips, live 60/105 pause/resume, no page errors.

## Rebuild and tests

Blender 4.5.16 LTS with the original source blend and packed CC0 dependencies:

```
blender --background --factory-startup --python art-lab/mother-w22/source/build_mother_w22_candidate.py
node tests/verify-mother-w22-contact.mjs
node tests/browser-mother-w22.cjs
```

Viewer: `/actorlab-w22.html` on localhost. Evidence files remain under ignored `.test-build/` and are uploaded by the branch-scoped, read-only workflow.

## Unresolved ART HOLD

No claims about a historically attested likeness, garment pattern, hairstyle, facial expression or final realism. Real-world figure animation may still exhibit cloth clipping and poor visual design, especially near the elbow. A skin/face and fabric pass, transparent costume scholarship, real browser screenshots and a physical hand-to-basket review are required before W15 integration or merger.

**Do not merge, deploy or interpret a structural green test as an artistic approval.**

## W24 inspector revision (24 Nov 2026)
- The W22 gesture shot is explicitly labeled as a cutaway study. Walls are hidden only in this inspection shot; the authored basket, work surface, supports and linen remain at their original transforms. The doorway shot restores the house.
- Camera framing adapts its horizontal field of view to the viewport. The actual wrist/basket spatial gate is unchanged (5.09 mm at frame 60).
- Clip selection exits inspection pause and removes stale fades; reselecting the same action no longer crossfades an action against itself. Resume plays the original clip from the frozen frame.
- The browser test reads the real mixer action time, weight and time scale, and checks basket/facade visibility on both 1440x900 and 390x844. The previous W20 browser contract also passes on both viewport sizes.
- W24 wardrobe/skin experiments are local visual studies, not promoted asset changes. The accepted W22 BLEND/GLB stay unchanged; ART HOLD and the no-W15-integration gate remain.

## W24b reproducible wardrobe study
The W24 wardrobe study is deliberately separate from the canonical W22 binary. Rebuild it in Blender 4.5.16 from the SHA-bound original source:

```sh
blender --background --factory-startup --python art-lab/mother-w22/source/build_mother_w24_study.py
```

The default output is the ignored `.test-build/w24-wardrobe-study` folder; set `HOREB_W24_ART_OUTPUT` to a new absolute output directory to preserve long-term evidence. Existing output directories are rejected. The generator refits the tunic, belt and hem, adjusts linen/skin lookdev and performs a nine-frame native BVH clearance gate across both clips, before producing a separate editable BLEND and runtime GLB. W22 had 79 intersecting belt/tunic face pairs per sampled pose. W24 study has zero, with minimum clearance 7.345 mm. Two independent local builds yielded the same GLB SHA-256 `f3d9a470cb2371f600cc8b6c58547fd63aebd8c1d025e80ff327926ef2870cbb` (5,545,660 bytes). The separate exported asset retained 53 joints, both clips and 5.09 mm wrist-to-rim distance; actual Chromium desktop/mobile passed through exact-byte interception of the canonical asset request. Neither historical likeness nor final art approval is implied. The warmer skin still reads too orange in the viewer; shoulders and hood remain stiff. No generated binary is added to the repo by this study.

W24b also fixes the older W19H visibility guard after the W24 cutaway refactor: only W22 shows the basket during its gesture study. W19H now verifies actual runtime basket/facade visibility and restoration at doorway in the browser, and waits for real changed pixels when resuming the clip instead of relying on a fixed delay.
