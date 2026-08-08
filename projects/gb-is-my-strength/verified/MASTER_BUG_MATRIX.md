# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT текущей верифицированной нужной работы `gospod-bog.ru`.** Решённое / stale / duplicate / absorbed / invalid / superseded удаляется из MASTER в той же wave; подробная история остаётся в `verification/` и `legacy/`.

Current Strangler/security recheck: [`../verification/2026-08-08-strangler-red-ci-and-npm-security-inventory/REPORT.md`](../verification/2026-08-08-strangler-red-ci-and-npm-security-inventory/REPORT.md).  
Current discovery/S12/catalog/Search recheck: [`../verification/2026-08-08-discovery-s12-catalog-search-head-recheck/REPORT.md`](../verification/2026-08-08-discovery-s12-catalog-search-head-recheck/REPORT.md).  
Current deep-audit evidence: [`../verification/2026-08-08-total-current-gold-audit/REPORT.md`](../verification/2026-08-08-total-current-gold-audit/REPORT.md).  
Home/control-plane recheck: [`../verification/2026-08-08-home-main-ci-control-plane-recheck/REPORT.md`](../verification/2026-08-08-home-main-ci-control-plane-recheck/REPORT.md).

## Current state

| Поле | Значение |
|---|---|
| Product verification anchor | `6d671d0e30bff8da1f7354a00191ab990f17ed12` |
| Wave | discovery truth + catalog + Strangler exact-red + dependency inventory, 2026-08-08 |
| Active work units | **12** |
| Direct current defects | **2** |
| Verified necessary improvements | **3** |
| System verification lanes | **4** |
| Owner decisions | **3** |
| Closed/stale/duplicate rows retained in MASTER | **0** |

Product `#1218` is merged at current anchor. Its exact head passed the effective source/runtime/deploy/metadata/visual checks, so the published «Подпольная печать» body leak and its narrow `сохранён/сохранены локально` guard false-green are closed. `BAPT-S12-01` remains only for public metadata/discovery residuals.

Fresh exact npm inventory on this Product anchor found 8 transitive dev/build vulnerabilities but **0 production-only vulnerabilities**; disposable diagnostic `#1223` was closed unmerged and adds no active MASTER work. See current Strangler/security report.

Home bytes are unchanged since the prior Home recheck; temporary `astro.config.dev.mjs` remains absent. Directions/Ambient presentation-owner convergence stays in `WORK_QUEUE.md` until a concrete promotion trigger exists.

---

## CURRENT DEFECTS — 2

| ID | Required repair | Current evidence / boundary |
|---|---|---|
| `BAPT-S12-01` | Converge Baptist Spravochnik public metadata/discovery projections and make the S12 guard output-aware. | Current `BaptistyRossiiSpravochnikPageHead.astro` and `data/search-manifest.json` both expose `research-досье и очередь правок 3D-карты`; current Search consumes manifest `description` as visible result/preview text. Clean reader-facing copy already exists in the article body. PageHead JSON-LD dates (`2026-06-10` / `2026-06-13T12:00`) also disagree with manifest dates (`2026-06-18` / `2026-06-18T21:00`). Route profile says metadata authority is Astro-head import, while current manifest-policy tooling does not compare description/date parity. Closure: converge proper metadata authority → PageHead + manifest/Search, reconcile dates, add permanent public metadata/discovery S12+parity guard, reverify final exact SHA. [`REPORT`](../verification/2026-08-08-discovery-s12-catalog-search-head-recheck/REPORT.md) |
| `CATALOG-PROJECTION-01` | Replace the hand-authored `/articles/` publication copy with a truthful derived projection **without visual/media regression or stale discovery amplification**. | Product `#1221` is current owner. Derived membership direction is correct, but current candidate removes all card thumbnails/pictures despite established `/articles/` thumbnail CSS and old visual cards; its named guards do not require media. `data/route-profiles/articles.json` still names deleted `ArticlesPublicationsSection` in anatomy/styleContract, and strict route-profile tooling does not inspect those nested declarations. Candidate also renders dirty Spravochnik manifest description and sorts on drifted manifest modified dates. Before merge: converge discovery metadata, preserve/approve media disposition with durable browser/source guard, update canonical route profile, then require exact-head green CI. [`REPORT`](../verification/2026-08-08-discovery-s12-catalog-search-head-recheck/REPORT.md) |

---

## VERIFIED NECESSARY IMPROVEMENTS — 3

| ID | Needed implementation | Current boundary |
|---|---|---|
| `SEARCH-P3-02` | One truthful continuation contract across Pagefind, manifest fallback and exact Scripture occurrences: visible total/shown state + deterministic continuation, without reopening global shortcut ownership. | Product `#1209` remains owner. Use actual final PR head/ancestry/terminal CI, not historical body prose. Coordinate its Spravochnik PageHead cache-revision touch with `BAPT-S12-01`; do not open a competing edit. [`REPORT`](../verification/2026-08-08-discovery-s12-catalog-search-head-recheck/REPORT.md) |
| `AR-IDX-05` | Replace generic runtime `SITE_CONFIG.version` with explicit per-asset revision authority for runtime-loaded CSS, then retire the misleading generic bridge when unused. | `enhancements-runtime.css` / `highlights-runtime.css` have canonical hashes, while loaders still version via generic `SITE_CONFIG.version` seeded from unrelated glossary identity. Previous Search/CSS handoff evidence. |
| `AUDIT-JS-ESCAPER-DUP-X5` | Add one appropriate shared HTML-escaping primitive and migrate the five current local escapers while preserving loader availability and output/context semantics. | Five separate equivalent escapers remain across `js/site.js`, `js/highlights.js`, `js/search.js`; no canonical `site-utils` equivalent yet. Previous direct-defect-zero evidence. |

---

## SYSTEM VERIFICATION LANES — 4

| ID | Verified work package | Current boundary / owner |
|---|---|---|
| `SYS-CURRENT-GOLD-READINESS` | Derived publication-readiness evidence on top of existing route/publication authorities, including human reachability, metadata approval, research/content holds, visual evidence and production witness. | Product `#1220` is first implementation owner. Its earlier regex/hidden-ancestor false-green was fixed with Chromium + JS-off, ancestor/CSS/geometry/nofollow checks and adversarial fixtures. Do not retain that obsolete blocker or invent exotic clipping defects without a Product witness. Require current-main ancestry + terminal exact-head CI before merge; existing issue `#298` remains visual-golden authority. [`REPORT`](../verification/2026-08-08-discovery-s12-catalog-search-head-recheck/REPORT.md) |
| `SYS-BAPTISTY-PUBLICATION-READINESS` | Series-level readiness program for the ten Baptist routes after independently actionable defects are handled: Research closure, source confidence, media provenance, roadmap realization, diagrams where useful, modern-stat discipline and map/data/live convergence. | Decompose into bounded article/data/media/map lanes; no mega-PR. Current roadmap/media/visual-atlas/Research evidence remains in Current-Gold report. |
| `SYS-KARTY-HOLDING-PUBLICATION-READINESS` | Publication-readiness transaction for held map routes: viewport, collisions, responsive layout, controls, route readability, visual quality and route/schema readiness before activation. | Verify candidate browser/screenshots + `maps:validate`/route ownership immediately before activation. Promote only independently actionable blockers. |
| `SYS-STRANGLER-RETIREMENT` | Safely retire/quarantine legacy reference storage only after logical identity, dependency ownership, inventory/integrity/parity and post-move verification are all fail-closed. | Product `#1222` is current Wave-A owner, actual head observed `304d89f808ad82273f0ecbd2c704b23817956f17`, based on current main. Exact head is **RED**: Shared Files feasibility hits `ENOENT .../migration/legacy-reference/index.html`; Metadata/cache-bust rejects current Home `legacyPath: "/index.html"`; Source Authority reaches a red `Full static publication gate`. New `normalizeRepositoryPath()` rejects the current root logical-path representation, so root-route compatibility must be repaired and adversarially tested before any blocker-count reduction is authoritative. Separately, `legacy-shadow-retirement-readiness.mjs` still reads old physical paths, so current Wave A is not yet a post-move verifier and its manifest classification must remain truthful. Require exact-head Shared/Metadata/Source Authority green + readiness integrity/parity evidence before merge or blocker retirement. [`REPORT`](../verification/2026-08-08-strangler-red-ci-and-npm-security-inventory/REPORT.md) |

---

## OWNER DECISIONS — 3

| ID | Missing decision / evidence |
|---|---|
| `SEARCH-P2-07` | Exact licensed/provenanced Bible corpus acquisition/import/publication boundary **and policy reconciliation** (Product Charter Synodal default vs Content Quality NT Cassian / OT Synodal). Current Research remains fail-closed; no permission-unproven corpus expansion. |
| `REG-001` | Hosting/proxy decision for response-level CSP / X-Frame / Referrer / Permissions headers, or explicit accepted-risk disposition. |
| `NG-VIS-04` | Author/editor decision whether dense Nagornaya table/card material should be rewritten into more prose/air. |

---

## IN FLIGHT — collision / merge barriers

- `#1218` is merged; it is no longer an active owner. Remaining `BAPT-S12-01` is metadata/discovery only.
- `#1209` owns Search continuation and touches Spravochnik PageHead for cache projection; coordinate S12 there.
- `#1221` owns catalog projection. Audit review comment already records missing thumbnails, stale route-profile declaration and S12 amplification; do not authorize merge merely because ancestry is clean.
- `#1220` owns first Current-Gold reachability implementation; earlier hidden-parent blocker is retired after candidate repair.
- `#1222` owns Strangler storage abstraction Wave A. PR body names a stale exact head while GitHub actual head is newer; exact current CI is red as recorded above. Audit review comment also records the post-move readiness-verifier gap.
- `#1212` remains audit-only all-reading-route control census; treat it as evidence until rebased/current and independently green, not Product-repair authorization.
- `#1223` is closed unmerged `DIAGNOSTIC_DISPOSABLE`; its temp workflow must never be merged. Exact evidence: all npm vulnerabilities are dev/build-only; production-only count is zero.
- `#1216` and `#1214` remain closed unmerged / superseded; do not resume them.
- Existing issue `#298` owns product-golden blind spot; Current-Gold consumes it rather than duplicating it.
- Old Home/writer refs may retain unique commits. Never delete by name without branch-forensic proof.
- Do not combine Search, S12 metadata, runtime asset identity, JS escaper consolidation, catalog projection, Current-Gold tooling or Strangler work into one shared refactor wave.

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
