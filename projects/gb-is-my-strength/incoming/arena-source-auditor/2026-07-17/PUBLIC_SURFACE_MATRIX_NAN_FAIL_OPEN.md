# Source-audit intake — Public Surface Browser Matrix accepts nonnumeric worker count and reports a false green

## Meta

- Project: `gb-is-my-strength / gospod-bog.ru`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Agent: `arena-source-auditor`
- Date: 2026-07-17
- Audited branch/ref: `main`
- Audited anchor: `a2ef67da54dd4ae00aedae154422280620acdf21`
- Branch / event context: GitHub API recheck immediately before intake: `main` is the only Product branch and Product has no active PR.
- Environment: local source-only inspection of the official GitHub codeload ZIP for the exact anchor (ZIP SHA-256 `59c66c32dd8f1f15ddc21578ffc0df9bd2cb780c140b6007b9c752ac560287da`); Node `v22.23.1`; dependencies installed with `npm ci --ignore-scripts`.
- Report type: `source-audit`
- Build mode: source plus a controlled verifier-path reproduction. A test-only module preload outside the Product tree replaced Playwright so that a scheduled browser case would throw; an empty `dist/` existed only to pass the script’s initial presence gate. No Product source, Product build output, workflow, deployment, or live state was changed or claimed.
- Scope: `scripts/public-surface-browser-matrix.mjs` and its `Route Registry Validators` caller.
- Explicit exclusions: no claim that the normal default CI environment is currently malformed; no claim about a particular reader route, generated Product dist, browser result, deployment, or live site.
- Signal class: control-plane / audit-harness.
- Proof state: `FAIL` for the matrix’s fail-closed configuration invariant.
- Claim boundary: a nonnumeric explicit `GB_MATRIX_WORKERS` value makes the exact current matrix schedule zero cases and exit successfully while writing a `0/0 PASS` report for a nonempty current corpus.
- Preservation boundary: preserve the current default (`4`), valid bounded integer overrides (`1`–`4`), registry selection, browser assertions, report schema, and normal workflow behavior. The required change is to reject a non-finite/non-integer explicit worker setting before it can yield a PASS report.
- Semantic owner: `scripts/public-surface-browser-matrix.mjs`; regression owner includes the Route Registry Validators matrix job in `.github/workflows/route-registry-validators.yml`.
- Overlapping active owner/PR/branch check: no Product PR and only `main` at check time. Recheck immediately before any Product mutation.

---

## 1. New observations

### Observation `PUBLIC-SURFACE-MATRIX-NAN-FAIL-OPEN`

- Title: Nonnumeric `GB_MATRIX_WORKERS` produces a successful empty Public Surface Browser Matrix.
- Kind: audit-harness / control-plane defect.
- Suggested impact: medium for CI/browser-witness integrity; no direct reader-facing defect was demonstrated.
- Route(s) / owner(s): all `production-dist` routes selected by the matrix; owner `scripts/public-surface-browser-matrix.mjs`.
- Observed on anchor: `a2ef67da54dd4ae00aedae154422280620acdf21`.
- Expected: if a runtime worker-count override is supplied, it must be a finite integer in the supported range; an invalid override must terminate nonzero before the matrix can claim that all public routes passed.
- Actual:
  - At `scripts/public-surface-browser-matrix.mjs:38`, the worker count is `Math.max(1, Math.min(4, Number(process.env.GB_MATRIX_WORKERS || 4)))` with no finiteness/integer validation.
  - With `GB_MATRIX_WORKERS=nope`, `Number(...)` is `NaN`, both `Math.min` and `Math.max` remain `NaN`.
  - At lines `324–334`, `Array.from({ length: Math.min(MAX_WORKERS, items.length) }, run)` receives `NaN`; JavaScript converts that array length to `0`, so `Promise.all([])` succeeds without calling a worker.
  - The current registry itself is nonempty and valid: 86 entries total, 85 with `status: production-dist`; the matrix makes 255 cases (85 routes × 3 viewports).
  - Despite that corpus, with the invalid value it emitted: `Public browser matrix: 85 routes × 3 viewports = 255 cases; workers=NaN`, then `PUBLIC SURFACE BROWSER MATRIX: 0/0 PASS (85 routes)`, exit status `0`.
  - Its emitted JSON recorded `registry.publicTested: 85`, but `contracts: 0`, `passed: 0`, `failed: 0`, `failures: []`, `results: []`; its Markdown said `0/0 PASS`, `Failures: 0`, and “Every public route passed”.
- Reproduction / inspection steps:
  1. Use the exact source snapshot and current route registry; verify it has 85 `production-dist` entries and no registry errors.
  2. Provide a test-only external preload whose fake browser throws if `newContext()` is invoked. This makes execution of even one case observable without treating the fake implementation as a Product witness.
  3. Create an empty local `dist/` only to reach the matrix code after its `dist/ missing` guard.
  4. Run `GB_MATRIX_WORKERS=nope node --require <test-only-preload> scripts/public-surface-browser-matrix.mjs`.
  5. Observe exit `0` and the zero-contract PASS report described above. The fake browser was never asked for a context.
  6. Control: `GB_MATRIX_WORKERS=0` is clamped to `1`, schedules a case, invokes the fake browser, and exits nonzero. Thus the observation is narrowly about non-finite input, not valid/default behavior or zero’s normal clamp.
- Evidence type: verified-source plus deterministic local verifier-path reproduction.
- Evidence:
  - Worker parse: `scripts/public-surface-browser-matrix.mjs:33–39`.
  - Registry filter: `:80–86`; it selected 85 `production-dist` entries at this anchor.
  - Pool: `:324–334`; case construction/invocation: `:341–347`.
  - Success reporting: `:353–380`; it does not require `results.length > 0` or expected coverage before rendering the success sentence.
  - CI caller: `.github/workflows/route-registry-validators.yml`, job `public-surface-browser-matrix`, builds production-like dist and invokes `node scripts/public-surface-browser-matrix.mjs`.
- Confidence: high for the source-level behavior and controlled command-path reproduction.
- Limitations of this method:
  - The checked-in workflow does not set `GB_MATRIX_WORKERS`; ordinary GitHub-hosted CI receives default `4` and this report does not show a normal official run was bypassed.
  - The test preload and empty dist do not prove browser correctness; they only prove zero case scheduling and false-green report construction.
  - The report does not prove an untrusted contributor can inject the variable into protected CI.
- Possible mechanism: `Math.max/min` do not sanitize `NaN`; `Array.from` converts a `NaN` length to zero. Since the report has no expected-case/coverage invariant, an empty result set satisfies `failures.length === 0`.
- Related existing findings: this shares the general *unvalidated environment-derived worker count* mechanism with raw intake `SL-AUDIT-ENV-CONCURRENCY-FAIL-OPEN`, but it is an independent Product verifier, workflow, config key, test surface, and regression fix. Do not merge them into a source-content/link-quality claim.
- Applicability: the Route Registry Validators matrix is intended as breadth browser evidence for every selected public route. A false-green zero-case report directly breaks that specific witness claim if an invalid override is ever supplied.
- What this evidence does **not** prove: no current Product UI or route defect; no production/live failure; no actual invalid CI configuration; no weakness in valid/default matrix runs.

### Suggested bounded repair and regression witness

1. Parse `GB_MATRIX_WORKERS` through a strict helper: either absent (use default `4`) or finite integer `1..4`; reject `NaN`, infinity, fractional, zero, and negative explicit values with a nonzero configuration error.
2. Before browser launch or report rendering, assert `entries.length > 0`, expected case count equals `entries.length * VIEWPORTS.length`, and `results.length` equals that count. This prevents any future pool/control-flow regression from converting an empty run into PASS.
3. Add a deterministic contract test that injects a nonempty controlled registry and fake browser, verifies invalid worker values exit nonzero, and proves a success report cannot contain zero contracts for a nonempty selected corpus.
4. Preserve default worker behavior and valid `1..4` parallelism. Run the new regression, the existing route-registry contracts, and the normal exact-head browser matrix after merge.

---

## 2. Challenges and negative findings

- `GB_MATRIX_WORKERS=0` does **not** reproduce the bug because current clamping turns it into one worker; it then schedules work and fails under the test fake as expected.
- The registry is not empty or invalid on the audited anchor: it had no registry errors and 85 selected production routes. The zero contracts are therefore not a legitimate empty corpus result.
- No direct Product browser or route failure is admitted by this report.

---

## 3. Root-cause cluster

- Root cause: an environment-derived numeric concurrency control is used in worker-array construction without a strict finite-integer boundary; a success report relies only on `failures.length` rather than expected coverage.
- Distinct symptom: `GB_MATRIX_WORKERS=nope` gives `workers=NaN`, schedules zero of 255 current cases, and reports a pass.
- Related-but-independent raw evidence: source-link audit invalid concurrency. The source-link repair must not be assumed to repair this matrix.

---

## 4. Recommended disposition

Keep this as raw `incoming/` evidence until a selected verification/owner wave decides whether the protected CI environment and the browser-witness integrity requirement make the bounded hardening currently necessary. If admitted, it should be one narrow control-plane work unit; do not represent it as a Product route/content failure or as proof of an actual bypassed GitHub Actions run.
