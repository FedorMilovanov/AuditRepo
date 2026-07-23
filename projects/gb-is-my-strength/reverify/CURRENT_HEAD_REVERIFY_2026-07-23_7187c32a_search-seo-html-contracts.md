# CURRENT HEAD REVERIFY — `7187c32a` — search, SEO and HTML contracts

Date: 2026-07-23

## Boundary

- Current source `main`: `7187c32a39e1d5b185dbf385f651da0906911d74`.
- Last exact deployed source: `8a5352671375fdb01b6c30273c25ec4283a13f69`.
- Production witness retained: readiness `30006414898`, Pages `30007024100`, live sitemap 66 URLs, SHA-256 `5f3fa280af1ddc73f166decce47535d48ec60718375dd7c0418ea3675f82a801`.

This is source/CI evidence, not a claim that `7187c32a` is already the deployed Pages SHA.

## PR #165 — production SEO breadth

Merge `3baf6a3fb2ba0c25b60ee3da831e49dc7857aca6`; tested head `391da97c075f537d0005fff2a55857c24aaac48c`.

Production SEO derives from the effective route registry and built `dist`: 75 production routes, 66 indexable, 9 explicit noindex, exact canonical/robots policy, blocking missing HTML and Astro-only mutations. The first witness fixed 22 heart-series `twitter:image` gaps and `/rodosloviye/` creator metadata.

Evidence: Shared Guard `30011357937`, Route Registry `30011358428`, Native Source `30011358017`, Visual Parity `30011358388`, Overlay Browser `30011358482` — all success.

This closes `SEO-AUDIT-ROOT-ONLY`.

## PR #167 — production HTML breadth

Merge `04fc99f4a7925f28577f3b0a6654d3b1aa4af9ba`; tested head `4b213aeca0ee988f7f79e1797deb231cb0a43360`.

A dependency-free contract audits all 75 production HTML surfaces after build. Blocking scope: HTML presence, title, canonical, non-special H1, duplicate non-SVG IDs, image alt, local media/srcset targets, same-origin links, inline JavaScript syntax and JSON-LD parsing. Permanent mutations cover every failure class.

The first baseline separated three `/izbrannoe/` JavaScript-template false positives from markup and removed one real `/baptisty-rossii/` link to an unpublished local research file while preserving its visible wording.

Final report: 75 routes, 0 errors, 34 warnings — 19 title/OG drifts, 10 Baptist modified-time gaps, 5 Nagornaya byline-marker gaps.

Evidence: Shared Guard `30040050196`, Native Source `30040050142`, artifact `8576994409`, Visual Parity `30040050138` — all success.

This closes `VALIDATE-SCOPE-GAP` and `VALIDATE-JS-ARTICLES-ONLY`.

## PR #166 — explicit Search and Index policy

Merge/current source `7187c32a39e1d5b185dbf385f651da0906911d74`; final tested head `360b1db2e629ebd6d204c1be2ffa4891fd4abbcd`.

One explicit policy matrix now covers all 75 production routes and declares index, Pagefind, search-manifest, sitemap, RSS, content kind and taxonomy decisions. Final projection:

- 66 indexable/Pagefind routes and 9 explicit noindex routes;
- 66 search-manifest and sitemap members;
- 50 RSS members;
- four missing indexable materials added to search-manifest;
- 94 RSS metadata drifts normalized: 50 dates, 13 titles, 30 descriptions and one creator;
- no route-name special cases or mutable root HTML as indexability authority.

Strict production-like CI blocks missing/extra policy, unknown enums, taxonomy gaps, robots/Pagefind drift, membership drift and noindex/personal leakage. RSS mutations cover link/GUID parity, duplicates, dates, registry membership and noindex exclusion.

Evidence on exact head `360b1db2`:

- Search Manifest Policy `30040920405` — success;
- Shared Files Guard `30040920404` — success;
- Visual Parity `30040920503` — success;
- Route Registry Validators `30040920865` — success, including production build, SEO, strict Search & Index policy, public-surface browser matrix, route semantics and Nagornaya UI.

## Matrix transition

- closed rows 135 → 138;
- P3 section 55 → 52;
- statistical P3 58 → 55;
- total open rows 200 → 197.

`AUDIT-PRO-ROOT-ONLY` remains open only for still-root-specific or duplicated `audit-pro.js` publication/cache-bust/general checks. Sitemap (#163), SEO (#165), static HTML breadth (#167), and search/index/RSS membership (#166) are now registry-backed.

## Concurrent boundaries

PR #161 must preserve the removed Baptist research href; PR #156 and Research PR #7 / AuditRepo PR #27 remain Gill lanes. AuditRepo PR #27 files are not touched by this reconciliation.
