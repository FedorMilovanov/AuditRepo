# The Legendary Poet — fragment navigation P2, release-certified closure

Date: 2026-11-04. Scope: `SYS-TLP-FRAGMENT-NAVIGATION-RUNTIME` only. Audit source baseline: `AuditRepo main@02f07bbcd36479842ecc2d2ffec981b34a178910`. Product terminal evidence: `FedorMilovanov/TheLegendaryPoet main@185c900686bacf95ef3d73dbdb373d077a9a205f`.

## Original root and source contract

The October 2026 verified Product audit found two independently reproducible classes of broken fragment identity/layout: activating a citation repeatedly after filtering its source kept the same hash but failed to reveal the source because `hashchange` is not dispatched on a same-hash click; normal-motion native TOC anchors drifted behind or above the header as lazily-sized essay figures and translated section headings changed layout after native scrolling. The active row also recorded historical PoemQuickNav identity failures; the Product #555 review correctly distinguishes their earlier repair in #548 from the final source/section owners fixed here.

## Product change and exact-head evidence

- Product [PR #555](https://github.com/FedorMilovanov/TheLegendaryPoet/pull/555) source head `be198d6f6dd7c5d903a66fe3b92ce343a6b1549c` squash-merged into `main@185c900686bacf95ef3d73dbdb373d077a9a205f` on 2026-11-04. Merge outcome `merged=true`.
- Exact PR head and resulting main have identical Git tree `58951b24740ae52f877c9f33644d6cfcf15c88ca`. The merged source is the tested source, not a divergent composition.
- `src/essay-motion.css`: remove false 720px `contain-intrinsic-size` estimate from offscreen essay figures; preserve natural layout. `src/components/essay/ArticleRenderer.tsx`: section anchor Reveal does not translate the target. `src/components/essay/SourceLibrary.tsx`: same-hash citation activation reveals the currently filtered source without replacing native URL/history behavior.
- Permanent test `qa/fragment-navigation.spec.mjs` is explicitly registered in the main Chromium/Android Playwright command and in isolated iPhone Safari runner, with matching `playwright.config.mjs` project selection. Includes section settled geometry, native back/forward, same-hash citation reactivation, and fresh deep links.
- Product PR owner evidence: 126/126 native desktop TOC activations across ten essays, and 9/9 permanent fragment tests across Chromium, Android Pixel 7, iPhone Safari on the isolated source. Before fix, Yesenin II section 03 consistently landed at negative viewport y in normal motion; after repair its settled location was near y96.4. This is a supporting local witness, not substituted for CI.

## Final exact-source release certification

- Source PR #555 [checks](https://github.com/FedorMilovanov/TheLegendaryPoet/pull/555/checks) at exact head: all **17 applicable checks SUCCESS**, three conditional jobs correctly SKIPPED. `verify` and `merge-certification` SUCCESS; all five Manual Browser QA jobs SUCCESS. There were zero unresolved review threads and the PR was zero commits behind Product main at merge.
- Resulting Product main `185c900686bacf95ef3d73dbdb373d077a9a205f`: [CI 41859279351](https://github.com/FedorMilovanov/TheLegendaryPoet/actions/runs/41859279351) SUCCESS, [GitHub Pages 41859279533](https://github.com/FedorMilovanov/TheLegendaryPoet/actions/runs/41859279533) SUCCESS (build and deploy successful), and full [Manual Browser QA 41859279503](https://github.com/FedorMilovanov/TheLegendaryPoet/actions/runs/41859279503) **COMPLETED SUCCESS** at 2026-11-04T16:23:53Z on the identical exact main SHA: browser-qa (Chromium/Android/isolated iPhone Safari), premium-home-qa, premium-iphone-critical-qa, webkit-home-reveal-qa and analytics-route-qa all SUCCESS. Resulting-main route, brand, contracts, security checks also passed.
- No PR or Product main change was made for this AuditRepo documentation transaction. No failing gate was suppressed, no forced merge, and no QA threshold was lowered.

## Bounded disposition

Retire **only** `SYS-TLP-FRAGMENT-NAVIGATION-RUNTIME` from the active Product engineering matrix. Delta **1 P1 + 3 P2 + 0 P3 = 4 → 1 P1 + 2 P2 + 0 P3 = 3**. Keep independent theme semantic contrast `SYS-TLP-THEME-SEMANTIC-COVERAGE-RESIDUAL`, WCAG text spacing `SYS-TLP-TEXT-SPACING-ROBUSTNESS`, and human-backed Turnstile integrity `TLP-COMM-ABUSE-001` open. The pending contrast PR #557 was red on its exact-head 60/61 pixel run and must not be retired; text-spacing PR #556 still requires integration on current Product main and exact-head QA.

The closure becomes authoritative in AuditRepo only after the bounded PR has passed exact-head `AuditRepo Validate`/workflow preflight and is merged. Reopen the fragment root only on a fresh reproducible current Product regression of native URL identity, repeated source reveal or settled target geometry; historical failures do not independently reopen it.
