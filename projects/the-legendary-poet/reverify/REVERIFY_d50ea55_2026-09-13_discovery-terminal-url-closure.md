# Reverify — TLP-DISCOVERY-001 terminal URL closure — 2026-09-13

## Scope

Terminal closure of the post-#494 GitHub Pages URL-parity residual.

- Product PR: #507 `fix(discovery): align canonical URLs with terminal Pages routes`.
- Exact certified head: `b7d179f31304f41df05c98c93e01ae78851f10fd`.
- Resulting Product main: `d50ea5588b0c2de4cbb7071ba3a9c4fd23e11d34`.
- Tested/resulting tree: `867565ba01d6cac20c3dd742e3a3bbd7fd81d2c8` (identical).

## Contradictory witness that reopened the root

Before #507, live GitHub Pages terminalized deep documents to trailing-slash URLs while advertised canonical/OG URLs and generated discovery artifacts still used no-slash SPA router paths. Representative live examples included `/privacy -> /privacy/`, `/articles -> /articles/`, and `/poets/alexander-pushkin -> /poets/alexander-pushkin/`.

Search Console independently confirmed the transport authority: settled GSC page keys were already the trailing-slash URLs. The pre-fix live sitemap used no-slash paths, so the exact sitemap-to-GSC performance join matched only 1 of 31 URLs.

## Product repair

#507 introduced one terminal public-route URL authority while keeping internal logical router paths unchanged. The authority is consumed by:

- runtime canonical and `og:url`;
- JSON-LD WebPage/breadcrumb/person identifiers;
- prerendered metadata;
- sitemap and discovery-manifest canonical URLs/fingerprints;
- Atom feed entry links;
- materialized legacy-alias targets;
- route/discovery/browser validators.

## Exact-head certification

All relevant #507 exact-head workflows completed success, including:

- CI `34747534628`;
- Project contracts `34747534638`;
- Content model `34747534672`;
- Site route integrity `34747534679`;
- Manual Browser QA `34747534680`;
- Brand deep reference/motion `34747534645`;
- Hall web runtime `34747534666`;
- Articles acceptance `34747534652`;
- Merge certification `34747534643`.

## Resulting-main and live production proof

Resulting `main@d50ea55` completed:

- CI `34760299984`: success;
- Hall web runtime `34760299957`: success;
- Content model `34760299952`: success;
- Brand raster `34760299950`: success;
- Project contracts `34760299945`: success;
- Brand deep `34760299928`: success;
- Articles acceptance `34760299926`: success;
- Site route integrity `34760299920`: success;
- GitHub Pages `34760299947`: success;
- Manual Browser QA `34760300012`: success, including fresh-process iPhone Safari;
- Notify IndexNow `34760510959`: success.

Fresh post-deploy production evidence:

- no-slash requests still settle on the real Pages terminal slash URL;
- `/privacy/` and `/poets/alexander-pushkin/` advertise the exact same trailing-slash canonical and `og:url`;
- raw production JSON-LD identifiers use the trailing-slash page URL and fragment IDs derived from it;
- live sitemap contains 31 URLs and now uses terminal slash paths for deep routes, with the old no-slash Pushkin/privacy locs absent;
- live Atom feed deep links use terminal slash URLs;
- legacy `/articles/article-1/` resolves to the terminal `/poets/alexander-pushkin/` target;
- the same GSC sitemap-performance join improved from 1/31 pre-fix exact matches to 9/31 after deploy — all 9 sitemap URLs that already have settled Search Console impressions now match their GSC page keys.

URL Inspection separately reports the terminal root/Pushkin/privacy URLs as submitted/indexed, mobile-crawled, fetch-successful and indexing-allowed.

## Disposition

`TLP-DISCOVERY-001` is retired again, this time on terminal transport/discovery parity rather than artifact self-consistency.

Matrix movement: P1 stays 1, P2 `2 -> 1`, P3 stays 0, total active `3 -> 2`.

Independent boundaries preserved: `TLP-COMM-ABUSE-001` and `TLP-ANALYTICS-PROPERTY-001`.
