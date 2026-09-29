# Current-head reverify — nested-path 404 reader-preference assets (2026-09-29)

## Disposition

**Confirmed current, directly reproducible on the live deployment; admit one direct defect.** The 404 document references its reader-preference bootstrap, CSS and runtime with path-relative URLs. When GitHub Pages serves that document for a missing URL below a nested directory, the browser resolves those references below that same directory instead of at the site root. The expected assets are absent there, so those requests return the site's 404 document.

Product code was not changed.

## Identity and overlap check

- Product `main` HEAD and `git ls-remote origin refs/heads/main`: `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`.
- Live release/control-plane identity on 2026-09-29 was already confirmed as the same SHA.
- Live nested path `/articles/kod-da-vinchi/nope/deeper/` returns the 404 page while retaining that requested URL.
- Open PRs #2142–#2145 do not change `404.html` or reader-preference assets. Open issue search for `404.html`, `reader-preferences`, and not-found assets returned no matches.

## Current source witness

Root `404.html` and the production-like `dist/404.html` both contain, near their head:

- `<script src="js/reader-preferences-head.js?...">`
- `<link rel="stylesheet" href="css/reader-preferences.css?...">`
- `<script defer src="js/reader-preferences.js?...">`

There is no `<base href="/">` in the document. These are the only three asset references in the document that are not rooted at `/`; the page's other scripts, stylesheets, images, and its recovery links use root-relative URLs. The generated `dist/404.html` matches the source paths. The source for preference tokens/first-paint state is `js/reader-preferences-head.js`; `css/reader-preferences.css` includes the global stored-Sepia theme rules; and `js/reader-preferences.js` owns the canonical preferences API and update behavior.

## Live witness

Using the live site fetch on 2026-09-29:

1. `https://gospod-bog.ru/articles/kod-da-vinchi/nope/deeper/` returned the 404 page at that nested URL.
2. Each corresponding URL formed by resolving the relative 404 assets below that path returned the 404 page content:
   - `/articles/kod-da-vinchi/nope/deeper/js/reader-preferences-head.js?...`
   - `/articles/kod-da-vinchi/nope/deeper/css/reader-preferences.css?...`
   - `/articles/kod-da-vinchi/nope/deeper/js/reader-preferences.js?...`
3. The three root assets exist in the site at `/js/reader-preferences-head.js`, `/css/reader-preferences.css`, and `/js/reader-preferences.js`.

The fetch tool does not expose HTTP status or content-type headers, so this report claims the live 404 response body at those asset URLs, not a measured browser console/MIME error. The browser's URL resolution follows directly from the current relative references and the retained nested document URL. The archived Playwright intake also exercised `/articles/nope/` and a deeper nested 404 under the same Product SHA and reported the three asset requests failing there: `../incoming/arena-agent-visual-playwright/2026-09-23/REPORT.md` (A11Y-07).

## Fresh exact-SHA browser reverify (2026-09-29)

Playwright Chromium `153.0.8010.0` tested the local production-like `dist` from the exact Product SHA. A small Pages-style server returned `dist/404.html` with a 404 status for missing paths and, for missing asset requests, served that same HTML body with its actual `text/html` MIME. This is an explicit local routing emulation, not a live-host browser run.

- For a root-level missing URL `/missing-page.html`, the page retained its 404 status and all three relative references resolved at the origin root. In separate contexts with stored Light, Dark and Sepia preferences, the bootstrap loaded, `data-reader-theme` matched the stored value, all three root assets returned 200 with the expected MIME, and the preference stylesheet exposed 15 CSS rules. The body computed to the corresponding light/dark/sepia surface.
- For nested 404s at `/articles/kod-da-vinchi/nope/deeper/` and `/articles/nope/`, all three references resolved under the retained nested path; every request returned 404 with `text/html` and the 404 document body. With stored Sepia, `data-reader-theme` and `__GB_READER_PREFS_BOOTSTRAP__` remained unset, and the linked preference stylesheet had zero parsed rules.

The machine-readable record is `evidence/2026-09-29-404-reader-preferences-browser-reverify.json`. The live fetch evidence above remains separate: the fetch tool does not expose response headers, while this new local reproduction does record status and MIME under the explicitly described Pages-style server emulation.

## User impact and scope

The nested not-found page still renders its inline recovery content, but its reader-preference bootstrap, stylesheet and runtime fail to load. In particular, a stored canonical preference such as Sepia cannot be bootstrapped/styled on this page; this is limited to 404 responses reached under nested paths. At `/404.html` or root-level not-found paths, the relative URLs resolve to site-root assets and do not exhibit this path-depth failure. No broader sitewide asset-path defect is inferred.

## Closure boundary

Root the three URLs (or set a valid root `<base>` without changing canonical/link behavior). On resulting Product `main`, verify a root 404 and at least two nested-path 404s, ensure all three correct assets load from the origin root, confirm stored Light/Dark/Sepia bootstrap and appearance, and check recovery links/canonical behavior remain correct.

Admitted matrix ID: `GBS-404-RELATIVE-READER-PREFERENCES-ASSETS`.
