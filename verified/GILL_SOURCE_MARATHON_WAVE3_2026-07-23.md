# Джон Гилл — source marathon, волна 3

**Дата:** 2026-07-23  
**Research:** `FedorMilovanov/Research#7`  
**Сайт:** `FedorMilovanov/gb-is-my-strength#156`

## Масштаб

- добавлен новый проход 60+ полнотекстовых, академических и архивных единиц;
- Research вырос минимум до 62 тематических томов;
- источники связаны с конкретными утверждениями и production-файлами;
- работа перестала быть только аудитом: подтверждённые выводы внедряются в нативные Astro-компоненты.

## Крупные открытые материалы

- Robert E. Seymour, Edinburgh PhD 1954, полный PDF;
- Curt D. Daniel, Edinburgh PhD 1983, два полных тома;
- Jonathan White, SBTS PhD 2010, полный официальный PDF;
- Ruth Macritchie, Glasgow PhD 2025, полный официальный PDF;
- Steven Godet, Jonathan Swan, Matthew Haste — полные SBTS-диссертации;
- SBJT 25.1, полный выпуск;
- Brill 1997 — точные главы и пагинация, хотя большая часть полного текста закрыта;
- многотомные первичные труды Gill;
- Elizabeth Gill 1738, полный ранний текст;
- six-volume Whitefield Works;
- Particular Baptist Fund и Angus archive как конкретные архивные очереди.

## Уже внедрено в сайт в волне 3

1. `GillPart1SectionDaughterSermon.astro`
   - Elizabeth 1738 квалифицирована как funeral sermon + edited family testimony;
   - добавлен facsimile и ESTC;
   - отделён исторический факт от пастырского суждения.

2. `GillPart1SectionSourcesPart1.astro`
   - источниковая иерархия;
   - Rippon, Crosby, первичные документы, Particular Baptist Fund, Angus;
   - Oliver/Brill, White, Haykin, Macritchie.

3. `GillSpravochnikSectionWorks.astro`
   - OT Prophets 1757–58;
   - remaining OT 1763–early 1766;
   - Doctrinal 1769;
   - Practical 1770;
   - Eternal Sonship 1773, 2:534–564.

4. `GillSpravochnikSectionDisputes.astro`
   - offer / duty-faith / external call;
   - Whitefield;
   - Spurgeon;
   - Elizabeth;
   - edition chronology;
   - rabbinic anachronism.

5. `GillSpravochnikSectionSources.astro`
   - полный список перестроен по уровню доступа;
   - abstract/preview больше не выдаются за прочитанный полный текст;
   - Walden квалифицирован как одна реабилитирующая позиция в споре.

## Первая волна сайта сохраняется

- architecture sync;
- Sandeman genealogy correction;
- Gill–Whitefield source dispute;
- multi-level eternal justification;
- hyper-Calvinism terminology;
- source apparatus for Part III/IV;
- superlative and rhetoric corrections.

## Техническая изоляция

- Sermon on the Mount files не затрагивались;
- deployment workflows не изменялись;
- shared files не менялись;
- Gill PR остаётся draft;
- до волны 3 все пять CI-проверок были зелёными;
- после волны 3 требуется новый полный прогон.

## Открытые внедряемые долги

- полная source-level замена stale Walden paragraph в монолитном `GillPart3ArticleBody.astro`;
- добавление six-volume Whitefield negative-result;
- provenance Spurgeon–Spiller letter;
- уточнение историографической таблицы;
- сверка оставшихся дат в Part II;
- синхронизация контрактных зеркал, если они ещё участвуют в production.

## Запрет на техническую маскировку

Старый текст нельзя:

- скрывать CSS;
- заменять клиентским JS;
- оставлять в Pagefind;
- переносить через raw HTML adapter.

Монолит исправляется только полной нативной транзакцией с повторным прохождением Native Source Contract, Shared Files Guard, Route Registry Validators, Overlay Runtime Browser и Visual Parity Guard.