# Verifier Synthesis — gb-is-my-strength — 2026-06-25

**Верификатор:** Arena Agent TOC  
**Входящие отчёты:**
- `incoming/arena-agent/2026-06-25/` — Playwright + dist build (7 файлов)
- `incoming/arena-agent-toc/2026-06-25/` — static source scan (2 файла)

---

## 1. Inputs reviewed

| Файл | Метод | Статус |
|---|---|---|
| premium-surface-bug-matrix-2026-06-25.md | Playwright + dist | OK |
| deep-safe-bug-verification-2026-06-25-round2.md | Playwright + dist | OK |
| deep-safe-bug-verification-2026-06-25-round3.md | Playwright + dist | OK |
| deep-safe-bug-verification-2026-06-25-round4-audit-drift.md | Playwright + dist | OK |
| premium-svg-pages-bug-investigation-2026-06-25.md | Playwright + dist | OK |
| safe-docs-and-contract-scan-2026-06-25.md | static | OK |
| full-bug-audit-rounds-1-3-2026-06-25.md | static | OK |
| verification-of-ps-bugs-2026-06-25.md | static + git history | OK |

---

## 2. Confirmed bugs (по двум агентам)

### P0 — Немедленно чинить

| ID | Источник | Описание |
|---|---|---|
| PS-04 / BUG-003 | оба агента | Heart series (krajne, rimlyanam7): gb-ember есть в Astro source, контроллер — нет |
| PS-07 / BUG-029 | оба агента | Duplicate IDs `gbsTheme`/`gbsSearch` на Gill Part1-3+Spravochnik (GillRailControls рендерится 2 раза) |
| BUG-001 | TOC static | Body class mismatch: CSS = `fc-single-active`, JS = `gb-cluster-single-active` → старые controls не скрываются |
| BUG-002 | TOC static | Baptisty (10) + Nagornaya (5): нет `data-fc-root` → controller не активирует body class |
| BUG-007 | TOC static | gill-context: нет PlayEmber + Save в gbs-rail-foot |

### P1 — Важные

| ID | Источник | Описание |
|---|---|---|
| PS-06 / BUG-related | оба агента | Hermenevtika: Pagefind readTime=35, видимое=50 мин |
| PS-10 / BUG-009 | оба агента | Cache-bust drift: HermenevtikaBody.astro = `c78a4236`, actual = `35a91710` |
| BUG-026 | TOC static | Baptisty (10): нет BreadcrumbList в JSON-LD |
| BUG-027 | TOC static | Baptisty (11): SVG og:image — соцсети не рендерят |
| BUG-030 | TOC static | site-layered.css (282KB) в sw.js precache без использования |

### P2 / Tooling drift

| ID | Источник | Описание |
|---|---|---|
| PS-08 | оба агента | interactive-audit.js не видит #gbFcTheme, .gb-theme-toggle, #gbsTheme |
| PS-09 | оба агента | Gill context: интерактивный аудит проверяет старые GBS2 маркеры |
| BUG-028 | TOC static | nagornaya-visual-parity-audit.js не проверяет nag-sidebar-ember |

---

## 3. Needs-reverification

| ID | Почему |
|---|---|
| PS-01 (qs crash) | Статически не воспроизводится в HEAD. Playwright агент тестировал на dist из более ранней версии. Нужен re-run Playwright на HEAD dist. |
| PS-02, PS-03 | Зависят от PS-01 |

---

## 4. False positives / closed

| ID | Причина |
|---|---|
| PS-05 (stray "76e7365") | Не найден в HEAD source или root HTML. Артефакт был в dist из commit `564d6cc8` (хеш `676e7365`). Resolved in current HEAD. |

---

## 5. Рекомендованный порядок починки

### Фаза A — Shared markup/contract (P0, не требует Playwright)
1. **BUG-001**: Унифицировать body class — заменить `fc-single-active` на `gb-cluster-single-active` в CSS Astro компонентов, или наоборот в JS
2. **BUG-003 / PS-04**: Добавить контроллер в Astro source krajne + rimlyanam7
3. **PS-07**: Убрать hardcoded IDs `gbsTheme`/`gbsSearch` из GillRailControls (или сделать их уникальными через context prop)

### Фаза B — Cache-bust + source sync (P1)
4. **PS-10 / BUG-009**: Обновить hash в HermenevtikaBody.astro + всех Nagornaya PageFooter
5. **BUG-007**: Добавить PlayEmber + Save в gill-context gbs-rail-foot

### Фаза C — Content metadata (P1)
6. **PS-06**: Исправить readTime в HermenevtikaBody.astro: 35 → 50
7. **BUG-026**: Добавить BreadcrumbList JSON-LD в 10 baptisty страниц
8. **BUG-027**: Создать WebP/JPG og:image для baptisty (1200×630)

### Фаза D — Tooling update (P2)
9. **PS-08**: Обновить interactive-audit.js selectors
10. **BUG-028**: Обновить nagornaya-visual-parity-audit.js

### Фаза E — SW/precache cleanup
11. **BUG-030**: Убрать site-layered.css из sw.js PRECACHE_ASSETS
12. **TRASH-014**: Убрать из precache

### Фаза F — Верификация PS-01
13. Re-run Playwright против HEAD dist; если воспроизводится — приоритет P0

---

## 6. Что НЕ трогать без отдельного решения

- `series-cards.js` — в контракте AGENTS.md как официальный JS
- `data/term-links.json` + `data/strategic-map-antisovetov.json` — возможно заготовки для будущих фич
- `_build-tools/` — R&D source для 3D-карты, исключён из production pipeline
- `src/layouts/ArticleLayout.astro` + `SeriesArticleLayout.astro` — архитектурные заготовки
