# CURRENT HEAD REVERIFY — 2026-07-21 — `1a66bd8`

## Scope

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Source branch: `main`
- Exact source HEAD: `1a66bd8ef6c0316842deef75371db9598f7a16c6`
- Previous verified source HEAD: `1f80f12d8bea9a9eb2c196ed030ddfc5be3924df`
- Source transaction: PR #97, `fix(karty): unify initial viewport and deep-link state`.

## Landed fixes

`MAP-P0-04` and `MAP-P0-05` are fixed in the shared browser engine.

The engine now resolves exactly one state transaction before the first render:

1. explicit URL state — canonical query parameters, with legacy hash still readable;
2. saved local state;
3. default story and route/story viewport.

The implementation also:

- treats query as one atomic source and never mixes missing query keys with stale hash keys;
- builds the active story before rendering chips, markers and stages;
- removes the unconditional first-place `flyTo` that overwrote the declared viewport;
- removes the delayed saved-state reader that could overwrite explicit links;
- uses one URL builder for Share and runtime history updates;
- canonicalizes legacy hash links to query parameters;
- opens explicit/saved places after DOM construction and writes the resolved state back to storage;
- keeps zero-valued viewport coordinates valid.

## Verification

The PR passed:

- runtime integrity regressions;
- previous map-engine P0 regressions;
- new initial-state pure regression guard;
- strict Shared Files Guard and actionlint;
- full `validate:static-publication`;
- full `guard:shared-files`;
- `strangler:build:production-like`;
- Playwright browser witnesses on `/karty/ishod/` and `/karty/avraam/`.

The browser witnesses seeded conflicting localStorage, then verified query and legacy-hash links, active story chips, opened place panels, canonical query URLs, rewritten storage and declared default viewports.

Exact post-merge deployed SHA remains a separate witness task; do not infer production deployment merely from source/release gates.

## Remaining P0 order

1. `MAP-P0-06` — layer toggles must address compound layer membership instead of exact `data-layer` equality.
2. `MAP-P0-07` — theme toggle must control the actual rendered map palette rather than only a small variable subset.
3. `MAP-P0-01` — mobile panel escape.
4. `ASTRO-P0-03` / `ASTRO-P0-04` — warning-only validation and public counter drift.
5. `ASTRO-P0-05` / `ASTRO-P0-06` — initialization error and no-JavaScript fallback.
6. `DATA-P0-01` — authored curved paths are ignored by the browser engine.

Next source lane: one focused SYSTEM transaction for `MAP-P0-06` + `MAP-P0-07`, without visual cartography redesign or route-content edits.
