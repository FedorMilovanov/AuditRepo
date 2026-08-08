# W6 AuditRepo TLP ref map — final — 2026-08-05

## Scope

Only refs explicitly owned by The Legendary Poet are classified here. Search, TTS, accessibility, Avraam, photo, generic Arena and intentional archive refs belong to other projects or retention policies and are untouched.

Current AuditRepo production before this inventory merge: `8861308e9ecd12194f0781c85d4ed0629af712e6`, including exact W5/current-truth closure and governance closure.

## TLP refs

| Ref | Forensic identity / successor | Final disposition |
|---|---|---|
| `audit/tlp-w2-immutable-publication-closure-20260805` | stale AuditRepo #180 head `640bfccaebf42835c9688df6a48cda7c6e6a7f2c`; rebuilt by #181 exact head `cd7de9071c3df696fd16ee6c83f6d2c62657768d`, squash `077fe1445d274b02e96abdb9dbc41ebf405c4992` | `RETIRE_READY` |
| `audit/tlp-w3-hardening-w4-closure-20260805` | intentionally neutralized duplicate pointer; no unique TLP evidence remains beyond canonical W3/W4 closure | `RETIRE_READY` |
| `audit/tlp-w4a-closure-20260805` | old source `a11f6fa` closure; final W4/hardening authority is AuditRepo #184 / `be03e27e61b6169e518f7b91978abaf48e29baa4`; unique route-budget/browser evidence is byte-preserved under `archive/stale/w4a-a11f6fa-2026-08-05/` in PR #185 | `RETIRE_READY_AFTER_PR185_MERGE` |
| `audit/tlp-w6-branch-artifact-inventory-20260805` | AuditRepo #185 owner of W6 inventory, deep-branch family classification, exact trigger/successor maps, machine deletion manifest, W4-A archive and byte-identical Arena archive | `ACTIVE_UNTIL_PR185_MERGE` |

## Evidence completeness

PR #185 preserves or records:

- exact 15-trigger source map;
- exact 11 completed/superseded source successor map;
- full deep-branch path-family disposition;
- retained archive ref `archive/deep-research-local-images-20260724@909df9f...` identical to the old work ref;
- source #324 exact tested head and production successor;
- source #326 governance exact tested head and current production `ccbdebc`;
- byte-identical Arena audit archive with matching source/target blob SHAs;
- historical W4-A route-budget/browser evidence;
- 29 source + 3 AuditRepo deletion manifest;
- explicit delete-ref/absence recheck barrier.

After #185 is rebuilt from current AuditRepo main, passes `AuditRepo Validate` and squash-merges, its own branch is expected to auto-delete. The other three TLP refs then contain no unique unpreserved value.

## Physical retirement set

After PR #185 merge, delete exactly these three stale TLP AuditRepo refs:

1. `audit/tlp-w2-immutable-publication-closure-20260805`;
2. `audit/tlp-w3-hardening-w4-closure-20260805`;
3. `audit/tlp-w4a-closure-20260805`.

Do not delete or modify any non-TLP ref from this lane.

## Truth rule

`RETIRE_READY` means merge/extraction/evidence barriers are satisfied. Physical deletion requires an authorized delete-ref operation and a subsequent branch listing proving absence. Moving a branch to `main` is not deletion and is forbidden.
