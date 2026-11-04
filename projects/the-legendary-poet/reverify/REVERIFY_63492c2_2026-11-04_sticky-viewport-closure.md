# The Legendary Poet — sticky viewport geometry P2, conditional closure

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
- At initial preparation Product `main@63492c2` CI, Page deployment, content/contracts/routes/security/brand checks SUCCESS. **Resulting-main Manual Browser QA [run 41768798264](https://github.com/FedorMilovanov/TheLegendaryPoet/actions/runs/41768798264) was still IN PROGRESS**. Its five jobs MUST finish SUCCESS on this exact SHA before retiring this root in AuditRepo.
- An optional Pages report job may SKIP without invalidating the successful build/deployment. Do not lower any browser gates or substitute local QA for resulting-main verification.

## Conditional scoped disposition
Only after exact Product resulting-main Browser QA SUCCESS, the AuditRepo matrix may retire **only** `SYS-TLP-STICKY-VIEWPORT-GEOMETRY`: from **1 P1 + 4 P2 + 0 P3 = 5** to **1 P1 + 3 P2 + 0 P3 = 4**. The independent P2 roots for fragment navigation, semantic contrast and text spacing, and the human-only Turnstile P1 remain open. Require AuditRepo exact-head `validate` and `preflight` before squash merge.
