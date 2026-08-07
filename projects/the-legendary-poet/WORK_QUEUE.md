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
