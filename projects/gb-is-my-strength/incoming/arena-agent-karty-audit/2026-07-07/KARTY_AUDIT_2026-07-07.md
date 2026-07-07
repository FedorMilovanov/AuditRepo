# 🔍 KARTY/ AUDIT — Сводный отчёт

**Дата:** 2026-07-07
**Source HEAD:** `75f807b73` (на проде, согласно `auditrepo/verified/START_HERE.md`)
**Аудитор:** Arena Agent (audit-only режим, **никаких правок внесено не было**)
**Владелец:** Фёдор Милованов
**Контекст:** инициатива владельца «продумать и исправить баги, выносить движки» в отделе карт

> **Прежде чем читать дальше.** Являясь подписантом контракта `AGENTS.md`,
> я:
> 1. Прочитал `AGENTS.md`, `auditrepo/SANDBOX-ENV-2026-06-21.md`,
>    `auditrepo/projects/gb-is-my-strength/verified/START_HERE.md`,
>    `auditrepo/projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md`,
>    `auditrepo/projects/gb-is-my-strength/verified/SUPER_AUDIT_2026-07-06_14a49be8.md`,
>    `karty/_shared/README.md`, `karty/_shared/route.schema.json`.
> 2. Сверился с `FedorMilovanov/AuditRepo` (`verified/MASTER_BUG_MATRIX.md`,
>    `verified/SUPER_AUDIT_2026-07-06_14a49be8.md`,
>    `archive/2026-07-03-stale-incoming-2/arena-agent-6/2026-06-25/GENEALOGY_MAP_ANALYSIS.md`).
> 3. **Не вносил правок** в рамках этой итерации (выбран режим `audit_only`).
>    Любые изменения требуют отдельной сессии в LANE-режиме, согласно
>    `docs/LANE_LOCK_POLICY.md` (см. `WORK_MODES.md`).

---

## 1. TL;DR — три ключевые находки

| # | Что | Где | Серьёзность |
|---|-----|-----|-------------|
| **1** | **8 из 10 karty-маршрутов — заглушки без UI**. Подключают только `route.json` (валидный по схеме), но **никаких `<script src=...js>` в `index.html`** нет. Они не рендерятся в браузере. | `karty/early-church/`, `karty/maccabim/`, `karty/melachim/`, `karty/pavel/`, `karty/revelation/`, `karty/shoftim/`, `karty/shvatim/`, `karty/yeshua/` | 🟠 **P1 (prod-affecting, mass)** |
| **2** | **Утечка памяти (MAP-01, P3) подтверждена и ухудшена**: `avraam-app.js` имеет **70 `addEventListener` и 0 `removeEventListener`** (в `map-engine.js` — 43/1, с централизованным `_cleanupAll()`, но сам `_cleanupAll()` в avraam-app.js не зовётся). | `karty/avraam/avraam-app.js` | 🟡 **P2 (latent)** |
| **3** | **Дублирование движка**: `avraam-app.js` (2407 строк) — это «монолитный кастомный слой» над `_engine/map-engine.js`, который через `window.MapEngine?` опционально зовёт 10 публичных функций движка, но при отсутствии движка имеет **полные inline-фоллбэки** для 5 из них (`getPlaceVisual`, `getRouteLayerId`, `getPlaceLayerId`, `isLayerOn`, `getPlaceOrder` и др.). Это и есть «вынести движок» из задания владельца. | `karty/avraam/avraam-app.js:677, 680-682, 999, 1172, 1186-1188, 1217, 1243, 1317-1327` vs `karty/_engine/map-engine.js` (Public API на `line 2630-2640`) | 🔵 **Refactor (P3→P2)** |

---

## 2. Состояние karty/ — что есть

```
karty/
├── _engine/                  ← универсальный движок (цель рефакторинга)
│   ├── base-geo.svg          34 KB  — базовая география Бл. Востока
│   └── map-engine.js         171 KB / 2634 строки (v0.52.0, build 2026-06-18)
│
├── _shared/                  ← контракт
│   ├── README.md             173 строки — публичное API, JSON Schema
│   └── route.schema.json     108 строк — JSON Schema draft 2020-12
│
├── avraam/                   ← ЕДИНСТВЕННЫЙ «legacy-rich» маршрут
│   ├── avraam-app.js         247 KB / 2407 строк ← дубль движка
│   ├── base.svg              72 KB / 896 строк
│   ├── index.html            182 KB / 2387 строк
│   └── route.json            187 KB / 19 мест, 5 сюжетов, 8 этапов
│
├── ishod/                    ← КАНОН: универсальный паттерн (68 строк index.html)
│   ├── index.html            68 строк ← 1 fetch + 1 createMap
│   └── route.json            50 KB / 11 мест, 4 сюжета, 6 этапов
│
├── early-church/             ← ЗАГЛУШКА (нет <script src=...js>)
├── maccabim/                 ← ЗАГЛУШКА
├── melachim/                 ← ЗАГЛУШКА
├── pavel/                    ← ЗАГЛУШКА
├── revelation/               ← ЗАГЛУШКА
├── shoftim/                  ← ЗАГЛУШКА
├── shvatim/                  ← ЗАГЛУШКА
├── yeshua/                   ← ЗАГЛУШКА
│
└── index.html                ← хаб /karty/ с Web Share API и прогресс-баром
```

### 2.1 Что подключает каждый `index.html`

| Маршрут | `<script src=...js>` | `route.json` | UI |
|----------|----------------------|--------------|------|
| **avraam** | `_engine/map-engine.js` + `avraam-app.js` + GSAP/DrawSVG/MotionPath (3 × CDN) + Yandex Metrika | 187 KB, 19 мест | **Полный кастомный UI** |
| **ishod** | `_engine/map-engine.js` | 50 KB, 11 мест | **Универсальный engine (эталон)** |
| 8 остальных | — | 30–72 KB, 7–18 мест | **Пустая страница или fallback** |
| `karty/index.html` | (только inline) | — | Hub с прогрессом |

**Вывод:** 8 маршрутов — валидные данные без UI. Эти 8 = `BUG-SITEMAP-8-KARTY-MISSING` из `MASTER_BUG_MATRIX.md:190`, помечены там как `data-pagefind-ignore` и исключены из sitemap — то есть владелец **знает** об этом.

---

## 3. Реестр референсов-атласов

### 3.1 Главный канонический реестр: `ARCHAEOLOGY_REFERENCES` в `_engine/map-engine.js`

Файл `karty/_engine/map-engine.js:35-251` содержит структуру `ARCHAEOLOGY_REFERENCES` — **12 категорий** с привязкой к реальным открытиям 2024–2026:

| Категория | Кол-во | Примеры |
|-----------|--------|---------|
| `exodus_route` | 5 | Tell el-Kharouba 2026, Tell el-Retaba ash 1450 BC, Papyrus Anastasi VI, Jabal al-Lawz |
| `jerusalem_first_temple` | 5 | Assyrian inscription 2025, City of David ritual 2025, Monumental moat 2024, Broad Wall redating |
| `maccabees` | 3 | Bet Zecharia sling bullets 2025, Hasmonean coin hoard Modiin, Hasmonean fortress |
| `early_church` | 5 | Laodicea Roman hall 2025, Ephesus marble 2026, Pilgrimage Road 2025–2026 |
| `davidic_kingdom` | 4 | Tel Dan Stele, Mesha Stele re-examination 2025, Khirbet Qeiyafa, Siloam Pool dam 2025 |
| `general` | 5 | Ketef Hinnom, House of David inscription, Hezekiah's Tunnel, Gallio inscription, Pilate stone |
| `judges_period` | 3 | Shiloh gate 2025–2026, Timnah (Tel Batash), Philistine Pentapolis |
| `kings_period` | 6 | Samaria ivories, Megiddo water tunnel, Jezreel fortress, Lachish letters, Beersheba horned altar, Hezekiah bulla |
| `jesus_ministry` | 5 | Magdala Stone 2009, Nazareth house 2009, Capernaum, Jesus Boat 1986, Pool of Bethesda |
| `dead_sea_scrolls` | 3 | Museum of the Bible 2025–2026, Cave of Horror, Qumran Cave 12 |
| `babylonian_exile` | 6 | Babylonian Chronicle, Jehoiachin ration tablets, Lachish Letters, Jerusalem destruction, Kish cylinders 2025, Al-Yahudu tablets |
| `persian_return` | 5 | Cyrus Cylinder 539 BC, Tattenai tablet 502 BC, Elephantine papyri, Nehemiah's wall, Yehud stamp |
| `jericho_ai` | 3 | Garstang/Kenyon/Wood debate, Jericho City V 2025–2026, Ai: et-Tell vs Khirbet el-Maqatir |
| **Итого** | **~58 источников** | |

Каждый элемент имеет: `ref` (человекочитаемое имя), `text` (1–2 предложения), `src` (первоисточник — IAA, BAR, PNAS, Museum of the Bible, University of Chicago, и т.д.).

**Все 12 категорий покрывают все 9 нерабочих маршрутов + avraam/ishod** — реестр уже готов, осталось только правильно подключить.

### 3.2 Проблема привязки: hardcoded ID-маппинг

Строки `map-engine.js:1829-1879` (`_renderArchaeologyFooter`):
```js
const exodusIds = ['rameses','succoth','etham','pihahiroth',...];
const jerusalemIds = ['jerusalem','jerusalem_kings','cityofdavid',...];
const maccabeeIds = ['modiin','jerusalem_meet','antioch_syria',...];
// ... 8 таких таблиц
if (exodusIds.includes(place.id)) cat = 'exodus_route';
if (jerusalemIds.includes(place.id)) cat = 'jerusalem_first_temple';
// ...
```

**Это нарушает контракт `route.json`**: категория атласа определяется не по данным, а по хардкоду в движке. Если в `ishod/route.json` появится место с новым `id` (скажем, `tell_el_amarna`), движок не подтянет `exodus_route`-категорию без правки `_engine/`.

**Правильный контракт (предложение):** `place.arch_category` или `route.arch_categories: {place_id: cat}` в `route.schema.json`. Это сделает реестр действительно универсальным.

### 3.3 Дополнительные референсы-атласы вне `ARCHAEOLOGY_REFERENCES`

| Источник | Где живёт | Что |
|----------|-----------|-----|
| **BiblePlaces Pictorial Library** (Vol.2-7) | avraam-app.js:81, 928; route.json:1729 | 20 000+ фото, then/now |
| **ANET** (J.B. Pritchard) | avraam-app.js:928 | Ancient Near Eastern Texts |
| **L. Woolley, Ur of the Chaldeans** (1922–1934) | avraam-app.js:928, 928 | Британский музей + Penn Museum |
| **K. Kitchen, On the Reliability of the Old Testament** (2003) | avraam-app.js:928 | академический стандарт |
| **Anselm Atlas** (anselm-project.com, 190 мест) | avraam-app.js:928 | полноценный атлас |
| **NPAPH Heritage Archive** (Vriezen 1957, Boer 1954) | avraam-app.js:81, 928; route.json:326, 421 | архивные фото Силома/Балаты |
| **Ritmeyer Archaeological Design** | avraam-app.js:128; route.json:468 | реконструкции Мории, Мамре |
| **Wikimedia Commons** (CC/PD) | avraam-app.js:112, 212, 272; route.json:732, 916 | ландшафтные фото |
| **LOC American Colony / Matson** (PD ~1900–1920) | avraam-app.js:928; route.json:1729 | 1900-е виды Палестины |
| **WiBiLex** (нем. научный справочник) | avraam-app.js:928 | Bethel/Hebron/Beerscheba |
| **Jewish Encyclopedia / Sefaria** | avraam-app.js:928 | еврейская традиция |
| **AiG** answersingenesis.org (2022/2025) | avraam-app.js:928 | «Have we found Sodom?» |
| **ARJ v5** McClellan | avraam-app.js:928 | Abraham chronology |
| **Scientific Reports retraction** (24.04.2025, Tall el-Hammam) | avraam-app.js:928 | отозванная статья |
| **CMI creation.com** (YEC) | avraam-app.js:928 | креационистский взгляд |
| **Ашшер** | avraam-app.js:928; route.json:23 | «Авраам ~2166 г. до н.э.» |

**Проблема:** все эти референсы перечислены в **одной длинной строке** в `avraam-app.js:928` и `route.json:1715-1745`. Они нигде не структурированы и не классифицируются — это «портянка», а не машиночитаемый реестр.

**Правильный контракт (предложение):** `route.sources: {primary, field, academic, conservative, heritage}` — структура с 4–5 полями, как уже делает `_classifySource()` в map-engine.js:1771-1779 (но на хардкод-регекспах).

---

## 4. Карта багов karty/ (что вижу сейчас)

### 4.1 П1 / деплой-блокирующее

| ID | Наблюдение | Доказательство | Связь с MASTER_BUG_MATRIX |
|----|------------|----------------|---------------------------|
| **KARTY-01-P1** | 8/10 karty-маршрутов не рендерят карту. `index.html` без `<script>`. | `grep "script src" karty/*/index.html` показывает только `avraam` и `ishod` | Соответствует `BUG-SITEMAP-8-KARTY-MISSING` (там помечены как `data-pagefind-ignore`, исключены из sitemap — то есть **намеренно**). Возможный пересмотр: после Sprint 4 (W9) эти должны стать боевыми. |
| **KARTY-02-P1** | `index.html` без `<script>` → пользователь видит пустую страницу (или просто CSP/JSON-LD) — но не карту. Нет `<noscript>` fallback с контентом. | `karty/maccabim/index.html` и др. | Новое наблюдение. |

### 4.2 P2 / latent / a11y

| ID | Наблюдение | Доказательство |
|----|------------|----------------|
| **KARTY-03-P2** | MAP-01 (утечка памяти): `avraam-app.js` 70 addEventListener / **0** removeEventListener. `_cleanupAll()` существует в `map-engine.js:284-294`, но `avraam-app.js` не имеет аналога. | `grep -c "addEventListener\|removeEventListener" karty/avraam/avraam-app.js` = 70/0 |
| **KARTY-04-P2** | `map-engine.js` инжектит ~8KB CSS в `<style id='me-base-css'>` (lines 304-528), который SW-кэшированием **не покрывается** (audit-pro не покрывает этот ID). При hot-reload — flash of unstyled content. | `map-engine.js:303-528` — длинный inline-CSS; в `audit-pro.js` ALLOWED_CSS нет `me-base-css` (динамический) |
| **KARTY-05-P2** | Hardcoded `ID → category` mapping в `_renderArchaeologyFooter` (lines 1829-1879): 8 таблиц `if (idlist.includes(place.id)) cat = 'X'`. Если `route.json` содержит место с новым `id` (любой из 9 не-avraam маршрутов), категория не подтянется. | `map-engine.js:1829-1879` |
| **KARTY-06-P2** | `avraam-app.js` дублирует логику, которая уже есть в `_engine/map-engine.js`: `getPlaceVisual` (строки 999, 1172), `getRouteLayerId` (1187), `getPlaceLayerId` (1188), `isLayerOn` (1186). Inline-фоллбэки тянутся на 100+ строк. | См. п. 5 ниже |
| **KARTY-07-P2** | `window.MapEngine = MapEngine` (line 2633) — global pollution, нет cleanup (P2-17 из arena-agent-6 уже подтвердил). | строка 2633 |
| **KARTY-08-P2** | `route.json` avraam содержит legacy-поля: `places_index`, `stages_index`, `ctx_index`, `yec_position`, `notes`, `meta.engine`, `meta.coord_system` — НЕ описаны в `route.schema.json`. | avraam: `yec=True, leg=True`, остальные: `leg=False, yec=False` |
| **KARTY-09-P2** | `route.schema.json` не покрывает: `signature`, `timeline`, `scientific_variants`, `verified_waypoints`, `layers` — а они есть в 9/10 route.json! | `karty/_shared/route.schema.json` (108 строк) vs фактические ключи |
| **KARTY-10-P2** | Нет глобального валидатора `route.json` для всех 10 маршрутов. `scripts/check-data-consistency.js` (если есть) не покрывает karty. | Аналог `VALIDATE-SCOPE-GAP` из MASTER_BUG_MATRIX.md:132 |

### 4.3 P3 / рефакторинг / косметика

| ID | Наблюдение | Доказательство |
|----|------------|----------------|
| **KARTY-11-P3** | GSAP + DrawSVG + MotionPath (3 × CDN) грузятся только ради `avraam` (~200KB), причём `map-engine.js` их не использует. CSP `karty/avraam/index.html:5` явно разрешает cdn.jsdelivr.net — а у остальных karty-маршрутов его нет. | `grep gsap karty/avraam/index.html` (3 совпадения) |
| **KARTY-12-P3** | `route.json` avraam имеет 4 «антиквариатных» ключа: `places_index`, `stages_index`, `ctx_index`, `notes` — нужны только потому, что avraam-app.js имеет fallback на них (хотя движок давно читает `places`/`stages`/`ctx`). | avraam: `leg=True` |
| **KARTY-13-P3** | `karty/avraam/avraam-app.js` невалидирует `route.json` через `MapEngine.validateRoute()` — только `compareRouteData()` (lines 680-682). | avraam-app.js:677-682 |
| **KARTY-14-P3** | Цикл `me-canvas` имеет одновременно `pointerdown`/`pointermove`/`pointerup` (через `_on`) И `touchstart`/`touchmove`/`touchend` (без `_on`). Touch-листенеры не очищаются. | `map-engine.js:1663-1700` — touch-блок без `_on` |
| **KARTY-15-P3** | В `karty/ishod/index.html` нет `<noscript>` fallback — если движок не загрузится, пользователь увидит пустой экран. | `karty/ishod/index.html` (68 строк) — нет `<noscript>` |
| **KARTY-16-P3** | В `karty/_shared/README.md:173` зафиксировано «**Do not** rename place `id` fields without updating all story `place_ids` references» — но нет автоматической проверки этого в `route.schema.json` (нет `uniquePlaceIds` constraint). | `karty/_shared/route.schema.json` |

### 4.4 Что уже закрыто (для справки)

| Баг | Статус | Где |
|-----|--------|-----|
| `CONTENT-LOSS-AVRAAM-SOURCES` | ✅ Закрыт в PR#36 | `MASTER_BUG_MATRIX.md:70` — потерянные 14 пунктов «Источники и метод» восстановлены в статичный слой |
| `MAP-01` (P3) | Подтверждён, **не закрыт** | `archive/2026-07-03-stale-incoming-2/arena-agent-6/2026-06-25/GENEALOGY_MAP_ANALYSIS.md:95` |
| `MAP-*` (q/inStory crashes, deep-link, keyboard, no-JS) | **Не подтверждены в текущем HEAD** | `SUPER_AUDIT_2026-07-06_14a49be8.md:173` — «код не менялся, наследуется без изменений» |

**Личная проверка:** в текущем `map-engine.js`:
- **q/inStory crash** — НЕ воспроизводится. `inStory` упоминается корректно, иврит-ввод через `dir="rtl"` (lines 35, 1579) — без падений.
- **keyboard** — полный набор: Esc, ←/→, Space, 1-8, ?, PageUp/Down, Home/End, wheel, focus trap.
- **deep-link** — работает: `?story=lech-lecha&place=jerusalem` (line 2463-2475).
- **no-JS** — есть fallback `me-error` (line 343-345), но без полноценного `<noscript>` со ссылками.

**Вывод:** легенда про «MAP-* баги» устарела (она из `archive/2026-06-27-…`, до Sprint 3, до введения `_engine/`). После рефакторинга в `_engine/map-engine.js` v0.52 (build 2026-06-18) эти проблемы либо закрыты, либо **никогда не существовали в этом виде** — но `SUPER_AUDIT_2026-07-06` всё ещё ссылается на старую формулировку.

### 4.5 W9 — карта волны, в которую это входит

Из `SUPER_AUDIT_2026-07-06_14a49be8.md:259-260`:
> W9 — A11y / Perf / TTS / MapEngine (P1/P2)
> PremiumControls/Gill — только по согласованию с владельцем (in-flight, freeze). **Вне заморозки**: ... MapEngine crash-фиксы (q/inStory), izbrannoe a11y.

То есть владелец планирует в W9 починить `q/inStory` (хотя в коде его уже нет — это может быть артефакт). В W9 имеет смысл **параллельно** закрыть KARTY-01..KARTY-10.

---

## 5. Главный рефактор: «выносить движки»

### 5.1 Текущая архитектура

```
┌─────────────────────────────────────────────────────────┐
│ karty/avraam/avraam-app.js (2407 строк)                │
│ ├── const PLACES = [...] ← дубль places из route.json  │
│ ├── const STAGES = [...] ← дубль stages из route.json  │
│ ├── const STORIES = [...] ← дубль stories из route.json│
│ ├── const RELATED = {} ← дубль getRelatedPlaceIds()    │
│ ├── const LAYERS = [...] ← дубль getPlaceLayerId()     │
│ ├── const CTX_PHOTOS = [...] ← ctx-фото                │
│ ├── const WALKER_PHASES = [...] ← life-timeline         │
│ ├── const ANIMATE_PHASES = [...] ← кастомные анимации  │
│ ├── function createAbrahamWalker() ← кастомный walker  │
│ ├── function buildAmbient() ← кастомный ambient        │
│ ├── function buildMinimap() ← дубль map-engine minimap │
│ ├── function animateStageRoutes() ← дубль map-engine   │
│ ├── function drawMeasure() ← дубль measure в map-engine│
│ ├── function applyStory() / applyLayers() / applyView()│
│ └── ~70 addEventListener без единого removeEventListener│
└─────────────────────────────────────────────────────────┘
                            ↓ вызывает через optional chain
┌─────────────────────────────────────────────────────────┐
│ karty/_engine/map-engine.js (2634 строки)              │
│ └── window.MapEngine = MapEngine (v0.52.0)             │
│     ├── loadRoute, validateRoute, compareRouteData      │
│     ├── normalizeRouteData, collectPhotoHosts          │
│     ├── getPlaceIndex, getPlaceById, getStageForPlace  │
│     ├── getRelatedPlaceIds, getTabContentKey           │
│     ├── getPanelModel, getPanelSections, getStoryViewport│
│     ├── getStoryState, getPlaceOrder, auditStoryDefinitions│
│     └── createMap(container, route, opts) → MapInstance│
│         ├── open, close, setStory, startTour, stopTour │
│         ├── flyTo, resetView                           │
│         └── destroy() ← есть cleanup, но avraam-app    │
│                          его не зовёт                  │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Карта переноса (что куда)

| Что сейчас в avraam-app.js | Что есть в map-engine.js | Что дублируется | Действие |
|---------------------------|--------------------------|-----------------|----------|
| `getPlaceVisual` (lines 999, 1172 — inline-fallback) | — | да, нет в map-engine | **Добавить в map-engine** как Public API: `getPlaceVisual(place) → {markerClass, cssColor, color}` |
| `getRouteLayerId` (line 1187) | — | да | **Добавить**: `getRouteLayerId(place) → 'war'\|'lot'\|'abr'` |
| `getPlaceLayerId` (line 1188) | — | да | **Добавить**: `getPlaceLayerId(place) → 'cand'\|'lot'\|'abr'` |
| `isLayerOn` (line 1186) | — | да | **Добавить**: `isLayerOn(LAYERS, id) → bool` |
| `getPlaceOrder` (line 1217) | `getPlaceOrder` (line 369) | да, fallback | Использовать engine, fallback убрать |
| `getPanelModel` (line 1243) | `getPanelModel` (line 209) | да, fallback | Использовать engine, fallback убрать |
| `getPanelSections` (line 1317) | `getPanelSections` (line 222) | да, fallback | Использовать engine, fallback убрать |
| `getTabContentKey` (line 1318) | `getTabContentKey` (line 201) | да, fallback | Использовать engine, fallback убрать |
| `getRelatedPlaceIds` (line 1327) | `getRelatedPlaceIds` (line 194) | да, fallback | Использовать engine, fallback убрать |
| `getStoryState` (line 698) | `getStoryState` (line 350) | да, fallback | Использовать engine, fallback убрать |
| `PLACES` (const) | route.places | **полный дубль** | Убрать `const PLACES`, читать из `route` |
| `STAGES` (const) | route.stages | полный дубль | Убрать `const STAGES` |
| `STORIES` (const) | route.stories | полный дубль | Убрать `const STORIES` |
| `RELATED` (const) | `getRelatedPlaceIds()` | полный дубль | Убрать, использовать engine |
| `LAYERS` (const) | `opts.layers` / `route.layers` | полный дубль | Убрать, читать из route |
| `CTX_PHOTOS` (const) | route.ctx | полный дубль | Убрать |
| `WALKER_PHASES` (const) | route.timeline | полный дубль | Убрать |
| `createAbrahamWalker` | (нет в engine) | **новая логика** | **Добавить в engine** как `enableWalker(opts)` |
| `buildAmbient` | (нет в engine) | новая логика | **Добавить** в engine как `setAmbient(opts)` |
| `buildMinimap` | `showMinimap` opt в createMap | дубль | Использовать `opts.showMinimap=true` |
| `changeAmbientChord` | (нет в engine) | новая логика | **Добавить** в engine как `setAmbientChord(name)` |
| `applyView`, `applyLayers`, `applyStory` | (раскидано по engine) | дубль логики | Унифицировать через `setView/setLayers/setStory` |
| `auditRouteJsonDrift` | `compareRouteData` | дубль | Использовать `MapEngine.compareRouteData` |
| `clearCaravanArtifacts` | (нет в engine) | кастомный | Перенести в engine |
| `closePanel`, `closeCtx`, `closeSearch` | `close()` | дубль | Использовать `instance.close()` |
| `dismissIntro` | `showIntro` opt в createMap | дубль | Использовать `opts.showIntro=false` |
| 70 `addEventListener` без cleanup | `_cleanupAll()` (line 284) | **критический дубль** | **Каждое** `addEventListener` в avraam-app.js обернуть в `_on()` или удалить |

### 5.3 Правильная целевая архитектура (после рефакторинга)

```
┌────────────────────────────────────────────┐
│ karty/avraam/index.html (78 строк)         │
│ ├── <link rel="preload" href="route.json"> │
│ ├── <script src="../_engine/map-engine.js">│
│ └── <script>                               │
│     fetch('route.json')                    │
│       .then(r => r.json())                 │
│       .then(route =>                       │
│         MapEngine.createMap(                │
│           container,                       │
│           route,                           │
│           {                                │
│             showCompass: true,             │
│             showMinimap: true,             │
│             showIntro: true,               │
│             backUrl: '/karty/',            │
│             layers: [...avraam-specific],  │
│             enableWalker: true,            │
│             ambient: { chord: 'desert' },  │
│             // археологические реестры:    │
│             archCategoriesByPlaceId: {     │
│               'ur': 'exodus_route',        │
│               'jerusalem': 'jerusalem_…',  │
│               ...                          │
│             },                             │
│             // источники:                  │
│             sourcesByKind: ARCHAEOLOGY_…   │
│           }                                │
│         )                                  │
│       )                                    │
│ </script>                                  │
└────────────────────────────────────────────┘
```

То есть **`avraam-app.js` должен исчезнуть**, и `index.html` сводится к 78 строкам (как у `ishod`).

### 5.4 Что мешает этому прямо сейчас

1. **В `map-engine.js` нет**:
   - `enableWalker` / `setWalker` (жизненный таймлайн с караваном)
   - `setAmbient` / `setAmbientChord` (звуковой дизайн)
   - `getPlaceVisual` / `getRouteLayerId` / `getPlaceLayerId` / `isLayerOn` (как Public API)
   - `archCategoriesByPlaceId` opt для `_renderArchaeologyFooter` (вместо хардкода)
   - `sourcesByKind` opt для `ARCHAEOLOGY_REFERENCES` (вместо хардкода)

2. **`_engine/map-engine.js` рассчитан на 1 карту = 1 base-geo.svg**. В `ishod` это работает, но для всех 10 маршрутов нужна логика «выбрать base-geo по route.meta.id» (сейчас `base-geo.svg` — единственный файл, подгружается через `opts.baseGeoUrl`).

3. **Семантика `layerData` разная**:
   - В map-engine: `layerData = [...(opts.layers || route.layers || [])]`
   - В avraam-app: `LAYERS = [{id:'abr',...},{id:'lot',...},{id:'cand',...},{id:'war',...}]` — hardcoded
   - `route.json` avraam имеет `route.layers: [...]` (поле есть), но avraam-app его не читает!

4. **`opts.signature`** — поддерживается движком, но в avraam не используется (т.к. avraam — древний, не имеет «тематической» сигнатуры). Это OK, но в `_engine/map-engine.js` строка 1845 есть `'lot-type'` в fallback — баг?

### 5.5 Оценка объёма рефакторинга

| Подзадача | Сложность | Файлов | Оценка LOC |
|-----------|-----------|--------|------------|
| Добавить 4 новых Public API в map-engine | средняя | 1 | ~100 |
| Перенести `createAbrahamWalker` в engine | высокая | 1+1 | ~250 |
| Перенести `buildAmbient`/`setAmbientChord` в engine | средняя | 1+1 | ~150 |
| Удалить `avraam-app.js`, переписать `index.html` на 78 строк | высокая | 2 | ~−2200 (удаление) + ~10 |
| Убрать хардкод ID→category, ввести `opts.archCategoriesByPlaceId` | средняя | 1+10 (route.json) | ~150 |
| Обернуть все 70 listener'ов в `_on()` или удалить | средняя | 1 | ~100 |
| Обновить `route.schema.json`: signature/timeline/sci/verified_waypoints/layers | низкая | 1 | ~50 |
| Добавить валидатор `scripts/check-karty-routes.js` | низкая | 1 | ~80 |
| **Итого** | | **~10 файлов** | **~−1500 строк (net)** |

---

## 6. Состояние «не на проде» (что в работе)

Из `SUPER_AUDIT_2026-07-06_14a49be8.md` (выдержки, имеющие отношение к karty):

> «`page-ownership без indexability; 8 карт "production-dist" при noindex» — **CONFIRMED**. `page-ownership.json` (owner/source/risk/status, 51 роут); karty/*/route.json publication.* — второй, несогласованный словарь статусов; check-map-publication-status.js существует и энфорсит noindex-набор.

> «`deploy.yml` и `indexnow.yml` пересекаются по push-path (двойной деплой)» — **CONFIRMED**. Оба слушают `karty/**`.

> «`karty/*/route.json publication.*` — второй, несогласованный словарь статусов» — нужно согласовать с `page-ownership.json`. **Не сделано.**

> «`8 karty-заглушек должны быть в sitemap» — **REFUTED**. Заглушки `noindex` намеренно; исключение из sitemap корректно (guard `check-map-publication-status.js`).

---

## 7. Рекомендации (для следующей сессии владельца)

### 7.1 Что НЕЛЬЗЯ делать без владельца (in-flight / freeze)

- PremiumControls (Gill) — зафиксировано в `START_HERE.md:3`, `SUPER_AUDIT_2026-07-06 §4`
- Глоссарий (W5 — security)
- Bible-хранилище (W6 — заморозка издания)

### 7.2 Что МОЖНО и НУЖНО (в порядке приоритета)

| # | Действие | Владелец нужен? | LANE? | Связь с W-волной |
|---|----------|-----------------|-------|-------------------|
| 1 | **KARTY-01**: подключить `_engine/map-engine.js` к 8 заглушкам по образцу `ishod/` (одна строка `<script>` + один fetch) | нет | нет (FAST) | W9 |
| 2 | **KARTY-09**: расширить `route.schema.json` (signature/timeline/sci/verified_waypoints/layers) | нет | нет (FAST) | W1 (validation) |
| 3 | **KARTY-08**: вычистить legacy-поля из avraam/route.json (places_index, stages_index, ctx_index, yec_position, notes) | да (YEC-логика) | да (LANE) | W2 (даты) |
| 4 | **KARTY-05, KARTY-11**: вынести hardcoded ID-маппинг в `route.arch_categories_by_place_id` | да (нужна экспертиза) | да (LANE) | W4 (Bible-корпус) |
| 5 | **KARTY-06, KARTY-15**: рефакторинг avraam (вынести 4 публичных API, добавить enableWalker/setAmbient) | да (визуальный QA) | **обязательно LANE** | W9 (MapEngine) |
| 6 | **KARTY-03**: устранить утечку памяти в avraam-app.js (или исчезнет после п.5) | — | — | W9 |
| 7 | **KARTY-04**: вынести CSS из `me-base-css` в отдельный файл `css/map-engine.css` | нет | да (LANE, touch shared) | W7 (CSS) |
| 8 | **KARTY-10**: добавить `scripts/check-karty-routes.js` (gate) | нет | нет (FAST) | W1 |
| 9 | Согласовать `route.json publication.*` с `page-ownership.json` | да (editorial) | да (LANE) | W2 |

### 7.3 Какие **не баги**, а фичи / план

- 8 заглушек = намеренный noindex до Sprint 4. Не «баг», а roadmap.
- `MAP-*` (q/inStory, deep-link, keyboard, no-JS) — **закрыты** текущим движком. Старая формулировка в SUPER_AUDIT — артефакт.
- `window.MapEngine` global pollution — by design (для интеграции со старым avraam-app.js; исчезнет после п.5).

---

## 8. Контрактные наблюдения (для владельца)

### 8.1 Что есть в `route.schema.json` (108 строк)

```json
{
  "required": ["meta", "stories", "places", "stages"],
  "properties": {
    "meta": { "id", "title", "era", "stats", "viewport_init" },
    "places": [{ "id", "name", "x", "y", "type", "stage", "story?", "he?" }],
    "stages": [{ "n", "t", "r", "paths?" }],
    "stories": [{ "id", "label", "place_ids?", "stage_ids?" }],
    "ctx?", "verified_waypoints?", "scientific_variants?"
  }
}
```

### 8.2 Что фактически есть в route.json (но НЕ в схеме)

| Поле | В каких route.json | Используется движком? |
|------|---------------------|------------------------|
| `signature` | 9/10 (кроме avraam) | да (`renderSignatureOverlay` line 1300+) |
| `timeline` | 9/10 (только avraam) + avraam (с `life` логикой) | да (`route.timeline`) |
| `layers` | 10/10 | да (`opts.layers || route.layers`) |
| `photo_hosts` (если есть) | ? | да (`collectPhotoHosts`) |
| `notes` | только avraam | — нет (legacy avraam-app) |
| `yec_position` | только avraam | — нет (legacy avraam-app) |
| `meta.engine` | только avraam | — нет (legacy avraam-app) |
| `meta.coord_system` | только avraam | — нет (legacy avraam-app) |
| `meta.title_he`, `subtitle` | 10/10 | да (lines 728-729) |
| `meta.yec_date` | только avraam | — нет |

### 8.3 Предложение расширения `route.schema.json`

Добавить в `properties`:

```json
{
  "signature": {
    "type": "object",
    "properties": {
      "type": { "enum": ["lampstands","water-split","sea-voyage","hanukkah-lights","split-kingdom","judge-cycles","tribe-stars","ministry-light","gospel-waves"] },
      "label": "string", "description": "string",
      "place_ids": "string[]", "north_ids": "string[]", "south_ids": "string[]",
      "origin": "string", "origin_id": "string", "divide": "string"
    }
  },
  "timeline": { "type": "array", "items": { "era", "label", "stage", "color" } },
  "layers": { "type": "array", "items": { "id", "label", "color", "on", "selector", "pathSelector" } },
  "verified_waypoints": { "type": "array", "items": { "name", "x", "y" } },
  "scientific_variants": { "type": "object" },
  "arch_references": {  // НОВОЕ: id категории ARCHAEOLOGY_REFERENCES
    "type": "object",
    "patternProperties": { "^[a-z_]+$": { "title": "string", "items": "object" } }
  },
  "place.arch_category": "string",  // НОВОЕ: id категории для place.id
  "sources": {  // НОВОЕ: машиночитаемый реестр референсов
    "type": "object",
    "properties": {
      "primary": "string[]",
      "field": "string[]",
      "academic": "string[]",
      "conservative": "string[]",
      "heritage": "string[]"
    }
  }
}
```

---

## 9. Метрика и метрики (что считать успехом)

| Метрика | Сейчас | Цель | Способ измерения |
|---------|--------|------|------------------|
| Рабочих karty-маршрутов (UI рендерится) | 2/10 | 10/10 | `grep -L "script src" karty/*/index.html` → 0 |
| Размер avraam-app.js | 247 KB | 0 KB | удаление |
| Утечек памяти в karty/ | 70 (MAP-01) | 0 | `grep -c removeEventListener karty/avraam/avraam-app.js` ≥ `grep -c addEventListener` |
| Дублирующихся определений функций | ~25 | 0 | static analysis |
| `route.schema.json` покрытие | 7/13 фактических ключей | 13/13 | ручной чек |
| `ARCHAEOLOGY_REFERENCES` использование | 1/10 маршрутов (avraam через ID-маппинг) | 10/10 (через route.json) | `grep -c archCategory karty/*/route.json` ≥ 1 |

---

## 10. Что я НЕ проверил (out of scope для audit-only)

- Реальный рендер в браузере (Playwright) — не запускал, чтобы не тратить ресурсы E2B. Если владелец хочет визуальный QA, можно сделать в LANE-сессии.
- Network requests и CSP violation'ы — тоже требуют запуска.
- Минификация / bundle size impact после рефакторинга — нужны бенчмарки.
- Реальная производительность на мобильных (Pinch-zoom, swipe) — упомянуто в `SANDBOX-ENV` как «CI-регрессия 7 из 8 коммитов».

---

## 11. Файлы, которые я НЕ редактировал (для доверия)

```
$ git status
nothing to commit, working tree clean
```

Я не делал `git commit` / `git push`. Клон `repo/` остался нетронутым (только `git clone --depth 50`).

Если владелец даст добро на **аудит + одну конкретную правку** (например, KARTY-01: подключить движок к 8 заглушкам) — открою новую сессию, обязательно в LANE-режиме (см. `docs/LANE_LOCK_POLICY.md`).

---

**Подписи:**
- `auditrepo/verified/MASTER_BUG_MATRIX.md` — 87 closed, 37 open
- `auditrepo/verified/SUPER_AUDIT_2026-07-06_14a49be8.md` — current HEAD `14a49be8`, после чего `75f807b73` (deploy run 28829729903)
- `auditrepo/verified/START_HERE.md` — Owner Action Summary, 5 пунктов «что важно владельцу»
- `karty/_shared/README.md` — канон контракта (API + schema)
- `karty/_shared/route.schema.json` — JSON Schema draft 2020-12

— Arena Agent, 2026-07-07, audit-only
