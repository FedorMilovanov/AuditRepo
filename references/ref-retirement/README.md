# AuditRepo ref retirement

This directory stores reviewed, immutable requests for deleting remote AuditRepo branches that no longer own unique work.

## Principle

A branch may be retired only when its evidence is already reachable from `main`, intentionally preserved under `archive/`, or explicitly superseded by a merged successor.

Lower branch count is not sufficient justification. Raw evidence and intentional forensic archives are not cleanup targets.

## Request contract

Requests live under `requests/` as JSON and are executed only after they merge to `main`.

Every target must provide:

- an exact branch name;
- the exact expected head SHA;
- a reviewed classification;
- either an `ancestor` proof or a `superseded` proof;
- replacement PRs and an exact changed-path set when the head is not an ancestor of `main`.

The workflow refuses to delete:

- `main`;
- any `archive/*` ref;
- any retained ref named by the request;
- the head of an open pull request;
- a branch whose live SHA changed after review.

It performs a complete preflight before the first DELETE, verifies every target as HTTP 404 afterward, removes its merged maintenance source branch when safe, reruns repository validation and deep history forensic, and uploads machine-readable evidence.

## Retention

Keep request JSON files permanently. They are the reviewed reason and exact allowlist for a destructive Git operation.

Execution artifacts are supplementary evidence. A later compact result document may record the final live branch inventory without rewriting the original request.
