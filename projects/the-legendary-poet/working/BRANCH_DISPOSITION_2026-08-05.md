# Remote branch disposition — The Legendary Poet

Current verified source production: `db6bc3ea8997f78d1370a05e2736cf20645c80dd`.

This is the canonical class-level disposition. Exact per-ref PR/head/successor evidence is owned by AuditRepo draft #185 under the `W6_*_MAP_2026-08-05.md` working ledgers.

| Branch / class | Current disposition | Retirement barrier |
|---|---|---|
| `agent/marathon-audit-trigger*`, clean/security/dependency/router trigger refs | `RETIRE_READY` after exact mapping to closed one-shot PRs #287–301 | physical delete-ref operation only; never merge or force-move as a substitute |
| W0–W4 audit/integration source refs | `RETIRE_READY` where draft #185 records the exact production successor | retain PR and production SHA pointer |
| W5 source evidence refs from #320/#321 | `RETIRE_READY` after production #322 / `6f13600` | retain evidence-only PR pointer; never re-merge |
| `integration/premium-reader-certification-w5-20260805` | production successor #322 / `6f13600` | delete after final W6/AuditRepo closure records exact head and successor |
| retired architecture-truth refs #323/#325 | #323 superseded; #325 production successor `db6bc3e` | preserve both PR dispositions; delete stale refs only after final ledger promotion |
| `arena/019fcf76-thelegendarypoet` | `HOLD_EXTRACTION` | three unique audit documents must be physically archived in AuditRepo, not represented only by cross-repository blob SHA |
| `arena/019fcf77-thelegendarypoet` | `HOLD_EXTRACTION` | same archive barrier; runtime implementation is superseded and must not be merged |
| `work/local-images-playwright-wtoc` | `HOLD_PATH_LEDGER`; deeply diverged | every unique research/provenance/media/E2E path requires represented/extract/archive/reject/owner-decision status |
| `extract/w6-verified-media-provenance-20260805` / source #324 | active W6 selective extraction; rebuilt head `6146e6f5da81c7904fd1bb135c22a409f3e12719` on current production | full exact-head source matrix, expected-head squash merge and final production reverify |
| AuditRepo TLP W2/W3/W4 historical refs | `RETIRE_READY` only where draft #185 records canonical successor or archived W4-A evidence | merge final #185 first; do not touch unrelated Search/TTS/Avraam/project refs |
| `audit/tlp-w6-branch-artifact-inventory-20260805` / AuditRepo #185 | active W6 evidence owner | rebuild from current AuditRepo main after final source merge; pass `AuditRepo Validate`; then promote |

## Deep-branch path outcomes

Every path unique to `work/local-images-playwright-wtoc` must receive exactly one status:

- `REPRESENTED_CURRENT` — current production or canonical research already contains equivalent or stronger material;
- `EXTRACT` — durable unique value must be selectively moved into a current-head source PR;
- `ARCHIVE_POINTER` — historical evidence remains external but has a durable exact ref/blob/PR pointer and is not needed at runtime;
- `REJECT_STALE` — implementation or claim is obsolete, unsafe or contradicted by current production;
- `OWNER_DECISION` — rights, publication or product policy cannot be decided by an agent.

The verified-media extraction accepts only two independently supported Mayakovsky records. The remaining 28 PR77 candidates remain unresolved; hash acquisition is not publication authorization.

## Deletion truth rule

A branch is not deleted merely because it is merged, classified, closed, force-moved or absent from a PR list. Closure evidence may say `RETIRE_READY`, but physical deletion requires an API/UI operation that deletes `refs/heads/<name>` and a subsequent branch inventory proving the ref is absent.

The connected GitHub capability used for this audit does not expose delete-ref. Therefore final W6 promotion may classify and prepare all refs, but must not falsely state that physical deletion occurred unless an authorized external deletion operation is actually performed and reverified.
