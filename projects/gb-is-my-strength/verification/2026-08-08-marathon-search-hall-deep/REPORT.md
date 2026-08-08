# Marathon Search + Hall Deep — 2026-08-08

**Anchor:** Product `11999f6d` (gb) + `c34debc7` (tlp Hall metricGreybox)  
**AuditRepo base:** `a919ad4` → `7d1ad57` marathon (4 pushes)  
**Scope:** Search/scripture truthfulness + TLP Hall v3 next wave readiness

---

## 1. Search / Scripture (gb)

### Current MASTER rows

- `SEARCH-P3-02` (improvement, #1209 behind=0, transport gone, body stale) — continuation contract across Pagefind/manifest/exact Scripture occurrences, visible total/shown, deterministic continuation
- `SEARCH-P2-07` (owner decision, Research `d52ea9d`) — CrossWire RusSynodal 1.9.1 CANDIDATE_ONLY, `RusSynodalLIO` blocked, Cassian permission-controlled
- `SEARCH-P2-10/11/12` etc. already closed per `verification/2026-08-06-search-head-strangler-readiness` (Search #1183 merged `67c2349` 26 blockers)

### Incoming evidence still current

- `incoming/search-deep-audit-2026-08-04/REPORT.md` (304K, on `f9d0120`): SEARCH-P1-01 (global palette missing on /karty/avraam/, /karty/ishod/, /konfessii/russkij-baptizm/, /map/ — 13 routes without `js/search.js`, but `searchManifestPolicy=include`), SEARCH-P1-02 (scripture empty-state `Ин 3:16` promises exact verse but corpus is article metadata), SEARCH-P2-03 npm audit 4+2 moderate/high transitive
- `working/SEARCH_*` (3 files 4-5K): `SEARCH_SCRIPTURE_REPAIR_PLAN` (waves S0 copy truthfulness → S1 generated `data/scripture-search-index.json` → S2 exact-reference-first UI → S3 corpus governance), `SEARCH_SCRIPTURE_INDEX_CONTRACT_SPEC` (schema for `data/scripture-search-index.json`), `SEARCH_EXTERNAL_REFERENCE_INVENTORY` (30+ W3C/Pagefind links)

### Verification at `f9d0120` (search manifest gates PASS)

- `search-manifest-policy-normalizer-test.js` PASS, `search-index-policy-inventory.js` 83 routes 0 problems, Pagefind v1.5.2 indexed 74 pages / 23347 words, `strangler:build:production-like` + `pagefind:build:dist` + `dist-publication-audit` PASS
- BUT `search-manifest-policy-normalizer.js::alreadyInManifest` skip still hides 67/73 parity (see `verification/2026-08-08-post-s12-manifest-parity-search-writer` 232 lines)
- `npm audit` 8 (4 high fast-uri/fast-xml-parser/js-yaml/nanoid, 4 moderate) but `--omit=dev` 0 → not product defect

### Disposition

- **Do not** promote `SEARCH-P1-01` global palette to direct defect until owner defines contract: global palette on all `index && searchManifest=include` except explicit exclusions, guard dist scan
- **S0 truthfulness fix** (rename Писание tab, remove hard-coded suggestions without exact hit, guard `hard-coded suggestion must resolve exactly`) is minimal safe; S1 index generation is next bounded wave; S3 corpus blocked by `SEARCH-P2-07` decision
- Keep `working/SEARCH_*` as current spec until S1 PR lands

---

## 2. TLP Hall v3 (tlp)

### Current state (WORK_QUEUE.md, not MASTER)

- `TLP-HALL-001` / #369 is owner-selected architecture lane, outside 0-row MASTER (correct per DOC_MAP)
- 3 waves merged: foundation #373 `9cce8bb` (Hall v3 contract, 8K budget, legacy hall excluded, Three/R3F blocked), Reference Bible #374 `cc81858`, metric-greybox tooling #375 `c34debc7` (Blender 4.5.12 LTS `84afd5f785f7` proven: headless run, save/reopen, 1.75m proxy, zero materials)
- `main@c34debc7` `phase=metricGreybox`, `greybox-candidates.json` H1/H2/H3 all `unbuilt`, `approvedCandidate=null`
- Next wave: author all three neutral metric candidates under equal-quality constraints (shared human proxy, common lens, dimensioned plan + 2 sections + 6 desktop + 3 mobile crops, neutral grey, no lookdev, artifact only, machine-validate accessible minima)

### Hygiene

- `verification/2026-08-08-hall-v3-foundation` (7.5K, FOUNDATION.md), `-reference-bible` (5.2K), `-greybox-tooling` (7.4K) — all PASS, not duplicate
- No MASTER row for Hall — correct (architecture lane, not bug)
- Working `WAVE_REPAIR_PLAN` etc. clean

### Disposition

- Keep Hall out of MASTER until candidate evidence packages exist (3 comparable offline evidence, not winner in code)
- Automatic rejection criteria defined (one candidate more polished, ornament rescue, FPS/free-look needed etc.)

---

## 3. Passes & Forensics (gb)

- `passes/` 4 MD (2026-07-11 gill-calibration-meter, gill-mobile-reconcile, hermenevtika-reader, mobile-chrome-engine) + `README.md` + `reports/` — historical Gill mobile polish, CBM meter, RC-04 44px touch zone, PRs #81/#82 merged, calibration meter PR #83 — all superseded by `verification/2026-08-08-reader-control-census-root-clustering` (7020→8). Keep as historical passes, not active verification.
- `forensics/` 1 MD + `gill/` — `GENESIS6_ENOCH_REF_CLEANUP_COMPLETION_2026-07-28` (complete/useful-preserved, 41 refs moved to `main@4c7aaf7`, Research PR #37 `753e090`, archive `PR25_10_8_15_8`), plus `gill/` — keep as forensic, not Product branches.

---

## 4. Marathon hygiene validation

- `working` 184K (7 files: `MATRIX_COVERAGE_CONTROL_PLANE_AUDIT`, `SEARCH_*` 3, `AUDIT_DEEP`/`LEGACY_TRASH`/`MARATHON_AUDIT`, atlas DEBT-REGISTER 12K) — only current synthesis
- `verification` 37M (32 waves: 15×2026-08-08 + 10×2026-08-07 + 4×2026-08-06 + atlas 34M)
- `reverify` 105 files (600K) + `archive` 23M (45 buckets) — no LEGACY-ONLY-ACTIVE
- `incoming` 33 agents 17M (was 40/27M) — 6 karta moved, remaining 33 current
- `reference` audit-session 2 reports (was 11), `gill-mobile` 1 HTML (was 5)
- Validators: PASS (gb 15/0, tlp 0/0, evidence 346/346)

No new MASTER row needed this wave; evidence remains searchable.

