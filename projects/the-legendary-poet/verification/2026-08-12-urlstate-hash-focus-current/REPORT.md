# Current Verification — URL state and hash/focus ownership

Date: 2026-08-12

## Scope and source authority

Read-only audit of `FedorMilovanov/TheLegendaryPoet` at exact `main@d59cceccb0c49af59b1be38d4c547a6240b3005a`.

Product mutation: **none**.

No competing open Product issue was found for the `/ratings` URL-state mechanism in this wave.

## 1. CONFIRMED — `/ratings` URL and UI filters do not share one bidirectional authority

`RatingsPage` reads `searchParams` into local React state only during initial state creation:

- `sortBy` from initial `sort`;
- `tag` from initial `tag`;
- `ratedOnly` from initial `rated`;
- `query` from initial `q`.

After mount, an effect performs only the opposite direction: it serializes those local state values back into `setSearchParams(..., { replace: true })`.

There is no effect/derivation that updates the local states when `searchParams` change independently because of:

- browser Back/Forward;
- a same-component navigation to a different `/ratings?...` URL;
- a persistent Header link back to clean `/ratings` while the RatingsPage route instance remains mounted.

The exact visible outcome depends on React Router navigation timing and whether a later state-changing render rewrites the URL, but the root defect does not: **URL and controls can diverge because local state is not derived/reconciled from the current URL after mount.**

A strong in-repo reference already exists: `MusicArchiveBrowser` reads `q`, `poet`, and `sort` directly from `searchParams` on every render and mutates them through a narrow `updateParam` helper. It therefore has one URL authority rather than a copied second state owner.

### Why this matters

The `/ratings` URL is already treated as shareable state: filters/sort/search are serialized into query parameters. If opening/backing to a URL does not deterministically reproduce the visible controls/results, the URL ceases to be an honest representation of the screen.

This is independent from `TLP-ANALYTICS-ROUTE-001`; analytics merely counts query changes. The current defect is the user-visible state model itself.

### Disposition

New active root: **`TLP-RATING-URLSTATE-001` / P2**.

Required terminal outcome:

- choose one canonical URL-state model, preferably derivation from `searchParams` as already used by MusicArchiveBrowser;
- validate/sanitize parameters on read without creating a second persistent owner;
- keep `replace:true` for typing/filter churn if history compactness is desired;
- Back/Forward, direct query URL, and navigation to clean `/ratings` must all deterministically update visible controls/results;
- avoid loops that immediately rewrite a navigation target with stale local values.

Required browser regressions:

1. start clean `/ratings`, set `q`, tag and sort, then navigate to clean `/ratings` through persistent navigation: controls/results return to defaults;
2. navigate between two explicit query variants and use Back/Forward: UI exactly follows each URL;
3. direct-load a query URL and confirm controls/results reflect it;
4. malformed/unknown parameters sanitize predictably without oscillation.

## 2. CONFIRMED manifestations — programmatic scroll owns pixels but not navigation/focus semantics

These findings are **not new root IDs**. They strengthen existing `TLP-A11Y-RUNTIME-001` and its audit-harness requirements.

### PoemQuickNav discards native anchor semantics

Each quick-nav row is a real `<a href="#poem-...">`, but its click handler calls `preventDefault()` and then `scrollToId()`.

`scrollToId()` only computes a fixed-header offset and calls `window.scrollTo`. It does not:

- update `location.hash` / history;
- move focus to the destination;
- expose the destination as the current navigation target.

So the markup advertises anchor behavior while the handler replaces it with visual movement only.

### SectionChip also scrolls without URL/focus ownership

The mobile TOC uses buttons. Selecting a section hides the popover and calls the same scroll-only `scrollToId(anchor)`. It does not create a shareable/back-forward hash state or focus the destination heading.

### ScrollToTop can remove the focused control

The fixed button is rendered only while `window.scrollY > 400`. Activating it dispatches `tlp-scroll-top`; `SmoothScroll` scrolls the document to zero. Once the threshold falls, `ScrollToTop` unmounts the very button that can still own keyboard focus. No destination focus handoff is defined.

### Lazy hash navigation has a bounded ~1.2 second target window

`SmoothScroll` retries a missing hash target at most 20 times × 60 ms. If a cold/lazy destination target appears after that window, the hash remains in the URL but the app stops attempting to align the viewport.

This is a deterministic lifecycle limitation under delayed route content; it is not claimed here as a directly observed production timeout on current network conditions.

### Disposition

Absorb all four manifestations into **`TLP-A11Y-RUNTIME-001`**.

Terminal interaction contract should include:

- anchor-like actions own URL/hash and destination focus when that is their semantic purpose;
- button-only section jumps explicitly choose and document whether they mutate history, but always preserve keyboard focus context;
- scroll-to-top hands focus to a stable top/main landmark before/after its trigger disappears;
- delayed hash target resolution is tied to destination settlement/availability rather than a short arbitrary timeout.

## 3. Audit-harness impact

Existing **`TLP-AUDIT-004`** absorbs missing proofs:

- `/ratings` URL↔UI Back/Forward and clean-navigation parity;
- PoemQuickNav click must prove hash + viewport + focus, not just viewport movement;
- SectionChip must prove destination focus context;
- ScrollToTop must prove focus survives trigger disappearance;
- delayed hash target fixture must resolve after >1.2 s or use destination-settlement ownership without timing magic.

## Root-cause consolidation

| Finding | Disposition |
|---|---|
| `/ratings` copies URL params only at mount | new `TLP-RATING-URLSTATE-001` / P2 |
| state→URL effect has no reverse authority | same URL-state root |
| Music archive derives directly from URL | internal good reference, not a defect |
| PoemQuickNav prevents native hash and scrolls only | existing `TLP-A11Y-RUNTIME-001` |
| SectionChip scrolls without focus/hash | existing `TLP-A11Y-RUNTIME-001` |
| ScrollToTop unmounts its focused trigger | existing `TLP-A11Y-RUNTIME-001` |
| hash retry ends after ~1.2 s | existing nav/focus root; delayed-route evidence boundary noted |
| missing URL/hash/focus browser proofs | existing `TLP-AUDIT-004` |

## Checkpoint

- Product source: unchanged.
- Source anchor: `d59cceccb0c49af59b1be38d4c547a6240b3005a`.
- New roots: 1 P2.
- Existing roots strengthened: `TLP-A11Y-RUNTIME-001`, `TLP-AUDIT-004`.
