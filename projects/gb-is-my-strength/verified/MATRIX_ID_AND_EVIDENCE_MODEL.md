# Matrix ID and evidence model

Status: canonical governance contract for `MASTER_BUG_MATRIX.md` and `scripts/check_matrix_coverage.py`.

## Canonical findings

A canonical finding is a stable ID in the first column of one of the active matrix tables:

- `✅ ЗАКРЫТО`;
- `P0/P1/P2/P3 — ОТКРЫТО`;
- `РЕФАКТОРИНГ`;
- `AUDITREPO`.

Historical auditor/session tables are evidence logs, not a second canonical registry. IDs repeated there do not create duplicate canonical rows. Rows outside the four canonical section families are never counted as canonical merely because their first cell resembles an ID.

Every canonical ID appears in exactly one active table. A finding cannot remain in an open table after the same ID has been promoted to `✅ ЗАКРЫТО`; the superseded row must move to archive evidence. The first generic-checker finding was `CI-INDEXNOW-CHECKER-STALE`: its fixed row remains canonical and the obsolete P2 copy is preserved in `archive/fixed/2026-07-23-current-truth-cleanup/CANONICAL_DUPLICATE_CI_INDEXNOW.md`.

The ID grammar is repository-wide rather than prefix-allowlisted: an uppercase-leading alphanumeric segment followed by one or more hyphen-separated segments. This covers current families such as `CI-*`, `GILL-*`, `TTS-*`, `D-*`, `NG-*`, `MAP-*` and future families without changing the checker.

## Historical IDs

An explicit ID in `reverify/`, `incoming/` or `working/` must resolve through exactly one of:

1. the canonical matrix row;
2. `MATRIX_ID_ALIASES.json` as a same-root alias;
3. a documented `retired`, `informational` or `false-positive` disposition.

Aliases may not target missing canonical IDs. A historical ID cannot be ignored merely because its wording is inconvenient.

## Evidence for open findings

An open finding must have at least one traceable witness:

- its explicit ID in an active evidence document;
- an existing evidence-document path in the matrix row;
- an immutable `verified-source`, `verified-browser`, `verified-ci` or `verified-build` witness with a source SHA;
- archived evidence, reported separately as archived-only.

Broken evidence paths are failures. The matrix row itself is not independent evidence.

## Enforcement rollout

The coverage job remains diagnostic while historical IDs and orphan claims are reconciled. It becomes blocking only when:

- every explicit historical ID has a reviewed resolution;
- every open finding has traceable evidence;
- mutable closed references are zero;
- the diagnostic reports zero problems on a clean PR head.
