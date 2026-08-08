# Post-#1270 current main / discovery / reader / metadata-freeze owner — 2026-08-08

## Purpose

Successor snapshot after Product #1270 merged and moved `main` again. Earlier reports in this audit branch remain historical evidence for their exact observed states; this file records only the newer disposition delta.

## Exact Product main

Current verified Product main:

`7fdd3b0bcbc6eb52651abba082885c8b42c5f7be`

Commit:

`fix(strangler): make retirement readiness storage-aware (#1270)`

Delta from prior main `3d76a2b106eec815c0a0fe2e07fb845c660a01f8` is exactly three Strangler files:

- `data/legacy-reference-ledger/manifest.json`;
- `scripts/legacy-reference-path-contract-test.js`;
- `scripts/legacy-shadow-retirement-readiness.mjs`.

No Home/source/discovery/reader file was changed by #1270.

## Strangler disposition

The previously hidden retirement-readiness self-verifier dependency is now repaired and merged.

Accepted successor evidence on #1270 showed:

- Shared Files Guard SUCCESS;
- existing logical storage resolver used for governed references;
- quarantine fallback preserved;
- active+quarantine ambiguity rejected fail-closed;
- exact self-test output: `legacy shadow retirement readiness self-test passed (quarantine-aware + ambiguity fail-closed)`;
- raw readiness remains `NOT_YET_SAFE_TO_MOVE_OR_DELETE; blockers=20`.

Therefore the old arithmetic defect is closed. The raw `20` is now the truthful known mechanical retirement backlog; do not continue carrying `20 + hidden verifier = 21` after `main@7fdd3b0b...`.

`SYS-STRANGLER-RETIREMENT` remains open as a program because 20 blockers remain, but #1262/#1270 hidden-verifier root is closed.

## Discovery #1254 after main movement

Product #1254 updated again after #1270.

Current exact head:

`b173467776751220231d0177801e6a41cb1f9201`

Current ancestry:

- exact merge base = `main@7fdd3b0b...`;
- `ahead=17 / behind=0`;
- final diff remains exactly six files:
  - `.github/workflows/search-manifest-policy.yml`;
  - `scripts/search-manifest-policy-normalizer.js`;
  - `scripts/search-manifest-policy-normalizer-test.js`;
  - `data/search-manifest.json`;
  - `feed.xml`;
  - `data/scripture-search-index.json`.

No temporary executor/workflow survives.

The generated closure remains valid:

- Search Manifest existing-row authority was reconciled `46 → 0` on the canonical writer path;
- Scripture occurrence index was regenerated through the existing canonical writer and is now part of the final deterministic projection;
- the previous exact head had Scripture occurrence contract/runtime SUCCESS;
- after #1270 moved main, all old greens are diagnostic only and a fully fresh exact-head matrix is running on `b1734677...`.

Latest observed fresh state on `b1734677...`:

- Scripture Occurrence Index Contract: SUCCESS;
- Search Scripture Suggestion Contract: SUCCESS;
- Shared Files latest run: in progress;
- Search Manifest Policy / Route Registry / Deploy / Search Modal / Home SearchAction / Visual / occurrence runtime and other applicable gates: queued or in progress.

Do not merge until this exact head (or a later main-clean successor) reaches terminal green and reviews/threads are clear.

## Reader Quiz residual #1267

The conditional Quiz panel defect remains the current bounded reader residual under #1224.

After #1270 moved main, transport PR #1277 merged exact new main into the Quiz feature branch using merge method only.

Current #1267 exact head:

`4c13f6d956611a46090a0c03465dd566132661e0`

Current state:

- base = exact `main@7fdd3b0b...`;
- `behind=0`;
- semantic diff remains exactly two files:
  - `src/components/article-pilots/gill-series/GillLearningSheet.astro`;
  - `scripts/series-reader-facade-regression-test.js`.

Fresh exact-head CI restarted. At this snapshot most jobs are queued, including Runtime Interactive. Do not transfer the old unrelated Home red from predecessor heads to `4c13f6d9...`; only a fresh reproduction on this current-main-clean head can promote a Home lifecycle root.

## New implementation owner for pre-merge Editorial Metadata freeze

Audit issue #1272 is no longer ownerless. Product draft PR #1278 now implements it:

`ci(metadata): enforce editorial freeze on PR candidate`

Base:

`main@7fdd3b0bcbc6eb52651abba082885c8b42c5f7be`

Current exact head:

`b0ee673a8a00dc41501ce6f410831aee3bc9f545`

Exactly two files:

- `.github/workflows/deploy-candidate-contract.yml`;
- `scripts/workflow-linkage-regression-test.js`.

Bounded implementation:

1. reuse the single production-like `dist/` already built by PR Deploy Candidate;
2. run existing `node scripts/editorial-metadata-freeze-audit.js` immediately after the build;
3. capture/upload `reports/editorial-metadata-freeze.log`;
4. external Shared-Files control-plane contract requires build→freeze ordering, exactly one candidate build, exactly one freeze audit, read-only permissions, no `editorial-metadata-registry.js --write`, and uploaded evidence.

No second production build, no second registry, no date writer and no new workflow were introduced.

Latest exact-head #1278 state:

- Metadata & IndexNow Readiness: SUCCESS;
- Shared Files / Deploy Candidate / Node / TTS Download Consent: queued.

Keep draft until Shared Files proves the external contract and Deploy Candidate proves the real freeze against the exact production-like PR candidate.

## Home / Arena hygiene after #1270

Direct checks on `main@7fdd3b0b...`:

- `astro.config.dev.mjs` — absent (404);
- `.github/workflows/arena-release-quote-inset-fix.yml` — absent (404).

Because #1270 changed only the three Strangler files above, it did not touch:

- `Directions.astro`;
- `HomeAmbientPhrases.astro`;
- `HomeAmbientInteraction.astro`;
- `HomeResponsiveContracts.astro`;
- `Quote.astro`;
- `Refutations.astro`.

No new Home regression is promoted by this main movement.

## AuditRepo / MASTER boundary

AuditRepo main remains:

`c8e9f235d8973f7b24ad9a53a9769dc3f36b8940`

Audit PR #264 already contains current AuditRepo main through transport #265 and remains the only GB disposition-reconciliation container.

Do not update the numerical MASTER `Active work units` by arithmetic from this snapshot while #1254/#1267/#1278 remain moving. Required next MASTER reconciliation once these dispositions settle:

- Product anchor → `7fdd3b0b...` or newer exact main;
- remove closed BAPT-S12 source defect;
- remove merged #1258/#1259 owner references;
- replace hidden Strangler verifier wording with #1270 merged / truthful 20-blocker state;
- record #1254 final existing-row discovery owner;
- record #1267 current Quiz residual;
- record #1278 as implementation owner for the pre-merge Editorial Metadata freeze root;
- keep #1221 downstream until #1254 lands.
