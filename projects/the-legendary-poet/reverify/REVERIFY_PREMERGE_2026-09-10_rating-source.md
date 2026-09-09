# Pre-merge reverify — TLP-RATING-SOURCE-001

Recorded: 2026-09-10. Repository SHAs below are the transaction authority; wall-clock labels do not substitute for exact-head identity.

## Purpose

Preserve the pre-merge state for `TLP-RATING-SOURCE-001` without retiring the root before Product closure.

## Audit authority before Product merge

- AuditRepo base: `f7ac487cec73148d2398687e09d12481f43f9a8d`.
- Current active denominator: `12` (`P1=1 / P2=10 / P3=1`).
- `TLP-RATING-SOURCE-001` remains active in `verified/MASTER_BUG_MATRIX.md`.
- `verified/CLOSURE_LEDGER.md` has no rating-source closure entry.

## Product candidate under certification

- Product repository: `FedorMilovanov/TheLegendaryPoet`.
- Product issue: `#478`.
- Product PR: `#479`.
- Product base observed for the bounded repair: `d90b36339f9b09de1f1c592037a363e5ad71f27a`.
- Exact candidate head: `e1460d26e4ec0a82db17b552d25556b5299cb44f`.
- Permanent candidate diff: four files (`package.json`, `scripts/validate-rating-source-authority.ts`, `src/pages/RatingsPage.tsx`, `src/utils/ratingRanking.ts`).
- The repair separates reader `/5` ordering authority from editorial `/10`, preserves explicit editorial sorting, and makes unrated reader rows non-placed in reader mode.
- `TLP-RATING-METHOD-001` is explicitly outside this candidate scope.

## Current evidence state

At this witness point the candidate has substantial exact-head green evidence, but Product closure is **not** yet established. Running or queued workflows are not treated as success.

Therefore this witness grants no authority to:

- remove `TLP-RATING-SOURCE-001` from MASTER;
- decrement the active denominator;
- append a closure ledger entry;
- mark Product #478 completed;
- infer a resulting squash tree before a CAS merge exists.

## Concurrency boundary

The independent Product branch `repair/tlp-analytics-route-477` owns `TLP-ANALYTICS-ROUTE-001` and is not part of this transaction. Its files/commits must not be reused or reconciled here.

## Required terminal continuation

Only after Product #479 has all required exact-head gates terminal-success, a current base/behind check, unchanged bounded diff, reviews=0, unresolved threads=0, and a successful squash merge using `expected_head_sha` may this Audit lane add terminal evidence, update MASTER, and append the ledger. Tested Product tree must equal resulting squash tree before Audit retirement is allowed.
