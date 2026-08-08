# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT текущей верифицированной нужной работы `gospod-bog.ru`.** Решённое / stale / duplicate / absorbed / invalid / superseded удаляется из MASTER в той же wave; подробная история остаётся в `verification/` и `legacy/`.

Current reader-control census clustering: [`../verification/2026-08-08-reader-control-census-root-clustering/REPORT.md`](../verification/2026-08-08-reader-control-census-root-clustering/REPORT.md).  
Current Strangler self-verifier blocker: [`../verification/2026-08-08-strangler-self-verifier-hidden-blocker/REPORT.md`](../verification/2026-08-08-strangler-self-verifier-hidden-blocker/REPORT.md).  
Current post-S12 / manifest-parity / Search-writer refresh: [`../verification/2026-08-08-post-s12-manifest-parity-search-writer/REPORT.md`](../verification/2026-08-08-post-s12-manifest-parity-search-writer/REPORT.md).  
Current live refresh after Current-Gold merge: [`../verification/2026-08-08-post-current-gold-live-refresh/REPORT.md`](../verification/2026-08-08-post-current-gold-live-refresh/REPORT.md).  
Current reader-control semantics evidence: [`../verification/2026-08-08-reader-control-semantics-current-root/REPORT.md`](../verification/2026-08-08-reader-control-semantics-current-root/REPORT.md).  
Current Strangler/security recheck: [`../verification/2026-08-08-strangler-red-ci-and-npm-security-inventory/REPORT.md`](../verification/2026-08-08-strangler-red-ci-and-npm-security-inventory/REPORT.md).  
Current discovery/S12/catalog/Search recheck: [`../verification/2026-08-08-discovery-s12-catalog-search-head-recheck/REPORT.md`](../verification/2026-08-08-discovery-s12-catalog-search-head-recheck/REPORT.md).  
Current deep-audit evidence: [`../verification/2026-08-08-total-current-gold-audit/REPORT.md`](../verification/2026-08-08-total-current-gold-audit/REPORT.md).  
Home/control-plane recheck: [`../verification/2026-08-08-home-main-ci-control-plane-recheck/REPORT.md`](../verification/2026-08-08-home-main-ci-control-plane-recheck/REPORT.md).

## Current state

| Поле | Значение |
|---|---|
| Product verification anchor | `11999f6d674e64e6afef590adeb71aeaaf303b3a` |
| Wave | post-S12 live refresh: metadata/discovery convergence + manifest field parity + Search final validation + reader/Strangler truth repair, 2026-08-08 |
| Active work units | **13** |
| Direct current defects | **2** |
| Verified necessary improvements | **3** |
| System verification lanes | **5** |
| Owner decisions | **3** |
| Closed/stale/duplicate rows retained in MASTER | **0** |

Product `#1238` removed the five verified Baptist MDX/body Charter S12 backstage markers. Product `#1245` then completed exact-head Source Authority, Shared Files, Node Toolchain and Metadata SUCCESS and merged as current anchor `11999f6d...`, permanently adding Baptist MDX/body publication paths to the Source Authority trigger. The remaining `BAPT-S12-01` scope is therefore Spravochnik metadata/discovery convergence only; neither the fixed body/MDX leaks nor trigger coverage remain unfinished work.

First Current-Gold implementation `#1220` is merged and is no longer an active owner. Fresh exact npm inventory remains non-actionable as a public-runtime defect: 8 vulnerabilities exist only in the transitive dev/build graph and `npm audit --omit=dev` reports **0**. Disposable diagnostics `#1223` and `#1237` are closed unmerged and add no Product code.

Home bytes remain without a new direct regression witness in this wave; temporary `astro.config.dev.mjs` remains absent. Directions/Ambient presentation-owner convergence stays in `WORK_QUEUE.md` until a concrete promotion trigger exists.

---

## CURRENT DEFECTS — 2

| ID | Required repair | Current evidence / boundary |
|---|---|---|
| `BAPT-S12-01` | Remove remaining reader-facing Baptist backstage/research wording at the **real PageHead metadata authority**, then deterministically converge Search/RSS/sitemap projections and verify field parity. | Current Product `main@11999f6d...` still inherits the directly verified `BaptistyRossiiSpravochnikPageHead.astro` wording `research-досье` and `очередь правок 3D-карты` in meta description, Twitter, OG and Article JSON-LD; current main changed only Source Authority workflow coverage after the direct `fa2db40c...` read. `#1238` already removed the five MDX/body S12 markers. `#1245` is merged, so trigger coverage is closed. Closed `#1228` proved direct manifest editing is the wrong mutation layer. Closure: after Search releases its cache-projection touch on this PageHead, repair the source metadata once, run canonical manifest reconciliation plus RSS/sitemap projection, verify dates/fields and exact Product SHA. [`REPORT`](../verification/2026-08-08-post-s12-manifest-parity-search-writer/REPORT.md) |
| `CATALOG-PROJECTION-01` | Replace the hand-authored `/articles/` publication owner with a truthful derived projection **only after the discovery metadata it exposes is source-converged**, while preserving media and architecture metadata. | Product `#1221` remains owner at observed head `0c779df113b5716a200bda023d356ef33cdade22`, now `behind=2` from current main. The candidate explicitly renders reader-facing `title`/`description`/`image` from `data/search-manifest.json`. Disposable read-only diagnostic `#1237` proved **67/73** existing manifest rows differ from built/PageHead metadata in at least one field (66 title, 29 description, 4 missing image, 17 image mismatch, 16 published-date, 25 modified-date); missing-image witnesses include `/hard-texts/`, `/karty/`, `/karty/avraam/`, `/map/`. Root cause is now localized: canonical `search-manifest-policy-normalizer.js` can derive the correct metadata with `buildManifestItem()`, but `migrationCandidates()/applyMigration()` only add missing/promoted routes and explicitly skip `candidate.alreadyInManifest`, while strict Search/index inventory verifies membership/policy rather than PageHead field parity. Existing-row reconciliation must preserve non-derived extras (`featured`, `priority`, `scripture`, series fields, `author`, `wordCount` where present) instead of blindly replacing rows. RSS and policy-generated sitemap metadata consume the manifest downstream, so this is discovery-chain authority, not merely catalog imagery. Also converge the stale `/articles/` route profile from deleted `ArticlesPublicationsSection` to `ArticlesLibrarySection`. No dedicated open implementation PR for the systemic field-parity root was verified. [`REPORT`](../verification/2026-08-08-post-s12-manifest-parity-search-writer/REPORT.md) |

---

## VERIFIED NECESSARY IMPROVEMENTS — 3

| ID | Needed implementation | Current boundary |
|---|---|---|
| `SEARCH-P3-02` | One truthful continuation contract across Pagefind, manifest fallback and exact Scripture occurrences: visible total/shown state + deterministic continuation, without reopening global shortcut ownership or leaving a self-writing merge transport. | Product `#1209` remains owner. Latest observed head `12896c2e40b4cb359ecadedb7bbe1f84c7b3cde2` contains current `main@11999f6d...` (`behind=0`). Temporary self-writing finalizer workflow/script are **absent from the current net diff**; the old writer-policy blocker is closed. Current compare is 87 files: five semantic Search/test owners (`js/search.js`, `css/command-palette.css`, `app-search-surface-source-contract`, `search-modal-browser-contract`, `search-scripture-occurrence-runtime-browser-test`) plus deterministic revision projections. Current projection carries `command-palette.css@3b88813f` and `search.js@027c3f4f`; sampled PageHead/Chrome/Footer/Body consumers are hash-only and Spravochnik backstage metadata is unchanged. Latest commit only classifies the exact intentionally injected Scripture-index HTTP 503 console line as expected inside that fallback fixture; other console errors remain failures. Exact-head Shared Files, Node Toolchain, Metadata, Scripture index/suggestion and several source gates are already SUCCESS; Search Modal and Search Scripture Runtime remain in progress at this snapshot. PR body is still stale (`1f14761a...` / `882d904...`, four semantic owners, predecessors `#1227/#1233`). Merge only after all effective `12896c2e...`-or-later workflows are terminal SUCCESS and the PR record is refreshed to the actual final SHA/scope/adjacent owners. [`REPORT`](../verification/2026-08-08-post-s12-manifest-parity-search-writer/REPORT.md) |
| `AR-IDX-05` | Replace generic runtime `SITE_CONFIG.version` with explicit per-asset revision authority for runtime-loaded CSS, then retire the misleading generic bridge when unused. | `enhancements-runtime.css` / `highlights-runtime.css` have canonical hashes, while loaders still version via generic `SITE_CONFIG.version` seeded from unrelated glossary identity. |
| `AUDIT-JS-ESCAPER-DUP-X5` | Add one appropriate shared HTML-escaping primitive and migrate the five current local escapers while preserving loader availability and output/context semantics. | Five separate equivalent escapers remain across `js/site.js`, `js/highlights.js`, `js/search.js`; no canonical `site-utils` equivalent yet. |

---

## SYSTEM VERIFICATION LANES — 5

| ID | Verified work package | Current boundary / owner |
|---|---|---|
| `SYS-CURRENT-GOLD-READINESS` | Derived publication-readiness evidence on top of existing route/publication authorities, including human reachability, metadata approval, research/content holds, visual evidence and production witness. | First implementation `#1220` is **merged**. Its earlier regex/hidden-ancestor reachability false-green was repaired with Chromium + JS-off, ancestor/CSS/geometry/nofollow checks and adversarial fixtures. Keep the system root only for subsequent readiness convergence that is independently evidenced; issue `#298` remains visual-golden authority. |
| `SYS-READER-CONTROL-SEMANTICS` | Unify truthful control→surface/action semantics across standalone and shared series reader engines without merging layouts into one mega-component. | Product issue `#1224` remains authority. `#1240@f91507fb...` is the correct two-file owner for **all 174** shared mobile Back-drift manifestations; `#1246@3cd81b29...` is the two-file relation-state owner covering **64/70** missing `aria-controls` manifestations. Both are `behind=2` from current main and need current-main refresh + fresh exact-head CI. The 887 raw findings from audit-only `#1212` cluster into a small number of shared roots rather than 887 defects: one `GillLearningSheet` conditional `panelQuiz → tabQuiz` orphan (**174** manifestations / 42 routes); shared invalid-list tracks (**100× `gbs2-track` + 3× `hrail-track`**); three hit-area fingerprints (**100× `mobSpdBadge`, 100× `gbsTocToggle`, 7× `hmSpdBadge`**); six remaining Nagornaya `barSectionBtn` relations; three-route footnote accessible-name uniqueness; and Nagornaya `barShareBtn` clipping at 390. The **124 click-failed** manifestations are not yet Product authority because the census clicks controls sequentially on one mutated DOM and fails to provide a true fresh-state reset; the 12 runtime errors are also contaminated mainly by local-origin CSP/WebKit audit noise. Fix/re-run the census guard before promoting those dynamic categories. Dominant shared source blobs are byte-identical between census head and current main, so the static roots remain current. [`CLUSTERING`](../verification/2026-08-08-reader-control-census-root-clustering/REPORT.md) |
| `SYS-BAPTISTY-PUBLICATION-READINESS` | Series-level readiness program for the ten Baptist routes after independently actionable defects are handled: Research closure, source confidence, media provenance, roadmap realization, diagrams where useful, modern-stat discipline and map/data/live convergence. | Decompose into bounded article/data/media/map lanes; no mega-PR. Current roadmap/media/visual-atlas/Research evidence remains in Current-Gold report. |
| `SYS-KARTY-HOLDING-PUBLICATION-READINESS` | Publication-readiness transaction for held map routes: viewport, collisions, responsive layout, controls, route readability, visual quality and route/schema readiness before activation. | Verify candidate browser/screenshots + `maps:validate`/route ownership immediately before activation. Promote only independently actionable blockers. |
| `SYS-STRANGLER-RETIREMENT` | Safely retire/quarantine legacy reference storage only after logical identity, dependency ownership, inventory/integrity/parity and post-move verification are all fail-closed. | Product `#1222@22983986...` is current-main-clean (`behind=0`), mergeable and exactly five intended files; **all seven fresh exact-head workflows are SUCCESS** (Shared, Deploy, Metadata, Search Modal, Source Authority, Visual, Route Registry). However merge authorization is still blocked by a current ledger/readiness blind spot that green CI does not detect: `legacy-shadow-retirement-readiness.mjs` directly reads governed bytes through `path.join(root, item.path/entry.legacyPath)` yet its own dependency row is classified `none-fixture-policy-or-comment-only`, so it contributes zero blockers to the report that computes `physicalMoveAuthorized = deletionReady`. There is no quarantine-only self-test for this verifier read path. The advertised `21 blockers` is therefore incomplete. Keep the five-file Wave A bounded by reclassifying this self-verifier as `must-update-before-move` and correcting blocker arithmetic/PR body, or widen the candidate deliberately to make the verifier storage-aware with quarantine/ambiguity fixtures; then rerun exact-head CI. Audit comment `5225397646` records the blocker. [`REPORT`](../verification/2026-08-08-strangler-self-verifier-hidden-blocker/REPORT.md) |

---

## OWNER DECISIONS — 3

| ID | Missing decision / evidence |
|---|---|
| `SEARCH-P2-07` | Exact licensed/provenanced Bible corpus acquisition/import/publication boundary **and policy reconciliation** (Product Charter Synodal default vs Content Quality NT Cassian / OT Synodal). Current Research remains fail-closed; no permission-unproven corpus expansion. |
| `REG-001` | Hosting/proxy decision for response-level CSP / X-Frame / Referrer / Permissions headers, or explicit accepted-risk disposition. |
| `NG-VIS-04` | Author/editor decision whether dense Nagornaya table/card material should be rewritten into more prose/air. |

---

## IN FLIGHT — collision / merge barriers

- `#1209` owns Search continuation at observed head `12896c2e...`, `behind=0`. Temporary writer transport is gone. Current semantic scope is five Search/test files plus deterministic hash projections; `search.js` consumers are converged to `027c3f4f`. Shared Files and several source/toolchain gates are green; Search Modal and Scripture Runtime are still running. PR body remains stale and must be refreshed before merge even if CI finishes green.
- `#1221` owns catalog projection at observed head `0c779df...`, `behind=2`. Thumbnail rendering/guard is repaired; blocker is systemic existing-row manifest reconciliation (**67/73 divergent rows**) at the existing canonical normalizer layer, plus Spravochnik source metadata, stale `/articles/` route profile and final exact-head green.
- `#1222` owns Strangler storage abstraction Wave A at `22983986...`: current-main-clean, five-file scope, 7/7 fresh CI green, but **not merge-authorized** because its readiness verifier is an active physical-path reader misclassified as nonblocking. Correct ledger/storage truth and blocker arithmetic first; audit comment `5225397646` is the current handoff.
- `#1224` remains SYSTEM authority for reader-control semantics. `#1240` owns the shared Back root (174 manifestations); `#1246` owns relation synchronization (64/70 missing `aria-controls`). Both remain two-file scopes but are `behind=2` and must refresh/rerun. Next bounded roots after collision-safe sequencing: conditional quiz panel, shared list-track semantics, target sizes, Nagornaya relation/clipping, footnote names, then repaired dynamic census.
- `#1212` remains audit-only all-reading-route control census. Its raw 887 manifestations are decomposition evidence, not Product repair. Static clusters are current-main applicable; **do not promote its 124 click failures or 12 runtime errors until harness isolation/environment noise is repaired and the affected cases reproduce independently**. A branch named `agent/system-article-control-census-20260808-r2` exists but no separate open successor PR was verified at this refresh.
- `#1245` is **merged** as `11999f6d...`; Source Authority trigger coverage for Baptist MDX/body publication paths is closed and must not remain active.
- `#1238` is **merged** and removed the five body/MDX S12 markers; do not retain those fixed manifestations as active defects.
- `#1237` is **closed unmerged** `DIAGNOSTIC_DISPOSABLE`; its 67/73 manifest parity inventory is evidence only and its workflow/code must not enter Product.
- `#1220` is **merged** and no longer active.
- `#1228` is **closed unmerged** as wrong mutation layer; no direct hand-edit of Search manifest.
- `#1223` is **closed unmerged** `DIAGNOSTIC_DISPOSABLE`; production-only npm vulnerability count remains zero.
- `#1218` is merged; `#1216` and `#1214` remain closed unmerged / superseded.
- Existing issue `#298` owns product-golden blind spot; Current-Gold consumes it rather than duplicating it.
- Old Home/writer refs may retain unique commits. Never delete by name without branch-forensic proof.
- Do not combine Search, S12 source/metadata, runtime asset identity, JS escaper consolidation, catalog projection, Current-Gold tooling, reader-controls or Strangler work into one shared refactor wave.

Recently retired/merged roots are intentionally absent from active rows: `BAPT-CONTENT-TRUTH-01`, `GILL-PROJECTION-01`, Genesis owner-gap, previous CSS-owner duplicates and earlier fixed security/semantic rows remain in verification history.

---

## Hygiene

1. MASTER holds verified necessary **current** work; detailed decomposition lives in verification evidence.
2. Solve → verify result → remove from MASTER immediately.
3. Many symptoms with one root → one active row.
4. Candidate-only defects stay under the owning active root unless independently present on current `main`.
5. A moving Product `main` alone is not a reason to rewrite authority; update when disposition, scope, evidence or actionable handoff changes.
6. `CURRENT GOLD` is derived evidence, never a second manually maintained publication SSOT.
7. Before Product edits, inspect current Product HEAD/open PRs and avoid owner/file collisions.
