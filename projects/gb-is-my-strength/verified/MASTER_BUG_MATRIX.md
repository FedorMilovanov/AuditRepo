# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT текущей верифицированной нужной работы `gospod-bog.ru`.** Решённое / stale / duplicate / absorbed / invalid / superseded удаляется из MASTER в той же wave; подробная история остаётся в `verification/` и `legacy/`.

Current Search-merged / Spravochnik S12 expansion: [`../verification/2026-08-08-search-merged-s12-source-expansion/REPORT.md`](../verification/2026-08-08-search-merged-s12-source-expansion/REPORT.md).  
Current reader-control census clustering: [`../verification/2026-08-08-reader-control-census-root-clustering/REPORT.md`](../verification/2026-08-08-reader-control-census-root-clustering/REPORT.md).  
Current Strangler self-verifier blocker: [`../verification/2026-08-08-strangler-self-verifier-hidden-blocker/REPORT.md`](../verification/2026-08-08-strangler-self-verifier-hidden-blocker/REPORT.md).  
Current post-S12 / manifest-parity evidence: [`../verification/2026-08-08-post-s12-manifest-parity-search-writer/REPORT.md`](../verification/2026-08-08-post-s12-manifest-parity-search-writer/REPORT.md).  
Current live refresh after Current-Gold merge: [`../verification/2026-08-08-post-current-gold-live-refresh/REPORT.md`](../verification/2026-08-08-post-current-gold-live-refresh/REPORT.md).  
Current reader-control semantics evidence: [`../verification/2026-08-08-reader-control-semantics-current-root/REPORT.md`](../verification/2026-08-08-reader-control-semantics-current-root/REPORT.md).  
Current Strangler/security recheck: [`../verification/2026-08-08-strangler-red-ci-and-npm-security-inventory/REPORT.md`](../verification/2026-08-08-strangler-red-ci-and-npm-security-inventory/REPORT.md).  
Current discovery/S12/catalog recheck: [`../verification/2026-08-08-discovery-s12-catalog-search-head-recheck/REPORT.md`](../verification/2026-08-08-discovery-s12-catalog-search-head-recheck/REPORT.md).  
Current deep-audit evidence: [`../verification/2026-08-08-total-current-gold-audit/REPORT.md`](../verification/2026-08-08-total-current-gold-audit/REPORT.md).  
Home/control-plane recheck: [`../verification/2026-08-08-home-main-ci-control-plane-recheck/REPORT.md`](../verification/2026-08-08-home-main-ci-control-plane-recheck/REPORT.md).

## Current state

| Поле | Значение |
|---|---|
| Product verification anchor | `02ee0e35faebe6edde85db4770c0d0a78985e711` |
| Research authority | `d52ea9d54dd2c2488223d25f5f6cefd263c23328` |
| Wave | Search merged; Spravochnik S12 source cleanup → existing-row manifest reconciliation → catalog; stable reader census + Strangler truth repair, 2026-08-08 |
| Active work units | **14** |
| Direct current defects | **2** |
| Verified necessary improvements | **2** |
| Narrowed residuals | **0** |
| System verification lanes | **7** |
| Owner decisions | **3** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

Product `#1209` is merged as current anchor `02ee0e35...`; `SEARCH-P3-02` is retired from active work. Product `#1238` removed the earlier five Baptist MDX/body Charter-S12 markers, and `#1245` permanently added Baptist article/body surfaces to Source Authority workflow coverage. The remaining direct `BAPT-S12-01` is a newly sharpened Spravochnik source/metadata problem exposed by that now-working guard, not a resurrection of the previously fixed five markers. The broader Source Authority trigger-closure failure mode remains a separate SYSTEM guard-health residual under Product issue `#1244`.

First Current-Gold implementation `#1220` is merged and no longer active. Fresh exact npm inventory remains non-actionable as a public-runtime defect: 8 vulnerabilities exist only in the transitive dev/build graph and `npm audit --omit=dev` reports **0**. Disposable diagnostics `#1223` and `#1237` are closed unmerged and add no Product code.

Home remains without a new direct regression witness in this wave. Current Source Authority reaches the Spravochnik hygiene failure only after Home/native publication contracts pass; temporary `astro.config.dev.mjs` remains absent. Directions/Ambient presentation-owner convergence stays in `WORK_QUEUE.md` until a concrete promotion trigger exists.

---

## CURRENT DEFECTS — 2

| ID | Required repair | Current evidence / boundary |
|---|---|---|
| `BAPT-S12-01` | Clean the remaining Spravochnik backstage language at **all real source/publication authorities**, keep S12 guard fail-closed, then hand clean source metadata to canonical discovery reconciliation. | Product `#1253` is the current bounded source/guard owner at observed head `8e65a241cdb0ca2feb254bbed3f07da9d36bbb5c`, based exactly on `main@02ee0e35...`. Its PageHead rewrite is correctly source-layered and does not touch manifest/RSS/sitemap. But exact Source Authority run `31250265756` / job `93085423606` is RED because the widened `sources:hygiene` finds the same `очередь правок 3D-карты` marker in **both** `src/content/articles/spravochnik.mdx` and `src/components/baptisty-rossii/BaptistyRossiiSpravochnikBody.astro`. Direct reads prove a full backstage block remains in both twins: internal edit instruction mentioning `_app/index.html`, future map-edit backlog and service wording. Charter S12 explicitly forbids internal repository paths and notes such as “что исправить в 3D-карте”, so a cosmetic heading rename is not sufficient. Current open-owner census found no competing PR for the two twins; audit comment `5225896409` recommends widening the coherent source/guard transaction while keeping discovery artifacts untouched. After source cleanup, Product issue `#1252` owns canonical existing-row manifest reconciliation. [`REPORT`](../verification/2026-08-08-search-merged-s12-source-expansion/REPORT.md) |
| `CATALOG-PROJECTION-01` | Replace the hand-authored `/articles/` publication owner with a truthful derived projection **only after source metadata and existing Search-manifest rows are canonically converged**, while preserving media and architecture metadata. | Product `#1221@0c779df...` remains the catalog owner and is now `behind=3` from current `main@02ee0e35...`. The candidate renders reader-facing `title`/`description`/`image` from `data/search-manifest.json`. Disposable read-only `#1237` proved **67/73** existing manifest rows differ from built/PageHead metadata in at least one derived field (66 title, 29 description, 4 missing image, 17 image mismatch, 16 published-date, 25 modified-date); missing-image witnesses include `/hard-texts/`, `/karty/`, `/karty/avraam/`, `/map/`. Product issue **`#1252`** is now the explicit systemic owner for this root: extend canonical `search-manifest-policy-normalizer.js` so existing rows are reconciled from `buildManifestItem()` while preserving non-derived extras (`featured`, `priority`, `scripture`, series fields, `author`, `wordCount`, etc.), and verify RSS/sitemap downstream consumers. `#1221` must also converge its stale `/articles/` route profile from deleted `ArticlesPublicationsSection` to `ArticlesLibrarySection`. Its body still names merged Search `#1209` as the PageHead blocker and must be refreshed after `#1253 → #1252`. Direct manifest hand-editing remains forbidden by closed `#1228` evidence. [`REPORT`](../verification/2026-08-08-search-merged-s12-source-expansion/REPORT.md) |

---

## VERIFIED NECESSARY IMPROVEMENTS — 2

| ID | Needed implementation | Current boundary |
|---|---|---|
| `AR-IDX-05` | Replace generic runtime `SITE_CONFIG.version` with explicit per-asset revision authority for runtime-loaded CSS, then retire the misleading generic bridge when unused. | `enhancements-runtime.css` / `highlights-runtime.css` have canonical hashes, while loaders still version via generic `SITE_CONFIG.version` seeded from unrelated glossary identity. |
| `AUDIT-JS-ESCAPER-DUP-X5` | Add one appropriate shared HTML-escaping primitive and migrate the five current local escapers while preserving loader availability and output/context semantics. | Five separate equivalent escapers remain across `js/site.js`, `js/highlights.js`, `js/search.js`; no canonical `site-utils` equivalent yet. |

---

## SYSTEM VERIFICATION LANES — 7

| ID | Verified work package | Current boundary / owner |
|---|---|---|
| `SYS-CURRENT-GOLD-READINESS` | Derived publication-readiness evidence on top of existing route/publication authorities, including human reachability, metadata approval, research/content holds, visual evidence and production witness. | First implementation `#1220` is **merged**. Its earlier regex/hidden-ancestor reachability false-green was repaired with Chromium + JS-off, ancestor/CSS/geometry/nofollow checks and adversarial fixtures. Keep the system root only for subsequent readiness convergence that is independently evidenced; issue `#298` remains visual-golden authority. |
| `SYS-READER-CONTROL-SEMANTICS` | Unify truthful control→surface/action semantics across standalone and shared series reader engines without merging layouts into one mega-component. | Product issue `#1224` remains authority. `#1240@f91507fb...` is the correct two-file owner for **all 174** shared mobile Back-drift manifestations; `#1246@3cd81b29...` is the two-file relation-state owner covering **64/70** missing `aria-controls` manifestations. Both are now `behind=3` from `main@02ee0e35...` and need clean current-main refresh + fresh exact-head CI. The raw 887 audit-only `#1212` manifestations cluster into shared roots: one `GillLearningSheet` conditional `panelQuiz → tabQuiz` orphan (**174** manifestations / 42 routes); shared invalid-list tracks (**100× `gbs2-track` + 3× `hrail-track`**); three undersized-target geometry fingerprints (**100× `mobSpdBadge`, 100× `gbsTocToggle`, 7× `hmSpdBadge`**); six remaining Nagornaya `barSectionBtn` relations; and Nagornaya `barShareBtn` clipping at 390. Footnote identity/projection remains separate under `SYS-FOOTNOTE-SEMANTIC-PROJECTION`. The **124 click-failed** manifestations are not Product authority until the census uses true fresh state per control; most of the 12 runtime-error scenes are also local-origin/WebKit audit noise. [`CLUSTERING`](../verification/2026-08-08-reader-control-census-root-clustering/REPORT.md) |
| `SYS-FOOTNOTE-SEMANTIC-PROJECTION` | Make numbered/source footnotes first-class publication notes with one source identity and truthful screen + accessibility + print projections instead of tooltip-only semantics. | Product issue `#1225` is canonical authority. Stable census reports `footnote-name-not-unique` in **14 route/browser/viewport scenes**, containing 114 generic-name footnotes on Hermenevtika, 21 on `/articles/kod-da-vinchi/`, and 40 on `/articles/krajne-li-isporcheno-serdce/`. Preserve the completed nested-Bible repair and existing print geometry owner; fix identity/projection systemically and prove deterministic print endnote completeness plus unique marker→note relations rather than route-local label patches. [`REPORT`](../verification/2026-08-08-total-current-gold-audit/REPORT.md) |
| `SYS-BAPTISTY-PUBLICATION-READINESS` | Series-level readiness program for the ten Baptist routes after independently actionable defects are handled: Research closure, source confidence, media provenance, roadmap realization, diagrams where useful, modern-stat discipline and map/data/live convergence. | Decompose into bounded article/data/media/map lanes; no mega-PR. Current roadmap/media/visual-atlas/Research evidence remains in Current-Gold report. |
| `SYS-KARTY-HOLDING-PUBLICATION-READINESS` | Publication-readiness transaction for held map routes: viewport, collisions, responsive layout, controls, route readability, visual quality and route/schema readiness before activation. | Verify candidate browser/screenshots + `maps:validate`/route ownership immediately before activation. Promote only independently actionable blockers. |
| `SYS-STRANGLER-RETIREMENT` | Safely retire/quarantine legacy reference storage only after logical identity, dependency ownership, inventory/integrity/parity and post-move verification are all fail-closed. | Product `#1222` has refreshed to `a83232833bc23f03291c3fed7330f14779f243c5`; current `main@02ee0e35...` is an ancestor (`behind=0`) and semantic compare remains exactly the same five intended Strangler files. Shared Files and Metadata are already SUCCESS on this head; other fresh gates were still running at the latest check. **The hidden blocker remains unchanged:** current ledger still classifies `scripts/legacy-shadow-retirement-readiness.mjs` as `fixture-or-contract / production-required / none-fixture-policy-or-comment-only`, although the verifier directly reads governed bytes by active physical path and has no quarantine-only self-test. Thus its dependency contributes zero blockers to the arithmetic that can eventually set `physicalMoveAuthorized`. Full green CI does not make that classification truthful. Audit comment `5225397646` remains the handoff: reclassify it as `must-update-before-move` with corrected blocker arithmetic/PR body, or deliberately make the verifier storage-aware with adversarial quarantine/ambiguity fixtures. [`REPORT`](../verification/2026-08-08-strangler-self-verifier-hidden-blocker/REPORT.md) |
| `SYS-SOURCE-AUTHORITY-TRIGGER-CLOSURE` | Make Source Authority workflow applicability fail closed against the publication source surfaces its static-publication validation actually consumes. | Product issue `#1244` is the canonical guard-health owner. Merged `#1245` closed the concrete Baptist false-negative by adding `src/content/articles/**` and `src/components/baptisty-rossii/**` to PR/push filters. The current `#1253` failure is positive evidence that this concrete trigger now works: its PageHead/guard change reaches full static publication and exposes current MDX/Body S12 leaks. Full issue DoD remains open: derive closure from existing route/source authority rather than another ad-hoc list, prove representative protected source mutations make workflow applicable for PR and push, and mutation-test loss of coverage. [`REPORT`](../verification/2026-08-08-total-current-gold-audit/REPORT.md) |

### Census findings not yet promoted to Product defects

- **124 stable `click-failed`** are sequence-contaminated by same-document state; require isolated fresh-page/fresh-context replay before Product promotion.
- **207 `<24px` target observations** are geometry prefilters, not 207 WCAG 2.2 SC 2.5.8 failures. A valid automated verdict must additionally evaluate the normative spacing condition / applicable exceptions and record the nearest conflicting pointer target before emitting `target-size-fail`.
- **12 runtime-error scenes** are mixed with WebKit `interactive-widget` warnings and localhost manifest/CSP noise; isolate the Hermenevtika WebKit `TypeError: Load failed` before promotion.
- Nagornaya `barShareBtn` clipping is visually real in six mobile-390 scenes; keep it under the reader-control system root until its exact source/runtime owner is collision-safe.

---

## OWNER DECISIONS — 3

| ID | Missing decision / evidence |
|---|---|
| `SEARCH-P2-07` | Exact licensed/provenanced Bible corpus acquisition/import/publication boundary **and policy reconciliation** (Product Charter Synodal default vs Content Quality NT Cassian / OT Synodal). Current Research remains fail-closed; no permission-unproven corpus expansion. |
| `REG-001` | Hosting/proxy decision for response-level CSP / X-Frame / Referrer / Permissions headers, or explicit accepted-risk disposition. |
| `NG-VIS-04` | Author/editor decision whether dense Nagornaya table/card material should be rewritten into more prose/air. |

---

## IN FLIGHT — collision / merge barriers

- `#1253` owns the Spravochnik S12 source/guard slice at observed head `8e65a241...`, based exactly on current main. Most gates are green, but Source Authority is **RED by design-relevant current evidence**: MDX and production Body still expose the 3D map-edit backlog/internal `_app/index.html` workflow. Do not weaken `sources:hygiene`; widen/clean the real source twins, refresh scope record and rerun exact-head CI. Audit comment `5225896409` is the current handoff.
- Product issue `#1252` owns canonical existing-row Search-manifest reconciliation. No separate implementation PR was verified at this snapshot. Required acceptance remains prior 67/73 derived-field divergence → 0 unapproved derived-field divergences while preserving non-derived extras and downstream RSS/sitemap truth.
- `#1221@0c779df...` owns catalog projection and is `behind=3`. Its correct upstream sequence is now `#1253 → #1252 → #1221`; its body still names merged `#1209` and must be refreshed only after those authorities land.
- `#1222@a8323283...` is current-main-clean and still five-file bounded, but **not merge-authorized** because its readiness verifier remains an active physical-path reader misclassified as nonblocking. Fresh CI cannot substitute for correcting ledger/storage truth.
- `#1224` remains SYSTEM authority for reader-control semantics. `#1240` owns the shared Back root (174 manifestations); `#1246` owns relation synchronization (64/70 missing `aria-controls`). Both remain two-file semantic scopes but are `behind=3` from current main and require clean replay/rerun. Next collision-safe roots: conditional quiz panel, shared list-track semantics, Nagornaya relation/clipping, then repaired dynamic census. Footnotes stay under separate issue `#1225`.
- `#1212` remains audit-only all-reading-route control census and is now `behind=7` from current main. Its current net diff is two files (workflow + census), while PR prose still describes an older three-file architecture. More importantly, **do not promote its 124 click failures, 207 size-prefilter observations or 12 runtime errors as direct Product defects without the isolation/spacing/environment evidence described above**. Audit comment `5225420164` owns the guard-health handoff.
- `#1244` remains SYSTEM authority only for adversarial Source Authority trigger-closure guard health after merged `#1245`; the concrete Baptist trigger witness itself is fixed.
- `#1209` is **merged** as `02ee0e35...`; Search continuation is retired from active MASTER work.
- `#1245` is **merged** as `11999f6d...`; Baptist publication-path Source Authority trigger coverage is closed.
- `#1238` is **merged**; do not retain its previously fixed five S12 manifestations as active defects.
- `#1237` is **closed unmerged** `DIAGNOSTIC_DISPOSABLE`; its 67/73 manifest parity inventory is evidence only.
- `#1220` is **merged** and no longer active.
- `#1228` is **closed unmerged** as wrong mutation layer; no direct hand-edit of Search manifest.
- `#1223` is **closed unmerged** `DIAGNOSTIC_DISPOSABLE`; production-only npm vulnerability count remains zero.
- `#1218` is merged; `#1216` and `#1214` remain closed unmerged / superseded.
- Existing issue `#298` owns product-golden blind spot; Current-Gold consumes it rather than duplicating it.
- Old Home/writer refs may retain unique commits. Never delete by name without branch-forensic proof.
- Do not combine S12 source cleanup, manifest reconciliation, catalog projection, runtime asset identity, JS escaper consolidation, Current-Gold tooling, reader-controls, footnote projection, Source Authority trigger closure or Strangler work into one shared refactor wave.

Recently retired/merged roots are intentionally absent from active rows: `SEARCH-P3-02`, `BAPT-CONTENT-TRUTH-01`, `GILL-PROJECTION-01`, Genesis owner-gap, previous CSS-owner duplicates and earlier fixed security/semantic rows remain in verification history.

---

## Hygiene

1. MASTER holds verified necessary **current** work; detailed decomposition lives in verification evidence.
2. Solve → verify result → remove from MASTER immediately.
3. Many symptoms with one root → one active row.
4. Candidate-only defects stay under the owning active root unless independently present on current `main`.
5. A moving Product `main` alone is not a reason to rewrite authority; update when disposition, scope, evidence or actionable handoff changes.
6. `CURRENT GOLD` is derived evidence, never a second manually maintained publication SSOT.
7. Before Product edits, inspect current Product HEAD/open PRs and avoid owner/file collisions.
8. Audit findings may be promoted **or demoted** when stronger route/source/runtime evidence arrives; correct the authority record instead of defending an earlier hypothesis.
