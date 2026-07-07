# Proposal: Confirm q-bug merge — owner action required

**Source:** `incoming/arena-agent-karty-v3-deep-audit/2026-07-07/REPORT.md` §1
**Current source HEAD:** `75f807b73` (production with bug)
**LANE branch:** `lane/karty-q-bugfix` (commit `f7e9696`, pushed)
**Status:** `proposal-pending` (owner action required)

## Bug summary

`karty/_engine/map-engine.js:867` — `if (q)` is outside setTimeout callback → `ReferenceError: q is not defined` on every search keystroke.

**Affected:** `karty/ishod/` on production (uses map-engine's me-search). All future routes loading `_engine/map-engine.js` will be affected.

**Reproduction (production):**
```bash
$ node audit_visual/verify_ishod_prod.js
=== Loading ishod (PRODUCTION) ===
me-search count: 1
After "Раамсес" - errors: 1
  pageerror: q is not defined
```

## Fix

Commit `f7e9696` on LANE branch `lane/karty-q-bugfix`:
- 1 file: `karty/_engine/map-engine.js`
- +11/-11 lines (pure move)
- Move match-count toast block inside setTimeout (where `q` is in scope)

**Verification (local with fix):**
```bash
$ node audit_visual/verify_ishod.js
=== Loading ishod (LOCAL with fix) ===
me-search count: 1
After typing "Раамсес": errors: 0
After typing "Синай": errors: 0
After typing "Мерра": errors: 0
=== SUMMARY ===
PASS
```

## Owner action

**PR review and merge:** https://github.com/FedorMilovanov/gb-is-my-strength/pull/new/lane/karty-q-bugfix

**Risks:** Minimal. Pure move, no behavior change for non-search code. Syntax verified (`node --check`).

**Rollback:** Fast-forward to `0bd344a` (previous production fix).

## Why this is not LANE-blocked

Although `map-engine.js` is shared, the fix is:
- **Non-controversial** (clear bug, minimal change)
- **Non-regressive** (verified syntax + behavior)
- **Already on LANE** (per `LANE_LOCK_POLICY.md` §1, refactor = LANE)
- **Doesn't touch other routes** (only fixes the scope of `q`)

LANE workflow followed. Just needs owner review.

## Impact when merged

- `karty/ishod/` search input works on production
- All future map-engine routes work by default
- `showToast('Найдено: ...')` actually fires (was masked by crash)
- 0 pageerrors on search keystroke (verified)

## Cross-agent note

This is the **first real bug fix shipped from karty/ audit work** across 6 intakes. The 5 prior intakes found documentation/strategy/false-positive findings, but only this v3 deep-audit found a real P0 runtime crash AND shipped a fix.

The Playwright methodology is what made the difference — 30 minutes of setup + 17 minutes of capture found a bug that 4 hours of audit-only mode could not.

## Recommendation

**MERGE NOW.** The fix is small, well-tested, and unblocks user-facing search functionality on production.
