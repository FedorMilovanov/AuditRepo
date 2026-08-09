# Lot media / placement readiness audit — 2026-08-09

## Findings

1. `LOT-MEDIA-PLACEMENT-01` — **release-readiness mismatch / in-flight implementation gap** — `CONFIRMED-CURRENT`, not a shipped Product regression.
2. `LOT-MEDIA-REVEAL-PRINT-01` — **P2 visual/print readiness defect in the current placement implementation** — `CONFIRMED-CURRENT`.

The active Lot publication PR #1339 declares a final media barrier of **14 verified visual families**, each with honest `600/900/1200` WebP variants, plus a dedicated 1200×630 OG, and a browser witness that checks all 14 raster illustrations.

The active placement work has a coherent **9 registered / 9 rendered** figure set, but the dedicated media branch still carries no unique bytes and #1339 still declares 14 visible raster figures. In addition, every current placement figure inherits the hidden-base `.reveal` state without a print visibility override, while its view-timeline reveal is inactive in paged media.

## Exact current Product anchors

Latest Product main observed:

- `c389f88ed06eb8e30cebf2a1c4f0d5764c18522f` — merged Search role authority #1313.

Current Lot-related branch state against that main:

- `lane/lot-media-20260809` — **identical to current main**: `ahead=0`, `behind=0`; zero unique media-byte delta;
- `lane/lot-illustration-placement-20260809` — `ahead=11`, `behind=5`; seven Lot Astro/TS source files and no raster assets;
- active publication #1339 / `release/lot-publication-20260809-r2` — `behind=8`, `ahead=10`.

The placement branch is parallel Product work; this AuditRepo audit remains read-only toward it.

## Placement contract

`LotFigure.astro` declares the expected family shape:

```text
/images/articles/lot/<name>-600w.webp
/images/articles/lot/<name>-900w.webp
/images/articles/lot/<name>-1200w.webp
```

with width-descriptor `srcset`, a 1200×675 intrinsic fallback, lazy decoding and metadata-driven alt/caption.

Current `lotFigures.ts` has exactly nine publication entries:

1. `lot-two-roads`
2. `lot-jordan-plain`
3. `lot-sodom-gate`
4. `lot-sodom-crowd`
5. `lot-judgment`
6. `lot-wife-back`
7. `lot-cave`
8. `lot-ruth-naomi`
9. `lot-remember-wife`

Five conceptual families are explicitly reserve/kept-out:

- `lot-abraham-smoke`
- `lot-moab-settlement`
- `lot-ammon-settlement`
- `lot-gen19-judges19`
- `lot-ruth-boaz`

Fresh source census finds one rendered `<LotFigure>` for every registry row:

- Orientation: 1;
- Choice/Rescue: 1;
- Sodom: 4;
- Aftermath: 2;
- Reading: 1.

Total: **9 registry rows / 9 rendered placements**.

This supersedes the older six-placement snapshot.

## Asset-byte state

`lane/lot-media-20260809` is identical to current Product main and still contributes **zero unique media bytes**.

The placement branch's seven-file semantic diff contains source only; it does not add `public/images/articles/lot/*.webp`. Thus current mounted source contracts do not themselves supply the 27 responsive bytes required for nine published families.

This is expected for split in-flight work, but it is not release evidence.

## Declared count vs current editorial placement

#1339 still says final browser evidence must exercise **14 raster illustrations**.

Current placement source publishes **9** and reserves **5**.

Legitimate end states:

### A. Preserve 14-visible contract

- promote all five reserve families into publication metadata/placement;
- create all 42 responsive in-article WebPs + dedicated OG;
- browser/print-test exactly 14 figures.

### B. Accept current 9-visible contract

- explicitly change #1339/final acceptance to 9;
- create exactly 27 responsive in-article WebPs + dedicated OG;
- assert `expectedLotFigures === 9`;
- keep five reserves out of delivered-media counts.

A browser loop over “whatever exists” is not acceptable evidence.

## `LOT-MEDIA-REVEAL-PRINT-01`

Current `LotFigure.astro` wraps every published figure as:

```astro
<figure class="article-img reveal" data-lot-figure={name}>
```

Shared CSS defines the normal hidden state:

```css
.reveal {
  opacity: 0;
  transform: translateY(22px);
}
```

and, on supporting screen engines, supplies the intended reveal with a scroll-driven `view()` timeline. `prefers-reduced-motion` separately forces reveal content visible.

This finding **does not** claim normal supporting screen browsers hide the figures.

The print boundary is different:

- W3C/CSSWG Scroll-driven Animations Level 1 §3.2 states that view progress timelines referencing the document viewport are inactive in paged media: https://www.w3.org/TR/scroll-animations-1/
- the current CSSWG editor draft also states that when there is no scrollable ancestor, e.g. in print media, the `ViewTimeline` is inactive: https://drafts.csswg.org/scroll-animations-1/
- Web Animations Level 1 defines an inactive timeline as unresolved and an animation on an inactive timeline as having unresolved current time: https://www.w3.org/TR/web-animations-1/

Current shared print CSS has no generic `.reveal` override, and current native/enhancements runtime has no generic controller that adds `.revealed` to these `LotFigure` elements.

Therefore the scroll-driven animation cannot be the print/PDF visibility owner, while the normal author style remains `opacity:0`. The accepted Lot figure set needs an explicit paged-media visibility contract before publication.

Correct closure should preserve the screen reveal effect while making semantic media print-safe, for example by a shared print equivalent of:

```css
.reveal {
  opacity: 1;
  transform: none;
  animation: none;
}
```

or by removing the hidden-base reveal dependency from printable Lot figures with equivalent screen behavior owned elsewhere.

Add a print/PDF witness asserting every accepted `[data-lot-figure]` is rendered/nontransparent in paged output. A broader unsupported-scroll-animation fallback may be audited separately, but is not promoted here without an engine witness.

## Final media closure checks

Require:

1. declared visible figure count equals actual DOM count;
2. published registry count equals intended asset-family count;
3. every published family has exactly 600/900/1200 bytes;
4. every `srcset`/fallback path resolves;
5. dimensions, ratio, `naturalWidth`, `currentSrc`, responsive selection and alt/caption are verified at 390/412/1024/1366;
6. reserve families are not counted as delivered;
7. Lot-specific OG is verified separately;
8. screen browser evidence asserts the exact positive expected count;
9. print/PDF evidence asserts the same accepted figures are visible/nontransparent;
10. placement/media/publication ancestry is refreshed before final exact-head proof.

## Current truthful status

```text
Product main: c389f88ed06eb8e30cebf2a1c4f0d5764c18522f
media branch: identical to main; 0 unique media-byte delta
placement branch: ahead=11 / behind=5
conceptual families: 14
registry rows: 9
rendered placements: 9
explicit reserves: 5
#1339 declared raster count: 14
print reveal contract: NOT CLOSED
status: IN-FLIGHT / NOT RELEASE-READY
```

Neither finding authorizes takeover of the active Product media/placement lane.