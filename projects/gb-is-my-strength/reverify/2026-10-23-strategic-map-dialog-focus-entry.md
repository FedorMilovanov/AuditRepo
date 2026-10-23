# Strategic-map dialog focus entry — current receipt

Date: 2026-10-23  
Product anchor: `caeb92c839ff4b4f2838a0ad44a582034c41c8d4` (`main`)  
Disposition: **admit one system verification lane** — `SYS-STRATEGIC-MAP-DIALOG-FOCUS-ENTRY`.  
Product mutation: none.

## Question

When a keyboard user activates one of the shared strategic-map triggers, does the resulting element advertised as `aria-haspopup="dialog"` receive a coherent dialog focus transition, or can focus continue through unrelated article controls while the dialog remains open?

## Shared mechanism

`src/runtime/article-strategic-map.js` owns all `.map-trigger[data-tip]` controls on Antisovetov. It creates one body-level singleton with:

- `role="dialog"`;
- `aria-modal="false"`;
- a named close button;
- record-specific explanatory content.

`open()` renders the record, unhides and positions the dialog, sets the trigger's `aria-expanded="true"`, but never focuses the dialog, its close button or content. Because the singleton is appended at the end of `body`, it is not the next sequential focus target after an inline opener.

## Browser evidence

Chromium `153.0.8010.0`, production-like build, reduced motion, zero page errors. All 39 owned triggers were exercised in each profile after bringing the opener into view:

- desktop 1280×800 Light;
- desktop 1280×800 Dark;
- mobile 390×844 Light;
- mobile 390×844 Dark.

Across 156 open states:

- dialog opened and trigger reported expanded: 156/156;
- initial focus entered the dialog: 0/156;
- initial focus remained on a map trigger: 156/156;
- first trusted Tab entered the dialog or its close button: 0/156.

The first Tab instead moved to the next article-order control — another map/footnote trigger, heading anchor, glossary term, or other unrelated control — while the strategic dialog stayed open.

Desktop Escape restored the exact original trigger in 78/78 states. Mobile restored 74/78 after the first Tab; four failures occurred when Tab opened a competing glossary surface before Escape. This secondary interaction is retained as a collision witness, not counted as a separate defect here. The central failure happens earlier and universally: there is no dialog entry path.

## Positive controls

For tip 1 with the opener in view:

- the fixed popover was fully inside the viewport;
- Chromium's ARIA snapshot exposed dialog «Пояснение к стратегической карте», its close button, two titled sections and explanatory paragraphs;
- directly focusing the close button succeeds.

Thus the dialog exists, is named and contains a working focusable control. Natural keyboard traversal simply never enters it.

## Existing guard false green

`scripts/article-capability-browser-contract.mjs::exerciseStrategicMap()`:

1. focuses only the first trigger;
2. presses Enter;
3. waits for visible/expanded state;
4. immediately presses Escape;
5. verifies collapse and exact focus restoration.

It never presses Tab while open and never asserts that focus enters the advertised dialog. Its Escape assertion therefore proves only the path that bypasses dialog content entirely. Ownership cardinality and unresolved-record checks are valid but orthogonal.

## Bounded closure

Choose and implement one truthful popup model:

1. **Dialog model:** on keyboard activation, move focus to the close button or a focusable dialog container; provide defined Tab/Shift+Tab behavior; Escape, close button and outside dismissal restore the exact opener; coordinate with other popup owners so opening a second surface does not leave competing active overlays.
2. **Non-dialog disclosure/popover model:** stop advertising a dialog and associate the revealed explanatory content with the trigger through semantics that remain readable while focus deliberately stays on the opener.

The current hybrid — `aria-haspopup="dialog"` plus no dialog focus entry or adjacent sequential path — is not a coherent model.

Closure proof must cover all 39 triggers in desktop/mobile Light/Dark:

- Enter and Space activation;
- focus destination on open;
- first Tab and Shift+Tab;
- close-button reachability without traversing the rest of the document;
- Escape/button/outside close with exact focus return;
- trigger switching and glossary/footnote collision controls;
- no unresolved records and viewport-contained geometry.

## Boundaries

- This does not claim the record text is missing or visually clipped.
- It does not duplicate `GBS-ANTISOVETOV-NESTED-MAP-TRIGGERS`: invalid nested authoring remains a separate current structure defect, while this lane covers the shared dialog lifecycle across all 39 triggers.
- Existing label-in-name failures remain under their multi-owner row.
- Programmatic close-button focus is only a positive control, not the success path.
- Current open Product PRs do not own the strategic-map runtime or Antisovetov component.

## Evidence

Compact receipt: `evidence/2026-10-23-strategic-map-dialog-focus-entry.jsonl`.
