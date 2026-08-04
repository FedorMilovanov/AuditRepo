# NEXT AGENT PROMPT — gb-is-my-strength

## Exact authority

- AuditRepo rollback/base before this transaction: `75cfcd54e080c3a07da7775f4082f399ae2a034b`.
- Current Product source/disposition anchor: `3fba1890c23bd30d748f4d948a8919625d0ddf47` (PR #899).
- Product S1 index merge: `5fc06fc0c4a9a7c60f849619129890df70089b57` (PR #895).
- Product S2 exact head: `5f3962cec5e2c39a133fa56fb0661ac344df972a`; squash merge: `3fba1890c23bd30d748f4d948a8919625d0ddf47`.
- Last exact production authority is unchanged: release/control SHA `abf1edba190280e554dfda085bef9fb6594c896d`, deploy run `30669840189` attempt `1`. Do not treat the Product source anchor as deployed.
- Canonical reverify: `reverify/CURRENT_HEAD_REVERIFY_2026-08-04_3fba1890_scripture-occurrence-search-closure.md`.

## Canonical matrix

- **371 total = 222 closed + 149 open**.
- Open severity counts: P0 `0`, P1 `70`, P2 `33`, P3 `39`, refactoring `4`, AuditRepo `3`.
- `SEARCH-P1-04` is closed by the paired S1/S2 Product evidence.
- `SEARCH-P2-07` remains open: the corpus is sparse and cannot be truthfully closed without an authoritative/licensed source plus rights/provenance.
- `SEARCH-P2-08` remains open: legacy `data/verses.json` and canonical `data/bible/**` still have an authority boundary to reconcile.

## Product evidence retained

- Generated source-owned index: **980 references, 2355 occurrences, 73 indexed routes, 148 curated-text records**; production-like dist witnessed occurrences on 59 routes.
- S1 exact run `30939693713`, job `92094634725`.
- S2 self-clean executor run `30942911632`, job `92105570343`.
- Permanent exact-head runtime run `30943911786`, job `92108964307`.
- Final Product diff: 63 inventoried files, no temporary or TTS/Vosk paths.

## Next bounded search lanes

1. `SEARCH-P2-08`: remove or permanently quarantine the legacy verse authority only after exact consumer inventory; do not project disputed legacy text into the canonical corpus.
2. `SEARCH-P2-09`: implement the advertised `/?q={search_term_string}` SearchAction target as a real search-open/query state.
3. `SEARCH-P2-10`, `SEARCH-P2-11`, `SEARCH-P2-12`: complete AT/modal/touch contracts with browser evidence and without weakening existing keyboard/fallback behavior.
4. `SEARCH-P1-01`: extend the unified command palette to the remaining searchable app/tool routes.
5. Search P3 polish rows.

No active Product mutation lane is owned by this AuditRepo closure transaction. Re-read live Product `main` and source-owner blobs before opening the next lane.
