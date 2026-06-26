# Current HEAD Reverify — GBS Runtime Root-Cause Notes — 2026-06-26

## Meta
- Project: gb-is-my-strength
- Date: 2026-06-26
- Verifier: `arena-agent`
- Method:
  - source inspection
  - dist JS inspection
  - targeted Playwright browser witness with desktop/mobile distinction

---

## Executive summary

This pass partially overturns the previous coarse interpretation and narrows the likely root cause.

### What changed
The earlier cross-family matrix used desktop viewport only and therefore undercounted/mobile-misread parts of the GBS control world.

After targeted source/runtime tracing:
- the GBS bottom-sheet open path **does work** when tested in mobile viewport;
- at least one visible theme button in both Gill and baptisty families **does toggle dark mode correctly**;
- the earlier “all GBS controls inert” framing was too broad.

### What remains live
The stronger current issue is more specific:
- GBS families render **duplicate control instances**, where one instance is hidden/zero-geometry and another is the actual interactive mobile control;
- desktop and mobile control paths are split and easy to misread in browser verification;
- search/share/runtime health still needs narrower verification, especially outside theme toggle.

---

## Source/runtime findings

### 1) Two distinct runtime layers are involved

#### `js/enhancements.js`
Contains GBS-world logic for:
- TOC building
- `#gbs2Bbar` bottom-bar open path
- `#gbs2Sheet` open/close
- sheet tab switching

This directly explains why mobile sheet behavior can work even when other controls still look suspicious.

#### `js/floating-cluster-controller.js`
Contains:
- delegated click handlers for `[data-gbs2-theme]` and `[data-gbs2-search]`
- `initGillRail()` wiring for Gill rail controls
- `initGbs2Controls()` for baptisty/GBS2-style theme/search/share/font/progress paths

This means GBS runtime behavior is split across at least two scripts, increasing verification complexity and historical regression risk.

---

## Browser witness corrections

### Gill theme toggle (desktop, targeted second instance)
On `/articles/dzhon-gill-chast-1-chelovek/index.html`:
- two `gill-rail` control containers are present;
- first has zero geometry;
- second is visible at the bottom of the rail;
- clicking the visible second theme button changes:
  - `html.dark: false -> true`
  - `localStorage.theme: null -> dark`

### baptisty theme toggle (desktop, targeted second instance)
On `/baptisty-rossii/index.html`:
- two `[data-gbs2-theme]` buttons are present;
- first hidden/non-visible;
- second visible;
- clicking the visible second button changes:
  - `html.dark: false -> true`
  - `localStorage.theme: null -> dark`

### GBS sheet open path (mobile)
On both:
- `/articles/dzhon-gill-chast-1-chelovek/index.html`
- `/baptisty-rossii/index.html`

mobile witness shows:
- before click: `aria-hidden="true"`, `gbs2-open = false`
- after `#gbs2Bbar` click: `aria-hidden="false"`, `gbs2-open = true`, `display = block`

### Correction to prior wording
The earlier statement that GBS sheet path is inert is **stale/overbroad** on current head.

---

## Root-cause interpretation

The current likely issue is not simple runtime death.
It is a more subtle architectural/runtime duplication problem:

1. GBS pages emit multiple control instances for different contexts;
2. one instance may be hidden or zero-geometry;
3. naive browser counting/first-element clicking can produce false-negative conclusions;
4. runtime ownership is split between `enhancements.js` and `floating-cluster-controller.js`;
5. this split remains historically fragile given PremiumControls / phase3 / GBS churn.

This is still a real verifier concern because duplicated control worlds raise regression risk and make route-family behavior harder to reason about.

---

## What is still worth keeping open

### A) Duplicate/hidden control instance architecture — `confirmed-current architectural concern`
Evidence:
- Gill has two `gill-rail` control containers; one zero-geometry, one visible
- baptisty has two theme buttons; first hidden, second visible

This is not automatically a user-facing P1 bug by itself, but it is exactly the kind of duplication/ambiguity that historically breeds regressions and false verification.

### B) Search/share path still needs narrower recheck
The previous matrix likely under-tested these controls for the same reason as theme.
Theme is now shown to work when the correct visible instance is targeted.
Search/share should be re-run with:
- visible-instance targeting,
- mobile/desktop split,
- explicit dialog/copy-path assertions.

### C) GBS runtime split across multiple scripts remains a risk surface
Current source truth shows GBS behavior is distributed across:
- `enhancements.js`
- `floating-cluster-controller.js`
- plus generic site runtime

That remains a valid architectural verifier note.

---

## Verifier conclusion

The best current phrasing is now:

- **Earlier blanket claim “GBS controls inert across Gill+baptisty” is too broad and should not become canonical truth.**
- **Current canonical truth is narrower:** GBS control/runtime architecture is duplicated and split; visible theme toggle and sheet open path can work, but verification is brittle because hidden/duplicate instances coexist.

This is exactly why route-family + viewport-aware + visible-instance-aware verification is mandatory in this repo.
