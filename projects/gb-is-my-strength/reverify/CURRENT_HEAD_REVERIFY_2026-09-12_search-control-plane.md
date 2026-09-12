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

## Same-day control-plane refresh

A second independent read later on 2026-09-12 sharpened the external boundary without changing its classification:

- the readable URL-prefix property `https://gospod-bog.ru/` remains healthy and returns 90-day Search Console performance through settled date 2026-09-09: **5 clicks / 232 impressions / 2.16% CTR / average position 6.66**;
- Search Console `list_sitemaps` still returns **zero submitted sitemaps** for that URL-prefix property;
- the GSC Wizard Indexing Tracker now records **92 tracked URLs: 36 indexed, 56 not indexed, 0 errors, 0 warnings**, last checked at `2026-09-12T09:44:41.611Z`;
- direct sitemap-performance analysis of the live primary sitemap sees **92 URLs**, of which **21 received Search Console impressions** in the 2026-06-01 → 2026-09-09 window; the separate pastor-series sitemap contains 3 URLs, one with impressions;
- the live `robots.txt` still advertises both `https://gospod-bog.ru/sitemap.xml` and `https://gospod-bog.ru/sitemap-pastor-series.xml`, and both production files are reachable;
- `sc-domain:gospod-bog.ru` still fails with Search Console **403 insufficient permission** under the connected Google authorization;
- Bing Webmaster is connected for the URL-prefix property, but currently reports **0 traffic rows, 0 crawl-stat rows, 0 crawl issues and 0 submitted feeds**; URL-submission quota is available (**100 daily / 1900 monthly**), so this is not an API-key or quota failure;
- GSC Wizard's own site metadata was updated to mirror the two production sitemap URLs for audit/reporting purposes. This **does not submit them to Google**: the authoritative Search Console sitemap list remains empty after that metadata update;
- GSC Wizard's IndexNow setting for this property remains unset. That does not invalidate the separately proven self-managed Product IndexNow path and is not a reason to create a second IndexNow authority inside a trial-only aggregator.

This refresh strengthens the same root cause: discovery/control-plane registration is incomplete while the production sitemap/robots surface itself is present. It does **not** justify rewriting the 56 currently-not-indexed pages as a bulk content remedy.

## Root-cause boundary

The current mandatory action is external Search Console/DNS ownership and sitemap submission. Current evidence does not justify bulk content rewrites for the 51 unknown URLs or the five crawled-not-indexed URLs.

## Closure boundary

1. Explicitly submit and verify processing of the production sitemap(s) in the readable URL-prefix property.
2. Either verify the domain property with the exact Google DNS TXT at Cloudflare or explicitly retire/ignore that inaccessible property.
3. After Google recrawl, rerun URL Inspection and compare the same corpus.
4. Promote any remaining page-specific defect only if fresh evidence establishes a concrete page-level mechanism.

Until these are satisfied, the root remains an owner decision in MASTER.
