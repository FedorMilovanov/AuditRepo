# Verification Wave Report — C02 caption, object provenance and publication-rights boundary

## Meta

- Project: The Legendary Poet
- Candidate: `C02`
- Commons title: `Mayakovsky 1912.jpg`
- Product evidence anchor read: `FedorMilovanov/TheLegendaryPoet main@5cc5ba89ab95d50eb2c31adcade0dd96e13b40d8`
- Wave type: one-candidate provenance / caption / rights verification
- Date: 2026-08-06
- Product mutation: none

## 1. Question

Can C02 move from `unresolvedByDefault` into the production media manifest under the existing publication policy?

The policy requires separate proof for:

1. exact Commons original identity and local acquisition hashes;
2. historical person/date/location caption;
3. primary object/collection provenance where claimed;
4. public-domain or licence rationale adequate for publication.

A commercial image catalogue can corroborate a caption and collection attribution, but it is not automatically a primary museum object record or a downstream licence.

## 2. Existing Product evidence

The Product provenance ledger records:

- candidate ID: `C02`;
- Commons title: `Mayakovsky 1912.jpg`;
- creator: `Unknown author`;
- date supplied by Commons: `1912`;
- PD template captured during acquisition: `PD-old`;
- bytes: `20,472`;
- original SHA-256: `09a43e360427ef2a2152d0aa7c66fc091d3554eaf4284dd23de69bd2fdca96a9`;
- decision before this wave: `unresolved`.

The current editorial-decision JSON accepts only C03 and C08. C02 remains in `unresolvedByDefault` and therefore has no production media key.

Product sources:

- `docs/research/mayakovsky/media/pr77-commons-original-provenance-ledger-2026-07-24.md`
- `docs/research/mayakovsky/media/pr77-editorial-decisions-2026-07-24.json`

## 3. External evidence reviewed

### 3.1 Wikimedia Commons description page

URL: https://commons.wikimedia.org/wiki/File:Mayakovsky_1912.jpg

Observed:

- original file: 359 × 515 pixels, 20,472 bytes;
- description: `Владимир Владимирович Маяковский. Фото 1912 г.`;
- date field: `1912`;
- author: unknown photograph;
- source: the FEB electronic edition page for the first volume of Mayakovsky's collected works;
- licensing uses `PD-old` / Public Domain Mark;
- the page explicitly says a United States public-domain tag must also be supplied.

Disposition value:

- strong for exact Commons identity and source metadata;
- not independent caption proof because the Commons record points to the same FEB publication lineage;
- insufficient by itself for the project's cross-jurisdiction publication gate.

### 3.2 FEB / 1955 collected-works publication lineage

The Commons source points to the electronic edition of volume 1 of Mayakovsky's collected works. A separate online reproduction of that volume lists the plate caption `В. Маяковский. Фото 1912 г.` and identifies the edition as Goslitizdat, Moscow, 1955.

This supports the long-standing published caption `Mayakovsky / 1912`, but does not add photographer, location, original publication history or a modern reproduction licence. Because it is the Commons acquisition source lineage, it is corroboration rather than an independent primary object witness.

### 3.3 Fine Art Images / Heritage Images catalogue

Catalogue URL: https://www.heritage-images.com/preview/2665092

Observed entry:

- title: `Portrait of the poet Vladimir Mayakovsky (1893-1930), 1912`;
- author/artist classification: anonymous;
- medium: photograph;
- collection attribution: State Mayakovsky Museum, Moscow;
- commercial image identity: Fine Art Images / Heritage Images, asset `2-665-092` / `2665092`;
- high-resolution commercial file dimensions: 3503 × 4724.

Manual comparison of the catalogue thumbnail returned in image search and the Commons C02 preview shows the same composition:

- young Mayakovsky facing the camera;
- arms crossed at chest level;
- dark shirt with a large light cravat/bow;
- asymmetrical dramatic shadow over one side of the face;
- matching hair, gaze, shoulders and crop.

This is the strongest independent caption and collection-attribution witness found. It is still a commercial intermediary record, not a primary museum object card.

### 3.4 Album / Fine Art Images commercial record

A second commercial record identifies the exact composition as an anonymous photographic portrait, credits the State Mayakovsky Museum and Fine Art Images, and offers licensed use.

It corroborates the Heritage metadata but shares the same commercial image-supply chain; it is not an independent primary institutional witness and grants no free reuse to the Product.

### 3.5 Excluded near-context evidence

The State Mayakovsky Museum partner project publishes another object titled `Владимир Маяковский. Москва, 1912 год`, with dimensions 13.9 × 9 cm and writing on the reverse. The bounded wave could not prove that this is the same physical photograph as Commons C02. It is therefore excluded from C02's exact-object caption and no Moscow shooting-location claim is inferred from it.

## 4. Caption disposition

### Supported for an eventual record

- depicted person: Владимир Владимирович Маяковский;
- year: 1912;
- photographer/creator: unknown;
- collection attribution: commercially catalogued as State Mayakovsky Museum, Moscow, pending primary object verification.

Safe bounded caption if rights and primary object provenance are later resolved:

> Владимир Маяковский. 1912. Фотограф неизвестен.

### Not promoted

- Москва as the place where the photograph was made;
- a more precise date;
- any photographer attribution;
- museum accession number, acquisition history or physical dimensions of the original object;
- claim that the commercial Heritage/Fine Art Images reproduction is freely reusable.

## 5. Rights disposition

Current status: `rights-blocked`.

Reasons:

1. Commons uses `PD-old` but explicitly lacks the required United States public-domain tag.
2. The photographer is unknown and the original publication event/history is not documented in the evidence package.
3. FEB/1955 publication evidence supports the caption but does not by itself establish every target-jurisdiction right in the underlying photograph or current scan.
4. Fine Art Images, Heritage Images and Album offer commercial reproductions/licences rather than a free-use grant to this Product.
5. A collection attribution does not transfer reproduction rights.

This report is evidence synthesis, not jurisdiction-specific legal advice. Publication requires an explicit owner decision backed by one of:

- the primary museum object record plus a stronger public-domain analysis for the exact photograph;
- direct permission or licence;
- a separately sourced rights-safe reproduction;
- a decision to keep the candidate parked.

## 6. Final disposition

- Commons/original identity: `verified-at-anchor`.
- Same-composition match to commercial museum-attributed record: `confirmed-manual`.
- Identity / year 1912 caption: `corroborated`.
- Primary exact-object museum record: `unverified`.
- Shooting location: `unverified`.
- Creator: `unknown`.
- Publication authority: `rights-blocked / owner-decision`.
- Product media manifest: `unchanged`.
- Candidate JSON: `unchanged`, remains `unresolvedByDefault`.

## 7. Definition of Done

PASS for a proportional verification wave:

- one bounded candidate selected;
- exact Product identity/hash evidence separated from external caption evidence;
- commercial collection attribution not misrepresented as primary museum authority;
- same-composition comparison performed;
- supported caption narrowed without location/date inference;
- rights conflict preserved rather than hidden;
- no Product mutation made without publication authority;
- explicit owner outcomes recorded.
