# CURRENT HEAD REVERIFY — Favorite Store source closure

**Date:** 2026-08-05  
**AuditRepo base before this transaction:** `be03e27e61b6169e518f7b91978abaf48e29baa4`  
**Product final tested head:** `845ad48409fc3c8a2fa7056f4b84e005e652318e`  
**Product squash merge / current source:** `d0647b71b557c17e408c09712fcd8c3ab05ba257`  
**Product production authority remains:** `38b257030afb7cfa8a7b1128f8c86539fd36dec0`

## Scope and authority

Product umbrella #61 kept favorites metadata/store as an independent boundary after the ReaderProjection lane. The confirmed source defect was that save payloads and consumers did not share one canonical route-metadata and persistence owner: legacy code could scrape breadcrumb presentation, direct consumers owned storage independently, accessible labels could drift from pressed state, and unsafe legacy image data was not fail-closed.

This reverify records merged source plus exact-head source/build/browser/CI evidence. It does not import a same-SHA deployment witness and does not advance production authority.

## Product transaction

The original Product PR #1040 was closed unmerged after branch contamination. Its isolated canonical successor PR #1061 landed the bounded Favorite Store repair:

- exact base / rollback `054cade3b22e2dc880329c73a65436739092b4f2`;
- exact final head `845ad48409fc3c8a2fa7056f4b84e005e652318e`;
- one commit, 49 files, ahead `1`, behind `0` before merge;
- 9 functional owners, 35 governed asset-revision projections and 5 immutable legacy-reference ledger owners;
- squash merge `d0647b71b557c17e408c09712fcd8c3ab05ba257`.

The full pre-merge and merged repository trees are byte-identical:

- exact tested-head tree: `50867ca6fed0033efc2784dee8a969c22481f0a5`;
- merged-main tree: `50867ca6fed0033efc2784dee8a969c22481f0a5`.

Therefore all 49 changed blobs, plus every unchanged repository path, equal the exact tested final head.

## Delivered ownership

`window.GBFavoriteStore` v1 now owns:

- storage key `gb-favorites` and versioned item schema;
- canonical route metadata, type, category, section and route id;
- safe same-origin path and constrained image normalization;
- legacy array / `{ items }` migration, deduplication and 50-item cap;
- fail-closed unsafe legacy image migration;
- add/remove/toggle/clear/list/get/has, subscriptions and cross-tab synchronization;
- `gb:favorites-changed` / `gb:favorite-store-ready` events and Astro/pageshow lifecycle;
- synchronized class, `aria-pressed`, truthful `aria-label` and explicit favorite state for all save surfaces.

Home and `/izbrannoe/` consume the shared API without direct favorite localStorage ownership. The historical `window.__gbCluster.setSaved(Boolean)` surface remains only as a thin compatibility adapter delegating to `GBFavoriteStore.add/remove/syncButtons`. The canonical controller asset revision is `7b33c8e6`.

All 52 immutable legacy-reference entries were synchronized to exact Product tree `c7ea1302bd77bff3da493b7e2d8018381eb10a9c`.

## Exact-head evidence

All 25 applicable Product workflow groups reached terminal `success` on exact final head `845ad48409fc3c8a2fa7056f4b84e005e652318e`.

### Favorite Store Contract

- run `31037316037`;
- job `92412574991`;
- exact commit identity: PASS;
- source contract: **65/65 PASS**;
- production-like build: PASS;
- Chromium contract: **138/138 PASS** across 8 cases;
- unsafe-image migration, cross-tab synchronization and zero page errors: PASS;
- artifact `favorite-store-31037316037`, ID `8943367668`;
- digest `sha256:c15e92c25bfc127cac2824ac5aa679be383e3bb916e3d9fa3dfa9bd385822628`.

### Reader Projection and runtime regression barriers

Reader Projection run `31037315367` passed:

- source **68/68**;
- browser **144/144**;
- tooltip handoff **19/19**;
- zero uncaught page errors;
- artifact ID `8943352027`.

Runtime Interactive run `31037316184` passed both jobs:

- Home Chromium/WebKit contract: PASS;
- full `interactive-audit`: PASS;
- full artifact `8943966044`, digest `sha256:529375d76ddf5ba4fabf1ef65e824e277cf9873aff73c3856a3077569c691022`;
- Home artifact `8943730639`, digest `sha256:386283a9873be6f5d68a52f0bf5810b303effb06347978e38827f4886a44b9ba`.

Metadata & IndexNow confirmed read-only synchronized revision `7b33c8e6` and a clean tracked tree. Shared Files Guard, Route Registry Chromium/WebKit matrices, Visual Parity, Overlay Runtime, TTS Reader Polish, TTS Download Consent, Native Source, Source Authority, Print Paper, Search, Scripture, NoteRegistry, Editorial, Node and all remaining exact-head groups passed.

## Disposition

| Intake cluster | Current disposition | Evidence class |
|---|---|---|
| Canonical favorite metadata/store ownership | **FIXED-CURRENT** | `MERGED-SOURCE+CHROMIUM+CI VERIFIED` |
| Save-surface state/label synchronization | **FIXED-CURRENT** | `MERGED-SOURCE+CHROMIUM+CI VERIFIED` |
| Unsafe legacy favorite image migration | **FIXED-CURRENT** | `MERGED-SOURCE+CHROMIUM+CI VERIFIED` |

These were intake/umbrella clusters without canonical matrix IDs. Matrix arithmetic does not change and remains **371 = 226 closed + 145 open**.

Product umbrella #61 remains open only for independently reverified controls/accessibility and popup/radiogroup semantics. The favorites metadata/store boundary is closed and must not be reopened without new exact-current evidence.

## Branch lifecycle

- the canonical Product branch `agent/favorite-store-replay-clean-20260805` was automatically deleted after merge;
- the superseded Product PR #1040 was closed unmerged;
- temporary publisher and replay files are absent from merged source;
- no unique orphaned Favorite Store branch content remains.

## Production boundary

This document records **merged source and exact-head CI/browser closure only**. The GitHub connector exposed no push-triggered workflow list for merge commit `d0647b71b557c17e408c09712fcd8c3ab05ba257`, and no commit statuses were returned. No live/deployment claim is made. Production remains anchored at `38b257030afb7cfa8a7b1128f8c86539fd36dec0` until a separate exact deployment/live witness is imported.
