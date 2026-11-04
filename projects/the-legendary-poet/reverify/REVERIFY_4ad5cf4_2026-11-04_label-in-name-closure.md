# The Legendary Poet — label-in-name closure at current main

- Finding: `SYS-TLP-LABEL-IN-NAME-GUARD-COVERAGE` (P2, WCAG 2.5.3).
- Verification date: 2026-11-04.
- Source authority: `FedorMilovanov/TheLegendaryPoet`.
- Original repair: [Product PR #549](https://github.com/FedorMilovanov/TheLegendaryPoet/pull/549), exact reviewed PR head `8fcbfc709d1714d4827f02f817c30f470abaadc8`, squash-merged at `c1beee3b7bcaa3a0d47fbc8e5bbf79f4da6efed4` (2026-11-03T21:09:29Z).
- Fresh result-main witness: `4ad5cf4bd6cff3f4679dbf0beb21bbd2234b6848`, after independently merged Browser QA readiness PR #553.

## Causal repair and retained controls

The previous Home `HeroPoetWindow` links and four `FeaturedTrackPlayer` volume buttons replaced visible labels with incomplete `aria-label` values. #549 repairs the two owning components, instead of changing a generic role or reducing accessibility assertions. Portrait accessible names now contain the displayed poet name and lifetime dates plus the action; music button accessible names contain the same displayed live volume percent. Mute, unmute and Home/End volume changes remain covered by behavioral tests.

Reviewed current-source guard files: `qa/focused-interactions.spec.mjs` (six canonical Home poets at desktop/touch viewport and four published music routes, including percentage updates); `qa/mobile-platforms.spec.mjs` (Android/iPhone touch activation and link identity); `qa/theme-contrast.spec.mjs` (visible dates retained in portrait-link accessible name across themes/viewport classes). Their checks assert the complete accessible name, not a permissive substring or a removed `aria-label`.

**Independent current-main local reproduction (2026-11-04):** immutable Product `main@4ad5cf4` in a separate worktree, production Vite build PASS; Chromium `qa/focused-interactions.spec.mjs` visible-label suite **2/2 PASS** (six Home portraits across desktop/touch widths and four music routes including live percentage), Android Pixel 7 plus iPhone Safari `qa/mobile-platforms.spec.mjs` **2/2 PASS** (real mobile routing and complete name/dates). All four tests ran against the locally built unmodified main source. No assertion was relaxed.

## Exact-result release evidence

| Gate on Product main `4ad5cf4` | Result / reproducible source |
| --- | --- |
| CI | SUCCESS; [run 41728806405](https://github.com/FedorMilovanov/TheLegendaryPoet/actions/runs/41728806405) |
| Full Manual Browser QA | SUCCESS; [run 41728806631](https://github.com/FedorMilovanov/TheLegendaryPoet/actions/runs/41728806631) |
| Chromium/Android browser-qa | SUCCESS in the main Browser QA run |
| Premium Home | SUCCESS in the same run |
| iPhone Safari critical QA | SUCCESS in the same run |
| WebKit home reveal | SUCCESS in the same run |
| Analytics-route QA | SUCCESS in the same run |
| GitHub Pages deploy | SUCCESS; [run 41728806845](https://github.com/FedorMilovanov/TheLegendaryPoet/actions/runs/41728806845) |
| Route integrity, brand checks, project contracts, secret scanning | SUCCESS on exact main SHA |
| Public site transport | `https://thelegendarypoet.ru/poets/` answered HTTP 200 on 2026-11-04; HTTP 200 alone is not byte-identical production proof |

## Disposition and limits

CLOSE **only** `SYS-TLP-LABEL-IN-NAME-GUARD-COVERAGE` as fixed and verified on the resulting source main. This finding ceases to be an active Product defect: the two owning components and their browser regressions were certified without changing thresholds or suppressing tests. The same repair must not be misused to close unrelated global contrast, modal exit, sticky geometry, fragment navigation, portrait pointer hit-testing, text spacing or human Turnstile proof.

AuditRepo active count changes **9 -> 8**: **1 P1 + 6 P2 + 1 P3**. This is not a claim of a full zero or of fresh provider/production analytics certification.