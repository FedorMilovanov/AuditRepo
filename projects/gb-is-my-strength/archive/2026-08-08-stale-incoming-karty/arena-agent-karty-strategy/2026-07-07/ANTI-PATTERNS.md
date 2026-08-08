# Anti-Patterns Catalog (karty/ 2024-2026)

**Status:** `proposal-open`
**Цель:** задокументировать, что мы делали неправильно, **чтобы не повторять**.

---

## A1. Activation by default

**Симптом:** Создали 10 route.json с полным контентом (19, 11, 11, 12, 17, 10, 7, 13, 18, 15 мест). "Раз данные есть — подключим UI". Получили 8 заглушек.

**Почему плохо:** Контент без UI-стратегии = будущие баги. Данные и UI — разные инвестиции.

**Fix:** Сначала **1 эталон UI**. Потом 1 вторая карта по шаблону. Потом — если владелец скажет — третья.

**Evidence:** `karty/early-church/index.html` и 7 других — JSON-LD «Карта временно снята с витрины до ручной визуальной доводки».

---

## A2. Engine as afterthought

**Симптом:** Сначала avraam-app.js (2407 строк), потом "вынесем в engine". Engine = "всё, что в avraam, можно сделать через `window.MapEngine?`". 13 call-sites с optional-chain fallback'ами.

**Почему плохо:** Engine проектируется до первого клиента, не после. Иначе — engine = «то, что удалось вытащить», а не «то, что нужно».

**Fix:** Engine v2.0 проектируется **до** Авраама v2.0. Сначала дизайн-документ, потом код.

**Evidence:** `karty/avraam/avraam-app.js:677, 680-682, 999, 1172, 1186-1188, 1217, 1243, 1317-1327` (13 call-sites).

---

## A3. Multi-route parallelism

**Симптом:** Пытались делать ishod, avraam, early-church параллельно. Три направления = три разных стиля кода.

**Почему плохо:** "Параллель" = "у каждого свой подход". Через 6 месяцев у нас 10 разных codebases.

**Fix:** Один эталон → шаблон → масштаб. Только последовательно.

**Evidence:** `karty/ishod/index.html` (68 строк, чистый) vs `karty/avraam/avraam-app.js` (2407 строк, кастомный) vs 8 placeholder'ов (только данные). Три разных уровня зрелости.

---

## A4. Feature creep

**Симптом:** В avraam-app.js накопились 68 уникальных функций: `createAbrahamWalker`, `buildAmbient`, `changeAmbientChord`, `spawnCaravan`, `clearCaravanArtifacts`, `lifeGo`, `showLife`, `setDim`, `renderVariants`, `paintSel`, ... Каждая — "хотелка владельца".

**Почему плохо:** Каждая фича = обязательство. 68 функций = 68 обязательств. Половина не используется, но тестируется, поддерживается, ломает, фиксится.

**Fix:** Phase 1 — `function-taxonomy.md`. Каждая функция из 68: "needed? yes/no/maybe". Если "no" — удалить. Если "maybe" — отложить в roadmap.

**Evidence:** `karty/avraam/avraam-app.js` — 68 функций, из них ~20-25 = avraam-specific (караван, ambient), ~15-20 = generic (panel, search, photo), остальные = утилиты/инициализация.

---

## A5. Inline CSS-in-JS

**Симптом:** 8KB CSS движка инжектируется динамически через `<style id='me-base-css">` на каждом `createMap()`.

**Почему плохо:** SW не кэширует, audit-pro не покрывает, при hot-reload — повторная инжекция, FOUC.

**Fix:** CSS отдельным файлом `karty/_engine/map-engine.css`. С версионированием. С кэшированием.

**Evidence:** `karty/_engine/map-engine.js:303-528`. Уже сделано для `enhancements.js` и `highlights.js` (commit 57d1b3c), но **не** для `map-engine.js`.

---

## A6. Hardcoded ID mapping

**Симптом:** `_renderArchaeologyFooter` (map-engine.js:1829-1879) знает 12 массивов ID-шников (`exodusIds`, `jerusalemIds`, `maccabeeIds`, ...).

**Почему плохо:** Каждый новый route.json требует правки engine. Нарушает "универсальность".

**Fix:** `place.arch_category` в route.json → engine ищет в `route.arch_references[place.arch_category]`. Data-driven.

**Evidence:** `karty/_engine/map-engine.js:1829-1879`.

---

## A7. No visual QA before adding features

**Симптом:** "Добавим анимацию каравана — потом посмотрим". Добавили. Не проверили. Караван сломан в 3 случаях из 10.

**Почему плохо:** Дороже фиксить, чем предотвращать. Особенно визуальные баги — "заметил, когда уже на проде".

**Fix:** Phase 1 (audit avraam) → 30+ визуальных багов найдены **до** добавления новых фич. Phase 3 — каждая новая фича = Playwright скриншот baseline + 1+ вариаций.

**Evidence:** визуальный аудит **не проводился** в текущем HEAD (audit-only режим, невозможно запустить Playwright). Phase 1 = первый раз.

---

## A8. YAGNI violation

**Симптом:** 70 addEventListener, 13 optional-chain fallback'ов, ~12 hardcoded ID-массивов, 4 inline-фоллбэка для engine-функций, которые "возможно понадобятся".

**Почему плохо:** Кода много, value мало. Каждая строка — точка отказа.

**Fix:** YAGNI. В engine v2.0 — только то, что использует хотя бы 1 карта. В Аврааме v2.0 — только то, что использует хотя бы 1 сюжет.

**Evidence:** `karty/avraam/avraam-app.js:677, 680-682, 999, 1172, 1186-1188, 1217, 1243, 1317-1327` (13 call-sites, из которых 4 — на несуществующие engine API).

---

## A9. Schema not data-driven

**Симптом:** 8 полей в `karty/_shared/route.schema.json` vs 13 фактически используемых в route.json. `signature`, `timeline`, `layers`, `scientific_variants`, `verified_waypoints` — есть в данных, но в schema описаны placeholder'ами.

**Почему плохо:** Schema = contract. Contract не равно reality = техдолг.

**Fix:** Phase 2 — schema v2.0. Все 13 полей подробно. CI gate.

**Evidence:** `karty/_shared/route.schema.json` (108 строк, 8 ключей) vs фактические 13.

---

## A10. Validation gate as orphan

**Симптом:** `MapEngine.validateRoute()` существует (line 178), но не вызывается в CI. `scripts/check-karty-routes.js` не существует.

**Почему плохо:** Валидатор без CI = мёртвый код. Может врать. Никто не проверяет.

**Fix:** Phase 2 — `scripts/check-karty-routes.js` + `package.json` script + wired in `strangler:audit:production-like`.

**Evidence:** `find . -name "check-karty-routes*"` → 0 hits. `MapEngine.validateRoute` exists at line 178 but no caller in CI.

---

## A11. Bundling GSAP for one map

**Симптом:** GSAP + DrawSVG + MotionPath (~200KB) с CDN только ради анимации каравана в `karty/avraam/`.

**Почему плохо:** 200KB для 1 фичи 1 карты. Lighthouse penalty. CSP расширен только для avraam (другие 9 не могут использовать те же скрипты).

**Fix:** Анимация каравана = native CSS/SVG (Phase 3). Удалить GSAP полностью. CSP упрощается.

**Evidence:** `karty/avraam/index.html:1170-1172` (3 × `<script src="https://cdn.jsdelivr.net/...">`).

---

## A12. No content verification before publish

**Симптом:** 19 мест × 4 текстовых поля (story, bible, arch, he_deep) = 76 HTML-блоков. Никто не проверял дословность Синодального, никто не проверял что археология 2024-2026 — реальные открытия, а не "может быть".

**Почему плохо:** Атлас = академический ресурс. Ошибка = репутационный ущерб.

**Fix:** Phase 1.6 — content audit. Каждый стих. Каждая дата. Каждый источник. Помечается "verified" / "needs check" / "wrong".

**Evidence:** `karty/avraam/route.json` — 19 × 4 = 76 HTML-блоков. Помечены "Проверено" в коммит-месседже `9c60c4398f114ae825a6c1248e4777fc729b4cf3` (но только для "Источники и метод", не весь content).

---

## A13. No user research

**Симптом:** Карта делалась "как владелец видит". Без тестов с реальными читателями (библеистами, мирянами, гиками, казуалами).

**Почему плохо:** "Владелец видит" ≠ "пользователь видит". Особенно для академического ресурса.

**Fix:** Phase 1.7 — минимум 3 внешних читателя. 10-минутный сеанс. Отчёт.

**Evidence:** нет документа `user-research.md` в репо.

---

## A14. No design system

**Симптом:** Цвета, шрифты, отступы, тени, анимации — разбросаны по коду. Золотой `#e8c879` встречается в 47 местах, `--me-gold` определён в CSS-in-JS, нет tokens.

**Почему плохо:** Изменить "золотой" = 47 правок. Изменить spacing = неизвестно сколько. Нет consistency.

**Fix:** Phase 1.8 — design system v0.1. Tokens. Figma/Sketch-эквивалент. Все компоненты используют tokens.

**Evidence:** `karty/_engine/map-engine.js:303-528` (inline CSS) + `karty/avraam/avraam-app.js` (inline styles) — нет центрального источника.

---

## A15. Strangler pattern overused

**Симптом:** Astro 6 + build-time strangler. Production = `dist/`. Source = может быть сломан, prod защищён strangler'ом.

**Почему плохо:** Source-only bugs невидимы на проде. Source-only audit = "всё чисто". Реальность = "source сломан, prod защищён копией".

**Fix:** Phase 1 — audit `gb-is-my-strength/` source + `dist/` (если возможно). Не доверять "на проде всё ок".

**Evidence:** `incoming/arena-auditor/2026-07-06/AUDIT_gb-main_14a49be8_2026-07-06.md` (cycle 1-4) — много findings про "source vs prod" drift. `BUG-ASTRO-CONFIG-001` — пример source-only бага, который мог бы сломать prod.

---

**Итого:** 15 anti-patterns. Не все из них "критические" (A11 не блокер, A15 — context). Но все — то, что **нельзя** повторять в Phase 3 (rewrite avraam) и Phase 2 (engine design).

— arena-agent-karty-strategy, 2026-07-07
