# MASTER BUG MATRIX — gb-is-my-strength

> Единый реестр всех багов проекта gospod-bog.ru.  
> Дата консолидации: **2026-07-05** (полная реструктуризация из 2174-строчного документа).  
> Source HEAD: `de71fb3d` (deploy run 28747336849 SUCCESS — всё дневное на проде) | AuditRepo HEAD: см. git log  
> Предыдущая версия: `archive/2026-07-05-matrix-pre-restructure/`
> **🔴 2026-07-06 arena-auditor: deploy STALE** — последний успешный деплой `e044908e` (2026-07-05T19:27Z); HEAD `14a49be8` (Merge PR #48) проваливает публикацию на шаге «Deploy to GitHub Pages» (infra: `error_count: 10`, `timeout: 600000`). Все quality-гейты на HEAD зелёные. См. секцию «AUDITOR / ARENA — 2026-07-06» внизу.

---

## ✅ ЗАКРЫТО (87)

| ID | Описание | Коммит |
|---|---|---|
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

## 🟠 P1 — ОТКРЫТО (2)

| ID | Описание | Witnesses |
|---|---|---|
| BUG-PERF-001 | addEventListener без removeEventListener: 339 add / 25 remove по всем js/ (294/16 в 5 файлах) | 2 witnesses + пересчёт 07-05 |

## 🟡 P2 — ОТКРЫТО (5)

| ID | Описание | Witnesses |
|---|---|---|
| AUDIT-P2-WORKFLOWS-CHECK-GAP | `check-workflows.js` не проверяет deploy `if:` условия — `|| failure` не ловится | АУДИТ 1.4 |
| AUDIT-P2-MATRIX-DRIFT | route-migration-matrix (35) ≠ page-ownership (54) ≠ sitemap (43). Нет cross-validation. | АУДИТ 1.0 |
| BUG-SEO-001 | IndexNow submit до реальной доступности на CDN | Pass 65 |
| NEW-CANONICAL-IZBRANNOE-01-GAP | canonicalSanityGuard не ловит relative canonical на noindex routes (tooling gap) | Pass 65 |

## 🟢 P3 — ОТКРЫТО (24, DEPLOY-YML-DEAD-WARN-STEP merged PR#34)

| ID | Описание |
|---|---|
| GATE-MARKER-DATA-DRIFT | 🆕 Системный риск: захардкоженные строки/значения в гейтах 4 раза за 05.07 расходились с работой параллельных лейнов (маркер pastor-series, зеркало timestamps, двойник precache-проверки audit-pro↔dist-publication-audit, label chast-2). Рекомендация: (а) выносить маркеры/списки в data/*.json рядом с контентом; (б) дедуплицировать двойные проверки через общий модуль (по образцу cache-bust-assets.js) | хроника 4 инцидентов 05.07 |
| VALIDATE-SCOPE-GAP | validate.js проверяет только `articles/` (10 страниц из 40+). baptisty-rossii, nagornaya, karty, konfessii, biografii, hard-texts — **не валидируются** checks #1-#17 (canonical, section, byline, img alt, internal links, quote policy) | Meta-audit |
| NEW-CSS-BUDGET-01 | audit-pro CSS budget warning на каждом прогоне, не в backlog |
| NEW-OG-SIZE-PARAM | seo-audit.js hardcoded OG size check, нет per-route allowlist |
| AUDIT-P3-OG-LCP-MISMATCH | 4 routes: og:image ≠ LCP image |
| BUG-011 | 23 unique breakpoints, 768px collision |
| NEW-72 | SVG dedup micro-optimization (~1.9KB) |
| SHADOW-AUDIT-NARROW | `legacy-shadow-wrapper-audit.js` проверяет только 7/52 (13%) production-dist маршрутов. Не охвачены: все страницы статей, baptisty-rossii, karty (8 из 10), biografii, about, pastor-series, konfessii, rodosloviye. |
| AUDIT-PRO-SITEMAP-ROOT-ONLY | `publicFiles()` проверяет покрытие sitemap по `htmlPages` (root HTML). Если Astro-страница существует только в dist/ (без root-копии), её URL не попадёт в проверку покрытия — sitemap может недосчитаться страниц, а аудит пройдёт. |
| AUDIT-PRO-VM-DEPRECATED | `extractSiteConfig()` и `inlineScriptSyntax()` используют `new vm.Script()` — deprecated в Node 22.12+. При полном удалении API в будущей версии Node аудит упадёт. Альтернатива: `new Function()` в sandbox. |
| SEO-AUDIT-ROOT-ONLY | `seo-audit.js` исключает `dist/` из `walk()`. Astro-only страницы без root-копии невидимы для SEO-аудита: проверки canonical, og:image, JSON-LD, Twitter cards, FAQ, robots. Та же архитектурная проблема что AUDIT-PRO-ROOT-ONLY. |
| VALIDATE-JS-VM-DEPRECATED | `extractSiteConfigFromHtml()` использует `new vm.Script()` — deprecated в Node 22.12+. Дублирует ту же проблему что и `audit-pro.js` (AUDIT-PRO-VM-DEPRECATED). При удалении API — validate.js упадёт. |
| VALIDATE-JS-ARTICLES-ONLY | `scripts/validate.js` (`validateArticle()`) проверяет только `articles/*`. 9 baptisty-rossii статей (dva-sezda-1884…yuzhnaya-shtunda) НЕ проходят 17 проверок: canonical, byline, og:image, breadcrumb, author-card и др. `EXTRA_PAGES` = 4 страницы (pastor-series, biografii, about, index) — жёстко захардкожено. |
| AUDIT-PRO-ROOT-ONLY | `audit-pro.js` проверяет ТОЛЬКО root HTML (`walk(ROOT)`, `dist/` в skipDirs). `/izbrannoe/` (Astro-only, без root-копии) невидим для 7 гвардов: canonical, sitemap, SEO, cache-bust, JSON-LD, links, a11y. При `astro build` в dist/ генерируются 54 страницы — аудит проверяет только 50 root HTML. |
| STRANGLER-HYGIENE | 50/53 Astro-маршрутов имеют дублирующийся legacy HTML в корне репо (работает корректно через page-ownership, но техдолг). |

## 🔵 P3 — РЕФАКТОРИНГ (4)

| ID | Описание |
|---|---|
| R-001 | site.js монолит ~167KB (15 модулей) |
| R-002 | enhancements.js монолит ~48KB |
| R-003 | Нет source maps |
| R-004 | Нет type="module"/tree-shaking |

## 🟣 AUDITREPO (3)

| ID | Описание |
|---|---|
| AR-001 | validate_audit_repo.py hardening |
| AR-004 | verification protocol automation |
| AR-005 | reverify automation |

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

### Архив:
- 36 incoming pass-папок → `archive/2026-07-05-incoming-consolidated/`
- Предыдущая 2174-строчная матрица → `archive/2026-07-05-matrix-pre-restructure/`
- 41 PASS evidence section из старой матрицы → `archive/2026-07-05-pass-evidence/`

---

## Статистика

| Категория | Количество |
|---|---|
| Закрыто (fixed) | 87 |
| P1 открыто | 4 |
| P2 открыто | 5 |
| P3 открыто | 24 |
| Рефакторинг | 4 |
| AuditRepo | 3 |
| **Всего открыто** | **40** (11 закрыто PR#33/#35 + самоизлечение; PR#34-тройка закроется зелёным деплоем) |
| False positives отклонено | 3 |
| Passes processed | 94+ |

---

## 🔴 AUDITOR / ARENA — 2026-07-06 (independent auditor, Node v22.12.0)

**Объект:** `main` @ `14a49be83ab57212c0bbd26a8249b75ac026511d` (Merge PR #48). Полные отчёты: `incoming/arena-auditor/2026-07-06/AUDIT_gb-main_e044908e_2026-07-05.md` и `incoming/arena-auditor/2026-07-06/AUDIT_gb-main_14a49be8_2026-07-06.md`.

**Метод:** локально Node 22 + `npm ci`, статические гейты (`audit-pro.js`, `css:layer:validate`, `data:consistency`, `gill:series:data:consistency:audit`, `native:runtime:audit:strict`, `migration:metadata:check:strict`, `validate:all`, visual-parity audits) — все PASSED. Браузерные гейты и Pages-публикация проверены через GitHub API (CI run-логи). Полный `strangler:build:production-like` локально OOM (exit 137, ~1 ГБ при нужных ~2 ГБ) — см. `docs/SANDBOX-ENV-2026-06-21.md`.

### Вердикт
- 🔴 **Продакшн STALE.** Последний успешный деплой — `e044908e` (2026-07-05T19:27Z). С тех пор **4 попытки подряд failed/cancelled**: PR #45 `55a7d437e`, PR #46 `2e760e746`, cache-bust `5704924ab`, HEAD `14a49be8` (`28758726417`). В окне последних 40 прогонов — 0 успешных деплоев. Фичи PR #45–#48 (3D-tilt `/izbrannoe/`, Писание в глоссарии, Bible-tooltip, TTS/kinetic numeral, SW baseline gb-v189) **НЕ на продакшне**.
- 🟠 HEAD `14a49be8` проходит **ВСЕ quality-гейты** (Static gates, Build, Pagefind, Gill submenu audit, Gill mobile layout, dist-smoke, content coverage 50/50, **SW readiness ✅ CACHE_VERSION=gb-v189 matches baseline**), но деплой падает на шаге **«Deploy to GitHub Pages»** (`error_count: 10`, `timeout: 600000` → «Deployment failed, try again later»). Баг НЕ в коде — нужен перезапуск деплоя.
- 🟢 Локальные гейты (Node 22) — все PASSED. **CSS-бюджет теперь в норме** (предупреждение исчезло vs `e044908e`); JS total 375041 > 365000 (превышен).

### Найденные проблемы (аудиторские D-*)

| ID | Sev | Описание | Статус | Evidence |
|---|---|---|---|---|
| D-17 | 🔴 High | Продакшн STALE — 4 failed/cancelled деплоя подряд; HEAD не опубликован | OPEN | CI runs 28756822942 / 28757603646 / 28758340460 / 28758726417; последний success `e044908e` |
| D-18 | 🟠 Med | HEAD-деплой зелёный по гейтам, но падает на «Deploy to GitHub Pages» (infra/timeout, error_count 10) | OPEN (infra) | run 28758726417 log: `error_count: 10`, `timeout: 600000` |
| D-1 | 🟠 Med | `concurrency: cancel-in-progress` губит push-деплои; публикация держится на цепочке `workflow_run` (IndexNow→deploy) | OPEN (carry-over) | `deploy.yml:50-52` |
| D-2 | 🟠 Med | css-layer-validator слабый (только brace-count; не ловит семантику); @layer-адопция 21.9% (цель ≥80%); 200 `!important` (потолок 202) | OPEN (carry-over) | `css:layer:validate` |
| D-3 | 🟡 Low | JS total 375041 > 365000 (CSS-бюджет теперь OK) | OPEN (carry-over) | `audit-pro.js` |
| D-4 | 🟡 Low | Magic z-index: `floating-cluster.css:2649` `2147483000`, `:2834` `2147483100`, `:2324` `2102 !important`, `:2399` `9999`, `:2456` `3000`; `mobile-hotfix.css:129` `2102 !important` | OPEN (carry-over) | grep |
| D-7 | 🟡 Low | Residual path-leak в комментарии `src/components/ui/premium-controls/PremiumControlAnchor.astro:3` (`AuditRepo/projects/gb-is-my-strength/...`) — не ловится §14 `audit-pro.js` | OPEN (carry-over) | grep |
| D-8 | 🟡 Low | `deploy.yml` `paths:` не включает `*.md` (doc-only не триггерит push-деплой) | OPEN (carry-over) | `deploy.yml:9-33` |
| D-14 | 🔴→✅ | spravochnik H2-parity divergence («Справочник по Гиллу» vs legacy «Джон Гилл (1697–1771)») блокировал PR #45; к HEAD закрыто (гейты зелёные в 28758726417) | RESOLVED @HEAD | run 28756822942 → 28758726417 |
| D-15 | 🔴→✅ | Gill series-marks smoke expectation stale (ждал 5 меток вкл. текущую; rail по дизайну рендерит только sibling-метки) блокировал PR #46; к HEAD закрыто | RESOLVED @HEAD | `GillSeriesRail.astro:34-36,47-49,90-92`; run 28757603646 → 28758726417 |
| D-16 | 🔴→✅ | SW CACHE_VERSION gb-v189 ≠ baseline gb-v188 блокировал cache-bust; пофикшено `b712bb15` (baseline → gb-v189) | RESOLVED (`b712bb15`) | run 28758340460 → 28758726417 SW readiness ✅ |
| D-9 | 🟡→✅ | Висячие ветки слиты (PR #47 `website-text-image-audit-9ep5z9`, PR #48 `image-generation-query-3e8rd5`) → delete-safe на origin | RESOLVED | `git merge-base --is-ancestor` |

### Позитив (новый код)
- 3D-tilt `/izbrannoe/` a11y-корректен: только `(hover:hover) and (pointer:fine)` (`js/site.js:577`) + `@media (prefers-reduced-motion:reduce){transform:none}` (`izbrannoe/index.astro:186`).
- TTS (`js/site.js:98-197`) надёжен: feature-detect, `cancel()` на stop/`beforeunload`, pause/resume на `visibilitychange`, poll `voiceschanged`, guard устаревших utterance (`_uttGen`).
- Локальные стат-гейты зелёные; `native:runtime` — `/izbrannoe/` теперь `native-with-legacy-head` (1.9%, ок).

### Рекомендации
1. **(High) D-17/D-18:** немедленно **перезапустить деплой HEAD `14a49be8`** (гейты зелёные; сбой инфраструктурный). Убедиться, что прогон доходит до «Deploy to GitHub Pages» и завершается success. Если `timeout/error_count` повторяется — исследовать размер Pages-артефакта и 10-мин таймаут шага публикации.
2. **(Med) D-1:** убрать `cancel-in-progress` (или сделать деплой чисто push-триггером); задокументировать «продакшн = последний успешный `workflow_run`».
3. **(Med) D-2:** усилить CSS-валидатор (postcss-парсинг) + поднять @layer-адопцию.
4. **(Low) D-3/D-4/D-7/D-8:** бюджет JS; z-index-токены (`--z-*`); убрать внутренний путь из комментария `PremiumControlAnchor.astro:3`; добавить `*.md` в `deploy.yml paths:`.
5. **(Low) D-9:** удалить слитые ветки (`image-generation-query-3e8rd5`, `website-text-image-audit-9ep5z9`) из origin.
6. **(Process) D-16:** CACHE_VERSION-bump и обновление `sw-cache-version-baseline.json` делать ОДНИМ коммитом (аудит это уже требует, но разрыв вызвал транзиентный фейл деплоя).

### Ограничения
- Полный build OOM локально; браузерные гейты/публикация — через CI (авторитетно).
- GitHub fine-grained PAT **нельзя отозвать через API** (GET/DELETE `/user/fine_grained_personal_access_tokens` → 404; GET `/authorizations` → 404) — отзыв вручную владельцем: https://github.com/settings/tokens (Fine-grained) → `github_pat_11B5…`.
