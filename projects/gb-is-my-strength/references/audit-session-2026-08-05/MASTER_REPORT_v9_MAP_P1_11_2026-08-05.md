# MASTER-ОТЧЁТ v9 — SELF-AUDIT: MAP-P1-11 причина уточнена, остальные подтверждены

**Дата:** 2026-08-05 · **Source main:** `3a05a1e7` · **Ветка:** `arena/019fd2bb-auditrepo` (открыта)

---

## 1. MAP-P1-11 — причина УТОЧНЕНА (главная докопка)

**Было в моих отчётах:** «scale bar использует `cfg.W0 / view.w` вместо `canvasWidth / view.w` — ошибка масштаба».

**Полный контекст (проверено на 3a05a1e7, map-engine.js:1446-1451):**
```js
function updateScaleBar() {
  const pxPerKm = 1 / cfg.kmPerUnit;
  const screenPxPerKm = (cfg.W0 / view.w) * pxPerKm;   // ← константа W0=1900
  ...
}
```
- `cfg.W0 = 1900` — **константа** (базовая ширина мира);
- `view.w` — ширина viewBox (меняется при зуме);
- canvas рендерится `width:100%` → **renderedWidth** = ширина контейнера (390px mobile, ~1200 desktop);
- `renderedWidth` доступна (map-engine.js:1108 `canvas.getBoundingClientRect().width`) и используется в zoom-логике.

**Точная причина:** `screenPxPerKm` использует **константу W0=1900 вместо актуальной `renderedWidth`**. При viewBox-рендере правильная формула `(renderedWidth / view.w) * kmPerUnit`. Следствие:
- mobile 390px: масштаб врёт в **~4.9×** (1900/390);
- desktop 1200px: врёт в **~1.6×** (1900/1200);
- только при renderedWidth≈1900 (широкий десктоп) — совпадает.

**Вывод:** моя причина была верна по сути, но формулировка «canvasWidth вместо W0» неточна — точнее **«константа W0 вместо актуальной renderedWidth (getBoundingClientRect)»**. Это реальный баг (scale bar врёт на мобильном), не мелочь.

## 2. Остальные причины — подтверждены

| Строка | Проверка | Вердикт |
|---|---|---|
| TEXT-P1-01 (len*0.6) | `map-engine.js:2179` — точно | ✅ |
| MINI-P1-01 (minimap без гео) | 0 polygon/path в миникарте | ✅ |
| DATA-P1-04 (semantic zoom) | semanticZoomBucket ×3 | ✅ |
| RIVER-P1-02 | 0 def / 4 use в base-geo | ✅ |
| MAP-P1-20 | 2/2 html без `?v=` | ✅ |
| REG-P1-01 | 0 regions | ✅ |

## 3. Что это даёт

MAP-P1-11 — **единственная строка, где причина требовала уточнения** (не «canvasWidth», а «renderedWidth»). Остальные ~10 перепроверенных причин — верны. Self-audit подтверждает: ошибок в моих корневых анализах почти нет; точность формулировок улучшена для 3 строк (SEARCH-P2-07, NG-STRUCT-01, MAP-P1-11).

## 4. Рекомендация для матрицы

MAP-P1-11: формулировка остаётся «scale bar использует константу вместо актуальной ширины», но evidence уточнить: `map-engine.js:1447` `(cfg.W0/view.w)` при `W0=1900` и canvas `width:100%`; правильный источник — `canvas.getBoundingClientRect().width` (доступна :1108).

---

*Документ — untracked; будет добавлен в ветку коммитом.*
