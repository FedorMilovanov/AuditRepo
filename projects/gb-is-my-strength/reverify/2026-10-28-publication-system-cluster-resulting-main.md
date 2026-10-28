# Publication system cluster: resulting-main reconciliation — 2026-10-28

## 1. Якорь и объём большой волны

Проверен неизменённый Product main `cdf994b104d7b5eaeef407bf60e341e436efe1df`; canonical production-like corpus содержит 108 HTML-документов. Единственный открытый Product PR #2208 — docs-only и не владеет этими publication owners. Product не изменялся.

Большая волна **3/16–20** одновременно повторно квалифицирует пять существующих rows:

1. `GBS-PUBLICATION-RESEARCH-SCAFFOLD-READER-LEAK`;
2. `GBS-JOURNAL-READER-SOURCE-LOCATORS-MISSING`;
3. `SYS-PUBLICATION-LANGUAGE-OF-PARTS-CONTRACT`;
4. `SYS-PUBLICATION-MIXED-SCRIPT-SURFACE-COVERAGE`;
5. `SYS-MATERIAL-TYPOGRAPHY-GATE-FAILOPEN`.

Машинное свидетельство: `evidence/2026-10-28-publication-system-cluster-resulting-main.jsonl`. Browser outputs и screenshots оставлены вне Git в `/tmp/wave14`.

## 2. Browser/print/no-JS матрица

Десять reader routes проверены в Chromium desktop 1280×900 / mobile 390×844 × Light/Dark, DPR2, reduced motion: **40 route-profile cases**. Для каждой страницы собраны console/page errors, broken loaded images, overflow и Axe; сделан screenshot. Broken loaded images 0, положительный horizontal overflow 0, page errors 0. `ERR_CONNECTION_CLOSED` на Diotrophes и Krajne — отфильтрованный sandbox egress noise, а не Product defect.

Light desktop/mobile: Axe 0. Dark desktop/mobile повторяет контрастные узлы уже существующего owner `GBS-TEXT-CONTRAST-RESIDUAL-BATCH`; дубликат не создан. Representative layout-shift probe: G3 и Ishod CLS 0, Diotrophes CLS 0.02053 в desktop/mobile. Browser shell не предоставил LCP entry, поэтому LCP **не измерен**, а не выдан за ноль.

No-JS `/karty/avraam/` сохраняет 11 295 символов статической текстовой проекции и сообщает текстовый режим. Native map flow `Начать изучение` → SVG marker `Открыть досье: Харран` → tab `Иврит` меняет URL на `?place=harran` и рисует mixed-script `hе` как `<em>` 13.6×13px. Ishod print media рисует `Чекy` в статической проекции desktop/mobile.

## 3. Reader leakage и source projection

### Publication/research leakage

Подтверждены все основные семейства существующего row:

- Baptist leakage теперь точно локализована на **4**, а не исторические 5 routes: `dva-sezda-1884`, `goneniya-i-sovest`, `noch-na-kure`, `yuzhnaya-shtunda`; каждая публикует `Research \`main\``, `claim-level` и pinned SHA. Scope сужен по exact final corpus, row не закрыт.
- Lawson рисует 6 raw registry keys: `LAW-48` дважды, `LAW-07/38/41/52` по одному разу; geometry положительна во всех четырёх профилях.
- Hard Texts сохраняет 9 `Research authority` на двух Enoch routes, raw `GEN6-ENOCH-*` decisions/HOLD vocabulary, `SERIOUS-BUT-NOT-DECISIVE` и unfinished `witness apparatus`; все выбранные manifestations painted desktop/mobile.
- Russian Baptism 3D app рисует `RB-V6-ARENA-2026-04-30-REGIONAL-MAP-3D-VERIFY-003`.
- Genealogy authority всё ещё содержит 42 annotations: confidence `certain` ×1, `certain-textual-genealogy` ×40, `disputed` ×1; **41/42** notes содержат английский или mixed operational language. Это текущий residual этого же owner, не новая строка.
- Archaeology source registry и его projection authorities сохраняют raw source IDs (`arj-abraham-chronology`, `penn-ur-overview`, `bm-papyrus-anastasi-v` среди проверенных примеров).

`GBS-PUBLICATION-RESEARCH-SCAFFOLD-READER-LEAK` остаётся `OPEN-CURRENT`.

### G3 и Diotrophes

G3 сохраняет 33 `.claim-ref`. Точный DOM разбор уточняет старую формулировку: 21 marker сам является anchor на общий pinned Research handoff; 12 — wrapper с дочерними anchors, и только шесть поздних groups содержат article-local `#src-*` locators. Это не 33 «вообще без ссылок», но и не reader-resolvable bibliography: общий handoff не разрешает claim в название/дату/объект/локатор. Reader copy также рисует `REFERENCE`, `Raw archived payload SHA` и `decoded HTML SHA`.

Diotrophes содержит 36 `.evidence-card .source-ref`, **0 anchors** во всех них; 21 целевая case card рисует `Записи Research: …`. Значит, прежний scoped count 21 воспроизведён без ошибочного подсчёта всех descendant nodes.

`GBS-JOURNAL-READER-SOURCE-LOCATORS-MISSING` остаётся `OPEN-CURRENT`; closure scope и authority boundaries не изменены.

## 4. Language of Parts

Unicode-aware Text-node census всего final corpus воспроизводит дефект без расхождения:

- Greek: **253** missing-language occurrences / 34 routes;
- Hebrew: **36** / 10 routes;
- итого **289 occurrences / 39 unique routes**.

Fresh hidden-filtered control census отдельно находит 254 корректно размеченных Greek и 86 Hebrew occurrences. Он методологически уже старого broad control count 376, поэтому не объявляется регрессией. Дефектный missing set воспроизведён точно.

Painted Greek witness `τούτοις` на Angels route наследует `lang=ru` desktop/mobile. Axe этого не выявляет: supplied language values синтаксически допустимы, но отсутствующий language-of-parts он вывести не может. Row остаётся `OPEN-CURRENT`.

## 5. Mixed-script и typography fail-open

Обе authority/projection пары сохраняют single-homoglyph corruption:

- `Чекy` (Latin `y`) — `karty/ishod/route.json`, research projection и два painted print occurrences в final Ishod;
- `hе` (Latin `h`, Cyrillic `е`) — `karty/avraam/route.json` и legacy app payload; native map flow доказывает painted dynamic manifestation.

`article:qa`/readable guard по-прежнему не является универсальным source+final owner для этих payload families. `SYS-PUBLICATION-MIXED-SCRIPT-SURFACE-COVERAGE` остаётся `OPEN-CURRENT`.

Canonical `npm run typograf:dry` на exact main снова перечисляет Antisovetov, Gill II, Gill III, Hermenevtika, Kod da Vinchi и Krajne, пишет `Would change: 6 files`, но выходит с code 0. `SYS-MATERIAL-TYPOGRAPHY-GATE-FAILOPEN` остаётся `OPEN-CURRENT`.

## 6. Disposition

Пять rows подтверждены на exact Product main. Новых rows и work units нет; уточнение Baptist 5→4 и G3 DOM anatomy не ослабляет системные closure contracts. Арифметика остаётся **45 direct + 8 improvements + 1 residual + 22 systems = 76**.
