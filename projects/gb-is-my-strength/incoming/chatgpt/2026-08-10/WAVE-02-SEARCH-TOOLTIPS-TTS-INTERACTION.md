# ChatGPT deep interaction audit — Wave 02: search, tooltips, TTS

Date: 2026-08-10
Agent: ChatGPT
Status: **EVIDENCE / TRIAGE — no Product mutation**

## Anchors / concurrency

- Product `main`: `757946da67287354b819737813c0a47095f2d759`
- AuditRepo head observed immediately before this write: `4b36bec92213ce59c4cb409ae011bd1dc0a5850c`
- Relevant open-PR collision search for search/palette/articles/biografii: none found.
- Exact-head CI evidence remains the PR #1536 / `eb7c1a4f6efd50619abdca8b8967d44aaf7b8de8` artifact family merged into current Product main.

No Product source was mutated in this wave.

---

## W02-F01 — CONFIRMED: desktop global search bootstrap dead-end on `/articles/` and `/biografii/`

**Classification:** CONFIRMED current Product interaction root.  
**Severity:** usability/discoverability; not data loss.  
**Promotion:** left in incoming for collision-safe centralized promotion rather than editing MASTER during concurrent audit traffic.

### Root chain

The full `js/search.js` runtime is capable of creating a visible `#gbSearchBtn` through `Se()` once the full runtime has loaded. It also owns the command-palette dialog, result keyboard navigation, scopes, Pagefind/fallback manifest, etc.

However `/articles/` and `/biografii/` do **not** load the full search runtime on initial desktop page load. Their footer bootstraps only a small lazy wrapper that listens for:

1. a click on an already-existing search trigger (`#gbSearchBtn`, `[data-gbs2-search]`, `[data-fc-action='search']`, `.gb-nav-search-icon`, `.gb-search-btn`), or
2. a `gb:openSearch` event.

That lazy wrapper does **not** listen for `Ctrl/⌘+K` itself.

At the same time, both native top-level landing navbars contain only the normal navigation links plus theme/mobile-menu controls; there is no source search trigger in the navbar/mobile menu.

The shared `site.js` floating-control fallback creates a search button only when `document.querySelector('.breadcrumb')` exists. `/biografii/` and the shared landing family use a semantic `<nav aria-label="Хлебные крошки">` without the `.breadcrumb` class; `/articles/` hero has no `.breadcrumb` class at all. Therefore that fallback cannot bootstrap a desktop search button on these routes.

### Why the apparent mobile behavior is different

`MobileChromePage.astro` does contain an independent `.mcp-search` button and can load the search runtime itself. But the entire `.mcp-top` chrome is `display:none` on desktop and, on mobile, intentionally remains off-screen while the native navbar is visible; it slides in only after the navbar gets `.nav-hidden` (or after 160px on a no-navbar fallback).

Thus mobile eventually has a search affordance through the registry adapter, but that does not rescue desktop.

### Concrete current routes proven

- `/articles/`
- `/biografii/`

`/hard-texts/` is **not** the same defect: its chrome directly loads the full `js/search.js`, so full runtime initialization can create `#gbSearchBtn`; do not overgeneralize the finding to every shared-looking landing.

### Existing tests miss this root

`scripts/interactive-audit.js` validates `Ctrl+K` on four other routes (home and selected article/Nagornaya witnesses), but does not include `/articles/` or `/biografii/`. The Pagefind/search-manifest workflow verifies discovery correctness and real Pagefind results, not availability of a visible opener on every route family.

### Public surface corroboration (secondary)

The current public HTML crawl for `/articles/` and `/biografii/` exposes the normal navigation but no textual search affordance in the server-rendered surface. This is secondary because runtime buttons can be client-created; the decisive evidence is the current source/bootstrap chain above.

### Bounded repair options

Any one owner should make initial search entry deterministic on these routes; avoid stacking multiple owners:

- add a native visible search trigger to the shared landing navbar and let the existing lazy wrapper load `search.js`, or
- make the lazy wrapper also own `Ctrl/⌘+K` and create a search trigger before the full runtime exists, or
- make a single shared shell responsible for search entry across these landing pages.

Required regression witness: desktop `/articles/` and `/biografii/`, cold page load, assert a visible/focusable search opener exists and `Ctrl/⌘+K` opens `.cp-backdrop` before any prior search click. Also verify mobile top-of-page discoverability separately from post-scroll mobile chrome.

---

## W02-F02 — SEARCH A11Y SEMANTIC CANDIDATE: scope chips claim `role=tab` but implement button/filter behavior

**Classification:** CURRENT A11Y CANDIDATE; not promoted as confirmed failure without an accessibility-tree/AT witness.

The command palette renders four scope controls inside `role="tablist"`, each as `role="tab"` with `aria-selected`. Runtime behavior binds click only for scope changes. The palette keyboard handler provides rich input-result navigation (`ArrowUp/Down`, PageUp/Down, Home/End, Enter, Escape), while the overall dialog traps `Tab`, but no Left/Right/Home/End tablist keyboard model or roving `tabindex` is implemented for the scope set.

This is semantically awkward: either these are ordinary filter/toggle buttons and should expose button/filter semantics, or they are tabs and should follow the expected tab interaction pattern with a selected tab as the primary tab stop and an associated tabpanel model.

This is a lower-severity accessibility/polish root than W02-F01, but it is exactly the kind of deep keyboard inconsistency that click-only checks miss.

---

## W02-F03 — TOOLTIP SCREEN-READER RELATION GAP CANDIDATE AFTER BODY RE-PARENTING

**Classification:** CURRENT A11Y CANDIDATE. Visual/pointer functionality is strongly covered and not in dispute.

The canonical `src/runtime/article-tooltips.js` owner is technically strong for layout and interaction:

- one owner for `.gterm`, `.fn-marker`, `.bref[data-ref]`;
- desktop hover transit and placement/flip;
- long-content real overflow;
- VisualViewport geometry;
- mobile bottom sheet with OverlayRuntime scroll lock;
- keyboard focus opening;
- Escape/outside-close;
- restoration of the inline popup to its placeholder on close.

On open, it moves the inline tooltip element into `document.body`, sets the trigger `aria-expanded=true`, and positions the popup. For canonical footnote and scripture owners it does not create `aria-controls` or `aria-describedby`, assign a canonical tooltip/dialog role to every popup, or move focus into the popup. The existing Hermenevtika regression guard has extensive geometry/hover/mobile/Escape/keyboard-focus tests but no `aria-describedby` assertion.

Legacy glossary hydration in `site.js` *does* assign a tooltip ID + `role=tooltip` + `aria-describedby` for `.gterm`, so glossary terms have an extra semantic relationship. Footnote `.fn-marker` and `.bref` canonical flows do not visibly get the same relation from the canonical owner.

Potential consequence: a screen-reader user can focus a trigger, hear that it is a button/source and see `aria-expanded` change, while the newly body-reparented explanatory content may not be programmatically tied to that trigger or automatically announced.

Do **not** call this a proven AT failure until tested with an accessibility snapshot / NVDA-or-equivalent witness. The source-level semantic asymmetry is confirmed; user impact remains a candidate.

Suggested witness: for one `.fn-marker`, one `.bref`, one `.gterm`, record accessibility-tree relations before/open/close and keyboard-only reading order; verify popup name/role, trigger relationship and whether body re-parenting breaks announcement.

---

## W02-F04 — CONFIRMED AUDIT COVERAGE GAP: TTS works across route crawl, but perceived first-play latency is not measured

**Classification:** CONFIRMED measurement gap, not a Product failure.

Exact-head TTS CI is stronger than a superficial smoke test:

- 57 production-like TTS reader routes;
- desktop + mobile route crawl (57 + 57);
- deterministic `speechSynthesis` test doubles;
- start / pause / resume / pagehide-cancel state checks;
- Chromium + WebKit mobile notice geometry at 320×568 and 390×844;
- multitab/SharedWorker/fallback architecture evidence.

All those witnesses are green. But the route-crawl artifact records whether `speechSynthesis.speak()` happened (`speaks=1`) and state transitions, **not elapsed time from user click to actual utterance/audio start**.

For the owner's explicit requirement to audit “скорости аудиоозвучки”, operational correctness is already well covered; perceived responsiveness is not.

### Required latency witness

Measure cold and warm paths separately and emit timings rather than pass/fail only:

1. button click → TTS state change;
2. button click → `speechSynthesis.speak()` invocation;
3. button click → utterance `onstart` (or equivalent real/synthetic first-audible event);
4. enhanced/Vosk readiness → actual playback start where applicable;
5. first consent/download path separately from already-consented warm path.

Sample Chromium + WebKit, desktop + mobile; retain p50/p95 and worst-case plus route/engine identity. This is the only defensible way to answer whether narration “opens fast”, rather than merely whether it eventually works.

---

## W02-F05 — TTS TEST SCREENSHOT FALSE ALARM REJECTED

**Classification:** FALSE as Product visual bug.

The exact-head TTS browser artifact contains a screenshot that looks intentionally crude (gray rectangle/default-style controls). Source inspection of `scripts/tts-reader-runtime-browser-test.js` shows the test injects synthetic fixture CSS for `.gb-tts-download-notice` rather than loading the production skin. Therefore that screenshot is a state-machine/geometry fixture, not evidence that the live TTS notice is visually broken.

The real `css/tts-download-notice.css` is a separate premium responsive skin. Do not promote the synthetic screenshot appearance into MASTER.

---

## Positive controls preserved

- Exact-head Pagefind discovery workflow is green: 75 indexed routes, noindex leaks 0, RSS drift 0, canonical scripture queries return results.
- Search runtime itself has robust result navigation, Pagefind fallback, exact scripture index, zero-result suggestions, show-more pagination, focus restore and modal close behavior once it is actually opened.
- Tooltip geometry/hover/mobile behavior has unusually deep regression coverage; this wave targets the remaining semantic/AT layer instead of re-reporting already-covered mechanics.
- TTS reader behavior is green across 114 route/view-mode route-crawl cases (57 desktop + 57 mobile); the missing dimension is latency measurement, not basic play/pause/resume functionality.

## Next wave targets

1. Expand the desktop search-entry census to `/rodosloviye/`, `/karty/`, `/konfessii/`, `/pastor-series/`, `/about/`, `/map/` and special shells; classify by actual owner rather than appearance.
2. Intermediate-width geometry: 600/768/820/1024/1199 on shared landings and reader route families.
3. Readability: computed effective reading measure and rail collision across more than the two current standalone-reader witnesses.
4. Fixed/sticky controls: overlap at zoom, soft keyboard, safe areas, landscape and reduced-height mobile.
5. Performance: current CI/runtime evidence for navigation/build/static weights, then identify which user-perceived metrics (LCP/INP/search-open/TTS-start) are not actually being measured.
6. Accessibility tree witnesses for tooltip and search-scope semantics.
