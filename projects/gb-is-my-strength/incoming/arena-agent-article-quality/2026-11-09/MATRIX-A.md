# Матрица багов — агент A (2026-11-09)

## Agent

- Agent: agent-a
- Date: 2026-11-09
- Audited anchor: `ae3669bf7a9b87af06e999c0bb3ef5009c400d43`
- Evidence anchor: см. `01-ARTICLE_REGISTRY.md` (sha256 tarball + per-file хэши)
- Status: `raw`; владелец файла — только этот агент; push/commit не производятся

## Сводка

- Файлов в группе: **21**
- Автоматических сигналов: **23** (в т.ч. blocker 5, risk 6, signal-only 12)
- Статус: baseline-прогон; каждую строку агент подтверждает или снимает ручной проверкой по `00-CRITERIA.md` C01–C24.
- `signal-only` в счёт багов не идёт до подтверждения жанровой поправкой.

## Строки

| ID | Файл / route | Критерий | Что найдено | Доказательство (anchor) | Жанровая поправка | Severity | Статус | Владелец |
|---|---|---|---|---|---|---|---|---|
| `AAQ-A-001` | `content/articles/dva-sezda-1884.mdx` | C07 | Объём 887 слов < минимума S19 (1500) | baseline `01-ARTICLE_REGISTRY.md`, строка «dva-sezda-1884.mdx»; sha256(12) см. реестр | Сверить с live/word targets roadmap (2800/4200) | risk | raw | agent-a |
| `AAQ-A-002` | `content/articles/goneniya-i-sovest.mdx` | C07 | Объём 2104 слов < roadmap minimumWordsPerArticle 2800 | baseline `01-ARTICLE_REGISTRY.md`, строка «goneniya-i-sovest.mdx»; sha256(12) см. реестр | Проверить роль статьи (мост/тизер) и live-версию | signal-only | raw | agent-a |
| `AAQ-A-003` | `content/articles/goneniya-i-sovest.mdx` | C05 | 1 внутренних пометок (TODO/HOLD/`/research/`/ТЗ «должна включать») | baseline `01-ARTICLE_REGISTRY.md`, строка «goneniya-i-sovest.mdx»; sha256(12) см. реестр | Сверить с reader-facing текстом live | blocker | raw | agent-a |
| `AAQ-A-004` | `content/articles/iniciativnaya-gruppa.mdx` | C07 | Объём 2239 слов < roadmap minimumWordsPerArticle 2800 | baseline `01-ARTICLE_REGISTRY.md`, строка «iniciativnaya-gruppa.mdx»; sha256(12) см. реестр | Проверить роль статьи (мост/тизер) и live-версию | signal-only | raw | agent-a |
| `AAQ-A-005` | `content/articles/noch-na-kure.mdx` | C07 | Объём 1171 слов < минимума S19 (1500) | baseline `01-ARTICLE_REGISTRY.md`, строка «noch-na-kure.mdx»; sha256(12) см. реестр | Сверить с live/word targets roadmap (2800/4200) | risk | raw | agent-a |
| `AAQ-A-006` | `content/articles/peterburgskaya-liniya.mdx` | C07 | Объём 1838 слов < roadmap minimumWordsPerArticle 2800 | baseline `01-ARTICLE_REGISTRY.md`, строка «peterburgskaya-liniya.mdx»; sha256(12) см. реестр | Проверить роль статьи (мост/тизер) и live-версию | signal-only | raw | agent-a |
| `AAQ-A-007` | `content/articles/peterburgskaya-liniya.mdx` | C05 | 1 внутренних пометок (TODO/HOLD/`/research/`/ТЗ «должна включать») | baseline `01-ARTICLE_REGISTRY.md`, строка «peterburgskaya-liniya.mdx»; sha256(12) см. реестр | Сверить с reader-facing текстом live | blocker | raw | agent-a |
| `AAQ-A-008` | `content/articles/podpolnaya-pechat.mdx` | C07 | Объём 2396 слов < roadmap minimumWordsPerArticle 2800 | baseline `01-ARTICLE_REGISTRY.md`, строка «podpolnaya-pechat.mdx»; sha256(12) см. реестр | Проверить роль статьи (мост/тизер) и live-версию | signal-only | raw | agent-a |
| `AAQ-A-009` | `content/articles/sovetskaya-noch.mdx` | C07 | Объём 1941 слов < roadmap minimumWordsPerArticle 2800 | baseline `01-ARTICLE_REGISTRY.md`, строка «sovetskaya-noch.mdx»; sha256(12) см. реестр | Проверить роль статьи (мост/тизер) и live-версию | signal-only | raw | agent-a |
| `AAQ-A-010` | `content/articles/spravochnik.mdx` | C07 | Объём 2558 слов < roadmap minimumWordsPerArticle 2800 | baseline `01-ARTICLE_REGISTRY.md`, строка «spravochnik.mdx»; sha256(12) см. реестр | Проверить роль статьи (мост/тизер) и live-версию | signal-only | raw | agent-a |
| `AAQ-A-011` | `content/articles/spravochnik.mdx` | C05 | 2 внутренних пометок (TODO/HOLD/`/research/`/ТЗ «должна включать») | baseline `01-ARTICLE_REGISTRY.md`, строка «spravochnik.mdx»; sha256(12) см. реестр | Сверить с reader-facing текстом live | blocker | raw | agent-a |
| `AAQ-A-012` | `content/articles/spravochnik.mdx` | C12 | 80 % абзацев ≤2 предложений при avg 1.5 | baseline `01-ARTICLE_REGISTRY.md`, строка «spravochnik.mdx»; sha256(12) см. реестр | Применить жанровую таблицу §4 критериев; нужен развёрнутый evidence-абзац в разделе | signal-only | raw | agent-a |
| `AAQ-A-013` | `content/articles/vsehib-1944.mdx` | C07 | Объём 1776 слов < roadmap minimumWordsPerArticle 2800 | baseline `01-ARTICLE_REGISTRY.md`, строка «vsehib-1944.mdx»; sha256(12) см. реестр | Проверить роль статьи (мост/тизер) и live-версию | signal-only | raw | agent-a |
| `AAQ-A-014` | `content/articles/vsehib-1944.mdx` | C23 | 53 % коротких предложений | baseline `01-ARTICLE_REGISTRY.md`, строка «vsehib-1944.mdx»; sha256(12) см. реестр | Норма для лида/карточки; проверить аргументативное ядро | signal-only | raw | agent-a |
| `AAQ-A-015` | `content/articles/yuzhnaya-shtunda.mdx` | C07 | Объём 784 слов < минимума S19 (1500) | baseline `01-ARTICLE_REGISTRY.md`, строка «yuzhnaya-shtunda.mdx»; sha256(12) см. реестр | Сверить с live/word targets roadmap (2800/4200) | risk | raw | agent-a |
| `AAQ-A-016` | `components/baptisty-rossii/BaptistyRossiiBody.astro` | C12 | 100 % абзацев ≤2 предложений при avg 1 | baseline `01-ARTICLE_REGISTRY.md`, строка «BaptistyRossiiBody.astro»; sha256(12) см. реестр | Применить жанровую таблицу §4 критериев; нужен развёрнутый evidence-абзац в разделе | signal-only | raw | agent-a |
| `AAQ-A-017` | `components/baptisty-rossii/BaptistyRossiiGoneniyaISovestBody.astro` | C05 | 1 внутренних пометок (TODO/HOLD/`/research/`/ТЗ «должна включать») | baseline `01-ARTICLE_REGISTRY.md`, строка «BaptistyRossiiGoneniyaISovestBody.astro»; sha256(12) см. реестр | Сверить с reader-facing текстом live | blocker | raw | agent-a |
| `AAQ-A-018` | `components/baptisty-rossii/BaptistyRossiiIniciativnayaGruppaBody.astro` | C06 | «Коротко»: 3 пунктов вместо 4–6 (S17) | baseline `01-ARTICLE_REGISTRY.md`, строка «BaptistyRossiiIniciativnayaGruppaBody.astro»; sha256(12) см. реестр | Проверить, нет ли новых claims | risk | raw | agent-a |
| `AAQ-A-019` | `components/baptisty-rossii/BaptistyRossiiPodpolnayaPechatBody.astro` | C06 | «Коротко»: 3 пунктов вместо 4–6 (S17) | baseline `01-ARTICLE_REGISTRY.md`, строка «BaptistyRossiiPodpolnayaPechatBody.astro»; sha256(12) см. реестр | Проверить, нет ли новых claims | risk | raw | agent-a |
| `AAQ-A-020` | `components/baptisty-rossii/BaptistyRossiiSovetskayaNochBody.astro` | C06 | «Коротко»: 3 пунктов вместо 4–6 (S17) | baseline `01-ARTICLE_REGISTRY.md`, строка «BaptistyRossiiSovetskayaNochBody.astro»; sha256(12) см. реестр | Проверить, нет ли новых claims | risk | raw | agent-a |
| `AAQ-A-021` | `components/baptisty-rossii/BaptistyRossiiSpravochnikBody.astro` | C05 | 2 внутренних пометок (TODO/HOLD/`/research/`/ТЗ «должна включать») | baseline `01-ARTICLE_REGISTRY.md`, строка «BaptistyRossiiSpravochnikBody.astro»; sha256(12) см. реестр | Сверить с reader-facing текстом live | blocker | raw | agent-a |
| `AAQ-A-022` | `components/baptisty-rossii/BaptistyRossiiSpravochnikBody.astro` | C12 | 87 % абзацев ≤2 предложений при avg 1.4 | baseline `01-ARTICLE_REGISTRY.md`, строка «BaptistyRossiiSpravochnikBody.astro»; sha256(12) см. реестр | Применить жанровую таблицу §4 критериев; нужен развёрнутый evidence-абзац в разделе | signal-only | raw | agent-a |
| `AAQ-A-023` | `components/baptisty-rossii/BaptistyRossiiVsehib1944Body.astro` | C23 | 52 % коротких предложений | baseline `01-ARTICLE_REGISTRY.md`, строка «BaptistyRossiiVsehib1944Body.astro»; sha256(12) см. реестр | Норма для лида/карточки; проверить аргументативное ядро | signal-only | raw | agent-a |

## Ручная проверка (обязательная для агента)

- [ ] C01–C04: источники существуют и подтверждают именно предложение (приоритет: JMIR/Wikipedia tell H02).
- [ ] C08/C09: виден ход рассуждения; факт/источник/позиция/вывод различены.
- [ ] C06/C17: «Коротко» и проекции не вводят новых claims.
- [ ] C11/C12/C21: афоризмы и короткие абзацы оценены **по жанровой таблице**, не по абсолютному порогу.
- [ ] C14/C15/C19: изображения, типографика, mojibake на live.
- [ ] Каждая новая строка содержит anchor; снятая строка помечается `supersedes:`, а не удаляется.

---

## Верификация координатором (2026-11-09): полный live current-check 10/10

Прочитаны лендинг (2 чанка) и chunk 0 **всех девяти статей + справочника**: `noch-na-kure`, `yuzhnaya-shtunda`, `dva-sezda-1884`, `peterburgskaya-liniya`, `goneniya-i-sovest`, `sovetskaya-noch`, `vsehib-1944`, `iniciativnaya-gruppa`, `podpolnaya-pechat`, `spravochnik`. Дополнительно `vsehib-1944` chunks 0–4 из предыдущего прохода. Сверено с Product `main` source tree.

### Снятые baseline-строки

| Строки | Решение | Почему |
|---|---|---|
| C07 (объём <1500 / <2800) по baptisty-MDX | **снято, `supersedes`** | Live корпус 229 мин ≈ 45 800–57 250 слов против 19 279 в архиве (2.4–3.0×). Архивные MDX — черновик; замер по ним невалиден для live |
| C05 (ТЗ/TODO в MDX) | **снято для live** | «Карточка … должна включать», «ещё нужно найти», «скан пока не верифицирован» на live переработаны в «Как читать эту главу» и редакционный принцип |
| C10 (афоризм вместо аргумента) | **снято для live** | «Поэтому важен не эффектный набор цитат сам по себе, а установленный механизм» (`sovetskaya-noch`); афоризмы идут рядом с разбором — допустимо по §4 критериев |
| C12 / C23 (`≤2`, короткие предложения) | **остаются `signal-only`** | 2–4 предложения — норма веб-чтения (GOV.UK/NN/g); без жанровой поправки дефектом не являются |
| C05 по справочнику («очередь будущих правок») | **снято как жанровое исключение** | См. `00-CRITERIA.md` §8: намеренная читательская рубрика по S10/P25, а не остаток ТЗ |

### Новые строки

| ID | Файл / route | Критерий | Что найдено | Доказательство (anchor) | Жанровая поправка | Severity | Статус | Владелец |
|---|---|---|---|---|---|---|---|---|
| `AAQ-A-024` | 10/10 live-страниц baptisty | C16 / S46 / S47 / M04 / CQS §2.2 | **Системная утечка текста глоссария в читательское предложение.** В извлечённом тексте: `⟦определение: … ⟧` и «…не была баптистской**Представитель протестантской традиции…Подробнее**…», «…читали Новый Завет**Вторая часть христианского канона…Подробнее**…», «…и баптистов**Представитель…**». Слитно, без пробела, внутри абзаца | Live chunk 0 всех 9 статей + `spravochnik` (2026-11-09); в source `⟦` = **0**, зато `<span class="gterm" tabindex="0">…<span class="gtip">…</span></span>` **внутри `<p>`**: 33 `gterm` / 33 `gtip` в 10 Body-файлах (`BaptistyRossiiDvaSezda1884Body.astro:40` и др.). Второй механизм — runtime-инъекция по `data/glossary.json`: у `SovetskayaNoch` inline `gterm=0`, но на live вклинивание есть | Визуально tooltip может быть скрыт CSS до hover/focus; CQS §2.2 прямо требует browser/runtime contract, а не строковый lint. **Нужен browser check**: визуальный слой, screen reader, копирование, print/PDF, поисковый индекс | `risk` → systemic candidate | `candidate` (browser confirmation required) | agent-a |
| `AAQ-A-025` | `iniciativnaya-gruppa`, `podpolnaya-pechat`, `sovetskaya-noch` | C06 / S17 | «Коротко» содержит **3 пункта вместо 4–6** | Source: `BaptistyRossiiIniciativnayaGruppaBody.astro` / `…PodpolnayaPechatBody.astro` / `…SovetskayaNochBody.astro` — по 3 `<li>`; live chunk 0 тех же маршрутов — по 3 пронумерованных пункта. Остальные 6 статей — по 6 | Для исторического лонгрида исключения нет; справочник (`Коротко=0`, отдельный блок «Как читать этот справочник») — **не нарушение**, жанровая поправка | `risk` | `verified-at-anchor` | agent-a |
| `AAQ-A-026` | `spravochnik` | C05 / P06 / P25 | **Снято.** «Эта страница будет обновляться после новых находок», «очередь будущих правок», «Открытый или спорный вопрос» — намеренная редакционная карта, а не внутренние TODO | Live `spravochnik` chunk 0; `00-CRITERIA.md` §8 | Жанр справочника: S10 «пробел честнее выдумки» требует публичной границы знания. `supersedes: AAQ-A-… (C05 по справочнику)` | — | `withdrawn` | agent-a |
| `AAQ-A-027` | 8/9 статей | C08 / C09 / P03 / P17 | **Положительная находка.** Блок «Как читать эту главу / источники / свидетельства» с разделением 4–5 голосов: первичный документ, официальное самоописание, память участника, академическая реконструкция, административный контекст; «Сила формулировки не должна быть выше силы источника» | Live chunk 0: `noch-na-kure`, `yuzhnaya-shtunda` (5 голосов), `dva-sezda-1884`, `peterburgskaya-liniya`, `goneniya-i-sovest`, `vsehib-1944`, `iniciativnaya-gruppa`, `podpolnaya-pechat` | Прямое выполнение S3/S6/S43; одновременно совпадает с Wikipedia tell «hedging disclaimers» — **не дефект** (`00-CRITERIA.md` §8) | — | `verified-at-anchor` (positive) | agent-a |
| `AAQ-A-028` | `iniciativnaya-gruppa`, `sovetskaya-noch`, `spravochnik`, `noch-na-kure` | C14 / C19 / P19 / S8 | **Положительная находка.** Provenance и границы доказательства: «Полный визуально проверенный оригинал … пока не получен … нельзя повышать до уровня прямой архивной публикации»; «Public domain; физическая копия и SHA-256 сверены по MASTER»; «Датировка относится к портрету, а не к событиям в Тифлисе в 1867 году»; «Схема не ранжирует источники одной „оценкой истины“» | Live chunk 0 указанных маршрутов; `spravochnik` — 5 типов свидетельств + 4 шага проверки (Происхождение / Права / Файл / Контекст) | Снимает претензию «нет научного аппарата» из `REPORT.md` §3–§8; `????` в прочитанных чанках не встретился | — | `verified-at-anchor` (positive) | agent-a |

### Что осталось действительным дефектом в группе A

1. **Дробность абзацев и рубленая фраза** — подтверждена и на live (15 очищенных ¶ `vsehib-1944`: avg 4.13, 26 % ≤2, 41 % коротких). Остаётся `signal-only` до жанровой привязки по §4, но это единственная стилевая претензия из первого прохода, которая не снята.
2. **`AAQ-A-024`** — новый системный кандидат: дефект сместился из контента в **проекцию/рендер**.
3. **`AAQ-A-025`** — три конкретных нарушения S17, проверенных и в source, и на live.

### Границы замера

- Прочитан chunk 0 каждой страницы (у `vsehib-1944` — chunks 0–4), а не все чанки всех десяти: полный пословный замер live-корпуса не проводился.
- Подсчёт `gterm=33` — только по 10 `baptisty-rossii/*Body.astro`; вынесенные компоненты (`BaptistyHistoricalMedia.astro`, `SeriesReaderChrome.astro`) и runtime-инъекция `data/glossary.json` в этот счёт не входят.
- Browser/runtime confirmation по `AAQ-A-024` **не выполнялась**; статус намеренно не повышен до `verified`.
- Правки Product не производились; `MASTER_BUG_MATRIX.md` не тронут.

---

## Третий проход (2026-11-09): поправки после кросс-агентной сверки

| ID | Файл / route | Критерий | Что найдено | Доказательство (anchor) | Жанровая поправка | Severity | Статус | Владелец |
|---|---|---|---|---|---|---|---|---|
| `AAQ-A-029` | все 10 baptisty-маршрутов | C07 / C23 / SYS-1 | **Layer split.** `index.astro` рендерит `Body.astro`, MDX не подключены; 9 MDX = 15 136 слов, 10 Body = 27 608, Jaccard 8-словных шинглов 0.004 / 0.041 / 0.515. Любая метрика полноты/`readingTime` по MDX не описывает живую страницу | Product `5e2db6f0…`: `src/pages/baptisty-rossii/*/index.astro`; подсчёт слов и Jaccard в `03-CROSS_AGENT_SYNTHESIS.md` §2 | `supersedes:` все строки C07 группы A, включая снятые в предыдущем проходе | `risk` (systemic) | `verified-at-anchor` | agent-a |
| `AAQ-A-030` | `spravochnik` | C06 / S17 | **Снятие снятия.** `AAQ-A-026` отзывается: решение владельца «„Коротко“ обязательно везде, 4–6 пунктов, складное» зафиксировано в `STATUS.md` ветки `arena/a33be340-auditrepo`. Отсутствие блока у справочника перестаёт быть жанровым исключением | внешний witness, read-only `gh api`, 2026-11-09 | owner decision выше жанровой таблицы `00-CRITERIA.md` §4 | `risk` | `supersedes: AAQ-A-026` | agent-a |

**Итог группы A:** 21 файл, baseline + 10/10 live + layer-проверка. Активны `AAQ-A-024` (candidate, browser check), `AAQ-A-025` (3 статьи, S17), `AAQ-A-029` (systemic), `AAQ-A-030` (справочник, S17). Положительные `AAQ-A-027/028` сохранены. Остальные baseline-сигналы сняты или остаются `signal-only`.

---

## Четвёртый проход (2026-11-09): финальная разметка, отзывы и уточнения

| ID | Файл / route | Критерий | Что найдено | Доказательство (anchor) | Жанровая поправка | Severity | Статус | Владелец |
|---|---|---|---|---|---|---|---|---|
| `AAQ-A-031` | 10/10 live-страниц | C16 / S46 / CQS §2.2 | **ОТЗЫВ `AAQ-A-024`.** Утечка глоссария — артефакт `fetch_page`: в финальном HTML нет строк «Представитель протестантской традиции», «Подробнее», `⟦`; `js/glossary.js` вешает `aria-hidden="true"` на detail, `css/site.css` скрывает `.gtip` через `display:none;visibility:hidden;opacity:0` | Product `5e2db6f0…`: `baptisty-rossii/vsehib-1944/index.html`, `js/glossary.js:32`, `css/site.css` `.gtip{…}`; `03-CROSS_AGENT_SYNTHESIS.md` §9.3 | **Положительная находка:** `hydrationForbiddenSelectors` исключают `.summary-card`/`h1`–`h6`/`nav`/`figure`/`figcaption`/`table`, cadence `maxPerArticle:3` — контракт CQS §2.2 реализован. Residual только для crude HTML→text/RAG без учёта `display:none`/`aria-hidden` | `signal-only` | `supersedes: AAQ-A-024` (withdrawn as reader defect) | agent-a |
| `AAQ-A-032` | 11 baptisty `index.html` + 10 `Body.astro` | C06 / S17 | **Уточнение `AAQ-A-025`.** «Коротко» из 3 пунктов: **11/11** в финальной статической разметке (включая справочник) и **3/10** в live/Astro. `<details>` = 0 в обоих слоях | финальные HTML, `<section class="summary-card">` → ровно 3 `<li>` у всех 11; `Body.astro` — 6/3/3/3/6/6/6/6/6/6 | owner decision «4–6, складное» не реализовано; `supersedes: AAQ-A-025` (масштаб) | `risk` | `verified-at-anchor` | agent-a |
| `AAQ-A-033` | 84 финальных HTML | C19 / D06 | `????` = 0, mojibake = 0, CJK = 0 на точном якоре — во всех 11 baptisty и 11 built `/articles/*` | Product `5e2db6f0…`, подсчёт по raw HTML; `03-CROSS_AGENT_SYNTHESIS.md` §9.4 | **Не закрытие** `GBS-BAPTISTS-VISIBLE-COPY-QUESTION-MARK-LOSS`: MASTER описывает painted/прод-проявление; нужен browser witness | `signal-only` (narrowed residual) | `verified-at-anchor` (source/final only) | agent-a |
| `AAQ-A-034` | все слои baptisty | C06 / SYS-6 | Решение владельца «складное» не реализовано: `<details>` = 0 и в legacy HTML, и в `Body.astro`; блок всегда раскрыт | `<section class="summary-card" data-speakable>` без `<details>`; CSS/JS-хуков сворачивания нет | подтверждает `_coordination/.../SUMMARY_BLOCK_DECISION.md` агента A для обоих слоёв | `risk` | `verified-at-anchor` | agent-a |
| `AAQ-A-035` | `css/site.css` | C15 / SYS-6 | `.summary-card__head{font-size:9px;line-height:1.1;letter-spacing:.2em}` — строка MASTER `GBS-SUMMARY-MICROHEADING-READABILITY` подтверждается на якоре. Открытый вопрос агента A «18 из 70» снимается: блок есть у 21/22 финальных HTML, «18/70» считалось по MDX | `css/site.css`; `MASTER_BUG_MATRIX.md:183` | **absorbed** в существующего owner'а, новая строка не нужна | — | `verified-at-anchor` (positive/absorbtion) | agent-a |
| `AAQ-A-036` | 6 внешних URL | C04 / C22 / H01 / H02 | 6/6 источников живут; 5 подтверждают приписанные утверждения, 1 — только объект. Coleman независимо подтверждает 11 июня 1869 (Унгер→Цимбал) и 20 августа 1867; historyrussia — постановление 8 апреля 1929; Wayback — мемуары Ливен | `03-CROSS_AGENT_SYNTHESIS.md` §9.6, `fetch_page` 2026-11-09 | выборка 6 из ~530 ссылок, не ценз; JMIR-риск не подтвердился, но не снят для остального массива | — | `verified-at-anchor` (negative control) | agent-a |

**Активное состояние группы A:** `AAQ-A-029` (SYS-1, три слоя), `AAQ-A-030` (справочник под owner decision), `AAQ-A-032` (S17, 11/11 legacy + 3/10 live), `AAQ-A-034` (сворачивание). `AAQ-A-024` и `AAQ-A-025` отозваны/уточнены, `AAQ-A-026` отозвана ранее. `AAQ-A-027/028` — положительные witness'ы.

---

## Пятый проход (2026-11-09): подтверждения, границы и калибровка

| ID | Файл / route | Критерий | Что найдено | Доказательство (anchor) | Жанровая поправка | Severity | Статус | Владелец |
|---|---|---|---|---|---|---|---|---|
| `AAQ-A-037` | все 3 слоя / 10 маршрутов | C05 / SYS-2 / S12 | **SYS-2 подтверждён во всех трёх слоях.** `Body.astro` 8/10: 40-hex SHA ×4, SHA-256 ×3, `A1/A2` ×12, `authority` ×8, `HOLD` ×1, `backlog` ×1; MDX 4/10: `A1/A2` ×5, `HOLD` ×1; legacy HTML **10/11: `/research/`-пути ×24**, `A1/A2` ×5, `backlog` ×1. Моя цифра §9 «1 маркер» отозвана (collision по `basename`) | Product `5e2db6f0…`, замер по трём слоям; live-справочник chunk 1: «дословная формула остаётся на HOLD до page-level locator» | **Граница:** «открытый вопрос», «неполный скан», «приоритет поиска» допустимы по S10; пометку `HOLD`, `backlog`, `A/B/C/D`, SHA, «для карты» — дефект по MASTER. **absorbed** в `GBS-PUBLICATION-RESEARCH-SCAFFOLD-READER-LEAK`, новая строка не нужна | `risk` (absorbed) | `verified-at-anchor` | agent-a |
| `AAQ-A-038` | справочник + все слои | C19 / D06 | Полный справочник (6/6 чанков), 84 финальных HTML, 119 исходников, 10/10 live chunk 0 — `????` = **0** на всех пяти поверхностях | `03-CROSS_AGENT_SYNTHESIS.md` §10.2 | `narrowed residual`, **не закрытие** `GBS-BAPTISTS-VISIBLE-COPY-QUESTION-MARK-LOSS`: нужен painted/browser witness; Chromium/Playwright в sandbox отсутствуют | `signal-only` | `verified-at-anchor` (all non-browser surfaces) | agent-a |
| `AAQ-A-039` | 10 baptisty-MDX frontmatter | C17 / C07 / SYS-7 | `readingTime` = 17/24/25/18/21/23/28/27/26/20 = **229 мин**, ровно как на лендинге; задан в **не рендерящемся** MDX-frontmatter и дублируется в конфиге, а не вычисляется из `Body.astro` | Product `5e2db6f0…`, `src/content/articles/*.mdx` frontmatter; `llms.txt` — 90 строк, 0 упоминаний summary | механизм завышения найден; величина ≈1.6–2× к 28 099 словам Body (`AAQ-A-029`) | `risk` | `verified-at-anchor` | agent-a |
| `AAQ-A-040` | внешняя база | C12 / C23 / §4 | **Независимая калибровка.** 6 текстов сильной русской прозы: медиана 20.4 % одно-предложенческих ¶ (у «Войны и мира» 35.7 %), 41.9 % ¶ ≤2, CV 0.91. Проект: 31 % и 41 % — внутри диапазона. Порог агента A «≤10–12 % = FAIL» **не подтверждается**; `C14 = 0` и моя §4 подтверждаются | `victorvwier/russian_literature` @ `main`, tarball sha256 `68b9d10f94df230d…`, фрагменты 45 000 символов со смещения 20 %, разделитель `\n`; `03-CROSS_AGENT_SYNTHESIS.md` §10.4 | Печатная проза XVIII–XIX вв. ≠ веб-лонгрид; база **сравнительная**, снимает ложный порог, но не вводит новый норматив верстки. Требуется owner-решение о едином gate | — | `verified-at-anchor` (supersedes спор §5 п.3) | agent-a |

**Итог группы A:** 40 строк. Активные системные — `AAQ-A-029` (три слоя), `AAQ-A-032` (S17), `AAQ-A-034` (сворачивание), `AAQ-A-037` (SYS-2, absorbed), `AAQ-A-039` (readingTime). Отозваны `AAQ-A-024`, `AAQ-A-025` (уточнена `032`), `AAQ-A-026`. `AAQ-A-040` снимает главный методологический спор в пользу динамической модели.

---

## Шестой проход (2026-11-09): слияние волн 3–4, поправка слоёв, калибровка gate

| ID | Файл / route | Критерий | Что найдено | Доказательство (anchor) | Жанровая поправка | Severity | Статус | Владелец |
|---|---|---|---|---|---|---|---|---|
| `AAQ-A-041` | `????` / 112 HTML | C19 / D06 | **Браузерный witness принят от агента `0b6f34f6`**: headless Chromium 153, 112/112 status 200, 0 `pageerror`, `???`/`??`/внутрисловный `?` = 0 в painted text, outerHTML и атрибутах; все 9 baptist-маршрутов открыты. Итого 6 чистых поверхностей | `arena/0b6f34f6-auditrepo` @ `1cbfa19d`, REPORT §10.2–10.3; мои §10.2, §11.1 | **owner-open**: нет решения владельца, live-release SHA и восстановления строк. Мой raw-HTTP `curl` блокирован, независимой репродукции нет — witness атрибутирован | `signal-only` | `browser-witness-received (external)` | agent-a |
| `AAQ-A-042` | 10 маршрутов, painted | C05 / C20 / SYS-2 / SYS-8 | 19 painted scaffold-элементов / 10 routes (9 C5-HARD + справочник TRIGGER); 15 C20 / 6 routes (только 2 HARD); `Чекy` 1 route только в `@media print`, на screen `elementFromPoint = null`; `lang` 558 missing / 39 routes вместо parse5 515/38; typograf dry-run 6 → 15 файлов в `dist` | там же, REPORT §10.2–10.5 | Подтверждает `AAQ-A-037` и добавляет painted-слой. Разница `lang` — другой фильтр видимости, не регрессия. CDP AX не доказывает TTS voice-switching. Все под existing owners | `risk` (absorbed) | `verified-at-anchor` | agent-a |
| `AAQ-A-043` | 10 baptisty `Body.astro` | C07 / SYS-1 | **«Карта полноты» агента A посчитана по не рендерящемуся MDX.** Live 27 850 слов vs 14 859 (1.87×); ≥2800 → **4/10** вместо 0/10; дефицит **1 952** вместо 13 141; досье→текст 9.6 % вместо 5 %. Архитектура «10 из ~30» верна независимо от слоя | `CORPUS_COMPLETENESS_MAP.md` @ `ab1eb684`; прямой замер 10 `Body.astro` на `5e2db6f0…`; `03-CROSS_AGENT_SYNTHESIS.md` §11.3 | Расхождение `readingTime` 3–6× vs 1.6–2× объясняется делением 229 мин на MDX или на live. У агента A слово «занижено» — оговорка, цифры означают завышение | `risk` | `verified-at-anchor` (уточняет `AAQ-A-029`, `AAQ-A-039`) | agent-a |
| `AAQ-A-044` | 119 исходников | C12 / §4 / gate G1 | 799 H2-разделов, **225 (28.2 %) без развёрнутого ¶**; MDX 159/260 = 61.2 %, `Body.astro` 66/539 = 12.2 %; серия ≥4 коротких ¶ в 31/119 файлах. У классики в 200-словных окнах без развёрнутого ¶ всего 3.2 %, в 500/1000 — 0 % | прямой замер 70 MDX + 49 `Body.astro`; база `victorvwier/russian_literature`, 155/70/35 окон; §11.4 | **G1 корректен и не строже печатной нормы.** G2 ложно сработал бы на 2/5 нехудожественных текстов → оставить триггером. Порог CV 0.75: 2/11 текстов ниже → не gate. Моя пометка §9 «18/70 — MDX-слой» отозвана: это ошибка счётчика агента A | `risk` | `verified-at-anchor` | agent-a |
| `AAQ-A-045` | 4 MDX | C07 / P10 / S19 | **«Маленькая статья при большом материале» напрямую**: <1500 слов и ≥10 внешних URL у `podrostok-za-kadrom-*` (3 файла) и `vzroslyy-rebenok-*` (1 файл); медиана по корпусу 2 220 слов и 0 внешних ссылок | замер слов тела и уникальных внешних URL по 70 MDX; точные имена и числа в §11.6 | Практические серии, не «Баптисты». По `STATUS.md` владелец уже решил «P2 — дефект, супер-маленькие статьи — баг» → без новой строки MASTER; авторство не определяется | `risk` | `verified-at-anchor` | agent-a |
| `AAQ-A-046` | 70 MDX | C06 / S17 / §4 | Агент A пересмотрел owner-решение: «Коротко» **не везде** — обязателен >1500 слов, не нужен <900, 900–1500 по решению редактора. Две реализации: 20 HTML-карточек (10 с 3 пунктами) + 43 markdown `## Коротко` (0 нарушений) + 7 без блока; худшая дыра — 7 крупнейших статей (Lawson 14 515 и др.) | `SUMMARY_BLOCK_DECISION.md`, `SUMMARY_COLLAPSE_RECOMMENDATIONS.md` @ `ab1eb684`; §11.5 | `AAQ-A-030` уточняется (пересмотрено само решение, а не только моя поправка). `AAQ-A-034` подтверждена: `<details>` = 0, есть только рекомендации. Мой ценз 21/22 в final HTML и их 20/70 в MDX — разные слои | `risk` (absorbed) | `verified-at-anchor` | agent-a |
| `AAQ-A-047` | 21 внешний URL | C04 / C22 / H02 | **21/21 живы** (6 + 15), 19 подтверждают приписанное напрямую: Wardin 2009, правенц «Инициативники» т.22, декрет 04.01.1919, приказ №00447 30.07.1937, постановление 08.04.1929, Pashkov Papers GB 150 VP, «Братский Вестник» №1 1945, DHI pacifism, Савин, Батченко, Белякова, inVictory 1966, BWA-статистика | `fetch_page` 2026-11-09, 15 URL; полная таблица в §11.7 | 2 оговорки, не галлюцинации: `thirtyoneeight.org` редиректит и церковь переименована 08.10.2026; `directionjournal.org` — рецензия Dyck 2015 на Pritzkau, а не сам перевод 2013. `his95.narod.ru` — дубль с OCR-огрехами. 21 из ~530, не ценз | `positive` | `verified-at-anchor` | agent-a |
| `AAQ-A-048` | база / парсер | C12 / §4 | Нехудожественная проза (Соловьёв ×2, Белинский, Чернышевский, Горький): медиана 19.0 % 1-предл. ¶, 32.8 % ≤2, CV 0.81, разброс 0–38.7 %. Строки-продолжения 0–1.9 % → «строка = абзац» валиден. Второй корпус `phylodasha/…` — только ноутбук без прозы | `victorvwier/russian_literature` @ main, sha256 `68b9d10f94df230d…`; §11.4 | Подтверждает `AAQ-A-040` на втором жанре. Печатная проза ≠ веб-лонгрид; база сравнительная, не норматив вёрстки. `phylodasha` — тупик, не повторять | — | `verified-at-anchor` | agent-a |

**Итог группы A:** 48 строк. Активные системные — `AAQ-A-029`, `AAQ-A-032`, `AAQ-A-034`, `AAQ-A-037` (absorbed), `AAQ-A-039`, `AAQ-A-041` (owner-open), `AAQ-A-043`, `AAQ-A-044`, `AAQ-A-045`. Отозваны `AAQ-A-024`, `AAQ-A-025`, `AAQ-A-026`, пометка §9 про «18/70». `AAQ-A-040`/`048` снимают спор о коротких абзацах в пользу динамической модели; `AAQ-A-044` даёт владельцу откалиброванный gate G1.
