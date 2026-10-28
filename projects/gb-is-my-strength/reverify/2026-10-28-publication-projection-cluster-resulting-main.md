# Большая волна 5/16–20 — публикационные проекции на resulting main

**Дата:** 2026-10-28  
**Product anchor:** `cdf994b104d7b5eaeef407bf60e341e436efe1df`  
**Объём:** TTS consumer, SpeakableSpecification, общие `<head>`-ресурсы, редакционная датировка, FAQ JSON-LD  
**Вердикт:** один system lane закрыт, четыре сохранены и сужены по свежему evidence

## 1. Чистота якоря и ownership

- Локальный Product checkout до и после проверки чист.
- `origin/main` и audited checkout остаются на `cdf994b…`.
- Единственный открытый Product PR — docs-only #2208; runtime/source owners этой волны он не затрагивает.
- Проверялась production-like `dist` именно этого commit, без изменения Product.

## 2. Метод

Использованы одновременно:

1. source census по 576 Astro-компонентам и runtime owners;
2. parse5-census всех финальных `SpeakableSpecification`;
3. Chromium 153 на локальном read-only `dist` с native click для TTS;
4. подмена только платформенного `SpeechSynthesis` sink для регистрации реально отправленных `SpeechSynthesisUtterance`, без вызова внутренних extractors;
5. browser parity DOM ↔ JSON-LD для всех четырёх FAQ routes;
6. browser census девяти спорных dateline routes и двух положительных controls;
7. статический и браузерный census общих head carriers;
8. Product `npm run validate` и узкие owner tests.

Временные PNG, браузерные логи и harness-файлы в Git не добавлялись.

## 3. `SYS-READER-PROJECTION-CONSUMER-BYPASS` — `FIXED-CURRENT`

### 3.1 Source contract

`reader-tts.js::collectParts()` теперь сначала вызывает `window.GBReaderProjection.getTtsSegments(document)`, а TTS выполняет только speech chunking. Старый extractor оставлен как явно ограниченный fallback, когда projection отсутствует или не дала ни одного сегмента. Второго state machine на projection-owned route больше нет.

### 3.2 Реальные отправленные utterances

Native click по видимой `[data-fc-action="play"]` был выполнен на четырёх нетронутых production routes. Fake sink регистрировал только то, что production runtime передал в `speechSynthesis.speak()`; сам `GBReaderTTS.play()` и внутренние extractor-функции напрямую не вызывались.

| Route | Projection segments | Utterances | Canonical text | Page errors |
|---|---:|---:|---|---:|
| Hermenevtika | 114 | 175 | exact | 0 |
| Gill I | 100 | 107 | exact | 0 |
| ordinary heart article | 77 | 95 | exact после нормализации границы chunk перед `)` | 0 |
| Nagornaya II | 103 | 109 | exact | 0 |

На heart route четыре добавленных пробела находятся только на границах sentence chunks перед закрывающей скобкой (`…человеке. )`); порядок и символы канонического текста не меняются. Это TTS-only chunk formatting, не возврат независимого DOM extraction. На всех четырёх routes отправленный корпус не имеет текста вне `getTtsSegments()`; прежние endnote/accuracy/related-card extras не возвращаются. Первые и последние отправленные utterances зафиксированы в machine evidence, итоговая фаза — `complete`.

### 3.3 Guard boundary

Текущий permanent browser contract уже содержит explicit include/exclude bridge, проверяет production TTS owner и фактические utterances. Его стандартный запуск в этом checkout не стартует только потому, что локальный Playwright ожидает отсутствующий cached executable; обязательное Chromium evidence получено внешним harness через `@sparticuz/chromium`, без browser skip.

**Решение:** acceptance выполнен; lane удаляется из активной матрицы. Systems `22→21`, total `75→74`.

## 4. `SYS-READER-PROJECTION-SPEAKABLE-AUTHORITY-OVERWRITE` — улучшен, но не закрыт

Полный census снова нашёл **42** валидных speakable-schema routes: **40** с ReaderProjection и два no-runtime controls (`/pastor-series/`, `/hard-texts/`). Blanket overwrite устранён:

- Antisovetov сохраняет `.series-overview` и `[data-speakable]`, удаляя только zero-match `.article-lead`;
- Diotrophes сохраняет `#pastoral-conclusion`, удаляя `.summary-card`, все matches которой находятся вне reader root;
- ни один из двух routes больше не получает чужой generic selector list.

Но буквальный closure contract «emitted selector targets = canonical in-scope nodes» ещё не выполнен. Только **35/40** runtime routes дают document-wide target equality. На Gill I, Gill II, Hermenevtika, Kod da Vinci и Krajne generic `.summary-card` также выбирает по одному outside-root aside: schema selector видит на один узел больше, чем `getSpeakableNodes()`.

Текущий permanent check называет это parity, но проверяет лишь, что selector canonical/route-authored и покрывает API nodes; лишние document-wide targets он не запрещает. Поэтому прежнее silent replacement исправлено, а оставшийся global-selector/root-scope разрыв остаётся в том же lane.

## 5. `SYS-HEAD-ASSET-PROJECTION-PROLIFERATION` — остаётся

Свежий source census:

- 576 Astro files;
- **81 files / 493** hardcoded `?v=<hash>` literals;
- `assetUrl()` — только **15 source files / 63 calls**;
- **70 Astro files / 171** production-origin common-resource references.

Финальный `dist` содержит 105 HTML routes; hardcoded revisions присутствуют на 105/105 (**1789** occurrences), production-origin common-resource references — на 103/105 (**221** occurrences). Это не соответствует closure «нет governed hash literals / production-pinned common resources в Astro source».

Положительное сужение: на `/about/` и Krajne icon/apple-touch carriers уже разрешаются в preview origin. Но `feed.xml` и `manifest.json` остаются абсолютными `https://gospod-bog.ru/...`; browser DOM на обоих controls подтверждает production-pinned manifest. Общего authority-aware projection owner по-прежнему нет.

## 6. `SYS-EDITORIAL-DATELINE-SLOT-SEMANTICS` — без закрывающего изменения

Source owner всё ещё определяет event identity по `.article-updated`/`.article-byline` и переписывает только `datetime`; explicit publication/modified slot identity и authority видимой подписи не введены.

### 6.1 Девять residual routes

- 4 Baptist bylines показывают `13 июня 2026`, но publication `datetime` равны 6, 7, 8 и 9 июня соответственно.
- 5 Nagornaya slots подписаны `Опубликовано: 1 мая 2026`, но `datetime` равен approved modified instant (5 или 22 июля), а JSON-LD `datePublished` остаётся `2026-04-30T21:00:00.000Z`.

Итого residual воспроизведён **9/9**.

### 6.2 Controls

- Baptist Peterburg имеет два явных события: публикация 4 июня и обновление 20 августа; оба label/datetime совпадают с JSON-LD event.
- Kod сохраняет owner-approved различие visible modified label `9 мая 2026` и exact modified instant `2026-07-05T09:14:15.000Z`; это не переобъявляется дефектом.

## 7. `SYS-FAQ-STRUCTURED-DATA-ANSWER-PARITY` — 9/21 → 20/21

Browser сравнил crawler-visible `acceptedAnswer.text` с соответствующим `.faq-accordion__body-inner`, используя rendered `innerText`: tooltip payloads не входят, inline punctuation и scripture-button text сохраняются.

| Route | Exact |
|---|---:|
| Hermenevtika | 3/3 |
| Kod da Vinci | 8/8 |
| Krajne | 3/3 |
| Antisovetov | 6/7 |
| **Итого** | **20/21** |

Единственный residual — Antisovetov Q1. Schema пишет `Практический тест:` и заканчивает вопросом о зависимости от пасторского одобрения. Visible answer пишет `Практический тест такой:` и добавляет отсутствующее в schema заключительное предложение о внешних признаках: возможности задавать вопросы, полноценном членстве несогласного брата и решении совета не по воле одного лидера.

Следовательно, прежние 11 typography/serializer drifts исправлены, но typed single owner либо exact-answer admission gate всё ещё отсутствует. Зелёный `faq-jsonld-text-contract-test` остаётся недостаточным: он не ловит этот реальный omitted-sentence drift.

## 8. Gates

- `npm run validate` — PASS, «Всё чисто».
- `node scripts/faq-jsonld-text-contract-test.js` — PASS.
- `node scripts/editorial-metadata-v3-approval-gate-test.js` — PASS.
- `reader-projection-browser-contract.mjs` стандартным launcher не стартовал из-за отсутствующего cached Playwright Chromium; это delivery/tooling gap, не Product finding. Эквивалентные и более широкие Chromium checks этой волны завершены обязательно.
- Product checkout после проверок чист; dependency/workflow файлы не менялись.

## 9. Итог волны

**Большая волна 5/16–20 завершена.**

- Закрыт `SYS-READER-PROJECTION-CONSUMER-BYPASS`.
- Speakable lane сужен до пяти outside-root global-selector mismatches.
- FAQ lane сужен до одного ответа Antisovetov.
- Head projection и dateline slot semantics подтверждены текущими source/browser census.
- Новых строк и дублей не создано.
- Новая арифметика: **44 direct + 8 improvements + 1 residual + 21 systems = 74 active work units**.
