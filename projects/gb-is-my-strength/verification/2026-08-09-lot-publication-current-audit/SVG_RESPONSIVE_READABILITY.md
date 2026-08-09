# Lot semantic SVG responsive-readability audit — 2026-08-09

## Finding

`LOT-SVG-RESPONSIVE-READABILITY-01` — **P2 visual/accessibility pre-publication residual** — `CONFIRMED-CURRENT` by source/layout geometry.

Both accepted semantic diagrams are intrinsically large SVG canvases with small internal text, but the article CSS scales them down to the full article-column width without a minimum readable width, alternate compact layout, or horizontal-scroll presentation. The result is not overflow; it is severe text shrinkage that becomes unreadable on the mobile widths explicitly named by the Lot publication browser gate.

This is exactly the kind of defect a horizontal-overflow audit can miss: geometry stays inside the viewport because the entire SVG shrinks proportionally.

## Exact Product anchors

Observed Product main for this calculation:

- `70664c82fc2ff57dd58c1a018bf01f399ade9b03`.

Relevant accepted sources:

- `LotJourneyDiagram.astro`: `viewBox="0 0 1040 390"`; smallest meaningful labels are `font-size="13"`, with other explanatory labels at 14 and place names at 19–22.
- `LotFamilyDiagram.astro`: `viewBox="0 0 960 560"`; smallest meaningful labels are `font-size="13"`, with a canonical-line label at 16 and names at 19–24.
- both use `<figure class="article-img article-img--wide">` and inline `svg { width:100%; height:auto }` behavior.
- current `site.css` gives `.article-img--wide` only `max-width:min(860px,100%)`, centered margin and line-height. It provides **no minimum SVG width and no overflow-x presentation** for these figures.
- global box sizing is `border-box`; `main.article-main` is `width:min(820px,92vw)` with 24 px left/right padding.

## Deterministic scale calculation

Because the SVG width is 100%, internal SVG text scales by:

```text
rendered figure width / viewBox width
```

### At the declared 390 px mobile viewport

`main.article-main` border-box width:

```text
min(820, 390 × 0.92) = 358.8 px
```

Approximate content width after fixed inline padding:

```text
358.8 - 24 - 24 = 310.8 px
```

Journey scale:

```text
310.8 / 1040 = 0.29885
13 × 0.29885 ≈ 3.89 CSS px
14 × 0.29885 ≈ 4.18 CSS px
20 × 0.29885 ≈ 5.98 CSS px
```

Family scale:

```text
310.8 / 960 = 0.32375
13 × 0.32375 ≈ 4.21 CSS px
16 × 0.32375 ≈ 5.18 CSS px
20 × 0.32375 ≈ 6.48 CSS px
```

### At the declared 412 px mobile viewport

Content width is approximately:

```text
(412 × 0.92) - 48 = 331.04 px
```

Journey 13-unit labels render at roughly **4.14 px**; Family 13-unit labels at roughly **4.48 px**.

### Even at the 1366 px desktop gate

The article width caps at 820 px border-box, giving about 772 px content width.

Journey 13-unit labels render at roughly:

```text
13 × 772 / 1040 ≈ 9.65 px
```

Family 13-unit labels render at roughly:

```text
13 × 772 / 960 ≈ 10.45 px
```

Thus desktop is merely small, while mobile collapses into approximately 4 px explanatory text.

These calculations are conservative: they do not depend on browser font metrics, antialiasing, or screenshot interpretation. They follow directly from the accepted SVG coordinate systems and current CSS geometry.

## User-visible consequences

### Journey diagram

The most affected text is not decorative:

- Scripture references under every waypoint (`Быт 11:31`, `Быт 13:10–12`, etc.);
- the lower narrative bridge (`Быт 14: плен → спасение Аврамом ...`);
- the evidence-boundary disclaimer saying the scheme only shows places explicitly named in the narrative.

Shrinking those labels to ~4 px on mobile makes the diagram's evidence boundary and source trace effectively unavailable to normal readers.

### Family diagram

The smallest text carries semantic distinctions:

- `отец Лота`;
- `→ моавитяне`;
- `→ аммонитяне`;
- the footer explaining solid vs dashed lineage semantics.

Again, these are part of the diagram's meaning, not ornamental microcopy.

## Interaction with `LOT-JOURNEY-EGYPT-01`

A separate semantic finding already proves that the Journey SVG omits the explicitly narrated return segment involving Egypt before the Genesis 13 separation.

The two problems should not be conflated:

1. semantic content must be corrected (Egypt / narrated return sequence);
2. the resulting semantic diagram must remain legible at the publication browser widths.

Simply adding more nodes to the current 1040-wide single-row SVG would likely make mobile readability worse unless the responsive presentation is redesigned at the same time.

## Correct repair boundary

Do not solve this by globally increasing all article SVGs or by adding a horizontal page overflow exception.

Acceptable route-local/shared-pattern options include:

- a responsive alternate SVG layout for narrow widths (e.g. wrapped/vertical journey and lineage structure);
- a deliberately scrollable semantic-figure viewport with a truthful minimum SVG width and clear affordance;
- CSS/SVG typography based on a narrow-view layout rather than proportional downscaling;
- accessible HTML companion content if the visual diagram remains dense, while preserving the SVG's `title`/`desc`.

Whichever architecture is chosen, final evidence must assert **readability geometry**, not just `scrollWidth <= clientWidth`.

Suggested browser contract at 390/412/1024/1366:

1. each semantic SVG is present with nonzero dimensions;
2. no clipping of nodes/labels;
3. the smallest meaningful rendered label has an explicit minimum readable CSS-pixel height/font size chosen by the owner/design standard;
4. if horizontal scrolling is used, the scroll container—not the page—is the owner, all content is reachable by touch/keyboard, and the page itself does not overflow;
5. SVG `title`/`desc` remain connected through `aria-labelledby`;
6. day/dark contrast remains readable;
7. Journey expected waypoint labels are asserted semantically so both omission and layout regressions are caught.

## Why this is not a screenshot-only opinion

No browser screenshot was available in the connector-only audit environment, and local cloning was blocked by network resolution. This finding therefore avoids aesthetic claims such as “looks too small.”

The classification rests on deterministic source geometry: a 13-unit text label in a 1040-wide coordinate system rendered into a ~311 px mobile content box necessarily becomes ~3.9 CSS px. That is a severe readability collapse by construction.

Final disposition: `CONFIRMED-CURRENT / ROUTE-VISUAL-ACCESSIBILITY`, to be closed by the Lot visual/browser lane without weakening general overflow guards.