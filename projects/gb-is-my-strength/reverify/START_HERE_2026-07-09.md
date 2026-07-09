# REVERIFY START HERE — Gill V10 — 2026-07-09

> Current source `main`: `2313f36f6aeaf7415e85d5e353e7e4cd10222ece`  
> Last Gill functional image lane: `d579745c23d9a0e6dea3a8148a3369d46c47b94b`  
> Research HEAD: `58e1ea5fab638812ae693a1d0b1e79c4dcb47131`  
> Scope: recheck of the already-defined Gill V10 candidates only; no new-finding sweep.

## Source ranges reviewed

### `ff55161b..d579745c` — Gill image lane

This lane changed shared Gill hero/image presentation, captions, Part III Bunhill/Spurgeon relocation logic, desktop rail covers and a Part II correction bridge. Its report records:

- production-like build success;
- static-publication and strict-native checks;
- Playwright geometry/screenshots for five routes at three viewports;
- exactly one Spurgeon and one Bunhill figure at the intended JS-on locations.

### `d579745c..2313f36` — unrelated functional lane plus bot metadata

The two later commits contain:

- a Hermenevtika rail/speed-slot change;
- shared CSS removal limited to `.hrail-top` Hermenevtika selectors;
- an automatic metadata/cache-bust update;
- Gill PageHead/root-shadow changes limited to technical `article:modified_time` and generated asset/version fields.

No Gill article body, series manifest, manual TOC data, Research dossier, TTS extraction logic or Part III figure-relocation mechanism changed in this range.

## Candidate status effects

| Candidate | Effect at `2313f36` |
|---|---|
| `GILL-V10-SOURCE-TRUTH` | unchanged; MDX/Astro/root-content ownership is unresolved; technical metadata churn does not choose a canonical body |
| `GILL-V10-SERIES-MANIFEST` | unchanged |
| `GILL-V10-HISTORICAL-TOC-CONTRACT` | unchanged |
| `GILL-V10-ROMAN-NUMBER-COLLISION` | unchanged |
| `GILL-V10-PART3-NARRATIVE` | unchanged |
| `GILL-V10-PART4-OWNERSHIP` | unchanged |
| `GILL-V10-RESEARCH-CANON` | unchanged |
| `GILL-V10-INTRO-OWNERSHIP` | unchanged |
| `GILL-V10-READER-PROJECTIONS` | unchanged; Hermenevtika-specific CSS/rail work does not change Gill TOC/TTS/search/print projections |
| `GILL-V10-CLAIM-PROVENANCE` | unchanged |
| `GILL-V10-RESTORED-FIGURE-RELOCATION` | unchanged from the narrowed state: JS-on placement verified; runtime text/date relocation remains; no-JS/Pagefind/print/TTS unresolved |

## Current verdict

Ten candidates remain:

```text
W1 source witness
verified-source
needs-cross-verification
not repair-ready
```

`GILL-V10-RESTORED-FIGURE-RELOCATION` has:

```text
source-confirmed runtime relocation
+ independent JS-on browser success witness
+ unresolved no-JS / Pagefind / print / custom-TTS impact
```

This is not enough to call it fixed, false-positive or repair-ready.

## Stale statements barred from active handoffs

- current source HEAD `d579745c` or earlier;
- “net delta is empty” as the latest state;
- normal JS-on Part III image placement is unverified;
- `Часть 3 из 5` is a current defect;
- Gill has 49 confirmed active bugs;
- Part IV scope or the seven-plus-two set is canonical;
- technical bot `modified_time` proves an editorial content revision.

## Next verifier action

Do not perform another broad search. Pick one existing candidate from `../verification/START_HERE_2026-07-09.md` and add a genuinely independent witness angle.

For the figure candidate, the bounded remaining checks are:

```text
JavaScript disabled
built Pagefind inclusion
print output
custom TTS extraction
```

## Reading order

```text
../verified/START_HERE.md
../working/START_HERE_2026-07-09.md
../verification/START_HERE_2026-07-09.md
this file
```

Older SHA-delta notes are historical only under `../archive/stale/2026-07-09-gill-v10-intermediate/`.