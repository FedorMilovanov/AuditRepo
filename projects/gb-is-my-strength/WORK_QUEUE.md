# Optional Work Queue — gb-is-my-strength

This file is for **optional improvements, measurement-first work and reverify-before-promotion candidates**, not confirmed current bugs. `verified/MASTER_BUG_MATRIX.md` is the only active problem matrix.

Before starting any lane, inspect current Product `main`, open PRs/branches and the selected owner. Historical wording alone never authorizes a Product mutation.

## Selected evidence-backed candidates

### Karty runtime performance measurements

- Historical `PERF-P1-01`: Avraam `base.svg` has used an indefinite animated `feTurbulence` / displacement-water effect, but the old “15–20 fps while dragging” observation is not a current browser witness. Measure current Chromium/WebKit frame/input behavior before changing it.
- Historical `QUAL-P2-04`: MapEngine has rebuilt marker/path SVG structures in `renderMarkers()`, but source-level recreation does not prove material GC/jank. Measure long tasks/input/frame impact before refactoring rendering ownership.
- Do not confuse this optional performance work with current `SYS-MAP-SCALE-RESIZE-WITNESS`: Product #1363 is a confirmed **test-harness convergence defect**, not evidence that MapEngine runtime is slow or geometrically wrong.

### Home presentation-owner convergence

- Earlier audit found multiple cascade/presentation owners around Directions and Ambient surfaces, but no current reader-visible regression was proved from ownership distribution alone.
- Keep this parked until a fresh browser regression, false-green contract, recurring collision or measured maintenance/runtime failure proves convergence independently necessary.
- Current mandatory Home audit-harness work, if still applicable, is separately represented in MASTER as `SYS-HOME-DESIGN-SEARCH-SETTLED` / Product #1299.

### Baptists 3D measured split

- Historical origin: `R-005`.
- Last recorded `_app/index.html` size was 2,245,854 bytes.
- It is an explicit built app, **not** a removable strangler duplicate.
- Start only with real source/dependency boundaries and before/after measurement; valid outcomes include bounded extraction, park or accepted current cost.

### Runtime asset revision authority — reverify before promotion

- Historical `AR-IDX-05` previously observed runtime-loaded CSS versioning through a generic `SITE_CONFIG.version` bridge while individual runtime assets already had their own revision identities.
- This 2026-08-09 consolidation wave did **not** reverify the current loader/cache graph and found no active Product owner for it.
- Recheck current runtime-loaded asset URLs, service-worker/cache revision owners and failure behavior before deciding whether a current defect still exists. Promote only a fresh formulation with a concrete stale-cache/version witness.

### Shared JS escaping primitive — reverify before promotion

- Historical `AUDIT-JS-ESCAPER-DUP-X5` observed several local equivalent HTML escaping helpers across shared JS.
- Duplication alone is not a current defect. Before promotion, re-count current implementations and prove either inconsistent escaping semantics, a security/correctness divergence, or repeated maintenance failure that one shared primitive would actually close.
- If current implementations are safe and context-specific, retire the historical wish instead of refactoring for symmetry.

### Bible corpus acquisition/import proof

- Current owner-decision row remains `SEARCH-P2-07` in MASTER.
- Binding rights/provenance decision is Research merge `d52ea9d54dd2c2488223d25f5f6cefd263c23328`; later Research Heart work does not supersede that corpus decision.
- CrossWire `RusSynodal` 1.9.1 remains candidate-only until archive bytes, SHA-256, licence/source/book manifest, 66-book mapping and verse-level import receipt are proved.
- `RusSynodalLIO` and Cassian restrictions are not bypassable technical problems.

## Active work that must **not** be duplicated here

- `SYS-STRANGLER-RETIREMENT` is active MASTER work. Product #1364 is merged, truthful readiness is **12**, and current replay owner is **#1371** with expected **12 → 11**. #1367/#1370 are superseded history; do not resurrect historical #1090 or either replay as a second owner.
- Lot publication/readiness is active MASTER work and has its own current AuditRepo evidence package, including the paged-media `.reveal` residual.
- Search new-row role authority **#1313 is merged** and is no longer an active lane. Current discovery/catalog implementation work is #1348; stale Lot derived Search/RSS/sitemap is replay work after #1339 refresh.
- Catalog projection, native quiz parity (#1369), reader semantics, footnote projection, Source Authority trigger closure, product visual goldens, Avraam retraction parity and current audit-harness roots are all active MASTER work, not optional queue candidates.

## Parked non-defect improvement families

These remain historical performance/refactor/polish questions unless a current measurement or failure promotes them:

- Home/runtime performance: `AR-IDX-PERF-01`, `AR-IDX-PERF-02`, `AR-IDX-JS-01`.
- CSS/JS budget measurements: `NEW-CSS-BUDGET-01`, `D-3`, `AUDIT-P3-OG-LCP-MISMATCH`.
- Karty runtime measurement: `PERF-P1-01`, `QUAL-P2-04`.
- Karty dormant/optional UI: `MINI-P1-01`.
- Decorative/cartographic style ideas: glyph/ornament/halo/sea-pattern/sheet-engine suggestions.
- Home polish/cleanup: `AR-IDX-07`, `AR-IDX-08`, `AR-IDX-CSS-03`.
- Generic refactor wishes: `R-001`, `R-002`, `R-003`, `R-004`.
- Measured built-app split: `R-005`.

## Queue hygiene

The queue may be empty. Do not copy old audit rows here merely to retain history; history already lives in verification/Git. If a candidate becomes a verified current defect, move the **current formulation** into MASTER. If it is disproved, solved, superseded or not worth doing, remove it.