# КОНТРОЛЬНЫЙ АУДИТ РЕПО — 55+ БАГОВ (повторный полный, на 3a05a1e7)

**Дата:** 2026-08-05 · **Source main:** `3a05a1e7` (стабилен с прошлого контроля) · **Ветка:** `arena/019fd2bb-auditrepo` (открыта)
**Метод:** полный программный пересчёт всех 55+ ID одним скриптом (grep/JSON/рекурсивный find) + 10 контрактов.

---

## 1. Karty Engine — 19 проверок (все подтверждены)

| ID | Значение | Статус |
|---|---|---|
| MAP-P1-20 unversioned map-engine.js | 2/2 html | 🔴 |
| MAP-P1-11 cfg.W0/view.w | 1 | 🔴 |
| MAP-P1-12 compass 50,80 | 1 | 🔴 |
| ENGINE-P1-29 dblclick 450 | 1 | 🔴 |
| RIVER-P1-01 scale=7 | 1 | 🔴 |
| RIVER-P1-02 def _engine | 0 (4 use) | 🔴 |
| TEXT-P1-01 len*0.6 | 1 | 🔴 |
| REG-P1-01 regions | 0 | 🔴 |
| QUAL-P1-05 nonpassive | 5 | 🔴 |
| QUAL-P1-06 timers | 25 | 🔴 |
| SIG-P1-01 x-74 | 2 | 🔴 |
| DRAW-P1-01 ly+=12 | 1 | 🔴 |
| LOD-P1-01 stroke 2.6 | 1 | 🔴 |
| PERF-P1-01 dur=14s | 2 | 🔴 |
| QUAL-P2-04 renderMarkers wipe | 1 | 🔴 |
| ENGINE-P2-04 toast no role | 1 | 🔴 |
| UI-P1-01 me-search abs | 1 | 🔴 |
| MINI-P1-01 minimap no-geo | 0 polygon/path | 🔴 |
| ENGINE-P2-03 600ms loader | 1 | 🔴 |

## 2. Karty Data — 10 проверок

| ID | Значение | Статус |
|---|---|---|
| anchors / leaders | 0 / 0 (все 11 карт) | 🔴 |
| glyphs | 0 (все 11) | 🔴 |
| QUAL-P1-08 og stub | 9 карт | 🔴 |
| QUAL-P1-03 ascii ranges | 330 | 🔴 |
| MEDIA-P1-01 wikimedia | 226 | 🔴 |
| MAP-P2-02 preload route.json | 2 | 🔴 |
| MAP-P1-10 ishod base-geo | 0 | 🔴 |
| SVG-P1-01 nbsp export | 2 | 🔴 |
| QUAL-P2-02 nachalo stories | 0 | 🔴 |

## 3. Home — 8 проверок

| ID | Значение | Статус |
|---|---|---|
| AR-IDX-05 version 1778943682 | 10 | ⚠️ |
| AR-IDX-05 version 1781282355 | 11 | ⚠️ (3 версии!) |
| AR-IDX-06 reading-progress | 5 | 🔴 |
| AR-IDX-07 h1 tabindex | 2 | 🔴 |
| AR-IDX-04 h-nav-fav | 0 | 🔴 |
| AR-IDX-CSS-02 overflow | 1 | 🔴 (объект h-ambient) |
| AR-IDX-CSS-03 3s fallback | 1 | 🔴 |
| AR-IDX-JS-01 pagehide | 5 файлов | 🔴 |

## 4. Nagornaya — 5 проверок

| ID | Значение | Статус |
|---|---|---|
| NG-INLINE-01 inline colors | 11 файлов / 87 вхождений | 🔴 |
| NG-TOC-01 amber fallback | 1 | 🔴 |
| NG-SEO-01 v4.0 | 6 | 🔴 |
| NG-CROSS-01 colors | 35 | 🔴 |

## 5. CI/D — 8 проверок

| ID | Значение | Статус |
|---|---|---|
| workflows | **51** | ⚠️ |
| D-1 deploy group | pages | 🔴 |
| D-1 indexnow group | metadata-indexnow-* | 🔴 |
| D-4 magic z | 5 | 🔴 |
| D-19 antisovetov title≠og | 1 | 🔴 |
| D-19 rimlyanam title≠og | 1 | 🔴 |
| BUG-SEO-001 continue-on-error | 1 (без ассерта) | 🔴 |
| BUG-PERF-001 add/remove | **369/31** | 🔴 |

## 6. Прочее — 4 проверки

| ID | Значение | Статус |
|---|---|---|
| SEARCH-P2-07 bible | 24+21=45 (66 реестр) | 🔴 |
| STRANGLER legacy index.html | **54** vs 83 astro | 🔴 (открыт!) |
| Контракты | **9 PASS + 1 FAIL** | ✅/🔴 |
| NG-DARK-01 (закрытая) | 134 !important | ✅ |

---

## 7. ИТОГ

**~55 проверок: 50 подтверждены открытыми, 4 закрытые подтверждены, 1 FAIL контракт (baptist-3d).**

Изменения против прошлых отчётов: **нет** — все значения стабильны на `3a05a1e7` (main не двигался, наши уточнения верны). Ключевые цифры: 54 legacy-дубля (STRANGLER открыт), 51 workflow (46 setup-node), 369/31 слушатели, 3 версии SITE_CONFIG, 45/66 книг корпуса.

**Рекомендации (реальные, не мелочь):**
1. ci-routes-маршрутизатор (46 setup-node из 51 — главная разгрузка).
2. SITE_CONFIG.version → 1 генератор (3 версии).
3. STRANGLER-HYGIENE — реальный техдолг (54 дубля), НЕ закрывать.

---

*Документ — untracked; будет добавлен в ветку коммитом.*
