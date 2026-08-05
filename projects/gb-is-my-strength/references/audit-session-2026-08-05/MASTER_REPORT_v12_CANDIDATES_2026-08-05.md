# MASTER-ОТЧЁТ v12 — SELF-AUDIT: 4 кандидата подтверждены + контракт strangler

**Дата:** 2026-08-05 · **Source main:** `3a05a1e7` · **Ветка:** `arena/019fd2bb-auditrepo` (открыта)

## 1. Кандидаты на закрытие — перепроверены на 3a05a1e7

| Строка | Evidence | Вердикт |
|---|---|---|
| ENGINE-P1-27 (Escape split) | `map-engine.js:3094` `closePhoto('escape');return` | ✅ код лучше |
| MAP-P1-06 (archaeology guard) | `map-engine.js:2532` `allowedTabs:['arch','sci']` guard | ✅ код лучше |
| QUAL-P1-09 (currentStatus) | 0 вхождений во всех route.json | ✅ код лучше |
| BASE-P1-03 (#22241f) | 0 вхождений в avraam/base.svg | ✅ код лучше |

Ни один из 4 не требует пересмотра — статус «кандидат на закрытие» подтверждён.

## 2. Новый контракт: strangler-legacy-duplicates

Добавлен COUNTER-CONTRACT: документирует, что проверка STRANGLER-HYGIENE обязана быть рекурсивной (find по подпапкам), а не только `*.html` в корне — закрывает дыру, из-за которой я ошибочно закрыл строку в v11.

## 3. Итог self-audit (полный)

- 5 уточнений: SEARCH-P2-07, NG-STRUCT-01, MAP-P1-11, AR-IDX-CSS-02, STRANGLER-HYGIENE (открыт!)
- 0 неверных корневых причин
- 10 контрактов работают
