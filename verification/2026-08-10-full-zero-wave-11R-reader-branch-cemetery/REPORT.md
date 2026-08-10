# Wave 11R — Reader / Layout / A11y branch cemetery

Date: 2026-08-10

Product: `FedorMilovanov/gb-is-my-strength`

Live preflight authority: `main@757946da67287354b819737813c0a47095f2d759` — exact match to the requested rewritten-history anchor.

## Scope and method

This is cleanup verification only. Product source was not changed. No Product branch was created, refreshed, rebased, or pushed. `main` and Dependabot `#1538` were not mutated.

Every assigned ref was re-read from the live remote after the history rewrite. For each ref, `main...ref` was compared against the exact current main. `ahead` below is therefore the live unique-commit count after rewrite. Current head SHAs were captured from live ref/self-compare, not from pre-rewrite history.

The `Associated / canonical evidence` column records the semantic owner/root used for terminal disposition; it is not an assertion that a historical rewritten ref still has byte-identical pre-rewrite PR ancestry. Closed SYSTEM root #1224 is the canonical reader-control umbrella; its final verification explicitly states that its Definition of Done has no surviving residual. #1225 is also closed completed for first-class note/tooltip projection. The old census/series/layout/a11y lanes are therefore judged by semantic/tree absorption, not old SHA equality.

## Execution limitation

All 28 refs are semantically safe to delete. However, the authenticated GitHub connector available in this execution exposes ref read/compare/create/update but **no delete-ref/delete-branch operation**. Fresh local `git ls-remote` was also unavailable because the runtime could not resolve `github.com`. `update_ref` was deliberately not abused as a deletion surrogate.

Consequently no ref was physically deleted in this run. Per required sequencing, automated CI-failure issues were **not** closed before deletion. This report records the exact terminal evidence so an executor with delete-ref capability can perform the destructive step without re-opening implementation work.

## Per-ref terminal matrix

| # | Branch | Current head SHA | `main...ref` | Unique tail / tree evidence | Associated / canonical evidence | Missing Product semantics? | Classification |
|---|---|---|---|---|---|---|---|
| 1 | `agent/system-article-control-census-20260808-r2` | `261d7d5a12b0d5037d93a04ad24a08347f3c853c` | ahead 0 / behind 138 | no unique commits; head is reachable from current main | #1224 reader-control root; all-route census/current successors | no | **SAFE DELETE — REACHABLE/EMPTY** |
| 2 | `agent/system-article-control-census-20260808` | `01e9420f4bf8f452573c4ea00f452430ea4e079c` | ahead 12 / behind 129 | historical interactive-audit/article-control census tail | #1212 census evidence feeding completed #1224; modern census guards on main | no; audit evidence/guard lineage superseded | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 3 | `agent/system-reader-control-relations-20260808` | `d0b1ef0e624968f6deed5890d518b72452ed09b1` | ahead 3 / behind 139 | reader a11y relation/runtime contract tail | completed #1224; bounded relation successors referenced by #1224 (#1246/#1259) | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 4 | `agent/system-reader-control-relations-v2-20260808` | `3818d8ebbc58e27cdf43a2e1945d4285619f7632` | ahead 1 / behind 138 | replayed reader-control relation repair on rewritten line | completed #1224 and current shared-reader owner | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 5 | `agent/system-series-back-authority-20260808` | `1d24727fcd56ea9728a7cb71537fa78903c2c172` | ahead 2 / behind 138 | series facade/mobile Back authority tail | #1224; bounded series Back successors documented in root (#1233/#1240) | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 6 | `agent/system-series-mobile-back-authority-v2-20260808` | `0cc0ca3a2be6cb18234c9505b51569439ff85b24` | ahead 5 / behind 138 | same shared-series Back/control authority family | completed #1224 / current series config authority | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 7 | `lane/diag-reader-clientbox-center-20260807` | `e5990b3299ae281fe0daa9a9a97a3bf4a5cd04aa` | ahead 2 / behind 196 | diagnostic tail over shared ReaderRail/ReaderSettings/KdV shell | current shared-reader layout authority; #1224 terminal | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 8 | `lane/diag-single-shell-permanent-guard-20260807` | `9e2edee0fe9e1d96d4359616ff40cea1c5c69ee0` | ahead 2 / behind 196 | single-shell diagnostic/permanent-guard predecessor | current shared-reader/single-shell guards | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 9 | `lane/diag-webkit-kdv-adapter-20260807` | `401474fee84e780b691ae6f87d2125c5ad89b91e` | ahead 1 / behind 200 | WebKit KdV adapter diagnostic tail | modern reader/KdV browser authority on main | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 10 | `lane/diag-webkit-measure-canvas-20260807` | `8d4a780d7f7838279f5ab0d64c20d82e00c03bd4` | ahead 1 / behind 200 | WebKit measurement diagnostic tail | modern reader geometry/browser authority on main | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 11 | `lane/diag-webkit-reader-settings-20260807` | `3e0b7ecd1b9f5192af993ac2c8217a8136a7ba62` | ahead 1 / behind 200 | ReaderSettings WebKit diagnostic predecessor | current ReaderSettings/shared-reader owner | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 12 | `lane/hermenevtika-reader-layout-20260806` | `ffe3bf7978aed3540e3033fdafb4bc8b44785932` | ahead 2 / behind 203 | Hermenevtika ReaderRail/ReaderSettings layout predecessor | current shared-reader layout authority | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 13 | `lane/reader-layout-final-alignment-20260807-r2` | `bbf280b013ffaabf60822fe8e09ba9cf5eeafa52` | ahead 1 / behind 198 | historical final-alignment variant | current shared-reader/KdV layout owner | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 14 | `lane/reader-layout-final-alignment-20260807-r3` | `dc7a5c06eaa025533fb6b89317dd0a46c76f341c` | ahead 1 / behind 196 | historical final-alignment variant | current shared-reader/KdV layout owner | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 15 | `lane/reader-layout-final-alignment-20260807` | `62e13924e18ff0220383184a662a5e14e0b47a35` | ahead 4 / behind 198 | predecessor alignment chain, including no-op/history-only material | current shared-reader/KdV layout owner | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 16 | `lane/reader-single-shell-current-20260807` | `f80078bce25b66b73d189010e602ca03199afd77` | ahead 1 / behind 191 | old shared single-shell implementation tail | current shared-reader single-shell authority | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 17 | `lane/standalone-reader-single-shell-20260807` | `65c543a0732b1f3e65695652e42bf2fdf353e135` | ahead 1 / behind 196 | standalone single-shell predecessor | current shared-reader single-shell authority | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 18 | `lane/system-hermenevtika-regression-guards-20260806` | `4c24e240c50b67bea4759501873ae47f7468ddc9` | ahead 26 / behind 198 | large ancestry, but resulting unique tree is regression/interactive guard work rather than an independent Product feature | modern reader regression/browser guards; #1224 terminal | no; commit count is historical, not recovery value | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 19 | `lane/system-reader-controls-a11y-2026-08-05` | `9c2c99de6298ee63e10422cdc3af41b94a882b4a` | ahead 0 / behind 227 | no unique commits; reachable | current reader-controls a11y authority | no | **SAFE DELETE — REACHABLE/EMPTY** |
| 20 | `lane/system-reader-controls-a11y-clean-2026-08-05` | `55b2506fe0607974e2d9ce762524be791b2e1506` | ahead 1 / behind 230 | old a11y workflow/browser/runtime variant | completed #1224 + current a11y runtime/guards | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 21 | `lane/system-reader-controls-a11y-current-2026-08-05` | `c42c14b18c5b01948a739b7227e0d84eaadf2162` | ahead 3 / behind 231 | old a11y contract variant | completed #1224 + current a11y authority | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 22 | `lane/system-reader-controls-audit-2026-08-05` | `ce257ee912b573f7d205ba3688ab9e25d91ffede` | ahead 3 / behind 234 | old audit/current-head contract variant | #1212/current audit successors; #1224 terminal | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 23 | `lane/system-reader-controls-audit-current-2026-08-05` | `e1cb876790f69a4d62c2697a8687040dce28dd33` | ahead 3 / behind 233 | old audit/sequenced variant | #1212/current audit successors; #1224 terminal | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 24 | `lane/system-reader-controls-audit-exact-2026-08-05` | `86fc485f0f9cf39b5e2c71ec1334ce93eaa961bf` | ahead 2 / behind 232 | old exact-head audit variant | #1212/current audit successors; #1224 terminal | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 25 | `lane/system-reader-favorites-store-20260805` | `3ff6574b14f6cf37e948132d5a32241c438afdce` | ahead 0 / behind 216 | no unique commits; reachable | current favorites-store owner | no | **SAFE DELETE — REACHABLE/EMPTY** |
| 26 | `lane/system-reader-layout-followup-20260807` | `c3209c3b664395a56277b2195f7ad6b17d8aa5e0` | ahead 2 / behind 198 | Hermenevtika/KdV layout follow-up predecessor | current shared-reader layout authority | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 27 | `lane/system-route-overflow-diagnostics-20260807` | `ffc84767d3d42abc0f45079e5e9deebd8637601c` | ahead 1 / behind 200 | public-surface overflow diagnostic only | modern public-surface/browser diagnostics on main | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 28 | `lane/test-tooltip-geometry-contract-20260806` | `745c951404d2f547c46d73c9501208eec1733669` | ahead 9 / behind 203 | historical tooltip handoff/geometry runtime + Hermenevtika test tail | completed #1225 and current tooltip/note projection owners | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |

## Terminal report

- assigned count: **28**
- examined count: **28**
- semantically SAFE DELETE count: **28**
  - SAFE DELETE — REACHABLE/EMPTY: **3**
  - SAFE DELETE — SUPERSEDED/ABSORBED: **25**
- physically deleted count: **0** — blocked by missing delete-ref/delete-branch primitive in the available authenticated GitHub toolset
- KEEP count: **0**
- MANUAL REVIEW count: **0**
- associated CI issues closed: **0** — intentionally not closed because physical branch deletion did not occur
- Product source mutations: **ZERO**
- new Product branches: **ZERO**
- new Product PR: **ZERO**
- Product `main` mutations: **ZERO**
- Dependabot #1538 mutations: **ZERO**

### Exact deleted branch names

None. No deletion primitive was available; no destructive result is claimed.

### Exact surviving branch names and reason

All 28 assigned refs still physically survive **only because deletion could not be executed through the available GitHub connector**, not because they have semantic KEEP value:

- `agent/system-article-control-census-20260808-r2`
- `agent/system-article-control-census-20260808`
- `agent/system-reader-control-relations-20260808`
- `agent/system-reader-control-relations-v2-20260808`
- `agent/system-series-back-authority-20260808`
- `agent/system-series-mobile-back-authority-v2-20260808`
- `lane/diag-reader-clientbox-center-20260807`
- `lane/diag-single-shell-permanent-guard-20260807`
- `lane/diag-webkit-kdv-adapter-20260807`
- `lane/diag-webkit-measure-canvas-20260807`
- `lane/diag-webkit-reader-settings-20260807`
- `lane/hermenevtika-reader-layout-20260806`
- `lane/reader-layout-final-alignment-20260807-r2`
- `lane/reader-layout-final-alignment-20260807-r3`
- `lane/reader-layout-final-alignment-20260807`
- `lane/reader-single-shell-current-20260807`
- `lane/standalone-reader-single-shell-20260807`
- `lane/system-hermenevtika-regression-guards-20260806`
- `lane/system-reader-controls-a11y-2026-08-05`
- `lane/system-reader-controls-a11y-clean-2026-08-05`
- `lane/system-reader-controls-a11y-current-2026-08-05`
- `lane/system-reader-controls-audit-2026-08-05`
- `lane/system-reader-controls-audit-current-2026-08-05`
- `lane/system-reader-controls-audit-exact-2026-08-05`
- `lane/system-reader-favorites-store-20260805`
- `lane/system-reader-layout-followup-20260807`
- `lane/system-route-overflow-diagnostics-20260807`
- `lane/test-tooltip-geometry-contract-20260806`

`examined == assigned` is satisfied. Classification is terminal; destructive cleanup remains an execution handoff only.