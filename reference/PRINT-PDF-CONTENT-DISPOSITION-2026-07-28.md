# Print/PDF content disposition — 2026-07-28

## Scope

Repository: `FedorMilovanov/gb-is-my-strength`  
Current site main inspected: `b40044713b9fa09e404d5f57b2016d31f4cc88c6`

This audit classifies the Reader/Print product chain and its diagnostic witnesses by actual authored content before any working-ref normalization. No branch is classified from its name, age or `superseded` label alone.

## Forensic preservation created first

- combined octopus anchor: `archive/forensic-print-pdf-histories-20260728`
  - anchor commit: `0b1e75008c61ab97f4ae74dcfd4303c88c74343a`
  - parents: current main plus all ten exact PR heads listed below;
- dedicated PR #280 archive: `archive/forensic-print-decoration-pagination-pr280-20260725` at `ccbdb6959cc32d8b9f650b02793222b6e99d8c2b`;
- dedicated PR #288 archive: `archive/forensic-live-print-timing-witness-pr288-20260725` at `b7eb9f8d84a375166956dd87c10cc30d9ce89162`.

The forensic refs are non-merge archives. Restore a historical state by checking out the exact parent SHA, not by merging the octopus anchor.

## Accepted product evolution

### PR #209 — system-wide reader/PDF contract

- head: `ba52d50177af7c2fde62b80ee623cbf93cd43c84`;
- branch: `lane/reader-ui-pdf-system-polish-2026-07-24`;
- established shared reader width, controls and A4 print ownership;
- current branch was rechecked and still equals the accepted head exactly.

Disposition: `PRODUCT_ABSORBED / REF_NORMALIZATION_ALLOWED`.

### PR #235 — neutral paper and pagination integrity

- head: `565bd033f93a3ee88a51104e7c34aadc2c4c390e`;
- branch: `fix/reader-print-paper-contract-2026-07-24`;
- established neutral paper palette, balanced 14 mm page box, blank-page and saturated-fill detection;
- current branch was rechecked and still equals the accepted head exactly.

Disposition: `PRODUCT_ABSORBED / REF_NORMALIZATION_ALLOWED`.

### PR #257 — Gill series overview pagination

- head: `1647e687e8e92dcbd9aaf3e87190bf962bd6d2e4`;
- branch: `fix/gill-series-print-orphan-2026-07-25`;
- bound the Gill series eyebrow, explanation and four cards into the intended print flow;
- current branch was rechecked and still equals the accepted head exactly.

Disposition: `PRODUCT_ABSORBED / REF_NORMALIZATION_ALLOWED`.

### PR #263 — universal semantic pagination engine

- head: `15436ad01e75878dd336b865c06f69dcc631a8d6`;
- branch: `fix/universal-print-pagination-marathon-2026-07-25`;
- replaced route-specific print patches with semantic atomic, keep-with-next and closing-group ownership;
- added multi-route marker PDF and raster evidence;
- current branch was rechecked and still equals the accepted head exactly.

Disposition: `PRODUCT_ABSORBED / REF_NORMALIZATION_ALLOWED`.

### PR #283 — progress decoration and reversible-card integration

- head: `b110450cb9cb47974e96e51ff15b618c448f63f5`;
- branch: `fix/print-decoration-pagination-final-2026-07-25`;
- removed the repeated warm-gold screen progress decoration from paper;
- integrated generic reversible-card families into semantic pagination;
- current branch was rechecked and still equals the accepted head exactly.

Disposition: `PRODUCT_ABSORBED / REF_NORMALIZATION_ALLOWED`.

### PR #286 — physical front/back reversible-card proof

- head: `4dc1e155b990660687c568ded5541c10768d5d1c`;
- branch: `fix/print-reversible-card-physical-contract-20260725`;
- exposed and repaired the flipped-back `matrix3d(...)` specificity defect;
- made screen front/back behavior, physical front/back marker PDFs, raster audit and DOM restoration permanent;
- current branch was rechecked and still equals the accepted head exactly.

Disposition: `PRODUCT_ABSORBED / REF_NORMALIZATION_ALLOWED`.

## Superseded diagnostic PR #280

PR #280 head: `ccbdb6959cc32d8b9f650b02793222b6e99d8c2b`.

Actual file-level findings:

1. `scripts/print-pagination-contract.mjs` already contained the generic branding/progress/reversible-card DOM checks that were cleaned and accepted in PR #283.
2. `scripts/print-pagination-raster-audit.py` contained the amber-header detector, but also accidentally defined `paper_ratio_around()` twice. PR #283 retained the detector and removed the duplicate definition.
3. `scripts/print-reversible-card-contract.mjs` provided a valuable focused physical proof: print the real card in front and flipped-back states, place start/end tokens inside the active face and verify with `pdftotext` that the face remains on one physical sheet.
4. That focused proof was not lost. PR #286 restored and strengthened it after it exposed a genuine flipped-back source defect.
5. Current `main` contains a 262-line permanent version that additionally verifies real screen transforms, independent print preparation, clean one-sheet raster inputs and complete DOM/runtime cleanup.

PR #280 itself is therefore not canonical as a product state, but it is an important diagnostic history and is preserved by both the combined anchor and the dedicated PR #280 archive.

The current working ref `fix/print-decoration-pagination-2026-07-25` is **not** equal to the PR #280 head. It has two additional commits modifying:

- `scripts/tooltip-style-normalizer.js`;
- `scripts/tooltip-style-normalizer-test.js`.

Those commits are outside this print disposition.

Disposition: `FORENSIC_DIAGNOSTIC_PRESERVED / CURRENT_REF_NORMALIZATION_FORBIDDEN_PENDING_TOOLTIP_AUDIT`.

## Production-proof witnesses

### PR #234

- head: `69b8cf0df189434f6e80bdd6a96c8f2336013ea6`;
- first temporary post-merge production proof;
- evidence-only, no product merge authority.

### PR #253

- head: `2a6881d0be4ce87bdcbc75b3edeea56eb4021ab1`;
- superseded production-proof lane for the older print contract;
- evidence-only, no product merge authority.

Both PRs reused `verify/reader-production-postmerge-2026-07-24`. That current branch now contains a much later repository state and differs from PR #253 by 99 commits ahead / 9 behind. It is explicitly excluded from this normalization.

Disposition: `HISTORICAL_HEADS_ANCHORED / CURRENT_SHARED_REF_NORMALIZATION_FORBIDDEN`.

### PR #288

- head: `b7eb9f8d84a375166956dd87c10cc30d9ce89162`;
- branch: `verify/live-print-decoration-2026-07-25`;
- obsolete timing witness: it observed old public revisions while the intended deployment was still in progress;
- its result is neither a product regression nor proof of successful publication;
- the branch was rechecked and still equals the exact witness head;
- the witness has a dedicated forensic archive.

Disposition: `OBSOLETE_TIMING_WITNESS_PRESERVED / REF_NORMALIZATION_ALLOWED`.

## Current main is a strict evolution

Current `main` retains and strengthens the accepted chain:

- `.github/workflows/print-paper-contract.yml` invokes:
  - static print-geometry ownership validation;
  - canonical PDF audit;
  - five-route semantic pagination matrix;
  - independent physical front/back reversible-card proof;
  - raster audits for both route and card PDFs;
- `scripts/print-reversible-card-contract.mjs` verifies screen front/back transforms, print front/back physical pages and cleanup;
- `src/runtime/print-pagination-geometry.js` is a route-agnostic print-only fragmentation fallback layered under the semantic owner;
- `scripts/check-print-geometry-contract.js` forbids manual page arithmetic and forced breaks, requires lifecycle reversibility and protects ownership ordering.

No route-specific article selector, manual modulo/page-offset calculation or blind forced page break is accepted as the canonical solution.

## Authorized normalization set

Only these seven current refs are authorized for force movement to the then-current site `main`, after a final exact-head recheck immediately before mutation:

1. `lane/reader-ui-pdf-system-polish-2026-07-24`;
2. `fix/reader-print-paper-contract-2026-07-24`;
3. `fix/gill-series-print-orphan-2026-07-25`;
4. `fix/universal-print-pagination-marathon-2026-07-25`;
5. `fix/print-decoration-pagination-final-2026-07-25`;
6. `fix/print-reversible-card-physical-contract-20260725`;
7. `verify/live-print-decoration-2026-07-25`.

No branch deletion is authorized.

## Explicit exclusions

Do not move or delete these refs under this disposition:

- `fix/print-decoration-pagination-2026-07-25` — contains an unaudited tooltip-normalizer tail beyond PR #280;
- `verify/reader-production-postmerge-2026-07-24` — reused shared witness ref with a much later state.

## Publication boundary

This audit changes no product content, route, draft state, publication state or deploy workflow. It authorizes only evidence-backed ref normalization after forensic preservation.