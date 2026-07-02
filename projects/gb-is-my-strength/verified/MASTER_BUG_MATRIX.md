# MASTER BUG MATRIX — gb-is-my-strength

**Дата консолидации:** 2026-07-02  
**HEAD исходного репозитория:** `d5d9388b`  
**Режим аудита:** Multi-Agent Synthesis (Passes 1–20 + Pass 13 Infra + Pass 14 Perf + Deep Untouched Zones Audit)  
**Статус:** ✅ ЕДИНАЯ ВЕРИФИЦИРОВАННАЯ МАТРИЦА (Очищена от галлюцинаций, черновиков и дубликатов)

---

## 📊 Итоговая статистика

| Приоритет | Количество | Описание |
|-----------|------------|----------|
| 🔴 **P1 (Critical)** | 2 | Критические архитектурные проблемы и утечки памяти (требуют немедленного исправления) |
| 🟡 **P2 (High)** | 24 | Высокий приоритет: SEO, AI-индексация, безопасность (XSS, HSTS), дублирование, консистентность данных |
| 🔵 **P3 (Medium)** | 15 | Средний приоритет: a11y, Google Fonts в 3D-приложении, оптимизация картинок, мёртвый код |
| ⚪ **S0 (Low)** | 2 | Документация и технический долг в `AGENTS.md` |
| ❌ **False Positives / Fixed** | 5+ | Опровергнутые или уже исправленные проблемы (`SEO-001`, `BUG-004`, `PC-CURRENT-06`) |
| **ВСЕГО АКТУАЛЬНЫХ БАГОВ** | **43** | Единый очищенный реестр без дубликатов и мусорных файлов |

---

## 🔴 P1 — CRITICAL (2 бага)

### BUG-001 / PC-102: Memory Leak в `floating-cluster-controller.js`
* **Файл:** `js/floating-cluster-controller.js` (линии 83, 108, 142 и др.)
* **Суть проблемы:** В скрипте зарегистрировано **38 вызовов `addEventListener`** (обработчики скролла, ресайза, кликов, DOMContentLoaded) и **0 вызовов `removeEventListener`**. При длительной навигации и перерисовке элементов происходит утечка памяти и деградация производительности клиентского runtime.
* **Статус:** ✅ Подтверждён (Живой grep: `38 addEventListener, 0 removeEventListener`).
* **План исправления (Исполнитель):** Добавить жизненный цикл очистки (`removeEventListener` или `AbortController`) для всех слушателей при демонтаже или смене состояния.

### BUG-002: Дублирование кода в 44 компонентах Astro
* **Файлы:** 39 компонентов `*PageHead.astro` (например, `GillPart1PageHead.astro`, `AntisovetovPageHead.astro`) и 5 компонентов `*PostArticle.astro`.
* **Суть проблемы:** Копипаст разметки на 92–93% без использования базового компонента (`BasePageHead` / `BasePostArticle`). Любое изменение метатегов или подключений стилей требует ручной правки в 44 файлах.
* **Статус:** ✅ Подтверждён.
* **План исправления (Исполнитель):** Выделить общий компонент `<BaseArticleHead>` и принять через props специфичные данные (заголовок, description, схему JSON-LD).

---

## 🟡 P2 — HIGH PRIORITY (24 бага)

### 1. Безопасность (Security & XSS) — Включая новые незатронутые зоны
* **NEW-48: Stored XSS в виджете избранного на главной странице (`Favorites.astro`)** 🔥 *NEW (Untouched Zone)*
  * *Файл:* `src/components/home/HomeSections/Favorites.astro`
  * *Суть:* В отличие от страницы `/izbrannoe/index.astro`, где используется функция экранирования `esc()`, виджет на главной странице вставляет значения `f.title` и `f.description` из `localStorage['gb-favorites']` напрямую через `innerHTML` без какой-либо санитизации. Если злоумышленник (или внешний RSS-импорт) запишет вредоносный тег в `localStorage`, на главной странице выполнится XSS.
  * *Статус:* ✅ Подтверждён (Живая проверка строки 37: `card.innerHTML = ... + f.title + ... + f.description`).
* **NEW-28: Отсутствие HTTP-заголовка `Strict-Transport-Security` (HSTS)**
  * *Суть:* Нет принудительного использования HTTPS (уязвимость к downgrade-атакам).
* **NEW-29: Отсутствие HTTP-заголовка `X-Frame-Options` / `frame-ancestors`**
  * *Суть:* Страницы сайта могут быть встроены в iframe сторонних ресурсов (уязвимость к Clickjacking).

### 2. AI-Индексация, SEO и Инфраструктура
* **NEW-46: Отсутствие 19 продакшн-роутов в `llms.txt` (AI Crawlers Blindspot)** 🔥 *NEW (Untouched Zone)*
  * *Файл:* `llms.txt`
  * *Суть:* Файл `llms.txt` заявлен как индекс контента для LLM-поисковиков (Perplexity, ChatGPT Search, Claude, Grok). При этом в нём перечислено всего 26 ссылок. Отсутствуют: **все 8 интерактивных карт** (`/karty/early-church/`, `/karty/revelation/` и др.), страница родословия (`/rodosloviye/`) и **все 10 отдельных статей серии «Баптисты России»**.
  * *Статус:* ✅ Подтверждён (Живой подсчёт: 26 ссылок в `llms.txt` при 53 продакшн-страницах).
* **BUG-041 (NEW-41): Отсутствие 8 продакшн-роутов в `sitemap.xml`**
  * *Файл:* `sitemap.xml`
  * *Суть:* В статический манифест `sitemap.xml` забыли добавить 8 продакшн-страниц раздела карт (`/karty/*`). Скрипт сборки удаляет автогенерируемый sitemap Astro в пользу устаревшего статического файла.
  * *Статус:* ✅ Подтверждён (43 URL в sitemap vs 53 в манифесте).
* **BUG-003: Рассинхрон в оркестрации SW gate (`sw:dist:audit`)**
  * *Файл:* `package.json`
  * *Суть:* Скрипт `sw:dist:audit` существует, но не включён в команду CI-проверки `validate:static-publication`.
* **BUG-012: Рассинхрон заголовков MDX и HTML (3 статьи)**
  * *Файлы:* `src/content/articles/*.mdx` и сгенерированные HTML.
  * *Суть:* В 3 статьях заголовок `title` в MDX frontmatter не совпадает с итоговым тегом `<title>` или H1.

### 3. Архитектура и Отключённый код (Dead App Zones)
* **NEW-47: 1,251 строка мёртвого кода React-приложения генеалогии (`src/components/genealogy/`)** 🔥 *NEW (Untouched Zone)*
  * *Файлы:* `src/components/genealogy/*.tsx`, `src/pages/rodosloviye/index.astro`, `RodosloviyeBody.astro`
  * *Суть:* В проекте реализовано сложное интерактивное React-приложение для сравнения родословий Матфея 1 и Луки 3 (`GenealogyTree.tsx`, `SplitView.tsx`, `DetailPanel.tsx` — 1,251 строка TSX). Однако при миграции на Astro страница `src/pages/rodosloviye/index.astro` была подключена к статическому плейсхолдеру `RodosloviyeBody.astro`, где кнопка «Открыть родословие» просто ведёт по ссылке `/rodosloviye/`, создавая бесконечный цикл перезагрузки страницы. Интерактивное древо недоступно пользователям.
  * *Статус:* ✅ Подтверждён (0 импортов `GenealogyTree` в `src/pages/`).

### 4. Консистентность данных (Data Consistency)
* **BUG-007: Неконсистентность имени поля в `series.json` (`readingTime` vs `readTime`)**
  * *Файл:* `data/series.json` (1 запись использует `readTime`, 23 — `readingTime`).
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

## 🔵 P3 — MEDIUM PRIORITY (15 багов)

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

### ❌ BUG-004 — Опровергнут (Охват `cache-bust`)
* **Суть:** Ранее считалось, что скрипт кэш-бастинга не покрывает часть файлов. Архитектура использует `cache-bust-assets.js` как единый источник правды (21/21 файл покрыт).

### ✅ PC-CURRENT-06 — Исправлен и верифицирован в браузере
* **Суть:** В мобильном отображении серии Джона Гилла текущий элемент в шапке переведён на поток частичного оглавления (Part TOC). Прогнан смоук `gill:mobile-play:smoke` — всё зелёное.

---

## 🛠 ПОСЛЕДУЮЩИЙ ПЛАН РАБОТ ИСПОЛНИТЕЛЯ (Fix Pipeline)

1. **Пакет 1 (Критическая безопасность и AI-SEO — Прямо сейчас):**
   - Устранить Stored XSS в `Favorites.astro` (добавить `esc()` для `f.title` и `f.description`).
   - Добавить недостающие 19 ссылок в `llms.txt` (`NEW-46`) и 8 роутов в `sitemap.xml` (`BUG-041`).
2. **Пакет 2 (Консистентность и архитектура):**
   - Нормализовать поле `readingTime` в `series.json` и `search-manifest.json`.
   - Подключить интерактивное древо `GenealogyTree.tsx` на страницу `/rodosloviye/index.astro` или удалить 1,251 строку мёртвого кода (`NEW-47`).
   - Включить `sw:dist:audit` в CI-gate (`BUG-003`).
3. **Пакет 3 (Утечка памяти):**
   - Добавить очистку слушателей в `floating-cluster-controller.js` (`BUG-001`).
