# Hall v3 — material-to-Pushkin gate promotion verification

Status: **verified merged Product promotion** for `TLP-HALL-001` / Product #369.

This record follows `verification/2026-08-09-hall-v3-material-decision/DECISION.md`. It verifies only the separate Gate-4 promotion transaction. It does **not** authorize production Hall WebGL, full-Hall lookdev, later-gate promotion, or rights-uncleared Pushkin media.

## Product transaction

- Product PR: **#390 — `architecture(hall): promote Pushkin vertical slice gate`**;
- exact tested head: `68087a457295f4d08bdf774101d61ff83f0566a6`;
- merge / resulting Product `main`: `7337c61b07709b04ecb947491d1d59b499b81ceb`;
- source decision PR: **#389**;
- source decision exact head: `6a843479987b1022da562f342bbe9e61ff1214fc`;
- source decision resulting main: `022c25b84aa3e4228fff3fbff6f4cef11e2d36c7`.

Exact-head certification on `68087a457295f4d08bdf774101d61ff83f0566a6` passed:

- Project Contracts;
- full CI, typecheck, build, route budgets, prerender and SEO;
- Hall Blender 4.5.12 LTS topology/camera/material/export/browser reproof;
- Khronos validation before and after optimization;
- Brand deep reference/motion and Brand raster QA;
- Articles catalog acceptance;
- Site route integrity audit;
- Yesenin Part I and Part II gates;
- complete Manual Browser QA: Chromium/Android, fresh-process base iPhone Safari, desktop WebKit reveal, premium homepage matrix and critical iPhone/reduced-motion path.

Pages deployment request was skipped as expected for the PR and is not a failed quality gate.

## Gate transition

The promotion performs exactly one state transition:

- `phase`: `materialLightingExportSpike` → **`pushkinVerticalSlice`**;
- `gates.materialLightingExportSpike`: `active` → **`completed`**;
- `gates.pushkinVerticalSlice`: `blocked` → **`active`**;
- `offlineVisualApproval`: remains `blocked`;
- `webVerticalSlice`: remains `blocked`;
- `fullMuseumScaleOut`: remains `blocked`.

Production `/hall` remains the lightweight DOM placeholder. Production Three/R3F/WebGL remains forbidden until a later explicit gate.

## Frozen authority preserved by promotion

- topology: **H3**;
- H3 layout fingerprint: `5d5d0ddd8b150aa64afb73a2a3d9e00c6005e99fc935a6d4707a49ecd475fe65`;
- H3 geometry fingerprint: `b3de770858a423305db8fcab15b405414e66b3d3de93ab1deaa5b3b35b418777`;
- guided camera: **R1**;
- Pushkin viewing witness: position `[8.0,2.5,1.60]`, target `[11.15,5.45,1.95]`, lens `28 mm`;
- selected lighting baseline: **L0-minimal-runtime**;
- surface material channel: **UV0** at accepted `1.5 m / UV unit`;
- static-bake reserve: **UV1**, optional / not mandatory;
- current `L1-external-lightmap` bake remains **`reject-current-bake`**;
- final production texture encoding remains deferred to the Pushkin slice;
- QA proof PNGs remain non-production evidence.

Accepted historical material evidence remains Product #388 artifact `9036351234` / digest `sha256:dc33af96ba747175794f9f31775c534c224a35645d9943302424459e0bf8cc95` on head `600f28efd2aa59b6d31086b64aeb42da7b03a48e`.

## Reproof determinism correction

The first #390 promotion head exposed a real validator-model defect after all topology/camera/export/Khronos checks had passed: an independent Blender export did not reproduce the historical accepted raw/optimized GLB full-file SHA byte-for-byte.

The failure was **not** accepted as scene drift and was not bypassed. The failed promotion artifact was `9039153673`.

Direct forensic comparison against accepted #388 evidence showed:

- raw GLB size remained `200,672 B`;
- the raw GLB JSON/schema chunk was identical;
- stable source textures, lightmaps and visual-lookdev evidence were identical;
- drift was confined to floating-point UV/tangent payloads emitted by Blender evaluation;
- Khronos semantic validation remained clean;
- optimization preserved the required structure and semantics.

Therefore the current persistent authority correctly separates:

1. **historical accepted evidence identity** — the #388 raw/optimized SHA values remain frozen provenance of the artifact that was manually accepted;
2. **independent reproof identity** — a later Blender run must prove the same frozen H3/R1/material semantics, exact stable source assets, raw self-identity, exact structural schema, Khronos `0 errors / 0 warnings`, optimizer preservation and browser visual/cost thresholds; unsupported whole-file Blender byte determinism is not required.

This is stronger than silently accepting arbitrary new bytes and more truthful than a false full-file SHA invariant.

## Successful promotion reproof

Final successful Hall artifact on exact head `68087a457295f4d08bdf774101d61ff83f0566a6`:

- artifact `9039305326`;
- artifact digest `sha256:b39dd5bf22351b7302d30caed3a3f30b1b39efa6da5c7df03a36c56fb956daf0`;
- regenerated raw GLB: `200,672 B`, self-matched SHA `8b59a812…`;
- raw structural/schema hash: `d3c9e456…`;
- regenerated optimized GLB: `141,896 B`, SHA `810865870…` in the successful run;
- normalized optimized schema hash: `68c35010…`;
- raw/optimized Khronos: `0 errors / 0 warnings`.

Browser reproof preserved the selected/rejected decision metrics:

- L0 mean display luma `0.180365`;
- L0 dark-sample ratio `0.393663`;
- L1 mean display luma `0.065536`;
- L1 dark-sample ratio `0.968316`;
- L0 GPU texture residency `1,398,096 B`;
- L1 GPU texture residency `1,791,312 B`;
- incremental L1 lightmap GPU residency `393,216 B`;
- raw↔optimized mean absolute channel difference `0.0047743`;
- normal-response mean absolute difference `1.453125`;
- roughness-response mean absolute difference `0.538194`.

The meaning of the decision is unchanged: L0 remains the selected Pushkin baseline, the current L1 bake remains rejected, and `393,216 B` remains GPU residency rather than transfer/file bytes.

## New active bounded phase — Pushkin vertical slice

The promotion itself added no Pushkin portrait/document assets, production textures or runtime files.

The first Pushkin-slice work must begin **rights/provenance first**, not from final browser/runtime code.

`docs/hall-v3/RIGHTS_REGISTER.md` requires a documentary asset record containing source identity, institution/archive address, object ID/call number where available, rights status/basis, credit, source-file hash, runtime path and verification status. Only records with `verificationStatus` / disposition equivalent to **`approved`** may enter the production Hall manifest.

Important evidence rules remain:

- file availability is not permission;
- a museum/catalogue page identifies an object but does not automatically license a reusable image;
- catalogue record and reproduction file are separate evidence objects;
- AI-generated imagery may not impersonate a historical manuscript, signature, facsimile or museum object;
- unresolved rights/provenance must remain pending/blocked rather than inferred.

## Next bounded transaction

Disposition: **Pushkin rights/provenance acquisition + source/offline exhibit authority**.

The next Product #369 wave should establish a machine-readable Pushkin asset/provenance manifest and validate a narrowly bounded first exhibit source package before final WebGL integration.

It may:

- register candidate Pushkin documentary assets with exact object provenance and separate reproduction-rights basis;
- move only independently verified records to `approved`;
- define one complete Pushkin exhibit source/offline assembly on frozen H3/R1/L0;
- compare production texture encoding only on that first slice with measured evidence;
- establish first-slice asset/transfer/GPU/frame-time budgets;
- create fixed still/offline-camera evidence required for later visual approval.

It may not:

- treat object age or public availability as proof that a specific digital reproduction is reusable;
- use rights-pending media in a production Hall manifest;
- generate fake historical autographs/manuscripts/facsimiles;
- redesign H3 or R1;
- revive the rejected current L1 bake as approved;
- start full-Hall lookdev;
- activate production Three/R3F/WebGL before offline approval;
- advance `offlineVisualApproval`, `webVerticalSlice` or `fullMuseumScaleOut` inside the acquisition/source-authoring transaction.
