# Optional Work Queue — the-legendary-poet

Эта очередь показывает возможные направления, а не обязательный план. Перед любой source mutation нужно заново проверить актуальный source owner, open PRs и применимое evidence.

## Current selection

Обязательная architecture/runtime repair lane не выбрана. W0–W7 закрыты пропорциональными системными мерами и permanent regression witnesses.

Media verification ведётся по одному кандидату:

- C01: `caption-verified / rights-blocked / no Product change`;
- C02: `caption-corroborated / primary-object-unverified / rights-blocked / no Product change`;
- C04: `caption-corroborated / early-publication-cited / stronger-rights-rationale / source-page-unverified / no Product change`;
- C05: `caption-repeated / original-source-unavailable / independent-object-unverified / rights-blocked / no Product change`;
- C06: `caption/object-verified / early-publication-unverified / rights-rationale-predicate-unverified / no Product change`;
- C07: `caption/date-corroborated / pre-1931-volume-verified / exact-source-pages-unavailable / no Product change`.

## Candidate lanes

### 1. Media provenance and rights decisions

- Evidence family: verified Mayakovsky provenance registry, PR77 ledgers and retained forensic archive.
- Known boundary: только две media decisions были независимо подтверждены и введены в source; 28 candidates остаются publication-unresolved.
- Do not batch-promote all archived candidates.

#### C01 — `Mayakovsky 1910.jpg`

- Verification result: `caption-verified / rights-blocked / no Product change`.
- Independently supportable caption scope: Владимир Маяковский; Москва; 1910 год; фотограф неизвестен.
- Not supportable at the current threshold:
  - exact day `1 February 1910`;
  - phrase `ученик Строгановского училища` as an object-level caption for this exact reproduction;
  - unrestricted publication in every target jurisdiction.
- Object witness: Государственный музей В.В. Маяковского identifies the same photograph as Moscow, 1910, dimensions 12.9 × 7 cm, received in 1972 from L.V. Mayakovskaya.
- Rights blocker: the Commons page uses `PD-old`, warns that a United States public-domain tag is missing, and does not prove the original publication history; the museum-partner and RIA reproductions are not free-download substitutes.
- Owner choices:
  1. obtain a stronger jurisdiction-specific public-domain rationale for the Commons original;
  2. obtain explicit permission/licence from the relevant rightsholder or collection;
  3. replace with a separately rights-safe image;
  4. keep C01 parked and unpublished.
- Until one choice is evidenced, C01 must not enter the production media manifest.

#### C02 — `Mayakovsky 1912.jpg`

- Verification result: `caption-corroborated / primary-object-unverified / rights-blocked / no Product change`.
- Supportable caption scope: Владимир Маяковский; 1912 год; фотограф неизвестен.
- Commercial collection witness: Fine Art Images / Heritage Images identifies the exact portrait as an anonymous photograph from the collection of the State Mayakovsky Museum, Moscow.
- Evidence limitation: no primary museum object card, accession record or official collection page for this exact portrait was found in the bounded wave. Museum location is not treated as the place of photography.
- Not supportable at the current threshold:
  - Москва as shooting location;
  - a more precise date;
  - photographer attribution;
  - direct museum accession/provenance details for this exact object;
  - unrestricted publication in every target jurisdiction.
- Rights blocker: Commons uses `PD-old` and explicitly lacks a United States public-domain tag; original publication history is not established; Fine Art Images/Heritage offers a licensed commercial reproduction rather than a free-use grant.
- Owner choices:
  1. obtain the primary State Mayakovsky Museum object record for the exact portrait;
  2. establish a jurisdiction-appropriate public-domain rationale including publication history;
  3. obtain permission/licence;
  4. replace with a separately rights-safe image;
  5. keep C02 parked and unpublished.
- Until both object provenance and publication authority are evidenced, C02 must not enter the production media manifest.

#### C04 — `Mayakovsky 1915.jpg`

- Verification result: `caption-corroborated / early-publication-cited / stronger-rights-rationale / source-page-unverified / no Product change`.
- Exact visual subject: close portrait of young Mayakovsky in a flat cap, overcoat and bow, with a cigarette in his mouth.
- Supportable caption scope: Владимир Маяковский; 1915 год; фотограф неизвестен.
- Published-caption lineage:
  - Commons originally cited the 1955 first volume of the collected works with the plate caption `В. Маяковский. Фото 1915 г.`;
  - the current Commons record additionally cites `Курская правда`, №86, 14 April 1940;
  - the Kursk regional library confirms that all 1940 March–December newspaper issues are digitized and provides the April monthly volume.
- Evidence limitation: the bounded wave could not directly inspect the exact newspaper page containing this photograph inside the approximately 38 MB April volume, so the 1940 source citation is not promoted to independently page-verified publication proof.
- Rights position is stronger than C01/C02 but not yet accepted:
  - Commons uses `PD-Russia-1996` and states both Russian public-domain and United States URAA reasoning;
  - that reasoning depends on anonymous early publication and related factual predicates;
  - the cited 1940 issue/page and original publication history still need direct verification for the project's explicit editorial gate.
- Not supportable at the current threshold:
  - shooting location;
  - exact date within 1915;
  - photographer attribution;
  - primary object/collection accession provenance;
  - final publication authorization.
- Owner choices:
  1. inspect and preserve the exact №86 newspaper page showing the photograph and caption;
  2. obtain a primary object/collection record if one exists;
  3. record a reviewed jurisdiction-specific PD decision for the exact reproduction;
  4. obtain permission or a rights-safe replacement;
  5. keep C04 parked and unpublished.
- Until the source page and explicit editorial rights decision are recorded, C04 must not enter the production media manifest.

#### C05 — `Mayakovsky 1917 a.jpg`

- Verification result: `caption-repeated / original-source-unavailable / independent-object-unverified / rights-blocked / no Product change`.
- Exact Product/Commons identity: 396 × 601 JPEG, 28,507 bytes, unknown author, year field 1917, Product SHA-256 `131b1f7f629ec3b23641639e072367001d31c8ed77bfb5b973801ada09e9fa51`.
- Current Commons source points to `fplib.ru/id/gallery/majakovskij_photo/`; that source could not be fetched through the available path.
- The wording `В.В. Маяковский 1917 год` is repeated by PICRYL/GetArchive and a user-contributed retro-photo page, but those records derive from Commons or repeat its dimensions and supply no independent object provenance.
- Evidence limitation:
  - no primary museum/archive exact-object record was found in the bounded wave;
  - no inspectable publication page or accession history was obtained;
  - the 1917 date is therefore recorded as source metadata, not independently verified object dating.
- Rights blocker:
  - Commons uses generic `PD-old`;
  - the page explicitly says a United States public-domain tag is missing;
  - photographer identity and original publication history are unknown;
  - derivative public-domain aggregators do not cure those missing predicates.
- Not supportable at the current threshold:
  - shooting location;
  - more precise date;
  - photographer attribution;
  - primary collection ownership/accession;
  - final publication authorization.
- Owner choices:
  1. recover an archived copy of the original FPLIB gallery with source context;
  2. locate a primary museum/archive object record or early printed publication;
  3. establish a reviewed jurisdiction-specific public-domain rationale;
  4. obtain permission or a separately rights-safe replacement;
  5. keep C05 parked and unpublished.
- Until independent caption/object evidence and publication authority are recorded, C05 must not enter the production media manifest.

#### C06 — `Mayakovsky 1918.jpg`

- Verification result: `caption/object-verified / early-publication-unverified / rights-rationale-predicate-unverified / no Product change`.
- Exact Product/Commons identity: 316 × 401 JPEG, 32,218 bytes, unknown author, year field 1918, Product SHA-256 `6f01b2d971f1be0a49dc65c61a5ba02563a880cf2882f58c68ebc09398518b67`.
- Independent primary witness: `History of Russia in Photographs` identifies the same tree/cane/pond composition as `Владимир Маяковский в Екатерининском парке`, Moscow, 1918, unknown author, from the State Mayakovsky Museum.
- Culture.ru independently repeats the same museum-backed person/place/year caption.
- Supportable caption scope: Владимир Маяковский в Екатерининском парке; Москва; 1918 год; фотограф неизвестен.
- Evidence limitation:
  - the old Russian State Library source URL cited by Commons is currently unavailable through the inspected path;
  - no inspectable pre-1931 publication page, issue, book plate or catalogue statement establishing first publication was obtained;
  - museum object/caption evidence proves creation context, not publication date;
  - accession number, physical dimensions and acquisition history remain unverified.
- Rights position:
  - Commons `PD-Russia-expired` states Russian and United States pre-1931 publication routes;
  - this is stronger than generic `PD-old`, but the decisive early-publication predicate is not independently proved for the exact reproduction;
  - the Product editorial gate therefore remains unresolved.
- Owner choices:
  1. recover and preserve the cited RSL page with its exact source context;
  2. locate an inspectable pre-1931 publication or primary catalogue publication statement;
  3. obtain the museum accession/object record if available;
  4. record a reviewed jurisdiction-specific public-domain decision;
  5. obtain permission or a separately rights-safe reproduction;
  6. keep C06 parked and unpublished.
- Until early publication and explicit editorial authority are evidenced, C06 must not enter the production media manifest.

#### C07 — `Mayakovsky 1925.jpg`

- Verification result: `caption/date-corroborated / pre-1931-volume-verified / exact-source-pages-unavailable / no Product change`.
- Exact Product/Commons identity: 534 × 709 JPEG, 123,055 bytes, unknown author, year field 1925, Product SHA-256 `525b3401270dd2b365ae3020e7647936395f8cc4259a15da41fa4db22f322700`.
- Exact visual subject: Mayakovsky leans against an editorial desk with newspapers/proofs, wearing a light suit and striped tie.
- Commons links the exact reproduction to RSL document `01005404100`, volume 1, page 7, and links the 1925 dating to official index document `01005408088`, page 377.
- Independent bibliographic witness: FEB records volume 1 of the ten-volume collected works as GIZ, Moscow–Leningrad, 1928, 360 pages; later scholarly volume 1 repeats the caption `В. Маяковский. Фото 1925 г.`.
- Evidence limitation:
  - the two decisive RSL viewer pages could not be fetched through the available path;
  - the 1928 volume is bibliographically verified, but exact page-7 visual identity and page-377 wording are not directly preserved in this wave;
  - primary object/collection provenance, photographer and shooting location remain unknown.
- Rights position:
  - `PD-Russia-expired` has a materially supported pre-1931 volume predicate;
  - exact-page publication and dating still need direct artifact verification before Product approval.
- Owner choices:
  1. recover RSL volume page 7 and index page 377;
  2. preserve page artifacts and confirm the exact visual match;
  3. locate primary object/collection provenance or photographer attribution;
  4. record a reviewed jurisdiction-specific public-domain decision;
  5. obtain permission or a rights-safe replacement;
  6. keep C07 parked and unpublished.
- Until exact pages and explicit editorial authority are recorded, C07 must not enter the production media manifest.

#### Remaining candidates

- First question: для какого одного следующего изображения существует authoritative source, publication permission/licence and accurate attribution?
- Required angles: source/provenance witness + rights/owner decision; visual similarity или наличие файла в истории недостаточны.
- Possible outcomes: approve one bounded candidate / caption-verified but rights-blocked / caption-corroborated but primary-object-unverified / caption-object-verified but early-publication-unverified / pre-1931-volume-verified but exact-pages-unavailable / early-publication-cited but page-unverified / original-source-unavailable / reject / replace / park / owner-decision.

### 2. Release-specific live witness

- Use only when владелец планирует значимый release, DNS/hosting change или получает конкретный production incident.
- First question: требуется ли live evidence для решения, или source/build/browser contract уже достаточен?
- Possible outcomes: narrow live check / no live check needed / incident repair wave.
- This is not continuous monitoring and not a standing requirement after each commit.

## Adding a lane

A useful entry needs:

- concrete question;
- evidence source;
- expected user/system benefit;
- first narrow verification;
- possible outcomes including park, accepted-risk or no fix.

Do not copy a global source HEAD, every workflow run or a historical matrix into this file.
