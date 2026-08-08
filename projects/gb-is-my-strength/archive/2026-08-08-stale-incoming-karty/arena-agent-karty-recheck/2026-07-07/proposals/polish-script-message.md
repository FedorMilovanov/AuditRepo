# Proposal: POLISH-1 — Improve duplicate-ID error message in validate-map-routes.js

**Source:** `incoming/arena-agent-karty-recheck/2026-07-07/REPORT.md` §3.1
**Current source HEAD:** `75f807b73`
**Status:** `proposal-open` (low-risk, no owner decision required, but worth confirming)

## What we propose

**File:** `scripts/validate-map-routes.js`
**Change:** Improve duplicate-ID diagnostic from generic "duplicate or missing place ids" → show specific IDs

**Before (lines 109-112):**
```js
const placeIds = ids(places);
if (placeIds.size !== places.length) bad(`${label}: duplicate or missing place ids`);
const storyIds = ids(stories);
if (storyIds.size !== stories.length) bad(`${label}: duplicate or missing story ids`);
```

**After:**
```js
const placeIds = ids(places);
const placeDups = findDuplicateIds(places);
if (placeDups.length) bad(`${label}: duplicate place ids: ${placeDups.join(', ')}`);
else if (placeIds.size !== places.length) bad(`${label}: place with missing id`);
const storyIds = ids(stories);
const storyDups = findDuplicateIds(stories);
if (storyDups.length) bad(`${label}: duplicate story ids: ${storyDups.join(', ')}`);
else if (storyIds.size !== stories.length) bad(`${label}: story with missing id`);
```

**Helper function to add (top of file, near line 19):**
```js
function findDuplicateIds(items) {
  const seen = new Map();
  const dups = [];
  for (const x of items || []) {
    if (!x || !x.id) continue;
    if (seen.has(x.id)) {
      if (!dups.includes(x.id)) dups.push(x.id);
    } else {
      seen.set(x.id, true);
    }
  }
  return dups;
}
```

## Why this helps

If someone (mistakenly or intentionally) introduces a duplicate place.id, currently:
- ❌ They get: "karty/avraam/route.json: duplicate or missing place ids"
- ✅ They'd get: "karty/avraam/route.json: duplicate place ids: ur, harran"

Much faster to debug.

## Risk assessment

- **Scope:** 1 file, 5-10 lines added
- **Behavior change:** error message becomes more specific. No new failures, no new passes.
- **Performance:** O(n) for findDuplicateIds, same as current.
- **CI impact:** None (script is wired in `validate:static-publication`, will run same way).
- **LANE required:** NO (script improvement, low-risk per WORK_MODES.md FAST scope).

## When to apply

Now (immediate) — this is FAST-scope polish.

## Do not mix with

- KARTY-09/10 (already implemented) — POLISH-1 is orthogonal
- KARTY-16 (schema uniqueItems) — different layer (script vs schema)

---

**Effort:** 5 minutes
**Risk:** Very low (improved diagnostics only)
**LANE:** Not required (FAST scope)
**Owner decision:** Not strictly required, but recommend explicit OK
