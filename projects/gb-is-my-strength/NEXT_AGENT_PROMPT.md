# NEXT AGENT PROMPT — gb-is-my-strength

> **Meaningful handoff only.** The matrix is a durable verified backlog, not per-commit source telemetry.

**Exact finding-disposition anchor:** `d23546ce177c23c14aa82de511b2b1fc7a1f8bd3`
**Last exact production authority:** `abf1edba190280e554dfda085bef9fb6594c896d`
**Deployment status:** ⚠️ source verification `!=` production; no production claim.
**Current reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-08-02_d23546ce_shadow-audit-coverage-closure.md`
**Canonical matrix:** **358 IDs = 186 closed + 172 open**.

## What changed

- Closure wave V1 closed 15 fixed/stale source-data findings.
- Source PR #755 removed dead Vosk `splitSentences`; its canonical row is closed.
- `AR-IDX-CSS-01` is closed as stale because the shared Home z-index tokens are defined and consumed.
- Source PR #780 / merge `d23546ce177c23c14aa82de511b2b1fc7a1f8bd3` closed `SHADOW-AUDIT-NARROW`: the legacy shadow audit now derives all applicable committed-shadow routes from the ownership registry and passed a 52-route production-like witness.

## Current counts

- P0: 0
- P1: 84
- P2: 34
- P3: 47
- Refactoring: 4
- AuditRepo: 3
- Total open: 172
- Closed: 186

## Next meaningful work

1. Run the expanded exact-anchor browser/runtime wave, including `AVRAAM-P1-04`, `A11Y-P1-01` and `QUAL-P1-04`.
2. Close every fixed/stale/false/duplicate result; narrow partial findings; retain only confirmed-current residuals.
3. Repair confirmed-current clusters in independent bounded lanes, respecting active source PR ownership.
4. Do not create an AuditRepo sync solely because source `main` moved; update only material finding/evidence/handoff facts.
