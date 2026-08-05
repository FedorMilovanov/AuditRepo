# NEXT AGENT PROMPT — gb-is-my-strength

## Exact authority

- AuditRepo base incorporated before this transaction: `75f6aa9a11fa46c02bfe03272f52dec5f5eead15`.
- Product source and production anchor: `38b257030afb7cfa8a7b1128f8c86539fd36dec0`.
- Core TTS merge: `0d60315d37efd5b47c76795f8167e99398a5b7e3` (PR #876).
- Final PlayEmber merge: `e63dbf7d2a925501587df81ff5fb84b816e4e95f` (PR #929).
- Exact production authority: run `30960174778` attempt `1`, readiness job `92162173520`, promotion job `92165278471`.
- Candidate: `38b257030afb7cfa8a7b1128f8c86539fd36dec0:30960174778-1`; digest `sha256:973369f7753f89b9a4fae4d19f523f89aa2a50808a0d11cbe8448e79b793c9ef`.
- Canonical reverify: `reverify/CURRENT_HEAD_REVERIFY_2026-08-05_38b25703_tts-production-closure.md`.

## Canonical matrix

- **371 total = 225 closed + 146 open**.
- Open severity counts: P0 `0`, P1 `70`, P2 `30`, P3 `39`, refactoring `4`, AuditRepo `3`.
- `TTS-DL-UNZIP-SYNC` is closed: model acquisition/extraction/IDB/ORT/inference are worker-owned and production-live verified.
- `TTS-DL-NO-TABLOCK` is closed: SharedWorker-first single ownership and follower reuse passed real-model/multitab and production-live evidence.
- `SEARCH-P2-08` remains closed from Product PR #901; `SEARCH-P2-07` remains open pending authoritative/licensed corpus plus rights/provenance.

## Production evidence retained

- Readiness passed the unchanged canonical Gill mobile PlayEmber smoke and immutable candidate barrier.
- Generic live artifact `8912993840` and TTS live artifact `8912994737` both passed.
- Live TTS evidence verified Gill and Antisovetov routes, versioned controller/engine/worker/CSS, exact hashes, CSP and `lazyTtsPrecache: false`.
- Product issue #474 recovered and is closed.

## Remaining Reader controls boundary

Product umbrella #61 intentionally remains open for independent work:

1. unify ReaderProjection with speakable/search/summary/print policy;
2. remove inactive speed/search controls from Tab/accessibility exposure;
3. complete the radiogroup roving keyboard model and popup semantics;
4. move save/favorite metadata to the canonical route metadata/store contract.

## Next bounded search lanes retained

1. `SEARCH-P2-09`: implement the advertised `/?q={search_term_string}` SearchAction target as a real search-open/query state.
2. `SEARCH-P2-10`, `SEARCH-P2-11`, `SEARCH-P2-12`: complete AT/modal/touch contracts with browser evidence.
3. `SEARCH-P1-01`: extend the unified command palette to remaining searchable app/tool routes.
4. `SEARCH-P2-07`: proceed only with authoritative/licensed corpus and rights/provenance evidence.
5. Search P3 polish rows.

Re-read live Product `main`, the current deployment pointer and source-owner blobs before opening a new mutation lane.
