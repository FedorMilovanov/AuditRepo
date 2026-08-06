# CURRENT HEAD REVERIFY — SEARCH-P1-01 strict-native app search source closure

Date: 2026-08-06  
Project: `gb-is-my-strength`  
AuditRepo base before transaction: `11ede94e316416ea0818c3a90a08101ea77ca9f5`  
Product current source / PR #1067 squash merge: `8a51db9a2df74fa615a3eaca698144302e47e332`  
Product PR #1067 exact tested head: `6ba805c61a3fa2ebc1890de11ac823894dc7fcff`  
Production authority retained: `38b257030afb7cfa8a7b1128f8c86539fd36dec0`, run `30960174778`, attempt `1`

## Scope and disposition

This transaction closes exactly one canonical row:

- `SEARCH-P1-01` — the unified global command palette was absent on four indexable strict-native app/tool routes.

Disposition: **FIXED-CURRENT / MERGED-SOURCE+CHROMIUM+WEBKIT+CI VERIFIED**.

## Product result

Product PR #1067 exposes the existing canonical command palette on:

- `/karty/avraam/`;
- `/karty/ishod/`;
- `/konfessii/russkij-baptizm/`;
- `/map/`.

The bounded implementation adds one shared 44px trigger and lazy asset head, preserves the canonical search runtime instead of duplicating ranking or rendering, keeps MapEngine place search and Atlas-local search distinct, leaves the Baptism iframe untouched, and retains the strict-native no-`site.css`/no-`site.js` boundary.

## Exact evidence

- Exact tested head `6ba805c61a3fa2ebc1890de11ac823894dc7fcff` passed **17/17** applicable workflow groups before guarded squash merge `8a51db9a2df74fa615a3eaca698144302e47e332`.
- Search Modal run `31057748363`, job `92478849364`: core **4/4 PASS** plus strict-native app surfaces **16/16 PASS** across four routes, mobile/desktop and Chromium/WebKit.
- Search artifact `8951059736`; digest `sha256:30554964738021c187823e0c8929eda78e667da2e5187a3e2780c20820fd5237`.
- Avraam Dossier run `31057748436`, job `92478860318`: desktop/mobile **304/304 PASS**. The first exact-head cycle exposed that the fixed search trigger preceded the native skip-link in DOM order; the final tested head restores the skip-link as the first Tab target without weakening timeout or assertions.
- Avraam artifact `8951016813`; digest `sha256:0b4ee4838db3b6589b09acb3531d74fd8d376ddcc5b4c0cbe8d0854b6c4c4080`.
- Current merged owner blobs: `src/components/search/AppSearchSurface.astro` `5e58156d2fa4ace528d88b9ef91eee8e08ad93a4`; source contract `08efc5e359476fa399c434f56e2ebc1bb6571762`; browser contract `88ff097c3ea7c4200a182127da971b69deda3bb6`; extended workflow `79d7e34925811528d02e9c1c8e8360adec3cb9f3`.
- The core PR #1039 owners remain retained on current Product: `js/search.js` `7b279d1a8c092ae473d3db9129ee14652cb7ee69`, `css/command-palette.css` `758247d1dd41a626cabeafa5048636f8181be07a`, core browser contract `50e52e488800d7c7bdc3875083e4a7b4a4975c17`. Its former workflow is intentionally superseded by the tested extended workflow above.
- Product `main` is `8a51db9a2df74fa615a3eaca698144302e47e332` and the canonical Product branch was auto-deleted after guarded squash merge.

## Canonical accounting

- total remains **371**;
- closed becomes **230**;
- open becomes **141**;
- P1 becomes **69**;
- P0 remains `0`, P2 `26`, P3 `39`, refactoring `4`, AuditRepo `3`.

## Remaining boundary

- `SEARCH-P2-07` remains open until an authoritative/licensed corpus with rights/provenance evidence exists.
- Search P3 polish remains lower priority than functional owners.
- Do not reopen the app-route search surface, core modal semantics, Favorite Store, ReaderProjection or Reader controls without new exact-current evidence.

## Production statement

No production deployment or same-SHA live claim is made for `8a51db9a2df74fa615a3eaca698144302e47e332`. Current production authority remains `38b257030afb7cfa8a7b1128f8c86539fd36dec0`, run `30960174778`, attempt `1`.
