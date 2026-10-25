# GBS — универсальность publication engine и безопасность авторского пути

Дата: 2026-10-25
Product anchor: `015573af602dd7b8d49feb296638b3447364a529`
Disposition: **admit `SYS-CONTENT-AUTHORING-PUBLICATION-CONTRACT`**
Evidence: `evidence/2026-10-25-content-authoring-universality.jsonl`

## 1. Краткий вывод

Заявление «один движок на все серии» верно только для читательского chrome. `SeriesReaderChrome` действительно обслуживает flat/book формы, Roman/label/letter/Arabic tiers и шесть активных wrapper families; текущий `engine:contracts` насчитывает 45 facade consumers. Это сильная и реальная универсализация runtime.

Но **publication/authoring engine не универсален**. Новый агент должен вручную согласовать несколько независимых владельцев: MDX/frontmatter, item/page config, family wrapper или Body, explicit route, иногда отдельный PageHead, `data/series.json`, media/search/editorial projections, route profile и page ownership. Для standalone articles канонического пути в текущем agent router нет, генератора нет, а generic `ArticleLayout` имеет только одного source consumer. `SeriesArticleLayout` остаётся без source consumers и прямо помечен документацией как parallel unused abstraction.

Главное — это уже не только неудобство. Два контролируемых отрицательных dry run доказали fail-open:

1. валидный новый MDX без route проходит `npm run astro:build`; сборка остаётся зелёной, строит прежние 104 страницы и не создаёт probe URL;
2. `npm run content:coverage:audit` с этим orphan MDX также выходит 0;
3. новый flat-series core item только в `teenSeriesConfig.ts`, без `pages[id]`, route и `data/series.json`, проходит `astro check`, `engine:contracts` и `audit-pro`.

Поэтому агент может получить зелёные рекомендованные проверки и при этом не опубликовать статью либо добавить в навигацию ссылку на отсутствующую страницу. Принимается один system root: **`SYS-CONTENT-AUTHORING-PUBLICATION-CONTRACT`**. Матрица: **49 → 50 = 27 direct + 4 improvements + 19 system lanes**.

## 2. Что действительно универсально

### 2.1 Shared series runtime

`seriesConfig.ts` задаёт общий `SeriesConfig` и проверяет:

- уникальность IDs;
- допустимые mark kinds;
- связи satellite/chapter/article;
- последовательную арабскую нумерацию внутри book chapters;
- shape ↔ chapter consistency;
- непустой curated `partToc` для объявленных pages;
- формат theme и базовые обязательные поля.

`SeriesReaderChrome.astro` — facade над общим Gill-derived chrome. Текущий контракт сообщает 45 consumers; browser sweep явно выбирает Gill, Hard Texts, Baptists, Pastor, Teen и Genesis 6. Это не шесть независимых UI engines.

`shape:'book'` также реализован как конфигурация того же engine, а не отдельная копия. На уровне reader chrome оценка универсальности высокая: **4/5**. Один балл не ставится из-за family-specific document/SEO wrappers и side-effect registration, а не из-за UI-render fork.

### 2.2 Сильные локальные проверки

Русские адресные ошибки `defineSeriesConfig` полезны: неверная chapter topology или пустой `partToc` падают близко к источнику. Content schema также хорошо описывает title/description/slug/section/date/OG invariants.

Это важные положительные контроли. Найденный root не требует отказаться от explicit editorial review или сделать «магическую CMS».

## 3. Где authoring остаётся фрагментированным

Текущий source census:

| Surface | Текущее состояние |
|---|---:|
| `src/pages/**/index.astro` | 104 explicit routes |
| `src/content/articles/*.{md,mdx}` | 64 entries |
| `*PageHead.astro` | 64 components |
| `data/route-profiles/*.json` | 106 profiles |
| Shared series facade consumers | 45 |
| Active series families в browser sweep | 6 |
| First-class article/series scaffold command | 0 |

Маршруты используют несколько разных рецептов: route-local `PageHead + Body`, direct MDX + family wrapper, один generic `ArticleLayout`, специальные Gill/Nagornaya/landing owners. Различия частично редакционно оправданы, но у нового агента нет одного актуального decision tree, который по publication shape выбирает owner и атомарно создаёт обязательные projections.

Особенно показательно:

- `PastorSeriesArticlePage`, `TeenSeriesArticlePage` и `Genesis6ArticlePage` повторяют собственные frontmatter assertions, SEO/JSON-LD и document shell;
- Baptists сохраняют per-article Body/PageHead ownership;
- `ArticleLayout.astro` фактически используется одним Lawson route;
- `SeriesArticleLayout.astro` не используется страницами, хотя guards продолжают защищать его как abstraction;
- `SERIES_CONFIGS` наполняется imports с побочным эффектом, поэтому это не самодостаточный discoverable registry всех серий;
- `data/series.json` вручную дублирует title/order/minutes из TS configs; guide одновременно требует обновлять обе поверхности и называет config «одним источником».

Оценка универсальности authoring API: **2/5**. Оценка удобства первого безопасного изменения: **2/5**. Это оценка по воспроизводимому числу owners и fail-open probes, а не по вкусу к file count.

## 4. Dry run A — валидный материал без публикации

Во временный clean Product checkout добавлен schema-valid draft `src/content/articles/arena-authoring-probe.mdx`. Route, ownership и registry не добавлялись.

Результат:

- `npm run astro:build` exit 0;
- Astro check: 0 errors;
- final message: 104 pages built — то же число, что у baseline;
- `dist/articles/arena-authoring-probe/index.html` отсутствует;
- build не выдаёт ошибки про orphan content;
- отдельный `npm run content:coverage:audit` exit 0;
- его итог: `expected=0`, `explicit-skips=104`, `passed=1/1`.

То есть schema проверяет форму entry, но publication completeness не проверяет, что entry имеет public owner/route либо явно зарегистрирован как non-public draft. Это fail-open gap между content model и route ownership.

## 5. Dry run B — config-only серия

Во временный `TEEN_DOUBLE_LIFE_SERIES.items` добавлен корректно сформированный core `label` item:

- unique id;
- valid mark/title/href/readingTime;
- без `pages[id]`;
- без route;
- без `data/series.json`.

Результат:

- `npx astro check` exit 0, 0 errors;
- `npm run engine:contracts` exit 0;
- facade guard exit 0;
- `node scripts/audit-pro.js` exit 0, `AUDIT PASSED`.

Причина видна в validator: обязательность `pages[id]` проверяется только для `mark.kind='arabic'`; для flat Roman/label core item обратного требования нет. Цикл `Object.entries(cfg.pages)` доказывает только `page → item`, но не `published item → page/route`. Согласованность TS config ↔ `data/series.json` в этом probe также не была проверена, несмотря на обещание guide «иначе audit-pro красный».

Это позволяет зелёно добавить dangling navigation item. Probe был удалён; Product source после проверки чист.

## 6. Документация и first-time-agent path

`AGENTS-REFERENCE.md` правильно отправляет агента к route ownership/profile и текущему source, но не содержит канонического authoring workflow. Единственный актуально выглядящий подробный документ — `SERIES-ENGINE-GUIDE.md` — полезен для topology, однако:

- начинает existing-series flow с неуниверсальных названий data files;
- предписывает копировать соседний Body/route/PageHead;
- требует ручной синхронизации `data/series.json`;
- требует generated editorial registry отдельным шагом;
- заявляет audit-pro red на series divergence, что опровергнуто config-only probe;
- не объясняет standalone publication shapes;
- не даёт scaffold/dry-run command;
- не перечисляет route profile/page ownership как обязательные публикационные owners.

Исторические design docs действительно проектировали `new:article`/`scripts/new-article.js`, но такого current command в package/scripts нет. Архивный план не является shipped capability.

## 7. Дедупликация и границы

- Это не повтор `SYS-HEAD-ASSET-PROJECTION-PROLIFERATION`: та строка владеет common head asset revisions. Здесь root — отсутствие атомарного content→route→series→registry publication contract.
- Это не повтор `SYS-SERIES-DISCOVERY-CURRENT-AUTHORITY`: тот root про membership projections конкретной Pastor series. Здесь доказано, что общий authoring admission пропускает orphan/dangling states до публикации.
- Explicit routes и route-specific visuals сами по себе не объявляются дефектом. Они могут оставаться, если scaffold/manifest и validators делают их полными и проверяемыми.
- Не требуется немедленно переводить все 104 routes на один layout или стирать редакционные различия.
- Probe draft не выдавался за reader-facing production regression; дефект — именно зелёное admission состояние без явной non-public регистрации.
- Open Product #2164 меняет только пять MDX entries и является живым примером content-only authoring, но он draft; его intent не предполагался. #2193 владеет speed/tooltip и широким head fan-out, #2179 workflows, #2143 genealogy data. Ни один не заявляет общий scaffold/admission owner.

## 8. Условия закрытия

Нужен один проверяемый authoring contract, а не ещё один prose checklist:

1. canonical manifest/scaffold или эквивалентный typed API для standalone, existing-series item, new flat series и book series;
2. каждый MDX entry либо разрешается в public route + route profile + ownership, либо явно зарегистрирован как draft/non-public с причиной;
3. каждый navigable non-chapter series item разрешается в `pages[id]`, существующий route и article identity; chapters остаются разрешённым non-page типом;
4. TS config и `data/series.json` имеют одного producer либо строгую двустороннюю equality projection;
5. generated registries генерируются одним command и `--check` падает на stale output;
6. schema validation не обходится direct-import wrappers: route получает validated collection entry либо эквивалентный единый validator;
7. guide описывает current shapes/owners и один минимальный happy path без copy-by-memory;
8. отрицательные fixtures обязаны убивать: orphan MDX, config-only item, missing route, missing profile/ownership, stale series projection и broken `partToc` target;
9. resulting-main dry runs создают по одному standalone, existing-series item и новой flat/book series, проходят адресные ошибки и после удаления не оставляют artifacts.

Product в этом проходе не изменялся.

## 9. Продолжение — staged standalone-route dry run

После первичной admission выполнен второй контролируемый dry run: валидный MDX был подключён к explicit route через единственный реальный generic consumer pattern (`getCollection` + `ArticleLayout`). Это уточняет вывод: защита отсутствует не полностью, а **разбросана по несогласованным стадиям**.

### 9.1 Что прошло

При наличии MDX + route, но без ownership/profile:

- `npm run astro:build` — exit 0;
- probe route физически создан в `dist`;
- `astro:audit:article-mdx:strict` — exit 0 и включил probe в 36 проверенных routes;
- `route:profiles:check --strict` — exit 0;
- `surface:registry:check` — exit 0, пока route отсутствует в ownership registry;
- `content:sources:check --strict` — exit 0;
- `audit-pro` — exit 0 / `AUDIT PASSED`.

То есть эти validators не обнаруживают unregistered source route сами: effective registries рассматривают только уже admitted owners.

### 9.2 Положительный guard

`npm run page-ownership:check` является точным fail-closed контролем. На том же fixture он завершился exit 1 ровно с одной причиной:

`src page is not declared in migration/page-ownership.json: src/pages/articles/arena-authoring-probe/index.astro`

Это важная граница: полный `validate:static-publication` в итоге остановит новую undeclared route. Поэтому root не утверждает, что любой полный release run пропустит её. Проблема в другом:

- series authoring guide рекомендует `engine:contracts → audit-pro → engine:guard`, но не этот ownership gate;
- orphan MDX без route остаётся невидим даже для ownership gate;
- адресная ошибка появляется только после того, как агент уже вручную создал route;
- генератора следующего обязательного owner-файла нет.

### 9.3 Следующая стадия тоже раздельна

После временного добавления корректной ownership entry без route profile:

- `route:profiles:check --strict` всё ещё вышел 0;
- только последующий `surface:registry:check` вышел 1 и сообщил две причины: missing `surfaceContractVersion` и missing `surface`.

Следовательно, название `route:profiles:check --strict` само по себе не означает completeness всех owned routes. Полная metadata chain ловит разрыв через другой validator, но first-time agent вынужден открывать владельцев по одному, реагируя на последовательные ошибки, вместо получения scaffold или единого transaction diagnostic.

Все fixture-файлы и временная ownership entry удалены; Product source вновь чист. Эта проверка **не меняет арифметику** и усиливает уже принятую строку `SYS-CONTENT-AUTHORING-PUBLICATION-CONTRACT`, а не создаёт новую.

## 10. Продолжение — new-series executable-validation boundary

Проверен обещанный guide контракт: «`defineSeriesConfig` валидирует каждый конфиг на каждой сборке». Он верен только для **достижимого import graph**.

Создан временный type-correct `arenaOrphanSeriesConfig.ts`, который:

- вызывает `defineSeriesConfig`;
- регистрируется в `SERIES_CONFIGS` тем же side-effect pattern, что текущие families;
- намеренно содержит runtime-invalid `items: []`;
- не импортируется ни одним route/consumer.

Результат orphan состояния:

- `npx astro check` — exit 0, 0 errors;
- `engine:contracts` — exit 0, включая «Series configs: all declared through defineSeriesConfig()»;
- `audit-pro` — exit 0, 168 passed / 0 errors.

Затем тот же конфиг был импортирован временным route. `astro:build` корректно вышел 1 с хорошей адресной русской ошибкой:

`[series-engine] Конфиг серии «arena-orphan-series» невалиден: items пуст — серия без частей`

Это отделяет две вещи:

1. качество самого runtime validator — **хорошее**;
2. полнота discovery/admission новых config modules — **fail-open**.

Статический engine guard проверяет наличие текста `defineSeriesConfig(`, но не исполняет и не импортирует найденный модуль. `SERIES_CONFIGS` не является центральным статическим manifest: current family modules сами мутируют его при import, а `seriesConfig(seriesId)` не имеет production consumers. Для Baptist book даже предусмотрена намеренная замена сначала flat, затем book entry, то есть registry result зависит от import order по design.

Следовательно, безопасный scaffold должен не только написать config, но и сделать его достижимым через явный manifest/consumer и выполнить validation. Flat/book topology остаётся общей и сильной после import; отдельный book-engine defect не принимается. Эта проверка не меняет арифметику и входит в тот же `SYS-CONTENT-AUTHORING-PUBLICATION-CONTRACT`.

## 11. Продолжение — exact current surface taxonomy

После sandbox reset Product был заново восстановлен на тот же immutable anchor `015573af…`; AuditRepo snapshot byte-сверен с remote head перед продолжением. Текущий executable `public-surface-registry` даёт не prose inventory, а следующую фактическую модель 105 governed surfaces:

| Surface | Число | Реальная универсальность |
|---|---:|---|
| `series` | 76 | 40 flat + 36 book; 68 reading routes, из них 63 используют facade, 5 — explicit native exceptions |
| `article` | 4 | один semantic type, но не один document/chrome adapter |
| `page` | 10 | часть через mobile registry, часть route-native/page-landing |
| `special` | 15 | намеренно отдельные map/app/confession/genealogy adapters |

Registry contract проходит: 0 errors, 68 governed reading-series routes и 5 explicit native exceptions.

### 11.1 Series

Точное утверждение теперь такое: **shared reader engine покрывает 63 из 68 reading-series routes**, а не буквально все series-shaped routes. Пять исключений — `/nagornaya/chast-1/` … `/chast-5/` с `routeType=series-chapter`, flat shape и route-native chrome. Ещё шесть series landings и две references закономерно не обязаны рендериться article reader chrome.

Это не новый дефект: exceptions явно зарегистрированы и executable contract их принимает. Но guide фраза «движок один на все серии» без оговорки слишком широка для first-time agent. Новый author должен сначала выбрать: shared reader family или declared native exception; копирование Nagornaya как обычного template было бы неверным.

### 11.2 Standalone article

Registry знает только четыре standalone `surface=article` routes:

- Hermenevtika — registry adapter `hermenevtika`;
- Kod Da Vinci — route-native;
- Lot — route-native;
- Lawson — route-native и единственный consumer generic `ArticleLayout`.

То есть semantic class единый, а универсального `StandaloneArticlePage`/document engine нет. Route profile правильно классифицирует страницы, но не создаёт их и не выбирает реализацию автоматически.

### 11.3 Page и special

`page` — смешанная модель: каталоги `/articles/`, `/biografii/`, `/karty/`, `/konfessii/` используют default-page mobile registry, Home/Pastor — page-landing, About/Journal/Favorites — route-native. Это registry унификации capabilities, не один renderer.

`special` намеренно не должен становиться article/series engine: 10 map routes, app, confession shell+built app, map landing и genealogy сохраняют собственные interaction models. Это правильная граница архитектуры, не fragmentation defect.

Итоговая оценка не меняется: series runtime **4/5**, cross-shape authoring **2/5**. Current registry хорошо запрещает неявный новый engine после регистрации route, но не заменяет scaffold/discovery до регистрации. Arithmetic остаётся прежней.

## 12. Продолжение — targeted `partToc` guard wiring

Guide прямо называет битые `partToc` anchors частой ошибкой нового автора. В repository уже есть качественный rendered validator `series-reader-fragment-audit.js`, но executable wiring неполно:

- `series:facade:guard` по умолчанию вызывает только source assertions и печатает `fragment audit registered (source-only mode)`;
- строгий путь запускается лишь с ручным `--require-dist`;
- `engine:contracts` вызывает default source-only guard;
- `engine:guard` вызывает `engine:contracts`, Gill guard и browser sweep, но не передаёт `--require-dist`;
- отдельного package script или workflow invocation strict fragment audit нет.

Controlled fixture с `.gbs2-toc a[href="#missing-target"]` и отсутствующим ID дал:

- default facade guard — exit 0;
- тот же guard с `--require-dist` — exit 1 и точную ошибку `/articles/probe/#missing-target (1 link)`.

Это не отсутствие реализации проверки, а отсутствие её admission wiring. Сообщение `fragment audit registered` не является проверкой current rendered content.

После свежего production-like build exact main строгий validator запущен вручную как положительный baseline:

- 64 series-reader pages;
- 1 999 fragment links;
- 1 141 unique targets;
- 0 broken unique fragments;
- exit 0.

То есть текущий контент здоров и новый reader-facing defect не принимается. Риск относится к authoring safety: typo в следующем curated TOC пройдёт документированный `engine:guard`, хотя готовый fail-closed validator уже существует. Closure boundary принятого root уже требует broken-TOC negative fixture; теперь он подтверждён executable mutation. Arithmetic не меняется.

## 13. Продолжение — content-schema positive control

Чтобы не смешивать publication completeness с качеством frontmatter validation, выполнен отрицательный orphan-MDX control: route отсутствовал, но `title` и `description` были короче schema minimum.

`npx astro check` корректно вышел 1 до публикации и указал оба поля и точные ограничения:

- `title: Too small: expected string to have >=8 characters`;
- `description: Too small: expected string to have >=40 characters`.

Следовательно, collection loader видит даже orphan entries и проверяет их форму. Direct MDX imports и семейные wrapper assertions не создали доказанного обхода общей schema на текущем anchor. Root нужно формулировать узко: **валидный content object не обязан разрешаться в publication owner**, а не «MDX вообще не валидируется».

Это положительный контроль и основание не заводить отдельный frontmatter/schema defect. Для closure предпочтительно сохранить текущую адресность schema errors, убрав только дублирующие family assertions там, где они расходятся с canonical type.
