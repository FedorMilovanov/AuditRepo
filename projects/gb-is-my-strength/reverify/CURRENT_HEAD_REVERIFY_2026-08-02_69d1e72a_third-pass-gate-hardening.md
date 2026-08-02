# Third independent matrix and AuditRepo gate pass — 2026-08-02

**AuditRepo exact main:** `69d1e72a8b59faafe1e68bd89704cf6fb8cda424`
**Verified product/evidence anchor:** `fc1085c805d72e6d43f58a6383c680d4e886183b`
**Exact source main observed:** `6cfa7468e033ed44dac79b9752b127f406d33724`
**Active source owner:** draft PR #680 at `a231a5005f92d5f1e677ea87ece8bfb6a9dc31d7`
**Last exact production:** `abf1edba190280e554dfda085bef9fb6594c896d`
**Production claim:** none

## Revalidation result

The canonical matrix remains **358 IDs = 168 closed + 190 open**. The source repository has not changed since the prior post-merge observation. The four commits after the durable product/evidence anchor modify workflow/control-plane files only, so no product verdict is promoted or closed in this pass.

The operational owner reference was stale: PR #680 advanced to `a231a5005f92d5f1e677ea87ece8bfb6a9dc31d7`. The matrix and NEXT handoff now record that exact head while preserving the instruction not to modify the owner branch.

## Newly confirmed control-plane gaps

A third independent read of the coverage engine found bypasses that could still produce a green result:

- removing the numeric suffix from a canonical section heading disabled that section's count comparison;
- deleting a required statistics row disabled that statistic's comparison;
- per-category statistics could drift while the total open count remained correct;
- an open finding supported only by archived evidence was measured but not blocking;
- duplicate keys in the JSON evidence registry were silently overwritten by the standard parser;
- closed-in-open detection depended on one exact emoji-plus-English spelling.

## Permanent hardening

The coverage engine now requires one numeric count on every canonical section, exactly one numeric statistics row for closed/P0/P1/P2/P3/refactoring/AuditRepo/total-open, and exact agreement with physical rows. Archive-only evidence for an open finding is blocking. Registry JSON rejects duplicate keys at every object level. Closed status detection accepts the supported English and Russian status forms at the beginning of an open-row description. Machine output now reports both closed and open row totals.

Regression fixtures exercise every new gate. Exact-head CI, repository structure validation, evidence coverage and repository-history forensic checks are required before merge.

## Boundary

No product source, Research corpus, matrix status, canonical count or production artifact is changed by this transaction. Only AuditRepo governance, operational authority pointers and regression coverage are updated.
