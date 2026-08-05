# ПОЛНЫЙ RE-VERIFICATION PASS #2 — gb-is-my-strength @ `007c2d3c` (2026-08-05)

**Проверено на:** `main@007c2d3c50b9ada78a7f4ee709ea493d1ec20d3a` (PR #1039 + #1045) — main **не двигался** с прошлого pass (проверено `git ls-remote` перед началом).
**Метод:** полный систематический прогон **~90 проверок** (Python-скрипты по кластерам: Karty engine, Karty data/sheet, Search, Home, Nagornaya, CI/D, закрытые-спот-чек, кандидаты).
**Дата:** 2026-08-05.

---

## 1. Karty Engine — 19/19 подтверждено

| ID | Ожидание | Факт | Статус |
|---|---|---|---|
| MAP-P1-20 | unversioned map-engine.js | 2/2 html | 🔴 |
| MAP-P1-11 | cfg.W0/view.w | 1 | 🔴 |
| MAP-P1-12 | compass translate(50,80) | 1 | 🔴 |
| ENGINE-P1-29 | dblclick min(w,450) | 1 | 🔴 |
| RIVER-P1-01 | feDisplacement scale=7 | 1 | 🔴 |
| RIVER-P1-02 | def нет в `_engine/base-geo.svg` (в avraam есть) | 0 / 1 | 🔴 (сужено) |
| MINI-P1-01 | миникарта без географии | 0 polygon/path (только rect+dots) | 🔴 |
| TEXT-P1-01 | len*fontSize*0.6 | 1 | 🔴 |
| REG-P1-01 | 0 обращений к regions | 0 | 🔴 |
| QUAL-P1-05 | 5 не-passive слушателей | 5 | 🔴 |
| QUAL-P1-06 | 24-25 таймеров | 25 | 🔴 |
| SIG-P1-01 | origin.x-74 | 2 | 🔴 |
| DRAW-P1-01 | ly += 12 | 1 | 🔴 |
| LOD-P1-01 | stroke-width 2.6 | 1 | 🔴 |
| PERF-P1-01 | feTurbulence dur=14s | 2 | 🔴 |
| QUAL-P2-04 | renderMarkers wipe | 1 | 🔴 |
| ENGINE-P2-04 | toast без role | 1 | 🔴 |
| UI-P1-01 | me-search absolute | 1 | 🔴 |
| ENGINE-P2-03 | 600мс лоадер | 1 | 🔴 |

## 2. Karty Data / Sheet — 15/15 подтверждено

| ID | Факт | Статус |
|---|---|---|
| KARTY-DATA-P1-01 | anchors=0, leaders=0 во **всех 11** картах | 🔴 |
| GLYPH-P1-01 | glyphs=0 во **всех 11** | 🔴 |
| QUAL-P1-08 | og-заглушка в 9 картах | 🔴 |
| QUAL-P1-03 | **330** ASCII-диапазонов N:N-N | 🔴 |
| QUAL-P2-02 | nachalo: stories=0, meta без id/era/stats | 🔴 |
| ORN-P1-01 | length*14.6 | 🔴 |
| GRAT-P1-01 | lonToX ×4 | 🔴 |
| SEA-P1-01 | seaPattern 20×20 | 🔴 |
| HALO-P1-01 | halos.push = 0 | 🔴 |
| ROUTE-P1-01 | catmullRom(pts) | 🔴 |
| RELIEF-P1-01 | 16 `<ellipse>` | 🔴 |
| SVG-P1-01 | `&nbsp;` в 2 export-SVG | 🔴 |
| MEDIA-P1-01 | 226 wikimedia-URL | 🔴 |
| MAP-P2-02 | preload route.json ×2 | 🔴 |
| MAP-P1-10 | ishod: 0 base-geo | 🔴 |
| ARCH-P1-01 | sheet-engine только в build-скрипте | 🔴 |

## 3. Search — 4 подтверждено / 3 закрыто PR #1039

| ID | Факт | Статус |
|---|---|---|
| SEARCH-P1-01 | палитры нет на /map/, /konfessii/russkij-baptizm/, /karty/avraam/, /karty/ishod/; эти роуты **не используют BaseLayout** → нет глобального Ctrl+K | 🔴 |
| SEARCH-P2-07 | synodal 24 + kassian 21 = 45 (реестр 66) | 🔴 |
| SEARCH-P3-01 | ⌘K ×11, нет платформозависимости | 🔴 |
| SEARCH-P3-02 | капы slice(0,10)+slice(0,12) | 🔴 |
| SEARCH-P2-10 | combobox+aria-activedescendant+aria-expanded добавлены (11) | 🟢 закрыто #1039 |
| SEARCH-P2-11 | z-index 2147483000 + `.cp-close` 44px | 🟢 закрыто #1039 |
| SEARCH-P2-12 | чипы 44px + nav-icon 44px | 🟢 закрыто #1039 |

## 4. Home — 10/10 подтверждено

| ID | Факт | Статус |
|---|---|---|
| AR-IDX-05 | **3 версии**: 1778943682×10 / 1781282355×11 / 20260802×2 — рассинхрон кэш-баста | ⚠️ |
| AR-IDX-06 | reading-progress в 5 компонентах при enabled:false | 🔴 |
| AR-IDX-07 | h1 tabindex=-1 ×2 | 🔴 |
| AR-IDX-04 | h-nav-fav = 0 | 🔴 |
| AR-IDX-03 | ⌘K ×11 | 🔴 |
| AR-IDX-09 | `(e.metaKey||e.ctrlKey)&&k` — **без** shift/alt guard (проверено контекстно) | 🔴 |
| AR-IDX-CSS-02 | home-v20 overflow-x:hidden | 🔴 |
| AR-IDX-CSS-03 | h-reveal-fallback 0s 3s | 🔴 |
| AR-IDX-JS-01 | pagehide в 5 js | 🔴 |
| AR-IDX-JS-02 | theme multi-writer | 🔴 |
| AR-IDX-A11Y-01 | карточки без :focus-visible (0) | 🔴 |
| AR-IDX-10 | legacy 0 jsdelivr vs astro 2 — **расхождение реально** | 🔴 |

## 5. Nagornaya — 9/9 подтверждено

| ID | Факт | Статус |
|---|---|---|
| NG-INLINE-01 | inline-цвета в 11 файлах | 🔴 |
| NG-TOC-01 | amber fallback | 🔴 |
| NG-STRUCT-01 | обёртки есть в 11 chast-2, но **SectionX = 0** | 🟡 сужен |
| NG-CROSS-01 | cross-цвета в 13 файлах | 🔴 |
| NG-SERIYA-01 | 0 bg-stone-100 в seriya | 🔴 |
| NG-DEAD-01 | **7/7 компонентов — 0 импортов** | 🔴 |
| NG-SEO-01 | v4.0 · Апрель 2026 ×6 | 🔴 |
| NG-VIS-10 | 0 ref-card | 🔴 |
| NG-A11Y-01 | **49 emoji** в nagornaya astro — ПОДТВЕРЖДЁН (мой прошлый «0» был ошибкой grep) | 🔴 |

## 6. CI / Системные / D — 20/20 подтверждено

| ID | Факт | Статус |
|---|---|---|
| CI-WORKFLOW-PROLIFERATION | **50** воркфлоу | ⚠️ |
| D-1 | pages vs metadata-indexnow-* | 🔴 |
| D-2 | <50 порог | 🔴 |
| D-4 | 5 magic z | 🔴 |
| D-7 | PremiumControlAnchor AuditRepo | 🔴 |
| D-19 | **antisovetov И rimlyanam**: title с «| Господь Бог», og:title без | 🔴 обе |
| BUG-SEO-001 | continue-on-error, без ассерта | 🔴 |
| BUG-011 | 768×22 / 760×34 / 761×12 | 🔴 |
| S-SEC-01 | blacklist-санитайзер | 🔴 |
| GENEALOGY-ATLAS | файл в main, в data/ (не в dist) | 🔴 |
| GENESIS6 | src/pages/genesis6/ отсутствует | 🔴 |
| ATLAS-D-NAMESPACE | 9 вхождений D-16..19 в DEBT-REGISTER | 🔴 |
| AUDIT-JS-ESCAPER-DUP-X5 | tt×3 + F×1 + h×1 | 🔴 |
| AUDIT-CSS-GBFLOATER | 83 @media | 🔴 |
| R-001 | site.js 172 233 B | 🔴 |
| R-003 | sourcemap отсутствует | 🔴 |
| R-004 | type=module = 0 | 🔴 |
| Speakable | 109 файлов | 🔴 |
| BUG-PERF-001 | 368/31 | 🔴 |
| NF-DEAD-ENHANCE-SHIM | ×2 | 🔴 |
| NF-GATE-IZ5-STALE | «Часть 1 из 5» в 4 скриптах | 🔴 |
| NF-STRANGLER-BAR-DRIFT | mobTocBtn в legacy Gill | 🔴 |
| NEW-HARDTEXTS-CSP | 0 aws.cdn.hf.co | 🔴 |
| NEW-SAVE-QUOTE-TIMER-RACE | 500ms | 🔴 |

## 7. Закрытые строки — спот-чек (13/13 PASS)

D-21 (0 innerHTML) · SEARCH-P2-08 (verses.json отсутствует) · **NG-DARK-01 (ровно 134 !important в nagornaya-mobile-toc.css)** · TTS SharedWorker (4) · NF-SPEEDSLOT (0) · HUB derived (✓) · AR-IDX-01 hreflang (1) · SEARCH-P2-09 SearchAction (2) · ReaderProjection workflow (✓) · NEW-65 baptisty (✓) · CI-INDEXNOW contents:read (✓) · D-22 href guard (✓) · D-23 warmVosk (5)

## 8. Кандидаты на закрытие — перепроверены (6/6 «лучше»)

ENGINE-P1-27 (Escape split ×1) · MAP-P1-06 (allowedTabs ×2) · MAP-P1-13 (role=button + tabindex=0) · BASE-P1-03 (#22241f = 0) · DATA-P1-04 (semanticZoom ×4) · QUAL-P1-09 (currentStatus = 0) · STRANGLER-HYGIENE (4 корневых html) — все подтверждают «код уже лучше».

---

## ИТОГ

| Группа | Проверено | 🔴/⚠️ | 🟢 |
|---|---|---|---|
| Karty engine | 19 | 19 | 0 |
| Karty data/sheet | 16 | 16 | 0 |
| Search | 7 | 4 | 3 |
| Home | 12 | 12 | 0 |
| Nagornaya | 9 | 9 | 0 |
| CI/D/системные | 24 | 24 | 0 |
| Закрытые (спот-чек) | 13 | 0 | 13 ✅ |
| Кандидаты на закрытие | 7 | 0 | 7 |
| **ВСЕГО** | **~107 проверок** | **84 подтверждено** | **3 закрыто + 13 закрытых подтверждено + 7 кандидатов** |

**Вывод:** на актуальном `007c2d3c` **84 открытые строки подтверждены повторно** (все 70+ «багов» из прошлых pass'ов живут), **3 закрыты** смержем PR #1039 (SEARCH-P2-10/11/12), **13 закрытых не переоткрылись**, **7 кандидатов готовы к reverify-закрытию**. Матрица после этого pass: **142 открытых** (145 − 3) + ~12 reverify-кандидатов.

**Две коррекции к прошлым отчётам:**
1. **NG-A11Y-01 ПОДТВЕРЖДЁН** — 49 emoji в nagornaya-компонентах (прошлый «0» — ошибка grep-регекса с юникодом).
2. **AR-IDX-09 подтверждён** — контекстная проверка: в keydown-обработчике Ctrl+K нет проверки shiftKey/altKey.

*Документ — untracked в AuditRepo; коммиты/пуши не выполнялись.*
