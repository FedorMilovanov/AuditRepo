# Two new Arena Battle exports: one definitive Constellation v1.3

Date: 2026-11-07. Status: scoped integration in **existing** AuditRepo PR #538; no new candidate directory, branch, Product deployment, or Research data rewrite.

## Source verification

| User-supplied archive | SHA-256 of ZIP | Archive bytes | Members | Intended use |
| --- | --- | ---: | ---: | --- |
| `-3 (3).zip` (A) | `cadaceec978af9b404164e097aac236ca075cc3d60ba721f06914e84edcc137a` | 641889 | 42 | Calm scene and color-contract inspiration |
| `-3 (4).zip` (B) | `616262fee8089346f03af2ba2569b32db4454b755029ba70b7cba3dcbbeaaeb4` | 673315 | 41 | Geometric/caption/QA ideas, not UI controls |

Both archives contain the same `src/data/names.ts`; they are variants of **Constellation** and not additional sites. Their `src/components/GalaxyStage.tsx` files differ substantially: A = 18672 bytes; B = 39907 bytes. Total extracted TypeScript/TSX: A = 245147, B = 265502 bytes. These are source-size figures, not measured browser performance.

The earlier pair `-1 (2).zip` / `-1 (3).zip` belonged to Atlas. Their review is recorded separately in `ARENA_BATTLE_TWO_ATLAS_VARIANTS_REVIEW_2026-11-07.md`.

## Product decision: one curated scene

The site is a research-facing illustrated narrative about biblical names and titles, **not** a mechanics editor. Keep one stable preset (fixed ring layout, labels, styling and restrained first-entry animation), no user-facing orbit configuration, physics sliders, export controls, drag-to-configure, or saved physics presets. Preferences for reading font, column width and reduced motion are a different concern and remain available through the existing reader UI.

The canonical implementation is `candidates/v13/sozvezdie/src/components/NameTree.tsx`, **not** a copied `GalaxyStage.tsx`. This preserves a single scene and does not add a second simulation engine to the bundle.

| Element | Review | Final decision |
| --- | --- | --- |
| A: compact galaxy without settings | Closer to the editorial goal; static frame still has draggable physics and a reset action | **Adapt intent**, not its 18KB component: preserve current keyboard-operable NameTree |
| B: 240Hz spring integration, adjustable mass/bounce/spread/coupling | Impressive simulation engineering but complexity without demonstrated reading value | **Reject** physics control engine and external knobs |
| B: live geometry and text occlusion | Labels should never have a line visibly running through glyphs | **Adopt** masked Hebrew/Russian captions and strands ending before node discs |
| A: no continuously rotating orbit bands | Less distraction, no permanent GPU/CPU loop | **Adopt** fixed concentric guides; keep only bounded reveal transitions for motion-enabled readers |
| A: mobile visual scene | A separate draggable scene can interfere with touch scrolling | **Adapt** into one fixed `aria-label`led mobile thumbnail plus existing full keyboard/screen-reader-compatible 13-row list |
| B: SVG/PNG export, copy SVG, sliders, switches, localStorage settings | Turns the illustration into an editor | **Reject entirely** |
| A: Tailwind palette integrity checker | Catches undefined token classes that can silently render wrong | **Adopt** as `sozvezdie/scripts/qa-colors.mjs` running within the existing CI |
| A/B: alternative app shell, content changes and package versions | Would risk regressions in responsive header, 29 recorded entries, progress, hashes, font delivery | **Reject** wholesale overwrites; preserve v1.3 |
| B: numerical loader guard for boolean parameters | `Number.isFinite(true)` is false, so boolean scene toggles are not restored correctly | **Reject** parameter persistence, no equivalent state introduced |

### Functional acceptance

All checks are required at the **exact candidate HEAD**:

1. Both existing Vite production builds and TypeScript pass.
2. Palette contract validates all source classes used by Constellation against `@theme`.
3. Desktop scene retains **13 name buttons**, independent Arrow/Home/End keyboard navigation, and **12 connecting strands** ending before discs.
4. **24 original-script and Russian captions** have opaque backing; no looping ring rotation.
5. At 320px and 390px, the fixed mobile illustration fits the viewport; it has no controls. The interactive 13-row name list remains readable; the header provides at least 44px tap targets.
6. Chromium/WebKit contracts, the full Constellation functional QA, and bounded synthetic CLS checks remain green. These do not replace real-device evidence.

### Publication gates, unchanged

The existing Constellation has 29 **unverified** names/titles and Atlas has its separate 36-record prototype. Claim-level critical source work remains in Research PR #379 in `RESEARCH_HOLD`; do not call the counts canonical divine names. The Sinai image came from Arena's export, but its copyright/license provenance remains unverified. Visual design approval, real Android/iOS testing, rights and eventual Product Astro islands must be independently authorized. Neither prototype is merged or deployed.

## Change hygiene

Immutable ZIPs remain outside the candidate source tree. Changes are made in the **same** `candidates/v13` and the **same** AuditRepo PR #538 draft; no v14/v15, parallel copies, temporary source forks or new branches. Any failed QA is fixed in this same candidate or reverted without weakening tests.
