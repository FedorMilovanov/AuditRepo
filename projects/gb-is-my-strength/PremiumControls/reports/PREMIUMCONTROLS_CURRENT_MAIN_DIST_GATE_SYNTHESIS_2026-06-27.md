# PremiumControls — Current-main dist-gate synthesis (2026-06-27)

**Source main audited:** `23f283d4`  
**Repair branch pushed:** `lane/system-premiumcontrols-dist-gate-wiring-2026-06-27`  
**Repair commits:** `ae9f3d4f`, `7cb0f8c7`  
**Audit evidence:** `incoming/arena-agent-premiumcontrols-surgeon/2026-06-27/evidence/`

## Executive synthesis

The new PremiumControls audit wave substantially improves the project: Gill v16 invariants exist, route rollout auditing is much smarter, PC-001..PC-006 are no longer broad-open, and current failures are mostly second-order guard/architecture issues.

This pass found and repaired two current-main guard/truth gaps:

1. `audit:premium-controls` existed, but the production-like dist gate and deploy workflow did not yet call it.
2. `dist-publication-audit.js` still expected legacy `gbs2-rail` markers on several Gill pages even though current Gill v16 dist correctly uses `data-gill-v16` + `gbs-rail`.

## Surgical fixes

### `ae9f3d4f` — PremiumControls audit wiring

Wires the existing audit into:

- `strangler:audit:production-like` after `dist:jsonld:audit`;
- GitHub Pages deploy after dist JSON-LD parse audit;
- `scripts/check-workflows.js`, so future agents cannot silently remove the wiring.

### `7cb0f8c7` — Gill v16 marker truth in dist publication audit

Updates `dist-publication-audit.js` so all five Gill routes require:

- `gbs-world`
- `data-gbs2-series="dzhon-gill"`
- `data-gill-v16`
- `gbs-rail`

instead of stale `gbs2-rail` markers.

No visual geometry, Play/Save sizes, speed-pill animation, controller split, or CSS architecture was changed.

## Sandbox/RAM note

`docs/SANDBOX-ENV-2026-06-21.md` says Arena has ~2 vCPU and ~1.9–2 GiB RAM. A full build attempt hit `exit 137`; temporary swap fixed the environment limitation for this session:

```bash
sudo fallocate -l 4G /swapfile-arena
sudo chmod 600 /swapfile-arena
sudo mkswap /swapfile-arena
sudo swapon /swapfile-arena
```

With Node 22 in PATH and Playwright deps installed, full static and dist gates completed.

## Verification

### Source matrix

```text
TOTAL=55 PASS=55 FAIL=0
```

Key PremiumControls-specific assertions:

- all five Gill source chrome files carry `data-gill-v16`;
- no retired legacy Gill mobile DOM classes remain in Gill v16 source chrome;
- `data-fc-mode` values stay in the allowed enum;
- `src/styles/premium-controls.css` and `css/premium-controls.css` are byte-identical;
- no phantom `premium-controls-controller` reference exists;
- `dist:jsonld:audit` is rooted to `dist`;
- production-like audit now calls `audit:premium-controls`.

### Full gates

```text
npm run validate:static-publication       ✅ PASS
npm run strangler:audit:production-like   ✅ PASS
```

Inside `strangler:audit:production-like`:

```text
PremiumControls rollout audit: 39/39 passed
✅ PremiumControls rollout contract OK.
✅ dist smoke passed — representative production-like strangler output is healthy
✅ CSS parity audit passed: 52/52 pages carry project CSS.
✅ SW dist readiness audit passed
```

## Remaining risks not solved here

Still open by owner/architecture decision:

- CSS architecture: `floating-cluster.css` vs `premium-controls.css` boundary;
- controller decomposition / naming convergence;
- long-term retirement of compatibility aliases;
- full browser visual freeze/baseline policy for future visual changes.

## Operational recommendation

Treat this pass as a **guard-truth and dist-gate closeout**. It should be merged before larger PremiumControls refactors, because it ensures the existing bulletproof audit is actually in the production path and that the dist publication audit reflects Gill v16 reality instead of stale legacy markers.
