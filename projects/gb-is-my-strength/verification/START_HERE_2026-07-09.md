# Verification START HERE — Gill V10 — 2026-07-09

> Layer: `verification/` — active status-resolution queue.  
> Current source HEAD: `d579745c23d9a0e6dea3a8148a3369d46c47b94b`.  
> Working synthesis: `../working/START_HERE_2026-07-09.md`.  
> Current-head reverify: `../reverify/START_HERE_2026-07-09.md`.

## Current verdict

The Gill intake is not a verified repair ledger. Ten candidates have one source witness only:

```text
verified-source
needs-cross-verification
not repair-ready
```

The figure-relocation candidate now has two different observations:

```text
source witness: figures are relocated at runtime by text/date matching
browser witness: normal JS-on placement succeeds on current source
```

The browser witness proves the success path, not the suspected no-JS/Pagefind/print/TTS impact. Therefore that candidate is narrowed but not promoted, closed or repair-ready.

## Verification queue

| Candidate | Next independent evidence | Promotion/decision evidence | Owner decision |
|---|---|---|---|
| `GILL-V10-SOURCE-TRUTH` | MDX/Astro/root source diff by another verifier | production-like dist identifying the public body | choose canonical content source |
| `GILL-V10-SERIES-MANIFEST` | independent hardcoding inventory | sixth-item mutation test without manual parallel edits | approve target series model |
| `GILL-V10-HISTORICAL-TOC-CONTRACT` | generated heading↔TOC inventory | rendered/browser outline and scrollspy | define eligible/excluded headings |
| `GILL-V10-ROMAN-NUMBER-COLLISION` | independent editorial/source review | rendered accessibility outline | approve numbering rule |
| `GILL-V10-PART3-NARRATIVE` | independent section-order/duplication ledger | owner acceptance of terminal sequence | required |
| `GILL-V10-PART4-OWNERSHIP` | independent topic-ownership map | owner-approved relocation ledger | required |
| `GILL-V10-RESEARCH-CANON` | independent Research dossier classification | accepted successor/status metadata | required |
| `GILL-V10-INTRO-OWNERSHIP` | independent overlap review | owner-approved page boundaries | required |
| `GILL-V10-READER-PROJECTIONS` | built extraction comparison | browser/TTS/a11y/print witness | approve Reader scope |
| `GILL-V10-CLAIM-PROVENANCE` | primary-source check | corrected Research claim rechecked | only if wording remains disputed |
| `GILL-V10-RESTORED-FIGURE-RELOCATION` | JavaScript-disabled render and built Pagefind check | print and custom-TTS checks | decide whether direct semantic placement is required |

## Resolved or narrowed statements

### Closed: numbered-part display

Current rail displays `Часть X из 3`. The former `3 из 5` claim is stale and must not return to any active report.

### Narrowed: Part III figures

The current image lane verifies exactly one Bunhill and one Spurgeon figure at the intended locations with JavaScript enabled. It does not establish:

- semantic placement without JavaScript;
- Pagefind inclusion;
- print stability;
- custom-TTS inclusion.

### Unchanged by the image lane

The image commit does not resolve content-source ownership, manifest hardcoding, semantic TOC completeness, internal Roman numbering, Part III prose order, Part IV ownership, Research status or Reader projection differences.

## Promotion rules

Follow `MULTI_WITNESS_VERIFICATION_PROTOCOL.md`:

1. One source witness remains `needs-cross-verification`.
2. Two independent angles can support `confirmed-on-sha` or `likely-current` only for the exact claim both establish.
3. `confirmed-current` or `repair-ready` requires the stronger threshold and a current not-stale check.
4. Owner decisions are required in addition to technical witnesses where the queue says so.

## Required verifier decision

Before implementation, record:

```text
current source SHA
candidate ID
exact claim being verified
witness types
accepted/rejected severity
status
owner decision
repair lane
not-stale result
```

Do not conduct another broad audit from this file. Pick one existing candidate and close its stated evidence gap.