# MASTER BUG MATRIX — gb-is-my-strength

**Дата консолидации:** 2026-07-02  
**HEAD исходного репозитория:** `f284fc60` (актуализирован после пакета исправлений P2/P1)  
**Режим аудита:** Multi-Agent Synthesis (Passes 1–21 + Pass 21 SEO/Public Surface Re-verification)  
**Статус:** ✅ ЕДИНАЯ ВЕРИФИЦИРОВАННАЯ МАТРИЦА (Очищена от галлюцинаций, черновиков и дубликатов)

---

## 📊 Итоговая статистика

| Приоритет | Количество | Описание |
|-----------|------------|----------|
| 🔴 **P1 (Critical)** | 2 | Критические архитектурные проблемы и утечки памяти (требуют немедленного исправления) |
| 🟡 **P2 (High)** | 27 | Высокий приоритет: SEO, AI-индексация, безопасность, publication boundary, Pagefind, CI/CD, консистентность данных |
| 🔵 **P3 (Medium)** | 21 | Средний приоритет: a11y, Google Fonts в 3D-приложении, social metadata, внутренние ссылки, оптимизация картинок, мёртвый код |
| ⚪ **S0 (Low)** | 2 | Документация и технический долг в `AGENTS.md` |
| ❌ **False Positives / Fixed** | 6+ | Опровергнутые или уже исправленные проблемы (`SEO-001`, `BUG-004`, `HSTS`, `PC-CURRENT-06`) |
| **ВСЕГО АКТУАЛЬНЫХ БАГОВ** | **52** | Единый очищенный реестр без дубликатов и мусорных файлов |

---

## 🔴 P1 — CRITICAL (2 бага)

### BUG-001 / PC-102: Memory Leak в `floating-cluster-controller.js`
* **Файл:** `js/floating-cluster-controller.js` (линии 83, 108, 142 и др.)
* **Суть проблемы:** В скрипте зарегистрировано **38 вызовов `addEventListener`** (обработчики скролла, ресайза, кликов, DOMContentLoaded) и **0 вызовов `removeEventListener`**. При длительной навигации и перерисовке элементов происходит утечка памяти и деградация производительности клиентского runtime.
* **Статус:** ✅ Подтверждён (Живой grep: `38 addEventListener, 0 removeEventListener`).
* **План исправления (Исполнитель):** Добавить жизненный цикл очистки (`removeEventListener` или `AbortController`) для всех слушателей при демонтаже или смене состояния.

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
  * *Суть:* В production отдаётся 145 внутренних research/raw-source файлов (~14 MB: `.md`, `.txt`, `.pdf`). Владелец подтвердил, что это рабочие файлы для сбора информации, а не публичный продукт.
  * *Статус:* ✅ Подтверждён Pass 21 live/source: `/baptisty-rossii/research/*.md`, `raw-sources/*.txt`, `raw-sources/*.pdf` отдают/могут отдавать `200 OK` при текущем широком copy.
* **NEW-51: Dist/publication audit не ловит nested private/public-data leaks**
  * *Файлы:* `scripts/dist-publication-audit.js`, `scripts/copy-legacy-to-dist.js`.
  * *Суть:* Гейт запрещает только top-level private dirs (`src`, `scripts`, `docs`, `audit`, ...), но не проверяет nested leaks: `baptisty-rossii/research/**`, `data/route-profiles/**`, `data/*baseline*.json`.
  * *Статус:* ✅ Подтверждён Pass 21.
* **NEW-52: Baptist pages Pagefind индексирует только скрытые 5–7 слов, а не article body**
  * *Файлы:* `src/pages/baptisty-rossii/*/index.astro`, `scripts/baptisty-series-shadow-audit.js`.
  * *Суть:* `data-pagefind-body` стоит на `div.sr-only` с текстом вида «Баптисты России. Часть 1...», поэтому Pagefind получает 5–7 слов вместо 800–2400 слов статьи.
  * *Статус:* ✅ Подтверждён Pass 21 live/source.
* **NEW-53: IndexNow submit происходит до production deploy**
  * *Файлы:* `.github/workflows/indexnow.yml`, `.github/workflows/deploy.yml`.
  * *Суть:* `indexnow.yml` отправляет URL в Bing/Yandex до того, как `deploy.yml` задеплоит новый artifact (deploy запускается `workflow_run` после IndexNow).
  * *Статус:* ✅ Подтверждён Pass 21.

### 3. Архитектура и Отключённый код (Dead App Zones)
* **NEW-47: 1,251 строка мёртвого кода React-приложения генеалогии (`src/components/genealogy/`)** 🔥 *NEW (Untouched Zone)*
  * *Файлы:* `src/components/genealogy/*.tsx`, `src/pages/rodosloviye/index.astro`, `RodosloviyeBody.astro`
  * *Суть:* В проекте реализовано сложное интерактивное React-приложение для сравнения родословий Матфея 1 и Луки 3 (`GenealogyTree.tsx`, `SplitView.tsx`, `DetailPanel.tsx` — 1,251 строка TSX). Однако при миграции на Astro страница `src/pages/rodosloviye/index.astro` была подключена к статическому плейсхолдеру `RodosloviyeBody.astro`, где кнопка «Открыть родословие» просто ведёт по ссылке `/rodosloviye/`, создавая бесконечный цикл перезагрузки страницы. Интерактивное древо недоступно пользователям.
  * *Статус:* ✅ Подтверждён (0 импортов `GenealogyTree` в `src/pages/`; Pass 21 live: `/rodosloviye/` не содержит `ReactFlow`, `genealogy`, `data/genealogy`, а CTA ведёт на саму себя).

### 4. Консистентность данных (Data Consistency)
* **BUG-007: Неконсистентность имени поля в `series.json` (`readingTime` vs `readTime`)**
  * *Файл:* `data/series.json` (1 запись использовала `readTime`, 23 — `readingTime`).
  * *Статус:* ✅ **ИСПРАВЛЕНО И ВЕРИФИЦИРОВАНО** (Коммит `f284fc60` — 2026-07-02: нормализовано в `readingTime`).
* **BUG-008: Отсутствие поля `readTime` в 17 элементах `search-manifest.json`**
  * *Файл:* `data/search-manifest.json` (только 27 из 44 статей имеют время чтения).
* **BUG-009: Два разных API в `asset-version.js`**
  * *Файл:* `src/lib/asset-version.js` (экспорт `ASSET_VERSIONS` и `assetUrl()`).

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
  * *Суть:* Вопреки архитектурному инварианту самохостинга шрифтов, закоммиченный 2.2 МБ бандл 3D-приложения подключает внешние стили `https://fonts.googleapis.com` и шрифты `https://fonts.gstatic.com`. Также его CSP требует `'unsafe-eval' 'unsafe-inline' blob:`.
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

### ✅ ИСПРАВЛЕНО В РЕЖИМЕ ИСПОЛНИТЕЛЯ (Пакет 2026-07-02, коммит `f284fc60` в gb-is-my-strength)
* **NEW-48 (Security/XSS):** Устранена Stored XSS уязвимость в виджете избранного на главной странице (`Favorites.astro`). Добавлена строгая санитизация `esc()` и проверка валидности путей/изображений.
* **NEW-46 (AI/SEO):** Частично исправлено в `f284fc60`, но Pass 21 re-opened: `llms.txt` всё ещё не покрывает `/` и Nagornaya routes.
* **BUG-041 (NEW-41, SEO):** Fix attempt in `f284fc60` requires re-triage: sitemap source now includes 8 `noindex, follow` karty holding pages; this is not valid indexable coverage.
* **BUG-007 (Data Consistency):** Нормализовано имя поля `readTime` → `readingTime` в `data/series.json`.
* **PC-CURRENT-06 (Mobile UI):** В мобильном отображении серии Джона Гилла текущий элемент в шапке переведён на поток частичного оглавления (Part TOC). Верифицировано смоуком `gill:mobile-play:smoke`.

---

## 🛠 ПОСЛЕДУЮЩИЙ ПЛАН РАБОТ ИСПОЛНИТЕЛЯ (Fix Pipeline)

1. **Пакет 1 (Publication boundary + search correctness — прямо сейчас):**
   - Закрыть `NEW-50`/`NEW-51`: исключить `baptisty-rossii/research/**` из production artifact и добавить nested/private/public-data whitelist guard в `dist-publication-audit.js`.
   - Закрыть `NEW-52`: перенести `data-pagefind-body` Baptist pages на реальный `<article>`/`<main>` и добавить word-count guard.
   - Пересобрать `BUG-041`: убрать `noindex, follow` holding pages из sitemap и добавить отдельное поле/контракт indexability для production-dist routes.
2. **Пакет 2 (AI/SEO + deploy pipeline):**
   - Довести `NEW-46`: покрыть `/` и Nagornaya routes в `llms.txt` или явно зафиксировать scope-фильтр.
   - Закрыть `NEW-53`: перенести IndexNow submit после successful deploy.
   - Закрыть `BUG-003`: включить `sw:dist:audit` в релевантный production-like CI-gate.
3. **Пакет 3 (Архитектура/runtime):**
   - Подключить интерактивное древо `GenealogyTree.tsx` на `/rodosloviye/` или удалить/скрыть dead app zone (`NEW-47`).
   - Добавить очистку слушателей в `floating-cluster-controller.js` (`BUG-001`).
