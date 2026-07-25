# CURRENT HEAD REVERIFY — 2026-07-25 — `9407cc92` counter integrity + homepage residual

## Boundary

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Exact source main: `9407cc92eb22dc6eab76f831df35a09429663e3e`
- Exact imported production authority: `f5e29998c5b42cc9e4e7c917b1e1c1072aa52320`
- AuditRepo base before this follow-up: `7ae396dae5a45a4c9f9b50ed3d190264de8c64da`

This witness does not advance source or production. It reconciles one reopened browser-evidence residual and repairs AuditRepo's own counter authority.

## Homepage browser-contract boundary

PR #338 / `31758828` remains accepted as the broad production-like Chromium/WebKit/no-JS homepage contract. It covers menu focus and cleanup, baseline BFCache handling, canonical shortcuts, lazy Pagefind initialization, Hebrew interaction, progress/back-to-top basics, reduced motion, overflow and no-JS reachability.

Issue #299 is nevertheless reopened for narrower evidence that #338 did not fully prove. Active PR #361 owns exactly:

- real same-origin `/ → /about/ → Back` history traversal;
- `pagehide.persisted=true` and `pageshow.persisted=true` restoration cleanup;
- exactly one post-restore menu transition;
- stable theme attribute and storage state;
- independent canonical Meta+K activation;
- Ctrl/Meta+K isolation in input, textarea, `role=textbox`, contenteditable and IME composition;
- back-to-top appearance and disappearance across the threshold.

PR #361 is test-only and owns only `.github/workflows/interactive-audit.yml` plus `scripts/home-browser-lifecycle-contract.mjs`. The residual is registered as P1 without reopening unrelated homepage architecture.

## AuditRepo counter defect

At AuditRepo `main@7ae396da`, the canonical fixed section heading was `160`, but the bottom statistics table still said `156` and retained an old source label. Both values were human-maintained and AuditRepo Validate did not compare them.

Permanent repair:

- compare fixed, P1, P2 and P3 section headings with their summary rows;
- require every expected summary counter;
- recompute total open as P0 + P1 + P2 + P3 + Refactoring + AuditRepo;
- fail closed when the arithmetic or any mirrored counter diverges;
- skip projects that do not own a `verified/MASTER_BUG_MATRIX.md`;
- black-box fixtures prove a mismatched fixed count and a mismatched total are rejected, then prove the restored matrix passes.

## Canonical counters after reconciliation

- fixed: `160`;
- P0: `0`;
- P1: `101` after registering `HOME-BROWSER-LIFECYCLE-RESIDUAL`;
- P2: `36`;
- P3: `51`;
- refactoring: `4`;
- AuditRepo: `4`;
- total open: `196`.

Research issue #16 remains closed by the existing `RESEARCH-AUTHORITY-MANIFEST-MISSING` row. No duplicate Genesis provenance row is introduced.

## Production boundary

Exact production authority remains `f5e29998` only. Source `9407cc92` has no imported same-SHA readiness, Pages promotion or live witness. Homepage residual evidence and Research provenance CI are not deployment evidence.

## Acceptance

- keep the broad #338 homepage contract closed;
- register only the reopened #299 residual as P1 under #361;
- repair summary counters without changing fixed/P2/P3 classifications;
- permanently block future counter divergence;
- retain production authority at `f5e29998`.
