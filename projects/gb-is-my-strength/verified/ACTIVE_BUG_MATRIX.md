# Active Bug Matrix — gb-is-my-strength

**Wave date:** 2026-08-07  
**Product verification anchor:** `87d1a3c26c61e474603b1c68b551fde9163f744a`  
**Historical input:** `MASTER_BUG_MATRIX.md` — 145 rows labelled open before this wave.

This is the current working matrix. `MASTER_BUG_MATRIX.md` remains an immutable-friendly historical registry and evidence index; its old 69/26/40 + refactoring/AuditRepo counters are no longer the current work counter.

## Current arithmetic

The 145 historical open rows are accounted for exactly once:

| Disposition | Count | Meaning |
|---|---:|---|
| current-confirmed local defects | **9** | direct current-source or current merged evidence supports the residual now |
| partial / narrowed current residuals | **6** | old composite wording is partly stale; only the stated residual remains eligible for repair |
| systemic / selected-current-check queue | **88** | evidence-rich at historical anchors, but not individually repair-ready on current Product; verify the cluster before Product mutation |
| owner decisions | **4** | technology alone cannot close the decision |
| parked improvements | **14** | useful optimization/refactoring/polish, not a current user bug obligation |
| retired from active backlog | **24** | fixed, absorbed, stale, duplicate, invalid-as-bug, suspected-only, inert or not worth carrying as an active defect |
| **Total historical open rows accounted** | **145** | exact |

The useful current local repair backlog is therefore **15 = 9 confirmed + 6 narrowed**, not “145 current bugs”. The 88-row verification queue is evidence to process by system/route family, not authorization for 88 independent patches.

---

## 1. Current-confirmed local defects — 9

These were checked against current Product or current merged evidence during this wave.

| ID | Current disposition | Current evidence / repair boundary |
|---|---|---|
| `S-SEC-01` | `current-local / SYSTEM` | Current `js/enhancements.js` still converts authored HTML through a fixed tag blacklist and attribute stripping before reserializing HTML. Keep as a real sanitizer-design security finding; replace only in an owner-scoped shared-runtime lane with adversarial fixtures. |
| `MAP-P1-11` | `current-local / SYSTEM` | Current `karty/_engine/map-engine.js` still derives scale-bar pixels from `cfg.W0 / view.w`, not the actual rendered canvas width. |
| `MINI-P1-01` | `current-local / SYSTEM` | Current minimap is still a plain rectangle + dots + viewport box without geography, and still wraps/reassigns `flyTo` to update itself. |
| `SIG-P1-01` | `current-local / SYSTEM` | Current signature renderer still uses fixed map-unit offsets such as `origin.x - 74` for `water-split`. |
| `ENGINE-P2-04` | `current-local / SYSTEM` | Current story/toast surfaces are created without a proven `role=status` / live-region owner. Preserve as a bounded accessibility residual. |
| `AR-IDX-09` | `current-local / SYSTEM` | Current Search lazy/global shortcut accepts meta/ctrl + K without excluding `altKey`/`shiftKey`; modified shortcuts can still trigger it. |
| `SEARCH-P3-02` | `current-local / SYSTEM` | Current Search still limits Pagefind output to 10 and fallback output to 12 with no raw-total disclosure / “show more” contract. |
| `SEARCH-P3-03` | `current-local / SYSTEM` | Current copy-preview behavior still constructs canonical `https://gospod-bog.ru` links behind a generic “Скопировать ссылку” label. Decide/implement one truthful behavior. |
| `AR-IDX-05` | `current-local / SYSTEM` | Current Home chrome still contains hard-coded `SITE_CONFIG.version` plus explicit `?v=` asset revisions. Treat as cache/version ownership debt, not a route-content fix. |

### Collision note

Do not start a Product repair merely from this table. Re-read current Product PRs first. At this wave anchor, reader tooltip/layout, release control-plane and legacy-shadow/ledger lanes are already active and remain separate owners.

---

## 2. Partial / narrowed current residuals — 6

| ID | Current residual |
|---|---|
| `MAP-P1-13` | The old “113/113 markers lack role/tabindex/labels; panel lacks dialog/hidden semantics” wording is obsolete: current interactive markers receive `role=button`, `tabindex=0`, labels, and panel/tab ownership is substantially stronger. Only reduced-motion / remaining interaction semantics require a new bounded current check before any repair. |
| `MAP-P1-20` | Prior reverify already removed the false `route.json` SW-cache half. Residual is the unversioned shared `map-engine.js` static asset / cache-bust ownership. |
| `QUAL-P1-09` | Prior reverify narrowed this to holding/noindex route-profile publication status semantics. Re-check current profiles/validators as one publication-owner transaction. |
| `D-1` | Historical concurrency bug was partly repaired and downgraded; only cross-workflow deploy/IndexNow race semantics remain. This overlaps release/control-plane ownership and is not a free-standing local patch. |
| `D-19` | Rimlyanam half was fixed; only the Antisovetov custom PageHead/title/OG/Twitter/JSON-LD residual may remain. Verify that exact route owner before editing. |
| `NEW-OG-SIZE-PARAM` | Single hardcoded OG dimension is already gone; only global-vs-route-specific approved social-image profile ownership remains. |

---

## 3. Systemic / selected-current-check queue — 88

These rows remain useful evidence, but the July wording is **not current repair authority**. A selected wave must first prove the applicable current mechanism and then close/absorb/repair the whole class proportionately.

### ST-KARTY-RUNTIME-GEOMETRY — 32 historical symptoms

Current Product has materially changed MapEngine since the original audit (authored path rendering, archaeology projection ownership, geometry validators, story-ID/schema work, route-inventory ownership, Hebrew semantics). These IDs must not be patched one-by-one from old line numbers:

`MAP-P1-01`, `MAP-P1-02`, `MAP-P1-04`, `MAP-P1-05`, `MAP-P1-07`, `MAP-P1-08`, `MAP-P1-10`, `MAP-P1-12`, `AVRAAM-P1-01`, `AVRAAM-P1-02`, `AVRAAM-P1-03`, `AVRAAM-P1-05`, `ASTRO-P1-01`, `MAP-P1-18`, `MAP-P1-19`, `DATA-P1-04`, `ENGINE-P1-26`, `ENGINE-P1-27`, `ENGINE-P1-29`, `QUAL-P1-01`, `QUAL-P1-05`, `QUAL-P1-06`, `DRAW-P1-01`, `TEXT-P1-01`, `WAYP-P1-01`, `PERF-P1-01`, `UI-P1-01`, `LOD-P1-01`, `AVRAAM-P2-01`, `MAP-P2-02`, `ENGINE-P2-03`, `QUAL-P2-04`.

**Next action:** one browser+source verification wave over representative live/holding maps. Produce current local residuals and one class-level regression plan; do not create 32 PRs.

### ST-KARTY-DATA-PROJECTION — 18 historical symptoms

`MAP-P1-03`, `KARTY-DATA-P1-01`, `ASTRO-P1-05`, `GATE-P1-03`, `DATA-P1-03`, `RIVER-P1-01`, `RIVER-P1-02`, `RIVER-P1-03`, `RIVER-P1-04`, `BASE-P1-01`, `BASE-P1-02`, `BASE-P1-03`, `SVG-P1-01`, `REG-P1-01`, `ROUTE-P1-01`, `BASE-P2-01`, `DATA-P2-01`, `QUAL-P2-02`.

**Next action:** verify current route/schema/base-geo owners and generated/artifact behavior together. Historical source-only claims about the old engine are not enough to mutate current `karty/_engine/**`.

### ST-KARTY-VISUAL-LANGUAGE — 12 historical symptoms

`QUAL-P1-03`, `DRAW-P1-03`, `QUAL-P1-08`, `ARCH-P1-01`, `RELIEF-P1-01`, `GLYPH-P1-01`, `GRAT-P1-01`, `SEA-P1-01`, `ORN-P1-01`, `HALO-P1-01`, `MEDIA-P1-01`, `HUB-P2-01`.

**Next action:** treat as one owner-selected visual/data-quality program. Many statements are quality targets rather than correctness failures; direct owner review and current screenshots are required before retaining P1 semantics.

### ST-AUDIT-CONTROL-PLANE — 7 historical symptoms

`CI-WORKFLOW-PROLIFERATION`, `S-T-01`, `AUDIT-P2-WORKFLOWS-CHECK-GAP`, `D-2`, `GATE-MARKER-DATA-DRIFT`, `BUG-011`, `NF-GATE-IZ5-STALE`.

**Next action:** selected control-plane audit only after current release/reader workflow PRs settle. Classify false-green/false-red mechanisms, not workflow/file counts.

### ST-SEO-RELEASE-SURFACES — 3 historical symptoms

`BUG-SEO-001`, `NEW-CANONICAL-IZBRANNOE-01-GAP`, `AR-IDX-10`.

**Next action:** current route/live/tooling check. Do not mix with the active release-control-plane lane.

### ST-NAGORNAYA-MIGRATION — 9 historical symptoms

`NG-DEAD-01`, `NG-SEO-01`, `NG-TOC-01`, `NG-CROSS-01`, `NG-SERIYA-01`, `NG-A11Y-01`, `NG-VIS-10`, `NG-STRUCT-01`, `NG-INLINE-01`.

**Next action:** one bounded Nagornaya source/build/browser verification wave. Separate dead-code/structure/SEO from owner-sensitive content/visual changes before repair.

### ST-SHARED-CSS-RUNTIME-HYGIENE — 6 historical symptoms

`AUDIT-CSS-DEAD-KEYFRAMES-TOKENS`, `AUDIT-CSS-GBFLOATER-DUP-MEDIA`, `AUDIT-JS-ESCAPER-DUP-X5`, `D-4`, `NF-DEAD-ENHANCE-SHIM`, `AR-IDX-A11Y-01`.

**Next action:** current AST/source verification after active reader UI lanes. Dead/duplicate code can be removed only when current consumers and owner-sensitive floating controls are proven unaffected.

### ST-STRANGLER — 1 system lane

`R-007` is retained as the system program, not a local “bug”. The duplicate symptom rows are retired below. Current Product PR #1090 already owns legacy-reference inventory/identity work; do not create a competing lane.

---

## 4. Owner decisions — 4

| ID | Why it is not an ordinary repair |
|---|---|
| `SEARCH-P2-07` | Bible corpus is a rights/provenance/import decision. CrossWire `RusSynodal` 1.9.1 is only a candidate until exact archive acquisition/hash/mapping/import evidence exists; blocked alternatives remain blocked. |
| `GENESIS6-ACTIVATION-OWNER-GAP` | Publication/activation requires an owner-selected Product finalizer with rights/source/publication evidence, not a technical cleanup. |
| `REG-001` | Response-level security headers on GitHub Pages require a hosting/proxy decision or explicit accepted-risk disposition. |
| `NG-VIS-04` | Editorial “air” / table-density change is explicitly author-sensitive content work. |

---

## 5. Parked improvements — 14

These remain discoverable but are not counted as current defects without measured/current evidence:

`AR-IDX-PERF-01`, `AR-IDX-PERF-02`, `AR-IDX-JS-01`, `NEW-CSS-BUDGET-01`, `AUDIT-P3-OG-LCP-MISMATCH`, `D-3`, `AR-IDX-07`, `AR-IDX-08`, `AR-IDX-CSS-03`, `R-001`, `R-002`, `R-003`, `R-004`, `R-005`.

Notes:

- `R-005` remains a valid measured Baptists 3D improvement candidate, but not a blocking bug or global bundle gate.
- `NEW-CSS-BUDGET-01` / `D-3` are warning/measurement signals, not deployment failures.
- old Home performance/cleanup claims require current measurement rather than July heuristics.

---

## 6. Retired from active backlog — 24

These IDs remain preserved in `MASTER_BUG_MATRIX.md` and evidence, but no longer belong in the active work count.

| ID | Disposition |
|---|---|
| `MAP-P1-06` | `fixed/absorbed` — current archaeology projection is tab-owned rather than rendered indiscriminately under all tabs. |
| `MAP-P1-09` | `fixed-current` — current `setStory()` preserves map-first state and does not auto-open the first place panel. |
| `BUG-PERF-001` | `invalid-as-P1 / retired heuristic` — add/remove listener count inequality alone does not prove a leak; current owners use lifecycle cleanup infrastructure. Open a new finding only with a concrete retained-listener/browser witness. |
| `GENEALOGY-ATLAS-V1-SHIPPED-NOT-PROD` | `stale formulation` — it was explicitly tied to an obsolete `PROD-STALE-DEPLOY-RED` delivery state. Any present atlas-publication gap needs a fresh exact-current witness. |
| `CI-WEBKIT-TOC-NONDETERMINISTIC` | `closed-by-fix` — Product `a130ca01` added bounded WebKit ToC activation replay/fallback and cleanup for the diagnosed readiness race. |
| `ATLAS-D-NAMESPACE-COLLISION` | `stale archival coordination` — the reused D-16…D-19 labels live in historical `working/atlas/DEBT-REGISTER.md` and were closed there; they do not own current Product automation. Preserve history, do not rewrite it. |
| `AR-IDX-JS-02` | `fixed-current` — current `site.js` defines and uses `themeKey: "theme"`; the old `"undefined"` localStorage-key claim is false on current source. |
| `AR-IDX-03` | `absorbed-by-fix` — Search PR #1079 established platform-aware `Ctrl+K` / `⌘+K` labels through the global owner. |
| `HOME-P3-FOOTER-EDGE-CONSOLE` | `closed-by-fix` — Search PR #1079 also restored a real mobile footer safe inset without weakening the browser assertion. |
| `SEARCH-P3-01` | `closed-by-fix` — PR #1079; no independent residual remains. |
| `NEW-72` | `not-worth-fixing as bug` — ~1.9 KB SVG dedup is a micro-optimization, not a verified user defect. |
| `STRANGLER-HYGIENE` | `duplicate-symptom` — old `50/53` count was already invalidated by the exact inventory wave; ownership now belongs to `ST-STRANGLER` / `R-007`. |
| `D-7` | `not-worth-fixing` — the referenced path is a harmless repository-relative documentation locator, not a secret/runtime defect. |
| `NF-STRANGLER-BAR-DRIFT` | `duplicate-symptom` — historical shadow drift belongs to `ST-STRANGLER`, not an independent Product repair. |
| `NEW-HARDTEXTS-CSP-MISSING-HFCDN` | `retired/inert` — historical row itself records no Listen capability on this route; do not keep an inert consistency difference as a bug. Reopen only if capability/current network evidence makes it relevant. |
| `NEW-HIGHLIGHTS-NO-REINIT-GUARD` | `demoted from verified backlog` — historical row is explicitly “suspected”; no direct duplicate-init witness was supplied. New evidence may reopen a bounded finding. |
| `NEW-SAVE-QUOTE-TIMER-RACE` | `demoted from verified backlog` — historical row is explicitly “suspected”; requires a real ordering failure witness. |
| `AR-IDX-04` | `stale structure` — current Home navigation no longer has the historical favorite-link/class shape. Discoverability, if desired, is a new UX decision rather than class parity. |
| `AR-IDX-06` | `fixed/stale` — current Home reading-progress hook is intentionally hidden/non-visual and `features.readingProgress.enabled` is true; the visible progress owner is the scroll-top ring. |
| `AR-IDX-CSS-02` | `absorbed/stale` — current Home has an explicit `h-ambient-native` viewport-rail owner and breakpoint exclusions; the original clipped legacy object/formulation no longer matches current source. |
| `R-006` | `absorbed-by-system-fix` — current TTS heavy work remains lazy and Worker-owned; unrelated representative surfaces do not mount the reader runtime. |
| `AR-001` | `closed-by-fix` — AuditRepo validator/scaffold hardening landed. |
| `AR-004` | `absorbed-by-system-fix` — proportional verification waves replaced the old single protocol-automation obligation. |
| `AR-005` | `stale/retired obligation` — blanket reverify automation is intentionally not part of operating model v2. |

---

## Branch forensic disposition

Live AuditRepo refs at this wave were exactly:

1. `main`;
2. `archive/legacy-diverged-heads-20260801`;
3. `archive/forensic-pr-3-vosk-tts-report-2026-07-24`.

The earlier reviewed ref-retirement machinery already removed stale working refs. Both remaining non-main refs are deliberate archives with unique forensic/history value. They are **retained**, not merged blindly and not deleted:

- `archive/forensic-pr-3-vosk-tts-report-2026-07-24` preserves the exact historical report/head required by the closed-unmerged PR #3 forensic disposition;
- `archive/legacy-diverged-heads-20260801` preserves the reviewed historical divergence package.

Deleting either only to make the branch count equal one would violate evidence retention and the user instruction not to remove anything important.

---

## Repair order after this wave

1. Finish/land existing Product owners before overlapping them: tooltip/reader layout, release control plane, legacy shadow identity/inventory.
2. Safe independent current lane candidate: Search residuals (`AR-IDX-09`, `SEARCH-P3-02`, `SEARCH-P3-03`) through the existing global Search owner.
3. Separate security SYSTEM lane: `S-SEC-01` sanitizer replacement with adversarial fixtures.
4. Current-check waves, not blind repairs: Nagornaya cluster; Karty runtime/data/visual clusters.
5. `AR-IDX-05` / cache revision ownership only after checking overlap with the active legacy-ledger lane.
6. Owner decisions remain decisions until the owner supplies/chooses the missing publication, rights or hosting boundary.

## Rule

No ID from the 88-row verification queue may be repaired from this file alone. First obtain a current applicable witness, then move it to current-local/partial, close it as stale/duplicate/invalid, or absorb it into a system fix.