# Agent Audit Report — Gill series V10

## Meta
- Project: `gb-is-my-strength`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Research repo: `FedorMilovanov/Research`
- Agent: GPT-5.5 Thinking / source-structure verifier
- Date: 2026-07-09
- Audited branch: `main`
- Initial audited SHA: `ac26d8efa2b952df6dc46eef05908e6d65287e82`
- Current HEAD at end: `30d9fb61fe2c9116ee53a54d681c01455eef4fe6`
- Research HEAD: `58e1ea5fab638812ae693a1d0b1e79c4dcb47131`
- Environment: direct GitHub source inspection
- Build mode: source-only audit
- Browser / device: not used

## Current-head reconciliation

Source advanced during the audit through Merge PR #50, which restored Gill Part III illustrations. `GillPart3ArticleBody.astro` did not change, so all original V10 structural/content findings remain current. The new `GillPart3RestoredFigures.astro` design adds one current-head P2 finding: figures SSR outside the article and are moved client-side into semantic positions.

Full delta: `evidence/REVERIFY_DELTA_30d9fb61.md`.

---

## 1. New Findings

### GILL-V10-SOURCE-TRUTH
- Title: Three competing content truths make production, Research and audits disagree
- Severity: P0
- Route(s): all Gill-series routes
- Source file(s): MDX corpus, production Astro article bodies, root legacy shadows, consistency audit
- Observed on SHA: `30d9fb61` (original comparison at `ac26d8e`; affected files unchanged)
- Expected: one canonical content source feeds production, Research, word counts, dates, search, TTS and structured data.
- Actual: production renders Astro bodies; Research/audits frequently treat MDX as canonical; root legacy HTML persists as a third shadow. A direct factual divergence already exists in Part II around Salters’ Hall 1719 versus the 1720 pastorate.
- Evidence: artifact §2; source index.
- Confidence: high
- Verification level: L3 source-current
- Suggested repair lane: canonical content source / generated projections
- Consolidates: `GILL-P0-015`, `GILL-P0-016`, `GILL-P1-105..107`.

### GILL-V10-SERIES-MANIFEST
- Title: Five-document hardcoding and its audit block safe Part IV publication
- Severity: P0
- Source file(s): `data/series.json`, `gillSeriesData.ts`, `gill-series-data-consistency-audit.js`
- Observed on SHA: `30d9fb61`
- Actual: IDs, marks, routes, expected order, MDX map, progress total `149` and 5-of-5 labels are maintained in multiple places.
- Evidence: artifact §3.
- Confidence: high
- Verification level: L3 source-current
- Suggested repair lane: manifest-driven series graph
- Consolidates: `GILL-P0-017`, `GILL-P0-019`, `GILL-P1-110`.

### GILL-V10-HISTORICAL-TOC-CONTRACT
- Title: Historical submenu count is protected more strongly than current article completeness
- Severity: P0
- Source file(s): reconciliation JSON, submenu regression audit, series TOC data, article bodies
- Observed on SHA: `30d9fb61`
- Actual: policy preserves historical item count while admitting Part II grew from 6 to 29 sections; the audit requires rendered count to equal the historical count. Part I/III also contain meaningful current headings absent from the menu.
- Evidence: artifact §4.
- Confidence: high
- Verification level: L3 source-current
- Suggested repair lane: generated outline / Reader AST
- Consolidates: `GILL-P0-018`, `GILL-P0-040..042`, `GILL-P1-207`.

### GILL-V10-ROMAN-NUMBER-COLLISION
- Title: Standalone Parts II–III preserve hidden mega-article chapter numbering
- Severity: P0
- Observed on SHA: `30d9fb61`
- Actual: Part II begins with internal III/IV; Part III begins with V. Planned series Part IV would collide semantically with internal IV.
- Evidence: production article-body headings.
- Confidence: high
- Verification level: L3 source-current
- Suggested repair lane: outline normalization before Part IV
- Consolidates: `GILL-P0-043`, `GILL-P0-044`.

### GILL-V10-PART3-NARRATIVE
- Title: Part III is non-terminal, duplicated and only partially navigable
- Severity: P0
- Observed on SHA: `30d9fb61`; article body unchanged by PR #50
- Actual: death/burial/epitaph and a sources block are followed by major new content. Islam, Spurgeon, Toplady, America and final-days material repeat. Many real headings are absent from TOC.
- Evidence: artifact §6.
- Confidence: high
- Verification level: L3 source-current
- Suggested repair lane: Part III editorial restructure
- Consolidates: `GILL-P0-045..047`.

### GILL-V10-PART4-OWNERSHIP
- Title: Part IV cannot be additive because Parts II–III already consume its doctrinal scope
- Severity: P0
- Observed on SHA: source `30d9fb61`, Research `58e1ea5`
- Actual: Part II already contains Trinity, covenant, eternal justification, ordo salutis, pactum salutis, redemption, ordinances, ecclesiology, eschatology and gospel-offer material; Part III adds doctrinal adjudication.
- Evidence: artifact §§7–8.
- Confidence: high
- Verification level: L3 source-current for structure; owner decision required for relocation
- Suggested repair lane: topic ownership manifest + relocation
- Consolidates: `GILL-P0-048` and prior overlap findings.

### GILL-V10-RESEARCH-CANON
- Title: Research contains mutually superseding Part IV/Introduction plans without status metadata
- Severity: P1
- Observed on SHA: Research `58e1ea5`
- Actual: dossier 03 recommends broad Part IV; 04 says it duplicates Part II and prefers seven disputed texts; 05 expands to nine; 07 serves both the historical Introduction and Part IV opening.
- Evidence: artifact §9.
- Confidence: high
- Verification level: L2 source-current
- Suggested repair lane: Research status metadata and split dossier 07
- Consolidates: `GILL-P1-108`, `GILL-P1-208`, `GILL-P1-209`, `GILL-P0-049`.

### GILL-V10-INTRO-OWNERSHIP
- Title: Historical Introduction repeats biography and later doctrine instead of missing historical systems
- Severity: P1
- Observed on SHA: `30d9fb61`
- Actual: Kettering bookshop biography overlaps Part I; Part I/II repeat Southwark and Salters’ Hall; Research dossier 07 imports hyper-Calvinism and eternal justification into the historical opening.
- Evidence: artifact §10.
- Confidence: high
- Verification level: L3 source-current
- Suggested repair lane: historical Introduction expansion after ownership freeze

### GILL-V10-READER-PROJECTIONS
- Title: TOC, custom TTS, schema speakable, search and print infer different articles
- Severity: P1
- Observed on SHA: `30d9fb61`
- Actual: schema marks summary speakable while custom Play excludes it; H4 titles disappear from audio; glossary card titles pollute H3 outline; essential tables have no spoken summary.
- Evidence: artifact §11.
- Confidence: high
- Verification level: source contradiction confirmed; browser/a11y witness pending
- Suggested repair lane: Reader AST / semantic projections
- Consolidates: `GILL-P1-213..216`.

### GILL-V10-TTS-CONSENT-LIFECYCLE
- Title: Save-Data mitigation does not establish consent or a cancellable ~280 MB lifecycle
- Severity: P1
- Observed on SHA: `30d9fb61`
- Actual: no-WebSpeech fallback bypasses warm-up opt-out path; download-start is informational, not a gate; Stop does not abort model download/initialization; no visible progress/delete/storage lifecycle exists.
- Relation: extends existing matrix row `TTS-DL-CONSENT`; not counted as a duplicate matrix row.
- Consolidates: `GILL-P0-013`, `GILL-P0-014`, `GILL-P1-099..104`.

### GILL-V10-CLAIM-PROVENANCE
- Title: Research turns an inferred ten-million-word estimate into a Rippon primary-source claim
- Severity: P1
- Observed on SHA: Research `58e1ea5`
- Actual: dossier 07 correctly calls ten million words a modern extrapolation, then later attributes that number directly to Rippon.
- Evidence: artifact §9.4.
- Confidence: high
- Verification level: L2 source-current
- Suggested repair lane: claim-and-quote register

### GILL-V10-RESTORED-FIGURE-RELOCATION
- Title: Restored Part III figures are SSR-rendered after the article and moved client-side by fragile anchors
- Severity: P2
- Observed on SHA: `30d9fb61`
- Source files: `GillPart3MainShell.astro`, `GillPart3RestoredFigures.astro`
- Actual: figures initially exist outside `<article data-pagefind-body>`. Inline JS moves one by heading ID/neighbor paragraphs and the burial figure by matching exact Russian prose text. No-JS, Pagefind, print/snapshot and TTS semantics can differ.
- Evidence: `evidence/REVERIFY_DELTA_30d9fb61.md`.
- Confidence: high for source behavior; impact needs browser/Pagefind/print witness
- Verification level: L2 source-current / needs-browser-witness
- Suggested repair lane: render figures directly in owning semantic sections or Reader AST

---

## 2. Confirmations of Existing Findings

### Confirm TTS-DL-CONSENT
- Target: `incoming/tts-delivery-architecture-verification-2026-07-08/REPORT.md`
- Evidence: current control flow still treats Save-Data/opt-out as partial warm-up mitigation, not explicit consent.
- Recommended status: remain P1; owner decision required; not repair-ready.

### Confirm AUDIT-P2-MATRIX-DRIFT
- Evidence: Gill series has a concrete five-item drift set across data, UI, audit, minutes and route/mark maps.
- Recommended status: keep generic site-wide row; scoped Gill manifest blocker is separately P0 for Part IV.

### Confirm GATE-MARKER-DATA-DRIFT
- Evidence: historical submenu audit freezes six Part II rows while comments admit twenty-nine current sections.
- Recommended status: keep generic P3 row; Gill scoped root cause is P0.

---

## 3. Challenges / Disputes

### Challenge: “green Gill submenu audit proves complete current navigation”
The audit compares rendered rows to a historical manifest and never proves all eligible current H2/H3 headings are represented. Treat the gate as a visual witness only after removing content-count semantics.

### Challenge: “Part IV is a simple sixth article”
Production Parts II–III already contain the proposed doctrine. Replace additive authoring with relocation-first ownership.

### Challenge: “seven versus nine is an unresolved number choice”
Canonical distinction:

- seven disputed texts;
- two positive soteriological anchors (`John 3:3`, `Romans 8:30`).

Do not put either count in the permanent H1.

---

## 4. Duplicate / Merge Proposals

- `GILL-V10-HISTORICAL-TOC-CONTRACT` consolidates `GILL-P0-018`, `040..042`, `P1-207` and Part III outline gaps.
- `GILL-V10-SOURCE-TRUTH` consolidates `GILL-P0-015`, `016`, `GILL-P1-105..107`.
- `GILL-V10-PART4-OWNERSHIP` consolidates broad Part IV overlap findings.
- `GILL-V10-RESTORED-FIGURE-RELOCATION` remains separate because it was introduced after the initial V10 baseline and has a precise current repair target.

---

## 5. Severity Proposals

- P0 Gill rows are publication/migration blockers, not whole-site outage claims.
- `GILL-V10-READER-PROJECTIONS` remains P1 pending browser/a11y witness.
- `GILL-V10-RESTORED-FIGURE-RELOCATION` is P2 pending demonstrated Pagefind/print/no-JS impact.
- `GILL-V10-CLAIM-PROVENANCE` is P1 and must block the inaccurate claim from publication.

---

## 6. Repair Lane Suggestions

### Lane A — canonical graph
`GILL-V10-SOURCE-TRUTH`, `GILL-V10-SERIES-MANIFEST`

### Lane B — outline and Reader AST
`GILL-V10-HISTORICAL-TOC-CONTRACT`, `GILL-V10-ROMAN-NUMBER-COLLISION`, `GILL-V10-READER-PROJECTIONS`, `GILL-V10-RESTORED-FIGURE-RELOCATION`

### Lane C — editorial ownership
`GILL-V10-PART3-NARRATIVE`, `GILL-V10-PART4-OWNERSHIP`, `GILL-V10-INTRO-OWNERSHIP`

### Lane D — Research governance
`GILL-V10-RESEARCH-CANON`, `GILL-V10-CLAIM-PROVENANCE`

### Lane E — atomic publication
After A–D, update series UI, navigation, PageHead, CreativeWorkSeries JSON-LD, sitemap, RSS, llms.txt, catalogs, Pagefind, TTS, print, reading time and tests from one manifest.

Do not mix these lanes with PremiumControls visual redesign, Vosk delivery architecture or glossary data.

---

## 7. Reverify Notes

- Initial source: `ac26d8e`.
- Final current source: `30d9fb61`.
- Delta inspected file-by-file.
- `GillPart3ArticleBody.astro` unchanged, so V10 body/TOC/narrative findings remain current.
- New restored-figure component introduced one P2 semantic-placement risk.
- No browser or production-like build was run.
- No claim that source CI/deploy is green.
- No source-code change was made.
- No third-party incoming evidence was edited or deleted.

---

## 8. Notes for Verifier

### Proposed Part IV

```text
Часть IV. Богословие
Спорные тексты и логика спасения в системе Джона Гилла
```

### Historical Introduction target

- 24–28 minutes;
- 5,000–5,600 words;
- add confessional genealogy, print economy, funds/networks, religious marketplace, toleration-versus-equality and provincial dissent;
- move personal Kettering/bookshop biography to Part I.

### Proposed gates

```text
gill:outline:audit
gill:reader-projection:audit
gill:content-ownership:audit
manifest-driven gill:series:data:consistency:audit
```

### Publication rule

Do not publish Part IV as an additive page. Repair the graph, outline and ownership first, then publish the six-document series atomically.