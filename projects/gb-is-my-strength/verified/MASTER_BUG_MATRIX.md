# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT рабочей тетради верифицированной нужной работы `gospod-bog.ru`.**
> Несмотря на историческое имя файла, это не только баги: здесь живут текущие дефекты, доказанно нужные внедрения/улучшения, системные verification/implementation packages и owner decisions.
> Решено / stale / duplicate / absorbed / invalid / superseded → убрать из MASTER в той же wave; полезный контекст остаётся в `../legacy/` и verification evidence.

Current wave evidence: `verification/2026-08-07-live-release-strangler-nagornaya-reconciliation/REPORT.md`.

## Current state

| Поле | Значение |
|---|---|
| Product verification anchor | `f3e291b714e6f834f73f3f4fa340719a5f6da6ea` |
| Wave | Live release witness + Strangler/Nagornaya residual reconciliation, 2026-08-07 |
| Active work units | **13** |
| Direct current defects | **3** |
| Verified necessary improvements | **4** |
| Narrowed residuals | **0** |
| System verification lanes | **2** |
| Owner decisions | **4** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

До cleanup исторический MASTER показывал 145 open rows. Это не означало 145 нынешних багов: старые симптомы были переверифицированы/сгруппированы, шум и закрытое вынесены из активной рабочей поверхности.

---

## CURRENT DEFECTS — 3

| ID | Current problem | Boundary / evidence |
|---|---|---|
| `S-SEC-01` | `js/enhancements.js` всё ещё использует fixed blacklist/attribute-stripping HTML sanitizer design. | SYSTEM shared-runtime/security lane; adversarial fixtures required. Не начинать, пока активные shared Search/cache owners пересекаются по runtime/projection boundary. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `AR-IDX-09` | Global Search shortcut принимает modified `Ctrl/⌘+K`; текущий SYSTEM repair централизует raw shortcut semantics в одном owner и устраняет локальные parser-owners. | Product `#1183` — текущий Search SYSTEM owner, но он должен быть rebuilt/re-proved после `#1187`; старый mass reference-HTML projection не является merge evidence. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `NG-INLINE-01` | Одинаковый light-only блок `Из библиотеки` с hardcoded `#faf8f5`, `#b8882a`, `#8a5c10`, `#8a7968`/rgba presentation повторён в Nagornaya Parts **I, II, III и V**. Это один series-level presentation root, а не Part-I-only симптом. | Fresh source reverify on Product `f3e291b7...`; Part IV block отсутствует. Part-I-only `#1186` закрыт unmerged как superseded. Следующий repair должен иметь одного scoped series owner для I/II/III/V, сохранить текст/ссылки/семантику и не тащить unrelated global CSS/JS. `verification/2026-08-07-live-release-strangler-nagornaya-reconciliation/REPORT.md` |

---

## VERIFIED NECESSARY IMPROVEMENTS — 4

| ID | Needed implementation | Why it is active work / evidence |
|---|---|---|
| `AUDIT-CSS-DEAD-KEYFRAMES-TOKENS` | Narrowed current CSS ownership cleanup: keep one canonical `@keyframes fx-breathe` definition and one canonical mobile `.gb-floater` rule instead of duplicate same-owner definitions in shared CSS. | Product delta through current MapEngine/Home/Strangler waves does not own this shared-CSS cleanup. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `AUDIT-JS-ESCAPER-DUP-X5` | Add one canonical shared HTML-escaping primitive (appropriate shared utility owner) and migrate the five current local copies instead of maintaining security-sensitive escaping independently across modules. | Product delta through current MapEngine/Home/Strangler waves does not own this shared-JS consolidation. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `SEARCH-P3-02` | Add truthful result-total / continuation (`Показать ещё`, pagination or equivalent) instead of silently exposing only Pagefind 10 / fallback 12. | Current corpus can return more matches than the user can reach. Do only after current Search ownership repair closes. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `AR-IDX-05` | Consolidate Home/shared cache/version identity so `SITE_CONFIG.version` and asset `?v=` revisions do not remain parallel manual authorities. | Verified ownership debt with stale-cache/regression potential; coordinate after `#1187` cache-bust authority and current Search projection settle. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |

---

## SYSTEM VERIFICATION LANES — 2

Одна строка = один bounded current package/root, а не десятки исторических симптомов. Старые symptom-ID mapping находится в `../legacy/MATRIX_CLEANUP_2026-08-07.md`.

| ID | Verified work package | Next boundary / evidence |
|---|---|---|
| `SYS-KARTY-HOLDING-PUBLICATION-READINESS` | One publication-readiness package for the currently held map routes. The public hub/HoldingPage contract requires initial viewport, label collision, desktop/mobile layout, controls, route readability and overall visual quality before return. Route/schema readiness (Shoftim stages, Early Church overlap, Shvatim regions, draft route completeness) is checked in the same activation transaction. Historical sheet-engine decoration/style wishes are not requirements by themselves. | Current browser/screenshots + `maps:validate`/route-owner evidence per candidate immediately before activation. Promote only concrete blockers that remain independently actionable outside that activation transaction. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `SYS-STRANGLER-RETIREMENT` | Current authority/identity/parity is now clear for the retained legacy/native-shadow surface: Product `#1176` made route profiles the sole current authority and exact readiness reports 53/53 public indexes covered, 53 ledger entries, 52/52 native shadows classification-clear, 0 unknown reference decisions, 0 integrity/inventory/parity problems. | Exact #1176 Shared Files artifact narrows the blocker set to **23**: **13 mechanical reader repoints + 3 obsolete/remove-or-repoint readers + 7 dependency owner decisions**. `deletionReady=false`, `physicalMoveAuthorized=false`, verdict `NOT_YET_SAFE_TO_MOVE_OR_DELETE`. Active Product `#1187` adds cache-bust as a governed dependency reader; re-read its final exact-head readiness before any physical retirement transaction. `verification/2026-08-07-live-release-strangler-nagornaya-reconciliation/REPORT.md` |

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

- Product `#1187` — **SYSTEM cache-bust/reference-only authority boundary**, currently owns `scripts/cache-bust.js` plus existing legacy dependency registration. Do not create a parallel cache/version/reference quarantine fix.
- Product `#1183` — **SYSTEM Search keyboard ownership**, intentionally waiting on/rebuilding after `#1187`. Do not open a competing `AR-IDX-09` repair or reuse its stale mass reference-HTML projection as final evidence.
- No active Product PR owns the broadened Nagornaya I/II/III/V `NG-INLINE-01` repair after `#1186` was closed unmerged as superseded; open its fresh successor only after the shared `#1187 → Search` boundary is stable enough to avoid synthetic projection churn.

Recently merged/closed material current to this reconciliation:

- `#1193` — repaired the Hermenevtika accepted-semantic anchor and wired existing Source Authority / Content Source Truth triggers; exact head passed source→dist/shared/deploy/visual evidence and merged as Product `f3e291b7...`;
- canonical push-to-main Pages run `31215559649` on `f3e291b7...` produced generic and TTS live artifacts bound to the same release/run/candidate, both `result=PASS`, `phase=complete`; former `AUDIT-P2-WORKFLOWS-CHECK-GAP` is retired by this wave;
- `#1185` — positive semantic manifests for Hermenevtika + Gill Part I merged as `c9055428...`; its first Pages run exposed the bad Hermenevtika anchor and correctly failed before `#1193`;
- `#1178` — Avraam false-green/proxy checks replaced with positive semantic contract and adversarial mutations; merged as `ce5d023b...`;
- `#1176` — route profiles became sole current legacy/reference authority and content coverage became fail-closed; merged as `778b787f...`; exact readiness narrowed Strangler blockers from 52 to 23;
- `#1186` — Part-I-only Nagornaya theme repair, closed without merge after current source reverify proved the root spans I/II/III/V;
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
