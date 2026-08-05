# TTS Deep Current-Head Audit — Closure

## Disposition

**CLOSED / FIXED-CURRENT / PRODUCTION-LIVE VERIFIED.**

The immutable baseline and original evidence remain in `REPORT.md`. This document records the completed implementation and deployment chain.

## Product implementation chain

- Baseline audit: Product PR #875.
- Core TTS/Vosk implementation: PR #876, merge `0d60315d37efd5b47c76795f8167e99398a5b7e3`.
- Final mobile PlayEmber long-press repair and permanent canonical Gill PR gate: PR #929, merge `e63dbf7d2a925501587df81ff5fb84b816e4e95f`.
- Production-deployed descendant: `38b257030afb7cfa8a7b1128f8c86539fd36dec0`.

The core implementation moved model acquisition, integrity verification, archive extraction, IndexedDB persistence, ORT session creation and inference into the worker boundary. SharedWorker-first ownership provides one shared model/session owner with deterministic follower reuse; the bounded dedicated-worker fallback is retained. Real-model validation recorded a maximum UI gap of **32.7 ms**, exactly one acquisition and follower/shared reuse. All 19 core workflow groups passed.

The final PlayEmber repair consumes exactly one browser-generated trailing click after a confirmed touch/pen long-press stop. The unchanged `gill:mobile-play:smoke` is now a permanent TTS PR gate and passed on the final exact head and in production readiness.

## Exact production authority

- Workflow: `Deploy to GitHub Pages`
- Run: `30960174778`, attempt `1`
- Release/control SHA: `38b257030afb7cfa8a7b1128f8c86539fd36dec0`
- Readiness job: `92162173520` — success
- Promotion job: `92165278471` — success
- Candidate ID: `38b257030afb7cfa8a7b1128f8c86539fd36dec0:30960174778-1`
- Candidate digest: `sha256:973369f7753f89b9a4fae4d19f523f89aa2a50808a0d11cbe8448e79b793c9ef`
- Candidate size/files: `85,278,223` bytes / `1,179` files
- Immutable manifest: `/deployments/38b257030afb7cfa8a7b1128f8c86539fd36dec0/30960174778-1.json`
- Transport artifact: `8912983035` / `sha256:e7784d18a33e256da4da52a2d0d0a46d5587fb5c6659602047c6be7d8b71108e`

Readiness passed the full source/build/runtime barrier, the unchanged Gill mobile TOC and PlayEmber smoke, provenance generation, candidate verification and upload. Promotion passed same-run candidate identity, Pages deployment, the generic live release contract and the live TTS capability extension.

## Live evidence

- Generic live evidence artifact: `8912993840` — PASS.
- TTS live evidence artifact: `8912994737` — PASS.
- Live TTS witness routes: `/articles/dzhon-gill-chast-1-chelovek/` and `/articles/20-antisovetov-pastoru/`.
- Versioned controller, engine, worker and notice CSS were discovered from live routes and matched their deployed hashes.
- CSP `connect-src`, `media-src` and `worker-src` boundaries passed.
- Deployed service worker passed with `lazyTtsPrecache: false`.

## Canonical matrix disposition

Close exactly these P2 rows:

1. `TTS-DL-UNZIP-SYNC`;
2. `TTS-DL-NO-TABLOCK`.

Canonical arithmetic after this transaction: **371 total = 225 closed + 146 open**; P2 open becomes **30**.

## Issue boundary

- Product deploy lifecycle #474 recovered and is closed with exact run evidence.
- Product umbrella #61 remains open for independent non-TTS ReaderProjection/speakable-search policy, inactive speed/search accessibility exposure and roving keyboard model, popup semantics, and canonical save metadata/store work.
