# Comment on Finding

## Identity

- Project: gb-is-my-strength
- Comment by: arena-dx-ux-audit
- Date: 2026-10-06
- Target report: MASTER_BUG_MATRIX.md open table, five rows:
  `GBS-HEADER-SEARCH-THEME-TARGET-OVERLAP`, `GBS-HEADER-MOBILE-CONTROLS-CLIPPED-OUTSIDE-VIEWPORT`,
  `GBS-THEME-TOGGLE-FOCUS-INDICATOR-MISSING`, `GBS-HEADER-SEARCH-TRIGGER-NOT-WIRED`,
  `GBS-HERMENEUTIKA-MOBILE-SPEED-BADGE-UNDERSIZED`
- Evidence anchor: `68750830f4725213d80b833015520e5894699838` (Product main, 2026-10-05T22:06Z)
- Receipts: `evidence/2026-10-06-matrix-rows-third-wave-at-main.txt`,
  `evidence/2026-10-06-matrix-rows-third-wave-machine.json`

## Comment type

stale / evidence-addition (candidate for closed-by-fix at this anchor)

## Evidence angle

browser (exact-SHA production-like local build, sandbox Chromium 153, real mobile emulation where noted),
plus source diffs in `d586aa63..68750830` for provenance.

## Evidence

```text
1) GBS-HEADER-SEARCH-THEME-TARGET-OVERLAP — not reproduced.
   13 route x width cells (360/390/414/768/1280/1440; `/`, `/izbrannoe/`, genesis-6):
   theme.left - search.right = 0.0px, intersection = 0px, computed search margin-right = 0px.
   Pointer at x = search.right-6 hits the SEARCH control (`button#gbSearchBtn` / `button#hCpBtnNav`),
   never the theme toggle. Desktop intersection area 0 at 1280/1440.
   Provenance: 2ee584d added `.astro-header__controls.mobile-controls{gap:0!important; margin-left:auto;
   min-width:max-content; overflow:visible!important}` and `… .gb-nav-search-icon,.theme-toggle
   {margin:0!important; flex:0 0 44px}`; the legacy `.mobile-controls .gb-nav-search-icon
   {margin-right:-12px!important}` is still shipped but loses the cascade (computed 0px).

2) GBS-HEADER-MOBILE-CONTROLS-CLIPPED-OUTSIDE-VIEWPORT — not reproduced.
   Real mobile emulation: 390 `/izbrannoe/` search [270..314] theme [314..358];
   390 `/` [238..282]/[282..326]; 360 [240..284]/[284..328]; 414 [293..337]/[337..381];
   768 `/` [605..649]/[649..693]; 768 `/izbrannoe/` [633..677]/[677..721]; 1280 genesis-6
   [1025..1069]/[1069..1113] — every control fully inside the viewport, centre hit-tests itself.
   On genesis-6 at 360/390/414/768 the shared header is `display:none` by design
   (`@media (max-width:1199px){body:has(.mcp-top) .astro-header{display:none!important}}`, 2ee584d),
   so the mobile-header scenario of the row cannot apply on that route.

3) GBS-THEME-TOGGLE-FOCUS-INDICATOR-MISSING — not reproduced.
   `/` 1440 Tab stop 11, `/` 390 stop 4, genesis-6 1440 stop 12: `:focus-visible=true`,
   `outline: 2px solid` (rgb(8,125,145) on `/`, rgb(122,46,46) on genesis-6), offset 2px.
   Provenance: 2ee584d added the header-scoped `:focus-visible{outline:…!important}` ring and removed
   the legacy `transition:all .3s` that animated the outline in; the legacy sheet is still loaded.

4) GBS-HEADER-SEARCH-TRIGGER-NOT-WIRED — not reproduced.
   At 1280 on `/izbrannoe/` and `/hard-texts/genesis-6/`: click -> `.cp-backdrop.is-open`, visible input
   rect [253,123,461,24], `aria-expanded="true"`; Escape closes; `Control+k` opens the same state;
   one request `/js/search.js?v=106d65f6` per route.
   Provenance: 2ee584d inline bootstrap on `#hCpBtnNav` (first click dispatches `gb:openSearch`) plus
   `aria-keyshortcuts="Control+K Meta+K"`. The row's 390px genesis-6 part is moot for the reasons in (2).

5) GBS-HERMENEUTIKA-MOBILE-SPEED-BADGE-UNDERSIZED — not reproduced on all three named routes.
   Badge 36x28 at [294,14]; `::before{inset:-8px -4px}` -> 44x44 effective target at [290,6];
   Play 38x38 at [250,9]; overlap of target with Play = [0,38] (zero width, 2px clearance);
   axe `target-size` violations 0; trusted tap sets `aria-expanded=true` with the rail visible.
   36x28 already satisfies the 24x24 minimum without the spacing exception.
   Provenance: b2611ca set `.hm-spdbadge{min-width:36px; height:28px; padding:0 8px}` and
   `::before{inset:-8px -4px}`.
```

## Recommendation

Treat all five rows as closed-by-fix at Product main `68750830`; keep them open only if a browser other
than Chromium 153 (or an assistive-technology path not tested here) is the acceptance surface.

## Limits of this comment

Exact-SHA local-build browser evidence, not live-host testing; no WebKit in the sandbox. Provenance is
asserted from in-range `git log -S` (30 commits between `d586aa63` and `68750830`), not from the Product
authors' PR descriptions.
