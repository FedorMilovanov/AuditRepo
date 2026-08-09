# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT текущей верифицированной нужной работы `gospod-bog.ru`.** Это рабочая очередь, не архив. Решённое / stale / duplicate / absorbed / invalid / superseded удаляется из MASTER в той же consolidation wave; provenance остаётся в `verification/`, `legacy/` и Git history.

Current reconciliation: [`../verification/2026-08-09-current-master-reconciliation/REPORT.md`](../verification/2026-08-09-current-master-reconciliation/REPORT.md).  
Post-reconciliation Product movement: [`../verification/2026-08-09-current-master-reconciliation/LIVE_DELTA.md`](../verification/2026-08-09-current-master-reconciliation/LIVE_DELTA.md).  
Current Lot audit: [`../verification/2026-08-09-lot-publication-current-audit/CURRENT_STATUS.md`](../verification/2026-08-09-lot-publication-current-audit/CURRENT_STATUS.md).  
Recovered disposition history from AuditRepo #264 is preserved in the dated 2026-08-08 reconciliation reports under `../verification/`.

## Current state

| Поле | Значение |
|---|---|
| Product verification anchor | `1b05bf1f99f45d9dcf22e453f28dff2a68a304fa` |
| AuditRepo reconciliation base | `a8283267ae0810b8d8c91c3dd7981dd001a1da06` |
| Research current head observed | `09b6e1cb2468c72d220a299d9e4cc9af86a09756` |
| Bible-rights decision authority | `d52ea9d54dd2c2488223d25f5f6cefd263c23328` |
| Wave | current-owner reconciliation + Lot publication audit + Strangler retirement + reader/audit-harness roots, 2026-08-09 |
| Active work units | **15** |
| Current bounded/content defects | **2** |
| System/root-cause work units | **10** |
| Owner decisions | **3** |
| Closed/stale/duplicate rows intentionally retained in MASTER | **0** |

The current Product census contains **8 open PRs mapped to 7 active work roots**: **#1367, #1363, #1348, #1339, #1334, #1313, #1267, #1212**. PRs #1267 and #1212 intentionally share the same reader SYSTEM root. Every current open PR is represented below either directly or through its owning SYSTEM row; no duplicate symptom row is required.

---

## CURRENT BOUNDED / CONTENT DEFECTS — 2

| ID | Required repair | Current evidence / owner boundary |
|---|---|---|
| `LOT-PUBLICATION-READINESS-01` | Finish the strict-native Lot publication transaction without weakening route/source/browser contracts. | Product issue **#1295**, publication PR **#1339@189dfdd…**. Current verified residual package includes: missing JSON-LD `#website`; one normal H2 (`#sec-map-connection`) absent from TOC; required Scripture refs still plain text instead of canonical `.bref > .btip`; Journey SVG omits the narrated Egypt-return segment; both semantic SVGs collapse meaningful labels to ~3.9–4.2 CSS px at 390px; Lot quiz content has 6/8 under-depth `full` explanations and filler distractors; direct links are missing for two already-cited Scientific Reports critiques; Numayra annotation needs a narrowed 1977-vs-1979–1983 clarification; media/OG remains in-flight rather than 14/14 release-ready. Human reachability is **absorbed by `CATALOG-PROJECTION-01`** and Search-role drift by `SEARCH-MANIFEST-NEW-ROW-ROLE-AUTHORITY`; do not duplicate them as Lot-only hacks. Fresh compare from Product `main@1b05bf1f…` shows #1339 **behind=6 / ahead=10**, so prior greens are historical until replay. Full evidence: [`CURRENT_STATUS`](../verification/2026-08-09-lot-publication-current-audit/CURRENT_STATUS.md). |
| `AVRAAM-HAMMAM-RETRACTION-PARITY` | Make every Avraam/Tall el-Hammam reader projection reflect the 2025 retraction boundary without turning retraction into proof of another Sodom identification. | Product issue **#1298**, draft PR **#1334** owns static fallback + audit. Its own fresh audit found a remaining `route.json` science-variant citation/note that still references the 2021 paper without a retraction marker. Keep this separate from Lot source/publication work and from shared MapEngine. |

---

## SYSTEM / ROOT-CAUSE WORK — 10

| ID | Required system outcome | Current boundary / owner |
|---|---|---|
| `CATALOG-PROJECTION-01` | Replace the hand-maintained `/articles/` membership/metadata owner with an exhaustive projection from existing publication/discovery authority, preserving truthful author/editor/translator roles. | Clean successor **#1348@ac48467d…** owns the catalog source/audits plus deterministic Scripture derivative and remains intentionally downstream of #1313. Fresh compare after #1364 merged shows **behind=1** with unchanged six-file semantic delta; final authority must be re-earned after refresh. This root absorbs Lot human-orphan `55/56`; no one-off Lot card. Old #1221/#1305 are historical predecessors, not owners. |
| `SEARCH-MANIFEST-NEW-ROW-ROLE-AUTHORITY` | Make newly materialized Search rows preserve distinct author/editor/translator authority and never infer editor from meta-author. | Product issue **#1261**, draft PR **#1313@7a8ef56d…**. Regression-first proof demonstrated old `author=undefined` / synthesized editor behavior. The branch has already absorbed `main@1b05bf1f…`; after merge #1348 and #1339 must absorb the new authority and rematerialize derived projections canonically. |
| `SYS-ARTICLE-QUIZ-NATIVE-PARITY` | Restore the accepted native article quiz contract at the shared renderer/schema layer, not through Lot-only patches. | Lot audit proved two manifestations with one migration owner: (1) result tiers are matched as `{min,max}` while accepted configs use ordered `min` thresholds, so Lot named tiers always fall back to generic score; configured badge is also ignored; (2) native renderer uses `short || full`, suppressing the distinct full teaching explanation whenever short exists. All 8 Lot questions are affected by the second manifestation. Preserve the separately closed fact that Lot quiz **does render**. Evidence: `NATIVE_QUIZ_SCORE_CONTRACT.md` + `NATIVE_QUIZ_EXPLANATION_PARITY.md` under the Lot verification package. |
| `SYS-READER-CONTROL-SEMANTICS` | Enforce truthful control→surface/action semantics across standalone and shared-series engines with one class-level browser census. | Product issue **#1224** remains root. Merged #1258/#1259 are retired slices. Current bounded residual **#1267@8ca4a24d…** gates `panelQuiz` with `tabQuiz` for `quiz: []` and has absorbed `main@1b05bf1f…`; fresh exact-head CI remains its merge authority. Audit-only **#1212@06c2b8e…** remains the all-reading-route census and is substantially stale by ancestry; it must stay diagnostic/fail-closed rather than weakening assertions to become green. |
| `SYS-FOOTNOTE-SEMANTIC-PROJECTION` | Make numbered/source footnotes first-class publication notes with one source identity and truthful screen + accessibility + print projections. | Product issue **#1225** remains open. Current source/runtime/print mechanism is still the reason: note body lives inside tooltip UI, repeated markers can share generic names, reader projection excludes note UI, and print hides `.tooltip`. Closure must preserve popup UX while producing unique trigger↔note semantics and deterministic print note completeness from one source. |
| `SYS-SOURCE-AUTHORITY-TRIGGER-CLOSURE` | Make Source Authority workflow applicability fail closed against the complete source surface consumed by static-publication validation. | Product issue **#1244** remains open. Merged #1245/#1260 proved concrete Baptist paths now trigger and the `_app/index.html` leak class can be guarded, but the SYSTEM DoD is broader: derive trigger closure from actual authority, mutation-test representative protected source changes, and prove both PR and push applicability rather than accumulating ad-hoc path lists. |
| `SYS-STRANGLER-RETIREMENT` | Retire/quarantine retained legacy references only through the logical storage authority, with truthful blocker arithmetic and no physical move/delete before authorization. | Product **#1364 is merged** as current `main@1b05bf1f…`, advancing truthful readiness **13 → 12**. New draft **#1367@e48779a…** owns the next bounded mechanical slice: resolve visual-parity retained-reference reads through ledger authority and permanently execute the production visual-parity contract; expected effect **12 → 11**. #1367 reports expected post-merge classes: 1 mechanical (`gill-reading-time`, in #1348), 3 obsolete legacy audits, 7 owner-decision blockers. Physical legacy move/delete remains unauthorized. |
| `SYS-HOME-DESIGN-SEARCH-SETTLED` | Make Home Design Audit Pro wait on observable canonical Search state and emit diagnostic state on timeout instead of using a hard-coded heading taxonomy. | Product issue **#1299** remains open. Canonical Search Modal has been green while Home Design repeatedly timed out after otherwise healthy runs. Required repair is diagnostic/regression first; do not increase timeout or delete selection/result assertions. |
| `SYS-PRODUCT-VISUAL-GOLDENS` | Add owner-approved product goldens that detect common-mode regressions beyond current legacy↔dist migration parity. | Product issue **#298** remains open P1. Keep migration parity, but add immutable/read-only normal-PR goldens selected from public capability authority and explicit owner-approved update mode. Removing the same element from legacy and dist must still make product-golden validation red. |
| `SYS-MAP-SCALE-RESIZE-WITNESS` | Make the Map scale resize browser witness measure settled runtime geometry rather than an intermediate CSS transition frame. | Draft **#1363@9f85b76…** changes only `scripts/map-engine-correctness-browser-test.mjs`. Fresh compare after #1364 merged shows **behind=1**; mechanism remains the same: old fixed 120ms sleep sampled a `.3s` width transition while runtime already recomputed from rendered canvas width. New bounded convergence wait must preserve the same ≤2.5px invariant and re-earn exact-head CI after refresh. |

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
4. #1267 remains the bounded reader repair; #1212 is the class-level census. A red audit caused by a real Product defect is evidence, not a reason to weaken the census.
5. #1334 stays Atlas-owned. The Lot article may link to the Atlas, but must not absorb its route-data repair.
6. #1363 is an audit-harness repair, not MapEngine runtime mutation.
7. Any main/head movement invalidates final merge authority for the affected Product branch; recheck exact ancestry + final CI at merge time.

## Retired in this wave

No retired item remains as an active row. Details are preserved in the reconciliation reports. In particular: `BAPT-S12-01` (#1260), Search existing-row reconciliation (#1254 / 46→0), Editorial pre-merge freeze (#1272/#1278), Gill Part I glossary residuals (#1283), reader slices #1258/#1259, old catalog predecessors #1221/#1305, the hidden Strangler self-verifier defect (#1270), merged Strangler slice #1364, and the Lot “quiz does not render” false positive are **not active MASTER work**.
