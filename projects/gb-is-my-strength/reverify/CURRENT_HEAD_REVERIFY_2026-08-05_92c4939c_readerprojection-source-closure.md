# CURRENT HEAD REVERIFY — ReaderProjection source closure

**Date:** 2026-08-05  
**AuditRepo base before this transaction:** `077fe1445d274b02e96abdb9dbc41ebf405c4992`  
**Historical intake authority:** AuditRepo PR #169 / merge `cc180c5632fa12b25c035ac5abd2bfb6097316a1`  
**Product final tested head:** `fdc3a90e9f4b8728698fd4d21f2afae3880f8525`  
**Product squash merge / current source:** `92c4939c62bda365c1531c31d150c3988d8cfa47`  
**Product production authority remains:** `38b257030afb7cfa8a7b1128f8c86539fd36dec0`

## Scope and authority

The immutable intake `incoming/reader-controls-current-head-audit-2026-08-05/` classified two confirmed-current source clusters for one dedicated Product SYSTEM lane:

1. no shared ReaderProjection API/policy owner;
2. divergent implicit inventories for TTS, speakable metadata, summary/search/print and current-section consumers.

The intake did not create a canonical matrix row or authorize a production claim. It also kept controls accessibility, popup/radiogroup semantics and favorites metadata/store as independent boundaries.

## Product transaction

Product PR #990 established the canonical `GBReaderProjection` semantic owner in one bounded replay commit:

- exact base `5e690ae799c032e54a7a9ddd757ea812a497e2da`;
- exact final head `fdc3a90e9f4b8728698fd4d21f2afae3880f8525`;
- one commit, six files, `+1261/-0`, ahead `1`, behind `0` before merge;
- guarded squash merge used the exact expected head and produced `92c4939c62bda365c1531c31d150c3988d8cfa47`.

The six merged blobs exactly equal the tested final-head blobs:

| Path | Blob SHA |
|---|---|
| `.github/workflows/reader-projection.yml` | `722de01c3887004be48307db51c7b93d81194a86` |
| `scripts/reader-projection-browser-contract.mjs` | `75fda2ba80b4510e111c1c5836635a9f2b59aad1` |
| `scripts/reader-projection-source-contract.mjs` | `c94227330e59ed2d3b06f1ce97dffc1cf1b1cc51` |
| `scripts/reader-projection-tooltip-handoff-contract.mjs` | `deff7d9d6e0cda9050f3383bb3889d9a42532205` |
| `src/components/reader-platform/ReaderActionsRuntime.astro` | `77e440ce33d7ebd7a829ee1fd7f583b175c640fb` |
| `src/runtime/reader-projection.js` | `369b3238a2a6b67b742ba5874763d45249447df9` |

## Exact-head evidence

All 15 triggered Product workflow groups reached terminal `success` on exact final head `fdc3a90e9f4b8728698fd4d21f2afae3880f8525`.

### Reader Projection Contract

- run `31008123138`;
- job `92313063354`;
- exact commit identity: PASS;
- source contract: **68/68 PASS**;
- production-like build: PASS;
- browser contract: **144/144 PASS** across Hermenevtika, Gill and Antisovetov desktop/mobile;
- tooltip handoff contract: **19/19 PASS** at the exact Runtime Interactive viewport `1280×850`;
- artifact `reader-projection-31008123138`, ID `8931327913`;
- digest `sha256:2132049535f2f01788b63e3fcee0d3b0ce5edef766158d19d0c49b41b5d5d596`.

The handoff contract proves both sides of the semantic-mutation boundary: tooltip/comment/UI-owned subtree movement produces no projection refresh, while a real semantic `<p>` addition still refreshes and enters the projection.

### Runtime and surrounding gates

Runtime Interactive Audit run `31008123595` passed both jobs:

- Home Chromium/WebKit contract: PASS;
- full `interactive-audit`: PASS with durable evidence;
- artifact `runtime-interactive-audit-31008123595-1`, ID `8931715596`;
- digest `sha256:ad88586ec84c1fb20b3a6519041b337daf71e2ba42a00a9d38b88fef41be0747`.

Visual Parity, TTS Reader Polish, TTS Download Consent, Print Paper, Native Source, Reader Controls Accessibility, Glossary, Metadata, Shared Files, Scripture Occurrence Index, Editorial Dateline, Node Toolchain and Deploy Candidate also passed on the same final head.

## Disposition

| Intake cluster | Current disposition | Evidence class |
|---|---|---|
| Shared ReaderProjection API/policy | **FIXED-CURRENT** | `MERGED-SOURCE+CHROMIUM+CI VERIFIED` |
| TTS vs speakable/summary/search/print/current-section convergence | **FIXED-CURRENT** | `MERGED-SOURCE+CHROMIUM+CI VERIFIED` |

No matrix arithmetic changes: these were intake clusters without canonical matrix IDs. Canonical totals remain **371 = 226 closed + 145 open**.

Product umbrella #61 remains open only for independent still-applicable controls/accessibility, popup/radiogroup and favorites metadata/store scopes. The ReaderProjection source lane is closed and must not be reopened without new exact-current evidence.

## Branch lifecycle

- the canonical Product branch was automatically deleted by GitHub after merge;
- the historical transport ref was content-disposed to merged source `92c4939c62bda365c1531c31d150c3988d8cfa47`;
- compare against merged source is ahead `0`, behind `0`, files `0`;
- no unique orphaned ReaderProjection branch content remains.

## Production boundary

This document records **merged source and exact-head CI/browser closure only**. It does not advance the exact production authority and does not claim that Product `92c4939c62bda365c1531c31d150c3988d8cfa47` is live. Production remains anchored at `38b257030afb7cfa8a7b1128f8c86539fd36dec0` until a separate exact deployment/live witness is imported.