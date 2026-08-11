# Current Verification — analytics query/pageview semantics

Date: 2026-08-12

## Scope and source authority

Read-only audit of `FedorMilovanov/TheLegendaryPoet` at exact `main@d59cceccb0c49af59b1be38d4c547a6240b3005a`.

Product mutation: **none**.

This wave does not create another analytics ID. The confirmed mechanism is a second manifestation of existing **`TLP-ANALYTICS-ROUTE-001`**: page-view emission does not have a semantic route-settlement/navigation authority.

## 1. CONFIRMED — every query-string change is classified as a page view

`AnalyticsRouteTracker` subscribes through React to both:

```ts
location.pathname
location.search
```

Its effect builds:

```ts
const pagePath = `${location.pathname}${location.search}`;
```

and calls `trackPageView(pagePath, document.title)` whenever either dependency changes after consent is granted.

There is no event classification layer distinguishing:

- a real page/route navigation;
- a shareable filter state;
- a transient search keystroke;
- a sort toggle;
- a checkbox/filter control change.

All become the same analytics `page_view` shape.

## 2. `/ratings` serializes search/filter state on every state change

`RatingsPage` stores `query`, `tag`, `sortBy` and `ratedOnly` in local state, then an effect runs whenever any changes and calls:

```ts
setSearchParams(next, { replace: true })
```

The search input updates `query` on each `onChange` keystroke.

Therefore typing a term such as `Есенин` can produce successive URL states such as:

- `?q=Е`
- `?q=Ес`
- `?q=Есе`
- ...
- `?q=Есенин`

The use of `replace:true` correctly avoids history-stack pollution, but it does **not** avoid location/search updates or analytics effects.

Sort/tag/rated-only changes similarly mutate the query string and are classified as page views.

This is independent of `TLP-RATING-URLSTATE-001`: that root concerns whether URL and UI controls have one bidirectional state authority. Even after fixing URL ownership, analytics must still decide what counts as a page view.

## 3. Music archive has the same analytics behavior despite deferred filtering

`MusicArchiveBrowser` correctly derives its UI state directly from `searchParams` and uses `replace:true` in `updateParam`.

It also uses `useDeferredValue(query)`, but only for the expensive/filtering result path.

The actual input handler still calls:

```ts
updateParam('q', event.target.value.slice(0, 120))
```

on every keystroke, so the browser URL/search changes immediately. The analytics tracker therefore sees every character even though the visible filtering computation is deferred.

This confirms a cross-page analytics class rather than a Ratings-only implementation accident.

## 4. User/data impact

When analytics is configured and consent is granted, the current event model can inflate navigation/page-view counts with interaction states that are not new documents/pages.

Consequences include:

- page-view totals depend on how many characters a reader types;
- a search refinement can look like a sequence of page navigations;
- sort/filter usage changes page-view counts rather than being represented as interaction/search/filter events;
- path/title reports contain many query variants of the same settled route;
- analytics comparisons across pages with different filter UI become structurally biased.

This report does not claim a specific current production count because GA/Yandex configuration and collected datasets are deployment/external state.

## 5. Root-cause relationship

Existing `TLP-ANALYTICS-ROUTE-001` already proves that page views fire from raw URL lifecycle before destination SEO settles.

This wave adds a second mechanism under the same owner:

**raw location mutation is treated as page-view truth, regardless of whether it represents route navigation or transient UI state.**

A repair should solve both rather than adding ad-hoc debounce only to one search input.

## 6. Required terminal outcome under `TLP-ANALYTICS-ROUTE-001`

Define an explicit analytics navigation/event contract:

- pathname/destination route settlement owns page-view emission;
- same-route query state is classified intentionally, not automatically;
- meaningful shareable query-state transitions may use a dedicated filter/search event if desired;
- free-text search should not emit one page view per character;
- analytics title must come from the settled destination metadata owner;
- direct loads with query parameters still produce one truthful initial page view for the loaded route/state;
- Back/Forward behavior is defined explicitly and tested.

Do not solve this by removing shareable URL filters: the URL-state feature is useful and should remain independently testable.

## 7. Audit-harness impact

Strengthen **`TLP-AUDIT-004`** with an instrumented analytics transport fixture:

1. grant consent in a test build with fake analytics transport;
2. direct-load `/ratings` and assert one initial page view;
3. type a multi-character query and assert no per-keystroke page-view series;
4. change tag/sort/rated controls and verify the selected event model (no page view unless explicitly designed as one);
5. navigate to a new pathname and assert exactly one settled destination page view with the destination title;
6. repeat on Music archive to prevent a one-page-only repair.

The test must inspect actual emitted analytics calls, not merely URL/history behavior.

## Root-cause consolidation

| Finding | Disposition |
|---|---|
| tracker effect depends on pathname + search | existing `TLP-ANALYTICS-ROUTE-001` |
| Ratings typing changes `location.search` per character | same analytics root |
| Music archive typing changes `location.search` per character | same analytics root |
| `replace:true` prevents history pollution | correct behavior; does not prevent analytics churn |
| `useDeferredValue` defers filtering but not URL/analytics | same analytics root |
| Ratings URL not bidirectionally authoritative | separate existing `TLP-RATING-URLSTATE-001` |
| missing emitted-event regression | strengthen `TLP-AUDIT-004` |

## Checkpoint

- Product source: unchanged.
- Source anchor: `d59cceccb0c49af59b1be38d4c547a6240b3005a`.
- New roots: **0**.
- Existing roots strengthened: `TLP-ANALYTICS-ROUTE-001`, `TLP-AUDIT-004`.
