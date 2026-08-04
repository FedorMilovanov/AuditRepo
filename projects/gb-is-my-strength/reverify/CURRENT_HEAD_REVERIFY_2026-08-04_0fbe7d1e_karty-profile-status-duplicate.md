# CURRENT HEAD REVERIFY — Karty route-profile status drift

- Date: 2026-08-04
- Source repository: `FedorMilovanov/gb-is-my-strength`
- Canonical findings: `QUAL-P1-09`, `QUAL-P2-01`
- Current Product anchor: `0fbe7d1ead9ebd1bea867418e254da438ec63329`
- AuditRepo base: `da25e2c53388c6639e0add7b01e7521cb82a146e`
- Current production claim: **none**

## Original claims

- `QUAL-P1-09`: all `data/route-profiles/karty-*.json` records use `currentStatus: "production-dist"`, drifting from `route.json` state.
- `QUAL-P2-01`: eight holding-map route profiles use `currentStatus: "production-dist"`, causing the same status drift.

These rows are not two independent defects. The P2 row is the precise subset/residual of the broader P1 wording.

## Current-head witness

At Product `0fbe7d1ead9ebd1bea867418e254da438ec63329`:

- `data/route-profiles/karty-avraam.json` uses `currentStatus: "production-dist"` for the actual production Avraam route, so the P1 wording “all profiles are wrong” is overbroad;
- `data/route-profiles/karty-shoftim.json` also uses `currentStatus: "production-dist"` while its own SEO contract says `indexable: false` and `reason: "holding page, noindex,follow until map completion"`;
- the holding route therefore demonstrates a real current residual, while the production Avraam profile demonstrates that not every `production-dist` value is erroneous;
- `QUAL-P2-01` describes the same holding-profile residual already owned by `QUAL-P1-09`, not another repair lane.

## Disposition

### `QUAL-P1-09` — partial / narrowed

Retain this canonical P1 owner, but narrow it from “all Karty profiles are production-dist and drifted” to the factual residual: eight holding/noindex Karty route profiles still declare `currentStatus: "production-dist"` despite their non-production publication contract.

### `QUAL-P2-01` — duplicate / merged into `QUAL-P1-09`

Close the P2 row as an exact duplicate of the narrowed P1 residual. No Product mutation is justified by this verifier-only transaction.

## Evidence boundary

This transaction does not decide the replacement status vocabulary, mutate route profiles, claim every holding route has identical metadata, or establish deployment of current Product `main`. The retained P1 row remains repair-ready only after the canonical status owner and required migration/profile validators are identified.

## Proposed canonical arithmetic

- Canonical IDs: **358**
- Closed: **197 → 198**
- Open: **161 → 160**
- P1: **73** (one row narrowed, still open)
- P2: **34 → 33**
- P0: 0
- P3: 47
- Refactoring: 4
- AuditRepo: 3

The total remains `358 = 198 + 160`.
