# NEXT AGENT PROMPT — gb-is-my-strength

> **Meaningful handoff only.** The matrix is a durable verified backlog, not per-commit source telemetry.

**Exact finding-disposition anchor:** `b251c4b99265a9915881048c5fbde61f810d8c96`
**Last exact production authority:** `abf1edba190280e554dfda085bef9fb6594c896d`
**Deployment status:** ⚠️ source verification `!=` production; no production claim.
**Current reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-08-02_b251c4b9_home-z-token-stale-closure.md`
**Canonical matrix:** **358 IDs = 185 closed + 173 open**.

## What changed

- Closure wave V1 closed 15 fixed/stale source-data findings.
- Source PR #755 removed dead Vosk `splitSentences`; its canonical row is closed.
- `AR-IDX-CSS-01` is closed as stale: the Home z-index token scale is defined in `css/site.css` and consumed by `css/home.css` at exact source anchor `b251c4b99265a9915881048c5fbde61f810d8c96`.
- Source PR #777 is independently widening `legacy-shadow-wrapper-audit.js` from a seven-route sample to the registry-derived committed-shadow surface; do not pre-close `SHADOW-AUDIT-NARROW` until that PR merges and its exact-head witness is green.

## Current counts

- P0: 0
- P1: 84
- P2: 34
- P3: 48
- Refactoring: 4
- AuditRepo: 3
- Total open: 173
- Closed: 185

## Next meaningful work

1. Finish PR #777 and close `SHADOW-AUDIT-NARROW` only after source merge and exact-head evidence.
2. Run the expanded exact-anchor browser/runtime wave, including `AVRAAM-P1-04`, `A11Y-P1-01` and `QUAL-P1-04`.
3. Close every fixed/stale/false/duplicate result; narrow partial findings; retain only confirmed-current residuals.
4. Respect active source PR ownership (#773 Home, #759 Atlas) and do not create AuditRepo sync solely because source `main` moved.
