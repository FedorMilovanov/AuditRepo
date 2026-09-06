# Current-head reverify — code-audit active-row reconciliation

## Boundary

- Source repo: `3stoneBrother/code-audit`
- Current source `main`: `6f88ae38ffdb1cd7e9821f28d417b255b4489be7`
- AuditRepo purpose: re-check the three rows currently retained in `verified/MASTER_BUG_MATRIX.md`; preserve historical intake/synthesis without rewriting it.

The historical intake and synthesis cite source anchor `1e57c6b548b2611a1340b080534c07802804550f`. GitHub no longer resolves that commit in the current source repository. Current source `main` is a root commit, so the old anchor cannot be treated as current-source authority or ancestry proof. This does not invalidate evidence-at-anchor; it requires a fresh applicability check before retaining active rows.

## Current checks

### `BASH-COMMAND-INJECTION-WRAPPER`

**Disposition: stale / not current.**

Current `references/core/audit.sh` passes user-derived values as quoted arguments. The output path is passed as:

```bash
--output "$OUTPUT"
```

and project path, language, format, engine and config path are likewise quoted at the execution boundary. The current repository tree contains exactly one tracked `.sh` file, this wrapper. The historical unquoted-`$OUTPUT` mechanism is therefore not reproduced on current source.

### `INSECURE-SHELL-INTERACTION`

**Disposition: stale / no independent current residual.**

This system row was introduced to require a sweep of shell wrappers for missing quoting/insecure variable expansion. The current source tree has one shell script and the relevant user-controlled execution arguments in that script are quoted. No second shell owner or current class-level manifestation was established. Keeping a SYSTEM row after its only known mechanism is absent would turn MASTER into historical biography rather than current work.

### `LOCAL-PATH-DISCLOSURE-ENGINE`

**Disposition: not established as a current necessary defect; remove from active MASTER.**

Current `ConfigLoader.load_matrix()` raises:

```python
raise FileNotFoundError(f"Security controls matrix not found: {matrix_path}")
```

The normal wrapper passes its own local `references/` configuration directory to the engine. A missing bundled configuration can therefore expose a local filesystem path in a CLI error to the same operator. The historical report itself made impact conditional on a shared-server/CI-log audience. No current network service, multi-tenant log consumer, privilege boundary, secret-bearing path, or other external disclosure boundary was established. Under AuditRepo admission rules, topology alone is insufficient to keep this as a current security defect. A future concrete trust-boundary witness can re-admit a narrowed row; otherwise relative-path wording is optional hardening/polish.

## Historical risk-only claims

The historical `INSECURE-TEMPLATE-JSON-INJECTION` and `ENGINE-RE-DOS-RISK` observations remain raw/synthesis evidence-at-anchor. They are not promoted here: the JSON claim was explicitly hypothetical about downstream HTML embedding, and the regex claim was a generic risk contingent on hostile pattern ownership rather than a reproduced current exploit or failure boundary.

## Result

| Class | Before | After |
|---|---:|---:|
| Direct current defects | 2 | 0 |
| System verification lanes | 1 | 0 |
| Total active work units | 3 | 0 |

No historical intake or synthesis file is deleted or rewritten. The active matrix is reduced to zero because none of its three rows survives current-source applicability review at `6f88ae38ffdb1cd7e9821f28d417b255b4489be7`.

## Reopen triggers

Reverify rather than automatically revive if any of the following appears:

- a current unquoted user-controlled shell argument at an execution boundary;
- another current shell wrapper with the same class mechanism;
- a concrete external/multi-tenant audience for filesystem-path errors;
- a reproducible current failure/exploit for the historical JSON or regex risk claims.
