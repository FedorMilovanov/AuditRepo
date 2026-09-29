# Current-head triage — genealogy React Flow ARIA labels (2026-09-29)

## Disposition

**Do not admit A11Y-09 as a necessary user-facing defect on the current evidence.** The archived axe violation itself is real, but the intake's wider conclusion that most people in the graph cannot be keyboard-reached is contradicted by the current source and the genealogy keyboard contract. The remaining ARIA-attribute cleanup is isolated to semantically hidden, non-focusable React Flow wrappers; a direct user impact from those hidden wrappers has not been established.

No Product code was changed; the active matrix is unchanged for this candidate.

## Current identity and collision check

- Product `main` HEAD and `git ls-remote origin refs/heads/main`: `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`.
- Open PR #2143 edits only genealogy v2 editorial data/validation files, not `GenealogyTree.tsx` or the keyboard/ARIA implementation. Open issue search for genealogy keyboard/ARIA/React Flow returned no matches.
- The closed `SYS-GENEALOGY-WEBKIT-WITNESS` lane concerned cross-browser genealogy behavior and the narrow WebKit transition crash; it does not itself certify an axe-clean accessibility tree.

## What remains true

The same-SHA archived axe artifact `../incoming/arena-agent-visual-playwright/2026-09-23/evidence/axe-wcag-aa-104-routes.json` reports `aria-prohibited-attr` on `/rodosloviye/`, impact `serious`, total 149. Representative nodes are `div[data-id="eve"]`, `div[data-id="cain"]`, and `div[data-id="abel"]`; each has `aria-label` without a valid role.

Current `GenealogyTree.tsx` constructs every projected node with `ariaLabel: "<name>: открыть сведения и семью"`, while setting `focusable: !semanticHidden`. The bundled React Flow 12.11.5 `NodeWrapper` assigns `role="group"` only when that node is focusable, but passes `aria-label` through unconditionally. Thus the reported prohibited attribute is consistent with current source for the non-focusable semantic-zoom nodes.

## Why the original keyboard claim is not retained

- Semantically hidden nodes are made non-focusable, have pointer events disabled, and their card content is `visibility:hidden` / `aria-hidden`; these are intentionally not the current graph's interactive targets.
- Visible nodes use React Flow's focusable group behavior and the app's roving node focus.
- `GenealogyTree.tsx` implements Arrow-key parent/child/sibling traversal, Enter/Space selection, Escape clearing, and search/filter-based reveal. `scripts/genealogy-browser-contract.mjs` asserts ArrowUp traversal from Isaac to Abraham to Terah, Enter opens person details, Escape closes and restores focus, plus filter/search keyboard behavior.
- The 2026-09-23 observation “5 tabbable nodes” is a snapshot of one semantic-zoom state, not proof that only five people can ever be reached by keyboard.

## Remaining uncertainty / possible optional cleanup

An axe-clean implementation could avoid putting `aria-label` on non-focusable generic wrappers (and assert that the label remains on focusable nodes). However, no current browser/AT witness shows that these semantically hidden wrappers create an actual user-facing failure. The historical axe result is not a fresh 2026-09-29 browser run. Chromium 153 became runnable later in this session, but this browser wave did not test the genealogy graph/ARIA behavior.

Do not promote unless a current accessibility-tree/AT check shows that intended visible nodes lose their accessible role/name, or a current axe result plus user-impact review establishes that the hidden-wrapper attributes require a product repair. Retain as optional ARIA hygiene / owner review, outside active matrix arithmetic.
