# The Legendary Poet — WCAG 1.4.12 text-spacing P2, release-certified closure

Date: 2026-11-05 (Europe/Moscow). Scope: `SYS-TLP-TEXT-SPACING-ROBUSTNESS` only. Audit baseline: `AuditRepo main@90dfacc60204c787c450dc6916a6cb4bd5f931c0`. Product latest resulting main at verification: `d090892f62949d2fa7cfb9db4fa7984c60bd2745`.

## Original root and acceptance criteria

The 2026-10-24 34-route browser audit identified 15 newly clipped visible text instances at 1280×800 and 390×844 under the user-agent WCAG 1.4.12 overrides (line-height 1.5, paragraph margin-bottom 2em, letter spacing 0.12em, word spacing 0.16em). The affected owners were article excerpts, music descriptions, essay breadcrumbs, Kindred Spirits and Ratings labels/tags. The required fix was owner-specific wrapping/expansion, not global clipping removal or assertion suppression.

## Product fix and exact-head CI

- [Product PR #556](https://github.com/FedorMilovanov/TheLegendaryPoet/pull/556), exact head `50aabc1d0567e58e6cf0dad40c7b77d2d928a603`, merged to `main@b862ec307dae70186dde04f38e5e5d80f291bf7d`. The exact PR-head Git tree and the resulting merge's Git tree are identical: `36877da83d1af6406391deb6d6c7175199065c2e`.
- Repair: 14 stable `data-text-spacing-owner` markers across shared owner components and pages; remove inappropriate fixed width / truncation budgets only at the affected owners. Permanent `qa/text-spacing-robustness.spec.mjs` requires the owner census and a behavioral browser sweep over all sitemap plus utility routes, at 1280×800 and 390×844 with the four injected overrides; it checks newly clipped text, existing repaired-owner clipping, new document-width overflow, route availability and visible coverage.
- [Exact PR-head Manual Browser QA 41906646752](https://github.com/FedorMilovanov/TheLegendaryPoet/actions/runs/41906646752) **SUCCESS**: all five jobs SUCCESS; the main Chromium/Android command finished **524 passed** and the registered WCAG 1.4.12 suite **2 passed**; the fresh-process Safari runner completed all **18** isolated contours. PR-head CI, Brand Deep Audit, route audit, contracts, secret scan and merge certification also SUCCESS.

## Resulting-main release verification and cancellation transparency

- Initial post-merge `main@b862ec3`: [CI 41914395233](https://github.com/FedorMilovanov/TheLegendaryPoet/actions/runs/41914395233) SUCCESS and [GitHub Pages 41914395216](https://github.com/FedorMilovanov/TheLegendaryPoet/actions/runs/41914395216) SUCCESS. The associated [Manual Browser QA 41914395236](https://github.com/FedorMilovanov/TheLegendaryPoet/actions/runs/41914395236) was **CANCELLED** as main advanced; this run is **not** counted as release success.
- Independent editorial [PR #564](https://github.com/FedorMilovanov/TheLegendaryPoet/pull/564) subsequently advanced `main` to `d090892f62949d2fa7cfb9db4fa7984c60bd2745`, changing poem/registry data and `public/discovery-manifest.json`, not the spacing repair's component/test owners. The retained owner repair was certified again on this later exact main.
- **Terminal later-main proof** on `d090892f62949d2fa7cfb9db4fa7984c60bd2745`: [CI 41915846698](https://github.com/FedorMilovanov/TheLegendaryPoet/actions/runs/41915846698) SUCCESS, [GitHub Pages 41915846745](https://github.com/FedorMilovanov/TheLegendaryPoet/actions/runs/41915846745) SUCCESS, and [Manual Browser QA 41915846749](https://github.com/FedorMilovanov/TheLegendaryPoet/actions/runs/41915846749) **COMPLETED SUCCESS**, all five exact-main jobs SUCCESS (browser-qa Chromium/Android and fresh iPhone Safari; premium-home-qa; premium-iphone-critical-qa; webkit-home-reveal-qa; analytics-route-qa). The main browser job again completed the permanent WCAG 1.4.12 owner-and-route behavioral test successfully.
- No Product mutation or new browser rerun is needed for this audit-only retirement. No accessibility threshold, route inventory, test assertion or blocking gate was weakened.

## Disposition

Retire **only** `SYS-TLP-TEXT-SPACING-ROBUSTNESS` from the active matrix: **1 P1 + 2 P2 + 0 P3 = 3 → 1 P1 + 1 P2 + 0 P3 = 2**. The independent semantic contrast root `SYS-TLP-THEME-SEMANTIC-COVERAGE-RESIDUAL` is **not** retired on PR #557 while its exact-head QA and resulting-main release proof remain unfinished. The human-backed production Turnstile P1 `TLP-COMM-ABUSE-001` is unchanged; neither a synthetic challenge bypass nor false engineering zero is permitted.

AuditRepo closure becomes authoritative after the exact-head AuditRepo validation/preflight and merge of this documentary PR. Reopen only upon a new reproducible current Product regression in clipping or overflow under the four overrides.
