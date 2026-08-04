# Current-head reverify — Product wave closures and WebKit TOC isolation

**Date:** 2026-08-04  
**AuditRepo base:** `549b0d070a16a2cdb6a72fa91e5448fe6c02834e`  
**Product source anchor after wave:** `83875378a31436e235f1296f13d22c816b2945df`  
**Last exact production authority:** `abf1edba190280e554dfda085bef9fb6594c896d`  
**Production claim:** none  
**TTS/Vosk mutation:** none

## 1. Scope

This reconciliation reads the complete current canonical matrix and the supplied search/Nagornaya audit chain, then changes only three dispositions:

1. `NG-DARK-01` open → closed from Product PR #887;
2. `SEARCH-P1-03` open → closed from Product PR #890;
3. add a separate open P2 `CI-WEBKIT-TOC-NONDETERMINISTIC` for the nondeterministic WebKit TOC harness.

`SEARCH-P1-04`, `SEARCH-P2-07` and `SEARCH-P2-08` remain open. Historical `SEARCH-SCRIPTURE-BROKEN` remains closed and is not reopened.

## 2. `NG-DARK-01` closure

Product PR #887 squash-merged as `7118ad80c3474112f203c2c3b8df7cdc44de0a84`.

Verified boundary retained from the refined audit:

- nine Nagornaya routes;
- three viewports;
- permanent production-like Chromium computed-style contract;
- **384/384** assertions;
- zero new `!important`; governed total remains **134**;
- higher-specificity unlayered selectors rather than blanket escalation;
- SW/cache transaction v194;
- production-like build, Pagefind/offline/SW contracts, visual parity, runtime interactive audit and full static-publication barrier.

The predecessor PR #885 is superseded. Its eight additional `!important` declarations and broad CSP suppression were not retained.

## 3. `SEARCH-P1-03` closure

Product PR #890 exact final head `0c20368ff0e4f90c992784530d15c9c7d722e0dd` squash-merged as `83875378a31436e235f1296f13d22c816b2945df`.

Executor run `30931175556`, job `92065964404` completed successfully:

- exact base/blob guards;
- explicit fail-closed eight-anchor writer;
- self-cleaned bounded diff;
- permanent truthful-suggestion contract;
- canonical 66-book resolver parsing;
- exact manifest ownership for `Иер 17:9`, `Рим 7:14–25`, `1 Тим 3`, `Тит 1`;
- old unsupported suggestions and misleading wording forbidden;
- production-like build and strict Pagefind inventory;
- real browser discovery queries;
- SW dist/deploy-switch audits;
- full `validate:static-publication`.

The public surface now says `Ссылки` / `Ссылки в материалах` and does not promise full Bible-text search. Seven legacy manifest reference forms remain outside this S0, as do the occurrence-index and corpus-authority debts.

## 4. WebKit TOC isolation

During exact-head PR #887 validation, a WebKit public-surface TOC job produced two assertions on `/articles/krajne-li-isporcheno-serdce/`. A bounded rerun on the same unchanged product tree produced the same two assertion types on `/baptisty-rossii/goneniya-i-sovest/` instead.

Neither route belonged to the Nagornaya diff. Chromium Nagornaya, visual parity and runtime interactive evidence were green. Because the failure migrated between unchanged unrelated routes, the supported disposition is a separate readiness/harness nondeterminism finding, not reopening `NG-DARK-01` and not mutating those routes speculatively.

## 5. Canonical arithmetic

Before:

- total 370;
- closed 219;
- open 151;
- P1 72;
- P2 32;
- P3 40;
- Refactoring 4;
- AuditRepo 3.

After:

- total **371**;
- closed **221**;
- open **150**;
- P1 **71**;
- P2 **33**;
- P3 **39**;
- Refactoring **4**;
- AuditRepo **3**.

The total increases by one because the independent WebKit CI finding is new; two existing open rows move to closed.

## 6. Next bounded lane

`SEARCH-P1-04` S1 must generate a deterministic source-owned occurrence index before any full runtime promise:

- normalize with the existing 66-book registry/resolver;
- retain page URL, title, context, anchor and source provenance;
- allow `canonicalText: null` when the curated corpus has no record;
- treat `dist` only as a verification witness;
- never invent anchors, verse text or corpus authority;
- keep `SEARCH-P2-07` and `SEARCH-P2-08` separate.
