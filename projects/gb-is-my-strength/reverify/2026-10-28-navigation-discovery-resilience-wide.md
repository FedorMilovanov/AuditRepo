# Широкая волна 15: навигация, discovery, журнальные ссылки и graceful fallback

Дата: **2026-10-28**  
Product: exact `1a67c65cf2a30b06200480b7245abab873447a47` = `origin/main`; дерево чистое.  
Open owner: Product PR #2215 публикует отдельный Hard Texts материал и не владеет проверенными teen/home/journal/mobile-chrome/Nagornaya/sitemap/3D owners.  
Машинный receipt: `evidence/2026-10-28-navigation-discovery-resilience-wide.jsonl`.

## Итог

Пять прямых строк оказались исправлены на current main и закрыты:

- `GBS-TEEN-SERIES-CORE-STEP-PROGRESS`;
- `GBS-MOBILE-CHROME-NAVBAR-SYNC-LAG`;
- `GBS-HOME-OFFER-FROZEN`;
- `GBS-3D-NO-WEBGL-FALLBACK`;
- `GBS-SITEMAP-LASTMOD-UNOWNED`.

Три boundaries сохранены:

- `GBS-HOME-SEARCH-FOCUS-RESTORE` — mobile actual opener по-прежнему теряется;
- `GBS-JOURNAL-READER-SOURCE-LOCATORS-MISSING` — G3 исправлен, Diotrophes остаётся без ссылок;
- `GBS-NAGORNAYA-MENU-ICON-MISSING-FORCED-COLORS` — эмуляция зелёная, но физического Windows HCM witness нет.

Арифметика: **59 → 54 active**, direct **33 → 28**; `54 = 28 + 7 + 1 + 18`.

## 1. Teen series: реальный прогресс и последовательность закрыты

Проверены семь материалов × 390/1280 × Light/Dark = **28 профилей**. В каждом header/rail показывает точное `Шаг N из 7`, а подписи сохраняют последовательность `I → II → III → A → B → C → D`.

Отдельный desktop native flow без forced click прошёл все шесть переходов. После каждого click сверены URL и identity целевой статьи; не было ни одного перехода только по формально правильному `href`.

Release contract подтвердил восемь маршрутов, canonical MDX ownership и порядок I–D. На 28 health-профилях: broken images/page errors/console errors/overflow 0, LCP 188–328 ms, CLS ≤0.0242. Axe: 21/28 без нарушений; семь `color-contrast` совпадают с уже существующим aggregate contrast owner и не опровергают progress/navigation closure.

## 2. MobileChrome: состояние после одного жеста закрыто

Проверены `/articles/`, `/biografii/`, `/hard-texts/` × Light/Dark на настоящем mobile context 390×844.

После одного `wheel(0,420)` во всех 6/6 профилях одновременно получены `#hNavbar.nav-hidden` и `#mobileChromePage.is-shown`. Реальный `header.mcp-top` занимает 390×53px у верхней границы viewport; targets Back/Home/Search имеют соответственно 38×38, 38×38 и 282×38px. После одного обратного жеста обе стороны синхронно возвращаются в false, без промежуточного рассогласования.

Операбельность проверена нативно: Search открыл palette и передал focus в `.cp-input` 6/6; Home перешёл на `/` 3/3; Back перешёл на `/` 3/3. Axe/broken images/page errors/console errors/overflow 0, LCP 120–144 ms, CLS 0. Старый wrapper с zero-height не использован как painted proof: измерялся именно фиксированный header и его controls.

## 3. Home publications: frozen offer закрыт

Manifest-derived top five на exact main сопоставлены с rendered shelf при 390/1280 × Light/Dark: **4/4 точных набора и порядка**. Каждый из пяти cards затем открыт native click; URL и article identity совпали 5/5.

Это исключает прежний frozen hand-authored subset, а не только подтверждает наличие карточек. Representative screenshots сохранены вне Git. Axe/broken images/page errors/console errors/overflow 0, LCP 156–344 ms, CLS ≤0.0080. Home parity/component contracts зелёные.

## 4. Home search: mobile focus owner остаётся неправильным

После открытия поиска именно через `#heroSearchBar`, Escape и задержанного наблюдения desktop возвращает focus точному opener **30/30**. Mobile возвращает focus на `#hMobileMenuBtn`, а не на clicked `#heroSearchBar`, **30/30**.

Строка остаётся прямой и узкой: проблема не в открытии palette и не в desktop path, а в сохранении actual opener identity на mobile.

## 5. Journal: G3 исправлен, Diotrophes остаётся

G3 теперь имеет **33/33** linked reference blocks, 21 bibliography target, 0 broken local targets; все 21 resolver URLs внешне разрешимы.

На Diotrophes во всех 390/1280 × Light/Dark остаются **56** `.source-ref` и **0** reader-operable links. Поэтому строка не закрыта, а сужена до Diotrophes; старое обобщение на G3 удалено.

## 6. 3D no-WebGL: meaningful fallback закрыт

Chromium запущен с `--disable-webgl --disable-gpu`; проверены 390/1440 × Light/Dark. Во всех 4/4 профилях виден единственный meaningful static fallback, `canvas=0`, iframe после preflight сброшен на `about:blank`, main landmark сохранён.

Network proof уточняет границу: запрос 2,245,873-byte `_app/index.html` успевает получить HTTP headers, затем завершается `net::ERR_ABORTED`; события `requestfinished` нет. То есть большой application document не загружается до конца и не активируется. Axe/broken images/page errors/console errors/overflow 0, LCP 68–80 ms, CLS 0.

`konfessii-map-audit.js` source assertions зелёные, но его собственный временный browser server дал pre-existing красный результат: desktop root-relative font/site-utils 404 и mobile wrapper 404, 25 failures. Это не скрыто и не объявлено PASS. Прямой exact-dist Chromium на уже работающем сервере прошёл все четыре no-WebGL профиля; audit harness не менялся.

## 7. Sitemap canonical ownership закрыт

`node scripts/sitemap-policy-normalizer.js --check` подтвердил: каждый canonically eligible route присутствует с canonical `lastmod`, eligibility `POLICY_INCLUDE_AND_PRODUCTION_AND_MANIFEST_AND_VALID_DATE`, skipped diagnostics `none`.

`node scripts/sitemap-route-contract-test.js` отдельно прошёл на 95 indexable registry routes, включая семь Genesis routes и запрет Astro-only mutation `/app/`. Таким образом, ручной authoritative drift больше не является current-main состоянием.

## 8. Nagornaya forced colors: эмуляция не заменяет physical HCM

Исправлен сам detector: реальный state owner — видимый `#mobileMenu` размером 390×844, а не отсутствующий generic `.mobile-nav`. В forced-colors emulation восемь маршрутов × Light/Dark = 16/16 открыли меню native click и 16/16 вернули focus точному `#menuBtn` по Escape; системные border/bar colors также сохранены.

Строка остаётся `FIXED-CANDIDATE`: требуемый физический Windows High Contrast witness в Linux sandbox недоступен. Эмуляция не выдана за закрытие.

## 9. Контракты и ограничения

PASS:

- `teen-series-release-contract.mjs`;
- `sitemap-route-contract-test.js`;
- `sitemap-policy-normalizer.js --check`;
- `home-visual-parity-audit.js`;
- `astro-home-pilot-audit.js`;
- `home-component-lab-contract-test.mjs`.

RED и сохранён как red: `konfessii-map-audit.js` — 25 browser-harness failures, описанные выше; source section прошла. WebKit: `skipped: sandbox engine`. Chromium evidence обязательно и получено.

## Решение

Широкая волна **15** завершена. Пять stale direct rows удалены только после exact-main source, painted, native-navigation и health evidence. Три реальные границы сохранены и сужены без дублирования. Product не изменялся, PR #2215 не пересекался, новый Product PR не создавался.
