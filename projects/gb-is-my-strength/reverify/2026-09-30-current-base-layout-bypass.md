# Current-head keyboard bypass reverify — 2026-09-30

- Product repository: `FedorMilovanov/gb-is-my-strength`
- Product source `HEAD`: `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`
- Live release/control-plane SHA: `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b` (identity only; no live-host browser session was run)
- Browser: Chromium `153.0.8010.0`, Playwright
- Browser target: freshly served local production-like `dist` built from the exact SHA above
- Evidence: [`evidence/2026-09-30-bypass-blocks-reverify.json`](evidence/2026-09-30-bypass-blocks-reverify.json)
- Product code changed: **no**
- GitHub issue created: **no**

## Disposition

Admit one keyboard-access defect as `GBS-BASELAYOUT-MISSING-SKIP-LINK` for `/hard-texts/genesis-6/` and `/izbrannoe/`. This is a browser-confirmed omission, not a finding inferred only from source. At this Product SHA, source-reference and built-output inventory found exactly two active production-like documents using the `BaseLayout` shell; both were browser-tested at desktop and mobile sizes. `ArticleLayout.astro` and `SeriesArticleLayout.astro` still import `BaseLayout`, but no page-level callers or corresponding built `astro-shell` outputs were found, so they are treated as dormant wrappers, not additional live routes.

## Browser observations

| Route | Viewports | Bypass link / target | Keyboard evidence |
|---|---|---|---|
| `/hard-texts/genesis-6/` | `1280×900`, `390×844` | No skip/bypass anchor; `<main class="genesis6-hub-main">` has no `id` | At desktop, the first eight Tab stops remain within the repeated site header. At mobile, the route likewise has no skip link; the later offscreen mobile-chrome stops belong to the separate existing `GBS-MOBILE-CHROME-HIDDEN-FOCUSABLE-BEFORE-SCROLL` finding. |
| `/izbrannoe/` | `1280×900`, `390×844` | No skip/bypass anchor; `<main class="izbrannoe-main">` has no `id` | At desktop, the first eight Tab stops remain within the repeated site header. The visible “Перейти к статьям” CTA is a cross-page link to `/articles/`, not a same-page bypass to the main content. |
| `/about/` (positive control) | `1280×900`, `390×844` | “Перейти к содержимому” → `#main-content`; target is `main#main-content` | Sequential Tab reaches the link first; after the CSS transition it is visible at `y=20` with a focus indicator. Enter sets `#main-content`; the next Tab reaches an element in the main content. |
| `/articles/` (positive control, separate page chrome) | `1280×900`, `390×844` | “Перейти к содержимому” → `#main-content`; target is `main#main-content` | Same successful sequential focus, visible focus state, Enter/hash navigation, and next-Tab entry into the page content. |

In both deficient routes the native `main` landmark exists. The bounded finding is specifically that keyboard users have no sequential skip/bypass link for the repeated header; it does not claim that screen-reader landmark navigation is absent.

## Reconciliation with implementation and existing findings

Both negative routes import `BaseLayout`. The inspected layout renders the shared `<Header>` and then a generic `<main class={mainClass}>`; it does not supply a bypass link or a default main target ID. Source search found only these two active page-level imports. `ArticleLayout.astro` and `SeriesArticleLayout.astro` import `BaseLayout` but have no current page-level callers; build inventory found exactly two `astro-shell` HTML outputs, both the affected routes. `AboutPageChrome` and `ArticlesPageChrome` are separate chrome implementations and provide positive controls. This source/build inventory explains the difference but does not substitute for browser proof.

The mobile hidden-chrome finding remains independent: it concerns translated-offscreen controls remaining focusable, not the absence of a page-level bypass. The new row does not expand the route count for that pre-existing finding.

The Abraham map was also used as a nearby control. Its skip link is under the intentional map-intro focus scope before the intro is dismissed; after Enter activates “Начать изучение”, the link is reached sequentially, reveals visibly, Enter sets `#stage` and the next Tab enters the map. That flow is excluded from this missing-link finding. The Russian Baptist map’s link similarly activated `#appframe` and the next Tab entered the iframe.

## Scope and closure boundary

The defect is admitted only for `/hard-texts/genesis-6/` and `/izbrannoe/`, at desktop and mobile sizes. A repair may be shared by `BaseLayout` or supplied by an equivalent page-level mechanism. Resulting-main proof should show, for both routes, a visible-on-focus bypass reachable before the repeated header, a valid main-content target, native activation, and a subsequent Tab into content. At this SHA the resulting-main browser proof must cover both currently emitted `BaseLayout` routes; re-enumerate the build outputs at repair time in case consumers have changed. Preserve the working About/Articles and map-specific skip links. Do not conflate this work with mobile-chrome focus stops.

## Limits

All browser observations here are local exact-SHA runs, not live-host browser testing. The live SHA is recorded only as deployment identity. No Product source or GitHub issue was changed. Issue #437 was not touched.
