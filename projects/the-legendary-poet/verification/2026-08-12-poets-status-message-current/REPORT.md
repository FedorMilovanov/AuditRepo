# Current Verification — Poets search status-message semantics

Date: 2026-08-12

## Scope and source authority

Read-only audit of `FedorMilovanov/TheLegendaryPoet` at exact `main@d59cceccb0c49af59b1be38d4c547a6240b3005a`.

Product mutation: **none**.

No competing open Product issue was found for this status-message mechanism.

## Accessibility authority

WCAG 2.2 Success Criterion 4.1.3 requires status messages to be programmatically determinable so assistive technologies can present them without moving focus.

W3C's current failure example specifically covers a search-results message such as `0 results returned` that is visually updated without `role=status` / live-region semantics.

Official references:

- https://www.w3.org/TR/WCAG22/#status-messages
- https://www.w3.org/WAI/WCAG22/Techniques/failures/F103
- https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA22

## 1. CONFIRMED — `/poets` updates a visible search-results status without live/status semantics

`PoetsPage` changes `filteredPoets` immediately as readers:

- type into `Поиск поэтов`;
- select/remove a tag;
- change sort order.

Above the grid it renders:

```tsx
<p ...>
  Найдено гениев ... <span>{filteredPoets.length}</span>
</p>
```

This count changes in place while keyboard focus stays in the search/filter control.

The element has no:

- `role="status"`;
- `aria-live`;
- other programmatic notification mechanism.

A screen reader user can therefore change the result set while receiving no automatic equivalent of the visible `Найдено гениев N` status unless they manually navigate away from the control to rediscover it.

When no matches remain, `PoetsEmptyState` replaces the grid with:

- `Архивы молчат...`;
- `Попробуйте изменить параметры поиска`.

That is also ordinary content without status/live semantics.

The result cards themselves are not the status message; W3C explicitly distinguishes the changing result list from a brief message reporting how many results were returned.

## 2. In-repo good references prove this is implementation drift, not an absent project pattern

### Music archive

`MusicArchiveBrowser` wraps its changing search status in:

```tsx
<div aria-live="polite">
  {searchPending ? 'Обновляем результаты…' : <>Найдено: ...</>}
</div>
```

It therefore has a programmatic owner for both pending and settled result-count states.

### Ratings / Archive

Current Ratings and personal Archive surfaces likewise use live regions for result/sync/mutation status in several places.

So the project already has the correct interaction pattern; `/poets` simply predates or bypasses it.

## 3. Relationship to existing roots

### `TLP-SEARCH-001`

The Poets page also uses plain lowercase substring matching and therefore shares the current search-normalization drift (`ё/е`) with the global palette. That stays under `TLP-SEARCH-001`.

### `TLP-A11Y-CONTRAST-001`

The visible `Найдено гениев` label uses `text-cyan-200/40`, another low-contrast normal-text witness. Contrast remains a separate visual-perception root.

### `TLP-A11Y-RUNTIME-001`

This is not primarily a focus-navigation defect: focus can correctly remain in the search field. The missing contract is announcement of a result/status change **without** moving focus.

## 4. Disposition

New active root: **`TLP-A11Y-STATUS-001` / P3**.

Required terminal outcome:

- dynamic result-count/pending/empty status on `/poets` must be exposed through a stable status/live owner;
- avoid announcing on every irrelevant render; announce only meaningful result-state changes;
- use `aria-atomic`/message composition deliberately so the complete result statement is understandable;
- the visible status remains present for sighted users and must also satisfy the contrast root;
- keep focus in the active search/filter control rather than solving status notification by moving focus.

A reusable small `SearchStatus` pattern is preferable if more catalogs share the same semantics, but a component abstraction is not required merely for architecture aesthetics.

## 5. Audit-harness impact

Strengthen **`TLP-AUDIT-004`** with an accessibility-engine/browser regression:

1. focus the `/poets` search input;
2. type a query that changes the result count;
3. assert focus remains in the input;
4. assert the settled count is exposed through a live/status node;
5. enter a query with zero matches and assert the zero/empty result status is also announced;
6. change tag/sort while focus stays on controls and verify announcements are neither missing nor excessively duplicated;
7. keep Music archive as a positive reference so a future refactor does not remove its existing live behavior.

## Root-cause consolidation

| Finding | Disposition |
|---|---|
| `/poets` changing result count has no status/live semantics | new `TLP-A11Y-STATUS-001` / P3 |
| `/poets` zero-result message is not announced | same root |
| Music archive result status uses aria-live | good reference, not defect |
| Poets search `ё/е` normalization | existing `TLP-SEARCH-001` |
| Poets result-label low contrast | existing `TLP-A11Y-CONTRAST-001` |
| missing browser/a11y regression | strengthen `TLP-AUDIT-004` |

## Checkpoint

- Product source: unchanged.
- Source anchor: `d59cceccb0c49af59b1be38d4c547a6240b3005a`.
- New roots: 1 P3.
- Existing roots strengthened: `TLP-AUDIT-004`; separation from Search/Contrast/Runtime roots preserved.
