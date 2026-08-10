# Reverification — prior Wave 11 Pagefind landing-body boundary

Date: 2026-08-10
Disposition: prior raw Pagefind landing omission is now `CONFIRMED-CURRENT / P2` on the exact current published index.

## Provenance

Prior raw evidence already exists in:

- AuditRepo commit `360348ef1cac0e9bd5f7224ff1dba4e0db806de0`;
- `projects/gb-is-my-strength/incoming/chatgpt/2026-08-10/wave-11-shared-runtime-pagefind-editorial-schema.md`.

That wave established from source that HardTexts, Pastor Series and Biografii place `data-pagefind-body` on the hero while substantial landing content is rendered in a separate main region. It remained raw because no direct current Pagefind query witness was available.

## Current authority

- Product current main: `29770e1c7a99478ce7dc2a01abec206ac1daa69b`.
- Exact published candidate: deploy run `31379283849`, artifact `9059689652`.
- Exact index: candidate `dist/pagefind`, Pagefind 1.5.2.
- Machine query evidence: `PAGEFIND-QUERY-EVIDENCE.json` in this verification package.
- Product mutation: none.

## V11-PAGEFIND-LANDING-BODY — CONFIRMED-CURRENT / P2

### Direct exact-index failure

All three affected landings are themselves present and searchable in the current Pagefind index, but terms that exist in their substantive main/card content do not associate those landings with the query.

#### Pastor Series

Main-content queries:

- `Диотрефы нашего времени` → article results, but `/pastor-series/` absent;
- `Анатомия манипуляции` → `/articles/20-antisovetov-pastoru/`, but `/pastor-series/` absent.

Positive hero/title control:

- `Тёмная сторона кафедры` → `/pastor-series/` rank 1.

#### Hard Texts

Main-card queries:

- `Римлянам 7: верующий, неверующий или человек под законом` → article results, but `/hard-texts/` absent;
- `Крайне ли испорчено моё сердце` → article results, but `/hard-texts/` absent.

Positive hero/title control:

- `Тайны человеческого сердца` → `/hard-texts/` rank 1.

#### Biografii

Main-card queries:

- `Человек — детство, призвание, семья` → Gill article results, but `/biografii/` absent;
- `Исторический контекст — диссентеры, Саутварк, книги` → Gill article results, but `/biografii/` absent.

Positive hero/title control:

- `Биографии служителей` → `/biografii/` rank 1.

This positive/negative split proves that the landings are not missing from Pagefind as a whole. The defect is their own content boundary: Pagefind indexes the hero/title body but omits substantive landing main/card text.

### Current source mechanism

HardTexts and Pastor Series current page-chrome components explicitly mark the hero `<section>` with `data-pagefind-body` and inject the substantive main through a separate slot.

Biografii current substantive content is assembled in `BiografiiMain.astro` as a separate `<main id="main-content">` containing recent/focus/era/Gill article cards. Current built/index behavior shows that these card terms likewise do not belong to the landing's indexed body.

This is one route-family publication/search boundary, not a Pagefind engine failure and not one bug per card.

### User impact

A reader searching for the exact name of a visible landing card can find the child article but cannot get the corresponding landing collection/book/series page as a result, even though that landing visibly contains and organizes the item. The search index therefore under-represents the landing's navigational/collection semantics.

### Existing CI false-green boundary

Current search/discovery audits prove route/index counts, canonical queries, Pagefind build integrity and noindex policy. They do not assert that every collection/series landing's substantive visible cards are included inside its Pagefind body boundary.

A green Pagefind build and green canonical query suite therefore do not disprove this content-coverage omission.

### Required terminal outcome

A bounded landing Pagefind-body repair must establish:

- substantive visible main/card content on HardTexts, Pastor Series and Biografii is included in the landing's searchable body, without indexing unrelated global chrome/footer noise;
- existing hero/title search behavior remains intact;
- exact-card queries such as the witnesses above return both the child article and the organizing landing where appropriate;
- permanent built-index regression tests derive representative card terms from current landing source/data rather than hardcoding a second content registry;
- mutation witness proves moving the main back outside the Pagefind body makes the contract fail.

## Product mutation

None. This report promotes an existing raw Wave 11 source finding using direct exact-current Pagefind index queries.
