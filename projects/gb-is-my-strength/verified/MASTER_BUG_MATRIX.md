# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT рабочей тетради верифицированной нужной работы `gospod-bog.ru`.**
> Несмотря на историческое имя файла, это не только баги: здесь живут текущие дефекты, доказанно нужные внедрения/улучшения, системные verification/implementation packages и owner decisions.
> Решено / stale / duplicate / absorbed / invalid / superseded → убрать из MASTER в той же wave; полезный контекст остаётся в `../legacy/` и verification evidence.

Current wave evidence: `verification/2026-08-08-css-owner-closure-search-handoff/REPORT.md`.

## Current state

| Поле | Значение |
|---|---|
| Product verification anchor | `21b437cb79f7b74a4ad3c68e21ffad2edd8ce458` |
| Wave | CSS owner closure + next-wave handoff, 2026-08-08 |
| Active work units | **9** |
| Direct current defects | **0** |
| Verified necessary improvements | **3** |
| Narrowed residuals | **0** |
| System verification lanes | **2** |
| Owner decisions | **4** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

До cleanup исторический MASTER показывал 145 open rows. Это не означало 145 нынешних багов: старые симптомы были переверифицированы/сгруппированы, шум и закрытое вынесены из активной рабочей поверхности.

---

## CURRENT DEFECTS — 0

На Product anchor `21b437cb79f7b74a4ad3c68e21ffad2edd8ce458` подтверждённых direct current defects в MASTER нет.

Последние direct-defect closures остаются:

- `S-SEC-01` → Product `#1195`, merged `a2d0ce587a3de2f659747151207c9adce31950cd`;
- `NG-INLINE-01` → Product `#1197`, merged `76ad2f3ff814c088eb429d5ec0edd35d5bbe27b0`.

Evidence: `verification/2026-08-08-direct-defects-zero/REPORT.md`.

---

## VERIFIED NECESSARY IMPROVEMENTS — 3

| ID | Needed implementation | Why it is active work / evidence |
|---|---|---|
| `SEARCH-P3-02` | Give Search one truthful continuation contract across Pagefind, manifest fallback and exact Scripture occurrence paths: expose total vs shown state and deterministic continuation without reopening global shortcut ownership. | Fresh source audit: Pagefind truncates raw hits with `results.slice(0,10)` **before** hydration/dedupe/scope handling; manifest fallback ranks then slices to 12; exact Scripture dedupes then slices to 12 while its status can expose the larger full occurrence count. Extend the existing Search Modal Contract with >10/>12 fixtures; no new workflow. `verification/2026-08-08-css-owner-closure-search-handoff/REPORT.md` |
| `AR-IDX-05` | Replace the generic runtime `SITE_CONFIG.version` bridge with explicit per-asset revision authority for runtime-loaded CSS (or an equivalent injected asset map), then remove the misleading generic bridge when unused. | Canonical hashes already exist for `css/enhancements-runtime.css` and `css/highlights-runtime.css`, but `js/enhancements.js` and `js/highlights.js` version those files with generic `SITE_CONFIG.version`; `BaseLayout.astro` seeds that field from the unrelated `js/glossary.js` hash. `verification/2026-08-08-css-owner-closure-search-handoff/REPORT.md` |
| `AUDIT-JS-ESCAPER-DUP-X5` | Add one appropriate shared HTML-escaping primitive and migrate the five current local escapers, preserving loader availability and context/output equivalence rather than replacing helpers mechanically. | Fresh current-source re-read confirms five separate `& < > \"` HTML escapers: three lexical helpers in `js/site.js`, one in `js/highlights.js`, one in `js/search.js`; `js/site-utils.js` does not yet own a canonical equivalent. `verification/2026-08-08-direct-defects-zero/REPORT.md` |

---

## SYSTEM VERIFICATION LANES — 2

Одна строка = один bounded current package/root, а не десятки исторических симптомов. Старые symptom-ID mapping находится в `../legacy/MATRIX_CLEANUP_2026-08-07.md`.

| ID | Verified work package | Next boundary / evidence |
|---|---|---|
| `SYS-KARTY-HOLDING-PUBLICATION-READINESS` | One publication-readiness package for the currently held map routes. The public hub/HoldingPage contract requires initial viewport, label collision, desktop/mobile layout, controls, route readability and overall visual quality before return. Route/schema readiness (Shoftim stages, Early Church overlap, Shvatim regions, draft route completeness) is checked in the same activation transaction. Historical sheet-engine decoration/style wishes are not requirements by themselves. | Current browser/screenshots + `maps:validate`/route-owner evidence per candidate immediately before activation. Promote only concrete blockers that remain independently actionable outside that activation transaction. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `SYS-STRANGLER-RETIREMENT` | Current authority/identity/parity is clear for the retained legacy/native-shadow surface: route profiles are sole current authority; exact evidence has 53/53 public indexes covered, 53 ledger entries, 52/52 native shadows classification-clear, 0 unknown reference decisions and no integrity/inventory/parity problems. | Exact Shared Files artifact on Product `#1205` head `55c20a3f...` reconfirms **35 dependency records / 26 blockers**: **16 mechanical reader repoints + 3 obsolete/remove-or-repoint readers + 7 dependency owner decisions**; unknown dependency impacts/integrity/inventory/parity problems remain `0`; `deletionReady=false`, `physicalMoveAuthorized=false`, verdict `NOT_YET_SAFE_TO_MOVE_OR_DELETE`. `verification/2026-08-08-css-owner-closure-search-handoff/REPORT.md` |

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

- Product `#1205` closed `AUDIT-CSS-DEAD-KEYFRAMES-TOKENS` and merged as `21b437cb79f7b74a4ad3c68e21ffad2edd8ce458`; that row is removed from MASTER.
- At this reconciliation point no Product PR is authorized here as owner for `SEARCH-P3-02`, `AR-IDX-05` or `AUDIT-JS-ESCAPER-DUP-X5`; inspect current Product open PRs again immediately before opening the next bounded lane.
- Do not combine Search continuation, runtime asset identity and JS escaper consolidation into one shared refactor wave.

Recently merged/closed material current to this reconciliation:

- `#1205` — closed duplicate shared CSS owners; same exact final tree traveled through forensic predecessor `#1200 → #1202` and merged only after independent exact-head CI on allowed `fix/` branch; Product `21b437cb...`;
- `#1197` — series-level Nagornaya library theme ownership repair; Product `76ad2f3f...`;
- `#1195` — FAQ JSON-LD text-only security repair; Product `a2d0ce58...`;
- `#1183` — global Search shortcut/runtime ownership closure; Product `67c23492...`;
- `#1193` — Hermenevtika accepted-semantic anchor repair; Product `f3e291b7...`;
- `#1185` — positive semantic manifests for Hermenevtika + Gill Part I; Product `c9055428...`;
- `#1178` — Avraam positive semantic contract/mutations; Product `ce5d023b...`;
- `#1176` — route profiles sole current legacy/reference authority + fail-closed coverage; Product `778b787f...`.

---

## Hygiene

1. MASTER holds **verified necessary current work**, not only defects.
2. A necessary improvement/implementation may enter MASTER when evidence proves material Product value/requirement/risk reduction; speculative refactor/polish stays in `WORK_QUEUE.md`.
3. Solve → verify result → remove from MASTER immediately.
4. Many symptoms with one root → one `SYS-*` row.
5. Holding routes are one activation/readiness transaction until a blocker becomes independently current.
6. Legacy is retained for lookup, but never treated as backlog; revival requires current re-verification.
7. Before Product edits, inspect current Product HEAD/open PRs/branches and avoid owner/file collisions.
8. A moving Product `main` alone is not a reason for AuditRepo authority-sync; update MASTER only when finding disposition, scope, evidence or actionable handoff materially changes.
