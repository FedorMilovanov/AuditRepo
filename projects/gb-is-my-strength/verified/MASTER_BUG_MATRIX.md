# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT текущей верифицированной нужной работы `gospod-bog.ru`.** Решённое / stale / duplicate / absorbed / invalid / superseded удаляется из MASTER в той же wave; подробная история остаётся в `verification/` и `legacy/`.

Current live refresh after Current-Gold merge: [`../verification/2026-08-08-post-current-gold-live-refresh/REPORT.md`](../verification/2026-08-08-post-current-gold-live-refresh/REPORT.md).  
Current reader-control semantics evidence: [`../verification/2026-08-08-reader-control-semantics-current-root/REPORT.md`](../verification/2026-08-08-reader-control-semantics-current-root/REPORT.md).  
Current Strangler/security recheck: [`../verification/2026-08-08-strangler-red-ci-and-npm-security-inventory/REPORT.md`](../verification/2026-08-08-strangler-red-ci-and-npm-security-inventory/REPORT.md).  
Current discovery/S12/catalog/Search recheck: [`../verification/2026-08-08-discovery-s12-catalog-search-head-recheck/REPORT.md`](../verification/2026-08-08-discovery-s12-catalog-search-head-recheck/REPORT.md).  
Current deep-audit evidence: [`../verification/2026-08-08-total-current-gold-audit/REPORT.md`](../verification/2026-08-08-total-current-gold-audit/REPORT.md).  
Home/control-plane recheck: [`../verification/2026-08-08-home-main-ci-control-plane-recheck/REPORT.md`](../verification/2026-08-08-home-main-ci-control-plane-recheck/REPORT.md).

## Current state

| Поле | Значение |
|---|---|
| Product verification anchor | `1f14761a7c920e1d224e77d3ccfec8638a1d426c` |
| Wave | post-Current-Gold live refresh: S12 source/discovery + catalog projection + reader controls + Strangler exact-red, 2026-08-08 |
| Active work units | **13** |
| Direct current defects | **2** |
| Verified necessary improvements | **3** |
| System verification lanes | **5** |
| Owner decisions | **3** |
| Closed/stale/duplicate rows retained in MASTER | **0** |

Product `#1220` is merged as current Product anchor `1f14761a...`; it is no longer an active PR owner. Its first Current-Gold implementation slice landed after the prior browser-reachability false-green was repaired. The broader readiness root remains only for subsequent convergence/evidence, not because `#1220` itself is still pending.

Fresh exact npm inventory remains non-actionable as a public-runtime defect: 8 vulnerabilities exist only in the transitive dev/build graph and `npm audit --omit=dev` reports **0**. Disposable diagnostic `#1223` is closed unmerged and is not an active owner.

Home bytes remain without a new direct regression witness in this wave; temporary `astro.config.dev.mjs` remains absent. Directions/Ambient presentation-owner convergence stays in `WORK_QUEUE.md` until a concrete promotion trigger exists.

---

## CURRENT DEFECTS — 2

| ID | Required repair | Current evidence / boundary |
|---|---|---|
| `BAPT-S12-01` | Remove remaining reader-facing Baptist backstage/research scaffolding at the **real source authority**, then deterministically converge public metadata/discovery projections; keep S12 fail-closed without confusing reference twins with live bodies. | Fresh current-main-derived Source Authority evidence broadens the old metadata-only residual. `/baptisty-rossii/sovetskaya-noch/` actually imports `BaptistyRossiiSovetskayaNochBody.astro`, which still publishes `ВСЕХБ 1989 ... OCR и ссылки зафиксированы в research.` — a real current public-body S12 leak. The route’s `sovetskaya-noch.mdx` and `podpolnaya-pechat.mdx` are explicitly `mdxStatus: reference-only`; they still trip source hygiene but are not the rendered bodies and must not be misreported as live-route content. Separately, current `BaptistyRossiiSpravochnikPageHead.astro` still exposes `research-досье и очередь правок 3D-карты` in description/Twitter/OG/Article JSON-LD, and current `data/search-manifest.json` repeats it; manifest dates also disagree with PageHead JSON-LD dates. Closed `#1228` proved a direct manifest edit is the wrong mutation layer because deterministic RSS/Search policy turns red. Closure: repair actual Body/PageHead authority, define deterministic existing-row discovery-field convergence, regenerate dependent Search/RSS projections, keep adversarial S12 fixtures, and reverify final Product SHA. [`REPORT`](../verification/2026-08-08-post-current-gold-live-refresh/REPORT.md) |
| `CATALOG-PROJECTION-01` | Replace the hand-authored `/articles/` publication owner with a truthful derived projection while preserving media, architecture metadata and clean source-derived discovery semantics. | Product `#1221` remains owner; actual head observed `0c779df113b5716a200bda023d356ef33cdade22`. The earlier text-only-card regression is repaired: the candidate now projects `item.image` and its guard requires repository-local media plus built thumbnail coverage. Exact Source Authority now usefully fails on **upstream projection drift**: `/hard-texts/` and `/karty/avraam/` already publish real PageHead OG images, but their existing manifest rows lack images. Root: `search-manifest-policy-normalizer.js` derives full metadata only for URLs missing from manifest and leaves existing rows verbatim, so title/description/image/date can drift indefinitely. Same candidate also leaves `data/route-profiles/articles.json` naming deleted `ArticlesPublicationsSection` in nested anatomy/styleContract fields that current strict profile tooling does not validate. Do not weaken the media guard or hand-patch projection rows; converge the existing-row authority policy, update the route profile to `ArticlesLibrarySection`, clean Spravochnik upstream metadata, regenerate dependent projections, then require exact-head green. Audit handoff posted to `#1221` (`5225133030`). [`REPORT`](../verification/2026-08-08-post-current-gold-live-refresh/REPORT.md) |

---

## VERIFIED NECESSARY IMPROVEMENTS — 3

| ID | Needed implementation | Current boundary |
|---|---|---|
| `SEARCH-P3-02` | One truthful continuation contract across Pagefind, manifest fallback and exact Scripture occurrences: visible total/shown state + deterministic continuation, without reopening global shortcut ownership. | Product `#1209` remains owner, but current Product `main` has advanced beyond the PR body’s old exact-main/ancestry claims. Refresh onto `1f14761a...`, use actual GitHub head rather than stale body text, require terminal exact-head CI, and coordinate its Spravochnik PageHead touch with `BAPT-S12-01` rather than opening a competing source edit. |
| `AR-IDX-05` | Replace generic runtime `SITE_CONFIG.version` with explicit per-asset revision authority for runtime-loaded CSS, then retire the misleading generic bridge when unused. | `enhancements-runtime.css` / `highlights-runtime.css` have canonical hashes, while loaders still version via generic `SITE_CONFIG.version` seeded from unrelated glossary identity. |
| `AUDIT-JS-ESCAPER-DUP-X5` | Add one appropriate shared HTML-escaping primitive and migrate the five current local escapers while preserving loader availability and output/context semantics. | Five separate equivalent escapers remain across `js/site.js`, `js/highlights.js`, `js/search.js`; no canonical `site-utils` equivalent yet. |

---

## SYSTEM VERIFICATION LANES — 5

| ID | Verified work package | Current boundary / owner |
|---|---|---|
| `SYS-CURRENT-GOLD-READINESS` | Derived publication-readiness evidence on top of existing route/publication authorities, including human reachability, metadata approval, research/content holds, visual evidence and production witness. | First implementation `#1220` is **merged** as Product `1f14761a...`; remove all active-owner assumptions tied to that PR. Its earlier regex/hidden-ancestor reachability false-green was repaired with Chromium + JS-off, ancestor/CSS/geometry/nofollow checks and adversarial fixtures. Keep the system root only for subsequent readiness convergence that is independently evidenced; issue `#298` remains visual-golden authority. |
| `SYS-READER-CONTROL-SEMANTICS` | Unify truthful control→surface/action semantics across standalone and shared series reader engines without merging layouts into one mega-component. | Product issue `#1224` is current authority. Independently confirmed manifestations remain: standalone hamburger labelled for site sections but wired to Search, invalid direct `span` children under standalone/series TOC `ul`, missing/unsynchronized control→surface relations, conditional Learning `aria-labelledby` orphan, and other issue-DoD items. Bounded owners must not overclaim root closure: `#1227` handles relation synchronization only and was observed behind current main; `#1233` handles shared mobile Back via `config.railBackHref` and was observed `behind=0`, but its lone Source Authority red is inherited `BAPT-S12-01`, not a Back regression. Do not absorb Baptist repair into `#1233`; rerun it after S12 lands. `#1212`/successor remains the audit-only all-reading-route browser barrier and must refresh stale ancestry before merge. [`REPORT`](../verification/2026-08-08-post-current-gold-live-refresh/REPORT.md) |
| `SYS-BAPTISTY-PUBLICATION-READINESS` | Series-level readiness program for the ten Baptist routes after independently actionable defects are handled: Research closure, source confidence, media provenance, roadmap realization, diagrams where useful, modern-stat discipline and map/data/live convergence. | Decompose into bounded article/data/media/map lanes; no mega-PR. Current roadmap/media/visual-atlas/Research evidence remains in Current-Gold report. |
| `SYS-KARTY-HOLDING-PUBLICATION-READINESS` | Publication-readiness transaction for held map routes: viewport, collisions, responsive layout, controls, route readability, visual quality and route/schema readiness before activation. | Verify candidate browser/screenshots + `maps:validate`/route ownership immediately before activation. Promote only independently actionable blockers. |
| `SYS-STRANGLER-RETIREMENT` | Safely retire/quarantine legacy reference storage only after logical identity, dependency ownership, inventory/integrity/parity and post-move verification are all fail-closed. | Product `#1222` remains Wave-A owner; actual head observed `20f99634918eee2a340b6a5ef2c90fae80c97d1d`. Exact authority/path CI is **RED** across Shared Files, Route Registry, Source Authority and Metadata while visual/native/deploy checks can remain green. Current Home profile validly stores `legacyPath: "/index.html"`; new `normalizeRepositoryPath()` rejects POSIX absolute-looking values, so cache-bust/profile/provenance fail on the established root logical identity. Repair compatibility at the normalization boundary (canonicalize leading `/`, add root fixture) before treating blocker-count reduction as evidence. `legacy-shadow-retirement-readiness.mjs` also remains physical-path-bound and is not yet a post-move verifier. Fresh handoff comment on exact head: `5225114942`. [`REPORT`](../verification/2026-08-08-post-current-gold-live-refresh/REPORT.md) |

---

## OWNER DECISIONS — 3

| ID | Missing decision / evidence |
|---|---|
| `SEARCH-P2-07` | Exact licensed/provenanced Bible corpus acquisition/import/publication boundary **and policy reconciliation** (Product Charter Synodal default vs Content Quality NT Cassian / OT Synodal). Current Research remains fail-closed; no permission-unproven corpus expansion. |
| `REG-001` | Hosting/proxy decision for response-level CSP / X-Frame / Referrer / Permissions headers, or explicit accepted-risk disposition. |
| `NG-VIS-04` | Author/editor decision whether dense Nagornaya table/card material should be rewritten into more prose/air. |

---

## IN FLIGHT — collision / merge barriers

- `#1209` owns Search continuation and touches Spravochnik PageHead for cache projection. Its exact-main/body claims are stale relative to Product `1f14761a...`; refresh ancestry and coordinate final S12 source metadata repair there.
- `#1221` owns catalog projection at observed head `0c779df...`. Thumbnail rendering/guard is repaired; current blockers are truthful existing-row discovery convergence, two upstream missing manifest image projections, stale `/articles/` route-profile component declarations, Spravochnik source metadata and final exact-head green.
- `#1222` owns Strangler storage abstraction Wave A at observed head `20f9963...`; exact authority/path CI is red on `/index.html` compatibility and readiness is not yet post-move-safe.
- `#1224` is the SYSTEM authority for reader-control semantics. `#1227` is only the relation-synchronization slice; `#1233` is only the Back-authority slice. Neither merge closes the root alone.
- `#1233` Back slice was observed current-main-clean in ancestry (`behind=0`) and its own semantic change is bounded, but inherited current S12 makes Source Authority red. Keep the PR scoped; unblock by fixing Product S12 elsewhere, then rerun exact head. Audit comment `5225133791`.
- `#1212` remains audit-only all-reading-route control census. It is behind current Product and must refresh ancestry; findings are evidence, not Product repair, and must not be weakened merely to obtain green.
- `#1220` is **merged** into current Product and is no longer active.
- `#1228` is **closed unmerged** as wrong mutation layer; it is no longer active.
- `#1223` is **closed unmerged** `DIAGNOSTIC_DISPOSABLE`; no temporary workflow may enter Product. Production-only npm vulnerability count remains zero.
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
