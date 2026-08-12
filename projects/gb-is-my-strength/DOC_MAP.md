# DOC MAP — gb-is-my-strength

Where each kind of evidence and work status belongs.

Canonical model: [`../../AUDITREPO_OPERATING_MODEL.md`](../../AUDITREPO_OPERATING_MODEL.md).

## Owner directive

AuditRepo is an evidence/verification workspace, not a Product mirror and not a closed-bug museum inside the active matrix.

```text
collect evidence
→ verify / reverify selected claims
→ identify genuinely needed current work
→ deduplicate into useful work units
→ keep those units in MASTER
→ implement / decide
→ verify result
→ move solved/superseded material to legacy
```

## Fact ownership

| Fact | Owner | Notes |
|---|---|---|
| Current Product code, HEAD, open PRs, branches, CI and deploy | `FedorMilovanov/gb-is-my-strength` | inspect immediately before Product work |
| Raw observations and anchor-specific evidence | `incoming/<agent>/<date>/` | evidence; not automatic current truth |
| Current/package verification | `verification/` | multi-witness or package synthesis when useful |
| Significant re-verification | `reverify/` | current applicability, conflict or high-risk recheck |
| **Active verified necessary work** | `verified/MASTER_BUG_MATRIX.md` | one working matrix; bugs + necessary improvements + system work + decisions |
| Reusable root-cause context | `verified/SYSTEM_THEMES.md` | context, not automatically active work |
| Optional non-mandatory improvements | `WORK_QUEUE.md` | performance/refactor/polish candidates; not a second matrix |
| Retired/superseded/closed material | `legacy/` | searchable reference, never an active backlog |
| Older raw historical collections | `archive/` | evidence/archive only |
| Stable project orientation | `README.md` | no volatile global HEAD mirror |

## MASTER ownership

MASTER is the single work notebook. A row belongs there when current evidence supports a real next action or owner decision, including:

- current defect;
- verified necessary implementation/improvement;
- system/root-cause repair;
- required migration/retirement;
- narrowed residual;
- owner decision blocking implementation.

A row leaves MASTER immediately after a verified `fixed`, `absorbed`, `stale`, `duplicate`, `invalid`, `accepted/not-planned` or `not-worth-fixing` disposition.

If many historical symptoms have one current root, MASTER keeps one `SYS-*` row. The old IDs may be listed in the retirement note in `legacy/`, not kept as separate active rows.

## Evidence rule

Before adding/retaining active work:

1. read historical evidence;
2. inspect current Product owner/surface;
3. collect evidence proportional to risk;
4. use proportional independent W1–W6 angles as appropriate: surface, source, artifact, browser/runtime, lifecycle/root cause and history;
5. check open Product PRs/branches for ownership collisions;
6. distinguish mandatory work from optional improvement.

A historical `verified-at-anchor` claim is useful evidence, but not an automatic permit to edit current Product.

## Optional work

Useful but not-yet-mandatory performance/refactor/polish ideas live in `WORK_QUEUE.md`. If later measurement/current evidence proves the work genuinely necessary, promote the **current formulation** to MASTER. Do not carry speculative backlog into MASTER merely because an old report mentioned it.

## Legacy rule

Legacy is intentionally retained so old evidence can be consulted if a regression, dispute or forensic need appears. It is not routinely deleted, but it is also never a queue. Anything revived from legacy needs a new current applicability check before returning to MASTER.

Git history remains the full-fidelity history; legacy should be useful and compact rather than copying every old table verbatim.

## Continuous matrix hygiene

At the end of every repair/consolidation wave:

1. remove solved/obsolete rows from MASTER;
2. collapse duplicate symptoms into current roots;
3. move optional ideas to Work Queue;
4. preserve only useful retirement mapping/context in legacy;
5. keep MASTER small enough to answer “what do we actually need to do now?”.

## Collision rule

Before Product work:

1. inspect current Product open PRs/branches;
2. identify the owner/shared files;
3. do not create a competing SYSTEM lane;
4. if an active owner already covers the root, attach/sequence the matrix work to that owner instead.
