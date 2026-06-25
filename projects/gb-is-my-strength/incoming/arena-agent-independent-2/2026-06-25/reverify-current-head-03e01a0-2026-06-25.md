# Reverify after source repo advanced to `03e01a0` — cache/hash regression still current

## Meta
- Agent: `arena-agent-independent-2`
- Date: 2026-06-25
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Current HEAD checked: `03e01a0008de34d654175ea600cdf9f22b2351b4`
- Evidence: `evidence/current-head-03e01a0-cache-regression.txt`
- Mode: post-push current-head reverify + continued search

## 1. Reverify result — P0-10 class is still current in Astro source

After pulling the source repo from `8f2b29e8` to `03e01a0`, the public/root HTML files are partly cache-busted, but the Astro production source still contains stale query hashes for at least two JS assets:

| Asset | Actual md5short | Stale hash still in `src/**/*.astro` | Count |
|---|---:|---:|---:|
| `js/sw-register.js` | `318502c5` | `8a077d35` | 24 files |
| `js/floating-cluster-controller.js` | `58c2ea90` | `efd81d3a` | 14 files |

This is not a theoretical scan of old root HTML: `cache-bust.js` explicitly skips `src`, so production Astro builds can keep stale asset versions even after root HTML was updated.

Mechanism witness:

```text
scripts/cache-bust.js:67-70
const SKIP_DIRS = new Set([
  'node_modules', 'dist', 'out', 'build', 'coverage', 'reports', 'audit',
  '_build-tools', 'src', 'scripts', 'docs', 'migration'
]);
```

Current-head evidence summary:

```text
js/sw-register.js 318502c5
js/floating-cluster-controller.js 58c2ea90
public sw-register old count: 0
src sw-register old count: 24
src fc-controller old count: 14
```

Affected source files include:

- `src/components/about/AboutPageChrome.astro`
- `src/components/article-pilots/krajne/KrajneBody.astro`
- `src/components/article-pilots/rimlyanam7/Rimlyanam7Body.astro`
- all/most `src/components/baptisty-rossii/*Body.astro`
- `src/components/home/HomePageChrome.astro`
- `src/components/nagornaya/*PageFooter.astro`
- `src/components/pastor-series/PastorSeriesPageChrome.astro`
- Gill/Kod/Hermenevtika pilot components for `floating-cluster-controller.js`

## 2. Recommended status change

The verified ledger currently contains several conflicting statements: P0-10 was recorded as fixed in some later sections, but the current source witness above shows the root class remains active for at least two assets.

Recommended canonical wording:

- `P0-10`: **REOPEN / partially fixed only**.
- Public/root HTML hash updates landed, but Astro source hash synchronization remains incomplete because `src` is intentionally skipped by `cache-bust.js`.
- Do not mark repair-ready as closed until a guard checks `src/**/*.astro` hardcoded `?v=` values against actual md5short values or the project replaces hardcoded asset tags with a shared hash helper.

## 3. Existing Round 6 findings still current on `03e01a0`

The two source findings from my previous report remain current after the pull:

### AAI2-NEW-1 still current

`src/layouts/SeriesArticleLayout.astro` still has three `alt=""` cover thumbnails:

```text
118, 152, 289
```

### AAI2-NEW-2 still current

`sitemap.xml` still has missing tags:

```text
https://gospod-bog.ru/karty/ MISSING lastmod,changefreq,priority
https://gospod-bog.ru/nagornaya/chast-1/ MISSING changefreq,priority
https://gospod-bog.ru/nagornaya/chast-2/ MISSING changefreq,priority
https://gospod-bog.ru/nagornaya/chast-3/ MISSING changefreq,priority
https://gospod-bog.ru/nagornaya/chast-4/ MISSING changefreq,priority
https://gospod-bog.ru/nagornaya/chast-5/ MISSING changefreq,priority
```

## 4. Suggested repair direction

For P0-10 class, avoid one-off replacing two hashes. The actual root cause is automation scope:

1. Add a hash helper used by Astro components, or
2. Extend cache-bust/hash verification to scan `src/**/*.astro`, and
3. Add a CI guard that computes md5short for all assets and fails when a hardcoded `?v=` in source is stale.

This should be treated as a system/root-cause repair lane, not a content lane.
