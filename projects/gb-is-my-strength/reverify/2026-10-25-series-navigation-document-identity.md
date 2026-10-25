# GBS: cross-document series navigation changes URL without changing document

Date: 2026-10-25  
Product authority: `FedorMilovanov/gb-is-my-strength@948ecff03189613180cce73731ce072ccc2ae3ed`  
Production target: `https://gospod-bog.ru`  
Disposition: **NEW SYSTEM DEFECT / PRODUCT NOT MUTATED**

## Русский итог

Жалоба владельца воспроизведена именно в «ГОСПОДЬ БОГ СИЛА МОЯ». Нативная активация римского пункта серии, мобильного списка частей или нижней карточки «Дальше/Назад» меняет адрес и добавляет запись history, но не загружает следующий документ. На экране остаются прежние H1 и текст. Это один общий дефект жизненного цикла TTS/Navigation API, а не сотни ошибок ссылок и не проблема данных конкретной серии.

## Чистая исходная точка

Перед браузером прочитаны Product `AGENTS.md`, `AGENTS-REFERENCE.md`, `docs/WORK_MODES.md`, series/reader contracts, registry и открытые Product owners. На чистом HEAD:

- `npm ci`: PASS; один pre-existing moderate advisory, dependency не менялась;
- `npm run series:facade:guard`: PASS;
- `npm run gill:series:data:consistency:audit`: PASS;
- `npm run owner:ui-guard`: PASS;
- `npm run strangler:build:production-like`: PASS; Astro check: 0 errors, 0 warnings, 6 hints; 104 pages built;
- source TTS lifecycle contract: PASS;
- production browser TTS lifecycle contract, запущенный тем же кодом на Chromium 153 fallback: PASS — и именно это false-green ниже.

Pre-existing build warnings про Shiki `greek`, Rolldown directives и один unresolved image reference не связаны с навигацией и не исправлялись.

## Нативная матрица

Production-like `dist` обслуживался по HTTP. Chromium `153.0.8010.0`; каждый кейс начинался с нового `Page`, без Service Worker. Проверялись URL, H1, fingerprint тела, history, реальный navigation request и геометрия существующего документа.

Охват: все **63** опубликованных reader/series routes, на которых собран общий Gill/Series chrome.

| Поверхность | Ввод | Кейсы | Результат |
|---|---:|---:|---:|
| desktop series rail (`.gbs-rail-card`) | pointer | 340 | 0 PASS / 340 FAIL |
| desktop series rail | keyboard Enter | 63 | 0 / 63 |
| bottom previous/next (`.gbs2-next-card`) | pointer | 60 | 0 / 60 |
| bottom previous/next | touch | 60 | 0 / 60 |
| bottom previous/next | keyboard Enter | 60 | 0 / 60 |
| mobile part/book overlay | touch | 126 | 0 / 126 |
| mobile part/book overlay | keyboard Enter | 63 | 0 / 63 |
| **Итого** |  | **772** | **0 PASS / 772 FAIL** |

Во всех **772/772** случаях:

1. адрес стал адресом выбранной части;
2. `history.length` вырос на 1;
3. H1 и fingerprint тела остались от исходной страницы;
4. браузер не отправил ни одного document navigation request к целевому route;
5. Back вернул исходный URL, Forward снова вернул целевой URL, но документ оставался исходным.

Прямой пример Gill I → II:

- до: `/articles/dzhon-gill-chast-1-chelovek/`, H1 «…Часть I: Человек»;
- после нативного rail click / bottom click / mobile overlay tap: `/articles/dzhon-gill-chast-2-uchenyi/`;
- после settle H1 всё ещё «…Часть I: Человек»; тело части I; target-document request отсутствует.

Это объясняет наблюдение «выбрал II/III, а остался прежний текст» точнее, чем проверка `href`: адрес выглядит успешным, но документ не сменился.

## Root cause

`src/runtime/reader-tts-lifecycle.js` подписывается на `window.navigation.navigate`. Для любой cross-document навигации он вызывает:

```js
event.intercept({ handler: retireForDocumentNavigation });
```

`Navigation API` interception превращает переход в управляемую same-document навигацию. Handler только отключает TTS-клиент; он не получает и не рендерит целевой документ. В результате браузер коммитит URL/history, а текущий DOM остаётся на месте.

Это не дефект `seriesConfig`, `heartSeriesData`, `GillSeriesRail`, `GillPartTocOverlay` или нижних карточек: их `href` и порядок корректны. Один global lifecycle owner ломает любой обычный same-origin cross-document anchor на этих reader pages.

## False-green QA

### `tts-sharedworker-client-lifecycle-browser-test.js`

Текущий browser contract проходит при сломанном поведении. Его `clickAway()` ждёт `page.waitForNavigation()` и клик. Same-document URL commit удовлетворяет ожидание. Fixture возвращает один и тот же HTML для `/departing` и `/departed`, а тест ни разу не утверждает destination H1/body identity или наличие document request. Затем он проверяет только retirement/reconnect SharedWorker. Получается зелёная проверка именно того lifecycle owner, который подавил документную навигацию.

### Series guards

`series-reader-facade-regression-test.js` подтверждает imports, config, markup и fragment targets. Gill consistency guard подтверждает routes/data/order. Ни один не выполняет нативную cross-document активацию с проверкой destination document identity. Поэтому валидный `href`, URL и fragment audit дают ложное ощущение исправности.

Closure boundary должна включать отрицательный fixture с разными H1/body на source/destination и требовать одновременно: destination document request/commit, URL, H1/body identity, history Back/Forward, TTS retirement и отсутствие stale DOM. Нужны pointer/touch/Enter на rail, mobile overlay и bottom neighbors; проверка только URL запрещена.

## Кольцо и «таймер»

Круглые индикаторы возле серии не владеют автоматическим переходом:

- desktop `#gbs2Pct` — накопительный прогресс серии;
- mobile `#gbs2DualProgress[role="img"]` — read-only двойной scroll progress статьи/серии;
- у индикатора нет activation handler и нет countdown navigation owner.

На Gill I значение изменилось с серии 12% / статьи 0% наверху до серии 25% / статьи 100% в конце и не изменилось за последующие 3 секунды без скролла. Это scroll/read progress, а не таймер. Нижние карточки — обычные anchors и существуют; они ломаются по той же Navigation API причине.

## Качество и границы

Два репрезентативных профиля после production-like build:

- desktop 1440×1000, dark-first, normal motion: LCP 788 ms, CLS 0.018224, Axe 0 violations, page errors 0, broken images 0;
- mobile 390×844, isMobile+touch, light-first, reduced motion: LCP 452 ms, CLS 0.161926, Axe 1 serious `scrollable-region-focusable`, page errors 0, broken images 0.

Единственная console/request ошибка в обоих профилях — недоступный `https://mc.yandex.ru/...` (`ERR_CONNECTION_CLOSED`), то есть sandbox delivery boundary, не Product finding. Mobile Axe/CLS сигналы не включены в новую navigation строку: collapsed/focus и иные UI owners уже представлены в MASTER, а этот проход не устанавливал для CLS отдельную причинность.

Скриншоты desktop/mobile stale-state проверены вне Git; PNG не коммитились.

## Collision / repair lane

Открытые Product PR:

- #2192 касается print lane и также меняет `GillSeriesRail.astro`/`GillPartTocOverlay.astro`, но не root `reader-tts-lifecycle.js` и не lifecycle browser contract;
- #2179 владеет широким Actions update;
- #2164 и #2143 — content/data.

Исправлять сотни ссылок или конкурировать с #2192 в Gill markup нельзя. Узкая будущая Product lane: `src/runtime/reader-tts-lifecycle.js` + `scripts/tts-sharedworker-client-lifecycle-browser-test.js` и, при необходимости, точечный cross-document series contract. Product в этой волне не менялся; merge/close не выполнялись.

## Evidence

Compact round-trip JSONL (399 records, every line ≤551 chars):

- `evidence/2026-10-25-series-navigation-current-main.jsonl`

Он содержит authority/aggregate, каждую route×surface×input группу, visual/performance controls и false-green classification. Raw PNG, dependencies, build and verbose harness logs остались вне Git.
