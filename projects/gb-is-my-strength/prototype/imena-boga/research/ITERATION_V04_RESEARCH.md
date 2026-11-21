# Two flagships v0.4 — independent visual worlds, shared topic navigation

**Status:** source candidate v0.4 created separately; not committed to Product or accepted as production-ready. Arena originals/reference in this PR remain immutable. Candidate package is delivered in the current ChatGPT conversation, not automatically part of this PR.

## Editorially restrained hybrid

- **Atlas A:** light scholarly research atlas; Canvas astrolabe, 36 entries, source notes, lexical table, modal dossiers, keyboard search.
- **Reader B:** dark long-form reading; 29 sections, radial constellation, SVG/Framer effects, progressive typography, reading controls.
- A hybrid is a **selective transfer**: keep distinct art direction, but connect corresponding topics and adopt only verified accessibility/search/reader improvements.

## Source candidate v0.4

- 24 intentionally curated topic-level bridges: Atlas `#name-{id}` ↔ Reader `#{id}`. This maps reader topics, not asserted etymological equivalence. Full mapping is stored in candidate `src/data/topicCrosswalk.ts` in both standalone Vite projects and mechanically checked for byte identity.
- A dialog: restores previous document scroll-lock value, stops hijacking arrow keys from active buttons/links/inputs, provides context link to B.
- A storage: prototype keys now isolated under `gb:imena:atlas:*`; avoids trampling generic Product Reader keys before canonical integration. Removed duplicate global search hotkey owner.
- B: RTL tab-list keyboard support (ArrowLeft/Right, Home/End, roving tabindex), panel labelled by selected letter. Unicode offset-aware search highlights multiple words without severing Hebrew niqqud and Greek accents.
- B tetragrammaton notes now distinguish Hebrew letter facts, traditional numeric values and theological claims; ungrounded alphabetic symbolism is not treated as biblical exegesis.

## Test boundary (candidate only)

- 85 source contracts, 6 v0.2 contracts, 13 v0.3 contracts, 24 v0.4 contracts: PASS.
- TypeScript **parser**: 41 TS/TSX files, no syntax diagnostics.
- **Not established:** candidate v0.4 `npm ci`, full TypeScript typecheck, production bundle or Chromium/WebKit UI passes. Earlier Windows npm/Chromium evidence belongs to the immutable reference plus isolated A mobile-width fix; do not misattribute to candidate v0.4.
- Prepared `checks/browser_v04.cjs` for candidate, requiring built `dist` trees: widths 320,390,412,768,1440, JS errors, modal Escape and deep-link, reader RTL tabs. Must run after both Vite builds.

## Future Product architecture

Astro remains the SSG/SSR and canonical route/metadata owner. React powers route-local interactive islands; Canvas 2D / SVG are adequate until evidence justifies WebGL/Three.js. Do not replace the whole `gb-is-my-strength` site with an SPA. Before transfer: current route owner/registry, source rights, GBSearch/ReaderState chrome ownership, exact-head Product CI and owner-approved visual comparison.

## Priority UX/product review

1. Comparative side-by-side review on 320/390/768/1440/1920 with reduced-motion and keyboard accessibility, not just screenshots of the hero.
2. Validate long-form legibility against current Product typography (and avoid shared Reader duplicates).
3. Test modal keyboard controls, 24 deep links, query normalization, copy/print, low-memory/battery behaviour, and non-JS fallback.
4. Quantify bundle/first-input costs and image provenance before a new 3D library; don't assume WebGL yields better pixels.
