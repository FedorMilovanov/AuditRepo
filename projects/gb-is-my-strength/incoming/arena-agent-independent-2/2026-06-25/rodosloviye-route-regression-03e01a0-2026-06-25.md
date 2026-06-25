# New finding: `/rodosloviye/` is published as an “interactive genealogy” route but renders a static self-link stub

## Meta
- Agent: `arena-agent-independent-2`
- Date: 2026-06-25
- Source HEAD: `03e01a0008de34d654175ea600cdf9f22b2351b4`
- Evidence: `evidence/rodosloviye-route-regression-03e01a0.txt`
- Method: source scan + production-like dist + Playwright route observation

## AAI2-NEW-3 — `/rodosloviye/` production route has no genealogy app/island

- Severity: P1/P2 route regression (depending on whether `/rodosloviye/` is intended public now; metadata says `production-dist`)
- Route: `/rodosloviye/`
- Source files:
  - `src/pages/rodosloviye/index.astro`
  - `src/components/rodosloviye/RodosloviyeBody.astro`
  - `src/components/rodosloviye/RodosloviyeStyles.astro`
  - `src/components/genealogy/GenealogyTree.tsx` exists but is unused by the route

## Evidence

The route profile says this is a production genealogy route:

```json
{
  "route": "/rodosloviye/",
  "routeType": "genealogy",
  "currentStatus": "production-dist",
  "source": "src/pages/rodosloviye/index.astro",
  "migrationMode": "legacy-shadow-app"
}
```

The page source comment also promises an interactive React family tree:

```astro
/**
 * /rodosloviye/ — strict-native route ...
 * Interactive React family tree.
 * ... Uses site.css + React island internally ...
 */
```

But the route imports only page head, styles, and static body:

```astro
import RodosloviyePageHead from '@/components/rodosloviye/RodosloviyePageHead.astro';
import RodosloviyeStyles from '@/components/rodosloviye/RodosloviyeStyles.astro';
import RodosloviyeBody from '@/components/rodosloviye/RodosloviyeBody.astro';
```

The real React genealogy components exist:

```text
src/components/genealogy/GenealogyTree.tsx
src/components/genealogy/DetailPanel.tsx
src/components/genealogy/PersonNode.tsx
...
```

But `src/pages/rodosloviye` / `src/components/rodosloviye` do not reference `GenealogyTree`, `client:*`, or any app mount.

Playwright observation on production-like `dist/rodosloviye/`:

```json
{
  "title": "Родословие от Адама до Христа | Господь Бог — Сила Моя",
  "h1": "Родословие от Адама до Христа",
  "links": [
    { "text": "Открыть родословие", "href": "/rodosloviye/" },
    { "text": "К разделу карт и инструментов", "href": "/karty/" }
  ],
  "scriptSrcs": [
    "/js/glossary.js?v=1",
    "/js/site.js?v=133dfac1",
    "/js/search.js?v=c9d65577",
    "/js/sw-register.js?v=318502c5"
  ],
  "canvas": 0,
  "appMountCandidates": []
}
```

The primary CTA `Открыть родословие` links to the same URL (`/rodosloviye/`), so it does not open a hidden app or alternate route.

## Impact

A public route advertised in SEO/search metadata as an “interactive genealogy tree” renders only a static explanatory placeholder. Users and crawlers see a promise of an interactive genealogy section, but there is no actual tree, no React island, no data-driven app mount, and no alternate target behind the CTA.

## Recommended status

`confirmed-production-like-dist` after a second witness, suggested severity P1/P2.

If the route is intentionally a holding/static page, then metadata and copy should be changed to stop promising an interactive tree and the route status should not be `production-dist` for a React genealogy app. If it is intended to be live, wire `GenealogyTree` as a React island with the genealogy data and a no-JS fallback.

## AAI2-NEW-4 — `/rodosloviye/` core CSS links are unversioned in production-like dist

- Severity: P2 cache/SW styling drift
- Route: `/rodosloviye/`
- Source file: `src/components/rodosloviye/RodosloviyeStyles.astro`

`RodosloviyeStyles.astro` hardcodes unversioned core stylesheets:

```astro
<link rel="stylesheet" href="/fonts/fonts.css">
<link rel="stylesheet" href="/css/site.css">
<link rel="stylesheet" href="/css/command-palette.css">
<link rel="stylesheet" href="/css/mobile-hotfix.css">
```

Production-like `dist/rodosloviye/index.html` preserves them unversioned:

```text
/fonts/fonts.css
/css/site.css
/css/command-palette.css
/css/mobile-hotfix.css
```

This bypasses both normal root `cache-bust.js` and `astro-cache-bust-postbuild.js`, because postbuild only rewrites URLs that already contain `?v=<8hex>`. On a SW-enabled site with cache-first static assets, `/rodosloviye/` can keep stale CSS after CSS changes even while most other pages have `?v=` hashes.

Related observation: `RodosloviyeBody.astro` source still hardcodes `sw-register.js?v=8a077d35`, but production-like dist rewrites that JS hash correctly to `318502c5`; the CSS links are the remaining unversioned gap.

## Suggested fix

Use the same asset hash helper / scriptTag-style pattern used elsewhere, or at least put current `?v=` hashes in `RodosloviyeStyles.astro` so `astro-cache-bust-postbuild.js` can maintain them.

## Notes

This finding is distinct from the already-known `BaseLayout` CSS asymmetry. `/rodosloviye/` does not use `BaseLayout`; it has its own `RodosloviyeStyles.astro`, so it needs a route-specific fix or a shared asset-link helper.
