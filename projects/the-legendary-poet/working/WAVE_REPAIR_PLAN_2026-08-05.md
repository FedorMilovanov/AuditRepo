# Wave repair plan — The Legendary Poet

Current verified source production baseline: `ccbdebc5e47d275561de9ec78f181e388e4a4e1a`.

Latest exact source evidence:

- [`reverify/REVERIFY_ccbdebc_2026-08-05.md`](../reverify/REVERIFY_ccbdebc_2026-08-05.md)
- [`verified/GOVERNANCE_RELEASE_CONTRACT_2026-08-05.md`](../verified/GOVERNANCE_RELEASE_CONTRACT_2026-08-05.md)
- [`verified/W6_RETIREMENT_PREPARATION_2026-08-05.md`](../verified/W6_RETIREMENT_PREPARATION_2026-08-05.md)

## Closed source waves

| Wave | State | Production authority |
|---|---|---|
| W0 — machine-checked system truth | COMPLETE | source #303 → `69e5d3931bc1d1af635efeaf98c76cf36ce30f41` |
| Discovery integrity / Safari readiness | COMPLETE | source #305 → `44a36bdb97e22827b2026e5622b79a6908d7af03` |
| W1 — one public Essay model | COMPLETE | source #308 → `e06bdfc42ada0a6111f0cde6e39dd7f48204f2c8` |
| W2 — immutable essay publication | COMPLETE | source #311 → `a248abd54007bd839ffc149b9195dc4e79dc5dd3` |
| W3 — target-scoped community scaling | COMPLETE | source #316 → `4544bb387108a98641313267beafe29deb71ee81` |
| W4 — workflow/performance consolidation | COMPLETE | source #318 → `a11f6faff984cd599539e04696717c6fb336329b` |
| W3 current-production hardening | COMPLETE | source #317 → `d03f09188cd0360c6c984ed93d03b1432913332c` |
| W5 — premium reader certification | COMPLETE | exact head `0536547e178fb091de1a76c85aecec4409478975`; source #322 → `6f13600ba88f08123c8c1b817ffdc0ca3dec0bc0` |
| Post-W5 architecture truth | COMPLETE | exact head `c73cdcb35d30091264db5bf8c1db1c2b0cd46135`; source #325 → `db6bc3ea8997f78d1370a05e2736cf20645c80dd` |
| W6 selective verified-media extraction | COMPLETE | exact head `6146e6f5da81c7904fd1bb135c22a409f3e12719`; source #324 → `17d0017bdb4347bea4f12a7cd1c4f30d67e8fb97` |
| Governance package/release contract | COMPLETE | exact head `e3a1a877ebb14eb2e163b14995ded592cf553909`; source #326 → current production `ccbdebc5e47d275561de9ec78f181e388e4a4e1a` |

Source #324 and #326 each passed all triggered current-head workflows and Manual Browser QA 4/4 before expected-head squash merge.

## W6 evidence and preparation — VERIFIED

AuditRepo #185 owns the verified preparation package:

1. exact 15-trigger ref map;
2. exact 11 completed/superseded source successor map;
3. three byte-identical Arena evidence files and stale archive boundary;
4. full deep-branch ordered path-family disposition;
5. exact retained archive ref `archive/deep-research-local-images-20260724@909df9f...`;
6. source #324 exact tests and production successor;
7. W4-A unique evidence archive;
8. TLP-only AuditRepo ref map;
9. machine deletion manifest for 29 source + 3 AuditRepo refs;
10. final source/AuditRepo branch counts and delete-ref postcondition.

The inventory is rebuilt from post-governance AuditRepo main and must pass `AuditRepo Validate` on one unchanged head before expected-head merge.

## W6 physical branch retirement — ACTIVE FINAL BARRIER

Root cause ID: `TLP-CLEAN-001`.

Only these operations remain:

1. delete the 32 manifest refs through an authorized delete-ref API/UI operation;
2. retain source `main` and `archive/deep-research-local-images-20260724`;
3. retain AuditRepo `main` and unrelated project/archive refs;
4. re-list both repositories and prove all targets absent;
5. remove `TLP-CLEAN-001` from source and AuditRepo current truth in one final exact-head cycle.

The connected GitHub capability does not expose delete-ref. Inventory, `RETIRE_READY`, branch closure and force-moving refs do not satisfy this operation.

## W7 — closure discipline

After every source merge:

1. record exact tested head and required successful workflows;
2. record expected-head-protected squash SHA;
3. reverify source `main`;
4. update matrix, registry, wave plan and branch disposition;
5. merge AuditRepo only from current main with `behind=0` and successful Validate.

## Non-mixing rule

One source PR owns one root-cause family. Shared contracts close all affected surfaces; unrelated content, backend, brand, governance and deletion work are not combined into one source diff.
