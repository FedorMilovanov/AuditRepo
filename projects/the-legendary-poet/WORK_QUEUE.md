# Optional Work Queue — the-legendary-poet

Эта очередь показывает возможные направления, а не обязательный план. Перед любой source mutation нужно заново проверить актуальный source owner, open PRs и применимое evidence.

## Current selection

Обязательная architecture/runtime repair lane не выбрана. W0–W7 закрыты пропорциональными системными мерами и permanent regression witnesses.

Mayakovsky media candidate family также закрыта для текущего Product scope:

- exact originals and hashes: `30/30`;
- accepted active: `5` — C03, C08, C10, C11, C16;
- verified reserve: `1` — C15;
- explicitly excluded: `24`;
- unresolved: `0`;
- source issue #77: closed as completed;
- source merge: `dd2df7be196d81d5212b43a08616f782af2fecf6`.

Отдельной очереди C09–C30 больше нет. Предыдущие покандидатные reports C01–C07 остаются историческим evidence, но не являются активным backlog.

Detailed final evidence:

- `verification/2026-08-06-mayakovsky-media-final-batch/REPORT.md`.

## Candidate lanes

### 1. Materially new media evidence

Use only when появляется конкретное новое основание для пересмотра уже принятого решения:

- primary museum/archive exact-object record;
- inspectable early-publication page;
- explicit permission or licence;
- jurisdiction-specific rights evidence;
- changed editorial need for the verified reserve C15 or an excluded candidate.

A Commons metadata change, derivative mirror, visual resemblance or повтор старой подписи не являются достаточным reverify trigger.

Possible outcomes:

- reopen one bounded candidate;
- keep the terminal exclusion;
- promote the verified reserve into one real active use;
- replace an active asset if stronger evidence requires it;
- no action.

### 2. Release-specific live witness

Use only when владелец планирует значимый release, DNS/hosting change или получает конкретный production incident.

First question: требуется ли live evidence для решения, или source/build/browser contract уже достаточен?

Possible outcomes: narrow live check / no live check needed / incident repair wave.

This is not continuous monitoring and not a standing requirement after each commit.

## Adding a lane

A useful entry needs:

- concrete question;
- evidence source;
- expected user/system benefit;
- first narrow verification;
- possible outcomes including park, accepted-risk or no fix.

Do not copy a global source HEAD, every workflow run or a historical matrix into this file.
