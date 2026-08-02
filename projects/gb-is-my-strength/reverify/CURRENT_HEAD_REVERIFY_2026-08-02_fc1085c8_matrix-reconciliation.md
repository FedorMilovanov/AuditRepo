# Verified-anchor matrix reconciliation — 2026-08-02 — `fc1085c8`

**AuditRepo base:** `a4ac63a1bfaa2549766cf911f3de886f21873875` (PR #120 merge)
**Verified product/evidence anchor:** `fc1085c805d72e6d43f58a6383c680d4e886183b`
**Source main later observed:** `f9234dbbe832d80b4d9a453ce3d2f58da832b24f`
**Former canonical source:** `efaf2a51b1fcc7b7d3f8c9558ecb5acf849df3b3` (**65 commits behind the verified anchor**)
**PR #120 merge-time source anchor:** `8f17085dc8411cffbcb5a4dcd2f8fc5db9c30a97` (**20 commits behind the verified anchor**)
**Intermediate matrix-review anchor:** `5373c9854b3f1bb767cf18c4539de82db26b7b7a` (**11 commits behind the verified anchor**)
**Last exact production:** `abf1edba190280e554dfda085bef9fb6594c896d`
**Production claim:** no; verified anchor `!=` production

## Why this transaction exists

The post-PR-120 independent audit found four canonical/control-plane defects:

1. `NEW-68/69` was a physical closed-table row but not a canonical ID because `/` violates the matrix ID grammar. It represented two distinct bugs and counted as zero IDs.
2. `AR-006` was explicitly marked CLOSED while remaining in the open AUDITREPO section and in the 191-open total.
3. Two rights-policy evidence IDs were visible in reverify but absent from matrix/registry: `RIGHT-4Q204-OPEN-SCHEMATIC` and `RIGHT-P72-TEXT-LINK-ONLY`.
4. The supposedly blocking coverage job piped `check_matrix_coverage.py` into `tee` without `pipefail`; the script returned 1 for the diagnostics, but Bash returned the status of `tee`, so CI was falsely green.

## Correct arithmetic

Before repair:

- 356 canonical IDs = 165 closed + 191 open;
- `NEW-68/69` contributed **0** canonical IDs;
- `AR-006` contributed one canonical ID to open despite its CLOSED state.

After repair:

- split `NEW-68/69` → `NEW-68` + `NEW-69`: **+2 canonical closed IDs**;
- move `AR-006` open → closed: total unchanged, closed +1, open −1;
- final: **358 canonical IDs = 168 closed + 190 open**;
- section totals: P0 0, P1 96, P2 36, P3 51, Refactoring 4, AuditRepo 3.

The older proposal “split → 357 total” was rejected as arithmetically incorrect: replacing a zero-count slash row with two canonical IDs increases 356 to 358.

## Source-delta boundary

The first 9 commits after PR #120's source anchor add the Pihahiroth uncertainty release lane and change Ishod projection surfaces, including `IshodMap.astro` and `IshodPageHead.astro`. Ishod/browser/runtime classifications therefore remain open pending a fresh exact-head witness.

The next 11 commits from `5373c985` to the verified anchor `fc1085c8` change Wave12/search/visual-policy surfaces only:

- Wave12 release and canonical-discovery workflows/contracts;
- search-manifest policy and sitemap normalization;
- Diotrophes metadata/route profile;
- visual-parity baseline and pastor-series visual policy.

They do not touch the earlier Karty/Vosk/genealogy evidence-critical paths, so this authority refresh does not silently reclassify those rows.

After the anchor was verified, source `main` advanced through `f9234dbb` by two control-plane-only cleanup commits:

- removal of the completed canonical-discovery normalization writer;
- action pin normalization in the Pihahiroth release workflow.

Those two commits change no product, Karty/Ishod data, Vosk, genealogy or matrix-evidence path. They are recorded as later observed source-tip movement, not as a new product/evidence anchor. Future status changes still require a new exact-head reverify.

Draft source PR #680 is active at `282ee9aec770b6f7c91145d39f935ea14136d29e`. Its branch and owner files are outside this AuditRepo transaction.

## Permanent control-plane changes

- noncanonical IDs in canonical tables are blocking;
- an explicit CLOSED description inside an open section is blocking;
- section heading and statistics drift are blocking;
- unregistered reverify IDs remain blocking;
- workflow uses `set -o pipefail`, so `check_matrix_coverage.py | tee` preserves the checker exit status;
- regression fixtures cover slash IDs, closed-in-open rows and heading count drift.

## Boundary

No product source, Research corpus or production artifact is modified. This is an AuditRepo canonical verifier transaction. Exact-head CI and post-merge re-read are required before declaring completion.
