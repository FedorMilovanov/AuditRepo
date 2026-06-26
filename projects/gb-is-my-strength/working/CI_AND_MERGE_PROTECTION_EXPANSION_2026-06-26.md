# CI and Merge Protection Expansion — gb-is-my-strength — 2026-06-26

## Purpose

Extend the agent-protection hardening pass into two additional areas requested by the owner direction:

1. stronger CI visibility for lane/process discipline;
2. stronger merge-time anti-regression documentation for overlapping agent lines.

---

## What was changed in source repo during this pass

### 1) Shared-files workflow now also runs lane declaration lint
Updated:
- `.github/workflows/shared-files-guard.yml`

New behavior:
- on `main` / PR to `main`: run `npm run lane:declaration:lint`
- on `lane/**` / `agent/**`: run the same lint as warning (`continue-on-error: true`)

This is important because the workflow previously checked shared/system file discipline, but not the quality/presence of lane declarations themselves.

### 2) Merge conflict-intent checklist added
Created:
- `docs/refactor-2026/MERGE_CONFLICT_INTENT_CHECKLIST.md`

Purpose:
- force merge-owners/integrators to review conceptual collision, not just textual conflict;
- require route family / shell family / witness review when integrating overlapping agent lines.

This directly targets the known historical failure mode: two locally reasonable branches that become destructive only after integration.

### 3) Route-family verification template added
Created:
- `docs/refactor-2026/ROUTE_FAMILY_VERIFICATION_TEMPLATE.md`

Purpose:
- standardize claims about GBS2 / PremiumControls / floating-cluster / layouts / shared controls;
- stop global conclusions from being inferred from one route.

### 4) Lane index now points integrators to merge checklist
Updated:
- `docs/refactor-2026/lanes/README.md`

This makes the checklist discoverable at the place where merge/review coordination already happens.

### 5) Current SYSTEM lane report expanded to include this broader protection scope
Updated:
- `docs/refactor-2026/lanes/system-agent-orchestration-protection-2026-06-26.md`

---

## Important verifier note

While implementing CI integration, a practical issue surfaced:

- a repo-wide strict lint over **all historical lane reports** would immediately fail because many older lane docs predate the stronger declaration schema.

So the initial enforcement was intentionally scoped to:
- `npm run lane:declaration:lint` on **changed lane files only** by default.

This is the correct rollout strategy for now, because it hardens future/current work without falsely red-failing the entire legacy lane archive in one shot.

---

## Verifier assessment

This is a good incremental hardening pattern:

- first define policy;
- then add local guards;
- then add CI visibility;
- then add merge review artifacts;
- then avoid breaking rollout by grandfathering historical docs unless touched.

That is materially stronger than documentation-only protection and avoids performative “strictness” that would instantly become noisy and ignored.

---

## Remaining next steps

1. add optional future migration plan for legacy lane docs to the new schema;
2. consider wiring lane lint into `ci:check` if owner wants even stronger local discipline;
3. consider a dedicated integrator report template for conflict-intent review outputs;
4. continue deep runtime verification so process protection stays tied to actual bug families.

---

## Verification status

- `verified-source`: yes
- `verified-build`: not required
- `verified-browser`: not applicable
- `verified-production-like-dist`: not applicable
