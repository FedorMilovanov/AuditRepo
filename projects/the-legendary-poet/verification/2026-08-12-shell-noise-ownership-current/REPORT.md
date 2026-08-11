# Current Verification — shell noise-layer ownership

Date: 2026-08-12

## Scope and source authority

Read-only audit of `FedorMilovanov/TheLegendaryPoet` at exact `main@d59cceccb0c49af59b1be38d4c547a6240b3005a`.

Product mutation: **none**.

No competing open Product issue was found for this shell-layer mechanism.

## 1. CONFIRMED — the final mounted document contains two independent `.noise-bg` overlays

### Static document owner

`index.html` contains a noise element as a sibling before the React root:

```html
<div class="noise-bg"></div>
<div id="root"></div>
```

Because that element is outside `#root`, React mounting/unmounting the application does not own or remove it.

The same structure is copied into prerendered route documents because the prerender script starts from `index.html` and mutates metadata/body placeholders rather than eliminating this sibling shell element.

### React owner

`SiteLayout` independently renders:

```tsx
<AmbientBackdrop />
<PoetryBackdrop />
<div className="noise-bg" />
<CustomCursor />
```

Thus, once React mounts, the DOM contains both:

1. static `body > .noise-bg`;
2. React-owned `.noise-bg` inside the app shell.

No preboot script in the inspected `index.html`/mount path removes or adopts the static element when the React shell becomes active.

## 2. Both elements are real fixed visual layers, not empty marker nodes

`src/index.css` defines:

```css
.noise-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.022;
  z-index: 100;
  background-image: url("data:image/svg+xml,...feTurbulence...");
}
```

The light-theme rule also applies a separate opacity/mix-blend mode to every `.noise-bg` instance.

Each duplicate therefore creates a full-viewport fixed procedural-noise layer at the same z-index.

### Visual effect

Two identical semi-transparent noise layers composite on top of one another. Their effective contribution is materially stronger than one intended `opacity: 0.022` layer (for simple alpha accumulation, roughly `1 - (1-.022)^2 ≈ .0435` before considering the SVG/noise pixel values and blend mode).

The exact perceived texture varies per noise pixel/browser compositing, so this report does not claim a precise doubled luminance. The deterministic defect is **two active copies of a layer whose CSS and markup are written as a singleton shell effect**.

### Performance effect

The browser must also maintain/paint/composite two fixed full-screen elements backed by an SVG fractal-noise filter rather than one.

This report does not claim a measured GPU/frame-time regression from live production. The extra full-screen fixed layer is the confirmed structural/performance cost.

## 3. Root cause

**Preboot/static shell decoration and mounted React shell decoration have separate ownership with no handoff.**

The static noise element is useful if it is meant to prevent a visually empty first paint before JS, but that preboot role needs an explicit lifecycle transition once the persistent React shell mounts.

## 4. Disposition

New active root: **`TLP-SHELL-NOISE-001` / P3**.

Required terminal outcome:

- exactly one active noise layer after application mount;
- if preboot noise is retained for first paint, React should adopt/reuse it or remove it deterministically before/when creating the runtime shell;
- direct prerendered routes and client navigation must have the same one-layer steady state;
- dark/light theme switching must affect that one owner consistently;
- avoid a visible flash where the noise disappears/reappears during ownership handoff.

A simple solution may be to remove the static sibling entirely if first-paint evidence shows it is unnecessary; the owner may also keep it and remove the React duplicate. The audit does not prescribe which layer wins.

## 5. Audit-harness impact

Strengthen existing **`TLP-AUDIT-004`** with a persistent-shell singleton assertion after mount/hydration:

```js
expect(await page.locator('.noise-bg').count()).toBe(1)
```

Run it for:

- root direct load;
- a prerendered essay direct load;
- SPA navigation between routes;
- dark/light theme if theme repair retains different blend semantics.

A more general shell-singleton check can also guard accidental duplication of future preboot/runtime decorations without creating a brittle selector list.

## Root-cause consolidation

| Finding | Disposition |
|---|---|
| static `index.html` owns `.noise-bg` outside root | new `TLP-SHELL-NOISE-001` / P3 |
| React SiteLayout owns another `.noise-bg` | same root |
| both are fixed feTurbulence layers at z100 | same root |
| measured live frame-time degradation | not claimed |
| font preload overfetch | retracted; current variable subsets/preloads are reasonable |
| missing shell-singleton regression | strengthen `TLP-AUDIT-004` |

## Checkpoint

- Product source: unchanged.
- Source anchor: `d59cceccb0c49af59b1be38d4c547a6240b3005a`.
- New roots: 1 P3.
- Existing root strengthened: `TLP-AUDIT-004`.
