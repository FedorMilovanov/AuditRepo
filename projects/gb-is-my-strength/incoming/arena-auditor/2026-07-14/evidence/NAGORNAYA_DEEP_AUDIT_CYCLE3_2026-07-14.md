# Нагорная проповедь — Углублённый аудит Cycle 3

> **Дата:** 2026-07-14  
> **Source HEAD:** `2ca2af3b` (main)  
> **Auditor:** arena-auditor (main branch push)  
> **Предыдущие циклы:** cycle 1 (12 визуальных багов), cycle 2 (корневая NG-DARK-01)  
> **Метод:** статический анализ исходных Astro-компонентов + dist HTML + CSS cascade/specificity

---

## Краткое резюме

Cycle 3 углубляется в архитектурные дефекты Нагорной, которые не были видны в первых двух циклах:
1. **tw.min.css без dark-вариантов** — 0 dark-классов, вся dark-тема живёт на `!important` хаках
2. **15 мёртвых Astro-компонентов** — HeaderHero/ArticleBody/PostContent не импортируются
3. **`bg-stone-100` на `<body>` не ремапится в dark** — body фон остаётся светлым
4. **172 inline `style=`** в 5 частях — не адаптивны к dark, дублируются
5. **SEO-расхождения** `<title>` ≠ `og:title>` по формату + 2 главы без pagefind scripture meta
6. **Структурная несогласованность секций** — ch.1 имеет SVG иконки + group wrapper, ch.2–5 регресс

---

## 🔴 NG-CSS-01 (P1): tw.min.css без dark-вариантов — архитектурный корень

**Файл:** `dist/nagornaya/tw.min.css` (34KB)

**Факт:** Tailwind-выход для нагорной содержит **0 `html.dark` селекторов**. Ни один Tailwind-класс не имеет dark-варианта. Вся тёмная тема обеспечивается исключительно через `mobile-hotfix.css` с `!important` оверрайдами.

**Почему это произошло:** Tailwind генерирует только те классы, которые использует контент. Если исходные Astro-компоненты не содержат `dark:` префиксов (а они не содержат — проверено: 0 совпадений в 5 MainShell), то и dark-варианты не генерируются.

**Почему текущий подход сломан:**
- `mobile-hotfix.css` использует blanket-ремапы — все -800 уровни разных цветов мапятся на ОДИН серый тон → потеря цветовой идентичности глав
- -500/-600/-700 уровни вообще не ремапятся → текст невидим в dark
- Порядок CSS: `tw.min.css` → `site.css` → `floating-cluster.css` → `mobile-hotfix.css` → `nagornaya-mobile-toc.css`. `mobile-hotfix.css` всегда побеждает через `!important`

**Professional solution:** Настроить Tailwind `darkMode: 'class'` + добавить `dark:` варианты прямо в Astro-компоненты, либо (переходный вариант) — per-chapter CSS custom properties через `data-chapter` attr.

**Evidence:**
```bash
grep -c 'html\.dark\|\.dark' dist/nagornaya/tw.min.css  # → 0
grep -c 'dark:' src/components/nagornaya/chast-*/NagornayaChast*MainShell.astro  # → 0
```

---

## 🔴 NG-BODY-01 (P1): `bg-stone-100` на `<body>` не ремапится в dark

**Файл:** `src/pages/nagornaya/chast-*/index.astro` (все 5)

**Факт:** Все 5 страниц имеют `<body class="nagornaya-page bg-stone-100 text-stone-900 antialiased">`. В тёмной теме:
- `bg-stone-100` → `#f5f5f4` (светло-серый!) — **НЕ ремапится** через `mobile-hotfix.css`
- `mobile-hotfix.css` ремапит `bg-stone-50` → `#151922!important`, но **НЕ `bg-stone-100`**
- `site.css` `body { background: var(--color-canvas) }` → `#0e1116` в dark, но проигрывает по специфичности: `.bg-stone-100` (0,1,0) > `body` (0,0,1)

**Результат:** В тёмной теме body фон — светло-серый `#f5f5f4`, а не тёмный `#0e1116` / `#151922`. Белые карточки на светло-сером фоне вместо тёмного.

**Fix:** Либо (а) добавить `html.dark body.nagornaya-page.bg-stone-100 { background-color: var(--color-canvas)!important }` в hotfix, либо (б) заменить `bg-stone-100` на `bg-[var(--color-canvas)]` в Astro.

---

## 🟠 NG-DEAD-01 (P2): 15 мёртвых Astro-компонентов

**Файлы:** 5 × 3 = 15 файлов в `src/components/nagornaya/chast-{1-5}/`:
- `NagornayaChast{N}HeaderHero.astro` — 5 шт
- `NagornayaChast{N}ArticleBody.astro` — 5 шт
- `NagornayaChast{N}PostContent.astro` — 5 шт

**Факт:** Ни один из этих компонентов НЕ импортируется ни из `index.astro`, ни из `MainShell.astro`. Они являются артефактами Astro-экстракции (auto-extracted), но никогда не были подключены.

**Замечание:** HeaderHero-компоненты содержат `<main id="main-content">` — дубль открывающего тега, если бы были использованы.

**Impact:** Запутывает навигацию по коду, создаёт риск accidental import. Общий объём мёртвого кода ~450+ строк.

**Fix:** Удалить 15 неиспользуемых файлов, либо подключить их в MainShell (рефакторинг).

---

## 🟠 NG-INLINE-02 (P2): 172 inline `style=` атрибута

**Распределение по частям:**

| Часть | inline style= count | Основные источники |
|---|---|---|
| 1 | 40 | MainShell(19) + SectionX(16) + другие |
| 2 | 40 | MainShell(19) + SectionX(16) + другие |
| 3 | 40 | MainShell(19) + SectionX(16) + другие |
| 4 | 10 | MainShell(4) + SectionI(1) + другие |
| 5 | 42 | MainShell(20) + SectionX(16) + другие |

**Источники inline-стилей:**
1. **«Из библиотеки» блок** (19-20 × 5 = ~98) — `style="color:#1c1410"`, `style="background:#faf8f5"` и др.
2. **Hero image** (1 × 5) — `style="height:320px;object-fit:cover;object-position:center;"`
3. **Author card** (1 × 5) — `style="margin:48px auto 0;max-width:720px;"`
4. **SectionX bibliography** (16 × 4) — в ch.1/2/3/5, нет в ch.4

**Dark-проблема:** Inline `style=` нельзя переопределить через CSS без `!important`. Все inline цвета (#1c1410, #8a7968, #b8882a, #faf8f5) **невидимы** в тёмной теме.

---

## 🟠 NG-SEO-01 (P2): SEO-мета несогласованность

### 1. `<title>` ≠ `og:title>` формат

| Часть | `<title>` | `og:title>` | Расхождение |
|---|---|---|---|
| 1 | `Два текста, один Иисус — Нагорная проповедь I \| ГБСМ` | `Два текста, один Иисус — Нагорная проповедь, часть I` | Формат (I vs часть I) + site name |
| 2 | `Синоптическая проблема — Нагорная проповедь II \| ГБСМ` | `Нагорная проповедь II: синоптическая проблема и богодухновенность` | Полностью разные формулировки |
| 3 | `Кому адресована Нагорная проповедь? Часть III \| ГБСМ` | `Нагорная проповедь: кому она адресована — Церкви или Израилю?` | Разные |
| 4 | `Можно ли доверять Евангелиям? Часть IV \| ГБСМ` | `Можно ли доверять Евангелиям? Богодухновенность и Нагорная проповедь` | Разные |
| 5 | `Закон и Евангелие — Нагорная проповедь V \| ГБСМ` | `Закон, Евангелие и Нагорная проповедь — итог серии` | Разные |

### 2. Missing `data-pagefind-meta="scripture"` на ch.4 и ch.5

Ch.1/2/3 имеют `<span data-pagefind-meta="scripture" hidden>Мф 5–7, Лк 6</span>` (или `Мф 28:20` для ch.3). Ch.4 и ch.5 — **не имеют** этого мета-поля. Pagefind не индексирует писание для этих двух частей.

### 3. Устаревшая версия в футере (ch.1/2/3)

Ch.1/2/3 содержат `<div>v4.0 · Апрель 2026</div>` в футере MainShell. Ch.4/5 — не имеют строки версии. Серия активно редактировалась в июне-июле 2026 — версия устарела.

---

## 🟠 NG-STRUCT-02 (P2): Структурная несогласованность секций по главам

Детальный анализ структуры заголовков секций:

| Глава | Формат h2 | Group wrapper | Иконки | Подзаголовки |
|---|---|---|---|---|
| Ch.1 (blue) | `<div class="group mb-6 mt-12">` → SVG + `<h2>` | ✅ Да | ✅ Lucide SVG | ✅ `<p class="text-stone-500 text-sm font-medium ml-14">` |
| Ch.2 (emerald) | Bare `<h2>` + `</div></div>` closing | ❌ Нет | ❌ Emoji (❓👨‍🏫📄📋💬📣#🔭🏛️🧩) | ⚠️ Partial (6/10) |
| Ch.3 (purple) | Bare `<h2>` + `</div>` closing | ❌ Нет | ❌ Lucide SVG (но вне group) | ⚠️ Partial (7/10) |
| Ch.4 (amber) | Bare `<h2>` + `</div></div>` closing | ❌ Нет | ❌ Lucide SVG (но вне group) | ⚠️ Partial (9/13) |
| Ch.5 (rose) | Bare `<h2 font-sans>` + closing | ❌ Нет | ❌ Emoji (🕊️🔑⚖️🚪🚨💛🛡️💡✨) | ⚠️ Partial (4/10) + `font-sans` |

**Регресс:** Astro-миграция `de1fbee2` (Phase 6 wave 7) не сохранила group-wrapper структуру ch.1 для ch.2–5. Ch.1 остался единственной главой с правильной структурой заголовков.

**ch.5 font-sans:** Секции I–IV имеют `font-sans` на `<h2>` и subtitle `<p>`, а секции V–X — нет. Несогласованность внутри одной главы.

---

## 🟡 NG-A11Y-01 (P3): Emoji вместо SVG иконок

ch.2 (10 секций) и ch.5 (9 секций) используют emoji в иконках секций вместо Lucide SVG. Emoji-рендеринг зависит от ОС/браузера, не масштабируется с font-size, не поддерживает `aria-hidden` корректно на всех скринридерах. Inline hero height `style="height:320px"` не адаптивен на экранах < 360px.

---

## 🟡 NG-MOBILE-01 (P3): Мобильные проблемы

1. **`bg-stone-100` body** в dark — на мобильных экранах особенно заметен (вся страница светлая в тёмном режиме)
2. **`btoc-panel`** — без `data-chapter`-специфичного accent цвета TOC-номера всегда amber вместо accent-цвета главы
3. **Hero image `style="height:320px"`** — inline-высота не адаптивна на очень маленьких экранах

---

## Полная таблица dark-ремапов — что покрыто, что нет

### Текущий `mobile-hotfix.css` для nagornaya:

| Уровень | text- ремап | bg- ремап | border- ремап |
|---|---|---|---|
| -50 | — | ✅ → #151922 | — |
| -100 | — | ✅ → #151922 | ✅ → rgba(242,200,121,.22) |
| -200 | ✅ (amber/emerald/purple) → rgba(238,231,220,.78) | — | ✅ → rgba(242,200,121,.22) |
| -300 | ✅ (purple-300) → rgba(238,231,220,.78) | — | ✅ (blue/emerald/red-300) → rgba(242,200,121,.22) |
| -400 | — | — | ✅ (amber-400) → rgba(242,200,121,.22) |
| **-500** | ❌ **НЕ ПОКРЫТ** | ❌ | ❌ |
| **-600** | ❌ **168× НЕ ПОКРЫТ** (accent-цвета!) | ❌ | ❌ |
| **-700** | ❌ **47× НЕ ПОКРЫТ** (INVISIBLE!) | ❌ | ❌ |
| -800 | ✅ → rgba(238,231,220,.78) | — | — |
| -900 | ✅ → #f3eadb | — | — |
| **body bg-stone-100** | — | ❌ **НЕ ПОКРЫТ** | — |

---

## Новые баг-идентификаторы

| ID | Severity | Описание |
|---|---|---|
| NG-CSS-01 | P1 | tw.min.css без dark-вариантов (0 dark-селекторов) — архитектурный корень всех dark-багов |
| NG-BODY-01 | P1 | `bg-stone-100` на `<body>` не ремапится в dark — body фон светло-серый в тёмной теме |
| NG-DEAD-01 | P2 | 15 мёртвых Astro-компонентов (HeaderHero/ArticleBody/PostContent × 5 глав) |
| NG-INLINE-02 | P2 | 172 inline `style=` атрибута (19-20 в «Из библиотеки» × 5 + hero + author + bibliography) |
| NG-SEO-01 | P2 | SEO-мета: title≠og:title формулировки + missing scripture meta на ch.4/5 + stale v4.0 в футере |
| NG-STRUCT-02 | P2 | Секции ch.2–5 без group-wrapper (регресс от ch.1) + font-sans только на 4/10 секций ch.5 |
| NG-A11Y-01 | P3 | Emoji вместо SVG иконок (19 секций ch.2/ch.5) + non-adaptive hero height |
| NG-MOBILE-01 | P3 | Мобильные dark-проблемы: body bg-stone-100 + TOC accent без chapter-specific + hero height |

---

## Сводка решений

### Приоритет 1: Per-chapter CSS Custom Properties + data-chapter

**Одно решение закрывает NG-CSS-01 + NG-BODY-01 + NG-DARK-01 + NG-DARK-04 + NG-DARK-05:**

```css
/* nagornaya-chapter-vars.css */
body.nagornaya-page { --ng-accent: var(--color-accent); --ng-accent-soft: var(--color-accent-soft); }
body.nagornaya-page[data-chapter="1"] { --ng-accent: #2563eb; --ng-accent-soft: #eff6ff; }
body.nagornaya-page[data-chapter="2"] { --ng-accent: #059669; --ng-accent-soft: #ecfdf5; }
body.nagornaya-page[data-chapter="3"] { --ng-accent: #9333ea; --ng-accent-soft: #faf5ff; }
body.nagornaya-page[data-chapter="4"] { --ng-accent: #d97706; --ng-accent-soft: #fffbeb; }
body.nagornaya-page[data-chapter="5"] { --ng-accent: #e11d48; --ng-accent-soft: #fff1f2; }

html.dark body.nagornaya-page { --ng-accent-soft: rgba(var(--ng-accent-rgb),.12); --ng-bg-card: var(--color-surface); }
html.dark body.nagornaya-page[data-chapter="1"] { --ng-accent: #93c5fd; --ng-accent-soft: rgba(147,197,253,.12); }
html.dark body.nagornaya-page[data-chapter="2"] { --ng-accent: #6ee7b7; --ng-accent-soft: rgba(110,231,183,.12); }
html.dark body.nagornaya-page[data-chapter="3"] { --ng-accent: #c4b5fd; --ng-accent-soft: rgba(196,181,253,.12); }
html.dark body.nagornaya-page[data-chapter="4"] { --ng-accent: #fcd34d; --ng-accent-soft: rgba(252,211,77,.12); }
html.dark body.nagornaya-page[data-chapter="5"] { --ng-accent: #fda4af; --ng-accent-soft: rgba(253,164,175,.12); }

/* Fix body bg-stone-100 */
html.dark body.nagornaya-page { background-color: var(--color-canvas) !important; }
```

**Требует:** `data-chapter="N"` на `<body>` через 5 `index.astro`
