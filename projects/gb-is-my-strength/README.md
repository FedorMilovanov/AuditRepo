# gb-is-my-strength / gospod-bog.ru

AuditRepo project for `FedorMilovanov/gb-is-my-strength`.

## Start

1. [`verified/MASTER_BUG_MATRIX.md`](./verified/MASTER_BUG_MATRIX.md) — **single active matrix of verified necessary work**.
2. [`DOC_MAP.md`](./DOC_MAP.md) — where each kind of evidence/status belongs.
3. [`WORK_QUEUE.md`](./WORK_QUEUE.md) — optional improvements that are not yet mandatory active work.
4. [`verified/SYSTEM_THEMES.md`](./verified/SYSTEM_THEMES.md) — reusable root-cause context.
5. `incoming/`, `verification/`, `reverify/` — evidence and current-check material.
6. `legacy/` — retired material available for later forensic lookup, not an active backlog.

General model: [`../../AUDITREPO_OPERATING_MODEL.md`](../../AUDITREPO_OPERATING_MODEL.md).

## Stable project facts

- Source repository: `FedorMilovanov/gb-is-my-strength`.
- Public site: `gospod-bog.ru`.
- Architecture: Astro + strangler pattern with native routes and preserved legacy/static surfaces.
- Production-like verification must use the actual project build/publication path; plain `astro build` can create false findings.
- The project includes route-level applications, article/reader surfaces, search, maps, PWA/offline behavior and shared runtimes.

Current Product HEAD, open PRs, branch ownership, workflow status and deploy identity are read from the Product repository when work begins. They are intentionally not duplicated as permanent truth here.

## MASTER means work, not only bugs

A MASTER row may represent:

- a reproduced defect;
- a verified necessary implementation/improvement;
- a system/root-cause repair;
- a required migration/retirement step;
- a narrowed residual;
- an owner decision that blocks real work.

A proposed improvement enters MASTER only after verification shows that it is genuinely needed. Pure ideas, speculative refactors and low-value polish stay out of MASTER, normally in `WORK_QUEUE.md`.

## Evidence and witnesses

Raw reports are evidence, not automatic Product authority. Before implementation, inspect the selected current Product surface and use proportionate independent witnesses. For high-risk security, rights, release identity, data loss or production decisions, multiple independent angles are expected. For ordinary local work, one strong current witness plus a clear mechanism can be sufficient.

Historical evidence can always be consulted again, but it does not authorize a current Product mutation until applicability is rechecked.

## Continuous cleanup

MASTER must stay compact:

```text
verify needed work
→ put current work in MASTER
→ implement / decide
→ verify result
→ remove row from MASTER
→ preserve useful retirement context in legacy
```

Closed/stale/duplicate/absorbed/invalid rows do not accumulate in MASTER. If many symptoms reduce to one current root, replace them with one `SYS-*` row and retire the old symptom rows.

`legacy/` remains available if a regression, contradiction or historical question appears, but agents must not treat it as a task list.

## Collision boundary

Before Product work, always inspect current open Product PRs/branches and shared owners. Never create a parallel SYSTEM fix merely because historical AuditRepo evidence exists.