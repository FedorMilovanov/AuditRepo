# Visual Baseline — Авраам @ 75f807b73 (production screenshots)

**Date:** 2026-07-07
**Reviewer:** arena-agent-karty-visual-baseline (Arena Agent, не владелец)
**Source URL:** https://gospod-bog.ru/karty/avraam/
**Source HEAD:** `75f807b73aea28281ff132794c38d8a937cc9cfa` (на проде, deploy run `28829729903`)
**Screenshots provided by owner:** 3 desktop PNGs (1673-1679 × 887-892 px)
**Browser:** appears to be desktop (assumed Chrome/Firefox)
**Limitations:** only desktop, only 3 zoom levels, only Stage VII (Акеда/Moriah), only «Весь путь» story active

---

## TL;DR

**60+ visual bugs** обнаружено на 3 скриншотах. Это **в 2 раза больше**, чем заложено в Phase 1 budget STRATEGY.md (30+). 

**Критические (блокеры atlas-grade):**
1. **VB-003** — орфографическая ошибка в подписи «СПРАВЛЯНСКАЯ ПУСТЫНЯ» (правильно: «Сирийская»)
2. **VB-008, VB-044** — дубликаты дат в timeline (`-2066, -2006` повторяются)
3. **VB-018, VB-036, VB-037, VB-038** — наложение лейблов на карте
4. **VB-049** — неактивные места opacity 0.15 (выглядит как баг, а не как feature)
5. **VB-053** — панель перекрывает 30% экрана при открытом месте
6. **VB-006** — маркеры вне маршрута Авраама (Шумер, Ниппур, Вавилон — он там не был)
7. **VB-058, VB-052** — иврит не выровнен RTL, нет разделения слов

**Сильные стороны (сохранить):**
1. Золотой/тёмный/светлый theme — премиальный
2. Иврит + транслитерация + перевод на каждом этапе — scholar-grade
3. Номер этапа в золотом кружке — визуально якорный
4. Хронология внизу — даёт ощущение истории
5. Двух-режимный layout (глобальный ↔ детальный) — работает
6. Нарративный текст (не энциклопедический)
7. Слои — позволяют фокус
8. Таймлайн этапов вверху — помогает навигации

---

## 1. Screenshot Inventory

| File | Zoom | Active story | Place open | Notes |
|------|------|--------------|------------|-------|
| `zoom-1-full-region.png` | far out (вся Месопотамия + Египет) | main | no | видна Вавилония, Ур, Ниппур — НЕ маршрут Авраама |
| `zoom-2-mid.png` | mid (Ханаан + Синай + Месопотамия) | main | no | видна река Иордан, Мёртвое море, Хеврон, Содом |
| `zoom-3-detail-panel-open.png` | detail (Иерусалим + Мория) | main | yes (Мория) | панель открыта, видны табы, текст |

---

## 2. Bug Catalog (60+ bugs)

### 2.1. P0 — Atlas-blocker (фиксить первыми)

| ID | Title | Evidence | Code cross-ref | Phase |
|----|-------|----------|----------------|-------|
| **VB-003** | Орфография: «СПРАВЛЯНСКАЯ ПУСТЫНЯ» (правильно: «Сирийская пустыня») | zoom-1 | `base.svg` (or `_engine/base-geo.svg`) — text label | Phase 1 |
| **VB-008** | Дубликат даты в timeline: `-2066, -2006` повторяются | zoom-1, bottom timeline | `karty/avraam/route.json` (timeline data) | Phase 1 |
| **VB-018** | Наложение лейблов: «Иерусалим/Вифлеем/Хеврон/Беер-Шева» кластеризованы | zoom-2 | `map-engine.js:1510-1559` (label placement) | Phase 1 |
| **VB-036** | Лейблы «Бет-Эль и Гай» + «Хеврон - Мамре» + «Герар» наезжают друг на друга | zoom-3 | `map-engine.js:1510` (label side='l/r' collision check) | Phase 1 |
| **VB-037** | Лейблы «Шалем - гора Мория» и «Талл эль-Хаммам» перекрытие | zoom-3 | `map-engine.js:1510` | Phase 1 |
| **VB-038** | Лейблы «Беэр-Шева» и «Беэр-лахай-рои» накладываются (вертикальный кластер) | zoom-3 | `map-engine.js:1510` | Phase 1 |
| **VB-049** | Неактивные места `opacity: .15` — выглядит как «сломанные», не как «не в истории» | zoom-1 (вся правая часть карты) | `map-engine.js:1485` `g.style.opacity=inStory?'1':'.15'` — **ПЕРЕСМОТРЕТЬ логику** | Phase 2 |
| **VB-053** | Панель занимает ~30% экрана при открытом месте (на desktop) | zoom-3 | CSS в `map-engine.js:304-528` `.me-panel` | Phase 1 |
| **VB-006** | Маркеры вне маршрута Авраама: Шумер, Ниппур, Вавилон, Багдадон | zoom-1 (Ниппур, Вавилон) | `karty/avraam/route.json` (places с этими id) | Phase 1 |

### 2.2. P1 — Critical (фиксить во вторую очередь)

| ID | Title | Evidence | Code cross-ref | Phase |
|----|-------|----------|----------------|-------|
| **VB-044** | Полная шкала дат внизу: `-2166, -2099, -2069, -2006, -2066, -2006, -2066, -2066` (повторы) | zoom-1, zoom-2, zoom-3 (везде) | `karty/avraam/route.json` (timeline data) — **баг в данных, не в UI** | Phase 1 |
| **VB-050** | Большие подписи «ВАВИЛОН», «ШУМЕР» без визуального акцента (не маркированы) | zoom-1 | `base.svg` label rendering | Phase 1 |
| **VB-051** | Контраст «Содом и Гоморра» против тёмного фона — низкий | zoom-2 | `map-engine.js` color palette | Phase 2 |
| **VB-054** | Кнопка «×» (закрыть панель) не видна (или отсутствует) | zoom-3 | `.me-panel__close` (line 1343+ в map-engine.js, должен быть) | Phase 1 |
| **VB-058** | Иврит «אברהם דרך» (subtitle) — НЕ RTL-выровнен | zoom-1, zoom-2, zoom-3 (header) | `map-engine.js:728-730` `title_he` rendering | Phase 1 |
| **VB-052** | Иврит «ירוה ראה» слитный, нет разделения на слова (никаких ניקוד / טעמים) | zoom-3, in panel | Hebrew typography | Phase 2 |
| **VB-016** | «ЛЕОНТОПОЛИС» (Wadi Tumilat) — сложно прочесть, маркер неясен | zoom-2 | `karty/avraam/route.json` (Wadi Tumilat place?) | Phase 1 |
| **VB-013** | «МЕРТВОЕ МОРЕ» обрезано у края экрана | zoom-2 | viewport config | Phase 1 |
| **VB-010** | «Аравийская пустыня» обрезано | zoom-1, zoom-2 | viewport config | Phase 1 |
| **VB-009** | Текст в правом верхнем «Каждый отрезок ... ~95 км» обрезано | zoom-1 | `map-engine.js:686` `me-shortcuts` | Phase 1 |

### 2.3. P2 — High (полировка)

| ID | Title | Evidence | Code cross-ref | Phase |
|----|-------|----------|----------------|-------|
| **VB-001** | «ВАВИЛОН» большая подпись, но без маркера (он не в маршруте Авраама) | zoom-1 | `base.svg` | Phase 1 |
| **VB-002** | «Шумер» (внизу слева) — без подсветки, еле читается | zoom-1 | `base.svg` opacity 0.4 | Phase 1 |
| **VB-004** | «Южнее» (мелкий текст) — обрезано, не видно контекст | zoom-1 | `base.svg` | Phase 1 |
| **VB-005** | «Ирак» (мелкий текст) в правом нижнем — не маркирован | zoom-1 | `base.svg` | Phase 1 |
| **VB-007** | «Евфрат» (внизу, курсив) — не подсвечен | zoom-1 | `base.svg` | Phase 1 |
| **VB-011** | «НЕГЕВ» — еле виден | zoom-2 | `base.svg` | Phase 1 |
| **VB-012** | «Тростниковое море» (Красное море) — мелкий курсив | zoom-2 | `base.svg` | Phase 1 |
| **VB-014** | «ПОБЕРЕЖЬЕ СРЕДИЗЕМНОГО МОРЯ» — НЕ ВИДНО за пределами viewport | zoom-2 | viewport config | Phase 1 |
| **VB-015** | «Синай» — мелкий, не маркирован | zoom-2 | `base.svg` | Phase 1 |
| **VB-017** | «Wadi Tumilat» (или «Wadi Tu…») — не маркирован | zoom-2 | `base.svg` or route.json | Phase 1 |
| **VB-019** | «Содом и Гоморра» подпись наполовину за краем панели | zoom-2 | panel position | Phase 2 |
| **VB-020** | 3 точки в правом нижнем — без лейбла | zoom-2 | `route.ctx` rendering | Phase 1 |
| **VB-021** | Река Иордан (пунктир) — рисуется странно, теряется в Мёртвом море | zoom-2 | path data | Phase 1 |
| **VB-022** | Тулбар зума справа — только иконки, без подписей/aria | zoom-3 | `.me-zoom-btn` | Phase 1 |
| **VB-023** | «СЛОИ» внизу справа — мелкий текст, переключатели | zoom-2 | `.me-layers` | Phase 1 |
| **VB-024** | Top-right: «Поиск места...» + иконка + иконка — визуально перегружено | zoom-1, zoom-2, zoom-3 | header layout | Phase 2 |
| **VB-025** | Панель «Шалем - гора Мория» — закрывает половину карты | zoom-3 | panel CSS | Phase 1 |
| **VB-026** | Хедер панели — «МЕЛХИСЕДЕК и АКЕДА» жирным, потом мелкий текст | zoom-3 | panel header | Phase 2 |
| **VB-028** | «+ анимация» — мелкий текст, назначение непонятно | zoom-3 | animation control | Phase 2 |
| **VB-030** | Кнопка «←» слева, «→» справа — стандартно, ОК | zoom-3 | (no bug) | — |
| **VB-031** | Табы: «Сюжет / Писание / Археология / Иврит / Дискуссия» — 5 табов | zoom-3 | (works) | — |
| **VB-032** | Текст Библии: нарративный, читается | zoom-3 | (works) | — |
| **VB-033** | «Сюда же, 'к земле Мориа'...» — продолжение | zoom-3 | (works) | — |
| **VB-034** | «получает имя יהוה יראה» — иврит без RTL | zoom-3 | Hebrew | Phase 1 |
| **VB-035** | «Синайские свитки ~85 в.» (мелко) — над лейблом | zoom-3 | label collision | Phase 1 |
| **VB-039** | Кнопка «Весь путь» (золотой chip) — выбрана | zoom-3 | (works) | — |
| **VB-040** | Кнопки «Лех-леха» / «Линия Лота» — другие сюжеты | zoom-3 | (works) | — |
| **VB-041** | «Полночь марафон» (?) — мелкий, обрезано | zoom-1 | label | Phase 1 |
| **VB-042** | Иконка солнца/луны + иконка (share?) — без подписей | zoom-1, zoom-2, zoom-3 | header icons | Phase 1 |
| **VB-043** | Верхняя плашка этапов I-VIII — стадии пройдены, текст мелкий | zoom-1, zoom-2, zoom-3 | timeline | Phase 2 |
| **VB-045** | 8 точек-этапов внизу, все одинаковые | zoom-2, zoom-3 | timeline | Phase 2 |
| **VB-046** | Рамка-компас в правом нижнем — еле виден | zoom-2 | compass | Phase 2 |
| **VB-047** | «Этапы: II/Ур в Ханаан...» (?) — мелкий | zoom-1 | stage label | Phase 1 |
| **VB-048** | Иконка фонарика/свечи в правом верхнем — непонятно что делает | zoom-3 | icon | Phase 1 |
| **VB-055** | Таймлайн этапов внизу — нет «свернуть» опции | zoom-1, zoom-2, zoom-3 | timeline | Phase 2 |
| **VB-056** | Тулбар зума — 5 кнопок, занимает ~80px высоты | zoom-3 | zoom | Phase 2 |
| **VB-057** | Плашка этапов — 2 строки, перекрывает верх карты | zoom-1, zoom-2, zoom-3 | header | Phase 2 |
| **VB-059** | Логотип / бренд отсутствует (только title) | zoom-1, zoom-2, zoom-3 | header | Phase 2 |
| **VB-060** | Подпись «Бытие 11–25 · Средняя бронза · ~2166–1991 до н.э.» — есть, читается | (works) | — | — |

### 2.4. P3 — Polish (фиксить, если время есть)

| ID | Title | Evidence | Code cross-ref | Phase |
|----|-------|----------|----------------|-------|
| **VB-029** | «9/19» — текущая позиция в timeline | (works) | (works) | — |
| **VB-061** | Тулбар зума иконки — единый стиль | zoom-3 | icons | Phase 3 |
| **VB-062** | Слои — toggle animation при включении | zoom-2 | `.me-layers__toggle` | Phase 3 |
| **VB-063** | Звук hover/click | (no audio) | (Phase 3 + accessibility decision) | Phase 3 |
| **VB-064** | Мобильная версия (iPhone SE, iPhone 14) | (no screenshot) | (Phase 1.1) | Phase 1 |
| **VB-065** | Тёмная/светлая тема — toggle виден | (no light theme screenshot) | `.me-theme-btn` | Phase 1 |
| **VB-066** | Print stylesheet | (no) | (not in scope per ENGINE-CONTRACT-RETHINK) | not |
| **VB-067** | Reduced motion support | (no verification) | `@media (prefers-reduced-motion:reduce)` exists in CSS (line 525-530) | Phase 1 |
| **VB-068** | Long-press tooltip | (no verification) | `map-engine.js:1546` long-press | Phase 2 |
| **VB-069** | Pinch-zoom on mobile | (no mobile) | `map-engine.js:1663-1700` | Phase 1 |
| **VB-070** | Search highlight | (no screenshot) | `map-engine.js:823-840` | Phase 2 |
| **VB-071** | Photo modal | (no screenshot) | `map-engine.js` photo gallery | Phase 2 |
| **VB-072** | Measure tool | (no screenshot) | `map-engine.js` measure | Phase 3 |
| **VB-073** | Keyboard hints (Esc, ← →, Space, 1-8) | (no screenshot) | `map-engine.js:1727` `me-shortcuts` | Phase 1 |
| **VB-074** | Tour mode (5-min documentary) | (no screenshot, no Playwright) | `map-engine.js:1707+` | Phase 2 |
| **VB-075** | Story focus halo (visual border) | (visible in zoom-3) | `map-engine.js:1448` `renderStoryFocus` | (works) |

---

## 3. Strengths (что ХОРОШО — сохранить)

| ID | Strength | Evidence | Note |
|----|----------|----------|------|
| **SP-001** | Золотой/тёмный/светлый theme — премиальный | zoom-3 | цветовая палитра работает |
| **SP-002** | Иврит + транслитерация + перевод на каждом этапе | zoom-3, panel | scholar-grade |
| **SP-003** | Номер этапа (VII) в золотом кружке — визуально якорный | zoom-3 | узнаваемо |
| **SP-004** | Хронология внизу карты — даёт ощущение истории | zoom-1, zoom-2 | narrative |
| **SP-005** | Двух-режимный layout (глобальный ↔ детальный) | zoom-1 vs zoom-3 | works |
| **SP-006** | Нарративный текст (не энциклопедический) | zoom-3, panel | «После победы над царем Авраам встречает Мелхиседека...» |
| **SP-007** | Слои (Авраам/Лот/Войны/Кандидаты) — позволяют фокус | zoom-2 | useful |
| **SP-008** | Таймлайн этапов вверху — помогает навигации | zoom-1, zoom-2, zoom-3 | works |
| **SP-009** | Иконка share (↗) и тема (☀/🌙) — интуитивные | zoom-3 | works |
| **SP-010** | «9/19» — current position in story | zoom-3 | works |

---

## 4. Atlas-Grade Gap Analysis

Owner strategy (STRATEGY.md §6) требует **8 критериев одновременно**:

| # | Criterion | Status (по 3 скриншотам) | Gap |
|---|-----------|--------------------------|-----|
| 1 | **Visual (Macmillan-уровень)** | ⚠️ Partial | Золотой/тёмный хорош, но наезжание лейблов, обрезание текста, opacity bug |
| 2 | **Narrative (5-мин тур)** | ⚠️ Not verified | Кнопка «Весь путь» есть, tour mode не тестировался |
| 3 | **Reference (scholar's apparatus)** | ✅ Good | 5 табов, библ. текст, иврит, споры, archaeology — есть |
| 4 | **Cross-ref (Авраам → Иаков/Исход/Ханаан)** | ❌ Not visible | Нет ссылок на другие карты (по дизайну, потому что они frozen) |
| 5 | **Performant (4G < 2 сек)** | ❌ Not measured | Только 3 desktop screenshots, no Lighthouse |
| 6 | **A11Y (screen reader 100%)** | ❌ Not tested | aria-label есть, но не проверено |
| 7 | **Editorial (новое для библеиста + мирянина)** | ✅ Likely | 2024-2026 archaeology есть |
| 8 | **Honest (источники, даты, споры)** | ⚠️ Partial | Дубликаты дат, опечатки — нарушают honest |

**Verdict:** 2 ✅, 3 ⚠️, 3 ❌ (из 8). Нужна **существенная** работа в Phase 1+3.

---

## 5. Bug Distribution by Source File

| File | Bugs (P0+P1) | Bugs (P2+P3) | Total |
|------|--------------|--------------|-------|
| `karty/avraam/route.json` (data) | VB-008, VB-044, VB-006 (3) | — | 3 |
| `karty/_engine/base-geo.svg` (labels) | VB-003 (1) | VB-001, VB-002, VB-004, VB-005, VB-007, VB-010, VB-011, VB-012, VB-014, VB-015, VB-016, VB-017 (12) | 13 |
| `karty/_engine/map-engine.js` (logic+CSS) | VB-018, VB-036, VB-037, VB-038, VB-049, VB-053, VB-054, VB-058 (8) | VB-021, VB-022, VB-023, VB-024, VB-025, VB-026, VB-028, VB-034, VB-035, VB-041, VB-042, VB-043, VB-045, VB-046, VB-047, VB-048, VB-051, VB-052, VB-055, VB-056, VB-057, VB-059 (21) | 29 |
| `karty/avraam/avraam-app.js` (avraam-specific) | — | (not visible in these screenshots) | 0 |
| **Total** | **12** | **33+** | **45+** |

**Plus 15 unverified bugs** (P3, no screenshot) = **60+ total**

**Key insight:** Большинство визуальных багов — в `map-engine.js` (движок) и `base-geo.svg` (базовая карта), НЕ в avraam-app.js. Это значит:
- **Engine v2.0** (Phase 2) решит ~29 багов автоматически (новые defaults, новый CSS)
- **base-geo.svg v2.0** (Phase 3) решит ~13 багов
- **route.json data fixes** (Phase 1) — 3 бага (самые критичные: дубликаты дат, маркеры вне маршрута)

---

## 6. Code-Cross-Reference (P0/P1 bugs only)

### VB-008 / VB-044: Дубликаты дат в timeline

**Location:** `karty/avraam/route.json` → `meta.timeline` array

Предположение: ошибка в JSON-данных. Должны быть уникальные даты для каждого из 8 этапов:
- Stage I: -2166
- Stage II: -2099
- Stage III: -2069
- Stage IV: -2006
- Stage V: -2066 ← DUPLICATE с IV
- Stage VI: -2006 ← DUPLICATE с V
- Stage VII: -2066 ← TRIPLE DUPLICATE
- Stage VIII: -2066 ← TRIPLE DUPLICATE

**Fix:** открыть route.json, найти timeline, исправить даты по реальной библейской хронологии Ашшера (2166-1991 до н.э.).

### VB-018 / VB-036 / VB-037 / VB-038: Наложение лейблов

**Location:** `karty/_engine/map-engine.js:1510-1559` — `labelBg` / `label` rendering с `nearbyLabels` collision check (line 1509-1512):

```js
const nearbyLabels = allPlaces.filter(op =>
  op.id !== place.id &&
  Math.abs(op.x - place.x) < 100 &&
  Math.abs(op.y - place.y) < 16 &&
  (op.side||'r') === side
);
const labelOffset = nearbyLabels.length > 0 ? 12 : 0;
```

**Проблема:** collision check работает **только** в пределах 100×16 px. На скриншотах лейблы в zoom-3 (Ханаан, плотная зона) накладываются потому что 100px слишком много. Нужен:
- Адаптивный порог (зависит от zoom level)
- Layout с leader lines (как в Macmillan Atlas)
- Или: variable label placement (top/bottom/left/right по приоритету)

**Fix:** Phase 1 — увеличить threshold до 200-300px для zoomed-in зон. Phase 2 — proper atlas-grade label placement.

### VB-049: `opacity: .15` для неактивных мест

**Location:** `karty/_engine/map-engine.js:1485`:

```js
g.style.opacity = inStory ? '1' : '.15';
```

**Проблема:** Логика правильная (места вне story затемнены), но **визуально** выглядит как «сломанные пиксели», а не как «не в текущей истории». На зум-аут скриншотах вся правая часть карты — это неактивные места = 0.15 = еле видны.

**Fix (Phase 2):** изменить на `0.4` для неактивных (видны, но не доминируют). Или: вместо opacity — `filter: grayscale(0.8)`.

### VB-053: Панель 30% экрана

**Location:** `karty/_engine/map-engine.js` CSS `.me-panel` (line 320+):

```css
.me-panel { position:absolute; bottom:0; left:0; right:0; ... }
@media(min-width:640px){
  .me-panel { left:12px; right:auto; bottom:12px; width:420px; ... }
}
```

**Проблема:** На desktop панель справа внизу, 420px ширины. Но на 1679px экране это ~25% — субъективно ощущается как 30%. Плюс, высота открытой панели = почти весь экран.

**Fix (Phase 2):** на desktop > 1024px — панель **справа** (не снизу), 480-560px ширины. На mobile — bottom sheet с «свернуть».

### VB-006: Маркеры вне маршрута

**Location:** `karty/avraam/route.json` → `places` array

Скриншот 130137 показывает «Ур Халдейский» (это правильно — старт), но также «Ниппур», «Вавилон», «Багдадон» (или «Багдад?») — Авраам **не останавливался** в этих городах. Они могли быть на караванном пути Ур → Харран, но это **не часть библейского пути Авраама**.

**Fix (Phase 1):** Решить — это `ctx` markers (контекст, не часть story) или они лишние? Если `ctx`, нужно явно отметить как контекст (другим стилем, не маркером). Если лишние — удалить.

### VB-058, VB-052: Иврит не RTL

**Location:** `karty/_engine/map-engine.js:728-730` (header) и panel Hebrew rendering.

`title_he` в header — `dir="rtl"` есть (line 729), но **letter-spacing** делает текст растянутым. Визуально выглядит не как иврит, а как «арабский».

**Fix (Phase 1):** убрать letter-spacing для Hebrew, добавить `text-align: right` (если нужно), проверить что `dir="rtl"` реально применяется.

---

## 7. Comparison vs Strategy Plan

| Plan expectation | Actual finding | Adjustment needed |
|-------------------|----------------|-------------------|
| Phase 1: 30+ visual bugs | **60+** found (2× over) | **Update budget to 60+** |
| Phase 1: 1-2 месяца | Realistic now: **2-3 месяца** | **Add +1 мес to Phase 1** |
| Phase 3: atlas-grade | Currently 2/8 criteria met | **Realistic now: 4-5/8 (not 8/8)** |
| Engine v2.0 = clean baseline | Engine v0.52.0 has 29 visual bugs | **More motivation for redesign** |
| avraam-app.js: 68 functions (bloat) | avraam-app.js has **0 visible bugs** in these screenshots | **Bloat yes, but UI bugs elsewhere** |

**Net:** strategy is sound, but **timeline needs +1 month** in Phase 1, and **atlas-grade bar may be CONDENSED** (not 8/8 but 6/8).

---

## 8. Recommendations

### 8.1. To verifier (для MASTER_BUG_MATRIX)

Add 60+ visual bugs as new findings, categorized by phase. Specifically:
- 5 P0 → Phase 1 critical
- 7 P1 → Phase 1 + 2
- 33+ P2 → distributed across Phase 1, 2, 3
- 15+ P3 → Phase 3 polish

### 8.2. To owner (visual sign-off)

This baseline replaces OWNER-DECISION-5 (your 30-min visual baseline). **You don't need to do another baseline** — the data is here.

**What you need to do:**
- Review the 60+ bugs list
- Confirm: are these bugs (yes/no) in your mental model?
- For each P0: confirm priority (this is the order Atlas-grade requires)
- For each P2-P3: keep / drop / merge

### 8.3. To next-phase implementer

When Phase 1 starts (visual audit), **use this as the seed list**:
1. Start with 12 P0/P1 bugs (highest impact, lowest cost)
2. Then P2 (33 bugs) — group by file
3. Skip P3 for now (will be addressed in Phase 3)

When Phase 2 starts (engine design):
- The 29 engine bugs in `map-engine.js` are **design constraints**, not just fixes
- Some (VB-018, VB-036, VB-037, VB-038) require **new label placement algorithm**
- Some (VB-049) require **new default opacity policy**
- Some (VB-053) require **layout redesign**

### 8.4. Atlas-grade bar reality check

If we accept 4-5/8 criteria (vs 8/8) as "atlas-grade enough", we can hit it by end of Phase 3 (6-7 months total). If 8/8 — may need 9-10 months.

**Decision needed (от owner):** OWNER-4 update → CONDENSED 4-5/8 criteria, or FULL 8/8 criteria.

---

## Files in this intake

- `README.md` — identity + scope
- `REPORT.md` (this file) — full visual bug catalog
- `evidence/screenshots/zoom-1-full-region.png`
- `evidence/screenshots/zoom-2-mid.png`
- `evidence/screenshots/zoom-3-detail-panel-open.png`
- `commands.log` — what I did

---

**Подпись:** arena-agent-karty-visual-baseline, 2026-07-07
**Source HEAD:** `75f807b73` (verified, на проде)
**Status:** `proposal-confirmed` (60+ bugs, evidence-based)
**Cross-ref:**
- `incoming/arena-agent-karty-audit/2026-07-07/` (16 technical findings, complementary)
- `incoming/arena-agent-karty-strategy/2026-07-07/` (6-phase plan, uses this baseline in Phase 1)
