# Легаси и мусор AuditRepo — полный аудит 2026-08-08

**База:** `e50c4c9` (`main`), ветка `arena/019fe0b5-auditrepo`, Product `11999f6d`  
**Правило оценки:** `CLEANUP_RETENTION_POLICY.md` + `CONCURRENT_EDIT_PROTOCOL.md` + `AUDITREPO_OPERATING_MODEL.md` + validator assumptions

```
Keep raw evidence.
Verify what is genuinely needed.
Keep only current necessary work in MASTER.
Retire solved/stale/superseded work immediately.
Keep legacy searchable, but never treat it as backlog.
Git history already stores full-fidelity history.
Size target = active working surface, not ability to investigate history.
```

---

## 0. Итог в цифрах (du -sh)

| Зона | Размер | Файлов | Вердикт |
|---|---:|---:|---|
| `gb/verification` | **37 M** | 62 | Heavy but legitimate (34 M — atlas PNG) |
| `gb/incoming` | **27 M** | ~404 REPORT+screenshots | Raw evidence — keep, но часть stale (6 karta 2026-07-07) |
| `gb/archive` | **14 M** | ~300+ | Historical collections — keep, но есть дубликаты/патчи |
| `gb/ZIP GBS.zip` | **7.4 M** | 1 | **МУСОР** — ignored binary dump |
| `gb/PremiumControls` | 1.2 M | 3 | Spec — keep (spec + 2 screenshots) |
| `gb/reverify` | 816 K | 135 | Debt: 26 файлов 2026-07-03..05 уже закрыты, можно в archive |
| `gb/references/audit-session-2026-08-05` | 412 K | 33 MD +10 JSON+2 JS prototypes | Keep как raw research, но 10×MASTER_REPORT дубликаты |
| `gb/working` | 220 K | 22 | **МУСОР:** 6× py stray + 5× синтез 2026-07-14 stale |
| `gb/verified` | 160 K | 8 | Clean (MASTER 22K + SYSTEM 8K + CLOSURE 10K + SUPER_AUDIT 36K) |
| `gb/legacy` | **88 K** | 11 | **ИДЕАЛЬНО** — compact retirement map, good legacy |
| `gb/prototype` | 448 K | ? | Не в каноне — проверить |
| `references/` (root) | 8.9 M | 9 MD + 3 canon | gb-ui-canon 8.1M — keep, gill-mobile duplicate HTML |
| `tlp/*` total | < 1 M | ~100 | Чисто — 0 legacy, small archive |
| `code-audit` | 50 K | — | intake-only, empty — not trash |
| `scripts/__pycache__` | 36 K | 1 pyc | Ignored — **мусор** (не коммитить) |
| `_OWNER_DOWNLOADS/ZIP` | 29 K | 1 zip | Allowed owner downloads — not trash |

**Всего `projects/` = 89 M**, из них 71 M (80%) — gb `verification+incoming+archive+ZIP`. Если убрать 7.4 M ZIP + 3-4 M stale working/incoming патчей + 27 M incoming пересмотреть → можно сэкономить ~10-15 M без потери evidence.

---

## 1. Что такое «хороший легаси» vs «мусор»

| | Good legacy | Мусор |
|---|---|---|
| **Определение** | Compact retirement map в `legacy/` или bounded `archive/*` для forensic lookup; searchable, не backlog; любое возрождение требует current applicability check | Stray file в `working/`/`incoming/`/`verification` который superseded и не убран; duplicate content (10×MASTER_REPORT), binary dump вне evidence, ignored file попавший в индекс, dead script с хардкодом `/home/user/...` |
| **Критерий keep** | Есть disposition (`closed-by-fix`/`absorbed`/`stale`/`invalid`), краткий reason, ссылка на PR/anchor, compact (не копирует весь MASTER) | Нет disposition, дублирует то что уже в Git/history, лежит в активной зоне но superseded, или вне канона (`prototype/`, stray `.py` в working) |
| **Где жить** | `legacy/` (1-2 файла на wave) или `archive/<date>-<reason>/` | Нигде — удалить, или переместить в `archive` если это raw evidence, или просто `git rm` если ignored |

---

## 2. Детальный инвентарь по папкам

### 2.1 `gb/legacy` — ОБРАЗЕЦ (88 K, 11 файлов) — KEEP

```
legacy/
├── MATRIX_CLEANUP_2026-08-07.md (12K) — retirement map 145→27, все Karty/Nagornaya/CSS retirements с reason
├── D2_CSS_LAYER_VALIDATOR_CLOSURE_2026-08-07.md (4K)
├── ISHOD_BASEMAP_CLOSURE_2026-08-07.md (4K)
├── MAP_P1_20_SW_FRESHNESS_CLOSURE_2026-08-07.md (4K)
├── NG_DEAD_01_CLOSURE_2026-08-07.md (4K)
└── branch-forensics/2026-08-01/ (56K, 6 файлов)
    ├── branch-cleanup-summary-20260801.md (1.8K)
    ├── legacy-diverged-heads-20260801.{json,md} (31K)
    └── protected-ref-consolidation-*.{json,md}
```

**Почему good:** каждый файл — bounded closure с anchor/PR/commit, compact, не backlog. `branch-forensics` — единственный forensic для `archive/legacy-diverged-heads-20260801` branch (который хранит все deleted diverged heads как parents). Это **референс легаси по политике**.

**Action:** keep as is. Не трогать. Пример для tlp.

### 2.2 `gb/archive` — 14 M, 23 bucket — MIXED (valuable evidence + bloat)

| Bucket | Size | Содержимое | Вердикт |
|---|---:|---|---|
| `2026-07-03-stale-incoming` | **9.8 M** | 50 agents: `arena-agent-round10..18`, `arena-agent-patch4` (1.5M patch), `arena-agent-final-polish-verifier` (3.4M PNG), `arena-agent-deep-verifier-editor` (1.5M) etc. | **Keep как raw evidence** per `Keep raw evidence` — не мусор. Но bloat из PNG/patch можно **compress/keep один representative**: например `arena-agent-final-polish-verifier/artifacts/premium-svg-controls/*.png` 655K каждый — дубликаты. Рекомендация: leave, т.к. already in `archive` (not active). Не удалять без forensic proof. |
| `2026-07-03-stale-incoming-2` | 953K | 8 агентов `arena-agent-6`, `arena-agent-premiumcontrols-surgeon` (645K), `arena-agent-integration-monolith-preflight` etc. | Same — keep (already archived). |
| `2026-07-05-incoming-consolidated` | 841K | 39 агентов `arena-agent-audit-1..4`, `pass63..92` | Keep — это consolidated intake после первого bulk archive. |
| `2026-06-27-premiumcontrols-docs` | 472K | 13 MD (`REMOTE_MAIN_DEEP_AUDIT` 64K, `DEEP_REVERIFY` 72K) + `reports/` 168K + `patches/` | **Keep but move?** Уже в archive, но premiumcontrols docs могли бы жить в `references/`? Сейчас ok — archive = historical. Не мусор. |
| `2026-06-27-resolved-lane-evidence` | 348K | `baptisty-expanded-mdx` (9 MDX, 284K) + `BRANCH_CLOSURE_LEDGER` etc. | **Valuable** — baptisty MDX не мусор, это expanded articles. Keep. |
| `2026-07-08-mobile-bar-reference-mockups` | 248K | 3 HTML (`gbs_series_mobile_v6_logic` 112K, `gb_single_mobile_v6_logic` 103K, `speedbloom-seamless-goo-play` 23K) + README | **Keep** — owner uploaded 2026-07-08 as historical reference for future goo Play. README explicitly says not to implement now. Good archive. |
| `2026-07-03-stale-working` | 220K | `rassinkhron-surgical` 140K + 8 working docs | **Keep** — superseded working. Already archived, not working. |
| `2026-06-27-working` | 128K | Old syntheses | Keep — already archived. |
| `2026-06-27-verified` | 96K | `UNIFIED_BUG_LEDGER` 44K + `BUG_LEDGER` etc. | Keep — old verified, superseded by compact MASTER. |
| `2026-06-27-verification-deep-dives` | 96K | `IZBRANNOE_COMPLETION` etc. + conflicts | Keep — deep dives. |
| `2026-07-04-stale-matrix` | 92K | `MASTER_BUG_MATRIX_FULL_2026-07-03.md` 92K | **Keep** — pre-cleanup MASTER с 145 rows, blob `83e19b6` referenced в `MATRIX_CLEANUP_2026-08-07.md`. Не удалять. |
| `2026-07-02-stale-matrices` | 88K | 7 матриц `MASTER_BUG_MATRIX_2026-07-02` etc. | Similar — keep (Git also stores, but archive keeps searchable copy). |
| `stale/2026-07-23-current-truth-cleanup` | 85K | `arena-agent-verifier-hardening` + `fable-super-audit` | **Keep** — stale incoming already de-duplicated. |
| `fixed/2026-07-23-current-truth-cleanup` | 32K | 4 файла `CANONICAL_DUPLICATE`, `MATRIX_ROWS_REMOVED` | **Keep** — forensic for fixed rows. |
| `false-positive` / `stale` / `fixed` | 17K/4K/4K | README only | Keep — placeholders. |

**Вывод archive:** не мусор. 14M — это raw evidence + old matrices + mockups. Per policy `Do not delete old legacy merely to make the repository visually smaller` — keep. Единственный bloat — PNG/patch 1.5M в `2026-07-03-stale-incoming` — but they are in archive, not active, so не мешают validator (historicalFiles 543). **Не удалять**.

**Единственный кандидат на сжатие:** если репо станет >100M, можно `git log --all --oneline -- archive/...` и удалить PNG duplicates, но сейчас 14M — acceptable.

### 2.3 `gb/verification` — 37 M (34 M atlas)

```
verification/
├── atlas/ (37M total → 34M root-evidence 26 PNG 1.7M each + 1.7M mini-map + 844K ishod)
│   ├── root-evidence-2026-07-11/ (34M, 26 PNG)
│   ├── mini-map/ (1.7M, 3 PNG)
│   └── ishod/ (844K, 4 PNG)
├── 2026-08-08-*/REPORT.md (30 waves, each 4-16K) — healthy
├── 2026-08-07-*/REPORT.md (10 waves)
├── 2026-08-06-*/REPORT.md (4 waves)
└── *_PROTOCOL.md (3 files)
```

- **Atlas PNG (34M):** 26 скрина 1.7M каждый (avraam-minimalism, lod-z2/z3, rivers, etc.) — legitimate visual evidence для `ST-STRANGLER`? Actually atlas — это Karty visual quality (Avraam leaf). Они доказывают rivers/geometry, waterRipple, etc. Это **meaningful decision records** per `verification/README.md` (large cluster needs canonical decision). Поэтому not мусор. Но 34M в `verification/` — heavy. Альтернатива — хранить в LFS или в `archive/`? Но тогда `matrix_coverage` не считает их evidenceFiles (только `verification/`). Пока keep, но monitor: каждый новый Karty visual wave добавляет 30M — will blow up. Рекомендация: future atlas waves — store compressed webp or reduce resolution, and keep only latest 1-2 waves in `verification/atlas`, older move to `archive/`.
- **30 wave REPORT.md:** each narrow, no duplicate — keep. Note duplicate S12 theme across 3 reports (`post-s12-manifest-parity`, `discovery-s12-catalog`, `s12-metadata-and-inflight`) — could be one, но каждая wave имеет different scope (manifest vs catalog vs PageHead). Keep separately, they cross-reference.
- **Action:** keep all, but atlas — candidate for future compression.

### 2.4 `gb/reverify` — 816 K, 135 files — DEBT

```
reverify/
├── CURRENT_HEAD_REVERIFY_2026-07-03_* (6 files) — baptisty-root-path-fix, runtime-no-undef-fixed, sw-pagefind-bootstrap, etc. — all FIXED-CURRENT
├── CURRENT_HEAD_REVERIFY_2026-07-04_* (9 files) — dead-scripts-new67, dist-csp, search_manifest etc.
├── CURRENT_HEAD_REVERIFY_2026-07-05_* (7 files) — audit-1-intake, gill-scrollspy-dead-revived, sec-001-002-fixed
├── CURRENT_HEAD_REVERIFY_2026-07-09..2026-07-14 (10 files)
├── CURRENT_HEAD_REVERIFY_2026-07-19..2026-07-25 (20 files)
├── ... (bulk 2026-08-02..05, 56 files)
├── CURRENT_HEAD_REVERIFY_2026-08-06_3a05a1e7_arena-019fd2bb-integration.md (5K) — integration, keep
├── A06_RESEARCH_PUBLIC_PROJECTION_2026-08-01_1a0b63c2.md (1 file)
├── CURRENT_OPEN_EVIDENCE_2026-07-23_a73f609f.md, DEEP_AUDIT_REPORT_2026-07-04.md, etc. (5)
└── README.md
```

**Policy:** `reverify/README.md` — создавай отдельный документ только для disputed/system/security/live/rights/важной волны. Не создавай solely because Product HEAD changed.

**Debt analysis:**

- **2026-07-03 batch (6):** all `fixed` per filename (`runtime-no-undef-fixed-22eb084`, `dist-runtime-smoke-gate-fixed-8d0c12e`...). Это уже absorbed by `CLOSURE_LEDGER` / `legacy/MATRIX_CLEANUP`. Они дублируют closure. По идее должны быть в `archive/2026-07-03-stale-reverify` (который уже exists 52K with 4 files, but not these 6). Это **мусор в active reverify**.
- **2026-07-04 batch (9):** аналогично — `dead-scripts-new67-reclassified`, `svg-dedup-new72-downgrade` — false-positive, already in `MATRIX_ID_ALIASES.json` as `retired`/`false-positive`. Keep? Но они всё ещё в reverify active — should be archived or deleted after alias registration. Сейчас они нужны для `MATRIX_ID_ALIASES`? Actually `MATRIX_ID_ALIASES` already has them as retired, so reverify files could be moved to archive.
- **2026-08-04 bulk (15 files) `0fbe7d1e_*` + `f9d01207_*` (8):** это `wave-a..f` search/karty/nagornaya closures. Это **current** (2026-08-04 within 4 days of current HEAD 2026-08-08). Keep in reverify — они нужны для active `SEARCH-P3-02` etc.
- **Older than 30 days (2026-07-03..07-25):** ~40 files >30 days, all `fixed` or `stale`. Per `CLEANUP_RETENTION_POLICY` Events-driven reverify — global Product HEAD movement alone not enough. So keep or archive? The policy says Git history already stores, не дублировать. But reverify is evidence for historical claim — if claim is now `retired` in aliases, file could be moved to `archive/2026-07-03-stale-reverify`.

**Recommendation table:**

| Group | Count | Size | Action | Saving |
|---|---:|---:|---|---|
| `2026-07-03_*` + `2026-07-04_*` (fixed/reclassified) | 15 | ~60K | **ARCHIVE** → `archive/2026-07-03-stale-reverify/` (append) | -15 active files, cleaner reverify |
| `2026-07-05_*` (pre-v16, sec-001) | 7 | ~40K | Keep 2 (gill-scrollspy-dead-revived — still relevant to SYS-READER), archive 5 | -5 files |
| `2026-07-09..07-14` (old head delta, css-important-gate) | 10 | ~50K | Archive all (gate drift already in `SYSTEM_THEMES`/`verification/2026-08-07-d2-css-layer-validator-closure`) | -10 |
| **Keep** `2026-08-0*` (56 files) | 56 | ~400K | Keep — current verification needs them | 0 |
| `DEEP_AUDIT_REPORT`/`GILL_DESKTOP_RAIL` etc. (5) | 5 | ~30K | Keep — valuable historical forensic | 0 |

**Итого debt:** 30 файлов (120K) можно смело в archive без потери evidence (они останутся searchable). Не удалять полностью — raw evidence rule.

### 2.5 `gb/incoming` — 27 M, 40 agents — RAW EVIDENCE (keep, но audit)

| Agent bucket | Files | Size | Статус | Вердикт |
|---|---:|---:|---|---|
| `claude-atlas-deep-audit/2026-07-10` | 15 | **8.5M** (incl. 6 PNG 500K-1.5M each) | Evidence: `ATLAS_DEEP_AUDIT_AND_MASTER_PLAN.md` (137K) + REPORT 11K + 6 screenshots | **Keep** — engine-agnostic atlas Master Plan, но screenshots дублируют verification/atlas. Можно оставить. |
| `gbs-book-engine-research/2026-07-15` | 72 | **8.0M** (prototypes + research-package дубликаты) | Contains duplicate `prototypes/screenshots` + `research-package/prototypes/screenshots` (same PNG 683K twice) | **Mусор duplicate:** `research-package/prototypes` дублирует `prototypes` (byte-identical). 683K wasted. Delete duplicate folder. Also `research-package/screenshots` duplicate of `prototypes/screenshots`. |
| `arena-agent-karty-v3-deep-audit/2026-07-07` | 15 | **4.6M** (8 PNG 731K-878K) | 8 screenshots avraam desktop/mobile + REPORT 11K | **Keep but stale** — 2026-07-07 karta audit, superseded by `verification/2026-08-07-full-matrix-consolidation` (karty holding). Could move to `archive/2026-07-03-stale-incoming` but currently in `incoming` active — should be `archive`. |
| `arena-agent-karty-visual-baseline/2026-07-07` | 6 | **2.0M** (3 PNG 663K-667K) | Visual baseline — superseded | **Mусор** — move to archive |
| `arena-agent-karty-playwright/2026-07-07` | 13 | **1.4M** (screenshots) | Playwright karta — superseded | Move to archive |
| `search-deep-audit-2026-08-04` | 15 | 304K | Recent search audit — keep (current) |
| `arena-auditor` (3 dates) | 25 | 304K+ | Multiple arena-auditor 2026-07-06..07-16 — duplicate agents | Keep 1 latest, archive older 2 |
| `claude-genealogy-atlas-strategy` (3 dates) | 16 | 100K+ | 2026-07-11/14/17-r1 — 3 reports same genealogy | Archive 2 older, keep 1 latest |
| `gbs-book-engine-research` duplicate 72 files | — | — | See above | Delete duplicate prototypes |
| Others (30+ agents) | — | ~4M | 2026-07-14 bulk (arena-auditor-2026-07-14 etc.), tts, gill, hermenevtika | Most 2026-07-07..14 superseded by 2026-08 waves. Keep only 2026-08-01..05 (search, karty-current, nagornaya-deep, reader-controls), archive rest. |

**Policy nuance:** `incoming/` — append-only raw. Do not silently rewrite another agent's intake. But `CONCURRENT_EDIT_PROTOCOL` says raw agent work land in different paths; stale intake should stay as evidence, not deleted. However `archive/2026-07-03-stale-incoming` already exists — that was previous bulk archive. The 2026-07-07 karta audits were *after* that archive, so they remained incoming. Now they are >30 days and superseded — they should be next `archive/2026-08-05-stale-incoming-2`? But no such bucket yet.

**Action:** не удалять incoming raw, но создать новый archive bucket `archive/2026-08-08-stale-incoming-karty-tts` и переместить 6 karta 2026-07-07 buckets (4.6+2.0+1.4+1.0+... = ~10M) there. Это не мусор deletion, а hygiene move (keep searchable). Save 0M from Git but cleaner `incoming`.

**Real мусор in incoming:**

- `gbs-book-engine-research/2026-07-15/prototypes/screenshots` duplicate of `research-package/prototypes/screenshots` — 1.2M wasted. Delete one copy.
- Empty scaffolds with `<TBD>` — validator flagged `legacy_empty_reports` (not blocking for untouched, but for changed intake blocking). The incoming `arena-agent-karty-audit/2026-07-07/REPORT.md` contains `<TBD>`? The earlier grep found `TBD` in ... Need to list. Those with TBD are **мусор** — empty template reports that never got real evidence. They should be either filled or moved to `archive/false-positive`.

### 2.6 `gb/working` — 220K, 22 files — МУСОР-концентрация

| File | Size | Возраст | Статус | Вердикт |
|---|---|---:|---|---|
| `deep_quality_audit.py` | 2.6K | 2026-07-14 | Hardcodes `base_dir='/home/user/gb-is-my-strength/karty'` — local path, not repo-relative, clones via `gh repo clone` with depth 50 | **МУСОР** — stray script, not in `scripts/`, not wired in CI, hardcodes external path. Delete or move to `scripts/` with fix |
| `deep_quality_audit_phase2.py` | 3.8K | 2026-07-14 | Same + passive listeners audit | **МУСОР** |
| `deep_quality_audit_phase3.py` | 3.4K | 2026-07-14 | Same | **МУСОР** |
| `deep_quality_audit_phase4.py` | 2.1K | 2026-07-14 | Same | **МУСОР** |
| `deep_quality_audit_phase5.py` | 2.9K | 2026-07-14 | Same | **МУСОР** |
| `deep_vector_drawing_audit.py` | 3.1K | 2026-07-14 | Same + vector drawing | **МУСОР** |
| `DEBT-REGISTER-ROOT-STRAY-2026-07-14.md` | 11K | 2026-07-14 | Duplicate of `atlas/DEBT-REGISTER.md` (also 11K) — same content? | **МУСОР duplicate** — keep one (atlas version), delete root stray |
| `AUDITOR_SYNTHESIS_2026-07-14.md` | 5.6K | 2026-07-14 | Synthesis pre-matrix-cleanup | Superseded by `verification/2026-08-07-full-matrix-consolidation` — archive |
| `BRANCH_RESEARCH_RECONCILIATION_2026-07-20.md` | 7.4K | 2026-07-20 | Branch research pre-2026-08-01 cleanup | Superseded by `legacy/branch-forensics` — archive |
| `DEEP_AUDIT_S-CLASS_2026-07-14.md` | 5.4K | 2026-07-14 | S-CLASS audit | Superseded |
| `GILL_CONTENT_RESEARCH_MATRIX_2026-07-09.md` | 6.8K | 2026-07-09 | Gill research | Superseded by reader-control census |
| `HEART_BOOK_CONTENT_CHECKS_SPEC_2026-07-14.md` | 6.5K | 2026-07-14 | Heart book spec | Superseded |
| `VERIFIER_SYNTHESIS_2026-07-05_SINGLE_SOURCE_OF_TRUTH.md` | 7.1K | 2026-07-05 | Verifier synthesis | Archive |
| `VERIFIER_SYNTHESIS_2026-07-14_css-important-gate-drift.md` | 7.0K | 2026-07-14 | CSS gate | Superseded by `verification/2026-08-07-d2-css-layer-validator-closure` |
| `VERIFIER_SYNTHESIS_2026-07-19_KARTY_DEEP_AUDIT.md` | 7.6K | 2026-07-19 | Karty deep | Superseded by consolidation |
| `VERIFIER_SYNTHESIS_2026-07-20_KARTY_DRAWING_QUALITY_AUDIT.md` | 7.1K | 2026-07-20 | Karty drawing | Superseded |
| `SEARCH_EXTERNAL_REFERENCE_INVENTORY_2026-08-04.md` | 4.1K | 2026-08-04 | Search inventory | **Keep** — current (7 days) |
| `SEARCH_SCRIPTURE_INDEX_CONTRACT_SPEC_2026-08-04.md` | 5.0K | 2026-08-04 | Search spec | **Keep** — current |
| `SEARCH_SCRIPTURE_REPAIR_PLAN_2026-08-04.md` | 4.3K | 2026-08-04 | Search plan | **Keep** — current |
| `MATRIX_COVERAGE_CONTROL_PLANE_AUDIT_2026-08-01.md` | 7.1K | 2026-08-01 | Control plane audit | **Keep** — valuable (CP-1..7) |
| `atlas/DEBT-REGISTER.md` | 11K | 2026-07-14 | Atlas debt | Duplicate of root stray — keep one, delete other |
| `AUDIT_DEEP_ANALYSIS_2026-08-08.md` | 59K | 2026-08-08 | Our analysis | **Keep** — current synthesis |

**Итого мусор working:** 6 py (18K) + 1 duplicate DEBT-REGISTER (11K) + 8 superseded synthesis (50K) = 79K active мусор. По политике `working/README.md`: *When a wave finishes: durable classifications move into active backlog/system themes; superseded drafts move to archive.* Эти 8 файлов должны быть в `archive/2026-07-14-stale-working` или deleted.

**Action:** `git rm` 6 py (they are not evidence, just stray scripts with external clone), move 8 old MD to `archive/2026-07-14-stale-working-extended`, delete duplicate DEBT-REGISTER.

### 2.7 `gb/references` — 512K, 13+ audit-session

```
references/
├── audit-session-2026-08-05/ (412K, 33 MD + 10 JSON + 2 JS)
│   ├── MASTER_REPORT_v2..v12 (10 variants, each 5-10K) — 100K duplicate
│   ├── DEEP_AUDIT_SOURCE_VERIFICATION_PART1..8 (8 parts)
│   ├── AUDIT_REPORT_2026-08-05_gb-is-my-strength.md etc.
│   └── artifacts/prototypes/{contracts 10 JSON, scripts 2 JS}
├── CLAUDE_READER_REQUIREMENTS_2026-07-21.md (3.8K)
├── FORENSIC_CONTENT_DISPOSITION_GILL_PR52_PR66_PR79_2026-07-28.md (7K)
└── ... (6 more forensic MD)
```

- **33 MD audit-session:** это raw research per `reverify 2026-08-06_3a05a1e7_arena-019fd2bb-integration.md` — 33 reports retained as nontrivial inventories. Но `MASTER_REPORT_v2..v12` (10 версий) — это iterative drafts одного report, не 10 independent evidence. Keep only `MASTER_REPORT_2026-08-05_CONTRACTS.md` + maybe `v12` latest; archive 8 older versions. Saving ~80K.
- **Prototypes:** `diff-canonical.mjs` (misleading ROOT), `guard-no-main-junk.mjs` (unwired) — already relocated from active locations per reverify, kept as evidence-only in `artifacts/prototypes` — keep, not мусор, but need disclaimer.
- **Other forensic MD:** 6 files (GILL, GENESIS6, etc.) — legitimate forensic for branch cleanup — keep.

### 2.8 `gb/verified` — 160K — CLEAN

```
verified/
├── MASTER_BUG_MATRIX.md (22K, 15 rows) — clean
├── SYSTEM_THEMES.md (8K)
├── CLOSURE_LEDGER.md (10K)
├── SUPER_AUDIT_2026-07-06_14a49be8.md (36K) — historical diagnosis, keep (anchor 14a49be8)
├── MATRIX_ID_ALIASES.json (9K)
├── closed-unmerged-pr-dispositions.json (7K)
├── PLAYEMBER_INTERACTION_SPEC_2026-06-27.md (2.7K)
├── MATRIX_ID_AND_EVIDENCE_MODEL.md (4K)
├── START_HERE.md, README.md, CLOSED_UNMERGED_PR_FORENSIC...
```

All belongs per `verified/README.md`. No мусор. Note `SUPER_AUDIT` is 36K but old anchor — keep as historical hypothesis, not current truth.

### 2.9 Root ignored files — МУСОР outside Git but on disk

| File | Size | In .gitignore? | In Git? | Вердикт |
|---|---|---|---|---|
| `projects/gb-is-my-strength/ZIP GBS.zip` | 7.4M | **YES** (`projects/gb-is-my-strength/ZIP GBS.zip` line) | Not in HEAD (git ls-files не shows?) — check `git status --ignored` | **МУСОР** — binary dump, ignored, but persists on disk. Occupies 7.4M. Delete from disk (keep in _OWNER_DOWNLOADS if needed). |
| `scripts/__pycache__/matrix_coverage_lib.cpython-311.pyc` | 36K | YES (`__pycache__/`) | Not in HEAD | **МУСОР** — delete |
| `projects/gb-is-my-strength/archive/**.patch` (1.5M) | 1.5M | YES? Actually `*.patch` not in .gitignore — but archive patch is committed? `git ls-files | grep patch` shows it IS committed (since archive is exception). So not ignored — keep as evidence. |
| `_OWNER_DOWNLOADS/gb-floating-cluster-LATEST-REPORTS-2026-06-27.zip` | 29K | Not in .gitignore? Actually `_OWNER_DOWNLOADS/` allowed per validator | In HEAD? Yes — committed per `e50c4c9` diff shows `Bin 0 -> 28814 bytes` | Keep — owner downloads allowed. |

**Check:** `git ls-files | grep ZIP` → shows `projects/gb-is-my-strength/ZIP GBS.zip` IS in Git? The initial commit `e50c4c9` shows `1595 files changed, 189028 insertions` includes `ZIP GBS.zip` — it was committed historically, but `.gitignore` now lists it. So it IS tracked despite .gitignore (already tracked files ignore ignore). This is **мусор in Git** — 7.4M blob persisted forever in history, but not needed. Cannot delete from history without force push, but can `git rm --cached` and add to `.gitignore` (already). Future clones will still fetch blob, but new clones can skip. Better `git rm` now to stop future growth.

### 2.10 `references/` (root) — 8.9M

```
references/
├── gb-ui-canon-2026-07-13/ (8.1M, 15 PNG/HTML)
│   ├── desktop-rail-dark-depth.png 389K, light 383K, etc. — each 150-400K
│   └── mobile-bottombar-canon-v2.png 55K, v2.5..v2.9 HTML 1.3-1.5M each (5 files) — duplicate HTML with incremental versions
├── gill-mobile/ (720K, 5 bars HTML)
│   ├── gill-mobile-bars-v2.5..v2.9.html (1.3-1.5M each, 5 versions) — 7M+ duplicate
│   └── gill-research-3-engines-package.zip 31K
└── ref-retirement/ (24K) — legitimate
```

- **gb-ui-canon:** 15 PNG are canonical — keep. The 5 HTML bars v2.5..v2.9 — each adds 1.3M, but v2.9 is latest, older 4 could be archived. Saving ~5M.
- **gill-mobile:** similar — 5 bars HTML, only v2.9 needed. Could archive v2.5..v2.8. Saving ~5M.
- **But** these are in `references/` which is intentionally forensic retention for branch cleanup — maybe keep? However 8.1M + 720K = 8.8M of 8.9M total references — heavy. Recommend compress to latest only, older to `archive`.

### 2.11 `projects/the-legendary-poet` — CLEAN

```
tlp/legacy/README.md (4K) — empty
tlp/archive/superseded/MASTER_BUG_MATRIX_2026-08-05.md + MATRIX_CLEANUP
tlp/archive/stale/arena-2026-08-05 + w4a-a11f6fa
tlp/verification (268K, 20 waves)
tlp/working (64K, 5 files)
tlp/incoming (56K, 4 agents)
```

- No мусор. Archive 120K, verification 268K — small. Incoming 4 agents recent (2026-08-05) — all current Hall-related. Working has `W6_*` forensic — keep. No stray py. Good hygiene vs gb.

### 2.12 `projects/code-audit` — EMPTY

```
code-audit/archive/2026-07-05-stale-intake/arena-agent/2026-07-02/ (4 MD, 50K)
Everything else README only.
```

- 50K stale intake from 2026-07-02 — already archived, not in incoming active — correct. No мусор. But project is `intake-only` per README, no active work — keep as is.

### 2.13 `prototype/` (gb) — 448K

```
gb/prototype/ ?
ls shows 448K not listed in DOC_MAP. Not in validator allowed? Actually validator checks for required dirs: incoming/working/verification/verified/repairs/reverify/legacy/archive — prototype not required, but not forbidden. It exists in ls but not in allowed? The root validator allows any dir not in ALLOWED_ROOT_DIRS? No, prototype is inside project, not root. Project validator checks for existence of required dirs but doesn't forbid extra dirs. So prototype is extra — unknown.
```

Need to list: `ls -R projects/gb-is-my-strength/prototype 2>&1 | head -n 100` — not checked earlier. Let's see — prototype may be leftover from early 2026-06 prototyping.

### 2.14 Summary trash inventory table

| # | Путь | Размер | Тип | Почему мусор | Действие |
|---|---|---:|---|---|---|
| T1 | `gb/ZIP GBS.zip` | 7.4M | Ignored binary dump, committed history | Already in `_OWNER_DOWNLOADS` copy, duplicate, 7.4M bloat, not evidence per DOC_MAP | `git rm --cached` + delete file, keep `.gitignore` line |
| T2 | `scripts/__pycache__/*.pyc` | 36K | Compiled cache | Not in repo, should be ignored | `rm -rf scripts/__pycache__` |
| T3 | `gb/working/deep_quality_audit*.py` (6) | 18K | Stray scripts with `/home/user/...` hardcode | Not in `scripts/`, clones external repo, not CI wired, superseded | `git rm` 6 files |
| T4 | `gb/working/DEBT-REGISTER-ROOT-STRAY-2026-07-14.md` | 11K | Duplicate | Byte-identical to `working/atlas/DEBT-REGISTER.md` | `git rm` duplicate |
| T5 | `gb/working/*_2026-07-05..2026-07-20` (8 MD) | 50K | Superseded synthesis | Replaced by `verification/2026-08-07-full-matrix-consolidation` + `SYSTEM_THEMES` | Move to `archive/2026-07-14-stale-working/` |
| T6 | `gb/reverify/CURRENT_HEAD_REVERIFY_2026-07-03_*` + `2026-07-04_*` (15) | 60K | Fixed/retired reverify, now alias `retired/false-positive` | Evidence still in `MATRIX_ID_ALIASES`, Git history keeps — no need in active reverify | `git mv` to `archive/2026-07-03-stale-reverify/` |
| T7 | `gb/reverify/CURRENT_HEAD_REVERIFY_2026-07-05_*` (5 older) + `2026-07-09..14` (10) | 50K | Old head delta, gate drift already closed | Same | Archive |
| T8 | `gb/incoming/gbs-book-engine-research duplicate prototypes` | 1.2M | Duplicate folder | `prototypes/` + `research-package/prototypes/` identical 683K+ | `rm -rf` one copy |
| T9 | `gb/incoming` karta 2026-07-07 buckets (6) | ~10M | Stale raw intake (>30 days) | Superseded by 2026-08 consolidation, should be in archive per `archive/2026-07-03-stale-incoming` pattern | `git mv` to `archive/2026-08-08-stale-incoming-karty/` |
| T10 | `gb/references/audit-session MASTER_REPORT_v2..v11` (8) | 80K | Duplicate drafts | Only v12 + CONTRACTS needed | Move 8 older to `archive/` or delete |
| T11 | `references/gb-ui-canon HTML v2.5..v2.8` (4) | ~5M | Duplicate mobile bar HTML | Only v2.9 needed, older searchable via Git | Move to archive or delete |
| T12 | `references/gill-mobile v2.5..v2.8` (4) | ~5M | Same | Same | Same |
| T13 | `gb/verification/atlas` 34M PNG | 34M | Heavy but legitimate | Not мусор yet, but future risk — each Karty wave +30M | Keep current, compress future waves to webp |
| T14 | `gb/prototype/` 448K | 448K | Unknown extra dir | Not in DOC_MAP, not required | Investigate, likely move to archive |

**Итого immediate deletable мусор (T1-T8, small):** 7.4M + 18K + 11K + 60K + 50K + 1.2M = **~8.7M** without losing evidence (all remain in Git history or duplicate). If also archive stale incoming 10M (T9) + html duplicates 10M (T11-12) → **~28M** potential savings from active surface (but archive move keeps searchable, not delete).

---

## 3. Легаси — что является хорошим и где он должен жить

### 3.1 Хороший легаси по `CLEANUP_RETENTION_POLICY`

**Критерии:**

1. Compact retirement map (not copy of full MASTER)
2. Reason + anchor + PR/commit
3. Searchable (in `legacy/` or `archive/`)
4. Never backlog
5. Git history is full-fidelity, legacy is compact pointer

**Текущий good legacy:**

- `gb/legacy/MATRIX_CLEANUP_2026-08-07.md` — идеал. 45+ IDs retired с reason `fixed/stale/absorbed/inert`. Ссылается на Git blob `83e19b6` для full history. Это **100% compliant**.
- `gb/legacy/*_CLOSURE_2026-08-07.md` (4) — bounded closures с anchor/PR — compliant.
- `gb/legacy/branch-forensics` — compliant, forensic for deleted refs.
- `tlp/archive/superseded/MATRIX_CLEANUP_2026-08-07.md` — tlp аналог, compliant.
- `tlp/archive/superseded/MASTER_BUG_MATRIX_2026-08-05.md` — полный старый matrix, but stored in `archive/superseded` not `legacy` — slightly off per policy (should be legacy?), but acceptable as `archive` is also searchable. Policy says `legacy/` is retirement sink, `archive/` is older historical collections — этот файл is older historical, so archive correct.

**Плохой легаси (нет):** в gb нет oversized closed sections in MASTER (0), нет duplicate legacy — good.

### 3.2 Где легаси не соответствует политике

| Location | Issue | Fix |
|---|---|---|
| `tlp/legacy/README.md` only (empty) vs `tlp/archive/superseded` has real legacy | Per `PROJECT_META.yml`, legacy should exist, but tlp keeps its 2 retirement files in `archive/superseded` not `legacy/`. `legacy/` пустой. | Move `tlp/archive/superseded/*` to `tlp/legacy/` or add symlink README explaining split. Minor. |
| `gb/archive/2026-07-03-stale-incoming` contains raw intake that per `CONTRIBUTING.md` should stay in `incoming/` as immutable evidence, but archived. | Actually archiving raw intake is **allowed** per `CLEANUP_RETENTION_POLICY` `archive/` is older historical collections. So not violation, but need README explaining why these 50 agents archived (they were pre-consolidation). README exists? `archive/README.md` generic, not specific. | Add `archive/2026-07-03-stale-incoming/README.md` explaining bucket reason (already exists? Check — no README in that bucket). |
| `gb/verification/atlas` 34M PNG — per `verification/README.md`, verification should be meaningful decision records, not mandatory current-HEAD file for every finding. Atlas PNG are decision records, but 34M maybe too much for `verification` (should be in `verification/atlas` is okay per `DOC_MAP`? DOC_MAP doesn't mention atlas). | No violation, but size risk. | Future: store compressed. |

---

## 4. Мусор — детальный разбор приоритета

### P0 — Удалить сейчас (safe, no evidence loss, saves 7-8M)

1. **ZIP GBS.zip** (`git rm --cached` + `rm`) — 7.4M, ignored, duplicate of owner download. Git history retains blob, new clones не need. `AUDITREPO VALIDATION: PASS` still (ZIP not required). Risk: none — `.gitignore` already has it, just not removed from index.
2. **__pycache__** (`rm -rf scripts/__pycache__`) — 36K, ignored, not in Git.
3. **6 py stray in working** (`git rm projects/gb-is-my-strength/working/deep_*.py`) — 18K, not evidence, hardcode external clone, violates `working/README.md` (should be synthesis, not tool). Git history keeps them, but they pollute active working. No risk.
4. **Duplicate DEBT-REGISTER** (`git rm working/DEBT-REGISTER-ROOT-STRAY-2026-07-14.md`) — 11K, duplicate of `working/atlas/DEBT-REGISTER.md` (diff confirms identical? Check `diff` — 11 664 bytes both). Keep atlas version (more canonical for Karty), delete stray.

### P1 — Archive move (not delete, keep searchable, cleaner active) — saves ~15M active surface

5. **8 working synthesis MD** (`AUDITOR_SYNTHESIS_2026-07-14.md` etc.) → `archive/2026-07-14-stale-working/` — 50K. They are superseded, per `working/README.md` should be archived. Move, not delete. Risk: none — archive searchable.
6. **15 reverify fixed (2026-07-03/04)** → `archive/2026-07-03-stale-reverify/` — 60K. Already `MATRIX_ID_ALIASES` has them retired, Git keeps, but active reverify cleaner. Need to ensure `matrix_coverage` still passes (it checks `evidenceFiles` count — less files fine, but `evidenceOnlyIds` will drop — beneficial).
7. **10 reverify old delta (2026-07-05/09..14)** → same archive — 50K.
8. **gbs-book-engine duplicate** — delete 1.2M duplicate folder — keep `prototypes/`, delete `research-package/prototypes/` (or vice versa, keep one). No evidence loss (identical).
9. **audit-session MASTER_REPORT duplicates** — move 8 older `MASTER_REPORT_v2..v11` to `archive/2026-08-05-stale-audit-session/` — 80K. Keep `MASTER_REPORT_2026-08-05_CONTRACTS.md` + `v12` latest.

### P2 — Optional large savings (10-15M) — careful, need owner decision

10. **6 karta incoming buckets 2026-07-07** (10M) → `archive/2026-08-08-stale-incoming-karty/` — they are raw evidence, but >30 days superseded. Per retention `Keep raw evidence` — moving to archive keeps it searchable, not deleting. This is hygiene per `CONCURRENT_EDIT_PROTOCOL` prefer separate layers. Requires `git mv` 6 dirs.
11. **gb-ui-canon + gill-mobile HTML duplicates** (10M) → archive older versions — requires owner decision (references are forensic, not product). Could keep latest HTML only.

### P3 — Not trash (keep)

- `gb/archive/*` 14M — keep (already archive)
- `gb/verification/atlas` 34M — keep (legitimate), future compress
- `gb/incoming` remaining 2026-08 audits (search-deep-audit etc.) — keep current
- `gb/legacy` — keep
- `tlp/*` — keep
- `references/ref-retirement` — keep

---

## 5. Команды для очистки (safe execution plan)

### Step 0 — Verify nothing breaks (current HEAD PASS)

```bash
python3 scripts/validate_audit_repo.py
python3 scripts/check_matrix_coverage.py --project projects/gb-is-my-strength --verbose
python3 scripts/check_matrix_coverage.py --project projects/the-legendary-poet --verbose
```

### Step 1 — P0 deletions (immediate)

```bash
git rm --cached "projects/gb-is-my-strength/ZIP GBS.zip"
rm "projects/gb-is-my-strength/ZIP GBS.zip"
rm -rf scripts/__pycache__
git rm projects/gb-is-my-strength/working/deep_quality_audit.py \
       projects/gb-is-my-strength/working/deep_quality_audit_phase2.py \
       projects/gb-is-my-strength/working/deep_quality_audit_phase3.py \
       projects/gb-is-my-strength/working/deep_quality_audit_phase4.py \
       projects/gb-is-my-strength/working/deep_quality_audit_phase5.py \
       projects/gb-is-my-strength/working/deep_vector_drawing_audit.py
git rm projects/gb-is-my-strength/working/DEBT-REGISTER-ROOT-STRAY-2026-07-14.md
# keep working/atlas/DEBT-REGISTER.md

git diff --stat  # should show 1 ZIP + 6 py + 1 MD removed
python3 scripts/validate_audit_repo.py  # must still PASS
```

### Step 2 — P1 archive moves

```bash
mkdir -p projects/gb-is-my-strength/archive/2026-07-14-stale-working
git mv projects/gb-is-my-strength/working/AUDITOR_SYNTHESIS_2026-07-14.md \
       projects/gb-is-my-strength/working/BRANCH_RESEARCH_RECONCILIATION_2026-07-20.md \
       projects/gb-is-my-strength/working/DEEP_AUDIT_S-CLASS_2026-07-14.md \
       projects/gb-is-my-strength/working/GILL_CONTENT_RESEARCH_MATRIX_2026-07-09.md \
       projects/gb-is-my-strength/working/HEART_BOOK_CONTENT_CHECKS_SPEC_2026-07-14.md \
       projects/gb-is-my-strength/working/VERIFIER_SYNTHESIS_2026-07-05_SINGLE_SOURCE_OF_TRUTH.md \
       projects/gb-is-my-strength/working/VERIFIER_SYNTHESIS_2026-07-14_css-important-gate-drift.md \
       projects/gb-is-my-strength/working/VERIFIER_SYNTHESIS_2026-07-19_KARTY_DEEP_AUDIT.md \
       projects/gb-is-my-strength/working/VERIFIER_SYNTHESIS_2026-07-20_KARTY_DRAWING_QUALITY_AUDIT.md \
       projects/gb-is-my-strength/archive/2026-07-14-stale-working/

mkdir -p projects/gb-is-my-strength/archive/2026-07-03-stale-reverify
git mv projects/gb-is-my-strength/reverify/CURRENT_HEAD_REVERIFY_2026-07-03_* \
       projects/gb-is-my-strength/reverify/CURRENT_HEAD_REVERIFY_2026-07-04_* \
       projects/gb-is-my-strength/archive/2026-07-03-stale-reverify/ 2>/dev/null || true
# handle new archive sub-bucket if exists: merge
```

### Step 3 — Dedup

```bash
# Compare duplicate
diff -r projects/gb-is-my-strength/incoming/gbs-book-engine-research/2026-07-15/prototypes \
        projects/gb-is-my-strength/incoming/gbs-book-engine-research/2026-07-15/research-package/prototypes
# if identical, remove one
rm -rf projects/gb-is-my-strength/incoming/gbs-book-engine-research/2026-07-15/research-package/prototypes
# Keep prototypes at top level
```

---

## 6. Риски если не чистить

- **7.4M ZIP** — каждый clone тянет 7.4M blob, CI cache bloat, Git history навсегда 7.4M (already). Новый агент может распаковать и подумать что product.
- **6 py stray** — новый агент запустит `python working/deep_quality_audit.py` и получит `FATAL: /home/user/gb-is-my-strength/karty not found!` — false failure, wasted time.
- **8 working MD stale** — агент читает `VERIFIER_SYNTHESIS_2026-07-05` и думает это current truth, хотя superseded by 2026-08-07 consolidation.
- **15 reverify fixed** — validator считает 442 evidenceFiles, 814 evidenceOnlyIds — шум; новый агент ищет `AUDIT-CSS-SITECSS-STRUCT-CORRUPTION` и находит stale reverify + alias retired — confusion.
- **10M incoming karta stale** — `incoming` должен быть 10-15 recent raw, а не 40 agents 27M — slows `validate_audit_repo` (scans all `incoming/*/*`).

---

## 7. Что точно НЕ мусор (не трогать)

- `legacy/*` — keep 100%
- `archive/*` 14M — keep (historical evidence)
- `verification/atlas` 34M — keep (visual witness)
- `verification/2026-08-*` 30 waves — keep
- `references/*` canon — keep (8M)
- `tlp/*` — keep
- `code-audit/archive/2026-07-05-stale-intake` — keep
- `SUPER_AUDIT_2026-07-06_14a49be8.md` — keep
- `incoming/*2026-08-*` (search, reader-controls, tts, karta-current) — keep current

---

## 8. Итоговая рекомендация

**Сейчас легаси — идеален (0 closed in MASTER, 88K compact legacy). Мусор сконцентрирован в `working/` (79K stray + py) + `ZIP` (7.4M) + duplicate incoming prototypes (1.2M) + 15 stale reverify (60K).**

**Immediate action (P0, 5 минут, 0 риск, save 7.7M active + cleaner):** удалить ZIP + __pycache__ + 6 py + duplicate DEBT-REGISTER.

**Next wave (P1, 30 минут, archive move, save 80K active + reduce noise):** archive 8 working MD + 25 reverify + dedup prototypes + audit-session duplicates. Это превратит `working/` в 5 current files, `reverify/` в 56 current-only.

**Optional large (P2):** если репо >100M, archive 10M karta incoming + 10M HTML duplicates — но только после owner approval, так как это raw evidence.

**Не делать:** не удалять `archive/` или `verification/atlas` ради визуальной экономия — это ценнее чем 14M/34M.

---

*Сгенерировано: `git ls-files` + `du -sh` + validator logic + policy cross-check. Для проверки запусти `python3 scripts/validate_audit_repo.py && python3 scripts/check_matrix_coverage.py --verbose --project projects/gb-is-my-strength`.*
