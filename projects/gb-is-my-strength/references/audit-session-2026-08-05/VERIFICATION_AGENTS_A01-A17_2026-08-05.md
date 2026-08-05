# Верификация волны агентов A01–A17 — закрыто или актуально?

**Дата:** 2026-08-05 · **Проект:** `FedorMilovanov/gb-is-my-strength` (gospod-bog.ru)
**База:** AuditRepo @ `1392037` (+`origin/main` 944 коммита), source main `4ce39dc8` (PR #1036), production anchor записан `38b25703`.
**Метод:** тематическая сверка по канону (MASTER_BUG_MATRIX, Session log, reverify/, references/ 07-28, SUPER_AUDIT, NEXT_AGENT_PROMPT, PremiumControls) + GitHub API source-репо (PR/issues/ветки/деплои).
**Оговорка:** сами файлы `AGENT_01..17` в песочницу не попали (два вложения не материализовались), поэтому сверка — по **темам/названиям**, не по конкретным ID внутри отчётов. Все выводы — по независимым каноническим источникам.

---

## Сводная таблица

| # | Агент (тема) | Вердикт | Ключевое доказательство |
|---|---|---|---|
| A01 | Gill witness | 🟡 **частично** | GILL-EXTERNAL-SOURCE-5 ✅, NF-SPEEDSLOT-4TH-COPY ✅ (08-04); остаток — PremiumControls PC-CURRENT-02..05 (owner-freeze), Gill speed-rail Tab-ownership → #61 |
| A02 | Editorial Metadata v3 | 🟡 **частично** | PR #442/#672 (EDITORIAL-PROJECTION-51-DRIFT ✅, гейт зелёный `30679631914`); открыты AR-IDX-05, D-19 antisovetov, W2-P0-03/04 не отслеживаются |
| A03 | Note Registry | ✅ **закрыто (суперсида)** | PR #680 «SUPERSEDED — DO NOT REVIVE» → merged **#758** (08-02) + **#785** (Firefox gap) |
| A04 | Reader Projection | ✅ **source-закрыто**; 🟡 функц. остаток | PR **#990** merged 08-05 (`92c4939c`), AuditRepo #182; остатки — umbrella **#61** (3 пункта) |
| A05 | Legacy quarantine | ✅ **закрыто/материализовано** | #1005 + #1013 + #1032 merged 08-05; references-диспозиции 07-28; остаток — transport-ветки |
| A06 | Research public | ✅ **закрыто (evidence-only)** | AuditRepo #119: queue 10 записей, **PROMOTE=0** (3 REFERENCE, 7 BLOCKED), product-writes=0 |
| A07 | Offline PWA | 🟡 **ядро закрыто, остаток есть** | TTS-DL-* ✅, FONT-PIPELINE-FAIL-OPEN ✅; открыт **MAP-P1-20** (unversioned `map-engine.js`), SW-lazy-строки |
| A08 | Force-reset forensics | ⚠️ **tooling, не баги** | скрипт `repository_history_forensic_audit.mjs` существует, но в песочнице падает (`fetch failed`); урок container-reset задокументирован (session log 07-10) |
| A09 | Baptists epilogue | ✅ **закрыто** | NEW-65 ✅, CI-VISUAL-PARITY-ROUTE-POLICY ✅, CI-INDEXNOW-CHECKER-STALE ✅, PR #167 убрал unpublished-ссылку |
| A10 | Maps completeness | 🔴 **открыто — крупнейший кластер** | HUB-AUDIT-COUNT-DRIFT/GATE-P1-01 ✅, но ~55 строк Karty P1/P2 открыты; witness'ы `c2c339708252`/`32ae0d7d` устарели (SD-7) |
| A11 | Series navigation | 🟡 **в основном закрыто** | SERIES-CAPABILITY-INTERFACE ✅ (PR #319), READER-R3/R4 ✅; открыты S-T-01 (partial), AR-IDX-04 |
| A12 | Print/PDF | ✅ **закрыто** | ORCH-DUPLICATE-PRINT-SURFACE-OWNERS ✅, PRINT-REVERSIBLE-BACK-3D-FLOW ✅ (`f5e29998`), disposition 07-28 |
| A13 | Mobile WebKit a11y | 🟡 **частично** | READER-PUBLIC-SURFACE-BROWSER-01 ✅, HOME-BROWSER-LIFECYCLE-RESIDUAL ✅; открыты CI-WEBKIT-TOC-NONDETERMINISTIC, AR-IDX-JS-01, MAP-P1-19, AVRAAM-P1-05 |
| A14 | Release governance | 🟡 **транзакция ✅, контрольный слой нет** | PROD-STALE-DEPLOY-RED ✅, build-once #370 ✅, D-8 ✅; открыты D-1, AUDIT-P2-WORKFLOWS-CHECK-GAP, CI-WORKFLOW-PROLIFERATION, **#357 красный CI** |
| A15 | Discovery followups | 🟡 **ядро ✅, лейны открыты** | AR-IDX-01/02 ✅, SEARCH-P2-09/P1-03/P1-04/P2-08 ✅; открыты SEARCH-P1-01, P2-07, P2-10/11/12 |
| A16 | A04 residual | 🔴 **актуально — это #61** | (1) speed/search AT-экспозиция, (2) radiogroup roving keyboard + popup-семантика, (3) favorites store; PR #1039/#1040 — **оба с красным CI** |
| A17 | Home component lab | 🟡 **частично** | HOME-BROWSER-LIFECYCLE-RESIDUAL ✅, home effects #1016 ✅, refutations #991 ✅; открыты AR-IDX-CSS-02/03, AR-IDX-04..10; PR #1045 открыт |

**Итог:** ✅ закрыто — 6 (A03, A05, A06, A09, A12, source-часть A04) · 🟡 частично — 8 (A01, A02, A07, A11, A13, A14, A15, A17) · 🔴 открыто/актуально — 2 (A10, A16) + сквозной красный CI.

---

## По-агентно

### A01 — Gill witness → 🟡 частично
- **Закрыто:** `GILL-EXTERNAL-SOURCE-5` (PR #354 — 5 битых source-записей, real-network 0 hard), `NF-SPEEDSLOT-4TH-COPY` (08-04 — 4-я копия speed-slot убрана, rail ведёт canonical `initPlayExpand`), `GILL-PART4-*`/`GILL-SUBMENU-*`/`GILL-RAIL-*` (Часть IV «Экзегет», submenu-коллапс, flow-card, fill-рынок), `D-23` (PlayEmber state machine), `D-15`.
- **Открыто/актуально:** PremiumControls в freeze владельца — `PC-CURRENT-02..05` (RomanNumeral false-green, unversioned asset refs, CSS inventory, malformed transitions); Gill speed-rail при открытии оставляет 6 radios Tab-останавливающими + нет badge-семантики → это пункт 2 umbrella #61.
- **Вердикт:** «Gill witness» в части source-целостности — закрыто; в части a11y/слот-семантики — **актуально**.

### A02 — Editorial Metadata v3 → 🟡 частично
- **Закрыто:** `EDITORIAL-PROJECTION-51-DRIFT` (PR #442 — восстановлены 27 unauthorized `editorialPublishedAt`, добавлены preservation/frozen-diff контракты); гейт «Editorial Metadata v3» зелёный на exact head (run `30679631914`, PR #672 `eb129d3e`).
- **Открыто/актуально:** `AR-IDX-05` (SITE_CONFIG.version + `?v=` хардкод — stale cache риск), `D-19` antisovetov половина (`<title>`≠`og:title`), системные W2-P0-03/04 (bot-петля дат, cache-bust-мутация) **не имеют строк в матрице** — статус не прослеживается.
- **Вердикт:** гейт-инфраструктура сделана; остаточные даты/metadata-дефекты — **актуальны**.

### A03 — Note Registry → ✅ закрыто (через суперсиду)
- PR #680 (`[SUPERSEDED BY #758/#785 — DO NOT REVIVE] A03: establish one NoteRegistry projection owner`) — закрыт без merge.
- Вместо него merged: **#758** (08-02, «isolate the clean NoteRegistry core») и **#785** (08-02, «close Firefox acceptance gap»).
- **Вердикт:** тема закрыта в другой формулировке. Стоит проверить, что исходные требования A03 (NoteRegistry как единый владелец проекции) полностью покрыты #758/#785.

### A04 — Reader Projection → ✅ source-закрыто; 🟡 функц. остаток
- PR **#990** (`feat(reader): establish canonical ReaderProjection`) merged **2026-08-05** = `92c4939c`; exact head `fdc3a90e` прошёл 15/15 групп (source 68/68, browser 144/144, tooltip 19/19). AuditRepo записал closure (#182).
- **Остаток (#61, открыт):** (1) неактивные speed/search контролы в Tab/AT-экспозиции; (2) radiogroup roving keyboard + честная mobile popup-семантика (Play `aria-haspopup` без `aria-controls`); (3) favorites metadata → canonical store.
- **Вердикт:** «ReaderProjection» как архитектурная тема — **закрыта**; остаточные три пункта — **актуальны** и ведут к A16.

### A05 — Legacy quarantine → ✅ закрыто/материализовано
- Merged 08-05: **#1005** (immutable reference inventory), **#1013** (remove obsolete metadata writer), **#1032** (explicit reference path API). Плюс диспозиции 07-28 (`references/*DISPOSITION-2026-07-28.md`) классифицировали refs до нормализации.
- Остаток: `transport/legacy-*` ×5 и `lane/system-legacy-reference-path-api[-v2]` ветки висят на origin — гигиена (BRANCH_LIFECYCLE), не продукт.
- **Вердикт:** тема закрыта; осталась branch hygiene.

### A06 — Research public → ✅ закрыто (evidence-only)
- AuditRepo PR #119 записал authority: Research PR #88, merge `1a0b63c2`; queue 10 записей, **PROMOTE=0** (REFERENCE 3, BLOCKED 7), physical-rights 7, product-writes 0.
- **Вердикт:** закрыто по определению — промоушен Research-контента **не авторизован** до появления конкретной PROMOTE-записи.

### A07 — Offline PWA → 🟡 ядро закрыто, остаток есть
- **Закрыто:** TTS-DL-UNZIP-SYNC/NO-TABLOCK (worker/IDB/SharedWorker — offline-инфраструктура), FONT-PIPELINE-FAIL-OPEN (offline fail-closed верификатор шрифтов), RUNTIME-HIGHLIGHT-DEDUPE, SW-readiness baseline.
- **Открыто/актуально:** `MAP-P1-20` — сужен до unversioned `map-engine.js` (cacheFirst stale-риск, нужен `?v=`), SW-lazy precache-строки (`AUDIT-P2-SW-PRECACHE-4`, `AUDIT-P3-SEARCH-LAZY-CONFIRMED`), `D-4` (magic z-index на SW/precache-границе не влияет, но это отдельная тема).
- **Вердикт:** offline-ядро закрыто; SW-остатки — **актуальны** (малый объём).

### A08 — Force-reset forensics → ⚠️ tooling, не баги
- Урок задокументирован (session log 07-10): локальные checkout'ы молча откатываются на container-reset → «всегда `git fetch && reset --hard origin/main` перед доверием локальному состоянию».
- Инструмент `scripts/repository_history_forensic_audit.mjs` существует, но **в песочнице не работает** (`TypeError: fetch failed` — нужен сетевой GitHub API).
- **Вердикт:** тема — процессная дисциплина + инструмент; багов продукта не содержит. Инструмент требует починки/задокументирования.

### A09 — Baptists epilogue → ✅ закрыто
- `NEW-65` Baptisty visual parity ✅, `CI-VISUAL-PARITY-ROUTE-POLICY-01` (baptisty native ownership) ✅, `CI-INDEXNOW-CHECKER-STALE` (baptisty-coverage перенесён в deploy) ✅, PR #167 убрал публичную ссылку на unpublished Baptist research-файл ✅.
- **Вердикт:** закрыто.

### A10 — Maps completeness → 🔴 открыто — крупнейший кластер
- **Закрыто:** HUB-AUDIT-COUNT-DRIFT (производные счётчики из inventory), GATE-P1-01 (maps:validate + реальный Playwright smoke), QUAL-P1-07 (story-ID схема), RIVER-P1-05, DRAW-P1-02.
- **Открыто (актуально):** MAP-P1-01..20 (частично), AVRAAM-P1-*, ENGINE-P1-26/27/29, RIVER-P1-01..04, QUAL-P1-01/03/05/06/08/09, DRAW-P1-01/03, BASE-P1-01..03, ARCH/SVG/TEXT/MINI/WAYP/SIG/REG/PERF/UI/RELIEF/ROUTE/GLYPH/GRAT/SEA/ORN/HALO/MEDIA/LOD-P1-*, P2-строки (AVRAAM-P2-01, HUB-P2-01, MAP-P2-02, ENGINE-P2-03/04, QUAL-P2-02/04) — суммарно ~55 строк.
- ⚠️ Witness'ы большинства строк (`c2c339708252`, `32ae0d7d`) устарели на 638+ коммитов (SD-7) — нужен батчевый exact-HEAD reverify до repair.
- **Вердикт:** **актуально**, это основной открытый фронт.

### A11 — Series navigation → 🟡 в основном закрыто
- `SERIES-CAPABILITY-INTERFACE` (PR #319, issue #300 closed) ✅, READER-R3-SERIES-FACADE ✅, READER-R4-PUBLIC-SURFACE-REGISTRY ✅, `DATA-SERIES-DRIFT` ✅.
- **Открыто/актуально:** `S-T-01` (partial — route-level паритет гейтов для Astro-мира), `AR-IDX-04` (Astro-навбар потерял `h-nav-fav`).
- **Вердикт:** ядро закрыто; два остатка актуальны (P1/P3).

### A12 — Print/PDF → ✅ закрыто
- `ORCH-DUPLICATE-PRINT-SURFACE-OWNERS` (PR #283, #280 без merge, #286 `f5e29998`) ✅, `PRINT-REVERSIBLE-BACK-3D-FLOW` (физические front/back, Chromium/WebKit) ✅. Диспозиция 07-28.
- **Вердикт:** закрыто.

### A13 — Mobile WebKit a11y → 🟡 частично
- **Закрыто:** `READER-PUBLIC-SURFACE-BROWSER-01` (все-роутное Android/iPhone WebKit 2660/2660), `HOME-BROWSER-LIFECYCLE-RESIDUAL` (capability-aware BFCache, PR #405), WebKit-покрытие маршрутов.
- **Открыто/актуально:** `CI-WEBKIT-TOC-NONDETERMINISTIC` (P2, 08-04 — харнесс-недетерминизм), `AR-IDX-JS-01` (pagehide на iOS), `MAP-P1-19` (mobile landscape 844×390), `AVRAAM-P1-05` (short landscape блокируется оверлеем).
- **Вердикт:** WebKit-база закрыта; 4 остатка актуальны.

### A14 — Release governance → 🟡 транзакция ✅, контрольный слой нет
- **Закрыто:** `PROD-STALE-DEPLOY-RED` (PR #125/#128/#131), `DEPLOY-CACHE-BUST-RECONCILE-01`, `CI-ASSET-REVISION-PREMERGE-01`, `CI-BUILD-VALIDATION-DUPLICATION` (build-once, PR #370), `D-8` (deploy paths теперь `**`), `AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP`.
- **Открыто/актуально:** `D-1` (deploy `pages` vs indexnow-группы — разные concurrency-группы, race не закрыт), `AUDIT-P2-WORKFLOWS-CHECK-GAP` (regex вместо YAML-топологии — W1), `CI-WORKFLOW-PROLIFERATION` (26→42 воркфлоу), `BUG-SEO-001` (IndexNow до CDN), и **живой красный CI**: issue #357 «Runtime Interactive Audit [branch main]» открыт с 25.07 (59 комментов), свежие failure-ранны; #1041–#1044 на PR #1039/#1040.
- **Вердикт:** «релизная транзакция» закрыта, «контрольный слой» — **актуален** (красный CI блокирует доверие новым closure).

### A15 — Discovery followups → 🟡 ядро ✅, лейны открыты
- **Закрыто:** AR-IDX-01/02 (hreflang, SearchAction — PR #675), SEARCH-P2-09 (PR #968), SEARCH-P1-03 (PR #890), SEARCH-P1-04 (PR #895+#899 — Scripture-индекс 980/2355/73), SEARCH-P2-08 (PR #901 — legacy verses.json удалён).
- **Открыто/актуально:** SEARCH-P1-01 (палитра на 4 tool-роутах), SEARCH-P2-07 (разрежённый Bible-корпус, 197 warning), SEARCH-P2-10/11/12 (combobox/listbox, top-layer modal, touch 44px), SEARCH-P3-01/02 (wording, cap результатов).
- **Вердикт:** ядро закрыто; поисковые лейны — **актуальны** (часть адресуется открытым PR #1039).

### A16 — A04 residual → 🔴 актуально
- Это ровно пункты открытого umbrella **#61**: (1) AT-экспозиция неактивных speed/search контролов, (2) radiogroup roving keyboard + popup-семантика, (3) favorites store/metadata.
- Прямо по ним открыты PR: **#1039** (accessible command palette) и **#1040** (canonical favorite store) — **оба с красным CI** (#1041–#1044).
- **Вердикт:** **актуально**; не закрыто, и текущие попытки закрытия пока не проходят CI.

### A17 — Home component lab → 🟡 частично
- **Закрыто:** `HOME-BROWSER-LIFECYCLE-RESIDUAL` (PR #405), home effects с одним владельцем (PR #1016), refutations геометрия (PR #991), refutations V3 depth (PR #958), SearchAction home (PR #968).
- **Открыто/актуально:** `AR-IDX-CSS-02` (overflow-x клиппит scripture-bg), `AR-IDX-CSS-03` (3s fallback reveal), `AR-IDX-04/06/08`, `AR-IDX-A11Y-01`, `AR-IDX-JS-01/02`, `AR-IDX-PERF-01/02`, `AR-IDX-03/05/07/09/10`. Открыт тестовый PR #1045 (live Home parity).
- **Вердикт:** базовый Home-цикл закрыт; ~13 AR-IDX-строк — **актуальны**.

---

## Сквозные оговорки по актуальности

1. **Волна от 07-28..08-01 — часть выводов перекрыта** закрытиями 08-02..08-05 (ReaderProjection #990, legacy #1005/#1013/#1032, SEARCH-волна, waves A–F @ `f9d01207`). Т.е. A04/A05/A15 местами «устарели в сторону сделано».
2. **Anchor дрейф:** матрица записывает source `92c4939c`, фактический main `4ce39dc8`; production anchor `38b25703`, при этом деплой `92c4939c` уже прошёл, `4ce39dc8` — в прогоне. Любые новые closure требуют exact-HEAD reverify на актуальном main.
3. **Красный CI блокирует:** #357 (main), #1041–#1044 (открытые PR) — пока красный, новые «confirmed-current/repair-ready» нельзя объявлять по-настоящему.
4. **Karty-кластер требует пересвидетельствования:** ~55 строк на witness'ах, устаревших на 638+ коммитов (SD-7: батчевый reverify-лейн).
5. **Прямой ответ на вопрос:** **нет, закрыто не всё.** Закрыто ~226/371 канонических строк + 6 тем волны полностью; актуальны: Karty (A10), #61-остаток (A16), красный CI, D-1/workflow-контроль (A14), поисковые лейны (A15), AR-IDX-Home (A17), WebKit-остатки (A13).

*Документ сформирован как untracked-файл в рабочем дереве; коммиты/пуши не выполнялись.*
