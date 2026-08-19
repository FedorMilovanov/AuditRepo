# Intake — Arena Bug Verifier: full-surface pass + MASTER re-verification wave

## Identity

- Project: `gb-is-my-strength`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Agent: Arena Agent (bugverifikator), audit-only — **никаких правок в Product не вносилось**
- Date: 2026-08-19 (repo-effective time; sandbox wall-clock показывал 2026-07-17 — используется repo-material time, как в disposition строки `METADATA-FUTURE-DATED`)
- Audited anchor: `cb3681e` (Product `main` HEAD на момент прохода, commit `feat(app): premium Bible App integration across site (#1725)`, 2026-08-19T00:30:04Z)
- Artifact identity: `https://gospod-bog.ru/_astro/index.FPviil9R.css`, `feed.xml` `lastBuildDate = Wed, 19 Aug 2026 00:30:04 GMT` (совпадает с HEAD-таймстампом → live построен из `cb3681e`)
- Live snapshot: `https://gospod-bog.ru` — 76 sitemap-маршрутов + 8 внесайтмэпных, снято в один проход
- Branch/event context: `main` @ `cb3681e`; открытые Product PR на момент прохода: **#1722** (`repair/wire-engine-contracts-20260819`), **#1721** (`repair/dist-css-astro-admission-20260819`) — обе CI/guard-полосы, пересечений с находками ниже нет
- Environment: read-only clone Product + live production fetch; без сборки (`npm ci` не выполнялся)
- Report type: `verifier-synthesis` (+ `browser-audit`/`production-like-dist-audit` witnesses, + `reverify` части)

## Witness model

| Код | Что означает в этом отчёте |
|---|---|
| W2-source | файл/строка в Product `cb3681e` |
| W3-artifact | опубликованный байт-артефакт (`/_astro/*.css`, `feed.xml`, `sitemap.xml`) |
| W4-live | HTML/ответ production `gospod-bog.ru` |
| W6-history | AuditRepo evidence / Product registry-файлы |

---

## 1. TL;DR

| # | ID | Класс | Что | Состояние |
|---|---|---|---|---|
| 1 | `RSS-SERIES-DATE-COLLAPSE` | defect (SEO/дистрибуция) | `feed.xml` берёт даты из `data/search-manifest.json`, а страницы — из своих PageHead-литералов. 58 items → всего 9 уникальных `pubDate`; серия «Баптисты России» (11 items) целиком склеена в одну дату и выдаётся подписчикам **в алфавитном**, а не в авторском порядке. Расхождение с JSON-LD страницы — до **17 дней**. | NEW · FAIL |
| 2 | `DATELINE-SITEMAP-LD-DIVERGENCE` | evidence-extension системной полосы | 40 маршрутов: `sitemap.xml lastmod` ≠ JSON-LD `dateModified`; все 43 записи `data/editorial-metadata.json` до сих пор `reviewStatus: inconsistent-needs-review`. | NEW witness для `METADATA-SSOT-PROLIFERATION` · FAIL |
| 3 | `APP-MASK-NO-WEBKIT-FALLBACK` | defect (кросс-браузер, low) | Новый `/app/` (из #1725) и `/map/` отдают `mask-image` **без** `-webkit-mask-image`, вопреки собственной конвенции проекта (`home.css`, `floating-cluster.css`, `site.css`, `HomeMain.astro` — везде пара). Аудитория `/app/` — Telegram Mini App, т.е. WebKit-тяжёлая. | NEW · FAIL |
| 4 | `MOBILE-CHROME-REGISTRY-GAPS` | MASTER residual | **Stale на live**: все 6 Genesis-6 article-маршрутов монтируют `mobile-bottom-bar`. Без бара только hub `/hard-texts/genesis-6/`. | RETIRE / перепишите границу |
| 5 | `MOBILECHROME-GENESIS6-BAR-DECISION` | MASTER owner decision | Решение снято с повестки: предпосылка (статьи без бара) не подтверждается на `cb3681e` + live. | RETIRE как moot |
| 6 | `SERIES-ORDER-INDEX-MISMATCH` | MASTER defect | **Invalid в текущей формулировке**: нумерация и порядок серии Гилла на live корректны (I → II → III «Экзегет» → IV «Наследие» → Справочник). Расходятся только *слаги* URL. | RE-FRAME (см. §4.3) |
| 7 | `ARTICLE-AUTHOR-HARDCODED` | MASTER defect (pending re-check) | Re-check выполнен: `src/layouts/ArticleLayout.astro` — **0 импортёров** на `cb3681e`, live-носителя нет. | INVALID / dead-code retirement |
| 8 | `RODOSLOVIYE-OG-IMAGE`, `SECURITY-CSP-INCONSISTENCY`, `FRAGMENTED-SECURITY-OWNERSHIP`, `GENEALOGY-ID-INVALID-SPACE`, `GENEALOGY-NO-ERROR-BOUNDARY`, `EDITORIAL-LABEL-INCONSISTENCY` | MASTER | Подтверждены как current на `cb3681e` + live, со свежими числами (§4). | KEEP |

Плюс §5 — **negative results** (что проверено и чисто) и §6 — что сознательно **не** предлагается в MASTER.

---

## 2. Новые находки

### 2.1 `RSS-SERIES-DATE-COLLAPSE` — даты и порядок в `feed.xml` не совпадают с самими статьями

- Signal class: контент-дистрибуция / SEO (не security)
- Exact anchor:
  - `data/search-manifest.json:658` — `"publishedTime": "2026-06-18T00:00:00+03:00"` для `/baptisty-rossii/noch-na-kure/` (и та же дата ещё у 10 маршрутов серии) [W2]
  - `src/components/baptisty-rossii/BaptistyRossiiDvaSezda1884PageHead.astro:28` — `"datePublished":"2026-06-03T00:00:00+03:00"` для `/baptisty-rossii/dva-sezda-1884/` [W2]
  - `scripts/rss-feed-normalizer.js:78` — `const published = parseDate(item.publishedTime, …)`; строка `96` — тай-брейк `left.route.localeCompare(right.route, 'ru')` [W2]
  - `https://gospod-bog.ru/feed.xml` [W3/W4]
- Proof state: **FAIL**

Наблюдение (live `feed.xml`, 58 items):

```text
уникальных <pubDate> ............ 9
крупнейшие группы-дубли ......... 12 / 11 / 10 / 6 items
серия «Баптисты России» ......... 11 items, все = Wed, 17 Jun 2026 21:00:00 GMT
```

Даты страниц той же серии (JSON-LD `datePublished`, live) различны и отражают авторский порядок:

| Позиция в серии (порядок на `/baptisty-rossii/`) | Страница | JSON-LD `datePublished` | `feed.xml` `pubDate` | Δ |
|---|---|---|---|---|
| 1 | `/baptisty-rossii/noch-na-kure/` | 2026-06-01 | 2026-06-17T21:00Z | **+408 ч** |
| 2 | `/baptisty-rossii/yuzhnaya-shtunda/` | 2026-06-02 | 2026-06-17T21:00Z | +384 ч |
| 3 | `/baptisty-rossii/dva-sezda-1884/` | 2026-06-03 | 2026-06-17T21:00Z | +360 ч |
| … | … | … | одна и та же | … |
| 10 | `/baptisty-rossii/spravochnik/` | 2026-06-10 | 2026-06-17T21:00Z | +192 ч |

Механизм (однозначный, из кода): `rss-feed-normalizer.js` берёт дату **только** из `search-manifest.json`; страница берёт дату из своего `*PageHead.astro`-литерала. Это два независимых источника одной и той же editorial-истины. Поскольку у всех 11 записей серии дата одинаковая, сортировка `byDate` вырождается, и порядок в фиде определяется `localeCompare` по слагу: подписчик получает `dva-sezda-1884` раньше `noch-na-kure`, т.е. 3-ю часть перед 1-й.

Такой же эффект (меньшего масштаба) у серии Гилла: `part1/part2/part3` в `search-manifest.json` = `2026-05-26`, а страницы отдают `2026-05-31T01:05+03:00` (Δ ≈ 121 ч).

Claim boundary: `cb3681e` + live `feed.xml` (`lastBuildDate` = 2026-08-19T00:30:04Z). Не проверялось: реакция конкретных RSS-читалок и Яндекс/Google-фидов.
Preservation boundary: правка должна менять **источник дат**, а не editorial-значения; политика `data/editorial-metadata.json` (`editorial-time-is-not-build-time`, `technicalCommitsMayChangeEditorialDates: false`) обязана сохраниться. Даты страниц выглядят каноничными, `search-manifest` — производным.
Semantic owner: `scripts/rss-feed-normalizer.js` + `data/search-manifest.json`; корневой владелец — системная полоса `METADATA-SSOT-PROLIFERATION`.

Почему это не «улучшение», а дефект: у RSS-подписчика (а также у любого агрегатора, читающего фид) серия из 11 материалов подаётся в порядке, который автор не выбирал, с датой, отличающейся от страницы до 17 дней — то есть публичный артефакт противоречит публичной странице.

### 2.2 `DATELINE-SITEMAP-LD-DIVERGENCE` — `sitemap.xml lastmod` ≠ JSON-LD `dateModified` на 40 маршрутах

- Exact anchor: `https://gospod-bog.ru/sitemap.xml` + JSON-LD соответствующих live-страниц [W3+W4]; реестр `data/editorial-metadata.json` [W2/W6]
- Proof state: **FAIL** (как evidence, не как отдельная строка MASTER)

Примеры: `/nagornaya/chast-1..5/` — sitemap `2026-07-09` vs LD `2026-06-22`; `/baptisty-rossii/*` — sitemap `2026-07-03` vs LD `2026-06-13`; `/articles/chto-bibliya-nazyvaet-serdcem/` — sitemap `2026-07-14` vs LD `2026-07-11`.

Важно: проект **уже знает** об этом — `data/editorial-metadata.json` хранит для `/articles/chto-bibliya-nazyvaet-serdcem/` наблюдения `jsonLdModifiedAt 2026-07-10T21:00Z`, `sitemapLastmod 2026-07-14T18:00Z`, `rssPublishedAt 2026-07-11T21:00Z` и статус `inconsistent-needs-review`. Свежий факт этого прохода: **43 из 43** записей реестра по-прежнему в статусе `inconsistent-needs-review` на `cb3681e`, т.е. полоса не сдвинулась, а публичные артефакты (sitemap/RSS/страница) продолжают расходиться.

Рекомендация: не заводить отдельную строку MASTER, а прикрепить §2.1 + §2.2 как *измеримую границу закрытия* к существующей системной полосе `METADATA-SSOT-PROLIFERATION` (см. §7): «один источник editorial-дат для страницы, sitemap, RSS и search-manifest; 0 записей `inconsistent-needs-review`».

### 2.3 `APP-MASK-NO-WEBKIT-FALLBACK` — новый `/app/` теряет маску на старом WebKit

- Signal class: кросс-браузерный рендеринг (декоративный слой)
- Exact anchor:
  - `src/pages/app/index.astro:138` — `mask-image: linear-gradient(...)`, `-webkit-mask-image` отсутствует [W2]
  - `src/components/map/MapStyles.astro:255` и `:451` — то же самое [W2]
  - Артефакт: `https://gospod-bog.ru/_astro/index.FPviil9R.css` → `mask-image:linear-gradient(#000,#00000061 45%,#0000 90%)`, префиксной пары в файле нет (0 вхождений `-webkit-mask`) [W3]
  - Конвенция проекта (контрпримеры): `src/components/home/HomeMain.astro:103-104`, `css/home.css:606-607`, `css/floating-cluster.css:1285`, `css/site.css` — везде пара prefixed+unprefixed [W2/W3]
- Proof state: **FAIL** (source + artifact); **UNPROVEN** для конкретного устройства — реального iOS < 15.4 в этом проходе не было
- Claim boundary: `cb3681e`; только `/app/` и `/map/`
- Preservation boundary: правка чисто аддитивная (добавить `-webkit-mask-image` рядом), визуал современных браузеров не меняется
- Semantic owner: `/app/` (лендинг Mini App) + `/map/`; тот же владелец, что и у #1725

Механизм: WebKit до 15.4 поддерживает только `-webkit-mask-image`. Без пары градиентная маска игнорируется, и декоративная сетка `body::before` (opacity .28) остаётся видимой на всю высоту вместо затухания. Ущерб — косметический, но именно `/app/` — точка входа в Telegram Mini App, где доля старого iOS-WebKit максимальна, а страница целиком построена на «премиальном» визуале.

---

## 3. Что сознательно НЕ подано как дефект

Правила репо запрещают называть багом любое улучшение; ниже — то, что нашлось, но проверку на «текущую необходимость» не прошло:

| Наблюдение | Почему не дефект |
|---|---|
| 226 `<button>` без `type` на 63 live-страницах | Проверено: **0** таких кнопок находится внутри `<form>` → поведенческого эффекта нет. Историческая строка `HTML-BTN-TYPE` корректно отсутствует в MASTER. Максимум — lint-правило в `WORK_QUEUE.md`. |
| 7 маршрутов `/karty/*` нет в `sitemap.xml` | Корректно: все 7 отдают `robots: noindex, follow` («временно на визуальном аудите»). Sitemap-контракт согласован. |
| 59 «висячих» ссылок `children` в `data/genealogy/genealogy.json` (Таблица народов: `joktan`, `ishmael`, `sidon`, …) | Согласовано с моделью данных: `computeFocusLineage` фильтрует через `byId.has(childId)`, узлы не рисуются. Это граница моделирования, а не поломка. Полезно зафиксировать инвариант в `relations.schema.json`, но это не работа для MASTER. |
| `pagefindStaticCacheFirst` в `sw.js` (cache-first для `/pagefind/*.js|wasm` при `CACHE_VERSION = gb-v197-…-20260804`) | Гипотеза о рассинхроне со свежесобранным индексом; runtime-свидетеля нет → **UNPROVEN**, в MASTER не подаётся. Кандидат в `WORK_QUEUE.md` с обязательным измерением. |
| `SearchAction` `urlTemplate = https://gospod-bog.ru/?q={search_term_string}` при `Disallow: /*?*` в `robots.txt` | Формальная несогласованность, но sitelinks-searchbox давно не отображается Google, а сам поиск на `/?q=` работает (есть browser-contract). Ценность правки не доказана. |
| `role="img"` на кольцевом прогрессе (`#gbs2DualProgress`) вместо `role="progressbar"` | Значение всё равно озвучивается через `aria-label`; выигрыш спорный, отдельного witness нет. |

---

## 4. Re-verification существующих строк MASTER (anchor `cb3681e` + live)

### 4.1 `MOBILE-CHROME-REGISTRY-GAPS` → **stale, снять**

MASTER утверждает: Genesis-6 статьи (`/hard-texts/enoh-…`, `/kniga-enoha-…`, `/mozhno-li-doveryat-1-enohu-…`) не монтируют мобильный нижний бар.

Live (`grep -c 'mobile-bottom-bar'`):

```text
/hard-texts/genesis-6/                                         0   ← hub, не статья
/hard-texts/enoh-prorochestvoval-iuda-14-15-4q204/             1
/hard-texts/kniga-enoha-kotoroy-ne-bylo-…/                     1
/hard-texts/mozhno-li-doveryat-1-enohu-kanonicheskiy-audit/    1
/hard-texts/angely-pod-mrakom-iuda-6-7-2-petra-2/              1
/hard-texts/duhi-v-temnice-noi-kreshchenie-pobeda/             1
/hard-texts/blagovestie-mertvym-1-petra-4-5-6/                 1
```

Source-подтверждение цепочки: `Genesis6ArticlePage.astro:4` → `SeriesReaderChrome.astro` → `GillSeriesChrome.astro` → `GillSeriesMobileBar.astro` → `MobileChromeShell.astro` (единственный носитель `mobile-bottom-bar` вместе с `GillContextPageHead.astro`). На live баре стоит `data-fc-variant="gill"` — движок общий, имя легаси.

Вывод: остаток закрыт кодом (2 witness: W2+W4). Остаточная поверхность — только hub `/hard-texts/genesis-6/`, который по типу является листингом, а не читаемой статьёй.

### 4.2 `MOBILECHROME-GENESIS6-BAR-DECISION` → **moot, снять**

Решение владельца формулировалось поверх §4.1. Предпосылка не подтверждается → вопрос «нужен ли бар статьям Genesis-6» уже решён кодом (нужен и стоит). Если владелец захочет бар на hub-странице — это новая, отдельная и необязательная работа.

### 4.3 `SERIES-ORDER-INDEX-MISMATCH` → **invalid как сформулировано; остаётся слаг-остаток**

MASTER: «`GILL_SERIES_ITEMS` ставит part4 перед part3 и метит part4 как III / part3 как IV; live + артефакт показывают искажённую навигацию».

Что на самом деле (live, `cb3681e`):

| URL | `<h1>` / `<title>` на live | Метка в `gillSeriesData.ts` |
|---|---|---|
| `/articles/dzhon-gill-chast-4-ekzeget/` | «Джон Гилл (1697–1771). **Часть III: Экзегет**» | `mark: III` (строка 82) |
| `/articles/dzhon-gill-chast-3-nasledie/` | «Джон Гилл (1697–1771). **Часть IV: Наследие**» | `mark: IV` (строка 90) |

Навигация next-card на live: `…chast-2-uchenyi/` → `…chast-4-ekzeget/` (Часть III) → `…chast-3-nasledie/` (Часть IV) → `…spravochnik/`. То есть читатель проходит I → II → III → IV → Справочник **без искажения**; `GILL_SERIES_ITEMS` согласован с контентом страниц, а не противоречит ему.

Расходятся только **слаги**: `chast-4-*` содержит Часть III, `chast-3-*` — Часть IV. Это URL-семантика (легаси публикации), а не сломанная навигация.

Рекомендация: строку в текущей формулировке снять как invalid; при желании владельца завести отдельный **migration-класс** пункт `GILL-SLUG-NUMBERING-LEGACY` (низкий приоритет; правка требует 301-редиректов, обновления sitemap/RSS/manifest/канонов — цена выше пользы, кандидат скорее в `WORK_QUEUE.md`).

### 4.4 `ARTICLE-AUTHOR-HARDCODED` → **re-check выполнен: invalid (dead carrier)**

MASTER явно требовал live-carrier re-check. Результат:

- `grep -rn "ArticleLayout" src --include=*.astro --include=*.ts --include=*.tsx` → **ни одного импортёра**, кроме самого файла [W2];
- статьи на live рендерятся per-article «пилотами» (`src/pages/articles/lot-i-sodom/index.astro` → `LotPageHead/LotPageChrome/LotArticleBody`, и т.д.), а не `ArticleLayout.astro`;
- литерал `data.author === 'abner-chou'` (`src/layouts/ArticleLayout.astro:19-20`) живёт только в мёртвом файле; на live «Абнер Чау» приходит из своих пилотов (`HermenevtikaPageHead.astro` и др.).

Вывод: строка `invalid` (нет current carrier). Полезная остаточная работа — **retirement** мёртвого `ArticleLayout.astro`, и это правильнее вести внутри `METADATA-SSOT-PROLIFERATION`, а не отдельной строкой дефекта.

### 4.5 Подтверждено как current (оставить в MASTER)

| ID | Свежее свидетельство на `cb3681e` + live |
|---|---|
| `RODOSLOVIYE-OG-IMAGE` | live `/rodosloviye/`: `og:image = /images/og-karty-1200x630.webp` при `og:image:alt = «Родословие от Адама до Христа — интерактивное древо»` [W4] |
| `SECURITY-CSP-INCONSISTENCY` + `FRAGMENTED-SECURITY-OWNERSHIP` | 84 live-страницы: **5** различных значений `img-src` (группы 40/22/12/2/1), **7 страниц вообще без CSP-meta** (`/articles/dzhon-gill-chast-1..4/`, `…-istoricheskiy-kontekst/`, `…-spravochnik/`, `…hermenevticheskaya-otsenka…/`), **18 страниц без `X-Content-Type-Options`** [W4] |
| `GENEALOGY-ID-INVALID-SPACE` | `data/genealogy/genealogy.json:1395` `"id": " lud_shem"` + ссылка `:403`; id↔ref по-прежнему самосогласованы → латентно, не видимая поломка [W2] |
| `GENEALOGY-NO-ERROR-BOUNDARY` | `grep -rn "ErrorBoundary\|componentDidCatch\|getDerivedStateFromError" src` → **0 совпадений** во всём `src/`; React-остров `GenealogyTree.tsx` монтируется на `/rodosloviye/` без границы ошибок [W2] |
| `EDITORIAL-LABEL-INCONSISTENCY` | `src/components/ui/Header.astro:18` «Разбор заблуждений» vs `src/data/site.ts:21-22` `SECTION_META['hard-texts'].label = 'Трудные тексты'` [W2] |

---

## 5. Negative results (проверено — чисто)

Фиксирую явно, чтобы следующие проходы не тратили время и чтобы «отсутствие находок» не путали с «не проверяли».

| Проверка | Объём | Результат |
|---|---|---|
| Доступность маршрутов sitemap | 76 URL | 76 × HTTP 200 |
| Внутренние ссылки/ресурсы на live | 201 уникальная цель | 201 × HTTP 200, битых нет |
| Якоря `#fragment` внутри страниц | все `href="#…"` на 84 страницах | 0 битых целей |
| JSON-LD | все `application/ld+json` на 84 страницах | 0 ошибок парсинга |
| `canonical` / `og:url` | 84 страницы | 0 расхождений, 0 дублей канона, 0 отсутствующих |
| Дубли DOM-`id` | 84 страницы | 0 |
| Висячие `aria-labelledby/-describedby/-controls/-owns/for` | 84 страницы | 0 |
| `h1` на страницу | 84 страницы | ровно 1 везде |
| `img` без `alt` | все `<img>` | 0 |
| `target="_blank"` без `rel=noopener/noreferrer` | все ссылки | 0 |
| `tabindex > 0` | все страницы | 0 |
| Precache-лист `sw.js` | 30 ассетов | 30 × HTTP 200 |
| Арифметика хронологии в `genealogy.json` (`birthAM + lifespan = deathAM`) | все MT-записи | 0 расхождений (2 известных текстовых кейса: Сим/Ной, Сарра/Фарра — редакционные, не ошибки данных) |
| Дубли и симметрия parent/child в `genealogy.json` | 156 персон | 0 дублей id, 0 асимметрий |
| Golden path `traceGoldenPath` | от `jesus` вверх | 77 узлов, обрывов нет; ветка Матфея — отдельная линия по замыслу |
| Маппинг Bible-App CTA (#1725) | 2 страницы | `1 Петра 3` → `ch3`, `1 Петра 4` → `ch4` — корректно |

## 6. Ограничения прохода

- Браузерного рендеринга (Playwright/devtools) не было: находки уровня «упало в рантайме», перф-метрики и мобильные жесты в этот проход не проверялись.
- Сборка не запускалась (`npm ci` не выполнялся) → guard-скрипты Product не воспроизводились локально; выводы о CI сделаны только по чтению `.github/workflows/*` и по совпадению `feed.xml lastBuildDate` с HEAD.
- Реальных устройств iOS/старого WebKit не было → §2.3 доказан на уровне source+artifact, не на устройстве.
- Проверялись публичные поверхности; приватные/Telegram-стороны Mini App вне периметра.

## 7. Предлагаемые дельты MASTER (решение — за верификатором/владельцем)

Добавить:

1. `RSS-SERIES-DATE-COLLAPSE` — current defect (§2.1). Наименьший корневой уровень правки: один источник editorial-дат для страницы и `search-manifest.json` (генерация manifest-дат из реестра `data/editorial-metadata.json`), плюс детерминированный тай-брейк сортировки по порядку серии, а не по слагу.
2. `APP-MASK-NO-WEBKIT-FALLBACK` — current defect, low (§2.3), правка аддитивная, 3 строки.

Снять:

3. `MOBILE-CHROME-REGISTRY-GAPS` — stale (§4.1).
4. `MOBILECHROME-GENESIS6-BAR-DECISION` — moot (§4.2).
5. `SERIES-ORDER-INDEX-MISMATCH` — invalid как сформулировано (§4.3); при желании — новый migration-пункт про слаги (скорее `WORK_QUEUE.md`).
6. `ARTICLE-AUTHOR-HARDCODED` — invalid, dead carrier (§4.4); retirement `ArticleLayout.astro` поглощается `METADATA-SSOT-PROLIFERATION`.

Уточнить границу закрытия существующей полосы:

7. `METADATA-SSOT-PROLIFERATION` — добавить измеримый критерий: «страница, `sitemap.xml`, `feed.xml` и `search-manifest.json` берут editorial-даты из одного источника; в `data/editorial-metadata.json` 0 записей со статусом `inconsistent-needs-review` (сейчас 43/43)».

После такой волны активная матрица: 12 → 10 строк (8 defects: 6 подтверждённых + 2 новых; 0 improvements; 0 residuals; 2 system lanes; 0 owner decisions).

## 8. Воспроизводимость

`tools/` в этой папке содержит ровно те скрипты, которыми получены числа выше:

```bash
python3 tools/live_crawl.py     # тянет sitemap + все страницы в ./live
python3 tools/scan_live.py      # canonical/og/JSON-LD/дубли id/заголовки
python3 tools/scan_a11y.py      # aria-ссылки, button type, alt, tabindex, h1
```

Числа §2.1/§2.2 воспроизводятся сравнением `feed.xml` `pubDate` и `sitemap.xml` `lastmod` с JSON-LD тех же live-страниц; §2.3 — `grep -n "mask-image" src/pages/app/index.astro src/components/map/MapStyles.astro` и `curl -s https://gospod-bog.ru/_astro/index.FPviil9R.css | grep -c webkit-mask`.
