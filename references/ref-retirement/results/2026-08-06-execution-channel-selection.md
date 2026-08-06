# AuditRepo ref-retirement execution channel selection — 2026-08-06

## Outcome

The permanent retirement engine supports reviewed push and same-repository label execution.

Two alternative transport ideas were evaluated but not retained as active control paths:

- a repository-owner review-command trigger was not added;
- GitHub auto-merge could not be queued because this repository has no required merge blocker once ordinary validation is green.

The accepted execution path is an immutable wrapper merged from the exact `sourceBranch` named by the reviewed request. The resulting main update is consumed by the existing push workflow, which performs complete live preflight before the first DELETE.

## Safety boundary

This record changes no retirement target, expected SHA, replacement PR, retained ref, Product state, matrix row or finding disposition.
