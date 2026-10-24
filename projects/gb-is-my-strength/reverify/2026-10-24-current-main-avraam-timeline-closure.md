# Current-main closure — Avraam heading and canon timeline keyboard

**Date:** 2026-10-24  
**Product anchor:** `c23da28a993737d563223eb251c8cc44ddbe2570` (`main`, detached diagnostic checkout)  
**Previous audited anchor:** `8d93fe4206e579e766727dbe865e0d07cf30d3c5`  
**Disposition:** two direct rows are `FIXED-CURRENT`; no new work unit is admitted.

## Scope and authority

This is the requested final bounded current-Product pass before AuditRepo PR #487 merge. The Product checkout remained unmodified. The seven-commit delta from the previous anchor changes only:

- `src/pages/karty/avraam/index.astro` and its map initial-state guard;
- `src/components/article-pilots/kod-da-vinchi/KodDaVinchiSectionCanon.astro` and the public-surface browser matrix.

Product PR #2187 merged as `9c7e3a473588a1f2d5b159158ae4e562ef79239f`; Product PR #2188 merged as current head `c23da28a…`. Current open Product PRs are #2189, #2179, #2164 and #2143; none owns either closure surface. No Product PR was merged or modified by this audit.

## Clean build baseline

`npm ci` completed. `npm run strangler:build:production-like` completed with exit 0 and built 104 Astro pages before the legacy publication projection. Astro check reported 0 errors, 0 warnings and six pre-existing hints. The final projection/cache-bust/heading and pastor-series guards all passed.

The package audit still reports one moderate development advisory. This does not alter the already-open dependency lifecycle system lane.

## `GBS-AVRAAM-MAP-HEADING-LOST-ON-READY` → FIXED-CURRENT

The merged repair removes the ready observer that deleted the sole page heading. Chromium 153 was run against the production-like build in four profiles:

- 1280×800 Light;
- 1280×800 Dark;
- 390×844 Light;
- 390×844 Dark with reduced motion.

Every profile reached `data-map-state="ready"`. Before entering the map, and again after trusted activation of the intro button:

- the DOM contained exactly one `h1`;
- its content remained the Avraam route title/summary;
- the native ARIA snapshot contained the named level-one heading;
- entry removed the intro but did not remove or duplicate the heading;
- page errors: 0.

This satisfies the active row's resulting-main boundary for desktop/mobile, both schemes, ready state and post-entry lifecycle. The no-JS/loading/error source contract remains protected by the narrowed map initial-state regression guard; no duplicate heading mechanism was introduced.

## `GBS-KOD-DA-VINCHI-TIMELINE-KEYBOARD-SCROLL` → FIXED-CURRENT

The merged component now gives `.ctw-body`:

- `role="region"`;
- `aria-labelledby="canon-timeline-region-label"`;
- `tabindex="0"`;
- a two-pixel `:focus-visible` outline with a three-pixel offset;
- ArrowLeft/ArrowRight scroll ownership with clamping.

At 650×844 the rendered scroll port measured `492×…`, `scrollWidth=605`, `maxScroll=113`. In Light and Dark:

- direct focus was truthful and matched `:focus-visible`;
- the outline was `2px solid` with `3px` offset;
- ArrowRight moved `scrollLeft` from 0 to 49;
- ArrowLeft returned it to 0;
- page errors: 0.

At 390×844, in Light and Dark/reduced-motion, the responsive reflow produced `clientWidth=scrollWidth=253` and therefore no clipped horizontal content. The same region/name semantics and visible focus remained intact; arrow activation did not create overflow. This is the required ≤640 px control, not a forced scroll success.

## Evidence integrity

Compact evidence is in `evidence/2026-10-24-current-main-avraam-timeline-closure.jsonl`. It contains one authority record and eight browser summaries. Every line parses as JSON and remains below the repository's 700-character evidence-line limit.

Browser executable: Chromium `153.0.8010.0`; automation: Playwright from the Product lockfile. The temporary browser, dependencies, build output and raw probe stayed outside AuditRepo.

## Matrix disposition

Remove these two active direct rows:

1. `GBS-AVRAAM-MAP-HEADING-LOST-ON-READY`;
2. `GBS-KOD-DA-VINCHI-TIMELINE-KEYBOARD-SCROLL`.

MASTER arithmetic changes from **49 = 28 direct + 4 improvements + 17 system lanes** to **47 = 26 direct + 4 improvements + 17 system lanes**. No other active row is narrowed or closed by this delta, and no new row is supported by the bounded current-anchor pass.
