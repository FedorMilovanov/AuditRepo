# PremiumControls — Current-main dist-gate synthesis (2026-06-27)

**Source main audited:** `23f283d4`  
**Repair branch pushed:** `lane/system-premiumcontrols-dist-gate-wiring-2026-06-27`  
**Repair commit:** `ae9f3d4f`  
**Audit evidence:** `incoming/arena-agent-premiumcontrols-surgeon/2026-06-27/evidence/PREMIUMCONTROLS_55_SOURCE_MATRIX_ae9f3d4f.log`

## Executive synthesis

The new PremiumControls audit wave substantially improves the project: Gill v16 invariants exist, route rollout auditing is much smarter, PC-001..PC-006 are no longer broad-open, and current failures are mostly second-order guard/architecture issues.

The current-main gap found in this pass was narrow but important:

> `audit:premium-controls` existed, but the production-like dist gate and deploy workflow did not yet call it.

That meant PremiumControls regressions could be caught manually but still bypass the main publication path.

## Surgical fix

`ae9f3d4f` wires the existing audit into:

- `strangler:audit:production-like` after `dist:jsonld:audit`;
- GitHub Pages deploy after dist JSON-LD parse audit;
- `scripts/check-workflows.js`, so future agents cannot silently remove the wiring.

No visual geometry, Play/Save sizes, speed-pill animation, controller split, or CSS architecture was changed.

## Verification

Post-fix source matrix:

```text
TOTAL=55 PASS=55 FAIL=0
```

Key PremiumControls-specific assertions in that matrix:

- all five Gill source chrome files carry `data-gill-v16`;
- no retired legacy Gill mobile DOM classes remain in Gill v16 source chrome;
- `data-fc-mode` values stay in the allowed enum;
- `src/styles/premium-controls.css` and `css/premium-controls.css` are byte-identical;
- no phantom `premium-controls-controller` reference exists;
- `dist:jsonld:audit` is rooted to `dist`;
- production-like audit now calls `audit:premium-controls`.

## Remaining risks not solved here

Still open by owner/architecture decision:

- CSS architecture: `floating-cluster.css` vs `premium-controls.css` boundary;
- controller decomposition / naming convergence;
- long-term retirement of compatibility aliases;
- full browser visual freeze/baseline policy for future visual changes.

## Operational recommendation

Treat this pass as a **guard-wiring closeout**. It should be merged before larger PremiumControls refactors, because it ensures the existing bulletproof audit is actually in the production path.
