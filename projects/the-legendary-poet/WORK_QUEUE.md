# Optional Work Queue — the-legendary-poet

Эта очередь показывает возможные направления, а не обязательный план. Перед любой source mutation нужно заново проверить актуальный source owner, open PRs и применимое evidence.

## Current selection

Обязательная architecture/runtime repair lane не выбрана. W0–W7 закрыты пропорциональными системными мерами и permanent regression witnesses.

Media verification ведётся по одному кандидату:

- C01: `caption-verified / rights-blocked / no Product change`;
- C02: `caption-corroborated / primary-object-unverified / rights-blocked / no Product change`;
- C04: `caption-corroborated / early-publication-cited / stronger-rights-rationale / source-page-unverified / no Product change`.

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
- Owner choices: stronger public-domain rationale / explicit permission / rights-safe replacement / park.

#### C02 — `Mayakovsky 1912.jpg`

- Verification result: `caption-corroborated / primary-object-unverified / rights-blocked / no Product change`.
- Supportable caption scope: Владимир Маяковский; 1912 год; фотограф неизвестен.
- Commercial collection witness: Fine Art Images / Heritage Images identifies the exact portrait as an anonymous photograph from the State Mayakovsky Museum collection.
- Evidence limitation: no primary museum object card, accession record or official collection page for this exact portrait was found. Museum location is not treated as the place of photography.
- Rights blocker: Commons uses `PD-old` and explicitly lacks a United States public-domain tag; original publication history is not established; commercial catalogue access is not a free-use grant.
- Owner choices: primary object record / stronger public-domain rationale / explicit permission / rights-safe replacement / park.

#### C04 — `Mayakovsky 1915.jpg`

- Verification result: `caption-corroborated / early-publication-cited / stronger-rights-rationale / source-page-unverified / no Product change`.
- Exact visual subject: close portrait of young Mayakovsky in a flat cap, overcoat and bow, with a cigarette in his mouth.
- Supportable caption scope: Владимир Маяковский; 1915 год; фотограф неизвестен.
- Published-caption lineage:
  - Commons originally cited the 1955 first volume of the collected works with the plate caption `В. Маяковский. Фото 1915 г.`;
  - the current Commons record additionally cites `Курская правда`, №86, 14 April 1940;
  - the Kursk regional library confirms that all 1940 March–December newspaper issues are digitized and provides the April monthly volume.
- Evidence limitation: the bounded wave could not directly inspect the exact newspaper page containing this photograph inside the 38 MB April volume, so the 1940 source citation is not promoted to independently page-verified publication proof.
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

#### Remaining candidates

- First question: для какого одного следующего изображения существует authoritative source, publication permission/licence and accurate attribution?
- Required angles: exact file identity + caption evidence + primary object/publication provenance + rights decision.
- Possible outcomes: accepted / caption-verified but rights-blocked / early-publication cited but page-unverified / reject / replace / park / owner-decision.

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
