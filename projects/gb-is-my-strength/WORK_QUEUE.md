# Optional Work Queue — gb-is-my-strength

This file is for **optional improvements, measurement-first work and reverify-before-promotion candidates**, not confirmed current bugs. `verified/MASTER_BUG_MATRIX.md` is the only active problem matrix.

Before starting any lane, inspect current Product `main`, open PRs/branches and the selected owner. Historical wording alone never authorizes Product mutation.

## Selected evidence-backed candidates

### Karty runtime performance measurements

- Historical `PERF-P1-01`: Avraam `base.svg` used an indefinite animated `feTurbulence` / displacement-water effect, but the old “15–20 fps while dragging” observation is not a current browser witness. Measure current Chromium/WebKit frame/input behavior before changing it.
- Historical `QUAL-P2-04`: MapEngine rebuild behavior does not by itself prove material GC/jank. Measure long tasks/input/frame impact first.
- Do not confuse this with current `SYS-MAP-SCALE-RESIZE-WITNESS` / #1363, which is a confirmed **test-harness convergence defect**, not evidence that MapEngine runtime is slow or wrong.

### Home presentation-owner convergence

- Earlier audit found multiple presentation owners, but no current reader-visible regression was proved from ownership distribution alone.
- Keep parked until fresh browser regression, false-green contract, recurring collision or measured failure proves convergence necessary.
- Current mandatory Home harness work remains `SYS-HOME-DESIGN-SEARCH-SETTLED` / #1299 in MASTER.

### Baptists 3D measured split

- Historical origin: `R-005`.
- Last recorded `_app/index.html` size was 2,245,854 bytes.
- It is an explicit built app, not a removable Strangler duplicate.
- Start only with measured source/dependency boundaries.

### Runtime asset revision authority — reverify before promotion

- Historical `AR-IDX-05` observed runtime-loaded CSS using a generic `SITE_CONFIG.version` bridge while assets had their own revisions.
- This wave did not reverify the current cache/load graph and found no active owner.
- Promote only after a fresh stale-cache/version witness.

### Shared JS escaping primitive — reverify before promotion

- Historical `AUDIT-JS-ESCAPER-DUP-X5` observed local equivalent escaping helpers.
- Duplication alone is not a defect. Re-count current implementations and prove inconsistent semantics/security/maintenance failure before promotion.

### Bible corpus acquisition/import proof

- Current owner-decision row remains `SEARCH-P2-07` in MASTER.
- Binding Research decision is `d52ea9d54dd2c2488223d25f5f6cefd263c23328`.
- CrossWire `RusSynodal` 1.9.1 remains candidate-only pending archive SHA-256, licence/source/book manifest, 66-book mapping and verse-level import receipt.
- `RusSynodalLIO` and Cassian restrictions remain binding.

## Active work that must **not** be duplicated here

- `SYS-STRANGLER-RETIREMENT` remains active MASTER work, but visual-parity storage #1371 is **merged** and truthful readiness is now **11**. The last known mechanical reader is `gill-reading-time` inside #1348; the other known blockers are 3 obsolete legacy audits + 7 owner decisions. Do not resurrect #1090/#1367/#1370/#1371 as active owners.
- Lot publication/readiness is active MASTER work and includes the paged-media `.reveal` residual.
- Search new-row role authority #1313 is merged/retired. Current discovery/catalog implementation work is #1348; stale Lot Search/RSS/sitemap is replay work after #1339 refresh.
- Catalog projection, native quiz parity (#1369), reader semantics, footnote projection, Source Authority trigger closure, product visual goldens, Avraam retraction parity and current audit-harness roots are active MASTER work, not optional candidates.

## Parked non-defect improvement families

- Home/runtime performance: `AR-IDX-PERF-01`, `AR-IDX-PERF-02`, `AR-IDX-JS-01`.
- CSS/JS budget measurements: `NEW-CSS-BUDGET-01`, `D-3`, `AUDIT-P3-OG-LCP-MISMATCH`.
- Karty runtime measurement: `PERF-P1-01`, `QUAL-P2-04`.
- Karty dormant/optional UI: `MINI-P1-01`.
- Decorative/cartographic style ideas.
- Home polish/cleanup: `AR-IDX-07`, `AR-IDX-08`, `AR-IDX-CSS-03`.
- Generic refactor wishes: `R-001`, `R-002`, `R-003`, `R-004`.
- Measured built-app split: `R-005`.

## Queue hygiene

The queue may be empty. Do not copy old audit rows here merely to retain history; history already lives in verification/Git. Promote only a current formulation backed by fresh evidence.