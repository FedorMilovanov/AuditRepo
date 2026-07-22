# Fixed rows demoted from open sections — 2026-07-23

These rows were removed from the canonical open lists because their own status cell began with an explicit `✅` marker.

The full historical wording is preserved below. No evidence was deleted.

## DEP-BLOCK-EDITORIAL-REGISTRY
- Original line: 163
- Original section: 🔴 P0/P1 — release / deploy + karty runtime (статус 2026-07-21)

| DEP-BLOCK-EDITORIAL-REGISTRY | ✅ **FIXED 2026-07-14 @ dns-configuration-setup** (912ffe3 (реестр перегенерирован официальным инструментом, 25/25)). Было: `editorial-metadata-registry.js --check` exit 1: eligible 25 / records 20. Missing: `dzhon-gill-chast-4-ekzeget`, `chto-bibliya-nazyvaet-serdcem`, `novoe-serdce`, `serdce-i-duh`, `serdce-spravochnik`. Registry `sourceCommit` still `e6793627`. **Ломает IndexNow readiness** (`Validate registry structure`). | verified-source reverify 07-14 |

## DEP-BLOCK-MAPS-VALIDATE
- Original line: 164
- Original section: 🔴 P0/P1 — release / deploy + karty runtime (статус 2026-07-21)

| DEP-BLOCK-MAPS-VALIDATE | ✅ **FIXED 2026-07-14 @ dns-configuration-setup** (поздний коммит ветки (sheet-формат nachalo скоуплен §13-бис, ctx/region узаконены, stats выправлены) — maps:validate ✅). Было: `maps:validate` exit 1, 25 issues: (1) hub «на аудите»=9 но missing cards=10 после `nachalo`; (2) `nachalo/route.json` schema incomplete; (3) avraam meta.stats places 19≠22 + stage-less babylon/mari/paran; shoftim stats. В цепочке `validate:static-publication`. | verified-source |

## DEP-BLOCK-CSS-IMPORTANT-CEILING
- Original line: 165
- Original section: 🔴 P0/P1 — release / deploy + karty runtime (статус 2026-07-21)

| DEP-BLOCK-CSS-IMPORTANT-CEILING | ✅ **FIXED 2026-07-14 @ dns-configuration-setup** (912ffe3 (210→183 архитектурно: reduced-motion блоки в конец каскада, a11y сохранена; потолки унифицированы 200)). Было: `css:layer:validate` exit 1: site.css `!important` **210 > ceiling 202**. Instance of D-2 now **deploy-blocking**. Layered still ~21%. | verified-source |

## DEP-BLOCK-AVRAAM-AUDIT
- Original line: 166
- Original section: 🔴 P0/P1 — release / deploy + karty runtime (статус 2026-07-21)

| DEP-BLOCK-AVRAAM-AUDIT | ✅ **FIXED 2026-07-14 @ dns-configuration-setup** (поздний коммит ветки (ctx/region вне сверки, set-сравнение) — 27/27). Было: `avraam:audit` 25/27 fail: route places 22 vs HTML set 19 (extra babylon/mari/paran-region). In static publication chain. | verified-source |

## S-DATA-01
- Original line: 182
- Original section: 🟠 P1 — ОТКРЫТО

| S-DATA-01 | ✅ **FIXED 2026-07-14 @ dns-configuration-setup**: data/series.json hard-texts 2→6 частей (синхронизирован с heartSeriesData движка); чекер серий audit-pro видит Astro/MDX-маршруты. Было: slugs series.json ≠ src/pages. | Auditor 2026-07-14 + fix-verify (audit-pro 0) |

## AUDIT-CSS-SITECSS-STRUCT-CORRUPTION
- Original line: 271
- Original section: 🟠 P1 — ОТКРЫТО

| AUDIT-CSS-SITECSS-STRUCT-CORRUPTION | ✅ **FIXED 2026-07-14 @ dns-configuration-setup** (912ffe3 — все 5 правил восстановлены; css-tree/postcss: 0 ошибок; AST-гейт добавлен в engine:contracts). Было: **Структурная порча `css/site.css` (deep CSS-аудит 07-14, невидима гейтам).** Два независимых парсера (`postcss@8.5.16` + `css-tree`) падают: postcss «40:16304 Unknown word .bottom-bar,.btoc-link,.flip-card-inner,.h-article-card,.quiz-option», css-tree — 9 ошибок (offsets 179799/180014/201874/201914/203062/277864+3). Кластер сломанных правил (браузер выкидывает по error-recovery): (1) `@media (prefers-reduced-motion:reduce){.bottom-bar,.btoc-link,.flip-card-inner,.h-article-card,.quiz-option}` — **список селекторов БЕЗ блока объявлений** → у reduce-motion-пользователей НЕ отключается анимация этих 5 классов (a11y); (2) `.ehrman-block,.info-box,.quote-box}` — висячий список без `{}`; (3) `…,.resume-reading-title,@supports(…)` — список разорван `@supports` (хвостовая запятая); (4) `@media (hover…){html.dark }` — пустое правило; (5) `.gbx-backlinks__maplink:rgba(122,46,46,0.08);` — битое объявление (нет свойства). **Гейты слепы:** `audit-pro` проверяет только баланс скобок (проходит — скобки сбалансированы), `validate.js` не парсит CSS структурно, `css-layer-validator` смотрит лишь счётчик `!important`. Тот же класс, что историческая CSS-PARSE-CORRUPTION-SITECSS (PR#42) — блайндспот так и не закрыт гейтом. Pre-existing (есть и в `b8459bdf`; site.css контент +0/−0 в дельте). Fix: восстановить 5 правил + добавить структурный CSS-парс в гейт (см. AUDIT-CSS-NO-STRUCTURAL-PARSE). | verified-source ×2 парсера (postcss+css-tree); reverify 07-14 §CSS |

## REG-VALIDATE-GENEALOGY-TEMPLATE
- Original line: 272
- Original section: 🟠 P1 — ОТКРЫТО

| REG-VALIDATE-GENEALOGY-TEMPLATE | ✅ **FIXED 2026-07-14 @ dns-configuration-setup** (scripts/ выведен из walkers validate.js и audit-pro (build-шаблоны ≠ страницы)). Было: **DEPLOY-БЛОКЕР @ `2ca2af3b`.** `validate.js --strict` (в цепочке `validate:static-publication` → шаг «Static publication gates» деплоя) падает EXIT 1 на 2 файлах: `scripts/genealogy-build/atlas-template.html` и `interactive-template.html` — «inline `<script>` syntax error: Unexpected token ';'». Это **build-time шаблоны** с плейсхолдерами (`const ATLAS=/*__ATLAS__*/;`, подставляются `build-atlas.mjs:156` → `.replace('/*__ATLAS__*/', JSON.stringify(scene))`); как сырьё это невалидный JS, но они **никогда не отдаются** — только вход сборки. Корень: `validate.js walkHtmlFiles()` (:467) идёт от ROOT со skip-set, где **нет `scripts/`** → линтит входы сборки как страницы. Та же дрейф-проблема бьёт `audit-pro.js` (lang/canonical/charset/inline-script на тех же 2 файлах; его skipDirs игнорит `audit/`, но не `scripts/`). Кандидат-фикс (release-транзакция, owner-gated): добавить `scripts/` в skip-set walker'ов ИЛИ пропускать `<script>` с плейсхолдерами `/*__…__*/` ИЛИ переименовать шаблоны в игнорируемый паттерн. | verified-source + verified-build (Node v22.22.3 локально) + verified-ci (run `29338523013`); `reverify/CURRENT_HEAD_REVERIFY_2026-07-14_2ca2af3b.md` |

## REG-EDITORIAL-METADATA-MISSING
- Original line: 273
- Original section: 🟠 P1 — ОТКРЫТО

| REG-EDITORIAL-METADATA-MISSING | ✅ **FIXED 2026-07-14 @ dns-configuration-setup** (см. DEP-BLOCK-EDITORIAL-REGISTRY). Было: **DEPLOY-БЛОКЕР @ `2ca2af3b`.** `editorial-metadata-registry.js --check` (шаг «Validate registry structure» в *Metadata & IndexNow Readiness*; деплой контент-пушей идёт `workflow_run` по её `conclusion==success` → красный гейт блокирует деплой) даёт 5 ошибок (Eligible 25 / Records 20): нет записей у `/articles/dzhon-gill-chast-4-ekzeget/`, `/articles/chto-bibliya-nazyvaet-serdcem/`, `/articles/novoe-serdce/`, `/articles/serdce-i-duh/`, `/articles/serdce-spravochnik/`. Новый контент (Gill Часть IV + серия «Сердце», 07-13/14) залит без записей реестра. Fix: добавить 5 editorial-metadata записей (даты/автор). | verified-source + verified-build + verified-ci (run `29338522715`) |

## S-DATA-01
- Original line: 294
- Original section: 🟡 P2 — ОТКРЫТО

| S-DATA-01 | ✅ **FIXED 2026-07-14 @ dns-configuration-setup**: data/series.json hard-texts 2→6 частей (синхронизирован с heartSeriesData движка); чекер серий audit-pro видит Astro/MDX-маршруты. Было: slugs series.json ≠ src/pages. | Auditor 2026-07-14 + fix-verify (audit-pro 0) |

## AUDIT-CSS-NO-STRUCTURAL-PARSE
- Original line: 351
- Original section: 🟢 P3 — ОТКРЫТО

| AUDIT-CSS-NO-STRUCTURAL-PARSE | ✅ **RESOLVED (reverify 2026-07-14 @ `21624a3`).** Реализовано ровно как рекомендовано: `scripts/check-engine-contracts.js:135-140` гоняет `css-tree.parse({onParseError})` по 6 CSS-файлам как live-гейт (`npm run engine:contracts` — все ✅). Класс порчи теперь закрыт гейтом. Было: **Гейт-блайндспот (deep CSS-аудит 07-14).** Ни один CSS-гейт не парсит структуру: `audit-pro.js` проверяет только баланс `{}`, `validate.js` — 0 структурных CSS-проверок, `css-layer-validator.js` — только счётчик `!important`. Поэтому AUDIT-CSS-SITECSS-STRUCT-CORRUPTION (P1) прошёл незамеченным (как и историческая PR#42). Fix: добавить `postcss`/`css-tree` `parse()` с `onParseError`→fatal в `audit-pro` (обе либы уже в node_modules). Дешёвая проверка, закрывает целый класс. | verified-tooling; reverify 07-14 §CSS |

## AUDIT-CSS-FLOATCLUSTER-COMMENT-CORRUPTION
- Original line: 355
- Original section: 🟢 P3 — ОТКРЫТО

| AUDIT-CSS-FLOATCLUSTER-COMMENT-CORRUPTION | ✅ **FIXED-CURRENT (reverify 2026-07-14 @ `21624a3`).** floating-cluster.css перезалит (+406/−39); `/* ===` баннер-опенер восстановлен, css-tree: 0 битых селекторов, `.mobile-bottom-bar` парсится корректно; `engine:contracts` CSS-AST-гейт зелёный. Было: **2-й CSS-файл со структурной порчей (deep-аудит pass 4, 07-14).** `css/floating-cluster.css`: комментарии **несбалансированы 237 `/*` vs 236 `*/`**. Стр.1405 `/* ===` открывает, стр.1407 `/* ---` открывает второй (комментарии CSS не вложены) → первый закрывается на стр.1409 `*/`, поэтому правила `.gbs-rail-foot` (1410-1423) рендерятся, НО стр.1424-1426 («v15: MOBILE PREVIEW…» + `===== */`) — **голый текст** со stray `*/` без пары. Браузер (error-recovery) делает из него битый селектор, который **поглощает следующее правило** `[data-gill-v16] .mobile-bottom-bar{…}` (стр.1429) — css-tree подтверждает: 19 объявлений уходят в селектор «v15: MOBILE PREVIEW…». **Импакт (измерен, без переоценки):** из 19 потерянных свойств большинство (position/background/border-radius/box-shadow/backdrop-filter/padding) **переопределяются** более поздними правилами `.mobile-bottom-bar` (2786 @media и др.); реально теряются лишь `justify-content`/`font-family`/`font-size` → мелкий дрейф отступов/шрифта мобильного бара. Латентный риск: будущие правки блока 1429 молча не применятся. Pre-existing (b8459bdf тоже 198/197). Копируется в dist as-is. Гейт слеп (audit-pro только баланс скобок). Fix: восстановить `/*` на стр.1424 (обернуть баннер) + структурный CSS-парс (AUDIT-CSS-NO-STRUCTURAL-PARSE). | verified-source (css-tree recovery + comment-balance count); reverify 07-14 §CSS pass 4 |
