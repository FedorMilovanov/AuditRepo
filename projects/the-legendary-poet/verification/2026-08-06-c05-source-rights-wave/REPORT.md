# Verification Wave Report — C05 source-lineage, caption and publication-rights boundary

## Meta

- Project: The Legendary Poet
- Candidate: `C05`
- Commons title: `Mayakovsky 1917 a.jpg`
- Product evidence anchor read: `FedorMilovanov/TheLegendaryPoet main@5cc5ba89ab95d50eb2c31adcade0dd96e13b40d8`
- Wave type: one-candidate source-lineage / caption / rights verification
- Date: 2026-08-06
- Product mutation: none

## 1. Question

Can C05 move from `unresolvedByDefault` into the production media manifest under the existing publication policy?

The bounded wave separates:

1. exact Commons file identity and Product hash;
2. the availability and authority of the cited original source;
3. independent caption/object corroboration;
4. publication history and jurisdiction-appropriate rights reasoning.

Repeated metadata from Commons mirrors is not an independent witness.

## 2. Existing Product evidence

The Product provenance ledger records:

- candidate ID: `C05`;
- Commons title: `Mayakovsky 1917 a.jpg`;
- creator: `Unknown author`;
- date: `1917`;
- captured PD rationale: `PD-old`;
- bytes: `28,507`;
- original SHA-256: `131b1f7f629ec3b23641639e072367001d31c8ed77bfb5b973801ada09e9fa51`;
- decision before this wave: `unresolved`.

The current Product editorial-decision JSON accepts only C03 and C08. C05 remains in `unresolvedByDefault` and therefore has no production media key.

Product sources:

- `docs/research/mayakovsky/media/pr77-commons-original-provenance-ledger-2026-07-24.md`
- `docs/research/mayakovsky/media/pr77-editorial-decisions-2026-07-24.json`

## 3. Wikimedia Commons record

Commons URL: https://commons.wikimedia.org/wiki/File:Mayakovsky_1917_a.jpg

Observed:

- original file: 396 × 601 pixels, 28,507 bytes;
- description: `Владимир Владимирович Маяковский 1917 год`;
- date field: 1917;
- author: unknown;
- original upload: 13 February 2009;
- source URL: `http://www.fplib.ru/id/gallery/majakovskij_photo/`;
- licensing: generic `PD-old` / Public Domain Mark;
- Commons explicitly says a United States public-domain tag must also be supplied.

The Product SHA-256 corresponds to the file acquired during the prior PR77 provenance run. Commons additionally exposes a SHA-1 checksum for its current file, but this report does not substitute SHA-1 for the Product acquisition hash.

## 4. Source-lineage verification

### 4.1 FPLIB source

The Commons record points to the FPLIB Mayakovsky photo gallery. The link could not be fetched through the available web path during this wave. Search did not produce an inspectable archived capture of the exact gallery page.

Disposition:

- source URL lineage: `recorded`;
- source availability: `unavailable in bounded wave`;
- original caption context, collection owner and publication history from that page: `unverified`.

The report does not treat a dead or inaccessible source URL as evidence that the original page contained more than the Commons uploader recorded.

### 4.2 Derivative repetitions

PICRYL/GetArchive republishes the same Commons file and caption and explicitly identifies Wikimedia Commons as its source. It adds no independent object provenance or rights analysis.

A user-contributed retro-photo page lists a 396 × 601 image with the caption `В.В. Маяковский 1917 год`. Its dimensions and sequence match the Commons/FPLIB image family, but it supplies no primary archive, photographer, accession, printed source or licence evidence.

These repetitions show metadata propagation, not independent verification.

### 4.3 Institutional search boundary

Bounded searches of available State Mayakovsky Museum collection/navigation pages, museum-partner materials, RIA photo features and institutional historical pages did not yield an exact-object record for this composition.

This is a scoped negative result, not a claim that no such object record exists. A museum photo catalogue or offline archive may contain it.

## 5. Caption disposition

### Recorded but not independently verified

- depicted person: Vladimir Vladimirovich Mayakovsky;
- year metadata: 1917;
- photographer: unknown.

Provisional wording if stronger evidence is later obtained:

> Владимир Маяковский. 1917. Фотограф неизвестен.

The bounded wave does not promote this as an independently verified exact-object caption because all located repetitions derive from the same source lineage.

### Not promoted

- shooting place;
- more precise date;
- photographer attribution;
- collection owner, accession number or physical object dimensions;
- early publication event;
- final publication authorization.

## 6. Rights disposition

Current status: `rights-blocked`.

Reasons:

1. Commons uses `PD-old` but explicitly lacks the required United States public-domain tag.
2. Photographer identity and death date are unknown.
3. Original or early publication history is not documented in the available evidence package.
4. The cited FPLIB source context is unavailable.
5. PICRYL/GetArchive public-domain assertions inherit Commons and do not independently establish the missing factual predicates.
6. The Product policy requires an explicit accepted editorial decision and derivative records before publication.

This report is evidence synthesis, not jurisdiction-specific legal advice.

## 7. Final disposition

- Commons/original identity and Product hash: `verified-at-anchor`.
- Current file dimensions/bytes: `verified`.
- FPLIB source URL: `recorded`.
- FPLIB source content/context: `unavailable / unverified`.
- Person/year caption: `repeated from one lineage / not independently verified`.
- Primary exact-object record: `unverified`.
- Photographer: `unknown`.
- Original/early publication: `unverified`.
- Publication authority: `rights-blocked / owner-decision`.
- Product media manifest: `unchanged`.
- Candidate JSON: `unchanged`, remains `unresolvedByDefault`.

## 8. Owner outcomes

1. recover an archived copy of the original FPLIB gallery and preserve the exact source context;
2. locate a primary museum/archive record or early printed publication for the exact composition;
3. record a reviewed public-domain rationale for the exact reproduction and target jurisdictions;
4. obtain permission/licence or a separately rights-safe replacement;
5. park C05 without publication.

## 9. Definition of Done

PASS for a proportional verification wave:

- one bounded candidate selected;
- exact Product identity/hash separated from source availability and caption evidence;
- derivative metadata not counted as an independent witness;
- dead-source limitations recorded without inference;
- scoped institutional search result stated honestly;
- rights gap preserved rather than hidden;
- no Product mutation made without publication authority;
- explicit owner outcomes recorded.
