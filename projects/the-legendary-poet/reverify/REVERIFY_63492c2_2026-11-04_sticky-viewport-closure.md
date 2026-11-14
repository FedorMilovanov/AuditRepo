# The Legendary Poet — sticky viewport geometry P2, release-certified closure

Date: 2026-11-04. Finding: `SYS-TLP-STICKY-VIEWPORT-GEOMETRY` (P2).

## Confirmed original issue
Prior full-route Chromium audit found 18/106 essay TOC controls inaccessible to native pointer activation, nine missed in-content author/Kindred/Ratings pointer controls, and 62/272 PoemQuickNav pointer failures on desktop. Keyboard activation remained usable. The shared sticky surfaces overflowed actual viewport height and the sticky Ratings table header could overlap its body rows.

## Product fix actually merged
- [Product PR #552](https://github.com/FedorMilovanov/TheLegendaryPoet/pull/552) head `228db3daa53fbc4ee53e65244419286971602d7a`, squash merged 2026-11-04T03:42:44Z to `main@63492c2d0baefe6a952a93cdf0045ee182463540`.
- PR head Git tree equals resulting main Git tree: `d8c6c7dbf9162ce03cbbd44920f95ccd69c6249f`.
- Shared CSS and page owners now keep desktop sticky TOC/poet sidebars viewport-contained with accessible overflow, preserve document scroll chaining and keyboard focus visibility, and prevent the Ratings table header covering rows.
- Permanent behavioral tests: `qa/reader-sticky-viewport.spec.mjs`, additions in `qa/mobile-platforms.spec.mjs` and `qa/premium-reader-certification.spec.mjs`.

## Verified evidence, with an explicit release boundary
- The exact PR head has **14/14 required GitHub checks SUCCESS**, including `browser-qa`, `verify`, and `merge-certification`; no unresolved review threads, no conflicts, behind=0 at merge.
- Local post-merge integration with subsequently rebased Product PR #555: **56/56 actual browser scenarios PASS**, Chromium desktop and Android Pixel 7, covering all 10 poet sidebars, all 10 essay TOCs/source links, pointer reachability, focus and scroll chaining, viewport-restricted sidebars, Ratings rows and fragment/source navigation. This is a local integration witness, not claiming completed post-merge main CI.
- Resulting Product `main@63492c2d0baefe6a952a93cdf0045ee182463540`: CI [41768798242](https://github.com/FedorMilovanov/TheLegendaryPoet/actions/runs/41768798242), Pages [41768798239](https://github.com/FedorMilovanov/TheLegendaryPoet/actions/runs/41768798239), content/contracts/routes/security/brand checks all SUCCESS. [Manual Browser QA 41768798264](https://github.com/FedorMilovanov/TheLegendaryPoet/actions/runs/41768798264), **attempt 2**, completed SUCCESS: **all five jobs SUCCESS** (browser-qa Chromium/Android/iPhone Safari; premium-home-qa; webkit-home-reveal-qa; premium-iphone-critical-qa; analytics-route-qa). The run head is this exact Product main SHA.
- Transparency: the first resulting-main browser attempt had failed the separate pre-existing iPhone Safari `qa/reader-journeys.spec.mjs:549` immersive modal normal-motion exit timing witness, which passed on retry but still correctly failed zero-flaky CI. GitHub re-ran the exact failed job without changing code or test thresholds; attempt 2 then completed SUCCESS. This does not establish that the unrelated flaky modal motion is fixed or permit altering its guard. Pages optional report SKIP does not invalidate successful build/deploy.

## Completed exact-main release gate and scoped disposition
Because exact resulting-main Browser QA and release gates now completed SUCCESS, retire **only** `SYS-TLP-STICKY-VIEWPORT-GEOMETRY`: from **1 P1 + 4 P2 + 0 P3 = 5** to **1 P1 + 3 P2 + 0 P3 = 4**. The independent P2 roots for fragment navigation, semantic contrast and text spacing, and the human-only Turnstile P1 remain open. AuditRepo exact-head `validate` and `preflight` must pass again on this updated documentation head before squash merge.
