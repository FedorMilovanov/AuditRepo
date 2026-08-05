# Verified current truth — W2 immutable essay publication

## Status

`production-current / source main@a248abd`

## Closed finding

| ID | Closed production state |
|---|---|
| `TLP-ARCH-002` | Essay publication no longer mutates imported authoring objects; all canonical essays are published as deeply frozen derived values. |

## Production identity

- Source PR: `FedorMilovanov/TheLegendaryPoet#311`
- Exact tested head: `8eaeaa4abc7f80eb6b96de0657df0b3e255d96d3`
- Current source production: `a248abd54007bd839ffc149b9195dc4e79dc5dd3`

## Durable invariants

- one publication boundary composes authoring data into fresh values;
- `id` and `slug` cannot be replaced by publication overrides;
- `readTime` is derived from final blocks before publication;
- published essays, nested values and catalog array are frozen;
- duplicate ids/slugs fail during catalog creation;
- raw authoring objects remain unchanged and never share identity with published objects;
- canonical page/discovery/validator consumers use the catalog module rather than raw essay modules;
- the immutable-publication validator is part of repository-wide content validation and the exact-checkout Content model workflow;
- overlapping W2 branches were reconciled through one production integration PR instead of multiple merges.

## Exact combined evidence

The final W2 head passed Content model, Project contracts, full CI, catalog, all relevant Yesenin/Duncan publication checks, route integrity, both brand lines and Manual Browser QA 4/4. Pages was skipped by the normal PR condition.

## Still open

- `TLP-COMM-001` — target-scoped community loading and cursor pagination;
- `TLP-PERF-001` and `TLP-CI-001` — performance margin and workflow consolidation;
- `TLP-QA-001` — broader premium reader-outcome synthesis;
- `TLP-CLEAN-001` — branch and artifact retirement;
- `TLP-GOV-001` — owner-controlled package/license/release decisions.

## Evidence map

- Verification: `../verification/IMMUTABLE_ESSAY_PUBLICATION_2026-08-05.md`
- Reverify: `../reverify/REVERIFY_a248abd_2026-08-05.md`
- Working matrix: `../working/MASTER_BUG_MATRIX_2026-08-05.md`
- Working wave plan: `../working/WAVE_REPAIR_PLAN_2026-08-05.md`