# Premium 3D Library — V5.8 interaction repairs

**Date:** 2026-11-09. **Scope:** AuditRepo PR #545, existing `lane/gb-premium-3d-library-lab-20261108` only.
**Starting SHA:** `df303c7f620ee63534baa0f9e9d28f38360701fd`.
**Status:** **LAB / DRAFT / ART HOLD**. No Product or `main` merge; this fixes two interaction blockers, not the remaining visual and device gates.

## What was failing

The 2026-11-09 [V5.7 evidence-based control audit](QA_V57_CONTROL_VISUAL_AUDIT.md) found two independent problems:

- **P0:** On mobile 844×390, the entry CTA began below the 390-pixel viewport and the fixed intro had no scroll. Standard browser click was impossible. The same risk existed in other short landscape viewports.
- **P1:** The sitemap was a visual overlay, not an accessible modal. Opening it left the active element outside the panel; ten initial Tabs traversed the obscured 3D HUD. Close/search lacked accessible names. Touch WebKit did not reliably focus the opener button, and desktop WebKit could skip buttons in native Tab navigation.

## Source-owned implementation

Only `src/ui/Overlay.tsx` is modified.

1. Intro changes from a non-scrollable fixed flex layer to a height-independent scroll container with `overflow-y-auto`, `overscroll-y-contain`, non-shrinking header/main, a minimum spacing gap and iOS-safe top/bottom padding. The overlay absorbs cover-stage input rather than leaking clicks into the WebGL canvas; the hall itself is untouched.
2. Sitemap dialog renders through `createPortal(..., document.body)` **outside `#root`**. While open, the 3D app root is `inert`, and the previous inert state is restored when closed. The portal avoids marking the dialog itself inert.
3. The `aside` has `role="dialog"`, `aria-modal="true"` and an accessible heading; search is explicitly labeled, and the close button receives an accessible name.
4. Opening focuses the search field before paint; Escape closes without triggering unrelated global 3D shortcuts. Tab and Shift+Tab advance through visible controls and wrap inside the dialog, including Windows Playwright WebKit's differing button focus behavior.
5. Focus is restored to the real opener, or to the logical intro/desktop/mobile sitemap action when touch WebKit did not focus the tapped button. No debug camera injection, direct Zustand writes or arbitrary timeout-based repairs.

No changes were made to content registry, shader/materials, WebXR, stations, navigation destination, sound, artwork, cabinet/progression data, quality controls or Product.

## Reproducible acceptance

Run against a production Vite build served from `dist`, not the source dev server:

```sh
npm run lab:check
npm run lab:catalog:test
npm run lab:cabinet:test
npm run lab:progression:test
npm run lab:cabinet:types
npx tsc --noEmit
npm run build
GB_LIBRARY_TEST_URL=http://127.0.0.1:18773/ python tests/interaction-regression-browser.py
GB_LIBRARY_TEST_URL=http://127.0.0.1:18773/ python tests/architectural-art-browser.py
GB_LIBRARY_TEST_URL=http://127.0.0.1:18773/ python tests/mobile-hud-browser.py
GB_LIBRARY_TEST_URL=http://127.0.0.1:18773/ python tests/reference-bay-browser.py
```

**Observed on local exact candidate:**

| Witness | Result |
| --- | --- |
| New P0/P1 user journey: Chrome 320×568, 390×844, 667×375, 736×414, 844×390, 932×430, 768×1024, 1440×900; WebKit 390×844, 667×375, 844×390, 1440×900 | **12/12 PASS** |
| Modal title, labels, root inert, 18× Tab and 18× Shift+Tab, Escape, focus restore, sitemap search empty result | **PASS in all 12 cases** |
| Real entry via normal Playwright click, no background app store mutation | **12/12 PASS** |
| Five original lab checks, strict TypeScript, Vite production build | **PASS** |
| Architecture art browser | **4/4 PASS** |
| Mobile HUD browser | **6/6 PASS** |
| Reference-bay fixed editor camera browser | **5/5 PASS** |

On Chrome touch 844×390, the intro has `clientHeight=390` and `scrollHeight=621`. A real mouse-wheel scroll (browser user-input event) moves its position to `scrollTop=231`, placing the CTA at `y=186..242`, fully within the screen. WebKit touch auto-scroll plus a real browser `click()` reaches the same action. These are desktop-device emulations, not physical-phone certification.

All browser scenarios above recorded zero JavaScript pageerrors or HTTP 4xx/5xx. Previous historical screenshots and reports remain unchanged.

## Verified visual evidence

- [Baseline V5.7 — entry inaccessible at 844×390](evidence/audit-v57/21-mobile-landscape-844x390-blocked-entry.webp)
- [V5.8 — Chrome landscape entry now visible after scrolling](evidence/interaction-v58-chrome-844x390-entry-visible.webp)
- [V5.8 — WebKit landscape entry now visible after auto-scroll](evidence/interaction-v58-webkit-844x390-entry-visible.webp)
- [V5.8 — Chrome landscape hall after real entry](evidence/interaction-v58-chrome-844x390-hall.webp)
- [V5.8 — Chrome desktop modal sitemap](evidence/interaction-v58-chrome-1440x900-dialog.webp)
- [V5.8 — WebKit mobile modal sitemap](evidence/interaction-v58-webkit-390x844-dialog.webp)

All five new screenshots are real Chromium/WebKit captures, stored as lossless WebP with **pixel-identical decoded RGB** to the browser PNG originals. Their SHA-256 / byte lengths are stored in the scoped [V58_INTERACTION_MANIFEST.json](V58_INTERACTION_MANIFEST.json).

## Remaining stop-ship gates

- The underlying 3D architecture still fails premium/fidelity art acceptance, especially beyond the one reference bay.
- Windows/WebKit desktop render performance, physical Safari/Android devices, GPU memory and XR headset reliability still require independent investigation.
- `src/data.ts` remains a demonstration fixture, not an approved Product registry; content rights, routes, noindex, Reader and local-cabinet migration are not signed off.
- Portrait/mobile composition and the temporary photo-mode transition need separate visual polish.
- An accessible dialog here is not a full WCAG certification: screen-reader testing on actual assistive technology is still required.

**Release decision: KEEP PR #545 DRAFT / LAB / ART HOLD.** This narrowly closes V5.7 P0/A-01 and P1/A-02, not the entire library's launch gates.
