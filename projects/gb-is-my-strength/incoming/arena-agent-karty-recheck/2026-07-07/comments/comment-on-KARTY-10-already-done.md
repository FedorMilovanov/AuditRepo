# Comment on KARTY-10 — Already implemented

**Target finding:** `incoming/arena-agent-karty-audit/2026-07-07/proposals/proposal-KARTY-10.md` (P2: нет scripts/check-karty-routes.js (validation gate))

**Source:** `incoming/arena-agent-karty-recheck/2026-07-07/REPORT.md` §1.4

**Status proposal:** `proposal-resolved`

## Re-verification

`scripts/check-karty-routes.js` was proposed but **does not exist** — instead, two other scripts already cover the same scope:

| Proposed (KARTY-10) | Actual implementation |
|----------------------|----------------------|
| `scripts/check-karty-routes.js` (new) | `scripts/validate-map-routes.js` (existing, line 1-277) |
| Validates route.json against schema | ✅ validates structure, types, refs |
| Wired in CI | ✅ `npm run maps:validate` → wired in `validate:static-publication` |
| Checks uniqueItems | ✅ via Set on line 109 |
| Checks publication status | ✅ separate `scripts/check-map-publication-status.js` (placeholder noindex enforcement) |

## What exists

```bash
$ ls scripts/ | grep -E "karty|map-pub|validate-map"
check-map-publication-status.js
validate-map-routes.js
avraam-map-audit.js
konfessii-map-audit.js
karty-visual-parity-audit.js

$ grep "maps:validate" package.json
"maps:validate": "node scripts/validate-map-routes.js && npm run maps:publication-status"
```

## What `validate-map-routes.js` validates

Per `validateRoute()` function:
- meta.{id, title, era, viewport_init.{cx,cy,w}} structure
- places[]: x/y range (-250 to 2200, -250 to 1600), stage index valid, id pattern, name, type, photos[].src+alt
- stages[]: n/t/r required
- stories[]: id/label, place_ids refs, stage_ids indices
- signature: type enum (9 values), origin, place_ids/north_ids/south_ids refs
- scientific_variants: structure, status enum (7 values)
- meta.stats consistency (places/stages/stories/photos/scientific_variants count)

## What `check-map-publication-status.js` validates

- 8 placeholder routes have `publication.status='temporary-placeholder'`
- Holding copy text in HTML matches status
- noindex enforcement
- Exclusion from sitemap/llms/Pagefind/baseline

## Recommended status

- **Close** KARTY-10 as `RESOLVED-AS-ALREADY-IMPLEMENTED` in MASTER_BUG_MATRIX
- **Add** links to both scripts
- **Add** note: "validation gate existed before KARTY-10 was proposed; KARTY-10 itself was a duplicate-finding"

## Cross-agent note

This is not a duplicate of KARTY-10 — it's a **resolution** with stronger evidence (verified on current HEAD, both scripts run successfully and exit 0).

— arena-agent-karty-recheck, 2026-07-07
