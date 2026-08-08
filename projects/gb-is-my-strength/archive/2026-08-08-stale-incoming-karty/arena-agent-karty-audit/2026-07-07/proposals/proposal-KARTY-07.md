# Proposal: KARTY-07 — `window.MapEngine` global pollution

**Source:** `incoming/arena-agent-karty-audit/2026-07-07/REPORT.md` §1 Finding KARTY-07
**Current source HEAD:** `75f807b73`

## Status: `proposal-open`

## Proposed severity: **P3** (унаследованная, P2-17 уже подтвердил)

## Evidence

`karty/_engine/map-engine.js:2633`:
```js
if(typeof window!=='undefined')window.MapEngine=MapEngine;
if(typeof module!=='undefined')module.exports=MapEngine;
```

Без cleanup (instance.destroy() не удаляет global).

## Repair lane

W9 (sub-task к KARTY-06 — после миграции avraam проблема исчезает, т.к. avraam — единственный потребитель global).

## Suggested action

1. Phase 1: оставить global, но добавить `MapEngine.unmount = function() { delete window.MapEngine; }`
2. Phase 2 (W9): удалить global полностью, использовать ES modules

## Do not mix with

- P2-17 (уже в archive, RESOLVED-AS-CONFIRMED)

---

**Owner decision:** нет
**LANE:** нет для Phase 1, да для Phase 2
**Cross-agent:** arena-agent-6 (2026-06-25) подтвердил
