# Scripture search index contract spec

**Date:** 2026-08-04  
**Purpose:** implementation-facing contract for fixing `SEARCH-P1-03` / `SEARCH-P1-04` without overclaiming full Bible search.

## 1. Public artifact

Recommended generated file:

```text
/data/scripture-search-index.json
```

Schema versioned JSON:

```json
{
  "schemaVersion": 1,
  "generatedAt": "2026-08-04T00:00:00.000Z",
  "sourceHead": "f9d0120718569c510833dba7a3abd68ce2f6a003",
  "stats": {
    "refs": 0,
    "occurrences": 0,
    "canonicalTextRecords": 0,
    "unresolvedCanonicalText": 0
  },
  "refs": [
    {
      "id": "ioanna:17:17",
      "display": "Ин 17:17",
      "bookId": "ioanna",
      "chapter": 17,
      "key": "17:17",
      "aliases": ["Ин 17:17", "Иоанна 17:17"],
      "canonicalText": null,
      "translation": null,
      "completeness": null,
      "occurrences": [
        {
          "url": "/articles/kod-da-vinchi/",
          "title": "«Код да Винчи»: блестящий триллер или историческая подмена?",
          "anchor": null,
          "context": "Слово Твоё есть истина",
          "kind": "visible-quote",
          "source": "src/components/article-pilots/kod-da-vinchi/KodDaVinchiSectionConclusion.astro"
        }
      ]
    }
  ]
}
```

## 2. Extraction sources

Minimum source set:

- `src/content/**/*.mdx`
- `src/components/**/*.astro`
- `src/pages/**/*.astro`
- `data/glossary.json`
- `data/atlas/**/*.json`
- `data/search-manifest.json` as supplemental metadata

Use `dist/**/*.html` only as a verification witness, not the primary source, unless the source route is legacy-only.

## 3. Normalization

Use the canonical book registry in `data/bible/books.json`.

Required normalizations:

- `Ин. 17:17`, `Ин 17:17`, `Иоанна 17:17` → `ioanna:17:17`
- ASCII `-`, en dash `–`, em dash `—` → one canonical range delimiter
- repeated whitespace / non-breaking space collapse
- optional trailing dots in book abbreviations
- numbered books with and without space: `1Тим`, `1 Тим`, `1 Тим.`

## 4. Search behavior contract

### Exact reference query

If the user query parses to a reference:

1. Show exact `ref.id` occurrence matches first.
2. Show canonical verse text if `canonicalText` exists.
3. If no occurrence exists but canonical text exists, show “Текст есть в корпусе, но на сайте не найдено материалов с этой ссылкой”.
4. If neither occurrence nor canonical text exists, show “Эта ссылка пока не найдена в материалах сайта”.
5. Do not show unrelated Pagefind results as if they are exact Scripture hits.

### Non-reference query

If the query is topical text, use existing manifest/Pagefind flow, but label it as material search rather than exact Scripture lookup.

## 5. Fixtures required

Must pass after repair:

| Query | Expected state |
|---|---|
| `Ин 17:17` | exact occurrence in Kod article before Pagefind fallback |
| `Мф 24:35` | exact occurrence in Kod article before Pagefind fallback |
| `Кол 2:8` | exact occurrence if visible in article; no unrelated page-level meta top-hit as exact |
| `1 Тим 6:20` | exact occurrence if visible in article; no `2 Тим 3:16` false match |
| `2 Тим 4:3` | exact occurrence if visible; no `2 Тим 3:16` false match |
| `Гал 1:8` | exact occurrence if visible; no broad unrelated top hit as exact |
| `Ин 3:16` | exact occurrence if added; otherwise honest no-site-occurrence state |
| `Мф 5:3` | exact occurrence / Nagornaya occurrence, not merely broad `Мф 5–7` unless labelled range-context |
| `Рим 8:28` | exact occurrence or honest occurrence-not-found state; broad `Рим 8` only as range/context |
| `Иер 17:9` | exact occurrence(s) before topical heart articles |

## 6. Guards

### Suggestion guard

```text
for each public Scripture suggestion:
  parse(query).ok == true
  scriptureIndex.exactOrOccurrence(query) == true
```

### Coverage guard

```text
extractedPublicRefs >= previousExtractedPublicRefs - allowedDelta
indexedOccurrences >= extractedPublicRefs * acceptedCoverageRatio
```

At first, use report-only thresholds to avoid blocking migration; promote to fatal once extraction is stable.

### Authority guard

```text
if suggestion shows verse text:
  canonicalText must exist
  source/translation label must exist
```

If only occurrences exist, UI must not render canonical verse text.

## 7. Security guard

- Occurrence URL must be same-origin absolute path: `^/(?!/)`.
- Context must be escaped text, not raw HTML.
- Source paths must not be exposed in browser payload unless intentionally public; for browser payload prefer route URL + route title + sanitized context.
- Reject `javascript:`, `data:`, `vbscript:`, `blob:`, protocol-relative `//host`.

## 8. Non-goal

This contract is not a mandate to ship a full Bible text search across all canonical verses. It is a mandate to make searches over references appearing on the site exact, truthful and non-misleading.
