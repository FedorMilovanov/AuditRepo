# Wave 5 — GitHub issue lifecycle

**Result:** governance implemented; current administration narrowed to owner action  
**Inventory:** 22 issues, 4 open, 18 closed

## Root cause

AuditRepo used GitHub issues for four different semantics—active coordination, closure request, evidence receipt and transport probe—without a lifecycle label contract. Consequently 21/22 issues were unlabeled and open-state falsely suggested four active work items.

## Durable contract

`CONTRIBUTING.md` now requires exactly one lifecycle label for a new open issue:

- `state:active` — current actionable coordination;
- `state:evidence` — receipt/archive, not backlog;
- `state:superseded` — stale, contradicted or replaced;
- `state:diagnostic` — probe/transaction, not Product work.

All four labels were created in the live repository. Current engineering authority remains in project MASTER; issue text cannot become a competing SSOT.

## Current open classification

| Issue | Durable classification | Evidence |
|---|---|---|
| #489 `probe` | `state:diagnostic` | title and body contain only `probe`; no work boundary or comments |
| #485 PR #517 evidence | `state:evidence` | body says merge/deploy/post-merge QA complete and explicitly calls itself evidence-only |
| #484 PR #517 pending | `state:superseded` | #485 explicitly supersedes its pending-QA paragraph |
| #437 close COMM-ABUSE | `state:superseded` | request claims terminal 2026-09-12 proof, but later current TLP matrix/reverify keeps `TLP-COMM-ABUSE-001` active pending two human Turnstile profiles |

Applying labels through both GraphQL (`gh issue edit`) and REST `POST /issues/{n}/labels` returned `403 Resource not accessible by integration`. No issue was closed or edited. This is an external administration boundary, not evidence that repository policy failed.

## Closed history

The 18 closed issues are already terminal history. Backfilling labels on all of them would create churn without changing active authority, so it is not required. A future issue must receive one lifecycle label at creation/triage.

## Branch-protection correction

The earlier baseline could not read the admin-only protection endpoint and correctly left details UNPROVEN. A separate public branch-metadata readback is available and now proves:

- `main.protected=true`;
- protection enabled with enforcement `everyone`;
- required GitHub Actions contexts: `validate` and `preflight`, app id `15368`.

This independently agrees with the owner closure receipt in issue #373. Admin-only details still return 403, so force-push/deletion/admin settings are supported by that owner receipt rather than newly re-read by this integration.

## Remaining owner action

Apply the four classifications above and decide whether the diagnostic/evidence/superseded records should be closed. Closure was not attempted because it is irreversible administration and the integration lacks issue-write permission.
