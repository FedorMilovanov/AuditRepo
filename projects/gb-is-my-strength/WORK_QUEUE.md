# Optional Work Queue — gb-is-my-strength

This file is for **optional improvements and measurement-first work**, not confirmed bugs. `verified/MASTER_BUG_MATRIX.md` remains the only active problem matrix.

Before starting any lane, re-read current Product owners/open PRs and verify the selected surface.

## Selected evidence-backed candidates

### Karty runtime performance measurements

- Historical `PERF-P1-01`: current Avraam `base.svg` still contains an indefinite 14-second animated `feTurbulence` / displacement-water effect, but the old “15–20 fps while dragging” number is not a current browser witness. Measure current Chromium/WebKit frame/input behavior before changing the effect. Promote only if current impact is material.
- Historical `QUAL-P2-04`: current MapEngine still rebuilds marker/path SVG structures in `renderMarkers()`, but source-level node recreation alone does not prove material GC/jank on the two public strict-native maps. Measure long-task/input/frame impact before refactoring rendering ownership.
- Do not keep a `SYS-KARTY-RUNTIME-GEOMETRY` lane alive solely for these two measurement questions.

### Home presentation-owner convergence

- Fresh current-source witness at Product `a068decefff4ddd0055da952c84b7a3633d7b43b`: no new reader-visible Home regression was reproduced and the latest main advance (`#1213`) changes no Home file.
- Mobile Directions presentation currently has two effective cascade owners: `HomeSections/Directions.astro` authors the `<=760px` showcase geometry, then later-rendered `HomeVisualAuditFixes.astro` overrides the same card grid/glyph/padding/type rules.
- Ambient normal presentation remains distributed across `HomeAmbientPhrases.astro`, `HomeResponsiveContracts.astro` and `HomeAmbientInteraction.astro`; the safe-rail geometry conflict is repaired, but presentation ownership is not fully converged.
- Localhost-only audit assertions also live inside Product Home components. Moving them into existing browser-contract owners may be part of a future cleanup, but source embedding alone is not a current defect.
- **Do not promote this cleanup to MASTER without a trigger.** Promote only if a fresh browser regression, false-green contract, recurring owner/file collision, or measured runtime/maintenance failure proves owner convergence independently necessary.
- Current evidence: `verification/2026-08-08-home-main-ci-control-plane-recheck/REPORT.md`.

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
- **Home polish/cleanup:** historical `AR-IDX-07`, `AR-IDX-08`, `AR-IDX-CSS-03`; current owner-convergence formulation is recorded above and remains optional until its promotion trigger is met.
- **Generic refactor wishes:** historical `R-001`, `R-002`, `R-003`, `R-004`.
- **Measured built-app split:** `R-005`, described above.

## Queue hygiene

The queue is optional and may be empty. Do not copy every old audit row here. If an improvement becomes a verified current defect, move the **current formulation** into MASTER; if it is solved, abandoned or superseded, remove it.
### Quiz Subsystem: Gamification & Pedagogical Architecture

- **Context:** Current quiz components (`GillLearningSheet.astro`, etc.) successfully implement the `elaborative interrogation` principle (showing the `.quiz-explanation` block after answers). Technical bugs (XSS, a11y focus) and content inaccuracies (stating contested claims as facts) are already verified and closed.
- **Candidate 1 (Persistent Mastery):** Quizzes are currently stateless. Wire the existing, unused CSS classes (`.quiz-mastery`, `.quiz-mastery__seg`) to a new `localStorage` engine (e.g., `gb-quiz-progress-v1`) analogous to the Favorites storage. This allows users to see their progress/streaks across sessions.
- **Candidate 2 (Confidence Calibration):** The DOM contains a hidden UI meter (`<div class="quiz-calib" id="glsQuizCalib" hidden>`). Unhide and implement the logic to prompt users for their confidence level *before* answering, comparing it to actual correctness to fill the calibration bar.
- **Candidate 3 (Difficulty Weighting):** Currently, all questions are hardcoded and weighted equally. Expand the quiz JSON schema to support `difficulty: 1|2|3`, granting higher streak points for hard questions and enabling basic question pooling/randomization for replayability.
- **Status:** These are high-value architectural improvements, not current defects. Do not promote to MASTER without explicit Owner approval to expand the educational scope.
