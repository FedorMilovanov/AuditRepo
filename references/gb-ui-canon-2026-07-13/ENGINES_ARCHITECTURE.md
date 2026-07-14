# Архитектура трёх движков gb-is-my-strength — канон 2026-07-14

Один физический слой стилей/JS (`css/floating-cluster.css`,
`js/floating-cluster-controller.js`), три логических движка сверху. Каждый —
законченная система: рельс/бар + лист настроек + сохранение состояния.
Движки НЕ зависят друг от друга (одиночный больше не тянет Gill-лист —
регрессия найдена и исправлена 2026-07-14).

## 1. Серия-движок (SeriesConfig + GillSeriesChrome)

**Кто на нём:** Гилл (6 стр.) · «Сердце» (6 стр.) · Баптисты (10 стр. + хаб) ·
antisovetov/pastor-series (1 написанная часть + 8 planned-заглушек на хабе).

**Файлы:**
- `src/components/article-pilots/_shared/series/seriesConfig.ts` — тип
  `SeriesConfig` + реестр `SERIES_CONFIGS`. Поля: `seriesId`, `seriesTitle(Full)`,
  `railBackHref`, `theme?` (визуальный «характер», см. ниже), `quiz`,
  `breadcrumbParent`, `items[]`, `pages{}`.
- `gillSeriesConfig` (в `seriesConfig.ts`) / `hardTextsSeriesConfig.ts` /
  `baptistSeriesConfig.ts` / `pastorSeriesConfig.ts` — по одному инстансу на
  серию. Новая серия = новый файл конфига + регистрация в `SERIES_CONFIGS`.
- `src/components/article-pilots/gill-series/GillSeriesChrome.astro` — сборка:
  рельс + мобильные бары + оверлеи + скрипты. Единственная точка входа для
  статьи серии: `<GillSeriesChrome pageId="..." config={...}><article/></GillSeriesChrome>`.
- Компоненты рельса/листов — все в `gill-series/` (названы Gill*, но
  рендерятся для ЛЮБОЙ серии через `config`): `GillSeriesRail`,
  `GillSeriesMobileBar`, `GillSeriesOverlay` (лист «Части серии»),
  `GillPartTocOverlay` (аккордеон «Оглавление части»), `GillLearningSheet`
  («Обучение»: термины/тест/конспект/заметки), `GillReaderSettingsSheet`
  (тема/сепия/размер/интервал — «Ширина» скрыта на десктопе).

**Тема серии:** `SeriesConfig.theme` (напр. `'samizdat'` у Баптистов) ставит
`data-series-theme` на `.gbs2-world`; CSS-файл вида `css/series-samizdat.css`
переопределяет токены движка под этим атрибутом. У Гилла/Сердца `theme`
не задан → атрибут не рендерится → они byte-identical базовому виду.

**Десктопные контролы:** рельс слева (фикс, `[data-gill-v16] .gbs-rail`),
футер рельса — ☰ Меню · ⚙ Настройки (`#railSettingsBtn`) · ⬇ Скачать ·
↗ Поделиться. ⚙ открывает `#gillSettingsOverlay` поповером **снизу-слева**
(не центр-модалка!) — все правила листа строго под `[data-gill-v16]
.gill-settings-overlay`.
**Угловой кластер** (`.gbs-theme-corner`, справа сверху): тема/поиск/PLAY/save.
PLAY (`.gb-ember`) на десктопе — тонкий контур **виден в покое**
(`.gb-ember__ring-svg{opacity:1}` на `≥64em`), бейдж «N×» сидит **внутри**
круга (`right:-2px;bottom:-2px`, синхронизировано с мобилой 2026-07-14).

**Мобильные контролы:** верхний бар (тема/поиск/PLAY/save, крошки СКРЫТЫ —
верхний бар уже даёт навигацию) + нижний бар (кольцо прогресса + «Сейчас
читаете» + ⚙/тема/share). ⚙ (`#mobSettingsBtn`) открывает тот же лист снизу
(bottom-sheet). Кликом по нижнему бару — `GillPartTocOverlay` (аккордеон
частей серии, форзацы вертикальным словом, текущая часть раскрыта).

## 2. Одиночный движок (ReaderRail + ReaderSettings)

**Кто на нём:** Герменевтика · kod-da-vinchi. Статьи вне какой-либо серии,
но с полноценным читательским рельсом — НЕ используют Gill/SeriesConfig.

**Файлы:**
- `src/components/article-pilots/_shared/ReaderRail.astro` — общий левый
  рельс (обобщён из `HermenevtikaRail` 2026-07-14): оглавление статьи
  (H2/H3, метро-линия прогресса) + нижний тулбар. Пропсы: `eyebrow`, `title`,
  `backHref`, `toc: ReaderRailTocItem[]`, `settingsTrigger: 'hm'|'gill'`
  (какое событие/атрибут шлёт кнопка ⚙ — сейчас ОБЕ страницы используют `'hm'`,
  значение `'gill'` — историческое, оставлено для обратной совместимости
  сигнатуры, не используется).
- `src/components/article-pilots/_shared/ReaderSettings.astro` — общий
  самодостаточный лист (обобщён из `HermenevtikaReaderSettings`
  2026-07-14): тема/сепия/размер/интервал/ширина. Несёт СВОЙ скелет
  `.hmsheet*` (backdrop/panel/head/close) — не зависит от наличия мобильного
  бара на странице. Открывается событием `hm:open-settings`. Применяется к
  ближайшему `[data-reader-root]` (не `#content`, не `[data-gill-v16]`).
- `HermenevtikaRail.astro` / `HermenevtikaMobileBar.astro` — тонкие обёртки
  над `ReaderRail`/оставляют свои мобильные бары (собственная палитра
  cream+maroon).
- `KodDaVinchiPageChrome.astro` — подключает `ReaderRail` + `ReaderSettings`
  напрямую + `FloatingCluster mode="single"` (угловой кластер для мобилы,
  на десктопе своя ⚙ прячется — рельс даёт).

**Контракт:** любая новая одиночная статья = `<main data-reader-root>` +
`<ReaderRail toc={...} settingsTrigger="hm" .../>` + `<ReaderSettings />` +
кнопка ⚙ в угловом кластере (мобила), диспатчащая `hm:open-settings`.
НИКАКИХ импортов из `gill-series/` — движки разделены сознательно (регрессия
2026-07-14: kod-da-vinchi временно тянула Gill-лист, ломался на мобиле).

**Десктоп:** поповер настроек снизу-слева от ⚙ рельса, поверх нижней части
рельса (z-index выше). **Мобила:** bottom-sheet, идентичный по составу полей.

## 3. Page-движок (каталоги/лендинги)

**Кто на нём:** `/articles/`, `/biografii/`, `/hard-texts/`, `/konfessii/`,
`/karty/`, `/nagornaya/*`, `/` и т.д. — не статьи, а списочные/лендинговые
страницы. Компонент `*PageChrome.astro` в каждом каталоге
(`src/components/<section>/<Section>PageChrome.astro`).

**Особенность:** нет читательского рельса/настроек чтения (нечего читать
линейно) — верхний мобильный бар с глобальным поиском
(`route-profiles`/`mobileChrome` реестр, Этап 5–6 из истории проекта).
Нагорная — вне серия-движка по решению владельца (индивидуальная вёрстка).

## Общие принципы (не нарушать)

1. **Один фикс — все страницы серии.** Правки рельса/листа вносятся в
   `gill-series/*.astro` или `floating-cluster.css` под `[data-gill-v16]`
   — никогда в конкретную `*Body.astro` статьи.
2. **Одиночный движок не знает про Гилла.** `ReaderRail`/`ReaderSettings`
   не импортируют ничего из `gill-series/`; Gill-лист не имеет fallback на
   `[data-reader-root]`.
3. **Тема серии — токены, не форк.** Новая атмосфера (как «Самиздатъ») —
   это `theme` в конфиге + один CSS-файл с переопределением токенов под
   `[data-series-theme="..."]`, не копия компонентов.
4. **Десктоп и мобила — одна и та же геометрия/позиция контролов**,
   отличается только форм-фактор (рельс vs бар, поповер vs bottom-sheet).
   Расхождение в абсолютных пикселях позиционирования — красный флаг
   (см. инцидент с бейджем «1×» 2026-07-14).
5. **Ветка `lane/*` = черновик, не источник истины.** Канон живёт в main +
   этом каталоге (`gb-ui-canon-2026-07-13/`). Перед началом любой правки
   хрома — сверяться с `README.md` и `BRANCH_AUDIT_2026-07-14.md` в этой же
   папке, не изобретать заново.
