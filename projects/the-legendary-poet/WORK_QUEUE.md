# Optional Work Queue — the-legendary-poet

Эта очередь показывает owner-selected направления. Перед любой source mutation нужно заново проверить актуальный source owner, open PRs и применимое evidence.

## Current selection — TLP-HALL-001 / Product #369

Owner-selected operating order:

`VERIFY → one root cause or bounded architecture question → one owner/agent → PR → exact-head gates → Browser QA where behavior warrants it → merge → AuditRepo evidence update → next wave`.

Current verified engineering matrix: [`verified/MASTER_BUG_MATRIX.md`](verified/MASTER_BUG_MATRIX.md).

Current verified engineering rows: **0**.

`TLP-HALL-001` is an owner-selected architecture lane, not an engineering bug row. Eight bounded Hall source waves are merged:

- foundation: Product PR #373, exact tested head `9c63a500257c1dc01e4df5c4dcecb8bbfd9fd0fb`, resulting Product `main` `9cce8bb386262172a50f0d65d52372e045e4cd43`;
- Reference Bible: Product PR #374, exact tested head `9a993399749a818fed5ffe9ac9ee2378807aafc2`, resulting Product `main` `cc81858626c8ddcf8e59016231068c45cbb6e246`;
- metric-greybox tooling/preflight: Product PR #375, exact tested head `4d4c1b8e6c1832dce6eac6a2509d76bce65cc724`, resulting Product `main` `c34debc7ec3cf769261779d763f21f617a3500a2`;
- neutral H1/H2/H3 candidate authoring: Product PR #376, exact tested head `70aeb9c1aca4414d9cade3cb9cdcfb887b7ea806`, resulting Product `main` `66dabcdcff5fa0fc8ad8fde44544432e4a144e4d`;
- topology select/reject: Product PR #381, exact tested head `2b0b674e5c1010927f7c50e496b5b33fd6ff781b`, resulting Product `main` `b97c851333c6a78869b78f762b2238b1dcd19fa8`;
- H3 camera candidate authoring: Product PR #382, exact tested head `7637010ef69248fe05ea37c1a1cf9ee8d2a38193`, resulting Product `main` `779719f88e630acda9dfb84520c913aac239fbf4`;
- R1 camera decision: Product PR #383, exact tested head `8682789cf78e4e717eba5181246700da09de5c11`, resulting Product `main` `07e23ea3feb79fea9d42f29b192e4e3f046713cc`;
- camera-gate promotion: Product PR #384, exact tested head `f559a06f51483c4ea2a95795a7dad266940ddd70`, resulting/current Product `main` `a873a427c8dda34bd28baa12d8e34fc110f3268c`.

Evidence:

- `verification/2026-08-08-hall-v3-foundation/FOUNDATION.md`;
- `verification/2026-08-08-hall-v3-reference-bible/REFERENCE_BIBLE.md`;
- `verification/2026-08-08-hall-v3-greybox-tooling/TOOLING.md`;
- `verification/2026-08-08-hall-v3-greybox-candidates/CANDIDATES.md`;
- `verification/2026-08-08-hall-v3-topology-selection/SELECTION.md`;
- `verification/2026-08-09-hall-v3-camera-chain/CAMERA_CHAIN.md`.

### Hall v3 material / lighting / export spike — current bounded wave

Production source now has exactly one active Hall topology authority (**H3**) and one approved guided camera (**R1**). H1 is retained as topology reserve, H2 is rejected; R3 is camera reserve, R0/R2 are rejected. Production `/hall` remains a lightweight DOM placeholder.

#### Current source witness

- Product `main@a873a427c8dda34bd28baa12d8e34fc110f3268c` is `phase=materialLightingExportSpike`;
- `foundation=completed`, `referenceBible=completed`, `metricGreybox=completed`, `cameraApproval=completed`;
- `materialLightingExportSpike=active`;
- every later Hall gate remains blocked;
- H3 layout fingerprint remains `5d5d0ddd8b150aa64afb73a2a3d9e00c6005e99fc935a6d4707a49ecd475fe65`;
- H3 mesh geometry fingerprint remains `b3de770858a423305db8fcab15b405414e66b3d3de93ab1deaa5b3b35b418777`;
- selected R1 `pushkinViewing`: position `[8.0,2.5,1.60]`, target/destination `[11.15,5.45,1.95]`, lens `28 mm`;
- production `/hall` still forbids legacy Hall imports, Three/R3F runtime and unapproved concept art.

#### Material-spike problem to solve

The next gate must prove one **small representative H3 architectural bay** before any full-Hall lookdev. It must answer, with generated and browser-inspectable evidence:

1. which material channels own color vs data and how sRGB/non-color handling is preserved from Blender through glTF/Three;
2. what UV0/UV1 contract is required for the representative bay;
3. whether static illumination is best delivered as IBL/minimal realtime only, external baked lightmap on UV1, or a more aggressively prebaked static shell;
4. how raw Blender export is validated and optimized without losing node names, extras, camera authority or UV channels;
5. what geometry/texture/download/GPU-memory cost the bay actually has;
6. whether the result remains viable in a browser without activating production `/hall`.

#### Next bounded transaction

Product #369 owns one spike-only source transaction:

1. start from fresh Product `main@a873a427c8dda34bd28baa12d8e34fc110f3268c`; re-check current main, open source PRs and Product #369 comments before mutation;
2. keep H3 topology and R1 camera immutable; no wall/route/camera fix may be smuggled into lookdev;
3. create one representative H3 architectural bay only — wall/portal/floor/exhibit proxy scale sufficient to test material, UV, lighting and export behavior;
4. use no final Pushkin documentary image and no rights-uncleared asset;
5. prove baseColor/emissive as color textures and normal/roughness/metalness/AO as data textures; reject the old Hall-v2 blanket-sRGB behavior;
6. reserve UV0 for surface materials and explicitly test UV1 only where static bake/lightmap delivery requires it;
7. compare a small bounded lighting set rather than committing the whole museum to one strategy before evidence;
8. export raw glTF/GLB from pinned Blender, validate it, then run one controlled optimization path while proving mandatory node names/extras/UV channels survive;
9. keep generated `.blend`, raw/optimized GLB, KTX2/lightmap candidates and browser captures as Actions artifacts unless/until a later gate promotes a runtime asset;
10. measure bytes, meshes, materials, textures, triangles/draw-call proxy and browser viability on the representative bay;
11. do not add Three/R3F/WebGL to production `/hall`; any browser viewer used in this spike must remain test-only/non-route authority;
12. if the spike cannot preserve visual/material correctness inside reasonable delivery constraints, change the material/light/export strategy — do not hide the defect with bloom, fog, mirror floors or other post-processing;
13. only after this spike has a selected delivery contract may `pushkinVerticalSlice` become active.

#### Automatic rejection during the spike

- H3 walls/route or R1 camera are changed to make lookdev easier;
- stone or plaster uses metallic values as a visual cheat;
- normal/roughness/metalness/AO are treated as sRGB color data;
- static lighting depends on many realtime shadow-casting lights;
- a lightmap strategy cannot prove its UV channel/binding contract explicitly;
- optimization removes required node names/extras/UVs or changes visible geometry unexpectedly;
- generated output can be considered "good" only with bloom/fog/vignette/particles;
- one test strategy gets materially better geometry or camera treatment than another;
- full-Hall texture/light work starts before the representative bay contract is selected;
- production `/hall` begins loading the spike.

#### Decision dispositions

- `approve-spike-contract`: one material/UV/light/export path passes and becomes the basis for the later Pushkin vertical slice;
- `repeat-spike`: allowed for a reproduced material/export/browser defect while H3/R1 remain frozen;
- `reopen-camera`: only for a newly reproduced camera defect not caused by material/lookdev work;
- `reopen-topology`: only for a newly reproduced spatial defect that cannot be solved without geometry change;
- `close`: not permitted; `TLP-HALL-001` remains open through Pushkin slice, offline/web approval and production certification.

## Closed current-scope families

### TLP-ARCHIVE-001 / Product #363 — deterministic cross-tab favorites convergence

Closed by Product PR #368, exact tested head `6f9408aceccfae0fbb0abf1993695f000e84ffe0`, squash merge / resulting Product `main` `576ac818d6ca426e5786aba3efc27f8b20abf2bf`.

- favorites persist as bounded v4 per-poem operations rather than whole-snapshot last-writer-wins state;
- deterministic per-poem ordering, removal-wins ties and storage-event repair are permanently guarded;
- full exact-head CI, Project contracts, route/brand gates and Manual Browser QA passed before merge.

Detailed closure evidence: `verification/2026-08-07-archive-cross-tab-convergence/CLOSURE.md`.

### TLP-AUDIO-002 / Product #360 — precision-safe cross-tab logical ordering

Closed by Product PR #362, exact tested head `0a9d5c0c2cf5eeb801045ef9c09c1c6ebb3f5621`, squash merge `7fb70a207af2f793afde46b0aee4e59e43d30984`.

### TLP-AUDIO-001 / Product #356 — deterministic simultaneous cross-tab arbitration

Closed by Product PR #358, exact tested head `ab8fd872d65e6c10aef809967bc87bff8a08e72d`, squash merge `7231b2f33deed185a76fc6dd1c336a6d4dad1776`.

### TLP-RESILIENCE-001 / Product #351 — browser essay payload recovery

Closed by Product PR #353, exact tested head `c72ca2bd54b9a3ed18b116e2530e17691517054d`, squash merge `67d614bc186b52c408ad6cef4c84cf57d4e78a45`.

### TLP-DEPS-001 / Product #335 — dead Lenis install dependency

Closed by Product PR #348, exact tested head `43527c7a7932f17fcba599ff4df270c243ba69a6`, squash merge `3a8d5fe3a6f729e8a583a3a8c7e6881ec31b5214`.

### TLP-AUDIT-003 / Product #340 — semantic runtime guard hardening

Closed by Product PR #345, exact tested head `c7b1c9e8dfe26028d1d52852f3e1db20ba2b6407`, squash merge `b6f731263211208a31de1e36ed7830d7a46ffa87`.

### W0–W7 architecture/runtime

Closed and protected by permanent regression witnesses. Historical rows are preserved under `archive/superseded/` and do not remain active backlog.

### Mayakovsky media candidate family

Closed for current Product scope: 5 active, 1 verified reserve, 24 terminal exclusions, 0 unresolved.

## Conditional candidate lanes

### Fresh current-head verification

The active engineering matrix is zero. New engineering findings require independent current-head reproduction and root-cause evidence; do not replay historical rows. Keep this work separate from the owner-selected Hall architecture lane.

### Materially new media evidence

Reopen one bounded candidate only for materially new evidence such as a primary exact-object record, inspectable early-publication page, explicit permission/licence, jurisdiction-specific rights evidence or changed editorial need.

### Release-specific live witness

Use only for a significant release, DNS/hosting change or concrete production incident when live evidence is needed for a decision.

## Editorial / research boundary

Open source issues for archive acquisition, documentary research, long-form authoring, visual-rights review and myth ledgers remain legitimate work but are not engineering bug rows by default. Product #269 remains a source-first editorial lane outside the engineering matrix and outside the Hall architecture source owner.

## Adding a lane

A useful entry needs concrete question, evidence source, expected benefit, first narrow verification, one owner and explicit possible dispositions. Do not copy the historical matrix into this file.