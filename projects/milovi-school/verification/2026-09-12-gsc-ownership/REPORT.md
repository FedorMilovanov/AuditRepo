# Milovi School — Search Console ownership verification — 2026-09-12

## Exact anchors

- Product `main`: `aa82176012b93a50ccfcfb90293d496618e50b61`
- Production: `https://french.milovicake.ru/`
- Product tracking issue: `Milovi_School#32`

## Live site evidence

- production root is reachable and indexable;
- `robots.txt` points at `https://french.milovicake.ru/sitemap-index.xml`;
- Astro sitemap index and child sitemap are live;
- `google7e02f9855e02b89a.html` is committed and served live with the expected verification token;
- DNS for `french.milovicake.ru` CNAMEs to `fedormilovanov.github.io` and resolves to GitHub Pages.

These observations do not support a current source-code, robots, sitemap, canonical or hosting defect.

## Control-plane evidence

- GSC Wizard lists the French URL-prefix property but Search Console reads return `403 insufficient permission`.
- An independent Windsor Search Console connection does not expose the French property.
- A non-destructive Search Console `sites.add` for `https://french.milovicake.ru/` succeeded under the currently connected primary Google account; subsequent reads still returned 403.
- Apex `milovicake.ru` had no TXT records at the audited boundary, so there is no domain-property DNS verification covering the subdomain.
- The same HTML token is also present on the working `milovicake.ru` property, making a missing-file failure unlikely.

## Root cause boundary

The remaining problem is ownership verification / account authority. Repository code must not be edited speculatively while the current live verification surface is healthy.

## Closure proof required

1. Complete ownership verification for the intended connected Google account.
2. Re-read the property successfully through Search Console API.
3. Confirm/submit `sitemap-index.xml`.
4. Run URL Inspection across the current sitemap corpus and store the baseline.

Until those steps succeed, `MS-GSC-OWNERSHIP-001` remains the single active owner-decision row.
