# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT текущей верифицированной нужной работы `gospod-bog.ru`.** Это рабочая очередь, не архив. Решённое / stale / duplicate / absorbed / invalid / superseded удаляется из MASTER в той же consolidation wave; provenance остаётся в `verification/`, `legacy/` и Git history.

Current closure audit: [`../verification/2026-08-10-full-zero-wave-01/REPORT.md`](../verification/2026-08-10-full-zero-wave-01/REPORT.md).

## Current state

| Поле | Значение |
|---|---|
| Product verification anchor | `9e9556a2e0a389b351ea4f0490275128a6eed046` |
| Audit wave | Full-Zero Closure Wave 01, 2026-08-10 |
| Open Product PRs at snapshot | **1** — `#1456` |
| Product remote branches at snapshot | **123** |
| Open Product issues at snapshot | **24** |
| Automated CI-failure lifecycle issues within that set | **10** |
| Active MASTER work units | **2** |
| Closed/stale/absorbed historical rows retained in MASTER | **0** |

The previous MASTER anchor (`bc786f4d…`) is retired. Avraam `#1298`, Home Search `#1299`, Map resize `#1359`, native quiz `#1369`, Strangler `#1383`, and Scripture handoff `#1384` are now closed completed in Product and therefore are not active MASTER rows.

---

## ACTIVE CURRENT WORK — 2

| ID | Status | Required terminal outcome | Current owner / evidence boundary |
|---|---|---|---|
| `LOT-PUBLICATION-CLOSURE` | `fixing` | Publish `/articles/lot-i-sodom/` from current authority, merge the one remaining Product PR after exact-head terminal gates, obtain post-merge/live production witness, then close `#1295`. | Product `#1456` / `release/lot-publication-20260809-r4`. Base is `main@9e9556a2…`; exactly 28 Lot production WebPs are already merged via `#1450`; reader figures and rights-safe Scripture projection are already in main. Do not revive `#1339`, `#1432`, r2/r3 publication predecessors, or create another Lot lane. |
| `SYS-REPOSITORY-CONVERGENCE-CLOSURE` | `systemic-root` | Close the current stabilization owner only after Lot is live, final current-main release evidence is green, no active-lane red remains, stale CI identities are dispositioned, and no branch with release-required unique work is ownerless. Then STOP. | Product `#1403` + Full-Zero Wave 01 report. Branch cleanup is forensic/lifecycle work, not permission to create new Product fixes. Current branch census is 123 with only `main` + `#1456` proven live ownership at snapshot. |

---

## CURRENTLY SOLVED — REMOVED FROM ACTIVE MATRIX

These are intentionally **not** rows anymore:

- `AVRAAM-HAMMAM-RETRACTION-PARITY` / `#1298` — closed completed;
- `SYS-HOME-DESIGN-SEARCH-SETTLED` / `#1299` — closed completed;
- `SYS-MAP-SCALE-RESIZE-WITNESS` / `#1359` — closed completed;
- native article quiz parity / `#1369` — closed completed;
- `SYS-STRANGLER-RETIREMENT` / `#1383` — closed completed;
- Scripture text handoff / `#1384` — closed completed;
- Lot media materialization — merged `#1450`, exactly 28 production WebPs;
- Lot reader figure/content placement — merged `#1418`;
- Home settled-state implementation — merged `#1393`;
- canonical Scripture projection — merged replacement `#1452`.

Detailed provenance remains in Product issues/PRs, Git history and verification packages; solved rows do not remain in the active matrix.

---

## REVERIFY BEFORE PROMOTION — NOT ACTIVE MASTER DEFECTS YET

Fresh Product issue inventory still contains older SYSTEM/content/governance claims. Historical issue text is not enough to call them current after the large closure chain. Later waves must re-check them on fresh post-Lot main before any Product mutation.

Selected reverify set:

- `#1224` — reader control → surface semantics;
- `#1225` — footnote screen/a11y/print projection;
- `#1244` — Source Authority trigger closure;
- `#1247` — machine-distinguishable writer lease;
- `#1249` — protected diff from live merge-base;
- `#1288` — Search title guard vs PageHead authority;
- `#1360` — Baptist provenance-verified media completion;
- `#298` — owner-approved Product visual goldens;
- `#54`, `#1239`, `#1242`, `#1243` — old umbrella/docs/test-health/measurement claims requiring stale-vs-current classification.

Rules for this set:

1. no new branch merely because the issue is open;
2. first prove the current mechanism on then-current `main`;
3. close as stale/absorbed/duplicate if already solved;
4. measurement/polish belongs in `WORK_QUEUE.md` rather than MASTER;
5. only a current verified defect may be promoted into the active matrix and receive one bounded owner.

---

## BRANCH / CI LIFECYCLE FORENSIC

This work supports `SYS-REPOSITORY-CONVERGENCE-CLOSURE`; it is not a parallel Product feature lane.

### Proven live refs

- `main`;
- `release/lot-publication-20260809-r4` while `#1456` remains open.

### High-confidence superseded candidates already identified

- `release/lot-publication-20260809-r3` — predecessor superseded by `#1456`;
- `system/scripture-tooltip-projection-20260809` — semantic work replaced by merged `#1452`;
- `agent/owner-ui-reference-authority-20260809` — former Strangler owner after completed `#1383`;
- `lane/system-favorites-store-20260805` — PR `#1040` explicitly superseded by merged `#1061` despite misleading raw unique ancestry.

Do not delete by `ahead/behind` count alone. For every ref classify semantic successor/unique required work first.

### Stale CI lifecycle examples

Open automated failures bound to superseded identities include r3 Lot publication, old Scripture, old owner-ui and old Favorite Store branches. They are not independent Product bugs and should retire with their dead branch identities after provenance check.

---

## Finite closure order

1. Finish exact-head `#1456`; do not expand scope.
2. Guarded merge + live Lot witness.
3. Close `#1295`.
4. Run one final current-main release/convergence audit.
5. Close `#1403` and stop the stabilization wave.
6. Continue separate branch-cemetery waves: transport/tmp/ci → explicit predecessors/successors → stale agent/system/lane owners → manual-review unique tails → archive authorities.
7. Reverify the non-CI issue set serially; close stale/absorbed claims and repair only truly current defects.
8. When active MASTER reaches zero and branch/issue lifecycle has no unexplained live work, record full-zero closure.

## Stop rule

Do not maximize findings, PR count or audit volume. The target state is:

```text
current work finished
→ evidence verified
→ integrated
→ roots closed
→ stale identities retired
→ MASTER = 0
→ repository understandable
→ STOP
```
