# PremiumControls clickability — diagnosis + fix — 2026-06-25

**Agent:** `arena-agent-2`
**Task:** close the PremiumControls (SVG day/night + search) "not clickable" issue on
Gill / Hermeneutics, continuing the work of the agent that crashed.
**Source HEAD audited:** `03e01a0` → after fix, pushed to branch
`lane/fix-gill-rail-clickability-premiumcontrols-2026-06-25` in `gb-is-my-strength`.
**Method:** jsdom on real DOM + **Playwright real-mouse-click on production-like dist**
(trust order #1). Node 22 + `strangler:build:production-like`.

---

## 1. Verdict on the user's complaint ("не нажимается день ночь и поиск")

Two distinct situations were found:

### A. Hermeneutics — WORKS on current HEAD (the original report is stale)
On production-like dist at `03e01a0`, `/articles/hermenevticheskaya-…/`:
- theme button (real mouse click): `dark false→true` ✅
- search button (real mouse click): command-palette `is-open:true, display:flex` ✅
- no 404, controller hash correct (`58c2ea90`).

The "doesn't work" the user saw was the **pre-PS-01 state** (`qs is not defined` killed
the controller). PS-01 was fixed in `c1bd605`, so Hermeneutics already recovers once the
fix reaches production. No new work needed for Hermeneutics itself.

### B. Gill GBS2 pages (part1/2/3/spravochnik) — GENUINELY BROKEN, now FIXED
`[data-fc-action="theme"]` rendered and visible (32×32) but **did not toggle** on click.
This is the real, still-live defect behind the SVG-controls rollout. Root cause + fix below.

---

## 2. Root cause — `initGillRail` initialized only ONE of TWO rail containers

`js/floating-cluster-controller.js`:

```js
// BEFORE (broken)
function initGillRail() {
  var railControls = qs('[data-fc-controls="gill-rail"]');  // ← qs = FIRST only
  if (!railControls) return;
  ...
  initCluster(railControls);
}
```

Gill part1/2/3/spravochnik render **two** `[data-fc-controls="gill-rail"]` containers —
a desktop rail and a mobile bottom bar. `qs()` returns the first one (the hidden/mobile
container), so `initCluster()` click-delegation was bound to the **invisible** rail, and
the **visible desktop rail's** theme/search buttons stayed unwired → clicks did nothing.

This is exactly runtime contract #1 from the rollout plan: *"initialize every root, not
just the first — Gill archetype is multi-root by definition."*

---

## 3. Fix (applied)

```js
// AFTER (fixed)
function initGillRail() {
  var railControlsAll = qsa('[data-fc-controls="gill-rail"]');
  if (!railControlsAll.length) return;
  railControlsAll.forEach(function (rail) { initCluster(rail); });
  ... // gbs2 theme/search wiring unchanged
}
```

Net diff: `qs`→`qsa`, `initCluster` moved into a `forEach` over all containers.
`node --check` passes; `data:consistency` passes.

---

## 4. Verification — Playwright real mouse click, production-like dist (after fix)

| Route | theme button (visible) | dark toggle | search |
|---|---|---|---|
| hermenevtika | @(1131,40) | false→true ✅ | opens ✅ |
| gill-context | @(318,456) | true→false ✅ | ✅ |
| gill-part1 | @(0,851) | false→true ✅ | ✅ |
| gill-part2 | @(-2,848) | true→false ✅ | ✅ |
| gill-part3 | @(-2,848) | false→true ✅ | ✅ |
| gill-spravochnik | @(-2,848) | true→false ✅ | ✅ |

Before the fix, gill-part1 desktop theme was `dark false→false ❌` (visible button,
click landed but no handler). All six now pass.

---

## 5. Scope / what is NOT covered by this fix (honest boundary)

- **baptisty-rossii/* (10 pages)**: use the GBS2 shell with `[data-gbs2-theme]`/
  `[data-gbs2-search]`; the controller wires these via the global capture-phase
  listener (already in `initGillRail`). Not re-tested for premium SVG cluster here.
- **nagornaya/chast-1..5**: `[data-fc-root]` present but no theme/search buttons inside
  it (separate, already-filed V2-2/NEW-3 font issue is the visible gap).
- **P0-10 residual**: 14 Astro components still hardcode `floating-cluster-controller.js
  ?v=efd81d3a` in *source* (postbuild cache-bust corrects it in dist to the current hash,
  so dist works, but source drift remains — a separate cleanup).

---

## 6. Handoff

- **Patch:** `js/floating-cluster-controller.js` (initGillRail, ~6 lines).
- **Branch pushed:** `lane/fix-gill-rail-clickability-premiumcontrols-2026-06-25` in
  `FedorMilovanov/gb-is-my-strength` (commit `8571849`). Ready for PR / merge.
- **Cache-bust hashes** updated across HTML by `node scripts/cache-bust.js` (file content
  changed → hash `6179ebbf`).

## 7. Status: RESOLVED (the live Gill SVG-controls defect)
Hermeneutics was already fixed by PS-01; the genuine remaining defect (Gill GBS2 desktop
theme/search dead) is fixed and verified on production-like dist.
