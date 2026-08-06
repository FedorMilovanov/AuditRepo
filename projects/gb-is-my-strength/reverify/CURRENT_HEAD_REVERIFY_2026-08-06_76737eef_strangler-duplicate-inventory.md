# CURRENT HEAD REVERIFY — recursive strangler duplicate inventory

**Date:** 2026-08-06  
**AuditRepo base:** `058c952fee0a0c5fffdca1e4175bbd6a669043d1`  
**Product source before lane:** `3d907194d81eee1227a4fc9ad6f037773d19a1ec`  
**Product exact tested head:** `e15afda5681ce4e2f0a713e6e7f0ca2afbb0efae`  
**Product merged source:** `76737eefe16a0feb2fdf729c805d17b5cdcdc376` (PR #1082)  
**Production authority:** unchanged — `38b257030afb7cfa8a7b1128f8c86539fd36dec0`, run `30960174778` attempt `1`

## Question

Replace the stale approximate `50/53` strangler-duplicate claim with a deterministic current-source inventory, while preserving the distinction between removable duplication and active reference/built-app ownership.

## Product implementation

Product PR #1082 adds `scripts/strangler-duplicate-inventory.mjs` and invokes it inside the existing Shared Files Guard step `Legacy reference inventory and explicit path API`.

The inventory:

- scans only current public route roots recursively;
- derives ownership exclusively from `migration/page-ownership.json`;
- classifies Astro shadows separately from explicit `built-app` / `copy-as-built-asset` ownership;
- recognises descendants of an independently owned built app;
- reports unowned public indexes without making count thresholds blocking;
- records path, route, byte size and SHA-256 for every discovered `index.html`;
- states explicitly that inventory is not deletion authority.

No second route registry, Product UI/runtime change, Search change, TTS/Vosk change, file deletion or deployment claim was introduced.

## Exact inventory

Exact head `e15afda5681ce4e2f0a713e6e7f0ca2afbb0efae` produced:

- public `index.html`: **52**;
- Astro-owned `native-shadow`: **51 files / 4,026,027 bytes**;
- explicit `owned-independent` built app: **1 file / 2,245,854 bytes**;
- unowned public indexes: **0**.

The independent file is:

- `/konfessii/russkij-baptizm/_app/` → `konfessii/russkij-baptizm/_app/index.html`;
- owner `built-app`;
- status `copy-as-built-asset`;
- SHA-256 `d2aa17b168b7c10e08497097bc6dc4d4a06866b5077fb05112bdde2b37ab74bd`.

Artifact `8953474789`, digest `sha256:721c63f3cc545a749c6ce8659a467a346e18342bafcdc9436232daeb9b7163d0` retains JSON and Markdown reports.

## Retirement disposition

The **51 Astro shadows are not currently deletion-ready**. Current `scripts/legacy-shadow-wrapper-audit.js` dynamically discovers every production-dist Astro route that still has a committed legacy `index.html` and uses that file to verify:

- canonical URL;
- title, description and H1 presence;
- noindex disposition parity;
- route-specific structure markers;
- retained reader-text ratio.

Therefore a direct deletion would remove an active evidence source and weaken current parity coverage. The next bounded retirement lane must first move the applicable parity/reference authority to another immutable owner for one route or one tightly related route family, prove equivalent source/dist/browser evidence, and only then remove the legacy shadow.

## Exact-head witnesses

On Product exact head `e15afda5681ce4e2f0a713e6e7f0ca2afbb0efae`:

- Shared Files Guard run `31064874211`: success;
- Node Toolchain Contract run `31064874215`: success;
- Metadata & IndexNow Readiness run `31064874238`: success;
- inventory self-test: native-shadow, built-app, built-app descendant and unowned classification cases passed;
- artifact `8953474789` uploaded successfully.

## Canonical disposition

- `R-007` remains **open**, now measured and repair-ready rather than approximate.
- `STRANGLER-HYGIENE` remains **open**, narrowed from `50/53` to the exact current `51/52` reference-shadow boundary.
- Canonical arithmetic remains **376 total = 231 closed + 145 open**.
- Product source anchor advances to `76737eefe16a0feb2fdf729c805d17b5cdcdc376`.
- Production authority remains unchanged.
