# Verifier Synthesis — Karty Section Deep Audit (2026-07-19)

## Meta
- Date: 2026-07-19
- Verifier: Arena Multi-Witness Verifier Agent
- Project: gb-is-my-strength
- Source repo: FedorMilovanov/gb-is-my-strength
- Audited SHA: c2c339708252
- Current Source HEAD: c2c339708252 (branch `arena/019f7280-gb-is-my-strength`)

## Inputs reviewed

| Agent | Path | Audited SHA | Scope | Findings | Confirmations | Challenges | Proposals |
|-------|------|-------------|-------|----------|---------------|------------|-----------|
| karty-deep-audit-2026-07-19 | `incoming/karty-deep-audit-2026-07-19/2026-07-19/REPORT.md` | `c2c339708252` | `/karty/` section, MapEngine v0.53, holding maps, Avraam custom renderer, hub | 31 | 1 | 0 | 1 |

---

## Bug Canonicalization

### New findings → canonical IDs registered in Master Bug Matrix
| Temp ID | Canonical ID | Title | Severity | Verification level | Target Repair Lane |
|---------|--------------|-------|----------|-------------------|-------------------|
| MAP-P0-01 | `MAP-P0-01` | Mobile panel top overflow offscreen up to -581px | P0 | L2 (browser DOM) | `karty-engine-p0-fixes` |
| MAP-P0-02 | `MAP-P0-02` | Share button crash `getState is not defined` | P0 | L2 (browser stack) | `karty-engine-p0-fixes` |
| MAP-P0-03 | `MAP-P0-03` | Search crash `inStory is not defined` & opacity clear defect | P0 | L2 (browser stack) | `karty-engine-p0-fixes` |
| MAP-P0-04 | `MAP-P0-04` | `viewport_init` overwritten by forced initial `flyTo` | P0 | L2 (browser viewport) | `karty-engine-p0-fixes` |
| MAP-P0-05 | `MAP-P0-05` | Deep links query/hash state sync broken | P0 | L2 (browser inspection) | `karty-engine-p0-fixes` |
| MAP-P0-06 | `MAP-P0-06` | Main layer toggles selector `[data-layer="{id}"]` matches 0 DOM elements | P0 | L2 (direct DOM query) | `karty-engine-p0-fixes` |
| MAP-P0-07 | `MAP-P0-07` | Light theme toggle updates CSS vars but map colors stay hardcoded dark | P0 | L2 (pixel diff + computed) | `karty-engine-p0-fixes` |
| MAP-P0-08 | `MAP-P0-08` | Zoom click/keyboard controls non-functional (mousedown hold only) | P0 | L2 (browser event test) | `karty-engine-p0-fixes` |
| MAP-P1-01 | `MAP-P1-01` | Tour stage index, caption, timeline, and camera sequence desynchronization | P1 | L2 (browser execution) | `karty-engine-p1-ux` |
| MAP-P1-02 | `MAP-P1-02` | Tour play trigger control omitted on touch/mobile UI | P1 | L2 (DOM scan) | `karty-engine-p1-ux` |
| MAP-P1-03 | `MAP-P1-03` | `shoftim` route declares 6 stages, but all 12 places assigned to stage 0 | P1 | L2 (data audit) | `karty-data-p1-fixes` |
| MAP-P1-04 | `MAP-P1-04` | Header UI collisions (search x theme, search x share, header x timeline) | P1 | L2 (DOM bounding boxes) | `karty-engine-p1-ux` |
| MAP-P1-05 | `MAP-P1-05` | Mobile viewport occupancy low (3.8%–28.5%), squeezing center cluster | P1 | L2 (viewport math) | `karty-engine-p1-ux` |
| MAP-P1-06 | `MAP-P1-06` | `_renderArchaeologyFooter` pollutes non-archaeology tabs (267 instances) | P1 | L2 (DOM tree scan) | `karty-engine-p1-ux` |
| MAP-P1-07 | `MAP-P1-07` | Exact marker coordinate overlaps in Early Church and Life of Jesus | P1 | L2 (JSON coordinate scan) | `karty-data-p1-fixes` |
| MAP-P1-08 | `MAP-P1-08` | Story switch opacity flash and search clear opacity wipeout | P1 | L2 (style mutation trace) | `karty-engine-p1-ux` |
| MAP-P1-09 | `MAP-P1-09` | Story switch auto-opens place panel after 600ms, covering mobile map | P1 | L2 (event timing trace) | `karty-engine-p1-ux` |
| MAP-P1-10 | `MAP-P1-10` | Base geography SVG missing or obscured under dark background rect | P1 | L2 (SVG DOM hierarchy) | `karty-engine-p1-ux` |
| MAP-P1-11 | `MAP-P1-11` | Scale bar math uses `cfg.W0 / view.w`, producing 1.32x-4.87x scale error | P1 | L2 (source code math) | `karty-engine-p1-ux` |
| MAP-P1-12 | `MAP-P1-12` | Compass placed inside SVG map coords (50,80) instead of screen overlay | P1 | L2 (SVG structure) | `karty-engine-p1-ux` |
| MAP-P1-13 | `MAP-P1-13` | Accessibility failure across all 113 markers and 9 panels | P1 | L2 (A11y DOM tree scan) | `karty-a11y-lifecycle` |
| MAP-P1-14 | `MAP-P1-14` | MapEngine destroy leaks keydown listeners & deletes shared base CSS | P1 | L2 (lifecycle listener test) | `karty-a11y-lifecycle` |
| AVRAAM-P1-01 | `AVRAAM-P1-01` | Avraam primary CTA opacity 0 for 1.8s while pointer-events enabled | P1 | L2 (computed style timeline) | `karty-avraam-hub` |
| AVRAAM-P1-02 | `AVRAAM-P1-02` | Avraam initial viewport compresses Canaan cluster with label collisions | P1 | L2 (coordinate distance) | `karty-avraam-hub` |
| AVRAAM-P1-03 | `AVRAAM-P1-03` | Avraam mobile panel duplicates nav controls, square share glyph, 42px tabs | P1 | L2 (mobile DOM scan) | `karty-avraam-hub` |
| AVRAAM-P1-04 | `AVRAAM-P1-04` | Avraam panel tabs are raw `<div>` lacking keyboard/tab role semantics | P1 | L2 (attribute scan) | `karty-a11y-lifecycle` |
| AVRAAM-P1-05 | `AVRAAM-P1-05` | Landscape desktop (1024x450) blocked by "Rotate device" overlay | P1 | L2 (media query test) | `karty-avraam-hub` |
| KARTY-DATA-P1-01 | `KARTY-DATA-P1-01` | Acute lack of manual `labelAnchor` and `leader` coordinates (0-5 per map) | P1 | L2 (data inventory scan) | `karty-data-p1-fixes` |
| AVRAAM-P2-01 | `AVRAAM-P2-01` | Heavy payload (~824KB, 1540 DOM, 60 GSAP) & route.json double fetch | P2 | L2 (network trace & DOM) | `karty-avraam-hub` |
| HUB-P2-01 | `HUB-P2-01` | Hub preview OG overlap, 138px gap, QA terms, `/karty/ishod/` indexable | P2 | L2 (visual & robots scan) | `karty-avraam-hub` |
| GATE-P1-01 | `GATE-P1-01` | `maps:validate` & `smoke:maps` pass invalid stages, crashes & bounds defects | P2 | L2 (CI runner comparison) | `karty-gates-p1-fixes` |

---

## Verification Ladder Status

### L2 — Confirmed on SHA `c2c339708252`
- All 31 new findings backed by direct Headless Chrome / Playwright browser passes, execution stack traces, computed CSS measurements, and JSON route schema inventory.

---

## Repair Lane Grouping

| Lane | Bug IDs | Count | Objective |
|------|---------|-------|-----------|
| `karty-engine-p0-fixes` | `MAP-P0-01`..`08` | 8 | Fix engine runtime crashes, mobile panel top bounds overflow, deep link query/hash sync, layer selectors, theme styling, zoom click/keyboard controls. |
| `karty-engine-p1-ux` | `MAP-P1-01`, `02`, `04`, `05`, `06`, `08`, `09`, `10`, `11`, `12` | 10 | Fix tour mode caption/camera sequence, mobile touch trigger, panel tab rendering, header UI layout collisions, scale bar calculation, screen-fixed compass. |
| `karty-data-p1-fixes` | `MAP-P1-03`, `07`, `KARTY-DATA-P1-01` | 3 | Fix `shoftim` stage IDs, duplicate marker coordinates, manual labelAnchor / leader coordinates across 8 engine routes. |
| `karty-a11y-lifecycle` | `MAP-P1-13`, `14`, `AVRAAM-P1-04` | 3 | Add keyboard navigation, ARIA dialog/button semantics, reduced motion JS handling, multi-instance destroy listener/CSS retention. |
| `karty-avraam-hub` | `AVRAAM-P1-01`, `02`, `03`, `05`, `AVRAAM-P2-01`, `HUB-P2-01` | 6 | Avraam intro CTA visibility timer, Canaan overview camera, mobile sheet nav cleanup, landscape media query, route preloading, hub OG banner and status parity. |
| `karty-gates-p1-fixes` | `GATE-P1-01` | 1 | Upgrade `maps:validate` and `smoke:maps` to detect stage misallocations, duplicate marker positions, JS runtime exceptions, and offscreen panel bounds. |

---

## Verifier Recommendation

1. All 31 findings are verified and recorded into `MASTER_BUG_MATRIX.md`.
2. The 8 holding maps and `/karty/ishod/` should remain excluded from showcase promotion until `karty-engine-p0-fixes` and `karty-engine-p1-ux` lanes land.
3. Existing green statuses on `maps:validate` and `smoke:maps` must be treated as incomplete until `GATE-P1-01` improvements are implemented.
