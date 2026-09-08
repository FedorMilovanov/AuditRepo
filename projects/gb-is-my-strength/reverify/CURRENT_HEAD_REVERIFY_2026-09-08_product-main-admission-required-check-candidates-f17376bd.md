# Current-head reverify — Product `main` native admission required-check candidates

## Disposition

`OWNER-DECISION NARROWING EVIDENCE / no closure claimed`

This receipt does not close `SYS-MAIN-ADMISSION-ENFORCEMENT`, does not change Product code, and does not substitute repository workflows for native server-side admission enforcement. It narrows the unresolved owner decision to a concrete, evidence-backed minimum required-check set that is actually created for ordinary pull requests.

## Current anchors

- Reverify date: 2026-09-08
- Product repository: `FedorMilovanov/gb-is-my-strength`
- Product `main`: `f17376bd807cf77ae8c5e62c1d2519c040dae711`
- Live Product branch read: `protected=false`; required status-check enforcement `off`
- Live Product repository rulesets: `[]`
- AuditRepo base for this receipt: `eaaf46de7d10177320c8db6a96ad716e58fe9438`
- Existing canonical owner-decision receipt: `CURRENT_HEAD_REVERIFY_2026-09-08_product-main-admission-enforcement-owner-decision.md`

The underlying governance owner remains unresolved until Product `main` receives native protection/ruleset enforcement or the repository owner explicitly accepts the unprotected-main risk.

## Why the required-check set must be chosen carefully

The Product repository has many strong workflow families, but most are path-filtered. Requiring a conditional check globally would deadlock unrelated pull requests because GitHub would wait for a check that is legitimately never created.

Examples reverified on current Product `main`:

- `.github/workflows/writer-lease-contract.yml` is path-filtered to writer-lease/control-plane files and lease-governed generator workflows; it is **not** a global required-check candidate.
- `.github/workflows/node-toolchain-contract.yml` is path-filtered to toolchain/workflow/package/control-plane paths; it is **not** a global candidate.
- `.github/workflows/document-authority.yml` is path-filtered to documentation/document-authority paths; it is **not** a global candidate.
- `.github/workflows/deploy-candidate-contract.yml` covers deploy-relevant source/data/assets/scripts/workflows, but does not cover every possible repository-only diff such as arbitrary research/evidence files; it is **not** safe as the sole unconditional branch-protection requirement.

This receipt therefore selects only jobs whose workflow trigger and job-level condition prove ordinary PR availability.

## Candidate 1 — Shared Files Guard / `guard`

Source: `.github/workflows/shared-files-guard.yml`.

Trigger contract on current `main`:

```yaml
pull_request:
  types: [opened, synchronize, reopened, edited]
  branches: [main]
```

There is no `paths` or `paths-ignore` filter. The `guard` job is gated only against a closed PR state, so it is created for normal open PR admission events into `main`.

The job is not a cosmetic check. It currently includes, among other controls:

- live PR diff authority resolution;
- lane-collision contract tests;
- active lane-collision enforcement;
- shared/system diff guard;
- workflow policy contracts and actionlint;
- repository control-plane integrity;
- retained reference / runtime / route-policy regression families.

Current check-run context observed on a real minimal PR: **`guard`**.

## Candidate 2 — Metadata & IndexNow Readiness / `Validate source metadata without building dist`

Source: `.github/workflows/indexnow.yml`.

Trigger contract on current `main`:

```yaml
pull_request:
  types: [opened, synchronize, reopened, labeled]
```

There is no branch path filter for pull requests. The mutation-capable `Canonical headline autofix` job is label-gated and may be skipped, so it must **not** be the required context. The read-only `diagnostics` job has no conditional and is always created for these PR events.

Observed check-run context: **`Validate source metadata without building dist`**.

The diagnostics job validates:

- editorial metadata registry structure;
- canonical article headline contract;
- Antisovetov source boundary;
- source asset revision drift in read-only mode;
- tracked-source cleanliness.

## Cross-check on a minimal, non-Product-surface PR

Product PR #1925 (`research(teen): record core trilogy content clearance`) is a useful negative-space witness because its permanent diff is exactly one added research receipt and intentionally touches no Product runtime, route, metadata/security/system owner, workflow, search, sitemap or feed surface.

Exact head: `bedb511019f118df9fa16e054080c7e337381ee8`.

The pull-request workflow set on that exact head contained the two global families relevant to this evidence:

- `Shared Files Guard` — SUCCESS;
- `Metadata & IndexNow Readiness` — SUCCESS.

Observed exact jobs:

- `guard` — SUCCESS;
- `Validate source metadata without building dist` — SUCCESS;
- `Canonical headline autofix` — SKIPPED, correctly proving why the autofix job itself must not be required.

This confirms the two selected read-only contexts exist even for a research-only diff that legitimately does not activate the larger deploy/content workflow matrix.

## Recommended native enforcement semantics

Preferred Product owner action is a native GitHub branch protection rule or repository ruleset applying to `main` with, at minimum:

1. pull-request admission rather than ordinary direct push to `main`;
2. required status checks:
   - `guard`;
   - `Validate source metadata without building dist`;
3. force-push and branch-deletion protection;
4. an intentional, documented admin/emergency bypass policy rather than accidental unrestricted bypass;
5. a post-configuration server read proving the rule is active.

Do **not** globally require path-filtered workflow jobs merely because they are strong when applicable. Those remain exact-head lane gates enforced by the repository's existing process and per-lane admission discipline.

Whether the owner also wants additional review-count requirements, conversation-resolution requirements, signed commits, linear history, merge queue, or an up-to-date-branch requirement is a separate governance choice. This receipt does not invent those policies.

## Why this still does not close the MASTER row

The current live server state is still:

- Product `main`: unprotected;
- required status-check enforcement: off;
- repository rulesets: none.

The available connector surface in this session does not expose an administration mutation for branch protection/rulesets. Therefore this evidence can eliminate ambiguity about a safe minimum required-check set, but cannot claim native enforcement has been configured.

## MASTER consequence

None. Arithmetic remains:

- active work units: `2`;
- direct current defects: `0`;
- system verification lanes: `1` (`FRAGMENTED-SECURITY-OWNERSHIP`);
- owner decisions: `1` (`SYS-MAIN-ADMISSION-ENFORCEMENT`).

Close `SYS-MAIN-ADMISSION-ENFORCEMENT` only after a fresh Product server read proves native enforcement, or after an explicit owner-approved accepted-risk disposition is recorded.