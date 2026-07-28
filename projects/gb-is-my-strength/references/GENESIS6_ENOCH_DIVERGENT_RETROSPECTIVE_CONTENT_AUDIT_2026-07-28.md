# Genesis 6 / 1 Enoch divergent-history retrospective content audit

**Date:** 2026-07-28  
**Site repository:** `FedorMilovanov/gb-is-my-strength`  
**Audited site main:** `0a5333f35010a8f2597c05cd958b36634342b61d`  
**Recovery ledger:** `GENESIS6_ENOCH_REMOTE_REF_RECOVERY_LEDGER_2026-07-28.md`  
**Forensic octopus anchor:** `1c4fc6d701f4fa7925a9d51c550fb56f6fb46a5a`  
**Anchor ref:** `archive/forensic-genesis6-enoch-divergent-histories-20260728`

## Purpose

This is the retrospective file-level audit required after sixteen divergent Genesis 6 / 1 Enoch refs were normalized during branch hygiene. Branch names, age, PR state and successor labels are not treated as sufficient evidence.

For every state S1–S16 the review considered the actual changed-file surface, representative or exact blobs, current `main`, merged PR history and the replacement contract. The octopus anchor keeps every original commit reachable. Two states containing independently useful material also receive dedicated archive refs.

## Disposition vocabulary

- `PRESERVED-BYTE-FOR-BYTE`: the exact product blob remains in current `main`.
- `PRESERVED-BY-MERGED-PRODUCT`: the exact reviewed product head was merged and the product paths have not changed afterwards.
- `SUPERSEDED-WITH-EVIDENCE`: the earlier function or text is represented by a named stricter current implementation.
- `TRANSIENT-ONLY`: only temporary workflow, trigger, carrier or generated transport existed; no product recovery is justified.
- `FORENSIC-ARCHIVE-RETAINED`: useful unique material is intentionally kept outside `main` for later selective review.
- `REJECTED-INTERMEDIATE-DEFECT`: an intermediate change was not carried forward because it damaged a current contract.

## Global preservation action

The archive commit `1c4fc6d701f4fa7925a9d51c550fb56f6fb46a5a` has current site `main` as its first parent and all sixteen original divergent commits as additional parents. Its tree contains only a recovery manifest. It must never be merged into `main`.

Dedicated archive refs:

1. `archive/forensic-genesis6-original-visual-set-20260724` → S1 `eeec6d967b3978d3315b3796d75f5a9d250d85f7`.
2. `archive/forensic-genesis6-footnote-carrier-20260727` → S11 `527af2d3f77f1420f0fac5122acdca782ea9e153`.

These refs are protected forensic sources, not active product branches.

## S1 — early articles 6–9 and twenty visual files

**Original:** `eeec6d967b3978d3315b3796d75f5a9d250d85f7`  
**Former ref:** `lane/genesis6-final-mdx-2026-07-24`

### Internal content

- four MDX articles: articles 6, 7, 8 and 9;
- ten AVIF and ten WebP series visuals, numbered `00`–`09`.

### Findings

The current articles are expanded editorial successors. For example, the early article 7 blob was `6c27c7a50a1bd1a231ed9b887478e8690a5250f4`; current article 7 is `3a480ccdc8761de527d66f65d1922e7b9dd754c2` and adds the full 6A/6B related graph, Matthew 22:30 boundary, additional canonical/noncanonical distinctions and a longer source apparatus.

The early visual set cannot be classified from names or extensions. At least one directly inspected old/current pair is a different blob: `07-angels-kept-under-darkness.avif` old `e9f235d17d6a50fc591bb476bcdf7b43ded78087`, current `84318e0665fde6fecb7fd60da7db26aa38ee5b4b`. The complete early set is therefore retained for visual comparison rather than declared redundant.

### Disposition

- MDX: `SUPERSEDED-WITH-EVIDENCE` by the current expanded articles.
- visual files: `FORENSIC-ARCHIVE-RETAINED` in the dedicated S1 archive.
- no wholesale product merge from S1 is allowed.

## S2 — early provenance plus JSON theme registry

**Original:** `631e6681955c0148a775a7954252be3330340fba`  
**Former ref:** `lane/system-genesis6-provenance-theme-2026-07-25`

### Internal content

- early provenance workflow, schema-1 provenance JSON and validator;
- `data/series-theme-registry.json`;
- scoped Genesis styling in core CSS;
- broad generated cache-bust edits and a temporary retrigger file.

### Findings

The old workflow pinned Research `9bba3d45...` and ran one site validator. Current workflow pins final Research `0a9105c499fa801f4095bce7ec311fcb728206a7`, runs legacy and extension authority validators, runs the exact footnote gate, validates site provenance and uploads durable evidence.

The old provenance JSON covered articles 6–9 at schema 1. Current schema 6 adds reader order 6 → 6A → 6B → 7 → 8 → 9, extension manifest digest, two remaining blocking holds, evidence resolutions for 10:8 and 15:8–12, no-reproduction rights policy, exact related/canonical/frontmatter gates and site acceptance.

`data/series-theme-registry.json` is absent from current `main`, but its function was not lost. Current `scripts/check-engine-contracts.js` reads typed `*SeriesConfig.ts` files declared through `defineSeriesConfig()`, extracts each `theme:` value and requires a matching `css/series-<theme>.css`. This is stricter than the disconnected two-entry JSON registry.

### Disposition

- authority and theme registry: `SUPERSEDED-WITH-EVIDENCE` by schema 6 provenance and typed series-config/theme contract.
- cache-bust and retrigger material: `TRANSIENT-ONLY`.

## S3 — snapshot workflow

**Original:** `22463ba5988c6153ad4c8ec5a7edf4ead3db9a0d`  
**Former ref:** `temp/genesis6-main-snapshot-20260725`

### Internal content

- `.github/workflows/genesis6-main-snapshot.yml`;
- `tmp-genesis6-snapshot-trigger.txt`.

### Disposition

`TRANSIENT-ONLY`. There is no article, asset, registry, route or permanent validator content.

## S4 — manuscript theme

**Original:** `5351c35d62a41edd9a3b9853d423f7f275d2e0e8`  
**Former ref:** `lane/system-genesis6-manuscript-theme-2026-07-26`

### Internal content

- `css/series-manuscript.css`, 756 lines;
- cache-bust and contract references.

### Proof

Old and current `css/series-manuscript.css` have the same Git blob:

`950271eab6797cd2037c263314eb32cc25de0a87`

### Disposition

`PRESERVED-BYTE-FOR-BYTE`.

## S5–S8 — claim-level source-apparatus variants

### States

- S5 `5864fdeb8e9ef7499420a51b35021e62bca151cc`;
- S6 `cd25cb20c545a53236bbff25053ca432b6a816f9`;
- S7 `c7398ee5f0867a473fba06fd7143e3b0c7f49811`;
- S8 `b0d2e6e791ca45b9fa7efed9aeae1c8773357264`.

### Internal content

The chain changes the 6A/6B MDX articles, footnote gate JSON and gate script. S6 is an early insertion-pending state. S5/S7 enforce 27/26. S8 experiments with exact sets 28/27.

### Extra-footnote review

The S8-only 6A `[^28]` cited Knibb, Nickelsburg–VanderKam and Erho–Stuckenbruck for the general distinction between full Geʽez 1–108 transmission and fragmentary Qumran evidence. Current 6A retains the same substance but splits it into more exact body claims and `[^1]–[^3]` rather than attaching one overview note to a summary bullet.

The S8-only 6B `[^27]` was a broad bibliography attached to the general statement that claims must be evaluated separately. Current 6B preserves that conclusion while binding sources to the specific textual, canonical and reception claims and to the Research evidence decisions.

Current gate is schema 2 with exact contiguous definitions 1–27 and 1–26, all definitions required and used, plus draft/noindex/sourcesRequired and exact-set enforcement.

### Disposition

- S6: `SUPERSEDED-WITH-EVIDENCE` by the completed insertion.
- S5/S7: incorporated into current 27/26 product.
- S8: `SUPERSEDED-WITH-EVIDENCE`; the two extra overview notes contain no unique claim or source family, but remain historically reachable through the anchor.

## S9–S10 — extension routes

### States

- S9 `8f086c94f90204799b3f93c2a4593b5065b19bb6`;
- S10 `d04cf7610a678619bed170a9d4d971dbcb4293df`.

### Internal content

Two strict-native route profiles, route source pages, Genesis series config/data, site registration and migration ownership.

### Proof

Current route-profile blobs exactly equal the S10 product:

- 6A profile: `19f4233f0c0131d2c6d4fda5de1a1978ba45ea9a`;
- 6B profile: `f4bedff1015ac8284450c3a4ab18d972b6724531`.

S9 differs from S10 in profile formatting only, but also contains an intermediate destructive shrink of `migration/page-ownership.json` (approximately 493 deleted lines). S10 restores bounded ownership additions and is the valid successor.

### Disposition

- S10 route product: `PRESERVED-BYTE-FOR-BYTE` for the route profiles and preserved through the current route system.
- S9 ownership shrink: `REJECTED-INTERMEDIATE-DEFECT`.

## S11 — deterministic footnote carrier

**Original:** `527af2d3f77f1420f0fac5122acdca782ea9e153`  
**Dedicated archive:** `archive/forensic-genesis6-footnote-carrier-20260727`

### Internal content

- temporary workflow `genesis6-footnote-carrier.yml`;
- `scripts/build-genesis6-footnote-product.py`, blob `250f99d0c6f8613d6a62157db3db484f92012c20`;
- `scripts/finalize-genesis6-footnote-product.py`, blob `f2d264cbcd84ef8bb3cdebd7c9ee0cb326b3c3bb`.

### Value

The Python scripts preserve a reproducible migration technique:

- exact baseline Git-blob assertions;
- replacement cardinality checks;
- explicit mismatch inventory;
- deterministic generation of four product files;
- byte length, SHA-256 and Git-blob manifest;
- shadow-root validation with the final Node gate.

The workflow is temporary and must not return to `main`, but the scripts are useful forensic methodology.

### Disposition

`FORENSIC-ARCHIVE-RETAINED`. The dedicated archive ref is the canonical exact source. Any reuse must copy a bounded method into a current-main successor; the old carrier workflow must never be merged.

## S12–S13 — 15:8–12 authority pin

### States

- S12 `9e306fa7dc37a0fd54ff6f35589f85a5958a84fe`;
- S13 `f4f803c598b7dc17804fb19d7e8839c2916d53c5`.

### Proof

Both states contain the same provenance JSON blob:

`968c45f7d19bff097d4fc58566ac019d95736c31`

It already has schema 6, two blockers and evidence resolutions for 10:8 and 15:8–12. Current `main` retains this structure and changes the pinned Research commit from the intermediate `11e86a120...` to final `0a9105c499...`.

### Disposition

`SUPERSEDED-WITH-EVIDENCE` by the identical final model pinned to the final Research main.

## S14 — accepted reader-source audit

**Original:** `b315998937e4fdd68e204d01660adb65707cd0e6`

### Proof

- S14 6A blob: `4896a78591538f56a1a5f1db35131d12677d7c70`; current 6A has the same blob.
- S14 6B blob: `c57db2e7c8a5140fdf96869794d284128653630c`; current 6B is a later authority-synchronized reader version.
- current provenance explicitly records `siteAcceptance.acceptedHead = b315998937e4fdd68e204d01660adb65707cd0e6` and claim-level groups 27/26.

The later 6B changes do not remove the source apparatus; they update 10:8 and 15:8–12 reader classifications to the final Research decisions.

### Disposition

- 6A: `PRESERVED-BYTE-FOR-BYTE`.
- 6B source apparatus: preserved; reader wording `SUPERSEDED-WITH-EVIDENCE` by the final authority sync.

## S15 — early Research authority pin

**Original:** `bb2843bf0d0f31aa16c8310db5a6d8319d3c4973`

### Internal model

Schema 4 pinned Research `0861a773...`, listed four blockers (10:8, 15:8–12, 70–71 and Astronomical Book) and contained no evidence-resolution objects.

### Current replacement

Current schema 6 retains 70–71 and Astronomical Book as blockers, moves 10:8 and 15:8–12 into explicit `resolvedByEvidence`, preserves their remaining interpretive/version uncertainty and adds evidence-resolution binding.

### Disposition

`SUPERSEDED-WITH-EVIDENCE`; no authority information is silently discarded.

## S16 — repaired production visual set

**Original exact PR head:** `c8b9cd771a62a75ffda6a3e5f34bcc11cdc692a7`  
**Merged PR:** site #420  
**Merge commit:** `949bb39797cfdce6630700c97ffb65f960b61958`

### Internal content

- ten verified AVIF files;
- ten deterministic WebP derivatives;
- 311-line provenance/codec/hash/alt-text manifest.

### Proof

- exact head #420 was merged;
- merge commit is an ancestor of audited site `main`;
- comparison from merge commit to audited `main` contains no `public/images/articles/genesis6/**` paths;
- old and current manifest Git blob: `0657131facc02af63ab7afb99bc7978be4ae9862`;
- inspected `00-series-guide.avif` old/current Git blob: `51323a4c098fedf0bf71f25c5abd45ecbba7c99f`.

### Disposition

`PRESERVED-BY-MERGED-PRODUCT`. The current production images are the S16 repaired set. S1 remains a separate earlier visual archive, not a replacement candidate by default.

## Final conclusion

The retrospective review found no missing Genesis 6 / 1 Enoch article, route, authority decision, manuscript theme or repaired production image in current `main`.

Two kinds of unique non-product material were found and explicitly retained:

1. the earlier S1 visual variants, pending visual comparison;
2. the S11 deterministic footnote-carrier methodology.

No further normalization or deletion of the three forensic refs named in this document is authorized. Future cleanup must inspect actual file content and record a successor or archival destination before moving any ref.
