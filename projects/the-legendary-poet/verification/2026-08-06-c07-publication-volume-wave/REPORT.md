# Verification Wave Report — C07 caption, publication-volume and rights boundary

## Meta

- Project: The Legendary Poet
- Candidate: `C07`
- Commons title: `Mayakovsky 1925.jpg`
- Product evidence anchor read: `FedorMilovanov/TheLegendaryPoet main@5cc5ba89ab95d50eb2c31adcade0dd96e13b40d8`
- Wave type: one-candidate caption / bibliographic publication / exact-page / rights verification
- Date: 2026-08-06
- Product mutation: none

## 1. Question

Can C07 move from `unresolvedByDefault` into the production media manifest under the existing publication policy?

The bounded wave separates:

1. exact Commons file identity and Product acquisition hash;
2. person/year caption evidence;
3. bibliographic proof that the cited source volume existed before 1931;
4. direct inspection of the exact reproduction and dating pages inside that volume/index;
5. primary object/collection provenance;
6. the factual predicates and editorial approval behind `PD-Russia-expired`.

A verified 1928 book edition is not by itself proof that an unavailable cited page contains the exact acquired reproduction.

## 2. Existing Product evidence

The Product provenance ledger records:

- candidate ID: `C07`;
- Commons title: `Mayakovsky 1925.jpg`;
- creator: `Unknown author`;
- date: `1925`;
- captured PD rationale: `PD-Russia-expired`;
- bytes: `123,055`;
- original SHA-256: `525b3401270dd2b365ae3020e7647936395f8cc4259a15da41fa4db22f322700`;
- decision before this wave: `unresolved`.

The current Product editorial-decision JSON accepts only C03 and C08. C07 remains in `unresolvedByDefault` and therefore has no production media key.

Product sources:

- `docs/research/mayakovsky/media/pr77-commons-original-provenance-ledger-2026-07-24.md`
- `docs/research/mayakovsky/media/pr77-editorial-decisions-2026-07-24.json`

## 3. Exact Commons record

Commons page:

- `https://commons.wikimedia.org/wiki/File:Mayakovsky_1925.jpg`

Observed current record:

- original file: 534 × 709 pixels;
- data size: 123,055 bytes;
- SHA-1: `d4d46d7cf9510ad97a79a7acba1bcf8d362a8106`;
- description: `Mayakovsky in 1925`;
- date: 1925;
- author: unknown;
- source: volume 1 of Mayakovsky's collected works, 1928, RSL viewer document `01005404100`, page 7;
- dating source: official ten-volume index, RSL viewer document `01005408088`, page 377;
- licensing template: `PD-Russia-expired`.

The Product SHA-256 is the controlling acquisition witness. Commons dimensions, byte count and SHA-1 corroborate current remote identity but do not replace the Product hash.

## 4. Exact image composition

The acquired portrait shows Mayakovsky:

- leaning sideways against a desk or work surface;
- wearing a light textured suit and striped tie;
- holding papers while a stack of newspapers or proofs rests on the desk;
- looking directly toward the camera;
- against an editorial or office-like wall with small pinned images.

Image search and modern editorial reproductions show the same composition. They support visual continuity but are not independent source, object or rights records.

## 5. Person/year caption evidence

### 5.1 Commons and RSL citation chain

Commons attributes the year 1925 to the official ten-volume index at RSL page 377 and the exact reproduction to volume 1, page 7.

The two viewer pages could not be fetched through the available web path during this wave. Therefore:

- current Commons citation chain: `recorded`;
- exact RSL page 7 reproduction: `unavailable / not directly inspected`;
- exact RSL page 377 index wording: `unavailable / not directly inspected`.

### 5.2 Later scholarly collected-works lineage

The 1955 scholarly full collected works opens volume 1 with the illustration caption `В. Маяковский. Фото 1925 г.`. Multiple searchable electronic reproductions preserve that caption.

This is independent later scholarly corroboration of person and year, but it is not the original 1928 publication and does not name the photographer or location.

### 5.3 Secondary exact-composition reproduction

A Russia Beyond editorial feature reproduces the same desk/newspapers portrait as Vladimir Mayakovsky in 1925. This confirms modern visual/caption continuity, not primary object provenance or publication authority.

## 6. Bibliographic publication evidence

The Fundamental Digital Library of Russian Literature bibliography records:

- `Собрание сочинений в десяти томах`;
- volume 1;
- GIZ, Moscow–Leningrad;
- 1928;
- 360 pages.

The later scholarly edition also states that Mayakovsky's ten-volume collected works began in 1927 and records `Сочинения, т. 1 и 2, ГИЗ, М. 1928`.

Disposition:

- existence and 1928 publication of the cited volume family: `verified-bibliographic`;
- publication before 1 January 1931: `verified for the volume`;
- direct proof that exact page 7 contains the exact C07 reproduction: `unverified because page unavailable`;
- direct proof that index page 377 assigns 1925 to that exact reproduction: `unverified because page unavailable`.

The report does not collapse volume-level bibliography into exact-page evidence.

## 7. Primary object and creator boundary

No primary museum/archive exact-object card, accession number, physical print dimensions, acquisition history or photographer attribution for this precise desk/newspapers composition was obtained in the bounded wave.

A separate 1925 close portrait offered by Litfond and linked to the State Mayakovsky Museum catalogue is a different composition and is excluded from C07 evidence.

Current object class: `primary exact-object provenance unverified / photographer unknown`.

## 8. `PD-Russia-expired` disposition

Commons records a Russia/United States rationale based on qualifying publication before 1 January 1931.

C07 is stronger than C06 on the publication layer because:

- a specific 1928 published volume is identified;
- independent bibliography verifies that volume and year;
- Commons cites a specific reproduction page and a specific dating-index page.

The Product gate nevertheless remains unresolved because:

1. the two decisive RSL pages were not directly inspected in this wave;
2. the exact relationship between the current 534 × 709 reproduction and the 1928 printed image is not independently preserved as an artifact;
3. primary object provenance and photographer remain unknown;
4. Product policy requires an explicit accepted editorial decision, evidence URL and derivative/media records;
5. this report is evidence synthesis, not jurisdiction-specific legal advice.

Current rights class: `pre-1931 volume verified / exact-page predicate unavailable / owner-decision`.

## 9. Caption disposition

### Supported at the current threshold

- depicted person: Владимир Владимирович Маяковский;
- year: 1925;
- photographer: unknown.

Safe bounded caption if publication authority is later accepted:

> Владимир Маяковский. 1925. Фотограф неизвестен.

### Not promoted

- shooting location;
- exact day or month;
- photographer attribution;
- identity of the office/editorial setting;
- primary collection ownership or accession;
- claim that exact RSL pages were inspected;
- final publication authorization.

## 10. Final disposition

- Commons/original identity and Product hash: `verified-at-anchor`.
- Exact composition inspected: `verified`.
- Person / 1925 caption: `corroborated`.
- Photographer: `unknown`.
- Cited volume 1 publication in 1928: `verified-bibliographic`.
- Exact RSL reproduction page 7: `cited / unavailable / unverified-direct`.
- Exact RSL dating index page 377: `cited / unavailable / unverified-direct`.
- Primary exact-object provenance: `unverified`.
- Commons rights rationale: `stronger / pre-1931 volume evidence present`.
- Exact-page rights predicate and Product publication authority: `unverified / owner-decision`.
- Product media manifest: `unchanged`.
- Candidate JSON: `unchanged`, remains `unresolvedByDefault`.

## 11. Owner outcomes

1. recover page 7 from RSL document `01005404100` and preserve the exact reproduction artifact;
2. recover page 377 from RSL document `01005408088` and preserve the exact dating/index statement;
3. establish visual identity between the page-7 reproduction and Product C07;
4. locate a primary object/collection record or photographer attribution if available;
5. record a reviewed jurisdiction-specific public-domain decision;
6. obtain permission/licence or a separately rights-safe reproduction;
7. park C07 without publication.

## 12. Definition of Done

PASS for a proportional verification wave:

- one bounded candidate selected;
- exact Product identity/hash separated from caption, bibliography, exact-page, object and rights evidence;
- exact image composition inspected;
- independent bibliography verified the cited 1928 volume;
- later scholarly caption corroboration recorded without treating it as the original publication;
- inaccessible RSL pages were not claimed as inspected;
- volume-level and page-level evidence remained separate;
- no unsupported location, creator or collection claim promoted;
- no Product mutation made without the explicit publication gate;
- explicit owner outcomes recorded.
