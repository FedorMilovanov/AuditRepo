# Reverification — prior Wave 11 legacy `h-mobile-nav` state ownership

Date: 2026-08-10
Disposition: prior raw Wave 11 root is now `CONFIRMED-CURRENT / P2` on current published Product with direct Chromium runtime/no-JS witnesses.

## Provenance

Prior raw evidence already existed and is not re-created:

- AuditRepo commit `360348ef1cac0e9bd5f7224ff1dba4e0db806de0`;
- `projects/gb-is-my-strength/incoming/chatgpt/2026-08-10/wave-11-shared-runtime-pagefind-editorial-schema.md`.

That wave established from then-current source that:

- shared `SiteUtils` emergency overlay detection did not recognize `.h-mobile-nav.open`;
- the legacy home-v20 mobile owner was shared by HardTexts, Pastor Series and Biografii;
- the generic owner lacked opener focus restoration;
- the same mobile landings lost their primary nav with JavaScript disabled.

The prior wave intentionally remained raw because no direct current browser witness was available in that environment.

## Current authority

- Product current main: `29770e1c7a99478ce7dc2a01abec206ac1daa69b`.
- Exact published candidate: deploy run `31379283849`, artifact `9059689652`.
- Current source `js/site-utils.js` still runs `emergencyCheck()` every 3000 ms and its `hasOpenOverlay()` selector set still recognizes the old `.mobile-nav` family but not `.h-mobile-nav.open` / `#hMobileNav`.
- Product mutation: none.

## V11-LEGACY-MOBILE-NAV-STATE — CONFIRMED-CURRENT / P2

One shared legacy navigation owner has three current manifestations that should remain one repair root rather than route-by-route rows.

### 1. Open menu loses its global scroll lock after the emergency cycle

Exact-current Chromium at 390×844 reproduced on all three current route families:

- `/pastor-series/`;
- `/biografii/`;
- `/hard-texts/`.

Sequence:

1. focus and activate `#hMobileMenuBtn`;
2. menu becomes `.h-mobile-nav.open`, `aria-expanded=true`;
3. body is initially scroll-locked (`overflow:hidden` plus the shared lock styles);
4. leave the menu open beyond one 3-second emergency cycle;
5. menu remains open and `aria-expanded=true`;
6. body lock styles have been released; computed overflow returns to the route baseline (`hidden auto`).

Representative current results after ~3.35 s:

```text
Pastor Series: menu open=true, aria-expanded=true, body overflow=hidden auto
Biografii:     menu open=true, aria-expanded=true, body overflow=hidden auto
Hard Texts:    menu open=true, aria-expanded=true, body overflow=hidden auto
```

This directly confirms the source mechanism from prior Wave 11: the visual disclosure and the shared scroll-lock ledger diverge while the disclosure is still open.

### 2. Generic close path does not own focus restoration

On current Pastor Series and Hard Texts:

1. open mobile menu from the burger;
2. Tab into the first menu link;
3. press Escape.

The menu closes and becomes hidden, but `document.activeElement` remains the now-hidden `Публикации` link rather than returning to `#hMobileMenuBtn`.

Biografii has additional mobile chrome affecting the first Tab target, so this specific manifestation is not generalized to Biografii without a separate focus-path assertion. The common scroll-lock defect still reproduced there.

### 3. No-JS primary-navigation fallback is absent across the three legacy landings

Exact-current JavaScript-disabled Chromium at 390×844 shows the same state on all three routes:

```text
.h-nav-links       display:none
.h-mobile-nav      display:block; visibility:hidden; aria-hidden=true
#hMobileMenuBtn    display:flex; visibility:visible; aria-expanded=false
noscript details   absent
```

Therefore the desktop primary nav is suppressed by the mobile breakpoint, the mobile nav remains hidden, and the visible burger has no JavaScript owner capable of opening it.

This does not mean the entire pages contain no links. The defect is specifically loss of the primary navigation disclosure on those legacy mobile shells.

## Shared source mechanism

Current `js/site-utils.js`:

- coordinates scroll-lock sources;
- starts a 3000 ms emergency timer when locked;
- calls `forceUnlock()` when `hasOpenOverlay()` reports no active surface;
- recognizes selectors such as `.mobile-nav.active`, command palette and TOC overlays;
- does not recognize the current `.h-mobile-nav.open` family.

The generic `site.js` legacy nav owner:

- opens `.h-mobile-nav.open`;
- sets burger `aria-expanded=true`;
- requests the shared scroll lock;
- does not register the menu as an OverlayRuntime layer;
- closes/hides it without deterministic opener focus restoration.

The no-JS failure is the same ownership boundary expressed before runtime: CSS suppresses desktop nav and keeps the mobile panel closed, while no semantic fallback replaces the JavaScript-only burger.

## Existing coverage false-green boundary

Prior Wave 11 already identified two exact gaps which remain relevant:

- `runtime-integrity-test.js` stubs timer execution, so the real 3-second emergency path is not exercised;
- `overlay-runtime-browser-test.js` cannot protect `.h-mobile-nav` because this owner is not registered in OverlayRuntime.

Generic route/layout browser sweeps can also pass because the closed menu is correctly `visibility:hidden`; they do not prove the open-state lock survives >3 seconds, opener focus restores, or mobile primary nav remains available with JavaScript disabled.

## Required terminal outcome

A bounded legacy mobile-nav repair should converge on one current owner and establish all of these invariants:

- an open `.h-mobile-nav` is recognized by the shared overlay/scroll-lock authority for its full lifetime, so the emergency timer cannot unlock the page underneath it;
- close/Escape restores focus to the menu opener when focus belonged to the menu;
- closed state is semantically and visually hidden without stranded focus;
- mobile primary navigation remains available in a truthful no-JS/progressive-enhancement form, preferably by reusing/extracting the stronger canonical Home owner rather than cloning route-specific fixes;
- permanent browser guards cover Hard Texts, Pastor Series and Biografii at 390px for open→>3.2s lock retention, Escape/focus restoration where applicable, and JavaScript-disabled nav availability;
- mutation witness proves removing current `.h-mobile-nav` recognition or fallback makes the guard fail.

## Product mutation

None. This report promotes existing raw Wave 11 evidence using fresh current published-runtime witnesses.
