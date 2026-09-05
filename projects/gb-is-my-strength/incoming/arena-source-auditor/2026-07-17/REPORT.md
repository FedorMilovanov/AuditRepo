# Source-audit intake — Source Link Audit invalid concurrency fails open

## Meta

- Project: `gb-is-my-strength / gospod-bog.ru`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Agent: `arena-source-auditor`
- Date: 2026-07-17
- Audited branch/ref: `main`
- Audited anchor: `a2ef67da54dd4ae00aedae154422280620acdf21`
- Branch / event context: one Product branch (`main`) and no active Product PR at the pre-audit overlap check.
- Environment: local source-only inspection of the official GitHub codeload ZIP for the exact anchor; ZIP SHA-256 `59c66c32dd8f1f15ddc21578ffc0df9bd2cb780c140b6007b9c752ac560287da`; Node `v22.23.1` acquired from the official Node distribution after SHA-256 verification; npm `10.9.8`; dependencies installed with `npm ci --ignore-scripts` for static/contract checks.
- Report type: `source-audit`
- Build mode: source; a minimal in-repository HTML fixture was used only to exercise the verifier’s own command path. No Product source was changed and no Product build, deployment or live claim is made.
- Scope: `.github/workflows/source-links.yml`, `scripts/source-link-audit.js`, and the source-link verifier’s existing contract tests.
- Explicit exclusions: no claim about current production source-link validity, live `gospod-bog.ru`, an actual GitHub Actions run with injected environment, or any unrelated Product surface.
- Signal class: control-plane / audit-harness.
- Proof state: `FAIL` for the verifier’s fail-closed configuration invariant.
- Claim boundary: an explicit invalid `SOURCE_LINK_CONCURRENCY` value (`0`, nonnumeric, or negative) makes the current source verifier process zero discovered links and exit successfully. This is a source-level, locally reproduced property of the exact anchor.
- Preservation boundary: preserve the default concurrency (`6`), legitimate positive bounded overrides, URL policy, redirect policy, evidence schema, and normal workflow behavior. The required change is only to reject invalid explicit numeric configuration before the audit can claim PASS.
- Semantic owner: `scripts/source-link-audit.js`; regression owner includes `scripts/source-link-audit-contract-test.cjs`, `scripts/source-link-audit-source-contract-test.cjs`, and `.github/workflows/source-links.yml`.
- Overlapping active owner/PR/branch check: pre-audit GitHub API observation showed only `main` and no active PR. Recheck immediately before any Product mutation.

---

## 1. New observations

### Observation `SL-AUDIT-ENV-CONCURRENCY-FAIL-OPEN`

- Title: Invalid `SOURCE_LINK_CONCURRENCY` can turn a nonempty Source Link Audit into a successful zero-link audit.
- Kind: audit-harness / control-plane defect.
- Suggested impact: medium for the integrity of a publication/audit witness; no direct reader-facing defect was demonstrated.
- Route(s) / owner(s): the scheduled/manual `Source Link Audit` verifier; source owner `scripts/source-link-audit.js`.
- Observed on anchor: `a2ef67da54dd4ae00aedae154422280620acdf21`.
- Expected: any explicitly supplied concurrency value that cannot schedule at least one worker must fail closed with a configuration error. A nonempty audit corpus must not be reported as a successful `checked: 0` audit because of invalid worker-count parsing.
- Actual:
  - `scripts/source-link-audit.js:32` assigns `CONCURRENCY = Number(process.env.SOURCE_LINK_CONCURRENCY || 6)` without finite/integer/range validation.
  - `runPool()` at lines 463–469 creates workers with `Array.from({ length: Math.min(CONCURRENCY, items.length) }, next)`.
  - With `SOURCE_LINK_CONCURRENCY=0`, `nope` (`NaN`), or `-2`, that array has length zero. `Promise.all([])` succeeds, no `worker()` call occurs, and the verifier emits a normal PASS with `checked: 0`, no results, and exit status `0`.
- Reproduction / inspection steps:
  1. In a temporary directory *inside the exact Product snapshot*, create `audit-fixture-links/index.html` containing one external link: `http://127.0.0.1/private-only`.
  2. Run the exact verifier with `--root audit-fixture-links --json-out reports/link-audit-<value>.json`.
  3. Control: `SOURCE_LINK_CONCURRENCY=1` exits `1`, records `checked: 1`, `hardErrors: 1`, and rejects the link as `plain-http` before any network request.
  4. Invalid cases: values `0`, `nope`, and `-2` each exit `0` and produce `checked: 0`, `hardErrors: 0`, and `results: []` despite the same nonempty fixture.
- Evidence type: `verified-source` plus deterministic local command-path reproduction.
- Evidence:
  - Source anchors: `scripts/source-link-audit.js:30–33`, `:463–489`.
  - Workflow owner/entrypoint: `.github/workflows/source-links.yml:60–85`; its real-network job invokes the verifier after the production-like build and does not validate or constrain these `SOURCE_LINK_*` numeric values.
  - Existing contract commands passed on the exact snapshot:
    - `node scripts/source-link-audit-contract-test.cjs`
    - `node scripts/source-link-audit-source-contract-test.cjs`
    - `node scripts/source-link-audit-main-trigger-contract.cjs`
    These tests do not cover invalid environment numeric values or a zero-worker nonempty corpus.
- Confidence: high for the stated source-level behavior.
- Limitations of this method:
  - The official workflow currently does not itself set `SOURCE_LINK_CONCURRENCY`; normal GitHub-hosted execution therefore takes the default `6`.
  - This does not prove that a previous official run was bypassed, that a workflow environment is presently misconfigured, or that a production link is bad.
  - A source-only pass cannot establish GitHub Actions environment policy or live deployment state.
- Possible mechanism: `Number()` accepts invalid input as `NaN` and `Array.from()` converts a negative/`NaN` length to zero. The pool treats zero workers as an empty successful work set rather than a configuration failure.
- Related existing findings: historical Source Link Audit/link-content findings are distinct. This is a verifier integrity defect, not a claim that any particular external source URL is currently invalid.
- Applicability: the current workflow’s confidence statement depends on `scripts/source-link-audit.js` examining every discovered link. The exact current source permits an invalid explicit runtime configuration to violate that invariant silently.
- What this evidence does **not** prove: it does not prove a Product content defect, a live-site failure, compromised CI, or that an attacker can independently supply this environment value to a protected `main` workflow.

### Suggested bounded repair and regression witness

1. Parse each `SOURCE_LINK_*` numeric setting through a shared strict helper that accepts only finite integers in an explicit positive/bounded range (at minimum `SOURCE_LINK_CONCURRENCY >= 1`), and throws before traversal/probing otherwise.
2. Add contract cases that execute a nonempty fixture with `SOURCE_LINK_CONCURRENCY=0`, `-2`, and `nope`, asserting nonzero exit and no success JSON claim.
3. Preserve valid positive overrides and the default `6`.
4. Run the three existing source-link contracts, the added invalid-configuration regression test, and the source-link workflow’s normal production-like audit after merge.

---

## 2. Confirmations and extensions

### Confirm current workflow boundary

- Target: current Source Link Audit control plane.
- Evidence angle added: source entrypoint and existing contract-suite review.
- My evidence anchor: Product `main` `a2ef67da54dd4ae00aedae154422280620acdf21`.
- Result: the normal workflow is structurally separated into PR contract checks and scheduled/manual real-network auditing; its existing contracts passed. The uncovered gap is specifically invalid numeric configuration of the worker pool, not redirect policy, DNS pinning, URL sanitisation, or the normal default execution path.
- What this changes: do not infer a failed current Product source-link audit. Treat this as a narrow verifier hardening candidate pending owner/verification disposition.

---

## 3. Challenges and negative findings

- No direct Product-route or reader-facing failure is admitted by this report.
- The existence of `SOURCE_LINK_CONCURRENCY` is not itself a defect: positive valid values continue to give a bounded concurrent pool. The defect is the success result for values that make the pool empty.
- Existing source-link contract tests were green, so this is not a syntax or broad URL-policy regression; their missing configuration-boundary coverage is the relevant gap.

---

## 4. Root-cause cluster

- Root cause: unvalidated environment-derived numeric control is used directly as an `Array.from()` worker count.
- Symptoms absorbed by one repair: `0`, negative, and nonnumeric `SOURCE_LINK_CONCURRENCY` values all produce the same false-green zero-work audit.
- Independent of: historical external-link 404s and the separate Research source-audit hard-gate lane.

---

## 5. Recommended disposition

Keep this report in `incoming/` as raw, current-anchor evidence. It should not be added to `MASTER_BUG_MATRIX.md` until a selected verification/owner wave decides whether the protected workflow/environment boundary makes the hardening currently necessary. If admitted, represent it as one narrow control-plane row, not as a source-content failure or a duplicate of link-quality findings.
