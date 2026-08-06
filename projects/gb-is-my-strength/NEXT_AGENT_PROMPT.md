# NEXT AGENT PROMPT — compatibility entrypoint

This file is retained for older agents and links. It is **not** a global exact-authority mirror and must not be updated after every Product commit.

## Read first

1. [`../../AUDITREPO_OPERATING_MODEL.md`](../../AUDITREPO_OPERATING_MODEL.md)
2. [`DOC_MAP.md`](./DOC_MAP.md)
3. [`WORK_QUEUE.md`](./WORK_QUEUE.md)
4. [`verified/SYSTEM_THEMES.md`](./verified/SYSTEM_THEMES.md)

## Before Product work

- choose one finding, cluster or system theme;
- read its historical evidence;
- inspect the current Product owner, open PRs and applicable rules directly in `FedorMilovanov/gb-is-my-strength`;
- verify only the selected evidence-critical surface;
- decide: local fix, systemic root, duplicate, stale/invalid, park, accepted risk or owner decision;
- use checks proportionate to the diff and claim.

## AuditRepo update rule

Update AuditRepo only when classification, evidence, selected priority, system understanding, owner decision or closure materially changes.

Do **not** update this file solely to copy:

- latest Product HEAD;
- rollback SHA;
- workflow run IDs;
- artifact digests;
- branch inventory;
- every newly merged independent PR.

## Closing work

Any scope is allowed:

- one small finding;
- a duplicate cluster;
- a route package;
- one systemic root and absorbed symptoms;
- a full verification/repair wave;
- a no-fix owner disposition.

Prefer a compact `verified/CLOSURE_LEDGER.md` entry. Create a separate `reverify/` document only for disputed, systemic, security/live/rights or historically valuable evidence.

## Current optional directions

See [`WORK_QUEUE.md`](./WORK_QUEUE.md). The queue is owner-controlled and may be changed, reordered or left empty.
