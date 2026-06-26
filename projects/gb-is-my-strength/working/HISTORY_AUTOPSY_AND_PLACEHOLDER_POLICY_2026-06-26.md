# History Autopsy and Placeholder Policy Pass — gb-is-my-strength — 2026-06-26

## Purpose

Continue the owner-requested deeper audit by focusing on:
- thin/critical agent mistakes from history,
- false protection patterns,
- false-green reasoning,
- and small surgical policy additions that reduce future misclassification.

---

## Core verifier conclusion from this pass

The repo’s hardest failures are not only broken code. They are also **broken classification**:

- local truth mistaken for global truth;
- route presence mistaken for implementation completion;
- structural markers mistaken for behavioral proof;
- formal discipline mistaken for safety.

That is a more dangerous class of failure because it can survive inside apparently “protected” workflows.

---

## What was added to source-repo policy/docs

### 1) Placeholder route policy document
Created:
- `docs/refactor-2026/PLACEHOLDER_ROUTE_POLICY.md`

Why:
- to explicitly separate final premium routes from placeholder-stage public routes;
- to stop agents/verifiers from treating baseline/search/sitemap presence as owner-final sign-off.

### 2) History autopsy document on false protection
Created:
- `docs/refactor-2026/HISTORY_AUTOPSY_FALSE_PROTECTION_2026-06-26.md`

Why:
- to explain the real failure classes seen in this repo:
  - conceptual collision despite lane discipline,
  - source/build markers mistaken for runtime truth,
  - one-route proof generalized to family truth,
  - publication mistaken for completion,
  - guard existence mistaken for guard sufficiency.

### 3) `AGENTS.md` surgical addition
Added new section:
- `9.28a Placeholder route policy — do not confuse publication with completion`

Why:
- this is owner-important and verifier-important enough to live in the top-level contract, not only in a sub-doc.

### 4) `WORK_MODES.md` false-green warning
Added a compact warning that formal process signals do not themselves prove:
- conceptual non-conflict,
- route-family truth,
- browser/runtime truth,
- owner-final vs placeholder-stage intent.

### 5) `LANE_LOCK_POLICY.md` placeholder/final intent check
Added explicit intent classification check so severity claims do not silently assume route completion from publication presence.

---

## Why this is valuable

This pass does not simply add more rules.
It targets a very specific failure mode already demonstrated by the repo history:

### False protection
A team can believe risk is controlled because:
- lanes exist,
- guards run,
- docs exist,
- routes are published,
- markers are present.

And still be wrong, because the real missing proof is:
- conceptual continuity,
- route-family verification,
- browser/runtime witness,
- owner intent classification.

That is exactly the kind of subtle regression-friendly environment this repo has already experienced.

---

## Verifier note on baptisty

This pass also incorporates owner clarification that `baptisty-rossii` is still placeholder/raw-material territory rather than finished premium implementation.

That does **not** make runtime observations irrelevant.
It does mean the verifier must avoid overstating them as final-target regressions without acknowledging implementation stage.

---

## Recommended next step

A future process hardening pass could add:
- explicit metadata/registry for placeholder vs final route families,
- or route-profile field(s) that make owner intent machine-readable instead of purely documentary.

That would be stronger than prose alone.

---

## Verification status

- `verified-source`: yes
- `verified-history`: yes
- `verified-browser`: indirectly informs policy wording from current reverify context
- `verified-production-like-dist`: not primary for this policy pass
