# Bug Ledger — gb-is-my-strength — 2026-06-25

**Верификатор:** Arena Agent TOC  
**Статус:** ФИНАЛЬНЫЙ (на основе двух независимых агентов)  
**Источники:** incoming/arena-agent + incoming/arena-agent-toc

Здесь только **подтверждённые** баги. Нерешённые / сомнительные — в `working/VERIFIER_SYNTHESIS_2026-06-25.md`.

---

## Confirmed P0

### C-P0-01 · Body class mismatch — старые controls не скрываются
- **Route(s):** все страницы с SingleArticleCluster (Hermeneutics, KodDaVinci, Antisovetov, SeriesLiteCluster pages)
- **Evidence:** CSS = `body.fc-single-active`, JS = `body.classList.add('gb-cluster-single-active')` — нет пересечения
- **Fix:** унифицировать имя в CSS или JS

### C-P0-02 · Heart series без контроллера (krajne + rimlyanam7)
- **Route(s):** `/articles/krajne-li-isporcheno-serdce/`, `/articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/`
- **Evidence:** `grep floating-cluster-controller src/components/article-pilots/krajne/KrajneBody.astro` → 0; `grep gb-ember` → 1
- **Fix:** добавить `<script src="floating-cluster-controller.js">` в Astro source

### C-P0-03 · Duplicate IDs на Gill Part1-3+Spravochnik
- **Route(s):** 4 Gill-страницы
- **Evidence:** GillRailControls рендерится 2 раза (mobile + rail), каждый с `id="gbsTheme"` строка 43 + `id="gbsSearch"` строка 66
- **Fix:** убрать static id= из GillRailControls или добавить суффикс через context prop

### C-P0-04 · gill-context: нет PlayEmber + Save в gbs-rail-foot
- **Route(s):** `/articles/dzhon-gill-istoricheskiy-kontekst/`
- **Evidence:** GillContextPageChrome.astro не включает GillRailControls; rfoot содержит только Theme, Search, A±
- **Fix:** добавить GillRailControls или PlayEmber+Save напрямую

---

## Confirmed P1

### C-P1-01 · Cache-bust drift: HermenevtikaBody.astro + Nagornaya PageFooter устаревший hash
- **Evidence:** HermenevtikaBody.astro = `?v=c78a4236`; actual MD5 = `35a91710`; то же в 5×Nagornaya PageFooter
- **Fix:** обновить hash во всех Astro source файлах

### C-P1-02 · Hermenevtika: Pagefind readTime=35 vs visible 50 мин
- **Evidence:** `<span data-pagefind-meta="readTime" hidden="">35</span>` vs `<span>⏱ 50 мин</span>` в Astro source
- **Fix:** `35` → `50` в pagefind meta

### C-P1-03 · Baptisty (10 стр.): нет BreadcrumbList в JSON-LD
- **Evidence:** `grep BreadcrumbList baptisty-rossii/noch-na-kure/index.html` → 0; DOM breadcrumb есть
- **Fix:** добавить JSON-LD BreadcrumbList в каждый baptisty PageHead

### C-P1-04 · Baptisty (11 стр.): SVG og:image — соцсети не рендерят
- **Evidence:** все baptisty = `og:image:type = image/svg+xml`; нет WebP/JPG версий обложек
- **Fix:** создать 1200×630 WebP/JPG og-изображения для каждого baptisty slug

### C-P1-05 · site-layered.css (282KB) в sw.js PRECACHE_ASSETS
- **Evidence:** `grep "site-layered" sw.js` → в precache; `grep "site-layered" **/*.html` → 0 pages
- **Fix:** убрать из PRECACHE_ASSETS, обновить CACHE_VERSION

---

## Confirmed P2 / Tooling

### C-P2-01 · interactive-audit.js не видит premium theme controls
- **Evidence:** selectors не включают `#gbFcTheme`, `.gb-theme-toggle`, `#gbsTheme`
- **Fix:** добавить в `visibleThemeHandle()` selector list

### C-P2-02 · nagornaya-visual-parity-audit.js не проверяет nag-sidebar-ember
- **Evidence:** скрипт проверяет только `<!DOCTYPE html>`, `nagornaya-page`, `main-content`
- **Fix:** добавить `must(chrome, 'nag-sidebar-ember', ...)`

### C-P2-03 · Gill context audit ожидает старые GBS2 маркеры
- **Evidence:** `interactive-audit.js` не обновлён после перехода на v16 shell
- **Fix:** обновить ожидаемые маркеры

---

## Needs-reverification (не в ledger до подтверждения)

| ID | Что |
|---|---|
| PS-01 | `qs is not defined` в controller — статически не воспроизводится в HEAD, нужен Playwright re-run |
| PS-02/03 | Зависит от PS-01 |

---

## Closed / False positives

| ID | Почему |
|---|---|
| PS-05 | stray "76e7365" — не найден в HEAD |
