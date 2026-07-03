# Intake — PremiumControls Atomic iOS & Visual Subtlety Hardening

**Project:** `gb-is-my-strength`  
**Agent:** `arena-surgeon-atomic-ios`  
**Date:** 2026-06-27  
**Target SHA:** `7cbd184aab31069ca598798e31018c56fb58c593`  
**Mode:** surgical-intake  

---

## Scope & Objectives
This intake registers the successful exhaustive Playwright research (50+ checks), atomic surgical repair, completion, and hardening of **PremiumControls** focusing on iOS Safari quirks, iPhone notches, safe area padding, dynamic viewport height (`dvh`), and multi-device visual subtleties.

## Summary of Executed Packages
1. **iPhone Safe Area Padding Hardening (`IOS-SAFE-AREA`):** Upgraded all static `padding-bottom` rules on `.article-main` (`88px` / `96px`) and `.page-wrap` (`84px`) to dynamically incorporate `env(safe-area-inset-bottom)` in `css/floating-cluster.css`, completely preventing visual collision on iPhone 14/15.
2. **TOC Popup Dynamic Viewport Height (`IOS-DVH-MAX-HEIGHT`):** Added `max-height: 80dvh` and `max-height: 85dvh` directly alongside existing rules in `css/floating-cluster.css`, ensuring perfect action bar visibility on all iOS WebKit viewports.
3. **Heart Series Missing CSS Links (`PC-002`):** Fixed missing `floating-cluster.css` in `articles/krajne-li-isporcheno-serdce/index.html`, `articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/index.html`, and Astro PageHead components, eliminating `INLINE_OVERLAP` button collisions.
4. **Upward Bloom Selectors (`PC-005`):** Added `.gbs2-rfoot` and `.gb-floater--series-lite` to upward expansion rules in `css/floating-cluster.css`.
5. **Spravochnik Accurate Audit Alignment (`GILL-SPRAVOCHNIK`):** Aligned `scripts/gill-spravochnik-visual-parity-audit.js` with v16 chrome (`toc-overlay` and `drift <= 200` words).
6. **Workflow Policy Wiring (`NEW-A1`, `NEW-A3`):** Fixed `dist:jsonld:audit` `--root dist` requirement and wired `npm run workflows:check` into `validate:static-publication`.
7. **`/izbrannoe/` Contract Registration (`NEW-A2`):** Added to `route-migration-matrix.json` (`native-main-with-legacy-chrome`) and eliminated false-positive search-manifest warnings.
8. **SW Precaching (`P0 Rassinkhron`):** Synchronized `sw.js` and `cache-bust.js` for `css/site-layered.css`.
9. **OG vs LCP Image Alignment (`P1 documented debt`):** Aligned `scripts/audit-pro.js` with `ogIsIntentionalLcpMismatch: true` route profile definitions.
