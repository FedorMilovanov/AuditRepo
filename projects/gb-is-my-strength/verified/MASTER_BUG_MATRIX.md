# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT рабочей тетради верифицированной нужной работы `gospod-bog.ru`.**
> Несмотря на историческое имя файла, это не только баги: здесь живут текущие дефекты, доказанно нужные внедрения/улучшения, системные verification/implementation packages, residuals и owner decisions.
> Решено / stale / duplicate / absorbed / invalid / superseded → убрать из MASTER в той же wave; полезный контекст остаётся в `../legacy/`.

Current wave evidence: `verification/2026-08-07-full-matrix-consolidation/REPORT.md`.

## Current state

| Поле | Значение |
|---|---|
| Product verification anchor | `e678b6c8b487e0617fb2add21503af0e1961b59f` |
| Wave | full-matrix consolidation, 2026-08-07 |
| Active work units | **27** |
| Direct current defects | **14** |
| Verified necessary improvements | **7** |
| Narrowed residuals | **0** |
| System verification lanes | **2** |
| Owner decisions | **4** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

До cleanup исторический MASTER показывал 145 open rows. Это не означало 145 нынешних багов: старые симптомы были переверифицированы/сгруппированы, шум и закрытое вынесены из активной рабочей поверхности.

---

## CURRENT DEFECTS — 14

| ID | Current problem | Boundary / evidence |
|---|---|---|
| `S-SEC-01` | `js/enhancements.js` всё ещё использует fixed blacklist/attribute-stripping HTML sanitizer design. | SYSTEM shared-runtime/security lane; adversarial fixtures required. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `AUDIT-P2-WORKFLOWS-CHECK-GAP` | Current release evidence lifecycle can lose the forensic report needed to explain an early live-verifier failure: both live verifiers perform strict preflight assertions / candidate verification before creating their JSON report, while `deploy.yml` uploads generic/TTS evidence with bare `if: always()`. An early generic failure can leave no generic report, skip the TTS verifier under normal success semantics, and then run artifact-upload steps against missing files. | Current main `e678b6c8`; exact repair owner is active Product PR #1092. Do not duplicate its Product lane. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `MAP-P1-01` | Tour вычисляет реальный `sid`, но caption/progress всё ещё индексируют `route.stages[tourStepIdx]` и `data-stage=tourStepIdx`. Для story с non-zero `stage_ids` caption/highlight therefore drift from the authored stage. | Current reachable MapEngine keyboard/API tour state defect. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `MAP-P1-10` | Canonical strict-native Ishod creates MapEngine without `baseGeoUrl`; current MapEngine loads `#me-base-geo` only when `opts.baseGeoUrl` is supplied. The public map therefore renders route/markers without a geographic base layer. | Current canonical Ishod basemap integration defect. `BASE-P1-01` is the required shared-asset dependency before wiring a base layer. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
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

## VERIFIED NECESSARY IMPROVEMENTS — 7

| ID | Needed implementation | Why it is active work / evidence |
|---|---|---|
| `BASE-P1-01` | Provide one valid canonical geographic base asset for the public Ishod repair: either make shared `karty/_engine/base-geo.svg` self-contained or replace it with an explicitly owned equivalent. Do not wire the current broken shared asset into `MAP-P1-10`. | Current shared `base-geo.svg` has an empty `<defs>` yet references `url(#landG)`, `url(#seaG)`, `url(#soft)` and `<use>` targets such as `#hill`, `#peak`, `#peak-snow`; current MapEngine defs do not supply those foreign IDs. This is a material dependency of the active public Ishod basemap defect. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `D-2` | Make `css-layer-validator.js` enforce the architecture it advertises: compare actual `@layer` block order against the declared order and make the layered-coverage threshold semantics truthful (today the output says target ≥80% while only `<50%` becomes a warning and no 80% contract exists). | Current main source: the validator collects `foundLayers` and checks undeclared names, but never compares their sequence with `declaredLayers`; its header currently claims “All @layer blocks are in the declared order.” `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `NG-DEAD-01` | Remove the 15 unused `NagornayaChastN{HeaderHero,ArticleBody,PostContent}` extraction artifacts, or deliberately restore them as the actual canonical componentization boundary; do not keep both the monolithic MainShell owner and a zero-consumer extracted family. | Exact `0fbe7d1e` verification recorded 0 import refs; Product delta through current anchor did not change these components, the five MainShells or canonical part routes. Current Part I/Part V edge files still exist, while all five canonical routes import `NagornayaChastNMainShell`. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `AUDIT-CSS-DEAD-KEYFRAMES-TOKENS` | Narrowed current CSS ownership cleanup: keep one canonical `@keyframes fx-breathe` definition and one canonical mobile `.gb-floater` rule instead of duplicate same-owner definitions in shared CSS. | Current `site.css` still defines `@keyframes fx-breathe` twice with different bodies; current `floating-cluster.css` still repeats the mobile `.gb-floater` owner in two `@media (max-width:899px)` blocks. The historical “33 dead custom props” claim is not carried forward. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `AUDIT-JS-ESCAPER-DUP-X5` | Add one canonical shared HTML-escaping primitive (appropriate shared utility owner) and migrate the five current local copies instead of maintaining security-sensitive escaping independently across modules. | Current `site.js` contains three local `tt(...)` HTML escapers, `highlights.js` has local `h(...)`, `search.js` has local `F(...)`; current `site-utils.js` has no HTML-escape owner. This is exact 5→1 ownership dedupe, not a generic refactor wish. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `SEARCH-P3-02` | Add truthful result-total / continuation (`Показать ещё`, pagination or equivalent) instead of silently exposing only Pagefind 10 / fallback 12. | Current corpus can return more matches than the user can reach. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `AR-IDX-05` | Consolidate Home/shared cache/version identity so `SITE_CONFIG.version` and asset `?v=` revisions do not remain parallel manual authorities. | Verified ownership debt with stale-cache/regression potential; coordinate with active legacy/reference owner. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |

---

## NARROWED RESIDUALS — 0

No residual-only row remains. A future partial closure should use this section only while an independently actionable remainder really exists.

---

## SYSTEM VERIFICATION LANES — 2

Одна строка = один bounded current package/root, а не десятки исторических симптомов. Старые symptom-ID mapping находится в `../legacy/MATRIX_CLEANUP_2026-08-07.md`.

| ID | Verified work package | Next boundary / evidence |
|---|---|---|
| `SYS-KARTY-HOLDING-PUBLICATION-READINESS` | One publication-readiness package for the currently held map routes. The public hub/HoldingPage contract requires initial viewport, label collision, desktop/mobile layout, controls, route readability and overall visual quality before return. Route/schema readiness (Shoftim stages, Early Church overlap, Shvatim regions, draft route completeness) is checked in the same activation transaction. Historical sheet-engine decoration/style wishes are not requirements by themselves. | Current browser/screenshots + `maps:validate`/route-owner evidence per candidate immediately before activation. Promote only concrete blockers that remain independently actionable outside that activation transaction. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `SYS-STRANGLER-RETIREMENT` | Finish immutable identity, classification and replacement-parity authority for the remaining legacy/native-shadow surface before any bounded physical retirement. Current #1090 is intentionally narrow: after its expected two-blocker repair, **29 native shadows remain unclassified and 52 readiness blockers remain; physical move/delete stays unauthorized**. Historical `ASTRO-P1-05` / `NF-DEAD-ENHANCE-SHIM` are context inside this owner, not independent runtime bugs. | Product PR #1090 is the current collision owner. Completion requires the readiness owner to reach an authorized physical-retirement state (classification/identity/parity blockers cleared or explicitly dispositioned); no parallel deletion/migration lane. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |

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

- #1092 — exact release/live-evidence lifecycle repair for `AUDIT-P2-WORKFLOWS-CHECK-GAP`.
- #1090 — legacy-reference identity/inventory/retirement readiness; 29 native shadows / 52 blockers remain after its intended narrow repair.
- #1097 — dependent tooltip/layout regression guards.
- #1129 — Home footer settled-frame contract; unrelated to roots above.
- #1130 — ReaderSettings follow-up; unrelated to roots above.

Recently merged into or before the current Product anchor:

- #1120 — Home live-release geometry evidence boundary; current main anchor `e678b6c8...`;
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
5. Holding routes are one activation/readiness transaction until a blocker becomes independently current.
6. Legacy is retained for lookup, but never treated as backlog; revival requires current re-verification.
7. Before Product edits, inspect current Product HEAD/open PRs/branches and avoid owner/file collisions.