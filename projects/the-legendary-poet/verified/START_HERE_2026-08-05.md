# Verified current truth — The Legendary Poet

## Status

`active / marathon repair wave closed`

## Source identity

- Repository: `FedorMilovanov/TheLegendaryPoet`
- Merged PR: `#286`
- Production `main`: `e06d75970cf1262f4dab5bfd941e45328f07f747`
- Exact pre-merge tested head: `25cfa99e7b20af4d1c78b3ed1c7fd219878f8a81`
- Closed on: `2026-08-05`

## Closed findings

1. Technical audit/provenance vocabulary no longer leaks into ordinary reader copy; archival descriptions state their evidence boundary.
2. Citations have stable ordering, accessible interaction and bibliography targets.
3. Search uses generated lightweight metadata instead of bundling longform essays into startup code.
4. One lazy route registry is authoritative; dead duplicate article/route architecture was removed.
5. Browser-storage denial degrades persistence without breaking rendering.
6. Tilt uses a stable hit surface, transform-only inner plane and capability-correct browser tests.
7. The dependency graph uses direct `react-router 8.3.0`, React 19.2.8 and Vite 7.3.6; committed production/full audits are zero.
8. The Yesenin Part I acceptance contract verifies complete rendered statements after normalizing only typographic whitespace.

## Verification result

Every required PR workflow succeeded on exact head `25cfa99e7b20af4d1c78b3ed1c7fd219878f8a81`. Manual Browser QA completed all four jobs successfully. Pages deployment was skipped by its PR-event condition and is not a failed gate.

## Metrics

- Startup entry: approximately `650.92 KiB`.
- Enforced entry ceiling: `700 KiB`.
- Rejected Arena regression: approximately `1,135 KiB`.
- Live lazy routes checked: `14`.
- Yesenin Part I unique citation targets checked: `64`.
- Committed production/full audit findings: `0`.

## Historical boundaries

- Arena branches are evidence inputs, not independent production truth.
- AuditRepo PR `#135` was closed without merged file changes and its percentage is not authoritative.
- The source-library package from AuditRepo PR `#104` remains valid and separate from this repair closure.

## Non-blocking follow-up

The browser workflow may later replace its temporary Playwright `1.54.1` runtime with the repository-selected line. Because that runtime is installed with `--no-save --no-package-lock`, it is workflow-harness debt rather than shipped application debt.

## Evidence map

- Raw synthesis: `../incoming/gpt-5-6-marathon-audit/2026-08-05/REPORT.md`
- Promotion verification: `../verification/START_HERE_2026-08-05.md`
- Exact HEAD reverify: `../reverify/REVERIFY_e06d759_2026-08-05.md`
