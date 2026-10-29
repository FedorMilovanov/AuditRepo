# Milovi Cake current-owner reconciliation

**Product main:** `76675a26538809435f5f1a66132e54b9f12b8ea9`  
**Checked:** 2026-10-29

The prior terminal-zero matrix was anchored to the September suburb-freshness closure. Product has since advanced by more than 150 commits across performance, wedding, gallery, cart, SEO and test owners. HEAD movement alone is not a defect; two current signals do require admission.

## MC-LIGHTHOUSE-TBT-DIVERGENCE-001

Main Lighthouse failed repeatedly on unchanged/recent site bytes, including runs `40761398507`, `40768790149` and exact current-main run `40785879435`. Merged Product PR #110 records the bounded investigation: CI bento TBT 285–611 ms while local Lighthouse 12.6.1 with the repository config reports simulated TBT 0 and observed 6.6–42 ms; homepage LCP remains render-delay dominated. The report explicitly does not establish the cause. Keep as a narrowed harness/runtime residual; do not weaken the threshold or claim a Product regression from environment divergence alone.

## MC-WEBKIT-RESILIENCE-001

Open Product PR #107 owns gallery/cart/suburb corrections and extensive differential diagnostics. Its exact head `1a4a3516f612c90f967b00075b7565f6923dea5b` is mergeable but not admissible: required WebKit reduced-motion check failed and the main WebKit job remained in progress at the readback; earlier exact heads show page crashes/hangs while Firefox and repository gates pass. The PR itself rejects causal claims from small A/B samples and forbids merge before exact-head green plus owner authorization.

These rows do not authorize a parallel Product mutation. Recheck the existing owner PR/run; retire only after exact current-main evidence proves a terminal outcome.
