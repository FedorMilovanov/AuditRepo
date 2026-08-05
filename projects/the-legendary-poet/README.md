# the-legendary-poet

- Source repo: `FedorMilovanov/TheLegendaryPoet`
- Production URL: https://thelegendarypoet.ru
- Main branch: `main`
- Current verified source SHA: `19598947c20cd2dd94abd232fbf6fb8a05c3575a`
- Current status: `active`
- Latest closed wave: `2026-08-05 locked Playwright runtime`

## Start here

- Latest verified runtime closure: [`verified/PLAYWRIGHT_RUNTIME_LOCK_2026-08-05.md`](verified/PLAYWRIGHT_RUNTIME_LOCK_2026-08-05.md)
- Latest promotion verification: [`verification/PLAYWRIGHT_RUNTIME_LOCK_2026-08-05.md`](verification/PLAYWRIGHT_RUNTIME_LOCK_2026-08-05.md)
- Latest exact source-HEAD proof: [`reverify/REVERIFY_1959894_2026-08-05.md`](reverify/REVERIFY_1959894_2026-08-05.md)
- Raw runtime report: [`incoming/gpt-5-6-playwright-runtime/2026-08-05/REPORT.md`](incoming/gpt-5-6-playwright-runtime/2026-08-05/REPORT.md)
- Previous verified marathon closure: [`verified/START_HERE_2026-08-05.md`](verified/START_HERE_2026-08-05.md)
- Previous exact source proof: [`reverify/REVERIFY_e06d759_2026-08-05.md`](reverify/REVERIFY_e06d759_2026-08-05.md)
- Raw marathon synthesis: [`incoming/gpt-5-6-marathon-audit/2026-08-05/REPORT.md`](incoming/gpt-5-6-marathon-audit/2026-08-05/REPORT.md)
- Governed source-library intake: [`incoming/gpt-5-6-source-library/2026-07-30/REPORT.md`](incoming/gpt-5-6-source-library/2026-07-30/REPORT.md)

## Current truth

Source PR `FedorMilovanov/TheLegendaryPoet#302` closed the browser-harness dependency drift left as non-blocking debt by the preceding marathon repair wave. It passed the exact-head matrix on `40eba88a027d6d78dd04ac0dcefb8272d888063f` and was squash-merged into production `main@19598947c20cd2dd94abd232fbf6fb8a05c3575a`.

The browser test runner is now an exact committed dependency (`@playwright/test 1.61.1`). Six browser workflows use the same lockfile through `npm ci`, install only browser binaries through the locked CLI, and are guarded by `validate:browser-runtime` in the repository-wide check chain.

The earlier verified repair wave remains authoritative for reader-facing source honesty, citation UX, lightweight search, route/dead-code cleanup, safe browser storage and compositor-stable pointer interaction.

## Folder meaning

- `incoming/` — raw agent reports and immutable evidence inputs
- `working/` — synthesis in progress
- `verification/` — promotion and cross-reference decisions
- `verified/` — compact confirmed current truth
- `repairs/` — implementation tracking when a wave is open
- `reverify/` — exact source-HEAD proof after implementation
- `archive/` — historical, stale or superseded snapshots

## Status rule

This project remains `active`. Change it to `reverify-needed` only when the source repository moves beyond the pinned SHA in a way that touches the verified surfaces or when a verified gate becomes red.
