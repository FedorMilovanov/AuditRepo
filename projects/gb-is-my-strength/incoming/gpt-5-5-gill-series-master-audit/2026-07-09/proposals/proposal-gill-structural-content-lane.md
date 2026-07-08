# Proposal — Gill series structural-content lane

## Identity
- Project: `gb-is-my-strength`
- Proposed by: `gpt-5-5-gill-series-master-audit`
- Date: 2026-07-09
- Source SHA: `ac26d8efa2b952df6dc46eef05908e6d65287e82`
- Target finding IDs:
  - `GILL-V10-SOURCE-TRUTH`
  - `GILL-V10-SERIES-MANIFEST`
  - `GILL-V10-HISTORICAL-TOC-CONTRACT`
  - `GILL-V10-ROMAN-NUMBER-COLLISION`
  - `GILL-V10-PART3-NARRATIVE`
  - `GILL-V10-PART4-OWNERSHIP`
  - `GILL-V10-RESEARCH-CANON`
  - `GILL-V10-READER-PROJECTIONS`
- Proposal type: repair-lane / split / publication-order

## Current state

The current series has no single canonical content graph. A historical submenu witness freezes old item counts, Part II/III keep legacy cross-document Roman numbering, Part III is duplicated and non-terminal, and the future Part IV scope already exists inside Parts II–III. Research contains mutually superseding plans without status metadata.

## Proposed change

Accept one coordinated program with five non-mixed phases.

### Phase A — canonical graph

1. Select the canonical article source.
2. Create `gill-series-manifest`.
3. Create `gill-topic-ownership`.
4. Make word counts, dates, related links and series data generated projections.

### Phase B — outline and Reader model

1. Retire historical item count as a content requirement.
2. Preserve visual witness separately.
3. Generate TOC from eligible H2/H3.
4. Remove III/IV/V legacy cross-document numbering.
5. Introduce table audio summaries and semantic block projection.

### Phase C — editorial relocation

1. Mark every current Part II/III section `KEEP/MOVE/SPLIT/MERGE/DELETE-DUPLICATE/REFERENCE`.
2. Deduplicate and reorder Part III.
3. Move doctrinal ownership into the Part IV draft.
4. Move personal Kettering biography back to Part I.
5. Keep historical systems in the Introduction.

### Phase D — Research governance and authoring

1. Mark dossiers `canonical/supporting/superseded`.
2. Split dossier 07 into historical Introduction, Part IV opening and claim register.
3. Freeze seven disputed texts plus two positive anchors.
4. Author Part IV only after relocation.

### Phase E — atomic publication

Publish from one manifest:

- series UI and neighboring cards;
- PageHead and `CreativeWorkSeries` JSON-LD;
- sitemap/RSS/llms.txt/catalogs;
- Pagefind/TTS/print/reading time;
- outline, ownership and projection gates.

## Evidence

See:

- `../REPORT.md`
- `../artifacts/GILL_SERIES_MASTER_CUMULATIVE_AUDIT_V10.md`
- `../evidence/SOURCE_EVIDENCE_INDEX.md`

## Why this matters

Adding Part IV before ownership/outline work would create another competing truth, more duplicate doctrine and more hardcoded five-to-six migration edits. The proposed order makes the change reversible, testable and semantically coherent.

## What must not be mixed

- No Gill visual redesign in this lane.
- No Vosk model-delivery architecture changes.
- No unrelated site-wide article migration.
- No metadata bot/date refactor beyond the fields necessary for the series manifest.
- No source `main` edits from raw intake without owner acceptance and implementation verification.

## Acceptance criteria

- one canonical content source;
- six-document manifest with no hardcoded total count;
- complete generated TOC with level parity;
- no Roman numeral collision;
- Part III sources are terminal;
- no duplicate canonical topic owners;
- Part IV contains the canonical doctrinal treatment;
- Introduction meets the historical scope;
- TTS/schema/search/print use one Reader projection model;
- all affected publication surfaces update atomically.

## Proposal status: proposal-open
