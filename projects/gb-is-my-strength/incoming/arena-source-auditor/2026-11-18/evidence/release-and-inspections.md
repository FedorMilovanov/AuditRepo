# Свидетельства выпуска и воспроизведения — 18.11.2026

## 1. Четыре разных проверки, не один статус

| Слой | Свидетельство | Граница |
| --- | --- | --- |
| Exact source | [Product `381f8f9613bb968754c2432ed9648cd6e42282a9`](https://github.com/FedorMilovanov/gb-is-my-strength/tree/381f8f9613bb968754c2432ed9648cd6e42282a9), 10:39:11 UTC; GitHub API `commits/main` в начале и при повторе; `codeload …/tar.gz/<sha>`, не архив движущегося `main`. | Исходник не означает релиз. |
| Развёрнутый идентификатор | [Первый pointer](https://gospod-bog.ru/deployments/current.json?editorial=20261118T130110Z), [повтор](https://gospod-bog.ru/deployments/current.json?editorial=20261118T131132Z) и [immutable manifest](https://gospod-bog.ru/deployments/381f8f9613bb968754c2432ed9648cd6e42282a9/44287427833-1.json) согласованы: release/control `381f8f96…`, run **44287427833**, attempt **1**, кандидат `381f8f9613bb968754c2432ed9648cd6e42282a9:44287427833-1`, digest `sha256:baa0687ad456c6581e212fa52eaa60f0916b78e253fd5ba672bd4e30cbde386f`. Immutable сообщает `generatedAt=2026-11-18T10:58:04.386Z`, 1429 файлов / 116581057 байт. | Доказательство идентификатора, который публикует сайт, не байтов всего дерева. |
| Build и байты | Локальная сборка под пинами CI; **5/5 общих и 4/4 дополнительных TTS-файлов** совпали по размеру и SHA-256 с ожидаемыми из immutable (см. ниже); `/sw.js` присутствует также в TTS-расширении и не посчитан вторично. [Run](https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/44287427833) `success`, jobs *Build and validate immutable release candidate* и *Promote exact readiness candidate* успешны; в promotion прошли Generic live и TTS live. | Сырые ответы live не экспортированы/не хешированы из песочницы: `fetch_page` даёт текст/markdown, а не байты; HTTP-доступ `bash` к домену Product отсутствует. `gh run download` двух отчётов (artifact IDs `14421840169` и `14420294111`) закончился `EOF` на скачивании; содержимое не осмотрено. Не засчитывать статус job как просмотр JSON-отчёта CI или выполнить SHA-256 над извлечённым текстом. |
| Показ читателю | Локальный Chromium 153.0.8010.0, 1440×900 и 390×900 CSS px для каталога/G3/Baptist/Диотрефов и непосредственных цитат; точечные клики по сноскам Чау и подсказкам 1 Петра на 1440×900. Отдельно извлечение живых страниц для констатации их текста. | Не `live-browser`, не устройство читателя, WebKit, axe, все профили или внешний link crawl. Не делать выводы о geometry из source HTML. |

Планка: Product [`docs/RELEASE-LIVE-EVIDENCE.md`](https://github.com/FedorMilovanov/gb-is-my-strength/blob/381f8f9613bb968754c2432ed9648cd6e42282a9/docs/RELEASE-LIVE-EVIDENCE.md), «Candidate and live byte boundary». Для полного уровня по этой планке остаются именно **сырые HTTP-ответы** для сравнения с ожидаемыми данными, а не ещё одно извлечение markdown. Наблюдения редакционной выборки ниже этой планки возможны, но метятся отдельно.

### Локальный postbuild → ожидаемые размеры/хеши immutable

| Публичный путь | Локальный файл под `dist/` | Байты | SHA-256 локального файла (равен полю в манифесте) |
| --- | --- | ---: | --- |
| `/` | `index.html` | 171199 | `91f60925313ccaf35aff00ecafae439dee8055d92a0c17686fa4bdb097f11d3f` |
| `/sitemap.xml` | `sitemap.xml` | 40726 | `a1cbe87a75f07527bf7ed2255943ccdf13b54137f2d03029a50ba0184c4ef349` |
| `/feed.xml` | `feed.xml` | 67762 | `25ee8f18a2d8b25e909ffa2d8c8ed5e5ed69f20725c0c6a5777afa9c8e70be27` |
| `/pagefind/pagefind.js` | `pagefind/pagefind.js` | 45555 | `252d272bd34d483d19a752060f6a065114d15ab12c42d8f905ca565e2768a009` |
| `/sw.js` | `sw.js` | 12075 | `bb819eefeb367797643b820409be424c876862bb6e13b31740a4e9c4d9c5c301` |
| `/js/floating-cluster-controller.js` | `js/floating-cluster-controller.js` | 155194 | `bd2d040cab7c4298a28db36eef9899bd6fdfda1d7e62f6b69c209e914173fc7a` |
| `/js/vosk-tts-engine.js` | `js/vosk-tts-engine.js` | 27206 | `d94ada1765884c66dfee92c3deaa15addab3474ac1ea9c4430a6c361c59bb005` |
| `/js/vosk-tts-worker.js` | `js/vosk-tts-worker.js` | 37632 | `425cf72acf6985b26ffa782e161fcdd615522c382316f2f0b3fab5499fbc0122` |
| `/css/tts-download-notice.css` | `css/tts-download-notice.css` | 9648 | `a00e2b067e0ff874bd36c8caefca9236274c6ce32e9fb549432869b0ee669256` |

Сверка версии `package-lock.json`: `5fa7defa3c535c0d9a9f9d8d6f86575298dfa2a83fddd03a162550e121964cf8` — как в манифесте. Полный canonical digest локального дерева с digest кандидата не сравнивался. Смысловая сверка не требует запуска TTS.

## 2. Рецепт и результаты

Рабочий каталог — распакованный exact tar Product под `/tmp`, не AuditRepo. Под Node `22.23.4` и npm `10.9.9`, как в `deploy.yml`. Для архива без `.git` передан committer instant (не `now`); включён единственный выпускной пилот Чау. Первичная попытка с npm 10.9.8 и без instant не считается успешной сборкой.

```sh
# В исходнике Product 381f8f96…, с установленными версиями Node и npm
export CI=1 ASTRO_TELEMETRY_DISABLED=1 GB_BUILD_INSTANT=2026-11-18T10:39:11Z
export PUBLIC_GB_GROK_HERMENEUTICS_PILOT=1
npm ci --no-audit --no-fund
npm run strangler:build:production-like
npm run page-ownership:dist:production-like
npm run pagefind:build:dist
node scripts/dist-publication-audit.js --require-pagefind --forbid-dev
npm run editorial:lint
npm run sources:hygiene
npm run article:qa
npm run content:parity
npm run gill:claims:surface:audit
npm run baptisty:roadmap:audit
```

- **Все перечисленные проверки** на успешной попытке завершились с кодом 0. Astro: 112 сгенерированных страниц; после copy/postbuild 113 `index.html` и 117 файлов `*.html`. Metadata updater: 78/78. Pagefind: 103 индексируемых документа, 147 файлов под `dist/pagefind/`; audit: 103 sitemap URL разрешаются, 44 обязательных Astro routes присутствуют в Pagefind. Манифестные 114 route profiles / 113 HTML / 103 sitemap — отдельные контрактные счётчики, не размеры каталога.
- `article:qa`: 180 обследованных файлов, 0 ошибок/предупреждений. `sources:hygiene`: 164 файла в заданных scopes, отдельная конфигурация reader. `content:parity`: 73/73. Gill surface guard: 10 claims, 0 нарушений/предупреждений. Baptist roadmap guard: PASS. Ни один из этих результатов не доказывает корректную передачу каждой цитаты, отсутствие служебной лексики вне его области или достоверность всех ссылок.
- Структурный проход: `parse5` разбирает `dist/articles/index.html`, внутри `#publikacii` собираются `a[data-catalog-route]`/`a[data-catalog-series]`; `href` сравнивался с data-атрибутом. Для URL разыменован `dist/<path>/index.html`, разбираются H1 и JSON-LD (в том числе `@graph`), сверяются `migration/page-ownership.json`, `dist/data/search-manifest.json`, `sitemap.xml` **`url/loc`**, не `image:loc`, и `feed.xml` **`channel/item/link`**. Внутри выборки article/main из 89 страниц: **619** уникальных пар «страница → внутренний HTML/якорь» в пределах каждой страницы, **0** отсутствующих конечных HTML/ID. Это не исчерпывающий link check: не обходились внешние домены, app query routes, неразмеченные модули и все переходы JS. Выбор узла `article` и нормализация текста могут исказить вложенную разметку; для существенных находок ниже проверен конкретный locus.
- [TSV](catalog-inventory.tsv): по одной строке на карточку, в порядке DOM. `route_entrypoint` — owner из `page-ownership`, не обязательно тело текста; `jsonld_type` — основной Article/ScholarlyArticle/WebPage в этой выборке; `series_id` / `series_position` берутся только из опубликованных `.parts` `dist/data/series.json`, `-` — нет в этом реестре, не заключение о принадлежности. `/articles/` 56, `/nagornaya/` 5, `/baptisty-rossii/` 10, `/hard-texts/` 7, `/journal/` 1, `/karty/` 1. Основной RSS: **81** item = 79 карточек без карты Авраама + `/nagornaya/`, `/nagornaya/seriya/`. Search: **104** записи; каталог: **80** материалов, **10** серий/хабов.

### Опубликованные группы (`data/series.json`, `.parts`)

| ID | Позиций | Сумма `readingTime`, мин | От чего отличать |
| --- | ---: | ---: | --- |
| `nagornaya` | 5 | 89 | 16 + 11 + 12 + 25 + 25; два входа (`/nagornaya/`, `/nagornaya/seriya/`), одна пятёрка. Библиография и находки — отдельные страницы, не части. |
| `dzhon-gill` | 6 | 239 | Контекст, I–IV, справочник. Исторические суффиксы URL III/IV не задают reader-порядок. |
| `pastor-series` | 9 | 157 | Девять `hasPart`, отдельно `subjectOf` (Диотрефы); фрагменты специальных лент не равны каталогу. |
| `hard-texts` | 6 | 228 | Книга «Тайны человеческого сердца»: пролог, I–IV, справочник (`heartSeriesData.ts`). Путь `/hard-texts/` и одноимённый ID реестра — не список всех URL под префиксом. |
| `russian-baptism` | 10 | 229 | Девять материалов (главы I–IV: 3+2+2+2) + один справочник. План 17–20 не опубликованный объём. |
| `genesis-6` | 6 | 170 | VI, VI-A, VI-B, VII, VIII, IX; хаб не глава, другой материал `/hard-texts/otstuplenie-ot-very-iuda-evreyam-6/` не входит в эту шестёрку. |
| `teen-double-life` | 7 | 264 | Каталог и реестр дают эти семь опубликованных позиций, без вывода о других drafts. |
| `apostasy-series` | 5 | 79 | Все 5 опубликованы; не путать маршрут `otstuplenie-ot-very-iuda-evreyam-6` с отдельной отступнической серией без проверки членства. |

Каждый путь получен из `baseUrl + slug + "/"`; **54 слота, 54 уникальных URL, 54 пересечения с каталогом**. Два оставшихся входа из 10 карточек — общий `/biografii/` и второй вход «Нагорной». Некоторые карточки хабов указывают продолжительность самого обзора (например, 3 мин для Genesis 6 Hub); не сравнивать её с суммой без проверки роли показателя. Ненумерованное «Досье A» не прибавлять к девяти нумерованным частям.

## 3. Контрольные способы повторить читательскую проверку

Browser открыт по canonical origin с `serviceWorkers: 'block'`: запросы этого origin перехвачены и удовлетворены из локального `dist`, внешние запросы отменены. `@sparticuz/chromium@153.0.0` + NSS, `--no-sandbox`/`--disable-dev-shm-usage`, без отключения web security. Sandbox setup принадлежит среде теста, а не Product. Для гидратации дождаться отклика glossary JSON и появления нужного узла, не только `DOMContentLoaded`.

| Проверка | Шаги и наблюдаемое состояние |
| --- | --- |
| G3 | `#publikacii a[data-catalog-route="/journal/dossiers/g3/"]` → старый title, «8 мин» (оба viewport). Article JSON-LD внутри `@graph` на route → `headline` новый, `datePublished=2026-09-09T00:00:00+03:00`, `dateModified=2026-11-18T00:00:00+03:00`, `timeRequired=PT11M`. `#finance p`/`#wind-down p` читать через `innerText` без перепаковки тегов. `main .source-note, main .claim-ref a, main a.claim-ref` с G3-PUB → 14 видимых, один href; Отдельно 2 внутренних ссылки `#src-…`, не входящих в 14 G3-PUB. `.bibliography-details > summary`: закрыто; Enter → открыто; `ol.bibliography-list > li`: 21. |
| Чау, `#sec-sufficiency` | Если клонировать абзац и убрать `.tooltip,.gtip,.btip`, `Во-вторых, факт` в первом locus и `Например, Ис. 53` во втором отсутствуют. Во всплывающем payload соответственно №108/109 есть. Закрыто: opacity `0`, `aria-expanded=false`; Enter: opacity `1`, `aria-expanded=true`, активный tooltip вынесен за границы абзаца. Нет основания объявлять текст потерянным из DOM. Печатные страницы 135–136: сопоставить оригинальный соседний переход на с. 136 и собственно гл. *Establishing the Sufficiency of Grammatical-Historical Hermeneutics* (см. PDF в CR-02). |
| 1 Петра | На маршрутах CR-03 развернуть подпись в цитате: `blockquote#gill-search-p-038 .gterm[data-term="плоть"]`, `blockquote#gill-search-p-015 .gterm[data-term="плоть"]` соответственно. В сборке элементы возникают только после JS; видимые формы `плоти`/`плотью`, click → общий `.gtip-brief` о Павле. Не использовать якоря Pagefind следующего релиза как стабильное начало цитаты; текст рядом и owner line указаны в отчёте. |
| «Диотрефы» | В article surface `.source-ref` 56, из них с `<a>` 55; выборка 21 основной карточки ведёт в `#sources`. `#faithful-witness-under-pressure` — 15 карточек, 14 прямых ссылок, отдельная библиография. Не считать содержимое всплывающих панелей основным текстом только по сериализации. |
| «Баптисты России» | В book hub `#chapter-i`…`#chapter-iv`: 3, 2, 2, 2 ссылок на статьи. Справочник — отдельная запись; live reader на `/spravochnik/` и `/podpolnaya-pechat/` сверялся с действующими Body, не архивными MDX. |

### Отобранные внешние границы

Внешние источники в [REPORT.md](../REPORT.md) читаются с разным весом: библейские edition/TOC/издательский PDF для формулировки или локатора; Research handoff для границ публичного пересказа; воспроизведённое письмо для слов его автора (не независимое расследование); периодический выпуск/указатель для существования публикации. Для 1971 обложка/оглавление доступны, поздние печатные с. 222–223 и с. 62 не предъявлены инструментом чтения в этом проходе; OCR/вторичный пересказ не заменяет их. Сокращённый вывод относится только к сопоставленным фрагментам. Полную визуальную колляцию и проверку прав не имитировали; сырые сканы/полный `dist` не хранятся в intake.
