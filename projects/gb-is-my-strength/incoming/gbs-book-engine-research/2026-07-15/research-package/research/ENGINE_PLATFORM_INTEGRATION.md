# Встраивание всей платформы движков в gb-is-my-strength

**Цель:** не создать ещё один UI-фреймворк, а углубить существующие движки и сделать книжную модель штатной формой series engine.

## 1. Итоговая таксономия

На уровне runtime остаются **три движка**:

| Engine | Desktop | Mobile | Примеры |
|---|---|---|---|
| `series` | `GillSeriesChrome` + series rail | `MobileChromeShell engine="series"` | Гилл, Сердце, Баптисты, pastor-series |
| `article` | `ReaderRail` + `ReaderSettings` | `MobileChromeShell engine="article"` | Герменевтика, Код да Винчи |
| `page` | секционный `*PageChrome` без reader rail | `MobileChromeShell engine="page"` | `/articles/`, `/biografii/`, `/hard-texts/`, `/karty/`, `/konfessii/` |

**Книга — не четвёртый engine.** Это `series.shape = 'book'` внутри series engine:

```text
series / flat:  форзац → часть I → часть II → справочник
series / book:  форзац → глава I → статья 1 → её H2/H3 → статья 2 → ...
```

Так PlayEmber, настройки, темы, sheets, safe-area, Help и прогресс остаются общими.

---

## 2. Матрица интерфейсов

### 2.1 Desktop · обычная серия (`series/flat`)

- Тёмный series rail.
- Форзацы `label`.
- Римские части — реальные страницы.
- В карточке текущей части — H2/H3 этой части и scrollspy.
- Угловой кластер: sun/moon → search → canonical PlayEmber → save.
- Настройки открываются у нижнего toolbar рельса.

**Существующие точки:**

- `GillSeriesChrome.astro`;
- `GillSeriesRail.astro`;
- `GillSeriesOverlay.astro`;
- `GillPartTocOverlay.astro`;
- `GillReaderSettingsSheet.astro`.

### 2.2 Desktop · книга (`series/book`)

Тот же chrome, но навигация трёхуровневая:

```text
Глава I
  1. Статья
     I. Раздел
       Подраздел
     II. Раздел
  2. Статья
  ...
```

Правила:

1. Глава — группа, не маршрут.
2. Статья — полноценный route с собственным `pages[articleId].partToc`.
3. Текущая статья раскрыта сразу.
4. Любая статья раскрывает своё оглавление; одновременно раскрыта одна статья внутри главы.
5. Scrollspy синхронизирует desktop rail и book sheet.
6. Prev/next проходит по статьям, включая границу главы.
7. Прогресс хранится в трёх величинах: книга, статья, текущий раздел.

### 2.3 Desktop · одиночная статья (`article`)

- `ReaderRail`, а не Gill rail.
- Только H2/H3 текущей статьи.
- Один прогресс.
- Никаких римских series marks, chapter count или Series TOC.
- Тот же canonical PlayEmber и sun/moon.
- `ReaderSettings` применяется к `[data-reader-root]`.

### 2.4 Desktop · обычная страница (`page`)

- Нет reader rail.
- Нет fake progress, Help, TTS или Save article.
- Сохраняется собственный desktop layout каталога/лендинга.
- Глобальный поиск вызывает существующий `GBSearch`, второй search runtime не создаётся.

---

## 3. Mobile

Общий структурный shell уже существует:

```text
MobileChromeShell.astro
mobileChromeTypes.ts
mobileChromeRegistry.ts
```

### 3.1 `series/flat`

```text
Top:    Back · Home · Справка/Speed · PlayEmber · Save
Bottom: Dual progress · Current part/section · Theme · Settings · Share
Sheets: Series TOC · Part TOC · Help · Settings
```

### 3.2 `series/book`

```text
Top:    Back · Home · Справка/Speed · PlayEmber · Save
Bottom: Book+article progress · Current chapter/article/section · Theme · Settings · Share
Sheets: Book TOC · nested Article TOC · Help · Settings · queue player
```

Book sheet:

- Roman chapter rows;
- Arabic article rows;
- article row has chevron;
- nested H2/H3 uses its own thin progress line;
- centres of nodes and lines derive from one axis token;
- current article and current section are expanded/highlighted.

### 3.3 `article`

```text
Top:    Back · optional Home · Справка/Speed · PlayEmber · Save
Bottom: Single progress · Current section · Theme · Settings · Share
Sheets: Article TOC · Help · Settings
```

Запрещено переносить из series:

- dual series progress;
- Series/Book TOC;
- marks;
- `часть N из M`.

### 3.4 `page`

```text
Top: Back · Home · Global Search · optional real page action
Bottom: отсутствует по умолчанию
```

Запрещены Help/TTS/fake progress без контента и явного контракта.

---

## 4. Как посадить без форка компонентов

### Этап A — закрыть текущий красный main

1. Расширить `SeriesMark.astro` новым `arabic` или типобезопасно сузить top-level mark.
2. Перегенерировать editorial registry для 18 маршрутов Сердца.
3. `npm run astro:check` должен стать зелёным до визуального rollout.

### Этап B — закрепить shape

В `seriesConfig.ts` добавить явное поле:

```ts
shape?: 'flat' | 'book'; // default = flat
```

Существующие `tier:'chapter'` и `mark.kind:'arabic'` сохраняются. `shape` не дублирует данные — он делает branching декларативным и проверяемым.

Validator обязан проверять:

- chapter не имеет `pages[chapterId]`;
- chapter не пуста;
- article parent существует и является chapter;
- Arabic number последовательный внутри chapter;
- у каждой статьи есть page data и непустой `partToc`;
- якоря `partToc` существуют в статье;
- flat series не содержит chapter/article hierarchy.

### Этап C — один recursive renderer

Не создавать `BookRail.astro` копированием Gill rail.

Вынести только data renderer, например:

```text
SeriesTree.astro
  ├─ frontmatter row
  ├─ flat part row
  └─ chapter row
       └─ article row
            └─ article partToc rows
```

Он используется двумя поверхностями:

- desktop `GillSeriesRail`;
- `GillPartTocOverlay` / Book TOC sheet.

Геометрия различается CSS-контекстом, данные и current/progress state — общие.

### Этап D — Help, Play, Settings

- Использовать `PlayEmber.astro`, не рисовать ещё один play.
- Ring contract: `r=45`, circumference `283`, stroke `1.5`.
- Sun/moon — разметка `SingleArticleCluster.astro`/v2.9.
- «Справка» остаётся существующим `GillLearningSheet`, меняются label и SVG.
- Настройки остаются `GillReaderSettingsSheet`/`ReaderSettings`; border-only treatment задаётся scoped CSS, не новым sheet-компонентом.
- Queue player — состояние поверх общего TTS controller; не второй audio runtime.

### Этап E — обычные страницы

Расширять только registry:

```ts
'/articles/':   { engine:'page', adapter:'default-page', mount:'registry' }
'/biografii/':  { engine:'page', adapter:'default-page', mount:'registry' }
```

Исключения `/map/`, `/izbrannoe/` сохраняются, пока их собственная навигация не будет специально мигрирована.

---

## 5. Файлы оригинального проекта

### Меняются

```text
src/components/article-pilots/_shared/series/seriesConfig.ts
src/components/article-pilots/gill-series/SeriesMark.astro
src/components/article-pilots/gill-series/GillSeriesRail.astro
src/components/article-pilots/gill-series/GillSeriesOverlay.astro
src/components/article-pilots/gill-series/GillPartTocOverlay.astro
src/components/article-pilots/gill-series/GillSeriesMobileBar.astro
src/components/article-pilots/gill-series/GillLearningSheet.astro
src/components/article-pilots/gill-series/GillReaderSettingsSheet.astro
css/floating-cluster.css
js/floating-cluster-controller.js
scripts/check-engine-contracts.js
scripts/engine-sweep.mjs
data/editorial-metadata.json
```

### Переиспользуются без форка

```text
MobileChromeShell.astro
mobileChromeTypes.ts
mobileChromeRegistry.ts
PlayEmber.astro
SingleArticleCluster.astro
ReaderRail.astro
ReaderSettings.astro
```

### Не создавать

```text
book-engine.css
book-engine.js
BookPlayEmber.astro
BookSettings.astro
BookMobileBar.astro
```

Они породят второй runtime и дрейф.

---

## 6. Data flow

```text
SeriesConfig
  ↓ validate at build time
Series tree projection
  ├─ desktop rail
  ├─ mobile/desktop TOC sheet
  ├─ prev/next
  ├─ progress denominators
  └─ TTS queue

Page partToc
  ↓
article sections
  ├─ rail nested TOC
  ├─ sheet nested TOC
  └─ scrollspy/progress
```

Один `currentArticleId` и один `currentSectionId` должны управлять всеми поверхностями.

---

## 7. Обязательные engine contracts

### Static

- book = shape series, а не новый `MobileChromeEngine`;
- каждый chapter/article relationship валиден;
- top-level renderer не получает `arabic`;
- каждый article имеет TOC;
- Play только через `.gb-ember`;
- theme button содержит sun+moon;
- Help label и `?` SVG присутствуют;
- page engine не содержит Play/Learning/progress;
- settings choices — border-only, без общей полоски-фона.

### Browser

На 320/360/390/430/768/1440:

- centers outer node/line delta ≤ 0.25 px;
- centers nested node/line delta ≤ 0.25 px;
- article accordion открывается для каждой статьи;
- одновременно открыта одна статья;
- scroll updates section/current/passed/fill;
- desktop rail и sheet показывают одинаковый current state;
- Play ring виден idle/playing/paused;
- sun↔moon соответствует теме;
- Settings light/sepia/dark;
- page engine не резервирует место под отсутствующий bottom bar.

---

## 8. Гейты перед merge

```bash
npm run astro:check
node scripts/editorial-metadata-registry.js --check
npm run engine:contracts
npm run gill:chrome:guard
npm run engine:sweep
npm run validate:static-publication
npm run strangler:build:production-like
```

Плюс screenshots:

```text
series-flat  desktop/mobile × light/dark
series-book  desktop/mobile × light/sepia/dark
article      desktop/mobile × light/dark
page         desktop/mobile
```

---

## 9. Reference implementation

- Интерактивный book/series prototype: `../book-engine-reference-prototype.html`.
- Типизированный discriminated-union contract: `enginePlatformContracts.ts`.
- Конфигурации всех трёх engines и двух shapes series: `engineExamples.ts`.
- Полный реестр SVG, состояний и анимаций: `SVG_STATE_ANIMATION_MANIFEST.md`.

`enginePlatformContracts.ts` проходит TypeScript strict-check и предназначен как спецификация для переноса в существующие модули, а не как параллельная платформа.
