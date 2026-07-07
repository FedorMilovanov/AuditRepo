# Proposal: KARTY-04 — CSS движка инжектируется динамически, не кэшируется SW

**Source:** `incoming/arena-agent-karty-audit/2026-07-07/REPORT.md` §1 Finding KARTY-04
**Current source HEAD:** `75f807b73`

## Status: `proposal-open`

## Proposed severity: **P2** (perf + cache invalidation)

## Evidence

- `karty/_engine/map-engine.js:303-528` — ~8KB inline CSS
- Создаётся в DOM как `<style id='me-base-css">` на каждом `createMap()`
- Удаляется в `_cleanupAll()` (line 290) — НО при hot-reload (F5) идут повторные инжекции
- `audit-pro.js ALLOWED_CSS` НЕ покрывает `me-base-css` (динамический ID)

## Cross-ref

Уже сделано в `57d1b3c7` (commit от 2026-07-03): "feat(perf+sec+a11y): CSS-in-JS extraction, target=_blank noopener, Yandex preconnect, decoding=async":
> - Extract 2.2KB CSS from enhancements.js → css/enhancements-runtime.css
> - Extract 5.3KB CSS from highlights.js → css/highlights-runtime.css
> - Both files now load via <link> with cache-bust instead of inline injection

**Но для map-engine.js это НЕ сделано.** Аналогичный fix, ~8KB CSS, тот же подход.

## Repair lane

**W7 — CSS extraction** (синхронно с enhancements/highlights паттерном).

## Suggested action

1. Создать `karty/_engine/css/map-engine.css` (~8KB)
2. В `createMap()`:
   - Заменить `if(!document.getElementById('me-base-css')){ ...appendChild(css) }` на проверку `<link rel="stylesheet" href="/css/map-engine.css?v=HASH">`
3. Добавить в `audit-pro.js ALLOWED_CSS`
4. Добавить в `sw.js PRECACHE_ASSETS`
5. Удалить блок CSS из map-engine.js (lines 303-528)

## Do not mix with

- W7 enhancements/highlights (уже сделано)
- KARTY-06 (это про JS-рефактор, тут CSS)

---

**Owner decision:** нет
**LANE:** нет (FAST, isolated change)
**Estimated LOC:** ~50
