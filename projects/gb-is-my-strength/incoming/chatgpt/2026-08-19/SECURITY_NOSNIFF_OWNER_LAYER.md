# SECURITY-NOSNIFF-OWNER-LAYER-MISMATCH

## Meta

- Project: `gb-is-my-strength`
- Date: 2026-08-19
- Product anchor: `bcb41e57d7f9c011ac597c51a240fba19152a908`
- Signal class: security architecture / audit semantic boundary
- Proof state: **confirmed owner-layer defect; live header presence intentionally unproven**
- Product mutation: none
- MASTER mutation: none

## Claim

The current source/security model repeatedly treats

```html
<meta http-equiv="X-Content-Type-Options" content="nosniff">
```

as though it were a document-level equivalent of the HTTP `X-Content-Type-Options: nosniff` response header. It is not.

This means a security closure criterion phrased as a unified HTML `<head>` owner that “emits CSP + X-Content-Type-Options” is semantically wrong even if the deployed host independently supplies the real response header.

This report does **not** claim that `gospod-bog.ru` currently lacks `X-Content-Type-Options` on its network responses. That requires a live response-header witness, which was not available in the local sandbox.

## Standards boundary

The WHATWG HTML Standard defines `meta[http-equiv]` as an enumerated pragma mechanism and explicitly warns that pragma directives are largely unrelated to HTTP headers. The standardized states include `content-type`, `default-style`, `refresh`, `x-ua-compatible`, and `content-security-policy`. `X-Content-Type-Options` is not a supported pragma state; an unknown/unsupported pragma has no `nosniff` processing model.

The WHATWG Fetch Standard defines `X-Content-Type-Options` as a **response header**. `nosniff` is determined by reading `X-Content-Type-Options` from the response's header list.

Therefore the two mechanisms have different semantic owners:

```text
CSP on static document
→ may have an HTML meta pragma representation (with CSP-meta limitations)

X-Content-Type-Options
→ network/HTTP response header authority
→ not an HTML-head pragma authority
```

## Current Product evidence

A deterministic source scan of the supplied current-equivalent tree finds **62 `src/` files / 62 instances** of `X-Content-Type-Options`, all as HTML `<meta http-equiv=... content="nosniff">` declarations.

Representative current source:

```html
<meta http-equiv="Content-Security-Policy" content="...">
<ReaderPreferencesHead />
<meta http-equiv="X-Content-Type-Options" content="nosniff">
```

in `src/components/pastor-series/PastorSeriesPageHead.astro` at Product `bcb41e57...`.

The postbuild security writer `scripts/astro-cache-bust-postbuild.js` owns only CSP meta discovery/hardening/injection through `DEFAULT_DIST_CSP`, `cspMetaTag()` and `hardenCsp()`. It does not turn the `X-Content-Type-Options` metas into HTTP response headers.

A repository search finds one explicit actual response-header owner in the inspected source: `src/pages/js/atlas-runtime.js.ts` returns:

```js
headers: {
  'Content-Type': 'text/javascript; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
}
```

That example further demonstrates the layer distinction: an endpoint response can own the real header; a static HTML meta node cannot.

## Audit/model impact

The existing security-system direction in AuditRepo groups CSP and `X-Content-Type-Options` under a proposed unified HTML-head owner. That is a bad closure abstraction:

1. CSP and `nosniff` do not share the same enforcement carrier.
2. A source scan proving 62 `nosniff` meta tags proves neither header coverage nor header absence.
3. A browser DOM/meta witness cannot establish transport-header coverage.
4. A future “all heads unified” PASS could therefore false-green the actual HTTP security property.

This is an audit/control semantic defect even if GitHub Pages or another edge layer already sends `X-Content-Type-Options: nosniff` correctly.

## Correct verification boundary

A verifier should split the class into two owners:

### Document-policy owner

- CSP source/derived policy;
- source → dist parity;
- CSP meta limitations explicitly modeled;
- one canonical CSP generation path where possible.

### Transport/hosting owner

- actual response headers measured from deployed HTML and relevant executable/style assets;
- `X-Content-Type-Options: nosniff` checked from response headers, not DOM;
- hosting/platform behavior recorded as external evidence with a freshness boundary;
- route-specific dynamic/prerendered response owners checked separately where they can set headers themselves.

## Required next witness before Product severity is assigned

Measure live response headers for representative classes at the current deployed release:

- `/`;
- one native Astro article;
- one Baptist/Nagornaya page currently carrying the inert meta;
- `/js/atlas-runtime.js`;
- representative JS and CSS static assets.

Possible outcomes:

- **real header present everywhere required** → Product security coverage may be fine; classify 62 metas as inert/redundant source debt and repair the AuditRepo closure model;
- **header missing on some required responses** → promote a real transport-header coverage defect owned by hosting/deployment, not by page heads;
- **mixed platform behavior** → system root is transport-policy ownership/coverage, again not an HTML-head cleanup problem.

## Negative findings

- No current live vulnerability claim is made.
- No assumption is made that GitHub Pages does or does not supply the header for this custom domain.
- No recommendation is made to remove the metas before the real transport owner is measured.
- The existing CSP finding is not invalidated; only the attempted coupling of CSP and `X-Content-Type-Options` into one head-level enforcement owner is challenged.

## Proposed disposition

Treat `SECURITY-NOSNIFF-OWNER-LAYER-MISMATCH` as a **verified audit/system-model defect with pending live transport witness**, adjacent to `FRAGMENTED-SECURITY-OWNERSHIP`. Do not create a page-by-page Product fix. First establish the actual network-header authority, then either retire the inert metas as cleanup or repair transport coverage at the hosting/response layer.