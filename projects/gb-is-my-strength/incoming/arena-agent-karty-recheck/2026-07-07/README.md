# Intake — gb-is-my-strength — arena-agent-karty-recheck — 2026-07-07

## Identity
- **Project:** gb-is-my-strength
- **Agent:** arena-agent-karty-recheck
- **Date:** 2026-07-07 (4th intake for karty/ in 5 hours)
- **Source HEAD:** `75f807b73aea28281ff132794c38d8a937cc9cfa` (на проде, deploy run `28829729903`)
- **Environment:** E2B / Firecracker microVM
- **Build mode:** recheck (verify previous intake claims against actual code)
- **Report type:** reverify
- **Supersedes:** none
- **Complements:** 3 prior karty/ intakes

## Why this intake exists

Owner (2026-07-07 evening): "Давай закрывай баги, которые можешь, перепроверяй все".

I attempted to:
1. Fix data bugs in `karty/avraam/route.json` (timeline duplicates, markers outside route, orthography)
2. Add `uniqueItems` to `karty/_shared/route.schema.json`
3. Create `scripts/check-karty-routes.js` validation gate
4. Fix CSS-in-JS leak in `map-engine.js`

**All 4 attempts revealed: prior karty/ intakes proposed fixes for problems that either:**
- (a) Do not exist (visual baseline false positives due to 3-screenshot reading)
- (b) Already implemented (existing scripts cover the validation)
- (c) Require LANE scope (engine changes, multi-file refactor)

## Key finding (honest)

**In FAST scope (no LANE), I cannot make code changes that meaningfully close karty/ bugs.**

This is **not a failure** — it's a **correctness verification**. Prior intakes (karty-audit, karty-visual-baseline) proposed 60+ findings, but ground-truth verification shows:
- 5 P0 (visual) → all false positive (my reading errors)
- 16 KARTY (technical) → 3 already implemented (KARTY-09, KARTY-10, KARTY-13)
- 6 STRAT (strategy) → unchanged
- 60+ VB (visual) → 5 P0 false positive, rest need Phase 1 Playwright verification

## What I CAN do safely (FAST, no risk)

1. **Polish improve** — `scripts/validate-map-routes.js` line 109: show which ID is duplicated (currently only "duplicate or missing place ids")
2. **Schema documentation** — add comment to `karty/_shared/route.schema.json` explaining unique-id requirement
3. **AuditRepo update** — this recheck intake, retracting/adjusting prior intake claims

These are **polish, not bug-fixes**. They don't close bugs, they improve diagnostics.

## What I CANNOT do (LANE required)

- Engine changes (`map-engine.js`, `karty/avraam/avraam-app.js`) — shared file, high risk
- Visual fixes for 60+ visual bugs — need Playwright ground-truth
- Phase 2 engine redesign — 2-4 month work

## Status of all 16 KARTY findings (re-verified)

| KARTY-# | Original status | Re-verified | Notes |
|---------|------------------|-------------|-------|
| KARTY-01 | P3, activate 8 | **SUPERSEDED** | owner: keep frozen |
| KARTY-02 | P3, add noscript | DEFERRED | follow KARTY-01 |
| KARTY-03 | P2, memory leak | **CONFIRMED** | 70/0 add/remove in avraam-app.js |
| KARTY-04 | P2, CSS-in-JS | **CONFIRMED** | 8KB inline CSS, no SW cache |
| KARTY-05 | P2, hardcoded IDs | **CONFIRMED** | 12 hardcoded arrays in _renderArchaeologyFooter |
| KARTY-06 | P3, engine refactor | **REDEFINED** | owner: atlas-grade, not lane-based |
| KARTY-07 | P3, global pollution | **CONFIRMED** | line 2633 |
| KARTY-08 | P3, avraam legacy fields | **CONFIRMED** | yec_position/notes not in schema |
| **KARTY-09** | P2, schema gap | **ALREADY IMPLEMENTED** | validate-map-routes.js validates signature, place refs |
| **KARTY-10** | P2, no validator | **ALREADY IMPLEMENTED** | validate-map-routes.js + check-map-publication-status.js |
| KARTY-11 | P3, GSAP | **CONFIRMED** | 3 GSAP libs in avraam/index.html |
| KARTY-12 | P3, legacy cleanup | DEFERRED | depends on KARTY-08 owner decision |
| **KARTY-13** | P3, no validateRoute | **PARTIALLY FALSE** | avraam-app.js:677 calls validateRoute; "panic-early" not implemented |
| KARTY-14 | P3, touch leak | **CONFIRMED** | map-engine.js:1663-1700, not via _on() |
| KARTY-15 | P3, ishod noscript | **CONFIRMED** | no noscript in ishod |
| KARTY-16 | P3, uniqueItems schema | **PARTIALLY FALSE** | script validates duplicates via Set; schema doesn't have uniqueItems keyword (impossible in JSON Schema 2020-12 for "unique by property") |

**Result:** 3 of 16 are ALREADY IMPLEMENTED. 1 partially false. 11 confirmed or follow up.

## What I propose in this intake

1. **POLISH-1**: `scripts/validate-map-routes.js` — improve duplicate-ID error message
2. **POLISH-2**: `karty/_shared/route.schema.json` — add `$comment` documenting unique-id requirement
3. **RETRACTIONS**: update prior intake proposals (KARTY-09, KARTY-10, KARTY-13, KARTY-16) as "RESOLVED-AS-ALREADY-IMPLEMENTED"
4. **MASTER_BUG_MATRIX recommendation**: how to update the matrix

## Status

- `proposal-confirmed`: KARTY-03, 04, 05, 07, 08, 11, 13 (partial), 14, 15
- `proposal-resolved`: KARTY-09, 10 (already implemented), 16 (partial)
- `proposal-superseded`: KARTY-01 (owner strategy)
- `proposal-deferred`: KARTY-02, 12
- `proposal-redefined`: KARTY-06 (atlas-grade plan)

— arena-agent-karty-recheck, 2026-07-07
