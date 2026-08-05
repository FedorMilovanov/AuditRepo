# Verified current truth — system and content waves

## Status

`production-current / source main@e06bdfc`

## Closed findings

| ID | Closed production state |
|---|---|
| `TLP-SYS-001` | Current architecture and operational documentation are machine-checked. |
| `TLP-SYS-002` | Workflow path filters are checked against the live repository tree. |
| `TLP-SYS-003` | A working root-cause matrix and wave plan exist in AuditRepo. |
| `TLP-RUNTIME-001` | Daily content uses a deterministic UTC-day contract. |
| `TLP-DISC-001` | Committed sitemap and feed must match canonical source data byte-for-byte. |
| `TLP-QA-002` | Safari brand-source QA waits for official route readiness before enumerating placements. |
| `TLP-ARCH-001` | The hidden Article model is retired; Essay is the single live longform model. |

## Production identity

- W0 source PR: `FedorMilovanov/TheLegendaryPoet#303`
- Discovery/Safari source PR: `FedorMilovanov/TheLegendaryPoet#305`
- W1 production source PR: `FedorMilovanov/TheLegendaryPoet#308`
- W1 exact tested head: `efb097c158f2015c7312ed35492caee2f72f281d`
- Current source production: `e06bdfc42ada0a6111f0cde6e39dd7f48204f2c8`

## Durable invariants

- Node 24 is the source baseline.
- Project contract and workflow path integrity have permanent executable gates.
- `validate:discovery-artifacts` runs inside repository-wide content validation.
- `validate:content-model` runs inside repository-wide content validation and its own Node 24 workflow.
- Runtime has no `Article` interface, `Poet.articles`, generic article export or legacy article data module.
- Five legacy drafts remain preserved outside runtime with bounded SHA-256 checks and explicit non-publication labels.
- Compatibility redirects remain available.
- The parallel agent branch was not rewritten; stale-base work was integrated through a separate current-main branch and full combined verification.

## Exact combined evidence

The final W1 head passed Content model, Project contracts, CI, both Brand lines, route integrity, catalog, both Yesenin lines and Manual Browser QA 4/4. Pages was skipped by the normal PR-only condition.

## Still open

- `TLP-ARCH-002` — immutable essay publication builder;
- `TLP-COMM-001` — target-scoped community loading and pagination;
- `TLP-PERF-001` and `TLP-CI-001` — performance margin and workflow consolidation;
- `TLP-QA-001` — broader premium reader-outcome synthesis;
- `TLP-CLEAN-001` — branch and artifact retirement;
- `TLP-GOV-001` — owner-controlled package/license/release decisions.

## Evidence map

- Verification: `../verification/SYSTEM_AND_CONTENT_WAVES_2026-08-05.md`
- Reverify: `../reverify/REVERIFY_e06bdfc_2026-08-05.md`
- Working matrix: `../working/MASTER_BUG_MATRIX_2026-08-05.md`
- Working wave plan: `../working/WAVE_REPAIR_PLAN_2026-08-05.md`
