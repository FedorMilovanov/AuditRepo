# Proposal: KARTY-16 — `route.schema.json` не валидирует `uniqueItems` для `place.id`

**Source:** `incoming/arena-agent-karty-audit/2026-07-07/REPORT.md` §1 Finding KARTY-16
**Current source HEAD:** `75f807b73`

## Status: `proposal-open`

## Proposed severity: **P3** (preventive)

## Evidence

`karty/_shared/route.schema.json` (108 строк) — `grep "uniqueItems"` = 0.

`MapEngine.validateRoute()` (line 173) проверяет duplicate **в runtime**:
```js
if(ids.has(p.id))errors.push(`duplicate place id: ${p.id}`);
```

Но **schema** (которая валидирует route.json в build/CI) — нет.

## Repair lane

W1 (FAST).

## Suggested action

В `karty/_shared/route.schema.json`:

```json
{
  "places": {
    "type": "array",
    "minItems": 1,
    "uniqueItems": false,  // ← НЕ uniqueItems, т.к. уникальность по id, не по объекту
    "items": {
      "type": "object",
      "properties": {
        "id": { "type": "string", "minLength": 1, "pattern": "^[a-z0-9_-]+$" }
      },
      "required": ["id", "name", "x", "y"]
    }
    // Note: id uniqueness не покрывается JSON Schema 2020-12 без кастомного keywords.
    // Решение: ajv.addKeyword для unique-by-property
  }
}
```

Или в `scripts/check-karty-routes.js` (см. KARTY-10) добавить:
```js
const ids = new Set();
for (const p of data.places) {
  if (ids.has(p.id)) errors.push(`duplicate: ${p.id}`);
  ids.add(p.id);
}
```

## Do not mix with

- KARTY-09 (schema spec)
- KARTY-10 (validator)

---

**Owner decision:** нет
**LANE:** нет
**Estimated LOC:** ~10
**Можно одной PR** с KARTY-09, KARTY-10, KARTY-13
