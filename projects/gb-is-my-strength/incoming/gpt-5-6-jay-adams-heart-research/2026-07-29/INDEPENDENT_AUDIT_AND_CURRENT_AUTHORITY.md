# INDEPENDENT AUDIT AND CURRENT AUTHORITY

**Date:** 2026-07-29  
**Status:** `INDEPENDENT AUDIT RECORDED / SITE EXACT-HEAD REVALIDATION REQUIRED / PRODUCTION NOT CLAIMED`  
**Scope:** `FedorMilovanov/Research#38` + `FedorMilovanov/gb-is-my-strength#498` + `FedorMilovanov/AuditRepo#101`

---

## 1. Purpose

This file is the current cross-repository governance snapshot after an independent re-audit of the Research corpus, the reader-facing Site diff, and the AuditRepo intake.

It supersedes stale cross-repository SHA/status statements inside earlier intake snapshots. It does not erase their historical findings.

---

## 2. Exact authority snapshot

### Research

- PR: `FedorMilovanov/Research#38`
- current authority head: `5f84dc2d0f50b2b164cd63a007fb1c0df58222ef`
- current authority file: `СЕРИЯ СЕРДЦЕ/68_V84E_INDEPENDENT_AUDIT_AND_CURRENT_AUTHORITY.md`
- disposition: substantively strong; direct-file cleanup and final source-of-truth normalization remain required

### Site

- PR: `FedorMilovanov/gb-is-my-strength#498`
- current production base at audit: `2c736a4b9d588fbe382b53d970ae4de3a0f1fa17`
- current corrected head: `4f885b3874e11d2a19f63f2ac566e3fb17c80192`
- branch state after synchronization: `14 ahead / 0 behind main`
- mergeability: mergeable
- changed surface: exactly two canonical Astro files
- exact diff at audit: `+89 / -40`
- disposition: draft; fresh exact-head CI and artifact readback required

### AuditRepo

- PR: `FedorMilovanov/AuditRepo#101`
- prior validated head: `5a95fff76772d6da11912aebbfc9fec69177cb0b`
- `AuditRepo Validate`: success on that head
- this file becomes the current cross-repository authority after its commit

No merge, release, deployment, or production witness is claimed.

---

## 3. Independent findings

### IA-001 — Site branch state was stale and materially wrong

The Site PR description claimed `0 behind main`, but the branch had become `37 behind` and GitHub reported it non-mergeable.

The two target files on current `main` still matched the original merge-base blobs, so the divergence was historical rather than a content conflict.

A clean synchronization merge brought current `main` into the feature branch. The Site PR returned to `0 behind`, remained bounded to the same two canonical files, and became mergeable.

**Disposition:** `CORRECTED / NEW EXACT-HEAD EVIDENCE REQUIRED`.

### IA-002 — Old green CI could not be transferred to the moved base

The ten successful workflows on Site head `31c26fac34929cdbc75414c8eae9e607f556a49d` remain valid historical evidence for that exact head only.

They could not establish compatibility with the later production base.

**Disposition:** `HISTORICAL EVIDENCE ONLY`.

### IA-003 — Synchronized production-like candidate passed before the final wording correction

On synchronized Site head `998e38a9041c74f7bb8859a5f5067ce6a3103bbb`, the production-like candidate passed build, Pagefind, publication audit, and public URL comparison.

Readback recorded:

- `73` public pages;
- `0` URL-contract issues;
- target article indexable;
- one H1;
- correct canonical and OG URL;
- Article/BreadcrumbList/Organization/Person/WebSite structured data;
- target article word count `5050` before the final wording expansion.

**Disposition:** `CURRENT-BASE COMPATIBILITY CONFIRMED / SUPERSEDED BY FINAL CONTENT HEAD FOR RELEASE PURPOSES`.

### IA-004 — John 9 participant attribution was wrong

The Site article said Christ corrected the blind man's friends. John 9:2 identifies the questioners as Christ's disciples.

Corrected wording now says Christ rejected before His disciples the inference that the blindness was a direct receipt for the man's or his parents' sin.

**Correction commit:** `4f885b3874e11d2a19f63f2ac566e3fb17c80192`.

**Disposition:** `CORRECTED`.

### IA-005 — Cross/abandonment wording required Christological precision

The former closing wording could be heard as an ontological rupture inside the Trinity.

The corrected article now says:

- Christ truly bore judgment and curse for His people;
- the cry of dereliction does not mean dissolution or rupture of Trinitarian unity;
- it reveals the depth of the Son's redemptive sorrow in His human nature;
- the following sentence says Christ `понёс суд креста`, not `прошёл оставленность`.

**Correction commit:** `4f885b3874e11d2a19f63f2ac566e3fb17c80192`.

**Disposition:** `CORRECTED`.

### IA-006 — The final wording correction remained tightly bounded

The compare from synchronized head `998e38a…` to corrected head `4f885b3…` changed one file with `+4 / -4` and only the three audited formulations.

The full Site PR remains bounded to the two declared canonical Astro files.

**Disposition:** `SCOPE PASS`.

### IA-007 — Adams V81 metric needed a narrower statement

The V81 `48` is not 48 books and not 48 equal primary texts.

Correct statement:

- `20` content-bearing section passes across three official Adams PDFs;
- `26` complete author articles from the official INS archive;
- `2` official book pages used only as `P2 book-map` resources.

Recommended summary:

> `46 content-bearing Adams passes + 2 official book-map pages`.

**Disposition:** `METRIC CORRECTED BY RESEARCH V84E`.

### IA-008 — V83 and V84C counts are mixed evidence ledgers

V83's `48` includes full text, abstracts, indexes, product pages, and unlistened audio backlog.

V84C's `38` includes historical full text and metadata, official sermon/corpus pages, modern Christian resources, and official classification/safety sources.

Neither count may be described uniformly as full-text or primary-source reading.

**Disposition:** `PR METADATA CORRECTED / DIRECT-FILE LABEL CLEANUP REQUIRED`.

### IA-009 — Research needed an explicit supersession map

V84B supersedes the single-level typology in V84.

V84D supersedes Goodwin, Rogers, Gurnall, WHO wording, and related source-status claims in V84C.

Research V84E now provides the current authority map for V81–V84D.

**Disposition:** `CORRECTED BY RESEARCH V84E`.

### IA-010 — PDF parsing is not page-image verification

Official Adams PDFs were parsed and locator-checked. Screenshot attempts returned a technical `Cache miss`.

Therefore:

- precise paraphrase with explicit PDF-page locators is allowed;
- new direct PDF quotation remains on page-image HOLD;
- ambiguous locators such as `pp. 0–1` must be normalized to `PDF page N / printed page M` where possible.

**Disposition:** `QUOTE HOLD PRESERVED / LOCATOR CLEANUP REQUIRED`.

### IA-011 — Adams medical material requires a permanent red-filter

The official schizophrenia PDF contains both useful whole-person/referral distinctions and broad historical psychiatric assertions.

Required evidence split:

- organic/mixed-case/referral layer: `HISTORICAL-P1 / LIMITED IMPORT`;
- broad psychiatric, medication, prevalence, and retrospective diagnostic claims: `HISTORICAL / DO-NOT-IMPORT`.

**Disposition:** `MANDATORY PUBLICATION GATE`.

### IA-012 — Original PR state lacked independent review evidence

Before this audit, all three PRs had no review threads. Green CI and schema validation did not constitute independent theological, source, translation, or editorial review.

This independent audit adds documented review findings and corrections, but owner acceptance remains separate.

**Disposition:** `AUDIT RECORDED / OWNER DECISION REQUIRED`.

---

## 4. Current evidence hierarchy

1. **Research V84E** — current authority for metrics, supersession, primary-source recheck, cross-repo state, and remaining research gates.
2. **Research V84B** — current theological-order and five-axis authority.
3. **Research V84C** — editorial completeness, except where superseded.
4. **Research V84D** — Goodwin/Rogers/Gurnall/WHO source-integrity authority before the independent audit.
5. **This AuditRepo file** — current governed cross-repository snapshot.
6. **Site head `4f885b3…`** — current reader-facing implementation.

Earlier SHA/status statements remain historical only when they conflict with this snapshot.

---

## 5. Mandatory remaining gates

### Research gate

- correct `ПУРИ ТАНСКАЯ` directly in V84;
- normalize PDF/printed-page locator notation;
- remove or qualify `PRIMARY PASSES` language for mixed ledgers;
- retain the V84E authority map;
- update the Site exact-head reference if it moves again.

### Site gate

- complete all ten workflows on exact head `4f885b3874e11d2a19f63f2ac566e3fb17c80192`;
- inspect Deploy Candidate and Runtime Interactive artifacts, not merely status checks;
- confirm target output after the final wording expansion;
- confirm Chromium/WebKit, print, pixel-diff, route, source, dateline, glossary, and shared-file gates;
- keep the PR draft until exact-head evidence is complete.

### AuditRepo gate

- bind the final Site workflow/artifact evidence to this snapshot or a follow-up;
- update `REPORT.md` or explicitly mark its old Research/Site SHA state as superseded;
- keep canonical bug counters unchanged because this is governed content/research work, not a production defect closure.

---

## 6. Non-negotiable publication boundaries

Reject any future diff that implies:

- all depression is personal sin;
- depression is never related to personal sin;
- diagnosis proves guilt, innocence, regeneration, or apostasy;
- a depressed believer is objectively outside Christ;
- hidden motives or hidden idols may be asserted without evidence;
- biblical persons may be given retrospective clinical diagnoses;
- a pastor or article may prescribe, deprescribe, dose, or taper medication;
- old Adams psychiatric assertions are current medical guidance;
- urgent safety intervention may wait for routine counseling;
- urgent medical care replaces continuing church care;
- historical extract, metadata, parsed PDF, page image, and full text are interchangeable evidence.

---

## 7. Final disposition

`RESEARCH SUBSTANTIVELY STRONG`

`SOURCE METRICS AND AUTHORITY MAP CORRECTED`

`SITE BRANCH SYNCHRONIZED`

`READER-FACING CONTENT DEFECTS CORRECTED`

`FINAL SITE EXACT-HEAD ARTIFACT READBACK REQUIRED`

`RESEARCH AND GOVERNANCE DIRECT-FILE CLEANUP REQUIRED`

`KEEP ALL THREE PRS DRAFT`

`NO MERGE / NO PRODUCTION CLAIM`
