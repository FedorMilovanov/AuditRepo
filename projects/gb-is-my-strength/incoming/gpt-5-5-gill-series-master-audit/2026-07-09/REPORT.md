# Agent Audit Report — Gill series V10

## Meta
- Project: `gb-is-my-strength`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Research repo: `FedorMilovanov/Research`
- Agent: GPT-5.5 Thinking / source-structure verifier
- Date: 2026-07-09
- Audited branch: `main`
- Audited SHA: `ac26d8efa2b952df6dc46eef05908e6d65287e82`
- Current HEAD at start: `ac26d8efa2b952df6dc46eef05908e6d65287e82`
- Current HEAD at end: `ac26d8efa2b952df6dc46eef05908e6d65287e82`
- Research HEAD: `58e1ea5fab638812ae693a1d0b1e79c4dcb47131`
- Environment: direct GitHub source inspection
- Build mode: source-only audit
- Browser / device: not used

---

## 1. New Findings

### GILL-V10-SOURCE-TRUTH
- Title: Three competing content truths make production, Research and audits disagree
- Severity: P0
- Route(s): all Gill-series routes
- Source file(s):
  - `src/content/articles/dzhon-gill-*.mdx`
  - `src/components/article-pilots/gill-*/Gill*ArticleBody.astro`
  - root `articles/dzhon-gill-*/index.html`
  - `scripts/gill-series-data-consistency-audit.js`
- Observed on SHA: `ac26d8e`
- Expected: one canonical content source feeds production render, Research verification, word counts, dates, search, TTS and structured data.
- Actual: production renders Astro bodies; Research and some audits treat MDX as canonical; root legacy HTML still exists as a third shadow. Direct factual divergence is already present: Part II MDX describes 1720 as the same year as Salters’ Hall 1719, while the production Astro body correctly says the following year.
- Evidence: direct source comparison; full file in `artifacts/GILL_SERIES_MASTER_CUMULATIVE_AUDIT_V10.md`.
- Confidence: high
- Verification level: L2/L3 source-current
- Suggested repair lane: canonical-content-source / generated projections
- Do not mix with: visual Gill rail redesign
- Consolidates master IDs: `GILL-P0-015`, `GILL-P0-016`, `GILL-P1-105`, `GILL-P1-106`, `GILL-P1-107`.

### GILL-V10-SERIES-MANIFEST
- Title: The series is hardcoded as five documents and its audit is a migration blocker
- Severity: P0
- Route(s): all Gill-series routes
- Source file(s):
  - `data/series.json`
  - `src/components/article-pilots/gill-series/gillSeriesData.ts`
  - `scripts/gill-series-data-consistency-audit.js`
- Observed on SHA: `ac26d8e`
- Expected: a manifest models Introduction, numbered parts, Reference, status, route, reading time and content version; consumers generate UI and validation from it.
- Actual: five IDs, total `149`, marks, MDX maps and expected order are hardcoded. Adding Part IV requires editing multiple competing lists and risks green-but-wrong drift.
- Evidence: direct source inspection.
- Confidence: high
- Verification level: L2/L3 source-current
- Suggested repair lane: `gill-series-manifest`
- Do not mix with: Part IV prose authoring
- Consolidates master IDs: `GILL-P0-017`, `GILL-P0-019`, `GILL-P1-110`, plus prior manifest/data-drift findings.

### GILL-V10-HISTORICAL-TOC-CONTRACT
- Title: Historical submenu item count is protected more strongly than current article completeness
- Severity: P0
- Route(s): Part I, Part II, Part III
- Source file(s):
  - `data/gill-submenu-anchor-reconciliation.json`
  - `scripts/gill-pre-v16-submenu-regression-audit.js`
  - `src/components/article-pilots/gill-series/gillSeriesData.ts`
  - current Gill article bodies
- Observed on SHA: `ac26d8e`
- Expected: the visual witness protects geometry and behavior while current H2/H3 headings generate a complete TOC.
- Actual: reconciliation explicitly preserves historical labels/order/item count. It admits Part II grew from 6 to 29 sections, yet the audit fails if the rendered row count differs from the historical six. A green gate therefore certifies an intentionally incomplete outline.
- Evidence: exact reconciliation policy and `items.length===exp.length` gate.
- Confidence: high
- Verification level: L3 source-current
- Suggested repair lane: `gill-outline-reader-ast`
- Do not mix with: cosmetic submenu styling
- Consolidates master IDs: `GILL-P0-018`, `GILL-P0-040`, `GILL-P0-041`, `GILL-P0-042`, `GILL-P1-207`.

### GILL-V10-ROMAN-NUMBER-COLLISION
- Title: Standalone Parts II–III preserve hidden mega-article chapter numbering
- Severity: P0
- Route(s): `/articles/dzhon-gill-chast-2-uchenyi/`, `/articles/dzhon-gill-chast-3-nasledie/`, planned Part IV
- Source file(s): Part II and Part III Astro article bodies
- Observed on SHA: `ac26d8e`
- Expected: Roman numerals identify series parts only; each page has a coherent local outline.
- Actual: Part II begins with H2 `III` and then `IV`; Part III begins with H2 `V`. Adding series Part IV would make the same visible Roman numeral mean both the fourth document and a legacy internal chapter.
- Evidence: direct heading inspection.
- Confidence: high
- Verification level: L3 source-current
- Suggested repair lane: outline normalization before Part IV
- Do not mix with: content expansion
- Consolidates master IDs: `GILL-P0-043`, `GILL-P0-044`.

### GILL-V10-PART3-NARRATIVE
- Title: Part III is non-terminal, internally duplicated and only partially navigable
- Severity: P0
- Route(s): `/articles/dzhon-gill-chast-3-nasledie/`
- Source file(s): `src/components/article-pilots/gill-part3/GillPart3ArticleBody.astro`, `gillSeriesData.ts`
- Observed on SHA: `ac26d8e`
- Expected: reception/disputes → influence → final ministry → death/burial → short reassessment → sources → quiz.
- Actual: death, burial and epitaph are followed by major new doctrinal and biographical chapters; a full sources section is followed by more substantive content. Islam, Spurgeon, Toplady, America and final-days material repeat inside the same article. Many independent H3 sections are absent from the configured TOC.
- Evidence: direct source ordering and duplicate section IDs/topics.
- Confidence: high
- Verification level: L3 source-current
- Suggested repair lane: Part III editorial restructure
- Do not mix with: Part IV source verification
- Consolidates master IDs: `GILL-P0-045`, `GILL-P0-046`, `GILL-P0-047`.

### GILL-V10-PART4-OWNERSHIP
- Title: Part IV cannot be additive because Parts II–III already consume its doctrinal scope
- Severity: P0
- Route(s): Part II, Part III, planned Part IV
- Source file(s): Part II/III Astro bodies; Research dossiers `03`, `04`, `05`, `07`, `08`, `12`, `13`, `19`, `21`, `23`, `25`, `27`, `31`–`42`
- Observed on SHA: source `ac26d8e`, Research `58e1ea5`
- Expected: Part II owns scholarly method/publication; Part III owns reception/legacy; Part IV owns doctrinal synthesis and disputed-text exegesis.
- Actual: Part II already contains Trinity, covenant, eternal justification, ordo salutis, pactum salutis, redemption, ordinances, ecclesiology, eschatology and gospel-offer material. Part III adds doctrinal adjudication. A new article without relocation would create a third copy.
- Evidence: section-by-section ownership map in the artifact.
- Confidence: high
- Verification level: L3 source-current for structure; owner decision required for editorial move
- Suggested repair lane: content ownership manifest + relocation
- Do not mix with: publication metadata rollout until ownership is frozen
- Consolidates master IDs: `GILL-P0-048` and earlier overlap/duplication findings.

### GILL-V10-RESEARCH-CANON
- Title: Research contains mutually superseding Part IV and Introduction proposals without status metadata
- Severity: P1
- Route(s): Research repository / future source authoring
- Source file(s): `Джон Гилл/03_STRUCTURE_PROPOSAL.md`, `04_CONTENT_DEEPENING_AUDIT_AND_EXEGESIS_SET.md`, `05_BODY_OF_DIVINITY_TOC_AND_ARTICLE_SKELETON.md`, `07_VVEDENIE_DEEP.md`, `00_README_AND_NAVIGATION.md`
- Observed on SHA: `58e1ea5`
- Expected: each dossier declares `canonical`, `supporting` or `superseded`, with scope and successor.
- Actual: 03 says broad Part IV is straightforward; 04 says broad Part IV duplicates Part II and prefers seven disputed texts; 05 expands to nine texts; 07 designs both the historical Introduction and Part IV opening. The index lists all as peers.
- Evidence: direct Research file comparison.
- Confidence: high
- Verification level: L2 source-current
- Suggested repair lane: Research decision metadata
- Do not mix with: source website code
- Consolidates master IDs: `GILL-P1-108`, `GILL-P1-208`, `GILL-P1-209`, `GILL-P0-049`.

### GILL-V10-SEVEN-PLUS-TWO
- Title: Seven disputed texts and two positive anchors are incorrectly presented as competing article counts
- Severity: P1
- Route(s): planned Part IV
- Source file(s): Research dossiers 04 and 05
- Observed on SHA: `58e1ea5`
- Expected: distinguish disputed/universal-redemption texts from positive soteriological anchors.
- Actual: the same plan is alternately called seven-text and nine-text.
- Evidence: dossiers 04/05.
- Confidence: high
- Verification level: L2 source-current
- Suggested repair lane: Part IV editorial brief
- Canonical decision proposed:
  - disputed set: 1 Tim 2:4; John 3:16; 2 Pet 3:9; 1 John 2:2; John 1:29; Rom 8:29; Rom 9
  - positive anchors: John 3:3; Rom 8:30
  - permanent H1 must not contain `7` or `9`
- Consolidates master ID: `GILL-P1-208`.

### GILL-V10-INTRO-OWNERSHIP
- Title: The historical Introduction repeats personal biography and later doctrine instead of expanding missing historical systems
- Severity: P1
- Route(s): historical context, Part I, Part II
- Source file(s): Gill context sections, Part I/II bodies, Research dossier 07
- Observed on SHA: `ac26d8e` / `58e1ea5`
- Expected: Introduction explains confessional genealogy, legal status, print economy, dissenting networks, religious marketplace, Southwark and provincial dissent.
- Actual: the current Introduction retells Gill’s personal Kettering bookshop story; Part I and Part II retell Southwark and Salters’ Hall. Dossier 07 imports hyper-Calvinism, eternal justification and final theological verdict into the historical Introduction.
- Evidence: direct section ownership comparison.
- Confidence: high
- Verification level: L2/L3 source-current
- Suggested repair lane: historical Introduction expansion after ownership freeze
- Consolidates master IDs: `GILL-P1-211`, `GILL-P1-212`, `GILL-P0-049`.

### GILL-V10-READER-PROJECTIONS
- Title: TOC, custom TTS, schema speakable, search and print infer different articles from the DOM
- Severity: P1
- Route(s): all long-form articles, immediately visible in Gill pages
- Source file(s): `js/floating-cluster-controller.js`, Gill PageHeads, article bodies and tables
- Observed on SHA: `ac26d8e`
- Expected: one Reader AST declares heading, prose, table and aside projections for TOC/audio/search/print/schema.
- Actual:
  - JSON-LD marks `.summary-card` and `[data-speakable]` as speakable while custom TTS explicitly excludes `.summary-card`;
  - TTS reads only `p,h2,h3,li`, so H4 mini-chapter titles disappear;
  - glossary flip-card titles use H3 and pollute outline/audio;
  - essential tables have no audio summaries.
- Evidence: direct selector and markup inspection.
- Confidence: high
- Verification level: L3 source-current for selector contradictions; browser witness still needed for UX severity
- Suggested repair lane: Reader AST / semantic projections
- Do not mix with: neural-voice model delivery
- Consolidates master IDs: `GILL-P1-213`, `GILL-P1-214`, `GILL-P1-215`, `GILL-P1-216`.

### GILL-V10-TTS-CONSENT-LIFECYCLE
- Title: Save-Data mitigation does not establish consent or a cancellable 280 MB model lifecycle
- Severity: P1
- Route(s): pages using Floating Cluster TTS
- Source file(s): `js/floating-cluster-controller.js`, `js/vosk-tts-engine.js`
- Observed on SHA: `ac26d8e`
- Expected: explicit model choice/consent, progress, cancellation, storage management and consistent Save-Data/opt-out behavior.
- Actual: background warm-up can still start a large download after a Play click; no-WebSpeech fallback bypasses the warm-up opt-out path; the event is a notification, not a gate; Stop does not abort model download/initialization; the short toast is not lifecycle management.
- Evidence: source control flow.
- Confidence: high
- Verification level: L3 source-current; owner UX decision required
- Suggested repair lane: existing `TTS-DL-CONSENT` lane
- Do not mix with: Gill content restructure
- Consolidates master IDs: `GILL-P0-013`, `GILL-P0-014`, `GILL-P1-099`–`GILL-P1-104`.

### GILL-V10-CLAIM-PROVENANCE
- Title: Research turns an inferred ten-million-word estimate into a Rippon primary-source claim
- Severity: P1
- Route(s): future Introduction/Part IV copy
- Source file(s): Research `07_VVEDENIE_DEEP.md`
- Observed on SHA: `58e1ea5`
- Expected: separate Rippon’s “more than ten thousand” printing-sheet statement from modern word-count extrapolation.
- Actual: the dossier first states the distinction correctly, then later says Rippon witnessed more than ten million words.
- Evidence: internal dossier contradiction.
- Confidence: high
- Verification level: L2 source-current
- Suggested repair lane: claim-and-quote register
- Consolidates master ID: `GILL-P1-210`.

---

## 2. Confirmations of Existing Findings

### Confirm TTS-DL-CONSENT
- Target report: `incoming/tts-delivery-architecture-verification-2026-07-08/REPORT.md`
- Target finding: implicit ~280 MB Vosk model warm-up without explicit owner-approved consent UX
- My evidence: current `floating-cluster-controller.js` source confirms opt-out/Save-Data is only a partial warm-up check; the no-WebSpeech branch directly calls `ensureLoaded`; download-start is informational and not a gate.
- Same bug / related / stronger root cause: confirmed and expanded into lifecycle/cancellation/storage requirements.
- Recommended status: remain P1, owner decision required; not repair-ready.

### Confirm AUDIT-P2-MATRIX-DRIFT
- Target finding: multiple hardcoded registries drift
- My evidence: Gill series has five-item hardcoding in `series.json`, `gillSeriesData.ts`, consistency audit, reading totals, route maps and marks.
- Same bug / related / stronger root cause: Gill-specific instance with a concrete upcoming migration blocker.
- Recommended status: keep generic row; add `GILL-V10-SERIES-MANIFEST` as scoped P0 structural blocker for Part IV publication.

### Confirm GATE-MARKER-DATA-DRIFT
- Target finding: hardcoded values in gates conflict with living content
- My evidence: the historical submenu audit intentionally freezes six Part II items while the code comments admit 29 current sections.
- Same bug / related / stronger root cause: direct Gill example where the gate makes correct content evolution fail.
- Recommended status: keep generic P3 row and add the scoped P0 Gill finding.

---

## 3. Challenges / Disputes

### Challenge “green Gill submenu audit means the TOC is complete”
- Reason for challenge: the audit compares rendered rows to an immutable historical manifest and never compares all eligible current H2/H3 headings to TOC anchors.
- Current HEAD evidence: reconciliation and audit source at `ac26d8e`.
- Recommended status: false as a completeness claim; the gate remains valid only as a visual/regression witness after item-count/content semantics are removed.

### Challenge “Part IV is a simple sixth article addition”
- Reason for challenge: production Parts II–III already contain the bulk of the doctrinal scope.
- Current HEAD evidence: article-body headings and Research dossier 04.
- Recommended status: supersede the additive plan with relocation-first ownership work.

### Challenge “seven versus nine texts is an unresolved content choice”
- Reason for challenge: the two new texts are positive soteriological anchors, not additional disputed universal-redemption texts.
- Recommended status: resolve as seven disputed + two positive anchors.

---

## 4. Duplicate / Merge Proposals

### Merge proposal — Gill outline root cause
- Finding A: `GILL-P0-018` Part II TOC incompleteness
- Finding B: `GILL-P0-040` historical item-count blocker
- Finding C: `GILL-P0-041` 6 vs 29
- Finding D: `GILL-P0-042` stored level mismatch
- Finding E: `GILL-P0-045` Part III incomplete TOC
- Why same root cause: TOC is maintained as a historical manual sample instead of a projection of the current article outline.
- Canonical ID suggestion: `GILL-V10-HISTORICAL-TOC-CONTRACT`.

### Merge proposal — content truth
- Finding A: `GILL-P0-015`
- Finding B: `GILL-P0-016`
- Finding C: `GILL-P1-105`–`107`
- Why same root cause: production and audit/research consumers read different content representations.
- Canonical ID suggestion: `GILL-V10-SOURCE-TRUTH`.

### Merge proposal — Part IV ownership
- Finding A: broad Part IV proposal
- Finding B: Part II doctrinal overlap
- Finding C: Part III doctrinal adjudication
- Why same root cause: no page-level topic ownership contract.
- Canonical ID suggestion: `GILL-V10-PART4-OWNERSHIP`.

---

## 5. Severity Proposals

- `GILL-V10-HISTORICAL-TOC-CONTRACT`: P0 for the Part IV migration because the current gate will reject a complete outline or preserve an incomplete one.
- `GILL-V10-ROMAN-NUMBER-COLLISION`: P0 before publishing Part IV; it creates an unavoidable semantic collision.
- `GILL-V10-PART3-NARRATIVE`: P0 editorial integrity blocker for a “finished” series, not a runtime outage.
- `GILL-V10-READER-PROJECTIONS`: P1 pending browser/a11y witness; source contradiction is confirmed.
- `GILL-V10-CLAIM-PROVENANCE`: P1 content-trust issue; block the claim from publication until corrected.

---

## 6. Repair Lane Suggestions

### Lane A — canonical manifest and content truth
- Bug IDs: `GILL-V10-SOURCE-TRUTH`, `GILL-V10-SERIES-MANIFEST`
- Why together: every later projection depends on a single canonical graph.
- What must NOT be mixed: visual changes, prose expansion.

### Lane B — outline and Reader AST
- Bug IDs: `GILL-V10-HISTORICAL-TOC-CONTRACT`, `GILL-V10-ROMAN-NUMBER-COLLISION`, `GILL-V10-READER-PROJECTIONS`
- Why together: headings, TOC, TTS, search, print and structured data need one semantic model.
- What must NOT be mixed: Vosk model architecture.

### Lane C — editorial ownership and relocation
- Bug IDs: `GILL-V10-PART3-NARRATIVE`, `GILL-V10-PART4-OWNERSHIP`, `GILL-V10-INTRO-OWNERSHIP`
- Why together: Part IV can only be authored after existing doctrine/biography has one owner.
- What must NOT be mixed: site-wide metadata refactor.

### Lane D — Research governance
- Bug IDs: `GILL-V10-RESEARCH-CANON`, `GILL-V10-SEVEN-PLUS-TWO`, `GILL-V10-CLAIM-PROVENANCE`
- Why together: authoring must consume an explicit canonical brief and claim register.
- What must NOT be mixed: production code.

### Lane E — publication transaction
- Inputs: completed A–D
- Required outputs from one manifest: series UI, neighboring links, PageHead, `CreativeWorkSeries` JSON-LD, sitemap, RSS, `llms.txt`, biography/article catalogs, search, TTS, tests and reading-time totals.
- What must NOT be mixed: unrelated site routes.

---

## 7. Reverify Notes

- Source `main` rechecked at start and end: `ac26d8efa2b952df6dc46eef05908e6d65287e82`.
- Research rechecked: `58e1ea5fab638812ae693a1d0b1e79c4dcb47131`.
- No browser or production-like build was run; visual and runtime claims are explicitly not promoted beyond source evidence.
- The current matrix’s older `14a49be8`/`75f807b` headers are stale and are replaced on this AuditRepo branch.
- Existing raw intake evidence is retained. No third-party incoming report is rewritten or deleted.

---

## 8. Notes for Verifier

### Proposed canonical Part IV title
`Часть IV. Богословие — Спорные тексты и логика спасения в системе Джона Гилла`

### Proposed Part IV structure
1. Why Gill remains difficult to classify
2. How to distinguish `Exposition`, `The Cause of God and Truth`, and `Body of Divinity`
3. System spine in one map
4. Seven disputed texts
5. Two positive soteriological anchors
6. Covenant and eternal justification
7. Proclamation, offer and duty-faith
8. Criterion matrix: was Gill a hyper-Calvinist?
9. What should be received and challenged
10. Sources and methodology

### Proposed historical Introduction target
- 24–28 minutes
- 5,000–5,600 clean prose words
- add confessional genealogy, dissenting print economy, funds/networks, London religious marketplace, toleration-versus-equality and provincial dissent
- move personal Kettering/bookshop biography to Part I
- leave full hyper-Calvinism/eternal-justification evaluation to Part IV

### Proposed validation gates
- `gill:outline:audit`
- `gill:reader-projection:audit`
- `gill:content-ownership:audit`
- manifest-driven `gill:series:data:consistency:audit`

### Publication rule
Do not publish Part IV as an additive page. First repair the graph and relocate existing material; then publish the six-document series atomically.