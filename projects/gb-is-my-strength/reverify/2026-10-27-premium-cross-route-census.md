# Premium cross-route census — 2026-10-27

## Решение

Проверен production-like build Product `21dcfdd9f9018607a708c5118383e287ec1a3fed` без изменений Product.

Итог этой волны:

- один новый прямой дефект: `GBS-HOME-AMBIENT-FIRST-PAINT-CLS`;
- одна ранее активная system lane закрыта на current main: `SYS-READER-DOCUMENT-NAVIGATION-INTERCEPTION`;
- активная арифметика остаётся **76**, но состав меняется на **46 direct + 8 improvements + 22 system lanes**;
- font-swap CLS расширяет доказательство существующего `GBS-CUSTOM-FONT-MATRIX-MIXED-FAMILY-RENDERING`, а не создаёт дубликат;
- остальные сигналы либо принадлежат действующим строкам, либо отклонены контролем.

Компактные машинные доказательства: `evidence/2026-10-27-premium-cross-route-census.jsonl`.

## 1. Границы и чистый baseline

- AuditRepo: ветка `arena/6e582b07-auditrepo`, исходный HEAD `df5ef88f…`.
- Product: чистый `main` `21dcfdd9…`.
- `npm ci`: 490 packages; одна moderate npm advisory, зависимости не менялись.
- `npm run strangler:build:production-like`: PASS.
- Postbuild: 108 HTML, 625 проверенных файлов, 0 errors, 0 warnings, 6 hints.
- Неблокирующие build-диагностики Shiki Greek, unresolved OG image и Rolldown `astro:head-inject` не превращались в визуальные дефекты без browser witness.

## 2. Полнота census

Основной проход:

- 105 `index.html` routes;
- 5 профилей;
- 525 route/profile records;
- 524 полных screenshots/metrics;
- один первоначальный timeout `/konfessii/russkij-baptizm/_app/` только в wide profile.

Профили:

1. 390×844, mobile, Dark, reduced motion, DPR2;
2. 390×844, mobile, Light, normal motion, DPR2;
3. 1024×900, Light, reduced motion, DPR1;
4. 1440×900, Light, normal motion, DPR1;
5. 1600×1000, Dark, reduced motion, DPR2.

Три оставшихся HTML из полного 108-document corpus проверены отдельно во всех пяти профилях:

- `/404.html`;
- `/google7e02f9855e02b89a.html`;
- `/yandex_42bc0d54a1ca4952.html`.

Google/Yandex token files являются verification payload, а не публикационным UI. Их ожидаемо голый документ не образует отдельный Axe-дефект продукта.

Повторный `_app` проход завершил все 5/5 профилей, включая 1600 Dark/reduce: status 200, navigation error 0, page error 0. Первоначальный timeout отклонён как невоспроизводимый.

## 3. Что измерялось

На каждом основном route/profile фиксировались:

- viewport screenshot и SHA-256;
- scheme, `isMobile`, reduced motion и DPR;
- H1/title, root geometry, scroll width/height;
- computed typography: family, size, line-height, weight, tracking, measure, alignment;
- section/direct-child rhythm candidates;
- selected image URL, painted geometry, intrinsic browser state, loading/broken status;
- visible interactive/fixed geometry и disabled/expanded state;
- document and element overflow candidates;
- LCP/CLS и layout-shift sources;
- Axe violations/incomplete;
- console/page errors и external requests.

Raw binaries, screenshots, dependencies and logs оставлены вне Git.

## 4. Новый дефект: Home ambient first-paint CLS

На `/` при 1600×1000 Dark/reduced-motion три из трёх изолированных загрузок дали одинаковый CLS:

- 0.755023;
- 0.755023;
- 0.755023.

Главный shift 0.748681 начинается примерно на 0.39–0.43 s. Источники включают:

- `.h-ambient-word__text`;
- `.h-hero-search-wrap`;
- hero `::after`.

Примеры фактического движения marginalia:

- Greek opening phrase: примерно `y=0 → 242px`;
- Latin `In principio erat Verbum`: `y≈72 → 714px`;
- Hebrew opening phrase: `y≈14 → 304px`.

Это не motion-preference анимация: профиль явно `prefers-reduced-motion: reduce`.

Контроль с заблокированными font responses сохраняет стабильный CLS **0.265484 ×3**. В нём marginalia всё равно перемещаются на сотни пикселей после первого paint. Значит, у Home есть самостоятельный owner: процентно позиционированный декоративный слой становится видимым до стабилизации высоты содержащего `.home-content`.

Закрытие требует зарезервировать финальную геометрию marginalia до первого paint либо держать слой непокрашенным до стабильного layout без timing-only задержки. Проверка: cold 1480/1600/1920 Light/Dark, normal/reduce, fonts warm/cold/failed; ambient phrases не меняют viewport position после первого paint, hover/focus tooltip остаётся доступным, central content и search не прыгают.

## 5. Font CLS: расширение существующего owner

Три изолированных normal-font runs:

- Hermenevtika: 0.282296 / 0.282296 / 0.282941;
- Antisovetov: 0.151820 ×3;
- Nagornaya part 3: 0.396862 / 0.155175 / 0.155175.

Font-blocked controls:

- Hermenevtika: 0 / 0 / 0;
- Nagornaya part 3: 0 / 0 / 0.

В normal runs меняются line wrapping, высота summary/card blocks и положение body. Это измеримый пользовательский эффект несовместимых font/fallback metrics.

Новая строка не создаётся: `GBS-CUSTOM-FONT-MATRIX-MIXED-FAMILY-RENDERING` уже требует complete script/weight matrices либо один явно metrically compatible fallback. Его closure следует дополнить cold/warm/failed-font CLS proof.

Низкие стабильные контроли (`discipline` около 0.0028; `goneniya` 0.0135; `spravochnik` 0.014–0.025) отдельно не admitted.

## 6. Навигация: ранее активный system defect теперь fixed-current

Проверены только native события, а не `href`/URL видимость:

| Сценарий | Input | Target request | Destination H1 |
|---|---|---:|---:|
| Gill I → II, Roman rail | click | 1 | changed |
| Gill I → II, bottom neighbour | focus + Enter | 1 | changed |
| Pastor I → II, Roman rail | click | 1 | changed |
| Gill I → II mobile bottom | touch tap | 1 | changed |

Во всех 4/4 случаях:

- URL стал target URL;
- был реальный main-frame document request;
- H1/body стали destination identity.

`src/runtime/reader-tts-lifecycle.js` на current Product больше не перехватывает cross-document navigation; TTS retirement вызывается best-effort без `NavigateEvent.intercept()`.

Поэтому `SYS-READER-DOCUMENT-NAVIGATION-INTERCEPTION` удаляется из активной арифметики. Ring остаётся progress indicator, не таймером; отдельный «timed next» не выдумывается.

## 7. Axe, controls и ownership reconciliation

Occurrence records основного census:

- `scrollable-region-focusable`: 14;
- `color-contrast`: 7;
- `label-content-name-mismatch`: 4 в основном проходе + подтверждение wide `_app`;
- `nested-interactive`: 3.

Все принадлежат уже активным owners:

- Gill/Nagornaya tables → `SYS-READING-TABLE-KEYBOARD-SCROLL`;
- G3 and Russian Baptism contrast → `GBS-TEXT-CONTRAST-RESIDUAL-BATCH`;
- `_app` control name → `GBS-CHROME-LABEL-IN-NAME-MISMATCH`;
- Gill reversible cards → `SYS-REVERSIBLE-CARD-DESCENDANT-ACTIVATION-COLLISION`.

Новых Axe rows нет.

Raw small-target список очищен от inline footnotes с pseudo hit-area, SVG internals и обычных links. 22px Gill TOC disclosure сам по себе не admitted: размер меньше 24px, но census не доказывает нарушение spacing exception. Forced-click proof не использовался.

## 8. Images и art direction

Первоначальный расчёт через `HTMLImageElement.naturalWidth` отклонён: для `srcset` браузер может вернуть density-corrected logical width.

Повторный расчёт использовал:

- фактический `currentSrc`;
- физические dimensions выбранного файла через ImageMagick `identify`;
- painted CSS geometry;
- profile DPR.

Результат:

- accidental `object-fit: fill` aspect distortion: 0;
- fixed 600px article hero family снова подтверждает существующий `GBS-HERO-IMAGE-HIDPI-SOURCE-CAPACITY`;
- archival Baptist photographs и facsimiles отделены от modern hero role: ограниченная историческая source capacity не объявлялась случайным route defect;
- broader body images ниже DPR2 target оставлены evidence boundary, а не превращены в массовый upgrade без art/source owner.

## 9. Spacing, typography и overflow dispositions

Raw large direct-child gaps на `/nagornaya/seriya/` и `/hard-texts/` отклонены. Center hit-testing и screenshots показывают видимый nested/intervening content внутри измеренного диапазона.

Document-level horizontal overflow: 0 во всех 525 основных records. Element candidates состояли главным образом из intentional drawers, SR-only content, large SVG internals и decorative absolute layers; они не admitted без obstruction witness.

Homepage 8–9px kickers рассмотрены в painted mobile/desktop context. Это короткие uppercase navigation labels с сильным tracking, а не body/source prose. Они не смешаны с уже admitted semantic `h2.summary-card__head` floor и не объявлены дефектом только по font-size.

## 10. Console, broken images, loading/error/no-JS

- Page errors в основном census: 0.
- Console errors: blocked-egress inspector messages.
- `mc.yandex.ru` и Wikimedia delivery noise отфильтрованы.
- 50 raw «broken» images были внешними Wikimedia requests только на Da Vinci route; это sandbox delivery, не Product finding.
- `_app` loader/loaded rerun завершился без wide timeout.
- Текущие error/no-WebGL и Ishod no-JS состояния уже имеют отдельные активные строки; эта волна не дублирует их.

## 11. Матрица после reconciliation

До:

- 45 direct;
- 8 improvements;
- 23 system;
- 76 total.

Изменения:

- `+1` direct: `GBS-HOME-AMBIENT-FIRST-PAINT-CLS`;
- `-1` system: `SYS-READER-DOCUMENT-NAVIGATION-INTERCEPTION` fixed-current.

После:

- **46 direct**;
- **8 improvements**;
- **22 system lanes**;
- **76 active work units**.

Product repair в эту волну не входит.
