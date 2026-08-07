# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT рабочей тетради верифицированной нужной работы `gospod-bog.ru`.**
> Несмотря на историческое имя файла, это не только баги: здесь живут текущие дефекты, доказанно нужные внедрения/улучшения, системные verification/implementation packages, residuals и owner decisions.
> Решено / stale / duplicate / absorbed / invalid / superseded → убрать из MASTER в той же wave; полезный контекст остаётся в `../legacy/`.

Current wave evidence: `verification/2026-08-07-full-matrix-consolidation/REPORT.md`.

## Current state

| Поле | Значение |
|---|---|
| Product verification anchor | `77b15181cf0aed3b1df35637492e8c7f9e905b0c` |
| Wave | full-matrix consolidation, 2026-08-07 |
| Active work units | **25** |
| Direct current defects | **11** |
| Verified necessary improvements | **3** |
| Narrowed residuals | **0** |
| System verification lanes | **7** |
| Owner decisions | **4** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

До cleanup исторический MASTER показывал 145 open rows. Это не означало 145 нынешних багов: старые симптомы были переверифицированы/сгруппированы, шум и закрытое вынесены из активной рабочей поверхности.

---

## CURRENT DEFECTS — 11

| ID | Current problem | Boundary / evidence |
|---|---|---|
| `S-SEC-01` | `js/enhancements.js` всё ещё использует fixed blacklist/attribute-stripping HTML sanitizer design. | SYSTEM shared-runtime/security lane; adversarial fixtures required. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `MAP-P1-01` | Tour вычисляет реальный `sid`, но caption/progress всё ещё индексируют `route.stages[tourStepIdx]` и `data-stage=tourStepIdx`. Для story `sinai` с `stage_ids:[2,3]` первый tour step поэтому подписывается/подсвечивается как stage 0, а не stage 2; следующий этап pre-fly запускается до показа следующего caption. | Current MapEngine tour state defect. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `MAP-P1-02` | Tour доступен через API и Space-key handler, но current public MapEngine не создаёт отдельную touch/click start-tour affordance; search of current Product finds `startTour()` только внутри engine/API. | Current touch discoverability/interaction defect. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `MAP-P1-03` | Current `karty/shoftim/route.json` объявляет 6 stages и story `stage_ids` 0–5, но places остаются `stage:0`; current-file checks do not find place stages 1/2/3. Stage coloring/filter/tour semantics therefore cannot represent the authored six-stage route. | Current route-data defect. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `MAP-P1-11` | Scale bar всё ещё выводит pixel scale из `cfg.W0 / view.w`, а не из реальной rendered canvas width. | `karty/_engine/**` SYSTEM owner. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `SIG-P1-01` | Signature overlays всё ещё используют fixed map-unit offsets (`origin.x - 74` и подобные). | Karty geometry SYSTEM owner. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `ENGINE-P1-26` | Search iterates all rendered markers and can brighten a matching marker outside the active story, but marker interactivity is gated by `inStory`; search can therefore visually “find” a place the user cannot click/open in the current story state. | Current MapEngine search/story ownership defect. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `ENGINE-P2-04` | Story/toast notifications не имеют доказанного canonical live-region/status owner. | Karty a11y SYSTEM owner. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `AR-IDX-09` | Global Search shortcut принимает modified `Ctrl/⌘+K`, не исключая `Alt`/`Shift`. | Existing Search owner only. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `MAP-P1-13` | `prefers-reduced-motion` гасит CSS transitions/animations, но current `flyTo()` всё равно всегда запускает duration-based `requestAnimationFrame` viewBox animation; zoom/reset/tour paths могут сохранять существенное движение. | Current a11y defect in Karty motion owner. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `MAP-P1-20` | Current Ishod map loads `../_engine/map-engine.js` без revision; SW классифицирует unversioned `.js` как static asset и обслуживает его cache-first. | Current stale-engine/cache invalidation defect; route.json half of old claim is retired. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |

---

## VERIFIED NECESSARY IMPROVEMENTS — 3

| ID | Needed implementation | Why it is active work / evidence |
|---|---|---|
| `MINI-P1-01` | Give the Karty minimap meaningful geographic context and remove its wrapper/reassignment ownership around `flyTo`. | Current minimap is still a blank rectangle + dots + viewport; synchronization is coupled by monkey-patching a navigation owner. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `SEARCH-P3-02` | Add truthful result-total / continuation (`Показать ещё`, pagination or equivalent) instead of silently exposing only Pagefind 10 / fallback 12. | Current corpus can return more matches than the user can reach. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `AR-IDX-05` | Consolidate Home/shared cache/version identity so `SITE_CONFIG.version` and asset `?v=` revisions do not remain parallel manual authorities. | Verified ownership debt with stale-cache/regression potential; coordinate with active legacy/reference owner. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |

---

## NARROWED RESIDUALS — 0

No residual-only row remains. A future partial closure should use this section only while an independently actionable remainder really exists.

---

## SYSTEM VERIFICATION LANES — 7

Одна строка = один текущий verification/implementation package/root, а не десятки исторических симптомов. Старые symptom-ID mapping находится в `../legacy/MATRIX_CLEANUP_2026-08-07.md`.

| ID | Verified work package | Next boundary / evidence |
|---|---|---|
| `SYS-KARTY-RUNTIME-GEOMETRY` | Reverify only the still-unclassified historical interaction/viewport/panel/marker/LOD symptoms after major MapEngine changes. `MAP-P1-01`, `MAP-P1-02`, `ENGINE-P1-26` and other current-local Karty rows above are no longer hidden inside this package. | Representative source + browser wave; retire fixed symptoms and split only independently current roots. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `SYS-KARTY-DATA-PROJECTION` | Reverify only still-unclassified route/schema/base-geo/generated-artifact claims. `MAP-P1-03` is now an independent current defect. | Verify current data/schema/base owners together before Product mutation. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `SYS-KARTY-VISUAL-LANGUAGE` | Visual/data-quality package where old P1 wording mixes correctness and quality targets. | Current screenshots + owner/value review; retain only genuinely necessary improvements. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `SYS-AUDIT-CONTROL-PLANE` | Audit/workflow false-green/false-red and duplicated/incorrect proof boundaries; also owns any remaining noindex/canonical harness gap after the `/izbrannoe/` source fix. | Coordinate with current Product control-plane owners; #1093/#1096 have merged, while #1092/#1097 remain active. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `SYS-NAGORNAYA-MIGRATION` | Current residual is narrower than the July package: the five Part I–V routes use `MainShell` again while the extracted `HeaderHero`/`ArticleBody`/`PostContent` component family still exists; Part I also still carries the repeated inline `Из библиотеки` palette/structure. Old scripture/footer SEO symptoms are already fixed. | Exact import inventory for all 15 extracted files; then one bounded delete-or-restore-componentization decision plus shared library-block ownership. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
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

- #1095 — ReaderRail/ReaderSettings desktop layout geometry.
- #1097 — dependent tooltip/layout regression guards.
- #1092 — release/live-evidence control plane.
- #1090 — legacy-reference identity/inventory/ledger.

Recently merged into the current Product anchor:

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