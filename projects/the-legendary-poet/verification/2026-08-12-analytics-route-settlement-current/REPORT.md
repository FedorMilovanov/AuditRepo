# Analytics route settlement — current audit

Date: 2026-08-12  
Product: `FedorMilovanov/TheLegendaryPoet`  
Audited source: `main@d59cceccb0c49af59b1be38d4c547a6240b3005a`  
Scope: SPA route lifecycle, lazy/Suspense settlement, SEO title timing and analytics page-view metadata.

## Current-source / collision check

The Product source anchor remains `main@d59cceccb0c49af59b1be38d4c547a6240b3005a`. A targeted open Product issue/PR search for analytics route/title/page-view settlement found no matching repair owner.

## Result

One new independent current P3 root is confirmed:

- `TLP-ANALYTICS-ROUTE-001` — page-view analytics is owned by URL change rather than settled route content, so a lazy SPA navigation can send the new page URL with the previous page title.

The current evidence also strengthens `TLP-AUDIT-004`: no permanent test was found that delays a route chunk/data boundary and proves analytics metadata is emitted only after the destination SEO title has settled.

---

## Finding A — `TLP-ANALYTICS-ROUTE-001`

Severity: **P3**  
Status: **CONFIRMED-CURRENT / ANALYTICS-DATA-QUALITY / ROUTE-LIFECYCLE**

### Current lifecycle

`RoutedApp` renders `AnalyticsRouteTracker` as a sibling before the application route tree. The route tree owns its own lazy pages through `Suspense` and `RouteLoadingShell`.

On `location.pathname` / `location.search` change, `AnalyticsRouteTracker` runs an effect immediately for the new URL and schedules:

`trackPageView(pagePath, document.title)`

through `window.setTimeout(..., 0)`.

The destination page's title is not owned by that tracker. It is set later by the destination component's `useSeo()` effect after that lazy page has actually resolved and committed.

`RouteContent` already has the correct concept of route settlement for accessibility: `RouteSettled` lives inside Suspense and invokes its callback only after the destination content is mounted. Analytics does not reuse that settlement boundary.

### Deterministic failure mode

A delayed lazy route makes the mismatch explicit:

1. reader is on page A; `document.title` is A;
2. SPA navigation changes location to B;
3. B's route module/data is not yet ready, so `RouteLoadingShell` renders;
4. `AnalyticsRouteTracker` effect already observes path B and schedules a page view;
5. B's `useSeo()` has not mounted, so `document.title` is still A;
6. analytics sends `page_path/page_location = B` with `page_title = A`.

The exact timing can vary when a module is already warm, but the architecture has no ordering guarantee that destination SEO settlement precedes analytics emission. A deliberately delayed chunk/data boundary reproduces the wrong ownership deterministically.

### Provider impact is source-proven

`trackPageView(path, title)` forwards the supplied title to both currently supported providers:

- Yandex Metrika: `ym(id, 'hit', url, { title, ... })`;
- Google Analytics: `gtag('event', 'page_view', { page_title: title, page_location: url, page_path: path })`.

The resulting analytics dataset can therefore contain a correct destination URL associated with the previous document's title.

This finding is deliberately separate from `TLP-ANALYTICS-CONSENT-001`:

- consent root: who may start/continue analytics and how grant/deny converges;
- route root: when a permitted page-view event is semantically ready and which title belongs to it.

One can be fixed while the other remains wrong.

### Why P3

The defect corrupts measurement metadata rather than blocking the reader experience or exposing protected data. It can distort page-title reports and content attribution, but the destination URL/path remains correct. P3 is therefore the smallest honest severity.

### Required terminal outcome

1. Make analytics page-view emission depend on a settled destination route, not location change alone.
2. Reuse or expose the existing route-settlement lifecycle rather than adding another arbitrary timeout.
3. Capture title/SEO metadata after the destination `useSeo()` ownership has committed.
4. Guarantee one page-view emission per intended navigation after settlement, including lazy cold routes and same-path query changes where analytics should count a new view.
5. Do not emit a destination page view if the route resolves into ErrorBoundary before a valid destination page has settled; define an explicit error-view policy instead.
6. Add an instrumented browser regression:
   - start on A and record title A;
   - delay B's lazy module or destination payload;
   - navigate SPA to B;
   - prove no B page-view fires while loading shell is active;
   - release B;
   - prove exactly one page-view fires with path/title B.

---

## Audit-harness addition — `TLP-AUDIT-004`

Current source search found no test that observes `trackPageView`/provider calls under a deliberately delayed destination route.

A correct permanent witness should test lifecycle semantics, not a timeout duration. The assertion is `destination page view happens after destination title ownership`, regardless of whether B takes 1 ms or 2 seconds to settle.

## Checked distinction

The accessibility route announcement does **not** share this bug. `RouteSettled` is inside Suspense and defers its callback until destination content commits; its announcement then reads `document.title`. That is a useful reference for the analytics repair rather than another broken consumer.

## Audit disposition

After this wave the active matrix should contain **16 rows total: 1 P1 + 14 P2 + 1 P3**.

- add `TLP-ANALYTICS-ROUTE-001` as one P3 analytics-data-quality root;
- expand `TLP-AUDIT-004` with the delayed-route analytics witness;
- no Product implementation lane is created;
- Product source remains unchanged by this AuditRepo push.
