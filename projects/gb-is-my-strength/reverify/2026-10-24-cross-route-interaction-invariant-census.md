# Cross-route interaction invariant census — bounded current receipt

Date: 2026-10-24
Product anchor: `8d93fe4206e579e766727dbe865e0d07cf30d3c5` (`main`)
Build: production-like
Browser: Chromium `153.0.8010.0`
Product mutation: none

## Purpose

This pass looked for cross-route interaction failures that are easy to miss in route-specific audits: duplicate IDs, nested interactive composition, visible controls hidden from the accessibility tree, visually collapsed disclosures that retain sequential focus, and broken focus entry/return in the shared reader dialogs.

The result is deliberately a bounded census, not a claim that every interaction criterion is closed. It records what was tested so later work does not turn clean families or transient animation samples into duplicate rows.

## Route corpus

The final `dist` contained 105 index routes. The static/current-load censuses used all 105 routes at desktop 1280×800. The accessibility-state and disclosure scans repeated the corpus at mobile 390×844. All route loads completed without browser errors in these probes.

## Results

### Duplicate IDs

All 105 desktop routes were inspected after runtime initialization:

- affected routes: 0;
- duplicate-ID groups: 0;
- load errors: 0.

No admission.

### Nested interactive elements

The route-wide DOM census found four groups on two routes:

- three Gill reversible cards containing injected heading anchors;
- one authored strategic-map trigger nested in another interactive host on Antisovetov.

Both families are already owned by active MASTER work. No new row was created.

A previous broad selector incorrectly treated `<main tabindex="-1">` as an interactive ancestor around Lawson anchors. `tabindex=-1` on a programmatic focus target is not a nested-interactive collision; that apparent family was rejected.

### Visible focusables under `aria-hidden=true`

For every desktop and mobile route, the scan selected visible `[aria-hidden="true"]` ancestors and then looked for visible, enabled sequential descendants not protected by `hidden` or `inert`:

- desktop: 0 affected routes / 0 descendants / 0 errors;
- mobile: 0 affected routes / 0 descendants / 0 errors.

This does not certify visually collapsed regions that never set `aria-hidden`; those were tested separately.

### Collapsed disclosures

A trusted-Tab census started from controls with `aria-expanded=false` and valid `aria-controls` targets:

- desktop: 83 target entries reached by the next trusted Tab;
- mobile: 19;
- errors: 0.

Every collision belonged to an already admitted owner:

- generic `.gb-ember-expand` reader-speed panels;
- FAQ answer bodies.

The generic scan did not activate Gill's initially open whole-TOC toggle or open its top-level mobile dialog. Targeted interaction subsequently proved Gill subgroup, whole-desktop-TOC and nested mobile-accordion exposure and was consolidated into `SYS-GILL-NAV-COLLAPSED-FOCUS-EXPOSURE`.

No fourth disclosure owner emerged from the route-wide control/target scan.

### Reader dialog lifecycle controls

Twelve visible reader-dialog trigger profiles were exercised with trusted Enter, Tab and Escape across:

- Gill part 1;
- an ordinary shared-series article;
- Hermenevtika;
- desktop/mobile controls as applicable.

The sampled settings, learning and table-of-contents dialogs all:

1. opened their declared target;
2. changed the target to `aria-hidden=false`;
3. moved focus inside;
4. kept the next Tab inside;
5. closed on Escape;
6. restored focus to the exact trigger.

The first exploratory harness accidentally fell back from an exact icon-only trigger to the first hidden element sharing the same `aria-controls` target. The exact-ID rerun removed those false failures; only the corrected result is retained.

This healthy result does not close the separately admitted rich-footnote or strategic-map dialog models, which use different owners and fail different lifecycle boundaries.

## Hidden-focus inventory triage

The broad opacity-zero inventory reported 659 nodes on 86 routes. Family classification showed that the count is not a defect count:

- the largest family is the already-owned generic reader-speed panel;
- heading anchors are opacity-zero until focus/hover and reveal under natural focus;
- many Home/catalog cards were sampled during entry animation;
- hidden top-level overlays are excluded from natural navigation by their existing state owners;
- the distinct Gill navigation family was admitted and broadened through targeted trusted-keyboard proof.

Accordingly, the raw 659 figure is not carried into MASTER arithmetic.

## Boundaries and next direction

- No claim is made about WebKit/Firefox from this Chromium census.
- A computed `tabIndex` alone was never accepted as proof of natural traversal; admissions use trusted keyboard steps.
- Animation-time opacity samples were not admitted without a settled-state check.
- Partial-content disclosures such as the mobile long-block expander may legitimately expose a visible clipped preview while `aria-expanded=false`; visual presence alone is not a parity failure.
- Product remained unchanged.

The next source pass should continue with ownership/lifecycle composition rather than repeating duplicate-ID or generic collapsed-disclosure scans at this same Product anchor.

## Evidence

Compact summary: `evidence/2026-10-24-cross-route-interaction-invariant-census.jsonl`.
