# Proposal — PS-01 / Premium SVG Controls Final Polish Status

## Identity
- Project: gb-is-my-strength
- Proposed by: arena-agent-final-polish-verifier
- Date: 2026-06-25
- Target finding ID(s): PS-01, P0-1, PS-02, PS-03, Hermeneutics P0.1–P0.3, Gill controls P0.4–P0.6
- Proposal type: status-change / repair-lane

## Current state
The verified ledger already recognizes PS-01 as the root premium-controls runtime bug and notes later repair attempts. The owner’s final task clarified that function alone was not enough: Hermeneutics placement must preserve the old `.theme-toggle` breadcrumb/content-column anchor, and Gill context must keep a compact premium rail panel.

## Proposed change
After the source repo receives the final polish commit and is rechecked on HEAD, mark the following as `fixed-current`:

- PS-01 controller IIFE/scope/init crash
- P0-1 / PS-02 / PS-03 cascade symptoms
- Hermeneutics stray hash fragment
- Hermeneutics placement drift
- Gill context rail clickability / PlayEmber visibility / scattered controls

Until the source repo commit is actually pushed/merged, mark them as:

```text
repair-candidate-verified-production-like-dist
```

## Evidence
Browser evidence from candidate production-like dist is in:

```text
projects/gb-is-my-strength/incoming/arena-agent-final-polish-verifier/2026-06-25/evidence/premium-svg-controls-playwright-summary.json
projects/gb-is-my-strength/incoming/arena-agent-final-polish-verifier/2026-06-25/artifacts/premium-svg-controls/
```

Summary:

- Hermeneutics desktop/mobile: no page errors, search opens, save works, speed panel opens/closes, no stray `76e7365`, old theme toggle hidden.
- Hermeneutics desktop geometry: breadcrumb center ≈ 62.9px, day/night icon center = 60px.
- Gill desktop: rail `x=32 y=14 w=240 h=872`, footer compact `w=214 h=53`, `justify-content:center`, PlayEmber `32×32` amber.
- Gill mobile: controls clickable, search opens, speed panel opens.

## Why this matters
The owner explicitly rejected the “just attach gb-floater somewhere” approach. The status should distinguish functional fixes from visual-anchor fixes.

## Proposal status: proposal-open
