# History and Regression Notes — gb-is-my-strength — 2026-06-26

## Purpose
Capture the specific history signals in AuditRepo that matter for current verification, so future agents do not treat all PremiumControls / phase3 claims as equally current.

---

## High-signal history commits seen during this pass

- `aebbd48` — critical production regression: deleted styles, broken dist, 4 P0 visual bugs
- `2923879` — complete blast radius analysis
- `49ced34` / `7a35401` — TTS click-start path and show-stopper framing
- `267d682` — rollout-status verifier across 4 unmerged branch lines
- `8f23365` — phase3 not merge-ready
- `975a445`, `f0b1f6e`, `b72f379` — implementation/fix rounds with PremiumControls focus
- `85d9494` — Gill GBS2 clickability fix

---

## Current verifier interpretation

These commits prove:
1. multiple agents were touching overlapping premium/runtime surfaces;
2. branch/merge order likely mattered as much as any single code fix;
3. current regressions must be evaluated **per route family**;
4. historical “fixed” language may only apply to one shell family (Gill) and not another (baptisty GBS2).

---

## Operational rule for future verifiers

When a bug references:
- `PremiumControls`
- `phase3`
- `PC-*`
- `Gill GBS2`
- `baptisty`

then the verifier should always ask:
- which route family?
- which control shell (legacy floating-cluster vs GBS2)?
- source witness, dist witness, or browser witness?
- before or after postbuild convergence?

Without those four answers, the claim is too weak to become canonical truth.
