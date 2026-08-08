# Глубокий аудит AuditRepo — детальный разбор правил, проектов, нюансов и несогласованностей

**Дата:** 2026-08-08 (UTC, аналог времени пользователя)  
**Ветка анализа:** `arena/019fe0b5-auditrepo` → база `e50c4c9385944651577f89c27fcbcaaf80f94d7a` (`main`)  
**Автор:** Arena Agent (deep-study)  
**Метод:** чтение 100% governance-документов, парсинг validator'ов (`validate_audit_repo.py`, `matrix_coverage_lib.py`, `check_auditrepo_structure.py`, workflows), инвентаризация `projects/` (2 897 файлов), проверка `verified/MASTER_BUG_MATRIX.md` + `MATRIX_ID_ALIASES.json` + `SYSTEM_THEMES.md` + `WORK_QUEUE.md` + `CLOSURE_LEDGER.md` + всех `verification/`/`reverify/`/`legacy/` волн, прогон живых валидаторов.

---

## 0. Резюме в одном экране

**AuditRepo — это не зеркало Product и не музей багов.** Новый operating model (2026-08-06) окончательно переопределил его как **evidence-memory слой**:

```
many audit passes → evidence → verification wave → deduplicate / root-cause
→ compact active MASTER → implement / decide → verify result → retire to legacy
MASTER — маленький рабочий блокнот (только verified necessary work здесь и сейчас)
legacy — searchable, но никогда не backlog
WORK_QUEUE — optional, не второй баг-матрикс
```

**Здоровье на 2026-08-08:**

| Проверка | Результат |
|---|---:|
| `validate_audit_repo.py` | **PASS** |
| `check_auditrepo_structure.py` | **PASS** |
| `check_matrix_coverage.py` (gb-is-my-strength, compact schema) | **PASS** — 15 active ids, 0 closed rows, 0 проблем |
| `check_matrix_coverage.py` (the-legendary-poet, legacy schema) | **PASS** — 0 active ids, 0 проблем |
| `matrix_coverage_contexts` | 0 unresolved IDs |
| `MATRIX_ID_ALIASES.json` | 52 записи: 0 alias, 9 informational, 39 retired, 4 false-positive — валидно |

**Но PASS ≠ отсутствие рисков.** Главный текущий риск — не validator, а **скрытые системные блокеры, которые зелёный CI не ловит** (детально §5.3). Второй риск — **двойная схема MASTER** (compact vs legacy) и **дрейф волн по разным Product anchor'ам** без единого канонического current-head.

---

## 1. Правила AuditRepo — что реально требуют 8 governance-документов

### 1.1 Ядро: `AUDITREPO_OPERATING_MODEL.md` (248 строк) — единственный канон

Ключевые тезисы и их нюансы:

1. **Разделение ответственности** — Product владеет кодом/HEAD/PR/CI/deploy; AuditRepo владеет только evidence, verification, causal-моделью, **одной** активной матрицей на проект, Work Queue и legacy.
   - Нюанс: `AuditRepo не обязан переписывать глобальный Product HEAD после каждого коммита.` — поэтому исторические `CURRENT_HEAD_REVERIFY_2026-07-xx_*.md` — evidence at anchor, не обязательство поддерживать freshness. Множество агентов ошибочно считает `main` move → надо переписывать Matrix. Правило прямо запрещает.
2. **Матрица — рабочая очередь, не архив.** В MASTER разрешены только `current-local`, `systemic-root`, `owner-decision`, narrowed residuals, verified necessary improvements. Запрещены `closed-by-fix`, `absorbed`, `duplicate-symptom`, `stale`, `invalid`, `not-worth-fixing`, suspected-only. 
   - Нюанс: `Если 30 симптомов — один root cause, keep one SYS-* row` — принципиальный переход от counting-культуры (100+ строк) к root-культуре (15 строк в gb, 0 в tlp).
3. **Optional work queue** — performance ideas, refactors, polish — только в `WORK_QUEUE.md`. В MASTER попадают только если verification доказала necessity.
4. **Evidence: независимые углы, а не количество агентов.** W1 surface, W2 source, W3 artifact, W4 browser/runtime, W5 lifecycle/root-cause, W6 history. Security/rights/data-loss/release — 2-3 угла; P2 — один strong witness + mechanism; P3 — screenshot/measurement.
   - Критичный анти-паттерн: *три агента с одним grep = один угол*.
5. **Collision rule** — перед любой Product lane: проверить open PR/branches, определить owner/shared files, не создавать параллельный SYSTEM fix.
6. **Branch/PR forensic — периодично, не ритуал после каждого merge.** Не держать десятки stale branches.
7. **Automation: обычный PR — только структура/validator; глубокий forensic — только когда меняется соответствующий owner или запускается consolidation wave.** Запрет на `write-capable workflow ради Markdown-правки`.
8. **Closure:** локальный finding — surface checked + mechanism known + fix merged + regression witness + row removed; системный — общий mechanism + общий owner/process/contract + representative manifestations + class-level guard + absorbed rows removed.

### 1.2 Остальные 5 документов — не дубли, а специализации

| Документ | Роль | Тонкий момент |
|---|---|---|
| `CONTRIBUTING.md` | workflow `incoming → working → verification → reverify → MASTER → legacy` | Повторяет, что MASTER — не только баги, но и verified necessary implementations; raw reports остаются доказательством даже если опровергнуты |
| `CLEANUP_RETENTION_POLICY.md` | где что хранить | Чёткое правило: solved/stale/superseded удаляются **в той же wave**; полагаться на Git history, не копировать старые таблицы; `legacy/` намеренно searchable, но не удалять полезное legacy ради визуальной компактности |
| `MULTI_WITNESS_VERIFICATION_PROTOCOL.md` | 6 типов свидетелей (W1-W6) + proportional bar | Таблица sufficient evidence для security/P1/P2/P3/system/audit-defect — единственный источник для спора "хватит ли одного скрина?" |
| `CONCURRENT_EDIT_PROTOCOL.md` | как параллелить агентов без логических перезаписей | **Отдельные слои поверх одного shared file**: raw → `incoming/<agent>/<date>/`, synthesis → `working/`, system → `SYSTEM_THEMES.md`, queue → `WORK_QUEUE.md`, closure → `CLOSURE_LEDGER.md`. Матрица трогается узко и только по явным ID/секциям. Append-only для history. Запрет на временные GitHub Actions writers. |
| `PROJECT_REGISTRY.md` | только стабильная ориентация | Хранит `project folder → source repo → status → Start here`. Не дублирует HEAD/counts/PR — они живут в source. Статусы: `active/intake-only/synthesizing/paused/archived`. Сейчас `gb-is-my-strength active`, `the-legendary-poet active`, `code-audit` нет в registry но существует как `intake-only` фактически. |

### 1.3 Sandbox & templates

- `SANDBOX-ENV-2026-06-21.md` (v9, verified 2026-07-04) — E2B microVM (2 vCPU/2 GB), Node 20→22 workaround, `strangler:build:production-like` trap, git survival, Playwright. Нюанс: **это не часть канона AuditRepo**, а operational manual для агента в песочнице. Хранить его в репо удобно, но его `Historical reference (archived content)` секция — архив, не правило.
- `projects/_templates/*` (11 шаблонов) — `AGENT_REPORT_TEMPLATE`, `BUG_MATRIX_TEMPLATE`, `VERIFIER_SYNTHESIS_TEMPLATE` и т.д. — scaffolding, не authority.

**Общая несогласованность governance:** все 5 документов ссылаются на `AUDITREPO_OPERATING_MODEL.md` как канон, но `PROJECT_META.yml` внутри gb-проекта вводит свой `trust_order` и `minimum_witnesses_for_confirmed_current: 2` — дублирует и слегка сужает operating model (см. §5.1.2).

---

## 2. Проекты — архитектура и текущее состояние

### 2.1 `projects/gb-is-my-strength` — flagship (gospod-bog.ru)

**Мета:** `FedorMilovanov/gb-is-my-strength`, `main`, prod `https://gospod-bog.ru`, Astro + strangler (native routes + legacy/static), production-like verification = `strangler:build:production-like`, а не plain `astro build`.

Структура (16 топ-entries, 2 897 файлов суммарно в репо):
```
gb-is-my-strength/
├── DOC_MAP.md · README.md · PROJECT_META.yml · WORK_QUEUE.md
├── NEXT_AGENT_PROMPT.md (compatibility entrypoint)
├── PremiumControls/ (spec + screenshots)
├── passes/ · research/ · references/ · forensics/
├── incoming/ (40+ agent/date) · working/ (atlas/ + 15+ синтез-файлов + audit.py)
├── verification/ (34 wave-папки 2026-08-06 → 2026-08-08)
├── reverify/ (140+ CURRENT_HEAD_REVERIFY_*.md)
├── verified/ (MASTER 22k + SYSTEM_THEMES 8k + CLOSURE 10k + SUPER_AUDIT 36k + др.)
├── legacy/ (5 файлов) · archive/ (20+ исторических свалок) · repairs/
```

**Start here по задумке:** `MASTER_BUG_MATRIX.md` → `DOC_MAP.md` → `WORK_QUEUE.md` → `SYSTEM_THEMES.md` → `incoming/verification/reverify` → `legacy/`.

**Текущая MASTER (commit `e50c4c9`, Product anchor `11999f6d674e64e6afef590adeb71aeaaf303b3a`, Research authority `d52ea9d...`, wave `post-S12 live refresh 2026-08-08`):**

| Срез | Count | Детали |
|---|---:|---|
| **Active work units** | **15** |  |
| Direct current defects | 2 | `BAPT-S12-01` (Spravochnik metadata residual), `CATALOG-PROJECTION-01` (#1221) |
| Verified necessary improvements | 3 | `SEARCH-P3-02` (#1209, behind=0 но PR body stale), `AR-IDX-05` (per-asset revision), `AUDIT-JS-ESCAPER-DUP-X5` (5 escapers) |
| Narrowed residuals | 0 | — |
| System verification lanes | 7 | `SYS-CURRENT-GOLD-READINESS`, `SYS-READER-CONTROL-SEMANTICS`, `SYS-FOOTNOTE-SEMANTIC-PROJECTION`, `SYS-BAPTISTY-PUBLICATION-READINESS`, `SYS-KARTY-HOLDING-PUBLICATION-READINESS`, `SYS-STRANGLER-RETIREMENT`, `SYS-SOURCE-AUTHORITY-TRIGGER-CLOSURE` |
| Owner decisions | 3 | `SEARCH-P2-07` (Bible corpus), `REG-001` (hosting headers), `NG-VIS-04` (Nagornaya prose) |
| Closed/stale/duplicate/absorbed in MASTER | 0 | hygienic — history в legacy/Git |

**In-Flight барьеры (раздел MASTER, критично для collision):**

- `#1209` Search continuation: head `12896c2e...`, behind=0, writer-transport gone, но PR body stale (`1f14761a`/`882d904`) — merge только после exact-head green + refresh body + deterministic projections. На более свежем снепшоте `ee7f1e0b`/`c8caefe` имел 84 файла + self-writing workflow — hard blocker.
- `#1221` Catalog projection: head `0c779df...`, behind=2, 67/73 manifest rows divergent — systemic field-parity root, не thumbnail.
- `#1222` Strangler Wave A: head `22983986...`, behind=0, 5 файлов, 7/7 CI зелёных, но **не merge-authorized** из-за скрытого self-verifier (`legacy-shadow-retirement-readiness.mjs` читает governed bytes через `path.join` но classified `none-fixture-policy-or-comment-only` → 0 blockers → false `physicalMoveAuthorized`). Требует ledger fix или verifier migration. Комментарий `5225397646`.
- `#1240` Gill mobile Back: `f91507fb...`, behind=2, 2 файла, 174 manifestations — нужно refresh + exact-head CI.
- `#1246` relation-state: `3cd81b29...`, behind=2, 2 файла, 64/70 `aria-controls`.
- `#1212` census aurge: audit-only, 887 raw → маленькие roots, 124 click-failed contaminated, 207 size-prefilter, 12 runtime noise — не Product defects без изоляции.
- `#1244` Source Authority guard-health, `#1245` merged `11999f6d`, `#1238` merged (5 MDX/body S12 markers), `#1237` closed unmerged diagnostic (67/73 inventory), `#1220` merged, `#1228` closed unmerged (wrong layer), `#1223` diagnostic npm.

**Верификация:** 34 папки `verification/2026-08-*` — последние 9 волн (см. `ls verification`) cover S12, manifest parity, Strangler, reader-census, Current-Gold, discovery, home/control-plane. Каждая с `REPORT.md` (10-20k). Репрезентативные: `2026-08-08-reader-control-census-root-clustering` (7020 observations, 887 manifestations, 8 root clusters), `2026-08-08-reader-control-semantics-current-root` (6 manifestations, Product issue `#1224`), `2026-08-08-strangler-self-verifier-hidden-blocker`, `2026-08-08-post-s12-manifest-parity-search-writer` (самый объёмный, с S12 residual + manifest 67/73 + catalog #1221 + Search #1209 + Strangler #1222 + Source #1245), `2026-08-08-total-current-gold-audit` (1063 строки, S12/Research/Baptist/Editorial/Visual split).

**Reverify:** 140+ файлов `reverify/CURRENT_HEAD_REVERIFY_2026-07-*/` — исторический долг. Новые модель говорит "reverify only when selected", но legacy остаётся — валидатор терпит через `has_legacy_evidence_anchor` fallback.

**Legacy:** 5 файлов — `D2_CSS_LAYER_VALIDATOR_CLOSURE`, `ISHOD_BASEMAP_CLOSURE`, `MAP_P1_20_SW_FRESHNESS_CLOSURE`, `MATRIX_CLEANUP_2026-08-07`, `NG_DEAD_01_CLOSURE`. Компакт, не backlog.

**WORK_QUEUE:** 4 selected candidates + parked families: Karty runtime measurements (`PERF-P1-01` feTurbulence 14s, `QUAL-P2-04` renderMarkers), Home presentation-owner convergence (Directions/Ambient двойной owner, `a068dece` no-regression), Baptists 3D split (`R-005` 2 245 854 bytes), Strangler parity-authority migration (`SYS-STRANGLER-RETIREMENT`/#1090), Bible corpus (`SEARCH-P2-07`). Parked: `AR-IDX-PERF-*`, `NEW-CSS-BUDGET-01`, `D-3`, etc. — всё без promotion trigger.

**SYSTEM_THEMES:** 8 тем — `ST-RELEASE` (evidence-rich), `ST-EDITORIAL` (evidence-rich), `ST-CACHE` (evidence-rich, residuals narrow), `ST-RUNTIME-OWNERSHIP`, `ST-STRANGLER` (exact 52 = 51 shadows +1 built app at `e15afda...`, deletion-ready 0, exception `_app` built-app), `ST-PERFORMANCE` (candidate, `R-006` absorbed at `a55a038...`), `ST-CONTENT-AUTHORITY` (`CANDIDATE_ONLY` CrossWire RusSynodal 1.9.1 Public Domain, `RusSynodalLIO` blocked, Cassian permission-controlled), `ST-AUDIT-HARNESS` (active governance).

### 2.2 `projects/the-legendary-poet` (TheLegendaryPoet, thelegendarypoet.ru)

**Мета:** `FedorMilovanov/TheLegendaryPoet`, active evidence project, W0–W7 architecture/runtime lines closed на точных anchors, W6 ref retirement завершён (только `archive/deep-research-local-images-20260724` retained), W7 устранил дублирование route ownership через один machine contract.

**Ключевое отличие от gb:** MATRIX намеренно **0 открытых rows**.

```md
# Active Bug Matrix — The Legendary Poet
## ✅ ЗАКРЫТО (0)
## 🟠 P1 — ОТКРЫТО (0)
## 🟡 P2 — ОТКРЫТО (0)
## 🟢 P3 — ОТКРЫТО (0)
Summary: Всего открыто (матрица) 0
Registered Product architecture lanes: 0 — TLP-HALL-001 / #369 pending source registration, outside matrix
```

Историческая матрица — `working/MASTER_BUG_MATRIX_2026-08-05.md` (15 rows, 14 closed + `TLP-CLEAN-001` closed by W6). Consolidation evidence — `verification/2026-08-07-matrix-consolidation/REPORT.md`.

**SYSTEM_THEMES:** 8-9 тем, все `absorbed/closed` кроме `ST-TLP-MEDIA-PROVENANCE` (closed for 30-candidate Mayakovsky set: 5 active C03/C08/C10/C11/C16, 1 reserve C15, 24 exclusions, 0 unresolved). W0-W7 закрыты.

**WORK_QUEUE:** current selection `TLP-HALL-001` / Product #369 — Hall v3 architecture lane, **не engineering bug row** (owner-selected operating order `VERIFY → one root cause → PR → exact-head gates → Browser QA → merge`). Три bounded волны merged: foundation #373 (`9cce8bb...`), Reference Bible #374 (`cc81858...`), metric-greybox tooling #375 (`c34debc7...`, `phase=metricGreybox`, Blender 4.5.12 LTS `84afd5f785f7`). Next wave — author all three H1/H2/H3 candidates neutral greybox с adversarial inspection, выбор winner — отдельной транзакцией.

**CLOSURE_LEDGER:** append-only, 8+ entries (W7, W6, scroll-editorial, poet authority, C01–C07 rights waves, final 30-candidate batch PR #333 `dd2df7be`).

**Статус:** `active` project с нулевым bug matrix — валидная конфигурация per operating model ("may be empty"). Но вызывает вопрос у новичков: "почему active если 0 багов?" — потому что `active` = принимает audit waves, не "есть открытые P0".

### 2.3 `projects/code-audit` — intake-only (3stoneBrother/code-audit)

Минимальный scaffold: `README`, `PROJECT_META.yml`, `incoming/`, `working/`, `verification/`, `verified/PLACEHOLDER`, etc. Intake-only, не в `PROJECT_REGISTRY.md` (registry знает только 2 active). В репо лежит `_templates` и старый `archive/2026-07-05-stale-intake/arena-agent/2026-07-02/` с 4 файлами. Нет claims — это склад для будущего.

### 2.4 `references/` (root) vs `projects/.../references/`

- Root `references/`: 8 MD + 2 canon-папки (`gb-ui-canon-2026-07-13` с 15 PNG/HTML, `gill-mobile` с 5 bars HTML + research zip, `ref-retirement` с JSON/evidence). Это forensic evidence для deep audit, не Product.
- Project `references/` (gb): 13 MD + `audit-session-2026-08-05/` (33 MD reports, 10 JSON prototypes, 2 JS guards). Правило: audit-session retained как raw research, но `scripts/diff-canonical.mjs` был убран из активных путей как false-green prototype.

---

## 3. Validators и Workflows — как репо защищается

### 3.1 `scripts/validate_audit_repo.py` (13.5k) — gate для структуры

Проверяет:
- root: только `README.md`, `AUDITREPO_OPERATING_MODEL.md`, `PROJECT_REGISTRY.md`, `CONTRIBUTING.md`, `CLEANUP_RETENTION_POLICY.md`, `MULTI_WITNESS_VERIFICATION_PROTOCOL.md`, `SANDBOX-ENV-2026-06-21.md`, `CONCURRENT_EDIT_PROTOCOL.md` (ALLOWED_ROOT_MD) + dir allowlist (`.git/.github/projects/scripts/verification/references/_OWNER_DOWNLOADS`) + `.gitignore`. Любой другой `*.md` в корне — fail. Любой другой файл (кроме `.gitignore`) — fail.
- каждый project: `README.md`, `PROJECT_META.yml`, `incoming/`, `working/`, `verification/`, `verified/`, `repairs/`, `reverify/`, `legacy/`, `archive` must exist.
- `MASTER_BUG_MATRIX.md` dual-mode: если есть `## Current state` + `COMPACT_MATRIX_MARKERS` → parse через `matrix_coverage_lib.parse_matrix` + `matrix_integrity_problems` (compact schema). Иначе — legacy schema: capture `## ✅ ЗАКРЫТО (n)` etc + summary table, check heading vs summary mismatch + total calc. Комментарий в коде прямо указывает: *"The existing matrix has hundreds of closed rows... Do not rewrite it wholesale during unrelated work."*
- `incoming/*/*`: valid date folder `YYYY-MM-DD(-rN)?`, `README.md`/`REPORT.md` must exist, must contain identity markers (`## Agent` etc), must have concrete evidence anchor (`Audited anchor: SHA` etc) — строгий `has_explicit_evidence_anchor` для changed intake, lenient `has_legacy_evidence_anchor` (hex 7-40 / https) для untouched historical.
- `REPORT.md` must have real evidence (title/heading/content/finding table/id/index/summary) — иначе fail если no `comments/` evidence; legacy empty scaffolds — warning `LEGACY REPORT DEBT`.
- `working/README.md`, `verified/README.md`, `verification/README.md` must exist.

**Результат на текущем HEAD: PASS** (это же показывает `auditrepo-validate.yml`).

### 3.2 `scripts/matrix_coverage_lib.py` (22.9k) — canonical coverage engine

Ядро новой модели:
- `ACTIVE_SECTION_MARKERS = ("CURRENT DEFECTS","NARROWED RESIDUALS","SYSTEM VERIFICATION LANES","OWNER DECISIONS","NECESSARY IMPROVEMENTS","VERIFIED IMPROVEMENTS")` — compact open; `LEGACY_*` для старой схемы.
- `parse_matrix` — table-key only, duplicate canonical ID → fatal ValueError, open vs closed via `section_kind`.
- `matrix_integrity_problems` — проверка: duplicate section, declared count `(n)` vs actual rows, `CLOSED-IN-ACTIVE` (если в open секции слово CLOSED/FIXED), `ACTIVE-MATRIX-CONTAINS-CLOSED` (compact не должен содержать closed rows), `STATE-COUNT-MISMATCH` для 7 строк Current state (`Active work units` = sum open, `Direct current defects` = count CURRENT DEFECTS, etc., `Closed/stale... in MASTER` must be 0), `STATE-ROW-MISSING`, `STATE-VALUE-INVALID`, `NONCANONICAL-MATRIX-ID`.
- `candidate_is_credible` — UPPER ID с digit/family/≥3 segments → credible, иначе filtered (отсекает `SHA-256`, `Follow-up`).
- `load_aliases` — 4 статуса (`alias` требует valid canonical target in matrix, `retired/informational/false-positive` запрещает canonical, все требуют non-empty reason, `ignoredTokens` не может содержать finding-like строки).
- `row_direct_witness` — active row должен иметь existing evidence path (`reverify/verification/incoming/working/*.md`) или `verified-*` + SHA (7-40 hex).
- `build_report` — считает evidence files (reverify + verification + incoming + working), historical (legacy+archive), occurrences, `LEGACY-ONLY-ACTIVE` → fail, `ORPHAN-ACTIVE-WORK` → fail, `evidenceOnlyIds` — non-blocking diagnostics (814 в gb — old reverify IDs, не требуют alias).
- `contexts` — exact file:line:context для каждого unresolved ID.

**Текущие цифры:**
- gb: 15 active ids, 0 closed, 15 open, 442 evidence files, 543 historical, 1119 legacy/archive ids, registry 52 (0 alias truly? actually 52 total but `aliasIds` 0 mean все non-alias? странно но валидно per code: `aliasIds` counts only status=alias, в текущем `MATRIX_ID_ALIASES.json` 0 alias — all 52 are informational/retired/false-positive → это нормально для compact матрицы где aliases не нужны), directWitnessed 1 (`SYS-SOURCE-AUTHORITY-TRIGGER-CLOSURE`), evidenceOnly 814 — non-blocking.
- tlp: 0 active, 60 evidence, 12 historical, 34 legacy ids, 0 registry, evidenceOnly 22 (22 tlp IDs в evidence но вне matrix — non-blocking: `TLP-HALL-001` etc).

### 3.3 `scripts/check_matrix_coverage.py` + `matrix_coverage_contexts.py` + `matrix_coverage_regression_test.py` (9.5k)

Thin CLI over engine + context generator + 6 regression cases. Запускаются в `auditrepo-validate.yml` **только когда changed paths match** `(MASTER_BUG_MATRIX|finding-aliases|check_matrix_coverage|matrix_coverage__|auditrepo-deep-audit)` — экономия CI. `auditrepo-deep-audit.yml` (weekly + dispatch) гоняет полный coverage всегда.

### 3.4 Workflows

| Workflow | Trigger | Что делает | Нюанс |
|---|---|---|---|
| `auditrepo-validate.yml` | push main + PR | `check_auditrepo_structure.py` → `validate_audit_repo.py` → `validate_regression` → `scaffold_regression` → `retire_regression` → conditional `repository_history_forensic_audit.mjs --strict` (если changed `references/ref-retirement/...`) → conditional matrix coverage (если changed matrix/aliases/scripts) → `git diff --exit-code` | Concurrency per PR, changed-paths detection via `git diff HEAD^1 HEAD`, `RUN_MATRIX_COVERAGE`/`RUN_REF_FORENSIC` env. Deep checks **периодичны**, ordinary docs не платят за live branch inventory. |
| `auditrepo-deep-audit.yml` | `workflow_dispatch` + Sunday 04:17 | structure + rules + regression + **full matrix coverage** (always) + **full history forensic** (fetch-depth 0, Node 22, `repository_history_forensic_audit.mjs --strict`) | Не блокирует обычные PR — диагностический, но даёт еженедельный guard. |
| `auditrepo-ref-retirement.yml` | `push main` (path `requests/*.json`) + `pull_request labeled execute-ref-retirement` | Выбирает **ровно один** reviewed request (wrapper vs direct), валидирует repo, `retire_reviewed_refs.py --execute` (preflight, retire, live-verify), `git fetch --prune`, post-retirement deep audit (structure+rules+matrix+contexts) + strict forensic | Contents write! единственный workflow с write permission. `group: auditrepo-ref-retirement` cancel false. |
| `tlp-w6-delete-retired-refs.yml` |? | аналогичный для TLP |  |

**Inconsistency potential:** `auditrepo-validate.yml` не гоняет `matrix_coverage_regression_test` на каждый PR если matrix не touched — но regression test покрывает control-plane defects (CP-1..7) которые могут дрейфовать без matrix изменения.

### 3.5 `MATRIX_ID_AND_EVIDENCE_MODEL.md`

Канонический governance contract для matrix/coverage/transaction. Описывает **legacy schema** (`✅ ЗАКРЫТО / P0/P1/P2/P3`) как canonical, требует alias/retired/informational/false-positive resolution для каждого historical ID, запрещает `ignoredTokens` для finding-like строк, требует traceable witness (ID in evidence / path / verified-* + SHA). Enforcement rollout — diagnostic while reconciling, blocking only когда zero problems. **Но** текущий gb MASTER использует **compact schema** — документ не обновлён для compact! Это ключевая drift (см. §5).

---

## 4. Связанные проекты и внешние системы

### 4.1 Product `FedorMilovanov/gb-is-my-strength` (source)

- ~52 public `index.html` (51 Astro shadows +1 built app `_app` copy-as-built-asset at `e15afda...`).
- Route families: Home, Heart/Hard-texts (Gill, Hermenevtika), Baptists (10 routes), Karty (Avraam/Ishod public + 3 holding), Nagornaya (5 parts), Maps, search, glossary, TTS, etc.
- Current Product anchor на AuditRepo `e50c4c9` → `11999f6d674e64e6afef590adeb71aeaaf303b3a` (`ci(source): cover Baptist publication surfaces` merge #1245). Но verification waves внутри репо имеют собственные anchors (`fa2db40c` pre-#1245, `6d671d0e` pre-S12, `76ad2f3f` pre-Nagornaya) — multiple contemporaneous truths without single re-anchoring transaction.
- Open PRs 1209/1221/1222/1240/1246 — все `behind` относительно текущего main, ждут refresh.

### 4.2 Research (отдельный репо, не в AuditRepo, но authority)

- `d52ea9d54dd2c2488223d25f5f6cefd263c23328` — Current-Gold research authority для Bible corpus (CrossWire RusSynodal 1.9.1 candidate). `SEARCH-P2-07` зависит от него.

### 4.3 Product `FedorMilovanov/TheLegendaryPoet`

- W0–W7 closed, Hall v3 in progress, 0 engineering bugs — зрелый.
- Machine route contract `src/routes/route-contract.json` — single source of truth (W7).

### 4.4 `code-audit` (3stoneBrother/code-audit)

- intake-only, placeholder — не активен, не мешает.

---

## 5. Нюансы — то, что не видно с первого взгляда

### 5.1 Нюансы правил

#### 5.1.1 Compact vs Legacy MASTER — не баг, а intentional transition, но документ sync отстал

- `MATRIX_ID_AND_EVIDENCE_MODEL.md` всё ещё описывает `✅ ЗАКРЫТО / P0/P1/P2/P3` как canonical, а gb уже на `Current state + CURRENT DEFECTS / VERIFIED NECESSARY IMPROVEMENTS / SYSTEM VERIFICATION LANES / OWNER DECISIONS` (compact). Валидатор **поддерживает оба** (см. `validate_matrix_summary` ветвление), но governance-документ не описывает compact. Новый агент, читающий только `MATRIX_ID_AND_EVIDENCE_MODEL.md`, будет ожидать legacy и сочтёт gb invalid.
- `MATRIX_ID_ALIASES.json` в gb содержит 0 true `alias` (все retired/informational/false-positive) — это нормально для compact (aliases не нужны когда MASTER small), но в legacy модели alias был основным механизмом дедупликации. Теперь `evidenceOnlyIds` (814) — non-blocking, не требует alias. Это сознательный отход от `MATRIX_ID_AND_EVIDENCE_MODEL.md`'s "каждый historical ID должен резолвиться через alias/retired..." — теперь historical может просто остаться evidence-only without alias.
- `CLOSURE_LEDGER.md` transition note всё ещё гласит *Historical closed rows пока остаются в MASTER_BUG_MATRIX.md* — но в gb они уже **не** остаются (0 closed). Заметка stale.

#### 5.1.2 `PROJECT_META.yml` vs Operating Model — subtle duplication

`PROJECT_META.yml` (gb):

```yaml
verification:
  minimum_witnesses_for_confirmed_current: 2
  preferred_witnesses_for_repair_ready: 3
  trust_order:
    - verified-production-like-dist
    - verified-browser
    - verified-build
    - verified-source
```

Operating Model говорит *proportional*, *independent angles*, а не фиксированные числа. META сужает до 2/3, trust_order инвертирует привычный порядок (artifact/browser выше source). Это не contradiction, а project-local specialization, но не документирован как override.

#### 5.1.3 Evidence anchor — строгий для changed, lenient для legacy

`validate_audit_repo.py`: для **changed** incoming требует `has_explicit_evidence_anchor` (label `Audited anchor: <value>` с concrete value, regex). Для untouched historical — достаточно `has_legacy_evidence_anchor` (любой 7-40 hex или https или `## Source commit`). Поэтому 140+ исторических `reverify/*.md` с bare `Source commit: 1a66bd8` проходят, но новый `incoming/…/2026-08-08/REPORT.md` без `Audited anchor: 11999f6d…` — fail. Множество старых файлов числятся в `LEGACY REPORT DEBT` warning (не blocking).

#### 5.1.4 `WORK_QUEUE` — measurement-first, но без метрик

`WORK_QUEUE.md` хранит `PERF-P1-01` (14s feTurbulence) и `QUAL-P2-04` (renderMarkers) как *measurement-first* — но validator не требует measurement. Это governance-gap: кто решает когда measurement sufficient для promotion? Operating Model говорит "verification must show necessity", но queue hygiene — `maybe empty` — оставляет решение на волю verification wave. На практике queue может жить годами без measurement (как сейчас).

#### 5.1.5 Append-only vs rewrite — tension

`CONCURRENT_EDIT_PROTOCOL` и `CLEANUP_RETENTION_POLICY` требуют append-only для `CLOSURE_LEDGER` (не переписывать старые entries) и узких diff для MASTER. Но `MATRIX_CLEANUP_2026-08-07.md` — одноразовый bulk retirement (145 → 27) — нарушил narrow diff, но был оправдан как *consolidation wave*. Протокол это допускает (*prefer one package transaction for a verification wave*), но граница тонка.

### 5.2 Нюансы проектов

#### 5.2.1 gb: 887 ≠ 887 багов

Критичный нюанс, который многие упускают: `verification/2026-08-08-reader-control-census-root-clustering/REPORT.md` доказывает, что 887 — это **raw manifestations**, не дефекты. Кластеризация:

- 174 `panelQuiz → tabQuiz` orphan (один shared owner `GillLearningSheet.astro` conditional)
- 174 mobile Back hard-code (`GillSeriesMobileBar.astro` `../../biografii/` vs `config.railBackHref`)
- 207 small target — но лишь 3 fingerprints (`mobSpdBadge` 100×23×16, `gbsTocToggle` 100×22×22, `hmSpdBadge` 7×20.3×13)
- 103 invalid list (`SPAN.gbs2-track` под `UL.gbs2-toc` 100× + `hrail-track` 3×)
- 70 `aria-controls` missing — #1246 покрывает 64/70 (оставшиеся 6 — Nagornaya `barSectionBtn`)
- 14 footnote not unique — но 114+21+40 footnotes (3 routes)
- 3 site-menu label overclaim (`Поиск и разделы сайта`)
- 6 `barShareBtn` clipped at 390
- 124 click-failed — **contaminated** (state without fresh-page reset, 46/46 failures after Save)
- 12 runtime errors — **audit-origin contaminated** (WebKit `interactive-widget`, CSP `https://gospod-bog.ru/manifest.json` vs `http://127.0.0.1:8080` self)

**Вывод MASTER**: только 6 first clusters — current defects под одним `SYS-READER-CONTROL-SEMANTICS`, click/runtime — не Product defects до isolation fix. Но секция MASTER `Census findings not yet promoted` могла быть прочитана как "ещё 124+207+12 багов" — нужна точная формулировка.

#### 5.2.2 gb: manifest 67/73 — системный, не локальный

`post-s12-manifest-parity-search-writer/REPORT.md` — самый важный системный finding последних волн:

- `data/search-manifest.json`: 67/73 rows divergent (66 title, 29 desc, 17 image mismatch, 4 missing image, 16 published, 25 modified)
- Root cause: `search-manifest-policy-normalizer.js::buildManifestItem()` умеет derive correct metadata, но `migrationCandidates()/applyMigration()` только `!alreadyInManifest` — existing rows skipped. `search-index-policy-inventory.js --strict` проверяет membership, не field parity.
- Downstream: RSS (`rss-feed-normalizer.js`) и sitemap (`sitemap-policy-normalizer.js`) consume manifest → discovery-chain authority problem, не просто catalog thumbnails.
- Extra fields preservation: `featured/priority/scripture/series/...` не owned by `buildManifestItem()` (defaults `false`/`0.6`), blind replace = lossy.

Это превращает `CATALOG-PROJECTION-01` (#1221) из "покажи картинки" в "сначала converge discovery metadata".

#### 5.2.3 gb: Strangler 52 = 51+1, но deletionReady всегда false

`SYSTEM_THEMES` и `MASTER` оба говорят 52 public `index.html` = 51 shadows +1 built app (`_app`). Inventory wave `2026-08-06-strangler-inventory-wave` доказал это на `e15afda...`. Но `SYS-STRANGLER-RETIREMENT` **всегда** deletionReady=false (26 blockers в direct-defects-zero report, 21 blockers в self-verifier report, 52/54 ранее). Это fail-closed by design — без quarantine truth нет deletion.

#### 5.2.4 tlp: 0 bugs — не значит "проект закончен"

tlp `MASTER` 0 rows — intentional per operating model "queue may be empty". Но `WORK_QUEUE.md` содержит Hall v3 H1/H2/H3 authoring wave (метрики, Blender 4.5.12, 1.75m proxy, AD rejection criteria). Это **owner-selected architecture lane**, не bug — вынесен из MASTER сознательно per `DOC_MAP.md`: *Registered Product architecture lanes: 0 — TLP-HALL-001 / #369 is pending source registration ... remains outside the engineering bug matrix*.

Нюанс: `verification` для tlp — `2026-08-06-w7-route-runtime-wave` — доказал single route truth, но `HALL-001` ещё не в verification — он в `WORK_QUEUE` и `verification/2026-08-08-hall-v3-*/` (foundation/reference/tooling). Это двухслойная verification стратегия.

#### 5.2.5 Cross-project: audit harness hardening — общий для обоих

tlp `ST-TLP-AUDIT-HARNESS` и gb `ST-AUDIT-HARNESS` — оба `active governance theme`. Но gb очистил `MATRIX_COVERAGE_CONTROL_PLANE_AUDIT` (CP-1..7) и добавил regression tests (`matrix_coverage_regression_test.py` 6 cases), тогда как tlp использует тот же harness через `auditrepo-deep-audit.yml`. Это shared.

---

## 6. Несогласованности — полный список (30+)

### 6.1 Критичные (требуют action перед следующим merge)

**[C-01] Скрытый self-verifier blocker в `SYS-STRANGLER-RETIREMENT` (#1222) — false `physicalMoveAuthorized`.**  
`scripts/legacy-shadow-retirement-readiness.mjs` напрямую читает governed bytes (`fs.readFileSync(path.join(root, item.path/entry.legacyPath))`), но в `data/legacy-reference-ledger/manifest.json` classified `quarantineImpact: none-fixture-policy-or-comment-only` → `dependencyClass: nonblocking` → `blockerTotal` incomplete (reported 21, real 21+1). При atomic move to `migration/legacy-reference/<logicalPath>` verifier сломается, но ledger скажет `deletionReady`. 7/7 CI зелёные, но **не merge-authorized**. Требуется Option A (migrate verifier to `migration/legacy-reference-path.js` + adversarial quarantine fixtures) или B (reclassify as `must-update-before-move`, correct blocker arithmetic, не claim complete). Evidence: `verification/2026-08-08-strangler-self-verifier-hidden-blocker/REPORT.md`, audit comment `5225397646`.

**[C-02] Manifest field parity gap (67/73) без owner PR.**  
`search-manifest-policy-normalizer.js` не reconciles existing rows, `search-index-policy-inventory.js --strict` проверяет membership, не parity. Disposable diagnostic #1237 (closed unmerged) доказал 67/73 divergent, но **нет dedicated open implementation PR** for field-parity root. #1221 (# catalog projection) не может merge до этого (риск publish stale metadata). MASTER lists `CATALOG-PROJECTION-01` behind=2, но не указывает blocking dependency на manifest reconciler.

**[C-03] Inconsistent PR body vs head в Search #1209.**  
MASTER snapshot: head `12896c2e...` behind=0, body stale `1f14761a.../882d904`. Более свежий snapshot (`c8caefe...`, `ee7f1e0...`) — 84 файла + self-writing workflow `search-stale-interaction-finalizer.yml` + script (contents: write, commit as bot, push to same PR branch). Shared Files Guard run `31247573559` FAILURE (policy: must not stage untracked, only glossary normalizer may use `cache-bust --write`). Это **hard merge blocker**, но MASTER  `SEARCH-P3-02` описывает #1209 как "behind=0, transport gone" — противоречит fresh evidence. Нужна консистентная exact-head truth.

**[C-04] Strangler Wave A rootPath compatibility на `#1222@304d89f...`.**  
Новый `legacy-reference-path.js` resolver's `normalizeRepositoryPath()` rejects `"/index.html"` (POSIX absolute) via `path.posix.isAbsolute`, но canonical Home route profile legitimately stores `legacyPath: "/index.html"`. Shared Files Guard ENOENT, Metadata `cache-bust legacy authority invalid for data/route-profiles/home.json: invalid repository reference path: "/index.html"`, Source Authority gate red. #1222 не merge-ready, но earlier #1222@22983986 был 7/7 green — дрейф внутри одного PR без version bump.

**[C-05] Source Authority trigger DoD incomplete despite #1245 merge.**  
#1245 (`5456bfd...`, +4/-0, adds `src/content/articles/**` + `src/components/baptisty-rossii/**` to filters) merged as `11999f6d`, closed concrete Baptist false-negative. Но `SYS-SOURCE-AUTHORITY-TRIGGER-CLOSURE` DoD требует: *derive closure from existing route/source authority rather than ad-hoc list, prove protected source mutations make workflow applicable for PR and push, mutation-test removal*. `route-source-contract.js` already exposes `inspection.files` — preferred seed, но current filter — всё ещё ad-hoc list. MASTER correctly says "full issue DoD remains open" (#1244), но External view может счесть fixed.

### 6.2 Governance-дрейф (документы vs validator vs reality)

**[G-01] `MATRIX_ID_AND_EVIDENCE_MODEL.md` describes legacy schema, MASTER uses compact.**  
Документ — canonical для checker, но checker already supports compact via `COMPACT_MATRIX_MARKERS`. Документ — stale, риск для нового агента. Фикс: добавить compact section definition + STATE row contract.

**[G-02] `CLOSURE_LEDGER.md` transition note stale.**  
Note: *Historical closed rows пока остаются в MASTER* — но compact MASTER содержит 0 closed. Note должен быть updated to *Retired; future waves use ledger*.

**[G-03] `PROJECT_META.yml` minimum_witnesses vs Operating Model proportional.**  
META: 2/3 fixed; Operating Model: proportional independent angles. Не contradiction, но undocumented override. Фикс: добавить `project overrides` секцию в DOC_MAP.

**[G-04] `SANDBOX-ENV-2026-06-21.md` archive content vs canon.**  
Исторические секции 1.8/1.9 moved to `git show de5d8a4:` but file still served as `Verified 2026-07-04` technical passport — смешение sandbox manual и audit evidence. Низкий риск, но может mislead.

**[G-05] Workflow coverage conditional vs deep audit.**  
`auditrepo-validate.yml` runs matrix forensic only when `MASTER_BUG_MATRIX|ALIASES|scripts/check|deep-audit` changed; root `references/ref-retirement` only when that path changed. Ordinary intake PR (e.g., `incoming/new-agent/2026-08-08/`) не триггерит matrix diagnostics — `evidenceOnlyIds` может расти без блокировки. Intentional per Operating Model "не создавать heavyweight control plane", но gap — phantom `RIGHT-*` IDs могли бы пройти незамеченными без weekly deep audit.

**[G-06] `incoming` legacy debt visible but not blocking.**  
Validator prints `LEGACY REPORT DEBT: N empty scaffolds` but не fail для untouched historical. Это intentional, но количество (не показано в `validate` output, но скрыто) может быть >10 — drift.

**[G-07] `NEXT_AGENT_PROMPT.md` дублирует `DOC_MAP.md` + Operating Model.**  
Retained for older agents, но содержит те же *Read first* + *Before Product work* + *AuditRepo update rule*. Риск: агент обновит NEXT_AGENT_PROMPT вместо DOC_MAP.

**[G-08] `PROJECT_REGISTRY.md` не list `code-audit`.**  
Registry knows `gb-is-my-strength` + `the-legendary-poet` as active, but `projects/code-audit/` exists as intake-only scaffold. Не блокирует, но registry incomplete.

**[G-09] `MATRIX_ID_ALIASES.json` 0 alias — intentional but undocumented.**  
52 entries all non-alias — для compact это нормально, для legacy было бы странно. Нет комментария внутри JSON почему 0 alias.

**[G-10] Dual validator message for tlp vs gb.**  
tlp uses legacy count headings (`## ✅ ЗАКРЫТО (0)`), gb uses compact (`## Current state`). Оба проходят, но `validate_audit_repo.py` silent fallback может hide, что tlp ещё не мигрировал. Фикс: explicit migration note в `projects/the-legendary-poet/verified/README.md`.

### 6.3 Wave & anchor inconsistency — moving Product main без re-anchor

**[W-01] Multiple Product anchors without canonical rebase.**  
- SUPER_AUDIT `14a49be8` (2026-07-06)
- inventory `e15afda5` (2026-08-06)
- TTS `a55a038` (absorbed R-006)
- direct-defects-zero `76ad2f3f` (2026-08-08)
- post-S12 follow-up `11999f6d` (current verified main per MASTER)
- reader-census `b489824...` vs current-main `11999f6d` blob-identical for 3 files — but not universal.
- `total-current-gold-audit` snapshot presumably `6d671d0e` etc.

No single `CURRENT_PRODUCT_HEAD.md` — per Operating Model intentional ("не дублировать"), но верификатору трудно понять *какой* anchor is current for which row. MASTER's `Current state / Product verification anchor` row attempts to centralize, но 9 verification folders each declare own anchor — drift-prone.

**[W-02] Post-S12 REPORT layered addendum pattern.**  
`2026-08-08-post-s12-manifest-parity-search-writer/REPORT.md` starts with `Product anchor fa2db40c...` (#1238), then later `## Live follow-up — Source trigger merged` supersedes with `11999f6d...` (#1245). Это честный *append addendum*, но читатель без git blame может принять early snapshot as conclusion.

**[W-03] Behind counts stale.**  
MASTER lists `#1221 behind=2`, `#1240/1246 behind=2` as of 2026-08-08, но product main уже продвинулся (неизвестный head за пределами audit). Без live GitHub API эти behind stale within hours. DOC_MAP правильно says "inspect immediately before Product work" — но MASTER behind numbers создают illusion of freshness.

**[W-04] Verification `2026-08-08-search-head-strangler-readiness` vs `2026-08-08-strangler-red-ci-and-npm-security-inventory` — same date, different PR heads (`22983986` vs `304d89f`) for same SYS lane — confusing if not read as sequential snapshots.

### 6.4 Evidence vs defect boundary blur

**[E-01] Work Queue queue hygiene — vague promotion trigger.**  
Home presentation-owner convergence: *Promote only if fresh browser regression, false-green contract, recurring owner/file collision, or measured runtime failure*. Но кто решает, что collision "recurring"? Нет metric.

**[E-02] WCAG target-size — 207 vs 3.**  
MASTER and `SYS-READER-CONTROL-SEMANTICS` could be read as "207 failures", but clustering proves 3 fingerprints. Новому агенту легко создать 207 rows. MASTER's census note clarifies, но требует внимательного чтения.

**[E-03] Footnote 14 vs 114+21+40.**  
Same blur: 14 scenes vs 175 footnote instances. Фикс — keep as footnote semantics system root, not per-route.

**[E-04] Click/runtime contaminated — but still in evidence.**  
`article-control-census-31246241912` artifact remains forensic evidence. Some agents might still import its 124 click-failed as defects. Census report's "NOT yet valid" must be enforced via harness fix (fresh page/context per control) before reuse.

**[E-05] npm 8 vulnerabilities — evidence-only, но легко mis-promote.**  
`npm audit` 8 vulns (transitive dev) vs `npm audit --omit=dev` 0 — diagnostic #1223 closed unmerged. Но без чтения report, агент увидит "8 vulnerabilities" и откроет `SEC-*` row. MASTER correctly says `Do not add direct MASTER row`.

### 6.5 Cross-layer duplication

**[D-01] `AR-IDX-05` vs `ST-CACHE`/`ST-PERFORMANCE`.**  
`AR-IDX-05` (per-asset revision) дублирует тему ST-CACHE (asset revisions, cache baseline drift) и ST-PERFORMANCE, но остался как verified improvement — intentional narrow slice vs system theme.

**[D-02] `SEARCH-P2-07` Bible corpus — duplicate authority.**  
`SEARCH-P2-07` (owner decision) + `ST-CONTENT-AUTHORITY` + `WORK_QUEUE.md` Bible corpus section — три места, одна суть. MASTER держит owner decision, SYSTEM_THEMES — context, WORK_QUEUE — queue candidate. Это by design (single writer per fact), но читателю кажется duplication.

**[D-03] `SYS-KARTY-HOLDING-PUBLICATION-READINESS` absorbs 10+ historical Karty IDs.**  
Legacy `MATRIX_CLEANUP_2026-08-07.md` lists retired IDs, but `SYSTEM_THEMES ST-STRANGLER` inventory still advisory. Нюанс: теперь Karty holding issues не inflates direct defect count — но activation readiness transaction ещё не defined as checklist.

**[D-04] TLP Hall vs GB Karty — both use Biomedical? No, separate.

### 6.6 Structural & tooling quirks

**[S-01] `PROJECT_META.yml` allowed_report_types includes `source-audit/dist-audit/browser-audit` etc., но новая operating model разрешает любые evidence types без strict enum — mismatch.

**[S-02] `MATRIX_ID_ALIASES.json` `ignoredTokens: []` — but `lexical_non_findings` includes `SHA-256` only — other prose like `Current-head` already filtered via `candidate_is_credible`.

**[S-03] `scripts/scaffold_*` not wired in CI for intake-only project `code-audit` — fine.

**[S-04] `references/gb-ui-canon-2026-07-13` + `references/gill-mobile` — binary PNG/HTML outside project `gb-is-my-strength/references/` — duplication of canon between root `references/` and project `references/`. Root is for forensic audit, project is for product canon — intentional but undocumented.

**[S-05] `_OWNER_DOWNLOADS` + `ZIP GBS.zip` + `PremiumControls` — product-like assets inside audit repo — allowed per `.gitignore`? `_OWNER_DOWNLOADS/README.md` says downloads dir. ZIP 7.6 MB — persisted but not validated.

---

## 7. Что делать дальше — рекомендации (приоритет)

### P0 (before next Product merge attempt)

1. **SEVERITY-1: Fix Strangler self-verifier ledger** — Option B narrow: reclassify `scripts/legacy-shadow-retirement-readiness.mjs` to `must-update-before-move` в `manifest.json`, correct blockerTotal/PR body, keep 5-file Wave A narrow, then rerun exact-head CI. Или Option A wide: migrate verifier to use `migration/legacy-reference-path.js` + fixtures (quarantine-only, ambiguity, absent, hash preservation). Block merge #1222 до этого.
2. **Assign owner for manifest field-parity reconciler** — bounded PR at `scripts/search-manifest-policy-normalizer.js::applyMigration` with `buildManifestItem()` + preserve extras + RSS/sitemap regeneration + adversarial stale-row test + idempotence. До этого #1221 нельзя merge.
3. **Refresh Search #1209 transport removal** — убедиться absense of `.github/workflows/search-stale-interaction-finalizer.yml` + `scripts/...finalizer.mjs` в net diff, rebase onto `11999f6d` (or newer), refresh PR body to actual head/scope, rerun exact-head Search Modal + Shared Files. Пост-S12 report’s 84-file diff уже stale.

### P1 (следующая verification wave, 1-2 недели)

4. **Source Authority DoD closure** — derive filter from `route-source-contract.js inspections` rather than ad-hoc list; add mutation tests proving removal fails; prove PR+push applicability for protected surfaces. Issue #1244 — guard-health.
5. **Reader census harness fix** — fresh page/context per clicked control, re-snapshot, clear overlays/toasts, preserve browser/view identity, rerun, only then consider dynamic click/runtime roots. До fix — не promote 124/12.
6. **Update `MATRIX_ID_AND_EVIDENCE_MODEL.md`** — add compact schema section, STATE row contract, explain 0-alias / evidenceOnly non-blocking, update `CLOSURE_LEDGER` transition note.
7. **Re-anchor verification waves to single current Product HEAD** — optional `verification/2026-08-08-current-head-...` синтетическая wave которая explicitly lists anchor for each of 15 active rows, supersedes multi-anchor drift.

### P2 (hygiene, monthly)

8. **Measure `WORK_QUEUE` Karty perf** — Chromium/WebKit frame/input for 14s feTurbulence, long-task for renderMarkers — promote only if material.
9. **Consolidate `reverify` debt** — archive superseded `CURRENT_HEAD_REVERIFY_2026-07-*` that are fully absorbed by compact MASTER + SYSTEM_THEMES (keep 10 most recent). Already `archive/2026-07-*` exists, continue.
10. **TLP: document 0-row intentional** — add note in `tlp/verified/README.md` explaining Hall lane outside matrix, add migration note for legacy headings.
11. **Deep audit schedule** — ensure `auditrepo-deep-audit.yml` weekly passes; add `matrix_coverage_regression_test` to `validate.yml` always (not conditional).

---

## 8. Приложение — инвентарь и доказательства

### 8.1 Validator outputs (current HEAD)

```
AUDITREPO VALIDATION: PASS
AUDITREPO STRUCTURE CHECK: PASS
matrix: 15 active ids, 0 closed rows, 15 open rows; evidence files: 442; historical files: 543; legacy/archive ids: 1119; registry: 52 (aliases: 0, informational: 9, retired: 39, false-positive: 4); direct witnesses: 1; historical-only active: 0; evidence-only ids: 814
direct-witnessed: SYS-SOURCE-AUTHORITY-TRIGGER-CLOSURE
OK: compact active matrix coverage checks passed
tlp: matrix: 0 active ids, 0 closed rows, 0 open rows; evidence files: 60; historical files: 12; legacy/archive ids: 34; registry: 0; direct witnesses: 0; historical-only active: 0; evidence-only ids: 22
OK: compact active matrix coverage checks passed
contexts: 0 unresolved IDs
```

### 8.2 Ключевые файлы (канонические)

- Канон: `AUDITREPO_OPERATING_MODEL.md` (212 строк)
- Протокол: `MULTI_WITNESS_VERIFICATION_PROTOCOL.md`, `CONCURRENT_EDIT_PROTOCOL.md`, `CLEANUP_RETENTION_POLICY.md`, `CONTRIBUTING.md`
- Карта: `projects/gb-is-my-strength/DOC_MAP.md`, `projects/the-legendary-poet/DOC_MAP.md`
- Active work: `projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md` (121 строка, 15 rows, anchor `11999f6d...`), `projects/the-legendary-poet/verified/MASTER_BUG_MATRIX.md` (52 строки, 0 rows)
- Темы: `projects/gb-is-my-strength/verified/SYSTEM_THEMES.md` (8 тем), `projects/the-legendary-poet/verified/SYSTEM_THEMES.md` (9 тем)
- Queue: `projects/gb-is-my-strength/WORK_QUEUE.md` (60 строк, 4 candidates), `projects/the-legendary-poet/WORK_QUEUE.md` (Hall v3)
- Ledger: `projects/gb-is-my-strength/verified/CLOSURE_LEDGER.md` (5 entries + appendix), `projects/the-legendary-poet/verified/CLOSURE_LEDGER.md` (8 entries)
- Aliases: `projects/gb-is-my-strength/verified/MATRIX_ID_ALIASES.json` (52), `closed-unmerged-pr-dispositions.json` (34 PRs)
- Waves: 34 `verification/2026-08-*`, 140+ `reverify/`, 5 `legacy/`, 20+ `archive/`
- История: `verified/SUPER_AUDIT_2026-07-06_14a49be8.md` (36k, canonical consolidated audit at `14a49be8`)
- Meta: `projects/gb-is-my-strength/PROJECT_META.yml`, `projects/the-legendary-poet/PROJECT_META.yml`
- Workflows: `.github/workflows/auditrepo-validate.yml` (151), `auditrepo-deep-audit.yml` (95), `auditrepo-ref-retirement.yml` (229), `tlp-w6-delete-retired-refs.yml` (155)
- Engine: `scripts/matrix_coverage_lib.py` (22k), `validate_audit_repo.py` (13k), `matrix_coverage_contexts.py`, `matrix_coverage_regression_test.py`

### 8.3 Проекты связаны

```
FedorMilovanov/AuditRepo (this)
├── gb-is-my-strength (gospod-bog.ru) — Astro/strangler, 15 active, search/catalog/strangler/reader focus
├── the-legendary-poet (thelegendarypoet.ru) — Hall v3, 0 active, route-contract, media provenance
└── code-audit (3stoneBrother/code-audit) — intake-only placeholder
```

Product HEAD, PRs, CI, deploy — живут в source, проверяются *перед* Product work, не дублируются в AuditRepo per DOC_MAP.

### 8.4 Branch hygiene

- `arena/019fe0b5-auditrepo` — clean, `git status` nothing to commit, ahead 0 behind 0 vs `origin/main` at `e50c4c9`
- Closed/unmerged PR forensic `verified/CLOSED_UNMERGED_PR_FORENSIC_2026-07-24.md` + `closed-unmerged-pr-dispositions.json` — 34 PRs classified superseded/diagnostic/archived
- Forensic refs retained: `archive/forensic-*` (Reader Platform R1-R6, etc.) — intentionally not deleted per `*_REF_NORMALIZATION_COMPLETION_2026-07-28.md`

---

## 9. Итоговая оценка

**AuditRepo на 2026-08-08 — в excellent governance health:**

- Operating model v2 (2026-08-06) консистентно implemented: evidence ladder, proportional witnesses, compact MASTER, optional queue, system themes, legacy, collision rule, periodic forensic.
- Validators и workflows соответствуют модели и проходят.
- gb-is-my-strength: 15 verified necessary units — сфокусированы, deduplicated, collision-aware, каждый с verification/report или behind barrier. Самые горячие системные риски — явно описаны и требуют bounded repair (Strangler self-verifier, manifest parity, reader harness).
- the-legendary-poet: 0 engineering bugs — зрелый, Hall v3 — следующий architecture wave, clean.
- Несогласованности — не structural collapse, а **transition debt + wave drift + hidden ledger assumptions** — управляемы следующей verification wave и document sync.

**Главный инсайт для следующего агента:** не считайте 887, 207, 67 как баги; не merge’те #1222 с зелёным CI пока ledger врёт; не hand-edit’ьте manifest; не promote’те queue без measurement/harness fix; и всегда `inspect current Product HEAD/open PRs before mutation`.

---

*Конец глубокого разбора. Evidence — в указанных файлах; validator commands выше — воспроизводимы (`python3 scripts/validate_audit_repo.py && python3 scripts/check_matrix_coverage.py --verbose --project projects/gb-is-my-strength`). При вопросах — начните с `AUDITREPO_OPERATING_MODEL.md` + `DOC_MAP.md` + `verified/MASTER_BUG_MATRIX.md` + последней `verification/2026-08-08-*/REPORT.md`.*
