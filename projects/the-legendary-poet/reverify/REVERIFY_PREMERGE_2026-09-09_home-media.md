# PRE-MERGE REVERIFY — TLP-HOME-MEDIA-PERF-001

Date: 2026-09-09  
Audit owner: `TLP-HOME-MEDIA-PERF-001`  
Audit issue: #420  
Product issue: `FedorMilovanov/TheLegendaryPoet#471`  
Product PR candidate: `FedorMilovanov/TheLegendaryPoet#472`

## Evidence boundary

This is a pre-merge witness only. It does **not** close the row, remove it from `MASTER_BUG_MATRIX.md`, decrement the active denominator, or claim a Product merge SHA. Terminal reconciliation is permitted only after Product #472 is exact-head certified and actually CAS-merged.

## Product identity under test

- Product base: `e4f159063648a6663e165877ef3f75dfcc2c0d09`
- Product PR #472 exact candidate head: `61ad2a240c399610c41c247a4ee55e1ae7120273`
- PR scope at opening: 19 permanent files, `behind=0`
- one-shot derivative builder was removed before the permanent PR diff
- no Hall/package/metadata surfaces are in the permanent scope

## Candidate repair contract

The candidate changes the homepage hero media authority from six eager full-size portraits to one explicit lifecycle:

1. only indices 0–1 are critical (`loading=eager`, `fetchPriority=high`);
2. indices 2–5 have no production portrait source before initial `window.load` and are released on the next animation frame after that boundary;
3. each portrait has real `320w`, `480w`, and authoritative `1000w` candidates with explicit `sizes`;
4. `ResilientImage` exposes responsive candidates only while the primary source lane is authoritative, so fallback semantics cannot be bypassed by stale `srcset`;
5. focused browser proof owns pre/post-load request topology, selected `currentSrc`, critical transfer budget, six-image decode completion and geometry stability;
6. a static fail-closed validator owns derivative presence, JPEG dimensions, critical pair byte ceilings, source policy and permanent runner wiring.

## Materialized derivative evidence

Authoritative branch-local builder run `34289019652`, job `102271130798`, completed `success` from Product source originals. The resulting 480w commit was `13abd78be867f23488fca96766c500a15c1ac43c`; earlier 320w derivatives were already present in the same repair branch. Builder logs establish:

| asset | 320w | 480w |
|---|---:|---:|
| fet | 8,787 B | 19,043 B |
| lermontov | 10,120 B | 21,205 B |
| mayakovsky | 7,878 B | 15,731 B |
| pushkin | 7,027 B | 14,044 B |
| tyutchev | 7,639 B | 14,994 B |
| yesenin | 8,867 B | 16,757 B |

All generated candidates are `320x400` or `480x600` JPEG respectively. Critical first-pair totals from the authoritative builder log are:

- 320w: `8,867 + 10,120 = 18,987 B` against a 32 KiB ceiling;
- 480w: `16,757 + 21,205 = 37,962 B` against a 56 KiB ceiling.

These byte facts are candidate evidence only until the final exact Product head is certified and merged.

## Exact-head gates at witness creation

For Product head `61ad2a240c399610c41c247a4ee55e1ae7120273`, the following PR-triggered workflows were selected and queued at witness creation:

- CI #3916 — run `34290133703`
- Project contracts #1027 — run `34290133779`
- Manual Browser QA #2975 — run `34290133377`
- Merge certification #67 — run `34290133391`
- Brand deep reference and motion audit #1939 — run `34290133485`
- Site route integrity audit #1922 — run `34290133527`
- Request Pages deployment #2296 — expected `skipped`

No current-head terminal success is claimed here.

## Closure boundary

If and only if Product #472 later reaches terminal exact-head green, remains current/`behind=0`, has no blocking reviews or unresolved threads, and is CAS-merged at that exact head, the terminal AuditRepo wave may:

- add a sibling terminal reverify report bound to tested Product head + resulting Product main;
- remove only `TLP-HOME-MEDIA-PERF-001` from the active matrix;
- update P3 `2 -> 1` and total active `14 -> 13`;
- append one closure-ledger entry with exact Product provenance and browser/static evidence.

No other TLP row is implied closed by this transaction.
