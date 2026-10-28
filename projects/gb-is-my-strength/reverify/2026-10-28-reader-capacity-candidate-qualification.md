# Квалификация candidate: reader measure и compact desktop capacity — 2026-10-28

## 1. Якорь и disposition

Независимо проверен открытый Product PR #2206 на exact head `fd7e4e61bd76cde2394191089efec647d05e1d87`, base main `90a65c056640e2d655c3dea96498290283dde238`. Канонический `npm run strangler:build:production-like` на чистом exact head прошёл: 104 Astro pages, 0 errors, 7 прежних hints, post-build asset/CSP/projection/reader guards зелёные. Дополнительный exact-head `node scripts/check-engine-contracts.js` прошёл.

Disposition: **OPEN-OWNER-QUALIFIED, NOT CLOSED** для `GBS-SERIES-READER-COMPACT-DESKTOP-CAPACITY-CONFLICT` и `GBS-READER-MEASURE-DESKTOP-ALIAS-AND-BREAKPOINT-REGRESSION`. Candidate устраняет проверенные геометрические проявления, но PR ещё открыт, hosted exact-head checks не завершены, resulting main отсутствует. Активная арифметика остаётся **47 direct + 8 improvements + 0 residuals + 22 systems = 77**.

Машинное свидетельство: `evidence/2026-10-28-reader-capacity-candidate-qualification.jsonl`. Скриншоты и полные outputs оставлены вне Git в `/tmp/wave8`.

## 2. Native measure path и геометрия

На production-like `dist` нативно открывались «Настройки чтения», затем нажимались `narrow`, `normal`, `wide`; после `wide` выполнялся реальный reload. Проверены shared `/articles/kak-hranit-serdce/` и Teen `/articles/vzroslaya-doch-otets-brak-soglasie-granitsy-vlasti/` на 900, 1023, 1024, 1100, 1200, 1280, 1366, 1440, 1599, 1600 и 1920 px.

На обеих families во всём заявленном desktop диапазоне 1023–1920:

- prose N/M/W = **576/688/712 px**;
- shell N/M/W = **624/736/760 px**;
- signed `data-reader-measure` совпадает с native action и сохраняется после reload;
- 1023→1024 и 1599→1600 не дают отрицательного скачка;
- `scrollWidth == clientWidth`, горизонтального document overflow нет.

Таким образом, прежние shared 492.7 px collapse, Teen bypass и desktop alias воспроизвести не удалось. На 900 px остаётся **672/772/772 px prose**: normal/wide alias под shell cap 820 px. Это вне заявленного desktop closure range, но результат не скрывается и не превращается в универсальное утверждение.

## 3. Rail, fixed controls и обычный scroll

После native выбора measure указатель был переведён в prose, затем выполнен обычный wheel scroll до `scrollY=5600`. При 1366/1440 rail занимает x≈33–339, prose x≈402–1094, правый fixed action cluster x≈1210–1318: rail и cluster не пересекают painted paragraphs на shared и Teen representative routes. Историческое Teen-проявление, где пять правых controls покрывали prose, не воспроизводится.

При 1023–1280 candidate намеренно держит compact top/bottom chrome вместо преждевременного rail. Нижняя панель остаётся viewport overlay и визуально закрывает край следующей строки в момент scroll; это ожидаемая модель текущего compact chrome, но формулировка closure contract «no prose occlusion» требует owner/resulting-main reconciliation, поэтому данный pass не объявляет полное закрытие capacity row.

## 4. Cold first paint

В 18 изолированных cold contexts (2 families × 1023/1024/1366 × N/M/W), Dark + reduced motion, состояние записывалось до navigation. Во всех случаях:

- первый наблюдаемый `.page-wrap` уже имел конечные x/width; последующей owner relocation не было;
- persisted attribute и конечная геометрия совпали;
- broken images 0, overflow 0;
- CLS range **0.000601–0.041962**, то есть прежний 0.296875–0.375549 конфликт `padding-left` не воспроизводится;
- измеренный LCP ≤564 ms; четыре shared 1366 записи вернули 0 из-за отсутствия buffered LCP entry и не используются как performance claim.

Shared route дал по одному `net::ERR_CONNECTION_CLOSED` от внешней доставки; Teen control чист. Ошибка не связана с reader owner и отфильтрована как sandbox egress noise.

## 5. Screenshot, Axe и residual reconciliation

Сделаны screenshot controls: shared 1024 Dark/reduce после scroll с compact chrome и Teen 1366 Light/reduce с rail. Broken images и overflow — 0. Teen Axe — 0 violations. Shared Axe повторил два `color-contrast` nodes (`.mobile-btoc-section__label`, `#gbs2MobSec`, 2.09:1), уже принадлежащие активному `GBS-TEXT-CONTRAST-RESIDUAL-BATCH`; новый ID не создаётся и reader capacity repair не получает чужую palette-задачу.

## 6. Hosted CI и условие будущего closure

Во время фиксации head `fd7e4e6…` Product PR #2206 остаётся OPEN/BLOCKED: 9 success, 4 intentional skipped, 1 cancelled predecessor `guard`, 17 in progress и 25 queued. Следовательно, exact-head hosted CI ещё не квалифицирован как зелёный.

Строки матрицы остаются активными. Для closure нужны: merge Product #2206, проверка точного resulting-main merge SHA, полностью завершённые обязательные checks, независимый sweep всех шести families в Light/Dark и явное решение по допустимости compact bottom overlay относительно требования «no prose occlusion». До этого candidate — сильный существующий owner, а не FIXED-CURRENT.
