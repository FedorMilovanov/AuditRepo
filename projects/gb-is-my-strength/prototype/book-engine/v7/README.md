# GBS Book Prototype v7 — repaired visual reference

Standalone HTML reference for the three-level book mode:

`book → chapter → article → H2/H3 sections`

Open `gbs-book-prototype.html` locally in a modern browser. The document deliberately uses only local assets from `../../assets/`; it has no network dependency.

## What this pass repairs

- Restores the centred, dimmed desktop book overlay and the dimmed learning sheet from the supplied visual baseline.
- Replaces the standalone `.set-*` settings UI with the current Gill production contract: `gillSettingsOverlay`, source-style segments, five-dot font track and synchronized triggers.
- Separates fixed book context from the scrollable rail navigation: progress, prologue and the current chapter cover cannot disappear when the long TOC scrolls.
- Resets the book-sheet scroll position on every ordinary open, so the first article cannot appear clipped beneath the sticky chapter header.
- Restores the left-bottom rail hamburger to its original responsibility: a backdrop-backed **site-sections menu**, not the book TOC.
- Restores the production-minimal Play speed lifecycle: no glass panel, no connector and no standalone speed rail; it uses `gb-ember-expand` from the production contract.
- Replaces handmade Prologue / Reference ribbons with the production `GillLeatherRibbon` SVG structure and `GillLeatherDefs` material definitions.
- Corrects the outer rail metro-node coordinates: normal and active article nodes now share the track centre exactly.
- Keeps the required three-level hierarchy in the rail and the book overlay. H2/H3 are the third level; they are not flattened or removed.
- Replaces the previous “dead button” visual suppression with working actions: navigation feedback, search, print/PDF, share fallback, player queue, settings, help tabs, notes, quiz feedback and bookmark state.
- Uses the production controller’s continuous document-height progress model and derives first-article timing from the current Heart source data: `done=39`, `part=41`, `total=228`.
- Mirrors the current `origin/main` Gill desktop Play contract: 32px `gbs-rail-ember`, `gbs-rail-spdbadge`, five speeds (`1×…2×`) and the current minimal-number `gb-ember-expand` treatment.

## Verification performed

- JavaScript syntax compilation with Node: PASS.
- JSDOM interaction pass: PASS — book TOC, search, learning tabs/quiz, settings/themes, save, print, player previous/next and Escape behavior.
- Local asset paths verified for all fonts and images.

This remains a **visual and interaction prototype**. Astro integration must reuse the production engine’s `SeriesConfig`, `enhancements.js`, `floating-cluster-controller.js`, search, bookmarks and audio adapters instead of copying this standalone runtime.
