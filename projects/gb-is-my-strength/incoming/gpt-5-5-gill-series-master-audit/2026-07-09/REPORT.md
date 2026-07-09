# Agent Audit Report — Gill series V10

## Meta
- Project: `gb-is-my-strength`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Research repo: `FedorMilovanov/Research`
- Agent: GPT-5.5 Thinking / source-structure auditor
- Date: 2026-07-09
- Audited branch: `main`
- Initial audited SHA: `ac26d8efa2b952df6dc46eef05908e6d65287e82`
- Current HEAD at end: `30d9fb61fe2c9116ee53a54d681c01455eef4fe6`
- Research HEAD: `58e1ea5fab638812ae693a1d0b1e79c4dcb47131`
- Environment: direct GitHub source inspection
- Build mode: source-only audit
- Browser / device: not used

## Verification boundary

This report provides one witness angle:

```text
W1 source witness
verified-source
needs-cross-verification
```

All severities below are **proposals**. New Gill rows are not `confirmed-current`, are not counted as canonical open bugs and are not repair-ready. Promotion is controlled by:

- `../../../working/START_HERE_2026-07-09.md`
- `../../../verification/START_HERE_2026-07-09.md`

## Current-head reconciliation

The baseline range `ac26d8e..30d9fb61` contains seven commits. It includes intervening Gill rail/Floating Cluster/PageHead work and Merge PR #50 restoring Part III illustrations.

Recheck results:

- article-body/data/audit source predicates behind the candidates remain observed;
- current `GillSeriesRail.astro` now correctly counts only Roman-numbered parts as `Часть X из 3`, so the old `3 из 5` display subclaim is removed;
- PR #50 introduced a separate runtime figure-relocation candidate;
- no build/browser/production-like witness was produced.

Full delta: `evidence/REVERIFY_DELTA_30d9fb61.md`.

---

## 1. New Findings

### GILL-V10-SOURCE-TRUTH
- Title: Three competing content representations can make production, Research and audits disagree
- Proposed severity: P0 publication blocker
- Route(s): all Gill-series routes
- Source file(s): MDX corpus, production Astro article bodies, root legacy shadows, consistency audit
- Observed on SHA: `30d9fb61`
- Expected: one declared canonical source feeds production, Research, metadata and reader projections.
- Actual source observation: production routes render Astro bodies; the consistency audit calls MDX/frontmatter canonical inputs; root legacy HTML remains. Part II contains a direct MDX↔Astro factual divergence around Salters’ Hall 1719 and Gill’s 1720 pastorate.
- Evidence: artifact §2; source index.
- Confidence: high for source observation
- Verification: `W1 / verified-source / needs-cross-verification`
- Required next witness: independent source review + production-like artifact comparison
- Suggested repair lane: canonical content source / generated projections
- Consolidates candidate sub-IDs: `GILL-P0-015`, `GILL-P0-016`, `GILL-P1-105..107`.

### GILL-V10-SERIES-MANIFEST
- Title: Five-document hardcoding can block safe Part IV publication
- Proposed severity: P0 publication blocker
- Source file(s): `data/series.json`, `gillSeriesData.ts`, `gill-series-data-consistency-audit.js`
- Observed on SHA: `30d9fb61`
- Actual source observation: IDs, marks, routes, expected order, MDX map and progress total `149` are maintained in multiple places. The consistency audit explicitly expects five items.
- Current-head correction: current rail code already fixed the former `Часть 3 из 5` display bug by counting only Roman items. That stale subclaim is excluded.
- Evidence: artifact §3; source index.
- Confidence: high for source observation
- Verification: `W1 / verified-source / needs-cross-verification`
- Required next witness: second source inventory + sixth-item mutation test
- Suggested repair lane: manifest-driven series graph
- Consolidates candidate sub-IDs: `GILL-P0-017`, `GILL-P0-019`, `GILL-P1-110`.

### GILL-V10-HISTORICAL-TOC-CONTRACT
- Title: Historical submenu count may be protected more strongly than current article completeness
- Proposed severity: P0 publication blocker
- Source file(s): reconciliation JSON, submenu regression audit, series TOC data, article bodies
- Observed on SHA: `30d9fb61`
- Actual source observation: policy preserves historical labels/order/item count while comments acknowledge Part II grew from 6 to 29 sections; the audit requires current rendered count to equal historical count. Part I/III also have source headings absent from the configured menu.
- Evidence: artifact §4.
- Confidence: high for source observation
- Verification: `W1 / verified-source / needs-cross-verification`
- Required next witness: built heading↔TOC inventory + browser scrollspy witness
- Suggested repair lane: generated outline / Reader AST
- Consolidates candidate sub-IDs: `GILL-P0-018`, `GILL-P0-040..042`, `GILL-P1-207`.

### GILL-V10-ROMAN-NUMBER-COLLISION
- Title: Standalone Parts II–III preserve hidden mega-article chapter numbering
- Proposed severity: P0 publication blocker
- Observed on SHA: `30d9fb61`
- Actual source observation: Part II begins with internal III/IV; Part III begins with V. A future series Part IV could collide semantically with internal IV.
- Evidence: current article-body headings.
- Confidence: high for source observation
- Verification: `W1 / verified-source / needs-cross-verification`
- Required next witness: independent editorial/source review + rendered outline capture
- Suggested repair lane: outline normalization before Part IV
- Consolidates candidate sub-IDs: `GILL-P0-043`, `GILL-P0-044`.

### GILL-V10-PART3-NARRATIVE
- Title: Part III appears non-terminal, duplicated and partially navigable
- Proposed severity: P0 publication blocker
- Observed on SHA: `30d9fb61`; article body unchanged by PR #50
- Actual source observation: death/burial/epitaph and a sources block are followed by major new content. Islam, Spurgeon, Toplady, America and final-days clusters recur. Several source headings are absent from configured TOC data.
- Evidence: artifact §6.
- Confidence: high for source ordering; editorial impact needs another reviewer
- Verification: `W1 / verified-source / needs-cross-verification`
- Required next witness: independent section-order and duplication ledger
- Suggested repair lane: Part III editorial restructure
- Consolidates candidate sub-IDs: `GILL-P0-045..047`.

### GILL-V10-PART4-OWNERSHIP
- Title: Part IV may duplicate doctrine already owned by Parts II–III
- Proposed severity: P0 publication blocker
- Observed on SHA: source `30d9fb61`, Research `58e1ea5`
- Actual source observation: Part II already contains Trinity, covenant, eternal justification, ordo salutis, pactum salutis, redemption, ordinances, ecclesiology, eschatology and gospel-offer material; Part III adds doctrinal adjudication.
- Evidence: artifact §§7–8.
- Confidence: high for topic presence; ownership is an editorial decision
- Verification: `W1 / verified-source / needs-cross-verification`
- Required next witness: independent topic map + owner decision
- Suggested repair lane: topic ownership manifest + relocation
- Consolidates candidate sub-IDs: `GILL-P0-048` and prior overlap findings.

### GILL-V10-RESEARCH-CANON
- Title: Research contains competing Part IV/Introduction plans without status metadata
- Proposed severity: P1
- Observed on SHA: Research `58e1ea5`
- Actual source observation: dossier 03 recommends broad Part IV; 04 argues that broad Part IV duplicates Part II and prefers seven disputed texts; 05 expands the working set; 07 serves both historical Introduction and Part IV opening.
- Evidence: artifact §9.
- Confidence: high for document conflict
- Verification: `W1 / verified-source / needs-cross-verification`
- Required next witness: independent Research-repo classification
- Suggested repair lane: Research status metadata and split dossier 07
- Consolidates candidate sub-IDs: `GILL-P1-108`, `GILL-P1-208`, `GILL-P1-209`, `GILL-P0-049`.

### GILL-V10-INTRO-OWNERSHIP
- Title: Historical Introduction appears to overlap biography and later doctrine
- Proposed severity: P1
- Observed on SHA: `30d9fb61`
- Actual source observation: Kettering bookshop biography overlaps Part I; Part I/II repeat Southwark and Salters’ Hall; Research dossier 07 imports hyper-Calvinism and eternal justification into the historical opening.
- Evidence: artifact §10.
- Confidence: high for overlap; final ownership needs editorial review
- Verification: `W1 / verified-source / needs-cross-verification`
- Required next witness: independent overlap map + owner decision
- Suggested repair lane: historical Introduction expansion after ownership freeze

### GILL-V10-READER-PROJECTIONS
- Title: TOC, custom TTS, schema speakable, search and print use different source projections
- Proposed severity: P1
- Observed on SHA: `30d9fb61`
- Actual source observation: schema marks summary content speakable while custom Play excludes `.summary-card`; H4 titles and tables are absent from the custom TTS selector; glossary card headings can enter the document outline.
- Evidence: artifact §11.
- Confidence: high for selector contradiction; user impact unverified
- Verification: `W1 / verified-source / needs-cross-verification`
- Required next witness: built artifact + browser/TTS/a11y/print checks
- Suggested repair lane: Reader AST / semantic projections
- Consolidates candidate sub-IDs: `GILL-P1-213..216`.

### GILL-V10-TTS-CONSENT-LIFECYCLE
- Title: Save-Data mitigation does not itself establish consent or a cancellable ~280 MB lifecycle
- Relation: confirmation/extension of existing canonical row `TTS-DL-CONSENT`; not a new Gill candidate count
- Observed on SHA: `30d9fb61`
- Source observation: no-WebSpeech fallback directly loads Vosk; download-start is informational rather than a gate; Stop does not abort model initialization; no visible model progress/delete/storage lifecycle exists.
- Witness contribution: additional independent source confirmation for the existing row
- Recommended status: keep existing P1 row; owner UX decision and repair-ready checks still required
- Consolidates candidate sub-IDs: `GILL-P0-013`, `GILL-P0-014`, `GILL-P1-099..104`.

### GILL-V10-CLAIM-PROVENANCE
- Title: Research attributes a modern ten-million-word extrapolation directly to Rippon
- Proposed severity: P1
- Observed on SHA: Research `58e1ea5`
- Actual source observation: dossier 07 first states that Rippon’s “more than ten thousand” refers to printing sheets and that ten million words is a modern extrapolation; a later paragraph says Rippon testified to more than ten million words.
- Evidence: artifact §9.4; Research dossier 07.
- Confidence: high
- Verification: `W1 / verified-source / needs-cross-verification`
- Required next witness: independent primary-source/Research correction check
- Suggested repair lane: claim-and-quote register

### GILL-V10-RESTORED-FIGURE-RELOCATION
- Title: Restored Part III figures SSR after the article and are moved client-side by fragile anchors
- Proposed severity: P2
- Observed on SHA: `30d9fb61`
- Source files: `GillPart3MainShell.astro`, `GillPart3RestoredFigures.astro`
- Actual source observation: figures initially exist outside `<article data-pagefind-body>`. Inline JS moves one by heading/neighbor elements and the burial figure by matching exact Russian prose.
- Evidence: `evidence/REVERIFY_DELTA_30d9fb61.md`.
- Confidence: high for source behavior; impact unverified
- Verification: `W1 / verified-source / needs-cross-verification`
- Required next witness: no-JS/Pagefind/print/TTS/browser checks
- Suggested repair lane: direct semantic placement or Reader projection

---

## 2. Confirmations of Existing Findings

### Confirm TTS-DL-CONSENT
- Target: `incoming/tts-delivery-architecture-verification-2026-07-08/REPORT.md`
- My evidence: current control flow still treats Save-Data/opt-out as partial warm-up mitigation, not explicit consent.
- Recommended status: retain existing P1; owner decision required; not repair-ready.

### Confirm AUDIT-P2-MATRIX-DRIFT
- My evidence: Gill series has a concrete five-document drift set across data, audit, progress totals and source maps.
- Current-head correction: do not reuse the stale `3 из 5` rail-display subclaim.
- Recommended status: keep generic site-wide row; Gill manifest remains a pending scoped candidate.

### Confirm GATE-MARKER-DATA-DRIFT
- My evidence: historical submenu count remains encoded while current article structure has expanded.
- Recommended status: keep generic P3 row; scoped Gill candidate awaits independent witnesses.

---

## 3. Challenges / Disputes

### Challenge: “green Gill submenu audit proves complete current navigation”
The source audit compares rendered rows to a historical manifest and does not itself prove all eligible current headings are represented. A build/browser witness is required.

### Challenge: “Part IV is a simple sixth article”
Parts II–III contain substantial proposed doctrine. Relocation-first is a working proposal pending owner/editorial verification.

### Proposed resolution: seven versus nine
A possible classification is:

- seven disputed/universal-redemption texts;
- two positive soteriological anchors (`John 3:3`, `Romans 8:30`).

This is not canonical until independently checked and accepted by the owner. Avoid putting either count in the permanent H1 before that decision.

---

## 4. Duplicate / Merge Proposals

- `GILL-V10-HISTORICAL-TOC-CONTRACT` proposes consolidating `GILL-P0-018`, `040..042`, `P1-207` and Part III outline gaps.
- `GILL-V10-SOURCE-TRUTH` proposes consolidating `GILL-P0-015`, `016`, `GILL-P1-105..107`.
- `GILL-V10-PART4-OWNERSHIP` proposes consolidating broad Part IV overlap findings.
- `GILL-V10-RESTORED-FIGURE-RELOCATION` remains separate because it was introduced after the baseline and has a precise source target.

All merge proposals remain `proposal-open`.

---

## 5. Severity Proposals

- Six Gill candidates are proposed P0 **publication blockers**, not whole-site outage claims.
- Four Gill candidates are proposed P1.
- `GILL-V10-RESTORED-FIGURE-RELOCATION` is proposed P2 pending impact witnesses.
- No proposed severity is canonical yet.

---

## 6. Repair Lane Suggestions

These are working suggestions only:

### Lane A — canonical graph
`GILL-V10-SOURCE-TRUTH`, `GILL-V10-SERIES-MANIFEST`

### Lane B — outline and Reader model
`GILL-V10-HISTORICAL-TOC-CONTRACT`, `GILL-V10-ROMAN-NUMBER-COLLISION`, `GILL-V10-READER-PROJECTIONS`, `GILL-V10-RESTORED-FIGURE-RELOCATION`

### Lane C — editorial ownership
`GILL-V10-PART3-NARRATIVE`, `GILL-V10-PART4-OWNERSHIP`, `GILL-V10-INTRO-OWNERSHIP`

### Lane D — Research governance
`GILL-V10-RESEARCH-CANON`, `GILL-V10-CLAIM-PROVENANCE`

### Lane E — atomic publication
Only after verified A–D decisions: series UI, navigation, PageHead, series JSON-LD, sitemap, RSS, llms.txt, catalogs, Pagefind, TTS, print, reading time and tests.

---

## 7. Reverify Notes

- Initial source: `ac26d8e`.
- Final source: `30d9fb61`.
- Full seven-commit delta inspected for relevant files.
- Current rail fixed the old numbered-part display subclaim.
- PR #50 introduced the restored-figure relocation candidate.
- Result for new Gill rows: `verified-source / needs-cross-verification`.
- No browser, build or production-like run was performed.
- No claim that source CI/deploy is green.
- No source-code change was made.
- No third-party incoming evidence was edited or deleted.

---

## 8. Notes for Verifier

### Proposed Part IV title

```text
Часть IV. Богословие
Спорные тексты и логика спасения в системе Джона Гилла
```

### Proposed historical Introduction target

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

### Publication proposal

Do not publish Part IV additively before the graph, outline and ownership candidates are independently verified and accepted.