# CURRENT HEAD REVERIFY — 2026-07-25 — `9407cc92` Genesis 6 Research provenance

## Boundary

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Exact source main: `9407cc92eb22dc6eab76f831df35a09429663e3e`
- Exact imported production authority: `f5e29998c5b42cc9e4e7c917b1e1c1072aa52320`
- AuditRepo authority before reconciliation: `5828d9ef12dfe611e6991d524838455b7f58f62d`
- Exact Research repository: `FedorMilovanov/Research`
- Exact Research commit: `9bba3d45d3475468798f69e4b6067acae673b79c`
- Date: 2026-07-25

This witness advances source and provenance-CI truth only. It does not claim Genesis 6 route activation, publication, readiness, Pages deployment, live publication or whole-release artifact identity for `9407cc92`.

## Accepted source chain

PR #348 merged as `9407cc92eb22dc6eab76f831df35a09429663e3e` from exact head `ce75fcde235d8542d7cde8e7ab07270455234739` on `main@b594ba82afbbefb8cc5c27ea2604d9f308392daa`.

Final scope was exactly three files:

- `.github/workflows/genesis6-research-provenance.yml`;
- `data/genesis6-research-provenance.json`;
- `scripts/genesis6-research-provenance-contract.mjs`.

No route, MDX, cover, theme, CSS, generated-output or publication-state file changed.

## Exact Research authority

The site registry pins:

- Research commit `9bba3d45d3475468798f69e4b6067acae673b79c`;
- authority base `b654c5375a7b212ff9b42c08bb0193eeaad70746`;
- manifest path `data/genesis6-authority-manifest.json`;
- manifest SHA-256 `95320cc56c678fcacf4f24985f96150c231b1d91338349c19005e277b16125dd`;
- publication ledger `data/genesis6-publication-ledger.json`;
- authority contract `GENESIS6_AUTHORITY_CONTRACT.md`.

The registry binds articles 6–9 to exact bundle IDs, reader-base IDs, ordered document IDs and rights-decision IDs.

## Permanent provenance contract

The read-only workflow:

1. checks out site source with credentials disabled;
2. checks out the exact Research SHA with credentials disabled;
3. runs Research’s own `validate_genesis6_authority_manifest.py` authority-graph validator;
4. validates the pinned Research HEAD, manifest digest, authority-base commit, ledger, bundles and rights decisions from the site;
5. uploads run-addressed evidence even on failure.

Workflow actions are pinned by full commit SHA. Permissions are `contents: read` only.

## Publication safety boundary

The site registry permanently requires:

- `defaultState: draft-noindex`;
- exact Research commit;
- exact manifest digest;
- exact-head site evidence;
- a separate production witness.

Research provenance success does not itself create or publish a route.

## Exact-head evidence

Exact PR head `ce75fcde235d8542d7cde8e7ab07270455234739` passed:

- Genesis 6 Research provenance run `30176399705`;
- Shared Files Guard run `30176399710`;
- Visual Parity Guard run `30176399701`.

Research issue #16 is closed completed.

## Activation boundary

Source issue #287 is closed as archived/not-planned transport history. It explicitly must not be reconstructed or reopened as a product lane.

`GENESIS6-ACTIVATION-OWNER-GAP` remains open because:

- no current product-finalizer PR exists;
- canonical MDX/routes were not introduced by #348;
- exact-head Astro/build/Chromium/WebKit and publication-state evidence for a product change do not yet exist;
- `draft-noindex` remains the safe default.

A future product owner must start from fresh current `main`, consume the pinned provenance registry, use the shared `SeriesReaderChrome` façade with `defineSeriesConfig(...)`, and pass ordinary product/publication review.

## Current ownership at capture

- No open source pull request exists.
- No current Genesis 6 activation/finalizer owner exists.

Refresh source main and ownership before every future action.

## Production boundary

Exact imported production authority remains `f5e29998` only:

- readiness `30169126149`;
- deploy `30169443420`;
- Pages deployment `5603663894`;
- Pages artifact `8622641548` (`sha256:38a3a138d9f062e43c0e3ed52666113759d310cb0231e2ee388fc522b25e2b2c`);
- TTS artifact `8622642553` (`sha256:bacb0330c7a2201289eeeb7d2b9b9dc832106eec292cd890afc1c5819e1eec7f`).

No exact readiness, same-artifact Pages promotion or live witness for source `9407cc92` is imported here. Whole-release identity and build-once promotion remain #292/#295.
