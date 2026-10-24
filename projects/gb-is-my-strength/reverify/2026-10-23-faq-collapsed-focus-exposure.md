# FAQ collapsed focus/exposure contract — current receipt

Date: 2026-10-23  
Product anchor: `caeb92c839ff4b4f2838a0ad44a582034c41c8d4` (`main`)  
Disposition: **admit one system verification lane** — `SYS-FAQ-COLLAPSED-FOCUS-EXPOSURE`.  
Product mutation: none.

## Question

When the shared native FAQ accordion reports `aria-expanded="false"` and visually clips its answer to zero height, are the answer and its interactive descendants also removed from sequential keyboard navigation and the accessibility tree?

## Shared mechanism and reach

`src/runtime/article-faq-accordion.js::setOpen()` synchronizes:

- opener `aria-expanded`;
- item `is-open` / `open` classes;
- answer `max-height` (`0px` closed, measured/`none` open).

It never applies `hidden`, `inert`, `aria-hidden`, or a descendant tabindex policy. CSS adds `overflow:hidden`, which clips painting but does not define keyboard or accessibility-tree state.

Final dist has 21 FAQ questions across four routes:

- Antisovetov: 7;
- Hermenevtika: 3;
- Kod da Vinchi: 8;
- Krajne: 3.

Seventeen currently closed-answer descendants remain focusable, principally Scripture-reference buttons and glossary controls.

## Browser evidence

Chromium `153.0.8010.0`, production-like build, reduced motion, zero page errors. All four routes were exercised at:

- desktop 1280×800 Light and Dark;
- mobile 390×844 Light and Dark.

Across 16 route/profile loads:

- 84/84 question instances started `aria-expanded="false"`;
- 84/84 answer boxes had `clientHeight=0`;
- 68 focusable descendants remained inside those closed boxes;
- trusted Tab from the corresponding closed question entered a clipped descendant in 58 cases.

In the unique desktop-Light corpus, 17 focusables remain under 21 closed questions and Tab enters a closed answer directly after 15 of the 21 question buttons. The remaining questions either have no interactive answer content or proceed to another visible control; this does not mitigate the affected questions.

Examples:

- Krajne: all 3/3 closed questions Tab directly into a clipped `.bref` button in all four profiles;
- Kod da Vinchi: 8/8 questions do so in all four profiles;
- Hermenevtika: 3/3 do so in all four profiles;
- Antisovetov desktop: the first question Tabs into a clipped glossary control.

This is natural keyboard traversal using trusted Tab, not direct programmatic focus as the success path.

## Accessibility-tree control

On closed Krajne FAQ answer 1:

- opener: `aria-expanded="false"`;
- answer: `max-height:0px`, `clientHeight=0`;
- Chromium ARIA snapshot still exposes a named `region`, the full answer text and the button «Иез. 36:26».

The problem is therefore broader than an invisible focus ring: visually unavailable answer content remains represented as current readable/interactive content.

## Existing guard false green

`scripts/article-capability-browser-contract.mjs` exercises FAQ only by clicking the first question twice and comparing:

- `aria-expanded` before/after;
- `.is-open` class parity.

It never checks closed-state sequential focus, descendant exposure, AX state, focus evacuation on collapse, or the other two current FAQ routes. A visually clipped state can therefore pass while remaining keyboard- and AT-active.

The owner contract similarly proves one native module/selector owner, not state semantics.

## Bounded closure

The shared owner must project one coherent state to visual, keyboard and accessibility surfaces:

- closed answers are absent from sequential focus and the accessibility tree;
- opening restores answer semantics and descendant operability;
- collapsing while focus is inside moves focus deliberately to the exact question opener before hiding;
- animated height remains presentation only and cannot be the semantic state owner;
- no-JS content remains readable under the project's existing progressive-enhancement policy.

An appropriate implementation may use `hidden` after the close transition and remove it before measuring/opening, or a correctly synchronized `inert`/visibility model. Closure should not globally rewrite descendant tabindex values without reversible ownership.

Required proof across all four routes, desktop/mobile Light/Dark:

1. closed Tab goes from question to the next visible control/question, never into its answer;
2. closed answer is absent from the AX tree;
3. open answer text and controls are exposed and operable;
4. pointer and keyboard toggle parity remains intact;
5. collapse with focused answer descendant restores focus to its opener;
6. reduced-motion and no-JS controls remain valid.

## Boundaries

- FAQ answer content and Scripture buttons are not defective while the answer is open.
- `aria-expanded` itself is currently synchronized correctly; the defect is that it does not control descendant exposure.
- This does not duplicate the speed-panel row: the owners and surfaces differ, though both demonstrate that visual collapse alone is not an accessibility state.
- No Product source was changed.
- Current open Product PRs do not own the FAQ runtime or its four article components.

## Evidence

Compact receipt: `evidence/2026-10-23-faq-collapsed-focus-exposure.jsonl`.
