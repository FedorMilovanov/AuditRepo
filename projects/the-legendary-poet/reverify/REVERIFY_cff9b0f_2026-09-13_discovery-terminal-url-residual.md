# Reverify — TLP-DISCOVERY-001 terminal Pages URL residual — 2026-09-13

## Scope

Integrity correction after the earlier Product #494 discovery closure. This receipt reopens only `TLP-DISCOVERY-001`; community abuse authority and external GA4 property authority are unchanged.

- AuditRepo correction base: current `main` after PR #458.
- Product base/current main: `cff9b0f6cbe986a4d8dc79e22661b331a1207592`.
- Residual implementation lane: Product PR #507, head `9e98a6e4eed68c8438d1edd2dcbe77e7fcd82e7f`.

## Contradictory production witness

Fresh production verification after #494 established a real residual that the previous validators could not detect because they compared mutually consistent generated artifacts rather than the terminal URL actually served by GitHub Pages.

Representative behavior before #507:

- `/poets/alexander-pushkin` resolves to terminal `/poets/alexander-pushkin/`, while canonical/OG discovery metadata advertised the no-slash router form;
- `/privacy` resolves to `/privacy/`;
- `/articles` resolves to `/articles/`;
- `/music` resolves to `/music/`.

The result is an avoidable redirect from every advertised deep canonical URL. That is a current discovery/transport parity defect, so the prior #494 closure is superseded rather than preserved as false-green.

## Product #507 state

#507 introduces one public terminal-route URL authority while leaving internal application/router paths unchanged. The helper preserves root `/` and terminalizes deep public routes to `/path/`.

The authority is consumed by:

- runtime canonical and `og:url`;
- route JSON-LD and breadcrumb/person identifiers;
- prerendered canonical/OG metadata;
- sitemap and discovery-manifest canonical URLs/fingerprints;
- Atom entry links;
- materialized legacy-alias targets;
- exact route/discovery validators and browser assertions.

Changed files are discovery/SEO/release surfaces only; analytics, community mutation authority and editorial content are not part of the lane.

## Current gates

At head `9e98a6e4eed68c8438d1edd2dcbe77e7fcd82e7f`:

- CI: success;
- Project contracts: success;
- Content model: success;
- Site route integrity audit: success;
- Merge certification: success;
- Hall/runtime and publication acceptance contours: success;
- initial Manual Browser QA: failed only at the inherited light-theme comment-textarea focus indicator assertion (measured 1.626:1 vs required 3:1);
- the identical contrast outcome was already certified green on Product #506 exact head, and #507 does not change theme/community UI; a clean rerun was requested without weakening the assertion.

## Disposition

`TLP-DISCOVERY-001` is reopened as `RESIDUAL-REOPENED / TERMINAL-PAGES-URL-PARITY / P2`.

It may leave the active matrix again only after Product #507 is merged from a green exact-head browser contour and resulting-main production proves that terminal Pages URLs, sitemap, canonical, `og:url`, JSON-LD, feed and legacy redirects all agree without an avoidable advertised-URL redirect.

Matrix correction:

- P1 stays 1;
- P2 `1 -> 2`;
- P3 stays 0;
- total active `2 -> 3`.
