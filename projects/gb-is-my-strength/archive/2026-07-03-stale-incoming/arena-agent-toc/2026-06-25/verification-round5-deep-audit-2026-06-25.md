# Verification Round 5 — Deep Audit — 2026-06-25

**Агент:** Arena Agent TOC (только верификация, без пушей)  
**HEAD:** `30b2031` (main)  
**Метод:** static analysis, Python grep, subprocess, cross-reference

---

## Новые находки

### 🔴 CONFIRMED: matrix.json karty holding pages — неверный mode

**Файл:** `migration/route-migration-matrix.json`  
**Severity:** HIGH (audit gate сломан)

`/karty/early-church/`, `/karty/maccabim/` и 6 других holding страниц:
```json
"mode": "strict-native-app"
"requiredMarkers": ["data-pagefind-body"]  ← НЕВЕРНО
```

`KartyHoldingPage.astro` рендерит `data-pagefind-ignore`, **не** `data-pagefind-body`. Это корректно для holding pages — они не должны индексироваться. Но matrix требует `data-pagefind-body` → audit guard ЛОМАЕТСЯ при проверке.

**Root cause:** P0.4 fix был применён ранее (переименовали в `strict-native-holding-page`), но при rebases вернулся к `strict-native-app`. **Регрессия P0.4.**

**Дополнительно:** В route source files (`src/pages/karty/early-church/index.astro`) есть `data-pagefind-body="true"` как Astro prop — но `KartyHoldingPage` его не принимает в Props interface и игнорирует. Мёртвый prop.

---

### 🔴 CONFIRMED: P1-15 — gbs2-sheet TOC pane пуста у baptisty

**Файлы:** `baptisty-rossii/*/index.html` (10 страниц)  
**Severity:** HIGH (UX — сломанная навигация)

gbs2-sheet имеет два таба: "Части" и "Оглавление".  
`data-gbs2-pane="toc"` `<nav>` содержит **0 символов**:
```html
<nav class="gbs2-sheet-pane" data-gbs2-pane="toc" aria-label="Оглавление части"></nav>
```

`enhancements.js` открывает/закрывает sheet, но не заполняет TOC pane. `site.js` не ищет `data-gbs2-pane="toc"`. Ни один скрипт не строит TOC для baptisty articles.

**Пользователь:** открывает sheet → "Оглавление" → пустая вкладка.

---

### ✅ CONFIRMED FIXED: P1-14 gbs2-theme wiring

`floating-cluster-controller.js` имеет глобальный capture listener:
```js
document.addEventListener('click', function(e) {
  if (e.target.closest('[data-gbs2-theme]')) { toggleTheme(); }
}, true);
```
**P1-14 FIXED** нашими предыдущими правками.

---

### 🟡 NEW-TOC-10: /rodosloviye/ circular self-link

**Файл:** `src/components/rodosloviye/RodosloviyeBody.astro`  
**Severity:** MEDIUM (UX — circular navigation)

Страница `/rodosloviye/` содержит:
```html
<a class="btn btn-primary" href="/rodosloviye/">Открыть родословие</a>
```
Это циклическая ссылка — кнопка ведёт на ту же страницу. Вероятно, нужна ссылка на `/karty/` или на отдельную страницу с React tree.

**Дополнительно:** комментарий в `index.astro` говорит "Interactive React family tree", но `RodosloviyeBody.astro` не содержит никакого React импорта или `client:` directive. Страница — статический placeholder.

---

### ✅ FALSE POSITIVE (закрыт): OG image:type в Gill PageHead

**Предыдущий отчёт NEW-TOC-*** некорректно сообщал об OG type mismatch.  
**Реальная ситуация:** Все Gill PageHead используют `og:image:type="image/webp"` корректно.  
Ошибка была в regex: он захватил `og:image:alt` content вместо `og:image:type` content.

---

## Верификация карты P1-14/15/16

| Sub-bug | Status | Evidence |
|---|---|---|
| P1-14 gbs2 controls unwired | ✅ FIXED | Global capture listener in fc-controller |
| P1-15 TOC pane empty | ❌ CONFIRMED | `<nav data-gbs2-pane="toc">` = 0 chars in all 10 baptisty |
| P1-16 progress tracking | ⚠️ SUSPECTED | `gbs2Pct`, `gbs2Curbar` no update script found; enhancements.js has partial wiring |

---

## Другие области проверки

### native:runtime:audit:strict ✅

Проходит без ошибок. 51 strict-native routes, 1 legacy-shadow-app-intentional (`/konfessii/russkij-baptizm/_app/`).

### SW CACHE_VERSION ⚠️

`cache-bust.js` **не обновляет** CACHE_VERSION в `sw.js` (P2-4, известный). `CACHE_VERSION = gb-v176-floating-cluster-gill-all-20260625` — не менялась при последних правках SW precache.

### data:consistency ✅

Проходит. Но не проверяет readTime drift для nagornaya в series.json (NEW-TOC-7).

### Nagornaya series.json readTime ⚠️

```json
nagornaya.parts[0].readTime = null  // должно быть 16
nagornaya.parts[1].readTime = null  // должно быть 11
...
```
search-manifest.json имеет правильные значения. Дрейф данных.

---

## Сводная таблица всех открытых багов (верифицированных мной)

| ID | Severity | Status | Description |
|---|---|---|---|
| NEW-TOC-1 | 🔴 HIGH | OPEN | P0-7/P0-8 REGRESSED — site-layered + site-modules вернулись в SW |
| NEW-TOC-2 | 🔴 HIGH | OPEN | SW precache /pagefind/pagefind.js — файл не существует |
| matrix karty | 🔴 HIGH | OPEN | mode=strict-native-app для holding pages (должен быть holding-page) |
| P1-15 | 🔴 HIGH | OPEN | baptisty gbs2-sheet TOC pane empty |
| NEW-TOC-3 | 🟡 MED | OPEN | GillPart1 #sec-personal-credo дублируется в TOC |
| NEW-TOC-4 | 🟡 MED | OPEN | GillPart3 sec-wesley не в HEAD (Round6 fix не запушен) |
| NEW-TOC-5 | 🟡 MED | OPEN | 14 Astro files stale controller hash efd81d3a→58c2ea90 |
| NEW-TOC-10 | 🟡 MED | OPEN | /rodosloviye/ circular self-link + stale React comment |
| NEW-TOC-7 | 🟢 LOW | OPEN | Nagornaya series.json readTime=null для 5 частей |
| NEW-TOC-8 | 🟢 LOW | OPEN | baptisty spravochnik series=27 vs manifest=8 |
| NEW-TOC-9 | ℹ️ INFO | OPEN | PS-08 interactive-audit misses .gb-theme-toggle |
| BUG-026 | 🟡 MED | OPEN | Baptisty BreadcrumbList missing в JSON-LD |
| BUG-027 | 🟡 MED | OPEN | Baptisty SVG og:image (все 11 страниц) |
| P2-4 | 🟢 LOW | OPEN | SW CACHE_VERSION не обновляется cache-bust.js |

**Закрытые в этом раунде:**
- OG image:type Gill → FALSE POSITIVE
- articles/ broken links → FALSE POSITIVE (relative paths)
- rodosloviye no React → намеренный static placeholder
- P1-2 sitemap → FALSE POSITIVE
- P1-8 double init → FALSE POSITIVE
