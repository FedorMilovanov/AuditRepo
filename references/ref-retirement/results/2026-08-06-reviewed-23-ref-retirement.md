# AuditRepo reviewed 23-ref retirement result — 2026-08-06

## Scope

- Original immutable request: [`../requests/2026-08-06-auditrepo-branch-cleanup.json`](../requests/2026-08-06-auditrepo-branch-cleanup.json)
- Permanent tested engine: `scripts/retire_reviewed_refs.py`
- Accepted execution wrapper merge: PR #219, commit `4a766f62ae342d90b3d36b59274f4748d4cb680e`
- Result certification: PR #222, commit `36f6328a7f703ec65b3461b1223ad05fa4250cc3`
- Product, Research and The Legendary Poet source repositories: not mutated
- `MASTER_BUG_MATRIX.md` and finding dispositions: not changed

## Reviewed outcome

The complete request preflight passed and the engine retired all 23 pinned remote refs:

- 19 exact heads proven to be pure ancestors of `main` with no unique files;
- 4 exact diverged heads proven superseded by merged successor PRs and exact changed-path sets.

Every target was absent in the live GitHub branch inventory after execution. There was no partial-retirement state.

## Retained live refs

The terminal GitHub branch inventory is intentionally limited to:

1. `main`;
2. `archive/forensic-pr-3-vosk-tts-report-2026-07-24`;
3. `archive/legacy-diverged-heads-20260801`.

Both archive refs are intentional evidence/recovery owners. They are not active work branches or cleanup debt. Result/cleanup PR heads were temporary and are removed by normal post-merge branch cleanup.

## Independent post-execution verification

Matrix/evidence verification run `31107103796` established before its unrelated unauthenticated API rate-limit stop:

- matrix coverage regression: PASS;
- canonical IDs: `376`;
- closed rows: `231`;
- open rows: `145`;
- evidence files: `404`;
- unresolved coverage contexts: `0`.

Authenticated strict repository-history verification run `31107123090` then completed successfully and recorded:

- inaccessible closed heads: `0`;
- manual closed-PR review candidates: `0`;
- unexplained remote branches: `0`.

The strict forensic artifact is `8970048819` (`ref-retirement-forensic-31107123090`, SHA-256 `059893d61f8f9fb9c56724c19aa6fd7b34da26091a93a95d4fe55fdafbf5fddf`).

## Evidence retained

- the immutable target request and its exact SHAs/reasons;
- reviewed closed-unmerged PR dispositions;
- permanent dry-run-by-default engine and black-box regressions;
- accepted/failed transport history in merged and closed PR history;
- this compact terminal result and strict forensic artifact.

The one-time execution wrapper files were removed after certification. Their provenance remains in PRs #218, #219 and repository history; they are not permanent executable inputs.

No raw audit evidence was deleted. Removing remote branch names did not remove evidence already reachable from `main`, merged PR history or the two retained archive refs.

## Permanent CI post-condition

Any change under `references/ref-retirement/results/` runs authenticated strict repository-history forensic in ordinary AuditRepo Validate and requires:

- inaccessible closed heads: `0`;
- manual closed-PR review candidates: `0`;
- unexplained remote branches: `0`.

The result is accepted only when that exact CI check is green.
