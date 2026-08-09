# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT текущей верифицированной нужной работы `gospod-bog.ru`.** Это рабочая очередь, не архив. Решённое / stale / duplicate / absorbed / invalid / superseded удаляется из MASTER в той же consolidation wave; provenance остаётся в `verification/`, `legacy/` и Git history.

Current post-Search correction: [`../verification/2026-08-09-post-search-merge-audit-correction/REPORT.md`](../verification/2026-08-09-post-search-merge-audit-correction/REPORT.md).  
Current Lot audit: [`../verification/2026-08-09-lot-publication-current-audit/CURRENT_STATUS.md`](../verification/2026-08-09-lot-publication-current-audit/CURRENT_STATUS.md).  
Earlier reconciliation checkpoints remain under `../verification/2026-08-09-current-master-reconciliation/` and the recovered 2026-08-08 reports.

## Current state

| Поле | Значение |
|---|---|
| Product verification anchor | `c389f88ed06eb8e30cebf2a1c4f0d5764c18522f` |
| AuditRepo correction base | `ede56dfbd8800b804b9ea854251ab4032f65b639` |
| Research current head observed | `09b6e1cb2468c72d220a299d9e4cc9af86a09756` |
| Bible-rights decision authority | `d52ea9d54dd2c2488223d25f5f6cefd263c23328` |
| Wave | post-Search owner correction + Lot publication/media/print audit + Strangler/reader/harness roots, 2026-08-09 |
| Active work units | **14** |
| Direct current defects | **2** |
| Verified necessary improvements | **0** |
| Narrowed residuals | **0** |
| System verification lanes | **9** |
| Owner decisions | **3** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

Current Product open-PR census contains **6 PRs mapped to 6 active roots**: **#1371, #1363, #1348, #1339, #1334, #1212**. Shared native quiz root `SYS-ARTICLE-QUIZ-NATIVE-PARITY` is explicitly owned by Product issue **#1369** with no implementation PR at this checkpoint. Search role authority #1313 and reader slice #1267 are merged and do not remain active rows.

---

## CURRENT DEFECTS — 2

| ID | Required repair | Current evidence / owner boundary |
|---|---|---|
| `LOT-PUBLICATION-READINESS-01` | Finish the strict-native Lot publication transaction without weakening route/source/browser/print contracts. | Product issue **#1295**, publication PR **#1339@189dfdd…**. Fresh compare from current Product `main@c389f88…` shows **behind=8 / ahead=10**. Current verified route/content/media residuals include: missing JSON-LD `#website`; normal H2 `#sec-map-connection` absent from TOC; required Scripture refs still plain text instead of canonical `.bref > .btip`; Journey SVG omits the narrated Egypt-return segment; semantic SVG labels collapse to ~3.9–4.2 CSS px at 390px; Lot quiz content has 6/8 under-depth `full` explanations and filler distractors; two already-cited Scientific Reports critiques lack direct primary links; Numayra annotation needs the narrowed 1977-vs-1979–1983 clarification; media remains 9 rendered registry-backed figures + 5 reserves while #1339 still declares 14; dedicated media bytes/OG are not yet release evidence; and **`LOT-MEDIA-REVEAL-PRINT-01`** proves current placement wraps semantic figures in hidden-base `.reveal` while view timelines are inactive in paged media and no generic print visibility override exists, so accepted Lot figures require explicit print/PDF visibility proof. Human reachability remains absorbed by `CATALOG-PROJECTION-01`; Search role writer authority is now merged and Lot must regenerate derived Search/RSS/sitemap after refresh. Full current evidence: [`CURRENT_STATUS`](../verification/2026-08-09-lot-publication-current-audit/CURRENT_STATUS.md) and [`post-Search correction`](../verification/2026-08-09-post-search-merge-audit-correction/REPORT.md). |
| `AVRAAM-HAMMAM-RETRACTION-PARITY` | Make every Avraam/Tall el-Hammam reader projection reflect the 2025 retraction boundary without turning retraction into proof of another Sodom identification. | Product issue **#1298**, draft PR **#1334** owns static fallback + audit. Its own source audit found the remaining `route.json` science-variant citation/note that still references the 2021 paper without a retraction marker. Keep this separate from Lot source/publication and shared MapEngine. |

---

## VERIFIED NECESSARY IMPROVEMENTS — 0

No standalone current row. Historical `AR-IDX-05` and `AUDIT-JS-ESCAPER-DUP-X5` remain explicit reverify-before-promotion candidates in `WORK_QUEUE.md`, not mandatory defects.

---

## NARROWED RESIDUALS — 0

No standalone current row. Numayra remains a narrowed source-annotation nuance inside the consolidated Lot publication transaction rather than a second MASTER work unit.

---

## SYSTEM VERIFICATION LANES — 9

| ID | Verified work package | Current boundary / owner |
|---|---|---|
| `CATALOG-PROJECTION-01` | Replace the hand-maintained `/articles/` membership/metadata owner with an exhaustive projection from publication/discovery authority while preserving truthful author/editor/translator attribution. | Draft **#1348@b526a175…** is now based on current `main@c389f88…`; fresh compare is **behind=0 / ahead=13** with six semantic files including the deterministic Scripture derivative. Direct source read proves role-aware consumer logic already exists: distinct optional author/editor/translator inputs, truthful `Автор-редактор` collapse, author-only and translation/editor fixtures, and fail-closed owner-sensitive incomplete-role cases. The current barrier is final exact-head catalog/publication evidence, not reimplementing Search role semantics. This root absorbs Lot human-orphan reachability; no one-off Lot card. |
| `SYS-ARTICLE-QUIZ-NATIVE-PARITY` | Restore the accepted native article quiz score/result/explanation contract at the shared renderer/schema layer. | Product issue **#1369** is the current SYSTEM owner. Reverified after merged #1267: native renderer exists and materializes `SITE_CONFIG.quiz`; false-positive #1365 is closed `not_planned`. Real defects remain: result selection assumes `{min,max}` while accepted configs use ordered `min` thresholds; configured badge projection is dropped; structured feedback uses `short || full`, hiding distinct full teaching explanations. Do not patch Lot data to hide the shared regression. Evidence: Lot `NATIVE_QUIZ_SCORE_CONTRACT.md`, `NATIVE_QUIZ_EXPLANATION_PARITY.md`, and [`post-Search correction`](../verification/2026-08-09-post-search-merge-audit-correction/REPORT.md). |
| `SYS-READER-CONTROL-SEMANTICS` | Enforce truthful control→surface/action semantics across standalone/shared readers with one class-level browser census. | Product issue **#1224** remains root. Bounded slices #1258/#1259/#1267 are merged and retired as separate owners. Audit-only **#1212@06c2b8e…** remains the all-reading-route census and is stale by ancestry; refresh/calibrate the harness without weakening assertions simply because real Product defects make it red. |
| `SYS-FOOTNOTE-SEMANTIC-PROJECTION` | Make numbered/source footnotes first-class publication notes with one identity and truthful screen/accessibility/print projections. | Product issue **#1225** remains open. Current mechanism still embeds note bodies in tooltip UI while print hides tooltip surfaces; closure must preserve popup UX while adding unique trigger↔note semantics and deterministic print completeness. Evidence: [`TOTAL AUDIT / CURRENT GOLD`](../verification/2026-08-08-total-current-gold-audit/REPORT.md). |
| `SYS-SOURCE-AUTHORITY-TRIGGER-CLOSURE` | Make Source Authority workflow applicability fail closed against the complete source surface consumed by static-publication validation. | Product issue **#1244** remains open. Merged #1245/#1260 repaired concrete Baptist paths/internal-path leakage, but SYSTEM DoD remains authority-derived PR+push trigger closure with adversarial mutations rather than an ad-hoc path list. Evidence: [`TOTAL AUDIT / CURRENT GOLD`](../verification/2026-08-08-total-current-gold-audit/REPORT.md). |
| `SYS-STRANGLER-RETIREMENT` | Retire/quarantine retained legacy references only through logical storage authority, with truthful blocker arithmetic and no physical move/delete before authorization. | Current main still has truthful readiness **12** after merged #1364. Current replay owner is **#1371@346776b2…**, created directly from `main@c389f88…` after #1313, with exactly four intended visual-parity/reference-storage files and expected effect **12 → 11**. #1367/#1370 are superseded replay history, not current owners. Expected post-merge classes: 1 mechanical `gill-reading-time` reader (inside #1348), 3 obsolete legacy-audit readers, 7 owner decisions. Physical move/delete remains unauthorized. Evidence: [`post-Search correction`](../verification/2026-08-09-post-search-merge-audit-correction/REPORT.md). |
| `SYS-HOME-DESIGN-SEARCH-SETTLED` | Make Home Design Audit Pro wait on observable canonical Search state and emit diagnostic state on timeout instead of using a hard-coded heading taxonomy. | Product issue **#1299** remains open. Canonical Search Modal has been green while Home Design timed out after otherwise healthy runs. Required repair is diagnostic/regression first; do not increase timeout or delete assertions. Evidence: [`2026-08-09 reconciliation`](../verification/2026-08-09-current-master-reconciliation/REPORT.md). |
| `SYS-PRODUCT-VISUAL-GOLDENS` | Add owner-approved product goldens that detect common-mode regressions beyond legacy↔dist migration parity. | Product issue **#298** remains open P1. #1371 improves retained-reference source resolution for the existing migration-parity contract; it does **not** close the immutable product-state golden blind spot. Evidence: [`TOTAL AUDIT / CURRENT GOLD §20`](../verification/2026-08-08-total-current-gold-audit/REPORT.md). |
| `SYS-MAP-SCALE-RESIZE-WITNESS` | Make the Map scale resize browser witness measure settled runtime geometry rather than an intermediate CSS-transition frame. | Draft **#1363@9f85b76…** remains the one-file harness repair. Runtime already recomputes from rendered canvas width; the old witness sampled at 120ms during a `.3s` transition. Preserve the same ≤2.5px invariant with bounded convergence; refresh from current main and re-earn exact-head CI before merge. |

---

## OWNER DECISIONS — 3

| ID | Missing decision / evidence |
|---|---|
| `SEARCH-P2-07` | Exact licensed/provenanced Bible corpus acquisition/import/publication boundary. Binding Research authority remains `d52ea9d5…`: CrossWire `RusSynodal` 1.9.1 is candidate-only pending archive bytes/SHA-256/licence+book manifest/66-book mapping/import receipt; `RusSynodalLIO` and Cassian restrictions remain fail-closed. |
| `REG-001` | Hosting/proxy decision for response-level CSP / X-Frame / Referrer / Permissions headers, or explicit accepted-risk disposition. Recheck hosting authority immediately before implementation. |
| `NG-VIS-04` | Author/editor decision whether dense Nagornaya table/card material should be rewritten into more prose/air. This is editorial authority, not permission for an implementation agent to redesign unilaterally. |

---

## Consolidation / collision order

1. **Do not take over Lot Product files from AuditRepo.** #1339 remains publication owner; AuditRepo records closure requirements.
2. #1313 Search writer root is merged/retired. #1348 has absorbed current main and role-aware consumption; finish its exact-head catalog barrier, then replay #1339 and canonically regenerate its derived discovery artifacts.
3. #1371 is the current Strangler mechanical slice only; #1367/#1370 are superseded history.
4. #1212 remains the current reader census under #1224; merged #1267 is closure history.
5. #1369 owns shared native quiz parity; #1365 is closed false-positive and must not be resurrected.
6. #1334 stays Atlas-owned; Lot must not absorb route-data parity.
7. #1363 is an audit-harness repair, not MapEngine runtime mutation.
8. Any Product or AuditRepo main movement invalidates final exact-head merge authority for the affected lane; refresh/reprove rather than carrying stale greens.

## Retired in this wave

No retired item remains active. In addition to earlier retired rows, **`SEARCH-MANIFEST-NEW-ROW-ROLE-AUTHORITY` / #1313 is now merged and removed from current work**. Product #1365 is explicitly closed as a quiz audit false positive; #1369 is the real shared quiz root. Strangler #1367/#1370 are superseded replay vehicles; #1371 is the current owner.