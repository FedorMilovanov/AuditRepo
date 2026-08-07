# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT рабочей очереди по проблемам `gospod-bog.ru`.**
> Здесь живёт только то, что ещё требует решения, current-check или решения владельца.
> Закрытые, stale, duplicate, absorbed и неактуальные формулировки сюда не возвращаются — они уходят в `../legacy/`.
> История изменений дополнительно существует в Git; MASTER не является летописью проекта.

## Current state

| Поле | Значение |
|---|---|
| Product verification anchor | `87d1a3c26c61e474603b1c68b551fde9163f744a` |
| Wave | full-matrix consolidation, 2026-08-07 |
| Active work units | **27** |
| Direct current defects | **9** |
| Narrowed residuals | **6** |
| System verification lanes | **8** |
| Owner decisions | **4** |
| Closed / stale / duplicate / absorbed rows in MASTER | **0** |

Historical input before cleanup was 145 rows labelled open. The cleanup does not pretend all 145 were current bugs: obsolete symptom formulations were retired or collapsed into current system lanes; non-defect improvements were moved out of MASTER.

---

## 🔴 CURRENT DEFECTS — 9

These have a current-source or current merged-evidence witness. Before Product mutation, re-check current open PRs for file/owner collision.

| ID | Current problem | Boundary |
|---|---|---|
| `S-SEC-01` | `js/enhancements.js` still uses a fixed blacklist/attribute-stripping HTML sanitizer design. | SYSTEM shared-runtime/security lane; require adversarial fixtures. |
| `MAP-P1-11` | Map scale bar still derives pixels from `cfg.W0 / view.w` instead of the actual rendered canvas width. | `karty/_engine/**` SYSTEM owner. |
| `MINI-P1-01` | Minimap remains dots/viewport on a blank rectangle and still wraps/reassigns `flyTo`. | `karty/_engine/**` SYSTEM owner. |
| `SIG-P1-01` | Signature overlays still use fixed map-unit offsets such as `origin.x - 74`. | Karty geometry SYSTEM owner. |
| `ENGINE-P2-04` | Story/toast notifications still lack a proven canonical live-region/status owner. | Karty a11y SYSTEM owner. |
| `AR-IDX-09` | Global Search shortcut still accepts modified `Ctrl/⌘+K` combinations without excluding `Alt`/`Shift`. | Existing Search owner only. |
| `SEARCH-P3-02` | Search still caps visible Pagefind results at 10 / fallback at 12 with no total/show-more contract. | Existing Search owner only. |
| `SEARCH-P3-03` | Search copy-preview constructs canonical `https://gospod-bog.ru` links while the action label is generic. | Decide truthful current-origin vs explicitly canonical behavior in Search owner. |
| `AR-IDX-05` | Home still carries a hard-coded `SITE_CONFIG.version` plus explicit asset `?v=` revisions. | Cache/version ownership; check collision with legacy/reference work first. |

---

## 🟠 NARROWED RESIDUALS — 6

Old composite wording was partly stale. Only the residual below remains eligible for a current repair.

| ID | Current residual |
|---|---|
| `MAP-P1-13` | Marker keyboard semantics are substantially repaired; only reduced-motion / remaining interaction semantics need a fresh bounded check. |
| `MAP-P1-20` | `route.json` SW-cache half is stale; residual is unversioned shared `map-engine.js` cache-bust ownership. |
| `QUAL-P1-09` | Residual is holding/noindex route-profile publication-status semantics; verify profiles + validators as one transaction. |
| `D-1` | Only cross-workflow deploy/IndexNow race semantics remain; overlaps release-control-plane ownership. |
| `D-19` | Rimlyanam half is closed; verify only the Antisovetov custom title/OG/Twitter/JSON-LD residual. |
| `NEW-OG-SIZE-PARAM` | Single hardcoded size is gone; only global-vs-route-specific approved social-image profile ownership remains. |

---

## 🟡 SYSTEM VERIFICATION LANES — 8

These are **current units of work**, each replacing many old symptom rows. Do not reopen the individual historical symptom IDs in MASTER unless a current check proves an independent defect.

### `SYS-KARTY-RUNTIME-GEOMETRY`

Current-check family for interaction, viewport, tour, panel, marker and LOD behavior.

Legacy symptoms absorbed into this lane:
`MAP-P1-01`, `MAP-P1-02`, `MAP-P1-04`, `MAP-P1-05`, `MAP-P1-07`, `MAP-P1-08`, `MAP-P1-10`, `MAP-P1-12`, `AVRAAM-P1-01`, `AVRAAM-P1-02`, `AVRAAM-P1-03`, `AVRAAM-P1-05`, `ASTRO-P1-01`, `MAP-P1-18`, `MAP-P1-19`, `DATA-P1-04`, `ENGINE-P1-26`, `ENGINE-P1-27`, `ENGINE-P1-29`, `QUAL-P1-01`, `QUAL-P1-05`, `QUAL-P1-06`, `DRAW-P1-01`, `TEXT-P1-01`, `WAYP-P1-01`, `PERF-P1-01`, `UI-P1-01`, `LOD-P1-01`, `AVRAAM-P2-01`, `MAP-P2-02`, `ENGINE-P2-03`, `QUAL-P2-04`.

**Next:** one representative source + browser wave across live/holding maps; split only genuinely independent current roots afterwards.

### `SYS-KARTY-DATA-PROJECTION`

Route/schema/base-geo/generated-artifact ownership.

Legacy symptoms absorbed:
`MAP-P1-03`, `KARTY-DATA-P1-01`, `ASTRO-P1-05`, `GATE-P1-03`, `DATA-P1-03`, `RIVER-P1-01`, `RIVER-P1-02`, `RIVER-P1-03`, `RIVER-P1-04`, `BASE-P1-01`, `BASE-P1-02`, `BASE-P1-03`, `SVG-P1-01`, `REG-P1-01`, `ROUTE-P1-01`, `BASE-P2-01`, `DATA-P2-01`, `QUAL-P2-02`.

**Next:** verify current route/schema/base-geo owners together before touching `karty/_engine/**`.

### `SYS-KARTY-VISUAL-LANGUAGE`

Visual/data-quality program; many historical rows are quality targets rather than correctness failures.

Legacy symptoms absorbed:
`QUAL-P1-03`, `DRAW-P1-03`, `QUAL-P1-08`, `ARCH-P1-01`, `RELIEF-P1-01`, `GLYPH-P1-01`, `GRAT-P1-01`, `SEA-P1-01`, `ORN-P1-01`, `HALO-P1-01`, `MEDIA-P1-01`, `HUB-P2-01`.

**Next:** owner-reviewed current screenshots + data/source check; downgrade/remove anything that is taste/polish rather than defect.

### `SYS-AUDIT-CONTROL-PLANE`

Audit/workflow false-green/false-red and duplicated-contract quality.

Legacy symptoms absorbed:
`CI-WORKFLOW-PROLIFERATION`, `S-T-01`, `AUDIT-P2-WORKFLOWS-CHECK-GAP`, `D-2`, `GATE-MARKER-DATA-DRIFT`, `BUG-011`, `NF-GATE-IZ5-STALE`.

**Current collision:** Product PR #1092 owns release control plane; PR #1096 owns Reader Projection linkage; PR #1097 owns reader regression guards. Do not create a competing workflow lane until those settle.

### `SYS-SEO-RELEASE-SURFACES`

Legacy symptoms absorbed:
`BUG-SEO-001`, `NEW-CANONICAL-IZBRANNOE-01-GAP`, `AR-IDX-10`.

**Next:** current route/live/tooling verification after release-control-plane work settles.

### `SYS-NAGORNAYA-MIGRATION`

Legacy symptoms absorbed:
`NG-DEAD-01`, `NG-SEO-01`, `NG-TOC-01`, `NG-CROSS-01`, `NG-SERIYA-01`, `NG-A11Y-01`, `NG-VIS-10`, `NG-STRUCT-01`, `NG-INLINE-01`.

**Next:** one Nagornaya source/build/browser wave; separate code/SEO/structure from author-sensitive content before repair.

### `SYS-SHARED-CSS-RUNTIME-HYGIENE`

Legacy symptoms absorbed:
`AUDIT-CSS-DEAD-KEYFRAMES-TOKENS`, `AUDIT-CSS-GBFLOATER-DUP-MEDIA`, `AUDIT-JS-ESCAPER-DUP-X5`, `D-4`, `NF-DEAD-ENHANCE-SHIM`, `AR-IDX-A11Y-01`.

**Current collision:** reader tooltip/layout owners are active in PRs #1093/#1095/#1097. Reverify shared CSS/runtime hygiene only after those owners settle.

### `SYS-STRANGLER-RETIREMENT`

Canonical successor of historical `R-007` / duplicate-shadow symptom rows.

Current Product PR #1090 already owns legacy reference identity/inventory work. Current deletion readiness must follow that owner; no parallel retirement lane.

---

## 🟣 OWNER DECISIONS — 4

| ID | Missing decision |
|---|---|
| `SEARCH-P2-07` | Exact licensed/provenanced Bible corpus acquisition/import/publication boundary. CrossWire `RusSynodal` 1.9.1 remains candidate-only until exact archive/hash/mapping/import evidence exists. |
| `GENESIS6-ACTIVATION-OWNER-GAP` | Whether/when to publish canonical Genesis 6 routes and who owns the final Product publication transaction. |
| `REG-001` | Hosting/proxy decision for response-level CSP/X-Frame/Referrer/Permissions headers, or explicit accepted-risk. |
| `NG-VIS-04` | Author/editor decision on rewriting dense table/card sections for more prose/air. |

---

## IN FLIGHT — do not collide

These are not extra matrix rows; they are current owners that constrain the 27 work units above.

- Product #1093 — shared article tooltip runtime / Hermenevtika popup repair.
- Product #1095 — standalone ReaderRail/ReaderSettings layout geometry.
- Product #1096 — Reader Projection workflow linkage.
- Product #1097 — dependent tooltip/layout regression guards.
- Product #1092 — release/live-evidence control plane.
- Product #1090 — legacy-reference identity/inventory/ledger.

Merged Product #1104 already corrected the interactive tooltip audit harness and is part of the current Product anchor.

---

## Matrix hygiene rule

1. A solved item is removed from MASTER in the same closure wave.
2. `fixed`, `stale`, `duplicate`, `absorbed`, `invalid`, `not-worth-fixing` and superseded wording goes to `../legacy/`, never to a growing closed section here.
3. Many symptoms with one current root become one `SYS-*` row.
4. Performance/refactor/polish ideas without a current defect witness belong in `WORK_QUEUE.md`, not MASTER.
5. A historical ID may return only if a current applicable witness proves it independently actionable again.
6. MASTER is for deciding and finishing work, not preserving project biography.