# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT текущей верифицированной нужной работы `gospod-bog.ru`.** Это рабочая очередь, не архив. Решённое / stale / duplicate / absorbed / invalid / superseded удаляется из MASTER в той же consolidation wave; provenance остаётся в `verification/`, `legacy/` и Git history.

Current reconciliation: [`../verification/2026-08-09-current-master-reconciliation/REPORT.md`](../verification/2026-08-09-current-master-reconciliation/REPORT.md).  
Post-reconciliation Product movement: [`../verification/2026-08-09-current-master-reconciliation/LIVE_DELTA.md`](../verification/2026-08-09-current-master-reconciliation/LIVE_DELTA.md).  
Current Lot audit: [`../verification/2026-08-09-lot-publication-current-audit/CURRENT_STATUS.md`](../verification/2026-08-09-lot-publication-current-audit/CURRENT_STATUS.md).  
Recovered disposition history from AuditRepo #264 is preserved in the dated 2026-08-08 reconciliation reports under `../verification/`.

## Current state

| Поле | Значение |
|---|---|
| Product verification anchor | `3c7b3c199dcf3d2464f38a55550d730a3279c171` |
| AuditRepo reconciliation base | `a8283267ae0810b8d8c91c3dd7981dd001a1da06` |
| Research current head observed | `09b6e1cb2468c72d220a299d9e4cc9af86a09756` |
| Bible-rights decision authority | `d52ea9d54dd2c2488223d25f5f6cefd263c23328` |
| Wave | current-owner reconciliation + Lot publication audit + Strangler retirement + reader/audit-harness roots, 2026-08-09 |
| Active work units | **15** |
| Direct current defects | **2** |
| Verified necessary improvements | **0** |
| Narrowed residuals | **0** |
| System verification lanes | **10** |
| Owner decisions | **3** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

The current Product census contains **7 open PRs mapped to 7 active work roots**: **#1367, #1363, #1348, #1339, #1334, #1313, #1212**. Shared native quiz root `SYS-ARTICLE-QUIZ-NATIVE-PARITY` now has explicit Product issue **#1369** but no implementation PR. Every current open PR is represented below through its owning current row; no duplicate symptom row is required.

---

## CURRENT DEFECTS — 2

| ID | Required repair | Current evidence / owner boundary |
|---|---|---|
| `LOT-PUBLICATION-READINESS-01` | Finish the strict-native Lot publication transaction without weakening route/source/browser contracts. | Product issue **#1295**, publication PR **#1339@189dfdd…**. Current verified residual package includes: missing JSON-LD `#website`; one normal H2 (`#sec-map-connection`) absent from TOC; required Scripture refs still plain text instead of canonical `.bref > .btip`; Journey SVG omits the narrated Egypt-return segment; both semantic SVGs collapse meaningful labels to ~3.9–4.2 CSS px at 390px; Lot quiz content has 6/8 under-depth `full` explanations and filler distractors; direct links are missing for two already-cited Scientific Reports critiques; Numayra annotation needs a narrowed 1977-vs-1979–1983 clarification; media/OG remains in-flight rather than 14/14 release-ready. Human reachability is **absorbed by `CATALOG-PROJECTION-01`** and Search-role drift by `SEARCH-MANIFEST-NEW-ROW-ROLE-AUTHORITY`; do not duplicate them as Lot-only hacks. Fresh compare from Product `main@3c7b3c19…` shows #1339 **behind=7 / ahead=10**, so prior greens are historical until replay. Full evidence: [`CURRENT_STATUS`](../verification/2026-08-09-lot-publication-current-audit/CURRENT_STATUS.md). |
| `AVRAAM-HAMMAM-RETRACTION-PARITY` | Make every Avraam/Tall el-Hammam reader projection reflect the 2025 retraction boundary without turning retraction into proof of another Sodom identification. | Product issue **#1298**, draft PR **#1334** owns static fallback + audit. Its own fresh audit found a remaining `route.json` science-variant citation/note that still references the 2021 paper without a retraction marker. Keep this separate from Lot source/publication work and from shared MapEngine. |

---

## VERIFIED NECESSARY IMPROVEMENTS — 0

No standalone current row. Historical `AR-IDX-05` and `AUDIT-JS-ESCAPER-DUP-X5` were not freshly reverified in this wave and are now explicit reverify-before-promotion candidates in `WORK_QUEUE.md`, not mandatory defects.

---

## NARROWED RESIDUALS — 0

No standalone current row. The narrowed Numayra source-annotation nuance remains evidence inside the consolidated `LOT-PUBLICATION-READINESS-01` transaction rather than inflating MASTER with a second Lot symptom row.

---

## SYSTEM VERIFICATION LANES — 10

| ID | Verified work package | Current boundary / owner |
|---|---|---|
| `CATALOG-PROJECTION-01` | Replace the hand-maintained `/articles/` membership/metadata owner with an exhaustive projection from existing publication/discovery authority, preserving truthful author/editor/translator roles. | Clean successor **#1348@ac48467d…** owns the catalog source/audits plus deterministic Scripture derivative and remains intentionally downstream of #1313. Fresh compare from `main@3c7b3c19…` shows **behind=2 / ahead=9** with unchanged six-file semantic delta; final authority must be re-earned after role-authority merge + ancestry refresh. This root absorbs Lot human-orphan `55/56`; no one-off Lot card. Old #1221/#1305 are historical predecessors, not owners. |
| `SEARCH-MANIFEST-NEW-ROW-ROLE-AUTHORITY` | Make newly materialized Search rows preserve distinct author/editor/translator authority and never infer editor from meta-author. | Product issue **#1261**, draft PR **#1313@7a8ef56d…**. Regression-first proof demonstrated old `author=undefined` / synthesized editor behavior. Fresh compare from `main@3c7b3c19…` shows **behind=1** with exactly the intended three Search authority files; #1267 moved main after the branch's last refresh. After #1313 merges, #1348 and #1339 must absorb the new authority and rematerialize derived projections canonically. |
| `SYS-ARTICLE-QUIZ-NATIVE-PARITY` | Restore the accepted native article quiz contract at the shared renderer/schema layer, not through Lot-only patches. | Product issue **#1369** is the current SYSTEM owner. Reverified on exact `main@3c7b3c19…`: native result selection still requires `{min,max}` while accepted configs use ordered `min` thresholds, so Lot named tiers fall back to generic score and configured `badge` is ignored; structured feedback still uses `short || full`, suppressing the distinct full teaching explanation whenever short exists (all 8 Lot questions). The separately disproved fact “Lot quiz does not render” remains closed. Evidence: `NATIVE_QUIZ_SCORE_CONTRACT.md` + `NATIVE_QUIZ_EXPLANATION_PARITY.md` under the Lot verification package. |
| `SYS-READER-CONTROL-SEMANTICS` | Enforce truthful control→surface/action semantics across standalone and shared-series engines with one class-level browser census. | Product issue **#1224** remains root. Merged #1258/#1259 and now **#1267 (`3c7b3c19…`)** are retired bounded slices, not current PR owners. #1224 Definition of Done remains broader (standalone Menu/Search split, list semantics, remaining control relations/part-TOC relations and complete browser proof). Audit-only **#1212@06c2b8e…** remains the all-reading-route census and is substantially stale by ancestry; it must be refreshed/calibrated as a fail-closed guard rather than weakened because a Product defect makes it red. |
| `SYS-FOOTNOTE-SEMANTIC-PROJECTION` | Make numbered/source footnotes first-class publication notes with one source identity and truthful screen + accessibility + print projections. | Product issue **#1225** remains open. Current source/runtime/print mechanism is still the reason: note body lives inside tooltip UI, repeated markers can share generic names, reader projection excludes note UI, and print hides `.tooltip`. Closure must preserve popup UX while producing unique trigger↔note semantics and deterministic print note completeness from one source. |
| `SYS-SOURCE-AUTHORITY-TRIGGER-CLOSURE` | Make Source Authority workflow applicability fail closed against the complete source surface consumed by static-publication validation. | Product issue **#1244** remains open. Merged #1245/#1260 proved concrete Baptist paths now trigger and the `_app/index.html` leak class can be guarded, but the SYSTEM DoD is broader: derive trigger closure from actual authority, mutation-test representative protected source changes, and prove both PR and push applicability rather than accumulating ad-hoc path lists. Current recheck: [`2026-08-09 reconciliation`](../verification/2026-08-09-current-master-reconciliation/REPORT.md). Mechanism evidence: [`TOTAL AUDIT / CURRENT GOLD`](../verification/2026-08-08-total-current-gold-audit/REPORT.md). |
| `SYS-STRANGLER-RETIREMENT` | Retire/quarantine retained legacy references only through the logical storage authority, with truthful blocker arithmetic and no physical move/delete before authorization. | Product #1364 is merged and truthful readiness remains **12**. Draft **#1367@590c06d…** owns the next bounded mechanical slice: resolver-backed production visual-parity reads + permanent production-contract execution; expected effect **12 → 11**. Fresh compare after merged #1267 shows #1367 **behind=1** with the intended four-file delta, so earlier exact-head greens are historical until refresh. Expected post-merge classes remain 1 mechanical (`gill-reading-time`, in #1348), 3 obsolete legacy audits, 7 owner-decision blockers. Physical legacy move/delete remains unauthorized. |
| `SYS-HOME-DESIGN-SEARCH-SETTLED` | Make Home Design Audit Pro wait on observable canonical Search state and emit diagnostic state on timeout instead of using a hard-coded heading taxonomy. | Product issue **#1299** remains open. Canonical Search Modal has been green while Home Design repeatedly timed out after otherwise healthy runs. Required repair is diagnostic/regression first; do not increase timeout or delete selection/result assertions. Current evidence/owner recheck: [`2026-08-09 reconciliation`](../verification/2026-08-09-current-master-reconciliation/REPORT.md); Product #1299 retains the exact reproduced timeout/state contract. |
| `SYS-PRODUCT-VISUAL-GOLDENS` | Add owner-approved product goldens that detect common-mode regressions beyond current legacy↔dist migration parity. | Product issue **#298** remains open P1. Keep migration parity, but add immutable/read-only normal-PR goldens selected from public capability authority and explicit owner-approved update mode. Removing the same element from legacy and dist must still make product-golden validation red. Current recheck: [`2026-08-09 reconciliation`](../verification/2026-08-09-current-master-reconciliation/REPORT.md). Mechanism evidence: [`TOTAL AUDIT / CURRENT GOLD §20`](../verification/2026-08-08-total-current-gold-audit/REPORT.md). |
| `SYS-MAP-SCALE-RESIZE-WITNESS` | Make the Map scale resize browser witness measure settled runtime geometry rather than an intermediate CSS transition frame. | Draft **#1363@9f85b76…** changes only `scripts/map-engine-correctness-browser-test.mjs`. Fresh compare from `main@3c7b3c19…` shows **behind=2 / ahead=3**; mechanism remains the same: old fixed 120ms sleep sampled a `.3s` width transition while runtime already recomputed from rendered canvas width. New bounded convergence wait must preserve the same ≤2.5px invariant and re-earn exact-head CI after refresh. |

---

## OWNER DECISIONS — 3

| ID | Missing decision / evidence |
|---|---|
| `SEARCH-P2-07` | Exact licensed/provenanced Bible corpus acquisition/import/publication boundary. Research has advanced beyond the rights decision in unrelated Heart work, but the binding corpus-rights authority remains merge `d52ea9d5…`: CrossWire `RusSynodal` 1.9.1 is candidate-only pending archive bytes/SHA-256/licence+book manifest/66-book mapping/import receipt; `RusSynodalLIO` and Cassian restrictions remain fail-closed. |
| `REG-001` | Hosting/proxy decision for response-level CSP / X-Frame / Referrer / Permissions headers, or explicit accepted-risk disposition. No closure evidence was found in this wave; recheck hosting authority immediately before implementation. |
| `NG-VIS-04` | Author/editor decision whether dense Nagornaya table/card material should be rewritten into more prose/air. This is an editorial decision, not permission for an implementation agent to redesign the route unilaterally. |

---

## Consolidation / collision order

1. **Do not touch Lot Product files from AuditRepo.** #1339 remains publication owner; Lot audit rows describe required closure, not a competing implementation lane.
2. #1313 role authority → #1348 catalog consumer → replay #1339 publication/discovery on the resulting main.
3. #1367 is the current Strangler mechanical slice only; do not combine it with Lot, reader or Search work.
4. #1212 is the current class-level reader census under #1224. Merged #1267 is evidence/closure history, not an active collision owner.
5. #1369 owns shared native quiz parity. Do not hide it with Lot-only config changes.
6. #1334 stays Atlas-owned. The Lot article may link to the Atlas, but must not absorb its route-data repair.
7. #1363 is an audit-harness repair, not MapEngine runtime mutation.
8. Any main/head movement invalidates final merge authority for the affected Product branch; recheck exact ancestry + final CI at merge time.

## Retired in this wave

No retired item remains as an active row. Details are preserved in the reconciliation reports. In particular: `BAPT-S12-01` (#1260), Search existing-row reconciliation (#1254 / 46→0), Editorial pre-merge freeze (#1272/#1278), Gill Part I glossary residuals (#1283), reader slices #1258/#1259/**#1267**, old catalog predecessors #1221/#1305, the hidden Strangler self-verifier defect (#1270), merged Strangler slice #1364, and the Lot “quiz does not render” false positive are **not active MASTER work**.
