# Current-Head Reverify — TTS Production Closure

- Project: `gb-is-my-strength`
- Date: 2026-08-05
- AuditRepo base incorporated: `75f6aa9a11fa46c02bfe03272f52dec5f5eead15`
- Product deployed source/control SHA: `38b257030afb7cfa8a7b1128f8c86539fd36dec0`
- Core TTS merge: `0d60315d37efd5b47c76795f8167e99398a5b7e3` (PR #876)
- Final PlayEmber merge: `e63dbf7d2a925501587df81ff5fb84b816e4e95f` (PR #929)
- Deploy run: `30960174778` attempt `1`

## Question

Are the two canonical P2 TTS delivery findings still open on the selected current/deployed Product authority?

## Findings

### `TTS-DL-UNZIP-SYNC`

**Result: FIXED-CURRENT / PRODUCTION-LIVE VERIFIED.**

The model acquisition, integrity, extraction, persistence, ORT session and inference path is worker-owned. Real-model evidence bounded the maximum UI gap at 32.7 ms. The final deployed readiness job passed the unchanged canonical Gill mobile PlayEmber smoke and immutable candidate verification.

### `TTS-DL-NO-TABLOCK`

**Result: FIXED-CURRENT / PRODUCTION-LIVE VERIFIED.**

SharedWorker-first ownership supplies one shared model/session owner; exact real-model/multitab evidence proved one acquisition and follower/shared reuse. The deployed live witness verified the versioned controller/engine/worker extension and service-worker lazy boundary.

## Exact deployment chain

- Readiness job `92162173520`: success.
- Promotion job `92165278471`: success.
- Candidate ID: `38b257030afb7cfa8a7b1128f8c86539fd36dec0:30960174778-1`.
- Candidate digest: `sha256:973369f7753f89b9a4fae4d19f523f89aa2a50808a0d11cbe8448e79b793c9ef`.
- Immutable manifest: `/deployments/38b257030afb7cfa8a7b1128f8c86539fd36dec0/30960174778-1.json`.
- Generic live artifact `8912993840`: PASS.
- TTS live artifact `8912994737`: PASS.

## Live surface evidence

The TTS contract passed on Gill and Antisovetov routes, including versioned asset discovery, exact hashes, CSP worker/media/connect directives and `lazyTtsPrecache: false`.

## Canonical action

Move exactly `TTS-DL-UNZIP-SYNC` and `TTS-DL-NO-TABLOCK` from P2 open to closed. Arithmetic becomes **371 = 225 closed + 146 open**, P2 **30**. Keep Product #61 open for non-TTS ReaderProjection/search/accessibility/save scope.
