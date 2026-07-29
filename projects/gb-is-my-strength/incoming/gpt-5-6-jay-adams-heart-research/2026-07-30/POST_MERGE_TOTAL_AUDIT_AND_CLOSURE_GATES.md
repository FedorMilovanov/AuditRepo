# POST-MERGE TOTAL AUDIT AND CLOSURE GATES

## Meta

- Project: `gb-is-my-strength`
- Date: `2026-07-30`
- Status: `CURRENT GOVERNED AUTHORITY / ORIGINAL MERGES CONFIRMED / SITE CLEANUP OPEN / LIVE RELEASE WITNESS PENDING`
- Research authority: `СЕРИЯ СЕРДЦЕ/72_V84I_POST_MERGE_TOTAL_AUDIT_AND_CLOSURE_GATES.md`
- Supersedes for current workflow state: `DIRECT_SOURCE_CLEANUP_TRINITARIAN_AND_FINAL_EXACT_HEAD.md`
- Preserves: all substantive source-governance, Trinitarian, medical-safety and evidence-class findings in the 2026-07-29 intake.

---

## 1. Governance correction

The prior final intake was a correct pre-merge audit, but it now contains stale current-state statements such as `KEEP ALL THREE PRS DRAFT` and `NO MERGE`. Those statements are retained as historical evidence of the state on 2026-07-29; they no longer govern the repository after owner-authorized merges.

This file is the current post-merge authority.

---

## 2. Confirmed merged state

### Research

- PR: `FedorMilovanov/Research#38`
- audited head: `3418a0b227a93e7b9a8b714ecc94692874674b8f`
- merge commit: `a6aea00e719f93c7697c695386d81c858ff19201`
- disposition: merged into `main`.

### AuditRepo

- PR: `FedorMilovanov/AuditRepo#101`
- audited head: `dfdb6b2adc1e0bf2f7f3090d2890ef39e5bba20f`
- merge commit: `e98c594093b5979141d1a582c5b26507659607b1`
- disposition: merged into `main`.

### Site

- PR: `FedorMilovanov/gb-is-my-strength#498`
- audited article head: `54b90c60cba945aec71de02d8aa6279f65fbab1e`
- merge commit: `e344329096c61a9f01ab5e91b379861a5e15badf`
- disposition: merged into `main`.

Merge order: Research → AuditRepo → Site.

---

## 3. Material content verdict

`PASS FOR CURRENT PUBLICATION STAGE`

The final article source in `main` preserves:

- theological primacy without body-neglect;
- depression/grief/burn-out/guilt/false-guilt/temptation/crisis distinctions;
- anti-victim-blaming boundaries from Job and John 9;
- a real-guilt path through David that terminates in cleansing and Gospel assurance;
- urgent-safety referral without abandonment by the church;
- historical quotation and locator boundaries;
- no retrospective biblical diagnosis;
- no prescribing/deprescribing/taper instruction;
- no equation `depression = sin` or `depression = innocence`;
- one Trinitarian work of redemption, real personal distinctions, real judgment and substitution, one Person/two natures and no speculative internal-metaphysical mechanism beyond revelation.

The textual/theological base does not need another broad rewrite before closure.

---

## 4. Confirmed remaining defects

### A-POST-001 — stale pre-merge authority

The earlier final AuditRepo file still calls the PRs draft/unmerged. This new authority supersedes that status without rewriting historical evidence.

### A-POST-002 — tma TOC mismatch

The shared heart-series config does not match the current H2 structure of `TmaNaSerdceBody.astro`.

Missing entries:

- `#pered-bogom` — «Сначала — человек перед Богом»;
- `#kogda-vina-realna` — «Когда тьма связана с реальной виной: Давид».

Stale labels:

- `#ne-odin-diagnoz`;
- `#kogda-tma-bolezn`.

Required correction: source-of-truth config edit; no runtime DOM patch.

### A-POST-003 — reading-time mismatch

- article metadata: `34` minutes;
- heart-series config: `26` minutes.

Required correction: one canonical value and a validator that compares page metadata with series config.

### A-POST-004 — invalid book-progress arithmetic

Additional articles are declared full articles inside four chapters, but current progress data:

- assigns all extras in a chapter the same `doneMin`;
- uses the core-only `HEART_TOTAL_MIN`;
- excludes extra-article minutes from the series total.

Required correction: ordered cumulative progress across every actual article in book order.

### A-POST-005 — `/hard-texts/` landing drift

The landing source still contains duplicated/historical values:

- Romans 7: `12` rather than `45` minutes;
- `3 parts / 2 published / 53 minutes`;
- a three-node map;
- static structured data that does not describe the current four-chapter book and its articles.

Required correction: derive reader-facing and machine-readable values from the active series/data contracts.

### A-POST-006 — live release not yet witnessed

At audit time the public site still served the old three-part/12-minute version while `main` held the newer source.

This observation occurred minutes after the latest `main` push. A temporary one-line `tmp` probe commit was immediately removed, and the pages workflow uses `cancel-in-progress: true`; therefore the latest push restarted the deployment queue. The observation is a `LIVE-WITNESS-PENDING` state, not proof of a failed deploy.

Required evidence is the controlled `deploy.yml` run for the then-current `main` SHA plus its live-release artifact.

---

## 5. Deployment-control audit

`.github/workflows/deploy.yml` is structurally production-grade:

- trigger on every `main` push plus manual recovery by exact historical SHA;
- immutable candidate built and validated once;
- same-run artifact promoted;
- pinned checkout/setup/actions;
- Pages permissions isolated to deploy job;
- generic live-release contract after promotion;
- TTS live capability contract;
- IndexNow submission after deployment;
- `concurrency: pages` with `cancel-in-progress: true`.

No manual file upload, branch bypass or unverifiable emergency deployment is authorized.

---

## 6. Persistent evidence boundaries

Still active and intentional:

- MLJ full book: `BOOK-FULLTEXT-HOLD`;
- direct PDF quotation without page image: `PAGE-IMAGE-HOLD`;
- parsed PDF text is not visual pagination evidence;
- Adams historical psychiatric generalizations: `DO-NOT-IMPORT`;
- Adams organic/mixed/referral observations: `LIMITED IMPORT` with current verification;
- clinical documents classify/guide safety but do not define guilt, regeneration or covenant status;
- theology does not invent an internal Trinitarian mechanism beyond revelation.

These gates do not block the current article because held claims were not imported as stronger evidence than available.

---

## 7. Closure checklist

Full closure requires all of the following:

1. current Research and Audit post-merge authorities merged;
2. tma TOC repaired to exact H2 order/labels;
3. tma reading time unified at the canonical value;
4. full-book cumulative progress corrected;
5. `/hard-texts/` counters, core times, map and structured data derived from current contracts;
6. exact-head Site cleanup checks green;
7. Site cleanup merged;
8. controlled deploy completed for the final `main` SHA;
9. live release evidence read and matched to that SHA;
10. live checks confirm route, canonical, current text, repaired TOC, correct times, current series chrome, sitemap and Pagefind.

---

## 8. Disposition

`ORIGINAL RESEARCH / AUDIT / SITE PRS MERGED`

`MATERIAL TEXT BASE COMPLETE`

`PRE-MERGE WORKFLOW STATUS SUPERSEDED`

`SITE SOURCE-OF-TRUTH CLEANUP REQUIRED`

`LIVE RELEASE WITNESS REQUIRED`

`TOTAL AUDIT COMPLETE / TOTAL CLOSURE NOT YET REACHED`