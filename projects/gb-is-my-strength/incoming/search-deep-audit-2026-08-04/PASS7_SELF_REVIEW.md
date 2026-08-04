# Search audit pass 7 — self-review / anti-bloat check

**Date:** 2026-08-04  
**Product source HEAD:** `f9d0120718569c510833dba7a3abd68ce2f6a003`  
**Scope:** self-audit of the AuditRepo search findings promoted in this lane  
**Machine artifact:** `PASS7_SELF_REVIEW_PROBE.json`

## 1. Why this pass exists

The owner explicitly requested a check of the audit itself: where it may be under-confirmed, inflated, noisy or “мусор”. This pass audits the audit trail, not the Product code.

It checks:

- every promoted search row appears exactly once in the matrix;
- every row has evidence files;
- raw JSON artifacts parse;
- 50+ check harness counts are real;
- matrix counters and `NEXT_AGENT_PROMPT` are synchronized;
- evidence content actually supports the row topic;
- rows that need browser closure witnesses are labelled as such;
- no unsupported production/browser-pixel/malware certainty is being claimed.

## 2. Self-review harness result

The self-review harness executed **88 checks**.

```json
{
  "checks": 88,
  "passed": 88,
  "failed": 0
}
```

The two initial string hits for “same-SHA production claim” / “browser pixel claim” were false-positive matches against explicit negative wording (“no same-SHA production claim”, “no browser pixel claim”). They were reclassified as clean because the reports consistently avoid those claims.

## 3. Verdict on audit bloat / unsupported claims

### No demotions recommended

No promoted row is recommended for removal or demotion in this self-review.

Reason:

- `SEARCH-P1-01`, `SEARCH-P1-03`, `SEARCH-P1-04` are supported by source/dist/data artifacts and represent real Product-quality gaps.
- `SEARCH-P2-07`, `SEARCH-P2-08` are data-governance debts, not runtime crash claims.
- `SEARCH-P2-09`, `SEARCH-P2-10` are source/contract/a11y observable.
- `SEARCH-P2-11`, `SEARCH-P2-12` are premium-native source/CSS/modal-contract findings, but require browser witness for Product closure.
- `SEARCH-P3-01`, `SEARCH-P3-02`, `SEARCH-P3-03` are correctly kept as polish/discovery rows, not elevated to P2/P1.

### One wording guard retained

`SEARCH-P2-11` must continue to be read as a **top-layer source-contract risk**, not as a browser-proven visual collision. The existing evidence proves:

- search fallback z-index is lower than other floating layers;
- base dialog lacks a visible shared close affordance;
- Tab handling is input-scoped.

It does **not** prove, without a browser witness, that users currently see a specific tooltip covering the search modal. The row and repair docs now keep that boundary explicit.

## 4. Rows requiring browser witness before Product closure

The following rows are valid backlog entries now, but must not be closed without browser witnesses:

- `SEARCH-P1-01` — affected route click/shortcut proof or explicit owner exceptions.
- `SEARCH-P2-10` — accessibility-tree/keyboard witness after ARIA repair.
- `SEARCH-P2-11` — top-layer/focus-trap/visible-close witness.
- `SEARCH-P2-12` — mobile/coarse-pointer target-size and focus witness.
- P3 UX rows — browser witness desirable for final polish acceptance.

## 5. Things deliberately not promoted

The self-review confirms these were intentionally not inflated into matrix rows:

- hard-coded popular suggestions outside Scripture — repair-plan note only;
- `safeUrl()` protocol-relative hardening — no current corpus hit;
- `data-action=open-search` shared delegation gap — route-owned behavior needs browser witness before row;
- direct full Bible corpus population — non-goal for first Product repair;
- result show-more — kept P3, not P2/P1.

## 6. Counter check

Current intended matrix state after pass 6 remains:

```text
Closed: 213
P1: 73
P2: 35
P3: 42
Refactoring: 4
AuditRepo: 3
Total open: 157
Total IDs: 370
```

No count change is made by this self-review.

## 7. Conclusion

The audit is large, but not currently “мусор”: the rows are evidence-backed and severity-bounded. The main caution is to keep source-contract findings separate from browser-proven user-visible failures. Future Product repair must not close rows from source grep alone where browser interaction is part of the acceptance boundary.
