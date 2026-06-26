# Agent Orchestration Protection Proposal — gb-is-my-strength — 2026-06-26

## Purpose

Owner request for this pass: not just bug-hunt runtime regressions, but design stronger **negative protections** against agent collision/regression and stronger **positive orchestration rules** so future agents continue existing branch-lines instead of creating parallel conflicting implementations that later merge into production bugs.

This note records the proposed protection model and what was actually landed into the source repo policy documents during this pass.

---

## Historical problem pattern observed

Project history shows a repeated chain:

1. one agent performs locally reasonable work;
2. the session crashes / loses context / stops before full integration;
3. a later agent starts from current `main` or partial context only;
4. the later agent does not inspect nearby lane/branch/report history deeply enough;
5. overlapping runtime/layout/control work is reimplemented in parallel;
6. merge combines two different intentions, not just two diffs;
7. route-family-specific regressions appear (`PremiumControls`, `phase3`, `GBS2`, route-shell runtime, dist drift).

The key failure is therefore **not only code conflict** but **intent conflict**.

---

## Negative protections required

### 1. No blind restart
A new agent must not begin a fresh implementation in an area that already has related lane/branch/commit history without first inspecting that history.

### 2. No parallel reimplementation of the same seam
If an unfinished or recent lane already exists for the same route shell / control runtime / shared contract, default behavior must be continuation, narrowing, or explicit system escalation — not a second competing implementation.

### 3. No cross-lane silent shared-file rewrite
Route lanes must not silently rewrite system/shared files to solve local friction. That must become either:
- out-of-lane finding, or
- explicit `lane/system-*` / `lane/shared-*` work.

### 4. No blanket fix claims from one route witness
Shared shell/runtime claims must be verified by route family, not inferred globally from one page.

### 5. No merge without intent review
Merge-owner must verify whether two commits solve the same thing in incompatible ways.

---

## Positive protections required

### 1. Mandatory branch-awareness preflight
For conflict-prone zones, an agent should check:
- active/recent lane branches;
- closest prior lane report;
- relevant `git log --grep` history;
- latest audit/verifier notes.

### 2. Mandatory topology statement
Before work, the agent should explicitly identify:
- route family;
- shell/runtime family;
- source of truth;
- neighboring lanes/commits that could be regressed.

### 3. Continuation-first policy
If a previous lane/report exists for the same seam, the default should be to continue, refine, or repair that trajectory rather than fork a new conceptual path.

### 4. Route-family verification matrix for shared runtime
Any claim about GBS2 / PremiumControls / floating cluster / layouts / search/theme/share controls must be proven against representative route families.

### 5. Crash recovery from files/git, not chat memory
After a crash/restart, the next agent should recover state from lane docs, audits, git history, and production-like evidence.

---

## What was landed in source-repo policy during this pass

### A) `AGENTS.md`
Added new section:
- `9.29a Agent branch-awareness and anti-conflict protocol (2026-06-26)`

This section now codifies:
- forbidden blind restart;
- forbidden parallel seam reimplementation;
- forbidden global fix inference from one route proof;
- mandatory branch/history review before high-risk overlapping work;
- mandatory preflight notes for conflict zones;
- merge-owner conflict-intent review.

### B) `docs/WORK_MODES.md`
Added:
- `4a. Branch-awareness preflight for conflict-prone work`

This now requires branch/history/lane report review and a short written preflight statement for historically regressed zones.

### C) `docs/LANE_LOCK_POLICY.md`
Added:
- `7a. Extra checklist for overlapping / historically regressed zones`

This now requires lane declarations to record:
- related branches checked;
- related commits checked;
- closest prior lane/report;
- continuation vs parallel decision;
- representative route-family verification plan.

### D) `docs/refactor-2026/lanes/README.md`
Registered a new active SYSTEM lane for this policy hardening pass.

### E) Lane report created
Created:
- `docs/refactor-2026/lanes/system-agent-orchestration-protection-2026-06-26.md`

This records scope, allowed/forbidden files, checks, and goal for the protection work.

---

## Verifier assessment

This does **not** by itself guarantee safety. It is a process hardening layer, not a runtime proof.

But it directly targets the historical failure mode actually observed in this project:
- branch/context loss,
- overlapping agent work,
- accidental conceptual forks,
- later destructive merge convergence.

In other words: this is a meaningful **anti-regression governance fix**, not generic process prose.

---

## Remaining gap

The repo policy is now stronger, but the next real step should be technical enforcement where possible, for example:

1. guard script that fails if SYSTEM/shared files are touched from a non-system lane in a real git worktree;
2. optional lane declaration linter requiring `Related branches checked` fields in certain lanes;
3. merge checklist template for conflict-intent review;
4. route-family matrix templates for shared runtime claims.

Those would convert policy from documentation-only into partially executable enforcement.

---

## Verification status for this note

- `verified-source`: yes — policy text was written into repo docs
- `verified-build`: not applicable
- `verified-browser`: not applicable
- `verified-production-like-dist`: not applicable

This is a repo-process protection deliverable, not a runtime-site bug claim.
