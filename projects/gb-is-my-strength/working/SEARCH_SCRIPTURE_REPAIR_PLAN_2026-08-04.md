# Search / Scripture repair plan — exact-reference-first architecture

**Date:** 2026-08-04  
**Source anchor:** Product `f9d0120718569c510833dba7a3abd68ce2f6a003`  
**Audit evidence:** `incoming/search-deep-audit-2026-08-04/REPORT.md`, `PASS2_DEEPENING.md`, `PASS3_SCRIPTURE_SEARCH.md`

## Goal

Turn the current thin `Писание` tab from a Pagefind/metadata filter into a truthful exact-reference-first discovery surface.

The current UI must not imply “full Bible search” until a structured reference index exists.

## Wave S0 — copy and guard truthfulness

Minimal safe Product repair:

1. Rename the tab/copy from `Писание` to a truthful label such as:
   - `Ссылки в материалах`
   - `По ссылкам в статьях`
   - or `Писание в материалах`
2. Remove or replace hard-coded suggestions that do not resolve exactly.
3. Add a permanent guard:

```text
Every hard-coded Scripture suggestion must resolve to at least one exact indexed occurrence.
```

Acceptance:

- `Ин 3:16` is not advertised until indexed exactly.
- `Мф 5:3`, `Рим 8:28`, `Иер 17:9` either resolve exactly via the same index or are relabelled as topical/material suggestions.

## Wave S1 — generated occurrence index

Generate `data/scripture-search-index.json` during build/audit from public source surfaces:

- `src/content/**/*.mdx`
- `src/components/**/*.astro`
- route JSON / atlas data
- glossary terms
- final `dist/**/*.html` as verification, not source of truth if possible

Schema sketch:

```json
{
  "schemaVersion": 1,
  "generatedAt": "...",
  "sourceHead": "...",
  "refs": [
    {
      "display": "Ин 17:17",
      "bookId": "ioanna",
      "key": "17:17",
      "canonicalText": null,
      "translation": null,
      "occurrences": [
        {
          "url": "/articles/kod-da-vinchi/",
          "title": "«Код да Винчи»: ...",
          "context": "Слово Твоё есть истина",
          "anchor": null,
          "source": "src/components/..."
        }
      ]
    }
  ]
}
```

Acceptance:

- Extractor reports count of normalized refs, unparsed refs and no-canonical-record refs.
- Public index includes all public article occurrences, not only page-level primary scripture metadata.
- No generated entry contains unsafe URL protocols or raw HTML context.

## Wave S2 — exact-reference-first UI

Search flow:

```text
if query parses as Bible reference:
  exact normalized ref hits
  same-chapter/range hits
  occurrence cards with article context
  canonical verse text if available
else:
  manifest topic/tag search
  Pagefind fallback
```

Acceptance examples:

- `Ин 17:17` returns the article/location where the quote is visible before unrelated Pagefind matches.
- `Мф 24:35` returns the visible quote occurrence in the Kod article.
- `Иер 17:9` returns exact occurrence(s), not just broad “heart” pages.
- `Ин 3:16` either returns exact indexed occurrences or an honest “not found in site materials” state.

## Wave S3 — canonical Bible corpus governance

Do not block exact occurrence search on full Bible text availability. Occurrence search can work with `canonicalText: null`.

But for verse previews/tooltips:

1. Reconcile `data/verses.json` into canonical `data/bible/**` or formally retire it.
2. Add source/rights metadata for populated Bible corpus files.
3. Add coverage gates for all references used in public suggestions.

Acceptance:

- No public suggestion points to a reference missing from canonical corpus unless explicitly marked occurrence-only.
- `data/verses.json` no longer silently conflicts with canonical records.

## Wave S4 — verse network / premium discovery

Once exact occurrences exist:

- add “Где на сайте упоминается этот стих”;
- show occurrence count;
- link verse -> doctrine/glossary terms -> articles -> maps;
- support book/chapter filters;
- expose translation/source label: Synodal / Kassian / excerpt;
- add no-JS fallback list for exact ref query landing if feasible.

## Non-goals for first repair

- Do not attempt full Bible search across every verse of Scripture unless the rights/source decision is explicit.
- Do not populate the full Bible corpus as a side effect of fixing search truthfulness.
- Do not conflate atlas local search with global command-palette Scripture search.
