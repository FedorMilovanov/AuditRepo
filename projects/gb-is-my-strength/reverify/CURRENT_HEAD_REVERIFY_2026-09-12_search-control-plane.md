# Current-head reverify — search control plane — 2026-09-12

## Classification

- Root: `GBS-SEARCH-CONTROL-PLANE-001`
- Class: owner/control-plane decision, not a current page-code defect.
- Product tracking: `gb-is-my-strength#1996`.
- Product `main` observed during final consolidation: `12ea413a3cde15a4f90f381655da6e0fd9f0015d`.

## Current evidence

At the audited boundary:

- live `robots.txt` advertised `https://gospod-bog.ru/sitemap.xml` and `https://gospod-bog.ru/sitemap-pastor-series.xml`;
- the working URL-prefix Search Console property `https://gospod-bog.ru/` returned zero explicitly submitted sitemaps;
- full URL Inspection coverage of the 92-URL primary sitemap produced 36 indexed, 51 `URL is unknown to Google`, and 5 `Crawled - currently not indexed`;
- all five crawled-not-indexed pages were separately checked live and had terminal 200 responses, self-canonicals, index/follow robots and substantial rendered content;
- self-managed IndexNow was proven on a real production deployment;
- `sc-domain:gospod-bog.ru` returned Search Console 403 under the connected account;
- DNS inspection showed Cloudflare authoritative nameservers and no Google ownership TXT at the apex.

## Root-cause boundary

The current mandatory action is external Search Console/DNS ownership and sitemap submission. Current evidence does not justify bulk content rewrites for the 51 unknown URLs or the five crawled-not-indexed URLs.

## Closure boundary

1. Explicitly submit and verify processing of the production sitemap(s) in the readable URL-prefix property.
2. Either verify the domain property with the exact Google DNS TXT at Cloudflare or explicitly retire/ignore that inaccessible property.
3. After Google recrawl, rerun URL Inspection and compare the same corpus.
4. Promote any remaining page-specific defect only if fresh evidence establishes a concrete page-level mechanism.

Until these are satisfied, the root remains an owner decision in MASTER.
