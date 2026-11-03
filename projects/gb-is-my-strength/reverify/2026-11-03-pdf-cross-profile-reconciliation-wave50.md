# PDF cross-profile, print chrome и owner reconciliation — broad wave 50

**Якорь Product:** `9a68fe214ef592b6bfb99a041d00153fd438f22a`.  
**Доказательство:** `evidence/2026-11-03-pdf-cross-profile-reconciliation-wave50.jsonl`.

## Матрица

Восемь маршрутов представляют Gill/common, heart, Baptist, hard-text, BaseLayout standalone и Hermenevtika/Kod standalone owners. Каждый пройден в четырёх явных профилях:

- desktop 1440×1000 Light / normal motion;
- desktop 1440×1000 Dark / reduced motion;
- mobile 390×844 Light / reduced motion;
- mobile 390×844 Dark / normal motion.

Все 32 цепочки используют нативные opener/control clicks. Зафиксированы scheme, viewport, `isMobile`, reduced-motion, URL, print count, console, images, LCP/CLS и screenshots control-state. Все 32: trusted click, print=1, URL identity сохранена, broken images=0. Созданы и постранично отрисованы 32 PDF / 592 страницы.

Dark/reduced не меняют desktop pagination и не создают dark-paper output. Mobile Light/Dark одинаково подтверждают одностраничную обрезку wave 49.

## Новый direct-дефект: skip link печатается почти на каждом листе

На двух BaseLayout-маршрутах:

- `/articles/steven-lawson-samoobman-i-publichnyy-golos/` — skip link виден на 94/95 листах;
- `/hard-texts/otstuplenie-ot-very-iuda-evreyam-6/` — 21/22 листах.

Внизу листа повторяется кнопка **«Перейти к основному содержимому»**. Повтор идентичен в Light и Dark/reduced: 230 painted manifestations в двух схемах.

Причина доказана в source/CSS: `BaseLayout.astro` создаёт fixed `.astro-skip-link`, но не исключает её из print. Глобальный print reset нейтрализует off-canvas transform; fixed control затем повторяется на каждой физической странице. Допускается `GBS-BASELAYOUT-PRINT-SKIP-LINK-REPEATS`. Это print-chrome leak, не прежняя screen-задача `GBS-BASELAYOUT-MISSING-SKIP-LINK`, которая корректно закрыла отсутствие доступного skip link.

## Новый system-дефект: действие названо скачиванием

Во всех 73 desktop surfaces подпись — «Скачать страницу» (68) или «Скачать PDF» (5), но direct downloads = 0; канонический результат всегда browser print dialog. Отмена не создаёт файл, а сохранение требует дополнительного выбора «Сохранить как PDF».

Допускается `SYS-READER-PRINT-ACTION-LABEL-SEMANTICS`: либо реализовать настоящий download, либо использовать честное «Распечатать / сохранить в PDF» и согласовать visible/accessibility names во всех shared surfaces. Уже честная common-mobile формулировка служит положительным fixture.

## Reconciliation

- Axe `nested-interactive` на Gill III уже принадлежит `SYS-REVERSIBLE-CARD-DESCENDANT-ACTIVATION-COLLISION`.
- Axe contrast на hard-text standalone уже принадлежит `GBS-TEXT-CONTRAST-RESIDUAL-BATCH`.
- 44 desktop и профильные Metrika errors — sandbox egress к `mc.yandex.ru`, не Product defect.
- `SYS-READER-PRINT-EXCLUSION-POLICY-PARITY` остаётся отдельным owner: он определяет include/exclude semantics, а не lock clipping, fixed chrome, blank physical tail или ложное название действия.

Итог аудита: четыре новые единицы — два direct (`blank tail`, `skip-link print leak`) и два system (`mobile lock clipping`, `label semantics`). MASTER: `57 → 61`, direct `28 → 30`, system `21 → 23`.

**Broad wave 50 завершена.**
