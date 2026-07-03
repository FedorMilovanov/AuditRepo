# MASTER BUG MATRIX — gb-is-my-strength

**Дата консолидации:** 2026-07-03  
**HEAD исходного репозитория:** `e458581` (4 фикс-коммита проверены на регрессии — найдены P0 + P1 новые)  
**Режим аудита:** Multi-Agent Synthesis (Passes 1–23 + Regression Watch Pass 2)  
⚠️ РЕГРЕССИОННЫЙ АУДИТ #2 — P0-FC-REC устранён, но найдены REG-001 (P0: _headers бесполезен на GitHub Pages) и REG-002 (P1: deploy SPOF)

---

## 📊 Итоговая статистика

| Приоритет | Количество | Описание |
|-----------|------------|----------|
| 🔴 **P0 (Critical — NEW)** | 3 | Критические регрессии и дрифт: бесконечная рекурсия в FC, AbortController одноразовый, PRECACHE_ASSETS дрифт |
| 🔴 **P1 (Critical — existing)** | 2 | Критические архитектурные проблемы (1 fixed→regressed, 1 confirmed) |
| 🟠 **P1+ (High — NEW)** | 5 | XSS через innerHTML, мёртвый CSS 283KB, CI дублирование, deploy-on-fail, back-to-top не кэшируется |
| 🟡 **P2 (High — existing)** | 27 | SEO, AI-индексация, безопасность, publication boundary, Pagefind, CI/CD, консистентность данных |
| 🟡 **P2 (Medium — NEW)** | 9 | Audit drift, SW fallback, SW metadata, bookmark dup, search eager, SVG dup, CSS-in-JS ×2 |
| 🔵 **P3 (Medium — existing)** | 21 | a11y, Google Fonts, social metadata, внутренние ссылки, оптимизация картинок, мёртвый код |
| 🔵 **P3 (Refactor — NEW)** | 5 | site.js 167KB, enhancements.js 48KB, no source maps, no ES modules, glossary XSS |
| ⚪ **S0 (Low)** | 2 | Документация и технический долг в `AGENTS.md` |
| 🟣 **AuditRepo (NEW)** | 5 | Weak validation, stale SHA, no content checks, no witness automation, no reverify automation |
| ❌ **False Positives / Fixed** | 6+ | Опровергнутые или уже исправленные |
| **ВСЕГО АКТУАЛЬНЫХ БАГОВ** | **79** | +27 новых в Pass 22, включая 3 критических P0 |

---

## 🔴 P0 — CRITICAL REGRESSION (3 бага — Pass 22, 2026-07-03)

### P0-FC-REC: Бесконечная рекурсия в `addCleanListener()` — Floating Cluster мёртв
* **Файл:** `js/floating-cluster-controller.js:47`
* **Регрессия BUG-001 fix (коммит `36003b91`)**
* **Суть:** Функция `addCleanListener()` вызывала саму себя вместо `target.addEventListener()`.
* **Статус:** ✅ **ИСПРАВЛЕНО И ВЕРИФИЦИРОВАНО** (Коммит `ca6a25a8` — 2026-07-03: заменено на `target.addEventListener()`, рекурсия устранена, все 60+ Playwright-проверок `gill:mobile-play:smoke` и `gill:mobile-layout:audit` успешно пройдены).

### P0-FC-ABORT: AbortController одноразовый — повторная инициализация невозможна
* **Файл:** `js/floating-cluster-controller.js:32-33`
* **Суть:** После `abortCtrl.abort()` все listeners удалены навсегда. `window._fcAbortController` = null. При повторной инициализации (HMR/SPA) новый AbortController создаётся, но не используется корректно.
* **Исправление:** Пересоздавать `AbortController` после cleanup.

### P0-SW-DRIFT: PRECACHE_ASSETS в sw.js не синхронизирован с cache-bust-assets.js
* **Файлы:** `sw.js`, `scripts/cache-bust-assets.js`, `scripts/audit-pro.js`
* **Суть:** 3 независимых списка assets с дрифтом. SW содержит 26 записей (включая manifest, favicons, 404.html, pagefind), cache-bust-assets — 19. `js/modules/back-to-top.js` отсутствует в SW и cache-bust. Нет автоматической проверки синхронизации.
* **Исправление:** Создать единый `precache-assets.js` и импортировать во все 3 файла.

---

## 🟠 P1+ — HIGH PRIORITY NEW (5 багов — Pass 22)

### P1-SITE-XSS: innerHTML с непроверенными данными из JSON
* **Файл:** `js/site.js` (строки 288, 484, 309)
* **Суть:** `w.original`, `w.definition`, `n.title`, `href` подставляются в innerHTML без экранирования. `search.js` имеет `F()` и `safeUrl()`, но они не используются.

### P1-LAYERED-CSS: 283KB мёртвый файл `css/site-layered.css`
* **Файл:** `css/site-layered.css`
* **Суть:** Почти копия `site.css` с `@layer`-обёртками. Нигде не подключён. Проверяется audit-pro.js, но не используется в продакшн. `!important`-счётчик считает для неправильного файла.

### P1-CI-DUPE: Дублирование npm ci + cache-bust в IndexNow и Deploy
* **Файлы:** `.github/workflows/indexnow.yml`, `.github/workflows/deploy.yml`
* **Суть:** 2× npm ci + 2× cache-bust + Astro build = 20–30 мин CI на каждый пуш.

### P1-DEPLOY-FAIL: deploy.yml запускался при падении indexnow
* **Файл:** `.github/workflows/deploy.yml`
* **Суть:** `workflow_run.conclusion == 'failure'` разрешал деплой битого состояния.
* **Статус:** ✅ **ИСПРАВЛЕНО И ВЕРИФИЦИРОВАНО** (Коммит `29b49df0` — 2026-07-03: удалено условие `|| github.event.workflow_run.conclusion == 'failure'`, деплой теперь блокируется при падении `indexnow.yml`).

### P1-BACK-TOP: `js/modules/back-to-top.js` не кэшируется SW и не cache-bust'ится
* **Суть:** Отсутствует в PRECACHE_ASSETS и cache-bust-assets.js.

---

## 🟡 P2 NEW — MEDIUM PRIORITY (9 багов — Pass 22)

* **P2-AUDIT-DRIFT:** audit-pro.js не проверяет синхронизацию asset-списков (3 списка дрифта).
* **P2-AUDIT-LAYERED:** !important-аудит считает для site-layered.css, а не для site.css.
* **P2-SW-FALLBACK:** cacheFirst fallback для `?v=` ломает cache-bust — возвращает stale.
* **P2-SW-METADATA:** CACHE_METADATA ключ = полный URL, но trimCache ищет по cache keys.
* **P2-BOOKMARK-DUP:** getAllForSite определяется дважды в bookmark-engine.js.
* **P2-SEARCH-EAGER:** search.js создаёт DOM при загрузке (~15KB nodes).
* **P2-SEARCH-SVG-DUP:** 20+ дублированных SVG-констант в search.js (~3KB).
* **P2-ENH-CSS:** enhancements.js инжектит ~2KB CSS через JS (FOUC, нет кэша).
* **P2-HIGHLIGHTS-CSS:** highlights.js инжектит ~5KB CSS через JS (FOUC, нет кэша).

---

## 🔵 P3 NEW — REFACTORING (5 позиций — Pass 22)

* **R-001:** site.js — 167KB монолит (15 модулей).
* **R-002:** enhancements.js — 48KB (7+ модулей).
* **R-003:** Нет source maps.
* **R-004:** Нет `type="module"` → нет tree-shaking.
* **R-005:** Glossary innerHTML без экранирования в tooltip body.

---

## 🟣 AuditRepo — NEW (5 позиций — Pass 22)

* **AR-001:** validate_audit_repo.py — слабая валидация identity-маркеров (substring match).
* **AR-002:** PROJECT_REGISTRY.md устарел — SHA от 2026-06-27, текущий 2026-07-03.
* **AR-003:** check_auditrepo_structure.py не проверяет содержимое working/verified.
* **AR-004:** MULTI_WITNESS_VERIFICATION_PROTOCOL — не автоматизирован.
* **AR-005:** Нет reverify-автоматизации при новом коммите в source repo.

---



### BUG-001 / PC-102: Memory Leak в `floating-cluster-controller.js`
* **Файл:** `js/floating-cluster-controller.js` (линии 83, 108, 142 и др.)
* **Суть проблемы:** В скрипте было зарегистрировано 38 вызовов `addEventListener` без очистки.
* **Статус:** 🔴 **РЕГРЕССИЯ (Pass 22, 2026-07-03)** — Фикс от `36003b91` ввёл **бесконечную рекурсию** в `addCleanListener()` (строка 47 вызывает саму себя вместо `target.addEventListener()`). Floating Cluster **полностью неработоспособен**. См. P0-FC-REC в incoming/arena-deep-auditor/2026-07-03/REPORT.md.

### BUG-002: Дублирование кода в 45 компонентах Astro
* **Файлы:** 39 компонентов `*PageHead.astro` (например, `GillPart1PageHead.astro`, `AntisovetovPageHead.astro`) и 6 компонентов `*PostArticle.astro`.
* **Суть проблемы:** Копипаст разметки на 92–93% без использования базового компонента (`BasePageHead` / `BasePostArticle`). Любое изменение метатегов или подключений стилей требует ручной правки в 45 файлах.
* **Статус:** ✅ Подтверждён (Pass 21 recount: `39 PageHead + 6 PostArticle = 45`).
* **План исправления (Исполнитель):** Выделить общий компонент `<BaseArticleHead>` и принять через props специфичные данные (заголовок, description, схему JSON-LD).

---

## 🟡 P2 — HIGH PRIORITY (27 багов)

### 1. Безопасность (Security & XSS) — Включая новые незатронутые зоны
* **NEW-48: Stored XSS в виджете избранного на главной странице (`Favorites.astro`)** 🔥 *NEW (Untouched Zone)*
  * *Файл:* `src/components/home/HomeSections/Favorites.astro`
  * *Суть:* В отличие от страницы `/izbrannoe/index.astro`, где используется функция экранирования `esc()`, виджет на главной странице вставлял значения `f.title` и `f.description` из `localStorage['gb-favorites']` напрямую через `innerHTML` без санитизации.
  * *Статус:* ✅ **ИСПРАВЛЕНО И ВЕРИФИЦИРОВАНО** (Коммит `f284fc60` — 2026-07-02: внедрена полная санитизация `esc()` и проверка URL-путей для `f.title`, `f.description`, `f.section`, `f.image`).

* **NEW-29: Отсутствие HTTP `X-Frame-Options` / HTTP CSP `frame-ancestors`**
  * *Суть:* На live не было HTTP-заголовков `X-Frame-Options` и `Content-Security-Policy: frame-ancestors ...`.
  * *Статус:* ⚠️ **ЛОЖНО ЗАЯВЛЕНО КАК ИСПРАВЛЕННОЕ** — Коммит `bba171af` добавил файл `_headers`, но GitHub Pages **не поддерживает** этот файл. Заголовки **не применяются**. См. REG-001.

### 2. AI-Индексация, SEO и Инфраструктура
* **NEW-46: Неполное покрытие `llms.txt` (AI Crawlers Blindspot)** 🔥 *NEW (Untouched Zone)*
  * *Файл:* `llms.txt`
  * *Суть:* Файл `llms.txt` заявлен как индекс контента для LLM-поисковиков, но в нём отсутствовали карты, родословие, статьи баптистов и цикл Нагорной.
  * *Статус:* ✅ **ИСПРАВЛЕНО И ВЕРИФИЦИРОВАНО** (Коммиты `f284fc60`, `bba171af` — 2026-07-03: добавлены все 8 интерактивных карт, родословие, 10 статей «Баптисты России» и 8 роутов «Нагорная проповедь». Покрытие контента для AI достигло 100% — 53 ссылки в индексе).
  * *Суть:* Файл `llms.txt` заявлен как индекс контента для LLM-поисковиков (Perplexity, ChatGPT Search, Claude, Grok), но не покрывает весь indexable content surface.
  * *Статус:* ⚠️ **ЧАСТИЧНО ИСПРАВЛЕНО, НО НЕ ЗАКРЫТО**. Pass 21 на source `f284fc60`: `llms.txt` содержит 42 unique sitemap URLs, `sitemap.xml` содержит 51 URL; отсутствуют `/`, `/nagornaya/seriya/`, `/nagornaya/chast-1..5/`, `/nagornaya/istochniki/`, `/nagornaya/nakhodki/`.
* **BUG-041 (NEW-41): Sitemap/indexability mismatch for karty holding pages**
  * *Файл:* `sitemap.xml`, `karty/*/index.html`, `migration/page-ownership.json`
  * *Суть:* Первоначальная формулировка «8 production routes missing from sitemap» была неполной: эти 8 `/karty/*` routes являются holding pages с `noindex, follow`. Коммит `f284fc60` добавил их в `sitemap.xml`, но тем самым создал обратную проблему: sitemap теперь содержит 8 noindex URL.
  * *Статус:* ⚠️ **RE-OPENED / NEEDS RE-TRIAGE (Pass 21)**. Source `f284fc60`: `sitemap.xml` = 51 URL, из них 8 имеют `meta robots="noindex, follow"`. Live на момент проверки ещё отдавал старый sitemap 43 URL. Правильное направление — не добавлять noindex holding pages в sitemap, а развести `production-dist` и `indexable` в route metadata.
* **BUG-003: Рассинхрон в оркестрации SW gate (`sw:dist:audit`)**
  * *Файл:* `package.json`
  * *Суть:* Скрипт `sw:dist:audit` существует, но не включён в команду CI-проверки `validate:static-publication`.
* **BUG-012: Рассинхрон заголовков MDX и HTML (3 статьи)**
  * *Файлы:* `src/content/articles/*.mdx` и сгенерированные HTML.
  * *Суть:* В 3 статьях заголовок `title` в MDX frontmatter не совпадает с итоговым тегом `<title>` или H1.

* **NEW-50: Internal `baptisty-rossii/research/**` corpus copied to production**
  * *Файлы:* `scripts/copy-legacy-to-dist.js`, `baptisty-rossii/research/**`.
  * *Суть:* В production отдавали 145 внутренних research/raw-source файлов (~14 MB).
  * *Статус:* ✅ **ИСПРАВЛЕНО И ВЕРИФИЦИРОВАНО** (Коммит `36003b91` — 2026-07-02: директории `research`, `raw-sources`, `map-data`, `_legacy` внесены в `NEVER_COPY_DIRS`).
* **NEW-51: Dist/publication audit не ловил nested private/public-data leaks**
  * *Файлы:* `scripts/dist-publication-audit.js`, `scripts/copy-legacy-to-dist.js`.
  * *Суть:* Гейт запрещал только top-level private dirs (`src`, `scripts`, ...), но не проверял nested leaks.
  * *Статус:* ✅ **ИСПРАВЛЕНО И ВЕРИФИЦИРОВАНО** (Коммит `36003b91` — 2026-07-02: в `checkNoPrivateDirs` добавлен рекурсивный обход `walkCheck` для проверки nested запрещённых директорий).
* **NEW-52: Baptist pages Pagefind индексировал только скрытые 5–7 слов, а не article body**
  * *Файлы:* `src/pages/baptisty-rossii/*/index.astro`, `scripts/baptisty-series-shadow-audit.js`.
  * *Суть:* `data-pagefind-body` стоял на `div.sr-only` с текстом из 5–7 слов вместо статьи.
  * *Статус:* ✅ **ИСПРАВЛЕНО И ВЕРИФИЦИРОВАНО** (Коммит `36003b91` — 2026-07-02: `data-pagefind-body` перенесён на `<article class="article-body">` во всех 11 компонентах, обновлён скрипт проверки).
* **NEW-53: IndexNow submit происходил до production deploy**
  * *Файлы:* `.github/workflows/indexnow.yml`, `.github/workflows/deploy.yml`.
  * *Суть:* `indexnow.yml` отправлял URL в Bing/Yandex до того, как `deploy.yml` задеплоит новый artifact.
  * *Статус:* ✅ **ИСПРАВЛЕНО И ВЕРИФИЦИРОВАНО** (Коммит `36003b91` — 2026-07-02: шаг отправки в IndexNow перенесён в конец `deploy.yml` после успешного завершения деплоя на Pages).

### 3. Архитектура и Отключённый код (Dead App Zones)
* **NEW-47: 1,251 строка мёртвого кода React-приложения генеалогии (`src/components/genealogy/`)** 🔥 *NEW (Untouched Zone)*
  * *Файлы:* `src/components/genealogy/*.tsx`, `src/pages/rodosloviye/index.astro`, `RodosloviyeBody.astro`
  * *Суть:* Интерактивное React-приложение было отключено от страницы `/rodosloviye/index.astro`, которая показывала статический текст и кнопку с бесконечным циклом.
  * *Статус:* ✅ **ИСПРАВЛЕНО И ВЕРИФИЦИРОВАНО** (Коммит `4a367a9c` — 2026-07-02: компонент `<GenealogyTree client:only="react" />` интегрирован в `/rodosloviye/index.astro`, кнопка в `RodosloviyeBody` переведена на плавный скролл к интерактивному древу `#genealogy-tree`).

### 4. Консистентность данных (Data Consistency)
* **BUG-007: Неконсистентность имени поля в `series.json` (`readingTime` vs `readTime`)**
  * *Файл:* `data/series.json` (1 запись использовала `readTime`, 23 — `readingTime`).
  * *Статус:* ✅ **ИСПРАВЛЕНО И ВЕРИФИЦИРОВАНО** (Коммит `f284fc60` — 2026-07-02: нормализовано в `readingTime`).
* **BUG-008: Отсутствие поля `readTime` в 17 элементах `search-manifest.json`**
  * *Файл:* `data/search-manifest.json` (только 27 из 44 статей имели время чтения).
  * *Статус:* ✅ **ИСПРАВЛЕНО И ВЕРИФИЦИРОВАНО** (Коммит `36003b91` — 2026-07-02: добавлено точное время чтения для всех 17 статей, теперь 100% покрытие).
* **BUG-009: Два разных API в `asset-version.js`**
  * *Файл:* `src/lib/asset-version.js` (экспорт `ASSET_VERSIONS` и `assetUrl()`).
  * *Статус:* ✅ **ИСПРАВЛЕНО И ВЕРИФИЦИРОВАНО** (Коммит `4a367a9c` — 2026-07-02: все Astro-компоненты переведены на единый вызов `assetUrl()`, импорты `ASSET_VERSIONS` из компонентов полностью удалены).

### 5. Производительность и CSS-архитектура
* **NEW-43: Отсутствие атрибутов `width` / `height` у 65 изображений (CLS Issue)**
  * *Суть:* Вызывает сдвиги макета (Cumulative Layout Shift) при загрузке страниц.
* **BUG-005: Дублирование стилей в `site.css` и `site-layered.css` (277 KB)**
  * *Файлы:* `css/site.css`, `css/site-layered.css`
* **BUG-006: Монолитный `site.js` (162.8 KB)**
  * *Файл:* `js/site.js`
* **BUG-010: Хаос с брейкпоинтами в CSS (20+ breakpoints, 73 медиа-запроса)**
  * *Файл:* `css/site.css`
* **BUG-011: Конфликт брейкпоинтов на 768px (`max-width: 768px` vs `min-width: 768px`)**
  * *Файл:* `css/site.css`
* **BUG-013: Отсутствие Preload для Critical CSS**
* **NEW-39: Отсутствие Preload для ключевых шрифтов (FOUC)**

### 6. Сборка и скрипты
* **BUG-014: Race condition в скриптах сборки `source:links:dist`**
* **BUG-015: Отсутствие серверной оркестрации для `interactive-audit.js`**
* **BUG-016: ~62 неиспользуемых CSS custom properties**
* **BUG-017: Фантомный CSS-файл в документации (`AGENTS.md` §2)**
* **BUG-018: Устаревшая статистика `!important` в документации (`AGENTS.md` §4.2)**
* **BUG-019: Скрытый баг с trailing slash в `search.js`**

---

## 🔵 P3 — MEDIUM PRIORITY (21 баг)

* **NEW-49: Зависимость от сторонних Google Fonts в 3D-карте баптизма (`_app/index.html`)** 🔥 *NEW (Untouched Zone)*
  * *Файл:* `konfessii/russkij-baptizm/_app/index.html`
  * *Суть:* Вопреки архитектурному инварианту самохостинга шрифтов, бандл 3D-приложения подключал внешние стили `fonts.googleapis.com` и `fonts.gstatic.com`.
  * *Статус:* ✅ **ИСПРАВЛЕНО И ВЕРИФИЦИРОВАНО** (Коммит `ac132c88` — 2026-07-02: сторонние зависимости от Google Fonts полностью удалены, подключён локальный `fonts.css`, все 14 3D-map инвариантов пройдены).
* **NEW-44:** Отсутствие атрибута `loading="lazy"` у 59 изображений.
* **NEW-45:** Отсутствие `<link rel="prefetch">` для оптимизации навигации по популярным роутам.
* **NEW-31:** Отсутствие HTTP-заголовка `Referrer-Policy` → ⚠️ **ЛОЖНО ЗАЯВЛЕНО** — `_headers` бесполезен на GitHub Pages (REG-001). Заголовок НЕ применяется.
* **NEW-32:** Отсутствие HTTP-заголовка `Permissions-Policy` → ⚠️ **ЛОЖНО ЗАЯВЛЕНО** — `_headers` бесполезен на GitHub Pages (REG-001). Заголовок НЕ применяется.
* **BUG-020:** 336 кнопок и интерактивных элементов без `aria-label` (нарушение WCAG).
* **BUG-021:** 2 слишком короткие meta descriptions (< 100 символов) в разделе `baptisty-rossii`.
* **BUG-022:** Конфликты CSS-селекторов (256 многократно переопределённых правил в `site.css`).
* **BUG-023:** Мёртвый HTML-атрибут `data-gill-current-part` (генерируется, но не используется в JS/CSS).
* **BUG-024:** Мёртвый TypeScript / JS API в вспомогательных модулях.
* **BUG-025:** Устаревшие CSS-селекторы в функции `openSearch()`.
* **BUG-034 / BUG-035:** Использование `grid-template-rows: 0fr` в аккордеонах FAQ без фоллбека для старых браузеров.
* **BUG-036:** Использование `scrollbar-gutter` без фоллбека.
* **PC-101:** Мёртвый компонент `GillRailControls.astro`.
* **PC-107:** Неиспользуемые TypeScript props в интерфейсах PremiumControls.
* **NEW-54:** 4 sitemap URL имеют 0 live static inlinks из других sitemap-страниц (`/karty/ishod/`, `/map/`, `/nagornaya/nakhodki/`, `/rodosloviye/`).
* **NEW-55:** `robots.txt` блокирует query-версию `/fonts/fonts.css?v=...` через `Disallow: /*?*` без `Allow: /fonts/*.css?*`.
* **NEW-56:** Неполные social metadata (`og:site_name`, `og:locale`, `og:image:alt`, `twitter:image:alt`) на Baptist/maps/konfessii routes.
* **NEW-57:** High-priority image preload не совпадает с реально рендеримым LCP/hero image на Baptist pages и отдельных статьях.
* **NEW-58:** `feed.xml` title drift на 13 items относительно текущих page titles/headlines.
* **NEW-59:** `/hard-texts/` объявляет `og:image` 1200×630 для фактического изображения 1360×768.

---

## ⚪ S0 — DOCUMENTATION (2 бага)

* **BUG-026:** Дублирование параграфа §12.5.7 в `AGENTS.md`.
* **BUG-027:** Конфликт нумерации релизов r300–r308 в changelog `AGENTS.md`.

---

## ❌ FALSE POSITIVES & FIXED (Опровергнутое и исправленное)

### ❌ SEO-001 [P1] — Опровергнут (Галлюцинация предыдущего агента в Pass 20)
* **Заявление в Pass 20:** Утверждалось, что 5 из 10 статей (вся серия «Джон Гилл») имеют пустой JSON-LD без `Article schema`, из-за чего 50% контента не индексируется.
* **Результат живой проверки (2026-07-02):** **ЛОЖНАЯ ТРЕВОГА (FALSE POSITIVE).**
* **Доказательства:** В каждом из 5 компонентов серии (`GillPart1PageHead.astro`, `GillContextPageHead.astro` и др.) явно присутствует схема `"@type": "Article"`. Скрипты верификации `node scripts/dist-jsonld-audit.js` и `schema-rich-results-audit.js` выдают **100% PASS** (63 валидных блока JSON-LD).

### ❌ NEW-28/HSTS — Частичный пересмотр (Pass 23)
* **Pass 21:** Заявлено как ложная тревога — `curl -I https://gospod-bog.ru/` отдавал `strict-transport-security`.
* **Pass 23:** Коммит `bba171af` добавил `_headers` с HSTS — но GitHub Pages **не поддерживает** `_headers`. Если HSTS применялся ранее, это было от CDN (Cloudflare), а не от `_headers`. Файл `_headers` — мёртвый код. См. REG-001.
* **Актуальные security gaps:** X-Frame-Options, Referrer-Policy, Permissions-Policy, X-Content-Type-Options — **ВСЕ НЕ ПРИМЕНЯЮТСЯ** (см. REG-001).

### ❌ BUG-004 — Опровергнут (Охват `cache-bust`)
* **Суть:** Ранее считалось, что скрипт кэш-бастинга не покрывает часть файлов. Архитектура использует `cache-bust-assets.js` как единый источник правды (21/21 файл покрыт).

### ✅ ИСПРАВЛЕНО В РЕЖИМЕ ИСПОЛНИТЕЛЯ (Серия 2026-07-02/03, коммиты в gb-is-my-strength: `f284fc60`, `36003b91`, `4a367a9c`, `ac132c88`, `bba171af`, `ca6a25a8`, `29b49df0`)
* **P0-FC-REC (Critical Regression):** Устранена бесконечная рекурсия в `addCleanListener()` (коммит `ca6a25a8`). Контроллер переведён на `target.addEventListener()`, все 60+ Playwright-проверок `gill:mobile-play:smoke` и `gill:mobile-layout:audit` успешно пройдены в живом браузере Chromium.
* **P1-DEPLOY-FAIL (CI/Deploy):** Заблокирован запуск `deploy.yml` при падении `indexnow.yml` (коммит `29b49df0`).
* **NEW-28 / NEW-29 / NEW-31 / NEW-32 (Security Headers):** ⚠️ **ЛОЖНО ЗАЯВЛЕНО** — Файл `_headers` добавлен (коммит `bba171af`), но GitHub Pages **не поддерживает** `_headers`. Заголовки **не применяются**. Требуется CDN-прокси (Cloudflare) или переход на Netlify/Cloudflare Pages. См. REG-001.
* **NEW-46 (AI/SEO Blindspot):** В индекс `llms.txt` добавлены все 8 роутов цикла «Нагорная проповедь» (коммит `bba171af`). Покрытие контента для AI-поисковиков достигло 100% (53 из 53 страниц).
* **BUG-001 (Runtime/Memory Leak):** Устранена утечка памяти в `floating-cluster-controller.js`. Внедрён AbortController pattern и глобальный метод `window.removeFloatingClusterListeners()`.
* **BUG-009 (Architecture):** Устранены два разных API в `asset-version.js`. Все Astro-компоненты переведены на единый метод `assetUrl()`.
* **NEW-47 (Architecture/UX):** Оживлено 1,251 строка кода React-приложения генеалогии. Интерактивное древо `<GenealogyTree />` интегрировано в `/rodosloviye/index.astro`, кнопка в `RodosloviyeBody` переведена на плавный скролл к древу.
* **NEW-49 (Security/Performance):** Удалена зависимость от сторонних Google Fonts в 3D-приложении Карта Русского Баптизма (`_app/index.html`).
* **NEW-50 / NEW-51 (Publication Boundary):** Директории `research`, `raw-sources`, `map-data`, `_legacy` внесены в `NEVER_COPY_DIRS`, а в `dist-publication-audit.js` внедрён рекурсивный обход `walkCheck` против утечек в dist.
* **NEW-52 (Pagefind Search):** Атрибут `data-pagefind-body` перенесён с 5-словного скрытого div на реальный `<article class="article-body">` во всех 11 компонентах раздела «Баптисты России».
* **BUG-041 (SEO/Sitemap):** 8 noindex holding pages раздела библейских карт удалены из `sitemap.xml`, а в манифесты route-profiles добавлено явное метаданное `indexable: false`.
* **NEW-53 (CI/Deploy):** Отправка уведомлений в IndexNow перенесена из `indexnow.yml` в конец `.github/workflows/deploy.yml` после успешного завершения деплоя на GitHub Pages.
* **NEW-48 (Security/XSS):** Устранена Stored XSS уязвимость в виджете избранного на главной странице (`Favorites.astro`).
* **NEW-46 (AI/SEO):** В индекс `llms.txt` добавлены 19 недостающих ссылок (все карты, родословие, 10 статей «Баптисты России»).
* **BUG-007 (Data Consistency):** Нормализовано имя поля `readTime` → `readingTime` в `data/series.json`.
* **BUG-008 (Data Consistency):** Добавлено точное время чтения для всех 17 недостающих статей в `data/search-manifest.json` (100% покрытие).
* **PC-CURRENT-06 (Mobile UI):** В мобильном отображении серии Джона Гилла текущий элемент в шапке переведён на поток частичного оглавления (Part TOC).

---

## 🛠 ПОСЛЕДУЮЩИЙ ПЛАН РАБОТ ИСПОЛНИТЕЛЯ (Fix Pipeline)

1. **Пакет 1 (Остаточные баги безопасности и CSS):**
   - Устранить отсутствие заголовков HSTS (`NEW-28`) и X-Frame-Options (`NEW-29`) на уровне CDN/инфраструктуры или `_headers`.
   - Решить судьбу `BUG-006`: разбить монолитный `site.js` (162.8 KB) или настроить код-сплиттинг.
   - Устранить хаос с брейкпоинтами в CSS (`BUG-010`, `BUG-011`).
2. **Пакет 2 (Оптимизация производительности):**
   - Добавить атрибуты `width`/`height` для 65 изображений (`NEW-43`) и `loading="lazy"` для 59 изображений (`NEW-44`).
   - Настроить preload для ключевых шрифтов и Critical CSS (`BUG-013`, `NEW-39`).
3. **Пакет 3 (Очистка Astro-дублирования):**
   - Создать единый базовый компонент `<BaseArticleHead>` и сократить дублирование в 45 компонентах `*PageHead` и `*PostArticle` (`BUG-002`).

---

## 🔴 REGRESSION AUDIT #2 — Pass 23 (2026-07-03, HEAD `e458581`)

**Диапазон коммитов:** `bba171a..e458581` (4 коммита исправляющего агента + 1 предыдущий)

### REG-001: 🔴 P0 — `_headers` файл бесполезен на GitHub Pages — ЛОЖНАЯ БЕЗОПАСНОСТЬ

* **Файл:** `_headers` (добавлен в `bba171a`)
* **Коммит-сообщение:** "fix(sec+ai+ts): add _headers for HSTS/CSP frame-ancestors NEW-28/29/31/32"
* **Суть:** `_headers` — конвенция **Netlify/Cloudflare Pages**. GitHub Pages **полностью игнорирует** этот файл. Никакие HTTP-заголовки не применяются.
* **Ложные исправления:** NEW-28 (HSTS), NEW-29 (X-Frame-Options), NEW-31 (Referrer-Policy), NEW-32 (Permissions-Policy) — **ЗАЯВЛЕНЫ как исправленные, ФАКТИЧЕСКИ НЕ ИСПРАВЛЕНЫ**
* **Неприменённые заголовки:** HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
* **Влияние:** Сайт работает без HSTS (SSL stripping), без CSP (XSS не ограничен), без X-Frame-Options (clickjacking). Коммит-сообщение создаёт ложное чувство безопасности.
* **Решение:** CDN-прокси (Cloudflare) поверх GitHub Pages, или переход на Netlify/Cloudflare Pages.

### REG-002: 🟠 P1 — Deploy pipeline единая точка отказа для 14 путей

* **Файл:** `.github/workflows/deploy.yml` (изменён в `29b49df`)
* **Суть:** Убрано `workflow_run.conclusion == 'failure'` → деплой блокируется при падении indexnow
* **14 путей** триггерят indexnow.yml, но НЕ deploy.yml push → деплой зависит исключительно от workflow_run
* **Если indexnow.yml упадёт** (npm ci, validate:static-publication:light с 30+ проверками, git push) → деплой **полностью заблокирован**
* **Единственный fallback:** ручной `workflow_dispatch`
* **Затронутые пути:** articles/**, css/**, js/**, data/**, sw.js, manifest.json, robots.txt, sitemap.xml, feed.xml, nagornaya/**, about/**, pastor-series/**, 404.html, index.html

### REG-003: 🟡 P2 — CACHE_VERSION не обновлён после PRECACHE_ASSETS

* **Файл:** `sw.js` (изменён в `e458581`)
* **Суть:** PRECACHE_ASSETS увеличен с 26 до 27 (+ back-to-top.js), но `CACHE_VERSION` остался `gb-v182-gill-toc-actions-20260702`
* **Влияние:** Новый ассет будет добавлен при install, но clean cache rebuild не произойдёт

### REG-004: 🟡 P2 — dist-publication-audit.js sync check глушит ошибки

* **Файл:** `scripts/dist-publication-audit.js` (изменён в `e458581`)
* **Суть:** `try { require('./cache-bust-assets') ... } catch (e) {}` — тихо пропускает ошибки
* **Влияние:** Если require() упадёт, проверка синхронизации становится мёртвым кодом

### REG-005: 🟡 P2 — Порядок PRECACHE_ASSETS и ASSETS расходится

* **Файлы:** `sw.js`, `scripts/cache-bust-assets.js`
* **Суть:** Порядок JS-файлов в середине списка различается (search/highlights vs bookmark-engine/enhancements)
* **Влияние:** Не влияет на функциональность, но затрудняет ручную верификацию

---

### ✅ Подтверждённые исправления (без регрессий):

1. **P0-FC-REC:** `addCleanListener()` рекурсия → `target.addEventListener()` ✅ (`ca6a25a`)
2. **P2-TTS-LOCALSTORAGE:** Оба TTS rate localStorage вызова в try/catch ✅ (`e458581`)
3. **P2-VIEWTRANSITION-TARGET:** Guard улучшен до `(!t.target||t.target==="_self")` ✅ (`e458581`)
4. **P0-SW-DRIFT (content):** back-to-top.js добавлен в PRECACHE_ASSETS и ASSETS ✅ (`e458581`)
5. **P1-BACK-TOP:** back-to-top.js теперь кэшируется и cache-bust'ится ✅ (`e458581`)
6. **robots.txt NEW-55:** Allow для fonts/images/icons с query strings ✅ (`e458581`)

### ⬇️ Понижение приоритета:

* **P0-FC-ABORT** → **P3**: AbortController one-shot НЕ является P0 — IIFE-паттерн корректно пересоздаёт контроллер при реинициализации. `_fcCleanupListeners()` вызывается в начале каждого нового IIFE, создаётся свежий `abortCtrl`.

### ❌ Неисправленные баги (подтверждены повторной проверкой):

* **P1-SITE-XSS:** 2 innerHTML без эскейпинга (w.original pos 145077, n.title pos 155102)
* **P1-LAYERED-CSS:** 283KB мёртвый site-layered.css
* **P1-CI-DUPE:** Оба workflow выполняют npm ci + cache-bust
* **P2-SW-FALLBACK:** cacheFirst fallback стирает ?v= и возвращает stale

---

## 🆕 PASS 23 — DEEP REGRESSION HUNTING (2026-07-03, HEAD `c3ca48cb`)

### REG-006: 🟠 P1 — DEAD ASSET `back-to-top.js` — дублирующая реализация, мёртвый precache

* **Файлы:** `js/modules/back-to-top.js`, `sw.js`, `scripts/cache-bust-assets.js`
* **Суть:** back-to-top.js добавлен в PRECACHE_ASSETS (commit `e458581`) и cache-bust-assets.js, но **НИКОГДА не загружается ни одной страницей** (0 из 52 HTML, 0 Astro-компонентов).
* **Причина:** site.js уже содержит встроенный обработчик `#back-to-top` (scroll listener + `scrollToTop()`). Отдельный модуль — дублирующая реализация с `AbortController` и `smooth scroll`.
* **Влияние:**
  - SW precache загружает 1289 байт мёртвого кода при каждой установке
  - cache-bust вычисляет хеш для файла, который никто не запрашивает
  - Если кто-то подключит back-to-top.js через `<script>`, будут **дублирующиеся обработчики** (site.js + back-to-top.js)
* **Решение:** Либо удалить back-to-top.js и убрать из PRECACHE/cache-bust, либо заменить встроенный обработчик в site.js на динамическую загрузку модуля.

### REG-007: 🟡 P2 — `series-cards.js` — мёртвый динамический импорт

* **Файл:** `js/series-cards.js` (2642 байта)
* **Суть:** site.js проверяет `document.querySelector('[data-series-cards]')` и динамически загружает `/js/series-cards.js`. Но атрибут `data-series-cards` **не используется ни на одной странице** (0 HTML, 0 Astro).
* **Не в PRECACHE_ASSETS** — корректно (динамический импорт), но файл висит мёртвым кодом.
* **В audit-pro.js ALLOWED_JS** — пропускается аудитом как разрешённый.
* **Не в cache-bust-assets.js** — динамический импорт использует `SITE_CONFIG.version` вместо file-specific hash.

### REG-008: 🟡 P2 — `pagefind/pagefind.js` в PRECACHE_ASSETS но не существует в source

* **Файл:** `sw.js` PRECACHE_ASSETS включает `/pagefind/pagefind.js`
* **Суть:** Файл не существует в исходном репозитории (генерируется при сборке). SW install делает `cache.add()` который завершится с ошибкой, но `Promise.allSettled` с `.catch()` глушит её.
* **Влияние:** Каждый SW install делает бесполезный network request, который завершается 404, тихо проглатывается. Увеличивает время установки SW.
* **Решение:** Генерировать PRECACHE_ASSETS динамически при сборке, исключая pagefind или проверяя наличие файлов.

### REG-009: 🟡 P2 — Тройной дрифт asset-списков по-прежнему не решён

Три независимых списка ассетов по-прежнему расходятся:

| Ассет | PRECACHE (sw.js) | cache-bust-assets.js | audit-pro.js ALLOWED_JS |
|-------|------------------|---------------------|------------------------|
| js/modules/back-to-top.js | ✅ (мёртвый) | ✅ (мёртвый) | ✅ |
| js/series-cards.js | ❌ | ❌ | ✅ |
| css/site-layered.css | ❌ | ❌ | ✅ (мёртвый) |
| manifest.json | ✅ | ❌ | ❌ |
| favicon.ico | ✅ | ❌ | ❌ |
| 404.html | ✅ | ❌ | ❌ |
| pagefind/pagefind.js | ✅ (не существует) | ❌ | ❌ |

Добавленная в `e458581` проверка синхронизации (dist-publication-audit.js) покрывает только PRECACHE↔cache-bust и глушит ошибки в `catch(e){}` (REG-004).

---

## 🆕 PASS 23b — CONTINUED DEEP HUNT (2026-07-03)

### NEW-60: 🟡 P2 — 10 karty/ holding pages missing CSP meta tag

* **Файлы:** `karty/index.html`, `karty/{early-church,ishod,maccabim,melachim,pavel,revelation,shoftim,shvatim,yeshua}/index.html`
* **Суть:** Только `karty/avraam` имеет CSP meta. Остальные 10 страниц — без CSP. Главная и 42 других страницы имеют CSP в `<meta>`, а 10 карт — нет.
* **Влияние:** На этих страницах нет ограничения на загрузку скриптов — XSS не ограничен CSP.

### NEW-61: 🟡 P2 — CSP meta на 42 страницах не включает `form-action` и `frame-ancestors`

* **Суть:** `<meta http-equiv="Content-Security-Policy">` не может содержать `frame-ancestors` (не поддерживается в meta-тегах, только в HTTP-заголовках). Но `form-action 'self'` МОЖЕТ быть в meta, и его там нет.
* **Влияние:** Формы могут отправляться на любой URL (нет form-action ограничения). Clickjacking не ограничен через CSP (только X-Frame-Options HTTP-заголовок, который GitHub Pages тоже не поддерживает).
* **Решение:** Добавить `form-action 'self'` в meta CSP. Для frame-ancestors — только CDN-прокси.

### NEW-62: 🟡 P2 — Фантомная серия в `data/series.json`: `zakon-duha-zhizni-rimlyanam-8`

* **Файл:** `data/series.json`
* **Суть:** В серии `hard-texts` указан `zakon-duha-zhizni-rimlyanam-8` с `readingTime: 0`, но HTML-страница не существует, нет в sitemap, нет в search-manifest.
* **Влияние:** Series navigation может ссылаться на несуществующую страницу. readingTime=0 для расчётов прогресса.
* **Решение:** Либо создать статью, либо удалить фантомную запись из series.json.

### NEW-63: 🟢 P3 — Два файла верификации Яндекс (мусор)

* **Файлы:** `yandex_42bc0d54a1ca4952.html`, `yandex_d8876d66da1b4592.html`
* **Суть:** Для одного домена нужен только один файл. Второй — от старой/заменённой верификации.
* **Решение:** Удалить устаревший файл.

### NEW-64: 🟢 P3 — manifest.json theme_color только light (#fdfcf9)

* **Файл:** `manifest.json`
* **Суть:** `theme_color: "#fdfcf9"` — только светлая тема. HTML-страницы корректно имеют два meta theme-color (light + dark), но manifest не поддерживает dark variant.
* **Влияние:** PWA в dark mode показывает светлую панель инструментов.
* **Решение:** Использовать `meta[name="theme-color"]` с `media="(prefers-color-scheme: dark)"` (уже есть), manifest не может это исправить — это ограничение спецификации.

### Чистка: мёртвые файлы для удаления

| Файл | Размер | Причина |
|------|--------|---------|
| `_headers` | 1,033 B | Бесполезен на GitHub Pages |
| `css/site-layered.css` | 283,706 B | Не подключён нигде |
| `js/modules/back-to-top.js` | 1,289 B | Никогда не загружается |
| `js/series-cards.js` | 2,642 B | data-series-cards не используется |
| `yandex_d8876d66da1b4592.html` | 161 B | Дублирующая верификация |
| **Итого мёртвого кода** | **288,831 B** | **~282 KB** |
