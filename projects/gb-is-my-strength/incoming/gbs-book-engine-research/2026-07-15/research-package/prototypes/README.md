# GBS HTML Prototypes

Open `index.html` first.

## Files

- `series-flat.html` — ordinary series: desktop rail + mobile series chrome.
- `series-book.html` — book shape: chapter → article → article TOC.
- `article-reader.html` — standalone article/ReaderRail engine.
- `page-engine.html` — ordinary catalog/page engine without fake reader controls.

Shared resources:

- `prototype-shared.css`
- `prototype-shared.js`
- `assets/`
- `fonts/`

All files work locally without network access. Browser smoke was executed at 1440×1000 and 390×844 for series-flat, article-reader and page-engine. Book prototype has its own deeper SVG/state/motion test suite.
