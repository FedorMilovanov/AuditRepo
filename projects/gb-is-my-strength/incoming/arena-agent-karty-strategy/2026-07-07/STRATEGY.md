# Strategy: 1 Premium Atlas-Grade Map (Авраам) — Long-term Plan

**Date:** 2026-07-07
**Author:** arena-agent-karty-strategy
**Owner decision input:** Фёдор Милованов
**Status:** `proposal-open` (5 owner decisions required)
**Supersedes:** `incoming/arena-agent-karty-audit/2026-07-07/` (commit c253596) — strategy only, technical findings preserved
**Source HEAD audited:** `75f807b73` (production, deploy run `28829729903`)

---

## 0. Why this document exists

A previous intake (`arena-agent-karty-audit`) proposed a **FAST, lane-based, multi-route activation plan**:
- W1: validation gates
- W4: Bible corpus
- W7: CSS extraction
- W9: avraam-app.js → engine migration + activate 8 placeholders

**Owner (Фёдор, 2026-07-07) redirected the strategy:**

> «Наша ошибка — наплодили карт, это карты-баги-заглушки, а не карты.
> Сначала ИДЕАЛЬНО сделать Авраама. ... Не костылями делать, а долгая работа на месяцы.»

This document is the **new plan**, built from scratch on owner's words.

---

## 1. The 4 laws (не обсуждаются)

1. **Авраам — единственная живая карта.** Остальные 9 — frozen placeholders. (Решается решением №1 владельца.)
2. **Engine = выносится из Авраама, а не наоборот.** Не "Авраам мигрирует на engine", а "engine проектируется так, чтобы Авраам был его первым честным клиентом". Разница критична.
3. **Качество > скорость.** Никаких W-волн. Никаких deadline. Месяцы.
4. **A11Y и перформанс — не опциональны.** Атлас-класс = премиум-класс. Это включает keyboard navigation, screen reader, reduced motion, mobile-first, Lighthouse 95+.

---

## 2. Vision: что такое "идеальный атлас" (Bible Atlas grade)

Не "карта с маркерами". Не "интерактивная визуализация". Это — **справочное издание** (reference work), в котором:
- Карта — это **один из слоёв** (не единственный интерфейс)
- Текст, фото, археология, иврит, богословские споры, датировки — **равноправные слои**
- Пользователь может **читать как книгу** (linear narrative) или **изучать как атлас** (cross-references) или **смотреть как карту** (spatial)
- Все три режима **делят state** (где я сейчас)

**Референсы** (что мы НЕ догоняем, но к чему стремимся):
- [The Macmillan Bible Atlas](https://www.amazon.com/Macmillan-Bible-Atlas-Yohanan-Aharoni/dp/002503605X) — академический стандарт, 1968+
- [Bible Mapper](https://www.biblemapper.com/) — интерактив, Flash-era
- [ESV Bible Atlas](https://www.crossway.org/) — современный reference
- [Logos Bible Software](https://www.logos.com/) — золотой стандарт цифровой библейской работы
- [Step Bible](https://www.stepbible.org/) — SBL Hebrew + Greek + geography

**Наш дифференциатор** (зачем мы):
- **Русскоязычный** (нет аналогов уровня)
- **Православно-баптистский** фокус (богословские споры без конъюнктуры)
- **Современная археология** (2024-2026 находки, не 1990-е)
- **Открытый код** (Astro/JS, не Flash/Silverlight)

---

## 3. Anti-patterns (то, что мы делали неправильно)

Из `ANTI-PATTERNS.md` (отдельный файл, ~150 строк). Краткая сводка:

1. **Activation by default.** Создали 10 route.json, подумали "раз есть данные — подключим UI". **Неправильно.** Данные без UI-стратегии = заглушки с багами.
2. **Engine as afterthought.** Сначала avraam-app.js, потом "вынесем в engine". **Неправильно.** Engine проектируется до первого клиента, не после.
3. **Multi-route parallelism.** Пытались делать ishod, avraam, early-church параллельно. **Неправильно.** Один эталон → шаблон → остальные.
4. **Feature creep.** В avraam-app.js накопились 68 функций: `createAbrahamWalker`, `buildAmbient`, `changeAmbientChord`, `spawnCaravan`, ... Каждая — "хотелка". **Неправильно.** Каждая фича = обязательство поддерживать.
5. **Inline CSS-in-JS.** 8KB CSS движка инжектируется динамически. **Неправильно.** CSS файлом, кэшируется SW, версионируется.
6. **Hardcoded ID mapping.** `_renderArchaeologyFooter` знает 12 ID-массивов. **Неправильно.** Контракт "place → category" через route.json.
7. **No visual QA before adding features.** "Добавим анимацию каравана, потом посмотрим". **Неправильно.** Визуал первичен.
8. **YAGNI violation.** 70 addEventListener, 13 call-sites с optional-chain fallback'ами. **Неправильно.** YAGNI.
9. **Schema not data-driven.** 8 полей в схеме vs 13 в данных. **Неправильно.** Schema = contract, не исторический артефакт.
10. **Validation gate as orphan.** `MapEngine.validateRoute()` существует, но не в CI. **Неправильно.**

---

## 4. The 6-phase plan (6-8 месяцев, реально)

### Phase 0: FREEZE (1-2 дня)
**Что:** Зафиксировать текущее состояние, ничего не трогать.
**Deliverables:**
- Владелец даёт 5 решений (см. README)
- `MASTER_BUG_MATRIX.md` обновляется: 16 KARTY-находок остаются (как evidence), но в `repair_lane` меняются (см. `KARTY-01-16-RECLASSIFICATION.md`)
- 8 placeholder'ов **остаются placeholder'ами** (это by design, не регрессия)
- В `karty/index.html` (хаб) — все 10 маршрутов отмечены статусом: `avraam = "ready"`, остальные 9 = `"in development"`
**Exit criteria:** Все 5 owner decisions получены, записаны в AuditRepo.
**Duration:** 1-2 дня (только решения, без кода).

### Phase 1: AUDIT AVRAAM (1-2 месяца)
**Что:** Глубокий визуальный + структурный аудит **только Авраама**.
**Deliverables:**
- 1.1. **Visual audit.** Playwright screenshots desktop + mobile + tablet. Все 8 этапов. Все 5 сюжетов. Все табы. Long-press, swipe, deep-link, hash, search, share, photo modal, measure tool. Каждый скриншот в `/audit/avraam/2026-XX/screens/`.
- 1.2. **Visual bug list.** Каждый визуальный баг = `VB-001..VB-NNN`: описание, скриншот, ожидаемое, фактическое, severity.
- 1.3. **Structural audit.** Полный обход avraam-app.js построчно. Каждая функция из 68 — нужна ли? Если нет — кандидат на удаление. `function-taxonomy.md`.
- 1.4. **Performance baseline.** Lighthouse, Web Vitals, bundle size, FCP, LCP, TTI. На 3G, на 4G, на desktop. `perf-baseline.md`.
- 1.5. **A11Y audit.** NVDA / VoiceOver. Только keyboard. Только screen reader. `a11y-baseline.md`.
- 1.6. **Content audit.** Все 19 мест, 8 этапов, 5 сюжетов. Каждый библ. текст проверен на дословность Синодального. `content-accuracy.md`.
- 1.7. **User research.** Минимум 3 читателя (вне команды владельца) — попробовать карту 10 минут, отчёт. `user-research.md`.
- 1.8. **Design system v0.1.** Цвета (золотой, тёмный, светлый), типографика (Georgia, sans для UI), spacing, иконки, тени, анимации, prefers-reduced-motion. `design-system-v0.1.md` + Figma/Sketch-эквивалент.

**Exit criteria:**
- Минимум 30 visual bugs зафиксированы
- Минимум 20 функций avraam-app.js помечены "candidate: delete"
- Performance baseline < Lighthouse 70 → **stop, fix perf first**
- Design system v0.1 одобрен владельцем
**Duration:** 1-2 месяца (можно параллелить: perf + a11y + content)

### Phase 2: ENGINE REDESIGN (2-4 месяца)
**Что:** Спроектировать engine **до** написания кода. Документ, не код.
**Deliverables:**
- 2.1. **Engine contract v2.0.** См. `ENGINE-CONTRACT-RETHINK.md`. Содержит:
  - Data model (route.json schema v2.0)
  - Public API (`MapEngine v2.0`)
  - Instance API (что может делать `instance` после `createMap`)
  - Extension model (как Авраам добавляет свои фичи без расширения engine)
- 2.2. **Reference implementation: Авраам как 1 client.** Описать, **как** Авраам будет использовать engine v2.0. Pseudo-code. Это не код — это "вот так это выглядит на стороне клиента". Если pseudo-code требует 2000 строк — engine contract неправильный.
- 2.3. **A11Y contract.** Как engine обеспечивает keyboard nav, focus trap, screen reader announcements, reduced motion. Что engine даёт из коробки, что Авраам должен добавлять.
- 2.4. **Performance contract.** Bundle budget (engine < 30KB gzip, full map < 100KB). FCP < 1s на 4G. LCP < 2.5s. INP < 200ms. TBT < 200ms.
- 2.5. **Migration plan из v0.52.0.** Что сохраняем, что выбрасываем, что переоткрываем. Конкретный mapping: `map-engine.js:303-528` (inline CSS) → файл. `_renderArchaeologyFooter` → route.json. И т.д.
- 2.6. **Anti-engine: что НЕ делаем.** Решить и записать, что мы НЕ строим:
  - Не строим SPA shell (Авраам = одна страница, не часть app)
  - Не строим reactivity (vanilla DOM, не Preact, не Vue)
  - Не строим canvas-based рендеринг (только SVG)
  - Не строим 3D
  - Не строим WebGL

**Exit criteria:**
- Engine contract v2.0 написан, владелец одобрил
- Reference implementation Авраама в pseudo-code: 200-400 строк на стороне клиента
- Bundle budget определён
- "Что НЕ делаем" зафиксировано (anti-engine manifesto)
**Duration:** 2-4 месяца. Это **самая долгая фаза**. И **самая важная**.

### Phase 3: REWRITE AVRAAM (2-3 месяца)
**Что:** Реализовать engine v2.0 + новый Авраам **на новом контракте**.
**Deliverables:**
- 3.1. Engine v2.0 код. Полная замена `karty/_engine/map-engine.js`. Single source of truth.
- 3.2. Авраам v2.0 код. `karty/avraam/avraam.js` (новый, чистый, ~300-500 строк, не 2407).
- 3.3. Авраам content v2.0. Полная верификация всех 19 мест, 8 этапов, 5 сюжетов. Каждое место имеет: story (краткое), bible (полное дословно), arch (актуальное 2024-2026), he_deep (иврит + транслитерация + этимология), photos (3-5 шт, проверенные), verse (1-3 ключевых стиха Синодального). Никаких "Lorem Ipsum", никаких copy-paste.
- 3.4. Авраам visual v2.0. Mobile-first, desktop-enhanced. Проверен на iPhone SE, iPhone 14, iPad, MacBook, 4K.
- 3.5. Авраам A11Y v2.0. Lighthouse 100, axe 0 violations, NVDA-проход вслух.
- 3.6. Авраам perf v2.0. Lighthouse 95+, Core Web Vitals green.
- 3.7. Visual regression suite. Playwright скриншоты на каждый этап / сюжет / таб. Compare before/after.
- 3.8. Editorial review. Минимум 2 внешних читателя (библеист + мирянин) — оценить "нравится / понятно / точно".

**Exit criteria:**
- **Авраам выглядит как атлас**, не как "ещё одна интерактивная карта"
- Lighthouse 95+ на mobile + desktop
- A11Y: 0 violations
- 2 external readers: "хочу такую же для Исхода"
- 0 visual regressions vs baseline
- **Владелец говорит: "это то, что я хотел"** (not "OK, good enough")
**Duration:** 2-3 месяца. Итеративно: engine v2.0 → Авраам v2.0 → 1-й прогон → баги → 2-й → ...

### Phase 4: DOCUMENT & FREEZE TEMPLATE (1 месяц)
**Что:** Зафиксировать engine как reusable, описать как сделать вторую карту.
**Deliverables:**
- 4.1. `karty/_engine/README.md` — полная документация engine v2.0.
- 4.2. `karty/_engine/TEMPLATE.md` — "как сделать вторую карту за N шагов". С checklist.
- 4.3. `karty/_engine/SCHEMA.md` — route.json v2.0 schema с примерами из Авраама.
- 4.4. `karty/_engine/A11Y.md` — что engine обеспечивает, что автор карты обязан.
- 4.5. `karty/_engine/PERF.md` — bundle budget, performance contract.
- 4.6. `karty/_engine/DESIGN.md` — design system, компоненты, токены.
- 4.7. **Public 1.0 release.** `karty/avraam/index.html` + `karty/_engine/*` — tagged v1.0.0. CHANGELOG.
- 4.8. **Demo: 2-я карта в фоне.** Минимальный "Исход" (или самый простой из 9) — попытка сделать **по шаблону**. Если 2 недели и 200 строк — шаблон работает. Если месяц — шаблон неполный.

**Exit criteria:**
- Документация полная
- 2-я карта (proof-of-concept) — собирается по шаблону
- Владелец решает: "го делать 3-ю, 4-ю" или "стоп, Авраам + Исход — финал"
**Duration:** 1 месяц.

### Phase 5+: SCALE (only after Phase 4 owner approval)
**Не входит в этот план.** Это — будущее. Если владелец скажет "Исход тоже идеально", повторяем Phase 1-4 для Исхода. **Только после Авраама v2.0 на проде минимум 1 месяц** (чтобы собрать feedback).

---

## 5. Decision matrix (что в каждой фазе)

| | Phase 0 | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
|---|---------|---------|---------|---------|---------|
| **Focus** | freeze | audit avraam | design engine | rewrite | template |
| **Код пишется?** | нет | нет | нет | ДА | немного |
| **Код удаляется?** | нет | нет | нет | ДА (avraam-app.js) | нет |
| **Visual QA** | нет | ДА | нет | ДА | ДА |
| **Owner involvement** | 5 решений | одобрение baselines | одобрение contract | visual sign-off | approval for 1.0 |
| **External readers** | 0 | 0 | 0 | 2-3 | 0 |
| **Duration** | 1-2 дня | 1-2 мес | 2-4 мес | 2-3 мес | 1 мес |
| **Risk** | low | low | medium | HIGH | low |
| **Reversibility** | high | high | high | LOW | high |

---

## 6. What "atlas-grade" means specifically (success criteria)

Авраам v2.0 готов, когда **одновременно**:
1. **Visual:** заходишь на https://gospod-bog.ru/karty/avraam/, видишь карту — и сразу ясно, что это Macmillan-уровень, а не "ещё одна leaflet-карта". Золотой/тёмный/светлый theme. Иврит с правильным RTL. Типографика серифная. Анимации — only на вход/выход, не на каждом движении мыши.
2. **Narrative:** можешь нажать "Play" и получить 5-минутный тур по 8 этапам, как документалка (audio optional, captions always).
3. **Reference:** можешь открыть любое место и получить полный scholar's apparatus: text + bible + archaeology + hebrew + photos + variants.
4. **Cross-ref:** можешь из Авраама перейти в Иакова, в Исход, в Ханаан — одним кликом, с сохранением контекста.
5. **Performant:** на 4G mobile грузится < 2 сек, интерактив < 100ms.
6. **A11Y:** читатель со screen reader получает полную карту (включая spatial relationships). Keyboard-only user навигирует 100% функций.
7. **Editorial:** библеист находит минимум 1 место, где он узнаёт что-то новое (2024-2026 archaeology). Мирянин находит минимум 1 место, где он узнаёт что-то новое о Библии.
8. **Honest:** каждый источник цитируется, каждая дата проверяема, каждый спор — спором, а не "истиной в последней инстанции".

---

## 7. Risks (честно)

| Risk | Impact | Mitigation |
|------|--------|------------|
| Владелец не даст 5 решений | plan stuck | ждать. не начинать. |
| Phase 2 (engine design) займёт > 4 мес | delay | использовать time-boxing: 4 мес = freeze contract, даже если не идеален |
| Phase 3 (rewrite) выявит, что engine v2.0 неправильный | rework | go back to Phase 2, не пытаться чинить на ходу |
| Avraam content нельзя верифицировать (источники 2024-2026 за paywall) | incomplete | явно отметить, какие ссылки не проверены, не выдумывать |
| Владелец устанет и захочет активировать 8 placeholders по образцу ishod | regression | **прямо отказать.** Это противоречит стратегии. |
| Летний отпуск / выгорание владельца | pause | план рассчитан на месяцы, не критично |
| Глоссарий (W5) или Bible-корпус (W6) разморозят и заберут фокус | external priority | это зона владельца, не наша. соглашаемся. |

---

## 8. Open questions for owner (5 решений)

См. README.md → "Owner decisions REQUIRED before any code".

1. **Decision 1:** Авраам — единственная живая карта, 8 placeholders остаются замороженными? (Y/N)
2. **Decision 2:** Engine redesign allowed (не pure preserve)? (Y/N)
3. **Decision 3:** Phased plan (months, not weeks), не W-волны? (Y/N)
4. **Decision 4:** Atlas-grade quality bar — что это значит для Авраама конкретно? (см. §6)
5. **Decision 5:** Visual QA Авраама на текущем проде — acceptable baseline? (visual screenshots, см. §4.1 Phase 1)

---

## 9. References

- Owner's words: см. README.md
- Previous intake: `incoming/arena-agent-karty-audit/2026-07-07/`
- Engine source: `gb-is-my-strength/karty/_engine/map-engine.js` (v0.52.0)
- Avraam source: `gb-is-my-strength/karty/avraam/avraam-app.js` (2407 строк)
- 8 placeholders: `gb-is-my-strength/karty/{early-church,maccabim,melachim,pavel,revelation,shoftim,shvatim,yeshua}/`
- 1 partial: `gb-is-my-strength/karty/ishod/` (canonical pattern, 68 строк)
- Schema: `gb-is-my-strength/karty/_shared/route.schema.json`
- AuditRepo policy: `projects/gb-is-my-strength/incoming/README.md` + `CONTRIBUTING.md`

---

**Подпись:** arena-agent-karty-strategy, 2026-07-07
**Status:** `proposal-open` — 5 owner decisions required
