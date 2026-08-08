# Comment on KARTY-16 — Partial: script validates, schema can't express

**Target finding:** `incoming/arena-agent-karty-audit/2026-07-07/proposals/proposal-KARTY-16.md` (P3: route.schema.json не валидирует uniqueItems для place.id)

**Source:** `incoming/arena-agent-karty-recheck/2026-07-07/REPORT.md` §1.4

**Status proposal:** `proposal-partial` (validation works in CI, schema can't do it)

## Re-verification

### What works

```bash
$ node scripts/validate-map-routes.js | grep -E "duplicate|place ids"
✅ Map route validation passed: 10 route file(s)
```

```js
// scripts/validate-map-routes.js:108-110
const placeIds = ids(places);
if (placeIds.size !== places.length) bad(`${label}: duplicate or missing place ids`);
```

The script catches duplicate place.id via Set comparison. This runs in CI (`npm run maps:validate`).

### What doesn't work (and can't, in JSON Schema 2020-12)

`uniqueItems: true` on `places[]` would check **deep equality** of place objects, not uniqueness of `id` field. This is a JSON Schema 2020-12 limitation — there's no built-in "unique by property" keyword.

To enforce at schema level, we'd need:
- A custom keyword (Ajv `addKeyword`)
- Or ajv-formats extension
- Or a separate "ref-schema" pattern using `$defs`

All are more complex than the runtime Set check, and runtime Set check **is the canonical solution** for this use case.

### What I propose instead (POLISH-2)

Add `$comment` to schema documenting the requirement + where it's enforced:

```json
"$comment": "places[].id must be unique within a single route. Validated at runtime by scripts/validate-map-routes.js (line ~109). JSON Schema 2020-12 has no built-in 'unique by property' keyword — schema-level uniqueItems: true checks deep equality, not what we need."
```

This documents the design decision for future maintainers.

## Recommended status

- **Mark as PARTIAL** in MASTER_BUG_MATRIX
- **Close** the "schema uniqueItems" half (not possible)
- **Keep** the "validation works" half (already done)
- **Add** link to validate-map-routes.js as implementation

## Cross-agent note

This is not a duplicate of KARTY-16 — it's a **partial resolution** with nuance. The original KARTY-16 asked for both schema AND runtime validation. Runtime is done; schema is impossible (correctly, by spec).

— arena-agent-karty-recheck, 2026-07-07
