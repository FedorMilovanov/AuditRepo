# CURRENT HEAD REVERIFY — QUAL-P1-02 Hebrew font and RTL semantics

- Date: 2026-08-04
- Source repository: `FedorMilovanov/gb-is-my-strength`
- Canonical finding: `QUAL-P1-02`
- Product repair PR: `#873`
- Exact verified Product PR head: `cf128cc429ccfa1c48fce4638b3f489f8dc27135`
- Product squash merge: `f9d0120718569c510833dba7a3abd68ce2f6a003`
- AuditRepo base: `9211b3edd7ca486c1a7457abc24ccdbf99c18d84`
- Current production claim: **none**

## Disposition

`QUAL-P1-02` is **FIXED-CURRENT / SOURCE+CHROMIUM+CI VERIFIED**.

The confirmed-current root cause was bounded to dynamic Hebrew rendering in the shared Karty MapEngine: `.hw` used a Georgia/Times stack and rendered Hebrew boundaries did not consistently own RTL semantics. Product PR #873 repaired that root cause without changing route data, Russian explanatory prose, the canonical MapEngine version, or unrelated Karty surfaces.

## Source repair

The merged source now:

- styles Hebrew `.hw` tokens with the Hebrew-capable stack `"Noto Sans Hebrew", "Arial Hebrew", Arial, sans-serif`;
- applies `direction: rtl` and `unicode-bidi: isolate` to those tokens;
- normalizes rendered Hebrew `.hw` nodes to `lang="he" dir="rtl"` after dynamic tab insertion;
- declares `lang="he" dir="rtl"` on Hebrew header, panel and intro title boundaries;
- keeps Russian transliteration and explanatory nodes LTR;
- preserves the permanent MapEngine identity `0.57.0` / `2026-08-01` required by the existing layers/theme contract.

Permanent source assertions were added to `scripts/avraam-map-audit.js`; its final bounded result was **44/44**. The browser harness in `scripts/map-browser-smoke.js` now fails unless the rendered Hebrew tokens expose Hebrew language, RTL direction, isolated bidi behavior and the Hebrew-capable stack while the Russian explanation computes to LTR.

## Exact-head evidence

All eleven workflows triggered on exact Product head `cf128cc429ccfa1c48fce4638b3f489f8dc27135` completed successfully:

- Shared Files Guard — run `30896188536`;
- Map Archaeology Projection — `30896187988`;
- Avraam Dossier Witness — `30896188565`;
- Avraam Reference Baseline — `30896188739`;
- Metadata & IndexNow Readiness — `30896187344`;
- Overlay Runtime Browser — `30896187245`;
- Map Keyboard Contract — `30896187199`;
- Avraam Static Projection Witness — `30896187371`;
- Editorial Dateline Contract — `30896187251`;
- Pihahiroth uncertainty release — `30896187353`;
- Visual Parity Guard / pixel-diff — `30896187034`.

The production-like Chromium witness reported `hebrew=ok`, zero browser errors and zero horizontal overflow. It verified `lang=he`, `dir=rtl`, computed RTL, `unicode-bidi:isolate`, the Hebrew-capable font stack, and computed LTR on the Russian explanatory boundary.

The final Product diff contained exactly:

- `karty/_engine/map-engine.js`;
- `scripts/avraam-map-audit.js`;
- `scripts/map-browser-smoke.js`.

No temporary workflow survived the transaction. Reviews and review threads were empty before the SHA-protected squash merge.

## Evidence boundary

This reverify establishes current source and production-like browser correctness for the bounded Hebrew font/RTL root cause. It does not claim that Product merge `f9d0120718569c510833dba7a3abd68ce2f6a003` is deployed or that live production serves the same SHA.

`FONT-P1-01` remains historically closed as the font-only duplicate merged into this canonical owner. Closing `QUAL-P1-02` therefore completes the combined owner without creating another canonical ID.

## Canonical arithmetic for the AuditRepo transaction

- Canonical IDs: **358**
- Closed: **206 → 207**
- Open: **152 → 151**
- P0: 0
- P1: **72 → 71**
- P2: 31
- P3: 42
- Refactoring: 4
- AuditRepo: 3

The total remains `358 = 207 + 151`.
