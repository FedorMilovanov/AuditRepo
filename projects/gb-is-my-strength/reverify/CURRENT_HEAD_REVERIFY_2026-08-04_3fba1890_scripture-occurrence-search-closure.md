# Current-head reverify — Scripture occurrence search closure

**Date:** 2026-08-04  
**AuditRepo base:** `75cfcd54e080c3a07da7775f4082f399ae2a034b`  
**Product S1 merge:** `5fc06fc0c4a9a7c60f849619129890df70089b57` (PR #895)  
**Product S2 exact head:** `5f3962cec5e2c39a133fa56fb0661ac344df972a`  
**Product S2 merge:** `3fba1890c23bd30d748f4d948a8919625d0ddf47` (PR #899)

## Disposition

`SEARCH-P1-04` is **FIXED-CURRENT / SOURCE+PAGEFIND+CHROMIUM+CI VERIFIED**.

The former audit observation (~1026 visible references versus tiny manifest/corpus samples) is superseded by a deterministic source-owned occurrence contract and a runtime that consumes it before Pagefind.

## S1 — canonical source-owned index

- Exact Product run `30939693713`, job `92094634725`.
- Authoritative generated counts: **980 canonical references, 2355 visible-source occurrences, 73 indexed routes and 148 curated-text records**.
- The `296/1492/73/154` prose in the S1 squash message is inaccurate and is not authoritative; the committed JSON plus permanent contract are authoritative.
- Production-like dist witnessed indexed occurrences on 59 routes.
- Anchors, route context and source provenance are preserved. `canonicalText` remains `null` where the repository has no governed text authority.
- Import graph, props, attributes, expressions and unrelated data modules are not treated as visible occurrences.

## S2 — exact-reference-first runtime

- Self-clean executor run `30942911632`, job `92105570343` passed source/index/cache, production-like build, Pagefind, Chromium exact-first, index-failure fallback, preview, keyboard/Enter navigation, SW deploy-switch and the full static-publication barrier.
- Permanent exact-head runtime run `30943911786`, job `92108964307` passed on `5f3962cec5e2c39a133fa56fb0661ac344df972a`.
- Exact queries render the `Точные вхождения` group before Pagefind, lazy-load the canonical index once and fall back to metadata/Pagefind without inventing exact results.
- Search revision moved `f48e4610 → 6061911b`; SW cache moved to v196.
- Final Product diff contained **63 inventoried files**: seven permanent runtime/SW owners plus 56 versioned search references. Temporary workflow/helper files and TTS/Vosk paths were absent.

## Boundaries retained

- `SEARCH-P2-07` remains open: 66-book registry coverage is not equivalent to a complete authoritative/licensed verse corpus.
- `SEARCH-P2-08` remains open: legacy `data/verses.json` authority still requires removal/quarantine or governed reconciliation; disputed legacy text must not be copied into `data/bible/**`.
- No production deployment is claimed. Last exact production authority remains `abf1edba190280e554dfda085bef9fb6594c896d`, run `30669840189` attempt `1`.
- No TTS/Vosk disposition is claimed.

## SSOT arithmetic

Total canonical IDs remain **371**. This one row moves from P1 open to closed:

- closed: `221 → 222`
- open: `150 → 149`
- P1: `71 → 70`
- P2/P3/refactoring/AuditRepo unchanged
