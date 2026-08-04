# CURRENT HEAD REVERIFY — Editorial projection-only drift

- Date: 2026-08-04
- Source repository: `FedorMilovanov/gb-is-my-strength`
- Canonical finding: `EDITORIAL-PROJECTION-51-DRIFT`
- Original issue: Product #217
- Current Product anchor: `0fbe7d1ead9ebd1bea867418e254da438ec63329`
- AuditRepo base: `ac44c0546c7d637455466dff34828a8c025126e4`
- Current production claim: **none**

## Original claim

The 51-field Search/RSS projection refresh was allowed to overwrite canonical editorial decisions. The required transaction was to retain the 43 RSS and eight Search observation changes while restoring editorial dates and preventing a technical refresh from writing them again.

## Disposition

### `EDITORIAL-PROJECTION-51-DRIFT` — fixed-current and superseded by approval-gated architecture

Product PR #442 repaired the bounded root cause and closed issue #217:

- exact PR head `3eea863a7d9635c96f09a9554e147f9a4607b269`;
- squash merge `f7e426996fd41a23ca720299a8ef1ce7f1c0952f`;
- restored exactly 27 unauthorized `editorialPublishedAt` changes;
- retained all 51 proven projection observations;
- retained review statuses, modification dates, provenance, record structure and source boundary;
- changed seven permanent owner files and removed temporary diagnostics;
- added a generic frozen/observed diff with a blocking editorial-drift mode and a registry preservation test.

The source merge also obtained a same-SHA historical deployment witness: deploy run `30300756799` attempt `1`, candidate artifact `8666941723`, generic live witness `8666955596`, and release/control SHA `f7e426996fd41a23ca720299a8ef1ce7f1c0952f`. This historical witness does not establish current production authority for `0fbe7d1e`.

A later owner wave strengthened the architecture rather than reopening the claim. Exact head `7de20ed77e60ec05bb91322ac03800a3d9860410` established approval-gated editorial metadata ownership and passed `Editorial Metadata v3` run `30679631914` plus eight adjacent exact-head workflows.

## Current-head source witness

At current Product anchor `0fbe7d1ead9ebd1bea867418e254da438ec63329`:

- `.github/workflows/editorial-metadata-v3.yml` retains blob `00caeeaecff5a70d22ccbfa1263aefd5ef637640`;
- `scripts/editorial-metadata-registry-preservation-test.js` retains blob `0c7a733df4c6b661fdffd377e7f0d5b4c3bc9708`;
- those are the exact same workflow and preservation-test blobs present on green exact head `7de20ed77e60ec05bb91322ac03800a3d9860410`;
- the workflow still builds the production-like strangler artifact, preserves the committed freeze, checks registry structure, audits current projections, captures observations without mutating the freeze, requires idempotence, and runs the frozen/observed diff with `--forbid-editorial-drift`;
- the preservation test still proves that observed technical descriptors and observations may refresh while editorial publication/modification dates, original-work date, review status, provenance and content type remain owned by the prior editorial record.

Therefore the original 51-field claim is not an open current-head defect. The technical writer that caused it is guarded by permanent fail-closed contracts, and the broader current architecture requires explicit editorial approval rather than inferring decisions from technical projections.

## Evidence boundary

This closure covers only the canonical projection-overwrite claim. It does not approve unresolved editorial dates, close separate `inconsistent-needs-review` records, or claim that current Product `main` is deployed. Later Diotrophes observation reconciliation is a separate bounded transaction and does not reopen this finding.

## Canonical arithmetic applied by this transaction

- Canonical IDs: **358**
- Closed: **191 → 192**
- Open: **167 → 166**
- P1: **79 → 78**
- P0: 0
- P2: 34
- P3: 47
- Refactoring: 4
- AuditRepo: 3

The total remains `358 = 192 + 166`.