# Reverification — reader auxiliary-text linearization on exact current release

Date: 2026-08-10
Disposition: **`CONFIRMED-CURRENT / P3`**
Product mutation: **none**

## Exact release authority

- Product `main`: `29770e1c7a99478ce7dc2a01abec206ac1daa69b`.
- Deploy Candidate run: `31379283849`.
- Exact candidate artifact: `pages-release-candidate-31379283849-1`, artifact id `9059689652`.
- Artifact head metadata binds it to `main@29770e1c7a99478ce7dc2a01abec206ac1daa69b`.
- This verification reads the built `dist/**/*.html` from that exact artifact, not a stale public crawl.

## Prior provenance reconciled

Earlier Wave 06/07 evidence reported two kinds of readable-text pollution on `/articles/krajne-li-isporcheno-serdce/`:

1. a raw OG/Pagefind image path appearing at the front of crawler-readable article text;
2. glossary definitions / citation text being linearly concatenated into surrounding prose.

The same earlier wave also found a grammar error (`соблазнять, оскверняет дела...`). That grammar item is **not current**: exact current source and exact current built artifact now read `соблазнять, осквернять дела, ранить совесть...`. It must not be resurrected into MASTER from an older crawler cache.

## V12-READER-LINEAR-TEXT-POLLUTION — CONFIRMED-CURRENT / P3

### Krajne exact-release proof

Built file:

`dist/articles/krajne-li-isporcheno-serdce/index.html`

The current `<article data-pagefind-body>` begins with five hidden Pagefind metadata spans. The first is:

```html
<span data-pagefind-meta="image" hidden>/images/og-krajne-isporcheno.webp</span>
```

A generic DOM text projection of the exact built `<article>` therefore begins:

```text
/images/og-krajne-isporcheno.webpАвтор-редактор: Фёдор Милованов41БогословиеИер 17:9...
```

The same exact article contains:

- 13 `.gterm` glossary triggers;
- 40 `.fn-marker` footnote triggers;
- 3 `.bref` scripture-reference triggers.

Their explanatory popup text is physically nested inside the prose trigger in the built HTML. A generic linear text projection consequently produces sequences such as:

```text
...после битвы приКархемишеБитва при Кархемише (605 г. до н.э.): ... (605 до н.э.)...
```

and:

```text
...не означает исчезновенияостаточного грехаВ реформатском богословии: греховная склонность, остающаяся...
```

This is current artifact behavior, not a stale index snapshot.

### Cross-route witnesses prove it is not Krajne-only

The exact candidate contains the same auxiliary-text-inside-reader pattern under multiple independent content owners:

- `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/` — 116 footnote markers, 208 scripture-reference triggers and hidden Pagefind metadata; a generic linear projection inserts explanatory reference text directly between surrounding prose tokens;
- `/articles/20-antisovetov-pastoru/` — 36 footnote markers plus hidden Pagefind metadata;
- `/articles/kod-da-vinchi/` — 21 footnote markers, 9 scripture-reference triggers plus hidden Pagefind metadata;
- `/articles/dzhon-gill-chast-2-uchenyi/` — glossary + footnote structures; the exact projection concatenates the glossary title `вечный совет искупления` directly with its full `Pactum salutis` definition before returning to the sentence.

A broader exact-artifact census found **47 article-bearing routes** with at least one of these auxiliary structures (hidden Pagefind metadata, glossary, footnote or scripture popup content). This establishes a shared semantic-extraction family rather than one malformed paragraph in Krajne.

## What is and is not proven

### Proven current

- auxiliary metadata/tooltip/citation strings live inside the current article DOM/text tree;
- generic plain-text/crawler/LLM-style linearization can concatenate those strings into primary prose without lexical or semantic boundaries;
- raw local asset paths can lead the extracted article text on routes that place hidden image metadata inside `article[data-pagefind-body]`;
- the mechanism spans multiple route/content owners in the exact current release.

### Not claimed without a separate witness

- this report does **not** claim the hidden Pagefind metadata is visually rendered;
- it does **not** claim every search engine indexes `hidden` metadata identically;
- it does **not** claim a screen reader necessarily announces every popup in this raw DOM order; accessibility-tree/AT behavior remains a separate verification question;
- it does **not** reopen the now-fixed Krajne grammar error.

The defect is the current **semantic/plain-text projection**, not a visual pixel defect.

## User / publication impact

The current markup makes non-visual consumers — generic crawlers, text extraction, LLM ingestion, copy/export pipelines that linearize DOM text, and similar semantic projections — receive noisy article prose containing implementation metadata and inline popup definitions/citations as if they were ordinary sentence text.

That reduces the quality of excerpts/snippets and machine-readable article text even where the visual UI looks correct.

## Required terminal outcome

Create one bounded reader semantic-extraction contract that preserves the current rich UI while separating primary prose from auxiliary metadata/popup text:

1. plain-text projection of the main article must not begin with raw local image paths or concatenated hidden Pagefind metadata;
2. glossary, footnote and scripture explanatory text must remain available to their interactive/accessibility owner but must not collapse into surrounding primary prose without semantic boundaries;
3. Pagefind metadata, citation functionality, tooltip geometry and existing visible article layout must remain intact;
4. regression witnesses must include at least Krajne, Hermenevtika and a Gill/other reader owner so a local one-route patch cannot false-green the family;
5. include a built-output text-projection test that fails on representative glued sequences and raw metadata-prefix leakage;
6. keep accessibility-tree verification separate: if the semantic repair changes popup ownership/relations, preserve or improve trigger↔popup accessibility rather than hiding useful content from AT by accident.

## Audit disposition

Promote one shared P3 current work unit. The exact artifact proves the underlying semantic projection on current `main`; no Product files were changed by this verification.
