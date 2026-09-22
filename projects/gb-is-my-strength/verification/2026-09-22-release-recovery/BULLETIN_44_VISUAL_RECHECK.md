# Bulletin 44 — exact-byte visual recheck and source-class boundary

Observed 2026-09-22. Product anchor:
`6bf5fd7212eaf88ac21d719947f98a1d6f21eb37`.

## Object and reproducible check

Source: `baptisty-rossii/research/raw-sources/bulletin-council-relatives-044-1977.pdf`.

| Identity | Verified value |
|---|---|
| Bytes | 1,171,788 |
| Pages | 87 |
| Git blob | `66f54198e369f836387a18b40c203468c662a4eb` |
| SHA-256 | `79e9fab61164ffd2c881ac641402e8b8bd9806bad8cf9b1360aa8b35568ce55c` |
| PDF creator | Adobe InDesign CS5 (7.0.3) |
| PDF producer | Adobe PDF Library 9.9 |
| Creation / modification metadata | 2015-04-25 / 2016-04-25 |

The file was rendered locally with Poppler 26.05.0, not through the previously failing
web screenshot cache. Commands, with `SOURCE` set to the repository path above:

```sh
sha256sum "$SOURCE"
git hash-object "$SOURCE"
pdfinfo "$SOURCE"
pdftoppm -f 1 -l 1 -r 160 -png -singlefile "$SOURCE" page-01
pdftoppm -f 7 -l 7 -r 160 -png -singlefile "$SOURCE" page-07
pdffonts -f 1 -l 7 "$SOURCE"
pdfimages -f 1 -l 7 -list "$SOURCE"
```

Both rendered PNGs were visually inspected. Their local witness SHA-256 values:

- page-01: `cf4763a8f831ff6512e79c1efde2c59b559a34c8102a6cbc95a62ed2ad968d14`;
- page-07: `1e98a868bed3ab838a4c02eaaaa763982beace687082cdf85fbc415c144a8c80`.

These PNG hashes identify this rendering, not the original PDF. Different
renderer versions can produce different pixels. No new public image derivative
was published by this check.

## What the images actually show

- PDF page 1: the title identifies the Council of Prisoners' Relatives bulletin,
  number 44, Moscow and 1977.
- PDF page 7, printed page **4**: item 4 refers to imprisoned workers of the
  Christian publisher and visibly names Leven, Koop and Lyudmila/Larisa Zaitseva.
  It asks readers for prayer and petitions and says they remain under
  investigation in Leningrad. The claim is what this edition reports; no
  independent adjudication of those events was performed here.
- In the old receipt, `P6` is a zero-based PDF locator, not the printed page
  number. Future page cards should retain both PDF page 7 and printed page 4.

## Source-class correction

The inspected pages show a modern, clean digital typesetting, blue text and
electronic navigation controls. Embedded fonts include Euro, Baskerville,
Academy and Constantia. On the inspected title and target pages, the small raster
objects are interface graphics, not full-page archival scans. InDesign metadata
independently supports the modern electronic-production observation.

Therefore visual readability does **not** turn this PDF into an archival
facsimile. The previous receipt's proposed transition from visual inspection to
`FACSIMILE VERIFIED` is too broad for the observed object.

Narrow verified state:

`EXACT_BYTES_VERIFIED / SELECTED_RENDERED_PAGES_VISUALLY_VERIFIED / MODERN_TYPESET_EDITION / NOT_ARCHIVAL_FACSIMILE`.

Pending: identify the editor/publisher and transcription provenance, compare the
relevant passage with the original or a verified primary-text edition, verify
any bounded quotation, and resolve image/publication rights. Do not automatically
classify the whole PDF as an authenticated primary-text edition or as an
unreliable source merely from its modern format. Its source chain must decide
the permitted use.

## Handoff boundary

This removes the local renderer/cache obstacle for two specified pages only.
It does not certify all 87 pages, historical completeness, diplomatic fidelity,
archival provenance or publication rights. The source-to-claim and media owners
should consume this receipt in the bounded Baptist editorial wave after release
recovery; no reader-facing text or media was changed by this read-only pass.
