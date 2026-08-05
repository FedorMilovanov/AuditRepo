# RE-VERIFICATION PASS — gb-is-my-strength @ `007c2d3c` (2026-08-05)

**Проверено на:** `main@007c2d3c50b9ada78a7f4ee709ea493d1ec20d3a` = **PR #1039** «fix(search): complete accessible top-layer command palette» + **PR #1045** «enforce exact live Home candidate parity» (127 файлов, +841/−287 от `4ce39dc8`).
**Дата:** 2026-08-05 20:32+03:00 · **Метод:** полный повторный прогон всех ~75 ранее подтверждённых строк на свежем HEAD (git fetch + reset --hard).

> ⚠️ Важно: main **сдвинулся** с `4ce39dc8` на `007c2d3c` — прежний отчёт (MASTER_VERIFICATION) был на устаревшем HEAD. Этот документ — актуальный.

---

## A. Что изменили PR #1039/#1045 (главные дельты)

| ID | Было на `4ce39dc8` | Стало на `007c2d3c` | Новый статус |
|---|---|---|---|
| **SEARCH-P2-10** (нет combobox-контракта) | 0 role=combobox/aria-activedescendant | **role="combobox" ×1, aria-activedescendant ×7, aria-expanded ×3** | 🟢 **кандидат на закрытие** |
| **SEARCH-P2-11** (backdrop z-index 10000, нет close) | `z-index:var(--z-modal,10000)`, нет close-кнопки | **z-index: 2147483000** + добавлен `.cp-close` (44px, `aria-label="Закрыть поиск"`, `aria-controls` ×1) | 🟢 **кандидат на закрытие/сужение** |
| **SEARCH-P2-12** (chips 32px, нет 44px hitbox) | `.cp-scope-chip{min-height:32px}`; `.gb-nav-search-icon` без размеров | **`.cp-scope-chip{height:44px;min-height:44px}`**; `.gb-nav-search-icon{width:44px;height:44px;min-width:44px;min-height:44px}` | 🟢 **кандидат на закрытие** |
| **AR-IDX-05** (version хардкод/застой) | `1778943682` во всех PageHead (заморожен с 14.07) | **ТРИ значения**: `1778943682` ×10 + `1781282355` ×11 + `20260802` ×2 — кэш-баст частично обновлён, но **рассинхронен** | ⚠️ подтверждён (формулировка: «мультиверсионность/рассинхрон», не «застой») |
| **AR-IDX-10** (CSP legacy vs Astro) | (в части 5 ошибочно «унифицирован») | legacy `index.html`: **0** jsdelivr, **0** hf.co; Astro Home/Hermenevtika: **1+1** → расхождение РЕАЛЬНО | 🔴 подтверждён (направление: legacy без jsdelivr/hf.co) |
| **NG-STRUCT-01** | 0 обёрток в chast-2 | обёртки `group mb-6 mt-12` есть в I–V, IX, Summary, MainShell; **SectionX = 0** | 🟡 сузить до SectionX/остатков |
| workflows | 49 | **50** | ⚠️ пролиферация продолжается |

## B. Перепроверка всех подтверждённых строк (~70) — итог PASS

### Karty / MapEngine (19/19 PASS)

| ID | Evidence на `007c2d3c` | Статус |
|---|---|---|
| MAP-P1-20 | `map-engine.js` без `?v=` в avraam+ishod html (2) | 🔴 |
| MAP-P1-11 | `cfg.W0 / view.w` (map-engine.js:1447) | 🔴 |
| MAP-P1-12 | `translate(50, 80)` compass | 🔴 |
| ENGINE-P1-29 | `Math.min(view.w,450)` dblclick | 🔴 |
| RIVER-P1-01 | `scale="7"` feDisplacementMap (avraam) | 🔴 |
| RIVER-P1-02 | def `waterRipple` в `_engine/base-geo.svg` = 0; в avraam = 1 | 🔴 (сужено) |
| MINI-P1-01 | minimap = rect+точки, без географии | 🔴 |
| TEXT-P1-01 | `length*fontSize*0.6` | 🔴 |
| REG-P1-01 | 0 обращений к regions | 🔴 |
| QUAL-P1-05 | 5 wheel/touch/mousemove без passive | 🔴 |
| QUAL-P1-06 | 24 setTimeout/rAF | 🔴 |
| SIG-P1-01 | `origin.x-74` | 🔴 |
| DRAW-P1-01 | `ly += 12` | 🔴 |
| LOD-P1-01 | `stroke-width 2.6` без non-scaling | 🔴 |
| PERF-P1-01 | `dur="14s"` feTurbulence (2×) | 🔴 |
| QUAL-P2-04 | renderMarkers чистит `markersG.innerHTML=''` | 🔴 |
| ENGINE-P2-04 | toast без role/aria-live | 🔴 |
| UI-P1-01 | `.me-search{position:absolute;top:10px;right:116px}` (+второе определение top:8px) | 🔴 |
| ENGINE-P2-03 | 600мс `_tm` лоадер | 🔴 |

### Karty data/sheet (11/11 PASS)

| ID | Evidence | Статус |
|---|---|---|
| KARTY-DATA-P1-01 | **anchors=0, leaders=0 во всех 11** | 🔴 (усилен) |
| GLYPH-P1-01 | **glyphs=0 во всех 11** | 🔴 (усилен) |
| QUAL-P1-08 | og-заглушка в 9 картах | 🔴 |
| QUAL-P1-03 | **330** ASCII-диапазонов `N:N-N` | 🔴 |
| QUAL-P2-02 | nachalo: stories=0, meta без id/era/stats | 🔴 |
| ORN-P1-01 | `length * 14.6` + cornerOrn | 🔴 |
| GRAT-P1-01 | GRID lonToX (4) | 🔴 |
| SEA-P1-01 | seaPattern 20×20 | 🔴 |
| HALO-P1-01 | `halos.push` = 0 | 🔴 |
| ROUTE-P1-01 | catmullRom (1) | 🔴 |
| RELIEF-P1-01 | 16 `<ellipse>` гор | 🔴 |
| SVG-P1-01 | `&nbsp;` в 2 export-SVG | 🔴 |
| MEDIA-P1-01 | 226 wikimedia-URL | 🔴 |
| MAP-P2-02 | preload route.json ×2 | 🔴 |
| MAP-P1-10 | ishod: 0 base-geo | 🔴 |

### Search (7/7 PASS + 3 CHANGED)

| ID | Evidence | Статус |
|---|---|---|
| SEARCH-P1-01 | /map/, /konfessii/russkij-baptizm/, /karty/avraam/, /karty/ishod/ — 0 палитры; эти роуты **не используют BaseLayout** → нет даже глобального Ctrl+K | 🔴 |
| SEARCH-P2-07 | synodal 24 + kassian 21 = 45 при 66-книжном реестре | 🔴 |
| SEARCH-P3-01 | ⌘K ×11 (fallback-инъекции), нет платформозависимого label | 🔴 |
| SEARCH-P3-02 | slice(0,10)+slice(0,12) капы | 🔴 |
| SEARCH-P2-10 | combobox-контракт ДОБАВЛЕН | 🟢 |
| SEARCH-P2-11 | z-index 2147483000 + cp-close | 🟢 |
| SEARCH-P2-12 | чипы/иконки 44px | 🟢 |

### Home (10/10 PASS)

| ID | Evidence | Статус |
|---|---|---|
| AR-IDX-04 | h-nav-fav = 0 | 🔴 |
| AR-IDX-06 | h-reading-progress в 5 компонентах, enabled:false ×3 | 🔴 |
| AR-IDX-07 | h1 tabindex="-1" ×2 | 🔴 |
| AR-IDX-03/09 | ⌘K + нет alt/shift guard | 🔴 |
| AR-IDX-CSS-02 | home-v20 overflow-x:hidden | 🔴 |
| AR-IDX-CSS-03 | h-reveal-fallback 0s 3s | 🔴 |
| AR-IDX-JS-01 | pagehide в 5 js | 🔴 |
| AR-IDX-JS-02 | setItem('theme') legacy + reader-preferences | 🔴 |
| AR-IDX-A11Y-01 | карточки без :focus-visible (0) | 🔴 |
| AR-IDX-05 | 3 версии SITE_CONFIG.version (рассинхрон) | ⚠️ |

### Nagornaya (8/8 PASS)

| ID | Evidence | Статус |
|---|---|---|
| NG-INLINE-01 | inline-цвета в 11 файлах | 🔴 |
| NG-TOC-01 | amber fallback в mobile-hotfix | 🔴 |
| NG-STRUCT-01 | SectionX без обёртки (0) | 🟡 сужен |
| NG-CROSS-01 | cross-цвета в 13 файлах | 🔴 |
| NG-SERIYA-01 | 0 bg-stone-100 в seriya | 🔴 |
| NG-DEAD-01 | 4/4 компонента 0 импортов | 🔴 |
| NG-SEO-01 | v4.0 · Апрель 2026 ×6 | 🔴 |
| NG-VIS-10 | 0 ref-card | 🔴 |

### CI / системные / D (12/12 PASS)

| ID | Evidence | Статус |
|---|---|---|
| CI-WORKFLOW-PROLIFERATION | **50** воркфлоу (49→50) | ⚠️ |
| D-1 | `pages` vs `metadata-indexnow-*` группы | 🔴 |
| D-2 | `<50%` порог css-layer | 🔴 |
| D-4 | 5 magic z-index | 🔴 |
| D-7 | PremiumControlAnchor AuditRepo-ссылка | 🔴 |
| D-19 | antisovetov title≠og:title; **rimlyanam тоже (title ×6 vs og:title ×1)** | 🔴 обе |
| BUG-SEO-001 | continue-on-error, без ассерта 200/202 | 🔴 |
| BUG-011 | 22×768px | 🔴 |
| BUG-PERF-001 | **368/31** add/remove | 🔴 |
| S-SEC-01 | blacklist-санитайзер | 🔴 |
| GENEALOGY-ATLAS | atlas-interactive.html в data/ (не в dist) | 🔴 |
| GENESIS6 | src/pages/genesis6/ отсутствует | 🔴 |
| ATLAS-D-NAMESPACE | DEBT-REGISTER D-16..19 ×9 | 🔴 |
| AUDIT-JS-ESCAPER-DUP-X5 | tt×3 + F×1 + h×1 | 🔴 |
| AUDIT-CSS-GBFLOATER | 83 @media, дубли условий | 🔴 |
| R-001 | site.js 172 233 B | 🔴 |
| R-003 | sourcemap = 0 | 🔴 |
| R-004 | type=module = 0 | 🔴 |
| Speakable | 109 файлов | 🔴 |
| NF-DEAD-ENHANCE-SHIM | ×2 в контроллере | 🔴 |
| NF-GATE-IZ5-STALE | «Часть 1 из 5» в **4** скриптах (3→4) | 🔴 |
| NF-STRANGLER-BAR-DRIFT | mobTocBtn в legacy Gill html | 🔴 |
| NEW-HARDTEXTS-CSP | aws.cdn.hf.co = 0 в hard-texts | 🔴 |
| NEW-SAVE-QUOTE-TIMER-RACE | 500ms таймер | 🔴 |

### Кандидаты на закрытие — перепроверены (6/6 PASS как «лучше»)

| ID | Evidence | Статус |
|---|---|---|
| QUAL-P1-09 | currentStatus = 0 во всех route.json | 🟢 (закрыть) |
| STRANGLER-HYGIENE | корневых html = 4 (служебные) | 🟢 (закрыть) |
| ENGINE-P1-27 | Escape-разводка (closePhoto return) | 🟢 (закрыть) |
| MAP-P1-06 | allowedTabs arch/sci guard | 🟢 (закрыть) |
| MAP-P1-13 | role=button + tabindex=0 на маркерах | 🟢 (сузить) |
| BASE-P1-03 | #22241f отсутствует | 🟢 (сузить) |

---

## C. Итоговая сводка re-verification

| Группа | Проверено | PASS (🔴/⚠️) | CHANGED (🟢) |
|---|---|---|---|
| Karty engine | 19 | 19 | 0 |
| Karty data/sheet | 15 | 15 | 0 |
| Search | 10 | 7 | **3** (P2-10/11/12) |
| Home | 10 | 10 | 0 |
| Nagornaya | 8 | 8 | 0 |
| CI/D/системные | 20 | 20 | 0 |
| Кандидаты на закрытие | 6 | — | 6 подтверждены «лучше» |
| **Итого** | **~88 проверок** | **79 подтверждено** | **3 закрыто PR #1039 + 6 кандидатов** |

## D. Обновлённые цифры (для матрицы)

- Workflows: **50** · `SITE_CONFIG.version`: **3 значения** (1778943682×10 / 1781282355×11 / 20260802×2)
- anchors/leaders/glyphs: **0/0/0 × 11 карт** · QUAL-P1-03: **330** ASCII-диапазонов
- add/remove: **368/31** · NF-GATE-IZ5: «Часть 1 из 5» в **4** скриптах
- Core CSS ~664КБ / JS ~590КБ (не перепроверялось заново — без изменений в diff)
- Speakable: 109

## E. Вывод

- **~79 строк подтверждены повторно** на актуальном HEAD — живые дефекты не ушли.
- **PR #1039 закрыл 3 search-строки** (SEARCH-P2-10/11/12) — они теперь кандидаты на формальное закрытие в матрице (145 → ~142).
- **AR-IDX-05 изменил природу**: не «застой», а **рассинхрон 3 версий** — требует унификации (W2).
- **AR-IDX-10 подтверждён** (в прошлом пассе ошибочно помечен унифицированным — legacy БЕЗ jsdelivr/hf.co, Astro С ними).
- Матрица после этого pass: **142 открытых** (145 − 3 search) с учётом закрытия PR #1039; кандидаты на reverify-закрытие — те же ~12.

*Документ — untracked в AuditRepo; коммиты/пуши не выполнялись.*
