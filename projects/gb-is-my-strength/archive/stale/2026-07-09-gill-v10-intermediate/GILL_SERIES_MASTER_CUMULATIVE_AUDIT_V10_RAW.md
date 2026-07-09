# JOHN GILL SERIES — CUMULATIVE MASTER AUDIT V10

> Project: `FedorMilovanov/gb-is-my-strength`  
> Source `main`: `ac26d8efa2b952df6dc46eef05908e6d65287e82`  
> Research: `FedorMilovanov/Research@58e1ea5fab638812ae693a1d0b1e79c4dcb47131`  
> Date: 2026-07-09  
> Mode: audit / editorial architecture / source verification; no source fix in this document.

## 0. Authority and scope

This file is the current normalized research handoff for the John Gill series. It consolidates the cumulative V1–V10 audit into one operational artifact. The official intake summary and status proposals are in `../REPORT.md`; this artifact carries the rationale, ownership model and implementation design.

The target six-document series is:

```text
Introduction — Historical context
Part I      — The Man
Part II     — The Scholar
Part III    — The Legacy
Part IV     — Theology
Reference   — Works, chronology, terms, sources
```

The audit does not authorize direct production fixes. Editorial ownership decisions must be accepted by the owner before prose is moved.

---

# 1. Executive verdict

The Gill series is visually sophisticated and source-rich, but it does not yet have one content graph.

The live system currently contains three competing truths:

```text
A. src/content/articles/dzhon-gill-*.mdx
B. Astro article-body components rendered in production
C. root legacy articles/dzhon-gill-*/index.html shadows
```

Research frequently reads A. Production visitors read B. Some historical guards still reason about C or about a frozen pre-v16 witness. As a result:

- a source audit can verify text that visitors do not see;
- word counts, dates and related links disagree;
- a green historical menu gate can certify an incomplete current TOC;
- Part IV cannot be added safely because its content already lives in Parts II–III;
- TTS, TOC, search, print and JSON-LD infer different versions of the article from raw DOM.

The correct next step is not “write Part IV.” It is:

```text
canonical graph → outline/Reader model → ownership relocation → Part IV authoring → atomic publication
```

---

# 2. Current source truth defects

## 2.1 Production does not render the content source Research calls canonical

The public Part II route imports an Astro body component. The consistency layer and Research navigation describe the MDX corpus as canonical. This is already factually unsafe.

Direct example:

- MDX says Gill became pastor in 1720 “in the very same year” as Salters’ Hall 1719;
- the production Astro body correctly says “the following year.”

Therefore a Research pass may approve stale or wrong content while the website displays a corrected version—or the reverse.

## 2.2 Word-count and date drift

Several independent values describe the same page:

- stripped MDX prose counts;
- PageHead `wordCount` and reading time;
- hardcoded series minute totals;
- technical `dateModified` rewritten by bot/cache-bust commits;
- MDX `updatedAt` values that do not match public metadata semantics.

A technical cache-bust must not make an article appear editorially revised.

## 2.3 Required canonical model

The chosen source must generate:

```text
production article
TOC/mobile TOC
TTS/search/print projections
word count and reading time
PageHead and JSON-LD
series navigation
sitemap/RSS/llms.txt/catalogs
```

MDX may become canonical, or Astro section data may become canonical, but the current hybrid must end.

---

# 3. Series manifest and publication graph

## 3.1 Current hardcoding

The series is hardcoded as five items in multiple places. The system also hardcodes:

```text
series IDs
series marks
routes
expected order
MDX maps
reading total = 149
previous/next cards
5-of-5 labels
```

The consistency audit itself expects exactly five items, so merely changing `5` to `6` would preserve the root problem.

## 3.2 Proposed schema

```ts
interface GillSeriesItem {
  id: string;
  kind: 'intro' | 'part' | 'reference';
  seriesPosition: number;
  partOrdinal?: number;
  mark: { kind: 'label' | 'roman'; value: string };
  title: string;
  subtitle?: string;
  slug: string;
  route: string;
  status: 'draft' | 'scheduled' | 'published';
  readingTimeMin: number;
  contentVersion: string;
  canonicalContentId: string;
}
```

Never derive the Roman numeral from `seriesPosition`. Introduction and Reference are positional members without part ordinals.

## 3.3 Structured data

Create one stable series node:

```text
https://gospod-bog.ru/series/dzhon-gill/#series
```

Type:

```text
CreativeWorkSeries
```

Every article must point to it through `isPartOf` and declare its position. The series node should list all published parts through `hasPart` or an `ItemList` projection.

---

# 4. Historical submenu contract is a migration blocker

## 4.1 The contract protects old count, not current meaning

The reconciliation file says the pre-v16 labels, order and item count remain historical. For Part II it simultaneously records that the article grew from six to twenty-nine sections.

The audit then requires:

```text
rendered item count == historical expected item count
```

This means:

```text
add a correct current TOC row → regression audit may fail
leave a new chapter unnavigable → regression audit stays green
```

## 4.2 Part II

Configured rows:

```text
sec-hebrew
sec-canticles
sec-ordinances
sec-eschatology
sec-systematics
sec-quiz
```

Omitted major boundaries include:

```text
part-theology
part-controversy
sec-trinity
sec-whitefield
sec-lectures
sec-wesley
sec-exegesis
sec-covenant
sec-dd
sec-hebrew-diss
sec-love
sec-kennicon
sec-commentary
sec-habakkuk
sec-pactum
sec-ecclesiology
sec-whitby
sec-pastoral
sec-deism-polemic
sec-gill-catholicity
sec-ordo-salutis
sec-gill-solter
```

`sec-hebrew` is an actual H3 beneath omitted H2 `part-theology`, but the TOC promotes it to level 2. The visible and accessible hierarchy is false.

## 4.3 Part I

Independent H3 sections missing from the current menu include:

```text
sec-illness-family
sec-last-words-wife
sec-skepp-detail
```

These are not decorative fragments. They own illness/family grief, Elizabeth Gill’s final confession and Skepp’s ordination/library influence.

## 4.4 Part III

The configured menu omits many named chapters, including:

```text
sec-rare-episodes
sec-spouse
sec-gill-islam
sec-discipline-generation
sec-hypercalv-deep
sec-spurgeon-commentary
sec-toplady-poem
sec-anecdotes-misc
sec-anne-dutton
sec-chain
sec-legacy
sec-whiston-bayly
sec-baptism-method
sec-hymnology
sec-gill-brown-atlantic
sec-gill-rippon-ocean
sec-nettles
```

## 4.5 Correct split of responsibilities

### Historical visual witness may protect

- rail width and placement;
- dots and track geometry;
- animation behavior;
- active-state behavior;
- mobile/desktop layout.

### Current outline gate must protect

```text
eligible H2/H3 == generated TOC anchors
stored level == actual heading level
unique IDs
monotonic document order
explicit exclusion reason for every omitted heading
```

Suggested exclusion form:

```html
<h3 data-toc="false" data-toc-reason="source-subheading">
```

---

# 5. Roman-number collision

The standalone page “Part II. The Scholar” begins its article body with:

```text
III. Theological works and the result of a life
IV. Polemics and debates of the age
```

The standalone page “Part III. The Legacy” begins with:

```text
V. Historical influence and memory
```

These are remnants of a hidden mega-article. Publishing series Part IV would make Roman IV mean both:

- fourth document in the series;
- old internal mega-article chapter.

Decision:

```text
Roman numerals identify series parts only.
Internal article H2 headings are unnumbered or locally Arabic-numbered.
```

---

# 6. Part III editorial reconstruction

## 6.1 Current structural failure

The article reaches:

```text
final sermons
final testimony
death
burial
Latin epitaph
```

Then it resumes with major material on eternal generation, hyper-Calvinism, Spurgeon, church polity, Islam, America and modern rediscovery. A full sources section also appears before the article’s final substantive chapters.

## 6.2 Internal duplicate clusters

### Islam

```text
sec-gill-islam
sec-gill-islam-detail
```

### Spurgeon

```text
sec-spurgeon-legacy
sec-spurgeon-commentary
later repeated 1859 foundation-stone account
```

### Final days

Final sermons and death are narrated before burial and again under `sec-gill-last-pages`.

### Toplady

The Black Prince/Marlborough comparison is quoted repeatedly.

### America

Morgan Edwards, Brown University and transatlantic influence are stated and restated.

## 6.3 Required order

```text
1. Reception and disputes
2. Ecclesial and transatlantic influence
3. Spurgeon and later reception
4. Final ministry and illness
5. Death, burial and epitaph
6. Short modern reassessment
7. Bridge to Part IV
8. Sources
9. Quiz
```

No new doctrinal trial after death/burial. No new article body after sources.

---

# 7. Content ownership matrix

## 7.1 Introduction — historical world

Owner question:

```text
What legal, ecclesial, educational, print and urban world produced Gill?
```

Owns:

- Reformation to dissent;
- Particular versus General Baptists;
- Great Ejection and legal memory;
- toleration without equality;
- dissenting academies;
- confessional genealogy;
- print economy;
- funds, associations and mutual aid;
- Salters’ Hall;
- London religious marketplace;
- Southwark and provincial Kettering context.

Does not own full personal biography or final doctrinal judgment.

## 7.2 Part I — the man

Owner question:

```text
How did Gill become the pastor and person he was?
```

Owns:

- childhood and bookshop;
- conversion and baptism;
- call and ordination;
- family, illness and grief;
- personal piety;
- pastoral beginnings;
- Skepp as personal/intellectual influence;
- local declaration as biographical event.

Historical events already explained in the Introduction receive compact callbacks, not full repetition.

## 7.3 Part II — the scholar

Owner question:

```text
How did Gill study, write, publish and argue?
```

Keep:

- Hebrew/rabbinic learning;
- Song of Songs as early scholarly work;
- textual scholarship and Kennicott;
- Hebrew-language dissertation;
- nine-volume commentary;
- exegetical method;
- Habakkuk 3:19 demonstration;
- publication history of Body of Divinity;
- D.D. degree and scholarly reputation;
- anti-deist apologetic method;
- patristic/Reformed source use;
- sermon-to-commentary workflow.

Split:

- `Cause of God and Truth`: publication architecture stays; disputed-text exegesis moves to Part IV;
- 1731 Trinity work: historical publication stays; doctrinal argument moves to Part IV.

## 7.4 Part III — the legacy

Owner question:

```text
How was Gill received, opposed, inherited and remembered?
```

Owns:

- historical label dispute;
- Wesley controversy as event;
- Spurgeon reception;
- Fuller/Carey development and correction;
- Gillites and denominational afterlife;
- America and Brown University;
- eyewitnesses;
- final ministry, death and burial;
- modern Gill scholarship/project.

It may report scholarly disagreement but should not reproduce the complete doctrinal trial.

## 7.5 Part IV — theology

Owner question:

```text
What did Gill teach, how did he read the decisive texts, and where should the system be affirmed or challenged?
```

Move, rewrite and consolidate:

- Trinity and eternal generation;
- decree, election and reprobation;
- covenant of grace;
- Spirit in the eternal counsel;
- fall and human corruption;
- particular redemption;
- eternal justification and ordo salutis;
- regeneration and effectual calling;
- perseverance;
- proclamation/offer/duty-faith;
- disputed universal-redemption texts;
- doctrinal evidence relevant to hyper-Calvinism.

## 7.6 Reference

Owns:

- complete work list;
- chronology;
- glossary;
- source matrix;
- editions and stable links;
- correction register;
- full theological-source catalogue.

---

# 8. Canonical Part IV decision

## 8.1 Permanent title

```text
Часть IV. Богословие
Спорные тексты и логика спасения в системе Джона Гилла
```

Do not freeze `7` or `9` into the H1.

## 8.2 Seven disputed texts

```text
1 Timothy 2:4
John 3:16
2 Peter 3:9
1 John 2:2
John 1:29
Romans 8:29
Romans 9
```

## 8.3 Two positive soteriological anchors

```text
John 3:3 — regeneration
Romans 8:30 — calling, justification, glorification
```

The nine-item Research list is therefore not nine texts of one category. It is seven disputed readings plus two positive anchors.

## 8.4 Article architecture

### 1. Why Gill remains difficult to classify

Open with the reputation paradox, not a repeated biography.

### 2. How to read three Gill corpora

Distinguish:

```text
Exposition
The Cause of God and Truth
Body of Divinity
```

A commentary remark, a polemical rebuttal and a systematic formulation have different rhetorical force.

### 3. System spine

Only the concepts needed for the exegesis:

```text
decree
covenant
fall
Christ
redemption
application by the Spirit
church
final state
```

### 4. Seven disputed texts

Group:

```text
“All” and “world”:
1 Tim 2:4; John 3:16; 1 John 2:2; John 1:29

Patience, foreknowledge and election:
2 Pet 3:9; Rom 8:29; Rom 9
```

Use one evidence card for each:

```text
Text
Gill’s reading
argument
primary-source location
strongest objection
editorial evaluation
```

### 5. Two positive anchors

Prevent the article from portraying Gill only as a rebutter.

### 6. Covenant and eternal justification

Define:

```text
decree versus execution
eternal union versus historical application
objective accomplishment versus court of conscience
```

### 7. Gospel proclamation, offer and duty-faith

Keep separate:

```text
external call
proclamation
offer
command to repent and believe
moral ability
regeneration
```

### 8. Was Gill a hyper-Calvinist?

Use a criterion matrix:

```text
criterion
Gill primary evidence
critical interpretation
defensive interpretation
editorial verdict
confidence
```

### 9. What should be received and challenged

End with theological judgment, pastoral consequences and later Baptist correction.

### 10. Sources and methodology

Primary texts first; secondary works labeled by viewpoint and role.

---

# 9. Research repository governance

## 9.1 Current conflict

Research currently treats these as peer proposals:

```text
03 — broad Part IV is straightforward
04 — broad Part IV duplicates Part II; prefer seven disputed texts
05 — extend to nine texts
07 — one introduction for both historical series context and Part IV
```

## 9.2 Required metadata

```yaml
status: canonical | supporting | superseded
supersedes:
supersededBy:
decisionScope:
lastVerifiedAgainstMain:
canonicalClaims:
openQuestions:
```

Recommended classification:

```text
03 = superseded structural proposal
04 = canonical scope correction
05 = canonical source/skeleton extension
07 = split required
```

## 9.3 Split dossier 07

```text
07A_SERIES_INTRO_HISTORICAL_BRIEF.md
07B_PART_IV_OPENING_BRIEF.md
07C_CLAIM_AND_QUOTE_REGISTER.md
```

## 9.4 Ten-million-word claim

Safe wording:

> Rippon reported more than ten thousand printing sheets/pages prepared and proofread by Gill. Modern writers sometimes extrapolate this to roughly ten million words; the number is a calculation, not Rippon’s own wording.

Do not say Rippon directly witnessed “more than ten million words.”

---

# 10. Historical Introduction expansion

## 10.1 Current strength

The context article has a coherent ten-H2 backbone and is the cleanest current Gill outline.

## 10.2 Current ownership errors

- the Kettering bookshop chapter tells personal biography already owned by Part I;
- Part I repeats Southwark;
- Part II repeats Salters’ Hall;
- Research dossier 07 imports eternal justification and the hyper-Calvinism verdict into the historical introduction.

## 10.3 Target

```text
24–28 minutes
approximately 5,000–5,600 words of clean prose
```

## 10.4 Proposed outline

```text
I.    From Reformation to English dissent
II.   Confessional genealogy: 1644 → Savoy 1658 → 1689 → Goat Yard 1729
III.  Particular and General Baptists
IV.   Great Ejection and memory of persecution
V.    Toleration without equality
VI.   Dissenting academies
VII.  The dissenting republic of print
VIII. Funds, associations and mutual aid
IX.   Salters’ Hall and the Trinitarian crisis
X.    London’s religious marketplace
XI.   Southwark as pastoral environment
XII.  Kettering and provincial dissent
XIII. Why this world produced Gill
```

## 10.5 Non-goals

The historical Introduction must not contain full treatments of:

```text
eternal justification
seven disputed texts
hyper-Calvinism verdict
Spurgeon’s final assessment
America
Gill’s death
```

---

# 11. TTS and Reader semantics

## 11.1 Current contradictions

### Schema versus custom Play

The context PageHead declares `.summary-card` and `[data-speakable]` as speakable. The custom TTS extractor explicitly skips nodes inside `.summary-card`.

### H4 disappears from audio

TTS selects only:

```text
p, h2, h3, li
```

Substantial H4 mini-chapter titles are silent, while their paragraphs continue.

### Glossary H3 pollution

Flip-card term titles use H3 inside a glossary section. They are not peer article chapters but enter the document outline and TTS as if they were.

### Tables disappear

Core evidence is presented in tables, yet TTS reads no `table`, `th`, `td` or `figcaption`. A spoken listener loses legal, bibliographic and scholarly-position matrices.

## 11.2 Reader AST

```ts
type ReaderBlock =
  | {
      kind: 'heading';
      id: string;
      level: 2 | 3;
      text: string;
      toc: boolean;
      audio: boolean;
    }
  | {
      kind: 'prose';
      audio: boolean;
      search: boolean;
    }
  | {
      kind: 'table';
      caption: string;
      audioSummary: string;
      searchSummary: string;
    }
  | {
      kind: 'aside';
      role: 'source' | 'note' | 'glossary' | 'author';
      toc: boolean;
      audio: boolean;
    };
```

One model must drive visible article, TOC, mobile TOC, scrollspy, TTS, Pagefind, print, structured data and reading time.

---

# 12. TTS model lifecycle

The Save-Data patch is mitigation, not consent.

Confirmed source properties:

- Vosk script URL is dynamically loaded;
- background warm-up checks local opt-out and `Save-Data`;
- `_voskWarmupStarted` is set before the opt-out return and is not reset;
- no-WebSpeech fallback directly loads Vosk and calls `ensureLoaded`, bypassing the warm-up opt-out path;
- download-start event is informational and never gates/block fetch;
- toast is short-lived;
- Stop cancels playback state, not model download/initialization;
- no visible lifecycle exists for progress, cancel, delete or storage management.

This remains under the existing `TTS-DL-CONSENT` owner-decision lane and must not be mixed with Gill content work.

---

# 13. Required validation gates

## `gill:outline:audit`

For every Gill page:

```text
all eligible H2/H3 have unique IDs
all eligible IDs appear exactly once in generated TOC
TOC level equals heading level
TOC order equals document order
no orphan targets
no undocumented exclusions
```

## `gill:reader-projection:audit`

Fail when:

- an essential table lacks `audioSummary`;
- a substantive heading is absent from audio;
- interactive chrome enters the article outline;
- schema speakable and custom Play rules disagree.

## `gill:content-ownership:audit`

Registry shape:

```yaml
topicId:
canonicalPage:
canonicalSectionId:
allowedTeaserPages:
```

Example:

```yaml
salters-hall:
  canonicalPage: context
  canonicalSectionId: sec-salters-hall
  allowedTeaserPages:
    - part2
```

Fail on multiple canonical owners or long duplicated passages.

## Manifest-driven consistency

The series consistency audit must derive expected items from the manifest, not hardcode five IDs and `149` minutes.

---

# 14. Reading-time targets after redistribution

Do not preserve `149` as a sacred total.

Recommended editorial ranges:

```text
Introduction  24–28 min
Part I        30–34 min
Part II       30–35 min
Part III      38–44 min
Part IV       40–46 min
Reference      9–12 min
----------------------
Total        171–199 min
```

Generate final values from canonical production content after relocation.

---

# 15. Atomic migration order

## Phase 1 — freeze ownership, not prose

Create:

```text
gill-series-manifest.ts
gill-topic-ownership.ts
Part IV source matrix
Research dossier status metadata
```

Mark every current section:

```text
KEEP
MOVE
SPLIT
MERGE
DELETE-DUPLICATE
REFERENCE
```

## Phase 2 — repair existing outlines

- remove legacy III/IV/V cross-document numbering;
- generate complete TOCs;
- move sources to the true end;
- eliminate Part III internal duplicates;
- replace “Trilogy” wording.

## Phase 3 — relocate doctrine

Move/rewrite doctrinal blocks into a Part IV draft. Leave concise linked historical summaries in Parts II–III.

## Phase 4 — expand the historical Introduction

Add only missing historical systems. Move personal Kettering material back to Part I.

## Phase 5 — publish all projections

Update atomically from one manifest:

```text
series UI
neighbor navigation
PageHead
CreativeWorkSeries JSON-LD
sitemap
RSS
llms.txt
biography/articles catalogs
Pagefind
TTS
reading time
tests
```

---

# 16. Priority queue

1. Choose and document the canonical production content source.
2. Replace five-item hardcoding with the series manifest.
3. Retire historical item count as a content requirement.
4. Build generated outline/Reader AST.
5. Fix the Roman-number collision.
6. Create section-by-section ownership manifest.
7. Deduplicate and reorder Part III.
8. Split Research dossier 07 and add dossier statuses.
9. Freeze seven disputed texts plus two positive anchors.
10. Expand the historical Introduction.
11. Author Part IV only after relocation.
12. Publish the six-document series atomically.

---

# 17. Canonical issue map

The operational matrix uses consolidated IDs to avoid hundreds of parallel rows:

```text
GILL-V10-SOURCE-TRUTH
  ← GILL-P0-015, GILL-P0-016, GILL-P1-105..107

GILL-V10-SERIES-MANIFEST
  ← GILL-P0-017, GILL-P0-019, GILL-P1-110

GILL-V10-HISTORICAL-TOC-CONTRACT
  ← GILL-P0-018, GILL-P0-040..042, GILL-P1-207

GILL-V10-ROMAN-NUMBER-COLLISION
  ← GILL-P0-043, GILL-P0-044

GILL-V10-PART3-NARRATIVE
  ← GILL-P0-045..047

GILL-V10-PART4-OWNERSHIP
  ← GILL-P0-048 and prior overlap findings

GILL-V10-RESEARCH-CANON
  ← GILL-P1-108, GILL-P1-208, GILL-P1-209, GILL-P0-049

GILL-V10-READER-PROJECTIONS
  ← GILL-P1-213..216

GILL-V10-TTS-CONSENT-LIFECYCLE
  ← GILL-P0-013, GILL-P0-014, GILL-P1-099..104

GILL-V10-CLAIM-PROVENANCE
  ← GILL-P1-210
```

Detailed source references and verification status are in `../REPORT.md` and `../evidence/SOURCE_EVIDENCE_INDEX.md`.
