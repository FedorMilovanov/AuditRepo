# Lot audit post-anchor update — 2026-08-09

This file extends `REPORT.md` without rewriting its historical exact anchor. Product moved while the audit was running, so the original observations remain evidence for the exact audited head and the following entries record the later current state.

## Product movement after the original anchor

Original audit anchor:

- Product `main@6c38e340f3e6d3cb73d17c6a301b11f426e46373` (#1343)
- Lot publication `#1339@189dfddbeed537c849dd35b1a92578ead894079d`

Later observed current Product main:

- `8383f35e4596711e03d656846030f82cdbbf51c2` — `fix(strangler): resolve Gill context reference storage (#1347)`

Fresh compare from `main@8383f35e…` to `#1339@189dfdd…` reports:

- status: `diverged`;
- `behind_by=2`;
- `ahead_by=10`;
- merge base remains `56972725dbe7aa9c5ecbf0d1efa2e9012e37f019`.

Disposition: `LOT-ANCESTRY-01 = CONFIRMED-CURRENT MERGE-BARRIER`. All green runs attached to `189dfdd…` remain historical evidence only; after any current-main replay/refresh the final branch must earn new exact-head CI.

## New confirmed downstream discovery defect

### `LOT-SEARCH-ROLE-01` — P2 discovery metadata — `CONFIRMED-CURRENT / OWNED-UPSTREAM`

Canonical Product owner: draft PR `#1313` (`SEARCH-MANIFEST-NEW-ROW-ROLE-AUTHORITY`).

The upstream regression-first audit proved that the old Search Manifest new-row writer:

- assigned `editor` from `<meta name="author">`;
- did not emit `author` for an ordinary authored Article;
- therefore silently relabelled author identity and lost author-scope Search semantics.

The `#1313` owner also recorded the concrete Lot consequence: the generated Lot row already materialized by `#1339` has:

- `editor: "Фёдор Милованов"`;
- no `author`;
- exactly the old writer shape repaired by `#1313`.

Correct repair boundary:

1. Do not hand-edit the Lot row in `data/search-manifest.json`.
2. Merge the upstream writer authority only after its own exact-head barrier.
3. Refresh the Lot publication lane from the then-current main.
4. Re-run canonical Search Manifest / RSS / sitemap autofix so the Lot row is rematerialized from corrected author/editor authority.
5. Make the `/articles/` catalog consumer preserve author-only rows rather than requiring `editor`; `#1313` has already notified the catalog owner about this dependency.

This is not a reason to open a second Lot Search writer lane.

## Scripture projection owner now exists

### `LOT-SCRIPTURE-PROJECTION-01` — owner update

The original report classified the exact `#1339` Scripture index failure correctly as an expected deterministic projection refresh rather than a hand-edit bug.

Product draft PR `#1353` now creates the durable SYSTEM owner for that operation:

- one workflow file only;
- label-gated same-repository `autofix` path;
- runs canonical `scripts/build-scripture-occurrence-index.mjs --write`;
- immediately proves idempotence and the existing contract;
- rejects every changed path except `data/scripture-search-index.json`;
- does not create an alternate generator or temporary writer.

Immediate consumer is catalog successor `#1348`; the same durable writer is intended for the fresh Lot publication successor after catalog merge.

Disposition: retain the red exact-head result as useful evidence, but mark the **repair mechanism as `OWNED-UPSTREAM #1353`**. Do not create a temporary Lot-only workflow or manually edit the derivative.

## Current ownership map for Lot-related residuals

| Residual | Current disposition / owner |
|---|---|
| Missing JSON-LD `#website` | `CONFIRMED-CURRENT` — route-local publication owner `#1339` |
| Missing `#sec-map-connection` in canonical TOC | `CONFIRMED-CURRENT` — route-local publication owner `#1339` |
| Plain Scripture refs / zero Lot `.bref` anchors | `CONFIRMED-CURRENT` — Lot content/publication integration; must use existing Bible-reference contract |
| Human orphan `/articles/lot-i-sodom/` | `CONFIRMED-CURRENT / OWNED-UPSTREAM #1348` |
| Search row loses author role | `CONFIRMED-CURRENT / OWNED-UPSTREAM #1313` |
| Scripture occurrence derivative stale | `EXPECTED DERIVED REFRESH / OWNER #1353` |
| Tall el-Hammam Avraam parity | `OWNED #1334/#1298` |
| 14 raster families + Lot OG + deep browser witness | `NOT IMPLEMENTED / IN-FLIGHT`, not a shipped regression |
| Publication ancestry | `MERGE-BARRIER`, currently `behind=2` at this update |

## AuditRepo decision

No new global MASTER row is created by this update. The findings already have precise Product ownership or remain route-local residuals in the active Lot publication lane. Promoting them prematurely into the global MASTER would duplicate live ownership and make the matrix noisier rather than more truthful.

The durable AuditRepo value is the exact evidence/disposition chain:

`verify exact head → distinguish Product bug from derivative refresh → identify owner → disprove false positives → reverify after owner merge`.
