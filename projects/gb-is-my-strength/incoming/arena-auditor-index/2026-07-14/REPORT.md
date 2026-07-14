# Agent Audit Report — INDEX Page Deep Audit

## Meta
- Project: gb-is-my-strength (gospod-bog.ru)
- Source repo: FedorMilovanov/gb-is-my-strength
- Agent: arena-auditor-index
- Date: 2026-07-14
- Audited branch: main
- Audited SHA: 2ca2af3b
- Current HEAD at start: 2ca2af3b
- Current HEAD at end: 2ca2af3b
- Environment: source code audit, clone of source repo
- Build mode: source (Astro components + legacy index.html comparison)
- Browser / device if used: N/A

---

## 1. New Findings

### Finding AR-IDX-01 [SEO] — Missing hreflang alternate links on INDEX

- **Title:** Отсутствуют hreflang alternate link-теги в Astro-компоненте HomePageHead
- **Severity:** P1 (SEO, discoverability)
- **Route(s):** `/`
- **Source file(s):** `src/components/home/HomePageHead.astro`
- **Observed on SHA:** 2ca2af3b
- **Repro steps:** Сравнить `<head>` Astro-версии (HomePageHead.astro) с legacy `index.html`.
- **Expected:** В Astro-версии присутствуют теги:
  ```html
  <link rel="alternate" hreflang="ru" href="https://gospod-bog.ru/">
  <link rel="alternate" hreflang="x-default" href="https://gospod-bog.ru/">
  ```
- **Actual:** В HomePageHead.astro эти теги **полностью отсутствуют**.
- **Evidence:**
  ```bash
  # В legacy index.html — ЕСТЬ (строки 11-12):
  grep 'hreflang' index.html
  #   <link rel="alternate" hreflang="ru" href="https://gospod-bog.ru/">
  #   <link rel="alternate" hreflang="x-default" href="https://gospod-bog.ru/">

  # В Astro HomePageHead.astro — НЕТ:
  grep 'hreflang' src/components/home/HomePageHead.astro
  #   (пусто)
  ```
- **Confidence:** high
- **Verification level:** L2 (direct source comparison)
- **Suggested repair lane:** SEO-fix: добавить hreflang alternate теги в HomePageHead.astro
- **Do not mix with:** other SEO fixes

---

### Finding AR-IDX-02 [SEO] — Отсутствует SearchAction в JSON-LD структурированных данных

- **Title:** JSON-LD WebSite не содержит `potentialAction` / `SearchAction` (поисковая строка в SERP)
- **Severity:** P1 (SEO, rich results)
- **Route(s):** `/`
- **Source file(s):** `src/components/home/HomePageHead.astro`
- **Observed on SHA:** 2ca2af3b
- **Repro steps:** Сравнить JSON-LD блок в Astro vs legacy index.html.
- **Expected:** В WebSite JSON-LD присутствует:
  ```json
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://gospod-bog.ru/?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
  ```
- **Actual:** В Astro HomePageHead.astro JSON-LD блок WebSite не содержит `potentialAction`. Это лишает Google возможности показывать Site Search Box в выдаче.
- **Evidence:**
  ```bash
  grep -A2 'SearchAction\|potentialAction' src/components/home/HomePageHead.astro
  #   (пусто — нет таких ключей)

  grep 'SearchAction' index.html
  #   "@type":"SearchAction", ... (присутствует)
  ```
- **Confidence:** high
- **Verification level:** L2 (direct source comparison)
- **Suggested repair lane:** SEO-fix: добавить `potentialAction` в WebSite JSON-LD

---

### Finding AR-IDX-03 [UX] — Клавиатурный шорткат поиска ⌘K не адаптирован под ОС

- **Title:** Хоткей поиска всегда показывает ⌘K вне зависимости от платформы
- **Severity:** P2 (UX, дезориентация пользователя)
- **Route(s):** `/`
- **Source file(s):** `src/components/home/HomeHero.astro`
- **Observed on SHA:** 2ca2af3b
- **Repro steps:** Открыть INDEX на Windows/Linux. В hero-поиске показывается `⌘K`.
- **Expected:** На Windows/Linux должен показываться `Ctrl+K`, на macOS — `⌘K`.
- **Actual:** Жёстко зашито `<kbd>⌘</kbd><kbd>K</kbd>` в JS-коде и в HTML-разметке. На Windows/Linux пользователь видит некорректную клавишу.
- **Evidence:**
  ```bash
  grep -n '⌘\|metaKey\|ctrlKey\|Ctrl\|Control' src/components/home/HomeHero.astro
  #   25:      <span class="h-hero-search__kbd" aria-hidden="true"><kbd>⌘</kbd><kbd>K</kbd></span>
  ```
  Также в HomePageChrome.astro — встроенный скрипт:
  ```javascript
  function key(e){(e.metaKey||e.ctrlKey)&&String(e.key).toLowerCase()==="k"&&...
  ```
  Обработчик корректно проверяет `metaKey||ctrlKey`, но визуальный индикатор жёстко показывает `⌘`.
- **Confidence:** high
- **Verification level:** L2 (direct source evidence)
- **Suggested repair lane:** JS должен динамически определять ОС и рендерить нужный шифт

---

### Finding AR-IDX-04 [UI/CONSISTENCY] — Избранное в навбаре потеряло CSS-класс `h-nav-fav`

- **Title:** Ссылка «★ Избранное» в десктопном навбаре Astro-версии не имеет класса `h-nav-fav`
- **Severity:** P3 (minor, styling regression)
- **Route(s):** `/`
- **Source file(s):** `src/components/home/HomePageChrome.astro`
- **Observed on SHA:** 2ca2af3b
- **Repro steps:** Сравнить код ссылки Избранное в legacy index.html и Astro HomePageChrome.astro.
- **Expected:** `<a href="/izbrannoe/" class="h-nav-fav" aria-label="Избранное" ...>`
- **Actual:** `<a href="/izbrannoe/" aria-label="Избранное" ...>` — класс `h-nav-fav` отсутствует.
- **Evidence:**
  ```bash
  grep 'h-nav-fav' index.html
  #   class="h-nav-fav"   (присутствует в legacy)
  grep 'h-nav-fav' src/components/home/HomePageChrome.astro
  #   (пусто)
  grep -r 'h-nav-fav' css/
  #   (пусто — класс не определён в CSS, но может использоваться JS)
  ```
  Хотя CSS-правила для `.h-nav-fav` не найдены, регрессия означает потерю обратной совместимости: если в будущем будет добавлено стилевое правило, Astro-версия его не подхватит.
- **Confidence:** high
- **Verification level:** L2 (direct diff)
- **Suggested repair lane:** добавить `class="h-nav-fav"` в HomePageChrome.astro

---

### Finding AR-IDX-05 [ARCHITECTURE] — SITE_CONFIG.version хардкод вместо динамической генерации

- **Title:** Версия кэш-бастинга `1778943682` жёстко зашита в SITE_CONFIG
- **Severity:** P2 (maintenance, cache reliability)
- **Route(s):** `/` (глобально)
- **Source file(s):** `src/components/home/HomePageChrome.astro`
- **Observed on SHA:** 2ca2af3b
- **Repro steps:** Проверить SITE_CONFIG.version и query-параметры CSS/JS ссылок.
- **Expected:** Версия должна генерироваться автоматически (git hash, build timestamp) для надёжного инвалидирования кэша.
- **Actual:** `version: 1778943682` — hardcoded number. Query-параметры CSS/JS файлов (например, `v=cac8aeeb`, `v=a1933595`, `v=f6c1f247`) жёстко зашиты в разметке. При изменении файла, если забыть обновить query-строку, браузерный кэш будет отдавать старый файл.
- **Evidence:** Прямое чтение файла:
  ```javascript
  window.SITE_CONFIG = {
    version: 1778943682,
    ...
  };
  ```
  Ссылки: `<link rel="stylesheet" href="css/site.css?v=cac8aeeb">`, `<script src="js/site.js?v=00b18eb9">`
- **Confidence:** high
- **Verification level:** L2
- **Suggested repair lane:** Использовать git hash (`--short`) или build-time inject

---

### Finding AR-IDX-06 [FEATURE/CONFIG] — Разметка `.h-reading-progress` существует при disabled feature

- **Title:** DOM-элемент reading-progress bar рендерится, хотя SITE_CONFIG.features.readingProgress: enabled: false
- **Severity:** P3 (cleanliness, minor perf)
- **Route(s):** `/`
- **Source file(s):** `src/components/home/HomePageChrome.astro`
- **Observed on SHA:** 2ca2af3b
- **Repro steps:** Проверить HTML-вывод и SITE_CONFIG.
- **Expected:** Если фича отключена, DOM-элемент не должен рендериться, или JS не должен его инициализировать.
- **Actual:** `<div class="h-reading-progress" id="hReadingProgress" aria-hidden="true"></div>` рендерится всегда, но конфиг помечает фичу как disabled. Это бесполезный элемент в DOM.
- **Evidence:**
  ```astro
  <!-- HomePageChrome.astro — reading progress bar рендерится unconditionally: -->
  <div class="h-reading-progress" id="hReadingProgress" aria-hidden="true"></div>

  <!-- SITE_CONFIG:
  readingProgress: { enabled: false }
  -->
  ```
- **Confidence:** medium (возможно, используется из вне-INDEX страниц)
- **Verification level:** L0 (требуется проверка, не используется ли JS на других страницах)
- **Suggested repair lane:** Сделать conditional rendering или обновить конфиг

---

### Finding AR-IDX-07 [ACCESSIBILITY] — `tabindex="-1"` на h1 без механизма фокуса

- **Title:** h1 hero-title имеет `tabindex="-1"` без ясного фокус-менеджмента
- **Severity:** P3 (a11y, minor)
- **Route(s):** `/`
- **Source file(s):** `src/components/home/HomeHero.astro`
- **Observed on SHA:** 2ca2af3b
- **Repro steps:** Проверить атрибуты h1.
- **Expected:** h1 не должен иметь `tabindex="-1"` без механизма программного фокуса (skip-to-content).
- **Actual:** `<h1 class="h-hero-title" tabindex="-1">`. `tabindex="-1"` позволяет программный фокус, но нет кода, который бы фокусировал его (например, при переходе по skip-link).
- **Evidence:**
  ```astro
  <h1 class="h-hero-title" tabindex="-1">
  ```
  Skip-link указывает на `#main-content`, который является `<main>`, не на h1.
- **Confidence:** medium
- **Verification level:** L0
- **Suggested repair lane:** Либо убрать `tabindex` (если не используется), либо добавить `id="h-hero-title"` и фокусировать его из skip-link.

---

### Finding AR-IDX-08 [MAINTENANCE] — Inline-стили в Astro-компонентах вместо CSS-классов

- **Title:** Многочисленные inline `style` атрибуты в компонентах вместо CSS-переменных/классов
- **Severity:** P3 (code quality, maintainability)
- **Route(s):** `/`
- **Source file(s):** `src/components/home/HomeSections/Publications.astro`, `src/components/home/HomeSections/Planned.astro`, `src/components/home/HomeSections/Quote.astro`
- **Observed on SHA:** 2ca2af3b
- **Evidence:**
  ```astro
  style="color:var(--h-accent, var(--color-accent-strong)); font-weight:700;"
  style="margin-top: 40px;"
  style="padding-top:0;"
  style="margin-bottom: 30px;"
  style="text-decoration:none;cursor:pointer;"
  ```
  Эти стили разбросаны по HTML-разметке. Трудно поддерживать и переопределять. Особенно критично для `color:var(--h-accent, ...)` — дублирование цветовой токен-логики в inline-атрибутах.
- **Confidence:** medium
- **Verification level:** L0
- **Suggested repair lane:** Вынести повторяющиеся стили в CSS-классы / utility-классы

---

### Finding AR-IDX-09 [I18N] — Клавиатурный шорткат не читает alt/option на macOS

- **Title:** `metaKey` проверяется без учёта `e.altKey` (Option+K на некоторых раскладках)
- **Severity:** P2 (UX, keyboard reliability)
- **Route(s):** `/`
- **Source file(s):** `src/components/home/HomePageChrome.astro` (inline script search lazy loader)
- **Observed on SHA:** 2ca2af3b
- **Repro steps:** Нажать Ctrl+K на Windows — срабатывает поиск. Нажать Cmd+K на Mac — срабатывает. Но на некоторых раскладках Option+K или Ctrl+Shift+K тоже могут срабатывать.
- **Expected:** Проверять только `(e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && e.key === 'k'`
- **Actual:** Текущий код:
  ```javascript
  (e.metaKey||e.ctrlKey)&&String(e.key).toLowerCase()==="k"
  ```
  Не проверяет `altKey` и `shiftKey`. Это может приводить к ложным срабатываниям.
- **Evidence:** inline script в HomePageChrome.astro
- **Confidence:** medium
- **Verification level:** L0
- **Suggested repair lane:** Добавить `!e.altKey && !e.shiftKey` в условие

---

### Finding AR-IDX-10 [CSP] — CSP `form-action` legacy отсутствует, в Astro — присутствует

- **Title:** CSP `form-action` различается между legacy и Astro (возможна регрессия)
- **Severity:** P3 (security, consistency)
- **Route(s):** `/`
- **Source file(s):** `index.html` vs `src/components/home/HomePageHead.astro`
- **Observed on SHA:** 2ca2af3b
- **Repro steps:** Сравнить CSP-заголовки.
- **Expected:** CSP должен быть консистентным между версиями.
- **Actual:** 
  - Legacy CSP: `form-action 'self';`
  - Astro CSP: `form-action 'self';`
  - Legacy: нет `cdn.jsdelivr.net` в script-src
  - Astro: `cdn.jsdelivr.net` добавлен
  - Legacy: нет `https://huggingface.co`, `https://*.aws.cdn.hf.co` в connect-src
  - Astro: есть (что правильно для TTS)
- **Confidence:** low (изменения могут быть осознанными)
- **Verification level:** L0
- **Suggested repair lane:** Документировать изменения CSP или синхронизировать

---

## 2. Confirmations of Existing Findings

*(No existing findings confirmed in this pass — this is a fresh index-focused audit.)*

---

## 3. Challenges / Disputes

*(None in this pass.)*

---

## 4. Duplicate / Merge Proposals

- **AR-IDX-01 и AR-IDX-02** — оба относятся к SEO-метаданным в HomePageHead.astro: один ремонтный лейн (SEO-head sync). Но чинить раздельно: разные теги (<link> vs <script>).

---

## 5. Severity Proposals

*(None in this pass.)*

---

## 6. Repair Lane Suggestions

| Лейн | Баги | Описание |
|------|------|----------|
| **SEO-head-sync** | AR-IDX-01, AR-IDX-02 | Синхронизировать HomePageHead.astro с legacy index.html |
| **platform-shortcut** | AR-IDX-03, AR-IDX-09 | Динамическая подстановка ⌘/Ctrl + защита от alt/shift |
| **minor-regression** | AR-IDX-04 | Восстановить `h-nav-fav` класс |
| **build-automation** | AR-IDX-05 | Динамический version hash |
| **config-cleanup** | AR-IDX-06, AR-IDX-08 | Убрать неиспользуемый DOM + inline-стили в классы |

---

## 7. Reverify Notes

- **SHA verified:** 2ca2af3b
- **Method:** Source code comparison (Astro vs legacy index.html)
- **All findings are on current HEAD**

---

## 8. Notes for Verifier

1. **Это первичный проход** — фокус на INDEX странице, source-level.
2. **Наиболее критичные (P1):** AR-IDX-01 (hreflang) и AR-IDX-02 (SearchAction) — прямые SEO-регрессии Astro-версии vs legacy.
3. **Условные баги (P2-P3):** AR-IDX-05, AR-IDX-06 — архитектурные / конфигурационные. AR-IDX-03 — UX.
4. **Замечание по architecture:** Весь INDEX рендерится из Astro-компонентов (`src/pages/index.astro`), но при этом использует статические CSS/JS файлы из корня `css/` и `js/`. Это strangler pattern — и это нормально, но версии файлов («v=...») хардкодятся, а не инжектятся билдом, что создаёт риск stale-кэша.
5. **Рекомендуется второй свидетель** для AR-IDX-06, AR-IDX-07, AR-IDX-08, AR-IDX-09 (browser-level подтверждение).
6. **Не забудьте про копилеги:** `copy-legacy-to-dist.js` может перезаписывать Astro-сборку legacy index.html — надо проверить, чья версия идёт в прод.

---

## Files in this intake folder

- `REPORT.md` — этот файл (10 findings)
- `README.md` — meta and scope
- `evidence/` — grep output, logs
- `artifacts/` — (empty, no patches in this pass)
- `proposals/` — (empty)
- `comments/` — (empty)
