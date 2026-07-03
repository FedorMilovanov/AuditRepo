# Arena Deep Auditor — Pass 22 Report (2026-07-03)

**Source HEAD:** `bba171af` (gb-is-my-strength main)  
**AuditRepo HEAD:** `6972b646`  
**Scope:** Full source code deep audit — JS, SW, CI workflows, scripts, data consistency, AuditRepo

---

## 🔴 NEW P0 — CRITICAL (3 новых бага)

### P0-FC-REC: `addCleanListener()` бесконечная рекурсия — Floating Cluster мёртв

**Файл:** `js/floating-cluster-controller.js:47`  
**Регрессия BUG-001 fix (коммит `36003b91`)**

```javascript
function addCleanListener(target, type, fn, options) {
    if (!target || !target.addEventListener) return;
    var opts = options;
    if (abortCtrl) {
      // ... формирует opts с signal ...
    }
    addCleanListener(target, type, fn, opts);  // ← СТРОКА 47: РЕКУРСИЯ В САМУ СЕБЯ
    _registeredListeners.push({ target, type, fn, opts: options });
}
```

Функция вызывает **сама себя** вместо `target.addEventListener(type, fn, opts)`. Это мгновенный `RangeError: Maximum call stack size exceeded`. Функция вызывается 39 раз в коде — ни один слушатель не регистрируется.

**Доказательство:**
- `addEventListener` встречается в файле 2 раза: строка 36 (проверка `target.addEventListener`) и строка 70 (DOMContentLoaded)
- `addCleanListener` встречается 39 раз — и каждый уходит в бесконечную рекурсию
- Всё, что зависит от floating cluster, неработоспособно: тема, TTS, TOC, scroll progress, overlay, share, favorites, font controls

**Исправление:** Заменить `addCleanListener(target, type, fn, opts);` на `target.addEventListener(type, fn, opts);`

---

### P0-FC-ABORT: AbortController одноразовый — повторная инициализация невозможна

**Файл:** `js/floating-cluster-controller.js:32-33`

```javascript
var abortCtrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
```

`abortCtrl.abort()` — одноразовая операция. После `_fcCleanupListeners()`:
1. Все listeners сняты навсегда
2. `window._fcAbortController` установлен в `null`
3. При повторной инициализации (HMR, SPA-навигация) создаётся `new AbortController()`, но **старые listeners уже удалены**, а новые **не регистрируются** (из-за BUG-FC-REC)
4. Даже после фикса рекурсии: если `_fcCleanupListeners()` уже вызвался, `abortCtrl` = null, и новый `addCleanListener` не добавит `signal` к options → listeners не будут очищены при следующем cleanup

**Исправление:** После `abortCtrl.abort()` нужно создавать **новый** `AbortController` и присваивать его `window._fcAbortController`.

---

### P0-SW-DRIFT: PRECACHE_ASSETS в sw.js не синхронизирован с cache-bust-assets.js

**Файлы:** `sw.js` (строка 1), `scripts/cache-bust-assets.js`

Три независимых списка asset-ов, которые должны быть консистентными:

| Список | Файл | Количество | Источник |
|--------|------|-----------|----------|
| `ASSETS` | `cache-bust-assets.js` | 19 | Single source of truth |
| `ALLOWED_JS/CSS` | `audit-pro.js` | 12 JS + 7 CSS | Audit whitelist |
| `PRECACHE_ASSETS` | `sw.js` | 26 | Hardcoded |

**Дрифт уже существует:**
- `sw.js` включает `manifest.json`, `favicon.ico`, `favicon-48.png`, `apple-touch-icon.png`, `404.html`, `pagefind/pagefind.js`, `data/search-manifest.json` — **отсутствуют** в `cache-bust-assets.js`
- `cache-bust-assets.js` включает `js/modules/back-to-top.js` — **отсутствует** в `sw.js` PRECACHE
- Порядок CSS/JS файлов отличается (в SW: `search.js` после `highlights.js`, в cache-bust — наоборот)
- Нет автоматической проверки синхронизации этих списков

**Последствие:** При деплое новые assets не попадут в SW precache → пользователи получают stale-версии.

---

## 🟠 NEW P1 — HIGH PRIORITY (5 новых багов)

### P1-SITE-XSS: innerHTML с непроверенными данными из JSON

**Файл:** `js/site.js`

```javascript
// Строка 288: original-words card — w.original, w.definition не экранированы
owCard.innerHTML = '<div ...>' + w.original + '</div>...' + w.definition + '...';

// Строка 484: backlinks — n.title не экранирован  
a.innerHTML = n.title + '<small>' + (groupNames[n.group]||"") + '</small>';

// Строка 309: next-suggest — href подставлен без санитизации
el.innerHTML = '...<a ... href="' + href + '">...';
```

`search.js` имеет `F()` (HTML-escape) и `safeUrl()`, но они **не применяются** к backlinks, original-words, next-suggest. Если JSON-файлы (`links-graph.json`, `words.json`, `series.json`) содержат `<script>` или `onerror=`, это выполнится.

---

### P1-LAYERED-CSS: 283KB мёртвый файл `css/site-layered.css`

**Файл:** `css/site-layered.css` (283 706 байт)

- Почти точная копия `css/site.css` (283 648 байт) с `@layer`-обёртками
- **Нигде не подключён:** ни в HTML, ни в Astro, ни в SW precache, ни в `<link>` тегах
- Проверяется `audit-pro.js` (строка 228: `routeScopedCss` включает `site-layered.css`) — но проверяет файл, который **не используется в продакшн**
- `!important`-счётчик (IMPORTANT_CEIL = 202) считается для `site-layered.css`, а не для реального `site.css`
- 283KB мёртвого кода в репозитории

---

### P1-CI-DUPE: Дублирование npm ci + cache-bust в IndexNow и Deploy

**Файлы:** `.github/workflows/indexnow.yml`, `.github/workflows/deploy.yml`

При каждом пуше в main:
1. `indexnow.yml` → `npm ci` + `cache-bust` + validate + git push
2. `deploy.yml` → `npm ci` + `cache-bust` + Astro build + Playwright + deploy

Это 2× `npm ci` + 2× cache-bust + полный Astro build + Playwright = **20–30 мин CI** на каждый пуш. Деплой зависит от `workflow_run` → ждёт завершения indexnow.

---

### P1-DEPLOY-FAIL: deploy.yml запускается даже при падении indexnow

**Файл:** `.github/workflows/deploy.yml`

```yaml
if: >
  github.event_name == 'workflow_dispatch' ||
  github.event_name == 'push' ||
  github.event.workflow_run.conclusion == 'success' ||
  github.event.workflow_run.conclusion == 'failure'  # ← ДЕПЛОЙ ПРИ ПАДЕНИИ
```

Если `indexnow.yml` упал из-за бага в `cache-bust.js` или `update-meta.js`, то в `main` — коммит с битыми хешами, и `deploy.yml` деплоит именно его.

---

### P1-BACK-TOP: `js/modules/back-to-top.js` не кэшируется SW и не cache-bust'ится

- **Не включён** в `PRECACHE_ASSETS` в `sw.js` → не кэшируется при install
- **Не включён** в `ASSETS` в `cache-bust-assets.js` → hash не проставляется → cache-bust не работает
- Включён в `ALLOWED_JS` в `audit-pro.js` → аудит считает его существующим, но SW его не кэширует

---

## 🟡 NEW P2 — MEDIUM PRIORITY (9 новых багов)

### P2-AUDIT-DRIFT: audit-pro.js не проверяет синхронизацию asset-списков

`audit-pro.js` имеет свои `ALLOWED_CSS`/`ALLOWED_JS`, но не сверяет с `PRECACHE_ASSETS` (sw.js) и `ASSETS` (cache-bust-assets.js). Дрифт уже существует (см. P0-SW-DRIFT).

### P2-AUDIT-LAYERED: !important-аудит проверяет site-layered.css, а не site.css

`IMPORTANT_CEIL = 202` считается для `css/site-layered.css`, который нигде не подключён. Реальный продакшн-файл `css/site.css` может иметь другое количество `!important`.

### P2-SW-FALLBACK: cacheFirst fallback для ?v= ломает cache-bust

```javascript
// sw.js — cacheFirst fallback
n.search = "";
e.match(n.pathname)  // Ищет БЕЗ query → возвращает stale-версию
```

Если кэша с `?v=HASH` нет, SW ищет pathname **без** query → возвращает старую версию. Это подрывает cache-bust.

### P2-SW-METADATA: CACHE_METADATA ключ = полный URL, но trimCache ищет по cache keys

`CACHE_METADATA.set(t, Date.now())` использует `request.url`, а `trimCache` перебирает `cache.keys()`, где ключи могут отличаться. Сортировка по возрасту некорректна.

### P2-BOOKMARK-DUP: getAllForSite определяется дважды в bookmark-engine.js

Функция определяется в двух разных IIFE — второе определение перезаписывает первое. Наследие рефакторинга.

### P2-SEARCH-EAGER: search.js создаёт DOM при загрузке (~15KB nodes)

Command palette создаёт `<div class="cp-backdrop">` в `document.body` при загрузке, даже если поиск никогда не откроется.

### P2-SEARCH-SVG-DUP: 20+ дублированных SVG-констант в search.js

Одна иконка повторяется с разными размерами 5–7 раз. ~3KB избыточного кода.

### P2-ENH-CSS: enhancements.js инжектит ~2KB CSS через JS

Progress bar CSS инжектируется через `document.createElement("style")` → FOUC, не кэшируется SW, не попадает под CSS-аудит.

### P2-HIGHLIGHTS-CSS: highlights.js инжектит ~5KB CSS через JS

Та же проблема: highlights panel CSS живёт в JS → FOUC, нет кэширования, нет аудита.

---

## 🔵 NEW P3 — REFACTORING (5 позиций)

### R-001: site.js — 167KB монолит (15 модулей в одном IIFE)

Tooltip-система, scroll-lock, TTS, verse-tooltips, original-words, next-suggest, backlinks, SeriesMap, image-viewer, rail thumbnails, home-tilt, home-dots — всё слито.

### R-002: enhancements.js — 48KB (7+ независимых модулей)

FAQ schema, progress bar, quiz, hexabox, doves, SeriesMap, image viewer — кандидаты на ES-модули.

### R-003: Нет source maps ни для одного JS/CSS файла

При 167KB `site.js` и 48KB `enhancements.js` дебаг в продакшн невозможен.

### R-004: Нет `type="module"` — блокирует tree-shaking

Все JS подключаются как классические скрипты. Astro поддерживает `type="module"`.

### R-005: Glossary innerHTML без экранирования в tooltip body

```javascript
// glossary.js
a.innerHTML = function(t,e) { ... '<span class="gtip-papyrus">'+d+'</span>' ... }
```

`d` (detail text from glossary.json) вставляется через innerHTML без санитизации.

---

## 🟣 AuditRepo — Проблемы (5 позиций)

### AR-001: validate_audit_repo.py — слабая валидация identity-маркеров

`if not any(m in txt for m in markers)` — substring match. «intake» в любом контексте пройдёт.

### AR-002: PROJECT_REGISTRY.md устарел — SHA от 2026-06-27

Текущий HEAD `bba171af` (2026-07-03), в реестре `66640561` (2026-06-27). 6 дней и десятки коммитов.

### AR-003: check_auditrepo_structure.py не проверяет содержимое working/verified

Только наличие README.md, не пустой ли он.

### AR-004: MULTI_WITNESS_VERIFICATION_PROTOCOL — не автоматизирован

Требует 2+ свидетелей, но нет скрипта для проверки.

### AR-005: Нет reverify-автоматизации при новом коммите в source repo

---

## 📊 Сводка новых находок Pass 22

| Категория | Количество |
|-----------|-----------|
| 🔴 P0 Critical | 3 |
| 🟠 P1 High | 5 |
| 🟡 P2 Medium | 9 |
| 🔵 P3 Refactor | 5 |
| 🟣 AuditRepo | 5 |
| **Итого новых** | **27** |

### Взаимосвязь с MASTER_BUG_MATRIX (Pass 21)

| Bug Matrix ID | Статус после Pass 22 |
|---------------|---------------------|
| BUG-001 (Memory Leak fix) | 🔴 **РЕГРЕССИЯ**: fix ввёл бесконечную рекурсию — хуже чем оригинал |
| BUG-005 (site.css/site-layered.css дублирование) | 🟠 **Усугублено**: site-layered.css — 283KB мёртвый код, нигде не подключён |
| BUG-006 (site.js монолит) | 🔵 Подтверждено: вырос с 162.8KB до 167KB |
| BUG-003 (SW gate не в CI) | 🟡 Подтверждено + добавлен P0: PRECACHE_ASSETS дрифт |

### ТОП-3 немедленных исправления

1. **P0-FC-REC**: Заменить `addCleanListener(target, type, fn, opts)` на `target.addEventListener(type, fn, opts)` — строка 47
2. **P0-FC-ABORT**: Пересоздавать `AbortController` после cleanup
3. **P0-SW-DRIFT**: Создать единый `precache-assets.js` и импортировать в `sw.js` + `cache-bust-assets.js` + `audit-pro.js`
