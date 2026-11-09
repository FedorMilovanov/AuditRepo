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
