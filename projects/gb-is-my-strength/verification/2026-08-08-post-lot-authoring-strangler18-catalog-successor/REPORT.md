# gb-is-my-strength — current-main reconciliation after Lot authoring

Date: 2026-08-08
Mode: audit-only successor snapshot; prior reports are preserved as historical observations.

## Product authority

Current Product main observed at this snapshot:

`12885b378b9effebfea9fc65ff8f3df8da6e1504`

This is merged PR #1300, `content(lot): add source-safe standalone article layer`.

The immediately preceding Product main was:

`3ebed35fe1992a0728543fae04f9cbc98f142625`

That commit is merged Strangler PR #1296, `fix(strangler): resolve legacy wrapper references via storage authority`.

## Strangler truth

The accepted #1296 exact-head Shared Files evidence kept the immutable/reference authority stable while removing one real mechanical dependency blocker:

- immutable references: 53;
- migration-only: 52;
- production-required: 1;
- unresolved authority: 0;
- dependency blockers: 7;
- central logical-reference storage remains quarantine-aware and ambiguity fail-closed;
- raw retirement blockers: **18**.

Thus the prior truthful progression is now 20 -> 19 -> 18; 18 is the current accepted baseline at this snapshot.

## Lot disposition

PR #1300 is merged. It contributed exactly the authoring/source layer under `src/components/article-pilots/lot/**` and deliberately did not publish a route or mutate global publication/discovery owners.

The merged exact head `71688c19af4da6730419bed0a5b90cc341379876` completed the applicable CI matrix green before merge, including Shared Files, Scripture Occurrence, Deploy Candidate, Native Source, Metadata, Search Modal, Overlay Runtime, Route Registry, Visual Parity, Runtime Interactive, Glossary, Print and Editorial Dateline.

A bounded pre-publication editorial follow-up is now PR #1308 on exact Product `main@12885b378...`. It changes only:

- `src/components/article-pilots/lot/LotSectionSodom.astro`;
- `src/components/article-pilots/lot/LotSectionChoiceAndRescue.astro`.

The repair narrows two evidence boundaries before public registration: Jude 7 is kept closer to its textual wording (`блуд` / `иная плоть`) with the exact Genesis-19 relation left explicitly exegetical, and the city-gate paragraph no longer turns Lot's gate position into an unsourced office/adjudication claim. Publication registration remains a separate SYSTEM transaction under #1295.

## Catalog disposition

Old catalog PR #1221 is closed unmerged as `SUPERSEDED_BY_CLEAN_SUCCESSOR`.

Reason: it was 42 Product-main commits behind and carried a stale generated `data/scripture-search-index.json` blob from an older discovery state.

Clean successor PR #1305 was created from then-current `main@3ebed35f...` with exactly five semantic catalog files and no copied Scripture JSON. It derives exhaustive `/articles/` membership and card metadata from existing Search Manifest + page-ownership authority, retires the hand-authored second catalog owner, and updates its audits accordingly.

Regression-first CI on #1305 produced two expected/control-plane findings:

1. Scripture Occurrence Contract correctly failed because `data/scripture-search-index.json` became stale and explicitly requires the canonical `build-scripture-occurrence-index.mjs --write` closure. No manual JSON copy/edit has been accepted.
2. Shared Files initially failed only because still-open predecessor #1221 owned the same five exclusive files. After the clean-successor handoff was recorded, #1221 was closed and the failed Shared job was re-requested without code churn.

Because Product main subsequently advanced to `12885b378...` via Lot authoring, #1305 must absorb the final current main before the canonical generated-index closure is materialized and before any exact-head merge authorization.

## Other active owner state

- #1267 Gill quiz-panel conditional: semantic diff remains two files; predecessor/current-main refreshes have been green, but the PR must absorb the latest Product main and obtain fresh exact-head evidence before merge.
- #1283 Gill glossary residuals: permanent final semantic shape is two files (`data/glossary.json` + `scripts/glossary-runtime-browser-test.js`), with all temporary write-enabled projectors retired. Exact Glossary browser/source contract is green; latest Product main still needs to be absorbed before final authorization.
- #1299 owns the independent Home Design search-settled-state harness residual. It must not be repaired by weakening unrelated Gill/Lot lanes or merely increasing timeouts.

## Home/Arena hygiene

Recent accepted Product changes in this snapshot are Strangler and route-local Lot authoring; they do not touch the historical Home special-owner set. The previously prohibited `astro.config.dev.mjs` and `arena-release-quote-inset-fix.yml` remained absent in the latest explicit Product-tree checks before this snapshot; any future Home/Arena change still requires a fresh exact-tree recheck.

## Immediate sequencing

1. Finish exact-head #1308 and merge only if Product main remains contained and all applicable gates are terminal green.
2. Re-anchor #1267, #1283 and #1305 to that resulting Product main once, avoiding repeated transport churn.
3. For #1305, materialize only the canonical deterministic Scripture index writer output after the final current-main refresh; final merge tree must contain no temporary writer workflow.
4. Complete #1267/#1283 exact-head gates and merge bounded repairs independently.
5. Only after Lot source/editorial layer is settled, open the separate SYSTEM publication-registration transaction under #1295 and require real public-route/browser/production witness.
