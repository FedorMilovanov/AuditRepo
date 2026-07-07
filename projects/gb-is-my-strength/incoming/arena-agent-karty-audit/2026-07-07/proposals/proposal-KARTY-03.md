# Proposal: KARTY-03 — `avraam-app.js` 70 add / 0 remove, MAP-01 amplified

**Source:** `incoming/arena-agent-karty-audit/2026-07-07/REPORT.md` §1 Finding KARTY-03
**Current source HEAD:** `75f807b73`

## Status: `proposal-open`

## Proposed severity: **P2** (latent memory leak, becomes critical на длинных сессиях)

## Evidence

```
$ grep -c addEventListener    karty/avraam/avraam-app.js
70
$ grep -c removeEventListener karty/avraam/avraam-app.js
0
$ grep -c _cleanupAll         karty/avraam/avraam-app.js
0   ← НЕТ ВООБЩЕ!
```

В отличие от `map-engine.js`, где есть `_cleanupAll()` (lines 284-294), в `avraam-app.js` **даже нет аналога cleanup-функции**. Ни один из 70 listener'ов никогда не снимается.

## Related

- MAP-01 (P3) — подтверждение + upgrade до P2
- KARTY-06 — после рефакторинга avraam проблема исчезает
- KARTY-14 — touchstart/move/end в map-engine.js тоже не cleanup'ятся (sub-finding)

## Repair lane

W9 (sub-task к KARTY-06 — после миграции avraam-app.js в `_engine/` leak исчезает).

## Suggested action

1. **Краткосрочно (W1):** обернуть наиболее опасные listener'ы (window/document level) в guard'ы
2. **Долгосрочно (W9):** мигрировать avraam → `_engine/`, см. KARTY-06

## Do not mix with

- MAP-01 (там RESOLVED, это UPGRADE)
- KARTY-14 (отдельная touch-leak sub-finding)

---

**Owner decision:** нет (можно в W1 минимальный fix, W9 — основной)
**LANE:** нет для W1, да для W9
**Cross-agent:** arena-agent-6 (2026-06-25) подтвердил «70 listeners»
