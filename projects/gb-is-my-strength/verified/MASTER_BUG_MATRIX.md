# MASTER BUG MATRIX — gb-is-my-strength

**Дата консолидации:** 2026-07-03  
**HEAD исходного репозитория:** `bba171af` (включая регрессию BUG-001 fix)  
**Режим аудита:** Multi-Agent Synthesis (Passes 1–22 + Pass 22 Arena Deep Auditor independent source-code audit)  
**Статус:** ⚠️ РЕГРЕССИЯ P0 — BUG-001 fix ввёл бесконечную рекурсию в `addCleanListener()`, Floating Cluster полностью неработоспособен

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
* **Суть:** Функция `addCleanListener()` вызывает **саму себя** вместо `target.addEventListener()`. Все 39 вызовов уходят в `RangeError: Maximum call stack size exceeded`.
* **Влияние:** Floating Cluster полностью неработоспособен: тема, TTS, TOC, scroll progress, overlay, share, favorites, font controls.
* **Исправление:** Заменить `addCleanListener(target, type, fn, opts)` → `target.addEventListener(type, fn, opts)`

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

### P1-DEPLOY-FAIL: deploy.yml запускается при падении indexnow
* **Файл:** `.github/workflows/deploy.yml`
* **Суть:** `workflow_run.conclusion == 'failure'` → деплой битого состояния.

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
  * *Суть:* На live нет HTTP-заголовков `X-Frame-Options` и `Content-Security-Policy: frame-ancestors ...`; meta CSP не покрывает `frame-ancestors`. Страницы могут быть встроены в iframe сторонних ресурсов (clickjacking risk).
  * *Статус:* ✅ Подтверждён Pass 21. HSTS не отсутствует и вынесен в False Positives.

### 2. AI-Индексация, SEO и Инфраструктура
* **NEW-46: Неполное покрытие `llms.txt` (AI Crawlers Blindspot)** 🔥 *NEW (Untouched Zone)*
  * *Файл:* `llms.txt`
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
* **NEW-31:** Отсутствие HTTP-заголовка `Referrer-Policy`.
* **NEW-32:** Отсутствие HTTP-заголовка `Permissions-Policy`.
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

### ❌ NEW-28/HSTS — Опровергнут Pass 21
* **Старое заявление:** отсутствует HTTP `Strict-Transport-Security`.
* **Результат live проверки:** **ЛОЖНАЯ ТРЕВОГА.** `curl -I https://gospod-bog.ru/` и выборочные внутренние страницы отдают `strict-transport-security: max-age=31556952`.
* **Остаточные security gaps:** отсутствие HTTP `X-Frame-Options`/`frame-ancestors`, `Referrer-Policy`, `Permissions-Policy`, `X-Content-Type-Options` остаётся актуальным hardening backlog.

### ❌ BUG-004 — Опровергнут (Охват `cache-bust`)
* **Суть:** Ранее считалось, что скрипт кэш-бастинга не покрывает часть файлов. Архитектура использует `cache-bust-assets.js` как единый источник правды (21/21 файл покрыт).

### ✅ ИСПРАВЛЕНО В РЕЖИМЕ ИСПОЛНИТЕЛЯ (Серия 2026-07-02, коммиты `f284fc60`, `36003b91`, `4a367a9c`, `ac132c88` в gb-is-my-strength)
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
