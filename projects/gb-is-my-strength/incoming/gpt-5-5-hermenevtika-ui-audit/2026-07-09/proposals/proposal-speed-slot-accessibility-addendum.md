# Proposal addendum — search⇄speed slot accessibility

- Proposal status: `proposal-open`
- Related finding: `HERM-UI-011`
- Current source HEAD: `2313f36f6aeaf7415e85d5e353e7e4cd10222ece`
- Functional introduction/reverify commit: `b8eabe75afe88f9c272384e122f0e240615e1f37`

## Ownership correction

The initial route-lane proposal predates the desktop rail's adoption of `_shared/speedSlot.ts`. The new keyboard/accessibility defect crosses route and shared-component ownership. It must not be repaired by silently editing `_shared/speedSlot.ts` inside a route-only lane.

## Proposed implementation split

### Hermeneutics route owner

Allowed route-local work:

- `HermenevtikaRail.astro`: inactive-layer CSS/ARIA hooks, search-button state, focus target markers;
- `HermenevtikaMobileBar.astro`: corresponding search-input state and modal integration;
- route browser/a11y regression coverage.

### Shared speed-slot owner

Declare a narrow shared-component lane for:

- `src/components/article-pilots/_shared/speedSlot.ts`;
- all direct consumers that must be verified after the shared behavior changes;
- existing shared-component tests/audits only.

Required behavior:

1. Closed state:
   - search is exposed and keyboard reachable;
   - speed rail is `aria-hidden`/inert and every chip is outside sequential Tab order.
2. Open state:
   - search layer is hidden from accessibility and removed from Tab order;
   - selected radio is the single roving Tab stop;
   - focus enters the radiogroup when explicitly opened by the speed badge.
3. Keyboard:
   - ArrowLeft/ArrowUp and ArrowRight/ArrowDown move selection;
   - Home/End move to first/last, or omission is explicitly justified;
   - Enter/Space select;
   - Escape closes and returns focus to the invoker.
4. Pointer/touch:
   - horizontal dragging remains functional;
   - no click-through to the covered search layer;
   - auto-close never strands focus on a now-hidden chip.
5. Synchronisation:
   - `aria-checked`, saved rate, badge text and TTS rate remain aligned across all visible consumers.

## Cross-route verification set

At minimum verify every direct consumer named by the source comments/current code:

- Hermeneutics desktop rail;
- Hermeneutics mobile top bar;
- Gill desktop rail;
- Gill mobile bar.

## Forbidden scope

- no redesign of Play/TTS engine;
- no Bible tooltip work;
- no Gill content/TOC changes;
- no package/workflow churn;
- no editorial metadata changes.

## Acceptance evidence

- keyboard trace for every consumer;
- accessibility-tree capture showing only the active slot layer;
- pointer/touch drag trace;
- no hidden focus after the 4.5-second auto-close;
- source audit proving inactive controls are not Tab-reachable;
- project shared-file guard and final static-publication gate.