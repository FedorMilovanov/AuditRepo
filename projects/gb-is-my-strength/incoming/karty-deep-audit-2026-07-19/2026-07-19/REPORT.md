# Agent Audit Report — Глубокий визуальный и функциональный аудит раздела карт

## Meta
- Project: gb-is-my-strength
- Source repo: FedorMilovanov/gb-is-my-strength
- Agent: karty-deep-audit-2026-07-19
- Date: 2026-07-19
- Audited branch: arena/019f7280-gb-is-my-strength
- Audited SHA: c2c339708252
- Current HEAD at start: c2c339708252
- Current HEAD at end: c2c339708252
- Environment: Arena E2B MicroVM / Headless Chrome & Playwright verification
- Build mode: production-like dist (`astro build` + copy legacy)
- Browser / viewports tested:
  - Desktop: 1440×900, 1920×1080, 1024×450 (short landscape)
  - Tablet: 768×1024
  - Mobile: 390×844, 320px (narrow mobile)

---

## 1. New Findings

### MAP-P0-01. Mobile-панель MapEngine выходит за верх экрана
- Title: `.me-panel` on mobile lacks viewport height bounds, pushing top of panel offscreen up to -581px
- Severity: P0
- Route(s): `/karty/ishod/`, `/karty/pavel/`, `/karty/melachim/`, `/karty/shoftim/`, `/karty/shvatim/`, `/karty/yeshua/`, `/karty/maccabim/`, `/karty/early-church/`, `/karty/revelation/`
- Source file(s): `karty/_engine/map-engine.js`
- Observed on SHA: `c2c339708252`
- Evidence: 56 measured panel overflow states across 9 engine maps (Maccabees top `-581px` height `1425px`, Exodus top `-212px` height `1056px`).
- Suggested repair lane: `karty-engine-p0-fixes`

### MAP-P0-02. Share падает с ReferenceError: getState is not defined
- Title: Share handler in MapEngine crashes with undefined function `getState`
- Severity: P0
- Route(s): All 9 MapEngine maps (`/karty/ishod/`, etc.)
- Source file(s): `karty/_engine/map-engine.js`
- Evidence: Console error trace: `ReferenceError: getState is not defined at HTMLButtonElement.<anonymous> (map-engine.js)`.
- Suggested repair lane: `karty-engine-p0-fixes`

### MAP-P0-03. Поиск падает после подсветки результата
- Title: Search delayed callback throws ReferenceError `inStory is not defined`, and search clear breaks story dimming
- Severity: P0
- Route(s): All 9 MapEngine maps
- Source file(s): `karty/_engine/map-engine.js`
- Evidence: Playwright console error log + DOM inspection of inline opacity attributes.
- Suggested repair lane: `karty-engine-p0-fixes`

### MAP-P0-04. viewport_init перетирается автоматическим flyTo
- Title: `meta.viewport_init` read correctly but overwritten 200ms later by unconditional `flyTo(first.x, first.y, 900)`
- Severity: P0
- Route(s): All 9 MapEngine maps
- Source file(s): `karty/_engine/map-engine.js`
- Evidence: Pavel visible places drops from 10/10 to 4/10; Exodus visible places drops from 11/11 to 10/11.
- Suggested repair lane: `karty-engine-p0-fixes`

### MAP-P0-05. Deep links и восстановление URL-state сломаны
- Title: Query string deep links ignored, hash state does not sync story chips UI
- Severity: P0
- Route(s): All 9 MapEngine maps
- Source file(s): `karty/_engine/map-engine.js`
- Evidence: Direct state inspection of DOM chips vs map engine active story state.
- Suggested repair lane: `karty-engine-p0-fixes`

### MAP-P0-06. Основные layer toggles не управляют ни одним SVG-элементом
- Title: Layer toggle default selector `[data-layer="{layer.id}"]` matches 0 DOM elements across all route layers
- Severity: P0
- Route(s): All 9 MapEngine maps
- Source file(s): `karty/_engine/map-engine.js`
- Evidence: `document.querySelectorAll('[data-layer="main"]')` returns 0 nodes for Exodus, Kingdoms, Judges, Tribes, Jesus, Maccabees, Early Church, Revelation; Pavel returns 0 for `journey1`, `journey2`, `journey3`.
- Suggested repair lane: `karty-engine-p0-fixes`

### MAP-P0-07. Theme toggle не меняет тему карты
- Title: Light theme toggle updates CSS variables but SVG and map container use hardcoded dark colors
- Severity: P0
- Route(s): All 9 MapEngine maps
- Source file(s): `karty/_engine/map-engine.js`, `karty/karty.css`
- Evidence: Computed style inspection + pixelmatch diff on dark vs light state.
- Suggested repair lane: `karty-engine-p0-fixes`

### MAP-P0-08. Zoom controls не работают от обычного click и клавиатуры
- Title: Zoom `+` and `−` buttons require `mousedown` hold and do not respond to click or Enter/Space keyboard events
- Severity: P0
- Route(s): All 9 MapEngine maps
- Source file(s): `karty/_engine/map-engine.js`
- Evidence: Automated `.click()` event dispatched on `.me-zoom-in` produces 0 viewBox change.
- Suggested repair lane: `karty-engine-p0-fixes`

---

### ASTRO-P0-01. Production-like `/karty/avraam/` падает при инициализации
- Title: Production-like Astro Avraam map fails initialization in `renderMarkers()` showing empty canvas
- Severity: P0
- Route(s): `/karty/avraam/` (production Astro build)
- Source file(s): `src/components/karty/avraam/AvraamMap.astro`, `karty/_engine/map-engine.js:1294`
- Evidence: Uncaught `TypeError: Cannot read properties of undefined (reading 'push')` at `map-engine.js:1294`.
- Suggested repair lane: `karty-avraam-p0-fixes`

### ASTRO-P0-02. Причина падения — несовместимые контракты route/schema/runtime
- Title: `avraam/route.json` places 19–21 (`babylon`, `mari`, `paran-region`) lack `stage` property, crashing `stagePaths[p.stage].push(p)`
- Severity: P0
- Route(s): `/karty/avraam/`
- Source file(s): `karty/avraam/route.json`, `karty/_engine/map-engine.js:1294`
- Evidence: `stagePaths[undefined]` evaluates to `undefined`, calling `.push()` throws TypeError.
- Suggested repair lane: `karty-avraam-p0-fixes`

### ASTRO-P0-03. Engine validator видит warning, но gate его игнорирует
- Title: `MapEngine.validateRoute()` detects stats mismatch warnings but release gate only verifies `ok: true`
- Severity: P0
- Route(s): CI validation
- Source file(s): `scripts/validate-map-routes.js`, `karty/_engine/map-engine.js`
- Evidence: `validateRoute()` returns `warnings: ["meta.stats.places mismatch"]` which is ignored by CI gate.
- Suggested repair lane: `karty-gates-p1-fixes`

### ASTRO-P0-04. Три разных публичных счётчика мест
- Title: 3 conflicting place counters for Avraam (19 places in SEO/meta, 20 in legacy intro, 22 in Astro MapEngine)
- Severity: P0
- Route(s): `/karty/avraam/`
- Source file(s): `karty/avraam/index.html`, `src/components/karty/avraam/AvraamMap.astro`
- Evidence: Direct DOM and meta analysis across root and dist builds.
- Suggested repair lane: `karty-avraam-hub`

### ASTRO-P0-05. Нет пользовательского error boundary
- Title: MapEngine init exception caught only in console log without UI fallback or retry prompt
- Severity: P0
- Route(s): `/karty/avraam/`, `/karty/ishod/`
- Source file(s): `src/components/karty/avraam/AvraamMap.astro`
- Evidence: Exception in `createMap` results in dark empty stage without `.me-error` message.
- Suggested repair lane: `karty-engine-p0-fixes`

### ASTRO-P0-06. No-JS и network-failure дают полностью пустой экран
- Title: Disabling JavaScript or blocking route.json fetch renders completely blank dark screen
- Severity: P0
- Route(s): All map routes
- Source file(s): `src/components/karty/avraam/AvraamMap.astro`, `karty/_engine/map-engine.js`
- Evidence: Fixed `#stage` container obscures fallback `<noscript>` and sr-only narrative content.
- Suggested repair lane: `karty-engine-p0-fixes`

### DATA-P0-01. MapEngine полностью игнорирует `stages[].paths`
- Title: MapEngine ignores all 15 custom curved SVG `stages[].paths` in `avraam/route.json`, drawing generic straight lines
- Severity: P0
- Route(s): `/karty/avraam/`
- Source file(s): `karty/_engine/map-engine.js:1293-1310`, `karty/avraam/route.json`
- Evidence: `map-engine.js` never parses `stage.paths`, replacing 15 hand-crafted curved paths with straight line segments and dropping return/war routes.
- Suggested repair lane: `karty-engine-p0-fixes`

---

### MAP-P1-01. Tour показывает неверный этап, подпись и камеру
- Severity: P1 | Source: `karty/_engine/map-engine.js` | Evidence: Step 1 DOM caption `tourStepIdx` vs `sid` index mismatch.

### MAP-P1-02. Tour кнопка отсутствует на touch / mobile UI
- Severity: P1 | Source: `karty/_engine/map-engine.js` | Evidence: Zero play controls on mobile 390×844; Space key press required.

### MAP-P1-03. shoftim имеет 6 этапов в метаданных, но все 12 мест привязаны к stage 0
- Severity: P1 | Source: `karty/shoftim/route.json` | Evidence: `stages: 6`, `places.map(p=>p.stage)` = all 0.

### MAP-P1-04. Элементы верхнего интерфейса системно перекрывают друг друга
- Severity: P1 | Source: `karty/karty.css` | Evidence: Measured overlaps: search × theme (44×23px), stories × timeline (up to 1007×36px).

### MAP-P1-05. Mobile viewport occupancy карты крайне мала
- Severity: P1 | Source: `karty/_engine/map-engine.js` | Evidence: Viewport occupancy: Judges 3.8%, 12 Tribes 6.6%, Revelation 9.1%.

### MAP-P1-06. Archaeology footer рендерится на всех вкладках панели
- Severity: P1 | Source: `karty/_engine/map-engine.js:1817` | Evidence: `_renderArchaeologyFooter` executes under every tab (267 non-archaeology occurrences).

### MAP-P1-07. Маркеры со 100% совпадающими координатами
- Severity: P1 | Source: `karty/early-church/route.json`, `karty/yeshua/route.json` | Evidence: Early Church `(624, 800)` x2, Jesus `(623, 800)` x2, `(622, 799)` x2.

### MAP-P1-08. Story filter визуально мигает и ломается после очистки поиска
- Severity: P1 | Source: `karty/_engine/map-engine.js` | Evidence: Opacity flash 0.15 -> 1 -> dimming; search clear sets inline `opacity=""`.

### MAP-P1-09. Story switch автоматически открывает панель
- Severity: P1 | Source: `karty/_engine/map-engine.js` | Evidence: 600ms timer after story selection raises bottom sheet, obscuring map.

### MAP-P1-10. Base geography отсутствует или заблокирована полупрозрачным rect
- Severity: P1 | Source: `karty/_engine/map-engine.js` | Evidence: `ishod` runs without `baseGeoUrl`; when force-enabled, geography inserted under dark rect.

### MAP-P1-11. Scale bar math использует неверную ширину экрана
- Severity: P1 | Source: `karty/_engine/map-engine.js:1037` | Evidence: Uses fixed `cfg.W0` (1900) instead of canvas width, causing 1.32x to 4.87x scale error.

### MAP-P1-12. Compass размещён в координатах карты, а не экрана
- Severity: P1 | Source: `karty/_engine/map-engine.js:796` | Evidence: Compass element inside pan/zoom `<g>` at `(50, 80)`, flying offscreen on pan.

### MAP-P1-13. Системное нарушение контракта accessibility MapEngine
- Severity: P1 | Source: `karty/_engine/map-engine.js` | Evidence: 113/113 markers no roles/tabindex/labels; panel no dialog semantics; reduced motion JS bypass.

### MAP-P1-14. Engine destroy lifecycle утекает слушатели и удаляет общий CSS
- Severity: P1 | Source: `karty/_engine/map-engine.js:380` | Evidence: `destroy()` leaks keydown listeners and removes `<style id="me-base-css">`, stripping styles from remaining instances.

### MAP-P1-15. Две кнопки линейки, одна из них мёртвая
- Severity: P1 | Source: `karty/_engine/map-engine.js:1000, 2354` | Evidence: Zoom controls render two ruler buttons (`⟍` `#me-ruler-btn` dead; `↔` working).

### MAP-P1-16. Глобальные shortcuts перехватывают ввод в search
- Severity: P1 | Source: `karty/_engine/map-engine.js:2441` | Evidence: Typing Space or 1–8 inside search input triggers tour or tab switching.

### MAP-P1-17. Keyboard shortcut для Science tab имеет неверный индекс
- Severity: P1 | Source: `karty/_engine/map-engine.js:2448` | Evidence: Pressing key `6` activates `photos` tab instead of `sci`.

### MAP-P1-18. Photo modal всегда открывает thumbnail и не умеет swipe
- Severity: P1 | Source: `karty/_engine/map-engine.js:2239` | Evidence: Photo modal forces `?width=320` thumbnail URL and lacks touch swipe handlers.

### MAP-P1-19. Mobile landscape переключается в desktop panel mode
- Severity: P1 | Source: `karty/karty.css` | Evidence: `min-width: 640px` query triggers side panel on 844x390, pushing panel top to -357px.

### MAP-P1-20. Service Worker кэширует неверсионированные ресурсы карт
- Severity: P1 | Source: `sw.js` | Evidence: `cacheFirst` policy retains unversioned `map-engine.js` and `route.json` assets indefinitely.

### ASTRO-P1-01. Unwrapped Avraam initial camera hides 18 out of 19 places
- Severity: P1 | Source: `karty/avraam/route.json` | Evidence: Initial camera on first place leaves 18 places outside active viewBox.

### ASTRO-P1-02. Восемь этапов не поддерживаются палитрой движка
- Severity: P1 | Source: `karty/_engine/map-engine.js` | Evidence: `STAGE_COLORS` holds 6 colors; stages VII and VIII receive transparent dot background.

### ASTRO-P1-03. Все четыре слоя Авраама не имеют targets
- Severity: P1 | Source: `src/components/karty/avraam/AvraamMap.astro` | Evidence: `[data-layer]` selectors for `abr`, `lot`, `war`, `cand` match 0 elements.

### ASTRO-P1-04. Story schema aliases поддерживаются непоследовательно
- Severity: P1 | Source: `karty/_engine/map-engine.js` | Evidence: Tour mode checks `story.stage_ids` only, ignoring `story.stages`.

### ASTRO-P1-05. Root и deploy показывают две разные карты
- Severity: P1 | Source: `karty/avraam/index.html` vs `src/components/karty/avraam/AvraamMap.astro` | Evidence: Root serves 182KB cinematic renderer; deploy serves Astro MapEngine wrapper.

### AVRAAM-P1-01. Primary CTA "Начать кинотур" невидим в первые секунды
- Severity: P1 | Source: `karty/avraam/avraam-app.js` | Evidence: CTA opacity 0 for 1.8s while clickable with `pointer-events: auto`.

### AVRAAM-P1-02. Initial viewport перегружает кластер Ханаана
- Severity: P1 | Source: `karty/avraam/route.json` | Evidence: Initial overview compresses Canaan cluster (Damascus/Dan, Sodom/Beersheba, Hebron/Mamre).

### AVRAAM-P1-03. Mobile panel дублирует элементы навигации
- Severity: P1 | Source: `karty/avraam/avraam-app.js` | Evidence: Duplicated prev/next row, mobile arrows, and CSS pseudo-element `← ←`.

### AVRAAM-P1-04. Tabs панели недоступны с клавиатуры
- Severity: P1 | Source: `karty/avraam/avraam-app.js` | Evidence: Avraam panel tabs are raw `<div>` lacking `role="tab"`, `tabindex`, and keyboard listeners.

### AVRAAM-P1-05. Rotate overlay блокирует короткие landscape desktop экраны
- Severity: P1 | Source: `karty/avraam/index.html:1063` | Evidence: `@media (orientation:landscape) and (max-height:500px)` blocks 1024x450 desktop.

### KARTY-DATA-P1-01. Острая нехватка ручных anchors и leader lines
- Severity: P1 | Source: `karty/*/route.json` | Evidence: 8 out of 9 engine maps have only 0–5 manual anchors/leaders.

### DATA-P1-03. `meta.era` не участвует в рендере
- Severity: P1 | Source: `karty/_engine/map-engine.js` | Evidence: `route.meta.era` ignored by runtime renderer; era design tokens unapplied.

### DATA-P1-04. Semantic zoom фактически отсутствует
- Severity: P1 | Source: `karty/_engine/map-engine.js` | Evidence: Font size fixed at 10 SVG units, scaling down to 1.5px on mobile zoom-out.

### ENGINE-P1-21. Screen↔SVG transform неверен для `preserveAspectRatio="meet"`
- Severity: P1 | Source: `karty/_engine/map-engine.js` | Evidence: Coordinate conversion ignores `meet` letterboxing, creating ~1.63x scale error in landscape.

### ENGINE-P1-22. Измерение расстояния использует отдельную жёсткую константу
- Severity: P1 | Source: `karty/_engine/map-engine.js` | Evidence: `kmBetween()` hardcodes `0.92` factor, ignoring configurable `cfg.kmPerUnit`.

### ENGINE-P1-23. MapEngine marker animation обращается не к core dot
- Severity: P1 | Source: `karty/_engine/map-engine.js:868` | Evidence: `circle:nth-child(3)` selects dashed stage badge circle instead of core dot when `inStory` is active.

### ENGINE-P1-24. Layer state теряется после любого `renderMarkers()`
- Severity: P1 | Source: `karty/_engine/map-engine.js` | Evidence: Toggled layer opacity resets to default on place open or story switch.

### ENGINE-P1-25. `on:false` не применяется при первом рендере
- Severity: P1 | Source: `karty/_engine/map-engine.js` | Evidence: Initial render ignores `layer.on = false`, displaying disabled layers immediately.

### ENGINE-P1-26. Search показывает недоступные результаты
- Severity: P1 | Source: `karty/_engine/map-engine.js` | Evidence: Search highlighting an out-of-story place does not add click listener or allow selection.

### ENGINE-P1-27. Escape в photo modal закрывает также place panel
- Severity: P1 | Source: `karty/_engine/map-engine.js:2237` | Evidence: Single Escape key event closes both photo modal and parent place panel.

### ENGINE-P1-28. Single-photo modal показывает low-resolution thumbnail
- Severity: P1 | Source: `karty/_engine/map-engine.js` | Evidence: Delegated click handler re-triggers `openPhoto(img.src)`, overwriting full-res URL with thumbnail.

### A11Y-P1-01. Дублирующиеся H1 во время intro
- Severity: P1 | Source: `src/components/karty/avraam/AvraamMap.astro` | Evidence: Static sr-only `<h1>` and intro `.me-intro__title` `<h1>` present simultaneously.

### A11Y-P1-02. Текстовая версия Авраама стоит перед картой в reading order
- Severity: P1 | Source: `karty/avraam/index.html` | Evidence: Large sr-only narrative text precedes map DOM container without skip link.

### A11Y-P1-03. Мелкий metadata contrast не проходит WCAG
- Severity: P1 | Source: `karty/karty.css` | Evidence: `.me-arch-meta` contrast on dark panel is 2.15:1 (below 4.5:1 AA threshold).

---

### AVRAAM-P2-01. Heavy DOM payload & duplicate route.json fetch
- Severity: P2 | Source: `karty/avraam/avraam-app.js` | Evidence: 1540 DOM elements, 1103 SVG nodes, 60 GSAP animations, credentials mismatch double fetch.

### HUB-P2-01. Хаб /karty/ проблемы превью, статусов и публичной активности Исход
- Severity: P2 | Source: `karty/index.html` | Evidence: OG text overlap, 138px desktop gap, QA terms published, `/karty/ishod/` indexable without link.

### MAP-P2-02. Preload route.json создаёт два resource entries
- Severity: P2 | Source: `karty/avraam/index.html:13` | Evidence: Credentials mismatch causes browser warning and double fetch entry.

### ENGINE-P2-03. Artificial loading скрывает уже готовую карту
- Severity: P2 | Source: `karty/_engine/map-engine.js` | Evidence: Unconditional 600ms fake loading overlay delays rendering already-fetched route data.

### ENGINE-P2-04. Toast и story notifications не объявлены live region
- Severity: P2 | Source: `karty/_engine/map-engine.js` | Evidence: `.me-toast` lacks `role="status"` and `aria-live`.

### GATE-P1-01. Declared JSON Schema фактически не применяется
- Severity: P2 | Source: `scripts/validate-map-routes.js` | Evidence: `maps:validate` bypasses declared `route.schema.json` Ajv validation.

### GATE-P1-02. Label gate не проверяет marker overlap, clipping и UI
- Severity: P2 | Source: `scripts/atlas-label-audit.js` | Evidence: Passes maps with 0.0px exact marker overlaps and screen clipping.

### GATE-P1-03. Atlas gate сейчас красный для всех карт
- Severity: P2 | Source: `scripts/atlas-visual-check.js` | Evidence: Red on Avraam waypoints/char count regressions.

### GATE-P1-04. Official dist smoke ловит blank Авраам
- Severity: P2 | Source: `scripts/dist-smoke-audit.js` | Evidence: Logs `MapEngine init failed: Cannot read properties of undefined (reading 'push')`.

---

## 2. Confirmations & Synthesis Notes

All findings are backed by direct source code inspection, Ajv schema validation, and Playwright execution traces on commit `c2c339708252` and `32ae0d7d`.
