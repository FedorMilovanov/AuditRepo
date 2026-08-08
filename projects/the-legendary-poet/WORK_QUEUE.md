# Optional Work Queue — the-legendary-poet

Эта очередь показывает owner-selected направления. Перед любой source mutation нужно заново проверить актуальный source owner, open PRs и применимое evidence.

## Current selection — TLP-HALL-001 / Product #369

Owner-selected operating order:

`VERIFY → one root cause or bounded architecture question → one owner/agent → PR → exact-head gates → Browser QA where behavior warrants it → merge → AuditRepo evidence update → next wave`.

Current verified engineering matrix: [`verified/MASTER_BUG_MATRIX.md`](verified/MASTER_BUG_MATRIX.md).

Current verified engineering rows: **0**.

`TLP-HALL-001` is an owner-selected architecture lane, not an engineering bug row. Four bounded Hall source waves are merged:

- foundation: Product PR #373, exact tested head `9c63a500257c1dc01e4df5c4dcecb8bbfd9fd0fb`, resulting Product `main` `9cce8bb386262172a50f0d65d52372e045e4cd43`;
- Reference Bible: Product PR #374, exact tested head `9a993399749a818fed5ffe9ac9ee2378807aafc2`, resulting Product `main` `cc81858626c8ddcf8e59016231068c45cbb6e246`;
- metric-greybox tooling/preflight: Product PR #375, exact tested head `4d4c1b8e6c1832dce6eac6a2509d76bce65cc724`, resulting Product `main` `c34debc7ec3cf769261779d763f21f617a3500a2`;
- neutral H1/H2/H3 candidate authoring: Product PR #376, exact tested head `70aeb9c1aca4414d9cade3cb9cdcfb887b7ea806`, resulting Product `main` `66dabcdcff5fa0fc8ad8fde44544432e4a144e4d`.

Evidence:

- `verification/2026-08-08-hall-v3-foundation/FOUNDATION.md`;
- `verification/2026-08-08-hall-v3-reference-bible/REFERENCE_BIBLE.md`;
- `verification/2026-08-08-hall-v3-greybox-tooling/TOOLING.md`;
- `verification/2026-08-08-hall-v3-greybox-candidates/CANDIDATES.md`.

### Hall v3 topology select/reject — current bounded wave

The candidate-authoring transaction is complete. Product source now owns three deterministic, reproducible neutral metric candidates and exact-head generated evidence, but still owns **no approved topology and no approved camera rig**. Production `/hall` remains a lightweight DOM placeholder.

#### Current source witness

- Product `main@66dabcdcff5fa0fc8ad8fde44544432e4a144e4d` is `phase=metricGreybox`;
- `foundation=completed`, `referenceBible=completed`, `metricGreybox=active`; all later gates remain blocked;
- H1/H2/H3 are all `source-defined` under one common generator/evidence contract;
- `approvedCandidate=null` and `approvedRig=null`;
- common `35 mm` is comparison instrumentation only, not Camera Approval;
- exact-head candidate artifact `9021765090`, digest `sha256:598b2a60df72d9457e9b7620b5b7ea94fb59af8e0db60e11d334fbaaa94e8318`, embeds `tested_commit=70aeb9c1aca4414d9cade3cb9cdcfb887b7ea806`;
- H1 measures `32.1462 m / 2` forced turns, H2 `53.8854 m / 8`, H3 `37.8327 m / 4`;
- all 18 certified sightlines and all three Pushkin viewing-clearance witnesses passed;
- no material/light/export system, final Pushkin exhibit, WebGL runtime or production Hall geometry is approved.

#### Current evidence reading

- **H1** — strongest route simplicity/orientation benchmark; shortest route and only two forced turns, but the central space risks reading as a generic ceremonial court and provides weaker spatial identity.
- **H2** — strongest literal promenade/chronological sequence, but pays the largest circulation cost by a wide margin and reads most corridor-like; current neutral evidence does not show enough compensating spatial value for `53.8854 m / 8` turns.
- **H3** — strongest provisional topology candidate: materially different asymmetric/diagonal spatial identity, changing sightlines and side focus rooms at a moderate `37.8327 m / 4` route cost.
- Across **all three**, the common 35 mm portrait `pushkinViewing` crop is too close/flat; topology selection must not silently approve the current camera set.

#### Next bounded select/reject transaction

Product #369 owns one explicit topology-decision transaction:

1. start from fresh Product `main@66dabcdcff5fa0fc8ad8fde44544432e4a144e4d`; re-check current main, open source PRs and candidate authority before mutation;
2. consume the merged exact-head candidate evidence without changing geometry merely to make a preferred candidate win;
3. add a machine-readable decision record with explicit candidate dispositions, evidence, rejected alternatives and non-decisions;
4. current evidence supports **provisionally selecting H3** as the topology to carry forward;
5. retain **H1 as reserve/orientation benchmark**, not as a second active production topology;
6. **reject or park H2** for excessive route/turn cost and corridor character without sufficient neutral-grey compensation;
7. preserve the candidate source/evidence artifacts for audit; do not delete losing hypotheses merely because a choice is made;
8. keep `approvedRig=null`; the common 35 mm camera set remains test-only;
9. if the topology decision is explicit/reproducible, complete `metricGreybox` and activate `cameraApproval` as the next gate;
10. keep material/light/export, Pushkin final slice, offline finished visual approval, web vertical slice and full scale-out blocked;
11. keep production `/hall` unchanged and keep Three/R3F/WebGL out of this transaction;
12. do not alter H3 geometry in the selection PR except for a separately reproduced correctness defect — selection is evidence interpretation, not another design iteration hidden inside the vote.

#### Camera Approval target after selection

The next camera wave should operate on the selected topology only and compare camera rigs/lenses under fixed geometry. It must specifically improve Pushkin approach/view framing and 9:16 portrait composition without approving arbitrary free-look/FPS navigation. The 35 mm authoring set remains a benchmark, not a default winner.

#### Decision dispositions

- `advance-H3`: evidence supports H3 provisionally as current topology authority and opens Camera Approval;
- `reserve-H1`: preserve H1 as a fallback/orientation benchmark;
- `reject-H2`: retain evidence historically but stop spending current production effort on H2;
- `reject-all`: permitted if a fresh decision audit finds a disqualifying issue common to the three candidates;
- `repeat-greybox`: permitted only for a reproduced geometry/evidence defect, not because finished materials are desired;
- `close`: not permitted; `TLP-HALL-001` remains open through production certification.

## Closed current-scope families

### TLP-ARCHIVE-001 / Product #363 — deterministic cross-tab favorites convergence

Closed by Product PR #368, exact tested head `6f9408aceccfae0fbb0abf1993695f000e84ffe0`, squash merge / resulting Product `main` `576ac818d6ca426e5786aba3efc27f8b20abf2bf`.

- favorites now persist as bounded v4 per-poem operations rather than whole-snapshot last-writer-wins state;
- v3/v2 favorites migrate losslessly before old keys retire;
- deterministic decimal per-poem generation ordering is independent of wall-clock time;
- equal-generation add/remove conflicts are removal-wins and later intentional re-add advances generation;
- storage-event repair merges current physical state with `oldValue` and `newValue`, recovering a distinct operation overwritten by a stale peer write;
- reconciliation writes removal tombstones so stale tabs cannot resurrect removed-library poems;
- failed writes, invalid IDs, corrupt state and defensive-copy behavior remain truthful;
- pure deterministic validation and a real two-tab Chromium witness prove convergence;
- full exact-head CI, Project contracts, route/brand gates and Manual Browser QA passed before expected-head-protected merge;
- Product #363 closed automatically and resulting Product `main` was reverified as the merge SHA.

Detailed closure evidence: `verification/2026-08-07-archive-cross-tab-convergence/CLOSURE.md`.

Future archive findings require independent current-head reproduction.

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

The active engineering matrix is zero. New engineering findings require independent current-head reproduction and root-cause evidence; do not replay historical rows. Keep this work separate from the owner-selected Hall architecture lane.

### Materially new media evidence

Reopen one bounded candidate only for materially new evidence such as a primary exact-object record, inspectable early-publication page, explicit permission/licence, jurisdiction-specific rights evidence or changed editorial need.

### Release-specific live witness

Use only for a significant release, DNS/hosting change or concrete production incident when live evidence is needed for a decision.

## Editorial / research boundary

Open source issues for archive acquisition, documentary research, long-form authoring, visual-rights review and myth ledgers remain legitimate work but are not engineering bug rows by default. Product #269 remains a source-first editorial lane outside the engineering matrix and outside the Hall architecture source owner.

## Adding a lane

A useful entry needs concrete question, evidence source, expected benefit, first narrow verification, one owner and explicit possible dispositions. Do not copy the historical matrix into this file.