# PREMIUM CONTROLS ROUTE MAP — 2026-06-25

**Branch:** `lane/docs-audit-consistency-2026-06-25`  
**Type:** safe planning / audit doc, no implementation changes  
**Compared against:** `uploads/GB_PREMIUM_CONTROLS_FULL_PROJECT_ROLLOUT_PLAN_V4_2026-06-25.md`

---

## Purpose

This file translates the attached rollout plan into a repo-specific route map so active implementation agents can avoid overlap, false assumptions, and archetype drift.

Main principle preserved from the rollout plan:

```text
Premium controls = new visual/system layer for existing control slots,
not a second parallel widget pasted over unrelated route worlds.
```

---

## 1. Current repo-level control archetypes

From source scan, the project currently has these practical archetypes:

1. **single article premium cluster**
   - visual primitive: `FloatingCluster mode="single"`
   - expected placement: breadcrumb/topline anchor zone
   - current examples: Hermeneutics, Kod da Vinci

2. **series-lite premium cluster**
   - visual primitive: `FloatingCluster mode="series-lite"`
   - expected placement: breadcrumb/topline + compact series chip
   - current example: 20 antisovetov

3. **Gill rail premium controls**
   - visual primitive: embedded rail controls / `GillRailControls`
   - expected placement: inside rail / rich series chrome, not free-floating
   - current examples: all 5 Gill pages

4. **legacy GBS2 rail with partial premium markup**
   - old GBS2 theme/search/bottom sheet still primary
   - premium pieces (`gb-ember`, `gb-save`) already appear in markup
   - but route is not yet migrated to the reusable `FloatingCluster` / `SeriesLiteCluster` system
   - current examples: heart series pages

5. **route-specific non-premium series/app controls**
   - Nagornaya world, Baptisty series, map/app wrappers
   - should not be auto-treated as “article premium cluster” rollout candidates

6. **app / iframe routes**
   - no article premium controls expected
   - current examples: `/karty/*`, `/map/`, `/konfessii/russkij-baptizm/`, `/rodosloviye/`

---

## 2. Route registry vs route reality

The repo already has a route-intent registry:

- `src/data/floating-cluster-ui.ts`

It declares these rollout targets:

- Hermeneutics → `single`
- Kod da Vinci → `single`
- 20 antisovetov → `series-lite`
- Gill cluster → `series-rich`
- Heart routes (`krajne`, `rimlyanam-7`) → `series-lite`

### Important mismatch

The **heart routes are registered as `series-lite`**, but source implementation is still closer to:

```text
legacy GBS2 rail + partial premium markup
```

not to the reusable `FloatingCluster mode="series-lite"` archetype.

That means the route-intent map is ahead of actual implementation on the heart series.

---

## 3. Route-by-route map

| Route | Current route world | Current control state | Desired mode from plan | Conflict risk | Notes |
|---|---|---|---|---|---|
| `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/` | `gbs-paper` standalone article | `FloatingCluster mode="single"` + controller script + old `themeToggle` + old bottom/toc layer still present | `article-breadcrumb` / single | **HIGH** | pilot route; duplicate-slot risk if old controls are removed blindly |
| `/articles/kod-da-vinchi/` | `gbs-paper` standalone article | `FloatingCluster mode="single"`; controller loaded via footer; old `themeToggle` still present | `article-breadcrumb` / single | **HIGH** | single-article archetype, but source split across page chrome + footer |
| `/articles/20-antisovetov-pastoru/` | `gbs-paper` article | `FloatingCluster mode="series-lite"` + controller script + old controls still present | `series-lite-breadcrumb` | **HIGH** | good archetype for compact series-lite, but duplicate-slot risk remains |
| `/articles/krajne-li-isporcheno-serdce/` | GBS2 heart-series article | old GBS2 controls + partial premium markup (`gb-ember`, `gb-save`), no reusable series-lite cluster | `series-lite-breadcrumb` | **HIGH** | registry says `heart`, implementation not migrated to route archetype yet |
| `/articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/` | GBS2 heart-series article | old GBS2 controls + partial premium markup (`gb-ember`, `gb-save`), no reusable series-lite cluster | `series-lite-breadcrumb` | **HIGH** | same mismatch as Krajne |
| `/articles/dzhon-gill-istoricheskiy-kontekst/` | custom v16 Gill world | custom `data-fc-root` / `mobile-bottom-bar` / rail actions + controller script | `gill-rail` | **HIGH** | not the same implementation shape as Gill part 1–3 / spravochnik |
| `/articles/dzhon-gill-chast-1-chelovek/` | legacy-rich GBS2 Gill world | embedded `GillRailControls` + controller script + old GBS2 mobile/rail shells | `gill-rail` | **HIGH** | premium rail is embedded, not standalone |
| `/articles/dzhon-gill-chast-2-uchenyi/` | legacy-rich GBS2 Gill world | embedded `GillRailControls` + controller script + old GBS2 mobile/rail shells | `gill-rail` | **HIGH** | same as Part I |
| `/articles/dzhon-gill-chast-3-nasledie/` | legacy-rich GBS2 Gill world | embedded `GillRailControls` + controller script + old GBS2 mobile/rail shells | `gill-rail` | **HIGH** | same as Part I |
| `/articles/dzhon-gill-spravochnik/` | legacy-rich GBS2 Gill world | embedded `GillRailControls` + controller script + old GBS2 mobile/rail shells | `gill-rail` | **HIGH** | same as Part I |
| `/nagornaya/chast-1/` and `/nagornaya/chast-*` | Nagornaya route-specific world | no premium route archetype; script currently loads; partial premium markup may exist in legacy shells | route-specific / separate mode | **HIGH** | should not be force-fit into Gill or standalone premium model |
| `/baptisty-rossii/*` article routes | Baptisty series world | controller script present in legacy pages, but no premium roots | prep-only / route-specific | **HIGH** | current blast-radius problem: controller attached where no roots exist |
| `/karty/*`, `/map/`, `/rodosloviye/` | app routes | article premium controls not expected | `disabled-app-route` | **MEDIUM** | leave out of article rollout unless explicit app-specific design exists |
| `/konfessii/russkij-baptizm/` | iframe app wrapper | no article premium controls expected | `disabled-app-route` | **LOW** | current architecture is already app-isolated |

---

## 4. High-confidence implementation gaps discovered safely

## 4.1 Controller blast radius is much wider than premium-root coverage

Source/legacy scan result:

- pages loading `floating-cluster-controller.js`: **23**
- pages with actual premium roots / controls hooks: **8**
- pages loading controller **without** roots: **15**

### Pages loading controller without roots

- `baptisty-rossii/dva-sezda-1884/index.html`
- `baptisty-rossii/goneniya-i-sovest/index.html`
- `baptisty-rossii/iniciativnaya-gruppa/index.html`
- `baptisty-rossii/noch-na-kure/index.html`
- `baptisty-rossii/peterburgskaya-liniya/index.html`
- `baptisty-rossii/podpolnaya-pechat/index.html`
- `baptisty-rossii/sovetskaya-noch/index.html`
- `baptisty-rossii/spravochnik/index.html`
- `baptisty-rossii/vsehib-1944/index.html`
- `baptisty-rossii/yuzhnaya-shtunda/index.html`
- `nagornaya/chast-1/index.html`
- `nagornaya/chast-2/index.html`
- `nagornaya/chast-3/index.html`
- `nagornaya/chast-4/index.html`
- `nagornaya/chast-5/index.html`

### Why this matters

Even if the controller were perfect, this is unnecessary blast radius.
With the currently observed runtime regression (`qs is not defined`), these extra script loads widen the failure surface well beyond the pilot routes.

---

## 4.2 Duplicate-slot / mixed-system risk on single + series-lite pilots

The rollout plan warns against “new widget next to old controls”. Source scan confirms that risk is real.

### Confirmed mixed-state routes
- Hermeneutics
- 20 antisovetov
- Kod da Vinci

Observed pattern:

```text
premium cluster present
AND old theme / bottom / TOC infrastructure still present in route world
```

This does **not** automatically mean the route is wrong; some old hooks may still be intentionally needed.
But it does mean agents must treat these routes as **slot migration work**, not just SVG/CSS polish.

---

## 4.3 Gill is not one implementation shape

The rollout plan correctly warns that Gill rail is not the same as standalone floater.
Source confirms a second nuance:

- `GillContextPageChrome.astro` uses a **custom v16 control shell** (`data-fc-root`, `mobile-bottom-bar`, custom overlays)
- Gill Part I / II / III / Spravochnik use **embedded `GillRailControls` inside old GBS2 shells**

So “Gill” is already split into at least **two implementation shapes**.
A future rollout should not assume that fixing one Gill page automatically fixes the rest.

---

## 5. Safe sequencing recommendation from current repo state

Best non-conflicting order for active implementation agents:

1. **stabilize the controller/runtime layer first**
   - because one shared controller is now loaded across many unrelated pages

2. **close the two real pilot archetypes cleanly**
   - Hermeneutics → single article anchor
   - Gill context (or one canonical Gill rail page) → embedded rail archetype

3. **only then normalize the registry / rollout archetypes**
   - especially heart routes (`krajne`, `rimlyanam-7`), which are currently registry-ahead-of-implementation

4. **defer Nagornaya / Baptisty / app worlds**
   - until a route-specific placement strategy exists

---

## 6. Out-of-lane note for this safe branch

This document intentionally does **not** change any premium-control implementation.
It only reduces coordination risk by clarifying:

- which routes are in which archetype,
- where the registry is ahead of reality,
- where the controller blast radius is wider than intended,
- and where duplicate old/new control-slot risk is already present.
