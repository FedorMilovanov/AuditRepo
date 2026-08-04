# CURRENT HEAD REVERIFY — Avraam skip navigation and contrast

- Date: 2026-08-03
- Source repository: `FedorMilovanov/gb-is-my-strength`
- Source PR: #812
- Exact verified PR head: `3bd7f8a47bab65f08de45d81707cff2f6233cc55`
- Source/main merge: `778a218d9e6dc4c051721fc0f0fe56ee9125c797`
- Last exact production authority: `abf1edba190280e554dfda085bef9fb6594c896d`
- Production claim: **none**

## Dispositions

### `A11Y-P1-02` — fixed-current

The historical reading-order defect is repaired. The full sr-only projection still precedes the interactive map, but one route-owned focus-reveal skip link now precedes that projection and targets the programmatically focusable `#stage` owner.

Exact Chromium Dossier run `30807589787`, artifact `8853648893`, digest `sha256:54653a134572f2c6885168dacb938c9213c687d0425f7c5ec497876bdd9d7522`, recorded on both desktop `1440×900` and mobile `390×844`:

- skip-link count `1`;
- `href="#stage"`;
- skip-link before static fallback, fallback before stage;
- first Tab focused the skip link;
- focused geometry `295.125 × 44`, top/left `10`, visible, `display:flex`;
- native activation moved focus to `#stage` and set hash `#stage`;
- stage owns `tabindex="-1"`;
- `304/304` expected dossier states, failures `0`, warnings `0`.

The final Reference Baseline keeps the skip link out of only the two generic offscreen-control arrays while it is unfocused. Dedicated focus-order, focused geometry and activation evidence remains fail-closed in the Dossier witness; no other offscreen control is exempted.

### `A11Y-P1-03` — stale-on-current-head

The historical browser claim that archaeological metadata renders at `2.15:1` is not reproducible on the exact verified source head. The Dossier witness samples the actual browser-composited foreground through ancestor backgrounds instead of inferring contrast from a stale CSS token.

Artifact `8853648893` records:

- contrast samples: `1208`;
- minimum ratio: `5.084:1`;
- maximum ratio: `7.351:1`;
- invalid samples: `0`;
- threshold owner: WCAG AA `4.5:1`.

This disposition closes only the canonical `2.15:1` claim. It does not assert that every visual element on every map route has been audited by this witness.

## Final exact-head evidence

All 12 triggered workflows on `3bd7f8a47bab65f08de45d81707cff2f6233cc55` succeeded before squash merge `778a218d9e6dc4c051721fc0f0fe56ee9125c797`:

- Avraam Dossier run `30807589787`, artifact `8853648893`, digest `sha256:54653a134572f2c6885168dacb938c9213c687d0425f7c5ec497876bdd9d7522`;
- Avraam Reference Baseline run `30807589755`, artifact `8853899070`, digest `sha256:6a407a7c5e142d1939ec57b20ae2bfa69be0243c6c00c4667343a75cbf70d2a4`;
- Avraam Static Projection `30807589786`;
- Map Archaeology Projection `30807589794`;
- Deploy Candidate `30807589825`;
- Visual Parity `30807589846`;
- Print Paper `30807589768`;
- Shared Files `30807589881`;
- Native Source `30807589861`;
- Editorial Dateline `30807589805`;
- Metadata `30807589798`;
- Glossary `30807589785`.

The Reference Baseline covered seven viewports. Every result recorded `fatal=null`, verification failures `0`, offscreen labels `0`, label overlaps `0`, undersized controls `0`, offscreen fixed controls `0`, console errors `0` and failed requests `0`. The intentional unfocused skip-link state is counted separately as `focusOnlySkipControls=1`.

## Canonical arithmetic applied by this transaction

- Canonical IDs: **358**
- Closed: **189 → 191**
- Open: **169 → 167**
- P1: **81 → 79**
- P0: 0
- P2: 34
- P3: 47
- Refactoring: 4
- AuditRepo: 3

The total remains `358 = 191 + 167`. No adjacent Karty finding is silently closed by this wave.

## Boundary

This document records source and browser finding disposition only. It does not establish deployment, live convergence or production authority; the last exact production authority remains `abf1edba190280e554dfda085bef9fb6594c896d`.
