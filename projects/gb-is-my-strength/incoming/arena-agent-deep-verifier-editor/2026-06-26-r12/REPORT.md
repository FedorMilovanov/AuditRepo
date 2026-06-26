# R12 — CRITICAL: restore breadcrumb positioning + mobile pill

## Meta
- Source commit: `2b823687`
- Gates: ✅ audit-pro PASSED

## Root cause

When commit `02bb0a6f` (PC-004) deleted the 470-line `<style is:global>` from SingleArticleCluster.astro, **3 critical rule blocks were NOT transferred** to `floating-cluster.css`:

1. **`.gb-floater--hermeneutics`** — positions controls at breadcrumb-level (`top: calc(clamp(24px, 3.5vw, 44px) - 4px); right: max(8.5vw,...)`)
   - Without this: controls go to viewport top-right corner (20px) instead of breadcrumb level
   - **This is why owner saw controls "далеко справа вверху"**

2. **Mobile `@media (max-width: 899px) .gb-floater`** — horizontal pill at bottom-center with flex-row, backdrop-blur, rounded corners
   - Without this: mobile floater stays vertical at top-right, unusable

3. **`body.fc-single-active`** legacy alias — hides old controls (#themeToggle, #bottomBar, etc.)
   - Without this: old controls may show through on some pages

## Fix

All 3 blocks restored from the deleted commit (`ad5675dd`), adapted for `floating-cluster.css` (no `<style>` nesting). Dark mode mobile variant included.

## Verification

- `.gb-floater--hermeneutics` now in floating-cluster.css: ✅
- Mobile `.gb-floater` pill override: ✅  
- `fc-single-active` in hide-old-controls block: ✅
- audit-pro: ✅ PASSED

## Lesson

When deleting component `<style is:global>` blocks during CSS consolidation, **every single rule** must be accounted for in the target CSS file. A diff comparison must be done BEFORE deletion to ensure coverage is 100%.
