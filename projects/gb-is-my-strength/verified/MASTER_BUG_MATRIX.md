# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT рабочей тетради верифицированной нужной работы `gospod-bog.ru`.**
> Несмотря на историческое имя файла, это не только баги: здесь живут текущие дефекты, доказанно нужные внедрения/улучшения, системные verification/implementation packages и owner decisions.
> Решено / stale / duplicate / absorbed / invalid / superseded → убрать из MASTER в той же wave; полезный контекст остаётся в `../legacy/` и verification evidence.

Current wave evidence: `verification/2026-08-08-zero-direct-defects-next-wave/REPORT.md`.

## Current state

| Поле | Значение |
|---|---|
| Product verification anchor | `76ad2f3ff814c088eb429d5ec0edd35d5bbe27b0` |
| Wave | Zero direct defects + next-wave re-read, 2026-08-08 |
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

Подтверждённых текущих Product-дефектов в рабочей матрице сейчас нет. `S-SEC-01` закрыт Product `#1195`, `NG-INLINE-01` закрыт Product `#1197`; обе строки удалены после exact-head verification и merge.

---

## VERIFIED NECESSARY IMPROVEMENTS — 4

| ID | Needed implementation | Why it is active work / evidence |
|---|---|---|
| `AUDIT-CSS-DEAD-KEYFRAMES-TOKENS` | Remove duplicate same-owner shared-CSS definitions without changing effective presentation: keep the later canonical `@keyframes fx-breathe` in `css/site.css`; keep the earlier standalone mobile `.gb-floater` owner in `css/floating-cluster.css` and remove its repeated later standalone/dark/padding declarations while preserving the later unique series-lite mobile rules. | Fresh Product `76ad2f3f...` re-read proves both roots remain current. The later `fx-breathe` is effective and adds opacity while preserving the same scale path; the two mobile standalone `.gb-floater` declarations repeat the same geometry/background/backdrop/z-index and the earlier owner additionally preserves legacy `fc-single-active` padding. Next repair is bounded deletion/consolidation, not visual redesign. `verification/2026-08-08-zero-direct-defects-next-wave/REPORT.md` |
| `AUDIT-JS-ESCAPER-DUP-X5` | Add one canonical shared HTML-escaping primitive in the appropriate shared utility owner and migrate the five current local copies while preserving each caller's input-coercion semantics; keep URL sanitization separate. | Fresh Product `76ad2f3f...` re-read confirms three local escapers in `js/site.js`, one in `js/highlights.js`, one in `js/search.js`, and no canonical `escapeHtml` in `js/site-utils.js`. BaseLayout/404 establish SiteUtils before site/Search, but exact `highlights.js` loader ownership must be proven before migration so the consolidation cannot introduce a hidden load-order dependency. `verification/2026-08-08-zero-direct-defects-next-wave/REPORT.md` |
| `SEARCH-P3-02` | Add truthful result-total / continuation (`Показать ещё`, pagination or equivalent) so every matching result remains reachable instead of silently truncating the result corpus. | Fresh merged-Search re-read confirms Pagefind still uses `results.slice(0,10)`, manifest/fallback uses `.slice(0,12)`, and exact Scripture rendering uses `.slice(0,12)` while status can report the full occurrence count. No continuation owner exists. `verification/2026-08-08-zero-direct-defects-next-wave/REPORT.md` |
| `AR-IDX-05` | Retire or consolidate the remaining parallel `SITE_CONFIG.version` identity after proving its complete consumer contract; do not synchronize another number unless it is actually runtime-required. | Current asset identity already lives in `src/lib/asset-version.js`. `BaseLayout.astro` derives runtime config version from a content hash, while Home and active `404.html` still hardcode `1778943682`. Inspected `site.js` consumes/validates site/page/features but exposes no direct `SITE_CONFIG.version` use, so the next repair should prove consumers and preferably remove false cache authority if compatibility-only. `verification/2026-08-08-zero-direct-defects-next-wave/REPORT.md` |

---

## SYSTEM VERIFICATION LANES — 2

Одна строка = один bounded current package/root, а не десятки исторических симптомов. Старые symptom-ID mapping находится в `../legacy/MATRIX_CLEANUP_2026-08-07.md`.

| ID | Verified work package | Next boundary / evidence |
|---|---|---|
| `SYS-KARTY-HOLDING-PUBLICATION-READINESS` | One publication-readiness package for the currently held map routes. The public hub/HoldingPage contract requires initial viewport, label collision, desktop/mobile layout, controls, route readability and overall visual quality before return. Route/schema readiness (Shoftim stages, Early Church overlap, Shvatim regions, draft route completeness) is checked in the same activation transaction. Historical sheet-engine decoration/style wishes are not requirements by themselves. | Current browser/screenshots + `maps:validate`/route-owner evidence per candidate immediately before activation. Promote only concrete blockers that remain independently actionable outside that activation transaction. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `SYS-STRANGLER-RETIREMENT` | Current authority/identity/parity is clear for the retained legacy/native-shadow surface: route profiles are sole current authority; exact evidence has 53/53 public indexes covered, 53 ledger entries, 52/52 native shadows classification-clear, 0 unknown reference decisions and no integrity/inventory/parity problems. `#1187` made cache-bust authority-aware; final `#1183` projection preserved all 52 reference-only HTML snapshots. | Exact Product #1183 Shared Files artifact `9011117504` (`sha256:8b3ca43588b5ff3c6e57170ca9879232e86b14364058cde8f9ac6bef214b6e0a`) reports **35 dependency records / 26 blockers**: **16 mechanical reader repoints + 3 obsolete/remove-or-repoint readers + 7 dependency owner decisions**. Unknown dependency impacts, integrity, inventory coverage and parity problems are all `0`. `deletionReady=false`, `physicalMoveAuthorized=false`, verdict `NOT_YET_SAFE_TO_MOVE_OR_DELETE`. Product `#1195/#1197` do not alter this retirement boundary. `verification/2026-08-08-search-head-strangler-readiness/REPORT.md` |

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

- At this reconciliation point Product `main` is `76ad2f3ff814c088eb429d5ec0edd35d5bbe27b0` and has no open Product PRs.
- The two former direct-defect lanes are closed in order: `#1195` FAQ JSON-LD security → `#1197` Nagornaya I/II/III/V theme ownership, with `#1197` refreshed and independently reverified on top of merged `#1195`.
- Next selected implementation boundary is `AUDIT-CSS-DEAD-KEYFRAMES-TOKENS` as one bounded shared-CSS cleanup. Do not mix shared-JS escaper consolidation, Search pagination/version authority, Strangler retirement or held-map activation into that lane.

Recently merged/closed material current to this reconciliation:

- `#1197` — closed `NG-INLINE-01`: tokenized the duplicated `Из библиотеки` presentation in Nagornaya Parts I/II/III/V while preserving text/hrefs/order and Part IV absence; exact integrated head `ae91cbc0...` passed all registered workflows and merged as Product `76ad2f3ff814c088eb429d5ec0edd35d5bbe27b0`;
- `#1195` — closed `S-SEC-01`: FAQ JSON-LD answer text now uses normalized visible `textContent`, with innerHTML/detached-sanitizer regression killed by a permanent adversarial Shared Files contract; exact head `ab6300f5...` merged as Product `a2d0ce587a3de2f659747151207c9adce31950cd`;
- `#1183` — closed `AR-IDX-09`: one global Ctrl/Meta+K owner in `js/site-utils.js`, global Search trigger ownership, forensic/current-runtime corpus split, WebKit single-query behavior, Home non-scrolling fixture, authority-aware asset projection; exact head `853b99ca...` passed every registered workflow and merged as Product `67c234924e6973f9c88a22168d911b15c4c6db2a`;
- `#1194` — merged lane-collision guard on `b9734532...`; final `#1183` was refreshed onto it and remained collision-clean;
- `#1187` — authority-aware cache-bust/reference-only boundary merged as `b2720eee...`; final Search projection preserved 52 reference-only HTML snapshots;
- `#1193` — repaired the Hermenevtika accepted-semantic anchor and wired existing Source Authority / Content Source Truth triggers; merged as `f3e291b7...`;
- canonical push-to-main Pages run `31215559649` on `f3e291b7...` produced generic and TTS live artifacts bound to the same release/run/candidate, both `result=PASS`, `phase=complete`; former `AUDIT-P2-WORKFLOWS-CHECK-GAP` is retired;
- `#1185` — positive semantic manifests for Hermenevtika + Gill Part I merged as `c9055428...`;
- `#1178` — Avraam false-green/proxy checks replaced with positive semantic contract and adversarial mutations; merged as `ce5d023b...`;
- `#1176` — route profiles became sole current legacy/reference authority and content coverage became fail-closed; merged as `778b787f...`;
- `#1164` — bounded Strangler identity/inventory subrepair, merged as `89d1353b...`;
- `#1161` — shared MapEngine v0.58 correctness repair, merged as `9745939e...`; eight MapEngine rows remain retired.

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
