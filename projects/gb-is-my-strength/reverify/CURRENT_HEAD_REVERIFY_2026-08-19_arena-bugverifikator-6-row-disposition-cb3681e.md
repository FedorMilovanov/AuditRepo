# Post-`cb3681e` reverify — 7 MASTER rows, 2 admissions, 1 self-correction

**Date:** 2026-08-19
**Agent:** Arena Agent (bugverifikator, arena)
**Audited anchor:** Product `main` `cb3681e` (`feat(app): premium Bible App integration across site (#1725)`, 2026-08-19T00:30:04Z)
**Artifact identity:** `https://gospod-bog.ru/_astro/index.FPviil9R.css`; `feed.xml` `lastBuildDate = Wed, 19 Aug 2026 00:30:04 GMT` (совпадает с HEAD-таймстампом → live построен из `cb3681e`)
**Live snapshot:** `https://gospod-bog.ru`, 84 страницы (76 из `sitemap.xml` + 8 внесайтмэпных `noindex`), два независимых прохода (первый — интейк, второй — контрольный пересчёт CSP/SW)
**AuditRepo base:** `main` `bb7bd81` (перебазировано трижды: `935fe31` → `98f6a3d` → `5445949` → `bb7bd81`, по мере параллельных волн других агентов)
**Intake lineage:** `incoming/arena-bugverifikator/2026-08-19/`, `incoming/2026-08-19-comment-missing-button-type.md`
**Production claim:** `yes` (live-witness использован как решающий для 5 из 7 диспозиций)

Документ оформлен как reverify (а не только запись в ledger), потому что: (а) он снимает строку owner-decision, (б) содержит **опровержение собственного раннего утверждения** этого же агента, (в) касается security-полосы, где по протоколу нужны независимые углы.

---

## 0. Self-correction: снимаю собственное утверждение о «7 страницах без CSP»

В `incoming/arena-bugverifikator/2026-08-19/README.md` §4.5 было заявлено: «7 страниц вообще без CSP-meta» (6 Gill-пилотов + hermenevtika).

**Это неверно.** Причина — регулярка первого прохода требовала порядок атрибутов `http-equiv=…` → `content=…`, а на пилотных страницах Astro эмитит `content=…` → `http-equiv=…`. Контрольный проход с порядко-независимым разбором `<meta>`:

```text
live pages parsed .................. 84
pages without CSP meta ............. 0      (было заявлено 7 — ОШИБКА ПЕРВОГО ПРОХОДА)
pages without X-Content-Type-Options 18
distinct img-src variants .......... 5
distinct full CSP strings .......... 8
```

Следствия:

- строка MASTER `SECURITY-CSP-GAPS` **корректна как есть** («Article pilots all have CSP»); мой ранний контр-witness к ней отзывается;
- строка `SECURITY-CSP-INCONSISTENCY` подтверждается, но её числа устарели: в ней «4 distinct `img-src` variants across 61 CSP-bearing heads», фактически на live **5 вариантов `img-src` и 8 различных полных CSP-строк на 84 CSP-несущих страницах**;
- 18 страниц без `X-Content-Type-Options` (`/`, `/app/`, `/map/`, `/rodosloviye/`, `/izbrannoe/`, `/konfessii/*`, `/karty/*`, `/hard-texts/genesis-6/`) — это ровно та поверхность, которую и должна закрыть полоса `FRAGMENTED-SECURITY-OWNERSHIP`.

Метод-урок для следующих проходов: HTML этого проекта **нельзя** матчить регулярками с фиксированным порядком атрибутов — Astro-пилоты и BaseLayout эмитят разный порядок. Тот же класс ошибки ранее давал ложное «NO canonical» на 7 Gill-страницах.

---

## 1. `MOBILE-CHROME-REGISTRY-GAPS` → **stale, снять**

- Original claim: Genesis-6 article pages (`/hard-texts/enoh-…`, `/kniga-enoha-…`, `/mozhno-li-doveryat-1-enohu-…`) render via `Genesis6ArticlePage` and mount no mobile bottom bar.
- W4-live (`cb3681e`), счётчик `mobile-bottom-bar` в отданном HTML:

  ```text
  /hard-texts/genesis-6/                                        0   ← hub-листинг, не статья
  /hard-texts/enoh-prorochestvoval-iuda-14-15-4q204/            1
  /hard-texts/kniga-enoha-kotoroy-ne-bylo-…/                    1
  /hard-texts/mozhno-li-doveryat-1-enohu-kanonicheskiy-audit/   1
  /hard-texts/angely-pod-mrakom-iuda-6-7-2-petra-2/             1
  /hard-texts/duhi-v-temnice-noi-kreshchenie-pobeda/            1
  /hard-texts/blagovestie-mertvym-1-petra-4-5-6/                1
  ```

- W2-source: `Genesis6ArticlePage.astro:4` → `SeriesReaderChrome.astro` → `GillSeriesChrome.astro` → `GillSeriesMobileBar.astro` → `MobileChromeShell.astro`; `mobile-bottom-bar` порождается только `MobileChromeShell.astro` и `GillContextPageHead.astro`. На live у бара `data-fc-variant="gill"`, `data-gill-mobile-bar="true"` — движок общий, имя легаси.
- Disposition: **stale (closed-by-code)**. Остаточная поверхность — только hub `/hard-texts/genesis-6/`; это листинг, а не читаемая длинная статья, и требование бара для него никем не доказано.

## 2. `MOBILECHROME-GENESIS6-BAR-DECISION` → **moot, снять**

Решение владельца формулировалось как «(a) подключить бар статьям Genesis-6 / (b) оставить без бара». Вариант (a) **уже реализован в коде** (см. §1), поэтому решение не блокирует никакую работу. По операционной модели owner decision остаётся в MASTER, только пока без него нельзя продолжать; здесь продолжать уже нечего.

## 3. `SERIES-ORDER-INDEX-MISMATCH` → **invalid как сформулировано, снять**

- Original claim: «`GILL_SERIES_ITEMS` orders `part4` before `part3` and labels part4 `III` / part3 `IV`; live + artifact show distorted in-series nav (part4→next part3)».
- Факт данных подтверждён: `gillSeriesData.ts:82` — `id: "part4"`, `mark: III`; `:90` — `id: "part3"`, `mark: IV`.
- Но W4-live показывает, что это **соответствие контенту, а не искажение**:

  | URL | `<h1>` / `<title>` на live | mark |
  |---|---|---|
  | `/articles/dzhon-gill-chast-4-ekzeget/` | «Джон Гилл (1697–1771). **Часть III: Экзегет**» | `III` |
  | `/articles/dzhon-gill-chast-3-nasledie/` | «Джон Гилл (1697–1771). **Часть IV: Наследие**» | `IV` |

- Навигация next-card на live: `chast-2-uchenyi` → `chast-4-ekzeget` (Часть III) → `chast-3-nasledie` (Часть IV) → `spravochnik`. Читатель проходит I → II → III → IV → Справочник **без искажения**. `BreadcrumbList` на обеих страницах согласован с заголовками.
- Disposition: **invalid как сформулировано**. Реальный остаток — только расхождение *слага* и номера части (легаси публикации). Это не дефект навигации, а URL-семантика; правка требует 301-редиректов + синхронизации sitemap/RSS/manifest/каноникалов, поэтому уходит в `WORK_QUEUE.md` как `GILL-SLUG-NUMBERING-LEGACY`, а не в MASTER.

## 4. `ARTICLE-AUTHOR-HARDCODED` → **invalid (dead carrier), снять**

Строка была помечена в MASTER как *pending live-carrier re-check*. Проверка выполнена:

- `grep -rn "ArticleLayout" src --include=*.astro --include=*.ts --include=*.tsx` → **0 импортёров** на `cb3681e`, кроме самого файла;
- статьи собираются per-article пилотами (`src/pages/articles/lot-i-sodom/index.astro` → `LotPageHead`/`LotPageChrome`/`LotArticleBody` и аналогично для остальных);
- литерал `data.author === 'abner-chou'` (`src/layouts/ArticleLayout.astro:19-20`) существует только в мёртвом файле; на live атрибуция переводов приходит из собственных пилотов (`HermenevtikaPageHead.astro` и др.).

Disposition: **invalid** (нет current carrier). **Конвергенция:** пока шёл этот проход, строка была независимо снята коммитом `c55b5b5` («drop ARTICLE-AUTHOR-HARDCODED, invalid, dead code»); настоящий census (0 импортёров) подтверждает то решение, а не переоткрывает его. Полезный остаток — retirement мёртвого `ArticleLayout.astro`; он поглощается полосой `METADATA-SSOT-PROLIFERATION`, где уже зафиксировано, что `ArticleLayout.seriesNames` — dead code. Это согласуется с ранее снятой строкой `ARTICLE-LAYOUT-SERIES-HARDCODE` (тот же носитель, та же причина).

## 5. `SW-PWA-FRESHNESS` → **исходная формулировка опровергнута; принимаю сужение волны wave5**

- Original claim (в редакции до 2026-08-19): «Currently `cacheFirst` without `?v=` prevents updates to `reader-preferences.js` without manual SW version bump».
- W2-source: маршрутизация `fetch` в `sw.js:337` — `isStaticAsset(url) ? (isRevisioned(url) ? revisionedStaticNetworkFirst : isNetworkFirstRuntime(url) ? networkFirstWithCache : cacheFirst)`, где `isRevisioned(url) = url.searchParams.has('v')` (`:94`).
- W4-live: на **84 из 84** страниц рантайм-скрипты подключены ревизионно (`/js/reader-preferences.js?v=63b588b5`, `/js/reader-preferences-head.js?v=2db7a79e`, `/js/reader-state.js?v=b3deb501`, `/js/search.js?v=106d65f6`). Безверсионных загрузок рантайм-JS на live нет.
- Значит широкая формулировка неверна: для страниц действует network-first, а смена `?v=` в любом случае меняет ключ кэша.
- **Параллельная волна wave5 (`98f6a3d`) уже переписала строку** ровно в эту сторону и сохранила более узкий и корректный остаток: голая precache-запись `/js/reader-preferences.js` в `sw.js` L44 без `?v=` — при безверсионном обращении (старый SW, прямая навигация, легаси-страница) она отдаётся `cacheFirst` и стареет до подъёма `CACHE_VERSION`.
- Disposition: **строку не снимаю.** Принимаю формулировку wave5 как лучшую (она нашла механизм, который я видел, но не довёл), добавляю к ней свой live-witness: остаток латентный, ни один текущий live-путь его не достигает. Это дедупликация двух проходов в одну строку, а не конкурирующее решение.
- Отдельный, **не** опровергнутый и **не** доказанный остаток: `pagefindStaticCacheFirst` (cache-first для `/pagefind/*.js|wasm` при `CACHE_VERSION = gb-v197-…-20260804`). Runtime-witness отсутствует → `WORK_QUEUE.md` как `PAGEFIND-STATIC-FRESHNESS-MEASUREMENT`, не в MASTER.

## 6. `SITEWIDE-BTN-TYPE-AUDIT` (system lane) → **факт подтверждён, механизм уточнён**

Независимый W4-live witness к source-скану (47 инстансов в 20 файлах `src/`): в отданном HTML **226** `<button>` без `type` на **63** из 84 страниц. Но:

```text
type-less <button> внутри <form> ... 0 из 226
элементов с атрибутом form="…" ..... 0
```

`type="submit"` — значение по умолчанию, однако submit срабатывает только у кнопки, ассоциированной с формой. На `cb3681e` таких нет → поведенческого ущерба сегодня нет; это латентная ловушка сопровождения (плюс copy-paste кластер `NagornayaChrome ×7`). Полоса остаётся, формулировка «causing default submit behavior» должна быть заменена на латентную. Подробности: `incoming/2026-08-19-comment-missing-button-type.md`.

## 7. Подтверждены как current (остаются)

| ID | Свежий witness |
|---|---|
| `RODOSLOVIYE-OG-IMAGE` | live `/rodosloviye/`: `og:image = /images/og-karty-1200x630.webp` при `og:image:alt = «Родословие от Адама до Христа — интерактивное древо»` |
| `GENEALOGY-ID-INVALID-SPACE` | `data/genealogy/genealogy.json:1395` `" lud_shem"` + ссылка `:403`; id↔ref самосогласованы → латентно |
| `GENEALOGY-NO-ERROR-BOUNDARY` | `grep -rn "ErrorBoundary\|componentDidCatch\|getDerivedStateFromError" src` → 0 совпадений во всём `src/` |
| `EDITORIAL-LABEL-INCONSISTENCY` | `Header.astro:18` «Разбор заблуждений» vs `site.ts:21-22` `SECTION_META['hard-texts'].label = 'Трудные тексты'` |
| `SECURITY-CSP-INCONSISTENCY` | подтверждена, числа обновлены: 5 вариантов `img-src`, 8 полных CSP-строк, 84 CSP-несущих страницы, 18 без `X-Content-Type-Options` |
| `SECURITY-CSP-GAPS` | подтверждена как narrowed; мой контр-witness отозван (§0) |

## 8. Две новые admission-строки

| ID | Класс | Обоснование необходимости сейчас |
|---|---|---|
| `RSS-SERIES-DATE-COLLAPSE` | current defect | Публичный артефакт противоречит публичной странице: `feed.xml` (58 items) содержит всего 9 уникальных `pubDate`; серия «Баптисты России» — 11 items с одной датой, расхождение с JSON-LD страниц до 17 дней, порядок в фиде — алфавитный по слагу вместо авторского (3-я часть раньше 1-й). Механизм однозначен: `scripts/rss-feed-normalizer.js:78` берёт дату из `data/search-manifest.json:658…`, страница — из своего `*PageHead.astro` (например `BaptistyRossiiDvaSezda1884PageHead.astro:28` = `2026-06-03`, манифест = `2026-06-18`); при равных датах сортировка вырождается в `localeCompare` (`:96`). |
| `APP-MASK-NO-WEBKIT-FALLBACK` | current defect (low) | `src/pages/app/index.astro:138` и `src/components/map/MapStyles.astro:255,451` отдают `mask-image` без `-webkit-mask-image`; в опубликованном `/_astro/index.FPviil9R.css` префиксной пары нет. Конвенция проекта обратная (`HomeMain.astro:103-104`, `css/home.css:606-607`, `css/floating-cluster.css:1285`). На WebKit < 15.4 маска игнорируется и декоративная сетка `body::before` перестаёт затухать — на лендинге Telegram Mini App, где доля старого iOS-WebKit максимальна. |

Claim boundary обеих строк: `cb3681e` + live. Preservation boundary: для `RSS-SERIES-DATE-COLLAPSE` менять **источник** дат, не editorial-значения (политика `data/editorial-metadata.json`: `editorial-time-is-not-build-time`, `technicalCommitsMayChangeEditorialDates: false`); для `APP-MASK-NO-WEBKIT-FALLBACK` правка аддитивная.

## 9. Уточнение границы закрытия `METADATA-SSOT-PROLIFERATION`

К полосе добавляется измеримый критерий, полученный в этом проходе: страница, `sitemap.xml`, `feed.xml` и `data/search-manifest.json` должны брать editorial-даты из одного источника, и в `data/editorial-metadata.json` должно остаться **0** записей со статусом `inconsistent-needs-review` (сейчас **43 из 43**; расхождение `sitemap lastmod` ↔ JSON-LD `dateModified` наблюдается на **40** маршрутах).

## 10. Итог для матрицы

| Действие | ID |
|---|---|
| retire (stale) | `MOBILE-CHROME-REGISTRY-GAPS` |
| retire (moot) | `MOBILECHROME-GENESIS6-BAR-DECISION` |
| retire (invalid as worded) | `SERIES-ORDER-INDEX-MISMATCH` |
| admit | `RSS-SERIES-DATE-COLLAPSE`, `APP-MASK-NO-WEBKIT-FALLBACK` |
| reword (no status change) | `SECURITY-CSP-INCONSISTENCY` (числа), `MISSING-BUTTON-TYPE` + `SITEWIDE-BTN-TYPE-AUDIT` (механизм), `METADATA-SSOT-PROLIFERATION` (граница закрытия) |
| corroborate, не переоткрывать | `SW-PWA-FRESHNESS` (принято сужение wave5 + live-witness), `ARTICLE-AUTHOR-HARDCODED` (уже снята `c55b5b5`) |
| retract own claim | «7 страниц без CSP» → фактически 0 (§0) |
| park в `WORK_QUEUE.md` | `GILL-SLUG-NUMBERING-LEGACY`, `PAGEFIND-STATIC-FRESHNESS-MEASUREMENT` |

Матрица после этой волны: **13** активных строк (7 defects + 0 improvements + 3 residuals + 3 system lanes + 0 owner decisions). Абсолютные числа в этом документе намеренно приводятся как дельты: за время прохода матрица правилась параллельно четыре раза.

## 11. Ограничения

- Без браузерного рантайма (Playwright/devtools) и без локальной сборки (`npm ci` не запускался): выводы уровня «упало в рантайме» и перф не покрыты.
- `APP-MASK-NO-WEBKIT-FALLBACK` доказан source+artifact; реального устройства iOS < 15.4 не было.
- Product не мутировался: правок в `FedorMilovanov/gb-is-my-strength` этим агентом не вносилось.
- Конкурирующие AuditRepo PR на момент записи: #331, #333, #324 редактируют `MASTER_BUG_MATRIX.md` от базы `f275112` (другая, 13-строчная линия матрицы, anchor Product `485db8c`). Пересечения по ID с §10 нет; если они будут смержены первыми, ре-база обязательна.
- Во время этого прохода `main` продвинулся коммитами `c55b5b5` и `98f6a3d` (волны wave4/wave5 другого агента), тоже правившими матрицу. Патч перебазирован на их результат вручную: снятая ими `ARTICLE-AUTHOR-HARDCODED` не возвращается, их формулировка `SW-PWA-FRESHNESS` сохраняется. Ни одна чужая правка этой волной не перетёрта.

## 12. Инцидент: потеря evidence и воскрешение снятых строк

Два процессных факта, зафиксированных по ходу этой волны (протокол §5 «append-only history» и §6 «conflict handling»):

1. **Перезапись чужого intake.** PR #339 переписал `incoming/arena-bugverifikator/2026-08-19/README.md` с 252 строк до 25: тело интейка из PR #336 (полный full-surface отчёт: находки `RSS-SERIES-DATE-COLLAPSE`, `APP-MASK-NO-WEBKIT-FALLBACK`, negative results, ссылки на `tools/`) было заменено индексом папки. Совпадение имени агента у двух параллельных проходов сделало коллизию незаметной. Содержимое восстановлено байт-в-байт из `935fe31` в отдельный файл `ARENA_FULL_SURFACE_PASS_2026-08-19.md`; `REPORT.md` второго прохода не тронут — сохранены оба пакета evidence.
2. **`main` был красным.** С коммита `d95b648` проверка `auditrepo-validate` падала: новый `README.md` не содержал ни одного identity-маркера, требуемого `scripts/validate_audit_repo.py`. Исправлено добавлением блока `## Identity` (проект, агент, дата, anchor, live-снимок, тип отчёта).
3. **Воскрешение снятых строк.** `MOBILE-CHROME-REGISTRY-GAPS` и `MOBILECHROME-GENESIS6-BAR-DECISION` были сняты волной `2026-08-19-b`, но снова появились в переписанной матрице `bb7bd81`, в сообщении которого о них нет ни слова. Нового witness в пользу их актуальности нет; live на `cb3681e` по-прежнему показывает `mobile-bottom-bar` на всех шести Genesis-6 статьях. Строки сняты повторно с явной пометкой в матрице — если у кого-то есть текущий witness обратного, строка возвращается вместе с ним.

Рекомендация процессу (не MASTER-строка): при параллельной работе давать intake-папкам уникальные имена агента/прохода (`<agent>-<pass>`), а не только дату, и никогда не переписывать тело чужого intake — индекс папки должен быть отдельным файлом.
