# The Legendary Poet — current-main audit reopen

Date: 2026-10-24  
Product repository: `FedorMilovanov/TheLegendaryPoet`  
Exact Product anchor: `93e8731cc04d12a8fe985604cbea210767a3851c`
AuditRepo base: `67b1cbcb684b39fcee9f06036747559c3dc4b37c`

## Disposition

**AUDIT-REOPENED-BY-OWNER / CURRENT-SOURCE-AND-BROWSER-PASS-3**

The owner explicitly selected a new broad audit. Product `main` has also materially changed since the last full-row AuditRepo authority. During this audit Product #521 merged; every admitted root and negative result was rerun on resulting `main@93e8731…`. This satisfies the closeout reopen rules. The audit agent did not mutate Product.

The current pass admits six P2 engineering roots and one P3 structural root. Together with the retained human-backed community P1, MASTER changes from **1** to **8** active units.

## Authority and collision check

Read before testing:

- Product `AGENTS.md`, `docs/CURRENT_STATE.md`, `docs/project-contract.json` and `PROJECT_CHARTER.md`;
- AuditRepo operating rules, TLP document map, current MASTER and the 2026-08-12 audit closeout;
- Product `docs/SESSION_AUDIT_PLAN_2026-10-13.md`, `docs/REVALIDATION_2026-10-22.md` and `docs/PR_517_MERGE_CHECKLIST.md`.

Current Product owners:

- #521 merged as `93e8731…`, recovering the selected essay media and adding fail-closed container/full-decode integrity checks. Resulting-main image validation covers 52 raster files and passes; no media row is admitted.
- #514 owns only the two vulnerable `fflate` lockfile resolutions. It does not update current Vite or `source-map-js` advisories.
- issue #497 still owns the human Turnstile adversarial proof required by `TLP-COMM-ABUSE-001`.

No Product PR was merged, closed or edited.

## Clean baseline

At exact detached Product head:

- `npm ci`: PASS; 169 packages installed;
- `node scripts/validate-project-contracts.mjs`: PASS, 0 open architecture lanes;
- image integrity: PASS, eight mutation tests plus 52 raster files through RIFF/chunk and full decoder checks;
- `npm run check`: PASS;
- `npm run build`: PASS, 3,006 modules transformed;
- `npm run prerender`: PASS, 32 canonical documents plus dedicated 404;
- build-output and SEO-output validators: PASS;
- production entry: 625.2 KiB / 649.4 KiB;
- total JavaScript: 1,700.2 KiB / 1,757.8 KiB;
- total CSS: 256.8 KiB / 293.0 KiB.

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
- six failed remote Wikimedia image observations are sandbox delivery evidence, not Product defects;
- no local broken-image claim is made; merged #521 now adds fail-closed integrity validation for local raster assets.

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

The source already has semantic theme tokens, but poet-detail, Ratings, Music and static pages still write fixed Tailwind palette/alpha classes and inline colors. The global adapter cannot infer every intended foreground/surface pair. Existing `validate-theme-contract.ts` checks a selected component list by literal presence/exclusion; `qa/theme-contrast.spec.mjs` samples selected owners. Both pass while these current route families fail. A source census finds 964 fixed palette utility occurrences across 70 TS/TSX/CSS files. Concentration confirms owner migration is tractable rather than a global override problem: RatingsPage 76, FeaturedTrackPlayer 64, MyArchivePage 57, essay blocks 56, TrackDetailPage 53, MusicArchiveBrowser 50 and ImmersivePlayer 48.

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

## P2 — `SYS-TLP-MODAL-EXIT-LIFECYCLE`

Shared overlay acquisition, topmost Escape dispatch, stacked isolation and initial focus work in both desktop and mobile Chromium. The tested command-over-immersive stack correctly closes one surface per Escape and preserves the body lock until only the immersive surface remains.

The exit boundary is nevertheless split across two clocks. `useDialogSurface` releases the overlay handle when React `open` becomes false, but `AnimatePresence` deliberately keeps the exiting portal mounted. At that instant the runtime restores body scroll, removes background `inert`/`aria-hidden`, removes focus containment and schedules focus restoration even though the full-viewport dialog remains connected and pointer-active. Timed Chromium evidence after Escape:

- ImmersivePlayer: a 1,296,000 px² `role="dialog"` remains connected with `pointer-events:auto`; opacity samples include 0.32 and 0.04 after runtime depth is already zero, and removal occurs around 0.7 s.
- essay lightbox: the same full-viewport dialog remains pointer-active after opacity reaches 0; removal occurs around 1.0 s.
- during both windows, body position is already restored, `#root.inert` is false and focus is restored to the opener behind the exiting dialog;
- `prefers-reduced-motion: reduce` shortens neither ownership mismatch to zero: a pointer-active immersive dialog remains after runtime depth reaches zero; rapid reopen reacquires depth/body/inert state but does not remove the preceding mismatch.

This is a shared modal lifecycle defect, not two component bugs: keyboard/accessibility ownership and visual/pointer ownership disagree during the exit animation. Current `validate-interaction-runtime.ts` and `validate-essay-lightbox-runtime.ts` assert acquisition and ordinary cleanup through source strings/unit fakes, but do not execute the animated close interval. Closure must bind release/focus restoration to exit completion (including reduced motion), preserve stacked semantics and guard rapid close/reopen.

## P2 — `TLP-COMMAND-COMBOBOX-SEMANTICS`

The command palette is absent from a route-only census, so it was opened and audited separately in desktop Light and mobile Dark. Axe reports critical `aria-required-children` in both profiles: `#command-palette-results` declares `role="listbox"`, while every direct result is an ordinary `<button>`, not an `option`. The input declares `role="combobox"`, `aria-controls` and `aria-expanded`, but does not expose the visually selected result through `aria-activedescendant`. Arrow keys therefore move only application state; assistive technology has no valid active-option relationship to announce.

The repair should use one coherent pattern rather than patching Axe: either a real listbox with stable option IDs and active-descendant ownership, or a semantically ordinary result/button list with the incompatible composite roles removed. Current `validate-command-search.ts` and `validate-interaction-runtime.ts` protect keyboard implementation strings but do not open the surface or validate its ARIA graph.

## P2 — `SYS-TLP-FRAGMENT-NAVIGATION-RUNTIME`

A rendered-link census covered 34 pages and 2,640 link instances. Public internal route ownership was coherent; the only inventory additions outside sitemap routes were the expected feed and tested 404. Long essays intentionally render only the first source-library slice: 478 citation instances addressing 163 unique sources on eight routes therefore point to targets absent from the initial DOM. This is not itself a defect because `SourceLibrary` listens for `hashchange`, switches to «Все», expands and scrolls the requested source.

The reveal is not idempotent when the fragment value does not change. Chromium on the Simonov essay proved this sequence with `#source-gramota-courage`:

1. initial target count is 0;
2. the first citation activation changes the hash, expands the library and produces target count 1;
3. selecting «Архивы» hides that target while the URL retains the same fragment;
4. activating the same citation again emits no `hashchange`; after animation settles the target count remains 0 and the source is not revealed.

The owner is the shared fragment/reveal contract, not individual essay data. A complete fresh-load census then widened the same root from reveal to geometry ownership: all 398 unique internal fragment URLs produced their target and no page error, but after 700 ms 28 targets were outside the viewport. Twelve were more than the 96 px fixed-header offset above the viewport across four long essays. Three representative section targets remained between −390 and −764 px after eight seconds; their `scrollY` stopped changing after the initial target lookup. With `prefers-reduced-motion: reduce`, all three landed and remained at approximately 96 px. This isolates a normal-motion layout-settling race: `SmoothScroll` stops observing as soon as the target first exists and does not revalidate geometry after the animated longform layout settles.

Closure needs one idempotent fragment owner that works when the hash is unchanged and revalidates settled target geometry without globally disabling intentional motion. Browser guards must cover fresh and SPA section/citation links, repeated activation, history, keyboard and normal/reduced motion.

## Compact-screen and link negative evidence

A separate 320×568 Chromium census loaded all 34 routes with zero document-width overflow, zero page errors and exactly one `h1` per route. Sixty-three controls on 13 routes extend beyond the initial viewport only inside deliberate horizontal filter/tab rows (Poets, Ratings, Music and essay source filters); the document itself does not overflow. No compact-layout root was admitted from these rows. The link census found no unsafe URL scheme and no unexplained internal application route.

## Audio, community and route/data negative evidence

No additional root was admitted in these passes:

- all three MP3 masters return HTTP 200, match manifest byte counts and SHA-256 exactly, decode through Chromium Web Audio as 44.1 kHz stereo and contain non-silent PCM (RMS 0.185–0.197; sampled nonzero fraction above 99.79%);
- a real UI click advances the first audio element to 2.37 s with `paused=false`, `readyState=4`, no `MediaError`, and visible state «Сейчас звучит»; this proves local current-head bytes/decode/playback progression, not physical speaker output;
- audio asset, music runtime, session and coordination validators all pass; no corrupt-download or silent-master claim is justified;
- community store, target-store, delivery-policy and hardening validators pass, including typed retry/reject reconciliation and durable queue semantics; human live mutation remains issue #497;
- real two-tab archive behavior converges in both directions: adding «Пророк» in the Pushkin page produces one Archive item and `aria-pressed=true`; removing it in Archive restores `aria-pressed=false` in the original tab and persists the generation-2 tombstone;
- Hall v3 renders its production canvas and two route controls when WebGL works; a synthetic context-loss event disposes the canvas and controls and exposes the textual `webgl-context-lost` route, while pre-script removal of `WebGLRenderingContext` directly selects the `webgl-unavailable` fallback with one `h1` and no dead controls;
- canonical registries contain 10 poets, 10 essays and three tracks; all 23 dynamic public paths are present in the 31-URL sitemap, with no missing or orphan dynamic entry.

## Boundaries and negative evidence

- The community P1 is unchanged; automation must not bypass Turnstile.
- Merged #521 media recovery is revalidated on resulting main; no residual local-integrity row is justified.
- Four `link-in-text-block` axe findings on policy-page links are distinguishability best-practice signals; current source has color-only inline links and they remain inside the theme residual until direct interaction/paint evidence justifies a separate row.
- Sub-24px citation links are inline citations inside prose and qualify for the inline-target exception; raw rectangle counts were not promoted.
- Transparent audio seek inputs are not hidden-controls defects: they overlay the painted track and source provides a separate focus indicator.
- No live production, native Safari, assistive-technology or field-performance claim is made in this pass.
- Product source, dependencies and workflows were not modified.

## Result

MASTER now contains **9 active units = 1 P1 + 7 P2 + 1 P3**. This is a current-main audit checkpoint, not audit completion. Modal/focus, audio, community, route/data, compact-screen and citation-fragment passes are now recorded; CSS ownership and false-green mutation analysis continue before selecting Product repair.
