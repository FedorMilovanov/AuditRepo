# MATRIX COVERAGE CONTROL-PLANE AUDIT

**Date:** 2026-08-01  
**Repository:** `FedorMilovanov/AuditRepo`  
**Audited base:** `2ef6cf66a011c46086758fea67d5732e1ec292b9`  
**Project:** `projects/gb-is-my-strength`  
**Scope:** canonical matrix/evidence registry semantics, diagnostics and CI regression coverage.  
**Boundary:** no product code, canonical matrix row, severity, open/closed status or counter is changed by this lane.

---

## 1. Trigger and reproduction boundary

A prior agent report claimed:

- commit `bf82d31`;
- unregistered IDs `RIGHT-4Q204-OPEN-SCHEMATIC` and `RIGHT-P72-TEXT-LINK-ONLY`.

Those objects are **not reproducible in the connected GitHub state** audited here:

- the commit is not present in `AuditRepo`, `Research` or `gb-is-my-strength`;
- the named working file is absent from current accessible refs;
- the two IDs are absent from current canonical matrix, registry and accessible reverify files.

Therefore this lane does **not** fabricate registry entries for them. If the missing evidence is later pushed, the hardened checker must fail with the exact reverify file and line. The verifier can then choose one evidence-backed disposition:

1. canonical matrix finding;
2. alias to an existing canonical finding;
3. `informational`, `retired` or `false-positive` registry entry with a non-empty reason.

The absence of the claimed GitHub objects does not invalidate the general risk described by the report; it means the specific two-ID result cannot be treated as committed evidence yet.

---

## 2. Reproduced control-plane defects

### CP-1 — misleading registry count

The existing CLI printed every `MATRIX_ID_ALIASES.json` entry as an alias.

Current registry composition at the audited base is:

| Status | Count |
|---|---:|
| canonical alias | 11 |
| informational | 7 |
| retired | 30 |
| false-positive | 4 |
| **total registry entries** | **52** |

Reporting “52 aliases” hides the distinction between root-cause mapping and noncanonical disposition. It can mislead reviewers into assuming all 52 IDs resolve to canonical bugs.

### CP-2 — suppression entries were not required to explain themselves

The old parser accepted non-alias statuses without machine-requiring a non-empty `reason`. An ID could therefore be suppressed as informational/retired/false-positive without a reviewable rationale.

### CP-3 — non-alias entries could carry ambiguous shape

A non-alias record could include a `canonical` field even though the status says it is not an alias. That creates two incompatible meanings in one registry object.

### CP-4 — `ignoredTokens` could become an undocumented finding-ID bypass

The old schema allowed finding-like strings in `ignoredTokens`. Such a token would bypass reverify registration checks without the structured status and reason required from normal registry entries.

### CP-5 — diagnostic location was incomplete

`UNREGISTERED-EVIDENCE` named the ID but not the exact source file and line. Reviewers had to run a second scanner and manually correlate output.

### CP-6 — duplicate detection implementations could drift

`matrix_coverage_lib.py` and `matrix_coverage_contexts.py` independently implemented structural ID discovery. A future change to headings, labels, backticks or table keys could make enforcement and context artifacts disagree.

### CP-7 — no dedicated black-box regression in CI

The matrix job enforced the current repository but did not test adversarial registry shapes or exact unregistered-ID location semantics.

---

## 3. Implemented correction

### Registry semantics

`matrix_coverage_lib.py` now:

- distinguishes `registryIds` from true `aliasIds`;
- reports per-status counts for `alias`, `informational`, `retired`, `false-positive`;
- requires every registry record to be an object;
- requires a non-empty `reason` for every registry disposition;
- requires valid canonical target only for `status: alias`;
- rejects `canonical` on non-alias statuses;
- rejects finding-like `ignoredTokens`, directing maintainers to a reasoned registry entry;
- preserves compatibility for canonical evidence mapping.

### Exact occurrence evidence

The engine now records structural occurrence data:

- relative file;
- exact line number(s);
- structural context: `heading`, `label`, `backtick`, `table-key`.

The enforcement diagnostic becomes:

```text
UNREGISTERED-EVIDENCE: reverify explicitly registers <ID> at <file>:<line> but matrix/registry does not
```

### Single source for context artifacts

`matrix_coverage_contexts.py` now consumes `build_report(...)["unregisteredEvidence"]`. It no longer owns a second ID-discovery implementation.

### Permanent regression coverage

New `scripts/matrix_coverage_regression_test.py` verifies:

1. 4 registry records with only 1 true alias are counted correctly;
2. an unregistered reverify ID returns exact file, line and structural context;
3. an evidence-backed informational registration clears the diagnostic;
4. missing `reason` fails closed;
5. `canonical` on non-alias status fails closed;
6. finding-like `ignoredTokens` fail closed.

The `matrix-coverage` CI job now compiles all four scripts and runs the regression before enforcing the real repository.

---

## 4. Intentional non-changes

This lane does not modify:

- `verified/MASTER_BUG_MATRIX.md`;
- `verified/MATRIX_ID_ALIASES.json` content;
- canonical counts;
- current source/production authority;
- any Site source file;
- the two unpushed/unreproducible `RIGHT-*` IDs.

This is deliberate. A control-plane repair must improve detection before it classifies evidence that is not present.

---

## 5. Acceptance criteria

The lane is acceptable only if the exact PR head passes:

1. Python compilation for the coverage CLI, engine, context generator and regression;
2. `matrix_coverage_regression_test.py`;
3. real repository `check_matrix_coverage.py` in blocking mode;
4. context JSON/Markdown generation from the same report model;
5. standard AuditRepo structure/rules validation;
6. complete repository-history forensic job;
7. clean final tracked tree.

Local pre-push synthetic regression result:

```text
matrix coverage regression tests: PASS
```

GitHub Actions on the exact PR head remains the authoritative repository acceptance witness.

---

## 6. Verifier guidance for future unregistered IDs

When the checker reports a new ID:

1. open the exact reported file and line;
2. decide whether the text is actually registering a finding rather than mentioning prose;
3. if it is a finding, map it to matrix or registry with evidence-backed reason;
4. do not use `ignoredTokens` for finding-shaped IDs;
5. do not turn documentation/right-policy labels into product bugs solely to make CI green;
6. do not mark an item informational without explaining why it is noncanonical;
7. rerun the regression and real project checker.

```text
CONTROL PLANE: HARDENED
PHANTOM EVIDENCE: NOT FABRICATED
MATRIX/COUNTERS: UNCHANGED
EXACT-LOCATION DIAGNOSTICS: ADDED
REGRESSION CI: ADDED
```
