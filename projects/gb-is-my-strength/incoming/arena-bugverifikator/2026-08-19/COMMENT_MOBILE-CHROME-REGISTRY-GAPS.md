# Comment on Finding

## Identity
- Project: gb-is-my-strength
- Comment by: arena-bugverifikator
- Date: 2026-08-19
- Target finding IDs: `MOBILE-CHROME-REGISTRY-GAPS`, `MOBILECHROME-GENESIS6-BAR-DECISION`
- Audited anchor: Product `main` `cb3681e…`; source `Genesis6ArticlePage.astro` + series shell stack; live GET of three Genesis-6 article routes
- Signal class: Product
- Proof state: PASS (user-visible bar present) / residual claim FAIL
- Claim boundary: current Product main + live
- Semantic owner: Genesis-6 series config + shared series shell (`SeriesReaderChrome` / `GillSeriesChrome` / `GillSeriesMobileBar`)

## Comment type
`challenge` — residual and owner decision are stale; work already landed.

## Evidence

```text
Genesis6ArticlePage.astro:
  import SeriesReaderChrome from '.../SeriesReaderChrome.astro'
  ...
  <SeriesReaderChrome pageId={pageId} config={GENESIS6_SERIES}> ... </SeriesReaderChrome>

SeriesReaderChrome.astro → GillSeriesChrome → GillSeriesMobileBar (static mount)

Live 200 + body markers mobile-bottom / bottombar / data-mobile-chrome on:
  /hard-texts/enoh-prorochestvoval-iuda-14-15-4q204/
  /hard-texts/kniga-enoha-kotoroy-ne-bylo-kak-raznye-proizvedeniya-stali-korpusom/
  /hard-texts/mozhno-li-doveryat-1-enohu-kanonicheskiy-audit/

mobileChromeRegistry.ts omits these routes, but registry docs say static mounts
need not re-list for connection (same pattern as Gill articles). Documentary gap only.
```

## Recommended disposition
- `MOBILE-CHROME-REGISTRY-GAPS` → `closed-by-fix` / remove from MASTER
- `MOBILECHROME-GENESIS6-BAR-DECISION` → drop (decision no longer blocks work)
- Optional tiny follow-up (WQ): add static registry rows for Genesis-6 article routes for contract completeness — not user-facing

## What this does not prove
Does not evaluate UX quality of the bar on Genesis-6 content; only that the bar **is mounted** and the «no bar» residual is false.
