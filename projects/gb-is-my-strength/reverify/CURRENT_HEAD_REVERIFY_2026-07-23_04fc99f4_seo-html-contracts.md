# CURRENT HEAD REVERIFY — `04fc99f4` — SEO and HTML contracts

Date: 2026-07-23

## Boundary

- Current source `main`: `04fc99f4a7925f28577f3b0a6654d3b1aa4af9ba`.
- Last exact deployed source: `8a5352671375fdb01b6c30273c25ec4283a13f69`.
- Production witness retained: readiness `30006414898`, Pages `30007024100`, live sitemap 66 URLs, SHA-256 `5f3fa280af1ddc73f166decce47535d48ec60718375dd7c0418ea3675f82a801`.

This is source/CI evidence, not a claim that `04fc99f4` is already deployed.

## PR #165 — `SEO-AUDIT-ROOT-ONLY`

Merge `3baf6a3fb2ba0c25b60ee3da831e49dc7857aca6`; tested head `391da97c075f537d0005fff2a55857c24aaac48c`.

Production SEO now derives from the effective route registry and built `dist`: 75 production routes, 66 indexable, 9 explicit noindex, exact canonical/robots policy, blocking missing HTML and Astro-only mutations. The first witness fixed 22 missing heart-series `twitter:image` tags and `/rodosloviye/` creator metadata.

Evidence: Shared Guard `30011357937`, Route Registry `30011358428`, Native Source `30011358017`, Visual Parity `30011358388`, Overlay Browser `30011358482` — all success.

## PR #167 — validate breadth

Merge/current source `04fc99f4a7925f28577f3b0a6654d3b1aa4af9ba`; tested head `4b213aeca0ee988f7f79e1797deb231cb0a43360`.

A dependency-free production HTML contract now checks all 75 registry routes after build. Blocking scope: HTML presence, title, canonical, non-special H1, duplicate non-SVG IDs, image alt, local media/srcset targets, same-origin links, inline JavaScript syntax and JSON-LD parsing. Permanent mutations cover every failure class.

Initial baseline: three `/izbrannoe/` JavaScript-template false positives were fixed by separating structural markup scans from dedicated script/JSON-LD parsing; one real `/baptisty-rossii/` link to an unpublished local research file was removed while preserving its visible wording.

Final report: 75 routes, 0 errors, 34 warnings — 19 title/OG drifts, 10 Baptist modified-time gaps, 5 Nagornaya byline-marker gaps.

Evidence: Shared Guard `30040050196`, Native Source `30040050142`, artifact `8576994409`, Visual Parity `30040050138` — all success.

This closes `VALIDATE-SCOPE-GAP` and `VALIDATE-JS-ARTICLES-ONLY`.

## Matrix transition

- closed rows 135 → 138;
- P3 section 55 → 52;
- statistical P3 58 → 55;
- total open rows 200 → 197.

`AUDIT-PRO-ROOT-ONLY` remains open only for still-root-specific or duplicated `audit-pro.js` publication/cache-bust/general checks. Sitemap breadth (#163), SEO breadth (#165), and static HTML/link/alt/JSON-LD/H1 breadth (#167) are already covered.

## Concurrent boundaries

PR #166 must rebase onto `04fc99f4`; PR #161 must preserve the removed Baptist research href; PR #156 and Research PR #7 / AuditRepo PR #27 remain Gill lanes. AuditRepo PR #27 files are not touched here.
