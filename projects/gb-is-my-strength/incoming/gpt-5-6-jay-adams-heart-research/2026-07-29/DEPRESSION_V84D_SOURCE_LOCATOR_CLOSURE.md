# DEPRESSION V84D — SOURCE LOCATOR CLOSURE

**Date:** 2026-07-29  
**Status:** SOURCE-INTEGRITY CORRECTION IMPLEMENTED / SITE RECHECK REQUIRED / PRODUCTION NOT CLAIMED  
**Research authority:** `СЕРИЯ СЕРДЦЕ/67_V84D_SOURCE_LOCATOR_AND_EVIDENCE_STATUS_CLOSURE.md`  
**Site PR:** `FedorMilovanov/gb-is-my-strength#498`

---

## 1. Correction scope

This intake corrects evidence classification, citation locators, historical translation precision and one overstated paraphrase. It does not reopen the theological architecture of V84B or the editorial-completeness decisions of V84C.

The manual final readback found:

- Wesley Center had been overstated as a full primary HTML text of Thomas Goodwin;
- three Timothy Rogers fragments lacked the full published locator set;
- `Spirits` and `phthisis` required historically accurate Russian rendering;
- the William Gurnall paragraph made emotional horror an infallible proof of non-consent, beyond what the primary text establishes;
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

### DP-040 — Rogers quotation 1 receives an internal locator and translation boundary

Locator:

`The Preface: Containing Several Advices to the Relations and Friends of Melancholly People`, `Advice 1 — First`.

The passage begins `Melancholly seizes on the Brain and Spirits...` and contains the comparison with fever, phthisis, gout and stone.

Governed Russian rendering:

> Меланхолия овладевает мозгом и жизненными духами и лишает их способности к мысли или действию… Когда этот тяжкий недуг глубоко укоренился, бороться с ним так же тщетно, как бороться с горячкой или чахоткой, подагрой или каменной болезнью.

Required notes:

- `Spirits` means the early-modern physiological category rendered «жизненные духи», not the human soul or the Holy Spirit;
- `phthisis` means consumption/phthisis and is rendered «чахотка», not «плеврит»;
- the historical physiology is not imported as current medical science.

### DP-041 — Rogers quotation 2 receives an internal locator

Locator:

`The Preface: Containing Several Advices to the Relations and Friends of Melancholly People`, `Advice 5 — Fifthly`.

The passage begins `Do not urge your Friends under the Disease of Melancholly, to things which they cannot do` and compares them with persons whose bones are broken.

### DP-042 — Rogers warning about disease and the devil receives Advice 6 locator

Site fragment:

> Не приписывайте дьяволу то, что есть всего лишь действие болезни.

Locator:

`The Preface: Containing Several Advices to the Relations and Friends of Melancholly People`, `Advice 6 — Sixthly`.

Governed meaning:

- not every feeling or word of a melancholy sufferer should be attributed to Satan;
- many manifestations may follow naturally from bodily disease;
- this does not deny that Satan may exploit an already weakened mind for temptation.

The short Russian sentence must not be used to deny every spiritual struggle in illness.

### DP-043 — Rogers claim wording is lowered from generic verification to reproducible locators

The site must say what was verified and where, rather than use the broad label `verified by the primary source`.

Allowed:

- identify the 1691 EEBO-TCP edition record;
- publish the translated fragments with `Preface, Advice 1 / Advice 5 / Advice 6`;
- label the Russian passages as translations of historical text.

Not allowed without page-image verification:

- first-edition page number;
- facsimile-verbatim claim;
- modern medical endorsement of the humoral explanation.

### DP-044 — WHO burn-out wording is tightened

Required formula:

> Burn-out in ICD-11 is described as an occupational phenomenon resulting from chronic workplace stress that has not been successfully managed, not as a medical condition or a name for every form of exhaustion.

The reader-facing Russian sentence now preserves occupational scope, unmanaged-stress wording, non-disease classification and non-universality.

### DP-045 — risk is assessed, not established by the label

The summary now says risk is evaluated within a broader professional assessment. A classification label does not by itself establish danger.

### DP-046 — Gurnall supports a will/motion distinction, not an emotion-only test

Primary locator:

- *The Christian in Complete Armour*;
- `Direction VIII`;
- `Faith's Second Quenching Power`;
- sections on affrighting temptations and temptation to blasphemy.

Supported:

- enticing/alluring temptations are distinguished from affrighting temptations;
- blasphemous motions may be injected to annoy and frighten rather than persuade;
- Gurnall says the Christian's sin often lies more in the sad conclusion drawn from the motions — for example, `I am not a child of God` — than in the motions themselves;
- a thought appearing in imagination is not identical with the will's consent.

Not supported as an infallible rule:

- emotional horror by itself proves hatred of the thought and absence of consent.

Required site formula:

> The presence of an injected thought is not the same as consent of the will. But fear alone is not an infallible test; ask whether the will receives and feeds the thought or rejects it, grieves over it and carries it to Christ.

The practical self-question must use the same boundary and must not contradict the explanatory paragraph.

---

## 3. Site implementation

Previous exact-green head:

`8202c7d8cef261ccf1d72b10a57d669a624c53b4`

Intermediate source-integrity heads:

- `c9554c86edddaa21c6dd3c9b293b486abeecd881` — source locators;
- `f1698f626e5ed6be2fcdadaf46045733b3ca8f51` — Rogers historical translation;
- `1cee7f222a0c0f8829c18f23f83e06c3a8de1eaf` — Gurnall paragraph;
- `f3faa07cf473e581fa75db74ab4218a34a96fc89` — synchronized practical question.

Final content head:

`425396b5be73d78a4c06e82d5c9b42f6ea84a65d`

Changed file only in the V84D correction:

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

PASS only if Rogers fragments name `Preface, Advice 1`, `Advice 5` and `Advice 6`.

### Gate L — historical translation and no humoral import

PASS only if:

- `Spirits` is not confused with soul or Holy Spirit;
- `phthisis` is not mistranslated as pleurisy;
- Rogers and Baxter are used for pastoral distinctions, not as current biological authority.

### Gate M — Rogers Advice 6 boundary

PASS only if the disease/devil distinction:

- prevents automatic demonization of bodily symptoms;
- does not deny every spiritual struggle or satanic temptation in illness.

### Gate N — burn-out scope

PASS only if burn-out remains occupational, arises from chronic workplace stress not successfully managed, is not called a medical condition and is not broadened to all exhaustion.

### Gate O — Gurnall paraphrase

PASS only if:

- injected motion and willing consent are distinguished;
- emotional fear is not treated as an infallible verdict;
- the explanatory paragraph and practical self-question use the same boundary.

### Gate P — exact-head evidence

PASS only after the final site SHA completes its own workflow set. Old-head success cannot be reused.

---

## 5. Disposition

- Research V84D synchronized with Goodwin, Rogers, Gurnall and WHO corrections.
- Audit V84D updated here.
- Site source, translation and paraphrase corrections committed on the existing bounded lane.
- Production not claimed.
- PRs remain draft pending exact-head verification and owner decision.
