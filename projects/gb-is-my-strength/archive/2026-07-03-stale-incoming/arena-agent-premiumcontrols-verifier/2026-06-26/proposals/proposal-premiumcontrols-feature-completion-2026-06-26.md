# Proposal — PremiumControls feature completion before global CSS/JS cleanup

- Project: `gb-is-my-strength`
- Agent: `arena-agent-premiumcontrols-verifier`
- Date: `2026-06-26`
- Based on source SHA: `106f98d`
- Related intake: `incoming/arena-agent-premiumcontrols-verifier/2026-06-26/REPORT.md`
- Proposal status: `proposal-open`

---

## Goal

Finish PremiumControls as a **single route-aware control system** before doing broad CSS/JS cleanup.

Owner intent from chat:

> сначала закончить топово по всему сайту, а потом уже CSS JS приводить в порядок

Therefore: do **feature-scoped architecture normalization now**, postpone broad CSS/JS debt reduction later.

---

## Canonical repair lane

```text
lane/premiumcontrols-feature-completion-2026-06-26
```

Mode: `SYSTEM`, but route-scoped changes allowed only where PremiumControls are currently visible or explicitly planned.

---

## Bugs covered

| ID | Severity | Scope | Summary |
|---|---|---|---|
| `PC-001` | P1 | architecture | Missing `PremiumControlAnchor`; standalone controls still self-position via `fixed` |
| `PC-002` | P0/P1 | heart series | `Krajne` / `Rimlyanam7` have `gb-ember` + `gb-save` but no fc root/control scope |
| `PC-003` | P1 | asset delivery | multiple hardcoded `floating-cluster-controller.js` / CSS hash versions remain in source |
| `PC-004` | P1 | CSS source | CSS duplicated between component `<style is:global>` and `css/floating-cluster.css` |
| `PC-005` | P2 | PlayEmber UX | speed panel exists, but generic idle play handler still says audio unavailable; key namespace drift |
| `PC-006` | P2 | governance | no route-archetype audit/lock for PremiumControls rollout |

---

## Phase order

### Phase 0 — Freeze route archetype inventory

Create a small route matrix for PremiumControls only:

```text
single-anchor:
  - hermenevtika
  - kod-da-vinchi

series-lite:
  - antisovetov
  - krajne
  - rimlyanam7

gill-rail:
  - gill context
  - gill part 1
  - gill part 2
  - gill part 3
  - gill spravochnik

series-rich-existing:
  - nagornaya chast 1..5
  - baptisty-rossii articles

app/no-controls-by-default:
  - karty/* apps
  - map
  - konfessii/russkij-baptizm iframe app
  - rodosloviye

landings/catalogs:
  - no PremiumControls unless explicitly approved
```

Add an audit script or static guard:

```text
scripts/premium-controls-rollout-audit.js
```

It should check:

- allowed routes have expected control root(s);
- forbidden app/landing routes do not accidentally get article controls;
- every visible `gb-ember` / `gb-save` is inside `[data-fc-root]` or `[data-fc-controls]` or another explicitly supported route root;
- no stale hardcoded controller/CSS hash groups.

---

### Phase 1 — Fix visible dead controls first

Priority target:

```text
KrajneBody.astro
Rimlyanam7Body.astro
```

Current source has:

```text
gb-ember > 0
gb-save > 0
data-fc-root = 0
data-fc-controls = 0
```

Fix options:

1. wrap the relevant `gbs2-rfoot` control cluster with a supported root:
   ```html
   data-fc-root data-fc-mode="series-lite" data-fc-variant="heart"
   ```
2. or introduce a route-specific `data-fc-controls="heart-rail"` supported by controller;
3. or remove visible `gb-ember`/`gb-save` until heart-series PremiumControls are fully rolled out.

Recommended: option 1 or 2, not removal, because owner wants feature completion.

Acceptance:

- Play opens speed panel;
- Save toggles `is-saved` and local favorite state;
- no duplicate old TTS/FAB controls;
- `premium-controls-rollout-audit` passes.

---

### Phase 2 — Normalize PlayEmber semantics

Current source:

- speed panel stores `gbx-tts-rate`;
- idle `handlePlayClick()` shows `Озвучка ещё не подключена`;
- speed-panel path and generic play path are separate.

Target:

- click PlayEmber always opens speed panel if audio is unavailable;
- no contradictory toast for the same visible control;
- use canonical storage key:
  ```text
  gb:audio:rate
  ```
- read old alias:
  ```text
  gbx-tts-rate
  ```
  for backward compatibility;
- set `aria-haspopup`, `aria-expanded`, `aria-controls` consistently.

---

### Phase 3 — Add/settle anchor layer

Preferred per attached PDF:

```text
PremiumControlAnchor = layout/geometry
PremiumControls = presentation
controller = behavior
```

Implementation can keep transitional names if needed, but must document the decision.

For `single-anchor` routes:

- control root should occupy old theme/breadcrumb visual slot;
- inner controls should not be responsible for viewport geometry;
- route-specific top/right values should be on anchor, not UI surface.

Acceptance:

- Hermeneutics control top delta ≤ 8px relative to breadcrumb-level;
- no viewport-right drift on desktop;
- mobile pill follows reference screenshot geometry.

---

### Phase 4 — Canonicalize feature CSS without broad CSS cleanup

Do **not** start general site.css cleanup yet.

But PremiumControls should not have two manual sources forever.

Choose one:

1. canonical `src/styles/premium-controls.css` and generated `css/floating-cluster.css`;
2. canonical public `css/floating-cluster.css` imported/linked everywhere;
3. canonical component CSS only, then delete public CSS after all legacy/static contexts are gone.

Requirement: one source of truth, no manual drift.

Acceptance:

- undefined CSS var warnings in `css/floating-cluster.css` resolved or file no longer audited as live;
- component/global selectors do not fight each other;
- no duplicate `<link>` + component-bundled CSS on same route.

---

### Phase 5 — Source hash delivery cleanup

Current latest source still has multiple hardcoded controller versions:

```text
ba4a4019, efd81d3a, 58c2ea90
```

Even if postbuild fixes `dist`, source is not monolithic.

Target:

- no hardcoded stale hashes in Astro source;
- use build-time helper/component for asset links;
- or central asset manifest consumed by PageHead/Footer components;
- postbuild should be safety net, not primary truth.

---

### Phase 6 — Browser smoke gate

Once Playwright system deps are available:

Test at minimum:

```text
Hermeneutics desktop/mobile
Kod da Vinci desktop/mobile
Antisovetov desktop/mobile
Krajne desktop/mobile
Rimlyanam7 desktop/mobile
Gill context desktop/mobile
Gill part 1 desktop/mobile
Nagornaya chast 1 mobile
Baptisty noch-na-kure mobile
```

Check:

- every `[data-fc-action]` visible and clickable;
- Play opens speed panel;
- speed persists after reload;
- Save toggles state;
- theme toggles `html.dark`;
- search opens command palette;
- no duplicate visible old controls;
- no horizontal overflow;
- no console/page errors.

---

## What NOT to do in this lane

- Do not globally reduce `!important` count.
- Do not refactor all `site.js` modules.
- Do not redesign article layouts.
- Do not rewrite map apps.
- Do not change article content.
- Do not add PremiumControls to app routes by default.

---

## Merge gate

Before merge:

```bash
npm run validate:all
node scripts/audit-pro.js
npm run content:guard
npm run native:runtime:audit:strict
npm run premium-controls:rollout:audit  # new or equivalent
```

If browser deps available:

```bash
npm run interactive-audit
# plus targeted PremiumControls Playwright smoke
```

---

## Final recommendation

Treat PremiumControls completion as a **short, focused system lane**. Once it is stable and audited, only then start broad CSS/JS cleanup. This avoids the repeated pattern where agents half-add UI, then cleanup scripts and route migrations fight over incomplete state.
