# Control reconciliation — Product main `bc786f4d…`

Date: 2026-08-09  
Mode: AUDIT / consolidation  
AuditRepo base / rollback: `742c37e50e4d6ce8767ab0c45134407ffd0e4585`  
Product verification anchor: `bc786f4da7b6b3e9924caa046a3ab9ba829330fe`  
Product mutation: **none**

## Purpose

Reconcile the active `gb-is-my-strength` MASTER after Product advanced from `80800f6a…` to `bc786f4d…`, while respecting current Product lane ownership. This pass is intentionally not a generic HEAD mirror: it changes active backlog only where current Product evidence materially changes disposition or next action.

## Current Product anchor

Current Product `main` is `bc786f4da7b6b3e9924caa046a3ab9ba829330fe`, merge of #1373 `fix(quiz): restore native score and explanation parity`.

Therefore `SYS-ARTICLE-QUIZ-NATIVE-PARITY` is no longer active work. Product #1373 is merged and its commit message records terminal green Native, Runtime Interactive, Shared, Node, Metadata, Deploy, Visual and Glossary gates. The row must leave active MASTER rather than remain as historical backlog.

## Current open-lane / ancestry audit

Fresh Product compare against `main@bc786f4d…`:

| PR / branch | Current relation to main | Semantic boundary | Control conclusion |
|---|---:|---|---|
| #1378 Lot source resilience | `behind=0` | one Lot sources file | current-main candidate; independent owner |
| #1395 Baptist roadmap authority | `behind=0` | roadmap audit + legacy ledger + existing Shared workflow | current-main candidate; sole Baptist Strangler owner |
| #1401 standalone footer | `behind=1` | shared footer + KDV wrapper + canonical Scripture derivative | ancestry refresh required before merge authority |
| #1393 Home settled-state audit | `behind=2` | one audit harness file | semantic repair present; ancestry refresh + fresh exact-head CI required |
| #1334 Avraam retraction parity | `behind=1` | Avraam source/runtime/route/audit + canonical derivative | Atlas-owned; ancestry refresh required |
| #1402 Baptist media coverage audit | `behind=1` | one new read-only audit | separate audit lane; does not create a new MASTER defect by itself |
| #1363 Map scale witness | `behind=2` | one browser-test file | semantically proven earlier; final ancestry refresh still required |

Transport PR #1404 is merged into the Baptist branch and #1405 is merged into the Lot branch. They are ancestry transport, not independent Product work units.

## Strangler control audit

Current merged Product ledger still reports:

- references: `53`;
- dependencies: `33`;
- dependency unknown blockers: `3`.

The three blockers are exactly:

1. `scripts/baptisty-roadmap-audit.js`;
2. `scripts/owner-ui-regression-guard.js`;
3. `scripts/readable-audit.js`.

### Baptist roadmap — #1395

Current #1395 head after merged transport #1404 is `6a2c14f2bc47a54b30e4ab7a6893704274bfffe0`, `behind=0`, with exactly three changed files.

Diff review confirms the intended authority repair:

- publication truth comes from existing `series.baseUrl` + `buildPublicSurfaceRegistry()`;
- every declared Baptist article must resolve with `status=production-dist` and `routeRole=reading`;
- the old root `baptisty-rossii/<slug>/index.html` publication predicate is removed;
- ledger removes only the Baptist dependency row (`33→32`, blocker count `3→2`);
- existing Shared Files Guard gains direct `node --check` + execution for the roadmap audit.

No assertion weakening was found in this control review. Reviews and review threads are empty.

However this head is **not merge-authorized yet**: Metadata, Deploy Candidate, Node Toolchain, Shared Files Guard and Visual Parity exact-head runs are currently queued. Earlier green heads remain mechanism evidence only.

### Later protected blockers

Existing branches reserve the remaining two blockers:

- `agent/owner-ui-reference-authority-20260809` — unique `scripts/owner-ui-regression-guard.js` repair, currently `behind=2`;
- `agent/readable-audit-reference-authority-20260809` — unique `scripts/readable-audit.js` + Deploy Candidate contract repair, currently `behind=2`.

Do not open competing owners. Correct serial order remains Baptist merge first, then fresh-main reconciliation of owner-ui/readable by their existing owners.

## Home #1393 re-verification

The previous MASTER wording said #1393 still had a transient invalidation-observation race. Current PR code has moved past that handoff.

Current `scripts/home-design-audit-pro.mjs` now:

- installs an `input` listener before `fill()` / rapid typing;
- captures the post-runtime synchronous input-dispatch state;
- requires stale options, selection and `aria-activedescendant` to be cleared for the exact query;
- explicitly allows `loading=true` after that invalidation;
- separately waits for a settled state with exact input, non-loading result, expected title where applicable, exactly one selected option and a matching real `aria-activedescendant`;
- keeps the original 15 s bound and emits state on failure.

Therefore the previously recorded race is **repaired in the current semantic diff**. The remaining barrier is ancestry/evidence, not another code design change: #1393 is `behind=2` and must absorb current main normally, then earn fresh exact-head CI.

## Other active MASTER work

This reconciliation does not close or broaden the independent current roots:

- `LOT-PUBLICATION-READINESS-01` remains open; quiz parity is now merged, while #1378 and #1401 remain owned publication prerequisites and #1389 remains rights-blocked;
- `AVRAAM-HAMMAM-RETRACTION-PARITY` remains #1334-owned;
- `SYS-READER-CONTROL-SEMANTICS`, `SYS-FOOTNOTE-SEMANTIC-PROJECTION`, `SYS-SOURCE-AUTHORITY-TRIGGER-CLOSURE`, `SYS-PRODUCT-VISUAL-GOLDENS`, and `SYS-MAP-SCALE-RESIZE-WITNESS` remain active;
- owner decisions `SEARCH-P2-07`, `REG-001`, and `NG-VIS-04` remain unchanged.

## Consolidation result

Active MASTER arithmetic should change only by the merged quiz closure:

- active work units: **13 → 12**;
- direct current defects: **2 unchanged**;
- system verification lanes: **8 → 7**;
- owner decisions: **3 unchanged**.

Required MASTER edits:

1. advance Product verification anchor to `bc786f4d…`;
2. remove active `SYS-ARTICLE-QUIZ-NATIVE-PARITY`;
3. mark #1373 merged in Lot/consolidation context;
4. update #1395 to current ancestry-clean head with exact-head CI still queued;
5. replace stale #1393 race wording with the current repaired semantic state + ancestry/CI barrier;
6. add #1373 to recent retired work.

No Product branch, code, workflow, issue or PR is mutated by this AuditRepo reconciliation.
