# AuditRepo ref retirement

This directory stores reviewed, immutable requests for deleting remote AuditRepo branches that no longer own unique work.

## Principle

A branch may be retired only when its evidence is already reachable from `main`, intentionally preserved under `archive/`, or explicitly superseded by a merged successor.

Lower branch count is not sufficient justification. Raw evidence and intentional forensic archives are not cleanup targets.

## Request contract

Requests live under `requests/` as JSON. The original target request remains immutable after review.

Every target must provide:

- an exact branch name;
- the exact expected head SHA;
- a reviewed classification;
- either an `ancestor` proof or a `superseded` proof;
- replacement PRs and an exact changed-path set when the head is not an ancestor of `main`.

A later execution wrapper may name one original request through a same-directory `requestRef`. The wrapper contains no branch allowlist and cannot weaken or replace the original proofs.

## Execution channels

The preferred path is a request merged to `main`, which triggers the permanent push workflow.

GitHub App transactions do not always dispatch a follow-up push workflow. For that case, a same-repository PR may add exactly one immutable execution wrapper and update the permanent engine. After ordinary PR validation and review, the exact label `execute-ref-retirement` starts the same fail-closed request before merge.

The label channel is restricted to same-repository PRs. It uses the live base `main` SHA, rejects any concurrent `main` movement, and dynamically protects every open-PR head.

## Safety barriers

The engine refuses to delete:

- `main`;
- any `archive/*` ref;
- any retained ref named by the request;
- the head of an open pull request;
- a branch whose live SHA changed after review;
- any target when an unreviewed remote branch has appeared;
- any target when live `main` differs from the reviewed execution base.

It performs a complete preflight before the first DELETE, verifies every target as HTTP 404 afterward, defers an open source branch, prunes local remote refs, reruns repository validation and deep history forensic, and uploads machine-readable evidence.

The standalone Python engine is dry-run by default. Destructive execution requires the explicit `--execute` flag supplied only by the reviewed workflow.

## Retention

Keep original request JSON files and execution wrappers permanently. Together they record the reviewed reason, exact allowlist and execution channel for a destructive Git operation.

Execution artifacts are supplementary evidence. A later compact result document may record the final live branch inventory without rewriting the original request.
