# Verification Wave Report — C04 early-publication and rights boundary

## Meta

- Project: The Legendary Poet
- Candidate: `C04`
- Commons title: `Mayakovsky 1915.jpg`
- Product evidence anchor read: `FedorMilovanov/TheLegendaryPoet main@5cc5ba89ab95d50eb2c31adcade0dd96e13b40d8`
- Wave type: one-candidate caption / publication-history / rights verification
- Date: 2026-08-06
- Product mutation: none

## 1. Question

Can C04 move from `unresolvedByDefault` into the production media manifest under the existing publication gate?

C04 is materially different from C01/C02 because its current Commons page uses `PD-Russia-1996` and states a United States URAA rationale. The wave must still separate:

1. exact file/hash identity;
2. historical caption;
3. primary object provenance;
4. inspectable early-publication evidence;
5. the factual predicates and editorial approval behind the rights decision.

## 2. Existing Product evidence

The Product provenance ledger records:

- candidate ID: `C04`;
- Commons title: `Mayakovsky 1915.jpg`;
- creator: `Unknown author`;
- date: `1915`;
- captured PD rationale: `PD-Russia-1996`;
- bytes: `45,040`;
- original SHA-256: `f3ae1beebaa818029f5194f80f771a66f3227c5b6d80326e340579146e5e0fbe`;
- decision before this wave: `unresolved`.

The current Product editorial-decision JSON accepts only C03 and C08. C04 remains `unresolvedByDefault` and has no production media key.

Product sources:

- `docs/research/mayakovsky/media/pr77-commons-original-provenance-ledger-2026-07-24.md`
- `docs/research/mayakovsky/media/pr77-editorial-decisions-2026-07-24.json`

## 3. Exact image and Commons record

Commons URL: https://commons.wikimedia.org/wiki/File:Mayakovsky_1915.jpg

Current original URL: https://upload.wikimedia.org/wikipedia/commons/1/18/Mayakovsky_1915.jpg

Observed:

- current file: 300 × 424 pixels, 45,040 bytes;
- composition: young Mayakovsky facing camera, flat cap, heavy overcoat, large patterned bow, cigarette in mouth;
- description: `Владимир Владимирович Маяковский. Фото 1915 г.`;
- date: 1915;
- photographer: unknown;
- current source field: `Курская правда. — № 86 — 14.04.1940` plus a later Be-in article;
- original 2009 upload source: the FEB electronic edition of volume 1 of the collected works;
- current and historical versions show contrast/crop processing, not a different depicted photograph.

The exact Product hash belongs to the current original acquired in the prior PR77 provenance run. This wave does not claim byte identity with newspaper or book scans.

## 4. Caption and printed-source lineage

### 4.1 1955 collected works / FEB lineage

The electronic reproduction of volume 1 lists the illustration caption `В. Маяковский. Фото 1915 г.`. The volume was published by Goslitizdat in Moscow in 1955.

This is a stable published-caption witness for person and year, and is the source lineage recorded in the original 2009 Commons upload. It does not identify photographer, shooting place, exact date or physical object.

### 4.2 `Курская правда`, №86, 14 April 1940

The current Commons source field cites this issue as an earlier printed source.

The Kursk Regional Universal Scientific Library states that its holdings contain `Курская правда` from 1934 onward, that all issues for 1934–1943 were digitized, and exposes an April 1940 monthly volume. The national newspaper directory independently lists March–December 1940 as available through that library.

The complete April PDF is approximately 38 MB and was discoverable at the library path. During this bounded wave, the exact issue page containing C04 could not be fetched/rendered separately through the available web path. Therefore:

- existence of the digitized April volume: `verified`;
- Commons citation to №86 / 14 April 1940: `recorded`;
- direct confirmation that the exact photograph and caption appear on that page: `unverified`.

The report does not convert a citation into page-level evidence.

### 4.3 Secondary repetitions

Photo albums and public-domain aggregators repeat `В. Маяковский. Фото 1915 г.` and show the same cap/cigarette composition. They add no independent creator, object provenance or licence authority and are not used as decisive witnesses.

## 5. Rights rationale

Commons applies `PD-Russia-1996` and states:

- Russian public-domain conditions for anonymous/pseudonymous works first published before 1 January 1943 where the author did not become known within the specified period;
- United States public-domain reasoning based on the work being public domain in Russia on the URAA date, 1 January 1996, and no qualifying United States republication within 30 days.

This is materially more complete than the C01/C02 `PD-old` pages that lacked a United States tag.

However, Product acceptance remains unresolved because:

1. the exact early-publication page has not been independently inspected in this wave;
2. the original publication history before or at 1940 is not fully reconstructed;
3. primary object/collection provenance is unknown;
4. the Product policy requires an explicit accepted editorial decision with evidence URL and derivative records, not only a captured Commons template;
5. this report is evidence synthesis, not jurisdiction-specific legal advice.

## 6. Caption disposition

### Supported

- depicted person: Владимир Владимирович Маяковский;
- year: 1915;
- photographer: unknown.

Safe bounded caption if publication authority is later accepted:

> Владимир Маяковский. 1915. Фотограф неизвестен.

### Not promoted

- shooting place;
- exact day/month;
- photographer attribution;
- museum/archive accession or ownership;
- claim that the Be-in reproduction supplies rights;
- final publication authorization.

## 7. Final disposition

- Commons/original identity and Product hash: `verified-at-anchor`.
- Exact composition inspected: `verified`.
- Person / 1915 caption: `corroborated`.
- Photographer: `unknown`.
- 1940 newspaper citation: `recorded`.
- Digitized April 1940 archive existence: `verified`.
- Exact newspaper page/image context: `unverified`.
- Primary object provenance: `unverified`.
- Commons rights rationale: `stronger / two-jurisdiction rationale recorded`.
- Product publication authority: `unresolved / owner-decision`.
- Product media manifest and candidate JSON: `unchanged`.

## 8. Owner outcomes

1. inspect and archive the exact №86 page showing the photograph and its printed caption;
2. locate a primary object/collection record;
3. record a reviewed public-domain decision for the exact reproduction and target jurisdictions;
4. obtain permission/licence or a separately rights-safe replacement;
5. park C04 without publication.

## 9. Definition of Done

PASS for a proportional verification wave:

- one bounded candidate selected;
- exact Product identity/hash separated from printed-source and rights evidence;
- exact image composition inspected;
- old and current Commons source lineages distinguished;
- early-publication citation not overstated as page verification;
- stronger Commons PD rationale recorded without converting it into Product approval;
- unsupported location/creator/object claims rejected;
- no Product mutation made without the explicit publication gate.
