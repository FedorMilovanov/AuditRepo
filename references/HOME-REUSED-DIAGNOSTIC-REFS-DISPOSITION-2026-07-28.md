# Reused homepage diagnostic refs disposition — 2026-07-28

## Scope

Repository: `FedorMilovanov/gb-is-my-strength`  
Refs:

- `fix/home-browser-process-isolation-20260726`;
- `temp/webkit-bfcache-control-20260726`.

Current site main inspected: `b40044713b9fa09e404d5f57b2016d31f4cc88c6`.

## Historical diagnostic authority

The branch names were originally used by two closed, unmerged diagnostic PRs:

### PR #402 — process isolation

- exact diagnostic head: `a21690ef04a2a730a0fdf2cf98575667cadf829f`;
- result: moving Chromium and WebKit lifecycle runs into separate Node processes did not change WebKit `persisted:false`;
- preserved at `archive/forensic-home-browser-process-isolation-pr402-20260726` and in `archive/forensic-home-lifecycle-bfcache-histories-20260728`.

### PR #404 — minimal WebKit BFCache control

- exact diagnostic head: `7bfc0fc82346ad293e9b1a4f4131b950155a830f`;
- result: the minimal two-page control demonstrated Chromium BFCache capability while the tested WebKit OS/headless/persistent/cache-policy matrix did not;
- preserved at `archive/forensic-webkit-bfcache-control-pr404-20260726` and in the combined homepage lifecycle anchor.

The mutable branch names are no longer required to preserve either diagnostic state.

## Current ref state

Both current refs resolve to the same governance commit:

- `0f7cefbb20abb17c65872e53c00c733c480f2a97`;
- `docs(governance): preserve agent work with durable checkpoints (#484)`.

Direct comparisons against current site main prove for each ref:

- merge base: `0f7cefbb20abb17c65872e53c00c733c480f2a97`;
- branch-only commits: **0**;
- main-only commits: **3**;
- relationship: direct ancestor / ordinary fast-forward.

The three later commits are governance successors. Neither current ref contains unique process-isolation, BFCache-control, product, publication or evidence content.

## Disposition

`HISTORICAL_DIAGNOSTIC_HEADS_FORENSICALLY_PRESERVED / CURRENT_REFS_ANCESTORS_OF_MAIN / NON_FORCE_FAST_FORWARD_ALLOWED`

After this disposition is merged and the exact ref/main pair is rechecked, the following operations are authorized:

1. fast-forward `fix/home-browser-process-isolation-20260726` to the then-current site main with `force:false`;
2. fast-forward `temp/webkit-bfcache-control-20260726` to the then-current site main with `force:false`.

## Boundaries

- do not delete either branch;
- do not merge the historical diagnostic PRs;
- do not infer current WebKit capability from ref movement;
- do not create a product or deployment commit;
- do not remove the dedicated forensic archives.

The operation only closes drift in two reused mutable branch names after immutable preservation of the actual diagnostic heads.