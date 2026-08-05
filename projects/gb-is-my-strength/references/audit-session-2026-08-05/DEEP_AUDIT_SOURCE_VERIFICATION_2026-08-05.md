# Глубокая source-верификация открытого бэклога gb-is-my-strength

**Дата:** 2026-08-05 · **Проверено на:** `main@4ce39dc816727c43373491acfb5bad0916cde113` (PR #1036, hermenevtika footnote fix)
**Метод:** свежий shallow-clone source-репо (208 МБ), точечные grep/JSON-проверки каждой строки открытой матрицы + спот-чек закрытых строк. Никаких предположений «по документу» — только код текущего main.

---

## 1. ✅ Открытые строки — ПОДТВЕРЖДЕНЫ на текущем main (28)

| ID | Что проверено | Evidence на `4ce39dc8` | Вердикт |
|---|---|---|---|
| **MAP-P1-20** | `map-engine.js` без `?v=` | `karty/avraam/index.html:1177`, `karty/ishod/index.html:51`: `<script src="../_engine/map-engine.js"></script>` — без версии → cacheFirst stale-риск | 🔴 подтверждён |
| **AR-IDX-05** ⚠️ | Хардкод версии | `version: 1778943682` в **≥4** PageHead: AboutPageChrome:159, KodDaVinchiPageHead:311, KrajnePageHead:279, ArticlesPageChrome:202 | 🔴 **усилился**: значение то же, что 07-14 — кэш-баст не двигается неделями |
| **AR-IDX-06** | `.h-reading-progress` рендерится всегда | `ArticlesPageChrome.astro:238`, `HardTextsPageChrome.astro:33`, `NagornayaSeriyaBody.astro:12`, `NagornayaSeriyaPageChrome.astro:9`; фича `readingProgress.enabled:false` | 🔴 подтверждён |
| **AR-IDX-07** | h1 tabindex | `HomeHero.astro:64`, `HomeHeroSection.astro:64`: `<h1 class="h-hero-title" tabindex="-1">` | 🔴 подтверждён |
| **AR-IDX-04** | `h-nav-fav` потерян | `HomePageChrome.astro:67,104`: `<a href="/izbrannoe/">Избранное</a>` — класса нет | 🔴 подтверждён |
| **AR-IDX-03** | ⌘K хардкод | `js/search.js`: `aria-label="Поиск (⌘K)"`, `title="Поиск ⌘K"`, `<span class="kb">⌘K</span>` в fallback-инъекции | 🔴 подтверждён |
| **AR-IDX-09** | нет alt/shift guard | `js/search.js`: `(e.metaKey||e.ctrlKey)&&String(e.key).toLowerCase()==="k"` — `shiftKey/altKey` не исключены → Ctrl+Shift+K тоже сработает | 🔴 подтверждён |
| **AR-IDX-10** | CSP legacy vs Astro | `HomePageHead.astro` CSP содержит `jsdelivr.net` (frame-src, img-src); в корневом `index.html` — нет | 🔴 подтверждён |
| **AR-IDX-CSS-02** | `.home-v20{overflow-x:hidden}` клиппит | `css/home.css`: `.home-v20{...overflow-x:hidden...}` на месте | 🔴 подтверждён |
| **AR-IDX-CSS-03** | 3s fallback reveal | `css/home.css`: `.h-reveal:not(.h-in){animation:h-reveal-fallback 0s 3s forwards}` | 🔴 подтверждён |
| **D-1** | race deploy↔indexnow | `deploy.yml:22-24` `group: pages` vs `indexnow.yml:18-20` `group: metadata-indexnow-diagnostics-${{ github.ref }}` — группы по-прежнему разные | 🔴 подтверждён |
| **CI-WORKFLOW-PROLIFERATION** ⚠️ | число воркфлоу | `.github/workflows/` = **49 файлов** (матрица говорит «~26», session log 08-04 «42» → уже 49) | 🔴 **усилился**, строка матрицы устарела |
| **S-SEC-01** | blacklist-санитайзер | `js/enhancements.js` FAQPath: вырезает `script,style,iframe,object,embed,link,meta,base,form,input,button,svg,math` + on*-атрибуты + `javascript:` — strip-подход, не allowlist | 🔴 подтверждён |
| **SEARCH-P1-01** | палитры нет на karty | `src/pages/karty/avraam/index.astro`, `ishod/index.astro` — 0 маркеров command-palette/GBSearch | 🔴 подтверждён |
| **MAP-P1-11** | scale bar `cfg.W0/view.w` | `karty/_engine/map-engine.js:1447`: `const screenPxPerKm=(cfg.W0/view.w)*pxPerKm` | 🔴 подтверждён |
| **TEXT-P1-01** | ширина плашки `len*0.6` | `map-engine.js:2179`: `const textWidth=labelText.length*fontSize*0.6` | 🔴 подтверждён |
| **REG-P1-01** | `regions` игнорируются | `map-engine.js`: 0 вхождений `regions` | 🔴 подтверждён |
| **RIVER-P1-02** | `waterRipple` без def | `karty/_engine/base-geo.svg`: 5 использований, **def отсутствует**; но `karty/avraam/base.svg:39` — def **есть** | 🟡 сужен: остаток = общий `_engine/base-geo.svg` |
| **QUAL-P1-03** | ASCII-дефисы в цитатах | `karty/` data: `2:1-7`, `25:11-12`, `17:1-9`, `9:1-2`, `5:1-20` и др. (десятки) | 🔴 подтверждён |
| **QUAL-P1-05** | слушатели без passive | `map-engine.js`: 5 прямых `addEventListener(wheel/touchstart/touchmove/mousemove)` (проект-уровень — больше) | 🔴 подтверждён (engine) |
| **QUAL-P1-06** | таймеры без cleanup | `map-engine.js`: 24 `setTimeout/requestAnimationFrame` | 🔴 подтверждён |
| **QUAL-P1-08** | OG-заглушка | `og-karty-1200x630.webp` в **18 html** (9 карт: early-church, ishod, maccabim, melachim, pavel, revelation, shoftim, shvatim, yeshua) | 🔴 подтверждён |
| **D-4** | magic z-index | `css/floating-cluster.css`: `z-index:2102 !important` (:2928), `9999 !important` (:3003), `2147483000` (:3281,3326,4424), `2147483100` (:3546) | 🔴 подтверждён |
| **D-19** | title ≠ og:title | `AntisovetovPageHead.astro:16` `<title>…| Господь Бог</title>` vs `:26` `og:title` без суффикса | 🔴 подтверждён |
| **SEARCH-P2-07** | разрежённый корпус | `data/bible/`: `synodal` 24 файла + `kassian` 21 = 45 записей при 66-книжном реестре | 🔴 подтверждён |
| **S-T-01** | чекеры видят .astro | `scripts/gill-series-data-consistency-audit.js` содержит `.astro`-обработку; route-level паритет — нет | 🟡 partial (как в матрице) |
| **ATLAS-D-NAMESPACE-COLLISION** | ID-коллизия | `working/atlas/DEBT-REGISTER.md`: D-16..D-19 = визуальные баги Авраама (Эцион-Гевер, микроподписи, Урмия, Мамре), а в матрице D-16..D-19 = SW/dates | 🔴 подтверждён |
| **GENESIS6-ACTIVATION-OWNER-GAP** | нет роута | `src/pages/genesis6/` не существует; в `search-manifest.json` только image-записи | 🔴 подтверждён |
| **AR-IDX-08** | inline style | inline-стили остались (`HomeAmbientPhrases.astro:57` CSS-var, noscript-пиксель и т.п.) | 🟡 частично |

## 2. 🟡 Строки, где реальность ЛУЧШЕ заявленного (кандидаты на закрытие/сужение)

| ID | Что проверено | Evidence | Вывод |
|---|---|---|---|
| **QUAL-P1-09** | 8 holding-профилей «currentStatus: production-dist» | В `karty/*/route.json` поля `currentStatus` **нет вообще**; publication-профили согласованно: `temporary-placeholder` + `indexable:false` (8 карт), `draft` (nachalo); avraam/ishod — пустые | 🟢 **похоже, закрыт** — вокабуляр статусов мигрировал и стал непротиворечивым; нужен формальный reverify и перевод строки |
| **RIVER-P1-02** | «в `<defs>` отсутствует id=waterRipple» | В `avraam/base.svg:39` def **присутствует**; отсутствует только в общем `_engine/base-geo.svg` | 🟡 сузить строку до `_engine/base-geo.svg` |
| **S-SEC-01** | «blacklist XSS-риск» | Санитайзер реально вырезает script/style/iframe/on*/javascript: — но не `data:`/`vbscript:`/`blob:` в href/src (в `search.js` эти схемы уже закрыты функцией `safeUrl`) | 🟡 риски сохраняются, но частично закрыты в search.js — стоит сузить формулировку |

## 3. ✅ Закрытые строки — ПОДТВЕРЖДЕНЫ (спот-чек 9/9)

| ID | Проверка | Evidence |
|---|---|---|
| D-21 | glossary.js 0 innerHTML | `js/glossary.js`: `innerHTML` = **0** |
| SEARCH-P2-08 | legacy verses.json удалён | `data/verses.json` — **отсутствует** |
| NG-DARK-01 | governed `!important` | nagornaya css суммарно **ровно 134** `!important` — совпадает с матрицей |
| TTS-DL-NO-TABLOCK | SharedWorker-first | `js/vosk-tts-engine.js:424-429` — SharedWorker, fallback dedicated |
| NF-SPEEDSLOT | 4-я копия speed-slot убрана | `GillSeriesRail.astro` — 0 вхождений `initGillRailSpeedSlot/speedSlot` |
| HUB-AUDIT-COUNT-DRIFT | счётчики производные | `scripts/validate-map-routes.js:10,224,244` — `getKartyHubInventory` + `sameStringSet(auditSlugs)` |
| AR-IDX-01 | hreflang на home | `HomePageHead.astro:26` — `hreflang="ru"` + `x-default` |
| SEARCH-P2-09 | SearchAction `/?q=` | `src/pages/index.astro:35-36` — `__gbSearchActionQueryBound` |
| ReaderProjection | source-closed | `.github/workflows/reader-projection.yml` есть; `data-reader-root` маркеры в ReaderSettings.astro |

## 4. Новые/усиленные наблюдения (нет в матрице)

1. **AR-IDX-05 — застарелый кэш-баст (критично).** `version: 1778943682` идентичен значению от 14.07 (3+ недели). Любые asset-URL, завязанные на `SITE_CONFIG.version` (например `enhancements-runtime.css?v=...` в `enhancements.js`), не инвалидируются → пользователи получают устаревшие стили/скрипты. Строка в матрице P3 — недооценена (риск P2).
2. **CI-WORKFLOW-PROLIFERATION: 49 воркфлоу** против «~26» в строке матрицы и «42» в session log 08-04. Строку надо обновить (и это прямое подтверждение, что контрольный слой не конвергировал — A14/W1).
3. **49 воркфлоу × тяжёлые setup/build** → растёт время/стоимость CI и поверхность дрейфа (TLP-параллель: W4 у TLP именно про это).
4. **RIVER-P1-02/avraam**: `avraam/base.svg` уже с def — значит, либо фикс частично прилетел, либо avraam всегда был отдельным; строку следует сузить.

## 5. Вывод

- **Открытый бэклог в основном реален:** 28/30 проверенных открытых строк воспроизводятся на текущем main дословно. «Закрыто не всё» — подтверждено кодом, а не только документами.
- **Реальность хуже в 2 местах** (застойный `SITE_CONFIG.version`; 49 воркфлоу) и **лучше в 3** (QUAL-P1-09 похоже закрыт, RIVER-P1-02 сужен, S-SEC-01 частично закрыт safeUrl в search.js).
- **Самый «горячий» быстрый фикс:** поднять `SITE_CONFIG.version` или перевести на детерминированную генерацию (W2) — это разблокирует кэш-баст, сейчас молча сломан.
- Следующий шаг по процессу: завести эти 28 подтверждённых как exact-HEAD evidence в `reverify/` и провести reverify для QUAL-P1-09 (кандидат → закрытие).

*Документ — untracked в рабочем дереве AuditRepo; коммиты/пуши не выполнялись. Source-клон в /tmp (вне снапшота) — при необходимости пере-клонируется за ~5 сек.*
