# Current-head reverify — reader speed control keyboard model

Date: 2026-09-29<br>
Product under test: `FedorMilovanov/gb-is-my-strength` `main`<br>
Exact Product HEAD: `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`<br>
Live `releaseSha` / `controlPlaneSha`: same SHA<br>
Disposition: **admit one shared system-verification work unit** absorbing candidate `KBD-01` + `KBD-02`; do not create two symptom rows.

## Why this is current

The current Product clone is clean at the exact live/main SHA above. The September 23 audit report records that same full SHA as its audited anchor; its Wave 2 keyboard-trap and Wave 15 focus-order witnesses were therefore produced against the same Product source, not an older revision. I rechecked the current JavaScript and CSS against those witnesses on September 29. Product code was not changed.

The initial browser launch was blocked by missing NSS libraries; Chromium 153 was later made runnable in this session by extracting its bundled system libraries. A dedicated Playwright reverify was then run against the local production-like build of this exact SHA. The fresh browser witnesses below are current-head runtime evidence, not a direct live-host browser run; direct navigation to the live host had ended with `net::ERR_CONNECTION_CLOSED`. The archived scan remains the only evidence for its broad route counts.

## Current-source confirmation

In `js/floating-cluster-controller.js`:

- `initPlayExpand()` creates `.gb-ember-expand` as `role="radiogroup"`, with five native speed buttons carrying `role="radio"` and a stop-playback button in the same container (lines 1860–1870).
- `openPanel()` / `closePanel()` toggle `.is-open` and update the ember's `aria-expanded`, but do not set/remove `hidden`, `inert`, `aria-hidden`, or descendant `tabindex` values (lines 1888–1909).
- The document-level `keydown` listener closes on Escape, implements left/right movement, and when the panel is open prevents Tab from leaving at either end by wrapping last → first and first → last (lines 2024–2044). Keyboard focus on the ember opens the panel; focusout closes it only after focus leaves the wrapper (lines 2012–2019).

In `css/floating-cluster.css`, the closed panel is visually collapsed using `opacity: 0`, `pointer-events: none`, and a circular `clip-path`; the speed buttons themselves also start at `opacity: 0` and are revealed by the `.is-open` cascade (lines 2258–2310 and 2409–2440). These visual/pointer states do not remove native buttons from keyboard focus order. Current source has no closed-state accessibility mechanism that would invalidate the old hidden-focusable finding.

Together, this confirms one shared state-model defect: a visually collapsed panel leaves descendants keyboard-focusable, while the open non-modal radio group applies a Tab trap. The stop button's placement inside the radiogroup is also part of the generated control structure and should be reviewed when the keyboard model is repaired; it is not admitted as a separate row here.

## Fresh exact-SHA runtime witnesses (2026-09-29)

Machine-readable results: `evidence/2026-09-29-speed-panel-keyboard-reverify.json`. Playwright Chromium `153.0.8010.0` tested the production-like local `dist` built from the clean Product checkout at the exact current/live SHA; no Product files changed.

- **Open-panel Tab trap:** on both `/nagornaya/chast-1/` and `/nagornaya/chast-3/`, focusing the Play control opened `.gb-ember-expand[role=radiogroup]`. Starting from the first speed radio, `Shift+Tab` moved to “Остановить озвучку” inside the same panel; starting from the last speed radio, `Tab` wrapped back to “1×”. Both directions remained inside the control. This freshly reproduces KBD-01 on the two routes used by the historical direct probe.
- **Closed-panel focusability:** on `/articles/serdce-i-telo/`, all five speed buttons in the closed panel had `tabIndex=0`, `opacity:0`, `visibility:visible`, nonzero 50.6×22.1px layout boxes, and no `hidden`, `inert`, or `aria-hidden` ancestor. A sequential Tab run reached the five invisible speed controls; focusing the first opens the panel, and the sixth recorded Tab landed back on 1× during its opening transition. The separate stop button also remains `tabIndex=0` while opacity-zero, but had a zero-size box on this route. This is a fresh KBD-02 manifestation, not a fresh enumeration of all desktop/mobile routes.

Together, the fresh results directly reproduce both manifestations already admitted under `SYS-READER-SPEED-KEYBOARD-MODEL`. They do not create additional work units. Full route-family coverage and post-repair behavior remain closure requirements.

## Same-SHA runtime witnesses (historical, not rerun)

Evidence and exact details are in `../incoming/arena-agent-visual-playwright/2026-09-23/REPORT.md` and its `evidence/` directory:

- **KBD-01 / Wave 2:** `/nagornaya/chast-1/` and `/nagornaya/chast-3/` trapped forward and reverse Tab in the speed group; 40 key presses yielded only 11 unique targets on those pages. Escape closes the panel in source but leaves focus in a panel button, so it does not provide a reliable keyboard exit. The report bounds direct runtime confirmation to those two routes; other Nagornaya parts were not claimed as individually reproduced.
- **KBD-02 / Wave 15:** the archived 104-route scan reports five visually invisible speed buttons on **72 desktop routes** (360 hidden tab stops); six `/baptisty-rossii/*` cases additionally include the stop button. On mobile the same scan found the five speed controls on six routes. Its documented test criterion excludes `hidden`/`inert`/`aria-hidden` ancestors and detects opacity-zero focusable boxes. The underlying scan artifact is `../incoming/arena-agent-visual-playwright/2026-09-23/evidence/focus-invisible-skip-104.json`.

## Scope and disposition

The affected controls share the `floating-cluster-controller.js` implementation and one collapsed/expanded keyboard-state contract. Keep the two verified manifestations as witnesses under one work unit, `SYS-READER-SPEED-KEYBOARD-MODEL`:

1. Closed panel is removed from keyboard navigation and the accessibility tree (without breaking the reveal transition).
2. Open speed selection follows a valid radio-group keyboard model; Tab and Shift+Tab exit the non-modal control instead of wrapping. Escape closes and restores focus predictably to the ember. The stop action has appropriate semantics outside the radio group.
3. Resulting-main browser verification demonstrates exit in both directions on Nagornaya, no hidden speed tab stops across the 72 desktop routes previously counted (and checks the six mobile routes), correct radio announcements/selection, and no regression to pointer/touch playback.

Checked the currently open Product PRs #2142–#2145 and searched open issues for `keyboard trap speed reader` and `invisible focus speed`; no matching in-flight repair or issue was found. This is a system-level necessary-work admission, not a claim that a repair or new runtime test has occurred.
