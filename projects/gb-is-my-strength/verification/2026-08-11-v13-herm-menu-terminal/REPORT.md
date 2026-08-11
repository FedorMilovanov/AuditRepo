# V13 Hermenevtika + Site Menu — terminal closure

Date: 2026-08-11
Product repository: `FedorMilovanov/gb-is-my-strength`
Audit classification: `TERMINAL / MERGED-GREEN / RESIDUAL NONE FOR THESE ROOTS`

## Scope

This report closes only the two V13 roots that were active in MASTER:

- `V13-HERM-CHROME-OWNERSHIP`
- `V13-SITE-MENU-NATIVE-FAILSAFE`

It does not reopen the older bibliographic Hermenevtika Wave 12B row or the already-terminal Site Sections Menu ownership root closed by Product PR #1558.

## V13-HERM-CHROME-OWNERSHIP

Product PR: #1585 `fix(reader): harden Hermenevtika mobile chrome ownership`
Merged main commit: `129c18a5ffca0d100e1eebf1792017c689e055f8`
Exact tested PR head: `57c4a83df2d70a0977a36633321dfd589cd5bafe`

Terminal mechanism:

- generic Hermenevtika desktop floater is non-rendering through 1199px while the dedicated mobile/tablet bar owns that window;
- desktop ownership resumes at 1200px;
- seeded saved-quotes state keeps the docked Highlights control at canonical 36x36 geometry;
- stale fixed-FAB offsets and the floating bump animation cannot distort the docked bottom-bar control;
- the Hermenevtika proof is an independent Runtime Interactive Audit job and therefore cannot be skipped behind an unrelated Home failure.

Exact-head browser evidence:

- Runtime Interactive Audit run `31434712840`
- Hermenevtika job `93606201092`
- result: `PASS (84/84; 2 route(s); Chromium + WebKit)`
- retained artifact: `hermenevtika-mobile-chrome-31434712840-1`

Disposition: `TERMINAL MERGED-GREEN`; residual for this root: `NONE`.

## V13-SITE-MENU-NATIVE-FAILSAFE

Product PR: #1613 `fix(site-menu): enforce native fail-safe on latest main`
Merged main commit: `9aba01c60b4c680c2121f8ef78db816138caa004`
Exact tested PR head: `ab09aeed148970af8d6794960156e9de251b44ac`
Fresh base used by the final merge vehicle: `129c18a5ffca0d100e1eebf1792017c689e055f8`

Terminal mechanism:

- rich menu panel and backdrop are natively `hidden` at SSR; panel is also inert/ARIA-closed;
- chevrons carry intrinsic 13x13 geometry plus `fill=none` and `stroke=currentColor`, so missing CSS cannot produce raw oversized black SVGs;
- canonical runtime is generation 3 and refuses reuse of a stale earlier-generation controller on the same connected DOM nodes;
- close restores native hidden immediately when no real transition exists / reduced motion applies, otherwise after the existing exit transition;
- permanent witness always proves mobile closed-state before any viewport fallback, includes destructive no-CSS open/close, Escape/backdrop focus restoration, overflow/geometry checks and traversal-safe evidence serving.

Fresh integration evidence on the final merge vehicle:

- Shared Files Guard run `31448278183`, job `93647083360`: PASS, including exact-head/live-main authority, lifecycle hygiene, lane collisions, generated integrity, workflow policy and shared/system diff checks.
- Site Sections Menu Contract run `31448278138`, job `93647083331`: PASS.
- reader-controls residual behavior proof: `1152/1152`, Chromium + WebKit.
- site-menu visual/native fail-safe proof: `1308/1308`, 57 registry-derived routes, Chromium + WebKit.
- retained artifact: `site-sections-menu-31448278138`.

The selective-recovery chain #1584 -> #1608 -> #1613 preserved evidence while refusing stale merge-base state; predecessor PRs were not used as merge vehicles after `main` advanced.

Current Product `main` now contains runtime generation 3 at merge commit `9aba01c60b4c680c2121f8ef78db816138caa004`.

Disposition: `TERMINAL MERGED-GREEN`; residual for this root: `NONE`.

## MASTER effect

Both V13 rows leave active MASTER in this same closure wave. Remaining direct current defects are independent V14 roots:

- `V14-SEARCH-SCOPE-TAB-SEMANTICS`
- `V14-SW-TOAST-A11Y`

`FINAL-ZERO-AUDIT` remains blocked until those current Product roots and any intended-to-merge Product work reach terminal disposition.
