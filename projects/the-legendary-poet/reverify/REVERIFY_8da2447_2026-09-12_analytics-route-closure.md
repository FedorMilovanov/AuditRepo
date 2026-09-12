# Reverify — TLP analytics semantic-route closure — 2026-09-12

## Scope

Bounded closure verification for `TLP-ANALYTICS-ROUTE-001` only.

No reclassification of the independent GA4 property authority, consent lifecycle, discovery, systemic accessibility, audit-harness or community-production roots is claimed here.

## Product repair

Product PR: `FedorMilovanov/TheLegendaryPoet#501` — `fix(analytics): bind page views to settled semantic routes`.

Base: `aa665c011dade44ebdfd7af5d3eaae30d3315aef`.

Exact certified head: `7907c184b28e2b8168596e8aec10a0967277551d`.

CAS squash/resulting `main`: `8da2447bb5b46f10c92aef2f51e593157e8e096c`.

Tested tree: `9df5ad59413acdc1fccf937b06c96d9d093d4c8f`.

Resulting tree: `9df5ad59413acdc1fccf937b06c96d9d093d4c8f`.

The tested and resulting trees are identical.

## Root cause and repair

The previous route tracker treated `location.search` as page-view authority and emitted through a sibling effect plus `setTimeout(0)`. That allowed same-route query/filter edits to become page views and did not bind emission to lazy-route settlement or page-owned semantic metadata.

The repair:

- defines one typed `tlp:analytics-route-settled` authority event;
- emits it from the existing lazy route-settlement boundary after page effects have run;
- removes query-string mutation from semantic page-view identity;
- deduplicates repeated settlement by semantic navigation token;
- preserves explicit consent gating and provider initialisation;
- adds a production-build browser contour with a QA-only GA Measurement ID that inspects real `dataLayer` page-view events.

## Exact-head outcome proof

At exact head `7907c184b28e2b8168596e8aec10a0967277551d`:

- CI run `34700183757`: success;
- Project Contracts `34700183776`: success;
- Content Model Contract `34700183772`: success;
- Site Route Integrity `34700183761`: success;
- Brand Deep `34700183764`: success;
- Brand Raster `34700183793`: success;
- Articles Catalog Acceptance `34700183753`: success;
- Merge Certification `34700183763`: success;
- Manual Browser QA `34700183750`: success;
- dedicated `analytics-route-qa` job: success.

The analytics browser outcome proves:

1. initial `/ratings` emits one page view;
2. typing `?q=...` emits no additional page view;
3. changing same-route sort/filter state emits no additional page view;
4. semantic navigation to `/about?from=...` emits exactly one new page view;
5. emitted `page_path` is `/about`, not the query-bearing URL state;
6. emitted `page_title` equals the settled `document.title`.

The general Manual Browser contour also passed Chromium/Android and fresh-process iPhone Safari coverage.

## Resulting-main proof

Push workflows for resulting `main@8da2447bb5b46f10c92aef2f51e593157e8e096c` all completed success:

- CI `34701246818`;
- Project Contracts `34701246819`;
- Articles Catalog Acceptance `34701246820`;
- Manual Browser QA `34701246821`;
- Site Route Integrity `34701246822`;
- Brand Raster QA `34701246823`;
- Content Model Contract `34701246825`;
- Brand Deep Reference and Motion Audit `34701246829`;
- Deploy to GitHub Pages `34701246830`;
- Notify IndexNow `34701395444`.

## Disposition

`TLP-ANALYTICS-ROUTE-001` is closed-by-fix and leaves the active engineering matrix.

Independent rows remain independent:

- `TLP-ANALYTICS-PROPERTY-001` still owns the external GA4 property/web-stream authority question;
- `TLP-ANALYTICS-CONSENT-001` still owns cross-tab consent, revoke/enable semantics and reopenable control;
- `TLP-DISCOVERY-001`, `TLP-A11Y-RUNTIME-001`, `TLP-AUDIT-004` and `TLP-COMM-ABUSE-001` are unchanged by this bounded closure.

Matrix arithmetic: P1 stays 1, P2 stays 5, P3 `1 → 0`, total active `7 → 6`.
