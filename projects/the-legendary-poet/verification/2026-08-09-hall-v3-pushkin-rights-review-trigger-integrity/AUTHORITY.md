# Hall v3 — Pushkin rights-review trigger-integrity verification

Status: **verified merged Product workflow-wiring repair** for `TLP-HALL-001` / Product #369.

This checkpoint follows `verification/2026-08-09-hall-v3-pushkin-external-authority-state/AUTHORITY.md`. It adds no rights evidence and changes no Hall art/runtime authority. It verifies that the final Pushkin rights-review source authority cannot change without selecting the existing dedicated Hall Blender/export/browser reproof.

## Product transaction

- Product PR: **#396 — `fix(hall): trigger DCC reproof on rights-review authority`**.
- Base Product main: `a9dab5be4a616178f553a2bb967ef327a26f0a76` from #395.
- Exact tested PR head: `a4d1e0124b20ee17de1d0db5f8a1da82c56f56c3`.
- Resulting Product main: `d54eff728ce91505c31d5ed332b1890d3d7a3463`.
- Final diff: exactly one workflow file, two added path-filter lines, zero deletions.

## Reproduced defect

Product #395 registered `docs/hall-v3/pushkin-rights-review.json` in `hall-v3-contract.json.sourceAuthority`, and the existing Pushkin rights validator reads and binds that review. The path-scoped `.github/workflows/hall-greybox-tooling.yml` still omitted the rights-review file from both `pull_request.paths` and `push.paths`.

Therefore a future isolated change to the registered rights-review authority could receive normal repository checks while failing to select the dedicated exact-head Hall Blender/export/browser workflow that executes the same current Hall authority chain.

## Verified repair

Product #396 adds exactly this authority path to the two existing Hall workflow path filters:

- pull-request changes targeting `main`;
- pushes to `main`.

No new workflow, dispatcher, validator, schema or duplicated DCC pipeline was created. The existing Hall workflow remains the single reproducible DCC/export/browser barrier.

## Exact-head verification

The one-file exact head `a4d1e0124b20ee17de1d0db5f8a1da82c56f56c3` passed the complete applicable fan-out before merge:

- Project Contracts run `31333143462` — **success**;
- CI run `31333143402` — **success**;
- Hall greybox tooling run `31333143406` — **success**; the changed workflow itself selected and completed its full exact-head chain, including source authority validators, pinned Blender 4.5.12, frozen H1/H2/H3 regeneration, R1 evidence, representative material/light bay, tangent reseal, Khronos raw validation, preservation-safe `gltfpack`, Khronos optimized validation and Chromium material witness;
- Brand deep reference and motion audit run `31333143435` — **success**;
- Site route integrity run `31333143404` — **success**;
- Manual Browser QA run `31333143422` — **success**, including Chromium/Android, fresh-process base iPhone Safari, critical/reduced-motion iPhone Safari, premium desktop pointer/performance and WebKit home/route contours;
- Pages request `31333143411` — expected **skipped**.

Final Product review surface had zero submitted reviews and zero review threads. Final race preflight showed Product main unchanged at `a9dab5be4a616178f553a2bb967ef327a26f0a76`, PR #396 as the only open Product PR, branch `behind=0`, and the diff still exactly one workflow file with `+2/-0` before expected-head-protected merge.

## Preserved authority

#396 changes workflow coverage only. It does not alter:

- H3 topology or frozen fingerprints;
- R1 guided camera;
- L0 minimal-runtime lighting;
- UV0 at `1.5 m / UV unit`, UV1 reserve or rejected current L1 bake;
- `pushkinVerticalSlice` as the only active Hall gate;
- zero approved documentary assets and two exact source-byte hashes;
- `external-authority-required` as the Pushkin rights workflow state;
- blocked documentary Blender consumption, production manifest and production Three/R3F/WebGL;
- blocked `offlineVisualApproval`, `webVerticalSlice` and `fullMuseumScaleOut`.

## Queue disposition

**No new autonomous Product transaction is selected by this checkpoint.**

The current documentary-rights sub-lane remains parked at the genuine owner/legal/institutional boundary. Product #396 only closes a workflow-selection hole around already-current authority. Further Product work in this sub-lane still requires a real external material input or a newly reproduced independent root-cause defect.

Engineering MASTER remains untouched; this architecture/workflow-authority repair is not promoted into an engineering bug row.
