# Post-#1254 Product main ancestry / discovery closure / downstream unblock — 2026-08-08

## Exact Product main

Current verified Product main:

`7dd0c2fda74cd52afebf0ca3e20c710f936a961f`

Commit title:

`fix(discovery): reconcile existing manifest rows from PageHead authority (#1254)`

#1254 was merged only after final exact head `b173467776751220231d0177801e6a41cb1f9201` had terminal-success applicable PR CI, current-main ancestry, no review threads, and the expected six-file final diff.

## Important ancestry observation

The merge API was invoked with squash semantics, but the resulting Product history is not a one-commit squash from prior `main@7fdd3b0b...`.

Direct compare:

`7fdd3b0bcbc6eb52651abba082885c8b42c5f7be..7dd0c2fda74cd52afebf0ca3e20c710f936a961f`

reports:

- `ahead_by=18`;
- `behind_by=0`;
- merge-base exactly `7fdd3b0b...`.

The **final tree delta is nevertheless exactly the six approved discovery files**:

- `.github/workflows/search-manifest-policy.yml`;
- `scripts/search-manifest-policy-normalizer.js`;
- `scripts/search-manifest-policy-normalizer-test.js`;
- `data/search-manifest.json`;
- `feed.xml`;
- `data/scripture-search-index.json`.

Therefore current-main branches based on `7fdd3b0b...` now appear roughly 18 commits behind even when they have no semantic collision with discovery. Treat this as ancestry expansion, not as 18 new independent Product mutations.

Do **not** rewrite Product main history to cosmetically repair this. Future active branches should absorb current main through the established merge-only transport/replay process and then be judged by net semantic diff + exact-head CI.

## Temporary-workflow history vs current-tree safety

Because the #1254 ancestry was preserved, historical commits reachable from main include the temporary branch-scoped Scripture projector:

- added at `4d4e0b660d3006f78b1256001241ffa4096556ae`;
- removed at `f201aa5637ad39fd600f5db7c2a2b5df010bd4c0`.

Historical workflow path:

`.github/workflows/tmp-search1254-scripture-index-projection.yml`

Current `main@7dd0c2fd...` direct fetch is 404. The workflow does **not** survive in the current tree. It is therefore historical evidence, not an active writer/control-plane surface.

Additional current-tree hygiene remains clean:

- `astro.config.dev.mjs` — 404;
- `.github/workflows/arena-release-quote-inset-fix.yml` — 404.

No force/reset/history rewrite is authorized or needed.

## Discovery disposition

`SEARCH-MANIFEST-EXISTING-ROW-RECONCILIATION` / issue #1252 is now Product-main material.

Current main contains:

- deterministic existing-row reconciliation for the verified authority subset;
- preservation of editor/tags/dates/priority/scripture and other cross-owner fields;
- materialized `data/search-manifest.json` and `feed.xml`;
- canonical regenerated `data/scripture-search-index.json`;
- permanent read-only drift gate and source trigger closure.

The final exact-head proof before merge included:

- Search Manifest Policy SUCCESS with existing-row drift = 0;
- generatedAt unchanged;
- strict route policy 83/83 / 0 problems;
- Scripture occurrence contract/runtime SUCCESS;
- Search modal/SearchAction/Scripture suggestion SUCCESS;
- Shared Files, Node, Metadata, Deploy Candidate, Visual Parity SUCCESS;
- Route Registry registry/Chromium/WebKit/browser-matrix all SUCCESS.

Do not keep #1254 as active work in MASTER.

## Downstream catalog #1221 is now unblocked — but old branch is not mergeable as-is

Current #1221 old branch `0c779df113b5716a200bda023d356ef33cdade22` compared with `main@7dd0c2fd...` is:

- `ahead=7`;
- `behind=27`;
- merge-base `1f14761a...`;
- net catalog diff still six files.

The key collision is `data/scripture-search-index.json`: current main now owns a newer derived index after #1254, while #1221 carries an older derivative generated from its old pre-#1254 source graph.

Do not merge or copy that old JSON blob into current main.

Preferred successor shape after the pre-merge Editorial freeze guard (#1278) lands:

1. branch from then-current main;
2. selectively recover the five catalog source/audit changes from #1221, excluding the stale generated Scripture JSON;
3. run the existing canonical Scripture occurrence writer against that final source graph;
4. include only its deterministic resulting index projection;
5. require fresh Search/Scripture/Gill/catalog/static-publication/browser evidence.

This preserves one writer and avoids a conflict-resolution hand edit of generated JSON.

## New-row discovery follow-up

Issue #1261 (`author/editor authority for newly created manifest rows`) remains valid and intentionally outside merged #1254.

Do not start its writer-layer mutation until the #1254 merge is treated as the new baseline and pre-merge Editorial date-freeze guard #1278 is settled.

## Pre-merge Editorial freeze #1278

#1278 was technically ready on prior `main@7fdd3b0b...` but became stale when #1254 merged.

A merge-only transport #1281 has now absorbed exact `main@7dd0c2fd...` into the #1278 feature branch.

Current #1278 head after transport:

`74766003757b6537ed0abd10fed6c75318542183`

Final semantic diff remains exactly two files:

- `.github/workflows/deploy-candidate-contract.yml`;
- `scripts/workflow-linkage-regression-test.js`.

Fresh exact-head CI has restarted. Do not transfer the predecessor green; require the new candidate to build current discovery main and then pass the same read-only Editorial Metadata freeze.

## MASTER reconciliation delta

When the next MASTER refresh is performed:

- Product anchor moves to `7dd0c2fd...` or newer;
- #1254/#1252 are removed from active work;
- #1221 changes from “blocked by dirty discovery source” to “downstream successor required because old branch carries stale generated Scripture projection”;
- #1261 remains a separate future writer-layer root;
- #1278 remains active until its new exact-head current-main CI completes and it lands;
- current Strangler truthful raw count remains 20 until #1279 lands (its current exact head independently proves 19 but is not yet Product main).
