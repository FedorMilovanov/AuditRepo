# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT рабочей тетради верифицированной нужной работы `gospod-bog.ru`.**
> Несмотря на историческое имя файла, это не только баги: здесь живут текущие дефекты, доказанно нужные внедрения/улучшения, системные verification/implementation packages, residuals и owner decisions.
> Решено / stale / duplicate / absorbed / invalid / superseded → убрать из MASTER в той же wave; полезный контекст остаётся в `../legacy/`.

Current wave evidence: `../verification/2026-08-07-regression-preservation-wave0/REPORT.md`.

## Current state

| Поле | Значение |
|---|---|
| Product verification anchor | `ce5d023b7501f43f1c6cf04d3840718548da8e44` |
| Wave | Regression / Preservation validator-trust closure, 2026-08-07 |
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
| `AR-IDX-09` | Global Search shortcut принимает modified `Ctrl/⌘+K`, не исключая `Alt`/`Shift`; bootstrap и loaded-runtime listeners имеют один и тот же широкий trigger-класс. | **FIXING — Product PR #1168** owns the shared root repair. Do not open a parallel lane. Remove this row only after merged-current evidence proves canonical exact shortcut handling and no Home workaround. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |
| `NG-INLINE-01` | Current public Part I `MainShell` still hardcodes the `Из библиотеки` block with inline `#faf8f5`, `#1c1410`, `#8a7968`, `#b8882a` backgrounds/text/borders. Inline ownership bypasses the Nagornaya dark/theme token system and repeats presentation inside article markup instead of a shared themed component. | **FIXING — Product PR #1179** owns the current two-file themed-library component extraction. Do not open a parallel Nagornaya lane. `verification/2026-08-07-full-matrix-consolidation/REPORT.md` |

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
| `SYS-STRANGLER-RETIREMENT` | Immutable identity remains in the legacy-reference ledger, while **current** reference authority is now derived from route profiles. Product #1176 removed the duplicated current-classification owner: all retained native shadows have explicit current status, and the ledger's old status/classification fields are historical snapshot metadata at `auditedAtCommit`. Exact Wave 1A Shared Files evidence reports retirement readiness `blockers=23`, down from 52. | Current blocker class is now narrow and mechanical: **13 mechanical reader repoints + 3 obsolete readers to remove/repoint + 7 dependency owner decisions = 23**. Reference owner decisions are no longer the blocker. `deletionReady=false`, `physicalMoveAuthorized=false`, verdict remains `NOT_YET_SAFE_TO_MOVE_OR_DELETE`. Do not start physical deletion until these 23 reach zero and readiness is rerun on the exact current Product. `verification/2026-08-07-regression-preservation-wave0/REPORT.md` |

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

- `#1168` — active owner for `AR-IDX-09`, shared Search exact Ctrl/Command+K predicate + removal of Home capture workaround.
- `#1179` — active owner for `NG-INLINE-01`, themed `Из библиотеки` extraction.
- Regression Preservation Wave 1 is **closed in Product**: `#1176` merged as `778b787f...`; synced `#1178` merged as `ce5d023b...`. `SYS-VALIDATOR-TRUST` is therefore removed from MASTER in this closure wave.

Recently merged current-wave context:

- `#1176` — current route profiles became the sole current legacy/reference authority; immutable ledger remains identity/provenance snapshot; content coverage now measures frequency deficit and explicit health; exact pre-merge head passed 10/10 registered workflow groups.
- `#1178` — Avraam false-green Shechem assertion and research-line-count proxy replaced by a positive 14-unit native scholarly apparatus contract plus adversarial mutations; synced exact head passed 4/4 registered workflow groups before merge.
- `#1164` — Strangler identity/inventory subrepair; retained exact identities are complete.
- `#1161` — shared MapEngine v0.58 correctness repair; eight MapEngine rows retired.
- `#1156` — release/live-evidence lifecycle source repair; production-witness residual remains separately open above.
- `#1153` — unversioned shared Karty MapEngine moved to network-first Service Worker runtime caching with latest-cache offline fallback.
- `#1149` — strict-native Ishod geographic basemap replacement.

---

## Regression / Preservation campaign boundary

Completed:

1. **Validator trust** — closed by Product #1176 + #1178; `SYS-VALIDATOR-TRUST` removed.
2. **High-signal semantic recovery** — Gill/Herm Wave 2A reviewed 13 candidates and found 0 current Product regressions; Baptists Wave 2B reviewed 48 and found 0 current reader regressions. Evidence lives in the dedicated verification reports/PRs.
3. **Retained lane archaeology** — all 37 current `lane/*` refs received disposition; active current work aside, `UNIQUE_REVIEW=0` and no lost approved capability was found.

Remaining campaign closure condition:

4. Positive semantic/capability manifest pilots for Hermenevtika and Gill Part I, with Avraam already completed by #1178; then retire/degrade redundant low-value guards.

The campaign can close while unrelated MASTER work remains active.

---

## Hygiene

1. MASTER holds **verified necessary current work**, not only defects.
2. A necessary improvement/implementation may enter MASTER when evidence proves material Product value/requirement/risk reduction; speculative refactor/polish stays in `WORK_QUEUE.md`.
3. Solve → verify result → remove from MASTER immediately.
4. Many symptoms with one root → one `SYS-*` row.
5. Holding routes are one activation/readiness transaction until a blocker becomes independently current.
6. Legacy is retained for lookup, but never treated as backlog; revival requires current re-verification.
7. Before Product edits, inspect current Product HEAD/open PRs/branches and avoid owner/file collisions.
