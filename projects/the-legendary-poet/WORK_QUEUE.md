# Optional Work Queue — the-legendary-poet

Эта очередь показывает возможные направления, а не обязательный план. Перед любой source mutation нужно заново проверить актуальный source owner, open PRs и применимое evidence.

## Current selection

Обязательная architecture/runtime repair lane не выбрана. W0–W7 закрыты пропорциональными системными мерами и permanent regression witnesses.

Media verification ведётся по одному кандидату. Проверка C01 завершилась без Product mutation: историческая подпись сужена до подтверждённого объёма, но публикация остаётся заблокированной правовым основанием.

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

#### Remaining candidates

- First question: для какого одного следующего изображения существует authoritative source, publication permission/licence and accurate attribution?
- Required angles: source/provenance witness + rights/owner decision; visual similarity или наличие файла в истории недостаточны.
- Possible outcomes: approve one bounded candidate / caption-verified but rights-blocked / reject / replace / park / owner-decision.

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
