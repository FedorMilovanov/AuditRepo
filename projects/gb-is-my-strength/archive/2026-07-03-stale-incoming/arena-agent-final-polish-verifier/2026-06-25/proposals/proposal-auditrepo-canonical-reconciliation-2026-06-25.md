# Proposal — AuditRepo Canonical Reconciliation

## Identity
- Project: gb-is-my-strength
- Proposed by: arena-agent-final-polish-verifier
- Date: 2026-06-25
- Target finding ID(s): AR-01, AR-03
- Proposal type: status-change / repair-lane / canonical-doc cleanup

## Current state
AuditRepo contains several conflicting entrypoints for `gb-is-my-strength`:

- `PROJECT_REGISTRY.md` reports multiple counts/statuses across sections.
- `projects/gb-is-my-strength/README.md` reports old counts (42, 12) while registry/verified docs report 60+.
- `UNIFIED_BUG_LEDGER_2026-06-25.md` mixes 60, 63, 8 P0, 9 P0, fixed, and repair-ready wording.
- `repair-order-unified-2026-06-25.md` still includes items later marked fixed/resolved.

## Proposed change
Create a short canonical delta document, e.g.:

```text
projects/gb-is-my-strength/working/CURRENT_CANONICAL_DELTA_2026-06-25.md
```

It should state:

1. source repo HEAD it refers to;
2. which findings are still open;
3. which findings are fixed in source HEAD;
4. which findings are only repair-candidate verified but not merged;
5. which older docs are historical/supporting only.

Then update:

- `projects/gb-is-my-strength/verified/START_HERE_2026-06-25.md`
- `projects/gb-is-my-strength/working/CANONICAL_DOC_STATUS_2026-06-25.md`

without deleting raw incoming evidence.

## Evidence
See official intake report:

```text
projects/gb-is-my-strength/incoming/arena-agent-final-polish-verifier/2026-06-25/REPORT.md
```

## Why this matters
Implementation agents should not need to infer which of the contradictory counts/statuses is current. Without reconciliation, agents may re-fix already fixed bugs or ignore newly verified repair candidates.

## Proposal status: proposal-open
