# DEPRESSION V84D — SOURCE LOCATOR CLOSURE

**Date:** 2026-07-29  
**Status:** SOURCE-INTEGRITY CORRECTION IMPLEMENTED / SITE RECHECK REQUIRED / PRODUCTION NOT CLAIMED  
**Research authority:** `СЕРИЯ СЕРДЦЕ/67_V84D_SOURCE_LOCATOR_AND_EVIDENCE_STATUS_CLOSURE.md`  
**Site PR:** `FedorMilovanov/gb-is-my-strength#498`

---

## 1. Correction scope

This intake corrects evidence classification and citation locators only. It does not reopen the theological architecture of V84B or the editorial-completeness decisions of V84C.

The manual final readback found:

- Wesley Center had been overstated as a full primary HTML text of Thomas Goodwin;
- Timothy Rogers quotations lacked published internal locators;
- the burn-out sentence could preserve the WHO classification boundary more exactly;
- the summary used an imprecise risk verb.

---

## 2. Governed findings

### DP-037 — Wesley Goodwin page is an extract

Correct status:

`P1-HISTORICAL-EXTRACT-HTML`

The page title identifies it as `Extracts from the Works`. It may support only the passages actually present there. It must not be called:

- a full HTML treatise;
- the original 1659 edition;
- a page-image verified source.

### DP-038 — Goodwin full-text link and extract must be separated

Digital Puritan Press lists a separate 120-page PDF of *A Child of Light Walking in Darkness* inside *The Works of Thomas Goodwin*, vol. 3.

Current status:

`P1-FULL-TREATISE-LINK / PDF-PAGE-IMAGE-HOLD`

The link establishes the full-text resource and collected-works location. It does not establish that the PDF was page-read or that a quotation was verified from page images in this pass.

### DP-039 — Goodwin original-edition metadata is a third evidence class

The Folger record for the 1659 edition is:

`P2-ORIGINAL-EDITION-METADATA`

Metadata supports title, author, date and edition identity. It does not substitute for textual inspection.

### DP-040 — Rogers quotation 1 receives an internal locator

Locator:

`The Preface: Containing Several Advices to the Relations and Friends of Melancholly People`, `Advice 1 — First`.

The passage begins `Melancholly seizes on the Brain and Spirits...` and contains the comparison with fever, phthisis, gout and stone.

### DP-041 — Rogers quotation 2 receives an internal locator

Locator:

`The Preface: Containing Several Advices to the Relations and Friends of Melancholly People`, `Advice 5 — Fifthly`.

The passage begins `Do not urge your Friends under the Disease of Melancholly, to things which they cannot do` and compares them with persons whose bones are broken.

### DP-042 — Rogers claim wording is lowered from generic verification to reproducible locator

The site must say what was verified and where, rather than use the broad label `verified by the primary source`.

Allowed:

- identify the 1691 EEBO-TCP edition record;
- publish the two translated passages with `Preface, Advice 1 / Advice 5`;
- label the Russian passages as translations of historical text.

Not allowed without page-image verification:

- first-edition page number;
- facsimile-verbatim claim;
- modern medical endorsement of the humoral explanation.

### DP-043 — WHO burn-out wording is tightened

Required formula:

> Burn-out in ICD-11 is described as an occupational phenomenon resulting from chronic workplace stress, not as a medical condition or a name for every form of exhaustion.

The reader-facing Russian sentence now preserves occupational scope, non-disease classification and non-universality.

### DP-044 — risk is assessed, not established by the label

The summary now says risk is evaluated within a broader professional assessment. A classification label does not by itself establish danger.

---

## 3. Site implementation

Previous exact-green head:

`8202c7d8cef261ccf1d72b10a57d669a624c53b4`

New head:

`c9554c86edddaa21c6dd3c9b293b486abeecd881`

Changed file only:

`src/components/article-pilots/tma-na-serdce/TmaNaSerdceBody.astro`

No changes to:

- PageHead;
- CSS or JS;
- routes;
- shared reader runtime;
- images;
- other articles;
- reading time or TOC.

Previous green workflow evidence is not transferable to the moved head. Exact-head CI must run again.

---

## 4. Gates

### Gate J — evidence labels

PASS only if extract, full-text link, original-edition metadata and page-image verification remain distinct.

### Gate K — quote locator

PASS only if each Rogers quotation names `Preface, Advice 1` or `Preface, Advice 5`.

### Gate L — no humoral import

PASS only if Rogers and Baxter are used for pastoral distinctions, not as current biological authority.

### Gate M — burn-out scope

PASS only if burn-out remains occupational, is not called a medical condition and is not broadened to all exhaustion.

### Gate N — exact-head evidence

PASS only after the new site SHA completes its own workflow set. Old-head success cannot be reused.

---

## 5. Disposition

- Research V84D written.
- Audit V84D written here.
- Site source correction committed on the existing bounded lane.
- Production not claimed.
- PRs remain draft pending exact-head verification and owner decision.
