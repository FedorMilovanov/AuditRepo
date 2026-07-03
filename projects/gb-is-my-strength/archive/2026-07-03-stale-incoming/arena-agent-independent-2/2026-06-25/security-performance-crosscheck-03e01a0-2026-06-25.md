# Cross-check: Security / Performance / Data Integrity analysis — `03e01a0`

## Meta
- Agent: `arena-agent-independent-2`
- Date: 2026-06-25
- Source HEAD: `03e01a0008de34d654175ea600cdf9f22b2351b4`
- Target report: `incoming/arena-agent-6/2026-06-25/SECURITY_PERFORMANCE_ANALYSIS.md`
- Evidence: `evidence/security-performance-crosscheck-03e01a0.txt`

## 1. Feed.xml: weekdays fixed, timezone issue still partially open

The report says feed.xml weekdays are not regenerated and recommends `update-meta.js --all`. On current HEAD this is stale for weekdays:

```text
wrong weekday count: 0
```

However, timezone suffixes show that the timezone-label issue is not fully closed:

```text
timezone suffix counts: {'+0000': 17, '+0300': 1}
first pubDates:
<pubDate>Tue, 02 Jun 2026 00:00:00 +0000</pubDate>
<pubDate>Mon, 01 Jun 2026 10:00:00 +0000</pubDate>
<pubDate>Mon, 01 Jun 2026 09:00:00 +0000</pubDate>
```

Recommended canonical status:

- V2-4 “wrong weekday” = `fixed-current`.
- P2-6 “UTC vs Moscow timezone” = still open/partial if the site requires RSS pubDates to use `+0300` consistently. It is no longer a weekday mismatch, but the feed still mostly emits `+0000`.

## 2. Karty subroutes missing from sitemap/search are intentional while they are noindex holding pages

The report says 8 karty routes are missing from sitemap/search-manifest and recommends adding them. Current production-like dist says these are temporary placeholders:

```text
/karty/early-church/ sitemap=False search=False noindex=True ignore=True
/karty/maccabim/     sitemap=False search=False noindex=True ignore=True
...
```

Recommended status: do **not** add these 8 holding pages to sitemap/search while they are `noindex` + `data-pagefind-ignore`. The real issue is the matrix/governance drift documented separately in my `karty-holding-matrix-drift` report.

## 3. `site-layered.css` is not loaded, but exists in dist and is precached

Current facts:

```text
dist html links site-layered: 0
sw precache site-layered root+dist: 2
dist/css/site-layered.css exists (282846 bytes)
```

So the performance point is valid as a precache/dead-weight issue, not as a SW install failure. Because the file exists in dist, this does not break SW install; it wastes bytes/cache space.

Recommended severity: P2/P3 performance cleanup, not P0.

## 4. “Dead/orphaned scripts” list is too broad and dangerous as a deletion plan

Several scripts called dead/orphaned are still referenced by package scripts and current validation chains:

```text
about-visual-parity-audit              about:visual-parity:audit
article-mdx-pilot-audit                astro:audit:article-mdx, astro:audit:article-mdx:no-build, astro:audit:article-mdx:strict
articles-visual-parity-audit           articles:visual-parity:audit
baptisty-rossii-visual-parity-audit     baptisty-rossii:visual-parity:audit
baptisty-series-shadow-audit            astro:audit:baptisty-series, astro:audit:baptisty-series:no-build
catalogs-visual-parity-audit            catalogs:visual-parity:audit
check-route-migration-matrix            migration:matrix:check
extract-url-contract                    contract:extract, contract:extract:root, contract:extract:dist
legacy-shadow-wrapper-audit             astro:audit:legacy-wrappers, astro:audit:legacy-wrappers:no-build
```

Some scripts still mention `_legacy` because they assert that legacy/shadow markers are absent. That is not proof they are dead. Deleting them blindly would remove current guard coverage.

Recommended action: before deleting any script, check `package.json`, `validate:static-publication`, workflow references, and the script’s current pass/fail behavior. Only `extract-native-pilot` appears to have no package script reference in this quick scan.

## 5. CSP / search innerHTML notes

I did not convert the CSP and `search.js innerHTML` observations into confirmed bugs in this pass. They should remain as security-hardening review items unless a concrete user-controlled unescaped path is demonstrated. The project intentionally uses inline scripts for early theme/SITE_CONFIG/Yandex snippets; moving to nonces/external scripts is an architectural hardening lane, not an immediate defect by itself.

## Summary recommendations

| Claim from target report | Recommended status |
|---|---|
| feed weekdays still wrong | stale; weekdays fixed |
| feed timezone +0000 vs +0300 | still partial/open if +0300 is required |
| add 8 karty holding routes to sitemap/search | reject while noindex/pagefind-ignore |
| site-layered.css dead/precache | confirmed as performance cleanup, not install-breaker |
| delete 10 “orphaned” scripts | reject as written; many are package-script guards |
| CSP unsafe-inline / search innerHTML | security-hardening review, needs concrete exploit path for bug status |
