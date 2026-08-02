# NEXT AGENT PROMPT — gb-is-my-strength

> **Meaningful handoff only.** The matrix is a durable verified backlog, not per-commit source telemetry.

**Exact finding-disposition anchor:** `3aba5112f0fc37712e027a1ad1d8379debe54377`
**Last exact production authority:** `abf1edba190280e554dfda085bef9fb6594c896d`
**Deployment status:** ⚠️ source verification `!=` production; this closure wave makes no production claim.
**Current reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-08-02_3aba5112_fixed-source-wave-v1.md`
**Canonical matrix:** **358 IDs = 183 closed + 175 open**.

## What changed

Closure wave V1 independently reverified and closed 15 source/data findings:

- 11 P1 rows: `ASTRO-P1-02`, `ASTRO-P1-04`, `ENGINE-P1-21`, `ENGINE-P1-22`, `ENGINE-P1-23`, `ENGINE-P1-28`, `MAP-P1-14`, `MAP-P1-15`, `GATE-P1-02`, `COMP-P1-01`, `CSS-P1-01`;
- 2 P2 rows: `GATE-P1-04`, `QUAL-P2-03`;
- 2 P3 rows: `NEW-VOSK-FETCH-NO-ABORT`, `AR-AUDIT-17`.

Eight MapEngine rows are fixed by source PR #709 / merge `8bd891b1371d4ac2438f9026e40a9c723856556b`; their owner file is unchanged through the selected anchor. The remaining rows were directly carried forward or rechecked on `3aba5112f0fc37712e027a1ad1d8379debe54377`. Browser-only candidates were not closed.

## Current counts

- P0: 0
- P1: 85
- P2: 34
- P3: 49
- Refactoring: 4
- AuditRepo: 3
- Total open: 175
- Closed: 183

## Next meaningful work

1. Run the expanded exact-anchor browser/runtime wave for 23 rows, including `AVRAAM-P1-04`, `A11Y-P1-01` and `QUAL-P1-04` in addition to the previous plan.
2. Close every browser result as fixed/stale/false/duplicate or narrow it to the real residual; keep only confirmed-current findings open.
3. Repair confirmed-current clusters in independent bounded lanes: MapEngine runtime, base geography/rivers/SVG, Karty data/schema, sheet/atlas engine, SW/media and Vosk cleanup.
4. Do not modify active source PR #680 or manually edit `migration/route-migration-matrix.json`.
5. Do not create an AuditRepo sync solely because source `main` moved; update only material finding/evidence/handoff facts.
