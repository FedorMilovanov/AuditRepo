# Contributing / Agent Workflow

AuditRepo is a **multi-agent evidence, verification and work-selection workspace**.

Canonical rules: [`AUDITREPO_OPERATING_MODEL.md`](AUDITREPO_OPERATING_MODEL.md).

## Core flow

```text
incoming     = raw observations/evidence
working      = temporary synthesis
verification = package/current checks
reverify     = significant applicability checks
MASTER       = only verified necessary work still needing action
legacy       = retired searchable reference, never backlog
```

## What may enter MASTER

MASTER is not limited to bugs. A current row may be:

- reproduced defect;
- verified necessary implementation/improvement;
- system/root-cause repair;
- required migration/retirement;
- narrowed residual;
- owner decision blocking real work.

Do not promote a speculative idea merely because an auditor suggested it. For an improvement to enter MASTER, verification must show why the project genuinely needs it now.

## Official audit input

```text
projects/<project>/incoming/<agent-name>/<YYYY-MM-DD>/
```

Record the applicable anchor/environment, observed behavior, evidence, limitations, confidence and possible mechanism. Raw reports stay useful even if later disproved.

## Verification wave

A wave may process any size package. It should answer:

1. What exists now?
2. What is genuinely necessary work?
3. Which claims are one root cause?
4. Which are stale/duplicate/invalid/optional?
5. Which decisions require the owner?
6. Which current Product owners/PRs already occupy the relevant surface?

Use independent evidence angles proportionate to risk: source, artifact, browser/runtime, live, lifecycle/history. High-risk security/rights/release/data-loss decisions need stronger multi-witness evidence; ordinary local work can use a smaller direct proof.

## Continuous cleanup

A solved or obsolete row does not stay in MASTER.

```text
verify → work → verify result → remove from MASTER → legacy if useful
```

In the same closure/consolidation wave:

- remove fixed/absorbed/stale/invalid/duplicate/superseded rows;
- collapse related symptoms into one `SYS-*` root;
- move optional non-mandatory improvements to Work Queue;
- keep only useful retirement mapping in legacy.

Do not create or maintain a second active matrix.

## Implementation handoff

Before Product mutation:

1. choose a current MASTER work unit;
2. read relevant evidence/legacy only as context;
3. inspect current Product HEAD/open PRs/branches;
4. identify owner and shared/protected files;
5. recheck the evidence-critical current surface;
6. avoid parallel SYSTEM work;
7. implement at the smallest useful root-cause level;
8. after merge/result verification, remove the completed work unit from MASTER.

Historical evidence is never automatic permission to edit current Product.

## Optional improvements

`WORK_QUEUE.md` is for measurement-first performance work, speculative or optional refactoring and polish. It is not a second matrix. Promote an item to MASTER only when verification establishes that it has become genuinely necessary current work.

## Legacy

`legacy/` preserves retired context so regressions, contradictions and old decisions can be investigated. Do not delete valuable legacy casually. Also do not treat it as tasks: a legacy item must pass a new current applicability check before being reintroduced.

## Branch/PR hygiene

Periodically inspect AuditRepo refs and closed/unmerged PRs. Integrate unique useful evidence, delete proven-obsolete working refs, and retain intentional archive refs only when they preserve real forensic value.

## Do not

- keep closed rows in MASTER for history;
- preserve one symptom per row when one current root explains the class;
- call every improvement a bug;
- put unverified wish-list work into MASTER;
- treat legacy as backlog;
- open a competing Product lane where an owner already exists;
- confuse repeated identical greps with independent witnesses;
- require live evidence for a source-only claim;
- create heavyweight documentation/workflow machinery for a small problem.

## Minimum useful contribution

A contribution should do at least one of these: add strong evidence, disprove noise, establish a necessary improvement, collapse duplicates into a root, improve prioritization, close verified work, or make the active working surface simpler.