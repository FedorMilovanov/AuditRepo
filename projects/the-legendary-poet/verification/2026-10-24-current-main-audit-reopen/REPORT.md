# The Legendary Poet — current-main audit reopen

Date: 2026-10-24  
Product repository: `FedorMilovanov/TheLegendaryPoet`  
Exact Product anchor: `26deca76d656025c04ae46d01c793971bd659103`  
AuditRepo base: `67b1cbcb684b39fcee9f06036747559c3dc4b37c`

## Disposition

**AUDIT-REOPENED-BY-OWNER / CURRENT-SOURCE-AND-BROWSER-PASS-1**

The owner explicitly selected a new broad audit. Product `main` has also materially changed since the last full-row AuditRepo authority: 39 commits and 119 files since `c7e3e3b…`. This satisfies the closeout reopen rules. Product was not mutated.

The current pass admits four P2 engineering roots and one P3 structural root. Together with the retained human-backed community P1, MASTER changes from **1** to **6** active units.

## Authority and collision check

Read before testing:

- Product `AGENTS.md`, `docs/CURRENT_STATE.md`, `docs/project-contract.json` and `PROJECT_CHARTER.md`;
- AuditRepo operating rules, TLP document map, current MASTER and the 2026-08-12 audit closeout;
- Product `docs/SESSION_AUDIT_PLAN_2026-10-13.md`, `docs/REVALIDATION_2026-10-22.md` and `docs/PR_517_MERGE_CHECKLIST.md`.

Current Product owners:

- #521 owns recovery of four damaged essay images plus an integrity guard. It is open, non-draft and mergeable; this audit does not create a competing media row or modify its scope.
- #514 owns only the two vulnerable `fflate` lockfile resolutions. It does not update current Vite or `source-map-js` advisories.
- issue #497 still owns the human Turnstile adversarial proof required by `TLP-COMM-ABUSE-001`.

No Product PR was merged, closed or edited.

## Clean baseline

At exact detached Product head:

- `npm ci`: PASS; 169 packages installed;
- `node scripts/validate-project-contracts.mjs`: PASS, 0 open architecture lanes;
- `npm run check`: PASS;
- `npm run build`: PASS, 2,798 modules transformed;
- `npm run prerender`: PASS, 32 canonical documents plus dedicated 404;
- build-output and SEO-output validators: PASS;
- production entry: 620.4 KiB / 649.4 KiB;
- total JavaScript: 1,692.4 KiB / 1,757.8 KiB;
- total CSS: 256.6 KiB / 293.0 KiB.

The green source gates are retained as a control, not treated as proof of full route accessibility.

## Browser census

Chromium `153.0.8010.0` loaded 34 current routes in two profiles:

1. 1440×900 Light, desktop;
2. 390×844 Dark, touch/mobile.

The route set contains all 31 sitemap URLs, `/hall/`, `/archive/` and a dedicated 404. Results over 68 loads:

- 68/68 completed without page exceptions;
- no unexpected HTTP error on a published route;
- no same-origin failed request;
- no horizontal page overflow;
- no duplicate IDs;
- exactly one `h1` per route;
- no focusable descendant under `aria-hidden`, `hidden` or `inert`;
- four transparent seek inputs remain intentionally focusable and have a separate focus-visible indicator;
- seven failed remote Wikimedia image observations are sandbox delivery evidence, not Product defects;
- no local broken-image claim is made; #521 already owns known damaged local files.

Axe WCAG A/AA found violations on 38/68 loads: 746 `color-contrast` nodes, 10 `label-content-name-mismatch` nodes and four `link-in-text-block` nodes. Incomplete results were retained separately and are not counted as passes or defects.

Screenshots of Pushkin Light desktop, Ratings Dark mobile and Home Dark mobile were visually inspected outside Git. Binary artifacts were not committed.

## P2 — `SYS-TLP-THEME-SEMANTIC-COVERAGE-RESIDUAL`

### Current evidence

The October reader repair made the ten Essay routes clean for fully painted axe contrast in the sampled contexts, but theme ownership is still incomplete elsewhere:

- ten poet-detail routes: **416** Light-desktop + **171** Dark-mobile failing nodes;
- Ratings: **56** Light-desktop + **63** Dark-mobile;
- Music family: 11 nodes;
- catalog/static routes: 29 nodes, including three on mobile Poets.

Representative measured pairs:

- Pushkin biography prose: `#6b7d80/#fffaf0`, **4.14:1**;
- testimony source links: `#e1c779/#f4ecdb`, **1.41:1** Light and **3.83:1** Dark;
- kindred-spirit badges: **1.04–1.34:1** Light;
- poet section headings: `#d4af37/#fffaf0`, **2.02:1**;
- Ratings mobile metric labels: `#415257/#050a0f`, **2.43:1**;
- Ratings mobile tag text: `#4c6065/#060d13`, **2.94:1**;
- Ratings Light controls on adapted surfaces: as low as **1.34–1.70:1**.

### Root and guard gap

The source already has semantic theme tokens, but poet-detail, Ratings, Music and static pages still write fixed Tailwind palette/alpha classes and inline colors. The global adapter cannot infer every intended foreground/surface pair. Existing `validate-theme-contract.ts` checks a selected component list by literal presence/exclusion; `qa/theme-contrast.spec.mjs` samples selected owners. Both pass while these current route families fail.

This is one incomplete semantic-theme migration, not 746 independent bugs. Closure requires owner-by-owner semantic token adoption and a route-family browser matrix, not a global contrast override or threshold reduction.

## P2 — `SYS-TLP-LABEL-IN-NAME-GUARD-COVERAGE`

Axe reports ten WCAG 2.5.3 failures in two shared owners:

- six Home portrait links at mobile width expose visible poet name/date text but replace it with `aria-label="Открыть страницу поэта …"`;
- `FeaturedTrackPlayer` exposes a visible percentage on `/music/` and all three track pages but replaces it with `aria-label="Настроить громкость"`.

The earlier Header repair proved why string-only name checks are insufficient, but current guards cover that Header control rather than the rule class. Closure must preserve the visible text inside the accessible name and verify actual link/volume behavior in desktop/mobile themes.

## P2 — `TLP-STATIC-PAGE-NESTED-MAIN-LANDMARKS`

`App.tsx` owns `main#main-content`, while both `EditorialPolicyPage.tsx` and `PrivacyPage.tsx` render another `<main>` inside it. Browser DOM therefore contains two main landmarks on each route. Full axe reports, on both pages:

- `landmark-main-is-top-level`;
- `landmark-no-duplicate-main`;
- `landmark-unique`.

Other routes use the shared App landmark correctly. The bounded repair is to make these page roots ordinary containers/sections while preserving the single shared skip-link target and route heading.

## P2 — `TLP-DEPENDENCY-ADVISORY-RESIDUAL`

Immutable `npm audit` on current lock state exits 1:

- production: one moderate `fflate` advisory;
- full tree: the same moderate plus two high package entries, `source-map-js` and direct Vite 7.3.6;
- Vite has a non-major fix at 7.3.7.

Open Product #514 updates only `fflate` 0.8.2→0.8.3 and nested 0.6.10→0.6.11. It is an adjacent owner, not evidence that the Vite/source-map residual is assigned or closed. Repair must be coordinated, exact-lockfile, and followed by full source/build/browser checks; no `npm audit fix --force` is authorized.

## P3 — `SYS-TLP-DOCUMENT-OUTLINE-OWNERSHIP`

Full axe best-practice analysis finds `heading-order` on 19 of 34 desktop routes:

- shared Footer `h4` creates jumps on seven ordinary/static routes plus Hall and 404;
- Poets and Articles cards begin at `h3` after their page `h1`;
- all ten poet-detail routes reach the shared Kindred Spirits `h3` before a level-two section in document order.

This is not filed as a WCAG conformance failure. It is a necessary structural improvement because shared reusable components currently derive heading level from visual styling rather than document context. Closure requires a monotonic route outline without changing appearance or inventing hidden headings.

## Boundaries and negative evidence

- The community P1 is unchanged; automation must not bypass Turnstile.
- #521 media recovery remains the sole current media owner.
- Four `link-in-text-block` axe findings on policy-page links are distinguishability best-practice signals; current source has color-only inline links and they remain inside the theme residual until direct interaction/paint evidence justifies a separate row.
- Sub-24px citation links are inline citations inside prose and qualify for the inline-target exception; raw rectangle counts were not promoted.
- Transparent audio seek inputs are not hidden-controls defects: they overlay the painted track and source provides a separate focus indicator.
- No live production, native Safari, assistive-technology or field-performance claim is made in this pass.
- Product source, dependencies and workflows were not modified.

## Result

MASTER now contains **6 active units = 1 P1 + 4 P2 + 1 P3**. This is the first current-main checkpoint, not audit completion. Subsequent passes should test modal/focus lifecycles, audio state, community degradation, route/data parity, CSS ownership and false-green mutation controls before selecting Product repair.
