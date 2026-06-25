# Full bug audit — gb-is-my-strength — rounds 1–3 — 2026-06-25

**Агент:** Arena Agent TOC  
**Метод:** static source scan (Python grep)  
**Репо HEAD:** `4d4fbfc`  
**Полный отчёт в репо проекта:** `docs/BUGS_FOUND_2026-06-25.md`

---

## Итог: 31 баг, 14 категорий мусора, 10 замечаний

Все баги найдены статическим анализом без Playwright.

---

## 🔴 Критические (P0) — ломают функциональность

| ID | Файлы | Описание | Статус |
|---|---|---|---|
| BUG-001 | SingleArticleCluster.astro, SeriesLiteCluster.astro, controller.js | CSS body class mismatch: `fc-single-active` в CSS, `gb-cluster-single-active` в JS → старые controls не скрываются | confirmed |
| BUG-002 | baptisty (10 стр.) + nagornaya (5 стр.) root HTML | Нет `data-fc-root` → контроллер не инициализирует click-handling | confirmed |
| BUG-003 | articles/krajne/index.html, articles/rimlyanam-7/index.html | Root HTML без gb-ember/gb-save, Astro source — с ними → parity fail при следующем build | confirmed |
| BUG-004 | package.json | `validate:static-publication` вызывает `migration:metadata:check` без `--strict` | confirmed |
| BUG-005 | migration/route-migration-matrix.json | Нет режима `strict-native-holding-page`, holding pages как `strict-native-app` | confirmed |
| BUG-006 | data/route-profiles/karty-*.json | Все 10 karty profiles = `legacy-shadow-app` (регрессия P0.6) | confirmed |
| BUG-007 | GillContextPageChrome.astro | Нет PlayEmber + SaveButton в gbs-rail-foot | confirmed |
| BUG-029 | RomanNumeral.astro, GillPart1-3+Spravochnik PageChrome | `fc-roman` (Astro) и `gb-roman` (root HTML) — CSS не существует ни в одном файле | confirmed |

---

## 🟡 Важные (P1)

| ID | Описание | Статус |
|---|---|---|
| BUG-008 | `floating-cluster.css` не подключён на baptisty (10) + nagornaya (5) | confirmed |
| BUG-009 | NagornayaChastN PageFooter использует устаревший hash контроллера `c78a4236` | confirmed (= PS-10) |
| BUG-010 | hard-texts part3 `zakon-duha-zhizni` без `readTime` в series.json | confirmed |
| BUG-011 | floating-cluster.css: 207 `!important` > ceiling 202 | confirmed |
| BUG-026 | Все 10 baptisty без BreadcrumbList в JSON-LD | confirmed |
| BUG-027 | Все 11 baptisty с SVG og:image (соцсети не рендерят SVG) | confirmed |
| BUG-030 | site-layered.css (282KB) в sw.js precache — не используется нигде | confirmed |
| BUG-031 | audit/ 10 файлов дублируют audit/archive/ (211KB) | confirmed |

---

## 🟢 Замечания (P2/S0)

| ID | Описание |
|---|---|
| BUG-012 | Nagornaya root HTML: нет data-fc-root → body class не активируется |
| BUG-013 | gill-context root HTML vs Astro source: расхождение по PlayEmber |
| BUG-014 | AGENTS.md не обновлялся с r299 (24 июня) |
| BUG-015 | AUDIT_HISTORY.md не обновлялся с v72 (22 июня) |
| BUG-016 | GillPart1-3+Spravochnik PageChrome нет data-fc-root |
| BUG-017 | SeriesLiteCluster body class `fc-series-active` vs controller `gb-cluster-series-active` |
| BUG-018 | SingleArticleCluster body class `fc-single-active` — dead CSS в dist |
| BUG-019 | floating-cluster.css не подключён на krajne + rimlyanam7 |
| BUG-020 | Nagornaya Astro PageFooter устаревший hash c78a4236 |
| BUG-021 | karty route-profiles stale legacyPath + visualParity 0/0 |
| BUG-022 | baptisty sw.js precache занимает место для файла который никогда не запросят |
| BUG-023 | Nagornaya Astro PageChrome: нет data-fc-root/fc-controls → controller не найдёт кнопки |
| BUG-024 | Dead CSS fc-single-active в dist (Astro compile) |
| BUG-025 | gill-context has data-fc-root но нет PlayEmber |
| BUG-028 | nagornaya-visual-parity-audit.js не проверяет nag-sidebar-ember |
| BUG-031 | audit/ 10 дублей (211KB) |

---

## 🗑️ Мусор (14 категорий)

| ID | Что | Размер | Статус |
|---|---|---|---|
| TRASH-001 | js/site-modules.js | 8.7KB | мусор |
| TRASH-002 | js/modules/ (4 файла) | 6.9KB | мусор |
| TRASH-003 | scripts/bundle-modules.js | 2.1KB | мусор |
| TRASH-004 | _check-fonts.mjs, _check-styles.mjs, _diag-kod.mjs | 11KB | мусор (Arena-диагностика) |
| TRASH-005 | docs/lanes/visual-fix-nagornaya-native-2026-06-23/visual/*.png | **30.1MB** | мусор (pixel-diff скриншоты) |
| TRASH-006 | .state-grid CSS в floating-cluster.css | ~30b | мусор (probe class) |
| TRASH-007 | site-modules.js в sw.js precache | — | исправить |
| TRASH-008 | data/term-links.json | 12KB | вероятно мусор |
| TRASH-009 | data/strategic-map-antisovetov.json | 30KB | вероятно мусор |
| TRASH-010 | src/utils/legacyFullDocument.ts | 1.4KB | мусор (не импортируется) |
| TRASH-011 | src/utils/legacyShadow.ts | 3KB | мусор |
| TRASH-012 | _build-tools/MAP-MOCKUPS-STANDALONE.html | **10.1MB** | сомнительный |
| TRASH-013 | audit/ 10 дублей из archive/ | 211KB | мусор |
| TRASH-014 | site-layered.css в sw.js precache | 282KB трафика | исправить |

---

## Пересечение с PS-* из incoming/arena-agent

| PS-ID | Мой ID | Вердикт |
|---|---|---|
| PS-01 qs crash | — | needs-reverification (статически не воспроизводится) |
| PS-04 heart без контроллера | BUG-003 | confirmed |
| PS-05 stray garbage | — | false-positive в HEAD |
| PS-06 readTime 35 vs 50 | BUG-009 related | confirmed |
| PS-07 duplicate IDs | BUG-029 related | confirmed |
| PS-10 cache-bust drift | BUG-009 | confirmed |
