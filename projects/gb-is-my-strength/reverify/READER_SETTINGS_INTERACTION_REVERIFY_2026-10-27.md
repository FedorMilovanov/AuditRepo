# Reader controls and measure breakpoint — current re-verification

**Date:** 2026-10-27
**Product repository:** `FedorMilovanov/gb-is-my-strength`
**Product baseline:** `21dcfdd9f9018607a708c5118383e287ec1a3fed`
**Local candidate tree:** `92b7d38a9175fd0dd5ef1d4654d071e939f7a096` (only Product delta from baseline: `src/components/genealogy/RelationshipInspector.tsx`, unrelated to reader settings)
**Existing active MASTER row:** `GBS-READER-MEASURE-DESKTOP-ALIAS-AND-BREAKPOINT-REGRESSION`
**Disposition:** reader/menu foundation is verified in the covered scope; the high-desktop measure alias is reproduced and remains OPEN. Do not merge the old 152-file reader-audit branch or close the current MASTER row on the basis of this result.

## Scope and method

This re-check covers the prior Class-C reader/UI audit associated with Product branch `arena/01a0a1ce-gb-is-my-strength` (`0a1748d2717ee6f8a7fd45c64917216aab742350`). It uses a fresh production-like `dist` built in an isolated Product worktree and does not mutate the shared Product checkout used by PR #2202. The isolated Product tree differed from baseline only in the genealogy `RelationshipInspector.tsx` UI labels; reader components, runtime, CSS and test scripts were byte-identical to the baseline source files listed in `evidence/manifest.json`.

Two existing checks ran against that build:

- `scripts/reader-controls-residual-browser-contract.mjs`: **1458 / 1458 assertions passed, 0 failed** across the tested reading routes, site-menu routes, overlays, focus/ARIA and no-JS fallback matrix in Chromium and WebKit.
- `node scripts/reader-preferences-regression-test.js`: **PASS** — foundation guard across 75 Astro heads and 54 legacy documents; ReaderState core geometry, phases, migration and single-owner contracts passed.

A separate Playwright interaction script opened settings through the *visible UI trigger* (`#railSettingsBtn` at desktop widths), clicked actual line-height/narrow/normal/wide options, and measured computed line height, shell width and prose width. It covers two representative routes × six desktop viewports = **12 cases**:

- `/articles/20-antisovetov-pastoru/`
- `/articles/dzhon-gill-chast-1-chelovek/`

This is bounded current evidence, not a claim that every historically reported URL or every mobile route was exhaustively clicked in this run.

## Positive findings

- Line-height control is wired to rendered article prose on both routes at all six viewports. The relaxed option changed computed line-height from **28.8 px to 33.3 px**; there were **0 JavaScript page errors** across the 12 cases.
- The normal and wide measure values do change rendered geometry at 1440 and 1599 px, so the controls are not globally dead.
- The broad reader-controls browser contract passes 1458/1458. No reason was found to merge the historical 152-file branch wholesale to recover reader/menu infrastructure.

## Confirmed remaining defect: measure alias and 1600 px discontinuity

The direct interaction results were intentionally recorded with assertion failures because they expose a geometry defect already tracked by the active MASTER row. `shell` is the measured `.page-wrap` width; `prose` is the measured inner text block width, after clicking each of the narrow/normal/wide choices:

| Viewport | Shell narrow / normal / wide | Prose narrow / normal / wide | Result |
|---:|---:|---:|---|
| 1025 px | 494 / 494 / 494 | 446 / 446 / 446 | All states alias while the available shell is constrained at the rail breakpoint; keep breakpoint-capacity behavior within the existing active investigation. |
| 1280 px | 672 / 703 / 703 | 624 / 655 / 655 | Normal and wide alias under the current layout cap. |
| 1440 px | 672 / 800 / 854 | 624 / 752 / 806 | All three measured states are distinct. |
| 1599 px | 672 / 800 / 928 | 624 / 752 / 880 | All three measured states are distinct. |
| 1600 px | 672 / 760 / 760 | 624 / 712 / 712 | Normal and wide alias; a sudden width reduction occurs. |
| 1920 px | 672 / 760 / 760 | 624 / 712 / 712 | The alias remains. |

**Exact cliff:** between 1599 and 1600 px, wide prose narrows from **880 px to 712 px** (−168 px), and normal prose narrows from **752 px to 712 px** (−40 px). The `wide` setting then ceases to differ from `normal`. This reproduces the current `GBS-READER-MEASURE-DESKTOP-ALIAS-AND-BREAKPOINT-REGRESSION` in the representative routes. It is not a historical-only finding.

## Decision and guardrail

Keep the existing MASTER item OPEN. Do not copy the older reader branch's CSS/JS wholesale: it has a much larger mixed audit/evidence delta, and importing it would reintroduce unrelated historical work without proving this geometry policy is fixed. The useful audit evidence has already been preserved separately in incoming and in the local Product bundle.

I did **not** remove the `760px` cap or alter CSS. The active issue itself warns against simply removing that cap without an approved comfortable line-length policy. The next Product fix should make the measure control's states honest at relevant desktop breakpoints and avoid the 1599→1600 discontinuity, but its maximum text measure should be chosen explicitly and validated at 1024/1280/1440/1599/1600/1920 px before merging.

## Reproducibility evidence

- `evidence/reader-controls-2026-10-27/reader-controls-residual-browser-contract.json` and `.md`: 1458/1458 broad browser-contract results.
- `evidence/reader-controls-2026-10-27/reader-settings-breakpoint-interaction-matrix.json`: the complete 12-case interaction matrix, including expected assertion failures that identify the alias cases.
- `evidence/reader-controls-2026-10-27/reader-settings-live-interaction-check.mjs`: diagnostic script used to click visible settings triggers/options and measure layout.
- `evidence/reader-controls-2026-10-27/manifest.json`: file SHA-256 values, Product baseline/candidate SHAs and Product test-source blob IDs.

The current MASTER already records the active measure row and its policy guardrail. This report adds re-verification evidence; it does not duplicate or close that row.
