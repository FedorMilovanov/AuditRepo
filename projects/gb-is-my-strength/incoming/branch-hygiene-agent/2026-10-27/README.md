# Product branch hygiene — evidence intake

**Evidence anchor:** `FedorMilovanov/gb-is-my-strength` `main` at `21dcfdd9f9018607a708c5118383e287ec1a3fed` (2026-10-27 inventory). **AuditRepo base:** `2b56ef73df633ff1d5adfa5ba6cdb2fb02a536c7`. This is historical intake, not a claim that old findings still apply to current Product.

## Purpose and scope

This package preserves GitHub compare metadata for 28 non-deleted Product branches in classes B–E, unmatched added lines identified during class-B review, and 22 unique Markdown/JSON evidence blobs copied from seven class-C/D source branches. Every extracted evidence blob was checked with `git hash-object` against its exact Product branch blob SHA. The manifest records source branch/head/path/blob, destination and byte length.

## Files

- `branch-forensic-B-to-E.json`: per-branch head/PR metadata, ancestry distances, file blob classifications, line-presence heuristic and archive-tag checks.
- `class-B-residual-lines.txt`: added lines not found verbatim in current-main files. Triage aid only; not semantic equivalence proof.
- `SOURCE-ARTIFACT-MANIFEST.csv`: provenance and exact blob verification for all extracted unique evidence files.
- `source-artifacts/`: 17 class-C evidence reports/data files and five class-D evidence files. Files are flattened to avoid Windows path limits; original source paths are preserved in the manifest.

## Branch classes — not deletion authority

- **B — 7 branches / 28 files:** 1,960 of 2,065 added lines were present verbatim in current main (94.92%); 105 were not. Three branch heads have matching archive tags; four do not. This textual heuristic does not prove semantic replacement. All seven remain untouched.
- **C — 6 branches / 243 files:** 81 paths absent from main. Audit evidence includes the pastor-series review and reader UI audit with scripts/screenshots. Only 12 Markdown and five JSON unique evidence artifacts are copied here; remaining files stay in Product Git/bundle.
- **D — 7 branches / 15 files:** nine unique paths. Five branch heads have matching archive tags; two do not. Five Markdown/JSON evidence artifacts are copied here. Product content/code and a temporary workflow are not adopted into AuditRepo.
- **E — 8 branches / 16 files:** no files are unique-new by path/blob classification, but blobs differ. No Product change is approved from that fact alone.

## Decisions that must not be accidentally reversed

### TITLE suffix — do not merge

PR #1705 explicitly rejected the suffix change because it failed the current executable canonical headline contract (`scripts/article-headline-contract.js` expects the `| Господь Бог` suffix on this route; exact-head CI failed `Validate canonical article headlines`). PR #1813 proposes the identical one-line blob. Both old branch blobs are `1c03e5c118d6a93055f89ebb3a42572b6cc9d46f`; current main has `57dc0d98a67013f66e8a477f9af682709dba92c0`. Revisit only if the owner intentionally changes the canonical headline contract and matching tests.

### QUIZ selector ownership — current main already chose Gill-scoped CSS

Do not merge either old quiz branch wholesale. PR #2157 attempted to rename the generic runtime `.quiz-next` to `.gb-quiz-next`, but its own disposition says that approach is superseded. PR #2165 scoped Gill-specific visibility CSS to `#glsQuizNext` and was itself superseded by #2167. Current Product main commit `2ee584d3020b35f5ac7229415fd556affa18c7d3` uses `[data-gill-v16] #glsQuizNext` and `[data-gill-v16] #glsQuizNext.is-visible`, while the generic runtime retains `.quiz-next`. This is an ownership boundary, not two competing fixes.

## Preservation and limitations

The complete Product graph snapshot remains outside AuditRepo on the owner machine at `C:\Users\Fedor\Downloads\gb-is-my-strength-branch-hygiene-2026-10-27\gb-is-my-strength-branch-hygiene-2026-10-27.bundle`. SHA-256: 0c4fe3bb9ee3dbd53c7a0886b1ff1470992573195f063314653f91c1f5f1528a. It contains 31 escrow refs (three deleted class-A tips and all 28 B–E tips); `git bundle verify` passed in the Product checkout. Do not import that Product bundle into AuditRepo's Git graph. Product refs in classes B–E have not been deleted or altered by this cleanup.

The canonical `scripts/branch-hygiene-report.py` could not complete because GitHub API transport failed (`IncompleteRead`, `RemoteDisconnected`, TLS timeout). This intake records the custom forensic snapshot, not a claimed successful canonical report. Re-verify current Product HEAD and PR/branch ownership immediately before implementation or any future deletion.
