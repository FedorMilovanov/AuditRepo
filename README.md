# AuditRepo

Central repository for **multi-agent audits, evidence, verification, root-cause analysis and verified necessary work**.

Canonical rules: [`AUDITREPO_OPERATING_MODEL.md`](AUDITREPO_OPERATING_MODEL.md).

```text
many audit passes
→ evidence
→ verification / re-verification
→ deduplicate and find root causes
→ compact active project MASTER
→ implement / decide
→ verify result
→ retire solved work to legacy
```

## Core principle

A project MASTER is a **working verification notebook**, not a lifetime bug log.

It may contain more than defects. Verified necessary work includes:

- current bugs;
- required implementations/improvements;
- system/root-cause changes;
- required migrations/retirements;
- narrowed residuals;
- owner decisions that block real work.

Solved, stale, duplicate, absorbed, invalid or superseded rows leave the active matrix continuously. Useful retirement context can remain in project `legacy/`, and full history remains in Git/evidence.

`legacy/` is intentionally searchable if something regresses or a past decision must be examined, but it is never an active backlog.

## Evidence before work

Raw reports are not automatic Product authority. Before a current implementation:

1. inspect the current Product owner/surface;
2. re-use relevant historical evidence;
3. collect enough independent witnesses for the risk;
4. distinguish symptoms from shared root causes;
5. inspect open Product PRs/branches to avoid collisions.

Security, rights, release identity, data loss and production conclusions normally need several independent evidence angles. A normal local issue may need only one strong current witness plus a clear mechanism.

## Optional improvements

Performance ideas, refactors and polish that are useful but not yet proven necessary belong in the project `WORK_QUEUE.md`, not in the active matrix. Once verification proves an improvement is genuinely required, its current formulation may move into MASTER.

## Structure

```text
AuditRepo/
├── AUDITREPO_OPERATING_MODEL.md
├── README.md
├── CONTRIBUTING.md
├── MULTI_WITNESS_VERIFICATION_PROTOCOL.md
├── CLEANUP_RETENTION_POLICY.md
├── PROJECT_REGISTRY.md
├── scripts/
└── projects/
    └── <project>/
        ├── README.md
        ├── DOC_MAP.md
        ├── WORK_QUEUE.md
        ├── incoming/        ← raw audit evidence
        ├── working/         ← temporary synthesis
        ├── verification/    ← package/current verification
        ├── reverify/        ← significant applicability checks
        ├── verified/        ← active MASTER + system context
        ├── legacy/          ← retired searchable reference; not backlog
        └── archive/         ← older historical collections
```

## Verification waves

A wave may process 10, 50 or 200 old claims and reduce them to a few current work units. The goal is **not** to maximize the number of rows called verified. The goal is to identify what the project really needs now.

If 30 symptoms are one root cause, keep one current `SYS-*` row. If a finding is solved or no longer applies, remove it from MASTER in the same wave. If an improvement is only optional, move it to Work Queue.

## What AuditRepo does not do

AuditRepo does not maintain a second exact copy of Product HEAD/deploy/CI state and does not preserve all historical closures inside the active matrix. Current Product facts are checked from Product when work begins.

AuditRepo also should not create a control-plane transaction larger than the problem being investigated.

## Projects

See [`PROJECT_REGISTRY.md`](PROJECT_REGISTRY.md). For `gb-is-my-strength`, start at [`projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md`](projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md) and [`projects/gb-is-my-strength/DOC_MAP.md`](projects/gb-is-my-strength/DOC_MAP.md).