# Current-head reverify — antisovetov nested strategic-map triggers (2026-09-29)

## Disposition

**Confirmed current source-level accessibility defect; admit one direct defect row.** The reported editorial “duplicate tooltip” framing is too strong: tips 19 and 43 share a title but have different explanatory text. Keep both records available; the concrete necessary repair is to remove the nested interactive-control structure, not to delete one explanation without editorial approval.

Product code was not changed.

## Identity and overlap check

- Product `main` HEAD and `git ls-remote origin refs/heads/main`: `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`.
- Live `deployments/current.json` release/control-plane SHA, independently checked earlier on 2026-09-29: the same SHA.
- The existing visual/Playwright intake states its audited anchor is this exact SHA (`../incoming/arena-agent-visual-playwright/2026-09-23/REPORT.md`).
- Open Product PRs at this check: #2142–#2145; none is about the antisovetov strategic-map triggers. Open issue search for `map-trigger`, `antisovetov`, accessibility, tooltip and nesting returned no matches.

## Current source witness

At `src/components/article-pilots/antisovetov/AntisovetovBody.astro:655`, the prose contains two focusable button-role spans nested directly inside one another:

- outer `span.map-trigger[data-tip="43"][role="button"][tabindex="0"]`;
- inner `span.map-trigger[data-tip="19"][role="button"][tabindex="0"]`.

The current shared runtime is installed by `ReaderActionsRuntime.astro`, which imports `article-interactions.js`; that module installs `article-strategic-map.js`. The runtime binds click and Enter/Space handlers to each trigger and stops event propagation, so source inspection supports that the controls are individually wired. **This is not a claim that these controls are currently keyboard-inoperable.** Those handlers do not make it valid to nest one interactive button-role control inside another.

The historical same-SHA axe artifact `../incoming/arena-agent-visual-playwright/2026-09-23/evidence/axe-wcag-aa-104-routes.json` records `nested-interactive` with `impact: serious` and, for `/articles/20-antisovetov-pastoru/`, identifies `span[data-tip="43"]` as having focusable descendants. Its companion screenshot is `../incoming/arena-agent-visual-playwright/2026-09-23/evidence/antisovetov-nested-tooltip.png`.

## Tooltip content and behavior boundary

The two current records in `AntisovetovBody.astro` have the same heading, “Иезавель и Навуфей (3 Цар. 21)”, but are not duplicate strings:

- tip 19 explains Jezebel’s false-witness / formal-procedure episode as a biblical pattern;
- tip 43 applies “lawful form, criminal content” to procedural blocking of complaints.

They are related and may feel editorially repetitive, but the current evidence does not justify removing either record. The current runtime has per-trigger click and keyboard activation; the historical browser report records separate trigger behavior. No fresh browser rerun was performed in this session.

## Evidence limits

The axe run, screenshot, and browser interaction are historical artifacts from 2026-09-23, not a new 2026-09-29 browser run. Current-source identity and structural nesting were rechecked on current Product `main`; Chromium 153 became runnable later in the session, but this browser wave did not exercise the antisovetov triggers. Therefore no new trigger runtime or assistive-technology behavior is claimed.

## Necessary closure boundary

Restructure the prose so no focusable/button-role trigger contains another interactive trigger (or otherwise provide one coherent non-nested interaction target while preserving the intended text and both distinct explanations). On resulting Product `main`, prove:

1. axe no longer reports this nested-interactive node;
2. both retained explanation records still have the intended trigger and content;
3. pointer, Enter and Space activation continue to open the corresponding explanation, with Escape/close behavior and focus remaining truthful;
4. article prose and accessible names remain coherent.

Admitted matrix ID: `GBS-ANTISOVETOV-NESTED-MAP-TRIGGERS`.
