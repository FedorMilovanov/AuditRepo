# Tooltip priority-free intent disposition — 2026-07-28

## Scope

Repository: `FedorMilovanov/gb-is-my-strength`  
Working ref: `fix/print-decoration-pagination-2026-07-25`  
Current head inspected: `82e96a03276f6c3996174b7bf338861012842946`  
Current site main inspected: `b40044713b9fa09e404d5f57b2016d31f4cc88c6`

This is a separate glossary/tooltip audit. The two commits are not classified as part of the print/PDF product chain merely because they were appended to an old print branch.

## Exact history

The ref contains PR #280 head `ccbdb6959cc32d8b9f650b02793222b6e99d8c2b` plus exactly two commits:

1. `6557fbeec084ec5f0afea1acc8d3718d360506a6` — `fix(glossary): converge floating tooltip rule without priority flags`;
2. `82e96a03276f6c3996174b7bf338861012842946` — `test(glossary): require priority-free floating tooltip contract`.

Only two files differ from PR #280:

- `scripts/tooltip-style-normalizer.js`;
- `scripts/tooltip-style-normalizer-test.js`.

The exact head is preserved at:

- `archive/forensic-tooltip-priority-free-intent-20260725`.

PR #280 itself remains separately preserved at:

- `archive/forensic-print-decoration-pagination-pr280-20260725`.

## Intended change

The first commit changes the normalizer's canonical floating-tooltip pointer rule from:

- `pointer-events:none!important` on the portaled surface;
- `pointer-events:auto!important` on explicit interactive descendants;

to the same selectors without priority flags.

The second commit changes only the unit-test expectation so that `!important` is forbidden in the normalized rule.

The stated goal is priority reduction, not a changed pointer-interaction model.

## Why this is not a completed product fix

### 1. Product CSS was never materialized

The branch `css/site.css` blob is:

- `2cbc20b1fb5e6552ddd0fa28df24724fcd37efdc`.

That is exactly the same blob as PR #280 head. Neither of the two tooltip commits changes `css/site.css`.

The source therefore still contains the priority-bearing rule while the modified normalizer declares the priority-free rule canonical.

### 2. The permanent source contract would reject the exact head

`.github/workflows/glossary-contract.yml` includes `scripts/tooltip-*.js` in its path contract. Its read-only source job runs:

- `node scripts/tooltip-style-normalizer-test.js`;
- then `node scripts/tooltip-style-normalizer.js` without `--write`.

At this branch head:

- the unit test accepts the new constant;
- the normalizer reads unchanged priority-bearing `css/site.css`;
- it detects `PRIORITY_FLOATING_TOOLTIP_POINTER_RULE`;
- it produces a different priority-free output;
- because it is running without `--write`, it sets a failing exit code.

This is an internally inconsistent autofix intent, not an exact-head source contract.

### 3. No exact-head Actions evidence exists

`82e96a03276f6c3996174b7bf338861012842946` has no associated workflow runs. The ref has no PR carrying an `autofix` label, so the write-capable placement/autofix job never materialized or validated the proposed CSS transaction.

### 4. No browser evidence was added for the changed priority model

The two commits change no Playwright fixture, no real route, no overlay runtime and no pointer-hit assertion.

The accepted permanent browser contract verifies that portaled desktop and mobile tooltip surfaces compute to `pointer-events:none`, remain within the viewport, do not intercept adjacent clicks and allow outside dismissal. The intent branch does not prove that removing priority flags preserves those outcomes under the complete stylesheet.

## Accepted current authority

Merged PR #183, `feat(glossary): universal runtime rebuilt on current main`, established the universal tooltip source/browser/normalizer contract. Its canonical normalizer introduced the priority-bearing portaled-surface rule.

Current `main` retains this accepted model:

- `scripts/tooltip-style-normalizer.js` blob `2083e44e16270a7bed45c23e9b64e43b44455b6f`;
- `scripts/tooltip-style-normalizer-test.js` blob `8faac2d42ea2e771dafd0b9bf8c06c5bfb79f7f9`;
- the unit test requires `pointer-events:none!important` and `pointer-events:auto!important`;
- `scripts/tooltip-marker-browser-test.js` verifies the resulting portaled surface computes to `pointer-events:none` on desktop and mobile and remains pointer-transparent during real hit testing.

This does not establish that `!important` is theoretically indispensable forever. It establishes that the priority-free proposal was not completed or proven and therefore cannot replace the accepted contract through branch recovery.

## Disposition

`INCOMPLETE_AUTOFIX_INTENT / NO_PRODUCT_TRANSFER / FORENSIC_HEAD_PRESERVED`

Consequences:

- do not cherry-pick `6557fbee...` or `82e96a03...` into current `main`;
- do not create a CSS-only materialization from this historical branch;
- do not weaken the current priority contract without a new bounded tooltip lane that includes source normalization, complete stylesheet materialization, exact-head source checks and browser hit-testing;
- the original working ref may be normalized to current site `main` only after this disposition is merged and the ref is rechecked at exact head `82e96a03...`;
- no branch deletion is authorized.

## Publication boundary

This disposition changes no product CSS, tooltip runtime, article, route, publication state or deploy workflow.