# Аудит всех веток репозитория gb-is-my-strength — 2026-07-14

Владелец: «проверь, не затерялись ли ещё ветки». Прочёсаны ВСЕ ветки на
origin (не только `lane/system-mobile-chrome-rollout-v1`, которую уже
разбирали раньше). Для каждой — не просто «есть коммиты впереди main», а
фактическая проверка: реализовано ли то же самое в main другим путём.

## Метод проверки
`git log main.."origin/<branch>" --oneline` → список уникальных коммитов →
для каждого коммита: чтение диффа + `grep`/чтение текущего main на предмет
того же поведения (не по имени функции — по факту: рендерится ли то же самое,
проходит ли тот же чек, есть ли тот же файл).

## Ветки UI/движка (все проверены, дата коммитов = 10 июля, ДО марафона
   мобильного хрома v16 11–13 июля, который полностью переписал Гилла)

| Ветка | Коммитов | Вердикт | Как проверено |
|---|---|---|---|
| `fix/gill-play-badge-menu-polish` | 1 | **Замещена.** Заявленные фичи (бейдж скорости, гамбургер→реальное меню, X-морф, шеврон) уже в main через независимую более позднюю реализацию (`h-mobile-nav`, `#hMobileMenuBtn`, `.gbs-menu-chevron`, `burger-top/mid/bottom` rotate/scale). | grep `.burger-top{transform` + `.gbs-menu-chevron` в main — присутствуют |
| `fix/gill-rail-canonical-menu-and-speed` | 1 | **Замещена** тем же переписыванием 11–13 июля (мобильные бары полностью заново). | та же дата/контекст, что выше |
| `fix/gill-restore-last-pages-submenu` | 1 | **Замещена.** `sec-gill-last-pages` уже присутствует в `gillSeriesData.ts` и `GillPart3ArticleBody.astro`. | `grep -rl sec-gill-last-pages src/` → 2 файла |
| `fix/indexnow-checker-stale-perms` | 1 | **Замещена.** Правило `contents: read` уже в `check-workflows.js`; `node scripts/check-workflows.js` проходит зелёным. | запуск скрипта — ✅ |
| `lane/system-gill-mobile-v5` | 6 | **Замещена.** Черновик `GillLearningSheet`/`GillReaderSettingsSheet` от 10 июля — в main оба файла существуют в куда более развитом виде (canon-марафон 13 июля целиком их доработал). | `ls src/.../GillLearningSheet.astro GillReaderSettingsSheet.astro` — оба есть |
| `lane/system-gill-tts-lang-en` | 1 | **Замещена.** `getArticleText()` в `floating-cluster-controller.js` уже пропускает `.summary-card, .gtip, .fn-marker, .tooltip, .notice, [lang="en"]` — то же поведение, что описано в коммите. | чтение функции `getArticleText` в main — логика присутствует |
| `lane/system-gill-quiz-calibration-v1` | 0 | Пусто (все коммиты уже предки main). | `git merge-base --is-ancestor` |
| `lane/system-hermenevtika-reader-settings` | 0 | Пусто. | — |
| `lane/system-content-provenance-pastor-series` | 0 | Пусто. | — |
| `lane/system-gill-speedrail-touch` | 0 | Пусто. | — |
| `lane/system-mobile-chrome-core-v1` / `-herm-v1` / `-page-v1` | 0 | Пусто (влиты раньше). | — |
| `nagornaya-fixes-clean` | 0 | Пусто, предок main. | — |

## Ветки с содержательными правками (требуют решения владельца, НЕ слиты
   автоматически — это редакторский контент, а не движок)

| Ветка | Коммитов | Что внутри | Почему не слито автоматически |
|---|---|---|---|
| `fix/gill-editorial-content-integrity` | 3 | «Russian-first bilingual cards», дедупликация «legacy testimonies», фиксы целостности Части IV | Правки контента Гилла от 10 июля — с тех пор текст Части III/IV мог редактироваться другими агентами; слепое слияние рискует конфликтовать с более новыми правками. Нужна ручная сверка перед слиянием. |
| `fix/gill-editorial-integrity` | 1 | Переписанное «Введение» без «оправданий» + атмосфера GillWitness | То же — контентная правка, не движок. |
| `fix/gill-part4-propagate-sibling-grids` | 1 | Протащить контент Части IV «Экзегет» в сетки-анонсы соседних частей | То же. |

**Рекомендация:** если эти три ветки всё ещё актуальны, стоит открыть их
дифф отдельно и свести вручную с текущим текстом — я не стал молча
накладывать правки контента поверх уже много раз отредактированных статей
без явного «да, накладывай».

## Ветки другой, не связанной с этой работой тематики (НЕ трогал)

| Ветка | Коммитов | Тема |
|---|---|---|
| `claude/biblical-genealogy-svg-6l6qb8` | 55 | «Библейский атлас родословий» — отдельная крупная фича (карточный движок родословий), последний коммит 13 июля 23:16 |
| `claude/website-map-audit-ik3ypo` | 86 | «Атлас-объекты» (гравюрная роза ветров и т.п.) — отдельная крупная фича, последний коммит 13 июля 23:46 |
| `claude/fable-maps-prompt-319amc` | 0 | Пусто |

Обе — большие параллельные ветки другой тематики (не хром/движок серий),
судя по всему из других сессий этого же дня. Не входят в объём этой работы;
не трогал, чтобы не задеть чужую незавершённую работу.

## Итог
Все ветки, напрямую относящиеся к UI-движку (рельс/настройки/бейджи/меню),
оказались либо уже влиты, либо **замещены** более поздней и более полной
реализацией 11–13 июля — реальных технических потерь по движку на 2026-07-14
не найдено (кроме уже починенных в этой и прошлой сессии: поповер настроек,
ободок PLAY на десктопе, крошки на мобиле, центрирование «1×»). Три
контентные ветки Гилла требуют отдельного решения владельца.

## Реестр зачистки (2026-07-14, финальная ревизия)

**Код-мусор — УДАЛЁН** (main-репо, коммит на ветке dns-configuration-setup):
осиротевшие компоненты старого series-lite движка `HeartSheetParts`,
`HeartLeatherDefs`, `HeartRailParts` (heart теперь на `GillSeriesChrome`),
плюс неподключённый скаффолд `MobileSheetShell`. Докстринги, ссылавшиеся на
удалённый `HermenevtikaReaderSettings`, переведены на `ReaderSettings`.
Сборка 58 стр. + guard v2.9 — зелёные. Все 10 CSS-файлов используются.

**Ветки к удалению (Группа A — замещённые/влитые, 0 технических потерь).**
Git-прокси среды блокирует `push --delete` (403) — удалить нужно владельцу
через UI GitHub / локально. Точный список (17 веток):
lane/system-content-provenance-pastor-series, lane/system-gill-mobile-polish-v1,
lane/system-gill-mobile-v5, lane/system-gill-quiz-calibration-v1,
lane/system-gill-speedrail-touch, lane/system-gill-tts-lang-en,
lane/system-hermenevtika-reader-settings, lane/system-mobile-chrome-core-v1,
lane/system-mobile-chrome-herm-v1, lane/system-mobile-chrome-page-v1,
lane/system-mobile-chrome-rollout-v1, fix/gill-play-badge-menu-polish,
fix/gill-rail-canonical-menu-and-speed, fix/gill-restore-last-pages-submenu,
fix/indexnow-checker-stale-perms, nagornaya-fixes-clean,
claude/fable-maps-prompt-319amc.

**НЕ удалять (Группа B — контент Гилла, нужна ручная сверка):**
fix/gill-editorial-content-integrity, fix/gill-editorial-integrity,
fix/gill-part4-propagate-sibling-grids.

**НЕ трогать (Группа C — другие сессии):**
claude/biblical-genealogy-svg-6l6qb8 (55), claude/website-map-audit-ik3ypo (86).

## Аудит-репо: ветки
origin: audit/gill-content-research-master-2026-07-09,
audit/gill-series-v10-canonical-2026-07-09, audit/hermenevtika-ui-current-head-2026-07-09
(снапшоты-эталоны 9 июля — хранить), claude/brave-franklin-qkiqmf,
claude/website-map-audit-ik3ypo, incoming/gpt-5-5-gill-image-restoration-2026-07-09,
main, claude/dns-configuration-setup-c0w26g (эта работа). Референсы канона
зафиксированы в main-ветке коммитом 2d40bb1 (+ bb2e00b). Потерь нет.

## Зачистка выполнена (владелец, 2026-07-14)
Все 17 веток Группы A удалены с origin (main-репо). Проверено `git fetch --prune`
— подтверждено отсутствие на remote. Остались: main, claude/dns-configuration-setup-c0w26g
(рабочая), 3 контентные (Группа B, ждут ручной сверки), 2 чужие (Группа C,
атлас/генеалогия, другая активная сессия). Финальное состояние чистое.

## Пост-зачистка: тотальная сверка внедрения (2026-07-14, вечер)

Владелец: «перепроверяй мощно, движки на ВЕСЬ сайт, любое отклонение — паника».
Прогон Playwright 69 проверок (геометрия+функции), десктоп 1440 + мобила 390,
все 3 движка × все серии × каталоги. Скрины отсмотрены вручную.

**Найдено и исправлено (4 коммита восстановлены из архива rollout-v1 —
объекты были живы локально, ветка keep/rollout-v1-archive):**
1. Page-движок был смонтирован ТОЛЬКО на /articles/ (пилот). Раскатка на
   /biografii/, /hard-texts/, /rodosloviye/, /karty/, /konfessii/ жила в
   удалённой lane/system-mobile-chrome-rollout-v1 и в main не попадала.
   Черри-пик 7ed7e1e+5523b9d+ec87131 → бар Back·Home·Поиск теперь на 6
   каталогах. /izbrannoe/ и /map/ исключены СОЗНАТЕЛЬНО (там свои постоянные
   шапки — задокументировано в самих коммитах).
2. Фикс «двойной рамки» таб-кнопок Обучения (3ee57f7) тоже не был влит —
   черри-пикнут, проверен визуально (одинарная рамка).
3. /dev/astro-test/ — тестовая страница уходила в прод-сборку. Удалена.

**Вердикт прогона: 69/69 PASS, 0 JS-ошибок, guard v2.9 зелёный, 57 страниц.**
Проверено на каждом классе страниц: рельс+⚙ поповер снизу-слева (десктоп),
кольцо PLAY в покое, «1×» в круге (деск+мобила), сепия/тема, крошки скрыты
на мобиле, bottom-sheet настроек, part-TOC аккордеон (Гилл/Сердце/Баптисты/
пастор), самиздат-токены на баптистах в обеих темах, ReaderRail+ReaderSettings
на Герменевтике и kod-da-vinchi (деск+мобила), page-бар выезжает на скролле
и открывает палитру GBSearch на 6 каталогах.

**Не движок, контент (для будущего контент-агента):** на обложке баптистской
части IX пилюля «ЧАСТЬ 9 из 10» (авторский текст) расходится с рельсом
«Часть 9 из 9» (движок считает 9 римских частей, Справочник — форзац).
