# CURRENT HEAD REVERIFY — 2026-07-22 — `2b67ee8f`

## Source authority

- Repository: `FedorMilovanov/gb-is-my-strength`
- Branch: `main`
- HEAD: `2b67ee8f6ee788cb0457b5171e1d99d7afeff5dd`
- Immediate delta after AuditRepo source `1bbebc2d`:
  - PR #111 restored the readiness → Pages workflow linkage and added a permanent linkage regression;
  - PR #115 corrected a stale Gill mobile smoke assertion after failed Pages run `29870616511`;
  - production UI/runtime was not changed by PR #115;
  - exact successful Pages/blob witness remains pending at the time of this reverify.

## Verified current-head findings

### 1. Nagornaya bar asset contract

- `js/nagornaya-bar-extras.js` exists.
- `copy-legacy-to-dist.js` copies the `js/` directory.
- all five native Part I–V footers reference `nagornaya-bar-extras.js?v=1`;
- canonical asset version is `3c7e0bdd`;
- `cache-bust.js::rewriteAstro()` only detects eight-hex revisions, so `v=1` bypasses pre-merge drift detection;
- checked-in Part IV shadow HTML omits the bar-extras script.

Result: **confirmed-current / repair-ready technical P0**. Runtime/dist/browser witness still required for closure.

### 2. Pastoral wording

Part V contains the exact green-verdict sentence:

> «Полное отсутствие плодов — смертный приговор вере» … «Мф 7:21 относится к нему».

Result: **confirmed-current P0 pastoral safety**. The surrounding text contains safeguards, but the verdict still exceeds a safely operationalized diagnostic claim.

### 3. Green / Thomas source metadata

Official TMS PDFs confirm:

- Green, `TMSJ 12/1`, pp. **49–68**, author line “Faculty Associate in New Testament”;
- Thomas, `TMSJ 7/1`, pp. **75–105**, `tmsj7d.pdf`;
- Nichols, `TMSJ 7/2`, pp. **213–239**, `tmsj7h.pdf`.

Current Nagornaya sources page gives Green as `49–74`. Current prose also repeatedly promotes individual TMSJ articles to an institutional TMS verdict.

Result: **confirmed-current P1 source integrity**.

### 4. Argument/model transparency

Source passages directly reproduce the uploaded audit’s root concern:

- author/audience/reconstruction claims appear in the same visual layer as textual observations;
- MacArthur’s sermon synthesis is promoted to the discourse’s original authorial intent;
- Thomas/Green/Farnell arguments are visually and verbally framed as institutional answer keys;
- Part V narrows a multi-function discourse toward a dominant soteriological scheme;
- the sources page globally claims all links were verified by primary sources despite blocked, redirected and object-mismatch classes documented in the supplied evidence.

Result: **confirmed-current P1 grouped editorial/architecture wave**.

### 5. Highlight matrix drift

`MASTER_BUG_MATRIX.md` says `RUNTIME-HIGHLIGHT-DEDUPE-01` was fixed in PR #95. Current main does not contain that behavior. The actual fix is prepared in draft PR #113 and has passed its isolated transaction, but is not merged.

Result: **canonical status correction required: reopen until PR #113 lands**.

## Repair order

1. Preserve unambiguous production witness for issue #58.
2. Prepare technical Nagornaya bar asset-contract PR without merging it into `main` before the witness.
3. Close issue #58 only with immutable Pages run + production/source blob PASS.
4. Rebuild PR #113 from current main and merge the highlight fix.
5. Handle pastoral safety and source integrity as separate owner-reviewable PRs.
6. Build reusable argument/source-role registry before broad color-block redesign.
7. Resume Reader R6 separately.

## Evidence package

`incoming/gpt-5-6-nagornaya-deep-audit/2026-07-22/REPORT.md`
