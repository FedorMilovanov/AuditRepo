# Premium 3D Library V5 — verified build and real-browser baseline

**2026-11-08. LAB-ACTIVE / DRAFT-ONLY.** Source/build/browser witness for the isolated AuditRepo experiment, not Product or a visually accepted release. AI-generated `reference/` art is not a running app screenshot.

## Reproducible checks — authorized isolated Windows browser

- `npm.cmd ci --no-audit --no-fund`: PASS (198 packages).
- `lab:check`, `lab:catalog:test`, `lab:cabinet:test`, `lab:progression:test`, `lab:cabinet:types`: PASS.
- `npx.cmd tsc --noEmit`: PASS, after ES2022 lib/target and dead-import cleanup. Strictness unchanged.
- `npm.cmd run build`: PASS, Vite 7.3.2, 946 modules. Forced single-file HTML was 8.16 MB; default now emits cacheable CSS/JS/fonts; >500KB chunks remain and need measured optimization.
- HTTP-served `dist/` in separate headless Chromium: desktop 1440×900 and mobile-emulated 390×844 with reduced motion. Cabinet, progression, 3D hall entered. No document horizontal overflow and no page errors observed. This is NOT WebKit/real device/VR/GPU FPS evidence.
- Initial 404s were only the missing favicon, while fonts and covers loaded 200. Explicit SVG favicon added; repeated desktop and mobile browser journeys reported **zero HTTP/console errors**.

## Content and safety boundary

Catalog adapter is only a fail-closed **projection of supplied, approved metadata**; it is NOT wired to current Product routes. The standalone hall still uses Arena demonstration fixtures. Cabinet IndexedDB is deliberately separate from Product GBReaderLibrary V3; there is no cloud account sync or editorial quotation approval.

## Real screenshots (not image-generation renders)

- Desktop 3D is still visibly schematic with simple room geometry, flat materials and visually dominant plaques/orbit graphics. **It does not meet photorealistic visual acceptance.**
- Mobile HUD wraps into several rows, has a large blank upper area, and joystick overlaps the instruction pill. Treat as open usability defect.
- Cabinet is readable, but route picker is a demo and not a source-owned live publication index.
- See `evidence/*` for real headless-browser screenshots taken on the same build.

## Stop-ship gates for any Product transfer

1. One high-fidelity 3D architectural bay: properly authored geometry, coherent PBR, quality UV, baked lighting, accessible contrast; owner side-by-side image approval at fixed viewport/camera.
2. Mobile HUD at 320/390/768: compact controls, no overlap, test focus and touch.
3. Real GPU/FPS/memory tests, WebGL context-recovery test, WebKit/low-tier Android where available, accessible 2D fallback.
4. Product-owned route/search registry projection with accurate publication/noindex/rights and Reader/GBReaderLibrary reuse.
5. Transparent personal data lifecycle (consent, export, deletion, origin isolation) and source-accurate quotations.
6. Product source, CI and live proof checked independently on an exact selected head. **Do not merge by standalone smoke alone.**

Next wave: fix mobile HUD and build one photographic-quality room segment before expanding area count or adding features.