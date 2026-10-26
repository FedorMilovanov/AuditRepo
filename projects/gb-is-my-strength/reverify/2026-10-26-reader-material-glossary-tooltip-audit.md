# GBS — аудит читательского материала, глоссария и тултипов

Дата: 2026-10-26  
Product anchor: `80440f9ce4bdfca92769330ea79109625c868725`  
Disposition: **13 новых direct defects + 3 improvements + 3 system lanes; 3 действующих ряда расширены**
Evidence: `evidence/2026-10-26-reader-material-glossary-tooltip-audit.jsonl`

## 1. Итог

Проверены не только структурные контракты, но и фактический читательский текст: 95 собранных article/content routes, весь словарь из 130 терминов и 370 aliases, 380 ручных tooltip markers, retained HTML, MDX/Astro owners и production-like `dist`. Проведён реальный Chromium-проход по desktop/mobile с нативным кликом и клавиатурой, Axe, LCP/CLS, console и broken-image контролями.

Главные результаты:

1. действующий `GBS-BAPTISTS-VISIBLE-COPY-QUESTION-MARK-LOSS` подтверждён на текущем anchor: **9 опубликованных маршрутов**, 1 385 серий `???` и 10 507 вопросительных знаков в их финальном HTML; defect не новый и не считается повторно;
2. в пяти материалах «Баптистов России» читателю показываются внутренние Research/engineering данные: commit SHA, `main`, `authority`, `claim-level`, A1/A2/A3/B1/C/D, state axes, внутренние `.md`-имена и backlog — новый `GBS-PUBLICATION-RESEARCH-SCAFFOLD-READER-LEAK`;
3. опубликованная статья о христоцентричной герменевтике содержит системный пласт машинных кальк и одну смешанную кирилло-латинскую опечатку `academическую` в quiz payload — новый `GBS-HERMENEUTIKA-TRANSLATION-AND-COPY-QUALITY`;
4. `/articles/sem-tipov-razlichenie-uchiteley/` показывает читателю literal `**` из-за незакрытой Markdown-разметки — новый `GBS-SEM-TIPOV-LITERAL-MARKDOWN-PREFIX`;
5. `typograf:dry` на зелёном exit 0 сообщает шесть требующих перезаписи retained HTML, поэтому принимается `SYS-MATERIAL-TYPOGRAPHY-GATE-FAILOPEN`;
6. словарь структурно исправен и в целом полезен, но шесть пар одного понятия заведены как разные canonical identities; это дробит английское/русское употребление и definitions — improvement `GBS-GLOSSARY-CONCEPT-IDENTITY-CONSOLIDATION`;
7. targeted control `/baptisty-rossii/goneniya-i-sovest/` подтверждает штатную mouse/touch/keyboard geometry, но продолжение 95-route sweep нашло важное исключение: на desktop `/baptisty-rossii/` legacy `SiteUtils.makeTooltipController` и `article-tooltips.js` v20 одновременно владеют одним `.gterm`; hover оставляет popup с `top:auto!important` вне viewport. Принимается `SYS-TOOLTIP-INTERACTION-OWNER-EXCLUSIVITY`. Независимый Axe `region` на body-reparented popup по-прежнему расширяет `GBS-OUTLINE-ORDER-AND-LANDMARK-CONTAINMENT`;
8. определение Второго Лондонского исповедания 1677/1689 ошибочно называет его «переработкой Лондонского исповедания 1644 года». Этот brief реально открывается на 11 routes; принимается `GBS-GLOSSARY-1689-CONFESSION-LINEAGE-MISSTATEMENT`. Отдельно Learning Sheet показывает raw canonical forms `Кархемише` и `козьего двора` как названия карточек; это расширяет уже принятую glossary identity/display improvement;
9. `/articles/diotrefy-nashego-vremeni/` публикует грамматически невозможное «Все двадцать один материала различаются» — новый `GBS-DIOTROPHES-NUMERAL-AGREEMENT`. На том же маршруте 21/21 evidence cards показывают только unlinked `Записи Research: DRI-01…`; это расширяет существующий reader-source-locators row, а не создаёт второй technical-leak count;
10. локальная font matrix не покрывает реально набираемые scripts/weights: у Playfair Display нет Latin faces, у Inter нет Latin и weight 700, у Source Sans 3 Latin есть только в weight 400. CDP показывает один заголовок/label, составленный из custom Cyrillic и platform fallback для цифр, Latin/Roman и punctuation; новый `GBS-CUSTOM-FONT-MATRIX-MIXED-FAMILY-RENDERING`;
11. `КОРОТКО` как настоящий `h2` системно набрано 9px/9.9px на 24 routes и 10px/13px ещё на 15 routes, одинаково на desktop/mobile. Это не WCAG-failure по одному размеру, но доказуемо слабая и несогласованная читательская иерархия; improvement `GBS-SUMMARY-MICROHEADING-READABILITY`;
12. shared series reader на точном desktop breakpoint 1024px включает fixed rail и независимый floating-control lane. На 55 routes вычитаются ещё 204px и reader shell падает 800→492.7px; семь Teen routes обходят вычитание локальным override, но тогда все пять fixed controls перекрывают прокручиваемый prose. Один capacity conflict охватывает 62 routes шести families; новый `GBS-SERIES-READER-COMPACT-DESKTOP-CAPACITY-CONFLICT`.

Арифметика после desktop-measure продолжения: **61 = 34 direct defects + 6 improvements + 21 system lanes**.

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

- `GBS-PUBLICATION-RESEARCH-SCAFFOLD-READER-LEAK`;
- `GBS-HERMENEUTIKA-TRANSLATION-AND-COPY-QUALITY`;
- `GBS-GLOSSARY-1689-CONFESSION-LINEAGE-MISSTATEMENT`;
- `GBS-DIOTROPHES-NUMERAL-AGREEMENT`;
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
- exact rendered «Все двадцать один материала» на Diotrophes;
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

## 16. Продолжение: Diotrophes copy и source projection

Rendered corpus и source-level numeral scan нашли на `/articles/diotrefy-nashego-vremeni/` точную reader-visible строку:

> «Все двадцать один материала различаются».

При составном числительном, оканчивающемся на «один», требуется singular nominative: «двадцать один материал». Chromium подтверждает строку в обычном article paragraph. Это не скрытый payload и не layout concatenation. Принимается `GBS-DIOTROPHES-NUMERAL-AGREEMENT`; closure — исправленный source и final browser text плюс узкая editorial regression fixture на согласование составного `… один` с существительным в этом owner family.

Тот же trusted browser pass проверил source projection 21 case cards: **21 `.source-ref`, 0 links**, каждый показывает только форму `Записи Research: DRI-01, DRI-04` и подобные internal IDs. Reader не может разрешить их без отдельного data registry. Это тот же уже принятый недостаток, что G3 service IDs вместо читательской библиографии, поэтому расширяется `GBS-JOURNAL-READER-SOURCE-LOCATORS-MISSING` (исторический ID ряда), а отдельный Diotrophes leakage defect не считается. Closure существующего ряда теперь обязана покрыть оба consumers: 33 G3 claims/6 source-class cards и 21 Diotrophes case cards, сохраняя границы доказательности и не публикуя restricted material.

## 17. Продолжение: неполная font matrix и смешанный рендеринг

Проведён CDP census фактически использованных platform fonts, а не только `getComputedStyle().fontFamily`: 95 content routes × desktop/mobile, 670 sampled visible/structural nodes (`h1`, первый article paragraph, `h2`, button). Отдельно разобраны `fonts/fonts.css`, manifest и cmap/name/OS/2 tables всех локальных WOFF2.

Локальный registry расходится с фактическими reader strings:

- `Playfair Display` имеет только Cyrillic 400/600/700 и 400 italic; Latin/digits/punctuation face отсутствует;
- `Inter` имеет только Cyrillic 300/400/500/600; Latin отсутствует, а route labels требуют `font-weight:700`;
- `Source Sans 3` имеет Cyrillic 400/500/600, но Latin только 400; series labels требуют 600;
- `Noto Serif Hebrew` объявляет 400 и 500, но оба файла byte-for-byte одинаковы (`b5535c…`), оба имеют `OS/2.usWeightClass=400`; homepage реально запрашивает 500 для `.h-sacred-line` и CDP использует custom Noto glyphs, то есть заявленный 500 не существует;
- Lora — положительный контроль: для реально используемых 400/600 есть Cyrillic и Latin faces.

Это не теоретическая возможность fallback или только странное internal family name. В sampled high-signal text уже есть минимум три опубликованные группы:

1. **9 Playfair h1 routes** с цифрами/Latin: три Baptist date headings и шесть Hard Texts headings;
2. **14 Inter labels** `font-weight:700` с Roman numerals/digits: восемь «Тёмная сторона кафедры» и шесть «Трудные тексты»;
3. **8 Source Sans 3 labels** `font-weight:600` с Roman/Latin/digits: семь Teen labels и series landing.

На `/hard-texts/enoh-prorochestvoval-iuda-14-15-4q204/` exact `h1` «Енох пророчествовал: Иуд. 14–15, 1 Енох 1:9 и 4Q204» в четырёх desktop/mobile Light/Dark profiles разбивается на **26 custom Playfair glyphs + 23–24 platform DejaVu Serif glyphs**. Посимвольный CDP probe относит кириллицу к `Playfair Display SemiBold`, а пробелы, punctuation, `14–15`, `1:9`, `4Q204` — к fallback serif. В общем production-like census тот же пробел виделся как Open Sans: конкретный fallback зависит от platform/font environment, что и есть отсутствие детерминированного art direction. Screenshot SHA-256 для representative light desktop: `528d0941903d779959f2701fc47434ffdf09f2791b78d8c8a62b4940e55ce1e`; mobile: `82252a347f9d177be5cc7fae3b8ab34e7bfb05545664e6f6bd6d43d3d4f420fd`.

Контроли четырёх representative profiles: Axe violations 0, broken images 0, page errors 0; LCP 192–412 ms, CLS 0.00074 desktop / 0.0150 mobile. Значит, finding не подменяет layout/accessibility failure: дефект — один visual token физически собирается из разных гарнитур/доступных weights. `document.fonts.check` или проверка наличия файла недостаточны: нужны glyph/script/weight coverage и CDP actual-font proof.

Принимается `GBS-CUSTOM-FONT-MATRIX-MIXED-FAMILY-RENDERING`. Closure должна либо дополнить каждый заявленный family полными реально используемыми subsets/weights, либо осознанно выбрать одну совместимую fallback family для всего token. Нужен executable matrix contract: извлечь custom `font-family`/weight/style и reader strings, проверить coverage по cmap + `unicode-range`, запретить неподдержанный requested weight, затем browser-prove actual fonts на mixed Cyrillic/Latin/numeral fixtures. Массовый переход всех серий на одну гарнитуру не требуется: локальная art direction сохраняется, но внутри одного token она должна быть полной и детерминированной.

## 18. Продолжение: микрозаголовки и граница «premium»

Census нашёл **130 sampled visible records ниже 12px** в двух профилях. Большая часть — намеренные uppercase kickers, поэтому сам порог не превращался в defect. Отдельно классифицирована повторяемая semantic-heading группа:

- 24 routes: `h2.summary-card__head` «КОРОТКО» — **9px**, `line-height:9.9px`, `letter-spacing:1.8px`;
- 15 routes: тот же semantic owner/role — **10px**, `line-height:13px`, `letter-spacing:2.8px`;
- значения не увеличиваются на mobile 390×844.

Representative `/articles/chto-bibliya-nazyvaet-serdcem/` прошёл desktop/mobile Light/Dark: exact box сохраняет 9px/9.9px, Axe violations 0, broken images 0; screenshot SHA-256 mobile light `47527f626a38c5519dfa897bb8bab18dc9c953c9601ad143662cd72b19b43327`. Два console сообщения на этой route — уже известные preview-origin manifest/CSP и sandbox network delivery, не доказательство данного finding. Скриншот показывает реальный painted `h2`, а не hidden metadata.

Размер текста сам по себе не объявляется WCAG-нарушением, и 11px series kickers с line-height 17.6px не считаются автоматически плохими. Но здесь ключевой разделитель summary фактически имеет 7–8px cap-height, line box меньше 10px и различается между series owners без semantic причины. Это измеримый пробел читательской иерархии и визуальной цельности, поэтому принимается не direct defect, а improvement `GBS-SUMMARY-MICROHEADING-READABILITY`.

Closure: один shared summary-heading token с owner-approved minimum size/line-height/tracking и допустимыми route-theme overrides; browser comparison всех 39 routes на 390/1280 в Light/Dark, без clipping/wrap/contrast regressions. Не надо универсализировать display fonts или цветовую art direction разных серий: универсален semantic readability floor, оформление остаётся локальным.

## 19. Продолжение: desktop reader превращается в узкую полосу

Жалоба на слишком узкую читательскую строку подтверждена, но не на всех desktop widths. При 1440px обычный series paragraph имеет 752px и около 60 non-space glyphs на строку — это нормальный положительный контроль. Поломка находится на compact-desktop breakpoint.

### 19.1 Точный скачок

Chromium sweep 95 routes на 1023/1024/1100/1280/1440px показывает:

| Viewport | Median sampled paragraph | Paragraphs <500px | Paragraphs <600px |
|---:|---:|---:|---:|
| 1023 | 752px | 6 | 14 |
| **1024** | **444.7px** | **61** | **69** |
| 1100 | 516.59px | 10 | 67 |
| 1280 | 654.88px | 6 | 10 |
| 1440 | 752px | 6 | 10 |

Точный общий owner затрагивает **55 routes**: Hard Texts 24, Pastor 10, Russian Baptism 10, Gill 5 и Genesis-6 6. На representative `/articles/chto-bibliya-nazyvaet-serdcem/` переход 1023→1024 меняет `.page-wrap` **800→492.7px**, основной reader **752→444.7px**. Для длинных абзацев группы 400–500px median — 35 non-space glyphs на строку; representative long paragraph становится 36 строк вместо широкого desktop потока. Высота всей `.page-wrap` на той же странице вырастает **14 152.64→20 994.63px**, то есть примерно на 48%, хотя viewport стал на один пиксель шире.

### 19.2 Причина — не «правило хорошей длины строки», а конкурирующие владельцы пространства

`floating-cluster.css` включает desktop rail ровно с `@media (min-width:64em)`. Базовая модель уже резервирует:

- левый отступ;
- rail 272–304px;
- gap 24–48px;
- выбранную reader measure (`--gb-reader-measure`, normal = 50rem).

Но поздний блок `READER UI FOLLOW-UP 2026-07-24` для 64–99.99em повторно переопределяет общий `--gb-measure`:

`calc(100vw - var(--gb-rail-reserve) - 204px)`.

Эти дополнительные **204px** — статический corridor под отдельный floating speed/control owner. При 1024px rail занимает x=24.56…296.56, reader shell x=327.28…819.98, а control strip x=824.39…891.97. Получается визуальная «полоска» не потому, что редактор выбрал узкую книжную колонку, а потому, что три независимых владельца — rail, prose и controls — делят недостаточную ширину после жёсткого breakpoint.

Семь Teen routes подтверждают противоположную сторону того же конфликта. `TeenSeriesArticlePage.astro` содержит route-local 64rem override `width:min(820px,calc(100% - var(--gb-rail-reserve)))`, который обходит общий `-204px`: paragraph при 1024 остаётся 648.7px. Но reader заканчивается на x=999.98, а пять fixed controls стоят на x=896.97…936.97. После обычной прокрутки все пять физически пересекают painted paragraphs: theme area 1315px², search 1325px², TTS 463px², favourite и up по 1600px². Screenshot SHA-256 `10172d919cd3786a555aa48a60e19c72a6bed9e0c586825e35ef8b47943692f2` показывает иконки прямо поверх букв. Значит, local override не является healthy control: 55 routes выбирают чрезмерно узкий текст, семь — широкий текст под controls. Это один missing capacity owner, а не две вкусовые претензии.

### 19.3 Browser и A/B proof

Проверены 1023/1024 × Light/Dark, reduced motion. Current 1024: shell 492.7px, representative paragraph 417.7px, horizontal overflow 0; Axe 0, broken images 0. Скриншот light SHA-256: `deded1757f95046ff10760a6e4b72fcd96d8ba95f75ebf39dd083607b306c61c8`.

Одноразовая reversible A/B замена `-204px` на `-48px` расширяет shell **492.7→648.7px**, paragraph **417.7→573.7px** и сокращает page height **20 994.63→16 572.52px**, без horizontal overflow и новых Axe failures. Но это **не готовый fix**: reader доходит до x=975.98, а floating speed strip остаётся x=824.39…891.97 и на верхней части страницы перекрывает hero/content lane. Простое удаление `204px`, z-index или overflow hiding было бы новым костылём.

1023 dark даёт два уже известные contrast nodes, принадлежащие действующему contrast row; sandbox `ERR_CONNECTION_CLOSED` во всех profiles не классифицирован как Product defect. LCP 312–520ms; current 1024 CLS около 0.0135. Mobile negative control 390×844 с `isMobile:true/hasTouch:true` скрывает rail и оставляет native theme action рабочим; desktop 1024 показывает rail и все settings/theme/search/TTS/speed controls, native theme click также меняет state. Значит, defect — распределение ёмкости, а не неработающий chrome. Скриншоты подтверждают painted layout, а не только computed width.

### 19.4 Как сделать качественно

Нужен один capacity contract, а не ещё один локальный `max-width`:

1. rail, reader measure, inter-column gap, right gutter и controls должны иметь одного layout owner;
2. compact mode включается, пока viewport не вмещает сумму этих частей с утверждённым minimum reader measure; нельзя активировать desktop rail только потому, что достигнуты 64rem;
3. качественный простой вариант — оставить tablet/mobile chrome до capacity breakpoint около 1360px, если внешний 204px control lane сохраняется;
4. более цельный вариант — встроить Play/search/settings/speed в rail, убрать отдельный control corridor и включать rail примерно от 1200px; при 1024–1199 использовать существующий drawer/bottom chrome;
5. preference `narrow/normal/wide` должна задавать реальную reader measure, а не молча проигрывать техническому corridor;
6. permanent sweep: 900/1023/1024/1100/1200/1280/1366/1440/1600, все шесть series families, Light/Dark, normal/narrow/wide, rail/controls open and closed; assertions — отсутствие отрицательного width jump, overlap/overflow, clipped headings/cards и сохранение native control actions.

Принимается `GBS-SERIES-READER-COMPACT-DESKTOP-CAPACITY-CONFLICT`. Это один shared layout defect с двумя route-policy manifestations, не 62 отдельных route rows. Intentional route art direction и разумный line-length ceiling сохраняются; исправляется именно capacity discontinuity и параллельное резервирование пространства.

### 19.5 Отдельный контракт выбора ширины: `normal` и `wide` становятся алиасами

Фокусный browser sweep добавил 1024/1280/1440/1599/1600/1920 × `narrow/normal/wide` на shared Hard Texts и Teen routes. На `/articles/chto-bibliya-nazyvaet-serdcem/` фактическая ширина длинного абзаца такова:

| viewport | narrow | normal | wide |
|---:|---:|---:|---:|
| 1024 | 444.7px | 444.7px | 444.7px |
| 1280 | 624px | 654.88px | 654.88px |
| 1440 | 624px | 752px | 806.23px |
| 1599 | 624px | 752px | 880px |
| 1600 | 624px | 712px | 712px |
| 1920 | 624px | 712px | 712px |

Значения preferences сами по себе различны (`42rem/50rem/58rem`), но базовый desktop owner задаёт `--gb-measure:min(var(--gb-reader-measure),760px,calc(100vw - 48px))`. Поэтому при 1600px позднее снятие compact rule не расширяет layout: наоборот, `normal` сужается **752→712px**, `wide` — **880→712px**, а два разных подписанных выбора становятся визуально идентичными. На Teen route local shell 820px даёт тот же alias раньше: при 1280–1920 `normal=wide=772px`; при 1024 все три выбора дают 648.7px.

Это не только computed-token observation. На 1600px trusted native clicks по «Узкая» → «Обычная» → «Шире» последовательно меняют `data-reader-measure` и persisted `gb:reader-preferences:v1`; shell получается 672→760→760px. Отдельно каждая persisted value была установлена до navigation и измерена после загрузки. UI принимает и сохраняет `wide`, но не даёт обещанного отличимого результата.

Принимается отдельный `GBS-READER-MEASURE-DESKTOP-ALIAS-AND-BREAKPOINT-REGRESSION`: capacity conflict объясняет ограничение в тесном desktop, но не оправдывает no-op между двумя доступными пользовательскими командами на широком viewport и отрицательный скачок ровно на 1600px. Closure должна определить один документированный maximum comfortable measure и согласовать с ним подписи/число состояний: либо каждое состояние реально различимо во всём заявленном desktop range, либо недоступный вариант disabled/не предлагается с ясной причиной. Нельзя просто убрать `760px`: нужны типографически утверждённые пределы и monotonic adjacent-width contract, плюс native persistence/reload proof на обеих route policies.

## 20. Продолжение: mixed-script gate проверяет не publication surfaces, а три каталога

Полный final-HTML pass по **108 страницам** извлёк reader/AT/print text вне `script/style/template/svg/noscript` и отдельно рассмотрел все 32 уникальных токена, где в одном слове встречаются Latin и Cyrillic. Осмысленные гибриды (`PDF-архив`, `GPS-карта`, `3D-сцена`, `email-адресами`) не объявлялись ошибками. Один новый near-certain homoglyph defect находится на `/karty/ishod/`: **`Суккот = Чекy (Телль эль-Маскута)`** и следующий текст повторяют `Чекy`, где последняя буква — Latin `y` (U+0079), хотя русская транслитерация в соседнем описании уже дана как Latin `Tjeku`; смешанная форма не является ни одним из этих вариантов.

Source owner — `karty/ishod/route.json:589-590`; та же ошибка вручную продублирована в research projection. Финальный static map projection публикует её дважды. На обычном экране projection является `sr-only`, поэтому не следует выдавать DOM-loaded state за painted body. Но это реальный reader surface: Chromium print media показывает строку с visible geometry x=22, y=4435.55, width=308.77px, height=17px; PDF SHA-256 `4b7e700ce20ce86147850526bafa4ff219df452c5529af8ae079c75c040bf9a1`. Она также остаётся в доступной текстовой версии карты.

Все три обязательных текущих gate проходят:

- `article:qa`: 174 files, 0 errors/0 warnings;
- `readable-audit`: pass;
- `maps:validate`: 11 route files + publication status, pass.

Причина воспроизводима в самих contracts. `article-qa.js` обещает считать mixed Cyrillic+Latin «corruption that ships broken», но `SCAN` ограничен `src/content/articles`, `src/components/baptisty-rossii` и `src/components/article-pilots`; он не читает `karty/**/*.json`, PageHead quiz payloads или финальные projections. `readable-audit` видит final HTML, но его generic pattern требует не менее трёх подряд Latin symbols рядом с Cyrillic, поэтому пропускает и single-homoglyph `Чекy`, и уже принятую `academическую`. Map schema validator проверяет структуру, не reader copy. Получается один системный verification gap, проявившийся минимум в двух независимых payload families, а не два несвязанных typo-only rows.

Принимается `SYS-PUBLICATION-MIXED-SCRIPT-SURFACE-COVERAGE`. Он поглощает именно mixed-script проявление `Чекy`; Hermenevtika direct row остаётся из-за самостоятельного большого пласта плохого русского перевода. Closure: один source+final-publication corpus owner, который включает authored prose, JSON map projections, quiz/metadata payloads, static/print/AT surfaces и dynamic reader copy; Unicode-aware mixed-script tokenization; явный reviewable allowlist для настоящих `PDF-архив`/`3D-карта`, а не ослабление до трёх букв; negative fixtures для single Latin homoglyph, single Cyrillic homoglyph и payload outside article directories. Исправить обе source copies `Чекy` через объявленный data authority, убрать ручной drift и доказать source→build parity. URL, code, bibliographic Latin и санкционированные гибриды должны остаться допустимыми.

## 21. Продолжение: map archaeology panel публикует внутренний registry

`GBS-PUBLICATION-RESEARCH-SCAFFOLD-READER-LEAK` расширен с пяти Baptist routes до **семи routes / двух surface families**, без нового work unit. Shared `MapArchaeologyProjectionBootstrap` подключён на `/karty/avraam/` и `/karty/ishod/`. Его reader panel не переводит governed research registry в готовую русскую библиографию, а напрямую печатает:

- все claim `statement` и `limitations` на английском;
- status taxonomy (`сильная опора`, `YEC-интерпретация`, `действующий источник`, повторное `проверено`);
- внутренние identifiers вида `source: arj-abraham-chronology`, `source: penn-ur-overview`, `source: bm-papyrus-anastasi-v`;
- в authored map copy — буквальный backstage-фрагмент «Для **scaffold** карты это пограничный узел…».

Projection census: Avraam содержит **17 cards / 40 source records**, Ishod — **1 card / 4 source records**; все 18 statements и все 18 limitations преимущественно английские. Это не претензия к английским названиям публикаций и не требование скрыть источники: titles/organizations/links полезны, но raw registry IDs, untranslated editorial claims и lifecycle/status axes не являются готовым читательским аппаратом.

Trusted native browser path был выполнен без force: «Начать изучение» → SVG marker с authored accessible name → tab «Археология». На Avraam/Ur открытая панель показывает 24 строки `source: …`; на Ishod/Гора Ор — четыре. Проверены desktop Light 1280×900 и mobile Dark 390×844 с `isMobile:true`, touch и reduced motion: panel width 386/358px, horizontal overflow 0, console/page errors 0, broken images 0, Axe violations 0. Ishod screenshot SHA-256 `d73d9a3aa40a396a3d5f353d06eefc6def360e86935155a87461a0c20ecf183b` непосредственно показывает `scaffold`, английский claim/limitation и raw source IDs в painted panel.

Это тот же дефект, что Baptist `Research main`/SHA/authority/class/backlog leakage: publication surface проецирует внутреннюю исследовательскую модель вместо reader copy. Canonical ID поэтому обобщён с `GBS-BAPTISTS-RESEARCH-SCAFFOLD-READER-LEAK` до `GBS-PUBLICATION-RESEARCH-SCAFFOLD-READER-LEAK`; арифметика не меняется. Closure распространяется на обе семьи: reader-facing localized claim/ограничение, обычные bibliographic links и понятная датировка проверки; internal IDs/status/lifecycle остаются в metadata. Нужен final-surface guard с allowlist для legitimate English titles, а не запрет латиницы.

## 22. Продолжение: archaeology bibliography набрана микротекстом

После отделения content leakage от presentation проверена самостоятельная типографическая иерархия shared map archaeology panel. `map-engine.js` жёстко задаёт: badges **8px/11.2px**, eyebrow **9px/14.85px**, source metadata и raw ID **9px/12.6px**, source link и limitation **10px/14–15px**. Эти значения не адаптируются между desktop и mobile. Основной claim остаётся 12px/18.6px.

Browser census того же trusted marker→«Археология» flow подтверждает painted output, а не только CSS declarations. В Avraam/Ur одновременно присутствуют 10 badges по 8px, 24 source links по 10px, 24 metadata rows и 24 IDs по 9px; scroll container имеет лишь 639px видимой высоты при **2974px** содержимого на desktop и 578px при **3080px** на mobile. В Ishod/Гора Ор — 3 badges, 4 links, 4 metadata rows и 4 IDs при scrollHeight 717px. Используются Georgia для badges/link/meta и monospace для IDs; проблема не объявляется accidental fallback.

Axe 0 и отсутствие clipping/overflow не превращают 8–10px в автоматический WCAG failure. Но источник — не декоративный kicker: это длинные названия публикаций, provenance и ограничения, которые пользователь должен прочитать и сравнить. В screenshot `d73d9a3aa40a396a3d5f353d06eefc6def360e86935155a87461a0c20ecf183b` они образуют серую плотную массу, тогда как внутренняя служебная taxonomy получает столько же или больше визуальных уровней, чем bibliographic content. Это измеримый недостаток premium/readability hierarchy, независимый от §21: удаление raw IDs уменьшит объём, но оставит 8–10px у полезных badges, links и metadata.

Принимается improvement `GBS-MAP-ARCHAEOLOGY-MICROTEXT-DENSITY`. Closure: отдельные semantic tokens для evidence badges, source title и secondary bibliography metadata с owner-approved minimum font/line-height/contrast; internal IDs после §21 не участвуют в reader layout. Нужна progressive disclosure или более компактная группировка повторяющихся sources для длинного Avraam panel, но не скрытие limitations/links. Browser comparison Avraam/Ishod на 390/1280 в Light/Dark должен сохранить evidence distinctions, keyboard/touch scrolling, links и containment без превращения панели в крупнотипографский бесконечный список.

## 23. Продолжение: Ishod print/AT projection стирает структуру rich copy

`IshodStaticProjection.astro` обещает дать печати и no-JS «ровно тот» авторский текст, который показывает интерактивная карта, но его общий `toText()` заменяет каждый HTML tag одним пробелом, после чего весь `place.dispute` помещается в один `<p>`. Для inline markup это допустимо; для rich blocks (`dispute-title`, несколько `dispute-pos`, confidence labels и note) уничтожаются заголовки, границы вариантов и роль подписи надёжности.

Source census нашёл четыре реально публикуемых multi-block dispute payloads: Rameses, Sinai, Kadesh-Barnea и historical Pihahiroth; последний заменяется authority copy до projection, поэтому current final defect проявляется в **трёх** местах. Наиболее явные финальные строки:

- «…Фараон: Тутмос III / Аменхотеп II. **Средняя Поздняя** (~1260 до н.э.)… Фараон: Рамсес II. **Средняя Позиция**: YEC — ранняя дата»;
- «Кадеш: оазис без бронзового слоя Эйн эль-Кудейрат : … **Средняя Кочевая стоянка** : … **Средняя Кочевники** не оставляют построек…».

Это не новые authored утверждения: слова `Средняя`, `Поздняя`, `Позиция` принадлежат разным sibling blocks/classes, но projector превращает их в одну грамматически ложную фразу. Sinai аналогично теряет разделение competing positions и заключительной project position, хотя остаётся угадываемым.

Browser proof различает surfaces. В обычном screen mode static projection остаётся `sr-only`, но CDP full accessibility tree содержит обе malformed строки как non-ignored `StaticText`; следовательно, это реальный AT output, а не просто hidden DOM. В Chromium print media Rameses и Kadesh paragraphs painted: соответственно y=880.11, 1280×65.11px и y=3346.05, 1280×43.41px. PDF SHA-256 `e6d85915222b0955de750e5c1ab8a63ec8ebbb030b0233bd92cb1e2095cd7e5a`; console/page errors 0, broken images 0, Axe violations 0. Отсутствие Axe finding ожидаемо: проблема — потеря editorial structure, не формальная роль или contrast.

Текущие gates это принимают: production-like `astro:audit:ishod` проверяет наличие projection, title, authority note и fallback wiring, но не parity структуры rich blocks; `maps:validate` и publication status проходят все 11 route JSON; `readable-audit` также pass. Принимается `GBS-ISHOD-STATIC-PROJECTION-RICH-BLOCK-FLATTENING`.

Closure: не рендерить route HTML небезопасно через raw injection, а распарсить разрешённый authored subset в typed blocks либо хранить dispute как structured data и проецировать title/position/confidence/note отдельными семантическими элементами. Source→screen-panel→print→AX contract должен сравнить порядок и границы Rameses/Sinai/Kadesh, запретить adjacent artifacts `Средняя Поздняя`/`Средняя Позиция`/`Средняя Кочевая`, сохранить authority override Pihahiroth и доказать отсутствие unsafe HTML. Простая пунктуационная замена трёх текущих строк не закрывает projector root.

## 24. Продолжение: no-JS uncertainty card закрывает полную текстовую карту

Отдельный `javaScriptEnabled:false` browser profile опроверг предположение, что наличие static projection означает её доступность sighted no-JS reader. Без JS `MapRuntimeFallback` действительно снимает `.sr-only` с `[data-map-static-projection]`: desktop projection получает 760×8126.38px, mobile — 358×15373.47px; stage скрыт. Но второй route-local `<noscript>` (`.pihahiroth-noscript`) одновременно становится fixed overlay с `z-index:2147483647`, `inset:32px` и `overflow:auto`.

В результате concise Pihahiroth card размером 1216×836px на desktop и 326×780px на mobile постоянно лежит над основной текстовой картой. Hit-testing в центре viewport возвращает overlay, не projection; overlay не имеет close/full-text action и не переполняется сам (`scrollHeight=clientHeight` 834/778). Прокрутка двигает длинный document за fixed layer, поэтому любой фрагмент projection, проходящий через viewport, остаётся под overlay. Отдельная generic no-JS card «Карта Исхода доступна в текстовом режиме» находится после 8–15 тысяч пикселей projection и также перекрывается тем же fixed owner.

Проверены desktop Light 1280×900 и mobile Dark 390×844 с `isMobile:true`, touch и reduced motion. Console/page errors и broken images — 0. Screenshots SHA-256: desktop `5988e4dbaa1486fc23a0e3ee9556a5f27f8c0ff1d728431bff3dd2019dc88fb8`, mobile `af30aa0fb680ea8f03422dcb02113ba1e331d66121d1c7b36437469869019bc2`. Это именно painted stacking failure, не loaded-state inference.

Source contracts противоречат друг другу. `IshodStaticProjection` декларирует, что no-JS обязан получать полный авторский маршрут; `IshodPageHead.astro` глобально фиксирует отдельный Pihahiroth fallback поверх страницы. `astro:audit:ishod` при этом зелёный и отдельно утверждает и static «print/no-JS» projection, и наличие `data-pihahiroth-noscript`, но не компонует их в одном disabled-JS viewport. Принимается `GBS-ISHOD-NOJS-FALLBACK-OWNER-OCCLUSION`.

Closure: один no-JS owner. Pihahiroth uncertainty должна стать частью полной текстовой projection в естественном потоке либо concise fallback должен ссылаться/прокручивать к видимой полной версии без fixed occlusion. Нельзя просто понизить z-index, оставив две конкурирующие fallback narratives и скрытый generic card. Permanent disabled-JS test обязан проверить desktop/mobile Light/Dark: hit-testing и painted geometry полного начала/середины/конца маршрута, достижимую back-navigation, отсутствие duplicate fixed layer, authority uncertainty copy и отсутствие interactive-stage residue.

## 25. Продолжение: `Аварон` вместо `Аарон`

Полный source search обнаружил в Ishod story description строку **«Кадеш · Аварон · Финеес»** (`karty/ishod/route.json:76`) и её вручную продублированную research copy. В остальном Product использует нормальную форму **«Аарон» 91 раз в 21 файле**, включая восемь употреблений в том же `route.json`; `Аварон` встречается только в этих двух синхронных копиях. В контексте сюжета 40-летних странствий между Кадешем и Финеесом речь именно об Аароне, а не о другом имени или допустимой transliteration variant.

Browser proof подтверждает publication, а не только source typo. Final static story list содержит «40 лет странствий — Кадеш · Аварон · Финеес»; CDP full AX tree показывает окончание как non-ignored `StaticText`. В print media это painted `<li>` x=22, y=533.5, 1258×21.7px; PDF SHA-256 `17e5be047689bcd85487b37c2f13bf61f9e82ea67330bbd99c222b70bb737b55`. Та же description входит в route story data интерактивной карты.

`article:qa` остаётся зелёным (174 files, 0/0), потому что не сканирует map JSON; `readable-audit` не является словарём имён; `maps:validate` и publication status проверяют shape 11 routes, а не орфографию. Принимается `GBS-ISHOD-AARON-NAME-MISSPELLING`.

Closure: исправить canonical route data и устранить/синхронизировать ручную research copy через объявленного data owner; пересобрать и проверить interactive story, print и AX output. Добавить узкий protected-name fixture для ключевых библейских имён map corpus (`Аарон`, не `Аварон`) с reviewable lexicon, не превращая автоматический spellcheck в безусловный источник истины для редких транслитераций.

Product mutation and merge remain outside this audit.

## 26. Продолжение: необъяснённое «фидельные свидетельства» в читательском конспекте

Контекстная проверка редких слов отделила имена, библеизмы и допустимую специальную лексику от одного опубликованного выражения без читательского смысла. В `pastorSeriesConfig.ts:357` конспект раздела «Верность под давлением» описан как **«Фидельные свидетельства: как сохраняли верность Богу…»**. Прилагательное «фидельный» может употребляться как узкотехнический эквивалент fidelity в обработке сигналов/моделировании, но здесь не назван такой домен, термин не определён, а обычная русская коллокация для содержания раздела — «свидетельства верности» или «верные свидетельства». Это не богословский термин, имя и не цитата. Редкий технический англицизм делает навигационное summary непонятным именно там, где оно должно быстро объяснить раздел.

Это единственный source occurrence. Production-like final HTML сохраняет его дословно. В mobile Dark 390×844 с touch и reduced motion нативное открытие Learning Sheet и вкладки «Конспект», затем обычная прокрутка панели, показывают строку painted внутри viewport: `<small>` x=51, y=534.16, 319×34.78px. CDP AX tree одновременно содержит link name и non-ignored `StaticText` с той же фразой. Broken images 0; Product page error отсутствует, единственный console error — уже отделённый sandbox `ERR_CONNECTION_CLOSED`. Screenshot SHA-256 `63d89fab340d30f3a5c17cd24753b9959368a6e423cba5f5f46319933212b3fe`.

Текущие article/editorial checks зелёные, поскольку unusual-word review не может безопасно опираться на частотный словарь: тот же corpus закономерно содержит редкие имена и транслитерации. Принимается узкий direct defect `GBS-DIOTROPHES-UNEXPLAINED-FIDEL-JARGON`, не общий запрет редкой лексики.

Closure: заменить summary на owner-reviewed естественную формулировку, сохраняющую различие между верностью Богу и молчаливым подчинением лидеру; проверить source→final text и нативно открыть «Конспект» на desktop/mobile. Если автор действительно намерен ввести специальный термин, он должен быть явно определён и мотивирован в читательском тексте, а не впервые появляться в навигационной подписи. Автоматическая защита уместна только как review-list для необъяснённых англицизмов, не как безусловный spellcheck редких богословских имён.

Итоговая арифметика: **68 = 39 direct defects + 7 improvements + 22 system lanes**.

## 27. Продолжение: mobile justification разрывает строки «Нагорной проповеди»

Проверка premium/readability presentation нашла отдельный route-family defect, который не виден из общей ширины reader. Все пять частей «Нагорной проповеди» сохраняют authored utility `text-justify` на узком mobile. В исходниках это **312 литералов в 51 Astro-файле**: одинаковая политика размножена между `MainShell` и section-компонентами. В финальном mobile DOM реально вычисляются `text-align:justify` у **144 prose blocks**: часть I — 25, II — 11, III — 18, IV — 61, V — 29.

Пословный Chromium Range census измерил не субъективные «реки», а фактические промежутки между соседними словами на одной строке. При 320px пять частей дают соответственно **174 / 162 / 182 / 967 / 324**, всего **1 809 межсловных промежутков ≥20px**. При 390px остаётся **1 354**. Representative paragraph в части I имеет content width 238px, но первая строка растягивает «Такой» и «порядок» промежутком **127px**; внутри одного абзаца шесть промежутков ≥20px. Другие валидные word-to-word maxima достигают 136px. Это не одна случайная строка и не вкус к книжной верстке: пробел занимает больше половины доступной строки и системно разрушает визуальную связность фраз.

Browser proof выполнен на 320×844 mobile Dark с `isMobile:true`, touch и reduced motion. Screenshot current SHA-256 `48c37e337705cfa4ded77d434ab295c80fd7359d0ea742b7402e10f29716d65e` показывает разорванные строки. Одноразовый A/B только на representative paragraph (`text-align:left`) сохраняет его width **238px** и height **390px**, но снижает max gap **127→4px**, число gaps ≥20px **6→0**; screenshot SHA-256 `0f2e38a6d44462fedb6ecc51fb383d2c7a2002bc1907837f17ede97967b3e454`. Это диагностическая замена, не Product fix.

Контроли: Axe 0, broken images 0, page errors 0; LCP 224ms, CLS 0.00093. Единственный console error — уже отделённый sandbox `ERR_CONNECTION_CLOSED`. Green accessibility/performance checks ожидаемо не измеряют межсловный ритм.

Принимается `GBS-NAGORNAYA-MOBILE-JUSTIFICATION-RIVERS`. Closure должна принадлежать всей серии, а не 312 локальным правкам: один semantic prose policy/token для «Нагорной проповеди», который на compact widths использует start/left alignment либо доказуемо качественную hyphenation/justification policy с ограничением экстремальных gaps. Desktop book-like art direction можно сохранить после browser review. Permanent sweep: все пять частей на 320/390/768/1024/1280, Light/Dark, normal/narrow/wide; считать реальные same-line word gaps и проверять отсутствие horizontal overflow, float collisions и изменения смысла/порядка. Generic глобальный запрет `text-align:justify` не нужен: правило здесь route-family-specific, но должно иметь одного shared owner.

Итоговая арифметика: **69 = 40 direct defects + 7 improvements + 22 system lanes**.
