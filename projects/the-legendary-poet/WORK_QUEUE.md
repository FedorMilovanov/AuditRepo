# Optional Work Queue — the-legendary-poet

Эта очередь показывает owner-selected направления. Перед любой source mutation нужно заново проверить актуальный source owner, open PRs и применимое evidence.

## Current selection — fresh current-head verification

Owner-selected operating order:

`VERIFY → one root cause → one owner/agent → PR → exact-head gates → Browser QA where behavior warrants it → merge → AuditRepo closure → next bug`.

Current verified engineering matrix: [`verified/MASTER_BUG_MATRIX.md`](verified/MASTER_BUG_MATRIX.md).

Current verified engineering rows: **0**.

No Product engineering repair lane is currently selected. Resume only from new current-head evidence; do not replay historical matrix rows or convert editorial/research backlog into engineering bugs without an independently reproduced engineering root cause.

## Closed current-scope families

### TLP-AUDIO-002 / Product #360 — precision-safe cross-tab logical ordering

Closed by Product PR #362, exact tested head `0a9d5c0c2cf5eeb801045ef9c09c1c6ebb3f5621`, squash merge `7fb70a207af2f793afde46b0aee4e59e43d30984`.

- External timestamps are now restricted to nonnegative safe integers instead of every finite JavaScript number.
- Wall-clock recency and Lamport advancement are separated: equal/future wall timestamps advance an explicit decimal logical `sequence`, compared and incremented as `BigInt` rather than IEEE-754 `number + 1`.
- Sequence-less #358 claims remain interpretable as sequence zero; ordinary clients still exchange a safe numeric timestamp.
- Deterministic validation covers unsafe/fractional/negative timestamps, `Number.MAX_SAFE_INTEGER`, arbitrary-precision sequence advancement, legacy compatibility, simultaneous starts, stale/duplicate/self delivery and later explicit replay.
- Real Chromium browser QA waits for confirmed delivery of an unsafe `2 ** 53` storage claim, proves it cannot pause/poison a healthy player, then proves normal handoff still works; the existing BroadcastChannel and storage fallback A→B→A witnesses remain green.
- Full exact-head Product CI, contracts, route/brand gates and Manual Browser QA passed before merge.
- Detailed evidence: `verification/2026-08-07-audio-clock-precision/REPORT.md` and `verification/2026-08-07-audio-clock-precision/CLOSURE.md`.

Future audio protocol findings require independent current reproduction. This closure does not reopen or weaken `TLP-AUDIO-001`.

### TLP-AUDIO-001 / Product #356 — deterministic simultaneous cross-tab arbitration

Closed by Product PR #358, exact tested head `ab8fd872d65e6c10aef809967bc87bff8a08e72d`, squash merge `7231b2f33deed185a76fc6dd1c336a6d4dad1776`.

- Playback claims use one deterministic total order instead of pausing on every remote `playing` claim.
- BroadcastChannel and storage-event fallback use the same arbitration helper.
- Exact simultaneous ordinary starts leave exactly one winner.
- Detailed evidence: `verification/2026-08-07-audio-cross-tab-arbitration/REPORT.md` and `verification/2026-08-07-audio-cross-tab-arbitration/CLOSURE.md`.

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

New findings require independent current-head reproduction and root-cause evidence; do not replay historical rows.

### Materially new media evidence

Reopen one bounded candidate only for materially new evidence such as a primary exact-object record, inspectable early-publication page, explicit permission/licence, jurisdiction-specific rights evidence or changed editorial need.

### Release-specific live witness

Use only for a significant release, DNS/hosting change or concrete production incident when live evidence is needed for a decision.

## Editorial / research boundary

Open source issues for archive acquisition, documentary research, long-form authoring, visual-rights review and myth ledgers remain legitimate work but are not engineering bug rows by default. Product #269 remains a source-first editorial lane outside this engineering queue.

## Adding a lane

A useful entry needs concrete question, evidence source, expected benefit, first narrow verification, one owner and explicit possible dispositions. Do not copy the historical matrix into this file.
