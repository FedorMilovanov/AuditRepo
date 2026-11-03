# Case study: turning multi-agent audits into a current, actionable backlog

## Problem

Multiple agents can produce overlapping findings for the same product. If every observation is called an open defect, the backlog becomes an inaccurate mixture of old symptoms, fixes, optional ideas and real current failures. An historical report may reference a branch that no longer exists or a behavior already corrected in the Product.

## Design

AuditRepo separates **evidence intake**, **verification at a named anchor**, **root-cause synthesis** and **one active work matrix per project**:

```text
projects/<project>/incoming/  → raw observations + provenance
projects/<project>/verification/ and reverify/ → current applicability checks
projects/<project>/verified/MASTER_BUG_MATRIX.md → verified necessary work only
projects/<project>/WORK_QUEUE.md → optional, measurement-first improvements
projects/<project>/legacy/ → retired history, not active tasks
```

The executable and written authority for this workflow is [AUDITREPO_OPERATING_MODEL.md](AUDITREPO_OPERATING_MODEL.md), not this case study.

- [MULTI_WITNESS_VERIFICATION_PROTOCOL.md](MULTI_WITNESS_VERIFICATION_PROTOCOL.md) distinguishes current source, built artifact, browser/runtime, lifecycle and historical witnesses. Repeated greps from three agents are not three independent evidence angles.
- [CONCURRENT_EDIT_PROTOCOL.md](CONCURRENT_EDIT_PROTOCOL.md) helps agents avoid writing over a shared surface.
- [CLEANUP_RETENTION_POLICY.md](CLEANUP_RETENTION_POLICY.md) retains useful forensic history while retiring stale, duplicate, absorbed or solved rows from the active backlog.
- [PROJECT_REGISTRY.md](PROJECT_REGISTRY.md) maps project-scoped audit folders to their actual Product owners without pretending to keep an exact mirror of every live commit.

## Reproducible repository checks

The maintained validation code is inspectable:

```sh
python3 scripts/validate_audit_repo.py
python3 scripts/check_auditrepo_structure.py
python3 scripts/check_artifact_admission.py
```

Workflow gates are tracked under [.github/workflows/](.github/workflows/). They establish **repository/document structure and admission conditions**, not that a particular Product defect is still present. To approve a Product repair, separately inspect its current owner, HEAD/PRs and an applicable witness, then validate the exact repair and close the current matrix work unit.

## Result and honest limits

The architectural outcome is a traceable process that avoids conflating raw evidence, repair eligibility and settled history. It enables smaller, current, root-cause-oriented queues and prevents evidence from silently becoming Product authority.

The existence of this process does **not** demonstrate that all referenced projects have zero bugs, that every report is correct, or that the number of open issues/commits measures engineering quality. Counts and outcomes require fresh scoped checks.

**Contributor attribution:** [OWNER.md](OWNER.md). **Sensitive evidence:** [SECURITY.md](SECURITY.md).
