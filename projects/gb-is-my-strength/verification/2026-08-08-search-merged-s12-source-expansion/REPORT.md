# Search merged; Spravochnik S12 source root expanded by exact-head guard

Date: 2026-08-08
Product repository: `FedorMilovanov/gb-is-my-strength`
Audit repository: `FedorMilovanov/AuditRepo`

## Product anchor

Current verified Product `main`:

`02ee0e35faebe6edde85db4770c0d0a78985e711`

This is merged Search continuation PR `#1209`.

`SEARCH-P3-02` is therefore no longer active work. The temporary self-writing Search finalizer transport was absent from the final net diff before merge; the final Search semantic/runtime guard sequence reached merge and Search no longer owns the Spravochnik PageHead/cache-revision collision.

## New canonical BAPT-S12 source owner — #1253

Open draft PR `#1253`:

`fix(s12): clean Baptist reference metadata at source authority`

Observed exact head:

`8e65a241cdb0ca2feb254bbed3f07da9d36bbb5c`

Base is exact current `main@02ee0e35...`, `behind=0`, initial intended diff exactly two files:

- `src/components/baptisty-rossii/BaptistyRossiiSpravochnikPageHead.astro`;
- `scripts/sources-hygiene.js`.

The PageHead repair is correctly source-layered: it replaces the reader-facing backstage description in normal meta, Twitter, Open Graph and Article JSON-LD with reader-facing historical-reference copy. It does not hand-edit Search manifest, RSS or sitemap.

The guard change also correctly widens the existing `sources:hygiene` owner to include PageHead metadata and adds the surgical `очередь правок 3D-карты` marker/fixture.

## Exact-head Source Authority failure is real Product evidence

`#1253@8e65a241...` is not merge-authorized because Source Authority run `31250265756`, job `93085423606`, fails at the full static-publication `npm run sources:hygiene` step after source-authority regression checks and build succeeded.

Exact failures:

- `src/content/articles/spravochnik.mdx` — working note `очередь правок 3D-карты` ×1;
- `src/components/baptisty-rossii/BaptistyRossiiSpravochnikBody.astro` — same marker ×1.

This is not scanner noise. Direct current-main reads prove both twins contain the same public backstage section:

- heading `Очередь правок 3D-карты`;
- sentence instructing that `/konfessii/russkij-baptizm/` should be edited through application sources/build and **not manually in `_app/index.html`**;
- a list of future map-edit nodes.

Charter S12 explicitly prohibits internal repository paths and service/editorial notes such as `что исправить в 3D-карте`. Therefore merely renaming/removing the matching heading while retaining the `_app/index.html` workflow paragraph would be a false-green repair.

Current open-PR census found no competing open owner for `spravochnik.mdx` or `BaptistyRossiiSpravochnikBody.astro`. Audit comment `5225896409` on `#1253` recommends widening the coherent BAPT-S12 source/guard transaction to clean the MDX twin and production Body as well, while leaving discovery artifacts untouched.

A permanent guard should remain fail-closed against the internal map-workflow/path class so a cosmetic heading rewrite cannot preserve backstage semantics.

## Systemic discovery owner — issue #1252

Product issue `#1252` is now the explicit systemic owner:

`discovery: reconcile existing search-manifest rows from PageHead authority`

It records the already-proven 67/73 existing-row field divergence and the exact root in `scripts/search-manifest-policy-normalizer.js`: canonical `buildManifestItem()` can derive the fields, but migration/write logic skips already-present rows.

No separate implementation PR for `#1252` was verified at this snapshot. It remains intentionally downstream of source cleanup.

Required sequence is now explicit:

1. `#1253` — clean all real Spravochnik source/PageHead S12 surfaces and keep hygiene guard green;
2. `#1252` — reconcile existing Search-manifest rows through the canonical normalizer while preserving non-derived editorial/search extras; regenerate/verify RSS/sitemap downstream projections;
3. `#1221` — absorb clean current main and finish derived `/articles/` catalog projection.

Direct manifest hand edits remain the wrong mutation layer; closed `#1228` remains evidence.

## Catalog PR #1221 remains downstream-blocked

`#1221` still consumes `data/search-manifest.json` as reader-facing catalog metadata authority. It must not merge before `#1252` makes existing-row derived fields truthful.

Its PR body is now additionally stale because it still names active Search `#1209` as the owner blocking Spravochnik PageHead; Search is merged and that collision is gone. The real upstream chain is now `#1253 → #1252 → #1221`.

## Strangler Wave A after Search merge

`#1222` advanced to exact head:

`a83232833bc23f03291c3fed7330f14779f243c5`

Compare against current `main@02ee0e35...` is `behind=0` and still exactly the five intended semantic Strangler files. The extra ancestry delta from its prior head is the merged Search projection/main refresh.

However the hidden self-verifier blocker remains present at this exact head. Current `data/legacy-reference-ledger/manifest.json` still classifies:

`scripts/legacy-shadow-retirement-readiness.mjs`

as:

- `access: fixture-or-contract`;
- `classification: production-required`;
- `quarantineImpact: none-fixture-policy-or-comment-only`.

The readiness script itself still reads governed legacy bytes by active physical path and is not storage-resolver-aware. Therefore its own future post-quarantine mechanical dependency still contributes zero blockers to the arithmetic that can eventually set `physicalMoveAuthorized`.

Fresh exact-head Shared Files and Metadata are already SUCCESS on `a832...`; Source Authority, Deploy, Search Modal, Route Registry and Visual were still running at this snapshot. Even full green CI does not close the semantic misclassification. Audit comment `5225397646` remains the authoritative blocker handoff.

## Home / temporary-artifact recheck

The current Source Authority publication pipeline continues to pass the Home native/source contracts before reaching the new Spravochnik hygiene failure. No new Home regression was found in this wave. The guarded Home surfaces include current Directions/Ambient/Quote/Refutations contracts, and the obsolete temporary `astro.config.dev.mjs` remains absent.

## Audit disposition

- Product code was not modified by this audit.
- `#1209` is retired from active SSOT work because it is merged.
- `BAPT-S12-01` remains active, now with exact source twins exposed by its own guard.
- `#1252` is the explicit downstream systemic discovery owner.
- `#1221` stays blocked until source + manifest authority are clean.
- `#1222` is current-main-clean again but remains blocked by the hidden self-verifier classification.
