# Control reconciliation — Product main `bc786f4d…`

Date: 2026-08-09  
Mode: AUDIT / consolidation  
AuditRepo base / rollback: `742c37e50e4d6ce8767ab0c45134407ffd0e4585`  
Product verification anchor: `bc786f4da7b6b3e9924caa046a3ab9ba829330fe`  
Product mutation: **none**

## Purpose

Reconcile the active `gb-is-my-strength` MASTER after Product advanced from `80800f6a…` to `bc786f4d…`, while respecting current Product lane ownership. This pass changes active backlog only where current Product evidence materially changes disposition or next action.

## Product anchor and closed work

Current Product `main` is `bc786f4da7b6b3e9924caa046a3ab9ba829330fe`, merge of #1373 `fix(quiz): restore native score and explanation parity`. `SYS-ARTICLE-QUIZ-NATIVE-PARITY` is therefore closed current work and must leave active MASTER.

Two older Lot-related PR references are also not current owners:

- #1389 is closed unmerged after the Bible-corpus provenance/publication boundary blocked that candidate. The unresolved decision remains `SEARCH-P2-07`; there is no active #1389 implementation lane.
- #1339 is closed unmerged as superseded. There is no current Lot publication PR; #1378 and #1401 are independent prerequisites for a later fresh-main publication replay.

## Current open-lane / ancestry audit

Fresh Product compare against `main@bc786f4d…`:

| PR / branch | Relation | Boundary | Control conclusion |
|---|---:|---|---|
| #1378 Lot source resilience | `behind=0` | one Lot sources file | current-main candidate; independent owner |
| #1395 Baptist roadmap authority | `behind=0` | roadmap audit + legacy ledger + existing Shared workflow | current-main candidate; sole Baptist Strangler owner |
| #1401 standalone footer | `behind=1` | shared footer + KDV wrapper + canonical Scripture derivative | ancestry refresh required |
| #1393 Home settled-state audit | `behind=2` | one audit harness file | semantic repair present; ancestry refresh + fresh CI required |
| #1334 Avraam retraction parity | `behind=1` | Avraam source/runtime/route/audit + canonical derivative | Atlas-owned; ancestry refresh required |
| #1402 Baptist media coverage audit | `behind=1` | one read-only audit | separate audit lane; no new MASTER defect by itself |
| #1363 Map scale witness | `behind=2` | one browser-test file | semantically proven earlier; final ancestry refresh required |

Transport #1404 is merged into the Baptist branch and #1405 into the Lot branch. They are ancestry transport, not independent work units.

## Strangler control audit

Current merged Product ledger remains `53` references / `33` dependencies / `3` dependency blockers. The blockers are exactly:

1. `scripts/baptisty-roadmap-audit.js`;
2. `scripts/owner-ui-regression-guard.js`;
3. `scripts/readable-audit.js`.

### Baptist roadmap — #1395

Current head after #1404 is `6a2c14f2bc47a54b30e4ab7a6893704274bfffe0`, `behind=0`, with exactly three changed files.

Control review confirms:

- publication routes derive from existing `series.baseUrl` and `buildPublicSurfaceRegistry()`;
- every declared article requires `status=production-dist` and `routeRole=reading`;
- the old root-HTML publication predicate is removed;
- ledger removes only the Baptist dependency (`33→32`, blockers `3→2`);
- existing Shared Files Guard gains direct syntax check + execution of the roadmap audit.

No assertion weakening was found. Reviews and review threads are empty. The head is not merge-authorized yet because its current Metadata, Deploy Candidate, Node Toolchain, Shared Files Guard and Visual Parity runs remain queued.

### Later protected blockers

Existing branches reserve the other two blockers:

- `agent/owner-ui-reference-authority-20260809`: unique owner-ui repair, currently `behind=2`;
- `agent/readable-audit-reference-authority-20260809`: readable audit + Deploy Candidate contract, currently `behind=2`.

Do not duplicate them. Correct order is Baptist first, then fresh-main reconciliation by the existing owner-ui/readable owners.

## Home #1393 re-verification

The previous MASTER said #1393 still had a transient invalidation-observation race. Current semantic diff has repaired that handoff.

The harness now arms an `input` listener before query mutation, captures the synchronous cleared interactive state, permits legitimate `loading=true`, then separately waits for the exact settled query/title/selection/`aria-activedescendant` state under the unchanged 15 s bound and emits state on failure.

Therefore the remaining #1393 barrier is ancestry/evidence rather than another code-design change: current branch is `behind=2` and must absorb current main normally, then earn fresh exact-head CI.

## Other active MASTER work

This pass does not close the independent roots:

- `LOT-PUBLICATION-READINESS-01`: #1378 and #1401 remain prerequisites; #1339 and #1389 are closed unmerged; Bible corpus authorization remains `SEARCH-P2-07`;
- `AVRAAM-HAMMAM-RETRACTION-PARITY`: remains #1334-owned;
- `SYS-READER-CONTROL-SEMANTICS`, `SYS-FOOTNOTE-SEMANTIC-PROJECTION`, `SYS-SOURCE-AUTHORITY-TRIGGER-CLOSURE`, `SYS-PRODUCT-VISUAL-GOLDENS`, `SYS-MAP-SCALE-RESIZE-WITNESS`: remain active;
- owner decisions `SEARCH-P2-07`, `REG-001`, `NG-VIS-04`: unchanged.

## Consolidation result

Only the merged quiz closure changes active arithmetic:

- active work units: **13 → 12**;
- direct defects: **2 unchanged**;
- system verification lanes: **8 → 7**;
- owner decisions: **3 unchanged**.

MASTER must advance to `bc786f4d…`, remove the quiz row, stop presenting #1389/#1339 as active owners, refresh #1395 and #1393 boundaries, and record #1373 as retired recent work.

No Product branch, code, workflow, issue or PR is mutated by this AuditRepo reconciliation.
