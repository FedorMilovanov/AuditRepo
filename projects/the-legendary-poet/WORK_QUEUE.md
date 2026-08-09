# Optional Work Queue — the-legendary-poet

Эта очередь содержит только owner-selected направления, которые ещё требуют решения или следующей bounded wave. Перед любой Product mutation заново проверять current Product `main`, open PR/branches, owner и применимое evidence.

Current verified engineering matrix: [`verified/MASTER_BUG_MATRIX.md`](verified/MASTER_BUG_MATRIX.md).

Current verified engineering rows: **0**.

Closed engineering/history outcomes живут в [`verified/CLOSURE_LEDGER.md`](verified/CLOSURE_LEDGER.md), verification packages и Git history; эта очередь не должна дублировать их.

## Current selection — TLP-HALL-001 / Product #369

Owner-selected operating order:

`VERIFY → one bounded architecture question → one owner/agent → PR → exact-head gates → Browser QA where behavior warrants it → merge → substantial AuditRepo evidence checkpoint → next wave`.

`TLP-HALL-001` — owner-selected architecture lane, не engineering bug row. Lane остаётся открытой до Pushkin slice, offline/web visual approval и production certification.

### Frozen authorities

- selected topology: **H3**;
- H3 layout fingerprint: `5d5d0ddd8b150aa64afb73a2a3d9e00c6005e99fc935a6d4707a49ecd475fe65`;
- H3 mesh geometry fingerprint: `b3de770858a423305db8fcab15b405414e66b3d3de93ab1deaa5b3b35b418777`;
- approved guided camera: **R1**;
- R1 Pushkin viewing camera: position `[8.0,2.5,1.60]`, target `[11.15,5.45,1.95]`, lens `28 mm`;
- selected material lighting baseline: **L0-minimal-runtime**;
- surface UV authority: **UV0**, metre-scaled at `1.5 m / UV unit` in accepted evidence;
- static-bake reserve: **UV1**, `reserved-not-required`;
- current **L1 external-lightmap bake remains rejected**;
- production texture encoding remains deferred to the Pushkin vertical slice;
- production `/hall`: lightweight DOM placeholder; Three/R3F/WebGL activation remains forbidden until a later gate explicitly promotes it.

### Merged bounded source chain

- foundation — Product #373;
- Reference Bible — #374;
- metric-greybox tooling — #375;
- neutral H1/H2/H3 candidates — #376;
- topology decision — #381;
- H3 camera candidates — #382;
- R1 decision — #383;
- camera-gate promotion — #384;
- material/light/export authoring spike — #386;
- final raw-GLB evidence identity repair — #387;
- material visual-acceptance repeat-spike — #388;
- Gate-4 material delivery decision — **#389**.

Current verified Product authority after #389: `main@022c25b84aa3e4228fff3fbff6f4cef11e2d36c7`.

Detailed evidence:

- `verification/2026-08-08-hall-v3-foundation/FOUNDATION.md`;
- `verification/2026-08-08-hall-v3-reference-bible/REFERENCE_BIBLE.md`;
- `verification/2026-08-08-hall-v3-greybox-tooling/TOOLING.md`;
- `verification/2026-08-08-hall-v3-greybox-candidates/CANDIDATES.md`;
- `verification/2026-08-08-hall-v3-topology-selection/SELECTION.md`;
- `verification/2026-08-09-hall-v3-camera-chain/CAMERA_CHAIN.md`;
- `verification/2026-08-09-hall-v3-material-chain/MATERIAL_CHAIN.md`;
- `verification/2026-08-09-hall-v3-material-decision/DECISION.md`.

## Current Gate-4 decision state

Product #389 merged on exact tested head `6a843479987b1022da562f342bbe9e61ff1214fc` with resulting Product `main@022c25b84aa3e4228fff3fbff6f4cef11e2d36c7`.

Selected delivery contract:

1. **Lighting** — `L0-minimal-runtime` for the Pushkin vertical-slice baseline; no mandatory external lightmap and zero realtime shadow lights in the proved baseline.
2. **Rejected current bake** — `L1-external-lightmap` stays `reject-current-bake`; UV1 transport remains technically available, but this bake may not be reused as approved.
3. **UV strategy** — UV0 owns surface materials; UV1 remains a separate optional static-bake channel.
4. **Optimizer** — `gltfpack@1.2.0` with `-cc -kn -km -ke -kv -vpf`, Khronos validation before and after, and preservation of names/materials/extras/UV0/UV1/tangents/camera/poetId/metric scale.
5. **Texture semantics** — baseColor=sRGB color; normal/roughness=Non-Color data; explicit tangents; stone metallic `0`; any future lightmap remains linear on UV1.
6. **Production texture encoding** — explicitly deferred to the Pushkin slice. QA 256px PNG proof maps are not production assets; KTX2 is not an approved default yet.

Accepted evidence identity remains the #388 artifact:

- artifact `9036351234`, digest `sha256:dc33af96ba747175794f9f31775c534c224a35645d9943302424459e0bf8cc95`;
- accepted evidence head `600f28efd2aa59b6d31086b64aeb42da7b03a48e`;
- raw GLB `200,672 B`, SHA-256 `10da27398d69397b77298e549af0b399eb2edf53ba430bfbb81a7937082fca7e`;
- optimized GLB `141,896 B`, SHA-256 `810865870e5c240af681eab5aa8765a2fc6de44c69c823c8971a097a973ce089`;
- raw/optimized Khronos `0 errors / 0 warnings`;
- final raw source-evidence identity matched.

Measured candidate cost preserved by decision:

- L0 GPU texture residency `1,398,096 B`;
- current L1 GPU texture residency `1,791,312 B`;
- incremental L1 lightmap **GPU resident** bytes `393,216 B`.

The wording matters: `393,216 B` is GPU residency, not download/file size.

## Next bounded transaction — Gate-4 promotion only

The next Product #369 mutation is a **separate gate-promotion transaction**:

`materialLightingExportSpike → pushkinVerticalSlice`

Required state transition:

- `phase`: `materialLightingExportSpike` → `pushkinVerticalSlice`;
- `gates.materialLightingExportSpike`: `active` → `completed`;
- `gates.pushkinVerticalSlice`: `blocked` → `active`;
- `offlineVisualApproval`, `webVerticalSlice` and `fullMuseumScaleOut` remain blocked.

The promotion must pin the merged #389 material decision authority and preserve all current freezes.

### Promotion PR may do

- add a dedicated material-gate promotion authority record;
- add/extend persistent post-material authority validation;
- update the machine Hall contract for exactly the one gate transition above;
- update `CURRENT_STATE.md` / Hall README to the new machine phase;
- wire the promotion validator through normal check, CI, Project Contracts and Hall DCC workflow.

### Promotion PR may not do

- add or author Pushkin portrait/document assets;
- activate production Three/R3F/WebGL or replace the `/hall` placeholder;
- change H3 geometry or R1 camera;
- start full-Hall lookdev;
- brighten/select the rejected current L1 bake;
- invent final production texture encoding;
- combine gate promotion with Pushkin slice authoring.

### Automatic rejection for promotion

- decision and promotion authority are collapsed or candidate material evidence is rewritten;
- `pushkinVerticalSlice` authoring begins inside the promotion PR;
- later Hall gates are advanced;
- production Hall runtime is activated;
- current L1 is silently reclassified as approved;
- H3/R1 or accepted material evidence blobs drift without a new prior-gate transaction.

## Immediately after promotion — Pushkin slice blocker ordering

Do not start the first Pushkin exhibit from final browser/runtime code.

The first slice wave must respect the existing Hall policies:

1. **rights/provenance first for documentary hero assets** — `RIGHTS_REGISTER.md` requires explicit source identity, rights basis, credit and verification; only `approved` documentary assets may enter the production Hall manifest;
2. current Product search shows no completed Pushkin Hall rights record yet, so portrait/document acquisition and rights verification is an early blocker, not a late cleanup step;
3. AI-generated editorial imagery may not impersonate a historical facsimile, signature, manuscript or museum object;
4. source architecture/exhibit assembly remains Blender authority; React/Three must not become the modeller;
5. Pushkin visual acceptance requires central architecture + portal transition + one complete exhibit, rights-cleared media, near-final materials, selected L0 delivery, certified cameras, 8–12 fixed stills, close material crops, desktop/mobile framing, a 20–30 s offline camera sequence, no-effects baseline and raw-vs-optimized comparison;
6. WebGL integration does not begin if the offline sequence is not compelling;
7. the first web slice will be the place to set real Hall transfer/texture/frame-time budgets and to measure final production texture encoding rather than guessing it now.

## Conditional candidate lanes

### Fresh current-head engineering verification

The active engineering matrix is zero. New engineering findings require independent current-head reproduction and root-cause evidence; do not replay historical rows. Keep such work separate from the Hall architecture owner.

### Materially new media evidence

Reopen one bounded media candidate only for materially new evidence: primary exact-object record, inspectable early-publication page, explicit permission/licence, jurisdiction-specific rights evidence or changed editorial need.

### Release-specific live witness

Use only for a significant release, DNS/hosting change or concrete production incident when live evidence is needed for a decision.

## Editorial / research boundary

Archive acquisition, documentary research, long-form authoring, visual-rights review and myth ledgers remain legitimate work but are not engineering bug rows by default. Product #269 remains a source-first editorial lane outside the engineering matrix and outside the Hall architecture source owner.

## Adding another lane

A new owner-selected lane needs: one concrete question, current evidence source, expected benefit, first narrow verification, one owner and explicit possible dispositions. Do not copy historical closed work back into this file.
