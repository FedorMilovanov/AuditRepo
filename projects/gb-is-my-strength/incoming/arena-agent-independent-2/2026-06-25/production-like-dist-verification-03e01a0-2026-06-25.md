# Production-like dist verification — `03e01a0` — hash/SW/remaining findings

## Meta
- Agent: `arena-agent-independent-2`
- Date: 2026-06-25
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Source HEAD: `03e01a0008de34d654175ea600cdf9f22b2351b4`
- Verification mode: build/artifact witness + source witness reconciliation
- Evidence: `evidence/production-like-dist-03e01a0.txt`

## Commands run

```bash
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm ci
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run strangler:build:production-like
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run pagefind:build:dist
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run sw:dist:audit:deploy-switch
```

## 1. Important correction to my previous P0-10 interpretation

My previous reverify found stale hashes in `src/**/*.astro`; that source fact is still true. However, the production-like build now has an explicit post-build repair step:

```text
astro-cache-bust-postbuild.js
HTML files scanned: 56
Files touched:      35
Hash replacements:  512
✅ dist/ hash drift → 0
```

Artifact witness after `strangler:build:production-like`:

```text
sw-register.js?v=8a077d35                          0
sw-register.js?v=318502c5                          38
floating-cluster-controller.js?v=efd81d3a          0
floating-cluster-controller.js?v=58c2ea90          15
```

### Recommended canonical status

Do **not** describe P0-10 as an active production artifact hash bug on `03e01a0` if the deploy path is `strangler:build:production-like`.

More precise status:

- `P0-10`: **production-like dist fixed / source-layer stale literals still present**.
- The source still contains stale hardcoded hashes because `cache-bust.js` skips `src`, but `scripts/astro-cache-bust-postbuild.js` rewrites `dist/**/*.html` after Astro build and copy-legacy.
- Remaining risk is tooling fragility: any non-standard build path that omits `astro-cache-bust-postbuild.js` can reintroduce stale hashes. A CI guard should assert dist hash drift = 0 and/or source literal drift is allowed only when postbuild is guaranteed.

This supersedes the stronger wording in my previous `reverify-current-head-03e01a0` note where I suggested `P0-10` should be reopened. The better conclusion after artifact witness is **closed for production-like dist, still technical debt in source**.

## 2. P0-NEW / SW precache missing assets appears fixed in production-like dist

The verified ledger had a P0-NEW claim that `/css/site-layered.css` and `/js/site-modules.js` are in SW precache but absent from `dist/`.

Current artifact witness:

```text
-rw-r--r-- dist/css/site-layered.css
-rw-r--r-- dist/js/site-modules.js

SW precache entries:
1 /css/site-layered.css
1 /js/site-modules.js
```

After `pagefind:build:dist`, the official SW readiness audit passes:

```text
✅ PRECACHE_ASSETS entries resolve in dist (pagefind required)
✅ SW dist readiness audit passed
```

### Recommended canonical status

- `P0-NEW`: **fixed-current / not reproducible on production-like dist `03e01a0`**.
- If older reports found it before the latest source updates, keep historical note, but do not leave it as current repair-ready P0.

## 3. Round 6 NEW-1 remains present in production-like dist

`SeriesArticleLayout.astro` source still has `alt=""` at 3 locations, and production-like dist still contains silent Baptisty thumbnails.

Artifact count:

```text
Dist baptisty alt empty count: 11
```

This is a production artifact witness for the accessibility/content-discoverability issue. The count is lower than raw source expectations because the minified/current page output and route mix change exact occurrences, but the defect is visible in generated HTML.

Recommended status: `confirmed-current` / `confirmed-production-like-dist`.

## 4. Round 6 NEW-2 remains present in production-like dist

`dist/sitemap.xml` still has the same metadata gaps:

```text
https://gospod-bog.ru/karty/ MISSING lastmod,changefreq,priority
https://gospod-bog.ru/nagornaya/chast-1/ MISSING changefreq,priority
https://gospod-bog.ru/nagornaya/chast-2/ MISSING changefreq,priority
https://gospod-bog.ru/nagornaya/chast-3/ MISSING changefreq,priority
https://gospod-bog.ru/nagornaya/chast-4/ MISSING changefreq,priority
https://gospod-bog.ru/nagornaya/chast-5/ MISSING changefreq,priority
```

Recommended status: `confirmed-production-like-dist`, severity P2 unless project policy promotes Yandex sitemap priority to P1.

## 5. Suggested ledger changes

1. Move `P0-NEW` to `fixed-current` on `03e01a0` with artifact witness.
2. Refine `P0-10` from “active production bug” to “production-like dist fixed by postbuild; source-layer stale literals remain and need guard/refactor.”
3. Promote `AAI2-NEW-1` and `AAI2-NEW-2` because they now have both source and production-like dist witnesses.
4. Keep `AAI2 challenge to Round 6 NEW-3`: hard-text GBS rail missing is false/stale on current source.

## 6. Repair guidance

- For `AAI2-NEW-1`: small accessibility lane in `SeriesArticleLayout.astro`.
- For `AAI2-NEW-2`: sitemap normalization lane in `scripts/update-meta.js`/sitemap generator, plus a guard checking tag completeness.
- For hash system: do not do another one-off hash sweep; either keep postbuild mandatory and guarded, or replace hardcoded source literals with shared hash helper.
