# Pastor card markup и mixed-script continuation — 2026-10-27

## Решение

На exact Product `21dcfdd9f9018607a708c5118383e287ec1a3fed` принят один новый прямой дефект: `GBS-PASTOR-SERIES-CARD-MARKUP-AX-LEAK`. Активная арифметика меняется **76→77** (`CURRENT DEFECTS` 46→47).

Отдельно расширен существующий `SYS-PUBLICATION-MIXED-SCRIPT-SURFACE-COVERAGE`: в текущем интерактивном Avraam-досье нативный путь открывает смешанный токен `hе` (Latin `h` + Cyrillic `е`). Нового ряда для него нет.

Product не изменён. Открытые Product PR не владеют `PastorSeriesCardsSection.astro` или копией Avraam `route.json`; #2203 касается соседнего `PastorSeriesPageChrome.astro`, но не карточек.

## Clean-head и build

Сначала ошибочно запущенный `npm run build` сообщил отсутствие script; это не Product red. Канонический `npm run strangler:build:production-like` затем прошёл: 104 Astro pages, 0 errors, 6 известных hints; postbuild heading hygiene и Pastor guards G-1…G-8 — PASS.

Изолированный запуск `pastor-series:guards:dist` сразу после одного `astro:build` был красным на Cyrillic heading IDs, потому что обязательный postbuild hygiene ещё не выполнялся. Канонический production-like chain снял этот промежуточный red; дефектом он не считается.

## 1. Карточка Part II публикует обломок разметки в AX

`src/components/pastor-series/PastorSeriesCardsSection.astro:69–74` содержит вложенный `<picture>` и после внутреннего закрытия буквальный хвост:

`decoding="async" loading="lazy" width="160" height="108" />`

Astro принимает источник и выпускает этот хвост как Text node ровно один раз в `/pastor-series/`. На экране thumbnail-контейнер обрезает его через `overflow:hidden`; это не основание считать узел безвредным:

- `document.body.innerText` содержит хвост;
- полный CDP AX tree содержит отдельный `StaticText` в 4/4 профилях;
- accessible name ссылки Part II включает alt, технический хвост и нормальный текст карточки;
- desktop/mobile × Light/Dark дают один и тот же результат;
- нативный mobile click самой ссылки всё же делает target-document request и открывает правильные title/H1 — navigation owner исправен.

Это один локальный source owner, а не расширение label-in-name или navigation rows. Дефект — invalid card markup и технический мусор в имени ссылки для AT.

### Health

После полного production-like copy:

- broken images: 0 в 4/4;
- page errors: 0;
- Axe WCAG A/AA: 0 нарушений в 4/4 — Axe не проверяет смысловое загрязнение имени;
- LCP: 196–264 ms; CLS: 0–0.023458;
- единственный console error — заблокированный `mc.yandex.ru`, явно отфильтрованный как sandbox egress;
- Light/Dark, 1440×900 и 390×844 `isMobile/hasTouch`, `reducedMotion: reduce` покрыты targeted PNG вне Git.

### Closure

Убрать второй `<picture>` и буквальный хвост в source component. После rebuild карточка должна иметь один валидный `<picture>`, один image, 0 технического текста в DOM/AX/имени ссылки. Сохранить artwork, geometry, lazy image, native click destination и добавить source/final negative fixture.

## 2. Mixed-script extension без дубликата

Unicode-adjacency review источников нашёл несколько подозрительных токенов. Публикационный current witness подтверждён для Avraam:

1. нативный click «Начать изучение»;
2. нативный click SVG-кнопки `Открыть досье: Харран`;
3. нативный click tab «Иврит»;
4. видимый текст: `имя брата Аврама … (с hе) — другое слово`;
5. `hе` состоит из U+0068 Latin `h` и U+0435 Cyrillic `е`, rect 356×141.84 px в открытом panel.

Это тот же root cause, что `Чекy` и `academическую`: публикационные JSON/dynamic surfaces обходят эффективный mixed-script gate. Поэтому расширяется только `SYS-PUBLICATION-MIXED-SCRIPT-SURFACE-COVERAGE`.

Дополнительно в source-review queue оставлены `conformировавшийся`, `conformироваться`, `Кенyon`, `библейскому叙述у`, `rebuilding`, `Газa`, `началo`, `Tелль`. Они находятся в registry-only, withheld или legacy источниках и **не объявлены текущими опубликованными дефектами** без projection witness. Их следует использовать как fixtures/triage при закрытии системного owner, а не плодить строки.

## Gate gap

Все применимые текущие проверки пропускают карточный AX-мусор:

- `pastor-series:visual-parity:audit`: PASS;
- Pastor G-1…G-8 после canonical build: PASS;
- `article:qa`: 174 files, 0 errors/warnings;
- `readable-audit`: PASS;
- Axe 4/4: 0.

Нужен узкий structural final-output guard: invalid nested media markup и технические attribute fragments не должны становиться Text/AX nodes. Это closure fixture прямой строки, не новый system lane на текущем доказательстве.

## Evidence

`evidence/2026-10-27-pastor-card-markup-mixed-script.jsonl` — 8 компактных JSONL строк, screenshots/raw вне Git.
