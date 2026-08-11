# Current Verification — primary readiness and search authority

Date: 2026-08-12

## Scope and source authority

Read-only audit of `FedorMilovanov/TheLegendaryPoet` at exact `main@d59cceccb0c49af59b1be38d4c547a6240b3005a`.

Product mutation: **none**.

This wave tests two independent reader contracts:

1. optional/secondary essay catalog data must not own the readiness of primary content that is otherwise available;
2. the persistent site search / mobile “all sections” entrypoint must be backed by an index that actually contains the intended core destinations.

No competing open Product issue was found for either mechanism in the current owner check.

## 1. CONFIRMED — secondary essay catalog owns primary route readiness

### Essay detail

In production, `getBrowserEssayBySlug(slug, visitKey)` builds one request from:

```ts
Promise.all([
  getBrowserEssayCatalog(visitKey),
  fetch(`/data/essays/${slug}.json`),
])
```

The body and catalog therefore have equal failure authority. If the requested essay body is available but `catalog.json` is temporarily unavailable, the whole promise rejects before the reader can see the article.

`EssayPage` then independently `use()`s the catalog again to compute only series navigation (`previous` / `next`). The main body, hero, sources, SEO facts and community target come from the essay body itself.

Thus a secondary series-navigation dependency can hide a valid primary article.

### Poet detail

`PoetDetailPage` owns its primary poet record from the bundled `poets` registry. Its `RelatedEssays` section, however, directly executes:

```ts
use(getBrowserEssayCatalog(location.key))
```

without a local error boundary/failure presentation.

A catalog rejection from the optional “Большие материалы” block therefore bubbles to the route-level page `ErrorBoundary`, replacing the otherwise available poet biography, poems and community content.

### Existing QA does not prove the required containment

`qa/articles-catalog.spec.mjs` contains useful failure tests:

- Home survives a catalog 503;
- `/articles` has a stable page-level catalog failure/revisit path;
- essay body 503 is tested.

But it does **not** prove either asymmetric case that matters here:

1. essay body 200 + catalog 503 => primary essay remains readable;
2. bundled PoetDetail primary data + catalog 503 => profile remains readable while RelatedEssays fails locally.

### Root cause

**Primary readiness and secondary enhancement data share one rejection boundary.** Optional catalog consumers are allowed to become route-fatal.

### Disposition

New active root: **`TLP-SECONDARY-DATA-001` / P2**.

Required terminal outcome:

- primary essay readability depends on the target body, not on a catalog needed only for series/navigation enrichment;
- catalog identity checks may run when available but cannot erase a valid primary payload solely because the secondary catalog is temporarily unavailable;
- series navigation gets explicit local loading/error/ready states;
- `RelatedEssays` gets local Suspense/error containment so its failure cannot replace PoetDetail;
- retry remains visit-scoped and bounded rather than turning into automatic request storms.

Required browser regressions:

- body 200 + catalog 503 on `/essays/:slug`: title/body/sources remain readable; series enhancement is locally unavailable;
- catalog 503 on `/poets/:id`: biography/poems/community remain; RelatedEssays fails or disappears locally;
- later visit can retry the secondary catalog without a full document reload.

## 2. CONFIRMED — global search index does not own all core searchable destinations it promises

### Reader-facing promise

The persistent command dialog is labelled **`Поиск по сайту`**.

The mobile centre action is labelled **`Открыть поиск и все разделы`**, and its source comment says it opens “every other section through the command palette”.

The app-shell validator explicitly certifies that this mobile “search and section discovery” entrypoint remains present.

### Actual command index

`getCommandItems()` currently contains:

- seven base destinations: `/`, `/poets`, `/ratings`, `/hall`, `/articles`, `/music`, `/about`;
- all poet detail pages;
- generated essay search items;
- published music tracks.

It does **not** contain:

- any poem;
- `/archive`;
- `/editorial-policy`;
- `/privacy`.

The omitted section paths are real internal destinations surfaced elsewhere by Footer navigation. Poems are first-class reader content and already have stable DOM anchors in `PoemCard` (`poem-${poem.id}`), so they can be indexed without inventing new routes, for example through `/poets/<poet-id>#poem-<poem-id>`.

The defect is not that the palette lacks full-body text search. Its own placeholder advertises item-level search (“поэта, статью, трек или раздел”). The current defect is narrower and concrete: **a global site/item search cannot locate the site’s core poem objects and its “all sections” owner omits existing sections.**

### Russian matching drift

`CommandPalette` normalizes only with `trim().toLowerCase()` and uses direct `includes()`.

`/poets` search independently uses the same plain lowercase substring model.

Consequently Russian orthographic equivalents commonly typed interchangeably in search, especially `ё` / `е`, do not match each other (`ещё` vs `еще`).

A future shared normalizer must not blindly remove all Unicode combining marks: that can collapse `й` into `и`. The intended bounded contract is explicit `ё → е` search equivalence while preserving ordinary Russian letter identity such as `й`.

### Audit false-green

`validate-app-shell.ts` verifies that:

- the palette opens from shell triggers;
- Ctrl/Cmd+K works;
- mobile exposes `aria-label="Открыть поиск и все разделы"`.

It does not compare the declared section inventory/content registries with `getCommandItems()`, and does not test a poem query or Russian `ё/е` equivalence.

### Separation from accessibility root

The current Command Palette listbox/keyboard defect remains owned by **`TLP-A11Y-RUNTIME-001`**:

- `role=listbox` contains ordinary buttons rather than options;
- `activeIndex` and actual DOM focus are competing Enter authorities.

That is not duplicated here.

### Root cause

**Search/navigation inventory and search text normalization have independent hand-maintained owners rather than one canonical searchable-content contract.**

### Disposition

New active root: **`TLP-SEARCH-001` / P2**.

Required terminal outcome:

- define the intended global-search inventory from canonical route/content registries rather than a partial manually maintained base array;
- include all sections promised by the mobile entrypoint, or narrow the promise explicitly;
- index canonical poem title/poet records with stable deep links to poem anchors;
- preserve the lightweight generated-essay index design rather than importing all essay bodies into the shell;
- provide one Russian search normalization helper with explicit `ё/е` equivalence and `й` preservation;
- apply it consistently to palette and other simple catalog searches where the same user expectation exists.

Required regressions:

- search a known poem title and navigate to its canonical poet+poem anchor;
- inventory parity for promised sections, including Archive/Privacy/Editorial Policy if “all sections” remains the UI contract;
- `еще` finds text indexed as `ещё` and vice versa;
- a `й`-containing word does not become equivalent merely to the same string with `и`.

## 3. Audit-harness impact

Existing **`TLP-AUDIT-004`** absorbs the missing proof layer:

- asymmetric primary/secondary failure injection for essay and poet details;
- global-search inventory parity against the selected route/content authority;
- poem deep-link search witness;
- Russian normalization fixtures that distinguish `ё/е` equivalence from `й/и` corruption.

## Root-cause consolidation

| Finding | Disposition |
|---|---|
| Essay body can be available while catalog failure kills detail | new `TLP-SECONDARY-DATA-001` / P2 |
| RelatedEssays catalog failure can replace whole PoetDetail | same `TLP-SECONDARY-DATA-001` |
| Search omits all poems | new `TLP-SEARCH-001` / P2 |
| “All sections” omits Archive/Privacy/Editorial Policy | same `TLP-SEARCH-001` |
| Palette and Poets search do not normalize `ё/е` | same `TLP-SEARCH-001` |
| Command listbox / focus / Enter semantics | existing `TLP-A11Y-RUNTIME-001`, not duplicated |
| Missing failure/search regressions | existing `TLP-AUDIT-004` |
| Full-body site search | not required/promoted by this wave |

## Checkpoint

- Product source: unchanged.
- Source anchor: `d59cceccb0c49af59b1be38d4c547a6240b3005a`.
- New roots: 2 P2.
- Existing roots strengthened: `TLP-AUDIT-004`; `TLP-A11Y-RUNTIME-001` remains the separate keyboard semantics owner.
