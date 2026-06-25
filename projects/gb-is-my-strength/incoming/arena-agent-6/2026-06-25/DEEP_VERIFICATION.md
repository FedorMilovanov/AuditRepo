# DEEP VERIFICATION — Agent Cross-Check + v16 Probe + Build System
**Agent:** arena-agent-6
**Date:** 2026-06-25
**Method:** Source code analysis, agent report verification, v16 probe comparison

---

## 1. AGENT FINDINGS VERIFICATION

### arena-agent-2: gbx-tts overlay blocks gbs2-theme (MOB-06)
**Status:** ✅ CONFIRMED
**Evidence:**
- `gbx-tts` becomes visible after 1200ms via JS
- baptisty pages do NOT have `has-bottom-bar` class
- CSS rule `body.has-bottom-bar .gbx-tts { bottom: calc(64px + ...) }` doesn't apply
- gbx-tts stays at `bottom: max(24px, ...)` → overlaps gbs2 bottom bar
- `elementFromPoint` returns `.gbx-tts` instead of `data-gbs2-theme` button

### reverify-1: baptisty theme click does NOTHING (P1-14)
**Status:** ⚠️ PARTIALLY CORRECT — wrong root cause
**Correction:**
- reverify-1 said "P1-14 confirmed at runtime level — theme click does NOTHING"
- BUT `enhancements.js` DOES wire `data-gbs2-theme` buttons (confirmed in code)
- The real issue is CSS overlay (gbx-tts blocks click), NOT JS wiring
- So P1-14 is FALSE POSITIVE for JS wiring, but MOB-06 is CONFIRMED for CSS overlay

### reverify-1: P3-8 FAQ accordion is FALSE POSITIVE
**Status:** ✅ CONFIRMED
**Evidence:** `site.js` contains bundled faq-accordion logic. Playwright confirms buttons toggle `aria-expanded`.

### arena-agent-2: Nagornaya font selectors fixed
**Status:** ✅ CONFIRMED (production), ⚠️ SOURCE STILL BROKEN
**Evidence:**
- Production has `data-fontsize="down"` and `class="nag-fontsize-btn nag-fontsize-down"`
- Source repo still has old markup without these attributes
- This is source-production drift

---

## 2. v16 PROBE vs PRODUCTION COMPARISON

### Features in v16 probe but NOT in production:

| Feature | Description | Impact |
|---|---|---|
| kbd-help | Keyboard shortcuts help popup | Missing UX feature |
| gb-ease-smooth | Smooth easing animation | Slightly different animation feel |
| gb-ease-soft | Soft easing animation | Slightly different animation feel |
| gb-canvas | Canvas color variable | Uses --color-canvas instead |

### Features in BOTH v16 probe and production:

| Feature | Status |
|---|---|
| toc-sheet__actions | ✅ Present |
| gbs-rail-foot__btn--text | ✅ Present |
| toc-action-btn | ✅ Present |
| gb-icon | ✅ Present |
| gb-save | ✅ Present |
| gb-ember | ✅ Present |
| gb-floater | ✅ Present |
| toc-overlay | ✅ Present |
| toc-sheet | ✅ Present |
| gbs-rail | ✅ Present |
| gbs-rail-foot | ✅ Present |
| gb-toast | ✅ Present |

---

## 3. BUILD SYSTEM ANALYSIS

### Status
- Node >= 22.12.0 required
- 14 devDependencies, 0 dependencies
- Astro 5 with MDX, Sitemap, React integrations
- Strangler pattern: astro:build + copy-legacy-to-dist.js

### Key Scripts
- `strangler:build:production-like` — main production build
- `validate:static-publication` — comprehensive validation gate
- `visual:parity:production` — visual regression (NOT CI-blocking)

---

## 4. MOBILE TYPOGRAPHY

### Font Size
- Body: `clamp(16px, calc(14px + .5vw), 18px)` — responsive, good
- Minimum: 16px on small screens
- Maximum: 18px on large screens

### Line Height
- Body: 1.75 — good for readability

### Hyphenation
- Body: `hyphens: auto` — Russian text hyphenation enabled
- Links/buttons: `hyphens: none` — correct

---

## 5. CORRECTED BUG COUNT

### Bugs confirmed by this verification:
| Bug | Previous Status | Corrected Status |
|---|---|---|
| P1-13 | FALSE POSITIVE | ✅ Still FALSE POSITIVE |
| P1-14 | FALSE POSITIVE | ✅ Still FALSE POSITIVE (JS wiring works, CSS overlay is MOB-06) |
| MOB-06 | P2 | ✅ CONFIRMED (gbx-tts overlay blocks buttons) |
| V2-2 | P2 | ✅ CONFIRMED (source repo still broken, production fixed) |
| P3-8 | FALSE POSITIVE | ✅ Still FALSE POSITIVE |

### Final bug count (all sessions):
- **Total bugs found:** 28 (20 general + 8 mobile)
- **False positives closed:** 5 (P0-NEW, P0-3, P1-13, P1-14, P3-8)
- **Net confirmed bugs:** 23
