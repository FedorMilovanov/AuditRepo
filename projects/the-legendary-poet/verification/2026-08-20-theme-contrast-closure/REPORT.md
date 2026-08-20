# Theme / Contrast Closure — 2026-08-20

## Terminal source

Product PR #426 (`fix(theme): unify theme and contrast authority`) merged into `FedorMilovanov/TheLegendaryPoet/main` as `9bf116e61f365c413f67278c21229cdee4727c94`.

Certified Product head before merge: `577155827883da20c53b29a0113f4f19dd729c2d`.
Base at PR creation: `3339e85086cfa15e14e97991ca98fb053754026b`.

## Proof

Exact-head repository gates on `577155827883da20c53b29a0113f4f19dd729c2d` were green, including Project Contracts, Content Model, Site Route Integrity, Brand Raster, Brand Deep Reference/Motion, CI and Articles Catalog acceptance.

Manual Browser QA run #2823 is terminal green with all four browser contours successful:

- Chromium + Android Chrome QA: success
- base iPhone Safari process-isolated QA: success
- premium iPhone critical QA: success
- premium home QA: success

The prior exact-head browser run on `cc9825bb5a0b2aaeb2db1fdf675e00a992fa002a` intentionally failed on computed light-theme comment-help contrast at `1.61:1`. That failure was fixed before the certified head and was not waived.

## Root causes closed

### `TLP-THEME-001`

Theme authority is now established before React paint from persisted `tlp-theme-mode`; runtime `data-theme`, `theme-light`, CSS `color-scheme`, `theme-color`, same-document toggles and cross-tab storage events converge through one theme authority. Persistent shell surfaces no longer depend on a dark-only root literal.

### `TLP-A11Y-CONTRAST-001`

Dark/light semantic functional text, control, border, graphical-state and focus-offset tokens are now used by the affected UI. CommentComposer help/placeholder/unselected-option states no longer rely on the prior low-opacity literals. RatingStars uses the shared graphical-state token while preserving its existing keyboard radiogroup contract. `qa/theme-contrast.spec.mjs` certifies computed dark/light contrast on real UI, including >=4.5:1 functional text and >=3:1 enabled unselected rating state.

## Decision

Both rows are terminally closed and removed from the active matrix. Cloudflare production P1 `TLP-COMM-ABUSE-001` remains active and is not affected by this closure.
