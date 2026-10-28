# Широкая волна 11 — publication typography, language-of-parts и Unicode gate coverage

**Дата:** 2026-10-28  
**Product exact main:** `1a67c65cf2a30b06200480b7245abab873447a47`  
**Режим:** read-only SYSTEM reverify; Product не изменялся  
**Строки:** font matrix, Nagornaya justification, summary microheadings, map archaeology microtext, language-of-parts, mixed-script coverage, typograf fail-open.

## 1. База и объём

Exact current production-like build завершился успешно: Astro check 625 files, 0 errors, 7 pre-existing hints; 104 Astro pages и итоговые 108 HTML. Последний main delta добавляет только draft apostasy MDX и audit registry prose; draft не попал в final corpus. Открытых Product PR нет, Product checkout clean.

Fresh browser/corpus work:

- 108-final-HTML Unicode census;
- 200 summary-heading route-profiles: 50 routes × 390/1280 × Light/Dark;
- 150 Nagornaya route-profiles: 5 parts × 5 widths × 2 schemes × 3 reader measures;
- Greek/Hebrew painted + AX witnesses: 8 profiles;
- Avraam/Ishod archaeology surfaces: 12 profiles/flows, включая native pointer/keyboard activation;
- Avraam/Ishod mixed-script screen/print witnesses: 6 profiles;
- CDP platform-font proof на Playfair, Inter и Lora representative strings;
- canonical `typograf:dry`, `article:qa`, `readable-audit`, font-alias contract.

Все семь rows остаются активными. Новых строк и изменения арифметики нет.

## 2. `SYS-PUBLICATION-LANGUAGE-OF-PARTS-CONTRACT` — `CONFIRMED-CURRENT`

Final-corpus parser воспроизводит прежний missing set **точно**:

- Greek: 253 occurrences / 34 routes;
- Hebrew: 36 / 10;
- всего: **289 / 39 unique routes**;
- корректно размеченные controls: 261 Greek + 115 Hebrew = 376.

Painted Chromium desktop/mobile × Light/Dark:

- `τούτοις` и `τὸν ὅμοιον τρόπον τούτοις` имеют положительную geometry, входят в AX tree, но наследуют `lang=ru`;
- видимый `(שָׁמִיר — …)` имеет 307×148px mobile и 418×138px desktop, входит в AX tree, но также наследует `ru`;
- Axe language rules — 0, потому что они не выводят отсутствующий язык по письменности.

Строка остаётся системной без расширения счётчика. Closure по-прежнему требует единого authoring primitive + final-output guard, а не route-by-route spans.

## 3. `SYS-PUBLICATION-MIXED-SCRIPT-SURFACE-COVERAGE` — `CONFIRMED-CURRENT`

Три независимые payload families всё ещё проходят зелёные текущие gates:

1. Ishod `Чекy`: Latin U+0079 в `route.json`, research projection и final static projection; print media рисует строку 308.77×17px на 390/1280;
2. Avraam `hе`: U+0068 Latin + U+0435 Cyrillic; native `Начать изучение` → `Открыть досье: Харран` → `Иврит` рисует 13.61×13px во всех desktop/mobile × Light/Dark;
3. Hermenevtika quiz `academическую` остаётся в PageHead и final payload.

`article:qa` теперь сканирует 180 article files и сообщает 0 errors/warnings; `readable-audit` PASS. Значит, gap остаётся именно source+final Unicode owner coverage, а не один typo. Hermenevtika direct copy row не поглощается.

## 4. `SYS-MATERIAL-TYPOGRAPHY-GATE-FAILOPEN` — `CONFIRMED-CURRENT`

Canonical `npm run typograf:dry` снова перечисляет ровно шесть owners:

- Antisovetov;
- Gill II;
- Gill III;
- Hermenevtika;
- Kod da Vinchi;
- Krajne.

Вывод: `Would change: 6 files`; exit code: **0**. Green check по-прежнему не означает отсутствие typographic drift. Строка остаётся без изменения closure boundary: strict exit/negative fixture и repair через source owners, не generated-only rewrite.

## 5. `GBS-CUSTOM-FONT-MATRIX-MIXED-FAMILY-RENDERING` — `CONFIRMED-CURRENT`

Asset inventory не изменился: Playfair и Inter имеют только Cyrillic subsets; Source Sans 3 имеет Latin только 400; Lora максимум 600. Fresh CDP подтверждает реальный split/synthesis:

- Enoch H1, requested Playfair 600: custom `Playfair Display SemiBold` 26 glyphs + platform `DejaVu Serif Bold` 24 glyphs;
- Lawson `.lawson-finding-index`, requested Inter 700, text `01`: только platform `DejaVu Sans Bold`, 2 glyphs;
- Krajne `strong`, requested Lora 700: custom `Lora SemiBold`, 55 glyphs — запрошенный 700 фактически остаётся 600 face.

Это не computed-stack speculation: CDP сообщает фактические painted fonts. Existing font alias contract PASS проверяет три aliases, но не матрицу requested script/weight. Строка остаётся активной.

## 6. `GBS-NAGORNAYA-MOBILE-JUSTIFICATION-RIVERS` — `CONFIRMED-CURRENT`

В 150 browser profiles reader measure `narrow/normal/wide` не меняет дефект: authored `text-align:justify` остаётся. На один scheme (Light и Dark дают одинаковые результаты):

| Width | Justified blocks | gaps ≥20px | max gap |
|---:|---:|---:|---:|
| 320 | 144 | 1,792 | 136px |
| 390 | 144 | 1,344 | 129px |
| 768 | 144 | 330 | 67.67px |
| 1024 | 162 | 416 | 84.61px |
| 1280 | 162 | 161 | 69.27px |

Horizontal page overflow — 0, то есть это не clipping bug, а стабильная читаемостная проблема ритма. Ни scheme, ни reader measure не дают compact mitigation. Строка остаётся route-family improvement с одним semantic prose-alignment owner.

## 7. `GBS-SUMMARY-MICROHEADING-READABILITY` — `ACTIVE-EXPANDED`

Current final corpus расширяет точный scope с исторических 39 до **50 routes**:

- 34 headings: 9px / 9.9px / tracking 1.8px;
- 16 headings: 10px / 13px / tracking 2.8px.

Все 50 `h2.summary-card__head` видимы, не clipped и не overflow во всех 200 profiles; значения полностью одинаковы на 390/1280 и Light/Dark. Это по-прежнему не объявляется WCAG failure по одному размеру. Improvement остаётся про общий semantic heading token и премиальную hierarchy consistency.

## 8. `GBS-MAP-ARCHAEOLOGY-MICROTEXT-DENSITY` — `CONFIRMED-CURRENT`

Native map flows открыли Archaeology panels в desktop/mobile × Light/Dark:

- Avraam / Ur: 10 badges, 24 source links, 48 metadata rows, 24 raw IDs;
- Ishod / Rameses: 3 badges, 4 links, 8 metadata rows, 4 IDs.

Painted styles неизменны:

- badges 8px / 11.2px;
- source links 10px / 14px;
- metadata/IDs 9px / 12.6px;
- limitations 10px / 15px.

Avraam Harran control отдельно дал 7 badges, 18 links и 36 metadata rows. Существенные bibliography/limitations остаются microtext; строка сохраняется как improvement, не WCAG font-size claim. Browser screenshots оставлены вне Git.

## 9. Health и ограничения

Targeted language/map flows: page errors 0, broken images 0. Mixed-script native URL state дошёл до `?place=harran`; print witness имеет положительную geometry. Summary headings: 0 hidden, 0 clipped. Nagornaya: 0 page overflow во всех 150 профилях.

Full visual closure не заявляется ни для одного row: все семь подтверждены, а не закрыты. Поэтому PNG служат current-state witness, но не выдаются за resulting-main repair evidence. WebKit не требовался для повторной текущей классификации; Chromium evidence обязательную часть выполняет.

## 10. Reconciliation

- 0 rows закрыто;
- 6 rows подтверждены без изменения границы;
- `GBS-SUMMARY-MICROHEADING-READABILITY` расширен 39→50 routes;
- active arithmetic остаётся **63 = 37 direct + 7 improvements + 1 residual + 18 systems**.
