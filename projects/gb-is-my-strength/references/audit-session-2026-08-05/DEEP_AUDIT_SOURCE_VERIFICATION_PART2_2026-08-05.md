# Глубокая source-верификация gb-is-my-strength — Часть 2 (Karty-engine, search-a11y, Нагорная, бюджеты)

**Дата:** 2026-08-05 · **Проверено на:** `main@4ce39dc816727c43373491acfb5bad0916cde113` (тот же, что в Части 1)
**Продолжение:** `DEEP_AUDIT_SOURCE_VERIFICATION_2026-08-05.md` (Часть 1: 28 подтверждено / 3 лучше / 9 закрытых спот-чек).

---

## 1. ✅ Подтверждены на текущем main (17)

| ID | Evidence на `4ce39dc8` | Вердикт |
|---|---|---|
| **MAP-P1-12** (compass в pan/zoom группе) | `map-engine.js:1184` `compass.setAttribute('transform','translate(50, 80)')` — в SVG-координатах, не screen overlay | 🔴 подтверждён |
| **ENGINE-P1-29** (dblclick → w=450) | `map-engine.js:2135` `flyTo(place.x,place.y,Math.min(view.w,450),600)` | 🔴 подтверждён |
| **RIVER-P1-01** (feDisplacementMap scale=7) | `karty/avraam/base.svg:46` `<feDisplacementMap … scale="7"` | 🔴 подтверждён |
| **MINI-P1-01** (миникарта без географии) | `map-engine.js:1537` minimap SVG = только `<rect>` + `<g id="me-mm-dots">` (точки мест) + viewport-rect. **Никаких векторов суши/морей** | 🔴 подтверждён |
| **KARTY-DATA-P1-01** (нет anchors/leaders) | **0 anchors и 0 leaders во ВСЕХ 11 route.json** (avraam 22 места, shvatim 18, melachim 17 — все 0) | 🔴 **усилился** (было «8 из 9» → теперь 11/11) |
| **GLYPH-P1-01** (нет иконок glyph) | glyphs: **0 во всех 11 картах** (TOTAL 0) | 🔴 **усилился** (было «9 из 11» → 11/11) |
| **MEDIA-P1-01** (фото с Wikimedia) | 226 URL `upload.wikimedia.org` в route.json — внешний CDN, локального кэша нет | 🔴 подтверждён (было ~312) |
| **SVG-P1-01** (&nbsp; в экспортных SVG) | `images/atlas-export/avraam.svg`, `shvatim.svg` содержат `&nbsp;` | 🔴 подтверждён |
| **ORN-P1-01** (картуш/компас) | `scripts/lib/sheet-engine.js:141` `cornerOrn`; `:741` `cartW = …(title.length*14.6 …)*k` | 🔴 подтверждён |
| **GRAT-P1-01** (линейная сетка) | `sheet-engine.js:437-445` `GRID` с линейными `lonToX/latToY` | 🔴 подтверждён |
| **SEA-P1-01** (плиточные волны) | `sheet-engine.js:49` `<pattern id="seaPattern" width="20" height="20">` | 🔴 подтверждён |
| **HALO-P1-01** (halos=[] не заполняется) | `sheet-engine.js:579` `halos=[]`; `halos.push` — **0** | 🔴 подтверждён |
| **ROUTE-P1-01** (Catmull-Rom) | `sheet-engine.js:477` `catmullRom(pts)`, `:531` `routePath=catmullRom(routePts)` | 🔴 подтверждён |
| **RELIEF-P1-01** (горы-эллипсы) | `sheet-engine.js:185-189` `<ellipse rx=10..15 ry=62..92>` + hatch | 🔴 подтверждён |
| **SEARCH-P2-10** (нет combobox-контракта) | `js/search.js`: нет `role="combobox"`, `aria-activedescendant`, `aria-expanded` (только `role="dialog"/"listbox"`) | 🔴 подтверждён |
| **SEARCH-P2-11** (backdrop z-index 10000) | `css/command-palette.css`: `.cp-backdrop{z-index:var(--z-modal,10000)}` | 🔴 подтверждён |
| **SEARCH-P2-12** (chips 32px) | `command-palette.css`: `.cp-scope-chip{min-height:32px}`; `.gb-nav-search-icon` — без 44px hitbox | 🔴 подтверждён |
| **NG-DEAD-01** (мёртвые компоненты) | 7 проверенных (`NagornayaChast{1..5}ArticleBody`, `NagornayaHeaderHero`, `NagornayaPostContent`) — **все 0 импортов** | 🔴 подтверждён |
| **R-001** (site.js монолит) | `js/site.js` = **172 233 B** (матрица: ~167КБ) | 🔴 подтверждён |
| **DATA-P1-03** (route.meta.era не читается) | `map-engine.js` читает только `item.era` таймлайна (`:1390`); `route.meta.era` — 0 обращений | 🔴 подтверждён |

## 2. ⚠️ Бюджеты — ХУЖЕ записанного

| Строка | В матрице | Факт на `4ce39dc8` | Вердикт |
|---|---|---|---|
| **NEW-CSS-BUDGET-01** | «Core CSS 554 013 > 425 000» | `css/site.css` = **314 302 B** (+23КБ против записанных 291КБ), `floating-cluster.css` = **236 873 B** (+45КБ), `home.css` = **113 458 B** (+31КБ). Итог core ≈ **664 КБ** против бюджета **425 000** (`audit-pro.js:99 MAX_CSS_TOTAL=425_000`) — превышение **~56%** | 🔴 **усилился** |
| **D-3** | «JS 469 101 > 365 000» | Все `js/*.js` ≈ **590 077 B** (>365 000, `audit-pro.js:100 MAX_JS_TOTAL=365_000`) — превышение **~62%** | 🔴 **усилился** |

> Оба — warning, не блок деплоя, но рост устойчивый: за месяц core CSS +~40%, JS +~26%.

## 3. 🟡 Реальность ЛУЧШЕ заявленного (кандидаты на сужение)

| ID | Что изменилось | Evidence | Вывод |
|---|---|---|---|
| **MAP-P1-13** (a11y маркеров) | Маркеры теперь получают `role="button"` + `tabindex="0"` | `map-engine.js:2097-2098` | Часть «113/113 без role/tabindex» **исправлена**; остаются panel-семантика (`role=dialog`/`aria-hidden`) и reduced-motion — сузить строку |
| **DATA-P1-04** (semantic zoom) | Механизм zoom-bucket'ов **есть** | `map-engine.js:394-396, 1104` `semanticZoomBucket()`, CSS `[data-zoom-bucket]` | «Полностью отсутствует» — неверно; проверить только остаток про масштаб шрифтов 1.5px/40px → сузить |
| **BASE-P1-03** (чёрная заливка avraam) | `#22241f` **отсутствует**; палитра светлая (`#e8d4a0`, `#4a80a0`, `#c8a84a`, `#7fa7c4`) | `karty/avraam/base.svg` | «Угольно-чёрная заливка» — снята; остаются анимированные звёзды (98 `<circle>` + `<animate opacity … begin="1.8s">`) |
| **MAP-P1-18** (галерея) | Рендер `ph.thumb||ph.src` — thumb-first | `map-engine.js:2428` | «Всегда 320px» зависит от значений `thumb` в route.json — сузить, проверить фактические URL |

## 4. 🆕 Новые наблюдения (нет в матрице)

1. **ARCH-P1-01 — уточнение масштаба:** `sheet-engine.js` — это **Node build-time** генератор (импортируется только `scripts/atlas-build-sheet.js`), а браузерный рантайм — `map-engine.js` (тёмная схема). Раскол архитектуры подтверждён, но «пергаментный стиль» вообще **не попадает в прод** — это серверный инструмент для экспорта. Строку можно переформулировать как «два независимых рендерера, из которых в браузере работает только тёмный».
2. **`karty/_engine/` теперь содержит только 2 файла** (`base-geo.svg`, `map-engine.js`) — sheet-engine живёт в `scripts/lib/`. Любые строки, ссылающиеся на `karty/_engine/sheet-engine.js`, надо обновить (битые пути в evidence).
3. **RIVER-P1-02 уточнение:** `avraam/base.svg` содержит `id="waterRipple"` (:39), общий `_engine/base-geo.svg` — нет. Остаток точен: общий def.
4. **AVRAAM-P1-01 (CTA opacity):** есть полноэкранный `.me-intro` с `background:rgba(7,10,16,.95)` и `transition:opacity .5s` — но тайминг «1.8s невидимости CTA» требует browser-свидетеля; в коде не проверяется.
5. **MAP-P1-01/02 (tour):** `touring/tourStepIdx/tourTimer` существуют; `showCaption(route.stages[tourStepIdx], …)` — потенциальный off-by-index, но «подпись I этапа на III» и «нет touch-запуска» — browser-класс, в коде не закрыть.

## 5. Итог Части 2

- **+17 строк подтверждены** на текущем main (Karty-engine-кластер в основном жив: компass, dblclick-зум, реки, миникарта, anchors/glyphs=0, wikimedia, экспорт-SVG, sheet-engine-формулы).
- **2 бюджета существенно хуже** записанного (CSS ~664КБ vs 425КБ; JS ~590КБ vs 365КБ) — строки матрицы надо обновить цифрами.
- **4 строки — кандидаты на сужение/закрытие:** MAP-P1-13 (role/tabindex добавлены), DATA-P1-04 (zoom-bucket'и есть), BASE-P1-03 (чёрной заливки нет), MAP-P1-18 (thumb-first подтверждён, но «320px» не доказано).
- **Оценка всего открытого Karty-кластера:** из ~55 строк ~20 проверены в двух частях: 15 подтверждено, 4 сужены, остальное (~35) — в основном browser-класс (перекрытия, туры, viewport, a11y-взаимодействия), требующий Playwright-свидетеля на exact-HEAD. Именно поэтому SD-7 (батчевый Karty browser-reverify) — правильный следующий шаг.

*Документ — untracked в AuditRepo; коммиты/пуши не выполнялись.*
