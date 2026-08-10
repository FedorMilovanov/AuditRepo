# Terminal verification — full-site Site Sections Menu ownership

Date: 2026-08-10
Disposition: `CLOSED-BY-SYSTEM-FIX / absorbed V11-LEGACY-MOBILE-NAV-STATE`

## Scope

This closure covers the bottom-left/site hamburger contract at the shared owner level rather than one Gill route. It absorbs the prior current `V11-LEGACY-MOBILE-NAV-STATE` manifestations and the newly reproduced series-reader owner vacuum / historical Menu→Search semantic drift.

## Product terminal state

- Product PR: `FedorMilovanov/gb-is-my-strength#1558` — `fix(site-menu): unify full-site menu ownership`.
- Merged to `main`: `e13e49c63857a823383ba864553cf815cc527c1e`.
- Merge predecessor on Product main: `5329e31b713257e0678914d1f4c1827bf2511327`.
- Final PR head before squash merge: `226ccda6c19833a85bd29eaaea4537b89b547c9e`.
- Fully browser-proven content-equivalent head: `8d8dbc1bacf89bfa76732f2ecee495d859589a9f`.

The final PR head and the fully proven head compare with no net file differences. The intervening branch commits were control-plane refresh/cleanup history only. The merge `5329e31b... -> e13e49c6...` adds exactly the site-menu repair/guard file set; the two Product-main commits that landed after the original proof were non-overlapping Krajne-schema and MapEngine-Intro work.

## Root causes closed

### 1. Behavior ownership split

The shared DOM/ARIA relation could exist while no visual interaction owner existed:

- modern SeriesReaderChrome/Gill-family readers intentionally removed legacy `site.js` interaction ownership;
- `reader-controls-a11y.js` still refused to bind the site menu on `.gbs-world` / `[data-gbs2-series]`, assuming legacy `site.js` remained the owner;
- therefore the hamburger could be rendered with correct-looking `aria-controls` / `aria-expanded=false` yet have no opener lifecycle at all.

History also confirms the semantic drift the owner remembered: one prior Hermenevtika phase wired the same hamburger to Search (`data-fc-action="search"`) rather than the site-sections menu.

### 2. Legacy lifecycle split

The prior Wave 11 legacy owner opened `.h-mobile-nav.open` but did not participate coherently in the shared overlay authority:

- `SiteUtils` emergency scroll-lock reconciliation did not recognize the disclosure for its full lifetime;
- after the ~3 s emergency cycle the menu could remain visually open while page scroll unlocked;
- Escape/close did not deterministically restore opener focus;
- mobile primary navigation had no truthful no-JS fallback on the verified legacy landing family.

### 3. Presentation ownership split

The first real screenshot pass during #1558 exposed an additional independent class defect: rich menu styling lived under a historical Gill-specific selector. A standalone ReaderRail could therefore open the correct menu semantically while rendering an unbounded/broken card with escaped SVG geometry. Presentation had to move into the shared menu primitive as well; behavior-only repair was not terminal.

## Canonical repair

Product now has one shared contract:

- `SiteSectionsMenuRuntime.astro` is the single `#hMobileMenuBtn -> #hMobileNav` visual/lifecycle owner;
- it delegates stack, focus trapping, Escape, focus restoration and scroll locking to the existing `OverlayRuntime`;
- `reader-controls-a11y.js` retains semantic control→surface relations but no longer owns site-menu opening/closing;
- legacy `site.js` skips its old binding only when the canonical runtime marker is present, preventing double binding while preserving genuinely unconverted surfaces;
- `SiteSectionsMenu.astro` owns canonical links plus rich/plain presentation and a truthful no-JS navigation fallback;
- Home keeps its richer shell while using the same canonical runtime owner;
- Search remains a separate action: hamburger activation must never open Search.

Current merged `main` directly contains `SiteSectionsMenuRuntime -> OverlayRuntime`, and current `reader-controls-a11y.js` no longer contains the former `bindNativeSiteSectionsMenu` visual owner.

## Permanent browser proof

Dedicated workflow: `Site Sections Menu Contract`.

Exact green proof before merge:

- run: `31424192324`;
- artifact: `9077022490`;
- exact proven branch head: `8d8dbc1bacf89bfa76732f2ecee495d859589a9f`;
- canonical menu route census: **57** registry-derived production routes;
- behavior/accessibility assertions: **1152/1152 PASS**;
- visual geometry assertions: **762/762 PASS**;
- engines: **Chromium + WebKit**;
- failures: **0**.

The contract proves class-level invariants rather than one screenshot:

- real pointer activation opens Menu, not Search;
- the active owner is the canonical Site Sections Menu runtime backed by OverlayRuntime;
- scroll lock remains intact beyond the prior 3.35 s emergency-cycle failure boundary;
- Escape closes, unlocks and restores opener focus;
- no-JS primary navigation remains available on independent representative families;
- menu/card/chevron/SVG geometry stays bounded in the viewport;
- screenshots are retained for Home, Articles, Biografii, Hard Texts, Pastor Series, Nagornaya Series, a standalone reader, Gill reader, an independent flat-series reader and a book-series reader.

The final pre-merge tree is content-equivalent to the exact green head, and merged-main source/diff integration was re-read after squash merge. The available connector does not enumerate push-triggered Actions runs by commit SHA, so no unobserved push-run status is asserted here.

## Terminal determination

`V11-LEGACY-MOBILE-NAV-STATE` no longer has an independent current repair unit. Its legacy lock/focus/no-JS manifestations and the series dead-menu / historical Menu→Search symptoms are all closed by the same shared owner plus permanent class-level guards.

Residual for this root: **NONE**.

Per AuditRepo operating model, the solved row must leave `MASTER_BUG_MATRIX.md`; provenance remains here, in Product PR #1558, its exact browser artifact, and Git history.
