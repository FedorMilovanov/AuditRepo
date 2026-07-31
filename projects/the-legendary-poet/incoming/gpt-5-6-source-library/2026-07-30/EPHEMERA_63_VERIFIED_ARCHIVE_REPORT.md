# TheLegendaryPoet — verified 63-item ephemera archive

**Audit date:** 2026-07-30  
**Source repository:** `FedorMilovanov/Research`  
**Research merge:** `5462ac4dab1f6bb2071c99d904dd28a44945595f`  
**Acquisition workflow run:** `30506103277`  
**Status:** `VERIFIED PRIVATE ARCHIVE / ITEM-LEVEL PRODUCTION REVIEW STILL REQUIRED`

## Executive result

A review-first open-license archive has been completed:

- 96 candidates survived automated topic, license and format screening;
- five topic-grouped contact sheets were rendered;
- 63 objects were manually selected by object type and project relevance;
- current Wikimedia Commons license metadata was fetched again before original download;
- 63/63 original files downloaded;
- 63/63 images decoded successfully;
- 63/63 SHA-256 values recorded;
- total size: **106,506,161 bytes**;
- zero missing, failed, closed-license or duplicate-SHA records.

## License distribution

| License | Files |
|---|---:|
| Public domain | 46 |
| CC BY 2.0 | 2 |
| CC BY 2.5 | 1 |
| CC BY-SA 2.5 | 2 |
| CC BY-SA 3.0 | 5 |
| CC BY-SA 4.0 | 7 |
| **Total** | **63** |

All accepted items had current structured Commons metadata matching Public Domain, CC BY or CC BY-SA. No Fair use, NonCommercial, NoDerivatives, copyrighted or all-rights-reserved item was accepted.

## Archive composition

### Poet manuscripts and autographs — 14

- Lermontov: 3;
- Yesenin: 3;
- Mayakovsky: 4;
- Blok: 1;
- Akhmatova: 1;
- Tsvetaeva: 1;
- Pasternak: 1.

### Historical covers — 11

- Russian Futurism: 2;
- Kruchenykh / avant-garde circle: 4;
- Mayakovsky: 4;
- `Весы`: 1.

### Literary places — 15

- Yesenin: 3;
- Mayakovsky: 1;
- Pasternak: 3;
- Pushkin: 3;
- Lermontov: 1;
- Akhmatova: 1;
- Tsvetaeva: 3.

### Manuscript families — 15

- Codex Sinaiticus: 4;
- Dead Sea Scrolls / Qumran: 4;
- Papyrus Bodmer / P72: 2;
- Hebrew Bible manuscripts: 5.

### Reformation and Puritans — 8

- John Calvin: 3;
- Martin Luther: 2;
- John Owen: 1;
- Thomas Goodwin: 1;
- Westminster Assembly: 1.

## Manual rejection evidence

The review sheets prevented the following false positives from entering the final archive:

- postage stamps returned as manuscripts;
- a portrait returned as a literary place;
- museum signs and unrelated museum objects;
- modern autograph sessions;
- duplicate crops of the same historical cover;
- Martin Luther King returned for Martin Luther;
- `Sir John Owen` and unrelated John Owen namesakes;
- unrelated Thomas Goodwin namesakes;
- individual portraits returned for Westminster Assembly searches;
- modern event/exhibition material presented beside historical objects.

This demonstrates that binary validity and an open license are insufficient without editorial object-type review.

## Re-verification performed before download

For every allowlisted Commons file, the downloader re-fetched:

- description page;
- original URL;
- MIME and advertised size;
- `LicenseShortName`;
- `UsageTerms`;
- `AttributionRequired`;
- Artist;
- Credit;
- Source;
- Date.

The original bytes were downloaded unchanged. Pillow decode and SHA-256 checks were then executed. Byte-identical duplicates were configured to fail the final gate.

## Reproducible Research files

```text
SOURCE_LIBRARY/tools/build_ephemera_review_candidates.py
.github/workflows/build-ephemera-review-candidates.yml
SOURCE_LIBRARY/EPHEMERA_REVIEW_WORKFLOW_2026-07-30.md
SOURCE_LIBRARY/tools/download_approved_ephemera_originals.py
.github/workflows/download-approved-ephemera-originals.yml
SOURCE_LIBRARY/processed/APPROVED_EPHEMERA_63_ALLOWLIST_2026-07-30.md
```

## Persistent storage evidence

The binary archive is stored outside git at:

```text
/The Legendary Poet — Source Archive/
└── APPROVED EPHEMERA 63 — 2026-07-30/
    ├── 01 — ORIGINALS 01-16.zip
    ├── 02 — ORIGINALS 17-32.zip
    ├── 03 — ORIGINALS 33-48.zip
    ├── 04 — ORIGINALS 49-63.zip
    ├── 05 — MANIFEST RIGHTS SHA256.zip
    └── 06 — REVIEW CONTACT SHEETS AND CANDIDATES.zip
```

The intended long-term destination remains the private Google Drive owned by `oldpoet2025@gmail.com`. The Drive connector was unavailable during this pass, so the persistent ChatGPT Library is the current protected copy.

## Rights boundary

`VERIFIED PRIVATE ARCHIVE` means the original may be retained in the research archive with its current provenance record. It does **not** automatically mean that every object is approved for production publication.

Before public use, item-level review must still confirm:

- the institution or original source;
- applicability of the Commons license to the digital copy;
- exact attribution and credit line;
- whether an embedded manuscript/photograph has additional restrictions;
- relevance and context for the target article/page;
- whether a modern photograph of a museum interior creates separate rights concerns.

## Audit disposition

- acquisition integrity: `PASS`;
- license gate: `PASS`;
- format validation: `PASS`;
- SHA-256 coverage: `PASS`;
- manual object-type review: `PASS`;
- private persistence: `PASS`;
- Google Drive replication: `PENDING CONNECTOR RECOVERY`;
- blanket production approval: `NOT GRANTED`.
