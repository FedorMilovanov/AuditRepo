# Reversible-card descendant activation collision — current receipt

Date: 2026-10-24  
Product anchor: `8d93fe4206e579e766727dbe865e0d07cf30d3c5` (`main`)  
Disposition: **admit one system verification lane** — `SYS-REVERSIBLE-CARD-DESCENDANT-ACTIVATION-COLLISION`.  
Product mutation: none.

## Question

Can the shared reversible-card owner safely promote an arbitrary card container to one capture-phase button when another shared owner injects an interactive control into the card's visible face?

## Shared owners and reach

`src/runtime/article-reversible-cards.js` selects all `.flip-card`, `.error-flip-card` and `.heart-flip-card` containers. It gives each container `role="button"` and `tabindex="0"`, toggles every bubbled click, and handles Enter/Space in capture phase with `preventDefault()`, `stopImmediatePropagation()` and `card.click()`.

`src/runtime/article-heading-anchors.js` independently injects focusable copy-link anchors into every `h2[id]`, `h3[id]` and `h4[id]` except three explicit excluded hosts. Reversible cards are not excluded.

A rebuilt current production-like artifact contains 17 reversible-card instances over four routes: Gill part 1 ×1, Gill part 3 ×4, Kod da Vinchi ×11 and Krajne ×1. Three Gill-part-3 cards contain an `h3[id]` on their front face, so the heading owner injects three `.heading-anchor` links inside containers already promoted to buttons. The other 14 cards currently have no interactive descendant.

## Browser evidence

Chromium `153.0.8010.0`, rebuilt current production-like artifact, reduced motion, zero page errors:

- desktop 1280×800 Light and Dark;
- mobile 390×844 boundary control.

On desktop, all three affected cards expose the sequence `card button → heading copy link`. Trusted Tab from each focused card reaches its nested heading anchor in 6/6 theme/card states.

Activation then has contradictory ownership:

- trusted Enter while the heading anchor is focused flips the ancestor card in 6/6 states and performs **0/6** clipboard writes; focus remains on an anchor that has just been rotated onto the hidden face;
- trusted pointer activation of the visible anchor performs the requested copy in 6/6 states **and also flips the ancestor card in 6/6 states**;
- `aria-pressed` follows the unintended flip, so this is not stale reporting but a real second action.

At the Gill mobile breakpoint, the heading anchors are deliberately `display:none`; trusted Tab skips them. That is a bounded responsive control, not a repair of the desktop nested-control contract.

## Why the current guard is false green

`scripts/article-capability-browser-contract.mjs::exerciseReversibleCard()` tests only the first Krajne `.heart-flip-card`, which has no descendant control. It focuses the outer container and checks Enter/Space plus `aria-expanded` parity. It never enumerates all card families, tabs into descendants, activates a nested control, or checks clipboard/card-action exclusivity.

The separate heading-anchor guard proves copy behavior on an ordinary heading. Neither isolated positive fixture tests owner composition.

## Causal boundary

This is not three route bugs. The shared card owner assumes its entire descendant tree is one activation surface, while the shared heading owner assumes every eligible heading can safely receive a link. Capture-phase keyboard cancellation makes the descendant's own action impossible; bubbled pointer click produces both actions.

The existing direct `GBS-CHROME-LABEL-IN-NAME-MISMATCH` row remains distinct: it proves an accessible-name/visible-content failure across many chrome owners. Its recommended card-family repair may overlap, but it does not prove descendant activation exclusivity or keyboard loss.

## Bounded closure

Choose and enforce one composable interaction model:

- preferably use an explicit card toggle control separate from semantic face content, so headings and future links remain ordinary descendants outside that button; or
- if whole-card activation is retained, prohibit interactive descendants structurally and make the heading-anchor owner skip that host through an explicit capability contract, not an incidental route exception.

Closure requires:

1. zero interactive descendants inside any card button across all four current routes;
2. every retained heading copy link is naturally reachable and performs exactly one copy action without flipping a card;
3. outer card pointer, Enter and Space parity remains correct;
4. focus never remains on a newly hidden face after a flip;
5. front/back `aria-hidden`, `aria-pressed` and reduced-motion layout remain coherent;
6. an executable negative fixture composes a heading/link with a reversible card and fails on either nested interaction or dual activation;
7. desktop/mobile Light/Dark coverage for all three card families, not only Krajne.

No Product source was changed. The refreshed open Product owner list contains no reversible-card or heading-anchor runtime owner.

## Evidence

Compact receipt: `evidence/2026-10-24-reversible-card-descendant-activation-collision.jsonl`.
