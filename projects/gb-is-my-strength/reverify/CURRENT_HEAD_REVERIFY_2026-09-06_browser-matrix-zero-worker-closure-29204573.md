# Current-head reverify — browser matrix zero-worker fail-open closure

**Project:** `gb-is-my-strength`  
**Date:** 2026-09-06  
**Audit finding:** `BROWSER-MATRIX-ZERO-WORKER-FAILOPEN`  
**Current Product main:** `29204573b78f15f4e49455ccc4a63722f033d6bd`  
**AuditRepo rollback point:** `58ef8183055329acc02d6a31ec09b24a9a0ef566`

---

## 1. Scope and disposition

This reverify checks the complete causal boundary of the active SYSTEM row `BROWSER-MATRIX-ZERO-WORKER-FAILOPEN` against current Product `main`.

Disposition: **FIXED-CURRENT / closed-by-system-fix**.

The original root was not ordinary browser-test failure. Malformed explicit worker-count environment values could be coerced through `Number(...)` into `NaN`, schedule zero runners and permit a vacuous `0/0 PASS`. Product #1798 fixed the primary public-surface Chromium matrix. Product #1804 subsequently fixed the remaining cross-browser Chromium/WebKit matrix using the same shared bounded-worker owner.

No independent residue remains under this causal owner.

---

## 2. Product repair chain

### Product #1798 — primary browser matrix

Merged PR #1798, final head `ea5829dcfc6bc6620689a80909e3bf845080e714`, merge `3a331a8c04cae01442c0ebed04e6262892a764ab`.

Current `scripts/public-surface-browser-matrix.mjs`:

- parses `GB_MATRIX_WORKERS` through shared `parseBoundedWorkerCount` with default 4 and range 1..4;
- rejects an empty production route corpus;
- runs cases through `runBoundedWorkerPool`;
- records scheduled/completed cardinality;
- fails unless `completedCases === scheduledCases` and scheduled is nonzero;
- refuses a zero-contract PASS even after case execution.

Exact-head PR workflows on `ea5829d...` were green, including:

- `Route Registry Validators` run `33995165946` — success;
- `Shared Files Guard` run `33995165947` — success;
- `Deploy Candidate Contract` run `33995165952` — success;
- `Source Authority Contract` run `33995165940` — success;
- `Node Toolchain Contract` run `33995165951` — success;
- `Metadata & IndexNow Readiness` run `33995165970` — success.

### Product #1804 — cross-browser matrix residual

Merged PR #1804, final head `ceec6c51968f2c12c205a565b4544a00bd79b654`, merge/current Product `main` `29204573b78f15f4e49455ccc4a63722f033d6bd`.

Current `scripts/public-surface-cross-browser-matrix.mjs`:

- parses `GB_CROSS_BROWSER_WORKERS` through the same `parseBoundedWorkerCount` owner with default 2 and range 1..4;
- rejects an empty production route corpus;
- uses `runBoundedWorkerPool` for the complete case set;
- proves scheduled/completed cardinality before any PASS;
- refuses a zero-contract PASS;
- records case cardinality in JSON, Markdown and terminal evidence.

The permanent `scripts/public-surface-browser-matrix-worker-contract-test.js` exercises both `GB_MATRIX_WORKERS` and `GB_CROSS_BROWSER_WORKERS`, rejects zero/negative/fractional/NaN/out-of-range values, verifies full bounded-pool completion, and contains an integration lock preventing restoration of `Number(process.env.GB_CROSS_BROWSER_WORKERS)`.

Exact-head PR workflows on `ceec6c51...` were green, including:

- `Route Registry Validators` run `34014566721` — success;
- `Shared Files Guard` run `34014578737` — success;
- `Deploy Candidate Contract` run `34014566712` — success;
- `Source Authority Contract` run `34014566694` — success;
- `Metadata & IndexNow Readiness` run `34014566699` — success.

An earlier Shared Files Guard invocation on the same repair sequence was cancelled after the stale-base refresh; the replacement exact-head run above is the merge-authoritative success witness.

---

## 3. Closure-boundary check

The MASTER closure boundary required:

1. strict positive-integer worker parsing;
2. nonzero execution-cardinality assertion;
3. adversarial coverage for malformed/zero/negative values.

Current Product satisfies all three for both public browser-matrix executors. The remaining official workflow values being valid literals is no longer relied on for safety: malformed explicit values now fail closed inside the shared parser/worker contract.

This is a class-level repair rather than a one-input patch, and the same permanent contract covers both environment-variable owners.

---

## 4. Boundaries preserved

- No route/content/UI/runtime Product behavior is changed by this AuditRepo closure.
- No inference is made about the other eight SYSTEM lanes.
- `RODOSLOVIYE-OG-IMAGE` remains independently open.
- No Baptist-series or dependency work is touched.
- No production/live claim is needed for closure of this CI harness fail-open; exact-current source plus merged exact-head workflow evidence is the relevant proof.

---

## 5. Terminal status

`BROWSER-MATRIX-ZERO-WORKER-FAILOPEN` has no current independent residue at Product `main` `29204573b78f15f4e49455ccc4a63722f033d6bd` and should be removed from active MASTER arithmetic.
