# V23 verified QA and costly historical regression warnings

## Actual standalone finding fixed in V23

V22 allowed keyboard focus into visually collapsing H2 descendants. Measured at ~40ms: toggle aria-expanded=false while children still had hidden=false AND inert=false. V23 animateBranch(panel,open) applies inert=true and aria-hidden=true immediately on closing, then completes height animation; opening restores both. Interrupting and reversing uses the current measured height, detaches stale WAAPI completion callbacks, and cleans overflow. This is an autonomous HTML fix; Product integration must use the existing scroll/focus owners.

## Current targeted run, 2026-11-06

**141/141 checks passed** in headless Chromium /usr/bin/chromium at 320×640, 390×844, 780×900, 781×480, 900×300, 900×480, 1024×768, 1280×800, 1480×900, 1920×1080. Confirmed root overflow absent, no duplicate DOM IDs, no page JS exceptions, theme/cycle/article mode switching, vertical right action geometry, anchored settings viewport bounds, Escape, compact rail inert/aria, and fast accordion reversal (four toggle directions). One initial test used wrong selector #topSearch vs real #headerSiteSearch, giving 14 HARNESS false negatives; corrected selector yields 141/141. Do not report the initial harness error as a UI defect.

**NOT VERIFIED:** Actual Astro CI/site, WebKit, Firefox, native iOS, genuine GBSearch results, TTS audio, saved user library, localStorage reload under real origin, print output, deployment/release identity. Standalone demo passages are NOT real article prose.

## Historical regressions to prevent

- Reader geometry/WebKit: commit 24298e66c0fc restored viewport-centred axis after +334px overflow from percentage canvas: https://github.com/FedorMilovanov/gb-is-my-strength/commit/24298e66c0fc64bdb180fbaf72917844b387a825
- Gill pre-v16 submenu forensic restoration: commits 586904ebd5a5 and f5cb271ce518; don't erase original submenu/rounded frame/anchors: https://github.com/FedorMilovanov/gb-is-my-strength/commit/586904ebd5a5d9df09946f14504264923e0cdaa5
- Gill #sec-gill-last-pages disappeared during "dedup", failing deploy; commit 7b140024a683 restored H3 and partToc entry: https://github.com/FedorMilovanov/gb-is-my-strength/commit/7b140024a683182a118d40014f913e5e9d7e4336
- Duplicate shared search overlay owner/focus trap fixed at fbbc9510677a; close/open focus race fixed b3812e8fee6f and WebKit delayed drop e09a6bbefab8: https://github.com/FedorMilovanov/gb-is-my-strength/commit/fbbc9510677a2efd8b682a1d7caa2ac09406e623
- Hidden speed rail in SSR focus order fixed at 36ab77b443a1: https://github.com/FedorMilovanov/gb-is-my-strength/commit/36ab77b443a1c709ca54ba6b845dfe28cabceeae
- Mobile toolbar second scroll owner fixed af90af3bc3fc: https://github.com/FedorMilovanov/gb-is-my-strength/commit/af90af3bc3fcd56dc36753781d3767b6cd6a9ae2
- Full-document/legacy visual parity rollback b782f9f4594c and accidental deletion of unique CSS at 58fccd2b8925: https://github.com/FedorMilovanov/gb-is-my-strength/commit/b782f9f4594c558600f33b59df5b42f0529731dc
- Existing themed series contract was established at 024bf1225e79; do not duplicate: https://github.com/FedorMilovanov/gb-is-my-strength/commit/024bf1225e7950aeba3473ea6b2d115dcf19ebec

Product regression scripts: scripts/engine-sweep.mjs, scripts/check-engine-contracts.js, scripts/gill-pre-v16-submenu-regression-audit.js; docs/SERIES-ENGINE-GUIDE.md. Recheck HEAD as these paths may evolve.