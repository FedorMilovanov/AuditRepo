# Status and corrections — Gill cumulative artifact V10 — 2026-07-09

This file controls the interpretation of `GILL_SERIES_MASTER_CUMULATIVE_AUDIT_V10.md`.

## Layer and authority correction

The V10 master file is a **raw cumulative research artifact inside `incoming/`**. It is not a canonical verified ledger and is not an implementation order.

Current status of its new Gill rows:

```text
W1 source witness
verified-source
needs-cross-verification
not repair-ready
```

Canonical/working/verification roles are defined by:

- `../../../../working/START_HERE_2026-07-09.md`
- `../../../../verification/START_HERE_2026-07-09.md`
- `../../../../verified/MASTER_BUG_MATRIX.md`

## SHA correction

The artifact was initially assembled at source baseline:

```text
ac26d8efa2b952df6dc46eef05908e6d65287e82
```

The final current source HEAD checked during the intake is:

```text
30d9fb61fe2c9116ee53a54d681c01455eef4fe6
```

Research HEAD remains:

```text
58e1ea5fab638812ae693a1d0b1e79c4dcb47131
```

The seven-commit delta is documented in `../evidence/REVERIFY_DELTA_30d9fb61.md`.

## Exact content corrections

### 1. Section 3.1 — remove `5-of-5 labels`

The broader source/audit manifest hardcoding remains source-observed:

- five IDs/documents;
- expected order;
- MDX map;
- route/mark maps;
- progress total `149`;
- consistency audit expecting exactly five items.

However, current `GillSeriesRail.astro` already filters Roman items and renders numbered progress as:

```text
Часть X из 3
```

Therefore the old current-UI subclaim `3 из 5` / `5-of-5 labels` is stale on `30d9fb61` and must not be used as evidence for `GILL-V10-SERIES-MANIFEST`.

### 2. Section 3.3 — JSON-LD `@id`

The literal proposal:

```text
https://gospod-bog.ru/series/dzhon-gill/#series
```

must not be adopted unless `/series/dzhon-gill/` is a real, canonical and dereferenceable route.

Safer rule:

1. prefer a dedicated published series hub if one exists;
2. otherwise use an existing canonical Gill route plus `#series`;
3. never invent a stable-looking `@id` that resolves to a 404.

The schema type proposal `CreativeWorkSeries` remains a working design suggestion, not a verified SEO requirement.

### 3. Section 8 — Part IV is a proposal, not a canonical decision

Rename mentally:

```text
Canonical Part IV decision
```

to:

```text
Proposed Part IV scope pending owner decision and cross-verification
```

The classification:

```text
seven disputed/universal-redemption texts
+ two positive soteriological anchors
```

is a proposed resolution of the seven-versus-nine ambiguity. It is not canonical until independently checked and accepted by the owner.

### 4. Section 9.2 — Research dossier classification

The suggested statuses for dossiers 03/04/05/07 are proposals. Do not write `canonical` metadata into the Research repository until an independent Research reviewer and the owner accept the successor relationships.

### 5. Sections 13–16 — gates and migration order

The proposed audits, reading-time targets and phases are working architecture suggestions. They become implementation requirements only after the relevant candidates are promoted through `verification/START_HERE_2026-07-09.md`.

### 6. Section 17 — issue map status

Read `Canonical issue map` as:

```text
Candidate root-cause consolidation map
```

The consolidated IDs are used to organize working synthesis. They are not canonical open bugs until verifier promotion.

## Current validated statements

The following are direct source observations, not status promotions:

- production Gill routes render Astro article bodies;
- the Gill consistency audit consumes MDX frontmatter and hardcodes five items/order/total;
- Part II MDX and Astro contain the documented Salters’ Hall chronology divergence;
- Part II still has six configured TOC rows in `gillSeriesData.ts`;
- internal article headings retain III/IV/V numbering;
- custom TTS selector excludes H4/table/figcaption content;
- PR #50 figures SSR after the article and are moved client-side.

Each still requires the witness threshold appropriate to the claimed impact.

## Usage rule

Anyone using the V10 artifact must read this correction file first. Where the two conflict, this file and the current working/verification entrypoints take precedence.