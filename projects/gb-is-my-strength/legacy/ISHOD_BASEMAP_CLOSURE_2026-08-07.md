# LEGACY — Ishod basemap closure — 2026-08-07

This file is **retirement evidence, not active backlog**.

## IDs

- `MAP-P1-10`
- `BASE-P1-01`

## Historical active formulation

`MAP-P1-10` remained active because canonical strict-native Ishod created MapEngine without `baseGeoUrl`, while MapEngine mounted `#me-base-geo` only when that option existed.

`BASE-P1-01` remained active as the necessary implementation dependency because the historical shared `karty/_engine/base-geo.svg` was not a safe geographic base: its `<defs>` was empty while its body referenced unresolved gradients/filters/patterns/symbols. The active requirement explicitly allowed either repairing that shared asset or replacing it with an explicitly owned equivalent.

Original activation evidence remains in:

- `../verification/2026-08-07-full-matrix-consolidation/REPORT.md`;
- `MATRIX_CLEANUP_2026-08-07.md`;
- the compact MASTER history before Product #1149.

## Closure

Product owner: `FedorMilovanov/gb-is-my-strength#1149`.

Final Product exact repair head: `2d82dc6f0ed26ed2c843c532beefa7365f7c4bbf`.

Product squash merge: `c42d0d585133e8fea8dfdd43bec851740eedc9e8`.

`MAP-P1-10`: `closed-by-fix`.

`BASE-P1-01`: `closed-by-replacement`.

The repair added an explicitly Ishod-owned `karty/ishod/base.svg`, wired it through the canonical strict-native route without changing the shared MapEngine/IshodMap owners, and added a targeted browser contract to the existing Route Registry route-semantics owner.

On the final exact combined head, direct browser evidence proved both SVG network requests returned 200, `#me-base-geo` mounted, the nested atlas geography rendered with nonzero geometry, Pihahiroth remained `UNRESOLVED` with exactly three uncertainty corridors, the historical single point stayed non-authoritative, and page/console errors were zero. All 11 registered workflow groups were terminal green before merge.

The historical shared `karty/_engine/base-geo.svg` is **not** declared repaired by this retirement. It remains historical technical debt unless a future current-consumer proof makes it independently actionable. Its broken state alone does not revive `BASE-P1-01`, because the public Ishod dependency was satisfied by the allowed explicitly owned replacement.

Full exact evidence:

`../verification/2026-08-07-ishod-basemap-closure/REPORT.md`.

Do not revive either ID from this file without a new current Product witness showing that public Ishod again lacks a working owned geographic basemap or that the replacement dependency has become invalid.
