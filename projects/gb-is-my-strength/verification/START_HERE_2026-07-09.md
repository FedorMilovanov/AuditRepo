# Verification START HERE — Gill V10 — 2026-07-09

> Layer: `verification/` — active dispute/status-resolution queue.  
> Source HEAD: `30d9fb61fe2c9116ee53a54d681c01455eef4fe6`.  
> Working synthesis: `../working/START_HERE_2026-07-09.md`.  
> Raw intake: `../incoming/gpt-5-5-gill-series-master-audit/2026-07-09/`.

## Current verdict

The Gill V10 intake is a strong **W1 source witness**, but it is not a multi-witness verified ledger.

Allowed current labels:

```text
verified-source
needs-cross-verification
reproduced-by-agent
```

Not allowed yet for the new Gill rows:

```text
confirmed-current
repair-ready
fixed-current
false-positive
```

No new Gill candidate is counted as a canonical open bug in `verified/MASTER_BUG_MATRIX.md` until this queue produces the required independent evidence.

## Verification queue

| Candidate | Witness 2 | Witness 3 / promotion evidence | Owner decision needed |
|---|---|---|---|
| `GILL-V10-SOURCE-TRUTH` | independent source diff of MDX/Astro/root | production-like dist proving which representation is public | choose canonical content source |
| `GILL-V10-SERIES-MANIFEST` | independent hardcoding inventory | mutation test adding a draft sixth item without manual list edits | approve target six-document model |
| `GILL-V10-HISTORICAL-TOC-CONTRACT` | generated heading↔TOC inventory | browser scrollspy/mobile TOC witness | approve whether every H2/H3 is navigable or explicitly excluded |
| `GILL-V10-ROMAN-NUMBER-COLLISION` | independent source/editorial review | rendered screenshot/accessibility outline | approve local heading numbering rule |
| `GILL-V10-PART3-NARRATIVE` | independent editorial section-order ledger | owner/editorial acceptance of terminal sequence | yes |
| `GILL-V10-PART4-OWNERSHIP` | independent topic duplication map | owner-approved ownership manifest | yes |
| `GILL-V10-RESEARCH-CANON` | Research-repo reviewer classifies dossiers | second reviewer checks successor links/status metadata | approve canonical Research brief |
| `GILL-V10-INTRO-OWNERSHIP` | independent overlap review | owner accepts page-boundary decisions | yes |
| `GILL-V10-READER-PROJECTIONS` | built artifact extraction comparison | browser/TTS/a11y/print witness | approve Reader model scope |
| `GILL-V10-CLAIM-PROVENANCE` | primary-source check of Rippon wording | Research correction committed and rechecked | no, unless wording choice is disputed |
| `GILL-V10-RESTORED-FIGURE-RELOCATION` | no-JS + built Pagefind check | print/TTS/browser placement check | choose direct-placement repair |

## Specific current-head corrections already resolved in verification

### Old `3 из 5` subclaim — removed

Current `GillSeriesRail.astro` filters `GILL_SERIES_ITEMS` to Roman items and renders numbered progress as `Часть X из 3`. Therefore the earlier subclaim that the current rail still displays `3 из 5` is stale on `30d9fb61` and must not be carried into the Gill V10 candidate.

This does **not** close the broader manifest candidate because the data/audit layers still hardcode five documents, expected order and total `149`.

### PR #50 scope — clarified

The full baseline range `ac26d8e..30d9fb61` includes seven commits. PR #50 itself changed only the Part III shell, the new restored-figures component and its lane report. Other rail/Floating Cluster/PageHead edits were intervening commits and were reviewed separately for relevance.

## Promotion rules

Follow `MULTI_WITNESS_VERIFICATION_PROTOCOL.md`:

1. One source witness stays `needs-cross-verification`.
2. Two independent witness angles may become `confirmed-on-sha` / `likely-current`.
3. `confirmed-current` requires the strengthened multi-witness threshold or a strong production-like browser witness.
4. `repair-ready` additionally requires current SHA, route/files, evidence, repair lane, owner decision where applicable and a not-stale check.

## Required output before implementation

A verifier must create a decision record that lists, per candidate:

```text
source SHA
witness types
accepted/rejected severity
canonical status
owner decision
repair lane
not-stale result
```

Until then, implementation agents must treat `../working/START_HERE_2026-07-09.md` as a candidate map, not an instruction to modify the source repository.