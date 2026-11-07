# Arena Agent — CONTINUE existing HOREB 3D only

Repository: https://github.com/FedorMilovanov/AuditRepo
Branch: `lane/horeb-3d-lab-20261108`
Project folder: `projects/gb-is-my-strength/prototype/imena-boga/horeb-3d`
Research: https://github.com/FedorMilovanov/Research/pull/379
Other two prototype siblings: https://github.com/FedorMilovanov/AuditRepo/pull/538

## Fail-closed initial check
1. Confirm `package.json`, `package-lock.json`, `src/imena-boga-horeb-3d/HorebApp.tsx`, `src/imena-boga-horeb-3d/engine/World.ts` and `original/arena-horeb-original.zip` **exist on this branch**.
2. Check ZIP SHA-256 equals `c2267894e1369f96244f0df9b78b51acfc5ccfeb4838f25037b2ec1551b14fa9`.
3. If not yet imported, **do not regenerate from scratch**. Ask the user to attach the original ZIP for import and resume here.
4. Read `README.md`, `SOURCE_PROVENANCE.md`, `docs/SCENE_MAP.md`, `docs/SOURCE_AUDIT.md`, `audit/acceptance-matrix.md`, `audit/iteration-log.md` and Research #379.

## Build on inherited implementation
Work on original Three.js player navigation, 8 spatial zones, BurningBush, real outer/inner boundaries, sandals removal, UX, visual quality, adaptive geometry and no-JS reader. Extend toward 42 individually contextualized scenes and physical interactions: Abraham/Beersheba well/tamarisk, Hagar/Beer-lahai-roi, Gideon altar, Moses/Marah, Sinai, poetry, visions, and later scriptures marked explicitly as later literary horizons. Never visually portray God or misidentify a person/place/altar/predication as a personal divine name.

Iterate on root causes instead of creating parallel apps. Run npm ci, actual build/typecheck/unit/E2E/browser screenshots; report any tests that cannot be run. Improve real scene quality, movement, accessibility, device fallback, font assets, performance. Preserve all publication HOLD flags pending scholarly and rights review.

## Safety and ownership
Only change this project in this branch. Do not merge the draft PR, deploy, touch production, rewrite Atlas/Sozvezdie, or modify Research. If Arena mandates another worktree/PR, target the *same HOREB change set* and explain the limitation. No parallel canonical branches.

At the end: provide exact SHA, screenshots/preview, documented test commands and results, 42-item coverage matrix, blockers, and an updated next-agent checkpoint.
