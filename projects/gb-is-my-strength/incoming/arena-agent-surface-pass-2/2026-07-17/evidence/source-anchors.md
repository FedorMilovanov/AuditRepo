# Source mechanism anchors

Product anchor: `cb3681e1a85b5f8919c9dc537f812a842bbe9235`.

## Atlas filter accessible name

`src/components/map/AtlasBody.astro:39-42` renders a button with an `aria-hidden` SVG and the only name text in a child `<span>Фильтры</span>`. There is no `aria-label`.

`src/components/map/MapStyles.astro:389-398` makes the trigger visible at `max-width:980px`, then applies:

```css
.atlas-filter-trigger span { display:none }
```

The rendered button therefore has no name at the exact breakpoint where it becomes the responsive control owner.

## Atlas search role/state

`AtlasBody.astro:24-28` renders:

```html
<input type="search" aria-controls="atlasSearchResults" aria-expanded="false">
<div id="atlasSearchResults" role="listbox" hidden></div>
```

`src/runtime/atlas-runtime.js:797-825` changes `aria-expanded`, sets/removes `aria-activedescendant`, and operates `role=option` results. The input is never given `role=combobox`; its native role remains `searchbox`.

## Gill table focus owner

`src/components/article-pilots/gill-series/GillSeriesResponsiveStyles.astro:60-69` changes each mobile manuscript table to `display:block` and `overflow-x:auto`. The table components do not emit `tabindex`, a focusable wrapper, or a scrolling-region label. Live measurement proves that nine tables actually overflow at `390px`.
