# Повторный аудит CSS и `!important`

**Проект:** `FedorMilovanov/gb-is-my-strength`  
**Репозиторий аудита:** `FedorMilovanov/AuditRepo`  
**Дата проверки:** 14 июля 2026 года  
**Режим:** только исследование и отчёт; исходный код не изменялся

---

## 1. Проверенная ревизия

### Основной проект

- Ветка: `main`
- Актуальный HEAD на момент проверки:
  `bd8cb9a0b14d8a71a51317ec7b954607337b9e78`
- Дата последнего коммита в GitHub: 13 июля 2026 года
- Последний коммит меняет только пять MDX-файлов с описаниями статей; CSS в нём не менялся.

### AuditRepo

- Ветка: `main`
- Актуальный HEAD:
  `77ae95634f341501531703887738c0676fb4025f`
- Последний коммит относится к входящему отчёту по генеалогическому разделу и не обновляет CSS-аудит.
- Каноническая матрица `MASTER_BUG_MATRIX.md` по-прежнему указывает source HEAD:
  `b8459bdf`.

### Вывод по актуальности матрицы

Каноническая матрица не синхронизирована с текущим `main` проекта. Между её source HEAD `b8459bdf` и текущим `bd8cb9a0…` накопилось много последующих изменений. Поэтому:

1. исторические закрытия нельзя автоматически считать подтверждёнными для текущего HEAD;
2. номера строк и witnesses по CSS требуется перепривязать;
3. старые ratchet-значения нельзя выдавать за текущие фактические счётчики без повторного подсчёта;
4. статус `Deploy GREEN` в шапке матрицы не описывает текущий CI.

**Приоритет процесса:** P2 — SSOT drift.  
**Уверенность:** высокая.

---

## 2. Краткий итог

На текущем HEAD подтверждены четыре существенных вывода.

### 2.1. `site.css` нарушает оба действующих лимита `!important`

Фактический счётчик:

```text
css/site.css: 210
```

Действующие ограничения:

```text
package.json / css:layer:validate: 202
scripts/audit-pro.js:              200
```

Следовательно:

- превышение package ceiling: `210 − 202 = 8`;
- превышение `audit-pro` ceiling: `210 − 200 = 10`.

Это не субъективная оценка и не предупреждение: оба скрипта используют hard-fail при превышении лимита.

**Статус:** подтверждённый release-blocking дефект.  
**Рекомендуемый ID:** `P1-CSS-IMPORTANT-GATE-DRIFT`.

---

### 2.2. В `site.css` остаются невалидные CSS-фрагменты

Полноценный CSS-парсер нашёл четыре синтаксические ошибки. Дополнительно селекторный парсер подтвердил ещё один невалидный selector prelude.

Текущий штатный валидатор этого не видит, поскольку проверяет главным образом:

- арифметический баланс `{` и `}`;
- регулярные выражения;
- буквальный счётчик `!important`.

Сбалансированный по скобкам, но грамматически невалидный CSS проходит эту часть контроля.

---

### 2.3. Массово удалять `!important` небезопасно

Особенно опасны автоматические удаления в:

- `floating-cluster.css`;
- `mobile-hotfix.css`;
- `nagornaya-mobile-toc.css`.

В этих файлах `!important` используется как компенсация:

- порядка подключения таблиц стилей;
- одинаковой или недостаточной специфичности;
- legacy-разметки;
- inline-стилей;
- mobile hotfix-слоя;
- accessibility/reduced-motion override;
- скрытия устаревших дублирующихся контролов.

---

### 2.4. Безопасное механическое сокращение невелико

Точно подтверждены:

- два полных дубликата CSS-правил;
- пять самоповторяющихся `var()` fallback;
- один пустой невалидный блок;
- один низкорисковый кандидат на объединение разделённых деклараций.

Из них только один точный дубль уменьшает число `!important` — на **1**.

---

## 3. Методика

Проверка выполнялась на текущих файлах ветки `main`.

Для восьми CSS-файлов выполнены:

1. точный буквальный подсчёт `!important`;
2. разбор через CSS parser;
3. подсчёт qualified rules, at-rules и деклараций;
4. поиск parser errors;
5. поиск полных дублей;
6. поиск повторяющихся fallback-конструкций;
7. ручная проверка спорных участков каскада.

Для `floating-cluster.css` выполнена ручная построчная проверка важных зон и проверка текущего CI-ratchet. Точный полный счётчик этого файла независимо не зафиксирован в данном отчёте: доступный raw-файл объёмом около 188 KB в среде проверки не удалось получить в машиночитаемом виде целиком. Поэтому значение `524` ниже обозначается только как **настроенный ceiling**, а не как доказанный текущий факт.

Это ограничение указано намеренно: данных для честного точного полного счётчика по девяти файлам нет.

---

## 4. Точный аудит `!important`

### 4.1. Пересчитанные файлы

| Файл | Размер, bytes | Qualified rules | At-rules | Декларации | `!important` | Доля деклараций |
|---|---:|---:|---:|---:|---:|---:|
| `command-palette.css` | 29 902 | 217 | 17 | 899 | **7** | 0,78% |
| `enhancements-runtime.css` | 2 499 | 18 | 2 | 51 | **1** | 1,96% |
| `highlights-runtime.css` | 11 402 | 67 | 6 | 254 | **0** | 0% |
| `home.css` | 82 091 | 640 | 120 | 2 256 | **34** | 1,51% |
| `mobile-hotfix.css` | 19 252 | 109 | 14 | 215 | **142** | **66,05%** |
| `nagornaya-mobile-toc.css` | 21 825 | 133 | 6 | 526 | **135** | **25,67%** |
| `site.css` | 291 092 | 2 260 | 216 | 8 635 | **210** | 2,43% |
| `sw-toast.css` | 1 206 | 7 | 0 | 32 | **0** | 0% |

**Точный subtotal без `floating-cluster.css`: 529.**

Формула полного текущего результата:

```text
529 + фактический текущий счётчик floating-cluster.css
```

Точное второе слагаемое в этом отчёте не подтверждено.

---

### 4.2. Действующие ratchet-ограничения

В `scripts/audit-pro.js` заданы:

| Файл | Hard ceiling | Long-term goal | Подтверждённый текущий счётчик | Состояние |
|---|---:|---:|---:|---|
| `site.css` | 200 | 200 | **210** | **FAIL: +10** |
| `floating-cluster.css` | 524 | 100 | не подтверждён точно | неизвестно |
| `mobile-hotfix.css` | 142 | 0 | **142** | ровно ceiling; долг +142 |
| `nagornaya-mobile-toc.css` | 135 | 50 | **135** | ровно ceiling; долг +85 |

Дополнительно `package.json` запускает:

```json
"css:layer:validate":
  "node scripts/css-layer-validator.js css/site.css --ceiling=202"
```

То есть в одном проекте существуют два разных hard ceiling для одного файла:

```text
site.css package ceiling:   202
site.css audit-pro ceiling: 200
```

Это отдельная конфигурационная рассинхронизация. Даже при снижении с 210 до 202 первый гейт станет зелёным, но `audit-pro.js` всё равно упадёт.

### Точный вывод

Минимальное снижение, необходимое для прохождения обоих гейтов:

```text
210 → 200
```

Нужно безопасно убрать либо архитектурно заменить минимум **10** вхождений `!important`.

Поднимать ceiling нельзя считать исправлением: комментарий в коде прямо говорит, что ratchet может двигаться только вниз, а повышение является регрессией.

---

## 5. Текущий CI

Для HEAD `bd8cb9a0…` на странице Actions видны:

- `Deploy to GitHub Pages #1568` — failed;
- `Metadata & IndexNow Readiness #1330` — failed;
- `Native Source Contract #151` — success.

Публичная страница без авторизации не показывает полный лог упавшего шага. Поэтому утверждать, что **единственной** причиной обоих падений является CSS, нельзя.

При этом CSS-failure воспроизводится логически и детерминированно:

1. deploy workflow запускает `validate:static-publication`;
2. `validate:static-publication` запускает `css:layer:validate`;
3. команда задаёт ceiling `202`;
4. текущий `site.css` содержит `210`;
5. валидатор завершает процесс с ошибкой при `count > ceiling`.

Даже если первый гейт временно обойти, следующий `audit-pro.js` применит ceiling `200` и также завершится ошибкой.

**Вывод:** CSS-контракт сам по себе достаточен для падения статической публикационной цепочки.

---

## 6. Классификация `!important`

Для безопасного сокращения недостаточно удалить директивы по количеству. Сначала каждое использование следует отнести к категории.

### A. Accessibility override

Примеры:

- `prefers-reduced-motion`;
- forced colors;
- отключение transition/animation.

**Политика:** не удалять без эквивалентного правила с гарантированным приоритетом.

### B. Visibility/state override

Примеры:

- скрытие legacy-кнопок;
- переключение панели;
- `.is-open`, `.is-hidden`, `.active`;
- mobile/desktop mutually exclusive controls.

**Политика:** сначала установить владельца состояния и порядок stylesheet.

### C. Cross-stylesheet load-order compensation

В `floating-cluster.css` есть комментарии, объясняющие, что часть `!important` нужна из-за:

- одинаковой специфичности;
- более поздней загрузки Nagornaya stylesheet;
- подтверждённого через CDP неправильного результата без усиления.

**Политика:** удаление допустимо только вместе с исправлением порядка подключения, cascade layers или селекторной архитектуры.

### D. Inline-style override

Если JS или HTML записывает inline-style, обычное правило часто не может его переопределить.

**Политика:** сначала убрать inline-источник либо перейти на класс/атрибут состояния.

### E. Дубликат или случайный технический долг

Полные повторы одного правила могут быть удалены механически.

**Политика:** лучший первый источник безопасного снижения счётчика.

### F. Emergency hotfix layer

`mobile-hotfix.css` содержит `!important` в 66,05% деклараций. Фактически это не обычная таблица компонентов, а слой принудительных переопределений.

**Политика:** не чистить директивы по одной. Нужно переносить законченные блоки в базовые компоненты, после чего удалять соответствующий hotfix целиком.

---

## 7. Невалидный CSS в `site.css`

### CSS-SYNTAX-001 — незавершённое reduced-motion правило

**Byte offset:** `179692`  
**Физическая позиция:** строка 40, колонка 16265

```css
@media (prefers-reduced-motion:reduce){
  .bottom-bar,
  .btoc-link,
  .flip-card-inner,
  .h-article-card,
  .quiz-option
}
```

У списка селекторов отсутствует блок деклараций.

**Последствие:** правило отбрасывается; задуманная reduced-motion защита не применяется.

**Severity:** P2 accessibility.

---

### CSS-SYNTAX-002 — незавершённое prefers-contrast правило

**Byte offset:** `179980`  
**Физическая позиция:** строка 40, колонка 16553

```css
.ehrman-block,
.info-box,
.quote-box
}
```

Список селекторов завершается закрытием media-контекста без `{ declarations }`.

**Последствие:** контрастное оформление этих блоков не применяется.

**Severity:** P2 accessibility.

---

### CSS-SYNTAX-003 — `@supports` приклеен к selector list

**Byte offset:** `201773`  
**Физическая позиция:** строка 50, колонка 13064

```css
.article-title,
.btoc-title,
.gtip-luxury__title,
.pullquote p,
.quiz-launch-label,
.resume-reading-title,
@supports (animation-timeline:scroll()) {
  .reveal { ... }
}
```

At-rule не может быть элементом списка селекторов.

**Последствие:** правило с этим prelude невалидно; scroll-driven reveal может быть полностью отброшен.

**Severity:** P2.

---

### CSS-DEAD-004 — пустое незавершённое правило

**Byte offset:** `203012`  
**Физическая позиция:** строка 50, колонка 14303

```css
@media (hover:hover) and (pointer:fine) {
  html.dark
}
```

**Последствие:** текущего визуального эффекта нет.

**Severity:** P3.

Удаление безопасно относительно текущего поведения, но перед удалением желательно проверить git blame: возможно, здесь потеряны декларации.

---

### CSS-SYNTAX-005 — повреждённый backlinks hover selector

**Byte offset:** `277820`  
**Физическая позиция:** строка 499, колонка 1

```css
.gbx-backlinks__maplink:rgba(122,46,46,0.08);
gbx-backlinks__maplink:hover {
  background: color-mix(...);
  ...
}
```

Подтверждённые проблемы:

- `rgba(...)` интерпретируется как неизвестный псевдокласс;
- точка с запятой находится в selector prelude;
- перед вторым `gbx-backlinks__maplink` отсутствует `.`.

Вероятная история повреждения — потерянное `background:` и повреждённое начало hover-селектора, но это **гипотеза**, а не факт. Восстанавливать правило следует по git history/blame, а не по догадке.

**Последствие:** hover-rule не применяется.

**Severity:** P2.

---

## 8. Почему текущие валидаторы пропускают ошибки

### 8.1. Проверка скобок не является CSS-парсингом

`css-layer-validator.js` выполняет:

```js
if (css[i] === '{') depth++;
else if (css[i] === '}') depth--;
```

Такой тест обнаруживает только числовой дисбаланс скобок. Все пять описанных дефектов могут сохранять общий баланс.

### 8.2. Проверка порядка layer фактически неполная

В комментарии заявлено:

> All `@layer` blocks are in the declared order.

Реализация собирает найденные layer и проверяет, не используется ли незадекларированное имя. Сопоставления фактической последовательности блоков с объявленным порядком нет.

### 8.3. Порог warning расходится с текстом цели

Код предупреждает только при:

```text
layeredPct < 50
```

Но сообщение говорит:

```text
target: ≥80%
```

Между 50% и 79,9% валидатор не выдаёт warning, хотя собственная заявленная цель не достигнута.

### 8.4. Duplicate-selector check не выполняется для `site.css`

Проверка запускается только когда:

```js
css.length < 250000
```

Текущий `site.css` имеет:

```text
291092 bytes
```

Следовательно, duplicate-selector heuristic для главного файла намеренно пропускается.

### 8.5. `css:layer:validate` проверяет только один файл

Команда из `package.json` передаёт только:

```text
css/site.css
```

Остальные таблицы не получают:

- grammar validation;
- layer validation;
- selector validation;
- этот duplicate-selector анализ.

### 8.6. `audit-pro.js` также использует простой brace balance

Он расширяет охват файлов и проверяет ratchet, но не заменяет полноценный CSS parser.

### Итог по валидатору

Открытый в матрице пункт D-2 подтверждён и должен быть расширен. Это уже не теоретическая слабость: в текущем `site.css` имеются реальные witnesses, которые проходят существующую структурную проверку.

---

## 9. Что можно безопасно сократить

### 9.1. Полный дубль в `site.css`

Правило:

```css
html{scroll-behavior:smooth}
```

Найдено дважды:

- строка 2, колонка 1;
- строка 10, колонка 4600.

Удаление одного экземпляра не меняет каскад.

- экономия: около **28 bytes**;
- уменьшение `!important`: **0**;
- риск: минимальный.

---

### 9.2. Полный дубль в `nagornaya-mobile-toc.css`

Правило:

```css
html.dark body.nagornaya-page .summary-card{
  border-top-color:rgba(245,213,166,.16)!important
}
```

Найдено дважды в минифицированной первой строке:

- колонка 11660;
- колонка 14224.

Удаление одного экземпляра не меняет итоговое computed value.

- экономия: около **93 bytes**;
- уменьшение `!important`: **1**;
- текущий счётчик после удаления: `135 → 134`;
- риск: минимальный.

Это единственное независимо подтверждённое механически безопасное снижение `!important` в текущем проходе.

---

### 9.3. Самоповторяющиеся CSS variable fallback

В `nagornaya-mobile-toc.css`:

```css
var(--color-text,var(--color-text,#1a1a1a))
```

встречается **3 раза** и эквивалентно:

```css
var(--color-text,#1a1a1a)
```

Также:

```css
var(--color-text-muted,var(--color-text-muted,#78716c))
```

встречается **2 раза** и эквивалентно:

```css
var(--color-text-muted,#78716c)
```

- суммарная экономия: около **102 bytes**;
- уменьшение `!important`: **0**;
- риск: минимальный.

---

### 9.4. Пустой невалидный блок

```css
@media (hover:hover) and (pointer:fine){html.dark }
```

Браузер уже игнорирует его. Удаление не меняет текущее поведение.

- риск для текущего rendering: минимальный;
- риск потери первоначального замысла: существует;
- перед удалением: проверить blame/history.

---

### 9.5. Разделённые декларации одного селектора

В `enhancements-runtime.css` селектор:

```css
.btoc-seg.is-done .btoc-seg-fill
```

объявлен двумя соседними блоками: один задаёт `transform`, другой — `background` и `opacity`.

Их можно объединить, только сохранив то же положение относительно соседних правил.

- сокращение: небольшое;
- уменьшение `!important`: 0;
- риск: низкий, но не нулевой.

---

### Итого механически безопасного cleanup

Подтверждённая минимальная экономия только от дублей и `var()`:

```text
≈223 bytes
```

Подтверждённое уменьшение `!important`:

```text
1
```

После такого cleanup проблема `site.css 210 > 200` останется полностью нерешённой.

---

## 10. Что нельзя сокращать автоматически

Нельзя делать global replace `!important → ""`.

Нельзя без визуальной и функциональной проверки:

1. удалять `!important` из reduced-motion/forced-colors;
2. чистить `mobile-hotfix.css` по отдельным строкам;
3. переносить правила между файлами без сохранения порядка загрузки;
4. объединять одинаковые селекторы из разных media/context;
5. удалять первый `rgba()` перед `color-mix()` — это может быть fallback;
6. заменять все числовые `z-index` токенами без сравнения значений;
7. унифицировать `767/768/769` глобальной заменой;
8. убирать правила, скрывающие legacy-контролы, пока legacy DOM существует;
9. удалять директивы, перекрывающие inline-style, без исправления JS/HTML;
10. поднимать ratchet-ceiling вместо устранения новых директив.

---

## 11. Реалистичная стратегия снижения `site.css` с 210 до 200

Безопасный путь состоит не в поиске первых десяти совпадений.

### Шаг 1 — построить реестр 210 директив

Для каждой записать:

- selector;
- property;
- media/supports/layer context;
- предыдущее competing rule;
- файл и порядок загрузки;
- причина необходимости;
- страницы, на которых она реально матчится.

### Шаг 2 — искать кандидатов в таком порядке

1. точные дубли;
2. rules, у которых нет конкурирующей декларации;
3. rules, где селектор уже имеет более высокую специфичность;
4. obsolete route selectors;
5. legacy overrides для удалённого DOM;
6. adjacent duplicate state rules;
7. директивы, которые можно заменить одним scoped parent selector;
8. директивы, необходимость которых исчезла после перехода в `@layer`.

### Шаг 3 — проверять удаление одной логической группой

Минимальный набор viewport:

- 320;
- 360;
- 390;
- 768;
- 900;
- 1024;
- 1440 px.

Минимальный набор состояний:

- light/dark;
- hover/no-hover;
- reduced-motion;
- forced-colors;
- открытая/закрытая панель;
- focus-visible;
- keyboard navigation;
- mobile bottom bar;
- Nagornaya pages;
- Gill pages;
- legacy pages;
- Astro-owned pages.

### Шаг 4 — уменьшить оба ceiling синхронно

После реального снижения счётчика до 200:

```text
package.json: --ceiling=200
audit-pro.js: IMPORTANT_CEIL=200
```

Они должны иметь один источник конфигурации, а не две независимые цифры.

---

## 12. Глубокий вывод по отдельным CSS-файлам

### `site.css`

- самый большой файл из независимо разобранных;
- 291 KB;
- 8 635 деклараций;
- 210 `!important`;
- четыре parser errors плюс один invalid selector;
- нарушает оба CI ceiling;
- duplicate heuristic штатного валидатора пропускается из-за размера.

**Приоритет:** P1.

### `mobile-hotfix.css`

- 142 `!important` на 215 деклараций;
- 66,05% деклараций принудительные;
- счётчик ровно равен hard ceiling;
- long-term goal = 0.

Это архитектурный индикатор, а не просто стилистическая проблема. Файл должен уменьшаться блоками после переноса окончательных правил в владельцев компонентов.

**Приоритет:** P2 debt, высокий regression risk.

### `nagornaya-mobile-toc.css`

- 135 `!important` на 526 деклараций;
- 25,67%;
- ровно hard ceiling;
- подтверждён один безопасный duplicate;
- после его удаления можно зафиксировать новый ceiling 134.

**Приоритет:** P2 debt; есть немедленный безопасный ratchet-down на 1.

### `floating-cluster.css`

- около 188 KB и 4 464 физических строк по GitHub;
- configured ceiling 524, goal 100;
- точный текущий счётчик независимо не подтверждён;
- ручная проверка показывает документированные причины части директив;
- файл нельзя чистить массово.

**Приоритет:** P2 architectural hotspot.

### `home.css`

- 34 `!important`;
- доля 1,51%;
- существенно меньше hotfix-файлов;
- требует route-specific проверки, но не выглядит главным источником текущего gate failure.

### Runtime-файлы

- `command-palette.css`: 7;
- `enhancements-runtime.css`: 1;
- `highlights-runtime.css`: 0;
- `sw-toast.css`: 0.

Это не приоритетная зона сокращения. Потенциальный выигрыш мал, а риск регрессии интерактивных runtime-компонентов может быть несоразмерным.

---

## 13. Что обновить в `MASTER_BUG_MATRIX.md`

### Добавить новый P1

```text
P1-CSS-IMPORTANT-GATE-DRIFT
site.css has 210 !important.
package css:layer ceiling = 202.
audit-pro ceiling = 200.
validate:static-publication deterministically fails.
```

### Расширить D-2

Добавить witnesses:

- четыре parser errors в `site.css`;
- invalid `:rgba(...)` selector;
- arithmetic brace balance не проверяет грамматику;
- layer order фактически не сопоставляется;
- warning threshold 50% расходится с target 80%;
- duplicate selector check пропускает файлы ≥250000 chars;
- package command валидирует только `site.css`.

### Добавить P2 SSOT drift

```text
Matrix source HEAD: b8459bdf
Current project HEAD: bd8cb9a0...
```

Шапка `Deploy GREEN` должна отражать актуальную ревизию либо явно называться historical baseline.

### Добавить P3 cleanup

- дубль `html{scroll-behavior:smooth}`;
- дубль Nagornaya summary-card;
- nested `var()` fallback;
- пустой `html.dark` fragment.

### Перепроверить исторические CSS-пункты

Необходимо заново воспроизвести на текущем HEAD:

- `BUG-011` про 23 breakpoint;
- D-4 про magic `z-index`;
- строки о CSS budget;
- старые ratchet-счётчики;
- любые line-based witnesses из `floating-cluster.css`.

---

## 14. Приоритетный порядок исправлений

Этот отчёт не вносит изменения. Для последующей работы рекомендуемый порядок:

### P1 — восстановить publish contract

1. выяснить, какие последние изменения подняли `site.css` с ratchet 200 до 210;
2. по git diff/blame выделить именно десять новых директив;
3. не трогать исторические accessibility и legacy overrides;
4. заменить либо безопасно удалить новые десять;
5. унифицировать ceiling на 200;
6. прогнать `validate:static-publication`.

### P2 — восстановить грамматическую валидность

1. через history восстановить reduced-motion declarations;
2. восстановить prefers-contrast declarations;
3. отделить `@supports` от selector list;
4. восстановить backlinks hover;
5. решить судьбу пустого `html.dark`.

### P2 — усилить CI

1. добавить настоящий CSS parser;
2. валидировать все core stylesheets;
3. не пропускать большие файлы;
4. проверять selector grammar;
5. вынести ratchet-конфигурацию в один JSON/JS source;
6. запускать проверку и на source, и на итоговом CSS в `dist`.

### P3 — безопасный cleanup

1. удалить два полных дубля;
2. упростить пять fallback;
3. уменьшить Nagornaya ceiling `135 → 134`;
4. объединить соседние split rules после smoke test.

---

## 15. Итоговый вердикт

### Подтверждено с высокой уверенностью

- актуальный HEAD проекта — `bd8cb9a0b14d8a71a51317ec7b954607337b9e78`;
- AuditRepo не обновлял CSS-матрицу под этот HEAD;
- `site.css` содержит ровно **210** `!important`;
- это превышает оба hard ceiling — 202 и 200;
- текущая publication chain детерминированно не может пройти оба CSS-гейта;
- `site.css` содержит как минимум пять невалидных/мёртвых фрагментов;
- штатные валидаторы не выполняют полноценный grammar parse;
- `mobile-hotfix.css` и `nagornaya-mobile-toc.css` находятся ровно на своих ceiling;
- безопасный механический cleanup уменьшает `!important` только на **1**;
- массовое удаление директив небезопасно.

### Не подтверждено

- точное текущее число `!important` в `floating-cluster.css`;
- единственная причина падения всех текущих workflow;
- первоначальные декларации в повреждённых accessibility-блоках;
- точное авторское намерение повреждённого backlinks selector.

Для этих пунктов в отчёте не сделано неподтверждённых утверждений.

---

## 16. Воспроизводимые команды

После локального клонирования актуального репозитория:

```bash
git rev-parse HEAD

grep -o '!important' css/site.css | wc -l
grep -o '!important' css/floating-cluster.css | wc -l
grep -o '!important' css/mobile-hotfix.css | wc -l
grep -o '!important' css/nagornaya-mobile-toc.css | wc -l

npm run css:layer:validate
node scripts/audit-pro.js
npm run validate:static-publication
```

Более надёжный literal-count через Node:

```bash
node - <<'NODE'
const fs = require('fs');
for (const file of [
  'css/site.css',
  'css/floating-cluster.css',
  'css/mobile-hotfix.css',
  'css/nagornaya-mobile-toc.css'
]) {
  const css = fs.readFileSync(file, 'utf8');
  const count = (css.match(/!important\b/g) || []).length;
  console.log(file, count);
}
NODE
```

Для grammar validation следует использовать CSS parser, а не только баланс скобок.

---

## 17. Источники

### Основной репозиторий

- https://github.com/FedorMilovanov/gb-is-my-strength
- https://github.com/FedorMilovanov/gb-is-my-strength/commit/bd8cb9a0b14d8a71a51317ec7b954607337b9e78
- https://github.com/FedorMilovanov/gb-is-my-strength/blob/bd8cb9a0b14d8a71a51317ec7b954607337b9e78/package.json
- https://github.com/FedorMilovanov/gb-is-my-strength/blob/bd8cb9a0b14d8a71a51317ec7b954607337b9e78/scripts/css-layer-validator.js
- https://github.com/FedorMilovanov/gb-is-my-strength/blob/bd8cb9a0b14d8a71a51317ec7b954607337b9e78/scripts/audit-pro.js
- https://github.com/FedorMilovanov/gb-is-my-strength/blob/bd8cb9a0b14d8a71a51317ec7b954607337b9e78/css/site.css
- https://github.com/FedorMilovanov/gb-is-my-strength/blob/bd8cb9a0b14d8a71a51317ec7b954607337b9e78/css/floating-cluster.css
- https://github.com/FedorMilovanov/gb-is-my-strength/actions

### AuditRepo

- https://github.com/FedorMilovanov/AuditRepo
- https://github.com/FedorMilovanov/AuditRepo/commit/77ae95634f341501531703887738c0676fb4025f
- https://github.com/FedorMilovanov/AuditRepo/blob/main/projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md
