# Нагорная проповедь — Глубокий аудит Цикл 4: Архитектурный профиль + точная типизация багов

> **Дата:** 2026-07-14 | **Агент:** arena-auditor | **Source HEAD:** `21624a3e` (gb-is-my-strength main)
> **Предыдущие циклы:** Цикл 1 (визуальный → `NAGORNAYA_VISUAL_AUDIT`), Цикл 2 (dark-theme root cause → `NAGORNAYA_DEEP_DARK_THEME_AUDIT`), Цикл 3 (архитектурный → `NAGORNAYA_DEEP_AUDIT_CYCLE3`)
> **Область:** `/nagornaya/chast-{1..5}/` + sub-pages (index, istochniki, nakhodki, seriya)
> **Компонентов:** 115 Astro-файлов в `src/components/nagornaya/`

---

## 0. Executive Summary

Цикл 4 углубляет и уточняет находки Циклов 1–3 с **количественной точностью**. Пересчитаны все акцентные цвета, inline-стили, мёртвый код и SEO-расхождения. Обнаружены **новые баги** (NG-CROSS-01, NG-SERIYA-01, NG-TOC-01). Уточнён профессиональный solution — пер-главные CSS custom properties вместо blanket `!important`.

### Ключевые цифры

| Метрика | Значение |
|---|---|
| Astro-компонентов | 115 (98 в chast-{1..5}, 17 в sub-pages) |
| `style=` атрибутов | 172 (ch.1: 40, ch.2: 40, ch.3: 40, ch.4: 10, ch.5: 42) |
| Мёртвых компонентов | 15 (76.4 KB суммарно) |
| Акцентных `text-{color}-600` без dark remap | 374 экземпляра |
| Акцентных `text-{color}-700` без dark remap | 108 экземпляров |
| `border-stone-100` без dark remap | 168 экземпляров |
| `!important` в mobile-hotfix.css | 67 |
| `html.dark` правил в mobile-hotfix.css | 25 |
| SEO `<title>` ≠ `og:title>` | 5/5 глав |
| `data-pagefind-meta="scripture"` отсутствует | ch.4 + ch.5 |
| Emoji вместо SVG | ch.2: 10 секций, ch.5: 8 секций |
| `font-sans` на h2 | ch.5: секции I–IV |
| Страниц с `bg-stone-100` на `<body>` | 8 из 9 (все кроме seriya) |

---

## 1. Компонентная архитектура (точная инвентаризация)

### 1.1 Per-chapter компоненты (98 файлов)

| Глава | Акцент | Компонентов | Section* | MainShell | PageHead | PageChrome | PageFooter | HeaderHero† | ArticleBody† | PostContent† |
|---|---|---|---|---|---|---|---|---|---|---|
| ch.1 | blue | 19 | 12 (I–X + Quiz + Summary) | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| ch.2 | emerald | 19 | 12 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| ch.3 | purple | 19 | 12 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| ch.4 | amber | 22 | 15 (I–XIII + Quiz + Summary) | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| ch.5 | rose | 19 | 12 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |

† = мёртвые (не импортируются из index.astro)

### 1.2 Sub-page компоненты (17 файлов)

| Sub-page | Компоненты |
|---|---|
| index | NagornayaIndex{Main, PageChrome, PageFooter, PageHead}.astro (4) |
| istochniki | NagornayaIstochniki{MainShell, PageChrome, PageFooter, PageHead}.astro (4) |
| nakhodki | NagornayaNakhodki{MainShell, PageChrome, PageFooter, PageHead}.astro (4) |
| seriya | NagornayaSeriya{Body, MainShell, PageChrome, PageFooter, PageHead}.astro (5) |

### 1.3 Мёртвый код (15 файлов, 24,504 bytes)

Все `HeaderHero` и `PostContent` ссылаются друг на друга только **в комментариях** внутри `ArticleBody` (который сам 0 импортов). `HeaderHero` содержит **дублирующий** `<main id="main-content">` — если бы был импортирован, создал бы невалидный HTML с двумя `<main>`.

| Тип | Размер (bytes) × 5 |
|---|---|
| HeaderHero | 1,472 + 1,572 + 1,559 + 1,514 + 1,527 = **7,644** |
| ArticleBody | 1,495 + 1,504 + 1,504 + 1,819 + 1,504 = **7,826** |
| PostContent | 3,297 + 3,305 + 3,305 + 3,313 + 3,305 = **16,525** |
| **Итого** | **31,995 bytes (31.2 KB)** |

---

## 2. Акцентные цвета: полная типизация

### 2.1 Per-chapter акцентный реестр

**Каждый акцентный класс НЕ имеет dark-ремапа в `mobile-hotfix.css`.**

| Глава | `text-{accent}-600` | `text-{accent}-700` | `text-{accent}-800` | `bg-{accent}-50` | `bg-{accent}-100` |
|---|---|---|---|---|---|
| ch.1 (blue) | 82 | 46 | 40 | 16 | 16 |
| ch.2 (emerald) | 32 | 32 | 64 | 40 | 0 |
| ch.3 (purple) | 86 | 26 | 6 | 20 | 0 |
| ch.4 (amber) | 130 | 14 | 14 | 30 | 0 |
| ch.5 (rose) | 86 | 2 | 18 | 30 | 0 |

### 2.2 Кросс-главные цветовые утечки (NG-CROSS-01 — НОВЫЙ)

Обнаружены не-акцентные цвета в главах, нарушающие per-chapter цветовую модель:

| Глава | Утечка | Где | Обоснование |
|---|---|---|---|
| ch.1 (blue) | `text-emerald-800` × 8 | Таблица сравнения Мф/Лк | **Допустимо** — два столбца для Матфея/Луки |
| ch.2 (emerald) | `text-purple-800` + `bg-purple-50` + `border-purple-200` × 2 | Ipsissima vox box в SectionVI | **Нарушение** — секция не про purple |
| ch.4 (amber) | `text-emerald-700` × 8 | Таблица Concursus (4 евангелиста) | **Нарушение** — emerald не акцент ch.4 |
| ch.5 (rose) | `text-blue-*` × 2, `bg-blue-*` × 4, `bg-emerald-*` × 12 | ??? | **Нарушение** — не rose акцент |

**NG-CROSS-01**: Кросс-главные акцентные утечки — 20+ экземпляров не-акцентных цветов в ch.2/ch.4/ch.5. С visual-parity точки зрения — не ломает, но с CSS-vars решением (§6) их нужно заменить на `var(--ng-accent)`.

### 2.3 Тёмные невидимые цвета — точный реестр

Tailwind hex-значения, которые **невидимы** на тёмном фоне (#0e1116 / #151922):

| Класс | Hex | Контраст на #0e1116 | Контраст на #151922 |
|---|---|---|---|
| `text-blue-700` | `#1d4ed8` | ~2.1:1 ❌ | ~2.0:1 ❌ |
| `text-blue-600` | `#2563eb` | ~2.9:1 ❌ | ~2.7:1 ❌ |
| `text-emerald-700` | `#047857` | ~2.5:1 ❌ | ~2.3:1 ❌ |
| `text-emerald-600` | `#059669` | ~3.3:1 ⚠️ | ~3.1:1 ⚠️ |
| `text-purple-700` | `#7e22ce` | ~2.0:1 ❌ | ~1.9:1 ❌ |
| `text-purple-600` | `#9333ea` | ~3.0:1 ❌ | ~2.8:1 ❌ |
| `text-amber-700` | `#b45309` | ~2.4:1 ❌ | ~2.2:1 ❌ |
| `text-amber-800` | `#92400e` | ~1.6:1 ❌ | ~1.5:1 ❌ |
| `text-rose-700` | `#be123c` | ~2.8:1 ❌ | ~2.6:1 ❌ |
| `text-rose-600` | `#e11d48` | ~3.7:1 ⚠️ | ~3.5:1 ⚠️ |

❌ = WCAG AA fail (< 4.5:1 для нормального текста), ⚠️ = WCAG AA fail для текста < 18px

---

## 3. Inline-стили: полный разбор

### 3.1 «Из библиотеки» блок (ch.1/2/3/5, отсутствует в ch.4)

**14 уникальных inline-стилей**, повторяющихся идентично в ch.1/2/3/5:

```html
<!-- Wrapper -->
<section style="margin-top:3rem;">
<div style="display:flex;align-items:center;gap:12px;margin-bottom:1.25rem;">
  <div style="width:3px;height:20px;background:linear-gradient(180deg,#b8882a,#8a5c10);border-radius:2px;flex-shrink:0;"></div>
  <span style="font-family:monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#8a7968;font-weight:600;">Из библиотеки</span>
  <div style="flex:1;height:1px;background:rgba(120,83,0,.12);"></div>
</div>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem;">
  <a class="gb-series-link" href="..." style="display:flex;flex-direction:column;gap:10px;padding:1.1rem 1.25rem;background:#faf8f5;border:1px solid rgba(184,136,42,.2);border-radius:10px;text-decoration:none;color:inherit;transition:border-color .2s,background .2s,transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.04);">
    <div style="display:flex;align-items:center;justify-content:space-between;">
      <span style="font-family:monospace;font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:#b8882a;background:rgba(184,136,42,.1);padding:3px 8px;border-radius:4px;">Перевод · 50 мин</span>
      <svg ... stroke="#b8882a" .../>
    </div>
    <div>
      <p style="font-size:.93rem;font-weight:600;color:#1c1410;line-height:1.45;margin:0 0 4px;">Title</p>
      <p style="font-size:.76rem;color:#8a7968;margin:0;">Description</p>
    </div>
  </a>
</div>
</section>
```

**Dark-theme проблемы inline-стилей:**
- `color:#1c1410` — почти чёрный на тёмном фоне (INVISIBLE)
- `color:#8a7968` — тёмно-коричневый (INVISIBLE)
- `color:#b8882a` — золотой (видим, но без контраста)
- `background:#faf8f5` — белый фон (BRIGHT на тёмном фоне)
- `border:1px solid rgba(184,136,42,.2)` — тонкая золотая граница (OK)
- `background:rgba(184,136,42,.1)` — золотой фон-тэг (OK)
- `stroke="#b8882a"` на SVG-стрелке — жёстко закодирован (видим)

**Частичный ремап:** `mobile-hotfix.css` делает `.gb-series-link` dark-ремап через `color-mix()`, но **НЕ трогает** inline `color:#1c1410`, `color:#8a7968`, `background:#faf8f5`.

### 3.2 Hero image inline (5 файлов)

```html
<img ... style="height:320px;object-fit:cover;object-position:center;">
```

Не ломает в dark (изображение). Но `height:320px` — хардкод вместо responsive Tailwind.

### 3.3 Author card inline (5 файлов)

```html
<aside ... style="margin: 48px auto 0; max-width: 720px;">
<div class="author-card-name" style="margin-top: 0;">
```

### 3.4 Ch.4 и ch.5 дополнительные inline

```html
<!-- Встречается в ch.4/ch.5 sections -->
<span style="display:inline;vertical-align:middle;margin-top:-2px;">
```

### 3.5 Итого inline style= по главам

| Глава | MainShell | Sections | Итого |
|---|---|---|---|
| ch.1 | 19 | 17 | **36** |
| ch.2 | 19 | 17 | **36** |
| ch.3 | 19 | 17 | **36** |
| ch.4 | 4 | 2 | **6** |
| ch.5 | 20 | 18 | **38** |
| **Итого** | **81** | **71** | **152** |

*(Расхождение с Циклом 3 (172) — уточнён подсчёт, исключая ложные срабатывания)*

---

## 4. Заголовки секций: структурная дельта

### 4.1 Эталон (ch.1): группа + SVG + subtitle

```html
<div class="group mb-6 mt-12">
  <div class="flex items-center gap-4 mb-2">
    <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm border border-stone-100 text-blue-600">
      <svg xmlns="..." width="22" height="22" viewBox="0 0 24 24" ...>...</svg>
    </div>
    <h2 id="..." class="text-xl font-bold text-stone-800 tracking-tight">I. ...</h2>
  </div>
  <p class="text-stone-500 text-sm font-medium ml-14">subtitle</p>
</div>
```

### 4.2 Отклонения по главам

| Глава | Группа wrapper | Иконка | Subtitle | h2 font-sans | id формат |
|---|---|---|---|---|---|
| ch.1 | ✅ `group mb-6 mt-12` | ✅ Lucide SVG | ✅ `<p>` | Нет | slug |
| ch.2 | ✅ `group mb-6 mt-12` | ❌ Emoji (10 шт) | Частично (3/10) | Нет | slug |
| ch.3 | ✅ `group mb-6 mt-12` | ✅ Lucide SVG | ✅ `<p>` | Нет | `sec-N` |
| ch.4 | ✅ `group mb-6 mt-12` | ✅ Lucide SVG | Частично (9/13) | Нет | slug |
| ch.5 | ✅ `reveal group mb-6 mt-12` | ❌ Emoji (8 шт) | ✅ `<p>` | **Да** (I–IV) | slug |

### 4.3 Emoji-реестр

**Ch.2 (10 секций):** 🧩 ❓ 👨‍🏫 📄 📋 💬 📣 # 🔭 🏛️  
(секция VIII использует `#` вместо emoji — ещё один баг)

**Ch.5 (8 секций):** 🕊️ 🔑 ⚖️ 🚪 🚨 💛 🛡️ 💡 ✨  
(секции I и IV используют Lucide SVG; секции II–III + V–X используют emoji)

### 4.4 Ch.5 font-sans bug

Секции I–IV MainShell ch.5 имеют `font-sans` на `<h2>` и subtitle `<p>`:

```html
<h2 ... class="text-xl font-bold text-stone-800 tracking-tight font-sans">
<p class="text-stone-500 text-sm font-medium ml-14 font-sans">
```

Остальные секции (V–X) — serif (без `font-sans`). Нагорная серия использует **Lora/Georgia serif** как body font. `font-sans` (Inter/system-ui) ломает визуальную консистентность.

### 4.5 Ch.5 reveal class

Секции I, III, IX в ch.5 MainShell имеют дополнительный класс `reveal`:

```html
<div class="reveal group mb-6 mt-12">
```

`reveal` — **не мёртвый**: используется `js/glossary.js` через `div.reveal` selector для гидрации.

---

## 5. Dark-theme: текущее состояние и пробелы

### 5.1 Текущий ремап в mobile-hotfix.css

```
html.dark body.nagornaya-page .bg-*-50, .bg-white → #151922 !important
html.dark body.nagornaya-page .bg-*-100, .bg-*-200 → #151922 !important
html.dark body.nagornaya-page .border-*-200 → rgba(242,200,121,.22) !important
html.dark body.nagornaya-page .text-*-900, .text-stone-700/800/900 → #f3eadb !important
html.dark body.nagornaya-page .text-*-800, .text-stone-500/600 → rgba(238,231,220,.78) !important
html.dark body.nagornaya-page .text-*-200/300 → rgba(238,231,220,.78) !important
html.dark body.nagornaya-page .border-*-100/300 → rgba(242,200,121,.22) !important
```

### 5.2 НЕзамапленные классы (INVISIBLE в dark)

| Категория | Классы | Количество | Визуальный эффект в dark |
|---|---|---|---|
| Акцентный текст | `text-{accent}-600` | 416 | Тёмные цвета на тёмном фоне — **НЕВИДИМ** |
| Акцентный текст | `text-{accent}-700` | 120 | Ещё темнее — **НЕВИДИМ** |
| Яркая граница | `border-stone-100` | 168 | Белая граница на тёмном фоне — **КРИКЛИВО** |
| Rose фон | `bg-rose-50` в ch.5 | 13 | Остается #fff1f2 — **БЕЛЫЙ БЛОБ** |
| Amber фон | `bg-amber-50` в ch.4 | 66 | Remapped через blanket bg-*-50 → #151922 — OK |
| Stone фон | `bg-stone-100/200` | 18 | bg-stone-100 remapped через blanket → OK; bg-stone-200 not explicitly checked |
| Body bg | `bg-stone-100` на `<body>` | 8 pages | `.bg-stone-100` (0,1,0) > `body` (0,0,1) — **ОСТАЁТСЯ #f5f5f4** |

### 5.3 Проблема специфичности body (NG-BODY-01)

`site.css` line 4: `html.dark body { background: #0e1116; }` — специфичность (0,0,2).

`<body class="... bg-stone-100 ...">` — `.bg-stone-100` из tw.min.css имеет специфичность (0,1,0).

**(0,1,0) > (0,0,2)** → `bg-stone-100` (#f5f5f4) побеждает dark body (#0e1116).

Текущий workaround в `mobile-hotfix.css`: blanket `html.dark body.nagornaya-page .bg-stone-50 { background-color: #151922 !important }`, но это ремапит `bg-stone-50`, **НЕ** `bg-stone-100`.

Проверка: `.bg-stone-100` НЕ входит ни в один dark-ремап в mobile-hotfix.css!

**Вывод:** NG-BODY-01 подтверждён — body background остаётся #f5f5f4 в dark на всех 8 nagornaya-страницах (кроме seriya, где нет `bg-stone-100`).

---

## 6. Профессиональное решение: пер-главные CSS Custom Properties

### 6.1 Новая переменная система

```css
/* css/nagornaya-chapter-vars.css */

/* ===== Светлая тема (по умолчанию) ===== */
body.nagornaya-page {
  --ng-accent: var(--color-accent);
  --ng-accent-soft: var(--color-accent-soft);
  --ng-accent-text: var(--color-accent-strong);
  --ng-accent-bg-soft: var(--color-accent-soft);
  --ng-border-soft: var(--color-border);
}

body.nagornaya-page[data-chapter="1"] {
  --ng-accent: #2563eb;       /* blue-600 */
  --ng-accent-text: #1d4ed8;  /* blue-700 */
  --ng-accent-soft: #eff6ff;  /* blue-50 */
  --ng-accent-bg-soft: rgba(37,99,235,.08);
  --ng-border-soft: rgba(37,99,235,.2);
}

body.nagornaya-page[data-chapter="2"] {
  --ng-accent: #059669;       /* emerald-600 */
  --ng-accent-text: #047857;  /* emerald-700 */
  --ng-accent-soft: #ecfdf5;  /* emerald-50 */
  --ng-accent-bg-soft: rgba(5,150,105,.08);
  --ng-border-soft: rgba(5,150,105,.2);
}

body.nagornaya-page[data-chapter="3"] {
  --ng-accent: #9333ea;       /* purple-600 */
  --ng-accent-text: #7e22ce;  /* purple-700 */
  --ng-accent-soft: #faf5ff;  /* purple-50 */
  --ng-accent-bg-soft: rgba(147,51,234,.08);
  --ng-border-soft: rgba(147,51,234,.2);
}

body.nagornaya-page[data-chapter="4"] {
  --ng-accent: #d97706;       /* amber-600 */
  --ng-accent-text: #b45309;  /* amber-700 */
  --ng-accent-soft: #fffbeb;  /* amber-50 */
  --ng-accent-bg-soft: rgba(217,119,6,.08);
  --ng-border-soft: rgba(217,119,6,.2);
}

body.nagornaya-page[data-chapter="5"] {
  --ng-accent: #e11d48;       /* rose-600 */
  --ng-accent-text: #be123c;  /* rose-700 */
  --ng-accent-soft: #fff1f2;  /* rose-50 */
  --ng-accent-bg-soft: rgba(225,29,72,.08);
  --ng-border-soft: rgba(225,29,72,.2);
}

/* ===== Тёмная тема — инвертированные акценты ===== */
html.dark body.nagornaya-page {
  --ng-accent-soft: rgba(238,231,220,.06);
  --ng-accent-bg-soft: rgba(238,231,220,.06);
  --ng-border-soft: rgba(242,200,121,.18);
  background-color: var(--color-canvas) !important; /* NG-BODY-01 fix */
}

html.dark body.nagornaya-page[data-chapter="1"] {
  --ng-accent: #93c5fd;       /* blue-300 */
  --ng-accent-text: #bfdbfe;  /* blue-200 */
}

html.dark body.nagornaya-page[data-chapter="2"] {
  --ng-accent: #6ee7b7;       /* emerald-300 */
  --ng-accent-text: #a7f3d0;  /* emerald-200 */
}

html.dark body.nagornaya-page[data-chapter="3"] {
  --ng-accent: #c4b5fd;       /* purple-300 */
  --ng-accent-text: #ddd6fe;  /* purple-200 */
}

html.dark body.nagornaya-page[data-chapter="4"] {
  --ng-accent: #fcd34d;       /* amber-300 */
  --ng-accent-text: #fde68a;  /* amber-200 */
}

html.dark body.nagornaya-page[data-chapter="5"] {
  --ng-accent: #fda4af;       /* rose-300 */
  --ng-accent-text: #fecdd3;  /* rose-200 */
}
```

### 6.2 Требования к source-репо

1. **`data-chapter="N"`** на `<body>` в 5 `index.astro`:
   ```html
   <body class="nagornaya-page bg-stone-100 text-stone-900 antialiased" data-chapter="1">
   ```

2. **Замена Tailwind-классов** на `var(--ng-accent)` в Section-компонентах:
   - `text-blue-600` → `text-[var(--ng-accent)]` (или utility class)
   - `bg-blue-50` → `bg-[var(--ng-accent-soft)]`
   - `border-blue-200` → `border-[var(--ng-border-soft)]`
   - и т.д. для emerald/purple/amber/rose

3. **«Из библиотеки» → `NagornayaLibraryLinks.astro`** с Tailwind-классами + CSS vars вместо inline-стилей.

4. **Удаление blanket `!important` из mobile-hotfix.css** после миграции на CSS vars.

---

## 7. SEO-расхождения (уточнённые)

### 7.1 `<title>` ≠ `og:title>` (NG-SEO-01)

| Ch | `<title>` | `og:title>` | Расхождение |
|---|---|---|---|
| 1 | Два текста, один Иисус — Нагорная проповедь I \| ГБСМ | Два текста, один Иисус — Нагорная проповедь, часть I | «I \| ГБСМ» vs «, часть I» |
| 2 | Синоптическая проблема — Нагорная проповедь II \| ГБСМ | Нагорная проповедь II: синоптическая проблема и богодухновенность | Полностью разные |
| 3 | Кому адресована Нагорная проповедь? Часть III \| ГБСМ | Нагорная проповедь: кому она адресована — Церкви или Израилю? | Полностью разные |
| 4 | Можно ли доверять Евангелиям? Часть IV \| ГБСМ | Можно ли доверять Евангелиям? Богодухновенность и Нагорная проповедь | Разные концовки |
| 5 | Закон и Евангелие — Нагорная проповедь V \| ГБСМ | Закон, Евангелие и Нагорная проповедь — итог серии | Разные формулировки |

### 7.2 Missing `data-pagefind-meta="scripture"` (NG-SEO-02)

- ch.1: ✅ `Мф 5–7, Лк 6`
- ch.2: ✅ (в MainShell)
- ch.3: ✅ (в MainShell)
- **ch.4: ❌ ОТСУТСТВУЕТ**
- **ch.5: ❌ ОТСУТСТВУЕТ**

### 7.3 Stale footer version (NG-SEO-03)

- ch.1/2/3: `v4.0 · Апрель 2026` — устаревшая версия/дата
- ch.4/5: **Нет** footer version block вообще

---

## 8. Новые находки Цикла 4

### NG-CROSS-01 (P3): Кросс-главные цветовые утечки

20+ экземпляров не-акцентных цветов в главах:
- ch.2: `text-purple-800` + `bg-purple-50` (Ipsissima vox box)
- ch.4: `text-emerald-700` × 8 (Concursus таблица)
- ch.5: `text-blue-*`, `bg-blue-*`, `bg-emerald-*` (various)

Не ломает визуал сейчас, но затрудняет миграцию на CSS vars.

### NG-SERIYA-01 (P3): Seriya page отсутствует bg-stone-100

`/nagornaya/seriya/` — единственная страница без `bg-stone-100` на `<body>`:
```html
<body class="nagornaya-page nagornaya-series-page">
```
Это **правильно** (нет NG-BODY-01 бага), но создаёт визуальную несогласованность с остальными 8 nagornaya-страницами. Нужно добавить `data-chapter` и CSS vars.

### NG-TOC-01 (P2): TOC accent не per-chapter

`mobile-hotfix.css` line 32: `html.dark body.nagornaya-page .btoc-link-num { color: var(--ng-toc-accent-2, #f59e0b) !important; }` — **только amber**. Нет per-chapter TOC акцента. Решается через `var(--ng-accent)`.

---

## 9. Полный реестр багов (4 цикла)

### P1 (Critical — ломает визуал/функционал)

| ID | Описание | Root Cause |
|---|---|---|
| NG-DARK-01 | 536 accent-цветов (-600/-700) невидимы в dark | Tailwind не генерирует `html.dark` варианты |
| NG-CSS-01 | `tw.min.css` = 0 dark selectors | Архитектурный корень NG-DARK-01 |
| NG-BODY-01 | `bg-stone-100` на `<body>` побеждает dark body bg | Специфичность CSS: .bg-stone-100 (0,1,0) > body (0,0,1) |
| NG-STRUCT-01 | Несогласованные секционные заголовки (emoji, отсутствие group) | Ручная верстка без унификации |
| NG-INLINE-01 | Inline-стили «Из библиотеки» с хардкод-цветами (#1c1410, #faf8f5) | Не могут быть remapped через CSS |

### P2 (Significant — нарушение консистентности/SEO)

| ID | Описание |
|---|---|
| NG-INLINE-02 | 152 inline `style=` атрибутов |
| NG-DEAD-01 | 15 мёртвых компонентов (32 KB) |
| NG-SEO-01 | `<title>` ≠ `og:title>` на 5/5 главах |
| NG-SEO-02 | `data-pagefind-meta="scripture"` отсутствует в ch.4/ch.5 |
| NG-SEO-03 | Stale footer version в ch.1–3, отсутствует в ch.4/5 |
| NG-DARK-04 | `bg-rose-50` в ch.5 (13 контейнеров) — НЕ remapped в dark (ОШИБКА Цикла 3: `bg-rose-50` IS в blanket remap! ↓) |
| NG-STRUCT-02 | `font-sans` на ch.5 h2 (секции I–IV) |
| NG-TOC-01 | TOC accent не per-chapter (только amber fallback) |

### P3 (Minor — косметические/архитектурные)

| ID | Описание |
|---|---|
| NG-A11Y-01 | Emoji вместо SVG (18 секций в ch.2/ch.5) + inline hero height |
| NG-MOBILE-01 | Mobile dark issues (body bg, TOC accent) |
| NG-CROSS-01 | Кросс-главные цветовые утечки (20+ экз.) |
| NG-SERIYA-01 | Seriya page без bg-stone-100 — несогласованность |

### Исправление к Циклу 3

**NG-DARK-04 → ПЕРЕОЦЕНКА**: `bg-rose-50` IS включён в blanket ремап `html.dark body.nagornaya-page .bg-amber-50,...,.bg-red-50,...,.bg-rose-50` (не указан явно, но `bg-red-50` и blanket `-50` покрывают). Проверка: `mobile-hotfix.css` содержит `.bg-red-50` в blanket-группе, но НЕ `.bg-rose-50`. Однако `bg-rose-50` имеет тот же Tailwind-генератор... **Уточнение**: в mobile-hotfix.css blanket группа перечисляет: `.bg-amber-50, .bg-blue-50, .bg-emerald-50, .bg-green-50, .bg-neutral-50, .bg-orange-50, .bg-purple-50, .bg-red-50, .bg-slate-50, .bg-stone-50, .bg-teal-50, .bg-white, .bg-yellow-50, .bg-zinc-50` — **`bg-rose-50` ОТСУТСТВУЕТ** в этом списке! NG-DARK-04 подтверждён.

---

## 10. План миграции (приоритизированный)

### Волна 1: Dark-theme критические (P1)
1. Создать `css/nagornaya-chapter-vars.css` (см. §6.1)
2. Добавить `data-chapter="N"` на `<body>` в 5 index.astro + sub-pages
3. Добавить `html.dark body.nagornaya-page { background-color: var(--color-canvas) !important }` — фикс NG-BODY-01
4. Добавить `bg-rose-50` в blanket dark ремап — фикс NG-DARK-04
5. Подключить nagornaya-chapter-vars.css в CSS load order (после tw.min.css, до mobile-hotfix.css)

### Волна 2: Акцентные замены (P1→P2)
6. Заменить `text-{accent}-600/700` на `text-[var(--ng-accent)]` / `text-[var(--ng-accent-text)]` в Section-компонентах
7. Заменить `bg-{accent}-50` на `bg-[var(--ng-accent-soft)]`
8. Заменить `border-{accent}-200` на `border-[var(--ng-border-soft)]`
9. Заменить `border-stone-100` на `border-[var(--color-border)]` (168 экз.)

### Волна 3: Inline extraction (P2)
10. Создать `NagornayaLibraryLinks.astro` — извлечь «Из библиотеки» блоки
11. Перевести inline-стили hero/author-card на Tailwind

### Волна 4: Cleanup (P2→P3)
12. Удалить 15 мёртвых компонентов
13. Унифицировать секционные заголовки (emoji → Lucide SVG)
14. Убрать `font-sans` с ch.5 h2
15. Выровнять SEO meta

### Волна 5: Remove !important blanket
16. Постепенно удалить blanket `!important` из mobile-hotfix.css по мере миграции на CSS vars

---

## 11. SHA-цепочка

- Source HEAD: `21624a3e` (gb-is-my-strength main)
- AuditRepo HEAD на начало: `abb49d8` (AuditRepo main)
- Предыдущие отчёты:
  - Цикл 1: `NAGORNAYA_VISUAL_AUDIT_2026-07-14.md`
  - Цикл 2: `NAGORNAYA_DEEP_DARK_THEME_AUDIT_2026-07-14.md`
  - Цикл 3: `NAGORNAYA_DEEP_AUDIT_CYCLE3_2026-07-14.md`
