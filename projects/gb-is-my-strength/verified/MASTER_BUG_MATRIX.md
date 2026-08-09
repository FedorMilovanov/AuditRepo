# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT текущей верифицированной нужной работы `gospod-bog.ru`.** Это рабочая очередь, не архив. Решённое / stale / duplicate / absorbed / invalid / superseded удаляется из MASTER в той же consolidation wave; provenance остаётся в `verification/`, `legacy/` и Git history.

Current live reconciliation: [`../verification/2026-08-09-main-bc78-control-reconciliation/REPORT.md`](../verification/2026-08-09-main-bc78-control-reconciliation/REPORT.md).  
Previous reconciliation: [`../verification/2026-08-09-main-8080-owner-collision-rights-reconciliation/REPORT.md`](../verification/2026-08-09-main-8080-owner-collision-rights-reconciliation/REPORT.md).  
Current Lot audit: [`../verification/2026-08-09-lot-publication-current-audit/CURRENT_STATUS.md`](../verification/2026-08-09-lot-publication-current-audit/CURRENT_STATUS.md).

## Current state

| Поле | Значение |
|---|---|
| Product verification anchor | `bc786f4da7b6b3e9924caa046a3ab9ba829330fe` |
| AuditRepo correction evidence | `4e1fc59206b36453c573a80dc4445330a79d1f16` |
| Research current head observed | `09b6e1cb2468c72d220a299d9e4cc9af86a09756` |
| Bible-rights decision authority | `d52ea9d54dd2c2488223d25f5f6cefd263c23328` |
| Wave | Quiz closure / current-owner control reconciliation, 2026-08-09 |
| Active work units | **12** |
| Direct current defects | **2** |
| Verified necessary improvements | **0** |
| Narrowed residuals | **0** |
| System verification lanes | **7** |
| Owner decisions | **3** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

Current Product owner set remains multi-lane, but #1373 is merged and is no longer an active owner. Relevant current owners include #1401, #1395, #1393, #1378, #1363, #1334 and stale audit-only #1212. Independent Baptist media audit #1402 does not by itself establish a new MASTER defect. Historical Lot publication #1339 is closed superseded, and rights-blocked Bible corpus #1389 is closed unmerged; neither is a current Product owner. The unresolved Bible authorization remains owner decision `SEARCH-P2-07`. Duplicate Baptist roadmap PRs #1391 and #1400 remain closed unmerged; #1395 is the sole current roadmap owner. Protected readable/owner-ui branches already reserve the next two Strangler blockers. No second Home-settled, MapScale, Lot-source, Baptist-roadmap or Avraam owner should be opened.

---

## CURRENT DEFECTS — 2

| ID | Required repair | Current evidence / owner boundary |
|---|---|---|
| `LOT-PUBLICATION-READINESS-01` | Finish the strict-native Lot publication transaction without weakening route/source/browser/print/contracts or bypassing current rights/projection authorities. | Product issue **#1295** remains the publication root. Old publication #1339 is **closed unmerged / superseded** and must not be merged as-is. Catalog #1348, Search role authority #1313 and shared native quiz parity #1373 are merged. Lot source resilience remains #1378; shared standalone-footer ownership remains #1401. Rights-blocked Bible corpus PR #1389 is also **closed unmerged**; its unresolved authorization boundary remains owner decision `SEARCH-P2-07`, not an active implementation lane. Fresh Lot publication must be replayed from current main and regenerate Search/RSS/sitemap/Scripture only through canonical writers. Evidence: [`CURRENT_STATUS`](../verification/2026-08-09-lot-publication-current-audit/CURRENT_STATUS.md) + [`current reconciliation`](../verification/2026-08-09-main-bc78-control-reconciliation/REPORT.md). |
| `AVRAAM-HAMMAM-RETRACTION-PARITY` | Make every Avraam/Tall el-Hammam reader projection reflect the 2025 retraction boundary without turning retraction into proof of another Sodom identification. | Product issue **#1298**, draft PR **#1334** owns the Avraam source/runtime/route/audit boundary. Current branch is one Product-main commit behind and therefore requires ancestry refresh before exact-head merge authority. Keep Atlas-owned and separate from Lot publication. |

---

## VERIFIED NECESSARY IMPROVEMENTS — 0

No standalone current row. Historical `AR-IDX-05` and `AUDIT-JS-ESCAPER-DUP-X5` remain reverify-before-promotion candidates in `WORK_QUEUE.md`.

---

## NARROWED RESIDUALS — 0

No standalone current row. Narrow Lot annotations stay inside `LOT-PUBLICATION-READINESS-01`; the remaining Hammam work stays inside the Avraam defect root.

---

## SYSTEM VERIFICATION LANES — 7

| ID | Verified work package | Current boundary / owner |
|---|---|---|
| `SYS-READER-CONTROL-SEMANTICS` | Enforce truthful control→surface/action semantics across standalone/shared readers with one class-level browser census. | Product issue **#1224** remains root; #1258/#1259/#1267 are merged. Audit-only #1212 remains stale and needs a clean current-main successor/calibration without weakening static findings or reintroducing sequence-contaminated click evidence. Empty/stale `agent/system-article-control-census-20260808-r2` contains no unique work. |
| `SYS-FOOTNOTE-SEMANTIC-PROJECTION` | Make numbered/source footnotes first-class publication notes with one identity and truthful screen/accessibility/print projections. | Product issue **#1225** remains open. Closure must preserve popup UX while adding unique trigger↔note semantics and deterministic print note completeness. |
| `SYS-SOURCE-AUTHORITY-TRIGGER-CLOSURE` | Make Source Authority workflow applicability fail closed against the complete static-publication source surface. | Product issue **#1244** remains open. Concrete Baptist paths were repaired, but SYSTEM DoD remains authority-derived PR+push applicability with adversarial mutations rather than ad-hoc path lists. |
| `SYS-STRANGLER-RETIREMENT` | Retire/quarantine retained references only through logical storage authority with truthful blocker arithmetic and no physical move/delete before authorization. | Current merged Product truth at `bc786f4d…` remains **3 blockers**: `scripts/baptisty-roadmap-audit.js`, `scripts/readable-audit.js`, `scripts/owner-ui-regression-guard.js`. #1395 is the sole Baptist-roadmap owner; merged transport #1404 brought its head to `6a2c14f2…`, `behind=0`. Current diff derives publication routes from canonical `series.baseUrl`, reuses `buildPublicSurfaceRegistry()`, requires `production-dist + reading`, removes only the Baptist ledger dependency and adds direct execution in existing Shared. Exact-head Shared has passed and proves the candidate state **32 dependencies / 2 blockers**, the Baptist roadmap audit passes, and no assertion weakening was found. These are candidate proofs only: merged Product truth remains **3** until every required exact-head gate is terminal success, live `main` is unchanged at merge barrier, and #1395 is actually merged. Protected existing branches own later readable and owner-ui repairs; do not duplicate them. Physical move/delete remains unauthorized. [`REPORT`](../verification/2026-08-09-main-bc78-control-reconciliation/REPORT.md) |
| `SYS-HOME-DESIGN-SEARCH-SETTLED` | Make Home Design Audit Pro wait on observable canonical Search state and emit diagnostic state on timeout. | Product issue **#1299**, draft **#1393** remains the sole owner. The previously reported transient invalidation-observation race is repaired in the current semantic diff: the harness now arms an `input` listener before `fill()`/rapid typing, captures the synchronous post-runtime invalidated state, allows legitimate `loading=true`, then separately waits for exact settled query/title/selection/`aria-activedescendant` state under the unchanged 15 s bound. Remaining barrier is ancestry/evidence, not another design repair: current #1393 is `behind=2` and must absorb current main normally, then earn fresh exact-head CI. [`REPORT`](../verification/2026-08-09-main-bc78-control-reconciliation/REPORT.md) |
| `SYS-PRODUCT-VISUAL-GOLDENS` | Add owner-approved product goldens that detect common-mode regressions beyond legacy↔dist migration parity. | Product issue **#298** remains open P1. Current visual/reference-storage repairs do not close immutable product-state golden blind spot. |
| `SYS-MAP-SCALE-RESIZE-WITNESS` | Make Map scale resize browser witness measure settled runtime geometry rather than an intermediate transition frame. | Draft **#1363** remains a one-file harness repair. Semantic/final-tested head `d91af55e…` previously earned terminal SUCCESS for Shared, Metadata and full Route Registry, including Chromium + WebKit surfaces. Product main has since advanced through #1386 and merged quiz #1373, so this branch is now `behind=2`: old greens remain semantic evidence only. Because the Strangler mini-wave does not touch this test file, defer one final ancestry refresh until that wave settles, then rerun exact-head required checks once and merge only if race/reviews stay clean. |

---

## OWNER DECISIONS — 3

| ID | Missing decision / evidence |
|---|---|
| `SEARCH-P2-07` | Exact licensed/provenanced Bible corpus acquisition/import/publication boundary. Binding Research `d52ea9d5…` remains fail-closed. Product #1389 attempted the blocked Lot corpus expansion but is now **closed unmerged**; its Cassian permission boundary and `bible.by` Synodal publication-grade provenance problem remain evidence, not an active Product implementation. Research/AuditRepo authority must resolve the exact-source publication boundary before any replacement corpus lane is opened; green technical CI alone is insufficient. |
| `REG-001` | Hosting/proxy decision for response-level CSP / X-Frame / Referrer / Permissions headers, or explicit accepted-risk disposition. |
| `NG-VIS-04` | Author/editor decision whether dense Nagornaya table/card material should be rewritten into more prose/air. |

---

## Consolidation / collision order

1. Do not recreate catalog/Search-role/Gill-reading-time/native-quiz owners; those roots are merged.
2. Lot publication must be replayed from current main. #1378 owns source resilience and is currently `behind=0`; #1401 owns shared standalone-footer extraction and currently needs a one-commit ancestry refresh. #1373 quiz parity is already merged. #1339 is closed superseded, so no stale publication PR may be revived. #1389 is closed unmerged; Bible corpus authorization remains `SEARCH-P2-07` and no replacement data lane should open before that decision.
3. Strangler current truth is **3** until a candidate is merged. #1395 is the only Baptist roadmap owner and is current-main ancestry-clean after #1404; Shared already proves its intended **32 dependencies / 2 blockers** candidate state. Merge authority still requires every applicable exact-head gate terminal green, clean reviews/threads and unchanged live main. Protected readable/owner-ui branches reserve the next two blockers and must refresh from the resulting fresh main serially rather than spawning competing lanes.
4. #1393 is the only Home Search settled-state owner. Its transient invalidation race has been repaired in the current semantic diff; do not open another #1299 code lane. Refresh ancestry and re-earn exact-head evidence.
5. #1212 remains the stale audit-only reader census; replace/calibrate it cleanly later, not via empty r2 branch.
6. #1334 stays Atlas-owned; Lot must not absorb it. Current branch needs normal ancestry refresh before merge authority.
7. #1363 remains semantically proven but ancestry-stale (`behind=2`); avoid repeated churn while Strangler is moving main, then perform one final current-main refresh + exact required rerun.
8. Independent #1402 Baptist media coverage audit is evidence work, not a license to create another Product/ledger owner while #1395 owns Shared/Strangler scope.
9. Any Product/AuditRepo main movement invalidates final exact-head merge authority for affected lanes.

## Retired in recent waves

- Product #1348 catalog — merged.
- Product #1313 Search role authority — merged.
- Product #1267 reader quiz ARIA — merged.
- Product #1364 Gill claim reference-storage — merged.
- Product #1365 — closed false-positive.
- Product #1381 Gill reading-time ledger reconciliation — merged.
- Product #1386 audit-pro ledger reconciliation — merged; Strangler current truth is 3.
- Product #1373 native quiz parity — merged at `bc786f4d…`; removed from active system lanes.
- Product #1339 Lot publication snapshot — closed unmerged / superseded; publication root #1295 remains.
- Product #1389 Lot Bible corpus candidate — closed unmerged / rights-blocked; owner decision `SEARCH-P2-07` remains.
- Duplicate Baptist roadmap PRs #1391 and #1400 — closed unmerged; #1395 is sole owner.
