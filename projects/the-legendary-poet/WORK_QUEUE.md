# Optional Work Queue — the-legendary-poet

Эта очередь показывает owner-selected направления. Перед любой source mutation нужно заново проверить актуальный source owner, open PRs и применимое evidence.

## Current selection — TLP-ARCHIVE-001 / Product #363

Owner-selected operating order:

`VERIFY → one root cause → one owner/agent → PR → exact-head gates → Browser QA where behavior warrants it → merge → AuditRepo closure → next bug`.

Current verified engineering matrix: [`verified/MASTER_BUG_MATRIX.md`](verified/MASTER_BUG_MATRIX.md).

Current verified engineering rows: **1** — one P3 personal-archive cross-tab convergence root.

### 1. Repair Product #363 — make concurrent favorite mutations converge

Current Product anchor: `main@ab3fbf5f0b680f9457d905b792d693d287628c4a`.

Bounded repair target:

- preserve private browser-only personal archive semantics;
- preserve current v3 favorites during migration without requiring a user reset;
- replace whole-snapshot last-writer-wins mutation semantics with a deterministic representation that can merge concurrent cross-tab add/remove operations;
- define one explicit ordering rule for add/remove conflicts so a stale peer snapshot cannot silently resurrect a newer removal;
- keep duplicate delivery idempotent and reject malformed/future ordering metadata that could poison convergence;
- preserve same-tab mutation result truthfulness, storage-write failure handling, library reconciliation, defensive copies and corrupt-state recovery;
- keep the existing one shared `useSyncExternalStore` subscription / browser `storage` notification model where practical;
- add deterministic two-reader convergence coverage plus a real two-page browser witness;
- do not introduce server/account persistence, visual redesign, unrelated audio/community changes or sleeps/debounce as correctness.

After Product repair merges and resulting current main is reverified, remove `TLP-ARCHIVE-001` from the active matrix and return this queue to fresh current-head bug hunting.

## Parallel owner-selected architecture lane — TLP-HALL-001 / Product #369

This lane is independent of `TLP-ARCHIVE-001`: it owns Hall architecture/foundation files and must not touch the personal archive store or its QA surfaces.

### Current source witness

- `/hall` intentionally renders a lightweight placeholder and does not import `src/components/hall/*`; this is the correct production safety boundary while the immersive experience is dormant.
- The retired Hall v2 implementation nevertheless remains an implicit current contract because `npm run check` still runs `scripts/validate-hall-audio-runtime.ts`, which protects FPS movement, pointer lock, hover whispers, dust animation and rail-camera behavior from the obsolete prototype.
- `HallPage.tsx` also advertises a specific unapproved target (`Храм Русской Поэзии` with four era wings) before a Blender greybox/architecture gate has approved the final spatial program.
- Historical Hall code remains useful forensic/technical evidence but is not visual or product authority for v3.

### First bounded foundation wave

Product #369 owns one architecture foundation lane before any new 3D scene is authored:

1. register `TLP-HALL-001` in source `docs/CURRENT_STATE.md` and `docs/project-contract.json`;
2. mark the existing `src/components/hall/*` prototype as legacy/non-authoritative rather than cosmetically repairing it;
3. remove Hall-v2 FPS/audio/dust behavior from mandatory architecture ownership while preserving unrelated application interaction/audio validators;
4. replace that hidden legacy authority with a small Hall foundation validator that proves `/hall` stays lightweight and cannot accidentally import the legacy scene;
5. remove unapproved architecture promises from the public placeholder without publishing a fake replacement concept;
6. add source/asset/camera/material/lighting/rights/AI/performance/export/visual-acceptance contracts for Hall v3;
7. define gated production order: annotated references → metric Blender greybox → camera approval → material/lighting/export spike → Pushkin vertical slice → offline visual approval → optimized GLB/KTX2 delivery → minimal web runtime → remaining exhibits;
8. no new `HallOfPoetsV3.tsx`, JSX architecture, FPS/free-walk baseline, whispers, fake historical objects or effect-driven visual rescue in this wave.

### Possible dispositions after foundation

- `continue`: foundation contracts are coherent and the next owner-approved work is the Blender/reference phase;
- `narrow`: a delivery/lightmap/rights constraint forces a smaller vertical slice before architecture scale-out;
- `park`: visual/source asset production is not ready, while the production placeholder remains safe;
- `close`: only after the architecture lane itself has been implemented and verified; the foundation wave alone does not close `TLP-HALL-001`.

Source mutation must remain isolated from Product #365 and any other live owner. Final Hall closure evidence belongs in AuditRepo only after the source work is merged and verified.

## Closed current-scope families

### TLP-AUDIO-002 / Product #360 — precision-safe cross-tab logical ordering

Closed by Product PR #362, exact tested head `0a9d5c0c2cf5eeb801045ef9c09c1c6ebb3f5621`, squash merge `7fb70a207af2f793afde46b0aee4e59e43d30984`.

Future audio protocol findings require independent current reproduction.

### TLP-AUDIO-001 / Product #356 — deterministic simultaneous cross-tab arbitration

Closed by Product PR #358, exact tested head `ab8fd872d65e6c10aef809967bc87bff8a08e72d`, squash merge `7231b2f33deed185a76fc6dd1c336a6d4dad1776`.

### TLP-RESILIENCE-001 / Product #351 — browser essay payload recovery

Closed by Product PR #353, exact tested head `c72ca2bd54b9a3ed18b116e2530e17691517054d`, squash merge `67d614bc186b52c408ad6cef4c84cf57d4e78a45`.

Future payload failures require independent current reproduction.

### TLP-DEPS-001 / Product #335 — dead Lenis install dependency

Closed by Product PR #348, exact tested head `43527c7a7932f17fcba599ff4df270c243ba69a6`, squash merge `3a8d5fe3a6f729e8a583a3a8c7e6881ec31b5214`.

### TLP-AUDIT-003 / Product #340 — semantic runtime guard hardening

Closed by Product PR #345, exact tested head `c7b1c9e8dfe26028d1d52852f3e1db20ba2b6407`, squash merge `b6f731263211208a31de1e36ed7830d7a46ffa87`.

Future concrete harness defects are reverified independently.

### W0–W7 architecture/runtime

Closed and protected by permanent regression witnesses. Historical rows are preserved under `archive/superseded/` and do not remain active backlog.

### Mayakovsky media candidate family

Closed for current Product scope: 5 active, 1 verified reserve, 24 terminal exclusions, 0 unresolved.

## Conditional candidate lanes

### Fresh current-head verification

Resume only after the selected Product #363 lifecycle closes. New findings require independent current-head reproduction and root-cause evidence; do not replay historical rows.

### Materially new media evidence

Reopen one bounded candidate only for materially new evidence such as a primary exact-object record, inspectable early-publication page, explicit permission/licence, jurisdiction-specific rights evidence or changed editorial need.

### Release-specific live witness

Use only for a significant release, DNS/hosting change or concrete production incident when live evidence is needed for a decision.

## Editorial / research boundary

Open source issues for archive acquisition, documentary research, long-form authoring, visual-rights review and myth ledgers remain legitimate work but are not engineering bug rows by default. Product #269 remains a source-first editorial lane outside this repair.

## Adding a lane

A useful entry needs concrete question, evidence source, expected benefit, first narrow verification, one owner and explicit possible dispositions. Do not copy the historical matrix into this file.
