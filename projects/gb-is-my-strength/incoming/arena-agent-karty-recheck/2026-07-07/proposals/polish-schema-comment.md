# Proposal: POLISH-2 — Add `$comment` to route.schema.json documenting unique-id requirement

**Source:** `incoming/arena-agent-karty-recheck/2026-07-07/REPORT.md` §3.2
**Current source HEAD:** `75f807b73`
**Status:** `proposal-open` (low-risk, documentation only)

## What we propose

**File:** `karty/_shared/route.schema.json`
**Change:** Add `$comment` explaining why schema doesn't have `uniqueItems: true` for places

**Before:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://gospod-bog.ru/karty/_shared/route.schema.json",
  "title": "GB Historical Map Route",
  "type": "object",
  "required": ["meta", "stories", "places", "stages"],
  ...
}
```

**After:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://gospod-bog.ru/karty/_shared/route.schema.json",
  "$comment": "places[].id must be unique within a single route. Validated at runtime by scripts/validate-map-routes.js (line ~109). JSON Schema 2020-12 has no built-in 'unique by property' keyword — schema-level uniqueItems: true checks deep equality, not what we need. The `additionalProperties: true` on the places item is intentional (route data has many optional fields not in this schema).",
  "title": "GB Historical Map Route",
  "type": "object",
  "required": ["meta", "stories", "places", "stages"],
  ...
}
```

## Why this helps

Future agents / maintainers reading the schema would otherwise:
- Try to add `"uniqueItems": true` to `places[]` — would fail (deep equality)
- Or wonder why duplicates are not blocked at schema level

The `$comment` (standard JSON Schema 2020-12 field) documents:
1. The requirement (uniqueness by `id` property)
2. Where it's enforced (script, not schema)
3. Why not at schema level (JSON Schema limitation)

## Risk assessment

- **Scope:** 1 file, 2 lines added
- **Behavior change:** None (comment field is metadata, ignored by validators)
- **Compatibility:** `$comment` is standard JSON Schema 2020-12 keyword
- **LANE required:** NO (schema documentation, low-risk per FAST)

## When to apply

Now (immediate).

## Do not mix with

- KARTY-16 (schema uniqueItems) — POLISH-2 documents WHY not, doesn't change behavior
- POLISH-1 (script message) — different file, complementary

---

**Effort:** 2 minutes
**Risk:** None (documentation only)
**LANE:** Not required (FAST scope)
**Owner decision:** Not strictly required
