# CURRENT HEAD REVERIFY — 2026-07-21 — `ffdba149`

## Immutable source truth

- Source repository: `FedorMilovanov/gb-is-my-strength`
- `main`: `ffdba1496b66a18b16feaa231af5922d118dc3f8`
- Map layers/theme merge: `6a7539f97b53c591cdb0b4229caaec9d20e423b9` (PR #98)
- Reader R1 final PR head: `deca733ca2fd102f1cd81da7ac43ef9c6b207aec`
- Reader R1 squash merge: `ffdba1496b66a18b16feaa231af5922d118dc3f8` (PR #101)
- Exact deployed SHA: **not proven by available connector witness**

## Landed transactions

### PR #98 — map layers and palette

Closed `MAP-P0-06` and `MAP-P0-07`: composite memberships, alternate journeys,
shared cities, persistent/default-off layers and actual light/dark SVG/canvas/chrome palette.
Pure and Chromium witnesses passed before merge.

### PR #101 — Reader R1

Introduced one canonical reader preference store/API and site-wide Day/Night/Sepia
foundation across series, book-shaped series, standalone article, ordinary page and map.
Removed route-owned anti-FOUC implementations in favour of `ReaderPreferencesHead`.

Adversarial proof found and fixed two runtime/test defects:

1. `engine:sweep` did not close browser/server on exceptions and could hang CI;
2. scroll-lock MutationObserver rewrote already-correct lock styles forever, starving
   the renderer on the first physical settings click.

The lock is now idempotent and repair-only; runtime contract prevents regression.

## Verification

On final cleanup head `deca733ca2fd102f1cd81da7ac43ef9c6b207aec`:

- Shared Files Guard: PASS;
- runtime/reader/map regressions: PASS;
- actionlint: PASS;
- Native Source Contract: PASS;
- Astro type/template check: PASS;
- production-like dist: PASS;
- native article/series output + migration metadata: PASS;
- cross-engine Chromium matrix: PASS;
- `engine:sweep`: **98/98 PASS**.

Temporary proof/corrector workflows were removed before merge.

## Architectural conclusion

Book remains declarative `series.shape='book'`; do not fork a book engine.
The next safe transaction is R3 `SeriesReaderChrome` façade with mechanical import
migration and unchanged DOM/CSS, followed by R4 full public route registry.

## Remaining risks

- exact production deployed SHA is still unproven;
- overlay lifecycle remains partially split (issue #58);
- unified progress/bookmarks/notes state remains open (issue #59);
- map P0 remainder: `MAP-P0-01`, `ASTRO-P0-03..06`, `DATA-P0-01`.
