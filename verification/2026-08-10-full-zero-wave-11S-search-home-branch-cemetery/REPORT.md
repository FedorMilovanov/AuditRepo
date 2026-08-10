# Wave 11S — Search / Home / Catalog / Release branch cemetery

Date: 2026-08-10

Product: `FedorMilovanov/gb-is-my-strength`

Live preflight authority: `main@757946da67287354b819737813c0a47095f2d759` — exact requested rewritten-history anchor.

## Method / boundaries

Cleanup verification only. No Product source changes, no PRs, no new/successor/transport branches, no rebase/refresh, no push to historical refs, no `main` mutation, and no contact with Dependabot #1538.

Every assigned ref was compared live against the rewritten current main. Current head SHAs below came from live self-compare. `ahead` is the unique rewritten tail count. Because history was rewritten, disposition is based on resulting tree/semantic ownership, not pre-rewrite SHA identity.

Modern Search/Home/catalog/release authority is already merged on current main. Old Search waves are not treated as recovery branches merely because their ancestry is unique. Generated static mirror churn, audit-only workflows and obsolete release evidence variants are not independent Product semantics.

## Execution limitation

All 24 refs are semantically safe to delete, but the authenticated GitHub connector available here exposes no delete-ref/delete-branch action. Local fresh Git access is unavailable because the runtime cannot resolve `github.com`. No `update_ref` surrogate was used. Therefore physical deletion count is zero and lifecycle CI issues were not closed before deletion.

## Per-ref terminal matrix

| # | Branch | Current head SHA | `main...ref` | Unique tail / tree evidence | Canonical successor / owner | Missing Product semantics? | Classification |
|---|---|---|---|---|---|---|---|
| 1 | `agent/home-marginalia-geometry-owner-20260807` | `8f336dca3e12d26534df37289fb38d15cb8f7fa6` | ahead 7 / behind 188 | historical Home ambient/marginalia/footer geometry tail | current merged Home owner | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 2 | `agent/home-quote-static-mirror-fix` | `ec7c79e59990061cb2ae7bd0d4017478a848201a` | ahead 5 / behind 213 | quote/static mirror + Home evidence predecessor | current Home/quote projection on main | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 3 | `agent/release-live-evidence-contract-20260806-r2` | `8d3a59d6f03a1c31e58f48497aa49a235ce423ad` | ahead 23 / behind 203 | old deploy/visual/live-release evidence chain | current release/deploy evidence authority | no; evidence lineage only | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 4 | `agent/release-live-evidence-contract-20260806` | `280849a54b2ceea6ffb731bd2bd932a8d440be70` | ahead 15 / behind 203 | predecessor of same release evidence family | current release/deploy evidence authority | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 5 | `agent/search-trigger-labels-p3-01-20260806` | `395394fa4d0c38af808f21dd6df5829b545f8ec0` | ahead 16 / behind 208 | old Search trigger/glossary audit tooling | current Search UI/label contracts | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 6 | `agent/system-search-keyboard-owner-r4` | `55f96ce1c149c744132ff0ab977c744b4e615dc4` | ahead 11 / behind 178 | large generated mirror churn; substantive area is old Search modal/keyboard ownership | current merged Search keyboard/modal owner | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 7 | `audit/search-manifest-field-parity-20260808` | `628b3da08b4c397032ff4b27f291b90b6f96e4b2` | ahead 1 / behind 138 | audit workflow only | current Search manifest policy/guards | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 8 | `cleanup/css-duplicate-owners-20260808-r2` | `87d3b645eb4c609308e5c406079b0fb55eb146ac` | ahead 6 / behind 143 | historical CSS duplicate-owner cleanup + component/generated churn | current CSS/component authority | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 9 | `cleanup/css-duplicate-owners-20260808` | `87d3b645eb4c609308e5c406079b0fb55eb146ac` | ahead 6 / behind 143 | same rewritten head as r2; not an independent line | current CSS/component authority | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 10 | `fix/search-exact-shortcut-20260807-r2` | `d60c13df14e0b94f4f200672df044e76fb15ff2a` | ahead 4 / behind 178 | old exact-shortcut/generated mirror repair | current Search exact-reference/shortcut behavior | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 11 | `fix/search-exact-shortcut-20260807` | `cd250bb5993d7863d5bc4a7bd18439765f490115` | ahead 6 / behind 178 | older exact-shortcut `js/search.js` tail | current Search owner | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 12 | `fix/search-truthful-continuation-20260808-r1-ci` | `3d703c4fb6fcdf6fbb65dd7d1f68506182a41d1b` | ahead 13 / behind 142 | old Search continuation/modal/source contract + generated head churn | current truthful Search continuation owner | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 13 | `fix/search-truthful-continuation-20260808-tx` | `b18248c890d42a209a644d79e9de6d15e3f82702` | ahead 7 / behind 142 | transport-era Search continuation variant | current merged Search continuation owner | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 14 | `lane/diag-release-phase-complete-20260807` | `a00b248059798ca0aeaa1b5dded8a189e5139d04` | ahead 1 / behind 190 | release-phase diagnostic/evidence only | current release evidence authority | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 15 | `lane/home-footer-settled-contract-20260807-r2` | `66209a667ba00779e5a848f5f061f5bdaee6ad71` | ahead 1 / behind 189 | historical HomePageFooter contract | current Home footer owner | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 16 | `lane/home-footer-settled-contract-20260807` | `15357da1806415864cbe07ab34bd3cb1615a131b` | ahead 1 / behind 198 | predecessor HomePageFooter contract | current Home footer owner | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 17 | `lane/release-live-evidence-final-20260807-r2` | `6288513257c78de512bb33ac33e3ea429a716e11` | ahead 1 / behind 185 | final-era release evidence predecessor | current release evidence owner | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 18 | `lane/release-live-evidence-final-20260807` | `6c27a014d429cefc393adf27ff90f428c3465982` | ahead 1 / behind 186 | predecessor release evidence variant | current release evidence owner | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 19 | `lane/system-articles-catalog-projection-20260808-r2` | `c273f6d1dc1e0502a05fa9d592f4c8948eb376b0` | ahead 7 / behind 138 | early `ArticlesLibrarySection`/catalog projection | modern merged article-library/catalog authority | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 20 | `lane/system-articles-catalog-projection-20260808-r3` | `cc0bd5694085321d70ab366d78a65ea93d1eee8b` | ahead 7 / behind 69 | later predecessor of same catalog projection | modern merged article-library/catalog authority | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 21 | `lane/system-articles-catalog-projection-20260808` | `08f5a3606dc5a29f4c78515a8b586af0678c7e3d` | ahead 10 / behind 142 | historical catalog + occurrence guard variant | modern merged article-library/catalog authority | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 22 | `lane/system-articles-catalog-projection-20260809-r4` | `8698e5666119e1e096190fff385db64f8fd24aaa` | ahead 5 / behind 66 | r4 predecessor in same catalog chain | modern merged article-library/catalog authority | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 23 | `lane/system-articles-catalog-projection-20260809-r5` | `b6377882474a3113e3d1fec0f4bd77c010476b53` | ahead 16 / behind 55 | r5 predecessor; historical library projection and guard lineage | modern merged article-library/catalog authority | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 24 | `lane/system-home-searchaction-query-entry-20260805` | `f00f53f4a0a806dab0267e1652d7c141dd2e267c` | ahead 0 / behind 233 | no unique commits; reachable | current Home SearchAction authority | no | **SAFE DELETE — REACHABLE/EMPTY** |

## Terminal report

- assigned count: **24**
- examined count: **24**
- semantically SAFE DELETE count: **24**
  - SAFE DELETE — REACHABLE/EMPTY: **1**
  - SAFE DELETE — SUPERSEDED/ABSORBED: **23**
- physically deleted count: **0** — delete-ref primitive unavailable
- KEEP count: **0**
- MANUAL REVIEW count: **0**
- associated CI issues closed: **0** — no closure before physical deletion
- Product source mutations: **ZERO**
- new Product branches: **ZERO**
- new Product PR: **ZERO**
- Product `main` mutations: **ZERO**
- Dependabot #1538 mutations: **ZERO**

### Exact deleted branch names

None. No destructive deletion is claimed.

### Exact surviving branch names and reason

All assigned refs survive physically only because this executor has no delete-ref operation; none survives on semantic KEEP grounds:

- `agent/home-marginalia-geometry-owner-20260807`
- `agent/home-quote-static-mirror-fix`
- `agent/release-live-evidence-contract-20260806-r2`
- `agent/release-live-evidence-contract-20260806`
- `agent/search-trigger-labels-p3-01-20260806`
- `agent/system-search-keyboard-owner-r4`
- `audit/search-manifest-field-parity-20260808`
- `cleanup/css-duplicate-owners-20260808-r2`
- `cleanup/css-duplicate-owners-20260808`
- `fix/search-exact-shortcut-20260807-r2`
- `fix/search-exact-shortcut-20260807`
- `fix/search-truthful-continuation-20260808-r1-ci`
- `fix/search-truthful-continuation-20260808-tx`
- `lane/diag-release-phase-complete-20260807`
- `lane/home-footer-settled-contract-20260807-r2`
- `lane/home-footer-settled-contract-20260807`
- `lane/release-live-evidence-final-20260807-r2`
- `lane/release-live-evidence-final-20260807`
- `lane/system-articles-catalog-projection-20260808-r2`
- `lane/system-articles-catalog-projection-20260808-r3`
- `lane/system-articles-catalog-projection-20260808`
- `lane/system-articles-catalog-projection-20260809-r4`
- `lane/system-articles-catalog-projection-20260809-r5`
- `lane/system-home-searchaction-query-entry-20260805`

`examined == assigned` is satisfied. Do not resurrect an old Search/Home/catalog wave; only the destructive ref deletion remains for an executor with the proper primitive.