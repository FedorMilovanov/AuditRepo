# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT текущей верифицированной нужной работы `gospod-bog.ru`.** Решённое / stale / duplicate / absorbed / invalid / superseded удаляется из MASTER в той же wave; подробная история остаётся в `verification/` и `legacy/`.

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
| Wave | post-S12 live refresh: metadata/discovery convergence + manifest field parity + Search writer cleanup + reader/Strangler successors, 2026-08-08 |
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
| `SEARCH-P3-02` | One truthful continuation contract across Pagefind, manifest fallback and exact Scripture occurrences: visible total/shown state + deterministic continuation, without reopening global shortcut ownership or leaving a self-writing merge transport. | Product `#1209` remains owner. Latest observed head is `c8caefeeba8fef9c1a3cf8973203632f0a12af5a`, `behind=2` from current main; PR body still names historical `882d904...` / `1f14761...`. Net diff remains **84 files** and still contains `.github/workflows/search-stale-interaction-finalizer.yml` + `scripts/search-stale-interaction-finalizer.mjs`. Earlier exact head `ee7f1e0b...` is proven RED: Shared Files `31247573559` and writer `31247573542` rejected repo-wide staging / unauthorized `cache-bust --write`, preventing self-clean. New commits narrowed the temporary writer to a semantic two-file repair and separated asset projection; latest `c8caefe...` writer/CI are queued or pending, so the historical red must not be mislabeled as latest-head conclusion. Hard merge barrier remains structural: no temporary writer/applicator may survive in final net diff, current main must be contained, PR record must name actual final SHA/scope, and final exact-head Shared/Search/runtime/deploy gates must be terminal green. [`REPORT`](../verification/2026-08-08-post-s12-manifest-parity-search-writer/REPORT.md) |
| `AR-IDX-05` | Replace generic runtime `SITE_CONFIG.version` with explicit per-asset revision authority for runtime-loaded CSS, then retire the misleading generic bridge when unused. | `enhancements-runtime.css` / `highlights-runtime.css` have canonical hashes, while loaders still version via generic `SITE_CONFIG.version` seeded from unrelated glossary identity. |
| `AUDIT-JS-ESCAPER-DUP-X5` | Add one appropriate shared HTML-escaping primitive and migrate the five current local escapers while preserving loader availability and output/context semantics. | Five separate equivalent escapers remain across `js/site.js`, `js/highlights.js`, `js/search.js`; no canonical `site-utils` equivalent yet. |

---

## SYSTEM VERIFICATION LANES — 5

| ID | Verified work package | Current boundary / owner |
|---|---|---|
| `SYS-CURRENT-GOLD-READINESS` | Derived publication-readiness evidence on top of existing route/publication authorities, including human reachability, metadata approval, research/content holds, visual evidence and production witness. | First implementation `#1220` is **merged**. Its earlier regex/hidden-ancestor reachability false-green was repaired with Chromium + JS-off, ancestor/CSS/geometry/nofollow checks and adversarial fixtures. Keep the system root only for subsequent readiness convergence that is independently evidenced; issue `#298` remains visual-golden authority. |
| `SYS-READER-CONTROL-SEMANTICS` | Unify truthful control→surface/action semantics across standalone and shared series reader engines without merging layouts into one mega-component. | Product issue `#1224` is current authority. Predecessors `#1227` and `#1233` are superseded merge vehicles. Clean bounded successors remain `#1246@3cd81b29...` for relation-state synchronization and `#1240@f91507fb...` for shared Gill mobile Back via `config.railBackHref`, each exactly two intended files; both are now `behind=2` from `main@11999f6d...` and need current-main refresh + fresh exact-head CI. Neither closes invalid list children, conditional quiz-panel orphan, footnotes, small-target/click/runtime findings or the whole root. `#1212` remains the audit-only all-reading-route barrier; its 887 manifestations are evidence to decompose by root, not 887 MASTER rows. [`REPORT`](../verification/2026-08-08-post-s12-manifest-parity-search-writer/REPORT.md) |
| `SYS-BAPTISTY-PUBLICATION-READINESS` | Series-level readiness program for the ten Baptist routes after independently actionable defects are handled: Research closure, source confidence, media provenance, roadmap realization, diagrams where useful, modern-stat discipline and map/data/live convergence. | Decompose into bounded article/data/media/map lanes; no mega-PR. Current roadmap/media/visual-atlas/Research evidence remains in Current-Gold report. |
| `SYS-KARTY-HOLDING-PUBLICATION-READINESS` | Publication-readiness transaction for held map routes: viewport, collisions, responsive layout, controls, route readability, visual quality and route/schema readiness before activation. | Verify candidate browser/screenshots + `maps:validate`/route ownership immediately before activation. Promote only independently actionable blockers. |
| `SYS-STRANGLER-RETIREMENT` | Safely retire/quarantine legacy reference storage only after logical identity, dependency ownership, inventory/integrity/parity and post-move verification are all fail-closed. | Product `#1222` remains Wave-A owner. It has already absorbed current `main@11999f6d...` by normal merge commit; latest observed head `22983986fadc50f22fb831a2b956915576448aad` is `behind=0` with exactly the same five intended Strangler files. Earlier `/index.html` normalization and dependency-registration defects remain repaired; old S12 reds are obsolete. A fresh exact-head suite was queued on `22983986...` (Source Authority, Shared Files, Route Registry, Visual, Deploy, Metadata, Search Modal) and is the only merge authority. Preserve the verified 21-blocker readiness result and do not resurrect prior blockers without fresh current-head regression evidence. [`REPORT`](../verification/2026-08-08-post-s12-manifest-parity-search-writer/REPORT.md) |

---

## OWNER DECISIONS — 3

| ID | Missing decision / evidence |
|---|---|
| `SEARCH-P2-07` | Exact licensed/provenanced Bible corpus acquisition/import/publication boundary **and policy reconciliation** (Product Charter Synodal default vs Content Quality NT Cassian / OT Synodal). Current Research remains fail-closed; no permission-unproven corpus expansion. |
| `REG-001` | Hosting/proxy decision for response-level CSP / X-Frame / Referrer / Permissions headers, or explicit accepted-risk disposition. |
| `NG-VIS-04` | Author/editor decision whether dense Nagornaya table/card material should be rewritten into more prose/air. |

---

## IN FLIGHT — collision / merge barriers

- `#1209` owns Search continuation at observed head `c8caefe...`, `behind=2`. Latest transport-policy attempt is pending, not yet proven red or green; **both temporary writer files still survive in the current 84-file net diff**, and PR body is stale. Historical exact-head writer-policy failures remain forensic evidence. No merge until transport is completely absent, current main is contained, final diff is bounded, PR record is refreshed and exact-head CI is terminal green.
- `#1221` owns catalog projection at observed head `0c779df...`, `behind=2`. Thumbnail rendering/guard is repaired; blocker is systemic existing-row manifest reconciliation (**67/73 divergent rows**) at the existing canonical normalizer layer, plus Spravochnik source metadata, stale `/articles/` route profile and final exact-head green.
- `#1222` owns Strangler storage abstraction Wave A at observed head `22983986...`; it contains current main (`behind=0`) and still changes exactly five intended files. Fresh current-head CI is queued and is the only merge authority.
- `#1224` remains SYSTEM authority for reader-control semantics. `#1246` is only the relation-synchronization successor; `#1240` is only the shared Gill Back-authority successor. Both remain two-file scopes but are `behind=2` from current main and must refresh/rerun; neither closes the system root alone.
- `#1212` remains audit-only all-reading-route control census. Its 887 manifestations are evidence, not Product repair, and must not be weakened merely to obtain green. A branch named `agent/system-article-control-census-20260808-r2` exists but no separate open successor PR was verified at this refresh.
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
