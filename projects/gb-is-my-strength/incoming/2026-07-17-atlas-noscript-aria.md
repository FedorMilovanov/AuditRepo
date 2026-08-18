# INCOMING EVIDENCE — AtlasNoScriptFallback Missing aria-labelledby Target

- Date: 2026-07-17
- Source repository: `FedorMilovanov/gb-is-my-strength`
- Auditor: Arena Agent
- Component: `src/components/map/AtlasNoScriptFallback.astro` vs `src/components/map/AtlasBody.astro`

## Finding

In `src/components/map/AtlasNoScriptFallback.astro`, the primary fallback container `<main>` uses `aria-labelledby="atlasPageTitle"`:
```html
<main class="atlas-noscript" id="atlasNoScriptList" aria-labelledby="atlasPageTitle">
```

However, the element with `id="atlasPageTitle"` is located in `src/components/map/AtlasBody.astro`:
```html
<h1 id="atlasPageTitle">Атлас исследований</h1>
```

When JavaScript is disabled (or fails to load), `AtlasBody.astro` contents might be hidden or skipped, or if `AtlasNoScriptFallback` is meant to be a standalone accessible tree, the `aria-labelledby` reference points outside of its own semantic structure. More critically, the `atlas-noscript` CSS specifically hides the topbar: `.atlas-app .atlas-topbar__actions{display:none!important}`. 

If the `aria-labelledby` points to an element (`#atlasPageTitle`) that is either `display: none`, `hidden`, or part of a section the screen reader is told to ignore in no-JS mode, the accessible name calculation fails. The `<main>` element will have no accessible name.

## Current Exact Source Witness
At current Product head, `AtlasNoScriptFallback.astro` line 24 references `atlasPageTitle`. That ID exists in `AtlasBody.astro` line 20, but there is no fallback title or `id="atlasPageTitle"` within the `<noscript>` DOM tree itself.

## Recommendation
Add an `id` to the fallback `<h2>` or `<p>` inside `AtlasNoScriptFallback.astro` and point the `aria-labelledby` to it, or remove the `aria-labelledby` attribute and use `aria-label="Атлас исследований"` directly on the `<main>` element in the fallback. Enter this as a NARROWED RESIDUAL or DIRECT DEFECT in the matrix.
