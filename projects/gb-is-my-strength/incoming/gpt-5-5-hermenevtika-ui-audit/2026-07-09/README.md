# Intake — gb-is-my-strength — gpt-5-5-hermenevtika-ui-audit — 2026-07-09

## Identity
- Project: `gb-is-my-strength`
- Source repository: `FedorMilovanov/gb-is-my-strength`
- Agent: GPT-5.5 Thinking / source UI auditor
- Date: 2026-07-09
- Audited branch: `main`
- Initial audited source SHA: `d579745c23d9a0e6dea3a8148a3369d46c47b94b`
- Functional freshness commit: `b8eabe75afe88f9c272384e122f0e240615e1f37`
- Current source HEAD after reverify: `2313f36f6aeaf7415e85d5e353e7e4cd10222ece`
- AuditRepo base SHA: `18713174a343740cc0886df6c6441c51bde61274`
- AuditRepo branch: `audit/hermenevtika-ui-current-head-2026-07-09`
- Environment: connected GitHub API source inspection
- Build mode: source audit only
- Browser / device: not used by the agent
- Additional witness: owner-reported browser symptom for nested Scripture links inside footnote popovers

## Current-head delta

Source advanced by two commits during the audit. `b8eabe75` substantially changed `HermenevtikaRail.astro` and removed its old bloom-panel CSS; `2313f36f` then advanced generated metadata/cache-bust values.

Mandatory current interpretation:

- `artifacts/STATUS_AND_CORRECTIONS_2026-07-09.md`
- `artifacts/DEEP_AUDIT_AND_MAIN_CLOSURE_2026-07-09.md`

The status file supersedes stale current-HEAD wording in `REPORT.md`, narrows `HERM-UI-008`, confirms the other initial candidates still source-current, and adds `HERM-UI-011` for the search⇄speed slot's keyboard/accessibility state.

The deep closure artifact extends the audit beyond the initial UI symptom. It documents:

- the three competing article representations (Astro body, MDX, root legacy HTML);
- false render-source/parity assumptions in current generic audits;
- publication/update metadata drift across visible body, PageHead, MDX, search manifest and sitemap;
- article-range progress fragmentation across mobile controls, rail and BookmarkEngine;
- reader/TTS/speakable projection drift;
- semantic back-navigation, scrollspy, favorite metadata and Play ARIA defects;
- an atomic five-PR MAIN closure sequence with file ownership, command gates and browser acceptance matrix.

## Scope
- Route: `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/`
- Primary components: `HermenevtikaBody.astro`, `HermenevtikaRail.astro`, `HermenevtikaMobileBar.astro`, `HermenevtikaPageHead.astro`
- Additional source-of-truth layer: route profile, MDX, root legacy HTML, search manifest, sitemap, generic article/parity audits
- Shared runtime inspected for root cause only: `js/site.js`, `js/site-utils.js`, `js/floating-cluster-controller.js`, `js/bookmark-engine.js`, `css/floating-cluster.css`, `_shared/speedSlot.ts`
- Remote-state check: current source `main`, current open source PR, current AuditRepo `main`, and all open AuditRepo PRs
- Out of scope: source implementation, local build, production-like dist, screenshots, real-device/browser automation

## Current remote state
- No separate active Hermeneutics implementation PR was found at intake creation.
- Hermeneutics rail work landed directly on `main` while this audit was in progress; it was delta-reverified through `2313f36f`.
- The only open source PR observed at intake creation was Gill-image work and did not overlap the Hermeneutics route.
- Other open AuditRepo PRs observed at intake creation were Gill-only.
- The route is declared `strict-native`; the audit treats native Astro components as the current render source and rejects runtime DOM-sanitizer workarounds as the preferred footnote repair.

## Verification boundary

This intake contributes:

```text
W1 source witness
verified-source
owner-reported browser symptom for HERM-UI-001
needs instrumented browser / production-like cross-verification
not repair-ready by this intake alone
```

Source-observable contracts and deterministic CSS/binding logic are high-confidence. Animation feel, real focus order, viewport rendering, print output, network priority and mobile scroll-lock interaction still need an independent browser witness before canonical promotion. The current-head delta is a freshness recheck by the same witness, not L2.

## Files in this intake
- `REPORT.md` — initial findings, severity proposals and acceptance criteria
- `artifacts/STATUS_AND_CORRECTIONS_2026-07-09.md` — mandatory current-HEAD corrections and added finding
- `artifacts/DEEP_AUDIT_AND_MAIN_CLOSURE_2026-07-09.md` — deep architecture audit and professional MAIN merge plan
- `evidence/SOURCE_EVIDENCE_INDEX.md` — initial exact source predicates and root-cause chain
- `proposals/proposal-hermenevtika-ui-repair-lanes.md` — initial route/system lane split
- `proposals/proposal-speed-slot-accessibility-addendum.md` — shared slot ownership correction
- `comments/README.md` — comments-folder contract; no third-party report was edited
- `commands.log` — source/remote inspection log

## Canonical-status rule

This folder is raw intake evidence. It does not directly edit `verified/MASTER_BUG_MATRIX.md`, does not declare any finding `repair-ready`, and does not overwrite another agent's report.
