# Repair order — Search / Scripture exact-reference truthfulness

## Meta

- Project: `gb-is-my-strength` / `gospod-bog.ru`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Target source SHA: `f9d0120718569c510833dba7a3abd68ce2f6a003` or newer clean `main`
- Date: 2026-08-04
- Audit rows included: `SEARCH-P1-03`, `SEARCH-P1-04`, `SEARCH-P2-07`, `SEARCH-P2-08`, `SEARCH-P2-09`, `SEARCH-P2-10`, `SEARCH-P2-11`, `SEARCH-P2-12`, `SEARCH-P3-01`, `SEARCH-P3-02`, `SEARCH-P3-03`
- Related but separable: `SEARCH-P1-01` global command palette route-surface gap

## Core rule

Do **not** claim “Bible search” or exact Scripture search until exact reference resolution and a site-occurrence index exist.

The existing closed row `SEARCH-SCRIPTURE-BROKEN` must remain closed for its historical scope. This repair order addresses higher-standard second-order defects found at current head.

## Shared runtime fixes first

1. Add a browser-safe Bible-reference parser/normalizer derived from `src/lib/bible-reference-core.mjs`.
   - Must support aliases already in `data/bible/books.json`.
   - Must normalize hyphen/dash variants and whitespace.
   - Must preserve display reference separately from canonical key.
2. Generate a compact public `data/scripture-search-index.json` with:
   - normalized reference key;
   - display reference;
   - canonical text when available;
   - occurrence list with URL/title/context;
   - source/translation metadata when available;
   - safe URL/context escaping.
3. Change `js/search.js` Scripture flow:
   - exact reference index lookup first;
   - same-chapter/range lookup second;
   - manifest/Pagefind fallback third;
   - no unrelated page-level `scripture` metadata matches presented as exact hits.
4. Implement or remove the WebSite `SearchAction` target:
   - if kept, `/?q=...` must open/prefill/run search or render an honest static fallback;
   - if not implemented, remove/narrow the JSON-LD `SearchAction` until a real target exists.
5. Normalize command-palette ARIA to one pattern:
   - complete combobox/listbox with `aria-activedescendant` and stable option ids; or
   - command-menu buttons/links with roving focus and no fake `role=option`.
6. Upgrade the command palette to a true premium top-layer modal:
   - shared visible close button;
   - dialog/document-level focus trap;
   - governed z-index token above lower floating overlays, or explicit closing of lower overlays on open.
7. Upgrade shared touch/focus affordances:
   - 44px hitboxes for scope chips and search trigger on coarse pointers;
   - explicit `:focus-visible` for all actionable search controls.
8. Polish discovery/copy behavior while search files are open:
   - route trigger labels use one platform-aware shortcut helper;
   - result lists disclose raw total or support `Показать ещё`;
   - preview copy-link origin behavior and label are aligned (canonical vs current-origin).

## Route-level fixes next

1. Add/verify route-level occurrence extraction for article and series routes.
2. Ensure `data-pagefind-meta="scripture"` remains useful as page-level primary scripture, but not as the only Scripture index.
3. Verify special app/tool routes do not silently opt out of global search if they are public/searchManifest include.

## Metadata / content fixes

1. Remove `Ин 3:16` from hard-coded suggestions until it has an exact indexed occurrence or canonical record.
2. Do not hard-code Scripture suggestions in runtime. Generate suggestions from `scripture-search-index.json` fixtures or a governed config validated against the index.
3. Reconcile `data/verses.json`:
   - project every used legacy ref to canonical `data/bible/**`; or
   - mark legacy as tooltip-only and ban it from search suggestions; or
   - retire it after migration.
4. Add source/rights metadata for populated Bible corpus files before showing canonical verse text previews broadly.

## Tooling / audit drift cleanup

1. Add a contract test: every hard-coded/generated Scripture suggestion resolves to an exact occurrence.
2. Add a coverage report: visible public refs extracted vs indexed occurrences.
3. Add mutation fixtures:
   - visible `Ин 17:17` quote must index to its page;
   - visible `Мф 24:35` quote must index to its page;
   - `Ин 3:16` with no occurrence must produce honest not-found/not-in-site state, not unrelated Gill/2 Tim hits.
4. Add a route-surface guard for global command palette policy separately under `SEARCH-P1-01`.

## Verification required after fix

- Source tests:
  - parser fixtures for common aliases: `Ин`, `Иоанна`, `Мф`, `Матфея`, `Рим`, `1 Тим`, `2 Тим`, `Пс`, `Псалтирь`.
  - hard-coded/generated suggestions all exact-hit.
  - legacy/canonical authority drift no longer feeds public suggestions.
- Production-like dist:
  - generated `data/scripture-search-index.json` exists and is internally consistent.
  - no unsafe protocols or raw HTML in occurrence URLs/context.
  - Pagefind build still passes.
- Browser:
  - open command palette;
  - switch to Scripture/search-links tab;
  - query `Ин 17:17`, `Мф 24:35`, `Иер 17:9`, `Мф 5:3`, `Рим 8:28`, `Ин 3:16`;
  - verify exact vs not-found states and keyboard navigation.
- AuditRepo:
  - current-head reverify document;
  - update `MASTER_BUG_MATRIX.md` only after fix+fixtures+gates+witnesses.

## Parallelization

Can be parallelized:

- corpus/legacy reconciliation (`SEARCH-P2-07`, `SEARCH-P2-08`);
- route global-search surface (`SEARCH-P1-01`);
- UI copy narrowing for S0.

Must be serialized:

- exact-reference UI should wait for at least a minimal occurrence index, otherwise it will recreate false-positive behavior.
