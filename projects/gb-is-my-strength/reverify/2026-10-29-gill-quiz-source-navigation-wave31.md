# Broad wave 31 — нативная навигация quiz → источник в Gill learning sheet

Дата: 2026-10-29  
Product PR: #2217, exact head `36066273b6e06f0c156a31531cf551ebfce98bf5`  
Current-main control: `54877be73a590b1e29f4d701724b39ed41c17e14`

## Охват и метод

Проверен не только `href`, а полный читательский результат: открыть мобильную «Справку» нативным pointer click, перейти в «Тест», выбрать уверенность и ответ, нативно нажать появившуюся ссылку источника, затем измерить URL/hash, состояние modal sheet, scroll lock, геометрию цели и `elementFromPoint`. Профиль: Chromium, 390×844, `isMobile:true`, `hasTouch:true`, Dark, reduced-motion по умолчанию. Перед прогоном выполнен свежий `npm run strangler:build:production-like` — exit 0. Проверены пять новых маршрутов #2217 и шесть неизменённых Gill-маршрутов текущего main.

Отдельный контроль после ручного закрытия sheet проверил, не происходит ли отложенный переход. Axe запускался уже после source click. Скриншот и JSONL остались вне Git. Случайный `net::ERR_CONNECTION_CLOSED` — известный внешний egress-шум; uncaught page errors на пяти маршрутах #2217 равны нулю.

## Результат: ссылка меняет hash, но не приводит читателя к источнику

На всех пяти новых статьях:

- нативный click действительно меняет `location.hash` на существующий source anchor;
- learning sheet остаётся открыт: `aria-hidden="false"`, `.is-open=true`;
- `body` остаётся с `overflow:hidden`;
- цель находится на 3 200–11 517 px ниже viewport, `targetInViewport=false`, `hitInside=false`;
- Axe после действия — 0 violations, console/page errors продукта — 0/0.

То есть URL формально изменён, но читатель по-прежнему видит тест, а не подтверждающий фрагмент. Это именно различие «навигация произошла» и «источник реально показан».

После отдельного нажатия X дефект не самовосстанавливается: sheet закрывается, `scrollY` возвращается к 0, а цель остаётся на 12 016 px (`targetInViewport=false`). Ссылка поэтому не требует просто «ещё одного закрытия»: переход визуально потерян.

## Current-main контроль и происхождение

Тот же нативный сценарий воспроизведён на всех шести существующих маршрутах Джона Гилла, чьи route/component/config/data не отличаются между current main и PR head:

- 6/6 source targets существуют, hash меняется, но итоговая цель вне viewport и не hit-tested;
- на 5/6 sheet остаётся открытым и сохраняет scroll lock;
- на части II sheet закрывается, но target всё равно остаётся вне viewport — формальная смена состояния не исправляет читательский результат.

`GillLearningSheet.astro` содержит отдельный `jumpTo()` для outline/search links: он сначала закрывает sheet, затем вызывает `scrollIntoView()`. Но `#glsQuizSource`, добавленный в августе 2026 года, не получает такого обработчика. Постоянного browser-контракта на source click нет: `article-quiz-native-parity-test.mjs` проверяет только score/explanation semantics, а не modal → article handoff.

Это не слабость автора пяти статей: их 30 `sourceHref` валидны и anchors существуют. Новая серия лишь активировала существующую shared-component ошибку на пяти дополнительных страницах. Класс причины: общий interaction owner + отсутствие проверки конечного rendered outcome.

## Классификация

Новый direct defect: `GBS-GILL-QUIZ-SOURCE-LINK-MOBILE-NOOP`.

Это один общий дефект, а не 11 ошибок по маршрутам. Matrix: 27→28 direct defects; общий active total 54→55. Он не поглощает wave-30 referential-integrity finding: там источник может быть невалидным ещё до публикации; здесь валидный источник существует, но runtime не доставляет к нему читателя.

## Граница исправления

Нужен один shared handler для quiz-source handoff, который:

1. корректно разбирает full route + fragment, а не передаёт полный URL в `querySelector()`;
2. для same-document source закрывает modal, снимает scroll lock, обновляет hash и только затем реально размещает target в viewport;
3. для cross-document source выполняет обычную навигацию;
4. сохраняет reduced-motion policy и даёт читателю устойчивую идентичность цели/focus;
5. имеет нативный mobile browser contract минимум для первой/средней/последней Gill-страницы и для generic-series adapter: source link видим после answer, click без `force`, sheet закрыт, body разблокирован, URL и page identity верны, target существует, находится в viewport и выигрывает hit-test;
6. имеет negative fixture для отсутствующего fragment вместо молчаливого hash-only успеха.

Не требуется чинить 11 страниц по отдельности или добавлять timing-only задержку. Product не изменялся и комментарии в #2217 не оставлялись из-за active-owner collision.
