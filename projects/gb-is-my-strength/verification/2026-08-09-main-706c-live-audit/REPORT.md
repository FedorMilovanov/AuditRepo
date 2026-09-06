# Live audit — Product main 706c38c

Date: 2026-08-09
Product repository: `FedorMilovanov/gb-is-my-strength`
Audit repository: `FedorMilovanov/AuditRepo`

## Exact Product anchor

Current verified Product `main` at this checkpoint:

`706c38cafc96dddec2c2d763d449139e9bd8101a`

This is merged Product PR #1381 (`chore(strangler): reconcile Gill reading-time dependency`) on top of merged catalog #1348.

## What changed since the 5434 reconciliation

### Closed / merged cleanly

- #1348 catalog is merged and remains Product authority. A later Shared Files red (#1382) is not a Product regression: exact logs show the delayed PR run checked out post-squash `main@5434f97...` while the final diff step still trusted historical PR `HEAD_SHA=1f7f7795...`; the declared head object was absent and `git rev-parse` failed. This is evidence for already-open CI root #1249, not reason to revert catalog.
- #1381 merged exactly one ledger file and proves Strangler readiness `5 → 4` without validator weakening.
- stale Lot publication PR #1339 is closed unmerged as superseded; Product root #1295 remains open.
- stale reader-control census PR #1212 is closed unmerged as stale calibration; Product root #1224 remains open and requires a current successor.
- twelve proven orphan CI-failure notifier issues tied to closed/superseded branches were retired as `not_planned`. Four Favorite Store notifier issues remain organizational cleanup because the write connector blocked the first retirement attempt; source PR #1040 is closed unmerged/superseded.

## Current Product open PR census

There are four open Product PRs at this checkpoint:

1. #1373 — shared native article quiz parity;
2. #1378 — Lot archaeology source-link resilience;
3. #1363 — Map scale settled-geometry witness;
4. #1334 — Avraam/Tall el-Hammam static retraction parity.

Old publication #1339 and old census #1212 are no longer active PR owners.

## Quiz parity — #1369 / #1373

The true shared root remains #1369. #1365 stays closed false-positive; native standalone rendering already exists through `ReaderActionsRuntime → article-interactions.js → article-quiz.js`.

#1373 has a truthful four-file semantic boundary:

- `.github/workflows/native-source-contract.yml`;
- `scripts/article-quiz-native-parity-test.mjs`;
- `scripts/interactive-audit-runner.js`;
- `src/runtime/article-quiz.js`.

The fourth file is intentional: it is the real-route browser witness required to prove named result tier + badge + distinct short/full explanations, not accidental scope drift.

Exact combined head `ae06eab...` passed all eight applicable workflows, including Runtime Interactive and Visual Parity. Before merge authority, Product main moved through #1381. A merge-only transport #1385 then absorbed `main@706c38c...` into the quiz branch; current feature head is `a2fbe4db...`, compare remains exactly the same four semantic files and `behind=0`. Fresh exact-head CI is running again. Do not merge until it is terminal green and current main is unchanged.

## Lot publication and hidden-lane collision map

Product root #1295 remains open. #1339 was not merely stale by ancestry; it carried outdated generated discovery artifacts and unresolved publication defects (missing canonical JSON-LD WebSite `#website`, missing live `#sec-map-connection` TOC entry, generic OG instead of Lot-specific asset). It is therefore correctly closed unmerged, not transport-refreshed.

Current/source lanes:

- #1378 is the only current source-link owner (`LotSectionSources.astro`). It remains one semantic file. After #1381 it is `behind=1`; its previous exact head had all applicable checks green except Runtime still executing at the observation point. Refresh only after upstream quiz/main settlement.
- `lane/lot-media-20260809` is empty (`ahead=0`): no raster asset delivery exists yet.
- `lane/lot-reader-copy-polish-20260809` is empty (`ahead=0`).
- `system/lot-authoring-projector-20260809` and `system/lot-source-polish-projector-20260809` are empty old reservations (`ahead=0`, deeply behind).
- `lane/lot-source-polish-20260809` is dangerous archaeology: one old authored commit, `behind=41`, and a current compare expands into a 22-file alternative Lot architecture that removes current sections/quiz. Do not merge or refresh it in place.
- `lane/lot-illustration-placement-20260809` contains useful but stale work: seven semantic files, `behind=9`, adding a shared `LotFigure` component, `lotFigures.ts`, and nine evidence-aware placements. It should be selectively replayed on then-current main only after actual assets exist.

Illustration metadata currently names nine publication placements (`lot-two-roads`, `lot-jordan-plain`, `lot-sodom-gate`, `lot-sodom-crowd`, `lot-judgment`, `lot-wife-back`, `lot-cave`, `lot-ruth-naomi`, `lot-remember-wife`) and deliberately keeps five visuals reserved. The component expects real `/images/articles/lot/<name>-600w.webp`, `-900w.webp`, `-1200w.webp` families. Those bytes are not present in the empty media lane, so media delivery is not complete.

Correct Lot order:

1. finish #1373 shared quiz parity;
2. refresh/finish #1378 source links;
3. land a real bounded media asset/provenance lane + Lot-specific 1200×630 OG;
4. selectively recover current-safe illustration placements for assets actually present;
5. create a fresh publication successor from current main, add canonical `#website`, real TOC anchor and Lot OG, and let canonical writers derive Search/RSS/sitemap/Scripture;
6. run final responsive Chromium/WebKit/browser/print witness, then merge and production witness.

## Strangler retirement — merged 5→4, but only three code readers remain

Merged #1381 changes the Gill ledger row only and proves readiness `5 → 4`.

The four ledger blockers are not four code refactors:

1. `scripts/audit-pro.js` — stale governance disposition. Current `buildAuditProSourceCorpus()` already resolves reference-only storage through `resolveReferenceForRoute()`. Shared Files exact logs also prove the quarantine-aware audit-pro mutation contract passes. This needs a one-row ledger reconciliation, not code surgery.
2. `scripts/baptisty-roadmap-audit.js` — real physical root reader; it requires `baptisty-rossii/${slug}/index.html` existence and should use publication/public-surface authority.
3. `scripts/readable-audit.js` — real root-HTML coupling; default mode recursively scans repository-root HTML and hardcodes root KdV/Nagornaya/home files. Production/readable truth should move to current dist/registry authority, with any retained-reference forensics made explicit.
4. `scripts/owner-ui-regression-guard.js` — real obsolete root doctrine; it still treats legacy root HTML as production authority. Existing visual/reference contracts must be inventoried; duplicate markers should retire, remaining historical parity witnesses should use explicit reference resolution.

SYSTEM issue #1383 now owns those three actual code readers as three independent lanes. Do not make a mega-PR or hard-code migration-directory paths. After the separate audit-pro ledger-only reconciliation, expected real code blocker arithmetic is `3 → 2 → 1 → 0`.

Physical retained-reference move/delete remains unauthorized until readiness reaches zero.

## Map scale witness — #1363

Semantic repair is proven and remains one file: `scripts/map-engine-correctness-browser-test.mjs`. Old exact head passed Shared Files, Metadata and Route Registry. Runtime/CSS/tolerance are unchanged; only the false fixed-120ms sampling was replaced by bounded convergence against the same ≤2.5px invariant.

Current compare is now `behind=2`. This is ancestry-only debt. Do one ordinary current-main merge transport immediately before final Ready/merge and rerun exact-head gates; do not rewrite MapEngine.

## Avraam — #1334 / #1298

#1334 remains exactly two semantic files but is now `behind=14`. Its static fallback/audit slice remains useful, but the root issue #1298 must not close with it.

Current `karty/avraam/route.json` still has a separate `scientific_variants.hammam[0]` entry that positively cites Bunch 2021/destruction without the explicit 2025 retraction boundary already present elsewhere. Correct delivery is selective current-main recovery of the two-file slice, then a separate atomic route-data owner for that single residual. Do not smuggle a whole-file `route.json` rewrite into the stale PR.

## Shared Files / CI current-truth root — #1249, witness #1382

#1382 is a stronger reproduction of open SYSTEM root #1249.

Exact run behavior after #1348 squash merge:

- queued PR job started after `main` had moved to the squash commit;
- checkout selected current `main`;
- final Shared Files diff step still injected historical PR `BASE_SHA`/`HEAD_SHA`;
- old head object was not in the checked-out graph;
- final guard failed with `fatal: Needed a single revision` despite all prior substantive guards passing.

This is no longer merely conservative stale-base overvalidation. It can produce a false terminal red after PR settlement. #1249 must therefore cover delayed post-merge PR jobs: either fetch/validate the exact declared PR graph or recognize the identity as settled; never fabricate a Product failure from a mismatched checkout/event graph.

## Reader-control census — #1224 after closing #1212

#1212 is historical calibration evidence only. Its old 887-observation artifact must not be promoted as current truth because click journeys were sequence-contaminated, many runtime errors were environment/noise, and `<24px` was treated as a target-size prefilter without full WCAG spacing/exception evaluation.

#1224 remains the root. A clean current-main successor should reuse existing Runtime Interactive build/serve ownership, isolate/reset each control journey, re-query targets after reset, classify browser/environment noise, implement proper target-spacing semantics, and derive route coverage from current public-surface authority.

## CI-failure lifecycle hygiene

Twelve stale notifier issues tied to closed/superseded branches were retired as `not_planned`, without claiming historical CI recovery. After cleanup the open `ci-failure` view contains one current infrastructure witness (#1382) plus four Favorite Store historical alerts (#1066/#1042/#1064/#1063). Their source PR #1040 is closed unmerged/superseded, so those four are organizational lifecycle debt, not active Product defects; connector safety blocked retirement of the first one, so no bypass was attempted.

## Current merge / collision order

1. #1373: finish fresh exact-head CI on `a2fbe4db...`; if terminal green and main unchanged, merge shared quiz parity first.
2. #1378: then absorb current main once, rerun exact-head gates and merge the one-file source repair.
3. Lot media + selective illustration placement, then fresh publication successor under #1295.
4. Strangler: audit-pro ledger-only reconciliation, then three code lanes from #1383.
5. #1363: one final current-main transport + exact-head Route Registry barrier.
6. #1334: selective recovery, while #1298 remains open for the route-data residual.
7. #1249: harden Shared Files graph identity / post-merge delayed-run behavior; #1382 is evidence, not catalog rollback authority.
8. #1224: build a clean calibrated census successor; do not revive #1212.

No stale publication, census, source-polish archaeology or empty reservation branch should be treated as an active implementation owner.