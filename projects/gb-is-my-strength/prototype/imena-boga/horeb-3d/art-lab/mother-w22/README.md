# HOREB W22 — rigged character / basket contact (ART HOLD)

This is an **independent, reproducible art candidate**, not an accepted depiction of Moses' mother and not a game integration.

## What is preserved

- W19H native .blend and runtime GLB remain bit-identical to their published SHA-256 provenance.
- The 53-bone MakeHuman/MPFB rig and both named NLA animation clips remain available.
- The original 19,158-vertex editable anatomy is kept in the **new W22 .blend**; the hidden helper faces are removed only for GLB export.
- Original verified CC0 MakeHuman and Poly Haven linen texture sources remain separate; MPFB is offline authoring tooling only.

## W22 experimental changes

- Retails the original skinned tunic and reduces oversized rigid sleeve geometry; adds authored waist tie and plain linen head covering.
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
