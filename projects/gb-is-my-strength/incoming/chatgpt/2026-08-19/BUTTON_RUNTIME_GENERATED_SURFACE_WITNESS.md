# BUTTON-RUNTIME-GENERATED-SURFACE-WITNESS

## Classification

- Parent work unit: `SITEWIDE-BTN-TYPE-AUDIT-FALSE-COMPLETENESS`
- Product anchor rechecked: `01894214765d7ab6e51a7eea1fb7f239c6591af8`
- Product mutation: none
- MASTER mutation: none
- This is **not** a new behavioral button defect; it is evidence that the historical audit boundary was not sitewide.

## Finding

The historical button audit described an exhaustive sitewide scan but its declared source surface was effectively `src/**/*.astro` + `src/**/*.tsx`.

That already undercounted the declared scope: re-running the same Astro/TSX literal rule gives **49** missing-`type` button tags, not the recorded 47.

A second, independent completeness problem is that the real DOM control surface is not limited to Astro/TSX. Current runtime JavaScript creates buttons through literal HTML strings. A source census over:

```text
src/**/*.astro
src/**/*.tsx
js/*.js
src/runtime/*.js
```

using literal `<button ...>` tags and an exact attribute-name check for `type="button|submit|reset"` gives:

```text
560 literal button tags total
75 literal button tags without explicit type
25 source files containing at least one missing-type button
```

Breakdown:

```text
Astro      38 missing-type buttons / 19 files
TSX        11 missing-type buttons /  3 files
JS runtime 26 missing-type buttons /  3 files
---------------------------------------------
Total      75 missing-type buttons / 25 files
```

The Astro+TSX subtotal is exactly **49**, matching the corrected declared-scope count already recorded in this intake. The additional **26** are runtime-generated controls that the historical scan never considered.

## Concrete current runtime witnesses

### `js/search.js`

Current search runtime builds the command-palette DOM from HTML strings. Among its controls are literal missing-type buttons such as:

```html
<button class="cp-clear" style="display:none" aria-label="Очистить запрос">...</button>
<button class="cp-history-clear" data-action="clear-history">...</button>
<button class="cp-preview-btn secondary" id="cp-copy-btn">...</button>
<button class="cp-sug-btn" data-sug="...">...</button>
```

The exact current Product file at `01894214…` still contains this runtime-generated markup.

### `js/highlights.js`

Current highlights runtime also generates controls without explicit type, including export/close/card/delete buttons.

### `js/site.js`

The legacy shared runtime contains generated share-dialog and quiz controls without explicit type, including social/share, quiz-next/restart/share and bonus controls.

## Why this matters to the audit claim

This does **not** turn 75 literals into 75 current submit bugs. The already-existing MASTER evidence independently found that current rendered type-less buttons are not presently inside forms, so the default-submit risk is latent rather than a reproduced behavioral failure.

The issue here is evidence integrity:

```text
"sitewide exhaustive button audit"
!=
"scan only Astro/TSX source tags"
```

A DOM control can be produced by JavaScript after load. An audit that claims the whole site must either:

1. scan all code paths that create button markup, including JS strings / `innerHTML`; or
2. inspect the production DOM after representative interaction paths; or
3. explicitly label itself `Astro/TSX source-only` and stop making exhaustive sitewide claims.

## Durable closure boundary for work unit 2

The parent audit-harness work unit should close only when the replacement guard has an explicit surface contract. A robust closure can use either:

- source-wide detection across Astro/TSX/JS generated markup plus adversarial fixtures; or
- a production-like browser census after opening lazy/overlay surfaces; ideally both.

The guard must also assert its own execution census (`files scanned`, `buttons examined`, `generated-runtime surface`) so a future scope regression cannot silently reduce coverage while preserving a green result.

## Negative boundary

- No claim that any of these runtime buttons currently submits a form.
- No claim that all 26 runtime literals are simultaneously present on one route.
- No new Product repair lane is requested from this witness.
- This evidence strengthens only `SITEWIDE-BTN-TYPE-AUDIT-FALSE-COMPLETENESS`.