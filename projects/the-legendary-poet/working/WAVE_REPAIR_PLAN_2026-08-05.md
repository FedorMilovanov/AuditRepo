# Wave repair plan — The Legendary Poet

Current verified source production baseline: `db6bc3ea8997f78d1370a05e2736cf20645c80dd`.

Exact promotion evidence:

- [`verification/PREMIUM_READER_AND_CURRENT_TRUTH_2026-08-05.md`](../verification/PREMIUM_READER_AND_CURRENT_TRUTH_2026-08-05.md)
- [`verified/PREMIUM_READER_AND_CURRENT_TRUTH_2026-08-05.md`](../verified/PREMIUM_READER_AND_CURRENT_TRUTH_2026-08-05.md)
- [`reverify/REVERIFY_db6bc3e_2026-08-05.md`](../reverify/REVERIFY_db6bc3e_2026-08-05.md)

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
| Post-W5 architecture-truth reconciliation | COMPLETE | exact head `c73cdcb35d30091264db5bf8c1db1c2b0cd46135`; source #325 → current production `db6bc3ea8997f78d1370a05e2736cf20645c80dd` |

W5 exact-head Manual Browser QA run `31043346336` passed four of four jobs. The current-truth exact head passed Project contracts, CI, route, brand and Manual Browser QA run `31045021380`, four of four jobs.

## W6 — branch and artifact retirement — ACTIVE

Root cause ID: `TLP-CLEAN-001`.

Required closure outcomes:

1. classify every remaining TLP source and AuditRepo ref by exact head and successor;
2. never merge Arena, trigger or deeply diverged work branches wholesale;
3. assign every unique path one explicit outcome: represented, extract, archive pointer, reject, or owner decision;
4. preserve byte-level historical evidence before retirement where the canonical repository does not already contain it;
5. keep unresolved media rights and source-acquisition gaps blocked instead of upgrading them by inference;
6. rebuild selective extraction on the current source production and repeat the exact-head source matrix;
7. record final source merge SHA and current-production reverify before any deletion claim;
8. physically delete only through an authorized delete-ref operation; inventory or force-moving a ref is not deletion.

Current owned lanes:

- source draft #324, rebuilt as one commit `6146e6f5da81c7904fd1bb135c22a409f3e12719` on `main@db6bc3e`, selective verified-media extraction only;
- AuditRepo draft #185, path inventory, trigger/successor maps, W4-A archive and Arena/deep-branch barriers;
- canonical branch disposition in [`BRANCH_DISPOSITION_2026-08-05.md`](BRANCH_DISPOSITION_2026-08-05.md).

Promotion barrier: source #324 must pass the full current exact-head matrix and merge; AuditRepo #185 must then be rebuilt from current AuditRepo main, reconcile final production identity and pass `AuditRepo Validate` before promotion.

## Governance lane — ACTIVE OWNER DECISION

Root cause ID: `TLP-GOV-001`.

The source package remains private and no public-source licence may be inferred. Closure requires one isolated source PR that records package identity, supported Node engine, non-publishing/release authority and an explicit licensing disposition, with package/lock/document parity machine-checked.

## W7 — closure discipline

After every source merge:

1. record exact tested head and successful required workflows;
2. record expected-head-protected squash merge SHA;
3. reverify the resulting current source `main`;
4. update matrix, registry, wave plan and branch disposition from that exact production truth;
5. merge AuditRepo only from current main with `behind=0` and successful `AuditRepo Validate`.

## Non-mixing rule

One source PR owns one root-cause family. Scale comes from shared contracts and complete affected-surface closure, not from combining unrelated content, backend, brand, governance and branch-deletion work into one diff.
