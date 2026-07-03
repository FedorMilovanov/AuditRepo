# Verification Round 4 — New Bug Discovery — 2026-06-25

**Агент:** Arena Agent TOC (верификатор — без пушей)  
**Метод:** static source analysis, Python grep, cross-reference  
**HEAD:** `30b2031` (main)  
**Цель:** верификация отчётов других агентов + самостоятельный поиск

---

## Верификация отчётов других агентов

### arena-agent-2 (reverify @ 03e01a0)

| Пункт | Вердикт | Evidence |
|---|---|---|
| PS-01 FIXED | ✅ CONFIRMED | qs() inside IIFE at line 32; node repro passes |
| P0-7/P0-8 FIXED | ⚠️ REGRESSED | `site-layered.css` и `site-modules.js` вернулись в SW precache (see NEW-TOC-1) |
| PS-07 FIXED | ✅ CONFIRMED | 0 id="gbsTheme/gbsSearch" в GillRailControls.astro |
| V2-1 FIXED | ✅ CONFIRMED | root HTML broken TOC = 0, Astro TOC = 0 broken |
| V2-4 FIXED | ✅ CONFIRMED | feed.xml pubDates — correct weekdays |
| P0-10 downgrades | ✅ CONFIRMED | 14 Astro files with efd81d3a vs actual 58c2ea90 |
| V2-2 V2-3 FIXED claim | ⚠️ PARTIAL | V2-2: Astro OK, root HTML still stale; V2-3: not in HEAD |

### arena-agent-round6

| Пункт | Вердикт |
|---|---|
| V2-1 sec-early-years wrapper | ❌ NOT IN HEAD — Round6 had no git push |
| V2-2 data-fontsize buttons | ✅ IN ASTRO source (confirmed). Root HTML stale (non-critical) |
| sec-wesley in Part3 | ❌ NOT IN HEAD — Round6 had no git push |
| V2-3 Avraam skip-link | ✅ Fixed by other agents |

---

## Новые баги — найдены самостоятельно

### 🔴 NEW-TOC-1 — REGRESSION: P0-7/P0-8 — site-layered.css + site-modules.js вернулись в SW precache

**Severity:** HIGH (регрессия)  
**Файл:** `sw.js`

Баги P0-7 и P0-8 были исправлены ранее (убраны из `PRECACHE_ASSETS`). Но в текущем HEAD `30b2031` оба файла **снова присутствуют**:

```
sw.js PRECACHE_ASSETS contains:
  /css/site-layered.css  ← P0-7 regressed
  /js/site-modules.js    ← P0-8 regressed
```

Вероятная причина: другой агент перегенерировал или отредактировал `sw.js` и вернул удалённые строки.

**Проверка:** `grep "site-layered\|site-modules" sw.js` → оба найдены.

---

### 🔴 NEW-TOC-2 — SW precache: `/pagefind/pagefind.js` не существует

**Severity:** HIGH (SW install failure)  
**Файл:** `sw.js`

`sw.js` `PRECACHE_ASSETS` содержит `/pagefind/pagefind.js` (28-й из 29 ассетов). Файл **не существует** ни в корне репо, ни в `dist/`:

```
/pagefind/pagefind.js exists: False
dist/pagefind/pagefind.js exists: False
```

При первой загрузке страницы SW пытается прекэшировать этот URL → получает 404 → SW install может упасть → offline-режим не работает вообще.

**Проверка:** `node -e "require('fs').existsSync('pagefind/pagefind.js') && console.log('ok')"` → ничего.

---

### 🟡 NEW-TOC-3 — GillPart1PageChrome: дублированный TOC anchor `#sec-personal-credo`

**Severity:** MEDIUM (UX — неправильная навигация)  
**Файл:** `src/components/article-pilots/gill-part1/GillPart1PageChrome.astro`

В TOC два разных элемента ссылаются на одинаковый `#sec-personal-credo`:

```
1. "Три личных высказывания: человек за богословом"    → #sec-personal-credo ✅ (правильно)
2. "Личная духовность: молитва, медитация и домашнее б." → #sec-personal-credo ❌ (должен быть другой id)
```

Второй TOC-пункт раньше ссылался на `#sec-gill-spirituality` — его переименовали в `#sec-personal-credo` но не создали отдельный `id` для раздела про духовность. Кликая на второй пункт пользователь попадает на начало первой секции.

---

### 🟡 NEW-TOC-4 — GillPart3ArticleBody: `sec-wesley` отсутствует в body

**Severity:** MEDIUM (broken TOC link)  
**Файл:** `src/components/article-pilots/gill-part3/GillPart3ArticleBody.astro`

Round6 агент заявил об исправлении (добавлен `<h3 id="sec-wesley">`), но коммит не был запушен. В HEAD:

```
grep 'id="sec-wesley"' GillPart3ArticleBody.astro → 0 results
```

TOC в `GillPart3PageChrome.astro` ссылается на `#sec-wesley`. Клик → scroll к несуществующему якорю → страница не прокручивается.

---

### 🟡 NEW-TOC-5 — P0-10 остаточный: 14 Astro компонентов с устаревшим хешем контроллера

**Severity:** MEDIUM (stale JS в dist)  
**Файлы:** 14 Astro компонентов

После PS-01 fix контроллер изменился: `efd81d3a` → `58c2ea90`. Но `cache-bust.js` для src/ не запускался → 14 Astro компонентов всё ещё содержат старый hash:

```
floating-cluster-controller.js?v=efd81d3a  (stale)
floating-cluster-controller.js?v=58c2ea90  (actual)

Affected (14): AntisovetovBody, GillContextPageChrome, GillPart2-3PageChrome,
GillSpravochnikPageChrome, HermenevtikaBody, KodDaVinchiPageFooter,
KrajneBody, Rimlyanam7Body, NagornayaChast1-5PageFooter
```

В Astro dist пользователи получат старый controller из SW cache при переходе.

---

### 🟢 NEW-TOC-6 — V2-2 Nagornaya root HTML устарел (non-critical)

**Severity:** LOW  
**Файлы:** `nagornaya/chast-{1-5}/index.html`

Astro source PageChrome: `data-fontsize="down/up"` добавлен ✅  
Root HTML: `id="nagFontDec/Inc"` без `data-fontsize` — старый markup.

В production dist из Astro — правильно. Root HTML — legacy artifact. Не критично для production, критично для тестов на root HTML.

---

### 🟢 NEW-TOC-7 — `series.json` nagornaya: нет `readTime` для частей 1–5

**Severity:** LOW (data completeness)  
**Файл:** `data/series.json`

```json
nagornaya.parts[0].readTime = null  (should be 16)
nagornaya.parts[1].readTime = null  (should be 11)
...
```

`search-manifest.json` имеет правильные значения (16, 11, 12, 25, 25). `series.json` не заполнен. Сервисы которые читают `series.json` для readTime (e.g. series-cards.js) получат null.

---

### 🟢 NEW-TOC-8 — Baptisty spravochnik: series.json=27 vs search-manifest=8

**Severity:** LOW (metadata drift)  
**Файлы:** `data/series.json`, `data/search-manifest.json`

```
russian-baptism.parts[9].slug=spravochnik
  series.json readTime: 27 мин
  search-manifest readTime: 8 мин
```

Canonical readTime неясен. Нужно определить: 8 мин (короткий справочник) или 27 мин.

---

### ℹ️ NEW-TOC-9 — PS-08: interactive-audit не видит новые premium theme selectors

**Severity:** INFO (tooling drift)  
**Файл:** `scripts/interactive-audit.js`

Audit ищет:  
`'.gbs2-mctl[data-gbs2-theme]', '.gbs2-ctl[data-gbs2-theme]', '.gb-fc-theme'`

Не ищет:  
`.gb-theme-toggle`, `#gbFcTheme`, `#gbsTheme`

→ Audit ложно сообщает что тема не работает на premium pages.

---

## Подтверждённые FALSE POSITIVES (закрытые в этом раунде)

| ID | Verdict | Evidence |
|---|---|---|
| P1-2 sitemap incomplete | ❌ FALSE | Все 9 "missing" = noindex holding karty + protected /_app/ |
| P1-8 double initGillRail | ❌ FALSE | 1 вызов в ready(), 1 = объявление функции |
| P1-1 site.js без guard | ❌ FALSE | site.js проверяет #gbFloatingControls И [data-fc-root] до создания |

---

## Статус ранее открытых P0/P1

| Bug | Current Status |
|---|---|
| PS-01 qs crash | ✅ FIXED |
| P0-10 hash bomb | ⚠️ PARTIAL — 14 files stale controller |
| P0-7 site-layered SW | 🔴 REGRESSED |
| P0-8 site-modules SW | 🔴 REGRESSED |
| NEW-TOC-2 pagefind SW | 🔴 NEW HIGH |
| PS-06 readTime | ✅ FIXED in Astro, root HTML stale |
| V2-1 TOC anchors | ✅ FIXED (root HTML + Astro TOC) |
| V2-2 font buttons | ✅ FIXED in Astro, root HTML stale |
| V2-4 feed weekdays | ✅ FIXED |
| BUG-026/027 baptisty | 🔴 STILL OPEN |
| P1-13 gbs2-theme | ✅ FIXED |
