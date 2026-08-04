# Search audit pass 4 — SearchAction, accessibility and UX contracts

**Date:** 2026-08-04  
**Product source HEAD:** `f9d0120718569c510833dba7a3abd68ce2f6a003`  
**Parent reports:** `REPORT.md`, `PASS2_DEEPENING.md`, `PASS3_SCRIPTURE_SEARCH.md`  
**Machine artifact:** `PASS4_CONTRACT_PROBE.json`

## 1. Scope

This pass deepens the search audit beyond Scripture coverage into:

- WebSite `SearchAction` contract vs actual `?q=` behavior;
- command-palette ARIA/listbox semantics;
- secondary UX/security observations already visible in `js/search.js`.

## 2. WebSite SearchAction is present, but the target is not implemented

Built `dist/index.html` contains JSON-LD:

```json
{
  "@type": "SearchAction",
  "target": {
    "@type": "EntryPoint",
    "urlTemplate": "https://gospod-bog.ru/?q={search_term_string}"
  },
  "query-input": "required name=search_term_string"
}
```

But source/runtime scans show no handler for `?q=`:

```text
js/search.js                                      => no URLSearchParams / location.search read
src/components/home/HomePageChrome.astro          => no URLSearchParams / location.search read
src/components/home/HomeSearchA11yGuard.astro     => no URLSearchParams / location.search read
```

The only `?q=`/`search_term_string` occurrences are the metadata declaration itself and unrelated minified variable substrings. There is no source path that opens the command palette, pre-fills the query, or renders a search-results state for `/?q=...`.

### Finding: SEARCH-P2-09

**Severity:** P2  
**Type:** Search/SEO contract truthfulness

The site advertises a WebSite `SearchAction` URL template `https://gospod-bog.ru/?q={search_term_string}`, but the static/runtime product does not implement that query parameter. A user/search-engine following the target lands on the homepage, not on a search results state.

**Why not P1:** command-palette search still works when opened manually. This is a structured metadata/search-discovery contract gap.

**Repair direction:** either implement query-param hydration or remove/narrow the SearchAction until a real search target exists.

Minimum implementation:

```text
on home load:
  const q = new URLSearchParams(location.search).get('q')
  if q:
    load/open GBSearch
    set input value to q
    run search
    announce state
```

Required guard:

```text
SearchAction target must have a tested runtime/no-JS behavior, not just JSON-LD presence.
```

## 3. Command-palette listbox/combobox semantics are incomplete

`js/search.js` creates a useful keyboard-driven palette, but the ARIA pattern is mixed:

Current input markup:

```html
<input class="cp-input" type="text" placeholder="Поиск по статьям, Писанию…" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-label="Поиск" aria-autocomplete="list" aria-controls="cp-listbox">
```

Current list markup:

```html
<div class="cp-list" id="cp-listbox" role="listbox" aria-label="Результаты поиска"></div>
```

Current result items are rendered as:

```html
<button class="cp-item" data-idx="..." role="option" aria-selected="false">...</button>
```

Observed source facts:

```json
{
  "hasDialog": true,
  "itemRoleOption": true,
  "itemIsButton": true,
  "hasCombobox": false,
  "hasAriaExpanded": false,
  "hasAriaActivedescendant": false,
  "optionStableId": false
}
```

The active item is tracked through `.is-active` and `aria-selected`, but input focus does not own `aria-activedescendant`, options do not have stable ids, and result nodes are both buttons and `role="option"`.

### Finding: SEARCH-P2-10

**Severity:** P2  
**Type:** Accessibility / assistive technology correctness

The search UI visually supports keyboard navigation, but its ARIA model is neither a complete combobox/listbox nor a pure command-button menu. This can make active-result announcements unreliable for screen-reader users.

**Repair direction:** choose one pattern.

Option A — combobox/listbox:

- input or wrapper has `role="combobox"`;
- `aria-expanded` reflects open state;
- `aria-controls="cp-listbox"` remains;
- each option has stable `id="cp-option-N"`;
- input updates `aria-activedescendant="cp-option-N"` during Arrow navigation;
- options are not semantic buttons unless the pattern intentionally uses button focus.

Option B — command menu:

- remove `role="listbox"`/`role="option"`;
- render real buttons/links;
- roving tabindex/focus is used; active result is the focused button;
- status region announces result count and selected item.

Closure needs at least source assertions and one browser accessibility-tree/keyboard witness.

## 4. Secondary observations not promoted in this pass

### Result truncation / no “show more”

`js/search.js` slices Pagefind results to 10 and manifest fallback to 12:

```text
Pagefind branch: results.slice(0,10)
manifest branch: slice(0,12)
```

There is no `Показать ещё`/“show more” path. This remains a UX improvement candidate, but not promoted to the matrix in this pass.

### Copy-link hard-codes production origin

Search preview copy uses:

```text
https://gospod-bog.ru + e.url
```

This is probably intentional canonical sharing, but the UI label says “Скопировать ссылку”, not “Скопировать каноническую ссылку”. Kept as P3 polish candidate, not promoted.

### `safeUrl()` does not explicitly reject protocol-relative URLs

`safeUrl()` blocks `javascript:`, `data:`, `vbscript:`, `blob:`. Current manifest has zero protocol-relative URLs, so this is not a current exploit. Future hardening should reject `//host` in the search manifest guard and runtime.

## 5. Matrix movement recommendation

Promote:

- `SEARCH-P2-09` — SearchAction `?q=` target unimplemented.
- `SEARCH-P2-10` — mixed/incomplete command-palette ARIA listbox/combobox pattern.

Do not promote in this pass:

- result truncation/no show-more;
- hard-coded canonical copy-link origin;
- protocol-relative hardening with no current corpus hit.

## 6. Closure checklist

For `SEARCH-P2-09`:

- source handler or metadata removal;
- production-like dist assertion for `/?q=...` behavior;
- browser witness that query opens/prefills/runs search or honest static fallback.

For `SEARCH-P2-10`:

- source-level ARIA pattern contract;
- keyboard fixture for Arrow/Home/End/Enter/Escape;
- browser accessibility-tree or screen-reader-adjacent witness if available;
- no duplicate overlay and no focus trap regression.
