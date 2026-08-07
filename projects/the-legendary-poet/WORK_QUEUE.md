# Optional Work Queue — the-legendary-poet

Эта очередь показывает owner-selected направления. Перед любой source mutation нужно заново проверить актуальный source owner, open PRs и применимое evidence.

## Current selection — TLP-AUDIO-002 / Product #360

Owner-selected operating order:

`VERIFY → one root cause → one owner/agent → PR → exact-head gates → Browser QA where behavior warrants it → merge → AuditRepo closure → next bug`.

Current verified engineering matrix: [`verified/MASTER_BUG_MATRIX.md`](verified/MASTER_BUG_MATRIX.md).

Current verified engineering rows: **1** — one P3 cross-tab protocol resilience root.

### 1. Repair Product #360 — keep logical ordering outside IEEE-754 precision failure

Current Product anchor: `main@0712a1845d4133953750a32a9df598f6cbeb192e`.

Bounded repair target:

- preserve the deterministic simultaneous-start arbitration introduced by Product #358;
- reject external numeric claim state that cannot preserve the protocol's ordering invariant;
- ensure a later explicit local play still outranks an already-seen peer claim at the largest supported timestamp boundary rather than falling back to `instanceId` ordering;
- prefer an explicit separation of wall-clock timestamp and logical sequence if needed instead of relying on repeated `number + 1` forever;
- preserve ordinary/legacy sequence-less #358 claims where practical;
- keep BroadcastChannel and storage fallback on the same comparator;
- add a deterministic precision-boundary validator witness;
- add a two-page browser witness that injects an unsafe finite storage claim, proves it cannot pause/poison a healthy player, then proves normal handoff still works;
- do not add sleeps/debounce, player UI changes, catalog changes, assets or unrelated persistence cleanup.

After Product repair merges and resulting current main is reverified, remove `TLP-AUDIO-002` from the active matrix and return this queue to fresh current-head bug hunting.

## Closed current-scope families

### TLP-AUDIO-001 / Product #356 — deterministic simultaneous cross-tab arbitration

Closed by Product PR #358, exact tested head `ab8fd872d65e6c10aef809967bc87bff8a08e72d`, squash merge `7231b2f33deed185a76fc6dd1c336a6d4dad1776`.

- Playback claims use one deterministic total order instead of pausing on every remote `playing` claim.
- Normal newer logical timestamps win; equal timestamps use a stable `instanceId` tie-break; normal same-millisecond local replay advances beyond already-seen peer time without sleeps/debounces.
- BroadcastChannel and storage-event fallback use the same arbitration helper.
- Deterministic validation covers sequential, simultaneous, stale, duplicate, self, tie and normal monotonic-clock semantics; the exact simultaneous model requires exactly one side to yield.
- Real two-page Chromium QA proves A→B→A handoff through BroadcastChannel and storage fallback.
- Detailed evidence: `verification/2026-08-07-audio-cross-tab-arbitration/REPORT.md` and `verification/2026-08-07-audio-cross-tab-arbitration/CLOSURE.md`.

`TLP-AUDIO-002` is a new independently verified numeric-domain flaw in that protocol. It does not invalidate the closed simultaneous-start root cause or reopen #356.

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

Resume only after the selected Product #360 lifecycle closes. New findings require independent current-head reproduction and root-cause evidence; do not replay historical rows.

### Materially new media evidence

Reopen one bounded candidate only for materially new evidence such as a primary exact-object record, inspectable early-publication page, explicit permission/licence, jurisdiction-specific rights evidence or changed editorial need.

### Release-specific live witness

Use only for a significant release, DNS/hosting change or concrete production incident when live evidence is needed for a decision.

## Editorial / research boundary

Open source issues for archive acquisition, documentary research, long-form authoring, visual-rights review and myth ledgers remain legitimate work but are not engineering bug rows by default. Product #269 remains a source-first editorial lane and is not part of this repair.

## Adding a lane

A useful entry needs concrete question, evidence source, expected benefit, first narrow verification, one owner and explicit possible dispositions. Do not copy the historical matrix into this file.
