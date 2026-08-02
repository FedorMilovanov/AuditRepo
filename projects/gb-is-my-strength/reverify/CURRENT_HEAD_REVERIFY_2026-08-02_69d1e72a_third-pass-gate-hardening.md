# Third independent matrix and AuditRepo gate pass — 2026-08-02

**AuditRepo exact main:** `69d1e72a8b59faafe1e68bd89704cf6fb8cda424`
**Verified product/evidence anchor:** `fc1085c805d72e6d43f58a6383c680d4e886183b`
**Source main at gate start:** `6cfa7468e033ed44dac79b9752b127f406d33724`
**Final source main observation:** `92bfa45a02e53d7b735af73025a79d99ffe75b67`
**Active source owner:** draft PR #680 at `f95948ebd3f84791e150445ed505772965e180f7`
**Last exact production:** `abf1edba190280e554dfda085bef9fb6594c896d`
**Production claim:** none

## Revalidation result

The canonical matrix remains **358 IDs = 168 closed + 190 open**. Source `main` moved during this pass from `6cfa7468e033ed44dac79b9752b127f406d33724` to `92bfa45a02e53d7b735af73025a79d99ffe75b67`. The eight-commit delta changes generated feed/sitemap, Wave12/search workflows and audit/registry scripts, but does not touch Karty/Ishod data, Vosk, genealogy or matrix-evidence paths. No product verdict is promoted or closed in this pass.

The operational owner reference moved again during verification: PR #680 is finally observed at `f95948ebd3f84791e150445ed505772965e180f7`. The matrix and NEXT handoff record that exact observation while preserving the instruction not to modify the owner branch.

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

## Final source-delta review

The compare from `6cfa7468e033ed44dac79b9752b127f406d33724` to `92bfa45a02e53d7b735af73025a79d99ffe75b67` is eight commits and seven paths:

- `feed.xml` and `sitemap.xml`;
- Wave12 and search workflow policy;
- sitemap normalization and public-surface regression scripts;
- pastor-series visual-parity audit logic.

No file in the Karty/Ishod data plane, Vosk evidence, genealogy evidence or AuditRepo matrix/evidence corpus changed. This is a path-impact carry-forward only; browser/runtime and production authority are not inferred from it.

## Boundary

No product source, Research corpus, matrix status, canonical count or production artifact is changed by this transaction. Only AuditRepo governance, operational authority pointers and regression coverage are updated.
