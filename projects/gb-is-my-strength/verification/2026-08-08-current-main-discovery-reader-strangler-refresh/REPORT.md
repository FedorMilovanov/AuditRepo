# Current-main discovery / reader / Strangler refresh — 2026-08-08

## Purpose

Successor verification to `2026-08-08-s12-manifest-gill-disposition-reconciliation`. The earlier report remains historical evidence for the state it observed; this report records the materially newer Product state after four additional merges, canonical Search-manifest materialization, a new deterministic downstream failure, and successor ownership for the hidden Strangler verifier.

## Exact Product main

Current verified Product main:

`3d76a2b106eec815c0a0fe2e07fb845c660a01f8`

Merge chain after the prior reconciliation anchor:

1. `9c0ca2bcd81476e8e7a961bfbd68e9a0f589b9a1` — `fix(reader): derive mobile series Back from config (#1258)`;
2. `c2bf970bbf6bcb3d9dce3fe8a0fc37d57a653ca0` — `fix(reader): align control surface relations on current main (#1259)`;
3. `3860b4919ab37c9ecdcfb5539d7aece335e37a0f` — `fix(s12): clean Baptist reference metadata at source authority (#1260)`;
4. `3d76a2b106eec815c0a0fe2e07fb845c660a01f8` — `refactor(strangler): make audit-pro corpus storage-agnostic (#1257)`.

No newer Product main commit was observed at this refresh.

## Closed / materially advanced rows

### BAPT-S12-01 is no longer an active source defect

Product #1260 is merged. Its final history includes the missing independent guard work from the predecessor audit:

- independent `_app/index.html` generated-app path witness;
- Baptist reader-config scan for backstage labels;
- PageHead + MDX + production Body cleanup while preserving historical map content;
- no direct hand-edit of Search Manifest/RSS/sitemap in the source lane.

Therefore the old `BAPT-S12-01` direct defect row must be removed from active MASTER work. Its historical chain remains:

`#1253 SELECTIVE_RECOVERY → #1260 merged`.

### Reader shared-control slices advanced

Product #1258 and #1259 are merged.

- #1258 closes the 174 shared mobile Back-authority manifestations by deriving the mobile Back target from required `config.railBackHref`.
- #1259 closes the bounded control→surface relation slice. Its exact final head `eb649631d3714c764d7460de70087fd3c4a08cf7` had Runtime Interactive, Reader Controls Accessibility, Shared Files, Deploy Candidate, Visual Parity, Metadata and Glossary workflows terminal SUCCESS.

The reader SYSTEM root remains open for residuals, but MASTER must no longer list #1240/#1246/#1258/#1259 as active owners.

## Reader residual: conditional Quiz panel

Product #1267 remains open at exact head:

`238492d312a8e53d2f84e2cf292dad25c51167d7`

It changes only:

- `src/components/article-pilots/gill-series/GillLearningSheet.astro`;
- `scripts/series-reader-facade-regression-test.js`.

The source defect is valid: `tabQuiz` is conditional on `hasQuiz`, while the old `panelQuiz` remained unconditional with `aria-labelledby="tabQuiz"`; Baptist `quiz: []` provides the no-quiz witness.

Current ancestry is stale: base is merged #1259 `c2bf970...`, while current Product main is `3d76a2b...` (two later commits).

Recorded Runtime Interactive red is not demonstrated to be caused by the Quiz repair. Exact failure is Home Chromium/WebKit assertion:

`canonical Search shortcut from mobile menu: body position remained fixed`

Evidence against causal attribution:

- final #1259 exact head passed Runtime Interactive;
- #1267 touches only Gill Quiz + facade regression files;
- the two Product-main commits after #1259 touch Baptist S12 and Strangler files, not Home runtime or special Home owners.

Required disposition: refresh #1267 to current main without widening semantic scope, rerun exact-head CI, and do not weaken/change Home contract inside this reader lane. If the Home assertion reproduces on the refreshed head, promote it separately with fresh Home lifecycle evidence.

## Search-manifest existing-row reconciliation: canonical writer has materialized

Product #1254 is the active SYSTEM implementation owner for #1252.

After source #1260 merged, the authorized canonical Search autofix ran. Bot commit:

`b4bc7f5b707c555a50faa06be5d25fc7392b0d91`

changed only:

- `data/search-manifest.json`;
- `feed.xml`.

Inspection found no semantic value mutation lines for existing-row `editor`, `publishedTime`, `modifiedTime` or `priority`. The intended existing-row authority model remains narrow:

- owned: `title`, `description`, route-policy `section`, explicit `image`, canonical `readTime`;
- preserved: `editor`, `tags`, dates, `priority`, `featured`, `scripture`, author/series/word-count/future extras.

Transport PR #1269 then merged current Product main into #1254. Current exact #1254 head:

`8797730f757fe89297c4ec4cb1dd171c436cfc70`

Current ancestry:

- merge-base = `main@3d76a2b...`;
- `behind=0`;
- semantic diff = five files: Search Manifest workflow, normalizer, tests, generated `data/search-manifest.json`, generated `feed.xml`.

### New exact-head blocker: Scripture occurrence projection is stale

Fresh exact #1254 `Scripture Occurrence Index Contract` run `31273266864`, job `93142683470`, fails:

`SCRIPTURE OCCURRENCE INDEX FAILED: data/scripture-search-index.json is stale; run with --write`

This is a real deterministic downstream projection, not Scripture-source corruption.

`build-scripture-occurrence-index.mjs` explicitly declares `data/search-manifest.json` as input and derives occurrence title/topics/scripture metadata from it. Therefore Search Manifest metadata normalization can legitimately stale the committed occurrence index.

Canonical repair is writer-layered: invoke the existing `build-scripture-occurrence-index.mjs --write` after manifest normalization in the authorized projection transaction, audit the generated diff, and require its read-only check / Scripture Occurrence workflow green on the final exact head. No JSON hand-edit.

### Collision with downstream catalog #1221 is sequencing, not dual authority

Product #1221 currently also changes `data/scripture-search-index.json`, but its patch is deterministic writer output caused by removing old `ArticlesPublicationsSection.astro`; ten stale `/articles/` prose occurrences are removed.

Thus the correct sequence is:

1. #1254 regenerates the occurrence index from the new Search Manifest state;
2. #1254 lands;
3. #1221 absorbs clean discovery authority, removes the old catalog source, and regenerates the same canonical index again from the new source graph.

The current #1221 generated blob is downstream/stale and must not become an upstream authority or be copied into #1254.

## Catalog #1221 remains downstream

Product #1221 remains open/draft at `0c779df113b5716a200bda023d356ef33cdade22` with six files, including `data/scripture-search-index.json` as generated output.

Its body still contains stale Search/S12 owner language. It must absorb #1254 after discovery convergence, re-run its derived catalog projection and Scripture index, and only then obtain fresh exact-head acceptance.

## Strangler current-main truth

Product #1257 merged the audit-pro storage-aware slice. Its displayed readiness arithmetic reached raw `blockers=20`, but current `main@3d76a2b...` still contained one hidden physical reader outside that arithmetic:

`scripts/legacy-shadow-retirement-readiness.mjs`

was still ledger-classified as nonblocking while directly reading governed active-root bytes.

Therefore immediately after #1257 merge the truthful physical-safety backlog remained 21 known readers/dependencies: 20 counted + this hidden verifier.

### Successor #1270 now owns the hidden verifier

Product #1270 is open/draft, base exact `main@3d76a2b...`, current head:

`ff1c21c5a9b12d67874ad8f915a00cc04a3b8bee`

Scope remains three files:

- `scripts/legacy-shadow-retirement-readiness.mjs`;
- `data/legacy-reference-ledger/manifest.json`;
- `scripts/legacy-reference-path-contract-test.js`.

Intent is correct: use existing logical-reference storage resolver, preserve immutable logical identity, add quarantine-only and ambiguity fail-closed tests, and make raw 20 truthful rather than decrementing to 19.

First predecessor head `b2fca96f...` failed Shared Files because the ledger evidence token no longer existed in source. Current successor `ff1c21c5...` adds a follow-up change only in the verifier and fresh exact-head workflows are running. Do not carry the predecessor red onto this successor; do not merge until current Shared Files / Deploy / applicable gates are terminal green and the inventory evidence-token contract remains truthful.

## New SYSTEM control-plane root: Editorial Metadata pre-merge freeze

Product issue #1272 was created from this audit:

`ci(metadata): enforce editorial date projection freeze before merge`

Verified gap:

- `editorial-metadata-freeze-audit.js` is the real final date-projection authority and checks Search dates, RSS, sitemap lastmod, PageHead and JSON-LD against approved/frozen Editorial Metadata v3;
- push-main `deploy.yml` runs it before promotion;
- PR `Editorial Metadata v3` does not apply to ordinary Search-manifest edits;
- PR Metadata/IndexNow diagnostics do not build dist/run freeze-audit;
- PR Deploy Candidate already builds production-like dist and applies broadly, but does not currently invoke the freeze-audit.

Therefore production promotion is fail-closed, but merge safety is not. Bounded repair: add the existing freeze-audit to the already-built PR Deploy Candidate path, with no second build, registry or writer, and pin it with a regression contract.

This is separate from #1254 existing-row ownership; do not widen Search Manifest date ownership.

## Home / Arena hygiene recheck

On current Product `main@3d76a2b...`:

- `astro.config.dev.mjs` is absent (404);
- `.github/workflows/arena-release-quote-inset-fix.yml` is absent (404);
- merges #1260/#1257 did not touch `Directions.astro`, `HomeAmbientPhrases.astro`, `HomeAmbientInteraction.astro`, `HomeResponsiveContracts.astro`, `Quote.astro` or `Refutations.astro`.

No new direct Home regression is promoted by this refresh. Old Ambient/Responsive ownership debt remains backlog, not a newly evidenced current defect.

## MASTER reconciliation required

Against the prior MASTER snapshot, update dispositions as follows:

1. Product verification anchor → `3d76a2b106eec815c0a0fe2e07fb845c660a01f8`.
2. Remove active `BAPT-S12-01`: successor #1260 merged and closed source + independent internal-path guard.
3. In `SYS-READER-CONTROL-SEMANTICS`, retire merged #1258/#1259 and promote #1267 as the current bounded conditional-Quiz residual, with mandatory current-main refresh and no Home-scope widening.
4. Replace old #1222/#1257 Strangler wording with current successor #1270 / hidden-verifier repair; raw 20 becomes truthful only after #1270 exact-head acceptance.
5. Record #1254 current head `8797730f...`, canonical manifest/feed materialization, `behind=0`, and current Scripture occurrence deterministic projection blocker.
6. Keep #1221 downstream of #1254 and require its generated Scripture index to be regenerated after absorbing discovery authority.
7. Add Product #1272 as a SYSTEM control-plane lane for pre-merge Editorial Metadata date projection freeze.
8. Preserve Home hygiene: no temporary Arena config/writer returned.

Do not calculate a new Active Work count by arithmetic from this report alone. Recount rows from the resulting MASTER after removing closed owners and adding #1272 / current residual owners.

## Immediate sequence

1. #1254: repair deterministic Scripture-index projection through existing canonical writer; fresh exact-head parity/Scripture/Search/Shared/Route/Deploy evidence.
2. #1270: finish storage-aware self-verifier; require current exact-head Shared Files and adversarial quarantine/ambiguity proof.
3. #1267: refresh onto current main and rerun without touching Home contract.
4. #1272: wire Editorial Metadata freeze into existing PR Deploy Candidate build, no second build/writer.
5. #1221: only after #1254 lands, absorb clean discovery state and regenerate catalog + Scripture derivative.
