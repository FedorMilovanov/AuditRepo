# Proposal — Gill series structural-content lane

## Identity
- Project: `gb-is-my-strength`
- Proposed by: `gpt-5-5-gill-series-master-audit`
- Date: 2026-07-09
- Initial source SHA: `ac26d8efa2b952df6dc46eef05908e6d65287e82`
- Current source SHA: `30d9fb61fe2c9116ee53a54d681c01455eef4fe6`
- Proposal type: repair-lane / split / publication-order
- Proposal status: `proposal-open`

## Verification prerequisite

This proposal is based on one source witness. It is not accepted and must not start a source implementation lane until the relevant candidates are promoted through:

- `../../../../verification/START_HERE_2026-07-09.md`
- `../../../../working/START_HERE_2026-07-09.md`

Current labels:

```text
verified-source
needs-cross-verification
not repair-ready
```

## Target candidate IDs

- `GILL-V10-SOURCE-TRUTH`
- `GILL-V10-SERIES-MANIFEST`
- `GILL-V10-HISTORICAL-TOC-CONTRACT`
- `GILL-V10-ROMAN-NUMBER-COLLISION`
- `GILL-V10-PART3-NARRATIVE`
- `GILL-V10-PART4-OWNERSHIP`
- `GILL-V10-RESEARCH-CANON`
- `GILL-V10-INTRO-OWNERSHIP`
- `GILL-V10-READER-PROJECTIONS`
- `GILL-V10-CLAIM-PROVENANCE`
- `GILL-V10-RESTORED-FIGURE-RELOCATION`

## Current-head correction

Current `GillSeriesRail.astro` already renders numbered progress as `Часть X из 3`. The obsolete `3 из 5` display subclaim is not part of this proposal.

The remaining manifest candidate concerns five-document IDs/order/maps, total `149` and the consistency audit’s fixed expectations.

## Proposed program

### Phase A — canonical graph

1. Select the canonical article source.
2. Create a series manifest.
3. Create topic ownership data.
4. Generate word counts, dates, related links and series projections.

### Phase B — outline and Reader model

1. Separate historical visual witness from current content completeness.
2. Generate TOC from eligible headings.
3. Normalize internal III/IV/V numbering.
4. Add table/audio/search summaries where verified necessary.
5. Render restored figures directly in owning semantic sections if the relocation candidate is promoted.

### Phase C — editorial relocation

1. Mark sections `KEEP/MOVE/SPLIT/MERGE/DELETE-DUPLICATE/REFERENCE`.
2. Deduplicate and reorder Part III.
3. Move accepted doctrinal ownership into a Part IV draft.
4. Move accepted personal biography to Part I.
5. Keep accepted historical systems in the Introduction.

### Phase D — Research governance and authoring

1. Mark dossiers only after independent Research review.
2. Split dossier 07 if accepted.
3. Resolve the seven-versus-nine evidence-set proposal.
4. Author Part IV only after owner-approved relocation.

### Phase E — atomic publication

If the prior phases are verified and accepted, publish from one manifest:

- series UI and neighboring cards;
- PageHead and a dereferenceable series JSON-LD identity;
- sitemap/RSS/llms.txt/catalogs;
- Pagefind/TTS/print/reading time;
- outline, ownership and projection gates.

## JSON-LD correction

Do not invent `/series/dzhon-gill/#series` unless `/series/dzhon-gill/` is a real canonical route. Prefer a dedicated published hub or an existing canonical Gill route plus `#series`.

## Evidence

- `../REPORT.md`
- `../artifacts/GILL_SERIES_MASTER_CUMULATIVE_AUDIT_V10.md`
- `../artifacts/STATUS_AND_CORRECTIONS_2026-07-09.md`
- `../evidence/SOURCE_EVIDENCE_INDEX.md`
- `../evidence/REVERIFY_DELTA_30d9fb61.md`

## What must not be mixed

- Gill visual redesign.
- Vosk model-delivery architecture.
- Unrelated site-wide article migration.
- Glossary/Bible data changes.
- Source implementation before verifier promotion and owner decisions.

## Proposed acceptance criteria

- one declared content source;
- manifest not hardcoded to five items;
- complete generated TOC with level parity;
- no Roman-number collision;
- Part III terminal narrative order;
- figures directly owned by semantic sections where accepted;
- no duplicate canonical topic owners;
- Part IV scope accepted by owner;
- Reader projections verified by build/browser witnesses;
- publication surfaces update atomically.

## Proposal lifecycle

```text
proposal-open
→ proposal-supported / proposal-conflicted
→ proposal-accepted / proposal-rejected / proposal-superseded
```

No transition has occurred yet.