# Current truth stale-hit classification — 2026-06-27

**Source HEAD checked:** `66640561919501e68dd9d3cd290ff9afe53d3068`
**AuditRepo HEAD before cleanup:** `c3a9ae27df749c09a88650ae0e16e348db61c1c7`

This file classifies the grep hits requested for:

```bash
grep -R "100% FIXED\|ПОЛНОСТЬЮ ЗАКРЫТЫ\|4f962f75\|819fd3f1\|49b833\|e0a1642f\|gbs2-rail\|dist:jsonld:audit" PROJECT_REGISTRY.md projects/gb-is-my-strength
```

## ACTIVE CURRENT TRUTH

- `PROJECT_REGISTRY.md` statements that `workflows:check` passes and old `dist:jsonld:audit --root dist` red item is fixed-current.
- `PROJECT_REGISTRY.md` / current docs statements that Gill v16 is current base and agents must not revert to legacy `gbs2-rail` / `gbs2-sheet` as target architecture.
- Current docs listing PC-CURRENT-02/03/04/05/06 as open unless fresh source+dist+browser reverify closes them.

## HISTORICAL / SUPERSEDED

- Any remaining mentions under `incoming/**`, `archive/**`, old `reports/**`, old `patches/**`, or old `working/**` that cite `819fd3f1`, `49b833`, `e0a1642f`, old `gbs2-rail` states, old `dist:jsonld:audit` failures, or old “100% fixed” claims.
- `PremiumControls/README.md` mention of old `4f962f75` / “Phase 1..3 100% closed” material: explicitly historical only.
- Old 2026-06-25 bug totals and repair-ready language: historical baseline only.

## CONTRADICTION — FIXED IN THIS COMMIT

- `PROJECT_REGISTRY.md` no longer presents “60 confirmed bugs / 9 P0 / repair-ready” as active operational truth.
- `projects/gb-is-my-strength/README.md` no longer lists workflow-policy mismatch or Gill legacy split as current live themes.
- `verified/CURRENT_HEAD_CANONICAL_LEDGER_2026-06-27.md` no longer contradicts itself by saying Gill legacy split is stale and current at the same time.
- `verified/REPAIR_ORDER_DELTA_2026-06-27_current-head-priority-reset.md` no longer prioritizes the fixed `dist:jsonld:audit --root dist` workflow item.
- `verification/CANONICAL_VERIFIER_NOTE_2026-06-27_current-head-status-flips-and-second-order-defects.md` no longer says `workflows:check` is red on current HEAD.
- `PremiumControls/README.md` no longer starts with “ПОЛНОСТЬЮ ЗАКРЫТЫ” as active status.
- `PremiumControls/REMAINING_RISKS_2026-06-27.md` no longer lists PC-CURRENT-01 as current-open.
