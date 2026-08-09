# Live reconciliation — Product main 80800f6a, Strangler 3, owner collisions and Bible-rights blocker

Date: 2026-08-09
Product repository: `FedorMilovanov/gb-is-my-strength`
Audit repository: `FedorMilovanov/AuditRepo`

## Exact Product anchor

Current verified Product `main` at this checkpoint:

`80800f6adca2f5af0da97cafda2214985d8c9b50`

Commit: `chore(strangler): reconcile audit-pro retained-source dependency (#1386)`.

This supersedes the preceding `706c38ca...` AuditRepo anchor.

## Strangler truth — 3 blockers

Merged #1386 reduced truthful retirement readiness `4 → 3` by reconciling the already resolver-backed `audit-pro` retained-source dependency. Current remaining blockers are:

1. `scripts/baptisty-roadmap-audit.js`;
2. `scripts/readable-audit.js`;
3. `scripts/owner-ui-regression-guard.js`.

Physical retained-reference move/delete remains unauthorized.

### Baptist roadmap current owner and duplicate cleanup

Multiple agents briefly opened overlapping lanes on the same root:

- #1391 — transitional predecessor;
- #1395 — current-main successor;
- #1400 — later duplicate.

Byte-level review established #1395 as the strongest/current owner. #1391 and #1400 were closed unmerged to stop duplicate ownership of `scripts/baptisty-roadmap-audit.js` and the same ledger row.

#1395 is based on current `main@80800f6a...` and targets `3 → 2`, but deep source review found one authority regression before merge: it hard-codes `/baptisty-rossii/${slug}/` rather than deriving the route from `data/series.json['russian-baptism'].baseUrl`. Handoff comment `5232290489` requires combining the correct route-prefix owner with #1395's stricter `status=production-dist` + `routeRole=reading` assertions. Do not revive #1391/#1400.

Protected active branches already exist for the two later blockers and must not be duplicated:

- `agent/readable-audit-reference-authority-20260809` — one unique `scripts/readable-audit.js` delta, currently one main commit behind;
- `agent/owner-ui-reference-authority-20260809` — one unique `scripts/owner-ui-regression-guard.js` delta, currently one main commit behind.

These are active ownership signals even before PR creation.

## Home Design Search settled-state — current owner #1393

Issue #1299 is no longer ownerless. Draft #1393 is the canonical one-file SYSTEM repair in `scripts/home-design-audit-pro.mjs`.

Its intended architecture is correct: remove hard-coded result-group taxonomy, read observable Search state and emit diagnostic snapshots instead of increasing timeout or changing Product Search.

Deep source review found one timing false-red in the first implementation. Current Search input runtime synchronously clears stale options/selection/`aria-activedescendant`, then only after a 180 ms debounce may enter loading/results. #1393 samples invalidation in a separate round-trip after `input.fill()` and currently requires `loading=false`; a slow runner can therefore observe a legitimate post-invalidation loading phase and fail correct Search. Very fast Search could also settle before the transient sample.

Handoff comment `5232272255` requires deterministic synchronous invalidation observation (same browser event turn) or equivalent evidence, while preserving settled expected-title/selection/activeDescendant assertions and the existing 15 s bound. No `js/search.js` change is required.

Do not open a second #1299 lane.

## Native article quiz parity — presentation boundary repaired, fresh CI running

Draft #1373 remains canonical owner for issue #1369.

The earlier audit found that semantic quiz restoration used new classes not owned by canonical CSS. The owner has now repaired that boundary on current head:

`4d1626390978885548c612d06db67f9c0001214e`

Current runtime deliberately carries both semantic and accepted presentation classes:

- `quiz-result-badge quiz-score-badge`;
- `quiz-explanation quiz-explanation--short quiz-explanation-short`;
- `quiz-explanation quiz-explanation--full quiz-explanation-full`.

The real-route browser witness now asserts those combined class boundaries as well as short/full text and result badge.

Fresh exact-head state at observation:

- SUCCESS: Node Toolchain, Shared Files, Deploy Candidate, Native Source, Metadata;
- in progress: Runtime Interactive, Visual;
- queued: Glossary.

Old all-green quiz heads are historical only; merge authority must come from the final current head after all applicable workflows finish.

## Map scale witness — semantic proof complete, final ancestry intentionally deferred

Draft #1363 remains the one-file MapScale harness owner.

Current feature head before the latest Product main movement:

`d91af55e5e247b79e3a6bbec4a0b0e138455340d`

At that head all three applicable workflows are terminal SUCCESS:

- Shared Files Guard;
- Metadata & IndexNow Readiness;
- Route Registry Validators, including registry contracts, full Chromium matrix/touch-scroll and WebKit touch-scroll.

The semantic repair remains exactly one file and preserves the existing `expectedScaleDelta <= 2.5px` invariant; no runtime/CSS/tolerance change.

Product main then advanced one unrelated ledger commit through #1386. Because #1395 plus protected readable/owner-ui branches are the next likely Strangler main movements and none touches the MapScale test, do not churn #1363 with one ancestry transport per ledger merge. Perform one final current-main refresh after this retirement mini-wave settles, then re-run the same exact-head barrier once.

## Bible corpus PR #1389 — hard binding rights/provenance blocker

Draft #1389 adds new central Product Bible records:

- Synodal Genesis 19 records copied from `bible.by`, marked `rights: "Public Domain"`;
- Cassian Luke 17:28–32 and 2 Peter 2:6–9 copied from Azbyka, without a Product publication-rights grant.

This conflicts with binding Research authority:

`FedorMilovanov/Research@d52ea9d54dd2c2488223d25f5f6cefd263c23328` (`SEARCH-P2-07`).

That verified decision records:

- Cassian: `PERMISSION_REQUIRED`, `PUBLICATION_HOLD`, `DO_NOT_EXPAND_OR_REPUBLISH_WITHOUT_PERMISSION`;
- current Synodal web-derived bytes: `RIGHTS_UNKNOWN`;
- generic website accessibility is not rights/provenance approval;
- the only promoted Synodal candidate is exact CrossWire `RusSynodal 1.9.1`, still under `ARCHIVE_HOLD + PUBLICATION_HOLD` until archive acquisition, hashing, inspection, versification mapping and import receipt.

Therefore technical CI cannot authorize #1389. Audit blocker comment `5232286767` requires the Product corpus additions to remain blocked until Research/AuditRepo authority changes by evidence. Adding a `rights` string is not a substitute for permission/provenance.

`SEARCH-P2-07` remains open.

## Lot/source ownership

#1378 remains the one-file Lot source-resilience owner. Its current source patch keeps archaeology claims separate from internal map authority and replaces unstable EDSP links with institutional Harvard publication records plus direct Scientific Reports critique links. No duplicate source lane is needed.

#1401 is a separate two-file shared standalone-footer ownership refactor intended to remove a false Lot→Kod component dependency before a fresh publication replay. It does not overlap Lot prose, Search, quiz, Atlas or route registries.

Old Lot publication #1339 remains a stale historical vehicle and still requires current-main replay rather than direct merge.

## Avraam

#1334 remains the bounded Avraam retraction-parity owner. Do not fold it into Lot publication. The narrowed route-data residual remains `scientific_variants.hammam[0]`.

## Audit disposition

- Product code was not modified by this AuditRepo report.
- Duplicate Baptist roadmap PRs #1391 and #1400 were closed unmerged; #1395 remains sole owner.
- No duplicate #1299, quiz, MapScale, Lot-source or Avraam lane was opened.
- Bible-rights conflict is now explicitly merge-blocked by repository policy evidence, not inferred from CI.
