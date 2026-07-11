# REPORT — Генеалогический атлас: фундаментальный аудит и стратегия введения

## Meta
- **Project:** gb-is-my-strength
- **Source repo:** FedorMilovanov/gb-is-my-strength
- **Agent:** claude-genealogy-atlas-strategy (Claude Code, remote)
- **Date:** 2026-07-11
- **Audited branch:** claude/biblical-genealogy-svg-6l6qb8 (= main на момент клона)
- **Audited SHA:** `47cdf86b3dc7632362ad4b66d8c4ce22a573568f`
- **Current HEAD at start / end:** `47cdf86` / `47cdf86`
- **Environment:** Claude Code remote sandbox, Node 22, npm ci OK
- **Build mode:** source + plain `astro build` (evidence валиден для Astro-owned strict-native-app маршрута; strangler-слой не гонялся)
- **Report type:** **strategy / foundation audit** (по прецеденту `arena-agent-karty-strategy/2026-07-07`)
- **Companion doc в source repo:** `docs/GENEALOGY-ATLAS-FOUNDATION-2026-07-11.md` (ветка `claude/biblical-genealogy-svg-6l6qb8`)
- **Внешнее исследование:** `artifacts/web-research-sources-2026-07-11.md` (65 аннотированных источников)

## Critical context

Запрос владельца (2026-07-11, пересказ): ввести **топовый генеалогический SVG-отдел**
«на максимально топовом уровне, не быстрый колхоз, а по всем максимальным стандартам»;
**полная генеалогия всех-всех в Библии**, раскрывающаяся при приближении, до Иисуса
(можно и после — ученики и т.п.); посмотреть существующий «костыль»; сделать аудит
глубже существующих; 50+ внешних источников; «заложить мощный фундамент, взять
правильные платформы»; пока — только аудит («как это сделать, как ввести и где»).

Референсы владельца — GPT-изображения «Библейский атлас родословий» (2 новых скрина в
запросе + 9 сохранённых в `docs/design-references/selected/01_genealogy_references/`):
светлый пергамент, боковая навигация по эпохам, золотой хребет Адам→…→Христос,
кластеры-«мега-узлы» («Допотопные патриархи +165 имён», «Потомки Авраама +318 имён»),
мини-карта, поиск, фильтры линий/периодов, быстрые ссылки, легенда линий, туры,
«Фокус: линия Давида», «После Христа и раннехристианская традиция», счётчики
«Всего персон: 3 254 · Родословных связей: 7 856» (иллюстративные).

Действующая доктрина владельца для флагманских разделов (karty, 2026-07-07, дословно):
> «Сначала ИДЕАЛЬНО сделать… а потом уже остальное делать, а не всё сразу.
> … Не костылями делать, а долгая работа на месяцы.»

Этот аудит применяет ту же «флагманскую» доктрину к генеалогии.

---

# S. Стратегическая часть

## S0. Executive summary (вердикт в 7 пунктах)

1. **«Костыль» оказался приличным прототипом**, а не колхозом: ~1 450 строк строгого
   TypeScript (React Flow 12 + dagre), смонтирован на `/rodosloviye/`
   (strict-native-app, production-dist, в sitemap), собирается и попадает в dist
   (проверено сборкой). Но его ядро рассчитано на сотни узлов, не тысячи.
2. **Целевой масштаб (~3 000–3 600 персон, ~7–8 тыс. связей) требует смены ядра**:
   полный рендер невозможен (SVG-порог ~2–3k элементов; карточка ≈ 5–8 элементов ⇒
   ~20k), React Flow по слову мейнтейнеров «не для 1000+ узлов». Обязательное ядро —
   **semantic zoom с агрегатами-кластерами** (как на референсах) + viewport-culling +
   **layout, предвычисленный на билде**.
3. **Вердикт по коду: эволюция с заменой ядра** («сохранить душу, заменить сердце»):
   маршрут/SEO, типы, теологический слой (disputed-узлы, линии, эпохи, MT-хронология),
   UX-паттерны (DetailPanel, SplitView Мф/Лк, тур, фокус-линия) — сохраняем как
   спецификацию и данные; рендер-ядро и модель данных проектируем заново
   (доктрина karty STRAT-02: engine проектируется до флагмана).
4. **Платформа (рекомендация):** собственный лёгкий SVG-движок **GenealogyAtlasEngine**
   (vanilla TypeScript в `src/`, d3-zoom + предвычисленный ELK/кастом-layout, LOD-морфинг,
   без React в рантайме, ≤ ~120KB gz JS). Fallback-альтернатива — React Flow с жёстким
   LOD-бюджетом ≤ 500 видимых узлов (дешевле, но тяжелее и с потолком). Решение — за
   владельцем (§S10, Решение №2).
5. **Данные (фундамент, самая важная фаза):** ядро **STEPBible TIPNR** (CC BY 4.0,
   Tyndale: все имена собственные, у персон parents/partners/siblings/offspring + все
   стихи) + **Wikidata** (CC0, русские имена через P22/P25/labels) + **полный
   Синодальный текст** (public domain; внешний вход пайплайна — открытые JSON-репо;
   ВАЖНО: в repo `data/bible/synodal/` только ВЫДЕРЖКИ для поповеров, напр. bytie.json =
   12 стихов — проверено) + существующие 156 персон как **хронологический скелет
   (MT AM)**; Theographic (CC BY-SA) — как независимый свидетель для сверки. Русские
   имена: ~500 ключевых — редактура сразу, хвост — **механическое извлечение из
   Синодального стиха первого упоминания** (TIPNR даёт точный стих каждой персоны;
   паттерны «родил X», «сыновья Y: A, B, C» дают русскую форму) + транслит-правила
   + очередь редактуры.
   **Оба ядра-кандидата скачаны и распарсены** (evidence/dataset-feasibility-probe):
   Theographic — 3 067 персон, но отец лишь у 1 584; TIPNR — **3 056 персон в
   PERSON-секции**, 3 329 строк с заполненными родителями (связность существенно
   богаче) ⇒ выбор TIPNR подтверждён практикой; реальный универсум ~3.0–3.1k персон.
   **Извлечение русских имён доказано экспериментом**: 60/60 стихов-рефов TIPNR
   разрешились в полном Синодальном JSON, 8/9 ручных выравниваний нашли имя в стихе
   (промах = сдвиг версификации Руф 4 — закрывается STEPBible Versification-данными).
6. **Где и как вводить:** маршрут остаётся `/rodosloviye/` (URL-капитал: sitemap,
   search-manifest, baseline), бренд страницы — «Библейский атлас родословий»; режим
   `strict-native-app` (уже назначен); работа только в lane (`lane/genealogy-atlas-*`,
   Risk 2–3); Tailwind не нужен — токены сайта + scoped CSS в острове; CSP не меняется
   (всё self-hosted); данные — lazy-чанками из `/data/genealogy/v2/` (НЕ props острова).
   Критично: раздел сейчас — **сирота (0 входящих ссылок)**; ввод = карточка на главной
   + ссылка в hub'е карт + перекрёстные ссылки из статей.
7. **План — 6 фаз (месяцы, без дедлайнов):** 0 Решения → 1 Фундамент данных →
   2 Контракт движка → 3 Флагман-рендер → 4 Контент/апологетика → 5 QA/a11y/perf +
   релиз с discoverability. Acceptance — 8 atlas-grade критериев (§S8).

## S1. Что уже есть (инвентаризация, с evidence)

### S1.1. Код (см. evidence/current-state-genealogy-2026-07-11.md)
- `src/components/genealogy/` — 8 модулей, 1 251 строка TS/TSX: types (143), theme (72),
  layout (203, dagre + золотая нить + multi-parent DAG после lane-фикса 2026-06-27),
  PersonNode (99), DetailPanel (146), TimelineAxis (99), SplitView (178),
  GenealogyTree (311, оркестратор: 3-уровневый zoom, фокус-линия, тур, keyboard-nav,
  поиск, minimap).
- `src/pages/rodosloviye/index.astro` монтирует `<GenealogyTree client:only="react">`;
  `rodosloviye/index.html` — legacy fallback (SEO-полный, без интерактива).
- Зависимости уже узаконены в package.json: react 19, @astrojs/react 5,
  @xyflow/react 12.11, @dagrejs/dagre 3.
- **Сборка проверена:** `astro build` → 54 страницы, `dist/rodosloviye/index.html` (128K),
  `dist/_astro/GenealogyTree.*.js` 248K raw / **80KB gz** + `client.*.js` 180K raw /
  **56KB gz** (React runtime) + CSS 16K/3KB. Итого JS острова ≈ **136KB gz**.

### S1.2. Данные
- `data/genealogy/genealogy.json` (88K): **156 персон**, 8 эпох, v3-integrity
  (0 orphan-ссылок), MT-хронология у 26 персон, 3 спорных узла с двумя позициями
  каждый (Каинан Лк 3:36, Иехония, Иосиф/Мария), линии
  (messianic/matthew/luke/cainite/…), роли, иврит/греческий, ссылки на Писание.
- `data/bible/synodal/` (24 файла книг) + `kassian/` (21) — **ВЫДЕРЖКИ** для
  verse-поповеров, НЕ полный текст (bytie.json = 12 стихов; Быт 5 отсутствует —
  проверено); `data/verses.json` (82 стиха) — действующий механизм поповеров.
  Полный Синодальный текст для пайплайна — внешний открытый вход (см. artifacts §B2).

### S1.3. Документы (внутренние, июнь 2026)
- `docs/GENEALOGY-MASTERPLAN-2026-06-18.md` — стратегия v1: React Flow + dagre,
  3-уровневый ZMLT-зум, AM-ось, золотая нить, split Мф/Лк; **объём тогда: ~75–120
  узлов** («НЕ тысячи — young-earth плотная позиция, как просил владелец»).
  ⚠️ Запрос 2026-07-11 и референсы (3 254 персоны) **пересматривают этот пункт**:
  теперь полная Библия. Плотная young-earth хронология при этом сохраняется как
  ХРЕБЕТ (хроногенеалогии Быт 5/11 = MT AM), полнота — как ШИРИНА охвата.
- `docs/GENEALOGY-DEEP-ANALYSIS-2026-06-18.md` — богословско-текстологическая база:
  хроногенеалогии (Sarfati/Freeman/Mortenson), MT vs LXX vs Самарянский, Каинан,
  Мф vs Лк, «все линии стекаются ко Христу». Остаётся канонической позицией контента.
- `docs/GENEALOGY-ARCHITECTURE-2026-06-19.md` — фиксация реализации v1 (156 персон,
  12 фич, a11y-чеклист); статус деплоя «ждёт dist-promotion» — УСТАРЕЛ (уже production-dist).
- `docs/refactor-2026/lanes/shared-genealogy-multiparent-2026-06-27.md` — фикс
  матриархов (multi-parent DAG); его строка «island not yet mounted» — УСТАРЕЛА
  на текущем HEAD (см. §7 Reverify).
- `docs/design-references/selected/01_genealogy_references/` — 9 визуальных референсов
  + контакт-лист; сегодняшние 2 скрина владельца — тот же язык (свет, кластеры,
  мини-карта, фокус-режим).

### S1.4. Статус маршрута и дискавери
- ownership: `/rodosloviye/` → astro, risk 2, **production-dist**;
  route-profile: `migrationMode: strict-native-app`, lane `special`, visualParity 0/0.
- В `sitemap.xml`, `search-manifest.json`, `public-content-baseline.json` — есть.
- **Входящих ссылок с сайта — ноль** (grep по главной, karty hub, каталогам,
  src/components) → Finding GEN-ORPHAN-01.

### S1.5. AuditRepo-контекст
- `verified/MASTER_BUG_MATRIX.md`: генеалогия упоминается только в системных
  находках покрытия аудит-скриптов (SHADOW-AUDIT-NARROW: rodosloviye среди
  непокрытых shadow-аудитом маршрутов; AUDIT-PRO-ROOT-ONLY / SEO-AUDIT-ROOT-ONLY:
  Astro-only страницы невидимы root-сканерам). Открытых багов самого генеалогического
  кода в canonical-матрице нет.
- Архивные intake: `DEEP_GENEALOGY_AND_THE_TWO_WORLDS_REPORT_2026-06-27` (arena-surgical-surgeon),
  `GENEALOGY_MAP_ANALYSIS` (arena-agent-6, 2026-06-25), `rodosloviye-route-regression-03e01a0`
  (arena-agent-independent-2) — исторические; их живое наследие (multi-parent фикс) уже
  в source. Параллельная сводка этих архивов готовится отдельным проходом и будет
  приложена comment'ом, если вскроет противоречия.
- Прецедент стратегии: `incoming/arena-agent-karty-strategy/2026-07-07/` (STRATEGY.md:
  4 закона, 6 фаз, atlas-grade критерии, ANTI-PATTERNS A1–A15). Генеалогия обязана
  не повторить: A2 (engine as afterthought), A5 (inline CSS-in-JS — сейчас ВЕСЬ стиль
  острова inline!), A9 (schema not data-driven), A4 (feature creep до фундамента).

## S2. Целевое видение (декомпозиция референсов)

| Элемент референса | Что это технически |
|---|---|
| Золотой хребет Адам→Ной→Авраам→Иаков→Давид→Христос (→ученики) | Постоянный слой L0; anchor-узлы, не исчезающие ни на одном зуме (ZMLT persistence) |
| Мега-узлы «+165 имён», «+318 имён», «12 колен», «Левиты», «Дом Давида», «Мф 1», «Лк 3», «Родственники Господа / традиция» | Кластеры-агрегаты с счётчиками; expand при зуме/клике в L1-вид (радиальный «расширенный вид» как у «12 колен») |
| Пунктирные микро-деревья вокруг кластеров | Превью-глифы кластера (декоративный намёк на содержимое, не интерактив) |
| Левая панель эпох (Сотворение…Исполнение, с датами) | Секционная навигация =ジャンп к якорям канвы; связана с TOC-паттернами сайта |
| Мини-карта, зум %, fullscreen, «Сбросить фокус» | Viewport-виджет движка |
| Поиск «Найти имя, место, ссылку…» | Индекс имён (ru/иврит/транслит/греч) + мест + ссылок на стихи |
| Фильтры «Все линии / Все периоды / Только якоря / Скрыть пустые» | Предикаты видимости поверх LOD |
| Быстрые ссылки (Адам→Иисус, 12 колен, Дом Давида, Мф 1, Лк 3, Женские фигуры, Опорные места, Хронология событий) | Сохранённые «виды» (viewport + фильтры + фокус) |
| «Фокус: линия Давида» (скрин 2) | Фокус-режим: подсветка пути + приглушение остального (уже есть в v1 — сохранить) |
| «Поделиться» / «Сохранить вид» | URL-state (?focus=&zoom=&filters=) + PNG/SVG-экспорт видимой области |
| «После Христа и раннехристианская традиция» (реф. 05) | Слой 2-й очереди: ученики/апостолы (Деян), братья Господни, деспосины — с пометкой «церковное предание» отдельно от канона |
| Легенда линий (мессианская/патриархи/цари/левитская/традиция/пунктир) | Токенизированные стили рёбер |
| Светлый пергамент (референсы) при тёмной теме сайта | Атлас обязан жить в ОБЕИХ темах сайта (html.dark контракт); light — базовый вид |

## S3. Внешнее исследование — решающие факты (65 источников: artifacts/)

1. ⚑ **SVG-порог**: комфорт до ~2–3k DOM-элементов, деградация 3–5k (svggenie,
   dev3lop, felt, PMC-бенчмарк: DOM ~500 анимируемых объектов, WebGL стабилен 5–10k).
   Карточка персоны ≈ 5–8 элементов ⇒ полный атлас = ~20k элементов = невозможно.
   **Следствие: LOD-агрегация обязательна; бюджет видимых карточек ≤ ~400–500.**
2. ⚑ **React Flow**: мейнтейнеры — «not intended … 1000+ nodes/edges», советуют canvas
   на таком масштабе (discussion #3003); оптимизации (onlyRenderVisibleElements, memo,
   collapse) продлевают жизнь, но потолок остаётся. RF-ядро уже стоит 136KB gz.
3. ⚑ **Layout на билде**: elkjs (ELK layered, Sugiyama с портами; web worker при
   необходимости) / Entitree Flex (family-специфика: супруги/братья) / dagre (уже в
   проекте) — все выполнимы в Node during build; в рантайме остаются pan/zoom и
   FLIP-морфинг между предвычисленными уровнями. Прецедент разделения данных и движка
   в проекте: karty `route.json` + MapEngine.
4. ⚑ **Датасеты**: TIPNR (CC BY 4.0, Tyndale; ВСЕ имена собственные, у персон
   parents/partners/siblings/offspring + исчерпывающие ссылки) — академическое ядро;
   Theographic (CC BY-SA 4.0; people/places/events/periods + verse-links; людей ~3k) —
   свидетель для сверки (share-alike не тянем в наш датасет); Wikidata (CC0; P22/P25,
   ru-labels) — русские имена; русские схемы (Полубоярцев ~1300, genealogistic ~1500,
   Азбука) — сверка русской номенклатуры.
5. ⚑ **Уроки прецедентов**: bible-family-tree (Canvas+d3-force на Theographic) —
   force-layout полного графа = «клубок», disconnected components реальны;
   complete-bible-genealogy.com — полнота без атлас-UX; Viz.Bible — курируемые
   постеры/интерактивы; UsefulCharts — визуальный язык, к которому близки референсы;
   MyHeritage 2025 — vertical cards + pinch/swipe на мобильном, отдельный
   «Relationship Diagram» для 10k+ деревьев.
6. **Semantic zoom теория**: ZMLT (arXiv 1906.05996) — 7 свойств (persistent,
   overlap-free, planar, compact…); semantic zoom ≠ фильтрация: уровни должны быть
   геометрически согласованы (anchor continuity) — прямое ТЗ на морфинг кластеров.

## S4. Вердикт по существующему коду

| Слой | Судьба | Почему |
|---|---|---|
| Маршрут `/rodosloviye/`, PageHead/SEO, legacy fallback | **Сохранить** | URL-капитал; strict-native-app уже назначен |
| `types.ts` (Person/Era/Disputed/Lineage) | **Сохранить и расширить** (v2: группы/кластеры, места, события, источники per-факт) | Модель честная, строгая |
| `data/genealogy/genealogy.json` (156) | **Сохранить как хронологический скелет** (MT AM, disputed, значимость) и влить в v2-датасет | РучнаяVerification-ценность высокая |
| Теология: disputed-узлы, линии, эпохи, золотая нить | **Сохранить** (канон контента: GENEALOGY-DEEP-ANALYSIS) | Дифференциатор проекта |
| UX-паттерны: DetailPanel, SplitView Мф/Лк, тур, фокус, keyboard-nav | **Сохранить как спецификацию**, перенести на новое ядро | Проверенные решения v1 |
| Рендер-ядро: React Flow + runtime dagre + hidden-based zoom | **Заменить** | Пределы RF (§S3.2), zoom без агрегатов ≠ референсы, layout в рантайме не тянет 3k+ |
| Inline-стили компонентов | **Заменить** (токены + scoped CSS) | Анти-паттерн A5; конфликт с темизацией html.dark |
| Данные как props острова (инлайн в HTML, 128K) | **Заменить** на lazy-чанки | Не масштабируется ×20 |
| TimelineAxis (overlay, не синхронизирован с канвой) | **Переписать** внутри сценграфа | Finding GEN-TIMELINE-01 |

Итог: **не «строить на костыле» и не «выбросить всё»**. Прототип = спецификация +
данные-скелет; ядро = новое, спроектированное до кода (доктрина STRAT-02).

## S5. Рекомендуемая архитектура

### S5.1. Модель данных v2 (источник правды)
```
data/genealogy/v2/
├── persons.json        # ~3–3.6k: id, names{ru,he,gr,translit,alt[]}, gender,
│                       #   parents[{id,type:birth|legal|levirate}], spouses[],
│                       #   tribe, era, roles[], refs[verse-ids], lineageFlags,
│                       #   chronology{mt,lxx,sam}?, disputed?, significance_ru?
├── groups.json         # кластеры атласа: nations-of-noah, tribes-12, levites,
│                       #   priests, house-of-david, matthew-1, luke-3,
│                       #   relatives-tradition, disciples… (id, членство, счётчики)
├── edges.json          # типизированные связи (parent/spouse/legal/tradition)
├── eras.json           # эпохи + AM/BC границы (MT-основа, LXX/Sam как варианты)
├── views.json          # «быстрые ссылки»: сохранённые viewport+фильтры+фокус
└── build/              # генерируется скриптами (НЕ руками):
    ├── layout-l0.json  # позиции хребта + кластеров
    ├── layout-l1/*.json# по-кластерные развёртки
    ├── layout-l2/*.json# чанки полного слоя (по эпохам/кластерам)
    └── search-index.json
```
Пайплайн (`scripts/genealogy-build/`, Node, запускается вручную + в CI):
TIPNR-парсер → нормализация персон/связей → merge со 156-скелетом (ID-мэппинг,
конфликты в отчёт) → русские имена: (а) выравнивание по Синодальному стиху первого
упоминания из TIPNR (полный Синодальный JSON — vendored вход; public domain),
(б) Wikidata ru-labels (SPARQL-дамп закоммичен, не runtime; NB: из sandbox-сессий
query.wikidata.org/Wikimedia API блокируются прокси (403) — гонять локально/CI),
(в) транслит-правила для остатка → валидаторы (0 orphans, 0 циклов parent-графа,
счётчики кластеров, покрытие русских имён %) → layout (ELK layered per-cluster +
кастом хребта по AM-оси) → чанки + индекс. Каждый факт — со ссылкой на стих(и);
спорное — `disputed`, «предание» — `tradition:true` (отдельный слой, как на реф. 05).
Лицензии: ядро TIPNR CC BY 4.0 + Wikidata CC0 + собственный труд ⇒ наш датасет —
CC BY 4.0 с атрибуцией Tyndale/STEPBible на странице «Об атласе»; Theographic —
только сверка (share-alike не наследуем). Нюанс TIPNR (шапка файла, дословно в
evidence/dataset-feasibility-probe §3): переформатирование под приложение явно
разрешено, но сырой файл НЕ перепубликуем (просьба STEPBible) — vendored build-input
в репо с README-атрибуцией, публичный артефакт — только производный atlas-JSON.

### S5.2. Движок (Решение №2 владельца; рекомендация — вариант B)

**B (рекомендуется): GenealogyAtlasEngine — собственное SVG-ядро.**
Vanilla TypeScript в `src/lib/genealogy-atlas/` (Astro-остров без React-рантайма),
d3-zoom (+d3-interpolate) поверх одного `<svg>`-сценграфа; узлы — `<g>` из шаблонов
(`<use>`-символы для глифов); виртуализация: рендерим только viewport∩LOD (бюджет
≤ ~500 карточек / ~1.5–2k элементов); FLIP-морфинг кластера в развёртку по
предвычисленным позициям; слои: рёбра-под, узлы, лейблы, оверлеи.
- ЗА: полный контроль LOD/морфинга (сердце референсов); ~30–50KB gz своего кода +
  ~15KB d3-zoom против 136KB gz RF+React (бюджет AGENTS: Lighthouse mobile ≥90);
  идеальная темизация токенами сайта (html.dark); соответствие философии проекта
  (vanilla ядро сайта; прецедент собственного MapEngine в karty); SVG-экспорт/печать
  «из коробки»; отсутствие зависимости от эволюции RF API.
- ПРОТИВ (честно): свой зум/минимапа/hit-testing/тесты — дороже по времени;
  React-компоненты v1 (DetailPanel/SplitView) переносятся на Astro/vanilla-шаблоны.

**A (fallback): React Flow 12 + жёсткий LOD.** Оставить RF, но: зарегистрированные
custom nodeTypes (не label-JSX), `onlyRenderVisibleElements`, данные fetch'ем,
кластеры как узлы-агрегаты, layout с билда. Быстрее достичь паритета v1, НО:
потолок RF на морфинге/тысячах рёбер, 136KB gz постоянного налога, инлайн-стили
переделывать всё равно. Приемлемо как мост, если владелец хочет видимый прогресс
раньше; ядро-B тогда Phase 3b.

**C (отвергнуто): Canvas/WebGL-ядро (Sigma/Pixi).** Масштаб не наш bottleneck при
LOD; теряем SVG-чёткость пергамента, простоту a11y-DOM, печать; владелец явно
заказал «SVG-отдел».

### S5.3. LOD-контракт (сердце UX)
- **L0 «Атлас»** (зум < ~0.35): хребет (8–12 якорей) + 10–14 мега-узлов кластеров
  с счётчиками + пунктирные превью; ~40–80 групп. Все якоря ZMLT-persistent.
- **L1 «Ветвь»** (0.35–0.8 или клик по кластеру): развёртка целевого кластера
  (радиальная — «12 колен», колоночная — «Мф 1»/«Лк 3»), соседи сжаты; 100–300 узлов.
- **L2 «Персоны»** (> 0.8): полные карточки в viewport, lazy-чанки, culling;
  ≤ 400–500 карточек одновременно.
- Переходы: анимированный морфинг позиций (300–450ms, prefers-reduced-motion →
  без анимации); позиция якорей неизменна между уровнями (anchor continuity).
- Фильтры/фокус — предикаты ПОВЕРХ LOD (не ломают агрегаты: кластер показывает
  «N видимых / M всего»).

### S5.4. Perf/качество-бюджеты (acceptance, замер в CI)
| Метрика | Бюджет |
|---|---|
| JS острова (gz) | ≤ 120KB (цель B: ≤ 70KB) |
| Initial data (gz) | ≤ 300KB (skeleton+L0/L1); чанки L2 lazy ≤ 80KB каждый |
| DOM-элементы одновременно | ≤ ~2 000 |
| Pan/zoom | 60fps desktop / ≥ 40fps средний мобильный (4× CPU throttle) |
| LCP страницы | < 2.5s (AGENTS §1.2), Lighthouse mobile ≥ 90 / a11y ≥ 95 |
| a11y | полная клавиатурная модель (v1-паттерн), SR-альтернатива (см. S5.5), reduced-motion |
| Офлайн | SW: shell precache; данные — runtime-cache (stale-while-revalidate) |

### S5.5. SEO/a11y статический слой (обязателен)
Атлас — canvas-опыт, но страница обязана нести статический, индексируемый,
скринридер-доступный слой: pre-rendered (build-time) HTML-оглавление атласа
(эпохи → кластеры → ключевые персоны с русскими именами и ссылками на стихи,
`data-pagefind-body`), `<noscript>`-вид, print-CSS. Это же — контент для
внутреннего поиска сайта (Pagefind) и llms.txt-слоя.

## S6. Куда и как вводить (интеграция)

1. **Маршрут:** `/rodosloviye/` (сохранить; бренд H1 «Библейский атлас родословий»,
   подзаголовок «От Адама до Иисуса Христа»). НЕ в `/karty/` (другой тип данных —
   решение masterplan; karty остаётся геокартами).
2. **Режим:** strict-native-app (уже в route-profile/ownership; регенерация матрицы
   не требуется, если профиль не меняем).
3. **Процесс:** только lane-ветки `lane/genealogy-atlas-<phase>`; Risk 2–3 (route
   component + data + scripts); из shared/high-risk файлов, вероятно, будут затронуты
   `data/search-manifest.json` (карточка/поиск), `sitemap.xml` (не меняется — URL тот же),
   главная (карточка) — координация обязательна; PremiumControls-зоны НЕ трогаем
   (in-flight, AGENTS §3.10).
4. **CSS/JS-политика:** новые файлы только внутри `src/**` (Astro-слой — разрешено);
   в `/css/`+`/js/` legacy-набор НЕ расширяем. Tailwind НЕ вводим (политика §2.1;
   пергамент строится на токенах сайта + scoped CSS).
5. **CSP/SW:** все ассеты и данные self-hosted (CSP `connect-src 'self' …yandex…` не
   меняется); шрифты уже локальные; SW precache — только shell атласа, данные в
   runtime-cache (не раздуваем precache-бюджет).
6. **Гейты перед merge каждого lane:** `npm run cache-bust` (если legacy-ассеты
   задеты) → `validate:static-publication` → `guard:shared-files` →
   `data:consistency` → `strangler:deploy-readiness` (route/app impact) →
   visual-audit + interactive-audit (добавить сценарии атласа: открытие, зум L0→L2,
   поиск, фокус, split-view) → Lighthouse-бюджеты §S5.4.
7. **Discoverability (закрыть GEN-ORPHAN-01):** карточка-блок на главной (dashboard),
   ссылка из `karty/index.html` hub («Инструменты»), перекрёстные ссылки из статей
   (Гилл-контекст, Кол да Винчи — родословие Марии/Иисуса), запись в llms.txt.
   Включать ссылки ТОЛЬКО при достижении atlas-grade (§S8) — до того маршрут живёт
   как сейчас (доступен, но не продвигается).
8. **Двойная правда на переходный период:** v1 (156, RF) остаётся на проде до
   паритета v2 по фичам+качеству; переключение — атомарный lane с visual-baseline
   до/после. Никаких «полурабочих» промежуточных состояний на проде.

## S7. Фазовый план (флагманская доктрина; месяцы, не спринты)

| Фаза | Содержание | Deliverables | Exit-критерий |
|---|---|---|---|
| **0. Решения** (дни) | 6 решений владельца (§S10) | решения записаны в AuditRepo | все 6 отвечены |
| **1. Фундамент данных** (4–8 нед) | пайплайн TIPNR→v2, merge 156-скелета, Wikidata ru, валидаторы, кластеризация | `scripts/genealogy-build/*`, `data/genealogy/v2/*`, DATA-VALIDATION-REPORT | 0 orphans/циклов; ≥98% персон с ru-именем (ключевые 100% редактированы); счётчики кластеров сверены с текстом; лицензии оформлены |
| **2. Контракт движка** (3–6 нед, дизайн-до-кода) | GENEALOGY-ENGINE-CONTRACT.md (сценграф, LOD, события, темы, a11y-модель, бюджеты), прототип морфинга (throwaway) | контракт + прототип-отчёт | владелец утвердил контракт; прототип держит бюджеты §S5.4 на реальном L0/L1 |
| **3. Флагман-рендер** (6–10 нед) | ядро B (или A-мост), L0/L1/L2, поиск, панель деталей, минимапа, фильтры, фокус, туры, URL-state, mobile-режим | остров v2 на lane-ветке | функциональный паритет с v1 + кластеры/полные данные; бюджеты в CI зелёные |
| **4. Контент и апологетика** (3–6 нед) | disputed-узлы (все), MT/LXX/Sam toggle, «после Христа» слой (предание отдельно), вехи/эпохи-тексты, статический SEO-слой | контент-ревью владельца | EDITORIAL-SOURCE-POLICY соблюдена; спорное помечено; статический слой индексируется |
| **5. QA + релиз** (2–4 нед) | visual-baseline, interactive-audit сценарии, a11y-аудит, перф-замеры на устройствах, THEN discoverability-ссылки | релизный lane + скрины базлайна | 8/8 atlas-grade (§S8); ссылки включены; 14-дневный freeze наблюдения |

Параллелизм допустим только между 1 и 2 (данные ‖ контракт). Фаза 5+ (расширения:
события/места-связки с karty, экспорт постера, EN-локаль) — отдельное решение после
месяца жизни релиза.

## S8. Atlas-grade критерии (acceptance gate, аналог karty STRAT-04)

1. **Визуальный**: соответствие референсам (свет/пергамент/золотой хребет/кластеры),
   обе темы сайта, без «generic-заглушек».
2. **Полнота**: все именованные персоны канона с русскими именами и ссылками на стихи;
   счётчик на странице честный (реальное число из данных, не «3254 с картинки»).
3. **Навигационный**: L0→L2 морфинг, поиск ≤ 2 действия до любой персоны, фокус-линии,
   быстрые виды, URL-share.
4. **Богословский**: MT-хребет + честные disputed-узлы с обеими позициями + слой
   предания отделён от канона (EDITORIAL-SOURCE-POLICY).
5. **Перф**: бюджеты §S5.4 в CI.
6. **A11y**: клавиатура, SR-слой, reduced-motion, контрасты (Lighthouse a11y ≥95).
7. **Издательский**: статический SEO/print-слой; JSON-LD (Dataset + WebPage);
   атрибуция источников данных.
8. **Честность данных**: валидаторы в CI (0 orphans, счётчики, % покрытия имён),
   DATA-VALIDATION-REPORT публичен в docs.

## S9. Риски (честно)

| Риск | Вероятность | Митигция |
|---|---|---|
| Русская номенклатура ~3k имён — большой ручной труд | ~~Высокая~~ → **Средняя** (понижено экспериментом: 8/9 имён извлекаются из Синодального стиха первого упоминания автоматически; evidence probe §5) | Механическое извлечение из стихов + версификационная таблица (STEPBible Versification) + Wikidata; редактура = выборочная сверка, ключевые ~500 — сразу |
| Совмещение TIPNR-ID ↔ 156-скелет ↔ Wikidata (Q-id) даст конфликты | Средняя | ID-мэппинг-таблица + конфликт-отчёт в Phase 1; спорные — вручную |
| Морфинг кластеров — сложнейшая часть рендера | Средняя | Phase 2 прототип ДО обязательств; fallback: жёсткое переключение уровней без морфинга (всё ещё atlas-grade minus) |
| Соблазн feature creep до фундамента (анти-паттерн A4) | Высокая | Фазовые exit-критерии; Phase 1 без единой строки UI |
| Двойная правда v1/v2 затянется | Средняя | v1 не развиваем вообще; переключение одним lane |
| Слабые мобильные (2–4× throttle) | Средняя | бюджеты в CI на throttled-профиле; L2-чанки мелкие; минимум фильтров на мобильном |
| CC BY-SA заражение при копировании Theographic | Низкая | ядро TIPNR/Wikidata; Theographic только как witness-сверка |

## S10. Решения владельца (Phase 0)

1. **Объём**: полная Библия (все именованные) — подтвердить. Ориентир из данных,
   не с картинки (~3–3.6k; точное число даст Phase 1).
2. **Движок**: B (свой SVG-движок, рекомендация) или A-мост (React Flow LOD) → B?
3. **Пост-Христос слой**: включаем учеников/апостолов + родню Господа/деспосинов
   (как реф. 05), с маркировкой «предание»? (рекомендация: да, Phase 4)
4. **Хронологии**: MT-основа + LXX/Самарянский toggle (рекомендация: да, как v1-доктрина).
5. **Бренд**: «Библейский атлас родословий» на `/rodosloviye/` — ок? (URL не меняем)
6. **Женские фигуры / линии**: отдельный фильтр-слой «Женские фигуры» (реф.) — да?

---

# Универсальные секции intake

## 1. New Findings

### GEN-STRAT-01
- Title: Целевой атлас (~3k персон) архитектурно недостижим на текущем ядре (RF runtime
  layout + hide-zoom + props-инлайн данных); требуется LOD-агрегация + build-time layout.
- Severity: P1 (блокирует стратегию раздела, не прод)
- Route/files: /rodosloviye/, src/components/genealogy/**
- Evidence: evidence/current-state-genealogy-2026-07-11.md §1,5; artifacts §D30, §F51-52
- Confidence: high · Verification: L0 (внешние источники + сборка)
- Suggested repair lane: lane/genealogy-atlas-* (Phase 1-3, §S7)

### GEN-ORPHAN-01
- Title: /rodosloviye/ — orphan-маршрут: 0 входящих ссылок с сайта (главная, karty hub,
  каталоги, компоненты), досягаем только из sitemap/поиска.
- Severity: P2 (discoverability производственного маршрута)
- Evidence: evidence §4 (grep)
- Confidence: high · Verification: L0
- Suggested repair: Phase 5 (§S6.7) — ссылки ПОСЛЕ atlas-grade; не чинить сейчас.

### GEN-SCALE-01
- Title: Данные острова сериализуются в HTML как props (128K страница при 88K JSON);
  при ×20 данных страница станет ~1.5–2MB — латентный блокер.
- Severity: P2 (latent)
- Evidence: evidence §1
- Confidence: high · Verification: L0
- Suggested repair: fetch-чанки в архитектуре v2 (§S5.1); не хотфиксить v1.

### GEN-UX-01
- Title: TimelineAxis — фиксированный overlay, НЕ синхронизирован с pan/zoom канвы
  (AM-шкала не движется с деревом; мапит AM на высоту вьюпорта).
- Severity: P3 (UX текущего v1)
- Evidence: src/components/genealogy/TimelineAxis.tsx:36-47 (position:absolute поверх
  вьюпорта) + GenealogyTree.tsx:253 (height=4200 при канве Y_SPAN=4200 — ось живёт в
  координатах экрана, канва в координатах мира)
- Confidence: medium (код-чтение; браузерного witness нет)
- Verification: L0
- Suggested repair: в движке v2 ось — слой сценграфа (§S5.2); v1 не трогать.

### GEN-UX-02
- Title: Legacy fallback rodosloviye/index.html: кнопка «Открыть родословие» ссылается
  на /rodosloviye/ — самоссылка (в Astro-slot исправлено на #genealogy-tree, legacy — нет).
- Severity: P3
- Evidence: rodosloviye/index.html:64 vs src/components/rodosloviye/RodosloviyeBody.astro:25
- Confidence: high · Verification: L0
- Suggested repair: попутно в Phase 3 lane (одна строка).

### GEN-CODE-01
- Title: Остров v1 нарушает анти-паттерн A5 (inline CSS-in-JS): все стили компонентов
  inline-объектами + <style> строкой в JSX; недоступен темизации html.dark.
- Severity: P3 (техдолг, станет P2 при развитии v1)
- Evidence: GenealogyTree.tsx:211-308, PersonNode.tsx:29-97 (сплошные style={{…}})
- Confidence: high · Verification: L0
- Suggested repair: не чинить в v1; в v2 — токены + scoped CSS (§S5.2).

## 2. Confirmations of Existing Findings
### Confirm (доктрина) arena-agent-karty-strategy STRAT-02/03/04
- Target: incoming/arena-agent-karty-strategy/2026-07-07/REPORT.md
- My evidence: настоящий отчёт применяет те же законы к генеалогии (§S7, §S8);
  запрос владельца 2026-07-11 дословно повторяет доктрину («не быстрый колхоз…
  мощный фундамент»).
- Recommended status: доктрина подтверждена вторым доменом (peer-reviewed).

## 3. Challenges / Disputes
### Challenge (stale) lane-doc shared-genealogy-multiparent-2026-06-27 «island not mounted»
- Target: gb-repo docs/refactor-2026/lanes/shared-genealogy-multiparent-2026-06-27.md
  (Status note) и GENEALOGY-ARCHITECTURE-2026-06-19.md («ждёт dist-promotion»)
- Reason: на HEAD 47cdf86 остров смонтирован (`client:only="react"`), сборка эмитит
  GenealogyTree.*.js в dist; route production-dist.
- Current HEAD evidence: evidence §1 (build output)
- Recommended status: **stale-on-current-head** (доки исторические, не баги).

## 4. Duplicate / Merge Proposals
— нет.

## 5. Severity Proposals
— нет (новые findings уже с severity).

## 6. Repair Lane Suggestions
- Bug IDs: GEN-STRAT-01, GEN-SCALE-01, GEN-UX-01, GEN-CODE-01 → lane/genealogy-atlas-*
  (Phases 1–3); GEN-UX-02 → попутно Phase 3; GEN-ORPHAN-01 → Phase 5 (последним).
- Why together: единый фундамент (данные→движок→рендер); чинить их в v1 по отдельности —
  двойная работа.
- What must NOT be mixed: PremiumControls (in-flight, AGENTS §3.10); правки js/site.js
  и глобальных CSS; karty engine.

## 7. Reverify Notes
- Bug: «GenealogyTree island not mounted» (lane-doc 2026-06-27)
- Current HEAD: 47cdf86
- Result: **fixed-current / stale** — остров смонтирован и собирается (evidence §1).

## 8. Notes for Verifier
- Это strategy-intake: findings секций 1–7 — L0; стратегия §S — proposal-open до
  решений владельца (§S10).
- Параллельно готовились: сводка архивных генеалогических intake AuditRepo и разбор
  интеграционных паттернов (Explore-агенты) + deep-research workflow c adversarial
  verify; их результаты будут приложены как comments/evidence-дополнения, если
  вскроют противоречия с этим отчётом. Ядро выводов от них не зависит (первичные
  источники и сборка — в evidence/artifacts этого intake).
- Просьба к verifier: (а) не поднимать GEN-* в матрицу до Phase 0 решений владельца;
  (б) проверить лицензионную сборку §S5.1 юридическим глазом (CC BY vs BY-SA);
  (в) счётчик «3 254» из референсов НЕ считать требованием — это иллюстрация.

## Files in this intake
- README.md — meta
- REPORT.md — этот файл
- evidence/current-state-genealogy-2026-07-11.md — сборка/инвентаризация/route-статус
- evidence/dataset-feasibility-probe-2026-07-11.md — скачанные и распарсенные
  Theographic (3 067 персон) и TIPNR (3 329 с родителями), лицензионный нюанс
- artifacts/web-research-sources-2026-07-11.md — 65 аннотированных источников + выводы
- commands.md — команды
