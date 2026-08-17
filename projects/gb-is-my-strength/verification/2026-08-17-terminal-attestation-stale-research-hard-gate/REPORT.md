# Research hard-gate / terminal attestation reconciliation — 2026-08-17

## Scope

Read-only cross-repository control-plane reconciliation of the freshness-bound terminal attestation in `verified/MASTER_BUG_MATRIX.md`.

This wave does **not** mutate Product or Research, does not touch Research PR #182, and does not take ownership of the independent Research source-audit repair branch.

## Anchors

- Product `main`: `a2ef67da54dd4ae00aedae154422280620acdf21` (unchanged from the terminal Product evidence recorded by AuditRepo #309).
- AuditRepo `main` at reconciliation start: `feca55c651c9bfc584e9128aed032431cd2671da`.
- Research `main`: `8d6e5bc3f303d0a6a2d1a15969e042907f3387db`.
- Research workflow: `Total cross-repo source audit`.
- Failed scheduled run: `31996510796`, event `schedule`, created `2026-08-17T05:02:43Z`, conclusion `failure`.
- Failed job: `95289017759`, `Scan four repositories and enforce source baselines`.
- AuditRepo #309 terminal-attestation merge commit: `feca55c651c9bfc584e9128aed032431cd2671da`, timestamp `2026-08-17T17:53:32Z`.

The Research hard-gate failure therefore predates the AuditRepo #309 terminal attestation by roughly 12 hours 50 minutes.

## Direct failure witness

The failed Research job reached environment setup but did not reach substantive source-audit execution:

1. `Checkout committed audit code` — success.
2. `Set up Python` — success.
3. `Install hash-locked dependencies` — **failure**.
4. `Compile committed auditors` — skipped.
5. `Run deterministic total audit` — skipped.
6. `Run refined source-only audit` — skipped.
7. `Classify true dead sources` — skipped.
8. `Enforce actionable true-dead baseline` — skipped.
9. `Show executive reports` — skipped.
10. `Build reproducibility manifest` — skipped.
11. `Ensure audit execution was read-only` — skipped.
12. `Upload total audit evidence` — skipped.

The install failed closed on `charset-normalizer==3.4.1`: the committed lock expected SHA-256 `4c0907b1928a36d5a998d72e65b39e079c3b92e5f59a81cc2898170c1f8b3bb6`, while the CPython 3.12 Linux wheel downloaded by the runner had SHA-256 `bc2722592d8998c870fa4e290c2eec2c1569b87fe58618e67d38b4665dfa680d`.

This report does **not** classify that mismatch as malicious tampering. It records only the observed fail-closed dependency-lock mismatch and the resulting absence of a completed scheduled source audit.

## Freshness consequence

`AUDITREPO_OPERATING_MODEL.md` defines terminal `PRODUCT ZERO` / `AUDIT ZERO` claims as freshness-bound. A fresh red scheduled hard gate invalidates a current terminal witness until the red signal is classified and recovered with exact evidence.

Because run `31996510796` was already red before AuditRepo #309 was merged, the present-tense line `PRODUCT ZERO: CURRENT` in that merge cannot be used as a current admission witness.

This conclusion is deliberately narrow:

- it does **not** prove a Product code defect;
- it does **not** reopen the already repaired Product roots;
- it does **not** change the historical evidence that Product code-defect backlog was zero at the attested Product tree;
- it does prove that the **terminal/control-plane freshness witness is stale** until the Research hard gate is recovered and a new reconciliation is issued.

## Collision / ownership boundary

Research PR #182 (`audit(1cor11): consolidate evidence owners and quarantine false citations`) is an unrelated active agent lane and is untouched.

A separate Research branch, `agent/source-audit-lock-recovery-20260817`, advanced after this reconciliation began to commit `9eb87807a33a8e7cebfa4589710063b29d155a9d` (`fix(ci): rebuild source audit dependency lock`) and changes `requirements/source-audit.lock`.

That branch is treated as **owned by another agent**. This AuditRepo wave must not edit it, open/merge its PR, rewrite its ref, or duplicate its Product/Research mutation. AuditRepo records only the current red evidence and the closure contract.

## Admission-enforcement scope correction

Direct branch-state checks show required-status enforcement/protection is off not only for Product and AuditRepo `main`, but also for Research `main`.

Because Research is an authority-bearing input to Product admission and terminal freshness, `SYS-MAIN-ADMISSION-ENFORCEMENT` must cover **Product + AuditRepo + Research**, while remaining an owner decision. This report does not authorize a settings mutation and does not emulate protection with a workflow workaround.

## Closure conditions

`SYS-RESEARCH-SOURCE-AUDIT-HARD-GATE` may be removed only when all applicable conditions are evidenced:

1. the independent Research repair is validated on its exact head without weakening `--require-hashes` or the substantive audit assertions;
2. the relevant `Total cross-repo source audit` execution is green and actually reaches the deterministic audit, refined audit, dead-source classification, baseline enforcement and evidence-artifact steps;
3. the repair is integrated into then-current Research `main` without overwriting unrelated agent work;
4. a then-current Research-main execution provides a recovered hard-gate witness (push/manual/scheduled as appropriate to the merged owner);
5. AuditRepo reconciles then-current Product/Research/AuditRepo anchors and reissues, rather than merely repeats, any terminal `ZERO` attestation.

Until then, the prior `PRODUCT ZERO: CURRENT` text is historical/stale, not a current admission witness.
