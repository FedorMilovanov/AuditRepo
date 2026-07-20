# Research / reconciliation of unmerged AuditRepo branches

**Date:** 2026-07-20  
**AuditRepo base:** `main` at `f7f55a7e2a5bf002a14e6be9df4c1709c9f49c10`  
**Scope:** manual content review of the six remote branches not contained in `main`  
**Rule:** file names and mergeability are not treated as evidence; each candidate was read and compared with the current `main` tree.

## Executive decision

No unmerged branch contains a current production fix that should be merged wholesale.
The current `main` already contains the useful canonical evidence from the Gill, Hermenevtika and Book Engine lanes. The remaining unique material is either:

- historical prototype-only research;
- a stale progress note;
- an execution log;
- or a duplicate/incomplete packaging of material already present in `main`.

Do **not** overwrite current SSOT files (`NEXT_AGENT_PROMPT.md`, `verified/MASTER_BUG_MATRIX.md`, project README/START_HERE files) with versions from older branches.

## Branch-by-branch research

### `arena/019f675e-auditrepo` — no new substantive content

Branch tip: `fef600a`.

The branch appears to add four paths, but manual comparison changes the conclusion:

- `GBS-book-polished.html` has the same blob as the existing `incoming/gbs-book-engine-research/2026-07-15/prototypes/series-book.html` in `main` (`sha256/blob hash: ca11846fe70eb80f37860edb3ce8c05787036c07`).
- `index.html` is only a redirect to that same prototype.
- The design-package README describes `source-zips/`, `prototypes/` and `research-package/` directories that are not present in this branch's four-file delta; importing it unchanged would create misleading pointers.
- The working README is a second pointer to the same prototype, not a new implementation or audit result.

**Decision:** do not merge. The prototype is already preserved; the README package is incomplete and redundant.

### `arena/019f67ec-auditrepo` — already represented in `main`

Branch tip: `61d8515`.

The Book Engine v7 prototype at `prototype/book-engine/v7/gbs-book-prototype.html` is byte-identical to the current `main` copy (141,859 bytes; blob hash `a97aeb6948c0506307468225c449a52cd06eb590`).

**Decision:** do not merge. No tree content is missing from `main`.

### `arena/019f675d-auditrepo` — stale prototype audit, not current truth

Branch tip: `29a94e1`.

The branch contains five manually read documents under `audit/v7/` plus an older prototype. The report explicitly audits `prototype/book-engine/v7/gbs-book-prototype.html` at base SHA `ec5aa863`. That HTML is not the current prototype in `main`: the branch version is approximately 82 KB, while the current `main` version is approximately 142 KB, with a large line-level difference.

The documents contain useful historical design analysis:

- font/line-height control behavior;
- player lifecycle;
- skip-link and reduced-motion observations;
- dead controls;
- focus and responsive UI observations;
- prototype-to-engine integration mapping.

They also contain prototype-specific repair advice (including placeholder alerts/disabled controls) and do not establish a current production defect. Some findings may still be worth rechecking, but none can be promoted from this branch directly.

**Decision:** do not merge into `working/` or `verified/` as active findings. Keep the branch only if historical prototype provenance is wanted; otherwise it is safe to delete after this review. A future reverify must target the current source/prod-like build, not the old HTML.

### `audit/gill-series-v10-canonical-2026-07-09` — stale canonical overlay

Branch tip: `d4704bc`.

The branch contains 113 commits and old versions of volatile/canonical files, including:

- `PROJECT_REGISTRY.md`;
- project `README.md`;
- `NEXT_AGENT_PROMPT.md`;
- `verified/MASTER_BUG_MATRIX.md`;
- verified/working/verification START_HERE files.

Manual comparison shows that the current `main` reconciliation already retains the Gill intake/evidence and has a newer source-head/deploy truth. A whole-branch merge produces conflicts in the canonical files because it would reintroduce stale status surfaces, not because useful evidence is missing.

**Decision:** do not merge. `main` is authoritative for current truth; preserve the branch only as historical Git provenance if desired.

### `audit/hermenevtika-ui-current-head-2026-07-09` — report already present; source-only proposals

Branch tip: `21ccaad`.

The report in `main` states its own verification boundary clearly: source-only witness, no browser, no production-like build, proposed severities, and not repair-ready. The manually reviewed findings include nested Scripture buttons inside footnote tooltips, a 1200px responsive seam, modal focus/scroll-lock risks, article-progress scope, and metadata/config drift.

These are useful candidate observations, but they are not current production confirmations without a new source/build/browser pass. The report, evidence, proposals and closure artifacts are already present in `main`. The only meaningful tree delta from this branch is `commands.log`, which is provenance rather than a finding.

**Decision:** no whole-branch merge. Optional later action: add `commands.log` to the existing intake only if command-level provenance is required.

### `claude/biblical-genealogy-svg-6l6qb8` — historical progress note

Branch tip: `c4afc81`.

The only unique file is a 2026-07-17 progress note claiming 233 researched etymologies and a search UI, with explicit limitations (233 of approximately 3,056 named people) and a statement that the source branch had already landed in the source repo. It is not an audit report, bug finding or repair order. Its source SHA is historical (`1ba23db`), while the current AuditRepo handoff is newer and reports a later milestone (256 etymologies).

**Decision:** do not use as current status. It may be retained as historical intake, but it is not needed for operation and can be safely omitted when deleting stale branches.

## Reconciliation status

| Branch | Current useful tree content absent from `main` | Action |
|---|---|---|
| `arena/019f675e-auditrepo` | None; duplicate/incomplete package | Delete-safe |
| `arena/019f67ec-auditrepo` | None; prototype already byte-identical | Delete-safe |
| `arena/019f675d-auditrepo` | Historical audit of obsolete prototype | Delete-safe after owner accepts loss of branch-only provenance |
| `audit/gill-series-v10-canonical-2026-07-09` | None; old canonical overlay | Delete-safe |
| `audit/hermenevtika-ui-current-head-2026-07-09` | Only optional `commands.log` | Delete-safe; log is optional provenance |
| `claude/biblical-genealogy-svg-6l6qb8` | Historical progress note only | Delete-safe after owner accepts loss of branch-only provenance |

## What was deliberately not promoted

- No old prototype finding was added to `verified/MASTER_BUG_MATRIX.md`.
- No old source SHA or deploy status was copied into the current SSOT.
- No prototype recommendation was treated as a production repair.
- No source-repo change was made from these AuditRepo branches.

## Safe next operation

After owner approval, delete the six stale remote branches. Keep this research file in `working/` as the content-based decision record. If the owner wants full historical provenance, export the five `019f675d` audit markdown files and the genealogy progress note before deletion; neither is required for the current AuditRepo truth.
