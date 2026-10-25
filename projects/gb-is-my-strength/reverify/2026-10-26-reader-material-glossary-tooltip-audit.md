# GBS — аудит читательского материала, глоссария и тултипов

Дата: 2026-10-26  
Product anchor: `80440f9ce4bdfca92769330ea79109625c868725`  
Disposition: **4 новых direct defects + 1 improvement + 2 system lanes; 3 действующих ряда расширены**
Evidence: `evidence/2026-10-26-reader-material-glossary-tooltip-audit.jsonl`

## 1. Итог

Проверены не только структурные контракты, но и фактический читательский текст: 95 собранных article/content routes, весь словарь из 130 терминов и 370 aliases, 380 ручных tooltip markers, retained HTML, MDX/Astro owners и production-like `dist`. Проведён реальный Chromium-проход по desktop/mobile с нативным кликом и клавиатурой, Axe, LCP/CLS, console и broken-image контролями.

Главные результаты:

1. действующий `GBS-BAPTISTS-VISIBLE-COPY-QUESTION-MARK-LOSS` подтверждён на текущем anchor: **9 опубликованных маршрутов**, 1 385 серий `???` и 10 507 вопросительных знаков в их финальном HTML; defect не новый и не считается повторно;
2. в пяти материалах «Баптистов России» читателю показываются внутренние Research/engineering данные: commit SHA, `main`, `authority`, `claim-level`, A1/A2/A3/B1/C/D, state axes, внутренние `.md`-имена и backlog — новый `GBS-BAPTISTS-RESEARCH-SCAFFOLD-READER-LEAK`;
3. опубликованная статья о христоцентричной герменевтике содержит системный пласт машинных кальк и одну смешанную кирилло-латинскую опечатку `academическую` в quiz payload — новый `GBS-HERMENEUTIKA-TRANSLATION-AND-COPY-QUALITY`;
4. `/articles/sem-tipov-razlichenie-uchiteley/` показывает читателю literal `**` из-за незакрытой Markdown-разметки — новый `GBS-SEM-TIPOV-LITERAL-MARKDOWN-PREFIX`;
5. `typograf:dry` на зелёном exit 0 сообщает шесть требующих перезаписи retained HTML, поэтому принимается `SYS-MATERIAL-TYPOGRAPHY-GATE-FAILOPEN`;
6. словарь структурно исправен и в целом полезен, но шесть пар одного понятия заведены как разные canonical identities; это дробит английское/русское употребление и definitions — improvement `GBS-GLOSSARY-CONCEPT-IDENTITY-CONSOLIDATION`;
7. targeted control `/baptisty-rossii/goneniya-i-sovest/` подтверждает штатную mouse/touch/keyboard geometry, но продолжение 95-route sweep нашло важное исключение: на desktop `/baptisty-rossii/` legacy `SiteUtils.makeTooltipController` и `article-tooltips.js` v20 одновременно владеют одним `.gterm`; hover оставляет popup с `top:auto!important` вне viewport. Принимается `SYS-TOOLTIP-INTERACTION-OWNER-EXCLUSIVITY`. Независимый Axe `region` на body-reparented popup по-прежнему расширяет `GBS-OUTLINE-ORDER-AND-LANDMARK-CONTAINMENT`;
8. определение Второго Лондонского исповедания 1677/1689 ошибочно называет его «переработкой Лондонского исповедания 1644 года». Этот brief реально открывается на 11 routes; принимается `GBS-GLOSSARY-1689-CONFESSION-LINEAGE-MISSTATEMENT`. Отдельно Learning Sheet показывает raw canonical forms `Кархемише` и `козьего двора` как названия карточек; это расширяет уже принятую glossary identity/display improvement.

Арифметика после аудита и продолжения: **57 = 31 direct defects + 5 improvements + 21 system lanes**.

## 2. Объём и чистая база

Точный Product anchor: `80440f9ce4bdfca92769330ea79109625c868725`.

До содержательной классификации прошли:

- `editorial-lint --sources`;
- `readable-audit`;
- `article:qa` — 174 article files, 0 errors/warnings;
- `mdx:structure:audit` — 64 files, 0 errors/warnings;
- `content:guard`, `sources:hygiene`;
- glossary contract/trust-boundary/reference inventory;
- tooltip icon/style/trigger contracts.

Production-like `strangler:build:production-like` завершился успешно: 104 Astro pages, затем legacy copy/projections. Сборка дала только существующие Astro hints и Shiki fallback для языка `greek`; ошибок типов и сборки не было.

Эти зелёные проверки важны как отрицательный контроль: найденные ниже дефекты находятся вне их текущей семантической области.

## 3. Действующий defect: потеря текста в Baptist evidence cards

Это **не новый ряд**. Текущий source census на anchor:

| Source owner | Runs `???` | ASCII `?` |
|---|---:|---:|
| `DvaSezda1884Body` | 60 | 438 |
| `GoneniyaISovestBody` | 115 | 884 |
| `IniciativnayaGruppaBody` | 186 | 1 408 |
| `NochNaKureBody` | 76 | 583 |
| `PeterburgskayaLiniyaBody` | 135 | 1 037 |
| `PodpolnayaPechatBody` | 270 | 2 108 |
| `SpravochnikBody` | 323 | 2 402 |
| `Vsehib1944Body` | 55 | 435 |
| `YuzhnayaShtundaBody` | 88 | 653 |
| **Всего** | **1 308** | **9 948** |

Финальный production-like HTML увеличивает видимое число из-за разметки компонентов:

- 9 маршрутов;
- **1 385 runs**;
- **10 507 ASCII question marks**;
- `/baptisty-rossii/sovetskaya-noch/` и hub не затронуты.

Например, на `/baptisty-rossii/spravochnik/` читатель видит заголовки, абзацы, labels и `aria-label`, состоящие из `???`. Git blame сохраняет установленную прежним аудитом причину: строки вошли уже повреждёнными в `059b3024`.

Disposition: расширить current-anchor receipt в `GBS-BAPTISTS-VISIBLE-COPY-QUESTION-MARK-LOSS`; **не прибавлять второй defect**.

## 4. Новый defect: Research scaffolding опубликован как читательский текст

### 4.1 Четыре статьи с raw operational provenance

В компонентах:

- `BaptistyRossiiDvaSezda1884Body.astro`;
- `BaptistyRossiiGoneniyaISovestBody.astro`;
- `BaptistyRossiiNochNaKureBody.astro`;
- `BaptistyRossiiYuzhnayaShtundaBody.astro`

опубликован одинаковый reader-visible пункт:

> Research `main` — движущийся authority-контур для claim-level verification; проверенный snapshot ... `94f05457...`; A1/A2/A3/B1/C/D; access/locator/rights/publication states...

Это не название источника и не полезная читателю методологическая оговорка. Здесь наружу вышли branch name, hash, internal evidence classes и operational state axes.

### 4.2 «Справочник» публикует внутренний file/backlog inventory

`/baptisty-rossii/spravochnik/` показывает:

- `00-master-source-index-glossary-map.md`;
- numbered file ranges `01–40`;
- `source trail`, `web/source ledger`, `pre-1867`;
- внутренний план обновления 3D-карты;
- список «что ещё не закрыто» и «что копать дальше»;
- raw path `/baptisty-rossii/research/...`.

Прозрачное сообщение о границах источников допустимо и полезно. Дефект — именно подмена читательской библиографии внутренним устройством рабочих репозиториев, веток, файлов, классов и очередей.

### 4.3 Closure boundary

В reader-facing copy оставить нормальные библиографические данные и ясные ограничения уверенности. Branch/SHA/provenance IDs, internal classes/state axes, filenames и backlog должны жить в audit/research metadata. Нужен source+dist guard на operational lexicon с allowlist для настоящих научных терминов и source titles; broad English ban недопустим.

## 5. Новый defect: качество перевода и опечатка в Hermenevtika

Финальный маршрут сохраняет не единичную сложную богословскую лексику, а повторяющиеся кальки:

- «текст обсуждает Христа»;
- «Бог предназначил событиям ... действовать типологически»;
- «чтобы изначально утверждать, что Писание работает типологически»;
- «спроектировал все вещи ... чтобы обсуждать Христа»;
- «импликации ... не плотно соответствуют»;
- «двойное авторство оперирует в Писании»;
- «Павел контекстуально говорил»;
- «делают дополнительные оговорки на формулу»;
- «импликации ветхозаветных концептов»;
- «рекапитулируются в конечном Давиде»;
- «имеет последствия для лучшего понимания»;
- «кульминационный герой небом и землей»;
- «произвести истощенную Христологию».

Это не претензия к словам «герменевтика», «типология», «экзегеза» или к академическим English citations. Они законны в предметном тексте. Проблема — русская синтаксика и сочетаемость, системно калькированные с английского.

Отдельный точный typo в shipped quiz data:

`Значение и значимость — синонимы; различие между ними носит чисто academическую условность`.

Он находится в `HermenevtikaPageHead.astro` и финальном HTML. `article:qa` сообщает ноль mixed-script warnings, потому что этот payload не входит в фактически проверяемую область.

Closure: ручная редактура всей статьи по абзацам с сохранением богословского тезиса и ссылок; отдельный render test quiz strings; mixed-script source/dist guard должен видеть JS/JSON payload, а не только основной article body.

## 6. Новый defect: literal Markdown на опубликованной странице

В `src/content/articles/sem-tipov-razlichenie-uchiteley.mdx` строка:

```md
***Серия «Здоровье церкви» · Семь типов учителей и лидеров*
```

закрыта одной `*`, а не тремя. Финальный HTML:

```html
<p>**<em>Серия «Здоровье церкви» · Семь типов учителей и лидеров</em></p>
```

Browser `innerText` показывает `**Серия...`. Existing MDX structure/editorial checks это пропускают.

Closure: исправить markup и добавить negative fixture на literal Markdown delimiters в rendered prose, не запрещая символы `*` в code/pre и научных обозначениях.

## 7. Typography: шесть current deltas и fail-open gate

`npm run typograf:dry` выходит **0**, но сообщает изменения в шести retained HTML:

1. `articles/20-antisovetov-pastoru/index.html`;
2. `articles/dzhon-gill-chast-2-uchenyi/index.html`;
3. `articles/dzhon-gill-chast-3-nasledie/index.html`;
4. `articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/index.html`;
5. `articles/kod-da-vinchi/index.html`;
6. `articles/krajne-li-isporcheno-serdce/index.html`.

Disposable write/diff подтвердил реальные reader-facing преобразования:

- `...` → `…`;
- straight `"..."` → русские кавычки;
- аналогичная нормализация внутри tooltip citations и основного текста.

Product checkout после пробы возвращён clean; никакой repair не коммитился.

System root: dry/check режим обязан завершаться non-zero при drift либо иметь отдельный strict check, который делает это. Нужен negative fixture и source→dist parity, чтобы зелёный exit нельзя было принять за отсутствие типографических дефектов.

## 8. Полный словарь: качество, покрытие и identity

### 8.1 Что прошло

`data/glossary.json` содержит:

- 130 canonical terms;
- 370 aliases;
- 0 пустых brief/detail;
- 0 нормализованных alias collisions;
- definitions median 121 символ, max 184;
- details median 633.5, max 1002.

Runtime использует `textContent` для brief, безопасный ограниченный `<em>` parser для detail и Unicode-aware boundaries. Browser corpus получил 462 `.gterm` instances на 95 content routes. Auto hydration cadence ограничивает повторения. В definitions/details не найдено raw URLs, Markdown backticks или internal filenames. Иностранные канонические термины (`sensus plenior`, `ordo salutis`, `Heilsgeschichte` и др.) получают русское объяснение; сами по себе они не defects.

### 8.2 Identity fragmentation

Шесть очевидных пар одного понятия имеют разные canonical records и непересекающиеся aliases:

| English/variant identity | Russian/parallel identity |
|---|---|
| `regula fidei` | `правило веры` |
| `pactum salutis` | `завет искупления` |
| `antinomianism` | `антиномианизм` |
| `well-meant offer` | `искреннее предложение` |
| `free offer` | `свободное предложение` |
| `особые баптисты` | `партикулярные баптисты` |

Последняя пара особенно показательна: English aliases `Particular Baptists` отданы записи «особые баптисты», а русская транслитерация — другой записи. Один concept получает разные details/category identity в зависимости от языка поверхности.

Это не collision по текущему контракту — именно потому, что контракт проверяет уникальность строки alias, а не тождество понятия. Improvement не требует механически объединить все синонимы: нужно ввести concept ID / declared synonym relation, выбрать canonical display name и сохранить redirects/provenance для старых keys.

Продолжение обнаружило второй аспект того же display-owner пробела. `GillLearningSheet` строит заголовок term card из raw `data-term`, а не из отдельной нормальной lemma/display label. Поэтому на `/articles/krajne-li-isporcheno-serdce/` мобильный reader sheet показывает карточку **«Кархемише»**, а на Gill Context — **«козьего двора»**; в словаре уже есть нормальные aliases `Кархемиш` и `козий двор`. Это не новый direct count: closure identity improvement уже требует одного display owner. Теперь она должна также запрещать падежную форму как canonical card heading и отделять match aliases от reader-facing lemma.

### 8.3 Specialist coverage boundary

Ручная проверка отклонила broad regex-выводы по словам «контекст», «паттерн», «нарратив», «маркер» и английским названиям книг: в богословском/историческом контексте они часто законны. Не каждое специальное слово требует tooltip; пояснение должно появляться при первом действительно непрозрачном употреблении, а не превращать текст в сплошную разметку.

Отдельный краткий glossary внутри Baptist Spravochnik не заменяет global dictionary. Его reader-facing определения в основном ясны, но сейчас соседствуют с внутренним research backlog и повреждёнными evidence cards.

### 8.4 Продолжение coverage triage

Naive normalized alias-vs-rendered-trigger comparison дал **166 unmarked route-term pairs на 58 routes / 55 canonical terms**, но это только candidate set. Ручная проверка наиболее рискованных specialist cases не превратила число 166 в дефект: в Gill III `free or well-meant offer` непосредственно предварён русским определением «всеобщее благожелательное предложение спасения»; в Gill II `pactum salutis` следует в том же абзаце за размеченным «вечным советом искупления» с полным tooltip; Gill Spravochnik сам содержит последующий читательский словарь с отдельной карточкой `Free or Well-Meant Offer`. Остальные broad hits включают исключённые runtime-контексты (таблицы, headings, references), формы склонения и широкие слова вроде «свидетельство». Поэтому массовое auto-mark требование отклонено; нужен контекстный route-by-route admission, а не арифметика regex.

## 9. Tooltip browser verification

Проверен `/baptisty-rossii/goneniya-i-sovest/` в Chromium 143:

- desktop: 1440×1000, dark, reduced motion;
- mobile: 390×844, `isMobile:true`, dark, reduced motion;
- native click по glossary trigger;
- keyboard focus → Enter → Escape;
- Axe;
- screenshot;
- LCP/CLS observer;
- console/request failures;
- broken images.

### 9.1 Положительные результаты targeted control

Следующая таблица относится именно к `/baptisty-rossii/goneniya-i-sovest/`; продолжение §14 запрещает экстраполировать её desktop mouse-результат на hub `/baptisty-rossii/`.

| Проверка | Desktop | Mobile |
|---|---:|---:|
| Tooltip открыт и видим | да | да |
| Viewport overflow | нет | нет |
| Geometry | 380×157.55 | 390×135.55 bottom sheet |
| Keyboard Enter opens | да | да |
| Escape closes/restores opener | да | да |
| Broken images | 0 | 0 |
| Console errors | 0 | 0 |
| Failed requests | 0 | 0 |
| LCP, local production-like | 444 ms | 260 ms |
| CLS | 0.00347 | 0 |

Screenshot witnesses: `/tmp/gbs-tooltip-desktop.png`, `/tmp/gbs-tooltip-mobile.png` (не коммитятся).

### 9.2 Axe landmark defect

В обоих profiles Axe даёт один `region` violation. Exact target — открытый `#gb-tip-1.gtip.gb-floating-tip.is-open[role=tooltip]`. Runtime переносит popup в `body`, вне landmarks.

Keyboard interaction при этом работает: Enter устанавливает `aria-expanded=true`, Escape закрывает popup и возвращает `aria-expanded=false` на том же `SPAN` opener.

Disposition: расширить `GBS-OUTLINE-ORDER-AND-LANDMARK-CONTAINMENT`, где уже требуется ноль Axe `region` на shared injected surfaces. Не создавать отдельный tooltip-landmark ряд.

## 10. Почему текущие gates это пропустили

- `article:qa` проверяет empty tooltips и ограниченный mixed-script corpus, но не quiz payload и не rendered prose;
- `mdx:structure:audit` не ищет literal Markdown delimiters после compile;
- `sources:hygiene` не считает reader-visible research jargon leakage;
- glossary contract гарантирует shape/alias uniqueness, но не concept identity;
- `typograf:dry` печатает drift и возвращает success;
- текущие Baptist visual/content guards не запрещают long `???` runs;
- tooltip behavior tests проверяют isolated native owner, но не запрещают одновременную регистрацию legacy `SiteUtils.makeTooltipController` и `article-tooltips.js`; поэтому они пропускают hub-specific desktop hover conflict и landmark containment открытого reparented popup.

## 11. Матрица и приоритет

### P0

- действующий `GBS-BAPTISTS-VISIBLE-COPY-QUESTION-MARK-LOSS`: восстановить owner-approved Russian copy на 9 routes; не угадывать текст автоматически.

### P1

- `GBS-BAPTISTS-RESEARCH-SCAFFOLD-READER-LEAK`;
- `GBS-HERMENEUTIKA-TRANSLATION-AND-COPY-QUALITY`;
- `GBS-GLOSSARY-1689-CONFESSION-LINEAGE-MISSTATEMENT`;
- `SYS-TOOLTIP-INTERACTION-OWNER-EXCLUSIVITY`;
- расширение `GBS-OUTLINE-ORDER-AND-LANDMARK-CONTAINMENT` на открытый glossary popup.

### P2

- `GBS-SEM-TIPOV-LITERAL-MARKDOWN-PREFIX`;
- `SYS-MATERIAL-TYPOGRAPHY-GATE-FAILOPEN`;
- `GBS-GLOSSARY-CONCEPT-IDENTITY-CONSOLIDATION`.

## 12. Принятые и отклонённые выводы

Принято:

- реальные `???` в финальном DOM;
- raw Research operations в reader-facing copy;
- конкретные русские кальки и mixed-script typo;
- literal `**` в browser text;
- шесть exact typograf deltas;
- шесть semantic duplicate pairs и две падежные raw canonical headings в Learning Sheet;
- неверная генеалогия Второго Лондонского исповедания в glossary brief на 11 routes;
- dual-owner desktop hover geometry failure на `/baptisty-rossii/`;
- Axe landmark failure на открытом popup.

Отклонено как defect без дополнительного контекста:

- вся английская библиография в footnotes;
- все иностранные богословские термины;
- каждое употребление «контекст», «паттерн», «маркер», «нарратив»;
- transparent statements о границах исторической уверенности;
- browser console `ERR_CONNECTION_CLOSED` из быстрого многостраничного sweep: targeted settled run имеет 0 errors/failed requests;
- один moderate npm advisory — вне редакционного scope и уже имеет отдельный dependency owner.

## 13. Closure proof

После Product repair требуется resulting-main proof:

1. production-like build;
2. source+dist census `???` = 0 на девяти routes при сохранённых законных `?`;
3. operational jargon/file/hash guard + browser text on five affected Baptist routes;
4. full Hermenevtika prose review and quiz render, mixed-script guard;
5. compiled prose has no accidental literal Markdown delimiters;
6. strict typograf check exits non-zero on a negative fixture and cleanly on repaired corpus;
7. glossary concept IDs/synonym redirects preserve all old aliases with one definition owner and nominative reader-facing display lemma per declared concept; the 1689 brief states the owner-verified 1677/1689 lineage rather than deriving it from the 1644 confession;
8. tooltip click/touch/Enter/Escape geometry at desktop/mobile Light/Dark/reduced motion, включая hub `/baptisty-rossii/` и mouse hover;
9. ровно один interaction owner на каждый `.gterm/.fn-marker/.bref`, negative fixture на попытку dual registration и отсутствие legacy переписывания inline priority/geometry;
10. Axe `region` = 0 for opened glossary popup and existing injected-surface matrix;
11. screenshots, console 0, broken images 0, LCP/CLS controls.

## 14. Продолжение: desktop glossary popup уходит за viewport на Baptist hub

После targeted positive control выполнен production-like Chromium census первого видимого glossary trigger на всех маршрутах, где такой trigger существует: **72 routes × desktop/mobile = 144 профиля**. Использованы trusted Playwright hover на desktop и tap на mobile; force/programmatic activation не применялись. В 143 профилях popup остался внутри viewport. Единственное отклонение воспроизводится на `/baptisty-rossii/` для термина `штундизм`.

На desktop 1280×900 native hover устанавливает trigger `aria-expanded=true`, но сам `.gtip.gb-floating-tip.is-open` имеет viewport rect **[304, 6152.77, 380, 180.83]** и полностью невидим. У trigger rect [644.09, 437.98, 67, 26], то есть это не offscreen anchor. Inline runtime сначала записывает разумные `left/top`, однако legacy owner затем снимает priority: итоговый inline `top` имеет пустой priority, а общий `.gb-floating-tip { inset:auto!important }` побеждает его. CSS auto-position возвращает popup к его статическому месту на длинной странице.

Причина подтверждена source/runtime composition:

- `BaptistyRossiiBookLanding.astro` загружает legacy `js/site.js`;
- `site.js` без owner arbitration регистрирует `SiteUtils.makeTooltipController('.gterm', '.gtip', …)` и пишет `style.left/style.top` обычными assignments;
- общий `ReaderActionsRuntime` независимо регистрирует `article-tooltips.js` v20 на том же `.gterm`, переносит тот же popup в `body` и требует authoritative inline `!important` geometry;
- mouse `pointerenter/pointerover` проходят через оба owners; legacy позиционер последним снимает priority. Keyboard focus control остаётся видимым: rect [488, 620, 380, 263.53], `top/left` priority `important`. Mobile tap control также остаётся внутри 390×844 как bottom sheet. Следовательно, это modality/owner collision, а не плохое определение или общий viewport failure.

Это уточняет, а не отменяет §9: `/baptisty-rossii/goneniya-i-sovest/` остаётся корректным positive control, но прежняя формулировка о глобально здоровой mouse geometry была слишком широкой. Принимается одна system lane `SYS-TOOLTIP-INTERACTION-OWNER-EXCLUSIVITY`, а не отдельный route defect: устранить нужно параллельное владение shared trigger family. Closure требует single-owner census, native hover/click/focus/tap на hub и representative generated/manual/keyless glossary, footnote/reference controls, desktop/mobile Light/Dark/reduced motion, viewport containment и отсутствие regression в focus/Escape/overlay contracts.

## 15. Продолжение: factual accuracy и reader-facing lemma всего словаря

Проведён отдельный review всех 130 records: definition, detail, aliases, canonical key, category и фактическая browser-проекция. В payload нет raw URL, backticks, internal filenames или неразрешённых HTML-тегов; единственный используемый detail tag — allowlisted `<em>` (110 открывающих/закрывающих tags). Иностранные термины получают русское объяснение. Формула «не просто …» повторяется в 24 details и создаёт заметно шаблонный голос, но сама по себе не делает определения непонятными или ложными, поэтому отдельный defect по стилю не принят.

### 15.1 Новый direct defect: неверная генеалогия исповедания

Canonical record `лондонское баптистское исповедание 1689 года` сообщает:

> «…переработка Лондонского исповедания 1644 года, наследовавшая структуру Уэстминстерского исповедания 1647 года».

Это смешивает конфессиональную преемственность с текстовой генеалогией. Второе Лондонское исповедание впервые опубликовано в 1677 году и принято в 1689-м; его текст близко основан на Вестминстерском исповедании 1646 года с баптистскими изменениями. Это подтверждает и собственный соседний glossary record `Вестминстерское исповедание`, и публичный preservation source `BaptistSymbolics/1689Confession` at `6d1e08ab75e5980e32559653c3bed7d3588c9611` (`README.md`, Background: first published 1677, adopted 1689, closely based on Westminster 1646). Первое Лондонское исповедание 1644/1646 — более ранний исповедный ориентир той же традиции, но называть текст 1677 года его «переработкой» неточно.

Ошибка не лежит только в JSON. Chromium на `/articles/cerkovnaya-disciplina-vlast-granicy-zashchita/` native focus открывает этот exact brief (`aria-expanded=true`), а rendered corpus содержит canonical trigger на **11 routes**. Принимается `GBS-GLOSSARY-1689-CONFESSION-LINEAGE-MISSTATEMENT`. Closure: owner-reviewed формулировка должна различать историческую преемственность 1644/1646 и непосредственную Westminster/Savoy textual basis 1677; browser check всех 11 current trigger routes подтверждает новый brief, а source fixture не позволяет снова назвать 1677 простой переработкой 1644.

### 15.2 Reader-facing raw lemma

На mobile 390×844 trusted tap по learning opener на Krajne создаёт 17 term cards, среди которых заголовок **«Кархемише»**. Это canonical key, выбранный по падежной поверхности «при Кархемише», хотя aliases уже содержат `Кархемиш`; definition говорит о битве, detail — о городе. Аналогично Gill Context использует canonical `козьего двора`, хотя alias `козий двор` уже существует. Tooltip в предложении может законно сохранять склонённую поверхность; дефект display model в том, что reader sheet повторяет raw match key как самостоятельный заголовок. Этот результат расширяет `GBS-GLOSSARY-CONCEPT-IDENTITY-CONSOLIDATION`, не создавая второй work unit.

### 15.3 Соседняя technical leakage не считается повторно

Browser corpus также подтверждает на `/journal/dossiers/g3/` reader-visible `Research snapshot`, `tier A2`, `REFERENCE`, `Raw archived payload SHA …` и `decoded HTML SHA …`. Это текущий контекст уже принятого `GBS-JOURNAL-READER-SOURCE-LOCATORS-MISSING`: внутренние IDs/authority/provenance показываются вместо разрешаемой читательской библиографии. Ряд расширен точным current-anchor свидетельством; новый defect не добавлен. На `/rodosloviye/` слова `relation-level` и `runtime` находятся в явно обозначенном интерфейсе исследовательского атласа и без отдельного доказательства читательского вреда не классифицированы как leakage.

### 15.4 Полный tooltip payload census

Отдельно извлечены все payload surfaces на 95 content routes: **884 total = 462 glossary + 184 footnote + 238 Bible reference**. Пустых payloads — 0; reader-visible `TODO/TBD/FIXME`, `undefined/null`, `payload/runtime/metadata/snapshot/backlog/frontmatter/claim-level`, SHA/file markers, backticks или literal Markdown — 0. Среди glossary и Bible payloads нет ни одного текста с Latin ratio >35%; 148 predominantly-Latin footnotes являются библиографическими citations, а не untranslated definitions. Все 184 footnotes содержат технические linear-reader boundary strings `⟦сноска: … ⟧`, но они лежат в `[hidden][aria-hidden=true][data-pagefind-ignore]` и не входят в painted/AT tooltip copy. Поэтому raw boundary leakage не заявляется.

Product mutation and merge remain outside this audit.
