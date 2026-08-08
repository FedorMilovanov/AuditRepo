# Marathon System Deep Dive — gb-is-my-strength @ `11999f6d` — 2026-08-08

**Product anchor:** `11999f6d674e64e6afef590adeb71aeaaf303b3a` (merge #1245 Source Authority)  
**Research authority:** `d52ea9d54dd2c2488223d25f5f6cefd263c23328` (RusSynodal candidate)  
**AuditRepo base:** `a919ad4` (marathon after 4 pushes, 92 files moved, ZIP removed)  
**Wave:** marathon continuous audit — file hygiene + system root verification  
**Coverage:** all 15 active MASTER rows + 7 SYSTEM themes + 3 WORK_QUEUE candidates + incoming/verification/reverify hygiene

---

## 0. Hygiene proof (marathon file moves)

- `ZIP GBS.zip` 7.4M removed (`git rm --cached`, history retains blob)
- `scripts/__pycache__` 36K cleared
- 6× `deep_quality_audit*.py` stray (18K, `/home/user/...` hardcode) removed
- Duplicate `DEBT-REGISTER-ROOT-STRAY` 11K identical sha `c2415` removed (keep `atlas/DEBT-REGISTER.md`)
- 8× working stale (50K) → `archive/2026-07-14-stale-working-extended`
- 15× reverify 2026-07-03/04 fixed (60K) → `archive/2026-07-03-08-stale-reverify-fixed`
- 10× `MASTER_REPORT v2..v11` (40K) → `archive/2026-08-05-stale-audit-session-reports` (keep CONTRACTS + v12)
- 14× reverify 2026-07-05/09/14/19/20 (110K) → `archive/2026-07-05-08-stale-reverify-delta`
- Prototype `README.md` added (19 lines) for `book-engine/v7` 139K standalone
- 6× karta incoming 2026-07-07 (8.4M, 452+227+329+213+228+356 lines) → `archive/2026-08-08-stale-incoming-karty`
- 4× `gill-mobile-bars v2.5..v2.8` (516K) → `archive/2026-07-13-canon-old` (keep v2.9)
- Doc sync: `MATRIX_ID_AND_EVIDENCE_MODEL.md` compact schema + `CLOSURE_LEDGER.md` transition note updated

**Validators after:** `AUDITREPO VALIDATION: PASS`, `matrix gb 15/0 PASS` (evidence 345, historical 651), `tlp 0/0 PASS`.

---

## 1. Active MASTER — 15 rows reverified at `11999f6d`

### Direct defects (2)

**BAPT-S12-01 — Spravochnik metadata residual**  
- Evidence: `BaptistyRossiiSpravochnikPageHead.astro` still contains `research-досье` / `очередь правок 3D-карты` in meta/Twitter/OG/JSON-LD at `11999f6d`. #1238 fixed 5 MDX/body S12 markers (proven by `verification/2026-08-08-post-s12-manifest-parity-search-writer` 232 lines), #1245 fixed trigger. Remaining scope = PageHead + downstream Search/RSS/sitemap. No new Product fix beyond #1238 → stays active. Guard `sources:hygiene` excludes `*PageHead.astro` → false-green (needs fix separately). Next: repair PageHead + reconcile manifest + RSS/sitemap after Search releases file lock (#1209).

**CATALOG-PROJECTION-01 — catalog projection behind manifest parity**  
- Owner #1221 `0c779df` behind=2. Root cause: `search-manifest-policy-normalizer.js::buildManifestItem()` correct but `migrationCandidates()/applyMigration()` skip `alreadyInManifest`; `search-index-policy-inventory.js --strict` checks membership not parity. Diagnostic #1237 (closed unmerged) proves 67/73 divergent (66 title, 29 desc, 4 missing image, 17 image mismatch, 16 published, 25 modified). Missing-image at /hard-texts/, /karty/, /karty/avraam/, /map/. Extras `featured/priority/scripture` not in `buildManifestItem` (defaults false/0.6) → blind replace lossy. RSS/sitemap consume manifest → discovery-chain. No open PR for reconciler → stays active.

### Improvements (3)

**SEARCH-P3-02 — continuation contract**  
- Owner #1209 `12896c2` behind=0, transport gone (old 84-file + self-writer closed per main diff), but PR body stale `1f14761a`. Scope: 5 semantic Search/test owners + hash projections `command-palette.css@3b88813f` `search.js@027c3f4f`. Modal + Scripture Runtime SUCCESS, but suite non-terminal. Needs body refresh + deterministic projections + exact-head green.

**AR-IDX-05 — per-asset revision**  
- `enhancements-runtime.css` / `highlights-runtime.css` have hashes, loaders use `SITE_CONFIG.version` from `ASSET_VERSIONS['js/glossary.js']` (generic). Site/glossary don't use it → mismatch. No PR.

**AUDIT-JS-ESCAPER-DUP-X5 — 5 escapers**  
- 3× `js/site.js`, 1× `js/highlights.js`, 1× `js/search.js`, no `site-utils` canonical. Loader/context equivalence must be proven before migration.

### System lanes (7)

**SYS-CURRENT-GOLD-READINESS** — Derived readiness evidence. #1220 merged (regex/hidden-ancestor false-green repaired via Chromium+JS-off+ancestor/CSS/nofollow). Keep for next convergence, issue #298 visual golden. No active PR.

**SYS-READER-CONTROL-SEMANTICS** — 7020 observations, 887 manifestations → 8 clusters. Static: 174 quiz-orphan (`GillLearningSheet` conditional `panelQuiz` vs `tabQuiz`), 174 Back hard-code (`GillSeriesMobileBar` `../../biografii/` vs `config.railBackHref`), 207 target (3 fingerprints: mobSpdBadge 100×23×16, gbsTocToggle 100×22×22, hmSpdBadge 7×20.3×13), 103 invalid list (`SPAN.gbs2-track` under `UL`), 70 aria-controls (#1246 covers 64/70, 6 Nagornaya barSectionBtn remains), 14 footnote (114+21+40), 3 site-menu label, 6 barShareBtn clipped. Dynamic: 124 click contaminated (no fresh-page reset, 46/46 after Save), 12 runtime contaminated (WebKit interactive-widget + CSP cross-origin). Blobs byte-identical between `b489824` census and `11999f6d` for 3 owners → current. Owners #1240 (2 files, 174 Back) + #1246 (2 files, 64 aria) behind=2. Census harness must be fixed before promoting dynamic.

**SYS-FOOTNOTE-SEMANTIC-PROJECTION** — 14 scenes 3 routes generic name `Показать сноску` — needs unique accessible name + print endnote determimism. Issue #1225.

**SYS-BAPTISTY-PUBLICATION-READINESS** — 10 Baptist routes decomposed, no mega-PR. Media ledger TODO-only, visual atlas planned.

**SYS-KARTY-HOLDING-PUBLICATION-READINESS** — 3 holding maps (Shoftim etc.) activation readiness. Absorbed old SYS-KARTY-DATA-PROJECTION. Not inflates direct defect count.

**SYS-STRANGLER-RETIREMENT** — Inventory 52=51+1 at `e15afda`, deletionReady 0. Wave A #1222 `22983986` 5 files 7/7 green but hidden self-verifier: `legacy-shadow-retirement-readiness.mjs` reads via `path.join` not via `migration/legacy-reference-path.js`, classified `none-fixture-policy-or-comment-only` → 0 blockers → false `physicalMoveAuthorized` (reported 21). Needs Option B reclassify to `must-update-before-move` or Option A migrate verifier + quarantine fixtures. Comment `5225397646`. Later head `304d89f` red (ENOENT rootPath "/index.html").

**SYS-SOURCE-AUTHORITY-TRIGGER-CLOSURE** — #1245 merged (+4 lines `src/content/articles/**` + `src/components/baptisty-rossii/**`), concrete fixed, guard-health DoD open: derive from `route-source-contract.js` `inspection.files` not ad-hoc list, prove mutations, mutation-test removal. Issue #1244.

### Owner decisions (3)

SEARCH-P2-07 (CrossWire RusSynodal 1.9.1 CANDIDATE_ONLY, `RusSynodalLIO` blocked, Cassian permission-controlled), REG-001 (hosting headers), NG-VIS-04 (Nagornaya prose rewrite).

---

## 2. Work Queue & Themes

- **WORK_QUEUE**: 4 candidates (Karty perf feTurbulence 14s not measured, renderMarkers GC not measured; Home Directions/Ambient double owner but no regression at `a068dece`; Baptists 3D 2.2M built-app not strangler; Strangler parity migration owned by #1090; Bible corpus candidate-only). All measurement-first, no promotion without trigger.
- **SYSTEM_THEMES**: 8 themes, 5 evidence-rich (RELEASE, EDITORIAL, CACHE, RUNTIME-OWNERSHIP, STRANGLER inventory), 1 candidate (PERFORMANCE), 2 closed (R-006 absorbed at `a55a038`), CONTENT-AUTHORITY fail-closed. No new theme needed this wave.

---

## 3. Incoming / Verification hygiene after marathon

- **Incoming**: 33 agents (was 40), 17M (was 27M). Remaining: `claude-atlas-deep-audit` 8.5M, `gbs-book-engine-research` 5.7M (deduped 1.2M), `search-deep-audit` 304K current, `arena-auditor` 304K, etc. No TBD empty (grep only 2 TODO in web-research secondary). All have anchor SHA/history.
- **Verification**: 31 waves 2026-08-* all have REPORT.md (113-252 lines + 1063 Current-Gold), no orphan. Atlas 34M PNG retained (future webp).
- **Reverify**: 105 files (was 135), 60 current `2026-08-*`, 45 `2026-07-21..08-06`. No LEGACY-ONLY-ACTIVE.

---

## 4. S-CLASS retrospective (archived DEEP_AUDIT_S-CLASS_2026-07-14)

- S-T-01 (audit-pro.js blind to .astro/.md/.mdx, only 61 HTML vs 54 Astro) → superseded by Workflow Policy v2 + page-ownership validation per `MATRIX_CLEANUP` (retired).
- S-SEC-01 (blacklist sanitizer in `enhancements.js`) → closed via `#1195` plain-text FAQ JSON-LD (no sanitizer) at `a2d0ce5` per `verification/2026-08-08-direct-defects-zero`.
- S-DATA-01 (series.json desync) → fixed/absorbed via route-source contract.
- S-A5 CSS-in-JS + D-4 z-index wars → absorbed into `AUDIT-CSS-DEAD-KEYFRAMES-TOKENS` / `D-4` polish.

No resurrection needed.

---

## 5. Next bounded repairs (priority)

1. **Strangler ledger truth** — reclassify self-verifier `must-update-before-move`, correct blocker count/PR body, or migrate verifier to storage resolver + quarantine fixtures (Option B preferred for Wave A narrow).
2. **Manifest reconciler** — extend `search-manifest-policy-normalizer.js::applyMigration` to reconcile `alreadyInManifest` via `buildManifestItem` preserving extras, add adversarial test, regenerate RSS/sitemap, prove idempotence.
3. **Reader census harness fix** — fresh page/context per control, re-snapshot, clear overlays, then rerun to validate 124 click / 12 runtime.
4. **Search #1209 body refresh** — remove stale `1f14761a` refs, verify hash projections deterministic, await exact-head green full suite.

No file deletions beyond archive moves; all evidence remains searchable via `archive/` + Git history. Validators PASS.

