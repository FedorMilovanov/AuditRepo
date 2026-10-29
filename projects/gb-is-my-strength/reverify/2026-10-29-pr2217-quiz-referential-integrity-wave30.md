# PR #2217: целостность learning quiz — широкая волна 30

**Дата:** 2026-10-29  
**Product base:** `54877be73a590b1e29f4d701724b39ed41c17e14`  
**Проверенный PR head:** `36066273b6e06f0c156a31531cf551ebfce98bf5`  
**Граница:** detached read-only checkout; все контролируемые мутации восстановлены, tracked Product diff отсутствует.

## Текущий пакет здоров

Полностью проверены 30 вопросов `APOSTASY_LEARNING_QUIZ`:

- 30 уникальных `id`;
- ровно шесть вопросов на каждую из пяти частей;
- каждый `relatedPageId` совпадает с реальным item/page id серии;
- все 30 `sourceHref` ведут на существующий `id` в production-like HTML;
- каждый вопрос имеет четыре ответа и допустимый `correctIndex`;
- runtime Fisher–Yates перемешивает и порядок вопросов, и порядок ответов, поэтому преобладание `correctIndex: 0` в source не создаёт предсказуемую первую кнопку;
- после восстановления exact source все пять страниц снова сериализуют по шесть вопросов.

Следовательно, новый current-data defect не найден и не добавляется.

## Подтверждённый системный пробел

Shared `SeriesQuizItem` является alias на `GillLearningQuizItem`, где `relatedPageId` ограничен Gill-specific union. Новая серия вынуждена:

1. объявить собственный интерфейс с `relatedPageId: string`;
2. передать весь массив через `as unknown as SeriesQuizItem[]`.

`defineSeriesConfig()` подробно валидирует items/pages/shape/TOC, но вообще не валидирует `cfg.quiz`: нет проверки уникальности id, принадлежности `relatedPageId` серии, разрешимости `sourceHref`, связи с route/anchor или полноты распределения вопросов по страницам.

## Контролируемые negative probes

### 1. Неразрешимый source anchor

У первого вопроса временно заменён:

```text
#odno-slovo → #definitely-missing-anchor
```

Результат:

- `npm run engine:contracts` — PASS;
- Astro build — PASS, 111 pages;
- несуществующий fragment сериализован в final HTML и был бы показан читателю как source link.

### 2. Опечатка в одном relatedPageId

Один корректный page id временно заменён на `definitely-not-a-series-page`.

Результат:

- `engine:contracts` — PASS;
- Astro build — PASS;
- вопрос тихо исчез из своей части: final quiz pool стал 5 вместо 6.

Это не только compile-time слабость. `GillLearningSheet` фильтрует вопросы по строке и не сообщает о потерянной записи.

### 3. Три опечатки активируют чужой fallback

Три первых `relatedPageId` временно сделаны неразрешимыми. Локальный pool части стал меньше четырёх, после чего runtime-код выполнил:

```text
quizPool.length >= 4 ? quizPool : seriesPool
```

Результат при тех же зелёных contracts/build:

- на странице части I сериализованы все 30 вопросов;
- 27 из 30 относятся к другим частям.

Таким образом, один класс ошибки имеет два различных тихих результата: небольшая потеря вопросов или внезапная подмена page-specific теста общесерийным пулом.

После каждого probe файл восстановлен и `git diff --exit-code` прошёл. Финальная rebuild-проверка снова получила 6/6/6/6/6.

## Причины

| Причина | Свидетельство |
|---|---|
| Shared type design | Общий тип жёстко связан с Gill page-id union вместо generic `SeriesQuizItem<PageId>`. |
| Agent workaround | `as unknown as` снимает единственную compile-time защиту для всего массива. |
| Runtime/gate gap | `defineSeriesConfig` и `engine:contracts` не читают quiz referential integrity. |
| Fail-open fallback | Менее четырёх совпавших вопросов заменяются всем seriesPool без диагностического сигнала. |
| Текущая ошибка данных | Не подтверждена: все 30 записей exact head корректны. |

## Необходимая системная защита

Не нужен новый prose-чеклист. Нужна одна типизированная quiz-граница в существующем publication contract:

1. generic `SeriesQuizItem<PageId extends string>` или вывод PageId из `config.items`, без `unknown` cast;
2. `defineSeriesConfig` требует уникальные quiz id, четыре непустых ответа, допустимый correctIndex, непустые question/explanation/sourceLabel;
3. каждый `relatedPageId` обязан разрешаться в navigable item с `pages[id]`;
4. каждый локальный `sourceHref` обязан вести на route этой серии и существующий final anchor;
5. page-specific minimum/fallback должен быть явно объявленной политикой; потеря записей из-за неразрешимого id обязана быть ошибкой, а не переключателем на весь pool;
6. negative fixtures фиксируют оба доказанных сценария: broken fragment и misrouted page id.

Это расширение существующего `SYS-CONTENT-AUTHORING-PUBLICATION-CONTRACT`, а не новая отдельная system lane: quiz — ещё один типизированный payload атомарной публикации.

**Широкая волна 30 завершена.**
