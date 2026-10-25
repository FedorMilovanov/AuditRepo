# GBS — универсальность publication engine и безопасность авторского пути

Дата: 2026-10-25
Product anchor: `015573af602dd7b8d49feb296638b3447364a529`
Disposition: **admit `SYS-CONTENT-AUTHORING-PUBLICATION-CONTRACT`**
Evidence: `evidence/2026-10-25-content-authoring-universality.jsonl`

## 1. Краткий вывод

Заявление «один движок на все серии» верно только для читательского chrome. `SeriesReaderChrome` действительно обслуживает flat/book формы, Roman/label/letter/Arabic tiers и шесть активных wrapper families; текущий `engine:contracts` насчитывает 45 facade consumers. Это сильная и реальная универсализация runtime.

Но **publication/authoring engine не универсален**. Новый агент должен вручную согласовать несколько независимых владельцев: MDX/frontmatter, item/page config, family wrapper или Body, explicit route, иногда отдельный PageHead, `data/series.json`, media/search/editorial projections, route profile и page ownership. Для standalone articles канонического пути в текущем agent router нет, генератора нет, а generic `ArticleLayout` имеет только одного source consumer. `SeriesArticleLayout` остаётся без source consumers и прямо помечен документацией как parallel unused abstraction.

Главное — это уже не только неудобство. Два контролируемых отрицательных dry run доказали fail-open:

1. валидный publishable MDX (`draft:false`, `noindex:false`) без route проходит `npm run astro:build`; сборка остаётся зелёной, строит прежние 104 страницы и не создаёт probe URL;
2. `npm run content:coverage:audit` с этим orphan MDX также выходит 0;
3. новый flat-series core item только в `pastorSeriesConfig.ts`, без `pages[id]`, route и `data/series.json`, проходит production-like build и полный `validate:static-publication`, проецируя 30 dangling links на 10 страниц.

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

Первичный fixture был schema-valid, но имел `draft:true`/`noindex:true`. Сам по себе он **не доказывал дефект**: route-less draft — легитимный prepublication shape. Этот witness сохранён как исторический контроль и superseded новым probe.

В clean Product checkout добавлен schema-valid publishable MDX без route: поля `draft`/`noindex` не заданы и schema defaults делают их `false`. Ownership и registry также не добавлялись.

Результат publishable probe:

- `npm run astro:build` exit 0;
- Astro check: 0 errors;
- final message: 104 pages built — то же число, что у baseline;
- `dist/articles/arena-publishable-orphan-probe/index.html` отсутствует;
- build не выдаёт ошибки про publishable orphan content;
- отдельный `npm run content:coverage:audit` exit 0;
- его итог: `expected=0`, `explicit-skips=104`, `passed=1/1`.

То есть schema проверяет форму entry и честно допускает drafts, но publication completeness не требует route для entry, который сам объявлен indexable/published. Это узкий fail-open gap между content model и route ownership.

## 5. Dry run B — config-only серия

Первичный fixture был добавлен в `TEEN_DOUBLE_LIFE_SERIES.items`: корректный core `label`, но без `pages[id]`, route и `data/series.json`. Astro check, `engine:contracts` и `audit-pro` прошли. Однако последующий production-like build упал на отдельном family media owner: `Unknown teen-series media page: arena-config-only-probe`. Поэтому Teen witness сам по себе доказывал разрозненность diagnostics, но **не** full-release fail-open.

Решающая проверка повторила тот же type-correct item в `PASTOR_SERIES`, где media registry не подменяет общий contract.

Результат Pastor fixture:

- `defineSeriesConfig` принял item без `pages[id]`;
- production-like build — exit 0;
- probe route отсутствует;
- 10 построенных Pastor pages содержат item;
- итоговый HTML содержит 30 `href` на отсутствующий `/articles/arena-config-only-probe/`;
- `migration:metadata:check:strict` — exit 0;
- `audit-pro` — exit 0;
- strict rendered fragment audit — exit 0 (он проверяет только `#fragment`, не cross-document targets);
- `dist-publication-audit` и production-like page ownership — exit 0;
- полный `npm run validate:static-publication` — exit 0.

Это и есть fail-open publication witness: canonical source gate сообщает `ALL CHECKS PASSED`, хотя built series navigation ведёт на отсутствующую страницу. Причина в `defineSeriesConfig`: обратная обязательность `item → pages[id]` есть только для Arabic book articles. Flat Roman/label core items не обязаны иметь page/route; TS config ↔ `data/series.json` тоже не сверяется общим контрактом.

Teen family случайно ловит такую ошибку через media map, Pastor — нет. Следовательно, безопасность зависит от wrapper family, что прямо противоречит цели универсального authoring engine. Оба fixture удалены; Product source чист.
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
- Это не повтор `SYS-SERIES-DISCOVERY-CURRENT-AUTHORITY`: тот root про approved membership projections конкретной Pastor series. Здесь доказано, что общий config authoring admission допускает новый navigable item вне page/route/data authority; publishable orphan MDX, напротив, корректно ловится strict provenance gate.
- Explicit routes и route-specific visuals сами по себе не объявляются дефектом. Они могут оставаться, если scaffold/manifest и validators делают их полными и проверяемыми.
- Не требуется немедленно переводить все 104 routes на один layout или стирать редакционные различия.
- Route-less `draft:true`/`noindex:true` признан нормальным prepublication shape. Reader-facing fail-open доказан отдельно Pastor config mutation: 30 ссылок на отсутствующий route при зелёных build и полном static gate.
- Open Product #2164 меняет только пять MDX entries и является живым примером content-only authoring, но он draft; его intent не предполагался. #2193 владеет speed/tooltip и широким head fan-out, #2179 workflows, #2143 genealogy data. Ни один не заявляет общий scaffold/admission owner.

## 8. Условия закрытия

Нужен один проверяемый authoring contract, а не ещё один prose checklist:

1. canonical manifest/scaffold или эквивалентный typed API для standalone, existing-series item, new flat series и book series;
2. route-less `draft:true`/`noindex:true` остаётся разрешён; publishable MDX по-прежнему обязан пройти существующий provenance→route/profile/ownership contract;
3. каждый navigable non-chapter series item разрешается в `pages[id]`, существующий route и article identity; chapters остаются разрешённым non-page типом;
4. TS config и `data/series.json` имеют одного producer либо строгую двустороннюю equality projection;
5. все config modules импортируются через discoverable manifest; accidental duplicate `seriesId` запрещён, а approved base→public override объявляется отдельным typed operation;
6. generated registries имеют один документированный transaction/dry-run command; editorial metadata review остаётся fail-closed и scaffold не выдаёт automatic approval;
7. существующие schema errors и строгий content provenance сохраняются; family wrappers не создают конкурирующий типовой contract;
8. strict rendered fragment audit входит в documented gate, а cross-document series href проверяется на существующий route;
9. guide описывает current shapes/owners, пять Nagornaya exceptions и минимальные happy paths без copy-by-memory;
10. отрицательные fixtures обязаны убивать Pastor-style config-only item, missing route/profile/ownership, accidental duplicate ID, stale series projection и broken `partToc` target, одновременно пропуская explicit draft и typed Baptist composition;
11. resulting-main dry runs создают standalone, existing-series item, новую flat series и book series, получают адресные ошибки и после удаления не оставляют artifacts.

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

## 14. Self-correction — draft staging versus publishable orphan

Первичный orphan fixture содержал `draft:true`/`noindex:true`; использовать его как самостоятельное доказательство missing-publication defect было слишком широко. Git history подтверждает, что route-less drafts — намеренный workflow:

- `870b28dd` добавил семь Teen MDX отдельным content-only commit;
- frontmatter прямо говорил «отдельный публичный маршрут/серия ещё не собраны», `contentStatus:draft`, `draft:true`, `noindex:true`;
- prepublication series config появился позже в `a6eeda4`, затем publication metadata/route surfaces — в следующих шагах.

Поэтому draft fixture теперь считается положительным staged-authoring control, а не failure.

Admission root повторно проверен publishable fixture без `draft`/`noindex` полей (schema defaults `false`). Он дал тот же зелёный результат: Astro build 0, 104 pages, probe route отсутствует; content coverage 0 и не обнаруживает entry. Именно этот superseding witness поддерживает строку.

Closure должна разрешать route-less `draft:true`/`noindex:true` материалы и падать только когда entry заявлен publishable, но не разрешается в route/owner. Арифметика не меняется; correction сужает формулировку без снятия root.

## 15. Self-correction — strict MDX gate and decisive Pastor witness

Дальнейшая проверка нашла ещё одну важную границу первичного отчёта.

### 15.1 Publishable orphan MDX всё же ловится полным source gate

Publishable orphan проходит Astro build и `content:coverage:audit`, но `migration:metadata:check:strict` корректно выходит 1:

`unowned non-draft MDX; add profile mdxPath/mdxStatus or mark it draft explicitly`

Этот validator входит в `validate:static-publication`. Поэтому publishable MDX не является доказательством, что **полный** canonical source admission пропустит публикацию. Он остаётся доказательством поздней staged диагностики и того, что рекомендованные локальные checks неполны. Формулировка root не должна отрицать существующий строгий provenance guard.

### 15.2 Pastor config-only item проходит полный gate

В отличие от MDX, Pastor config mutation прошла именно полный static publication gate после успешной production-like сборки и оставила 30 реальных cross-document links на отсутствующий route. Ни profile/ownership registry, ни audit-pro, ни dist publication, ни strict fragment checker не сопоставляют navigable series items с route existence.

Это superseding decisive witness для system row. Teen mutation отдельно сужена: её full build останавливает family-specific media lookup, поэтому она показывает неодинаковую безопасность families, а не release fail-open сама по себе.

Итоговая admission остаётся одна и точнее: content provenance имеет хороший fail-closed owner, а **универсальный series item → page/route/data contract отсутствует**. Arithmetic не меняется.

## 16. Продолжение — positive book-shaped creation dry run

Чтобы не оценивать book universality только по существующим Heart/Baptist implementations, создана временная новая `shape:'book'` series с нуля:

- одна Roman chapter (`tier:'chapter'`);
- одна Arabic article с `parent`;
- полноценный `pages[id]`;
- curated `partToc` с существующим H2 target;
- новый route, импортирующий только `SeriesReaderChrome` и новый config.

Ни одного нового engine/chrome component не потребовалось. Результат:

- Astro build exit 0;
- 105 pages вместо baseline 104;
- probe route создан;
- facade consumer count 45→46;
- strict fragment audit exit 0: 65 series pages, 1 097 unique targets;
- built HTML содержит series root, chapter/article identities и точный TOC target.

Это прямой positive proof: **book действительно является shape общей series engine**, а не скрытым четвёртым renderer. Runtime score 4/5 подтверждён realistic creation, не только чтением типов.

Probe намеренно не объявлялся production publication: у него нет profile/ownership/полного SEO head, и canonical admission должен остановить его. То есть rendering universality не решает authoring transaction автоматически.

### PageHead boundary

Отдельный census 64 `*PageHead.astro` показывает 12 198 строк route/family-owned head source:

- 64/64 подключают общий `ReaderPreferencesHead` — хороший уже завершённый shared primitive;
- 64/64 самостоятельно печатают `<title>`;
- 62/64 самостоятельно несут JSON-LD;
- 0/64 используют central `Seo.astro` abstraction.

Это не новая строка и не требование слить все metadata в один шаблон: route-specific JSON-LD может быть оправдан. Для нового агента это означает, что universal reader facade не даёт universal document/head authoring API. Hardcoded asset projection уже принадлежит отдельному `SYS-HEAD-ASSET-PROJECTION-PROLIFERATION` и здесь повторно не считается.

## 17. Продолжение — realistic standalone publication transaction

Проверен не только orphan, но и минимальный правильный standalone path через generic `ArticleLayout`. Временная publishable статья получила четыре authored owners:

1. MDX content;
2. explicit Astro route (`getCollection` + `ArticleLayout`);
3. `migration/page-ownership.json` entry;
4. `data/route-profiles/*.json` profile, основанный на Lawson article contract.

После этих четырёх согласованных изменений адресные structural gates прошли:

- page ownership;
- route profiles strict;
- public surface registry;
- full migration metadata/provenance chain.

Следующая стадия остановилась правильно: `editorial-metadata-registry.js --check` сообщил единственную понятную причину — `metadata record missing` для нового route.

`editorial-metadata-registry.js --write --build` затем успешно:

- построил 109 final pages;
- создал 73-й registry record;
- оставил approved/projected corpus на 72 routes, то есть новая публикация не получила молчаливое approval;
- после записи `--check` прошёл.

Это хороший fail-closed editorial review boundary. Он не должен быть заменён scaffold-ом, который автоматически одобряет дату/публикацию.

Но для first-time agent transaction остаётся неочевидным:

- generic path существует фактически только как Lawson precedent;
- current agent router не называет четыре обязательных authored owners;
- standalone guide отсутствует;
- metadata write затронул центральный registry и пять существующих supplement files, поэтому агенту нужно отличить детерминированный projection fan-out от ручной editorial правки;
- нет dry-run command, который заранее перечисляет весь transaction plan.

Следовательно, standalone runtime/layout path лучше, чем первоначально казалось: после выбора правильного precedent ошибки точные и review fail-closed. Низкая оценка authoring относится к discoverability/transaction orchestration, а не к отсутствию всех защит. Product fixtures и generated changes полностью удалены.

## 18. Продолжение — series registry collision semantics

Проверен ещё один риск для нового автора: уникальность `seriesId` на уровне mutable `SERIES_CONFIGS`.

Два временных, полностью валидных `*SeriesConfig.ts` объявили один `seriesId:'arena-collision'`, каждый прошёл `defineSeriesConfig` и записал себя через текущий family pattern:

`SERIES_CONFIGS[config.seriesId] = config`

Оба модуля были импортированы одним route в порядке A→B. Результат:

- Astro build exit 0;
- `engine:contracts` exit 0 и сообщил «all declared through defineSeriesConfig»;
- collision diagnostic отсутствует;
- `seriesConfig('arena-collision')` молча вернул B;
- built H1 = «Вторая серия», первая конфигурация полностью перезаписана.

Current source уже имеет один намеренный collision: `russian-baptism` сначала регистрируется flat config, затем public book composition явно заменяет его. Это допустимая композиция, но она означает, что простой глобальный запрет duplicate ID сломает approved design.

Правильный будущий contract должен различать:

- уникальную первичную регистрацию;
- явно объявленную base→public composition/override;
- случайный duplicate нового автора.

Сейчас assignment не кодирует эту разницу, а итог зависит от import order. При этом `seriesConfig(seriesId)` не имеет production consumers: реальные wrappers импортируют config constants напрямую. Registry поэтому одновременно предписан guide и не является фактическим runtime SSOT.

Это не отдельный reader-facing defect на текущих маршрутах: approved Baptist override работает, а synthetic collision существовал только в probe. Результат усиливает discovery/manifest часть `SYS-CONTENT-AUTHORING-PUBLICATION-CONTRACT`; arithmetic не меняется.

## 19. Продолжение — positive flat-series creation dry run

Последний недостающий happy path — новая flat series с нуля — также проверен executable fixture:

- новый `defineSeriesConfig` с одной Roman part и полноценным `pages[id]`;
- новый route через неизменённый `SeriesReaderChrome`;
- существующий H2 для curated `partToc`.

Результат совпадает с book probe: Astro build exit 0, 105 pages, facade consumers 46, strict fragment audit exit 0 на 65 series pages /1 097 unique targets; built root, part identity и target присутствуют. Новых engine components не потребовалось.

Тем самым positive runtime matrix закрыта для обеих заявленных shapes: flat и book действительно универсальны на уровне reader rendering. Различие остаётся только в topology config, как и обещано архитектурой. Production admission для probe не заявляется; ownership/profile/data/editorial transaction по-прежнему отдельный слой.

## 20. Продолжение — asymmetric TS config ↔ `data/series.json` guard

Проверено обратное направление Pastor drift. В `data/series.json` временно добавлена published part, отсутствующая в TS config и на диске.

- `audit-pro` вышел 1;
- ошибка адресная: `pastor-series part 99 "arena-data-only-probe": no index.html on disk`;
- `data:consistency` отдельно вышел 0, но обязательный audit-pro не позволил data-only published route пройти.

Вместе с предыдущим Pastor witness получена точная асимметрия:

| Направление drift | Результат полного relevant gate |
|---|---|
| `data/series.json` → отсутствующий route | FAIL (`audit-pro`) |
| TS `SeriesConfig.items` → отсутствующие page/route/data | PASS, 30 dangling links |

Следовательно, проблема не в полном отсутствии series protection. Data-first projection защищена; config-first projection — нет. Closure должна добавить обратную проверку, не ослабляя существующий `audit-pro` guard и не назначая `data/series.json` вторым ручным SSOT.

Fixture удалён, Product source чист; новой строки и изменения arithmetic нет.

## 21. Продолжение — series landing/hub boundary

Связанные landing routes проверены отдельно от reading chrome. Registry содержит шесть `surface=series`, `routeRole=landing`:

- book: `/baptisty-rossii/`, `/hard-texts/`;
- flat: `/hard-texts/genesis-6/`, `/nagornaya/`, `/nagornaya/seriya/`, `/podrostok-za-kadrom/`.

Все используют adapter label `series-landing`, но общего `SeriesLanding` renderer нет. Только Baptists имеет явно названный `BaptistyRossiiBookLanding`; Hard Texts, Genesis 6, Nagornaya и Teen сохраняют family/route implementations. Лишь Baptists, Hard Texts и Teen landings имеют resolved shared-series config imports; три остальных являются explicit native compositions.

`/pastor-series/` вообще классифицирован как `surface=page`, `routeType=pastor-index`, а не series landing. Его текущая membership/projection drift уже принадлежит отдельному `SYS-SERIES-DISCOVERY-CURRENT-AUTHORITY` и здесь не считается повторно.

Вывод для нового автора:

- shared engine автоматически решает article reading chrome;
- он **не создаёт hub/landing** и не определяет, нужен ли отдельный hub, catalog shelf или parent section;
- новая серия требует явного landing/discovery решения и profile classification;
- копировать любой существующий hub как «универсальный» template нельзя.

Это не требование унифицировать все landings визуально. Нужен decision/scaffold contract, который заставляет выбрать declared landing strategy и подключает membership projection. Результат уточняет authoring root и сохраняет дедупликацию с существующей Pastor discovery lane.
