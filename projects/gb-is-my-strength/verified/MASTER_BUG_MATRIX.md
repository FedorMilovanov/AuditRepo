# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT текущей верифицированной нужной работы `gospod-bog.ru`.** Это рабочая очередь, не архив. Решённое / stale / duplicate / absorbed / invalid / superseded удаляется из MASTER в той же consolidation wave; provenance остаётся в `verification/`, `legacy/` и Git history.

Current live audit: [`../verification/2026-08-09-main-706c-live-audit/REPORT.md`](../verification/2026-08-09-main-706c-live-audit/REPORT.md).  
Previous reconciliation: [`../verification/2026-08-09-main-5434-live-owner-reconciliation/REPORT.md`](../verification/2026-08-09-main-5434-live-owner-reconciliation/REPORT.md).  
Current Lot audit: [`../verification/2026-08-09-lot-publication-current-audit/CURRENT_STATUS.md`](../verification/2026-08-09-lot-publication-current-audit/CURRENT_STATUS.md).

## Current state

| Поле | Значение |
|---|---|
| Product verification anchor | `706c38cafc96dddec2c2d763d449139e9bd8101a` |
| AuditRepo live evidence | `e6eda2ff0b7bb02ffcea5740a626736a62687532` |
| Research current head observed | `09b6e1cb2468c72d220a299d9e4cc9af86a09756` |
| Bible-rights decision authority | `d52ea9d54dd2c2488223d25f5f6cefd263c23328` |
| Wave | post-Gill / live collision + lifecycle reconciliation, 2026-08-09 |
| Active work units | **14** |
| Direct current defects | **2** |
| Verified necessary improvements | **0** |
| Narrowed residuals | **0** |
| System verification lanes | **9** |
| Owner decisions | **3** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

Current Product open-PR census contains **4 PRs**: **#1373, #1378, #1363, #1334**. Old Lot publication **#1339** and old reader census **#1212** are closed unmerged as stale/superseded evidence; their Product roots **#1295** and **#1224** remain active. Merged **#1381** advances Strangler readiness `5→4`. No old publication/census branch is a current implementation owner.

---

## CURRENT DEFECTS — 2

| ID | Required repair | Current evidence / owner boundary |
|---|---|---|
| `LOT-PUBLICATION-READINESS-01` | Finish the strict-native Lot publication transaction without weakening route/source/browser/print contracts, using current discovery/catalog/runtime owners rather than stale generated artifacts or obsolete Lot branch architecture. | Product issue **#1295** remains root. Publication PR **#1339 is closed unmerged as superseded**: it carried stale generated Search/RSS/sitemap state and still lacked current publication details such as canonical JSON-LD `#website`, live `#sec-map-connection` TOC membership and a Lot-specific OG. Current source-link repair is **#1378**, shared quiz upstream is **#1373/#1369**. `lane/lot-media-20260809` is empty, so raster families/OG are not delivered. `lane/lot-illustration-placement-20260809` contains useful but stale seven-file placement work to recover selectively only after real assets land; `lane/lot-source-polish-20260809` is destructive archaeology (`behind=41`, old alternative section tree) and must not be revived. Fresh publication successor must start from then-current main and let canonical writers derive Search/RSS/sitemap/Scripture. Evidence: [`live audit`](../verification/2026-08-09-main-706c-live-audit/REPORT.md) + [`CURRENT_STATUS`](../verification/2026-08-09-lot-publication-current-audit/CURRENT_STATUS.md). |
| `AVRAAM-HAMMAM-RETRACTION-PARITY` | Make every Avraam/Tall el-Hammam reader projection reflect the 2025 retraction boundary without turning retraction into proof of another Sodom identification. | Product issue **#1298**, draft **#1334** owns exactly `AvraamMap.astro` + `avraam-map-audit.js` but is now `behind=14`. Its static/audit slice remains useful; root #1298 must stay open because current `route.scientific_variants.hammam[0]` still cites Bunch 2021/destruction without the explicit retraction boundary present elsewhere. Recover the two-file slice selectively on current main, then fix the one route-data residual atomically. |

---

## VERIFIED NECESSARY IMPROVEMENTS — 0

No standalone current row. Historical `AR-IDX-05` and `AUDIT-JS-ESCAPER-DUP-X5` remain reverify-before-promotion candidates in `WORK_QUEUE.md`.

---

## NARROWED RESIDUALS — 0

No standalone current row. Narrow Lot annotations stay inside `LOT-PUBLICATION-READINESS-01`; the remaining Hammam variant stays inside the Avraam defect root.

---

## SYSTEM VERIFICATION LANES — 9

| ID | Verified work package | Current boundary / owner |
|---|---|---|
| `SYS-ARTICLE-QUIZ-NATIVE-PARITY` | Restore accepted native article quiz score/result/explanation semantics at the shared renderer/schema layer. | Product issue **#1369**, draft **#1373**. #1365 remains closed false-positive: native rendering already exists through `ReaderActionsRuntime → article-interactions.js → article-quiz.js`. #1373 truthfully owns four files: shared runtime, focused parity test, Native Source trigger and one real-route Runtime Interactive witness. Exact combined head `ae06eab…` passed all applicable workflows, then main moved through #1381. Merge-only transport #1385 produced current feature head `a2fbe4db…`; compare is again `behind=0` with the same four semantic files and fresh exact-head CI is running. Do not merge on prior green if current head has not re-earned it. |
| `SYS-READER-CONTROL-SEMANTICS` | Enforce truthful control→surface/action semantics across standalone/shared readers with one calibrated class-level browser census. | Product issue **#1224** remains root. Old audit PR **#1212 is closed unmerged as stale calibration**: its 887-observation artifact is not current truth because click journeys were sequence-contaminated, runtime noise was insufficiently classified and `<24px` was only a target-size prefilter without complete spacing/exception semantics. Build a current-main successor using the existing Runtime Interactive build/serve owner, isolated/reset control journeys, re-query after reset, environment-noise classification, proper WCAG target-spacing semantics and public-surface-derived route coverage. |
| `SYS-FOOTNOTE-SEMANTIC-PROJECTION` | Make numbered/source footnotes first-class publication notes with one identity and truthful screen/accessibility/print projections. | Product issue **#1225** remains open. Closure must preserve popup UX while adding unique trigger↔note semantics and deterministic print note completeness. Evidence: [`TOTAL AUDIT / CURRENT GOLD`](../verification/2026-08-08-total-current-gold-audit/REPORT.md). |
| `SYS-SOURCE-AUTHORITY-TRIGGER-CLOSURE` | Make Source Authority workflow applicability fail closed against the complete static-publication source surface. | Product issue **#1244** remains open. Concrete Baptist paths were repaired, but SYSTEM DoD remains authority-derived PR+push applicability with adversarial mutations rather than ad-hoc path lists. Evidence: [`TOTAL AUDIT / CURRENT GOLD`](../verification/2026-08-08-total-current-gold-audit/REPORT.md). |
| `SYS-SHARED-DIFF-CURRENT-TRUTH` | Make Shared Files PR validation operate on a provable current head/base graph, including delayed jobs after PR settlement, instead of mixing checkout state with stale event SHAs. | Product issue **#1249** is current root; CI alert **#1382** is a stronger reproduction, not a catalog regression. After #1348 was squash-merged, delayed Shared Files run `31319256770` checked out post-merge `main@5434f97…` while final diff guard still injected old PR `BASE_SHA/HEAD_SHA`; the head object was absent and `git rev-parse` failed with `Needed a single revision` after all prior substantive guards passed. Repair must fetch/validate the exact declared PR graph or recognize settled identity; never fabricate a Product failure from mismatched checkout/event state. |
| `SYS-STRANGLER-RETIREMENT` | Retire/quarantine retained references only through logical storage authority with truthful blocker arithmetic and no physical move/delete before authorization. | Merged **#1381 / `706c38c…`** proves readiness **5→4** by reconciling Gill reading-time ledger after code modernization. The four ledger blockers are not four code refactors: `audit-pro.js` is another stale governance row because current `buildAuditProSourceCorpus()` already uses `resolveReferenceForRoute()`; it needs a one-row ledger reconciliation. The three real physical-root readers are `baptisty-roadmap-audit.js`, `readable-audit.js`, `owner-ui-regression-guard.js`; Product issue **#1383** owns them as three independent code lanes. After audit-pro ledger cleanup, expected real code arithmetic is `3→2→1→0`. Physical move/delete remains unauthorized until readiness is zero. |
| `SYS-HOME-DESIGN-SEARCH-SETTLED` | Make Home Design Audit Pro wait on observable canonical Search state and emit diagnostic state on timeout. | Product issue **#1299** remains open. Do not increase timeout or delete assertions. Evidence: [`2026-08-09 reconciliation`](../verification/2026-08-09-current-master-reconciliation/REPORT.md). |
| `SYS-PRODUCT-VISUAL-GOLDENS` | Add owner-approved product goldens that detect common-mode regressions beyond legacy↔dist migration parity. | Product issue **#298** remains open P1. Current visual/reference-storage repairs do not close immutable product-state golden blind spot. Evidence: [`TOTAL AUDIT / CURRENT GOLD §20`](../verification/2026-08-08-total-current-gold-audit/REPORT.md). |
| `SYS-MAP-SCALE-RESIZE-WITNESS` | Make Map scale resize browser witness measure settled runtime geometry rather than an intermediate transition frame. | Draft **#1363** remains exactly one semantic test file. Its old exact head has now been fully verified: Shared Files, Metadata and Route Registry all SUCCESS. Runtime/CSS/tolerance remain unchanged; the false 120ms sample is replaced by bounded convergence against the same `expectedScaleDelta <= 2.5px` invariant. Current compare is `behind=2`; this is ancestry-only debt. Perform one ordinary current-main transport immediately before Ready/merge and rerun exact-head gates rather than rewriting MapEngine. |

---

## OWNER DECISIONS — 3

| ID | Missing decision / evidence |
|---|---|
| `SEARCH-P2-07` | Exact licensed/provenanced Bible corpus acquisition/import/publication boundary. Binding Research authority remains `d52ea9d5…`; candidate corpus expansion stays fail-closed until archive/licence/mapping/import evidence exists. |
| `REG-001` | Hosting/proxy decision for response-level CSP / X-Frame / Referrer / Permissions headers, or explicit accepted-risk disposition. |
| `NG-VIS-04` | Author/editor decision whether dense Nagornaya table/card material should be rewritten into more prose/air. |

---

## Consolidation / collision order

1. **Finish #1373 first.** It is the shared quiz upstream for final Lot proof. Current head `a2fbe4db…` is `behind=0`; require terminal exact-head CI and a final main race-check before merge.
2. **Then #1378.** It is a valid one-file Lot source repair, but #1381 made it `behind=1`; absorb settled main once and re-earn exact-head gates rather than churning ancestry while quiz is still moving.
3. **Lot media is not delivered.** `lane/lot-media-20260809` is empty. Land real 600/900/1200 WebP families + provenance + Lot-specific 1200×630 OG, then selectively recover the current-safe nine-placement illustration work. Never revive `lane/lot-source-polish-20260809` old architecture.
4. **Only after those settle, create a fresh Lot publication successor under #1295.** #1339 stays closed superseded. Add current `#website`, real TOC membership, Lot OG and canonical-writer-derived discovery/Scripture outputs; then browser/print/production witnesses.
5. **Strangler:** reconcile the stale `audit-pro` ledger row, then execute the three independent #1383 code lanes. Do not create a mega-PR or hard-code migration storage paths.
6. **#1363:** final current-main transport + exact-head Route Registry/Shared/Metadata barrier; harness-only, no MapEngine runtime mutation.
7. **#1334/#1298:** selectively recover the two-file static/audit slice; keep #1298 open for the one route-data residual.
8. **#1249:** harden Shared Files graph identity and delayed post-merge PR behavior; #1382 is infrastructure evidence, not rollback authority for #1348.
9. **#1224:** create a clean calibrated census successor; never revive #1212 or its 887-count as current truth.
10. Any Product/AuditRepo main movement invalidates final exact-head merge authority for affected lanes.

## Retired / settled in this wave

- Product **#1348** catalog — merged in `5434f97…`.
- Product **#1381** Gill ledger reconciliation — merged in `706c38c…`, Strangler `5→4`.
- Product **#1339** — closed unmerged as stale/superseded publication vehicle; root #1295 remains.
- Product **#1212** — closed unmerged as stale calibration; root #1224 remains.
- Product **#1365** — closed false-positive.
- Twelve orphan CI-failure notifier issues tied to closed/superseded branches — retired `not_planned` without claiming historical CI recovery.
- `CATALOG-PROJECTION-01`, Search role #1313, reader quiz ARIA #1267, Gill claim storage #1364, Strangler #1371/#1372/#1376 — merged closure history, not active owners.
