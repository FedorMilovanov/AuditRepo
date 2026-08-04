# CURRENT HEAD REVERIFY — Avraam duplicate river rendering

- Date: 2026-08-04
- Source repository: `FedorMilovanov/gb-is-my-strength`
- Canonical findings: `RIVER-P1-05`, `DRAW-P1-02`
- Current Product anchor: `0fbe7d1ead9ebd1bea867418e254da438ec63329`
- AuditRepo base: `d7daa52214ac6995bb4789a33634ff9cb86a6ccc`
- AuditRepo closure lane: PR #139
- Current production claim: **none**

## Original claims

- `RIVER-P1-05`: duplicate river channel lines in `base-geo.svg` under `waterRipple` produced a doubled line near coasts.
- `DRAW-P1-02`: obsolete river channels over marine strokes produced the same visible doubled-line defect.

The two IDs describe one source root cause, not two independently repairable defects.

## Disposition

### `RIVER-P1-05` — fixed-current

### `DRAW-P1-02` — duplicate / merged into `RIVER-P1-05`

Product commit `39df9ed0e650cc08f93c14145cb592868f0c80e4` identified and removed the exact bounded root cause:

- a second Nile group under `filter="url(#waterRipple)"` duplicated the legacy river channel;
- the duplicate group included a parallel main stem, five delta arms and a glow stroke;
- the duplicate group was removed in full rather than hidden with opacity or masked by a repaint;
- the retained legacy Nile system was completed as one south-to-north stem with five asymmetric delta arms opening toward the sea;
- grouped river paths inherited non-scaling stroke protection through the added grouped-stroke selector;
- the same repair added a browser visual gate for land routes intersecting water fills.

The original Product commit has no GitHub Actions run attached, so it is not used as stand-alone CI authority. Its source diff is combined with current-head source evidence below.

## Current-head source witness

At current Product anchor `0fbe7d1ead9ebd1bea867418e254da438ec63329`:

- `karty/_engine/base-geo.svg` contains the explicit single-system invariant: the Nile lives in one river group, and the former parallel `waterRipple` Nile is absent;
- only the delta labels remain at the former duplicate-group location;
- the retained rivers group contains one Nile stem and five delta arms opening toward the Mediterranean;
- the shared base still contains legitimate `waterRipple` uses for water surfaces such as the Mediterranean, Cyprus and the Red Sea; those are not duplicate river channels;
- `scripts/atlas-visual-check.js` remains a permanent Chromium visual QA harness and includes the water-intersection gate added by the repair;
- the current source therefore preserves the bounded fix without turning the broader `waterRipple` system into a false positive.

The doubled-river claim is not reproducible in the current source representation. Because both canonical rows point to the same removed duplicate group, retaining both as open would double-count one root cause.

## Evidence boundary

This closure covers only duplicate river-channel rendering. It does not close separate findings about shoreline displacement, missing filter definitions, rounded line caps, animation timing, route-water intersection, general river cartography or deployment of current Product `main`.

## Canonical arithmetic applied by this transaction

- Canonical IDs: **358**
- Closed: **195 → 197**
- Open: **163 → 161**
- P1: **75 → 73**
- P0: 0
- P2: 34
- P3: 47
- Refactoring: 4
- AuditRepo: 3

The total remains `358 = 197 + 161`.
