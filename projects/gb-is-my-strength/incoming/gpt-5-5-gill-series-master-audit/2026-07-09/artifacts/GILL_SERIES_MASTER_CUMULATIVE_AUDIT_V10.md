# JOHN GILL SERIES — NORMALIZED RATIONALE V10

> Project: `FedorMilovanov/gb-is-my-strength`  
> Gill evidence reconciled through image lane: `d579745c23d9a0e6dea3a8148a3369d46c47b94b`  
> Research evidence: `FedorMilovanov/Research@58e1ea5fab638812ae693a1d0b1e79c4dcb47131`  
> Layer: raw rationale; **not verified truth and not an implementation order**.

The current source HEAD is intentionally not duplicated here. Read:

```text
../../../reverify/START_HERE_2026-07-09.md
```

## Authority

The eleven Gill candidates remain outside the canonical bug count:

```text
verified-source
needs-cross-verification
not repair-ready
```

The Gill image lane supplies a positive JS-on browser witness for image placement only. It does not verify content ownership, semantic outline completeness, Part IV scope, TTS/search/print behavior or no-JS figure placement.

Active reading order:

```text
../../../verified/START_HERE.md
../../../verified/MASTER_BUG_MATRIX.md
../../../working/START_HERE_2026-07-09.md
../../../verification/START_HERE_2026-07-09.md
../../../reverify/START_HERE_2026-07-09.md
this file only for rationale
```

The superseded long draft and intermediate SHA notes are historical only under:

```text
../../../archive/stale/2026-07-09-gill-v10-intermediate/
```

## Proposed six-document ownership model

This is an owner/editorial proposal:

```text
Introduction — historical world
Part I      — person and biography
Part II     — scholarly method, writing and publication
Part III    — reception, influence and final life
Part IV     — doctrine, disputed texts and evaluation
Reference   — chronology, works, glossary and source matrix
```

Proposed Part IV title:

```text
Часть IV. Богословие
Спорные тексты и логика спасения в системе Джона Гилла
```

The classification “seven disputed texts plus two positive anchors” is also only a proposal. Do not put `7` or `9` in the permanent H1 before independent checking and owner acceptance.

# Candidate rationale

## `GILL-V10-SOURCE-TRUTH`

**Proposed severity:** P0 publication blocker.

Observed representations:

```text
MDX corpus
production Astro bodies
root legacy HTML shadows
```

Production routes render Astro bodies, while Research and the Gill consistency audit still consume MDX. Part II contains a direct factual divergence: MDX treats Gill’s 1720 pastorate as occurring “in the same year” as Salters’ Hall 1719; the production Astro body says “the following year”.

Required next evidence:

- independent MDX↔Astro↔dist comparison;
- owner choice of canonical content source.

## `GILL-V10-SERIES-MANIFEST`

**Proposed severity:** P0 publication blocker.

Five-document values remain duplicated across data/audit layers:

```text
document IDs
marks and routes
expected order
MDX map
reading total 149
consistency audit expecting exactly five items
```

Current rail numbering is not part of this defect: it renders `Часть X из 3`. The old `3 из 5` claim is closed.

Required next evidence: independent inventory and sixth-item mutation test.

## `GILL-V10-HISTORICAL-TOC-CONTRACT`

**Proposed severity:** P0 publication blocker.

Historical submenu label/order/count is protected, but Part II expanded far beyond its six configured TOC rows. Historical visual witness and current semantic completeness need separate contracts:

```text
historical witness → geometry, animation, layout
current outline    → eligible headings, levels, order, IDs, exclusions
```

Required next evidence: generated heading↔TOC inventory plus rendered/browser scrollspy checks.

## `GILL-V10-ROMAN-NUMBER-COLLISION`

**Proposed severity:** P0 publication blocker.

Standalone Part II retains internal III/IV headings and Part III begins with V. A series Part IV would collide with this inherited mega-article numbering.

Proposed rule:

```text
Roman numerals identify series parts only.
Internal headings are unnumbered or locally numbered.
```

## `GILL-V10-PART3-NARRATIVE`

**Proposed severity:** P0 publication blocker.

Part III reaches death, burial and epitaph, then resumes substantial doctrinal/reception material. Topic clusters recur around Islam, Spurgeon, Toplady, America and final days.

Proposed terminal order:

```text
reception and disputes
→ influence and later reception
→ final ministry and illness
→ death, burial and epitaph
→ short reassessment/bridge
→ sources
→ quiz
```

No prose move is authorized without an independent section ledger and owner decision.

## `GILL-V10-PART4-OWNERSHIP`

**Proposed severity:** P0 publication blocker.

Parts II–III already contain much of the proposed doctrinal scope: Trinity, covenant, eternal justification, ordo salutis, redemption, ordinances, ecclesiology, eschatology and gospel-offer material.

Part IV must not be added as a duplicate article. Required next evidence: independent topic map plus owner-approved `KEEP/MOVE/SPLIT/MERGE/DELETE-DUPLICATE/REFERENCE` ledger.

## `GILL-V10-RESEARCH-CANON`

**Proposed severity:** P1.

Research dossiers 03/04/05/07 contain broad, focused and expanded plans without accepted active/superseded metadata. Classification requires another Research reviewer and owner acceptance.

## `GILL-V10-INTRO-OWNERSHIP`

**Proposed severity:** P1.

Introduction, Part I and Part II overlap around Kettering/bookshop biography, Southwark and Salters’ Hall.

Proposed boundary:

```text
Introduction = historical system/environment
Part I       = personal biography
Part II      = scholarly method/publication
```

## `GILL-V10-READER-PROJECTIONS`

**Proposed severity:** P1.

Source selectors differ:

- custom TTS reads `p, h2, h3, li`;
- H4, tables and figure captions are excluded;
- `.summary-card` is excluded by custom Play;
- structured data can mark summary content speakable.

Required next evidence: built extraction comparison and browser/TTS/a11y/print witnesses.

## `GILL-V10-CLAIM-PROVENANCE`

**Proposed severity:** P1.

Research dossier 07 first distinguishes Rippon’s “more than ten thousand” printing sheets from a modern ten-million-word extrapolation, then later attributes the ten-million figure directly to Rippon.

Required next evidence: independent primary-source check and corrected Research claim register.

## `GILL-V10-RESTORED-FIGURE-RELOCATION`

**Proposed severity:** P2.

At the Gill image evidence boundary:

- figures server-render after the article body;
- inline JavaScript removes legacy copies;
- Spurgeon placement searches for a dated paragraph;
- Bunhill placement searches for exact Russian burial prose;
- figures are inserted into the article at runtime.

The independent image lane verifies normal JS-on success: exactly one Spurgeon and one Bunhill figure appear at the intended locations.

Still unresolved:

```text
JavaScript-disabled placement
Pagefind inclusion
print result
custom-TTS inclusion
```

This candidate is narrowed, not fixed or repair-ready.

# Existing canonical row supported

`TTS-DL-CONSENT` already exists in the canonical matrix. This intake adds source support that Save-Data/opt-out is partial mitigation rather than explicit consent for the whole neural-model lifecycle. It is not a duplicate Gill row and still requires an owner UX decision.

# Safe program proposal

Only after candidate promotion and owner decisions:

```text
choose one canonical content source
→ generate one series manifest
→ generate current outline/Reader projections
→ normalize internal numbering
→ approve topic ownership and Part III relocation
→ govern Research status
→ author Introduction/Part IV
→ publish all projections atomically
```

Suggested manifest shape:

```ts
interface GillSeriesItem {
  id: string;
  kind: 'intro' | 'part' | 'reference';
  seriesPosition: number;
  partOrdinal?: number;
  mark: { kind: 'label' | 'roman'; value: string };
  title: string;
  slug: string;
  route: string;
  status: 'draft' | 'scheduled' | 'published';
  readingTimeMin: number;
  contentVersion: string;
  canonicalContentId: string;
}
```

Never derive `partOrdinal` from `seriesPosition`.

Do not invent `/series/dzhon-gill/` as a structured-data identity unless that route exists and is canonical.

Proposed gates, not current requirements:

```text
gill:outline:audit
gill:reader-projection:audit
gill:content-ownership:audit
manifest-driven gill:series:data:consistency:audit
```

# Implementation boundary

Before implementation, a verifier decision must record:

```text
current source SHA
candidate ID
exact claim
independent witness types
accepted/rejected severity
owner decision where required
repair lane
not-stale result
```

Only explicitly promoted `repair-ready` rows may enter source implementation.

Do not mix:

- Gill editorial/content architecture;
- PremiumControls visual work;
- TTS model delivery;
- glossary/Bible data;
- unrelated route migration.