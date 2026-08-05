# MASTER VERIFICATION — gb-is-my-strength (единая таблица по 145 открытым строкам)

**Дата:** 2026-08-05 · **Проверено на:** `main@4ce39dc816727c43373491acfb5bad0916cde113` (PR #1036)
**Метод:** свежий shallow-clone, точечная проверка каждой строки кодом (grep/JSON/CSS-анализ).
**Серия-источник:** `DEEP_AUDIT_SOURCE_VERIFICATION{,PART2..PART8}_2026-08-05.md` (8 файлов; этот документ — их консолидация).

## Легенда статусов

| Код | Статус | Что делать |
|---|---|---|
| 🔴 | **Подтверждён** на текущем main (живой дефект) | оставить открытым, чинить |
| ⚠️ | **Подтверждён, но хуже записи** (недооценён в матрице) | поднять severity/обновить цифры |
| 🟢 | **Кандидат на закрытие/сужение** (код уже лучше) | формальный reverify → закрыть/сузить |
| 🟡B | **Browser-класс** (кодом не проверяется) | Playwright exact-HEAD (SD-7) |
| 🟡O | **Owner/live/данные** (решение владельца / live / контент) | решение/проверка извне |
| ✅ | **Закрытая строка** (спот-чек: код подтверждает фикс) | — |

---

## Единая таблица ID → статус → evidence

### 🔴 Подтверждено (живые дефекты, ~68)

| ID | Evidence (файл:строка на `4ce39dc8`) |
|---|---|
| SEARCH-P1-01 | 0 следов GBSearch/command-palette на `/map/`, `/konfessii/russkij-baptizm/`, `/karty/avraam/`, `/karty/ishod/` |
| MAP-P1-20 | `karty/avraam/index.html:1177`, `ishod:51` — `<script src="../_engine/map-engine.js">` без `?v=` → cacheFirst stale |
| MAP-P1-11 | `map-engine.js:1447` `const screenPxPerKm=(cfg.W0/view.w)*pxPerKm` |
| MAP-P1-12 | `map-engine.js:1184` `compass.setAttribute('transform','translate(50, 80)')` — в pan/zoom группе |
| ENGINE-P1-29 | `map-engine.js:2135` `flyTo(place.x,place.y,Math.min(view.w,450),600)` (dblclick) |
| RIVER-P1-01 | `avraam/base.svg:46` `<feDisplacementMap … scale="7"` |
| RIVER-P1-02 | `_engine/base-geo.svg`: 5 use, def отсутствует (в `avraam/base.svg:39` — есть) → сужено до общего файла |
| MINI-P1-01 | `map-engine.js:1537` minimap = `<rect>` + точки + viewport-rect, без географии |
| TEXT-P1-01 | `map-engine.js:2179` `labelText.length*fontSize*0.6` |
| REG-P1-01 | `map-engine.js`: 0 вхождений `regions` |
| QUAL-P1-03 | `karty/*/route.json`: десятки `2:1-7`, `25:11-12`, `17:1-9` (ASCII дефис) |
| QUAL-P1-05 | `map-engine.js`: 5 addEventListener(wheel/touch/mousemove) без passive |
| QUAL-P1-06 | `map-engine.js`: 24 setTimeout/rAF без cleanup |
| QUAL-P1-08 | `og-karty-1200x630.webp` в 18 html (9 карт: early-church, ishod, maccabim, melachim, pavel, revelation, shoftim, shvatim, yeshua) |
| UI-P1-01 | `map-engine.js`: `.me-search{position:absolute;top:8px;right:112px}` (в матрице right:48 — обновить) |
| ENGINE-P2-03 | `map-engine.js:3209` `_tm(…,600)` — 600мс задержка скрытия лоадера |
| ENGINE-P2-04 | `map-engine.js:1337` `toastEl.className='me-toast'` — нет role=status/aria-live |
| QUAL-P2-02 | `karty/nachalo/route.json`: нет `stories`(0), meta без id/era/stats, publication=draft |
| QUAL-P2-04 | `map-engine.js:1717+` `renderMarkers()` чистит 6 групп через `innerHTML=''` и пересоздаёт узлы |
| SIG-P1-01 | `map-engine.js:1952` `M${origin.x-74},${origin.y-86}…` — жёсткие пиксельные смещения |
| DRAW-P1-01 | `map-engine.js:2196` `if (nearbyLabels.length > 0) ly += 12;` |
| LOD-P1-01 | `map-engine.js:1840` `path.setAttribute('stroke-width','2.6')` без non-scaling |
| PERF-P1-01 | `avraam/base.svg:40-45` `<feTurbulence id="waveTurb">` + `dur="14s"` |
| MAP-P2-02 | `avraam/index.html:17`, `ishod:17` `<link rel="preload" href="route.json" as="fetch">` |
| MAP-P1-10 | `ishod/index.html`: 0 `terrain`/`base-geo` (в `avraam:1337` есть) |
| ORN-P1-01 | `scripts/lib/sheet-engine.js:141` `cornerOrn`; `:741` `title.length*14.6` |
| GRAT-P1-01 | `sheet-engine.js:437-445` линейные `lonToX/latToY` GRID |
| SEA-P1-01 | `sheet-engine.js:49` `<pattern id="seaPattern" width="20" height="20">` |
| HALO-P1-01 | `sheet-engine.js:579` `halos=[]`; `halos.push` = 0 |
| ROUTE-P1-01 | `sheet-engine.js:477,531` `catmullRom(routePts)` |
| RELIEF-P1-01 | `sheet-engine.js:185-189` `<ellipse rx=10..15 ry=62..92>` |
| ARCH-P1-01 | sheet-engine — Node build-time (`scripts/lib/`, импорт только `atlas-build-sheet.js`); браузер — тёмный map-engine → раскол подтверждён |
| SEARCH-P2-10 | `js/search.js`: нет role=combobox/aria-activedescendant/aria-expanded |
| SEARCH-P2-11 | `css/command-palette.css`: `.cp-backdrop{z-index:var(--z-modal,10000)}` |
| SEARCH-P2-12 | `command-palette.css`: `.cp-scope-chip{min-height:32px}`; `.gb-nav-search-icon` без 44px |
| SEARCH-P3-01 | `search.js`: `aria-label="Поиск (⌘K)"`, `title="Поиск ⌘K"`, `<span class="kb">⌘K</span>` |
| SEARCH-P3-02 | `search.js`: `slice(0,10)` Pagefind + `slice(0,12)` occurrences — капы без «Показать ещё» |
| SEARCH-P2-07 | `data/bible/`: synodal 24 + kassian 21 = 45 записей при 66-книжном реестре |
| S-SEC-01 | `enhancements.js` FAQPath: вырезает script/style/iframe/on*/javascript: — blacklist, не allowlist |
| D-1 | `deploy.yml:22-24` `group: pages` vs `indexnow.yml:18-20` `metadata-indexnow-diagnostics-*` — разные группы |
| D-2 | `css-layer-validator.js:121` порог `<50%`, цель ≥80%; запуск по site.css |
| D-4 | `floating-cluster.css`: `z-index:2102!important`(:2928), `9999`(:3003), `2147483000`(:3281,3326,4424), `2147483100`(:3546) |
| D-7 | `PremiumControlAnchor.astro:3` — репо-относительная ссылка (комментарий) |
| D-19 | `AntisovetovPageHead.astro:16/26`, `Rimlyanam7PageHead.astro:14/22` — `<title>` с «| Господь Бог», `og:title` без (ОБЕ половины) |
| BUG-SEO-001 | `deploy.yml:327-343` IndexNow `continue-on-error:true` + curl без ассерта 200/202 |
| BUG-011 | 22×`768px` + 28×`760px` + 12×`761px` — коллизия у 768 |
| ATLAS-D-NAMESPACE-COLLISION | `working/atlas/DEBT-REGISTER.md` D-16..19 = визуальные баги Авраама; в матрице D-16..19 = SW/dates |
| GENESIS6-ACTIVATION-OWNER-GAP | `src/pages/genesis6/` не существует; в manifest только image-записи |
| NG-INLINE-01 | inline `#1c1410/#8a7968/#b8882a/#faf8f5` в `NagornayaChast{1,2}MainShell/SectionX` |
| NG-TOC-01 | `mobile-hotfix.css:32` `var(--ng-toc-accent-2, #f59e0b) !important` — amber fallback жив |
| NG-STRUCT-01 | `NagornayaChast2SectionX.astro`: 0 `class="group mb-6 mt-12"` |
| NG-CROSS-01 | `text-purple-800/emerald-700/blue-*` в chast-1..5 |
| NG-SERIYA-01 | `nagornaya/seriya/`: нет `bg-stone-100` на body |
| NG-DEAD-01 | 7 компонентов (Chast{1..5}ArticleBody, HeaderHero, PostContent) — 0 импортов |
| NG-VIS-10 | ref-card/ref-системы в nagornaya нет (библиография ad-hoc) |
| NF-DEAD-ENHANCE-SHIM | `enhanceGillMobileBarMarkup` ×2 в `floating-cluster-controller.js` — мёртвый shim |
| NF-STRANGLER-BAR-DRIFT | `articles/dzhon-gill-chast-1/index.html`: `data-gill-v16`×2 + `id="mobTocBtn"` (без `__label`) |
| NEW-HARDTEXTS-CSP-MISSING-HFCDN | `hard-texts/index.astro:109` connect-src без `*.aws.cdn.hf.co` |
| NEW-SAVE-QUOTE-TIMER-RACE | `highlights.js`: 1×`500` + 11×setTimeout — одноразовый 500ms-таймер |
| AR-IDX-03 | `search.js` fallback: `⌘K` хардкод |
| AR-IDX-04 | `HomePageChrome.astro:67,104` — «Избранное» без `h-nav-fav` |
| AR-IDX-06 | `.h-reading-progress` в 4 компонентах при `readingProgress.enabled:false` |
| AR-IDX-07 | `HomeHero.astro:64`, `HomeHeroSection.astro:64` — `<h1 tabindex="-1">` |
| AR-IDX-09 | `search.js`: `(e.metaKey||e.ctrlKey)&&k` без alt/shift guard |
| AR-IDX-A11Y-01 | `home.css:666-667,807` — focus-visible только для кнопок/ссылок nav, не для карточек |
| AR-IDX-JS-01 | `pagehide` в 5 файлах: reader-state, scroll-perf, site-utils, site, sw-register |
| AR-IDX-JS-02 | multi-writer: `gb:reader-preferences` + legacy `localStorage.setItem('theme')` (site.js:223) |
| AR-IDX-CSS-02 | `home.css`: `.home-v20{…overflow-x:hidden…}` |
| AR-IDX-CSS-03 | `home.css`: `.h-reveal:not(.h-in){animation:h-reveal-fallback 0s 3s forwards}` |
| AUDIT-JS-ESCAPER-DUP-X5 | `function tt(`×3 в site.js + `function F(`×1 в search.js + `function h(`×1 в highlights.js = 5 копий |
| AUDIT-CSS-GBFLOATER-DUP-MEDIA | `floating-cluster.css`: 83 @media; дубли условий (899px×7, 64em×8+5, hover×23) |
| GENEALOGY-ATLAS-V1-SHIPPED-NOT-PROD | `data/genealogy/v2/build/atlas-interactive.html` в main, но data/ ∈ NEVER_COPY_DIRS → не в dist |
| R-001 | `js/site.js` = 172 233 B |
| R-003 | `astro.config.mjs` — нет sourcemap-настройки |
| R-004 | нет `type="module"` в компонентах |
| S-T-01 | чекеры видят .astro (`gill-series-data-consistency-audit.js`), route-level паритет нет |
| Speakable (W8) | **109** файлов с `speakable` (ru неэлигибелен) |
| PC-CURRENT-02 | `premium-controls-rollout-audit.js:169-172,210-211` — substring-гейт `includes('gb-roman')` |

### ⚠️ Подтверждено, но ХУЖЕ записи (недооценено — 9)

| ID | В матрице | Факт на `4ce39dc8` | Действие |
|---|---|---|---|
| AR-IDX-05 | P3 «SITE_CONFIG.version хардкод» | `version:1778943682` **заморожен с 14.07**; cache-buster runtime-CSS: `enhancements-runtime.css?v=`+version, `highlights-runtime.css?v=`+version → будущие правки CSS не дойдут до юзеров | **поднять до P1/P2**, чинить в W2 |
| CI-WORKFLOW-PROLIFERATION | «~26» (log «42») | **49** файлов в `.github/workflows/` | обновить цифру |
| NEW-CSS-BUDGET-01 | «554 013 > 425 000» | site 314 302 + floating 236 873 + home 113 458 ≈ **664 КБ** > 425 000 (**+56%**) | обновить цифру |
| D-3 | «469 101 > 365 000» | js/*.js ≈ **590 077 B** > 365 000 (**+62%**) | обновить цифру |
| KARTY-DATA-P1-01 | «8 из 9 карт 0–5 анкоров» | **0 anchors и 0 leaders во всех 11 route.json** | обновить |
| GLYPH-P1-01 | «9 из 11 без иконок» | **0 glyphs во всех 11** (TOTAL 0) | обновить |
| BUG-PERF-001 | «339 add / 25 remove» | **366 add / 31 remove** | обновить |
| D-4 | — | magic z-index жив (см. 🔴) | не трогать до W9/PC |
| D-19 | «rimlyanam-7 половина закрыта» (07-11) | **обе половины открыты** (см. 🔴) | пересмотреть статус |

### 🟢 Кандидаты на закрытие/сужение (код уже лучше — 22)

| ID | Что изменилось | Evidence | Рекомендация |
|---|---|---|---|
| STRANGLER-HYGIENE | legacy-дублей в корне НЕТ | корень: только 404/google/index/yandex html (83 Astro-страницы) | **закрыть** (stale) |
| ENGINE-P1-27 | Escape разведён | `map-engine.js:3091-3098` `closePhoto('escape');return` | **закрыть** |
| MAP-P1-06 | guard стоит | `_renderArchaeologyProjection`: `allowedTabs:['arch','sci']` (:2532) | **закрыть** |
| AR-IDX-10 | CSP унифицирован | корневой index.html и HomePageHead/HermenevtikaPageHead содержат jsdelivr+hf.co | **закрыть** (проверить 15 legacy html) |
| QUAL-P1-09 | `currentStatus` исчез | route.json: `publication.status: temporary-placeholder/draft` согласованно | **закрыть** |
| BASE-P1-03 | чёрной заливки нет | `avraam/base.svg`: палитра светлая (`#e8d4a0,#4a80a0…`), 0 `#22241f` | **закрыть/сузить** (звёзды остались) |
| MAP-P1-13 | role/tabindex добавлены | `map-engine.js:2097-2098` `role='button'`+`tabindex='0'` | **сузить** до panel/reduced-motion |
| DATA-P1-04 | semantic zoom есть | `map-engine.js:394-396,1104` + CSS `[data-zoom-bucket]` | **сузить** до шрифтов 1.5/40px |
| AR-IDX-PERF-01 | LCP-img нет на home | HomePageChrome:301 только noscript-пиксель; hero текстовый | **сузить** до render-blocking CSS |
| AR-IDX-PERF-02 | @font-face = 4, не 30+ | `fonts/fonts.css` | **сузить/обновить** |
| NG-SEO-01 | ch4/5 pagefind-meta есть | `chast-4/index.astro:20`, `chast-5:20` | **сузить** до title/footer |
| NG-A11Y-01 | emoji в коде nagornaya не найдены | grep по astro — 0 | **сверить данные**/stale |
| MAP-P1-18 | рендер `ph.thumb||ph.src` | `map-engine.js:2428` | **сузить** («320px» не доказано) |
| QUAL-P1-01 | почти всё 44px | `.me-back/.me-story-chip/.me-tab/.me-zoom-btn/.me-share-btn` 44px; остался `.me-arch-more{min-height:32px}` | **сузить** до arch-more |
| RIVER-P1-02 | сужено | def есть в avraam, нет в `_engine/base-geo.svg` | сузить (см. 🔴) |
| S-SEC-01 | safeUrl в search.js закрывает схемы | `js/search.js` `safeUrl` (javascript/data/vbscript/blob→#) | сузить формулировку |
| AUDIT-CSS-DEAD-KEYFRAMES-TOKENS | все 43 keyframes используются | 0 dead (animation-ссылки есть) | **закрыть/сузить** (keyframes-часть) |
| GATE-MARKER-DATA-DRIFT | живой инстанс один | = NF-GATE-IZ5-STALE («Часть 1 из 5» ×3 скрипта) | **сузить** до инстанса |
| NEW-CANONICAL-IZBRANNOE-01-GAP | guard расширен | canonicalSanityGuard (audit-pro.js:1885+) + G31 noindex↔sitemap | сузить |
| PC-CURRENT-03 | assetUrl версионирует | `asset-version.js:8` `'css/floating-cluster.css':'d26d83c2'` | сузить до legacy-зеркал |
| AR-IDX-08 | Publications/Planned/Quote без inline | grep — 0; остались AmbientPhrases CSS-var + noscript | сузить |
| NEW-HIGHLIGHTS-NO-REINIT-GUARD | guard'а нет (suspected) | highlights.js — как в матрице | не менять без browser |

### 🟡B Browser-класс (нужен Playwright exact-HEAD — ~33)

MAP-P1-01, MAP-P1-02, MAP-P1-03, MAP-P1-04, MAP-P1-05, MAP-P1-07, MAP-P1-08, MAP-P1-09, MAP-P1-18(ост.), MAP-P1-19, AVRAAM-P1-01, AVRAAM-P1-02, AVRAAM-P1-03, AVRAAM-P1-05, ASTRO-P1-01, ASTRO-P1-05, ENGINE-P1-26, HUB-P2-01, ENGINE-P2-03(уточн.), NEW-72, AUDIT-P3-OG-LCP-MISMATCH, CI-WEBKIT-TOC-NONDETERMINISTIC, SEARCH-P2-11(ост.), SEARCH-P2-12(ост.), QUAL-P2-03(ост.), DRAW-P1-03(частично), BASE-P2-01, DATA-P2-01, MEDIA-P1-01(частично), MAP-P2-02(ост.), AVRAAM-P2-01, WAYP-P1-01(частично), MINI-P1-01(частично)

> Кодом частично зацеплены: ENGINE-P1-26 (click-обработчик на всех маркерах, :2133 — нужна проверка видимости точек вне сюжета), MAP-P1-09 (story-чипы есть, :1218 — нужен тайминг 600мс), MAP-P1-19 (rotate-оверлей в коде не найден — проверить, убран ли), HUB-P2-01 (QA-терминов в route.json не видно).

### 🟡O Owner/live/данные (~13)

| ID | Причина |
|---|---|
| REG-001 | hosting-заголовки: решение владельца (Pages не отдаёт CSP/XFO/Referrer-Policy) |
| GENESIS6-ACTIVATION-OWNER-GAP | права/источники (PR #348) |
| GENEALOGY-ATLAS (live) | подтвердить, что atlas не на проде, извне песочницы |
| SEARCH-P2-07 (ост.) | лицензии/права на корпус |
| TLP-аналоги (вне gb) | — |
| NG-A11Y-01 (данные) | emoji в data/генерируемом контенте |
| QUAL-P1-03 (данные) | где именно в data исправлять тире |
| GILL-контент-решения | владелец (Часть IV/эталон) |
| PremiumControls PC-CURRENT-04/05 | owner-freeze зона |
| D-19 финальное решение | канон title |
| Speakable (W8) | решение по ru-неэлигибельности |
| AVRAAM-P1-* (частично) | скриншоты/дизайн-решения |
| live production SHA | проверка извне песочницы |

### ✅ Закрытые строки — спот-чек подтверждён кодом (13)

D-21 (glossary.js 0 innerHTML) · SEARCH-P2-08 (verses.json удалён) · NG-DARK-01 (ровно 134 !important) · TTS-DL-NO-TABLOCK (SharedWorker :424-429) · NF-SPEEDSLOT (0 копий) · HUB-AUDIT-COUNT-DRIFT (inventory-derived) · AR-IDX-01 (hreflang) · SEARCH-P2-09 (SearchAction) · ReaderProjection (workflow+data-reader) · NEW-65 (baptisty parity скрипт) · CI-INDEXNOW-CHECKER-STALE (contents:read) · D-22 (href-guard+same-origin) · D-23 (warmVosk-фон)

---

## Итог по всей матрице

| Категория | Кол-во | Изменение матрицы |
|---|---|---|
| 🔴 Подтверждено | ~68 | остаются открытыми |
| ⚠️ Хуже записи | 9 | поднять severity / обновить цифры |
| 🟢 Кандидаты на закрытие | ~12 чистых закрытий + ~10 сужений | reverify-пакет → 145 → ~133 |
| 🟡B Browser-класс | ~33 | Playwright exact-HEAD (SD-7) |
| 🟡O Owner/live/данные | ~13 | решение/проверка владельца |
| ✅ Закрытые (спот-чек) | 13 | подтверждено, не переоткрывать |

## Ключевые цифры (для правки матрицы)

- Core CSS ≈ **664 КБ** vs `MAX_CSS_TOTAL=425_000` → +56% · JS ≈ **590 КБ** vs `MAX_JS_TOTAL=365_000` → +62%
- Workflows: **49** · `SITE_CONFIG.version` = **1778943682** (заморожен с 14.07)
- anchors/leaders/glyphs: **0/0/0 во всех 11 route.json**
- add/removeEventListener: **366/31** · @media в floating-cluster: **83**
- Speakable-разметка: **109 файлов**

## Приоритеты

1. **P0 — AR-IDX-05**: починить кэш-баст (один PR: поднять version или детерминированный build-id).
2. **P1 — reverify-пакет** по 🟢 (12 закрытий без правок продукта) — формат `reverify/CURRENT_HEAD_REVERIFY_2026-08-05_4ce39dc8_*.md`.
3. **P2 — Karty browser-reverify** (SD-7): ~33 строки на exact-HEAD.
4. **P3 — обновить цифры матрицы**, D-19 пересмотреть, live-проверки извне.

*Документ — untracked в AuditRepo; коммиты/пуши не выполнялись.*
