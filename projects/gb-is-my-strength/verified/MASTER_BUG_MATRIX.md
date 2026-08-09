# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT текущей верифицированной нужной работы `gospod-bog.ru`.** Это рабочая очередь, не архив. Решённое / stale / duplicate / absorbed / invalid / superseded удаляется из MASTER в той же consolidation wave; provenance остаётся в `verification/`, `legacy/` и Git history.

Current live reconciliation: [`../verification/2026-08-09-main-8080-owner-collision-rights-reconciliation/REPORT.md`](../verification/2026-08-09-main-8080-owner-collision-rights-reconciliation/REPORT.md).  
Previous follow-up: [`../verification/2026-08-09-main-706c-strangler4-quiz-style-followup/REPORT.md`](../verification/2026-08-09-main-706c-strangler4-quiz-style-followup/REPORT.md).  
Current Lot audit: [`../verification/2026-08-09-lot-publication-current-audit/CURRENT_STATUS.md`](../verification/2026-08-09-lot-publication-current-audit/CURRENT_STATUS.md).

## Current state

| Поле | Значение |
|---|---|
| Product verification anchor | `80800f6adca2f5af0da97cafda2214985d8c9b50` |
| AuditRepo correction evidence | `7285147c908a4c3e7ec941ca7931db6692d45c09` |
| Research current head observed | `09b6e1cb2468c72d220a299d9e4cc9af86a09756` |
| Bible-rights decision authority | `d52ea9d54dd2c2488223d25f5f6cefd263c23328` |
| Wave | Strangler-3 / owner-collision / rights-boundary reconciliation, 2026-08-09 |
| Active work units | **13** |
| Direct current defects | **2** |
| Verified necessary improvements | **0** |
| Narrowed residuals | **0** |
| System verification lanes | **8** |
| Owner decisions | **3** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

Current active owner set is larger than the earlier six-PR snapshot because new bounded lanes were opened after `706c38ca…`. Relevant current owners include #1401, #1395, #1393, #1389, #1378, #1373, #1363, #1339, #1334 and stale audit-only #1212. Duplicate Baptist roadmap PRs #1391 and #1400 were explicitly closed unmerged; #1395 remains the sole current roadmap owner. No second Home-settled, quiz, MapScale, Lot-source or Avraam owner should be opened.

---

## CURRENT DEFECTS — 2

| ID | Required repair | Current evidence / owner boundary |
|---|---|---|
| `LOT-PUBLICATION-READINESS-01` | Finish the strict-native Lot publication transaction without weakening route/source/browser/print/contracts or bypassing current rights/projection authorities. | Product issue **#1295**; old publication #1339 remains stale and must be replayed from current main rather than merged as-is. Catalog #1348 and Search role authority #1313 are merged. Shared quiz parity is #1369/#1373; Lot source resilience is #1378; shared standalone-footer ownership is #1401. New central Bible data PR #1389 is **not publication-authorized** under current Research rights decision and must not be used to force Lot enrichment. Fresh publication must regenerate Search/RSS/sitemap/Scripture only through canonical writers. Evidence: [`CURRENT_STATUS`](../verification/2026-08-09-lot-publication-current-audit/CURRENT_STATUS.md) + [`live reconciliation`](../verification/2026-08-09-main-8080-owner-collision-rights-reconciliation/REPORT.md). |
| `AVRAAM-HAMMAM-RETRACTION-PARITY` | Make every Avraam/Tall el-Hammam reader projection reflect the 2025 retraction boundary without turning retraction into proof of another Sodom identification. | Product issue **#1298**, draft PR **#1334** owns `AvraamMap.astro` + `avraam-map-audit.js`. Remaining narrowed route-data defect is `route.scientific_variants.hammam[0]`, whose Bunch 2021 citation/note still lacks the explicit retraction boundary already present in the sibling Sodom variant. Keep Atlas-owned and separate from Lot publication. |

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
| `SYS-ARTICLE-QUIZ-NATIVE-PARITY` | Restore accepted native article quiz score/result/explanation semantics at the shared renderer/schema layer. | Product issue **#1369**, draft PR **#1373@4d162639…**. Issue #1365 is closed false-positive: native rendering already exists through the shared native runtime; never restore/copy legacy `site.js`. The earlier presentation-owner mismatch is now repaired correctly: runtime carries both semantic and canonical presentation classes (`quiz-result-badge quiz-score-badge`, `quiz-explanation--short quiz-explanation-short`, `quiz-explanation--full quiz-explanation-full`) and the real-route witness asserts class/text parity. Fresh current-head state: SUCCESS Node, Shared, Deploy, Native Source, Metadata; Runtime/Visual in progress and Glossary queued at observation time. Only the final exact head may authorize Ready/merge. [`REPORT`](../verification/2026-08-09-main-8080-owner-collision-rights-reconciliation/REPORT.md) |
| `SYS-READER-CONTROL-SEMANTICS` | Enforce truthful control→surface/action semantics across standalone/shared readers with one class-level browser census. | Product issue **#1224** remains root; #1258/#1259/#1267 are merged. Audit-only #1212 remains stale and needs a clean current-main successor/calibration without weakening static findings or reintroducing sequence-contaminated click evidence. Empty/stale `agent/system-article-control-census-20260808-r2` contains no unique work. |
| `SYS-FOOTNOTE-SEMANTIC-PROJECTION` | Make numbered/source footnotes first-class publication notes with one identity and truthful screen/accessibility/print projections. | Product issue **#1225** remains open. Closure must preserve popup UX while adding unique trigger↔note semantics and deterministic print note completeness. |
| `SYS-SOURCE-AUTHORITY-TRIGGER-CLOSURE` | Make Source Authority workflow applicability fail closed against the complete static-publication source surface. | Product issue **#1244** remains open. Concrete Baptist paths were repaired, but SYSTEM DoD remains authority-derived PR+push applicability with adversarial mutations rather than ad-hoc path lists. |
| `SYS-STRANGLER-RETIREMENT` | Retire/quarantine retained references only through logical storage authority with truthful blocker arithmetic and no physical move/delete before authorization. | Current merged readiness is **3 blockers** after #1386. Remaining: `scripts/baptisty-roadmap-audit.js`, `scripts/readable-audit.js`, `scripts/owner-ui-regression-guard.js`. #1395 is sole Baptist-roadmap owner after duplicate #1391/#1400 were closed; it targets `3→2` but must derive the route from canonical `series.baseUrl` while keeping `status=production-dist` + `routeRole=reading` (handoff **5232290489**). Protected active branches already own later readable and owner-ui repairs; do not duplicate them. Physical move/delete remains unauthorized. [`REPORT`](../verification/2026-08-09-main-8080-owner-collision-rights-reconciliation/REPORT.md) |
| `SYS-HOME-DESIGN-SEARCH-SETTLED` | Make Home Design Audit Pro wait on observable canonical Search state and emit diagnostic state on timeout. | Product issue **#1299**, draft **#1393** is now the sole owner. Correct direction: remove heading taxonomy, preserve 15 s bound and expected-title/selection/activeDescendant checks. Current implementation has a transient-observation race: it samples invalidation in a separate round-trip after `input.fill()` and requires `loading=false`, although valid Search may enter loading after the 180 ms debounce before that sample. Handoff **5232272255** requires deterministic synchronous invalidation evidence (or equivalent) without Product Search mutation or timeout widening. |
| `SYS-PRODUCT-VISUAL-GOLDENS` | Add owner-approved product goldens that detect common-mode regressions beyond legacy↔dist migration parity. | Product issue **#298** remains open P1. Current visual/reference-storage repairs do not close immutable product-state golden blind spot. |
| `SYS-MAP-SCALE-RESIZE-WITNESS` | Make Map scale resize browser witness measure settled runtime geometry rather than an intermediate transition frame. | Draft **#1363** remains a one-file harness repair. Current semantic/final-tested head `d91af55e…` earned terminal SUCCESS for Shared, Metadata and full Route Registry, including Chromium + WebKit surfaces. Product main then advanced one unrelated ledger commit through #1386, so `d91af55e…` is now ancestry-stale but semantically proven. Because #1395 plus protected readable/owner-ui owners are the next expected retirement main movements and none touches this test file, defer one final ancestry refresh until that mini-wave settles; then rerun exact-head 3/3 once and merge if race/reviews stay clean. |

---

## OWNER DECISIONS — 3

| ID | Missing decision / evidence |
|---|---|
| `SEARCH-P2-07` | Exact licensed/provenanced Bible corpus acquisition/import/publication boundary. Binding Research `d52ea9d5…` remains fail-closed. Draft #1389 conflicts with that authority: new Cassian records are permission-controlled, and new `bible.by` Synodal bytes cannot self-assert publication-grade Public Domain provenance under the current exact-source decision. Audit blocker comment **5232286767** requires Research/AuditRepo evidence before Product corpus expansion; green technical CI is insufficient. |
| `REG-001` | Hosting/proxy decision for response-level CSP / X-Frame / Referrer / Permissions headers, or explicit accepted-risk disposition. |
| `NG-VIS-04` | Author/editor decision whether dense Nagornaya table/card material should be rewritten into more prose/air. |

---

## Consolidation / collision order

1. Do not recreate catalog/Search-role/Gill-reading-time owners; those roots are merged.
2. Lot publication must be replayed from current main. #1378 owns source resilience, #1401 owns shared standalone-footer extraction, #1373 owns native quiz parity. #1389 is rights-blocked and must not be treated as an approved Lot dependency.
3. Strangler current truth is **3**. #1395 is the only Baptist roadmap owner; #1391/#1400 are closed duplicates. Protected readable/owner-ui branches already reserve the next two blockers. Do not open competing lanes.
4. #1393 is the only Home Search settled-state owner; correct its transient invalidation witness rather than opening another #1299 branch.
5. #1212 remains the stale audit-only reader census; replace/calibrate it cleanly later, not via empty r2 branch.
6. #1334 stays Atlas-owned; Lot must not absorb it.
7. #1363 is semantically fully proven; avoid ancestry churn while the remaining Strangler mini-wave is actively moving main. One final current-main refresh + exact 3/3 rerun is sufficient before merge.
8. Any Product/AuditRepo main movement invalidates final exact-head merge authority for affected lanes.

## Retired in recent waves

- Product #1348 catalog — merged.
- Product #1313 Search role authority — merged.
- Product #1267 reader quiz ARIA — merged.
- Product #1364 Gill claim reference-storage — merged.
- Product #1365 — closed false-positive.
- Product #1381 Gill reading-time ledger reconciliation — merged.
- Product #1386 audit-pro ledger reconciliation — merged; Strangler current truth is 3.
- Duplicate Baptist roadmap PRs #1391 and #1400 — closed unmerged; #1395 is sole owner.
