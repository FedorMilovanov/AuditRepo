# Proposal: KARTY-09 — `route.schema.json` не покрывает 5 фактически используемых полей

**Source:** `incoming/arena-agent-karty-audit/2026-07-07/REPORT.md` §1 Finding KARTY-09
**Current source HEAD:** `75f807b73`

## Status: `proposal-open` (FAST, no owner)

## Proposed severity: **P2** (schema ↔ data drift)

## Evidence

`evidence/route-json-keys.txt`:
- 9/10 route.json имеют `signature` (schema знает, но без items spec)
- 10/10 имеют `layers` (нет в schema)
- 10/10 имеют `timeline` (нет в schema)
- 8/10 имеют `publication` (нет в schema, второй несогласованный словарь)
- `scientific_variants` в schema, но без items spec
- `verified_waypoints` в schema, но без items spec

## Repair lane

W1 (FAST).

## Suggested action

Добавить в `karty/_shared/route.schema.json`:

```json
{
  "signature": { "type": "object", "properties": { "type": "string", "label": "string", ... } },
  "timeline": { "type": "array", "items": { "type": "object" } },
  "layers": { "type": "array", "items": { "type": "object" } },
  "publication": { "type": "object", "properties": { "status": "string", "noindex_reason": "string" } },
  "scientific_variants": { "type": "object" },
  "verified_waypoints": { "type": "array", "items": { "type": "object" } },
  "places": { "items": { ..., "arch_category": "string" } }  // см. KARTY-05
}
```

## Do not mix with

- KARTY-05 (там spec для arch_category, тут общая schema)
- KARTY-10 (там валидатор)

---

**Owner decision:** нет
**LANE:** нет
**Estimated LOC:** ~50
**Можно одной PR** с KARTY-10, KARTY-13, KARTY-16
