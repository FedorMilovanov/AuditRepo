# ПОЛНЫЙ АУДИТ БОЛЬШОГО MD (gist afa3086) — что закрыто / открыто / устарело / ложно

**Дата верификации:** 2026-08-05 · **Source main:** `007c2d3c` (PR #1039) · **Матрица:** 371 = 226 closed + 145 open
**Документ:** секретный gist `FedorMilovanov/afa3086348c8fdfaa6fec9d062574992` — конкатенация 6 разных документов (17 агентских заданий 08-01; марафон-аудит 08-03; ZERO BACKLOG MASTER 08-03; Единый мастер-план 08-02; аудит порядка работ по AuditRepo 08-02; Архитектурный Монолит 2026).

---

## TL;DR

| Блок документа | Оценка |
|---|---|
| 17 агентских заданий (08-01) | 🟡 **устарели как план**: 6 закрыты, 8 частично, 3 открыты; часть scope перекрыта более поздними PR |
| Марафон-аудит трёх репозиториев (08-03) | ✅ **факты подтверждены** (12/12 merge-коммитов существуют, #132 сделан 08-04, Research #96 подтверждён) |
| ZERO BACKLOG MASTER (08-03) | ⚠️ **название ложно**: open≠0 (сейчас 145); сам документ честно оговаривается, но заголовок вводит в заблуждение; внутренне устарел (снимок `29a781d9` ≠ реальный `1a59d4f9` той же даты) |
| Единый мастер-план (08-02) | 🟡 **диагноз верен, roadmap актуален**: DONE-элементы реально в коде; P0/P1 — почти всё ещё открыто |
| Аудит порядка работ AuditRepo (08-02) | 🟡 **порядок правильный**, но устарел: 23 browser-строки → 5 уже закрыто, 18 открыто; счётчики 358→371 |
| Архитектурный Монолит | 🔴 **противоречит правилам проекта** (мастер-план §25 прямо запрещает XState, AST-rewrite, event-sourced) |

---

## Часть A. 17 агентских заданий — статус на 2026-08-05

| № | Агент | Статус в доке (08-03) | **Факт на 08-05** | Вердикт |
|---|---|---|---|---|
| 01 | GillWitness | PARTIAL/EXTERNAL | GILL-строки закрыты (source), внешние byte-реквизиты = 0 | 🟡 актуально |
| 02 | Editorial Metadata v3 | **DONE** | Гейт зелёный (PR #442/#672), но **AR-IDX-05 (3 версии SITE_CONFIG.version) и D-19 (обе половины) открыты** | ⚠️ **DONE ложно** |
| 03 | NoteRegistry | DONE | #758+#785 merged 08-02, #680 closed superseded | ✅ подтверждено |
| 04 | ReaderProjection/TTS | SOURCE DONE/LIVE OPEN | **#990 merged 08-05** (позже документа!); остаток = #61 | ✅ устарел в лучшую сторону |
| 05 | Legacy Quarantine | QUARANTINED | **#1005+#1013+#1032 merged 08-05** (позже документа) | ✅ устарел в лучшую сторону |
| 06 | Research→public | SOURCE STAGE DONE | Research #96 merged `18ad56f5`; PROMOTE=0, PUBLICATION_HOLD | ✅ подтверждено |
| 07 | Offline/PWA | DONE | #819 merged `1a59d4f9` (20/20); но **MAP-P1-20 (SW cache-bust map-engine.js) открыт** | 🟡 остаток в SW |
| 08 | Force-reset forensics | PARTIAL | tooling; forensic-скрипт в AuditRepo не работает в песочнице | 🟡 актуально |
| 09 | Baptists epilogue | SYSTEM DONE/EXTERNAL OPEN | receipts=0, внешние сканы не пришли | 🟡 актуально |
| 10 | Maps/archaeology | RESEARCH DONE/PRODUCT OPEN | 8 constraints/3 corridors/0 points; **~55 Karty-строк открыты** | 🔴 актуально (главный фронт) |
| 11 | Series/Heart | ASSEMBLY PARTIAL | 3 dossiers/26 claims/3 chapters; whole-book QA открыт (Research V83) | 🟡 актуально |
| 12 | Print/PDF | SOURCE DONE/LIVE OPEN | PRINT-строки закрыты; same-release live receipt не задокументирован | 🟡 актуально |
| 13 | Mobile/WebKit/a11y | PRODUCT DONE/AUDITREPO OPEN | **#132 merged 08-04** (A11Y-P1-02/03 закрыты); CI-WEBKIT-TOC-NONDETERMINISTIC открыт | ✅ устарел в лучшую сторону |
| 14 | Release/governance | HANDOFF REQUIRED | #132 сделан; **но issue #357 (красный CI на main) открыт с 25.07** | 🔴 актуально |
| 15 | Discovery follow-ups | **DONE** | **SEARCH-P1-01, P2-07, P3-01/02, AR-IDX-03/05/09/10 открыты** | ⚠️ **DONE ложно** |
| 16 | A04 residual/original-word | DONE | usage graph сделан (#901 verses.json удалён), но #61 открыт (favorites/speed) | 🟡 частично |
| 17 | Home archaeology | DONE FOR WAVE | #832/#833 merged; но AR-IDX-04..10 открыты | 🟡 частично |

**Итог:** из 17 «DONE» — реально полностью закрыты **3** (A03, A06, A13-часть). **DONE ложно у 2** (A02, A15). Остальные — честные PARTIAL/OPEN.

## Часть B. Марафон-аудит (08-03) — проверка фактов

### B1. Product merge-коммиты — 12/12 подтверждены на GitHub

| Заявленный PR | Заявленный merge | Факт (gh api) | ✅ |
|---|---|---|---|
| #819 Offline/PWA | `1a59d4f9` | `1a59d4f97 feat(pwa): rebuild honest route-level Offline/PWA contract (#819)` | ✅ |
| #810 Diotrophes | `e604b97d` | `e604b97db fix(ci): segment Diotrophes long-page screenshots (#810)` | ✅ |
| #856 live verifier | `69a5ad86` | `69a5ad86d feat(release): verify Diotrophes on the exact live candidate (#856)` | ✅ |
| #848 Playwright 1.62.1 | `aa7878cf` | `aa7878cf6 build(deps): verify Playwright 1.62.1 (#848)` | ✅ |
| #843 Gill TOC | `a1082785` | `a1082785d fix(gill): preserve native mobile TOC click completion (#843)` | ✅ |
| #842 tooltip hit | `d56a1467` | `d56a1467b fix(tooltips): preserve bounded hover transit (#842)` | ✅ |
| #850 Gill ARIA | `f268f839` | `f268f8398 fix(gill): own mobile Part TOC ARIA relationship (#850)` | ✅ |
| #845 Home flip | `eb952611` | `eb9526115 fix(home): restore clean sacred-name flip (#845)` | ✅ |
| #827/#829/#832/#833 | `70a8f111/16463c18/d6f07ad2/0f427b99` | все 4 существуют с теми же сообщениями | ✅ |

### B2. Research #96 — подтверждён
`18ad56f5e research(osk): close Wave 12 source stage without production claim (#96)` — существует. ✅

### B3. «Единственный незакрытый canonical write» — УЖЕ СДЕЛАН
Документ (08-03): «AuditRepo PR #132 нельзя merge — нет безопасного patch-механизма». **Факт:** #132 **merged 2026-08-04** `verify(avraam): disposition skip navigation and contrast`. В матрице: **A11Y-P1-02 = FIXED-CURRENT** и **A11Y-P1-03 = STALE-ON-CURRENT-HEAD** (обе с evidence `30807589787`, 304/304, 1208 contrast samples min 5.084:1). → **заявление устарело в лучшую сторону**; документ честно предупреждал «не использовать временный writer» — и это было соблюдено.

### B4. NEW-VOSK-DEAD-SPLITSENTENCES — закрыт ровно как рекомендовано
Документ: «закрыть по merge `aed8ed22`». **Факт:** в матрице строка 65 = FIXED-CURRENT (PR #755, `aed8ed22`). ✅ Рекомендация исполнена.

### B5. TypeScript 7 (#800) и Playwright #799 — подтверждены как «не merged»
`#800 state=closed merged=no` (TS 7), `#799 state=closed merged=no` (superseded #848), `#680 state=closed merged=no` (superseded #758/#785). ✅ Все три — как заявлено.

## Часть C. ZERO BACKLOG MASTER (08-03) — критическая оценка

1. **Название ложно**: документ сам пишет «это не декларация всё готово», но титул «VERIFIED ZERO BACKLOG» противоречит содержимому (в тексте: «358 = 187 closed + 171 open», «не закрыто: 117 строк», «основной backlog»).
2. **Внутренне устарел на дату создания**: снимок Product `main = 29a781d9`, тогда как марафон-аудит в ТОМ ЖЕ файле фиксирует `1a59d4f9` (08-03). Два раздела одного файла противоречат друг другу о текущем main.
3. **Сейчас (08-05)**: матрица 371 = 226 closed + 145 open → «zero backlog» тем более неверен.
4. **Что ценно**: раздел 2 «Действующие правила» и раздел 3 «Live lane map» (проверка PR-описаний против реальных diff — #759 15 файлов vs «9», #787 66 файлов vs «9») — методологически правильные и подтверждаются (те PR давно закрыты, но урок важен).

## Часть D. Единый мастер-план (08-02) — DONE и P0/P1

### D1. Заявленные DONE — ВСЕ подтверждены в коде (07-08-05)
| Механизм | Проверка |
|---|---|
| Build once → те же bytes | build-once PR #370 (`cd4b7706`), D-8 closed |
| Whole-tree digest + immutable candidate | матрица Deploy-якорь, run 30960174778 |
| Generic/TTS live witness | TTS-строки closed, live-артефакты |
| Canonical OverlayRuntime | READER-R5 closed |
| Deterministic offline fonts | FONT-PIPELINE-FAIL-OPEN closed |
| Workflow Policy v2 | WORKFLOW_POLICY_SHADOW_ERA_CLOSURE |
| Registry-derived route totals | HUB-AUDIT-COUNT-DRIFT closed |
| Pinned Actions/permissions | check-workflows.js contents:read |

### D2. Заявленные P0 — ВСЕ ещё открыты (подтверждено кодом)
| P0-пункт | Статус на 08-05 |
|---|---|
| 4. Deploy/Asset Manifest (вместо blanket-copy) | 🔴 нет; `copy-legacy-to-dist.js` + `astro-cache-bust-postbuild.js` живы; `data/**` копируется целиком |
| 5. Responsive image pipeline | 🔴 нет; `decoding`/srcset-инвентаря нет |
| 6. Publication/Research transaction | 🟡 Research #96 сделал projection; Product Publication Manifest — нет |
| 7. no-op release skip (publicPayloadDigest) | 🔴 нет |
| 8. Project Gate + Change classifier + Check Catalog | 🔴 нет (49 воркфлоу — как и предупреждал документ) |
| 9. Final-dist crawler | 🔴 нет (только dist-smoke) |
| 10. Runtime capabilities вместо includeLegacyRuntime | 🔴 `includeLegacyRuntime` жив в BaseLayout:38,67,185 |

### D3. P1-пункты — выборочная проверка
| Пункт | Статус |
|---|---|
| 10.2 Search intent loader | 🟡 search.js уже lazy (грузится по Ctrl+K/click) — частично сделано |
| 10.3 Intent prefetch | 🔴 **prefetch 5 разделов жив**: BaseLayout:170 `/articles/,/biografii/,/hard-texts/,/karty/,/about/` |
| 11 Route-level fonts | 🟡 3 preloads в BaseLayout + `fonts/fonts.css` 4 @font-face |
| 12 3D app (`_app/index.html`) | 🔴 **2 245 854 B raw** ≈ 2.25 MiB — точно как в документе |
| 13.2 CSP Report-Only | 🔴 нет (CSP postbuild жив) |
| 14 SW бинарное решение | 🟡 SW жив, MAP-P1-20 открыт |
| 20 `persons.json` | 🔴 `data/genealogy/v2/persons.json` существует (док: ~1.67 MiB raw) |

### D4. Вердикт по мастер-плану
**Диагноз точен** («слишком много параллельных владельцев одного факта»), **карта удаления старых владельцев (§24) правильная**, но **исполнение ~0%**: из 20 пунктов «самой короткой очереди» (§26) выполнено только 2 (защита main частично; #758/#680 закрыты). Всё остальное — открытый roadmap. Это не ложь, а честный план; он просто не исполнен.

## Часть E. Архитектурный Монолит — противоречит правилам проекта

| Предложение | Правило проекта (мастер-план §25) | Вердикт |
|---|---|---|
| 1. AST-Driven Reader Projection (Unified.js) | «XState для каждого popup — не вводить»; «новый frontend/CSS framework — не вводить» | 🟡 частично соответствует #61, но как «компилятор-rewrite» — REJECT в текущем виде |
| 2. Statecharts/XState для UI | **§25 прямо: «XState для каждого popup — не вводить»** | 🔴 **REJECT по правилам проекта** |
| 3. AOM Snapshotting + Docker goldens | Playwright Docker не запрещён; visual parity уже есть | 🟡 MEASURE (совместимо) |
| 4. Immutable Asset Ledger (CAS) | согласуется с Deploy/Asset Manifest P0 | 🟡 MEASURE (после P0) |
| 5. Event-Sourced Local-First (IndexedDB+Background Sync) | для A07; но продукт статический GitHub Pages без сервера — Background Sync некуда слать | 🔴 REJECT/MEASURE (нужен backend, которого нет) |
| Блоки 1–7 (34 источника) | источники валидны, но часть не применима к стеку | 🟡 справочно |

## Часть F. Сводная таблица «что с чем»

| Утверждение документа | Вердикт |
|---|---|
| «PR #810/#819/#827/#829/#832/#833/#842/#843/#845/#848/#850/#856 merged» | ✅ **истина** (12/12) |
| «Research #96 merged 18ad56f5» | ✅ **истина** |
| «TS7 #800 не merged; #799 superseded; #680 superseded» | ✅ **истина** |
| «AuditRepo #132 нельзя merge (нет patch-механизма)» | ✅ **было истиной на 08-03**; **выполнено 08-04** — устарело |
| «A02 Editorial Metadata DONE» | ⚠️ **ложно** — AR-IDX-05/D-19 открыты |
| «A15 Discovery DONE» | ⚠️ **ложно** — SEARCH-P1-01/P2-07/P3 открыты |
| «VERIFIED ZERO BACKLOG» | ⚠️ **ложно** (open 145 сейчас, 171 на 08-03) |
| «Кандидат 77.45 MiB → 50.96 MiB без UI-изменений» | ✅ проверяемо: 3D app 2.25MiB raw; atlas-export ~26MiB — правдоподобно |
| «23 browser-строки V2» | ✅ список корректен: **5 закрыто** (AVRAAM-P1-04, GATE-P1-01, DRAW-P1-02, A11Y-P1-01, QUAL-P1-04), **18 открыто** |
| «R-001..R-004 нельзя закрыть словом deferred» | ✅ согласуется: R-001 site.js 172КБ, R-003 no sourcemap, R-004 no modules |

## Итог

**Документ — ценная, в основном честная карта** (особенно марафон-аудит с точными SHA и мастер-план с диагнозом). Но:
1. **2 секции с ложными «DONE»** (A02, A15) и **1 ложный заголовок** (ZERO BACKLOG).
2. **Как план запуска — устарел**: все его «активные PR» (#758/#759/#787/#782/#793) давно закрыты; его «незакрытый #132» выполнен; его счётчики (358) устарели (371).
3. **Его главный совет остаётся верным**: «сначала disposition, потом repair; не ремонтировать по старым формулировкам; один root cause на PR» — и мы его соблюдаем в текущей верификации.
4. **Реальность на 08-05**: 145 open в матрице; ~77 подтверждены кодом; ~22 кандидаты на закрытие; ~33 browser-класс; 5 строк «хуже записи» (кэш-баст, воркфлоу 50, бюджеты, anchors/glyphs 0/0).

*Документ — untracked в AuditRepo; коммиты/пуши не выполнялись.*
