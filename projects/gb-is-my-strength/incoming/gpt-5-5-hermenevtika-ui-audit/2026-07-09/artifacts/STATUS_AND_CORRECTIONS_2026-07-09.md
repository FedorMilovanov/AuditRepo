# Status and corrections — Hermeneutics UI — 2026-07-09

> **Mandatory precedence:** read this file together with `REPORT.md`. It supersedes the report's initial current-HEAD metadata and narrows/extends findings after the source repository advanced during the audit.

## Source freshness

Initial audited source:

```text
d579745c23d9a0e6dea3a8148a3369d46c47b94b
```

Current source HEAD after freshness reverify:

```text
2313f36f6aeaf7415e85d5e353e7e4cd10222ece
```

Delta:

```text
d579745c..2313f36f
2 commits ahead
```

The two commits are:

1. `b8eabe75afe88f9c272384e122f0e240615e1f37` — functional Hermeneutics rail change: replaces the desktop bloom speed panel with the shared search⇄speed slot, adds a persistent badge, and wires the bottom site-menu button to search.
2. `2313f36f6aeaf7415e85d5e353e7e4cd10222ece` — bot-generated metadata/cache-bust update.

The route's article body, mobile TOC sheet and tooltip controllers were not repaired by this delta. The owner-reported footnote bug remains source-current.

## Correct current status of initial findings

### Still source-current without material change

- `HERM-UI-001` — nested active Scripture buttons in footnote tooltip text;
- `HERM-UI-002` — exact 1200 px responsive dead zone;
- `HERM-UI-003` — modal focus lifecycle and duplicate unsynchronised search state;
- `HERM-UI-004` — unsafe direct `body.style.overflow` scroll lock;
- `HERM-UI-005` — progress/time-left scoped to the entire document;
- `HERM-UI-006` — modal close transition prevented by `display:none`;
- `HERM-UI-007` — direct decorative `<span>` child inside `<ul>`;
- `HERM-UI-009` — visible and machine modification dates disagree; the bot commit advanced machine metadata again while the visible byline remained unchanged;
- `HERM-UI-010` — `footnotes.enabled:false` while custom footnotes are active.

These are freshness confirmations by the same source witness, not a second independent witness.

### `HERM-UI-008` — narrowed after `b8eabe75`

The old desktop-rail Play comments and the obsolete `.hrail-top .gb-ember-expand` CSS were corrected/removed by `b8eabe75`. Therefore the report's subclaim that `HermenevtikaRail.astro` still says Play blooms UP is stale on current HEAD.

The broader documentation-drift candidate remains source-current in other components:

- `HermenevtikaBody.astro` still describes the Hermeneutics `FloatingCluster` as restored theme/search/Play/save chrome, although the variant renders only theme;
- `HermenevtikaMobileBar.astro` still has older surrounding comments that should be checked against the final local-search/modal contract;
- any future repair should update only comments that remain objectively stale and must not reintroduce the removed bloom-panel model.

Current proposed severity remains P3, but scope is reduced.

## New current-HEAD finding

### HERM-UI-011 — Search⇄speed slot visually swaps layers but leaves hidden controls in the keyboard/accessibility sequence

- Proposed severity: **P2 accessibility / interaction**
- Source files:
  - `src/components/article-pilots/hermenevtika/HermenevtikaRail.astro`
  - `src/components/article-pilots/hermenevtika/HermenevtikaMobileBar.astro`
  - `src/components/article-pilots/_shared/speedSlot.ts`
- First observed on functional SHA: `b8eabe75`
- Current on SHA: `2313f36f`
- Expected: only the currently visible slot layer is interactive and keyboard-focusable. A `radiogroup` supports an intelligible keyboard contract.
- Actual source contract:
  - closed state hides the speed rail with `opacity:0` and `pointer-events:none`, but its five `button role="radio"` controls remain in the sequential Tab order;
  - open state in the desktop rail only lowers search-button opacity to `.3`; it does not apply `pointer-events:none`, `aria-hidden`, `inert`, `hidden`, `disabled` or `tabindex=-1`;
  - mobile search does apply `pointer-events:none` while open, but the input remains keyboard-focusable because pointer-events does not remove it from the Tab order;
  - `initSpeedSlot()` toggles only the `.speed-open` class and `aria-checked`; it never synchronises `aria-hidden`, `disabled` or tabindex between the two slot layers;
  - all five radios remain Tab stops and no ArrowLeft/ArrowRight/ArrowUp/ArrowDown roving-radio behavior is implemented.
- User impact:
  - keyboard users can focus invisible speed chips while the search layer is shown;
  - when speeds are shown, keyboard users can still focus the visually hidden/covered search control;
  - screen-reader users may encounter both mutually exclusive layers simultaneously;
  - radiogroup behavior does not match the expected single-tab-stop + arrow-key model.
- Confidence: **high** source observation; accessibility-tree/browser confirmation required.
- Preferred repair:
  - make the inactive layer inert/hidden from accessibility and remove it from Tab order;
  - restore the active layer atomically when the slot swaps;
  - implement roving tabindex and arrow-key selection for the radio chips, with Escape returning focus to Play/badge/search as appropriate;
  - keep pointer/touch dragging behavior.
- Acceptance criteria:
  - closed: no speed chip is reachable by Tab or exposed as active content;
  - open: search control is not reachable/exposed; one selected radio is the single Tab stop;
  - arrows move/select within the group; Home/End are handled or intentionally documented;
  - closing restores focus to the invoking Play badge/control;
  - Chrome/Firefox/WebKit keyboard + screen-reader smoke passes.
- Suggested repair placement: route lane for Hermeneutics-specific markup/CSS plus a separately declared shared-component owner for `speedSlot.ts`; do not silently edit shared logic inside a route-only lane.

## Updated count

```text
10 initial source candidates
- 1 narrowed in scope (HERM-UI-008, still open)
+ 1 new current-HEAD candidate (HERM-UI-011)
= 11 current candidates pending independent verification
```

## Verification status remains unchanged

```text
W1 source witness
verified-source
owner-reported browser symptom for HERM-UI-001
needs independent source/browser/production-like cross-verification
not repair-ready by this intake alone
```

The freshness reverify is the same witness and does not promote findings to L2/confirmed-current.