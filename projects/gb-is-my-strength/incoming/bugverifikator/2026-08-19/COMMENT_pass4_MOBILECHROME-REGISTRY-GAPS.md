# Comment on Finding

## Identity
- Project: gb-is-my-strength
- Comment by: bugverifikator
- Date: 2026-08-19
- Target report: `incoming/2026-07-17-arena-agent-surface-pass-4.md`
- Target finding ID: `MOBILECHROME-REGISTRY-GAPS` (MASTER alias `MOBILE-CHROME-REGISTRY-GAPS`)
- Audited anchor (SHA / artifact / live snapshot): Product `main` HEAD `cb3681e`; source census of how each surface mounts its mobile bar (`SeriesReaderChrome`, `GillSeriesChrome`, `Genesis6ArticlePage`, `MobileChromePage`, `mobileChromeRegistry.ts`)
- Signal class: Product
- Proof state: FAIL (narrowed: part of the listed gap is not a gap; a smaller residual remains)
- Claim boundary: current Product `main` HEAD cb3681e
- Semantic owner / overlap check: mobile chrome / series engine owner; no competing lane.

## Comment type
`challenge` — оспариваю scope (narrower than filed).

## Evidence

```
# Report lists missing-from-registry live routes incl. /pastor-series/ and (per MASTER) Genesis-6 articles.

# Pastor-series articles on cb3681e are NOT registry-gapped — they get a mobile bar via STATIC mount:
#  src/pages/articles/20-antisovetov-pastoru/index.astro → AntisovetovBody.astro  (uses SeriesReaderChrome: 4 refs)
#  src/pages/articles/diotrefy-nashego-vremeni/index.astro → DiotrophesPublishedPage.astro
#     → <SeriesReaderChrome pageId="diotrophes" config={PASTOR_SERIES}>
#  SeriesReaderChrome.astro → GillSeriesChrome.astro → <GillSeriesMobileBar pageId=… config=… />  (mobile bar rendered)
# → pastor-series articles share the Gill-series static mobile bar; "missing" is stale for them.

# Genesis-6 ARTICLE pages ARE gapped (the real residual):
#  src/pages/hard-texts/enoh-…/index.astro, kniga-enoha-…/index.astro, mozhno-li-doveryat-1-enohu-…/index.astro
#     → <Genesis6ArticlePage pageId=…> ; Genesis6ArticlePage.astro imports ONLY css/mobile-hotfix.css —
#     no MobileChromePage, no registry adapter, no SeriesReaderChrome. No mobile bottom bar.
#  /hard-texts/genesis-6/ LANDING → uses <MobileChromePage> directly — covered.

# mobileChromeRegistry.ts on cb3681e: searchOpenerRoutes-style registry is a config SSOT;
#  absence of a route there is only a gap if that route is expected to use the registry mount.
#  Genesis-6 article pages were never wired to it.
```

## Summary
The report's gap list over-states the problem on cb3681e. Pastor-series articles (`/articles/20-antisovetov-pastoru/`, `/articles/diotrefy-nashego-vremeni/`) DO get a mobile bottom bar — they render through `SeriesReaderChrome → GillSeriesChrome → GillSeriesMobileBar` (static mount), exactly like Gill. The `/pastor-series/` "missing" item is therefore stale. The genuine, narrowed residual is the **Genesis-6 article pages** (`/hard-texts/enoh-…`, `/kniga-enoha-…`, `/mozhno-li-doveryat-1-enohu-…`), which render via `Genesis6ArticlePage` and mount no mobile bar at all (only `mobile-hotfix.css`). The `/hard-texts/genesis-6/` landing is covered via `MobileChromePage`. Whether the Genesis-6 article pages *require* a bar is an owner value decision (they may intentionally be plain long-form reader pages).

## Recommended action
- Status change: keep `MOBILECHROME-REGISTRY-GAPS` / `MOBILE-CHROME-REGISTRY-GAPS` but **reword to the narrowed residual**: "Genesis-6 article pages (`/hard-texts/enoh-…`, `/kniga-enoha-…`, `/mozhno-li-doveryat-1-enohu-…`) lack a mobile bottom bar; pastor-series articles are covered via SeriesReaderChrome." Consider converting to an `owner-decision` row (is a bar required on those pages?).
- Proposal status: proposal-supported (narrowed).
- Conflict registry entry: NO
- Notes for verifier: do not treat registry absence alone as a defect — a route is only gapped if it is expected to use the registry mount and doesn't. The `static`-mount surfaces (Gill, Hermenevtika, pastor-series) are covered outside the registry by design.
