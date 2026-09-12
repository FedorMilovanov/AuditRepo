# Current-head reverify — Product main native admission closure — 2026-09-13

## Classification

- Root: `SYS-MAIN-ADMISSION-ENFORCEMENT`.
- Prior state: governance owner decision.
- Current disposition: **closed by native server-side enforcement**.
- Product tracking issue: `gb-is-my-strength#1927`.
- Product `main` anchor during live readback: `37e89af29ae0b8aaa7a18c82778b504d646e40b4`.
- AuditRepo base: `8c1701ce5b97f0781583743c53b08780a816bfff`.

## Pre-mutation witness

Before the change, the Product `main` protection endpoint returned HTTP 404 `Branch not protected`.

The two candidate required checks were re-verified on the current open Product PR #2022 exact head `04ea598cd777bf66a18574b0dc97b6ed1fecb5c3`:

- `guard` — Shared Files Guard job — SUCCESS;
- `Validate source metadata without building dist` — Metadata & IndexNow Readiness job — SUCCESS.

Both are ordinary pull-request checks and were the previously selected always-created admission contexts in Product issue #1927.

## Native protection applied

Repository administration was performed through the owner's authenticated GitHub CLI, not through a repository-code workaround.

Live branch protection now requires:

- strict required status checks: `guard` and `Validate source metadata without building dist`;
- pull-request admission before merge;
- required approval count: 0;
- `enforce_admins=true`;
- required conversation resolution;
- force pushes disabled;
- branch deletion disabled;
- linear history not required;
- branch locking disabled.

No content-specific/path-filtered job was made globally required.

## Independent live readback

A second server-side read after the write reports:

- branch `main`: `protected=true`;
- protection: `enabled=true`;
- enforcement level: `everyone`;
- strict status checks enabled;
- exact contexts: `guard`, `Validate source metadata without building dist`;
- both checks are owned by GitHub Actions app id `15368`.

Product issue #1927 received the live receipt as comment `5649141006` and was closed as completed.

## Root-cause closure

The former governance gap was not a missing workflow; it was the absence of server-side admission enforcement. That mechanism is now present and independently re-read from GitHub.

Repository CI/CAS discipline remains useful, but it is no longer the only protection against an accidental/direct write to `main`.

## MASTER consequence

Remove `SYS-MAIN-ADMISSION-ENFORCEMENT` from active arithmetic.

New active state:

- direct current defects: 0
- verified necessary improvements: 0
- narrowed residuals: 0
- system verification lanes: 0
- owner decisions: **2**
- active work units: **2**

Remaining independent owners:

- `FRAGMENTED-SECURITY-OWNERSHIP`;
- `GBS-SEARCH-CONTROL-PLANE-001`.

## Negative boundaries

This closure does not infer anything about the remaining security/header topology decision or the external Google Search Console submission/ownership boundary.
