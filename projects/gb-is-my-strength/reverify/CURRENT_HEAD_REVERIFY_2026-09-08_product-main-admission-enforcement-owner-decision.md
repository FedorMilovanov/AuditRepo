# Current-head reverify — `SYS-MAIN-ADMISSION-ENFORCEMENT`

## Disposition

`CURRENT OWNER DECISION / re-admitted after consolidation omission`

This receipt does not classify branch protection as a Product code defect or release-runtime defect. It restores a governance owner decision that was previously canonical, remained unresolved, and was silently omitted by a later wholesale MASTER consolidation without an explicit disposition.

## Current anchors

- Reverify date: 2026-09-08
- Product repository: `FedorMilovanov/gb-is-my-strength`
- Current Product `main`: `c65b83a6588187c71b6e39c720d2b6666b4959c2`
- Product branch endpoint: `protected=false`
- Product branch protection: disabled; required status-check enforcement off
- Product repository rulesets: `[]`
- AuditRepo current `main` at re-admission start: `2afb84205cbb14d429c1913b6c89b7fc9998f069`
- AuditRepo `main`: protected, with required `validate` and `preflight`

Therefore the historical multi-repository owner scope is narrowed: the current unresolved owner decision in this project is Product `main` admission enforcement. AuditRepo no longer belongs in the unresolved set because it now has native protection and required checks.

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

AuditRepo PR #345 (`verify(gb): consolidate MASTER to causal owners`) wholesale-rewrote the active matrix into the 12 Product causal/root packages derived from evidence #344. Its patch changed `Owner decisions` to `0` and left the OWNER DECISIONS table empty.

That rewrite contains no explicit retirement, acceptance, duplicate/absorption target, or closure proof for `SYS-MAIN-ADMISSION-ENFORCEMENT`. The change was therefore not a valid governance disposition; it was an omission caused by changing the matrix taxonomy to Product causal packages.

The current fresh Product witness independently demonstrates that the underlying decision remains unresolved.

## Why repository workflows do not close this owner

Product has extensive fail-closed workflow contracts, and current repair lanes use exact-head CI plus expected-head/CAS merge discipline. Those are useful process controls but are not a substitute for native server-side admission enforcement when `main` itself remains unprotected.

A repository workflow file cannot make GitHub reject an unauthorized/direct main update before it lands. Manufacturing a workflow-only surrogate would therefore change the closure condition rather than satisfy it.

## Tool/control boundary

The connected GitHub integration can read branch/ruleset state but exposes no administration write action for branch protection or repository rulesets. Managed installation access in this session excludes the GitHub administration permission required for that settings mutation.

Therefore this AuditRepo transaction may truthfully re-admit and precisely scope the decision, but it cannot perform the native Product settings change.

## Closure boundary

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

Re-admit one owner decision without reopening closed Product repair roots:

- active work units: `1 -> 2`
- direct current defects: remain `0`
- system verification lanes: remain `1`
- owner decisions: `0 -> 1`

The other active unit remains `FRAGMENTED-SECURITY-OWNERSHIP`. No Security closure is inferred here.