# Аудит документации и движков gb-is-my-strength

**Срез:** 2026-07-15  
**Source:** `FedorMilovanov/gb-is-my-strength` @ `e9faea5b` (main)  
**AuditRepo:** `FedorMilovanov/AuditRepo` @ `182af122` (main)

## Короткий вывод

На сайте сейчас не один, а **три логических UI-движка** поверх общего слоя стилей и контроллера:

1. **Series engine** — `SeriesConfig` + `GillSeriesChrome`: Гилл, «Сердце», Баптисты России, pastor-series.
2. **Single reader engine** — `ReaderRail` + `ReaderSettings`: Герменевтика и «Код да Винчи».
3. **Page engine** — каталоги и лендинги: `/articles/`, `/biografii/`, `/hard-texts/`, `/karty/`, `/konfessii/` и др.

Последний main уже содержит первый **книжный режим**: главы обозначаются римскими цифрами и не являются страницами; внутри глав живут самостоятельные статьи с арабской нумерацией. Пилот — серия «Тайны человеческого сердца».

Главная проблема текущего среза не в самой идее, а в незавершённой посадке: код опередил документацию, типы и редакционный реестр. Поэтому main @ `e9faea5b` сейчас не готов к зелёному deploy.

---

## 1. Что является каноном

### Основной репозиторий

- `AGENTS.md` — инварианты владельца, freeze-зоны, GBS и визуальные контракты.
- `docs/SERIES-ENGINE-GUIDE.md` — инструкция контент-агентам по сериям.
- `src/components/article-pilots/_shared/series/seriesConfig.ts` — фактическая модель и build-time validator.
- `src/components/article-pilots/gill-series/GillSeriesChrome.astro` — единая точка входа series engine.
- `src/components/article-pilots/_shared/ReaderRail.astro` и `ReaderSettings.astro` — single reader engine.
- `src/components/article-pilots/_shared/series/hardTextsSeriesConfig.ts` — фактический пилот книжного режима.
- `scripts/check-engine-contracts.js` и `scripts/engine-sweep.mjs` — статическая и браузерная защита движка.

### AuditRepo

- `references/gb-ui-canon-2026-07-13/ENGINES_ARCHITECTURE.md` — лучший общий обзор трёх движков, но он описывает состояние до книжного коммита 15 июля.
- `references/gb-ui-canon-2026-07-13/*.png` — визуальные эталоны рельса, PLAY, настроек, mobile bars и TOC.
- `projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md` — каноническая матрица багов.
- `projects/gb-is-my-strength/NEXT_AGENT_PROMPT.md` — формально SSOT текущего HEAD/deploy, но на этом срезе устарел.
- `projects/gb-is-my-strength/working/HEART_BOOK_CONTENT_CHECKS_SPEC_2026-07-14.md` — рабочая спецификация будущих HB-* контент-чеков.

---

## 2. Фактическая архитектура

### 2.1 Series engine

**Файлы:**

- `seriesConfig.ts`: типы, registry `SERIES_CONFIGS`, `defineSeriesConfig()`.
- `GillSeriesChrome.astro`: рельс, mobile bars, overlays, обучение, настройки, PLAY/закладки.
- `GillSeriesRail.astro`: desktop rail и контекст текущего материала.
- `GillSeriesOverlay.astro`: содержание серии.
- `GillPartTocOverlay.astro`: оглавление части/главы.

**Сильная сторона:** серия задаётся данными. Визуальная тема меняется токенами (`theme` + `css/series-<theme>.css`), а не копированием компонентов.

**Модель до 15 июля:**

- `roman` — часть;
- `label` — форзац;
- `letter` + `tier:'satellite'` — спутник части.

**Новая книжная модель в коде:**

- `roman` + `tier:'chapter'` — глава-группа, не URL-страница;
- `arabic` + `parent:<chapterId>` — самостоятельная статья внутри главы;
- `label` — пролог/справочник вне глав.

Хелперы: `isBookSeries`, `topLevelItems`, `chapterArticles`, `chapterOf`.

### 2.2 Single reader engine

Герменевтика и «Код да Винчи» используют один и тот же каркас:

- слева — `ReaderRail` с H2/H3 и метро-линией прогресса;
- снизу рельса — меню, настройки, share, download, A−/A+;
- справа сверху — тема, поиск, PLAY и сохранение;
- `ReaderSettings` открывается как компактный поповер на desktop и bottom-sheet на mobile.

Это сознательно отделено от Gill/series engine. Импорт `gill-series/*` в одиночный движок — архитектурная регрессия.

### 2.3 Page engine

Каталоги не имеют читательского рельса: там нет линейного чтения. Они получают mobile chrome и глобальный поиск через route registry и секционные `*PageChrome.astro`.

---

## 3. Как выглядит текущий main

| Экран | Скриншот |
|---|---|
| Гилл — series engine | [`screenshots/current-gill-desktop.png`](screenshots/current-gill-desktop.png) |
| Герменевтика — single reader | [`screenshots/current-hermeneutics-desktop.png`](screenshots/current-hermeneutics-desktop.png) |
| «Код да Винчи» — single reader | [`screenshots/current-kod-da-vinchi-desktop.png`](screenshots/current-kod-da-vinchi-desktop.png) |
| «Сердце» — текущий книжный пилот | [`screenshots/current-heart-book-desktop.png`](screenshots/current-heart-book-desktop.png) |
| Настройки «Сердца» | [`screenshots/current-heart-settings-desktop.png`](screenshots/current-heart-settings-desktop.png) |
| «Сердце» на mobile | [`screenshots/current-heart-mobile.png`](screenshots/current-heart-mobile.png) |

Скриншоты сделаны из локального production-like `dist`, собранного из `e9faea5b`, viewport desktop 1440×1000 и mobile 390×844.

---

## 4. Книжный вариант: профессиональная модель

Рекомендованный контракт:

```ts
items: [
  { id: 'prolog', mark: { kind: 'label', value: 'Пролог' }, ... },

  { id: 'ch1', tier: 'chapter', mark: { kind: 'roman', value: 'I' },
    title: 'Глава I. Диагноз сердца', href: '/articles/first-article/' },
  { id: 'article-1', parent: 'ch1', mark: { kind: 'arabic', value: '1' }, ... },
  { id: 'article-2', parent: 'ch1', mark: { kind: 'arabic', value: '2' }, ... },

  { id: 'spravochnik', mark: { kind: 'label', value: 'Справочник' }, ... },
]
```

Правила:

1. Глава — навигационная группа, не пустая псевдостатья.
2. `href` главы ведёт на первую опубликованную статью.
3. Арабская нумерация локальна для главы и вычисляется/валидируется.
4. Прогресс различает три величины: книга, глава, текущая статья.
5. Prev/next идёт по статьям, а не по заголовкам глав.
6. Пролог и Справочник остаются форзацами.
7. Плоские серии (Гилл, Баптисты) не обязаны становиться книгами.
8. Один и тот же chrome обслуживает плоскую серию и книгу; отдельный форк компонентов не создаётся.

### Предлагаемая desktop-геометрия

- Верхний уровень рельса: форзацы + главы.
- Текущая глава раскрывается в статьи 1…N.
- Внутри текущего контекста две вкладки: **«Глава»** и **«Статья»**. Это не даёт одновременно свалить в один скролл статьи главы и 10–15 H2 текущей статьи.
- «Сейчас читаете»: `Глава I · статья 1 из 6`.
- В контенте: `Книга · Глава I · Статья 1`.

### Mobile

- Верхний бар: back, книга/номер, PLAY, notebook.
- Нижний бар: прогресс + текущая статья; тап открывает содержание книги.
- Содержание книги — главы; текущая глава раскрывается в статьи; затем отдельный уровень оглавления статьи.

---

## 5. Заметки: что лучше исправить

Сейчас существуют две конкурирующие поверхности:

1. глобальный `highlights.js` с панелью «Мои цитаты» и отдельным FAB;
2. вкладка «Заметки» в `GillLearningSheet`.

Это дублирование и есть архитектурная причина «кривого отдела»: разные названия, разные входы, разные визуальные контейнеры и неочевидная грань между save/bookmark/highlight/note.

### Предлагаемый контракт

Одна функция — **«Тетрадь читателя»**:

- один вход через контурную иконку закладки в reader chrome;
- внутри: вкладки «Все / Заметки / Цитаты»;
- каждая запись знает `seriesId`, `chapterId`, `pageId`, `sectionId`, URL и text fragment;
- быстрый ввод новой мысли с текущим контекстом;
- quote и собственная note визуально различаются;
- переход назад к месту;
- Markdown export;
- существующий `gb-highlights-v1` мигрируется, а не теряется;
- отдельный плавающий FAB не нужен на страницах с reader chrome; fallback допускается только для legacy-страниц без chrome.

HTML-прототип показывает именно этот вариант.

---

## 6. Документационный дрейф

### D1 — `SERIES-ENGINE-GUIDE.md` отстаёт от кода

Документ по-прежнему объявляет **три яруса** (`roman/label/letter`) и не описывает `tier:'chapter'`/`mark.kind:'arabic'`. После `e9faea5b` это уже неверно.

**Нужно:** добавить отдельный раздел «Книжная серия», схему, чек-лист, правила `series.json`, примеры flat vs book.

### D2 — AuditRepo `ENGINES_ARCHITECTURE.md` отстаёт от 15 июля

Он является хорошим каноном для трёх движков, но раздел о ярусах завершён спутниками и не знает книжный режим.

### D3 — `NEXT_AGENT_PROMPT.md` больше не описывает текущий HEAD

Он фиксирует source `2ca2af3b`, тогда как main уже `e9faea5b`. Deploy остаётся красным, но причины уже другие. SSOT формально существует, фактически устарел.

### D4 — две модели «Сердца» не сведены одним документом

- `HEART-SERIES-ARCHITECTURE` описывает 24 материала и движения А–Д;
- код теперь раскладывает 22 статьи по четырём главам плюс 2 форзаца;
- `HEART_BOOK_CONTENT_CHECKS_SPEC` говорит о будущем корпусе около 38 статей и ссылается на Research SSOT.

Это можно совместить, но нужна одна таблица соответствия: **книга → глава → статья → прежний material/movement → slug → статус**.

### D5 — HB-* проверки пока только спецификация

В `scripts/` нет `heart-book-content-checks.js`, а в `package.json` нет соответствующего gate. Значит HB-QUOTE/HB-ANCHOR/HB-BALANCE/HB-TERM/HB-SRC/HB-STRUCT пока не защищают main.

### D6 — `heartSeriesData.ts` сохраняет старую терминологию

Комментарии и хелперы говорят о двух entry kinds и «Часть N из M», тогда как книжная проекция строится сверху в `hardTextsSeriesConfig.ts`. Это работоспособный переходный слой, но не окончательный SSOT.

---

## 7. Текущий красный deploy — точная причина

GitHub Actions для `e9faea5b`:

- `Deploy to GitHub Pages` run `29382259526` — **failure** на шаге `Static publication gates`.
- `Native Source Contract` run `29382259597` — **failure** на `Astro type and template check`.
- `Visual Parity Guard` run `29382259562` — **failure** на production-like build.
- `Metadata & IndexNow Readiness` run `29382259555` — **failure** на registry structure.

Локально воспроизводятся два корня:

### Type blocker

`astro check` выдаёт 3 ошибки: `SeriesMark.astro` принимает только `label | roman | letter`, а общий `SeriesMark.kind` теперь включает `arabic`.

Затронуты:

- `GillSeriesOverlay.astro:30`;
- `GillSeriesRail.astro:133`;
- `GillSeriesRail.astro:203`.

Профессиональный фикс: расширить контракт `SeriesMark.astro` до общей модели марок (или типобезопасно сузить `topLevelItems`), добавить явный класс для арабской марки и отрицательный контракт в `engine:contracts`.

### Editorial registry blocker

`node scripts/editorial-metadata-registry.js --check` сообщает 18 отсутствующих записей — все новые статьи «Сердца» (`skrytye-idoly`, `religioznoe`, `sovest`, `myslennaya`, `starye-dorozhki`, `serdce-i-yazyk`, `serdce-i-telo`, `serdce-i-sokrovishche`, `tma`, `skorb`, `kak-menyaetsya`, `iskushenie`, `kak-hranit`, `strah`, `svoboda`, `ne-v-odinochku`, `serdce-hrista`, `osvobozhdennoe`).

Нужно пересобрать registry через штатный `--write`, проверить diff и затем прогнать `--check`.

**Важно:** обычный `astro build` на этом срезе успешно строит 75 страниц, потому что это не заменяет `astro check`. Зелёная локальная сборка сама по себе не является доказательством готовности deploy.

---

## 8. Правильная последовательность посадки

1. Исправить типовой контракт `SeriesMark`.
2. Обновить editorial metadata для 18 маршрутов.
3. Обновить `SERIES-ENGINE-GUIDE.md` и AuditRepo architecture.
4. Добавить book-mode проверки в `check-engine-contracts.js`:
   - глава не имеет `pages[id]`;
   - глава не пуста;
   - article parent — существующая chapter;
   - арабские номера последовательны внутри главы;
   - flat series не меняет рендер.
5. Добавить `engine-sweep` сценарии desktop/mobile:
   - раскрытие главы;
   - переход к статье;
   - current state;
   - prev/next через границу главы;
   - series/chapter/article progress.
6. Прогнать Node 22:
   - `npm run astro:check`;
   - `node scripts/editorial-metadata-registry.js --check`;
   - `npm run engine:guard`;
   - `npm run validate:static-publication`;
   - production-like dist + desktop/mobile screenshots.
7. Только после зелёной цепочки — push/merge в main и проверка точного deployed SHA.

---

## 9. HTML-прототип по каноническим референсам

Главный файл: [`book-engine-reference-prototype.html`](book-engine-reference-prototype.html)

Основа без самостоятельного переизобретения визуала:

- `references/gb-ui-canon-2026-07-13/mobile-toc-accordion-v5.html`;
- `engine-parttoc-accordion-light.png` / `engine-parttoc-accordion-dark.png`;
- `desktop-rail-light.png` / `desktop-rail-dark-depth.png`;
- `references/gill-mobile/gill-mobile-bars-v2.9.html`.

В прототипе меняется только модель данных книжного режима:

- верхний уровень — главы `I–IV`;
- внутри главы — статьи `1–N`;
- при открытии текущей статьи её собственное оглавление снова использует римские разделы `I–V`, как в существующих статьях;
- Пролог и Справочник остаются вертикальными label-форзацами;
- mobile bars, PLAY, footer, карточки, золото/бордо, светлая и тёмная палитры повторяют канон.

Скриншоты:

- [`screenshots/reference-book-desktop.png`](screenshots/reference-book-desktop.png)
- [`screenshots/reference-book-toc-desktop.png`](screenshots/reference-book-toc-desktop.png)
- [`screenshots/reference-book-toc-mobile.png`](screenshots/reference-book-toc-mobile.png)
- [`screenshots/reference-book-toc-mobile-dark.png`](screenshots/reference-book-toc-mobile-dark.png)
- [`screenshots/reference-article-toc-mobile.png`](screenshots/reference-article-toc-mobile.png)
- [`screenshots/reference-notes-mobile.png`](screenshots/reference-notes-mobile.png)

Визуальные passes 2–4:

- встроены канонические Lora/Source Sans 3;
- узлы метро-линии уменьшены до 5 px (активный 7 px), линия — до 1 px;
- Prolog и Справочник используют одну фиксированную label-колонку; координата начала правого текста проверяется автоматически и совпадает;
- Play подключён по реальному `PlayEmber.astro`: SVG ring `r=45`, circumference `283`, stroke `1.5`, ring виден в idle, золотой progress и штатный speed badge;
- добавлены канонические SVG sun/moon со сменой по теме;
- «Обучение» заменено на «Справка» с SVG `?`, при этом используется прежняя табовая шторка;
- настройки добавлены как desktop popover/mobile sheet; варианты имеют отдельные минимальные рамки без общей полоски-фона и без заливки active;
- «Слушать книгу» раскрывает интегрированный минимальный queue-player: PlayEmber, статья N из 22, тонкий progress, previous/next;
- проверены light/dark/sepia, контраст и видимость иконок, размеры desktop/mobile и отсутствие JS-ошибок;
- добавлен третий уровень книги: `глава → статья → оглавление статьи`; каждая статья во всех главах раскрывает собственные H2/H3;
- текущая статья раскрыта сразу в desktop rail и mobile/desktop book sheet;
- scrollspy реального текста синхронизирует активный римский раздел, пройденные точки, заливку вложенной линии и подпись `Раздел N из 6 · %`;
- оси проверяются по фактическим `getBoundingClientRect`: центр узла статьи = центру линии, центр узла раздела = центру вложенной линии, отклонение `0 px` на 390 и 1440.

Дополнительные скриншоты:

- [`screenshots/reference-settings-desktop.png`](screenshots/reference-settings-desktop.png)
- [`screenshots/reference-settings-mobile.png`](screenshots/reference-settings-mobile.png)
- [`screenshots/reference-series-player-desktop.png`](screenshots/reference-series-player-desktop.png)
- [`screenshots/reference-series-player-mobile.png`](screenshots/reference-series-player-mobile.png)
- [`screenshots/reference-chapter-ii-expanded-mobile.png`](screenshots/reference-chapter-ii-expanded-mobile.png)
- [`screenshots/reference-chapter-ii-article-toc-mobile.png`](screenshots/reference-chapter-ii-article-toc-mobile.png)

Свободный эксперимент удалён, чтобы он не конкурировал с каноническим reference-based вариантом.

## 10. Платформа всех движков и встраивание

Добавлен integration package:

- [`integration/ENGINE_PLATFORM_INTEGRATION.md`](integration/ENGINE_PLATFORM_INTEGRATION.md) — desktop/mobile матрица для series-flat, series-book, article и page;
- [`integration/enginePlatformContracts.ts`](integration/enginePlatformContracts.ts) — discriminated-union контракт и build-time validator;
- [`integration/engineExamples.ts`](integration/engineExamples.ts) — конфигурации Гилла, книги «Сердце», Герменевтики и обычного каталога;
- [`integration/SVG_STATE_ANIMATION_MANIFEST.md`](integration/SVG_STATE_ANIMATION_MANIFEST.md) — полный реестр SVG, состояний PLAY/Save/theme, speed morph, sheet lifecycle, accordion и mobile auto-hide.

Архитектурное решение: runtime engines остаются `series | article | page`; книга — `series.shape='book'`, а не четвёртый engine. Reference TypeScript проходит strict-check. Комбинированный browser-check SVG/state/motion — PASS.
