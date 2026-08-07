# Optional Work Queue — gb-is-my-strength

This file is for **optional improvements and measurement-first work**, not confirmed bugs. `verified/MASTER_BUG_MATRIX.md` remains the only active problem matrix.

Before starting any lane, re-read current Product owners/open PRs and verify the selected surface.

## Selected evidence-backed candidates

### Karty runtime performance measurements

- Historical `PERF-P1-01`: current Avraam `base.svg` still contains an indefinite 14-second animated `feTurbulence` / displacement-water effect, but the old “15–20 fps while dragging” number is not a current browser witness. Measure current Chromium/WebKit frame/input behavior before changing the effect. Promote only if current impact is material.
- Historical `QUAL-P2-04`: current MapEngine still rebuilds marker/path SVG structures in `renderMarkers()`, but source-level node recreation alone does not prove material GC/jank on the two public strict-native maps. Measure long-task/input/frame impact before refactoring rendering ownership.
- Do not keep a `SYS-KARTY-RUNTIME-GEOMETRY` lane alive solely for these two measurement questions.

### Baptists 3D measured split

- Historical origin: `R-005`.
- Last verified size at the recorded anchor: `_app/index.html` 2,245,854 bytes.
- It is an explicit built app, not a strangler duplicate.
- Start only with real source/dependency boundaries and before/after measurement.
- Possible result: bounded extraction, park, or accepted current cost.

### Strangler parity-authority migration

- Current owner family: `SYS-STRANGLER-RETIREMENT` / `ST-STRANGLER`.
- Existing Product PR #1090 owns legacy reference identity/inventory work.
- Do not create a parallel retirement lane while that owner is active.
- Required sequence remains replacement parity authority → source/dist/browser evidence → bounded deletion.

### Bible corpus acquisition/import proof

- Current decision row: `SEARCH-P2-07`.
- Exact CrossWire `RusSynodal` 1.9.1 remains candidate-only until archive bytes, SHA-256, licence/source/book manifest, 66-book mapping and verse-level import receipt are proved.
- `RusSynodalLIO` and Cassian restrictions are not bypassable technical problems.

## Parked non-defect improvement families

These were removed from MASTER during the 2026-08-07 cleanup because they are performance/refactor/polish questions without a current defect witness. They should return to MASTER only if measurement proves an independently actionable problem.

- **Home/runtime performance:** historical `AR-IDX-PERF-01`, `AR-IDX-PERF-02`, `AR-IDX-JS-01`.
- **CSS/JS budget measurements:** historical `NEW-CSS-BUDGET-01`, `D-3`, `AUDIT-P3-OG-LCP-MISMATCH`.
- **Karty runtime measurement:** historical `PERF-P1-01`, `QUAL-P2-04`.
- **Karty dormant/optional UI:** historical `MINI-P1-01`; public Avraam/Ishod do not enable the minimap.
- **Karty decorative/cartographic style ideas:** historical glyph/ornament/halo/sea-pattern/sheet-engine style suggestions are not active defects. Holding-map publication still has one explicit visual-readiness owner in MASTER, but it does not mandate any particular decorative implementation.
- **Home polish/cleanup:** historical `AR-IDX-07`, `AR-IDX-08`, `AR-IDX-CSS-03`.
- **Generic refactor wishes:** historical `R-001`, `R-002`, `R-003`, `R-004`.
- **Measured built-app split:** `R-005`, described above.

## Queue hygiene

The queue is optional and may be empty. Do not copy every old audit row here. If an improvement becomes a verified current defect, move the **current formulation** into MASTER; if it is solved, abandoned or superseded, remove it.