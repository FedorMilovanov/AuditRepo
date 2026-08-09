# Lot media / placement readiness audit — 2026-08-09

## Findings

1. `LOT-MEDIA-PLACEMENT-01` — release-readiness mismatch / in-flight implementation gap — `CONFIRMED-CURRENT`, not a shipped Product regression.
2. `LOT-MEDIA-REVEAL-PRINT-01` — P2 visual/print readiness defect in the current placement implementation — `CONFIRMED-CURRENT`.

The active Lot publication PR #1339 still declares a final media barrier of **14 verified visual families**, each with honest `600/900/1200` WebP variants, a dedicated 1200×630 OG and browser evidence over all 14 raster illustrations.

Current placement source instead has a coherent **9 registered / 9 rendered** set plus five explicit reserves. The dedicated media branch still has no unique media bytes. Every current placement figure also inherits hidden-base `.reveal` without a print visibility override, while its screen `view()` timeline is inactive in paged media.

## Exact current Product anchors

Latest Product main observed:

- `59e99bfa277e5bcc9e1d153644e73a2fa2c92a24` — merged Strangler visual-parity storage #1371.

Current Lot branch state:

- `lane/lot-media-20260809` — `ahead=0 / behind=1`; still zero unique media-byte delta;
- `lane/lot-illustration-placement-20260809` — `ahead=11 / behind=6`; seven Lot Astro/TS files and no raster assets;
- publication #1339 — `behind=9 / ahead=10`.

This AuditRepo pass remains read-only toward those parallel Product branches.

## Placement contract and count

`LotFigure.astro` declares:

```text
/images/articles/lot/<name>-600w.webp
/images/articles/lot/<name>-900w.webp
/images/articles/lot/<name>-1200w.webp
```

with width-descriptor `srcset`, 1200×675 intrinsic fallback, lazy decoding and metadata-driven alt/caption.

Nine publication registry entries:

1. `lot-two-roads`
2. `lot-jordan-plain`
3. `lot-sodom-gate`
4. `lot-sodom-crowd`
5. `lot-judgment`
6. `lot-wife-back`
7. `lot-cave`
8. `lot-ruth-naomi`
9. `lot-remember-wife`

Five explicit reserves:

- `lot-abraham-smoke`
- `lot-moab-settlement`
- `lot-ammon-settlement`
- `lot-gen19-judges19`
- `lot-ruth-boaz`

Source census finds exactly nine rendered `<LotFigure>` placements: 1 Orientation + 1 Choice/Rescue + 4 Sodom + 2 Aftermath + 1 Reading.

The placement source therefore encodes **9 visible + 5 reserve**, while #1339 still promises 14 visible raster figures.

## Asset bytes

`lane/lot-media-20260809` has no unique commits relative to its merge base and remains one current-main commit behind only because unrelated #1371 merged. It still contributes no Lot raster assets.

The placement branch adds source only, not `public/images/articles/lot/*.webp`. Thus mounted source contracts do not themselves supply the 27 responsive bytes required for nine published families.

## Count closure boundary

Two legitimate end states:

### A. Keep 14-visible acceptance

- promote all five reserves into reviewed publication placements;
- create 42 responsive in-article WebPs + dedicated OG;
- browser/print-test exactly 14.

### B. Accept 9-visible editorial density

- explicitly change publication acceptance to 9;
- create 27 responsive in-article WebPs + dedicated OG;
- assert `expectedLotFigures === 9`;
- keep five reserves outside delivered-media counts.

A browser loop over whatever happens to exist is not acceptance evidence.

## `LOT-MEDIA-REVEAL-PRINT-01`

Current component:

```astro
<figure class="article-img reveal" data-lot-figure={name}>
```

Shared normal style:

```css
.reveal {
  opacity: 0;
  transform: translateY(22px);
}
```

Supporting screen engines reveal through scroll-driven `animation-timeline:view()`. `prefers-reduced-motion` separately forces content visible.

This finding does **not** claim normal supporting screen browsers hide the figures.

Paged media differs:

- W3C Scroll-driven Animations Level 1 §3.2: view progress timelines referencing the document viewport are inactive in paged media: https://www.w3.org/TR/scroll-animations-1/
- CSSWG current editor draft: if no scrollable ancestor exists, e.g. print media, `ViewTimeline` is inactive: https://drafts.csswg.org/scroll-animations-1/
- Web Animations Level 1: inactive timeline time is unresolved: https://www.w3.org/TR/web-animations-1/

Current shared print CSS has no generic `.reveal` visibility override, and native/enhancements runtime has no generic controller adding `.revealed` to Lot figures.

Thus the screen reveal timeline cannot be print/PDF visibility authority while the underlying author style remains `opacity:0`.

Correct closure preserves the screen reveal while making semantic media printable, e.g. a shared print equivalent of `opacity:1; transform:none; animation:none`, or equivalent component ownership. Add a print/PDF witness asserting every accepted `[data-lot-figure]` is nontransparent/visible in paged output.

A broader unsupported-scroll-animation screen fallback remains a separate possible audit topic and is not promoted without an engine witness.

## Final closure checks

Require:

1. declared visible count equals actual DOM count;
2. registry count equals intended published families;
3. each published family has exactly 600/900/1200 bytes;
4. every `srcset`/fallback resolves;
5. dimensions, ratio, `naturalWidth`, `currentSrc`, responsive selection, alt/caption are verified at 390/412/1024/1366;
6. reserves are not counted as delivered;
7. Lot-specific OG verified separately;
8. screen witness asserts exact positive count;
9. print/PDF witness asserts the same accepted figures are visible/nontransparent;
10. all Lot branches are replayed onto then-current main before final proof.

## Current truthful status

```text
Product main: 59e99bfa277e5bcc9e1d153644e73a2fa2c92a24
media branch: ahead=0 / behind=1; 0 unique media-byte delta
placement branch: ahead=11 / behind=6
conceptual families: 14
registry rows: 9
rendered placements: 9
explicit reserves: 5
#1339 declared raster count: 14
print reveal contract: NOT CLOSED
status: IN-FLIGHT / NOT RELEASE-READY
```

Neither finding authorizes takeover of active Product media/placement work.