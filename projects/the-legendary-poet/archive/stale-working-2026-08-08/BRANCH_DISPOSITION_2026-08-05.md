# Remote branch disposition — The Legendary Poet

Current verified source production: `ccbdebc5e47d275561de9ec78f181e388e4a4e1a`.

This is the canonical class-level disposition. Exact per-ref identities, successors and path outcomes are in the `W6_*_2026-08-05` ledgers and machine manifest introduced by AuditRepo #185.

| Branch / class | Current disposition | Durable evidence / remaining barrier |
|---|---|---|
| 15 `agent/marathon-*trigger*` refs | `RETIRE_READY` | exact PR/head map #287–301; one-shot transport only; actual delete-ref required |
| 8 W0–W4 audit/integration refs | `RETIRE_READY` | exact production successors through `d03f091` and later current production |
| 2 W5 evidence refs #320/#321 | `RETIRE_READY` | synthesized into exact W5 head `0536547`, production `6f13600`; never re-merge |
| `agent/current-state-truth-contract-20260805` | `RETIRE_READY` | superseded #323; durable rebuild #325 → `db6bc3e` |
| `arena/019fcf76-thelegendarypoet` | `RETIRE_READY` | two unique documents byte-identically archived in AuditRepo; old runtime superseded |
| `arena/019fcf77-thelegendarypoet` | `RETIRE_READY` | one unique document byte-identically archived in AuditRepo; old runtime superseded |
| `work/local-images-playwright-wtoc` | `RETIRE_READY` | every path family classified; C03/C08 extracted by source #324; all remaining bytes/history preserved at identical archive ref `archive/deep-research-local-images-20260724@909df9f...` |
| `archive/deep-research-local-images-20260724` | `INTENTIONAL_RETAIN` | exact forensic/research archive; not a production merge candidate and not in deletion set |
| source #324 branch | auto-deleted after expected-head merge | verified-media extraction production `17d0017`; no remaining ref |
| source #326 branch | auto-deleted after expected-head merge | governance production/current source `ccbdebc`; no remaining ref |
| 3 old TLP AuditRepo closure refs | `RETIRE_READY_AFTER_PR185_MERGE` | W2/W3/W4 successors and W4-A byte archive recorded; actual delete-ref required |
| `audit/tlp-w6-branch-artifact-inventory-20260805` / AuditRepo #185 | active final evidence owner | expected to auto-delete after merge; does not substitute for deletion of the 32 manifest refs |

## Exact deletion set

Machine-readable authority:

`working/W6_PHYSICAL_REF_DELETION_MANIFEST_2026-08-05.json`

It lists:

- 29 source refs to delete;
- 3 AuditRepo TLP refs to delete after #185 merge;
- source `main` and exact deep-research archive ref to retain;
- expected heads where known and mandatory requery where not pinned;
- final branch-absence postcondition.

## Deep-branch path outcomes

Every path unique to `work/local-images-playwright-wtoc` is owned by the ordered family rules in `W6_EXTRACTION_LEDGER_STAGE1_2026-08-05.md`:

- `EXTRACTED_CURRENT`;
- `REPRESENTED_CURRENT`;
- `ARCHIVE_REF_CURRENT_BACKLOG`;
- `ARCHIVE_ONLY_REJECT_LIVE`;
- `REPRESENTED_OR_OBSOLETE`;
- `OWNER_DECISION_ARCHIVED`;
- fallback `ARCHIVE_POINTER_ONLY`.

The first matching family owns each path. Only two PR77 media decisions are accepted in production; 28 candidates remain blocked. The archive ref grants no rights and closes no research issue.

## Physical deletion truth

A branch is not deleted merely because it is merged, classified, closed, force-moved or listed as `RETIRE_READY`.

Closure requires:

1. actual deletion of `refs/heads/<name>` for every manifest target;
2. source and AuditRepo branch re-list;
3. proof that all 32 targets are absent and retained refs remain;
4. one final source/AuditRepo truth transition removing `TLP-CLEAN-001`.

The connected GitHub capability does not expose delete-ref and the environment has no working GitHub network path for CLI. Force-moving refs is forbidden. Therefore W6 remains `active-current` solely for this external repository-maintenance operation.
