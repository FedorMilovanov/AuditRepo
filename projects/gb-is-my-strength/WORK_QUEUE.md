# Optional Work Queue — gb-is-my-strength

This file is for **optional improvements, measurement-first work and reverify-before-promotion candidates**, not confirmed current bugs. `verified/MASTER_BUG_MATRIX.md` is the only active problem matrix.

Before starting any lane, inspect current Product `main`, open PRs/branches and the selected owner. Historical wording or a reserved branch name alone never authorizes Product mutation.

## Selected evidence-backed candidates

### Karty runtime performance measurements

- Historical `PERF-P1-01`: measure current Chromium/WebKit frame/input behavior before changing the Avraam animated water effect.
- Historical `QUAL-P2-04`: MapEngine source-level node recreation does not by itself prove material GC/jank; measure long tasks/input/frame impact first.
- Do not confuse either item with current `SYS-MAP-SCALE-RESIZE-WITNESS` / #1363, which is a confirmed test-harness convergence defect.

### Home presentation-owner convergence

- Earlier audit found multiple presentation owners, but no current reader-visible regression was proved from ownership distribution alone.
- Keep parked until a fresh browser regression, false-green contract, recurring collision or measured failure proves convergence necessary.
- Current mandatory Home harness work remains `SYS-HOME-DESIGN-SEARCH-SETTLED` / #1299 in MASTER.

### Baptists 3D measured split

- Historical origin: `R-005`.
- Last recorded `_app/index.html` size was 2,245,854 bytes.
- It is an explicit built app, not a removable Strangler duplicate.
- Product #1402 is an audit/measurement owner for Baptist historical media coverage; it is **not** permission to mutate Product presentation before a current defect is confirmed.

### Runtime asset revision authority — reverify before promotion

- Historical `AR-IDX-05` observed runtime-loaded CSS using a generic `SITE_CONFIG.version` bridge while assets had their own revisions.
- Promote only after a fresh stale-cache/version witness.

### Shared JS escaping primitive — reverify before promotion

- Historical `AUDIT-JS-ESCAPER-DUP-X5` observed local equivalent escaping helpers.
- Duplication alone is not a defect. Re-count current implementations and prove semantic/security/maintenance divergence before promotion.

### Bible corpus acquisition/import proof

- Current owner-decision row remains `SEARCH-P2-07` in MASTER.
- Binding Research decision is `d52ea9d54dd2c2488223d25f5f6cefd263c23328`.
- Closed-unmerged Product #1389 is a rights-blocked attempt, not approved corpus evidence.
- CrossWire `RusSynodal` 1.9.1 remains candidate-only pending exact archive SHA-256, licence/source/book manifest, 66-book mapping and verse-level import receipt.
- `RusSynodalLIO` and Cassian restrictions remain binding until superseded by explicit rights authority.

## Active work that must **not** be duplicated here

- `SYS-STRANGLER-RETIREMENT` is active MASTER work. Merged truth at Product `bc786f4d…` is **3 blockers**. #1395 is the sole Baptist-roadmap owner and its candidate exact-head Shared run proves **2**; that number becomes merged truth only after #1395 itself lands. Protected readable and owner-ui branches already contain unique work and must be refreshed by their owners, not duplicated.
- The inventory move-safety repair is also **not optional** after dependency blockers reach zero: the reserved inventory branch currently has `ahead=0`, so a later bounded storage-authority owner must be established before any physical quarantine. This requirement is tracked in SYSTEM_THEMES/current verification rather than promoted as a separate optional refactor.
- Lot publication/readiness is active MASTER work. #1339 is closed superseded, #1373 is merged, #1389 is rights-blocked, #1378 owns source resilience and #1401 owns shared footer extraction. No optional Lot publication lane should be opened here.
- Reader semantics, footnote projection, Source Authority trigger closure, product visual goldens, Avraam retraction parity, Home Search settled-state and MapScale witness are active MASTER work.

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

The queue may be empty. Do not copy old audit rows here merely to retain history; history already lives in verification/Git. Promote only a current formulation backed by fresh evidence. If an item is disproved, solved, superseded or not worth doing, remove it.