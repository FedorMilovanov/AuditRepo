# MEDICATION V83 — HOLD CLOSURE / 48-PASS DEEPENING — GOVERNED INTAKE

**Дата:** 2026-07-29  
**Проект:** серия «Тайны человеческого сердца»  
**Тип:** content/research governance; не медицинское руководство и не canonical bug closure  
**Статус:** `RESEARCH READY / SITE HOLD`  
**Research authority:** `FedorMilovanov/Research`, `СЕРИЯ СЕРДЦЕ/62_V83_MEDICATION_HOLD_CLOSURE_48_NEW_PASSES.md`, branch head `34be5fc14ec1374822ecfe9b97185cc98f390eed`

---

## 1. Scope and authority

V83 добавляет:

- окончательный disposition четырёх PDF-HOLD;
- единый статус для остальных недоступных книг, аудио, курсов и старых медицинских материалов;
- 48 новых проходов по официальным консервативным христианским страницам;
- 12 дополнительных проходов по официальным medical-safety руководствам;
- новые границы по побочным действиям, withdrawal/relapse, class-specific claims, severe states и церковной care-team помощи;
- точную карту будущей интеграции, не расширяющую статью об Иеремии 17 до медицинского трактата.

**Проход** не означает «прочитана целая книга». Статусы различают полный HTML/transcript, официальный abstract/index/product page, аудио-backlog и PDF с/без визуальной page-check.

---

## 2. HOLD disposition

| ID | Source | Verified state | Final disposition |
|---|---|---|---|
| VH-01 | Wayne Mack, *The Sufficiency of Scripture in Counseling*, TMSJ 9/1 | Official PDF parsed, printed pp. 63–67 mapped; screenshots cache-miss | `CLOSED-PARAPHRASE / QUOTE-HOLD` |
| VH-02 | John MacArthur, *The Psychology Epidemic and Its Cure*, TMSJ 2/1 | Official PDF parsed; medical exception/organic cause/medication stabilization located; screenshot cache-miss | `HISTORICAL-CAUTION / CLOSED-PARAPHRASE` |
| VH-03 | Wayne Mack, *Involvement and Biblical Counseling*, TMSJ 5/1 | Official PDF parsed + page-image verified at printed p. 30 | `CLOSED-IMAGE` |
| VH-04 | Charles Hodges, *Psychiatric Medication and Spiritual Depression* | Official IBCD page + outline PDF parsed; screenshot cache-miss | `CLOSED-PARAPHRASE / MEDICAL-CAUTION` |

**Governance rule:** tooling failure is not silently converted into quote approval. A locator-verified paraphrase and a visually verified direct quotation remain different evidence classes.

---

## 3. New governed findings

| ID | Finding | Evidence | Disposition |
|---|---|---|---|
| PM-013 | Wayne Mack’s sufficiency claim is explicitly scoped to non-physical/spiritual personal and interpersonal problems. | `TMSJ official PDF, locator-verified` | `INTEGRATE AS CATEGORY GUARDRAIL` |
| PM-014 | The most polemical TMS source still acknowledges medical care, possible organic causes and rare medication stabilization. | `TMSJ official PDF` | `ANTI-CARICATURE; HISTORICAL ONLY` |
| PM-015 | Biblical correction must be delivered with compassion, respect, listening and practical concern for physical needs. | `TMSJ official PDF + page image` | `INTEGRATE TONE RULE` |
| PM-016 | A side effect can resemble a heart/behavior problem; akathisia may overlap with agitation or anxiety. | `NICE CG178` | `MEDICAL-SAFETY FOOTNOTE` |
| PM-017 | Withdrawal can be difficult to distinguish from relapse or a new disorder. | `NICE NG215` | `MANDATORY DIFFERENTIAL GUARDRAIL` |
| PM-018 | Medication use should be a recorded, observed trial with expected benefit, tolerable harms and review—not an unexamined permanent abstraction. | `NICE CG178 + Christian wisdom synthesis` | `SEPARATE-CHAPTER INTEGRATE` |
| PM-019 | Drug classes cannot be collapsed: antidepressants, antipsychotics, lithium, valproate, benzodiazepines and related drugs have materially different monitoring and withdrawal risks. | `NICE/FDA/MHRA` | `NO GENERIC CLASS CLAIMS` |
| PM-020 | Severity changes the response pathway, not the person’s spiritual identity: psychosis, mania and suicide danger trigger urgent professional care plus continued pastoral care. | `NICE + ACBC/BCC/CCEF crisis sources` | `MANDATORY CRISIS GATE` |
| PM-021 | Neither taking nor refusing medication can function as a reliable test of faith. | `Emlet/Newheiser/ACBC multi-C1` | `INTEGRATE` |
| PM-022 | Symptom relief is a genuine good but does not equal regeneration, forgiveness or sanctification. | `Emlet/Hodges/ACBC` | `INTEGRATE` |
| PM-023 | Church care must continue after medical referral or prescription; referral is not pastoral abandonment. | `CCEF/BCC/TMS` | `INTEGRATE CARE-TEAM MODEL` |
| PM-024 | An inaccessible or paid source is not evidence merely because its title supports the project. | `source audit` | `MANDATORY SOURCE INTEGRITY` |

---

## 4. Boundaries that must survive editing

### Theological boundary

- Scripture finally defines heart, sin, guilt, worship, repentance, faith, hope and sanctification.
- Medicine does not become a rival anthropology or gospel.
- The doctrine of sufficiency is not rewritten as drug-specific technical expertise.

### Medical boundary

- The article does not diagnose, prescribe, deprescribe, taper or compare individual treatments.
- No abrupt-stopping advice.
- Class-specific claims require a current official source.
- Side effects, interactions, monitoring and withdrawal return to qualified clinicians.

### Pastoral boundary

- Persistent symptoms do not automatically prove hidden sin or weak faith.
- Symptom relief does not terminate heart care.
- Bodily care is not spiritual compromise.
- Compassion, listening and respect are required even when correction is needed.

### Crisis boundary

- Suicide intent/plan, psychosis, mania, violence risk, severe intoxication/withdrawal and inability to care for self are routed to urgent help.
- Referral does not end prayer, presence, family support or church care.
- Abuse is never reduced to a medication or communication problem.

---

## 5. Evidence-class policy

| Evidence class | Publication permission |
|---|---|
| Full official HTML/transcript | Exact paraphrase; short quotation within copyright limit |
| Official PDF + page image | Exact paraphrase; short quotation with page locator |
| Official PDF parsed only | Exact locator-based paraphrase; direct quotation remains HOLD |
| Official abstract/product/index | Metadata and stated scope only |
| Audio/video without transcript | Backlog only; no content claim |
| Older Christian medical claim | Historical description; current medical check required |
| NICE/FDA/MHRA/RCPsych | Technical safety fact only; no theological authority |

---

## 6. Site integration disposition

### Jeremiah 17 article

`ALLOW-LATER`, maximum 2–3 paragraphs:

1. embodied-soul guardrail;
2. medication may help body but cannot renew heart;
3. taking/refusing is not a faith test;
4. no self-directed prescription change;
5. persistent symptoms do not prove a specific hidden sin.

### Separate future chapter

`RECOMMENDED`:

**«Сердце, мозг и лекарство: власть Писания, реальность тела и границы помощи»**

Full material on classes, monitoring, withdrawal, crisis care, roles and church care belongs there—not in the Jeremiah exegesis.

### Production

`HOLD` until:

- Research PR reviewed;
- exact Russian wording approved;
- every medical sentence carries current evidence;
- crisis/safeguarding language reviewed;
- no PDF quote remains dependent on parsed text alone.

---

## 7. Drift detectors

Reject a future diff if it says or implies:

- Scripture is insufficient for the soul because medicine observes the body;
- Scripture is a pharmacology manual because it is sufficient for faith and holiness;
- all psychiatric diagnoses are diseases in the same sense;
- all psychiatric diagnoses are inventions;
- all psychotropic drugs are addictive in the same way;
- withdrawal necessarily proves relapse;
- worsening symptoms necessarily prove spiritual rebellion;
- medication success removes spiritual need;
- medication use proves unbelief;
- medication refusal proves mature faith;
- a pastor can direct prescription changes;
- urgent crisis care can wait for ordinary counseling;
- a book title, paid page or audio listing counts as read evidence.

---

## 8. Final governed formula

> The project must neither surrender the heart to psychiatry nor remove the body from medicine. Scripture remains the infallible authority for the whole person before God. Medical knowledge remains limited, revisable and genuinely useful within its competence. The church continues spiritual and practical care whether medication is used or not. Prescription decisions remain with the patient and qualified clinician; gospel hope, repentance, worship and sanctification remain the church’s non-delegable ministry.
