# Cleanup / Retention Policy

AuditRepo must preserve useful evidence **without keeping solved work in the active matrix**.

## Principle

```text
Keep raw evidence.
Verify what is genuinely needed.
Keep only current necessary work in MASTER.
Retire solved/stale/superseded work immediately.
Keep legacy searchable, but never treat it as backlog.
```

## Folder roles

### `incoming/`

Raw reports/artifacts and anchor-specific provenance. Do not silently rewrite another agent's intake.

### `working/`

Temporary clustering, triage and wave drafts. Remove or retire when superseded.

### `verification/`

Package/current verification, conflicts, system decisions and other evidence worth keeping as a distinct engineering record.

### `reverify/`

Significant current applicability checks. Use when a historical claim needs to be proven again before work/disposition; do not mirror every Product commit.

### `repairs/`

Owner-selected implementation plans and repair summaries for selected repair lanes. Implementation code lives in the Product repository; raw evidence stays in `incoming/`.

### `verified/`

Contains the **single active MASTER**, system context and other current guidance. It must not accumulate giant closed sections.

### `legacy/`

Retirement/reference area for solved, stale, duplicate, absorbed, invalid, accepted/not-planned and superseded material.

Legacy is intentionally retained. If a regression or dispute appears, agents can inspect it. But legacy is **never an active queue**, and any revived item must be re-verified against current Product before returning to MASTER.

### `archive/`

Older historical collections/packages that are not current guidance.

## MASTER cleanup rule

At the end of every verification/repair wave:

1. remove `fixed`, `absorbed`, `duplicate`, `stale`, `invalid`, `accepted`, `not-worth-fixing` and superseded rows from MASTER;
2. collapse multiple historical symptoms into one current `SYS-*` row when they share a root;
3. move useful but non-mandatory performance/refactor/polish ideas to `WORK_QUEUE.md`;
4. preserve only useful retirement mapping/context in `legacy/`;
5. rely on Git/evidence for full-fidelity history rather than copying all old rows forward.

MASTER is successful when it answers: **what verified work does the project actually need now?**

## Necessary improvements

Active work is not limited to bugs. A verified improvement/implementation may remain in MASTER when evidence shows it is genuinely needed to:

- complete a required capability;
- eliminate a current class of risk;
- replace an unsafe/fragmented owner;
- complete a migration/retirement;
- satisfy an explicit Product requirement.

Speculative refactoring, unmeasured performance ideas and taste-only polish do not belong in MASTER until verification proves necessity.

## Evidence retention

Raw evidence is retained even when the conclusion is later rejected. High-value verification/reverify material is retained. Retirement notes should be compact but should give enough information to recover why a row left MASTER.

Do not delete old legacy merely to make the repository visually smaller. The size target applies to the **active working surface**, not to the ability to investigate history.

## Event-driven re-verification

Recheck when there is a material reason:

- selected work is about to be implemented;
- an evidence-critical owner changed;
- a newer browser/build/source witness contradicts the old claim;
- a system fix may have absorbed it;
- a high-risk security/rights/release/data decision is being made.

Global Product HEAD movement, time passing, or unrelated branches changing are not enough by themselves.

## Branch retention

Periodically inspect AuditRepo branches/closed PRs:

- integrate unique useful material into main/evidence when appropriate;
- delete proven-obsolete working refs;
- retain intentional `archive/*` refs only when they preserve real forensic authority not safely reducible to normal files/history;
- do not optimize branch count at the cost of losing important evidence.

## Never do this

- never keep thousands of solved rows in MASTER for historical completeness;
- never silently delete raw evidence;
- never treat legacy as a current task list;
- never revive a legacy row without a current applicability check;
- never maintain two competing active matrices;
- never duplicate one volatile fact across several current-authority files;
- never create a documentation/control-plane transaction larger than the problem itself.
