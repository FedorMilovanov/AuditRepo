# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT рабочей тетради верифицированной нужной работы `gospod-bog.ru`.**
> Несмотря на историческое имя файла, это не только баги: здесь живут текущие дефекты, доказанно нужные внедрения/улучшения, системные verification/implementation packages и owner decisions.
> Решено / stale / duplicate / absorbed / invalid / superseded → убрать из MASTER в той же wave; полезный контекст остаётся в `../legacy/` и verification evidence.

Current wave evidence: `verification/2026-08-08-direct-defects-zero/REPORT.md`.

## Current state

| Поле | Значение |
|---|---|
| Product verification anchor | `76ad2f3ff814c088eb429d5ec0edd35d5bbe27b0` |
| Wave | Direct-defect zero reconciliation, 2026-08-08 |
| Active work units | **10** |
| Direct current defects | **0** |
| Verified necessary improvements | **4** |
| Narrowed residuals | **0** |
| System verification lanes | **2** |
| Owner decisions | **4** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

До cleanup исторический MASTER показывал 145 open rows. Это не означало 145 нынешних багов: старые симптомы были переверифицированы/сгруппированы, шум и закрытое вынесены из активной рабочей поверхности.

---

## CURRENT DEFECTS — 0

На Product anchor `76ad2f3ff814c088eb429d5ec0edd35d5bbe27b0` подтверждённых direct current defects в MASTER нет.

Последние две строки закрыты и удалены в этой reconciliation:

- `S-SEC-01` → Product `#1195`, merged `a2d0ce587a3de2f659747151207c9adce31950cd`;
- `NG-INLINE-01` → Product `#1197`, merged `76ad2f3ff814c088eb429d5ec0edd35d5bbe27b0`.

Closure evidence: `verification/2026-08-08-direct-defects-zero/REPORT.md`.

---

## VERIFIED NECESSARY IMPROVEMENTS — 4

| ID | Needed implementation | Why it is active work / evidence |
|---|---|---|
| `AUDIT-CSS-DEAD-KEYFRAMES-TOKENS` | Canonicalize two current same-owner CSS duplications: keep one intentional `@keyframes fx-breathe` definition in `css/site.css`, and consolidate the duplicated standalone mobile `.gb-floater` ownership sections in `css/floating-cluster.css` without dropping the unique surrounding single-article/series rules. | Fresh Product re-read on `76ad2f3f...` confirms two different `fx-breathe` definitions and two `@media (max-width: 899px)` standalone `.gb-floater` sections repeating the core mobile geometry/surface declarations. `verification/2026-08-08-direct-defects-zero/REPORT.md` |
| `AUDIT-JS-ESCAPER-DUP-X5` | Add one appropriate shared HTML-escaping primitive and migrate the five current local escapers instead of maintaining security-sensitive escaping independently. | Fresh current-source re-read confirms **five** separate `& < > \"` HTML escapers: three lexical helpers in `js/site.js`, one in `js/highlights.js`, one in `js/search.js`; `js/site-utils.js` does not yet own a canonical equivalent. Preserve context/equivalence, especially Highlights, during migration. `verification/2026-08-08-direct-defects-zero/REPORT.md` |
| `SEARCH-P3-02` | Add truthful result-total / continuation (`Показать ещё`, pagination or equivalent) instead of exposing only bounded Pagefind/fallback result slices. | Fresh re-read after Search closure still finds Pagefind limited to 10 and fallback to 12. Search keyboard/runtime ownership itself is already closed by Product `#1183`; do not reopen `AR-IDX-09`. `verification/2026-08-08-direct-defects-zero/REPORT.md` |
| `AR-IDX-05` | Resolve the remaining `SITE_CONFIG.version` identity surface against per-asset `ASSET_VERSIONS`: prove all current consumers first, then either remove the unused parallel field or give it one explicit owner/meaning. Do not synchronize another number without a consumer. | Fresh re-read: `BaseLayout.astro` writes `runtimeConfig.version = ASSET_VERSIONS['js/glossary.js']`, while current `js/site.js` and `js/glossary.js` do **not** read `SITE_CONFIG.version` / `getConfig('version')`. Full consumer proof is therefore pending; if no current consumer remains, removal is the correct consolidation. `verification/2026-08-08-direct-defects-zero/REPORT.md` |

---

## SYSTEM VERIFICATION LANES — 2

Одна строка = один bounded current package/root, а не десятки исторических симптомов. Старые symptom-ID mapping находится в `../legacy/MATRIX_CLEANUP_2026-08-07.md`.

| ID | Verified work package | Next boundary / evidence |
|---|---|---|
| `SYS-KARTY-HOLDING-PUBLICATION-READINESS` | One publication-readiness package for the currently held map routes. The public hub/HoldingPage contract requires initial viewport, label collision, desktop/mobile layout, controls, route readability and overall visual quality before return. Route/schema readiness (Shoftim stages, Early Church overlap, Shvatim regions, draft route completeness) is checked in the same activation transaction. Historical sheet-engine decoration/style wishes are not requirements by themselves. | Current browser/screenshots + `maps:validate`/route-owner evidence per candidate immediately before activation. Promote only concrete blockers that remain independently actionable outside that activation transaction. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `SYS-STRANGLER-RETIREMENT` | Current authority/identity/parity is clear for the retained legacy/native-shadow surface: route profiles are sole current authority; exact evidence has 53/53 public indexes covered, 53 ledger entries, 52/52 native shadows classification-clear, 0 unknown reference decisions and no integrity/inventory/parity problems. `#1187` made cache-bust authority-aware; later Search/security/Nagornaya waves preserved this boundary. | Current evidence remains **35 dependency records / 26 blockers**: **16 mechanical reader repoints + 3 obsolete/remove-or-repoint readers + 7 dependency owner decisions**. Unknown dependency impacts, integrity, inventory coverage and parity problems remain `0`. `deletionReady=false`, `physicalMoveAuthorized=false`, verdict `NOT_YET_SAFE_TO_MOVE_OR_DELETE`. `verification/2026-08-08-search-head-strangler-readiness/REPORT.md`, `verification/2026-08-08-direct-defects-zero/REPORT.md` |

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

- At this reconciliation point Product has **no open PRs**.
- Direct-defect repair layer is closed: Product `#1195` closed `S-SEC-01`; Product `#1197` closed `NG-INLINE-01`.
- Before opening the next Product lane, reverify the selected improvement/system item against current Product `main` and current open PR/file ownership. Do not turn the four improvements into one shared refactor wave.

Recently merged/closed material current to this reconciliation:

- `#1197` — series-level Nagornaya library theme ownership repair across Parts I/II/III/V; exact final head `ae91cbc...` passed all effective registered workflows and merged as Product `76ad2f3ff814c088eb429d5ec0edd35d5bbe27b0`;
- `#1195` — FAQ JSON-LD answer serialization moved from HTML blacklist/sanitizer design to normalized visible text with adversarial mutation proof; merged as Product `a2d0ce587a3de2f659747151207c9adce31950cd`;
- `#1183` — closed `AR-IDX-09`: one global Ctrl/Meta+K owner, global Search trigger ownership, forensic/current-runtime corpus split, WebKit single-query behavior, Home non-scrolling fixture and authority-aware asset projection; merged as Product `67c234924e6973f9c88a22168d911b15c4c6db2a`;
- `#1194` — merged lane-collision guard on `b9734532...`;
- `#1187` — authority-aware cache-bust/reference-only boundary merged as `b2720eee...`;
- `#1193` — repaired Hermenevtika accepted-semantic anchor and existing Source Authority / Content Source Truth path ownership; merged as `f3e291b7...`;
- `#1185` — positive semantic manifests for Hermenevtika + Gill Part I merged as `c9055428...`;
- `#1178` — Avraam false-green/proxy checks replaced with positive semantic contract and adversarial mutations; merged as `ce5d023b...`;
- `#1176` — route profiles became sole current legacy/reference authority and content coverage became fail-closed; merged as `778b787f...`.

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
