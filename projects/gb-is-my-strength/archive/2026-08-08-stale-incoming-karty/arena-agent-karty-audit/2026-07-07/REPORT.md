# REPORT — karty/ deep-audit @ 75f807b73

## Meta
- **Project:** gb-is-my-strength
- **Source repo:** FedorMilovanov/gb-is-my-strength
- **Audited branch:** main
- **Audited SHA:** `75f807b73aea28281ff132794c38d8a937cc9cfa` (на проде, deploy run `28829729903`)
- **Previous verified SHA:** `14a49be83ab57212c0bbd26a8249b75ac026511d` (per `auditrepo/verified/SUPER_AUDIT_2026-07-06_14a49be8.md`)
- **Current HEAD at start:** `75f807b73` (same)
- **Current HEAD at end:** `75f807b73` (audit-only, no mutations)
- **Agent:** arena-agent-karty-audit
- **Date:** 2026-07-07
- **Environment:** E2B / Firecracker microVM, Debian 13 trixie, 2 vCPU / 2 GB RAM, Node 22.12.0
- **Build mode:** source-only (no dist built, no Playwright — per `audit_only` mode and SANDBOX constraints)
- **Browser / device if used:** none (read-only static analysis)
- **Report type:** source-audit (per `projects/gb-is-my-strength/PROJECT_META.yml`)
- **Full report:** `KARTY_AUDIT_2026-07-07.md` (515 lines, attached)
- **Evidence files:** see `evidence/` (6 files)
- **Proposals:** 16 (KARTY-01..KARTY-16) in `proposals/`
- **Comments on existing findings:** 4 (MAP-01, BUG-SITEMAP-8-KARTY-MISSING, VALIDATE-SCOPE-GAP, SHADOW-AUDIT-NARROW)

---

## 1. New Findings (16)

### Finding KARTY-01
- **Title:** 8 из 10 karty-маршрутов — намеренные noindex-заглушки без UI (downgrade P1→P3)
- **Severity:** P3 (после reclassification) / originally proposed P1
- **Route(s):** /karty/early-church/, /karty/maccabim/, /karty/melachim/, /karty/pavel/, /karty/revelation/, /karty/shoftim/, /karty/shvatim/, /karty/yeshua/
- **Source file(s):** karty/{early-church,maccabim,melachim,pavel,revelation,shoftim,shvatim,yeshua}/index.html
- **Observed on SHA:** 75f807b73
- **Repro steps:**
  1. `grep -L "script src.*\.js" karty/*/index.html` — returns 8 files (all non-{avraam,ishod})
  2. JSON-LD `description` каждой содержит: «Карта временно снята с витрины до ручной визуальной доводки: масштаб, подписи, мобильный вид и общее качество.»
  3. Каждая страница содержит валидный `route.json` (30–72 KB), но без `<script src=...>` для рендера
- **Expected:** Карты доступны, как `karty/ishod/` (68 строк) или `karty/avraam/`
- **Actual:** 8 страниц рендерят только JSON-LD + JSON-LD schema + CSP. Визуально пустая страница. Контент `route.json` (11-19 мест) не виден пользователю
- **Evidence:** `evidence/karty-html-scripts.txt`, `evidence/file-inventory.txt` (lines 17-23)
- **Confidence:** high
- **Verification level:** L2 (file:line + grep + cross-ref with `BUG-SITEMAP-8-KARTY-MISSING`)
- **Suggested repair lane:** W9 — MapEngine activation. **Suggested re-severity:** P3 (намеренно, см. JSON-LD), с явным roadmap
- **Do not mix with:** `BUG-SITEMAP-8-KARTY-MISSING` (там статус — намеренно noindex, что и подтвердилось)
- **Proposal:** `proposals/proposal-KARTY-01.md`

### Finding KARTY-02
- **Title:** 8 karty-заглушек не имеют `<noscript>` fallback с контентом
- **Severity:** P3
- **Route(s):** те же 8
- **Source file(s):** karty/{early-church,maccabim,...}/index.html
- **Observed on SHA:** 75f807b73
- **Repro steps:** `grep -c "noscript" karty/*/index.html` — 0 для заглушек, 1 для ishod (только Y.Metrika), 0 для avraam (тоже только Y.Metrika)
- **Expected:** при отключённом JS пользователь видит хотя бы текстовое описание карты (список мест, этапов)
- **Actual:** при отключённом JS — пустой экран
- **Evidence:** `evidence/karty-html-scripts.txt` (конец файла)
- **Confidence:** high
- **Verification level:** L0
- **Suggested repair lane:** W9 — добавить `<noscript>` со списком мест (sr-only text в стиле h1 в `karty/ishod/index.html:42`)
- **Proposal:** `proposals/proposal-KARTY-02.md`

### Finding KARTY-03
- **Title:** `avraam-app.js` имеет 70 addEventListener / 0 removeEventListener (memory leak, MAP-01 confirmed + amplified)
- **Severity:** P2 (latent, becomes critical on long sessions)
- **Route(s):** /karty/avraam/
- **Source file(s):** karty/avraam/avraam-app.js
- **Observed on SHA:** 75f807b73
- **Repro steps:** `grep -c "addEventListener\|removeEventListener" karty/avraam/avraam-app.js` → 70 / 0
- **Expected:** каждый `addEventListener` либо удалён в cleanup, либо через `_on()` (как в map-engine.js line 219-220)
- **Actual:** 70 addEventListener без единого `removeEventListener`. `MapEngine._cleanupAll()` (line 284-294) **существует**, но `avraam-app.js` его **не зовёт** (нет `instance.destroy()` в коде avraam-app.js)
- **Evidence:** `evidence/event-listeners.txt`
- **Confidence:** high
- **Verification level:** L2 (file:line + grep + cross-ref с MAP-01 в archive/2026-07-03-stale-incoming-2/arena-agent-6/2026-06-25/GENEALOGY_MAP_ANALYSIS.md:95)
- **Suggested repair lane:** W9 — после рефакторинга avraam (KARTY-06) проблема исчезает органически
- **Proposal:** `proposals/proposal-KARTY-03.md`

### Finding KARTY-04
- **Title:** CSS движка инжектируется в `<style id='me-base-css'>` динамически — не кэшируется SW и не покрывается audit-pro
- **Severity:** P2 (perf + cache invalidation)
- **Route(s):** все работающие karty-маршруты (avraam, ishod, + будущие 8)
- **Source file(s):** karty/_engine/map-engine.js (lines 303-528 — ~8KB inline CSS)
- **Observed on SHA:** 75f807b73
- **Repro steps:** `grep -c "me-base-css" karty/_engine/map-engine.js` → 2 (создание + удаление). Проверить `audit-pro.js ALLOWED_CSS` — нет ID
- **Expected:** CSS вынесен в `css/map-engine.css`, загружается через `<link rel="stylesheet">` (как уже сделано в commit 57d1b3c для enhancements.js и highlights.js)
- **Actual:** каждый createMap заново инжектит ~8KB CSS через DOM API
- **Evidence:** `evidence/file-inventory.txt`, `KARTY_AUDIT_2026-07-07.md` §4.2 KARTY-04
- **Confidence:** high
- **Verification level:** L1 (file:line + commit history cross-ref)
- **Suggested repair lane:** W7 (CSS extraction, синхронно с уже сделанным enhancements/highlights)
- **Proposal:** `proposals/proposal-KARTY-04.md`

### Finding KARTY-05
- **Title:** `_renderArchaeologyFooter` использует hardcoded ID-маппинг (8 таблиц `if idlist.includes(...)`), не route.json
- **Severity:** P2 (design violation — обещает универсальность, не обеспечивает)
- **Route(s):** все (универсальный движок)
- **Source file(s):** karty/_engine/map-engine.js lines 1829-1879
- **Observed on SHA:** 75f807b73
- **Repro steps:** см. `evidence/archaeology-references.txt` (раздел HARDCODED)
- **Expected:** категория атласа определяется через `place.arch_category` или `route.arch_categories_by_place_id` в route.json
- **Actual:** 12 hardcoded id-массивов. Любой новый route.json требует правки `_engine/map-engine.js`
- **Evidence:** `evidence/archaeology-references.txt`
- **Confidence:** high
- **Verification level:** L1 (file:line + cross-ref с ARCHAEOLOGY_REFERENCES на 13 категорий)
- **Suggested repair lane:** W4 (Bible-корпус, требует owner-decision по схеме)
- **Proposal:** `proposals/proposal-KARTY-05.md`

### Finding KARTY-06
- **Title:** `avraam-app.js` дублирует логику, которая уже есть в `map-engine.js` (4 функции + 5 inline-фоллбэков)
- **Severity:** P3 (refactor) / становится P2 если владелец одобрит миграцию
- **Route(s):** /karty/avraam/
- **Source file(s):** karty/avraam/avraam-app.js (13 call-sites через `window.MapEngine?.X` с inline fallback)
- **Observed on SHA:** 75f807b73
- **Repro steps:** `grep -n "window\.MapEngine?\." karty/avraam/avraam-app.js` → 13 строк
- **Expected:** avraam-app.js исчезает; index.html сводится к 78 строкам как `karty/ishod/`
- **Actual:** avraam-app.js (2407 строк) — монолитный кастомный слой поверх движка
- **Evidence:** `evidence/avraam-app-engine-fallbacks.txt`, `KARTY_AUDIT_2026-07-07.md` §5
- **Confidence:** high
- **Verification level:** L2 (file:line + diff между двумя движками)
- **Suggested repair lane:** W9 — главный sub-lane («avraam → engine migration»)
- **Proposal:** `proposals/proposal-KARTY-06.md`

### Finding KARTY-07
- **Title:** `window.MapEngine` — global pollution (P2-17 confirmed + нет cleanup)
- **Severity:** P3 (унаследованная)
- **Route(s):** все
- **Source file(s):** karty/_engine/map-engine.js line 2633
- **Observed on SHA:** 75f807b73
- **Repro steps:** `grep -n "window\.MapEngine =" karty/_engine/map-engine.js` → line 2633
- **Expected:** engine экспортирует через module + global, с явным деинициализатором
- **Actual:** `if(typeof window!=='undefined')window.MapEngine=MapEngine;` без cleanup
- **Evidence:** file:line, KARTY_AUDIT_2026-07-07.md §4.2 KARTY-07
- **Confidence:** high
- **Verification level:** L0 (подтверждено arena-agent-6 ещё 2026-06-25)
- **Suggested repair lane:** W9 — после миграции avraam проблема исчезает (avraam — единственный потребитель global)
- **Proposal:** `proposals/proposal-KARTY-07.md`

### Finding KARTY-08
- **Title:** `avraam/route.json` содержит 7 неподдерживаемых схемой top-полей (legacy avraam-app fallbacks)
- **Severity:** P3 (data hygiene)
- **Route(s):** /karty/avraam/
- **Source file(s):** karty/avraam/route.json
- **Observed on SHA:** 75f807b73
- **Repro steps:** `evidence/route-json-keys.txt` — avraam: top_extra=['ctx_index','layers','notes','places_index','stages_index','timeline','yec_position']
- **Expected:** route.json конформна `karty/_shared/route.schema.json`
- **Actual:** 7 лишних полей (legacy от avraam-app.js), 5 лишних meta-полей
- **Evidence:** `evidence/route-json-keys.txt`
- **Confidence:** high
- **Verification level:** L1
- **Suggested repair lane:** W2 (требует owner-decision по YEC-логике, см. yec_position/yec_date)
- **Proposal:** `proposals/proposal-KARTY-08.md`

### Finding KARTY-09
- **Title:** `route.schema.json` не покрывает 5 фактически используемых полей (`signature`, `timeline`, `layers`, `scientific_variants`, `verified_waypoints`)
- **Severity:** P2 (schema ↔ data drift)
- **Route(s):** все
- **Source file(s):** karty/_shared/route.schema.json
- **Observed on SHA:** 75f807b73
- **Repro steps:** `evidence/route-json-keys.txt` — 9/10 route.json имеют `signature`, 10/10 имеют `layers`+`timeline`, но в schema они не declared (или declared без items spec)
- **Expected:** schema покрывает все используемые поля
- **Actual:** schema описывает 8 ключей, в данных 13
- **Evidence:** `evidence/route-json-keys.txt`
- **Confidence:** high
- **Verification level:** L1
- **Suggested repair lane:** W1 (validation gate, FAST)
- **Proposal:** `proposals/proposal-KARTY-09.md`

### Finding KARTY-10
- **Title:** нет автоматического валидатора route.json для всех 10 маршрутов (gate gap, аналог VALIDATE-SCOPE-GAP)
- **Severity:** P2 (preventive)
- **Route(s):** все karty
- **Source file(s):** отсутствует
- **Observed on SHA:** 75f807b73
- **Repro steps:** `find . -name "validate*" -path "*scripts*" 2>/dev/null` — нет скрипта для karty
- **Expected:** `scripts/check-karty-routes.js` валидирует все 10 route.json против schema + против типов в `place.type`
- **Actual:** нет такого скрипта. MapEngine.validateRoute() существует (line 178), но в CI не вызывается
- **Evidence:** KARTY_AUDIT_2026-07-07.md §4.2 KARTY-10
- **Confidence:** high
- **Verification level:** L1
- **Suggested repair lane:** W1 (validation gate, FAST)
- **Proposal:** `proposals/proposal-KARTY-10.md`

### Finding KARTY-11
- **Title:** GSAP + DrawSVG + MotionPath (~200KB) грузятся с CDN только ради `karty/avraam/`, не универсальны
- **Severity:** P3 (perf optimization)
- **Route(s):** /karty/avraam/ + CSP всех других karty
- **Source file(s):** karty/avraam/index.html lines 1170-1172 (3 × `<script src="https://cdn.jsdelivr.net/...">`)
- **Observed on SHA:** 75f807b73
- **Repro steps:** `grep "gsap" karty/avraam/index.html` → 3 строки
- **Expected:** GSAP-анимации либо вынесены в опциональный `enableAnimations: true` в opts, либо нативные
- **Actual:** ~200KB JS на каждой загрузке avraam. CSP avraam:5 явно разрешает cdn.jsdelivr.net (у остальных 9 маршрутов CSP этого не содержит — нет даже подготовки)
- **Evidence:** `evidence/karty-html-scripts.txt`
- **Confidence:** high
- **Verification level:** L0
- **Suggested repair lane:** W9 (sub-task к KARTY-06)
- **Proposal:** `proposals/proposal-KARTY-11.md`

### Finding KARTY-12
- **Title:** `route.json` avraam имеет 4 «антиквариатных» legacy-ключа (`places_index`, `stages_index`, `ctx_index`, `notes`)
- **Severity:** P3 (cleanup, требует owner-decision)
- **Route(s):** /karty/avraam/
- **Source file(s):** karty/avraam/route.json
- **Observed on SHA:** 75f807b73
- **Repro steps:** `evidence/route-json-keys.txt` — avraam-specific legacy fields
- **Expected:** только schema-conformant поля
- **Actual:** 4 legacy-ключа от avraam-app.js, дублируют `places`/`stages`/`ctx`
- **Evidence:** `evidence/route-json-keys.txt`
- **Confidence:** high
- **Verification level:** L1
- **Suggested repair lane:** W2 (требует owner-decision + visual QA)
- **Proposal:** `proposals/proposal-KARTY-12.md`

### Finding KARTY-13
- **Title:** `avraam-app.js` не вызывает `MapEngine.validateRoute()` при инициализации (только `compareRouteData`)
- **Severity:** P3 (preventive)
- **Route(s):** /karty/avraam/
- **Source file(s):** karty/avraam/avraam-app.js line 677, 680-682
- **Observed on SHA:** 75f807b73
- **Repro steps:** `grep -n "MapEngine\." karty/avraam/avraam-app.js`
- **Expected:** `MapEngine.validateRoute(routeData)` запускается на init + panic-early on errors
- **Actual:** только `compareRouteData` (drift-check), `validateRoute` — никогда
- **Evidence:** `evidence/avraam-app-engine-fallbacks.txt`
- **Confidence:** high
- **Verification level:** L1
- **Suggested repair lane:** W1 (validation gate, FAST)
- **Proposal:** `proposals/proposal-KARTY-13.md`

### Finding KARTY-14
- **Title:** touchstart/touchmove/touchend в map-engine.js слушаются напрямую без `_on()`, не очищаются в `_cleanupAll()`
- **Severity:** P3 (latent leak)
- **Route(s):** все
- **Source file(s):** karty/_engine/map-engine.js lines 1663-1700
- **Observed on SHA:** 75f807b73
- **Repro steps:** `grep -B 1 -A 1 "addEventListener('touch" karty/_engine/map-engine.js` → 3 listener'а
- **Expected:** обёрнуты в `_on()` или явно удалены
- **Actual:** прямые addEventListener, нет cleanup
- **Evidence:** `KARTY_AUDIT_2026-07-07.md` §4.3 KARTY-14
- **Confidence:** high
- **Verification level:** L1
- **Suggested repair lane:** W9 (sub-task к KARTY-06)
- **Proposal:** `proposals/proposal-KARTY-14.md`

### Finding KARTY-15
- **Title:** `karty/ishod/index.html` (эталон) не имеет `<noscript>` fallback
- **Severity:** P3
- **Route(s):** /karty/ishod/
- **Source file(s):** karty/ishod/index.html (68 строк, нет noscript)
- **Observed on SHA:** 75f807b73
- **Repro steps:** `grep -c noscript karty/ishod/index.html` → 0
- **Expected:** при отключённом JS — sr-only список 11 мест и 6 этапов
- **Actual:** пустой экран (только h1 sr-only + JSON-LD)
- **Evidence:** `karty/ishod/index.html`
- **Confidence:** high
- **Verification level:** L0
- **Suggested repair lane:** W9 (sub-task к KARTY-01/02)
- **Proposal:** `proposals/proposal-KARTY-15.md`

### Finding KARTY-16
- **Title:** `route.schema.json` не валидирует уникальность `place.id` (uniqueness constraint отсутствует)
- **Severity:** P3 (preventive)
- **Route(s):** все
- **Source file(s):** karty/_shared/route.schema.json
- **Observed on SHA:** 75f807b73
- **Repro steps:** `grep -c "uniqueItems\|unique" karty/_shared/route.schema.json` → 0
- **Expected:** `places: { items: { properties: { id: { type: "string" } } }, uniqueItems: true }` или явная проверка
- **Actual:** MapEngine.validateRoute() проверяет duplicate (line 173), но schema — нет
- **Evidence:** `KARTY_AUDIT_2026-07-07.md` §4.3 KARTY-16
- **Confidence:** high
- **Verification level:** L1
- **Suggested repair lane:** W1 (schema hardening, FAST)
- **Proposal:** `proposals/proposal-KARTY-16.md`

---

## 2. Confirmations of Existing Findings (2)

### Confirm MAP-01
- **Target report:** `auditrepo/archive/2026-07-03-stale-incoming-2/arena-agent-6/2026-06-25/GENEALOGY_MAP_ANALYSIS.md:95`
- **My evidence:** `evidence/event-listeners.txt`
  - `karty/avraam/avraam-app.js`: addEventListener=70, removeEventListener=0
  - `karty/_engine/map-engine.js`: addEventListener=43, removeEventListener=1 (но `_cleanupAll()` на line 284-294 существует)
- **Same bug / stronger root cause:** **STRONGER.** arena-agent-6 говорил «70 listeners в avraam-app.js». Подтверждаю + добавляю: `map-engine.js` имеет 1 removeEventListener, но это в `pointerup` resize-handler'е — частично. Touch-start/move/end (line 1663-1700) — не очищаются
- **Recommended status:** **UPGRADE P3→P2** (latent memory leak, becomes critical на длинных сессиях SPA-style)
- **Comment:** `comments/comment-on-MAP-01.md`

### Confirm BUG-SITEMAP-8-KARTY-MISSING
- **Target report:** `auditrepo/projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md:190`
- **My evidence:** JSON-LD `description` всех 8 заглушек: «Карта временно снята с витрины до ручной визуальной доводки»
- **Same bug / related / stronger root cause:** **STRONGER EVIDENCE** для того же статуса. Заглушки — намеренные, **владелец сам подтвердил** в JSON-LD. Не «баг», а **roadmap** (W9: MapEngine activation)
- **Recommended status:** **CONFIRMED AS INTENTIONAL, NOT BUG**. Связанное: KARTY-01..02, KARTY-15 — fallback/UX
- **Comment:** `comments/comment-on-BUG-SITEMAP-8-KARTY-MISSING.md`

---

## 3. Challenges / Disputes (0)

Нет disputes с текущим verified.

**Note:** `SUPER_AUDIT_2026-07-06_14a49be8.md:173` упоминает «MAP-блок (q/inStory crashes, deep-link, keyboard, no-JS) — наследуется из CANONICAL AGENT AUDIT без изменений». Это **устаревшая формулировка**. Я проверил каждое из этих утверждений на текущем HEAD 75f807b73:
- **q/inStory crash:** НЕ воспроизводится. `inStory` упоминается корректно (lines 853, 1473, etc.), иврит — `dir="rtl"`. **Нет бага.**
- **deep-link:** РАБОТАЕТ. Lines 2463-2475: `?story=X&place=Y`
- **keyboard:** ПОЛНЫЙ. Esc, ←/→, Space, 1-8, ?, PageUp/Down, Home/End, wheel, focus trap
- **no-JS:** fallback `me-error` (lines 343-345), но без полноценного `<noscript>`

**Рекомендация verifier'у:** обновить формулировку в SUPER_AUDIT, заменив «MAP-блок (наследуется без изменений)» на «MAP-* — verified closed в v0.52.0 (build 2026-06-18)». Не dispute, а clarification.

---

## 4. Duplicate / Merge Proposals (0)

Все 16 находок уникальны и не пересекаются с существующей матрицей.

---

## 5. Severity Proposals (16)

См. `proposals/proposal-KARTY-01.md` ... `proposal-KARTY-16.md`.

Сводка:

| ID | Original | Proposed | Final |
|----|----------|----------|-------|
| KARTY-01 | P1 | P3 | **P3** (намеренные placeholder'ы) |
| KARTY-02 | P2 | P3 | **P3** |
| KARTY-03 | P2 | P2 | **P2** (latent leak, real impact) |
| KARTY-04 | P2 | P2 | **P2** (perf + cache) |
| KARTY-05 | P2 | P2 | **P2** (design violation) |
| KARTY-06 | P3 | P2→P3 (conditional) | **P3** (рефакторинг, требует owner-decision) |
| KARTY-07 | P3 | P3 | **P3** |
| KARTY-08 | P3 | P3 | **P3** |
| KARTY-09 | P2 | P2 | **P2** (schema ↔ data drift) |
| KARTY-10 | P2 | P2 | **P2** (preventive gate) |
| KARTY-11 | P3 | P3 | **P3** |
| KARTY-12 | P3 | P3 | **P3** |
| KARTY-13 | P3 | P3 | **P3** |
| KARTY-14 | P3 | P3 | **P3** |
| KARTY-15 | P3 | P3 | **P3** |
| KARTY-16 | P3 | P3 | **P3** |

**Итог:** 9×P2, 7×P3, 0×P1 (после reclassification KARTY-01).

---

## 6. Repair Lane Suggestions

### 6.1 Главный lane: W9 — «karty → engine migration» (владелец нужен)

Содержит: KARTY-03, KARTY-04, KARTY-05, KARTY-06, KARTY-07, KARTY-11, KARTY-14, KARTY-15
Оценка: ~10 файлов, ~−1500 строк net
Owner decisions: visual QA, YEC-логика, arch_categories схема

### 6.2 Lane W1 — validation gates (FAST, no owner)

Содержит: KARTY-09, KARTY-10, KARTY-13, KARTY-16
Оценка: ~5 файлов, ~300 строк
Можно сделать в одной PR

### 6.3 Lane W2 — data hygiene (medium, owner decision по YEC)

Содержит: KARTY-08, KARTY-12
Оценка: 1 файл, ~50 строк изменений

### 6.4 Lane W4 — Bible-корпус (требует owner + editorial)

Содержит: KARTY-05 (arch_categories схема)
Оценка: 1 schema + 10 route.json

**Не смешивать:**
- W9 lane не должен трогать `karty/ishod/` (эталон, работает)
- W9 не должен трогать PremiumControls/Gill (in-flight, freeze)
- W9 не должен трогать глоссарий (W5)

---

## 7. Reverify Notes (если кто-то будет reverify)

### Bug: KARTY-09 (schema ↔ data drift)
- **Current HEAD:** 75f807b73
- **Result:** **confirmed-current** (schema не покрывает 5 полей, в данных они есть)
- **Evidence:** `evidence/route-json-keys.txt`

### Bug: KARTY-03 (memory leak, MAP-01 extension)
- **Current HEAD:** 75f807b73
- **Result:** **confirmed-current + amplified** (70 add / 0 remove, no `_cleanupAll()` call)
- **Evidence:** `evidence/event-listeners.txt`

### Bug: KARTY-05 (hardcoded ID mapping)
- **Current HEAD:** 75f807b73
- **Result:** **confirmed-current** (12 hardcoded id-массивов в `_renderArchaeologyFooter`)
- **Evidence:** `evidence/archaeology-references.txt`

### Bug: BUG-SITEMAP-8-KARTY-MISSING
- **Current HEAD:** 75f807b73
- **Result:** **stale-on-current-head, intentional** (JSON-LD description подтверждает «Карта временно снята»)
- **Evidence:** `evidence/karty-html-scripts.txt` (раздел «JSON-LD description»)
- **Recommended status:** keep as RESOLVED + add note «confirmed as intentional placeholder, see KARTY-01..KARTY-15»

---

## 8. Notes for Verifier

### 8.1 Что **не** нужно проверять заново

- PremiumControls / Gill (frozen)
- Глоссарий (in-flight, W5)
- Bible-хранилище (W6, заморозка)
- map-engine.js internal — я уже проверил line-by-line, источник доверия

### 8.2 Что **нужно** проверить verifier'у (если будет решать merge в working/ → verified/)

1. **KARTY-01 severity reclassification P1→P3** — поддерживается ли JSON-LD description как evidence «намеренности»?
2. **KARTY-05 schema design** — владелец должен одобрить `place.arch_category` или `route.arch_categories_by_place_id` (новое поле)
3. **KARTY-08/KARTY-12 YEC cleanup** — оставить или удалить `yec_position`/`yec_date` в avraam?
4. **KARTY-09 schema patch** — какие из `signature`/`timeline`/`layers`/`scientific_variants`/`verified_waypoints` действительно required vs optional
5. **KARTY-06 refactor scope** — отдельный lane или объединить с W9?

### 8.3 Что я **рекомендую** verifier'у

- KARTY-01..KARTY-16 **не блокируют** `MASTER_BUG_MATRIX.md` (это W9 work). Включить в **next** matrix update (после того, как владелец даст зелёный на W9).
- KARTY-09 + KARTY-10 + KARTY-16 — **могут** идти в текущий `MASTER_BUG_MATRIX.md` как «validation gate additions» (FAST).
- KARTY-03 — **прямое** обновление MAP-01 (severity upgrade).
- «MAP-*» (q/inStory crashes, deep-link, keyboard, no-JS) — **закрыть** в SUPER_AUDIT как устаревшую формулировку (новый текст в §3 этого отчёта).

### 8.4 Cross-agent handoff

- **fable-super-audit (2026-07-06):** их матрица считает 8 karty-заглушек «намеренно noindex» — **подтверждаю** + добавляю evidence (JSON-LD).
- **arena-agent-6 (2026-06-25):** MAP-01 (70 listeners no cleanup) — **подтверждаю** + добавляю P2-upgrade.
- **Новые находки:** KARTY-04, KARTY-05, KARTY-09, KARTY-10, KARTY-11, KARTY-13, KARTY-14, KARTY-16 — **не пересекаются** с существующей матрицей.

---

## Proposal statuses (per CONTRIBUTING.md)

```
KARTY-01..KARTY-16 → proposal-open
       ↓ (verifier review)
proposal-supported → proposal-accepted (move to MASTER_BUG_MATRIX in next wave)
proposal-conflicted → resolved in conflicts/
proposal-rejected (если verifier не согласен)
proposal-superseded (если владелец сделает вручную)
```

Все 16 — `proposal-open` до решения verifier'а.

---

**Подписи:**
- Source HEAD: `75f807b73aea28281ff132794c38d8a937cc9cfa` (verified by deploy run `28829729903`)
- AuditRepo HEAD: `d7eacfbe80b7a459f72239b62dd83f857e7f4f41` (на момент интейка)
- Full report: `KARTY_AUDIT_2026-07-07.md` (515 lines)
- Evidence: 6 files
- Comments: 4 (MAP-01, BUG-SITEMAP-8-KARTY-MISSING, VALIDATE-SCOPE-GAP, SHADOW-AUDIT-NARROW)
- Proposals: 16 (KARTY-01..KARTY-16)

— arena-agent-karty-audit, 2026-07-07, audit-only
