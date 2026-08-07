# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT рабочей тетради верифицированной нужной работы `gospod-bog.ru`.**
> Несмотря на историческое имя файла, это не только баги: здесь живут текущие дефекты, доказанно нужные внедрения/улучшения, системные verification/implementation packages, residuals и owner decisions.
> Решено / stale / duplicate / absorbed / invalid / superseded → убрать из MASTER в той же wave; полезный контекст остаётся в `../legacy/`.

Current wave evidence: `verification/2026-08-07-full-matrix-consolidation/REPORT.md`.

## Current state

| Поле | Значение |
|---|---|
| Product verification anchor | `9a0db0dc4533cb473abfe57f86e27517f04deea6` |
| Wave | full-matrix consolidation, 2026-08-07 |
| Active work units | **25** |
| Direct current defects | **13** |
| Verified necessary improvements | **3** |
| Narrowed residuals | **0** |
| System verification lanes | **5** |
| Owner decisions | **4** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

До cleanup исторический MASTER показывал 145 open rows. Это не означало 145 нынешних багов: старые симптомы были переверифицированы/сгруппированы, шум и закрытое вынесены из активной рабочей поверхности.

---

## CURRENT DEFECTS — 13

| ID | Current problem | Boundary / evidence |
|---|---|---|
| `S-SEC-01` | `js/enhancements.js` всё ещё использует fixed blacklist/attribute-stripping HTML sanitizer design. | SYSTEM shared-runtime/security lane; adversarial fixtures required. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `MAP-P1-01` | Tour вычисляет реальный `sid`, но caption/progress всё ещё индексируют `route.stages[tourStepIdx]` и `data-stage=tourStepIdx`. Для story с non-zero `stage_ids` caption/highlight therefore drift from the authored stage. | Current reachable MapEngine keyboard/API tour state defect. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `MAP-P1-10` | Canonical strict-native Ishod creates MapEngine without `baseGeoUrl`; current MapEngine loads `#me-base-geo` only when `opts.baseGeoUrl` is supplied. The public map therefore renders route/markers without a geographic base layer. | Current canonical Ishod basemap integration defect. Shared-basemap broken-reference readiness is coordinated in `SYS-KARTY-DATA-PROJECTION`. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `MAP-P1-11` | Scale bar всё ещё выводит pixel scale из `cfg.W0 / view.w`, а не из реальной rendered canvas width. | Current public MapEngine geometry defect. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `MAP-P1-18` | Single-photo cards carry `data-src=ph.src`, but multi-photo gallery images render `ph.thumb||ph.src` without full-source/index metadata. Delegated modal open therefore receives the thumbnail and never initializes `photoCurrentPlace/photoCurrentIdx`, so modal swipe cannot advance the multi-photo set. | Current public multi-photo gallery/modal defect; Avraam has multi-photo content. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `WAYP-P1-01` | Current verified-waypoint labels are rendered as `font-size="7"` map units at opacity `.4`, without a label background and without `data-screen-anchor`. On Avraam main/mobile authored view widths this resolves to only a few CSS pixels, making the archaeological waypoint names effectively unreadable. | Current public Karty waypoint readability defect. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `ENGINE-P1-26` | Search iterates all rendered markers and can brighten a matching marker outside the active story, but marker interactivity is gated by `inStory`; search can therefore visually “find” a place the user cannot click/open in the current story state. | Current public MapEngine search/story ownership defect. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `ENGINE-P2-03` | Canonical routes fetch/resolve `route.json` before calling `MapEngine.createMap()`, yet `createMap()` unconditionally adds a loading overlay and removes it only after a fixed 600ms timer. Already-available map content is deliberately hidden for ~600ms on every initialization. | Current artificial loading-delay defect on strict-native maps. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `ENGINE-P2-04` | Story/toast notifications не имеют доказанного canonical live-region/status owner. | Current Karty a11y defect. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `AR-IDX-09` | Global Search shortcut принимает modified `Ctrl/⌘+K`, не исключая `Alt`/`Shift`. | Existing Search owner only. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `MAP-P1-13` | `prefers-reduced-motion` гасит CSS transitions/animations, но current `flyTo()` всё равно всегда запускает duration-based `requestAnimationFrame` viewBox animation; zoom/reset/tour paths могут сохранять существенное движение. | Current a11y defect in public Karty motion owner. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `MAP-P1-20` | Current Ishod map loads `../_engine/map-engine.js` без revision; SW классифицирует unversioned `.js` как static asset и обслуживает его cache-first. | Current stale-engine/cache invalidation defect; route.json half of old claim is retired. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `NG-INLINE-01` | Current public Part I `MainShell` still hardcodes the `Из библиотеки` block with inline `#faf8f5`, `#1c1410`, `#8a7968`, `#b8882a` backgrounds/text/borders. Inline ownership bypasses the Nagornaya dark/theme token system and repeats presentation inside article markup instead of a shared themed component. | Current `NagornayaChast1MainShell.astro`; exact public native route imports that MainShell. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |

---

## VERIFIED NECESSARY IMPROVEMENTS — 3

| ID | Needed implementation | Why it is active work / evidence |
|---|---|---|
| `NG-DEAD-01` | Remove the 15 unused `NagornayaChastN{HeaderHero,ArticleBody,PostContent}` extraction artifacts, or deliberately restore them as the actual canonical componentization boundary; do not keep both the monolithic MainShell owner and a zero-consumer extracted family. | Exact `0fbe7d1e` verification recorded 0 import refs; Product delta to current `9a0db0dc` did not change these components, the five MainShells or canonical part routes. Current Part I/Part V edge files still exist, while all five canonical routes import `NagornayaChastNMainShell`. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `SEARCH-P3-02` | Add truthful result-total / continuation (`Показать ещё`, pagination or equivalent) instead of silently exposing only Pagefind 10 / fallback 12. | Current corpus can return more matches than the user can reach. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `AR-IDX-05` | Consolidate Home/shared cache/version identity so `SITE_CONFIG.version` and asset `?v=` revisions do not remain parallel manual authorities. | Verified ownership debt with stale-cache/regression potential; coordinate with active legacy/reference owner. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |

---

## NARROWED RESIDUALS — 0

No residual-only row remains. A future partial closure should use this section only while an independently actionable remainder really exists.

---

## SYSTEM VERIFICATION LANES — 5

Одна строка = один текущий verification/implementation package/root, а не десятки исторических симптомов. Старые symptom-ID mapping находится в `../legacy/MATRIX_CLEANUP_2026-08-07.md`.

| ID | Verified work package | Next boundary / evidence |
|---|---|---|
| `SYS-KARTY-DATA-PROJECTION` | Holding-map publication readiness plus the shared data/base dependency needed by active Ishod repair. Shoftim/Early Church/Shvatim currently publish `KartyHoldingPage`, so route-data/overlap/region/signature issues are not mislabeled as public runtime defects. Shared `base-geo.svg` must also gain coherent self-contained defs/ID ownership before it can safely become Ishod's basemap. | Reverify/repair as one bounded publication-readiness/data package; promote only an independently current root. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `SYS-KARTY-VISUAL-LANGUAGE` | Explicit holding-map visual publication-readiness owner. The public hub and `KartyHoldingPage` require manual verification of initial viewport, label collision, desktop/mobile layout, controls, route readability and overall visual quality before a map returns. Old sheet-engine decoration/aesthetic rows are not requirements by themselves. | Current screenshots/browser review of holding candidates against the published readiness contract; fix only concrete blockers, retire taste-only historical symptoms. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `SYS-AUDIT-CONTROL-PLANE` | Audit/workflow false-green/false-red and duplicated/incorrect proof boundaries; also owns any remaining noindex/canonical harness gap after the `/izbrannoe/` source fix. | Coordinate with current Product control-plane owners; #1092/#1097 remain active and #1120 touches release geometry evidence. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `SYS-SHARED-CSS-RUNTIME-HYGIENE` | Shared CSS/runtime dead/duplicate owner cleanup and a11y hygiene. | Reverify after active reader layout/regression owners settle. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `SYS-STRANGLER-RETIREMENT` | Legacy/reference parity-authority migration and eventual bounded retirement. | Follow Product PR #1090 owner; no parallel retirement lane. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |

---

## OWNER DECISIONS — 4

| ID | Missing decision / evidence |
|---|---|
| `SEARCH-P2-07` | Exact licensed/provenanced Bible corpus acquisition/import/publication boundary; CrossWire `RusSynodal` 1.9.1 remains candidate-only pending exact archive/hash/mapping/import proof. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `GENESIS6-ACTIVATION-OWNER-GAP` | Whether/when to publish canonical Genesis 6 routes and who owns the final Product publication transaction. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `REG-001` | Hosting/proxy decision for response-level CSP/X-Frame/Referrer/Permissions headers, or explicit accepted-risk disposition. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `NG-VIS-04` | Author/editor decision whether dense table/card material should be rewritten into more prose/air. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |

---

## IN FLIGHT — do not collide

Not extra work units; current Product owners that constrain the matrix:

- #1097 — dependent tooltip/layout regression guards.
- #1092 — release/live-evidence control plane.
- #1090 — legacy-reference identity/inventory/ledger.
- #1120 — Home/release geometry evidence boundary.

Recently merged into or before the current Product anchor:

- #1095 — ReaderRail/ReaderSettings desktop layout geometry;
- #1093 — shared tooltip runtime / Hermenevtika popup repair;
- #1096 — Reader Projection workflow linkage;
- #1104 — interactive-tooltip physical-pointer audit-harness correction.

---

## Hygiene

1. MASTER holds **verified necessary current work**, not only defects.
2. A necessary improvement/implementation may enter MASTER when evidence proves material Product value/requirement/risk reduction; speculative refactor/polish stays in `WORK_QUEUE.md`.
3. Solve → verify result → remove from MASTER immediately.
4. Many symptoms with one root → one `SYS-*` row.
5. Legacy is retained for lookup, but never treated as backlog; revival requires current re-verification.
6. Before Product edits, inspect current Product HEAD/open PRs/branches and avoid owner/file collisions.