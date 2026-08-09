# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT текущей верифицированной нужной работы `gospod-bog.ru`.** Это рабочая очередь, не архив. Решённое / stale / duplicate / absorbed / invalid / superseded удаляется из MASTER в той же consolidation wave; provenance остаётся в `verification/`, `legacy/` и Git history.

Current live follow-up: [`../verification/2026-08-09-main-706c-strangler4-quiz-style-followup/REPORT.md`](../verification/2026-08-09-main-706c-strangler4-quiz-style-followup/REPORT.md).  
Current reconciliation: [`../verification/2026-08-09-main-5434-live-owner-reconciliation/REPORT.md`](../verification/2026-08-09-main-5434-live-owner-reconciliation/REPORT.md).  
Current correction: [`../verification/2026-08-09-post-search-merge-audit-correction/REPORT.md`](../verification/2026-08-09-post-search-merge-audit-correction/REPORT.md).  
Current Lot audit: [`../verification/2026-08-09-lot-publication-current-audit/CURRENT_STATUS.md`](../verification/2026-08-09-lot-publication-current-audit/CURRENT_STATUS.md).

## Current state

| Поле | Значение |
|---|---|
| Product verification anchor | `706c38cafc96dddec2c2d763d449139e9bd8101a` |
| AuditRepo correction evidence | `01e4353327d4e05043535fabe533a8b7d248419b` |
| Research current head observed | `09b6e1cb2468c72d220a299d9e4cc9af86a09756` |
| Bible-rights decision authority | `d52ea9d54dd2c2488223d25f5f6cefd263c23328` |
| Wave | post-catalog / Strangler-4 / quiz+MapScale final-barrier reconciliation, 2026-08-09 |
| Active work units | **13** |
| Direct current defects | **2** |
| Verified necessary improvements | **0** |
| Narrowed residuals | **0** |
| System verification lanes | **8** |
| Owner decisions | **3** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

Current Product open-PR census contains **6 PRs**: **#1378, #1373, #1363, #1339, #1334, #1212**. Merged #1348 removed the catalog root from active MASTER. Merged #1267/#1313/#1364/#1381 are closure history, not current owners. Strangler current truth is now **4 owner-decision blockers**; there is no remaining known mechanical Gill reading-time blocker.

---

## CURRENT DEFECTS — 2

| ID | Required repair | Current evidence / owner boundary |
|---|---|---|
| `LOT-PUBLICATION-READINESS-01` | Finish the strict-native Lot publication transaction without weakening route/source/browser/print contracts, using current discovery/catalog/runtime owners rather than stale generated artifacts. | Product issue **#1295**; old publication PR **#1339@189dfdd…** is **ahead=10 / behind=13** from current `main@706c38ca…` and is not a final merge vehicle. Catalog #1348 and Search role authority #1313 are merged, so human reachability/catalog ownership and new-row role semantics are no longer upstream gaps. Shared native quiz semantic parity is separately owned by #1369/#1373; Lot source resilience by #1378. A fresh publication successor must replay only live publication-authority files and regenerate Search/RSS/sitemap/Scripture through canonical writers; do not carry #1339's stale generated trio. Evidence: [`CURRENT_STATUS`](../verification/2026-08-09-lot-publication-current-audit/CURRENT_STATUS.md) + [`current reconciliation`](../verification/2026-08-09-main-5434-live-owner-reconciliation/REPORT.md). |
| `AVRAAM-HAMMAM-RETRACTION-PARITY` | Make every Avraam/Tall el-Hammam reader projection reflect the 2025 retraction boundary without turning retraction into proof of another Sodom identification. | Product issue **#1298**, draft PR **#1334** still owns exactly `AvraamMap.astro` + `avraam-map-audit.js`; it remains unabsorbed and stale by ancestry. Its audit narrowed the remaining route-data defect to `route.scientific_variants.hammam[0]`, whose Bunch 2021 citation/note lacks the explicit retraction boundary already present in the sibling Sodom variant. Keep this Atlas-owned and separate from Lot publication. |

---

## VERIFIED NECESSARY IMPROVEMENTS — 0

No standalone current row. Historical `AR-IDX-05` and `AUDIT-JS-ESCAPER-DUP-X5` remain reverify-before-promotion candidates in `WORK_QUEUE.md`.

---

## NARROWED RESIDUALS — 0

No standalone current row. Narrow Lot annotations stay inside `LOT-PUBLICATION-READINESS-01`; the remaining Hammam variant stays inside the Avraam defect root.

---

## SYSTEM VERIFICATION LANES — 8

| ID | Verified work package | Current boundary / owner |
|---|---|---|
| `SYS-ARTICLE-QUIZ-NATIVE-PARITY` | Restore accepted native article quiz score/result/explanation semantics at the shared renderer/schema layer. | Product issue **#1369**, draft PR **#1373@a2fbe4db…**. Issue #1365 is officially closed false-positive: native rendering already exists through `SITE_CONFIG.quiz → ReaderActionsRuntime → article-interactions.js → article-quiz.js → #quizPlaceholder`; never restore/copy legacy `site.js`. Prior semantic head `ae06eab…` earned terminal green Native/Runtime/Visual/Shared/Node/Metadata/Deploy/Glossary. Deep source audit then found a presentation-owner mismatch: runtime renders `.quiz-result-badge`, `.quiz-explanation--short`, `.quiz-explanation--full`, while canonical `site.css` already owns `.quiz-score-badge`, `.quiz-explanation-short`, `.quiz-explanation-full`; no owner exists for the new selectors. Handoff comment **5232200352** requires reusing accepted classes in the already-owned runtime/test files, not adding CSS/Lot-local owners. Current `a2fbe4db…` only absorbs merged #1381; mismatch remains unresolved, so old green is not final merge authority. [`REPORT`](../verification/2026-08-09-main-706c-strangler4-quiz-style-followup/REPORT.md) |
| `SYS-READER-CONTROL-SEMANTICS` | Enforce truthful control→surface/action semantics across standalone/shared readers with one class-level browser census. | Product issue **#1224** remains root; #1258/#1259/#1267 are merged. Audit-only **#1212@06c2b8e…** remains stale by ancestry and must be replaced/refreshed without weakening static findings or reintroducing sequence-contaminated click evidence. Checked `agent/system-article-control-census-20260808-r2`: it has **ahead=0**, no changed files, and is not an active hidden successor. |
| `SYS-FOOTNOTE-SEMANTIC-PROJECTION` | Make numbered/source footnotes first-class publication notes with one identity and truthful screen/accessibility/print projections. | Product issue **#1225** remains open. Closure must preserve popup UX while adding unique trigger↔note semantics and deterministic print note completeness. Evidence: [`TOTAL AUDIT / CURRENT GOLD`](../verification/2026-08-08-total-current-gold-audit/REPORT.md). |
| `SYS-SOURCE-AUTHORITY-TRIGGER-CLOSURE` | Make Source Authority workflow applicability fail closed against the complete static-publication source surface. | Product issue **#1244** remains open. Concrete Baptist paths were repaired, but SYSTEM DoD remains authority-derived PR+push applicability with adversarial mutations rather than ad-hoc path lists. Evidence: [`TOTAL AUDIT / CURRENT GOLD`](../verification/2026-08-08-total-current-gold-audit/REPORT.md). |
| `SYS-STRANGLER-RETIREMENT` | Retire/quarantine retained references only through logical storage authority with truthful blocker arithmetic and no physical move/delete before authorization. | Current merged readiness is **4 blockers** after #1381. Merged sequence: #1371 `12→11`; #1372 `11→8`; #1376 `8→5`; #1381 `5→4`. The stale Gill reading-time mechanical row is closed. The four remaining blockers are owner-decision readers: `scripts/audit-pro.js`, `scripts/baptisty-roadmap-audit.js`, `scripts/readable-audit.js`, `scripts/owner-ui-regression-guard.js`. Physical move/delete remains unauthorized. [`REPORT`](../verification/2026-08-09-main-706c-strangler4-quiz-style-followup/REPORT.md) |
| `SYS-HOME-DESIGN-SEARCH-SETTLED` | Make Home Design Audit Pro wait on observable canonical Search state and emit diagnostic state on timeout. | Product issue **#1299** remains open. Do not increase timeout or delete assertions. Evidence: [`2026-08-09 reconciliation`](../verification/2026-08-09-current-master-reconciliation/REPORT.md). |
| `SYS-PRODUCT-VISUAL-GOLDENS` | Add owner-approved product goldens that detect common-mode regressions beyond legacy↔dist migration parity. | Product issue **#298** remains open P1. Current visual/reference-storage repairs do not close immutable product-state golden blind spot. Evidence: [`TOTAL AUDIT / CURRENT GOLD §20`](../verification/2026-08-08-total-current-gold-audit/REPORT.md). |
| `SYS-MAP-SCALE-RESIZE-WITNESS` | Make Map scale resize browser witness measure settled runtime geometry rather than an intermediate transition frame. | Draft **#1363** remains a one-file harness repair. Prior semantic checkpoint `0358b831…` earned terminal SUCCESS for Shared, Metadata and full Route Registry (registry contracts + Chromium surfaces/touch-scroll + WebKit). Final current-main ancestry transport #1387 then produced exact feature head **`d91af55e5e247b79e3a6bbec4a0b0e138455340d`**. Compare against `main@706c38ca…`: `behind=0`, only `scripts/map-engine-correctness-browser-test.mjs`, +16/-2. Fresh final-head Metadata is SUCCESS; Shared and Route Registry are running. No runtime/CSS/tolerance/workflow mutation. Only `d91af55e…` may authorize final merge. [`REPORT`](../verification/2026-08-09-main-706c-strangler4-quiz-style-followup/REPORT.md) |

---

## OWNER DECISIONS — 3

| ID | Missing decision / evidence |
|---|---|
| `SEARCH-P2-07` | Exact licensed/provenanced Bible corpus acquisition/import/publication boundary. Binding Research authority remains `d52ea9d5…`; candidate corpus expansion stays fail-closed until archive/licence/mapping/import evidence exists. |
| `REG-001` | Hosting/proxy decision for response-level CSP / X-Frame / Referrer / Permissions headers, or explicit accepted-risk disposition. |
| `NG-VIS-04` | Author/editor decision whether dense Nagornaya table/card material should be rewritten into more prose/air. |

---

## Consolidation / collision order

1. **Do not recreate the catalog owner.** #1348 is merged; `CATALOG-PROJECTION-01` is retired from active MASTER.
2. Lot publication must be replayed from current main rather than merging stale #1339 as-is. Catalog + Search role authority are already in main; #1373 owns shared quiz parity; #1378 owns source-link resilience. Generated discovery/Scripture projections stay canonical-writer-only.
3. Strangler current truth is **4 owner-decision blockers**. The Gill reading-time mechanical reconciliation #1381 is merged; do not recreate it. Physical move/delete remains unauthorized.
4. #1212 remains the audit-only reader census under #1224; refresh/calibrate it without weakening static findings or sequence-contaminating click tests. Empty/stale `r2` branch is not a successor owner.
5. #1373 owns native quiz parity; #1365 stays closed false-positive. Presentation class parity must be corrected inside existing runtime/test ownership before Ready.
6. #1334 stays Atlas-owned; Lot must not absorb it.
7. #1363 is harness-only, not MapEngine runtime mutation. Its final current-main head is already `behind=0`; merge only after fresh exact `d91af55e…` Shared+Route+Metadata are all terminal green and final race/review checks remain clean.
8. Any Product/AuditRepo main movement invalidates final exact-head merge authority for affected lanes.

## Retired in this wave

- `CATALOG-PROJECTION-01` / Product #1348 — merged in `5434f97…`.
- Product #1313 Search role authority — merged.
- Product #1267 reader quiz ARIA — merged.
- Product #1364 Gill claim reference-storage — merged.
- Product #1365 — closed false-positive.
- Product #1381 Gill reading-time ledger reconciliation — merged; Strangler current truth is 4.
- Strangler #1371/#1372/#1376 — merged closure history.
