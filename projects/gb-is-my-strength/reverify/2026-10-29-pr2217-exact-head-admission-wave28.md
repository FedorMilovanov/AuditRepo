# PR #2217: сверка exact-head admission — широкая волна 28

**Дата:** 2026-10-29  
**Product base:** `54877be73a590b1e29f4d701724b39ed41c17e14`  
**PR head:** `918814db39d6bdfd4872fe235c3b1a47a20d0848`  
**Граница:** read-only; Product-файлы, PR, owner branch и комментарии не изменялись.

## Итог admission

На проверенном head GitHub показывает PR `OPEN`, ready-for-review, `CLEAN`: **36 checks SUCCESS, 4 SKIPPED, 0 failure, 0 pending**. Review и PR comments отсутствуют. Diff содержит 57 файлов, 7 729 добавлений и 196 удалений.

Это сильный механический baseline, но не доказательство редакторской и публикационной полноты. Три ранее воспроизведённых наблюдения остаются на том же exact head:

1. reader-facing английские гибриды в статическом и динамическом payload;
2. ноль bottom-neighbour cards на всех пяти частях;
3. семь новых glossary records без `category`/`categorySlug`, дающие 19 runtime-триггеров без taxonomy metadata на 13 маршрутах.

Следовательно, зелёный admission здесь — не «ложный» вообще: он подтверждает то, что реально измеряют 36 checks. Ложно только расширять этот результат до семантической готовности всей публикации.

## Почему checks не поймали известные наблюдения

### 1. Новая публикационная семья не получила нового исполняемого witness

В PR изменено **0 файлов** под `scripts/`, tests или `.github/`. Единственный новый audit/doc-файл — prose self-audit. При этом добавлен отдельный wrapper `ApostasySeriesArticlePage.astro` и пять маршрутов.

`SERIES-ENGINE-GUIDE` прямо требует: при добавлении новой wrapper family добавить её представителя в `SERIES` для `engine:sweep`. Self-audit PR также требует проверить I→V, progress и добавить представителя новой серии. Исполняемого изменения для этого нет.

`interactive-audit.js` перечисляет десять старых `SERIES_URLS`; ни одна часть «Отступников» туда не входит. Даже простого добавления маршрута недостаточно: текущий `gbsNext` считается истинным по селектору

```text
.gbs2-next OR любая некCurrent rail-card
```

Поэтому рабочий боковой rail маскирует отсутствие отдельной `.gbs2-next` поверхности. Аудит волны 26 нативно доказал rail-переходы и отдельно доказал нулевое количество bottom cards; это два разных контракта.

### 2. Глоссарный gate проверяет разрешимость, но не полную запись

`glossary-contract-audit.js` требует brief definition, корректные aliases и числовые cadence overrides. Он не требует `category`/`categorySlug`. Runtime намеренно fail-open: отсутствующие поля становятся пустыми строками и соответствующие атрибуты не проецируются. Поэтому зелёный check согласуется с кодом, но не с фактическим 130/130 прежним таксономическим инвариантом.

### 3. Редакторские gates не владеют всем финальным reader payload

Публикация активирует не только новые строки diff. Она делает reader-visible ранее существовавшие draft MDX, а также конфиг, metadata/search/feed projection и динамический learning payload. Проверка только добавленных строк или одного класса файлов неизбежно неполна.

На exact head остаются подтверждённые формы `assurance`, `perseverance`, `source-critical`, `doctrinal authority` и `settled-отвержение`. Часть из них находится в ранее существовавшем draft content и становится публичной именно этой транзакцией; следовательно, diff-line lint не является достаточным admission для publication transition.

## Распределение причин

| Причина | Подтверждение |
|---|---|
| Agent omission | Self-audit назвал browser/sweep boundary, но PR не добавил executable witness и не проверил отдельную bottom surface. |
| Harness scope gap | Новые пять маршрутов отсутствуют в `SERIES_URLS`; агрегированный `gbsNext` смешивает rail и bottom-neighbour navigation. |
| Schema gap | Glossary gate разрешает записи без полной taxonomy-пары. |
| Payload ownership gap | Публикация активирует существующий draft и динамические payload, а gates не собирают их в один reader-language contract. |
| CI/platform failure | Не подтверждён: exact-head CI полностью зелёный и завершённый. |

## Системный вывод

Новый отдельный current-main defect или новая prose-политика не нужны. Свидетельство расширяет существующий `SYS-CONTENT-AUTHORING-PUBLICATION-CONTRACT`: атомарность должна включать не только наличие route/registry/projection, но и **типизированные финальные reader-инварианты** новой публикации.

Минимальная долговечная защита:

1. publication manifest перечисляет маршруты и все reader payload owners пакета, включая ранее существующий draft и динамические quiz/config данные;
2. новая wrapper family обязана иметь хотя бы один exact-route browser witness до merge;
3. rail navigation и bottom-neighbour navigation проверяются отдельными селекторами и отдельными нативными переходами, без OR-подмены;
4. glossary schema требует непустую согласованную taxonomy-пару;
5. reader-language check работает по финальной публикационной проекции, а не только по изменённым строкам.

Это один admission-контракт с несколькими типизированными полями, а не пять новых разрозненных чеклистов.

## Текущий disposition

PR #2217 технически mergeable и exact-head green, но три bounded PR observations не закрыты. Поскольку lane внешняя и активная, аудит не меняет Product и не создаёт параллельный repair PR. Matrix arithmetic остаётся 54: наблюдения относятся к ещё не слитому PR и расширяют существующего системного владельца.

**Широкая волна 28 завершена.**
