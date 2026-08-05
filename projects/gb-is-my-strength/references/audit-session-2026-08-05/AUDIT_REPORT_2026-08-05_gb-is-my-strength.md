# Тотальный аудит AuditRepo — состояние относительно задач

**Дата:** 2026-08-05 · **Фокус:** `FedorMilovanov/gb-is-my-strength` (gospod-bog.ru)
**Аудиторская база:** локальный checkout `AuditRepo` @ `1392037` (ветка `arena/019fd2bb-auditrepo`), полная история подтянута с `origin/main` (944 коммита), source-репо проверен через GitHub API.
**Статус:** отчёт сформирован, **ничего не запушено и не закоммичено** (по требованию «пока не пуш никуда»).

---

## 0. TL;DR

| Блок | Вердикт |
|---|---|
| Матрица багов gb-is-my-strength | ✅ консистентна: **371 = 226 закрыто + 145 открыто** (P0: 0, P1: 70, P2: 29, P3: 39, рефакторинг: 4, AuditRepo: 3); `check_matrix_coverage.py` PASS |
| Валидаторы AuditRepo | ✅ `validate_audit_repo.py` PASS, `check_auditrepo_structure.py` PASS (2 legacy-пустых скаффолда — не блокируют) |
| CI AuditRepo на GitHub | ⚠️ `auditrepo-validate` ✅, но временный `_temp-reconcile-production-closure-main.yml` ❌ **красный на main** (остался хвост control-plane) |
| Source-якорь | ⚠️ **main ушёл вперёд**: записан `92c4939c` (PR #990), фактический main `4ce39dc8` (PR #1036) — +1 коммит |
| Production-якорь | ⚠️ записан `38b25703` (run 30960174778), но на GitHub уже прошёл деплой `92c4939c` (success) и **идёт деплой `4ce39dc8`** — authority устарела |
| Открытые PR source | 🔴 #1039 (search palette), #1040 (favorites store), #1045 (home parity) — у первых двух **красный CI** (#1041–#1044) |
| Открытые issue source | 🔴 #357 «CI failure: Runtime Interactive Audit [branch main]» открыт с 25.07 (59 комментариев); #54, #61, #298 |
| Необработанные intake | ⚠️ 4+ пакета без единого упоминания в матрице: `gpt-5-6-current-head-bug-reverify`, `auditor-brain`, `arena-sync-assessment` (SD-1..15), `gpt-5-6-jay-adams-heart-research` (hold) |
| Волны SUPER_AUDIT W1–W10 | ⚠️ документ **заморожен на 07-06**: ни одной per-wave CLOSED-метки (нарушение его же §7); матрица говорит «W1 still empirically blocking», хотя половина W1-целей закрыта |
| Ветки source-репо | ⚠️ 36 не-main веток (`lane/*`, `transport/*`, `ci/*`, `agent/*`, `archive/*`), в основном от 08-01/08-05 — известный D-20-паттерн |

---

## 1. Что это за репозиторий и его правила

`AuditRepo` — мультиагентный слой координации аудитов. Правила (прочитаны и применены в аудите):

- **`README.md`** — Freedom-with-Evidence, многоуровневая верификация L0→L4, SHA-First, обязательный intake-путь `projects/<project>/incoming/<agent>/<YYYY-MM-DD>/`.
- **`SANDBOX-ENV-2026-06-21.md`** — паспорт среды (Node, build-mode ловушки: strangler-build, а не plain `astro build`).
- **`PROJECT_REGISTRY.md`** — реестр проектов: `gb-is-my-strength` (active) и `the-legendary-poet` (active).
- **`CLEANUP_RETENTION_POLICY.md`** — archive, don't delete; **§8 Single-Writer-Per-Fact** (один владелец на факт, остальные ссылаются).
- **`CONCURRENT_EDIT_PROTOCOL.md`** — pull→read→edit→pull→push; зонная собственность матрицы.
- **`MULTI_WITNESS_VERIFICATION_PROTOCOL.md`** — 2–3 свидетеля с разных ракурсов; 1 сильное browser-воспроизведение на production-like dist.
- **`CONTRIBUTING.md`** — incoming=raw, working=synthesis, verified=truth; не перескакивать.
- Проектные: **`projects/gb-is-my-strength/DOC_MAP.md`** (карта + SSOT), **`verified/MASTER_BUG_MATRIX.md`**, **`NEXT_AGENT_PROMPT.md`**, **`verified/SUPER_AUDIT_2026-07-06_14a49be8.md`** (волны W1–W10), **`PremiumControls/README.md`** (owner-зона, freeze).
- Source-репо: **`AGENTS.md`** (lane-контракт, branch safety, authority order) и `docs/OWNER-INVARIANTS.md`.

---

## 2. Методика

1. Полная история `git log --all` (944 коммита, 2026-06-12 → 2026-08-05; по месяцам: 258 / 616 / 69).
2. Все ветки: AuditRepo (main + arena-ветка), source `gb-is-my-strength` (36 не-main), `the-legendary-poet`.
3. Запущены штатные валидаторы: `validate_audit_repo.py`, `check_auditrepo_structure.py`, `check_matrix_coverage.py`, `repository_history_forensic_audit.mjs` (последний — **не работает** в песочнице: `TypeError: fetch failed`).
4. Сверка канона: MASTER_BUG_MATRIX (closed/open, счётчики, session log), NEXT_AGENT_PROMPT, SUPER_AUDIT, DOC_MAP, PremiumControls.
5. GitHub API source-репо: коммиты main, открытые PR/issues, ветки, статусы деплоя, CI-ранны.
6. Инвентаризация необработанных intake-пакетов (0 упоминаний в матрице).

---

## 3. Состояние самого AuditRepo (инфраструктура)

### 3.1 Git-состояние

- Локальный HEAD `1392037` = `audit(reader): record ReaderProjection source closure (#182)`.
- Локальная ветка `arena/019fd2bb-auditrepo` и локальная `main` — на одном коммите.
- **`origin/main` на 1 коммит впереди**: `89725f6 audit(tlp): close W3 community scaling` (закрытие W3 у the-legendary-poet). Локальный checkout отстаёт.
- Working tree чистый, стэшей нет.

### 3.2 Валидаторы и CI

| Проверка | Результат |
|---|---|
| `validate_audit_repo.py` | PASS, но 2 legacy-долга: пустые скаффолды `incoming/arena-auditor/2026-07-06/REPORT.md`, `incoming/claude-genealogy-atlas-strategy/2026-07-17-r1/REPORT.md` |
| `check_auditrepo_structure.py` | PASS |
| `check_matrix_coverage.py` | PASS: 371 canonical / 226 closed / 145 open; evidence 397; registry 52 |
| CI `auditrepo-validate.yml` | ✅ success на main (2026-08-05 16:22) |
| CI `_temp-reconcile-production-closure-main.yml` | ❌ **failure на main** — временный reconciler не убран |

### 3.3 Гигиена AuditRepo (находки)

- **AR-HYGIENE-01 — временный control-plane хвост:** `.github/workflows/_temp-reconcile-production-closure-main.yml` + триггер `.github/_temp-production-closure-main-trigger` всё ещё в main и **падают в CI** (последние 8 раннов — failure). Проект сам для себя зафиксировал паттерн «удалять временный control plane» (см. коммиты `cb07de0`, `ee85c7f` для SEARCH-P2-09) — здесь то же самое не доделано.
- **AR-HYGIENE-02 — projects/code-audit не в реестре:** папка `projects/code-audit/` (source `3stoneBrother/code-audit`, status `intake-only`, создан 2026-07-02) **отсутствует в `PROJECT_REGISTRY.md`**. Registry перечисляет только gb + tlp.
- **AR-HYGIENE-03 — forensic-скрипт неработоспособен:** `scripts/repository_history_forensic_audit.mjs` падает с `fetch failed` (сетевая зависимость на GitHub API); в песочнице его нельзя прогнать.
- **AR-HYGIENE-04 — устаревшие артефакты:** `_OWNER_DOWNLOADS/gb-floating-cluster-LATEST-REPORTS-2026-06-27.zip` от 27.06; `references/*.md` от 2026-07-28 — вне DOC_MAP и канона (не вредят, но не в карте).
- **AR-HYGIENE-05 — открытые задачи по самому AuditRepo:** AR-001 (validate hardening), AR-004 (verification automation), AR-005 (reverify automation) — не закрыты (W10).

---

## 4. gb-is-my-strength — инвентарь задач и статус

### 4.1 Источники задач

1. **`SUPER_AUDIT` (W1–W10)** — системный бэклог от 07-06: релизная транзакция, даты/metadata, SW/кэш, route registry, XSS, Bible-корпус, семантические гейты, schema/SEO, a11y/perf/TTS/MapEngine, автоматизация AuditRepo.
2. **`MASTER_BUG_MATRIX`** — канонические открытые строки (145).
3. **`NEXT_AGENT_PROMPT`** — активные bounded лейны: остаток Reader controls (#61), поисковые лейны (SEARCH-P1-01, P2-10/11/12, P2-07), P3-polish.
4. **Issue source-репо**: #61 (Reader umbrella), #54 (Hermenevtika), #298 (P1 visual goldens), #357 (CI Runtime Interactive на main), #1041–#1044 (CI-падания открытых PR).
5. **Открытые PR source**: #1039 (accessible command palette), #1040 (canonical favorite store), #1045 (live Home parity test).
6. **Owner-зона**: PremiumControls / Floating Cluster (freeze, PC-CURRENT-02..05).

### 4.2 ✅ Что СДЕЛАНО (226 закрытых строк + системные закрытия)

**Волна 08-04/08-05 (последние 2 дня) — закрыто ~30 строк:**
- **TTS delivery/runtime** (`TTS-DL-UNZIP-SYNC`, `TTS-DL-NO-TABLOCK`): PR #876 + #929 → worker-owned acquisition/extraction/IDB/ORT/inference, SharedWorker-first, max UI gap 32.7 ms; production-live на `38b25703` (run `30960174778`), live-артефакты `8912993840`/`8912994737`. ✅
- **ReaderProjection** (intake-кластеры из PR #169): PR #990 (`92c4939c`) — source 68/68, browser 144/144, tooltip handoff 19/19; squash-merge 6 блобов = exact tested head. ✅ (без production-claim)
- **Search**: `SEARCH-P2-09` (PR #968 — честный SearchAction `/?q=` на Home), `SEARCH-P1-03` (PR #890 — честные «Ссылки в материалах», 4 манифест-бэкенд-подсказки), `SEARCH-P1-04` (PR #895+#899 — детерминированный Scripture-индекс: 980 канон. ссылок, 2355 вхождений, 73 роута), `SEARCH-P2-08` (PR #901 — удалён legacy `data/verses.json`, строгий контракт). ✅
- **Nagornaya**: `NG-DARK-01` (PR #887 — 134 governed `!important`, Chromium 384/384), `NG-CSS-01`, `NG-INLINE-02`, `NG-STRUCT-02`, `NG-MOBILE-01`, `NG-VIS-05/06/07/08` (консолидация). ✅
- **Karty/MapEngine P0/P1**: `MAP-P0-02..08`, `ASTRO-P0-01/02` (PR #96/#97), `ASTRO-P0-05` (PR #203), `ENGINE-P1-28`, `MAP-P1-14/15`, `CSS-P1-01` (PR #709), `A11Y-P1-01` (PR #759), `GATE-P1-01/02/04`, `QUAL-P1-07` (PR #666), `RIVER-P1-05`, `HUB-AUDIT-COUNT-DRIFT`, `NF-SPEEDSLOT-4TH-COPY` (волны A–F reverify на `f9d01207`). ✅
- **Reader/overlay**: `READER-R1-PREFERENCES-01` (PR #101), `READER-R3-SERIES-FACADE-01` (PR #102), `READER-R4-PUBLIC-SURFACE-REGISTRY-01` (PR #103), `READER-R5-OVERLAY-RUNTIME-01` (PR #104), `SPECIAL-OVERLAY-ADAPTERS-01` (PR #106). ✅
- **Релизная транзакция**: `PROD-STALE-DEPLOY-RED` (PR #125/#128/#131), `DEPLOY-CACHE-BUST-RECONCILE-01` (PR #108), `CI-ASSET-REVISION-PREMERGE-01` (PR #109), `D-8` (stale — deploy paths теперь `**`), `READER-ROUTE-SEMANTICS-01`, `NG-PREMIUM-CONTROLS-ARIA-01` и др. ✅
- **Глоссарий/безопасность**: `D-21` (0 `innerHTML`, allowlist-рендер). ✅
- **Governance**: `AR-CI-RED` закрыт 07-14 (красный CI AuditRepo починен), W0 (гигиена правды: DOC_MAP, Single-Writer, матрица консолидирована). ✅

**Динамика счётчика:** закрыто ~144 (07-06) → **226** (08-05); открыто 167 → **145**.

### 4.3 ❌ Что НЕ сделано (145 открытых; группировка по кластерам)

| Кластер | Кол-во (оценка) | Ядро |
|---|---|---|
| **Karty / MapEngine** (P1+P2) | ~55 | `MAP-P1-01..20`, `AVRAAM-P1-01..05`, `ENGINE-P1-26/27/29`, `RIVER-P1-01..04`, `QUAL-P1-01/03/05/06/08/09`, `DRAW-P1-01/03`, `BASE-P1-01..03`, `ARCH/SVG/TEXT/MINI/WAYP/SIG/REG/PERF/UI/RELIEF/ROUTE/GLYPH/GRAT/SEA/ORN/HALO/MEDIA/LOD-P1-*`; P2: `AVRAAM-P2-01`, `HUB-P2-01`, `MAP-P2-02`, `ENGINE-P2-03/04`, `QUAL-P2-02/04`. Долгострой «karty-Atlas», ведётся отдельно. Witness: browser `c2c339708252`, source `32ae0d7d` (оба **устарели**: 638+ коммитов позади — см. SD-7). |
| **Search** | ~9 | `SEARCH-P1-01` (палитра на `/karty/avraam/`, `/karty/ishod/`, `/konfessii/russkij-baptizm/`, `/map/`), `SEARCH-P2-07` (разрежённый Bible-корпус: 24 книги без файлов, 197 warning), `SEARCH-P2-10/11/12` (combobox/listbox, top-layer modal, 44px touch), `SEARCH-P3-01/02/...` (label wording, cap результатов). |
| **Reader controls (umbrella #61)** | 3 пункта | (1) убрать неактивные speed/search контролы из Tab/AT-экспозиции; (2) radiogroup roving keyboard + честная popup-семантика (mobile Play `aria-haspopup` без `aria-controls`); (3) favorites metadata → канонический route metadata/store контракт. |
| **Nagornaya** | ~10 | `NG-STRUCT-01` (сломанные обёртки секций), `NG-INLINE-01` (inline-цвета ×5), `NG-A11Y-01` (emoji-иконки), `NG-CROSS-01`, `NG-TOC-01`, `NG-SERIYA-01`, `NG-SEO-01`, `NG-DEAD-01` (15 мёртвых компонентов), `NG-VIS-10`. |
| **Home / Index** | ~12 | `AR-IDX-03..10`, `AR-IDX-JS-01/02`, `AR-IDX-PERF-01/02`, `AR-IDX-A11Y-01`, `AR-IDX-CSS-02/03`, `STRANGLER-HYGIENE` (50/53 legacy-дублей). |
| **CI / control plane** | ~7 | `CI-WORKFLOW-PROLIFERATION` (26→42 воркфлоу!), `AUDIT-P2-WORKFLOWS-CHECK-GAP` (regex-гейты, нет YAML-топологии — W1), `S-T-01` (partial), `BUG-SEO-001` (IndexNow до CDN), `D-1` (concurrency-группы всё ещё разные — W1-остаток), `D-2` (css-layer validator), `GATE-MARKER-DATA-DRIFT`, `CI-WEBKIT-TOC-NONDETERMINISTIC`. |
| **Бюджеты/перф** | ~8 | `NEW-CSS-BUDGET-01` (CSS 554КБ > 425КБ budget), `D-3` (JS 469КБ > 365КБ), `D-4` (magic z-index), `R-001..R-004` (монолиты, source maps, modules), `AUDIT-CSS-DEAD-KEYFRAMES-TOKENS`, `AUDIT-CSS-GBFLOATER-DUP-MEDIA`, `AUDIT-JS-ESCAPER-DUP-X5`. |
| **Контент/данные** | ~4 | `GENESIS6-ACTIVATION-OWNER-GAP`, `ATLAS-D-NAMESPACE-COLLISION`, `NEW-OG-SIZE-PARAM` (partial: глобальный allowlist, не per-route), `AUDIT-P3-OG-LCP-MISMATCH`. |
| **Безопасность** | ~2 | `S-SEC-01` (blacklist-sanitizer в enhancements.js), `REG-001` (нет response-level CSP/XFO/Referrer-Policy на Pages). |
| **Разное P3** | ~10 | `NF-DEAD-ENHANCE-SHIM`, `NF-GATE-IZ5-STALE`, `NF-STRANGLER-BAR-DRIFT`, `NEW-HARDTEXTS-CSP-MISSING-HFCDN`, `NEW-HIGHLIGHTS-NO-REINIT-GUARD`, `NEW-SAVE-QUOTE-TIMER-RACE`, `BUG-011`, `NEW-72`, `MAP-P1-20` (narrowed: unversioned `map-engine.js`), `D-19` (antisovetov половина), `D-7`. |
| **AuditRepo (W10)** | 3 | `AR-001`, `AR-004`, `AR-005`. |

### 4.4 Системный бэклог SUPER_AUDIT — фактический статус волн

> ⚠️ **Ключевая находка:** сам документ SUPER_AUDIT **не обновлялся с 07-06** — ни одной метки CLOSED по волнам, хотя его §7 прямо требует «статус здесь менять на CLOSED с witness». Реальное состояние волн реконструировано по матрице и session log:

| Волна | Оценка | Что закрыто / что остаётся |
|---|---|---|
| W0 Гигиена правды | ✅ закрыта | DOC_MAP, Single-Writer, матрица, NEXT_AGENT_PROMPT; D-20-ветки — частично (см. ветки source) |
| W1 Релизная транзакция | ⚠️ **частично** | Закрыты: PROD-STALE-DEPLOY-RED, DEPLOY-CACHE-BUST-RECONCILE, CI-ASSET-REVISION-PREMERGE, D-8. Открыты: D-1 (race deploy↔indexnow), AUDIT-P2-WORKFLOWS-CHECK-GAP, CI-WORKFLOW-PROLIFERATION, BUG-SEO-001, S-T-01 (partial), AR-IDX-05. Матрица честно пишет «W1 still empirically blocking» |
| W2 Даты/metadata | ⚠️ частично | AR-IDX-01/02, DEPLOY-CACHE-BUST закрыты; P0-03 (bot-петля дат)/P0-04 (cache-bust-мутация) — **ID не трекаются в матрице**, статус не ясен |
| W3 SW/кэш | ⚠️ частично | MAP-P1-20 сужен до unversioned `map-engine.js`; D-4, precache-lazy остаются |
| W4 Route registry/sitemap | 🟡 в основном | Реестр стал registry-derived (74 item, SearchAction, sitemap-контракты); BUG-SEO-001 открыт |
| W5 Security/XSS | 🟡 частично | D-21 закрыт; S-SEC-01, REG-001 открыты; IZBRANNOE-*/FAV-POISON-STORAGE судьба не видна в матрице |
| W6 Bible/данные | 🟡 частично | SEARCH-P1-04/P2-08 закрыты; SEARCH-P2-07 (разрежённый корпус), GENESIS6 открыты |
| W7 Семантические гейты | 🟡 частично | S-T-01 partial; GATE-MARKER-DATA-DRIFT открыт |
| W8 Schema/SEO | 🟡 частично | SearchAction честный, OG allowlist; NEW-OG-SIZE-PARAM partial |
| W9 A11y/Perf/TTS/Map | 🟠 TTS ✅, Map ❌ | TTS закрыт полностью; MapEngine P1-кластер (~55 строк) открыт; AR-IDX-PERF-01/02 открыты; PremiumControls на freeze |
| W10 AuditRepo автоматизация | 🔴 не начата | AR-001/004/005 открыты; matrix-coverage tooling уже есть, forensic-скрипт сломан |

### 4.5 Активные лейны и красный CI в source-репо

**Открытые PR (3):**
- **#1039** `fix(search): complete accessible top-layer command palette` (head `agent/search-modal-contract-clean-20260805`) → адресует SEARCH-P1-01/P2-10..12. **CI-падания:** #1041 (Shared Files Guard), #1043 (Runtime Interactive Audit) — сейчас идёт повторный прогон.
- **#1040** `feat(reader): establish canonical favorite store` (head `lane/system-favorites-store-20260805`) → адресует пункт 3 umbrellа #61. **CI-падания:** #1042, #1044 (Shared Files Guard).
- **#1045** `test(release): protect exact live Home candidate parity` (head `agent/live-home-candidate-parity-wave`) — тестовый лейн.

**Открытые issue (8):**
- **#357** «CI failure: Runtime Interactive Audit [branch main]» — открыт с 25.07, 59 комментариев, свежие failure-ранны приходят до сих пор → **живой красный индикатор на main**, требует разбора.
- **#1041–#1044** — CI-падания сегодняшних PR.
- **#61** Reader Projection & Controls umbrella (остаток), **#54** Hermenevtika closure, **#298** P1 visual goldens.

**Ветки:** 36 не-main веток (все от 08-01/08-05): `transport/legacy-*` ×3–4, `lane/system-reader-controls-*` ×5, `lane/system-favorites-store`, `ci/search-modal-contract-compute*` ×4, `lane/system-legacy-reference-path-api[-v2]`, `transport/lifecycle-retired-identities[-v2..v4]` и др. Часть — материал для W6/Branch retirement у tlp-стиля и для D-20-подобной гигиены.

---

## 5. Расхождения и проблемы (drift / gaps)

### D-01. Source main ушёл вперёд от записанного anchor
- Записано: anchor `92c4939c` (PR #990). Факт: main = `4ce39dc8` (**PR #1036** hermenevtika footnote fix, 2026-08-05 16:15).
- Влияние: NEXT_AGENT_PROMPT / матрица формально не на актуальном exact anchor. По правилам проекта это не переоткрывает строки, но требует authority-sync транзакции (как предлагал SD-5) с парным same-SHA reverify.
- ВАЖНО: PR #1036 — это фикс по Hermenevtika (issue #54) — закрывает ли он #54? Issue #54 всё ещё open.

### D-02. Production authority устарела
- Записано: production `38b25703`, run `30960174778`, «no new production/live claim» для ReaderProjection.
- Факт на GitHub: Deploy-ранн на `92c4939c` — **success** (13:18), на `4ce39dc8` — **in_progress** (16:15). Т.е. продакшен, скорее всего, уже ушёл вперёд от записанного `38b25703`, а same-SHA production-witness для новых голов **не импортирован в AuditRepo** (намеренно, но в итоге — дрейф).
- Действие: при следующей сессии — сверить live-артефакты и зафиксировать актуальный production anchor с witness.

### D-03. SUPER_AUDIT заморожен — нет authoritative-статуса волн
- Документ от 07-06, ни одной CLOSED-метки (нарушение §7). Матрица-хедер «W1 still empirically blocking» противоречит тому, что PROD-STALE-DEPLOY-RED и половина W1 закрыты. Нужен либо апдейт волн с witness, либо перенос статуса волн в DOC_MAP-владельца (Single-Writer).

### D-04. Необработанные intake-пакеты (0 упоминаний в матрице)
- **`gpt-5-6-current-head-bug-reverify` (08-01):** BH-04 (heart-series progress fails closed), BH-ATLAS-DEV (canonical Atlas runtime в dev), BH-ASSET (детерминированные Astro-ревизии) — «confirmed source repairs», рекомендованные к фиксу/закрытию; плюс challenges (production XSS wording, empty ReaderRail state, duplicates). **Не влиты в матрицу.**
- **`auditor-brain` (07-25):** CI-ALERT-POST-RECOVERY-ORDERING, FONT-CONTRACT-FIXTURE-AUTHORITY-DRIFT, DEPLOY-LEDGER-PR-WRITE-ACTION-PIN-GAP. **Не влиты.**
- **`arena-sync-assessment` (08-01):** SD-1..SD-15 (в т.ч. SD-5 authority-advance, SD-6/10/11/14 fixed-кандидаты Karty). Формально не применены; часть фактов позже закрыта волнами 08-04 (GATE-P1-01/02/04, QUAL-P1-07, A11Y-P1-01 и т.д.), но SD-4 (AUDIT-P3-OG-LCP-MISMATCH reverify), SD-1/SD-2 (счётчики), SD-7 (батчевый Karty reverify на exact HEAD) остаются нерешёнными.
- **`gpt-5-6-jay-adams-heart-research` (07-29/30):** RESEARCH READY / SITE HOLD — research-интэйк (не баги), ждёт решения владельца по внедрению.
- **`gpt-5-6-source-library` (07-30), `gpt-5-6-home-nagornaya-reverify` (08-01), `gpt-5-6-karty-current-head-reverify` (08-01):** последние два частично покрыты волнами 08-04 (их PR-рекомендации видны в session log), но как intake-строки не отмечены.

### D-05. Красный CI в source
- #357 (main, с 25.07), #1041–#1044 (открытые PR). Пока красный — нельзя объявлять repair-ready/производственные closure новых лейнов без точного witness.

### D-06. Гигиена AuditRepo (см. §3.3)
- Temp-workflow красный, code-audit вне реестра, forensic-скрипт сломан, 2 пустых скаффолда, устаревшие _OWNER_DOWNLOADS.

### D-07. Устаревшие witness у Karty-кластера
- ~55 строк Karty ссылаются на `c2c339708252` / `32ae0d7d` — по данным SD-7 это 638+ коммитов позади текущего main. Требуется батчевый exact-HEAD reverify (SD-7) перед любым repair-лейном.

---

## 6. the-legendary-poet (контекст, коротко)

- Локально: W2-закрытие (последний локальный коммит `1392037` относится к gb; TLP-материалы — `077fe14` и ранее).
- **`origin/main` уже закрыл W3** (`89725f6`, PR #316, production `4544bb3`): W4 (workflow/perf consolidation) активирована, W5–W6 открыты. Локальный checkout отстаёт на 1 коммит.
- Это не влияет на gb-задачи, но при следующем пуше в AuditRepo локальная ветка потребует rebase/merge с origin/main.

---

## 7. Рекомендации (порядок действий, ничего не выполнять без owner-решения)

1. **Sync-транзакция AuditRepo** (по SD-5/D-01/D-02): зафиксировать source main `4ce39dc8` + актуальный production anchor с same-SHA reverify; прописать в NEXT_AGENT_PROMPT.
2. **Закрыть/разобрать красный CI**: #357 на main и #1041–#1044 на PR #1039/#1040; без этого новые closure-лейны недоказуемы.
3. **Обработать 4 необработанных intake** (D-04): BH-*, auditor-brain-*, SD-1..15 — по одному, через proposal → verification → матрицу.
4. **Обновить SUPER_AUDIT** (D-03): проставить волновые статусы с witness или передать статус волн в SSOT (DOC_MAP/матрицу).
5. **Батчевый Karty exact-HEAD reverify** (SD-7/D-07) — пересвидетельствовать ~55 строк на актуальном main, сузить/закрыть.
6. **Гигиена AuditRepo** (D-06): удалить temp-workflow, внести code-audit в реестр или заархивировать, починить/задокументировать forensic-скрипт, обновить _OWNER_DOWNLOADS, обработать 2 пустых скаффолда (дозаполнить или заархивировать по CLEANUP §7).
7. **Branch hygiene source**: разобрать 36 не-main веток по `docs/BRANCH_LIFECYCLE_V4.md` (какие слиты/мёртвые — transport/lane/ci хвосты от 08-05).

---

## 8. Приложение — команды и evidence

```bash
# История/ветки AuditRepo
git log --all --oneline | wc -l        # 944 (после --unshallow)
git branch -a                           # main, arena/019fd2bb-auditrepo, origin/main(+1)

# Валидаторы
python3 scripts/validate_audit_repo.py       # PASS (2 legacy-скаффолда)
python3 scripts/check_auditrepo_structure.py # PASS
python3 scripts/check_matrix_coverage.py     # PASS: 371 = 226 closed + 145 open

# Source-репо (GitHub API)
gh api repos/FedorMilovanov/gb-is-my-strength/commits?per_page=20   # main HEAD 4ce39dc8 (#1036)
gh api .../pulls?state=open                # #1039, #1040, #1045
gh api .../issues?state=open               # #357, #54, #61, #298, #1041–1044
gh api .../branches?per_page=100           # 36 не-main веток
gh run list -w "Deploy to GitHub Pages"    # 92c4939c success; 4ce39dc8 in_progress
```

*Документ сформирован как untracked-файл в рабочем дереве; коммиты/пуши не выполнялись.*
