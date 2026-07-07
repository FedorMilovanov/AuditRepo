# Proposal: KARTY-06 — «Вынести движок»: avraam-app.js → `_engine/`

**Source:** `incoming/arena-agent-karty-audit/2026-07-07/REPORT.md` §1 Finding KARTY-06
**Current source HEAD:** `75f807b73`

## Status: `proposal-open` (главный refactor в этом intake)

## Proposed severity: **P3** (refactor) — но **критический**, т.к. это основная работа владельца

## Evidence

- `karty/avraam/avraam-app.js` — 2407 строк, 247 KB
- 13 call-sites с inline-фallback'ами (см. `evidence/avraam-app-engine-fallbacks.txt`)
- `evidence/event-listeners.txt` — 4 функции (`getPlaceVisual`, `getRouteLayerId`, `getPlaceLayerId`, `isLayerOn`) определены ТОЛЬКО в avraam-app.js, не в engine

## Plan (детально в KARTY_AUDIT_2026-07-07.md §5)

### Phase 1: Engine extensions (владелец не нужен)
1. Добавить в `map-engine.js` Public API:
   - `getPlaceVisual(place) → {markerClass, cssColor, color}` (замена inline fallback)
   - `getRouteLayerId(place) → 'war'|'lot'|'abr'` (замена inline)
   - `getPlaceLayerId(place) → 'cand'|'lot'|'abr'`
   - `isLayerOn(LAYERS, id) → bool`
2. Bump version: 0.52.0 → 0.53.0

### Phase 2: Migration (владелец нужен, visual QA)
3. Перенести в engine:
   - `createAbrahamWalker` → `enableWalker(opts)`
   - `buildAmbient` / `changeAmbientChord` → `setAmbient(opts)`
4. Удалить из avraam-app.js:
   - `const PLACES = [...]` (полный дубль route.places)
   - `const STAGES = [...]` (полный дубль route.stages)
   - `const STORIES = [...]`
   - `const RELATED = {}`
   - `const LAYERS = [...]` (читать из route.layers)
   - `const CTX_PHOTOS = [...]` (читать из route.ctx)
   - `const WALKER_PHASES = [...]` (читать из route.timeline)
5. Все `addEventListener` обернуть в `_on()` или удалить (KARTY-03)

### Phase 3: HTML rewrite
6. `karty/avraam/index.html` → 78 строк (как `karty/ishod/index.html`)
7. Удалить GSAP + DrawSVG + MotionPath (KARTY-11) — заменить на нативные CSS/SVG анимации
8. Расширить CSP: убрать `cdn.jsdelivr.net` (больше не нужен)

### Phase 4: Cleanup
9. Удалить `karty/avraam/avraam-app.js` (2407 строк)
10. Удалить `karty/avraam/base.svg` (если заменён на `_engine/base-geo.svg`)

## Estimated result

- **Net LOC:** −2200 строк (удаление avraam-app.js) + ~300 строк (новые engine features) = **~−1900 строк**
- **Net size:** −247 KB (avraam-app.js) + ~10 KB (engine extensions) = **−237 KB**
- **Working routes:** 1 → 10 (после KARTY-01)

## Repair lane

**W9 — главный sub-lane: «avraam → engine migration»**

## Owner decision

- **Визуальный QA** на каждом этапе (Phase 2, Phase 3)
- **Acceptance** Walker/ambient анимаций (это уникальная фича avraam, не все маршруты хотят)

## Do not mix with

- KARTY-01..KARTY-15 — это всё **sub-tasks** этого proposal или параллельные
- W9 в целом (sub-task «karty-migration» внутри W9, не весь W9)

---

**Owner decision required:** да (visual QA + Walker/ambient scope)
**LANE required:** ОБЯЗАТЕЛЬНО (high-risk, multi-file, can break production)
**Estimated:** ~10 файлов, ~−1500 net строк
**Cross-agent:** новая находка, не duplicate
