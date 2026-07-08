# Agent Audit Report — John Gill series content / research reconciliation

## Meta
- Project: `gb-is-my-strength`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Research backend: `FedorMilovanov/Research`
- Agent: `GPT-5.5 Thinking / Gill content-research auditor`
- Date: `2026-07-09`
- Audited branch: `main`
- Audited SHA: `08d9fd1ed097f36a8ad0e3b0ff20eb48e3c080cf`
- Functional source SHA: `f5e000e87f7fe148ee6ea6b3f9623dfe1d207a35`
- Research SHA: `58e1ea5fab638812ae693a1d0b1e79c4dcb47131`
- AuditRepo base SHA: `18713174a343740cc0886df6c6441c51bde61274`
- Current HEAD at start/end: refs above; no source-repo writes
- Environment: GitHub connector, official/public web sources, official PDF parsed text, local synthesis
- Build mode: `source-only content/research audit`
- Browser/device: out of scope

---

## Executive summary

The complete artifact contains **480 unique findings** (`GILL-CONTENT-001…480`) with no missing or duplicate canonical IDs.

Aggregate triage inside the master:

- **75** findings contain `P0` / `P0–P1` risk language.
- **101** findings explicitly remain `NEEDS…`, `UNVERIFIED`, `UNSUPPORTED` or `UNRESOLVED`.
- The set is intentionally mixed-status: production defects, Research-only defects, verified facts, source upgrades, disputed interpretations and HOLD items.
- Therefore this intake is **not** a proposal to add 480 canonical open bugs verbatim.

Primary deliverable:

`artifacts/GILL_SERIES_FINAL_MASTER_AUDIT_ALL_FINDINGS_2026-07-09.md`

---

## 1. New Findings

### GILL-AUDIT-001 — No canonical claim/source layer across Gill site + Research
- Title: Conflicting facts survive after later verification because claims have no canonical owner or supersession mechanism.
- Severity: P0
- Route(s): all five Gill routes; Research `Джон Гилл/00–42`.
- Source file(s): Gill Astro components, quizzes, glossary/source blocks; Research navigation/master map and dossiers.
- Observed on SHA: source `08d9fd1`; Research `58e1ea5`.
- Actual: conversion dates, daughter age, book counts, offer/duty-faith, church/state, Spurgeon dates and other claims coexist in incompatible forms.
- Evidence: master findings `315–374`, especially `316–322`, `333–345`, `352–373`.
- Confidence: high.
- Verification level: L2 direct source/repository evidence for the architectural contradiction; individual claims retain separate statuses.
- Suggested repair lane: `gill-canonical-claims-and-source-registry`.
- Do not mix with: prose rewrite before registries exist.

### GILL-AUDIT-002 — Current production contains material factual chronology and locator defects
- Title: Confirmed factual/source defects propagate through body copy and quizzes.
- Severity: P0
- Route(s): Context, Part I, Part II, Part III, Spravochnik.
- Source file(s): current Gill Astro components and quizzes.
- Observed on SHA: `08d9fd1`.
- Examples:
  - baptism / Isaiah 53 / first sermon chronology;
  - Act of Uniformity 1662 conflated with Five Mile Act 1665;
  - Practical Divinity four core books vs five-unit navigation;
  - impossible eschatology locator in Practical Divinity Book V;
  - Gill→Spurgeon succession compressed to two pastor changes;
  - Spurgeon 1859 foundation event conflated with sermon 369 on 25 March 1861;
  - `WALL` surname/pun mistranslated as a literal wall.
- Evidence: master IDs `036–039`, `087–089`, `136–138`, `175–176`, `185`, `188`, `215`, `259–261`, `336`, `364`, `367`.
- Confidence: high.
- Verification level: L2/L3-candidate; direct current-source and primary/academic evidence, but verifier must recheck target lines on current HEAD before canonical promotion.
- Suggested repair lane: split by route, not one mega-PR.

### GILL-AUDIT-003 — Research contains internally superseded facts still exposed as current
- Title: Research corrections are appended but obsolete summaries and cross-file claims remain active.
- Severity: P0
- Route(s): Research backend, then all Gill routes that consume it.
- Source file(s): Research `07`, `09`, `17`, `29`, `31`, `39–42` and others.
- Observed on Research SHA: `58e1ea5`.
- Examples:
  - John 6:37 conversion chronology retained after Rippon correction;
  - ten thousand printed sheets converted back into “Rippon says ten million words”;
  - four vs five Practical Divinity books;
  - complete church/state separation vs establishmentarian magistracy;
  - competing offer/duty-faith verdicts.
- Evidence: master IDs `320`, `324–332`, `333–345`, `352–354`, `370–374`.
- Confidence: high.
- Verification level: L2 direct repository evidence.
- Suggested repair lane: Research canonical/supersession registry; do not repair site from an unresolved Research summary.

### GILL-AUDIT-004 — CCEL URL hierarchy was mistaken for Gill’s printed book numbering
- Title: Systematic bibliography locator corruption in Research.
- Severity: P0
- Route(s): Research; potential downstream Part II/Spravochnik citations.
- Source file(s): Research `05`, `39`, `40`, `42`.
- Observed on Research SHA: `58e1ea5`.
- Actual: route segments such as `doctrinal.iv.*`, `vi.*`, `vii.*` were read as Book IV/VI/VII, contradicting the printed/internal seven-book TOC.
- Evidence: master IDs `375–382`.
- Confidence: high.
- Verification level: L2 direct cross-file evidence.
- Suggested repair lane: edition registry + locator normalization.

### GILL-AUDIT-005 — Exact quotation, translation and locator metadata are missing or unstable
- Title: Direct-quote styling often hides paraphrase, tertiary transmission or conflicting translations.
- Severity: P1
- Route(s): Parts I–III, quizzes, Personal Credo, Spurgeon/Hervey/Ella blocks.
- Source file(s): manuscript quote components and source lists.
- Evidence: master IDs `073–078`, `109–115`, `168–179`, `241`, `251–252`, `272–277`, `301`, `433`, `475`, `478`.
- Confidence: high for metadata absence; quote authenticity varies by item.
- Verification level: L2 for source-apparatus defect; HOLD for exact wording of individual quotations.
- Suggested repair lane: quote registry before prose polish.

### GILL-AUDIT-006 — Quizzes and glossary freeze contested or unsupported claims as facts
- Title: Assessment layer has higher epistemic certainty than article evidence.
- Severity: P1
- Route(s): Parts I–III quizzes; glossary/tooltips.
- Evidence: master IDs `079–083`, `109–119`, `292–303`, `314`, plus sourceRef graph defects.
- Confidence: high.
- Verification level: L2 direct current-source evidence.
- Suggested repair lane: body → claim registry → quiz/glossary synchronization.

### GILL-AUDIT-007 — Hyper-Calvinism framing is not represented as an actual scholarly dispute
- Title: Macritchie, Rathel, Nettles, Haykin, George and Ella are flattened or inverted.
- Severity: P1
- Route(s): Part III and Spravochnik.
- Evidence:
  - Macritchie explicitly places Gill in the central early hyper-Calvinist stream and directly disputes Nettles;
  - Haykin’s respect for Gill is combined with criticism of free-offer denial;
  - primary texts verify proclamation/offer distinction but do not automatically settle duty-faith classification.
- Master IDs: `128–134`, `145–167`, `338–351`.
- Confidence: high for misrepresentation; interpretation remains disputed.
- Verification level: L2 direct academic/primary evidence; canonical copy must preserve dispute.
- Suggested repair lane: research-table redesign and six-term soteriological glossary.

### GILL-AUDIT-008 — Historical context contains legal, denominational and causal overcompression
- Title: Acts, toleration, university tests, General Baptists, Salters’ Hall and coffee-house networks need reconstruction.
- Severity: P0/P1
- Route(s): historical context and duplicated Part I context blocks.
- Evidence: master IDs `180–235`, `278–299`.
- Confidence: high for specific legal/date errors; medium/HOLD for coffee-house and local-history claims.
- Verification level: mixed L2 + HOLD.
- Suggested repair lane: legal chronology, denominational history, local context as separate sublanes.

### GILL-AUDIT-009 — Image provenance is absent
- Title: Documentary-looking illustrations are not classified as historical originals, modern photos, artistic reconstructions or AI-assisted visuals.
- Severity: P1
- Route(s): all Gill pages.
- Evidence: master IDs `213`, `248`, `309–312`.
- Confidence: high for markup/caption absence.
- Verification level: L2 direct current-source evidence.
- Suggested repair lane: shared image provenance registry and caption/alt disclosure.

### GILL-AUDIT-010 — Source hierarchy and edition identity are not independently modeled
- Title: Primary work, access host, transcription, printed edition, book/chapter and interpretation are conflated.
- Severity: P0/P1
- Route(s): site source apparatus and Research.
- Examples: blog-hosted public-domain text marked Level A; wrong Internet Archive object for Good Works; volume/book conflation; digital route used as print locator.
- Evidence: master IDs `318–322`, `333–337`, `370–373`, `375–382`, `397`, `441–445`, `466–469`.
- Confidence: high.
- Verification level: L2 direct repository/source evidence.
- Suggested repair lane: `GILL_SOURCE_REGISTRY.yml` + `GILL_EDITION_REGISTRY.yml`.

---

## 2. Confirmations of Existing Findings

### Confirm current Gill source-integrity concerns
- Target report: existing Gill/UI/content audits referenced by `MASTER_BUG_MATRIX.md` and Research dossiers.
- Target finding: content parity and visual parity do not prove factual/source truth.
- My evidence: current Astro text was cross-checked against Research and primary/academic materials; the result contains direct contradictions despite native/parity closure.
- Same bug / related / stronger root cause: stronger root cause is absence of canonical claims and supersession.
- Recommended status: add a governed content-research workstream; do not merge all items into existing visual Gill IDs.

---

## 3. Challenges / Disputes

### Challenge blanket “Level A / all key doctrines verified” language in Research
- Target report: Research Gill department summaries.
- Target finding: all key doctrines and locators verified.
- Reason: a genuine primary quotation may still have wrong book numbering, secondary transcription provenance or a disputed interpretation.
- Current evidence: master IDs `315–322`, `338–351`, `375–382`, `397–410`.
- Recommended status: disputed; split source authenticity, transcription, locator and interpretation statuses.

---

## 4. Duplicate / Merge Proposals

### Merge proposal — canonical source architecture
- Findings: Research fragmentation, source-tier conflict, CCEL numbering, quote metadata, site↔Research drift.
- Why same root cause: all arise from claims being copied as prose instead of referenced from a canonical registry.
- Canonical ID suggestion: `GILL-CONTENT-SOURCE-ARCHITECTURE`.

### Do not merge
- Historical/legal context errors must not be merged with theological classification disputes.
- Image provenance must remain a separate implementation lane.
- Unverified Brown/Spurgeon/epitaph claims must remain HOLD rather than being treated as false.

---

## 5. Severity Proposals

- `GILL-AUDIT-001`, `002`, `003`, `004`, `010`: proposed P0/P0–P1 umbrella status because they can propagate incorrect facts across body, quiz and Research.
- Individual subfindings must retain their own severity from the master; the umbrella must not inflate every item to P0.

---

## 6. Repair Lane Suggestions

1. `gill-registry-foundation`
   - canonical claims, sources, editions, quotations, supersession, deployment crosswalk.
2. `gill-context-history`
   - legislation, toleration, General Baptists, Salters’ Hall, academies, coffee houses.
3. `gill-part1-biography`
   - chronology, family, ordination, Personal Credo, quizzes.
4. `gill-part2-sources`
   - Body structure, rabbinic table, Targums, Whiston/degree, Eastcheap, quotations.
5. `gill-part3-scholarship`
   - hyper-Calvinism table, Spurgeon, Brown, epitaph, bibliography.
6. `gill-spravochnik-glossary`
   - canonical timeline/work catalogue/glossary.
7. `gill-image-provenance`
   - visual registry, captions and alt.

Do not mix all seven lanes into one implementation PR.

---

## 7. Reverify Notes

- Current bot HEAD: `08d9fd1`.
- Functional source HEAD: `f5e000e`.
- Research HEAD: `58e1ea5`.
- Result: direct-source/current-source findings are candidates for `confirmed-current`; unresolved locators remain HOLD.
- Required before repair-ready:
  - verifier selects canonical IDs;
  - rechecks current source lines after any new content commits;
  - attaches exact route/file scope;
  - separates direct facts from scholarly interpretation;
  - confirms no superseding Research commit.

---

## 8. Notes for Verifier

1. Do not ingest 480 findings as 480 open matrix rows.
2. Use the final master as evidence corpus and index.
3. Create umbrella canonical IDs, then attach individual `GILL-CONTENT-*` references.
4. Preserve HOLD for claims not disproved but lacking exact source.
5. The first implementation deliverable should be registries/crosswalk, not broad prose rewriting.
6. A matrix pointer may be added without changing current open/closed counters until verifier synthesis is accepted.
