# Current-head reverify — `SYS-MAIN-ADMISSION-ENFORCEMENT`

## Disposition

`CURRENT OWNER DECISION / native Product admission enforcement still absent`

This receipt does not classify branch protection as a Product code defect or release-runtime defect. It preserves the governance owner decision that was previously canonical, remained unresolved, and was silently omitted by the 2026-08-20 wholesale MASTER consolidation without an explicit disposition.

## Current anchors

- Reverify date: 2026-09-08
- Product repository: `FedorMilovanov/gb-is-my-strength`
- Current Product `main`: `f17376bd807cf77ae8c5e62c1d2519c040dae711`
- Current-main movement since the prior receipt: merged Product #1918, `content(pastor-series): clear Parts II–IX before release`; its merge parents were prior Product main `85088dabc96fa66093b75c23aed9d5fe70855325` and exact PR head `2219770ed5f53ad6a0acc8c621ace8129e477aa0`
- Product branch endpoint: `protected=false`
- Product branch protection: disabled; required status-check enforcement off
- Product repository rulesets: `[]`
- Product owner-tracking issue: #1927 — `governance: enable native main admission enforcement`
- Current AuditRepo `main` at this refresh: `96fb059e96a416c5c2fa1a2db3fe15ca7c5b5218`
- AuditRepo `main`: protected, with required `validate` and `preflight`

Therefore the historical multi-repository owner scope remains narrowed: the unresolved owner decision in this project is Product `main` admission enforcement. AuditRepo no longer belongs in the unresolved set because it has native protection and required checks.

## Historical continuity

`SYS-MAIN-ADMISSION-ENFORCEMENT` was an explicit canonical owner decision before the 2026-08-20 causal consolidation.

### AuditRepo #307

Merged PR #307 (`audit(master): converge absorbed control-plane rows`, merge `31f6af3455fc6ad8f708b82e1ed6b26b4e0daa42`) deliberately preserved the row while removing completed AuditRepo mutation work. Its contract stated that Product and AuditRepo `main` were unprotected/no-ruleset and that the remaining choice was to establish required always-created PR checks with a documented emergency bypass or explicitly accept/document post-push red risk. It explicitly classified the row as a governance owner choice rather than a Product defect or release blocker.

### Later preserved references

The owner decision remained explicitly preserved in later AuditRepo work, including:

- #309 — preserved as the sole non-blocking owner decision;
- #310 — expanded temporarily to Product + AuditRepo + Research while all three authority-bearing mains lacked enforcement;
- #312 — stated that the owner decision remained open;
- #325 — explicitly kept the row byte-identical/out of scope;
- #329 — recorded it as unchanged owner decision;
- #333 — referred to unprotected `main` as the existing `SYS-MAIN-ADMISSION-ENFORCEMENT` owner-decision condition.

No later evidence package supplied an accepted-risk decision or native-protection closure for Product `main`.

## Consolidation omission

AuditRepo PR #345 (`verify(gb): consolidate MASTER to causal owners`) wholesale-rewrote the active matrix into Product causal/root packages derived from evidence #344. Its patch changed `Owner decisions` to `0` and left the OWNER DECISIONS table empty.

That rewrite contains no explicit retirement, acceptance, duplicate/absorption target, or closure proof for `SYS-MAIN-ADMISSION-ENFORCEMENT`. The change was therefore not a valid governance disposition; it was an omission caused by changing the matrix taxonomy to Product causal packages.

Fresh Product state at `f17376bd...` independently demonstrates that the underlying decision remains unresolved. Product #1918 changed pastor-series content/research clearance and did not create server-side admission enforcement.

## Why repository workflows do not close this owner

Product has extensive fail-closed workflow contracts, and current repair lanes use exact-head CI plus expected-head/CAS merge discipline. Those are useful process controls but are not a substitute for native server-side admission enforcement when `main` itself remains unprotected.

A repository workflow file cannot make GitHub reject an unauthorized/direct main update before it lands. Manufacturing a workflow-only surrogate would therefore change the closure condition rather than satisfy it.

## Tool/control boundary — current statement

The blocker in this session is not a Product code deficiency. The available GitHub connector action surface exposes reads for branch protection/rulesets and ordinary repository/PR/Actions mutations, but it does **not** expose an administration mutation for creating/updating branch protection or repository rulesets. Fresh server reads after Product #1918 again returned `protected=false`, required status-check enforcement `off`, and repository rulesets `[]`.

The owner action is now also tracked directly in Product issue #1927. That issue records the verified always-created required-check candidates (`guard` and `Validate source metadata without building dist`), explicitly excludes path-filtered jobs from global required contexts, and preserves the alternative explicit-risk-acceptance disposition. Creating the issue does **not** itself satisfy native admission enforcement.

Therefore this session can verify and document the native state precisely, but cannot truthfully claim to have configured Product branch protection. Creating a privileged workflow or other repository-side surrogate solely to work around the missing administration surface is not an acceptable closure.

## Closure boundary

Product tracking issue: #1927 — `governance: enable native main admission enforcement`.

Close `SYS-MAIN-ADMISSION-ENFORCEMENT` only after one of these owner decisions is made and evidenced:

### Preferred: native enforcement

Product `main` receives a GitHub branch protection rule or repository ruleset that:

1. applies to `main`;
2. requires the chosen always-created PR admission checks before merge;
3. prevents ordinary direct/unreviewed bypass of those checks;
4. defines any emergency/admin bypass intentionally rather than accidentally;
5. is re-read after configuration and proven active on the live repository.

The exact required-check set must be chosen from the Product's stable always-created PR gates; do not require conditional jobs that are legitimately absent on unrelated diffs.

### Alternative: explicit accepted governance risk

The repository owner may explicitly decide to accept unprotected-main / post-push-red risk. That decision must be documented as an owner-approved governance risk with its operational boundary; absence of configuration is not by itself evidence of acceptance.

## MASTER consequence

None. The existing arithmetic remains:

- active work units: `2`
- direct current defects: `0`
- system verification lanes: `1` (`FRAGMENTED-SECURITY-OWNERSHIP`)
- owner decisions: `1` (`SYS-MAIN-ADMISSION-ENFORCEMENT`)

No closed Product repair root is reopened by this evidence refresh.