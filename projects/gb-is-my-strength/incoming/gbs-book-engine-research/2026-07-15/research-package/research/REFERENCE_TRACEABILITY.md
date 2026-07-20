# Reference Traceability

## Канонические визуальные источники

| Область | AuditRepo reference | Source owner |
|---|---|---|
| Desktop series rail | `desktop-rail-light.png`, `desktop-rail-dark-depth.png` | `GillSeriesRail.astro` |
| Mobile top/bottom bars | `mobile-bottombar-canon-v2.png`, `gill-mobile-bars-v2.9.html` | `GillSeriesMobileBar.astro` |
| Book/part accordion | `mobile-toc-accordion-v5.html`, `engine-parttoc-accordion-*.png` | `GillPartTocOverlay.astro` |
| PLAY ring/badge | `desktop-play-badge-canon.png`, `play-ember-breath-dark.png` | `PlayEmber.astro` |
| Theme SVG | `theme-toggle-canon-swap.png` | `SingleArticleCluster.astro` |
| Settings | `reader-engine-settings-canon.png`, `desktop-settings-popover-canon.png` | `GillReaderSettingsSheet.astro`, `ReaderSettings.astro` |
| Single article rail | Hermenevtika current screenshot/audit | `ReaderRail.astro` |
| Page mobile chrome | 3-engines package §8 | `MobileChromeShell.astro`, registry |

## Prototype selector → integration owner

| Prototype selector | Не переносить буквально | Портировать в |
|---|---|---|
| `.book-article*` | names/standalone JS | shared series tree renderer + Gill rail/TOC |
| `.article-sections-*` | local scroll store | controller scrollspy/current section |
| `.gb-ember*` | уже существует | использовать `PlayEmber.astro` без копии |
| `.mobile-speedrail` | prototype binding | `GillSeriesMobileBar` + controller |
| `.desktop-speedrail` | standalone fixed coords | существующий `.gb-ember-expand` |
| `.set-*` | новый sheet DOM | existing Settings components, только border treatment |
| `.learn-*` | prototype name | existing `GillLearningSheet`, label «Справка» |
| `.bar-progress.dual-progress` | static values | source ring data and controller updates |
| `.bm-toast` | local storage stub | `BookmarkEngine`/existing toast |
| modal helper | standalone implementation | existing `initTocPopups` lifecycle |

## Что является исследованием, а не source-ready patch

- standalone HTML;
- local queue data;
- simulated TTS progress;
- synthetic text sections;
- visual test controls;
- fixed example minutes/titles.

## Что подтверждено как reusable invariant

- Book is a shape of series.
- Chapter is not a route.
- Article has route + own TOC.
- One current article and one current section state feed all surfaces.
- Node/line axes derive from one token.
- Play/Save/Theme SVGs are reused from source.
- Page engine has no reader controls by default.
