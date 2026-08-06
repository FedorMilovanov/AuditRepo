# Optional Work Queue — the-legendary-poet

Эта очередь показывает возможные направления, а не обязательный план. Перед любой source mutation нужно заново проверить актуальный source owner, open PRs и применимое evidence.

## Current selection

Обязательная architecture/runtime repair lane не выбрана. W0–W7 закрыты пропорциональными системными мерами и permanent regression witnesses.

## Candidate lanes

### 1. Media provenance and rights decisions

- Evidence family: verified Mayakovsky provenance registry, PR77 ledgers and retained forensic archive.
- Known boundary: только две media decisions были независимо подтверждены и введены в source; 28 candidates остались unresolved.
- First question: для какого конкретного изображения существует authoritative source, publication permission/licence and accurate attribution?
- Required angles: source/provenance witness + rights/owner decision; visual similarity или наличие файла в истории недостаточны.
- Possible outcomes: approve one bounded candidate / reject / replace with rights-safe source / park / owner-decision.
- Do not batch-promote all archived candidates.

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
