# MOBILE DEEP AUDIT — gb-is-my-strength
**Agent:** arena-agent-6
**Date:** 2026-06-25
**Method:** Source code analysis + production HTTP requests + v16 probe comparison
**Focus:** Mobile-specific bugs, touch targets, responsive design, PremiumControls readiness

---

## 1. MOBILE ARCHITECTURE OVERVIEW

### Page Types and Mobile Controls

| Page Type | Desktop Control | Mobile Control | Status |
|---|---|---|---|
| Standalone articles | gb-floater (fixed) | gb-floater (absolute, bottom) | ✅ Has mobile override |
| Gill series | gbs2-rail (sidebar) | gbs2-bbar (bottom bar) | ✅ Working |
| Nagornaya | nag-sidebar | nag-sidebar (responsive) | ✅ Working |
| Baptisty | gbs2-rail (sidebar) | gbs2-bbar (bottom bar) | ✅ Working |

### Mobile CSS Breakpoints
- `@media (max-width: 899px)` — main mobile breakpoint
- `@media (max-width: 680px)` — smaller screens
- `@media (max-width: 500px)` — small mobile
- `@media (max-width: 480px)` — very small mobile
- `@media (max-width: 380px)` — ultra-small screens
- `@media (max-width: 360px)` — minimum supported width
- `@media (pointer: coarse)` — touch devices
- `@media (hover: none)` — touch devices without hover

---

## 2. MOBILE BUGS FOUND

### MOB-01 (P2): floating-cluster.css missing touch-action rules
**Severity:** P2
**Evidence:** `floating-cluster.css` has 0 `touch-action` rules. The v16 probe file has `touch-action: manipulation` on interactive elements. Without this, mobile browsers may add 300ms tap delay.

**Impact:** Slower tap response on mobile for premium controls (theme, search, play, save).

**Fix:** Add `touch-action: manipulation` to `.gb-icon`, `.gb-save`, `.gb-ember` and other interactive elements.

---

### MOB-02 (P2): floating-cluster.css missing -webkit-tap-highlight-color
**Severity:** P2
**Evidence:** `floating-cluster.css` has 0 `-webkit-tap-highlight-color` rules. The v16 probe has `-webkit-tap-highlight-color: transparent` on buttons. Without this, iOS shows a gray highlight on tap.

**Impact:** Visual glitch on iOS — gray flash on tap.

**Fix:** Add `-webkit-tap-highlight-color: transparent` to interactive elements.

---

### MOB-03 (P2): floating-cluster.css missing overscroll-behavior
**Severity:** P2
**Evidence:** `floating-cluster.css` has 0 `overscroll-behavior` rules. The v16 probe has `overscroll-behavior: contain` on overlays. Without this, scroll chaining may cause the page to scroll when scrolling inside a popup.

**Impact:** Page scrolls when scrolling inside TOC popup or speed panel on mobile.

**Fix:** Add `overscroll-behavior: contain` to `.toc-overlay`, `.toc-sheet`, `.gb-ember-expand`.

---

### MOB-04 (P3): v16 probe CSS variables not in production
**Severity:** P3
**Evidence:** v16 probe defines `--gb-ease-smooth`, `--gb-ease-soft`, `--gb-canvas` which are NOT in production CSS. These are used for smoother animations.

**Impact:** Slightly different animation feel between v16 probe and production.

**Fix:** Add missing CSS variables to production CSS.

---

### MOB-05 (P3): kbd-help component not in production
**Severity:** P3
**Evidence:** v16 probe has `.kbd-help` (keyboard shortcuts help popup) which is NOT in production CSS. This is a UX feature for desktop users.

**Impact:** No keyboard shortcuts help available.

**Fix:** Add kbd-help CSS and JS to production.

---

### MOB-06 (P2): gbx-tts overlay may block gbs2-theme buttons on mobile
**Severity:** P2
**Evidence:** arena-agent-2 already found this: `.gbx-tts` overlay at bottom-left can overlap with gbs2 bottom-bar controls on mobile. The `body.has-bottom-bar .gbx-tts` rule moves it up, but the overlap may still occur on small screens.

**Impact:** TTS overlay blocks theme/search buttons on mobile.

**Fix:** Increase bottom offset for gbx-tts when bottom bar is visible, or add z-index layering.

---

### MOB-07 (P3): Mobile bottom bar hide-on-scroll threshold
**Severity:** P3
**Evidence:** The `aH()` function in enhancements.js hides the bottom bar when `acc > 40` (accumulated scroll delta). This means the bar hides after scrolling down ~40px and shows after scrolling up ~40px. This may be too aggressive on mobile where small scrolls are common.

**Impact:** Bottom bar flickers on small scrolls.

**Fix:** Increase threshold to 60-80px for more stable behavior.

---

### MOB-08 (P2): Nagornaya font buttons still need data-fc-action
**Severity:** P2
**Evidence:** Nagornaya font buttons use `id="nagFontDec"` / `id="nagFontInc"` with `class="nag-fontsize-btn"`. The fc-controller handles `data-fc-action="font-down"` / `data-fc-action="font-up"`. These selectors don't match.

**Status:** FIXED in production (arena-agent-2 confirmed: production has `data-fontsize="down"` and `class="nag-fontsize-btn nag-fontsize-down"`). But source repo still has the old markup.

**Impact:** Source repo has broken font controls; production works.

---

## 3. MOBILE POSITIVE FINDINGS

### ✅ Safe area insets properly used
- Bottom bars use `env(safe-area-inset-bottom)`
- TOC panels use `env(safe-area-inset-bottom)`
- Right-positioned elements use `env(safe-area-inset-right)`

### ✅ Touch targets 44px minimum enforced
- `mobile-hotfix.css` enforces 44px minimum for interactive elements on touch devices
- `@media (pointer:coarse)` rules apply

### ✅ Mobile bottom bar hide-on-scroll implemented
- `gbs2-hide` class toggles on scroll direction
- Bottom bar hides when scrolling down, shows when scrolling up
- Mobile head also hides on scroll

### ✅ gbs2-bbar click handler works
- `enhancements.js` handles `gbs2Bbar` click → opens gbs2-sheet
- `data-gbs2-close` handles close
- Escape key closes sheet

### ✅ Resume reading feature
- Saves scroll position in localStorage
- Shows "Вы здесь были" toast on return
- "Продолжить" button scrolls to saved position

### ✅ Image error handling
- Graceful fallback for broken images
- Shows Roman numeral placeholder for series thumbnails

---

## 4. PREMIUM CONTROLS READINESS (from PDF plan)

### Current State vs Plan

| Requirement | Status | Notes |
|---|---|---|---|
| PremiumControlAnchor component | ❌ Not created | Plan says create in src/components/premium-controls/ |
| PremiumControls component | ❌ Not created | Plan says create with variant support |
| premium-controls-controller.js | ❌ Not created | Plan says create canonical controller |
| CSS token system (--pc-*) | ❌ Not created | Plan says create --pc-control-size, --pc-gap, etc. |
| Route archetype mapping | ✅ Exists | page-ownership.json has route types |
| Visual parity gate | ✅ Exists | But not CI-blocking |
| Playwright smoke tests | ⚠️ Partial | Some exist, need expansion |

### Archetype Coverage

| Archetype | Routes | PremiumControls Variant | Status |
|---|---|---|---|
| article-breadcrumb | Hermeneutics, Kod, etc. | single-anchor | ❌ Not implemented |
| series-lite-breadcrumb | Baptisty articles | series-lite | ❌ Not implemented |
| gill-rail | Gill Part1-3, Context, Spravochnik | rail + mobile-bottom | ❌ Not implemented |
| landing-none | Home, About, catalogs, landings | none | ✅ Correct (no controls) |
| app-disabled | Karty, Map, Rodosloviye, 3D baptizm | disabled | ✅ Correct (no controls) |

---

## 5. RECOMMENDATIONS

### Immediate (P2)
1. Add `touch-action: manipulation` to floating-cluster.css interactive elements
2. Add `-webkit-tap-highlight-color: transparent` to buttons
3. Add `overscroll-behavior: contain` to overlays
4. Fix gbx-tts overlay overlap with gbs2 bottom bar

### Short-term (P3)
5. Add missing v16 CSS variables to production
6. Add kbd-help component for desktop
7. Increase mobile bottom bar hide-on-scroll threshold
8. Sync source repo Nagornaya font buttons with production

### PremiumControls Rollout (from PDF plan)
9. Create PremiumControlAnchor component
10. Create PremiumControls component with variant support
11. Create premium-controls-controller.js
12. Create CSS token system (--pc-*)
13. Implement article-breadcrumb archetype (Hermeneutics pilot)
14. Implement gill-rail archetype (Gill pilot)
15. Add Playwright smoke tests for mobile

---

## 6. VERIFICATION OF EXISTING MOBILE BUGS

| Bug | Agent | My Verdict | Evidence |
|---|---|---|---|
| gbx-tts blocks gbs2-theme | arena-agent-2 | ✅ CONFIRMED | CSS shows overlap potential |
| Nagornaya font selectors | arena-agent-2 | ✅ CONFIRMED (source) | Source has wrong selectors |
| Gill mobile-bottom-bar | arena-agent-2 | ✅ CONFIRMED | enhancements.js handles gbs2Bbar |
| Gill speed panel | arena-agent-2 | ✅ CONFIRMED | fc-controller handles play action |
| Mobile touch targets | mobile-hotfix.css | ✅ ENFORCED | 44px minimum via @media (pointer:coarse) |
