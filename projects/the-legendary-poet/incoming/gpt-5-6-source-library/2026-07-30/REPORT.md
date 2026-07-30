# Agent Work Report

## Meta

- Project: `the-legendary-poet`
- Source repo: `FedorMilovanov/TheLegendaryPoet`
- Research repo: `FedorMilovanov/Research`
- Agent: `gpt-5-6-source-library`
- Date: `2026-07-30`
- Mode: `free-intake / source-rights evidence`
- Research final merge: `693b6cc3721b6057ce15cf7b00251a0c6f64c119`
- Behaviour-bearing successful workflow head: `f4e6d506df253783b2bfccce713edd336c76b34d`
- Successful workflow run: `30500731931`
- Successful job: `90739640069`

## 1. New Findings

### TLP-SOURCE-2026-07-30-01 — A strict 40-PDF literary corpus has reproducible evidence

- Severity: `P3 research-governance / evidence addition`
- Result:
  - 46 identity/title-verified eligible candidates;
  - 41 candidates processed;
  - 40 valid PDFs downloaded;
  - 1 skipped;
  - 610,183,443 bytes;
  - 12,434 pages;
  - 39 Public Domain cards;
  - 1 CC BY-SA 4.0 card;
  - 0 discovery failures.
- Integrity:
  - 40/40 manifest SHA-256 values matched after local re-verification;
  - 40/40 first pages rendered successfully with `pdftoppm`;
  - all 40 first-page renders were visually reviewed.
- Text layer:
  - 19 developed text layers;
  - 4 partial text layers;
  - 17 scan/image-first PDFs.
- Confidence: `high — workflow artifacts, local re-verification and visual evidence`.
- Recommended status: `evidence-addition`, not a production bug.

### TLP-SOURCE-2026-07-30-02 — Broad search success is not sufficient thematic evidence

- Severity: `P2 source-quality governance`.
- Finding:
  - the initial broad pass technically downloaded 40 valid/open PDFs but included incidental surname and phrase matches;
  - therefore a mere `40 files downloaded` gate did not establish relevance.
- Confirmed false positives removed before final acceptance:
  - Wesley Duncan and Duncan Hunter instead of Isadora Duncan;
  - a male Akhmatov instead of Anna Akhmatova;
  - an unrelated A. L. Blok;
  - a Bryusov calendar;
  - a Latin ecclesiastical item containing `urbi et orbi` but unrelated to Valery Bryusov;
  - a semantic duplicate of one translated Pushkin volume.
- Repair implemented in Research:
  - `filemime:pdf` discovery;
  - separate `list=search` and `prop=imageinfo` requests;
  - full author identities and recognised literary titles;
  - topic caps and round-robin selection;
  - explicit exclusion patterns;
  - semantic title deduplication.
- Confidence: `high — reproduced through successive manifests and inspected titles`.
- Recommended status: retain as a permanent source-selection lesson.

### TLP-SOURCE-2026-07-30-03 — Open PDF status does not automatically clear embedded visuals

- Severity: `P2 rights-governance`.
- Evidence:
  - a Commons file card may establish Public Domain/CC status for the uploaded PDF;
  - the book may contain photographs, institutional reproductions or third-party illustrations with separate provenance;
  - production extraction therefore requires item/page-level review.
- Rule:
  - archive inclusion is permitted under the recorded item status;
  - production use of an individual image requires author/date/source/credit/applicability review;
  - institutional terms override a weaker mirror assumption when the asset originates from that institution.
- Recommended status: `confirmed policy`.

### TLP-SOURCE-2026-07-30-04 — OCR must remain targeted, not corpus-wide

- Severity: `P3 methodology`.
- Evidence:
  - 17 of 40 files are scan/image-first;
  - 4 have only partial text layers;
  - indiscriminate OCR of 12,434 pages would create a large unverified derivative text corpus.
- Rule:
  - use existing text layers for navigation only after spot checking;
  - run OCR only for a concrete research question and bounded page range;
  - verify quoted text against the rendered page.
- Recommended status: `confirmed methodology`.

## 2. Corpus Coverage

Final strict corpus:

- Isadora Duncan: 3 books (`My Life`, `Ma vie`, `The Art of the Dance`);
- Alexander Blok: `Стихи о Прекрасной даме` (1905);
- Vladimir Mayakovsky: 2 PDFs;
- Alexander Pushkin: 8 books/translations/biographical studies;
- Mikhail Lermontov: 5 books;
- Ivan Bunin: 1 book;
- Tyutchev in a translated anthology: 1;
- Nikolay Gumilev: `Колчан`, `Жемчуга`;
- Anna Akhmatova: `Вечер` (1912);
- Valery Bryusov: `Urbi et orbi`, `Стефанос`;
- Konstantin Balmont: `Под северным небом`, `Жар-Птица`;
- Igor Severyanin: `Ананасы в шампанском`;
- Russian-poetry anthologies: 3;
- literary periodicals: 4 issues of `Современник` (1837) and 4 `Русский архив` volumes.

Known intentional gaps:

- no reliable strict Commons PDF for Sergey Esenin;
- no reliable strict Commons PDF for Afanasy Fet;
- several other authors produced insufficient title-verified results.

These gaps remain assigned to the IMLI, ФЭБ, РВБ and library-correspondence acquisition line. They were not filled with weak matches.

## 3. Confirmations

### Confirm final Research source of truth

- `SOURCE_LIBRARY/COMMONS_RUSSIAN_LITERATURE_40PLUS_PDF_PASS_2026-07-30.md`
- `SOURCE_LIBRARY/processed/COMMONS_STRICT_40_PROCESSING_INDEX_2026-07-30.md`
- `.github/workflows/build-commons-russian-literature-open-pdf-archive.yml`
- final reproducible chain:
  - `crawl_commons_open_pdfs.py`;
  - `crawl_commons_open_pdfs_search_api.py`;
  - `crawl_commons_strict_literary_pdfs.py`;
  - `crawl_commons_strict_literary_pdfs_v2.py`.

Result: `confirmed-current at Research merge 693b6cc`.

### Confirm public-repository/private-archive boundary

- GitHub stores code, source indexes, manifests, checksums and rights decisions.
- Private Drive stores the four large PDF ZIP parts and manifest/control package.
- AuditRepo stores evidence and policy, not PDF binaries.

Result: `confirmed policy`.

## 4. Challenges / Disputes

### Challenge: “Commons says public domain, therefore every book image is production-ready”

- Status: `rejected assumption`.
- Reason: file-level metadata does not always prove independent rights for every embedded object.
- Required evidence for production visual:
  - exact page/object;
  - creator/date;
  - original institution/source;
  - applicable rights statement;
  - required credit line.

### Challenge: “40 downloaded PDFs means the 40+ research task is closed”

- Status: `rejected assumption`.
- Reason: the broad pass reached 40 but was thematically polluted.
- Correct acceptance threshold:
  - technical validity;
  - rights metadata;
  - identity/title relevance;
  - semantic deduplication;
  - visual review;
  - processing index.

## 5. Repair / Implementation Notes

No production repair is authorised from this intake alone.

Permitted follow-up lanes:

1. bounded page-level reading and citation extraction per article;
2. targeted OCR for a named page range;
3. item-level rights review for a specific visual;
4. academic cross-check against IMLI/ФЭБ/РВБ;
5. Drive archive transfer and checksum witness;
6. source documentation integration in `TheLegendaryPoet`.

Forbidden mixing:

- do not combine a source-rights review with unrelated route/component work;
- do not import all PDF text into production data;
- do not commit large binaries into source or audit repositories;
- do not elevate an open scan over an academic critical edition without explicit reasoning.

## 6. Evidence Locations

Research:

- https://github.com/FedorMilovanov/Research/blob/main/SOURCE_LIBRARY/COMMONS_RUSSIAN_LITERATURE_40PLUS_PDF_PASS_2026-07-30.md
- https://github.com/FedorMilovanov/Research/blob/main/SOURCE_LIBRARY/processed/COMMONS_STRICT_40_PROCESSING_INDEX_2026-07-30.md
- merge SHA: `693b6cc3721b6057ce15cf7b00251a0c6f64c119`

TheLegendaryPoet:

- BrandMark/CI unblock merge: `95f30c2046b9854ac4ce4393d603ba9cc1be3b55`
- final source documentation PR: `#262`

Binary workflow artifacts:

- four parts of ten PDFs each;
- strict manifest artifact;
- retention in GitHub Actions is temporary, so private Drive transfer remains an operational requirement.

## 7. Notes for Verifier

This is a governed evidence intake, not a new product bug. Do not place it in a canonical bug matrix as an application defect. Use it to govern source selection, rights handling, citation extraction and future archive-processing work for `TheLegendaryPoet`.
