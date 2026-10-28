# Wave 3 — project/workflow contract

**Result:** `AR-PROJECT-CONTRACT-001` closed  
**Scope:** repository shape validator, project registry, all seven project folders, five workflows

## False-green mechanism

`check_auditrepo_structure.py` required directories plus `README.md` and `PROJECT_META.yml`, but not the files that the operating model names as current owners. Therefore `code-audit` passed while lacking `DOC_MAP.md`, `WORK_QUEUE.md`, `SYSTEM_THEMES.md` and `CLOSURE_LEDGER.md`. Registry called it `intake-only`, although it already had a reconciled terminal-zero MASTER.

## Repair

- The structure gate now requires canonical authority files for every non-template project.
- `code-audit` received compact owner files rather than copied historical content.
- Its registry status is now `paused`: current work is terminal-zero, evidence remains accepted, and no unstable synthesis is implied.
- The ordinary Validate workflow's explicit forensic summary list now includes `unledgeredClosedUnmergedPrs`, matching the strict script contract.

## Workflow/control-plane review

All five workflow YAML files passed syntax/action-pin preflight. Manual inspection covered triggers, permissions, concurrency, zero-work paths and mutation boundaries:

- Validate runs structure and repository rules on every PR/push; expensive matrix/history checks are path-scoped, while weekly/manual Deep Audit performs complete coverage.
- Matrix path resolution already fails closed on zero resolved corpora.
- Ref retirement is the only write-capable workflow. It is restricted to reviewed request files, exact SHAs, current main, same-repository labeled PRs or merged requests, protects open-PR/archive refs, and performs post-delete live verification.
- CrossWire custody is read-only and exact-commit checkout; its external package freshness is manual/event-driven, not represented as continuous production authority.
- No unpinned third-party Action, implicit write permission, force path or silent zero-work success was confirmed.

Branch protection remains UNPROVEN because both REST and GraphQL return integration HTTP 403. Empty repository rulesets alone is insufficient to infer that `main` is unprotected.

## Verification

Structure, repository validator/regression, workflow preflight/regression and per-project matrix coverage pass with the canonical contract. No Product repository or remote ref was mutated.
