# Reader measure persistence × capacity matrix — 2026-10-27

## Решение

На том же exact Product anchor `21dcfdd9f9018607a708c5118383e287ec1a3fed` выполнена следующая bounded-волна после cold first-paint census: полный cold reload matrix для reader measure на всех 105 index routes.

Результат не создаёт нового owner:

- persistence и native controls работают: выбранное значение сохраняется и восстанавливается;
- однако observable geometry массово не соответствует трём подписанным состояниям;
- exact 1024px transition полностью поглощает `narrow/normal/wide` одним capacity layout;
- выше transition shared routes различают только `narrow`, а `normal` и `wide` остаются aliases;
- семь Teen routes локально сохраняют более широкую колонку, но alias всех трёх значений.

Это совместное продолжение двух существующих строк:

- `GBS-READER-MEASURE-DESKTOP-ALIAS-AND-BREAKPOINT-REGRESSION`;
- `GBS-SERIES-READER-COMPACT-DESKTOP-CAPACITY-CONFLICT`.

Новых строк и изменения active arithmetic нет.

Машинное резюме: `evidence/2026-10-27-reader-measure-persistence-capacity-matrix.jsonl`.

## 1. Baseline и метод

- Product `main`: `21dcfdd9f9018607a708c5118383e287ec1a3fed`.
- Чистый `npm ci`: 490 packages; известная moderate advisory, зависимости не изменялись.
- `npm run strangler:build:production-like`: PASS.
- Astro check: 625 files, 0 errors, 0 warnings, 6 hints; build: 104 Astro pages и 108 финальных HTML.
- Chromium 153 через `@sparticuz/chromium`; service workers отключены; external egress блокировался.

Полная матрица:

- 105 index routes;
- 390, 960, 1023, 1024, 1280 и 1600px при высоте 900px;
- default, persisted `narrow`, persisted `normal`, persisted `wide`;
- Light, reduced motion, DPR1;
- **2 520 уникальных route/width/measure records**.

После bounded retry финальный ключевой набор имеет:

- navigation/evaluation errors: 0;
- неправильный `data-reader-measure`: 0;
- неправильное persisted значение для explicit states: 0;
- page errors: 0;
- значимые console errors: 0;
- завершённые broken images: 0.

Первичные raw streams, зависимости и PNG оставлены вне Git. В Git записано только компактное агрегированное доказательство.

## 2. Какая поверхность действительно меняет reader shell

У 63 routes на 1023px три состояния дают каноническую тройку settled `.page-wrap`:

- `narrow`: 672px;
- `normal`: 800px;
- `wide`: 928px.

Состав этой группы по URL surface:

- `/articles/`: 47;
- `/baptisty-rossii/`: 10;
- `/hard-texts/`: 6.

Из 63 routes семь принадлежат Teen family и имеют локальный desktop capacity override; остальные 56 используют shared compact-desktop geometry.

Остальные документы полного 105-route corpus сохранены как отрицательный/control scope. Они не превращались в reader defects только потому, что глобальный HTML attribute присутствует.

## 3. Полная settled geometry matrix

| Width | 56 shared routes: N / M / W | 7 Teen routes: N / M / W | Disposition |
|---:|---:|---:|---|
| 390 | 312 / 358.8 / 390 | 312 / 358.8 / 390 | три состояния различимы |
| 960 | 768 / 820 / 820 | 768 / 820 / 820 | `normal = wide` |
| 1023 | 672 / 800 / 928 | 672 / 800 / 928 | три состояния различимы |
| 1024 | 492.7 / 492.7 / 492.7 | 696.7 / 696.7 / 696.7 | все три состояния aliases |
| 1280 | 672 / 702.9 / 702.9 | 820 / 820 / 820 | shared `normal = wide`; Teen aliases ×3 |
| 1600 | 672 / 760 / 760 | 820 / 820 / 820 | shared `normal = wide`; Teen aliases ×3 |

Таким образом, 1023→1024 является не только отрицательным скачком capacity. На 1024 выбор пользователя перестаёт иметь observable effect на shell сразу на всех 63 применимых routes.

## 4. Root-cause ownership

### 4.1 Shared 56 routes

В `css/floating-cluster.css` base desktop owner задаёт:

```css
--gb-measure:min(var(--gb-reader-measure), 760px, calc(100vw - 48px));
```

Но на 64–99.99em более поздний compact owner заменяет его:

```css
--gb-measure:min(
  var(--gb-reader-measure),
  calc(100vw - var(--gb-rail-reserve) - 204px)
);
```

При 1024px доступная capacity равна примерно 492.7px и меньше всех трёх reader measures. Поэтому signed states корректно меняют token и persistence, но дают один shell.

При 1280px capacity около 702.9px: `narrow` ещё различим, а `normal` и `wide` оба упираются в capacity. При 1600px compact rule заканчивается, но base cap 760px снова объединяет `normal` и `wide`.

### 4.2 Teen 7 routes

`TeenSeriesArticlePage.astro` отдельно задаёт desktop shell:

```css
width: min(820px, calc(100% - var(--gb-rail-reserve)));
max-width: calc(100% - var(--gb-rail-reserve));
```

Правило не использует reader measure. Поэтому семь Teen routes дают один размер для всех трёх состояний:

- 696.7px на 1024;
- 820px на 1280 и 1600.

Это тот же известный trade-off: локальный bypass избегает 492.7px collapse, но одновременно отключает signed width choice и сохраняет отдельного layout owner.

## 5. Native click → persist → reload

Отдельно проверены два representative routes:

- shared Gill: `/articles/dzhon-gill-chast-1-chelovek/`;
- Teen: `/articles/podrostok-za-kadrom-chto-delat-tserkvi/`.

На каждом выполнены native clicks по видимым controls `Узкая / Обычная / Шире` при 1023, 1024, 1280 и 1600px. После каждого клика выполнялся настоящий document reload.

Итого **24/24 click→reload transitions**:

- `aria`/control event меняет canonical state;
- `data-reader-measure` соответствует выбору;
- `gb:reader-preferences:v1.measure` соответствует выбору;
- после reload значение сохраняется;
- settled geometry после reload воспроизводит таблицу выше.

Значит, finding нельзя закрыть только ремонтом storage или controls: они уже работают. Необходим единый capacity/measure policy, делающий предложенные состояния наблюдаемо различимыми либо честно отключающий недоступные варианты.

## 6. Visual, a11y и runtime control

Для двух representative routes × четырёх widths сохранены и вручную просмотрены 8 viewport screenshots. Дополнительный targeted результат:

- Axe WCAG 2 A/AA + 2.1 A/AA: 0 violations во всех 8 profiles;
- page/значимые console errors: 0;
- broken images: 0;
- LCP: 324–508ms на локальном production-like build;
- final reload CLS: 0.000146–0.056773.

Эти показатели не отменяют geometry defect: они доказывают, что измеренная aliasing/capacity семантика не является следствием сломанной загрузки, forced click или ошибочного документа.

## 7. Cold CLS по канонической группе

На 63 применимых routes при 1023px:

| State | Median CLS | CLS ≥0.1 |
|---|---:|---:|
| narrow | 0.193057 | 62/63 |
| normal | 0.123469 | 63/63 |
| wide | 0.059413 | 13/63 |

Это расширяет предыдущий default/no-font census: поздняя route-root проекция зависит и от сохранённого state. `wide` уменьшает амплитуду full-width→settled перехода, но не исправляет отсутствие first-paint token parity.

## 8. Closure additions

### Reader measure owner

Closure должна проверять не только изменение token/storage, но и различимую settled geometry:

- 390/960/1023/1024/1280/1600;
- shared и Teen representatives;
- native click → persist → real reload;
- cold first rect = settled rect;
- каждое доступное signed state отличается либо UI явно сообщает, что состояние недоступно;
- без timeout, opacity cloak и forced click.

### Compact capacity owner

Closure должна проверять совместно:

- 1023→1024 без отрицательного measure collapse;
- один owner для rail reserve, control corridor и reader measure;
- отсутствие полного alias N/M/W на exact 1024;
- удаление Teen bypass только через shared composition;
- отсутствие prose/control overlap после обычного scroll.

## 9. Матрица

Active arithmetic остаётся:

- 46 direct defects;
- 8 verified improvements;
- 22 system lanes;
- **76 active work units**.

Product не изменялся.
