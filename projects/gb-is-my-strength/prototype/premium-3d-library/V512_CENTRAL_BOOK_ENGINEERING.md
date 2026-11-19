# Premium 3D Library — V5.12: a physically oriented central reading book

**Date:** 2026-11-09. **PR:** [AuditRepo #545](https://github.com/FedorMilovanov/AuditRepo/pull/545).
**Base HEAD:** `b2f02a444296020194e5620055f20e02d34c09d0`.
**Release decision:** LAB / DRAFT / ART HOLD, not merged into Product or AuditRepo main.

## Problem and exact intervention

The central reader in `src/scene/Center.tsx` previously combined a horizontal wooden cover with **unrotated XY `planeGeometry` pages**. As a result, both pages stood upright like signs while the underlying wooden book was placed on the table. The apparent page orientation could be seen clearly in matched Chrome/WebKit screenshots. This was a real 3D-layout defect, not a texture or color problem.

V5.12 changes only this exhibit:

- Both textured page planes now lie within the physical plane of the cover (`rotation-x=-π/2` on each page).
- The existing cover, page textures, and center-spine alignment are tilted as **one book object** (`rotation-x=0.35`, center `y=1.95`): its near edge is just above the tabletop and its rear edge is raised like a lectern. The book remains oriented toward the visitor's entry at +Z.
- Two restrained wooden structural supports bear the rear of the elevated volume. There are no new emissive effects, fantasy geometry, changes to paper content, or interaction changes.
- The left/right title-page `CanvasTexture` resources are manually allocated and now explicitly disposed when the central exhibit unmounts, avoiding orphaned texture lifetime across scene teardown/recreation.

No gameplay movement, collision, 3D tour, player camera, sitemap, quality transition, XR, data registry, cabinet, Product or Research code changes.

## Real before/after review

Viewpoints were reached through the application's public **Войти в библиотеку** CTA, with `prefers-reduced-motion: reduce`, fixed viewport, DPR=1, and the normal camera. No debugging teleport, renderer injection, screenshot generation, or direct store mutation.

- [Desktop Chrome before/after — zoomed contact sheet](evidence/central-book-v512-desktop-before-after.jpg).
- [Chrome desktop 1440×900 before](evidence/central-book-v512-chromium-1440x900-before.webp) and [after](evidence/central-book-v512-chromium-1440x900-after.webp).
- [Chrome portrait touch 390×844 before](evidence/central-book-v512-chromium-390x844-before.webp) and [after](evidence/central-book-v512-chromium-390x844-after.webp).
- [Playwright WebKit desktop before](evidence/central-book-v512-webkit-1440x900-before.webp) and [after](evidence/central-book-v512-webkit-1440x900-after.webp).
- [Playwright WebKit portrait touch before](evidence/central-book-v512-webkit-390x844-before.webp) and [after](evidence/central-book-v512-webkit-390x844-after.webp).

All eight full-viewport screenshots are original real browser captures, losslessly transcoded from PNG to WebP and checked for **pixel-identical decoded RGB**. Hashes and exact dimensions are in [the scoped evidence registry](evidence/central-book-v512-evidence.json). The contact sheet is a cropped comparison for human review, not a replacement for the full-resolution witnesses.

The review confirms **the pages no longer visually stand upright**; the inclined volume now reads as an open book rather than two sign panels. This is a narrow visual acceptance of a geometry defect, **not** a claim that the full hall is photorealistic or release-ready.

## Source-owned automated witness

The new `tests/central-book-browser.py` renders the built application and records four browser/viewport cases: Chrome/WebKit on 1440×900 desktop and 390×844 emulated touch. It checks HTTP 200, normal CTA passage, WebGL2 availability, viewport dimensions, absence of horizontal page overflow, JavaScript exceptions and failed resource responses; then captures the full-viewport screenshot.

Run after `npm run build` with a server hosting its `dist/`:

```sh
GB_LIBRARY_TEST_URL=http://127.0.0.1:18773/ python tests/central-book-browser.py
```

**Source-owned test caveat:** a screenshot's existence is not an automated geometry certificate. Human review of the matched before/after image is still required for page orientation, contact and believability. The test never certifies physical iPhone, Safari GPU timing, VR or content rights.

## Independent regression gates

Before commit, run strict TypeScript, Vite production build, five existing lab commands, and browser tests for the central book, architectural art, mobile HUD, reference bay and 12-scenario map/introduction interaction matrix. Preserve evidence of any failure rather than replacing it with a claimed PASS. The expected matrix is **4 + 4 + 6 + 5 + 12 = 31 independent browser scenarios**.

## Remain-open stop-ship decisions

The one-book fix does not solve the larger architecture quality gate (coherent GLB/PBR furniture throughout the hall), verified Product content and rights, physical Android/Safari/VR hardware performance, long initial quality-switch stalls, or Product integration. The static generated concept reference is an art target only, not proof of a runtime.

**Keep the existing #545 DRAFT / LAB / ART HOLD. Do not merge or deploy.**
