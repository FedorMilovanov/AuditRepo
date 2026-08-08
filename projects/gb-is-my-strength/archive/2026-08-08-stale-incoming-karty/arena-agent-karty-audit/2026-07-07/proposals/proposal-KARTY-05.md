# Proposal: KARTY-05 — `_renderArchaeologyFooter`: hardcoded ID-маппинг (12 таблиц)

**Source:** `incoming/arena-agent-karty-audit/2026-07-07/REPORT.md` §1 Finding KARTY-05
**Current source HEAD:** `75f807b73`

## Status: `proposal-open` (требует owner-decision по схеме)

## Proposed severity: **P2** (design violation: обещает универсальность, не обеспечивает)

## Evidence

`karty/_engine/map-engine.js:1829-1879`:
```js
const exodusIds = ['rameses','succoth','etham',...];
if (exodusIds.includes(place.id)) cat = 'exodus_route';
const jerusalemIds = ['jerusalem','jerusalem_kings','cityofdavid',...];
if (jerusalemIds.includes(place.id)) cat = 'jerusalem_first_temple';
// ... 12 таких таблиц
```

12 hardcoded id-массивов. Каждый новый route.json требует правки `_engine/map-engine.js`.

`ARCHAEOLOGY_REFERENCES` (lines 35-251) уже содержит **13 категорий, 58 items** — реестр готов.

## Expected design

```js
// route.json
{ "places": [
  { "id": "ur", "x": 1710, "y": 897, ..., "arch_category": "exodus_route" }
]}

// map-engine.js
function getArchCategory(place) {
  return place.arch_category || opts.archCategoriesByPlaceId?.[place.id] || null;
}
```

## Repair lane

**W4 — Bible-корпус** (требует owner-decision + editorial input).

## Suggested action (требует согласования)

1. **Владелец решает**:
   - **Option A:** `place.arch_category` (per-place, явное)
   - **Option B:** `route.arch_categories_by_place_id: { "ur": "exodus_route", ... }` (per-route, централизованное)
   - **Option C:** both (cascading)
2. Расширить `route.schema.json` (см. KARTY-09)
3. Удалить hardcoded `exodusIds/jerusalemIds/...` из map-engine.js
4. Добавить тесты для всех 10 route.json
5. Добавить в `MapEngine.validateRoute()`: `if (place.arch_category && !ARCHAEOLOGY_REFERENCES[place.arch_category]) error`

## Do not mix with

- KARTY-09 (там schema в целом, тут специфика)
- W6 (Bible-корпус заморозка; этот fix в KARTY-05 — не Bible data, а engine layer)

---

**Owner decision required:** да (Option A vs B vs C)
**LANE required:** да (W4)
**Cross-agent:** это **не duplicate** чего-либо в матрице; новая находка
