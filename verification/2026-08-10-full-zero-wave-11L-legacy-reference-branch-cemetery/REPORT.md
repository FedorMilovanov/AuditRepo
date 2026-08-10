# Wave 11L — Legacy / Strangler / Reference branch cemetery

Date: 2026-08-10

Product: `FedorMilovanov/gb-is-my-strength`

Live preflight authority: `main@757946da67287354b819737813c0a47095f2d759`.

## Method / canonical evidence

Fresh live refs were used after the history rewrite. No stale clone/worktree or pre-rewrite SHA was used as current truth. `ahead` is the unique rewritten tail versus exact current main; semantic/tree absorption governs disposition.

Key terminal evidence:

- #1383 — `[SYSTEM] Strangler: retire final physical root readers from static publication guard` — is closed `completed`; legacy/reference production-reader ownership is terminal.
- `agent/route-source-reference-storage-20260808` has seven unique historical commits but **zero resulting file diff** versus current main, proving semantic tree absorption despite rewritten ancestry.
- #1452 — `fix(reader): project canonical Scripture text to native tooltips` — is merged and explicitly identifies itself as the canonical replacement for the historical `system/` Scripture projection line, stating that no unique Product code is left behind.
- Both `system/audit-pro-route-authority-*` refs are literally reachable from current main.

No Product source, `main`, Dependabot #1538, or foreign cemetery refs were mutated.

## Execution limitation

All 18 refs are semantically safe to delete. The available authenticated GitHub connector has no delete-ref/delete-branch action, and local fresh Git cannot resolve github.com. Physical deletion therefore did not occur. CI-failure lifecycle issues were not closed before deletion.

## Per-ref terminal matrix

| # | Branch | Current head SHA | `main...ref` | Unique tail / tree evidence | Associated / canonical evidence | Missing Product semantics? | Classification |
|---|---|---|---|---|---|---|---|
| 1 | `agent/gill-spravochnik-reference-storage-20260809-r2` | `e6e24c938df9a04eacf2118230f09c16f05c4951` | ahead 2 / behind 63 | retained-reference manifest + Gill visual/reference audit predecessor | terminal Strangler/reference authority #1383 | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 2 | `agent/gill-spravochnik-reference-storage-20260809` | `3cb9f15f36f9585d4f268e3dfe5a2c50d0170114` | ahead 2 / behind 64 | predecessor of same retained-reference storage line | terminal #1383 / current reference API | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 3 | `agent/legacy-shadow-identity-coverage-20260806` | `826606e9451b0f0d62d7e3938db4927a3a84582a` | ahead 5 / behind 203 | legacy identity/retirement/readiness instrumentation | terminal #1383 | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 4 | `agent/legacy-shadow-identity-coverage-20260807-r2` | `4805bb202f6594d3b391e14da3e9641f6ba7039f` | ahead 1 / behind 180 | later identity/path-contract predecessor | terminal #1383 | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 5 | `agent/owner-ui-reference-authority-20260809` | `e09f04d8e35975f22520634d84ee52bbbdba8b4c` | ahead 7 / behind 36 | historical owner-UI reference guard/ledger work | #1383 current reference/parity ownership | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 6 | `agent/owner-ui-reference-authority-r2-20260809` | `eae43a844fcbcbec731e71b08c762ecb2c6bc131` | ahead 3 / behind 36 | r2 predecessor; no independent recovery line | #1383 current reference/parity ownership | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 7 | `agent/route-source-reference-storage-20260808` | `b99228364ea5ce36a69699367a4fad0de5c5aa25` | ahead 7 / behind 97 | **resulting file diff = empty** despite unique ancestry | current route/reference storage authority; #1383 terminal | no; tree already absorbed | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 8 | `agent/visual-parity-reference-storage-20260809-r2` | `94020536ff3362fc0c2594e085d9b89c9585a212` | ahead 1 / behind 59 | old legacy manifest/path/visual parity contract | current visual/reference transfer authority | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 9 | `agent/visual-parity-reference-storage-20260809` | `bcabed8aa25d321a4b21f9abf031bc56378605fa` | ahead 4 / behind 60 | predecessor of same visual reference storage line | current visual/reference transfer authority | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 10 | `lane/system-ci-lifecycle-retired-identities-20260805` | `cced004fa87cfd40dde344a67c03a0c9292401bc` | ahead 1 / behind 229 | historical CI lifecycle/notification identity tooling | current lifecycle governance | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 11 | `lane/system-favorites-store-20260805` | `ab4b45d86014e661a44d90fd54514f922f2fc4b7` | ahead 2 / behind 211 | old favorites-store implementation/workflow/generated lineage | current favorites store on main | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 12 | `lane/system-legacy-reference-path-api-20260805` | `d52e525ecbe3ffec34f5c435f0d506b304946701` | ahead 1 / behind 220 | first legacy-reference path API contract | current explicit reference API; #1383 terminal | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 13 | `lane/system-legacy-reference-path-api-v2-20260805` | `c8f81e57c91614dafbf356abdf5d71ff04950d37` | ahead 1 / behind 220 | v2 predecessor of same API | current explicit reference API; #1383 terminal | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 14 | `lane/system-source-links-main-trigger-20260805` | `4573686740da9cb7fe490f3610dd6f93302408fa` | ahead 1 / behind 233 | old source-links workflow/trigger contract | current source/reference governance | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 15 | `lane/system-source-links-main-trigger-v2-20260805` | `341372a676af309ffc4355661c0765aa8c1f7a49` | ahead 1 / behind 233 | v2 predecessor of source-links trigger | current source/reference governance | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 16 | `system/audit-pro-route-authority-20260809-r2` | `f85be7d171bbbf3643c2a50fd0facd4e4bed4f05` | ahead 0 / behind 52 | no unique commits; reachable | current audit-pro authority / #1383 context | no | **SAFE DELETE — REACHABLE/EMPTY** |
| 17 | `system/audit-pro-route-authority-20260809` | `f85be7d171bbbf3643c2a50fd0facd4e4bed4f05` | ahead 0 / behind 52 | no unique commits; same reachable head as r2 | current audit-pro authority / #1383 context | no | **SAFE DELETE — REACHABLE/EMPTY** |
| 18 | `system/scripture-tooltip-projection-20260809` | `4f2f216f668fdffe688058cd5b2fb4094c11c498` | ahead 38 / behind 7 | large historical Scripture data-projection tail | **merged #1452 canonical `fix/` replacement**; PR states no unique Product code left behind | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |

## Terminal report

- assigned count: **18**
- examined count: **18**
- semantically SAFE DELETE count: **18**
  - SAFE DELETE — REACHABLE/EMPTY: **2**
  - SAFE DELETE — SUPERSEDED/ABSORBED: **16**
- physically deleted count: **0** — delete-ref primitive unavailable
- KEEP count: **0**
- MANUAL REVIEW count: **0**
- associated CI issues closed: **0** — physical deletion did not occur
- Product source mutations: **ZERO**
- new Product branches: **ZERO**
- new Product PR: **ZERO**
- Product `main` mutations: **ZERO**
- Dependabot #1538 mutations: **ZERO**

### Exact deleted branch names

None.

### Exact surviving branch names and reason

All assigned refs remain physically present solely because this execution environment cannot delete refs; none is a semantic KEEP:

- `agent/gill-spravochnik-reference-storage-20260809-r2`
- `agent/gill-spravochnik-reference-storage-20260809`
- `agent/legacy-shadow-identity-coverage-20260806`
- `agent/legacy-shadow-identity-coverage-20260807-r2`
- `agent/owner-ui-reference-authority-20260809`
- `agent/owner-ui-reference-authority-r2-20260809`
- `agent/route-source-reference-storage-20260808`
- `agent/visual-parity-reference-storage-20260809-r2`
- `agent/visual-parity-reference-storage-20260809`
- `lane/system-ci-lifecycle-retired-identities-20260805`
- `lane/system-favorites-store-20260805`
- `lane/system-legacy-reference-path-api-20260805`
- `lane/system-legacy-reference-path-api-v2-20260805`
- `lane/system-source-links-main-trigger-20260805`
- `lane/system-source-links-main-trigger-v2-20260805`
- `system/audit-pro-route-authority-20260809-r2`
- `system/audit-pro-route-authority-20260809`
- `system/scripture-tooltip-projection-20260809`

`examined == assigned` is satisfied. Classification is terminal; only destructive deletion remains for an executor with a delete-ref capability.