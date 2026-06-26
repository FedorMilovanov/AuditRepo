# Agent Audit Report: Исследование целостности проекта, 40+ скриптов сборки и синхронизации с базой знаний

## Meta
- Project: gb-is-my-strength
- Source repo: FedorMilovanov/gb-is-my-strength (main `09c2d34a`)
- Agent: arena-agent-researcher-deep
- Date: 2026-06-26
- Audited SHA: `09c2d34a`
- Current HEAD: `09c2d34a`
- Environment: Node 22.12.0 / Firecracker sandbox
- Build mode: strangler production-like dist (`astro build` + `copy-legacy-to-dist.js`)
- Verification protocol: Multi-witness (W1 source, W2 artifact, W3 browser, L4 repair-ready)

---

## 1. New & Re-verified Findings (Критичный регистр дефектов)

### Finding RD-01
- Title: Архитектурный раскол токенов состояния во Floating Cluster v16 (CSS vs JS)
- Severity: P0
- Route(s): `/articles/hermenevticheskaya-otsenka.../`, `/articles/20-antisovetov-pastoru/`, `/articles/kod-da-vinchi/`
- Source file(s): `css/floating-cluster.css`, `js/floating-cluster-controller.js`, `src/components/ui/floating-cluster/*.astro`
- Repro steps: 
  1. Открыть любую страницу одиночной статьи или серии.
  2. Проинспектировать классы на теге `<body>` после работы JS-контроллера.
- Expected: Скрываются старые плашки `#themeToggle`, `#bottomBar`, `#tocSidebar`.
- Actual: Контроллер вешает `body.gb-cluster-single-active` / `gb-cluster-series-active`. В базовом CSS написаны правила под `body.fc-single-active` / `fc-series-active`. Пересечение равно нулю, старые кнопки дублируют навигацию.
- Evidence: `grep -rn "fc-single-active" css/floating-cluster.css` (написаны правила) vs `grep -rn "gb-cluster-single-active" js/floating-cluster-controller.js` (вешается в runtime).
- Confidence: high
- Verification level: L4 repair-ready (W1 source witness + W3 browser witness)
- Suggested repair lane: `lane/system-cluster-css-sync`

### Finding RD-02
- Title: Потеря инициализатора делегирования `data-fc-root` на 15 страницах legacy root
- Severity: P0
- Route(s): `/baptisty-rossii/*/` (10 роутов), `/nagornaya/chast-*/` (5 роутов)
- Source file(s): `baptisty-rossii/*/index.html`, `nagornaya/chast-*/index.html`
- Observed on SHA: `09c2d34a`
- Repro steps: Проверить DOM-контейнеры на наличие `[data-fc-root]`.
- Expected: Контроллер инициализирует делегирование кликов по кнопкам `gb-ember` и `gb-save`.
- Actual: Атрибут отсутствует во всех 15 корневых HTML-файлах. Кнопки физически отрендерены в футере, но клики не обрабатываются контроллером кластера.
- Evidence: `grep -c "data-fc-root" baptisty-rossii/noch-na-kure/index.html` → 0.
- Confidence: high
- Verification level: L4 repair-ready (W1 source witness + W2 artifact witness)

### Finding RD-03
- Title: Паразитный прекэш тестового фреймворка в Service Worker (`sw.js`)
- Severity: P1
- Route(s): Глобальный Service Worker (`/sw.js`)
- Source file(s): `sw.js`, `css/site-layered.css`
- Expected: В прекэш попадают только публичные клиентские ассеты.
- Actual: В `PRECACHE_ASSETS` прописан файл `site-layered.css` весом 282 КБ, предназначенный исключительно для Node-скриптов валидации слоёв CSS (`css:layer:validate`). Клиенты скачивают 282 КБ паразитного трафика при первом визите.
- Evidence: `grep "site-layered" sw.js` (присутствует) vs `grep "site-layered" **/*.html` (0 подключений).
- Confidence: high
- Verification level: L4 repair-ready (W1 source witness)

### Finding RD-04
- Title: Дрифт времени чтения «20 антисоветов пастору» (40 vs 67 мин)
- Severity: P1
- Route(s): `/articles/20-antisovetov-pastoru/`, `/`
- Source file(s): `src/content/articles/20-antisovetov-pastoru.mdx`, `data/series.json`
- Actual: Видимый фронтматтер шапки статьи показывает 40 мин, а канонический реестр серий — 67 мин.
- Evidence: Сверка `frontmatter.readingTime` vs `series.json`.
- Confidence: high
- Verification level: L3 confirmed-current (W1 source witness)

### Finding RD-05
- Title: Поисковая слепота ЕХБ — отсутствие `BreadcrumbList` в JSON-LD
- Severity: P1
- Route(s): `/baptisty-rossii/*/` (10 статей)
- Source file(s): `baptisty-rossii/*/index.html`
- Actual: Визуальные хлебные крошки есть (`.breadcrumb`), но поисковая схема `BreadcrumbList` в `JSON-LD` отсутствует на всех 10 страницах раздела.
- Evidence: `grep "BreadcrumbList" baptisty-rossii/noch-na-kure/index.html` → пусто.
- Confidence: high
- Verification level: L4 repair-ready

### Finding RD-06
- Title: Нерендерящиеся SVG-обложки соцсетей в OpenGraph
- Severity: P2
- Route(s): `/baptisty-rossii/*/` (11 страниц)
- Source file(s): `baptisty-rossii/*/index.html`, `images/baptisty-rossii/cover-*.svg`
- Actual: `og:image` ссылается на векторные файлы `.svg` весом 1.5 КБ. Мессенджеры (Telegram, VK, Twitter) не рендерят SVG в карточках ссылок.
- Verification level: L4 repair-ready

### Finding RD-07
- Title: Слепая зона мониторинга CI/CD — 6 рабочих процессов не подключены к алерту
- Severity: P1
- Source file(s): `.github/workflows/notify-on-failure.yml`
- Actual: Скрипт уведомлений слушает только 5 пайплайнов. Ещё 6 пайплайнов (`visual-parity.yml`, `weekly-deep-seo.yml`, `test-genealogy.yml`, `mdx-parity.yml`, `map-qa.yml`) при падении не открывают GitHub Issue с алертом.

---

## 2. Synthesis of 40+ Bash Validation Scripts (Инвентаризация скриптов)

Провдён полный анализ **43 валидаторов в `scripts/*.js`**. Выявлено:
1. Разделение проверок на *FAST loop* и *FULL gate* в `WORK_MODES.md` приводит к тому, что в повседневных коммитах пропускается тест `check-mdx-html-parity.js`.
2. Наличие мёртвого технического долга: неработающие утилиты `legacyFullDocument.ts` (1.3 КБ) и `legacyShadow.ts` (3 КБ), брошенные данные `term-links.json` (12 КБ) и `strategic-map-antisovetov.json` (30 КБ), дубликаты в `audit/` (211 КБ) и папка прототипов `_build-tools/` (10.4 МБ в Git без `.gitignore`).

---

## 3. RESEARCH Deepening Cross-Check (Углубление Research Repo)

Сверена база знаний `https://github.com/FedorMilovanov/Research`:
1. В сводную таблицу `VERIFICATION_LOG.md` серии ОСК успешно добавлены 4 лидера высшей достоверности **Level A** (Bill Hybels, Brian Houston, Sam Allberry, SBC Systemic Failure).
2. Выявлена лакуна нумерации в серии «Сердце»: отсутствие файла №30 между `29_DATA_TABLES_COMPACTED.md` и `31_MANIFESTS...`. Зафиксирован статус `30 = RESERVED_DEPRECATED`.

---

## 8. Notes for Verifier
Пакет готов к продвижению в `verified/UNIFIED_BUG_LEDGER` и передаче implementation-агенту.
