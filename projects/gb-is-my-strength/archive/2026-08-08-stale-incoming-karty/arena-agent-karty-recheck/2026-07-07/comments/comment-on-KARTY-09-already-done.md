# Comment on KARTY-09 — Already implemented

**Target finding:** `incoming/arena-agent-karty-audit/2026-07-07/proposals/proposal-KARTY-09.md` (P2: route.schema.json не покрывает 5 фактически используемых полей)

**Source:** `incoming/arena-agent-karty-recheck/2026-07-07/REPORT.md` §1.4

**Status proposal:** `proposal-confirmed` (technical finding valid for SCHEMA) + `proposal-resolved` (validation works in CI)

## Re-verification

```bash
$ ls scripts/ | grep -E "karty|map-pub|validate-map"
check-map-publication-status.js
validate-map-routes.js
avraam-map-audit.js
konfessii-map-audit.js
karty-visual-parity-audit.js

$ node scripts/validate-map-routes.js
✅ route schema present
✅ karty/avraam/route.json: 19 places · 8 stages · 5 stories
... (all 10 routes)
✅ Map route validation passed: 10 route file(s)
```

## What's implemented (lines from validate-map-routes.js)

- Line 109: `placeIds.size !== places.length` → catches duplicate place.id (via Set)
- Line 110: `storyIds.size !== stories.length` → catches duplicate story.id
- Line 28-37: `validateKnownIdList` → catches duplicate IDs in `signature.place_ids`, `signature.north_ids`, `signature.south_ids`
- Line 89-105: `validateSignature` → checks `signature.type` against 9-element enum, validates origin, place_ids refs
- Line 147-160: per-story place_ids/stage_ids cross-reference validation
- Line 164-180: scientific_variants structure validation

## What's still open (real gap)

The **schema** (`karty/_shared/route.schema.json`) does not formally describe:
- `signature`, `timeline`, `layers`, `scientific_variants`, `verified_waypoints`
- (it has `signature` and `scientific_variants` mentioned, but minimal)

But the **script validates** all of these. So the practical question is: should the schema be more complete (for documentation), or is the script enough?

POLISH-2 in this intake (proposals/polish-schema-comment.md) addresses this with a `$comment` documenting why schema is incomplete.

## Recommended status

- **Close** KARTY-09 as `RESOLVED-AS-ALREADY-IMPLEMENTED` in MASTER_BUG_MATRIX
- **Add** link to `scripts/validate-map-routes.js` as the implementation
- **Add** note: "schema documentation can be improved (POLISH-2), but validation works"

## Cross-agent note

This is not a duplicate of KARTY-09 — it's a **resolution** with stronger evidence (verified on current HEAD, script run successfully).

— arena-agent-karty-recheck, 2026-07-07
