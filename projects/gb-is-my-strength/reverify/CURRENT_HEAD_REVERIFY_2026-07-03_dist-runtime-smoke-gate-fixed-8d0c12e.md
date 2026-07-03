# Current-head reverify — broad dist runtime smoke wired into Deploy

**Project:** `gb-is-my-strength`  
**Date:** 2026-07-03  
**Source main before fix:** `914c7fb11e51e25937e0afc0ef79118c7a246394`  
**Source fix commit:** `8d0c12e0756c6dd0327a212dba6b8a7bbdc01d3e`  
**Source lane/main:** `lane/system-dist-runtime-smoke-gate-2026-07-03` and `main`

---

## 1. Scope

Close `NEW-64` prevention gap. The repo already had `scripts/dist-smoke-audit.js` and `strangler:audit:production-like` already ran it, but GitHub Pages Deploy did not run the broad smoke. The previous `tt is not defined` class was caught indirectly by Gill mobile layout audit, leaving non-Gill routes less protected.

---

## 2. Source changes

Commit `8d0c12e0`:

- `.github/workflows/deploy.yml`: added blocking step after `Gill mobile reference layout audit`:

```bash
node scripts/dist-smoke-audit.js --no-build --production-like
```

- `scripts/check-workflows.js`: added policy assertion requiring deploy.yml to keep the broad production-like runtime smoke.
- Added lane report: `docs/refactor-2026/lanes/system-dist-runtime-smoke-gate-2026-07-03.md`.

---

## 3. Verification

```text
node --check scripts/check-workflows.js                         PASS
npm run workflows:check                                         PASS
node scripts/dist-smoke-audit.js --no-build --production-like    PASS
npm run pagefind:build:dist && npm run sw:dist:audit:deploy-switch PASS
git diff --check                                                PASS
npm run guard:shared-files                                      PASS after lane commit
```

---

## 4. Status

`NEW-64` / `CHECK-GAP-DIST-SMOKE`: **fixed-current on source main `8d0c12e0` by source workflow-policy evidence and local runtime smoke evidence**.

Remote Deploy should be observed separately for final workflow confirmation.

---

## Remote deploy confirmation

Remote `Deploy to GitHub Pages` is **green** on current source main `932af3f3`: workflow_dispatch run `28685603542` (https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/28685603542).
