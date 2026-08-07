# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT рабочей тетради верифицированной нужной работы `gospod-bog.ru`.**
> Несмотря на историческое имя файла, это не только баги: здесь живут текущие дефекты, доказанно нужные внедрения/улучшения, системные verification/implementation packages, residuals и owner decisions.
> Решено / stale / duplicate / absorbed / invalid / superseded → убрать из MASTER в той же wave; полезный контекст остаётся в `../legacy/`.

Current wave evidence: `verification/2026-08-07-strangler-identity-inventory-closure/REPORT.md`.

## Current state

| Поле | Значение |
|---|---|
| Product verification anchor | `89d1353bb783e3a4389f511b26d4193e214a529e` |
| Wave | Strangler identity/inventory subrepair closure, 2026-08-07 |
| Active work units | **14** |
| Direct current defects | **3** |
| Verified necessary improvements | **4** |
| Narrowed residuals | **1** |
| System verification lanes | **2** |
| Owner decisions | **4** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

До cleanup исторический MASTER показывал 145 open rows. Это не означало 145 нынешних багов: старые симптомы были переверифицированы/сгруппированы, шум и закрытое вынесены из активной рабочей поверхности.

---

## CURRENT DEFECTS — 3

| ID | Current problem | Boundary / evidence |
|---|---|---|
| `S-SEC-01` | `js/enhancements.js` всё ещё использует fixed blacklist/attribute-stripping HTML sanitizer design. | SYSTEM shared-runtime/security lane; adversarial fixtures required. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `AR-IDX-09` | Global Search shortcut принимает modified `Ctrl/⌘+K`, не исключая `Alt`/`Shift`. Current reverify on Product `9745939e...` confirms the same condition in both the bootstrap and loaded-runtime shortcut listeners in `js/search.js`; later Product waves through `89d1353b...` do not own `js/search.js`. | Existing Search owner only; repair both listeners and add one permanent shortcut contract rather than patching one path. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `NG-INLINE-01` | Current public Part I `MainShell` still hardcodes the `Из библиотеки` block with inline `#faf8f5`, `#1c1410`, `#8a7968`, `#b8882a` backgrounds/text/borders. Inline ownership bypasses the Nagornaya dark/theme token system and repeats presentation inside article markup instead of a shared themed component. | Current `NagornayaChast1MainShell.astro`; exact public native route imports that MainShell. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |

---

## VERIFIED NECESSARY IMPROVEMENTS — 4

| ID | Needed implementation | Why it is active work / evidence |
|---|---|---|
| `AUDIT-CSS-DEAD-KEYFRAMES-TOKENS` | Narrowed current CSS ownership cleanup: keep one canonical `@keyframes fx-breathe` definition and one canonical mobile `.gb-floater` rule instead of duplicate same-owner definitions in shared CSS. | Product delta through current MapEngine/Home/Strangler waves does not own this shared-CSS cleanup. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `AUDIT-JS-ESCAPER-DUP-X5` | Add one canonical shared HTML-escaping primitive (appropriate shared utility owner) and migrate the five current local copies instead of maintaining security-sensitive escaping independently across modules. | Product delta through current MapEngine/Home/Strangler waves does not own this shared-JS consolidation. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `SEARCH-P3-02` | Add truthful result-total / continuation (`Показать ещё`, pagination or equivalent) instead of silently exposing only Pagefind 10 / fallback 12. | Current corpus can return more matches than the user can reach. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `AR-IDX-05` | Consolidate Home/shared cache/version identity so `SITE_CONFIG.version` and asset `?v=` revisions do not remain parallel manual authorities. | Verified ownership debt with stale-cache/regression potential; coordinate with current shared owners. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |

---

## NARROWED RESIDUALS — 1

| ID | Current residual | Closure boundary / evidence |
|---|---|---|
| `AUDIT-P2-WORKFLOWS-CHECK-GAP` | The source/control-plane lifecycle defect was repaired and merged through Product `#1156`; it is no longer correct to describe `#1092` as an active Product owner. Final closure is withheld only because a successful current post-merge production witness for the repaired generic + TTS evidence lifecycle has not yet been established in this wave. | Verify a canonical push-to-main release/deploy run on a current merged SHA with generic and TTS live evidence bound to the same release/run/candidate and terminal `PASS`/complete state. Do not infer absence or success from the PR-only commit-run endpoint. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |

---

## SYSTEM VERIFICATION LANES — 2

Одна строка = один bounded current package/root, а не десятки исторических симптомов. Старые symptom-ID mapping находится в `../legacy/MATRIX_CLEANUP_2026-08-07.md`.

| ID | Verified work package | Next boundary / evidence |
|---|---|---|
| `SYS-KARTY-HOLDING-PUBLICATION-READINESS` | One publication-readiness package for the currently held map routes. The public hub/HoldingPage contract requires initial viewport, label collision, desktop/mobile layout, controls, route readability and overall visual quality before return. Route/schema readiness (Shoftim stages, Early Church overlap, Shvatim regions, draft route completeness) is checked in the same activation transaction. Historical sheet-engine decoration/style wishes are not requirements by themselves. | Current browser/screenshots + `maps:validate`/route-owner evidence per candidate immediately before activation. Promote only concrete blockers that remain independently actionable outside that activation transaction. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `SYS-STRANGLER-RETIREMENT` | Finish immutable identity, classification and replacement-parity authority for the remaining legacy/native-shadow surface before any bounded physical retirement. The bounded inventory/`/about/` identity subrepair is merged through Product `#1164`; exact readiness now reports 53/53 public indexes covered, 53 ledger entries, 0 missing-ledger candidates, 0 inventory/integrity/parity problems, and 23 classification-clear references. | Exact current artifact still reports **29 unknown reference decisions + 7 dependency owner decisions, blockerTotal 52**, `deletionReady=false`, `physicalMoveAuthorized=false`, verdict `NOT_YET_SAFE_TO_MOVE_OR_DELETE`. Continue only through bounded classification/owner-decision/parity-authority work; do not start physical deletion. `verification/2026-08-07-strangler-identity-inventory-closure/REPORT.md` |

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

- No open Product PR currently owns a MASTER repair lane at Product anchor `89d1353b...`.

Recently merged/closed current-wave context:

- `#1164` — clean current-main Strangler identity/inventory subrepair; exact head `a841345b...` passed 10/10 registered workflow groups including Source Authority `Full static publication gate`, and squash-merged as Product `89d1353b...`. Exact readiness remains not deletion-ready and is recorded in `verification/2026-08-07-strangler-identity-inventory-closure/REPORT.md`;
- `#1163` — independently repaired the stale Avraam `0.57.0` version assertion exposed by predecessor `#1162` and permanently linked `avraam-map-audit.js` into Shared Files Guard's MapEngine P0 step; merged as Product `b833e5fa...`;
- `#1162` / `#1090` — superseded Strangler predecessors, closed without merge and preserved for forensic history;
- `#1161` — shared MapEngine v0.58 correctness repair; exact head `5bb8ab7d...` passed 18/18 registered workflow groups and squash-merged as Product `9745939e...`. Eight MapEngine rows are retired by `verification/2026-08-07-mapengine-v058-closure/REPORT.md`;
- `#1158` — superseded MapEngine predecessor, closed without merge after clean successor `#1161` proved the exact ten-file current-main scope;
- `#1156` — release/live-evidence lifecycle source repair merged; production-witness residual remains separately open above;
- `#1154` — Home marginalia disclosure polish merged as Product `c6465de7...`;
- `#1153` — unversioned shared Karty MapEngine moved to network-first Service Worker runtime caching with latest-cache offline fallback; `MAP-P1-20` remains retired by `verification/2026-08-07-map-p1-20-sw-freshness-closure/REPORT.md`;
- `#1149` — strict-native Ishod geographic basemap replacement; `MAP-P1-10` and `BASE-P1-01` remain retired by `verification/2026-08-07-ishod-basemap-closure/REPORT.md`.

---

## Hygiene

1. MASTER holds **verified necessary current work**, not only defects.
2. A necessary improvement/implementation may enter MASTER when evidence proves material Product value/requirement/risk reduction; speculative refactor/polish stays in `WORK_QUEUE.md`.
3. Solve → verify result → remove from MASTER immediately.
4. Many symptoms with one root → one `SYS-*` row.
5. Holding routes are one activation/readiness transaction until a blocker becomes independently current.
6. Legacy is retained for lookup, but never treated as backlog; revival requires current re-verification.
7. Before Product edits, inspect current Product HEAD/open PRs/branches and avoid owner/file collisions.
