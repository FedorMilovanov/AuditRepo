# Evidence 04 — negative current check: Genesis-6 mobile bar is present

## Claim under test

The active residual `MOBILE-CHROME-REGISTRY-GAPS` says Genesis-6 article pages render through `Genesis6ArticlePage` and mount no mobile bottom bar. The dependent owner decision asks whether to add one.

## W2 — current render graph

The current source chain is direct and unconditional:

```astro
<!-- Genesis6ArticlePage.astro -->
<SeriesReaderChrome pageId={pageId} config={GENESIS6_SERIES}>
  …article content…
</SeriesReaderChrome>
```

```astro
<!-- SeriesReaderChrome.astro -->
<GillSeriesChrome pageId={pageId} config={config}>
  <slot />
</GillSeriesChrome>
```

```astro
<!-- GillSeriesChrome.astro -->
<div class="gbs2-world" data-gill-v16={pageId} data-series-theme={config.theme}>
  …
  <GillSeriesMobileBar pageId={pageId} config={config} />
  <GillSeriesOverlay pageId={pageId} config={config} />
  …
</div>
```

There is no condition around the `GillSeriesMobileBar` mount. `Genesis6ArticlePage` is used by all six current source routes:

1. `/hard-texts/angely-pod-mrakom-iuda-6-7-2-petra-2/`
2. `/hard-texts/blagovestie-mertvym-1-petra-4-5-6/`
3. `/hard-texts/duhi-v-temnice-noi-kreshchenie-pobeda/`
4. `/hard-texts/enoh-prorochestvoval-iuda-14-15-4q204/`
5. `/hard-texts/kniga-enoha-kotoroy-ne-bylo-kak-raznye-proizvedeniya-stali-korpusom/`
6. `/hard-texts/mozhno-li-doveryat-1-enohu-kanonicheskiy-audit/`

## W4 — live emitted markup

Every route above returned HTTP 200 during this pass. Each returned document had:

- `gill-mobile-bar`: 3 literal occurrences;
- `data-gill-v16`: 5 literal occurrences;
- mobile-chrome markup: 4 literal occurrences.

A sampled live Genesis-6 route emits the bar inside the `gbs2-world` container, consistent with the source render graph.

## Disposition

The asserted absence is false at Product `cb3681e`; this is a useful negative result, not a request to make a second bar.

- Recommend retiring `MOBILE-CHROME-REGISTRY-GAPS` as invalid/stale.
- Recommend closing `MOBILECHROME-GENESIS6-BAR-DECISION` as unnecessary, provided the owner accepts the already-emitted shared Gill bar as the intended common mobile bar.
- A decision about a *different* Genesis-specific mobile experience would be new optional/product work and needs new value/UX evidence. It must not inherit this disproven defect ID.

## Limitations

This is source + emitted HTML evidence. It does not test viewport positioning, touch reachability, focus order, visual clipping, or runtime behavior. Those are separate browser witnesses if an actual mobile usability report arrives.
