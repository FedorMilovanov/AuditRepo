# Search audit pass 3 — Scripture / verse search deep dive

**Date:** 2026-08-04  
**Product source HEAD:** `f9d0120718569c510833dba7a3abd68ce2f6a003`  
**Parent reports:** `REPORT.md`, `PASS2_DEEPENING.md`  
**Machine artifact:** `SCRIPTURE_SEARCH_PROBE.json`

## 1. Direct answer

No — the current “Писание” search section does **not** reliably “see all verses on the site” as a structured Scripture index. It is currently a thin hybrid of:

1. a small `scripture` metadata field on some search-manifest items;
2. `data-pagefind-meta="scripture"` on some built pages;
3. ordinary Pagefind full-text search over visible article text;
4. a legacy/canonical Bible reference system that exists, but is **not integrated as a full verse-search matrix** into `js/search.js`.

There is a Bible-reference infrastructure in the repo, but it is not yet a high-quality Scripture search graph. The UI wording and suggestions make it look more capable than it is.

## 2. Existing Bible/scripture infrastructure

### 2.1 Canonical Bible registry exists, but corpus is sparse

`data/bible/books.json` has the full Protestant 66-book registry and aliases. The canonical resolver exists in `src/lib/bible-reference-core.mjs`.

`node scripts/bible-reference-contract.mjs --strict`:

```text
Bible reference registry: 66 books
Bible reference corpus: 300 canonical records
Inline payload blocks: 0
Bible reference contract: 0 error(s), 197 warning(s)
```

Important: “0 errors” does not mean “complete Bible corpus”. It means the current sparse corpus passes the existing contract. The same run warned:

```text
24 registry books have no populated corpus file
many populated book files miss _meta.sourceUrl / _meta.rights
```

### 2.2 Legacy verse file exists, but diverges from canonical corpus

`data/verses.json` has 94 references. Comparison against canonical resolver:

```text
legacy verses: 94
no canonical record: 51
text differs from canonical: 38
```

Examples from the hard-coded search suggestions:

```text
Ин 3:16  => not in data/verses.json, not in canonical corpus
Мф 5:3   => in data/verses.json, but no canonical corpus record
Рим 8:28 => in data/verses.json, but no canonical corpus record
Иер 17:9 => in data/verses.json, but no canonical corpus record
```

So the suggestions are not backed by the canonical Bible resolver.

## 3. Search metadata coverage is narrow

### 3.1 Search-manifest scripture field

`dist/data/search-manifest.json`:

```text
74 total manifest items
16 items have scripture metadata
```

Current manifest scripture items:

```text
/nagornaya/seriya/ => Мф 5–7, Лк 6:17–49
/rodosloviye/ => Быт 5, Быт 11:10–26, Лк 3:23–38, Мф 1:1–17
/articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/ => Рим 7:14–25
/articles/20-antisovetov-pastoru/ => 1 Тим 3, Тит 1, Деян 20:28
/articles/diotrefy-nashego-vremeni/ => 3 Ин 9–10, 1 Тим 5:19–20, 1 Пет 5:1–4
/articles/krajne-li-isporcheno-serdce/ => Иер 17:9
/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/ => 2 Тим 3:16
/nagornaya/ => Мф 5–7, Лк 6:17–49
/nagornaya/chast-1/ => Мф 5–7, Лк 6:17–49
/nagornaya/chast-2/ => Мф 5–7, Лк 6:17–49
/nagornaya/chast-3/ => Мф 5:20, Мф 28:20
/nagornaya/chast-4/ => Мф 5:18, Ин 14:26, 2 Тим 3:16
/nagornaya/chast-5/ => Мф 7:21–23, Рим 3:20
/nagornaya/istochniki/ => Мф 5–7
/nagornaya/nakhodki/ => Мф 5–7
/hard-texts/ => Иер 17:9, Рим 7:14–25
```

This is page-level primary scripture metadata, not exhaustive verse mapping.

### 3.2 Pagefind scripture meta

Built dist has 30 `data-pagefind-meta="scripture"` entries. That is better than manifest, but still only primary/page-level metadata.

Examples:

```text
/articles/chto-bibliya-nazyvaet-serdcem/ => Мф 22:37
/articles/kak-hranit-serdce/ => Прит 4:23
/articles/kak-menyaetsya-serdce/ => Рим 8:13
/articles/serdce-i-telo/ => Рим 6:13
/articles/serdce-i-yazyk/ => Мф 12:34
/articles/skrytye-idoly-serdca/ => Иез 14:3
/articles/tma-na-serdce/ => Пс 41:6
```

It still does not enumerate all references inside each article.

## 4. Visible site references vs structured Scripture search

A conservative regex scan over built HTML extracted a very large reference surface:

```text
unique visible/parseable references extracted: 1026
unique with canonical Bible corpus record: 151
unique without canonical Bible corpus record: 875
```

The largest article-level surfaces are much denser than the current search metadata:

```text
/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/ => 176 extracted refs
/articles/serdce-spravochnik/ => 129 extracted refs
/articles/chto-bibliya-nazyvaet-serdcem/ => 124 extracted refs
/articles/20-antisovetov-pastoru/ => 81 extracted refs
/articles/krajne-li-isporcheno-serdce/ => 69 extracted refs
/articles/serdce-hrista-k-nemoshchnym/ => 68 extracted refs
/articles/serdce-i-duh/ => 56 extracted refs
/nagornaya/chast-1/ => 52 extracted refs
```

This proves the key point: the site contains many verse references, but the structured search metadata captures only a small representative slice.

## 5. Current `js/search.js` Scripture-scope behavior

The Scripture tab is not using the canonical Bible resolver. The relevant behavior is:

1. If query length is below 2, it shows four hard-coded suggestions:

   ```text
   Ин 3:16, Мф 5:3, Рим 8:28, Иер 17:9
   ```

2. It searches manifest fields via `G(item, query)` against:

   ```text
   title, description, section, author, editor, scripture, tags
   ```

3. If Pagefind is available, it performs ordinary Pagefind text search, then in Scripture scope keeps only results that are `isScripture` or have page-level `article.scripture` metadata.

This means a visible verse reference inside an article may be found by raw Pagefind, but then dropped or misranked by the Scripture tab if the page does not have matching `data-pagefind-meta="scripture"`.

## 6. Query evidence: visible verses are not reliably handled

Raw Pagefind direct queries:

| Query | Raw count | Top raw result | Problem |
|---|---:|---|---|
| `Ин 17:17` | 4 | `/articles/dzhon-gill-istoricheskiy-kontekst/` | visible quote exists in Kod article, but no structured hit |
| `Мф 24:35` | 1 | `/articles/kod-da-vinchi/` | raw search can find it, but Scripture scope model drops it because no page scripture meta |
| `Кол 2:8` | 19 | `/articles/starye-dorozhki-serdca/` | exact visible quote in Kod article does not own top result |
| `1 Тим 6:20` | 3 | `/articles/serdce-i-sokrovishche/` | exact visible quote in Kod article not top |
| `2 Тим 4:3` | 3 | `/articles/hermenevticheskaya-otsenka-.../` | wrong verse cluster caused by page meta `2 Тим 3:16` |
| `Гал 1:8` | 20 | `/hard-texts/duhi-v-temnice.../` | exact visible quote in Kod article not top |
| `Ин 3:16` | 8 | Gill part 4 | hard-coded suggestion has no exact verse support |

Emulated Scripture-scope filtering over Pagefind top 10:

```text
Ин 17:17  => 0 kept scripture-scope results
Мф 24:35  => 0 kept scripture-scope results
Кол 2:8   => kept results, but unrelated page-level scripture metadata
1 Тим 6:20 => kept unrelated results; one result matched only “Тим” family via 2 Тим 3:16
2 Тим 4:3 => kept 2 Тим 3:16 page as if relevant
Ин 3:16   => kept 2 Тим 3:16 / Ин 14:26 style false positives
```

This is a real quality defect: exact Bible reference queries can return empty, unrelated, or broad page-level matches.

## 7. Is there a “verse network / Bible matrix”?

There are several partial systems:

- `data/bible/books.json` + `data/bible/...` sparse canonical corpus;
- `data/verses.json` legacy verse tooltip payload;
- `data/glossary.json` with `Bible references` in theological terms;
- `data/atlas/...` with `bible-ref` fields for maps/events/places;
- `data/relations.json` / `dist/data/relations.compiled.json` article relationship graph;
- Pagefind full-text index.

But these are **not unified into a Scripture search graph**. There is no current production-grade matrix like:

```text
BibleRef -> canonical normalized key -> verse text -> pages mentioning it -> exact anchors -> related topics -> related articles -> cross-references
```

The existing `relations` graph is mostly article/content relationships, not a Bible verse graph. The atlas has Bible references, but the global search Scripture tab does not use the atlas reference graph as a first-class Bible search index.

## 8. New findings from pass 3

### SEARCH-P1-03 — Scripture tab falsely implies structured verse search

**Severity:** P1  
**Type:** search correctness / theological UX trust

The UI has a dedicated “Писание” tab and suggests exact references, but it is not backed by an exact Scripture resolver or exhaustive site-wide verse index. This produces false positives and missing exact hits.

**Repair direction:** implement exact-reference-first search:

1. parse query with `src/lib/bible-reference-core.mjs` or a browser-safe equivalent;
2. normalize aliases (`Ин`, `Иоанна`, `Евангелие от Иоанна`);
3. lookup a generated `data/scripture-search-index.json`;
4. show exact verse/page matches before Pagefind;
5. only then fall back to full-text Pagefind.

---

### SEARCH-P1-04 — Site-visible references are not exhaustively indexed as Scripture entities

**Severity:** P1/P2  
**Type:** coverage / discovery

Visible built HTML contains ~1026 parseable references, but only 30 page-level Pagefind scripture metadata entries and 16 manifest scripture entries exist. The current search does not know “all verses on the site” as entities.

**Repair direction:** build a generated Scripture occurrence index from source/dist:

```json
{
  "ref": "Ин 17:17",
  "bookId": "ioanna",
  "key": "17:17",
  "canonicalText": null,
  "occurrences": [
    {
      "url": "/articles/kod-da-vinchi/",
      "title": "Код да Винчи...",
      "context": "Слово Твоё есть истина",
      "anchor": "..."
    }
  ]
}
```

---

### SEARCH-P1-05 — Hard-coded Scripture suggestions are not backed by canonical records

**Severity:** P1  
**Type:** UI promise / exact query defect

`Ин 3:16`, `Мф 5:3`, `Рим 8:28`, `Иер 17:9` are hard-coded suggestions. In the canonical resolver, all four currently return no canonical record. Three exist in legacy `data/verses.json`, but not the canonical corpus. `Ин 3:16` is absent from both.

**Repair direction:** suggestions must be generated from the same exact index that powers results, or removed/relabelled.

---

### SEARCH-P2-07 — Canonical Bible corpus is too sparse for a high-quality Bible search

**Severity:** P2  
**Type:** data completeness / governance

The canonical corpus has only 300 records and 24 missing book files. Many actual site references have no canonical record. This is fine for tooltip MVP, but not enough for “Bible search”.

**Repair direction:** either declare it a curated-reference search, not Bible search; or populate a much larger corpus with source/rights metadata and stable coverage gates.

---

### SEARCH-P2-08 — Legacy and canonical verse data disagree

**Severity:** P2  
**Type:** data authority drift

`data/verses.json` is marked as legacy by the contract behavior: 51 entries have no canonical record and 38 differ from canonical. Search should not mix these authorities without an explicit reconciliation layer.

**Repair direction:** retire or project legacy verses through the canonical resolver; fail on drift for references used in public UI suggestions.

## 9. Recommended Scripture-search architecture

### Minimum viable repair

- Rename tab from `Писание` to `Ссылки в материалах` or `По ссылкам в статьях` until exact resolver exists.
- Remove `Ин 3:16` suggestion, or only show suggestions with exact indexed results.
- Add a guard: hard-coded Scripture suggestions must resolve to exact search results.

### Correct architecture

Generate `data/scripture-search-index.json` at build time:

```text
source pages + MDX + route JSON + glossary + atlas refs
  -> extract Bible refs
  -> normalize via Bible registry
  -> resolve canonical text if available
  -> attach occurrences/context/anchors
  -> add topic/article backlinks
  -> feed search UI before Pagefind
```

Search flow:

```text
if query parses as Bible ref:
  exact normalized ref hits
  expanded range/chapter hits
  occurrence list by page
  canonical verse text if available
else:
  topic/tag/Pagefind search
```

### Premium version

- Verse entity pages or modal previews.
- Per-verse occurrence count.
- “Где на сайте упоминается этот стих”.
- Cross-links: verse -> doctrines/glossary terms -> articles -> maps.
- Book/chapter filters.
- Translation/source label: Синодальный / Кассиан / excerpt.
- Quality gates for coverage and authority drift.

## 10. Verdict after pass 3

The user intuition is correct: the Scripture section is currently too thin. It is not a mature Bible-reference network. It has good building blocks, but they are scattered and not joined into the search experience.

The search should not claim or imply that it searches Scripture precisely until the exact reference index exists.
