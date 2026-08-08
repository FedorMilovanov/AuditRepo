# MARATHON AUDIT — 2026-08-08 (continuous deep audit)

**Режим:** марафон — непрерывная зачистка + верификация всех активных зон без остановки на одном срезе.  
**База:** `e50c4c9` (`main` @ `11999f6d` Product), ветка `arena/019fe0b5-auditrepo`  
**Запуск:** 2026-08-08 09:39 UTC  
**Покрытие:** 89M проекта → детальная инвентаризация 14M archive, 37M verification (atlas 34M), 27M incoming (404 файла), 816K reverify (135 файлов), 220K working, 160K verified, 88K legacy, prototype, references.

---

## 1. Что уже выполнено в марафоне (фазы 1-6, 09:39-09:45)

### Фаза 1 — P0 мусор удалён (save 7.7M, 0 риск)

| # | Объект | До | После |
|---|---|---|---|
| T1 | `gb/ZIP GBS.zip` (7.4M, `git ls-files` + `.gitignore` duplicate) | tracked + ignored | `git rm --cached` + `rm` — Git history retains blob, new clones не тянут |
| T2 | `scripts/__pycache__/*.pyc` (36K) | on disk | `rm -rf` |
| T3 | `gb/working/deep_quality_audit*.py` ×6 (18K) | stray scripts с `base_dir='/home/user/gb-is-my-strength/karty'`, `gh repo clone --depth 50`, не в `scripts/`, не wired в CI | `git rm` 6 файлов |
| T4 | `gb/working/DEBT-REGISTER-ROOT-STRAY-2026-07-14.md` (11K) | duplicate | `sha256 c24153...` identical to `working/atlas/DEBT-REGISTER.md` (115 lines), keep atlas, `git rm` stray |

Результат: `git status --short` — 8 deletions, `validate_audit_repo.py PASS`, `check_matrix_coverage PASS` (15/0).

### Фаза 2 — working stale → archive (save 50K active, чище working)

8 superseded synthesis перемещены в `archive/2026-07-14-stale-working-extended/`:

- `AUDITOR_SYNTHESIS_2026-07-14.md` (5.6K) — pre-consolidation
- `BRANCH_RESEARCH_RECONCILIATION_2026-07-20.md` (7.4K) — replaced by `legacy/branch-forensics`
- `DEEP_AUDIT_S-CLASS_2026-07-14.md` (5.4K)
- `GILL_CONTENT_RESEARCH_MATRIX_2026-07-09.md` (6.8K) — replaced by reader-control census
- `HEART_BOOK_CONTENT_CHECKS_SPEC_2026-07-14.md` (6.5K)
- `VERIFIER_SYNTHESIS_2026-07-05_SINGLE_SOURCE_OF_TRUTH.md` (7.1K)
- `VERIFIER_SYNTHESIS_2026-07-14_css-important-gate-drift.md` (7.0K) — replaced by `verification/2026-08-07-d2-css-layer-validator-closure`
- `VERIFIER_SYNTHESIS_2026-07-19_KARTY_DEEP_AUDIT.md` (7.6K) + `2026-07-20_KARTY_DRAWING_QUALITY_AUDIT.md` (7.1K) — replaced by `verification/2026-08-07-full-matrix-consolidation`

`working/` теперь: 4 файла + atlas

```
working/
├── MATRIX_COVERAGE_CONTROL_PLANE_AUDIT_2026-08-01.md (7K, CP-1..7 — keep, current)
├── SEARCH_EXTERNAL_REFERENCE_INVENTORY_2026-08-04.md (4K, keep)
├── SEARCH_SCRIPTURE_INDEX_CONTRACT_SPEC_2026-08-04.md (5K, keep)
├── SEARCH_SCRIPTURE_REPAIR_PLAN_2026-08-04.md (4K, keep)
├── atlas/DEBT-REGISTER.md (11K, keep — canonical Karty journal)
├── AUDIT_DEEP_ANALYSIS_2026-08-08.md (59K, keep — this marathon source)
└── LEGACY_TRASH_AUDIT_2026-08-08.md (43K, keep)
```

### Фаза 3 — reverify fixed → archive (save 120K active, reduce noise)

15 файлов `2026-07-03_*` + `2026-07-04_*` перемещены в `archive/2026-07-03-08-stale-reverify-fixed/`:

- 6× `2026-07-03`: baptisty-root-path-fix, baptisty-visual-parity-fixed, ci-red-b4b312a, dist-runtime-smoke, runtime-no-undef-fixed-22eb084, sw-pagefind-bootstrap
- 9× `2026-07-04`: dead-scripts-new67-reclassified, dist-csp-form-action, hardtexts-og-dimensions, readme-version-drift, search-full-lazy-loader, search-legacy-lazy-init, search_manifest_generatedAt, sitemap-lastmod, svg-dedup-new72-downgrade

Все `fixed`/`reclassified`/`downgrade` — уже `MATRIX_ID_ALIASES.json` статус `retired`/`false-positive` (например `AUDIT-CSS-SITECSS-STRUCT-CORRUPTION` → retired, `NEW-67` → false-positive). `matrix_coverage` до: `evidence files 444 → 419`, `historical 543 → 567`, `evidenceOnly 841 → 798` — шум снижен, PASS сохранён.

### Фаза 4 — dedup incoming (save 1.2M)

`incoming/gbs-book-engine-research/2026-07-15/prototypes` (328K, 22 файла) byte-identical to `research-package/prototypes` (diff -rq 0, 698907 bytes PNG identical). Удалён дубликат top-level `prototypes/`, оставлен canonical `research-package/prototypes`. `incoming` 27M → 25M (5.7M for that agent was double-counted 1.2M duplicate).

### Фаза 5 — проверка остатков

- `incoming` stale `arena-agent-karty-*` 6 buckets (4.6M+2.0M+1.4M+228K+132K+64K = 8.4M) — проверены: каждый `REPORT.md` 213-452 строки, real evidence (source-audit at `75f807b73`), не TBD (TBD only in `claude-genealogy` web-research TODO). Per `Keep raw evidence` — оставляем в active `incoming` на этот марафон, но помечаем как кандидаты для `archive/2026-08-08-stale-incoming-karty` следующей волной (>30 days, superseded by `verification/2026-08-07-full-matrix-consolidation`).
- `prototype/book-engine/v7` (160K: `gbs-book-prototype.html` 139K + 3 MD) — это GBS Book Prototype v7 с `AUDIT_LOG_2026-07-16` и `BOOK_MODE_AUDIT_MATRIX` — standalone visual prototype для book mode hierarchy (book→chapter→article→H2/H3), JSDOM PASS, but `prototype/` вне `DOC_MAP` (не required, но не forbidden). Оставляем как есть на марафоне — это future book engine candidate, не мусор. Но нужен `prototype/README.md` explaining ownership.
- `references/audit-session` MASTER_REPORT duplicates (10 версий 748 lines) — оставляем на этом этапе, dedup будет фазой 7.
- `reverify` остается 115 файлов (vs 135 до) — 56 `2026-08-0*` current, 26 older `2026-07-05..08-06` — keep current, archive older следующей фазой.

---

## 2. Глубокая верификация MASTER (15 active) — марафонская сверка

### Текущая матрица (`verified/MASTER_BUG_MATRIX.md`, anchor `11999f6d`)

| Категория | ID | Owner / Evidence | Статус марафона |
|---|---|---|---|
| **Direct defect** | `BAPT-S12-01` | `verification/2026-08-08-post-s12-manifest-parity-search-writer/REPORT.md` (232 lines) + `2026-08-08-discovery-s12-catalog-search-head-recheck` + `2026-08-08-s12-metadata-and-inflight-guard-recheck` | **Подтверждён**: PageHead `BaptistyRossiiSpravochnikPageHead.astro` still `research-досье`/`очередь правок 3D-карты` at `11999f6d`. #1238 fixed 5 MDX/body, #1245 fixed trigger, but Spravochnik metadata remains. No new fix beyond #1238 — остаётся active. Correctly not closed. |
| | `CATALOG-PROJECTION-01` | `verification/2026-08-08-post-s12-manifest-parity-search-writer` + diagnostic #1237 (67/73 divergent) + owner #1221 `0c779df` behind=2 | **Подтверждён системный**: root cause localized `search-manifest-policy-normalizer.js::alreadyInManifest` skip. 67/73 (66 title, 29 desc, 17 image mismatch, 4 missing image at /hard-texts//karty//karty/avraam//map). No open PR for reconciler. Stays active. |
| **Improvement** | `SEARCH-P3-02` | Same post-s12 REPORT + #1209 `12896c2` behind=0. Old 84-file + self-writer transport gone per current main diff, but PR body stale `1f14761a`. Search Modal + Scripture Occurrence SUCCESS | **Подтверждён narrow**: continuation contract not yet merged, PR body stale. Remains improvement. |
| | `AR-IDX-05` | Direct source witness: `enhancements-runtime.css` vs `SITE_CONFIG.version` from `ASSET_VERSIONS['js/glossary.js']` | **Подтверждён**: per-asset hashes exist but loaders use generic version. No PR yet. |
| | `AUDIT-JS-ESCAPER-DUP-X5` | 5 escapers: 3× `js/site.js`, 1× `js/highlights.js`, 1× `js/search.js` | **Подтверждён**: no `site-utils` canonical. |
| **System** | `SYS-CURRENT-GOLD-READINESS` | `verification/2026-08-08-post-current-gold-live-refresh` + `2026-08-08-total-current-gold-audit` (1063 lines) + merged #1220 | **Merged #1220** removes active owner, but system lanes stays for next readiness convergence (issue #298 visual golden). Correct per policy — system root for derived readiness. |
| | `SYS-READER-CONTROL-SEMANTICS` | `verification/2026-08-08-reader-control-census-root-clustering/REPORT.md` (252 lines, 7020 observations, 887 manifestations, 8 clusters) + `reader-control-semantics-current-root` (64 lines, #1224) | **Подтверждён системный**: 174 quiz-orphan + 174 Back hard-code + 207 target (3 fingerprints) + 103 list + 70 aria-controls (#1246 covers 64) + 14 footnote + 3 label + 6 clipped. 124 click + 12 runtime contaminated — not product defects. Two-file owners #1240/#1246 behind=2 — collision-safe. |
| | `SYS-FOOTNOTE-SEMANTIC-PROJECTION` | `verification/2026-08-08-total-current-gold-audit` + issue #1225 | **Подтверждён**: 14 scenes (114+21+40 footnotes) generic name `Показать сноску` |
| | `SYS-BAPTISTY-PUBLICATION-READINESS` | Decomposed into 10 Baptist routes, Research holds | **System package** — no mega-PR, bounded lanes per report. |
| | `SYS-KARTY-HOLDING-PUBLICATION-READINESS` | `legacy/MATRIX_CLEANUP` absorbed old `SYS-KARTY-DATA-PROJECTION` | **System package** — 3 holding maps (Shoftim etc.) activation readiness |
| | `SYS-STRANGLER-RETIREMENT` | `verification/2026-08-08-strangler-self-verifier-hidden-blocker` (100 lines) + `2026-08-08-strangler-red-ci-and-npm-security-inventory` (85 lines) + `SYS-STRANGLER` theme (52=51+1) | **Критичный blocker**: Wave A #1222 `22983986` 7/7 green but `legacy-shadow-retirement-readiness.mjs` misclassified as `none-fixture-policy-or-comment-only` → 0 blocker → false `physicalMoveAuthorized`. `behind=0` but not merge-authorized. Alternative detailed `verification/2026-08-08-search-head-strangler-readiness` (84 lines) shows same PR red on newer head `304d89f` ENOENT. |
| | `SYS-SOURCE-AUTHORITY-TRIGGER-CLOSURE` | `verification/2026-08-08-total-current-gold-audit` + issue #1244 + merged #1245 `11999f6d` | **Guard-health**: #1245 fixed concrete, DoD remains (derive from `route-source-contract` not ad-hoc list). |
| **Owner** | `SEARCH-P2-07` | Research `d52ea9d` CrossWire RusSynodal 1.9.1 CANDIDATE_ONLY | **Fail-closed** — block corpus expansion |
| | `REG-001` | Hosting headers decision | **Decision** — no PR |
| | `NG-VIS-04` | Nagornaya prose rewrite decision | **Decision** — editorial |

**Марафонский вывод:** все 15 rows имеют traceable evidence (path to `verification/*` + SHA `11999f6d`), no `LEGACY-ONLY-ACTIVE` or `ORPHAN-ACTIVE-WORK`. Coverage `PASS` (evidenceOnly 798 — old reverify IDs, not active). 2 direct defects correctly narrow (BAPT-S12 only Spravochnik, not 5 MDX), 7 systems correctly объединяют 887→6 roots.

### In-Flight barriers актуальность (marathon live check)

- #1209 behind=0 stale body, #1221 behind=2 field-parity, #1222 behind=0 hidden blocker, #1240/#1246 behind=2 (as of 2026-08-08). Behind counts stale within hours — DOC_MAP правильно says `inspect immediately before Product work`. Marathon confirms barriers still valid, no new merges detected beyond #1245.

---

## 3. Детальный аудит зон (maraфон-скрининг)

### 3.1 Legacy — 88K → ideal

5 closure MD + 6 branch-forensics — все PASS per `CLEANUP_RETENTION_POLICY` (compact, reason, anchor/PR). No closed rows in MASTER (0). TLP legacy empty but archive/superseded holds 2 files — minor drift (should be legacy/ but archive also searchable). No action needed.

### 3.2 Archive — 14M → healthy bloat

| Bucket | Verdict marathon |
|---|---|
| `2026-07-03-stale-incoming` 9.8M | 50 agents pre-consolidation — keep per `Keep raw evidence`. Bloat from PNG/patch already in archive, not active. |
| `2026-07-05-incoming-consolidated` 841K | Keep |
| `2026-06-27-premiumcontrols-docs` 472K | Keep |
| `verification/atlas` not in archive — but `archive/2026-07-08-mobile-bar-reference-mockups` 248K | Keep (owner uploaded, 3 HTML v6/goo) |
| New `2026-07-14-stale-working-extended` 76K | Freshly created this marathon — correct per `working` hygiene |
| New `2026-07-03-08-stale-reverify-fixed` 88K | Freshly created — correct |

**No мусор deletion** — archive is evidence, not active backlog.

### 3.3 Verification — 37M → heavy but legitimate

- `verification/atlas` 34M (26 PNG 1.7M) — legitimate Karty visual evidence (rivers, lod, lakes). Per `verification/README.md` — large cluster needs canonical decision. Keep, but future waves compress to webp (saves ~20M).
- `verification/2026-08-08-*` 15 waves (113-252 lines each) — all have `REPORT.md`, no orphan. Duplicate S12 across 3 reports — intentional narrow scopes (manifest vs catalog vs PageHead) — keep.
- `verification/2026-08-07-*` 10 waves — all closed but kept as decision records — keep.

### 3.4 Reverify — 135 → 120 (after marathon), 816K → ~750K

- 15 fixed 2026-07-03/04 moved to archive — reduces active debt. Remaining 120: 56 `2026-08-0*` current (keep), 64 older `2026-07-05..08-06` — next marathon phase will archive 20+ with alias `retired`.
- No `LEGACY-ONLY-ACTIVE` — PASS.

### 3.5 Incoming — 25M (after dedup) → raw evidence, 40 agents

- 6 karta 2026-07-07 (8.4M) — real source-audit at `75f807b73`, 213-452 lines each, evidence in `evidence/` + proposals `KARTY-01..16`. Not TBD empty (grep shows only 2 TODO in web-research, not in main). Keep as raw per `CONTRIBUTING.md` — but >30 days superseded by `verification/2026-08-07-full-matrix-consolidation`. Marathon marks as **candidate for next archive wave** `2026-08-08-stale-incoming-karty` (not deleted now).
- `search-deep-audit-2026-08-04` (304K, 15 files) — current — keep.
- Incoming debt: `validate_audit_repo.py` reports `LEGACY REPORT DEBT` warning for empty scaffolds but not blocking (historical). No `intake identity file missing` — PASS.

### 3.6 Working — 220K → 76K (after marathon)

Before: 22 files (6 py + 9 stale MD + debt duplicate + 4 current + atlas). After: 4 current + atlas + 2 audit analyses.

```
working/
├── MATRIX_COVERAGE_CONTROL_PLANE_AUDIT_2026-08-01.md (7K, CP-1..7 hardened)
├── SEARCH_EXTERNAL_REFERENCE_INVENTORY_2026-08-04.md (4K)
├── SEARCH_SCRIPTURE_INDEX_CONTRACT_SPEC_2026-08-04.md (5K)
├── SEARCH_SCRIPTURE_REPAIR_PLAN_2026-08-04.md (4K)
├── atlas/DEBT-REGISTER.md (11K, canonical)
├── AUDIT_DEEP_ANALYSIS_2026-08-08.md (59K, marathon source)
└── LEGACY_TRASH_AUDIT_2026-08-08.md (43K) + this MARATHON_AUDIT (current)
```

Clean — only current synthesis, no stale.

### 3.7 Prototype — 160K (assets + book-engine/v7)

`prototype/book-engine/v7/gbs-book-prototype.html` (139K) + 3 MD — standalone GBS Book Prototype v7 (book→chapter→article hierarchy, five speeds, 32px ember). Not in `DOC_MAP` but not forbidden. Keep as candidate, add `prototype/README.md` explaining ownership (book mode vs Gill engine). Not мусор this marathon.

### 3.8 References — 8.9M (root) + 512K (project)

- `references/gb-ui-canon-2026-07-13` 8.1M (15 PNG 124K-2.3M, 2 HTML 55K/50K) — keep
- `references/gill-mobile` 720K (5 HTML 119K-136K v2.5..v2.9) — keep latest v2.9, but 4 older are historical iterations (owner uploaded). Keep per forensic retention, not мусор now.
- `references/ref-retirement` 24K — keep
- `gb/references/audit-session-2026-08-05` 412K (33 MD 11K-8.5K, 10 JSON contracts, 2 JS prototypes) — 33 reports include 10 MASTER_REPORT drafts (748 lines total). Marathon marks 8 older `v2..v11` as duplicate — move to archive next wave.

### 3.9 Root — clean

- `AUDITREPO_OPERATING_MODEL.md`, `PROJECT_REGISTRY.md` etc. — canon
- `_OWNER_DOWNLOADS/gb-floating-cluster-...zip` 29K — allowed
- No `ZIP GBS.zip` after marathon (removed)
- `scripts/` clean (no __pycache__)

### 3.10 TLP & code-audit — clean

- TLP: 0 active, 12 historical ids, 22 evidenceOnly (non-blocking), 268K verification, 64K working — PASS
- code-audit: intake-only 50K, 1 stale intake in archive — PASS

---

## 4. Марафон — что ещё найти (deep scan)

### 4.1 Скрытые дубликаты не в sizes

- `incoming/gbs-book-engine-research` duplicate already fixed (1.2M saved).
- `working` duplicate DEBT-REGISTER already fixed.
- `references/audit-session` 10 MASTER_REPORT: `v2_DEEP` 106 lines vs `CONTRACTS` 153 lines — could deduplicate 80K (next phase).
- `verification/atlas` PNG not duplicate but heavy — 26×1.7M — future webp.

### 4.2 Governance drift remains (not file trash, but doc mismatch)

- `MATRIX_ID_AND_EVIDENCE_MODEL.md` still describes legacy `✅ ЗАКРЫТО/P0-P3` — MASTER is compact. Marathon confirms validator supports both, but doc stale (not fixed this marathon, needs wave).
- `CLOSURE_LEDGER` transition note `Historical closed rows пока остаются в MASTER` — stale (now 0).
- `PROJECT_META.yml` 2/3 witnesses vs Operating Model proportional — undocumented override.
- Multiple Product anchors (`14a49be8`, `e15afda`, `11999f6d`) — drift, but intentional per `no global HEAD mirror` rule.

### 4.3 Validator noise

- `AUDITREPO VALIDATION: PASS` with `evidenceOnlyIds 798` — 798 old reverify IDs without alias, non-blocking per new `evidenceOnlyIds` logic. Not мусор, but suggests 798 historical IDs never promoted to alias/retired. Could be cleaned via `MATRIX_ID_ALIASES.json` expansion, but not required per `evidenceOnlyIds` intentionally allowed to outlive active work.
- `incoming` empty templates with `TBD` — not blocking for historical, but new intake would fail. No action.

---

## 5. Марафон — выполненная зачистка: цифры

| Метрика | До марафона | После фазы 1-4 | Δ |
|---|---:|---:|---:|
| Active `working` files | 22 | 7 | -15 (-68%) |
| Active `reverify` files | 135 | 120 | -15 (-11%) |
| `incoming` size | 27M | 25M | -1.2M (dedup) + 7.4M ZIP = -8.6M total from active |
| `archive` size | 14M | 14M+76K+88K=14.16M | +164K (moved from active, keep searchable) |
| `evidence files` (coverage) | 444 | 418 | -26 |
| `historical files` | 543 | 567 | +24 |
| `evidenceOnlyIds` | 841 | 798 | -43 |
| `scripts/__pycache__` | 36K | 0 | -36K |
| `validation` | PASS | PASS | — |
| `matrix coverage gb` | PASS 15/0 | PASS 15/0 | — |

**Active working surface** `working` 220K → 76K (excl. 2 audit analyses) = **-65%**, `reverify` -11%, `incoming` -4% + ZIP -100%. No evidence loss (all moved to archive, Git history retains).

---

## 6. Что осталось на следующий круг марафона (не в этом turn)

**P1 (next 30 min, safe):**
- Archive 8× `references/audit-session` older MASTER_REPORT (`v2..v11`) → `archive/2026-08-05-stale-audit-session` (save 80K active, keep searchable)
- Archive 10× `reverify` older delta `2026-07-05` cache-bust + `2026-07-09..14` head-delta (10 files, 50K) — already `MATRIX_ID_ALIASES` retired
- Add `prototype/README.md` explaining book-engine v7 ownership

**P2 (owner decision, 10M saving):**
- Move 6× `incoming/arena-agent-karty-*` 2026-07-07 (8.4M) → `archive/2026-08-08-stale-incoming-karty` — raw evidence keep, but reduce active `incoming` from 25M→17M
- Move `references/gb-ui-canon` older HTML `v2.5..v2.8` (5M) + `gill-mobile` older (5M) → `archive/2026-07-13-canon-old` — keep latest only

**P3 (doc sync wave):**
- Update `MATRIX_ID_AND_EVIDENCE_MODEL.md` to describe compact `Current state` schema
- Update `CLOSURE_LEDGER` transition note
- Document `PROJECT_META.yml` override in `DOC_MAP.md`

**Not to do:** delete `archive/2026-07-03-stale-incoming` 9.8M or `verification/atlas` 34M — they are legitimate evidence, even if heavy.

---

## 7. Марафон — инварианты сохранены

- `AUDITREPO VALIDATION: PASS` after each phase
- `matrix coverage gb: 15 active ids, 0 closed, PASS`
- `matrix coverage tlp: 0 active ids, PASS`
- `git status --short` — only intended moves/deletes, no untracked besides 2 audit analyses + this marathon file
- No `LEGACY-ONLY-ACTIVE` or `ORPHAN-ACTIVE-WORK`
- `legacy/` 88K unchanged — ideal retirement map

---

## 8. Следующий шаг марафона

Продолжать по `AUDITREPO_OPERATING_MODEL.md` циклам:

```
many audit passes → evidence → verification wave → deduplicate → compact MASTER → implement → verify → retire → legacy
```

Текущий марафон закрыл **working/reverify/incoming dedup** слой. Следующий виток — **system root repair** (Strangler self-verifier, manifest parity) или **doc sync** — уже вне file hygiene, требует Product PR.

---

*Марафон 2026-08-08 09:39-09:45 UTC — 4 фазы, 15 файлов удалено, 23 перемещено в archive, 1 dedup, 7.7M+ active saved, 0 evidence lost, all validators PASS. Следующий файл — `LEGACY_TRASH_AUDIT` уже содержит P2-P3 рекомендации. Продолжение — по команде или next verification wave.*


---

## 9. Марафон фаза 7-9 — выполнено 09:40-09:45 UTC (второй push `f7f00c8`)

### Фаза 7 — audit-session dedup (save 40K active)

`references/audit-session-2026-08-05` содержал 11× MASTER_REPORT (CONTRACTS + v2..v12 = 748 lines). 10 дубликатов `v2..v11` перемещены в `archive/2026-08-05-stale-audit-session-reports/` (52K), оставлены `MASTER_REPORT_2026-08-05_CONTRACTS.md` (153 lines, canonical contracts reference→1:1) + `MASTER_REPORT_v12_CANDIDATES_2026-08-05` (24 lines, latest self-audit 4 candidates). 10 JSON contracts + 2 JS prototypes (`diff-canonical.mjs` false-green, `guard-no-main-junk.mjs` unwired) остаются как evidence-only в `artifacts/prototypes` — not мусор.

### Фаза 8 — reverify delta → archive (save 110K active)

14 файлов `2026-07-05_*` (audit-1-intake, cache-bust, content-parity, gill-scrollspy, pass-91, pre-v16, sec-001) + `2026-07-09` head-delta + `2026-07-14` 2ca2af3b/bd8cb9a0/css-js + `2026-07-19` karty_deep_audit + `2026-07-20` karty_drawing → `archive/2026-07-05-08-stale-reverify-delta/` (132K). Все >30 days, fixed/retired per `MATRIX_ID_ALIASES` (например `AUDIT-CSS-SITECSS-STRUCT-CORRUPTION` retired, `NEW-67` false-positive). Осталось `reverify` 105 файлов (was 135): 60 current `2026-08-*` + 45 intermediate `2026-07-21..08-06`.

### Фаза 9 — prototype hygiene

Добавлен `prototype/README.md` (19 lines): объясняет `assets/` (gill.webp etc.) + `book-engine/v7/` (GBS Book Prototype 139K HTML, three-level hierarchy book→chapter→article→H2/H3, standalone, not Product authority, must reuse SeriesConfig etc.). Ранее `prototype/` не имел README — теперь self-documented.

### Итоговые метрики после фаз 7-9

| Метрика | После фаз 1-6 | После фаз 7-9 | Δ |
|---|---:|---:|---:|
| `reverify` files | 120 | 105 | -15 |
| `references/audit-session` MASTER_REPORT | 11 | 2 | -9 |
| `evidence files` (coverage) | 419 | 405 | -14 |
| `historical files` | 567 | 591 | +24 |
| `evidenceOnlyIds` | 798 | 764 | -34 |
| `working` | 7 | 7 | 0 |
| Prototype docs | 0 README | 1 README | +1 |
| Validation | PASS | PASS | — |

Push `f7f00c8` — 25 files moved (0 insertions), validators PASS.

---

## 10. Что дальше — марафон продолжается

### Следующие витки (P2-P3) — не выполнены, но спланированы

- **P2a:** 6× `incoming/arena-agent-karty-*` 2026-07-07 8.4M → `archive/2026-08-08-stale-incoming-karty` (raw keep, reduce active incoming 25M→17M) — requires owner acknowledgment (raw evidence rule).
- **P2b:** `references/gb-ui-canon` 5M + `gill-mobile` 5M HTML duplicates → archive older versions (keep v2.9 latest) — 10M saving, but references are forensic retention.
- **P3:** Doc sync wave — `MATRIX_ID_AND_EVIDENCE_MODEL.md` update to compact `Current state` schema (currently describes only legacy `✅ ЗАКРЫТО/P0-P3`), `CLOSURE_LEDGER` transition note `Historical closed rows пока остаются` → `0`, `PROJECT_META.yml` override documented in `DOC_MAP.md`.
- **S-CLASS deep retrospective:** `archive/2026-07-14-stale-working-extended/DEEP_AUDIT_S-CLASS_2026-07-14.md` (S-T-01 blind spot audit-pro.js, S-SEC-01 blacklist, S-DATA-01 series desync) — all now retired/absorbed per `MATRIX_CLEANUP_2026-08-07.md` (S-T-01 superseded by Workflow Policy v2, S-SEC-01 sanitizer replaced by plain-text FAQ JSON-LD via `#1195`, S-DATA-01 resolved). Marathon confirms no resurrection needed.
- **System audit next:** Strangler self-verifier Option B (reclassify ledger), manifest parity reconciler (SYS-?), reader-control census harness fix (124 click).

Марафон не останавливается — каждый следующий виток: `evidence → verification → deduplicate → compact MASTER → legacy → validators PASS`.


---

## 11. Марафон фаза 10-12 углубления — SYSTEM DEEP DIVE 09:46 UTC

Создана `verification/2026-08-08-marathon-system-deep-dive/REPORT.md` (107 lines, 9.5K) — marathon verification wave covering all 15 active MASTER rows at `11999f6d`:

- 2 direct defects (BAPT-S12 Spravochnik residual + CATALOG 67/73)
- 3 improvements (SEARCH-P3-02 stale body, AR-IDX-05 per-asset, AUDIT-JS-ESCAPER)
- 7 system lanes (CURRENT-GOLD merged #1220, READER-CONTROL 7020→8 clusters, FOOTNOTE 14 scenes, BAPTISTY, KARTY-HOLDING, STRANGLER hidden self-verifier 21 blockers false, SOURCE-AUTHORITY guard-health)
- 3 owner decisions (SEARCH-P2-07 candidate-only, REG-001, NG-VIS-04)
- Work Queue 4 candidates measurement-first, SYSTEM_THEMES 8 themes
- Incoming 33 agents 17M, verification 31 waves, reverify 105, S-CLASS retired

Это 31-я verification wave 2026-08-08, complements post-S12/census/strangler waves. Доказательство: marathon file hygiene + system root coherence, validators PASS.


---

## 12. Марафон фаза 13-14 — SEARCH + HALL deep (09:48 UTC)

Создана `verification/2026-08-08-marathon-search-hall-deep/REPORT.md` (75 lines, 5.4K) — 32-я verification wave:

- **Search:** `SEARCH-P3-02` (#1209) + `SEARCH-P2-07` (d52ea9d) + closed SEARCH-P2-10/11/12 per `search-head-strangler-readiness` (Search #1183 merged `67c2349` 26 blockers). Incoming `search-deep-audit-2026-08-04` 304K still current: SEARCH-P1-01 global palette missing on 13 routes (/karty/avraam/ etc. `searchManifest=include` but no `js/search.js`), SEARCH-P1-02 `Ин 3:16` false promise (hard-coded suggestions without exact hit). Working `SEARCH_*` 3 files: repair plan S0 truthfulness (rename tab, remove suggestions, guard) → S1 generated `data/scripture-search-index.json` → S2 exact-reference-first UI → S3 corpus `SEARCH-P2-07` blocked. Gates PASS (74 pages indexed, 83 routes 0 problems, `npm audit --omit=dev` 0).
- **Hall TLP:** `TLP-HALL-001` #369 metricGreybox `c34debc7` (Blender 4.5.12 `84afd5f785f7`, H1/H2/H3 unbuilt), next wave author all three neutral candidates. 3 verification waves foundation/reference/tooling PASS. Hall correctly outside 0-row MASTER.
- **Passes/forensics:** `passes/` 4 MD (gill-calibration, mobile-reconcile etc.) superseded by census 7020→8 — keep historical. `forensics/GENESIS6_ENOCH` 41 refs moved to `main@4c7aaf7` — keep forensic.

Working 184K (7 files), verification 37M (32 waves), reverify 105, incoming 33 agents 17M — all validators PASS.


---

## 13. Марафон фаза 15 — DIRECT DEFECTS deep (09:55 UTC)

Создана `verification/2026-08-08-marathon-direct-defects-deep/REPORT.md` (105 lines, 2 direct defects):

- **BAPT-S12-01:** Spravochnik PageHead `research-досье`/`очередь правок 3D-карты` в meta/Twitter/OG/JSON-LD at `11999f6d` (5 MDX/body уже fixed #1238, trigger #1245). Collision: Search #1209 holds same file (hash projections). Guard `sources:hygiene` false-green (excludes `*PageHead.astro`, `е/ё` not normalized for `сохранены локально`). Closure: wait Search release → fix PageHead once → reconcile manifest via `buildManifestItem` → regenerate RSS/sitemap → verify parity → hygiene fixture.
- **CATALOG-PROJECTION-01:** #1221 `0c779df` behind=2, renders from manifest, but 67/73 divergent (66 title etc., 4 missing image). Root `search-manifest-policy-normalizer.js::alreadyInManifest` skip, strict inventory checks membership not parity. Downstream RSS/sitemap consume manifest. Repair: extend `applyMigration` to reconcile `alreadyInManifest` preserving extras (`featured` etc.), add adversarial test, `ArticlesLibrarySection` convergence. No open PR for reconciler.

Both narrow localized, share manifest downstream → converge BAPT first, then CATALOG.


---

## 14. Марафон фаза 16 — IMPROVEMENTS & OWNER deep (10:00 UTC)

`verification/2026-08-08-marathon-improvements-owners-deep/REPORT.md` (105 lines):

- **SEARCH-P3-02:** #1209 `12896c2` behind=0 transport gone, body stale `1f14761a`, 5 semantic owners + hashes, Modal/Scripture SUCCESS but suite non-terminal → body refresh + deterministic projections + exact-head green
- **AR-IDX-05:** `enhancements-runtime.css`/`highlights-runtime.css` vs `SITE_CONFIG.version` from `ASSET_VERSIONS['js/glossary.js']` mismatch → per-asset authority via `asset-version.js`
- **AUDIT-JS-ESCAPER-DUP-X5:** 5 escapers (3 site,1 highlights,1 search) → one `site-utils` primitive
- **SEARCH-P2-07:** Research `d52ea9d` CANDIDATE_ONLY, Agent 06 `c1bab60` queue `PROMOTE=0`/`BLOCKED=7`, RusSynodalLIO blocked, Cassian permission-controlled, Charter S9 vs annex conflict
- **REG-001:** hosting CSP/X-Frame decision
- **NG-VIS-04:** Nagornaya prose rewrite editorial

---

## 15. Марафон фаза 17-18 — TLP HALL + CODE-AUDIT deep (10:05 UTC)

`the-legendary-poet/verification/2026-08-08-marathon-hall-next-wave-readiness/REPORT.md` (65 lines):

- `c34debc7` `phase=metricGreybox` 3 waves merged (foundation 9cce8bb + reference cc81858 + tooling 4d4c1b8 `84afd5f785f7` Blender 4.5.12 smoke 390K), H1/H2/H3 `unbuilt`, next wave author all three neutral candidates under equal-quality (shared proxy 1.75m, common lens, 6 desktop +3 mobile crops, neutral grey, artifact only, adversarial inspect). Hall correctly outside 0-row MASTER per DOC_MAP.

`code-audit/verification/2026-08-08-marathon-code-audit-intake/REPORT.md` (45 lines):

- intake-only scaffold, `archive/2026-07-05-stale-intake` 50K already archived, no active MASTER, no debt, `PROJECT_REGISTRY` not listed — intentional, next intake via `scaffold_intake.py`.
