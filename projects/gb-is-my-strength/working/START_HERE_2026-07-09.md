# Working START HERE — Gill V10 candidate synthesis — 2026-07-09

> Layer: `working/` — synthesis in progress, **not verified truth**.  
> Current source HEAD: `ff55161b6858a1bbb0fad5704a11c6b41c961879`.  
> Functional tree audited: `30d9fb61fe2c9116ee53a54d681c01455eef4fe6`.  
> Net compare `30d9fb61..ff55161b`: no changed files.  
> Initial baseline: `ac26d8efa2b952df6dc46eef05908e6d65287e82`.  
> Research HEAD: `58e1ea5fab638812ae693a1d0b1e79c4dcb47131`.  
> Raw intake: `../incoming/gpt-5-5-gill-series-master-audit/2026-07-09/`.

## Status

All Gill V10 rows below currently have only a **W1 source witness** from this intake:

```text
verified-source
needs-cross-verification
not repair-ready
```

The empty-tree freshness reverify to `ff55161b` does not count as an independent second witness. The severity column is a proposal, not a canonical assignment. No implementation agent should fix these rows from this document alone.

## Candidate matrix — 11 rows

| Candidate ID | Proposed severity | Source-observed issue | Required next witness |
|---|---:|---|---|
| `GILL-V10-SOURCE-TRUTH` | P0 publication blocker | MDX, production Astro bodies and root legacy HTML are separate representations; Part II already contains a factual MDX↔Astro divergence. | independent source review + built-artifact comparison |
| `GILL-V10-SERIES-MANIFEST` | P0 publication blocker | Five-item IDs/order/maps and total `149` are hardcoded across data/audit layers. Current rail now correctly counts only 3 numbered parts; the obsolete `3 из 5` subclaim is **not** part of this candidate. | second source witness + sixth-item mutation test |
| `GILL-V10-HISTORICAL-TOC-CONTRACT` | P0 publication blocker | Historical item-count regression contract can preserve an incomplete current outline; Part II still has six configured rows for a much larger article. | built outline inventory + browser scrollspy witness |
| `GILL-V10-ROMAN-NUMBER-COLLISION` | P0 publication blocker | Standalone Part II begins with internal III/IV and Part III with V, colliding with a future series Part IV. | independent editorial/source witness + rendered heading capture |
| `GILL-V10-PART3-NARRATIVE` | P0 publication blocker | Major material follows death/burial and sources; internal topic clusters repeat. | independent editorial review + exact section-order ledger |
| `GILL-V10-PART4-OWNERSHIP` | P0 publication blocker | Parts II–III already contain much of the proposed doctrinal scope. | owner decision + independent topic-ownership review |
| `GILL-V10-RESEARCH-CANON` | P1 | Research dossiers 03/04/05/07 contain competing or superseding plans without status metadata. | independent Research-repo reviewer |
| `GILL-V10-INTRO-OWNERSHIP` | P1 | Historical Introduction, Part I and Part II repeat biography/context ownership. | owner/editorial review |
| `GILL-V10-READER-PROJECTIONS` | P1 | TOC, custom TTS, schema speakable and table/heading projections differ at source level. | built artifact + browser/TTS/a11y witness |
| `GILL-V10-CLAIM-PROVENANCE` | P1 | Research dossier 07 first identifies “10 million words” as extrapolation, then attributes it directly to Rippon. | independent primary-source/Research correction witness |
| `GILL-V10-RESTORED-FIGURE-RELOCATION` | P2 | Part III figures SSR after the article and are moved client-side; one placement depends on exact Russian prose. | no-JS, Pagefind, print and TTS witness |

## Existing canonical row confirmed by this intake

`TTS-DL-CONSENT` was already present in the verified matrix. This intake provides an additional source witness for its current control flow. It does **not** create a duplicate Gill row and does not by itself make the issue repair-ready; the owner UX decision is still required.

## Current-head reconciliation

### Functional delta `ac26d8e` → `30d9fb61`

The range contains seven commits, including intervening Gill rail/Floating Cluster/PageHead changes and Merge PR #50 restoring Part III figures.

Results:

- `GillPart3ArticleBody.astro`, `gillSeriesData.ts`, the Gill consistency audit and `floating-cluster-controller.js` owning the core candidate predicates were not changed in a way that closes those predicates;
- current `GillSeriesRail.astro` **did** fix the old display error that counted Introduction/Reference as numbered parts (`Часть 3 из 5`); that stale subclaim has been removed;
- PR #50 added the separate runtime figure-relocation candidate.

### Freshness delta `30d9fb61` → `ff55161b`

Two temporary-placeholder commits have an empty net file diff. The current source tree is identical to the audited functional tree, and no candidate status changed.

See:

- `../incoming/gpt-5-5-gill-series-master-audit/2026-07-09/evidence/REVERIFY_DELTA_30d9fb61.md`
- `../incoming/gpt-5-5-gill-series-master-audit/2026-07-09/evidence/REVERIFY_DELTA_ff55161.md`

## Proposed implementation order — only after promotion

```text
A. canonical content graph + manifest
B. generated outline / Reader model + Roman normalization
C. semantic figure placement + Part III cleanup
D. topic ownership and Research governance
E. Introduction / Part IV authoring
F. atomic publication projections
```

This is an open proposal. Promotion and repair ordering are controlled by `../verification/START_HERE_2026-07-09.md` and the owner’s editorial decisions.