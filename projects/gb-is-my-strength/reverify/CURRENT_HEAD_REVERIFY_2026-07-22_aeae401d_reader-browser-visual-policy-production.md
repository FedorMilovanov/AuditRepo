# CURRENT HEAD REVERIFY — 2026-07-22 — reader/browser/visual policy production

## Authority

- Source `main`: `aeae401d782d769dad582395f2045fa79c020f42`.
- Public-surface browser closure: PR #145 / `f9439ef303601e1dc68b5c40ff4d0e1ec8db6a3e`.
- Visual parity route-policy closure: PR #148 / `aeae401d782d769dad582395f2045fa79c020f42`.
- Final pre-merge exact head: `15afc705ad021e5c0dd10437b4c1fc1b70464c36`.
- Exact production readiness: `29938007259`; exact Pages: `29938389078`.
- Live-origin witness: AuditRepo run `29938751151`, artifact `8537627473`.

## Universal reader / surface state

- 76 ownership routes classified: 51 series (27 flat + 24 book), 2 article, 9 page, 14 special.
- Book is `surface=series + seriesShape=book`; no second book engine.
- 41 series/book routes use `SeriesReaderChrome`; 10 remain explicit `route-native` adapters.
- 75 public `production-dist` routes were exercised at 320×760, 390×844 and 1440×900.
- Route Registry run `29937357579` on exact pre-merge head: **3428/3428 PASS**, 0 failures.

## Browser defects closed by PR #145

- `/nagornaya/chast-5/` exposed the only initial breadth failure at 320px.
- Five native chapter footers now share one compact bottom-bar contract.
- The speed sheet is viewport-fixed, safe-area bounded and cancels desktop centering transform.
- Long flex headings shrink/wrap; closed glossary cards do not contribute intrinsic layout width.
- Horizontal overflow is measured on `document.scrollingElement`; body intrinsic width remains diagnostics only.
- Shared Files `29925122651`, Native Source `29925122656` and Route/Browser `29925123418` passed on final PR head `ebc298b3…`.

## Visual parity policy closed by PR #148

- Screenshot generation is diagnostic and can no longer exit before policy evaluation.
- `legacy-diff` remains the default blocking mode at baseline + 0.5%; no global threshold increase.
- `native-contract` requires explicit reason, two or more unique repository-relative existing guard files, and profile/policy agreement.
- `/articles/` and `/baptisty-rossii/` use explicit native ownership because retired legacy documents contain stale content/layout.
- `/karty/` remains `legacy-diff`; owner-reviewed mobile glyph-raster baseline is 2.0506%.
- Adversarial witnesses reject fake guards, ordinary legacy regression, unknown mode, missing strict-new baseline and unapproved update.
- Exact PR head checks: Shared `29937354573`, Visual `29937351115`, Native `29937351111`, Route/Browser `29937357579` — success.

## Exact production witness

- Final source SHA: `aeae401d782d769dad582395f2045fa79c020f42`.
- Main checks: Shared Files `29938007239`, Visual Parity `29938007421`, Native Source `29938007246` — success.
- Readiness `29938007259` succeeded and created Pages `29938389078` for the same SHA.
- Live origin returned HTTP 200, SHA-256 `b430cdc33e6245e2dc024e8c8802bb5e487bc19a862aee2601c122c72df3f561`, ETag `"6a60f46c-132af"`, Last-Modified `Wed, 22 Jul 2026 16:48:44 GMT`.
- Required source-integrity markers: **7/7 PASS**.
- Forbidden stale markers (universal verification wording; Green 49–74): **2/2 absent PASS**.
- Exact immutable witness: AuditRepo run `29938751151`, artifact `8537627473`.

## Next boundary

1. Issue #142: source-role and argument-layer registry pilot.
2. Preserve browser baseline before neutral epistemic comparison UI.
3. Issue #146: explicit series landing/reference route semantics; no new engine.
4. Reader R6 / issue #59 remains an independent state-platform lane.
5. Do not combine registry, UI, route semantics and ReaderState.
