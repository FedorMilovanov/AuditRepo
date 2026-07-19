# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT по багам проекта gospod-bog.ru** (открыто/закрыто/severity/счётчики). Волатильные
> факты живут только здесь и в [`../NEXT_AGENT_PROMPT.md`](../NEXT_AGENT_PROMPT.md); карта
> всех документов и правило Single-Writer-Per-Fact — [`../DOC_MAP.md`](../DOC_MAP.md).
> Мастхед — это **статус, не changelog**: per-session заметки идут в `## Session log` внизу.

## Статус

| Поле | Значение |
|---|---|
| Source HEAD | `2ca2af3b` (main; merge «Библейский атлас — карта Авраама» + genealogy atlas v1 + heart/mobile-chrome delta; **+287 commits** since `b8459bdf`) |
| Deploy | 🟡 **FIX-READY (2026-07-14 вечер)** — ВСЕ известные блокеры Static publication gates исправлены и верифицированы локально на ветке `claude/dns-configuration-setup-c0w26g` source-репо (слита с main 2ca2af3b): audit-pro 0 ошибок · css:layer 183≤200 · editorial 25/25 · maps:validate ✅ · avraam:audit 27/27 ✅ · validate:strict ✅ · engine:guard 87/87. Прод останется STALE (последний GREEN `007b67def5` @07-11) до мержа ветки в main и зелёного CI-прогона. |
| Системный бэклог | `SUPER_AUDIT_2026-07-06_14a49be8.md` — волны W1–W10, **вне счётчиков матрицы**; W1 now empirically blocking |
| Консолидация | 2026-07-05 (из монолита → `archive/2026-07-04-stale-matrix/MASTER_BUG_MATRIX_FULL_2026-07-03.md`) |
| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-19_karty_deep_audit.md` |

_История сессий (HEAD-переходы, что влито) — в разделе `## Session log` внизу файла, append-only._

---

## ✅ ЗАКРЫТО (95)

| ID | Описание | Коммит |
|---|---|---|
| CI-INDEXNOW-CHECKER-STALE | ✅ **fixed-current (reverify 2026-07-14 @ `2ca2af3b`).** `check-workflows.js:157` теперь требует у `indexnow.yml` `contents: read` (least-privilege), а indexnow-submission/baptisty-coverage требования перенесены на `deploy.yml` (`build-indexnow-urls.js --base`, :158). `node scripts/check-workflows.js` → ✅ passed. Починено PR#70. | `3a43cada` PR#70 |
| GILL-PART4-EXEGETE | 🆕 Новая **Часть IV «Экзегет»** серии Гилла (`/articles/dzhon-gill-chast-4-ekzeget/`): герменевтический метод + разбор 7 «универсалистских» текстов против Уитби, triple-render (Astro+MDX+legacy), реальная hero-картинка владельца. Логический реордер отображения III↔IV (Экзегет=III, Наследие=IV) — slugs/routes/ids сохранены (живой URL `/chast-3-nasledie/`). Премиум-рейл: сворачиваемый узкий/широкий + demand-scroll под серии 10+ частей. Барьер зелёный (169 passed). | `eca5dcc9` PR#67 |
| GILL-PART4-STRAGGLER-LABEL | 🆕 2 устаревших «Богословие» в SUBMENU-карточках Части IV после переименования в «Экзегет» (MDX-твин стр.33 + legacy HTML стр.269). Найдено adversarial self-audit собственной работы **до** мерджа. | `96549bb3` PR#67 |
| GILL-RAIL-CSS-SCOPE-LEAK-DEPLOY | 🆕 Мердж PR#67 уронил прод-деплой: новый rail-CSS сработал ложным срабатыванием scope-leak гейта (`premium-controls-rollout-audit.js` требует, чтобы `[data-gill-v16]` шёл первым в каждом арме; не распознаёт `.gbs2-world[data-gill-v16]`). Fix: переставить компаунд-селекторы (`[data-gill-v16].gbs2-world`) — семантика CSS идентична. `audit:premium-controls` 98/98. | `1491fbb2` PR#68 |
| KARTY-Q-BUG-P0 | 🆕 **Запись задним числом** (был фикс, не было строки в матрице → дрейф): `ReferenceError: q is not defined`, `karty/_engine/map-engine.js` — `q` использовалась вне scope её `setTimeout` при показе счётчика совпадений; крешила поиск на проде `/karty/ishod/` и любом map-engine-маршруте. Найдено Playwright-ground-truth (статический karty-audit ошибочно писал «нет q-бага»). Проверено 2026-07-09: `q` теперь в scope на строке 866, комментарий документирует фикс. | `f7e9696` → merge `763271b3` |
| AUDIT-P2-MATRIX-DRIFT | **ЗАКРЫТ стеком `native-source-contract-v1` (r323, deploy green `fc4b6326`).** `route-migration-matrix.json` больше не расходится с ownership/sitemap — он **производный**: материализуется из `page-ownership.json` + `route-profiles/*` движком `effective-route-registry.js`, cross-validation через registry-driven чекеры (`route-profile-contract-audit`/`route-migration-matrix-contract-audit`/`content-source-provenance-audit`, `migration:metadata:check:strict`). ⚠️ При интеграции лейны сами уронили секцию `/karty/*` (david/isus вместо 11 реальных, 8 переименованных потеряны) — поймано новым контрактом, исправлено регенерацией (`sync-route-migration-matrix --write`). | `e679362` gb-main |
| TTS-OUTCOME-TELEMETRY | success/selected-engine телеметрия добавлена: `reportTtsOutcome()` шлёт `tts_engine_selected {engine}` при старте воспроизведения — теперь видно долю Vosk vs Web Speech (её отсутствие и прятало CSP-инцидент). Fire-and-forget, не влияет на playback | `a459ff3` |
| D-22 | Favorites/izbrannoe: `f.path`→href без проверки схемы (само-XSS) + protocol-relative `//host` в image — **уже исправлено другим агентом** (`/^\/(?!\/)/` + protocol-allowlist на оба рендерера); стро́ка висела в P2 open по инерции, снята при quick-fix reverify 2026-07-08 | `365de50` |
| P0-CRASH-001 | `r is not defined` (highlights.js) | `bced1c69` |
| P0-CRASH-002 | `tt is not defined` (site.js) | `ffc763bc` |
| P0-FC-REC | Бесконечная рекурсия FC controller | `ca6a25a8` |
| P1-NAGORNAYA | `SiteUtils is not defined` (script order) | `ffc763bc` |
| P1-CI-DUPE | Дублирование cache-bust в deploy | `6e667978` |
| P1-SITE-XSS | XSS санитизация innerHTML | `47a98da` |
| P1-LAYERED-CSS | 283KB мёртвый CSS удалён | `47a98da` |
| P1-DEPLOY-FAIL | deploy блокировка при indexnow | `29b49df` |
| P2-NAGORNAYA-SITEUTILS | `SiteUtils` без `window.` prefix | `19062297` |
| P2-SEARCH-EAGER | search.js eager load → lazy loader | `546f7016` |
| BUG-001 | Memory leak — addEventListener | `36003b91` |
| BUG-041 | sitemap — 8 missing routes | `36003b91` |
| BUG-CI-001 | deploy.yml двойной `run:` ключ (2 witnesses) | `6e68d7ca` |
| PC-CURRENT-06 | Gill mobile item → partTOC flow | V3 |
| UI-GILL-DESKTOP-RAIL-01 | Desktop rail 240→304px + submenu scrollspy | `79eab398` |
| UI-GILL-DESKTOP-TOC-02 | TOC hierarchy + scrollspy rewrite | `79eab398` |
| NEW-45 | Prefetch hints for navigation | `6e667978` |
| NEW-46 | llms.txt — 19 missing routes | `f284fc60` |
| NEW-48 | Stored XSS в Favorites.astro | `f284fc60` |
| NEW-59 | hard-texts OG dimensions (genuinely fixed) | `6cc68586` |
| NEW-64 | Runtime smoke in deploy | `8d0c12e0` |
| NEW-65 | Baptisty visual parity | `914c7fb1` |
| NEW-66 | SW/Pagefind deploy-switch | `d5c65647` |
| NEW-68/69 | CSP form-action regression | `14574a9a` |
| NEW-70 | sitemap stale lastmod | `a434b45e` |
| NEW-71 | README version drift | `da4a65cd` |
| NEW-README-ANCHOR-01 | README.md TOC stale anchor | `c82a8d4b` |
| NEW-CANONICAL-IZBRANNOE-01 | `/izbrannoe/` canonical relative→absolute | `563e85f3` |
| NEW-IMG-REGRESSION-01 | orphan-image cleanup broken refs | `fc5f94bd` |
| SEC-001-VERIFIER | innerHTML XSS — 3/6 полей без tt() | `3d242b1c` |
| NEW-SAFEURL-XSS-HARDENING | safeUrl() blocked only javascript: | `3d242b1c` |
| NEW-CACHE-BUST-ASTRO | Runtime CSS ?v= empty на 53 Astro-страницах | `6499d42e` |
| NEW-GITCONFIG-COMMITTED | .gitconfig agent identity в корне репо | `6499d42e` |
| BUG-CI-002 | `:light` gate aligned with `:full` — 3 missing checks added | `85a2fd65` |
| AUDIT-P1-CI-GATE-GAP | → merged into BUG-CI-002 (same root cause: indexnow.yml :light gate) | `85a2fd65` |
| BUG-CI-003 | indexnow.yml push retry: exit 1 + ::error:: после 3 fail | `85a2fd65` |
| NEW-ACTIONLINT-CI-GAP | actionlint v1.7.7 wired into shared-files-guard.yml | `85a2fd65` |
| NEW-OG-DIMENSIONS-HARDCODED | Seo.astro og:image:width/height → props с defaults 1200/630 | `85a2fd65` |
| BUG-CLEANUP-001 | 4 dead scripts (~23KB) удалены | `85a2fd65` |
| BUG-SEO-002 | robots.txt: `Allow: /llms.txt` во всех 14 заблокированных AI-ботах | `85a2fd65` |
| NEW-STALE-BRANCHES | 5 merged lane branches удалены с remote | `85a2fd65` |
| CONTENT-PARITY-LOSS-01 | Потеря контента на 2 прод-маршрутах («О серии» 81 слово, «Три истока» 88 слов) — восстановлено, на проде | `d2f34a66` PR#33 |
| AUDIT-P1-FC-IMP | !important ratchet-потолки для floating-cluster(524)/mobile-hotfix(142)/nagornaya-toc(135) в audit-pro | `8d1e8891` PR#35 |
| AUDIT-PRO-FC-IMPORTANT-GAP | = закрыт тем же multi-file ratchet | `8d1e8891` PR#35 |
| BUG-SW-BASELINE-DRIFT | baseline v182→v187 + fatal-равенство currentExpectedCacheVersion под --require-cache-bump | `8d1e8891` PR#35 |
| IMAGE-CROSSREF-GAP | imageCrossRef guard (data/*.json+sitemap ↔ диск); поймал и починил 3 битые ссылки в links-graph.json | `8d1e8891` PR#35 |
| DATA-SERIES-DRIFT | series.json ↔ SERIES_ORDER sync-чек (док. исключения nagornaya/pastor-series) | `8d1e8891` PR#35 |
| UI-GILL-SUBMENU-LABEL-SEMANTICS-09 | Owner decision: подпись = текущему заголовку. Скан: 19/56 дрейфов; 17 relabels + label↔heading энфорс в аудите | `8d1e8891` PR#35 |
| NOINDEX-PHANTOM | phantom yandex-запись удалена из NOINDEX_ALLOWLIST | `8d1e8891` PR#35 |
| AUDIT-PRO-REQUIRE-CRASH | require cache-bust-assets → fatal с диагностикой | `8d1e8891` PR#35 |
| DEAD-SCRIPTS-6 | 6 мёртвых скриптов удалены (0 ссылок, перепроверено) | `8d1e8891` PR#35 |
| CACHE-BUST-STALE-MAIN | самоизлечился первым content-пушем (предсказано в reverify) | `8fd5bb36` |
| SEARCH-SCRIPTURE-BROKEN | Скоуп «Писание»: Pagefind-first роутинг + 70 сокращений (все 66 книг) + scripture в 15 items манифеста + guard. Живой смоук: «Иер 17:9»/«Рим 7»/«Мф 5» находят. Layout-prop rollout meta на остальные страницы — след. лейн | `PR#36` |
| GATE-GAP-NATIVE-TEXT-PARITY | content-coverage-audit.js (word-multiset legacy↔dist, 50 маршрутов) в prod-like chain + deploy.yml | `PR#36` |
| SEARCH-MANIFEST-QUALITY | scripture-часть закрыта (15 items + guard); slug/image-части остаются P3-мелочью | `PR#36` |
| CONTENT-LOSS-AVRAAM-SOURCES | 🆕→закрыт в том же PR: /karty/avraam/ потерял весь научный аппарат «Источники и метод» (14 пунктов) — MapEngine не рендерит панель источников. Восстановлен в статичный слой. Найден новым coverage-гейтом | `PR#36` |
| CSS-PARSE-CORRUPTION-SITECSS | 🆕 КРИТ: искажённый селектор `.compare-table:not(...` (5 незакрытых скобок от dead-code коммита 86827c18) заставлял браузер отбрасывать огромный блок site.css ниже по каскаду — корень сломанных глоссарий-тултипов, share-бара и «развалившихся блоков снизу» на ВСЕХ страницах. Доказано в headless (getComputedStyle .gtip: display:inline/borderRadius:0 → 0 правил применялось). Восстановлен чистый регион (b9f4cb59). После: 26 поповеров скрыты, клик → плавающая карточка | `PR#42` |
| GILL-SUBMENU-STEPPED-FILL | 🆕 Полоска оглавления «прыгала» ступенчатым процентом вместо исторической плавной «metro line». Восстановлена непрерывная пиксельная интерполяция (geo() из pre-astro). Headless: 20 различных значений/21 сэмпл, монотонно | `PR#43` |
| GLOSSARY-CARD-LILAC-LIGHT | 🆕 Owner: сиреневый «перелив» карточки глоссария (light) → чистый белый + глубокая тень; ночной режим не тронут | `PR#43` |
| HEADING-ANCHOR-FOCUS-FRAME | 🆕 Owner: квадратная рамка (outline на :focus вокруг 44×44) у скрепки копирования заголовков убрана; иконка реагирует цветом+подъёмом, клавиатурный фокус — мягкое свечение | `PR#43` |
| GILL-SUBMENU-COLLAPSIBLE-SUBGROUPS | 🆕 Owner: восстановлено историческое сворачивание подпунктов H3 под неактивными H2 (было плоско, всегда раскрыто). Плоская разметка + data-gbs2-grp + geo()-заливка с visDot + railKick rAF-цикл (заливка следует за анимацией). Headless: группы сворачиваются/раскрываются, заливка 0→74→162px | `PR#44` |
| GILL-RAIL-FLOW-CARD-RESTORE | 🆕 Owner: сабменю вернулось ВНУТРЬ развёрнутой карточки текущей части (историч. flow-rail bcf6389f/pilot v2.1: обложка + «Сейчас читаете» + название ЧАСТИ вместо названия серии на всех страницах + curbar + TOC); остальные части обтекают карточку. Рендер серверный (Astro), аудит-контракт .gbs2-current[aria-current=page] | `PR#45` |
| GILL-SUBMENU-SUBDOT-CLIPPED | 🆕 Owner: у подпунктов пропали кружочки — overflow:hidden коллапса (PR#44) ампутировал точки, висящие левее li. Коллапс переведён на clip-path inset(0 -2px 0 -30px) — клип по вертикали, точки видимы | `PR#45` |
| GILL-RAIL-FILL-LURCH | 🆕 Owner: «полоска стоит → рывок → ползёт» — транзишен height .38-.45s ease постоянно перезапускался к движущейся цели. Восстановлен историч. режим follow(): height .08s linear на скролле, none во время rAF-догонки railKick. Замер: монотонный непрерывный рост 2400→9000px | `PR#45` |
| GILL-RAIL-LINE-GOLD-NOT-BEIGE | 🆕 Owner: линия метро в ночном режиме тёплая бежевая (#e6cba3→#d4a574→#c1945f + мягкое гало) вместо яркого золота; light не тронут | `PR#45` |
| ARTICLE-END-ACTIONS-SKIPPED | 🆕 Owner: «Поделиться статьёй»/«Распечатать PDF» исчезли на Gill/сериях — site.js пропускал весь конструктор конца статьи при наличии ЛЮБОГО .article-end-block (серверный SDG-крест). Гейт → .article-end-actions; при серверном кресте кнопки встают над ним, второй крест не добавляется. Единообразно на всех статьях (Gill+Герменевтика проверены headless) | `PR#45` |
| GILL-SAVE-NO-FILL | 🆕 Owner: закладка «дрыгается, но не закрашивается» — fill:none футера рельсы (равная специфичность, позже в файле) глушил золотой fill .is-saved. Явный repaint для [data-gill-v16] | `PR#45` |
| RESUME-TOAST-STALE-NAG | 🆕 Owner: «Вы остановились на 1%» на всех страницах — на v16 драйвер phase-2 (enhancements) мёртв, позиция заморожена навсегда. Phase-2 заглушен на v16; контроллер ведёт позицию сам: показ при 8–92% и y>1200, раз за сессию, × мутит 24ч, ≥95% очищает | `PR#45` |
| GBS2-HERO-BOTTOM-STRIP | 🆕 Owner: полоса снизу hero (ярко на Справочнике) — unlayered img{height:auto} перебивал layered .gbs2-hero img{height:124%} (слои каскада), картинка 100% при top:-12%. Unlayered-переутверждение + возвращены параллакс-переменные --gbs2-par/--gbs2-kin-y в контроллер | `PR#45` |
| GILL-KINETIC-OVERLAP | 🆕 Owner: римская «III» (11vw ≈ 2× зарезервированного отступа) наезжала на лид. Расширен gutter + размер под 3 глифа + золотой hover с подъёмом. Headless: overlap 0px | `PR#45` |
| TTS-PILL-CLIPPED-RING-DEAD | 🆕 Owner: меню скоростей резалось (overflow:hidden рельсы при пилюле шире рельсы), кольцо прогресса «мёртвое» (апдейт только на границах ~200-символьных чанков). Rail overflow:visible + непрерывный прогресс через utterance.onboundary; пауза подтверждена стабом (playing→paused→playing). Прежние «не работает пауза» частично артефакт: window.speechSynthesis — readonly-акцессор, стаб через defineProperty | `PR#45` |
| HOME-SEARCH-ICON-LAZY-MISSING | 🆕 Owner: иконки поиска нет в шапке главной при первой загрузке (её инжектил только лениво загруженный search.js). Статический #gbSearchBtn в HomePageChrome, search.js дедупит по id | `PR#45` |
| AUDIT-FILL-MONOTONIC-LAYOUT-AWARE | 🆕 Аудит §6.3 v2: монотонность заливки проверяется в пределах одной раскладки сворачивания (layout signature) + settle-wait — снапшоты середины анимации сворачивания давали ложные «fill regressed» | `PR#45` |
| UI-GILL-SCROLLSPY-DEAD-06 | Scrollspy суб-меню был мёртв на всех Gill-страницах (гейт initGbs2Controls); ревив + FATAL live-режим аудита. **На проде** (run 28747336849) | `655e1652` PR#34 |
| UI-GILL-SUBMENU-ORDER-07 | Монотонность меню chast-1/2/3 восстановлена (данные+рантайм+аудит). **На проде** | `655e1652` PR#34 |
| UI-GILL-DOT-TRACK-OFFSET-08 | Точки на линии трека (7.5px→0.5px, историческое размещение внутри ul). **На проде** | `655e1652` PR#34 |
| DEPLOY-YML-DEAD-WARN-STEP | Мёртвый недостижимый warn-шаг «Deploying anyway» удалён из deploy.yml | `655e1652` PR#34 |
| AUDIT-P2-SW-PRECACHE-4 | 4 lazy-ассета убраны из SW PRECACHE; CACHE_VERSION v188; G61: LAZY_NO_PRECACHE + запрет реинтродукции | `PR#37` |
| BUG-ARCH-001 | = дубликат SW-PRECACHE-4, закрыт тем же фиксом | `PR#37` |
| AUDIT-P3-SEARCH-LAZY-CONFIRMED | = та же суть (precache побеждал lazy), закрыт тем же фиксом | `PR#37` |
| BUG-SW-001 | isFont() двойное отрицание → позитивная форма | `PR#37` |
| AUDIT-P3-STYLE-DUP | ID-гарды на инъекцию runtime-CSS (enhancements/highlights) | `PR#37` |
| AUDIT-P3-QUOTE-NO-CONFIRM | confirm() перед удалением цитаты | `PR#37` |
| NEW-PREFETCH-UNCONDITIONAL | prefetch-хинты BaseLayout исключают текущую страницу | `PR#37` |
| BUG-CLEANUP-002 | 31MB stale pixel-diff скриншотов удалены; docs/refactor-2026 32MB→1.3MB (журналы лейнов сохранены) | `PR#37` |
| BUG-CLEANUP-003 | AUDIT_HISTORY.md — закрыт как BY-DESIGN: файл защищён правилами AGENTS.md (§«Оставлять AUDIT_HISTORY.md»), удаление противоречило бы governance | by-design |
| BUG-CLEANUP-004 | docs/BUGS_FOUND_2026-06-25.md → docs/archive/ | `PR#37` |

---

## 🔴 P0/P1 — release / deploy unblock (статус 2026-07-14 вечер)

| ID | Описание | Witnesses |
|---|---|---|
| PROD-STALE-DEPLOY-RED | 🆕 **2026-07-14:** прод не обновлялся с `007b67def5` (2026-07-11); main = `2ca2af3b` (+277 commits). Deploy FAIL на Static publication gates; ~59 fail / 25 cancel с 07-11. Читатели видят старый сайт; genealogy/heart/mobile-chrome/atlas **не на проде**. | verified-ci (runs `29138555390` green, `29338523013` fail) |
| DEP-BLOCK-EDITORIAL-REGISTRY | ✅ **FIXED 2026-07-14 @ dns-configuration-setup** (912ffe3 (реестр перегенерирован официальным инструментом, 25/25)). Было: `editorial-metadata-registry.js --check` exit 1: eligible 25 / records 20. Missing: `dzhon-gill-chast-4-ekzeget`, `chto-bibliya-nazyvaet-serdcem`, `novoe-serdce`, `serdce-i-duh`, `serdce-spravochnik`. Registry `sourceCommit` still `e6793627`. **Ломает IndexNow readiness** (`Validate registry structure`). | verified-source reverify 07-14 |
| DEP-BLOCK-MAPS-VALIDATE | ✅ **FIXED 2026-07-14 @ dns-configuration-setup** (поздний коммит ветки (sheet-формат nachalo скоуплен §13-бис, ctx/region узаконены, stats выправлены) — maps:validate ✅). Было: `maps:validate` exit 1, 25 issues: (1) hub «на аудите»=9 но missing cards=10 после `nachalo`; (2) `nachalo/route.json` schema incomplete; (3) avraam meta.stats places 19≠22 + stage-less babylon/mari/paran; shoftim stats. В цепочке `validate:static-publication`. | verified-source |
| DEP-BLOCK-CSS-IMPORTANT-CEILING | ✅ **FIXED 2026-07-14 @ dns-configuration-setup** (912ffe3 (210→183 архитектурно: reduced-motion блоки в конец каскада, a11y сохранена; потолки унифицированы 200)). Было: `css:layer:validate` exit 1: site.css `!important` **210 > ceiling 202**. Instance of D-2 now **deploy-blocking**. Layered still ~21%. | verified-source |
| DEP-BLOCK-AVRAAM-AUDIT | ✅ **FIXED 2026-07-14 @ dns-configuration-setup** (поздний коммит ветки (ctx/region вне сверки, set-сравнение) — 27/27). Было: `avraam:audit` 25/27 fail: route places 22 vs HTML set 19 (extra babylon/mari/paran-region). In static publication chain. | verified-source |
| MAP-P0-01 | 🆕 **Karty P0:** Мобильная панель `.me-panel` уходит выше viewport до -581px (Маккавеи), -212px (Исход); заголовок, крестик и tabs недоступны | verified-browser (c2c339708252) |
| MAP-P0-02 | 🆕 **Karty P0:** Кнопка «Поделиться» падает `ReferenceError: getState is not defined` в `map-engine.js` | verified-browser (c2c339708252) |
| MAP-P0-03 | 🆕 **Karty P0:** Поиск падает `ReferenceError: inStory is not defined` через 3с после подсветки; очистка сбрасывает opacity маркеров в `""` (уничтожает dim) | verified-browser (c2c339708252) |
| MAP-P0-04 | 🆕 **Karty P0:** `meta.viewport_init` считывается, но через 200мс перетирается безусловным `flyTo` к 1-й точке (`w=900`), урезая видимый маршрут (Павел 10→4 места) | verified-browser (c2c339708252) |
| MAP-P0-05 | 🆕 **Karty P0:** Deep links query игнорируются (`?story=sinai`), hash не синхронизирует chips UI, share пишет query а loader читает hash | verified-browser (c2c339708252) |
| MAP-P0-06 | 🆕 **Karty P0:** Layer toggles селектор `[data-layer="{id}"]` даёт 0 совпадений по всем маршрутам (`main`, `journey1-3`) — переключатели инертны | verified-browser (c2c339708252) |
| MAP-P0-07 | 🆕 **Karty P0:** Theme toggle обновляет CSS-переменные, но карта и SVG используют хардкод тёмных цветов (pixel diff 0,24%, меняется только иконка) | verified-browser (c2c339708252) |
| MAP-P0-08 | 🆕 **Karty P0:** Кнопки zoom `+` и `−` не реагируют на обычный `.click()` и клавиатуру Enter/Space (требуют удержания `mousedown`) | verified-browser (c2c339708252) |
| ASTRO-P0-01 | 🆕 **Karty P0:** Production-like Astro `/karty/avraam/` падает при инициализации (`TypeError: Cannot read properties of undefined (reading 'push')`) в `map-engine.js:1294` | verified-browser (c2c339708252) |
| ASTRO-P0-02 | 🆕 **Karty P0:** `avraam/route.json` places 19–21 (`babylon`, `mari`, `paran-region`) не имеют `stage`, вызывая падение `stagePaths[p.stage].push(p)` | verified-source (32ae0d7d) |
| ASTRO-P0-03 | 🆕 **Karty P0:** `MapEngine.validateRoute()` выдаёт warning на рассинхрон stats, но CI-гейт проверяет только `ok: true`, пропуская битые данные | verified-source (32ae0d7d) |
| ASTRO-P0-04 | 🆕 **Karty P0:** Три разных публичных счётчика мест Авраама (19 в SEO/meta, 20 в legacy интро, 22 в Astro MapEngine) | verified-source (32ae0d7d) |
| ASTRO-P0-05 | 🆕 **Karty P0:** Исключение инициализации MapEngine перехватывается только в console; пользователь видит рабочий, но пустой чёрный экран без `.me-error` | verified-browser (c2c339708252) |
| ASTRO-P0-06 | 🆕 **Karty P0:** Выключение JavaScript или сбой загрузки `route.json` блокирует экран сплошным `#070a10` поверх `<noscript>` и sr-only контента | verified-browser (c2c339708252) |
| DATA-P0-01 | 🆕 **Karty P0:** MapEngine полностью игнорирует все 15 авторских криволинейных SVG-маршрутов `stages[].paths` в `avraam/route.json`, рисуя прямые `L`-отрезки | verified-source (32ae0d7d) |

---

## 🟠 P1 — ОТКРЫТО (27)

| ID | Описание | Witnesses |
|---|---|---|
| S-T-01 | 🟡 **ЧАСТИЧНО 2026-07-14**: чекер серий + orphan-scan + legacy-selector-ban теперь видят .astro/.mdx; полный route-level паритет гейтов для Astro-мира — остаётся. | Auditor 2026-07-14 |
| S-SEC-01 | Blacklist-based HTML Sanitization in enhancements.js (XSS risk) | Auditor 2026-07-14 |
| S-DATA-01 | ✅ **FIXED 2026-07-14 @ dns-configuration-setup**: data/series.json hard-texts 2→6 частей (синхронизирован с heartSeriesData движка); чекер серий audit-pro видит Astro/MDX-маршруты. Было: slugs series.json ≠ src/pages. | Auditor 2026-07-14 + fix-verify (audit-pro 0) |
| MAP-P1-01 | 🆕 **Karty P1:** Tour mode показывает подпись I этапа для III этапа, анимирует stage dot не по `sid` и сразу вызывает `flyTo(nextPlace)` до остановки | verified-browser (c2c339708252) |
| MAP-P1-02 | 🆕 **Karty P1:** Tour mode полностью отсутствует в мобильном/touch интерфейсе (запуск только по клавише Space) | verified-browser (c2c339708252) |
| MAP-P1-03 | 🆕 **Karty P1:** `shoftim` имеет 6 этапов в метаданных, но все 12 мест привязаны к stage 0; этапы II–VI и фильтрованный tour сломаны | verified-source (c2c339708252) |
| MAP-P1-04 | 🆕 **Karty P1:** Системные перекрытия верхнего UI: search × theme (44×23px), search × share (6×23px), header × timeline (1440×53px), stories × timeline (1007×36px) | verified-browser (c2c339708252) |
| MAP-P1-05 | 🆕 **Karty P1:** Mobile viewport occupancy карты крайне мала (3.8% Судьи, 6.6% 12 колен, 10% Павел), создавая коллизии подписей в центре | verified-browser (c2c339708252) |
| MAP-P1-06 | 🆕 **Karty P1:** `_renderArchaeologyFooter` рендерится под всеми вкладками (267 раз вне вкладки «Археология»), раздувая мобильную панель | verified-browser (c2c339708252) |
| MAP-P1-07 | 🆕 **Karty P1:** Exact marker overlap: Ранняя церковь 2 маркера в (624,800); Жизнь Иисуса пары в (623,800) и (622,799) — нижние некликабельны | verified-source (c2c339708252) |
| MAP-P1-08 | 🆕 **Karty P1:** Переключение story мигает (opacity 0.15→1→dimming); очистка поиска сбрасывает inline opacity всех маркеров | verified-browser (c2c339708252) |
| MAP-P1-09 | 🆕 **Karty P1:** Выбор story через 600мс автоматически открывает панель первого места, перекрывая карту bottom sheet'ом на mobile | verified-browser (c2c339708252) |
| MAP-P1-10 | 🆕 **Karty P1:** Base geography SVG отсутствует (Исход в проде) или накрывается полупрозрачным background rect, гасящим рельеф | verified-browser (c2c339708252) |
| MAP-P1-11 | 🆕 **Karty P1:** Scale bar использует `cfg.W0 / view.w` вместо `canvasWidth / view.w`, ошибка масштаба от 1.32x (desktop) до 4.87x (mobile) | verified-source (c2c339708252) |
| MAP-P1-12 | 🆕 **Karty P1:** Compass размещён в координатах карты (50,80) внутри SVG pan/zoom группы вместо screen overlay, улетая за экран | verified-browser (c2c339708252) |
| MAP-P1-13 | 🆕 **Karty P1:** A11y: 113/113 маркеров без role/tabindex/labels; panel без role=dialog/aria-hidden; JS flyTo/tour игнорирует reduced-motion | verified-browser (c2c339708252) |
| MAP-P1-14 | 🆕 **Karty P1:** Destroy lifecycle не снимает keydown listeners и удаляет общий `<style id="me-base-css">`, обесцвечивая второй инстанс | verified-browser (c2c339708252) |
| AVRAAM-P1-01 | 🆕 **Karty P1:** Primary CTA «Начать кинотур» невидим (opacity 0) 1.8 секунды после загрузки, оставаясь физически кликабельным | verified-browser (c2c339708252) |
| AVRAAM-P1-02 | 🆕 **Karty P1:** Initial viewport Авраама сжимает кластер Ханаана (Дамаск/Дан, Содом/Беэр-Шева, Хеврон/Мамре) при пустом востоке | verified-browser (c2c339708252) |
| AVRAAM-P1-03 | 🆕 **Karty P1:** Mobile panel Авраама дублирует навигацию (prev/next row + mobile arrows + p-elem `← ←`), квадратный share, tabs 42px | verified-browser (c2c339708252) |
| AVRAAM-P1-04 | 🆕 **Karty P1:** Вкладки панели Авраама — обычные `<div>` без `role="tab"`, `tabindex` и клавиатурной обработчики | verified-browser (c2c339708252) |
| AVRAAM-P1-05 | 🆕 **Karty P1:** Short landscape desktop (1024×450) блокируется оверлеем «Разверните устройство» из-за слепого media query | verified-browser (c2c339708252) |
| KARTY-DATA-P1-01 | 🆕 **Karty P1:** Острая нехватка ручных anchors/leaders в route.json (8 из 9 engine-карт имеют лишь 0–5 анкоров) | verified-source (c2c339708252) |
| ASTRO-P1-01 | 🆕 **Karty P1:** Начальная камера Авраама на 1-й точке уводит 18 из 19 мест за пределы видимого viewBox | verified-browser (c2c339708252) |
| ASTRO-P1-02 | 🆕 **Karty P1:** Палитра `STAGE_COLORS` содержит 6 цветов; этапы VII и VIII Авраама получают прозрачные маркеры и лишаются SVG-стрелок | verified-source (32ae0d7d) |
| ASTRO-P1-03 | 🆕 **Karty P1:** Переключатели слоёв Авраама (`abr`, `lot`, `war`, `cand`) дают 0 совпадений селекторов в SVG DOM | verified-browser (c2c339708252) |
| ASTRO-P1-04 | 🆕 **Karty P1:** Tour mode читает только `story.stage_ids`, игнорируя alias `story.stages` и проходя все 8 этапов во всех сюжетах | verified-source (32ae0d7d) |
| ASTRO-P1-05 | 🆕 **Karty P1:** Статический root (`avraam-app.js`) и deploy build (`AvraamMap.astro`) отдают две абсолютно разные реализации рендерера | verified-source (32ae0d7d) |
| MAP-P1-15 | 🆕 **Karty P1:** В тулбаре зума рендерятся две кнопки «Измерить расстояние», первая из которых (`⟍`, `#me-ruler-btn`) мёртвая и без обработчика | verified-source (32ae0d7d) |
| MAP-P1-16 | 🆕 **Karty P1:** Глобальные сочетания клавиш перехватывают ввод в поиске (Space запускает тур, цифры 1–8 переключают табы вместо ввода текста) | verified-browser (c2c339708252) |
| MAP-P1-17 | 🆕 **Karty P1:** Клавиатурная цифра `6` активирует вкладку `photos` вместо `sci` из-за пропуска `sci` в фильтре `TAB_KEYS` | verified-source (32ae0d7d) |
| MAP-P1-18 | 🆕 **Karty P1:** Модальное окно галереи всегда загружает thumbnail 320px и не поддерживает свайпы на touch-экранах | verified-browser (c2c339708252) |
| MAP-P1-19 | 🆕 **Karty P1:** Мобильный landscape (844×390) переключается в desktop-панель, уводя заголовок и крестик закрытия на -357px за верх экрана | verified-browser (c2c339708252) |
| MAP-P1-20 | 🆕 **Karty P1:** Service Worker кэширует неверсионированные скрипты и JSON карт с политикой `cacheFirst`, создавая риск вечных устаревших ресурсов | verified-source (32ae0d7d) |
| GATE-P1-02 | 🆕 **Karty P1:** `atlas-label-audit.js` сообщает 0 коллизий для всех карт, полностью пропуская marker-to-marker overlap, safe area и clipping | verified-source (32ae0d7d) |
| GATE-P1-03 | 🆕 **Karty P1:** `atlas:gate` постоянно красный на регрессии waypoints/chars Авраама, пока schema-гейты ошибочно остаются зелёными | verified-ci (32ae0d7d) |
| DATA-P1-03 | 🆕 **Karty P1:** Дизайн-токены эпох `route.meta.era` не читаются рантаймом и не меняют палитру карты | verified-source (32ae0d7d) |
| DATA-P1-04 | 🆕 **Karty P1:** Полностью отсутствует semantic zoom/LOD — шрифты подписей масштабируются до 1.5px на mobile zoom-out и 40px на desktop zoom-in | verified-browser (c2c339708252) |
| ENGINE-P1-21 | 🆕 **Karty P1:** Трансформация координат экрана в SVG игнорирует letterboxing `preserveAspectRatio="meet"`, создавая ошибку линейки в 1.63x | verified-source (32ae0d7d) |
| ENGINE-P1-22 | 🆕 **Karty P1:** Функция измерения расстояния `kmBetween()` хардкодит множитель `0.92`, игнорируя настраиваемый `cfg.kmPerUnit` | verified-source (32ae0d7d) |
| ENGINE-P1-23 | 🆕 **Karty P1:** Анимации hover/click запрашивают `circle:nth-child(3)`, анимируя штриховое кольцо этапа вместо центральной точки маркера | verified-source (32ae0d7d) |
| ENGINE-P1-24 | 🆕 **Karty P1:** Изменённое состояние видимости слоёв сбрасывается к дефолтному при любом повторном вызове `renderMarkers()` | verified-browser (c2c339708252) |
| ENGINE-P1-25 | 🆕 **Karty P1:** Свойство слоя `on: false` игнорируется при первом рендере (слой виден при выключенном свиче) | verified-browser (c2c339708252) |
| ENGINE-P1-26 | 🆕 **Karty P1:** Поиск подсвечивает точки вне текущего сюжета, но не добавляет на них обработчик клика, делая их некликабельными | verified-browser (c2c339708252) |
| ENGINE-P1-27 | 🆕 **Karty P1:** Нажатие Escape в модальном окне фотографии одновременно закрывает родительскую панель места | verified-browser (c2c339708252) |
| ENGINE-P1-28 | 🆕 **Karty P1:** Делегированный клик панели повторно вызывал `openPhoto(img.src)`, перезаписывая полноразмерное фото миниатюрой | verified-source (32ae0d7d) |
| A11Y-P1-01 | 🆕 **Karty P1:** Во время отображения интро в DOM одновременно находятся два элемента `<h1>` | verified-source (32ae0d7d) |
| A11Y-P1-02 | 🆕 **Karty P1:** Текстовая sr-only версия Авраама расположена до интерактивной карты в порядке чтения без skip link | verified-source (32ae0d7d) |
| A11Y-P1-03 | 🆕 **Karty P1:** Мелкий текст метаданных археологии (`rgba(154,162,174,.4)`) имеет контраст 2.15:1, не проходя WCAG AA (минимум 4.5:1) | verified-browser (c2c339708252) |
| RIVER-P1-01 | 🆕 **Karty P1:** `#waterRipple` `feDisplacementMap scale="7"` деформирует береговую линию на ±7px, отрывая статичные устья рек (Киссон, Иордан, дельта Нила) от берега | verified-source (32ae0d7d) |
| RIVER-P1-02 | 🆕 **Karty P1:** В `<defs>` файла `karty/_engine/base-geo.svg` отсутствует определение фильтра `id="waterRipple"`, хотя фильтр вызывается 4 раза | verified-source (32ae0d7d) |
| RIVER-P1-03 | 🆕 **Karty P1:** `stroke-linecap="round"` при ширине рек 3..5px выдвигает полукруглый закругленный торец на 2.5px за конечные координаты, из-за чего река вылетает в море | verified-source (32ae0d7d) |
| RIVER-P1-04 | 🆕 **Karty P1:** Вызов `getTotalLength()` до завершения компоновки DOM возвращает `0`, принуждая `stroke-dasharray="0"` и мгновенный проскок анимации через берег | verified-source (32ae0d7d) |
| RIVER-P1-05 | 🆕 **Karty P1:** Дублирование линий русел рек в `base-geo.svg` под `waterRipple` создаёт эффект «сдвоенной линии» у берегов | verified-source (32ae0d7d) |
| QUAL-P1-01 | 🆕 **Karty P1:** 15 контролов карты не соответствуют стандарту WCAG AAA 44px (`.me-back` 36px, `.me-story-chip` 36px, `.me-arch-more` 32px, `.me-panel__resize` 12px) | verified-source (32ae0d7d) |
| QUAL-P1-02 | 🆕 **Karty P1:** Динамический иврит (244+ слов) не имеет явного `font-family: "Noto Serif Hebrew"` и `dir="rtl"`, вызывая визуальные искажения шрифта | verified-source (32ae0d7d) |
| QUAL-P1-03 | 🆕 **Karty P1:** 39 библейских цитат диапазона стихов в движковых картах используют ASCII дефисы `-` вместо типографского тире `–` | verified-source (32ae0d7d) |
| QUAL-P1-04 | 🆕 **Karty P1:** Всплывающий клик галереи сбрасывает полноразмерное фото к 320px миниатюре из-за повторного срабатывания делегированного клика панели | verified-source (32ae0d7d) |
| QUAL-P1-05 | 🆕 **Karty P1:** 16 обработчиков событий `wheel`, `touchstart`, `touchmove`, `mousemove` не имеют флага `{ passive: true }`, вызывая задержки скролла на mobile | verified-source (32ae0d7d) |
| QUAL-P1-06 | 🆕 **Karty P1:** 58 таймеров `setTimeout/rAF` работают без привязки к lifecycle cleanup, вызывая выполнении кода после уничтожения карты | verified-source (32ae0d7d) |
| QUAL-P1-07 | 🆕 **Karty P1:** Идентификаторы сюжетов в `early-church`, `melachim` и `revelation` используют подчёркивание `_` вместо дефиса `-`, ломая Ajv 2020-12 схему | verified-source (32ae0d7d) |
| QUAL-P1-08 | 🆕 **Karty P1:** 8 holding-карт используют универсальную заглушку OpenGraph `og-karty-1200x630.webp`, лишая превью карт собственного визуала | verified-source (32ae0d7d) |
| QUAL-P1-09 | 🆕 **Karty P1:** Все профили `data/route-profiles/karty-*.json` указывают `currentStatus: "production-dist"`, создавая рассинхрон с `route.json` | verified-source (32ae0d7d) |
|---|---|---|
| AUDIT-CSS-SITECSS-STRUCT-CORRUPTION | ✅ **FIXED 2026-07-14 @ dns-configuration-setup** (912ffe3 — все 5 правил восстановлены; css-tree/postcss: 0 ошибок; AST-гейт добавлен в engine:contracts). Было: **Структурная порча `css/site.css` (deep CSS-аудит 07-14, невидима гейтам).** Два независимых парсера (`postcss@8.5.16` + `css-tree`) падают: postcss «40:16304 Unknown word .bottom-bar,.btoc-link,.flip-card-inner,.h-article-card,.quiz-option», css-tree — 9 ошибок (offsets 179799/180014/201874/201914/203062/277864+3). Кластер сломанных правил (браузер выкидывает по error-recovery): (1) `@media (prefers-reduced-motion:reduce){.bottom-bar,.btoc-link,.flip-card-inner,.h-article-card,.quiz-option}` — **список селекторов БЕЗ блока объявлений** → у reduce-motion-пользователей НЕ отключается анимация этих 5 классов (a11y); (2) `.ehrman-block,.info-box,.quote-box}` — висячий список без `{}`; (3) `…,.resume-reading-title,@supports(…)` — список разорван `@supports` (хвостовая запятая); (4) `@media (hover…){html.dark }` — пустое правило; (5) `.gbx-backlinks__maplink:rgba(122,46,46,0.08);` — битое объявление (нет свойства). **Гейты слепы:** `audit-pro` проверяет только баланс скобок (проходит — скобки сбалансированы), `validate.js` не парсит CSS структурно, `css-layer-validator` смотрит лишь счётчик `!important`. Тот же класс, что историческая CSS-PARSE-CORRUPTION-SITECSS (PR#42) — блайндспот так и не закрыт гейтом. Pre-existing (есть и в `b8459bdf`; site.css контент +0/−0 в дельте). Fix: восстановить 5 правил + добавить структурный CSS-парс в гейт (см. AUDIT-CSS-NO-STRUCTURAL-PARSE). | verified-source ×2 парсера (postcss+css-tree); reverify 07-14 §CSS |
| REG-VALIDATE-GENEALOGY-TEMPLATE | ✅ **FIXED 2026-07-14 @ dns-configuration-setup** (scripts/ выведен из walkers validate.js и audit-pro (build-шаблоны ≠ страницы)). Было: **DEPLOY-БЛОКЕР @ `2ca2af3b`.** `validate.js --strict` (в цепочке `validate:static-publication` → шаг «Static publication gates» деплоя) падает EXIT 1 на 2 файлах: `scripts/genealogy-build/atlas-template.html` и `interactive-template.html` — «inline `<script>` syntax error: Unexpected token ';'». Это **build-time шаблоны** с плейсхолдерами (`const ATLAS=/*__ATLAS__*/;`, подставляются `build-atlas.mjs:156` → `.replace('/*__ATLAS__*/', JSON.stringify(scene))`); как сырьё это невалидный JS, но они **никогда не отдаются** — только вход сборки. Корень: `validate.js walkHtmlFiles()` (:467) идёт от ROOT со skip-set, где **нет `scripts/`** → линтит входы сборки как страницы. Та же дрейф-проблема бьёт `audit-pro.js` (lang/canonical/charset/inline-script на тех же 2 файлах; его skipDirs игнорит `audit/`, но не `scripts/`). Кандидат-фикс (release-транзакция, owner-gated): добавить `scripts/` в skip-set walker'ов ИЛИ пропускать `<script>` с плейсхолдерами `/*__…__*/` ИЛИ переименовать шаблоны в игнорируемый паттерн. | verified-source + verified-build (Node v22.22.3 локально) + verified-ci (run `29338523013`); `reverify/CURRENT_HEAD_REVERIFY_2026-07-14_2ca2af3b.md` |
| REG-EDITORIAL-METADATA-MISSING | ✅ **FIXED 2026-07-14 @ dns-configuration-setup** (см. DEP-BLOCK-EDITORIAL-REGISTRY). Было: **DEPLOY-БЛОКЕР @ `2ca2af3b`.** `editorial-metadata-registry.js --check` (шаг «Validate registry structure» в *Metadata & IndexNow Readiness*; деплой контент-пушей идёт `workflow_run` по её `conclusion==success` → красный гейт блокирует деплой) даёт 5 ошибок (Eligible 25 / Records 20): нет записей у `/articles/dzhon-gill-chast-4-ekzeget/`, `/articles/chto-bibliya-nazyvaet-serdcem/`, `/articles/novoe-serdce/`, `/articles/serdce-i-duh/`, `/articles/serdce-spravochnik/`. Новый контент (Gill Часть IV + серия «Сердце», 07-13/14) залит без записей реестра. Fix: добавить 5 editorial-metadata записей (даты/автор). | verified-source + verified-build + verified-ci (run `29338522715`) |
| CACHE-BUST-NO-WRITER | 🆕🟠 **Рецидив находки 2026-07-11.** `audit-pro.js` = 114 ошибок, доминирует `Cache-bust mismatch` по `nagornaya/**`, `rodosloviye/`, `pastor-series/`, `karty/` (`?v=` хэши устарели). `node scripts/cache-bust.js --write` регенерирует **82 файла** → mismatch 0. Ни один workflow не делает `cache-bust --write`+commit (indexnow/editorial-metadata только *проверяют*; шаг cache-bust в deploy — no-op «skip if IndexNow did it») → каждый concurrent asset-пуш оставляет main красным. Ровно то, что предсказано в session-log 07-11 (`9fce2bc`) как follow-up — **повторилось**. Fix (owner-decision, пайплайн): `cache-bust --write`+auto-commit в metadata-workflow. | verified-source + verified-build; session-log 2026-07-11 |
| BUG-PERF-001 | addEventListener без removeEventListener: 339 add / 25 remove по всем js/ (294/16 в 5 файлах) | 2 witnesses + пересчёт 07-05 |
| TTS-DL-CONSENT | Неявная загрузка ~280 МБ модели: первый клик «Слушать» молча качает нейромодель в фоне (`warmVoskInBackground`→`ensureLoaded`, floating-cluster-controller.js:344/363), пользователь не спрошен и на этой сессии хорошего голоса не слышит. **Меняет UX → решение владельца.** Верификация V12 (GPT-5.5) построчно подтверждена | `incoming/tts-delivery-architecture-verification-2026-07-08/REPORT.md` |
| NG-CSS-01 | 🆕 **Нагорная P1:** `tw.min.css` без dark-вариантов — 0 `html.dark` селекторов в 34KB Tailwind-выходе для нагорной. Все dark-ремапы живут исключительно на `!important` хаках `mobile-hotfix.css`. Архитектурная причина NG-DARK-01. Evidence: `evidence/NAGORNAYA_DEEP_AUDIT_CYCLE3_2026-07-14.md` | arena-auditor cycle 3 |
| NG-BODY-01 | 🆕 **Нагорная P1:** `bg-stone-100` на `<body>` не ремапится в dark — body фон остаётся светло-серым `#f5f5f4` в тёмной теме. `.bg-stone-100` (0,1,0) > `body` (0,0,1). `mobile-hotfix.css` ремапит `bg-stone-50` но **НЕ `bg-stone-100`**. Evidence: `evidence/NAGORNAYA_DEEP_AUDIT_CYCLE3_2026-07-14.md` | arena-auditor cycle 3 |
| GENEALOGY-ATLAS-V1-SHIPPED-NOT-PROD | 🆕 Атлас родословий v1 **в main** (AGENTS §13, `data/genealogy/v2/build/atlas-interactive.html`, owner milestone 07-14) но **не на проде** из-за PROD-STALE-DEPLOY-RED. Delivery risk, не дефект движка. | milestone intake + verified-ci |
| AR-IDX-CSS-01 | **18 `--z-*` CSS variables используются в home.css без fallback — НЕ ОПРЕДЕЛЕНЫ.** `var(--z-sticky)`, `var(--z-toast-high)`, `var(--z-dropdown-high)`, `var(--z-tooltip-low)`, `var(--z-elevated)`, `var(--z-bottom-bar)` — все падают в `z-index: auto`. Navbar (fixed), mobile backdrop, scroll-to-top, reading progress — stacking сломан на INDEX. **Отличается от D-4:** D-4 про hardcoded `2102 !important` в floating-cluster, этот про отсутствующие токены в home.css. | `incoming/arena-auditor-index/2026-07-14/REPORT.md` §1 (AR-IDX-CSS-01) |
| AR-IDX-01 | **hreflang alternate теги отсутствуют в Astro HomePageHead** — legacy содержит `<link rel="alternate" hreflang="ru">` и `x-default`, Astro потерял. SEO-регрессия. | `incoming/arena-auditor-index/2026-07-14/REPORT.md` §1 (AR-IDX-01) |
| AR-IDX-02 | **SearchAction отсутствует в JSON-LD WebSite** — legacy содержит `potentialAction`, Astro потерял. Google Site Search Box в выдаче не появится. | `incoming/arena-auditor-index/2026-07-14/REPORT.md` §1 (AR-IDX-02) |

> P0/P1-класса системные находки (транзакция релиза, петля дат, SW-ключи, XSS-поверхности, Bible-корпус) ведутся в `SUPER_AUDIT_2026-07-06_14a49be8.md` (волны W1–W6) и переносятся сюда по мере закрытия.
>
> ℹ️ **V12-исследование доставки TTS (GPT-5.5, 2026-07-08):** фактическая точность о текущем коде подтверждена построчно; но большая архитектура (OPFS data/control plane, 11-статусная generation state machine, chunk-manifest+resumable Range, versioned rollback, split-file, 8 CI-уровней) **осознанно отклонена как несоразмерная** одной модели ~280 МБ, меняющейся ~раз в год. Оставлено 3 реальных пункта (1 P1 UX-решение + 2 не-дизайн улучшения — unzip в Worker, пин ревизии URL). §48-49 (SW не должен кэшировать модель) — код УЖЕ корректен. Полный разбор: `incoming/tts-delivery-architecture-verification-2026-07-08/REPORT.md`.

## 🟡 P2 — ОТКРЫТО (24)

| ID | Описание | Witnesses |
|---|---|---|
| S-T-01 | 🟡 **ЧАСТИЧНО 2026-07-14**: чекер серий + orphan-scan + legacy-selector-ban теперь видят .astro/.mdx; полный route-level паритет гейтов для Astro-мира — остаётся. | Auditor 2026-07-14 |
| S-SEC-01 | Blacklist-based HTML Sanitization in enhancements.js (XSS risk) | Auditor 2026-07-14 |
| S-DATA-01 | ✅ **FIXED 2026-07-14 @ dns-configuration-setup**: data/series.json hard-texts 2→6 частей (синхронизирован с heartSeriesData движка); чекер серий audit-pro видит Astro/MDX-маршруты. Было: slugs series.json ≠ src/pages. | Auditor 2026-07-14 + fix-verify (audit-pro 0) |
| AVRAAM-P2-01 | 🆕 **Karty P2:** Тяжёлый payload Авраама (~824KB, 1540 DOM, 1103 SVG, 60 GSAP animations) + дублирующий fetch route.json | verified-browser (c2c339708252) |
| HUB-P2-01 | 🆕 **Karty P2:** Превью Авраама с запечённым текстом, 138px пустой зазор на wide desktop, QA-термины на паблике, скрытый `/karty/ishod/` индексируется | verified-browser (c2c339708252) |
| GATE-P1-01 | 🆕 **Karty P2:** `maps:validate` и `smoke:maps` пропускают ложные зелёные состояния (не проверяют stages, duplicate coords, JS crashes, bounds) | verified-source (c2c339708252) |
| MAP-P2-02 | 🆕 **Karty P2:** `preload route.json` вызывает предупреждение браузера о несоответствии credentials и создаёт двойной сетевой запрос | verified-browser (c2c339708252) |
| ENGINE-P2-03 | 🆕 **Karty P2:** Безусловная искусственная задержка загрузки (600 мс) скрывает уже полученные данные карты | verified-source (32ae0d7d) |
| ENGINE-P2-04 | 🆕 **Karty P2:** Тосты и уведомления о смене сюжета не имеют `role="status"` и `aria-live`, оставаясь невидимыми для скринридеров | verified-source (32ae0d7d) |
| GATE-P1-04 | 🆕 **Karty P2:** Прогон `dist-smoke-audit` корректно фиксирует фатальный инфо-сбой Авраама, но логи загрязнены сетевым шумом | verified-ci (32ae0d7d) |
| QUAL-P2-01 | 🆕 **Karty P2:** Профили маршрутов 8 holding-карт в `data/route-profiles/karty-*.json` указывают `currentStatus: "production-dist"`, вызывая дрейф статусов | verified-source (32ae0d7d) |
| QUAL-P2-02 | 🆕 **Karty P2:** Черновой лист `nachalo/route.json` не содержит обязательных полей `stories`, `meta.id`, `meta.era`, `meta.stats`, не проходя Ajv валидацию | verified-source (32ae0d7d) |
| QUAL-P2-03 | 🆕 **Karty P2:** Маршруты `/karty/` отсутствуют в центральном файле `migration/page-ownership.json`, обходя общую систему валидации владельцев | verified-source (32ae0d7d) |

| S-SEC-01 | Blacklist-based HTML Sanitization in enhancements.js (XSS risk) | Auditor 2026-07-14 |

| S-T-01 | 🟡 **ЧАСТИЧНО 2026-07-14**: чекер серий + orphan-scan + legacy-selector-ban теперь видят .astro/.mdx; полный route-level паритет гейтов для Astro-мира — остаётся. | Auditor 2026-07-14 |

|---|---|---|
| GATE-CSS-IMPORTANT-RATCHET | 🆕🔴 **DEPLOY-БЛОКЕР @ `2ca2af3b`** (2-й проход 07-14). `css/site.css` = **210 `!important` > ceiling 200** (`audit-pro.js` IMPORTANT_CEIL) И отдельный гейт `css:layer:validate --ceiling=202` тоже красный (`❌ !important count 210 exceeds ceiling 202`). Реальная регрессия от atlas/mobile-reader CSS (не tooling-дрейф). Fix: рефактор новых правил в `@layer`/выше специфичность, либо (owner-gated) поднять ceiling с замещающим контрактом. | verified-source + verified-build (Node v22.22.3); reverify 07-14 §2 |
| TTS-DL-UNZIP-SYNC | `fflate.unzipSync` по полному ~280 МБ архиву на main thread (vosk-tts-engine.js:107-108) — разовый фриз при фоновой прогревке. Не дизайн. Fix: async `unzip()` в Worker | V12 W1-CI-44, verified |
| TTS-DL-NO-TABLOCK | Нет межвкладочного лока: `_voskWarmupStarted` — page-local (controller:343), `navigator.locks`/`BroadcastChannel` отсутствуют → 2 вкладки могут качать 280 МБ дважды. Низкая частота; fix осмыслен только вместе с TTS-DL-CONSENT | V12 W1-CI-39, verified |
| AUDIT-P2-WORKFLOWS-CHECK-GAP | `check-workflows.js` не проверяет deploy `if:` условия — `|| failure` не ловится; шире: строковые regex вместо YAML-топологии (см. SUPER_AUDIT W1) | АУДИТ 1.4 + fable 07-06 |
| CI-INDEXNOW-CHECKER-STALE | ⚠️ **2026-07-14 reverify:** формулировка «contents: write» **устарела** — `check-workflows.js` уже требует `contents: read` (PR#70 path). **Активный** IndexNow fail = **DEP-BLOCK-EDITORIAL-REGISTRY** (registry check), не permissions. Оставить строку как historical note или закрыть как fixed-tooling + supersede. | reverify 07-09 + 07-14 |
| HUB-AUDIT-COUNT-DRIFT | 🆕 2026-07-14: `hasAuditPendingDesign()` в `validate-map-routes.js` требует exact integer «на аудите» == missingCount. Добавление `nachalo` (11-я карта, 10 missing) при стате «9» роняет весь `maps:validate`/deploy. Fix: генерировать счётчик из publication statuses route.json. | verified-source, mechanism of DEP-BLOCK-MAPS-VALIDATE |
| BUG-SEO-001 | IndexNow submit до реальной доступности на CDN | Pass 65 |
| NEW-CANONICAL-IZBRANNOE-01-GAP | canonicalSanityGuard не ловит relative canonical на noindex routes (tooling gap) | Pass 65 |
| D-1 | `concurrency: cancel-in-progress: true` now on BOTH workflows (was `false` on indexnow — **partial fix** reverify 07-14); groups still separate (`pages` vs `metadata-indexnow-readiness-*`) → deploy and indexnow can still race. **P2→P3** | arena 07-06 + fable; reverify 07-14 verified-source `2ca2af3` |
| D-2 | css-layer-validator: заголовок обещает проверку порядка @layer, код проверяет только необъявленные слои; порог <50% против цели ≥80%; валидирует только site.css. **2026-07-14:** ceiling breach 210>202 → linked **DEP-BLOCK-CSS-IMPORTANT-CEILING** (P0 while blocking) | arena cycle2 + reverify 07-14 |
| D-19 | `<title>` ≠ `og:title`/`twitter:title`/JSON-LD headline на 2 кастомных PageHead (antisovetov, rimlyanam-7): 4 независимых литерала мимо Seo.astro. 🔧 **rimlyanam-7 половина ЗАКРЫТА** (title→канонический, контент-сессия 2026-07-11); antisovetov половина остаётся | arena cycle2; `validate:all` |
| D-21 | Глоссарий: dual renderer — `o()` innerHTML vs `l()` textContent → литеральный `<em>` в серверных тултипах; innerHTML из JSON = XSS-поверхность (W5) | arena cycle3 + fable: js/glossary.js, data/glossary.json (55 `<em>`) |
| ATLAS-D-NAMESPACE-COLLISION | Атлас-трек в `working/atlas/DEBT-REGISTER.md` переиспользует ID D-16..D-19 под визуальные баги листа Авраама, тогда как в матрице эти ID значат SW-baseline/dep. timeout/title-drift. Нужно переименовать в неймспейс `ATLAS-D-*` (или `AV-*`), чтобы не ломать автоматизацию и верификацию. | `incoming/arena-auditor-2026-07-14/2026-07-14/REPORT.md` §1 (ATLAS-D-16-19-NAMESPACE-COLLISION) |
| NG-DEAD-01 | 🆕 **Нагорная P2:** 15 мёртвых Astro-компонентов (HeaderHero/ArticleBody/PostContent × 5 глав) — ни один не импортируется, артефакты Astro-экстракции. ~450+ строк мёртвого кода. Evidence: `evidence/NAGORNAYA_DEEP_AUDIT_CYCLE3_2026-07-14.md` | arena-auditor cycle 3 |
| NG-INLINE-02 | 🆕 **Нагорная P2:** 172 inline `style=` атрибута (19-20 в «Из библиотеки» × 5 + hero + author + bibliography) — не адаптивны к dark, не переопределяются без `!important`. Уточнение NG-INLINE-01. Evidence: `evidence/NAGORNAYA_DEEP_AUDIT_CYCLE3_2026-07-14.md` | arena-auditor cycle 3 |
| NG-SEO-01 | 🆕 **Нагорная P2:** SEO-мета несогласованность: (1) `<title>` ≠ `og:title>` — разные формулировки на всех 5 частях; (2) ch.4/5 не имеют `data-pagefind-meta="scripture"`; (3) ch.1/2/3: устаревшая версия «v4.0 · Апрель 2026» в футере, ch.4/5 — без строки версии. Evidence: `evidence/NAGORNAYA_DEEP_AUDIT_CYCLE3_2026-07-14.md` | arena-auditor cycle 3 |
| NG-STRUCT-02 | 🆕 **Нагорная P2:** Структурная несогласованность секций — ch.1 имеет SVG иконки + group wrapper + subtitles, ch.2–5 регресс: bare `<h2>` без wrapper, emoji вместо SVG (19 секций), `font-sans` только на 4/10 секций ch.5. Уточнение NG-STRUCT-01. Evidence: `evidence/NAGORNAYA_DEEP_AUDIT_CYCLE3_2026-07-14.md` | arena-auditor cycle 3 |
| AR-IDX-JS-02 | **Theme toggle пишет в 3 разных localStorage ключа**: анти-FOUC читает `'theme'` ✓, Astro inline пишет в `'theme'` ✓, `site.js` пишет в `SiteUtils.themeKey` (undefined → `"undefined"`) ✗. Темная тема не сохраняется между сессиями. | `incoming/arena-auditor-index/2026-07-14/REPORT.md` §1 (AR-IDX-JS-02) |
| AR-IDX-PERF-01 | **LCP image `decoding="async"`** (надо sync для LCP) + **5 render-blocking CSS** + 12 images (10 lazy). Core Web Vitals. | `incoming/arena-auditor-index/2026-07-14/REPORT.md` §1 (AR-IDX-PERF-01) |
| AR-IDX-PERF-02 | **30+ @font-face для INDEX, половина не используется**: Source Sans 3, Noto Sans Greek, Noto Serif Greek не нужны на главной (~450-1500 KB). | `incoming/arena-auditor-index/2026-07-14/REPORT.md` §1 (AR-IDX-PERF-02) |
| AR-IDX-JS-01 | **Cleanup на `pagehide` не работает на Mobile Safari**: 3 обработчика `pagehide` — на iOS при background не срабатывает. | `incoming/arena-auditor-index/2026-07-14/REPORT.md` §1 (AR-IDX-JS-01) |
| AR-IDX-03 | **⌘K хардкод** — на Windows/Linux показывает `⌘K` вместо `Ctrl+K`. | `incoming/arena-auditor-index/2026-07-14/REPORT.md` §1 (AR-IDX-03) |
| AR-IDX-09 | **Keyboard shortcut без altKey/shiftKey guard** — `Option+K` или `Ctrl+Shift+K` тоже срабатывают. | `incoming/arena-auditor-index/2026-07-14/REPORT.md` §1 (AR-IDX-09) |

## 🟢 P3 — ОТКРЫТО (37)
| NG-VIS-04 | 🆕 **Нагорная P2 (→ NG-TABLE-01):** Табличная перегрузка — 8 секций без текстовых абзацев (ch.2/III/V/IX/X, ch.3/V/VII/VIII, ch.5/III). Только гриды/карточки/таблицы — нет «воздуха». ch.2 имеет 1.5x structured/text ratio. **Контентная правка — требует автора.** Evidence: `evidence/NAGORNAYA_VISUAL_AUDIT_2026-07-14.md` + `evidence/NAGORNAYA_DEEP_DARK_THEME_AUDIT_2026-07-14.md` §NG-TABLE-01 |
| NG-VIS-05 | 🆕 **Нагорная P2 (→ NG-REVEAL-01):** Класс `reveal` — НЕ мёртвый: используется glossary.js для поиска `div.reveal` при гидратации. Анимации нет (и не планировалась) — только семантический маркер. Evidence: `evidence/NAGORNAYA_DEEP_DARK_THEME_AUDIT_2026-07-14.md` §NG-REVEAL-01 |
| NG-VIS-06 | 🆕 **Нагорная P2 (→ NG-FONT-01, объединён с NG-STRUCT-01):** `font-sans` на h2 только в ch.5 — объединено в NG-STRUCT-01. |
| NG-VIS-07 | 🆕 **Нагорная P2 (→ поглощено NG-DARK-01):** Потеря цветовой идентичности глав в dark — корневая причина: per-chapter CSS vars (NG-DARK-01) автоматически решает это. |
| NG-VIS-08 | 🆕 **Нагорная P2 (→ поглощено NG-DARK-01):** Контраст-дрейф ch.3 hero — корневая причина та же: NG-DARK-01 решает через правильные ремапы. |
| NG-DARK-04 | 🆕 **Нагорная P2:** `bg-rose-50` без dark-ремапа — 26 контейнеров (13 MainShell + 13 Sections) в ch.5 остаются #fff1f2 в тёмной теме. **Подтверждено cycle 4:** `bg-rose-50` ОТСУТСТВУЕТ в blanket `.bg-*-50` группе `mobile-hotfix.css` (перечислены 14 цветов, НО НЕ rose). Решение: per-chapter `var(--ng-accent-soft)`. Evidence: `evidence/NAGORNAYA_DEEP_DARK_THEME_AUDIT_2026-07-14.md` + `evidence/NAGORNAYA_DEEP_AUDIT_CYCLE4_2026-07-14.md` §5.2 |
| NG-DARK-05 | 🆕 **Нагорная P2:** `bg-stone-100/200` без dark-ремапа — 18 контейнеров остаются светлыми. Решение: ремап → `var(--color-surface-alt)`/`var(--color-surface-2)`. Evidence: `evidence/NAGORNAYA_DEEP_DARK_THEME_AUDIT_2026-07-14.md` + `evidence/NAGORNAYA_DEEP_AUDIT_CYCLE4_2026-07-14.md` §5.2 |
| NG-DARK-04 | 🆕 **Нагорная P2:** `bg-rose-50` без dark-ремапа — 13 контейнеров в ch.5 остаются #fff1f2 (светло-розовый) в тёмной теме. Решается через per-chapter `var(--ng-accent-soft)`. Evidence: `evidence/NAGORNAYA_DEEP_DARK_THEME_AUDIT_2026-07-14.md` |
| NG-DARK-05 | 🆕 **Нагорная P2:** `bg-stone-100/200` без dark-ремапа — 5 контейнеров (библиографии/итоги) остаются светлыми. Решение: ремап → `var(--color-surface-alt)`/`var(--color-surface-2)`. Evidence: `evidence/NAGORNAYA_DEEP_DARK_THEME_AUDIT_2026-07-14.md` |

| ID | Описание |
|---|---|
| AUDIT-ATLAS-DOC-PATH-LEAK | 🆕🔴 **DEPLOY-БЛОКЕР @ `2ca2af3b`** (2-й проход 07-14). `audit-pro.js` §14 (repository base-path leak) красный на 2 **новых** atlas-файлах: `docs/ATLAS-CONTRACT-2026-07-10.md` и `scripts/genealogy-build/README.md` (оба содержат `AuditRepo/projects/gb-is-my-strength/…`). Тот же класс, что D-7. Fix: заменить на repo-относительную/обобщённую ссылку. verified-source + verified-build |
| AUDIT-FORBIDDEN-JS-NAGORNAYA | 🆕🔴 **DEPLOY-БЛОКЕР @ `2ca2af3b`** (2-й проход 07-14) — **allowlist-gap, НЕ мёртвый код.** `audit-pro.js` помечает `js/nagornaya-bar-extras.js` как forbidden, но файл **реально используется** всеми 5 `nagornaya/chast-*` (подтверждено в `dist/nagornaya/chast-*/index.html` + `NagornayaChast*PageFooter.astro`). Гейт срабатывает корректно — устарел **allowlist** `ALLOWED_JS` (`audit-pro.js:52`). Fix: зарегистрировать файл в allowlist (НЕ удалять). verified-source + verified-build |
| AUDIT-CSS-NO-STRUCTURAL-PARSE | ✅ **RESOLVED (reverify 2026-07-14 @ `21624a3`).** Реализовано ровно как рекомендовано: `scripts/check-engine-contracts.js:135-140` гоняет `css-tree.parse({onParseError})` по 6 CSS-файлам как live-гейт (`npm run engine:contracts` — все ✅). Класс порчи теперь закрыт гейтом. Было: **Гейт-блайндспот (deep CSS-аудит 07-14).** Ни один CSS-гейт не парсит структуру: `audit-pro.js` проверяет только баланс `{}`, `validate.js` — 0 структурных CSS-проверок, `css-layer-validator.js` — только счётчик `!important`. Поэтому AUDIT-CSS-SITECSS-STRUCT-CORRUPTION (P1) прошёл незамеченным (как и историческая PR#42). Fix: добавить `postcss`/`css-tree` `parse()` с `onParseError`→fatal в `audit-pro` (обе либы уже в node_modules). Дешёвая проверка, закрывает целый класс. | verified-tooling; reverify 07-14 §CSS |
| AUDIT-CSS-DEAD-KEYFRAMES-TOKENS | 🆕 **Мелкая CSS-гигиена (deep-аудит 07-14; still-open reverify @ `21624a3` — `@keyframes fx-breathe` всё ещё ×2).** (а) `@keyframes fx-breathe` объявлен **дважды в одном `site.css`** (первое определение мёртвое); (б) 33 `--custom-prop` определены, но не используются (`--label`,`--ghost`,`--docked`,`--tg`,`--vk`,`--wa`,…). Не влияет на рендер; чистка. NB: проверка var-ов дала **0** реально-отсутствующих токенов (все имеют fallback/JS-set/`@layer base`) — ложных срабатываний нет. | verified-source (postcss AST) |
| AUDIT-CSS-GBFLOATER-DUP-MEDIA | 🆕 **Побайтный дубль правил (CSS/JS continued pass 6, reverify @ `21624a3`).** В `floating-cluster.css` селекторы `.gb-floater` и `html.dark .gb-floater` определены **идентично дважды** в двух разных блоках `@media (max-width:899px)` (стр.112≡665 [450 симв.] и 128≡682 [116 симв.]; postcss AST — тела совпадают побайтно). Второй блок дублирует первый — мёртвое повторение. Fix: слить блоки (снижает NEW-CSS-BUDGET-01). Прочие «дубли» селекторов по AST — легитимные оверрайды. | verified-source (postcss AST diff) |
| AUDIT-JS-ESCAPER-DUP-X5 | 🆕 **5 копий HTML-эскейпера (CSS/JS continued pass 6, reverify @ `21624a3`).** `js/site.js` содержит `function tt()` **×3** (три IIFE; две — цепочки `.replace()`, одна — вариант через lookup-таблицу `/[&<>"]/g`; вывод тот же, код разный) + `h()` в `highlights.js` + `F()` в `search.js` = **5 копий**. `js/site-utils.js` (дом общих утилит) эскейпера **не имеет** → каждый файл катит свой. Риск: копии дрейфуют — класс, породивший D-21 (рассинхрон эскейпинга глоссария). Fix: вынести один эскейпер в `SiteUtils` и ссылаться (дедуп 5→1). | verified-source (grep + AST) |
| AUDIT-CSS-FLOATCLUSTER-COMMENT-CORRUPTION | ✅ **FIXED-CURRENT (reverify 2026-07-14 @ `21624a3`).** floating-cluster.css перезалит (+406/−39); `/* ===` баннер-опенер восстановлен, css-tree: 0 битых селекторов, `.mobile-bottom-bar` парсится корректно; `engine:contracts` CSS-AST-гейт зелёный. Было: **2-й CSS-файл со структурной порчей (deep-аудит pass 4, 07-14).** `css/floating-cluster.css`: комментарии **несбалансированы 237 `/*` vs 236 `*/`**. Стр.1405 `/* ===` открывает, стр.1407 `/* ---` открывает второй (комментарии CSS не вложены) → первый закрывается на стр.1409 `*/`, поэтому правила `.gbs-rail-foot` (1410-1423) рендерятся, НО стр.1424-1426 («v15: MOBILE PREVIEW…» + `===== */`) — **голый текст** со stray `*/` без пары. Браузер (error-recovery) делает из него битый селектор, который **поглощает следующее правило** `[data-gill-v16] .mobile-bottom-bar{…}` (стр.1429) — css-tree подтверждает: 19 объявлений уходят в селектор «v15: MOBILE PREVIEW…». **Импакт (измерен, без переоценки):** из 19 потерянных свойств большинство (position/background/border-radius/box-shadow/backdrop-filter/padding) **переопределяются** более поздними правилами `.mobile-bottom-bar` (2786 @media и др.); реально теряются лишь `justify-content`/`font-family`/`font-size` → мелкий дрейф отступов/шрифта мобильного бара. Латентный риск: будущие правки блока 1429 молча не применятся. Pre-existing (b8459bdf тоже 198/197). Копируется в dist as-is. Гейт слеп (audit-pro только баланс скобок). Fix: восстановить `/*` на стр.1424 (обернуть баннер) + структурный CSS-парс (AUDIT-CSS-NO-STRUCTURAL-PARSE). | verified-source (css-tree recovery + comment-balance count); reverify 07-14 §CSS pass 4 |
| GATE-MARKER-DATA-DRIFT | 🆕 Системный риск: захардкоженные строки/значения в гейтах 4 раза за 05.07 расходились с работой параллельных лейнов (маркер pastor-series, зеркало timestamps, двойник precache-проверки audit-pro↔dist-publication-audit, label chast-2). Рекомендация: (а) выносить маркеры/списки в data/*.json рядом с контентом; (б) дедуплицировать двойные проверки через общий модуль (по образцу cache-bust-assets.js) | хроника 4 инцидентов 05.07 |
| VALIDATE-SCOPE-GAP | validate.js проверяет только `articles/` (10 страниц из 40+). baptisty-rossii, nagornaya, karty, konfessii, biografii, hard-texts — **не валидируются** checks #1-#17 (canonical, section, byline, img alt, internal links, quote policy) | Meta-audit |
| NEW-CSS-BUDGET-01 | 🔄 reverify 07-14: конкретика — `audit-pro` ⚠️ «Core CSS total **554013** bytes exceeds budget **425000**» (+30% над бюджетом; site.css 291КБ + floating-cluster 192КБ + home 82КБ доминируют). Не блокирует деплой, но постоянный warning. Кандидат: аудит мёртвых правил (см. AUDIT-CSS-DEAD-KEYFRAMES-TOKENS) + разбор дублей селекторов (floating-cluster 77, home 102 по AST) |
| NEW-OG-SIZE-PARAM | seo-audit.js hardcoded OG size check, нет per-route allowlist |
| AUDIT-P3-OG-LCP-MISMATCH | 4 routes: og:image ≠ LCP image |
| BUG-011 | 23 unique breakpoints, 768px collision |
| NEW-72 | SVG dedup micro-optimization (~1.9KB) |
| SHADOW-AUDIT-NARROW | `legacy-shadow-wrapper-audit.js` проверяет только 7/52 (13%) production-dist маршрутов. Не охвачены: все страницы статей, baptisty-rossii, karty (8 из 10), biografii, about, pastor-series, konfessii, rodosloviye. |
| AUDIT-PRO-SITEMAP-ROOT-ONLY | `publicFiles()` проверяет покрытие sitemap по `htmlPages` (root HTML). Если Astro-страница существует только в dist/ (без root-копии), её URL не попадёт в проверку покрытия — sitemap может недосчитаться страниц, а аудит пройдёт. |
| SEO-AUDIT-ROOT-ONLY | `seo-audit.js` исключает `dist/` из `walk()`. Astro-only страницы без root-копии невидимы для SEO-аудита: проверки canonical, og:image, JSON-LD, Twitter cards, FAQ, robots. Та же архитектурная проблема что AUDIT-PRO-ROOT-ONLY. |
| NG-TOC-01 | 🆕 **Нагорная P2:** TOC accent-number не per-chapter — `mobile-hotfix.css` hardcodes `var(--ng-toc-accent-2, #f59e0b)` (amber fallback). Решается через `var(--ng-accent)`. Evidence: `evidence/NAGORNAYA_DEEP_AUDIT_CYCLE4_2026-07-14.md` §8 |
| NG-CROSS-01 | 🆕 **Нагорная P3:** Кросс-главные цветовые утечки — 20+ экземпляров не-акцентных цветов: ch.2 text-purple-800 (Ipsissima vox), ch.4 text-emerald-700 ×8 (Concursus таблица), ch.5 text-blue-*/bg-emerald-*. Не ломает визуал сейчас, но затрудняет миграцию на CSS vars. Evidence: `evidence/NAGORNAYA_DEEP_AUDIT_CYCLE4_2026-07-14.md` §2.2 |
| NG-SERIYA-01 | 🆕 **Нагорная P3:** Seriya page без `bg-stone-100` на `<body>` — единственная из 9 nagornaya-страниц без него (есть `nagornaya-series-page`). Нужен `data-chapter` для CSS vars. Evidence: `evidence/NAGORNAYA_DEEP_AUDIT_CYCLE4_2026-07-14.md` §8 |
| NG-A11Y-01 | 🆕 **Нагорная P3:** Emoji вместо SVG иконок (18 секций: 10 ch.2 + 8 ch.5) — рендеринг зависит от ОС, не масштабируется; ch.2 секция VIII использует `#` вместо emoji; inline hero height `style="height:320px"` не адаптивен. Evidence: `evidence/NAGORNAYA_DEEP_AUDIT_CYCLE3_2026-07-14.md` + `evidence/NAGORNAYA_DEEP_AUDIT_CYCLE4_2026-07-14.md` §4.3 |
| NG-MOBILE-01 | 🆕 **Нагорная P3:** Мобильные dark-проблемы: body bg-stone-100 не ремапится (→ NG-BODY-01), TOC accent-number без chapter-specific цвета (→ NG-TOC-01), hero image inline height. Evidence: `evidence/NAGORNAYA_DEEP_AUDIT_CYCLE3_2026-07-14.md` + `evidence/NAGORNAYA_DEEP_AUDIT_CYCLE4_2026-07-14.md` §8 |
| NG-A11Y-01 | 🆕 **Нагорная P3:** Emoji вместо SVG иконок (19 секций ch.2/ch.5) — рендеринг зависит от ОС, не масштабируется; inline hero height `style="height:320px"` не адаптивен. Evidence: `evidence/NAGORNAYA_DEEP_AUDIT_CYCLE3_2026-07-14.md` |
| NG-MOBILE-01 | 🆕 **Нагорная P3:** Мобильные dark-проблемы: body bg-stone-100 не ремапится (→ NG-BODY-01), TOC accent-number без chapter-specific цвета, hero image inline height. Evidence: `evidence/NAGORNAYA_DEEP_AUDIT_CYCLE3_2026-07-14.md` |
| VALIDATE-JS-ARTICLES-ONLY | `scripts/validate.js` (`validateArticle()`) проверяет только `articles/*`. 9 baptisty-rossii статей (dva-sezda-1884…yuzhnaya-shtunda) НЕ проходят 17 проверок: canonical, byline, og:image, breadcrumb, author-card и др. `EXTRA_PAGES` = 4 страницы (pastor-series, biografii, about, index) — жёстко захардкожено. |
| AUDIT-PRO-ROOT-ONLY | `audit-pro.js` проверяет ТОЛЬКО root HTML (`walk(ROOT)`, `dist/` в skipDirs). `/izbrannoe/` (Astro-only, без root-копии) невидим для 7 гвардов: canonical, sitemap, SEO, cache-bust, JSON-LD, links, a11y. При `astro build` в dist/ генерируются 54 страницы — аудит проверяет только 50 root HTML. |
| STRANGLER-HYGIENE | 50/53 Astro-маршрутов имеют дублирующийся legacy HTML в корне репо (работает корректно через page-ownership, но техдолг). |
| D-3 | 🔄 reverify 07-14 (pass 4): JS total **469101** > 365000 (было 375041 — вырос ~94КБ на atlas/TTS/mobile); **CSS-бюджет БОЛЬШЕ НЕ в норме** — Core CSS **554013** > 425000 (см. NEW-CSS-BUDGET-01). Оба — ⚠️ warning (не блокируют деплой). `audit-pro.js` |
| D-4 | Magic z-index: `floating-cluster.css:2372/2447/2504/2697/2882`, `mobile-hotfix.css:129` — hardcoded `2102 !important`/`9999 !important` вместо `var(--z-max)`. ⚠️ `--z-*` токены **НЕ ОПРЕДЕЛЕНЫ** в проекте (см. AR-IDX-CSS-01 P1) — фикс D-4 требует определить токены сначала, потом заменить hardcoded. (⚠️ PremiumControls in-flight — согласовать) |
| D-7 | ⬇️ Downgraded (reverify 2026-07-08): строка 3 `PremiumControlAnchor.astro` — репо-**относительная** ссылка на doc (`AuditRepo/projects/.../PremiumControls/README.md §1`), а не абсолютный внутренний путь/секрет → фактически безобидно. Косметика: убрать ссылку при случае |
| D-8 | `deploy.yml paths:` не включает `*.md` (doc-only не триггерит деплой; by-design пока Markdown не публичный вход, см. SUPER_AUDIT W4) |
| NF-DEAD-ENHANCE-SHIM | 🆕 reverify 07-09: `enhanceGillMobileBarMarkup` мёртв для прода (bail :986 — все prod-страницы уже v4); тело (988-1047) строит `.mobile-btoc-meter`/`.mobile-icon-row`, чей CSS удалён `30bf3f5c`. Автор отложил в follow-up. `floating-cluster-controller.js:973-1048`. verified-source |
| NF-SPEEDSLOT-4TH-COPY | 🆕 reverify 07-09: дедуп speed-slot 3-из-4 — `GillSeriesRail.astro:209` держит собственный inline `initGillRailSpeedSlot`, не импортит `_shared/speedSlot.ts` (как 2 мобильных бара + HermenevtikaRail). Рефактор-мелочь. verified-source |
| NF-GATE-IZ5-STALE | 🆕 reverify 07-09 (инстанс GATE-MARKER-DATA-DRIFT): гейты хардкодят запрещённый маркер «Часть 1 из 5» (`premium-controls-rollout-audit.js:210`, `gill-v16-mobile-play-smoke.js:253`), но части теперь рендерят «из 3» → guard проходит вакуумно, пропустит будущий miscount. Fix идёт вместе с выносом счётчиков в data/. verified-source |
| NF-STRANGLER-BAR-DRIFT | 🆕 reverify 07-09 (конкретика STRANGLER-HYGIENE): корневой legacy-HTML Гилла = старый 1-уровневый мобильный бар (`#mobTocBtn`, без `__label`) vs v4 в astro. Production-dist → не отдаётся, но дрейфует. verified-source |
| NEW-VOSK-DEAD-SPLITSENTENCES | 🆕 reverify 07-09: мёртвый экспорт `splitSentences` (`vosk-tts-core.js:413,446`) — контроллер использует свой `splitTtsChunks`. verified-source |
| NEW-HARDTEXTS-CSP-MISSING-HFCDN | 🆕 reverify 07-09: `hard-texts/index.astro:122` connect-src без `*.aws.cdn.hf.co` (единственный astro-файл без него из 37). Инертно — на hard-texts нет кнопки Listen; выровнять для консистентности. verified-source |
| NG-VIS-09 | 🆕 **Нагорная P3:** «Из библиотеки» на inline-стилях вместо Tailwind — не адаптивно к тёмной теме, дублируется в 5 файлах. Evidence: `evidence/NAGORNAYA_VISUAL_AUDIT_2026-07-14.md` |
| NG-VIS-10 | 🆕 **Нагорная P3:** Библиография не использует ref-*/ref-card систему site.css (ad-hoc markup). Evidence: `evidence/NAGORNAYA_VISUAL_AUDIT_2026-07-14.md` |
| NG-VIS-11 | 🆕 **Нагорная P3:** Захардкоженные `#b8882a`/`#8a7968` в «Из библиотеки» лейбле — не адаптированы к тёмной теме. Evidence: `evidence/NAGORNAYA_VISUAL_AUDIT_2026-07-14.md` |
| NG-VIS-12 | 🆕 **Нагорная P3:** Устаревшая версия «v4.0 · Апрель 2026» в футере всех 5 частей. Evidence: `evidence/NAGORNAYA_VISUAL_AUDIT_2026-07-14.md` |
| NEW-HIGHLIGHTS-NO-REINIT-GUARD | 🆕 reverify 07-09 *(suspected)*: `highlights.js` IIFE без re-init guard — двойной `<script>`-include продублирует FAB + глобальные mouseup/keydown/scroll/resize. Низкий риск (статический include). |
| NEW-SAVE-QUOTE-TIMER-RACE | 🆕 reverify 07-09 *(suspected)*: кнопка «Сохранить цитату» инжектится одноразовым таймером 500ms (`highlights.js le()`); если `#selection-share-popup` не в DOM на +500ms — не добавляется и не ретраится. Зависит от порядка init. |
| NEW-VOSK-FETCH-NO-ABORT | 🆕 reverify 07-14 (verified-source `2ca2af3`): 280MB model `fetch(MODEL_URL)` not wired to AbortController; continues after navigation/opt-out. `js/vosk-tts-engine.js:166`. Reported by claude-auditor 07-09, confirmed 07-14. |
| AR-AUDIT-17 | 🆕 reverify 07-14 (verified-source `2ca2af3`): `validate:all` fails with 2 inline script syntax errors in `scripts/genealogy-build/atlas-template.html` and `interactive-template.html`. Genealogy build templates — not production code, but gate regression. |
| NG-DARK-01 | 🆕 **Нагорная P1 (корневая):** 54 Tailwind-класса без dark-ремапа — `text-{accent}-600` (165×), `text-{accent}-700` (75×), `text-amber-800` (7×), `border-stone-100` (52×), `bg-rose-50` (13×), `bg-stone-100/200` (5×). Текущий ремап в `mobile-hotfix.css` покрывает только -800/-900 уровни; -500/-600/-700 не покрыты → невидимый текст и потеря идентичности глав. **Профессиональное решение:** per-chapter CSS custom properties (`--ng-accent`/`--ng-accent-soft`) + `data-chapter="N"` на body → одно решение закрывает 8 багов. Evidence: `evidence/NAGORNAYA_DEEP_DARK_THEME_AUDIT_2026-07-14.md` |
| NG-STRUCT-01 | 🆕 **Нагорная P1:** Сломанная структура заголовков секций — ch.2/SectionX, ch.5/SectionI–IV/X не имеют `<div class="group mb-6 mt-12">` обёртки (нет иконки, подзаголовка, отступа). Регресс Astro-миграции. + Emoji вместо SVG (19 секций ch.2/ch.5) + `font-sans` на h2 (4× ch.5). Evidence: `evidence/NAGORNAYA_VISUAL_AUDIT_2026-07-14.md` + `evidence/NAGORNAYA_DEEP_DARK_THEME_AUDIT_2026-07-14.md` |
| NG-INLINE-01 | 🆕 **Нагорная P1:** «Из библиотеки» блок — inline `color:#1c1410`/`#8a7968`/`#b8882a`/`background:#faf8f5` на всех 5 частях, дублирование 5×. CSS override не пробивает inline `style=`. **Решение:** Astro-компонент `NagornayaLibraryLinks.astro` + Tailwind + CSS vars. Evidence: `evidence/NAGORNAYA_DEEP_DARK_THEME_AUDIT_2026-07-14.md` §NG-INLINE-01 |
| AR-IDX-04 | Ссылка «★ Избранное» в десктопном навбаре Astro потеряла класс `h-nav-fav` (legacy имеет). | `incoming/arena-auditor-index/2026-07-14/REPORT.md` §1 |
| AR-IDX-05 | `SITE_CONFIG.version: 1778943682` хардкод, query-строки `?v=...` хардкод. Stale cache на проде при изменении файла. | `incoming/arena-auditor-index/2026-07-14/REPORT.md` §1 |
| AR-IDX-06 | `<div class="h-reading-progress">` рендерится всегда, но `features.readingProgress.enabled: false`. | `incoming/arena-auditor-index/2026-07-14/REPORT.md` §1 |
| AR-IDX-07 | `<h1 tabindex="-1">` без фокус-менеджмента — skip-link ведёт на `<main>`, не на h1. | `incoming/arena-auditor-index/2026-07-14/REPORT.md` §1 |
| AR-IDX-08 | ~25 inline `style=` в Astro-компонентах (Publications, Planned, Quote) вместо CSS-классов. | `incoming/arena-auditor-index/2026-07-14/REPORT.md` §1 |
| AR-IDX-10 | CSP различается между legacy и Astro (cdn.jsdelivr.net добавлен, не синхронизирован). | `incoming/arena-auditor-index/2026-07-14/REPORT.md` §1 |
| AR-IDX-A11Y-01 | Карточки-ссылки без `:focus-visible` стилей, с inline `style="text-decoration:none;cursor:pointer"`. | `incoming/arena-auditor-index/2026-07-14/REPORT.md` §1 |
| AR-IDX-CSS-02 | `.home-v20 { overflow-x:hidden }` клиппит абсолютный `.h-scripture-bg` (фоновые цитаты). | `incoming/arena-auditor-index/2026-07-14/REPORT.md` §1 |
| AR-IDX-CSS-03 | `.h-reveal:not(.h-in)` — 3s fallback анимация: если IntersectionObserver не сработал, юзер ждёт 3 сек. | `incoming/arena-auditor-index/2026-07-14/REPORT.md` §1 |

## 🔵 P3 — РЕФАКТОРИНГ (4)

| ID | Описание |
|---|---|
| R-001 | site.js монолит ~167KB (15 модулей) |
| R-002 | enhancements.js монолит ~48KB |
| R-003 | Нет source maps |
| R-004 | Нет type="module"/tree-shaking |

## 🟣 AUDITREPO (4)

| ID | Описание |
|---|---|
| AR-001 | validate_audit_repo.py hardening |
| AR-004 | verification protocol automation |
| AR-005 | reverify automation |
| AR-006 | ✅ **CLOSED 2026-07-14**: ALLOWED_ROOT_DIRS/FILES в validate_audit_repo.py (verification/ и references/ узаконены — atlas-трек и UI-канон); первый же прогон поймал и выселил корневой passes/ → projects/gb-is-my-strength/passes/. | REPORT §1 + fix-verify (оба валидатора PASS) |

> ✅ **AR-CI-RED — ЗАКРЫТ 2026-07-14** (governance, не баг source-репо): `origin/main` был на 581 коммит впереди (параллельные агенты, atlas-верификация), но **AuditRepo CI (`validate_audit_repo.py`) был красный**: (1) stray root `DEBT-REGISTER.md`; (2) intake `claude-atlas-deep-audit/2026-07-10` без `README.md`/`REPORT.md`; (3) intake-папка `claude-genealogy-atlas-strategy/2026-07-14-milestone-atlas-v1` с невалидным именем даты. Починено **минимально и без удаления чужого контента** (CLEANUP §7): `git mv` root-файла в `working/`, additive-`README.md` в 2026-07-10 intake, `git mv …/2026-07-14-milestone-atlas-v1 → …/2026-07-14-r1` + preservation-note. Оба валидатора PASS. Урок для параллельных агентов: гонять `validate_audit_repo.py` **до** пуша. Детали: `reverify/CURRENT_HEAD_REVERIFY_2026-07-14_2ca2af3b.md` §AR-CI-RED.

---

## Примечания

### Дубликаты (объединены):
- **BUG-ARCH-001** = **AUDIT-P2-SW-PRECACHE-4** (одна суть: SW precache содержит lazy assets). Оставлено оба ID для обратной совместимости с reverify-документами.
- **NEW-CACHE-BUST-ASTRO** закрыто (`6499d42e`), но **AUDIT-P3-SEARCH-LAZY-CONFIRMED** и **AUDIT-P2-SW-PRECACHE-4** описывают ту же тему SW/lazy — не дубликаты, разные root causes.

### Severity dispute: BUG-SW-BASELINE-DRIFT — RESOLVED → P2 (2026-07-05)
- **Pass 91 (agent):** P2 — "документационный drift, SW корректен, CI осознанно note()"
- **Pass 92 (agent):** P0 — "CI не фейлится при --require-cache-bump, deploy-safety gap"
- **Решение (владелец делегировал; reverify 07-05):** P2. Гейт энфорсит только «≠ pre-switch v171» (`sw-dist-readiness-audit.js:82-89`), `currentExpectedCacheVersion` — note(). Фикс: bump baseline v182→v187 + строгое равенство под `--require-cache-bump`.

### Dispute resolution: P1-DEPLOY-FAIL — остаётся ЗАКРЫТ (false reopen, 2026-07-05)
- Intake `arena-agent-verifier-hardening-2026-07-05` и `working/VERIFIER_SYNTHESIS` считали reopened по grep-хиту `conclusion == 'failure'` в deploy.yml.
- **Reachability-анализ на `68b2bf4c`:** job-level `if:` (deploy.yml:62-65) пускает только success/dispatch/push → при failure job скипается. Хит — в недостижимом warn-шаге (deploy.yml:72-75, dead code). См. DEPLOY-YML-DEAD-WARN-STEP (P3) и `reverify/CURRENT_HEAD_REVERIFY_2026-07-05_content-parity-loss-restored.md` §4.

### False positives (отклонённые находки):
- `AUDIT-P2-NODE-REGEX` — fabricated evidence (функция mustScript не существует). Archive: `archive/false-positive/`
- `AUDIT-P3-REACT-UNDOCUMENTED` — React IS used. Archive: `archive/false-positive/`
- `BUG-ASTRO-CONFIG-001` (Pass 88) — downgraded to INFO.
- `BUG-SITEMAP-8-KARTY-MISSING` — 8 karty/ routes are temporary placeholders with `data-pagefind-ignore`, intentionally excluded from sitemap by `check-map-publication-status.js`.
- `BUG-FRONTMATTER-INCONSISTENCY-01` — Zod schema uses `.default(false)` / `.default(true)`. Omitting fields is valid, not inconsistency.
- `AUDIT-PRO-VM-DEPRECATED` / `VALIDATE-JS-VM-DEPRECATED` — **опровергнуто живым тестом 2026-07-09.** `new vm.Script(...)` на текущем рантайме (Node **v22.22.2**) под `node --pending-deprecation` даёт **0 предупреждений**. Deprecated — другая, более старая функция `vm.createScript()`, а не класс `vm.Script`/`new vm.Script()` (это актуальный, не устаревший API). Оригинальная находка не была прогнана на живом рантайме до фиксации claim'а. Обе строки сняты с P3-open.

### Архив:
- 36 incoming pass-папок → `archive/2026-07-05-incoming-consolidated/`
- Предыдущая 2174-строчная матрица (вкл. PASS-evidence секции) → `archive/2026-07-04-stale-matrix/MASTER_BUG_MATRIX_FULL_2026-07-03.md`
- ⚠️ Прежние ссылки на `archive/2026-07-05-matrix-pre-restructure/` и `archive/2026-07-05-pass-evidence/` были битыми (папки не существовали) — исправлено 2026-07-06.

### Archive-candidates (incoming/, superseded — к переносу в `archive/stale/` следующей чисткой):
> Инвентаризация incoming/ 2026-07-09 (без физического переноса — evidence-трейлы, чтобы не конфликтовать с активными агентами). Все — evidence уже-обработанных находок:
- `incoming/arena-agent-verifier-hardening-2026-07-05/` — reopen-claim P1-DEPLOY-FAIL признан false (см. выше §Dispute); содержал AR-014, теперь закрыт governance-сессией 07-09.
- `incoming/fable-super-audit/2026-07-06/` — влит в `SUPER_AUDIT_2026-07-06_14a49be8.md`; позитивные cycle2/3-заявления отозваны.
- `incoming/arena-agent-karty-visual-baseline-*/` — вытеснен `arena-agent-karty-*-v3-deep-audit` (12/75 VB отозвано ground-truth Playwright).
- `incoming/arena-auditor/2026-07-06/RESEARCH_gill-*` — контент перенесён в `FedorMilovanov/Research`; остались заглушки.
> Karty-технический кластер (KARTY-03/04/05/07/11/14, addEventListener-leaks, GSAP-CDN, JS-CSS-инъекция) — **НЕ archive**: реальные, но долгострой karty-Atlas, ведётся отдельно. Q-BUG P0 из этого интейка — закрыт (см. KARTY-Q-BUG-P0).

---

## Статистика (обновлено 2026-07-19: глубокий аудит раздела карт /karty/ +81 открытых багов: 15 P0 + 60 P1 + 10 P2)

| Категория | Количество |
|---|---|
| Закрыто (fixed) | 94 |
| **P0 открыто** | **20** |
| P1 открыто | 71 |
| P2 открыто | 33 |
| P3 открыто | 45 |
| Рефакторинг | 4 |
| AuditRepo | 3 |
| **Всего открыто (матрица)** | **176** |
| Системный бэклог вне матрицы | см. `SUPER_AUDIT_2026-07-06_14a49be8.md` (волны W1–W10; **W1 on fire**) |
| False positives отклонено | 5 |
| Passes processed | 97+ (reverify 2026-07-19 @ c2c339708252, karty-deep-audit-2026-07-19) |

---

## Session log (append-only)

> Сюда идут per-session заметки о HEAD-переходах и что влито — **чтобы мастхед оставался
> чистым статусом**. Новое — сверху. Детали каждого HEAD — в парном `reverify/` доке.

- **2026-07-19 — Персональная верификация карт (arena-auditor-karty-verification @ HEAD 32ae0d7d).** Строго верифицированы все 31 открытых находок на актуальном HEAD `main`. Найдено подтверждающее строчное свидетельство (`map-engine.js:919` `getState`, `map-engine.js:863` `inStory`, `map-engine.js:2621` forced `flyTo`, `map-engine.js:1037` scale bar math, `map-engine.js:1817` archaeology footer pollution, `avraam/index.html:1063` rotate overlay). Оформлены интейк `incoming/arena-auditor-karty-verification/2026-07-19/` и `reverify/CURRENT_HEAD_REVERIFY_2026-07-19_karty_deep_audit.md`.

- **2026-07-19 — Глубокий визуальный и функциональный аудит раздела карт (/karty/).** Verified intake from `incoming/karty-deep-audit-2026-07-19/2026-07-19/` on commit `c2c339708252`. Registered 31 open findings: 8 P0 blockers (`MAP-P0-01`..`MAP-P0-08`), 20 P1 findings (`MAP-P1-01`..`MAP-P1-14`, `AVRAAM-P1-01`..`AVRAAM-P1-05`, `KARTY-DATA-P1-01`), 3 P2 findings (`AVRAAM-P2-01`, `HUB-P2-01`, `GATE-P1-01`). MapEngine v0.53 and holding maps are confirmed non-production-ready until P0/P1 repair lanes land.

- **2026-07-14 (CSS/JS continued, pass 6) — arena-auditor-meta-governance @ `21624a3`.** Подстроился под
  актуальный main (сброс на `abb49d8`, source ушёл `2ca2af3b`→`21624a3`, +40 коммитов). **Реверифай
  моих CSS-находок:** `AUDIT-CSS-SITECSS-STRUCT-CORRUPTION` → **FIXED** (postcss/css-tree 0 ошибок, @912ffe3),
  `AUDIT-CSS-FLOATCLUSTER-COMMENT-CORRUPTION` → **FIXED-CURRENT** (floating-cluster перезалит +406/−39, баннер-
  `/*` восстановлен, 0 битых селекторов), `AUDIT-CSS-NO-STRUCTURAL-PARSE` → **RESOLVED** (другой агент
  реализовал ровно рекомендацию — `check-engine-contracts.js` гоняет `css-tree.parse` по 6 CSS как live-гейт,
  зелёный). **Ещё открыто (заведено):** `AUDIT-CSS-GBFLOATER-DUP-MEDIA` (`.gb-floater` побайтно дублируется
  в 2 `@media(max-width:899px)`, стр.112≡665/128≡682) + `AUDIT-JS-ESCAPER-DUP-X5` (5 копий HTML-эскейпера,
  site-utils пуст). Net P3-open: +2 новых − 2 fixed = 0 (счётчики не двигаю). Source НЕ трогал. Evidence:
  `incoming/arena-auditor-meta-governance/2026-07-14/evidence/css-js-continued-pass6-2026-07-14.txt`.
- **2026-07-14 — HEAD reverify `b8459bdf` → `2ca2af3b` (+287 commits); deploy RED/STALE.**  
  Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-14_2ca2af3b.md`, intake `incoming/arena-auditor-head-reverify/2026-07-14/`.  
  **Prod:** last GREEN `007b67def5` (2026-07-11); HEAD deploy fail Static publication gates; IndexNow fail editorial registry.  

- **2026-07-14 — Нагорная проповедь visual audit (arena-auditor).**  
  Full visual audit of `/nagornaya/chast-1/` … `/chast-5/` — 12 bugs found.  
  **P1 нагорная (консолидировано):** NG-DARK-01 (54 Tailwind-класса без dark-ремапа — корневая), NG-STRUCT-01 (сломанные заголовки + emoji + font-sans), NG-INLINE-01 («Из библиотеки» inline-стили). 
  **+5 P2:** NG-VIS-04 (8 table-only sections), NG-VIS-05 (dead reveal class), NG-VIS-06 (font-sans ch.5 only), NG-VIS-07 (dark theme color flattening), NG-VIS-08 (contrast drift in ch.3 hero).  
  **+4 P3:** NG-VIS-09–12 (inline styles, bibliography, hardcoded colors, stale version).  
  Evidence: `incoming/arena-auditor/2026-07-14/evidence/NAGORNAYA_VISUAL_AUDIT_2026-07-14.md`.

- **2026-07-14 — INDEX page deep audit (arena-auditor-index).** Полный source-level аудит INDEX: `src/pages/index.astro`, 12 home-компонентов, legacy `index.html` baseline, CSS/JS. **17 findings:** P1 — AR-IDX-CSS-01 (18 `--z-*` CSS vars undefined — stacking INDEX сломан), AR-IDX-01/02 (hreflang + SearchAction SEO регрессии); P2 — AR-IDX-JS-02 (theme пишет в 3 localStorage ключа), AR-IDX-PERF-01 (LCP decoding=async + 5 CSS), AR-IDX-PERF-02 (30+ fonts), AR-IDX-JS-01 (pagehide на iOS), AR-IDX-03/09 (⌘K + altKey); P3 — 10 minors. D-4 исправлено. Evidence: `incoming/arena-auditor-index/2026-07-14/`.

- **2026-07-14 — Нагорная deep dark-theme audit cycle 2 (arena-auditor).**  
  Углублённый анализ: найдена **корневая причина** — `mobile-hotfix.css` покрывает только -800/-900 уровни Tailwind, оставляя 54 класса без dark-ремапа (165× text-600, 75× text-700, 52× border-stone-100, 13× bg-rose-50).  
  **Консолидация P1:** NG-DARK-01 (корневая), NG-STRUCT-01 (объединены: заголовки + emoji + font-sans), NG-INLINE-01 (Astro-компонент + CSS vars).  
  **+2 P2:** NG-DARK-04 (bg-rose-50), NG-DARK-05 (bg-stone-100/200). NG-VIS-06/07/08 поглощены NG-DARK-01.  
  **Professional solution:** `data-chapter="N"` + `--ng-accent`/`--ng-accent-soft` custom properties — без `!important`.  
  Evidence: `incoming/arena-auditor/2026-07-14/evidence/NAGORNAYA_DEEP_DARK_THEME_AUDIT_2026-07-14.md`.

- **2026-07-11 — Контентный аудит двух серий («Тайны сердца» + Джон Гилл) по внешней спецификации + восстановление красного деплоя.**
  Прогон по фактическим/богословским дефектам контента (класс, ранее в матрице отсутствовавший — были только UI/infra). Все правки во всех трёх слоях (Astro-пилот = прод + MDX-твин + legacy HTML), паритет сохранён; deploy-mirror gates зелёные локально.
  - **Серия Гилла:** P0-факты — Макритчи (перевёрнутый вывод диссертации исправлен), SBJT «современный консенсус» → «сборник конкурирующих интерпретаций», эпиграф «само по себе не гиперкальвинистское» → двусторонняя историография, Christmas Evans (MDX «Рождеством» → «Кристмасом»). Новые системные разделы в Части II «Учёный»: **пневматология** (Дух-Применитель — освящение/монергизм/свидетельство, BDD ch.14 «Of Sanctification» + Exposition Rom 8, Level A) и **христология** (две природы, communicatio idiomatum, отвержение буквального descensus ad inferos, BDD Book VI, Level A).
  - **Серия «Сердце»:** P0-точность флагмана (ʾānûš без «терминальной патологии»; убрана апелляция к семинарии как доказательству лексики; каламбур ʿāqōb/Иаков смягчён; бинарность ВЗ/НЗ снята) + пасторская объективность (совесть, «четыре голоса» → пересекающиеся паттерны, Мэнтон в контексте, «острая совесть» без перегиба) + **меланхолия/скрупулёзность** (Тимоти Роджерс 1691, verbatim Level A; достаточность Писания не отрицает медпомощь) + заветные корни нового сердца (Втор. 30:6; Иер. 24:7). Рим. 7: греческая лексика (σάρκινος/πεπραμένος/настоящее время/внутренний человек/7:25b) + ранний/поздний Августин.
  - **D-19 (частично закрыт):** rimlyanam-7 `<title>` приведён к каноническому (совпал с og:title/twitter/JSON-LD headline). Второй адрес (`20-antisovetov-pastoru`) — вне серий данного аудита, остаётся открытым (см. строку D-19).
  - **🔴 Восстановление деплоя (реальный баг, не мой):** prod-деплой main был КРАСНЫМ ~08:20–08:55 UTC (runs 4506c3d/399fad7/3daf2926 — failure). Concurrent-лейны (#81/#82 mobile reader, gill quiz CBM) изменили shared-ассеты (`site-utils.js`, `floating-cluster.css/.js`) без полного cache-bust; гейт «Static publication gates» (audit-pro) падал на рассинхроне `?v=hash` в `nagornaya/*`, `pastor-series/*` и др. **Системная находка (candidate P2/P3):** ни один workflow не делает `cache-bust --write`+commit — `indexnow.yml`/`editorial-metadata-v3.yml` только ПРОВЕРЯЮТ (без записи), `deploy.yml` шаг cache-bust помечен «skip if IndexNow already did it» → no-op; значит запись ревизий это ответственность пушащего, и concurrent-пуши без неё оставляют main красным для всех. Починено коммитом `9fce2bc` ([SYSTEM] cache-bust — регенерация asset-ревизий по всему сайту); деплой разблокирован. Follow-up (owner-decision, правка пайплайна): добавить `cache-bust --write` + auto-commit в metadata-workflow, чтобы concurrent asset-дрейф не блокировал деплой.

- **2026-07-10 — Контрольная перепроверка (control re-verification), source → `b8459bdf`, deploy GREEN `29065454930`.** Тотальный re-check всей сессии нашёл и починил РЕАЛЬНЫЕ дефекты (первый проход их пропустил): (1) **CI-INDEXNOW-CHECKER-STALE** — `check-workflows.js` требовал `contents: write` у read-only `indexnow.yml`; исправлен чекер (→`contents: read`) + восстановлен `baptisty-rossii/**` path (PR#70, `3a43cada`). (2) **2 user-visible Gill-дефекта** от непроброшенного Часть IV: sibling-страницы (I/II/Наследие) говорили «Трилогия/три текста» и рендерили 3 карточки без новой «Экзегет»; biografii-карточка nasledie тегнута «Часть III» (надо IV); home-кикер «Трилогия». Починено во всех 3 слоях (Astro+MDX+legacy HTML, паритет сохранён), PR#71 (`b8459bdf`). (3) **auditrepo SSOT-остатки**: README+NEXT_AGENT всё ещё дублировали устаревшие счётчики → ссылки на матрицу; closed-count 95→94 (унаследованный off-by-1). ⚠️ **Урок среды:** локальные checkout'ы обоих репо молча откатывались на container-reset — всегда `git fetch && reset --hard origin/main` перед доверием локальному состоянию.
- **2026-07-09 — Gill Часть IV «Экзегет» + rail + doc-governance (source → `7a410be9`, deploy GREEN `29058726462`).**
  Влито: PR#67 (`eca5dcc9`) Часть IV «Экзегет» + сворачиваемый rail + логический реордер
  III↔IV; PR#68 (`1491fbb2`) hotfix rail-CSS scope-leak (мердж PR#67 уронил деплой на
  `audit:premium-controls` 97/98); PR#69 (`7a410be9`) hotfix устаревшего deploy-only
  smoke-теста (`gill:mobile-play:smoke`: play-ember переехал в `.gbs-theme-corner`,
  серия-константы не знали про Часть IV — оба масковались более ранним падением).
  **Прод-деплой подтверждён зелёным** (run `29058726462`, все шаги success). Записано 4 закрытия
  (вкл. задним числом KARTY-Q-BUG-P0 — был фикс `f7e9696`, не было строки), VM-DEPRECATED
  ×2 → false-positive (живой Node-тест). Governance: добавлен `DOC_MAP.md` (Single-Writer-
  Per-Fact), мастхед матрицы переведён из changelog в статус-блок, `PROJECT_REGISTRY`/
  `README`/`START_HERE` перестали переписывать HEAD/счётчики. Закрывает дрейф-находку
  AR-014. Инвентаризация `incoming/`: ценные находки (Q-BUG, дефолтный TTS-голос) уже
  были починены, но не отмечены — теперь отмечены; остальное — karty-Atlas (долгострой)
  и owner-gated визуал.
- **2026-07-09 — Фаза 2, стек `native-source-contract-v1` (deploy green `fc4b6326`).**
  `route-migration-matrix.json` стал производным (page-ownership + route-profiles; режимы
  8→3), registry-driven чекеры заменили прямые (оригиналы → `scripts/legacy-audits/*`),
  editorial-freeze baseline `data/editorial-metadata.json`. Закрыто AUDIT-P2-MATRIX-DRIFT.
  При интеграции лейны уронили `/karty/*` (david/isus вместо 11) — поймано контрактом,
  регенерировано. AGENTS.md синхр. (r323). Ещё открыто: NF-SPEEDSLOT-4TH-COPY + хвост P3.
- **2026-07-09 — reverify (claude-auditor), source `75f807b` → `2313f36f`.** Delta:
  mobile-bar v4 + speed-slot dedup, Hermenevtika rail rework, Gill premium images, quotes
  FAB. Runtime SOLID (0 P0/P1 в дельте). +8 P3 (хвост). Evidence:
  `reverify/CURRENT_HEAD_REVERIFY_2026-07-09_head-2313f36f-149-commit-delta.md`.
- **2026-07-06 — fable-super-audit, source `75f807b` (deploy green `28829729903`).** D-23
  RESOLVED (`3280445`), продакшн больше не заперт на `14a49be8`. D-строки arena влиты в
  канонические таблицы, счётчики пересобраны, системный бэклог → SUPER_AUDIT (W1–W10).

---

## 🔴 AUDITOR / ARENA — 2026-07-06 (independent auditor, Node v22.12.0) — ИСТОРИЧЕСКИЙ ЛОГ

> ℹ️ **2026-07-06 fable-super-audit:** открытые D-строки из этой секции ВЛИТЫ в канонические таблицы P2/P3 выше и в счётчики. Секция сохранена как evidence-лог интейка. Позитивные заявления cycle2/3 («/izbrannoe/ чист», «TTS надёжен», «SW-дефект не подтверждён») **ОТОЗВАНЫ** — опровергнуты верификацией (см. `SUPER_AUDIT_2026-07-06_14a49be8.md` §1 и `incoming/fable-super-audit/2026-07-06/REPORT.md` §3).

**Объект:** `main` @ `14a49be83ab57212c0bbd26a8249b75ac026511d` (Merge PR #48). Полные отчёты: `incoming/arena-auditor/2026-07-06/AUDIT_gb-main_e044908e_2026-07-05.md` и `incoming/arena-auditor/2026-07-06/AUDIT_gb-main_14a49be8_2026-07-06.md`.

**Метод:** локально Node 22 + `npm ci`, статические гейты (`audit-pro.js`, `css:layer:validate`, `data:consistency`, `gill:series:data:consistency:audit`, `native:runtime:audit:strict`, `migration:metadata:check:strict`, `validate:all`, visual-parity audits) — все PASSED. Браузерные гейты и Pages-публикация проверены через GitHub API (CI run-логи). Полный `strangler:build:production-like` локально OOM (exit 137, ~1 ГБ при нужных ~2 ГБ) — см. `docs/SANDBOX-ENV-2026-06-21.md`.

### Вердикт
- 🔴 **Продакшн STALE.** Последний успешный деплой — `e044908e` (2026-07-05T19:27Z). С тех пор **4 попытки подряд failed/cancelled**: PR #45 `55a7d437e`, PR #46 `2e760e746`, cache-bust `5704924ab`, HEAD `14a49be8` (`28758726417`). В окне последних 40 прогонов — 0 успешных деплоев. Фичи PR #45–#48 (3D-tilt `/izbrannoe/`, Писание в глоссарии, Bible-tooltip, TTS/kinetic numeral, SW baseline gb-v189) **НЕ на продакшне**.
- 🟠 HEAD `14a49be8` проходит **ВСЕ quality-гейты** (Static gates, Build, Pagefind, Gill submenu audit, Gill mobile layout, dist-smoke, content coverage 50/50, **SW readiness ✅ CACHE_VERSION=gb-v189 matches baseline**), но деплой падает на шаге **«Deploy to GitHub Pages»** (`error_count: 10`, `timeout: 600000` → «Deployment failed, try again later»). Баг НЕ в коде — нужен перезапуск деплоя.
- 🟢 Локальные гейты (Node 22) — все PASSED. **CSS-бюджет теперь в норме** (предупреждение исчезло vs `e044908e`); JS total 375041 > 365000 (превышен).

### Найденные проблемы (аудиторские D-*)

| ID | Sev | Описание | Статус | Evidence |
|---|---|---|---|---|
| D-17 | 🔴→✅ | Продакшн STALE (4 failed/cancelled деплоя подряд) — RESOLVED: HEAD `14a49be8` задеплоен run `28794737410` (workflow_dispatch, 2026-07-06T13:22Z, success) | RESOLVED (2026-07-06) | CI runs 28756822942 / 28757603646 / 28758340460 / 28758726417 → 28794737410 success |
| D-18 | 🟠→✅ | HEAD-деплой зелёный по гейтам, но падал на «Deploy to GitHub Pages» (infra/timeout, error_count 10) — RESOLVED: перезапуск (run `28794737410`) успешен | RESOLVED (2026-07-06) | run 28758726417 (`error_count: 10`, `timeout: 600000`) → 28794737410 success |
| D-1 | 🟠 Med | `concurrency: cancel-in-progress` губит push-деплои; публикация держится на цепочке `workflow_run` (IndexNow→deploy) | OPEN (carry-over) | `deploy.yml:50-52` |
| D-2 | 🟠 Med | css-layer-validator: (1) заголовок обещает «проверку порядка @layer», но код проверяет ТОЛЬКО необъявленные слои (порядок не энфорсится); (2) порог предупреждения `< 50%` противоречит заявленной цели `≥80%` (site.css = 21.9%); (3) валидирует только `css/site.css` (package.json:121), route-scoped CSS вне контроля; 200/202 `!important` | OPEN (carry-over) | `scripts/css-layer-validator.js`, `package.json:121` |
| D-3 | 🟡 Low | JS total 375041 > 365000 (CSS-бюджет теперь OK) | OPEN (carry-over) | `audit-pro.js` |
| D-4 | 🟡 Low | Magic z-index (АКТУАЛЬНЫЕ строки, исправлены 2026-07-06 cycle2): `floating-cluster.css:2372` `2102 !important`, `:2447` `9999 !important`, `:2504` `3000`, `:2697` `2147483000 !important`, `:2882` `2147483100 !important`; `mobile-hotfix.css:129` `2102 !important`. Первопричина: токены `--z-*` (вкл. `--z-max`, `--z-modal`, `--z-toast`) СУЩЕСТВУЮТ — фикс тривиален, но не сделан (нарушение AGENTS-r33) | OPEN (carry-over) | grep (этот цикл) |
| D-7 | 🟡 Low | Residual path-leak в комментарии `src/components/ui/premium-controls/PremiumControlAnchor.astro:3` (`AuditRepo/projects/gb-is-my-strength/...`) — не ловится §14 `audit-pro.js` | OPEN (carry-over) | grep |
| D-8 | 🟡 Low | `deploy.yml` `paths:` не включает `*.md` (doc-only не триггерит push-деплой) | OPEN (carry-over) | `deploy.yml:9-33` |
| D-14 | 🔴→✅ | spravochnik H2-parity divergence («Справочник по Гиллу» vs legacy «Джон Гилл (1697–1771)») блокировал PR #45; к HEAD закрыто (гейты зелёные в 28758726417) | RESOLVED @HEAD | run 28756822942 → 28758726417 |
| D-15 | 🔴→✅ | Gill series-marks smoke expectation stale (ждал 5 меток вкл. текущую; rail по дизайну рендерит только sibling-метки) блокировал PR #46; к HEAD закрыто | RESOLVED @HEAD | `GillSeriesRail.astro:34-36,47-49,90-92`; run 28757603646 → 28758726417 |
| D-16 | 🔴→✅ | SW CACHE_VERSION gb-v189 ≠ baseline gb-v188 блокировал cache-bust; пофикшено `b712bb15` (baseline → gb-v189) | RESOLVED (`b712bb15`) | run 28758340460 → 28758726417 SW readiness ✅ |
| D-9 | 🟡→✅ | Висячие ветки слиты в main (PR #47 `website-text-image-audit-9ep5z9`, PR #48 `image-generation-query-3e8rd5`) → delete-safe; **НО с origin НЕ удалены** (см. D-20) | RESOLVED (housekeeping open → D-20) | `git merge-base --is-ancestor`, `git branch -r` |
| D-19 | 🟡 Low | `<title>` ≠ `og:title`/`twitter:title`/JSON-LD `headline` на 2 кастомных PageHead (`20-antisovetov-pastoru`, `rimlyanam-7`): 4 независимых строковых литерала без общего источника (обходят `Seo.astro`-конвейер мета). Repro: `npm run validate:all` | OPEN (new, 2026-07-06 cycle2) | `AntisovetovPageHead.astro`, `Rimlyanam7PageHead.astro`; `validate:all` |
| D-20 | 🟡 Info | Слитые feature-ветки `image-generation-query-3e8rd5` и `website-text-image-audit-9ep5z9` НЕ удалены с origin (висят) — уточнение к D-9 | OPEN (new, 2026-07-06 cycle2) | `git branch -r` |
| D-21 | 🟡→✅ | Глоссарий: несогласованное экранирование `detail` — `o()` рендерит через `innerHTML` (курсив `<em>`), апгрейд-путь `l()` был через `textContent` (букв. `<em>`). Пофикшено: `l()` теперь тоже `innerHTML` (источник доверенный — курируемый `data/glossary.json`) | RESOLVED (`365de50`) | `js/glossary.js` |
| D-22 | 🟡→✅ | `Favorites.astro` не валидировал `f.path` на `javascript:`-схему перед `card.href` (само-XSS); `izbrannoe` не проверял ни `path`, ни `image` регэкспом — расхождение. Пофикшено: оба рендерера теперь требуют same-origin абсолютный путь (`/^\/(?!\/)/`, отклоняет `javascript:`/`data:`/`http(s):`/protocol-relative `//host`) и один и тот же протокол-allowlist для `image` | RESOLVED (`365de50`) | `src/components/home/HomeSections/Favorites.astro`, `src/pages/izbrannoe/index.astro` |

### Позитив (новый код)
- 3D-tilt `/izbrannoe/` a11y-корректен: только `(hover:hover) and (pointer:fine)` (`js/site.js:577`) + `@media (prefers-reduced-motion:reduce){transform:none}` (`izbrannoe/index.astro:186`).
- TTS (`js/site.js:98-197`) надёжен: feature-detect, `cancel()` на stop/`beforeunload`, pause/resume на `visibilitychange`, poll `voiceschanged`, guard устаревших utterance (`_uttGen`).
- Локальные стат-гейты зелёные; `native:runtime` — `/izbrannoe/` теперь `native-with-legacy-head` (1.9%, ок).

### Рекомендации
1. ~~(High) D-17/D-18: немедленно перезапустить деплой HEAD `14a49be8`~~ — **ВЫПОЛНЕНО** (run `28794737410` success, 2026-07-06T13:22Z). Артефакт ~32.3MB при лимите 1GB — гипотеза размера отклонена; RCA сбоя 28758726417 = transient/unknown.
2. **(Med) D-1:** убрать `cancel-in-progress` (или сделать деплой чисто push-триггером); задокументировать «продакшн = последний успешный `workflow_run`».
3. **(Med) D-2:** усилить CSS-валидатор (postcss-парсинг) + поднять @layer-адопцию.
4. **(Low) D-3/D-4/D-7/D-8:** бюджет JS; z-index-токены (`--z-*`); убрать внутренний путь из комментария `PremiumControlAnchor.astro:3`; добавить `*.md` в `deploy.yml paths:`.
5. **(Low) D-9:** удалить слитые ветки (`image-generation-query-3e8rd5`, `website-text-image-audit-9ep5z9`) из origin.
6. **(Process) D-16:** CACHE_VERSION-bump и обновление `sw-cache-version-baseline.json` делать ОДНИМ коммитом (аудит это уже требует, но разрыв вызвал транзиентный фейл деплоя).

### Ограничения
- Полный build OOM локально; браузерные гейты/публикация — через CI (авторитетно).
- GitHub fine-grained PAT **нельзя отозвать через API** (GET/DELETE `/user/fine_grained_personal_access_tokens` → 404; GET `/authorizations` → 404) — отзыв вручную владельцем: https://github.com/settings/tokens (Fine-grained) → `github_pat_11B5…`.

---

### 🔁 Re-audit cycle 2 — 2026-07-06 (вечер, arena-auditor, Node v22.12.0)

**Контекст:** `main` не сдвинулся (`origin/main == HEAD == 14a49be8`, 0 новых коммитов). Продакшн стабильно 🟢 GREEN (run `28794737410`, 13:22Z). Цикл — углублённая перепроверка уже задеплоенного кода + поиск новых дефектов. Полный отчёт: `incoming/arena-auditor/2026-07-06/AUDIT_gb-main_14a49be8_2026-07-06_cycle2.md`.

**Регресс-контроль:** `audit-pro.js` ✅ PASSED; `validate:all` ✅ PASSED (0 errors, 2 неблок. `title≠og:title`); CI: 1 success / 0 failure с пред. цикла.

**Обновления в матрице (этот цикл):**
- **D-2** усилен: заголовок `css-layer-validator.js` лжёт про «проверку порядка @layer» (код проверяет только необъявленные слои); порог `<50%` противоречит цели `≥80%`; валидирует только `css/site.css`.
- **D-4** исправлены УСТАРЕВШИЕ строки (были 2649/2834/2324/2399/2456 → стали 2372/2447/2504/2697/2882); добавлена первопричина — токены `--z-*` уже существуют (фикс тривиален).
- **D-9** уточнён: ветки delete-safe, но с origin **не удалены**.
- **D-19 (NEW):** `<title>` ≠ `og:title`/`twitter:title`/JSON-LD `headline` на 2 кастомных PageHead (`20-antisovetov-pastoru`, `rimlyanam-7`) — 4 независимых литерала, обходят `Seo.astro`. Repro через `validate:all`.
- **D-20 (NEW):** слитые feature-ветки `image-generation-query-3e8rd5`, `website-text-image-audit-9ep5z9` висят на origin (housekeeping).

**Проверено и чисто:** 3D-tilt `/izbrannoe/` (a11y), TTS (`_uttGen` guard), SW (`staleWhileRevalidate` — функц. дефект не подтверждён, код minified/плохо читаем — observability-замечание).

---

### 🔁 Re-audit cycle 3 — 2026-07-06 (поздно, arena-auditor, Node v22.12.0)

**Контекст:** `main` не сдвинулся (`origin/main == HEAD == 14a49be8`). Продакшн стабильно 🟢 GREEN (`28794737410`). Цикл — углублённое чтение клиентского JS новых/менявшихся фич. Полный отчёт: `incoming/arena-auditor/2026-07-06/AUDIT_gb-main_14a49be8_2026-07-06_cycle3.md`.

**Регресс-контроль:** `audit-pro.js` ✅; `validate:all` ✅ (2 warning D-19); `data:consistency` ✅; CI без изменений.

**Области:** `js/glossary.js`, `js/bookmark-engine.js`, `src/pages/izbrannoe/index.astro`, `src/components/home/HomeSections/Favorites.astro`, `js/enhancements.js`, `data/glossary.json`.

**Новые находки (этот цикл):**
- **D-21 (Low):** глоссарий — несогласованное экранирование `detail`: `o()` → `innerHTML` (курсив `<em>`), `l()` (апгрейд серверных `.gterm`) → `textContent` (буквальный `<em>`). `data/glossary.json` содержит `<em>` во многих `detail` → серверные тултипы показывают литерал `<em>`. Не XSS (источник доверенный), но баг консистентности рендеринга; единственное место без точки сана/экранирования (контраст с `enhancements.js`, который санизирует FAQ).
- **D-22 (Low/Info):** `Favorites.astro` не валидирует `f.path` на `javascript:`-схему перед `card.href` (само-XSS); `izbrannoe` экранирует `path`, `Favorites` сам проверяет `f.image` регэкспом — расхождение.

**Проверено и чисто:** `/izbrannoe/` (esc на всех полях, remove/clear корректны, storage-синк); `bookmark-engine.js` (очистка localStorage корректна по приоритету операторов, нет утечек слушателей, ключи не конфликтуют); `enhancements.js` FAQ (санизирует HTML перед JSON-LD — позитив).

---

### 📚 Gill research dossier — 2026-07-06 (arena-auditor)

**Контентное исследование серии «Джон Гилл»** (не баг, а лакуны контента + первоисточники). Полное досье: `incoming/arena-auditor/2026-07-06/RESEARCH_gill-series-gaps-primary-sources_2026-07-06.md`.

**Кратко:**
- Серия = 5 частей (`data/series.json` → `dzhon-gill`): Контекст (~3834 сл) · I Человек (7759) · II Учёный (8745) · III Наследие (11834) · **Справочник (2705 сл, rt 8) — самая маленькая**.
- **Главная лакуна:** богословие Гилла не выделено в статью. Предлагаемые: «Богословие Гилла» (из *Body of Doctrinal Divinity*), «The Cause of God and Truth» (vs Уитбя), «Exposition» (комментарий), крещение/экклесиология, иврит/Троица.
- **Первоисточники на сайте** (из gill-* компонентов): *Cause of God and Truth* (archive.org, 1838, public domain) · *Body of Doctrinal Divinity* т.1/т.3 · *Exposition* (johngill.thekingsbible.com) · Rippon *Memoir* · *Doctrine of Trinity* (1731) · *Dissertation on Hebrew* (1767) · PRDL · CCEL.
- **Научный нюанс:** спор о «гипер-кальвинизме» Гилла (Rathel 2017 — «был»; Toon — «был»; Nettles/George — «нет»; Ella — защита). Любая статья о богословии должна его адресовать.
- **Биография сверена** (Theopedia/Wikipedia/CCEL/Britannica): 1697 Kettering → 1716 крещение → **1719 Goat Yard** (51 год) → 1729–56 лектор Great Eastcheap → 1748 D.D. Абердин → 1757 Carter Lane (→ Метрополитен-тэбернакл) → умер 14.10.1771. «Декларация 1729» на сайте = подтверждение 1689 Исповедания (верно).

---

### 📚 Gill theology deep-dive — 2026-07-06 (arena-auditor)

**Продолжение досье** (ч.2, углублённая): конкретные позиции Гилла с прямыми цитатами из первоисточников — готовый материал для статьи «Богословие Джона Гилла». Полное досье: `incoming/arena-auditor/2026-07-06/RESEARCH_gill-theology-deep-dive_2026-07-06.md`. Связано с ч.1: `RESEARCH_gill-series-gaps-primary-sources_2026-07-06.md`.

**Кратко:** пять пунктов кальвинизма (избрание/отвержение, particular redemption, действенная благодать, претерпение, развращение); завет благодати как вечный завет Троицы (две администрации, Агарь/Сарра); прямые цитаты экзегезы 1 Тим 2:4 и Ин 3:16 («все»/«мир» = народы/избранные, не каждый индивид); вечное оправдание; кредобаптизм; сбалансированный разбор спора о «гипер-кальвинизме» (Edinburgh thesis — критика; Ella/Nettles/George — защита; нюанс: free offer без duty-faith).

---

### 🔁 Re-audit cycle 4 — 2026-07-06 (arena-auditor, Node v22.12.0)

**Контекст:** HEAD **сдвинулся** `14a49be8` → `36b815c2` (8 новых коммитов, вкл. Vosk TTS-движок `f7df07bd`/`92f27598`, merge `86bec6ea`). **Деплой НЕ green:** run `28827343079` (workflow_run, `36b815c2`, 2026-07-06T22:23Z) → FAILURE на шаге `Gill mobile TOC and PlayEmber smoke` (`deploy.yml:158-159`). Последний GREEN-деплой = `28794737410` @ `14a49be8` (2026-07-06T13:22Z) — **продакшн заперт на старом HEAD** (регрессия, не инфра-таймаут как D-17/D-18).

**Регресс-контроль (локально, все зелёные):** `audit-pro.js` ✅ (warning: JS 410104 > 365000 — **D-3 ухудшен** на ~35 КБ из-за TTS); `validate:all` ✅ (2 warning D-19); `data:consistency` ✅; `gill:series:data:consistency:audit` ✅; `native:runtime:audit:strict` ✅ (51/53).

D-23 (P1, deploy-блокирующая регрессия) — 🟠→✅ **RESOLVED, подтверждено зелёным продакшн-деплоем.** `gill:mobile-play:smoke` падал 8 assertion'ов на state-машине PlayEmber-плеера: `data-state` висел `["idle","idle"]` после тапов Play; `speed select from idle` → `{"calls":2,"rates":[1,1.75]}` (двойной speak); `long press stop` → `{"cancels":7,"calls":2}`. **Подтверждённая причина:** `resolveTtsEngine()` в `js/floating-cluster-controller.js` гейтил КАЖДЫЙ клик Play асинхронным разрешением движка — в частом случае (Vosk `isSupported()` true, но не `isReady()`) это реально ждало сеть (`ensureLoaded()` тянет ONNX-модель с CDN) прежде чем выставить `data-state=playing` и вызвать `speak()`, хотя код сам же документировал намерение «пока модель не готова — Web Speech без задержки». Из-за этого `data-state` не успевал смениться в окне ожидания смоук-теста → повторные тапы читались как «старт с нуля», а не play/pause/resume → двойной `speak()` и рассинхрон `cancels/calls`. **Фикс:** Web Speech стартует сразу и синхронно всегда, когда доступен; Vosk используется мгновенно только если уже `isReady()` (прогрет), иначе греется в фоне через `warmVoskInBackground()` — никогда не блокирует и не гонится с активным play/pause/stop. Медленный path с тостом и ожиданием сети оставлен только для браузеров без Web Speech вообще. **Двойное подтверждение:** (1) локально — пересобран `dist/` (`strangler:build:production-like`) + запущен реальный `scripts/gill-v16-mobile-play-smoke.js`, все 8 ранее падавших assertion'ов + весь остальной набор (series model, mobile overlays, TOC) прошли ✅; (2) на реальном CI — деплой `run 28829729903` (head `75f807b`, включает фикс `3280445`) прошёл ВСЕ 30+ шагов зелёным, включая сам `Gill mobile TOC and PlayEmber smoke` (step 22, success) и финальный `Deploy to GitHub Pages` (step 28, success) — продакшн обновлён, больше не заперт на `14a49be8`. (Промежуточный push `3280445` попал под `concurrency: cancel-in-progress`, D-1, и был отменён последующим `workflow_run` от авто-коммита `75f807b` — это ожидаемое поведение, не сбой; именно run `28829729903` — финальный правдивый результат.) Тест: `scripts/gill-v16-mobile-play-smoke.js`. Полный отчёт до фикса: `incoming/arena-auditor/2026-07-06/AUDIT_gb-main_36b815c2_2026-07-06_cycle4.md`. (Отношение к D-15: D-15 = series-marks smoke, уже RESOLVED; D-23 = плеер play/speed/stop — genuinely new.)

**Подтверждено RESOLVED (проверено по исходникам `gb` @ `365de509`):** D-21 (`js/glossary.js` апгрейд-путь `l()` теперь `innerHTML=detail`), D-22 (`Favorites.astro` `safePath = /^\/(?!\/)/` отсекает `javascript:`/`//host`).

**Всё ещё OPEN (re-verified в cycle 4):**
- **D-4** (Low): 6 magic z-index, те же строки — `floating-cluster.css:2372/2447/2504/2697/2882`, `mobile-hotfix.css:129`; токены `--z-*` (24) есть → фикс тривиален, не сделан.
- **D-7** (Low): `PremiumControlAnchor.astro:3` → `// See: AuditRepo/projects/gb-is-my-strength/PremiumControls/README.md §1`. ⚠️ Коммит `437c6a33` пофиксил **другой** path-leak (в AGENTS.md), этот НЕ тронут.
- **D-19** (Low): `validate:all` 2 warning — `20-antisovetov-pastoru`, `rimlyanam-7` (`<title>`≠`og:title`).
- **D-2** (Med): `css:layer:validate` → **21.9%** layered (62404/222363), цель ≥80%.
- **D-3** (Low): JS 410104 > 365000 (ухудшено vs 375041).
- **D-1 / D-8 / D-9 / D-20:** без изменений к `36b815c2`.

**Gill research (контент, НЕ баг):** ч.3 — `RESEARCH_gill-series-structure-proposal_2026-07-06.md`. Ответ на вопрос владельца: серия УЖЕ = «Введение + I + II + III + Справочник»; рекомендация — добавить **Часть IV. Богословие** (доктринальный климакс, «недостающее золото») → итог 6 документов. Связано: ч.1 `RESEARCH_gill-series-gaps-primary-sources_2026-07-06.md`, ч.2 `RESEARCH_gill-theology-deep-dive_2026-07-06.md`.

---

### 📚 Gill content deepening (ч.4) — 2026-07-06 (arena-auditor)

**Контент-аудит серии «Джон Гилл» + «золото» (ч.4 досье).** Полное досье: `incoming/arena-auditor/2026-07-06/RESEARCH_gill-content-deepening_2026-07-06.md`.

**Главный вывод (меняет рекомендацию ч.3):** богословие Гилла **уже вшито в Часть II. Учёный** (`chast-2-uchenyi.mdx`, 7966 сл: завет благодати, крещение/Вечеря, эсхатология, «оправдание до веры», «Дух в вечном совете», «Cause of God and Truth vs Уитби»). Поэтому отдельный 6-й документ «Богословие» пересекался бы с Частью II — уточнённая рекомендация: сфокусированная статья **«Богословие Гилла: 7 спорных текстов»** (экзегетический климакс + баланс гипер-кальвинизма) с перекрёстными ссылками на Часть II.

**Готовый материал (выкопан):** 7-текстовый экзегетический сет с ПРЯМЫМИ цитатами Гилла (1 Тим 2:4, Ин 3:16, 2 Петр 3:9, 1 Ин 2:2, Ин 1:29, Рим 8:29, Рим 9) — все public domain (johngill.thekingsbible.com). **«The Cause of God and Truth» 4-частная структура подтверждена из ПЕРВИЧНОГО предисловия** (archive.org, Tegg 1838, PD) — Part I отвечает на «универсальные» тексты (= мои 7), II — за особую благодать, III — доводы разума, IV — божественное просвещение. Тонкие места серии: `istoricheskiy-kontekst` (3652 сл) и `spravochnik` (2152 сл) легче `chast-3-nasledie` (10858).

Связано: ч.1 `RESEARCH_gill-series-gaps-primary-sources_2026-07-06.md`, ч.2 `RESEARCH_gill-theology-deep-dive_2026-07-06.md`, ч.3 `RESEARCH_gill-series-structure-proposal_2026-07-06.md`; аудит `AUDIT_gb-main_36b815c2_2026-07-06_cycle4.md`.

---

### 📚 Gill content deepening (ч.5) — 2026-07-06 (arena-auditor)

**Систематика + каркас статьи (ч.5 досье).** Полное досье: `incoming/arena-auditor/2026-07-06/RESEARCH_gill-content-deepening2_2026-07-06.md`.

**Добыто:** (1) карта сайта — доктрины Гилла освещены только в серии (+ `krajne-li-isporcheno-serdce` = total depravity), статья «Богословие Гилла» дополняющая, не дублирующая; (2) экзегетический сет расширен до **9 текстов** (добавлены Рим 8:30 — golden chain/effectual calling, Ин 3:3 — regeneration) с прямыми цитатами Гилла; (3) **полное оглавление *A Body of Doctrinal Divinity* (7 книг, CCEL)** — систематический хребет; Book VI ch.3 «Objects of Redemption» + ch.4 «Texts seeming to Favour Universal Redemption» = точная параллель 7-текстовому сету. Итог: конкретный каркас статьи «Богословие Гилла», повторяющий порядок самого Гилла (Book II→VI) + сбалансированный гипер-кальвинизм + перекрёстные ссылки на Часть II и `krajne-li-isporcheno-serdce`.

Связано: ч.1–ч.4 `RESEARCH_gill-*`; аудит `AUDIT_gb-main_36b815c2_2026-07-06_cycle4.md`; матрица cycle-4 блок.

---

### 📚 Gill content deepening (ч.6) — 2026-07-06 (arena-auditor)

**Полный индекс сайта + закон/антиномизм + избрание/вера (ч.6 досье).** Полное досье: `incoming/arena-auditor/2026-07-06/RESEARCH_gill-content-deepening3_2026-07-06.md`.

**Добыто:** (1) полный инвентарь сайта — 20 статей; **расширенная карта ссылок**: две прямые доктринальные ссылки, которых не было в ч.5 — `rimlyanam-7-veruyushchiy-ili-neveruyushchiy` (Римлянам 7 → закон/антиномизм) и `krajne-li-isporcheno-serdce` (total depravity); плюс `hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki` (герменевтика), `kod-da-vinchi` (канон), серия `russian-baptism` (баптистская идентичность); (2) две новые цитаты — Рим 3:31 (закон «establish», отменён лишь as covenant of works) и Деян 13:48 (вера = «fruit and effect of the decree»; избрание sovereign/irrespective/unconditional/particular); (3) Cause of God and Truth Part III «arguments from reason» (якорь = первичное предисловие) + таксономия рациональных возражений (свобода воли, справедливость отвержения, искренность Евангелия, антиномизм, условность декретов) + нюанс duty-faith. Итог: каркас статьи расширен до **8 разделов** с полной картой ссылок.

Связано: ч.1–ч.5 `RESEARCH_gill-*`; аудит `AUDIT_gb-main_36b815c2_2026-07-06_cycle4.md`.

---

### 📚 Gill research → перенесено в Research repo (2026-07-06)

**Консолидация:** все 6 исследовательских досье Гилла перенесены в канонический отдел **«Джон Гилл»** репозитория `FedorMilovanov/Research` (по указанию владельца — «чтобы не путаться потом»). Индекс отдела: `Джон Гилл/00_README_AND_NAVIGATION.md`. Файлы-заглушки в `incoming/arena-auditor/2026-07-06/RESEARCH_gill-*` теперь перенаправляют туда.

Канонические тома (Research → `Джон Гилл/`): `01_SERIES_GAPS_AND_PRIMARY_SOURCES` · `02_THEOLOGY_DEEP_DIVE` · `03_STRUCTURE_PROPOSAL` · `04_CONTENT_DEEPENING_AUDIT_AND_EXEGESIS_SET` · `05_BODY_OF_DIVINITY_TOC_AND_ARTICLE_SKELETON` · `06_SITE_INDEX_LAW_ANTINOMIANISM_ELECTION`.

Аудит-отчёты (D-23 deploy-регрессия и пр.) остаются в AuditRepo — они НЕ «исследование», поэтому не переносились.

---

### 🔧 D-23 RESOLVED — 2026-07-06 (поздно, arena-auditor + другой агент)

**D-23 (Gill v16 mobile/play smoke, 8 провалов) ЗАКРЫТА.** Подтверждено green-деплоем: run `28829729903` (conclusion=success, HEAD `75f807b73`, workflow_run, 2026-07-06T23:14Z) — продакшн снова GREEN. Фикс регрессии (play/speed/stop state-машина PlayEmber-плеера / интеграция Vosk TTS) выполнен другим агентом поверх `36b815c2`.

Статус: матричный заголовок обновлён на «D-23 RESOLVED / продакшн GREEN @ 75f807b73». Запись cycle-4 («HEAD 36b815c2 НЕ deploy-green») — историческая: на момент cycle-4 деплой действительно падал, позже пофикшено.

Связь: cycle-4 отчёт `AUDIT_gb-main_36b815c2_2026-07-06_cycle4.md` (исходная находка D-23); Gill-исследования перенесены в `FedorMilovanov/Research` (отдел «Джон Гилл»).

---

### 🔍 arena-auditor governance reverify — 2026-07-14

**Source HEAD:** `2ca2af3` (confirmed against cloned source repo; +287 commits since `b8459bdf`).

**Verified-source evidence for open bugs:**
- D-1: partial fix confirmed — indexnow now `cancel-in-progress: true`; P2→P3
- D-4: 20 z-index in floating-cluster.css, 5 magic values (2102, 9999, 3000, 2147483000, 2147483100) — still open
- D-7: repo-relative link still at `PremiumControlAnchor.astro:3` — still open
- D-8: deploy.yml paths still missing `*.md` — still open
- D-21: glossary.js `innerHTML=detail` still present — still open
- GATE-MARKER-DATA-DRIFT / NF-GATE-IZ5-STALE: 6 hardcoded `«Часть 1 из 5»` in scripts/ — still open
- NF-DEAD-ENHANCE-SHIM: `enhanceGillMobileBarMarkup` dead at controller:1084 — still open
- NEW-VOSK-DEAD-SPLITSENTENCES: `splitSentences` dead export at vosk-tts-core.js:413 — still open
- TTS-DL-UNZIP-SYNC: `fflate.unzipSync` at vosk-tts-engine.js:110 — still open
- NEW-HARDTEXTS-CSP-MISSING-HFCDN: `huggingface.co` without `*.aws.cdn.hf.co` at hard-texts:122 — still open
- R-001: site.js 169.5 KB, 80 addEventListener / 10 removeEventListener — still open
- R-002: enhancements.js 46.1 KB — still open

**New findings added to matrix:**
- NEW-VOSK-FETCH-NO-ABORT (P3): model fetch without AbortController at vosk-tts-engine.js:166
- AR-AUDIT-17 (P3): validate:all 2 errors in genealogy build templates

**Merge proposal:** NEW-VOSK-UNZIP-SYNC-JANK = alias of TTS-DL-UNZIP-SYNC (same line, same root cause)

**Source gate results on `2ca2af3`:**
- data:consistency ✅ · gill:series:data:consistency:audit ✅ · guard:shared-files ✅
- native:runtime:audit:strict ✅ (55/56 strict-native)
- css:layer:validate ❌ (21.2% layered vs ≥80% target — D-2)
- validate:all ❌ (2 genealogy HTML errors — AR-AUDIT-17)

**Intake:** `incoming/arena-auditor/2026-07-14/`

### 2026-07-14 (вечер) · dns-configuration-setup: разблокировка деплоя + движки
- Влиты и верифицированы ветки: un2iya (CSS-!important синтез), arena dd/df/e0
  (RCA, deep CSS/JS, governance/нагорная), gpt-5-5 image intake, gill-content-research.
- Source-репо (ветка dns-configuration-setup, слита с main 2ca2af3b): ВСЕ гейты
  Static publication chain зелёные локально. Ключевое: site.css 210→183 !important
  архитектурно; 5 CSS-синтакс дефектов восстановлены; floating-cluster comment-corruption
  (глотался .mobile-bottom-bar) починен + AST-гейт; editorial 25/25; nagornaya JS +
  series-samizdat.css зарегистрированы (ALLOWED/cache-bust/SW precache v190);
  36 сирот-изображений удалены; maps/avraam валидаторы научены контрактам Атласа
  (sheet-format, ctx/region); шаблоны генеалогии выведены из страничных чекеров.
- Новое в движках: PLAY follow-скролл, Media Session + фоновый якорь + SVG-обложка,
  page-движок на 6 каталогах, engine:guard (17 контрактов + канон v2.9 + 87 функциональных).
- Деплой станет GREEN после мержа ветки в main.

### 2026-07-14 (ночь) · Марафон 2.0 по аудит-репо
- S-DATA-01 закрыт: series.json «Сердце» 2→6, чекер серий видит Astro/MDX (S-T-01 частично).
- AR-006 закрыт: root allow-list в validate_audit_repo.py; корневой passes/ выселен в проект.
- Оба собственных валидатора аудит-репо PASS. check_matrix_coverage: 132 гигиен-замечания
  (ORPHAN-CLAIM у старых открытых строк + BAD-COMMIT-REF 'PR#N' у исторических закрытий) —
  advisory, кандидат AR-001-hardening.
