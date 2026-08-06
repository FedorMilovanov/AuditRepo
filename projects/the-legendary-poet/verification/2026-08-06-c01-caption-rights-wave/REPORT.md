# Verification Wave Report — C01 caption and publication-rights boundary

## Meta

- Project: The Legendary Poet
- Candidate: `C01`
- Commons title: `Mayakovsky 1910.jpg`
- Product evidence anchor read: `FedorMilovanov/TheLegendaryPoet main@5cc5ba89ab95d50eb2c31adcade0dd96e13b40d8`
- Wave type: one-candidate provenance / caption / rights verification
- Date: 2026-08-06
- Product mutation: none

## 1. Question

Can C01 move from `unresolvedByDefault` into the production media manifest under the existing publication policy?

The policy requires three independent layers:

1. exact Commons original identity and local acquisition hashes;
2. independent institutional or photo-chronicle support for the historical caption;
3. a separately recorded public-domain or licence rationale adequate for publication.

A positive result in one layer cannot substitute for another.

## 2. Existing Product evidence

The Product provenance ledger records:

- candidate ID: `C01`;
- Commons title: `Mayakovsky 1910.jpg`;
- creator: `Unknown author`;
- date supplied by Commons: `1910-02-01`;
- PD template captured during acquisition: `PD-old`;
- bytes: `21,216`;
- original SHA-256: `9183139000932f1984f3e760efcd918b59425a89c3fddc5b48752254a3e42482`;
- decision before this wave: `unresolved`.

The current editorial-decision JSON accepts only C03 and C08. C01 remains in `unresolvedByDefault` and therefore has no production media key.

Product sources:

- `docs/research/mayakovsky/media/pr77-commons-original-provenance-ledger-2026-07-24.md`
- `docs/research/mayakovsky/media/pr77-editorial-decisions-2026-07-24.json`

## 3. External evidence reviewed

### 3.1 Wikimedia Commons description page

URL: https://commons.wikimedia.org/wiki/File:Mayakovsky_1910.jpg

Observed:

- current file: 356 × 521 pixels, approximately 21 KB;
- description: `Ученик Строгановского училища. Москва.`;
- date field: `1 February 1910`;
- author: unknown;
- source links point to VisualRIA and an old Rulex page;
- licensing uses `PD-old` / Public Domain Mark;
- the page explicitly warns that a United States public-domain tag is missing.

Disposition value:

- strong for exact Commons page identity and current metadata;
- not independent caption verification because it is the acquisition source itself;
- insufficient by itself for the project’s cross-jurisdiction publication gate.

### 3.2 State Mayakovsky Museum collection object

Museum-partner artifact URL: https://www.togdazine.ru/article/1161

Observed object record:

- title: `Маяковский в Москве, 1910 год`;
- object caption: `В.В. Маяковский. Москва, 1910 г.`;
- physical dimensions: `12,9 × 7 см`;
- collection history: in the State Museum of V.V. Mayakovsky since 1972, received from L.V. Mayakovskaya;
- page explicitly attributes the photograph to the collection of the State Museum of V.V. Mayakovsky.

This is the strongest independent object/caption witness found in the wave.

The page also states that reuse of its published materials requires permission. Therefore its displayed reproduction is evidence for caption/object provenance, not a rights-free download source.

### 3.3 RIA Novosti Mediabank archive record

Selection URL: https://riamediabank.ru/selection/list_1003121/

Stable item identity: `#1145763` / `https://riamediabank.ru/media/1145763.html`

Observed archive caption in the selection:

- `Советский поэт Владимир Маяковский в Москве. Фото 1910 года.`
- catalogue date displayed as `01.02.1910`.

This independently supports identity, Moscow and the year 1910. The media bank sells/licences access and is not a rights-free source for Product ingestion. Its date field does not prove that 1 February was the actual day the photograph was made.

### 3.4 Russian Historical Society visual witness

URL: https://historyrussia.org/sobytiya/vladimir-mayakovskij-vazhnejshee-dlya-menya-vremya.html

The same hat-and-cloak portrait is used in an institutional historical article about young Mayakovsky. The local caption is only `Владимир Маяковский в юности`; it supports identity and visual continuity but adds no exact date, creator or rights authority.

## 4. Visual comparison

Manual visual comparison of the rendered C01/Commons image and the museum/Russian Historical Society witnesses found the same composition:

- young Mayakovsky facing the camera;
- broad dark hat with the same brim geometry;
- dark pelerine/cloak with pronounced shoulder forms;
- light shirt and narrow tied scarf;
- same head angle, gaze, facial proportions and crop.

The museum witness is a sepia/tonal reproduction and the Commons C01 is a smaller monochrome reproduction. The comparison supports same-object identity; it is not a byte-identity claim.

## 5. Caption disposition

### Supported for an eventual record

- depicted person: Владимир Владимирович Маяковский;
- place: Москва;
- year: 1910;
- photographer/creator: unknown;
- collection provenance: State Museum of V.V. Mayakovsky; received in 1972 from L.V. Mayakovskaya.

Safe bounded caption if rights are later resolved:

> Владимир Маяковский. Москва, 1910. Фотограф неизвестен.

### Not promoted

- exact date `1 February 1910` — catalogue/Commons precision is not independently explained;
- `ученик Строгановского училища` — historically plausible and repeated by secondary pages, but not stated in the museum object record used as the independent exact-object witness;
- any photographer attribution;
- claim that the museum or RIA reproduction itself is freely reusable.

## 6. Rights disposition

Current status: `rights-blocked`.

Reasons:

1. Commons uses `PD-old` but explicitly lacks the required United States public-domain tag.
2. The creator is unknown and the original publication event/history is not documented in the current evidence package.
3. The museum-partner page restricts reuse of its site materials.
4. RIA Mediabank is a licensed commercial archive.
5. Caption verification does not transfer reproduction rights from either institution.

This report is evidence synthesis, not jurisdiction-specific legal advice. Publication requires an explicit owner decision backed by one of:

- a stronger public-domain analysis for the exact Commons original in the project’s target jurisdictions;
- direct permission or licence;
- a separately sourced rights-safe reproduction;
- a decision to keep the candidate parked.

## 7. Final disposition

- Commons/original identity: `verified-at-anchor`.
- Same-object visual match: `confirmed-manual`.
- Identity / Moscow / 1910 caption: `verified`.
- Exact day: `unverified`.
- Stroganov-school object caption: `not promoted`.
- Creator: `unknown`.
- Publication authority: `rights-blocked / owner-decision`.
- Product media manifest: `unchanged`.
- Candidate JSON: `unchanged`, remains `unresolvedByDefault`.

## 8. Definition of Done

PASS for a proportional verification wave:

- one bounded candidate selected;
- exact local evidence and external witnesses separated;
- same-object visual comparison performed;
- supported caption narrowed without inference;
- rights conflict preserved rather than hidden;
- no Product mutation made without publication authority;
- explicit next owner outcomes recorded.
