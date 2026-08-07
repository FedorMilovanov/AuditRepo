# Matrix Cleanup — The Legendary Poet — 2026-08-07

Purpose: remove closed and superseded rows from the active working surface without deleting evidence.

Historical source matrix: `MASTER_BUG_MATRIX_2026-08-05.md`.  
New active owner: `../../verified/MASTER_BUG_MATRIX.md`.

## Retirement mapping

| Historical ID | Final disposition | Why it leaves active backlog | Durable owner |
|---|---|---|---|
| TLP-SYS-001 | closed / absorbed | Project truth/open-lane parity was repaired and later architecture lanes were closed. | W0/W5 truth evidence; `SYSTEM_THEMES.md` |
| TLP-SYS-002 | closed-by-fix | Workflow paths gained tree validation and live ownership. | W0 evidence |
| TLP-SYS-003 | superseded-control-plane | A monolithic root-cause matrix was useful during the old operating model; operating model v2 now separates active matrix, system themes and closure ledger. | `DOC_MAP.md`, active matrix, closure ledger |
| TLP-RUNTIME-001 | closed-by-fix | UTC daily-item behavior is permanently validated. | W0 evidence |
| TLP-REPRO-001 | closed-by-fix | Playwright runtime is locked and workflow/browser contracts protect it. | source/package/workflow contracts |
| TLP-DISC-001 | closed-by-fix | Committed discovery artifacts are byte-validated against canonical generation. | discovery validation evidence |
| TLP-QA-002 | closed-by-fix | Safari audit waits for route readiness and real raster settlement. | browser QA evidence |
| TLP-ARCH-001 | closed-by-fix | Dead Article model was archived and removed; Essay owns public longform. | `ST-TLP-CONTENT-AUTHORITY` |
| TLP-ARCH-002 | absorbed-by-system-fix | Essay publication authority/deep-freeze boundary was repaired; later media provenance received its own explicit registry and terminal decisions. | content authority + media provenance themes |
| TLP-COMM-001 | absorbed-by-system-fix | Community state moved to target-scoped reads, bounded persistence and stable recovery. | `ST-TLP-COMMUNITY-OWNERSHIP` |
| TLP-PERF-001 | absorbed-by-system-fix | Route-owned measured budgets and build reports now protect the performance boundary. | `ST-TLP-WORKFLOW-PERFORMANCE` |
| TLP-CI-001 | absorbed-by-system-fix | Shared workflow primitives and measured gates removed duplicated CI ownership. | `ST-TLP-WORKFLOW-PERFORMANCE` |
| TLP-QA-001 | absorbed-by-system-fix | Cross-browser reader certification and observable readiness became permanent witnesses. | `ST-TLP-READER-OUTCOMES` |
| TLP-CLEAN-001 | closed-by-fix | Physical ref retirement completed; current Product branches are `main` plus the intentional forensic archive only. | closure ledger W6; `ST-TLP-BRANCH-EVIDENCE-LIFECYCLE` |
| TLP-GOV-001 | closed-by-fix | Private package identity, Node range, `UNLICENSED` boundary and exact-SHA release authority are enforced. | `ST-TLP-RELEASE-GOVERNANCE` |

## Post-matrix findings that are already historical

The 2026-08-05 matrix predates several later waves. These are **not** re-added as active rows because they are already closed:

- `TLP-SCROLL-001` — closed by Product PR #334; native wheel/trackpad/touch ownership restored.
- `TLP-AUDIT-STYLE-001` — closed by PR #334; exact prose requirement replaced with semantic boundaries.
- `TLP-AUDIT-SCROLL-001` — closed by PR #334; validator no longer requires the global scroll mechanism behind the defect.
- `TLP-POET-001` — closed by Product PR #336; canonical poet modules directly own reader-facing portrait prose.
- `TLP-AUDIT-STYLE-002` — closed by PR #336; semantic witness matching tolerates bounded grammatical variation while preserving negation.
- Mayakovsky C01–C30 media family — terminally classified for current scope: 5 active, 1 reserve, 24 excluded, 0 unresolved.

## New current rows

Only two verified engineering rows remain after the consolidation:

1. `TLP-DEPS-001` → Product #335 — unused install-only Lenis dependency cleanup.
2. `TLP-AUDIT-003` → Product #340 — bounded hardening of remaining source-literal runtime/app-shell guards.

Research, source acquisition, long-form authoring, image-rights/editorial decisions and myth-ledger work remain outside the engineering bug matrix unless a concrete engineering defect is independently verified.

## Evidence rule

Nothing in this cleanup deletes raw evidence or rewrites historical anchors. The old matrix is preserved byte-for-content under `archive/superseded/`; active guidance is simply reduced to current verified work.
