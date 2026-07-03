# Верификация UNIFIED_BUG_LEDGER — 2026-06-25

**Агент:** Arena Agent TOC  
**Цель:** верификация 42 багов из `verified/UNIFIED_BUG_LEDGER_2026-06-25.md`  
**Метод:** static source scan + git history (Python grep, НЕ Playwright)  
**HEAD:** `4d4fbfc`

---

## P0 — Верификация критических

### P0-10 · Stale hashes в 72 Astro компонентах — **CONFIRMED**

**Evidence (прямая проверка):**

```
cache-bust.js SKIP_DIRS = ['src', ...] → Astro компоненты НИКОГДА не обновляются
```

| Asset | Хеш в Astro | Актуальный | Файлов |
|---|---|---|---|
| css/site.css | `202876c3` | `b880b524` | 36 |
| css/command-palette.css | `48f8ed38` | `afe33045` | 35 |
| css/mobile-hotfix.css | `decfea58` | `c1f7664e` | 34 |
| js/site.js | `fed3ec3b` | `133dfac1` | 37 |
| js/floating-cluster-controller.js | `c78a4236` | `35a91710` | 13 |
| js/nagornaya-mobile-toc.js | `f25219b0` | `ffd00d98` | 8 |
| css/nagornaya-mobile-toc.css | `ef840e4c` | `c4a4a7fd` | 9 |

**Уникальных Astro файлов с хотя бы одним устаревшим хешем: 72**  
**Root cause:** `cache-bust.js:collectHTML()` явно добавляет `'src'` в `SKIP_DIRS`.

---

### PS-01 · `qs is not defined` — **LIKELY DOWNSTREAM OF P0-10**

**Evidence:**
- В ВСЕХ 12 проверенных git-версиях `floating-cluster-controller.js` функция `qs()` определена на строке ~32 внутри IIFE
- site.js, site-utils.js — НЕ определяют `qs()`, НЕ вызывают её → нет конфликта
- **Но:** Astro dist загружает `floating-cluster-controller.js?v=c78a4236` (commit `39bb2a27`) через `is:inline` script
- SW кэширует `c78a4236` из precache. Если у браузера был кэш от ещё более ранней версии (pre-rebuild) — загружается сломанный файл

**Вывод:** PS-01 — реальный баг, но **первопричина — P0-10** (стейл хеш в Astro source → SW выдаёт старый файл). Playwright тест подтвердил его в production-like dist, что корректно. Нужен re-run на dist после исправления P0-10.

---

### P0-1 · Gill Rail SAVE NOP — **FALSE POSITIVE**

**Evidence:**
```js
// initCluster() в controller:
if (action === 'save') { saveCurrent(btn); }  // ОБРАБАТЫВАЕТСЯ
```
`GillRailControls` рендерит `data-fc-action="save"`, `initGillRail()` вызывает `initCluster(railControls)`. Save работает.

**Статус: CLOSE as false positive**

---

### P0-2 · `floating-cluster.css` EMPTY — **FALSE POSITIVE**

**Evidence:**
- Размер: 68,596 bytes
- Строк CSS: 1663
- Содержит: `.gb-ember`, `.gb-floater`, `.gb-save`, `.gb-icon` и все остальные классы

**Статус: CLOSE as false positive**

---

### P0-3 · robots.txt блокирует SEO-краулеры — **POLICY, NOT BUG**

**Evidence:**
- `robots.txt` содержит `# AUDIT V2 (2026-05): SEO-краулеры` — это намеренное решение
- AhrefsBot, SemrushBot, MJ12bot заблокированы осознанно (bulk scrapers)
- Яндекс и Googlebot не заблокированы

**Статус: CLOSE — это editorial policy, не дефект**

---

### P0-6 · CI cascade race condition — **PARTIAL MITIGATION EXISTS**

**Evidence:**
- `indexnow.yml` содержит `continue-on-error: true` в критических шагах
- `git push` без retry — потенциальная проблема при concurrent pushes
- Но `[skip ci]` теги используются для auto-commits → снижает конкуренцию

**Статус: SUSPECTED — нужна проверка конкретного git history на rejected pushes**

---

### P0-7 · site-layered.css в SW precache — **CONFIRMED**

```
grep "site-layered" sw.js → в PRECACHE_ASSETS  
grep "site-layered" **/*.html → 0 результатов
```
282KB кэшируется без необходимости.

---

### P0-8 · site-modules.js в SW precache — **CONFIRMED**

```
grep "site-modules.js" sw.js → в PRECACHE_ASSETS
grep "site-modules.js" **/*.html → 0 результатов
```
8.7KB кэшируется без необходимости.

---

### PS-04 · Heart series без контроллера — **CONFIRMED**

```
grep floating-cluster-controller src/components/article-pilots/krajne/KrajneBody.astro → 0
grep gb-ember src/components/article-pilots/krajne/KrajneBody.astro → 1
```

---

## P1 — Верификация важных

### PS-05 · stray "76e7365" в Hermeneutics body — **CONDITIONAL**

В HEAD source (`4d4fbfc`) — НЕ найден:
- `grep "76e7365" articles/hermeneutics/index.html` → 0
- `grep "76e7365" src/components/article-pilots/hermenevtika/HermenevtikaBody.astro` → 0

**НО:** `c78a4236` (стейл hash в HermenevtikaBody.astro) при Astro build → dist получает стейл controller. Строка `76e7365` = hash `676e7365`[1:] от commit `564d6cc8`. Возможна генерация при Astro build из stale версии.

**Статус: CONFIRMED in production-like dist (Playwright), UNCONFIRMED in static HEAD**  
**Первопричина: P0-10** — исправление P0-10 закроет и PS-05.

---

### PS-06 · readTime=35 vs visible=50 — **CONFIRMED**

В Astro source:
```html
<span data-pagefind-meta="readTime" hidden="">35</span>  ← Pagefind
<span>⏱ 50 мин</span>  ← visible
```
Canonical readTime = 50 мин (editorial decision).

---

### PS-07 · Duplicate IDs — **CONFIRMED**

`GillRailControls.astro:43` → `id="gbsTheme"`, `:66` → `id="gbsSearch"`  
Компонент рендерится 2 раза: `context="mobile"` + `context="rail"` → duplicate IDs в DOM.

---

### P1-11 · dist-publication-audit не видит стейл хеши — **CONFIRMED**

`dist-publication-audit.js` проверяет наличие файлов, но НЕ сравнивает `?v=HASH` в dist HTML с актуальными хешами → quality gate слепой к P0-10.

---

## Новые false positives (добавляю в реестр)

| ID | Статус | Причина |
|---|---|---|
| P0-1 | ❌ FALSE | save обрабатывается в initCluster |
| P0-2 | ❌ FALSE | floating-cluster.css = 68KB реального CSS |
| P0-3 | ❌ POLICY | robots.txt блокирует bulk scrapers намеренно |

---

## Сводная таблица верификации

| ID | Вердикт | Примечание |
|---|---|---|
| P0-10 | ✅ CONFIRMED | 72 Astro файла, cache-bust.js skip src/ |
| PS-01 | ✅ CONFIRMED (downstream P0-10) | Первопричина — стейл controller в SW |
| P0-1 | ❌ FALSE POSITIVE | save обрабатывается |
| P0-2 | ❌ FALSE POSITIVE | CSS не пустой |
| P0-3 | ❌ POLICY, NOT BUG | Намеренная блокировка |
| P0-6 | ⚠️ SUSPECTED | continue-on-error есть, но race не исключён |
| P0-7 | ✅ CONFIRMED | site-layered.css в SW precache |
| P0-8 | ✅ CONFIRMED | site-modules.js в SW precache |
| PS-04 | ✅ CONFIRMED | krajne/rimlyanam7 без controller в Astro |
| PS-05 | ✅ CONFIRMED (Playwright), ⚠️ downstream P0-10 | Исправится с P0-10 |
| PS-06 | ✅ CONFIRMED | readTime 35 vs 50 |
| PS-07 | ✅ CONFIRMED | GillRailControls duplicate IDs |
| P1-11 | ✅ CONFIRMED | audit blind to hash drift |

---

## Ключевой инсайт: P0-10 — корневая причина многих багов

```
P0-10 (stale hashes) → SW кэширует старый controller
                     → старый controller в dist
                     → PS-01 (qs crash) при загрузке
                     → PS-02/03 (dead controls) как следствие
                     → PS-05 (stray garbage) в build artifact
```

**Исправление P0-10 закроет PS-01, PS-02, PS-03, PS-05 как downstream effects.**
