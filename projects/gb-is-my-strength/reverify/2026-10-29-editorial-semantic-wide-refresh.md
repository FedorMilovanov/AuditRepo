# Широкая редакционно-семантическая перепроверка — волна 19

**Product:** `1aff67560d56d8521aaeab81bdc361f33dbd6af6`
**Дата:** 2026-10-29
**Охват:** 14 active direct rows: русская редактура, пунктуация, glossary fact, research leakage, повреждённый Baptist copy, malformed Krajne/Pastor output.

## 1. Метод и owner boundary

Использована production-like сборка волны 18 (105 Astro pages / 109 final HTML), exact-current source/final census и настоящий Chromium. В 30 browser profiles проверены 15 representative route/phrase cases на 1280 Light и 390 Dark, DPR2, reduced motion; full AX и Axe снимались после загрузки. У Product нет открытых PR.

Diff от `cdf994b…` до current состоит из 27 путей новой apostasy publication/registries и genealogy data. Ни один из проверяемых редакционных владельцев не менялся. Это служит provenance-контролем, но выводы ниже подтверждены current source/final, а representative painted output — браузером.

Единственный сетевой шум — sandbox-blocked Yandex Metrika: 10 внешних запросов `ERR_CONNECTION_CLOSED`. Product page errors 0, broken images 0, horizontal overflow 0, Axe violations 0 во всех 30 профилях.

## 2. Малформированные русские формы и Gill

Current source→final parity остаётся 1→1 для каждого из пяти malformed tokens:

- `обеспечредительные меры`, `обеспредительная процедура`;
- `самосуверенности`;
- `установленно виновным`;
- `красивой телологии`.

Representative desktop/mobile range witnesses для четырёх routes имеют ненулевую painted geometry и совпадают с full AX. Поэтому `GBS-READER-MALFORMED-RUSSIAN-WORDS-BATCH` остаётся active.

У Gill I три конструкции (`около двенадцати лет Гилл услышал`, `Продолжительность между`, `в виду многих зрителей`) также имеют current source→final 1→1; первая painted/AX 2/2, а общий owner не менялся. `GBS-GILL-PART1-RUSSIAN-COPY-QUALITY` остаётся active.

## 3. Имена, пунктуация и Diotrophes

- Ishod `Аварон`: source 1, final 1; painted/AX 2/2. Каноническое `Аарон` не отменяет узкую ошибку.
- LBCF bibliography: четыре `Conscience ;`, три `The Church .`, один `redeeming-power ;` остаются в четырёх MDX owners. Current `innerText` подтверждает пробел; фразы, разорванные ссылочным element boundary, не обязаны лежать в одном Text node.
- Diotrophes `Все двадцать один материала`: source/final 1→1, painted/AX 2/2.
- `Фидельные свидетельства`: source/final 1→1 внутри закрытого Learning Sheet. Скрытое начальное состояние не является опровержением ранее доказанного native open→«Конспект» painted/AX пути; owner unchanged.

Все четыре соответствующие строки остаются active, новых строк нет.

## 4. Hermenevtika, Sem Tipov и Lawson

Hermenevtika сохраняет набор русских калек, а quiz payload всё ещё содержит `чисто academическую` (source/final 1→1). Payload до запуска quiz закономерно не входит в body `innerText`; это не closure.

Sem Tipov source по-прежнему содержит `***Серия…*`, а final body `innerText` начинается с `**Серия`; current desktop/mobile подтверждают occurrence 2/2. Range по одной Text node неприменим, потому что `**` и italic content лежат в соседних nodes.

Lawson сохраняет `Неизвестно для меня эта площадка…` source/final 1→1, painted/AX 2/2. Secondary-review authority не изменился. Три строки остаются active.

## 5. Glossary fact и research scaffolding

Canonical 1689-confession brief в `data/glossary.json` не менялся после exact previous 11-route browser proof; ошибочная textual-lineage формулировка остаётся единственным canonical owner. Новая apostasy публикация не исправляет факт и не вводит owner conflict.

Research-scaffold сигналы сохраняются во всех шести surface families. Current final подтверждает, среди прочего, три `LAW-48`, один `SERIOUS-BUT-NOT-DECISIVE`, один `Полный отрицательный witness apparatus`, raw archaeology/Hard Texts status vocabulary и Baptist evidence apparatus. Это reader-facing governance leakage, а не обычные библиографические локаторы. `GBS-PUBLICATION-RESEARCH-SCAFFOLD-READER-LEAK` остаётся active без дробления.

## 6. Baptist loss, Krajne orphan и Pastor AX garbage

Девять Baptist article owners не менялись. Current final corpus содержит 1506 последовательностей `??` или длиннее; previous HTML5 DOM census дал 1199 `???` text runs и 141 painted Text nodes на каждой ширине. Representative Spravochnik `???` painted/AX 2/2. Восстановление символов по догадке по-прежнему запрещено.

Krajne exact-current DOM имеет ровно один substantive direct Text child canonical article root. Его normalized длина теперь измерена как 234 символа (префикс `При этом важно богословское различение…`); текст виден и есть в AX, но отсутствует в `GBReaderProjection.getTtsSegments()`, `getSearchText()` и `getPrintNodes()`. Строка остаётся узкой и active.

Pastor Part II final HTML сохраняет один literal fragment `decoding="async" loading="lazy" width="160" height="108" />`. `body.innerText` содержит его 2/2; отдельная Text-node geometry скрыта thumbnail clipping, а current AX string matching зависит от сериализации узлов. Предыдущий full-AX link-name witness и malformed source owner не изменились, поэтому отсутствие exact contiguous AX substring в этом probe не является closure. `GBS-PASTOR-SERIES-CARD-MARKUP-AX-LEAK` остаётся active.

## 7. Reconciliation

Проверены 14 direct rows; **0 закрыто, 0 добавлено, 0 поглощено**. Все owner boundaries остаются узкими. Matrix arithmetic не меняется: **27 direct + 7 improvements + 1 residual + 18 systems = 53**.

Машинная квитанция: `evidence/2026-10-29-editorial-semantic-wide-refresh.jsonl`.
