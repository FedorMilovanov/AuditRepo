# Current Verification — SEO error-state and hydration parity

Date: 2026-08-12

## Scope and source authority

Read-only audit of `FedorMilovanov/TheLegendaryPoet` at exact `main@d59cceccb0c49af59b1be38d4c547a6240b3005a`.

Product mutation: **none**.

This wave does not create a new Product root. All confirmed findings are manifestations of existing **`TLP-DISCOVERY-001`**: static prerender, hydrated runtime and failure-state metadata do not share one route metadata authority.

## 1. CONFIRMED — static 404 intentionally has no canonical, hydrated 404 recreates one

### Static artifact contract

`prerender-og.mjs::writeNotFound()` produces `dist/404.html` with:

- dedicated 404 title and description;
- `robots=noindex,follow` and matching googlebot;
- **canonical removed**;
- `og:url` removed.

`validate-seo-output.mjs` explicitly enforces:

```js
expect(!notFoundHtml.includes('rel="canonical"'),
  '404.html must not canonicalize errors to the homepage');
```

So the project’s own static SEO contract clearly treats the 404 document as a no-canonical error response.

### Hydrated runtime contract

`NotFoundPage` calls:

```ts
useSeo({
  title: 'Страница не найдена — THE LEGENDARY POET',
  description: 'Запрошенная страница не существует или была перемещена.',
  path: location.pathname,
  robots: 'noindex,follow',
});
```

`useSeo` unconditionally executes:

```ts
ensureLink('canonical', `${siteConfig.url}${path}`);
ensureMeta('og:url', url, 'property');
```

Therefore after JavaScript hydrates/renders the wildcard route, an arbitrary missing path such as `/does-not-exist` receives a self-canonical and `og:url`, although the first static 404 response deliberately omitted those fields.

The same error representation has two incompatible machine contracts depending on whether the observer sees pre-hydration HTML or hydrated DOM.

### Disposition

Absorb into **`TLP-DISCOVERY-001`**.

Terminal metadata authority must explicitly model `not-found` rather than expressing it as an ordinary WebPage with only a `robots` override. Direct/static and hydrated DOM should agree on canonical/OG URL policy.

## 2. CONFIRMED — route render failures can leave previous-route head under a new URL

`RouteContent` changes route content below a page-scoped `ErrorBoundary` and Suspense boundary.

`useSeo` is effect-driven and owns head mutation only from successful page components. It has no unmount cleanup that resets title/canonical/route JSON-LD to a neutral/loading/error state.

The `ErrorBoundary` fallback itself does not call any SEO/head owner.

A deterministic lifecycle therefore exists:

1. route A has successfully run `useSeo`, so document head contains A title/canonical/route JSON-LD;
2. user navigates to route B and browser URL becomes B;
3. B throws during render/lazy route content before its `useSeo` effect commits;
4. page-level ErrorBoundary renders the B error fallback;
5. the document head can still contain A metadata because no error-state owner replaced it.

This can make visible URL/body and machine metadata describe different routes.

The same underlying timing also explains why `TLP-ANALYTICS-ROUTE-001` can capture an old title for a new path, but analytics transport remains a separate P3 data-quality root. The head ownership itself belongs to discovery/SEO authority.

### Error copy boundary

The current ErrorBoundary copy is honest about a rendering failure and preserving shell/audio state; this report does not challenge that user-facing body behavior. The defect is absence of matching head/error metadata lifecycle.

## 3. Static SEO validator is necessary but insufficient

`validate-seo-output.mjs` correctly checks:

- sitemap canonical consistency;
- noindex exclusion for sitemap routes;
- structured data presence in prerendered public documents;
- dedicated noindex 404 title;
- absence of canonical from static `404.html`.

It does not execute/hydrate the app and therefore cannot detect:

- 404 canonical reintroduction after runtime `useSeo`;
- SPA navigation head parity;
- route-render-error head inheritance;
- stale route JSON-LD on error/loading states.

This is another concrete false-green manifestation for existing **`TLP-AUDIT-004`**.

## 4. Required terminal outcome under `TLP-DISCOVERY-001`

One route metadata state machine should cover at least:

- ready canonical page;
- ready noindex utility page;
- not-found;
- loading/suspended navigation;
- route render/error fallback;
- redirect/legacy alias where applicable.

Static prerender and hydrated runtime must derive the same canonical/robots/OG/schema decisions from that authority.

Required browser regression classes:

1. direct missing path: capture first `404.html` head and hydrated head; canonical/robots/OG policy must stay equivalent;
2. SPA A → missing path: no A canonical/title/route schema remains after NotFound settles;
3. SPA A → injected route render failure B: URL/body/error head all describe B/error state, never A;
4. recovery/reload to valid B: final head becomes B exactly once without stale error metadata.

## Root-cause consolidation

| Finding | Disposition |
|---|---|
| Static 404 removes canonical, hydrated NotFound recreates self-canonical | existing `TLP-DISCOVERY-001` |
| Static 404 removes `og:url`, runtime recreates it | same discovery root |
| Route ErrorBoundary has no head owner | same discovery root |
| Previous route metadata can remain on route error | same discovery root |
| Static SEO validator cannot detect hydration/error parity | strengthen `TLP-AUDIT-004` |
| Analytics can send old title under new path | existing `TLP-ANALYTICS-ROUTE-001`, not duplicated |

## Checkpoint

- Product source: unchanged.
- Source anchor: `d59cceccb0c49af59b1be38d4c547a6240b3005a`.
- New roots: 0.
- Existing roots strengthened: `TLP-DISCOVERY-001`, `TLP-AUDIT-004`.
