# JOHN GILL SERIES — NORMALIZED AUDIT HANDOFF V10

> Project: `FedorMilovanov/gb-is-my-strength`  
> Current source `main`: `d579745c23d9a0e6dea3a8148a3369d46c47b94b`  
> Research: `FedorMilovanov/Research@58e1ea5fab638812ae693a1d0b1e79c4dcb47131`  
> Date: 2026-07-09  
> Layer: raw intake synthesis; **not verified truth and not an implementation order**.

## 0. Authority and status

This document is the corrected, self-contained V10 handoff. It replaces the earlier intermediate draft and the former correction-overlay file.

Current status of the eleven Gill candidates:

```text
W1 source witness
verified-source
needs-cross-verification
not repair-ready
```

The image lane merged at `d579745c` adds browser/build evidence for the visual image-placement work, but it does not independently verify the editorial, source-of-truth, TOC, TTS, print or no-JS claims in this audit.

Use these active entrypoints:

```text
working/START_HERE_2026-07-09.md
verification/START_HERE_2026-07-09.md
verified/START_HERE.md
reverify/START_HERE_2026-07-09.md
```

The original 1020-line intermediate draft is retained only under `archive/stale/2026-07-09-gill-v10-intermediate/` for provenance. Do not use it as current guidance.

---

# 1. Scope and non-goals

Checked systems:

- five published John Gill routes;
- proposed Part IV publication model;
- Astro article bodies, MDX corpus and root legacy shadows;
- series data and consistency audits;
- manual TOC/submenu contracts;
- custom TTS and structured-data projections;
- Research dossiers 03/04/05/07 and the department register;
- current Part III figure-placement mechanism.

Not performed by this intake:

- source code repair;
- production deployment;
- a full source-repository build by this agent;
- browser verification by this agent;
- owner editorial approval.

---

# 2. Proposed six-document ownership model

This is an editorial proposal pending owner decision, not a canonical production declaration:

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

Do not put `7` or `9` in the permanent H1 before the evidence set is independently checked and accepted.

Proposed classification:

```text
seven disputed/universal-redemption texts
+ two positive soteriological anchors
```

This remains a proposal.

---

# 3. Candidate root-cause map

## GILL-V10-SOURCE-TRUTH

**Proposed severity:** P0 publication blocker.  
**Status:** W1 source witness; needs cross-verification.

Observed source model:

```text
A. src/content/articles/dzhon-gill-*.mdx
B. production Astro article-body components
C. root legacy HTML shadows
```

Production routes render Astro bodies, while Research and the Gill consistency audit still consume MDX data as an authoritative input. A direct Part II divergence was observed:

- MDX associates the 1720 pastorate with Salters’ Hall 1719 as “the same year”;
- the production Astro body says “the following year”.

Required next witnesses:

- independent MDX↔Astro↔dist comparison;
- explicit owner choice of canonical content source.

## GILL-V10-SERIES-MANIFEST

**Proposed severity:** P0 publication blocker.  
**Status:** W1 source witness; needs cross-verification.

Source/audit layers still maintain multiple fixed five-document representations:

- document IDs;
- marks and routes;
- expected order;
- MDX map;
- total reading time `149`;
- consistency audit expecting exactly five items.

Current rail code correctly counts only Roman-numbered parts and renders `Часть X из 3`. The old `3 из 5` display claim is closed and must not be reintroduced.

Required next witness: independent hardcoding inventory plus a sixth-item mutation test.

## GILL-V10-HISTORICAL-TOC-CONTRACT

**Proposed severity:** P0 publication blocker.  
**Status:** W1 source witness; needs build/browser verification.

The historical submenu regression contract protects old labels/order/item count. Part II is documented as having grown from six to many more source sections, yet the current configured TOC still contains six rows.

Required contract split:

```text
historical visual witness → rail geometry/animation/layout
current outline gate      → eligible headings/levels/order/IDs/exclusions
```

Required next witnesses:

- generated source heading↔TOC inventory;
- production-like rendered outline;
- browser scrollspy/mobile TOC behavior.

## GILL-V10-ROMAN-NUMBER-COLLISION

**Proposed severity:** P0 publication blocker.  
**Status:** W1 source witness; needs editorial/rendered-outline verification.

Standalone Part II retains internal headings III/IV and Part III begins with V. A series Part IV would therefore collide with a hidden mega-article numbering system.

Proposed rule:

```text
Roman numerals identify series parts only.
Internal article headings are unnumbered or use local Arabic numbering.
```

## GILL-V10-PART3-NARRATIVE

**Proposed severity:** P0 publication blocker.  
**Status:** W1 source witness; editorial impact needs independent review.

The article reaches final sermons, death, burial and epitaph, then resumes with substantial doctrinal and reception material. Repeated clusters were observed around Islam, Spurgeon, Toplady, America and final days.

Proposed terminal order:

```text
reception and disputes
→ ecclesial/transatlantic influence
→ later reception
→ final ministry and illness
→ death, burial and epitaph
→ short reassessment/bridge
→ sources
→ quiz
```

No section move is authorized until an independent section ledger and owner decision exist.

## GILL-V10-PART4-OWNERSHIP

**Proposed severity:** P0 publication blocker.  
**Status:** W1 source witness plus owner decision required.

Parts II–III already contain much of the proposed doctrinal scope: Trinity, covenant, eternal justification, ordo salutis, redemption, ordinances, ecclesiology, eschatology and gospel-offer material.

Part IV must not be added as a duplicate article. Required next step: independent topic-ownership map and owner-approved `KEEP/MOVE/SPLIT/MERGE/DELETE-DUPLICATE/REFERENCE` ledger.

## GILL-V10-RESEARCH-CANON

**Proposed severity:** P1.  
**Status:** W1 Research-repository witness.

Dossiers 03/04/05/07 contain broad, focused and expanded Part IV plans without explicit active/superseded metadata. Proposed dossier classifications remain proposals until a second Research reviewer and the owner accept them.

## GILL-V10-INTRO-OWNERSHIP

**Proposed severity:** P1.  
**Status:** W1 source witness plus editorial decision required.

Introduction, Part I and Part II overlap around Kettering/bookshop biography, Southwark and Salters’ Hall. The proposed boundary is:

```text
Introduction = historical system and environment
Part I       = personal biography
Part II      = scholarly method/publication
```

## GILL-V10-READER-PROJECTIONS

**Proposed severity:** P1.  
**Status:** W1 source witness; runtime impact unverified.

Observed selector mismatch:

- custom TTS reads `p, h2, h3, li`;
- H4, tables and figure captions are not selected;
- `.summary-card` is excluded by custom Play;
- structured data can mark summary content speakable.

Required witnesses:

- built article extraction comparison;
- browser/TTS/a11y/print checks;
- owner decision on the shared Reader projection scope.

## GILL-V10-CLAIM-PROVENANCE

**Proposed severity:** P1.  
**Status:** W1 Research witness.

Research dossier 07 first distinguishes Rippon’s “more than ten thousand” printing sheets from a modern ten-million-word extrapolation, then later attributes the ten-million figure directly to Rippon.

Required next witness: independent primary-source check and a corrected Research claim register.

## GILL-V10-RESTORED-FIGURE-RELOCATION

**Proposed severity:** P2.  
**Current status on `d579745c`:** source mechanism confirmed; JS-on browser placement independently verified by the image lane; no-JS/Pagefind/print/TTS impact still unresolved.

Current mechanism:

- figures server-render after the article body;
- inline JS removes legacy copies;
- Spurgeon placement searches for exact date/text content;
- Bunhill placement searches for exact Russian burial prose;
- figures are then inserted into the article.

The image lane confirms that normal JS-on browser placement now produces exactly one Spurgeon and one Bunhill figure at the intended locations. It does **not** establish semantic placement without JavaScript or inclusion in Pagefind/TTS/print projections.

Required remaining witnesses:

- JavaScript-disabled render;
- built Pagefind index;
- print output;
- custom TTS extraction.

Do not call this candidate fixed or repair-ready yet.

---

# 4. Existing non-Gill row confirmed

`TTS-DL-CONSENT` already exists in the canonical matrix. This intake adds a source witness that Save-Data/opt-out is partial mitigation rather than explicit consent for the neural-model lifecycle.

It is not a duplicate Gill row and remains dependent on an owner UX decision.

---

# 5. Safe architecture proposal

Only after candidate promotion and owner decisions:

```text
A. choose one canonical content source
B. generate one series manifest
C. generate current outline/Reader projections
D. normalize internal numbering
E. approve topic ownership and Part III relocation
F. govern Research dossier status
G. author Introduction/Part IV
H. publish all projections atomically
```

Suggested manifest fields:

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

For structured data, do not invent `/series/dzhon-gill/` unless it is a real canonical route. A future series node must use a dereferenceable existing route or a published series hub.

---

# 6. Proposed gates

These are design proposals, not current required checks:

```text
gill:outline:audit
gill:reader-projection:audit
gill:content-ownership:audit
manifest-driven gill:series:data:consistency:audit
```

Any replacement for the historical submenu audit must preserve its real visual regression value while removing the false requirement that current semantic outline count equal the old count.

---

# 7. Verification and implementation boundary

Before implementation, a verifier decision must record:

```text
current source SHA
candidate ID
independent witness types
accepted/rejected severity
owner decision where required
repair lane
not-stale result
```

Only rows explicitly promoted to `repair-ready` may enter a source repair lane.

Do not mix in one implementation PR:

- Gill editorial/content architecture;
- PremiumControls visual work;
- TTS model delivery;
- glossary/Bible data;
- unrelated site migration.

---

# 8. Current authoritative reading order

For another agent:

```text
1. verified/START_HERE.md
2. verified/MASTER_BUG_MATRIX.md
3. working/START_HERE_2026-07-09.md
4. verification/START_HERE_2026-07-09.md
5. reverify/START_HERE_2026-07-09.md
6. this normalized artifact only for rationale
7. REPORT.md / SOURCE_EVIDENCE_INDEX.md only when exact evidence is needed
```

Do not start implementation from the archived intermediate draft.