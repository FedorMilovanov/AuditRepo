# The Legendary Poet — current-main audit reopen

Date: 2026-10-24  
Product repository: `FedorMilovanov/TheLegendaryPoet`  
Original Product audit anchor: `93e8731cc04d12a8fe985604cbea210767a3851c`
Current resulting-main anchor: `76da7d6372931f34d269581f374e87bd15406cfb`
AuditRepo base: `67b1cbcb684b39fcee9f06036747559c3dc4b37c`

## Disposition

**AUDIT-REOPENED-BY-OWNER / CURRENT-SOURCE-AND-BROWSER-PASS-3**

The owner explicitly selected a new broad audit. Product `main` has also materially changed since the last full-row AuditRepo authority. During this audit Product #521 merged; every admitted root and negative result was rerun on resulting `main@93e8731…`. Product #522 later merged the bounded dependency-only repair as `76da7d6…`; the user-reported essay navigation surfaces and clean source gates were rerun there. This satisfies the closeout reopen rules. The audit agent did not mutate or merge Product.

The current pass admits eleven P2 engineering roots and one P3 structural root. Together with the retained human-backed community P1, MASTER changes from **1** to **13** active units.

## Authority and collision check

Read before testing:

- Product `AGENTS.md`, `docs/CURRENT_STATE.md`, `docs/project-contract.json` and `PROJECT_CHARTER.md`;
- AuditRepo operating rules, TLP document map, current MASTER and the 2026-08-12 audit closeout;
- Product `docs/SESSION_AUDIT_PLAN_2026-10-13.md`, `docs/REVALIDATION_2026-10-22.md` and `docs/PR_517_MERGE_CHECKLIST.md`.

Current Product owners:

- #521 merged as `93e8731…`, recovering the selected essay media and adding fail-closed container/full-decode integrity checks. Resulting-main image validation covers 52 raster files and passes; no media row is admitted.
- #522 merged as `76da7d6…`, changing only package/lock dependency resolutions; local resulting-main audit is now zero-vulnerability. Obsolete overlapping #514 was subsequently closed unmerged.
- issue #497 still owns the human Turnstile adversarial proof required by `TLP-COMM-ABUSE-001`.

The audit agent merged, closed and edited no Product PR.

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

At current `main@76da7d6…`, `npm ci` installed 169 packages with zero advisories; project contracts, full `npm run check`, build, prerender, build-output and SEO-output validation all pass. The only source-validator warning is the pre-existing Mayakovsky/Pasternak testimony without `sourceUrl`; citation/media warnings remain explicitly classified by their validators. Product #522 changed no reader component, route or content file.

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

Product #522 was the exact bounded owner: only `package.json` and `package-lock.json`, updating Vite 7.3.6→7.3.7, source-map-js 1.2.1→1.2.2, fflate 0.8.2→0.8.3 and nested 0.6.10→0.6.11. Its exact head `19dd48c…` completed every check successfully and merged as `76da7d6…`. On resulting main, immutable full-tree audit reports 0 advisories and the complete local source/build/prerender/output baseline passes. CI, Pages, Manual Browser QA, Hall offline, route, contracts, article, content, brand and publication workflows are now all terminal green. `TLP-DEPENDENCY-ADVISORY-RESIDUAL` is therefore retired. Older overlapping #514 was correctly closed unmerged on 2026-10-24.

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

A third edge is URL ownership. `PoemQuickNav` renders real `href="#poem-…"` links but prevents their native default and calls the scroll-only `scrollToId`; a real Pushkin click moves the first poem to y≈72 while `location.hash` remains empty. Mobile `SectionChip` uses the same helper: after isolating its inertness and choosing section 02, the article scrolls to y=4776 but the hash is still empty. These controls therefore lose copyable identity and browser fragment history even when geometry movement succeeds.

Closure needs one idempotent fragment owner that works when the hash is unchanged, preserves URL/history identity and revalidates settled target geometry without globally disabling intentional motion. Browser guards must cover fresh and SPA section/citation/poem links, repeated activation, copy/back/forward, keyboard and normal/reduced motion.

### Owner-reported essay menu and series-navigation reproduction

The owner reported that selecting numbered items such as 02/03 in the left essay menu appears to leave the reader in the previous part. On current `main@76da7d6…`, Chromium 153 executed a native pointer activation for **all 106 desktop TOC links across all ten essays**, each from a fresh route load. Only 65 landed with the requested heading visible. The 41 failures split cleanly between existing systemic owners:

- **23 links changed the hash and scrolled, but the target settled above the viewport** (−61 to −782 px). This is `SYS-TLP-FRAGMENT-NAVIGATION-RUNTIME`, not a dead link.
- **18 later links could not be pointer-activated at all** because the oversized sticky menu could not scroll its own item into the viewport. This is `SYS-TLP-STICKY-VIEWPORT-GEOMETRY`.

The reported Yesenin Part II case is direct. In twelve independent 1440×900 normal-motion trials, section 03 failed **12/12**, settling mostly at y=−85 (once −243), so the viewport continued to show the final paragraph of section 02. Section 02 failed 1/12 at y=−79. At 1280×800, 1440×900 and 1920×1080 the section-03 target remained y≈−85 after eight seconds. The reduced-motion control placed sections 01/02/03 at y≈96 and remained stable. This proves a layout-settling race rather than slow scrolling, a missing target or a user-input problem.

Current QA explains the false green: `theme-contrast.spec.mjs` fixes `reducedMotion: 'reduce'`, clicks only the **first** TOC link, and checks only one series link's focus, `href` and contrast—not route activation. It cannot detect normal-motion 02/03 drift, late sticky items or a broken series transition.

The explicit bottom series transition itself is present after the narrative and before the source library. All four current series pages (Yesenin I↔II and Mayakovsky I↔II) navigated successfully by pointer and keyboard: 8/8 desktop normal-motion activations plus 16/16 mobile normal/reduced activations. Screenshots confirm the rendered «Следующая часть» card. It is not at the literal document bottom because sources and community follow it.

There is **no timed auto-advance contract** in current Product: the series block contains one ordinary link, zero buttons, zero circles and zero progress elements; source contains no series countdown or timer-driven navigation. The cyan circular effect seen while hovering is the decorative `CustomCursor` ring, which only spring-scales on interactive hover and never fills or activates a link. Therefore “the ring completed but did not advance” is an affordance misunderstanding, not a failed timer. If timed auto-advance is desired, that is a new product/UX decision and must include pause/cancel/reduced-motion/accessibility semantics rather than being smuggled in as a bug fix.

Fresh desktop/mobile quality controls on all four series routes found zero Axe WCAG A/AA violations, zero local broken images and zero page errors; LCP was 212–332 ms and CLS 0–0.0011 in the local production-like environment. Three Wikimedia request failures were sandbox egress and are not Product defects.

### Continued route-navigation activation

The follow-up expanded from essay numerals to every distinct rendered in-content route control in the 34-route inventory. A native pointer/keyboard matrix executed **436 activations over 218 controls** with URL, destination identity, history and Back checks. All 218 keyboard activations passed. Pointer passed 209/218; the remaining nine controls failed 27/27 repeated trials because their centres stayed outside or under existing sticky owners: three essay author cards, five late Kindred Spirits cards and the first Ratings poet link beneath the sticky table header. This broadens `SYS-TLP-STICKY-VIEWPORT-GEOMETRY`; it does not create a navigation-router root.

Persistent global navigation is healthy. Header, footer and mobile-dock route links passed **132/132** native pointer/keyboard activations across desktop/mobile and normal/reduced motion, including history and Back restoration.

The command palette was then used as a second navigation origin for all 106 essay sections: pointer under normal motion plus keyboard under reduced motion, **212/212 intended result-button activations**, reached the expected route and hash after disambiguating one legitimate multi-result «Москва Кабацкая» query. At 1.8 s, 30 normal-motion destinations were still outside the viewport although route/hash were correct. An 18-run focused eight-second control showed reduced-motion and most delayed targets reconverging, but Yesenin II section 03 remained above the viewport in 3/3 normal-motion trials. This independently confirms the existing fragment-layout owner while proving that command buttons themselves dispatch navigation.

### Poem quick navigation and Hall route controls

All 34 poem quick-navigation anchors on the ten poet pages were activated by pointer and keyboard in desktop/mobile normal/reduced-motion profiles: **272 attempts**. Mobile and keyboard actionability were complete, but desktop pointer action failed 62 times because oversized sticky quick-nav panels left most rows below the viewport; this is another `SYS-TLP-STICKY-VIEWPORT-GEOMETRY` manifestation. Every one of the 210 delivered activations prevented the anchor default, left `location.hash` empty and added no history entry. Thus URL/copy/Back identity fails **272/272 by implementation contract**, independently confirming `SYS-TLP-FRAGMENT-NAVIGATION-RUNTIME` rather than creating a poem-specific root.

Normal-motion geometry was temporarily outside the viewport in 58 delivered cases at 1.8 s, while every reduced-motion delivered activation landed correctly. A separate 102-activation normal-motion settling pass left 29 targets outside at 1.8 s but only one transient Yesenin case outside at eight seconds; three fresh long controls then placed that target at y≈96 by 1.8 s and kept it stable through 25 seconds. The durable result is therefore missing fragment/history identity plus sticky actionability—not a newly proven permanent poem-geometry class.

The Hall's six-stop guided route was traversed completely in both directions, including cyclic end→start/start→end behavior: **96/96** «Дальше»/«Назад» activations passed across desktop/mobile, pointer/keyboard and normal/reduced motion. Every transition updated the visible and live-region stop identity, retained `/hall/`, added no history entry and produced zero page exceptions. The existing Product QA covers only the first forward/back pair; this pass closes the remaining traversal-direction and keyboard evidence gap without admitting a defect.

## P2 — `TLP-ESSAY-PORTRAIT-POINTER-HITTEST`

Desktop portrait images use the shared `ArticleRenderer` float-right wrapper. The float correctly makes prose lines wrap to its left, so screenshots look intact. The following prose element still owns a full-width transparent block box behind the float and is later in hit-test order. At the visual centre of the image, `document.elementFromPoint` therefore returns the prose `<p>`, not the image button or its stable outer `TiltCard` hit wrapper. Playwright's real pointer action remains intercepted after animation settling; keyboard focus plus Enter still opens the same lightbox.

A complete desktop float census covers all 17 currently rendered floated image buttons: 12 are pointer-blocked across `yesenin-kutezhi`, `mayakovsky-before-revolution`, `mayakovsky-gromovoy` and `brik-case`; only five are reachable at their centre. The broader interaction pass also catches 11 adjacent «Источник» links blocked by the same prose hit surface. The right-float mobile control sample is 8/8 reachable at 390×844 where the desktop float is inactive. The desktop failure reproduces with normal and reduced motion, so it is breakpoint-specific float/stacking ownership rather than animation timing. Closure must preserve text wrapping and tilt stability while making the complete figure, metadata/source actions and lightbox trigger pointer/touch reachable.

## P2 — `SYS-TLP-STICKY-VIEWPORT-GEOMETRY`

A 34-route desktop hit-test census evaluated 3,337 visible interactive instances; a separate focus census evaluated 3,383 focusable instances and reproduced exactly the same 90 off-viewport sidebar controls, all with `document.activeElement` correctly set but no visible focus. The 390×844 focus control covered 2,905 instances with zero off-viewport focused elements. Besides the floated-image root, it exposed one shared sticky-geometry class. Oversized sticky sidebars on all ten poet pages and seven long essays leave 90 links below the 800 px viewport after `scrollIntoView`; focusing those links does not repair visibility. On Pushkin, the focused last poem link remains at y=1676 after the browser scrolls to y=2108. On the Benislavskaya essay, the focused last TOC link remains at y=1056. The corresponding Pushkin control lands visibly at y=376 in the 390×844 non-sticky layout.

Ratings has the inverse failure: `<thead class="sticky top-20">` is shifted into the body. With the table at y=312, its first body row spans y=360–441 while the header occupies y=392–440. The opaque header visibly splits the first row and `elementFromPoint` at the poet-link centre returns `<th>`, not the link. These are one viewport-constraint root: sticky owners must not be taller than or overlap the interactive region they govern.

## P2 — `TLP-MOBILE-SECTION-CHIP-INERT`

The 390×844 interaction census tests 2,856 visible controls. Its only stable class of failure is the mobile essay section chip on all ten essays. CSS intentionally makes `.section-chip` opacity 1 and `pointer-events:auto` only while `html.chrome-hidden` is active. In the same state, `useAutoHideChrome.syncChromeAccessibility(true)` queries `.site-header, .mobile-dock, .palette-fab, .section-chip` and assigns every match `inert` plus `aria-hidden=true`. The replacement control is therefore disabled with the chrome it is supposed to replace.

On a real touch-capable Chromium context the chip reaches opacity 1 at y≈10, but its ancestor remains inert and it is absent from `elementsFromPoint`; underlying essay prose wins the hit. Real centre taps at 150, 300, 400 and 600 ms never open `#essay-toc-popover`. Removing only `inert`/`aria-hidden` in the probe makes the next native tap open the popover with all ten rows, isolating the owner. This is not a transition-only race: the failure persists after the 550 ms animation completes.

The same owner survives orientation and breakpoint changes. A separate 844×390 touch/landscape census loaded all 34 routes with zero page errors, zero document overflow and zero focused-off-viewport instances across 3,171 targets. Its only initial centre-hit class was the ten essay chips. On Simonov after scrolling to y=1400, `chrome-hidden=true`, the chip was visible at y≈10 with pointer-events auto, but its ancestor remained `inert`/`aria-hidden=true`; prose occupied the hit stack and a native tap left the popover closed. Closure must therefore cover portrait mobile and short landscape/tablet widths, distinguish hidden chrome from visible replacement controls, and verify native popover interaction plus accessibility state over repeated hide/show cycles.

## P2 — `SYS-TLP-TEXT-SPACING-ROBUSTNESS`

A dedicated WCAG text-spacing pass applied line height 1.5, paragraph spacing 2em, letter spacing .12em and word spacing .16em after each route settled. Chromium 143 covered the same 34 routes at 1280×800 and 390×844: 68/68 loads produced no page error, no document-width overflow and no increase in centre-hit-blocked controls across 6,446 focusable instances.

The no-overflow result hides owner-level content loss. Comparing stable DOM instances before and after the override found 15 newly clipped visible text nodes on ten routes:

- one desktop Ratings tag line constrained by `truncate`;
- six Article card summaries constrained by `line-clamp-*` (one desktop, five mobile);
- three desktop Music description instances constrained by `line-clamp-3`;
- four desktop current-page breadcrumbs constrained by `truncate`;
- one mobile Kindred Spirits name constrained by `truncate`.

Three additional raw overflow observations came from inactive absolutely positioned citation tooltips inside decorative `overflow-hidden` myth cards. They were not counted: when a citation becomes active, its existing layout effect repositions the tooltip against the viewport; the remaining eight-pixel ancestor-edge intersection consumes border/padding rather than demonstrated text. This control prevents tooltip geometry from inflating the admitted count.

The visible failures share a systemic assumption: twenty source occurrences of `truncate`/`line-clamp-*` preserve fixed width or line budgets after user spacing increases, and current validators contain no executed text-spacing outcome. Closure should make affected summaries, labels and current-location text grow, wrap or expose an equivalent visible disclosure under all four overrides. The guard must compare rendered content and geometry in desktop/mobile route families; removing all compact presentation globally or merely suppressing overflow detection is not sufficient.

## Compact-screen and link negative evidence

A separate 320×568 Chromium census loaded all 34 routes with zero document-width overflow, zero page errors and exactly one `h1` per route. Sixty-three controls on 13 routes extend beyond the initial viewport only inside deliberate horizontal filter/tab rows (Poets, Ratings, Music and essay source filters); the document itself does not overflow. No compact-layout root was admitted from these rows. The link census found no unsafe URL scheme and no unexplained internal application route. A forced Archive route-chunk failure also reaches the bounded recovery path: one automatic reload, two aborted module requests, then a single `role="alert"` with one `h1`, `robots=noindex,follow`, no stale canonical and a session recovery marker preventing a reload loop.

## Audio, community and route/data negative evidence

No additional root was admitted in these passes:

- all three MP3 masters return HTTP 200, match manifest byte counts and SHA-256 exactly, decode through Chromium Web Audio as 44.1 kHz stereo and contain non-silent PCM (RMS 0.185–0.197; sampled nonzero fraction above 99.79%);
- a real UI click advances the first audio element to 2.37 s with `paused=false`, `readyState=4`, no `MediaError`, and visible state «Сейчас звучит»; this proves local current-head bytes/decode/playback progression, not physical speaker output;
- audio asset, music runtime, session and coordination validators all pass; no corrupt-download or silent-master claim is justified;
- community store, target-store, delivery-policy and hardening validators pass, including typed retry/reject reconciliation and durable queue semantics; human live mutation remains issue #497;
- real two-tab archive behavior converges in both directions: adding «Пророк» in the Pushkin page produces one Archive item and `aria-pressed=true`; removing it in Archive restores `aria-pressed=false` in the original tab and persists the generation-2 tombstone;
- Hall v3 renders its production canvas and two route controls when WebGL works; a synthetic context-loss event disposes the canvas and controls and exposes the textual `webgl-context-lost` route, while pre-script removal of `WebGLRenderingContext` directly selects the `webgl-unavailable` fallback with one `h1` and no dead controls;
- the Hall/global-audio boundary remains usable after real playback starts on Music and SPA navigation preserves the mini-player: at 390×844 Hall controls end at y=632, before the mini-player begins at y=670 and both centre hits reach their buttons; at 320×568 the stage intentionally exceeds the short viewport, but native `scrollIntoView` places both controls at y=261–307, clear of the y=394 mini-player, and both centre hits succeed;
- canonical registries contain 10 poets, 10 essays and three tracks; all 23 dynamic public paths are present in the 31-URL sitemap, with no missing or orphan dynamic entry.

## Forced-colors and target-size negative evidence

A separate Chromium 143 pass exercised all 34 routes in desktop and mobile forced-colors mode with reduced motion. All 68 loads completed without page errors. Existing gradient text computes with transparent WebKit fill after forced-color remapping, so computed-style transparency was not promoted: actual screenshots prove Chromium paints the Home kinetic title, essay section numbers/headings and poet title in system colors. The existing browser guard opens only the Home command surface, so this pass broadens route/render evidence without claiming native Windows High Contrast or assistive-technology coverage.

The same 34×2 route matrix evaluated 6,452 rendered target instances against the WCAG 2.5.8 24 CSS-pixel size-or-spacing rule. There were 2,043 instances with at least one dimension below 24 px, predominantly compact links and citations, but **zero** had another target centre within 24 px. They therefore satisfy the spacing alternative in the sampled geometry; no target-size row is admitted. This is a geometry result, not a claim about physical-device motor testing.

## Boundaries and negative evidence

- The community P1 is unchanged; automation must not bypass Turnstile.
- Merged #521 media recovery is revalidated on resulting main; no residual local-integrity row is justified.
- Four `link-in-text-block` axe findings on policy-page links are distinguishability best-practice signals; current source has color-only inline links and they remain inside the theme residual until direct interaction/paint evidence justifies a separate row.
- Sub-24px citation links are inline citations inside prose and qualify for the inline-target exception; raw rectangle counts were not promoted.
- Transparent audio seek inputs are not hidden-controls defects: they overlay the painted track and source provides a separate focus indicator.
- No live production, native Safari, assistive-technology or field-performance claim is made in this pass.
- Product source, dependencies and workflows were not modified.

## AuditRepo publication proof

Draft AuditRepo PR #488 publishes this audit from `arena/f93eb2cc-auditrepo`. The substantive poem/Hall-navigation checkpoint is exact head `f1b20686513aa03d2dbd76dfb8607488884879d4`; Validate `40136144623` and Preflight `40136144717` both completed successfully, and GitHub reports the draft PR merge-clean. This certifies the audit artifact shape; it does not close any remaining Product row.

Product `main` is `76da7d6372931f34d269581f374e87bd15406cfb`, the dependency-only #522 merge. Local resulting-main audit and all source/build/output gates pass; every required resulting-main workflow, including Manual Browser QA and Hall offline exhibit, is terminal green. Product #514 was closed unmerged after its `fflate` scope became obsolete. No Product mutation or merge was performed by the audit agent.

## Result

MASTER now contains **12 active units = 1 P1 + 10 P2 + 1 P3** after terminal dependency retirement. This is a current-main audit checkpoint, not audit completion. Modal/focus, audio, community, route/data, compact-screen, text-spacing, fragment, portrait-hit-test, sticky-geometry and mobile-section-chip passes are now recorded; CSS ownership and false-green mutation analysis continue before selecting Product repair.

## Русский итог фокусной проверки

### СДЕЛАНО

- Нативно активированы все 106 пунктов левого оглавления десяти эссе и все текущие переходы между частями серии.
- Жалоба «нажал 02/03, остался текст предыдущего раздела» воспроизведена и сведена к уже открытому системному владельцу fragment runtime; отдельный дубликат не создан.
- Проверены исходники нижней навигации и визуального кольца, выявлен false-green в browser QA.
- Дополнительно выполнены 436 активаций 218 внутренних route-контролов, 132 активации глобальной навигации и 212 переходов из command palette.

### ПРОВЕРЕНО

- Оглавление: 65 корректных переходов, 23 неверные конечные геометрии, 18 недоступных из-за sticky rail.
- Есенин II: раздел 03 — 12/12 сбоев normal motion, раздел 02 — 1/12; reduced motion — корректная y≈96.
- Нижние переходы I↔II: 24/24 успешных pointer/keyboard активаций на desktop/mobile, normal/reduced motion, с проверкой URL, страницы, заголовка и history.
- Локальные изображения, Axe A/AA, page errors, LCP/CLS на четырёх страницах серии: новых дефектов нет.
- Все 218 keyboard-переходов по внутренним route-контролам успешны; pointer — 209/218. Девять повторяемых отказов относятся к уже открытому sticky-geometry owner.
- Header/footer/mobile dock: 132/132. Command palette → 106 разделов: 212/212 переходов по ожидаемому route/hash.
- Навигация по 34 стихотворениям: 272 попытки; 62 desktop pointer-сбоя принадлежат sticky owner, а все 210 доставленных активаций теряют hash/history из-за `preventDefault`.
- Зал Поэтов: полный цикл шести точек вперёд/назад — 96/96 pointer/keyboard активаций на desktop/mobile normal/reduced.
- Resulting-main CI Product полностью зелёный; dependency residual закрыт.

### НЕ ПРОВЕРЕНО

- Нативные Safari/Firefox, screen reader и физическое устройство не заявляются.
- Таймер перехода не тестировался как функция, потому что такой функции в текущем Product нет. Кольцо — декоративный custom cursor; новый auto-advance требует отдельного продуктового решения.
- Новых непроверенных границ в этой волне не добавлено; dependency-строка закрыта после терминального resulting-main CI.

### СРЕДА

Product `main@76da7d6372931f34d269581f374e87bd15406cfb`; Chromium `153.0.8010.0`; production build; desktop 1280×800, 1440×900, 1920×1080; touch/mobile 390×844; normal/reduced motion. AuditRepo: `arena/f93eb2cc-auditrepo`, substantive checkpoint `f1b20686513aa03d2dbd76dfb8607488884879d4`, draft PR #488, Validate `40136144623` и Preflight `40136144717` — success/merge-clean.

### РЕШЕНИЯ САМ

- Не плодить новые строки: неверный settled scroll относится к `SYS-TLP-FRAGMENT-NAVIGATION-RUNTIME`, недоступные поздние пункты — к `SYS-TLP-STICKY-VIEWPORT-GEOMETRY`.
- Не выдавать custom cursor за сломанный progress control и не добавлять скрытый таймер как «исправление».
- Закрыть dependency owner после полученного полного resulting-main CI; перекрывающий Product #514 уже закрыт без merge.

### Что требуется от владельца

1. Сначала исправить два общих владельца навигации и добавить browser guards, которые активируют каждый пункт и проверяют URL, identity/H1, history и конечную геометрию в normal/reduced motion.
2. Решить отдельно, нужен ли вообще автоматический таймер перехода; текущий контракт его не обещает.
3. Product #514 уже закрыт без merge; повторно открывать перекрытый dependency lane не требуется.
4. AuditRepo PR #488 не закрывать и не сливать без отдельного решения.
