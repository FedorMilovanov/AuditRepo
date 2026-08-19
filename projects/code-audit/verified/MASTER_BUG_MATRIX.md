# MASTER BUG MATRIX — code-audit

> SSOT for current verified necessary work only. This is not a history table or a mirror of every source-repository signal.

## Current state

| Field | Value |
|---|---|
| Active work units | **4** |
| Direct current defects | **2** |
| Verified necessary improvements | **0** |
| Narrowed residuals | **0** |
| System verification lanes | **1** |
| Owner decisions | **0** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

## CURRENT DEFECTS — 2

| ID | Current problem | Boundary |
|---|---|---|
| `BASH-COMMAND-INJECTION-WRAPPER` | Unquoted `$OUTPUT` variable in `audit.sh` allows arbitrary command execution. | HEAD 1e57c6b |
| `LOCAL-PATH-DISCLOSURE-ENGINE` | Engine reveals absolute internal server paths in FileNotFoundError messages. | HEAD 1e57c6b |

## VERIFIED NECESSARY IMPROVEMENTS — 0

| ID | Needed implementation | Why |
|---|---|---|

## NARROWED RESIDUALS — 0

| ID | Current residual |
|---|---|

## SYSTEM VERIFICATION LANES — 1

| ID | Verified work package | Next boundary |
|---|---|---|
| `INSECURE-SHELL-INTERACTION` | Audit all shell scripts for missing quotes and insecure variable expansion. | Pass on all `.sh` files. |

## OWNER DECISIONS — 0

| ID | Missing decision |
|---|---|

## Terminal disposition

The matrix may be empty. Admit a row only after signal classification, exact-anchor applicability, current necessity and ownership are established. Remove solved, stale, duplicate, absorbed and superseded rows in the same closure transaction.
