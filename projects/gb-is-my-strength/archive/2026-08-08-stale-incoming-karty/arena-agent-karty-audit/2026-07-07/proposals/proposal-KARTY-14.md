# Proposal: KARTY-14 — touchstart/touchmove/touchend в `map-engine.js` не очищаются

**Source:** `incoming/arena-agent-karty-audit/2026-07-07/REPORT.md` §1 Finding KARTY-14
**Current source HEAD:** `75f807b73`

## Status: `proposal-open`

## Proposed severity: **P3** (latent leak)

## Evidence

`karty/_engine/map-engine.js:1663-1700`:
```js
canvas.addEventListener('touchstart', e => { ... });   // line ~1663
canvas.addEventListener('touchmove', e => { ... });    // line ~1680
canvas.addEventListener('touchend', e => { ... });     // line ~1698
```

Все 3 — прямые `addEventListener`, **не через `_on()`**. Поэтому `_cleanupAll()` (line 284) их **не удаляет**.

`pointerdown/pointermove/pointerup` (line 1592-1605) — через `_on()`, OK.

## Repair lane

W9 (sub-task к KARTY-06).

## Suggested action

Заменить на:
```js
_on(canvas, 'touchstart', e => { ... });
_on(canvas, 'touchmove', e => { ... });
_on(canvas, 'touchend', e => { ... });
```

После замены `_cleanupAll()` будет корректно их снимать.

## Do not mix with

- MAP-01 (там P3 generic, тут sub-finding)
- KARTY-03 (там avraam-app, тут map-engine)

---

**Owner decision:** нет
**LANE:** да (W9 sub-task)
**Estimated LOC:** 3 строки изменения
