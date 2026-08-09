# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT текущей верифицированной нужной работы `gospod-bog.ru`.** Это рабочая очередь, не архив. Решённое / stale / duplicate / absorbed / invalid / superseded удаляется из MASTER; provenance остаётся в `verification/`, `legacy/` и Git history.

Current live reconciliation: [`../verification/2026-08-09-main-bc786-control-reconciliation/REPORT.md`](../verification/2026-08-09-main-bc786-control-reconciliation/REPORT.md).  
Previous reconciliation: [`../verification/2026-08-09-main-8080-owner-collision-rights-reconciliation/REPORT.md`](../verification/2026-08-09-main-8080-owner-collision-rights-reconciliation/REPORT.md).  
Current Lot audit: [`../verification/2026-08-09-lot-publication-current-audit/CURRENT_STATUS.md`](../verification/2026-08-09-lot-publication-current-audit/CURRENT_STATUS.md).

## Current state

| Поле | Значение |
|---|---|
| Product verification anchor | `bc786f4da7b6b3e9924caa046a3ab9ba829330fe` — merged #1373 |
| AuditRepo reconciliation base | `5154a5ef11c240e92e5758bbc7ac6445db9ae7f7` |
| Bible-rights decision authority | `d52ea9d54dd2c2488223d25f5f6cefd263c23328` |
| Wave | control reconciliation / Strangler-3 / Lot-unpublished, 2026-08-09 |
| Active work units | **12** |
| Direct current defects | **2** |
| System verification lanes | **7** |
| Owner decisions | **3** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

Material changes since the prior snapshot: #1373 is merged and retired from active work; #1339 is closed unmerged/superseded; #1389 is closed unmerged/rights-blocked; #1395 is the sole current Baptist Strangler owner and its candidate head has already proved `blockers=2`, while merged Product truth remains `blockers=3` until that PR itself lands.

---

## CURRENT DEFECTS — 2

| ID | Required repair | Current evidence / owner boundary |
|---|---|---|
| `LOT-PUBLICATION-READINESS-01` | Publish Lot as a fresh strict-native transaction without stale publication ancestry, rights bypasses or weakened browser/print/source contracts. | Product issue **#1295 remains open**. Product `main@bc786f4d…` has **no** `src/pages/articles/lot-i-sodom/index.astro`; stale publication #1339 is closed unmerged/superseded. #1378 owns source resilience; #1401 owns shared standalone-footer extraction; #1373 quiz runtime parity is merged/closed; #1389 Bible corpus expansion is rights-blocked and cannot be used. A future publication owner must be a fresh `release/*` successor from current main and must regenerate derived Search/RSS/sitemap/Scripture only through canonical writers. [`CURRENT_STATUS`](../verification/2026-08-09-lot-publication-current-audit/CURRENT_STATUS.md) |
| `AVRAAM-HAMMAM-RETRACTION-PARITY` | Make every Avraam/Tall el-Hammam projection reflect the 2025 retraction boundary without turning retraction into proof of another identification. | Product issue **#1298**, draft **#1334** remains the Atlas-owned repair. Keep separate from Lot publication. |

---

## SYSTEM VERIFICATION LANES — 7

| ID | Verified work package | Current boundary / owner |
|---|---|---|
| `SYS-READER-CONTROL-SEMANTICS` | Enforce truthful control→surface/action semantics across standalone/shared readers with one class-level census. | Product issue **#1224** remains root; #1258/#1259/#1267 are merged. Audit-only #1212 is stale and needs a clean current-main calibration later, without weakening static findings or reintroducing sequence-contaminated click evidence. |
| `SYS-FOOTNOTE-SEMANTIC-PROJECTION` | Make numbered/source footnotes first-class publication notes with one identity and truthful screen/accessibility/print projections. | Product issue **#1225** remains open. Preserve popup UX while adding unique trigger↔note semantics and deterministic print-note completeness. |
| `SYS-SOURCE-AUTHORITY-TRIGGER-CLOSURE` | Make Source Authority workflow applicability fail closed against the complete static-publication source surface. | Product issue **#1244** remains open. DoD is authority-derived PR+push applicability with adversarial protected-source mutations, not ad-hoc path lists. |
| `SYS-STRANGLER-RETIREMENT` | Retire/quarantine retained references through logical storage authority with truthful blocker arithmetic and a move-safe inventory owner. | **Merged truth: 3 blockers.** Draft #1395 head `6a2c14f2…` is current-main based and exact Shared proves `32 dependencies / 2 blockers`; it is not merged authority until terminal gates + race/review finish. Protected readable branch has real storage-aware work but is `ahead=2/behind=2`; protected owner-ui branch has real work but is `ahead=1/behind=2`; do not duplicate either. `agent/legacy-inventory-storage-authority-20260809` is **ahead=0** and therefore not an implementation. After dependency blockers reach zero, a separate inventory storage-authority slice must make immutable-byte verification quarantine-aware and prove a non-destructive quarantine dry-run before any physical move/delete. [`REPORT`](../verification/2026-08-09-main-bc786-control-reconciliation/REPORT.md) |
| `SYS-HOME-DESIGN-SEARCH-SETTLED` | Make Home Design Audit Pro wait on observable canonical Search state and emit diagnostic state on timeout. | Product issue **#1299**, draft **#1393** is sole owner. Repair the transient invalidation witness; do not open a competing Home Search lane. |
| `SYS-PRODUCT-VISUAL-GOLDENS` | Add owner-approved product goldens that detect common-mode regressions beyond legacy↔dist migration parity. | Product issue **#298** remains open P1. Reference-storage repairs do not close the product-golden blind spot. |
| `SYS-MAP-SCALE-RESIZE-WITNESS` | Make Map scale-resize browser witness measure settled runtime geometry rather than an intermediate frame. | Draft **#1363** is semantically proven on its tested head but ancestry-stale. Defer one final current-main refresh until the active Strangler mini-wave settles; then rerun exact 3/3 once and merge if race/reviews remain clean. |

---

## OWNER DECISIONS — 3

| ID | Missing decision / evidence |
|---|---|
| `SEARCH-P2-07` | Exact licensed/provenanced Bible corpus acquisition/import/publication boundary. Binding Research `d52ea9d5…` remains fail-closed. Closed-unmerged #1389 conflicts with that authority and must not be revived as a technical shortcut. |
| `REG-001` | Hosting/proxy decision for response-level CSP / X-Frame / Referrer / Permissions headers, or explicit accepted-risk disposition. |
| `NG-VIS-04` | Author/editor decision whether dense Nagornaya table/card material should be rewritten into more prose/air. |

---

## Consolidation / collision order

1. **Strangler:** finish #1395 only in its owner lane. Then refresh/prove the protected readable lane, then the protected owner-ui lane. Dependency `blockers=0` is necessary but not sufficient: the inventory self-owner must then become storage-aware and pass a quarantine dry-run. Physical move/delete remains unauthorized until a separate explicit lane is allowed.
2. **Lot:** do not resurrect #1339 or #1389. Let #1378 and #1401 finish their bounded owners, then create a fresh `release/*` publication successor from live main. Carry forward only freshly verified Lot acceptance residuals; regenerate derived surfaces canonically.
3. **#1393:** sole Home Search settled-state owner; repair in-lane.
4. **#1363:** avoid repeated ancestry churn during the Strangler mini-wave; one final refresh + exact 3/3 afterward.
5. **#1334:** Atlas-owned; Lot must not absorb it.
6. **#1402:** Baptist media-coverage audit is measurement/evidence work only; do not promote a Product repair without a confirmed current defect.
7. Any Product/AuditRepo main movement invalidates final exact-head merge authority for affected lanes; it does not by itself require an AuditRepo telemetry-only sync.

## Retired in recent waves

- Product #1348 catalog/human reachability — merged.
- Product #1313 Search role authority — merged.
- Product #1353 Scripture occurrence writer — merged.
- Product #1381 Gill reading-time ledger reconciliation — merged.
- Product #1386 audit-pro ledger reconciliation — merged; merged Strangler truth is 3.
- Product #1373 native article quiz parity — **merged as `bc786f4d…`; systemic quiz root retired from active MASTER**.
- Product #1339 Lot publication snapshot — **closed unmerged / superseded**; historical evidence only.
- Product #1389 Lot Bible corpus expansion — **closed unmerged / rights-blocked**.
- Duplicate Baptist roadmap PRs #1391/#1400 — closed unmerged; #1395 is sole current owner.