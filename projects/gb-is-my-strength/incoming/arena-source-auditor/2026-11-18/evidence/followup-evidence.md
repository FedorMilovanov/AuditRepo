# Свидетельства второго прохода — 2026-11-18 UTC

К [дополнению](../FOLLOWUP.md). Это доказательства на двух названных якорях, не новый полный обход каталога и не решение об источниковых правах.

## Сверка версий

| Слой | Проверка | Наблюдение |
| --- | --- | --- |
| Исходный якорь | [Product `381f8f96…`](https://github.com/FedorMilovanov/gb-is-my-strength/commit/381f8f9613bb968754c2432ed9648cd6e42282a9) → [Pages 44287427833/1](https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/44287427833) → [immutable manifest](https://gospod-bog.ru/deployments/381f8f9613bb968754c2432ed9648cd6e42282a9/44287427833-1.json) | Рецепт и девять сравнений по артефакту — [первый проход](release-and-inspections.md). Новый браузерный JSON содержит ещё четыре хеша **локальных** HTML. |
| Новый `main` | Состояние `main` после [#2337](https://github.com/FedorMilovanov/gb-is-my-strength/pull/2337); [compare](https://github.com/FedorMilovanov/gb-is-my-strength/compare/381f8f9613bb968754c2432ed9648cd6e42282a9...9edef94ece08012223c1364bec7ddcd561cf5713) | [#2337](https://github.com/FedorMilovanov/gb-is-my-strength/pull/2337) `MERGED` в 13:24:29 UTC; результат `9edef94ece08012223c1364bec7ddcd561cf5713`, один commit после якоря, 8 путей. Изменены search manifest и RSS, три изображения, G3 hero, head и entrypoint. Ни один текстовый абзац G3, ни один из четырёх маршрутов второго прохода в diff не изменён. |
| Новый локальный `dist` | Exact tar `9edef94e…`, Node `22.23.4`, npm `10.9.9`, тот же `package-lock.json` SHA-256 `5fa7defa3c535c0d9a9f9d8d6f86575298dfa2a83fddd03a162550e121964cf8`; рецепт ниже | `npm ci`, production-like build, отдельный Pagefind (103), publication audit — exit 0. Те же четыре хеша и те же браузерные наблюдения на двух сборках, кроме нефиксированной величины прокрутки при чтении сразу после клавиши (положительна в обеих). |
| Публичный указатель до переключения | [Выборка во время сборки](https://gospod-bog.ru/deployments/current.json?editorial=followup-live-20261118T1338Z) | Ещё `381f8f96… / 44287427833/1`, digest `sha256:baa0687ad456c6581e212fa52eaa60f0916b78e253fd5ba672bd4e30cbde386f`. Сам merge #2337 этого указателя не поменял. |
| Опубликованный post-#2337 | [Pages 44313404255/1](https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/44313404255) → [новый указатель](https://gospod-bog.ru/deployments/current.json?editorial=followup-promotion-20261118T1339Z) → [immutable manifest](https://gospod-bog.ru/deployments/9edef94ece08012223c1364bec7ddcd561cf5713/44313404255-1.json) | Candidate и exact promotion `success`, завершение 13:38:51 UTC. Имена stage=`readiness` внутри опубликованного манифеста описывают происхождение кандидата, не незавершённость promotion. Указатель и манифест совпали: `9edef94ece08012223c1364bec7ddcd561cf5713`, run/attempt `44313404255/1`, digest `sha256:a3cd47357f839049daeda08ce4b2fd57d8d8b0e1dd216eb7ee99cc279681f0a7`. Манифест сгенерирован `13:38:10.232Z`, 1 432 файла / 116 634 651 B. В 13:40:34 UTC `main` оставался на этом же SHA. |

Повторная проверка открытых PR после merge: проверены пути пяти открытых PR **#2324, #2323, #2322, #2311, #2300**; пересечения с названными owner paths не обнаружено на момент проверки. #2298 `CLOSED`, merge отсутствует; #2292 ранее влит. Не трактовать отсутствие активного пересечения как разрешение писать в Product. Старый клавиатурный `GBS-KOD-DA-VINCHI-TIMELINE-KEYBOARD-SCROLL` не переоткрывается; новая потеря трёх дат — другой outcome. CR-03 и CR-09 расширяются, а не дублируются новыми MASTER-строками.

**Точный результат G3:** `parse5` на `dist/articles/index.html` → `a[data-catalog-route="/journal/dossiers/g3/"]`: «G3: два кризиса и завершение работы», новое описание, `11 мин`. В `dist/data/search-manifest.json` у `id=g3`: тот же title, description, `readTime=11`, `image=/images/journal/g3-ministries-og-1200x630.webp`, `modifiedTime=2026-09-09T00:00:00+03:00`. В `dist/journal/dossiers/g3/index.html`: Article внутри `@graph` (`datePublished=2026-09-09T00:00:00+03:00`, `dateModified=2026-11-18T00:00:00+03:00`, `timeRequired=PT11M`), `article:modified_time` 18.11, OG/Twitter указывают на тот же social WebP 1200×630. RSS item с canonical link получил новый заголовок и описание, `pubDate` остался `Tue, 08 Sep 2026 21:00:00 GMT` = 09.09 00:00 +03:00. `sharp.metadata()` проверил размеры локальных `g3-ministries-cover-640.avif` 640×360 (5 352 B), `…cover-1200.avif` 1200×675 (16 530 B), `…og-1200x630.webp` 1200×630 (27 936 B). Загрузка изображений с CDN и фактический preview в соцсетях этим не проверены.

**Контроль публичной выдачи после promotion (извлечение, не raw HTTP):** [каталог, chunk 2](https://gospod-bog.ru/articles/?editorial=followup-promotion-20261118T1339Z) действительно показывает новую карточку G3 с `11 мин`; [основной RSS, chunk 0](https://gospod-bog.ru/feed.xml?editorial=followup-promotion-20261118T1339Z) — новый заголовок и прежний `pubDate`; [search JSON, chunk 9](https://gospod-bog.ru/data/search-manifest.json?editorial=followup-promotion-20261118T1339Z) — новая запись и прежний `modifiedTime`; [досье, chunk 0](https://gospod-bog.ru/journal/dossiers/g3/?editorial=followup-promotion-20261118T1339Z) — тот же заголовок страницы и новый social image URL. Также повторно видны [места исходника в «Коде»](https://gospod-bog.ru/articles/kod-da-vinchi/?editorial=followup-promotion-20261118T1339Z) и [строка 49](https://gospod-bog.ru/nagornaya/istochniki/?editorial=followup-promotion-20261118T1339Z). Это не live-браузер и не подтверждение всех четырёх сырых HTML по хешам.

Девять локальных файлов post-#2337 сверены по SHA-256 и размеру со значениями **нового immutable manifest**, `criticalAssets` и `extensions.tts.assets` (`sw.js` учтён один раз). `sha256sum` совпал для всех девяти; это не загрузка самих live-файлов и не вычисление digest всего дерева.

| Путь из `dist` | Bytes | SHA-256 (local = manifest) |
| --- | ---: | --- |
| `index.html` | 171199 | `91f60925313ccaf35aff00ecafae439dee8055d92a0c17686fa4bdb097f11d3f` |
| `sitemap.xml` | 40740 | `9af6845d820d3a7be12c42d09a056277a41cbbe4ae5055dd6364ebfedb100899` |
| `feed.xml` | 67706 | `2f064bee880d965998b67a43801e4320faa27e010ca788e823d78ea5286e2724` |
| `pagefind/pagefind.js` | 45555 | `252d272bd34d483d19a752060f6a065114d15ab12c42d8f905ca565e2768a009` |
| `sw.js` | 12075 | `bb819eefeb367797643b820409be424c876862bb6e13b31740a4e9c4d9c5c301` |
| `js/floating-cluster-controller.js` | 155194 | `bd2d040cab7c4298a28db36eef9899bd6fdfda1d7e62f6b69c209e914173fc7a` |
| `js/vosk-tts-engine.js` | 27206 | `d94ada1765884c66dfee92c3deaa15addab3474ac1ea9c4430a6c361c59bb005` |
| `js/vosk-tts-worker.js` | 37632 | `425cf72acf6985b26ffa782e161fcdd615522c382316f2f0b3fab5499fbc0122` |
| `css/tts-download-notice.css` | 9648 | `a00e2b067e0ff874bd36c8caefca9236274c6ce32e9fb549432869b0ee669256` |

Четыре хеша `htmlSha256` локальных маршрутов из [JSON браузерного прогона](followup-browser.json) (одинаковы на `381f8f96…` и `9edef94e…`):

| Маршрут | SHA-256 локального `index.html` (`htmlSha256`) |
| --- | --- |
| `/articles/kod-da-vinchi/` | `fe2e458188c74664533adb8747b702bc151801ec7b7561a08696c3f941d8de89` |
| `/nagornaya/istochniki/` | `55a52c9d32e8c4b67f1ff2f07efadd22f1504b0483baab6ab41a453d4b865563` |
| `/baptisty-rossii/spravochnik/` | `516e1a2fd4f11442199343103519be144b41f8adf08e70517157c4725c92a35b` |
| `/baptisty-rossii/podpolnaya-pechat/` | `f441a32b1888bda81f2560a6a7b13aa0c2f553d3b244b4e75eac48cb0ced41ba` |

## Воспроизведение

В уже распакованном exact Product, не в AuditRepo, с установленными Node/npm:

```sh
# Для 381f8f96… — 2026-11-18T10:39:11Z, для 9edef94e… — 2026-11-18T13:24:28Z
export CI=1 ASTRO_TELEMETRY_DISABLED=1 PUBLIC_GB_GROK_HERMENEUTICS_PILOT=1
export GB_BUILD_INSTANT=2026-11-18T13:24:28Z
npm ci --no-audit --no-fund
npm run strangler:build:production-like
npm run pagefind:build:dist
node scripts/dist-publication-audit.js --require-pagefind --forbid-dev
```

Затем `node /path/to/evidence/followup-browser.mjs /path/to/exact-product /path/to/chromium`. Требуется Playwright из `npm ci` Product и совместимый Chromium. Здесь — Chromium `153.0.8010.0` из `@sparticuz/chromium@153.0.0` с NSS в `LD_LIBRARY_PATH`; executable и библиотеки не часть репозитория. [Скрипт](followup-browser.mjs) использует только локальный `dist`: раздаёт его через перехват canonical origin в изолированном браузере, гасит внешние запросы, блокирует service workers. [JSON](followup-browser.json) — исходный якорь; тот же скрипт прошёл и на post-#2337. Это проверка наблюдаемого дефекта, не тест целевого исправленного поведения. Нет замеров на физических устройствах, реальных сетевых загрузок, WebKit/AX или полного accessibility-аудита.

- `#sec-church`: локатор абзаца «Апостол Иоанн» → `.gterm[data-term="плоть"]` → click → `.gtip-brief:visible`. Не искать открытый payload только внутри триггера: активная подсказка может быть вынесена. Абзац «Поликарп Смирнский» → `.fn-marker` → focus и Enter → активный `.tooltip` с opacity 1, `aria-expanded=true`. Публичное извлечение тоже содержит сноску, но само по себе не доказывает её открываемость.
- [`/nagornaya/istochniki/#sec-5`](https://gospod-bog.ru/nagornaya/istochniki/#sec-5): строка [49] снята как текст реально отрисованной строки (не из метаданных). В [Chicago Statements](https://defendinginerrancy.com/chicago-statements/) читать **сами** *Articles of Affirmation and Denial* (1978 XIII; 1982 XIII) и **Exposition → The Scope of Biblical Interpretation**, не пересказ и нумерацию в вводном абзаце зеркала.
- `data/bible/public-domain-russyn.json` → `.books["1JN"]["4:3"]`, `.books.GAL["1:8"]`, `.books.JUD["1:3"]`. Внешний контроль русского чтения: [1 Ин. 4:3](https://www.bible.com/ru/bible/400/1JN.4.3.RUSV) и [Гал. 1:8](https://www.bible.com/ru/bible/400/GAL.1.8.RUSV). Сопоставлялись пропуски/форма слова, не пунктуационная нормализация редакций. Для датировки и состояния Мураториева фрагмента дополнительно [Schnabel, *JETS* 57/2, 2014, с. 231–232 (preview)](https://www.galaxie.com/article/jets57-2-01): 85 строк, утрачено начало, вероятно и конец; `I 101 sup.` у Schnabel, `J 101 sup.` на сайте. Это причина проверить каталог и издание, не самостоятельный приговор шифру или колляция рукописи.

### Шкала в браузере

| CSS px | `.ctw-body` (client / scroll px) | Даты с layout / 9 | После `ArrowRight` | Центры подписей 30 / 100 / 200 / 300 / 400, % plot |
| ---: | ---: | ---: | ---: | --- |
| 320 | 188 / 188 | 6 | не тестировалось | 8,44 / 26,20 / 46,10 / 67,25 / 88,91 |
| 390 | 253 / 253 | 6 | не тестировалось | 6,56 / 27,25 / 47,24 / 67,92 / 91,37 |
| 640 | 483 / 483 | 6 | не тестировалось | 2,53 / 25,87 / 48,93 / 72,26 / 96,66 |
| 641 | 484 / 605 | 9 | +48 px | 3,03 / 26,20 / 48,86 / 71,78 / 96,09 |
| 1440 | 678 / 695 | 9 | +17 px | 2,43 / 25,96 / 49,09 / 72,42 / 96,86 |

Профили 320/390 с touch/mobile emulation, остальные desktop viewport. Окно 900 px высотой. На desktop «есть layout» не значит «всё в начальной видимой части контейнера»: некоторые даты правее scrollport и доступны прокруткой. На мобильных шесть оставшихся дат укладывались по горизонтали; у трёх отсутствующих `display:none`, а не отсечение по краю. Замер сделан после загрузки локальных шрифтов. `startPct` измерен от `.ctw-bwrap`, `centerPct` деления — от `.ctw-axis`: левые края и ширины этих прямоугольников совпали. Статическая модель полос даёт координаты для 30 / 100 / 200 / 300 / 400 **0 / 17,5 / 42,5 / 67,5 / 92,5%**. Именно независимое CSS-распределение подписей, а не смена формулы полос, объясняет наблюдаемое отличие. Это проверка того, как **сайт рисует собственные даты**, не принятие диапазонов дат как исторической истины.

## Маршрут получения страниц 1971

| Источник | Что открыто и что запрашивать |
| --- | --- |
| **Вестник РХД №1 (115), 1975** | [PDF выпуска](https://www.rp-net.ru/tools/d_cnt.php?IBLOCK_ID=47&ID=6906) — обложка и первые страницы; [оглавление издателя](https://www.rp-net.ru/book/vestnik/contents.php) — 1975 → №1 (115) → «Судьбы России» → «Люди и факты» → «Христианское издательство в Советской России». [Wave2](../../../../reverify/2026-11-11-baptisty-source-witness-wave2.md) указывает **печатные** с. 222–223, не № страницы PDF. Чтение PDF в среде ограничено первыми 30 страницами. [Дом русского зарубежья](https://www.domrz.ru/library/) — библиотека, `bibliodomrz@yandex.ru`; [указатель библиотеки](https://www.domrz.ru/library/materials/bibliograficheskie-posobiya/nikita-alekseevich-struve-na-stranitsakh-zhurnala-vestnik-rskhd-rkhd-1974-1993/) содержит описания материалов №1 (115); страницы о «Христианине» это не заменяет. Запросить титул/выходные данные и с. 222–223 с видимой печатной пагинацией. |
| **Хроника защиты прав в СССР №15, 1975** | [Карточка](https://vtoraya-literatura.com/publ-5002): Нью-Йорк, «Хроника», 70 стр.; [PDF](https://vtoraya-literatura.com/pdf/khronika_zashchity_prav_v_sssr_vyp15_1975__ocr.pdf) даёт обложку/выходные сведения и оглавление с началом библиографии на **с. 54** и указателя на **с. 64**. Извлечённые chunks 4–5 — сообщения о заключённых, не библиография с. 62. Запросить **с. 62 и титул** либо открыть полный PDF штатным просмотрщиком. Коллекция «Из библиотеки Марио Корти» — provenance этого цифрового выпуска, не права на переиздание. Не путать с «Хроникой текущих событий», в т. ч. с её №35. |
| **Blinken OSA, источник на уровне архивных шифров** | Индекс старой карточки [1](https://catalog.osaarchivum.org/catalog/x99wA6Qq) выдаёт `300-85-9:21/61` **AS 878**, *Заявление о создании издательства «Христианин»*, и `300-85-9:21/62` **AS 879**, *Обращение ко всем верующим ЕХБ об издательстве «Христианин»*, оба опубликованы в *Sobranie Dokumentov Samizdata*, т. 15. Для AS 878 указаны `one published copy and one German translation`, `Published Versions: "Khristianin" 5 June 1971`; для AS 879 `one published copy`, в заголовке 1971. Прямое открытие старой карточки не удалось; [действующая карточка серии HU OSA 300-85-9](https://catalog.archivum.org/catalog/x99wA6Qq), [ARK](https://ark.archivum.org/ark:/29761/c13dx665g2k), подтверждает состав серии и объясняет библиолисты и порядок поступления. У серии указаны `Not Restricted` и `Reproduction is allowed for non commercial purposes`; это не проверка доступности нужных листов для сканирования и не проверка прав на конкретную публикацию. Item-level страницы, подписи и сканы не просмотрены. |
| **Алексеева → AS 878** | Л. М. Алексеева, *История инакомыслия в СССР*, глава «Евангельские христиане-баптисты», [абзац «В июне 1971 г.»](https://modernlib.net/books/alekseeva_lyudmila/istoriya_inakomisliya_v_sssr/read_16/) и [примечание 22](https://modernlib.net/books/alekseeva_lyudmila/istoriya_inakomisliya_v_sssr/read_17/): «АС № 878 (т. 15)». Это прочитанные текст и сноска в электронной публикации (номера URL 16/17 — деление читалки, **не** печатные с. 16–17). Альтернативная копия [абзаца](https://document.wikireading.ru/19046) без собственно примечаний и пересказы с почти той же формулировкой не прибавляют независимости. Цитата покрывает самоназвание, цель, пожертвования и безвозмездность — не полную переписку и не исполнение заявленных правил. |
| **Доступ к SDS т. 15** | [Другой фондовый ряд HU OSA 300-85-11](https://catalog.archivum.org/catalog/jmLJ9l1p), ARK `c1mg7p4c8xt`: полный комплект перепечаток, есть примечание «THIS SERIES CANNOT BE ACCESSED UNTIL EARLY 2027», несмотря на общее поле `Not Restricted`. Это оговорка **именно серии -11**, не утверждение о доступе к позициям **-9**. [Подфонд](https://catalog.archivum.org/catalog/jDen7kVB) указывает микрофиши SDS в библиотеке OSA; их наличие и возможность копирования т. 15 нужно подтвердить. [HathiTrust](https://catalog.hathitrust.org/Record/004141312) указывает [т. 15 в фонде University of Michigan](https://babel.hathitrust.org/cgi/pt?id=mdp.39015049800645) как `Limited (search only)`, не как открытый полный текст. |

Если OSA не сможет дать т. 15, Series -11 перечисляет библиотеки, получившие комплект для воспроизведения, в том числе Bayerische Staatsbibliothek, Bodleian и Library of Congress. Это резервный адресный поиск по `Sobranie Dokumentov Samizdata`, т. 15, AS 878–879, не подтверждение текущей выдачи каждой из библиотек. SDS предупреждает, что при перепечатке исправлялись опечатки и могли добавляться редакционные сноски. Копия SDS может подтвердить текст этой публикации, но не вид подписей на исходном листе.

**Что не прибавляет свидетелей.** Один и тот же канал «Наследие верных»: [№1550](https://t.me/baptisthistory/1550) называет памятной датой 5 июня и утверждает отправку в этот день; [№2772](https://t.me/baptisthistory/2772) даёт 10 июня как памятную дату. [№1551](https://t.me/baptisthistory/1551), [№1552](https://t.me/baptisthistory/1552) — указатели на два JPEG `IMG_5044.jpg` / `IMG_5043.jpg`, а не прочитанные здесь страницы. Ни это, ни нулевая доступная выдача Google Drive по поиску имён не опровергают наличие документов. Немецкий перевод и русский экземпляр одного заявления не два независимых рассказа о его судьбе. `AS` — номер поступления; `Published Versions` — описание версии, не отметка канцелярии адресата.

### Черновик запроса (не отправлен)

К [Blinken OSA](https://catalog.archivum.org/researchers-guide), `archivum@ceu.edu`:

> **Subject: Research copies — HU OSA 300-85-9:21/61 (AS 878) and :21/62 (AS 879)**
>
> Could you confirm the citation and availability of the Russian copies and registration sheets for these two documents on the Khristianin publishing house? AS 878 is addressed to A. N. Kosygin and the index lists 5 June 1971 under Published Versions; AS 879 is addressed to all ECB members and is reported elsewhere as dated 10 June 1971. For each item, could we consult all leaves of the Russian copy, including the opening and closing leaves and any date, endorsement, signature or provenance note? If items in series -9 cannot be supplied, would the library microfiche of *Sobranie Dokumentov Samizdata*, vol. 15, be available instead? Please distinguish the terms for an internal research copy, quotation and public reproduction of a page image. We are not assuming permission to publish.

Для библиотеки с выпуском РХД: «Просим копии титула и с. 222–223 (с напечатанными номерами страниц) “Вестника Русского христианского движения”, 1975, №1 (115), рубрика “Христианское издательство в Советской России”. Цель — сравнить даты, адресатов и редакцию двух текстов. Укажите, пожалуйста, источник экземпляра и отдельно условия цитирования и воспроизведения страницы». Для держателя «Хроники» — тот же запрос только на титул и печатную с. 62, №15 (май–июнь 1975).

При поступлении материалов записать для каждого: хранителя, шифр/издание, печатный номер и номер кадра/PDF, вид копии, открывающую/заключительную строки, кем и как датировано, есть ли пометы публикатора и отметка о доставке. Чтение перепечатки, проверка архивного экземпляра, удостоверение подписанного/полученного оригинала и разрешение на публикацию изображения — четыре разные проверки. В intake нет чужих сканов или полных цифровых выпусков.
