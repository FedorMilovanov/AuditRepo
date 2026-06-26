# 🚨 CRITICAL VISUAL REGRESSION — Production screenshots confirm layout destruction

## Meta
- SHA: `53f68d38` (latest main)
- Evidence: 6 production screenshots from owner
- Severity: **P0 PRODUCTION REGRESSION — site is broken for real users NOW**

---

## ROOT CAUSE IDENTIFIED

**Commit `02bb0a6f` (PC-004) deleted all `<style is:global>` blocks from `SingleArticleCluster.astro` and `GillRailControls.astro`, replacing them with a `<link>` to `premium-controls.css`.**

**BUT `premium-controls.css` (165 lines) does NOT contain:**
- `.gb-floater` layout (position:fixed, flex-direction, top/right, z-index)
- `.gb-floater--hermeneutics` variant
- `.gb-floater--article` variant
- `.gb-icon` (button styling, hover, halo)
- `.gb-theme-toggle` (sun/moon icon transitions)
- Any mobile `@media (max-width: 899px)` rules for the floater pill

These styles exist ONLY in `css/floating-cluster.css` (1975 lines), which:
- ✅ IS loaded by root HTML → root HTML looks fine
- ❌ IS NOT loaded by Astro-built dist pages → **dist pages are BROKEN**

`SingleArticleCluster.astro` even has a comment that says:
```html
<!-- floating-cluster.css bundled via SingleArticleCluster <style is:global> — no external link needed -->
```
This comment was left when the `<style>` was removed — the comment is now a LIE.

---

## BUGS FROM SCREENSHOTS (6 screenshots, 5 distinct bugs)

### BUG-PROD-01 (P0): Hermeneutics — controls layout DESTROYED

**Screenshot:** `221431.png`
- Theme toggle, search, Play, Save are **stacked vertically without styling**
- Controls have **raw text artifacts** (colon/brackets visible)
- Save button is an oversized gold circle, displaced below controls
- **Root cause:** `SingleArticleCluster` renders `.gb-floater` + `.gb-icon` + `.gb-save` HTML, but NO CSS for these classes is loaded in dist. Only `premium-controls.css` loads, which has `.gb-ember` and `.gb-save` visual styling but NOT the `.gb-floater` container/`.gb-icon` layout.

### BUG-PROD-02 (P0): Gill mobile — controls overflow viewport

**Screenshots:** `221514.png`, `221517.png`
- Bottom control bar (theme, search, A-, A+, Play, Save) **overflows left edge**
- Theme and search icons are **invisible** (cut off)
- Play button is **disproportionately large** (black circle)
- On narrower viewport, only A-, Play, Save visible — rest clipped
- **Root cause:** `GillRailControls.astro` also lost its `<style is:global>` in PC-004. The rail-foot control bar CSS that set `display:flex; flex-wrap:wrap; gap:8px` is gone. Controls render at their natural sizes without flex layout.

### BUG-PROD-03 (P0): /izbrannoe/ — NO CSS AT ALL

**Screenshot:** `221440.png`
- "Ваше избранное" heading shows, but saved articles render as a **raw text blob**: `ГлавнаяОценка христоцентричной герменевтикиАбнер Чау • The Master's...`
- All card fields (path, title, description, section) concatenated without separators
- **Root cause:** `/izbrannoe/` page (`src/pages/izbrannoe/index.astro`) creates `izbrannoe-card`, `izbrannoe-grid`, `izbrannoe-wrap` elements in JS, but **zero CSS exists** for these class names. No `<style>` in component, no separate CSS file, no entries in `global.css` or `site.css`. The page was created without any styling.

### BUG-PROD-04 (P1): Gill Context desktop — controls very small/faded

**Screenshot:** `221528.png`
- Gill Context page (Исторический контекст) — desktop light theme
- Controls (☀, 🔍, A−, A+, ▶, 🔖) are **extremely small and faded**
- Barely visible against the light background
- Layout is correct (horizontal row), but sizes are way too small
- **Root cause:** Without the component `<style is:global>`, control sizes fall back to the minimal defaults in `premium-controls.css` (40px save, 52px ember default) which don't match the rail-foot compact sizing.

### BUG-PROD-05 (P0): TTS cannot start via mouse (confirmed from code audit)

- Already documented in R3b
- Speed panel opens, speed selection stores rate, panel closes
- TTS **NEVER STARTS** — `handlePlayClick()` unreachable via click due to `e.stopPropagation()`
- Even if layout were perfect, the feature is dead

---

## HOW THIS HAPPENED

1. **PC-004 commit `02bb0a6f`** deleted `<style is:global>` from 3 components: `SingleArticleCluster`, `GillRailControls`, `SeriesLiteCluster`
2. Replaced them with `<link>` to `premium-controls.css`
3. `premium-controls.css` was written as a **minimal starter** (165 lines) — it has ember/save visual styling but NOT the container/layout/icon styling that was in the deleted `<style>` blocks
4. Root HTML still loads `floating-cluster.css` (1975 lines, all styles) → root HTML looks fine
5. **ALL testing was done against root HTML** (Playwright, audit-pro, visual-parity)
6. **Dist (= production) was never visually tested** → catastrophic layout regression deployed to production

The exact scenario `AGENTS.md §9.25` warns about:
> "CI green, но визуально криво"

---

## IMMEDIATE FIX (2 options)

### Option A (fast, safe — recommended):
Add `<link rel="stylesheet" href="/css/floating-cluster.css?v=0142f39e" />` to `SingleArticleCluster.astro` and `GillRailControls.astro`. This restores ALL styles immediately.

```astro
{/* Restore full control styles until canonical CSS migration is complete */}
<link rel="stylesheet" href="/css/floating-cluster.css?v=0142f39e" />
```

### Option B (proper but slow):
Copy all missing `.gb-floater`, `.gb-icon`, `.gb-theme-toggle`, rail-foot styles from `floating-cluster.css` into `premium-controls.css`. Requires careful selector-by-selector migration.

### For /izbrannoe/:
Create a `<style>` block in `src/pages/izbrannoe/index.astro` with card grid layout (or create `css/izbrannoe.css`).

---

## WHY PLAYWRIGHT DIDN'T CATCH THIS

1. **No Playwright in the sandbox** — `libnspr4.so` missing, all prior agents noted this
2. Audit scripts run against **root HTML** (the legacy layer), not **dist** (the production layer)
3. `validate:static-publication` checks structure, not visual rendering
4. `visual:parity:production` exists as a script name but was never run with browser against dist
5. The strangler pattern means **root HTML ≠ production output** — and all testing targeted the wrong layer

This is the fundamental trap documented in session3's report:
> "green gate validates the legacy-root half, not the Astro source-of-truth half"

---

## Total production bugs: 4 P0, 1 P1

All 4 P0 bugs are **visible to every user RIGHT NOW** on gospod-bog.ru.
