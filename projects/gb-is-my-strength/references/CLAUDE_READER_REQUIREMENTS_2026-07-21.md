# Owner Reader Requirements — extracted from Claude export

**Source:** user-provided Claude conversation export, conversation `Визуальное оформление интерфейса Гилла` (86 messages).  
**Extraction date:** 2026-07-21.  
**Use:** owner-intent reference for architecture and review. This is a paraphrased requirement set, not a transcript.

## Product direction

- The work must result in production code in the actual site, not an isolated oversized HTML mockup.
- The Gill visual experiment is a reference and proving ground, not the product boundary.
- The platform must support:
  - a book;
  - an ordinary series;
  - a standalone article;
  - an ordinary/non-article page;
  - special interactive experiences without forcing article UI onto them.
- Improvements to a shared engine must propagate across the site.
- Future work must become easier: agents should add content/config, not recreate chrome and preferences per route.

## Visual and interaction requirements

- Mobile top and bottom bars should feel like one seamless application shell.
- Existing repository SVGs/icons and real behaviors should be reused rather than replaced with arbitrary emojis or mock icons.
- Touch targets, safe areas, overlay placement and auto-hide must be deliberate.
- Search, Notes, Contents, Settings and Share/Print actions need clear information architecture.
- The final UI should be meaningful and restrained, not overloaded with controls for their own sake.
- Desktop and mobile must both remain coherent; mobile cannot be treated as a compressed desktop afterthought.

## Reader settings

Required reader preferences include:

- Day;
- Night;
- Sepia;
- text size;
- line height;
- text width/measure where appropriate;
- a plain/clean text reading option where appropriate.

The key owner requirement is centralized behavior: adding Sepia or changing a setting in the platform should make it available everywhere compatible, not require editing each article or engine separately.

## Reading and learning capabilities

- Resume/progress;
- bookmarks and notes;
- highlights;
- glossary and search;
- playback and speed;
- learning/explanation/test flows;
- confidence/calibration and retry behavior where a learning module uses questions.

These are capabilities that engines opt into. They are not permission to copy the entire reader implementation.

## Engineering requirements

- Read current source and commit history before changing architecture.
- Preserve current reference selectors and components until parity is proven.
- Put integration instructions and research into the repositories.
- Avoid multi-agent collisions and unreviewed wholesale merges of abandoned branches.
- Test real pages and interactions, especially mobile scroll, overlays and performance.
- A green build alone is not enough; browser witnesses are required.

## Anti-patterns explicitly rejected by owner feedback

- giant autonomous mockup disconnected from the real repository;
- recreating existing controls instead of using real components;
- route-specific settings implementations;
- visual chrome that does not actually work;
- desktop-only correctness;
- repeated agent promises without site-wide convergence;
- treating every content shape as a new engine;
- making the site harder to maintain after each improvement.

## Architecture implications

1. Keep `series`, `article` and `page` as the primary content engines.
2. Model book as `series.shape='book'`.
3. Treat maps/3D as special capability adapters.
4. Create one reader preference service and one early bootstrap.
5. Create a complete route/surface registry.
6. Migrate existing components through compatibility adapters, not a rewrite.
7. Add cross-route browser tests proving that preferences and shared chrome propagate.
