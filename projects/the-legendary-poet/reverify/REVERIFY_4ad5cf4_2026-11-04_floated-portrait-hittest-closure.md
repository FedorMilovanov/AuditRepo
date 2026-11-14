# The Legendary Poet — floated documentary portrait hit-testing closure

Verification: 2026-11-04. Product source authority: FedorMilovanov/TheLegendaryPoet.

## Previously valid finding
- ID: `TLP-ESSAY-PORTRAIT-POINTER-HITTEST` (P2).
- October 2026 audit at older Product source reported 12 of 17 floated image buttons intercepted by later full-width paragraph hit boxes; 11 source links also failed native pointer activation. Keyboard opened lightboxes and the mobile sample had no equivalent fault.
- Original evidence: `../verification/2026-10-24-current-main-audit-reopen/REPORT.md`.

## Root already repaired in Product
- Product [PR #548](https://github.com/FedorMilovanov/TheLegendaryPoet/pull/548) was squash-merged 2026-11-03 as `010d23f28eb2aaf3695a5b73b2f59882538077d9`.
- The shared `src/components/essay/ArticleRenderer.tsx` image-float owner gained `relative z-10` for both left and right floats. This promotes the actual figure wrapper above later visually transparent text blocks, preserving editorial text wrapping instead of using pointer-events suppression or page-specific hacks.
- Exact unmodified current Product `main@4ad5cf4bd6cff3f4679dbf0beb21bbd2234b6848` retains the repair. No new Product patch is needed.

## Independent current-main browser proof (2026-11-04)
- Detached worktree from exact current Product main; clean `npm ci` and successful production `npm run build` (52 shipped image files validated).
- Browser against locally served production `dist`, Chromium desktop 1280×800, both normal (`no-preference`) and reduced (`reduce`) motion. Canonical essay list read from committed `public/sitemap.xml`, not manually reduced to earlier failing routes.
- All **10/10 published essays** visited. Current float census: `yesenin-kutezhi` 6, `sergei-yesenin-1921-1925` 2, `mayakovsky-before-revolution` 4, `mayakovsky-gromovoy` 2, `brik-case` 3; other five essays have no floated image buttons. **17 distinct controls** per motion profile.
- **34/34 actual Playwright pointer activations** opened a visible named lightbox; Escape detached the dialog before the next activation. **34/34 source-link pointer-actionability trials** succeeded; no intercepted pointer, missing dialog, or source-link failure occurred.
- Of 34 pre-action centre probes, 33 already resolved to the image button. One normal-motion probe of `yesenin-kutezhi` image #3 occurred at `y=-88` (outside the viewport after initial scroll stabilization), so `elementFromPoint` returned null. The subsequent native browser click scrolled into view and successfully opened/closed the lightbox. This is not evidence of prose interception and was not counted as a failing pointer action.
- The original independent October mobile check covered 8/8 samples; this **new** witness is explicitly desktop, with both motion profiles. It does not claim a fresh mobile recheck or direct byte identity of the custom production domain.
- Product resulting-main workflows all SUCCESS: [CI 41728806405](https://github.com/FedorMilovanov/TheLegendaryPoet/actions/runs/41728806405), [Manual Browser QA 41728806631](https://github.com/FedorMilovanov/TheLegendaryPoet/actions/runs/41728806631), [Pages deploy 41728806845](https://github.com/FedorMilovanov/TheLegendaryPoet/actions/runs/41728806845).

## Disposition
**RETIRED — already fixed by Product #548, independently reverified on current main.** Only `TLP-ESSAY-PORTRAIT-POINTER-HITTEST` leaves the active AuditRepo matrix. Counts: 1 P1 + 6 P2 + 1 P3 = 8 become **1 P1 + 5 P2 + 1 P3 = 7**.

No claim is made for modal-exit, sticky-sidebar geometry, fragment/hash navigation, global contrast, text-spacing robustness, document outline or human Turnstile certification. Those remain independent until exact resulting-main evidence.