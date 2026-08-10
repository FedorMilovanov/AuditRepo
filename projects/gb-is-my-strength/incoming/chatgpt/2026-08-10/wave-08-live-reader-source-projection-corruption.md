# Wave 08 — live reader/source projection corruption

Date: 2026-08-10
Auditor: ChatGPT autonomous browser/source audit

## Anchors

- Product current main checked before audit: `171daaf3fd40b92208c6e8b551acccdc00efbb6c`
- AuditRepo head immediately before write: `f81a6ce0d44ef9b7000457c0e3f85e5804c15cf4`
- Open Product PR census through connected GitHub at this check: `0`
- Product mutation: **none**

## Scope

This wave intentionally deepens the already observed readable-text pollution on `/articles/krajne-li-isporcheno-serdce/` and separates three classes:

1. current source corruption that necessarily projects into linear/readable text;
2. live/crawler-visible manifestations;
3. stale-live/deploy candidates that are not safe to call current without a fresh HTTP/browser witness.

Local container networking still cannot DNS-resolve `gospod-bog.ru`; therefore this report does **not** claim a fresh local Playwright screenshot/click witness.

## Finding A — article corruption is broader than tooltip/glossary pollution

**Disposition: `CONFIRMED-CURRENT / LOCAL CONTENT+SEMANTICS`**

The current MDX itself contains prose/source material in forms that are not semantically separated from reader text. This is not merely a crawler's inability to understand a popup.

Representative current-source examples on Product main:

- `шамирВ еврейской Библии — вещество...` is authored directly inline inside emphasis, so the explanatory definition is concatenated to the term in linear text.
- citations are authored as bare numbers immediately after prose, e.g. `...невозможно.1 Calvin J...`, `...человека.27 Hodge C...`, `...верующего...36 Clarkson D...`; the number is not a structured note reference in the MDX source.
- bibliography/source prose is interleaved into body paragraphs rather than consistently projected through the NoteRegistry/endnote mechanism.

The public crawl of the same article independently exposes the consequences: concatenated definitions, citation numbers welded to sentences, orphan fragments such as `8).`, incomplete-looking source tails, and bibliography prose appearing in the article's linear reading stream.

This materially broadens Wave 07: the mechanism is not just a popup reparent/AT question. At least part of the problem exists before runtime because current source already stores annotation/reference text in reader-linear form.

### User impact

- copy/paste and reader-mode/plain-text output are polluted;
- search-engine snippets can surface definitions and source fragments as if they were article prose;
- screen-reader linearization is likely to become excessively verbose even when the visual presentation hides or styles parts of the annotation;
- TTS/read-aloud systems that consume rendered text risk speaking citation/source material in the middle of sentences;
- the article's premium editorial presentation is undermined when the semantic text stream contains welded note markers and source fragments.

### Repair boundary

Do not solve this with crawler-specific hiding. Recheck how this route authors and projects:

- glossary definitions;
- source/citation references;
- bibliography blocks;
- reader/TTS extraction boundaries.

The smallest repair should move annotation/source material to the canonical semantic owner already used elsewhere (NoteRegistry/glossary contracts where applicable) instead of masking text in CSS.

## Finding B — public crawl shows structural symptoms beyond the originally recorded snippets

**Disposition: `VERIFIED-AT-LIVE-CRAWL / CURRENT-SOURCE-SUPPORTED`**

Additional crawl manifestations observed in this wave include:

- explanatory glossary prose inserted directly after terms in ordinary sentences;
- isolated source-number remnants (`8).`, `2).`) in the reading stream;
- bibliography entries or tails appearing without a clean list/item boundary;
- a literature section where source tails such as `Eerdmans, 1955...` appear attached to the preceding item;
- source/reference prose around theological quotations occurring inline instead of as a clearly separated note/endnote.

Because the same malformed structures are present in exact-current MDX, these manifestations are not dismissed as stale-index noise.

## Finding C — homepage lion interaction is a production-staleness candidate, not a confirmed current live bug

**Disposition: `CANDIDATE / NEEDS FRESH LIVE WITNESS`**

The available public crawler snapshot of `/` still contains:

> `Живая метка проекта Разбудить льва ... лев двигается и издаёт короткий синтезированный рык.`

Current Product source explicitly states the opposite in `src/components/home/HomeSections/About.astro`: the former synthetic lion roar was intentionally removed and the project mark is now non-interactive.

This is potentially valuable deploy/cache evidence, but the crawler snapshot is marked approximately one week old. Since the current environment cannot perform a fresh HTTP fetch of `gospod-bog.ru`, this report does **not** label the live production site stale. Next browser-capable wave should compare current production DOM/assets against `main@171daaf...` and close this as either:

- `FIXED-CURRENT / stale crawler cache`, or
- `CONFIRMED-PRODUCTION-DRIFT` with exact deployed bytes.

## Negative-control / false-positive cleanup

The crawler renders the opening of the homepage About paragraph as `Э то ...`. Current source correctly contains `Это ...`; the visual CSS applies `::first-letter` styling. Treat the crawler spacing as extraction behavior, **not** as a spelling defect.

## MASTER decision

No MASTER mutation in this wave.

Reason: Finding A is current and repair-worthy, but the active MASTER has independent control-plane/full-zero ownership history and should not be casually rewritten from an incoming audit wave. This evidence is now strong enough for a dedicated verification/consolidation pass to decide whether it is one local article repair or a shared annotation/projection root.

## Next high-value checks

1. Browser accessibility-tree + `innerText`/TTS extraction comparison on this article.
2. Second independent article route containing glossary/footnotes to determine whether this is local or systemic.
3. Fresh production fetch of `/` to settle the lion/deploy candidate.
4. Search index inspection: verify whether welded annotation/source text is indexed by Pagefind and can contaminate query snippets.
