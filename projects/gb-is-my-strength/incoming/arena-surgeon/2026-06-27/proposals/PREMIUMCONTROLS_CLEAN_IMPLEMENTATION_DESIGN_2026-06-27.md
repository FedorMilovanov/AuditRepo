# PremiumControls — ХИРУРГИЧЕСКИЙ ДИЗАЙН ЧИСТОЙ РЕАЛИЗАЦИИ

**Дата:** 2026-06-27
**Проект:** gb-is-my-strength (gospod-bog.ru)
**HEAD (baseline):** `1a288da5` (current origin/main)
**Автор:** arena-surgeon
**Цель:** тщательное продумывание того, как реализовать PremiumControls **чисто, профессионально, без рассинхрона, адаптивно под серии и одиночные страницы, хирургически (не копируя всё подряд)**. Это дизайн-план, а НЕ реализация — реализация стартует **после** завершения работы другого агента над Hermeneutics + одной частью Gill (эталон), чтобы не «резать функцию на половине выполненности».

---

## 0. Принципы владельца (что нельзя нарушать)

1. **Не начинать, пока не закрыт эталон.** Другой агент делает Hermeneutics + одну Gill-часть как образец. Сначала дождаться его, согласовать контракт, потом тиражировать.
2. **Хирург, не бульдозер.** Не «переписать всё с нуля», а свести разрозненные реализации к **одному источнику правды**, удаляя дубликаты.
3. **Без рассинхрона.** Каждое значение — computed из данных, не hardcoded (учитывая false-positive-урок: floor-значения корректны, но их избыточное дублирование — запах).
4. **Адаптивность.** Серии и одиночные страницы получают **разный, но унифицированный** набор контролов через конфиг, а не через 7 отдельных вариантов.
5. **Архитектурные потолки AGENTS §2.** Не плодить новые CSS/JS-файлы (максимум — консолидация в существующие).
6. **Улучшения владельца.** Скоростная панель `0.75× 1× 1.25× 1.5× 2×` (PlayEmber speed-morph из приложенного скриншота) — канонический UX, должен работать единообразно везде.

---

## 1. Диагноз — почему текущее состояние «колхозное» (фрагментация)

### 1.1 Две параллельные компонентные системы

| Система | Где живёт | Используется | Типизация |
|---|---|---|---|
| **FloatingCluster** (новая, модульная) | `src/components/ui/floating-cluster/` | antisovetov, hermenevtika, kod-da-vinchi + series-lite (15) | ✅ TS Props |
| **GillRailControls** (Gill-спец) | `src/components/ui/floating-cluster/GillRailControls.astro` | 4 Gill part-chromes (context уже на v16-rail) | ❌ отдельный путь |

`FloatingCluster.astro` — dispatcher: `mode: single|series-lite`, далее `SingleArticleCluster` (variant hermeneutics|article) или `SeriesLiteCluster` (variant pastor|heart). **Gill идёт мимо** этой диспетчеризации — своим `GillRailControls`. Это и есть Gill «two-worlds» (см. re-verify §3.5): context уже на `gbs-rail`/v16, а parts на legacy `gbs2-rail` с GillRailControls.

### 1.2 Взрыв вариантов (7, часть с 1 использованием)

```
baptisty    × 11   (baptisty-rossii series — самая покрытая)
gill        × 5    (5 Gill маршрутов)
nagornaya   × 5    (Tailwind-мир — отдельная система, не трогать по AGENTS §9.11)
hermeneutics× 2
heart       × 2
pastor      × 1    ← одиночный, кандидат на объединение
article     × 1    ← одиночный, кандидат на объединение
```
`pastor`/`article` по 1 использованию — лишние сущности. `nagornaya` — историческое исключение (Tailwind-sidebar), не входит в консолидацию.

### 1.3 CSS — тройной источник (РАССИНХРОН, подтверждён в re-verify §3.3/§4.2)

| Файл | Размер | Роль | Загружается? |
|---|---|---|---|
| `src/styles/premium-controls.css` | 8.8 КБ | **канонический source** (v2.1, "PlayEmber Speed Morph reference match") | — |
| `css/floating-cluster.css` | **75 КБ** | **runtime**, который реально грузят страницы + SW precache | ✅ да |
| `css/premium-controls.css` | 8.8 КБ | копия source, зарегистрирован в `asset-version.js`, но **НИКЕМ не грузится** | ❌ осиротевший |

75 КБ runtime vs 8.8 КБ canonical = **~66 КБ легаси/дубликатов** в runtime-CSS (fellow-агенты находили `[data-gill-v16] __num` дубликаты и legacy `fc-*` body-классы). Это и есть «раздутость».

### 1.4 Контроллер — god-object

`js/floating-cluster-controller.js` — **1050 строк, 53 функции** в одном файле: theme, search, favorites, save, ember-state, TTS (чанкинг + rate + progress + pause), series-pilot, Gill-rail init, speed-morph. **Без dedicated-теста** (только `premium-controls-rollout-audit.js` PC-001..PC-008). Это концентратор рецидивирующих регрессий (см. re-verify §6: 4–5 фиксов floating/theme/position за последние 2 недели).

### 1.5 Разрыв покрытия («доделать на всём сайте»)

Маршруты **С** контролами (10 article-pilots): antisovetov, gill-context, gill-part1/2/3, gill-spravochnik, hermenevtika, kod-da-vinchi, krajne, rimlyanam7.

Что требует доработки до «везде чисто»:
- Gill parts convergence (с legacy `gbs2-rail` → единый рельс).
- Унификация вариантов pastor/article/heart → меньше сущностей.
- baptisty (11) — проверить единообразие (самая покрытая, но нет гарантии консистентности варианта).

---

## 2. Целевая архитектура (единый источник правды)

### 2.1 Один компонентный вход + конфиг-манифест

**Единственная точка входа:** `FloatingCluster.astro` (уже dispatcher). Всё остальное — его режимы.

Расширить контракт `mode` с `single | series-lite` до явной адаптивности:

```
FloatingCluster(props):
  mode: 'single' | 'series'
  variant: string           // чисто косметическая тема (gold/gill/heart...) — НЕ логика
  seriesKey?: SeriesKey     // для series: откуда брать прогресс/части
  currentSlug?: string      // для series: текущая часть
  audio: { enabled, scope } // TTS-возможности страницы
  controls: string[]        // ['play','save','theme','search','toc'] — что показывать
```

**Ключевая идея:** логика определяется `mode` + `controls[]`, а `variant` становится **только темой** (цвета/字形), а не сепаратной реализацией. Это убирает взрыв вариантов: 7 вариантов → 2 mode + палитра.

### 2.2 GillRailControls → сходится в FloatingCluster

Gill не должен иметь отдельный контрол-путь. `GillRailControls` должен стать **слотом/вариантом** внутри `SeriesLiteCluster` (или общего series-режима):
- Gill-context (уже v16-rail) — пример, к которому подтянуть parts.
- Parts (legacy `gbs2-rail`) — migrate на тот же рельс (это lane C из re-verify, high-risk, под pixel-parity per page).

**Это убирает Gill two-worlds.** Но — только после эталона от другого агента (одна Gill-часть).

### 2.3 Один CSS — консолидация

Выбрать **один** runtime-CSS. Рекомендация хирурга:
- **Canonical source:** `src/styles/premium-controls.css` (8.8 КБ, v2.1 "reference match") — это уже чистый канон.
- **Build копирует** его в runtime-файл, который грузят страницы.
- **Удалить:** `css/premium-controls.css` (осиротевший дубликат) — раз он не грузится.
- **`css/floating-cluster.css` (75 КБ):** это раздутый runtime. Не удалять вслепую (он грузится!) — а **реконсилировать**: вынести из него легаси/дубликаты (legacy `[data-gill-v16] __num`, `fc-*` body-классы — fellow-агенты их задокументировали как «harmless but superseded»), сведя к каноническим правилам из `src/styles/premium-controls.css`. Цель: runtime-CSS → ~размер канонического + legacy-хвост, без дублей.

**Anti-desync инвариант (новый):** `dist:css-parity` (или новый guard) должен проверять, что в runtime-CSS нет классов, отсутствующих в canonical source БЕЗ явного legacy-маркера. PC-004 (no double delivery) уже есть — добавить PC-010 «single canonical source».

> ⚠️ Это risky-зона (трогает грузящийся CSS). Только после визуального sign-off и под `visual:parity:guard` + pixelmatch.

### 2.4 Контроллер — декомпозиция god-object (без новых файлов в `/js/`!)

AGENTS §2: в `/js/` нельзя создавать новые файлы. Значит — декомпозиция **внутри** `floating-cluster-controller.js` (или, по паттерну r262 `js/modules/`, в `js/modules/` с бандлом). Целевые подмодули (логические домены):

| Домен | Функции сейчас | Цель |
|---|---|---|
| **Theme** | toggleTheme/syncThemeButtons | один контроллер темы (singleton, AGENTS §4.4.6) |
| **Search** | openSearch | делегация к `js/search.js` (CommandPalette) |
| **TTS/Audio** | splitTtsChunks/speakNextChunk/startTts/pauseTts/getStoredRate/updateProgress | отдельный audio-домен (самый сложный, ~300 строк) |
| **PlayEmber + speed-morph** | initEmbers/setEmberState/updateEmberAriaLabel | play-домен + speed-панель `0.75×..2×` |
| **Save/Favorites** | getFavorites/setFavorites/isFavorite/toggleFavorite/saveCurrent | bookmark-домен (синхрон с `js/bookmark-engine.js`) |
| **Series wiring** | initGillRail/activateSeriesPilot | series-домен |

**Не плодить файлы:** оставить один `floating-cluster-controller.js`, но со **строгой внутренней секционной организацией** (маркированные домены) + **dedicated smoke-тест** (это разрешено — тестовый скрипт в `scripts/`, не в `/js/`). Это закрывает P1-долг «контроллер без теста».

---

## 3. Адаптивность: серии vs одиночные (контракт)

| Свойство | single (статья) | series (часть серии) |
|---|---|---|
| PlayEmber (TTS) | ✅ чтение статьи | ✅ чтение части |
| Save | ✅ закладка | ✅ закладка части |
| Theme toggle | ✅ | ✅ (singleton) |
| Search | ✅ (Ctrl+K) | ✅ |
| Series rail/TOC | ❌ | ✅ (рельс + прогресс + prev/next) |
| Series progress ring | ❌ | ✅ (computed из `data-gbs2-*`, НЕ hardcoded) |
| Speed panel `0.75×..2×` | ✅ (TTS rate) | ✅ (TTS rate) |

**Реализация через `controls[]` в props** — страница объявляет, что ей нужно; компонент рендерит только это. Нет «7 вариантов» — есть 2 mode + список контролов + тема.

### 3.1 Speed-morph (улучшение владельца) — канон

Скоростная панель из скриншота (`0.75× 1× 1.25× 1.5× 2×`) — это **TTS rate selector**. Контракт:
- Хранится в `localStorage` (`gb:audio:rate`).
- `gb:tts-rate-change` event — контроллер слушает, меняет `speechSynthesis` rate.
- Morph-анимация (PlayEmber expand) — viewport-guarded (AGENTS §9.11 invariants: авто-подскролл только scrollTop контейнера; один rAF-тик; reduced-motion отключает).
- Должна работать **единообразно** на single и series — это сейчас частично реализовано (`activateSeriesPilot` для series-rich), но не унифицировано.

---

## 4. Анти-рассинхрон инварианты (что добавить в guards)

1. **PC-010 single canonical CSS source** — runtime-CSS не содержит дублей правил из canonical без legacy-маркера.
2. **Gill progress computed, not hardcoded** — assert `gbs2Pct == round(done-min/total*100)` (защищает от false-positive-урока: никто не «починит» 32→21).
3. **PC-011 variant count ceiling** — не больше N различных вариантов без явного оформления (anti-explosion).
4. **Controller smoke-test** — `scripts/floating-cluster-controller-smoke.js`: theme-toggle singleton, ember state-cycle, TTS chunk split, save round-trip, speed-rate persistence.
5. **`controls[]` manifest parity** — каждый маршрут объявляет controls в route-profile; rollout-audit сверяет с реально отрендеренными.

---

## 5. Sequencing — «не резать на половине» (порядок surgical lanes)

> Принцип: каждая фаза оставляет сайт **рабочим и зелёным**. Нельзя начать декомпозицию контроллера, не закончив CSS-консолидацию, и т.д.

### Phase 0 — ждать эталон (СЕЙЧАС)
- Другой агент: Hermeneutics + одна Gill-часть как образец v16-converged.
- Я: продолжаю аудит, этот дизайн, guards. **Не трогаю** gb-code, пока эталон не вмержен.

### Phase 1 — контракт и canonical (low-risk, после эталона)
1. Согласовать `FloatingCluster` props-контракт (mode + controls[] + variant-as-theme).
2. Сделать `src/styles/premium-controls.css` единственным canonical source; удалить осиротевший `css/premium-controls.css`.
3. Добавить guards PC-010/PC-011 + computed-progress assert + controller smoke.
4. Реконсилировать AGENTS §2 inventory (8 CSS/12 JS → зафиксировать реальность, per re-verify Lane A-3).

### Phase 2 — Gill convergence (high-risk, per page)
- Перевод Gill parts с `gbs2-rail`+GillRailControls → единый series-режим FloatingCluster. **По одной странице**, под `visual:parity:guard` + pixelmatch + `interactive-audit`. (Это lane C из re-verify.)

### Phase 3 — CSS runtime реконсилировка (medium-risk)
- Почистить `css/floating-cluster.css` (75 КБ) от legacy/дублей, сведя к canonical. Под `dist:css-parity` + visual smoke.

### Phase 4 — контроллер: секционная организация + smoke-test
- Без новых `/js/` файлов. Строгие домены внутри controller. Dedicated smoke в `scripts/`.

### Phase 5 — rollout на оставшиеся маршруты + вариант-консолидация
- pastor/article/heart → меньше сущностей. baptisty (11) — единообразие.

---

## 6. Что НЕ делать (anti-бульдозер)

- ❌ Не переписывать `floating-cluster-controller.js` с нуля (1050 строк логики, рецидивы гарантированы) — секционировать.
- ❌ Не удалять грузящийся `css/floating-cluster.css` вслепую — реконсилировать.
- ❌ Не трогать Nagornaya (Tailwind-исключение, AGENTS §9.11).
- ❌ Не «чинить» Gill progress 32→21 (false-positive, см. challenge-комментарий).
- ❌ Не плодить новые варианты — сводить к mode+controls+theme.
- ❌ Не начинать Phase 2/3 до эталона другого агента (риск «резать на половине»).

---

## 7. Открытые вопросы для владельца (решить до Phase 1)

1. **Скоростная панель** `0.75×..2×` — оставить 5 ступеней? Добавить 1.75×? Это влияет на morph-анимацию.
2. **Save/Favorites** — `/izbrannoe/` уже есть (a38d7e03). Должен ли каждый маршрут иметь Save, или только статьи/серии?
3. **Gill convergence** — готов ли владелец к high-risk per-page миграции parts на v16-rail (с заморозкой на visual-parity)?
4. **CSS runtime** — согласован ли путь «один canonical source → build copy», или оставить `floating-cluster.css` как runtime и просто чистить?

---

## Статус

Это **дизайн-план**, не реализация. Ждёт: (а) эталона другого агента, (б) ответов на §7. После этого — Phase 1 (low-risk контракт + canonical + guards). Реализация пойдёт отдельными lane'ами (per AGENTS LANE_LOCK_POLICY), каждая под визуальный sign-off.

**Связанные документы:**
- `working/RASSINKHRON_SURGICAL_2026-06-27/REVERIFY_DEEPENING_2026-06-27_HEAD-1a288da5.md` (системные находки, на которых основан этот дизайн)
- `comments/challenge-on-INACCURACIES_KOLHOZ_GILL-percentages-FALSE-POSITIVE.md` (защита прогресс-ring'а от ложного фикса)
